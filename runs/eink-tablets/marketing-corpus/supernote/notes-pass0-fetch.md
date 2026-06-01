# Pass 0 supplementary fetch notes — supernote

## Screenshots captured

N/A — supernote was not in Task 1 scope (Task 1 covers 4 zero-screenshot brands: daylight-dc1, light-phone, mudita-kompakt, ipad).

## Deposit funnel hunt

URLs probed:

| URL pattern | Result |
|---|---|
| supernote.com/preorder | 404 |
| supernote.com/pre-order | 404 |
| supernote.com/deposit | 404 |
| supernote.com/reserve | 404 |
| supernote.com/founders | 404 |
| supernote.com/founder-edition | 404 |
| supernote.com/waitlist | 404 |
| supernote.com/notify-me | 404 |
| supernote.com/coming-soon | 404 |
| supernote.com/pages/coming-soon | 404 |
| supernote.com/early-access | 404 |
| supernote.com/launch | 404 |
| supernote.com/launchlist | 404 |
| supernote.com/kickstarter | 404 |
| supernote.com/indiegogo | 404 |

Wayback Machine:
- `web.archive.org/web/*/supernote.com/preorder*` — no captures (Wayback returned "No URL has been captured for this URL prefix")
- `web.archive.org/web/*/ratta.cn/deposit*` — no captures

- Pages found (200 + content): none
- Pages confirmed absent: all 15 patterns confirmed absent via WebFetch; 2 Wayback searches confirm no historical deposit pages
- Overall verdict: **no** — Supernote has no deposit, waitlist, or pre-order funnel at any tested URL pattern and no historical Wayback evidence of one

## Ad start-date enrichment

- Re-run adlib? no — prior corpus has per-ad `started_running_on` dates for all 11 active ads (verified: Feb 1 2026, May 28 2025, Oct 19 2025, etc.)
- New start_date data added: 0 (all already present)
- Method: verified by reading marketing-corpus/supernote/meta-ads.md

## Gaps for downstream agents

- No deposit funnel evidence found. Supernote appears to sell exclusively at full price with no pre-order mechanic. The Manta PDP "Notify Me" for waitlist variants (if any) was not probed — downstream agent may want to check supernote.com/products/manta for out-of-stock "notify me" buttons (in-stock form, not a deposit page).
