---
phase: 02-run-controller-pipeline-spine
reviewed: 2026-06-27T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - engine/bricks/run-controller.js
  - bin/run
  - engine/contracts/controller-smoke.sh
  - pipeline.yaml
  - runs/_fixture/pipeline/pipeline.yaml
  - runs/_fixture/pipeline/manifests/fx-01-emit.json
  - runs/_fixture/pipeline/manifests/fx-02-gate.json
  - runs/_fixture/pipeline/manifests/fx-03-wave.json
  - runs/_fixture/pipeline/manifests/fx-bad-emit.json
findings:
  critical: 0
  warning: 4
  info: 6
  total: 10
status: issues_found
---

# Phase 2: Code Review Report

**Reviewed:** 2026-06-27T00:00:00Z
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

The Phase-2 run-controller is well-structured ordering glue: it owns only the 7-phase
order and delegates all real work (hashing, sanitization, versioning, validation) to
Phase-1 bricks via subprocess, exactly as the reuse-don't-rewrite constraint requires.
Path-traversal exposure on the `--space` flag is correctly closed — `sanitizePathSegment`
is applied at every entry point (`opts.space`, positional `target`, and each pipeline id),
and the downstream bricks (`receipt-write.js`, `space-version.js`) sanitize again
defense-in-depth. No injection vectors into `spawnSync`/`execFileSync` were found:
all subprocess argv elements are either literal brick paths or already-sanitized values,
and no shell is invoked (argv-array form, not a shell string).

The issues found are correctness/robustness gaps, not security holes. The most material is
a **spawn-id sanitization divergence** that makes the returned/logged receipt path diverge
from the file `receipt-write.js` actually writes whenever a manifest `id` carries a
non-`[a-z0-9._-]` character. The current fixtures and the canonical `pipeline.yaml` ids
are all already-clean, so tests pass — but the bug is latent for any future step id.
A handful of subprocess return values are dereferenced without a status/null check, and the
retry loop's "unique spawn-id per attempt" intent doesn't match the code (the receipt is
minted once per successful step, not per spawn) — harmless today but the comment is misleading.

## Warnings

### WR-01: Returned/logged receipt path uses the UNsanitized spawn-id (path divergence)

**File:** `engine/bricks/run-controller.js:250,266`
**Issue:** `spawnId` is built from the raw manifest `m.id`
(`const spawnId = m.id + '-' + Date.now() + ...`). It is passed to `receipt-write.js`
as `--spawn-id`, where it is sanitized internally (`[a-z0-9._-]`, lowercased) before
becoming the filename. But line 266 reconstructs the receipt path from the **raw**
`spawnId`:
`const receiptPath = 'runs/' + space + '/_receipts/' + spawnId + '.json';`.
If `m.id` contains any char outside `[a-z0-9._-]` (e.g. an uppercase letter, a `/`, or a
`..`), the brick writes one filename and the controller logs/returns a different one — the
`STORE` log line and the `receiptPath` handed to `operatorGate` point at a file that does
not exist. Fixture ids and the canonical `pipeline.yaml` ids are all already clean, so this
is latent, not currently triggered. It also lightly grazes the reuse rule: the path string
is re-derived here instead of being read back from the brick.
**Fix:** Sanitize the id component once and reuse it for both the flag and the path, so the
two can never diverge:
```js
const idSeg   = sanitizePathSegment(m.id);
const spawnId = idSeg + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
// ... pass spawnId to receipt-write.js as before ...
const receiptPath = 'runs/' + space + '/_receipts/' + spawnId + '.json';
```
(`space` is already sanitized upstream, so only the id segment was unguarded.)

### WR-02: `--rerun` dereferences `spawnSync(...).stdout` without a status/null guard

