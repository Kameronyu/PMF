# Phase 16: Stage M1-S16 — Asset Classifier (image + video bricks) — Research

**Researched:** 2026-06-04
**Domain:** Local image/video ingest + vision-agent fan-out classification + manifest emit (no-system-ffmpeg box)
**Confidence:** HIGH (env probed live; spec + proof are the authority; only the *unproven video track* carries MEDIUM)

## Summary

The image string is **already proven** (`runs/arduview/_asset-classify-proof.md`): copy local files → PIL
downscale (1400px, EXIF-corrected) → vision Read of the local path → claim-tagged record. This phase builds
that proof into the 8-brick string per `prompts/_specs/image-classifier-brick.md`, adds the 3 video bricks
(2v probe-video, 3v sample+montage, 4v comprehend-video), and makes the whole thing UAT-able **standalone on
the local Arduview set** (5 JPGs + 3 MP4s, present at `/mnt/c/Users/kyu3/Downloads/arduview visuals/`).

The four open items resolve cleanly. The video decoder is the only real unknown, and it is **solved**: this
box has **no system ffmpeg** and **no numpy/PyAV/imageio/cv2** — only PIL 12.2.0. The recommended recipe is
**`imageio-ffmpeg` (bundles a static ffmpeg binary in a 29.5 MB manylinux wheel — verified) for frame
extraction at 5 fps, then PIL for the tile+timestamp montage** (the spec's `tile=5x6`+`drawtext` has no need
to stay inside ffmpeg; PIL does the grid and the `mm:ss.ff` text). This keeps the no-system-ffmpeg constraint
honored with one pip package.

The biggest **non-spec planning decision** the planner must make: the repo's `tools/` is **100% Node today**,
but every pixel operation (downscale, perceptual-hash, frame-sample, montage) is a **Python/PIL** job. The
proof itself ran in Python. **Recommendation: image/video pixel bricks (2, 2v, 3v, and the downscale step)
are Python scripts under `tools/asset/`; the orchestration + manifest-emit + Shopify-upload bricks (1, 5, 7,
8) stay Node** to match `funnel-store.js`/`crowdfund-fetch.js` conventions and reuse the Playwright + JSON-store
patterns. This is a clean split along the deterministic-job-type line and does not violate the brick model.

**Primary recommendation:** Build with `pip install imagehash imageio-ffmpeg` (Pillow already present) inside a
project `.venv` (PEP 668 blocks bare pip — verified `EXTERNALLY-MANAGED`). Fetch brick gets a `--local` mode
pointed at the Arduview folder so the phase UATs without the cross-account Drive blocker. Mirror
`funnel-deep-pass/SKILL.md` for the brick-4/4v fan-out orchestration verbatim (deterministic assemble → embed
in spawn prompt → validate-on-return → persist), but the asset agents **Read a local file path** (image or
contact-sheet) instead of receiving embedded text bytes.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|--------------|----------------|-----------|
| Fetch / ingest (Drive or local) | Node script (`tools/`) | Drive MCP (prod mode) | I/O + dir listing; matches `crowdfund-fetch.js` style; Drive MCP is an orchestrator call |
| Probe + downscale + p-hash (brick 2) | **Python script** (PIL/imagehash) | — | pixel measurement; PIL is the only imaging lib on box; proof ran in Python |
| Probe-video (brick 2v) | **Python script** (imageio-ffmpeg) | — | needs a decoder for duration/fps/codec; ffprobe-equivalent via the bundled binary |
| Sample 5fps + montage (brick 3v) | **Python script** (imageio-ffmpeg + PIL) | — | decode frames + PIL tile/drawtext; pixel work |
| relevance-bucket (brick 3) | Vision agent (cheap) | — | judgment; reads local downscaled path |
| role-classify / comprehend-video (brick 4/4v) | Vision agent (quality, fan-out) | — | the core judgment; one subagent per asset/video |
| map+rank (brick 5) | Node script | section-table file | deterministic routing via editable table |
| pick gate (brick 6) | Human | — | the one human Decide |
| emit manifest (brick 7) | Node script | — | writes IMAGES/VIDEOS.md + json; matches launch/ format |
| upload + url-backfill (brick 8) | Node script | Shopify Admin API / manual | Shopify Files; video CDN URLs hashed → capture-after-upload |

## Standard Stack

### Core (Python — pixel bricks)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Pillow (PIL) | 12.2.0 (installed) | downscale, EXIF-correct, tile montage, drawtext labels | `[VERIFIED: python3 -c import PIL]` already on box; proof used it; `ImageOps.exif_transpose` present |
| imagehash | 4.3.2 | perceptual-hash dedupe (`dup_of`) | `[CITED: pypi.org/project/ImageHash]` standard pHash/dHash lib; depends on PIL (already here) + scipy/numpy |
| imageio-ffmpeg | 0.6.0 | self-contained ffmpeg binary for frame extraction + probe | `[VERIFIED: pip --dry-run]` resolves `imageio_ffmpeg-0.6.0-py3-none-manylinux2014_x86_64.whl` 29.5 MB, **bundles the ffmpeg exe — no system install** |

