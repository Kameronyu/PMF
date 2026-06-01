# reMarkable — Corpus Dump Notes

Date pulled: 2026-05-23
Slug: remarkable
Dumper: 2nd attempt (1st attempt crashed on socket error before writing). All output files were written incrementally this session.

## Coverage summary

- **Landing pages:** 16 unique URLs fully dumped (verbatim hero + body):
  - / (homepage)
  - /business
  - /products/remarkable-paper/pure (PDP)
  - /products/remarkable-paper/pro (PDP)
  - /clp/the-future-of-focused-learning
  - /clp/why-remarkable-is-the-ultimate-study-tool
  - /clp/why-remarkable-is-my-ultimate-study-tool
  - /clp/a-thoughtful-gift-for-students
  - /clp/6-tips-for-improving-focus-with-remarkable
  - /clp/6-features-that-will-change-the-way-you-work
  - /clp/10-things-you-need-to-know-about-remarkable
  - /clp/meet-remarkable-the-paper-tablet
  - /clp/meet-remarkable-paper-pro-move
  - /clp/starting-is-easier-on-remarkable
  - /clp/5-ways-to-get-organized-with-remarkable-2b
  - /clp/type-folio
  - /clp/type-folio-for-remarkable-2
  - /clp/remarkable-paper-pro-top-10-features
  - /clp/remarkable-paper-pro-vs-remarkable-2
  - /clp/this-could-change-my-life-ijustine
  - /using-remarkable/business-solutions/higher-education-focused-learning
- **Meta ads:** 86 of ~500 active library_ids dumped (collapsed into ~25 unique creative groups), full verbatim
- **Funnel mechanics:** pricing, bundles, accessory prices, 50-day guarantee, free shipping/returns, payment options, CTA variations all captured
- **Partnerships:** 4 enterprise case studies, 12-logo wall, NHH university pilot, 8 named creator-partners, 6 press quotes, scientific advisor named

## Known gaps / blocked pages

- **Geo-gate:** remarkable.com displays a "reMarkable does not ship to your current location yet" banner for the agent's IP. Most pages still served body content via WebFetch, but two returned only nav/footer skeleton:
  - `/using-remarkable/find-your-focus` — only title "Get inspired and learn" returned
  - `/using-remarkable/business-solutions/transforming-education-focused-learning-with-remarkable` — got stat callouts + nav only, repeated content from the higher-education page

- **404s:**
  - `/store` returns 404 (the actual store path is product-specific, e.g., `/products/remarkable-paper/pure`). Price/accessory data was pulled by sub-agent prior to that error.
  - `/store/remarkable-paper-pure` returns 404. PDP lives at `/products/remarkable-paper/pure`.

- **CLP URLs not fetched in this pass (cap discipline):** The `/clp/` enumeration via WebSearch returned ~17 distinct URLs; all top-priority + thematic ones fetched. Not fetched (low marginal value vs. cap):
  - none — the discovered set was fully covered.

- **Meta ads:** scraper loaded 86 library_ids of an estimated ~500 active. Loaded sample is heavily Paper-Pure-launch dominated (May 13, 2026), with strong multilingual presence (EN/FR/DE + Spanish via creator). A re-run with deeper pagination would surface more variety. The synthesizer can request more pulls via `adlib-one.js` re-run if needed.

- **Ad with empty primary text:** Library ID 1530982211929232 returned no body text in the dump (only "Sponsored" + page name). Likely image-only ad — flagged but not invented.

## Page-ID resolution

Clean. Resolved advertiser: reMarkable / pageID 628821723950814 / 278.1K followers — matches official "reMarkable AS" account. Confidence: high.

## Notable patterns observed during extraction (descriptive, not analytical)

- Geo-block reduces but does not prevent extraction — body content was usually still in the HTML.
- Many CLPs share identical "Replace your notebooks and printed documents with the only tablet that feels like paper." closing line.
- Multiple LPs reuse the same 6-section "ultimate study tool" structure with different testimonials.
- Creator-partner ads each spawn ~9-16 library_id variants from one creative, suggesting heavy A/B placement testing.

## Affiliate / referral program

Not surfaced as a standalone LP in this pass. CLP `/clp/5-ways-to-get-organized-with-remarkable-2b` uses "Buy now at Amazon" CTA suggesting an Amazon retail channel exists; no separate /affiliates or /referral page enumerated.

## Files written

- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/remarkable/landing-pages.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/remarkable/meta-ads.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/remarkable/funnel-mechanics.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/remarkable/partnerships.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/remarkable/notes.md` (this file)
