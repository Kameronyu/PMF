# Technology Stack

**Analysis Date:** 2026-06-24

## Languages

**Primary:**
- JavaScript (Node.js CJS/ESM) — all deterministic pipeline scripts under `tools/` and `runs/arduview/_tooling/`
- Python 3.12 — video assembly, image probing/hashing, and the surge.sh + Chrome-forwarder utilities

**Secondary:**
- Markdown — prompt templates, skill orchestration specs, run outputs
- JSON — data model for all pipeline I/O (brands.json, dump.json, space-map.json, funnel packages, EDLs, manifests)

## Runtime

**Environment:**
- Node.js v20.20.0 (WSL2 Ubuntu, Linux 6.6.87.2-microsoft-standard-WSL2)
- Python 3.12.3 (system Python; scripts invoke `.venv/bin/python` explicitly — PEP 668)

**Package Manager:**
- npm — single global `package.json` at `/home/kyu3/package.json` (not inside the project repo)
- pip + virtualenv (`.venv/`) for Python deps; venv is gitignored
- Lockfile: none committed for Node; npm manages `/home/kyu3/package-lock.json` outside the repo

## Frameworks

**Browser Automation:**
- Playwright 1.59.1 — installed globally at `/home/kyu3/node_modules/playwright`
  - Used by: `tools/fetch.js`, `tools/adlib-one.js`, `tools/adlib-sweep.js`, `tools/crowdfund-fetch.js`, `.claude/skills/reddit-extract/dump.mjs`
  - Headless Chromium for web scraping with CF-bypass loop and fingerprint masking
  - `chromium.launch()` in all tools except CDP path (`runs/arduview/_tooling/drive.cjs` uses `chromium.connectOverCDP`)

**Video/Image Processing (Python):**
- `imageio-ffmpeg` 0.6.0 — bundled static ffmpeg binary; used by `tools/asset/video-assemble.py` for HDR tone-map, crop, concat, fade
- `Pillow` 12.2.0 — EXIF-corrected image open, resize, JPEG write; used by `tools/asset/probe.py`
- `imagehash` 4.3.2 — perceptual hash (phash) for cross-set dedupe; used by `tools/asset/probe.py`
- `numpy` 2.4.6 — dependency of imagehash

**Build/Dev:**
- No build toolchain. All scripts are run directly via `node <script>` or `python3 <script>`.
- No TypeScript, no transpilation, no bundler.

## Key Dependencies

**Critical:**
- `playwright` ^1.59.1 — all web fetching (competitor sites, Meta Ad Library, crowdfunding pages, Reddit, Google Trends). Without it, the entire data collection pipeline is broken.
- `Pillow` + `imagehash` + `imageio-ffmpeg` — the asset classifier pipeline (`tools/asset/`) cannot run without these

**Infrastructure (in-repo, no install needed):**
- `tools/lib/embed.js` — embedding swap-point; runs with a local deterministic stub (FNV-1a bag-of-words) when `VOYAGE_API_KEY` is absent; falls back cleanly — no hard dep on Voyage for basic pipeline runs

## Configuration

**Environment Variables:**
- `VOYAGE_API_KEY` — optional; enables Voyage AI semantic embeddings in `tools/funnel-vectorize.js` / `tools/lib/embed.js`; absent → local stub (lexical overlap only)
- `VOYAGE_MODEL` — optional override; default `voyage-3-large`
- `VOYAGE_API_URL` — optional override; default `https://api.voyageai.com/v1/embeddings`
- `CDP_HOST` — override for Chrome DevTools Protocol host (default: WSL gateway IP auto-detected)
- `CDP_PORT` — override for CDP port (default: `9334`)
- `KL_REV` — override Klaviyo API revision (default: `2024-10-15`)
- `CF_TOKEN` — override Cloudflare API token (default: read from `.cloudflare-creds.json`)

**Credential Files (gitignored):**
- `runs/arduview/_tooling/.shopify-creds.json` — Shopify Admin API token + store domain + API version
- `runs/arduview/_tooling/.klaviyo-creds.json` — Klaviyo Arduview account private key
- `runs/arduview/_tooling/.klaviyo-inkleaf-creds.json` — Klaviyo InkLeaf account private key
- `runs/arduview/_tooling/.cloudflare-creds.json` — Cloudflare API token

**Project Config:**
- `.claude/settings.json` — Claude Code hook config (PostToolUse → `tools/hooks/route.js`) and allowed Bash/Skill/mcp permissions
- `.planning/config.json` — GSD orchestration config
- `.gitignore` — excludes corpus raw HTML, `.venv/`, asset work copies, cred files, regenerable scratch

## Python Virtual Environment

- Location: `/home/kyu3/PMF/.venv/`
- Gitignored; must be created manually
- Activate: `source /home/kyu3/PMF/.venv/bin/activate` or invoke directly as `.venv/bin/python`
- Contains: Pillow, imagehash, imageio-ffmpeg, numpy only

## Platform Requirements

**Development:**
- WSL2 (Linux) on Windows 11
- Windows Chrome (real browser, not Playwright's Chromium) needed for CDP-based Shopify/Google Admin flows
- Windows Python 3.11 needed for `win-chrome-forwarder.py` (must run on Windows side to forward the loopback port)
- Node.js v20+ (for native `WebSocket` flag support in `cdp.cjs`)

**Production:**
- No server. All tools run locally and write output to `runs/<space>/` on disk.
- Static site deploys to `surge.sh` via `runs/arduview/_tooling/surge_drive.py`
- Shopify storefront deployment via `runs/arduview/_tooling/shopify-deploy-funnel.js` (curl-based Shopify Admin API calls)

---

*Stack analysis: 2026-06-24*
