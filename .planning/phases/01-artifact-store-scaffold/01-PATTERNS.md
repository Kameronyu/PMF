# Phase 1: Artifact Store Scaffold - Pattern Map

**Mapped:** 2026-06-26
**Files analyzed:** 6 new (5 deliverable + 1 acceptance harness)
**Analogs found:** 6 / 6 (all have an idiom to mirror; STORE-02/03/04 logic is author-new but the *brick shell* is copied)

> Scope note: Phase 1 is pure deterministic mechanism. Per `PMF/CLAUDE.md` "Agent design", scaffold / version / receipt / fan-out are **scripts, never agents**. Every new brick copies the existing engine brick shell (CLI arg-parse → `--space` sanitize → `path.join(cwd,'runs',SPACE,...)` → `mkdirSync({recursive})` → `writeFileSync(JSON.stringify(.,null,2))` → sidecar log → exit code). The smoke harness copies the `h6-*.sh` idiom. There is **no test framework** — bash smoke is the proven idiom (`bash engine/contracts/h6-all.sh` → 14/14 green).

## File Classification

| New File (proposed) | Role | Data Flow | Closest Analog | Match Quality |
|---------------------|------|-----------|----------------|---------------|
| `engine/bricks/store-scaffold.js` (STORE-01, STORE-05) | script (brick) | file-I/O (mkdir tree) | `engine/bricks/funnel-store.js` | role-match (write-under-runs idiom; scaffold logic new) |
| `engine/bricks/space-version.js` (STORE-02) | script (brick) — version resolver | transform (scan `runs/` → next free name) | `engine/bricks/funnel-store.js` (sanitize + space-path) | role-match (no version logic exists; resolver is new) |
| `engine/bricks/receipt-write.js` (STORE-03) | script (brick) — ledger writer | file-I/O (one-per-spawn JSON) | `engine/bricks/funnel-store.js` (`writeFunnelRecord`) | role-match (per-record-file write idiom; receipt shape new) |
| `engine/bricks/lib/fanout-path.js` (STORE-04) | library helper | transform (keys → filename) | `sanitizePathSegment` (10 bricks) + `engine/bricks/lib/embed.js` (lib placement) | role-match (sanitize reused; `__` join is new) |
| `runs/smoke/**` (STORE-05) | scaffold output (committed space) | file-I/O (tree on disk) | `engine/_fixture/**` (committed fixture space) | exact (committed, smoke-able space) |
| `.planning/phases/01-artifact-store-scaffold/store-smoke.sh` | test (bash smoke harness) | request-response (assert/exit) | `engine/contracts/h6-claim-tally.sh` + `h6-dedupe.sh` + `h6-all.sh` | exact (the proven smoke idiom) |

**Placement decision (NAMING.md §2 "Rule of placement"):** deterministic pipeline transforms → `engine/bricks/`; a shared definition the whole engine reads → `engine/bricks/lib/`. `engine/**` is explicitly NOT off-limits (NAMING.md §7). Verb set (NAMING.md §3) is closed — `store` is approved; `scaffold`/`version`/`receipt`/`fanout` are NEW verbs and must be added to the verb list in the same change (do not invent silently). The planner may alternatively root these under a controller-owned top-level (Research A4 — low risk either way); the idioms below are identical regardless of directory.

---

## Pattern Assignments

### `engine/bricks/store-scaffold.js` (script, file-I/O) — STORE-01 / STORE-05

**Analog:** `engine/bricks/funnel-store.js`

**CLI arg-parse + `--space`-required idiom** (funnel-store.js L32-36, L73-76):
```javascript
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);
// ...
if (!opts.space) {
  console.error('ERROR: --space=<market-space> is required');
  process.exit(1);
}
```

**Space sanitize + store-root resolution** (funnel-store.js L81-97) — copy verbatim; `arduview-v2` survives this filter so `<base>-vN` is a legal space name:
```javascript
function sanitizePathSegment(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');  // collapse residual dots — block traversal
}
const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) { console.error('ERROR: --space value sanitized to empty string'); process.exit(1); }
const OUT_DIR = path.join(process.cwd(), 'runs', SPACE, 'funnels'); // scaffold uses runs/<SPACE> as root
```

