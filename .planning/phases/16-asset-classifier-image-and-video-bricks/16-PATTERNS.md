# Phase 16: Stage M1-S16 — Asset Classifier (image + video bricks) — Pattern Map

**Mapped:** 2026-06-04
**Files analyzed:** 13 (10 created scripts/data + 1 skill + 1 per-run input + 1 venv-setup seam)
**Analogs found:** 11 / 13 (2 net-new Python video bricks have no in-repo analog → seed from RESEARCH.md Code Examples)

> The RESEARCH.md "Closest-Analog Map" already named the analog + line ranges for every file. This
> doc extracts the **actual code excerpts** the planner copies. Paste-ready, not described.

---

## File Classification

| New file | Role | Data flow | Closest analog | Match quality |
|----------|------|-----------|----------------|---------------|
| `tools/asset-fetch.js` | script (fetch/ingest) | file-I/O + manifest write | `tools/crowdfund-fetch.js` | role-match (I/O + arg-parse + Playwright) |
| `tools/asset/probe.py` | script (pixel measure) | transform (image→technical+phash) | proof pipeline + RESEARCH §Code Examples | seed (no Node analog; pixel work is Python) |
| `tools/asset/probe_video.py` | script (pixel measure) | transform (video→meta) | RESEARCH §Code Examples (imageio-ffmpeg) | net-new |
| `tools/asset/sample_montage.py` | script (pixel transform) | batch (frames→contact sheets) | RESEARCH §Code Examples (PIL montage) | net-new |
| `tools/asset-map-rank.js` | script (route/rank) | transform (records→ranked+gap) | `tools/funnel-store.js` (load+build+write spine) + `section-table.json` | role-match |
| `tools/asset-emit.js` | script (store/emit) | file-I/O (JSON + MD write) | `tools/funnel-store.js` (JSON store) + `IMAGES.md`/`VIDEOS.md` (MD format) | exact (store), exact (MD) |
| `tools/asset-upload.js` | script (upload/backfill) | file-I/O + (opt) Playwright | `tools/crowdfund-fetch.js` (Playwright) + `VIDEOS.md`/runbook D.0 | role-match |
| `tools/hooks/validate-asset-record.js` | hook (PostToolUse validate) | request-response (path→exit 0/2) | `tools/hooks/validate-analyzer.js` | exact |
| `tools/asset/section-table.json` | config (data artifact) | — (require()-able) | spec §Section table + RESEARCH open-item-3 | exact (extract from spec) |
| `tools/asset/section-list.default.json` | config (data artifact) | — | spec §Controlled vocab + RESEARCH open-item-4 | exact (extract from spec) |
| `.claude/skills/asset-classify/SKILL.md` | provider (orchestrator skill) | event-driven (per-asset fan-out) | `.claude/skills/funnel-deep-pass/SKILL.md` | exact (structural twin) |
| `runs/arduview/asset-classify/CLAIM-LIST.json` | config (per-run input) | — | `launch/inkleaf-launch/LAUNCH-INPUTS.md` (per-launch input pattern) | role-match |
| `tools/asset-analyzer-context.js` (OPTIONAL, brick-4 context-builder) | script (assemble) | transform (assemble spawn block) | `tools/funnel-analyzer-context.js` | exact — see note below |

> **Context-builder note:** RESEARCH says brick 4 "mirrors `funnel-analyzer-context.js`" but the asset
> agent **Reads a local `work_path`** instead of receiving embedded image bytes. So the asset
> context-builder assembles only the *trusted text* (fact sheet + claim list + vocab) and **appends the
> file path the agent must Read** — it does NOT embed pixels. This may be folded into the SKILL.md
> orchestrator step rather than a standalone script; the planner decides. Pattern excerpt below regardless.

---

## Shared Patterns (apply across multiple files)

### S1 — CLI arg/opts parse (positional + `--flag=val`)
**Source:** `tools/crowdfund-fetch.js:39-47` (also identical in `funnel-store.js:32-36`, `funnel-analyzer-context.js:52-60`)
**Apply to:** every Node brick (`asset-fetch.js`, `asset-map-rank.js`, `asset-emit.js`, `asset-upload.js`, context-builder)
```javascript
const args = process.argv.slice(2);
const slug = args.filter(a => !a.startsWith('--'))[0];          // positional (if needed)
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
if (opts.help || args.length === 0) { console.log(/* usage block */); process.exit(0); }
```

