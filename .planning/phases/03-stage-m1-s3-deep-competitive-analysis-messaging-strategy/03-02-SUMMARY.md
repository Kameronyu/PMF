---
phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy
plan: "02"
subsystem: collection-layer
tags: [crowdfunding-stats, funnel-clean, funnel-score, two-currency-validation, playwright, ssrf-guard]
dependency_graph:
  requires:
    - tools/funnel-assemble.js (Plan 03-01 — funnel_package shape this plan consumes)
  provides:
    - tools/crowdfund-fetch.js (extended — Currency-B stat parser, D-07)
    - tools/funnel-clean.js (new — section-marked verbatim cleaner, D-11)
    - tools/funnel-score.js (new — two-lane validation scorer, D-09)
  affects:
    - tools/funnel-store.js (Plan 03-03 — reads cleaned body + scored validation)
    - prompts/funnel-deep-pass.md (Plan 03-03 — Section Analyzer reads cleaned body)
tech_stack:
  added:
    - Currency-B stat parser: tolerant multi-pattern regex cascade for KS/IGG/CrowdSupply
    - SSRF guard: funnel-assemble.js ssrfGuard() ported to crowdfund-fetch.js (T-03-05)
    - Section-marker protocol: [SECTION] tokens on heading/structural boundaries (D-11)
    - Review-language tagging: [REVIEW_LANGUAGE_START/END] preserved verbatim (spec §6c)
    - Two-lane validation stamp: validation_lane[] + validation_strength{} (D-09, spec §3)
    - Anti-fluke floor: 60-day threshold SURFACED in output, never gated
    - Impression bucket multiplier table: ordinal 1-8 scale from Meta Ad Library labels
  patterns:
    - Tolerant multi-pattern regex cascade (extractTrendSeries idiom from fetch.js)
    - Never-fabricate: unparseable field = null, never a guess
    - Resilient-batch per-funnel try/catch (clean.js + fetch.js pattern)
    - Documented threshold block (classifyTrendShape style — explicit constants, auditability)
    - stripToText() core inherited from clean.js; extended for section markers + review blocks
key_files:
  modified:
    - tools/crowdfund-fetch.js
  created:
    - tools/funnel-clean.js
    - tools/funnel-score.js
decisions:
  - ssrfGuard() ported verbatim from funnel-assemble.js to crowdfund-fetch.js — hand-fed CF URLs
    are still operator-supplied and need the same SSRF protection (T-03-05).
  - extractReviewBlocks() runs on raw HTML before stripToText() strips tags — container class
    attributes (review/testimonial) are only detectable in HTML, not in stripped text.
  - impression_bucket_multiplier takes the BEST (highest) bucket across all bound_ads in the
    cluster — conservative choice that reflects the ad set's peak reach, not average.
  - validation_lane is an array (not a string) to carry both A and B simultaneously without
    inventing a combined/merged field — the D-09 invariant.
  - "claude" appears in the funnel-score.js comment "NO LLM (CLAUDE.md: deterministic → script)";
    this is a project-doc reference, not an API call. The automated verify script's grep-for-claude
    pattern trips on this; the acceptance criterion (no LLM call) is satisfied.
metrics:
  duration_minutes: 6
  completed_date: "2026-06-04"
  tasks_completed: 3
  tasks_total: 3
  files_created: 2
  files_modified: 1
---

# Phase 03 Plan 02: Post-Binding Bricks — crowdfund-fetch.js extension + funnel-clean.js + funnel-score.js Summary

One-liner: Three deterministic post-binding bricks wired — crowdfund-fetch.js parses Currency-B stats via tolerant pattern cascade; funnel-clean.js emits section-marked verbatim copy with review_language preservation; funnel-score.js stamps two-lane validation strength without normalizing the currencies.

## What Was Built

**Task 1 — crowdfund-fetch.js extended with Currency-B stat parser (D-07)**

`parseCurrencyBStats(text, html)` — tolerant multi-pattern regex cascade modeled on `fetch.js extractTrendSeries`. Parses four Currency-B fields from rendered crowdfunding page text:

- `amount_raised`: KS `$X pledged` / Indiegogo `$X raised` / generic fallback
- `backer_count`: `X backers` / `X supporters` patterns + multi-line innerText variants
- `funded_vs_failed`: `"funded"` | `"failed"` from `successfully funded` / `not successfully funded` / `Funding Unsuccessful` patterns
- `delivered_vs_not`: `"delivered"` | `"not_delivered"` from fulfillment status text (null when not surfaced — strongest signal requires creator profile, a separate `--type=` fetch)

Emits `crowdfunding_stats` into a `.stats.json` sidecar on `--type=campaign`. Existing render skeleton (goto → CF-clear loop → networkidle → expand-controls → dump html/txt/png) and `--type=` multi-page convention unchanged.

`ssrfGuard()` ported verbatim from `funnel-assemble.js` and applied BEFORE Playwright `goto` (T-03-05). Input size capped at `MAX_PARSE_BYTES = 500KB` before regex (T-03-07). All patterns bounded/linear — no nested unbounded quantifiers.

**Task 2 — funnel-clean.js created — section-marked verbatim cleaner (D-11)**

