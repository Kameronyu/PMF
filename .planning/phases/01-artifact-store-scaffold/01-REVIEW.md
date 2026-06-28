---
phase: 01-artifact-store-scaffold
reviewed: 2026-06-26T14:43:31Z
depth: standard
files_reviewed: 6
files_reviewed_list:
  - engine/bricks/lib/fanout-path.js
  - engine/bricks/store-scaffold.js
  - engine/bricks/space-version.js
  - engine/bricks/receipt-write.js
  - engine/contracts/store-smoke.sh
  - engine/contracts/NAMING.md
findings:
  critical: 0
  warning: 4
  info: 4
  total: 8
status: issues_found
---

# Phase 1: Code Review Report

**Reviewed:** 2026-06-26T14:43:31Z
**Depth:** standard
**Files Reviewed:** 6
**Status:** issues_found

## Summary

Reviewed the Phase 1 artifact-store scaffold: a shared path-sanitizer lib, three
Node CommonJS bricks (scaffold / version-resolver / receipt-writer), the bash smoke
harness, and the NAMING contract. The design is sound and the smoke harness passes
fully GREEN (verified by running it). The core security and idempotency claims hold
up under test:

- **Path-traversal sanitization works** — `sanitizePathSegment('../evil')` → `'evil'`,
  `'a/../../b'` → `'ab'`, `'..'` → `''`; `/` and `..` cannot escape `runs/`.
- **sha256 `inputs_hash` is correct** — `\0`-separated, sorted (order-independent),
  content-sensitive, and the empty-input case yields the canonical empty-sha256.
- **The version resolver is read-only** — verified byte-intact invariant in the harness.
- **Scaffold idempotency holds** — re-scaffold over the committed `runs/smoke/` produces
  zero git diff (stubs are deterministic).

No Critical issues. Four Warnings cluster around the CLI arg parser (a naively-copied
idiom that misbehaves on bare flags and `=`-bearing values) plus two correctness/robustness
gaps. Four Info items cover stale comments, a regex-injection edge in the version resolver
that is benign under closed-vocabulary space names, and lossy sanitizer dot-collapse.

## Warnings

### WR-01: Bare `--space` (no `=value`) silently scaffolds a space named `true`

**File:** `engine/bricks/store-scaffold.js:40-44, 70-79` (same defect in `space-version.js:48-52, 78-87` and `receipt-write.js:39-43, 71-90`)
**Issue:** The arg parser maps a flag with no `=` to the boolean `true`:
`return [k, v ?? true]`. A user who fat-fingers `--space` (instead of `--space=smoke`)
gets `opts.space === true`. The required-flag guard `if (!opts.space)` passes (true is
truthy), and `sanitizePathSegment(true)` → `String(true)` → `'true'`, a non-empty string,
so the empty-check guard also passes. Result: `node store-scaffold.js --space` silently
creates and populates `runs/true/` and exits 0. Reproduced live. The same path applies to
`--spawn-id` in `receipt-write.js` (creates `runs/<space>/_receipts/true.json`).
**Fix:** Reject non-string flag values for the path-segment flags. After parsing:
```js
if (typeof opts.space !== 'string' || opts.space === '') {
  console.error('ERROR: --space=<market-space> is required (did you forget the =value?)');
  process.exit(1);
}
```
Apply the same `typeof === 'string'` check to `--spawn-id` in receipt-write.js.

### WR-02: `--gate` JSON containing `=` is truncated and rejected as invalid JSON

