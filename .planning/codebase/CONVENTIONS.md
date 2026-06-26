# Coding Conventions

**Analysis Date:** 2026-06-26

## Naming Patterns

**Files (JavaScript/Node bricks):**
- S-brick naming: `<domain>-<verb>.js` (verb from approved verb set)
- Examples: `clean.js`, `funnel-store.js`, `asset-emit.js`, `funnel-analyzer-context.js`, `audit-inject.js`
- Approved verbs: `fetch`, `clean`, `dedupe`, `normalize`, `assemble`, `score`, `store`, `vectorize`, `query`, `tally`, `emit`, `rank`, `upload`, `estimate`, `probe`, `grab`, `deploy`, `drive`, `route`, `validate`, `inject`, `resolve`

**Files (Python bricks):**
- Pattern: `<domain>_<verb>.py` or `<noun>_<verb>.py` (keep existing snake_case convention)
- Examples: `probe.py`, `probe_video.py`, `frame-grab.py`, `video-assemble.py`

**Validators:**
- Pattern: `validate-<producer>.js` where producer is the agent/brick whose output it gates
- Examples: `validate-finder.js`, `validate-analyzer.js`, `validate-dumper.js`, `validate-classifier.js`, `validate-revenue.js`, `validate-asset-record.js`

**Injectors:**
- Pattern: `inject-<consumer>-dr.js` where consumer is the agent the bundle feeds
- Examples: `inject-dr.js`, `inject-funnel-architect-dr.js`, `inject-market-selection-dr.js`, `inject-copywriter-dr.js`

**Functions/Variables:**
- camelCase throughout
- Descriptive names: `normalizeHost`, `stripToText`, `sanitizePathSegment`, `spawnSync`
- Prefix pattern for utilities: `sanitizePathSegment()` for path validation, `normalizeHost()` for URL normalization

**Types/Objects:**
- UPPER_SNAKE for enum values: `CHANNEL_RANK`, `THRESHOLD`, `ENUMS`, `CHANNEL_ENUM`, `LANE_ENUM`
- Schema/record types: kebab-case in file names, flat JSON object properties with underscore prefix for meta: `_provenance`, `_note`, `_meta`, `_clean-log.txt`

## Code Style

**Formatting:**
- No formal linter configured; conventions are pattern-based
- Indentation: 2 spaces (Node.js conventional)
- Semicolon use: present; statement-closing style
- Line length: no enforced limit observed; pragmatic wrapping

**Comments:**
- Header blocks on every brick with `// @capability`, `// @step`, `// @brick`, `// @inputs`, `// @outputs`, `// @consumers`, `// @run`, `// @deps`, `// @flags` keys (machine-parseable)
- Inline comments for non-obvious logic (regex patterns, algorithms, security decisions)
- Comments reference design docs/decisions: `(T-01-05 mitigated)`, `(D-16)`, `(D-17 determinism closure)`, `(T-03-13)` (issue/decision tracking)

**Error Messages:**
- Prefix with tool/context: `[clean]`, `[funnel-clean]`, `ERROR:`, `REJECT:`
- Terse: `[clean] ERROR: cannot read corpus dir ${inBase} — ${e.message}`
- Validators output `REJECT:` on exit 2; callers output descriptive message

## Import Organization

**Order (JavaScript):**
1. Built-ins (`fs`, `path`, `child_process`, `url`)
2. Third-party (`child_process`, `require()` for external libs)
3. Local modules/constants (`require('../contracts/enums.json')`)

**Pattern:**
```javascript
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

// ... then local requires
const ENUMS = require('../contracts/enums.json').enums;
```

**Path Aliases:**
- No aliases used; relative path requires are standard (`../contracts/`, `./lib/embed`)
- Works because files are co-located and `__dirname` is preserved on relocation

## Error Handling

**Philosophy:** Deterministic scripts must be "loud" on failure and resilient on partial data.

**Patterns:**
- Per-file try/catch in batch loops — one bad file does NOT abort the batch
  ```javascript
  for (const htmlFile of htmlFiles) {
    try {
      // ... process
    } catch (e) {
      // Per-file try/catch — one bad file doesn't abort the batch (T-01-05 mitigated)
      results.push(line);
      console.log(line);
    }
  }
  ```

- Exit codes: `0` = success, `1` = fatal error (abort), `2` = validation reject (specific, gated)
- Never swallow exceptions silently; always log to stderr with context
  ```javascript
  } catch (e) {
    console.error(`[funnel-clean] ERROR: cannot read directory ${inputPath} — ${e.message}`);
    process.exit(1);
  }
  ```

- Python: Never swallow exceptions on PIL/subprocess errors
  ```python
  # probe.py: "Never swallow exceptions — on PIL error, print to stderr and exit non-zero.
  # The Node caller (asset-fetch.js S5) refuses to fabricate technical{} on non-zero exit."
  ```

