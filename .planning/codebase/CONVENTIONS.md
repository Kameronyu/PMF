# Coding Conventions

**Analysis Date:** 2026-06-24

## Project-Level Terminology (from CLAUDE.md — enforced everywhere)

- **Step** = PMF research step (0–8), defined in `workflow.md`
- **Stage** = GSD build unit (`M1-S{n}`)
- **Phase** = GSD roadmap index only (`### Phase N` in `ROADMAP.md`, where Phase N = Stage M1-SN)
- Never call a PMF research step a "Phase." Never reuse Step numbers for build units.

## Agent Design Rule (from CLAUDE.md — load-bearing constraint)

**One job per agent, split to the smallest part, route each job to the right executor.**
- Deterministic jobs (fetch, clean, dedupe, count/score, store, validate) → scripts
- Judgment jobs (query design, classify, extract, synthesize) → agents
- "An agent that cleans data" is a category error

The pattern appears in every script's header comment, e.g.:
`tools/fetch.js`: `// Deterministic script — not an agent (CLAUDE.md one-job-per-brick law).`
`tools/funnel-clean.js`: `// Deterministic script — NOT an agent (CLAUDE.md one-job-per-brick law).`

## No-Overwrite-v1 Convention (from CLAUDE.md)

Re-runs write a new versioned location (e.g. `v2/` subdirectory or `-v2` suffix). Never mutate committed run outputs in place. Governs `runs/<space>/…` and emitted bricks. Not currently guard-script enforced — convention only.

## File Naming

**Scripts (`tools/`):**
- `kebab-case.js` for all tool scripts: `funnel-clean.js`, `audit-resolve.js`, `validate-receipt.js`
- `kebab-case.py` for Python bricks: `probe.py`, `probe_video.py`, `sample_montage.py`, `frame-grab.py`
- Hook scripts live in `tools/hooks/`: `validate-*.js` for validators, `inject-*.js` for bundlers, `route.js` for dispatcher
- Lib files in `tools/lib/`: `embed.js`

**Prompt files:**
- Verb-noun or verb-compound: `funnel-deep-pass.md`, `step1-light-pass.md`
- Specs live in `prompts/_specs/`, templates in `prompts/_templates/`, generated bundles in `prompts/_generated/`

**Skill files:**
- `SKILL.md` or `SKILL-<name>.md` at skill root
- Agent prompts inside skill: `prompts/` subdirectory

**Run outputs:**
- `runs/<space>/` — all per-run outputs are market-agnostic; `<space>` is always a required param, never hardcoded
- Sidecar log: `_<script>-log.txt` alongside outputs (e.g. `_fetch-log.txt`, `_funnel-assemble-log.txt`)

## JavaScript Module Format

- All tools use CommonJS (`require()`, `module.exports` not used — scripts, not libraries)
- `'use strict';` at the top of hooks and newer scripts (30 of ~35 `.js` files)
- Older simpler scripts (e.g. `adlib-one.js`, `dedupe.js`) omit `'use strict'` but still use `require()`
- No ESM in tools; `dump.mjs` in skills is the only exception (`.claude/skills/reddit-extract/dump.mjs`)

## CLI Argument Parsing

Every script uses the same canonical inline parser — no external arg-parsing library:

```js
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
```

Positional args are separated:
```js
const flagArgs = rawArgs.filter(a => a.startsWith('--'));
const posArgs  = rawArgs.filter(a => !a.startsWith('--'));
```

Comments in code refer to this as the "canonical adlib-one.js pattern" or "canonical repo pattern."

## Naming Patterns

**Functions:**
- `camelCase` for all functions: `parsePipelineInputs`, `fetchTrend`, `classifyTrendShape`, `slugifyPath`, `findCleanDir`, `stripToTextForVerify`
- Verb-noun structure: `extractSection`, `parseBullets`, `buildBasis`, `writeRaw`, `normalizeHost`

**Variables / parameters:**
- `camelCase`: `brandsData`, `outputDir`, `cleanedBody`, `filePath`
- Destructured assignments follow existing data field names (which use `snake_case`): `const { slug, url } = brand;`

