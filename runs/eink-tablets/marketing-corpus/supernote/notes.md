# Supernote — Corpus Notes & Gaps

Pulled: 2026-05-23. Corpus dumper: Claude (Opus 4.7 1M).

## Resolved advertiser
- Meta Page: **Supernote** — `pageID 103377907733340` (10.2K followers, FB `@rattasupernote` / IG `@supernote_official`). Confirmed correct page (typeahead score 115.0, highest). Regional pages (Supernote Europe, Supernote Taiwan) exist but were not dumped — they may run additional ads not captured here.

## Source files reused
- `/home/kyu3/PMF/runs/eink-tablets/adlibrary/supernote_adv.txt` — 11 active ads, all dumped to `meta-ads.md`.
- `/home/kyu3/PMF/runs/eink-tablets/adlibrary/Supernote_adv.txt` — duplicate of above (case difference).
- `/home/kyu3/PMF/runs/eink-tablets/adlibrary/Supernote.txt` — older basic dump (677 lines), not re-extracted; superseded by `_adv.txt`.

## Pages that WebFetch could not extract content from (returned nav/footer only)
1. **`/pages/student-discount-program`** — multiple attempts; recovered details via support article `https://support.supernote.com/en_US/my-order/student-discount` and a Google search snippet. Discount amount ($20), eligibility (university email, 6,000+ schools), and verification flow captured in `funnel-mechanics.md`. Specific third-party vendor not named on page (likely GovX based on Hero program but unconfirmed).
2. **`/pages/distinguished-contributors`** — page returns only nav. Program description, contributor names, perks, and entry criteria NOT captured. Flagged in `partnerships.md`.

These are most likely Shopify pages with content rendered client-side or behind heavier templating that the WebFetch markdown converter strips. A browser-rendered fetch would resolve.

## Pages not crawled (deferred — likely low marketing-corpus value)
- `/collections/devices` — superset of Manta+Nomad PDPs already dumped.
- `/collections/folios` — covered indirectly via accessories listing.
- `/pages/help-me-choose-supernote-pens` — accessory upsell flow; not critical to brand-level corpus.
- `/pages/contact-us` — service page.
- `/pages/data-sharing-opt-out`, `/policies/*` (other than refund) — legal pages.
- `cloud.supernote.com`, `support.supernote.com` — product/support subdomains; pulled only what was directly relevant (refund policy on main site, student discount support article).
- Older blog posts beyond first 10 — not enumerated; first page surfaced via `/blogs/supernote-blog`.

## Ad library completeness
- All 11 active US-page ads dumped verbatim. No paginated overflow noted in the adlib scrape.
- CTA destination URLs NOT captured — Meta Ad Library only exposes display domain (SUPERNOTE.COM), not the full UTM-tagged LP. Synthesizer can probably infer Manta vs Nomad LP from creative content.
- 4 of the 11 ads are duplicates (same creative + copy re-launched on a later date with a new library_id): Ads 2/6 (Jay T. testimonial), Ads 4/7 (Gabriel testimonial), Ads 8/10 (Manta "Value Beyond Years"), Ads 9/11 (space cadet collab). Indicates a winning-creative re-rotation pattern; tag accordingly during synthesis.

## Ambiguities
- Open-box list shows products perpetually sold out at time of pull. Whether this is genuine real-time inventory or a list management artifact is unclear.
- LAMY Special Set price not directly visible on its LP — only inferred from open-box "regular price $539.00 USD" for the full set.
- About Us extraction is partially paraphrased by WebFetch — direct quotes marked, paraphrases marked `[paraphrase]`. A re-fetch with a stricter "verbatim only" prompt would tighten this.

## Files written
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/supernote/landing-pages.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/supernote/meta-ads.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/supernote/funnel-mechanics.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/supernote/partnerships.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/supernote/notes.md`