**File:** `engine/bricks/run-controller.js:241`
**Issue:**
`const next = spawnSync(process.execPath, [SPACE_VERSION, ...], {encoding:'utf8'}).stdout.trim();`
If the spawn fails to start (ENOENT, EACCES) or the child is killed by a signal, `spawnSync`
returns `{ stdout: null, error: <Error> }` and `.stdout.trim()` throws
`Cannot read properties of null`. The outer `try/catch` in `main()` converts it to a generic
`FATAL`, masking the real cause (the version resolver failed). The non-zero exit status of
`space-version.js` is also never inspected — a failed resolve is silently treated as "no bump."
This path is dormant under `--smoke` (fixed space) so no test covers it.
**Fix:** Check the result before use:
```js
const r = spawnSync(process.execPath, [SPACE_VERSION, '--space=' + space], { encoding: 'utf8' });
if (r.status !== 0 || typeof r.stdout !== 'string') {
  console.error(`REFUSE [${m.id}] --rerun: space-version.js failed (status=${r.status})`);
  process.exit(1);
}
const next = r.stdout.trim();
```

### WR-03: Retry loop never re-mints a spawn-id — the "unique id per spawn" comment is wrong

**File:** `engine/bricks/run-controller.js:298-305, 248-250`
**Issue:** The CTRL-07 re-spawn loop (lines 299-303) re-runs `spawnWaves` + `validate` up to
3 times, but `storeAndReceipt` — the only place a spawn-id is minted — runs **once**, after
the loop succeeds (line 305). So the write-once collision the line 248-250 comment guards
against ("the ≤2 re-spawn loop never collides") cannot occur: there is exactly one receipt
write per `runStep`, regardless of attempt count. The `attempt`/`attempts` argument threaded
into `spawnWaves(m, ctx, space, attempts)` (line 300) is also unused inside `spawnWaves`
(signature takes `attempt` but never reads it). This is not a bug in behavior, but the
comment asserts a property the code doesn't implement, and a future edit that moves the
receipt write inside the loop would silently collide because the id is computed from
`Date.now()` + 4 random base-36 chars (≈1.6M space) — fast retries on the same ms could
collide. Misleading invariant + dead parameter.
**Fix:** Either (a) drop the unused `attempt` param and correct the comment to "one receipt
per successful step," or (b) if per-attempt receipts are intended later, mint the id inside
the loop and incorporate `attempt` into it so retries are provably distinct:
```js
const spawnId = sanitizePathSegment(m.id) + '-a' + attempt + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);
```

### WR-04: `m.agents` is trusted as a number without validation (NaN / negative → silent no-op or wrong wave count)

**File:** `engine/bricks/run-controller.js:188-201, 142`
**Issue:** `const n = m.agents || 1;` then `for (let i = 0; i < n; i += WAVE_CAP)`. The manifest
`agents` value is taken verbatim from JSON. If a manifest carries `agents: "6"` (string),
`agents: 0`, `agents: -1`, or `agents: 2.5`, the loop misbehaves: a string makes
`n - i` produce `NaN`/string-coercion in `Math.min`, `0`/negative emit zero waves (the step
produces no output, then `validate([])` returns `ok:true` validating nothing, and
`storeAndReceipt` writes a receipt with empty outputs — a false "success"), and a float
emits a fractional final wave size. `loadManifest` checks key PRESENCE but not type. The
fixtures are all well-formed, so this is untriggered.
**Fix:** Coerce + validate in `loadManifest` or at use:
```js
const n = Number.isInteger(m.agents) && m.agents > 0 ? m.agents : 1;
```
or add a typed check to `loadManifest` that `agents` is a positive integer and refuse otherwise.

## Info

### IN-01: Manifest loader validates key presence but not value types/shapes

