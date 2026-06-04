<!-- IMPLEMENTATION-READY SPEC — not code, not a plan, not a discussion doc.
     An executor should be able to build tools/funnel-claim-tally.js from this document
     without re-investigating the codebase. Written 2026-06-04. -->

# Claim Tally Pre-Pass — Implementation Spec

Deterministic script that counts typed sub-claims across all analyzed funnels in one
funnel store and classifies each claim key as DEAD GROUND (saturated; 5+ distinct funnels
make the same sub-claim) or WHITESPACE (everything below the threshold). The output is
consumed by the Funnel Architect at Step 6 of its design procedure.

---

## 1. Pattern to mirror: aggregate-mechanisms-in-play.js

The reference script (`tools/aggregate-mechanisms-in-play.js`) establishes the repo
conventions this script must match. Structure summary:

**Input:** one JSON sidecar (`canonical_mechanisms` array from an agent) + one JSON
target file (`space-map.json`) to merge into. Both resolved from `--flag=` opts with
`path.resolve` and hard-coded defaults.

**Counting logic:**
- Calls `distinct()` (a local `[...new Set(arr)]` helper) to count DISTINCT brand
  occurrences per mechanism, not raw occurrences.
- `ownability` threshold is a deterministic threshold function: `(n >= 3 ? 'shared' : 'unique')`.
- Sort is stable: most-shared first, then `localeCompare` on the key name.

**Output:** writes a new/replaced `mechanisms_in_play[]` field into `space-map.json` via
a controlled `reorder()` function (preserves key order, idempotent). Logs to stderr
with a `[aggregate-mechanisms]` prefix. Exits 0 on success, 2 on any bad input.

**CLI arg parsing:** single-line pattern used by all repo tools:
```js
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
      .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);
```

**Error handling:** one `fail()` helper — `console.error` then `process.exit(2)`. All
file reads wrapped in try/catch that call `fail()`.

The claim-tally script mirrors ALL of these patterns exactly: same arg parsing, same
`fail()`, same stderr logging prefix `[claim-tally]`, same exit codes, same `distinct()`
helper, same stable sort.

---

## 2. The hard problem: deriving a typed sub-claim key from existing schema

### 2a. The actual belief-record fields (from `prompts/funnel-deep-pass.md` §6b)

```
belief_id         — one of 9 anchors (e.g. "it-will-ship", "act-now") or overflow w/ low confidence
belief_confidence — "high" | "low"
execution_type    — closed enum: mechanism-explanation | feature-as-evidence | demo | authority |
                    social-proof | founder-credibility | risk-reversal | scarcity |
                    urgency | exclusivity | story-epiphany | comparison |
                    consequence-of-inaction
execution_detail  — granular free text (e.g. "Founder appears on camera in the actual factory,
                    names the contract manufacturer, shows a dated photo…")
proof_tier        — "Tier1" | "Tier2" | "Tier3"
moves[]           — closed enum tags from MOVE_ENUM (e.g. "early-bird-allocation", "price-step")
verbatim_refs[]   — { text, tag }
```

### 2b. What the fixture actually contains (from `runs/_fixture/funnels/sample.json`)

The fixture has 4 belief records for funnel `gameshell-kickstarter`. Their `moves[]`:

- record 1 (mechanism-is-the-reason / mechanism-explanation):
  `["exploded-diagram", "module-naming", "open-source-claim"]`
- record 2 (trust-the-brand-or-founder / founder-credibility):
  `["founder-on-camera", "factory-named", "dated-production-photo", "skin-in-game"]`
- record 3 (it-will-ship / social-proof):
  `["update-timeline", "backer-unboxing-photos", "delivered-counter"]`
- record 4 (act-now / scarcity):
  `["early-bird-allocation", "live-remaining-count", "price-step", "campaign-clock"]`

CRITICAL OBSERVATION: the `moves[]` tags in the fixture are NOT from the closed
`MOVE_ENUM` in the spec. The MOVE_ENUM contains:
`market-avatar-flip | market-transformation-change | um-mechanism-reveal |
um-problem-framing | um-proprietary-naming | angle-desire | angle-pain |
angle-external-blame | angle-care-signaling | angle-identity-belonging |
angle-curiosity-secret | offer-bundle | offer-guarantee | offer-urgency-scarcity |
offer-price-anchor`

The fixture's moves (`exploded-diagram`, `factory-named`, `skin-in-game`, etc.) are
free-text labels that violate the closed enum. This is marked in the file as
"SYNTHETIC FIXTURE — not real scraped data." Real analyzed funnels will emit MOVE_ENUM
values. The fixture cannot be used to verify cross-funnel move co-occurrence at threshold
(only 1 funnel exists).

