# Pass 0 supplementary fetch notes — daylight-dc1

## Screenshots captured

3 URLs captured via crowdfund-fetch.js (Playwright). Initial attempts without `https://` prefix failed (3 .err.txt files in raw/); corrected by prepending https://.

- `https://daylightcomputer.com` → `screenshots/lp-2026-05-24T21-56-38.{html,txt,png}` — title: "Daylight | A More Caring Computer" — 257KB HTML / 4051 chars text
- `https://daylightcomputer.com/product` → `screenshots/lp-2026-05-24T22-00-00.{html,txt,png}` — title: "Daylight | The Fast 60fps E-paper and Blue-Light Free Tablet" — 193KB HTML / 2905 chars text
- `https://daylightcomputer.com/blog/screen-flicker-101` → `screenshots/lp-2026-05-24T22-02-08.{html,txt,png}` — title: "Daylight | Light Flicker — Why your screen turning on & off 500 times a second..." — 166KB HTML / 17691 chars text (richest body in the set)

## Deposit funnel hunt

- URLs probed (all via WebFetch):
  - daylightcomputer.com/preorder — 404
  - daylightcomputer.com/pre-order — 404
  - daylightcomputer.com/deposit — 404
  - daylightcomputer.com/reserve — 404
  - daylightcomputer.com/founders — 404
  - daylightcomputer.com/founder-edition — 404
  - daylightcomputer.com/waitlist — 404
  - daylightcomputer.com/notify-me — 404
  - daylightcomputer.com/coming-soon — 404
  - daylightcomputer.com/early-access — 404
  - daylightcomputer.com/launch — 404
  - daylightcomputer.com/launchlist — 404
  - daylightcomputer.com/kickstarter — 404
  - daylightcomputer.com/indiegogo — 404
- Pages found (200 + content): none
- Pages confirmed absent: all patterns above returned 404 across WebFetch
- Wayback findings: not probed (daylight-dc1 not in Task 2 scope)
- Overall verdict: N/A — daylight-dc1 was not in Task 2 scope (deposit-funnel hunt covers supernote, remarkable, boox, ipad, notability-goodnotes). No deposit funnel probed for this brand.

## Ad start-date enrichment

- Re-run adlib? no — daylight-dc1 is dark (0 active Meta ads confirmed in prior corpus)
- New start_date data added: 0
- Method: n/a — no ads to enrich

## Gaps for downstream agents

- The 3 failed fetch attempts (lp-2026-05-24T21-55-*.err.txt) are in raw/ — can be deleted; they were caused by missing https:// prefix, not a site block
- The screen-flicker-101 blog page rendered the richest text body (17KB) — includes the Eye Strain Pilot Study email referral and clinical framing. Worth prioritizing in per-brand analysis.
- Homepage title on capture was "A More Caring Computer" but at-pull was rendering Calm Tech Institute certification notice, suggesting Mudita-style Cloudflare or dynamic redirect — downstream agent should verify canonical homepage hero copy