**Write idiom (mkdir-recursive + pretty JSON)** (funnel-store.js L179-180) — scaffold replaces the file write with a `mkdirSync` per slot dir + a stub file write per slot file:
```javascript
fs.mkdirSync(OUT_DIR, { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(record, null, 2));
```

**Slot list to scaffold (the STORE-01 deliverable):** use the reconciled §6/R1 list from `01-RESEARCH.md` "The Exact runs/<space>/ Slot List". Directories: `_receipts/`, `corpus/`, `ads/`, `funnels/`, `voc/market-signal/`, `voc/`, `voc-bank/`, `copy/`, `review/`, `asset-classify/`. Files: `bet-brief.md`, `product-intake.md`, `asset-classify/CLAIM-LIST.json`, `brands.json`, `queries_run.json`, `funnels/_tally.json`, `ad-volume-aggregate.json`, `space-map.json`, `voc/gap_candidates.json`, `market-selection.json`, `ntp-pick.json`, `awareness-read.json`, `funnel-brief.md`, `audit-verdicts.json`, `chief-verdicts.json`, `asset-records.json`. Follow §6 names verbatim (lowercase, §6 extensions) — Research Q3 resolves the `.json`/`UPPERCASE.md` discrepancy in favor of the §6 operator-handed contract.

**Reuse boundary:** COPY the arg-parse + `sanitizePathSegment` + `path.join(cwd,'runs',SPACE)` + `mkdirSync` idiom. AUTHOR-NEW: the slot-table iteration and stub-file emission (no brick scaffolds a tree today — VERIFIED no scaffold capability in REGISTRY).

---

### `engine/bricks/space-version.js` (script, transform) — STORE-02

**Analog:** `engine/bricks/funnel-store.js` (sanitize + space path) for the shell; the **no-overwrite golden-compare** in `h6-claim-tally.sh` for the acceptance invariant.

**Core resolver logic (AUTHOR-NEW) — scan `runs/` for `<base>` and `<base>-vN`, return next free:**
```javascript
// given base "smoke": existing runs/smoke + runs/smoke-v2 → return "smoke-v3"
// <base>-vN passes sanitizePathSegment unchanged, so it composes with every brick's --space.
const base = sanitizePathSegment(opts.space);
const runsDir = path.join(process.cwd(), 'runs');
const existing = fs.existsSync(runsDir) ? fs.readdirSync(runsDir) : [];
const re = new RegExp(`^${base}-v(\\d+)$`);
const maxV = existing.reduce((m, d) => d === base ? Math.max(m, 1)
  : (re.test(d) ? Math.max(m, +d.match(re)[1]) : m), 0);
const next = maxV === 0 ? base : `${base}-v${maxV + 1}`;
```

**Grain = whole SPACE, not per-artifact** [VERIFIED: engine/contracts/MATERIALS.md L38; CLAUDE.md "Versioning"]. The resolver takes a **space name**, never an artifact path (Pitfall 1 warning sign). Do NOT build a guard hook — explicitly DEFERRED (PMF/CLAUDE.md "Versioning", enforcement is convention-only).

**v1-byte-intact invariant — copy the no-overwrite checksum idiom** (`h6-claim-tally.sh` L4-7, L11, L30): the golden is "never overwritten (no-overwrite-v1)"; output goes to a transient dir; assert byte-equality. STORE-02's smoke is the inverse: snapshot `sha256sum runs/smoke/**`, re-run (resolver returns `smoke-v2`), re-checksum `runs/smoke/**` and assert unchanged.

**Reuse boundary:** COPY `sanitizePathSegment` + `runs/` rooting. AUTHOR-NEW: the version-scan/next-free logic (the as-ran `arduview-v2` was a manual `mv`/re-run, NOT a capability — VERIFIED REGISTRY.json L19).

---

### `engine/bricks/receipt-write.js` (script, file-I/O) — STORE-03

**Analog:** `engine/bricks/funnel-store.js` `writeFunnelRecord` (the per-record-file write).

