# Engine Capability Registry — points to everything the wiring does

**Generated:** 2026-06-24 (hand-built; regenerable via the `engine-map` skill). **Health flipped:** Phase 21 hardening, 2026-06-25.
**Paths:** shown at their **post-reorg** `engine/` locations. Agent/step labels are **PROVISIONAL** — reconciled against the operator's rebuilt I/O contracts.
**How to read:** grouped by named capability. Each entry: files · what it does · I/O · run · deps/creds · step (PROVISIONAL) · health · error-notes.
**Authoritative per-capability health lives in `REGISTRY.json`** (with `p21` notes); the inline `health:` markers below are the pre-Phase-21 snapshot — consult the JSON + the summary block here for current state.

## Phase 21 hardening — health flips (2026-06-25)
- **working (11):** `funnel-store` (24/24 6a recovered + H5) · `embeddings-rag` + `embeddings` (index rebuilt + H5, Voyage live) · `funnel-score` (#funnel-score-input + H5) · `funnel-clean` (#funnel-clean-md-headings + H5) · `firing-hooks` (H0 validators→enums.json 8/8 + H1 #analyzer-unwired fires) · `meta-ad-fetch` (#adlib-selectors graphql extraction, verified vs real fixture) · `web-site-fetch` (**#trends-0pct-fill FIXED** — consent-warm + multiline XHR intercept; fill-rate>0 verified, even from this AWS IP) · `shopify-deploy` · `cloudflare-dns` · `klaviyo` (cred-seam fixed + dry-run verified; live API needs run creds).
- **still untested / partial:** `reddit-extract` (headless-fingerprint was the block → hardened to headed `6dc6a30`; clean dump pending a residential IP / OAuth — this sandbox's AWS IP rate-limits reddit under load) · `meta-ad-fetch` carries a SEPARATE open gap (#adlib-typeahead-resolve, headless advertiser-pick). The rest (`crowdfund-fetch`, `funnel-assemble`, asset chain, `chrome-cdp`, `surge-deploy`, etc.) were not exercised this pass.
- **Env note:** this session egresses via an AWS datacenter IP. Trends needed only a consent-warm (not a residential IP); reddit additionally rate-limits the datacenter IP under repeated load.
- **E2E:** the deterministic spine (clean→score→store→vectorize→rag-query + analyzer gate) passes `engine/contracts/h5-e2e.sh` end-to-end on `runs/_fixture/`.

> The reorg preserves internal structure: `tools/*.js` → `engine/bricks/*.js`, `tools/asset/` → `engine/bricks/asset/`, `tools/lib/` → `engine/bricks/lib/`, `tools/hooks/` → `engine/hooks/`. Generic integrations promoted from `runs/arduview/_tooling/` → `engine/integrations/<service>/`. `reddit-extract` stays in its skill dir (indexed in place).

---

## 1. FETCH — get raw data off the web

### `web-site-fetch` · LP/site + Google Trends
- **files:** `engine/bricks/fetch.js`
- **does:** Playwright-driven per-brand homepage + LP-hunt fetch; Google Trends ~5yr demand-shape classifier; Cloudflare-aware loop, UA spoofing.
- **I/O:** `brands.json` (url, lp paths) + LP-hunt term list → `corpus/<slug>/raw/*.html` + `brands.json` enriched with `demand_trend`.
- **run:** `node engine/bricks/fetch.js --space=<space>`
- **deps:** node:playwright · creds: none · **step:** S1 light-pass (PROVISIONAL)
- **health:** untested · **error-notes:** `ERROR-NOTES.md#trends-0pct-fill` (Google Trends deferred-XHR → 0% fill, OPEN)

### `crowdfund-fetch` · Kickstarter/Indiegogo/Crowd Supply/BackerKit
- **files:** `engine/bricks/crowdfund-fetch.js`
- **does:** Playwright fetch of campaign/comments/updates/risks/FAQ; SSRF + DoS guards; real-Chromium 403 bypass.
- **I/O:** slug + URL + `--type` → `<outDir>/<slug>/raw/{campaign|comments|...}-<ts>.{html,txt,png,stats.json}`
- **run:** `node engine/bricks/crowdfund-fetch.js <slug> <url> --type=lp`
- **deps:** node:playwright, dns · creds: none · **step:** S1/S2 (PROVISIONAL) · **health:** untested

### `meta-ad-fetch` · Meta Ad Library
- **files:** `engine/bricks/adlib-one.js` (single brand by page-ID), `engine/bricks/adlib-sweep.js` (batch wrapper)
- **does:** typeahead → advertiser pick → `view_all_page_id` → active ad count + metadata.
- **I/O:** slug + brand [+ pageId] → `ads/<slug>.json`
- **run:** `node engine/bricks/adlib-one.js <slug> "<brand>" [pageId]`
- **deps:** node:playwright · **step:** S1 (PROVISIONAL) · **health:** untested · **error-notes:** `ERROR-NOTES.md#adlib-selectors` (DOM selectors uncalibrated, OPEN)

### `reddit-extract` · thread → user-content markdown  *(indexed in place — skill-co-located)*
- **files:** `.claude/skills/reddit-extract/dump.mjs` (+ `SKILL.md`)
- **does:** loads thread in Playwright Chromium, calls Reddit `.json?limit=500` + `/api/morechildren.json` same-origin (bypasses edge 403), renders nested markdown of OP + every comment.
- **I/O:** reddit URL → `<slug>.md` + `<slug>.raw.json`
- **run:** `/reddit-extract <url>` (skill) or `node .claude/skills/reddit-extract/dump.mjs <url>`
- **deps:** node:playwright · **step:** S3 VOC (PROVISIONAL) · **health:** untested

---

## 2. CLEAN / NORMALIZE

### `html-clean-markdown` · LP link → clean markdown
- **files:** `engine/bricks/clean.js`
- **does:** strips nav/cookie/footer/scripts/boilerplate → pure copy markdown.
- **I/O:** `corpus/<slug>/raw/*.html` → `corpus/<slug>/clean/*.md`
- **run:** `node engine/bricks/clean.js --space=<space>` · **deps:** none · **step:** S1 · **health:** untested

### `funnel-clean` · section-marked funnel copy
- **files:** `engine/bricks/funnel-clean.js`
- **does:** normalizes funnel markdown, section-marks verbatim copy. **error-notes:** `ERROR-NOTES.md#funnel-clean-md-headings` (only HTML `<h1-4>`; `.md` `##` headings drop `[SECTION]` markers).
- **I/O:** `runs/<space>/funnels/raw/*.md` → `funnels/clean/*.md` · **deps:** none · **step:** S2 · **health:** untested

### `dedupe` · brand roster dedup
- **files:** `engine/bricks/dedupe.js`
- **does:** merges brands by normalized domain; unions `found_by`, keeps richest channel.
- **I/O:** `brands.json` → `brands.json` (deduped) · **deps:** none · **step:** S1 · **health:** untested

---

## 3. FUNNEL PIPELINE (S2 deep pass)

### `funnel-assemble` · ads → funnel packages
- **files:** `engine/bricks/funnel-assemble.js`
- **does:** normalizes destination URLs (strips utm/fbclid/A-B params — fixed `bbff2ff`), clusters ads per LP, renders each LP via Playwright, emits one `funnel_package` per cluster; SSRF guard.
- **I/O:** `ads/<slug>.json` → `funnels/<funnel_id>.json` · **deps:** node:playwright, dns · **step:** S2 · **health:** untested

### `funnel-score` · two-currency validation
- **files:** `engine/bricks/funnel-score.js`
- **does:** stamps `validation_lane[]` (A ad-fed / B crowdfunding) + `validation_strength{}` (deterministic). **error-notes:** `ERROR-NOTES.md#funnel-score-input` (accepts wrong input file → null stats; no field check).
- **I/O:** funnel_package → `<funnel_id>-scored.json` · **deps:** none · **step:** S2 · **health:** untested

### `funnel-store` · per-funnel JSON store
- **files:** `engine/bricks/funnel-store.js`
- **does:** assembles per-funnel record from scored package + belief_records; persists `funnel_fields` PREFERRED (fixed `bbff2ff`).
- **I/O:** funnel_package + belief_records → `runs/<space>/funnels/<funnel_id>.json` · **deps:** none · **enforced-by:** `validate-analyzer.js` (belief records) · **step:** S2 · **health:** untested

### `funnel-claim-tally` · saturation pre-pass
- **files:** `engine/bricks/funnel-claim-tally.js` · **does:** tallies move tags across funnels → DEAD-GROUND vs WHITESPACE.
- **I/O:** `funnels/*.json` → `_tally.json` · **step:** S2 · **health:** untested

### `funnel-analyzer-context` · Section Analyzer context assembler
- **files:** `engine/bricks/funnel-analyzer-context.js` · **does:** assembles DR bundle + cleaned funnel body into the analyzer's spawn prompt (analyzer never Reads files).
- **I/O:** funnel record + DR → context block · **step:** S2 firing · **health:** untested

---

## 4. EMBEDDINGS / RAG

### `embeddings` · Voyage or stub
- **files:** `engine/bricks/lib/embed.js` · **does:** single swap-point — Voyage REST or local FNV-1a stub; cosine.
- **I/O:** texts[] → vectors · **deps:** env:`VOYAGE_API_KEY` (optional; stub fallback) · **health:** untested

### `funnel-vectorize` + `funnel-rag-query` · belief RAG
- **files:** `engine/bricks/funnel-vectorize.js`, `engine/bricks/funnel-rag-query.js` (both `require('./lib/embed')`)
- **does:** vectorize = JIT index of belief_records; rag-query = cosine-kNN + structured prefilter (belief_id/proof_tier/source_type/routing_flag).
- **I/O:** `funnels/*.json` → `_index.json` → ranked results · **error-notes:** `ERROR-NOTES.md#index-stale` (rebuild with `node engine/bricks/funnel-vectorize.js --space=arduview`) · **step:** S2→S4 · **health:** untested

---

## 5. AGGREGATE / SCORE (deterministic, no LLM)

### `revenue-estimate` · `engine/bricks/revenue-est.js`
- **does:** `monthly_visits × cvr(0.02) × aov` → `value_usd_monthly`; review_proxy fallback; never fabricates. · **I/O:** `brands.json` → `brands.json` +revenue_est · **enforced-by:** `validate-revenue.js` · **step:** S1 · **health:** untested

### `mechanisms-aggregate` · `engine/bricks/aggregate-mechanisms-in-play.js`
- **does:** counts mechanism frequency across brands → SATURATED/WHITESPACE. · **I/O:** funnels → `mechanisms-tally.json` · **step:** S1/S2 · **health:** untested

---

## 6. ASSET PIPELINE (build a landing page)

### `asset-fetch` · `engine/bricks/asset-fetch.js`
- **does:** globs local *.jpg/png/mp4 → copies to `assets/raw/` → spawns `probe.py` per image (EXIF/phash/downscale) → `raw-manifest.json`. (`path.resolve(__dirname,'asset','probe.py')` — preserved by structure-keeping move.)
- **I/O:** `--local=<dir>` → `assets/raw/*` + `raw-manifest.json` · **deps:** py via spawnSync · **step:** S6 build (PROVISIONAL) · **health:** untested

### `asset/probe.py` · `engine/bricks/asset/probe.py` — image EXIF+phash+downscale+dedupe · deps: Pillow, imagehash
### `asset/probe_video.py` · `engine/bricks/asset/probe_video.py` — video metadata (duration/res/fps/codec/audio/oversize) · deps: imageio-ffmpeg
### `asset/frame-grab.py` · `engine/bricks/asset/frame-grab.py` — hero frame extract; HDR→SDR tonemap; crop · deps: imageio-ffmpeg
### `asset/sample_montage.py` · `engine/bricks/asset/sample_montage.py` — contact-sheet from frames
### `asset-map-rank` · `engine/bricks/asset-map-rank.js` — routes demonstrated[] claims to sections/slots → `ranked.json`
### `asset-emit` · `engine/bricks/asset-emit.js` — writes `images.json`/`videos.json` + IMAGES.md/VIDEOS.md
- all **step:** S6 build (PROVISIONAL) · **health:** untested · **enforced-by:** `validate-asset-record.js`

---

## 7. PRODUCT VIDEO

### `product-video-assemble` · `engine/bricks/asset/video-assemble.py`
- **does:** EDL-based hero video assembly; HDR→SDR tonemap, center-crop FILL, FPS normalize, concat + fade → silent MP4.
- **I/O:** `hero-edl.json` → `runs/<space>/asset-classify/cuts/<name>.mp4` · **deps:** imageio-ffmpeg · **step:** S6 (PROVISIONAL) · **health:** untested

---

## 8. SHOPIFY (implement a store)

### `shopify-deploy` · `engine/integrations/shopify/shopify-deploy-funnel.js`
- **does:** multipage HTML funnel → Liquid templates + Online Store pages; rewrites asset paths local→CDN; pushes via Theme Asset API (curl).
- **I/O:** HTML funnel + url-map.json → Shopify theme + pages · **creds:** `--creds=<path>` (SEAM — currently `__dirname` `.shopify-creds.json`; left at `runs/arduview/_tooling/`) · **step:** S7 deploy · **health:** untested
### `shopify-upload-assets` · `engine/integrations/shopify/shopify-upload-assets.js` — stagedUploads → multipart → fileCreate → CDN poll → `url-map.json`
### `asset-upload` · `engine/bricks/asset-upload.js` — generic Shopify Files uploader (3-step flow)
- **creds:** Shopify (seam) · **health:** untested

---

## 9. AUTOMATION / DEPLOY / DNS / EMAIL

### `chrome-cdp` · drive real Windows Chrome from WSL
- **files:** `engine/integrations/cdp/{cdp.cjs,drive.cjs,clickxy.cjs,win-chrome-forwarder.py}`
- **does:** cdp.cjs = raw CDP/WebSocket driver (robust); drive.cjs = Playwright connectOverCDP; clickxy.cjs = real mouse events for Polaris; forwarder bridges WSL→Windows-loopback Chrome.
- **run:** Windows Chrome `--remote-debugging-port=9333` + `win-chrome-forwarder.py`; then `node engine/integrations/cdp/cdp.cjs goto <url>` · **deps:** env:`CDP_HOST/PORT` (Windows-only forwarder) · **health:** untested

### `surge-deploy` · `engine/integrations/surge/surge_drive.py` — pty-driven `npx surge` with auto-filled creds → live surge.sh · **health:** untested
### `cloudflare-dns` · `engine/integrations/cloudflare/{cf.js,cf-migrate-dns.js}` — REST client + idempotent DNS reconciler · creds: `.cloudflare-creds.json`/`CF_TOKEN` (seam) · **health:** untested
### `klaviyo` · `engine/integrations/klaviyo/kl.js` — minimal Klaviyo API client · creds: `.klaviyo-*.json` (seam) · **health:** untested

---

## 10. FIRING MECHANICS (hooks — how prompts are gated)

### `route` · `engine/hooks/route.js` — PostToolUse dispatcher; filename → validator (via `__dirname`). Registered in `.claude/settings.json`.
### Validators (`engine/hooks/validate-*.js`, exit 0 pass / 2 reject; import `../contracts/enums.json` after H0):
- `validate-finder.js` (brands.json: CHANNEL/LANE, url/sells) · `validate-dumper.js` (no-classify + verbatim-substring) · `validate-classifier.js` (space-map: per-cell saturation, CLAIM_TYPE, traceability) · `validate-analyzer.js` (belief records: verbatim_refs, enums, BELIEF_KIND) — **OPEN: not wired into route.js / SKILL** `ERROR-NOTES.md#analyzer-unwired` · `validate-asset-record.js` · `validate-revenue.js`
### Injectors (`engine/hooks/inject-*-dr.js` — DR-context bundlers):
- `inject-dr.js` (section-analyzer), `inject-market-selection-dr.js`, `inject-funnel-architect-dr.js`, `inject-copywriter-dr.js` → write `prompts/_generated/*` or `_dr-context.generated-*.md`; orchestrator embeds bytes (hooks don't fire in subagents).

---

## 11. AUDIT TOOLING (pipeline-audit skill support)

- `engine/bricks/audit-inject.js` — assembles cold-context (LAW+EVIDENCE+no-search) per reviewer
- `engine/bricks/audit-resolve.js` — resolves fixed evidence manifest to on-disk paths
- `engine/bricks/validate-receipt.js` — receipt-vs-manifest gate (re-spawn on mismatch)
- `engine/bricks/validate-strip.js` — strip-for-b output gate
- **health:** untested · **note:** referenced by `.claude/skills/pipeline-audit/SKILL.md` (path refs need updating post-reorg — operator rewrite)

---

## Gaps / loose ends (for the rebuild)
- **Cred seam** (shopify/cloudflare/klaviyo/surge): scripts read creds via `__dirname`; promoted to `engine/integrations/` but creds left at `runs/arduview/_tooling/`. Parameterize to `--creds=<path>` during rebuild (H4).
- **Skill path refs:** marketing SKILLs (asset-classify, funnel-deep-pass, pipeline-audit) reference `tools/...` paths that moved → update during the marketing rewrite.
- **`asset-record.schema.json`** is PARTIAL (enum refs only) — full shape extraction = H0.
- **No generic web search** — fetch is branded-site/crowdfund/ad-library only.
- **`reddit dump.mjs`** indexed in place (skill-co-located), not moved to `engine/`.
