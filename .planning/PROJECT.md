# Marketing Pipeline Shell (Steps 0–10)

## What This Is

A runnable **shell** of an 11-step agentic marketing pipeline (0 Bet → 1 Collect → 2 Funnel analysis → 3 Space map → 4 VOC market pass → 5 Market selection → 6 VOC deep pass → 7 Funnel architect → 8 Copywriter → 9 Asset classify → 10 Adversarial re-review). The shell is deterministic plumbing — an orchestrator/run-controller, a `runs/<space>/` artifact store, per-step I/O manifests, validators, and operator gates — that runs **end-to-end on stub prompts**. Real prompt bodies and field-level seam schemas are deferred drop-in slots. It is built for the operator (a solo DR marketer) who turns a product *bet* into a written, audited funnel.

## Core Value

`run all --space=smoke` completes end-to-end on stub prompts with **zero orphan outputs / dangling inputs** — i.e., the inter-step wiring is provably correct, independent of marketing quality. Build mechanism, not content.

## Requirements

### Validated

<!-- Inferred from the existing, proven engine at `engine/` (brownfield). `bash engine/contracts/h6-all.sh` → 14/14 green. -->

- ✓ Deterministic fetch/clean/funnel/asset/aggregate bricks — existing (`engine/bricks/`)
- ✓ Firing layer: per-step validators + router (`route.js`) + DR-injectors — existing (`engine/hooks/`, `engine/FIRING-MANIFEST.md`)
- ✓ Closed vocabularies + record schemas the validators import — existing (`engine/contracts/enums.json`, `engine/contracts/schemas/`)
- ✓ Deploy integrations (Shopify / Cloudflare / Klaviyo / CDP) — existing (`engine/integrations/`)
- ✓ Brick health/verification harness (`h6-*` family, `h5-e2e.sh`) — existing (`engine/contracts/`)
- ✓ Step 0 Bet Compiler skill = the OUTPUT-CONTRACT/COMPLETENESS/HOW-IT'S-CONSUMED envelope yardstick — existing (`basis/build-base/skills/bet-compiler/SKILL.md`)

### Active

<!-- The shell. Hypotheses until the green smoke run proves them. -->

- [ ] Artifact store: `runs/<space>/` tree with no-overwrite versioning and a run ledger
- [ ] Run-controller: the 7-phase loop (preflight → plan-print → context-assembly → spawn → validate → store+receipt → operator gates), one command `run all --space=<s>`
- [ ] `pipeline.yaml`: the 11 step ids in canonical R1 order (from PART3 §1.5/§1.6 + PART0)
- [ ] 11 declarative step manifests (reads / writes / scripts / prompt / validator / gate) derived from PART0 + PART3 §5.2
- [ ] 11 prompt stubs carrying the standard envelope + a mock emit (minimal artifact whose top-level keys match the OUTPUT CONTRACT)
- [ ] Per-step validators: presence + top-level shape now; refuse on a missing load-bearing field
- [ ] Operator gates: block-and-log; auto-approve in smoke mode
- [ ] `_receipts/` chain: every spawn logs inputs hash + validator verdicts
- [ ] Locked decisions wired: CLAIM-LIST (Step 0 → Step 9); architect's required inputs (bet-brief + product-intake); two-tier angle/claim/transformation classification (Step 2 raw, Step 3 canonical)
- [ ] Green smoke run: `run all --space=smoke` completes clean (all preflights green, all validators green on declared top-level shapes, every artifact slot written, every gate logged, unbroken `_receipts/` chain)

### Out of Scope

<!-- Explicit boundaries with reasoning. -->

- Prompt bodies (the marketing judgment) — drop into stub slots later, step by step (`PART2 Job 7`)
- Field-level seam schemas / contract-congruence — only *tightens* existing validators later; no rewiring (`PART2 Job 5`, `OPEN-DECISIONS A2`)
- Prompt-division (1 vs N agents per step) — internal to a step; changes no inter-step wiring (`PART2 Job 6`)
- Marketing truth & thresholds (determination tests, currency model, whitespace-vs-scary, claim-typing taxonomy, pricing-anchor slot C1) — the "mediocre-marketing-acceptable" trade (`Jobs 2–4`, `OPEN-DECISIONS`)
- Phase B (production & launch — Asset-Describe hub, Visual-Branding, Video, HTML/Shopify implementers) — append-only future extension; the shell targets Steps 0–10 only (`architecture/PART5`)
- Rewriting the engine glue — reuse the proven bricks; assemble + order them, never rewrite

