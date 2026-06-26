# PMF Marketing Pipeline

## What This Is

A multi-step agentic marketing pipeline that turns a product *bet* into a written, audited sales funnel across eleven steps: **0 Bet → 1 Collect → 2 Funnel analysis → 3 Space map → 4 VOC market pass → 5 Market selection → 6 VOC deep pass → 7 Funnel architect → 8 Copywriter → 9 Asset classify → 10 Adversarial re-review** (canonical R1 order). The system separates **mechanism** (the deterministic *shell* — orchestrator, artifact store, per-step I/O contracts, validation, operator gates) from **content** (the marketing judgment inside each prompt and the field-level schemas at each seam). **This milestone builds the shell.**

## Core Value

A runnable shell of Steps 0–10 that completes **end-to-end on stub prompts** — every declared artifact produced and consumed, deterministic routing, operator gates logged, unbroken receipts chain, **zero orphan outputs / dangling inputs** — so real prompts and field schemas become pure drop-in slots and the only thing not-yet-good is marketing judgment.

## Requirements

### Validated

<!-- Existing, proven assets this milestone assembles on top of. -->

- ✓ Engine glue layer exists and is proven — `fetch`/`clean`/`funnel`/`asset`/`aggregate` bricks, `hooks/` (validators + DR-injectors), `integrations/` (Shopify/Cloudflare/Klaviyo/CDP), `contracts/schemas/`; `bash engine/contracts/h6-all.sh` → 14/14 green — existing (root `/engine`)
- ✓ Step 0 Bet Compiler built as the envelope yardstick — explicit OUTPUT CONTRACT + machine-checkable COMPLETENESS + HOW-IT'S-CONSUMED map — existing (`basis/build-base/skills/bet-compiler/SKILL.md`)
- ✓ Authoritative design/spec layer complete — `PART0` flow, `PART3` architecture (§8 orchestration, §9 seams, §5.2 consumption matrix), the 11 per-step `briefs/`, the soundness standards triad — existing (`basis/build-base/`)

### Active

<!-- This milestone: the shell. Building toward these. -->

- [ ] **Artifact store** — `runs/<space>/` tree, one declared file per inter-step artifact, no-overwrite versioning, run ledger
- [ ] **Run-controller** — `run <step>` / `run all --space=<s>`, the PART3 §8 7-phase loop (preflight → plan-print → context-assembly → spawn → validate → store+receipt → gates), `pipeline.yaml` ordering, manifest loader
- [ ] **11 step manifests** — reads/writes/scripts/prompt/validator/gate, derived from `PART0` + `PART3 §5.2`
- [ ] **11 prompt stubs** — bet-compiler envelope with mock emits (STUB mode)
- [ ] **Validators + gates + receipts** — presence/top-level-shape checks, refuse on missing load-bearing field, gates block-and-log, unbroken `_receipts/` chain
- [ ] **Smoke run** — `run all --space=smoke` completes clean; zero orphan outputs / dangling inputs
- [ ] **Locked operator decisions wired** — Step 0 → `CLAIM-LIST.json` → Step 9; Funnel Architect consumes bet-brief AND product-intake; two-tier angle/claim/transformation classification (Step 2 raw → Step 3 canonical)

### Out of Scope

<!-- This milestone only. Deferred items are real future work, not exclusions forever. -->

- Prompt bodies / marketing judgment — deferred drop-in slots (`PART2 Job 7`)
- Field-level seam schemas / contract-congruence checker — deferred (`PART2 Job 5` / `OPEN-DECISIONS A2`); tightens validators later with no rewiring
- Prompt-division (1 vs N agents per step) — deferred (`PART2 Job 6`); internal to a step, no inter-step rewiring
- Marketing truth & thresholds — determination tests, currency model, whitespace-vs-scary, claim taxonomy, pricing-anchor slot (`PART2 Jobs 2–4` / `OPEN-DECISIONS`)
- Phase B (production & launch) — Asset-Describe hub, Visual-Branding, Video Strategist/Builder, HTML + Shopify implementers — append-only future extension (`PART5`)
- Rewriting engine glue — assemble + order existing bricks; never rewrite the fetch/glue

## Context

- **Source of truth handed to GSD:** `basis/build-base/ONE-SHOT-SHELL.md` (read with `architecture/PART0`, `PART3`, `SHELL-BUILD-SPEC.md`, `STATE-OF-PROJECT.md`).
- **Engine location:** reuse root `/engine` (byte-identical to the former `build-base/engine/` — see `basis/build-base/ENGINE-AT-ROOT.md`); it is wired into `.claude/settings.json` (`route.js` PostToolUse, `guard-marketing.js` PreToolUse) and referenced by `engine/contracts/`. Find bricks via `engine/contracts/REGISTRY.json` (+ `REGISTRY.md` human view) and `REUSE-INDEX.md`.
- **Staleness:** `capability_inventory.md` and most pre-import top-level docs are stale; the recently-imported `basis/` (the pmf3 workspace) is current.
- **Wiring readiness ~70%** at the artifact grain (deterministic); field-grain continuity is the deferred gap (`OPEN-DECISIONS A2`).
- A prior `/gsd-new-project` run was reverted ("started over") — this init derives strictly from `basis/`, not generic domain research.

## Constraints

- **Precedence (rule #1):** `standards/` → build-base architecture (`PART0`/`PART3`/`PART1`) → built bet-compiler SKILL → as-ran repo (reference only). Where as-ran/old prompts disagree with the architecture, **the architecture wins.** (ONE-SHOT §3)
- **Wire at the artifact grain, not the prompt grain** — only inter-step artifact flow must be deterministic; step internals are black boxes. (ONE-SHOT §5.1)
- **Reuse engine bricks, don't rewrite** — assemble + order per the blueprint. (ONE-SHOT §5.4)
- **Scope guard** — target Steps 0–10 only; do not thread Phase B into the wiring now.
- **No-overwrite-v1 versioning** — committed run outputs / emitted bricks are never mutated in place on a re-run (project convention, `CLAUDE.md`).
- **Build strategy = shell-first** — wire now, drop prompts + field schemas in later.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Shell-first build (mechanism before content) | Prove wiring independent of marketing quality; prompts/schemas drop into slots later with no rewiring | — Pending |
| Skip generic domain research at init | Domain fully specified in `basis/`; web research drifts off-target (prior run reverted) | — Pending |
| Step 0 produces `CLAIM-LIST.json`, consumed by Step 9 | Closes Step 9's dangling input | — Pending |
| Step 7 Funnel Architect consumes bet-brief AND product-intake | Both required inputs, not optional | — Pending |
| Two-tier classification (Step 2 raw → Step 3 canonical) | Section Analyzer emits per-funnel; Space Classifier canonicalizes across all funnels | — Pending |
| Quality model profile + autonomous build (GSD) + Claude Workflows (xhigh) for heavy orchestration | Operator wants exhaustive correctness over speed/cost | — Pending |

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
3. Audit Out of Scope — reasons still valid? (the deferred content jobs `PART2 Jobs 2–8` and Phase B `PART5` become candidate next milestones)
4. Update Context with current state

---
*Last updated: 2026-06-26 after initialization*
