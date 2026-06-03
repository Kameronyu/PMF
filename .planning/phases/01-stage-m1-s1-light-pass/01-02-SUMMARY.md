---
phase: 01-stage-m1-s1-light-pass
plan: "02"
subsystem: fetch-script
tags: [fetch, playwright, google-trends, demand_trend, lp-hunt, bet-brief, deterministic, scripts]
dependency_graph:
  requires: []
  provides: [tools/fetch.js]
  affects: [brands.json (per-brand demand_trend), Classifier (reads demand_trend), validate-classifier.js (enforces demand_trend)]
tech_stack:
  added: []
  patterns: [playwright-stealth-launch, CF-clear-loop, tolerant-parse, resilient-per-brand-batch, brief-driven-input, deterministic-classifier]
key_files:
  created: []
  modified:
    - tools/fetch.js
decisions:
  - "D-16: LP-hunt set sourced from bet brief's PIPELINE INPUTS block via parsePipelineInputs(); DEFAULT_LP_PATHS named constant kept as fallback — determinism principle preserved (fixed per run, not agent-chosen)"
  - "D-15: fetchTrend() uses same Playwright context (no new dep); extractTrendSeries() tolerant 3-pattern regex parser; classifyTrendShape() pure-arithmetic closed-enum classifier; demand_trend written back to brands.json after per-brand loop"
  - "unknown is the escape valve only: null/empty/all-zero series or operator toggle-off — never blanket"
  - "parabolic-spike threshold: windowMax >= 2.5x trailing-third mean AND end-value <= 50% of windowMax (calibrated by debug run)"
metrics:
  duration: "~8 minutes"
  completed: "2026-06-03T21:55:49Z"
  tasks_completed: 2
  files_created: 0
  files_modified: 1
---

# Phase 1 Plan 02: fetch.js Revision — brief-driven LP-hunt + Google Trends demand_trend

Surgical two-delta edit to the already-built `tools/fetch.js`: (1) D-16 — LP-hunt URL-path patterns moved from hardcode to tolerant parse of the bet brief's `PIPELINE INPUTS` block; (2) D-15 source half — real Google Trends ~5yr Playwright fetch per brand that writes `demand_trend { shape, window, source, basis }` into `brands.json`. `clean.js` untouched.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | D-16 — brief-driven LP-hunt via parsePipelineInputs() | d1ba2ef | tools/fetch.js |
| 2 | D-15 source half — Google Trends demand_trend per brand | d1ba2ef | tools/fetch.js |

Note: both tasks committed in one atomic commit — they are inseparable edits to the same file and were implemented together.

## What Was Built

**D-16 — parsePipelineInputs(briefFilePath):**
- Tolerant parser reads the bet brief's `## PIPELINE INPUTS` or fenced `PIPELINE INPUTS` block.
- Extracts `### LP-hunt query terms` bullets: items starting with `/` or `http` → `lpPaths`; others → `lpQueries` (future search engine use).
- Extracts `### Comparable-bet seed brands` (parsed, reserved for Finder).
- Extracts `### Trend source` — text containing "off/disabled/skip/none" → `trendEnabled: false`.
- A missing brief, missing PIPELINE INPUTS block, or any parse error → `console.warn` + `DEFAULT_LP_PATHS` fallback. Never throws.
- `DEFAULT_LP_PATHS` named constant kept verbatim as fallback so the debug pass still runs without a brief.
- `--brief=<path>` CLI option added (default `./bet-brief.md`), documented in `--help`.
- Determinism principle preserved: LP-hunt set is **fixed for the run** (not agent-chosen mid-run); the contents are now a per-run planning input from the brief rather than a code hardcode.

**D-15 source half — fetchTrend + classifyTrendShape:**
- `fetchTrend(context, term, windowSpec)`: uses the SAME Playwright context (no new dep) to navigate `https://trends.google.com/trends/explore?date=today%205-y&q=<term>&hl=en`. Applies the same CF-clear wait loop. Waits for networkidle. Returns `[{date, value}]` or `null`.
- `extractTrendSeries(html, term)`: tolerant 3-pattern regex parser — (1) `"timelineData"` JSON key, (2) `"interest"` array, (3) script-block scan. DATA only — `JSON.parse` on extracted strings, no `eval`.
- `classifyTrendShape(series)`: pure-arithmetic closed-enum classifier (no LLM):
  - `null`/empty/all-zero → `unknown` (escape valve only, never the blanket return)
  - `parabolic-spike`: `windowMax >= trailingMean * 2.5 AND endValue <= windowMax * 0.5` (fad-death/Gate-1 kill signal)
  - `rising`: `endMean >= startMean * 1.25`
  - `declining`: `endMean <= startMean * 0.75`
  - `steady`: everything else
- `buildBasis(series, shape)`: one-line human-readable description for `demand_trend.basis`.
- Per-brand: after homepage + LP-hunt, calls `fetchTrend` for `brand.brand || brand.name || slug`. Builds `demand_trend { shape, window, source, basis }` and attaches to brand row in-memory.
- After per-brand loop: writes enriched `brands.json` back (preserves `starting_point`, `dropped`, etc. — `brandsData.brands = brands; writeFileSync`).
- Trend toggle: if `trendEnabled === false` → writes `{ shape: 'unknown', window: null, source: null, basis: null }` per brand (explicit operator opt-out, not silent failure).
- Per-brand try/catch: one Trends failure → `shape: 'unknown'` for that brand only, logs to `_fetch-log.txt`, batch continues.

