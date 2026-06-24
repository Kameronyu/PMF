# Testing Patterns

**Analysis Date:** 2026-06-24

## Test Framework

**Runner:** None. No test framework is installed or configured.

- No `package.json` at project root
- No `jest.config.*`, `vitest.config.*`, `mocha.*`, or any test runner config file
- No `*.test.*` or `*.spec.*` files anywhere in the codebase
- `nyquist_validation: false` in `.planning/config.json`
- `.planning/STATE.md` explicitly states: "Verification is UAT, not unit tests."

The project deliberately uses **operator UAT over automated test suites**.

## Validation Strategy

Testing is handled by a two-tier system of **deterministic validator scripts** + **human UAT**, not a test runner.

---

## Tier 1: Deterministic Validator Scripts (PostToolUse hooks + orchestrator-run)

These are the closest thing to tests in the codebase. They are standalone Node scripts that accept a file path, check it against a schema or constraint set, and exit 0 (pass, silent) or exit 2 (reject, stderr) or exit 1 (missing required file).

### Hook Dispatch

`tools/hooks/route.js` — PostToolUse dispatcher. Routes Write events to per-agent validators based on filename:
- `brands.json` → `validate-finder.js` + `validate-revenue.js`
- `dump.json` → `validate-dumper.js`
- `space-map.json` → `validate-classifier.js`
- Anything else → pass silently

```bash
node tools/hooks/route.js <written-file-path>
# Exit 0 = pass. Exit 2 + stderr = reject.
```

### Per-Agent Validators

Each validator is a structural twin of the others — same idiom, different rules:

**`tools/hooks/validate-finder.js`** — Finder agent's `brands.json` output
- Rejects off-enum `channel` / `lane` values
- Rejects brand rows missing `url` or `sells_observed`

**`tools/hooks/validate-revenue.js`** — Revenue script's `brands.json` Write
- Rejects any `value_usd_monthly` with no `method` or `confidence`
- Rejects `method:"traffic_formula"` when `monthly_visits` is null
- Rejects `value_usd_monthly === "PENDING"` (D-10 never-fabricate)

**`tools/hooks/validate-dumper.js`** — Dumper agent's `dump.json`
- Rejects creatives with `canonical_niche != null` or `canonical_angle != null` (dumper must not classify)
- Rejects pitches with `transformation != null`
- Verbatim-substring gate: `claims[]` strings must be verbatim substrings of the brand's clean corpus

**`tools/hooks/validate-classifier.js`** — Space Classifier's `space-map.json`
- Rejects canonical labels with no `raw_variants` tracing to real dumps
- Rejects saturation not keyed per combo cell (`transformation × niche`)
- Rejects `claim_type` off `CLAIM_TYPE_ENUM`
- Rejects combos missing `claim_count` or `enhanced_claim_count`
- Rejects `enhanced_claim_count > claim_count`
- Rejects null/empty `bet_type` or missing `bet_type_basis`
- Rejects missing `demand_trend` or `demand_trend.shape` off `DEMAND_TREND_SHAPE_ENUM`

**`tools/hooks/validate-analyzer.js`** — Section Analyzer's belief record output
- Rule 1: VERBATIM-SUBSTRING GATE — `verbatim_refs[].text` must be exact substring of cleaned funnel body
- Rule 2: OVERFLOW-BELIEF — `belief_id` outside 9-anchor set must have `belief_confidence='low'`
- Rule 3: CLOSED-VOCAB — `execution_type` / `proof_tier` / `claim_type` / `move` on-enum
- Rule 4: POSITION — unique funnel-level ordinals, no duplicates
- Rule 5: SINGLE-FUNNEL DISCIPLINE — no birdseye-only fields (`consensus`, `divergence`, `unusual`, `pool`) on belief records
- If cleaned funnel body not found: CONFIG-ERROR exit 2 (distinct from content hallucination)

**`tools/hooks/validate-asset-record.js`** — Asset classification record (orchestrator-run, not PostToolUse)
- CLOSED-VOCAB CLAIM: `demonstrates[].claim` must be in run's `CLAIM-LIST.json`
- CLOSED-VOCAB SHOT_TYPE: `shot_type` on `SHOT_TYPE_ENUM` (images only)
- CLOSED-VOCAB DISQUALIFIERS: all `disqualifiers[]` values on-enum
- CLOSED-VOCAB STRENGTH: `demonstrates[].strength` on-enum
- GROUNDING GATE: each `demonstrates[]` entry must have `evidence` (image) or `motion_value` (video) + `strength`
- DISPLAY_STATE: if present, on-enum
- VIDEO CHECKS: `at` timestamp per `demonstrates[]`, `best_use` on-enum, `loop_safe` + `needs_audio` are booleans

### Receipt Check

**`tools/validate-receipt.js`** — Used in `pipeline-audit` after each reviewer returns:
- Compares reviewer's `CONTEXT RECEIPT` line to the inject manifest
- Checks file counts and basename sets match
- Exit 1 (mismatch) → orchestrator re-spawns reviewer; exit 2 (no receipt) → same

```bash
node tools/validate-receipt.js \
  --manifest=runs/<space>/_audit/ctx/<reviewer>.txt.manifest.json \
  --output=runs/<space>/_audit/<reviewer>.md
# Exit 0 = receipt matches. Exit 1 = mismatch → re-spawn. Exit 2 = no receipt.
```

