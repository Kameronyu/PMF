---
phase: 15-stage-m1-s15-funnel-architect-copywriter
plan: "02"
subsystem: funnel-rag-pipeline
tags: [rag, vectorize, claim-tally, source-type, routing-flag, whitespace]
dependency_graph:
  requires: [15-01]
  provides: [funnel-vectorize-source-type, funnel-rag-source-type-filter, funnel-claim-tally]
  affects: [15-03, 15-04, 15-05]
tech_stack:
  added: []
  patterns: [aggregate-mechanisms-in-play pattern mirrored for claim-tally]
key_files:
  created:
    - tools/funnel-claim-tally.js
    - runs/_fixture/funnels/_tally.json
  modified:
    - tools/funnel-vectorize.js
    - tools/funnel-rag-query.js
    - runs/_fixture/funnels/_index.json
decisions:
  - moves[] tags used as primary sub-claim key per spec §2d recommendation (closed enum, right granularity, no upstream schema change)
  - threshold validation: explicit check for 0 and negative strings before parseInt fallback
metrics:
  duration: ~12 minutes
  completed: 2026-06-04
  tasks_completed: 2
  files_modified: 5
---

# Phase 15 Plan 02: RAG source-type filter + claim-tally script Summary

Extended the RAG pipeline to carry and filter by source_type/routing_flag (D2/D3), built the claim-tally script (D4), and rebuilt the fixture index with Voyage embeddings (dim=1024).

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Extend funnel-vectorize.js and funnel-rag-query.js; rebuild fixture index | 205db9a | tools/funnel-vectorize.js, tools/funnel-rag-query.js, runs/_fixture/funnels/_index.json |
| 2 | Build tools/funnel-claim-tally.js per 15-CLAIM-TALLY-IMPL-SPEC.md | 727928b | tools/funnel-claim-tally.js, runs/_fixture/funnels/_tally.json |

## Verification Results

All plan verification checks passed:

- `node -e "...i.records[0].source_type"` → `crowdfunding` (not null)
- `funnel-rag-query.js --source-type=crowdfunding` → returns 4 records, no "eliminated all" warning
- `funnel-rag-query.js --source-type=dtc` → "prefilter eliminated all records" (correct — 0 dtc records in fixture)
- `grep "source-type" tools/funnel-rag-query.js` → 5 lines (prefilter block, help text ×2, warn message, emit lines)
- Existing `--belief` and `--proof-tier` filters unaffected
- Claim-tally Test A: whitespace=14, dead=0, low_n_warning=true, exit 0
- Claim-tally Test B (threshold=1): dead=14, whitespace=0, low_n_warning=false, exit 0
- Claim-tally Test C: `runs/_fixture/funnels/_tally.json` written, exit 0
- Claim-tally Test D (missing space): exit 2, "does not exist" in stderr
- Claim-tally Test E (empty store): total_funnels=0, low_n_warning=true, exit 0

## Decisions Made

1. **moves[] as primary sub-claim key**: followed spec §2d. Individual move tags are the correct granularity for saturation detection — they name discrete persuasive acts at a level the Architect can act on. No upstream schema change needed.

2. **Threshold 0/negative guard**: explicit string check before parseInt. `parseInt('0') || 5` would silently fall back to 5 instead of rejecting; explicit check catches 0 and negative strings correctly.

3. **Fixture index rebuilt with Voyage** (VOYAGE_API_KEY was set): dim=1024. Stub backend not needed.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

## Context Note: Pre-existing Fixture Defects

Per orchestrator context note, the fixture has two pre-existing defects:
- `proof_tier` uses `"Tier 1"` (space) not `"Tier1"` (no space)
- `moves[]` use freeform tags not in MOVE_ENUM

Neither defect blocks this plan. The claim-tally spec §3e explicitly states "Do NOT reject or filter off-enum tags — accept any non-empty string as a move key." The tally script handled the fixture's freeform tags correctly (14 distinct move keys tallied). The `funnel-vectorize.js` and `funnel-rag-query.js` changes do not depend on MOVE_ENUM validation.

## Known Stubs

None.

## Threat Flags

No new security surface introduced. T-15-02-1 (path traversal via --space) mitigated via sanitizePathSegment. T-15-02-2 (duplicate funnel_id DoS) mitigated via fail() on duplicate detection. T-15-02-3 (source_type disclosure) accepted per threat register — source_type is non-secret funnel metadata.

## Self-Check: PASSED

Files created/modified:
- tools/funnel-vectorize.js: FOUND
- tools/funnel-rag-query.js: FOUND
- tools/funnel-claim-tally.js: FOUND
- runs/_fixture/funnels/_index.json: FOUND
- runs/_fixture/funnels/_tally.json: FOUND

Commits:
- 205db9a: FOUND
- 727928b: FOUND