**Per-spawn-file write idiom** (funnel-store.js L170-183) — receipt mirrors the `funnels/<funnel_id>.json` one-file-per-record style, writing `_receipts/<spawn_id>.json`:
```javascript
function writeFunnelRecord(record, logLines, dryRun) {
  const outPath = path.join(OUT_DIR, `${record.funnel_id}.json`);
  if (dryRun) { logLines.push(`[DRY-RUN] would write: ${outPath}`); return {...}; }
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(record, null, 2));
  // → receipt: OUT_DIR = path.join(cwd,'runs',SPACE,'_receipts'); file = `${spawn_id}.json`
}
```

**Receipt shape (AUTHOR-NEW; Phase 1 ships shape + writer, Phase 2/5 populate verdicts)** — from `01-RESEARCH.md` `_receipts/` section (PART3 §8 "inputs hash, digest version, validator verdicts, ledger entry"):
```json
{
  "spawn_id": "<step>-<agent>-<ts-or-counter>",
  "step": "04-voc-market-pass",
  "space": "smoke",
  "inputs_hash": "<sha256 of sorted input bytes>",
  "inputs": ["runs/smoke/space-map.json"],
  "outputs": ["runs/smoke/voc/market-signal/<niche>__<transformation>.json"],
  "validator_verdicts": [{ "validator": "validators/04.js", "verdict": "PASS" }],
  "gate": { "step_gated": false, "decision": null },
  "ts": "2026-06-26T00:00:00Z"
}
```

**`inputs_hash` helper:** `node:crypto` sha256 over sorted input bytes (stdlib, no install). Phase 1 ships the hashing helper + a writer taking a fully-formed receipt object; do NOT couple to step internals (Research Q2).

**Reuse boundary:** COPY the per-record-file write + `mkdirSync`. AUTHOR-NEW: the receipt object + sha256 helper. **NOT a reuse target:** `engine/bricks/validate-receipt.js` — VERIFIED it checks pipeline-audit reviewers' CONTEXT-RECEIPT line vs an inject manifest (validate-receipt.js header L1-19), it is NOT a run-ledger writer. Do not extend it.

**Gitignore (Pitfall 4):** `_receipts/` is COMMITTED (provenance). Name files `_receipts/<spawn_id>.json`, NOT `_receipts/*-log.txt` (which `.gitignore` L16 `_*-log.txt` would swallow) and NOT `_index.json` (L15 ignored). Receipts are provenance, not scratch.

---

### `engine/bricks/lib/fanout-path.js` (library helper, transform) — STORE-04

**Analog:** `sanitizePathSegment` (funnel-store.js L81-87 / funnel-claim-tally.js L59-61) for the per-key sanitize; `engine/bricks/lib/embed.js` for the `lib/` placement (`funnel-*.js require('./lib/embed')`, NAMING.md §2).

**Helper (AUTHOR-NEW; sanitize reused)** — from `01-RESEARCH.md` Code Examples; `__` double-underscore is the field separator (single `_` can appear inside a value):
```javascript
function buildFanoutName(...keys) {
  return keys.map(sanitizePathSegment).join('__') + '.json';
}
// buildFanoutName('edc-aesthetic-collectors', 'novelty-object-own')
//   → 'edc-aesthetic-collectors__novelty-object-own.json'
```

**Apply where a step fans out per cell/id:** `voc/market-signal/` (niche × transformation), `funnels/<funnel_id>.json` (single key, already the as-ran convention), `ads/<slug>.json`, `corpus/<slug>/`, `copy/` (Phase 4). Phase 1 ships the helper; Phase 3 manifests declare the dir; Phase 4 step writers call it. Collisions impossible — keys are closed-vocabulary cell coordinates.

**Note the two sanitize variants** (functionally equivalent, pick one and export it): funnel-store.js does `.toLowerCase()` THEN `.replace(/[^a-z0-9._-]/g,'')`; funnel-claim-tally.js does `.replace(/[^a-z0-9._-]/gi,'')` THEN `.toLowerCase()`. Either yields `[a-z0-9._-]`. Centralizing it in `lib/fanout-path.js` (or a `lib/sanitize.js`) lets the new bricks import one source instead of re-pasting (current bricks each inline their own copy — acceptable, but the new shared helper is the elegant move).

**Reuse boundary:** COPY `sanitizePathSegment`. AUTHOR-NEW: the `__`-join namer (no shared fan-out namer exists today — VERIFIED, funnel-store sanitizes a single id only).

