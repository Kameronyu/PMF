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
//   - receipt-write.js is WRITE-ONCE → a colliding spawn-id is exit 1. The receipt is minted
//     ONCE per successful step (after the ≤2 re-spawn loop, not per attempt); Date.now()+rand
//     keeps spawn-ids distinct across steps/runs.
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
const MAX_AGENTS = 100;                   // upper bound on wave COUNT (WR-04 DoS guard): the wave
                                          // SIZE is capped at WAVE_CAP, but nothing bounds how MANY
                                          // waves run — a manifest with agents:1e9 would loop ~200M
                                          // times doing real fs writes and HANG. Refuse any
                                          // agents > MAX_AGENTS by name (no real step needs >100).
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
  // CTRL-11: the parsed value must be a non-null plain object before the `k in m` key loop.
  // `null` / a bare string|number / an array are all valid JSON but NOT a §5 manifest shape —
  // refuse them by name here, else the `in` operator throws a generic FATAL on null (WR-04).
  if (m === null || typeof m !== 'object' || Array.isArray(m)) {
    console.error(`REFUSE [${id}] manifest is not a JSON object: ${file} (got ${Array.isArray(m) ? 'array' : (m === null ? 'null' : typeof m)})`);
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
  const paths = (m.reads || []).map(r => r.replace('{space}', space));
  const missing = paths.filter(p => !fs.existsSync(p));
  if (missing.length) {
    console.error(`REFUSE [${m.id}] preflight: missing input contract(s): ${missing.join(', ')}`);
    process.exit(PREFLIGHT_EXIT);   // distinct exit; NEVER continue past a missing input (P3)
  }
  // CTRL-03: existence is not enough — a DIRECTORY (or socket/fifo) at a reads[] path passes
  // existsSync but then crashes LATE at assembleContext's readFileSync (generic FATAL EISDIR).
  // Require each existing input be a REGULAR FILE here so the refusal is named + early (P3).
  // (Non-empty CONTENT is NOT checked here — that is Phase 5 / VALID-02's job; preflight owns
  // existence + is-a-file only.)
  for (const p of paths) {
    if (!fs.statSync(p).isFile()) {
      console.error(`REFUSE [${m.id}] preflight: input is not a regular file: ${p}`);
      process.exit(PREFLIGHT_EXIT);   // same named-refusal exit as the missing-input path
    }
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
  console.log(`  spawn       : ${agentCount(m)} agent(s) (waves of <=${WAVE_CAP})`);
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
    // Surface the DATA boundary headers so a receipts/log diff proves the bytes were embedded
    // (the agent receives bytes, not a file to Read). Each header carries the source path.
    for (const r of (m.reads || [])) {
      console.log(`  <<<DATA ${r.replace('{space}', space)}>>>`);
    }
  }
  return block;
}

// ===========================================================================
// Phase 4 — Spawn (CTRL-06): chunk agents into waves of ≤5; each agent mock-emits the
// step's declared contract-shaped stub artifact(s).
//
// Two emit modes, selected WITHOUT per-id special-casing in this glue:
//   A. Fixture mode — the manifest itself DECLARES a `stub_emit` payload (controller-smoke
//      negative/positive fixtures). Keep the original single-write-to-writes[0] behavior so
//      the Phase-2 fixture asserts are unchanged.
//   B. Prompt-stub mode (Phase 4 / real manifests) — the manifest's `prompt:` file carries a
//      fenced STUB-EMIT block: a JSON object keyed by each writes[] basename → that artifact's
//      contract-shaped mock payload (an object/array for .json; a string for .md). The
//      controller writes EVERY writes[] entry from that block. A trailing-"/" writes[] entry is
//      a fan-out DIRECTORY — satisfied by mkdir -p (its representative _index file is a sibling
//      file write in the same block). This is the deferred-prompt drop-in seam: Phase 7 replaces
//      the prompt BODY (and, when real, the spawn that produces these files) with no rewiring.
// ===========================================================================

