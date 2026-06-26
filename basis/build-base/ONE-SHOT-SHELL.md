---
status: authoritative
role: The one-shot entry point for GSD. Hand GSD this single file path; it states the GOAL (a runnable shell of the marketing pipeline, Steps 0–10, on stub prompts), the requirements/contracts to honor, the success criteria, and the exact sources — and routes the wiring without prescribing the build.
read-with:
  - architecture/PART0--pipeline-flow.md
  - architecture/PART3--architecture-design.md
  - SHELL-BUILD-SPEC.md
  - STATE-OF-PROJECT.md
supersedes: []
---

> **What this is:** the single file the operator hands to GSD to build the pipeline shell. **Read by:** GSD, first and in full. GSD owns the HOW — this file states the GOAL, the requirements, the success criteria, and the sources, and does **not** prescribe a build procedure, mandate file formats, or hand you a scaffold to follow. Where it inlines a load-bearing rule it reproduces it verbatim and cites the source path so you can check it against the original; everything else it routes by exact path. All paths are relative to the repo root `build-base/`. **Snapshot date:** 2026-06-26.

# ONE-SHOT SHELL — build the runnable shell of the marketing pipeline

## 1. The goal, in one breath

Build a **runnable shell of the marketing pipeline (Steps 0–10)** that runs **end-to-end on stub prompts** — every declared artifact produced and consumed, deterministic routing, the run completes — where **real prompts and field-level schemas are drop-in slots**, and the **only thing not-yet-good is marketing judgment**. The plumbing must be correct: every step's output is consumed by the right downstream step, no orphan outputs, no dangling inputs, the run completes. Marketing quality is explicitly deferred and is the one thing allowed to be mediocre.

You are building **mechanism, not content.** The pipeline has two layers: the **shell** (orchestrator, artifact store, per-step I/O contracts, routing, validation, operator gates) is deterministic plumbing and is what you build now; the **content** (the prompt body inside each step and the exact field schemas at each seam) is deferred and drops into slots later. Keep that separation — it is the whole strategy.

## 2. Scope guard — operate inside `build-base/` only

Build the shell from `build-base/` and write your outputs inside it. Do **not** reach up into the `pmf3/` repo root, into `kb/`, or into `skills/` (except the two tracked builder skills `skill-builder/` and `system-designer/`). Reason, verbatim from `UNTRACKED-FILES-REPORT.md`:

> "`pmf3/` root mixes **two projects** — the pipeline build-base and the KB-mechanization toolchain (+ the raw KB corpus + working drafts). **Hand a shell-builder `build-base/`, not the whole `pmf3/`**, or it will wander into the toolchain and the reference mass."

## 3. Precedence rule (rule #1 — applies to everything here)

Quoted verbatim from `SHELL-BUILD-SPEC.md §0`:

> "`standards/` → **build-base architecture (`PART0`/`PART3`/`PART1`)** → the built `bet-compiler` SKILL → **as-ran repo = reference only.** When the as-ran (old prompts) and the architecture disagree about what a step produces or consumes, **the architecture wins.** Use the as-ran for field-name *vocabulary*, proof a computation is *achievable*, and a record of past *failures* — never as the definition of a step's scope."

Concretely: derive step scope, order, and I/O from the architecture. The as-ran repo and the existing engine bricks are evidence and raw material — where a brick or an old prompt diverges from the architecture's intent (some bricks are as-ran / pre-R1), the architecture wins.

## 4. Locked operator decisions (fold these into the shell)

These are settled (source of record: `STATE-OF-PROJECT.md §5`; handoff §4). They are requirements, not options:

1. **Step 0 (Bet Compiler) produces `runs/<space>/asset-classify/CLAIM-LIST.json`** — the product's own capability-claim ledger with a best-guess `load_bearing` flag; it is **consumed by Step 9** (Asset classify). It is distinct from the bet-brief's *competitor* claim-type enum. This closes what was Step 9's dangling input.
2. **The Funnel Architect (Step 7) explicitly consumes the bet-brief AND the product spec/intake `.md`** (from Step 0) — both are required inputs, not optional.
3. **Angle / claim / transformation classification is two-tier:** the Section Analyzer (Step 2) emits **raw per-funnel** values; the Space Classifier (Step 3), which sees all funnels, **canonicalizes** across them. (The product CLAIM-LIST from Step 0 is a separate artifact from competitor-funnel claims.)
4. **Source-of-truth precedence** is the rule in §3.
5. **Build strategy = shell-first** — this entire goal. Wire at the artifact grain now; drop prompts and field-level schemas in later.

