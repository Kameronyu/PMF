# Daylight DC-1 — Corpus Notes / Gaps / Ambiguities

Slug: daylight-dc1
Dumped: 2026-05-23
Dumper: Claude (sandbox)

---

## Scope discipline applied
- This corpus covers ADULT DC-1 ONLY (daylightcomputer.com flagship).
- Daylight Kids creatives and copy were INTENTIONALLY excluded from landing-pages.md, even when found on the same root domain. The two Kids ads found on the "Daylight Computer Co." Meta page (Library IDs 25449345561351571 and 1387928046359715) are listed in meta-ads.md only as a flag for the orchestrator — they belong in the `daylight-kids/` corpus.
- kids.daylightcomputer.com was NOT crawled here.

---

## Sandbox blocks
- `adlib-one.js` execution was denied by the sandbox. The existing Meta Ad Library artifacts in `runs/eink-tablets/adlibrary/` (dated 2026-05-22, within Phase-0 window) were treated as current. Specifically:
  - `daylight_adv.txt` — flagship "Daylight Computer" page (pageID 575419519610777), 0 active ads
  - `daylight-kw_adv.txt` — keyword "Daylight Computer DC-1 tablet", 0 advertisers resolved
  - `Daylight_adv.txt` — forced "Daylight Computer Co." page (pageID 125345827332586), 2 active ads (both Kids creatives, not adult DC-1)
- Direct Meta Ad Library URL fetch via WebFetch closed the socket — Meta blocks scripted fetches. Data from the local adlib artifacts is the source of truth.
- `buy.daylightcomputer.com/products/daylight-tablet` WebFetch was blocked by enterprise security policy. PDP-specific copy (warranty length, full FAQ answers, return-shipping terms) was therefore not extractable. Cart page (daylightcomputer.com/cart) and homepage substitute for most pricing/policy copy.

---

## Page-ID issues to flag for orchestrator
- Two Meta pages exist for the same brand:
  - **"Daylight Computer"** — pageID 575419519610777, ~59.9K followers — appears to be the consumer-facing brand handle but is dark on Meta paid (0 ads).
  - **"Daylight Computer Co."** — pageID 125345827332586, ~40.4K followers — runs the active Kids creatives.
- The current adult-DC-1 paid surface is empty on both pages. The Co. page is being used to run Kids ads.
- A third related page, "Daylight Kids" (pageID 773476125853061), is referenced in the Faith record but has only 56 followers — Kids creatives appear to ride the larger Co. page rather than the dedicated Kids page.

---

## FAQ extraction gaps
- The FAQ page (daylightcomputer.com/faq) renders question titles but the answer bodies require JS-expand or per-question URLs — WebFetch returned only category headers and question titles, not answer text. Confirmed-present questions with extracted answers limited to:
  - Return policy: "a 30 day return policy" (from support hub)
- Unanswered (questions present, bodies not extracted):
  - Warranty length
  - VAT handling specifics
  - International shipping countries
  - PO box shipping
  - Shipping cost
  - Discount code availability and terms
  - BTC payment mechanism
  - Affiliate program terms

---

## Conflated brand caution
- `community.godaylight.com` and "Sunnyside" ambassador program references in web search results appear to belong to a DIFFERENT company (a wellness/circadian-rhythm app at godaylight.com), not Daylight Computer Co. Not added to partnerships.md as confirmed.

---

## What's confidently present
- Full homepage hero / use-case / outdoor-computing / testimonials / press logos / founder message
- Full product page feature copy and spec list (verbatim)
- Cart page pricing, accessory list, guarantee panel
- All three adult-funnel blog posts (titles, dates, authors, opening paragraphs)
- Press kit description, founder bio, asset list
- Support hub structure and resource URLs
- Press placements + agency relationship (Finesse Group case study)
- Inspired Internet Pledge commitments
- Eye Strain Pilot Study referral CTA

---

## What's missing / partially captured
- Full FAQ answer bodies (warranty length, shipping costs)
- buy.daylightcomputer.com PDP-specific copy (blocked by sandbox security)
- Video transcripts (per brief — out of scope; user reviews separately)
- Full bodies of blog posts (only openings + product callouts captured — sufficient for synthesizer to find verbatim phrasings; can extend if needed)
- Confirmation of any active affiliate or ambassador program for the adult DC-1
- Owned email-sequence copy (subscriber-only)

---

## Files written
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/daylight-dc1/landing-pages.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/daylight-dc1/meta-ads.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/daylight-dc1/funnel-mechanics.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/daylight-dc1/partnerships.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/daylight-dc1/notes.md