// readStubEmit(m): parse the `STUB-EMIT` fenced JSON block out of the manifest's prompt-stub
// file. The block is delimited by a ```stub-emit … ``` fence so the surrounding markdown envelope
// (ROLE / OUTPUT CONTRACT / …) is human-readable and the machine slice is exact.
//
// Returns null ONLY when the prompt file is ABSENT (no prompt authored yet → the caller falls
// back to the generic minimal stub so the controller still runs pre-Phase-4). When the prompt
// file EXISTS, a missing / duplicated / malformed fence is a NAMED REFUSAL — never a silent
// fall-through to hollow {_stub} artifacts, which would emit contract-violating mock data and
// still report success (review F1/F2). "file present but no good block" ≠ "no prompt authored".
function readStubEmit(m) {
  if (typeof m.prompt !== 'string' || !m.prompt) return null;        // manifest names no slot
  if (!fs.existsSync(m.prompt) || !fs.statSync(m.prompt).isFile()) return null;  // slot not authored yet
  const src = fs.readFileSync(m.prompt, 'utf8');
  const fences = src.match(/```stub-emit\s*\n[\s\S]*?\n```/g) || [];
  if (fences.length === 0) {
    console.error(`REFUSE [${m.id}] spawn: prompt exists but carries no \`\`\`stub-emit block (${m.prompt}) — author the STUB-EMIT block or remove the prompt file`);
    process.exit(1);
  }
  if (fences.length > 1) {
    console.error(`REFUSE [${m.id}] spawn: prompt carries ${fences.length} \`\`\`stub-emit blocks (${m.prompt}) — exactly one is allowed (ambiguous which emits)`);
    process.exit(1);
  }
  const body = fences[0].replace(/^```stub-emit\s*\n/, '').replace(/\n```$/, '');
  let obj;
  try {
    obj = JSON.parse(body);
  } catch (e) {
    console.error(`REFUSE [${m.id}] spawn: prompt STUB-EMIT block is not valid JSON (${m.prompt}: ${e.message})`);
    process.exit(1);
  }
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    console.error(`REFUSE [${m.id}] spawn: prompt STUB-EMIT block must be a JSON object keyed by writes[] basename (${m.prompt})`);
    process.exit(1);
  }
  return obj;
}

// writeOne(p, payload): serialize ONE emit. A string payload → written verbatim (markdown slots);
// any other payload → pretty JSON + trailing newline. Deterministic: no Date/random in payloads.
function writeOne(p, payload) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  const body = (typeof payload === 'string') ? payload : (JSON.stringify(payload, null, 2) + '\n');
  fs.writeFileSync(p, body);
}

function mockEmit(m, space) {
  // --- Mode A: fixture-declared stub_emit (Phase-2 controller-smoke) — unchanged. ---
  if ('stub_emit' in m) {
    const out = (m.writes && m.writes[0] || '').replace('{space}', space);
    if (!out) {
      console.error(`REFUSE [${m.id}] spawn: manifest declares no writes[0] to emit to`);
      process.exit(1);
    }
    writeOne(out, m.stub_emit);
    return [out];
  }

  // --- Mode B: prompt-stub STUB-EMIT block emits EVERY writes[] (Phase 4). ---
  const emit = readStubEmit(m);
  const writes = (m.writes || []);
  if (!writes.length) {
    console.error(`REFUSE [${m.id}] spawn: manifest declares no writes[] to emit to`);
    process.exit(1);
  }
  // Orphan-key guard (review F4): every stub-emit key must map to a declared writes[] FILE
  // basename. A key that matches none is a typo/drift (e.g. prompt "gap-candidates.json" vs
  // manifest "gap_candidates.json") that would silently never be written — refuse by name so
  // the disagreement surfaces instead of hiding behind a present-but-wrong key.
  if (emit) {
    const fileBasenames = new Set(
      writes.filter(w => !w.endsWith('/')).map(w => path.basename(w))
    );
    for (const key of Object.keys(emit)) {
      if (!fileBasenames.has(key)) {
        console.error(`REFUSE [${m.id}] spawn: prompt STUB-EMIT key "${key}" matches no writes[] file basename (${m.prompt}) — orphan/typo'd key`);
        process.exit(1);
      }
    }
  }

  const fileOutputs = [];
  for (const w of writes) {
    const out = w.replace('{space}', space);
    if (out.endsWith('/')) {
      fs.mkdirSync(out, { recursive: true });   // fan-out dir slot — its _index file is a sibling write
      continue;
    }
    const base = path.basename(out);
    // The prompt stub MUST declare a payload for every file write; a missing key would emit a
    // hollow artifact that silently mis-shapes the seam. Refuse by name (P3), never improvise —
    // EXCEPT when no prompt-stub block exists at all (no prompt authored yet): fall back to the
    // generic minimal stub so the controller still runs pre-Phase-4.
    let payload;
    if (emit && (base in emit)) {
      payload = emit[base];
    } else if (emit) {
      console.error(`REFUSE [${m.id}] spawn: prompt STUB-EMIT block missing payload for writes[] "${base}" (${m.prompt})`);
      process.exit(1);
    } else {
      payload = { _stub: true, step: m.id };
    }
    writeOne(out, payload);
    fileOutputs.push(out);
  }
  return fileOutputs;
}

