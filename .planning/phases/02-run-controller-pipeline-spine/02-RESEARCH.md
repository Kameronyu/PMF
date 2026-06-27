# Phase 2: Run-Controller & Pipeline Spine - Research

**Researched:** 2026-06-27
**Domain:** Node.js (stdlib-only) deterministic orchestrator — assemble the PART3 §8 seven-phase loop over a `pipeline.yaml` from existing Phase-1 store bricks + `route.js`
**Confidence:** HIGH (the design is FIXED by PART3 §8 + SHELL-BUILD-SPEC §3/§5/§9; this is an assembly problem, not open research — all sources read in-session)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
This is an INFRASTRUCTURE phase — discuss was skipped. All implementation choices are at **Claude's discretion, bound to the authoritative sources** (PART3 §8 verbatim, SHELL-BUILD-SPEC §3/§5/§9, FIRING-MANIFEST §4, the Phase-1 bricks). The CONTEXT locks these defaults:

- **Language/runtime:** Node.js, **stdlib only** (`fs`/`path`/`child_process`/`crypto`) — matches Phase-1 bricks + `engine/package.json` `engines.node>=20` (20.20.0 verified). **No new third-party dependency** (no YAML lib). Controller is `engine/bricks/run-controller.js` (or similar) wired to a thin `run` entrypoint. [VERIFIED: `node --version` → v20.20.0; `engine/package.json` deps = playwright only]
- **`pipeline.yaml`:** a flat ordered list of the 11 R1 step ids (0..10). Hand-parse the simple `steps:` list (or a `.json`-backed reader) — zero-dep. Reordering steps = editing this list only (CTRL-10).
- **Manifest loader (CTRL-11):** reads per-step manifest files (the SHELL-BUILD-SPEC §5 shape) to sequence/route/validate. Loads **whatever manifests exist** — the 11 real manifests are Phase 3.
- **Validate phase (CTRL-07):** invoke the validator **explicitly** as an orchestrator step (FIRING-MANIFEST §4 — hooks don't fire in subagents). Reuse `route.js` as the basename→validator dispatcher where a manifest names no explicit validator; bounded re-spawn ≤2 then escalate.
- **Store+receipt phase (CTRL-08):** call `receipt-write.js` (honor write-once) + use `space-version.js` for the no-overwrite naming decision.
- **Operator gate (CTRL-09):** block on a sign-off artifact; **auto-approve in smoke mode** (`--smoke`/`--auto-approve` flag); the gate decision is **logged into the receipt** (`gate` field), never silent.

### Manifest-availability decision (the key Phase-2/Phase-3 boundary call)
Phase 2 builds the CONTROLLER + `pipeline.yaml` + manifest LOADER; the **11 real step manifests are Phase 3**. The Phase-2 acceptance test exercises the loop on a **minimal FIXTURE manifest set** (recommended approach **A** below), NOT the real 11. The real `pipeline.yaml` still lists 0..10 in R1 order (CTRL-10/CTRL-02); the fixture carries its own small list. **STATE the chosen approach in the plan** (this research recommends A).

### Reuse (do NOT rewrite — CTRL-12)
- `engine/hooks/route.js` — basename→validator dispatch (explicit invocation, not as a hook).
- `engine/hooks/validate-*.js` — per-agent validators (Phase 3 manifests bind them).
- `engine/bricks/store-scaffold.js` / `space-version.js` / `receipt-write.js` / `lib/fanout-path.js` — Phase-1 store layer.
- `engine/bricks/lib/fanout-path.js#sanitizePathSegment` — `--space`/`--step` sanitization (do NOT re-paste — `require` it).
The controller ORDERS these per the §8 blueprint; it re-implements no hashing, sanitization, scaffolding, or versioning.

### Claude's Discretion
- The cleanest assembly of the 7-phase loop and the loader's internal structure.
- Fixture manifest count/shape (1–3 minimal manifests recommended), entrypoint shape, flag names.
- How `pipeline.yaml` is parsed (hand-parser vs `.json`-backed) — both acceptable if zero-dep.

### Deferred Ideas (OUT OF SCOPE)
- The **11 real step manifests** + 11 prompt stubs + mock emits → Phase 3 / 4.
- **Field-level seam schemas** + field-continuity validators → later (Job 5); Phase 2 validators check presence/top-level shape only.
- **Real operator sign-off UX** — Phase 2 logs the gate + auto-approves in smoke; a human flow is later.
- The **no-overwrite guard hook** — explicitly DEFERRED project-wide; convention + write-once `receipt-write.js` carry it.
- **Cheap-model cleanliness QA** (PART3 §8 line 457, optional ◆) — not built this phase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CTRL-01 | `run <step> --space=<s>` executes one step through the §8 7-phase loop | `runStep(step, space)` driver runs phases 1→7 in order (Architecture Patterns → Pattern 1) |
| CTRL-02 | `run all --space=<s>` walks `pipeline.yaml` ids in R1 order end-to-end | `runAll(space)` reads `pipeline.yaml`, iterates ids, calls `runStep` per id (Pattern 2) |
| CTRL-03 | Preflight refuses by NAME on a missing input (never improvise) | Phase 1 Preflight reads manifest `reads[]`, `fs.existsSync` each, emit named refusal + exit≠0 (Pattern 3) |
| CTRL-04 | Plan-print declares the step's DAG before running | Phase 2 prints scripts.pre + spawn + scripts.post + validator + gate from the manifest before any run (Pattern 4) |
| CTRL-05 | Context-assembly embeds digest + corpus bytes; agent never Reads shared state | Phase 3 mirrors `funnel-analyzer-context.js` — assemble a context block; in stub/fixture mode the "spawn" reads the assembled block, not the store (Pattern 5) |
| CTRL-06 | Spawn runs agent waves capped at ≤5 | Phase 4 chunks `agents` count into waves of ≤5 (`WAVE_CAP=5`); fixture `agents:1` is one wave (Pattern 6) |
| CTRL-07 | Validate runs blocking validator; reject → re-spawn ≤2 → escalate | Phase 5 invokes validator EXPLICITLY (FIRING-MANIFEST §4) via `route.js` or manifest `validator`; loop ≤2 then escalate (Pattern 7) |
| CTRL-08 | Store+receipt — no-overwrite versioning + emit receipt | Phase 6 calls `receipt-write.js` (write-once) with a UNIQUE spawn-id; uses `space-version.js` to NAME a bumped space (Pattern 8) |
| CTRL-09 | Operator gate blocks on sign-off (auto-approve in smoke), logged never silent | Phase 7 reads manifest `gate`; smoke auto-approves; decision written into the receipt `gate` field (Pattern 9) |
| CTRL-10 | `pipeline.yaml` lists ids in R1 order; reorder = config edit | `pipeline.yaml` = flat ordered `steps:` list; the controller has zero hardcoded order (Pattern 2; State of the Art) |
| CTRL-11 | A manifest loader reads per-step manifests to sequence/route/validate | `loadManifest(id)` parses the §5 shape; loads whatever exists (Pattern 1; Manifest Data Shape) |
| CTRL-12 | The controller is ASSEMBLED from existing bricks/hooks/route.js, not rewritten | Every phase delegates to a Phase-1 brick or `route.js`; controller is pure ordering glue (Architectural Responsibility Map; Don't Hand-Roll) |
</phase_requirements>

## Summary

Phase 2 is **deterministic plumbing assembly**, not design. PART3 §8 (lines 449–455) writes the run-controller out verbatim as a 7-phase loop — **Preflight → Plan-print → Context-assembly → Spawn → Validate → Store+receipt → Operator-gate** — and SHELL-BUILD-SPEC §3 restates it, §5 gives the step-manifest-as-data shape, §9 puts "build the run-controller + `pipeline.yaml` + manifest loader" as build-order step 2 (= this phase). The job is to write one Node.js controller (stdlib only) that ORDERS the existing Phase-1 store bricks (`store-scaffold.js`, `space-version.js`, `receipt-write.js`, `lib/fanout-path.js`) plus `route.js` into those 7 phases, driven by data: a flat `pipeline.yaml` id list (R1 order, steps 0..10) and per-step manifests in the §5 shape. The controller re-implements nothing — no hashing, no sanitization, no scaffolding, no versioning; it is pure glue. [VERIFIED: all source files read in-session]

The single load-bearing correctness constraint is **FIRING-MANIFEST §4 / PART3 P8: hooks do NOT fire in subagents.** The Validate phase therefore MUST invoke the validator **explicitly as an orchestrator step** (via `route.js` basename-dispatch or a manifest-named validator), never rely on the PostToolUse hook. This is the exact failure that sank the as-ran run (§1.1: "validate-on-write silently collapsed"). Two more reuse-honoring constraints: (a) `receipt-write.js` is **WRITE-ONCE** — a colliding `spawn_id` is `exit 1`, not a silent overwrite — so the controller MUST mint a **unique spawn-id per spawn** (e.g. `<step>-w<wave>-<n>` or `<step>-<ts>`); (b) `space-version.js` is **read-only** — it only NAMES the next free space, the controller decides whether to scaffold it.

Because the 11 real manifests are Phase 3, Phase 2 proves the loop on a **tiny fixture manifest set** (recommended: `runs/_fixture/pipeline/` manifests + a fixture `pipeline.yaml` whose stub steps mock-emit a valid-shaped artifact) that drives the FULL 7-phase loop exactly as `run all --space=smoke` will later drive the real 11. The acceptance harness is `engine/contracts/controller-smoke.sh`, mirroring the proven `store-smoke.sh` idiom (`set -u`, cd-to-repo-root, `ok/bad`, inline `node -e` asserts, named exit). **Gitignore reality (verified in-session): an arbitrary `runs/_*` dir is NOT auto-ignored — only the exact `runs/_fixture/**` whitelist is — so the harness must run against `runs/_fixture/...` OR `rm -rf` a self-cleaning temp space, and the build must leave no committed `runs/` cruft.**

**Primary recommendation:** Build one `engine/bricks/run-controller.js` (stdlib-only) implementing `runStep(id, space, opts)` as the literal 7-phase sequence and `runAll(space, opts)` as a `pipeline.yaml` walk; a `loadManifest(id)` reader for the §5 shape; a hand-rolled flat-`steps:`-list parser for `pipeline.yaml`; delegate phases 5/6/7 to `route.js` + `receipt-write.js` + `space-version.js`; prove it with a 1–3-manifest fixture under `runs/_fixture/pipeline/` and `engine/contracts/controller-smoke.sh` asserting one named check per CTRL id, with a self-cleaning temp space.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Drive the 7-phase loop / sequence steps | **Run-controller (orchestrator glue)** | — | PART3 §8: orchestrator keeps Claude-as-orchestrator but de-trusts it; its only degrees of freedom are retry/escalate. This is the new code this phase writes. |
| Preflight input-contract check (CTRL-03) | **Run-controller** (reads manifest `reads[]`, `fs.existsSync`) | — | A script per §8.1; no agent. Named refusal, never improvise (P3). |
| Plan-print the DAG (CTRL-04) | **Run-controller** (prints from manifest) | — | A script per §8.2; deviation visible by diffing receipts vs plan. |
| Context assembly (CTRL-05) | **Run-controller** (script per agent) | `funnel-analyzer-context.js` pattern | §8.3: a script embeds digest+corpus bytes; agent never Reads shared state. Phase-2 fixture mocks this. |
| Spawn agent waves ≤5 (CTRL-06) | **Run-controller** (wave chunker) | — | §8.4. In Phase 2 the "agent" is a fixture stub that mock-emits; no real LLM call. |
| Validate (CTRL-07) | **`route.js` + `validate-*.js` hooks** (invoked explicitly) | Run-controller drives the ≤2 retry loop | FIRING-MANIFEST §4 / P8: hooks don't fire in subagents → explicit orchestrator invocation. Reuse, don't rewrite. |
| Hash inputs + write receipt (CTRL-08) | **`receipt-write.js` brick** | Run-controller supplies unique spawn-id + inputs/outputs | STORE-03 brick owns sha256 + write-once. Controller never re-hashes. |
| No-overwrite space naming (CTRL-08) | **`space-version.js` brick** | Run-controller decides whether to scaffold | STORE-02 brick is read-only resolver. Controller owns the scaffold decision. |
| Slot-tree scaffold | **`store-scaffold.js` brick** | Run-controller calls it for a fresh/bumped space | STORE-01/05 brick owns the slot list. |
| `--space`/`--step` sanitization | **`lib/fanout-path.js#sanitizePathSegment`** | Run-controller imports it | Shared lib; every brick imports it; the controller must too (no re-paste). |
| Operator gate decision (CTRL-09) | **Run-controller** (reads manifest `gate`, auto-approves in smoke) | `receipt-write.js` records it in `gate` field | §8.7 / P9: a logged state, never a silent skip. |
| Step internals (what the agent decides) | **Out of scope (black box)** | — | "Wire at the artifact grain, not the prompt grain" (SHELL-BUILD-SPEC §2). Phase 2 touches no step internal. |

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Node.js | >=20 (20.20.0 verified) | Controller runtime | Matches every Phase-1 brick + `engine/package.json` `engines.node`. [VERIFIED: `node --version`, `engine/package.json`] |
| `node:fs` (stdlib) | built-in | Read manifests/`pipeline.yaml`, `existsSync` preflight, write context blocks | Already used by every store brick. Zero-dep. [VERIFIED: bricks read] |
| `node:path` (stdlib) | built-in | Compose `runs/<space>/...` paths, `basename` for route dispatch | Same. [VERIFIED] |
| `node:child_process` (stdlib) | built-in | `spawnSync`/`execFileSync` to invoke `route.js`, `receipt-write.js`, `space-version.js`, `store-scaffold.js` as sub-processes | `route.js` itself uses `spawnSync` to call validators — same idiom. [VERIFIED: route.js L23,42] |
| `node:crypto` (stdlib) | built-in | NOT called directly by the controller — `receipt-write.js` owns the sha256 | Listed for completeness; controller delegates hashing. [VERIFIED: receipt-write.js L33,100] |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `engine/bricks/lib/fanout-path.js` | in-repo | `sanitizePathSegment` for `--space`/`--step` | ALWAYS — every flag-derived path segment, before any `path.join`. `require('./lib/fanout-path')`. [VERIFIED] |
| `engine/hooks/route.js` | in-repo | basename→validator dispatch (explicit) | Validate phase, when a manifest names no explicit validator. [VERIFIED] |
| `engine/bricks/receipt-write.js` | in-repo | per-spawn receipt, sha256, write-once | Store+receipt phase, once per spawn. [VERIFIED] |
| `engine/bricks/space-version.js` | in-repo | read-only next-free-space resolver | The no-overwrite NAMING decision (controller decides scaffold). [VERIFIED] |
| `engine/bricks/store-scaffold.js` | in-repo | scaffold `runs/<space>/` slot tree (idempotent) | When a fresh or bumped space needs its slots before a step writes. [VERIFIED] |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Hand-parsed flat `pipeline.yaml` | `js-yaml` / `yaml` npm pkg | REJECTED — violates the locked zero-new-dep constraint; the file is a flat `steps:` id list, a 10-line hand-parser suffices. [CITED: CONTEXT.md decisions] |
| `pipeline.yaml` (YAML) | `pipeline.json` | Acceptable per CONTEXT ("a `.json`-backed reader is acceptable if it keeps zero-dep"). YAML keeps the SHELL-BUILD-SPEC §5 naming (`pipeline.yaml`) literal; JSON is parseable with `JSON.parse` and no hand-parser. **Recommendation: keep the `.yaml` name** for spec-literalness, parse the flat list by hand (trivial); reordering stays a one-line edit either way. [ASSUMED — naming preference, low risk] |
| `spawnSync(node, [brick])` subprocess | `require()` the brick as a module | Bricks are written as CLI scripts with top-level `process.exit()` (IIFE main), NOT exported functions — so they MUST be invoked as subprocesses, not `require`d. `route.js` proves the subprocess idiom. [VERIFIED: store-scaffold.js/receipt-write.js are IIFE-with-exit, not `module.exports`] |
| Manifest as `.yaml` | Manifest as `.json` | The §5 example is YAML, but a manifest with nested `scripts.pre[]`/`agents`/`gate` is more than a flat list — hand-parsing nested YAML is error-prone. **Recommendation: fixture manifests as `.json`** (zero-dep `JSON.parse`, no hand-parser) while `pipeline.yaml` stays a flat hand-parsed list. Phase 3 inherits the `.json` manifest convention. [ASSUMED — see Assumptions A1] |

**Installation:**
```bash
# Nothing to install — stdlib only. Confirm runtime:
node --version   # expect v20.x (20.20.0 verified in-session)
```

**Version verification:** No new packages. The only dependency is the runtime, verified in-session: `node --version` → `v20.20.0`; `engine/package.json` declares `engines.node >=20` and lists only `playwright` (irrelevant to this phase). [VERIFIED: in-session]

## Architecture Patterns

### System Architecture Diagram

```
  $ run all --space=smoke --smoke              $ run <step> --space=smoke --smoke
        │                                              │
        ▼                                              │
  ┌───────────────────┐  reads pipeline.yaml           │
  │ runAll(space,opts)│  (flat R1 id list 0..10)       │
  └─────────┬─────────┘                                │
            │  for each id in order ───────────────────┤
            ▼                                          ▼
     ┌──────────────────────────────────────────────────────────┐
     │ runStep(id, space, opts)   ── the PART3 §8 SEVEN-PHASE LOOP│
     │                                                            │
     │  loadManifest(id) ─► { reads, writes, scripts{pre,post},   │
     │                        prompt, agents, validator, gate }   │
     │                                                            │
     │  P1 Preflight ─── fs.existsSync(reads[]) ?                 │
     │       │ missing → NAMED REFUSAL + exit≠0  (CTRL-03)         │
     │       ▼ all present                                        │
     │  P2 Plan-print ── print DAG: pre + spawn×agents + post     │
     │       │           + validator + gate  (CTRL-04)            │
     │       ▼                                                    │
     │  P3 Context-assembly ── embed digest+corpus bytes         │
     │       │   (funnel-analyzer-context.js pattern)  (CTRL-05) │
     │       ▼                                                    │
     │  P4 Spawn ──── waves ≤5; fixture stub MOCK-EMITS a        │
     │       │        valid-shaped artifact → runs/<space>/...   │
     │       │        (CTRL-06)            mint UNIQUE spawn-id   │
     │       ▼                                                    │
     │  P5 Validate ── route.js  OR  manifest.validator          │
     │       │   EXPLICIT call (hooks don't fire in subagents)   │
     │       │   reject → re-spawn ≤2 → escalate     (CTRL-07)    │
     │       ▼ pass                                               │
     │  P6 Store+receipt ── space-version.js (name bump?)        │
     │       │   + receipt-write.js (write-once, unique id,      │
     │       │     inputs/outputs/verdicts)          (CTRL-08)    │
     │       ▼                                                    │
     │  P7 Operator-gate ── manifest.gate ? block : pass         │
     │       │   --smoke → auto-approve; decision → receipt.gate │
     │       ▼   (logged, never silent)             (CTRL-09)    │
     │     return {ok, receipt_path}                             │
     └──────────────────────────────────────────────────────────┘
            │
            ▼  (runAll) next id, or done → unbroken _receipts/ chain
```

### Recommended Project Structure
```
engine/
  bricks/
    run-controller.js          # NEW — the 7-phase loop + loadManifest + pipeline parse (this phase)
    store-scaffold.js          # REUSE (Phase 1)
    space-version.js           # REUSE (Phase 1)
    receipt-write.js           # REUSE (Phase 1)
    lib/fanout-path.js         # REUSE — sanitizePathSegment
  hooks/
    route.js                   # REUSE — explicit validator dispatch
    validate-*.js              # REUSE — Phase 3 manifests bind these
  contracts/
    controller-smoke.sh        # NEW — acceptance harness (mirror store-smoke.sh)
pipeline.yaml                  # NEW — REAL flat R1 id list (0..10) — repo root or engine/
runs/
  _fixture/                    # git-WHITELISTED (.gitignore L20-21) — safe place for the fixture
    pipeline/
      pipeline.yaml            # fixture flat id list (1-3 ids)
      manifests/
        <id>.json              # 1-3 minimal §5-shaped manifests (mock-emit stub)
```
> **`run` entrypoint (CTRL-01/02):** a thin shim — either `bin/run` (a `#!/usr/bin/env node` exec of run-controller), an `npm`/`node` invocation `node engine/bricks/run-controller.js <step|all> --space=<s>`, or a one-line `run.sh`. The controller parses `argv[2]` as `all` or a step id. Discretionary; keep it stdlib + the brick CLI idiom. [CITED: CONTEXT.md "thin `run` entrypoint"]

### Pattern 1: The 7-phase `runStep` driver (CTRL-01, CTRL-11)
**What:** One function runs a single step through the literal §8 sequence, loading the manifest first.
**When to use:** Every step execution — `run <step>` calls it once; `run all` calls it per id.
```javascript
// Source: PART3 §8 (lines 449-455) verbatim phase order; SHELL-BUILD-SPEC §3 (line 47)
function runStep(stepId, space, opts) {
  const m = loadManifest(stepId);                 // CTRL-11: §5 shape (reads/writes/scripts/prompt/agents/validator/gate)
  preflight(m, space);                            // P1 — CTRL-03: missing read → NAMED refusal, exit≠0
  planPrint(m);                                   // P2 — CTRL-04: declare DAG before running
  const ctx = assembleContext(m, space);          // P3 — CTRL-05: embed bytes; agent never Reads store
  let attempts = 0, verdict;
  do {
    const outputs = spawnWaves(m, ctx, space);    // P4 — CTRL-06: waves ≤5; fixture stub mock-emits
    verdict = validate(m, outputs);               // P5 — CTRL-07: EXPLICIT validator (route.js / manifest)
    attempts++;
  } while (!verdict.ok && attempts <= 2);          // bounded re-spawn ≤2
  if (!verdict.ok) escalate(stepId, verdict);     // → operator
  const receipt = storeAndReceipt(m, space, verdict, opts); // P6 — CTRL-08: space-version + receipt-write (write-once)
  operatorGate(m, receipt, opts);                 // P7 — CTRL-09: block / auto-approve(smoke); log in receipt
  return { ok: true, receipt };
}
```

### Pattern 2: `runAll` pipeline walk (CTRL-02, CTRL-10)
**What:** Read `pipeline.yaml` (flat R1 id list), run each id in order. Zero hardcoded order.
```javascript
// Source: SHELL-BUILD-SPEC §5 ("pipeline.yaml just lists the step ids in R1 order; run all walks it")
function runAll(space, opts) {
  const ids = parsePipeline(opts.pipeline || 'pipeline.yaml'); // ordered id array
  for (const id of ids) runStep(id, space, opts);              // R1 order = file order
}
```

### Pattern 3: Zero-dep flat `pipeline.yaml` parser (CTRL-10)
**What:** Hand-parse a flat `steps:` YAML list — no YAML lib.
```javascript
// pipeline.yaml is exactly:
//   steps:
//     - 00-bet-compiler
//     - 01-collect
//     - ...
function parsePipeline(file) {
  const txt = require('fs').readFileSync(file, 'utf8');
  return txt.split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))     // list items only
    .map(l => l.slice(2).trim())
    .filter(Boolean);
}
// (If pipeline.json is chosen instead: return JSON.parse(...).steps — no parser.)
```

### Pattern 4: Preflight = named refusal (CTRL-03)
**What:** Every declared `reads[]` artifact must exist; a missing one is a NAMED refusal, never improvised. This is the single most load-bearing principle (P3 — the as-ran run "succeeded into a design built on nothing" because every stage improvised over nulls; §1.1).
```javascript
// Source: PART3 §8.1 + §3 principle P3 ("Contract-or-refuse")
function preflight(m, space) {
  const missing = (m.reads || [])
    .map(r => r.replace('{space}', space))
    .filter(p => !require('fs').existsSync(p));
  if (missing.length) {
    console.error(`REFUSE [${m.id}] preflight: missing input contract(s): ${missing.join(', ')}`);
    process.exit(3);   // named refusal, distinct exit; never continue
  }
}
```

### Pattern 5: Context assembly — agent never Reads the store (CTRL-05)
**What:** A script embeds the digest + corpus bytes into a context block; "P15-A3's bypass becomes structurally pointless: there is no file to Read." Mirror `funnel-analyzer-context.js` (it assembles `[DR bundle] + [cleaned body]` with explicit DATA boundaries for the orchestrator to paste). In Phase 2 the fixture's mock-emit reads the assembled block, proving the seam.
```javascript
// Source: PART3 §8.3; precedent engine/bricks/funnel-analyzer-context.js (read in-session)
function assembleContext(m, space) {
  // Phase 2: concatenate the manifest's declared reads[] bytes into one block.
  // Phase 3+ swaps in real digest/corpus assembly + inject-dr.js. Seam unchanged.
  return (m.reads || [])
    .map(r => r.replace('{space}', space))
    .map(p => `<<<DATA ${p}>>>\n${require('fs').readFileSync(p, 'utf8')}\n<<<END>>>`)
    .join('\n');
}
```

### Pattern 6: Spawn waves ≤5 (CTRL-06)
**What:** Chunk the manifest's `agents` count into waves of ≤5 (the 60–65-tool-use death is a platform fact the runner respects, §8.4). Fixture `agents:1` is one wave; the "agent" is a stub that mock-emits a valid-shaped artifact.
```javascript
// Source: PART3 §8.4 ("waves of ≤5 with incremental writes")
const WAVE_CAP = 5;
function spawnWaves(m, ctx, space) {
  const n = m.agents || 1;
  const outputs = [];
  for (let i = 0; i < n; i += WAVE_CAP) {
    const wave = Math.min(WAVE_CAP, n - i);
    for (let k = 0; k < wave; k++) outputs.push(mockEmit(m, space, i + k)); // Phase 2: stub emit
  }
  return outputs;
}
```

### Pattern 7: Validate EXPLICITLY — hooks don't fire in subagents (CTRL-07)
**What:** The single correctness landmine. Invoke the validator as an explicit orchestrator step. Use `route.js` (basename dispatch) when the manifest names no explicit validator; use `manifest.validator` when it does. Bounded re-spawn ≤2 then escalate.
```javascript
// Source: FIRING-MANIFEST §4 (CRITICAL) + PART3 P8 ("No hook-dependent enforcement")
const { spawnSync } = require('child_process');
function validate(m, outputs) {
  for (const out of outputs) {
    const validator = m.validator
      ? ['node', m.validator, out]                       // manifest-named (Phase 3 binds validate-*.js)
      : ['node', 'engine/hooks/route.js', out];          // basename dispatch (route.js → validate-*.js)
    const r = spawnSync(validator[0], validator.slice(1), { stdio: 'inherit' });
    if (r.status !== 0) return { ok: false, output: out, code: r.status }; // exit 2 = reject
  }
  return { ok: true, verdicts: outputs.map(o => ({ output: o, verdict: 'pass' })) };
}
```
> **route.js exit contract (verified):** exit 0 = pass; the dispatcher PROPAGATES the validator's non-zero exit (validators use exit 2 = reject). A basename with no rule passes silently (exit 0). The fixture artifact basename should either match a `route.js` rule (e.g. `space-map.json`) to exercise a real validator OR the fixture manifest should name `validator` explicitly. [VERIFIED: route.js L41-63, FIRING-MANIFEST §3]

### Pattern 8: Store+receipt — write-once, unique spawn-id (CTRL-08)
**What:** Use `space-version.js` to NAME a bumped space if needed (read-only), then `receipt-write.js` to write the receipt. The spawn-id MUST be unique per spawn — `receipt-write.js` REFUSES a colliding id (`exit 1`, no-overwrite-v1). A timestamp/wave-index suffix guarantees uniqueness within a step.
```javascript
// Source: PART3 §8.6 + receipt-write.js (write-once, L162-165) + space-version.js (read-only resolver)
const { execFileSync } = require('child_process');
function storeAndReceipt(m, space, verdict, opts) {
  const spawnId = `${m.id}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`; // UNIQUE
  execFileSync('node', [
    'engine/bricks/receipt-write.js',
    `--space=${space}`,
    `--spawn-id=${spawnId}`,
    `--step=${m.id}`,
    `--inputs=${(m.reads||[]).map(r=>r.replace('{space}',space)).join(',')}`,
    `--outputs=${(m.writes||[]).map(w=>w.replace('{space}',space)).join(',')}`,
    `--gate=${JSON.stringify({ step_gated: !!m.gate, decision: null })}`,
  ], { stdio: 'inherit' });
  return `runs/${space}/_receipts/${spawnId}.json`;
}
// no-overwrite NAMING (re-run a committed space): 
//   const next = execFileSync('node', ['engine/bricks/space-version.js', `--space=${base}`]).toString().trim();
//   // then store-scaffold.js --space=${next} if a fresh tree is wanted. Controller owns that decision.
```
> **Receipt shape (verified):** `{spawn_id, step, space, inputs_hash (sha256 of sorted input bytes), inputs[], outputs[], validator_verdicts[] (default [] — Phase 5 fills), gate, ts}`. Phase 2 default `gate = {step_gated:bool, decision:null}`; Phase 5 (VALID-05) populates real decisions/verdicts. [VERIFIED: receipt-write.js L138-148]

### Pattern 9: Operator gate — block-and-log, auto-approve in smoke (CTRL-09)
**What:** If `manifest.gate === true`, the runner blocks on a sign-off artifact. `--smoke`/`--auto-approve` records an auto-approval; the decision goes into the receipt `gate` field. "Deferred" is a logged state, not a silent skip (§8.7 / P9 — the as-ran's never-completed verdict checkpoint is the named lesson).
```javascript
// Source: PART3 §8.7 + P9 ("Operator decision points are pipeline stages")
function operatorGate(m, receiptPath, opts) {
  if (!m.gate) return;                              // non-gate step: pass
  const decision = opts.smoke ? 'auto-approved-smoke' : awaitSignoff(m, receiptPath);
  // record into the receipt's gate field (never silent). Phase 5 (VALID-05) formalizes the write-back.
  console.log(`GATE [${m.id}] ${decision}`);
}
```

### Anti-Patterns to Avoid
- **Relying on the PostToolUse hook to validate a spawn's output.** Hooks do NOT fire in subagents (FIRING-MANIFEST §4); this exact gap silently collapsed the as-ran run's validate-on-write story (§1.1 / CC-A1). ALWAYS invoke the validator as an explicit orchestrator step.
- **Reusing a spawn-id across spawns.** `receipt-write.js` is write-once and `exit 1`s on collision — a re-spawn within a step with the same id breaks the run. Mint a unique id per spawn.
- **Re-implementing sha256 / sanitization / scaffolding / versioning.** All exist as bricks (CTRL-12). The controller is pure ordering glue. Re-pasting `sanitizePathSegment` instead of `require`-ing it is a flagged violation.
- **Hardcoding step order in the controller.** R1 order is DATA (`pipeline.yaml`). Reordering must be a one-line config edit (CTRL-10), so the controller must have zero baked-in order.
- **Improvising past a missing input.** Preflight refuses by name (P3). The whole shell exists to prove the inverse never happens again.
- **Leaving a committed `runs/<space>/` after the smoke harness.** An arbitrary `runs/_*` dir is NOT gitignored (verified). Use `runs/_fixture/...` (whitelisted) or `rm -rf` a temp space at start and end.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| sha256 inputs_hash + receipt write | A `crypto.createHash` block in the controller | `engine/bricks/receipt-write.js` (subprocess) | Already write-once, sorted-input, traversal-safe, sidecar-logged; CTRL-12 forbids rewriting. [VERIFIED] |
| No-overwrite space naming | A `runs/` scan + `-vN` regex | `engine/bricks/space-version.js` | Read-only resolver, regex-escapes dotted bases, the exact STORE-02 contract. [VERIFIED] |
| Slot-tree creation | `mkdirSync` loops + stub writes | `engine/bricks/store-scaffold.js` | Idempotent, no-overwrite, owns the canonical §6/R1 slot list. [VERIFIED] |
| `--space`/`--step` sanitization | A regex in the controller | `lib/fanout-path.js#sanitizePathSegment` (`require` it) | Traversal-safe `[a-z0-9._-]`, dot-run stripping; every brick imports it. [VERIFIED] |
| basename→validator dispatch | An `if/else` validator map | `engine/hooks/route.js` (subprocess) | Exists, propagates exit codes, is the documented explicit-dispatch path. [VERIFIED] |
| YAML parsing | `js-yaml` / a full YAML parser | A 6-line flat-list splitter (or `pipeline.json` + `JSON.parse`) | Zero-dep is locked; the file is a flat `steps:` list. [CITED: CONTEXT.md] |

**Key insight:** Phase 2 writes exactly ONE new behavioral unit — the ordering of 7 phases. Everything a phase *does* already exists as a brick or hook. If the controller contains a hash, a sanitizer, a `-vN` scan, or a slot list, it is rewriting glue and violating CTRL-12. The correct controller is short: load → 7 ordered delegations → return.

## Runtime State Inventory

> This is a greenfield assembly phase (new controller + new fixture), NOT a rename/refactor. No existing runtime state is migrated. Recorded for completeness:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — verified: no `pipeline.yaml`, `run-controller*`, `run.js/sh` exist (`find` returned empty). The controller is new code. | None |
| Live service config | None — the controller drives local scripts/subprocesses only; no external service. | None |
| OS-registered state | None — no scheduler/daemon registration; the entrypoint is a manual `run` command. | None |
| Secrets/env vars | None new. `inject-*-dr.js` honors `$DR_DIR` but DR injection is Phase 3+ content, not wired this phase. | None |
| Build artifacts | None — stdlib-only, no compile step, no package to install. `engine/package.json` unchanged (no new dep). | None |

## Common Pitfalls

### Pitfall 1: Validate phase relies on the PostToolUse hook
**What goes wrong:** The controller spawns an agent (a subagent), the agent writes its output, and the controller assumes `route.js` fired via the `Write` hook and validated it. It did NOT — hooks do not fire in subagents.
**Why it happens:** The repo registers `route.js` as a PostToolUse hook (`.claude/settings.json`), so it *looks* automatic. FIRING-MANIFEST §4 and PART3 §1.1 document that this exact assumption sank the as-ran run.
**How to avoid:** The Validate phase invokes the validator as an explicit `spawnSync` orchestrator step (Pattern 7). The PostToolUse hook stays as belt-and-suspenders for main-loop writes only; nothing depends on it (P8).
**Warning signs:** A green run with zero validator stderr and no validator subprocess in the plan-print; receipts with empty `validator_verdicts` on a step that should have validated.

### Pitfall 2: Spawn-id collision silently breaks the receipts chain
**What goes wrong:** A step re-spawns (the ≤2 retry) or has multiple agents in a wave, all writing receipts with the same id → `receipt-write.js` `exit 1`s, the chain breaks, the run aborts (or worse, the error is swallowed).
**Why it happens:** `receipt-write.js` is intentionally write-once (no-overwrite-v1); a colliding id is "an orchestrator bug to surface" by design (L158-165).
**How to avoid:** Mint a unique spawn-id per spawn — `<step>-<ts>-<rand>` or `<step>-w<wave>-<n>-<attempt>`. The retry loop must bump the suffix each attempt.
**Warning signs:** `receipt-write: ... refusing to overwrite committed provenance` in stderr; fewer receipts than spawns.

### Pitfall 3: The smoke harness pollutes the committed tree
**What goes wrong:** The harness runs `run all --space=ctrlsmoke`, leaves `runs/ctrlsmoke/` (and its committed `_receipts/*.json`) on disk, and `git add` sweeps it into the next commit.
**Why it happens:** `runs/` is NOT wholesale-gitignored — only `_index.json`, `_*-log.txt`, `_*.agent.json`, `_caption_*`, and specific creds are. An arbitrary `runs/_ctrlsmoke` dir is NOT ignored (verified in-session: `git check-ignore` → NOT IGNORED). Only the exact `runs/_fixture/**` path is whitelisted-and-ignored.
**How to avoid:** Two clean options — (a) place the fixture run under `runs/_fixture/...` (git-whitelisted, so even committed it's the intended fixture) and target the harness there; or (b) `rm -rf "runs/${SPACE}"` at start AND end of the harness, exactly as `store-smoke.sh` does (`rm -rf "runs/${SPACE}"` L33). The build task MUST leave a clean `git status` for `runs/`.
**Warning signs:** `git status` shows untracked `runs/<smoke-space>/...` after the harness runs.

### Pitfall 4: Bricks invoked as modules instead of subprocesses
**What goes wrong:** The controller `require('./receipt-write')` expecting a function; the brick's top-level IIFE runs `process.exit()` on import and the controller dies.
**Why it happens:** Every store brick is a CLI script (arg-parse → IIFE main → `process.exit`), NOT a module with `module.exports` of functions. `route.js` is the only one with no exports either.
**How to avoid:** Invoke bricks via `spawnSync`/`execFileSync('node', [brick, ...flags])` — the same way `route.js` calls validators (L41-50). Capture stdout for `space-version.js` (it prints the next name).
**Warning signs:** Unexpected `process.exit` during controller startup; `undefined is not a function` on a brick import.

### Pitfall 5: Hardcoding the manifest path / step order
**What goes wrong:** The loader hardcodes `engine/manifests/<id>.json` or the controller bakes the 0..10 order, so the fixture run (which needs a different `pipeline.yaml` + manifest dir) can't be driven, and CTRL-10 (reorder = config edit) is violated.
**How to avoid:** Parameterize the pipeline file and manifest dir (`opts.pipeline`, `opts.manifestDir`) with sane defaults. `run all --pipeline=runs/_fixture/pipeline/pipeline.yaml --manifest-dir=...` drives the fixture; the real run uses the defaults. Order comes only from the file.
**Warning signs:** The fixture harness can't point the controller at fixture manifests without editing controller source.

## Code Examples

### The §5 manifest data shape (what `loadManifest` returns) (CTRL-11)
```yaml
# Source: SHELL-BUILD-SPEC §5 (verbatim Step-2 example)
id: 02-funnel-analysis
reads:
  - runs/{space}/brands.json
  - runs/{space}/dumps/
writes:
  - runs/{space}/funnels/
  - runs/{space}/ad-volume-aggregate.json
scripts:
  pre:  [funnel-assemble.js]
  post: [ad-volume-rollup.js]
prompt: prompts/02-funnel-analysis.md   # ONE slot now; 1 or N agents later — wiring unchanged
agents: 1                               # bump when the prompt is split (Job 6); wiring unchanged
validator: validators/02.js             # presence + top-level shape now
gate: false                             # operator sign-off at this step?
```
> Recommended Phase-2 fixture form is the SAME fields as `.json` (zero-dep parse). `{space}` is the substitution token the controller replaces with the actual space. [CITED: SHELL-BUILD-SPEC §5]

### Minimal fixture manifest (Phase-2 acceptance) — recommended `.json`
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
> `writes` a `space-map.json` so `route.js` dispatches to a REAL validator (`validate-classifier.js`) — exercising Pattern 7 end-to-end. A second fixture manifest with `gate:true` exercises Pattern 9's block-and-log. The mock-emit must write a `space-map.json` that PASSES `validate-classifier.js` (or the manifest sets `validator:null` and the harness asserts the no-rule pass path). [ASSUMED — see A2: the cleanest fixture exercises one validator + one gate; planner picks the exact 1–3 split]

### Mock-emit stub (Phase-2 fixture "agent")
```javascript
// In STUB/fixture mode the "agent" writes a minimal valid-shaped artifact (hardcoded sample
// values fine) so the loop runs without a real prompt. Mirrors SHELL-BUILD-SPEC §8 mock-emit.
function mockEmit(m, space, idx) {
  const out = (m.writes[0] || '').replace('{space}', space);
  require('fs').writeFileSync(out, JSON.stringify({ _stub: true, step: m.id }, null, 2) + '\n');
  return out;
}
```

### Harness idiom to mirror (controller-smoke.sh skeleton)
```bash
# Source: engine/contracts/store-smoke.sh (read in-session) — the project's smoke idiom
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root
SPACE="_ctrlsmoke"                      # underscore-prefixed scratch; rm -rf'd both ends
FAIL=0; ok(){ echo "   PASS: $1"; }; bad(){ echo "   FAIL: $1"; FAIL=1; }
rm -rf "runs/${SPACE}"                  # clean start (gitignore: NOT auto-ignored)
# ... run controller, assert per CTRL id (see Validation Architecture) ...
rm -rf "runs/${SPACE}"                  # clean end — leave git status clean
if [ "$FAIL" -eq 0 ]; then echo "CONTROLLER-SMOKE: ALL ASSERTS PASS ✓"; exit 0; else exit 1; fi
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Orchestrator trusts itself; validate-on-write via hooks | De-trusted orchestrator; explicit script validators with logged receipts; refuse-gates around every spawn | PART3 §8 / P8 (post as-ran retro) | The Validate phase MUST call validators explicitly. The whole §8 loop exists because the trusted-orchestrator run "succeeded into a design built on nothing." |
| Step order baked into code / slash-commands | Step order is DATA (`pipeline.yaml` flat list); reorder = config edit | SHELL-BUILD-SPEC §2 / R1 topology | CTRL-10. The controller has zero hardcoded order; R1 (deep-analysis-first, §1.5) is the current canonical order. |
| §4.1 step map | R1 topology (§1.5/§1.6) supersedes §4.1 through the NTP pick | PART3 §1.5 (operator, post-PART-3) | `pipeline.yaml` uses the R1 order (0 Bet → 1 Collect → 2 Funnel Analysis → 3 Space Map → 4 VOC Market → 5 Market Selection → 6 VOC Deep + Awareness → 7 Architect + Auditor → 8 Copywriter ⇄ Chief → 9 Asset Classify → 10 Adversarial Re-review), NOT §4.1. |
| Agent Reads shared state from a file | Context-assembly script embeds bytes; "there is no file to Read" | PART3 §8.3 / P15-A3 | CTRL-05. The fixture proves the seam even though real digest assembly is Phase 3+. |

**Deprecated/outdated:**
- The §4.1 front-half map — superseded by R1 (§1.5 line 67) through the NTP pick. Use §1.5/§1.6 for `pipeline.yaml` order.
- Hook-dependent validation — dead by P8; explicit invocation only.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Fixture manifests are easiest as `.json` (zero-dep `JSON.parse`) while `pipeline.yaml` stays a hand-parsed flat list. The §5 example is YAML; planner may prefer YAML manifests for spec-literalness. | Standard Stack / Code Examples | LOW — both are zero-dep; if YAML manifests are chosen, add a small nested-YAML reader or keep manifests flat. Phase 3 inherits whichever convention is set. A `.json` manifest matches the engine's existing `.json` fixtures. |
| A2 | The cleanest fixture exercises one real validator (via a `space-map.json` write → `route.js` → `validate-classifier.js`) + one `gate:true` step. The exact 1–3-manifest split is the planner's call. | Code Examples / Validation Architecture | LOW — any fixture that drives all 7 phases satisfies the acceptance; this is an optimization for coverage, not a correctness requirement. The mock-emit must produce an artifact the chosen validator passes (else set `validator:null` and assert the pass-path). |
| A3 | The `run` entrypoint is a thin shim (`node engine/bricks/run-controller.js <step\|all> --space=<s>`), not a separately-installed binary. | Recommended Project Structure | LOW — CONTEXT explicitly says "wired to a thin `run` entrypoint." Shape is discretionary. |
| A4 | `pipeline.yaml` lives at repo root (or `engine/`); the fixture `pipeline.yaml` lives under `runs/_fixture/pipeline/`. | Recommended Project Structure | LOW — path is parameterized (`opts.pipeline`); only the default location is assumed. |

**Note:** No assumptions touch correctness-critical behavior. The 7-phase order, the validator-must-be-explicit rule, the write-once/unique-spawn-id rule, and the no-overwrite naming are all VERIFIED against source, not assumed.

## Open Questions

1. **Does the fixture's mock-emit need to satisfy a REAL validator, or is `validator:null` (route.js no-rule pass) enough to prove Pattern 7?**
   - What we know: `route.js` passes (exit 0) on any basename without a rule; it propagates a real validator's exit otherwise. A `space-map.json` write hits `validate-classifier.js`.
   - What's unclear: whether the planner wants the fixture to exercise a real validator (stronger proof, but the mock-emit must produce a `validate-classifier.js`-passing `space-map.json`, which has non-trivial required fields) or just prove the explicit-invocation wiring with a no-rule basename.
   - Recommendation: do BOTH — one fixture manifest with `validator:null` (proves explicit-call wiring + route.js pass-path) and, if cheap, one writing a basename `route.js` recognizes (proves real dispatch). If the real-validator artifact is expensive to mock, assert the wiring with `validator:null` + a unit assert that `route.js` propagates a known-bad fixture's exit 2. This is the planner's coverage call.

2. **Where does the no-overwrite-versioning re-run decision actually trigger in Phase 2?**
   - What we know: `space-version.js` NAMES the next free space; the controller decides whether to scaffold/run there.
   - What's unclear: SMOKE-01 (`run all --space=smoke`) implies a fixed `smoke` space, not a bumped one — so the bump path may only need a unit assert (resolver returns `<space>-v2` after a scaffold), not a full re-run drive, in Phase 2.
   - Recommendation: assert CTRL-08's no-overwrite NAMING with a `space-version.js` unit check in the harness (mirror `store-smoke.sh` STORE-02), and have the controller wire the resolver in but only ACT on it on an explicit re-run flag. Don't over-build a versioned-re-run drive this phase.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | The controller runtime | ✓ | v20.20.0 | — |
| `node:fs`/`path`/`child_process`/`crypto` | All phases | ✓ | stdlib | — |
| bash | `controller-smoke.sh` harness | ✓ | system | — (store-smoke.sh runs on the same) |
| Phase-1 store bricks | Phases 5/6/8 of the loop | ✓ | in-repo, 14/14 green | — |
| `route.js` + `validate-*.js` | Validate phase | ✓ | in-repo | — |
| 11 REAL step manifests | (NOT required this phase) | ✗ | Phase 3 | Fixture manifest set (recommended approach A) |
| Real prompts / mock emits | (NOT required this phase) | ✗ | Phase 4 | Fixture mock-emit stub |

**Missing dependencies with no fallback:** None — every Phase-2 dependency is present.
**Missing dependencies with fallback:** The real manifests/prompts (Phase 3/4) are intentionally absent; the fixture manifest set + mock-emit is the designed Phase-2 fallback that proves the loop without them.

## Validation Architecture

> `workflow.nyquist_validation` config not located in-session; defaulting to ENABLED per the spec ("absent = enabled"). The acceptance harness `engine/contracts/controller-smoke.sh` is the project's mechanical proof; it mirrors `store-smoke.sh`. No JS test framework exists — **bash smoke is the project's idiom** (`h6-*.sh`, `store-smoke.sh`), so the Validation Architecture is the harness, one named assert per CTRL id.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | bash smoke harness (project idiom — NOT jest/vitest/pytest) |
| Config file | none — each harness is a standalone `engine/contracts/*.sh` |
| Quick run command | `bash engine/contracts/controller-smoke.sh` (the new harness) |
| Full suite command | `bash engine/contracts/h6-all.sh` (existing engine suite; controller-smoke.sh added alongside) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command / Assert | File Exists? |
|--------|----------|-----------|-------------|-------------|
| CTRL-01 | single step runs all 7 phases | smoke | `run <fx-step> --space=_ctrlsmoke --smoke` exits 0; plan-print shows 7 phase markers; a receipt lands | ❌ Wave 0 |
| CTRL-02 | `run all` walks pipeline in order | smoke | `run all --pipeline=<fixture> --space=_ctrlsmoke --smoke` exits 0; receipts appear in fixture-id order | ❌ Wave 0 |
| CTRL-03 | preflight named refusal on missing input | smoke (negative) | run a fixture step with a `reads[]` artifact deleted → exit≠0 + stderr contains `REFUSE` + the missing path name | ❌ Wave 0 |
| CTRL-04 | plan-print declares DAG before running | smoke | capture stdout; assert the plan block (pre/spawn/post/validator/gate) prints BEFORE any emit/receipt line | ❌ Wave 0 |
| CTRL-05 | context assembled, agent never Reads store | smoke | assert the assembled context block contains the `reads[]` bytes (the mock-emit consumed the block, not the file) | ❌ Wave 0 |
| CTRL-06 | spawn waves ≤5 | unit | feed a fixture manifest `agents:6` → assert 2 waves (5+1) in plan/log; no wave >5 | ❌ Wave 0 |
| CTRL-07 | validator invoked EXPLICITLY; reject→re-spawn≤2→escalate | smoke + negative | (a) assert a validator subprocess ran (not a hook); (b) feed a deliberately-bad emit → assert ≤2 re-spawns then an escalate line + exit≠0 | ❌ Wave 0 |
| CTRL-08 | no-overwrite version + receipt write-once, unique id | smoke + unit | (a) assert `_receipts/<id>.json` exists with required keys + sha256 `inputs_hash`; (b) `space-version.js --space=_ctrlsmoke` returns `_ctrlsmoke-v2` after scaffold; (c) re-write same spawn-id → exit 1 | ❌ Wave 0 |
| CTRL-09 | gate blocks/auto-approves, logged never silent | smoke | run a `gate:true` fixture step with `--smoke` → assert `GATE [...] auto-approved-smoke` logged AND receipt `gate.step_gated===true` | ❌ Wave 0 |
| CTRL-10 | pipeline order = config edit, no code | unit | reorder the fixture `pipeline.yaml` → assert receipt order follows the file (no controller edit) | ❌ Wave 0 |
| CTRL-11 | manifest loader reads §5 shape | unit | `loadManifest(fx-id)` returns an object with `reads/writes/scripts/prompt/agents/validator/gate` keys | ❌ Wave 0 |
| CTRL-12 | assembled from bricks, not rewritten | static | grep `run-controller.js`: NO `createHash`, NO inline `sanitize` regex, NO `-v(\d+)` scan, NO slot-list literal; DOES `require('./lib/fanout-path')` + spawn `receipt-write.js`/`space-version.js`/`route.js` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `bash engine/contracts/controller-smoke.sh` (the new harness; fast, self-cleaning)
- **Per wave merge:** `bash engine/contracts/h6-all.sh` + `bash engine/contracts/store-smoke.sh` (regression guard — controller must not break the store layer)
- **Phase gate:** `controller-smoke.sh` ALL ASSERTS PASS + clean `git status` for `runs/` before `/gsd-verify-work`

### Wave 0 Gaps
- [ ] `engine/contracts/controller-smoke.sh` — covers CTRL-01..12 (one named assert per id; mirror `store-smoke.sh`)
- [ ] `runs/_fixture/pipeline/pipeline.yaml` — fixture flat id list (drives CTRL-02/10)
- [ ] `runs/_fixture/pipeline/manifests/*.json` — 1–3 minimal §5-shaped manifests (one with `validator`/recognized basename, one `gate:true`, optionally one `agents:6` for the wave assert)
- [ ] `engine/bricks/run-controller.js` — the unit under test (must exist before the harness asserts pass)
- [ ] Framework install: none — bash + node stdlib already present
- [ ] (negative fixtures) a known-bad emit + a missing-input scenario for CTRL-03 / CTRL-07 — can be inline in the harness (`rm` an input; point at a bad-emit manifest), mirroring `store-smoke.sh`'s inline mutation pattern

## Security Domain

> The PMF firing layer DOES enforce security (`security_enforcement` effectively on — `guard-marketing.js` firewall + `sanitizePathSegment` traversal guards exist). The controller's surface is local-only (no network, no untrusted external input beyond CLI flags), so the relevant categories are input validation + path traversal.

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V2 Authentication | no | No auth surface — local CLI |
| V3 Session Management | no | No sessions |
| V4 Access Control | partial | `guard-marketing.js` PreToolUse firewall blocks writes to operator-owned paths (`off-limits.json`) — already registered; the controller writes only under `runs/<space>/` |
| V5 Input Validation | **yes** | `--space`/`--step`/`--spawn-id` → `sanitizePathSegment` (`[a-z0-9._-]`, strips `/` and `..`) BEFORE any `path.join`. Reuse, do not re-paste. |
| V6 Cryptography | yes (delegated) | sha256 `inputs_hash` is `node:crypto` inside `receipt-write.js` — never hand-rolled in the controller |

### Known Threat Patterns for the controller
| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| Path traversal via `--space=../evil` | Tampering / Elevation | `sanitizePathSegment` on every flag-derived segment before `path.join` — proven by `store-scaffold.js`'s `--space='../evil'` smoke assert; the controller inherits it by `require`-ing the same lib |
| Untrusted manifest path injecting a brick path | Tampering | Manifest `scripts`/`validator` paths are repo-authored (Phase 3, operator-owned), not user input; still, invoke via `execFileSync('node', [path])` (no shell), never `exec(string)` — `route.js` precedent (`spawnSync`, args array) |
| Silent overwrite of committed provenance | Repudiation | `receipt-write.js` write-once refusal + unique spawn-id (Pattern 8) |
| Improvising past a missing/null input | Tampering (corrupt downstream) | Preflight named refusal (P3, Pattern 4) — the core shell invariant |

## Sources

### Primary (HIGH confidence — read in-session)
- `basis/build-base/architecture/PART3--architecture-design.md` §8 (lines 445-457, the 7-phase loop VERBATIM), §1.5/§1.6 (R1 order), §1.1 (the as-ran failure modes), §3 (principles P1-P9, esp. P3/P8/P9) — the authoritative spec.
- `basis/build-base/SHELL-BUILD-SPEC.md` §2 (artifact-grain), §3 (run-controller = the heart), §5 (manifest-as-data shape), §8 (mock-mode e2e acceptance), §9 (build order — step 2 = this phase), §11 (DoD).
- `engine/FIRING-MANIFEST.md` §3 (route.js dispatch table), §4 (CRITICAL: hooks don't fire in subagents) — the validate-explicitly mandate.
- `engine/hooks/route.js`, `engine/bricks/store-scaffold.js`, `engine/bricks/space-version.js`, `engine/bricks/receipt-write.js`, `engine/bricks/lib/fanout-path.js`, `engine/bricks/funnel-analyzer-context.js` (context-assembly precedent), `engine/contracts/store-smoke.sh` (harness idiom) — all read in full.
- `.planning/REQUIREMENTS.md` (CTRL-01..12 exact text), `.planning/ROADMAP.md` (Phase 2 goal + success criteria), `.planning/phases/02-run-controller-pipeline-spine/02-CONTEXT.md` (locked decisions).
- `/home/kyu3/PMF/CLAUDE.md` (no-overwrite-v1, artifact-grain wiring, reuse-don't-rewrite, scope-guard).
- In-session verifications: `node --version` → v20.20.0; `engine/package.json` deps = playwright only; `git check-ignore` confirming arbitrary `runs/_*` is NOT auto-ignored while `runs/_fixture/**` IS whitelisted; `find` confirming no existing `pipeline.yaml`/controller.

### Secondary (MEDIUM confidence)
- None — every claim is grounded in an in-session file read or command.

### Tertiary (LOW confidence)
- None.

## Project Constraints (from CLAUDE.md)

- **One job per agent; deterministic jobs are scripts/hooks, not agents.** The controller IS a script orchestrating scripts — correct by construction. The 7 phases are script-or-spawn; no phase is itself "an agent."
- **no-overwrite-v1:** committed run outputs / receipts are never mutated in place; a re-run writes a NEW versioned location. Enforced via write-once `receipt-write.js` + read-only `space-version.js`; the guard HOOK is explicitly DEFERRED (convention only this phase).
- **Wire at the artifact grain, not the prompt grain:** only inter-step artifact flow is deterministic; step internals are black boxes. The controller never touches a step's internal prompt division.
- **Reuse engine bricks, don't rewrite:** assemble + order per the blueprint (CTRL-12). The controller re-implements no hash/sanitize/scaffold/version logic.
- **Scope guard — Steps 0–10 only; do not thread Phase B.** `pipeline.yaml` lists 0..10 in R1 order; nothing more.
- **Precedence:** `standards/` → build-base architecture (PART0/PART3/PART1) → built SKILL → as-ran (reference only). Architecture wins on conflict — so PART3 §8 / SHELL-BUILD-SPEC govern over any as-ran orchestrator pattern.
- **Ask before committing/pushing** (project + user CLAUDE.md) — the build task writes files but does not auto-commit/push without the operator's go.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — stdlib-only, runtime + zero-dep verified in-session; every brick read.
- Architecture (7-phase loop): HIGH — copied verbatim from PART3 §8 + SHELL-BUILD-SPEC §3; all 5 reuse bricks read line-by-line.
- Pitfalls: HIGH — each traces to a verified source (FIRING-MANIFEST §4, receipt-write.js write-once, in-session gitignore check, brick-is-IIFE structure).
- Fixture/acceptance design: MEDIUM-HIGH — approach A is the recommended-and-spec-aligned path; the exact 1–3-manifest split + whether the fixture exercises a real validator is the planner's coverage call (Open Questions 1, Assumptions A1/A2).

**Research date:** 2026-06-27
**Valid until:** 2026-07-27 (stable — internal architecture spec + in-repo bricks; no fast-moving external deps. Re-check only if PART3 §8 or the Phase-1 brick contracts change.)
