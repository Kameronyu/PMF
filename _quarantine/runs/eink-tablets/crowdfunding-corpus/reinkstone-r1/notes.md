# notes.md — Reinkstone R1
Gaps, blocks, fetch issues, dead links. 2026-05-24.

---

## Fetch Attempts and Results

| URL / Resource | Method | Result |
|---|---|---|
| Campaign body | Playwright (raw/) | OK — full text extracted |
| Comments page | Playwright (raw/) | OK — 25 of 1,318 comments visible |
| Updates page | Playwright (raw/) | Partial — 10 of 31 updates visible (all backers-only) |
| KS FAQ page | Playwright (raw/) | Not fetched by orchestrator; WebFetch returned 403 |
| Kicktraq daily chart | WebFetch | Text data OK; chart image (PNG) not parseable |
| BackerKit project page | WebFetch | HTTP 403 |
| Trustpilot reviews | WebFetch | HTTP 403 |
| tabletmonkeys.com article | WebFetch | HTTP 403 |
| BackerKit Backer Tracker | WebFetch | HTTP 403 |
| web.archive.org | WebFetch | Blocked (not accessible via this tool) |
| reinkstone.com/products/reinkstone-r1 | WebFetch | HTTP 404 (product removed) |
| reinkstone.com/products/reinkstone-r1-with-stylus-case | WebFetch | HTTP 404 (product removed) |
| ewritable.com/tablets/reinkstone-r1/review/ | WebFetch | 301 redirect to unrelated URL — content gone |
| Good e-Reader (all articles) | WebFetch | OK |
| Liliputing article | WebFetch | OK |
| PR Newswire press release | WebFetch | OK |
| The eBook Reader blog | WebFetch | OK |
| reinkstone.com homepage | WebFetch | OK |

---

## Content Gaps

1. **Updates #1–#19** — Not loaded. Only updates #20–#29 visible. Earlier updates (campaign phase through mid-2022) contain the delay messaging and early backer communications but are backers-only and not recoverable without login.

2. **FAQ content** — KS FAQ page blocked (403). Campaign header shows "FAQ 6" (6 FAQs exist). Content unknown.

3. **Comments #26–#1318** — Only first 25 loaded. Backers from campaign launch period (2021) and mid-phase backers not visible. Positive early comments (if any) not captured.

4. **Exact shipment count** — How many of 2,424 backers received units is unknown. "First batch" announced Dec 2022 but quantity not stated.

5. **Pre-launch page / notify-me** — No Wayback-accessible pre-launch page found. Archive.org blocked.

6. **Daily pledge breakdown** — Kicktraq chart image not parseable. Day-by-day data not recovered.

7. **Good e-Reader "First Look" date** — URL found but exact date not retrieved via WebFetch.

8. **Wisky EE Write crowdfunding history** — Referenced in Good e-Reader review context (parent company Wiwood had prior crowdfunding campaign with <30% fulfillment rate). No direct URL or campaign link recovered.

9. **Reink Case launch date** — ereaderpro article title references "iPhone14 Series" (launched Oct 2022), suggesting Reink Case C1 launched ~late 2022. No exact date found.

---

## Known Data Quality Issues

- Kicktraq reported $500K in 12 hours; Good e-Reader reported "$600,000 CAD within 24 hours." These are not contradictory (CAD vs USD, different time windows) but require noting.
- Campaign KS page says "29 Updates" in navigation but updates page footer says "Showing 10 of 31 updates." Discrepancy of 2 — possibly 2 updates deleted or the count is inconsistent. Used 29 as official count (per KS header).
- Good e-Reader "R1 is a 10.3 inch" headline vs. all other sources saying 10.1 inch — likely editorial error in that article.

---

## Red Flags Noted for Teardown Synth

- Parent company (Wiwood) had prior crowdfunding campaign with documented low fulfillment rate
- Review unit delivered to Good e-Reader showed "severe ghosting" and "bug riddled" software
- Original delivery promise: Nov 2021 — actual first batch: Dec 2022 (13+ months late)
- Company continued selling phone cases (new product line) while R1 backers waited
- R1 product pages removed from website as of 2026-05-24
- Last update Aug 22, 2023 — 2+ years of silence with 1,318 comment thread of refund demands
- eBay resale price of ~$15.50 for a device backers paid $329–$479 for
