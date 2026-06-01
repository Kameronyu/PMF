# notes.md — Zerowriter Fold
# Captured: 2026-05-24

---

## PLAYWRIGHT BLOCKED

The crowdfund-fetch.js Playwright script could not be executed in this sandbox run.
Bash tool was denied permission. ALL Kickstarter page fetches (campaign body, comments,
updates, risks, faq) were done via WebFetch and WebSearch fallbacks.

**Blocked fetches — orchestrator must run manually:**
```
node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js zerowriter-fold https://www.kickstarter.com/projects/zerowriter/zerowriter-fold --type=campaign
node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js zerowriter-fold https://www.kickstarter.com/projects/zerowriter/zerowriter-fold/posts --type=updates
node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js zerowriter-fold https://www.kickstarter.com/projects/zerowriter/zerowriter-fold/comments --type=comments
node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js zerowriter-fold https://www.kickstarter.com/projects/zerowriter/zerowriter-fold --type=risks
node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js zerowriter-fold https://www.kickstarter.com/projects/zerowriter/zerowriter-fold --type=faq
```

---

## 403 Fetches (WebFetch blocked by Cloudflare / React SPA)

- https://www.kickstarter.com/projects/zerowriter/zerowriter-fold → HTTP 403
- https://www.crowdsupply.com/zerowriter/zerowriter-ink → HTTP 403
- https://www.crowdsupply.com/zerowriter/zerowriter-ink/updates/more-orders-fulfilled-plus-a-pre-launch-announcement → HTTP 403
- https://www.crowdsupply.com/zerowriter/zerowriter-ink/updates/fully-funded-draftober-giveaway-and-cbc-radio-interview → HTTP 403
- https://www.crowdsupply.com/zerowriter/zerowriter-ink/updates/shipping-this-month-tariffs-pricing-our-user-guide-a-review-and-future-plans → HTTP 403
- https://zerowriter.ink/products/zerowriter-fold → HTTP 404 (product page not at this URL)

---

## Data Gaps

### campaign-body.md
- Hero copy sourced from creator's own LP (zerowriter.ink/pages/zerowriter-fold), NOT verbatim KS campaign page
- KS campaign may have different/additional copy, video description, stretch goal announcements
- Risks & Challenges section: not captured verbatim from KS; proxy from PCWorld interview
- Full FAQ: sourced from creator LP, not KS FAQ section which may differ

### tiers.md
- Tier names are unconfirmed (called "First Wave" from LP; actual KS tier naming may differ)
- Backer counts per tier not available
- Add-on pricing (black keycaps, custom switches) not confirmed dollar amounts
- Whether "First Wave" is sold out cannot be confirmed without live KS access
- Conversion kit (~$30) — Liliputing-sourced; may be a pledge manager add-on not a KS tier

### updates.md
- All 16 update titles, dates, and content unknown
- Only the "41 minutes to fund" milestone text captured (via KickTraq)
- Crowd Supply "pre-launch announcement" update text not accessible (403)

### comments.md
- 2 comments total — very thin. No verbatim KS comments captured
- Comment content entirely unknown

### chronology.md
- Daily pledge breakdown not available from KickTraq (chart placeholders)
- Day-1 raise amount not precisely known (only that goal was hit in 41 min)
- Final raise and backer count unknown (campaign ends June 9, 2026)

---

## Conflation Warning: Zerowriter Ink vs. Fold Numbers

Multiple press sources and search snippets conflate the Zerowriter Ink (Crowd Supply, 2024)
and Zerowriter Fold (KS, 2026) campaign numbers. Specifically:

**Misattributed to Fold:**
- "~$100k+" raise → actually Zerowriter INK's $143,530 USD on Crowd Supply
- "450+ backers" → may be approximation of Ink's 574 backers
- "570 backers" → Zerowriter INK final count

**Fold-specific (authoritative, from KickTraq as of day 5):**
- $204,626 CAD raised (~$149k USD at ~0.73 rate)
- 558 backers
- 292% funded
- Goal: $70,000 CAD
- Funded in 41 minutes

PCWorld article (May 19, 2026) explicitly states the "$100k+" figure is about the Ink campaign:
"with over $100,000 raised to produce and send it out to your backers" — referring to prior campaign.

---

## Price Inconsistency in Press

Multiple prices quoted for Fold in press:
- $239 USD — "First Wave" tier (creator LP)
- $258 USD — Hackster.io
- $260 USD — Liliputing
- $269 USD — PCWorld (interview, published launch day)
- ~$329 CAD — "First Wave" in CAD (creator LP)

Likely explanation: PCWorld was briefed pre-launch when early bird was $269. By launch, First Wave
pricing was $239. Hackster/Liliputing may be using a blended or mid-tier price. Orchestrator
should pull live KS tier prices via Playwright to resolve.

---

## Dead Links
- https://zerowriter.ink/products/zerowriter-fold → 404 at time of capture