// agentCount(m): coerce + validate manifest.agents to a positive integer wave count (WR-04).
// `agents` is a required §5 key (loadManifest enforces presence), but its VALUE is taken
// verbatim from JSON — a string ("6"), 0, a negative, or a float would mis-size the waves
// (NaN/string coercion in Math.min, zero/negative emit no waves → a vacuous validate([]) pass,
// a float emits a fractional final wave). Refuse a malformed value with the same named-refusal
// idiom as the other shape errors instead of silently producing a false "success".
function agentCount(m) {
  if (!Number.isInteger(m.agents) || m.agents < 1) {
    console.error(`REFUSE [${m.id}] manifest key agents must be a positive integer (got ${JSON.stringify(m.agents)})`);
    process.exit(1);
  }
  // WR-04 DoS guard: bound the wave COUNT. agents passes the positive-integer check above but a
  // huge value (e.g. 1e9) loops ~n/WAVE_CAP times doing real fs.writeFileSync → exit-124 HANG.
  // Refuse anything over MAX_AGENTS by name, same idiom — fail fast (<1s) instead of hanging.
  if (m.agents > MAX_AGENTS) {
    console.error(`REFUSE [${m.id}] manifest: agents=${m.agents} exceeds MAX_AGENTS=${MAX_AGENTS}`);
    process.exit(1);
  }
  return m.agents;
}

