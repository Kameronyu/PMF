#!/usr/bin/env node
// route.js — PostToolUse hook dispatcher.
// Routes Write events to the correct per-agent validator(s) based on the written file path.
// Called by the hooks.PostToolUse command; receives the file path as $1 (process.argv[2]).
//
// Routing rules (Phase 5 — full output-basename coverage; was "any other path: pass silently"):
//   <path>/brands.json       → validate-shape.js + validate-finder.js + validate-revenue.js
//   <path>/dump.json         → validate-dumper.js
//   <path>/space-map.json    → validate-shape.js + validate-classifier.js (incl. WIRE-03 trace)
//   <path>/*-beliefs.json    → validate-analyzer.js   (Section Analyzer output)
//   any OTHER output         → validate-shape.js  (VALID-01 presence + top-level shape + non-hollow,
//                              driven by engine/contracts/output-shapes.json)
//
// Phase-5 wiring (VALID-01): every step output basename now reaches a real validator. A mapped
// output with a wrong/missing/hollow shape REJECTs; an UNMAPPED output basename also REJECTs
// (validate-shape refuses unknown outputs as drift) — nothing real "passes silently" any more.
// The .md / dump.json paths that carry no output-shapes entry (dump.json is an INTERNAL Step-1
// artifact, not a declared inter-step output) keep their bespoke validators / pass-through.
//
// NOTE (#analyzer-unwired): this PostToolUse routing is DEFENSE-IN-DEPTH only — it
// fires on a main-loop Write. The Section Analyzer runs as a SUBAGENT, and hooks do
// NOT fire in subagents, so the funnel-deep-pass orchestrator must ALSO run
// validate-analyzer.js as an explicit step (mirrors validate-asset-record.js in
// asset-classify). The route here catches any analyzer output written from the main loop.
//
// Usage: node tools/hooks/route.js <written-file-path>
// Exit 0 = pass. Exit 2 + stderr = reject (propagated from the called validator).
'use strict';

const { spawnSync } = require('child_process');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log('Usage: node tools/hooks/route.js <written-file-path>');
  console.log('Routes to the appropriate per-agent validator based on the file name.');
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  // No file path — nothing to validate
  process.exit(0);
}

const hooksDir = __dirname;
const base = path.basename(filePath);

function runValidator(validatorFile, arg) {
  const result = spawnSync(
    process.execPath,  // node binary
    [path.join(hooksDir, validatorFile), arg],
    { stdio: 'inherit' }
  );
  if (result.status !== 0) {
    process.exit(result.status || 2);
  }
}

if (base === 'brands.json') {
  runValidator('validate-shape.js', filePath);      // VALID-01 presence + {brands} shape
  runValidator('validate-finder.js', filePath);     // deep: enum + per-row url/sells_observed
  runValidator('validate-revenue.js', filePath);    // deep: never-fabricate revenue_est
} else if (base === 'dump.json') {
  // dump.json is an INTERNAL Step-1 artifact (not a declared inter-step output) — bespoke validator only.
  runValidator('validate-dumper.js', filePath);
} else if (base === 'space-map.json') {
  runValidator('validate-shape.js', filePath);      // VALID-01 presence + 8-axis top-level shape
  runValidator('validate-classifier.js', filePath); // deep: WIRE-03 raw→canonical trace + axis-presence + enums
} else if (base.endsWith('-beliefs.json')) {
  // Section Analyzer subagent output — bespoke verbatim/enum validator (no output-shapes entry).
  runValidator('validate-analyzer.js', filePath);
} else {
  // Phase 5: every OTHER step output basename → the generic shape validator. It carries its own
  // "no contract entry → REJECT" drift guard, so an unmapped REAL output rejects instead of the
  // old silent pass. (VALID-01: zero real outputs pass unvalidated.)
  runValidator('validate-shape.js', filePath);
}
process.exit(0);