### Core (Node — orchestration/emit bricks)
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| node stdlib (`fs`/`path`/`child_process`) | n/a | arg-parse, JSON store, spawn python bricks | matches every existing `tools/*.js` |
| playwright (optional, brick 8) | already a dep | Shopify Files upload + grab hashed video URL | `[VERIFIED: crowdfund-fetch.js requires playwright]` already installed; reuse for admin UI automation if API not wired |

### Supporting / Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| imageio-ffmpeg | `pip install av` (PyAV) | PyAV also bundles ffmpeg libs in a manylinux wheel `[VERIFIED: web]` and gives finer frame control, BUT it's a heavier C-binding API; **imageio-ffmpeg is lighter for "sample at fps + read frames" and exposes the raw `ffmpeg` exe** (lets brick 2v/3v call `-vf fps=5` directly per the spec). Pick imageio-ffmpeg. |
| imageio-ffmpeg | system `apt install ffmpeg` | violates no-system-ffmpeg constraint (and box has no ffmpeg) — rejected |
| PIL montage | ffmpeg `tile=5x6`+`drawtext` | spec *names* ffmpeg tile/drawtext, but PIL does the grid + `mm:ss.ff` text with zero extra deps and full control over per-cell labels. **Do the tile+text in PIL** (frames out of the decoder, montage in PIL). Surface this as a benign spec deviation (§ Flagged below). |
| imagehash dedupe | hand-rolled average-hash | don't hand-roll perceptual hashing — see Don't Hand-Roll |

**Installation (PEP 668 — box is `EXTERNALLY-MANAGED`, verified):**
```bash
# project venv (no .venv exists yet — create one; repo has zero python tooling today)
python3 -m venv .venv && . .venv/bin/activate
pip install imagehash imageio-ffmpeg   # Pillow already satisfied (12.2.0)
# brick scripts call .venv/bin/python explicitly so Node spawn works without an active shell
```
> Do NOT use bare `pip install` (PEP 668 blocks it) — use the venv, or `--break-system-packages` only as a
> documented fallback. `[VERIFIED: /usr/lib/python3.12/EXTERNALLY-MANAGED present]`

