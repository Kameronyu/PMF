# PMF — project instructions

## Agent design

- **One job per agent, split to the smallest part, and route each job to the right executor.** Deterministic jobs (fetch, clean, dedupe, count/score, store, validate) are scripts/hooks; only judgment jobs (query design, classify, extract, synthesize) are agents. An "agent that cleans data" is a category error.
- Example: "search" splits into query design (agent) + fetch (script); "analyze" splits into classify (agent) + score (script) + synthesize (agent). Cleaning and storing are scripts, never agents.

## Versioning

**no-overwrite-v1 convention** (D-07/D-08/D-09, adopted 2026-06-04):

- **Rule:** A committed run output (any file or directory under `runs/<space>/…`) or an emitted brick is never mutated in place on a re-run. A re-run writes a NEW versioned location (e.g. a `v2/` subdirectory or a `-v2` suffix); v1 stays intact for provenance and diffing.
- **Scope:** Governs committed run outputs + emitted bricks. Does NOT govern logs/scratch (gitignored) or in-flight uncommitted work.
- **Enforcement:** Convention only. A guard hook/script is explicitly DEFERRED — not built yet.

---

<!-- GSD-generated project context (from PROJECT.md + .planning/codebase/). The PMF project instructions ABOVE take precedence over anything below. To refresh: regenerate with `gsd-tools.cjs generate-claude-md` to a temp file, then re-merge under this divider so the PMF header survives. -->

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Marketing Pipeline Shell (Steps 0–10)**

A runnable **shell** of an 11-step agentic marketing pipeline (0 Bet → 1 Collect → 2 Funnel analysis → 3 Space map → 4 VOC market pass → 5 Market selection → 6 VOC deep pass → 7 Funnel architect → 8 Copywriter → 9 Asset classify → 10 Adversarial re-review). The shell is deterministic plumbing — an orchestrator/run-controller, a `runs/<space>/` artifact store, per-step I/O manifests, validators, and operator gates — that runs **end-to-end on stub prompts**. Real prompt bodies and field-level seam schemas are deferred drop-in slots. It is built for the operator (a solo DR marketer) who turns a product *bet* into a written, audited funnel.

**Core Value:** `run all --space=smoke` completes end-to-end on stub prompts with **zero orphan outputs / dangling inputs** — i.e., the inter-step wiring is provably correct, independent of marketing quality. Build mechanism, not content.

### Constraints

