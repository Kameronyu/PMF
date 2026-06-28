'use strict';
// receipt-write.js — STORE-03: the per-spawn run-ledger writer.
// Writes ONE receipt JSON file per spawn to runs/<space>/_receipts/<spawn_id>.json (the
// committed provenance ledger), with a sha256 inputs_hash computed over the SORTED input
// artifact bytes. One-file-per-spawn (D-receipt-per-file) — survives partial writes, easy
// to diff; mirrors the engine's funnels/<funnel_id>.json one-record-per-file idiom.
//
// SHAPE vs CONTENT (D-receipt-shape): Phase 1 ships the receipt SHAPE + writer + sha256
// helper. Phase 2 (CTRL-08) supplies the real per-step input list; Phase 5 (VALID-04/05)
// POPULATES validator_verdicts (default []) and gate decisions. This brick takes a
// fully-formed receipt's parts via CLI flags and does NOT couple to step internals.
//
// Security (T-01-06): --space and --spawn-id are both sanitized via the shared
// sanitizePathSegment ([a-z0-9._-]; strips "/" and "..") BEFORE path.join, so <spawn_id>.json
// cannot escape _receipts/. (T-01-07): inputs_hash = sha256 over SORTED input bytes proves
// the spawn ran on the declared inputs (P3 contract discipline); receipts are committed.
//
// Gitignore (Pitfall 4): the receipt file is _receipts/<spawn_id>.json — COMMITTED provenance,
// NOT _*-log.txt and NOT _index.json (both gitignored). The OPTIONAL sidecar log
// _receipt-write-log.txt IS gitignored (correct). NOT a reuse target: validate-receipt.js
// (it gates pipeline-audit CONTEXT-receipts, NOT this run ledger) — do not extend it.
//
// Usage:
//   node engine/bricks/receipt-write.js --space=<s> --spawn-id=<id> \
//     [--step=<s>] [--inputs=<csv>] [--outputs=<csv>] [--gate=<json>] [--verdicts=<json>]
//   node engine/bricks/receipt-write.js --help
//
// Output: runs/<space>/_receipts/<spawn_id>.json. Exit 0 ok / 1 on missing --space|--spawn-id
// or on a colliding spawn-id (receipts are WRITE-ONCE — see no-overwrite-v1 guard below).

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const { sanitizePathSegment } = require('./lib/fanout-path');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => {
      const body = a.replace(/^--/, '');
      const i = body.indexOf('=');
      return i === -1 ? [body, true] : [body.slice(0, i), body.slice(i + 1)];
    })
);

if (opts.help) {
  console.log(`
receipt-write.js — STORE-03: per-spawn run-ledger writer + sha256 inputs_hash

Usage:
  node engine/bricks/receipt-write.js --space=<s> --spawn-id=<id> \\
    [--step=<s>] [--inputs=<csv>] [--outputs=<csv>] [--gate=<json>]

Options:
  --space=<str>      Market space. REQUIRED. Sanitized to [a-z0-9._-]; "/"/".." stripped.
  --spawn-id=<str>   Spawn identifier — becomes the filename <spawn_id>.json. REQUIRED.
                     Sanitized (rejected if empty after sanitize).
  --step=<str>       Step label recorded in the receipt (optional).
  --inputs=<csv>     Comma-separated input artifact paths; bytes are hashed (order-independent).
  --outputs=<csv>    Comma-separated output artifact paths.
  --gate=<json>      Gate object (optional). Default {"step_gated":false,"decision":null}.
  --verdicts=<json>  validator_verdicts array (optional, Phase 5 / VALID-04). Default [].
  --help             Show this help.

Behavior:
  Writes runs/<space>/_receipts/<spawn_id>.json with:
    spawn_id, step, space, inputs_hash (sha256 of sorted input bytes), inputs, outputs,
    validator_verdicts (default [] — Phase 5 populates), gate, ts.
`);
  process.exit(0);
}

if (typeof opts.space !== 'string' || opts.space === '') {
  console.error('ERROR: --space=<market-space> is required (did you forget the =value?)');
  process.exit(1);
}
if (typeof opts['spawn-id'] !== 'string' || opts['spawn-id'] === '') {
  console.error('ERROR: --spawn-id=<id> is required (did you forget the =value?)');
  process.exit(1);
}

