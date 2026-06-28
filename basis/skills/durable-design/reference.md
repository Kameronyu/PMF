# Durable Design — reference (mechanisms inlined)

Everything needed to apply a rule is here. The sources list at the end is provenance only — you never need to open a URL.

## Contents
- Harden-or-not matrix (the step-1 gate)
- Declarative over imperative (the reframe)
- The frozen-step template: Precondition → Action → Verify → Rollback
- Preflight recipe
- Golden output + canary
- Drift signals (what to watch)
- The 3-tier fallback ladder
- Maintenance & recompile
- Validator (`scripts/check_design.py`)
- Worked example (gated)
- Relationship to the rest of the suite
- Sources (provenance only)

---

## Harden-or-not matrix
Hardening trades adaptability for determinism. It pays off **only** when the task is run often, against a stable surface, with low input variance. Score the task on three axes, then read the verdict.

| Run frequency | Interface stability | Input variance | `harden_verdict` (echo verbatim) |
|---|---|---|---|
| High | High | Low | `FULL_HARDEN` — pre-compile, pin, assert |
| High | Low (UI/API churns) | Low | `HARDEN_PLUS_HEALING` — self-healing + drift detection; budget for maintenance |
| High | High | High | `HYBRID` — freeze control flow, keep adaptive joints at the variable inputs |
| High | High | High + high-risk | `HYBRID` + heavy verification — never trust a single trajectory |
| Low | Any | Any | `STAY_AGENTIC` — re-discovery cost < hardening + maintenance cost |

Two gates before you author anything:
- **Rule of Three** — do the task ~3 times the same way before freezing it, or you harden incidental discoveries as if they were invariants.
- **Cost inequality** — `(time saved/run × frequency × horizon) > (build + recurring maintenance)`. The missed term is *maintenance*: the real cost is re-hardening every time the surface moves, not the initial build.

## Declarative over imperative (the reframe)
A frozen, ordered step-list **is** an imperative script: its blast radius grows with length, it assumes a fixed starting state, and one drifted step fails the whole replay. Infrastructure-as-code migrated *away* from this for durability. Steal its three mechanisms:
- **Idempotency** — running a step again yields the same state and **no-ops when already satisfied** (a verbatim replay blindly re-does actions).
- **Desired-state reconciliation** — encode *target state + checks*, let the fresh session reconcile from wherever it actually is, instead of "do step 1…N" from an assumed start. This tolerates a changed starting world.
- **Drift detection** — ship the assumptions as explicit checks so the session can detect "the world moved" before trusting stale steps.

> Reframe the design from "here are the exact steps" to "here is the target state, the checks that confirm it, and code for the genuinely stable parts."

## The frozen-step template: Precondition → Action → Verify → Rollback
Every FROZEN step has four parts; a naked action (action only) is the brittle form.
- **Precondition** — a check that gates the action; if it fails, the step refuses rather than acting blindly.
- **Action** — the deterministic operation, bound to a stable interface (API/CLI/file), idempotent, side-effects carrying an idempotency key.
- **Verify** — confirm success by outcome (metric/log/health-check/returned value), not by "the call returned."
- **Rollback** — how to safely undo, designed *before* the action and reachable on failure.

## Preflight recipe
The single most important safeguard: a fresh session must confirm reality matches the design's assumptions **before** executing.
- Turn each entry in *Assumptions & dependencies* into an assertion: required endpoints reachable, files/paths present, key state matches what the original run saw, expected UI anchors exist.
- For any API the design touches, add a **schema/contract check** (field names, types, required fields, status codes) — catches interface drift before it corrupts a run.
- Make it **one command/sequence** with a clear pass/fail. On fail: **refuse and name the broken assumption.** A preflight that can't fail is theater.

## Golden output + canary
- **Golden output** — store the correct output from the original run. A replay **diffs against it** (a smoke check) so it catches the silent "clean-looking but incomplete" failure that completion-only checks miss.
- **Canary** — run the design on **one low-stakes case first**, compare to golden, then scale. A "smoke check" blocks obviously-broken; the "canary" blocks subtly-broken.
- Assert on the **trajectory**, not just the final message: tool count, total/unique steps, latency. Final-output monitoring makes an agent look more reliable than full trajectory evaluation reveals.