---

### `runs/smoke/**` (scaffold output, file-I/O) — STORE-05

**Analog:** `engine/_fixture/**` (the committed, smoke-able space the engine `h6-*.sh` run against).

**What it gives Phase 1:** the pattern for a committed space with real subdirs (`engine/_fixture/` has `brands.json`, `funnels/`, `asset-classify/CLAIM-LIST.json`, `corpus/`, `ads/`, etc.) — exactly the slot shapes `store-scaffold.js` must create under `runs/smoke/`.

**Boundary (Runtime State Inventory):** `engine/_fixture/` is the ENGINE's fixture (drives `h6-all.sh`) — keep it untouched. Create a SEPARATE `runs/smoke/`. There is currently **no `runs/` at repo root** (VERIFIED: `ls -d runs` → absent); the old `runs/arduview*` is quarantined in `_legacy/` (`.gitignore` L29). Phase 1 creates `runs/` fresh. Do NOT scaffold a creds slot (creds are gitignored seam files, not a slot).

**Note:** `.gitignore` L19-22 whitelists `!runs/_fixture/` but no `runs/_fixture/` exists — the live committed fixture is `engine/_fixture/`. `runs/smoke/` is NOT whitelisted, so its committed slots fall under default git tracking (correct — slots are provenance) while `_index.json` / `_*-log.txt` / `_*.agent.json` / `corpus/*/raw/` / `assets/` inside it stay ignored.

---

### `.planning/phases/01-artifact-store-scaffold/store-smoke.sh` (test, bash) — STORE-01..05 acceptance

**Analog:** `engine/contracts/h6-claim-tally.sh` (no-overwrite golden compare), `h6-dedupe.sh` (multi-assert shape checks), `h6-all.sh` (the runner).

**Smoke-script skeleton** (h6-dedupe.sh L8-25, L51-55) — `set -u`, cd to repo root, transient OUT dir, `ok()/bad()` helpers, cleanup, named-assert exit:
```bash
#!/usr/bin/env bash
set -u
cd "$(dirname "$0")/../../.." || exit 1   # → repo root (from .planning/phases/01-.../)
OUT="runs/smoke"; FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }
# ... scaffold → assert slots → version-resolve → receipt → fan-out → re-run checksum ...
echo ""
if [ "$FAIL" -eq 0 ]; then echo "STORE-SMOKE: ALL ASSERTS PASS ✓"; exit 0;
else echo "STORE-SMOKE: FAILED — see the named assert above"; exit 1; fi
```

**Embedded `node -e` assertion idiom** (h6-claim-tally.sh L23-35; h6-dedupe.sh L27-49) — the repo's `jq -e` equivalent (it uses inline node, not jq; match it):
```bash
node -e '
const fs=require("fs");
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
const r=JSON.parse(fs.readFileSync("runs/smoke/_receipts/<id>.json","utf8"));
(r.spawn_id && r.inputs_hash && r.validator_verdicts && r.outputs) ? ok("receipt keys present") : bad("missing receipt key");
process.exit(fail);
' || FAIL=1
```

**No-overwrite checksum for STORE-02** (mirror h6-claim-tally.sh L4-7 "golden never overwritten"):
```bash
# snapshot → re-run resolver → assert v1 unchanged
BEFORE=$(find runs/smoke -type f -exec sha256sum {} \; | sort)
node engine/bricks/space-version.js --space=smoke   # expect prints "smoke-v2"
AFTER=$(find runs/smoke -type f -exec sha256sum {} \; | sort)
[ "$BEFORE" = "$AFTER" ] && ok "runs/smoke byte-intact after re-run" || bad "v1 mutated"
```

**Slot-presence checks for STORE-01** (illustrative `test -d`/`test -f`):
```bash
test -d runs/smoke/voc/market-signal && ok "voc/market-signal/ dir" || bad "voc/market-signal/ missing"
test -d runs/smoke/_receipts && ok "_receipts/ dir" || bad "_receipts/ missing"
test -f runs/smoke/bet-brief.md && ok "bet-brief.md" || bad "bet-brief.md missing"
```

