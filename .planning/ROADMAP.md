# Roadmap: Marketing Pipeline Shell (Steps 0–10)

## Overview

This roadmap builds a runnable **shell** of the 11-step agentic marketing pipeline (Steps 0 Bet → 10 Adversarial re-review) — deterministic plumbing that runs end-to-end on STUB prompts with zero orphan outputs / dangling inputs. The journey follows the one-shot build sequence in `basis/build-base/SHELL-BUILD-SPEC.md §9`: scaffold the `runs/<space>/` artifact store, build the 7-phase run-controller (`PART3 §8`), author the 11 declarative step manifests from the architecture's seam list + consumption matrix, drop in 11 prompt stubs with mock emits, wire the validators and operator gates, then run `run all --space=smoke` and fix until it is green. Every phase ASSEMBLES the existing proven engine bricks (`engine/bricks/`, `engine/hooks/`, `engine/contracts/`) per `engine/contracts/REUSE-INDEX.md` — it never rewrites the glue. Real prompt bodies and field-level schemas are deferred drop-in slots (v2). This is a CLI orchestration system; there is no frontend/UI.

**Precedence (rule #1):** `standards/` → build-base architecture (`PART0`/`PART3`) → built `bet-compiler` SKILL → as-ran repo = reference only. Where an as-ran/pre-R1 brick diverges from the architecture, the architecture wins.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Artifact Store** - Scaffold the `runs/<space>/` artifact-slot tree, no-overwrite versioning, the `_receipts/` ledger, and a resettable `smoke` space
- [ ] **Phase 2: Run-Controller** - Build the 7-phase loop, `pipeline.yaml`, and the manifest loader behind one `run` command
- [ ] **Phase 3: Step Manifests & Locked Wiring** - Author the 11 declarative step manifests from the architecture seam list, closing the producer→consumer graph (no orphans, no dangling)
- [ ] **Phase 4: Prompt Stubs** - Drop 11 standard-envelope prompt stubs with mock emits whose top-level keys match each OUTPUT CONTRACT
- [ ] **Phase 5: Validators & Operator Gates** - Wire per-step blocking validators (presence/shape) and the ★ operator gates (block-and-log, auto-approve in smoke)
- [ ] **Phase 6: Smoke Acceptance** - Run `run all --space=smoke` end-to-end and fix until it is green with zero orphan outputs / dangling inputs

## Phase Details

### Phase 1: Artifact Store
**Goal**: A `runs/<space>/` artifact store exists with one declared slot per inter-step artifact, no-overwrite-v1 versioning, a `_receipts/` run ledger, and a resettable `smoke` space — the deterministic namespace every later phase reads and writes.
**Depends on**: Nothing (first phase)
**Requirements**: STORE-01, STORE-02, STORE-03, STORE-04, STORE-05
**Source paths to read** (authoritative, in order):
  - `basis/build-base/SHELL-BUILD-SPEC.md §4` (artifact-store layout — the slot list rendered as paths; representative tree) and `§9 step 1` (scaffold order)
  - `basis/build-base/architecture/PART3--architecture-design.md §9` (the seam list — the authoritative set of artifacts that cross step boundaries; §4's tree is the §9 set rendered as paths)
  - `basis/build-base/ONE-SHOT-SHELL.md §6` (the artifact-slot orientation table; the per-step Reads/Writes overview) and `§5.7` (copy the `runs/<space>/` convention; new R1 artifacts get their own paths; per-cell fan-out needs a disambiguating filename rule)
  - `basis/build-base/reference/as-ran-repo/asran-repo-report.md` + `basis/build-base/reference/as-ran-repo/repo-files/runs/arduview/` (the de-risked `runs/<space>/` convention to copy — layout only, not contract)
  - `CLAUDE.md` no-overwrite-v1 convention (D-07/D-08/D-09) and `.planning/codebase/ARCHITECTURE.md` "State Management / Run-space convention" (how the engine already treats `runs/<space>/` as the per-run namespace)
**Success Criteria** (what must be TRUE):
  1. A `runs/smoke/` tree exists holding one declared file or folder slot per inter-step artifact in the `SHELL-BUILD-SPEC §4` / `PART3 §9` set (e.g. `bet-brief.md`, `asset-classify/CLAIM-LIST.json`, `brands.json`, `dumps/`, `funnels/`, `space-map.json`, `voc/market-signal/`, `market-selection.json`, `voc-bank/`, `funnel-brief.md`, `copy/`, `asset-records.json`, `review/`, `_receipts/`)
  2. Writing an artifact whose path already holds a committed file produces a NEW versioned location (e.g. `v2/` subdir or `-v2` suffix) and leaves v1 byte-identical (no-overwrite-v1 verified by re-write test)
  3. A `_receipts/` directory accepts a ledger entry per spawn recording `{inputs_hash, validator_verdicts, ledger_entry}`
  4. Per-cell fan-out outputs follow a documented disambiguating filename rule (e.g. `voc/market-signal/<niche>__<transformation>.json`) that yields a unique path per cell
  5. A `smoke` space can be created from empty and reset (cleared back to empty slots) by a single command, with no leftover artifacts
**Plans**: TBD

### Phase 2: Run-Controller
**Goal**: One command drives the architecture's 7-phase loop — preflight → plan-print → context-assembly → spawn → validate → store+receipt → operator gates — over a `pipeline.yaml` that lists the 11 step ids in canonical R1 order, with a manifest loader that sequences, routes, and validates from data (not code).
**Depends on**: Phase 1
**Requirements**: CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, CTRL-06, CTRL-07, CTRL-08, CTRL-09, CTRL-10
**Source paths to read** (authoritative, in order):
  - `basis/build-base/architecture/PART3--architecture-design.md §8` (the orchestration design — the VERBATIM 7-phase loop spec: 1 Preflight named-refusal, 2 Plan-print DAG, 3 Context-assembly script embeds digest+corpus bytes so the agent never Reads shared state, 4 Spawn waves ≤5 concurrent, 5 Validate blocking script → reject → bounded re-spawn ≤2 → escalate, 6 Store+receipt no-overwrite, 7 Operator gates)
  - `basis/build-base/architecture/PART3--architecture-design.md §1.5/§1.6` (the canonical R1/R2 step order for `pipeline.yaml`) and `basis/build-base/architecture/PART0--pipeline-flow.md` ("The flow, end to end" — the same order narrated step by step). NB **do NOT order from `PART3 §4.x`** (superseded reasoning trail) nor the pre-R1 phrasing in §6.4/§6.7.
  - `basis/build-base/SHELL-BUILD-SPEC.md §3` (the run-controller is the heart; the 7 phases prose) and `§9 step 2` (build the run-controller + `pipeline.yaml` + manifest loader)
  - `basis/build-base/ONE-SHOT-SHELL.md §5.2` (honor the architecture's own orchestration design as a requirement; `pipeline.yaml` order from §1.5/§1.6 or PART0, never §4.x)
  - `engine/WIRING-BUNDLE.md` and `engine/contracts/REGISTRY.md` (the engine entry doc + capability registry — what's reusable: every brick's I/O, run command, deps, health) and `engine/FIRING-MANIFEST.md` (how validators/router/injectors register + fire; the subagent caveat: hooks do NOT fire inside subagents, so the controller must invoke validators explicitly as steps)
  - `engine/contracts/REUSE-INDEX.md` (reuse vs re-author — the controller assembles + orders existing bricks; the context-assembly phase reuses `engine/bricks/funnel-analyzer-context.js`-style byte-embedding and `engine/hooks/inject-*.js` DR injectors) and `engine/DEPENDENCIES.md` (Node 20 + Python 3.12 + Playwright runtimes; do not introduce a novel stack)
**Success Criteria** (what must be TRUE):
  1. `run <step> --space=<s>` executes a single step through all 7 phases in order (preflight → plan-print → context-assembly → spawn → validate → store+receipt → gate) and writes a `_receipts/` entry
  2. `run all --space=<s>` reads `pipeline.yaml`, which lists the 11 step ids in canonical R1 order, and walks every step in that declared order
  3. A step whose declared input contract is unmet fails preflight (phase 1) with a NAMED refusal and never proceeds to spawn (no improvisation) — provable by deleting a required input and observing a named refusal
  4. Reordering steps is a `pipeline.yaml` edit only (no code change), and the spawn phase caps agent waves at ≤5 concurrent
  5. The manifest loader reads a step's manifest to determine its reads/writes/scripts/prompt/validator/gate and uses those declarations to sequence, route, and validate
**Plans**: TBD

### Phase 3: Step Manifests & Locked Wiring
**Goal**: All 11 steps have declarative manifests (id, reads, writes, pre/post scripts, prompt, agents, validator, gate) whose reads/writes match the architecture's consumption matrix and seam list, reuse existing engine bricks for pre/post scripts, and close the producer→consumer graph — including the three locked-decision links — so there are no orphan outputs and no dangling inputs.
**Depends on**: Phase 2
**Requirements**: MANI-01, MANI-02, MANI-03, MANI-04, MANI-05, WIRE-01, WIRE-02, WIRE-03
**Source paths to read** (authoritative, in order):
  - `basis/build-base/architecture/PART0--pipeline-flow.md` ("The flow, end to end", STEP 0–10 — each step's ingests→emits→feeds; the canonical job-logic spine for reads/writes)
  - `basis/build-base/architecture/PART3--architecture-design.md §5.2` (the consumption matrix — who reads what; **read every "Space Classifier" row as "STEP 3 synthesizer" per the §1.5 remap note**) and `§9` (the seam list, including the information-hygiene rule that each seam names what is WITHHELD as well as what flows) and `§6.x` (per-agent cards for manifest detail; **NB §4.x superseded, §6.4/§6.7 carry pre-R1 phrasing — defer to §1.5/§1.6 + PART0 on order/scope**)
  - All 11 per-step briefs `basis/build-base/briefs/STEP-00-bet-compiler.md` … `briefs/STEP-10-adversarial-review.md` (each brief's reads/writes/refuse-conditions/gate — the per-step manifest I/O detail)
  - `basis/build-base/SHELL-BUILD-SPEC.md §5` (the step-manifest schema, with the Step 2 worked example: `id/reads/writes/scripts.pre/scripts.post/prompt/agents/validator/gate`) and `§2` (wire at the ARTIFACT grain not the prompt grain; `agents: 1` now, splittable later with no wiring change)
  - `engine/contracts/REGISTRY.md` + `engine/contracts/REUSE-INDEX.md` (map each manifest's pre/post scripts to existing bricks: e.g. Step 1 `engine/bricks/fetch.js`/`clean.js`/`dedupe.js`; Step 2 `funnel-assemble.js`/`funnel-score.js`/`funnel-store.js`/`funnel-claim-tally.js`/`aggregate-mechanisms-in-play.js`; Step 6/8 `funnel-vectorize.js`/`funnel-rag-query.js`; Step 9 `asset-fetch.js`/`asset-map-rank.js`/`asset-emit.js`) and `engine/contracts/schemas/` + `engine/contracts/enums.json` (the record shapes + closed vocabularies the manifests' validators will reference)
  - `basis/build-base/ONE-SHOT-SHELL.md §4` (the three locked operator decisions to wire: WIRE-01 Step 0 produces `asset-classify/CLAIM-LIST.json` consumed by Step 9; WIRE-02 Step 7 reads BOTH `bet-brief.md` and `product-intake.md`; WIRE-03 Step 2 emits raw per-funnel angle/claim/transformation, Step 3 canonicalizes across funnels) and `§6` (the producer→consumer orientation table)
**Success Criteria** (what must be TRUE):
  1. Each of the 11 steps has a manifest file carrying `id, reads, writes, scripts.pre/post, prompt, agents, validator, gate`; every reads/writes path resolves to a `runs/<space>/` slot from Phase 1
  2. An acceptance check over the manifest set finds zero orphan outputs (every declared output is consumed by a downstream step OR is a terminal/operator-facing artifact) and zero dangling inputs (every declared input has an upstream producer)
  3. Manifest pre/post scripts reference existing `engine/bricks/`+`engine/hooks/` entries per `REUSE-INDEX.md` (no re-authored fetch/clean/funnel/asset/aggregate glue)
  4. Step 0's manifest writes `asset-classify/CLAIM-LIST.json` and Step 9's manifest reads it (WIRE-01 link closed); Step 7's manifest reads both `bet-brief.md` and `product-intake.md` (WIRE-02)
  5. Step 2's manifest writes raw per-funnel angle/claim/transformation fields and Step 3's manifest reads them and writes canonicalized cross-funnel values (WIRE-03 two-tier producer grain)
**Plans**: TBD

### Phase 4: Prompt Stubs
**Goal**: Every step ships a prompt-stub file carrying the standard envelope (frontmatter + ROLE + INPUTS + OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED) modeled on the built `bet-compiler` SKILL, with an empty body and a mock emit that writes a minimal artifact whose top-level keys match its declared OUTPUT CONTRACT — so the shell runs without any real marketing content.
**Depends on**: Phase 3
**Requirements**: STUB-01, STUB-02, STUB-03
**Source paths to read** (authoritative, in order):
  - `basis/build-base/skills/bet-compiler/SKILL.md` (the ONE built step = the envelope template: frontmatter + OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED — the yardstick every stub copies)
  - `basis/build-base/SHELL-BUILD-SPEC.md §6` (the prompt-stub envelope, with the Step 2 worked example: `--- step/reads/writes/status: STUB ---` frontmatter + `# ROLE / # INPUTS (refuse if missing — P3) / # OUTPUT CONTRACT / # COMPLETENESS / # HOW IT'S CONSUMED / # BODY`) and `§8` (mock-mode emit: in `status: STUB` the step writes a minimal artifact whose top-level keys match its OUTPUT CONTRACT; hardcoded sample values are fine) and `§9 step 4`
  - `basis/build-base/ONE-SHOT-SHELL.md §5.3` (prompts + field schemas are deferred drop-in slots; envelope is shell, body is content) and `§5.6` (the envelope is governed by the soundness triad — shape now, content deferred)
  - `basis/build-base/standards/SPEC-marketing-soundness.md`, `standards/marketing-rule-register.md`, `standards/BUILDER-DIRECTIVE.md` (the soundness triad that governs the envelope SHAPE — e.g. the grounding contract + `carried_risks[]` fields named in the envelope; their marketing CONTENT is deferred with the bodies)
  - The 11 per-step briefs `basis/build-base/briefs/STEP-00…10` (each step's OUTPUT CONTRACT top-level keys, sourced from the manifest reads/writes set in Phase 3) and `basis/build-base/architecture/PART3--architecture-design.md §6.x` (per-agent cards for the ROLE one-liner + INPUTS grain)
**Success Criteria** (what must be TRUE):
  1. Each of the 11 steps has a prompt-stub file carrying all six envelope parts (frontmatter + ROLE + INPUTS + OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED) with an empty `# BODY`, matching the `bet-compiler` SKILL structure
  2. Running a step in `status: STUB` emits a minimal artifact at its declared output slot whose top-level keys equal the OUTPUT CONTRACT keys (mock emit, hardcoded sample values acceptable)
  3. Each stub's frontmatter `reads`/`writes` are byte-equal to its Phase-3 manifest's reads/writes (envelope ↔ manifest congruence)
  4. The mock emit for every step writes to a slot that exists under `runs/smoke/` (no stub writes an undeclared path)
**Plans**: TBD

### Phase 5: Validators & Operator Gates
**Goal**: Every step has a blocking validator the run-controller invokes (presence + declared top-level keys, refuse on a missing load-bearing field, structured to accept field-continuity checks later without rewiring), and the six ★ gate steps (0, 1, 5, 7, 8, 10) block on an operator sign-off artifact that auto-approves and logs in smoke mode.
**Depends on**: Phase 4
**Requirements**: VAL-01, VAL-02, VAL-03, VAL-04, GATE-01, GATE-02, GATE-03
**Source paths to read** (authoritative, in order):
  - `basis/build-base/SHELL-BUILD-SPEC.md §7` (validation policy: presence + top-level keys NOW, refuse on missing/empty load-bearing field per P3; field-continuity added LATER as the same validators with no rewiring) and `§8` (gates block-and-log, auto-approve in smoke) and `§3` (validators are orchestrator-run with a receipt; gates: "deferred" is logged, never silent)
  - `basis/build-base/architecture/PART3--architecture-design.md §8 step 5` (validate phase: blocking script, reject → bounded re-spawn ≤2 → escalate) and `§8 step 7` (operator gates) and `§9` (which seams carry gates; the ★ steps)
  - `basis/build-base/ONE-SHOT-SHELL.md §5.3` (validators loose now: artifact exists + declared top-level keys, refuse on missing load-bearing field; field-congruence added later with no rewiring) and `§6` (the orientation table's ★ column marks gate steps 0, 1, 5, 7, 8, 10)
  - `engine/FIRING-MANIFEST.md` (how the existing firing layer registers + fires; the subagent caveat — controller calls validators explicitly) and `engine/hooks/validate-*.js` family + `engine/hooks/route.js` (the existing per-producer validators + filename router to REUSE/model — e.g. `validate-finder.js`, `validate-analyzer.js`, `validate-asset-record.js`) and `engine/contracts/enums.json` + `engine/contracts/schemas/` (the closed vocabularies + record shapes the presence/shape checks key on)
  - The 11 per-step briefs `basis/build-base/briefs/STEP-00…10` (each step's refuse-conditions + whether it carries an operator gate)
**Success Criteria** (what must be TRUE):
  1. Each of the 11 steps has a validator that exits pass when its output artifact exists with all declared OUTPUT CONTRACT top-level keys, and exits reject (refusal) when a load-bearing key is missing or empty
  2. The run-controller invokes each validator as a BLOCKING check in phase 5 (not trusted to the agent) and records the verdict in the step's `_receipts/` entry; a reject triggers bounded re-spawn (≤2) then escalation
  3. The six ★ gate steps (0, 1, 5, 7, 8, 10) block on an operator sign-off artifact; in smoke mode every gate auto-approves AND writes a gate-log entry (never silently skipped)
  4. A deferred or auto-approved gate produces a visible log entry distinguishable from a human approval
  5. Validator files are structured so a later field-continuity check (Job 5 / WB1) can be added to the same validator without changing any manifest wiring or controller call (extension point present)
**Plans**: TBD

### Phase 6: Smoke Acceptance
**Goal**: `run all --space=smoke` completes end-to-end on stub prompts — all preflights green, all validators green on declared top-level shapes, every artifact slot written under `runs/smoke/`, every operator gate logged, an unbroken `_receipts/` chain, and an acceptance check asserting zero orphan outputs / dangling inputs across the manifests. This is the binary definition-of-done gate.
**Depends on**: Phase 5
**Requirements**: SMOKE-01, SMOKE-02, SMOKE-03, SMOKE-04, SMOKE-05, SMOKE-06
**Source paths to read** (authoritative, in order):
  - `basis/build-base/SHELL-BUILD-SPEC.md §8` (the acceptance test: mock-mode e2e smoke run — what "complete" means) and `§11` (the definition of done, VERBATIM: all preflights green, all validators green on declared top-level shapes, every artifact slot written under `runs/smoke/`, every operator gate logged, unbroken `_receipts/` chain, zero orphan outputs / dangling inputs) and `§9 step 5` (run and fix until clean ← shell done)
  - `basis/build-base/ONE-SHOT-SHELL.md §7` (definition of done — outcomes, not method) and `§1` (the goal in one breath — the property the smoke run proves)
  - `.planning/PROJECT.md` Core Value (the binary gate) and Active requirements list (the green-smoke-run checklist)
  - `engine/contracts/h6-all.sh` + `engine/contracts/h5-e2e.sh` (the engine's own smoke pattern to mirror — `h6-all.sh` → 14/14 green proves the bricks; the new smoke run proves the orchestration on top) and `engine/contracts/REGISTRY.md` (confirm assembled bricks are green before the e2e run)
**Success Criteria** (what must be TRUE):
  1. `run all --space=smoke` exits clean (success) after walking all 11 steps end-to-end on stub prompts
  2. Every step's preflight passes and every step's validator passes on its declared top-level shape (no refusals, no escalations) — provable from the run log
  3. Every artifact slot declared across the 11 manifests is written under `runs/smoke/` after the run (no missing outputs)
  4. Every operator gate (steps 0, 1, 5, 7, 8, 10) has an auto-approve log entry, and the `_receipts/` chain has one unbroken entry per spawn (inputs hash + validator verdicts) with no gaps
  5. An acceptance check asserts zero orphan outputs and zero dangling inputs across the manifest set, and passes
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Artifact Store | 0/TBD | Not started | - |
| 2. Run-Controller | 0/TBD | Not started | - |
| 3. Step Manifests & Locked Wiring | 0/TBD | Not started | - |
| 4. Prompt Stubs | 0/TBD | Not started | - |
| 5. Validators & Operator Gates | 0/TBD | Not started | - |
| 6. Smoke Acceptance | 0/TBD | Not started | - |
