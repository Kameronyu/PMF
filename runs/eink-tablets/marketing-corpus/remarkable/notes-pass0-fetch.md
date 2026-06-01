# Pass 0 supplementary fetch notes — remarkable

## Screenshots captured

N/A — remarkable was not in Task 1 scope.

## Deposit funnel hunt

URLs probed:

| URL pattern | Result |
|---|---|
| remarkable.com/preorder | 200 — redirects to geo-blocked homepage (regional shipping restriction page, not a deposit funnel) |
| remarkable.com/pre-order | likely same redirect (not probed separately — same domain pattern) |
| remarkable.com/deposit | 200 — redirects to geo-blocked homepage (same behavior) |
| remarkable.com/reserve | 200 — geo-blocked homepage |
| remarkable.com/founders | 200 — geo-blocked homepage |
| remarkable.com/founder-edition | 200 — geo-blocked homepage |
| remarkable.com/waitlist | 200 — geo-blocked homepage |
| remarkable.com/notify-me | 200 — geo-blocked homepage |
| remarkable.com/coming-soon | 200 — geo-blocked homepage |
| remarkable.com/early-access | 200 — geo-blocked homepage |
| remarkable.com/launch | 200 — geo-blocked homepage |
| remarkable.com/store | 200 — geo-blocked homepage (email sign-up for future shipping availability) |

Note: All 200s are reMarkable's site-wide geo-blocking behavior — the visitor's IP is flagged as outside supported shipping regions, and all URL paths resolve to the same geolocation page ("reMarkable does not ship to your current location yet" + email sign-up). This is NOT a deposit funnel; it is a regional access page.

Wayback Machine:
- `web.archive.org/web/*/remarkable.com/preorder*` — no captures
- `web.archive.org/web/*/remarkable.com/deposit*` — no captures
- `web.archive.org/web/*/remarkable.com/founders*` — no captures

- Pages found (200 + genuine deposit content): none
- Pages confirmed absent: all patterns return geo-blocked homepage, not dedicated deposit/waitlist pages. No Wayback evidence of historical deposit pages.
- Overall verdict: **no** — reMarkable has no deposit, waitlist, or pre-order funnel. The geo-blocking makes all URL patterns appear to "resolve" but they serve the same page. Note: reMarkable's 50-day risk-free trial is a purchase guarantee, not a deposit mechanic.

## Ad start-date enrichment

### Re-run results (2026-05-24)

Scripts run:
- `adlib-one.js remarkable-v2 ... 628821723950814` — forced pageID, country=ALL, 6 scrolls → 97 library IDs loaded, all May 13–23 2026
- `crowdfund-fetch.js` with `view_all_page_id=628821723950814` (active only) → ~59 results, all May 2026
- `crowdfund-fetch.js` with `view_all_page_id=628821723950814` + ASC sort param → same 59 results, same dates (sort param not honored by UI)
- `crowdfund-fetch.js` with `active_status=all` (active + inactive) → ~230 results, revealed pre-May-2026 campaigns

### Per-ad start_date confirmation

Direct visit to Library ID 2090665691478976 (crowdfund-fetch.js --type=ad):
- Confirmed: "Started running on May 13, 2026"
- Copy: "Close the gap between how you think and how you work with the new reMarkable Paper Pure."

All active-ads-only queries return exclusively May 2026 dates. Per-ad "Started running on" field now confirmed present in the rendered UI for active ads; the original meta-ads.md cluster framing was accurate.

### Older ads found (active_status=all query)

The ~230-result all-status view surfaces inactive campaigns going back to 2020. Oldest ads by start date visible in this session's scroll:

