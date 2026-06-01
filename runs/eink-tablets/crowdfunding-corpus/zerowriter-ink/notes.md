# Zerowriter Ink — Notes, Gaps, Blocks
Captured: 2026-05-24

---

## PLAYWRIGHT BLOCKED

The node crowdfund-fetch.js script could not be run (Bash permission denied in this agent context). Playwright was not used for any fetches.

---

## Crowd Supply 403 Blocks

All WebFetch attempts to crowdsupply.com returned HTTP 403 Forbidden:
- https://www.crowdsupply.com/zerowriter/zerowriter-ink (main campaign)
- https://www.crowdsupply.com/zerowriter/zerowriter-ink/updates (updates index)
- https://www.crowdsupply.com/zerowriter/zerowriter-ink/updates/* (all individual update slugs)

This is consistent with the brief's warning: "Crowd Supply pages often 403 on WebFetch."

---

## Content Gaps from 403 Blocks

1. **Hero copy verbatim** — Campaign headline and full story body not captured verbatim from source. Reconstructed from press quotes (high confidence quotes sourced directly from press articles that quote campaign copy).

2. **Tier structure** — Campaign page tier block not captured. Single tier confirmed from all press ($199); tier backer count per tier not broken out.

3. **Risks & Challenges section** — Not captured. No press article reproduces this verbatim.

4. **FAQ section** — Not captured. Individual FAQs inferred from updates and press.

5. **All update bodies** — Only titles and rough content reconstructed from search snippets. Verbatim 200-300 char excerpts per update per brief spec not achievable without Playwright.

6. **Comments/Q&A** — Crowd Supply Q&A not accessible. No public comment thread equivalent to Kickstarter comments.

7. **Backer count per tier** — Single tier; total 570 confirmed but sub-tier breakdown not applicable.

---

## Dead Links / Not Found

- No Kicktraq data (Crowd Supply not tracked on Kicktraq).
- No BackerKit pre-launch page found.
- No r/zerowriter posts specifically about the Ink campaign surfaced via search (subreddit exists for original DIY project).
- Boing Boing article (Feb 2, 2026) returned 403 on WebFetch.

---

## Confidence Notes

**High confidence (multiple sources confirm):**
- Campaign dates: Sep 9 – Oct 17, 2024
- Final raise: $143,023 / $30,000 / 476% / 570 backers
- Price: $199 campaign / $279 post-campaign
- Display: 5.2-inch Inkplate, 1280×720
- Keyboard: 60% Kailh Choc hot-swap
- Battery: 5,000 mAh
- Manufacturer: Soldered Electronics, Croatia
- Creator: Adam Wilk

**Medium confidence (single or inferred sources):**
- Campaign funded within ~2 weeks (some sources say "under a week" — needs verification)
- Day-2 figure of $15,920 / 78 backers (single Good e-Reader snapshot)
- Spacebar defect count (~300 units)
- Update dates (some reconstructed from search snippet ordering)

**Low confidence / not verified:**
- Exact $143,023 figure vs PCWorld's "over $100,000" — the $143,023 figure comes from the task brief and is consistent with campaign completion; PCWorld may be rounding
- Whether all 17 updates have been identified — some updates likely missing from the reconstruction

---

## Ink vs Fold Context Note

Per task brief: "This is the PRECURSOR to the Zerowriter Fold — its raise numbers ($143k, 570 backers) are likely what press conflated with Fold."

Findings confirm this:
- Zerowriter Ink = Crowd Supply, 2024, $143,023, 570 backers — SHIPPED (late, as of May 2026)
- Zerowriter Fold = Kickstarter, 2025, separate raise (funded in 42 minutes; exact amount not confirmed via accessible source), estimated ship late 2026
- PCWorld (May 2026) explicitly distinguishes: "Adam's first crowdfunding campaign... raised over $100,000" (Ink), referencing the Fold as a separate current campaign
- Notebookcheck (May 2026) covers Fold without citing Ink figures — no conflation in that article
- Risk of conflation: any source that says "Zerowriter raised $143k" without specifying Ink is likely conflating; the Fold is on Kickstarter and its numbers are separate
