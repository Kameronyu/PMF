# Pass 0 supplementary fetch notes — boox

## Screenshots captured

N/A — boox was not in Task 1 scope.

## Deposit funnel hunt

URLs probed:

| URL pattern | Domain | Result |
|---|---|---|
| shop.boox.com/preorder | shop.boox.com | 404 |
| shop.boox.com/reserve | shop.boox.com | 404 |
| shop.boox.com/deposit | shop.boox.com | 404 |
| shop.boox.com/founders | shop.boox.com | 404 |
| shop.boox.com/waitlist | shop.boox.com | 404 |
| boox.com/preorder | boox.com | 404 |
| boox.com/reserve | boox.com | 404 |

Wayback Machine:
- `web.archive.org/web/*/shop.boox.com/preorder*` — no captures
- `web.archive.org/web/*/boox.com/preorder*` — no captures

- Pages found (200 + content): none
- Pages confirmed absent: all 7 patterns confirmed absent across both domains (shop.boox.com and boox.com). No Wayback evidence of historical deposit pages.
- Overall verdict: **no** — Boox has no deposit, waitlist, or pre-order funnel at any tested URL pattern. Boox sells at full price via standard storefront.

## Ad start-date enrichment

- Re-run adlib? no — prior corpus has per-ad `start_date` fields for all catalogued Boox ads (verified: Mar 2 / Mar 19 / Apr 11 / Apr 13 / Apr 14, 2026 across Ad 1 cluster, etc.)
- New start_date data added: 0 (all already present)
- Method: verified by reading marketing-corpus/boox/meta-ads.md

## Gaps for downstream agents

- Boox bulk-buy (business.boox.com) was not probed for a "request a quote / reserve bulk order" flow — downstream agent may want to check if business.boox.com has a form-based reservation. Not a consumer deposit funnel but structurally adjacent.
