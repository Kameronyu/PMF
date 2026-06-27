---
phase: 02-run-controller-pipeline-spine
verified: 2026-06-27T00:00:00Z
status: passed
score: 12/12 must-haves verified
overrides_applied: 0
re_verification:
  previous_status: none
  previous_score: n/a
---

# Phase 2: Run-Controller & Pipeline Spine Verification Report

**Phase Goal:** A single command (`run <step>` / `run all --space=<s>`) drives the PART3 §8 7-phase loop over `pipeline.yaml` in canonical R1 order, assembled from existing engine bricks — not rewritten.
**Verified:** 2026-06-27
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

The phase goal is achieved. A single command — verified via the actual `bin/run` entrypoint, not just `node` — drives the literal PART3 §8 seven-phase loop (preflight → plan-print → context-assembly → spawn → validate → store+receipt → operator-gate) over `pipeline.yaml` in R1 order. The controller is pure ordering glue: it reuses the sanitizer via `require` and invokes every Phase-1 brick (`receipt-write.js`, `space-version.js`, `store-scaffold.js`) and the validator dispatcher (`route.js`) as subprocesses, re-implementing no hashing, sanitization, or versioning (CTRL-12 verified at source). The acceptance harness `controller-smoke.sh` runs GREEN (12/12) with exit 0, both regression suites stay green, and `runs/` is left git-clean.

### Observable Truths (ROADMAP Success Criteria)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `run <step>` runs all 7 phases; `run all` walks pipeline.yaml in R1 order | VERIFIED | `bin/run fx-01-emit ...` emitted all 7 ordered markers (PREFLIGHT→GATE), exit 0; `bin/run all ...` walked fixture pipeline exit 0; runStep body L325-336 calls the 7 phases in §8 order |
| 2 | pipeline.yaml lists 11 R1 step ids; manifest loader reads §5 manifests; reorder = config edit | VERIFIED | `grep -c '^  - ' pipeline.yaml`=11, 00-bet-compiler (L6) before 10-adversarial-re-review (L16); `loadManifest` L82-106 reads `<dir>/<id>.json`; CTRL-10 harness reversed the file → receipt order flipped with zero code change |
| 3 | Preflight refuses by name on missing input; plan-print declares DAG before running; context embeds reads[] bytes | VERIFIED | CTRL-03 assert: deleted bet-brief.md → exit 3 + `REFUSE ... bet-brief.md`; CTRL-04 assert: PLAN block precedes first SPAWN/STORE line; CTRL-05 assert: `<<<DATA ...bet-brief.md>>>` boundary embedded (62 bytes from 1 read) |
| 4 | Spawn waves ≤5; validate blocking with re-spawn ≤2 then escalate; store+receipt no-overwrite; gate blocks/auto-approves in smoke | VERIFIED | CTRL-06: agents:6 → 2 waves (5+1), none >5; CTRL-07 spot-check: bad-emit fired exactly 3 SPAWN waves (initial+2) then escalated exit 2; CTRL-08: receipt has sha256 inputs_hash, space-version names `-v2`, receipt-write write-once; CTRL-09: `GATE [fx-02-gate] auto-approved-smoke` logged + `gate.step_gated===true` |
| 5 | Controller assembled from engine bricks / hooks / route.js, not re-authored | VERIFIED | CTRL-12 static grep at source: NO createHash / inline `[a-z0-9._-]` / `-vN` scan; DOES `require('./lib/fanout-path')` (L40); bricks referenced as subprocess paths only (L48-51), `grep` for `require(receipt-write|space-version|route)` returns none |

**Score:** 5/5 roadmap success criteria verified

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `pipeline.yaml` | 11 R1 step ids in order | VERIFIED | 11 ids, 00→10, git-tracked |
| `engine/bricks/run-controller.js` | 7-phase loop, pure glue | VERIFIED | 414 lines, `node -c` clean, defines runStep/runAll/loadManifest/parsePipeline + 7 phase fns; git-tracked |
| `bin/run` | thin entrypoint shim | VERIFIED | executable (`test -x` ok), execs run-controller.js, drives full loop |
| `engine/contracts/controller-smoke.sh` | one assert per CTRL-01..12 | VERIFIED | all 12 distinct ids present, exit 0 ALL ASSERTS PASS, self-cleans |
| `runs/_fixture/pipeline/pipeline.yaml` + 4 manifests | git-whitelisted §5 fixtures | VERIFIED | all 5 files tracked in git; happy/gate/wave/bad-emit variants present |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|----|--------|---------|
| run-controller.js | lib/fanout-path.js | `require('./lib/fanout-path')` sanitizePathSegment | WIRED | L40, used on --space/--step/id |
| run-controller.js | receipt-write.js | execFileSync subprocess (store phase) | WIRED | L286-294, write-once unique spawn-id (Date.now()+rand) |
| run-controller.js | space-version.js | spawnSync subprocess (no-overwrite naming) | WIRED | L260, dormant absent --rerun (Open Q2); proven by harness UNIT assert |
| run-controller.js | route.js | spawnSync subprocess (validate phase) | WIRED | L230-231, propagates validator exit 2 = reject |
| run-controller.js | pipeline.yaml | parsePipeline reads flat steps: list in runAll | WIRED | L111-117, L344 |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full smoke harness | `bash engine/contracts/controller-smoke.sh` | 12/12 ALL ASSERTS PASS, exit 0 | PASS |
| Single step via entrypoint | `bin/run fx-01-emit --space=_spotcheck --smoke` | all 7 markers in order, exit 0 | PASS |
| Full walk via entrypoint | `bin/run all --pipeline=... --smoke` | exit 0 | PASS |
| Bounded re-spawn (CTRL-07) | `bin/run fx-bad-emit ...` SPAWN count | 3 waves (initial + 2 re-spawns), then escalate exit 2 | PASS |
| Store regression | `bash engine/contracts/store-smoke.sh --space=smoke` | ALL ASSERTS PASS, exit 0 | PASS |
| Engine regression | `bash engine/contracts/h6-all.sh` | 14 passed / 0 failed | PASS |
| Git cleanliness | `git status --porcelain runs/` after runs | empty (clean) | PASS |
| Controller parse | `node -c engine/bricks/run-controller.js` | parse OK | PASS |

