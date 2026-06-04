---
phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy
plan: "01"
subsystem: collection-layer
tags: [funnel-assembly, ad-scraping, playwright, url-normalization, ssrf-guard]
dependency_graph:
  requires: []
  provides:
    - tools/adlib-one.js (extended with D-06 binding-spine fields)
    - tools/funnel-assemble.js (URL normalize + cluster + Playwright LP render + funnel_package emit)
  affects:
    - tools/funnel-clean.js (reads landing_page_body from funnel_package — Plan 03-02)
    - tools/funnel-score.js (reads bound_ads[].run_length_days for Currency A — Plan 03-03)
tech_stack:
  added:
    - funnel_package JSON schema (§2b shape — funnel_id, competitor, source_type, landing_page_url,
      landing_page_body, bound_ads[], variant_count, crowdfunding_stats)
    - ssrfGuard() DNS-resolve + CIDR check (T-03-01)
    - normalizeUrl() tolerant pure fn (utm_*/fbclid strip, https force, host lowercase, trailing-slash drop)
  patterns:
    - Extend-in-place (adlib-one.js): add fields without touching output path or CLI
    - Map-by-key cluster (mergeAds idiom): normalizeUrl(destination_url) as the cluster key
    - Resilient-batch per-funnel try/catch (fetch.js pattern)
    - Playwright fingerprint-mask boilerplate (fetch.js lines 414-439)
    - fetchPage verbatim copy (fetch.js lines 333-367): CF-clear + networkidle + Read-more expand
key_files:
  created:
    - tools/funnel-assemble.js
  modified:
    - tools/adlib-one.js
decisions:
  - Per-card DOM extraction wired with TODO(D-17) calibration markers — live-DOM selector accuracy
    deferred to the debug-run pass as planned. Text-chunk regex fallback fills null slots from
    innerText when DOM extract misses (impression_bucket, platforms, headline).
  - ssrfGuard() uses dns.lookup({ all:true }) — DNS failure safe-defaults to skip (false), not
    fail-open. Cloud metadata endpoint 169.254.169.254 caught by the 169.254.* range check.
  - ambiguous_destinations.json sidecar written alongside _funnel-assemble-log.txt so downstream
    can audit which ads had null/linktree destinations without reading the log.
  - Zero-ad crowdfunding LPs (D-19) handled via --crowdfund-lps=<file>; if URL already produced
    a cluster funnel, existing landing_page_body is reused rather than re-rendering.
metrics:
  duration_minutes: 5
  completed_date: "2026-06-03"
  tasks_completed: 2
  tasks_total: 2
  files_created: 1
  files_modified: 1
---

# Phase 03 Plan 01: §2b Binding Spine — adlib-one.js extension + funnel-assemble.js Summary

One-liner: Funnel binding spine wired — adlib-one.js now emits destination_url + 4 companion fields per ad; funnel-assemble.js normalizes + clusters + Playwright-renders each distinct LP into a typed funnel_package.

## What Was Built

**Task 1 — adlib-one.js extended with 5 binding-spine fields (D-06)**

Added to the per-ad record: `destination_url` (THE funnel binding key), `cta_text`, `headline`, `impression_bucket`, `platforms`. Three extraction paths:

1. `extractAdCards(page)` — `page.evaluate` DOM walk that locates CTA anchors, resolves their enclosing card's library_id by ancestor text search, and pulls destination href + CTA label + heading + impression range + platform text. Calibration selectors marked `TODO(D-17)`.
2. `textFallbackFields()` — text-chunk regex for headline, impression_bucket, and platforms when DOM extraction returns null.
3. `mergeCardData()` + updated `parseAdsFromText(blob, cardDataMap)` — card data map passed from per-pass DOM extracts into the text parser; null slots filled by text fallback.

Existing fields (`run_length_days`, `start_date`, `end_date`) untouched. CLI (`--help`) and output path (`ads/<slug>.json`) unchanged. never-fabricate preserved throughout.

**Task 2 — funnel-assemble.js created (§2b spine)**

`normalizeUrl()`: strip `utm_*`/`fbclid`, force `https:`, lowercase host, drop trailing slash. This is the clustering key — correctness here prevents one funnel splattering into ten (D-04).

`isAmbiguousDestination()`: flags linktree/linkpop/beacons/bio.site URLs and bare homepaths as `ambiguous_destination` — not forced into funnels (D-05).

`ssrfGuard()` (T-03-01): DNS-resolves the host, checks all returned IPs against private/loopback/link-local/metadata ranges (127/8, 10/8, 172.16/12, 192.168/16, 169.254/16 incl. cloud metadata endpoint, ::1, fc00::/7, fd00::/7). Non-http(s) schemes rejected. DNS failure defaults to skip (fail-closed).

`clusterAdsByUrl()`: Map keyed on `normalizeUrl(destination_url)`, ambiguous ads collected separately.

`fetchPage()`: verbatim copy from fetch.js lines 333-367 — goto → CF-clear loop → networkidle → "Read more" expand (capped at 20 clicks per T-03-02) → page.content().

Playwright browser/context boilerplate: fingerprint masking verbatim from fetch.js lines 414-439.

Resilient-batch: per-funnel `try/catch` with `page.close()` in `finally`. One hostile/slow LP never aborts the batch.

Outputs per cluster: `<out>/<funnel_id>.json` (§2b `funnel_package`), `_funnel-assemble-log.txt` sidecar, `ambiguous_destinations.json` sidecar.

Zero-ad crowdfunding LPs via `--crowdfund-lps=<file>` (D-19): accepted hand-fed list → valid `funnel_package` with `bound_ads: []`.

## Deviations from Plan

None — plan executed exactly as written.

The DOM calibration deferral (TODO D-17 markers) and the text-chunk fallback were both explicitly anticipated by the plan ("Calibration against the live DOM is a deferred debug-pass task (D-17) — wire the extraction code and a TODO marker, do not block on perfect live-DOM matches").

## Threat Surface

All T-03-01 and T-03-02 mitigations from the plan's threat register are implemented:

| Threat | Mitigation | Location |
|--------|-----------|----------|
| T-03-01 SSRF | ssrfGuard(): DNS + CIDR check, non-http(s) rejection | funnel-assemble.js |
| T-03-02 DoS | Hard timeouts (goto 60s, networkidle 30s), "Read more" cap (20 clicks), per-funnel try/catch | funnel-assemble.js fetchPage() |
| T-03-03 Prompt injection | landing_page_body stored raw — mitigation deferred to Plan 03 (Section Analyzer boundary) | accepted as planned |
| T-03-04 ToS / repudiation | Existing fingerprint-mask boilerplate carried forward | adlib-one.js, funnel-assemble.js |

No new threat surface introduced beyond what the plan's threat model covers.

## Known Stubs

- `extractAdCards()` selectors are best-effort heuristics (CTA anchor walk + ancestor library_id text search). DOM calibration against the live Ad Library is deferred to D-17. Fields will be null until calibrated; the text-chunk fallback partially compensates for headline/impression_bucket/platforms.
- `crowdfunding_stats` in funnel_package is always `null` at this stage — populated by the Currency-B parser in `crowdfund-fetch.js` (D-07, Plan 03-02).

## Self-Check: PASSED

| Item | Status |
|------|--------|
| tools/adlib-one.js | FOUND |
| tools/funnel-assemble.js | FOUND |
| 03-01-SUMMARY.md | FOUND |
| commit c4fcc5f (Task 1) | FOUND |
| commit 1a1939e (Task 2) | FOUND |
