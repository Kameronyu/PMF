---
phase: 01-stage-m1-s1-light-pass
plan: "04"
subsystem: hooks
tags: [validator, bet_type, demand_trend, hooks, open-categorization]
dependency_graph:
  requires: [01-01, 01-03]
  provides: [validate-classifier enforcement of open bet_type + demand_trend]
  affects: [space-map.json PostToolUse gate]
tech_stack:
  added: []
  patterns: [Node.js validator, Set-based closed enum, open-field traceability check]
key_files:
  created: []
  modified:
    - tools/hooks/validate-classifier.js
decisions:
  - "bet_type is OPEN (D-14): reject null/empty + missing basis + untraceable canonical variants — NEVER enum-check. COMPETITIVE_AXIS_ENUM removed entirely."
  - "demand_trend.shape is a CLOSED enum (D-15): shape:unknown is the legal escape valve — reject a missing demand_trend field or off-enum shape."
metrics:
  duration_minutes: 8
  completed_date: "2026-06-03"
  tasks_completed: 2
  files_modified: 1
---

# Phase 01 Plan 04: Validator revision — open bet_type + demand_trend reject Summary

Two surgical edits to `tools/hooks/validate-classifier.js`: replaced the SUPERSEDED closed `competitive_axis` enum reject (amend-D-12) with an OPEN `bet_type` traceability reject (null/empty + missing basis + untraceable canonical variants, never enum-checked per D-14), and added the `demand_trend` missing + off-enum shape reject (D-15) with `shape:"unknown"` as the legal escape valve.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | amend-D-12: replace competitive_axis enum with OPEN bet_type rule | 258d291 | tools/hooks/validate-classifier.js |
| 2 | D-15: reject demand_trend missing + off-enum shape | 94d473e | tools/hooks/validate-classifier.js |

## What Was Built

**Task 1 (amend-D-12):**
- Removed `COMPETITIVE_AXIS_ENUM` const and all `competitive_axis` reject logic (Rules 6-7 in prior build)
- Added canonical `bet_types[]` traceability loop: rejects any canonical bet_type whose `raw_variants` array is empty (mirrors the transformation/niche/angle traceability pattern)
- Rule 6 (amend-D-12): rejects `per_brand` entry with null/empty/missing `bet_type` — OPEN field, never enum-checked
- Rule 7 (amend-D-12): rejects `per_brand` entry where `bet_type` is set but `bet_type_basis` is missing or empty
- Updated header comment lines 6-7 to reflect amend-D-12

**Task 2 (D-15):**
- Added `DEMAND_TREND_SHAPE_ENUM = new Set(['steady', 'rising', 'parabolic-spike', 'declining', 'unknown'])` const
- Added D-15 block inside the per_brand loop: rejects if `demand_trend` is missing/null/non-object; rejects if `demand_trend.shape` is off the closed enum
- `shape:"unknown"` is in the enum (legal escape valve) — NOT rejected
- Updated header comment with Rule 9 for D-15

## Verification

All acceptance criteria and functional smokes passed:

**Task 1 smokes:**
- `bet_type: null` → exit 2 (correct rejection)
- `bet_type: "premium-hardware"` + empty `bet_type_basis` → exit 2 (correct rejection)
- `bet_type: "some-novel-bet-name"` (off any prior list) + valid basis → exit 0 (open field, no enum check)

**Task 2 smokes:**
- Missing `demand_trend` field → exit 2 (correct rejection)
- `demand_trend.shape: "fad"` (off-enum) → exit 2 (correct rejection)
- `demand_trend.shape: "unknown"` (escape valve) → exit 0 (legal)
- `demand_trend.shape: "parabolic-spike"` → exit 0 (legal)

**Static checks:**
- `grep -c 'competitive_axis'` → 0 (fully removed)
- `grep -c 'COMPETITIVE_AXIS_ENUM'` → 0 (fully removed)
- No `new Set` / `ENUM.has` / `off.*ENUM` patterns on `bet_type` (OPEN field confirmed)
- `node -c validate-classifier.js` → exit 0 (syntax valid)

## Deviations from Plan

None — plan executed exactly as written. Both surgical edits applied to the single file specified. Other validators (`validate-finder.js`, `validate-dumper.js`, `validate-revenue.js`), `settings.json`, and `route.js` untouched (confirmed: only `tools/hooks/validate-classifier.js` in both task commits).

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries introduced. The validator reads its input path as DATA only (JSON.parse + property reads + Set.has) — consistent with T-01-10 mitigation. T-01-11 mitigation delivered: the hook now rejects unevidenced bet_type and missing demand_trend instead of silently passing bad classifier output. T-01-15 mitigation confirmed: no enum membership check on bet_type anywhere in the file.

## Self-Check: PASSED

- `tools/hooks/validate-classifier.js` exists and passes `node -c`
- Commit 258d291 exists (Task 1)
- Commit 94d473e exists (Task 2)
- Both commits touch only `tools/hooks/validate-classifier.js`
