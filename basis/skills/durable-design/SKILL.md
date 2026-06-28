---
name: durable-design
description: >-
  Use when capturing a task that an agent figured out once into a durable design a
  FRESH session can re-run without re-discovering anything — and when executing one.
  Triggers: "turn this into a repeatable workflow / runbook / automation"; pre-writing
  the code + steps so next time it "just runs"; deciding which steps to freeze into
  code vs. leave the agent to figure out live; a hardened workflow that broke when the
  UI/API/data changed; "should I even automate this or just do it again by hand";
  running a pre-written design safely with preflight checks and a fallback when a step
  fails. Covers the harden-or-not gate, the freeze/adapt/human-required label test,
  the declarative durable-design template with a membership test per field, preflight
  + golden-output + the 3-tier fallback ladder, Human Gates (planned pauses where AI
  is literally blocked — pings the human with exact instructions and opens the
  required interface), the amendment-agent protocol (self-improvement without human
  involvement), a PRESENCE/SOUNDNESS completeness block, and a validator. For
  designing the DAG + typed contracts of the frozen part, use system-designer; to
  harden one node-prompt, use skill-builder; to de-vague prose, use
  instruction-mechanizer; to ship-check the design, use adversarial-reviewer.

  This skill is itself run as the workflow of single-job steps below.
---

# Durable Design — capture a one-time exploration into a replayable automation, and run it

**Inputs:** a task an agent explored and got working; its run frequency; the stability of its interfaces; the variance of its inputs; which of its steps are reversible vs. destructive.
**Output:** either a `STAY_AGENTIC` decision (do not harden), or a *durable design* — the templated document below, in which every judged field carries a membership test and the whole passes a PRESENCE/SOUNDNESS gate.
**Consumed by:** the fresh session that executes it; its frozen DAG → `system-designer`; each frozen node-prompt → `skill-builder`; the separate ship-check → `adversarial-reviewer`.

## Core principle
A durable design is **not a recording you replay verbatim** — that is the brittle anti-pattern. It is a **declarative spec** (target state + the checks that confirm it) wrapped around a **frozen deterministic core**, with the moving parts left as **explicitly-marked adaptive joints that re-discover live**, plus a guaranteed path back to exploration when a frozen step fails.
> Freeze the **stable skeleton + the verification + the rationale**. Leave the parts that can move **free**. "Frozen" means PASSED THE FREEZE TEST below, never "I wrote it down."

## Three judged labels do all the load-bearing work — give each a test that can return FALSE
Most bad durable designs aren't missing sections; they carry a label that was stamped, not earned: a step called FROZEN that is actually volatile, or a "harden it" verdict on a task that should never have been automated. Harden these three labels first.

### Label 1 — the HARDEN-OR-NOT verdict (decide this BEFORE authoring anything)
```
FIELD: harden_verdict
ALLOWED VALUES (echo one verbatim): FULL_HARDEN | HARDEN_PLUS_HEALING | HYBRID | STAY_AGENTIC
DECIDE FROM NAMED SIGNALS (not by feel): {run_frequency, interface_stability, input_variance, reversibility}
SOURCE: each signal carries evidence — e.g. run_frequency = "weekly, observed 5×"; interface_stability = "Stripe REST API, versioned"
MEMBERSHIP TEST (all YES or you have the wrong verdict — relabel):
  - Has the task run the SAME way >= 3 times? (No -> STAY_AGENTIC: you'd freeze incidental discoveries from one run)
  - Does (time_saved_per_run x frequency x horizon) exceed (build + recurring MAINTENANCE)? (No -> STAY_AGENTIC)
  - Is the interface a declared API/CLI/file contract, not scraped UI/DOM/pixels? (No, and value is FULL_HARDEN -> wrong; UI churn forces HARDEN_PLUS_HEALING or STAY_AGENTIC)
  - Is input_variance low? (No, and value is FULL_HARDEN -> wrong; high variance forces HYBRID)
```
See `reference.md` → harden-or-not matrix for the full signal→verdict table. On `STAY_AGENTIC`, emit that decision with its failing signal and STOP — do not author a design.