**File:** `engine/bricks/receipt-write.js:40-43, 118-125`
**Issue:** The parser does `const [k, v] = a.replace(/^--/, '').split('=')`, which keeps
only the substring before the FIRST `=` and discards the rest. Any flag value that
itself contains `=` is silently truncated. For the new `--gate=<json>` flag this is a
hard failure: `--gate='{"step_gated":true,"decision":"a=b"}'` parses to
`v = '{"step_gated":true,"decision":"a'`, which then throws
`ERROR: --gate is not valid JSON: Unterminated string` and exits 1 even though the
caller passed perfectly valid JSON. Reproduced live. (`--step=s0=weird` silently records
`step: "s0"`, dropping `=weird` — same root cause, quieter symptom.) This idiom was
copied verbatim from `funnel-store.js`, where every flag is a file path that rarely
contains `=` — but `--gate` is a genuinely new JSON-valued flag where `=` is common
(in strings, base64, query-like values).
**Fix:** Split only on the first `=`:
```js
.map(a => {
  const body = a.replace(/^--/, '');
  const i = body.indexOf('=');
  return i === -1 ? [body, true] : [body.slice(0, i), body.slice(i + 1)];
})
```
This preserves all bytes after the first `=` (JSON, paths, anything).

### WR-03: `--gate` accepts any JSON shape — non-object / array / null silently stored as the gate

**File:** `engine/bricks/receipt-write.js:117-125, 135`
**Issue:** `gateObj = JSON.parse(opts.gate)` accepts any valid JSON, so
`--gate='"hi"'`, `--gate='[1,2]'`, `--gate='null'`, or `--gate='42'` all parse without
error and are written straight into the receipt's `gate` field, breaking the documented
shape `{ step_gated, decision }`. Phase 5 (VALID-05) consumers will read `receipt.gate.decision`
and get `undefined` or a crash on a non-object. The receipt is committed provenance, so a
malformed gate is durable.
**Fix:** Validate the parsed gate is a plain object before accepting it:
```js
const parsed = JSON.parse(opts.gate);
if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
  console.error('ERROR: --gate must be a JSON object, e.g. {"step_gated":false,"decision":null}');
  process.exit(1);
}
gateObj = parsed;
```

### WR-04: Smoke harness has stale RED-state comments and lacks `set -e` on a multi-step pipeline

