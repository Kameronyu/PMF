# notes.md — Freewrite Traveler (IGG 2018)

slug: freewrite-traveler
captured: 2026-05-24

---

## Fetch Attempts and Block Status

| Resource | Method | Result |
|---|---|---|
| https://www.indiegogo.com/projects/freewrite-traveler (main campaign) | WebFetch | BLOCKED — returned only "Indiegogo" text; React SPA + Cloudflare |
| crowdfund-fetch.js --type=campaign | Bash / Playwright | BASH PERMISSION DENIED — could not run Playwright script |
| crowdfund-fetch.js --type=updates | Bash / Playwright | BASH PERMISSION DENIED |
| crowdfund-fetch.js --type=comments | Bash / Playwright | BASH PERMISSION DENIED |
| https://web.archive.org/web/20181201000000*/... | WebFetch | BLOCKED — archive.org not accessible via WebFetch |
| https://www.indiegogo.com/en/projects/adamleeb/traveler-ultimate-distraction-free-writing-tool | Not attempted directly | This is the creator profile URL; likely same block |
| miltonhooper.com (Freewrite Traveler fact or fiction) | WebFetch | ECONNREFUSED |
| karlrivers.com/freewrite-traveler-update/ | WebFetch | HTTP 404 |
| boingboing.net (Oct 2 2018) | WebFetch | HTTP 403 |

### PLAYWRIGHT BLOCKED

The orchestrator's sandbox denied `bash` execution for the Playwright helper script
(`node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js`). No `.txt`/`.html`/`.png`
raw artifacts were written to `raw/`. This is the primary gap in this corpus — no verbatim
IGG campaign body, tier list, risks/challenges, FAQ, or IGG update posts.

---

## Data Gaps

1. **IGG campaign body verbatim** — hero headline partially recovered from search snippets;
   subhead recovered; full story, risks & challenges, FAQ: NOT RECOVERABLE without Playwright.

2. **Backer count** — no source published the total IGG backer count. Implied estimate of
   ~1,800 in chronology.md is arithmetic inference only, NOT a confirmed figure.

3. **Tier names (verbatim)** — IGG tier labels are not recoverable. Press articles describe
   pricing but not the exact tier name text as it appeared on the campaign page.

4. **Update post titles and bodies** — IGG update posts are paywalled / blocked. Only one
   Freewrite-hosted update (June 2020) was partially extractable.

5. **Comments verbatim** — IGG comments page blocked. No direct backer comment quotes recovered.

6. **Refund/cancellation volume** — no quantified data available.

7. **Campaign end date** — approximated as ~Nov 2018; exact close date not confirmed.

8. **January 2019 "first units shipped" discrepancy** — Wikipedia claims Jan 2019 first shipment;
   all backer review evidence points to Oct 2020 mass fulfillment. Reconciliation in outcome.md.
   Could not resolve definitively without IGG update archive.

9. **Agency name** — Adam Leeb confirms use of "premiere IGG agency" but does not name them.
   Could be identified by searching agency case studies (Jellop, Krowdster, etc.) for Astrohaus
   mentions — not attempted in this session.

---

## Wayback Machine Note

archive.org is not accessible via WebFetch in this environment. If the Playwright script is
run manually, the recommended snapshot URL is:
  https://web.archive.org/web/20181015000000*/https://www.indiegogo.com/projects/freewrite-traveler
(Oct 2018 snapshots most likely to have campaign body copy intact)

---

## Brief Spec Compliance Notes

- Brief says campaign "Shipped Jan 2019" — this appears to be incorrect based on available
  evidence. Actual mass fulfillment was Oct–Nov 2020. Noted and documented in outcome.md.
- Backer count "not found" in campaign-roster.md remains not found.
- No evolution record existed for this campaign per brief — confirmed correct.

---

## Sources Used (all successfully fetched)

- blog.eink.com/astrohaus-launching-new-distraction-free-writing-tool-featuring-e-ink (Oct 11 2018)
- techcrunch.com/2018/10/02/the-freewrite-traveler-offers-distraction-free-writing-for-the-road/ (Oct 2 2018)
- thenextweb.com/news/the-freewrite-traveller-is-the-distraction-free-portable-typewriter-ive-been-waiting-for (Oct 2 2018)
- liliputing.com/traveler-e-ink-distraction-free-laptop-goes-up-for-pre-order-for-269/ (Oct 2 2018)
- digitaltrends.com/cool-tech/freewrite-traveler-portable-writing-device/ (Oct 3 2018)
- ubergizmo.com/2018/10/freewrite-traveler-distraction-free-writing/ (Oct 3 2018)
- newatlas.com/freewrite-traveler-laptop/56803/ (Oct 16 2018)
- adamleeb.com/kickstarter-vs-indiegogo-a-creators-perspective/ (retrieved 2026-05-24)
- adamleeb.com/portfolio/freewrite-traveler/ (retrieved 2026-05-24)
- adamleeb.com/category/astrohaus/ (retrieved 2026-05-24)
- astrohaus.com/traveler/ (retrieved 2026-05-24)
- getfreewrite.com/products/freewrite-traveler (retrieved 2026-05-24)
- getfreewrite.com/pages/freewrite-traveler-updates (partially accessible, June 2020 update only)
- techcrunch.com/2020/10/27/ (Oct 27 2020)
- engadget.com/astrohaus-freewrite-traveler-eink-typewriter-review-130000032.html (Oct 27 2020)
- geekdad.com/2020/10/freewrite-traveler-hands-on-at-last/ (Oct 28 2020)
- tarinadeaton.com/freewrite-traveler-review/ (Oct 28 2020)
- closeuponawriter.com/2019/12/02/so-i-did-a-thing-that-didnt-work-out/ (Dec 2 2019)
- en.wikipedia.org/wiki/Astrohaus (retrieved 2026-05-24)
- hackaday.com/2018/10/20/e-ink-typewriter-is-refreshingly-slow/ (Oct 20 2018, confirmed NOT a Traveler article)
- goodereader.com/blog/product/freewrite-traveller-e-ink-typewriter (retrieved 2026-05-24)
