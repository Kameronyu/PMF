---
phase: 01-artifact-store-scaffold
plan: 02
subsystem: infra
tags: [versioning, receipt, ledger, no-overwrite, sha256, node, store]

# Dependency graph
requires:
  - phase: 01-01-store-scaffold
    provides: "engine/bricks/lib/fanout-path.js (sanitizePathSegment) + store-scaffold.js + the complete STORE-01..05 store-smoke.sh harness (STORE-02/03 authored RED)"
provides:
  - "engine/bricks/space-version.js — whole-SPACE no-overwrite-v1 version resolver; --space required; READ-ONLY (prints next free <base>-vN, mutates nothing under runs/)"
  - "engine/bricks/receipt-write.js — per-spawn _receipts/<spawn_id>.json writer + sha256 inputs_hash helper (hashInputs over sorted input bytes)"
  - "a fully GREEN bash engine/contracts/store-smoke.sh --space=smoke (all STORE-01..05) — the Phase-1 gate"
affects: [run-controller, CTRL-08, VALID-04, VALID-05, smoke-run, step-manifests]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Read-only resolver: a version brick that only NAMES the next free space (pure stdout) and writes nothing — the property that guarantees the byte-intact no-overwrite invariant"
    - "One-receipt-per-spawn JSON (not JSONL) under runs/<space>/_receipts/ — committed provenance; survives partial writes, easy to diff"
    - "sha256 inputs_hash over SORTED input bytes (node:crypto) — order-independent provenance hash"
    - "Shape-now / content-later: receipt ships validator_verdicts:[] + gate{step_gated:false,decision:null} slots that Phase 5 populates"

key-files:
  created:
    - engine/bricks/space-version.js
    - engine/bricks/receipt-write.js
  modified: []

key-decisions:
  - "D-version-grain: version the whole SPACE (<base>-vN), never per-artifact — resolver takes a SPACE NAME, not an artifact path"
  - "D-resolver-read-only: space-version.js is pure-stdout, writes nothing under runs/ — controller (Phase 2 CTRL-08) decides when to scaffold the bumped space"
  - "D-no-guard-hook: no-overwrite enforcement is convention-only this phase; a guard hook is explicitly DEFERRED (not built)"
  - "D-receipt-per-file: one _receipts/<spawn_id>.json per spawn (not a JSONL append-log)"
  - "D-receipt-shape: Phase 1 ships the SHAPE + writer + sha256 helper; Phase 2/5 populate validator_verdicts + gate decisions"

patterns-established:
  - "Read-only version resolver (names the next free space, mutates nothing) — the byte-intact invariant lives in the brick's no-write property"
  - "Per-spawn receipt file with a sha256 inputs_hash over sorted bytes — order-independent, committed provenance"

requirements-completed: [STORE-02, STORE-03]

# Metrics
duration: 3min
completed: 2026-06-26
---

# Phase 01 Plan 02: Store Version & Receipt Summary

**Whole-space no-overwrite-v1 version resolver (read-only, names the next free `<base>-vN`, mutates nothing) + per-spawn `_receipts/<spawn_id>.json` ledger writer with a sha256-over-sorted-bytes `inputs_hash` — turning the full `store-smoke.sh` GREEN across STORE-01..05.**

## Performance

- **Duration:** 3 min
- **Started:** 2026-06-26T14:35:59Z
- **Completed:** 2026-06-26T14:38:29Z
- **Tasks:** 2
- **Files modified:** 2 deliverables (both new)

