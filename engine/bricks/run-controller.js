'use strict';
// run-controller.js — the PART3 §8 SEVEN-PHASE run-controller (the one new behavioral unit
// of Phase 2). It is PURE ORDERING GLUE: loadManifest(id) → 7 ordered delegations → return.
// Every phase's WORK already exists as a Phase-1 brick or a hook; this file owns only the
// ORDER. It re-implements NO hashing, sanitization, scaffolding, or versioning (CTRL-12).
//
// The 7 phases (PART3 §8, lines 449-455, verbatim order):
//   1 Preflight        — input contracts checked; missing → NAMED refusal, never improvise (CTRL-03)
//   2 Plan-print       — declare the step DAG BEFORE anything runs (CTRL-04)
//   3 Context-assembly — embed reads[] bytes; the agent never Reads shared state (CTRL-05)
//   4 Spawn            — agent waves of ≤5 with incremental writes (CTRL-06)
//   5 Validate         — EXPLICIT orchestrator call (hooks DON'T fire in subagents); reject →
//                        bounded re-spawn ≤2 → escalate (CTRL-07)
//   6 Store+receipt    — no-overwrite naming + write-once receipt, UNIQUE spawn-id (CTRL-08)
//   7 Operator-gate    — block on a sign-off artifact; --smoke auto-approves; logged, never silent (CTRL-09)
//
// REUSE (CTRL-12): sanitizePathSegment is REQUIRED from ./lib/fanout-path (the only require of
// a brick — it IS an exported function). The actual bricks (receipt-write.js, space-version.js,
// store-scaffold.js) and the validator dispatcher (route.js) are IIFE-with-process.exit CLI
// scripts — they are invoked as SUBPROCESSES (spawnSync/execFileSync), never `require`d.
//
// CRITICAL CONSTRAINTS (verified — see 02-RESEARCH.md):
//   - Hooks do NOT fire in subagents (FIRING-MANIFEST §4) → the Validate phase invokes the
//     validator EXPLICITLY as an orchestrator subprocess; nothing relies on the PostToolUse hook.
//   - receipt-write.js is WRITE-ONCE → a colliding spawn-id is exit 1. Mint a UNIQUE spawn-id
//     per spawn so re-spawns (the ≤2 retry) never collide.
//   - Zero hardcoded step order → order comes ONLY from pipeline.yaml (CTRL-10).
//
// Usage:
//   node engine/bricks/run-controller.js <step-id> --space=<s> [--smoke] [--manifest-dir=<d>]
//   node engine/bricks/run-controller.js all --space=<s> [--smoke] [--pipeline=<f>] [--manifest-dir=<d>]
//   node engine/bricks/run-controller.js --print-manifest=<id> [--manifest-dir=<d>]
//   node engine/bricks/run-controller.js --help

const fs   = require('fs');
const path = require('path');
const { spawnSync, execFileSync } = require('child_process');

const { sanitizePathSegment } = require('./lib/fanout-path');

const WAVE_CAP = 5;                       // PART3 §8.4 — spawn waves of ≤5 (the platform fact)
const PREFLIGHT_EXIT = 3;                 // distinct named-refusal exit for a missing input (CTRL-03)
const DEFAULT_PIPELINE = 'pipeline.yaml';
const DEFAULT_MANIFEST_DIR = 'engine/manifests';   // production default; harness overrides w/ fixture dir

// Brick / hook paths (subprocess targets — invoked via spawnSync/execFileSync, never required).
const RECEIPT_WRITE = 'engine/bricks/receipt-write.js';
const SPACE_VERSION = 'engine/bricks/space-version.js';
const STORE_SCAFFOLD = 'engine/bricks/store-scaffold.js';
const ROUTE = 'engine/hooks/route.js';

// The §5 manifest keys every loaded manifest must carry (CTRL-11).
const MANIFEST_KEYS = ['id', 'reads', 'writes', 'scripts', 'prompt', 'agents', 'validator', 'gate'];

// ===========================================================================
// CLI flag-parse — copy store-scaffold.js L40-44 verbatim (--flag=value).
// ===========================================================================
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

// Positional argv[2] — read BEFORE the flag parse matters: 'all' | '<step-id>' (route.js L32 idiom).
const positional = args.filter(a => !a.startsWith('--'));
const target = positional[0];

// Normalized run options shared by every phase.
function runOpts() {
  return {
    smoke: !!(opts.smoke || opts['auto-approve']),
    pipeline: (typeof opts.pipeline === 'string') ? opts.pipeline : DEFAULT_PIPELINE,
    manifestDir: (typeof opts['manifest-dir'] === 'string') ? opts['manifest-dir'] : DEFAULT_MANIFEST_DIR,
    rerun: !!opts.rerun,
  };
}

