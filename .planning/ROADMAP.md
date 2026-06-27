# Roadmap: PMF Marketing Pipeline — Shell Milestone

## Overview

Build a runnable SHELL of the marketing pipeline (Steps 0–10) that completes end-to-end on STUB prompts. This is deterministic plumbing (mechanism), not marketing content. The journey: scaffold the `runs/<space>/` artifact store, assemble the PART3 §8 run-controller (7-phase loop + `pipeline.yaml` + manifest loader) from existing engine bricks, author the 11 step manifests that wire the producer→consumer graph, drop 11 prompt stubs with mock emits, wire the per-step validators + operator gates + receipts chain, then run `run all --space=smoke` until it completes clean. Done = every declared artifact produced and consumed, deterministic routing, gates logged, unbroken receipts, zero orphan outputs / dangling inputs. Real prompts and field schemas become pure drop-in slots; the only thing left not-yet-good is marketing judgment.

Derived strictly from `basis/build-base/SHELL-BUILD-SPEC.md` §3 (six components) and §9 (one-shot build sequence), `ONE-SHOT-SHELL.md` §4–§7, and `architecture/PART0` + `PART3 §8/§9/§5.2`. Reuses root `/engine` bricks (`bash engine/contracts/h6-all.sh` → 14/14 green) — assemble and order, never rewrite.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Artifact Store Scaffold** - Build the `runs/<space>/` tree, the §4 slot list, no-overwrite versioning, the `_receipts/` ledger, and a usable `smoke` space. (2026-06-26)
- [ ] **Phase 2: Run-Controller & Pipeline Spine** - Assemble the PART3 §8 7-phase loop, `pipeline.yaml` (R1 order), and the manifest loader from existing engine bricks.
- [ ] **Phase 3: Step Manifests (the wiring)** - Author 11 declarative manifests whose reads/writes close the producer→consumer graph (incl. WIRE-01 CLAIM-LIST link, WIRE-02 architect dual-input).
- [ ] **Phase 4: Prompt Stubs & Mock Emits** - Drop 11 bet-compiler-envelope stubs that emit minimal contract-shaped artifacts (incl. WIRE-03 two-tier classification).
- [ ] **Phase 5: Validators, Gates & Receipts** - Wire per-step presence/shape validators, block-and-log operator gates, and the unbroken receipts chain.
- [ ] **Phase 6: Smoke Run & Definition of Done** - Run `run all --space=smoke` to a clean end-to-end pass with zero orphans / dangling inputs.

## Phase Details

### Phase 1: Artifact Store Scaffold
**Goal**: A `runs/<space>/` artifact store exists with one declared slot per inter-step artifact, no-overwrite versioning, a run ledger, and a usable `smoke` space — the foundation every step reads from and writes to.
**Depends on**: Nothing (first phase)
**Requirements**: STORE-01, STORE-02, STORE-03, STORE-04, STORE-05
**Success Criteria** (what must be TRUE):
  1. `runs/<space>/` is scaffolded with one declared file/folder per inter-step artifact from the SHELL-BUILD-SPEC §4 slot list (bet-brief.md, asset-classify/CLAIM-LIST.json, brands.json, funnels/, space-map.json, voc/, market-selection.json, voc-bank/, funnel-brief.md, copy/, asset-records.json, review/), following the as-ran `runs/<space>/` convention.
  2. A re-run that would touch a committed output writes a NEW versioned location (e.g. `v2/` or `-v2` suffix); the v1 output stays byte-intact (project `no-overwrite-v1` convention).
  3. `runs/<space>/_receipts/` exists as a run ledger ready to record every spawn (inputs hash + validator verdicts).
  4. Per-cell fan-out outputs resolve to disambiguated filenames via a documented rule (e.g. `voc/market-signal/<niche>__<transformation>.json`).
  5. A `runs/smoke/` space exists and is usable as the target for acceptance runs.
**Plans**: 2 plans
Plans:
- [x] 01-01-PLAN.md — fan-out helper (STORE-04) + slot-tree scaffold (STORE-01) + smoke space (STORE-05) + full store-smoke.sh harness
- [x] 01-02-PLAN.md — whole-space version resolver (STORE-02) + _receipts/ ledger writer with sha256 inputs_hash (STORE-03)
**UI hint**: no

### Phase 2: Run-Controller & Pipeline Spine
**Goal**: A single command (`run <step>` / `run all --space=<s>`) drives the PART3 §8 7-phase loop over `pipeline.yaml` in canonical R1 order, assembled from existing engine bricks — not rewritten.
**Depends on**: Phase 1
**Requirements**: CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, CTRL-06, CTRL-07, CTRL-08, CTRL-09, CTRL-10, CTRL-11, CTRL-12
**Success Criteria** (what must be TRUE):
  1. `run <step> --space=<s>` executes one step through all seven phases (preflight → plan-print → context-assembly → spawn → validate → store+receipt → gates), and `run all --space=<s>` walks `pipeline.yaml` step ids in canonical R1 order end-to-end.
  2. `pipeline.yaml` lists the 11 step ids in R1 order and a manifest loader reads the per-step manifests to sequence, route, and validate; reordering steps is a config edit, not a code change.
  3. Preflight refuses by name on a missing input contract (never improvises); plan-print declares the step's DAG before running; context-assembly embeds the digest + corpus bytes so the agent never Reads shared state directly.
  4. Spawn runs agent waves capped at ≤5; validate runs the blocking validator with bounded re-spawn (≤2) then escalate; store+receipt writes output under no-overwrite versioning and emits a receipt; the gate phase blocks on a sign-off artifact (auto-approve in smoke).
  5. The run-controller is assembled from existing engine bricks / `hooks/` / `route.js` per `FIRING-MANIFEST.md` — the deterministic glue is reused, not re-authored.
