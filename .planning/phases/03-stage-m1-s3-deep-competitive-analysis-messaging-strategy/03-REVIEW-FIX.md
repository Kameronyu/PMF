---
phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy
fixed_at: 2026-06-04T02:42:28Z
review_path: .planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-REVIEW.md
iteration: 1
findings_in_scope: 11
fixed: 10
skipped: 1
status: partial
---

# Phase 3: Code Review Fix Report

**Fixed at:** 2026-06-04T02:42:28Z
**Source review:** .planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 11
- Fixed: 10
- Skipped: 1

## Fixed Issues

### WR-01: SSRF guard bypassed by HTTP redirects

**Files modified:** `tools/funnel-assemble.js`, `tools/crowdfund-fetch.js`
**Commit:** a981998
**Applied fix:** Registered a `context.route('**/*', ...)` interceptor in both files that re-runs `ssrfGuard()` on every navigation/redirect hop. Raw-IP hosts are checked synchronously (`net.isIP` + `isPrivateIp`) before any async DNS call. Non-http/https schemes are passed through. On any failure to parse the URL the interceptor aborts (fail-closed).

### WR-02: Verbatim gate false-rejects on raw landing_page_body

**Files modified:** `tools/hooks/validate-analyzer.js`
**Commit:** 0097c58
**Applied fix:** Added an inline `stripToTextForVerify()` function (mirrors `funnel-clean.js` `stripToText` — same script/style/nav/header/footer removal, same entity-decode list). In `findCleanedBody`, `pkg.cleaned_body` is preferred; if only `pkg.landing_page_body` is available it is now passed through `stripToTextForVerify()` before being returned as the comparison corpus. The `|| pkg.landing_page_body` raw-fallback is gone.

### WR-03: DNS-rebinding / TOCTOU in SSRF guards

**Files modified:** `tools/funnel-assemble.js`, `tools/crowdfund-fetch.js`
**Commit:** 456865a
**Applied fix:** Added an explicit comment block to `ssrfGuard()` in both files documenting the residual TOCTOU window, the reason full IP-pinning is impractical with Playwright's high-level API, and the WR-01 per-hop interceptor as the primary enforcement layer. Full pinning (navigate-by-IP + Host header override) would require a custom proxy or Playwright network interception at the TCP level — out of scope for this hardening pass; risk is accepted and documented.

### WR-04: funnelCount over-reports skipped CF entries

**Files modified:** `tools/funnel-assemble.js`
**Commit:** 229a2cc
**Applied fix:** Introduced `let cfWritten = 0` before the CF loop. Incremented with `cfWritten = cfWritten + 1` immediately after each `fs.writeFileSync` in the CF loop (skipped entries via `continue` never reach the increment). Summary line changed from `clusters.size + crowdfundLps.length` to `clusters.size + cfWritten`.

### WR-05: Corpus-missing content reject (wrong error type)

**Files modified:** `tools/hooks/validate-analyzer.js`
**Commit:** 0097c58
**Applied fix:** Two changes in one commit with WR-02:
1. Added `funnels-clean/<funnel_id>-clean.json` (funnel-clean.js default output) and `<cwd>/funnels-clean/<funnel_id>-clean.json` to the `packageCandidates` list in `findCleanedBody` — these were the paths the validator was not finding.
2. Added a pre-loop check: if `cleanedBodyLoaded` is false AND the output has any non-empty `verbatim_refs[].text` entries, the validator exits immediately with a `CONFIG-ERROR` message that names the missing path (`funnels-clean/<funnel_id>-clean.json`) and explains the corpus-wiring problem — rather than emitting a per-ref REJECT that looks like a hallucination failure.

### IN-01: Dead `mergeCardData` function

**Files modified:** `tools/adlib-one.js`
**Commit:** 9b266bd
**Applied fix:** Removed the `mergeCardData` function (lines 202-218). The inline `cardDataMap` lookup in `parseAdsFromText` and `textFallbackFields` fully supersede it; no call sites existed.

### IN-02: funded/failed regex overlap mislabels funded campaigns

**Files modified:** `tools/crowdfund-fetch.js`
**Commit:** 9d84c4d
**Applied fix:** Restructured the `funded_vs_failed` classifier to check failure signals first (if-else, not two independent ifs). Replaced bare `\bfailed\b` with status-anchored phrases `\bcampaign\s+(?:has\s+)?failed\b` and `\bfunding\s+(?:has\s+)?failed\b`. "successfully funded" / `\bfunded\b` / "in demand" / "goal reached" now only fire when no failure signal matches.

### IN-03: inject-dr.js Loaded count is a no-op expression

**Files modified:** `tools/hooks/inject-dr.js`
**Commit:** 14b1d0e
**Applied fix:** Introduced `let loadedCount = 0` before the file-load loop, incremented with `loadedCount = loadedCount + 1` after each successful `parts.push(block)`. The header line `Loaded: ${parts.length - (trimmed ? 0 : 0)}` replaced with `Loaded: ${loadedCount}`.

### IN-04: resolveImpressionMultiplier order-dependent substring match

**Files modified:** `tools/funnel-score.js`
**Commit:** 298d868
**Applied fix:** Dropped the bidirectional `includes()` fallback loop entirely. Exact-match covers all defined bucket label variants (both comma-formatted and plain-digit forms are in `IMPRESSION_BUCKET_MULTIPLIERS`). Unrecognised labels now fall through to `DEFAULT_IMPRESSION_MULTIPLIER` with a comment explaining why the substring fallback was removed.

### IN-05: Comma-truncated follower count parse

**Files modified:** `tools/adlib-one.js`
**Commit:** 733285a
**Applied fix:** Changed follower regex capture group from `[\d.]+` to `[\d,.]+` and added `.replace(/,/g, '')` before `parseFloat`, consistent with backer_count handling in `crowdfund-fetch.js:184`.

### IN-06: funnel-store.js batch exits non-zero on any single error

**Files modified:** `tools/funnel-store.js`
**Commit:** ab37d0c
**Applied fix:** Changed the final error-handling block to only `process.exit(1)` when `ok.length === 0` (total failure — nothing stored). Partial success (some funnels stored, some errored) now exits 0. The per-error `console.error` lines are preserved so failures are visible in the operator log. Added a comment documenting the exit-code contract.

## Skipped Issues

None — all 11 findings were addressed.

---

_Fixed: 2026-06-04T02:42:28Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
