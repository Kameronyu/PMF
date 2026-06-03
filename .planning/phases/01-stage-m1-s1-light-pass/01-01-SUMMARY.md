---
phase: 01-stage-m1-s1-light-pass
plan: "01"
subsystem: prompts/step1-light-pass.md
tags: [prompt-edit, schema, bet_type, demand_trend, bet_brief, wide-net, claim-typing, anti-fluke]
dependency_graph:
  requires: []
  provides:
    - "prompts/step1-light-pass.md — reconciled with open bet_type, <bet_brief>, demand_trend, wide-net Finder, multi-domain claim examples, provenance note, visible anti-fluke floor"
  affects:
    - "01-04 (hooks): validate-classifier.js must implement traceability-only check for bet_type (D-14); demand_trend-missing reject"
    - "01-02 (fetch.js): demand_trend source = Google Trends (D-15 source half); LP-hunt from PIPELINE INPUTS (D-16)"
    - "01-05 (debug run): consumes the revised prompt + an Arduview bet brief"
tech_stack:
  added: []
  patterns:
    - "OPEN field pattern: classifier-named + clustered + evidence-traced (bet_type mirrors transformation/niche/angle shape)"
    - "Three-layer bet brief: A prose->agent, B PIPELINE INPUTS->script tolerant-parse, C schema->hook"
    - "Surfaced-not-enforced anti-fluke: floor visible in combos[] anti_fluke field, never hard-gated in Phase 1"
key_files:
  modified:
    - prompts/step1-light-pass.md
decisions:
  - "bet_type is OPEN (no enum) — classifier-named, traceability-checked, never enum-checked (D-14); mirrors transformation/niche/angle already in the file"
  - "<bet_brief> is prose-only (layer A); PIPELINE INPUTS (layer B) is script-only; hooks never touch layers A/B — messy brief degrades quality, never hard-fails"
  - "demand_trend.shape is CLOSED enum (D-14 rule: finite universal vocabulary) — fetch.js owns it, Classifier only carries it"
  - "anti_fluke floor (2+ brands at scale; 7+ day ad longevity) surfaced in combos[], enforced at Phase 2 decision-time (D-09)"
  - "D-18 multi-domain examples: cross-product inoculation prevents anchoring on one domain's vocabulary when typing claims"
metrics:
  duration_minutes: 7
  tasks_completed: 5
  files_modified: 1
  completed_date: "2026-06-03"
---

# Phase 01 Plan 01: amend-D-12/D-13/D-15/D-17/D-18/D-19 — Structural feedback revision to step1-light-pass.md Summary

**One-liner:** Six surgical deltas on the built-but-unrun light-pass prompt: open `bet_type` replaces closed `competitive_axis`; `<bet_brief>` prose context injected into Finder + Classifier; per-brand `demand_trend` field with closed shape enum; wide-net Finder by substitutability AND bet-similarity; multi-domain claim-typing examples with feature-trap; provenance note + visible anti-fluke floor.

## What Was Built

All changes are surgical text edits to `prompts/step1-light-pass.md`. No scripts, no new files, no schema renames — only the specified deltas from the 2026-06-03 structural-feedback review.

### Task 1: amend-D-12 — competitive_axis (closed enum) → bet_type (OPEN)

- Replaced all `competitive_axis`/`competitive_axis_basis` occurrences (8 sites) with `bet_type`/`bet_type_basis`
- Removed `COMPETITIVE_AXIS_ENUM` entirely from the closed-enums block
- Added canonical `bet_types[]` array to space-map.json schema (same shape as `transformations[]`: canonical + raw_variants + brand_count)
- Updated schema prose: OPEN field, Classifier names it in the space's own terms, then clusters into canonical `bet_types[]`
- Updated AGENT 3 step 4b as "BET TYPE (per brand)" block with explicit open-categorization instruction
- Updated CLASSIFIER hook spec: traceability-checked, NEVER enum-checked (D-14)
- Updated Dumper guard: forbidden from naming `bet_type`

### Task 2: D-13 — `<bet_brief>` consumption blocks in Finder + Classifier

- Inserted `<bet_brief>` prose block in AGENT 1 (Finder), after the role line
- Inserted `<bet_brief>` prose block in AGENT 3 (Space Classifier), after the role line
- Both blocks state all three layers: A prose→agent, B PIPELINE INPUTS→script, C schema→hook; hooks only ever touch C
- Both state the OPEN transformation slot (operator does NOT supply transformation; competitors reveal it)
- Finder block: use territories + comparable-bet seeds to drive wide-net search
- Classifier block: use pinned definitions when naming canonical terms; report per-competitor transformation/mechanism/durability/niche
- No schema field, enum, or hook added for the brief

