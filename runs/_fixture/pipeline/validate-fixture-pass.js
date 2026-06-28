#!/usr/bin/env node
// validate-fixture-pass.js — controller-smoke FIXTURE validator (Phase 5).
//
// Why this exists: controller-smoke.sh exercises the run-controller's MECHANICS (the 7 phases,
// receipt write-once, gate block-and-log, wave chunking) using SYNTHETIC fixture artifacts
// (fx-emit.json / fx-gate.json / fx-wave.json). Those basenames are NOT real inter-step pipeline
// outputs, so they are deliberately absent from engine/contracts/output-shapes.json. Before
// Phase 5 the controller reached route.js, which "passed silently" on any unmapped basename, so
// the fixtures relied on that silent pass. Phase 5 closes the silent-pass hole (an unmapped REAL
// output is now drift → REJECT). The correct fix is for the fixtures to NAME their own validator
// (a real step always names a validator) rather than ride a generic fall-through — so these
// happy-path fixtures bind here. This validator asserts only the minimal mechanics invariant:
// the declared output exists and is a regular file. It is a FIXTURE-ONLY shim and is never
// referenced by any of the 11 real step manifests (which bind engine/hooks/route.js).
'use strict';
const fs = require('fs');
const p = process.argv[2];
if (!p) { console.error('REJECT: validate-fixture-pass missing argument'); process.exit(2); }
try {
  if (!fs.statSync(p).isFile()) { console.error(`REJECT: fixture output not a regular file: ${p}`); process.exit(2); }
} catch (e) {
  console.error(`REJECT: fixture output missing: ${p} (${e.message})`); process.exit(2);
}
process.exit(0);