const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) {
  console.error('ERROR: --space value sanitized to empty string; use only [a-z0-9._-]');
  process.exit(1);
}

const SPAWN_ID = sanitizePathSegment(opts['spawn-id']);
if (!SPAWN_ID) {
  console.error('ERROR: --spawn-id value sanitized to empty string; use only [a-z0-9._-]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// sha256 inputs_hash helper (node:crypto, stdlib — no install)
// ---------------------------------------------------------------------------
function hashInputs(inputPaths) {
  const h = crypto.createHash('sha256');
  for (const p of [...inputPaths].sort()) {              // sort -> order-independent, deterministic
    h.update(p);
    h.update('\0');                                      // separator so concatenation is unambiguous
    if (fs.existsSync(p)) h.update(fs.readFileSync(p));  // hash the actual bytes when the file exists
  }
  return h.digest('hex');                                // 64 hex chars
}

// ---------------------------------------------------------------------------
// Build the receipt object (the D-receipt-shape contract)
// ---------------------------------------------------------------------------
function parseCsv(v) {
  if (typeof v !== 'string') return [];
  return v.split(',').map(s => s.trim()).filter(Boolean);
}

const inputs  = parseCsv(opts.inputs);
const outputs = parseCsv(opts.outputs);

// Gate: default { step_gated:false, decision:null }; Phase 5 populates real decisions.
let gateObj = { step_gated: false, decision: null };
if (typeof opts.gate === 'string') {
  let parsed;
  try {
    parsed = JSON.parse(opts.gate);
  } catch (e) {
    console.error(`ERROR: --gate is not valid JSON: ${e.message}`);
    process.exit(1);
  }
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    console.error('ERROR: --gate must be a JSON object, e.g. {"step_gated":false,"decision":null}');
    process.exit(1);
  }
  gateObj = parsed;
}

// validator_verdicts: default []; Phase 5 (VALID-04) passes the real per-output verdicts as JSON.
let verdicts = [];
if (typeof opts.verdicts === 'string') {
  let parsed;
  try {
    parsed = JSON.parse(opts.verdicts);
  } catch (e) {
    console.error(`ERROR: --verdicts is not valid JSON: ${e.message}`);
    process.exit(1);
  }
  if (!Array.isArray(parsed)) {
    console.error('ERROR: --verdicts must be a JSON array, e.g. [{"output":"…","verdict":"pass"}]');
    process.exit(1);
  }
  verdicts = parsed;
}

const receipt = {
  spawn_id: SPAWN_ID,
  step: (typeof opts.step === 'string') ? opts.step : null,
  space: SPACE,
  inputs_hash: hashInputs(inputs),
  inputs,                        // array
  outputs,                       // array
  validator_verdicts: verdicts,  // Phase 5 (VALID-04): real per-output verdicts via --verdicts
  gate: gateObj,                 // Phase 5 (VALID-05): real decision via --gate
  ts: new Date().toISOString(),
};

// ---------------------------------------------------------------------------
// Write the receipt (one-file-per-spawn idiom)
// ---------------------------------------------------------------------------
(() => {
  try {
    const OUT_DIR = path.join(process.cwd(), 'runs', SPACE, '_receipts');
    fs.mkdirSync(OUT_DIR, { recursive: true });
    const outPath = path.join(OUT_DIR, `${SPAWN_ID}.json`);
    // no-overwrite-v1: receipts are WRITE-ONCE committed provenance. A colliding spawn-id
    // is an orchestrator bug to surface — never silently overwrite, never version-bump.
    // (CLAUDE.md Versioning; CTRL-08; PART3 §8; SHELL-BUILD-SPEC §4. Mirrors store-scaffold.js'
    // `if (!fs.existsSync(p))` write-only-if-absent intent, but REFUSES instead of skipping.)
    if (fs.existsSync(outPath)) {
      console.error(`ERROR: receipt ${SPAWN_ID} already exists at ${outPath} — refusing to overwrite committed provenance (no-overwrite-v1)`);
      process.exit(1);
    }
    fs.writeFileSync(outPath, JSON.stringify(receipt, null, 2) + '\n');

    console.log(`receipt-write: wrote _receipts/${SPAWN_ID}.json (space=${SPACE})`);
    process.exit(0);
  } catch (e) {
    console.error(`FATAL: ${e.message}`);
    process.exit(1);
  }
})();