**File:** `engine/contracts/store-smoke.sh:8-10, 67-69, 80-82, 15`
**Issue:** Two coupled problems. (1) The header and the STORE-02/03 section banners
assert these blocks are "RED until Plan 02 lands space-version.js / receipt-write.js."
Both bricks now exist and the harness runs fully GREEN (verified). A reader trusting the
comments would expect failures that no longer occur, and a future maintainer might
"weaken the asserts to make it pass" per line 10 — exactly the wrong move now that
the bricks are real. (2) The harness uses `set -u` but not `set -e`; the assert blocks
chain `rm -rf` → `node scaffold` → presence-checks with no failure propagation between
the setup commands. If `node store-scaffold.js` itself crashes (line 35, output discarded
via `>/dev/null 2>&1`), the harness proceeds to the `test -d` checks and reports
`FAIL: dir ... missing` — a misleading symptom that hides the real cause (the scaffold
crashed). The `node -e` asserts already gate on exit code (`|| FAIL=1`), so the gap is
specifically the un-checked setup `node` invocations on lines 35 and 85-86.
**Fix:** (1) Update the comments — STORE-01/02/03/04/05 are all GREEN as of Plan 02;
delete the "RED until Plan 02" framing. (2) Gate the setup invocations explicitly so a
scaffold/writer crash surfaces as its own named failure:
```bash
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1 \
  || bad "store-scaffold crashed (space=${SPACE})"
```
(Do not add bare `set -e` — it would abort on the first `bad` and lose the full report;
per-command `|| bad ...` matches the harness's accumulate-then-report idiom.)

## Info

### IN-01: Version-resolver interpolates the base name into a RegExp; `.` becomes a wildcard

**File:** `engine/bricks/space-version.js:94`
**Issue:** `const re = new RegExp('^' + base + '-v(\\d+)$')`. `sanitizePathSegment`
permits `.`, which is a regex metacharacter. For a dotted space name like `foo.bar`,
the pattern is `/^foo.bar-v(\d+)$/`, so a sibling directory `fooXbar-v2` would be
*counted as a version of `foo.bar`* and bump the resolved version incorrectly.
Verified: `re.test('fooXbar-v2') === true`. The header comment on lines 19-20 claims
"the regex `^<base>-v(\d+)$` matches ONLY the exact -vN suffix" — false for dotted
bases. **Benign today** because space names are closed-vocabulary kebab/lowercase
ids and a real `.`-vs-arbitrary-char dir collision is implausible, but it is a latent
correctness bug and the comment overstates the guarantee.
**Fix:** Escape the base before interpolation:
```js
const esc = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const re  = new RegExp(`^${esc}-v(\\d+)$`);
```

### IN-02: `sanitizePathSegment` deletes runs of dots rather than collapsing them — lossy and mildly collision-prone

**File:** `engine/bricks/lib/fanout-path.js:15-21`
**Issue:** The comment says "collapse residual dots," but `.replace(/\.\.+/g, '')`
*removes* every run of 2+ dots entirely (replaces with empty string), it does not
collapse to a single dot. So `'a.....b'` → `'ab'` and `'a..b'` → `'ab'`, while
`'a.b'` (single dot) survives. This means `'a..b'` and `'ab'` both map to the
filename `ab.json` — a collision the file's own header (lines 12-13) claims is
"impossible." It is impossible for the *intended* closed-vocabulary cell coordinates
(which never contain `..`), so this is not a live bug, but the code does not match its
own comment and the traversal-blocking goal would be satisfied just as well by collapsing
to a single dot (preserving more of the input).
**Fix:** Either correct the comment to "strip residual dot-runs (traversal-safe)", or
collapse to a single dot to preserve intent: `.replace(/\.{2,}/g, '.')`. Note: after
the first replace already strips `/`, a `..` can only arise from the original input, so
collapsing-to-single still cannot reconstruct a traversal segment because path.join with
a lone `.` segment is harmless.

### IN-03: `hashInputs` silently hashes path-only for missing input files

**File:** `engine/bricks/receipt-write.js:95-103`
**Issue:** `if (fs.existsSync(p)) h.update(fs.readFileSync(p))` — when a declared input
path does not exist, only the path string (not content) is folded into the hash, with no
warning. A receipt can therefore "prove the spawn ran on the declared inputs" (header
T-01-07 claim, lines 16-17) while one or more of those inputs were absent on disk.
Per the header (D-receipt-shape, lines 9-11) the real per-step input list is a Phase 2
concern, so this is acceptable for Phase 1 shape-only shipping — flagging so the gap is
tracked, not lost. A Phase 2/5 validator that asserts input existence would close it.
**Fix (defer to Phase 2):** When populating real inputs, either error on a missing
declared input or record a per-input `{path, present:false}` marker so the verdict layer
can gate on it.

### IN-04: Smoke harness mutates the committed `runs/smoke/` space and leaves it dirty after running

**File:** `engine/contracts/store-smoke.sh:34, 64-65, 98` (interaction with the tracked `runs/smoke/` tree)
**Issue:** `runs/smoke/` is committed/tracked content. The harness does
`rm -rf "runs/${SPACE}"` (line 34) then re-scaffolds it, which technically rewrites the
committed space on every run — brushing against the no-overwrite-v1 convention
(CLAUDE.md "Versioning"). **Verified low-impact:** the stubs are byte-deterministic
(`{}` / `# heading`) so a full harness run leaves zero git diff on tracked files
(`_*-log.txt` is gitignored). The probe write on line 64 is cleaned up (line 65) and the
receipt on line 98 is removed, so the tree is restored. Net: no durable mutation, but the
pattern of `rm -rf`-ing a *committed* path inside a test is fragile — if a future stub
becomes non-deterministic (e.g. embeds a timestamp), every harness run would dirty the
repo. Consider running the smoke harness against an ephemeral, gitignored space (e.g.
`runs/_smoke/` matched by a `.gitignore` rule) rather than the committed `runs/smoke/`,
so the harness is provably side-effect-free on tracked content.
**Fix (optional, low priority):** Point the harness default at a gitignored scratch space,
or add `runs/smoke/` to `.gitignore` if it is not meant to be committed provenance.

---

_Reviewed: 2026-06-26T14:43:31Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
