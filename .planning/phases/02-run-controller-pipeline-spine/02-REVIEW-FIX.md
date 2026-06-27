---
phase: 02-run-controller-pipeline-spine
fixed_at: 2026-06-27T00:00:00Z
review_path: .planning/phases/02-run-controller-pipeline-spine/02-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 2: Code Review Fix Report

**Fixed at:** 2026-06-27T00:00:00Z
**Source review:** .planning/phases/02-run-controller-pipeline-spine/02-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (Warning WR-01..WR-04; 0 Critical; Info out of scope)
- Fixed: 4
- Skipped: 0

**Regression gate (all GREEN after fixes):**
- `bash engine/contracts/controller-smoke.sh` → exit 0, ALL ASSERTS PASS (CTRL-12 reuse-grep still passes)
- `bash engine/contracts/store-smoke.sh --space=smoke` → exit 0, ALL ASSERTS PASS
- `bash engine/contracts/h6-all.sh` → exit 0, 14 passed / 0 failed
- No stray `runs/_*` scratch spaces left behind; working tree clean of fix changes.

## Fixed Issues

### WR-01: Returned/logged receipt path uses the UNsanitized spawn-id (path divergence)

**Files modified:** `engine/bricks/run-controller.js`
**Commit:** 88f3a85
**Applied fix:** Sanitized the manifest id segment ONCE via the already-required
`sanitizePathSegment` (from `lib/fanout-path`) into `idSeg`, then built `spawnId` from
`idSeg + '-' + Date.now() + '-' + <base36>`. That single sanitized value is reused for BOTH
the `--spawn-id` flag passed to `receipt-write.js` AND the rebuilt `receiptPath`. Because every
component of `spawnId` is already within `[a-z0-9._-]`, and `receipt-write.js` sanitizes
`--spawn-id` with the SAME `sanitizePathSegment` (verified: it imports the identical
`./lib/fanout-path` function), `sanitizePathSegment(spawnId) === spawnId` — so the logged/returned
path provably matches the file the brick writes for any future non-clean step id. No regex was
re-pasted; the existing shared sanitizer was reused (reuse-don't-rewrite honored).

### WR-02: `--rerun` dereferences `spawnSync(...).stdout` without a status/null guard

**Files modified:** `engine/bricks/run-controller.js`
**Commit:** 46ab541
**Applied fix:** Captured the `space-version.js` spawn result into `r`, then checked
`r.status !== 0 || typeof r.stdout !== 'string'` before reading `.stdout`. On a failed-to-start
spawn (ENOENT/EACCES → `stdout: null`) or a non-zero resolve status, the controller now emits a
named `REFUSE [id] --rerun: space-version.js failed (status=...)` and exits 1, instead of throwing
`Cannot read properties of null` (masked as a generic FATAL) or silently treating a failed resolve
as "no bump." Path is dormant under `--smoke`, so no harness assert exercises it; syntax-verified
and harnesses remain green.

### WR-03: Retry loop never re-mints a spawn-id — the "unique id per spawn" comment is wrong

**Files modified:** `engine/bricks/run-controller.js`
**Commit:** e041d87
**Applied fix:** Chose review option (a) — the behavior-preserving correction. The receipt is
minted exactly once per successful step (after the bounded re-spawn loop), so there is no
intra-step collision to guard against. Removed the dead `attempt` parameter from `spawnWaves`
(signature, call site, and the `(unique id per attempt in P6)` call-site note), and corrected the
three misleading comments (file-header CRITICAL-CONSTRAINTS note, the Phase-4 banner, and the
Phase-6 spawn-id comment) to state "one receipt per successful step" and that `Date.now()+rand`
keeps ids distinct across DISTINCT steps/runs. No control-flow change; the re-spawn loop counter
`attempts` in `runStep` is untouched and still enforces the ≤2 cap.

### WR-04: `m.agents` is trusted as a number without validation

**Files modified:** `engine/bricks/run-controller.js`
**Commit:** 2a93360
**Applied fix:** Added an `agentCount(m)` helper that refuses a malformed `agents` value with the
named-refusal idiom `REFUSE [id] manifest key agents must be a positive integer (got ...)` and
exits 1 when `!Number.isInteger(m.agents) || m.agents < 1` (catches string `"6"`, `0`, negatives,
and floats). `spawnWaves` and `planPrint` both call it, so the plan-print count and the actual
wave-sizing count always agree, and a bad value fails fast at plan time rather than producing a
vacuous `validate([])` "pass." `agents` is already a required §5 key (presence enforced by
`loadManifest`), so this hardens the VALUE type only. Verified all fixtures carry positive-integer
`agents` (1, 6, 1, 1); the `agents: 6` fixture confirms the multi-wave path still passes through the
new guard. This is the input-validation controller fix permitted by the phase constraint.

## Skipped Issues

None — all four in-scope (Warning) findings were fixed.

The six Info findings (IN-01..IN-06) were out of scope (`fix_scope: critical_warning`) and were
not attempted.

---

_Fixed: 2026-06-27T00:00:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