### Strip Check

**`tools/validate-strip.js`** — Used in `pipeline-audit` to gate stripped copies before injection into Reviewer B:
- Strip file exists and is non-empty
- Strictly smaller than original (catches verbatim no-op)
- `--must-contain` tokens present
- `--must-not-contain` tokens absent

```bash
node tools/validate-strip.js \
  --original=<path> --stripped=<path> \
  [--must-contain="t1||t2"] [--must-not-contain="x1||x2"] [--min-shrink=0.0]
# Exit 0 = acceptable. Exit 1 = REJECTED → re-spawn strip agent. Exit 2 = bad usage.
```

---

## Tier 2: Human UAT Gates

Defined in planning RESEARCH docs per phase. The canonical statement:

> Per `.planning/config.json` `nyquist_validation: false` and STATE.md "Verification is UAT, not unit tests."

**Phase 16 UAT pattern** (from `.planning/phases/16-asset-classifier-image-and-video-bricks/16-RESEARCH.md`):

| Criterion | UAT check | Automatable pre-check |
|-----------|-----------|----------------------|
| SC1 — correct brick type | each brick is script/agent/human per brick model | grep for "agent that cleans" |
| SC2 — claim-tagged grounded record | run brick 4 on 5 local JPGs; records carry claim+strength+evidence | `validate-asset-record.js` passes |
| SC3 — manifest operator can query | images.json/videos.json queryable by claim+strong+clean | replay proof: known expected output |
| SC4 — video pipeline | run on 3 Arduview MP4s; sheets+segments+motion_value+best_use | sheets exist, cell timestamps correct |
| SC5 — human pick gate | operator reads manifest, makes picks | manifest is human-readable |

**UAT dataset for image string:** local JPGs with known-good expected output (recorded in planning); replay constitutes the acceptance test.

---

## Validator Idioms (for adding new validators)

All validators follow the same structure:

```js
#!/usr/bin/env node
// validate-<agent>.js — PostToolUse hook for <AGENT> agent's <output>.json Write.
// Reject rules:
//   1. <Rule description>
//   2. <Rule description>
// Usage: node tools/hooks/validate-<agent>.js <path-to-output.json>
// Exit 0 = pass (silent). Exit 2 + stderr = reject.
'use strict';

const fs   = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log('Usage: ...');
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('REJECT: missing argument — provide path to <output>.json');
  process.exit(2);
}

// Read + parse
let raw;
try { raw = fs.readFileSync(filePath, 'utf8'); }
catch (err) { console.error(`REJECT: cannot read file "${filePath}" — ${err.message}`); process.exit(2); }

let data;
try { data = JSON.parse(raw); }
catch (err) { console.error(`REJECT: invalid JSON in "${filePath}" — ${err.message}`); process.exit(2); }

// --- Closed enum definitions ---
const SOME_ENUM = new Set(['value-a', 'value-b']);

// --- Accumulate violations ---
const violations = [];

for (const record of data.records) {
  if (!SOME_ENUM.has(record.field)) {
    violations.push(`REJECT: record missing or off-enum "field": "${record.field}"`);
  }
}

// --- Emit result ---
if (violations.length > 0) {
  for (const v of violations) { console.error(v); }
  process.exit(2);
}
process.exit(0);
```

Key idiom: **accumulate all violations, emit all, then exit once.** Never fail-fast mid-loop — the full violation list is more useful than the first one.

---

## Test Coverage Gaps

**No automated test coverage for:**

- `tools/fetch.js` — `classifyTrendShape()` is a pure function with documented thresholds; not unit-tested
- `tools/funnel-score.js` — pure arithmetic; not unit-tested
- `tools/clean.js` / `tools/funnel-clean.js` — regex pipelines; no snapshot tests
- `tools/dedupe.js` — idempotence is documented but not asserted by a test
- `tools/lib/embed.js` — stub backend has a `backendName()` / `isStub()` introspection API but no tests
- `tools/revenue-est.js` — has a worked-example sanity comment in the `--help` output but no assertion
- Python bricks (`tools/asset/*.py`) — no pytest; validated only by non-zero exit behavior

**Verbatim-substring gate coverage:** `validate-analyzer.js` tests this at runtime (on real analyzer output), not ahead of time. If the cleaned corpus is not wired, it exits with CONFIG-ERROR rather than silently passing.

**Hook wiring:** `tools/hooks/route.js` routes only three filenames. Any new agent output type not listed passes silently through `route.js` without validation — adding a new agent requires adding a corresponding validator and updating `route.js`.

---

## Priority for Adding Tests

1. **High — `classifyTrendShape` in `tools/fetch.js`**: pure function, documented thresholds, easy to snapshot. A wrong threshold silently mislabels trend shape for all brands.
2. **High — `sanitizePathSegment` in `tools/funnel-store.js` and siblings**: security-critical; path traversal prevention should have unit tests.
3. **Medium — `parsePipelineInputs` in `tools/fetch.js`**: tolerant parser with multiple fallback branches; edge cases not exercised.
4. **Medium — `tools/dedupe.js` idempotence**: documented as idempotent; easy to assert.
5. **Low — Python bricks**: covered implicitly by UAT dataset replays.

---

*Testing analysis: 2026-06-24*
