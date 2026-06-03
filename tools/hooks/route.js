#!/usr/bin/env node
// route.js — PostToolUse hook dispatcher.
// Routes Write events to the correct per-agent validator(s) based on the written file path.
// Called by the hooks.PostToolUse command; receives the file path as $1 (process.argv[2]).
//
// Routing rules:
//   <path>/brands.json    → validate-finder.js + validate-revenue.js
//   <path>/dump.json      → validate-dumper.js
//   <path>/space-map.json → validate-classifier.js
//   anything else         → pass (exit 0)
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
  runValidator('validate-finder.js', filePath);
  runValidator('validate-revenue.js', filePath);
} else if (base === 'dump.json') {
  runValidator('validate-dumper.js', filePath);
} else if (base === 'space-map.json') {
  runValidator('validate-classifier.js', filePath);
}
// Any other file path: pass silently
process.exit(0);