## Accomplishments
- `engine/bricks/space-version.js` (STORE-02) — scans `runs/` for `<base>` + `<base>-vN` and PRINTS the next free whole-space name to stdout (one bare line). READ-ONLY: creates/writes/mutates nothing under `runs/`. Semantics: no `runs/<base>` → `<base>`; `runs/<base>` only → `<base>-v2`; `runs/<base>`+`<base>-v2` → `<base>-v3`. The `^<base>-v(\d+)$` regex matches only the exact `-vN` suffix, so `runs/<base>-backup` is not counted.
- `engine/bricks/receipt-write.js` (STORE-03) — writes `runs/<space>/_receipts/<spawn_id>.json` (committed run ledger, one file per spawn) carrying `spawn_id`, `step`, `space`, `inputs_hash`, `inputs[]`, `outputs[]`, `validator_verdicts:[]`, `gate{step_gated,decision}`, `ts`. The `hashInputs` helper is sha256 (`node:crypto`) over SORTED input bytes — order-independent.
- Both bricks import the canonical `sanitizePathSegment` from Plan 01's `engine/bricks/lib/fanout-path.js` (no re-paste); `--space`/`--spawn-id` are sanitized before any `path.join` so a hostile value can't escape `runs/`.
- **The Phase-1 gate is GREEN:** `bash engine/contracts/store-smoke.sh --space=smoke` exits 0 with `STORE-SMOKE: ALL ASSERTS PASS` — all of STORE-01..05 pass, with zero changes to the Plan-01 harness.
- **Engine undisturbed:** `bash engine/contracts/h6-all.sh` → 14/14 green (regression spot-check).

## Resolver Semantics + Read-Only Guarantee (STORE-02)

`space-version.js --space=<base>` is a pure name resolver:

| `runs/` state | prints |
|---------------|--------|
| no `runs/<base>` (or no `runs/` at all) | `<base>` (first run uses the un-suffixed base) |
| `runs/<base>` exists, no `runs/<base>-v*` | `<base>-v2` |
| `runs/<base>` + `runs/<base>-v2` exist | `<base>-v3` |
| `runs/<base>-backup` present (not a `-vN`) | not counted as a version |

**Read-only guarantee:** the brick's only output is `process.stdout.write(next)`. It performs a single `fs.readdirSync('runs')` (read) and writes/creates/mutates NOTHING under `runs/`. This no-write property IS the byte-intact invariant — the smoke harness snapshots `sha256sum runs/smoke/**` before/after the resolver and asserts equality, which holds because the resolver never touches `runs/`. The decision to actually scaffold the bumped space belongs to the Phase-2 run-controller (CTRL-08), not this brick.

## Receipt Shape + sha256 Helper (STORE-03)

The shape Phase 2/5 will populate (validator_verdicts + gate are the Phase-5 slots, shipped here as defaults):

```json
{
  "spawn_id": "<sanitized id>",
  "step": "05-test",
  "space": "smoke",
  "inputs_hash": "<64 hex chars — sha256>",
  "inputs": ["runs/smoke/space-map.json"],
  "outputs": ["runs/smoke/market-selection.json"],
  "validator_verdicts": [],
  "gate": { "step_gated": false, "decision": null },
  "ts": "<ISO timestamp>"
}
```

`hashInputs(inputPaths)` signature: takes an array of paths, sorts a copy, then for each path updates the sha256 with the path string + a `\0` separator + (if the file exists) its bytes; returns the 64-char hex digest. Sorting makes the hash order-independent (`--inputs='a,b'` ≡ `--inputs='b,a'`, verified equal). Phase 2 supplies the real per-step input list; Phase 5 (VALID-04/05) populates `validator_verdicts` and the real `gate.decision`.

## Task Commits

Each task was committed atomically (with hooks, no `--no-verify`):

1. **Task 1: space-version resolver (STORE-02)** — `e2f7fc3` (feat)
2. **Task 2: receipt-write brick + sha256 inputs_hash (STORE-03)** — `701effa` (feat)

**Plan metadata:** final docs commit — see below.

## Files Created/Modified
- `engine/bricks/space-version.js` — whole-SPACE no-overwrite-v1 version resolver; `--space` required + sanitized; `readdirSync('runs')` scan; prints `<base>-vN`; READ-ONLY (pure stdout, no `runs/` mutation); imports `sanitizePathSegment` from `./lib/fanout-path`; no guard hook.
- `engine/bricks/receipt-write.js` — per-spawn `_receipts/<spawn_id>.json` writer; `--space` + `--spawn-id` required + sanitized; `hashInputs` sha256-over-sorted-bytes helper (`node:crypto`); receipt shape with `validator_verdicts:[]` + `gate` defaults; one-line summary; exit 0/1.