### S2 — Path sanitizer (T-03-13) for any path segment derived from input
**Source:** `tools/funnel-store.js:81-93` (copied verbatim into `funnel-analyzer-context.js:95-100`)
**Apply to:** `asset-emit.js`, `asset-map-rank.js`, any brick that writes `runs/<space>/...` or builds an id-based filename
```javascript
function sanitizePathSegment(raw) {
  // Allow only [a-z0-9._-]; strip everything else (including "/" and "..")
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');  // belt-and-suspenders: collapse residual dots
}
const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) { console.error('ERROR: --space sanitized to empty; use [a-z0-9._-]'); process.exit(1); }
```
Asset ids (`arduview-0001`, `arduview-vid-01`) come from the fetch brick and feed filenames downstream —
sanitize them the same way before any `path.join`.

### S3 — JSON store shape (wrapper object + underscore-meta + `null,2`)
**Source:** `tools/funnel-store.js:113-173`
**Apply to:** `asset-emit.js` (images.json / videos.json), the brick-4 record collector
```javascript
function buildStoredRecord(funnelPkg, beliefRecords) {
  const record = {
    funnel_id,
    /* ...all fields present-or-null (never-fabricate) ... */
    competitor: funnelPkg.competitor ?? null,
    // _provenance underscore-meta (space-map.json convention)
    _provenance: { source: 'funnel-store.js', space: SPACE, stored_at: new Date().toISOString() },
    belief_records: Array.isArray(beliefRecords) ? beliefRecords : [],
  };
  return record;
}
function writeFunnelRecord(record, logLines, dryRun) {
  const outPath = path.join(OUT_DIR, `${record.funnel_id}.json`);
  if (dryRun) { logLines.push(`[DRY-RUN] would write: ${outPath}`); return {/*...*/}; }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(record, null, 2));
  logLines.push(`[STORED] ${outPath}`);
}
```
**Asset mapping:** `images.json` = `{ records: [<brick-4 record>...], _provenance, gap_list: [...] }`;
`videos.json` = same with video records. One wrapper object, `JSON.stringify(_, null, 2)`, `_`-prefixed meta.

### S4 — Sidecar log + one-line console summary + partial-success exit contract
**Source:** `tools/funnel-store.js:316-339`
**Apply to:** `asset-fetch.js`, `asset-emit.js`, `asset-map-rank.js`, `asset-upload.js`
```javascript
const ok = results.filter(r => r.status === 'ok' || r.status === 'dry-run');
const errors = results.filter(r => r.status === 'error');
const summary = `asset-store: ${ok.length} stored, ${errors.length} errors, space=${SPACE}, outDir=${OUT_DIR}`;
logLines.unshift(`[${new Date().toISOString()}] ${summary}`);
if (!dryRun) fs.writeFileSync(path.join(OUT_DIR, '_asset-store-log.txt'), logLines.join('\n') + '\n');
console.log(summary);
// IN-06 exit contract: partial success exits 0 (successes ARE written); only total failure exits 1
if (errors.length > 0) { for (const r of errors) console.error(`  ERROR: ${r.id}: ${r.error}`); if (ok.length === 0) process.exit(1); }
```

### S5 — Spawn a sibling script, never reimplement it (`.venv/bin/python` convention)
**Source:** `tools/funnel-analyzer-context.js:167-182` (spawns `inject-dr.js`, fails closed if it errors)
**Apply to:** every Node brick that triggers a Python pixel brick (`asset-fetch.js`→`probe.py`,
orchestrator→`probe_video.py`/`sample_montage.py`). **Convention (RESEARCH wave-0):** Node bricks call
`.venv/bin/python tools/asset/<brick>.py` explicitly so spawn works without an active shell.
```javascript
const { spawnSync } = require('child_process');
const VENV_PY = path.resolve(process.cwd(), '.venv', 'bin', 'python');
const run = spawnSync(VENV_PY, [path.resolve(__dirname, 'asset', 'probe.py'), rawPath, workPath],
  { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
if (run.error || run.status !== 0 || !run.stdout) {
  const why = run.error ? run.error.message : run.status !== 0 ? `probe.py exited ${run.status}` : 'no stdout';
  console.error(`ERROR: probe.py failed — ${why} (refusing to fabricate technical{})`);
  if (run.stderr) console.error(run.stderr.trim());
  process.exit(2);
}
const technical = JSON.parse(run.stdout);   // python brick prints JSON to stdout
```

