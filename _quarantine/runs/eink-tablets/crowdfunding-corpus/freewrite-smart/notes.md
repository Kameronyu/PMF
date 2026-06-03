# notes.md — Hemingwrite / freewrite-smart
# Captured: 2026-05-24

---

## FETCH ATTEMPT LOG

| Target | Method | Result |
|--------|--------|--------|
| KS campaign main page | WebFetch | HTTP 403 |
| KS campaign main page | crowdfund-fetch.js | NODE PERMISSION DENIED (sandbox) |
| KS comments page | WebFetch (inferred) | HTTP 403 |
| KS updates page | WebFetch (inferred) | HTTP 403 |
| KS FAQ page | WebFetch | HTTP 403 |
| KS Update 28 post | WebFetch | HTTP 403 |
| KS Update 30 post | WebFetch | HTTP 403 |
| KS Update 32 post | WebFetch | HTTP 403 |
| web.archive.org | WebFetch | BLOCKED (Claude Code restriction) |
| backerkit.com | WebFetch | HTTP 403 |
| technology.org | WebFetch | HTTP 403 |
| kboards.com thread | WebFetch | TollBit paywall redirect |
| huffingtonpost.com | WebFetch | 301 redirect → huffpost.com (fetched via redirect) |
| huffingtonpost.co.uk | WebFetch | Partial extraction |
| Kicktraq | WebFetch | Partial — chart data in images, not readable tables |
| TechCrunch Dec 10 2014 | WebFetch | Partial extraction (no raw campaign copy) |
| TechCrunch Jan 8 2015 | WebFetch | Partial extraction |
| TechCrunch Feb 23 2016 | WebFetch | Partial extraction |
| Engadget Dec 10 2014 | WebFetch | Partial extraction |
| Engadget Nov 8 2014 | WebFetch | Partial extraction |
| Publishing Perspectives Feb 2016 | WebFetch | Good extraction — Adam Leeb quotes |
| Core77 Design Awards 2015 | WebFetch | Good extraction — product copy |
| getfreewrite.com "Turns 10" | WebFetch | Good extraction — founder quotes |
| adamleeb.com Part 1 | WebFetch | Good extraction — origin story |
| adamleeb.com Part 4 | WebFetch | Good extraction — pre-launch strategy |
| adamleeb.com Part 5 | WebFetch | Good extraction — launch details |
| astrohaus.com/about-us | WebFetch | Good extraction |
| Wikipedia Astrohaus | WebFetch | Good extraction |
| fordsbasement.com | WebFetch | Good extraction — delay timeline |
| GeekDad Feb 2016 | WebFetch | Good extraction |
| CrowdfundInsider Dec 2014 | WebFetch | Partial extraction |
| Armchair Arcade Dec 2014 | WebFetch | Partial extraction |
| HuffPost Dec 10 2014 | WebFetch | Partial extraction |

---

## GAPS

1. **Campaign body verbatim (hero copy, story, risks, FAQ):** NOT RECOVERED.
   KS page 403. No third-party source reproduced the full campaign page text verbatim.
   Campaign body.md is reconstructed from press and creator blog — approximates
   the framing but is NOT the original page text.

2. **Reward tier verbatim descriptions:** NOT RECOVERED.
   Prices confirmed ($349/$369/$399) but tier names and exact descriptions from KS page unknown.
   Add-on tier (backspace remover kit) price not confirmed.

3. **Backer counts per tier:** NOT RECOVERABLE.
   Only total 1,096 backers known.

4. **Full updates list with dates and body text:** PARTIAL.
   Only updates 28, 30, 32 titles confirmed. In-campaign update titles (est. 6 posts)
   not recoverable. All update bodies 403.

5. **KS comments verbatim:** NOT RECOVERABLE.
   All comment themes are reconstructed from press/forum proxy.

6. **Wayback Machine archive:** NOT FETCHABLE.
   web.archive.org blocked in Claude Code environment. Could not confirm hemingwrite.com
   pre-launch page or archived KS campaign snapshots.

7. **CNET article:** Not found. Listed as embargo recipient in adamleeb.com Part 5 but
   no article confirmed indexed in search.

8. **The Verge article:** No article found in search.

9. **Day-by-day pledge data:** Kicktraq chart rendered as image; data not readable.

10. **Refund request volume:** No data.

11. **kboards forum thread:** Behind TollBit paywall.

12. **BackerKit content:** 403.

---

## PAGE ID NOTES

Two KS URL variants found for same campaign:
- https://www.kickstarter.com/projects/astrohaus/hemingwrite-a-distraction-free-digital-typewriter
- https://www.kickstarter.com/projects/adamleeb/hemingwrite-a-distraction-free-digital-typewriter
Both appear to resolve to same project. Creator account "astrohaus" is primary; "adamleeb"
is co-creator handle. Updates 30 found under "adamleeb" variant.

---

## ADLIBRARY STATUS

All 7 freewrite adlibrary query variants returned zero active ads:
freewrite-smart, freewrite-smart-typewriter, freewrite, freewrite-final (getfreewrite),
freewrite-alpha, freewrite-tightq, freewrite_adv (Astrohaus).
getfreewrite FB page exists (911139335596993, 16.2K followers — Electronics category,
64.2K followers on second typeahead) but zero active Meta ads running.

Files: /home/kyu3/PMF/runs/eink-tablets/adlibrary/freewrite-*.txt
