---
phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f
plan: "01"
subsystem: pipeline-tools
tags: [funnel-clean, funnel-score, regex, section-markers, fail-fast, validation]

requires:
  - phase: 03
    provides: funnel-clean.js and funnel-score.js pipeline scripts

provides:
  - "funnel-clean.js emits [SECTION] markers for both HTML heading tags and markdown ATX headings"
  - "funnel-score.js exits non-zero when a package has neither Currency A nor Currency B"

affects:
  - funnel-deep-pass skill runs
  - funnel-score.js batch and single-file callers
  - any pipeline run using clean/home.md fallback (markdown body input)

tech-stack:
  added: []
  patterns:
    - "Markdown ATX heading regex: /^#{1,6}[ \\t]+/gm — line-anchored, bounded, ReDoS-safe"
    - "hasValidationCurrency() helper reuses scoreCurrencyA/B so 'valid' stays single-sourced"
    - "CLI-boundary guard pattern: validation at entry point, core function (scoreFunnelPackage) left intact"

key-files:
  created: []
  modified:
    - tools/funnel-clean.js
    - tools/funnel-score.js

key-decisions:
  - "D-01: markdown ATX heading regex placed BEFORE tag-strip so markers survive the tag-strip pass; existing dedup at line ~187 collapses adjacent markers"
  - "D-02: hasValidationCurrency() wired at CLI boundary only; scoreFunnelPackage() 'unknown' stamp logic left intact for any downstream importer"
  - "D-03 (scope guard): no field-name schema validation added — amount_raised vs amount_raised_usd enforcement deferred to Track C / Phase 21"

patterns-established:
  - "CLI-boundary guard: validate inputs at the CLI entry point, not inside the core function, so importers are unaffected"
  - "Fail-loud batch: hadNoCurrency flag + post-loop process.exit(1) — batch stays resilient (one bad funnel never aborts) but cannot pass silently"

requirements-completed: []

duration: 15min
completed: 2026-06-05
---

# Phase 20 Plan 01: Deep-pass Bug Fixes (D-01 + D-02) Summary

**funnel-clean.js now marks markdown ATX headings as [SECTION] boundaries; funnel-score.js exits non-zero on no-currency packages — both silent-failure paths closed**

## Performance

- **Duration:** ~15 min
- **Started:** 2026-06-05T03:00:00Z
- **Completed:** 2026-06-05T03:15:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- `funnel-clean.js`: added `/^#{1,6}[ \t]+/gm` pass in `stripToText()` after the HTML block-marker pass. Both HTML and markdown body inputs now emit `[SECTION]` markers; the `clean/home.md` fallback path (run-notes §3 Option B) no longer silently drops all markers.
- `funnel-score.js`: added `hasValidationCurrency(pkg)` helper and wired a fail-loud guard at the CLI boundary. Single-file mode exits 1 with a clear message before writing any output; batch mode skips scored output per no-currency package and exits 1 after the log write so the run cannot pass silently.
- Scope guard confirmed: no `amount_raised_usd` normalization or required-field enforcement added (D-03 deferred to Phase 21).

## Task Commits

1. **Task 1: Add markdown ATX heading section-marking to funnel-clean.js (D-01)** - `3d70cb4` (fix)
2. **Task 2: Make funnel-score.js fail loud on no-currency packages (D-02)** - `b34fc16` (fix)

## Files Created/Modified

- `tools/funnel-clean.js` — Added markdown ATX heading regex pass (`/^#{1,6}[ \t]+/gm`) in `stripToText()`, updated header doc comment
- `tools/funnel-score.js` — Added `hasValidationCurrency()` helper, CLI-boundary guard in single-file mode, `hadNoCurrency` flag + post-loop exit in batch mode

## Decisions Made

- Markdown regex placed BEFORE tag-strip (line ~166) so `$&` preserves the original heading text after the marker is prepended; the existing dedup at line ~187 collapses any adjacent markers.
- `hasValidationCurrency()` reuses `scoreCurrencyA()` / `scoreCurrencyB()` so the definition of "valid currency" stays single-sourced — no duplicate logic.
- Guard wired at CLI boundary only; `scoreFunnelPackage()` internals (the `unknown` stamp path) left unchanged so any downstream caller importing the function is unaffected.

## Deviations from Plan

None — plan executed exactly as written.

## Verify Check Output

Task 1 automated check:
```
PASS markdown sections=2
```

Task 2 automated check:
```
PASS no-currency exits 1, currency-B exits 0
```

Scope guard (no D-03 leak):
```
---scope-guard: no D-03 schema validator leaked in---
```

No new npm dependencies (`git diff package.json` empty).

## Issues Encountered

None.

## Next Phase Readiness

- D-01 and D-02 are closed. Phase 20 Plan 02 (corpus-absent orchestrator guard + no-ads DTC exclude path, D-04/D-05) is unblocked.
- Both fixes are in place for the next real arduview funnel run — the markdown body path and no-currency silent-pass are no longer failure modes.

---
*Phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f*
*Completed: 2026-06-05*