---

## Pattern Assignments

### `tools/asset-fetch.js` (script, file-I/O + manifest)
**Analog:** `tools/crowdfund-fetch.js`

**Modes:** `--local=<dir>` (UAT, build first) and `--drive-folder-id=<id>` (prod, documented).
Glob `*.jpg/*.png/*.mp4`, copy to `assets/raw/`, assign ids, write `raw-manifest.json`.

**Arg/opts parse** — see **S1** (crowdfund-fetch.js:39-47).

**Output dir + timestamp idiom** (crowdfund-fetch.js:74-81):
```javascript
const baseOut = opts.out || path.join(__dirname, '..', 'crowdfunding-corpus');
const outDir  = path.join(baseOut, slug, 'raw');
fs.mkdirSync(outDir, { recursive: true });
const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
```

**File + JSON-sidecar write** (crowdfund-fetch.js:383-404 — the manifest pattern to mirror):
```javascript
fs.writeFileSync(path.join(outDir, `${fileBase}.html`), html);
fs.writeFileSync(path.join(outDir, `${fileBase}.txt`), `URL: ${url}\nTITLE: ${title}\n...`);
// JSON sidecar (asset analog: raw-manifest.json with { id, source:{local_path,original_name}, kind })
const statsOut = { slug, url, fetched: new Date().toISOString(), crowdfunding_stats };
fs.writeFileSync(path.join(outDir, `${fileBase}.stats.json`), JSON.stringify(statsOut, null, 2));
```
**Asset shape:** `raw-manifest.json` = `[ { id:"arduview-0001", source:{ local_path, original_name }, kind:"image"|"video" }, ... ]`.

**try/catch/finally + status flag** (crowdfund-fetch.js:318-413) — wrap each file copy; on err write
`.err.txt`, set `status='err'`, never throw out of the loop (per-file isolation, T-03-06 idiom).

**Drive mode (prod):** RESEARCH says use the Drive MCP `list folder → download each` then identical
id-assignment + manifest write. Blocked on cross-account share — wire but leave untested; `--local` is the UAT path.

