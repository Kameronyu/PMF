# External Integrations

**Analysis Date:** 2026-06-24

## Web Scraping Targets (Playwright headless Chromium)

These are fetched programmatically — not REST APIs, but the tools treat them as data sources.

**Meta Ad Library:**
- URL pattern: `https://www.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&q=<brand>`
- Scripts: `tools/adlib-one.js` (page-ID resolved, single brand), `tools/adlib-sweep.js` (batch sweep)
- Output: `ads/<slug>.json` with active ad count, library IDs, run dates, copy, destination URLs
- Auth: none required (public library)

**Google Trends:**
- URL pattern: `https://trends.google.com/trends/explore?date=today%205-y&q=<term>&hl=en`
- Script: `tools/fetch.js` (`fetchTrend()` function, D-15)
- Output: `demand_trend` field written back into `brands.json` per brand
- Auth: none required (public)

**Crowdfunding Platforms:**
- Kickstarter, Indiegogo, Crowd Supply, BackerKit
- Script: `tools/crowdfund-fetch.js`; also copied to `runs/eink-tablets/scripts/crowdfund-fetch.js` for that run
- Output: per-slug `raw/campaign|comments|updates|risks|faq-<timestamp>.html/txt/png/stats.json`
- Auth: none required; Playwright with stealth defaults (CF-bypass loop, fingerprint masking)
- SSRF guard: host validated against private/loopback/link-local/metadata ranges before `page.goto`

**Competitor Websites (LP fetching):**
- Script: `tools/fetch.js` (homepage + LP-hunt URL patterns from `brands.json` / bet-brief PIPELINE INPUTS)
- Output: `corpus/<slug>/raw/<page>.html` + `.meta.txt` sidecar
- Auth: none required; Playwright with user-agent spoofing and Cloudflare bypass loop

**Reddit Threads:**
- Script: `.claude/skills/reddit-extract/dump.mjs`
- Mechanism: loads the HTML thread page in Playwright Chromium, then calls Reddit's `.json?limit=500` and `/api/morechildren.json` from inside the page (same-origin fetch, bypasses edge 403)
- Output: `<slug>.md` (nested markdown) + `<slug>.raw.json`
- Auth: none required (public threads); Reddit API licensing note: GummySearch dead as of Nov 2025

**Wayback Machine (Web Archive):**
- Referenced in `.claude/settings.json` as a fetch target (`web.archive.org/web/*/`) for historical LP research
- Script: `tools/crowdfund-fetch.js` (same tool, `--type=lp`)

**SimilarWeb / Semrush:**
- NOT automated (D-11 decision: no auto-browser scraping of SimilarWeb)
- `tools/revenue-est.js` accepts `inputs.monthly_visits` as operator-pre-populated data
- Operator manually sources traffic numbers and enters them before running `revenue-est.js`

## Deployment Platforms

**surge.sh (static site hosting):**
- Live URL: `https://arduview-see-through.surge.sh`
- Script: `runs/arduview/_tooling/surge_drive.py`
- Mechanism: spawns `npx surge` inside a Python pty, feeds email/password to the prompt programmatically
- Account: kameronyu0612@gmail.com (throwaway surge.sh host account)
- Assets: video asset served from surge CDN (`/assets/video/hero.mp4`) with overrides in `shopify-deploy-funnel.js`

**Shopify (storefront + funnel deployment):**
- Store: `useinkleaf` (admin.shopify.com/store/useinkleaf)
- Creds: `runs/arduview/_tooling/.shopify-creds.json` (store domain, API token, API version) — gitignored
- Scripts:
  - `runs/arduview/_tooling/shopify-deploy-funnel.js` — deploys multi-page HTML funnel as Liquid templates + assets via Shopify Theme Asset API (curl-based, not SDK)
  - `runs/arduview/_tooling/shopify-upload-assets.js` — uploads local media to Shopify Files, returns `name → CDN URL` map
- API base: `https://<store>/admin/api/<api_version>`
- CDN: `https://cdn.shopify.com/s/files/1/<store_num_id>/files/<filename>.jpg` (images, constructable from ID); video CDN URLs are hash-based and must come from upload response (never fabricated)

