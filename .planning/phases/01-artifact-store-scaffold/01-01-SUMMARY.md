---
phase: 01-artifact-store-scaffold
plan: 01
subsystem: infra
tags: [scaffold, filesystem, store, fanout, bash-smoke, node]

# Dependency graph
requires: []
provides:
  - "engine/bricks/lib/fanout-path.js — buildFanoutName(...keys) + canonical sanitizePathSegment (imported by Plan 02 store bricks)"
  - "engine/bricks/store-scaffold.js — idempotent runs/<space>/ slot-tree scaffolder (--space required + sanitized)"
  - "runs/smoke/ — committed slot tree, the acceptance target for the whole shell"
  - "engine/contracts/store-smoke.sh — complete STORE-01..05 acceptance harness (STORE-01/04/05 green; STORE-02/03 RED pending Plan 02)"
  - "NAMING.md §3 verbs scaffold/version/receipt/fanout registered"
affects: [01-02-store-version-receipt, run-controller, step-manifests, smoke-run]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Shared lib sanitizer in engine/bricks/lib/ (mirrors lib/embed.js) — bricks import one canonical sanitizePathSegment instead of re-pasting"
    - "Idempotent scaffold: stub files guarded if(!fs.existsSync(p)) — re-run leaves slot contents byte-intact (no-overwrite-v1)"
    - "Per-cell fan-out filename: keys sanitized then joined with double underscore __ + .json"
    - "Bash smoke harness co-located with engine h6-*.sh (set -u, cd-to-root, ok/bad, inline node asserts, named exit)"

key-files:
  created:
    - engine/bricks/lib/fanout-path.js
    - engine/bricks/store-scaffold.js
    - engine/contracts/store-smoke.sh
    - runs/smoke/ (16 committed slot files + 11 slot dirs)
  modified:
    - engine/contracts/NAMING.md

key-decisions:
  - "D-Q1: scaffold BOTH dump-convention parents — corpus/ (per-brand) and flat dumps/; Phase 3 manifests lock the final dump write path"
  - "D-Q3: follow §6 operator-handed slot names verbatim (lowercase, §6 extensions: bet-brief.md, market-selection.json); NAMING.md §5 UPPERCASE rule governs the engine's own deliverables, not these slots"
  - "D-smoke-path: harness lives at engine/contracts/store-smoke.sh (co-located with h6-*.sh), run as bash engine/contracts/store-smoke.sh --space=smoke"
  - "D-version-grain: whole-SPACE versioning (<base>-vN), not per-artifact v2/ subdir (resolver lands Plan 02; documented here for the smoke harness)"

patterns-established:
  - "Canonical path-segment sanitizer centralized in lib/fanout-path.js (Plan 02 bricks import it)"
  - "store-scaffold idempotency: directories via mkdirSync(recursive); files written only-if-absent"
  - "STORE-02/03 smoke asserts authored RED ahead of the bricks (Nyquist Wave-0): the harness is complete, Plan 02 turns it green"

requirements-completed: [STORE-01, STORE-04, STORE-05]

# Metrics
duration: 4min
completed: 2026-06-26
---

# Phase 01 Plan 01: Artifact Store Scaffold Summary

**Idempotent runs/<space>/ slot-tree scaffolder + shared __-join fan-out namer + committed `smoke` space + the complete STORE-01..05 bash acceptance harness (STORE-02/03 RED by design until Plan 02).**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-26T14:29:11Z
- **Completed:** 2026-06-26T14:33:00Z
- **Tasks:** 3
- **Files modified:** 4 deliverables + 16 committed runs/smoke slot files

## Accomplishments
- `engine/bricks/lib/fanout-path.js` — `buildFanoutName(...keys)` produces the exact `<a>__<b>.json` name; `sanitizePathSegment` is the canonical traversal-safe sanitizer (both exported, Plan 02 imports them). (STORE-04)
- `engine/bricks/store-scaffold.js` — scaffolds the reconciled §6/R1 slot tree under `runs/<space>/`; `--space` required and sanitized; idempotent re-run leaves existing slot contents byte-intact. (STORE-01, STORE-05)
- `runs/smoke/` — committed slot tree (16 slot files; the `_store-scaffold-log.txt` sidecar stays gitignored), the acceptance target for the whole shell. (STORE-05)
- `engine/contracts/store-smoke.sh` — the COMPLETE STORE-01..05 harness; STORE-01/04/05 green now, STORE-02/03 reference Plan 02's `space-version.js` + `receipt-write.js` and fail RED by design.
- `engine/contracts/NAMING.md` §3 — registered the four new verbs `scaffold`/`version`/`receipt`/`fanout`.
- Engine regression spot-check `bash engine/contracts/h6-all.sh` → 14/14 green: Phase 1 left the engine undisturbed.

## Task Commits

Each task was committed atomically (with hooks, no `--no-verify`):

1. **Task 1: Fan-out path helper (STORE-04)** — `1a37b14` (feat)
2. **Task 2: Store-scaffold brick + NAMING verbs + smoke space (STORE-01, STORE-05)** — `ba963c3` (feat)
3. **Task 3: Complete STORE-01..05 smoke harness (RED for 02/03)** — `973496e` (test)

**Plan metadata:** (final docs commit — see below)

