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
- ✓ **Artifact store** — `runs/<space>/` slot tree (10 dirs + 16 stub slots), idempotent `store-scaffold.js`, whole-space no-overwrite-v1 resolver (`space-version.js`), `_receipts/` ledger writer with sha256 inputs_hash (`receipt-write.js`), `__`-join fan-out namer (`fanout-path.js`), usable `smoke` space, `store-smoke.sh` acceptance harness green (STORE-01..05) — Validated in Phase 1: Artifact Store Scaffold (`engine/bricks/`, `engine/contracts/store-smoke.sh`)
- ✓ **Run-controller** — `bin/run` + `run-controller.js`, the PART3 §8 7-phase loop (preflight → plan-print → context → spawn → validate → store+receipt → gate), `pipeline.yaml` R1 ordering, manifest loader, run-all completeness preflight — v1.0 (CTRL-01..12, SMOKE-05; `controller-smoke.sh` green)
- ✓ **11 step manifests** — `engine/manifests/00..10-*.json` reads/writes/scripts/prompt/validator/gate; producer→consumer graph closed (orphans=0/dangling=0); gates {0,1,5,7,8,10} — v1.0 (MANIFEST-01..04, WIRE-01/02; `manifest-smoke.sh` green)
- ✓ **11 prompt stubs + mock emits** — `prompts/00..10-*.md` bet-compiler envelope w/ marked BODY slots + STUB-mode multi-write emits; WIRE-03 two-tier classification — v1.0 (STUB-01..04, WIRE-03; `stub-smoke.sh` green)
- ✓ **Validators + gates + receipts** — `validate-shape.js` + `output-shapes.json` (all outputs), preflight hollow-input refusal, gate block-and-log, receipt `validator_verdicts` + `gate.decision`, unbroken chain — v1.0 (VALID-01..05; `validate-smoke.sh` green)
- ✓ **Smoke run / Definition of Done** — `run all --space=smoke --smoke` completes clean end-to-end; zero orphan/dangling over the real run; deterministic; `smoke-dod.sh` the 7th gate — v1.0 (SMOKE-01..05)
- ✓ **Locked operator decisions wired** — Step0 → `CLAIM-LIST.json` → Step9 (WIRE-01); Step7 reads bet-brief AND product-intake (WIRE-02); Step2 raw → Step3 canonical, all 5 axes traced (WIRE-03) — v1.0

### Active

<!-- Next milestone — not yet scoped. Candidates are the deferred CONTENT/PHASEB jobs in Out of Scope. Run /gsd-new-milestone. -->
- (none — v1.0 Shell shipped 2026-06-28; next milestone undefined)

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
- **Shipped state (v1.0, 2026-06-28):** artifact-grain wiring is 100% — `run all --space=smoke --smoke` completes end-to-end on stubs, zero orphan/dangling over the real run, 7 acceptance gates green (`store-/controller-/manifest-/stub-/validate-/smoke-dod` + engine `h6-all`). Field-grain continuity remains the deferred gap (CONTENT-02 / `OPEN-DECISIONS A2`) — addable to the existing validators with no rewiring. Build artifacts: `engine/manifests/*.json`, `prompts/*.md`, `engine/contracts/*-smoke.sh`, `engine/hooks/validate-shape.js`. Branch `pmf-shell-build` (not yet merged/pushed).
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
| Shell-first build (mechanism before content) | Prove wiring independent of marketing quality; prompts/schemas drop into slots later with no rewiring | ✓ Good — v1.0 ships with every real prompt body a marked drop-in slot; validators tighten in place via CONTENT-02 with no rewiring |
| Skip generic domain research at init | Domain fully specified in `basis/`; web research drifts off-target (prior run reverted) | ✓ Good — build derived strictly from `basis/`, no drift |
| Step 0 produces `CLAIM-LIST.json`, consumed by Step 9 | Closes Step 9's dangling input | ✓ Good — WIRE-01 wired + gated (manifest-smoke green) |
| Step 7 Funnel Architect consumes bet-brief AND product-intake | Both required inputs, not optional | ✓ Good — WIRE-02 wired (manifest-smoke green) |
| Two-tier classification (Step 2 raw → Step 3 canonical) | Section Analyzer emits per-funnel; Space Classifier canonicalizes across all funnels | ✓ Good — WIRE-03, all 5 axes traced (stub-smoke green) |
| Quality model profile + autonomous build (GSD) + Claude Workflows (xhigh) for heavy orchestration | Operator wants exhaustive correctness over speed/cost | ✓ Good — per-phase xhigh adversarial verify caught real harness/validator false-greens every phase; all fixed |
| Per-phase xhigh adversarial verification as a hard gate | Catch false-greens the GSD verify/review passes miss | ✓ Good — caught a high-sev receipt overwrite (P1), DoS + harness false-greens (P2–5); Phase 6 came back clean |
| Engine flake fixed at root (h5-e2e pinned to deterministic stub backend) | A live-Voyage network call made the regression gate nondeterministic | ✓ Good — operator granted full control over pre-existing engine; gates now deterministic |

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
*Last updated: 2026-06-28 — after v1.0 Shell milestone (all 6 phases, 38/38 requirements, 7 gates green)*