### 2c. Candidate approaches evaluated

**(a) Use `moves[]` tags as the sub-claim proxy**

Pro: already typed and discrete (closed enum in real runs), directly comparable across
funnels, the correct semantic unit (a "move" is literally a discrete persuasive act).
Con: fixture tags violate the enum (fixture is synthetic and explicitly marked for
deletion). In real runs the enum is enforced by `validate-analyzer.js` hook.
Assessment: MOVE_ENUM tags ARE the typed, discrete persuasive-act vocabulary already
in the schema. They are exactly "typed sub-claims" — each tag names a persuasive move
a funnel makes (e.g. `offer-urgency-scarcity`, `um-mechanism-reveal`, `angle-pain`).
Counting how many distinct funnels use each move is the correct saturation signal.

**(b) Use `(belief_id + execution_type)` tuples**

Pro: both fields are closed enums, cross-funnel comparable.
Con: the tuple is too coarse. `(act-now, scarcity)` tells you "there's an urgency
install" but not WHICH urgency move. Multiple funnels using `(act-now, scarcity)` but
via completely different moves (early-bird-allocation vs. social-proof-scarcity vs.
campaign-clock) are doing different things. The Architect's concern is "is THIS specific
persuasive move saturated" — the tuple doesn't resolve that. It is, however, a useful
SECONDARY grouping for the output (group dead-ground keys by their parent belief_id).

**(c) Require a new upstream `sub_claim` field**

Not needed. `moves[]` already serves this role at the right granularity.

**(d) Hybrid: moves[] as primary key, (belief_id + execution_type) as secondary grouping**

RECOMMENDED. Primary tally key = individual move tag from `moves[]`. Secondary
grouping in output: each dead-ground or whitespace entry is annotated with which
`belief_id` values it appears under (drawn from the belief records that contain that move).
This gives the Architect both "which specific persuasive act is saturated" AND "in service
of which belief installation" without any upstream schema change.

### 2d. Recommendation and justification

**Use individual `moves[]` tags as the primary sub-claim key.** Justification:

1. The `MOVE_ENUM` is already a taxonomy of discrete persuasive moves. It is the
   closest existing field to "typed sub-claim" — closer than `execution_type` (too broad)
   and richer than `(belief_id + execution_type)` (does not distinguish HOW a belief is
   executed within a type). The Architect's dead-ground concern is "too many funnels lead
   with `offer-urgency-scarcity`" or "everyone uses `um-mechanism-reveal`" — move-tag
   granularity is exactly right for that question.

