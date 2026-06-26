# Requirements: Marketing Pipeline Shell (Steps 0–10)

**Defined:** 2026-06-26
**Core Value:** `run all --space=smoke` completes end-to-end on stub prompts with zero orphan outputs / dangling inputs — the inter-step wiring is provably correct, independent of marketing quality.

> Source-of-truth precedence (rule #1): `standards/` → build-base architecture (`PART0`/`PART3`/`PART1`) → built `bet-compiler` SKILL → as-ran repo = reference only. Where an as-ran/pre-R1 brick diverges from the architecture, the architecture wins.

## v1 Requirements

Requirements for the runnable shell. Each maps to a roadmap phase.

### Artifact Store

- [ ] **STORE-01**: A `runs/<space>/` directory tree holds one declared file or folder per inter-step artifact, per the `SHELL-BUILD-SPEC.md §4` slot list (copied convention from `reference/as-ran-repo/repo-files/runs/arduview/`)
- [ ] **STORE-02**: A re-run never mutates a committed artifact in place; it writes a NEW versioned location (no-overwrite-v1 convention)
- [ ] **STORE-03**: A `_receipts/` run ledger records every step spawn (inputs hash + validator verdicts + ledger entry)
- [ ] **STORE-04**: Per-cell fan-out outputs use a disambiguating filename rule (e.g. `voc/market-signal/<niche>__<transformation>.json`)
- [ ] **STORE-05**: A `smoke` space can be created and reset for end-to-end test runs

### Run-Controller

- [ ] **CTRL-01**: A single command `run <step> --space=<s>` executes one step through the 7-phase loop (`PART3 §8`)
- [ ] **CTRL-02**: `run all --space=<s>` walks `pipeline.yaml` and runs all 11 steps in declared order
- [ ] **CTRL-03**: Preflight (phase 1) checks each step's input contracts; a missing input produces a named refusal, never improvisation (P3)
- [ ] **CTRL-04**: Plan-print (phase 2) declares the step's DAG before running
- [ ] **CTRL-05**: Context-assembly (phase 3) uses a script to embed the digest + corpus bytes so the agent never reads shared state directly
- [ ] **CTRL-06**: Spawn (phase 4) runs agent waves capped at ≤5 concurrent
- [ ] **CTRL-07**: Validate (phase 5) runs the step's blocking validator; a reject triggers bounded re-spawn (≤2) then escalation
- [ ] **CTRL-08**: Store+receipt (phase 6) writes outputs with no-overwrite versioning and records a receipt
- [ ] **CTRL-09**: `pipeline.yaml` lists the 11 step ids in canonical R1 order (`PART3 §1.5/§1.6` + `PART0`); reordering is a config edit, not a code change
- [ ] **CTRL-10**: A manifest loader reads the step manifests to sequence, route, and validate

### Step Manifests

- [ ] **MANI-01**: Each of the 11 steps has a declarative manifest (id, reads, writes, scripts pre/post, prompt, agents, validator, gate) per `SHELL-BUILD-SPEC.md §5`
- [ ] **MANI-02**: Each manifest's reads/writes match the architecture's consumption matrix (`PART3 §5.2`) and seam list (`§9`), derived from `PART0` and the per-step `briefs/STEP-00…10`
- [ ] **MANI-03**: Manifest pre/post scripts reuse existing engine bricks (`engine/bricks/`, `engine/hooks/`) per `engine/contracts/REUSE-INDEX.md` rather than re-authored glue
- [ ] **MANI-04**: Every declared output is consumed by a downstream step or is a terminal/operator-facing artifact (no orphan outputs)
- [ ] **MANI-05**: Every declared input has an upstream producer (no dangling inputs)

### Prompt Stubs

- [ ] **STUB-01**: Each step has a prompt stub carrying the standard envelope (frontmatter + ROLE + INPUTS + OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED), modeled on `skills/bet-compiler/SKILL.md`, with an empty body
- [ ] **STUB-02**: In STUB mode a step emits a minimal artifact whose top-level keys match its declared OUTPUT CONTRACT (mock emit)
- [ ] **STUB-03**: A stub envelope's `reads`/`writes` match its manifest

### Validators

- [ ] **VAL-01**: Each step has a validator that checks its output artifact exists and has the declared top-level keys (presence/shape)
- [ ] **VAL-02**: A missing or empty load-bearing field causes the validator to refuse (P3)
- [ ] **VAL-03**: Validators are invoked by the run-controller as blocking checks with a receipt — not trusted to the agent
- [ ] **VAL-04**: Validator structure permits adding field-continuity checks later (Job 5 / WB1) without rewiring

### Operator Gates

- [ ] **GATE-01**: The ★ gate steps (0, 1, 5, 7, 8, 10) block on an operator sign-off artifact
- [ ] **GATE-02**: A deferred or auto-approved gate is logged, never silently skipped
- [ ] **GATE-03**: In smoke mode, gates auto-approve and log

### Locked-Decision Wiring

- [ ] **WIRE-01**: Step 0 produces `asset-classify/CLAIM-LIST.json` and Step 9's manifest reads it (producer→consumer link closed)
- [ ] **WIRE-02**: Step 7's manifest reads both `bet-brief.md` and `product-intake.md` from Step 0 (both required)
- [ ] **WIRE-03**: Step 2 emits raw per-funnel angle/claim/transformation; Step 3 canonicalizes across funnels (two-tier)

### Smoke Acceptance

- [ ] **SMOKE-01**: `run all --space=smoke` completes end-to-end on stub prompts
- [ ] **SMOKE-02**: All preflights pass and all validators pass on declared top-level shapes
- [ ] **SMOKE-03**: Every artifact slot is written under `runs/smoke/`
- [ ] **SMOKE-04**: Every operator gate is logged
- [ ] **SMOKE-05**: The `_receipts/` chain is unbroken
- [ ] **SMOKE-06**: Zero orphan outputs / dangling inputs across the manifests (asserted by an acceptance check)

## v2 Requirements

Deferred to future milestones. Tracked but not in this roadmap. None block the shell.

### Content Drop-In

- **CONTENT-01**: Real prompt bodies per step (the marketing judgment) — `PART2 Job 7`
- **CONTENT-02**: Field-level seam schemas + a contract-congruence checker — `PART2 Job 5` / `OPEN-DECISIONS A2` / WB1
- **CONTENT-03**: Prompt-division (split a step into N named agents) — `PART2 Job 6`
- **CONTENT-04**: Marketing truth & thresholds (determination tests, currency model, whitespace-vs-scary, claim-typing taxonomy, pricing-anchor slot C1) — `Jobs 2–4`

### Phase B

- **PHASEB-01**: Production & launch extension (Asset-Describe hub, Visual-Branding pipeline, Funnel-Architect-as-hub, Video Strategist/Builder, HTML + Shopify implementers) — `architecture/PART5`, append-only

## Out of Scope

Explicitly excluded for this milestone.

| Feature | Reason |
|---------|--------|
| Rewriting the engine glue (fetch/clean/funnel/asset/aggregate) | The bricks are proven (`h6-all.sh` → 14/14 green); the shell assembles + orders them, never rewrites |
| Marketing quality / judgment | Deferred by design — the one thing explicitly allowed to be mediocre while the shell is proven |
| Field-grain congruence enforcement | Validators are loose now (top-level shape); field-continuity is added later with no rewiring |
| Reaching into the wider `basis/` reference mass or `_legacy/` | Scope guard — build from the routed `basis/build-base/` sources + `engine/` only |
| Phase B production & launch | Targets Steps 0–10 only; Phase B appends later with no rewiring |

## Traceability

Populated during roadmap creation. Each v1 requirement maps to exactly one phase.

| Requirement | Phase | Status |
|-------------|-------|--------|
| (pending roadmap) | — | Pending |

**Coverage:**
- v1 requirements: 36 total
- Mapped to phases: 0 (pending roadmap)
- Unmapped: 36 ⚠️

---
*Requirements defined: 2026-06-26*
*Last updated: 2026-06-26 after initial definition*