**Plans**: 2 plans
Plans:
- [x] 02-01-PLAN.md — pipeline.yaml (R1) + fixture manifest set + controller-smoke.sh acceptance harness (authored RED)
- [x] 02-02-PLAN.md — run-controller.js (PART3 §8 7-phase loop assembled from bricks) + bin/run entrypoint (turns the harness GREEN)

### Phase 3: Step Manifests (the wiring)
**Goal**: Eleven declarative step manifests (0–10) exist whose `reads`/`writes` match PART0 + PART3 §5.2, closing the producer→consumer graph — no orphan outputs, no dangling inputs — with the locked CLAIM-LIST and architect-input decisions wired in.
**Depends on**: Phase 2
**Requirements**: MANIFEST-01, MANIFEST-02, MANIFEST-03, MANIFEST-04, WIRE-01, WIRE-02
**Success Criteria** (what must be TRUE):
  1. One manifest per step (0–10) exists carrying `reads`/`writes`/`scripts`/`prompt`/`agents`/`validator`/`gate`, with each manifest's `reads`/`writes` matching the PART3 §5.2 consumption matrix — every output has a downstream consumer or is terminal/operator-facing, every input has an upstream producer.
  2. The Step 0 manifest writes `asset-classify/CLAIM-LIST.json` and the Step 9 manifest reads it (WIRE-01 — closes Step 9's former dangling input).
  3. The Step 7 manifest reads BOTH `bet-brief.md` AND `product-intake.md` as required inputs (WIRE-02).
  4. Operator-gate steps (0, 1, 5, 7, 8, 10) are flagged `gate:true` per the §6 slot table; all others `gate:false`.
  5. Pre/post `scripts` reference existing engine bricks where one exists (resolved via `engine/contracts/REGISTRY.json` + `REUSE-INDEX.md`), not re-authored glue.
**Plans**: TBD

### Phase 4: Prompt Stubs & Mock Emits
**Goal**: Eleven stub prompts on the bet-compiler envelope exist, each emitting a minimal artifact whose top-level keys match its OUTPUT CONTRACT — so a contract-shaped artifact lands for every step with the body deferred.
**Depends on**: Phase 3
**Requirements**: STUB-01, STUB-02, STUB-03, STUB-04, WIRE-03
**Success Criteria** (what must be TRUE):
  1. One stub prompt exists per step on the bet-compiler envelope (frontmatter + ROLE + INPUTS-refuse + OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED + empty BODY), and each stub's `reads`/`writes` match its step manifest.
  2. In STUB mode each step emits a minimal artifact whose top-level keys match its OUTPUT CONTRACT (hardcoded sample values acceptable), so every artifact slot can be produced without any real prompt body.
  3. The Step 2 stub emits raw per-funnel angle/claim/transformation and the Step 3 stub canonicalizes them across funnels (WIRE-03 — two-tier classification).
  4. The envelope shape follows the soundness triad (`SPEC-marketing-soundness` / `marketing-rule-register` / `BUILDER-DIRECTIVE`) — shape declared now, marketing content deferred.
**Plans**: TBD

### Phase 5: Validators, Gates & Receipts
**Goal**: Every step's output is presence/shape-validated, every operator gate blocks-and-logs (auto-approve in smoke), and every spawn writes a receipt — producing an unbroken `_receipts/` chain that proves the run without trusting the orchestrator.
**Depends on**: Phase 4
**Requirements**: VALID-01, VALID-02, VALID-03, VALID-04, VALID-05
**Success Criteria** (what must be TRUE):
  1. A per-step validator checks the output artifact exists and carries its declared OUTPUT CONTRACT top-level keys, and refuses on a missing/empty load-bearing field (P3) — never improvises a value.
  2. Validators are loose now (presence/shape only); field-continuity checks are deferred and addable to the same validators with no rewiring.
  3. Every spawn writes a receipt (inputs hash + validator verdicts + ledger entry); the `_receipts/` chain is unbroken across a run.
  4. Operator gates block-and-log: a "deferred"/auto-approve decision is recorded in the ledger, never silent.
**Plans**: TBD

### Phase 6: Smoke Run & Definition of Done
**Goal**: `run all --space=smoke` completes end-to-end on stub prompts — the shell is proven correct, with prompts and field schemas now pure drop-in slots.
**Depends on**: Phase 5
**Requirements**: SMOKE-01, SMOKE-02, SMOKE-03, SMOKE-04, SMOKE-05
**Success Criteria** (what must be TRUE — this is the DoD from ONE-SHOT §7 / SHELL-BUILD-SPEC §11):
  1. `run all --space=smoke` completes end-to-end on stub prompts (all 11 steps 0–10).
  2. All preflights green; all validators green on declared top-level shapes.
  3. Every artifact slot is written under `runs/smoke/`.
  4. Every operator gate is logged and the `_receipts/` chain is unbroken across the run.
  5. Zero orphan outputs / dangling inputs across the manifests — the producer→consumer graph closes.
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Artifact Store Scaffold | 2/2 | Complete | 2026-06-26 |
| 2. Run-Controller & Pipeline Spine | 0/2 | Planned | - |
| 3. Step Manifests | 0/TBD | Not started | - |
| 4. Prompt Stubs & Mock Emits | 0/TBD | Not started | - |
| 5. Validators, Gates & Receipts | 0/TBD | Not started | - |
| 6. Smoke Run & Definition of Done | 0/TBD | Not started | - |
