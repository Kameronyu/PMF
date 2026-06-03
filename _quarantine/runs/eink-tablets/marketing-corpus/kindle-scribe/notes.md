# Kindle Scribe — Corpus Dump Notes / Gaps

date_pulled: 2026-05-23
slug: kindle-scribe

## Sandbox / fetch issues

- Amazon storefront returns HTTP 503 to WebFetch on every attempt this run.
  This matches the same block observed in the prior Faith and Students
  market runs. Affected URLs include:
  - https://www.amazon.com/kindle-scribe
  - https://www.amazon.com/kindle/shop/kindle-scribe
  - https://www.amazon.com/kindle/
  - All Scribe PDPs (B0DVQQGMCZ, B0DWRBVDN6, B0FC1VJJFP, B0CZ9VFQ2P,
    B09BS26B8B, B09BSGFTHY) — body 503, only `<title>` and
    `<meta description>` retrievable.
- Workaround used: extracted the About Amazon press release verbatim
  (Amazon-owned, NOT blocked), plus PDP titles / meta tags, plus Google
  search snippets that surfaced the live "About this item" bullets.
  All such extracts are clearly marked in `landing-pages.md` and
  `funnel-mechanics.md` with source.

## Page-ID issues

- NONE this pull. "Amazon Kindle" page (Facebook pageID 14408401557,
  3.5M followers, typeahead score 118.5) is the verified-correct official
  brand page. Prior Faith run had originally mis-resolved to "Doc genie -
  Kindle Scribe Cloud Storage"; that has been corrected and the current
  dump uses the right page.
- Side effect: ~1,100 active ads in the dump are the entire Kindle-line
  paid output (Paperwhite, Colorsoft e-reader, Kindle Unlimited, Scribe).
  This corpus separates Scribe-specific creatives (37 distinct creatives
  across 11 message clusters) from Kindle-general creatives in
  `meta-ads.md`.

## Re-use vs re-run

- `adlibrary/kindle-scribe_adv.txt` dated 2026-05-22 16:25 (one day stale).
  Re-used as-is per brief — within session window and Faith record already
  verified page-ID resolution.

## Completeness

- Landing-page coverage: GOOD on Amazon-owned press release; PARTIAL on
  storefront pages (titles/meta only, body 503). Sufficient for synthesis
  on transformation / claim level — gap is granular "About this item"
  bullets where storefront body would have been preferred over Google
  snippet copy.
- Meta-ad coverage: GOOD. 37 Scribe-specific creatives across 11 verbatim
  copy clusters extracted with library_id + start_date + format + headline
  + CTA. German localized variants captured separately. Non-Scribe Kindle
  ads on same page documented for completeness.
- Funnel mechanics: PARTIAL. Pricing tiers, SKU configurations, CTAs
  captured verbatim. Star-rating counts, in-page popups, countdown timers
  NOT retrievable due to 503. Prime / Prime Student program eligibility
  for Scribe specifically: confirmed-absent of any first-party Amazon
  Scribe-edu copy in this and prior runs.
- Partnerships: GOOD on press coverage (12 third-party review URLs
  captured). NONE on school / faith / ministry partnerships — confirmed
  absent.

## Items for synthesizer to know

- The dominant 2026 creative hook (most ad variants) is "What are you
  working on?" used as the headline across nearly every Scribe ad.
- The most heavily duplicated primary-text clusters: "messy handwriters,"
  "Recap your handwritten notes," "The one who 'owns' the meeting,"
  "Never print again," "The hardest workers need hard-working tools."
- German is the only non-English locale with Scribe-specific creative
  variants in the dump (DE creatives). No Scribe-specific FR/IT/ES/PT
  creatives observed — those locales run KU/ebook-deal ads only.
- Zero student, parent, K-12, college, faith, devotional, or Bible copy
  anywhere in Amazon's own first-party material (confirmed cross-checked
  against prior Faith + Students records).
