#!/usr/bin/env node
// validate-receipt.js
// Deterministic RECEIPT CHECK for pipeline-audit reviewers. Each reviewer is required to open its
// output with a CONTEXT RECEIPT line naming the law/evidence files it actually received. This script
// compares that line to the inject manifest (the ground truth of what audit-inject.js assembled). A
// mismatch means the injected bytes did NOT all reach the model → the orchestrator must re-spawn the
// reviewer. This replaces "the orchestrator eyeballs the receipt" with a hard gate.
//
// Usage:
//   node tools/validate-receipt.js --manifest=<inject .manifest.json> --output=<reviewer output file>
//   node tools/validate-receipt.js --manifest=<...> --receipt="CONTEXT RECEIPT: law_files=2 [a,b]; evidence_files=3 [c,d,e]"
//
//   --manifest  REQUIRED. The <out>.manifest.json sidecar audit-inject.js wrote for this reviewer.
//   --output    Path to the reviewer's output; the script greps the first CONTEXT RECEIPT line.
//   --receipt   The receipt line itself (alternative to --output).
//
// Exit codes:
//   0 = receipt matches the manifest (counts AND basename sets)
//   1 = mismatch (prints every discrepancy) — orchestrator re-spawns the reviewer
//   2 = bad usage / no receipt line found / unreadable manifest
'use strict';

const fs   = require('fs');
const path = require('path');

const opts = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith('--')).map(a => {
    const i = a.indexOf('=');
    return i === -1 ? [a.replace(/^--/, ''), true] : [a.slice(2, i), a.slice(i + 1)];
  })
);

if (opts.help || !opts.manifest) {
  console.log('Usage: node tools/validate-receipt.js --manifest=<inject.manifest.json> (--output=<file> | --receipt="...")');
  process.exit(opts.help ? 0 : 2);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(path.resolve(opts.manifest), 'utf8'));
} catch (e) {
  console.error(`ERROR: cannot read inject manifest "${opts.manifest}" — ${e.message}`);
  process.exit(2);
}

// Get the receipt line.
let receiptLine = null;
if (typeof opts.receipt === 'string' && opts.receipt.length) {
  receiptLine = opts.receipt;
} else if (typeof opts.output === 'string' && opts.output.length) {
  const text = fs.existsSync(opts.output) ? fs.readFileSync(opts.output, 'utf8') : '';
  receiptLine = text.split(/\r?\n/).find(l => /CONTEXT RECEIPT:/i.test(l)) || null;
}
if (!receiptLine) {
  console.error('ERROR: no CONTEXT RECEIPT line found (reviewer must emit it as its first output). ' +
    'Treat as a FAILED receipt — re-spawn.');
  process.exit(2);
}

// Parse "law_files=N [a, b]" and "evidence_files=M [c, d]".
function parseGroup(label) {
  const m = receiptLine.match(new RegExp(label + '\\s*=\\s*(\\d+)\\s*\\[([^\\]]*)\\]', 'i'));
  if (!m) return null;
  const count = parseInt(m[1], 10);
  const names = m[2].split(',').map(s => s.trim()).filter(Boolean);
  return { count, names };
}
const rcLaw = parseGroup('law_files');
const rcEv  = parseGroup('evidence_files');
if (!rcLaw || !rcEv) {
  console.error(`ERROR: receipt line malformed — "${receiptLine.trim()}". Expected ` +
    '"CONTEXT RECEIPT: law_files=N [..]; evidence_files=M [..]". Re-spawn.');
  process.exit(2);
}

const expLawNames = (manifest.law || []).map(f => f.file);
const expEvNames  = (manifest.evidence || []).map(f => f.file);
const setEq = (a, b) => { const A = new Set(a), B = new Set(b);
  return [[...A].filter(x => !B.has(x)), [...B].filter(x => !A.has(x))]; };

const fails = [];
if (rcLaw.count !== (manifest.law_count ?? expLawNames.length))
  fails.push(`law_files count: receipt ${rcLaw.count} vs manifest ${manifest.law_count}`);
if (rcEv.count !== (manifest.evidence_count ?? expEvNames.length))
  fails.push(`evidence_files count: receipt ${rcEv.count} vs manifest ${manifest.evidence_count}`);

const [lawExtra, lawMiss] = setEq(rcLaw.names, expLawNames);
if (lawExtra.length) fails.push(`law names reviewer reported but were NOT injected: ${lawExtra.join(', ')}`);
if (lawMiss.length)  fails.push(`law names injected but MISSING from receipt: ${lawMiss.join(', ')}`);
const [evExtra, evMiss] = setEq(rcEv.names, expEvNames);
if (evExtra.length) fails.push(`evidence names reviewer reported but were NOT injected: ${evExtra.join(', ')}`);
if (evMiss.length)  fails.push(`evidence names injected but MISSING from receipt: ${evMiss.join(', ')}`);

if (fails.length) {
  console.error(`[validate-receipt] MISMATCH (${manifest.reviewer || '?'}) — re-spawn the reviewer:`);
  fails.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}
console.error(`[validate-receipt] OK (${manifest.reviewer || '?'}) — law ${rcLaw.count}, evidence ${rcEv.count}, names match`);
process.exit(0);
