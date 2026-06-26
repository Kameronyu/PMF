# Requirements: PMF Marketing Pipeline — Shell Milestone

**Defined:** 2026-06-26
**Core Value:** A runnable shell of Steps 0–10 that completes end-to-end on stub prompts — every declared artifact produced and consumed, deterministic routing, gates logged, unbroken receipts, zero orphan outputs / dangling inputs.

> Scope: the **shell** (mechanism). Source of truth: `basis/build-base/ONE-SHOT-SHELL.md` + `SHELL-BUILD-SPEC.md` + `architecture/PART0` + `PART3 §8/§9/§5.2`. Reuse root `/engine` bricks — assemble, do not rewrite.

## v1 Requirements

Requirements for the runnable shell. Each maps to exactly one roadmap phase.

### Artifact Store (STORE)

- [ ] **STORE-01**: `runs/<space>/` tree is scaffolded with one declared file/folder per inter-step artifact (the §4 slot list), convention copied from the as-ran `runs/<space>/` layout
- [ ] **STORE-02**: No-overwrite versioning — a re-run writes a NEW versioned location; v1 output stays intact (project `no-overwrite-v1` convention)
- [ ] **STORE-03**: Run ledger at `runs/<space>/_receipts/` exists and records every spawn (inputs hash, validator verdicts)
- [ ] **STORE-04**: Per-cell fan-out outputs use a disambiguating filename rule (e.g. `voc/market-signal/<niche>__<transformation>.json`)
- [ ] **STORE-05**: A `smoke` space exists and is usable for acceptance runs

### Run-Controller (CTRL)

- [ ] **CTRL-01**: `run <step> --space=<s>` executes a single step through the PART3 §8 7-phase loop
- [ ] **CTRL-02**: `run all --space=<s>` walks `pipeline.yaml` step ids in canonical R1 order end-to-end
- [ ] **CTRL-03**: Phase 1 Preflight checks the step's input contracts; a missing input produces a named refusal (never improvise)
- [ ] **CTRL-04**: Phase 2 Plan-print declares the step's DAG before running
- [ ] **CTRL-05**: Phase 3 Context-assembly script embeds the digest + corpus bytes so the agent never Reads shared state directly
- [ ] **CTRL-06**: Phase 4 Spawn runs agent waves capped at ≤5
- [ ] **CTRL-07**: Phase 5 Validate runs the blocking validator; reject → bounded re-spawn (≤2) → escalate
- [ ] **CTRL-08**: Phase 6 Store+receipt writes output with no-overwrite versioning and emits a receipt
- [ ] **CTRL-09**: Phase 7 Operator gates block on a sign-off artifact (auto-approve in smoke) and are logged, never silent
- [ ] **CTRL-10**: `pipeline.yaml` lists step ids in R1 order; reordering steps is a config edit, not a code change
- [ ] **CTRL-11**: A manifest loader reads the per-step manifests to sequence, route, and validate
- [ ] **CTRL-12**: The run-controller is assembled from existing engine bricks / `hooks/` / `route.js` per `FIRING-MANIFEST.md`, not rewritten

### Step Manifests (MANIFEST)

- [ ] **MANIFEST-01**: One declarative manifest exists per step (0–10) with `reads`/`writes`/`scripts`/`prompt`/`agents`/`validator`/`gate`
- [ ] **MANIFEST-02**: Each manifest's `reads`/`writes` match `PART0` + `PART3 §5.2` (the consumption matrix) — no orphan outputs, no dangling inputs
- [ ] **MANIFEST-03**: Operator-gate steps are flagged `gate:true` (0, 1, 5, 7, 8, 10 per the §6 slot table); all others `gate:false`
- [ ] **MANIFEST-04**: Pre/post `scripts` reference existing engine bricks where one exists (found via `engine/contracts/REGISTRY.json` + `REUSE-INDEX.md`)

### Prompt Stubs (STUB)