## Drift signals (what to watch)
Drift produces **no error code** — it degrades quietly. The early warnings, cheapest first:
- **Path-feature deviation** — a replay that suddenly takes a different number of steps/tools than the golden trajectory. Strongest cheap signal; a one-class detector trained only on normal runs catches most of it.
- **Preflight/schema failure** — an assumption or contract no longer holds.
- **Golden-output diff** — the result drifted even though the run "succeeded."
- **Silent tool failure / cycles** — an API rate-limits or fails and the agent loops without noticing.
When a signal fires, regenerate the **affected segment** (DSPy-style recompile-the-changed-part), not the whole design.

## The 3-tier fallback ladder
Not a frozen monolith — a graceful descent:
1. **Tier 1 — frozen step.** Execute; retry idempotently on transient failure (circuit-break a flapping dependency).
2. **Tier 2 — re-explore the joint.** On failure, drop *just that sub-task* back into live agent exploration, guided by the carried rationale. This is the "lossless return path to exploration" — the reason the rationale is captured in step 2 of the workflow.
3. **Tier 3 — escalate to a human.** On continued failure or **destructive ambiguity**, stop and hand off **with context**: what broke, the assumption that died, screenshots/logs, a proposed remedy. Explicit and programmable — never a crash or an infinite retry. (Same shape as `system-designer`'s Closer.)
Rule for which tier a step may auto-recover in: **reversible → auto-recover; destructive/irreversible → always gate on a human.**

## Maintenance & recompile
A durable design is a *living* artifact, not a one-shot. It must carry:
- **owner** (who fixes it), **version**, **last-validated date**.
- **recompile triggers** — which drift signal regenerates which segment.
- Self-describing diagnostics: the embedded preflight + verify commands mean that when it breaks, the failure is *localized* and the design itself tells the next session which assumption died.
Re-run the harden-or-not inequality periodically: when drift rate climbs and frequency drops, retire the design and go back to agentic.

## Validator (`scripts/check_design.py`)
The validator answers the mechanical SOUNDNESS checks true/false so the authoring agent never self-grades the parts a script can decide. Judgment (is this interface *actually* stable? is the rationale *actually* sufficient?) stays in the membership tests; the script checks structure, labels, and required tokens.

Run: `python scripts/check_design.py <design.md>` → prints `emit_ready` (exit 0) or `BLOCKED:` with one line per problem (exit 1). `python scripts/check_design.py --selftest` runs the bundled `examples/payout-reconcile.md` and asserts it passes (and a stripped copy fails), so a broken validator can't silently ship.

What it enforces mechanically:
- `harden_verdict` parsed from a DECLARED line (`harden_verdict: <ENUM>`), not by scanning prose — so a doc that names more than one verdict token binds deterministically. A `STAY_AGENTIC` decision must NOT also carry a Skeleton (a non-harden decision stops, it doesn't author a design).
- the four named signals {run_frequency, interface_stability, input_variance, reversibility} appear behind the verdict (their *sufficiency* is the membership test's job).
- all eight template sections present and non-empty; every step labeled `FROZEN` or `JOINT`; ≥1 `JOINT` unless the verdict is `FULL_HARDEN` (where the ladder's T2 supplies the adaptive path).
- Preflight contains refuse/halt-on-failure language (a preflight that can't FAIL is theater).
- Intent carries a `golden` output WITH a captured-artifact signal (a path, checksum, file, fenced block, or number) — not just the word "golden"; Verification diffs/compares against it.
- Fallback ladder has three DISTINCT tiers (T1, T2, T3) and a human-escalation tier.
- Maintenance carries owner + version + last_validated + a recompile/drift trigger.
- FROZEN steps carry Precondition → Action → Verify → Rollback.

It deliberately does NOT judge whether a label is *correct* — that is the membership test's job, run by the agent (and re-checked by `adversarial-reviewer`). Presence-in-code, soundness-of-judgment in the prompt. (`section_body` matches on the `##` header prefix, so the rendered headers must keep their template names — `examples/payout-reconcile.md` + `--selftest` are the guard against a rename silently breaking the match.)

## Worked example (gated)
Task: "export the weekly sales report from the billing app and email it to the team." Explored once, run weekly (passes Rule of Three after a month).
- **Gate:** weekly + stable billing API + low variance → **Full/Hybrid harden.** ✅
- **Freeze/adapt:** `pull report via billing REST API` → FROZEN (stable interface, pre-mappable, read-only). `attach + send email via API` → FROZEN (gated: send only after verify). `locate this week's reporting period` → JOINT only if the period encoding varies; else FROZEN. Clicking through the billing **web UI** to export → **never freeze** (presentation-layer rot) — use the API or leave it a JOINT.
- **Preflight:** assert billing API reachable + auth valid + report schema unchanged + recipient list resolves. Refuse + name the gap on fail. ✅
- **Golden output:** last good report's row count + column set + a checksum; replay diffs against it before sending. ✅
- **Fallback:** API 500 → idempotent retry (T1) → if schema changed, re-explore the pull (T2) → if the report looks empty/wrong, **don't email**, escalate with the diff (T3). ✅
- **Maintenance:** owner = data-ops; recompile trigger = "billing API version bump → re-run schema preflight, regenerate the pull node only." ✅
Every claim above passes the SKILL.md membership test; that is what makes it durable rather than a brittle macro.

## Relationship to the rest of the suite
- **durable-design (this skill)** decides the freeze/adapt boundary and owns the explore → author → execute → maintain lifecycle. It produces the durable design.
- **system-designer** takes the FROZEN part and designs its DAG: typed IO contracts, lanes, gates + Closer, provenance, deterministic one-command orchestration.
- **skill-builder** hardens each FROZEN node-prompt: positive target + membership test + per-field provenance + presence/soundness.
- **instruction-mechanizer** de-vagues the design's prose before it's hardened.
- **adversarial-reviewer** is the sectioned, separate ship-check — run it against the membership test before the design ships.
Lane rule: design the lifecycle and the boundary *here*; design the frozen pipeline *there*; harden each frozen prompt *there*. Don't redo their jobs in the durable design.

## Sources (provenance only)
- Anthropic, *Building Effective Agents* — workflows (predefined code paths) vs. agents (dynamic); decide per-node. https://www.anthropic.com/engineering/building-effective-agents
- Anthropic, *Equipping Agents with Agent Skills* — deterministic bundled code; "discover what context is actually needed instead of anticipating it upfront"; watch for "overreliance on certain contexts." https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- Agent Workflow Memory — "abstract task routines are more generalizable than raw action trajectories" (abstraction over verbatim replay). https://arxiv.org/abs/2409.07429
- SkillSmith — compile what's safe, preserve a **lossless return path** to live reasoning. https://arxiv.org/html/2605.15215v1
- DSPy — pay optimization at compile time; **recompile** when the environment changes rather than hand-patching. https://arxiv.org/pdf/2310.03714
- Thoughtworks, *Four bad ways to use RPA* — recording on top of a UI "pours concrete over your interfaces"; prefer the API; rule of fives. https://www.thoughtworks.com/insights/articles/four-bad-ways-use-rpa
- Kognitos / Duvo — RPA maintenance is 20–40%/yr; 30–50% of projects fail; brittleness from UI coupling. https://www.kognitos.com/blog/cost-of-rpa/ · https://blog.duvo.ai/why-every-rpa-project-breaks-and-how-agentic-ai-fixes-it
- Declarative vs imperative IaC; idempotency; desired-state reconciliation; drift detection. https://www.copado.com/resources/blog/declarative-vs-imperative-programming-for-infrastructure-as-code-iac · https://spacelift.io/drift-detection
- Runbook step discipline: preconditions, verification, rollback; crawl/walk/run automation spectrum. https://www.squadcast.com/sre-best-practices/runbook-automation · https://www.pagerduty.com/blog/insights/supercharging-incident-response-runbook-automation/
- Bainbridge (1983), *Ironies of Automation* — automating the routine strands whoever inherits the exception, deskilled. https://ckrybus.com/static/papers/Bainbridge_1983_Automatica.pdf
- Google SRE, *Eliminating Toil* — automate the stable; ROI must cover maintenance. https://sre.google/workbook/eliminating-toil/
- Agentic systems "don't fail suddenly, they drift"; trajectory-level anomaly detection beats final-output monitoring. https://www.cio.com/article/4134051/agentic-ai-systems-dont-fail-suddenly-they-drift-over-time.html · https://arxiv.org/html/2511.04032v1
- Katalon manual-vs-automation decision matrix (~60–70% freezable). https://katalon.com/resources-center/blog/manual-vs-automation-decision-matrix
- xkcd #1205, *Is It Worth the Time?* (the cost inequality). https://www.explainxkcd.com/wiki/index.php/1205:_Is_It_Worth_the_Time
