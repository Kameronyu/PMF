# AINOTE 2 — Gaps, Blocks, Issues
Captured 2026-05-24.

---

## PLAYWRIGHT BLOCKED
KS main campaign URL returned HTTP 403 on both WebFetch and crowdfund-fetch.js (Bash permission was denied during this session — could not execute the Playwright node script). All KS-hosted content (campaign body, tiers, updates, comments, risks, FAQ) was reconstructed from third-party press coverage.

Affected files:
- campaign-body.md: hero copy partially reconstructed; Risks & Challenges and FAQ sections NOT recovered
- tiers.md: tier names/prices approximate; sold-out flags and exact backer counts per tier not confirmed
- updates.md: KS update posts not fetched; milestones reconstructed from press timestamps
- comments.md: no verbatim KS comments; backer sentiment from post-launch reviews only

---

## Specific Gaps

### Risks & Challenges section
Not available. KS page 403'd. No press source reproduced this section verbatim.

### FAQ section
Not available. KS FAQ 403'd. store.iflytek.com/pages/ainote-2-faq also 403'd on WebFetch.
iFlytek's main site FAQ (iflytek.com/en/support/faq/ainote_2.html) also 403'd.

### Exact tier structure
- Tier names are inferred ("Super Early Bird", "Early Bird", "Regular") — not confirmed verbatim from KS
- $480 (stereoindex, day 4) vs $519 (goodereader, ~end of campaign) price discrepancy suggests tier sold out and price stepped up — but this is inferred, not confirmed
- Whether a "kit" or "bundle" tier existed (with folio/stylus holder) is not confirmed — note that the retail store sells folio separately

### Tier backer counts / sold-out flags
Not available from any press source.

### KS campaign updates (posts)
KS /posts URL not fetched. Number of updates, exact dates, and content not known. Likely 3–6 updates based on campaign length and typical practice.

### KS comments verbatim
No verbatim KS comments captured. Post-delivery backer sentiment sourced from review sites and forum threads only.

### Kicktraq daily chart
Kicktraq page loaded but chart data (bar graphs) did not render as extractable text. Day-1 specific dollar amount not confirmed; estimated from trajectory.

### higizmos.com reservation page
Page returned blank content — pre-launch tier details and email-capture numbers not available.

### Wayback Machine check
Pre-launch theainote.com / higizmos.com Wayback snapshots not checked in this session. Recommended for future follow-up to confirm exact pre-launch messaging and timing.

### Launch agency
No evidence found. iFLYTEK may have run campaign in-house through a Hong Kong entity ("The AINOTE" creator account). Could not rule out undisclosed agency.

---

## Data Confidence Levels

| Data Point | Confidence | Source |
|------------|-----------|--------|
| Final raise (~$1.13M / HK$8.83M) | High | Multiple press sources + Kicktraq |
| Backer count (1,691) | High | Multiple press sources |
| Goal (~HK$70,000) | High | Kicktraq |
| Campaign dates (Sep 9 – Oct 9) | High | Multiple sources |
| Shipped Nov 2025 | High | Press release + reviews |
| Super Early Bird price ($480 or $519) | Medium | Two sources disagree |
| Hero copy | Medium | Aggregated from press; not directly from KS page |
| Tier names | Low | Inferred from press language, not KS source |
| Risks & Challenges | None | Not available |
| FAQ | None | Not available |
| Update content | Low | Only milestone references, no post text |
| Comment content | None | KS comments not fetched |
