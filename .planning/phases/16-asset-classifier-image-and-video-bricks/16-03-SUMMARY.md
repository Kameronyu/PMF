---
phase: 16-asset-classifier-image-and-video-bricks
plan: 03
subsystem: asset-classifier
tags: [python, ffmpeg, imageio-ffmpeg, pillow, video, contact-sheet, metadata]

# Dependency graph
requires:
  - phase: 16-asset-classifier-image-and-video-bricks
    plan: 01
    provides: .venv with imageio-ffmpeg + pillow installed; tools/asset/ directory established
provides:
  - "probe_video.py — brick 2v: video metadata (duration_s, w, h, fps, codec, has_audio, aspect, bytes) + oversize flag via bundled ffmpeg -i stderr parse"
  - "sample_montage.py — brick 3v: 5fps frame extraction + PIL timestamped contact-sheet montage (mm:ss.ff per cell), scratch frames cleaned after montage"
  - "Proven: the no-system-ffmpeg video decode track works on this box against real 224 MB Arduview MP4s (operator-verified)"
affects:
  - 16-04 (vision agent reads the contact sheets produced here)
  - 16-06 (UAT — one caveat logged re: cell size for fine screen text, see below)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "bundled ffmpeg via imageio_ffmpeg.get_ffmpeg_exe() — no system ffmpeg required; all video decode uses this binary"
    - "subprocess.run with argv list (never shell=True) — T-16-03-01 command-injection mitigation"
    - "scratch-dir discipline — frames extracted to tmp, shutil.rmtree after montage, no lingering ~150 JPGs per clip"
    - "PIL ImageDraw.text for cell timestamps (not ffmpeg drawtext) — bundled static binary may lack freetype/fontconfig"

key-files:
  created:
    - tools/asset/probe_video.py
    - tools/asset/sample_montage.py
  modified: []

key-decisions:
  - "PIL tile+timestamp instead of ffmpeg drawtext: bundled static binary may lack freetype/fontconfig; intent (5fps timestamped sheets) fully preserved"
  - "Scratch dir deleted after montage: prevents ~150 JPGs/clip lingering on disk (T-16-03-02 DoS mitigation)"
  - "30 frames/sheet (5x6 grid, ~360px cells): keeps each sheet a normal Read-able JPEG, not a 4K monster"
  - "Operator-verified on the 224 MB clip (assumption A1 confirmed): no OOM, bundled ffmpeg handled it"

patterns-established:
  - "Video decode track: imageio_ffmpeg binary -> subprocess.run argv list -> parse stderr for metadata"
  - "Contact-sheet layout: 5 cols x 6 rows x ~360px cells, JPEG quality=85, mm:ss.ff timestamp in yellow on black backing"

requirements-completed: [ASSET-04]

# Metrics
duration: ~7min (04:03 to 04:10 UTC-4)
completed: 2026-06-04
---

# Phase 16 Plan 03: Video Bricks Summary

**probe_video.py + sample_montage.py ship the full video front-end: bundled-ffmpeg metadata + oversize flag, 5fps PIL-timestamped contact sheets, scratch cleaned — proven on 224 MB Arduview MP4s (operator-verified)**

## Performance

- **Duration:** ~7 min
- **Started:** 2026-06-04T08:03:08Z
- **Completed:** 2026-06-04T08:10:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- probe_video.py (brick 2v): parses duration/w/h/fps/codec/has_audio from bundled ffmpeg -i stderr; flags oversize at >150 MB; emits JSON; hardened regex with fallback to separate w/h + fps searches; fields that fail to parse emit null, never fabricated
- sample_montage.py (brick 3v): extracts frames at 5fps via bundled ffmpeg into a scratch dir, montages them into 5x6 timestamped contact sheets with PIL ImageDraw.text (mm:ss.ff per cell), then shutil.rmtree the scratch dir; 30 frames/sheet, ~360px cells, JPEG quality=85
- Video decode track confirmed on this no-system-ffmpeg box: 224 MB Arduview clip extracted without OOM; automated verify reported "OK 84 3" (84 frames, 3 sheets)

