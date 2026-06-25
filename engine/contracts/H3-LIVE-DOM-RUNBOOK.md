# H3 — Live-DOM capture runbook

**Created:** 2026-06-25 (Phase 21). **Updated:** 2026-06-25 with empirical live-attempt results.

## EMPIRICAL OUTCOME (attempted headless before defaulting to a human gate)
- **H3b Meta Ad Library — SOLVED HEADLESS, no gate.** Reachable from WSL headless. Captured a real
  `/api/graphql/` response (9 ad-bearing bodies, `ad_archive_id`+`snapshot.link_url`); committed
  `runs/_fixture/adlib/flipper-zero-xhr.json`; implemented + verified the fix (`lib/adlib-graphql.js`
  + `adlib-one.js`, commit `f44fe39`). The runbook's manual-capture steps below are the FALLBACK if
  the headless capture ever regresses. **Remaining Meta gap (separate from #adlib-selectors):** the
  typeahead advertiser-resolution (`pickAdvertiser` via `li[role=option]`) returns no candidates
  headless → a full run resolves NONE. Use a `forcedPageId`, the keyword-search URL, or the
  CDP real-Chrome path for end-to-end live runs.
- **H3a Google Trends — OPERATOR-GATED (CDP real-Chrome).** Both the explore page AND the direct
  `/trends/api/explore` JSON endpoint return **HTTP 429** immediately from WSL headless + curl — an
  IP-level block on the egress range, not a consent/format issue (cookies/headers don't clear it).
  The genuine path is the operator's established real Chrome via the CDP bridge (the RPA last
  resort), or a cooldown+retry from a non-flagged IP. Capture runbook below.

**Why a gate at all (Trends):** WSL-headless is IP-429-blocked; the CDP-bridge-to-real-Chrome tooling
exists for exactly this (`engine/integrations/cdp/`, recipe `runs/arduview/_tooling/README-ops.md §A`).
The operator runs the capture once, commits the fixture, then a follow-up calibrates the parser
OFFLINE and flips `web-site-fetch` (Trends) health green.

Both fixes are the **same shape**: stop regexing the rendered HTML; intercept the deferred
XHR/GraphQL response that actually carries the data. (Same fix class as the original `#trends-0pct-fill`
note prescribed.)

---

## H3a · Google Trends (`#trends-0pct-fill`)

**Defect:** `engine/bricks/fetch.js` — `fetchTrend()` (L161–191) captures `page.content()` (L182) and
hands it to `extractTrendSeries()` (L199–247), which regexes for `timelineData` in the HTML. But Trends
loads the series via a deferred XHR, so the key is never in the HTML → `series=null` →
`classifyTrendShape()` returns `"unknown"` for all 20 brands.

**Fix approach (offline, after fixture lands):** intercept the XHR.
- The series comes from `https://trends.google.com/trends/api/widgetdata/multiline?...` (token flow:
  `/trends/api/explore` returns the widget `token`+`req`; `widgetdata/multiline` returns the timeline).
- Every `/trends/api/*` body is prefixed with the XSSI guard `)]}',\n` — strip before `JSON.parse`.
- Parsed shape: `obj.default.timelineData[]`, each point `{ formattedTime, value:[n] }`. Map
  `formattedTime`→`date`, `value[0]`→`value`.
- Rewrite `fetchTrend` to register `page.on('response', …)` filtering `url.includes('/api/widgetdata/multiline')`
  BEFORE `page.goto`, await the matching response (with timeout), strip XSSI, parse. Rewrite
  `extractTrendSeries` to accept the parsed object instead of HTML.
- **Acceptance gate:** on the committed fixture, `extractTrendSeries` returns a non-empty series AND
  `classifyTrendShape(series) !== 'unknown'`.

**Capture runbook (operator, from WSL):**
1. Launch real Windows Chrome with debug port + persistent profile (confirm paths vs README-ops.md §A):
   ```bash
   nohup "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
     --remote-debugging-port=9333 --remote-debugging-address=0.0.0.0 \
     --remote-allow-origins='*' --user-data-dir='C:\Users\kyu3\arduview-cdp' \
     --no-first-run --no-default-browser-check \
     'https://trends.google.com/trends/explore?date=today%205-y&q=focus%20timer&hl=en' \
     >/tmp/winchrome.log 2>&1 &
   ```
2. Start the forwarder: `cp engine/integrations/cdp/win-chrome-forwarder.py /mnt/c/Users/kyu3/arduview-fwd.py`
   then run it with the Windows python (see README-ops.md §A).
3. Verify bridge: `GW=$(ip route show default | awk '{print $3}'); curl -s "http://$GW:9334/json/version"`.
4. **HUMAN:** in the Chrome window, accept the Google consent banner once and confirm the
   interest-over-time chart renders real data for the term.
5. Capture via a one-shot Playwright `connectOverCDP` listener (mechanism = `drive.cjs`), saving the
   verbatim `multiline` response body to `runs/_fixture/trends/<term>-xhr.json` (KEEP the `)]}',` prefix),
   the request URL to `<term>-xhr.url.txt`, and the page HTML to `<term>-page.html`.
6. Sanity: parse `<term>-xhr.json` (strip XSSI) → `default.timelineData.length > 0`, ≥1 non-zero `value[0]`.

**Fixture contract (`runs/_fixture/trends/`):** `<term>-xhr.json` (verbatim, ~260 weekly points,
each `{formattedTime, value:[n]}`, ≥1 non-zero) · `<term>-xhr.url.txt` (the live URL) · `<term>-page.html`
(proves the series is NOT in the DOM — validates the old regex was unwinnable).

---

## H3b · Meta Ad Library (`#adlib-selectors`)

**Defect:** `engine/bricks/adlib-one.js` — `extractAdCards()` (L110–199) has NO card-container selector;
it scrapes all `<a href>` and guesses card boundaries by walking 20 ancestors for a "Library ID" text
marker (heuristics at L125–149, `TODO(D-17)` at L106/112/124/169/357/382). `destination_url` comes back
broadly null. `funnel-assemble.js:clusterAdsByUrl` (L269–288) keys clusters on `normalizeUrl(destination_url)`,
so null-destination ads go to `ambiguous[]` and never assemble → `bound_ads:[]` → `qualifying_creatives=0`.

**Fix approach (offline, after fixture lands) — intercept GraphQL, do NOT calibrate DOM selectors:**
- The DOM is adversarial (obfuscated/rotating class names); any selector calibrated today rots on the
  next React deploy. The JSON carries `destination_url` + delivery dates + impression bucket regardless
  of render state.
- Match `response.url().includes('/api/graphql/')` (or legacy `/ads/library/async/search_ads/`); the
  backing query's `fb_api_req_friendly_name` looks like `AdLibrarySearch*PaginationQuery`. Capture the
  FULL body (don't assume the nesting path).
- Field map (confirm against fixture): `ad_archive_id`→`library_id`; `link_url`/`snapshot.link_url`/
  `snapshot.cards[].link_url`→`destination_url`; `ad_delivery_start_time`(epoch)→`started_running_date`;
  `ad_delivery_stop_time`→`end_date`→`run_length_days`; `impressions*`→`impression_bucket`;
  `publisher_platform[]`→`platforms`; `snapshot.{title,body.text,cta_text}`.
- Replace only `extractAdCards` with a JSON mapper keyed on `ad_archive_id`; keep `pickAdvertiser` +
  `parseAdsFromText` date parse as-is.
- **Acceptance gate:** on the Flipper fixture (known 53 ads / 238-day run), `destination_url` non-null
  for ≥90% of active ads → clusters form → `bound_ads` non-empty.

**Capture runbook (operator, from WSL):** Steps 1–3 identical to H3a but launch URL =
`https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=flipper%20zero&search_type=keyword_unordered&media_type=all`.
4. **HUMAN:** accept cookies, pick the genuine **Flipper Zero** advertiser (not a reseller) → lands on a
   `view_all_page_id=…` URL, scroll ~8–10× to load cards + paginated GraphQL fetches.
5. DOM fixture: `node engine/integrations/cdp/cdp.cjs --tab=ads/library eval "document.documentElement.outerHTML"
   > runs/_fixture/adlib/flipper-zero-dom.html` (sanity: `grep -c "Library ID"` > 0).
6. XHR fixture: F12 → Network → filter `graphql` → find the response whose body has numeric
   `ad_archive_id` + a `link_url` → Copy response → save to `runs/_fixture/adlib/flipper-zero-xhr.json`
   (multiple pagination responses → `-xhr.json`, `-xhr-2.json`, …).
7. Optional backups (`ads_flag=yes`): repeat for `nothing`, `anbernic`, `divoom`.

**Fixture contract (`runs/_fixture/adlib/`):** `flipper-zero-xhr.json` (~53 ad objects, each with numeric
`ad_archive_id`, non-null `link_url`/`destination_url`, `ad_delivery_start_time`) · `flipper-zero-dom.html`
(>0 `Library ID:` markers — DOM fallback reference + cross-check).

---

## After capture (follow-up session, offline)
1. Implement the two parser fixes against the committed fixtures.
2. Smoke: Trends fill-rate > 0 on the fixture; adlib `destination_url` non-null ≥90% + clusters form.
3. Flip `web-site-fetch` (Trends) and `meta-ad-fetch` REGISTRY health untested→working.
4. no-overwrite-v1: any re-capture writes `-v2`; never mutate v1 fixtures.
