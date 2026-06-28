# DEPENDENCIES — what a builder must provision to run the engine wiring

Proven against these versions in the P21-H6 closeout (2026-06-26). Pin to them unless you re-verify.

## Runtimes
| runtime | version | used by |
|---|---|---|
| Node.js | 20.20.0 (`>=20`) | all `engine/bricks/*.js`, `engine/hooks/*.js`, `engine/integrations/**/*.{js,cjs}` |
| Python | 3.12.3 | `engine/bricks/asset/*.py` (probe / probe_video / frame-grab / sample_montage / video-assemble) |

## Node packages (`engine/package.json`)
- `playwright@1.59.1` — the only third-party node dep. Used by the live-DOM fetchers/assemblers: `fetch.js`, `crowdfund-fetch.js`, `adlib-one.js`, `adlib-sweep.js`, `funnel-assemble.js`. Everything else uses Node built-ins (fs/path/crypto/http/https/net/dns/os/child_process).
- After `npm install`, also run **`npx playwright install chromium`** (the browser binary the fetch/assemble bricks drive).

## Python packages (`engine/requirements.txt`, install into `.venv`)
- `Pillow==12.2.0`, `imagehash==4.3.2` — `asset/probe.py` (image dims + perceptual hash + downscale).
- `imageio-ffmpeg==0.6.0` — `asset/video-assemble.py` + `probe_video.py` use the **bundled static ffmpeg** (`imageio_ffmpeg.get_ffmpeg_exe()`); **no system ffmpeg required** (and none is assumed).

Bricks invoke python as `<cwd>/.venv/bin/python` (e.g. `asset-fetch.js` → `probe.py`), so create the venv at the run root: `python3 -m venv .venv && .venv/bin/pip install -r engine/requirements.txt`.

## CLI tools
- `npx` (ships with Node) — `surge-deploy` launches `npx --yes surge`. Provision a surge account; pass creds via env (see FIRING-MANIFEST / surge_drive.py), never hardcoded.

## External, wire-time INPUTS (not vendored — the builder/operator supplies them)
- **DR knowledge dir** — the 4 `inject-*-dr.js` bundlers read it via `--dr-dir=<path>` → `$DR_DIR` → homedir default. The repo's old `~/knowledge/dr-marketing` content is stale; supply fresh. (A tiny stub set lives at `engine/_fixture/dr-knowledge/` for smoking only.)
- **Run-space root** — bricks read/write `runs/<space>/…`; the builder picks the space.
- **Creds** — surge (`$SURGE_EMAIL`/`$SURGE_PW`), and the integrations' `--creds`/env seam (shopify/cloudflare/klaviyo via `lib-creds.js`). None committed.

## Verify after provisioning
`bash engine/contracts/h6-all.sh` → expect **14/14 green** (h5-e2e + the H6 brick/firing/Bucket-B smokes). That green bar IS the acceptance test.