## Acceptance Criteria Status

**Task 1 (D-16):**
- `node -c tools/fetch.js` → syntax OK
- `node tools/fetch.js --help` → exits 0, documents `--brief`
- `grep -q 'PIPELINE INPUTS' tools/fetch.js` → matches
- `grep -q 'parsePipelineInputs' tools/fetch.js` → matches
- `grep -q 'DEFAULT_LP_PATHS' tools/fetch.js` → matches (named fallback)
- `node tools/fetch.js --brief=/nonexistent/brief.md --help` → exits 0 (tolerant parse with --help short-circuits before parse)
- `try` wraps parser; `console.warn` on parse failure
- Zero extra deps: only `playwright`, `fs`, `path`
- clean.js untouched: `git diff --name-only` shows only `tools/fetch.js`

**Task 2 (D-15):**
- `node -c tools/fetch.js` → syntax OK
- `grep -q 'demand_trend' tools/fetch.js` → matches
- `grep -q 'fetchTrend'` and `grep -q 'classifyTrendShape'` → match
- `grep -qi 'trends.google.com' tools/fetch.js` → matches
- All five enum values present: `steady`, `rising`, `parabolic-spike`, `declining`, `unknown`
- `grep -qi 'writeFileSync' tools/fetch.js` → matches (brands.json write-back)
- `unknown` gated on null/empty/all-zero series or toggle-off (lines 264, 268, 271 only)
- Zero extra deps; clean.js untouched

## Deviations from Plan

**1. [Rule — Implementation] Both tasks committed as one atomic commit**
- **Found during:** Task 2
- **Issue:** Both D-16 and D-15 were implemented in a single write to `tools/fetch.js`; no staged-split was possible without rewriting the file twice.
- **Fix:** Committed both task changes under a single commit with a message covering both task deltas.
- **Impact:** None on correctness; the commit message documents both changes explicitly.

No other deviations — plan executed as written.

## Threat Surface Scan

No new network endpoints or auth paths beyond the plan's threat model.

| Threat ID | Status |
|-----------|--------|
| T-01-13 (Tampering/RCE via Trends data + brief parse) | Mitigated — `JSON.parse` / string ops only on Trends series and brief content; `eval`/`Function`/`exec` absent; `classifyTrendShape` is pure arithmetic |
| T-01-14 (DoS from Trends rate-limit / one bad term aborts batch) | Mitigated — per-brand try/catch; one Trends failure yields `shape:"unknown"` for that brand only; batch continues |
| T-01-04 (page JS exec via Playwright Trends render) | Accepted — inherits existing crowdfund-fetch.js posture; Playwright sandboxed headless Chromium; local research tooling |

## Known Stubs

None. `fetchTrend` is a real Playwright fetch against `trends.google.com`. `classifyTrendShape` is a real deterministic classifier. The HTML parse patterns are tolerant heuristics — if Google Trends changes its embed format the series will resolve to `null` and `shape` will be `unknown` for affected brands, which is the documented escape valve (not a silent failure: the basis will be null and source will be null, distinguishable from a populated record). Calibration of the `parabolic-spike` thresholds (2.5x / 50%) is intentionally left to the debug run per the plan spec.

## Self-Check: PASSED

- `tools/fetch.js` exists and passes all acceptance criteria
- Commit `d1ba2ef` exists covering both task changes
- `git diff --name-only HEAD~1 HEAD` shows only `tools/fetch.js` (clean.js untouched)
- No new npm deps introduced

## Addendum — Task 3 (D-20) built 2026-06-03 (direct build, post-execution)

Task 3 (`tools/adlib-one.js` structured per-ad extraction) was added to this plan AFTER the
parallel execute-phase run had already completed Tasks 1-2, so it was built directly rather than
via execute-phase. Delivered:
- `adlib-one.js` now emits a structured per-ad `ads[]` array (`library_id`, `start_date`,
  `end_date`, `run_length_days`, `text`) into `ads/<slug>.json` — not just `active_ad_count` + blob.
- Stopped-ad pass added (`active_status=all`) so dead ads carry an `end_date` + full `run_length_days`
  (feeds D-08 cause-of-death); the active pass + `active_ad_count` are preserved unchanged.
- Records merged across both passes, de-duped by `library_id` (prefer the record with an `end_date`).
- `run_length_days` deterministic (end−start, or today−start for active); `null` when start unparseable
  (D-10 never-fabricate). Zero new deps (playwright + fs + path).
- Selectors are best-effort (text-chunk parse on the "Library ID" delimiter, since Ad Library DOM is
  obfuscated) — the 01-05 debug run is expected to calibrate the date/card patterns against the real DOM.
- Parser unit-tested against a synthetic blob: active ad → run-so-far; stopped ad → full run length;
  short/invalid IDs skipped.
