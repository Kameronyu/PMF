# Architecture — PMF Engine

**Analysis Date:** 2026-06-26

## Pattern Overview

**Overall:** Deterministic brick-and-firing-layer pipeline. The engine is **wiring substrate** — proven, non-marketing, mechanical transformations (fetch/clean/score/vectorize/deploy) and the firing layer (validators, router, DR bundlers) that orchestrates them safely.

**Key Characteristics:**
- No LLM inside any brick (pure deterministic scripts per CLAUDE.md one-job rule)
- Firing layer gates every agent output: per-agent validators, path-based router, DR-context bundlers
- Credential seam: all integrations accept `--creds` or env, never hardcoded secrets
- Per-run artifact store: `runs/<space>/` is the deterministic namespace; no re-runs overwrite v1 (no-overwrite-v1 convention)
- Two-currency scoring: ad-fed and crowdfunding funnels never forced into one metric
- Security guards: path sanitization (T-03-13), off-limits firewall (on-disk deny-list), prompt-injection defense (funnel body as inert data)

## Layers

**FETCH Layer (S1 light-pass):**
- Purpose: Acquire raw data from the web (brand homepages, LP paths, Google Trends, Meta ad library, crowdfunding campaigns, Reddit threads)
- Location: `engine/bricks/{fetch,crowdfund-fetch,adlib-one,adlib-sweep}.js` · `engine/skills/reddit-extract/dump.mjs`
- Contains: Playwright-driven HTTP fetchers, Trends demand-shape classifier (arithmetic), Reddit thread expander (real-browser same-origin API calls)
- Depends on: node:playwright, dns module, optional Google Trends consent-warm strategy
- Used by: Orchestrator as the entry point for brand research; outputs raw HTML, JSON ads, Reddit markdown
- **No judgment:** all fetchers are deterministic scripts with documented fallbacks (graceful degradation on SSRF/403)

**CLEAN / NORMALIZE Layer (S1-S2):**
- Purpose: Strip boilerplate, normalize structure, mark sections; prepare inputs for downstream agents
- Location: `engine/bricks/{clean,funnel-clean,dedupe}.js`
- Contains: HTML→markdown (script/nav/footer/cookie strip), funnel section-marker (verbatim markdown `[SECTION]` labels per funnel-clean.js h6 fix), brand dedup (domain-collision resolution)
- Depends on: none (pure text transform)
- Used by: Dumper agent (raw markdown), analyzer (cleaned funnels)
- **Pattern:** Tolerant parse (missing/malformed = sensible defaults, no throws); verbatim copy preserved for RAG-readiness

**FUNNEL PIPELINE Layer (S2 deep-pass):**
- Purpose: Score, store, and prepare funnels for belief analysis; implement two-currency validation
- Location: `engine/bricks/funnel-{assemble,score,store,claim-tally,analyzer-context}.js`
- Contains:
  - `funnel-assemble.js`: URL normalization (strip utm/fbclid), ad-clustering (shared destination → one funnel package), SSRF-guard fallback, deterministic funnel_id=sha1(competitor|url)
  - `funnel-score.js`: Two-currency validator (ad-fed: duration×impression×variant; crowdfunding: raised+backers+delivered) — never normalized to one number per D-09
  - `funnel-store.js`: Per-funnel JSON writer under `runs/<space>/funnels/<funnel_id>.json` with 6a fields + belief_records[] (RAG-ready but not vectorized)
  - `funnel-claim-tally.js`: Saturation pre-pass (move-tag frequency across funnels → DEAD-GROUND vs WHITESPACE)
  - `funnel-analyzer-context.js`: Assembles ONE context block [DR bundle from inject-dr.js] + [cleaned funnel body] — passes bytes to analyzer, not Read instructions
- Depends on: `funnel-clean.js` output, `inject-dr.js` (spawned), validation from `validate-analyzer.js`
- Used by: Orchestrator to flow ads through to beliefs; downstream Section Analyzer and Copywriter
- **Materialization:** Every funnel is persisted (weak funnels included); "birdseye sees everything" per D-09 anti-fluke discipline

