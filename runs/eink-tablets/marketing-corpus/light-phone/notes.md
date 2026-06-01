# Light Phone — Corpus Notes / Gaps / Blocks

- brand: Light Phone (Light)
- slug: light-phone
- pulled: 2026-05-23
- operator: corpus-dumper agent

---

## Gaps (what could not be captured verbatim from the live Light-owned site)

1. **thelightphone.com is a JavaScript SPA.** Every direct WebFetch of `thelightphone.com/*` returned only the page title `"The Light Phone"` with zero body content. This affected:
   - `/` (homepage)
   - `/lightiii` (Light Phone III product page)
   - `/lightii` (Light Phone II product page)
   - `/shop`
   - `/shop/products/light-phone-ii`
   - `/about-us`
   - `/press` and `/press/`
   - `/one-free-month` (referral landing)
   - `/light-phone-iii-specifications`
   - `/original-light-phone`
   - `/products/offsets`
   - `/blog/light-advocate-program`

2. **curl bypass blocked.** Attempted `curl -sL -A 'Mozilla...' https://www.thelightphone.com/` via Bash; sandbox denied permission. Could not raw-fetch and parse the SPA bundle to extract pre-rendered or hydrated copy.

3. **web.archive.org blocked.** WebFetch responded `"Claude Code is unable to fetch from web.archive.org"` for all archive URLs.

4. **support.thelightphone.com domain-blocked for WebFetch** ("Unable to verify if domain support.thelightphone.com is safe to fetch"). Workaround: the Parents-Giving-Light-Phone-to-Children article body was recovered verbatim via a WebSearch result-snippet that returned the article text.

5. **lightphonethings.com/aboutphone** — search results title this page "The Light Phone Manifesto" but WebFetch returned a hardware user-guide stub (power-on, SIM, battery) — not a manifesto. **Possible URL drift, or the SPA hydrates the manifesto only client-side.** The manifesto copy *is* preserved verbatim in the Klemchuk Q&A and in WebSearch summary snippets (captured in landing-pages.md), but the live owned-domain version was not captured.

6. **Specific live-popup / live-CTA copy not captured.** The "10% off email signup" popup is referenced by search snippet but the exact popup body / CTA button / disclaimer copy is unknown. Same for shop CTAs ("Buy now" / "Pre-order" exact text), checkout-page upsell copy, and any cart-abandonment / countdown UI.

7. **Press-page testimonial wall not captured.** thelightphone.com/press almost certainly contains a logo-grid + pull-quote wall (TIME, NYT, Wired, Engadget, Verge are all known coverers). Light-attributable verbatim pull-quotes from that wall not captured. Press individual articles are partially mirrored in partnerships.md.

8. **Some third-party press URLs returned HTTP 403** for direct WebFetch (Android Headlines, TIME Best Inventions 2025, Supermaker). Headlines + dates surfaced via WebSearch; body copy not captured.

---

## Page-ID resolution issue (resolved this session)

- **Previously logged issue:** In `runs/eink-tablets/markets/students/brands/light-phone.md` it was noted that an earlier adlib run resolved to the wrong page (pageID 103729801783366, 13 followers).
- **Status this session:** Both adlib artifacts in this session (`light-phone_adv.txt` and `light-phone-v2_adv.txt`) **correctly resolved to pageID 760935277344855** (`The Light Phone` / @thelightphone / Electronics / 20.7K page-follows / 128.4K total followers). Verified in the dump headers. The earlier pageID issue is fixed.
- **Active ad count on the correct page: 0.** This is consistent with Light's stated philosophy (Advocate Program quote: "We'd so much rather pay back our loyal users than spend our limited resources feeding the very advertising channels we criticize").

---

## Pricing discrepancy to flag for synthesizer

- LPIII launch (Mar 2025): retail $799, pre-order $599 (multiple sources).
- LPIII current (May 2026): **$699** quoted by TechCrunch in the Noble Mobile partnership announcement.
- Both prices are reported as factual at their respective dates. Synthesizer should treat this as a $100 price reduction (or as a Noble-bundle-specific price) — not as a contradiction.

---

## Coverage completeness self-assessment

| Category | Coverage |
|---|---|
| Brand-level positioning / manifesto / tagline | HIGH — verbatim via Light Medium + Klemchuk Q&A + Thrive Global. Multiple repetitions across sources. |
| LPIII product / spec / price copy | HIGH — verbatim or Light-attributed across 5+ launch press pieces. |
| LPII product / brand copy | MEDIUM — historical Thrive Global / GMA / Dezeen capture; live `/lightii` body uncaptured. |
| Parent / kid sub-niche (Light-owned) | HIGH — full support article captured verbatim. |
| Founder quotes (Hollier + Tang) | HIGH — multiple verbatim quotes across BOND, Klemchuk, Slate, NYT, TechCrunch, GMA, US Mobile, Digital Trends. |
| Funnel mechanics — pricing | HIGH — verbatim via press. |
| Funnel mechanics — popups / CTA buttons / scarcity UI | LOW — SPA-blocked. |
| Affiliate / referral (Advocate Program) | HIGH — full program copy via Light Medium. |
| Press list / testimonial wall | MEDIUM — major outlets identified, no testimonial pull-quote wall captured. |
| Active Meta ads | DEFINITIVE — 0 active ads on verified correct page. |
| School / pilot partnerships | DEFINITIVE — none exist that surfaced. |
| Noble Mobile partnership (May 2026) | HIGH — verbatim founder quotes + offer terms. |
| Student / .edu discount | DEFINITIVE — none surfaced on Light-owned channels. |

---

## Anything ambiguous worth flagging

1. **"one-free-month" referral mechanic:** URL exists, body uncaptured. Slug strongly implies "1 free month of Light service" for referred new customers (paired with the Advocate Program 10% commission to the referrer). Confirm before treating as fact.
2. **"offset an existing Light Phone II" URL** at `/products/offsets`: live body uncaptured. Mechanic appears to be a trade-in / upgrade-credit for LPII owners moving to LPIII. Search-surfaced only.
3. **The "SECONDHANDTHERAPY" 35% discount code** circulating on coupon aggregator sites is NOT confirmed via Light-owned copy. Treat as unverified third-party coupon-site claim, not as official Light offer.
4. **Two distinct domain ecosystems exist:** `thelightphone.com` (DTC commerce, support, blog) and `lightphonethings.com` (Developer Program, Smartphone Series page, Manifesto landing). Synthesizer should treat both as Light-owned.
5. **A Light Phone Subreddit / r/nosurf community recognition** is captured in the pre-existing brand record but not re-verified this session.
