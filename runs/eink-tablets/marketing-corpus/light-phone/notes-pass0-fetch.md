# Pass 0 supplementary fetch notes — light-phone

## Screenshots captured

3 URLs captured via crowdfund-fetch.js (Playwright). Note: thelightphone.com is a JS SPA — prior corpus noted WebFetch returned blank bodies. Playwright succeeded.

- `https://thelightphone.com` → `screenshots/lp-2026-05-24T22-00-50.{html,txt,png}` — title: "Light Phone III | The Light Phone" — 208KB HTML / 11683 chars text
- `https://thelightphone.com/lightiii` → `screenshots/lp-2026-05-24T22-03-45.{html,txt,png}` — title: "Light Phone III | The Light Phone" — 210KB HTML / 11683 chars text (same title/char count as homepage — likely same SPA shell rendering the same view; downstream agent should diff the .txt bodies)
- `https://thelightphone.com/about-us` → `screenshots/lp-2026-05-24T22-15-16.{html,txt,png}` — title: "About us | The Light Phone" — 172KB HTML / 3211 chars text
  - Note: the brief specified `/about` but that URL returned a 404 ("404 | The Light Phone" — captured as raw/lp-2026-05-24T22-05-30.{html,txt,png}). Playwright then successfully fetched `/about-us` which resolved correctly.

## Deposit funnel hunt

- light-phone was not in Task 2 scope (deposit-funnel hunt covers supernote, remarkable, boox, ipad, notability-goodnotes)
- No deposit funnel probed for this brand
- Overall verdict: N/A

## Ad start-date enrichment

- Re-run adlib? no — light-phone runs 0 active Meta ads (confirmed in prior corpus, correct pageID verified)
- New start_date data added: 0
- Method: n/a

## Gaps for downstream agents

- Homepage and /lightiii appear to return identical text bodies (same SPA shell) — downstream agent should diff the HTML to extract any page-specific content
- The failed /about capture (22-05-30) is in raw/ — can be ignored; /about-us was the correct path
- /lightiii page is the Light Phone III product-specific page; compare with homepage to surface any III-specific messaging not on main hero
