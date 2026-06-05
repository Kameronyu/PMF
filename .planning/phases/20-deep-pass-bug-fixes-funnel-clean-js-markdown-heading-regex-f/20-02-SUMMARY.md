---
phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f
plan: 02
subsystem: pipeline-docs
tags: [funnel-deep-pass, space-map, skill, prompt, exclude-guard, doc-correction]

# Dependency graph
requires:
  - phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f
    plan: 01
    provides: funnel-clean.js markdown heading fix + funnel-score.js no-currency fail-loud guard
provides:
  - Corpus-absent + no-ads-DTC EXCLUDE guard in funnel-deep-pass SKILL precondition (D-04, D-05, D-06)
  - space-map.json unified on runs/<space>/ across all docs and aggregate-mechanisms-in-play.js default (D-07)
  - Stale "MUST Read that bundle" line scrubbed from funnel-deep-pass.md (D-09)
  - belief_kind + source_routing ghost fields removed from funnel-architect INPUTS spec (D-10)
affects: [funnel-deep-pass, market-selection, funnel-architect, step1-light-pass, aggregate-mechanisms-in-play]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "exclude-not-stub: corpus-absent or no-currency brands are excluded with a message, never fed fabricated data to downstream scorers"
    - "operator hand-feed escape hatch: funnel-assemble.js --lp-url is the only path for no-ads LP analysis"

key-files:
  created: []
  modified:
    - .claude/skills/funnel-deep-pass/SKILL.md
    - .claude/skills/market-selection/SKILL.md
    - prompts/step1-light-pass.md
    - prompts/funnel-deep-pass.md
    - tools/aggregate-mechanisms-in-play.js
    - .claude/skills/funnel-architect/SKILL.md

key-decisions:
  - "D-04/D-05: corpus-absent and no-ads DTC brands excluded with message in funnel-deep-pass SKILL precondition — never stub or fabricate a funnel"
  - "D-06: operator hand-feed via funnel-assemble.js --lp-url is the only legitimate path for no-ads LP entry into the pipeline"
  - "D-07: space-map.json canonical location is runs/<space>/space-map.json; zero repo-root references in docs or script defaults"
  - "D-09: Section Analyzer never Reads files; orchestrator EMBEDS bundle bytes — stale MUST-Read instruction scrubbed"
  - "D-10: belief_kind and source_routing removed from funnel-architect INPUTS spec (ghost fields the Section Analyzer never emits); producer-side schema in funnel-deep-pass.md untouched (CONTRACT-GATED, deferred to Track C / Phase 21)"

patterns-established:
  - "SKILL precondition bash guards: per-brand EXCLUDE checks before judgment loop entry"
  - "Doc-correction scope discipline: consumer-side ghost fields removed; producer-side schema change deferred (CONTRACT-GATED)"

requirements-completed: []

# Metrics
duration: 10min
completed: 2026-06-05
---

# Phase 20 Plan 02: Deep-Pass SKILL/Doc Internal Consistency Summary

**Funnel-deep-pass SKILL now excludes (not stubs) absent-corpus + no-ads DTC brands; all space-map.json pointers unified on runs/<space>/; stale Read instruction scrubbed; funnel-architect ghost fields removed**

## Performance

- **Duration:** ~10 min
- **Started:** 2026-06-05T03:05:00Z
- **Completed:** 2026-06-05T03:15:00Z
- **Tasks:** 3
- **Files modified:** 6

## Accomplishments

- Added per-brand EXCLUDE guards (D-04 corpus-absent, D-05 no-ads DTC) with bash snippets to funnel-deep-pass SKILL precondition; documents operator hand-feed escape hatch via funnel-assemble.js (D-06)
- Unified all space-map.json pointers on runs/<space>/space-map.json — replaced "PATH MISMATCH (load-bearing)" doc block in market-selection SKILL, pinned step1-light-pass.md output write-path, migrated aggregate-mechanisms-in-play.js SPACE_MAP default from repo root to runs/arduview/space-map.json (D-07)
- Scrubbed stale "MUST Read that bundle" instruction from prompts/funnel-deep-pass.md; replaced with embed-framing (D-09)
- Removed belief_kind + source_routing ghost fields from funnel-architect INPUTS spec; left prompts/funnel-deep-pass.md SCHEMA belief_kind untouched per CONTRACT-GATED scope guard (D-10)

## Task Commits

1. **Task 1: Add corpus-absent + no-ads-DTC exclude guard** - `0b225d1` (feat)
2. **Task 2: Unify all space-map.json pointers** - `bbea538` (feat)
3. **Task 3: Scrub stale Read line + remove ghost fields** - `97ac03a` (fix)

**Plan metadata:** (docs commit follows)

## Files Created/Modified

- `.claude/skills/funnel-deep-pass/SKILL.md` — Added PER-BRAND EXCLUDE GUARDS section with bash snippets for corpus-absent (D-04) and no-ads DTC (D-05) checks, plus OPERATOR HAND-FEED ESCAPE HATCH note (D-06)
- `.claude/skills/market-selection/SKILL.md` — Replaced "Arduview run — PATH MISMATCH (load-bearing)" block with "canonical run-relative locations" block; all four data file sets now point to runs/arduview/
- `prompts/step1-light-pass.md` — Pinned Space Classifier output write-path to runs/<space>/space-map.json; descriptive schema header left untouched
- `prompts/funnel-deep-pass.md` — Replaced "MUST Read that bundle as its first step" with embed framing (orchestrator EMBEDS bundle into spawn prompt)
- `tools/aggregate-mechanisms-in-play.js` — Migrated SPACE_MAP default from path.join(ROOT, 'space-map.json') to path.join(ROOT, 'runs', 'arduview', 'space-map.json'); updated usage-doc comment to match
- `.claude/skills/funnel-architect/SKILL.md` — Removed belief_kind (crowdfunding-specific | general-DR) from belief-instance INPUTS bullet; removed source_routing bullet entirely

## Decisions Made

- D-10 scope: only the consumer-side doc references (architect INPUTS spec) were removed. The producer-side schema fields in prompts/funnel-deep-pass.md (belief_kind field ~84, BELIEF_KIND_ENUM ~146) are CONTRACT-GATED — adding/removing them is a schema freeze deferred to Track C / Phase 21.

## Deviations from Plan

None — plan executed exactly as written. Tasks 1 and 2 were already committed from a prior execution attempt (commits 0b225d1 and bbea538 present on HEAD); Task 3 was the only remaining work.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All D-04/D-05/D-06/D-07/D-09/D-10 decisions from 20-CONTEXT.md are now implemented in the SKILL/doc set
- Plan 20-03 (remaining bug fixes) can proceed
- The funnel-deep-pass pipeline is now internally consistent: exclude-not-stub discipline enforced at precondition, space-map paths unified, embed design documented correctly, architect INPUTS matches reality

---
*Phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f*
*Completed: 2026-06-05*