**Validators (exit contract):**
- Exit 0 = pass (output valid)
- Exit 2 = reject (specific validation failure, names the issue in stderr)
- Fail-open on missing deny-list (marketing firewall reads off-limits.json)

## Logging

**Framework:** `console.log()`, `console.error()` (no external logger)

**Patterns:**
- Progress markers: `[tool] action: result` format
  ```javascript
  console.log(`${slug}/${mdFile}: ok (${text.length} chars)`);
  console.log(`[clean] done — ${slugDirs.length} slug dirs scanned`);
  ```

- Sidecar logs: tools write `_<tool>-log.txt` alongside output (e.g., `_clean-log.txt`, `_funnel-store-log.txt`)
  ```javascript
  fs.writeFileSync(path.join(outBase, '_clean-log.txt'), results.join('\n') + '\n');
  ```

- One-line summaries for start/end of a smoke:
  ```bash
  echo "── H6.clean: node clean.js --in=${FX} --out=${OUT} ──"
  # ... steps ...
  echo "H6 clean: ALL ASSERTS PASS ✓ (transient ${OUT} cleaned)"
  ```

## Module Design

**Exports:**
- Single executable per brick (#!/usr/bin/env node or shebang)
- No module.exports used; bricks are CLI tools, not libraries
- Hooks are CLI tools called by the firing layer, not required by other code

**Barrel Files:**
- No index.js or barrel pattern observed in `engine/`
- Each brick is self-contained

## Closed Vocabularies (Enums)

**Single Source of Truth:** `engine/contracts/enums.json` (machine-parseable)

**Structure:**
```json
{
  "_meta": { "purpose", "rule", "boundary", "generated_from", "consumed_after_reorg_by" },
  "enums": {
    "CHANNEL": { "values": [...], "enforced_by": [...], "consumed_by": [...], "kind": "closed" },
    "CLAIM_TYPE": { "values": [...], "enforced_by": [...], "kind": "closed", "note": "..." }
  },
  "contract_gated": { "_note": "...", "source_routing": { "status": "pending-operator-vocab" } }
}
```

**Rule:** A value off-list is a HARD REJECT at the enforcing hook (validator exit 2). New values require operator proposal + engine PR.

**Imports:** Validators load via `const ENUMS = require('../contracts/enums.json').enums` and build Sets:
```javascript
const CHANNEL_ENUM = new Set(ENUMS.CHANNEL.values);
const LANE_ENUM = new Set(ENUMS.LANE.values);
```

**Boundary:**
- VALUE SETS (in enums.json) = wiring (frozen by engine)
- VALUE MEANINGS (in prompts) = marketing (live in operator's prompts/definitions)

## Schemas (JSON validation)

**Location:** `engine/contracts/schemas/<record-type>.schema.json`

**Pattern:** JSON Schema v7 for record-type contract (e.g., `belief-record.schema.json`)

**Usage:** Validators read fixtures, not schemas directly; schemas are documentation + future enforcement.

## Security Patterns

**Path Traversal Prevention (T-03-13):**
- Function: `sanitizePathSegment()`
- Rule: Only `[a-z0-9._-]` allowed; strip `/` and `..`
- Applied to: `funnel_id`, `space`, any user-derived path segment before write
  ```javascript
  function sanitizePathSegment(segment) {
    return (segment || '').toLowerCase().replace(/[^a-z0-9._-]/g, '');
  }
  ```

**Untrusted Content Handling:**
- Funnel body (third-party scraped content) is preserved VERBATIM inside analyzer context boundaries (prompt injection defense)
- Comment: `(prompt injection defense, funnel-deep-pass.md lines 268-277)`

**Credentials:**
- Integrations take `--creds=<path>` flag or env var, defaulting to none
- Secrets stay in `.gitignore` (e.g., `runs/arduview/_tooling/.shopify-creds.json`)
- Code is generic; secrets are run-supplied at invocation time

## Machine-Parseable Headers (Registry Contract)

Every brick and integration MUST carry a header block. Parseable keys:

```javascript
// @capability   lp-clean-markdown              # kebab-case capability id
// @step         S1 light-pass / fetch+clean    # the step; PROVISIONAL if labeled so
// @brick        S2                             # brick type (S-brick, H-brick, etc.)
// @inputs       brands.json (url, lp paths)
// @outputs      corpus/<slug>/clean/*.md
// @consumers    s1-dumper (agent); validators/validate-dumper.js
// @run          node engine/bricks/clean.js --space=<space>
// @deps         node:playwright ; py:- ; env:- ; creds:-
// @flags        D-08 live-only (methodology-as-rule)
```

**Purpose:** Registry (`REGISTRY.md`) is GENERATED from these blocks; hand-maintained docs were the drift failure.

---

*Convention analysis: 2026-06-26*
