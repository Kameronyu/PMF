# Phase 01 — XHIGH adversarial-verification fix report

An xhigh adversarial verification pass found 3 issues the earlier passes (REVIEW,
REVIEW-FIX, VERIFICATION) missed. All three are fixed on branch `pmf-shell-build`,
each committed atomically, both gates re-verified green.

Date: 2026-06-26
Branch: `pmf-shell-build`

---

## FIX 1 — HIGH — receipt-write.js silently overwrote committed provenance (no-overwrite-v1 violation)

**Finding.** `engine/bricks/receipt-write.js` (~line 157) did an UNGUARDED
`fs.writeFileSync(outPath, ...)`. A second spawn with the same spawn-id silently
overwrote a committed `runs/<space>/_receipts/<id>.json` provenance file (exit 0,
no warning), violating the no-overwrite-v1 rule (CLAUDE.md Versioning; CTRL-08;
PART3 §8; SHELL-BUILD-SPEC §4). The sibling brick `store-scaffold.js` (~lines
149/162) guards every stub write with `if (!fs.existsSync(p))`; receipt-write did not.

**Fix.** Before writing, if the target receipt path already exists, REFUSE: print
`ERROR: receipt <spawn_id> already exists at <path> — refusing to overwrite
committed provenance (no-overwrite-v1)` to stderr and `process.exit(1)`. No silent
overwrite, no version-bump — a colliding spawn-id is an orchestrator bug to surface,
not to paper over. Receipts are write-once. Header docstring updated to state the
write-once contract.

**Verify.** Scaffolded a temp space, wrote `--spawn-id=dup` once (exit 0); captured
sha256. Re-ran the identical command: exit 1 with the exact error string above; the
first receipt's sha256 was unchanged (byte-intact).
- first write exit: 0
- re-run exit: 1, error printed to stderr
- sha256 before == sha256 after: yes (`c64a4bb5…1cef8`)

**Commit.** `280ef58` — fix(store): make receipt-write.js write-once (no-overwrite-v1)

---

## FIX 2 — MEDIUM — fanout-path.js false "collisions impossible" claim + ENAMETOOLONG risk

**Finding.** `engine/bricks/lib/fanout-path.js` header (~lines 12-13) claimed
"Collisions are impossible" — FALSE. The `__` field separator is not escaped inside
values, so `buildFanoutName('a','b__c') === buildFanoutName('a__b','c') ===
'a__b__c.json'`; sanitization erasure makes `'!!!'` → `''` (and `'ADHD!!!'` → `'adhd'`);
and there was no length cap (ENAMETOOLONG risk).

**Fix (both parts).**
(a) Corrected the header to scope the guarantee truthfully — collisions are prevented
only for the *enforced closed-vocabulary kebab cell coordinates* (lowercase, no `__`,
bounded length), NOT arbitrary strings, with the concrete counter-examples spelled out.
(b) Added a defensive guard in `buildFanoutName`: after sanitizing each segment, if any
sanitized segment is empty, contains `__`, or exceeds 64 chars, throw an Error — so an
off-vocabulary / colliding / over-long coord fails loudly instead of silently colliding
or risking ENAMETOOLONG. Traversal-safety unchanged; `sanitizePathSegment` (imported
standalone by receipt-write for spaces/spawn-ids) is untouched.

**Verify.**
- `buildFanoutName('adhd-focus','novelty-own')` → `'adhd-focus__novelty-own.json'` (pass)
- `buildFanoutName('edc-aesthetic-collectors','novelty-object-own')` → expected name (pass)
- `('a','b__c')` and `('a__b','c')` now THROW (collision with separator)
- `('a','!!!')` now THROWS (empty after sanitize)
- 65-char segment THROWS (>64); exactly-64 segment still works (boundary)
- `sanitizePathSegment('smoke-v2')` → `'smoke-v2'`, `('../../etc')` → `'etc'` (unchanged)
- STORE-04 smoke (valid coords) still GREEN

**Commit.** `1983393` — fix(store): scope fanout collision claim + guard buildFanoutName

---

## FIX 3 — MEDIUM — store-smoke.sh STORE-03 true-green hole (format-only inputs_hash assert)

**Finding.** `engine/contracts/store-smoke.sh` STORE-03 (~line 95) asserted only the
FORMAT of `inputs_hash` (`/^[0-9a-f]{64}$/`). It never bound the hash to the declared
inputs, so a hardcoded constant, a path-only hash, or an unsorted hash would all pass
GREEN — a true-green hole.

**Fix.** Strengthened STORE-03 to bind hash→inputs over a FIXED known two-file input
set, staying within the existing `ok/bad` accumulate-then-report idiom (no bare `set -e`):
1. **Binding to reference (load-bearing):** `inputs_hash` equals a reference sha256
   recomputed INLINE the same way the brick's `hashInputs()` does — sorted input paths,
   each emitted as `path` + NUL byte + the file's bytes, hashed via `printf` + `cat` +
   `sha256sum`. This is the check that catches a hardcoded constant.
2. **Content-sensitivity:** mutating an input file's bytes changes `inputs_hash`.
3. **Order-independence:** `--inputs=a,b` yields the same hash as `--inputs=b,a`
   (the brick sorts before hashing).

Together these prove the hash demonstrably depends on input bytes, not just its format.

**Verify.**
- Full smoke GREEN with the 3 new asserts (exit 0).
- Mutation test: swapped in a brick variant returning a constant sha256-shaped string.
  The old format-only assert `inputs_hash is sha256` still PASSED on it (the exact hole),
  but the new binding assert went RED (`got deadbeef… want f71d8ee2…`) and the smoke
  exited 1. Real brick restored byte-for-byte after the test (`git diff --quiet` clean).

**Commit.** `f1572ef` — fix(store-smoke): bind STORE-03 inputs_hash assert to declared inputs

---

## Gate re-verification (after all 3 fixes)

- `bash engine/contracts/store-smoke.sh --space=smoke` → ALL ASSERTS PASS, exit 0
- `bash engine/contracts/h6-all.sh` → 14 passed / 0 failed, exit 0

Temp `runs/_v*` / `_smoke-store03` scratch spaces cleaned up. Nothing left unfixed.
