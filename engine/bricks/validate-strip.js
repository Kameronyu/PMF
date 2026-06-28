#!/usr/bin/env node
// validate-strip.js
// Deterministic OUTPUT CHECK for the strip-for-b agent (pipeline-audit). Hooks do not fire in
// subagents, so the orchestrator runs this on every stripped copy BEFORE it is injected into
// Reviewer B. A non-zero exit means "the strip is not acceptable — re-spawn the strip agent." This
// is what makes the strip a guaranteed step, not an honor-system one.
//
// Checks (all must pass):
//   1. the stripped file exists and is non-empty;
//   2. it is STRICTLY SMALLER than the original (proof something was actually removed — catches a
//      verbatim no-op where the agent just copied the file);
//   3. every --must-contain token is present (the data B grounds against survived the strip);
//   4. no --must-not-contain token is present (the verdicts/recommendation/caveat-prose were dropped).
// Tokens are matched case-insensitively as plain substrings, separated by '||'.
//
// Usage:
//   node tools/validate-strip.js --original=<path> --stripped=<path> \
//        [--must-contain="t1||t2"] [--must-not-contain="x1||x2"] [--min-shrink=0.0] [--help]
//
//   --min-shrink=<f>  require the stripped file to be at least this fraction smaller (0..1).
//                     default 0 (any strict shrink passes); a value like 0.05 demands >=5% removed.
//
// Exit codes:
//   0 = strip acceptable
//   1 = strip REJECTED (prints every failed check) — orchestrator must re-spawn strip-for-b
//   2 = bad usage / unreadable input
'use strict';

const fs   = require('fs');
const path = require('path');

const opts = Object.fromEntries(
  process.argv.slice(2).filter(a => a.startsWith('--')).map(a => {
    const i = a.indexOf('=');
    return i === -1 ? [a.replace(/^--/, ''), true] : [a.slice(2, i), a.slice(i + 1)];
  })
);

if (opts.help) {
  console.log([
    'Usage: node tools/validate-strip.js --original=<path> --stripped=<path> \\',
    '         [--must-contain="t1||t2"] [--must-not-contain="x1||x2"] [--min-shrink=0.0]',
    '',
    'Gates a strip-for-b output: exists + non-empty + strictly smaller than original + must/must-not',
    'contain token checks. Exit 0 pass, 1 rejected, 2 bad usage.',
  ].join('\n'));
  process.exit(0);
}

function need(flag) {
  if (typeof opts[flag] !== 'string' || !opts[flag]) {
    console.error(`ERROR: --${flag}=<path> is required`);
    process.exit(2);
  }
  return path.resolve(opts[flag]);
}
const originalPath = need('original');
const strippedPath = need('stripped');

function readOr2(p, label) {
  if (!fs.existsSync(p)) { console.error(`ERROR: ${label} not found — ${p}`); process.exit(2); }
  return fs.readFileSync(p, 'utf8');
}
const original = readOr2(originalPath, 'original');
const stripped = fs.existsSync(strippedPath) ? fs.readFileSync(strippedPath, 'utf8') : null;

const tokens = (v) => (typeof v === 'string' && v.length)
  ? v.split('||').map(s => s.trim()).filter(Boolean) : [];
const mustContain    = tokens(opts['must-contain']);
const mustNotContain = tokens(opts['must-not-contain']);
const minShrink = opts['min-shrink'] ? parseFloat(opts['min-shrink']) : 0;

const fails = [];

// 1 + 2: existence / non-empty / strictly-smaller
if (stripped === null) {
  fails.push(`stripped file does not exist — ${strippedPath} (strip-for-b did not run / wrote nowhere)`);
} else {
  if (stripped.length === 0) fails.push('stripped file is EMPTY (a strip is not a delete)');
  if (stripped.length >= original.length) {
    fails.push(`stripped is NOT smaller than original (${stripped.length} >= ${original.length}) — ` +
      `nothing was removed; likely a verbatim no-op`);
  } else {
    const shrink = 1 - stripped.length / original.length;
    if (minShrink > 0 && shrink < minShrink) {
      fails.push(`shrink ${(shrink * 100).toFixed(1)}% < required ${(minShrink * 100).toFixed(1)}%`);
    }
  }
}

if (stripped !== null) {
  const hay = stripped.toLowerCase();
  for (const t of mustContain) {
    if (!hay.includes(t.toLowerCase())) fails.push(`MISSING required token (data B must keep): "${t}"`);
  }
  for (const t of mustNotContain) {
    if (hay.includes(t.toLowerCase())) fails.push(`PRESENT forbidden token (should have been stripped): "${t}"`);
  }
}

const tag = `[validate-strip] ${path.basename(strippedPath)}`;
if (fails.length) {
  console.error(`${tag} REJECTED:`);
  fails.forEach(f => console.error(`  - ${f}`));
  process.exit(1);
}
const shrinkPct = ((1 - stripped.length / original.length) * 100).toFixed(1);
console.error(`${tag} OK — ${original.length}->${stripped.length} chars (-${shrinkPct}%), ` +
  `must-contain ${mustContain.length} ok, must-not-contain ${mustNotContain.length} ok`);
process.exit(0);
