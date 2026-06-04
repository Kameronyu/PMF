---
phase: 16-asset-classifier-image-and-video-bricks
plan: "05"
subsystem: asset-classifier
tags: [asset-classifier, manifest, section-routing, gap-list, cdn-backfill]
dependency_graph:
  requires: [16-01, 16-04]
  provides: [tools/asset-map-rank.js, tools/asset-emit.js, tools/asset-upload.js]
  affects: [runs/<space>/asset-classify/images.json, runs/<space>/asset-classify/videos.json, runs/<space>/asset-classify/IMAGES.md, runs/<space>/asset-classify/VIDEOS.md]
tech_stack:
  added: []
  patterns: [S1-cli-parse, S2-path-sanitizer, S3-json-store-shape, S4-sidecar-log, section-table-routing]
key_files:
  created:
    - tools/asset-map-rank.js
    - tools/asset-emit.js
    - tools/asset-upload.js
  modified: []
decisions:
  - "gap_list logic: section is gapped if NO candidate is strong AND clean (disqualifiers:[] && dup_of:null) — records with busy backgrounds route candidates to sections but still generate a gap"
  - "video records detected by presence of probe{}/segments[]/best_use/eligible_slots fields — no explicit type flag needed"
  - "deduped records (dup_of set) remain in sections map but sorted last; not deleted from ranking output"
  - "T-16-05-02: absent video CDN URL = empty slot + warning; never fabricate /videos/c/o/v/<hash>.mp4"
metrics:
  duration: ~15 min
  completed: 2026-06-04
  tasks: 3
  files: 3
---

# Phase 16 Plan 05: Manifest Contract (map-rank + emit + upload) Summary

Builds three deterministic Node scripts that complete the asset classifier pipeline: `asset-map-rank.js` routes validated records to LP sections via the editable `section-table.json`, ranks candidates, and flags gaps; `asset-emit.js` writes the queryable JSON stores and the launch-format MD manifests; `asset-upload.js` backfills CDN URLs from a url-map.

## Tasks Completed

| Task | Name | Commit | Key Files |
|---|---|---|---|
| 1 | asset-map-rank.js — brick 5 | d814335 | tools/asset-map-rank.js |
| 2 | asset-emit.js — brick 7 | 59ac624 | tools/asset-emit.js |
| 3 | asset-upload.js — brick 8 | 7f9a544 | tools/asset-upload.js |

## What Was Built

### `tools/asset-map-rank.js` (brick 5)
- `require()`s `tools/asset/section-table.json` for routing (section routing stays in the table, not in code)
- Routes each record's `demonstrates[].claim` to `primary` + `also` sections
- Honors `requires.display_state: on_legible` conditional: `see_through_display_on` routes to `hero` ONLY when `record.display_state === "on_legible"`; otherwise routes to `also` sections only
- Ranks per section: strong > partial > incidental, then hero > section > thumb for `min_safe_use`; deduped records sorted last; disqualified records sorted after clean
- `gap_list`: per section in the section list, if no candidate is `strong` AND clean (`disqualifiers:[]` AND `dup_of:null`) → section appears in gap_list with reason
- Stamps `eligible_sections` / `eligible_slots` back onto source record files
- `--section-list` override wired (seam for M1-S3 funnel structure)
- Handles empty/missing records dir gracefully (exit 0, empty ranked.json)
- Output: `runs/<space>/asset-classify/ranked.json`

### `tools/asset-emit.js` (brick 7)
- S3 shape: `images.json = { records:[...], _provenance, gap_list:[...] }` — queryable as-is
- `videos.json` carries video-specific fields: `segments[]`, `best_use`, `loop_safe`, `needs_audio`, `poster_frame`, `eligible_slots`
- `IMAGES.md`: base-URL-pattern line, per-ranked-section `## <section>` tables with `| role | pick | claim+strength | CDN URL |` columns, `## Dropped (deduped)` section, `## Disqualifiers` section, `## Gaps` section
- `VIDEOS.md`: verbatim HASHED-path warning (`/videos/c/o/v/{hash}.mp4`), `| file | spec | best_use | CDN URL |` table, `## Poster frame` section, embed snippet
- CDN URL columns empty until brick 8 backfills them
- Handles empty/missing records dir and absent ranked.json gracefully

### `tools/asset-upload.js` (brick 8)
- Accepts `--url-map=<path>` ({ filename: cdn_url }) — works with manual upload or future Admin-API
- Image URLs: from url-map if present; else constructed as `https://cdn.shopify.com/s/files/1/<store_num_id>/files/<filename>.jpg` when `--store-num-id` given
- Video URLs: MUST come from url-map (T-16-05-02: hashed `/videos/c/o/v/<hash>.mp4` — NEVER fabricated); absent = empty slot + explicit warning
- Poster frames treated as normal images (constructable or from url-map)
- Backfills `cdn_url` / `poster_cdn_url` into `images.json` + `videos.json` + MD manifests
- `--help` works; `STUB(M2)` comment marks Playwright credentialed-upload seam

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `STUB(M2)` comment in `asset-upload.js` marks the Playwright UI-automation seam for credentialed Shopify Admin-API upload. Intentional per plan scope guard (rides M2).

## Threat Surface Scan

No new endpoints, auth paths, or network calls introduced. All three bricks are pure local file I/O. T-16-05-01 (path traversal) and T-16-05-02 (fabricated video URL) addressed as specified.

## Self-Check: PASSED

- [x] `tools/asset-map-rank.js` exists (d814335)
- [x] `tools/asset-emit.js` exists (59ac624)
- [x] `tools/asset-upload.js` exists (7f9a544)
- [x] Automated verifies passed for all three tasks
- [x] Empty/partial records dir handled gracefully (exit 0) for map-rank and emit
- [x] `--help` works on asset-upload.js
- [x] `videos/c/o/v` string present in asset-upload.js (never fabricated, only from url-map)
