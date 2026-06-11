---
phase: 16-asset-classifier-image-and-video-bricks
plan: 06
type: execute
status: complete
executed: manual-live-run (operator-driven, outside the formal subagent flow)
date: 2026-06-04
---

# 16-06 SUMMARY — E2E UAT (live classification on the full Arduview set)

## What this plan was
Phase acceptance: run the whole asset-classifier chain on the real Arduview asset set end-to-end and produce the queryable manifest the LP/copywriter agents consume, plus the human pick gate. (Success Criteria 3 = a manifest the builder can query; 5 = human pick gate.)

## How it was executed
Run **manually / live** by the orchestrator (not via a spawned executor against a fixture). The live run on real footage IS the UAT, per the phase design. The `asset-classify` SKILL (built in 16-04) was driven over the full local Arduview set.

## What was produced (all under runs/arduview/asset-classify/)
- **25 validated records** (`records/*.json`): 5 images (arduview-0001..0005) + 20 videos (arduview-vid-01..20). All pass `validate-asset-record.js` (closed-vocab + grounding).
- **Manifests:** `IMAGES.md`, `VIDEOS.md`, `images.json`, `videos.json`, `ranked.json` (12 sections, 5 gaps).
- **VIDEO-ANALYSIS.md** — per-clip content beat sheet + claims + specs (dims/aspect/duration) + aesthetic grades, all in one doc.
- **Dimensions + aspect** enriched into every record (images: technical{w,h,aspect_ratio}; videos: probe{w,h,aspect_ratio,duration_s,fps,codec,has_audio,oversize}).
- **Both load-bearing claims covered** by strong assets (transparency_internals_visible + see_through_display_on).
- Human pick gate served by the downstream `IMAGE-PLAN.md` + `ASSET-HANDOFF.md` (funnel-architect selects final on-page frames).

## Scope expansion (the 5 source videos became 20)
Plan assumed the proof set (5 images + 3 videos). Operator supplied 2 Drive zips → **17 more videos unpacked** → fetched as vid-04..20 (assigned by sorted filename; existing vid-01..03 kept). Full set re-fetched, montaged, comprehended.

## Deviations / decisions (for the project decision log)
- **Dedupe hamming threshold 5 → 15** (16-02): the real img-04/img-05 pair sits at distance 12; spec's 5 would miss it. Measured, documented in code.
- **`require('glob')` → `fs.readdirSync`** (16-02): no glob package in repo.
- **vid-09 reclassified** full_explainer → feature_demo: it's a ~59s SILENT montage, not a narrated explainer.
- **All videos marked SILENT** (operator ground truth): probe detected an audio stream (phone ambient track) but there is no narration; `has_audio=false` set on records, reports say "silent". `needs_audio=false` everywhere.
- **vid-01/vid-02 comprehension re-run**: first pass misread mm:ss.ff timestamps as minutes (hallucinated multi-minute timelines for ~13s clips); re-run with explicit duration fixed it. (Comprehend-video prompt should always state clip duration — lesson.)
- **Mixed-orientation footage discovered**: 11 landscape (16:9) + 9 portrait (9:16); best gameplay (Pong vid-16, SPACE BATTLE vid-19) is portrait. Drove two separate hero cuts.
- **HDR (HLG, 10-bit) footage**: vid-01..13 are bt2020/HLG; tone-mapped HLG→SDR for all stills/cuts.
- **asset-emit.js hand-edited after 16-05**: added image specs table (dims/aspect), video aspect+silent in spec column, an aesthetic column + grades table, and fixed the video gap_list to derive from best_use coverage (was emitting spurious 0-candidate gaps). NOT a separate plan — folded into this UAT pass.

## Out-of-scope additions (LAUNCH / M2 tooling, built opportunistically here — NOT part of the S16 plan goal)
These are net-new bricks beyond the asset-classifier scope; flag for the verifier so they aren't treated as S16 must-haves:
- `tools/asset/video-assemble.py` — EDL-driven hero-cut assembler (trim/tonemap/cover-crop/concat/fade, silent). Produced `cuts/arduview-hero-16x9.mp4` + `cuts/arduview-hero-9x16.mp4` from `hero-edl.json` / `hero-edl-9x16.json`.
- `tools/asset/frame-grab.py` — pull full-res LP stills from video frames (tonemap + center-crop), driven by `frame-grab.json`.
- Brand visual references: `runs/arduview/brand-refs/{nothing,teenage-engineering,playdate}.md`.
- Handoffs: `ASSET-HANDOFF.md` (funnel-architect asset package), `CAPTION-HANDOFF.md` (caption finishing spec).

## Gaps / known limits
- **`whats_in_box` has NO asset** — no packaging/cable/unboxing footage. Copy-only or reshoot.
- **Aesthetics: 0/20 videos graded "ad-ready"** — raw handheld footage (flat light, shaky, mixed/busy backgrounds). The classifier/cuts salvage the best beats; a polished hero still needs a reshoot. Per-clip weaknesses in VIDEO-ANALYSIS.md = the reshoot fix-list.

## Verification status
Classifier proven on real data: 25 records emitted + validated, both load-bearing claims covered, manifests queryable, human pick handed to funnel-architect. Operator reviewed the video reconstruction + hero cuts live and approved. Remaining formal step: gsd-verifier goal check + mark-complete (see FORMALIZE-HANDOFF.md).
