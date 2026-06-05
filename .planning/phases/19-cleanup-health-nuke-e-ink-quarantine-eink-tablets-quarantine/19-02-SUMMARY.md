---
phase: 19-cleanup-health-nuke-e-ink-quarantine-eink-tablets-quarantine
plan: "02"
subsystem: docs
tags: [image-classifier, manifest-format, cleanup, spec]

# Dependency graph
requires: []
provides:
  - "image-classifier-brick.md with zero launch/inkleaf path references; self-contained manifest format snippet inlined"
affects:
  - "19-03 (launch/ delete) — this plan was the blocker; delete is now safe"

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Inline illustrative format snippets into specs rather than citing external files about to be deleted"

key-files:
  created: []
  modified:
    - "prompts/_specs/image-classifier-brick.md"

key-decisions:
  - "Inline manifest format rows drawn from runs/arduview/asset-classify/IMAGES.md as the canonical shape illustration (2 rows, hero + feature_transparency)"
  - "Neutralize prose InkLeaf brand mention to generic example string to avoid any InkLeaf coupling"

patterns-established:
  - "Path-cite severance: replace stale cross-ref with a self-contained inline snippet before deleting the referenced file"

requirements-completed: []

# Metrics
duration: 3min
completed: 2026-06-05
---

# Phase 19 Plan 02: Sever launch/inkleaf cite in image-classifier spec Summary

**Inlined a self-contained section -> role -> file -> CDN-slot manifest snippet into image-classifier-brick.md, removing the only path cite into the soon-to-be-deleted launch/ tree**

## Performance

- **Duration:** ~3 min
- **Started:** 2026-06-05T00:29:00Z
- **Completed:** 2026-06-05T00:29:19Z
- **Tasks:** 1 of 1
- **Files modified:** 1

## Accomplishments
- Replaced the stale `launch/inkleaf-launch/IMAGES.md` path cite with an inline format snippet
- Illustrated the section -> role -> file -> CDN-slot manifest shape using real Arduview rows from runs/arduview/asset-classify/IMAGES.md
- Neutralized remaining prose `InkLeaf` brand mention to a generic example
- Spec is now self-contained; launch/ delete in 19-03 will leave no dangling references

## Task Commits

1. **Task 1: Inline the IMAGES.md format snippet, remove the launch/ path cite** - `4662f7b` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified
- `prompts/_specs/image-classifier-brick.md` - Stale path cite replaced with inline manifest format snippet; InkLeaf prose mention neutralized

## Decisions Made
- Drew the illustrative manifest rows from `runs/arduview/asset-classify/IMAGES.md` (the live, kept output of the brick string) — matches the real emitted shape exactly
- Neutralized `(the InkLeaf "best for screen-content callout" move)` to `(e.g. "best for screen-content callout")` — trivial prose change, removes brand coupling without altering substance

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
None.

## User Setup Required
None - documentation edit only.

## Next Phase Readiness
- 19-03 (launch/ hard delete) is now unblocked — zero `launch/inkleaf` substrings remain in any MUST-KEEP file
- `prompts/_specs/image-classifier-brick.md` is self-contained and fully functional

---
*Phase: 19-cleanup-health-nuke-e-ink-quarantine-eink-tablets-quarantine*
*Completed: 2026-06-05*
