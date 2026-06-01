# tiers.md — Zerowriter Fold
# Source: zerowriter.ink/pages/zerowriter-fold; press coverage; KS search snippets
# Captured: 2026-05-24
# NOTE: KS campaign page 403'd. Tier data reconstructed from creator LP,
# PCWorld interview, Liliputing, Notebookcheck, and KS search snippets.
# Full tier list with backer counts per tier not obtainable without KS page access.
# See notes.md.

---

## Tier Structure (as reconstructed)

### Tier 1 — First Wave
- **Price:** ~$239 USD / ~$329 CAD
- **Retail price:** ~$329 USD
- **Discount vs retail:** $90 USD (33% off / ~27% off in CAD terms)
- **Contents:** Zerowriter Fold unit (standard switches, standard keycaps)
- **Limit:** 500 units (hard cap, first-in first-out)
- **Estimated delivery:** Late 2026 (official site); Mar 2027 (Liliputing, Hackster)
- **Ship-to:** Worldwide (shipping handled via pledge manager post-campaign)
- **Status:** Likely SOLD OUT or near limit — campaign has 558 backers as of day 4 and First Wave was capped at 500. Exact sold-out date not confirmed.
- **Notes:** "First units will be ready in late 2026, with fulfillment happening first-in, first-out."

Sources:
- zerowriter.ink/pages/zerowriter-fold, 2026-05-24
- Notebookcheck (Silvio Werner, 2026-05-21): "pricing beginning around $239"
- Liliputing (Brad Linder, 2026-05-22): "going for about $260 during crowdfunding"
- PCWorld (Michael Crider, 2026-05-19): "early bird price of $269 USD"

### Tier 2 — Standard / Early Bird (post-First-Wave)
- **Price:** ~$258–$269 USD (range from different press sources)
- **Contents:** Zerowriter Fold unit
- **Limit:** Not stated; open after First Wave cap reached
- **Estimated delivery:** Mar 2027 (Liliputing, Hackster); Jan 2027 (Notebookcheck)
- **Status:** Active
- **Notes:** PCWorld specifically cited "$269 USD early bird." Hackster cited "$258 per unit." Price inconsistency may reflect CAD/USD conversion at different rates or a second early-bird tier.

Sources:
- PCWorld (Michael Crider, 2026-05-19): "early bird price of $269 USD"
- Hackster.io (Nick Bild, ~2026-05-22): "currently seeking support through Kickstarter at $258 per unit"

### Add-On Options (from Stuff SA article)
- **Black keycaps:** Available for extra fee (exact price not captured)
- **Custom switch choices (hot-swappable):** Available for extra fee (exact price not captured)
- **Conversion kit for existing Zerowriter Ink owners:** ~$30 (Liliputing, 2026-05-22): "A conversion kit (~$30) will be offered in coming months for existing Zerowriter Ink owners"

Source: stuff.co.za (Brett Venter, 2026-05-22); Liliputing (Brad Linder, 2026-05-22)

---

## Shipping Notes (verbatim from creator LP)
"Shipping costs: approximately $20–35 USD depending on location"
"European customers: Expect VAT (varies by country: 19% Germany, 20% France/UK, 25%+ Scandinavia)"
"US customers: Approximately 10% tariff on Canadian imports (as of 2026)"
"Final pricing handled via pledge manager after campaign closes"

Source: zerowriter.ink/pages/zerowriter-fold, 2026-05-24

---

## Discount Gap Summary
- First Wave → Retail: $90 USD (33% discount)
- Standard/Early Bird → Retail: ~$60–70 USD discount (~18–21%)
- First Wave → Standard/Early Bird: ~$20–30 USD gap

---

## CAVEAT
Full tier list (names, backer counts per tier, exact sold-out states) requires
live KS page access. KS returned 403 to WebFetch and Playwright was blocked in
this sandbox run. Orchestrator should run:
  node crowdfund-fetch.js zerowriter-fold https://www.kickstarter.com/projects/zerowriter/zerowriter-fold --type=campaign
to get authoritative tier data.