**Constants:**
- `SCREAMING_SNAKE_CASE` for module-level constants: `DEFAULT_LP_PATHS`, `CHANNEL_RANK`, `BELIEF_ANCHOR_SET`, `CLAIM_TYPE_ENUM`, `STUB_DIM`, `ANTI_FLUKE_FLOOR_DAYS`

**JSON data fields:**
- `snake_case` throughout: `funnel_id`, `belief_records`, `cleaned_body`, `landing_page_body`, `validation_lane`, `demand_trend`
- Underscore-prefixed meta keys: `_provenance`, `_note` (space-map.json convention)

## File Header Comments

Every script begins with:
1. `#!/usr/bin/env node` shebang (26 of ~35 `.js` files)
2. `// <filename>` — self-identification line
3. One-line purpose statement
4. Block of rules, design rationale, or threat-model references
5. `// Usage:` block with explicit CLI syntax and output description
6. Exit code documentation where relevant

Example pattern from `tools/audit-resolve.js`:
```js
#!/usr/bin/env node
// audit-resolve.js
// Deterministic EVIDENCE RESOLVER for the pipeline soundness audit ...
//
// Usage:
//   node tools/audit-resolve.js --segment=... [--space=...] [--help]
//
// Exit codes:
//   0 = all required prompts + evidence present
//   1 = REQUIRED missing (CANNOT ASSESS condition)
//   2 = bad usage / unreadable manifest / unknown segment
```

## Section Dividers

Long scripts use `// ---------------------------------------------------------------------------` (dashes to column 75) to separate logical sections, with a brief label below:

```js
// ---------------------------------------------------------------------------
// CLI arg parse (positional + --flag=val — canonical adlib-one.js pattern)
// ---------------------------------------------------------------------------
```

Shorter scripts use `// --- <label> ---` inline.

## Help Flag Pattern

Every script supports `--help` and exits 0:
```js
if (opts.help) {
  console.log([
    'Usage: node <script>.js ...',
    '',
    'Options:',
    '  --flag=<val>   Description',
  ].join('\n'));
  process.exit(0);
}
```

Validate scripts check `process.argv.includes('--help')` before the main arg parse.

## Exit Codes

Consistent across all scripts:
- `0` = success (validators exit silently on pass)
- `1` = missing required file / CANNOT ASSESS condition (soft failure, batch continues)
- `2` = bad usage / hard reject (validators use this; orchestrator must not proceed)

Validators always use exit 2 for rejections, never exit 1, so the orchestrator can distinguish "missing file" from "schema violation."

## Error Handling

**Resilient-batch pattern:** a single item failure never aborts the batch. Per-item try/catch with `results.push(errorLine)` then continue. Sourced from `adlib-sweep.js` and referenced in comments: "adlib-sweep.js pattern."

```js
try {
  const { html, title } = await fetchPage(page, lpUrl);
  writeRaw(rawDir, filename, html, lpUrl, title);
} catch (e) {
  // Absence of a page is data — log it, don't crash
  errors.push(`${pattern}: ${e.message.slice(0, 80)}`);
}
```

**Hard errors:** `console.error(...)` + `process.exit(1 or 2)`. Never throw uncaught exceptions from top-level.

**Validator pattern:** accumulate all violations into `const violations = []`, emit all at once, then exit 2 if any:
```js
if (violations.length > 0) {
  for (const v of violations) { console.error(v); }
  process.exit(2);
}
process.exit(0);
```

**Graceful fallbacks:** functions that parse untrusted/optional input wrap in try/catch and return sensible defaults, never throw. Example: `parsePipelineInputs` in `tools/fetch.js`.

## Logging Conventions

- **Stdout** = structured data (JSON piped to callers), used by `audit-resolve.js`, `funnel-analyzer-context.js`, `audit-inject.js`
- **Stderr** = diagnostics, warnings, errors — so stdout stays clean for piped callers: `console.error('[audit-inject] wrote ...')`, `console.warn('[fetch] WARN: ...')`
- **console.log** = progress lines for batch scripts; prefixed with `[<script-basename>]` tag: `[fetch]`, `[audit-inject]`, `[funnel-store]`
- REJECT lines from validators are always `console.error('REJECT: ...')` — prefix is `REJECT:` followed by a colon