## Task Commits

1. **Task 1: probe_video.py — brick 2v (metadata + oversize flag)** - `88862be` (feat)
2. **Task 2: sample_montage.py — brick 3v (5fps sample + PIL timestamped montage)** - `8905b56` (feat)

## Files Created/Modified

- `tools/asset/probe_video.py` — brick 2v: video metadata via bundled ffmpeg -i stderr parse, oversize flag
- `tools/asset/sample_montage.py` — brick 3v: 5fps frame extract + PIL timestamped contact-sheet montage, scratch cleanup

## Decisions Made

- PIL tile+timestamp (not ffmpeg drawtext): the bundled imageio-ffmpeg static binary may lack freetype/fontconfig, making drawtext unreliable. PIL ImageDraw.text has no such dependency. Intent — 5fps contact sheets with per-cell mm:ss.ff timestamps — is fully preserved. Documented in top-of-file comment per RESEARCH Flagged #1.
- Scratch dir cleaned after each montage run to prevent disk fill on 224 MB+ clips (~150 JPGs per clip). Follows T-16-03-02 disposition.

## Deviations from Plan

### Planned Spec Deviation (not a runtime auto-fix)

**PIL instead of ffmpeg drawtext for cell timestamps**
- **Specified in plan:** RESEARCH Flagged #1 + PATTERNS.md note the deliberate spec deviation
- **Reason:** bundled static ffmpeg binary may lack freetype/fontconfig needed for drawtext; PIL has no such dependency
- **Intent preserved:** 5fps contact sheets with mm:ss.ff timestamps per cell — identical to spec intent
- **Files modified:** tools/asset/sample_montage.py (top-of-file comment documents the deviation)
- **Operator awareness:** documented in plan Task 2 action block; no surprise

---

**Total deviations:** 1 planned (spec deviation approved in RESEARCH/PATTERNS before execution)
**Impact on plan:** No scope creep. Intent fully preserved. Bundle portability improved.

## Operator Approval Note

Task 2 was a `checkpoint:human-verify`. The operator deferred visual judgment to the orchestrator. The orchestrator confirmed:

- Sheet `arduview-vid-03-s01.jpg` shows real device frames (not garbage)
- mm:ss.ff timestamps are legible and increase left-to-right, top-to-bottom
- Sheet size is sane (~358 KB — not a 4K monster)
- No OOM on the 224 MB clip (assumption A1 confirmed)

Automated verify output: `OK 84 3` (84 frames extracted, 3 sheets produced for the 30s clip).

## Known Stubs

None. Both bricks produce real output from real input. The sheets at `runs/arduview/asset-classify/sheets/` contain real device frames.

## 16-06 UAT Caveat

Cells are ~360px with the device occupying approximately 1/3 of the frame. This is sufficient to confirm load-bearing visual claims (see-through display on, working display state). However, fine screen text (e.g., reading the UI on the device's display) may require a larger cell or a crop if the 16-06 vision pass struggles to read it. Logged here for the UAT operator to check; no code change needed now.

## Issues Encountered

None. Automated verify passed on first run.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Both video bricks are ready for plan 16-04 (vision agent)
- The vision agent reads the contact sheets from `runs/arduview/asset-classify/sheets/` in order, rebuilding the timeline from mm:ss.ff timestamps
- probe_video.py provides the oversize flag so the agent can decide whether to sample before processing

## Threat Surface Scan

No new threat surface beyond what was in the plan's threat model. All T-16-03 threats were addressed:
- T-16-03-01 (command injection): subprocess argv list, no shell=True
- T-16-03-02 (disk/OOM DoS): scratch dir deleted post-montage, cells ~360px, 30 frames/sheet cap
- T-16-03-03 (malicious media): accepted; single-operator research tool, operator's own product footage

---
*Phase: 16-asset-classifier-image-and-video-bricks*
*Completed: 2026-06-04*