// ===========================================================================
// CTRL-11 — loadManifest(id, dir): read the §5-shaped manifest as data.
// ===========================================================================
function loadManifest(id, dir) {
  const file = path.join(dir, id + '.json');
  let raw;
  try {
    raw = fs.readFileSync(file, 'utf8');
  } catch (e) {
    console.error(`REFUSE [${id}] manifest not found: ${file}`);
    process.exit(1);
  }
  let m;
  try {
    m = JSON.parse(raw);
  } catch (e) {
    console.error(`REFUSE [${id}] manifest is not valid JSON: ${file} (${e.message})`);
    process.exit(1);
  }
  // Named refusal on a missing §5 key — never improvise a manifest shape.
  for (const k of MANIFEST_KEYS) {
    if (!(k in m)) {
      console.error(`REFUSE [${id}] manifest missing key: ${k} (${file})`);
      process.exit(1);
    }
  }
  return m;
}

// ===========================================================================
// CTRL-10 — parsePipeline(file): zero-dep flat `steps:` list splitter. No hardcoded order.
// ===========================================================================
function parsePipeline(file) {
  return fs.readFileSync(file, 'utf8').split('\n')
    .map(l => l.trim())
    .filter(l => l.startsWith('- '))
    .map(l => l.slice(2).trim())
    .filter(Boolean);
}

// ===========================================================================
// Phase 1 — Preflight (CTRL-03): every reads[] must exist; missing → named refusal, exit 3.
// ===========================================================================
function preflight(m, space) {
  console.log(`PREFLIGHT [${m.id}] checking ${(m.reads || []).length} input contract(s)`);
  const missing = (m.reads || [])
    .map(r => r.replace('{space}', space))
    .filter(p => !fs.existsSync(p));
  if (missing.length) {
    console.error(`REFUSE [${m.id}] preflight: missing input contract(s): ${missing.join(', ')}`);
    process.exit(PREFLIGHT_EXIT);   // distinct exit; NEVER continue past a missing input (P3)
  }
}

// ===========================================================================
// Phase 2 — Plan-print (CTRL-04): declare the DAG BEFORE any spawn/store line.
// Body lines stay lowercase so they never match the harness's case-sensitive /SPAWN|STORE/.
// ===========================================================================
function planPrint(m) {
  const pre  = ((m.scripts && m.scripts.pre)  || []).join(', ') || '(none)';
  const post = ((m.scripts && m.scripts.post) || []).join(', ') || '(none)';
  const validator = m.validator ? m.validator : 'route.js dispatch (by basename)';
  console.log(`=== PLAN [${m.id}] ===`);
  console.log(`  pre-scripts : ${pre}`);
  console.log(`  spawn       : ${m.agents || 1} agent(s) (waves of <=${WAVE_CAP})`);
  console.log(`  post-scripts: ${post}`);
  console.log(`  validator   : ${validator}`);
  console.log(`  gate        : ${m.gate ? 'operator sign-off required' : 'none'}`);
}

// ===========================================================================
// Phase 3 — Context-assembly (CTRL-05): embed each reads[] file's bytes in one block.
// Mirrors funnel-analyzer-context.js — the agent receives bytes, not a file to Read.
// ===========================================================================
function assembleContext(m, space, opts) {
  const parts = (m.reads || [])
    .map(r => r.replace('{space}', space))
    .map(p => `<<<DATA ${p}>>>\n${fs.readFileSync(p, 'utf8')}\n<<<END>>>`);
  const block = parts.join('\n');
  if (opts && opts.smoke) {
    console.log(`CONTEXT [${m.id}] assembled ${Buffer.byteLength(block, 'utf8')} bytes from ${parts.length} read(s)`);
  }
  return block;
}

// ===========================================================================
// Phase 4 — Spawn (CTRL-06): chunk agents into waves of ≤5; each agent mock-emits a
// valid-shaped stub artifact to writes[0]. The `attempt` arg feeds the unique spawn-id.
// ===========================================================================
function mockEmit(m, space) {
  const out = (m.writes && m.writes[0] || '').replace('{space}', space);
  if (!out) {
    console.error(`REFUSE [${m.id}] spawn: manifest declares no writes[0] to emit to`);
    process.exit(1);
  }
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, JSON.stringify({ _stub: true, step: m.id }, null, 2) + '\n');
  return out;
}

function spawnWaves(m, ctx, space, attempt) {
  const n = m.agents || 1;
  const outputs = [];
  let wave = 0;
  for (let i = 0; i < n; i += WAVE_CAP) {
    wave++;
    const size = Math.min(WAVE_CAP, n - i);
    console.log(`SPAWN [${m.id}] wave ${wave} (${size} agents)`);
    // The fixture stub agents all write the same declared output slot; the last write wins.
    // (Phase 3+ swaps the stub for a real spawn; the wave-chunking seam is unchanged.)
    for (let k = 0; k < size; k++) {
      const out = mockEmit(m, space);
      if (!outputs.includes(out)) outputs.push(out);
    }
  }
  return outputs;
}

