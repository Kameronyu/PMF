---
phase: 02-run-controller-pipeline-spine
plan: 01
subsystem: infra
tags: [pipeline, run-controller, acceptance-harness, fixtures, bash-smoke, yaml, manifest]

# Dependency graph
requires:
  - phase: 01-artifact-store-foundation
    provides: store-scaffold.js / space-version.js / receipt-write.js / lib/fanout-path.js (the bricks the harness asserts against + Plan 02-02 will assemble)
provides:
  - "pipeline.yaml (root) — the canonical R1 flat step-id list (11 ids, 00-bet-compiler..10-adversarial-re-review); the CTRL-10/CTRL-02 production artifact"
  - "runs/_fixture/pipeline/ — a git-whitelisted fixture: a 2-step pipeline.yaml + 4 §5-shaped JSON manifests (happy / gate / wave / bad-emit)"
  - "engine/contracts/controller-smoke.sh — the acceptance harness (one named assert per CTRL-01..12), authored RED, mirroring store-smoke.sh"
affects: [02-02 run-controller assembly (turns this harness GREEN), 03-manifest-authoring]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Authored-RED acceptance harness (Nyquist Wave-0): the executable target lands before the unit-under-test"
    - "Controller-missing guard (run_ctrl): a missing brick yields one clean named FAIL line, never a set -u crash"
    - "Manifest-as-data §5 fixture set under git-whitelisted runs/_fixture/**"

key-files:
  created:
    - pipeline.yaml
    - runs/_fixture/pipeline/pipeline.yaml
    - runs/_fixture/pipeline/manifests/fx-01-emit.json
    - runs/_fixture/pipeline/manifests/fx-02-gate.json
    - runs/_fixture/pipeline/manifests/fx-03-wave.json
    - runs/_fixture/pipeline/manifests/fx-bad-emit.json
    - engine/contracts/controller-smoke.sh
  modified: []

key-decisions:
  - "Manifest-availability = approach A: a tiny git-whitelisted fixture manifest set drives the full 7-phase loop, NOT the real 11 manifests (those are Phase 3)"
  - "fx-01-emit writes a no-rule basename (fx-emit.json) so route.js passes (exit 0) without an expensive validate-classifier-passing artifact; fx-bad-emit writes space-map.json to PROVE CTRL-07 exit-2 propagation"
  - "Harness SPACE=_ctrlsmoke (underscore scratch, NOT auto-gitignored) → rm -rf both ends is mandatory to keep git status clean for runs/"
  - "run_ctrl guard makes every controller-driven assert RED-safe: controller-missing emits a named FAIL, not a bash abort"

patterns-established:
  - "Authored-RED harness: the contract is executable before the implementation (mirrors Phase-1 STORE-02/03 asserts ahead of their bricks)"
  - "One named assert per requirement id (CTRL-01..12), self-cleaning temp space, named final exit — the project bash-smoke idiom"

requirements-completed: [CTRL-02, CTRL-03, CTRL-06, CTRL-08, CTRL-09, CTRL-10, CTRL-11, CTRL-12]

# Metrics
duration: 4min
completed: 2026-06-27
---

# Phase 2 Plan 01: Pipeline Spine Data + Acceptance Harness Summary

**Authored the real R1 pipeline.yaml, a git-whitelisted §5 fixture manifest set, and controller-smoke.sh (one named assert per CTRL-01..12) — the executable RED contract Plan 02-02's run-controller must turn green.**

## Performance

- **Duration:** 4 min
- **Started:** 2026-06-27T11:18:21Z
- **Completed:** 2026-06-27T11:22:01Z
- **Tasks:** 2
- **Files modified:** 7 (all created)

## Accomplishments
- `pipeline.yaml` (root): the canonical R1 flat step-id list — 11 ids `00-bet-compiler`..`10-adversarial-re-review` in order. Reordering the pipeline is a one-line edit to this file (CTRL-10), zero controller change.
- A git-whitelisted fixture under `runs/_fixture/pipeline/`: a 2-step fixture `pipeline.yaml` (drives the CTRL-02 `run all` walk) + 4 §5-shaped JSON manifests exercising the happy path (validator:null/gate:false), the gate (gate:true → CTRL-09), the wave-cap (agents:6 → CTRL-06), and the bad-emit (writes space-map.json → CTRL-07 exit-2 propagation).
- `engine/contracts/controller-smoke.sh`: the acceptance harness, one named assert per CTRL-01..12, mirroring `store-smoke.sh` verbatim (set -u, cd-to-repo-root, ok/bad, inline `node -e` asserts, self-cleaning `_ctrlsmoke` scratch, named final exit). **Authored RED** — the controller arrives in Plan 02-02.