2. No upstream schema change required. The field already exists on every belief record.
   The `validate-analyzer.js` hook already enforces the closed enum on real runs (the
   fixture's off-enum tags are a synthetic artifact).

3. Cross-funnel comparability is guaranteed by the closed enum enforcement already in
   place.

4. The MOVE_ENUM maps to the four differentiator levers (Market / UM / Angle / Offer),
   so the Architect can read dead-ground by lever, not just by raw tag.

A new `sub_claim` field upstream is NOT required. If a future audit finds move-tag
granularity is too coarse (e.g. two funnels both use `offer-urgency-scarcity` but with
structurally different mechanics), the executor can add `execution_detail` similarity
clustering as a Phase 16+ enhancement — but that requires an agent judgment step (free
text similarity) and violates the determinism principle. Do not include it here.

---

## 3. Script specification

### 3a. Filename and location

```
tools/funnel-claim-tally.js
```

Same directory as all other deterministic pipeline scripts. No sub-directory.

### 3b. Inputs

**Primary input — funnel store:**

Reads all `*.json` files under `runs/<space>/funnels/` that do NOT start with `_`
(exclude `_index.json`, `_tally.json`, or any underscore-prefixed system files).
Each file is one funnel record (as written by `funnel-store.js`): the funnel-level fields
plus a `belief_records[]` array.

**CLI flags (mirror aggregate-mechanisms + funnel-rag-query conventions):**

```
--space=<space>      required. Market space slug (sanitized: [a-z0-9._-] only).
                     Resolves to runs/<space>/funnels/.

--out=<path>         optional. Write JSON output to a file.
                     Default: runs/<space>/funnels/_tally.json (in-tree, sibling to _index.json).

--threshold=<n>      optional integer. Funnels-per-move required to classify as dead ground.
                     Default: 5. Must be >= 1.

--json               optional flag. Emit JSON to stdout (in addition to or instead of --out).
                     If --out is also set: write file AND emit to stdout.
                     If --out is not set: emit to stdout only (same as funnel-rag-query --json).

--help               print usage and exit 0.
```

Arg parsing: identical pattern to all other tools in the repo (the `opts` one-liner
from `aggregate-mechanisms-in-play.js`). Path sanitization: same `sanitizePathSegment`
pattern from `funnel-rag-query.js` applied to `--space`.

### 3c. Algorithm — exact steps

```
1. RESOLVE PATHS
   storeDir = path.join('runs', sanitize(opts.space), 'funnels')
   outPath  = opts.out || path.join(storeDir, '_tally.json')
   threshold = parseInt(opts.threshold, 10) || 5
   Validate: threshold >= 1, storeDir exists.

2. ENUMERATE FUNNEL FILES
   files = fs.readdirSync(storeDir)
             .filter(f => f.endsWith('.json') && !f.startsWith('_'))
   If files.length === 0: emit low-N warning (see §3f), write empty tally, exit 0.

3. PARSE FUNNEL RECORDS
   funnels = files.map(f => JSON.parse(fs.readFileSync(path.join(storeDir, f), 'utf8')))
   Each funnel must have funnel_id (string) and belief_records (array).
   On parse error or missing funnel_id: call fail() with filename.

4. BUILD THE MOVE→FUNNELS INDEX
   moveIndex = new Map()   // move_tag -> Set of funnel_ids
   For each funnel in funnels:
     funnel_id = funnel.funnel_id
     belief_records = funnel.belief_records || []
     For each record in belief_records:
       moves = record.moves || []
       For each move_tag in moves:
         if move_tag is empty string or not a string: skip (log warn to stderr)
         if !moveIndex.has(move_tag): moveIndex.set(move_tag, new Set())
         moveIndex.get(move_tag).add(funnel_id)
   NOTE: count DISTINCT funnels per tag, not raw occurrences (a move appearing
   three times within one funnel still counts as 1 funnel for that tag).

5. BUILD BELIEF-ID ANNOTATION MAP
   For each funnel, for each belief record, for each move_tag:
     maintain a parallel Map: moveBelief = Map<move_tag, Set<belief_id>>
   This annotates each move tag with which belief_ids it was found under.

6. CLASSIFY
   For each [move_tag, funnel_set] in moveIndex:
     count = funnel_set.size
     entry = {
       move: move_tag,
       funnel_count: count,
       funnels: [...funnel_set].sort(),          // stable sort
       belief_ids: [...moveBelief.get(move_tag)].sort()
     }
     if count >= threshold: push to dead_ground[]
     else: push to whitespace[]

7. SORT EACH LIST
   dead_ground: descending by funnel_count, then move name asc (same stable sort as
   aggregate-mechanisms: byShareThenName pattern).
   whitespace: ascending by funnel_count, then move name asc (least-used first,
   surfaces the freshest angles at the top).

8. COMPUTE METADATA
   total_funnels  = funnels.length
   total_moves    = moveIndex.size
   dead_count     = dead_ground.length
   white_count    = whitespace.length
   low_n_warning  = (total_funnels < threshold)

9. WRITE OUTPUT
   result = {
     _meta: {
       space: opts.space,
       generated_at: new Date().toISOString(),
       threshold,
       total_funnels,
       total_move_keys: total_moves,
       dead_ground_count: dead_count,
       whitespace_count: white_count,
       low_n_warning
     },
     dead_ground,
     whitespace
   }
   If --out or default path: fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n')
   If --json or no --out: process.stdout.write(JSON.stringify(result, null, 2) + '\n')
   Log summary to stderr: [claim-tally] N funnels · M move keys · D dead ground / W whitespace
   If low_n_warning: also log: [claim-tally] WARN: store has N funnels < threshold T — dead-ground
     classification is unreliable; see _meta.low_n_warning.
   Exit 0.
```

### 3d. Output — exact JSON shape

```json
{
  "_meta": {
    "space": "arduview",
    "generated_at": "2026-06-04T10:00:00.000Z",
    "threshold": 5,
    "total_funnels": 12,
    "total_move_keys": 34,
    "dead_ground_count": 6,
    "whitespace_count": 28,
    "low_n_warning": false
  },
  "dead_ground": [
    {
      "move": "offer-urgency-scarcity",
      "funnel_count": 9,
      "funnels": ["brand-a-kickstarter", "brand-b-dtc", "..."],
      "belief_ids": ["act-now", "its-worth-the-price"]
    }
  ],
  "whitespace": [
    {
      "move": "angle-external-blame",
      "funnel_count": 1,
      "funnels": ["brand-c-kickstarter"],
      "belief_ids": ["problem-matters"]
    }
  ]
}
```

Field semantics:
- `move` — the MOVE_ENUM tag as emitted by the Section Analyzer.
- `funnel_count` — number of DISTINCT funnels (by funnel_id) that contain at least one
  belief record with this move tag. NOT raw count of belief records.
- `funnels` — sorted array of funnel_id strings; lets the Architect trace provenance.
- `belief_ids` — sorted array of distinct belief_id values the move appeared under across
  all contributing funnels. Secondary context for the Architect; not used for classification.
- `low_n_warning` in `_meta` — boolean; true when `total_funnels < threshold`. The
  Architect must check this before treating any entry as truly "dead ground."

**Where it is written:**

Default: `runs/<space>/funnels/_tally.json` (underscore prefix = system file, excluded
from the next run's enumeration, same convention as `_index.json`).

The Architect NEVER reads the raw funnel files directly for tally purposes — it reads
`_tally.json` as an injected context block (see §4).

### 3e. Edge cases

**Empty store (0 funnel files):**
Emit `dead_ground: [], whitespace: []`, `total_funnels: 0`, `low_n_warning: true`.
Log warning. Exit 0 — an empty store is valid (space not yet analyzed), not an error.

**Single funnel (the fixture case):**
`low_n_warning: true` (total_funnels 1 < default threshold 5). Every move goes to
`whitespace` (funnel_count 1 < 5). The output is structurally correct; the warning tells
the Architect not to interpret whitespace absence as "no one has done this" — it means
"only one funnel examined."

**Threshold > store size (always in small runs):**
Same as low_n_warning behavior above. This is the expected state until 5+ funnels
are in the store. The script does not error; it marks `low_n_warning: true` and continues.

**Missing `belief_records` field:**
If a funnel file has no `belief_records` key (or it is null): treat as empty array, log
a stderr warning with the funnel_id, continue. Do not fail the run over one incomplete
record — the tally is still valid for the other funnels.

**Missing `moves` on a belief record:**
Skip the record's move contribution (treat `moves` as `[]`). Log nothing (this is normal
for partially-filled records, and would be noisy). The belief record still exists; it
just doesn't contribute to the move tally.

**Off-enum move tags (fixture case):**
Do NOT reject or filter. Accept any non-empty string as a move key. The closed-enum
enforcement is the job of `validate-analyzer.js` — by the time funnels are in the store,
they have passed the validator. The tally is a reader, not a validator. If off-enum tags
appear (only possible in the fixture), they count as their own keys. The fixture's
`_provenance._note` already marks it as synthetic; this is acceptable behavior.

**Duplicate `funnel_id` across files:**
If two files have the same `funnel_id`, call `fail()` — the store is corrupted. This
is consistent with how `aggregate-mechanisms` fails on malformed input.

**`--threshold=0` or negative:**
Call `fail('threshold must be >= 1')`. Exit 2.

**Non-integer `--threshold`:**
`parseInt(opts.threshold, 10) || 5` — invalid parses fall back to 5, consistent with
how funnel-rag-query handles `--top`.

### 3f. Low-N behavior (meaningful threshold with small stores)

The default threshold of 5 is meaningless when the store has fewer than 5 funnels.
The script does NOT dynamically scale the threshold (e.g. "50% of funnels") because
dynamic scaling changes the classification semantics between runs and would make the
output non-reproducible for the same data set. Instead:

- Always use the configured threshold (default 5) for classification.
- Set `_meta.low_n_warning: true` whenever `total_funnels < threshold`.
- Log a stderr warning so the operator sees it at run time.
- The Architect spec must check `_meta.low_n_warning` before acting on dead_ground[].
  When true: treat all dead_ground[] entries as "possibly saturated (low N)" and
  whitespace[] as "candidate open angles (insufficient data to confirm)."

This keeps the script deterministic and the output format identical regardless of store
size. Interpretation is delegated to the Architect (a judgment agent), not the script
(a deterministic counter). This is consistent with the brick law in CLAUDE.md.

---

## 4. Integration with Phase 15 — Architect context injection

The claim tally is an ARCHITECT INPUT, not a copywriter input. It must be injected
into the Architect's context before the design conversation begins, using the same
deterministic injection pattern as `inject-dr.js` and `inject-market-selection-dr.js`.
Hooks do NOT fire inside subagents (confirmed in both `funnel-deep-pass.md` and
`15-COPYWRITE-WIRING-REFERENCE.md`); therefore the orchestrator (the `/market-selection`
or Phase-15 equivalent skill) MUST:

1. Run `node tools/funnel-claim-tally.js --space=<space>` to regenerate `_tally.json`
   (or verify it is fresh — within the same session or since the last `funnel-store.js`
   write).
2. Read `_tally.json` and paste its content (or a formatted excerpt) into the Architect's
   spawn prompt, clearly labeled (e.g. under a `=== CLAIM TALLY ===` header in the same
   inject-dr attributed block style).
3. Include `_meta.low_n_warning` prominently in the pasted block so the Architect sees it.

The Architect spec (Step 6) already references "a claim tally (deterministic pre-pass)"
as a named input. This script is the fulfillment of that reference. The Phase 15 plan
must include an explicit verification task — run the script against the real store,
confirm `_tally.json` is written, confirm the Architect's spawn prompt contains its
content — mirroring the OPERATOR VERIFICATION MANDATE at the bottom of
`15-SPEC-funnel-architect.md`.

---

## 5. Verification — acceptance test against the fixture

The fixture at `runs/_fixture/funnels/sample.json` has exactly 1 funnel
(`gameshell-kickstarter`) with 4 belief records containing these moves (synthetic,
off-enum, but structurally valid for testing the counting logic):

```
record 1: ["exploded-diagram", "module-naming", "open-source-claim"]
record 2: ["founder-on-camera", "factory-named", "dated-production-photo", "skin-in-game"]
record 3: ["update-timeline", "backer-unboxing-photos", "delivered-counter"]
record 4: ["early-bird-allocation", "live-remaining-count", "price-step", "campaign-clock"]
```

Total distinct move keys: 14. All unique to 1 funnel.

**Test A — default threshold (5), single-funnel store:**

```sh
node tools/funnel-claim-tally.js --space=_fixture --json
```

Expected behavior:
- `_meta.total_funnels = 1`
- `_meta.threshold = 5`
- `_meta.low_n_warning = true`
- `dead_ground = []` (no move reaches count 5)
- `whitespace` has 14 entries, each with `funnel_count: 1`
- stderr contains `[claim-tally] WARN: store has 1 funnels < threshold 5`
- exits 0

**Test B — threshold=1 to force dead-ground with 1 funnel:**

```sh
node tools/funnel-claim-tally.js --space=_fixture --threshold=1 --json
```

Expected behavior:
- `_meta.low_n_warning = false` (total_funnels 1 >= threshold 1)
- `dead_ground` has all 14 move entries, each `funnel_count: 1`
- `whitespace = []`
- exits 0

This test proves the threshold classification logic independently of having a large
store. It is the only way to verify dead-ground classification with the fixture.

**Test C — write to file:**

```sh
node tools/funnel-claim-tally.js --space=_fixture
```

Expected: `runs/_fixture/funnels/_tally.json` written. `[claim-tally] written _tally.json`
on stderr. Exit 0.

**Test D — missing space:**

```sh
node tools/funnel-claim-tally.js --space=nonexistent
```

Expected: `[claim-tally] REJECT: store directory does not exist: runs/nonexistent/funnels`
on stderr. Exit 2.

**Test E — empty store (create a temp empty funnels dir):**

```sh
mkdir -p /tmp/tally-test/funnels && node tools/funnel-claim-tally.js \
  --space=tally-test --out=/tmp/tally-test/funnels/_tally.json --json
```

Expected: `dead_ground: [], whitespace: []`, `total_funnels: 0`, `low_n_warning: true`.
Exit 0. (This requires the script to accept an out-of-tree path for testing; the
`--out` flag handles that.)

---

## 6. What the executor must NOT do

- Do not add a "clean" or "normalize" step to the moves before counting — accepted as-is.
- Do not filter by `routing_flag` (structure_only vs messaging_full). The tally counts
  ALL moves across ALL funnels in the store. The Architect filters by routing_flag when
  consuming the tally if needed — that is a judgment call, not a counting step.
- Do not filter by `belief_confidence`. Even low-confidence (overflow) belief records
  contribute their moves to the tally — if a move appears, it appears.
- Do not dedupe belief records across funnels at the record level — only dedupe at the
  funnel_id level when counting (count distinct funnels per move, not distinct records).
- Do not write or modify any file other than the `--out` path. Do not touch `_index.json`,
  `space-map.json`, or any other file.
- Do not call any external service, embed any text, or spawn any subprocess.
  This is a pure fs-read + count + fs-write script.
