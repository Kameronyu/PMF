# Technology Stack — PMF Engine

**Analysis Date:** 2026-06-26

## Languages

**Primary:**
- **JavaScript/Node.js** 20.20.0+ — All orchestration, firing layer, integrations, and deterministic bricks (`engine/bricks/*.js`, `engine/hooks/*.js`, `engine/integrations/**/*.{js,cjs}`)
- **Python** 3.12.3 — Asset processing pipeline (`engine/bricks/asset/*.py`): image probe (dims, perceptual hash, downscale), video frame analysis, montage composition, video assembly

## Runtime

**Environment:**
- Node.js 20.20.0+ (pinned in `engine/package.json`, proven against 20.20.0)
- Python 3.12.3 (proven version; install into `.venv`)

**Package Manager:**
- npm (ships with Node 20+)
- pip (Python's package manager)
- Lockfile: `package-lock.json` not present; `engine/package.json` pins single dependency

## Frameworks & Libraries

**Browser Automation:**
- **Playwright** 1.59.1 — The only third-party Node dependency. Used by live-DOM fetchers and funnel assemblers:
  - `engine/bricks/fetch.js` — LP/site fetching with Google Trends integration
  - `engine/bricks/crowdfund-fetch.js` — crowdfunding page scraping (Kickstarter, Indiegogo, crowdsupply)
  - `engine/bricks/adlib-one.js`, `engine/bricks/adlib-sweep.js` — Meta Ad Library GraphQL fetching
  - `engine/bricks/funnel-assemble.js` — live landing-page rendering
  - `engine/skills/reddit-extract/dump.mjs` — Reddit user-content extraction
  - Requires post-install: `npx playwright install chromium` for the browser binary

**Asset Processing:**
- **Pillow** 12.2.0 (Python) — Image dimensions, color profiles, downscaling
- **imagehash** 4.3.2 (Python) — Perceptual hash generation for image similarity (`engine/bricks/asset/probe.py`)
- **imageio-ffmpeg** 0.6.0 (Python) — Bundled static ffmpeg binary (no system ffmpeg required). Used by:
  - `engine/bricks/asset/video-assemble.py` — video cutting and composition
  - `engine/bricks/asset/probe_video.py` — video frame extraction
  - Invoked via `imageio_ffmpeg.get_ffmpeg_exe()` to ensure cross-platform static binary

**Shared Libraries (Node):**
- `engine/bricks/lib/embed.js` — Voyage AI embeddings client (optional; VOYAGE_API_KEY for live, stubbed locally)
- `engine/bricks/lib/trends-parse.js` — Google Trends XHR response parser
- `engine/bricks/lib/adlib-graphql.js` — Meta Ad Library GraphQL response extractor
- `engine/integrations/lib-creds.js` — Credentials resolution (CLI flags → env → defaults)

## Testing & Health

**Test Harness:**
- **Location:** `engine/contracts/h6-all.sh` — master smoke runner
- **Health Status (P21-H6, 2026-06-26):** **14/14 green**
  - 22 working capabilities
  - 1 dry-run-verified (surge-deploy)
  - 1 partial (chrome-cdp, env-dependent)
  - 2 deferred-but-diagnosed (reddit-extract R6, crowdfund-fetch R7)
- **Fixture-based verification:** All smoke tests run offline against committed fixtures in `engine/_fixture/`
- **Individual smoke commands:**
  - `engine/contracts/h6-clean.sh` — HTML → markdown
  - `engine/contracts/h6-dedupe.sh` — brand roster deduplication
  - `engine/contracts/h6-revenue.sh` — revenue estimation
  - `engine/contracts/h6-funnel-assemble.sh` — ads → funnel packages
  - `engine/contracts/h6-analyzer-context.sh` — context assembly
  - `engine/contracts/h6-asset-classify.sh` — asset map/rank/emit chain
  - `engine/contracts/h6-asset-fetch.sh` — asset fetch + probe
  - `engine/contracts/h6-video-assemble.sh` — video cutting
  - `engine/contracts/h6-firing.sh` — validators (good→0/bad→2) + route dispatch + DR injectors
  - `engine/contracts/h6-bucketB.sh` — surge/CDP dry-run
  - `engine/contracts/h5-e2e.sh` — deterministic funnel spine (from P21 H5)

**Run Verification:**
```bash
cd engine/contracts && bash h6-all.sh  # expect 14/14 green
```

## Configuration

**Environment Provisioning:**
- **Node venv:** `npm install` in `engine/` directory
  - Installs Playwright 1.59.1
  - Post-install: `npx playwright install chromium`
- **Python venv:** `python3 -m venv .venv && .venv/bin/pip install -r engine/requirements.txt`
  - Creates isolated venv at project root
  - Installs Pillow, imagehash, imageio-ffmpeg

**Build Scripts:**
- `engine/bricks/lib/` exports CommonJS modules (no build step)
- Python bricks invoked via explicit venv path: `.venv/bin/python engine/bricks/asset/*.py`
  - Never uses bare `python3` (PEP 668 venv isolation)

**External Wire-Time Inputs (not vendored):**
- **DR knowledge dir** — `--dr-dir=<path>` / `$DR_DIR` for `inject-*-dr.js` bundlers
  - Default: `~/knowledge/dr-marketing`
  - Stub fixtures: `engine/_fixture/dr-knowledge/` (smoking only)
- **Run-space root** — `runs/<space>/` where bricks read/write artifacts
- **Credentials** — surge (`$SURGE_EMAIL`/`$SURGE_PW`), shopify/cloudflare/klaviyo via `--creds=<path>` / env (see INTEGRATIONS.md)

**No Build Transpilation:**
- All Node code is plain ES6 CommonJS (Node 20 native)
- All Python code runs without compilation (`python engine/bricks/asset/*.py`)
- No webpack, Babel, or TypeScript — raw source to execution

## Platform Requirements

**Development:**
- Node.js 20.20.0+
- Python 3.12.3
- Bash (for smoke harness)
- System curl (for Shopify/Cloudflare/Klaviyo REST calls via `execSync` in Node)

**Production/Deployment:**
- Same runtimes (Node + Python venv)
- Surge.sh account + credentials for static site deploy
- Shopify store + API credentials for theme/page deployment
- Cloudflare zone credentials for DNS management (optional)
- Klaviyo account credentials for email/CRM integration (optional)
- Chrome with `--remote-debugging-port=9333` for CDP (Windows only; WSL bridge available)

## Dependency Notes

**No Transitive Dependencies:**
- `engine/package.json` declares only `playwright@1.59.1`
- All other Node work uses Node built-ins: `fs`, `path`, `crypto`, `http`, `https`, `net`, `dns`, `os`, `child_process`
- No express, no async libraries, no ORM
- Playwright is locked; no semver ranges

**FFmpeg Handling:**
- `imageio-ffmpeg` bundles a static ffmpeg binary (`imageio_ffmpeg.get_ffmpeg_exe()`)
- No system ffmpeg binary required
- Supports cross-platform video operations (SDR only; HDR support deferred)

**Credentials Seam (H4 Fix):**
- All integrations use `lib-creds.js` for unified creds resolution:
  1. `--creds=<path>` CLI flag (highest priority)
  2. Environment variable (e.g., `SHOPIFY_CREDS`, `CF_CREDS`, `KLAVIYO_CREDS`)
  3. Legacy default path (backward-compatible, e.g., `.shopify-creds.json` in integration dir)
- No credentials committed to repo

---

*Stack analysis: 2026-06-26. Proven against P21-H6 closeout: all 14 contracts green. Entry point: `engine/WIRING-BUNDLE.md`.*
