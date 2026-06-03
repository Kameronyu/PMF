# notes.md — Viwoods AiPaper Carta 1300 E Ink Tablet
# slug: viwoods-aipaper
# Gaps, blocks, and data quality issues

---

## Fetch Attempt Results

| Target | Method | Result |
|---|---|---|
| KS campaign main page | crowdfund-fetch.js --type=campaign | PLAYWRIGHT BLOCKED (Bash permission denied in this session) |
| KS campaign main page | WebFetch | 403 Forbidden |
| KS rewards page | WebFetch | 403 Forbidden |
| KS comments page | WebFetch | 403 Forbidden |
| KS updates/posts page | WebFetch | 403 Forbidden |
| KS FAQ page | WebFetch | 403 Forbidden |
| KS Update 4 (posts/4194272) | WebFetch | 403 Forbidden |
| KS Update 6 (posts/4244195) | WebFetch | 403 Forbidden |
| BackerKit tracker | WebFetch | 403 Forbidden |
| Kicktraq daily chart | WebFetch | Socket closed (not 403) |
| pre-launch.viwoods.com | WebFetch | SSL certificate error |
| GlobeNewswire (Aug 9) | WebFetch | SUCCESS — extracted |
| New Atlas (Aug 12) | WebFetch | SUCCESS — extracted |
| NotebookCheck (Aug 13) | WebFetch | SUCCESS — extracted |
| Geeky Gadgets (Sep 14) | WebFetch | SUCCESS — extracted |
| Good e-Reader (Aug 8) | WebFetch | SUCCESS — extracted |
| Good e-Reader (Jul 2 pre-launch) | WebFetch | SUCCESS — extracted |
| Parkablogs (Dec 5 review) | WebFetch | SUCCESS — extracted |
| splitbrain.org (Sep 2025) | WebFetch | SUCCESS — extracted |
| Viwoods About Us | WebFetch | SUCCESS — extracted |
| web3pr Medium | WebFetch | SUCCESS — extracted |
| Yahoo Finance PR | WebFetch | SUCCESS (paraphrase only) |
| openpr.com | WebFetch | 403 Forbidden |
| ereaderpro.co.uk | WebFetch | 409 Conflict |

---

## Specific Data Gaps

1. **Hero copy verbatim** — KS campaign body text not extractable. All campaign-body claims sourced from press that quotes KS copy. Faithfulness assumed but not guaranteed to match exact DOM text.

2. **Risks & Challenges verbatim** — Not available. Standard KS manufacturing risk clause assumed; no unique risk copy surfaced.

3. **Full FAQ verbatim** — Only 4 FAQ items recoverable from WebSearch snippets. KS FAQ page 403.

4. **Reward tier structure (complete)** — Only 2 price points confirmed from press (HKD 2,869 Mini / HKD 3,815 10.65"). Exact tier names (Super Early Bird, Early Bird, Regular) and quantities NOT confirmed. Geeky Gadgets noted "$378 early bird floor" but no tier name verbatim.

5. **Updates 1–3, 5, 7–29 content** — Only updates 4 and 6 discoverable via Google snippets. 27 of 29 updates have no verbatim content.

6. **KS comments verbatim** — All 6 KS public comments blocked. Zero verbatim backer comments available.

7. **Kicktraq daily data** — Socket error on fetch. Day-1 and total are confirmed from press; mid-campaign and final-72h daily numbers not available.

8. **BackerKit fulfillment page** — 403. No survey close date, address collection timing, or backer fulfillment timeline extractable.

9. **Tier sold-out status** — Not found. Likely multiple early tiers sold out given 500% in 30 min but no source confirms.

10. **Launch agency** — No Jellop/LaunchBoom/BackerKit pre-launch service attribution found. PR wire only (web3pr / GlobeNewswire). Could be self-managed or undisclosed agency.

---

## Data Quality Notes

- HKD / USD conversion: multiple sources use different rates. Evolution record uses "~$275k USD" for HK$2.15M. NotebookCheck pegs HKD 3,815 at ~$490. These are directionally consistent.
- Goal amount discrepancy: Good e-Reader reported "$4,996 USD goal" while Kicktraq snippet shows "HK$38,950 goal" (~$5k USD) and another search snippet shows "$38,950" as USD figure — this is likely a Kicktraq display issue or different snapshot. The HKD 38,950 (~$5k USD) is most consistent.
- Backer count: 542 on KS metadata vs. 535 "hardware backers" on Kicktraq — difference likely includes non-hardware pledge tiers (e.g., $1 community backers).

---

## REUSE Note

Evolution record at `/home/kyu3/PMF/runs/eink-tablets/eink-category-evolution/brands/viwoods-aipaper.md` was read first per REUSE rule. Transformation, claims, spec data, VOC, and Meta ad data copied verbatim into corpus. Research focused on crowdfunding-specific gaps only.