// ===========================================================================
// Phase 5 — Validate (CTRL-07): invoke the validator EXPLICITLY as an orchestrator
// subprocess (hooks DON'T fire in subagents). manifest.validator if set, else route.js
// basename dispatch. Non-zero exit = reject (route.js propagates the validator's exit 2).
// ===========================================================================
function validate(m, outputs) {
  console.log(`VALIDATE [${m.id}] running explicit validator on ${outputs.length} output(s)`);
  for (const out of outputs) {
    const argv = m.validator
      ? [m.validator, out]      // manifest-named validator (Phase 3 binds validate-*.js)
      : [ROUTE, out];           // basename dispatch via route.js → validate-*.js
    const r = spawnSync(process.execPath, argv, { stdio: 'inherit' });
    if (r.status !== 0) {
      return { ok: false, output: out, code: r.status || 2 };   // exit 2 = reject (propagated)
    }
  }
  return { ok: true, verdicts: outputs.map(o => ({ output: o, verdict: 'pass' })) };
}

// escalate (CTRL-07): reject survived the bounded re-spawn cap → escalate to operator, exit≠0.
function escalate(stepId, verdict) {
  console.error(`ESCALATE [${stepId}] validator rejected after re-spawn cap; output=${verdict.output}`);
  process.exit(verdict.code || 2);
}

// ===========================================================================
// Phase 6 — Store+receipt (CTRL-08). FILLED in Task 2 (storeAndReceipt body).
// ===========================================================================
function storeAndReceipt(m, space, verdict, opts) {
  // Task 2 fills this body (receipt-write.js subprocess + space-version.js no-overwrite naming).
  throw new Error('storeAndReceipt not yet implemented (Task 2)');
}

// ===========================================================================
// Phase 7 — Operator-gate (CTRL-09). FILLED in Task 2 (operatorGate body).
// ===========================================================================
function operatorGate(m, receipt, opts) {
  // Task 2 fills this body (block / --smoke auto-approve; decision logged, never silent).
  throw new Error('operatorGate not yet implemented (Task 2)');
}

// ===========================================================================
// The PART3 §8 seven-phase loop — runStep(id, space, opts).
// ===========================================================================
function runStep(stepId, space, opts) {
  const m = loadManifest(stepId, opts.manifestDir);   // CTRL-11
  preflight(m, space);                                // P1 — CTRL-03
  planPrint(m);                                       // P2 — CTRL-04 (before any run line)
  const ctx = assembleContext(m, space, opts);        // P3 — CTRL-05
  let attempts = 0, verdict, outputs;
  do {
    outputs = spawnWaves(m, ctx, space, attempts);    // P4 — CTRL-06 (unique id per attempt in P6)
    verdict = validate(m, outputs);                   // P5 — CTRL-07 (EXPLICIT validator)
    attempts++;
  } while (!verdict.ok && attempts <= 2);             // bounded re-spawn ≤2
  if (!verdict.ok) escalate(stepId, verdict);         // → operator, exit≠0
  const receipt = storeAndReceipt(m, space, verdict, opts); // P6 — CTRL-08
  operatorGate(m, receipt, opts);                     // P7 — CTRL-09
  return { ok: true, receipt };
}

// ===========================================================================
// runAll(space, opts) (CTRL-02/CTRL-10). FILLED in Task 2.
// ===========================================================================
function runAll(space, opts) {
  for (const id of parsePipeline(opts.pipeline)) {
    runStep(sanitizePathSegment(id), space, opts);
  }
}

// ===========================================================================
// Entrypoint — partial in Task 1 (--help, --print-manifest). Full run wiring in Task 2.
// ===========================================================================
function main() {
  if (opts.help) {
    console.log(`
run-controller.js — the PART3 §8 7-phase run-controller (assembled from Phase-1 bricks)

Usage:
  node engine/bricks/run-controller.js <step-id> --space=<s> [--smoke] [--manifest-dir=<d>]
  node engine/bricks/run-controller.js all --space=<s> [--smoke] [--pipeline=<f>] [--manifest-dir=<d>]
  node engine/bricks/run-controller.js --print-manifest=<id> [--manifest-dir=<d>]

Options:
  <step-id> | all     Positional: run one step, or walk --pipeline in file order.
  --space=<str>       Market space (sanitized by lib/fanout-path). REQUIRED for a run.
  --smoke             Smoke mode: auto-approve operator gates; surface CONTEXT markers.
  --auto-approve      Alias for --smoke's gate auto-approval.
  --pipeline=<file>   Pipeline list to walk for 'all' (default ${DEFAULT_PIPELINE}).
  --manifest-dir=<d>  Where per-step <id>.json manifests live (default ${DEFAULT_MANIFEST_DIR}).
  --print-manifest=<id>  Debug: print the loaded §5 manifest object and exit 0.
  --rerun             Use space-version.js to name a bumped no-overwrite space (advanced).
  --help              Show this help.
`);
    process.exit(0);
  }

  // --print-manifest=<id> — debug short-circuit (Task 1).
  if (typeof opts['print-manifest'] === 'string') {
    const dir = (typeof opts['manifest-dir'] === 'string') ? opts['manifest-dir'] : DEFAULT_MANIFEST_DIR;
    console.log(JSON.stringify(loadManifest(opts['print-manifest'], dir), null, 2));
    process.exit(0);
  }

  // Full run wiring (sanitize --space, dispatch to runAll/runStep) lands in Task 2.
  console.error('run-controller: run wiring not yet complete (Task 2)');
  process.exit(1);
}

main();