**Cloudflare (DNS management):**
- Script: `runs/arduview/_tooling/cf.js` (generic REST client), `runs/arduview/_tooling/cf-migrate-dns.js` (DNS migration)
- Creds: `runs/arduview/_tooling/.cloudflare-creds.json` (`api_token`) — gitignored; also overridable via `CF_TOKEN` env
- API base: `https://api.cloudflare.com/client/v4`

## Email / CRM

**Klaviyo:**
- Two accounts configured:
  - Arduview account: `runs/arduview/_tooling/.klaviyo-creds.json` — gitignored; company_id `SvpLu3`, list_id `XdSSdg`
  - InkLeaf account: `runs/arduview/_tooling/.klaviyo-inkleaf-creds.json` — gitignored; `private_key` field
- Scripts:
  - `runs/arduview/_tooling/kl.js` — generic Klaviyo API client (GET/POST to `https://a.klaviyo.com/`), reads `.klaviyo-inkleaf-creds.json`
  - Email subscribe form injected client-side in Shopify funnel pages (via `shopify-deploy-funnel.js`) using `https://a.klaviyo.com/client/subscriptions/?company_id=<company_id>` — public client API, no server-side key needed

## Embeddings (Optional)

**Voyage AI:**
- API: `https://api.voyageai.com/v1/embeddings`
- Auth: `VOYAGE_API_KEY` env var
- Model: `voyage-3-large` (default), overridable via `VOYAGE_MODEL`
- Used by: `tools/lib/embed.js` (called from `tools/funnel-vectorize.js` and `tools/funnel-rag-query.js`)
- Fallback: local deterministic FNV-1a stub when key is absent — pipeline runs end-to-end without Voyage; recall quality degrades to lexical overlap only

## Chrome DevTools Protocol (CDP) — Windows Chrome Automation

Used to drive the user's real Windows Chrome from WSL (bypasses Google/Shopify automation detection of Playwright's bundled Chromium):

- **Windows Chrome** launched with `--remote-debugging-port=9333`, binds `127.0.0.1:9333`
- **Forwarder** (`runs/arduview/_tooling/win-chrome-forwarder.py`): runs on Windows Python 3.11, bridges `0.0.0.0:9334` → `127.0.0.1:9333` so WSL can reach it via the gateway IP
- **WSL CDP client** (`runs/arduview/_tooling/cdp.cjs`): raw CDP over WebSocket (not Playwright `connectOverCDP` — avoids hang on browser-level targets); connects to detected Windows gateway IP (auto-detected via `ip route show default`)
- **Legacy** (`runs/arduview/_tooling/drive.cjs`): uses `chromium.connectOverCDP` with Playwright; kept for reference but superseded by `cdp.cjs` for robustness

## MCP Servers (Claude Code integration)

**scite** (scientific literature search):
- Server URL: `https://api.scite.ai/mcp`
- Auth: OAuth token in `/home/kyu3/.claude/.credentials.json` (mcpOAuth)
- Allowed tool: `mcp__scite__search_literature` (permitted in global Claude settings)
- Use: referenced in `workflow.md` Step 5 (mechanism research)

**Playwright MCP** (`@playwright/mcp`):
- Configured in `/home/kyu3/.claude/settings.json` under `mcpServers`
- Args: `--headed --browser chromium`
- Use: alternative to calling Playwright scripts directly, for interactive browser sessions from Claude

## Claude Code Hooks

**PostToolUse → route.js:**
- Config: `.claude/settings.json` hooks section
- Trigger: any `Write` tool call
- Command: `node tools/hooks/route.js "$CLAUDE_TOOL_INPUT_PATH" validate-finder validate-dumper validate-classifier validate-revenue`
- Routes to validators based on written filename:
  - `brands.json` → `tools/hooks/validate-finder.js` + `tools/hooks/validate-revenue.js`
  - `dump.json` → `tools/hooks/validate-dumper.js`
  - `space-map.json` → `tools/hooks/validate-classifier.js`
- Exit 2 from any validator blocks the write (schema enforcement without an agent)

## Knowledge Base (Local Read-Only)

**DR Marketing knowledge base:**
- Location: `/home/kyu3/knowledge/dr-marketing/`
- Access: `Read(//home/kyu3/knowledge/dr-marketing/**)` permitted in global Claude settings
- Use: pipeline audit DR-scouts read KB law files; skills inject `_dr-context.generated-*.md` files as cold context for agent prompts
- Not a REST API — flat markdown files on disk

---

*Integration audit: 2026-06-24*
