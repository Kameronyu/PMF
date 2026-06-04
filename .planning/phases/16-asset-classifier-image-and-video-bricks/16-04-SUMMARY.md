---
phase: 16-asset-classifier-image-and-video-bricks
plan: "04"
subsystem: asset-classify
tags: [vision, closed-vocab, grounding, validate, orchestrator, skill, hook]

# Dependency graph
requires:
  - phase: 16-asset-classifier-image-and-video-bricks
    provides: "probe.py, probe_video.py, sample_montage.py pixel bricks (16-01/02/03)"
provides:
  - validate-asset-record.js — deterministic closed-vocab + grounding reject gate
  - .claude/skills/asset-classify/SKILL.md — orchestrator with ENFORCEMENT MAP + 3 agent prompts (relevance-bucket, role-classify, comprehend-video)
affects:
  - 16-05 (asset-map-rank.js + asset-emit.js — consumes validated records from this skill)
  - 16-06 (UAT — runs the full SKILL end-to-end; this plan is what it validates)
  - Phase 15 /copywrite (consumes the images.json/videos.json manifests produced downstream)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "closed-enum-as-Set + violations-accumulate-then-dump (mirror of validate-analyzer.js)"
    - "orchestrator-run validator: hooks don't fire in subagents, so SKILL.md runs validate-asset-record.js as an explicit step before persist"
    - "Read-path fan-out: vision subagents Read a local file path — image bytes never enter context (proof's load-bearing move)"
    - "ENFORCEMENT MAP table in SKILL.md: deterministic-vs-judgment ledger per step"

key-files:
  created:
    - tools/hooks/validate-asset-record.js
    - .claude/skills/asset-classify/SKILL.md
  modified: []

key-decisions:
  - "validate-asset-record.js runs as an orchestrator step, not a PostToolUse hook (hooks don't fire in subagents)"
  - "grounding gate enforced at script level: rejects demonstrates[] entry missing evidence (image) or motion_value (video) — enforces the 'tag only visible pixels' rule without needing to see the image"
  - "video detection via presence of segments/best_use/eligible_slots fields (not a separate type field)"
  - "relevance-bucket records (no demonstrates[]) are not rejected for missing demonstrates[] unless they have shot_type/best_use (classified record without claim tags)"

patterns-established:
  - "Pattern: claim vocab enforcement — load CLAIM-LIST.json ids into a Set at runtime; reject off-list claims deterministically"
  - "Pattern: agent prompts folded into SKILL.md (not separate prompt files) — prompts live nowhere else, single source of truth"
  - "Pattern: UNTRUSTED DATA BOUNDARY block in all three agent prompts — image content is untrusted external material, not instructions"

requirements-completed: [ASSET-03, ASSET-05, ASSET-09]

# Metrics
duration: 5min
completed: 2026-06-04
---

# Phase 16 Plan 04: Validate-asset-record gate + asset-classify SKILL orchestrator Summary

**Deterministic closed-vocab + grounding reject gate (validate-asset-record.js) and the asset-classify SKILL.md orchestrator — a structural twin of funnel-deep-pass featuring 3 folded-in vision agent prompts (relevance-bucket, role-classify, comprehend-video) that Read local file paths instead of receiving image bytes**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-06-04T08:13:32Z
- **Completed:** 2026-06-04T08:18:31Z
- **Tasks:** 2
- **Files created:** 2

## Accomplishments

- Built `validate-asset-record.js` mirroring `validate-analyzer.js` exactly: closed SHOT_TYPE/DISQUALIFIER/STRENGTH/BEST_USE/DISPLAY_STATE enums, claim-list loaded from `--claim-list=` into a Set, grounding gate (rejects demonstrates[] entry missing evidence/motion_value), video detection (segments/best_use/eligible_slots → requires at + best_use on-enum + loop_safe/needs_audio booleans)
- Automated verify confirmed: proof's img-01 fixture (valid claims, each with evidence) exits 0; bad fixture (off-list claim, missing evidence, off-enum disqualifier) exits 2 with three REJECT lines
- Built `.claude/skills/asset-classify/SKILL.md` as a structural twin of `funnel-deep-pass/SKILL.md`: ENFORCEMENT MAP, three load-bearing truths, PRECONDITION CHECK, DETERMINISTIC CHAIN, PER-ASSET FAN-OUT LOOP, and all three agent prompts (relevance-bucket, role-classify, comprehend-video) with UNTRUSTED-DATA-BOUNDARY blocks folded in verbatim

## Task Commits

1. **Task 1: validate-asset-record.js — closed-vocab + grounding reject** - `538b579` (feat)
2. **Task 2: asset-classify/SKILL.md — orchestrator + 3 agent prompts** - `1fb0ed0` (feat)

## Files Created/Modified

- `tools/hooks/validate-asset-record.js` — deterministic validator (SHOT_TYPE_ENUM, DISQUALIFIER_ENUM, STRENGTH_ENUM, BEST_USE_ENUM, DISPLAY_STATE_ENUM + claim-list + grounding gate + video checks); 275 lines, structural twin of validate-analyzer.js
- `.claude/skills/asset-classify/SKILL.md` — orchestrator SKILL: ENFORCEMENT MAP + 3 agent prompts + deterministic chain + per-asset fan-out loop + precondition check + hand-off; 549 lines, structural twin of funnel-deep-pass/SKILL.md

## Decisions Made

- **validate-asset-record.js as orchestrator step, not PostToolUse hook:** hooks don't fire inside subagents, so the SKILL runs the validator explicitly on each returned record before persist — same pattern as funnel-deep-pass embeds context as an orchestrator step
- **Grounding gate at script level:** the validator rejects any `demonstrates[]` entry missing `evidence` (image) or `motion_value` (video) — the script-enforceable half of "tag only what's in the pixels"; the script can't see pixels but CAN reject a claim with no cited evidence
- **Video detection by presence of fields (segments/best_use/eligible_slots):** no separate `kind: video` field needed on the classification record — video records are identified by what they contain
- **relevance-bucket records tolerate absent demonstrates[]:** a relevance-only record (one field) is valid; only classified records (with shot_type or best_use) require demonstrates[]

## Deviations from Plan

None — plan executed exactly as written. Both files match their analog structures, automated verifies pass, all acceptance criteria met.

## Issues Encountered

None.

## Threat Surface Scan

No new network endpoints, auth paths, or file-write patterns introduced. Both files are read-only analysis tools:
- `validate-asset-record.js` reads two files (record JSON + CLAIM-LIST.json) and exits; no writes
- `SKILL.md` is a documentation/prompt file; no code execution

T-16-04-01 (grounding flattery): mitigated — grounding gate rejects demonstrates[] entries missing evidence.
T-16-04-02 (prompt injection): mitigated — UNTRUSTED-DATA-BOUNDARY block in all three agent prompts.
T-16-04-03 (off-vocab corruption): mitigated — validate-asset-record.js closed-enum reject, orchestrator-run on every record.

## Next Phase Readiness

- `validate-asset-record.js` is ready for use in the asset-classify orchestrator loop (plan 16-05 will build asset-map-rank.js + asset-emit.js that consume the validated records)
- `SKILL.md` is the complete orchestrator spec — plan 16-06 UAT can run it end-to-end against the Arduview asset set

---
*Phase: 16-asset-classifier-image-and-video-bricks*
*Completed: 2026-06-04*
