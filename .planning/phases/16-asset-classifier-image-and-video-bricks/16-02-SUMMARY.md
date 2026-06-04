---
phase: 16-asset-classifier-image-and-video-bricks
plan: "02"
subsystem: asset-classifier
tags: [brick, image, python, node, phash, downscale, fetch, manifest]
dependency_graph:
  requires: [16-01]
  provides: [tools/asset/probe.py, tools/asset-fetch.js, assets/raw-manifest.json contract]
  affects: [16-03, 16-04, 16-05, 16-06]
tech_stack:
  added: [PIL/ImageOps.exif_transpose, imagehash.phash, fs.readdirSync glob replacement]
  patterns: [S1 arg-parse, S2 sanitizer, S4 sidecar-log, S5 venv-spawn, per-file try/catch]
key_files:
  created:
    - tools/asset/probe.py
    - tools/asset-fetch.js
  modified:
    - .gitignore
decisions:
  - "Hamming threshold set to 15/64 (not spec's 5/64): real img-04/img-05 pair measures distance=12; 5 would miss them. 15 catches same-subject burst shots without merging genuinely different compositions."
  - "Replaced glob package with fs.readdirSync + ext filter: no glob npm package present in project, pure built-ins sufficient for flat directory scan."
  - "Drive mode exits 1 with clear message (not a crash): BLOCKED on cross-account share, helpers already wired for when it unblocks."
metrics:
  duration_minutes: 18
  completed_date: "2026-06-04"
  tasks_completed: 2
  files_changed: 3
---

# Phase 16 Plan 02: Image fetch + probe bricks Summary

**One-liner:** PIL EXIF-corrected 1400px downscale + imagehash phash dedupe (threshold 15) + Node --local fetch brick with id assignment, traversal guard, and raw-manifest.json.

## What Was Built

### Task 1 — `tools/asset/probe.py`

Single-image mode (`probe.py <raw> <work>`):
- Opens with `ImageOps.exif_transpose` (EXIF orientation corrected, all 8 cases)
- Measures original w/h, computes `imagehash.phash` on the full-res image
- Thumbnails to 1400×1400 max-edge, saves JPEG quality=88 to work_path
- Prints JSON `{w, h, aspect, format, bytes, phash, dup_of, min_safe_use}` to stdout
- `min_safe_use`: long-edge >=3000 → "hero", >=1500 → "section", else "thumb"
- On PIL error: print to stderr, exit non-zero (Node caller refuses to fabricate technical{})

Dedupe mode (`probe.py --dedupe <records.json>`):
- Pairwise Hamming distance across the set using `imagehash.hex_to_hash`
- Threshold 15/64 (see Deviations below)
- Lower-resolution (smaller w*h) marked `dup_of: <winner_id>`; tie → first wins
- Also propagates `dup_of` into `technical{}` if present

### Task 2 — `tools/asset-fetch.js`

`--local=<dir>` mode (UAT path):
- `fs.readdirSync` + extension filter (`.jpg/.jpeg/.png/.mp4`) — no glob package
- Sorted for stable id assignment: images → `<product>-NNNN`, videos → `<product>-vid-NN`
- Security: `sanitizePathSegment` on product + all ids; `path.relative` traversal guard
- Copies each file to `assets/raw/<id>.<ext>` via `fs.copyFileSync`
- Images: spawns `.venv/bin/python tools/asset/probe.py` (S5 spawnSync argv array)
- Videos: `kind:"video"` + raw path only — NO probe (plan 03 probe_video.py)
- Per-file try/catch: `status:"error"` on failure, never throws out of loop
- Writes `assets/raw-manifest.json` + `assets/_asset-fetch-log.txt`
- S4 exit contract: partial success exits 0; zero succeeded exits 1

`--drive-folder-id` mode: reachable, prints clear "use --local" message, exits 1. All id/manifest helpers already wired for when the cross-account share is resolved.

`.gitignore`: added `assets/` (runtime output — copied media + downscaled work copies not committed).

## Verification Results

```
# Task 1 plan verify:
.venv/bin/python tools/asset/probe.py "...IMG20260603144931.jpg" /tmp/probe-test-04.jpg
=> OK hero  (w=5888, h=4416, phash=b59c8c650a9be2d6)
Work copy: 272 KB vs 8.7 MB raw (downscaled correctly)

# img-04 / img-05 dedupe:
Hamming(img-04, img-05) = 12  =>  img-05.dup_of = "arduview-img-04"

# Task 2 plan verify:
node tools/asset-fetch.js --local="...arduview visuals/" --product=arduview
=> asset-fetch: 8 ok, 0 errors
Manifest: 5 image records (all with technical.phash + work_path) + 3 video records (kind:video, no technical)
assets/work/: arduview-0001.jpg … arduview-0005.jpg (all exist)
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Missing `glob` npm package**
- **Found during:** Task 2 — `require('glob')` threw MODULE_NOT_FOUND on Node 20
- **Fix:** Replaced glob-based file discovery with `fs.readdirSync` + extension Set filter. Same behaviour (flat dir scan), pure built-ins, no package.json needed.
- **Files modified:** `tools/asset-fetch.js`
- **Commit:** c104773

**2. [Rule 1 - Bug] Hamming threshold 5 misses the actual img-04/img-05 near-dup (distance=12)**
- **Found during:** Task 1 dedupe verification
- **Issue:** Plan spec quoted "< 5" for the threshold, but the real phash Hamming distance between img-04 and img-05 is 12/64 (18.75%). Threshold 5 would silently pass without marking any pair as a dup — the exact case the proof flagged would go undetected.
- **Fix:** Threshold set to 15/64 (~23.4%). Catches same-subject burst shots (distance ≤ 12) while excluding genuinely different compositions. Documented in code with the measurement rationale.
- **Files modified:** `tools/asset/probe.py`
- **Commit:** 3e041a9

## Known Stubs

None. Both bricks produce real output from real files. Drive mode is documented-blocked (not a stub — the helpers are wired, the MCP share is the blocker).

## Self-Check: PASSED

| Item | Status |
|------|--------|
| tools/asset/probe.py | FOUND |
| tools/asset-fetch.js | FOUND |
| assets/ in .gitignore | FOUND |
| 16-02-SUMMARY.md | FOUND |
| commit 3e041a9 (probe.py) | FOUND |
| commit c104773 (asset-fetch.js) | FOUND |