### Requirements Coverage

| Requirement | Source Plan | Status | Evidence |
|-------------|-------------|--------|----------|
| CTRL-01 single step 7 phases | 02-02 | SATISFIED | harness CTRL-01 (3 asserts) + bin/run spot-check: 7 markers, exit 0, receipt landed |
| CTRL-02 run all walks R1 | 02-01/02 | SATISFIED | harness CTRL-02: fx-01-emit receipt precedes fx-02-gate (file order), exit 0 |
| CTRL-03 preflight named refusal | 02-01/02 | SATISFIED | harness CTRL-03: deleted input → exit 3 + REFUSE + bet-brief.md path |
| CTRL-04 plan-print before run | 02-02 | SATISFIED | harness CTRL-04: PLAN idx < first SPAWN/STORE idx |
| CTRL-05 context embeds bytes | 02-02 | SATISFIED | harness CTRL-05: `<<<DATA bet-brief.md>>>` boundary, 62 bytes embedded |
| CTRL-06 waves ≤5 | 02-01/02 | SATISFIED | harness CTRL-06: agents:6 → wave 1(5)+wave 2(1), none >5 |
| CTRL-07 explicit validate, re-spawn≤2, escalate | 02-01/02 | SATISFIED | harness CTRL-07 + spot-check: real validate-classifier.js via route.js, 3 spawns, escalate exit 2 |
| CTRL-08 no-overwrite version + receipt write-once | 02-01/02 | SATISFIED | harness CTRL-08 a/b/c: sha256 inputs_hash, space-version `-v2`, write-once exit 1 |
| CTRL-09 gate block-and-log | 02-01/02 | SATISFIED | harness CTRL-09: auto-approved-smoke logged + gate.step_gated===true |
| CTRL-10 reorder = config edit | 02-01/02 | SATISFIED | harness CTRL-10: reversed fixture pipeline flipped receipt order, no code change |
| CTRL-11 manifest loader §5 shape | 02-01/02 | SATISFIED | harness CTRL-11: --print-manifest returns all 7 §5 keys; loadManifest L82-106 |
| CTRL-12 assembled not rewritten | 02-01/02 | SATISFIED | static grep: no rewritten brick logic; requires fanout-path; spawns receipt-write/space-version/route |

No orphaned requirements: REQUIREMENTS.md maps exactly CTRL-01..12 to Phase 2, all claimed in plan frontmatter.

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| run-controller.js | 173, 183 | `mockEmit` / `_stub:true` payloads | ℹ️ Info | Intentional — fixture stub emit by design (Phase 4 replaces with real spawns at the unchanged seam). Not a stub-of-deliverable; the loop mechanism is real. |

No blocker or warning anti-patterns. The `mockEmit` is the explicitly-scoped stub-mode behavior (CONTEXT decision A); the controller mechanism (ordering, preflight, validate, store, gate) is fully real and exercised end-to-end.

### Human Verification Required

None. Phase VALIDATION.md states all Phase-2 behaviors have automated bash-smoke verification; the manual-only table is empty. All five roadmap success criteria are mechanically asserted and were observed passing on a live run.

### Gaps Summary

No gaps. All 12 CTRL requirements and all 5 roadmap success criteria are verified by a live harness run (12/12 ALL ASSERTS PASS, exit 0), confirmed independently by source inspection (CTRL-12 assembly, 7-phase ordering, bounded re-spawn) and behavioral spot-checks via the actual `bin/run` entrypoint. Both regression suites (store-smoke 6 groups, h6-all 14/14) stay green and `runs/` is left git-clean. The two documented deviations from plan (fx-bad-emit `stub_emit` payload to actually trigger the validator reject; CTRL-12 help-string rewording) were fixes in DATA/docs that strengthen the contract — the harness was not weakened, and both are corroborated by the live CTRL-07 and CTRL-12 passes.

---

_Verified: 2026-06-27_
_Verifier: Claude (gsd-verifier)_
