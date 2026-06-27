# Phase 2: Run-Controller & Pipeline Spine - Pattern Map

**Mapped:** 2026-06-27
**Files analyzed:** 6 new files (1 modified config-area: none)
**Analogs found:** 6 / 6 (every new file has an in-repo analog — this is an ASSEMBLE-don't-rewrite phase)

> **Read-only note:** This pattern map is derived from in-session reads of the analog files at the line numbers cited. Every excerpt below is verbatim from the live source. The controller is **pure ordering glue** — if it re-implements a hash, a sanitizer, a `-vN` scan, a slot list, or a basename dispatch, it is violating CTRL-12. The correct controller is short: `loadManifest` → 7 ordered delegations → return.

---

## File Classification

| New File | Role | Data Flow | Closest Analog | Match Quality |
|----------|------|-----------|----------------|---------------|
| `engine/bricks/run-controller.js` | orchestrator (CLI brick) | event-driven / request-response (drives 7-phase loop per step) | `engine/bricks/store-scaffold.js` (CLI shell) + `engine/hooks/route.js` (subprocess dispatch) + `engine/bricks/funnel-analyzer-context.js` (context-assembly) | role-match (composite — no single existing orchestrator) |
| `pipeline.yaml` (repo root) | config | batch (flat ordered id list) | *none* — greenfield config (see No Analog) | none — RESEARCH Pattern 3 |
| `runs/_fixture/pipeline/pipeline.yaml` | config (fixture) | batch | same as above | none — RESEARCH Pattern 3 |
| `runs/_fixture/pipeline/manifests/*.json` | config (fixture data) | transform (manifest-as-data, §5 shape) | `engine/_fixture/audit/resolve-manifest.json` (existing `.json` manifest fixture) | role-match |
| `bin/run` (or `run.sh` / npm shim) | entrypoint (thin shim) | request-response | `engine/hooks/route.js` `#!/usr/bin/env node` shebang + argv parse | role-match (thin) |
| `engine/contracts/controller-smoke.sh` | test (acceptance harness) | batch (asserts) | `engine/contracts/store-smoke.sh` | **exact** |

---

## Pattern Assignments

### `engine/bricks/run-controller.js` (orchestrator, event-driven)

This is the single new behavioral unit. It composes THREE existing idioms — the brick CLI shell (`store-scaffold.js`), the subprocess-dispatch idiom (`route.js`), and the context-assembly precedent (`funnel-analyzer-context.js`) — into the PART3 §8 7-phase loop. **It delegates every phase's *work* to a Phase-1 brick or `route.js`; it owns only the ordering.**

#### A. CLI flag-parse idiom — COPY from `store-scaffold.js` L40-44

The exact `--flag=value` parse every brick uses (mirror it verbatim so the controller is consistent):

```javascript
// engine/bricks/store-scaffold.js L40-44
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);
```

> **Caveat for `--inputs=`/`--outputs=` style values that may contain `=`:** `receipt-write.js` L41-48 uses a `indexOf('=')`/`slice` variant that is safe for values containing `=`. The controller parses only `--space`/`--step`/`--pipeline`/`--manifest-dir`/`--smoke`, none of which contain `=`, so the simple `split('=')` form from `store-scaffold.js` is sufficient. Positional `argv[2]` (`all` or a step id) is read directly (see §B). `--help` + one-line summary + `process.exit(0/1)` round out the shell.

#### B. Positional + thin-shim entrypoint — COPY shebang from `route.js` L1, argv from `funnel-analyzer-context.js`

`route.js` L1 is the `#!/usr/bin/env node` precedent for a thin executable; the controller reads `argv[2]` as `all` | `<step-id>` BEFORE the `--flag` parse:

```javascript
// route.js L1, L32-36 — shebang + positional argv + early-exit guard
#!/usr/bin/env node
const filePath = process.argv[2];
if (!filePath) { process.exit(0); }
```

> Controller maps `argv[2] === 'all'` → `runAll(space, opts)`; else `runStep(argv[2], space, opts)` (RESEARCH Pattern 1/2). The `bin/run` shim is a one-line `exec node engine/bricks/run-controller.js "$@"` OR the npm/`node` invocation directly.

#### C. `sanitizePathSegment` REUSE (CTRL-12) — `require`, do NOT re-paste

Every brick imports the shared sanitizer; the controller MUST too (re-pasting it is a flagged CTRL-12 violation). Call it on `--space` and `--step` before any `path.join`:

```javascript
// store-scaffold.js L35 (import) + L75-79 (usage) — the canonical pattern
const { sanitizePathSegment } = require('./lib/fanout-path');
// ...
const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) {
  console.error('ERROR: --space value sanitized to empty string; use only [a-z0-9._-]');
  process.exit(1);
}
```

The lib itself (`engine/bricks/lib/fanout-path.js` L22-31) strips `/` and dot-runs — traversal-safe `[a-z0-9._-]`. Do not reimplement.

#### D. Subprocess-dispatch idiom (Validate, Store, Version phases) — COPY from `route.js` L41-50

Phase-1 bricks and `route.js` are CLI scripts with top-level `process.exit()` (IIFE main), NOT exported functions — so the controller invokes them as **subprocesses**, never `require`s them. `route.js` is the canonical `spawnSync(node, [script, arg])` precedent:

```javascript
// route.js L41-50 — the subprocess-call shape to mirror for every brick delegation
const { spawnSync } = require('child_process');
function runValidator(validatorFile, arg) {
  const result = spawnSync(
    process.execPath,                       // node binary
    [path.join(hooksDir, validatorFile), arg],
    { stdio: 'inherit' }
  );
  if (result.status !== 0) {
    process.exit(result.status || 2);       // PROPAGATE the validator's exit (2 = reject)
  }
}
```

> **CTRL-07 (Validate phase) uses this directly.** When the manifest names no explicit validator, dispatch via `route.js` (basename → `validate-*.js`); `route.js` L52-61 is the basename switch, L47-49 propagates exit ≥2. **CRITICAL (FIRING-MANIFEST §4): this MUST be an explicit orchestrator call — hooks do NOT fire in subagents.** Use `args` array (never `exec(string)`) — no shell injection. Capture stdout with `{ encoding:'utf8' }` only where a printed value is needed (the `space-version.js` resolver, §F).

#### E. Store+receipt phase (CTRL-08) — call `receipt-write.js` as subprocess, write-once + UNIQUE spawn-id

`receipt-write.js` is **WRITE-ONCE**: a colliding `spawn_id` is `exit 1`, never a silent overwrite (L162-165). The controller must mint a unique spawn-id per spawn.

```javascript
// receipt-write.js L162-165 — the write-once refusal the controller must respect
if (fs.existsSync(outPath)) {
  console.error(`ERROR: receipt ${SPAWN_ID} already exists at ${outPath} — refusing to overwrite committed provenance (no-overwrite-v1)`);
  process.exit(1);
}
```

Receipt CLI shape the controller passes (from `receipt-write.js` L24-26 / L138-148):
```
node engine/bricks/receipt-write.js --space=<s> --spawn-id=<UNIQUE> \
  --step=<id> --inputs=<csv> --outputs=<csv> --gate=<json>
```
Receipt object written (L138-148): `{ spawn_id, step, space, inputs_hash (sha256 of SORTED input bytes), inputs[], outputs[], validator_verdicts:[] (Phase 5 fills), gate, ts }`. **The controller never re-hashes** — `hashInputs()` (L100-108) owns sha256.

> **Unique spawn-id:** `${m.id}-${Date.now()}-${rand}` or `${m.id}-w${wave}-${n}-a${attempt}` — the ≤2 retry loop must bump the suffix each attempt (Pitfall 2). A re-spawn reusing an id breaks the receipts chain.

#### F. No-overwrite NAMING (CTRL-08) — capture `space-version.js` stdout (read-only resolver)

`space-version.js` is **READ-ONLY** — it only PRINTS the next free space name (one bare line, L112), mutates nothing. The controller captures stdout and OWNS the scaffold decision:

```javascript
// space-version.js prints one bare line (L112): process.stdout.write(next + '\n')
// Capture it (store-smoke.sh L75 precedent: NEXT=$(node ...space-version.js --space=...))
const next = spawnSync('node', ['engine/bricks/space-version.js', `--space=${base}`],
  { encoding: 'utf8' }).stdout.trim();
// then OPTIONALLY: store-scaffold.js --space=${next}  (controller decides — resolver does not scaffold)
```

> RESEARCH Open Q2: in smoke (`--space=smoke`, fixed), the bump path likely needs only a **unit assert** in the harness (resolver returns `<space>-v2` after scaffold), not a full versioned re-run drive. Wire the resolver in; act on it only on an explicit re-run flag. Do not over-build.

#### G. Context-assembly phase (CTRL-05) — mirror `funnel-analyzer-context.js`

The precedent assembles ONE context block with explicit DATA boundaries so "there is no file to Read" (PART3 §8.3). `funnel-analyzer-context.js` L1-14 documents the exact intent ("assembles ONE context block ... ready for the orchestrator to paste ... receives the bytes, not instructions to fetch"). Phase-2 controller concatenates the manifest's declared `reads[]` bytes into one block (RESEARCH Pattern 5):

```javascript
// Mirror funnel-analyzer-context.js's "embed bytes, explicit boundaries" model.
// Phase 2 = concatenate reads[] bytes; Phase 3+ swaps in real digest + inject-dr.js. Seam unchanged.
function assembleContext(m, space) {
  return (m.reads || [])
    .map(r => r.replace('{space}', space))
    .map(p => `<<<DATA ${p}>>>\n${fs.readFileSync(p, 'utf8')}\n<<<END>>>`)
    .join('\n');
}
```

#### H. Preflight / Plan-print / Spawn / Gate — controller-owned scripts (no brick analog)

These four phases are NEW orchestrator logic (RESEARCH Patterns 4, 4, 6, 9 respectively) — there is no Phase-1 brick to delegate to. They follow the brick conventions (named refusal + distinct `process.exit`, console summary). Key shapes from RESEARCH:
- **Preflight (CTRL-03):** `fs.existsSync` each `reads[]`; missing → `console.error('REFUSE [<id>] preflight: missing input contract(s): ...')` + `process.exit(3)` (named refusal, distinct exit; never improvise). Mirrors the `store-scaffold.js`/`receipt-write.js` `console.error(...) ; process.exit(N)` refusal idiom (e.g. `store-scaffold.js` L70-73, L76-79).
- **Plan-print (CTRL-04):** print the DAG (pre + spawn×agents + post + validator + gate) from the manifest BEFORE any run line.
- **Spawn (CTRL-06):** `WAVE_CAP=5`; chunk `m.agents` into waves of ≤5; fixture stub mock-emits a valid-shaped artifact.
- **Gate (CTRL-09):** `if (m.gate)` → `--smoke` auto-approves; log `GATE [<id>] <decision>`; decision flows into the receipt `gate` field. Never silent.

---

### `engine/contracts/controller-smoke.sh` (test, acceptance harness)

**Analog:** `engine/contracts/store-smoke.sh` (**EXACT** — copy the harness skeleton verbatim, swap the asserts).

#### Harness skeleton — COPY from `store-smoke.sh` L14-27 + L150-152

```bash
# store-smoke.sh L14-27 — the project smoke idiom (mirror verbatim)
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root
SPACE="smoke"                          # controller harness: use "_ctrlsmoke" (scratch)
for a in "$@"; do case "$a" in --space=*) SPACE="${a#--space=}" ;; esac done
FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }
# ... asserts ...
# store-smoke.sh L150-152 — named final exit
if [ "$FAIL" -eq 0 ]; then echo "CONTROLLER-SMOKE: ALL ASSERTS PASS ✓"; exit 0;
else echo "CONTROLLER-SMOKE: FAILED — see the named assert above"; exit 1; fi
```

#### Self-cleaning temp space — COPY from `store-smoke.sh` L33 (CRITICAL: gitignore reality)

```bash
# store-smoke.sh L33 — clean start; mirror at start AND end (gitignore NOT auto-ignoring runs/_ctrlsmoke)
rm -rf "runs/${SPACE}"
```

> **VERIFIED in-session:** `git check-ignore runs/_ctrlsmoke` returns NOTHING (exit 1 = NOT ignored); only `runs/_fixture/**` is whitelisted (`.gitignore` L20-21). So the harness MUST either target a `runs/_fixture/...` run OR `rm -rf "runs/${SPACE}"` at **both** start and end. The build must leave `git status` clean for `runs/`.

#### Inline `node -e` JSON assert — COPY pattern from `store-smoke.sh` L110-143

The project has NO JS test framework — asserts are inline `node -e` blocks with the same `ok/bad` helpers. Mirror this for receipt-key asserts (CTRL-08) and `loadManifest` shape asserts (CTRL-11):

```bash
# store-smoke.sh L110-124 (excerpt) — inline node assert pattern to mirror
node -e '
const fs=require("fs");
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
const p="runs/'"${SPACE}"'/_receipts/<id>.json";
fs.existsSync(p)?ok("receipt file exists"):bad("receipt file missing");
const r=JSON.parse(fs.readFileSync(p,"utf8"));
(r.spawn_id && r.inputs_hash && r.validator_verdicts!==undefined)?ok("receipt keys present"):bad("missing key");
(/^[0-9a-f]{64}$/.test(r.inputs_hash))?ok("inputs_hash is sha256"):bad("not sha256");
process.exit(fail);
' || FAIL=1
```

> **One named assert per CTRL id** (RESEARCH "Phase Requirements → Test Map", lines 538-551). Negative fixtures (CTRL-03 missing-input, CTRL-07 bad-emit) follow `store-smoke.sh`'s inline-mutation pattern (`rm` an input; point at a bad-emit manifest) — mirrors how STORE-03 mutates input bytes inline (L131-135).

#### Registration in the suite — `h6-all.sh` L10-17

`h6-all.sh` is the regression runner; the controller harness is run alongside it (not necessarily added to its `SMOKES=()` array unless desired). `h6-all.sh` L20-26 shows the `timeout 180 bash ./<s>.sh` loop + named-fail pattern. **Per-wave-merge regression:** `bash engine/contracts/h6-all.sh` + `bash engine/contracts/store-smoke.sh` (controller must not break the store layer).

---

### `runs/_fixture/pipeline/manifests/*.json` (config fixture, transform)

**Analog:** `engine/_fixture/audit/resolve-manifest.json` (existing `.json` manifest fixture precedent — confirms the engine's `.json`-manifest convention; RESEARCH Assumption A1 recommends `.json` for zero-dep `JSON.parse`).

**§5 manifest shape** the fixture mirrors (SHELL-BUILD-SPEC §5; RESEARCH lines 416-447):
```json
{
  "id": "fx-01-emit",
  "reads": ["runs/{space}/bet-brief.md"],
  "writes": ["runs/{space}/space-map.json"],
  "scripts": { "pre": [], "post": [] },
  "prompt": "fixture/stub-emit.md",
  "agents": 1,
  "validator": null,
  "gate": false
}
```

> `{space}` is the substitution token the controller replaces. **Fixture coverage (RESEARCH Open Q1 + Assumption A2):** the cleanest fixture exercises (a) one `validator:null` manifest proving the explicit-call wiring + `route.js` no-rule pass-path; optionally (b) one `gate:true` manifest for CTRL-09 block-and-log; optionally (c) one `agents:6` manifest for the CTRL-06 wave-cap unit assert. **VERIFIED:** `validate-classifier.js` (the validator `route.js` dispatches for `space-map.json`) has 9 non-trivial reject rules (L4-13) — a mock-emit that PASSES it is expensive. So prefer `validator:null` for the wiring proof, and prove exit-propagation with a deliberately-bad fixture asserting `route.js` propagates exit 2 (RESEARCH Open Q1 recommendation).

---

### `pipeline.yaml` (repo root) + `runs/_fixture/pipeline/pipeline.yaml` (config, batch)

**No code analog** — greenfield config. Shape per RESEARCH Pattern 3 (hand-parsed flat `steps:` list, zero-dep):

```yaml
steps:
  - 00-bet-compiler
  - 01-collect
  - 02-funnel-analysis
  - 03-space-map
  - 04-voc-market-pass
  - 05-market-selection
  - 06-voc-deep-pass
  - 07-funnel-architect
  - 08-copywriter
  - 09-asset-classify
  - 10-adversarial-re-review
```

> **R1 order (CTRL-10)** from CONTEXT §canonical_refs (PART3 §1.5/§1.6, lines 70-101). The real `pipeline.yaml` lists 0..10; the fixture has its own short list. Parser is the 6-line splitter (RESEARCH Pattern 3 L239-246) or `pipeline.json` + `JSON.parse`. Reordering = a one-line file edit, zero controller change.

---

## Shared Patterns

### Sanitization (path-traversal guard) — ASVS V5
**Source:** `engine/bricks/lib/fanout-path.js#sanitizePathSegment` (L22-31)
**Apply to:** the controller's `--space` and `--step` (every flag-derived path segment), before any `path.join`.
```javascript
const { sanitizePathSegment } = require('./lib/fanout-path');   // store-scaffold.js L35
```
> REUSE — do NOT re-paste the regex (CTRL-12 violation). Proven traversal-safe by `store-scaffold.js`'s `--space='../evil'` smoke assert.

### Subprocess delegation (no shell, args array)
**Source:** `engine/hooks/route.js` L41-50 (`spawnSync(process.execPath, [script, arg], {stdio:'inherit'})`)
**Apply to:** every brick/hook the controller drives — `route.js` (validate), `receipt-write.js` (store), `space-version.js` (name), `store-scaffold.js` (scaffold). Args array, never `exec(string)`. Capture stdout only for `space-version.js`.
> Bricks are IIFE-with-`process.exit` CLI scripts, NOT modules — `require`-ing one runs its `process.exit` on import and kills the controller (Pitfall 4). Subprocess is mandatory.

### Named refusal + distinct exit code
**Source:** `store-scaffold.js` L70-79 / `receipt-write.js` L76-95 (`console.error('ERROR: ...'); process.exit(N)`)
**Apply to:** Preflight (CTRL-03, `exit 3`), bad usage (`exit 1`), validator reject propagation (CTRL-07, `exit 2` from `route.js`). Never improvise past a missing/null input (P3 — the core shell invariant).

### Write-once provenance (no-overwrite-v1)
**Source:** `receipt-write.js` L162-165 (refuses a colliding spawn-id, `exit 1`)
**Apply to:** Store+receipt phase. Mint a UNIQUE spawn-id per spawn; the ≤2 retry loop bumps the suffix.

### Smoke-harness idiom (the project's only test framework)
**Source:** `engine/contracts/store-smoke.sh` (full) + `h6-all.sh` L10-30
**Apply to:** `controller-smoke.sh` — `set -u`, cd-to-repo-root, `ok/bad`, inline `node -e` asserts, `rm -rf` self-clean both ends, named final exit, one assert per CTRL id.

---

## No Analog Found

| File | Role | Data Flow | Reason / Source to use instead |
|------|------|-----------|--------------------------------|
| `pipeline.yaml` + fixture `pipeline.yaml` | config | batch | Greenfield — no existing pipeline config. Use RESEARCH Pattern 3 (flat `steps:` list) + R1 order from CONTEXT §canonical_refs. |
| Preflight / Plan-print / Spawn-waves / Gate phase logic | orchestrator sub-steps | event-driven | No Phase-1 brick performs these — they are the NEW glue this phase writes. Use RESEARCH Patterns 4 (preflight), 4 (plan-print), 6 (waves ≤5), 9 (gate). Follow brick conventions for refusal/exit/summary. |
| `loadManifest` reader | utility | transform | No existing §5-manifest reader (`engine/_fixture/audit/resolve-manifest.json` is the closest DATA shape, but no loader). Build a `JSON.parse` reader for `.json` manifests (RESEARCH Pattern 1, Assumption A1). |

> All three "no analog" items are EXPECTED — Phase 2 writes exactly one new behavioral unit (the 7-phase ordering); its sub-phases that delegate have brick analogs (sanitize/validate/store/version/scaffold/context), and its sub-phases that don't (preflight/plan/spawn/gate) are the genuinely new code, fully specified by PART3 §8 + RESEARCH Patterns.

## Metadata

**Analog search scope:** `engine/bricks/`, `engine/bricks/lib/`, `engine/hooks/`, `engine/contracts/`, `engine/_fixture/`, `runs/_fixture/`, repo root.
**Files scanned (read in full):** `store-scaffold.js`, `receipt-write.js`, `space-version.js`, `lib/fanout-path.js`, `hooks/route.js`, `hooks/validate-classifier.js` (head), `bricks/funnel-analyzer-context.js` (head), `contracts/store-smoke.sh`, `contracts/h6-all.sh`. Plus `.gitignore` (fixture rules) + `git check-ignore` verification.
**In-session verifications:** `git check-ignore runs/_ctrlsmoke` → NOT ignored (exit 1); `runs/_fixture/**` whitelisted (`.gitignore` L20-21); `engine/_fixture/` is the engine's own fixture tree (existing `.json` manifest precedent at `audit/resolve-manifest.json`); no existing `pipeline.yaml`/`run-controller*` (find empty — greenfield).
**Pattern extraction date:** 2026-06-27