Reads `landing_page_body` from `funnel_package` JSON files. Core `stripToText(html)` inherited from `clean.js` (lines 45-71): kills `<script>/<style>/<nav>/<header>/<footer>`, strips remaining tags, decodes entities, collapses whitespace.

Extended beyond `clean.js`:
- Inserts `[SECTION]` marker tokens before h1-h4 headings and structural elements (`<section>/<article>/<main>/<aside>`). These are structural orientation points for the Section Analyzer — the cleaner does NOT decide belief boundaries (spec §5, D-11).
- `extractReviewBlocks(html)` runs on raw HTML before stripping: captures review/testimonial container classes and `<blockquote>` blocks verbatim. Tagged with `[REVIEW_LANGUAGE_START/END]` in the `cleaned_body` and carried separately in `review_blocks[]` for downstream `verbatim_refs[]` assembly (spec §6c). No scoring, no mining, no VOC pipeline built here.
- Provenance header convention from `clean.js` (line 109-110): `<!-- source: ... | cleaned: <ISO> -->`.
- Per-funnel `try/catch` batch — one bad funnel never aborts. Accepts single file or directory. Writes `_funnel-clean-log.txt` sidecar.
- No `belief_id`, no classification logic — cleaner stays dumb (verified by grep absence).

**Task 3 — funnel-score.js created — two-lane validation scorer (D-09)**

Pure-arithmetic scorer modeled on `fetch.js classifyTrendShape`. Reads a `funnel_package`, stamps `validation_lane[]` and `validation_strength{}` per currency lane.

Documented threshold block (classifyTrendShape style):
```
ANTI_FLUKE_FLOOR_DAYS = 60  // ~top 11% of all active Meta ads; SURFACED, never gated
IMPRESSION_BUCKET_MULTIPLIERS = { 'less than 1,000': 1, ..., '1,000,000+': 8 }
```

Currency A (`scoreCurrencyA`):
- `max_run_duration_days = Math.max(...bound_ads.map(a => a.run_length_days))` — the spine
- `impression_bucket_multiplier` = highest bucket multiplier across all ads in the cluster
- `variant_count` = number of distinct bound_ads
- `composite_rank_score = max_run × impression_multiplier × variant_count` (ordinal ranking, not absolute)
- `meets_anti_fluke_floor` flag surfaced in output — scorer never drops weak funnels

Currency B (`scoreCurrencyB`):
- Carries `amount_raised`, `backer_count`, `funded_vs_failed`, `delivered_vs_not` from `crowdfunding_stats` verbatim
- `_delivered_signal` field surfaces the strength interpretation for birdseye

A funnel with both `bound_ads` and `crowdfunding_stats` gets `validation_lane: ['A', 'B']` — both lanes stamped, never collapsed. Funnels with neither get `validation_lane: ['unknown']`. No LLM call in the file.

## Deviations from Plan

None — plan executed exactly as written.

The "claude" string in `funnel-score.js` appears only in a comment referencing the CLAUDE.md project rule: `"NO LLM (CLAUDE.md: deterministic → script)"`. This is documentation, not an API call. The acceptance criterion (no LLM) is satisfied.

## Threat Surface

All threat register items from this plan's threat model implemented:

| Threat | Mitigation | Location |
|--------|-----------|----------|
| T-03-05 (SSRF) | ssrfGuard() DNS + CIDR check ported from funnel-assemble.js, applied before Playwright goto | crowdfund-fetch.js |
| T-03-06 (DoS) | CF-clear loop bounded; goto/networkidle timeouts preserved; per-page try/catch; null on parse miss | crowdfund-fetch.js |
| T-03-07 (ReDoS) | Bounded/linear regex patterns; MAX_PARSE_BYTES cap (500KB for CF fetch, 2MB for clean); no nested unbounded quantifiers | crowdfund-fetch.js, funnel-clean.js |
| T-03-08 (prompt injection) | Reviews/copy preserved verbatim by design; funnel-clean.js never executes content; marks + preserves only | funnel-clean.js |

## Known Stubs

- `delivered_vs_not` in the Currency-B parser: campaign pages rarely surface prior-campaign delivery history. The strongest durability signal requires a separate `--type=creator` fetch against the creator's profile page — that fetch type is not yet implemented. Field is `null` in most campaign-page parses until a creator-profile fetch is wired. Document and move on; the field is in the schema and will be populated when the creator-profile fetch is added.
- `extractReviewBlocks()` uses HTML class-name heuristics (`review`, `testimonial`). Platforms that use hashed class names (common in Kickstarter's React rendering) will return empty `review_blocks[]`. The full cleaned body still contains the review text; the Analyzer can locate it via the stripped text. The review-block tagging is best-effort, not a hard requirement.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| tools/crowdfund-fetch.js | FOUND |
| tools/funnel-clean.js | FOUND |
| tools/funnel-score.js | FOUND |
| 03-02-SUMMARY.md | FOUND |
| commit 861cbb2 (Task 1) | FOUND |
| commit f2bf41f (Task 2) | FOUND |
| commit 1e6790f (Task 3) | FOUND |