**EMBEDDINGS / RAG Layer (S2→S4):**
- Purpose: Index belief records for semantic retrieval; support copywriter with contextual wins
- Location: `engine/bricks/lib/embed.js` (swap-point), `engine/bricks/funnel-{vectorize,rag-query}.js`
- Contains:
  - `embed.js`: Voyage REST or FNV-1a stub (single swap-point, no code duplication)
  - `funnel-vectorize.js`: JIT index builder from belief_records[] (dim=1024 Voyage); writes `runs/<space>/funnels/_index.json`
  - `funnel-rag-query.js`: Cosine-kNN + structured prefilter (belief_id, proof_tier, source_type, routing_flag) — returns ranked results as injection block or JSON
- Depends on: `$VOYAGE_API_KEY` optional (stub fallback with deterministic hash)
- Used by: Copywriter (via orchestrator funnel-rag-query call) for semantic belief lookup
- **Determinism:** Index metadata carries `is_stub` flag; query backend must match index backend

**ASSET PIPELINE Layer (S6 build):**
- Purpose: Fetch, probe, classify, rank, and emit images/videos for landing page
- Location: `engine/bricks/asset-{fetch,map-rank,emit}.js` · `engine/bricks/asset/probe.py`, `probe_video.py`, `frame-grab.py`, `sample_montage.py`, `video-assemble.py`
- Contains:
  - `asset-fetch.js` (Node): Glob local assets, spawn `probe.py` per image (EXIF+phash+downscale), write raw-manifest.json
  - `probe.py` (Python): Image EXIF, perceptual hash (imagehash lib), safe-use bucketing (min_safe_use: small/medium/large)
  - `probe_video.py`: Video metadata (duration/res/fps/codec/audio) — deterministic; no frame extraction (per operator, raw material only this pass)
  - `frame-grab.py`, `sample_montage.py`: Hero frame extract, HDR→SDR tonemap, contact-sheet generation (no smoke yet — referenced as raw material per WIRING-BUNDLE)
  - `asset-map-rank.js` (Node): Routes demonstrated[] claims to sections/slots via section-table.json → ranked.json (deterministic section-list join)
  - `asset-emit.js` (Node): Splits images.json/videos.json, writes IMAGES.md/VIDEOS.md with manifests
  - `video-assemble.py`: EDL-based hero video assembly (silent MP4, HDR→SDR, FPS normalize, concat+fade)
- Depends on: Pillow (EXIF/phash), imageio-ffmpeg (bundled ffmpeg, no system ffmpeg), Node spawning Python via explicit `.venv/bin/python` (PEP 668 venv requirement)
- Enforced by: `validate-asset-record.js` (image/video record shape + enums: SHOT_TYPE, DISQUALIFIER, ASSET_STRENGTH, BEST_USE, DISPLAY_STATE)
- Used by: Landing Page Builder (downstream) — reads images.json/videos.json + IMAGES.md/VIDEOS.md
- **Pattern:** Node orchestrates, Python handles pixels; spawn via explicit venv path (no bare `python3`); JSON on stdout (command-injection guard via argv arrays, no string interpolation, T-16-02)

**REVENUE / MECHANISMS Layer (S1-S2):**
- Purpose: Estimate monthly revenue (traffic formula), tally mechanism saturation
- Location: `engine/bricks/{revenue-est,aggregate-mechanisms-in-play}.js`
- Contains:
  - `revenue-est.js`: Deterministic arithmetic (monthly_visits × cvr=0.02 × aov) → value_usd_monthly or review_proxy fallback; never fabricates
  - `aggregate-mechanisms-in-play.js`: Counts mechanism frequency across brands/funnels → SATURATED/WHITESPACE per differentiator framework (transformation × niche)
- Depends on: monthly_visits feed (upstream wiring gap — an external orchestrator/script must populate this)
- Enforced by: `validate-revenue.js`
- Used by: Space-classifier agent (early saturation signal); operator (prioritize whitespace)
- **Load-bearing constant:** 60-day ad floor (Currency A anti-fluke threshold) — surfaced, never used to gate

