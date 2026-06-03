---
phase: 01-stage-m1-s1-light-pass
plan: 03
subsystem: research-tooling
tags: [nodejs, brands-json, dedupe, revenue-estimate, meta-ad-library, deterministic-scripts]

# Dependency graph
requires: []
provides:
  - tools/dedupe.js — domain-key brand merge; normalizes host, unions found_by, keeps richest channel
  - tools/revenue-est.js — deterministic revenue arithmetic (D-09/D-10/D-11 contract); traffic_formula + review_proxy paths; never-fabricate discipline
  - tools/adlib-one.js (modified) — --out parameterized, emits ads/<slug>.json, legacy hard-coded path removed; page-ID resolution preserved verbatim
affects: [01-04, 01-05, market-selection-gate, any-future-run-scripts]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - CLI args: positional + --flag=val opts parse pattern (from crowdfund-fetch.js) applied to all new scripts
    - Never-fabricate revenue: method+confidence always emitted; null → review_proxy/explicit null; never PENDING
    - Domain normalization key: host extraction + toLowerCase().replace(/[^a-z0-9]+/g,'') (inherited from adlib-one.js pickAdvertiser)
    - Resilient per-brand loop: try/catch per item so one failure does not abort the batch

key-files:
  created:
    - tools/dedupe.js
    - tools/revenue-est.js
  modified:
    - tools/adlib-one.js

key-decisions:
  - "revenue_est NEVER gates the roster (D-09) — value is attached for every brand; Phase 2 applies the $300-500K floor"
  - "Null monthly_visits → review_proxy (not PENDING) or explicit null if no review proxy either (D-10)"
  - "adlib-one.js touch-up only — pickAdvertiser/forcedPageId/two-pass/cookie-dismiss preserved verbatim; only OUT path + JSON emit changed"
  - "No playwright/network in dedupe.js or revenue-est.js — deterministic scripts, zero added deps"

patterns-established:
  - "Channel richness order for dedupe merge: crowdfunding > dtc > marketplace"
  - "aov_usd resolved from price_points[$NNN parse] first, then --aov flag, then null — never inferred by LLM"
  - "ads/<slug>.json schema: {slug, brand_query, status, resolved_advertiser:{name,pageId,followers}|null, active_ad_count, library_ids_loaded}"

requirements-completed: [TOOL-01]

# Metrics
duration: 18min
completed: 2026-06-03
---

# Phase 1 Plan 03: Layer-3 Transform Scripts Summary

**dedupe.js (domain-key brand merge), revenue-est.js (D-10 never-fabricate arithmetic), and adlib-one.js --out + JSON emit — completing the layer-3 script set for a reproducible light-pass run**

## Performance

- **Duration:** ~18 min
- **Started:** 2026-06-03T19:00:00Z
- **Completed:** 2026-06-03T19:18:00Z
- **Tasks:** 3
- **Files modified:** 3 (2 created, 1 modified)

## Accomplishments

- `tools/dedupe.js`: groups brands.json rows by normalized host (toLowerCase + replace idiom from adlib-one.js), unions found_by arrays, keeps richest channel (crowdfunding > dtc > marketplace), preserves crowdfunding block; idempotent; --in/--out/--help; zero deps
- `tools/revenue-est.js`: computes value_usd_monthly = monthly_visits × cvr_assumption(0.02) × aov_usd; always emits method+confidence; null visits → review_proxy/low or explicit null; NEVER emits "PENDING"; resilient per-brand try/catch; no traffic fetch, no LLM, no playwright; --in/--out/--aov/--help
- `tools/adlib-one.js`: hard-coded `runs/eink-tablets/adlibrary` path replaced by `--out` flag (default ./ads); emits structured `ads/<slug>.json` with {slug, brand_query, status, resolved_advertiser, active_ad_count, library_ids_loaded}; all load-bearing logic preserved verbatim (pickAdvertiser, score>=30, forcedPageId, two-pass, cookie-dismiss)

## Task Commits

1. **Task 1: Build tools/dedupe.js** - `053cd2a` (feat)
2. **Task 2: Build tools/revenue-est.js** - `a375cbf` (feat)
3. **Task 3: Touch up adlib-one.js** - `7746c8d` (feat)

## Files Created/Modified

- `tools/dedupe.js` — domain-key brand merge; groups by normalized host, unions found_by[], keeps richest channel
- `tools/revenue-est.js` — deterministic revenue arithmetic with D-10 never-fabricate logic (method+confidence always emitted, PENDING forbidden)
- `tools/adlib-one.js` — --out parameterized (default ./ads), emits ads/<slug>.json, legacy hard-coded path removed; pickAdvertiser/forcedPageId/two-pass/cookie-dismiss preserved

## Decisions Made

- `revenue_est` is never a roster gate in this phase (D-09) — every brand gets the field regardless of null/low-confidence value; the Phase 2 market-selection skill applies the $300-500K floor
- Kept the `_adv.txt` debug dump in adlib-one.js alongside the new `.json` so existing debugging workflows are not broken
- review_proxy multiplier hardcoded at 10 (rough ecom industry benchmark); field is swappable via the `inputs` block when a better estimate is available

## Deviations from Plan

None — plan executed exactly as written.

## Issues Encountered

None. Syntax + smoke tests passed first run for all three scripts.

## Threat Surface Scan

No new network endpoints, auth paths, file access patterns, or schema changes at trust boundaries introduced beyond what the plan specifies. Specific mitigations confirmed:
- T-01-06: revenue-est.js stores no API keys, does no fetching — monthly_visits arrives pre-populated in brands.json
- T-01-07: pickAdvertiser score>=30 threshold preserved verbatim in adlib-one.js
- T-01-08: never-fabricate logic implemented; method+confidence always emitted; PENDING not assignable as a value
- T-01-09: no auto-browser SimilarWeb scraping; revenue-est.js does no fetching

## User Setup Required

None — no external service configuration required. Scripts are operator-invoked with operator-supplied brands.json.

## Next Phase Readiness

- Layer-3 script set complete: fetch.js (Plan 02) + clean.js (Plan 02) + dedupe.js + revenue-est.js + adlib-one.js (this plan) are all built
- A brands.json populated by the Finder prompt can now run through: `node tools/dedupe.js` → `node tools/revenue-est.js` → `node tools/adlib-one.js <slug> "<brand>" [--out=./ads]`
- Plan 04 (hooks) can wire the REVENUE hook validator against the revenue_est schema this plan establishes

---
*Phase: 01-stage-m1-s1-light-pass*
*Completed: 2026-06-03*