## Decisions Made
- **D-version-grain:** version the whole SPACE (`<base>-vN`), never per-artifact. The resolver takes a SPACE NAME, never an artifact path (Pitfall 1 avoided). [MATERIALS.md L38; CLAUDE.md "Versioning"]
- **D-resolver-read-only:** `space-version.js` is pure-stdout — it NAMES the next free space and writes nothing under `runs/`. This is the simplest correct design and the byte-intact invariant's mechanism. The controller (Phase 2 CTRL-08) decides whether/when to scaffold the bumped space.
- **D-no-guard-hook:** no-overwrite enforcement stays convention-only this phase; a guard hook is explicitly DEFERRED — none was built, and nothing was added to `.claude/settings.json`. [CLAUDE.md "Versioning"]
- **D-receipt-per-file:** one `_receipts/<spawn_id>.json` per spawn (not a JSONL append-log) — survives partial writes, easy to diff.
- **D-receipt-shape:** Phase 1 ships the SHAPE + writer + sha256 helper; `validator_verdicts:[]` and `gate{step_gated:false,decision:null}` are slots Phase 5 populates. `receipt-write` takes a fully-formed receipt's parts via CLI flags and does NOT couple to step internals.
- **Optional sidecar log:** none written — `space-version.js` is pure-stdout (cleanest for `NEXT=$(...)` capture) and `receipt-write.js` writes only the committed receipt JSON (no `_receipt-write-log.txt` was needed). The committed receipt is the provenance; a gitignored sidecar would add nothing here.

## Deviations from Plan

None — plan executed exactly as written. The five `<decisions>` block items (D-version-grain, D-resolver-read-only, D-no-guard-hook, D-receipt-per-file, D-receipt-shape) were applied as specified; no Rule 1–4 deviations were needed. `validate-receipt.js` was not touched (it is the pipeline-audit context-receipt gate, not the run ledger — correctly left alone).

## Issues Encountered
None. Both Task verification blocks and the full smoke harness passed on first run. The transient multi-version probe (`runs/smoke-v2`, `runs/nope`, `runs/smoke-backup`) used to exercise the `-v3` / bare-base / `-backup`-excluded cases were removed after asserting; the only live space remains `runs/smoke`.

## Known Stubs
None introduced by this plan. The `validator_verdicts:[]` and `gate.decision:null` defaults in the receipt are NOT stubs — they are the declared Phase-1 SHAPE slots that Phase 5 (VALID-04/05) populates with real verdicts/decisions, exactly as the D-receipt-shape decision specifies. No data path is left dangling for Phase 1's goal.

## User Setup Required
None — stdlib Node (`node:fs`, `node:path`, `node:crypto`) + filesystem only; no external service configuration.

## Next Phase Readiness
- **STORE-02/03 closed.** Phase 2's run-controller can CALL `space-version.js` for the next free space (CTRL-08 store+receipt phase) and `receipt-write.js` to emit a receipt per spawn.
- **The receipt SHAPE is fixed:** Phase 5 (VALID-04) appends `validator_verdicts`, Phase 5 (VALID-05) sets the real `gate.decision` — no rewiring of the writer needed; both are pass-through CLI slots today.
- **Full Phase-1 gate GREEN:** `store-smoke.sh --space=smoke` exits 0 across STORE-01..05; `runs/smoke/` is the live committed acceptance space for the smoke run (Phase 6).
- **Engine remains 14/14 green** — no regression introduced by Phase 1.

## Self-Check: PASSED

All claimed files exist on disk (`engine/bricks/space-version.js`, `engine/bricks/receipt-write.js`, this SUMMARY) and both task commits (`e2f7fc3`, `701effa`) are present in git history. `bash engine/contracts/store-smoke.sh --space=smoke` exits 0 (ALL STORE-01..05 green); `bash engine/contracts/h6-all.sh` 14/14 green.

---
*Phase: 01-artifact-store-scaffold*
*Completed: 2026-06-26*
