# External Integrations — PMF Engine

**Analysis Date:** 2026-06-26

## APIs & External Services

**Google Trends:**
- Service: Google Trends (web search volume)
- What it's used for: Demand trend extraction during S1 light-pass (`engine/bricks/fetch.js`)
- SDK/Client: Playwright (headless browser automation + XHR interception)
- Auth: None (cookies auto-managed: `NID`, `SOCS` consent warm required)
- Health: Working (P21 fix #trends-0pct-fill — consent warm + /api/widgetdata/multiline XHR intercept, verified online 2026-06-25)
- Caveat: Fetcher runs headless from AWS datacenter IP; local testing uses this IP

**Meta Ad Library (Facebook/Instagram):**
- Service: Meta Ad Library GraphQL API
- What it's used for: Competitor ad creative fetching (S1 light-pass)
- SDK/Client: Playwright headless + custom GraphQL parser
- Files: `engine/bricks/adlib-one.js`, `engine/bricks/adlib-sweep.js`, `engine/bricks/lib/adlib-graphql.js`
- Auth: None (public GraphQL endpoint, Playwright session auth)
- Health: Working (P21 fix #adlib-selectors — destination_url/dates/platforms extraction verified)
- Caveat: Headless typeahead advertiser-resolution incomplete (#adlib-typeahead-resolve); workarounds: forced pageId / keyword-URL / CDP bridge. Full live runs deferred R7.

**Reddit:**
- Service: reddit.com (user-content VOC)
- What it's used for: S3 voice-of-customer markdown extraction
- SDK/Client: Playwright headless (headed-by-default post-P21 hardening)
- Files: `engine/skills/reddit-extract/dump.mjs`
- Auth: None for .json alt-representation; production should use Reddit OAuth API
- Health: Untested in full E2E this session; diagnosed (datacenter IP rate-limiting under load) — headless 403 on .json alt; headed 200 (P21 fix)
- Caveat: This sandbox (AWS datacenter IP) rate-limited under repeated testing; residential IP required for full dump. Production should use Reddit OAuth API (deferred R6).
- Note: Moved into bundle from `.claude/` slash-command; re-register `engine/skills/reddit-extract/SKILL.md` if slash-command is wanted

**Crowdfunding Platforms:**
- Services: Kickstarter, Indiegogo, crowdsupply.com
- What it's used for: Campaign page fetching (S1/S2)
- SDK/Client: Playwright headless
- Files: `engine/bricks/crowdfund-fetch.js`
- Auth: None (public pages)
- Health: Untested (deferred R7)
- Caveat: Cloudflare WAF blocks datacenter IPs (Kickstarter/Indiegogo 403); crowdsupply.com reachable (no WAF). Full live runs need residential IP or IP rotation.

## Data Storage

**Databases:**
- None (no persistent database integration)

**File Storage:**
- **Local filesystem only** — all bricks read/write under `runs/<space>/` directory tree picked by the operator
- Artifact dirs: `corpus/`, `funnels/`, `assets/`, `ads/`, etc. (per REGISTRY.json I/O contracts)
- No S3, Google Drive, or cloud storage in the engine core
- Asset fetch supports remote URLs/Google Drive (deferred R7); local path proven (H6 smoke green)

**Caching:**
- None (no Redis, Memcached, or explicit cache layer)
- Results are written as files (JSON) under the run-space

## Authentication & Identity

**Auth Provider:**
- None (engine layer has no user/session management)

**Integration Auth Model:**
- All external services use **application-level credentials** (not user OAuth)
- Credentials never committed; resolved via `engine/integrations/lib-creds.js`:
  1. `--creds=<path>` CLI flag (preferred: run-supplied secrets)
  2. Environment variable (e.g., `SHOPIFY_CREDS=/path`, `CF_CREDS=/path`)
  3. Legacy default path (backward-compat, e.g., `.shopify-creds.json` in integration dir)

## Integrations — Deploy (wired via hooks or explicit orchestrator steps)

**Shopify Store Deploy:**
- Service: Shopify REST API (admin)
- What it's used for: S7 live storefront implementation (theme customization, page creation, asset CDN push)
- SDK/Client: `engine/integrations/shopify/` (Node + curl via execSync)
- Files: `engine/integrations/shopify/shopify-deploy-funnel.js`, `engine/integrations/shopify/shopify-upload-assets.js`, `engine/bricks/asset-upload.js`
- Creds: Shopify store domain + API version + access token (`--creds=<path>` or `SHOPIFY_CREDS` env)
- Health: Working (P21 fix #cred-seam); dry-run-verified
- Caveat: Live API operations (actual store push) not exercised this session — deferred R7 for integration testing
- Config: Default config for Arduview (store, theme ID, page handles, Klaviyo integration) in `shopify-deploy-funnel.js`; overridable via JSON config file passed as argv

**Cloudflare DNS:**
- Service: Cloudflare API v4 (DNS, zone management)
- What it's used for: S7 deploy automation (optional; DNS record management)
- SDK/Client: `engine/integrations/cloudflare/cf.js` (Node + HTTPS REST)
- Files: `engine/integrations/cloudflare/cf.js`, `engine/integrations/cloudflare/cf-migrate-dns.js`, `engine/integrations/lib-creds.js`
- Creds: Cloudflare API token (via `--creds=<path>` or `CF_CREDS` env; legacy `CF_TOKEN` env still supported for backward compat)
- Health: Working (P21 fix #cred-seam); dry-run verified (error handling clear)
- Caveat: Live API calls require real token and zone

**Klaviyo Email/CRM:**
- Service: Klaviyo REST API (email list, subscriber management)
- What it's used for: S7 email capture integration (opt-in lists embedded in Shopify pages)
- SDK/Client: `engine/integrations/klaviyo/kl.js` (Node + HTTPS REST)
- Creds: Klaviyo API key (via `--creds=<path>` or `KLAVIYO_CREDS` env)
- Health: Working (P21 fix #cred-seam); dry-run verified
- Caveat: Live API calls require real key
- Note: Arduview default config hard-codes a Klaviyo company_id + list_id for backward compat; override in JSON config

**Surge.sh Static Deploy:**
- Service: surge.sh CDN (static site publishing)
- What it's used for: S7 live static-site deploy (landing pages, video galleries)
- SDK/Client: `engine/integrations/surge/surge_drive.py` (Python + npx surge CLI wrapper)
- Files: `engine/integrations/surge/surge_drive.py`
- Creds: surge.sh account email + password (via `$SURGE_EMAIL`/`$SURGE_PW` env)
- Health: Dry-run-verified (P21 H6, `h6-bucketB.sh` — code compiles, npx 10.8.2 present, env checks work)
- Caveat: Live surge.sh push (actual deployment) not exercised — deferred R7
- Security Note: P21 H4 hardening removed legacy hardcoded password + absolute site path; now all params come from args/env
- Config: `SITE` (local dir) and `DOMAIN` (surge URL) provided via args or env

## Browser Automation & RPA

**Chrome via Chrome DevTools Protocol (CDP):**
- Service: Windows Chrome with remote-debugging protocol
- What it's used for: Real browser RPA for IP-gated retrievers (Google Trends, reddit, ad-library when headless fails)
- SDK/Client: `engine/integrations/cdp/` (Node .cjs + Python bridge for Windows)
- Files:
  - `engine/integrations/cdp/cdp.cjs` — CDP commands (goto, click, wait, screenshot)
  - `engine/integrations/cdp/drive.cjs` — scenario orchestrator
  - `engine/integrations/cdp/clickxy.cjs` — click coordinate helper
  - `engine/integrations/cdp/win-chrome-forwarder.py` — Windows loopback bridge (Windows-only)
- Env: `CDP_HOST`, `CDP_PORT` (localhost:9333 typical)
- Health: Partial (P21 H6 `h6-bucketB.sh` — graceful-error when unreachable; code path + arg handling working. Live drove needs operator's Windows Chrome + forwarder; env-dependent)
- Caveat: Windows-only (WSL ↔ Windows Chrome bridge required); reference: `runs/arduview/_tooling/` (legacy tooling, needs review for current paths)

**Playwright Headless (Bundled):**
- Browser binary: Chromium (post-install via `npx playwright install chromium`)
- Scope: fetch, crowdfund-fetch, adlib, reddit-extract, funnel-assemble
- Non-interactive fetching; does not handle IP-gated rate limits well from datacenter IP

## Monitoring & Observability

**Error Tracking:**
- None (no Sentry, Rollbar, or external error service)

**Logs:**
- Console stderr/stdout only (no centralized logging)
- Each brick writes diagnostic output to stderr on failure
- Exit codes: 0 = success, 1 = runtime error, 2 = validation/contract error (enforced across validators)

**Health Checks:**
- `engine/contracts/h6-all.sh` — master health harness (14/14 green = system healthy)
- Individual smoke scripts verify each capability in isolation with committed fixtures
- No continuous monitoring; health is manual verification post-commit

## Webhooks & Callbacks

**Incoming:**
- None (engine is not a service; no webhook receivers)

**Outgoing:**
- Shopify page create/update via REST (no webhooks; synchronous API calls)
- Cloudflare DNS via REST (no webhooks)
- Klaviyo subscriber via REST (no webhooks)
- No event-driven patterns in the engine; all flows are request-response

## Environment Configuration

**Required Env Vars (optional — all have fallbacks or CLI flags):**
- `SURGE_EMAIL` — surge.sh account email (or pass via script args)
- `SURGE_PW` — surge.sh account password (or pass via script args)
- `SURGE_SITE` — local directory to deploy (or pass via script args)
- `SURGE_DOMAIN` — surge.sh domain (e.g., `mysite.surge.sh`)
- `DR_DIR` — DR knowledge source directory (default: `~/knowledge/dr-marketing`; override with `--dr-dir=<path>`)
- `VOYAGE_API_KEY` — Voyage AI embeddings API key (optional; stubbed locally)
- `CDP_HOST` — Chrome DevTools Protocol host (typical: `localhost`)
- `CDP_PORT` — Chrome DevTools Protocol port (typical: `9333`)
- `CF_TOKEN` — Cloudflare API token (legacy, overrides `CF_CREDS` path; prefer `--creds=<path>` or `CF_CREDS` env)

**Credentials Files (none committed):**
- `.shopify-creds.json` (default path; preferred: pass via `--creds=<path>` or `SHOPIFY_CREDS` env)
  - Structure: `{ "store": "...", "api_version": "...", "token": "..." }`
- `.cloudflare-creds.json` (default path; preferred: pass via `--creds=<path>` or `CF_CREDS` env)
  - Structure: `{ "api_token": "..." }`
- `.klaviyo-creds.json` (default path; preferred: pass via `--creds=<path>` or `KLAVIYO_CREDS` env)
  - Structure: `{ "api_key": "..." }`
- `.surge-creds.json` (legacy; now use env `SURGE_EMAIL`/`SURGE_PW`)

**Secrets Location:**
- No secrets in repo (all `.env` / `.creds.json` in `.gitignore`)
- Operator provides at run-time via CLI flags or environment

## Data Flow

**Fetch → Clean → Funnel → Deploy Flow:**
1. **Fetch** (S1) — `fetch.js` (Playwright) → Trends + LP HTML → `corpus/<slug>/raw/*.html`
2. **Ad Fetch** (S1) — `adlib-one.js` (Playwright + GraphQL) → Meta ads → `ads/<slug>.json`
3. **Clean** (S1) → `clean.js` + `funnel-clean.js` → markdown → `corpus/<slug>/clean/*.md` + `funnels/clean/*.md`
4. **Funnel Assemble** (S2) → `funnel-assemble.js` (Playwright render) → clusters ads by URL → `funnels/<id>.json`
5. **Asset Classify** (S6) — `asset-fetch.js` (local or remote) → `asset/probe.py` (Pillow, imagehash) → image/video metadata → `asset-map-rank.js` → ranked → `asset-emit.js` → `images.json` / `videos.json`
6. **Deploy** (S7):
   - Surge: `surge_drive.py` → static site push
   - Shopify: `shopify-deploy-funnel.js` → theme + pages + assets
   - Cloudflare: `cf.js` → DNS records (optional)
   - Klaviyo: email list integration embedded in Shopify pages

**Firing Layer Integration:**
- PostToolUse hook: `engine/hooks/route.js` dispatches writes by basename
  - `brands.json` → `validate-finder.js` + `validate-revenue.js` (exit 0/2)
  - `dump.json` → `validate-dumper.js`
  - `space-map.json` → `validate-classifier.js`
  - `*-beliefs.json` → `validate-analyzer.js`
- DR Injectors (explicit orchestrator step):
  - `inject-dr.js` → Section Analyzer context
  - `inject-funnel-architect-dr.js` → Funnel Architect context
  - `inject-market-selection-dr.js` → Market Selection context
  - `inject-copywriter-dr.js` → Copywriter context

## Known Gaps & Deferred Work

**R6 (Reddit OAuth):**
- Current: Headless Playwright (diagnosed 403 from datacenter IP)
- Future: Reddit official OAuth API (works from datacenter; avoids rate-limit wall)

**R7 (Live Integration Testing):**
- Surge: Push unverified (code proven; live deploy needs run)
- Shopify: Live API calls unverified (cred-seam proven; API interaction needs run)
- Cloudflare: Live API calls unverified
- Klaviyo: Live API calls unverified
- Asset fetch (remote): Drive/URL download unverified; local proven
- Crowdfund fetch: Live pages unverified; mocked/offline testing only
- Meta Ad Library: Typeahead advertiser-resolution fragile (headless returns no candidates)
- Funnel assemble: Live LP-render hop via Playwright unverified (online only)

**R7+ (Design Deferred):**
- No custom SMTP/email sending (Klaviyo handles email; engine has no mail brick)
- No webhook receivers (all flows are request-response)
- No database schema (file-based artifacts only)

---

*Integration audit: 2026-06-26. Health: 22 working, 1 dry-run-verified, 1 partial, 2 deferred-diagnosed. Entry: `engine/WIRING-BUNDLE.md`. Firing reference: `engine/FIRING-MANIFEST.md`.*