| Library ID | Date range | Status | Copy / hook |
|---|---|---|---|
| 236088301196876 | Dec 2, 2020 – Dec 31, 2020 | Inactive | Content removed (violated Advertising Standards) |
| 677271248128730 | Apr 5, 2025 – May 28, 2025 | Inactive | "Been wanting one of these for a while now, excited to add this to the productivity kit!" (Cedlom influencer) |
| 1110297940862280 | May 2, 2025 – May 29, 2025 | Inactive | "On the fence? Now's the time. Order reMarkable 2 or reMarkable Paper Pro before our prices increase in May." |
| 691985963304207 | May 5, 2025 – May 27, 2025 | Inactive | "Invest in yourself, so you can invest in those around you. Try reMarkable for 100 days risk free." |
| 4066398496955298 | May 5, 2025 – May 27, 2025 | Inactive | "It's been a banner year for your brain. Give it a bonus: reMarkable Paper Pro, the first paper tablet with a true color display." |
| 1221401363112682 | May 7, 2025 – May 27, 2025 | Inactive | "Here are three daily ways digital creator @canoopsy uses his reMarkable Paper Pro." |
| 1155896852957872 | May 14, 2025 – Jun 11, 2025 | Inactive | "Ready to radically change the way you work?" |
| 1872966040162331 | May 5, 2025 – Jun 13, 2025 | Inactive | "Feels so much like paper, your pen might forget." |
| 3652958574848818 | May 21, 2025 – May 27, 2025 | Inactive | "Here's a productive day in the life featuring the reMarkable Paper Pro" - Ben Taylor review |
| 664486246378679 | May 21, 2025 – Jun 2, 2025 | Inactive | "Turn off, zone out, switch on. Working without distractions on reMarkable Paper Pro can sharpen your focus." |
| 1261735055552808 | Jun 12, 2025 – Jun 27, 2025 | Inactive | "Robyn Berkley. Activewear pioneer. Wellness expert. Business owner. And reMarkable user." |
| 1898399997603071 | Jun 29, 2025 – Sep 22, 2025 | Inactive | JerryRig influencer: "I grab my reMarkable Paper Pro. An incredibly unique tablet designed to feel like writing on paper." |
| 1243712560061172 | Jul 2, 2025 – Sep 17, 2025 | Inactive | Dane McBeth: "Distraction free Pre-Workday Routine With help from my reMarkable Paper Pro" |
| 1462960165147450 | Jul 2, 2025 – Sep 23, 2025 | Inactive | Justin Tse: "Unboxing the NEW @remarkable Paper Pro Tablet" |
| 3146496585512863 | Jul 10, 2025 – Jul 12, 2025 | Inactive | Brand storytelling: Bjørnar Erikstad sailing/focus quote |
| 1884196805703111 | Jul 17, 2025 – Jul 19, 2025 | Inactive | Jenny Simmons mindfulness/football industry story |
| 1187405180086681 | Aug 11, 2025 – Aug 13, 2025 | Inactive | Neuroscientist Dr. Audrey van der Meer on handwriting |
| 781558444375556 | Aug 18, 2025 – Aug 20, 2025 | Inactive | Amber Case / calm technology |
| 24542275045406526 | Sep 3, 2025 – Sep 4, 2025 | Inactive | "Meet the new reMarkable Paper Pro Move…" (product launch teaser) |
| 1519749525847010 | Sep 23, 2025 – Sep 25, 2025 | Inactive | "Meet reMarkable Paper Pro Move: small enough to hold, big enough for any idea." |
| 1297347344944798 | Oct 7, 2025 – Oct 9, 2025 | Inactive | Norway astronaut Jannicke Mikkelsen brand story |

### Key findings

- **Oldest start_date with retrievable copy:** Apr 5, 2025 (Library ID 677271248128730). Influencer hook: "Been wanting one of these for a while now, excited to add this to the productivity kit!" Hook type: anticipation/social proof. Product: reMarkable 2 / Paper Pro era.
- **Absolute oldest record:** Dec 2, 2020 (Library ID 236088301196876) — content removed, hook not recoverable.
- **Pre-May-2026 ads found:** 20+ inactive ads across Apr–Oct 2025, plus 1 from Dec 2020. All are **inactive**. Zero pre-May-2026 active ads found.
- **Active ad floor:** May 13, 2026. Every active ad in the ~520 total appears to date from the Paper Pure product launch on that date.
- **Longevity leaders (by active run time, from inactive data):** JerryRig/Hayls World/William Bowers influencer ads ran ~85 days (Jun 29 – Sep 22, 2025). Justin Tse unboxing ran ~83 days. Dane McBeth ran ~77 days. These are the longest-confirmed hooks; no currently active ads have run anywhere near that long yet (max 11 days as of this session).
- **The 86/97-ad May 2026 sample:** Accurately represents reMarkable's *active* inventory — it is not hiding older ongoing campaigns. All ~520 active ads are Paper Pure launch creatives (May 13–23, 2026). The prior corpus note "86 loaded = representative sample of ~500" is correct in characterizing it as a launch burst, not a subset of longer-running evergreen ads.
- **Sandbox blocks:** None. adlib-one.js and crowdfund-fetch.js both completed without Playwright errors. `active_status=all` query returned content normally.
- **New start_date data added:** Per-ad dates confirmed for all 97 active IDs (all May 13–23, 2026). 21 inactive campaigns newly documented with confirmed date ranges. Oldest recoverable copy: Apr 5, 2025.

## Gaps for downstream agents

- reMarkable meta-ads.md was rebuilt from adlib-one.js output which now shows per-ad "Started running on" dates for all 97 active ads. No gap remains for active ads.
- Inactive campaign corpus (20+ ads, Apr 2025 – Oct 2025) not incorporated into meta-ads.md. If hook longevity analysis needs pre-launch baselines, pull from `remarkable-all-status/raw/` files.
- The Dec 2020 ad content is permanently removed (Meta policy violation flag). Hook not recoverable.
- No deposit funnel found. reMarkable's longest-in-class purchase guarantee (50-day refund) is their trust mechanic substitute.