- [ ] **STUB-01**: One stub prompt exists per step on the bet-compiler envelope (frontmatter + ROLE + INPUTS-refuse + OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED + empty BODY)
- [ ] **STUB-02**: Each stub's `reads`/`writes` match its step manifest
- [ ] **STUB-03**: In STUB mode each step emits a minimal artifact whose top-level keys match its OUTPUT CONTRACT (mock emit; hardcoded sample values acceptable)
- [ ] **STUB-04**: The envelope shape follows the soundness triad (`SPEC-marketing-soundness` / `marketing-rule-register` / `BUILDER-DIRECTIVE`) — shape now, marketing content deferred

### Validators, Gates & Receipts (VALID)

- [ ] **VALID-01**: A per-step validator checks the output artifact exists and carries its declared top-level keys (OUTPUT CONTRACT shape)
- [ ] **VALID-02**: A validator refuses on a missing/empty load-bearing field (P3) — never improvise a value
- [ ] **VALID-03**: Validators are loose now (presence/shape); field-continuity checks are deferred and addable to the same validators with no rewiring
- [ ] **VALID-04**: Every spawn writes a receipt (inputs hash + validator verdicts + ledger entry); the `_receipts/` chain is unbroken
- [ ] **VALID-05**: Operator gates block-and-log; a "deferred"/auto-approve decision is recorded, never silent

### Smoke Run & Definition of Done (SMOKE)

- [ ] **SMOKE-01**: `run all --space=smoke` completes end-to-end on stub prompts
- [ ] **SMOKE-02**: All preflights green; all validators green on declared top-level shapes
- [ ] **SMOKE-03**: Every artifact slot is written under `runs/smoke/`
- [ ] **SMOKE-04**: Every operator gate is logged; the `_receipts/` chain is unbroken across the run
- [ ] **SMOKE-05**: Zero orphan outputs / dangling inputs across the manifests (the producer→consumer graph closes)

### Locked Operator Decisions Wired (WIRE)

- [ ] **WIRE-01**: Step 0 emits `asset-classify/CLAIM-LIST.json` and the Step 9 manifest reads it (closes Step 9's dangling input)
- [ ] **WIRE-02**: The Step 7 manifest reads `bet-brief.md` AND `product-intake.md` (both required inputs)
- [ ] **WIRE-03**: The Step 2 stub emits raw per-funnel angle/claim/transformation; the Step 3 stub canonicalizes them across funnels (two-tier classification)

## v2 Requirements

Deferred to future milestones. Tracked but not in this roadmap.

### Content drop-in (CONTENT)

- **CONTENT-01**: Real prompt bodies dropped into each step's stub slot, step by step (`PART2 Job 7`)
- **CONTENT-02**: Field-level seam schemas + contract-congruence checker (`PART2 Job 5` / `OPEN-DECISIONS A2`) — tightens existing validators, no rewiring
- **CONTENT-03**: Prompt-division (split a step into N named agents) where specified (`PART2 Job 6`) — internal to a step
- **CONTENT-04**: Marketing truth & thresholds — determination tests, currency model, whitespace-vs-scary, claim taxonomy, pricing-anchor slot (`PART2 Jobs 2–4`)

### Phase B — production & launch (PHASEB)

- **PHASEB-01**: Append-only extension — Asset-Describe hub, Visual-Branding pipeline, Funnel-Architect-as-hub, Video Strategist/Builder, HTML + Shopify implementers (`PART5`); adds manifests + artifact slots + `pipeline.yaml` rows with no rewiring

## Out of Scope

Explicitly excluded from this milestone. Documented to prevent scope creep.

| Feature | Reason |
|---------|--------|
| Marketing judgment / prompt bodies | This milestone is mechanism, not content; bodies drop into slots later |
| Field-level seam schemas | Deferred to the seam field-map (Job 5); shell runs on top-level-shape validators |
| Rewriting engine glue (fetch/clean/route) | Proven bricks exist (14/14 green) — assemble + order, never rewrite |
| Phase B (production & launch) | Append-only future extension; shell targets Steps 0–10 only |
| Resolving OPEN-DECISIONS (A1–A3, L1/L3/L6, C1, GAP-1…6) | Marketing-content decisions; none block the shell |

## Traceability

Which phases cover which requirements. Populated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| _(populated by roadmapper)_ | — | Pending |

**Coverage:**
- v1 requirements: 33 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 33 ⚠️

---
*Requirements defined: 2026-06-26*
*Last updated: 2026-06-26 after initial definition*