## 5. The requirements / contracts to honor (the WHAT — derive the HOW yourself)

A finished shell satisfies all of the following. These are outcomes and contracts to honor; how you scaffold and verify them is yours to decide.

**5.1 Wire at the ARTIFACT grain, not the prompt grain.** Steps are black boxes that read and write **declared artifact files** under `runs/<space>/`. The only thing that must be deterministic is the inter-step artifact flow — which files each step reads and writes. Whether a step is one prompt or N named agents is an internal, deferrable detail (start each step as one prompt slot). Quoted verbatim from `SHELL-BUILD-SPEC.md §2`:

> "You do **not** need to know how each step divides into prompts to build the shell. The only thing that must be deterministic is the **inter-step artifact flow** — which files a step reads and writes. Everything inside a step is a black box."

**5.2 Honor the architecture's own orchestration design and seams as requirements** (do not invent your own; derive from these):

- **Step order** is the canonical R1/R2 order in `architecture/PART3--architecture-design.md §1.5/§1.6`, narrated end-to-end in `architecture/PART0--pipeline-flow.md`. (Build order from §1.5/§1.6 or PART0 — **never** from `PART3 §4.x`, which is a superseded reasoning trail, nor the pre-R1 phrasing in §6.4/§6.7.)
- **Orchestration / the run-controller** design is `PART3 §8` — the one-command, script-between-agents, validate-and-receipt loop the architecture specifies. Honor it as the orchestration requirement.
- **The seam list** (which artifacts cross which step boundaries, including the information-hygiene rule that each seam names what is withheld as well as what flows) is `PART3 §9`.
- **The file-level consumption matrix** (who reads what) is `PART3 §5.2`.
- **Per-step manifest detail** (each step's reads/writes/refuse-conditions/gate) is in `PART3 §6.x` and, per step, in `briefs/STEP-00…10-*.md`.

**5.3 Prompts and field-level schemas are deferred drop-in slots.** Each step ships with a **stub prompt** carrying the standard envelope (frontmatter + OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED) but an empty body; in stub mode the step emits a minimal artifact whose top-level shape matches its declared contract. The envelope template is the one built step, `skills/bet-compiler/SKILL.md`. The envelope is part of the shell; only the body and the field-level schemas are content you defer. Validators are **loose now** — they check an artifact exists and has its declared top-level keys (presence/shape), and refuse on a missing load-bearing field; field-level congruence checks are added later when the seam field-map exists, with no rewiring.

**5.4 Reuse the existing glue in `build-base/engine/` — do not rewrite it.** The deterministic bricks (fetch/clean/funnel/asset/aggregate), the firing layer (validators, `route.js`, DR-injectors), the deploy integrations, and the JSON schemas already exist and are proven — `bash engine/contracts/h6-all.sh` → **14/14 green**. Your job is to **assemble + order** these bricks into the run-controller and the per-step manifests per the architecture's blueprint, **not** to write the fetch/glue from scratch. Find bricks via `engine/contracts/REGISTRY.json` (the `.md` is the human view) and `engine/contracts/REUSE-INDEX.md`; learn how the firing layer registers from `engine/FIRING-MANIFEST.md`; provision runtimes from `engine/DEPENDENCIES.md`; use the closed vocabularies and record schemas in `engine/contracts/enums.json` + `engine/contracts/schemas/`. Order the bricks per `PART0` / `PART3 §8` / `§9`; **the architecture wins on intent where a brick diverges** (some bricks are as-ran / pre-R1). The marketing PROMPTS are intentionally **not** in the engine — they are the deferred slots from §5.3, plugged in on top.

**5.5 Honor the locked operator decisions** in §4 (the CLAIM-LIST producer→consumer link, the architect's required inputs, the two-tier classification).

**5.6 The prompt-stub envelope is governed by the soundness triad.** The deferred-but-declared envelope follows `standards/SPEC-marketing-soundness.md`, `standards/marketing-rule-register.md`, and `standards/BUILDER-DIRECTIVE.md` (grounding + carried-risks contracts). The triad governs the *envelope shape* now; its marketing *content* is deferred with the prompt bodies.

**5.7 Copy the artifact-store convention** (`runs/<space>/` tree, no-overwrite versioning, a run ledger) from the de-risked as-ran layout in `reference/as-ran-repo/asran-repo-report.md` + `reference/as-ran-repo/repo-files/runs/arduview/`. Give the new R1 artifacts (which have no as-ran equivalent) their own paths, and give per-cell fan-out outputs a disambiguating filename rule.

## 6. The shell's artifact slots, at a glance (orientation — not the contract)

The following is a **derived orientation view** to help you see the shape; the **authoritative** wiring lives in `PART0`, `PART3 §5.2`, `PART3 §9`, and the per-step `briefs/`, and you derive from those — reproduce nothing here as contract. (Rendered from `PART0` + `SHELL-BUILD-SPEC.md §4` + `PART3 §5.2`.) Each step reads its declared inputs from `runs/<space>/` and writes its declared outputs there; ★ marks an operator gate.

| Step | Reads (key inputs) | Writes (key outputs) | Gate |
|---|---|---|---|
| 0 Bet Compiler | operator intake + KB digest | `bet-brief.md` (+ `product-intake.md`); `asset-classify/CLAIM-LIST.json` | ★ |
| 1 Collect | `bet-brief.md` | `brands.json`; `queries_run.json`; `dumps/` | ★ (apply flags) |
| 2 Funnel analysis | `brands.json`, `dumps/` | `funnels/<id>.json`; `ad-volume-aggregate.json`; `_tally.json`; funnel-store | — |
| 3 Space map | analyzed funnel records + aggregates | `space-map.json` | — |
| 4 VOC market pass | candidate cells from `space-map.json`; `bet-brief.md` | `voc/market-signal/<cell>.json`; `gap_candidates.json` | — |
| 5 Market selection | `space-map.json`; `voc/market-signal §1`; `gap_candidates.json`; `bet-brief.md` | `market-selection.json`; `ntp-pick.json` | ★ NTP pick |
| 6 VOC deep pass | winner cell (from pick) | `voc-bank/`; `awareness-read.json` | — |
| 7 Funnel architect | funnel store + `_tally.json` + `awareness-read.json` + `voc-bank` view + `bet-brief.md` + `product-intake.md` + market-selection | `funnel-brief.md`; `audit-verdicts.json` | ★ review |
| 8 Copywriter + Chief | locked `funnel-brief.md` + slot-scoped `voc-bank` RAG + funnel index | `copy/`; `chief-verdicts.json` | ★ |
| 9 Asset classify | operator assets; `asset-classify/CLAIM-LIST.json` | `asset-records.json` | — |
| 10 Adversarial re-review | pipeline outputs | `review/` | ★ |

Plus a run ledger (`_receipts/`) recording every spawn (inputs hash, validator verdicts). The producer→consumer graph closes: every output above is consumed downstream or is a terminal/operator-facing artifact, and every input has an upstream producer; the remaining open items are the **deferred content slots** (§8), not wiring gaps.

## 7. Definition of done (success criteria — outcomes, not method)

The shell is done when an end-to-end run on stub prompts completes clean. State of success, quoted verbatim from `SHELL-BUILD-SPEC.md §11`:

> "`run all --space=smoke` completes end-to-end on stub prompts with: all preflights green, all validators green on declared top-level shapes, every artifact slot written under `runs/smoke/`, every operator gate logged, an unbroken `_receipts/` chain, and **zero orphan outputs / dangling inputs** across the manifests."

Equivalently: the shell runs all 11 steps (0–10) end-to-end on stubs; every declared artifact is produced and consumed; routing is deterministic; operator gates block-and-log (auto-approve in smoke mode); the run completes. **How** you scaffold the run, the manifests, the stubs, and the smoke test — and how you prove it — is yours to decide. (The engine's own `bash engine/contracts/h6-all.sh` → 14/14 green proves the bricks you assemble; the smoke run proves the orchestration you build on top of them.)

## 8. What is deferred (do NOT build these into the shell)

- **Prompt bodies** (the marketing judgment) — drop into the stub slots later, step by step.
- **Field-level seam schemas** — the seam field-map / contract-congruence work (`PART2 Job 5`; `OPEN-DECISIONS.md A2`). Adding these later only tightens existing validators; no rewiring.
- **Prompt-division (1 vs N agents per step)** — `PART2 Job 6`. Internal to a step; changes no inter-step wiring.
- **Marketing truth & thresholds** — `PART2 Jobs 2–4` and `OPEN-DECISIONS.md` (test content, currency model, whitespace-vs-scary, claim-typing taxonomy, the pricing-anchor slot C1). None of these block the shell; the open items are listed in `OPEN-DECISIONS.md` and `STATE-OF-PROJECT.md §7` for reference — you do not resolve them.
- **Phase B (production & launch)** — drafted at `architecture/PART5--production-and-launch.md` (the Asset-Describe hub, Visual-Branding pipeline, Funnel-Architect-as-hub, Video Strategist/Builder, HTML + Shopify implementers). **Out of scope: the shell targets Steps 0–10 only.** Phase B is a documented, **append-only future extension** — when its open items close it adds new manifests + artifact slots + `pipeline.yaml` rows to the same run-controller, with **no rewiring**. It is a `draft`; leave it intact and do not thread it into PART0/PART3/§5.2/§6 now.

## 9. Sources — the minimal set, by exact path (read these to derive the wiring)

Routed roughly in reading order. Everything you need to derive the shell is here; you do **not** need to reach into the reference-only set (`PART1`, `PART3-READER`, `reference/reviews/*`, `reference/handoffs/*`, `EXTERNAL-INPUTS-MAP.md`, `_cleanup/*`) — those are context, not scope sources.

**Orientation**
- `STATE-OF-PROJECT.md` — what's built/decided/open/next.

**The wiring spine (authoritative — derive order + I/O from here)**
- `architecture/PART0--pipeline-flow.md` — the end-to-end flow (each step ingests→emits→feeds).
- `architecture/PART3--architecture-design.md` — read **§8** (orchestration / run-controller), **§9** (seam list), **§5.2** (consumption matrix), **§1.5/§1.6** (canonical R1/R2 order), **§6.x** (per-agent cards for manifest detail). NB **§4.x is superseded** — topology reference only.
- `briefs/STEP-00-bet-compiler.md`, `briefs/STEP-01-competition-collect.md`, `briefs/STEP-02-funnel-analysis.md`, `briefs/STEP-03-space-map.md`, `briefs/STEP-04-voc-market-pass.md`, `briefs/STEP-05-market-selection.md`, `briefs/STEP-06-voc-deep-pass.md`, `briefs/STEP-07-funnel-architect.md`, `briefs/STEP-08-copywriter.md`, `briefs/STEP-09-asset-classify.md`, `briefs/STEP-10-adversarial-review.md` — per-step manifest I/O detail.

**The glue to assemble (reuse — do not rewrite)**
- `engine/WIRING-BUNDLE.md` — the engine's entry doc (boundary, inputs, verify, what's excluded).
- `engine/contracts/REGISTRY.json` (+ `REGISTRY.md` human view) — every capability + its I/O, run command, deps, health.
- `engine/contracts/REUSE-INDEX.md` — what to reuse vs re-author.
- `engine/FIRING-MANIFEST.md` — how the validators / router / injectors register + fire.
- `engine/DEPENDENCIES.md` — runtimes to provision (Node 20, Python 3.12, Playwright, etc.).
- `engine/contracts/enums.json` + `engine/contracts/schemas/` — closed vocabularies + record schemas the validators import.

**The artifact-store convention to copy**
- `reference/as-ran-repo/asran-repo-report.md` + `reference/as-ran-repo/repo-files/runs/arduview/` (and `repo-files/brands.json`, `space-map.json`, `definitions.md`) — the `runs/<space>/` layout to copy.

**The prompt-stub envelope + soundness envelope (the shape now; content deferred)**
- `skills/bet-compiler/SKILL.md` — the one built step = the envelope template (OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED).
- `standards/SPEC-marketing-soundness.md`, `standards/marketing-rule-register.md`, `standards/BUILDER-DIRECTIVE.md` — the soundness triad governing the envelope.

**Optional background (the WHAT was distilled from here — not a mandated procedure)**
- `SHELL-BUILD-SPEC.md` — the shell's six components, manifest/stub examples, and smoke-test mechanics, for deriving the goal + contracts. Use it as reference; its mechanics are not mandates — you own the build.

**Deferred extension (reference; not built now)**
- `architecture/PART5--production-and-launch.md` — Phase B (append-only future extension; §8).

## 10. The one path

The operator hands GSD exactly this file: **`build-base/ONE-SHOT-SHELL.md`**.