**File:** `engine/bricks/run-controller.js:98-103`
**Issue:** `MANIFEST_KEYS` presence is enforced, but `reads`/`writes` are assumed arrays,
`scripts` an object with `pre`/`post` arrays, and `agents` a number — none are type-checked.
A malformed manifest (e.g. `reads: "foo"` as a string) reaches `(m.reads||[]).map(...)` and
throws a generic `TypeError` instead of a NAMED refusal, undercutting the CTRL-03
"named refusal, never improvise" contract for shape errors.
**Fix:** Add lightweight type assertions after the presence loop (arrays for reads/writes,
object for scripts) with the same `REFUSE [id] manifest key <k> must be <type>` idiom.

### IN-02: `validate()` over zero outputs returns `ok` without running any validator

**File:** `engine/bricks/run-controller.js:210-222`
**Issue:** If `outputs` is empty the `for` loop body never runs and the function returns
`{ ok: true }`. Today `mockEmit` guarantees at least one output (or exits), so this is
unreachable — but it pairs with WR-04: any path that yields zero spawns produces a vacuous
"pass." A defensive guard makes the invariant explicit.
**Fix:** `if (!outputs.length) return { ok: false, output: null, code: 2 };` or assert
non-empty before validating.

### IN-03: `Math.random()` used for the spawn-id uniqueness suffix

**File:** `engine/bricks/run-controller.js:250`
**Issue:** `Math.random().toString(36).slice(2, 6)` is a non-cryptographic RNG. This is a
collision-avoidance tag, not a security token, so `Math.random` is acceptable — flagged only
because security scanners commonly surface it. The 4-char suffix gives ≈1.6M values; combined
with `Date.now()` ms it is effectively collision-free for sequential runs.
**Fix:** None required. If determinism/auditability is ever wanted, a monotonic counter or
`crypto.randomUUID()` would be stronger, but neither is needed for the stub shell.

### IN-04: YAML hand-parser silently accepts any `- item` line, ignoring nesting/structure

**File:** `engine/bricks/run-controller.js:110-116`
**Issue:** `parsePipeline` keeps every trimmed line starting with `- `, regardless of indent
level or which key it sits under. A pipeline file with an unrelated nested list, or a stray
`- comment`, would be picked up as a step id. It also does not require the `steps:` key to be
present. For the controlled fixture/canonical files this is fine and intentionally zero-dep,
but it is brittle to hand-edits.
**Fix (optional):** Anchor to the `steps:` block — start collecting only after a line
matching `/^steps:/` and stop at the next non-indented key — or strip inline `#` comments.
Document the accepted shape if left as-is.

### IN-05: Last-write-wins multi-agent emit is a silent stub seam, not flagged at runtime

**File:** `engine/bricks/run-controller.js:196-200`
**Issue:** When `agents > 1`, every mock agent writes the same `writes[0]` slot, so the file
is overwritten N times and `outputs` dedupes to one path (the comment documents this). Correct
for the stub, but there is no log line noting that N agents collapsed to one artifact, which
could confuse a future reader diffing receipts vs. wave logs. CTRL-06 only checks wave sizing,
not output multiplicity.
**Fix (optional):** Emit a one-line note when `n > 1` that the stub coalesces waves into a
single declared output, so the seam is self-documenting in logs.

### IN-06: Smoke `--space` default `_ctrlsmoke` is not gitignored (noted in-harness)

**File:** `engine/contracts/controller-smoke.sh:56`
**Issue:** The harness comment states `gitignore does NOT auto-ignore runs/_ctrlsmoke` and
relies on the trailing `rm -rf "runs/${SPACE}"` (line 311) to leave git clean. If the harness
aborts mid-run (e.g. `set -u` on an unset var before the cleanup, or a SIGINT), the scratch
`runs/_ctrlsmoke/` is left behind and can be accidentally committed. `set -u` is set but
`set -e` is not, so most failures fall through to the final cleanup — acceptable, but a trap
would harden it.
**Fix (optional):** Add `trap 'rm -rf "runs/${SPACE}"' EXIT` after `SPACE` is resolved so
cleanup runs on any exit path, including aborts.

---

_Reviewed: 2026-06-27T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