**Playwright launch block** (if Drive needs auth'd UI) — reuse crowdfund-fetch.js:269-294 verbatim
(headless launch args, `newContext` UA/viewport, `addInitScript` fingerprint mask). Brick 8 reuses this too.

---

### `tools/asset/probe.py` (script, transform — image→technical+phash+downscale)
**Analog:** proof pipeline (`runs/arduview/_asset-classify-proof.md`) + RESEARCH §Code Examples (brick 2)

**Seed code** (RESEARCH.md:335-347 — paste as the brick body):
```python
from PIL import Image, ImageOps
import imagehash
def probe_and_downscale(raw_path, work_path, max_edge=1400):
    im = ImageOps.exif_transpose(Image.open(raw_path))   # EXIF-corrected (load-bearing, from proof)
    w, h = im.size
    technical = {"w": w, "h": h, "aspect": f"{w}:{h}", "bytes": __import__("os").path.getsize(raw_path)}
    phash = str(imagehash.phash(im))                      # dup_of comparison done across the set
    im.thumbnail((max_edge, max_edge))
    im.convert("RGB").save(work_path, "JPEG", quality=88)
    return technical, phash
```
**Record contract** (spec:81): emit `technical{ w, h, aspect, format, bytes, dup_of, min_safe_use }` +
the `work_path` (downscaled, what brick 3/4 Read). `min_safe_use` = thumb/section/hero by resolution.
**dup_of:** compute phash per image; Hamming distance < ~5/64 → mark softer/lower-res one
`dup_of: <winner_id>` (UAT target: img-04 keeps, img-05 → `dup_of: arduview-img-04`).
**Print JSON to stdout** so the Node caller (S5) parses it. No system ffmpeg/numpy assumptions — PIL + imagehash only.

---

### `tools/asset/probe_video.py` (script, transform — video→meta) — NET-NEW
**Analog:** none in-repo; seed from RESEARCH §Code Examples (brick 2v)

**Seed code** (RESEARCH.md:372-380):
```python
import subprocess
from imageio_ffmpeg import get_ffmpeg_exe
def probe_video(video):
    r = subprocess.run([get_ffmpeg_exe(), "-i", video], capture_output=True, text=True)
    meta = r.stderr  # ffmpeg prints stream info to stderr: Duration, Stream Video: codec WxH fps; Audio
    return meta      # parse Duration/Video/Audio → duration_s, w, h, fps, codec, has_audio, aspect, bytes
```
Emit `probe{ duration_s, w, h, fps, has_audio, aspect, bytes }` (spec:249). **Flag oversize** — real
Arduview MP4s are 177/192/224 MB; flag before sampling. `get_ffmpeg_exe()` returns the bundled static
binary (no system ffmpeg). Print JSON to stdout.

---

### `tools/asset/sample_montage.py` (script, batch — frames→timestamped contact sheets) — NET-NEW
**Analog:** none in-repo; seed from RESEARCH §Code Examples (brick 3v)

**Seed code** (RESEARCH.md:350-369):
```python
import subprocess, glob, os
from imageio_ffmpeg import get_ffmpeg_exe
from PIL import Image, ImageDraw
FFMPEG = get_ffmpeg_exe()
def sample(video, outdir, fps=5):
    os.makedirs(outdir, exist_ok=True)
    subprocess.run([FFMPEG, "-i", video, "-vf", f"fps={fps}", f"{outdir}/f%04d.jpg"], check=True)
def montage(frames_dir, sheet_path, fps=5, cols=5, rows=6, cell=360):
    frames = sorted(glob.glob(f"{frames_dir}/f*.jpg"))[:cols*rows]
    sheet = Image.new("RGB", (cols*cell, rows*cell), "black"); d = ImageDraw.Draw(sheet)
    for i, fp in enumerate(frames):
        thumb = Image.open(fp); thumb.thumbnail((cell, cell))
        x, y = (i % cols)*cell, (i // cols)*cell
        sheet.paste(thumb, (x, y))
        t = i / fps; ts = f"{int(t//60):02d}:{t%60:05.2f}"   # mm:ss.ff — deterministic frame→time
        d.text((x+4, y+4), ts, fill="yellow")
    sheet.save(sheet_path, "JPEG", quality=85)
```
**Deliberate spec deviation (RESEARCH §Flagged #1):** spec names ffmpeg `tile=5x6`+`drawtext`; do
**tile+timestamp in PIL** (bundled binary may lack freetype/fontconfig for `drawtext`). Intent (5fps
timestamped sheets) fully preserved. **30 frames/sheet** (5×6 = 6s at 5fps); a 30s clip → 5 sheets, not
150 reads. **Clean up frames** after montage; **downscale cells** (`cell≈360px`) so sheets stay Read-able.

---

### `tools/asset-map-rank.js` (script, transform — records→ranked + gap_list)
**Analog:** `tools/funnel-store.js` (load→build→write spine) + `tools/asset/section-table.json`

**load + build + write spine** — reuse funnel-store.js:102-105 (`loadJson`), the `buildStoredRecord`
shape (S3), and `collectJsonFiles` (funnel-store.js:178-182) for batch:
```javascript
function collectJsonFiles(dir) {
  return fs.readdirSync(dir).filter(f => f.endsWith('.json') && !f.startsWith('_')).map(f => path.join(dir, f));
}
function loadJson(filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
```
**Routing logic (the brick-specific part):** `require()` `section-table.json`; for each record, route every
`demonstrates[].claim` → `primary`/`also` sections; honor the `requires.display_state: on_legible`
conditional (spec hero rule — the lit-through-glass shot is hero only if `display_state==on_legible`);
rank candidates per section by `strength × technical.min_safe_use` fit; **emit `gap_list`** = sections
with no `strong` + clean (`disqualifiers:[]`) image. Section routing stays in the table, NOT in code
(editable without re-running vision). Optional `--section-list=<path>` seam (RESEARCH open-item-4) for
when M1-S3 produces a funnel structure.

---

### `tools/asset-emit.js` (script, file-I/O — JSON + MD manifests)
**Analog:** `tools/funnel-store.js` (JSON store) + `launch/inkleaf-launch/IMAGES.md` / `VIDEOS.md` (MD format)

**JSON store** — see **S3** + **S4**. `images.json` = `{ records:[...], _provenance, gap_list:[...] }`;
`videos.json` adds `segments[]`, `best_use`, `loop_safe`, `needs_audio`, `poster_frame`, `eligible_slots`.

**IMAGES.md format to mirror** (`launch/inkleaf-launch/IMAGES.md:1-31`):
```markdown
# <Product> Image CDN URLs
**Base URL pattern**: `https://cdn.shopify.com/s/files/1/<STORE_NUM_ID>/files/{filename}.jpg`
---
## <section>            ← e.g. "Hero / lifestyle", "Feature — dual screen"
| Name | URL |
|---|---|
| Hero — armchair closed (warm, face-forward) | https://cdn.shopify.com/.../inkleaf-hero-armchair-closed.jpg |
```
**Asset spec target** (proof "Manifest the builder would consume", proof:60-66): `## <section>` →
table `| role | pick | claim+strength |` → CDN URL column (empty until brick 8). Carry dedupe
(img-05 dropped), disqualifiers (img-02 strawberry-bg), and the gap_list (no clean-studio hero).

**VIDEOS.md format to mirror** (`launch/inkleaf-launch/VIDEOS.md:1-25`) — note the hashed-CDN warning verbatim:
```markdown
> NOTE: Shopify serves videos from a HASHED path (`/videos/c/o/v/{hash}.mp4`), NOT the
> predictable `/files/{name}.mp4` pattern images use. Use these exact URLs.
| File | Spec | CDN URL |
|---|---|---|
| inkleaf-hero.mp4 | 12.2s · 1920×1080 · captioned | https://cdn.shopify.com/videos/c/o/v/<hash>.mp4 |
## Poster frame   ← asset analog: the chosen poster_frame row, uploaded as a normal image
```
Add a poster-frame row per spec (`<video poster=…>`).

---

### `tools/asset-upload.js` (script, file-I/O + optional Playwright — url-map backfill)
**Analog:** `tools/crowdfund-fetch.js` (Playwright, if UI-automate) + `LAUNCH-RUNBOOK.md` §D.0 + `VIDEOS.md` note

**Build the manifest-backfill to accept `url-map.json`** (filename → CDN URL) so it works with manual
OR API upload (RESEARCH §Flagged #4 — hashed video URL makes pure-construct impossible).
- **Images:** *construct* `https://cdn.shopify.com/s/files/1/<STORE_NUM_ID>/files/<filename>.jpg`.
- **Videos:** **capture** the hashed `https://cdn.shopify.com/videos/c/o/v/<hash>.mp4` after upload
  (cannot construct). Also upload the chosen `poster_frame` as a normal image (predictable URL).
- Backfill the empty CDN column in `images.json`/`videos.json` + the MD manifests.

**Arg/opts** — S1. **Load url-map** — `loadJson` (funnel-store.js:102-105). **Playwright block** (only if
UI-automating the Shopify Files upload) — reuse crowdfund-fetch.js:269-294 launch/context/init-script
verbatim. Full credentialed Admin-API automation is **out of scope** (rides M2; scope guard).

---

### `tools/hooks/validate-asset-record.js` (hook, PostToolUse — closed-vocab + grounding reject)
**Analog:** `tools/hooks/validate-analyzer.js` — **structural twin**

**Header/usage/exit contract** (validate-analyzer.js:1-44): `Exit 0 = pass (silent). Exit 2 + stderr = REJECT.`
Same `--help` block, same `process.argv[2]` path arg, same read+parse with REJECT-on-failure (validate-analyzer.js:46-67):
```javascript
const filePath = process.argv[2];
if (!filePath) { console.error('REJECT: missing argument — provide path to asset record JSON'); process.exit(2); }
let raw, data;
try { raw = fs.readFileSync(filePath, 'utf8'); } catch (err) { console.error(`REJECT: cannot read "${filePath}" — ${err.message}`); process.exit(2); }
try { data = JSON.parse(raw); } catch (err) { console.error(`REJECT: invalid JSON in "${filePath}" — ${err.message}`); process.exit(2); }
```

**Closed-enum-as-Set + off-enum reject** (validate-analyzer.js:69-122, 320-360 — copy this exact idiom):
```javascript
const SHOT_TYPE_ENUM = new Set(['hero','detail_macro','in_hand_scale','lifestyle_context',
  'screen_on_ui','turntable_frame','packaging_unboxing','group_collection','diagram_annotated']);
const DISQUALIFIER_ENUM = new Set(['text_overlay','watermark','low_res','wrong_product','competitor_ad','sensitive']);
const STRENGTH_ENUM = new Set(['strong','partial','incidental']);
// ... per record:
if (!SHOT_TYPE_ENUM.has(rec.shot_type)) {
  violations.push(`REJECT: ${rLabel} shot_type="${rec.shot_type}" is off-enum — must be one of: ${[...SHOT_TYPE_ENUM].join(' | ')}`);
}
```

**Violations-accumulate-then-dump loop** (validate-analyzer.js:264-388 — the per-record loop spine):
```javascript
const violations = [];
for (let ri = 0; ri < records.length; ri++) {
  const rec = records[ri];
  const rLabel = `records[${ri}]` + (rec.id ? ` (id: ${rec.id})` : '');
  // ... push REJECT strings, never throw ...
}
if (violations.length > 0) { for (const v of violations) console.error(v); process.exit(2); }
process.exit(0);
```

**Asset-specific reject rules (RESEARCH:214-219):**
1. **Closed-vocab — claim:** every `demonstrates[].claim` ∈ the run's claim list (load the run's
   `CLAIM-LIST.json` ids into a Set; off-list → REJECT). Mirrors validate-analyzer's claim_type reject.
2. **Closed-vocab — shot_type ∈ SHOT_TYPE_ENUM**, **disqualifiers[] ∈ DISQUALIFIER_ENUM**, **strength ∈ STRENGTH_ENUM**.
3. **Grounding check:** each `demonstrates[]` entry must carry `strength` AND `evidence` (non-empty).
   This is the script-enforceable half of the spec's "tag only what's in the pixels" rule — the script
   can't see pixels but CAN reject a claim entry missing `evidence` (mirrors validate-analyzer's
   verbatim-substring gate: the structural enforcement of a grounding discipline). Pitfall-4 in RESEARCH.
4. (video) `demonstrates[].at` (timestamp) present + `best_use` ∈ `{hero_loop, feature_demo, full_explainer}`.

**Orchestrator-run, not auto-fired:** hooks DON'T fire inside subagents → the orchestrator runs this
validator on each returned record before persist (same as funnel-deep-pass embeds context as an
orchestrator step). The PostToolUse wiring is the *form* to copy; the *invocation* is an orchestrator step.

---

### `tools/asset/section-table.json` (config — claim→eligible sections)
**Analog:** spec §Section table (spec:155-166) + RESEARCH open-item-3 (RESEARCH:140-152)
**Extract verbatim** (RESEARCH already wrote the JSON):
```json
{ "see_through_display_on": { "primary": ["hero"], "also": ["feature_transparency"], "requires": {"display_state": "on_legible"} },
  "transparency_internals_visible": { "primary": ["feature_transparency"], "also": ["hero","specs"] },
  "pocket_scale": { "primary": ["feature_scale"], "also": ["lifestyle","hero"] },
  "retro_gaming": { "primary": ["feature_games"], "also": ["lifestyle","social_proof"] },
  "collectible_object": { "primary": ["lifestyle","final_cta"], "also": ["hero"] },
  "hackable_maker": { "primary": ["feature_maker"], "also": ["specs"] },
  "build_material_quality": { "primary": ["feature_transparency"], "also": ["specs"] },
  "whats_in_box": { "primary": ["offer"], "also": ["final_cta"] } }
```
`require()`-able by `asset-map-rank.js`. The `requires.display_state` conditional is load-bearing
(hero routing only when the shot is lit-through-glass).

### `tools/asset/section-list.default.json` (config — LP section list defaults)
**Analog:** spec §Section table RHS (spec:155-166) + RESEARCH open-item-4 (RESEARCH:156-163)
**Extract** the section names (the table's RHS): `hero, feature_transparency, feature_scale,
feature_games, feature_maker, lifestyle, specs, social_proof, offer, final_cta`. Plus video-only
slots from spec:218-220: `hero_loop, feature_demo`. `asset-map-rank.js` takes `--section-list=<path>`
to override when M1-S3 produces a funnel structure.

---

### `runs/arduview/asset-classify/CLAIM-LIST.json` (config — per-run input)
**Analog:** `launch/inkleaf-launch/LAUNCH-INPUTS.md` (per-launch variable sheet the product-agnostic process reads)

**Pattern (LAUNCH-INPUTS.md:1-7):** "Per-launch variable sheet. The runbook is product-agnostic; it
reads its product-specific values from THIS file. To launch a new product: copy, replace every value,
keep the structure." → Asset analog: the classifier machinery is product-agnostic; the claim list is
the per-run swap.

**Shape (RESEARCH open-item-2, RESEARCH:122-131):** each claim = `{ id, gloss, load_bearing: bool }`.
The 8 Arduview claims (spec:142-149), with the 2 load-bearing flagged (`see_through_display_on` +
`transparency_internals_visible` get the `display_state` special-case):
```json
{ "claims": [
    { "id": "transparency_internals_visible", "gloss": "see the PCB/board through shell+display", "load_bearing": true },
    { "id": "see_through_display_on", "gloss": "game pixels lit on the transparent pane", "load_bearing": true },
    { "id": "pocket_scale", "gloss": "size in hand / next to a common object (~50g)", "load_bearing": false },
    { "id": "retro_gaming", "gloss": "classic D-pad + A/B, pixel game on screen", "load_bearing": false },
    { "id": "collectible_object", "gloss": "desirable object to own/display", "load_bearing": false },
    { "id": "hackable_maker", "gloss": "USB-C data / Arduino-flashable / open framing", "load_bearing": false },
    { "id": "build_material_quality", "gloss": "resin finish, clean edges, premium feel", "load_bearing": false },
    { "id": "whats_in_box", "gloss": "unit + cable + packaging (offer completeness)", "load_bearing": false }
] }
```
The fan-out subagent receives this **embedded in its spawn prompt** (small, trusted operator input —
unlike the image, which it Reads).

---

### `tools/asset-analyzer-context.js` (OPTIONAL script, assemble — brick-4 context-builder)
**Analog:** `tools/funnel-analyzer-context.js` — **the one structural difference is the Read-path**

funnel-analyzer-context embeds *bytes* (DR bundle + funnel copy). The asset context-builder embeds
*trusted text* (fact sheet + claim list + vocab) and **hands a file path the agent Reads** — pixels
never enter context (Pitfall-1, the proof's load-bearing move).

**Header/boundary/assemble spine to mirror** (funnel-analyzer-context.js:191-226):
```javascript
const SEP = '='.repeat(72);
const headerBlock = [
  SEP,
  '=== ASSET CLASSIFY CONTEXT (assembled by asset-analyzer-context.js) ===',
  '=== Trusted context follows. The IMAGE/CONTACT-SHEET is a file path you MUST Read. ===',
  `=== asset_id: ${assetId} ===`,
  SEP, '',
].join('\n');
// trusted text: product fact sheet + claim list (from CLAIM-LIST.json) + controlled vocab
// THEN — the difference from funnel: a Read instruction, not embedded bytes:
const readBlock = `\nREAD THIS FILE NOW (it is the downscaled image / the ordered contact sheets):\n  ${workPath}\n`;
const assembled = headerBlock + factSheetBlock + claimListBlock + vocabBlock + readBlock;
```
For brick 4v, `readBlock` lists the **ordered contact-sheet paths** for ONE video.
**Spawn-a-sibling-script pattern** (funnel-analyzer-context.js:167-182) applies if it needs to pull the
fact sheet from another tool. The planner may instead fold this assembly into the SKILL.md orchestrator
step (it's small) — but the boundary/Read-path structure above is the contract either way.

---

### `.claude/skills/asset-classify/SKILL.md` (provider, orchestrator — structural twin of funnel-deep-pass)
**Analog:** `.claude/skills/funnel-deep-pass/SKILL.md` — copy structure verbatim, swap the domain

**Frontmatter** (funnel-deep-pass:1-13): `name`/`description` summarizing the deterministic chain →
fan-out → validate → persist spine.

**ENFORCEMENT MAP table** (funnel-deep-pass:48-63) — the deterministic-vs-judgment ledger. Asset version:
```markdown
| Step | Kind | Mechanism | What enforces it |
|------|------|-----------|-----------------|
| asset-fetch.js | DETERMINISTIC | script | copies to assets/raw/, writes raw-manifest.json; exit non-zero on bad input |
| probe.py / probe_video.py | DETERMINISTIC | python script | technical{}+phash / probe{} via .venv/bin/python; exits non-zero |
| sample_montage.py | DETERMINISTIC | python script | 5fps frames + PIL timestamped sheets |
| **relevance-bucket** | **JUDGMENT** | **agent (cheap)** | one field; Reads the work_path; validated by orchestrator |
| **role-classify / comprehend-video** | **JUDGMENT** | **agent (quality, fan-out)** | claim-tagged record; gated by validate-asset-record.js |
| validate-asset-record.js | DETERMINISTIC | hook (orchestrator-run) | closed-vocab + grounding reject |
| asset-map-rank.js | DETERMINISTIC | script | routes via section-table.json; emits gap_list |
| asset-emit.js | DETERMINISTIC | script | writes images/videos.json + IMAGES/VIDEOS.md |
| asset-upload.js | DETERMINISTIC | script | url-map.json backfill |
```
Plus the "Three load-bearing truths" plain-fact block (funnel-deep-pass:64-78) — asset version states:
(1) the agents **Read a local work_path** (bytes never in context — the proof's move); (2)
validate-asset-record REJECTS off-vocab / un-grounded records deterministically; (3) only
relevance-bucket + role-classify/comprehend-video are judgment agents — everything else is script/hook.

**PRECONDITION CHECK** (funnel-deep-pass:82-97) — copy the `test -f ... || { echo MISSING; exit 1; }`
bash idiom. Asset preconditions: `.venv` exists + imagehash/imageio-ffmpeg installed;
`runs/<space>/asset-classify/CLAIM-LIST.json` present; `tools/asset/section-table.json` present;
local asset set present (`--local` dir).

**DETERMINISTIC CHAIN** (funnel-deep-pass:100-127) — copy-paste bash, asset version:
`asset-fetch.js --local=<dir>` → `probe.py` per image → `[video: probe_video.py → sample_montage.py]`.

**PER-ASSET FAN-OUT LOOP** (funnel-deep-pass:131-179) — the (a) spawn cheap Router/relevance-bucket,
(b) deterministic context-assemble = YOUR step, (c) spawn quality analyzer with context, (d) persist
spine. Asset difference (folded at step b/c): context embeds trusted text + a **Read path**, not bytes;
hand contact-sheet paths for 4v. One subagent per image (brick 4) / per video (brick 4v), parallel, blind.

**AGENT PROMPTS folded in verbatim** (funnel-deep-pass:183-475) — the SKILL.md owns the prompts (they
"live nowhere else"). Write three: **relevance-bucket** (cheap, one field, like the Router at
funnel-deep-pass:189-243), **role-classify** (quality, the spec brick-4 method spec:94-133 + the record
schema spec:58-83), **comprehend-video** (quality, spec brick-4v method spec:222-241 + video record
spec:245-274). Reuse the funnel "DISCIPLINE — DESCRIPTIVE/OBSERVE-FIRST" + "UNTRUSTED DATA BOUNDARY"
blocks (funnel-deep-pass:283-339) — for assets the untrusted material is the **image the agent Reads**;
the grounding rule (spec:29-33) is the asset analog of the verbatim discipline.

**HAND-OFF section** (funnel-deep-pass:479-483) — after `asset-map-rank.js` + `asset-emit.js`, the
manifest is ready for the human **pick gate (brick 6)** then Phase 15's builder.

---

## No Analog Found

| File | Role | Data flow | Reason / what to use instead |
|------|------|-----------|------------------------------|
| `tools/asset/probe_video.py` | python script | transform | Repo is 100% Node; no Python video tooling. Seed from RESEARCH §Code Examples (brick 2v, imageio-ffmpeg). First run IS the UAT (unproven video track). |
| `tools/asset/sample_montage.py` | python script | batch | Same — net-new. Seed from RESEARCH §Code Examples (brick 3v, PIL montage). PIL tile/timestamp is a deliberate spec deviation (RESEARCH §Flagged #1). |

> `probe.py` has a *partial* analog (the proof pipeline ran the downscale+exif in Python live), so it is
> NOT listed here — RESEARCH §Code Examples (brick 2) is the paste-ready seed.

---

## Wave-0 setup (must precede any brick run — RESEARCH:415-419)
- `.venv` + `pip install imagehash imageio-ffmpeg` (Pillow already present; PEP 668 blocks bare pip — box is EXTERNALLY-MANAGED).
- Node bricks spawn `.venv/bin/python tools/asset/<brick>.py` explicitly (S5 convention).
- Author `tools/asset/section-table.json`, `section-list.default.json`, `runs/arduview/asset-classify/CLAIM-LIST.json` (all extracted-from-spec above).

## Metadata
**Analog search scope:** `tools/` (Node bricks + hooks), `.claude/skills/`, `launch/inkleaf-launch/`, `runs/arduview/`
**Files scanned:** 8 analogs read in full (crowdfund-fetch.js, funnel-store.js, validate-analyzer.js, funnel-analyzer-context.js, funnel-deep-pass/SKILL.md, IMAGES.md, VIDEOS.md, LAUNCH-INPUTS.md) + proof + spec + RESEARCH
**Pattern extraction date:** 2026-06-04