### Label 2 — the per-step FREEZE/ADAPT/HUMAN_REQUIRED label
```
FIELD: step.disposition
ALLOWED VALUES (echo one verbatim): FROZEN | JOINT | HUMAN_REQUIRED
MUST FILL for FROZEN: all three predicates, each with evidence —
  {decision_tree_pre_mappable: <you can state the rule>, binds_to_stable_interface: <API/CLI/file, named>, reversible_or_gated: <how>}
MEMBERSHIP TEST for a FROZEN label (any NO -> it is a JOINT, relabel):
  - Can you state the step's rule as code that returns the same output for the same input?
  - Does it bind to a declared API/CLI/file contract (NOT scraped UI / DOM coordinates / pixels)?
  - Is it reversible, or gated behind a human before it acts?
MEMBERSHIP TEST for a HUMAN_REQUIRED label (all YES required — if any NO, it is a JOINT or T3, not HUMAN_REQUIRED):
  - Is execution by AI physically or technically impossible — not just risky or uncertain, but blocked?
    (Examples that qualify: 2FA/OTP on a device only the human holds; bank credential entry behind hardware key; legal e-signature requiring ID verification; uploading a file only the human possesses; biometric gate; captcha that cannot be bypassed via API.)
  - Is this a PLANNED handoff the design knows about upfront — not a failure state?
    (Unplanned failures belong in the fallback ladder as T3, not here.)
  MUST FILL for HUMAN_REQUIRED: {why_ai_cannot: <literal technical blocker>, interface_to_open: <URL/app/screen>, exact_instructions: <step-by-step, nothing left to figure out>, verify_after: <how the session confirms the human completed it correctly>}
```
You cannot pre-enumerate the failure space (N tools × K failures grows combinatorially), so JOINTS are the norm, not a fallback — expect fewer than 100% FROZEN. The one exception is a `FULL_HARDEN` verdict on a fully-stable, fully-mappable task: there, zero JOINTs is allowed because the fallback ladder's T2 (re-explore) supplies the adaptive path instead.
HUMAN_REQUIRED steps are different from both: they are not failures and not adaptive — they are designed pauses where the automation hands control to a human for exactly one action, then resumes. They do not count against the FROZEN/JOINT ratio.

## THE WORKFLOW (each step is one distinct job — run in order; this skill is itself this workflow)
1. **Run the HARDEN-OR-NOT test** (Label 1). On `STAY_AGENTIC`, stop and say so.
2. **Explore once, capturing the WHY.** For each step record `{assumptions_relied_on, interface_bound_to, why_this_over_alternatives, signals_that_would_mean_it_is_wrong}`. A fresh session with zero rationale inherits every exception deskilled (the Ironies of Automation) — so the rationale is load-bearing, not commentary.
3. **Apply the FREEZE/ADAPT/HUMAN_REQUIRED test** (Label 2) to every step. Mark each `FROZEN`, `JOINT`, or `HUMAN_REQUIRED`.
4. **Author the durable design** (template below). Hand the frozen DAG to `system-designer` and each frozen node-prompt to `skill-builder`; do not re-derive their jobs here.
5. **Execute with a fresh session** (protocol below).
6. **Maintain:** when a drift signal fires, regenerate the affected segment, not the whole design.

## The durable design template (every field carries its membership test)
```
# <task> — durable design
harden_verdict: <FULL_HARDEN|HARDEN_PLUS_HEALING|HYBRID|STAY_AGENTIC>   # echoed from Label 1, with its named signals + evidence inline
## Intent & success criteria
   MUST FILL: the pass condition + the GOLDEN OUTPUT copied verbatim from the original run.
   TEST: Is success stated as a checkable condition (a number/diff/assertion), not "looks right"? Is the golden output a real captured artifact, not described?
## Assumptions & dependencies
   MUST FILL: each interface/version/file/state the run relies on, one per line.
   TEST: Is each assumption written as something the preflight can assert true/false? (A prose assumption no check can read -> rewrite it.)
## Preflight
   MUST FILL: one command/sequence that asserts every assumption above and REFUSES on any failure, naming the broken assumption.
   TEST: Can it return FAIL? Does FAIL halt execution rather than warn-and-continue? (A preflight that always passes is theater.)
## Skeleton (FROZEN)
   MUST FILL per step: Precondition -> Action -> Verify -> Rollback; idempotent; bound to the named stable interface.
   TEST: Does each FROZEN step pass Label 2's test? Is it safe to re-run (idempotent; side effects carry an idempotency key)? Does Verify confirm an OUTCOME, not "the call returned"?
## Joints (ADAPTIVE)
   MUST FILL per joint: the marker "re-discover live" + the step-2 rationale record.
   TEST: Is the joint explicitly marked AND does its rationale name what would tell a fresh session it has gone wrong?
## Human Gates
   MUST FILL per HUMAN_REQUIRED step: why AI literally cannot execute this (name the technical blocker, not just "it's risky") + the exact interface to open (URL, app, screen name) + word-for-word instructions so the human does not have to figure anything out + what the session verifies after to confirm it was done correctly.
   TEST: Is this truly impossible for AI, or just uncertain/risky? (Uncertain/risky -> JOINT or T3. Impossible -> HUMAN_REQUIRED.) Could the human complete this step correctly from the instructions alone, with zero prior context? Does the verify step confirm an outcome, not just "the human said done"?
## Verification
   MUST FILL: the golden-output diff + a canary run on one reversible case + the trajectory signals to watch.
   TEST: Does it assert on outcomes/trajectory, not only "the run finished"?
## Fallback ladder
   MUST FILL: T1 idempotent retry -> T2 re-explore the joint live -> T3 escalate to a human WITH context.
   TEST: Does it have all three tiers? Does T3 carry {what broke, the dead assumption, a proposed remedy}? Are irreversible steps barred from auto-recovery (T1/T2) and routed straight to T3?
## Maintenance
   MUST FILL: owner, version, last_validated date, and which drift signal recompiles which segment.
   MUST FILL: amendment_agent protocol — when a JOINT step is solved via T2 re-exploration during a run, the session spawns an amendment agent with {the problem, the solution, the current design}. The amendment agent runs Label 2's membership test adversarially. If the solution passes (pre-mappable rule, stable interface, reversible/gated): it appends it to the Skeleton as a new FROZEN step, versioned and dated. If it fails the test: it appends it to Joints as a new rationale note only. The amendment agent never self-grades — it defaults to JOINT if uncertain. The human is not involved in this loop.
   TEST: Could a different person fix this from the metadata alone? Does the amendment_agent protocol name what test it runs and what it appends on pass vs. fail?
```

