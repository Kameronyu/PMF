---
phase: 16-asset-classifier-image-and-video-bricks
plan: "01"
subsystem: asset-classifier
tags: [wave-0, setup, python, venv, data-artifacts]
dependency_graph:
  requires: []
  provides:
    - .venv with imagehash + imageio-ffmpeg (pixel-brick deps)
    - tools/asset/section-table.json (claim->sections routing table)
    - tools/asset/section-list.default.json (default LP sections + video slots)
    - runs/arduview/asset-classify/CLAIM-LIST.json (8 Arduview claims, 2 load-bearing)
    - tools/asset/README.md (spawn convention documentation)
  affects: []
tech_stack:
  added:
    - imagehash 4.3.2 (pHash dedupe for brick 2)
    - imageio-ffmpeg 0.6.0 (bundled static ffmpeg binary, no system ffmpeg)
    - numpy 2.4.6 + scipy 1.17.1 + PyWavelets 1.9.0 (imagehash deps)
    - Pillow 12.2.0 (already on system, now in venv too)
  patterns:
    - PEP 668 venv isolation (.venv/bin/python explicit spawn)
    - argv-array spawn (no shell-string interpolation, T-16-02)
    - per-run swappable config files (CLAIM-LIST.json pattern from LAUNCH-INPUTS.md)
key_files:
  created:
    - .venv (python virtual environment — not tracked in git)
    - tools/asset/section-table.json
    - tools/asset/section-list.default.json
    - runs/arduview/asset-classify/CLAIM-LIST.json
    - tools/asset/README.md
  modified:
    - .gitignore (added .venv/)
decisions:
  - .venv is the project-level venv; all later Python bricks use .venv/bin/python explicitly
  - section-table.json lives in tools/asset/ (product-agnostic default); per-run overrides at runs/<space>/asset-classify/
  - montage tile+timestamp done in PIL, not ffmpeg drawtext (bundled binary may lack freetype; intent preserved)
metrics:
  duration_s: 144
  completed_date: "2026-06-04"
  tasks_completed: 3
  tasks_total: 3
  files_created: 5
  files_modified: 1
---

# Phase 16 Plan 01: Wave-0 Setup Summary

**One-liner:** Isolated Python venv with imagehash + imageio-ffmpeg (bundled static ffmpeg), plus the three data artifacts (8-claim routing table, section-list defaults, Arduview claim list) extracted verbatim from the spec.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create .venv and install pixel-brick deps | e9dd316 | .gitignore |
| 2 | Author the three data artifacts | 2170c5b | tools/asset/section-table.json, tools/asset/section-list.default.json, runs/arduview/asset-classify/CLAIM-LIST.json |
| 3 | Document the .venv/bin/python spawn convention | c55df9f | tools/asset/README.md |

## Verification Results

- `.venv/bin/python -c "import imagehash, imageio_ffmpeg"` exits 0
- `get_ffmpeg_exe()` returns `/home/kyu3/PMF/.venv/lib/python3.12/site-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2` (exists)
- `section-table.json`: 8 claims, `see_through_display_on.requires.display_state == "on_legible"` confirmed
- `section-list.default.json`: `hero_loop` in `video_slots` confirmed
- `CLAIM-LIST.json`: 8 claims, exactly 2 `load_bearing: true` (`transparency_internals_visible` + `see_through_display_on`)
- README contains `.venv/bin/python` and `argv arrays only` — spawn convention documented

## Deviations from Plan

None - plan executed exactly as written.

## Known Stubs

None. These are data artifacts and tooling setup, not UI or pipeline code.

## Threat Flags

None. T-16-S1-02 (venv committed to git) is mitigated: `.venv/` added to `.gitignore`.

## Self-Check: PASSED