### Task 3: D-15 field half — per-brand demand_trend + closed shape enum + Classifier wiring

- Added `demand_trend { _note, shape, window, source, basis }` to brands.json schema after `revenue_est`
- `_note` flags it as fetch.js-populated (Google Trends ~5yr), NOT an agent
- Added `demand_trend` field to space-map.json `per_brand[]` (Classifier carries from brands.json)
- Added `DEMAND_TREND_SHAPE_ENUM: steady | rising | parabolic-spike | declining | unknown` to closed-enums block
- Added AGENT 3 step 4c: carry demand_trend from brands.json without recomputing; if unknown, list it unknown
- Named demand_trend as the Phase 2 Gate-1 parabolic-spike / fad-death kill signal

### Task 4: D-17/D-18/D-19 — wide-net Finder, multi-domain examples, provenance + anti-fluke floor

- **D-17 NET rule**: Added to AGENT 1 between KEEP BAR and RELEVANCE-DROP — substitutability OR bet-similarity, never spec-match; empty-pool false-negative rationale included; RELEVANCE-DROP still applies
- **D-18 WORKED EXAMPLES**: Replaced single-domain claim-type examples with multi-domain set (skincare/sleep/productivity/supplement/hardware); added FEATURE-vs-CLAIM TRAP inoculation; updated AGENT 3 RULES worked-examples bullet to reference multi-domain framing
- **D-19 provenance note**: Added `_provenance` field to space-map.json JSON schema; added prose note after the schema block
- **D-19 anti-fluke floor**: Added `anti_fluke` field to `combos[]` entries (brands_at_scale floor: 2+; qualifying_creatives: run_length_days >= 7); added prose note that floor is surfaced-not-enforced (D-09, Phase 1 never hard-gates)

### Task 5: Idempotency guard

Non-mutating verification confirming D-05/D-03/D-08/D-11 prior edits are un-regressed:
- D-05: `awareness` count = 1 (only the OPEN-DECISIONS rationale line; no schema/enum/hook)
- D-03: SOPHISTICATION block header and mechanical-rule line both present verbatim
- D-08: saturation schema example still keyed per transformation × niche cell
- D-11: `semrush-api` present, `similarweb-api` absent

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1 | b2797b6 | feat(01-01): amend-D-12 — flip competitive_axis (closed enum) → bet_type (OPEN) |
| 2 | da80de4 | feat(01-01): D-13 — add <bet_brief> consumption block to Finder + Classifier |
| 3 | b2d0aeb | feat(01-01): D-15 field half — add per-brand demand_trend + closed shape enum + Classifier wiring |
| 4 | dac8cd8 | feat(01-01): D-17/D-18/D-19 — wide-net Finder, multi-domain examples, provenance + anti-fluke floor |
| 5 | (none) | Verification only — no file changes |

## Deviations from Plan

None — plan executed exactly as written. All surgical edits landed without touching out-of-scope sections (saturation counts, awareness, sophistication ladder, revenue/visits_source enums).

## Known Stubs

None — this plan is prompt/schema-text only. No script wiring, no data sources. The demand_trend field is present in the schema with ownership annotation; the actual Google Trends fetch source is 01-02's job (D-15 source half), not this plan's.

## Threat Flags

None — prompt-text edit only, no new network endpoints, no credentials, no execution surface. The `<bet_brief>` block is prose context (layer A), never executed or schema-validated.

## Self-Check: PASSED

- prompts/step1-light-pass.md: FOUND
- .planning/phases/01-stage-m1-s1-light-pass/01-01-SUMMARY.md: FOUND
- Commit b2797b6 (Task 1): FOUND
- Commit da80de4 (Task 2): FOUND
- Commit b2d0aeb (Task 3): FOUND
- Commit dac8cd8 (Task 4): FOUND

## Addendum — Task 4(d) (D-20 Dumper carry) built 2026-06-03 (direct build, post-execution)

Task 4(d) was added AFTER the parallel execute-phase run completed Task 4, so it was built directly.
The AGENT 2 — DUMPER prompt now instructs: COPY each ad creative's `start_date` / `run_length_days`
from the matching `ads/<SLUG>.json` `ads[]` record (by `library_id` = `creative_id`, adlib-one.js
extracts them deterministically); landing/product pages → both null; NEVER estimate or guess
(D-10 / D-20). This makes the D-19 anti-fluke `run_length_days >= 7` count rest on real data.
Paired with the `adlib-one.js` structured extraction built under 01-02 Task 3.
