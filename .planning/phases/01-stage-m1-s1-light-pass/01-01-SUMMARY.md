---
phase: 01-stage-m1-s1-light-pass
plan: "01"
subsystem: prompts
tags: [step1-light-pass, schema, enums, sophistication, competitive-axis, awareness, semrush, saturation]

# Dependency graph
requires: []
provides:
  - "prompts/step1-light-pass.md reconciled: awareness-stripped, D-03 ladder inlined, D-08/D-11/D-12 schema locked"
affects:
  - 01-stage-m1-s1-light-pass (plans 02-05 all consume the updated master spec)
  - market-selection skill (reads space-map.json competitive_axis per D-12 Gate-2)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Closed-enum discipline: COMPETITIVE_AXIS_ENUM + CLAIM_TYPE_ENUM + CHANNEL_ENUM are the only classifier-assigned enums; AWARENESS_ENUM removed (D-05)"
    - "Per-cell saturation: saturation schema keyed transformation x niche, never pooled (D-08)"
    - "Semrush-API as primary visits_source; similarweb-manual as fallback only (D-11)"
    - "Sophistication stage derived from claim_type distribution, never eyeballed (D-03/D-04)"

key-files:
  created: []
  modified:
    - "prompts/step1-light-pass.md — reconciled master light-pass prompt (collector half)"

key-decisions:
  - "Awareness (awareness/awareness_basis) removed from light pass entirely — per D-05, per-creative tag is not decision-useful for the market-pick map; real awareness read is Phase 2 per-funnel"
  - "Sophistication ladder inlined verbatim from D-03 into AGENT 3; stage call is now explicitly wired to claim_type distribution (D-04)"
  - "Saturation example fixed to carry niche key per row — prevents model training on pooled output (D-08)"
  - "visits_source enum corrects similarweb-api to semrush-api (D-11); similarweb-manual fallback preserved"
  - "competitive_axis (D-12) was already present in file before this plan; all four acceptance criteria confirmed passing"

patterns-established:
  - "Prompt spec is the upstream contract — schema examples train model output shape; a pooled example trains pooled output even if prose says otherwise"
  - "One-writer-per-file: Classifier solely owns space-map.json; Dumper guard explicitly forbids classifying competitive_axis"

requirements-completed: [TOOL-01]

# Metrics
duration: 25min
completed: 2026-06-03
---

# Phase 01 Plan 01: Strip awareness, inline sophistication ladder, reconcile schema enums (D-05/D-03/D-08/D-11/D-12)

**step1-light-pass.md reconciled to locked decisions: awareness stripped from all four locations, verbatim D-03 sophistication ladder inlined into AGENT 3, saturation schema keyed per combo cell (D-08), visits_source enum names semrush-api (D-11), competitive_axis fully wired (D-12)**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-06-03T00:00:00Z
- **Completed:** 2026-06-03
- **Tasks:** 4 (Tasks 1-3 had edits; Task 4 was already complete)
- **Files modified:** 1

## Accomplishments

- Awareness and awareness_basis removed from all four locations in the spec (dump.json schema, closed-enums block, DUMPER hook, AGENT 2 prompt); one D-05 rationale line added to OPEN DECISIONS
- Verbatim D-03 SOPHISTICATION block (5 stages + mechanical rule + 5+ RULE + evidence requirement) inlined into AGENT 3; step 4 instruction now reads "read off the cell's claim_type distribution per the SOPHISTICATION block below — never eyeball the stage"
- Saturation schema example fixed from pooled (transformation-only key) to per-cell (transformation x niche key); visits_source enum corrected from similarweb-api to semrush-api; revenue-est.js scaffold prose names Semrush as primary
- Confirmed competitive_axis (D-12) fully wired: per_brand schema fields, COMPETITIVE_AXIS_ENUM in closed-enums block, AGENT 3 assigns it page-evidenced per brand, Dumper guard forbids classification

## Task Commits

1. **Task 1: Strip awareness (D-05) from all four locations** - `ba2c224` (feat)
2. **Task 2: Inline verbatim D-03 sophistication ladder into AGENT 3** - `fc97d7c` (feat)
3. **Task 3: Reconcile saturation schema (D-08) + visits_source enum (D-11)** - `d5a96aa` (feat)
4. **Task 4: Verify competitive_axis (D-12)** - no new commit (already complete in prior revision)

## Files Created/Modified

- `prompts/step1-light-pass.md` — reconciled master light-pass prompt; awareness-stripped, D-03 ladder inlined, D-08/D-11/D-12 schema locked to decisions

## Decisions Made

- Task 4 required no edits — competitive_axis (D-12) was added in the prior revision round (commit 999756d) before this plan executed. All acceptance criteria confirmed via grep before skipping the commit.
- Saturation example uses `brand_count: 3, saturated: false` to match the combos example (`focus-productivity x students` at brand_count 3) — internally consistent, not contradicting.
- revenue-est.js scaffold prose updated to name Semrush Trends API as primary (not just the enum token change) for full D-11 consistency.

## Deviations from Plan

None — plan executed exactly as written. Task 4 had no edits because the prior D-12 addition already satisfied all acceptance criteria.

## Issues Encountered

- The worktree Edit tool required absolute paths (not `cd` + relative); switched to absolute path edits after the first attempt.
- Initial grep verification ran against `/home/kyu3/PMF/prompts/` (shared checkout) rather than the worktree path — corrected to use absolute worktree path throughout.

## User Setup Required

None — no external service configuration required. This plan is a prompt/schema text edit only.

## Next Phase Readiness

- `prompts/step1-light-pass.md` is the locked master spec for plans 02-05 in this phase
- Plan 02 (fetch.js) and Plan 03 (revenue-est.js) can read the visits_source:"semrush-api" enum correctly
- Plan 04 (validate-classifier.js) can enforce COMPETITIVE_AXIS_ENUM and the per-cell saturation shape
- Plan 05 (reference debug run) has the correct sophistication ladder to produce hookable stage calls

---
*Phase: 01-stage-m1-s1-light-pass*
*Completed: 2026-06-03*