## Context

- **Brownfield-with-reuse.** The engine at `engine/` is proven but *unordered*. The shell's job is to **assemble + order** these bricks into a run-controller and per-step manifests per the architecture's blueprint — not to write fetch/glue from scratch. The marketing PROMPTS are intentionally not in the engine; they are the deferred slots plugged in on top.
- **Source-of-truth precedence (rule #1):** `standards/` → build-base architecture (`PART0`/`PART3`/`PART1`) → the built `bet-compiler` SKILL → as-ran repo = **reference only.** When the as-ran (old prompts) or a pre-R1 brick disagrees with the architecture about what a step produces/consumes, **the architecture wins.** As-ran is evidence (vocabulary, feasibility proof, failure record), never contract.
- **Wiring readiness ~70%** (per `STATE-OF-PROJECT.md §4`): artifact-grain routing is already deterministic (file inputs/outputs + order defined in PART0 + PART3 §5.2); the deferred gap is field-grain continuity at the R1 seams.
- **Scope guard:** derive the shell from `basis/build-base/` (the routed design sources) + `engine/`. Do **not** wander into the wider `basis/` reference mass beyond the routed sources, or into `_legacy/` (quarantined).
- **Authoritative local sources:** `basis/build-base/ONE-SHOT-SHELL.md` (one-shot entry); `architecture/PART0--pipeline-flow.md`; `architecture/PART3--architecture-design.md` (§8 orchestration, §9 seams, §5.2 consumption matrix, §1.5/§1.6 order, §6.x per-step cards — NB §4.x superseded); `briefs/STEP-00…10`; `SHELL-BUILD-SPEC.md`; `engine/WIRING-BUNDLE.md`, `engine/contracts/REGISTRY.md` + `REUSE-INDEX.md`, `engine/FIRING-MANIFEST.md`, `engine/DEPENDENCIES.md`. Codebase map of the engine lives in `.planning/codebase/`.

## Constraints

- **Tech stack**: Node 20 + Python 3.12 + Playwright (`engine/DEPENDENCIES.md`) — reuse the engine's runtimes; do not introduce a novel stack.
- **Reuse**: assemble existing engine bricks; do not rewrite the fetch/glue (`engine/contracts/REUSE-INDEX.md`).
- **Versioning**: no-overwrite-v1 convention — a committed run output under `runs/<space>/…` or an emitted brick is never mutated in place; a re-run writes a NEW versioned location (v2/), v1 stays intact for provenance.
- **Determinism**: the inter-step artifact flow (which files each step reads/writes) must be deterministic; everything inside a step is a black box (one prompt slot now, may split into N agents later with no wiring change).
- **Architecture precedence**: where an as-ran/pre-R1 brick diverges from architecture intent, the architecture wins.
- **Validation policy**: loose now (presence + declared top-level keys; refuse on missing load-bearing field), tightened later (field-continuity) with no rewiring.

## Key Decisions

<!-- The locked operator decisions from ONE-SHOT-SHELL §4 / STATE-OF-PROJECT §5. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Map the existing engine before planning (`.planning/codebase/`) | Brownfield reuse — assemble proven bricks, don't rewrite | — Pending |
| Step 0 produces `asset-classify/CLAIM-LIST.json`, consumed by Step 9 | Closes Step 9's dangling input; distinct from the bet-brief's competitor claim-type enum | — Pending |
| Funnel Architect (Step 7) consumes bet-brief AND product-intake.md | Both are required inputs, not optional | — Pending |
| Two-tier classification: Step 2 emits raw per-funnel; Step 3 canonicalizes across funnels | Correct producer grain for angle/claim/transformation | — Pending |
| Shell-first: wire at the artifact grain; drop prompts + field schemas in later | Separates mechanism from content — the whole strategy | — Pending |
| Source-of-truth precedence: architecture wins over as-ran | Prevents pre-R1 bricks from redefining step scope | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-06-26 after initialization*
