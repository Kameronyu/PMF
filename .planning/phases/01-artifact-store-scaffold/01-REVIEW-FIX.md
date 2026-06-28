---
phase: 01-artifact-store-scaffold
fixed_at: 2026-06-26T14:57:31Z
review_path: .planning/phases/01-artifact-store-scaffold/01-REVIEW.md
iteration: 1
fix_scope: explicit
findings_in_scope: 6
fixed: 6
skipped: 0
status: all_fixed
---

# Phase 1: Code Review Fix Report

**Fixed at:** 2026-06-26T14:57:31Z
**Source review:** .planning/phases/01-artifact-store-scaffold/01-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope (explicit): 6 (WR-01..04, IN-01, IN-02)
- Fixed: 6
- Skipped: 0
- Status: all_fixed

## Fixed Issues

### WR-01: Bare `--space` (no `=value`) silently scaffolds a space named `true`

**Files modified:** `engine/bricks/store-scaffold.js`, `engine/bricks/space-version.js`, `engine/bricks/receipt-write.js`
**Commit:** `2da555b`
**Applied fix:** Replaced the truthy required-flag guards (`if (!opts.space)`) with
`typeof opts.space !== 'string' || opts.space === ''` checks so a bare flag (parsed to the
boolean `true`) is now rejected instead of sanitizing to the string `'true'`. Applied to
`--space` in all three bricks and to `--spawn-id` in receipt-write.js. Error message
updated to the review's `(did you forget the =value?)` form. Folded the typeof check into
the single existing required-flag guard per file (the separate empty-after-sanitize guard
is left intact downstream).
**Verified:** `node store-scaffold.js --space` (bare) now exits 1 with the new error and
does NOT create `runs/true/` (confirmed `runs/true` absent).

### WR-02: `--gate` JSON containing `=` is truncated and rejected as invalid JSON

**Files modified:** `engine/bricks/receipt-write.js`
**Commit:** `689e51e`
**Applied fix:** Rewrote the arg-parser `.map` to split on the FIRST `=` only via
`body.indexOf('=')` + `slice`, preserving all bytes after the first `=`.
**Verified:** `--gate='{"step_gated":true,"decision":"a=b"}'` now writes a receipt whose
`gate.decision === "a=b"` (the `=` survives) and exits 0.

### WR-03: `--gate` accepts any JSON shape — non-object / array / null silently stored

**Files modified:** `engine/bricks/receipt-write.js`
**Commit:** `00ff576`
**Applied fix:** After `JSON.parse`, reject `null`, arrays, and non-object scalars with
the review's error message; only a plain object is assigned to `gateObj`. The existing
try/catch around `JSON.parse` (invalid-JSON error) is preserved.
**Verified:** `--gate='[1,2]'`, `'null'`, `'42'` each exit 1 with the
"must be a JSON object" error; a valid `{...}` object exits 0; malformed JSON (`{bad`)
still hits the pre-existing "not valid JSON" error.

### WR-04: Smoke harness stale RED-state comments + un-gated setup `node` invocations

**Files modified:** `engine/contracts/store-smoke.sh`
**Commit:** `52e0ee2`
**Applied fix:** (a) Rewrote the header (lines ~7-10), the STORE-02 banner, and the
STORE-03 banner to state STORE-01..05 are all GREEN as of Plan 02; removed the "RED until
Plan 02" framing and the now-wrong "do not weaken the asserts to make it pass" line
(replaced with truthful "do not weaken — a RED assert is a real regression"). (b) Gated the
two un-checked setup invocations — the scaffold call (~L35) and the receipt-write call
(~L85) — with `|| bad "...crashed (space=${SPACE})"` using the harness's existing `bad`
failure-reporting function. No bare `set -e` added (would abort the accumulate-then-report
run). The space-version invocation (L75) is captured via `NEXT=$(...)` and is already
surfaced by its existing value assert (`resolver returned: '...'`), so it needed no `|| bad`.
**Verified:** `bash -n` passes; harness runs fully GREEN (35 PASS / 0 FAIL, exit 0).

### IN-01: Version-resolver interpolates the base name into a RegExp; `.` becomes a wildcard

**Files modified:** `engine/bricks/space-version.js`
**Commit:** `0b8ec0c`
**Applied fix:** Regex-escaped the base name (`base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')`)
before interpolating into `new RegExp('^...-v(\\d+)$')`, so a dotted base like `foo.bar`
no longer treats `.` as a wildcard. Also corrected the overstated header comment
(lines ~19-21) to note the base is regex-escaped first and that `foo.bar` never matches
`fooXbar-v2`.
**Verified:** `foo.bar-v2` still matches (true); `fooXbar-v2` no longer matches (false —
was true before the fix); normal versioning still resolves `_in01tmp` → `_in01tmp-v2`.

### IN-02: `sanitizePathSegment` deletes runs of dots — comment/behavior mismatch

**Files modified:** `engine/bricks/lib/fanout-path.js`
**Commit:** `bf3f164`
**Applied fix:** Chose the review's stated fallback — **corrected the comment to match the
strip behavior** rather than switching to collapse-to-single-dot. Reason: the review's
Summary asserts three VERIFIED traversal-safety outputs — `'../evil'` → `'evil'`,
`'a/../../b'` → `'ab'`, `'..'` → `''`. Collapse-to-single (`.replace(/\.{2,}/g, '.')`)
demonstrably changes all three to `'.evil'` / `'a.b'` / `'.'`, which is exactly the
"risks a traversal test" case the review says to avoid by correcting the comment instead.
Rewrote the inline comment from the inaccurate "collapse residual dots" to "strip residual
dot-runs (traversal-safe)" with an explicit note that a run of 2+ dots is removed entirely
(`..` → ``, `a..b` → `ab`) and single dots are kept (`a.b` → `a.b`). The header's
"collisions are impossible" claim is already scoped to closed-vocabulary cell coordinates,
so it remains truthful and was left unchanged.
**Verified:** Sanitizer asserts pass — `'../evil'` → `'evil'`, `'a/../../b'` → `'ab'`,
`'..'` → `''`, `'a.b'` → `'a.b'`, and `buildFanoutName` join unchanged.

## Deferred (out of scope — untouched)

The following Info findings were explicitly deferred to Phase 2 by the review and the fix
scope; they were NOT touched and remain tracked notes in 01-REVIEW.md:

- **IN-03:** `hashInputs` silently hashes path-only for missing input files
  (`engine/bricks/receipt-write.js:95-103`). Per the review header (D-receipt-shape) the
  real per-step input list is a Phase 2 (CTRL-08) concern; a Phase 2/5 validator closes it.
- **IN-04:** Smoke harness mutates the committed `runs/smoke/` space
  (`engine/contracts/store-smoke.sh`). Verified low-impact (byte-deterministic stubs leave
  zero git diff); optional remediation is to point the harness at a gitignored scratch space.

## Verification (post-fix)

| Check | Result |
|-------|--------|
| `bash engine/contracts/store-smoke.sh --space=smoke` | exit 0 — 35 PASS / 0 FAIL, ALL ASSERTS PASS |
| `bash engine/contracts/h6-all.sh` | exit 0 — 14 passed / 0 failed (14/14), ENGINE SMOKES ALL GREEN |
| `node engine/bricks/store-scaffold.js --space` (bare) | exit 1, prints "--space=<market-space> is required (did you forget the =value?)" |
| `runs/true/` after bare-flag run | absent (not created) |
| Working tree (source files) | clean — no uncommitted source changes |

---

_Fixed: 2026-06-26T14:57:31Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_
