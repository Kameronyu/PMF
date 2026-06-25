---
phase: 21-engine-wiring-hardening
reviewed: 2026-06-25T00:00:00Z
depth: deep
files_reviewed: 19
files_reviewed_list:
  - engine/bricks/lib/adlib-graphql.js
  - engine/bricks/lib/trends-parse.js
  - engine/bricks/fetch.js
  - engine/bricks/funnel-score.js
  - engine/bricks/adlib-one.js
  - engine/bricks/gen-enums-md.js
  - engine/integrations/lib-creds.js
  - engine/integrations/cloudflare/cf.js
  - engine/integrations/cloudflare/cf-migrate-dns.js
  - engine/integrations/klaviyo/kl.js
  - engine/integrations/shopify/shopify-deploy-funnel.js
  - engine/integrations/shopify/shopify-upload-assets.js
  - engine/hooks/route.js
  - engine/hooks/validate-analyzer.js
  - engine/hooks/validate-asset-record.js
  - engine/hooks/validate-classifier.js
  - engine/hooks/validate-finder.js
  - engine/contracts/h5-e2e.sh
  - engine/contracts/schemas/asset-record.schema.json
findings:
  critical: 0
  warning: 3
  info: 5
  total: 8
status: resolved
resolution:
  resolved_at: 2026-06-25
  fixed:
    - { id: WR-01, commit: c1db581, file: engine/bricks/lib/adlib-graphql.js }
    - { id: WR-02, commit: a5e3396, file: engine/bricks/funnel-score.js }
    - { id: WR-03, commit: aeec6b4, file: engine/integrations/lib-creds.js }
    - { id: IN-01, commit: 179610b, file: engine/bricks/lib/trends-parse.js }
    - { id: IN-02, commit: 179610b, file: engine/bricks/lib/adlib-graphql.js }
  deferred:
    - { id: IN-03, reason: "pre-existing shopify curl shell-quoting; unchanged by this branch; review marks 'if touched later'" }
    - { id: IN-04, reason: "pre-existing shopify temp-file collision; unchanged by this branch; review marks 'if touched later'" }
    - { id: IN-05, reason: "optional harness pipefail hardening; harness rated correct as-written; not worth destabilizing the verification instrument" }
  verification: "bash engine/contracts/h5-e2e.sh → ALL HOPS COHERENT (exit 0); per-fix smokes pass; H0 validator-equivalence untouched (no validator/route/enums edits)"
---

# Phase 21: Code Review Report

**Reviewed:** 2026-06-25
**Depth:** deep
**Files Reviewed:** 19 (`.claude/skills/reddit-extract/dump.mjs` reviewed but folded into the integration set; 19 source files of the 20 listed — `enums.json` was read as the H0 source-of-truth, not as a review target)
**Status:** issues_found

## Summary

Reviewed the Phase 21 engine-hardening branch (`a2209b4 → 1b2460f`) at deep depth, prioritizing the
highest-risk areas flagged in the intent: the two new parsers, credential resolution + positional-arg
filtering, `funnel-score` input guarding, the validator enum repoints, and the `fetch.js` consent-warm +
response listener.

**H0 enum repoint is clean — NO drift.** I diffed all four validators against their prior inline
`new Set([...])` definitions. Every imported `enums.json` value set is byte-identical to the inline set
it replaced (CLAIM_TYPE, EXECUTION_TYPE, PROOF_TIER, MOVE, BELIEF_ID_ANCHORS, BELIEF_KIND,
AWARENESS_ENTRY, CHANNEL, LANE, DEMAND_TREND_SHAPE, SHOT_TYPE, DISQUALIFIER, ASSET_STRENGTH→STRENGTH,
BEST_USE, DISPLAY_STATE). The "8/8 behavior-preserving" claim holds. `gen-enums-md.js --check` runs
clean. `route.js` wires `*-beliefs.json → validate-analyzer.js` correctly and all referenced validators
(`validate-revenue.js`, `validate-dumper.js`) exist on disk. The H5 harness passes end-to-end here
(all 5 hops + the analyzer gate, ALL HOPS COHERENT).

**The one bug that matters: a field-regression in the new `adlib-graphql.js` merge** (WR-01). The merge
spread clobbers an already-resolved `destination_url` back to `null` when a second response body for the
same `library_id` is merged in solely for its `end_date`. Since `destination_url` is the exact cluster
key whose nulling this module was built to fix (`funnel-assemble.js:clusterAdsByUrl` → `bound_ads:[]`),
and `adlib-one.js` deliberately feeds it bodies from two passes (active + all) where the same ad
recurs, this can silently re-introduce the failure the branch set out to eliminate. Reproduced below.