**Reuse boundary:** COPY the entire `h6-*.sh` structure (set -u, transient/cleanup, ok/bad, inline-node asserts, exit 0/1). AUTHOR-NEW: the STORE-01..05 assertions. Do NOT introduce jest/vitest/pytest — the project deliberately uses bash smoke (no test-framework config in repo).

---

## Shared Patterns

### Path-segment sanitize (path-traversal safety)
**Source:** `engine/bricks/funnel-store.js` L81-87 (canonical) — also funnel-claim-tally.js L59-61, + 8 other bricks.
**Apply to:** every new brick that derives a path from data (`store-scaffold`, `space-version`, `receipt-write`, `fanout-path`).
```javascript
function sanitizePathSegment(raw) {
  return String(raw).toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/\.\.+/g, '');
}
```
`arduview-v2` / `smoke-v2` survive unchanged → `<base>-vN` composes with every brick's `--space`.

### Brick shell (arg-parse → space → write → log → exit)
**Source:** `engine/bricks/funnel-store.js` L32-97, L170-183, L338-364; `funnel-claim-tally.js` L31-70 (incl. `--out` override + `--help` + `fail()`).
**Apply to:** all four new bricks.
- `--space` REQUIRED; `--out` override; `--dry-run`; `--help` first.
- `path.join(process.cwd(), 'runs', SPACE, ...)` rooting.
- `fs.mkdirSync(dir,{recursive:true})` before write; `JSON.stringify(obj,null,2)`.
- sidecar log `_<brick>-log.txt` (GITIGNORED — `.gitignore` L16); one-line `console.log` summary.
- exit codes: 0 ok, 1 fatal/total-failure, 2 bad-usage (funnel-claim-tally `fail()` uses 2).

### Bash smoke harness
**Source:** `engine/contracts/h6-claim-tally.sh`, `h6-dedupe.sh`, `h6-all.sh`.
**Apply to:** `store-smoke.sh` (and registration into a future `h6-all.sh`-style runner if the planner wants Phase-1 in the regression set).
- `set -u`; `cd "$(dirname "$0")/.."`-to-root; transient OUT cleaned at end; `ok()/bad()`; inline `node -e` asserts; named-assert exit.

### No-overwrite-v1 (whole-space)
**Source:** `engine/contracts/MATERIALS.md` L38; `PMF/CLAUDE.md` "Versioning"; precedent `h6-claim-tally.sh` golden-never-overwritten.
**Apply to:** `space-version.js` (resolver) + `store-smoke.sh` (checksum invariant). Grain = whole space (`<base>-vN`), NOT per-artifact. Guard hook DEFERRED — do not build.

---

## No Analog Found

None. Every new file has at least a role/idiom analog. The *logic* for STORE-02 (version scan), STORE-03 (receipt shape + sha256), and STORE-04 (`__`-join) is author-new — but each is built inside a brick shell copied verbatim from `funnel-store.js`, and the research grounds each shape in a cited doc. No file needs to fall back to RESEARCH.md generic patterns over a real codebase analog.

| Deliverable | Logic status | Nearest convention to extend |
|-------------|--------------|------------------------------|
| Tree scaffold (STORE-01) | author-new | funnel-store.js write idiom + §6 slot list |
| Version resolver (STORE-02) | author-new | funnel-store.js sanitize/rooting + MATERIALS.md L38 rule |
| Receipt writer (STORE-03) | author-new | funnel-store.js `writeFunnelRecord` + PART3 §8 receipt contents |
| Fan-out helper (STORE-04) | author-new | `sanitizePathSegment` + lib/embed.js placement |

## Metadata

**Analog search scope:** `engine/bricks/`, `engine/bricks/lib/`, `engine/contracts/*.sh`, `engine/contracts/NAMING.md`, `engine/contracts/REGISTRY.md`, `engine/_fixture/`, `.gitignore`, repo-root `runs/` (absent).
**Files scanned/read:** funnel-store.js, funnel-claim-tally.js, validate-receipt.js (head), h6-all.sh, h6-claim-tally.sh, h6-dedupe.sh, NAMING.md, REGISTRY.md, .gitignore, engine/_fixture listing. Grep confirmed `sanitizePathSegment` in 10 bricks; no `receipt|version|scaffold|fanout` brick; no `buildFanoutName`/`join('__')`.
**Pattern extraction date:** 2026-06-26