function spawnWaves(m, ctx, space) {
  const n = agentCount(m);
  const outputs = [];
  let wave = 0;
  for (let i = 0; i < n; i += WAVE_CAP) {
    wave++;
    const size = Math.min(WAVE_CAP, n - i);
    console.log(`SPAWN [${m.id}] wave ${wave} (${size} agents)`);
    // The fixture stub agents all write the same declared output slot; the last write wins.
    // (Phase 3+ swaps the stub for a real spawn; the wave-chunking seam is unchanged.)
    for (let k = 0; k < size; k++) {
      // mockEmit returns the FILE outputs it wrote (fan-out dir slots are mkdir-only, not
      // validatable, so they are not returned). The last wave's writes win (same slot paths).
      for (const out of mockEmit(m, space)) {
        if (!outputs.includes(out)) outputs.push(out);
      }
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
// Phase 6 — Store+receipt (CTRL-08): mint a UNIQUE spawn-id, delegate the receipt write
// to receipt-write.js (write-once, owns the sha256). The no-overwrite NAMING via
// space-version.js is wired-but-dormant absent --rerun (Open Q2: smoke uses a fixed space).
// ===========================================================================
function storeAndReceipt(m, space, verdict, opts) {
  // No-overwrite naming (CTRL-08): on an explicit --rerun, ask space-version.js to NAME the
  // next free space and scaffold it; the resolver is read-only and the controller owns the
  // scaffold decision. In smoke the space is fixed (--space=smoke), so this path is dormant
  // and the harness exercises space-version.js via its own UNIT assert (CTRL-08b).
  if (opts.rerun) {
    // Guard the subprocess result BEFORE dereferencing .stdout: a failed-to-start spawn
    // (ENOENT/EACCES) or a signal-killed child returns { stdout: null, error } and a non-zero
    // status means the resolve itself failed — both must surface a NAMED refusal, not a generic
    // FATAL that masks the real cause or a silently-treated-as-"no bump" (WR-02).
    const r = spawnSync(process.execPath, [SPACE_VERSION, '--space=' + space], { encoding: 'utf8' });
    if (r.status !== 0 || typeof r.stdout !== 'string') {
      console.error(`REFUSE [${m.id}] --rerun: space-version.js failed (status=${r.status})`);
      process.exit(1);
    }
    const next = r.stdout.trim();
    if (next && next !== space) {
      spawnSync(process.execPath, [STORE_SCAFFOLD, '--space=' + next], { stdio: 'inherit' });
      space = next;   // subsequent writes land in the bumped space
    }
  }

  // ONE receipt per successful step — storeAndReceipt runs once, AFTER the bounded re-spawn loop
  // succeeds (the loop re-runs spawnWaves+validate, NOT the receipt write), so there is no
  // intra-step spawn-id collision to guard against. receipt-write.js is still WRITE-ONCE, so a
  // colliding id across DISTINCT steps/runs is exit 1; Date.now()+rand keeps those distinct.
  // Sanitize the id segment ONCE (reusing lib/fanout-path's sanitizePathSegment — no re-implemented
  // regex) and reuse that value for BOTH the --spawn-id flag and the rebuilt receipt path, so the
  // path the controller logs/returns can never diverge from the file receipt-write.js writes (WR-01).
  const idSeg   = sanitizePathSegment(m.id);
  const spawnId = idSeg + '-' + Date.now() + '-' + Math.random().toString(36).slice(2, 6);

  const inputs  = (m.reads  || []).map(r => r.replace('{space}', space)).join(',');
  const outputs = (m.writes || []).map(w => w.replace('{space}', space)).join(',');

  // Delegate the receipt write (sha256 inputs_hash + write-once) to the brick — never re-hash.
  execFileSync(process.execPath, [
    RECEIPT_WRITE,
    '--space=' + space,
    '--spawn-id=' + spawnId,
    '--step=' + m.id,
    '--inputs=' + inputs,
    '--outputs=' + outputs,
    '--gate=' + JSON.stringify({ step_gated: !!m.gate, decision: null }),
  ], { stdio: 'inherit' });

  const receiptPath = 'runs/' + space + '/_receipts/' + spawnId + '.json';
  console.log(`STORE [${m.id}] receipt ${receiptPath}`);
  return receiptPath;
}

// ===========================================================================
// Phase 7 — Operator-gate (CTRL-09): a gated step blocks on a sign-off artifact; --smoke
// auto-approves; a non-gate step passes silently. The decision is LOGGED, never a silent skip.
// ===========================================================================
function awaitSignoff(m, receiptPath) {
  // Real operator sign-off UX is deferred (CONTEXT). Outside smoke a gated step blocks here.
  console.error(`GATE [${m.id}] operator sign-off required (receipt ${receiptPath}) — run with --smoke to auto-approve in stub mode`);
  process.exit(4);   // distinct exit: a gated step cannot proceed without a decision
}

function operatorGate(m, receipt, opts) {
  if (!m.gate) {
    console.log(`GATE [${m.id}] none (step not gated)`);   // logged pass — phase always reports
    return;
  }
  const decision = opts.smoke ? 'auto-approved-smoke' : awaitSignoff(m, receipt);
  console.log(`GATE [${m.id}] ${decision}`);            // logged, never silent (P9)
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
    outputs = spawnWaves(m, ctx, space);              // P4 — CTRL-06 (re-runs on reject; receipt minted once in P6)
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

  // --- a run requires a target (all | <step-id>) + a --space ---------------
  if (!target) {
    console.error('ERROR: a run requires a target: `all` or a <step-id> (see --help)');
    process.exit(1);
  }
  if (typeof opts.space !== 'string' || opts.space === '') {
    console.error('ERROR: --space=<market-space> is required for a run (did you forget the =value?)');
    process.exit(1);
  }
  const SPACE = sanitizePathSegment(opts.space);
  if (!SPACE) {
    console.error('ERROR: --space value sanitized to empty string; use only the chars lib/fanout-path permits');
    process.exit(1);
  }

  const o = runOpts();
  try {
    if (target === 'all') {
      runAll(SPACE, o);
      console.log(`run-controller: walked ${o.pipeline} in space=${SPACE} (smoke=${o.smoke})`);
    } else {
      runStep(sanitizePathSegment(target), SPACE, o);
      console.log(`run-controller: completed ${target} in space=${SPACE} (smoke=${o.smoke})`);
    }
    process.exit(0);
  } catch (e) {
    console.error(`run-controller: FATAL ${e.message}`);
    process.exit(1);
  }
}

main();