## COMPLETENESS — split PRESENCE from SOUNDNESS (run before the design ships)
```
### PRESENCE (the section exists / is filled)
- [ ] all nine template sections present and non-empty
- [ ] every step labeled FROZEN, JOINT, or HUMAN_REQUIRED
### SOUNDNESS (the field passed its membership test — names the rule)
- [ ] harden_verdict passed Label 1's test (or design is STAY_AGENTIC and stops)
- [ ] every FROZEN step passed Label 2's three-predicate test
- [ ] every HUMAN_REQUIRED step names a literal technical blocker (not just risk), carries exact interface + instructions + verify-after
- [ ] every assumption is preflight-checkable; preflight can return FAIL and halts
- [ ] Intent carries a verbatim golden output; Verification diffs against it
- [ ] fallback ladder has 3 tiers; irreversible steps routed to T3 only
- [ ] maintenance carries owner + version + last_validated + recompile triggers + amendment_agent protocol
STATUS: emit_ready ONLY if every SOUNDNESS box is checked; else emit BLOCKED:<field>
```
Anything mechanical here is checked by a script, not by eye — run `scripts/check_design.py <design.md>` (see `reference.md` → validator). Keep judgment in the membership tests; push presence/format checks into the script.

## Execution protocol (for the fresh session running a finished design)
1. **Preflight before touching anything.** On any FAIL, refuse and report which assumption broke — do not execute wrong.
2. **Run the frozen skeleton.** Each step checks its precondition, acts, verifies the outcome, and is safe to re-run.
3. **At each JOINT, re-explore live**, guided by the carried rationale.
4. **At each HUMAN_REQUIRED step, pause and hand off:** emit a clear session ping naming the step, open the required interface (headed browser, app, or screen) at the exact URL/location specified in Human Gates, deliver the word-for-word instructions from the design — the human should not have to figure anything out. Wait for explicit confirmation. Verify the expected outcome before continuing. Do not proceed past a HUMAN_REQUIRED step without confirmed completion.
5. **After any JOINT solved via T2 re-exploration, spawn an amendment agent** with {the problem, the solution found, the current design}. The amendment agent runs Label 2's membership test adversarially (defaults to JOINT if uncertain) and appends either a new FROZEN step (versioned + dated) or a JOINT rationale note — never asks the human. The running session continues; the amendment agent works in parallel.
6. **Fallback ladder on any failure:** T1 idempotent retry → T2 re-explore the failing sub-task live → T3 on continued failure or on a step that is irreversible-and-not-uniquely-determined, escalate to a human with context. Escalation is explicit, never a crash or an infinite retry — route it like `system-designer`'s Closer.
7. **Verify against the golden output** (canary one reversible case first); watch the whole trajectory — a step/tool count that differs from the golden run is the early drift signal that final-output checks miss.

## Failure modes this skill prevents (why "full hardening isn't always good")
Staleness (assumptions silently go invalid) · overfitting to one trajectory (the happy path only) · error fossilization (a mistake from the one run replayed forever as if validated) · presentation-layer rot (frozen to UI/pixels instead of a stable interface) · the deskilled fresh session (rationale optimized to zero, so it crashes on the first exception). Each maps to a section above; see `reference.md` for the mechanisms.

## Membership test — "is this durable design sound?" (apply to your OWN output; any NO = not durable, name the gap)
- Did `harden_verdict` pass Label 1's test, or correctly resolve to `STAY_AGENTIC` and stop?
- Is the output the declarative template, not a verbatim step recording?
- Did every FROZEN step pass Label 2 (pre-mappable + stable interface + reversible/gated)?
- Does the preflight assert every assumption and HALT on failure?
- Is every JOINT marked AND carrying its "what would mean it's wrong" rationale?
- Is every HUMAN_REQUIRED step backed by a literal technical blocker (not just risk), with interface + word-for-word instructions + verify-after? Is it a planned handoff, not a failure response?
- Does the execution protocol pause at HUMAN_REQUIRED steps, ping with exact instructions, and verify before continuing?
- Does the amendment agent protocol name what test it runs and what it appends on pass vs. fail — without human involvement?
- Golden output present + diffed; verification on outcomes/trajectory?
- Fallback ladder 3 tiers, irreversible steps to T3 only?
- Maintenance metadata + recompile triggers + amendment_agent protocol present?
- Does the SOUNDNESS block reach `emit_ready` (script-checked)?

See `reference.md` for the harden-or-not matrix, the validator, golden-output/canary, drift signals, the declarative-over-imperative reframe, the suite handoffs, and sources (provenance only — you never need to open a URL to apply this skill).
