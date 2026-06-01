# Pass 0 supplementary fetch notes — ipad

## Screenshots captured

3 URLs captured via crowdfund-fetch.js (Playwright).

- `https://apple.com/ipad` → `screenshots/lp-2026-05-24T22-06-58.{html,txt,png}` — title: "iPad - Apple" — 933KB HTML / 12445 chars text
- `https://apple.com/education/college-students` → `screenshots/lp-2026-05-24T22-08-51.{html,txt,png}` — title: "Education - College Students - Apple" — 469KB HTML / 22669 chars text (richest in the set)
- `https://apple.com/ipad-pro` → `screenshots/lp-2026-05-24T22-09-15.{html,txt,png}` — title: "iPad Pro - Apple" — 793KB HTML / 21761 chars text

## Deposit funnel hunt

- URLs probed (all via WebFetch):
  - apple.com/ipad/preorder — 404
  - apple.com/ipad/reserve — redirected to Apple's Find a Store page (not reservation flow)
  - apple.com/shop/ipad/reserve — 404
  - apple.com/ipad/deposit — 404
- Wayback searches:
  - `web.archive.org/web/*/apple.com/ipad/preorder*` — no captures
  - `web.archive.org/web/*/apple.com/*/ipad*/reserve*` — no captures
- Note: Apple historically runs product launch reservations (e.g. Apple Watch, iPhone) via apple.com/shop/product/{sku}/reserve — these are SKU-specific, not at a persistent /ipad/reserve slug. No standing pre-order/deposit page exists for iPad.
- Pages found (200 + content): none deposit-specific
- Pages confirmed absent: all patterns tried returned 404 or redirected to non-deposit pages
- Overall verdict: **no** — iPad has no deposit/waitlist/pre-order funnel at any of the tested URL patterns. Apple uses launch-day reservation flows tied to specific SKUs, not standing funnel pages.

## Ad start-date enrichment

- Re-run adlib? yes — ran with query "iPad" per brief
- Result: adlib-one.js typeahead resolved "iPad" to unrelated pages (Filipino public figures named "Padilla", "Padre" — not Apple). Apple's iPad ads run under the main Apple page (pageID 434174436675167). The "iPad" query does not surface Apple's page through the typeahead system.
- adlib artifact written: `runs/eink-tablets/adlibrary/ipad_adv.txt` — resolved_advertiser: NONE, 0 ads loaded
- Also tried query "Apple iPad" → resolved to "Apple i pad" (pageID 102121308259217, 20 followers, 0 ads) — not Apple's official page
- Conclusion: iPad-specific Meta ad creative is not extractable via adlib-one.js's typeahead unless Apple runs a dedicated iPad sub-page. The prior 71-ad Apple sample (all iPhone 17 at pull time) remains the only available creative view. No start_date enrichment possible via this method.
- Method: script-direct attempts failed (wrong page resolution); no individual library-id visits attempted (no valid iPad IDs to visit)

## Gaps for downstream agents

- iPad Meta ad creative gap remains unresolved. Needs manual approach: visit Meta Ad Library UI filtered to Apple page (pageID 434174436675167) with q=ipad search term, or wait for a non-iPhone-launch-heavy pull window.
- Apple deposit-funnel confirmed absent at standard URL patterns. If a new iPad model launches, check apple.com/shop/product/{sku}/reserve during launch window (SKU-specific, not persistent).