**Version verification (this session):**
- Pillow `12.2.0` — `[VERIFIED: import PIL]`
- imageio-ffmpeg `0.6.0` manylinux2014 wheel, 29.5 MB, bundled binary — `[VERIFIED: pip install --dry-run]`
- imagehash latest `4.3.x` — `[CITED: pypi.org/project/ImageHash]` (not dry-run'd; pulls scipy+numpy as deps)

---

## RESOLVED: the 4 open items + technical unknowns

### Open item 1 — Video decoder (NO ffmpeg on box) → SOLVED

**Recipe (no system ffmpeg, one pip package):**
1. `pip install imageio-ffmpeg` → ships a static ffmpeg binary; get its path with
   `from imageio_ffmpeg import get_ffmpeg_exe; FFMPEG = get_ffmpeg_exe()` `[VERIFIED: web — get_ffmpeg_exe returns the bundled binary]`.
2. **Brick 2v (probe-video):** call the bundled `ffmpeg -i <video>` (stderr carries duration/res/fps/codec/audio)
   OR `imageio.v3`-style read of metadata. Parse `duration_s, w, h, fps, has_audio, aspect, bytes`. Flag oversize
   (the real Arduview MP4s are **177 / 192 / 224 MB**, 9:16 — `[VERIFIED: ls -la]`, matching the spec's 198 MB case).
3. **Brick 3v (sample at 5fps):** `FFMPEG -i <video> -vf fps=5 frames/<vid>/f%04d.jpg` (the spec's exact `-vf fps=5`).
4. **Brick 3v (montage):** load the JPG frames with **PIL**, paste into an N×M grid (spec default 5×6 = 30 frames =
   6 s per sheet at 5 fps), and stamp each cell's `mm:ss.ff` with `PIL.ImageDraw.text` (frame index ÷ 5 → time).
   Write `sheets/<vid>-s01.jpg …`. This replaces ffmpeg `tile`+`drawtext` with PIL — **deliberate, see § Flagged**.

**Oversize handling (flag for the planner):** 224 MB 9:16 clips decoded at 5 fps for ~20–30 s = ~100–150 frames =
manageable. BUT: (a) extract to a scratch dir and clean up frames after montage (don't leave ~150 JPGs/clip lying
around); (b) downscale each montage cell (e.g. cell long-edge ~320–400px) so a 5×6 sheet stays a normal Read-able
image, not a 4K monster — same load-bearing logic as the 1400px image downscale; (c) cap clip duration handled per
sheet (a 30 s clip = 5 sheets), so there's no single oversize read.

**PyAV is the fallback** (`pip install av`, also bundles ffmpeg, manylinux wheel `[VERIFIED: web]`) if
imageio-ffmpeg's bundled binary misbehaves on WSL2 — but imageio-ffmpeg is the recommendation because it hands
you the raw `ffmpeg` exe so brick 2v/3v use the spec's literal `-vf fps=5` flags.

### Open item 2 — Per-product claim list storage → ARTIFACT RECOMMENDED

The spec says "a per-launch input, like `LAUNCH-INPUTS.md`." Confirmed pattern: `launch/inkleaf-launch/LAUNCH-INPUTS.md`
is a per-product variable sheet the product-agnostic runbook reads. **Recommendation:** author the claim list as a
small per-run input file the classifier reads, co-located with the run, not in the agent prompt:

- **Location:** `runs/<space>/asset-classify/CLAIM-LIST.md` (or `.json`) per run — alongside the existing
  `runs/arduview/` artifacts. For Arduview the 8 claims are already written verbatim in the spec (§ Controlled
  vocabularies → claim list): `transparency_internals_visible`, `see_through_display_on`, `pocket_scale`,
  `retro_gaming`, `collectible_object`, `hackable_maker`, `build_material_quality`, `whats_in_box`.
- **Shape:** each claim = `{ id, gloss, load_bearing: bool }`. `load_bearing` flags the one-or-two claims that get
  the `display_state` special-case (spec brick-4 step 3) — for Arduview: `see_through_display_on` +
  `transparency_internals_visible`.
- **Why a file, not hardcoded:** swap per product; the machinery stays product-agnostic (spec's stated goal). The
  fan-out subagent receives the claim list embedded in its spawn prompt (it's small, trusted operator input — unlike
  the image, which it Reads).

### Open item 3 — Section-routing table (claim → eligible_sections) → ARTIFACT RECOMMENDED

The spec mandates this lives as a **deterministic, editable table brick 5 reads — NOT in the agent**. The Arduview
table is in the spec (§ Controlled vocabularies → Section table).

- **Location:** `tools/asset/section-table.json` (product-agnostic default, version-controlled) with a per-run
  override at `runs/<space>/asset-classify/section-table.json` if a product needs different routing.
- **Shape:**
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
  Note the `requires.display_state: on_legible` conditional on the hero-routing row — brick 5 reads `display_state`
  off the record to honor "the lit-through-glass shot is the hero" rule deterministically.
- **Why JSON not MD:** brick 5 is a Node script; JSON is directly `require()`-able. Keep a human-readable mirror in the
  spec; the JSON is the machine source. Editable without re-running vision (the whole point).

### Open item 4 — Section list defaults (M1-S3 funnel container not available) → DEFAULT + SEAM

M1-S3 deep-analysis container is `PLANNED`, not built (ROADMAP). **Use the spec's default crowdfunding/DTC section
list** (the section table's RHS section names: `hero, feature_transparency, feature_scale, feature_games,
feature_maker, lifestyle, specs, social_proof, offer, final_cta`) as a `tools/asset/section-list.default.json`.
Document the seam: brick 5 takes an optional `--section-list=<path>` arg; when M1-S3 produces a funnel structure,
wire it by pointing that arg at the container's section output. No agent change needed — section-routing stays in
the table.

### Technical unknown — Drive fetch (brick 1) two modes → LOCAL MODE FOR UAT

The Drive MCP is authed to one Google account; the real Arduview set is in **Louis Huang's** Drive (cross-account →
"not found") `[CITED: spec Open items + proof]`. Local copies exist at
`/mnt/c/Users/kyu3/Downloads/arduview visuals/` `[VERIFIED: ls]`.

- **`--local=<dir>` mode (UAT / what to build first):** the fetch brick globs `*.jpg/*.png/*.mp4` from a local
  folder, copies them to `assets/raw/`, assigns ids (`arduview-0001…` / `arduview-vid-01…`), and writes
  `raw-manifest.json` with `{ id, source: {local_path, original_name}, kind: image|video }`. This makes the phase
  UAT standalone — the proof already classified the local downscales.
- **`--drive-folder-id=<id>` mode (production):** documented path via the Drive MCP `list folder → download each`,
  then identical id-assignment + raw-manifest write. Blocked on cross-account share; not on the UAT critical path.
- **Pattern to copy:** arg-parse + dir I/O + JSON manifest write from `crowdfund-fetch.js` (lines 39–80 arg/opts
  parse; lines 383–404 file writes). Fetch is a **Node** script (I/O + MCP-orchestrator-call, not pixel work).

> Note: there are also large `drive-download-*.zip` files (2 GB / 1.5 GB) in the visuals dir — if the planner wants
> the *full* Drive set without the cross-account block, an unzip-then-`--local` path works. Flag: those zips are big;
> the 5 JPG + 3 MP4 loose set is the proven UAT target — start there.

### Technical unknown — Image downscale placement → INSIDE BRICK 2 (probe)

The proof established PIL downscale to **1400px long-edge, EXIF-corrected** (`ImageOps.exif_transpose` —
`[VERIFIED: available]`) is **load-bearing**: it keeps image bytes out of context so the vision agent Reads a
*small* file path. **Recommendation: fold downscale into brick 2 (probe)** — probe already opens each image to read
w/h/format/bytes; emit a downscaled `assets/work/<id>.jpg` alongside the `technical{}` block in the same pass.
The vision agents (brick 3, 4) Read the `assets/work/` path, never `assets/raw/`. Record both paths on the record
(`source.local_path` = raw original for upload; `work_path` = downscaled for vision).

### Technical unknown — Perceptual-hash dedupe (brick 2) → imagehash

Use **`imagehash`** (pHash or dHash) over PIL to fill `dup_of`. The proof's **img-04 vs img-05 near-dup is the
test case** (the records literally say "Exactly the perceptual-hash case brick 2 catches"). Recommendation:
compute `phash` per image in brick 2; two images within a Hamming distance threshold (start ~5/64) → mark the
lower-resolution / softer one `dup_of: <winner_id>`. Don't hand-roll the hash. Verify on UAT: img-04 keeps,
img-05 → `dup_of: arduview-img-04`.

### Technical unknown — Parallel vision fan-out (brick 4/4v) → MIRROR funnel-deep-pass

Copy the `funnel-deep-pass/SKILL.md` orchestration spine **verbatim in structure**:
- **Deterministic assemble (orchestrator's step, hooks don't fire in subagents):** the brick-4 analog of
  `funnel-analyzer-context.js` assembles the per-asset spawn context = **product fact sheet + claim list +
  controlled vocab** (all trusted, embedded as text) **+ the local `work_path` to Read** (the image) — NOT the
  image bytes. This is the one structural difference from funnel-deep-pass: funnel agents get embedded *text*; asset
  agents get embedded *trusted text* **and a file path they Read** (the proof confirms vision-Read-of-path works and
  keeps bytes out of context). For 4v, the path(s) handed are the **ordered contact sheets** for one video.
- **Fan-out:** one `Task`/subagent per image (brick 4) or per video (brick 4v), in parallel, identical rubric, each
  blind to the others — exactly funnel-deep-pass's "spawn one Router + one Section Analyzer per funnel" pattern but
  with only the one classify agent (relevance-bucket brick 3 is a separate cheap pass, like the Router).
- **Validate on return:** mirror `validate-analyzer.js` (PostToolUse) as a `validate-asset-record.js` deterministic
  gate. Asset-specific checks: (a) every `demonstrates[].claim` ∈ the run's claim list (closed-vocab reject); (b)
  `shot_type` ∈ the controlled `shot_type` enum; (c) `disqualifiers[]` ∈ the disqualifier enum; (d) **grounding
  check** — `strength`/`evidence` present for each claim (the spec's load-bearing "tag only what's in the pixels"
  rule; the script can't see pixels, but it CAN reject a `demonstrates[]` entry missing `evidence`). Hooks don't fire
  in subagents → the **orchestrator runs the validator on each returned record** before persist (same as
  funnel-deep-pass embeds context as an orchestrator step).
- **Persist:** brick-5/store writes `images.json` / `videos.json` mirroring `funnel-store.js` (sanitized paths,
  `JSON.stringify(obj,null,2)`, underscore-meta keys, one wrapper object). The store is the brick-4 output collector
  that brick 5 ranks.

### Technical unknown — Manifest emit + query contract (bricks 5, 7) → CONFIRMED SHAPE

The builder query is: *`images.json` filtered to `demonstrates[].claim == X` AND `strength == strong` AND
`disqualifiers == []`, ranked by technical fit* (spec I/O contract). The record schema (spec brick-4 JSON) supports
this directly: `demonstrates[]` is an array of `{claim, strength, evidence}`, `disqualifiers[]` is an array,
`technical.min_safe_use` gives the fit rank. **Confirm in planning:**
- `images.json` = `{ records: [ <brick-4 record> … ], _provenance, gap_list: [...] }`. Queryable as-is.
- `IMAGES.md` mirrors `launch/inkleaf-launch/IMAGES.md` format: `## <section>` → table of `| role | pick | claim+strength |`
  → CDN URL column (empty until brick 8). The proof's "Manifest the builder would consume" table (img-01 hero,
  img-04 feature_transparency, img-05 dropped) is the exact target shape.
- `videos.json` adds `segments[]`, `best_use`, `loop_safe`, `needs_audio`, `poster_frame`, `eligible_slots`
  (spec brick-4v JSON). `VIDEOS.md` mirrors `launch/inkleaf-launch/VIDEOS.md` (file | spec | CDN URL) **plus** a
  poster-frame row.
- **gap_list:** brick 5 emits sections with no `strong` + clean image (the proof's "no clean-studio hero" gap is the
  test case — Arduview has zero clean-background hero, every shot has a busy/novelty bg).

### Technical unknown — Shopify upload + URL backfill (brick 8) → CONFIRMED + GOTCHA

`[CITED: LAUNCH-RUNBOOK.md D.0 lines 220–233 + VIDEOS.md note]`:
- **Images:** predictable CDN URL `https://cdn.shopify.com/s/files/1/<STORE_NUM_ID>/files/<filename>.jpg` — brick 8
  can *construct* these from filename + store num id once uploaded.
- **Videos:** **HASHED path** `https://cdn.shopify.com/videos/c/o/v/<hash>.mp4` — **cannot be constructed**; brick 8
  MUST capture each exact URL *after* upload. Also upload the chosen `poster_frame` as a normal image (predictable
  URL) for the `<video poster=…>` attribute.
- **Mechanism:** runbook says "Content → Files, or via API." Two implementable modes for brick 8: (a) **manual
  upload + paste** the returned URLs into a small input file the script reads to backfill the manifest (lowest-build,
  matches how InkLeaf was done — `VIDEOS.md` is hand-filled); (b) **Shopify Admin GraphQL `fileCreate` + poll**
  (programmatic, requires an Admin API token). **Recommendation for this phase:** build the manifest-backfill script
  to accept a `url-map.json` (filename → CDN URL) so it works with *either* manual or API upload — the hashed video
  URL problem makes a pure-construct approach impossible anyway. Defer full Admin-API automation (it needs store
  credentials that belong to M2/launch, out of this phase's scope per the scope guard).

---

## Closest-Analog Map (what each brick copies)

| Brick | Type | Lang | Copy the pattern from | Specific shape to mirror |
|-------|------|------|------------------------|---------------------------|
| 1 fetch | script | Node | `tools/crowdfund-fetch.js` | arg/opts parse (L39–80); dir I/O + JSON manifest write (L383–404); add `--local` + `--drive-folder-id` modes |
| 2 probe (+downscale +phash) | script | **Python** | proof pipeline (PIL downscale 1400px exif) + new | `ImageOps.exif_transpose`; emit `technical{}` + `work_path`; `imagehash.phash` → `dup_of` |
| 2v probe-video | script | **Python** | new (imageio-ffmpeg) | `get_ffmpeg_exe()` → parse `ffmpeg -i` stderr for duration/fps/codec/audio; oversize flag |
| 3v sample+montage | script | **Python** | new (imageio-ffmpeg + PIL) | `ffmpeg -vf fps=5`; PIL grid 5×6 + `ImageDraw.text` mm:ss.ff per cell; downscale cells |
| 3 relevance-bucket | agent (cheap) | — | `funnel-deep-pass` Router (cheap-model, one-field judgment, SKILL.md L189–243) | one classification field; Reads the `work_path` |
| 4 role-classify | agent (quality, fan-out) | — | `funnel-deep-pass` Section Analyzer + `funnel-analyzer-context.js` | orchestrator assembles fact-sheet+claim-list+vocab, embeds + hands a Read path; fan-out one-per-image |
| 4v comprehend-video | agent (quality, fan-out) | — | same | hands ordered contact-sheet paths for ONE video; emits segments[]/best_use/poster_frame |
| validate-asset-record | hook/script | Node | `tools/hooks/validate-analyzer.js` | closed-vocab reject (claim∈list, shot_type∈enum, disqualifier∈enum) + grounding (evidence present); orchestrator-run on return |
| 5 map+rank | script | Node | new + `section-table.json` | read table, route demonstrates[]→sections, rank by strength×min_safe_use, emit gap_list |
| 6 pick gate | human | — | — | operator reads manifest, picks per section |
| 7 emit manifest | script | Node | `funnel-store.js` (JSON store shape) + `launch/inkleaf-launch/IMAGES.md` (MD format) | wrapper obj + records[]; MD section→role→file→CDN-slot |
| 8 upload+url-backfill | script | Node | `crowdfund-fetch.js` (playwright, if UI-automate) + runbook D.0 | accept url-map.json; construct image URLs, capture hashed video URLs; backfill manifest |

**Orchestrator skill:** new `.claude/skills/asset-classify/SKILL.md`, structured exactly like
`funnel-deep-pass/SKILL.md` — ENFORCEMENT MAP table (deterministic vs judgment), PRECONDITION CHECK, the
deterministic chain (fetch→probe→[video: probe-video→sample+montage]), the per-asset fan-out loop, AGENT PROMPTS
folded in verbatim (relevance-bucket + role-classify + comprehend-video), then map+rank→emit→upload.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Perceptual-hash dedupe | custom average-hash/diff | `imagehash` (phash/dhash) | edge cases: rotation, exposure (img-04/05 differ in exposure), resize; library is battle-tested |
| Video frame extraction | custom decoder / raw byte parsing | `imageio-ffmpeg` bundled ffmpeg | container/codec hell; the bundled binary is the whole point |
| EXIF orientation | manual rotate by tag | `PIL.ImageOps.exif_transpose` | 8 EXIF orientation cases; the proof's "exif-corrected" is this |
| Frame→time math | guesswork | `frame_index / fps_sampled` | at 5 fps, cell N → `N/5` seconds → `mm:ss.ff`; deterministic, don't approximate |
| Shopify video URL | construct from filename | capture-after-upload | **hashed path — impossible to construct** (runbook warning) |

**Key insight:** every "deceptively simple" asset task here (hash, decode, EXIF, URL) has a known correct library or
a hard external constraint. The only thing to *build* is the orchestration glue and the routing table.

---

## Common Pitfalls

### Pitfall 1: Feeding image bytes through context instead of a file path
**What goes wrong:** vision agent base64s a 9 MB image into context, blows the window.
**Why:** intuitive to "send the image to the agent."
**Avoid:** the proof's load-bearing move — downscale to 1400px in brick 2, agent **Reads the local `work_path`**.
Bytes never enter context. (Spec brick-1 rationale: "images land on disk so the vision agents read file paths,
never base64-through-context.")
**Warning sign:** agent spawn prompt contains image data, not a path.

### Pitfall 2: 5 fps × long clip = unreadable montage
**What goes wrong:** a 30 s clip = 150 frames; an agent can't read 150 images, and a single 150-cell sheet is huge.
**Avoid:** spec's design — tile 30 frames/sheet (5×6 = 6 s/sheet), downscale cells, agent reads sheets *in order*
to rebuild the timeline. Cap cell resolution.
**Warning sign:** a sheet file > a few MB, or one sheet per clip.

### Pitfall 3: pip fails silently (PEP 668)
**What goes wrong:** `pip install imagehash` errors `externally-managed-environment`; brick scripts then fail at runtime.
**Avoid:** create `.venv`, install there, and have Node bricks spawn `.venv/bin/python` explicitly (not `python3`).
**Warning sign:** `ModuleNotFoundError` at brick 2/2v/3v runtime. `[VERIFIED: EXTERNALLY-MANAGED present]`

### Pitfall 4: Agent flatters the image (grounding violation)
**What goes wrong:** agent tags `transparency_internals_visible` because "the product is transparent," not because the
pixels show the board → builder puts a weak image on a load-bearing claim.
**Avoid:** spec's grounding rule + the `validate-asset-record` gate rejecting `demonstrates[]` entries missing pixel
`evidence`. The agent describes `in_frame` literally FIRST, then walks the claim list.
**Warning sign:** `evidence` strings that restate the claim instead of citing pixels.

### Pitfall 5: Cross-account Drive blocks the whole phase
**What goes wrong:** fetch brick only does Drive; Louis's folder returns "not found"; nothing runs.
**Avoid:** build `--local` mode first, UAT on the local Arduview set. Drive is the documented prod mode, not the UAT
dependency. `[CITED: spec Open items + proof]`

---

## Code Examples (verified patterns to seed bricks)

### Brick 2 — EXIF-correct downscale + phash (Python)
```python
# Source: proof pipeline (PIL downscale 1400px exif-corrected) + imagehash docs
from PIL import Image, ImageOps
import imagehash
def probe_and_downscale(raw_path, work_path, max_edge=1400):
    im = ImageOps.exif_transpose(Image.open(raw_path))   # [VERIFIED: ImageOps.exif_transpose present]
    w, h = im.size
    technical = {"w": w, "h": h, "aspect": f"{w}:{h}", "bytes": __import__("os").path.getsize(raw_path)}
    phash = str(imagehash.phash(im))                      # dup_of comparison done across the set
    im.thumbnail((max_edge, max_edge))
    im.convert("RGB").save(work_path, "JPEG", quality=88)
    return technical, phash
```

### Brick 3v — 5fps sample (bundled ffmpeg) + PIL montage (Python)
```python
# Source: imageio-ffmpeg get_ffmpeg_exe [VERIFIED: web]; spec -vf fps=5 / tile=5x6 (tile done in PIL)
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
        t = i / fps; ts = f"{int(t//60):02d}:{t%60:05.2f}"     # mm:ss.ff — deterministic frame→time
        d.text((x+4, y+4), ts, fill="yellow")
    sheet.save(sheet_path, "JPEG", quality=85)
```

### Brick 2v — probe via bundled ffmpeg (Python)
```python
# Source: imageio-ffmpeg bundled binary; parse `ffmpeg -i` stderr (ffprobe-equivalent on a no-ffprobe box)
import subprocess
from imageio_ffmpeg import get_ffmpeg_exe
def probe_video(video):
    r = subprocess.run([get_ffmpeg_exe(), "-i", video], capture_output=True, text=True)
    meta = r.stderr  # ffmpeg prints stream info to stderr: Duration, Stream #...: Video: codec WxH, fps; Audio:
    return meta      # parse Duration/Video/Audio lines into duration_s,w,h,fps,codec,has_audio
```

---

## State of the Art

| Old Approach | Current Approach | Impact |
|--------------|------------------|--------|
| system `apt install ffmpeg` | `pip install imageio-ffmpeg` (bundled binary) | self-contained, no root, honors no-system-ffmpeg `[VERIFIED]` |
| build PyAV from source vs system ffmpeg | `pip install av` ships manylinux wheel w/ bundled libs since 8.0 | `[VERIFIED: web]` — both decoder options are now pip-only |
| hand-catalogue images by slot (InkLeaf) | claim-first classification (this phase) | builder retrieves by claim-proven+strength, not slot — the whole spec thesis |

**Deprecated/outdated:** none material. Note imageio split out `imageio-ffmpeg` as a separate package years ago
(`[CITED: moviepy#908]`) — install `imageio-ffmpeg` directly, not `imageio[ffmpeg]`, to get just the binary.

---

## Validation Architecture (UAT — `nyquist_validation: false`, so this is the human-UAT plan, not unit tests)

Per `.planning/config.json` `nyquist_validation: false` and STATE.md "Verification is UAT, not unit tests."
Success criteria 3 & 5 are the gates:

| Criterion | UAT check | Automatable pre-check |
|-----------|-----------|------------------------|
| SC1 — 8-brick string, right executor | each brick is script/agent/human per the brick model | grep: pixel bricks are Python, no "agent that cleans" |
| SC2 — claim-tagged grounded record, fan-out | run brick 4 on the 5 local JPGs; records carry claim+strength+evidence | `validate-asset-record.js` passes; one subagent per image |
| **SC3 — manifest the builder can query** | `images.json`/`videos.json` query by claim+strong+clean returns the right asset; IMAGES.md mirrors launch format; dedupe+disqualifiers+gap_list present | replay the proof: img-04 keeps, img-05→`dup_of`; img-02 strawberry-bg → `disqualifiers`; no-clean-hero → gap_list |
| SC4 — video 5fps+sheets+timeline | run 2v/3v/4v on the 3 Arduview MP4s; sheets timestamped, record has segments[]+motion_value+best_use+poster_frame | sheets exist, cell timestamps correct (frame/5); oversize (224 MB) handled |
| **SC5 — human pick gate** | operator reads the manifest, makes per-section picks; picks usable by Phase 15 | manifest is human-readable; gap_list tells operator what to reshoot |

**UAT dataset (standalone, no Drive):** `/mnt/c/Users/kyu3/Downloads/arduview visuals/` — 5 JPGs (proof's img-01..05)
+ 3 MP4s (177/192/224 MB) `[VERIFIED: ls]`. The image string has a known-good expected output (the proof's records +
manifest table) — replay it as the image-string acceptance. The video string is the **net-new unproven track** —
its first real run IS the UAT.

**Wave-0 gaps (setup before bricks run):**
- [ ] `.venv` + `pip install imagehash imageio-ffmpeg` (no project venv exists; PEP 668 blocks bare pip)
- [ ] `tools/asset/section-table.json` + `section-list.default.json` (extract from spec)
- [ ] `runs/arduview/asset-classify/CLAIM-LIST.json` (8 Arduview claims from spec, mark 2 load-bearing)
- [ ] decide Node↔Python spawn convention (Node bricks call `.venv/bin/python tools/asset/<brick>.py`)

---

## Flagged — spec proposals research found need-adjusting (NOT silently overridden)

1. **Montage: spec says ffmpeg `tile=5x6`+`drawtext`; recommend PIL instead.** The box has no system ffmpeg; the
   bundled `imageio-ffmpeg` binary CAN do `tile`+`drawtext` filters, but `drawtext` requires a fontconfig/freetype
   build that the bundled static binary may not include, and per-cell `mm:ss.ff` math is cleaner in Python. **Decode
   frames with the bundled ffmpeg (`-vf fps=5`), montage+timestamp in PIL.** Same output, fewer failure modes,
   honors no-system-ffmpeg. Surface to operator — it's a benign implementation swap, the spec's *intent* (5fps
   timestamped contact sheets) is fully preserved.

2. **Repo is all-Node; this phase introduces Python.** Not a spec issue but a convention decision the planner must
   make explicit. Pixel work has no Node equivalent on this box (PIL is Python). Split: Python for pixels
   (2,2v,3v,downscale), Node for orchestration/emit/upload (1,5,7,8) + the orchestrator skill. Document the
   `.venv/bin/python` spawn convention so it's reproducible.

3. **`imagehash` pulls numpy+scipy** (not on box). Adds ~weight to the venv. Acceptable; alternative is a tiny
   hand-rolled dHash (rejected — Don't Hand-Roll). Just note the install footprint.

4. **Brick 8 full Shopify automation is out of scope** (scope guard: don't touch launch/M2; needs store creds).
   Build the manifest-backfill to accept a `url-map.json` so it works with manual OR API upload; the hashed video
   URL makes pure-construct impossible regardless. The *capability to backfill* is in-phase; the *credentialed
   upload* rides M2.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | imageio-ffmpeg's bundled binary handles 9:16 224 MB MP4s on WSL2 without OOM | Open item 1 | LOW — fallback PyAV; first video run is the UAT anyway |
| A2 | bundled ffmpeg `-i` stderr carries parseable duration/fps/codec (no ffprobe) | Brick 2v | LOW — standard ffmpeg behavior; verify on first run |
| A3 | phash Hamming threshold ~5/64 correctly flags img-04/05 as dup, keeps img-01..03 distinct | Brick 2 dedupe | LOW — tune on the known test case during UAT |
| A4 | Shopify Files still uses the documented predictable-image / hashed-video URL split (runbook is recent) | Brick 8 | LOW — runbook is current launch doc; manual url-map path is robust either way |
| A5 | The claim-list/section-table belong in `runs/<space>/asset-classify/` + `tools/asset/` | Open items 2,3 | LOW — operator may prefer a different location; trivial to move |

> Items A1–A2 (the video decoder behaviors) are the only ones worth confirming on the first real run — they're the
> unproven video track. Everything image-side is replaying a proven pipeline.

## Open Questions

1. **Drive prod-mode auth** — cross-account share to the connected Google account is still pending (spec Open items).
   - Known: local `--local` mode unblocks UAT entirely.
   - Recommendation: build/UAT on local; leave Drive mode wired-but-untested until the folder is shared.
2. **Shopify upload mechanism for brick 8** — manual paste vs Admin GraphQL `fileCreate`.
   - Recommendation: `url-map.json` backfill works with both; defer credentialed API automation to M2 (scope guard).
3. **Section list from M1-S3** — not built yet.
   - Recommendation: default list + `--section-list` seam; wire when the funnel container exists.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|-------------|-----------|---------|----------|
| Python | bricks 2,2v,3v | ✓ | 3.12.3 | — |
| Pillow (PIL) | downscale, montage | ✓ | 12.2.0 | — |
| Node | bricks 1,5,7,8, orchestrator | ✓ | 20.20.0 | — |
| Playwright | brick 8 (optional UI upload) | ✓ (repo dep) | — | manual upload + url-map.json |
| system ffmpeg | video decode | ✗ | — | **`pip install imageio-ffmpeg` (bundled binary)** |
| imagehash | brick 2 dedupe | ✗ | — | install to venv |
| imageio-ffmpeg | bricks 2v,3v | ✗ | — | install to venv (or PyAV) |
| numpy/scipy | imagehash dep | ✗ | — | pulled in by imagehash install |
| Drive MCP (cross-account folder) | brick 1 prod mode | ✗ (auth) | — | **`--local` mode on the Downloads set** |

**Missing with no fallback:** none — every gap has a pip install or a local-mode workaround.
**Missing with fallback:** system ffmpeg → imageio-ffmpeg; Drive cross-account → local mode; Shopify API → manual url-map.

## Sources

### Primary (HIGH)
- `prompts/_specs/image-classifier-brick.md` — build authority (brick string, record schema, vocab, video extension, I/O contract)
- `runs/arduview/_asset-classify-proof.md` — live proof of the image string (records, dedupe/disqualifier/gap, video-decoder note)
- `.claude/skills/funnel-deep-pass/SKILL.md` — orchestration analog (deterministic-assemble → embed → validate-on-return → persist)
- `tools/crowdfund-fetch.js`, `tools/funnel-analyzer-context.js`, `tools/funnel-store.js` — script conventions to copy
- `launch/inkleaf-launch/IMAGES.md` / `VIDEOS.md` / `LAUNCH-INPUTS.md` — manifest format + per-launch input pattern
- `launch/inkleaf-launch/LAUNCH-RUNBOOK.md` §D.0 (L220–233) — Shopify Files upload + image/video URL split
- Live environment probe (this session) — Python 3.12.3, PIL 12.2.0, NO ffmpeg/numpy/PyAV/imageio/imagehash, PEP 668 externally-managed, local Arduview asset set verified

### Secondary (MEDIUM — verified)
- imageio-ffmpeg bundles a static ffmpeg binary; `get_ffmpeg_exe()` returns it — [github.com/imageio/imageio-ffmpeg](https://github.com/imageio/imageio-ffmpeg), [pypi.org/project/imageio-ffmpeg](https://pypi.org/project/imageio-ffmpeg/) (cross-checked with `pip install --dry-run` → manylinux2014 wheel 29.5 MB)
- PyAV ships manylinux binary wheels with bundled FFmpeg since 8.0, no system ffmpeg — [pypi.org/project/av](https://pypi.org/project/av/), [pyav.org installation](https://pyav.org/docs/stable/overview/installation.html)
- imageio split `imageio-ffmpeg` into its own package — [github.com/Zulko/moviepy#908](https://github.com/Zulko/moviepy/issues/908)
- ImageHash (phash/dhash dedupe) — [pypi.org/project/ImageHash](https://pypi.org/project/ImageHash/)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — env probed live; both decoder options verified self-contained; PIL/exif confirmed present
- Architecture (brick split, fan-out): HIGH — image string proven; funnel-deep-pass is a direct structural analog
- Video track: MEDIUM — decoder recipe verified installable but not run on the actual 224 MB clips (that's the UAT)
- Pitfalls: HIGH — drawn from the proof's auto-surfaced findings + PEP 668 verified

**Project Constraints (from CLAUDE.md):**
- Brick model is build law: deterministic→script/hook, judgment→agent, gate→human. One job per brick, smallest part. No "agent that cleans/stores data" (category error). — honored: pixel/IO/emit/upload are scripts, only relevance-bucket + role-classify/comprehend-video are agents, pick is the human gate.
- Naming: Step (PMF 0–8) ≠ Stage (M1-S{n}) ≠ Phase (GSD index). This is **Phase 16 = Stage M1-S16**; never a "Step." — honored throughout.
- Ask before committing/pushing; ask when vague. — for the planner/executor to honor.

**Research date:** 2026-06-04
**Valid until:** 2026-07-04 (stable; pip package versions may bump but the bundled-binary/no-system-ffmpeg story is durable)
