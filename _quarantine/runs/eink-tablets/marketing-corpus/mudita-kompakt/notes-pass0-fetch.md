# Pass 0 supplementary fetch notes — mudita-kompakt

## Screenshots captured

3 URLs captured via crowdfund-fetch.js (Playwright). Site is Cloudflare-protected; Playwright bypassed.

- `https://mudita.com` → `screenshots/lp-2026-05-24T22-05-38.{html,txt,png}` — title: "Mudita Products Achieve Calm Tech Institute Certification | Mudita" — 401KB HTML / 7483 chars text
  - Note: mudita.com homepage at capture time was showing a Calm Tech Institute certification page, not the standard product homepage. This may be a temporary promotional redirect. Hero copy from prior corpus ("designed to help users reclaim their focus") came from PDP/PR; downstream agent should check whether homepage reverts to standard copy.
- `https://mudita.com/products/mudita-kompakt` → raw/lp-2026-05-24T22-05-57.{html,txt,png} — returned 404 (title: "404: Not found | Mudita") — NOT moved to screenshots/. The brief-specified URL slug was wrong.
  - Correct URL resolved as: `https://mudita.com/products/phones/mudita-kompakt`
- `https://mudita.com/products/phones/mudita-kompakt` → `screenshots/lp-2026-05-24T22-09-25.{html,txt,png}` — title: "Mudita Kompakt, a minimalist E Ink® phone. | Mudita" — 559KB HTML / 6278 chars text
- `https://mudita.com/stress-less` → `screenshots/lp-2026-05-24T22-07-36.{html,txt,png}` — title: "Beyond the Screen | Up to 15% OFF | Mudita | Mudita" — 352KB HTML / 5543 chars text

Net valid screenshots: 3 (homepage as Calm Tech redirect, product page, stress-less).

## Deposit funnel hunt

- mudita-kompakt was not in Task 2 scope (deposit-funnel hunt covers supernote, remarkable, boox, ipad, notability-goodnotes)
- No deposit funnel probed for this brand
- Overall verdict: N/A

## Ad start-date enrichment

- Re-run adlib? no — Mudita Meta page unresolved in prior corpus (adlib returned NONE); no change in this pass
- New start_date data added: 0
- Method: n/a

## Gaps for downstream agents

- Correct product page URL is `/products/phones/mudita-kompakt` not `/products/mudita-kompakt` — update any future fetch briefs
- Homepage was redirected to Calm Tech Institute certification page at capture time — may not reflect standard hero copy. Consider re-fetch after promotional period ends.
- The 404 artifact for /products/mudita-kompakt is at raw/lp-2026-05-24T22-05-57.* — can be ignored
