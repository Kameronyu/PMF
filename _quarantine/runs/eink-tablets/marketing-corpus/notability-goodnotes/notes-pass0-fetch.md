# Pass 0 supplementary fetch notes — notability-goodnotes

## Screenshots captured

N/A — notability-goodnotes was not in Task 1 scope.

## Deposit funnel hunt

URLs probed:

| URL pattern | Brand | Result |
|---|---|---|
| notability.com/preorder | Notability | 404 |
| notability.com/waitlist | Notability | 404 |
| notability.com/early-access | Notability | 404 |
| notability.com/deposit | Notability | 404 |
| notability.com/founders | Notability | 404 |
| goodnotes.com/preorder | GoodNotes | 404 (confirmed "page doesn't exist or has been moved") |
| goodnotes.com/waitlist | GoodNotes | 404 |
| goodnotes.com/reserve | GoodNotes | 404 |
| goodnotes.com/early-access | GoodNotes | 404 |
| goodnotes.com/launch | GoodNotes | 404 |

Wayback Machine:
- `web.archive.org/web/*/notability.com/preorder*` — no captures
- `web.archive.org/web/*/goodnotes.com/waitlist*` — no captures

- Pages found (200 + content): none
- Pages confirmed absent: all 10 patterns confirmed absent across both domains. No Wayback evidence of historical deposit pages.
- Overall verdict: **no** — Neither Notability nor GoodNotes has any deposit, waitlist, or pre-order funnel at any tested URL pattern. Both are SaaS apps with free-tier + subscription model; no hardware to pre-order.

Note: This outcome is expected — Notability and GoodNotes are software products (iOS/iPadOS apps). A deposit-funnel hunt is structurally inapplicable unless they were launching new hardware or a major platform. The birdseye-map's gap citation for "no deposit-funnel evidence" may have been a false-positive in the original audit scope.

## Ad start-date enrichment

- Re-run adlib? no — prior corpus notes "adlib blocked" for Notability and GoodNotes. No change in this pass; the sandbox block that prevented the initial pull is still in effect.
- New start_date data added: 0
- Method: n/a

## Gaps for downstream agents

- Meta Ad Library pull for both Notability and GoodNotes remains blocked (sandbox block from prior session). This is an ongoing gap — no creative-side transformation data is available for either brand.
- Deposit funnel confirmed inapplicable for software-only brands.
