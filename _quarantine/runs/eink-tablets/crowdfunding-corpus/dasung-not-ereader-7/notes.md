# notes.md — Dasung "Not an e-Reader" 7.8"
# slug: dasung-not-ereader-7
# platform: Indiegogo
# captured: 2026-05-24

---

## Sandbox / Fetch Blocks

### PLAYWRIGHT BLOCKED
- Bash execution was denied in this session
- crowdfund-fetch.js could not be run for campaign, comments, updates, or risks
- No raw/ HTML/TXT/PNG artifacts were generated

### IGG Page 404
- Primary campaign URL: https://www.indiegogo.com/projects/dasung/not-ereader → HTTP 404
- Alt URL: https://www.indiegogo.com/en/projects/dasung/not-ereader-first-e-ink-mobile-phone-monitor → page title only (React SPA; body not rendered by WebFetch)
- IGG has removed the campaign page since the original 2018 run

### Wayback Machine Blocked
- web.archive.org → "Claude Code is unable to fetch from web.archive.org"
- Could not retrieve archived snapshots of the IGG campaign page from 2018–2019

### Liliputing Tag Page 403
- https://liliputing.com/tag/dasung-not-ereader/ → HTTP 403

### Digital Reader 403
- https://the-digital-reader.com/dasung-launches-a-10-3-ereader-on-kickstarter-with-a-ridiculous-price/ → HTTP 403

---

## Data Gaps

### Backer Count (exact)
- "Hundreds" confirmed in multiple Good e-Reader articles
- Exact number never surfaced in any accessible source
- IGG page gone; Wayback blocked
- Implication: if avg pledge was ~$369 early-bird = ~$294 CAD, then $252,000 CAD ÷ $294 CAD ≈ 857 backers (rough upper bound); if most took $439 = $370 CAD, ÷ $370 ≈ 681 backers
- These are back-calculations only, not confirmed figures

### Funding Goal
- Not found in any press coverage or surviving source
- Campaign may have been IGG flexible funding (no minimum goal required)
- The "% funded" metric is therefore unknown

### Campaign Close Date
- Good e-Reader (2020-07-30) says "closed their Indiegogo campaign in December" — interpreted as December 2018 based on campaign launch (~Oct 2018) and standard 60-day IGG window
- Could be December 2019 if the campaign ran longer; press does not clarify

### Official Update Post Text
- No verbatim IGG update text recovered
- IGG updates URL not accessible; Wayback blocked
- Update timeline reconstructed entirely from press coverage and forum proxy data

### IGG Comment Section
- No verbatim IGG comments recovered
- Community sentiment sourced from: MobileRead forums (threads 318909, 322138), press characterizations of comment section activity

### Tier Backer Counts
- Sold-out status per tier not recoverable
- Whether additional tiers existed (super-early-bird, bundles) not confirmed

### Final Fulfillment Status
- As of Jul 2020: <60 units shipped
- Whether Sep/Oct 2020 mass production promise was fulfilled is not confirmed in accessible press
- IGG page now 404 suggesting campaign is fully archived/closed

---

## Source Quality Notes

- Good e-Reader (Michael Kozlowski) is the primary source for quantitative claims (~$252k CAD, "fewer than 60 units," "hundreds of backers"). Kozlowski has a track record of close monitoring of this space; the claims are internally consistent across multiple articles.
- MobileRead forum posts are verbatim (individual backers); small sample but authentic.
- All other press repeats the same confirmed data from Kozlowski / press previews.
- No Reddit threads with substantial Dasung IGG discussion were found in accessible searches.

---

## Re-run Instructions

If Bash/Playwright permissions are granted in a future session:
```
node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js dasung-not-ereader-7 \
  "https://www.indiegogo.com/projects/dasung/not-ereader" --type=campaign
```
Expected result: HTTP 404 (campaign removed). Try Wayback instead:
```
# Try these Wayback CDX API endpoints:
https://web.archive.org/cdx/search/cdx?url=indiegogo.com/projects/dasung/not-ereader&output=text&from=20181001&to=20191231
```