## Task Commits

Each task was committed atomically:

1. **Task 1: real pipeline.yaml (R1 order) + fixture manifest set** — `c75f3a9` (feat)
2. **Task 2: controller-smoke.sh — one assert per CTRL-01..12 (RED)** — `f87cc56` (test)

## Files Created/Modified
- `pipeline.yaml` — canonical R1 flat list of the 11 step ids (CTRL-10/CTRL-02 production artifact)
- `runs/_fixture/pipeline/pipeline.yaml` — 2-step fixture walk (fx-01-emit, fx-02-gate)
- `runs/_fixture/pipeline/manifests/fx-01-emit.json` — happy path: validator:null, gate:false, writes a no-rule basename (route.js passes)
- `runs/_fixture/pipeline/manifests/fx-02-gate.json` — gate:true (CTRL-09 block-and-log)
- `runs/_fixture/pipeline/manifests/fx-03-wave.json` — agents:6 (CTRL-06 wave-cap → 2 waves)
- `runs/_fixture/pipeline/manifests/fx-bad-emit.json` — writes space-map.json → validate-classifier.js rejects (CTRL-07 exit-2 propagation)
- `engine/contracts/controller-smoke.sh` — acceptance harness, 12 named CTRL asserts, RED-safe, self-cleaning

## Decisions Made
- **Manifest-availability = approach A** (the CONTEXT decision): a tiny git-whitelisted fixture manifest set drives the full 7-phase loop, not the real 11 manifests (Phase 3). The harness drives the fixture exactly as `run all --space=smoke` will later drive the real 11.
- **fx-01-emit writes a no-rule basename** (`fx-emit.json`) so `route.js` passes on the no-rule path (exit 0) — proving the explicit-call wiring without an expensive validate-classifier-passing artifact. **fx-bad-emit writes `space-map.json`** specifically to prove CTRL-07 exit-2 propagation through the real validator.
- **SPACE=_ctrlsmoke** (underscore scratch — verified NOT auto-gitignored): `rm -rf "runs/${SPACE}"` runs at both start and end, keeping `git status` clean for `runs/`.
- **run_ctrl guard** makes every controller-driven assert RED-safe — a missing `run-controller.js` emits a single named `FAIL:` line instead of aborting under `set -u`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- A verification-command false negative: my own `grep -c 'rm -rf "runs/${SPACE}"'` returned 0 because the wrapping shell expanded `${SPACE}` before grep saw the pattern. Confirmed with `grep -cF` (fixed-string): 13 occurrences present, including the clean START (line 56) and clean END (line 311). No defect in the harness.

## RED-State Note (expected, by design)

`bash engine/contracts/controller-smoke.sh` currently **exits non-zero (1)** with clear `FAIL:` lines — this is the intended Nyquist Wave-0 state. The controller (`engine/bricks/run-controller.js`) does not exist yet; it arrives in **Plan 02-02**, which turns this harness GREEN unchanged. Two controller-independent UNIT sub-asserts already PASS now: CTRL-08(b) `space-version.js` returns `_ctrlsmoke-v2`, and CTRL-08(c) `receipt-write.js` refuses a colliding spawn-id (write-once). The harness does NOT bash-crash, and leaves no `_ctrlsmoke` residue (self-clean verified).

## Regression
- `bash engine/contracts/h6-all.sh` → 14 passed / 0 failed (ENGINE SMOKES ALL GREEN).
- `bash engine/contracts/store-smoke.sh --space=smoke` → STORE-SMOKE: ALL ASSERTS PASS.
- This plan added only new files; it touched no existing brick.

## Next Phase Readiness
- The executable CTRL-01..12 contract is locked. Plan 02-02 builds `engine/bricks/run-controller.js` (the 7-phase loop assembled from bricks) + the thin `run` entrypoint to turn `controller-smoke.sh` GREEN.
- The fixture loop (happy/gate/wave/bad-emit) is the smoke target; the real `pipeline.yaml` (root) is the production list reordered by config only.

## Self-Check: PASSED

All 8 created files exist on disk; both task commits (`c75f3a9`, `f87cc56`) are in git history.

---
*Phase: 02-run-controller-pipeline-spine*
*Completed: 2026-06-27*