Two other Warnings: an uncaught `statSync` throw on a missing input path in `funnel-score.js` (defeats
that file's otherwise-careful clean-error discipline), and a silent fall-through in the `--creds` flag
parser when the operator uses the space-separated form. Five Info items are minor.

No Critical security issues. Credential handling (H4) is sound: secrets are read from a file/env, never
logged, and the curl shell-interpolation of `CRED.token` is pre-existing and unchanged by this branch.

## Warnings

### WR-01: adlib-graphql merge regresses a resolved `destination_url` to null

**File:** `engine/bricks/lib/adlib-graphql.js:88-90`
**Issue:** In `mapAdsFromGraphql`, when a second body carries the same `library_id` and is selected
into the map by the `(!prev.end_date && rec.end_date)` branch, the update does a full object spread
`{ ...(prev || {}), ...rec }`. Because `rec` is a complete `mapOne` record, every field in `rec`
overwrites `prev` — including `rec.destination_url`, which may be `null` for the end-date-bearing body.
The result regresses the previously-resolved destination URL back to `null`. This is the precise field
(`destination_url`) the module exists to recover, and it is the cluster key in
`funnel-assemble.js:clusterAdsByUrl` — nulling it re-collapses `bound_ads` to `[]`, the exact
`#adlib-selectors` failure this branch fixed.

Reproduced (two bodies, same `ad_archive_id=123`: body1 has `snapshot.link_url` but no end date; body2
has an end date but no `link_url`):
```
after merge: destination_url = null | end_date = "2024-01-11"
```
`adlib-one.js:414-418` runs `mapAdsFromGraphql(gqlBodies)` over bodies collected from BOTH the
`active_status=active` and `active_status=all` passes, so the same ad legitimately appears in two
bodies — this is reachable in normal operation, not a contrived input.

**Fix:** Merge field-by-field preferring the more-populated value, instead of a blanket `...rec`
overwrite. Minimal change:
```js
for (const ad of nodes) {
  const rec = mapOne(ad);
  const prev = byId.get(rec.library_id);
  if (!prev) { byId.set(rec.library_id, rec); continue; }
  // Coalesce: keep any already-resolved field; only fill nulls from rec.
  const merged = { ...prev };
  for (const k of Object.keys(rec)) {
    if (merged[k] === null || merged[k] === undefined) merged[k] = rec[k];
  }
  byId.set(rec.library_id, merged);
}
```
(If `_source`/`is_active` precedence matters, special-case those two; the coalesce above already
preserves a non-null `prev` value over a null `rec` value, which is the intended "prefer the record
that carries a destination_url, then one that carries an end_date" semantics the comment promises.)

### WR-02: funnel-score crashes with an unhandled exception on a missing input path

**File:** `engine/bricks/funnel-score.js:346`
**Issue:** `const stat = fs.statSync(inputPath);` is outside any try/catch. Every other I/O path in
this file is wrapped to emit a clean `[funnel-score] ERROR: …` and `process.exit(1)`, but a
non-existent `inputPath` (e.g. a typo'd argument or a wrong relative cwd) throws `ENOENT` here with a
raw Node stack trace and a non-deterministic exit. Confirmed: `fs.statSync('/nonexistent') →` throws
`ENOENT`. This is the new H2a/`checkScoreableInput` neighborhood — the guarding work elsewhere in the
file makes this bare `statSync` an inconsistency that surfaces an ugly crash precisely at the
"wrong-input" boundary the phase was hardening.

**Fix:**
```js
let stat;
try {
  stat = fs.statSync(inputPath);
} catch (e) {
  console.error(`[funnel-score] ERROR: cannot stat input "${inputPath}" — ${e.code || e.message}`);
  process.exit(1);
}
```

### WR-03: `--creds` space-separated form silently falls back to the default creds path

**File:** `engine/integrations/lib-creds.js:15-18`
**Issue:** `credsPath` matches only `a.startsWith('--creds=')`. If an operator runs
`node cf.js GET /zones --creds /path/to/creds.json` (space-separated, the common CLI muscle-memory
form), the `--creds` token is dropped by both the flag matcher (no `=`) AND by `positionals()`
(it starts with `--`), while `/path/to/creds.json` is then read as a **positional argument** (e.g. it
becomes `cf.js`'s `body` or `shopify`'s config path). The tool silently uses the legacy `__dirname`
default creds — or fails confusingly on a positional it didn't expect — instead of the operator's
explicit path. Confirmed by simulation: `--creds /x.json` yields flag-match `undefined` and leaks
`/x.json` into positionals.

**Fix:** Either document `--creds=<path>` as the only accepted form in each tool's usage string and
reject a bare `--creds`, or support both:
```js
const argv = process.argv;
const eq = argv.find(a => a.startsWith('--creds='));
if (eq) return eq.slice('--creds='.length);
const i = argv.indexOf('--creds');
if (i !== -1 && argv[i + 1] && !argv[i + 1].startsWith('--')) return argv[i + 1];
```
If supporting the space form, `positionals()` must also strip the consumed value so it doesn't leak.
Lower-risk than WR-01/WR-02 since the documented usage is `--creds=<path>`, but it's a silent-wrong
secret-resolution path, which warrants a Warning.

## Info

### IN-01: trends-parse `.filter(pt => typeof pt.value === 'number')` is a dead no-op

**File:** `engine/bricks/lib/trends-parse.js:23`
**Issue:** The preceding `.map` always produces `value` as a number (`pt.value[0] ?? 0` or
`Number(pt.value) || 0`), so the filter can never drop a point. Confirmed: an all-zero series survives
intact. The filter is harmless but misleading — it implies points can be non-numeric when they cannot,
and an all-zero series is (correctly) handled downstream by `classifyTrendShape`'s `windowMax === 0`
guard, not here. Same dead filter exists in `fetch.js:extractTrendSeries` (pattern 1 and 3).
**Fix:** Drop the `.filter(...)` (the map guarantees numbers), or if the intent was to drop
unparseable points, filter on the source `pt.value` before coercion.

### IN-02: adlib-graphql `headline` fallback chain has a redundant `|| null`

**File:** `engine/bricks/lib/adlib-graphql.js:64`
**Issue:** `snap.title || (bodyText ? bodyText.slice(0, 120) : null) || null` — the trailing `|| null`
is redundant because the middle term already yields `null` when `bodyText` is falsy. Cosmetic.
**Fix:** `snap.title || (bodyText ? bodyText.slice(0, 120) : null)`.

### IN-03: shopify-upload-assets interpolates unquoted file paths into a curl shell command

**File:** `engine/integrations/shopify/shopify-upload-assets.js:73`
**Issue:** `-F "file=@${f}"` and `${fields}` are built into an `execSync` string without shell-quoting
the filesystem path `f`. A media filename containing a space, parenthesis, or shell metacharacter
silently breaks the upload (or, with a crafted local filename, could inject). The media dir is
operator-local/trusted and this code is **pre-existing** (H4 only changed the `CRED` source line, not
the curl bodies), so it is noted as context rather than a branch-introduced defect.
**Fix (if touched later):** Use `execFileSync('curl', [...args])` to avoid the shell entirely, or
`JSON.stringify`/shell-quote each path the way `t.url` already is.

### IN-04: shopify-upload-assets gql temp file can collide

**File:** `engine/integrations/shopify/shopify-upload-assets.js:25`
**Issue:** `/tmp/gql-${Math.abs(hash(body))}.json` keys the temp file on a 32-bit string hash of the
query+variables. Two invocations with the same query (or a hash collision) can race/overwrite, and the
file is `unlinkSync`'d unconditionally after the `execSync`. Single-run CLI usage makes this unlikely,
and it is **pre-existing** (unchanged by H4). `shopify-deploy-funnel.js:46` already uses the safer
`Date.now()+Math.random()` scheme.
**Fix (if touched later):** Match `shopify-deploy-funnel.js`'s `Date.now()`-+random temp-name scheme.

### IN-05: h5-e2e.sh uses `set -u` but not `set -e` / `pipefail`

**File:** `engine/contracts/h5-e2e.sh:10`
**Issue:** Only `set -u` is enabled. Each brick step's failure is caught explicitly (`|| FAIL=1` or an
inline node assertion), so the harness is correct as written — but a brick that exits non-zero on its
own `node …` line (not wrapped) would NOT flip `FAIL` (the subsequent node-assert only checks the
output file, not the producer's exit code). E.g. step 1's `node funnel-clean.js …` exit code is
ignored; only the file-existence/`[SECTION]` assert gates it. This is defensible (the assert is the
real contract) and the harness passed here, so it's informational. **Fix (optional hardening):** add
`set -o pipefail` and check the producer's `$?` before the assert, so a producer crash is attributed
to the right hop rather than surfacing as "no output" on the next line.

---

## Resolution (2026-06-25)

All three Warnings and the two in-new-code Info items fixed; the three remaining Info items deferred with rationale. Each fix is an independent atomic commit (revertible via `gsd-undo`).

| ID | Disposition | Commit | Verification |
|---|---|---|---|
| WR-01 | FIXED — coalesce merge (keep resolved fields, fill only nulls) | `c1db581` | two-body repro keeps `destination_url`+`end_date` in both orderings; fixture still 8/10 |
| WR-02 | FIXED — `statSync` wrapped → clean error + exit 1 | `a5e3396` | missing path → `[funnel-score] ERROR … ENOENT`, no stack; H5.2 happy path still passes |
| WR-03 | FIXED — `--creds <path>` space form + positional strip | `aeec6b4` | equals/space/env/default/trailing-bare all resolve; no positional leak |
| IN-01 | FIXED — dropped dead numeric filter | `179610b` | trends fixture 262 pts / 100% fill |
| IN-02 | FIXED — dropped redundant `\|\| null` | `179610b` | adlib fixture 8/10 |
| IN-03 | DEFERRED — pre-existing shopify curl shell-quoting, unchanged by this branch | — | review: "if touched later" |
| IN-04 | DEFERRED — pre-existing shopify temp-file collision, unchanged by this branch | — | review: "if touched later" |
| IN-05 | DEFERRED — optional harness pipefail; harness rated correct as-written | — | not worth destabilizing the verification instrument |

**Spine re-verified after fixes:** `bash engine/contracts/h5-e2e.sh` → ALL HOPS COHERENT (exit 0). H0 validator-equivalence is structurally preserved — Task A edited no validator, `route.js`, or `enums.json`.

---

_Reviewed: 2026-06-25_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: deep_
