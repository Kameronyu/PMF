---
phase: 02-run-controller-pipeline-spine
plan: 02
subsystem: run-controller
tags: [pipeline, run-controller, 7-phase-loop, orchestrator, assembly, smoke-green, bricks-reuse]

# Dependency graph
requires:
  - phase: 01-artifact-store-foundation
    provides: store-scaffold.js / space-version.js / receipt-write.js / lib/fanout-path.js (the bricks assembled into the loop)
  - phase: 02-run-controller-pipeline-spine
    plan: 01
    provides: pipeline.yaml (R1) + runs/_fixture/pipeline/** manifests + controller-smoke.sh (the RED acceptance contract turned GREEN here)
provides:
  - "engine/bricks/run-controller.js — the PART3 §8 SEVEN-PHASE loop (runStep + runAll + loadManifest + parsePipeline), pure ordering glue over the Phase-1 bricks + route.js"
  - "bin/run — the thin run entrypoint shim (run <step|all> --space=<s>)"
  - "manifest stub_emit convention — a manifest may declare its mock-emit payload (generic, no per-id special-casing); negative fixtures declare a validator-rejecting payload"
affects: [03-manifest-authoring (drops the 11 real manifests into the same loader seam), 04-stub-emit-behavior (replaces mockEmit with real spawns)]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Pure ordering glue: load → 7 ordered delegations → return; every phase's WORK is a brick/hook subprocess, the controller owns only the ORDER (CTRL-12)"
    - "Explicit validator invocation (spawnSync) — never the PostToolUse hook (hooks don't fire in subagents, FIRING-MANIFEST §4)"
    - "Unique spawn-id per spawn (Date.now()+rand) to honor receipt-write.js write-once across the ≤2 re-spawn loop"
    - "Manifest-declared stub_emit payload — keeps mockEmit generic while letting a negative fixture emit a deliberately-bad artifact"

key-files:
  created:
    - engine/bricks/run-controller.js
    - bin/run
  modified:
    - runs/_fixture/pipeline/manifests/fx-bad-emit.json

key-decisions:
  - "D-stub-emit-payload: mockEmit reads an OPTIONAL manifest stub_emit field (default {_stub:true,step:id}); a negative fixture declares a reject-triggering payload. Keeps the controller generic — zero per-id branching in the glue."
  - "D-gate-always-logs: operatorGate emits a GATE marker even for a non-gated step ('none (step not gated)') so the gate phase ALWAYS reports — the harness's 7-marker assert and P9 'logged never silent' both hold."
  - "D-context-data-headers: assembleContext under --smoke prints the per-read <<<DATA path>>> headers so a log/receipt diff proves the reads[] bytes were embedded (the agent receives bytes, not a fetch)."
  - "D-space-version-dormant: space-version.js no-overwrite naming is wired but acts only on an explicit --rerun flag; smoke uses a fixed space, so CTRL-08's NAMING is proven by the harness's space-version UNIT assert (Open Q2)."

requirements-completed: [CTRL-01, CTRL-02, CTRL-03, CTRL-04, CTRL-05, CTRL-06, CTRL-07, CTRL-08, CTRL-09, CTRL-10, CTRL-11, CTRL-12]

# Metrics
duration: 5min
completed: 2026-06-27
---

# Phase 2 Plan 02: Run-Controller (7-Phase Loop) Summary

**Built `engine/bricks/run-controller.js` — the PART3 §8 seven-phase loop (preflight → plan-print → context-assembly → spawn → validate → store+receipt → operator-gate) assembled as pure ordering glue over the Phase-1 store bricks + route.js — plus the thin `bin/run` entrypoint, turning Plan 01's RED `controller-smoke.sh` GREEN (all 12 CTRL asserts pass) with no store/engine regression.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-06-27T11:25:10Z
- **Completed:** 2026-06-27T11:30:27Z
- **Tasks:** 2
- **Files:** 2 created (run-controller.js, bin/run) + 1 modified (fx-bad-emit.json fixture)

## Accomplishments

- **`engine/bricks/run-controller.js`** (384 lines) — the one new behavioral unit of Phase 2. `runStep(id, space, opts)` runs the literal §8 7-phase sequence; `runAll(space, opts)` walks `pipeline.yaml` in file order; `loadManifest(id, dir)` reads the §5 manifest-as-data shape with a named refusal on any missing key; `parsePipeline(file)` is the zero-dep flat-list splitter. Every phase delegates: sanitization → `require('./lib/fanout-path')`; validate → `route.js`/manifest validator (explicit `spawnSync`); store → `receipt-write.js` (write-once, unique spawn-id); no-overwrite naming → `space-version.js`. **It re-implements no hashing, sanitization, scaffolding, or versioning (CTRL-12 static-grep clean).**
- **`bin/run`** — a thin `#!/usr/bin/env bash` exec shim passing argv straight to the controller. `bin/run <step> --space=<s>` and `bin/run all --space=<s>` both drive the loop end-to-end (verified exit 0).
- **`controller-smoke.sh` turned GREEN** — all 12 CTRL asserts (CTRL-01..12) pass; harness exits 0 with `ALL ASSERTS PASS ✓`; `runs/` left clean (no `_ctrlsmoke` residue).
- **Regression intact** — `store-smoke.sh --space=smoke` exit 0; `h6-all.sh` 14/14 green. The controller assembled the store layer without touching a single existing brick.

## Task Commits

1. **Task 1: controller core — CLI shell, loadManifest, parsePipeline, phases 1-5** — `0e80901` (feat)
2. **Task 2: store+receipt + gate phases, runAll walk, bin/run — controller-smoke GREEN** — `aa7de61` (feat)

## Files Created/Modified

- `engine/bricks/run-controller.js` (created) — the PART3 §8 7-phase loop + loader + pipeline parser; pure ordering glue.
- `bin/run` (created, +x) — thin entrypoint shim to run-controller.js.
- `runs/_fixture/pipeline/manifests/fx-bad-emit.json` (modified) — added a `stub_emit` payload that the validator rejects (see Deviations).

## Decisions Made

- **D-stub-emit-payload:** `mockEmit` reads an optional manifest `stub_emit` field (default `{_stub:true,step:id}`). This keeps the controller's spawn phase generic — no per-id special-casing in the glue — while letting a negative fixture emit a deliberately-bad artifact. Phase 4 (real stub emits) inherits the same seam.
- **D-gate-always-logs:** `operatorGate` logs a `GATE [<id>] none (step not gated)` marker for a non-gated step (rather than returning silently). This satisfies the harness's "all 7 phase markers present" assert AND PART3 P9 ("a logged state, never a silent skip") in one move.
- **D-context-data-headers:** under `--smoke`, `assembleContext` prints the per-read `<<<DATA <path>>>` boundary headers, so a log/receipt diff proves the `reads[]` bytes were embedded (CTRL-05 — "there is no file to Read").
- **D-space-version-dormant:** the `space-version.js` no-overwrite NAMING path is wired but acts only on an explicit `--rerun` flag; smoke runs a fixed space, so CTRL-08's NAMING is proven by the harness's `space-version.js` UNIT assert (`<space>-v2`), not a full versioned re-run drive (research Open Q2).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] fx-bad-emit's `{_stub:true}` artifact PASSED validate-classifier.js, so CTRL-07's reject path could not fire**
- **Found during:** Task 2 (first harness run — CTRL-07 reported "bad emit did not escalate, exit 0").
- **Issue:** Plan 01's fixture assumed a stub `space-map.json` would be rejected by `validate-classifier.js`. It is not: every reject rule in that validator iterates over arrays that default to `[]` when absent, so a minimal `{_stub:true,step:...}` object produces ZERO violations and exits 0. The negative path (reject → re-spawn ≤2 → escalate → exit≠0) therefore never triggered.
- **Fix:** Added a `stub_emit` field to `fx-bad-emit.json` declaring a deliberately-invalid payload — `{"_stub":true,"saturation":[{"transformation":"x"}]}` — which trips validate-classifier Rule 2 (a `saturation` entry must carry both `transformation` AND `niche`) → `REJECT` + exit 2. The controller's `mockEmit` was made to read this optional manifest field generically (no per-id branching), so the fix lives in DATA (the fixture) + a generic seam, not in special-cased controller code. The harness itself was NOT weakened — its CTRL-07 expectation (validator output + escalate + non-zero exit) is met by a genuinely-rejected artifact.
- **Files modified:** `runs/_fixture/pipeline/manifests/fx-bad-emit.json` (fixture), `engine/bricks/run-controller.js` (`mockEmit` reads `stub_emit`).
- **Commit:** `aa7de61`

**2. [Rule 1 - Bug] CTRL-12 false-positive on the banned sanitize-regex literal in human-readable strings**
- **Found during:** Task 1 / Task 2 (the CTRL-12 static grep flags the literal `[a-z0-9._-]` anywhere in the source).
- **Issue:** A `--help` line and a `--space` error message contained the literal char-class `[a-z0-9._-]` as documentation, which the harness's CTRL-12 banned-pattern grep cannot distinguish from a re-implemented inline sanitizer.
- **Fix:** Reworded both strings to reference `lib/fanout-path` by name instead of pasting the char-class. The controller genuinely re-implements no sanitizer (it `require`s the shared one); this was purely a documentation-string collision with the static check.
- **Files modified:** `engine/bricks/run-controller.js`.
- **Commits:** `0e80901` (help text), `aa7de61` (error message).

## Issues Encountered

None beyond the two auto-fixed items above. The 7-phase order, the explicit-validator rule, the unique-spawn-id rule, and the no-overwrite naming all wired against verified brick contracts on the first pass.

## Verification

- `bash engine/contracts/controller-smoke.sh` → `CONTROLLER-SMOKE: ALL ASSERTS PASS ✓`, exit 0 (all 12 CTRL ids green).
- `node -c engine/bricks/run-controller.js` → clean parse; `test -x bin/run` → executable; `bin/run fx-01-emit --space=... --smoke` → drives all 7 phases, exit 0.
- CTRL-12 static grep: NO `createHash` / inline sanitize regex / `../` strip / `-vN` scan; DOES `require('./lib/fanout-path')` + spawn `receipt-write.js`/`space-version.js`/`route.js`.
- `git status --porcelain runs/` → no `_ctrlsmoke` residue (harness self-cleans).
- **Regression:** `bash engine/contracts/store-smoke.sh --space=smoke` exit 0; `bash engine/contracts/h6-all.sh` → 14 passed / 0 failed.

## Threat Surface

All five plan threats (T-02-01..05) are mitigated as designed:
- **T-02-01** path traversal — `sanitizePathSegment` (required, not re-pasted) on every flag-derived segment before `path.join`.
- **T-02-02** silent provenance overwrite — receipt-write.js write-once + unique `Date.now()`+rand spawn-id.
- **T-02-03** command injection — every brick/validator invoked via `spawnSync(process.execPath,[path,...])` / `execFileSync` (args array, no shell).
- **T-02-04** improvising past a missing input — preflight named refusal, distinct `exit 3`, never continues.
- **T-02-05** validate-on-write hook gap — Validate phase invokes the validator EXPLICITLY as an orchestrator subprocess.

No new security surface beyond the plan's threat model.

## Next Phase Readiness

- The 7-phase loop is the locked seam. Phase 3 authors the 11 real `<id>.json` manifests into the same `--manifest-dir` the loader already reads; the real `pipeline.yaml` (R1, 0..10) already drives `run all` with zero controller change (CTRL-10).
- Phase 4 replaces `mockEmit` (and the `stub_emit` fixture convention) with real prompt spawns at the unchanged spawn seam.
- Operator sign-off UX (the `awaitSignoff` block path) and the versioned `--rerun` drive remain wired-but-dormant, ready for a later milestone.

## Self-Check: PASSED

Created files exist on disk (`engine/bricks/run-controller.js`, `bin/run`); modified fixture present; both task commits (`0e80901`, `aa7de61`) are in git history; controller-smoke.sh exits 0.

---
*Phase: 02-run-controller-pipeline-spine*
*Completed: 2026-06-27*