- **Tech stack**: Node 20 + Python 3.12 + Playwright (`engine/DEPENDENCIES.md`) — reuse the engine's runtimes; do not introduce a novel stack.
- **Reuse**: assemble existing engine bricks; do not rewrite the fetch/glue (`engine/contracts/REUSE-INDEX.md`).
- **Versioning**: no-overwrite-v1 convention — a committed run output under `runs/<space>/…` or an emitted brick is never mutated in place; a re-run writes a NEW versioned location (v2/), v1 stays intact for provenance.
- **Determinism**: the inter-step artifact flow (which files each step reads/writes) must be deterministic; everything inside a step is a black box (one prompt slot now, may split into N agents later with no wiring change).
- **Architecture precedence**: where an as-ran/pre-R1 brick diverges from architecture intent, the architecture wins.
- **Validation policy**: loose now (presence + declared top-level keys; refuse on missing load-bearing field), tightened later (field-continuity) with no rewiring.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- **JavaScript/Node.js** 20.20.0+ — All orchestration, firing layer, integrations, and deterministic bricks (`engine/bricks/*.js`, `engine/hooks/*.js`, `engine/integrations/**/*.{js,cjs}`)
- **Python** 3.12.3 — Asset processing pipeline (`engine/bricks/asset/*.py`): image probe (dims, perceptual hash, downscale), video frame analysis, montage composition, video assembly
## Runtime
- Node.js 20.20.0+ (pinned in `engine/package.json`, proven against 20.20.0)
- Python 3.12.3 (proven version; install into `.venv`)
- npm (ships with Node 20+)
- pip (Python's package manager)
- Lockfile: `package-lock.json` not present; `engine/package.json` pins single dependency
## Frameworks & Libraries
- **Playwright** 1.59.1 — The only third-party Node dependency. Used by live-DOM fetchers and funnel assemblers:
- **Pillow** 12.2.0 (Python) — Image dimensions, color profiles, downscaling
- **imagehash** 4.3.2 (Python) — Perceptual hash generation for image similarity (`engine/bricks/asset/probe.py`)
- **imageio-ffmpeg** 0.6.0 (Python) — Bundled static ffmpeg binary (no system ffmpeg required). Used by:
- `engine/bricks/lib/embed.js` — Voyage AI embeddings client (optional; VOYAGE_API_KEY for live, stubbed locally)
- `engine/bricks/lib/trends-parse.js` — Google Trends XHR response parser
- `engine/bricks/lib/adlib-graphql.js` — Meta Ad Library GraphQL response extractor
- `engine/integrations/lib-creds.js` — Credentials resolution (CLI flags → env → defaults)
## Testing & Health
- **Location:** `engine/contracts/h6-all.sh` — master smoke runner
- **Health Status (P21-H6, 2026-06-26):** **14/14 green**
- **Fixture-based verification:** All smoke tests run offline against committed fixtures in `engine/_fixture/`
- **Individual smoke commands:**
## Configuration
- **Node venv:** `npm install` in `engine/` directory
- **Python venv:** `python3 -m venv .venv && .venv/bin/pip install -r engine/requirements.txt`
- `engine/bricks/lib/` exports CommonJS modules (no build step)
- Python bricks invoked via explicit venv path: `.venv/bin/python engine/bricks/asset/*.py`
- **DR knowledge dir** — `--dr-dir=<path>` / `$DR_DIR` for `inject-*-dr.js` bundlers
- **Run-space root** — `runs/<space>/` where bricks read/write artifacts
- **Credentials** — surge (`$SURGE_EMAIL`/`$SURGE_PW`), shopify/cloudflare/klaviyo via `--creds=<path>` / env (see INTEGRATIONS.md)
- All Node code is plain ES6 CommonJS (Node 20 native)
- All Python code runs without compilation (`python engine/bricks/asset/*.py`)
- No webpack, Babel, or TypeScript — raw source to execution
## Platform Requirements
- Node.js 20.20.0+
- Python 3.12.3
- Bash (for smoke harness)
- System curl (for Shopify/Cloudflare/Klaviyo REST calls via `execSync` in Node)
- Same runtimes (Node + Python venv)
- Surge.sh account + credentials for static site deploy
- Shopify store + API credentials for theme/page deployment
- Cloudflare zone credentials for DNS management (optional)
- Klaviyo account credentials for email/CRM integration (optional)
- Chrome with `--remote-debugging-port=9333` for CDP (Windows only; WSL bridge available)
## Dependency Notes
- `engine/package.json` declares only `playwright@1.59.1`
- All other Node work uses Node built-ins: `fs`, `path`, `crypto`, `http`, `https`, `net`, `dns`, `os`, `child_process`
- No express, no async libraries, no ORM
- Playwright is locked; no semver ranges
- `imageio-ffmpeg` bundles a static ffmpeg binary (`imageio_ffmpeg.get_ffmpeg_exe()`)
- No system ffmpeg binary required
- Supports cross-platform video operations (SDR only; HDR support deferred)
- All integrations use `lib-creds.js` for unified creds resolution:
- No credentials committed to repo
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- S-brick naming: `<domain>-<verb>.js` (verb from approved verb set)
- Examples: `clean.js`, `funnel-store.js`, `asset-emit.js`, `funnel-analyzer-context.js`, `audit-inject.js`
- Approved verbs: `fetch`, `clean`, `dedupe`, `normalize`, `assemble`, `score`, `store`, `vectorize`, `query`, `tally`, `emit`, `rank`, `upload`, `estimate`, `probe`, `grab`, `deploy`, `drive`, `route`, `validate`, `inject`, `resolve`
- Pattern: `<domain>_<verb>.py` or `<noun>_<verb>.py` (keep existing snake_case convention)
- Examples: `probe.py`, `probe_video.py`, `frame-grab.py`, `video-assemble.py`
- Pattern: `validate-<producer>.js` where producer is the agent/brick whose output it gates
- Examples: `validate-finder.js`, `validate-analyzer.js`, `validate-dumper.js`, `validate-classifier.js`, `validate-revenue.js`, `validate-asset-record.js`
- Pattern: `inject-<consumer>-dr.js` where consumer is the agent the bundle feeds
- Examples: `inject-dr.js`, `inject-funnel-architect-dr.js`, `inject-market-selection-dr.js`, `inject-copywriter-dr.js`
- camelCase throughout
- Descriptive names: `normalizeHost`, `stripToText`, `sanitizePathSegment`, `spawnSync`
- Prefix pattern for utilities: `sanitizePathSegment()` for path validation, `normalizeHost()` for URL normalization
- UPPER_SNAKE for enum values: `CHANNEL_RANK`, `THRESHOLD`, `ENUMS`, `CHANNEL_ENUM`, `LANE_ENUM`
- Schema/record types: kebab-case in file names, flat JSON object properties with underscore prefix for meta: `_provenance`, `_note`, `_meta`, `_clean-log.txt`
## Code Style
- No formal linter configured; conventions are pattern-based
- Indentation: 2 spaces (Node.js conventional)
- Semicolon use: present; statement-closing style
- Line length: no enforced limit observed; pragmatic wrapping
- Header blocks on every brick with `// @capability`, `// @step`, `// @brick`, `// @inputs`, `// @outputs`, `// @consumers`, `// @run`, `// @deps`, `// @flags` keys (machine-parseable)
- Inline comments for non-obvious logic (regex patterns, algorithms, security decisions)
- Comments reference design docs/decisions: `(T-01-05 mitigated)`, `(D-16)`, `(D-17 determinism closure)`, `(T-03-13)` (issue/decision tracking)
- Prefix with tool/context: `[clean]`, `[funnel-clean]`, `ERROR:`, `REJECT:`
- Terse: `[clean] ERROR: cannot read corpus dir ${inBase} — ${e.message}`
- Validators output `REJECT:` on exit 2; callers output descriptive message
## Import Organization
- No aliases used; relative path requires are standard (`../contracts/`, `./lib/embed`)
- Works because files are co-located and `__dirname` is preserved on relocation
## Error Handling
- Per-file try/catch in batch loops — one bad file does NOT abort the batch
- Exit codes: `0` = success, `1` = fatal error (abort), `2` = validation reject (specific, gated)
- Never swallow exceptions silently; always log to stderr with context
- Python: Never swallow exceptions on PIL/subprocess errors
- Exit 0 = pass (output valid)
- Exit 2 = reject (specific validation failure, names the issue in stderr)
- Fail-open on missing deny-list (marketing firewall reads off-limits.json)
## Logging
- Progress markers: `[tool] action: result` format
- Sidecar logs: tools write `_<tool>-log.txt` alongside output (e.g., `_clean-log.txt`, `_funnel-store-log.txt`)
- One-line summaries for start/end of a smoke:
## Module Design
- Single executable per brick (#!/usr/bin/env node or shebang)
- No module.exports used; bricks are CLI tools, not libraries
- Hooks are CLI tools called by the firing layer, not required by other code
- No index.js or barrel pattern observed in `engine/`
- Each brick is self-contained
## Closed Vocabularies (Enums)
- VALUE SETS (in enums.json) = wiring (frozen by engine)
- VALUE MEANINGS (in prompts) = marketing (live in operator's prompts/definitions)
## Schemas (JSON validation)
## Security Patterns
- Function: `sanitizePathSegment()`
- Rule: Only `[a-z0-9._-]` allowed; strip `/` and `..`
- Applied to: `funnel_id`, `space`, any user-derived path segment before write
- Funnel body (third-party scraped content) is preserved VERBATIM inside analyzer context boundaries (prompt injection defense)
- Comment: `(prompt injection defense, funnel-deep-pass.md lines 268-277)`
- Integrations take `--creds=<path>` flag or env var, defaulting to none
- Secrets stay in `.gitignore` (e.g., `runs/arduview/_tooling/.shopify-creds.json`)
- Code is generic; secrets are run-supplied at invocation time
## Machine-Parseable Headers (Registry Contract)
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- No LLM inside any brick (pure deterministic scripts per CLAUDE.md one-job rule)
- Firing layer gates every agent output: per-agent validators, path-based router, DR-context bundlers
- Credential seam: all integrations accept `--creds` or env, never hardcoded secrets
- Per-run artifact store: `runs/<space>/` is the deterministic namespace; no re-runs overwrite v1 (no-overwrite-v1 convention)
- Two-currency scoring: ad-fed and crowdfunding funnels never forced into one metric
- Security guards: path sanitization (T-03-13), off-limits firewall (on-disk deny-list), prompt-injection defense (funnel body as inert data)
## Layers
- Purpose: Acquire raw data from the web (brand homepages, LP paths, Google Trends, Meta ad library, crowdfunding campaigns, Reddit threads)
- Location: `engine/bricks/{fetch,crowdfund-fetch,adlib-one,adlib-sweep}.js` · `engine/skills/reddit-extract/dump.mjs`
- Contains: Playwright-driven HTTP fetchers, Trends demand-shape classifier (arithmetic), Reddit thread expander (real-browser same-origin API calls)
- Depends on: node:playwright, dns module, optional Google Trends consent-warm strategy
- Used by: Orchestrator as the entry point for brand research; outputs raw HTML, JSON ads, Reddit markdown
- **No judgment:** all fetchers are deterministic scripts with documented fallbacks (graceful degradation on SSRF/403)
- Purpose: Strip boilerplate, normalize structure, mark sections; prepare inputs for downstream agents
- Location: `engine/bricks/{clean,funnel-clean,dedupe}.js`
- Contains: HTML→markdown (script/nav/footer/cookie strip), funnel section-marker (verbatim markdown `[SECTION]` labels per funnel-clean.js h6 fix), brand dedup (domain-collision resolution)
- Depends on: none (pure text transform)
- Used by: Dumper agent (raw markdown), analyzer (cleaned funnels)
- **Pattern:** Tolerant parse (missing/malformed = sensible defaults, no throws); verbatim copy preserved for RAG-readiness
- Purpose: Score, store, and prepare funnels for belief analysis; implement two-currency validation
- Location: `engine/bricks/funnel-{assemble,score,store,claim-tally,analyzer-context}.js`
- Contains:
- Depends on: `funnel-clean.js` output, `inject-dr.js` (spawned), validation from `validate-analyzer.js`
- Used by: Orchestrator to flow ads through to beliefs; downstream Section Analyzer and Copywriter
- **Materialization:** Every funnel is persisted (weak funnels included); "birdseye sees everything" per D-09 anti-fluke discipline
- Purpose: Index belief records for semantic retrieval; support copywriter with contextual wins
- Location: `engine/bricks/lib/embed.js` (swap-point), `engine/bricks/funnel-{vectorize,rag-query}.js`
- Contains:
- Depends on: `$VOYAGE_API_KEY` optional (stub fallback with deterministic hash)
- Used by: Copywriter (via orchestrator funnel-rag-query call) for semantic belief lookup
- **Determinism:** Index metadata carries `is_stub` flag; query backend must match index backend
- Purpose: Fetch, probe, classify, rank, and emit images/videos for landing page
- Location: `engine/bricks/asset-{fetch,map-rank,emit}.js` · `engine/bricks/asset/probe.py`, `probe_video.py`, `frame-grab.py`, `sample_montage.py`, `video-assemble.py`
- Contains:
- Depends on: Pillow (EXIF/phash), imageio-ffmpeg (bundled ffmpeg, no system ffmpeg), Node spawning Python via explicit `.venv/bin/python` (PEP 668 venv requirement)
- Enforced by: `validate-asset-record.js` (image/video record shape + enums: SHOT_TYPE, DISQUALIFIER, ASSET_STRENGTH, BEST_USE, DISPLAY_STATE)
- Used by: Landing Page Builder (downstream) — reads images.json/videos.json + IMAGES.md/VIDEOS.md
- **Pattern:** Node orchestrates, Python handles pixels; spawn via explicit venv path (no bare `python3`); JSON on stdout (command-injection guard via argv arrays, no string interpolation, T-16-02)
- Purpose: Estimate monthly revenue (traffic formula), tally mechanism saturation
- Location: `engine/bricks/{revenue-est,aggregate-mechanisms-in-play}.js`
- Contains:
- Depends on: monthly_visits feed (upstream wiring gap — an external orchestrator/script must populate this)
- Enforced by: `validate-revenue.js`
- Used by: Space-classifier agent (early saturation signal); operator (prioritize whitespace)
- **Load-bearing constant:** 60-day ad floor (Currency A anti-fluke threshold) — surfaced, never used to gate
- Purpose: Gate every agent output safely; bundle DR context deterministically; firewall marketing writes
- Location: `engine/hooks/`
- Contains:
- Enums: Single source of truth in `engine/contracts/enums.json` (CHANNEL, LANE, CLAIM_TYPE, DEMAND_TREND_SHAPE, EXECUTION_TYPE, PROOF_TIER, MOVE, BELIEF_ID_ANCHORS, BELIEF_KIND, AWARENESS_ENTRY, ROUTING_FLAG, SHOT_TYPE, etc.) — closed value sets; off-enum = hard reject
- **Subagent caveat:** Hooks do NOT fire inside subagents (Section Analyzer, Asset-Classify, etc.); orchestrator must call validators explicitly as steps
- **Contract extraction:** Validators import enums.json after H0 hand-extraction; maps are never hand-maintained (hand-maintained docs drift — registry is generated from brick headers)
- Purpose: Talk to external services (Shopify, Surge, Cloudflare, Klaviyo, Chrome CDP) safely and reproducibly
- Location: `engine/integrations/{shopify,surge,cloudflare,klaviyo,cdp}/` + shared `lib-creds.js`
- Contains:
- Depends on: External APIs (live; creds from run-supplied flags/env, never committed)
- Used by: Operator runbooks (Shopify deploy, Surge release, DNS migration, Klaviyo sync, RPA)
- **Credential pattern:** 
- Purpose: Support cold-context review (pipeline-audit skill); resolve evidence manifests; validate receipts/strip output
- Location: `engine/bricks/{audit-inject,audit-resolve,validate-receipt,validate-strip}.js`
- Contains: Context assembler (LAW + EVIDENCE + no-search), manifest resolver (on-disk existence check), receipt gate (context-vs-manifest validation), strip gate (facts-kept/verdicts-gone)
- Used by: `.claude/skills/pipeline-audit/SKILL.md` (referenced; path updates needed post-reorg)
## Data Flow
## State Management
- Every `runs/<space>/` directory is the per-run artifact store
- Committed outputs (funnels, assets, site, logs) are never mutated in place
- Re-runs write versioned subdirs (e.g., `v2/`) or `-v2` suffixes for audit trail
- Logs/scratch (gitignored) are exempted; in-flight uncommitted work is exempted
- Brand data: `brands.json` (enriched in-place with demand_trend + revenue_est)
- Corpus: `corpus/<slug>/raw/*.html` (raw fetches) and `corpus/<slug>/clean/*.md` (normalized)
- Funnels: `runs/<space>/funnels/<funnel_id>.json` (one file per funnel, 6a + 6b merged)
- Index: `runs/<space>/funnels/_index.json` (vectorized belief records; metadata carries is_stub flag)
- Assets: `runs/<space>/asset-classify/*.json` (image/video records) + `images.json`, `videos.json` + `IMAGES.md`, `VIDEOS.md`
- Tally: `runs/<space>/funnels/_tally.json` (saturation pre-pass summary; golden-compare smoke at h6-claim-tally.sh)
- Logs: `corpus/_fetch-log.txt`, `funnels/_funnel-store-log.txt` (sidecar logs; gitignored)
- `engine/contracts/enums.json`: Single source of truth for closed value sets (CHANNEL, BELIEF_KIND, EXECUTION_TYPE, etc.)
- `engine/contracts/schemas/*.schema.json`: Field shapes (brands.schema.json, belief-record.schema.json, funnel-fields.schema.json, etc.)
- Semantic rules (verbatim-substring, traceability, no-hallucinate) live in validators (intentionally not duplicated in schemas)
## Entry Points
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
- `node engine/hooks/guard-marketing.js` (PreToolUse) — firewall writes to off-limits paths
- `node engine/hooks/route.js "<path>"` (PostToolUse) — dispatch to per-agent validators
- Validators: `validate-{finder,dumper,classifier,analyzer,asset-record,revenue}.js`
- Injectors: `inject-{dr,market-selection-dr,funnel-architect-dr,copywriter-dr}.js`
- `.claude/skills/reddit-extract/SKILL.md` → `node dump.mjs <url>` — extract Reddit thread
- `.claude/skills/asset-classify/SKILL.md` → image/video agents (offline, no firing-layer hooks)
- `.claude/skills/funnel-deep-pass/SKILL.md` → orchestrator runs Section Analyzer subagent (validates explicitly)
## Error Handling
- **Path errors (exit 1):** Bad usage, missing required args, file not found, sanitize-to-empty
- **Validation errors (exit 2):** Off-enum values, missing required fields, hallucinated content, traceability violation
- **Network/transient errors (exit 1 or graceful fallback):**
- **Data integrity (never silence):**
- `#funnel-score-input` (30415ef): required-field check + alias recovery + all-null reject
- `#trends-0pct-fill` (f2c6555): consent-warm (NID/SOCS) + multiline XHR intercept; fill-rate>0 verified
- `#funnel-clean-md-headings` (3d70cb4): HTML `<h1-4>` → `[SECTION]` marker; `.md` `##` headings now handled
- `#funnel-analyzer-context-injectdr-path` (this session): spawn path was `engine/bricks/hooks/` (broken) → `../hooks/`
- `#asset-map-rank-section-path` (this session): section-table resolved via pre-reorg `tools/asset/` → fixed to `__dirname/asset/`
- `#cred-seam` (5facb30, H4): integrations now read creds via `--creds` → env → `__dirname` (no hardcoded paths)
- `#reddit-extract-fingerprint` (6dc6a30): headless → headed by default + retry-on-403; AWS datacenter IP still rate-limits (R6: needs OAuth)
- `#adlib-typeahead-resolve` (OPEN): headless advertiser-pick returns no candidates; workaround: forcedPageId or CDP
## Cross-Cutting Concerns
- Approach: Sidecar files (`_fetch-log.txt`, `_funnel-store-log.txt`) + stderr for errors/warnings
- Pattern: `console.log()` for progress, `console.error()` for issues; sidecar aggregates summary (count, timing, errors)
- Dry-run support: `--dry-run` flag prints intent without side effects
- Approach: Per-agent validators (exit 0 pass / 2 reject) + semantic rules in validator source (not duplicated in JSON schema)
- Enums: `engine/contracts/enums.json` (single source of truth, imported by all validators)
- Contracts: `engine/contracts/schemas/*.schema.json` (field shapes; semantic rules live in validator code)
- Approach: `lib-creds.js` seam — `--creds=<path>` (flag) → `env:<VAR>` (environ) → `__dirname/.creds.json` (homedir fallback)
- Never in code: No hardcoded API keys, no `.env` files read directly (externalize everything)
- Per-run: Old creds stay at `runs/arduview/_tooling/` (gitignored, reproducible for that run only)
- Path sanitization: funnel-store.js and funnel-analyzer-context.js sanitize all path segments to `[a-z0-9._-]`; strip `/` and `..`
- Command injection: Spawn Python bricks with argv arrays only (no string interpolation); PEP 668 venv enforcement
- Prompt injection: Funnel body preserved VERBATIM in `<funnel_copy>` tags (inert data, analyzer prompt instructs model to ignore)
- Deny-list firewall: `guard-marketing.js` reads `off-limits.json`, blocks Write/Edit/MultiEdit to operator-owned paths
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| adversarial-reviewer | >- Use to review/critique/audit an artifact (a prompt, skill, spec, or output) against a captured STANDARD and emit findings + a verdict. This is the concrete "verify / section-the-verifier" step that skill-builder and system-designer name. Triggers: "review / critique / audit this skill or prompt"; "did this revision actually fix the prior findings"; check an artifact for lossiness vs a source-of-truth, self-consistency, ambiguity, contradiction, bloat, composition, or IO clarity. Grades pointwise (this artifact vs. the standard), reference-grounded, and logs defects without fixing them (fixing is the builder's separate pass). | `.claude/skills/adversarial-reviewer/SKILL.md` |
| automate | >- Use when capturing a task that an agent figured out once into a durable design a FRESH session can re-run without re-discovering anything — and when executing one. Triggers: "turn this into a repeatable workflow / runbook / automation"; pre-writing the code + steps so next time it "just runs"; deciding which steps to freeze into code vs. leave the agent to figure out live; a hardened workflow that broke when the UI/API/data changed; "should I even automate this or just do it again by hand"; running a pre-written design safely with preflight checks and a fallback when a step fails. Covers the harden-or-not gate, the freeze/adapt/human-required label test, the declarative durable-design template with a membership test per field, preflight + golden-output + the 3-tier fallback ladder, Human Gates (planned pauses where AI is literally blocked — pings the human with exact instructions and opens the required interface), the amendment-agent protocol (self-improvement without human involvement), the blocker protocol (when a step returns blocked / forbidden / rate-limited / captcha'd / "not supported", exhaust workarounds W1–W4 — alternate endpoints like appending .json to a Reddit URL, then an investigation subagent, then real-input RPA — before ever calling it impossible), a PRESENCE/SOUNDNESS completeness block, and a validator. For designing the DAG + typed contracts of the frozen part, use system-designer; to harden one node-prompt, use skill-builder; to de-vague prose, use instruction-mechanizer; to ship-check the design, use adversarial-reviewer. | `.claude/skills/automate/SKILL.md` |
| instruction-mechanizer | >- Use to take any EXISTING markdown prompt / instruction / skill / spec and rewrite its vague, interpretive instructions into mechanical, checkable ones — so an agent follows calculated rules instead of "vibes." Triggers: "make this prompt less ambiguous / more mechanical / less interpretive"; "de-vague this doc"; "audit this prompt for instructions an agent would have to guess at"; an agent is making judgment calls by feel where you wanted a rule. It scans for vague language, decides what each fix needs, rewrites into a checkable form, flags what cannot be mechanized, and outputs the rewritten doc + a change report. This is the RETROFIT front-door for an existing doc; for specifying a NEW prompt's output contract use skill-builder (which invokes this as its first step), and for wiring several prompts into a pipeline use system-designer. | `.claude/skills/instruction-mechanizer/SKILL.md` |
| skill-builder | >- Use when writing, reviewing, or hardening a SINGLE agent prompt or skill so its output is mechanically verifiable — so each field can be checked as "is this actually the thing I asked for?" rather than trusted on sight. Triggers: designing a prompt's output contract; adding a completeness or validation block; fixing a prompt where the agent emits plausible-but-wrong values (a label that doesn't fit the category, a filled-in field that's hollow); deciding what to specify positively vs. when to add a "do not" rule; making one prompt do exactly one job. Covers positive specification, per-field membership tests, per-field evidence/provenance, splitting "complete" into presence vs. soundness, and one-job-per-prompt. For pipeline / multi-agent architecture (contracts between steps, lanes, escalation, orchestration of many agents), use system-designer instead. | `.claude/skills/skill-builder/SKILL.md` |
| skill-creator | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. | `.claude/skills/skill-creator/SKILL.md` |
| system-designer | >- Use when designing or fixing a multi-step / multi-agent pipeline — anything where more than one prompt, agent, or script hands work to the next. Triggers: defining the contract between two steps; deciding how to split work into agents; a field that sometimes can't be filled (need retry/escalation); a "is this relatively unique / how common is X" check before committing; making provenance survive across handoffs; keeping each step in its lane; making the pipeline run deterministically from one command; deciding when to spawn a subagent vs. keep work in one context. Covers IO contracts, lanes/sectioning, the Closer (escalation) pattern, the relative-evidence quick-pass, provenance across handoffs, and deterministic DAG orchestration. For hardening a SINGLE prompt's output, use skill-builder. | `.claude/skills/system-designer/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
