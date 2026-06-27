#!/usr/bin/env node
// validate-shape.js — VALID-01/VALID-02 generic OUTPUT-CONTRACT shape validator.
//
// The SHELL-grade presence + top-level-shape gate (SHELL-BUILD-SPEC §7: "presence now,
// congruence later"). It is the validator the run-controller's Validate phase reaches for
// every step output basename that has NO deeper per-artifact validator — so that steps 04–10
// (previously "pass silently" in route.js) now produce a NAMED REJECT on a wrong / missing /
// hollow emit instead of a vacuous green. Field-level seam schemas are deferred content
// (CONTENT-02); they tighten the SAME validators later with no rewiring.
//
// Contract source: engine/contracts/output-shapes.json. Per output BASENAME (or path-tail,
// for fan-out files like voc/market-signal/_index.json) it declares either:
//   "__MD__"                              → a non-empty markdown/text file
//   { type:"object", keys:[...] }         → a JSON object carrying ALL listed top-level keys
//
// Reject conditions (each a NAMED REJECT, exit 2):
//   - file missing / unreadable                                  (VALID-01 presence)
//   - JSON file is hollow: {} / [] / {"_stub":true} / seed-only  (VALID-02 hollow refusal)
//   - JSON file missing a declared top-level key                 (VALID-01 shape)
//   - __MD__ file empty / whitespace-only / scaffold-placeholder (VALID-01 presence + VALID-02 hollow)
//   - a basename with NO entry in output-shapes.json             (refuse-by-name: never silent-pass
//                                                                 an unmapped REAL output — drift guard)
//
// Usage: node engine/hooks/validate-shape.js <path-to-output-artifact>
// Exit 0 = pass (silent). Exit 2 + stderr = REJECT.
'use strict';

const fs   = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log('Usage: node engine/hooks/validate-shape.js <path-to-output-artifact>');
  console.log('VALID-01/02 generic presence + top-level-shape + non-hollow validator.');
  console.log('Shape contract: engine/contracts/output-shapes.json (per output basename / path-tail).');
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('REJECT: validate-shape missing argument — provide path to an output artifact');
  process.exit(2);
}

const SHAPES = require('../contracts/output-shapes.json').shapes;

// Resolve the contract entry for this path. Prefer the longest path-tail match so a fan-out
// file (voc/market-signal/_index.json) keys on a relpath when the basename alone (_index.json)
// would be ambiguous. Falls back to the bare basename.
function lookupShape(p) {
  const norm = p.replace(/\\/g, '/');
  // Try progressively shorter path-tails: full relpath segments down to the basename.
  const segs = norm.split('/');
  for (let i = 0; i < segs.length; i++) {
    const tail = segs.slice(i).join('/');
    if (Object.prototype.hasOwnProperty.call(SHAPES, tail)) return { key: tail, shape: SHAPES[tail] };
  }
  const base = path.basename(norm);
  if (Object.prototype.hasOwnProperty.call(SHAPES, base)) return { key: base, shape: SHAPES[base] };
  return null;
}

const match = lookupShape(filePath);
if (!match) {
  // A real output that the contract doesn't know about is drift — refuse by name, never pass.
  console.error(`REJECT: validate-shape has no OUTPUT-CONTRACT entry for "${path.basename(filePath)}" (${filePath}) — unmapped output is drift; add it to engine/contracts/output-shapes.json`);
  process.exit(2);
}

// --- presence: the file must exist + be a regular file ---
let stat;
try {
  stat = fs.statSync(filePath);
} catch (err) {
  console.error(`REJECT: ${match.key} output missing — cannot stat "${filePath}" (${err.message})`);
  process.exit(2);
}
if (!stat.isFile()) {
  console.error(`REJECT: ${match.key} output is not a regular file: "${filePath}"`);
  process.exit(2);
}

let raw;
try {
  raw = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`REJECT: ${match.key} output unreadable "${filePath}" — ${err.message}`);
  process.exit(2);
}

// --- __MD__: a non-empty markdown/text artifact ---
if (match.shape === '__MD__') {
  if (raw.trim() === '') {
    console.error(`REJECT: ${match.key} markdown output is empty/whitespace-only "${filePath}" (hollow — VALID-02)`);
    process.exit(2);
  }
  process.exit(0);
}

// --- JSON-object shape: parse, reject hollow, assert top-level keys ---
let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`REJECT: ${match.key} output is not valid JSON "${filePath}" — ${err.message}`);
  process.exit(2);
}

// VALID-02 hollow refusal: the scaffold seeds .json slots with `{}` — an emit that left the seed
// (or wrote a bare container / a generic {_stub:true}) is hollow load-bearing data, not a real
// contract artifact. Refuse it by name rather than pass a vacuous green.
if (data === null) {
  console.error(`REJECT: ${match.key} output is null "${filePath}" (hollow — VALID-02)`);
  process.exit(2);
}
if (Array.isArray(data)) {
  console.error(`REJECT: ${match.key} output is a bare array "${filePath}" — contract expects an object with top-level keys [${match.shape.keys.join(', ')}]`);
  process.exit(2);
}
if (typeof data !== 'object') {
  console.error(`REJECT: ${match.key} output is a bare ${typeof data} "${filePath}" — contract expects an object`);
  process.exit(2);
}
const presentKeys = Object.keys(data);
if (presentKeys.length === 0) {
  console.error(`REJECT: ${match.key} output is the empty/scaffold-seed object {} "${filePath}" (hollow — VALID-02: emit produced no content)`);
  process.exit(2);
}
if (presentKeys.length === 1 && presentKeys[0] === '_stub') {
  console.error(`REJECT: ${match.key} output is a generic {_stub:true} placeholder "${filePath}" (hollow — VALID-02: no contract keys emitted)`);
  process.exit(2);
}

// VALID-01 shape: every declared top-level key must be present.
const missing = (match.shape.keys || []).filter(k => !Object.prototype.hasOwnProperty.call(data, k));
if (missing.length) {
  console.error(`REJECT: ${match.key} output missing top-level OUTPUT-CONTRACT key(s): [${missing.join(', ')}] — have [${presentKeys.join(', ')}] (${filePath})`);
  process.exit(2);
}

// Pass — exit 0 silently
process.exit(0);
