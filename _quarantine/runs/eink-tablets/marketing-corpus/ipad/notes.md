# iPad — Corpus Dump Notes (Gaps, Ambiguity, Re-run Items)

- brand: Apple iPad
- slug: ipad
- pulled_at: 2026-05-23
- extractor: corpus dumper (verbatim, no synthesis)

## Meta Ad Library — main gap

- Apple page (`pageID 434174436675167`) carries **~3,000 active ads**, of which the existing artifact (`adlibrary/apple_adv.txt`) loaded only **71 library_ids**.
- Of those 71, **zero are iPad creative.** Sample is saturated with the **iPhone 17 launch flight** (start dates clustered Apr 29, 2026). Verified via keyword grep over the artifact:
  - "ipad" — 0 hits / "iphone" — 65 / "macbook" — 1 / "airpods" — 1 / "pencil" — 0 / "magic keyboard" — 0 / "tablet" — 0 / "ipados" — 0
- **Action: orchestrator should re-run `adlib-one.js` for Apple with a deeper page cap (500–1000 library_ids)** OR re-run with a keyword filter on the Apple pageID (`q=iPad`, `q=Apple Pencil`, `q=back to school`). Outside Back-to-School (Jun–Sep) and iPad-launch flights, iPad share-of-voice on Meta is structurally low — synthesizer should expect Apple's brand-wide Meta presence to be iPhone-dominant.

## Pages that 404'd or returned dynamic placeholders this pull

| URL | Issue |
|---|---|
| https://www.apple.com/shop/buy-ipad | WebFetch returned nav-only — page is JS-rendered, hero copy not in static HTML |
| https://www.apple.com/shop/back-to-school | 404 |
| https://www.apple.com/shop/back-to-school-event | 404 |
| https://www.apple.com/shop/education-routing | 404 |
| https://www.apple.com/shop/buy-ipad/apple-pencil | 404 — Apple Pencil prices not freshly verified this run |
| https://www.apple.com/ipad/compare/ | Static HTML returned dynamic-pricing placeholders (e.g. `{IPAD2025_WIFI}`) — prices captured from per-model PDPs instead |
| https://www.apple.com/education/college-students/why-mac-and-ipad/ | 404 |
| https://www.apple.com/education/apple-teacher/ | 301 → https://education.apple.com/#/asset/part/T006360A — auth-walled (Apple ID), not directly fetchable via WebFetch |
| https://education.apple.com/learning-center/T006360A | 301 to internal Apple staging host |
| https://www.apple.com/sg/shop/back-to-school/terms-conditions | 404 |
| https://www.apple.com/ae/shop/back-to-school/terms-conditions | 404 |
| https://www.apple.com/ph-edu/shop/back-to-school/terms-conditions | 404 |

US Back to School T&C verbatim copy was not directly fetched; the funnel-mechanics file uses the WebSearch-index summary of regional T&C pages (UAE / PH / MY / SG). Re-pull from a US-region T&C URL recommended if precise US dates / promo-product list is load-bearing.

## Verbatim copy ambiguities flagged

- iPad Air PDP refers to "M4" chip throughout (verbatim on https://www.apple.com/ipad-air/ as of 2026-05-23). The Students-market existing record references "M3". Source-of-truth is the LP — keep verbatim "M4" in the corpus; raise the discrepancy at synthesis time.
- iPad mini PDP shows "$499.00" Wi-Fi and "$649.00" Wi-Fi+Cellular base prices. Confirmed.
- Apple Teacher Learning Center copy in partnerships.md is sourced from a WebSearch index excerpt (not a clean LP fetch) because education.apple.com is auth-walled — flag for re-pull via authenticated session if the synthesizer wants verbatim PD-course-list copy.

## Verbatim copy NOT extracted but known to exist (re-run candidates)

- Newsroom press releases for each iPad launch (iPad Pro M5, iPad Air M3/M4, iPad A16, iPad mini A17 Pro) — verbatim launch-day headlines and pricing announcements live at https://www.apple.com/newsroom/
- "Shot on iPhone" / "Made with iPad" creator-program landing pages — verbatim creator-program copy
- iPad-for-business sub-pages (e.g. /retail, /healthcare, /aviation) — verbatim industry-vertical copy
- AppleCare One landing page — verbatim bundle copy
- App Store iPad app collection / editorial pages — verbatim "Best for students" / "Best for note-taking" curation
- K-12 institutional Success Stories (individual case pages linked from "Explore Success Stories")

## Completeness self-assessment

- **Web LPs:** 12 LPs captured verbatim (main iPad, Pro PDP, Air PDP, mini PDP, A16 Buy PDP, K-12 main, K-12 Products, K-12 IT, K-12 Professional Learning, College Students, Education Store, Business, Apple Teacher). Solid coverage of the consumer + student + K-12 + business funnels.
- **Meta Ads:** 0 iPad ads captured in the existing artifact. This is the largest gap and requires an orchestrator re-run.
- **Funnel mechanics:** pricing tiers, education discount, BTS promo, financing, trade-in, CTAs all captured verbatim. AppleCare+ standalone callout not in iPad hero copy this pull.
- **Partnerships:** institutional programs (Apple School Manager, Classroom, Schoolwork, Apple Teacher, Apple Learning Coach, Apple Business) captured verbatim. Press / newsroom not extracted this run.

## File outputs

- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/ipad/landing-pages.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/ipad/meta-ads.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/ipad/funnel-mechanics.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/ipad/partnerships.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/ipad/notes.md`