**FIRING LAYER (Hooks):**
- Purpose: Gate every agent output safely; bundle DR context deterministically; firewall marketing writes
- Location: `engine/hooks/`
- Contains:
  - **Router** (`route.js`, PostToolUse): Filename-based dispatcher (brands.json→validate-finder+validate-revenue; dump.json→validate-dumper; space-map.json→validate-classifier; *-beliefs.json→validate-analyzer)
  - **Validators** (exit 0 pass / 2 reject): `validate-{finder,dumper,classifier,analyzer,asset-record,revenue}.js` — check enum membership, required fields, verbatim-substring traceability, no-hallucinate constraints
  - **DR Injectors** (`inject-*.js`): `inject-dr.js` (Section Analyzer context), `inject-market-selection-dr.js`, `inject-funnel-architect-dr.js`, `inject-copywriter-dr.js` — bundle DR files via hardcoded allowlist + path-traversal guard; configurable `--dr-dir=<path>` / `$DR_DIR`
  - **Marketing Firewall** (`guard-marketing.js`, PreToolUse, WIRED): Reads `engine/contracts/off-limits.json` deny-list, blocks Write/Edit/MultiEdit to operator-owned paths (definitions.md, workflow.md, marketing-lens/**, runs/*/_marketing-decisions/**)
- Enums: Single source of truth in `engine/contracts/enums.json` (CHANNEL, LANE, CLAIM_TYPE, DEMAND_TREND_SHAPE, EXECUTION_TYPE, PROOF_TIER, MOVE, BELIEF_ID_ANCHORS, BELIEF_KIND, AWARENESS_ENTRY, ROUTING_FLAG, SHOT_TYPE, etc.) — closed value sets; off-enum = hard reject
- **Subagent caveat:** Hooks do NOT fire inside subagents (Section Analyzer, Asset-Classify, etc.); orchestrator must call validators explicitly as steps
- **Contract extraction:** Validators import enums.json after H0 hand-extraction; maps are never hand-maintained (hand-maintained docs drift — registry is generated from brick headers)

**INTEGRATIONS Layer (Deploy / Ops):**
- Purpose: Talk to external services (Shopify, Surge, Cloudflare, Klaviyo, Chrome CDP) safely and reproducibly
- Location: `engine/integrations/{shopify,surge,cloudflare,klaviyo,cdp}/` + shared `lib-creds.js`
- Contains:
  - **Shopify** (`shopify-deploy-funnel.js`, `shopify-upload-assets.js`): Funnel→Liquid templates, multipart asset upload via Theme Asset API, CDN rewrite
  - **Surge** (`surge_drive.py`): pty-driven `npx surge` with auto-filled creds from `$SURGE_EMAIL`/`$SURGE_PW`; refusal logic when unset
  - **Cloudflare** (`cf.js`, `cf-migrate-dns.js`): REST client, idempotent DNS reconciler
  - **Klaviyo** (`kl.js`): Minimal REST API client (email/CRM)
  - **Chrome CDP** (`cdp.cjs`, `drive.cjs`, `clickxy.cjs`, `win-chrome-forwarder.py`): WebSocket-based Chrome DevTools Protocol; Windows-only forwarder (WSL→Windows loopback); real mouse events (clickxy for Polaris)
  - **lib-creds.js**: Shared credential seam — `--creds=<path>` → `env:<VAR>` → `__dirname/.creds.json` (graceful fallback cascade; errors clearly if unset)
- Depends on: External APIs (live; creds from run-supplied flags/env, never committed)
- Used by: Operator runbooks (Shopify deploy, Surge release, DNS migration, Klaviyo sync, RPA)
- **Credential pattern:** 
  - Function signature: `--creds=<path>` (optional, overrides env + homedir fallback)
  - Environment: `$SHOPIFY_CREDS`, `$CF_TOKEN`, `$KLAVIYO_CREDS`, `$SURGE_EMAIL`/`$SURGE_PW`
  - Seam: Parameterized since H4; old `.shopify-creds.json` at `runs/arduview/_tooling/` stays gitignored (reproducible for that run only)

**AUDIT TOOLING Layer:**
- Purpose: Support cold-context review (pipeline-audit skill); resolve evidence manifests; validate receipts/strip output
- Location: `engine/bricks/{audit-inject,audit-resolve,validate-receipt,validate-strip}.js`
- Contains: Context assembler (LAW + EVIDENCE + no-search), manifest resolver (on-disk existence check), receipt gate (context-vs-manifest validation), strip gate (facts-kept/verdicts-gone)
- Used by: `.claude/skills/pipeline-audit/SKILL.md` (referenced; path updates needed post-reorg)

## Data Flow

**Light-Pass (S1) → Fetches:**
1. Operator supplies brand list + brief (run config)
2. `fetch.js` reads `brands.json`, calls homepage + LP-path patterns per brief or defaults
3. Spawns Google Trends (consent-warm + multiline XHR intercept, fill-rate>0 verified)
4. Outputs: `corpus/<slug>/raw/*.html` + enriched `brands.json` with `demand_trend` (shape: steady/rising/parabolic-spike/declining/unknown)
5. `clean.js` strips HTML boilerplate → `corpus/<slug>/clean/*.md` (verbatim copy for dumper agent)
6. `revenue-est.js` applies traffic formula (if monthly_visits fed upstream) → brands.json:value_usd_monthly
7. `dedupe.js` merges domain collisions, unions found_by, keeps richest channel

**Deep-Pass (S2) → Funnels:**
1. Meta ad-fetch (`adlib-one.js` / `adlib-sweep.js`) or operator provides `ads/<slug>.json`
2. `funnel-assemble.js` normalizes URLs (utm strip, D-04 normalization), clusters by destination, generates deterministic funnel_id
3. `funnel-score.js` applies two-currency validation (ad-fed: duration×impression×variant; crowdfunding: raised+backers+delivered+delivered_vs_not)
4. Outputs scored packages to `funnels-scored/`
5. Section Analyzer (subagent, SKILL) receives:
   - Context block from `funnel-analyzer-context.js` = [DR bundle from `inject-dr.js`] + [cleaned funnel body from `funnel-clean.js`]
   - Analyst marks beliefs (6b records: belief_id, belief_kind, execution_type, proof_tier, moves[], awareness_entry, claim_type, verbatim_refs[])
6. Orchestrator runs `validate-analyzer.js` explicitly (hooks don't fire in subagents) → exit 0 (pass) or 2 (reject enum/traceability)
7. `funnel-store.js` combines scored package + belief_records → one `runs/<space>/funnels/<funnel_id>.json` (6a + 6b merged, RAG-ready)
8. `funnel-claim-tally.js` tallies move tags across funnels → `_tally.json` (DEAD-GROUND vs WHITESPACE saturation signal)

**Vectorization / RAG (S2→S4):**
1. `funnel-vectorize.js` reads all funnel files, embeds belief_records[] bodies (Voyage or FNV-1a stub)
2. Builds `runs/<space>/funnels/_index.json` with metadata (_meta.is_stub flag for backend matching)
3. Copywriter (subagent, SKILL) calls `funnel-rag-query.js` with a section query (e.g., "frame the offer")
4. RAG returns top-N ranked beliefs with prefilter (belief_id, proof_tier, source_type, routing_flag) + semantic ranking
5. Copywriter receives results as injection block (via orchestrator stdout/file redirect)

**Asset Classification (S6 build):**
1. Operator supplies local asset dir (images/videos) or remote fetch (Drive/URL)
2. `asset-fetch.js` globs *.jpg/png/mp4 → `assets/raw/` + spawns `probe.py` per image
3. `probe.py` outputs JSON (EXIF, perceptual hash, safe-use bucket) → aggregates into `raw-manifest.json`
4. Asset agents (subagents, SKILL, offline) classify each image/video:
   - Image agent: reads image file + probe output → demonstrates[] (claim, strength, shot_type)
   - Video agent: calls `frame-grab.py` (hero frame extract) + `sample_montage.py` (contact sheet) → comprehend-video reads frames → records (motion_value, segments, best_use)
5. Orchestrator runs `validate-asset-record.js` explicitly → exit 0 (pass) or 2 (reject)
6. `asset-map-rank.js` joins records via section-table.json → routes claims to sections/slots → `ranked.json`
7. `asset-emit.js` splits images.json/videos.json → IMAGES.md/VIDEOS.md (manifests for LP Builder)
8. (Optional) `video-assemble.py` builds hero video from EDL

**Deployment (S7):**
1. LP Builder agent (subagent, low-fidelity, offline, SKILL) produces HTML funnel
2. `shopify-deploy-funnel.js` converts HTML → Liquid templates + Shopify pages + theme
3. `shopify-upload-assets.js` uploads images/videos via staged uploads → CDN → writes `url-map.json`
4. Operator runs `surge_drive.py` (pty-driven) → publishes site to surge.sh
5. Operator runs `cf-migrate-dns.js` or `clickxy.cjs` (Chrome CDP) for post-deploy automation

## State Management

**Run-space convention (no-overwrite-v1):**
- Every `runs/<space>/` directory is the per-run artifact store
- Committed outputs (funnels, assets, site, logs) are never mutated in place
- Re-runs write versioned subdirs (e.g., `v2/`) or `-v2` suffixes for audit trail
- Logs/scratch (gitignored) are exempted; in-flight uncommitted work is exempted

**Persistence contracts:**
- Brand data: `brands.json` (enriched in-place with demand_trend + revenue_est)
- Corpus: `corpus/<slug>/raw/*.html` (raw fetches) and `corpus/<slug>/clean/*.md` (normalized)
- Funnels: `runs/<space>/funnels/<funnel_id>.json` (one file per funnel, 6a + 6b merged)
- Index: `runs/<space>/funnels/_index.json` (vectorized belief records; metadata carries is_stub flag)
- Assets: `runs/<space>/asset-classify/*.json` (image/video records) + `images.json`, `videos.json` + `IMAGES.md`, `VIDEOS.md`
- Tally: `runs/<space>/funnels/_tally.json` (saturation pre-pass summary; golden-compare smoke at h6-claim-tally.sh)
- Logs: `corpus/_fetch-log.txt`, `funnels/_funnel-store-log.txt` (sidecar logs; gitignored)

**Schema enforcement:**
- `engine/contracts/enums.json`: Single source of truth for closed value sets (CHANNEL, BELIEF_KIND, EXECUTION_TYPE, etc.)
- `engine/contracts/schemas/*.schema.json`: Field shapes (brands.schema.json, belief-record.schema.json, funnel-fields.schema.json, etc.)
- Semantic rules (verbatim-substring, traceability, no-hallucinate) live in validators (intentionally not duplicated in schemas)

## Entry Points

**CLI entry points (deterministic scripts):**
- `node engine/bricks/fetch.js --space=<space>` — fetch brands, trends, LP paths
- `node engine/bricks/clean.js --in=<corpus> --out=<corpus>` — clean HTML to markdown
- `node engine/bricks/funnel-assemble.js <ads.json> --out=<dir>` — cluster ads into funnel packages
- `node engine/bricks/funnel-score.js <funnel-pkg.json> [--out=<dir>]` — apply two-currency validation
- `node engine/bricks/funnel-store.js --space=<space> --dir=<funnels> --beliefs-dir=<records>` — merge and persist funnels
- `node engine/bricks/funnel-analyzer-context.js --funnel=<id> --space=<space>` — assemble analyzer context block
- `node engine/bricks/funnel-vectorize.js --space=<space>` — build belief index
- `node engine/bricks/funnel-rag-query.js --space=<space> --query="<text>"` — retrieve ranked beliefs
- `node engine/bricks/asset-fetch.js --local=<dir> --out=<dir>` — fetch + probe local assets
- `node engine/bricks/asset-map-rank.js --space=<space>` — route claims to sections
- `node engine/bricks/asset-emit.js --space=<space>` — emit images.json/videos.json manifests

**Hook entry points (fired by Claude Code settings.json):**
- `node engine/hooks/guard-marketing.js` (PreToolUse) — firewall writes to off-limits paths
- `node engine/hooks/route.js "<path>"` (PostToolUse) — dispatch to per-agent validators
- Validators: `validate-{finder,dumper,classifier,analyzer,asset-record,revenue}.js`
- Injectors: `inject-{dr,market-selection-dr,funnel-architect-dr,copywriter-dr}.js`

**Skill entry points (orchestrator or subagent slash-commands):**
- `.claude/skills/reddit-extract/SKILL.md` → `node dump.mjs <url>` — extract Reddit thread
- `.claude/skills/asset-classify/SKILL.md` → image/video agents (offline, no firing-layer hooks)
- `.claude/skills/funnel-deep-pass/SKILL.md` → orchestrator runs Section Analyzer subagent (validates explicitly)

## Error Handling

**Strategy:** Fail noisily with clear exit codes; never fabricate missing data; graceful degradation on network/external-service errors.

**Patterns:**
- **Path errors (exit 1):** Bad usage, missing required args, file not found, sanitize-to-empty
- **Validation errors (exit 2):** Off-enum values, missing required fields, hallucinated content, traceability violation
- **Network/transient errors (exit 1 or graceful fallback):**
  - SSRF loopback rejected → `landing_page_body: null`, batch survives (funnel-assemble.js)
  - Google Trends consent-cold → retry with NID/SOCS cookies (f2c6555 fix)
  - Trends 0% fill → graceful exit 0 (D-16 tolerant parse — default shape = 'unknown')
  - Reddit headless fingerprint → retry headed (6dc6a30 fix); headless AWS IP still rate-limits under load (R6 deferred, needs OAuth)
  - Meta ad-library typeahead no candidates headless → documented gap (#adlib-typeahead-resolve); workaround: forcedPageId or CDP
- **Data integrity (never silence):**
  - Empty vectors after embedding → marked with `_warn` metadata
  - Null technical{} from probe.py → exit 2 (refuse to fabricate)
  - Funnel-store sanitize-to-empty → exit 1 (do not persist hostile path)
  - Belief without verbatim_refs[] → rejected by validate-analyzer.js (traceability)

**Doctor patterns (existing fixes):**
- `#funnel-score-input` (30415ef): required-field check + alias recovery + all-null reject
- `#trends-0pct-fill` (f2c6555): consent-warm (NID/SOCS) + multiline XHR intercept; fill-rate>0 verified
- `#funnel-clean-md-headings` (3d70cb4): HTML `<h1-4>` → `[SECTION]` marker; `.md` `##` headings now handled
- `#funnel-analyzer-context-injectdr-path` (this session): spawn path was `engine/bricks/hooks/` (broken) → `../hooks/`
- `#asset-map-rank-section-path` (this session): section-table resolved via pre-reorg `tools/asset/` → fixed to `__dirname/asset/`
- `#cred-seam` (5facb30, H4): integrations now read creds via `--creds` → env → `__dirname` (no hardcoded paths)
- `#reddit-extract-fingerprint` (6dc6a30): headless → headed by default + retry-on-403; AWS datacenter IP still rate-limits (R6: needs OAuth)
- `#adlib-typeahead-resolve` (OPEN): headless advertiser-pick returns no candidates; workaround: forcedPageId or CDP

## Cross-Cutting Concerns

**Logging:**
- Approach: Sidecar files (`_fetch-log.txt`, `_funnel-store-log.txt`) + stderr for errors/warnings
- Pattern: `console.log()` for progress, `console.error()` for issues; sidecar aggregates summary (count, timing, errors)
- Dry-run support: `--dry-run` flag prints intent without side effects

**Validation:**
- Approach: Per-agent validators (exit 0 pass / 2 reject) + semantic rules in validator source (not duplicated in JSON schema)
- Enums: `engine/contracts/enums.json` (single source of truth, imported by all validators)
- Contracts: `engine/contracts/schemas/*.schema.json` (field shapes; semantic rules live in validator code)

**Authentication / Credentials:**
- Approach: `lib-creds.js` seam — `--creds=<path>` (flag) → `env:<VAR>` (environ) → `__dirname/.creds.json` (homedir fallback)
- Never in code: No hardcoded API keys, no `.env` files read directly (externalize everything)
- Per-run: Old creds stay at `runs/arduview/_tooling/` (gitignored, reproducible for that run only)

**Security (T-03-13, T-16-02, prompt-injection defense):**
- Path sanitization: funnel-store.js and funnel-analyzer-context.js sanitize all path segments to `[a-z0-9._-]`; strip `/` and `..`
- Command injection: Spawn Python bricks with argv arrays only (no string interpolation); PEP 668 venv enforcement
- Prompt injection: Funnel body preserved VERBATIM in `<funnel_copy>` tags (inert data, analyzer prompt instructs model to ignore)
- Deny-list firewall: `guard-marketing.js` reads `off-limits.json`, blocks Write/Edit/MultiEdit to operator-owned paths

---

*Architecture analysis: 2026-06-26 (P21-H6 closeout, 26/26 capabilities, 22 working + 1 dry-run + 1 partial + 2 deferred)*