## Files Created/Modified
- `engine/bricks/lib/fanout-path.js` — `buildFanoutName` (`__`-join + `.json`) and canonical `sanitizePathSegment` (`[a-z0-9._-]`, strips `/` and `..`); shared by Plan 02 bricks.
- `engine/bricks/store-scaffold.js` — idempotent `runs/<space>/` slot-tree scaffolder; imports `sanitizePathSegment` from `./lib/fanout-path`; 11 slot dirs + 16 stub files; sidecar log; `--space` required/sanitized.
- `engine/contracts/store-smoke.sh` — executable bash harness asserting STORE-01..05.
- `engine/contracts/NAMING.md` — §3 verb set extended with `scaffold · version · receipt · fanout`.
- `runs/smoke/**` — committed scaffolded slot tree (provenance + acceptance target).

## Decisions Made
- **D-Q1 (dumps location):** scaffold both `corpus/` (per-brand) and flat `dumps/` parent dirs; Phase 3 manifests lock the final dump write path. Phase 1 only ensures both parents exist.
- **D-Q3 (.json/.md, case):** follow the §6 operator-handed slot names verbatim (lowercase, §6 extensions). NAMING.md §5's UPPERCASE rule governs the engine's own deliverables, not these pipeline slot names.
- **D-smoke-path:** harness at `engine/contracts/store-smoke.sh` (next to `h6-*.sh`), run `bash engine/contracts/store-smoke.sh --space=smoke` (per 01-VALIDATION.md + engine smoke co-location).
- **D-version-grain:** whole-SPACE versioning (`<base>-vN`), not per-artifact `v2/`. The resolver itself lands in Plan 02; the smoke harness's STORE-02 assert already encodes `smoke-v2` as the expected next free space and treats the resolver as read-only (names the next space, writes nothing).

## Deviations from Plan

None — plan executed exactly as written. The four `<decisions>` block items were applied as specified; no Rule 1-4 deviations were needed.

## Smoke-Harness RED State (handed to Plan 02)

`bash engine/contracts/store-smoke.sh --space=smoke` currently exits 1 — this is the CORRECT, EXPECTED Wave-0 state, not a failure:

| Requirement | Status | Why |
|-------------|--------|-----|
| STORE-01 (scaffold slot tree) | GREEN | 26 dir/file asserts pass |
| STORE-04 (fan-out namer) | GREEN | `__`-join + distinct-cell asserts pass |
| STORE-05 (smoke space usable) | GREEN | space exists + slot writable |
| STORE-02 (no-overwrite versioning) | RED | `engine/bricks/space-version.js` not built yet (Plan 02). Byte-intact sub-assert passes (resolver is a no-op when absent); the `smoke-v2` name sub-assert fails. |
| STORE-03 (receipt ledger) | RED | `engine/bricks/receipt-write.js` not built yet (Plan 02). Receipt file missing. |

**Plan 02 contract:** landing `space-version.js` (read-only resolver returning `smoke-v2`, writing nothing) and `receipt-write.js` (writes `_receipts/<spawn-id>.json` with `spawn_id`, `inputs_hash` (sha256), `validator_verdicts`, `outputs`, `ts`) turns STORE-02/03 green with zero changes to this harness.

## Helper Export Surface (consumed by Plan 02)

`engine/bricks/lib/fanout-path.js` exports:
- `buildFanoutName(...keys)` → sanitized keys `.join('__') + '.json'`
- `sanitizePathSegment(raw)` → `[a-z0-9._-]` only, strips `/` and `..` (the canonical traversal-safe sanitizer Plan 02's `space-version.js` and `receipt-write.js` must import rather than re-paste)

## Slot List Scaffolded (reconciled §6/R1)

- **Directories (11):** `_receipts/`, `corpus/`, `dumps/`, `ads/`, `funnels/`, `voc/`, `voc/market-signal/`, `voc-bank/`, `copy/`, `review/`, `asset-classify/`
- **Files (16):** `bet-brief.md`, `product-intake.md`, `funnel-brief.md`, `asset-classify/CLAIM-LIST.json`, `brands.json`, `queries_run.json`, `funnels/_tally.json`, `ad-volume-aggregate.json`, `space-map.json`, `voc/gap_candidates.json`, `market-selection.json`, `ntp-pick.json`, `awareness-read.json`, `audit-verdicts.json`, `chief-verdicts.json`, `asset-records.json`
- **Not scaffolded:** a creds slot (gitignored seam files); `engine/_fixture/` untouched (it is the engine's own fixture).

## Issues Encountered
None. The `--space='../evil'` traversal probe sanitized to `evil` and created `runs/evil` (inside `runs/`, no traversal escape) — the transient probe dir was removed; the sanitizer behaved exactly as specified (T-01-01 mitigated).

## Known Stubs
The 16 slot files are intentional empty stubs (`# <slot>` for `.md`, `{}` for `.json`) — field-level contents are deferred to later phases (PART2 Job 5, out of this milestone's scope). This is the declared Phase 1 design: scaffold the slot convention; drop schemas/contents in later with no rewiring. Not a blocking stub.

## User Setup Required
None — no external service configuration required (stdlib Node + filesystem only).

## Next Phase Readiness
- Plan 02 (`space-version.js` + `receipt-write.js`) can import `sanitizePathSegment` from `engine/bricks/lib/fanout-path.js` directly; the smoke harness already asserts both bricks' contracts (STORE-02/03) and turns green on their arrival.
- `runs/smoke/` is the live, committed acceptance space for the run-controller (Phase 2) and the smoke run (Phase 6).
- Engine remains 14/14 green — no regression introduced.

## Self-Check: PASSED

All claimed files exist on disk (fanout-path.js, store-scaffold.js, store-smoke.sh, NAMING.md, runs/smoke/ slot files, this SUMMARY) and all three task commits (`1a37b14`, `ba963c3`, `973496e`) are present in git history. Engine regression `h6-all.sh` 14/14 green.

---
*Phase: 01-artifact-store-scaffold*
*Completed: 2026-06-26*