## Closed Enum Pattern

Enums defined as `new Set([...])` at module level with `_ENUM` suffix. Membership tested with `.has()`:

```js
const CLAIM_TYPE_ENUM = new Set(['direct', 'enlarged', 'mechanism', 'enhanced']);
if (!CLAIM_TYPE_ENUM.has(rec.claim_type)) {
  violations.push(`REJECT: ... claim_type="${rec.claim_type}" is off-enum ...`);
}
```

Closed enums in validators always match the enum definitions in the corresponding spec file (e.g. `prompts/funnel-deep-pass.md §SCHEMA` ↔ `tools/hooks/validate-analyzer.js`). The hook is explicitly declared the ground truth; the spec is informational.

## Decision and Threat-Model References

Code comments reference numbered decisions (`D-xx`) and threat-model items (`T-xx-xx`) inline to link implementation to documented rationale:
- `D-10`, `D-11`, `D-15`, `D-16` — design decisions in planning docs
- `T-03-07 (ReDoS)`, `T-03-08 (prompt injection)`, `T-03-13 (path traversal)` — threat model IDs

These are not just TODO markers — they are load-bearing cross-references cited in design docs.

## Never-Fabricate Rule (D-10)

Scripts that write data to JSON outputs must never write placeholder strings. Always use `null` for unresolvable fields, never `"PENDING"` or a guess. Enforced by `tools/hooks/validate-revenue.js`. Pattern appears in comments: `// never-fabricate: null over guess for any unresolvable field.`

## Security Patterns

**Path sanitization (T-03-13):** `sanitizePathSegment()` applied to every user-supplied/scraped value used in filesystem paths. Allows only `[a-z0-9._-]`, strips `/` and `..`. Hard error if sanitized value is empty.

**SSRF guard (T-03-01):** `funnel-assemble.js` normalizes and DNS-resolves destination URLs before `page.goto()`, rejecting private/loopback/metadata IP ranges.

**ReDoS (T-03-07):** Bounded/linear regex patterns only in `funnel-clean.js`; input size capped before regex (`MAX_BODY_BYTES`). No nested unbounded quantifiers on untrusted input.

**No eval/Function/exec (T-01-13):** Trend series and other scraped content handled via `JSON.parse()` on extracted strings only. Never `eval`.

**Hardcoded allowlists:** `inject-dr.js` uses a hardcoded six-file allowlist for DR knowledge injection — no filenames from argv or untrusted input. Path-traversal guard checks resolved paths stay inside the allowed directory.

## JSON Output Format

`JSON.stringify(obj, null, 2)` everywhere — 2-space indented, no trailing newline exception for file writes. Stdout emitters add `+ '\n'` after the JSON string.

## Python Scripts

Located in `tools/asset/`. Follow the same conventions adapted to Python:
- Module docstring at top (triple-quoted `"""..."""`)
- `snake_case` for functions and variables
- `subprocess.run()` always called with argv list, never `shell=True` (T-16-03-01)
- Non-zero exit on any error — callers explicitly refuse to fabricate on non-zero exit
- JSON emitted to stdout, errors to stderr

## Prompt Files (Markdown Specs)

**SKILL.md / SKILL-<name>.md** at skill root — orchestration layer only; does not duplicate schema from spec files.

**Schema co-ownership pattern:** Closed enums and record schemas are co-owned by the agent prompt (`prompts/`) + the validator hook (`tools/hooks/validate-*.js`). The hook is the ground truth. The pattern is documented explicitly in skill headers:
> `SCHEMA NOT DUPLICATED HERE. ... co-owned by ... The hook is the ground truth.`

**ENFORCEMENT MAP table:** Every skill includes a table mapping each pipeline step to `DETERMINISTIC (script)` or `JUDGMENT (agent)` with the mechanism and enforcement mechanism listed. This is the design record.

**Load-bearing truths:** Each SKILL.md lists 2–3 numbered "load-bearing truths" — invariants the orchestrator must never break. These are the canonical constraints for any future executor.

**read_first blocks:** Skills list files the orchestrator must read before starting. These are mandatory, not optional.

---

*Convention analysis: 2026-06-24*
