# Pass 0 — Supplementary Fetch Brief

ONE JOB: close the 3 data gaps the corpus audit found, BEFORE the per-brand
deep-analysis agents fire. No analysis. Only fetch + dump.

## Read first

- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/birdseye-map.md` — for
  brand list + existing gap context (synthesis-side, do NOT read prior to
  per-brand work)
- Existing per-brand corpora at
  `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/<brand>/` — to see
  what's already captured before fetching

## Tooling

- `node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js <slug> <url> [--type=<type>]`
  — Playwright-based fetcher. Bypasses Cloudflare + JS-rendered SPAs.
  Outputs HTML + visible text + full-page screenshot to
  `<slug>/raw/<type>-<timestamp>.{html,txt,png}`.
  **CRITICAL** — by default writes to `crowdfunding-corpus/<slug>/raw/`.
  For this work pass `--out=runs/eink-tablets/marketing-corpus` so the
  output lands in the brand corpus dir, not the crowdfunding-corpus dir.
- `node /home/kyu3/PMF/runs/eink-tablets/scripts/adlib-one.js <slug> <query>`
  — Meta Ad Library fetcher. Writes `adlibrary/<slug>_adv.txt`.

If bash is sandbox-blocked: report it and request the orchestrator run the
script for you. Do NOT skip the fetch.

## Task 1 — Screenshots for 4 zero-screenshot brands

These brands have ZERO screenshots in their existing corpus. Capture top
3 LPs each (homepage + top product page + top funnel/segmentation page):

| Brand | Slug | URLs to screenshot |
|---|---|---|
| Daylight DC-1 | `daylight-dc1` | `daylightcomputer.com`, `daylightcomputer.com/product`, `daylightcomputer.com/blog/screen-flicker-101` |
| Light Phone | `light-phone` | `thelightphone.com`, `thelightphone.com/lightiii`, `thelightphone.com/about` |
| Mudita Kompakt | `mudita-kompakt` | `mudita.com`, `mudita.com/products/mudita-kompakt`, `mudita.com/stress-less` |
| iPad (Apple) | `ipad` | `apple.com/ipad`, `apple.com/education/college-students`, `apple.com/ipad-pro` |

Run for each URL:
```
node runs/eink-tablets/scripts/crowdfund-fetch.js <slug> <url> --type=lp --out=runs/eink-tablets/marketing-corpus
```

Then move the screenshot artifacts from `<slug>/raw/` to
`<slug>/screenshots/` so they're separate from any crowdfunding raw artifacts:
```
mkdir -p runs/eink-tablets/marketing-corpus/<slug>/screenshots/
mv runs/eink-tablets/marketing-corpus/<slug>/raw/lp-*.png runs/eink-tablets/marketing-corpus/<slug>/screenshots/
mv runs/eink-tablets/marketing-corpus/<slug>/raw/lp-*.html runs/eink-tablets/marketing-corpus/<slug>/screenshots/
mv runs/eink-tablets/marketing-corpus/<slug>/raw/lp-*.txt runs/eink-tablets/marketing-corpus/<slug>/screenshots/
```

## Task 2 — Deposit-funnel hunt for 5 brands

These brands had no deposit-funnel evidence in initial corpus. Probe the
following URL patterns on each brand site + sweep Wayback Machine for any
past pre-launch / waitlist / reservation pages:

URL patterns to probe per brand:
- `/preorder`, `/pre-order`
- `/deposit`, `/reserve`
- `/founders`, `/founder-edition`
- `/waitlist`, `/notify-me`
- `/coming-soon`
- `/early-access`
- `/launch`, `/launchlist`
- `/kickstarter`, `/indiegogo`

For each brand:
1. Try each URL pattern with WebFetch first. If 200 + content, capture.
2. If 404 / 403 / blocked, try via `crowdfund-fetch.js` (Playwright).
3. Wayback Machine search: `web.archive.org/web/*/{brand-site}/preorder*` —
   if past deposit pages exist, capture them.

Brands:
- Supernote (`supernote.com`)
- reMarkable (`remarkable.com`)
- Boox (`shop.boox.com`, `boox.com`)
- iPad (Apple — `apple.com/ipad` reservation flows, also Vision Pro / new product reservation pages historically)
- Notability + GoodNotes (`notability.com`, `goodnotes.com`)

## Task 3 — Ad start-date enrichment

For brands with ACTIVE Meta ads where `meta-ads.md` lacks per-ad
`ad_delivery_start_time` / "Started running on" dates:

- Supernote — confirm start_date present (audit said yes, verify)
- Kindle Scribe — same
- reMarkable — same
- Daylight Kids — same
- Boox — same

If any of those have missing start_date per ad, re-run `adlib-one.js` with
verified page-ID and extract dates. For ads where `ad_delivery_start_time`
isn't directly captured by the script, visit the ad's library URL
(`https://www.facebook.com/ads/library/?id=<library_id>`) via
`crowdfund-fetch.js` and extract the visible "Started running on <date>"
text from the rendered page.

iPad: re-run `adlib-one.js` with a tighter query (`"iPad"` instead of
brand-wide `"Apple"`) to surface iPad-specific creative (the prior 71-ad
sample was all iPhone 17 launch — gap noted in audit).

## Output per brand

Write `runs/eink-tablets/marketing-corpus/<brand>/notes-pass0-fetch.md`:

```
# Pass 0 supplementary fetch notes — <brand>

## Screenshots captured
- <list URLs + local screenshot paths> or "N/A — already had screenshots"

## Deposit funnel hunt
- URLs probed: <list>
- Pages found (200 + content): <list with local paths if captured via Playwright>
- Pages confirmed absent (404 across all variants): "Confirmed no deposit funnel page exists at <patterns tried>"
- Wayback findings: <verbatim URL + snapshot date if found>
- Overall verdict: yes / no / unknown

## Ad start-date enrichment
- Re-run adlib? yes / no — why
- New start_date data added: <number of ads enriched>
- Method: script-direct / individual library-id visits via Playwright

## Gaps for downstream agents
- <any URLs that 403'd, brands where deposit hunt was inconclusive, etc.>
```

## Return a SHORT summary (<200 words)

- Task 1: how many screenshots captured across 4 brands
- Task 2: deposit-funnel verdicts per brand (yes/no/unknown + evidence)
- Task 3: ad start_date enrichment status per brand
- Any sandbox blocks the orchestrator needs to backfill
- File paths written

Then the orchestrator will checkpoint with Kam before Pass 1 fires.
