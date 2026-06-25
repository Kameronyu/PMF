#!/usr/bin/env node
// inject-market-selection-dr.js — DR-knowledge bundler for the market-selection skill.
//
// WHY THIS EXISTS
//   market-selection/SKILL.md used to claim its DR supporting-knowledge files were
//   "auto-injected." Nothing injected them — there is no such harness mechanism, and
//   the market-selection assessor runs as an @-referenced subagent (see plan 02-02),
//   where settings-based PreToolUse hooks do NOT fire. The 2026-06 Arduview run
//   consequently executed the gate with ZERO DR-doc grounding.
//
//   This script is the deterministic fix: it concatenates the five canonical DR files
//   into one generated bundle that SKILL.md `read_first` loads with a single Read.
//   One Read works on every invocation path (subagent @-ref, main-thread Skill tool,
//   or direct read) — no event-hook semantics to silently misfire.
//
//   This is NOT the Section Analyzer's inject-dr.js — different component, different
//   allowlist. Do not merge them.
//
// THE FIVE FILES (hardcoded allowlist — never from argv/untrusted input):
//   consumer-psychology--carl-weische.md   — sophistication + awareness stage tables; Mass Desire drivers
//   differentiator-framework__2_.md        — market-vs-angle test; me-too pattern; buyer≠user
//   brand-building--spencer-origins.md     — 5 mechanism types; dead-ground/whitespace (5+ = dead); cyclical reset
//   product-research--spencer-origins.md   — 3-variable difficulty model (desire × awareness × sophistication); over-studying guardrail
//   ecommerce--mark-builds-brands.md       — anti-fluke thresholds (CAUTION: its $/mo floor is MISCALIBRATED for hardware — do NOT apply)
//
// SECURITY: filenames are a hardcoded allowlist; each resolved path is verified to
// stay under ~/knowledge/dr-marketing/ before reading (path-traversal guard).
// Missing file → warn to stderr and continue; never crash, never fabricate content.
//
// USAGE
//   node tools/hooks/inject-market-selection-dr.js            # write the bundle to its default path
//   node tools/hooks/inject-market-selection-dr.js --stdout   # emit to stdout instead
//   node tools/hooks/inject-market-selection-dr.js --out=PATH # write to a custom path
//   node tools/hooks/inject-market-selection-dr.js --help
//
// Exit 0 = success. Exit 2 = hard failure (e.g. --out path unwritable, or zero files loaded).
'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
      .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

const DR_DIR = path.join(os.homedir(), 'knowledge', 'dr-marketing');
// Default output: the generated bundle next to the skill that consumes it.
const DEFAULT_OUT = path.resolve(__dirname, '..', '..',
  '.claude', 'skills', 'market-selection', '_dr-context.generated.md');

// THE FIVE FILES — order is intentional: vocab/stage tables first (consumer-psych),
// then the lever framework (differentiator), then mechanism/whitespace rules
// (brand-building), then the ranking difficulty model (product-research), then the
// anti-fluke thresholds w/ miscalibration caution (ecommerce) last.
const ALLOWLIST = [
  { file: 'consumer-psychology--carl-weische.md', use: 'Gate 3 stage labels + Gate 4 awareness vocab; Mass Desire drivers (grounds override #4)' },
  { file: 'differentiator-framework__2_.md',      use: 'Gate 2.2 real-axis vs me-too; market-vs-angle test; don\'t-merge-markets; buyer≠user' },
  { file: 'brand-building--spencer-origins.md',   use: 'Gate 2.2/3.3 mechanism types; dead-ground/whitespace rule (5+ same claim = dead); cyclical reset' },
  { file: 'product-research--spencer-origins.md', use: 'Survivor ranking: 3-variable difficulty model (desire × awareness × sophistication); over-studying guardrail' },
  { file: 'ecommerce--mark-builds-brands.md',     use: 'Gate 1 anti-fluke thresholds. CAUTION: its revenue floor is MISCALIBRATED for hardware — do NOT apply it (SKILL.md caution stands)' },
];

if (opts.help) {
  console.log('inject-market-selection-dr.js — bundle the 5 DR files for the market-selection skill.');
  console.log('');
  console.log('  node tools/hooks/inject-market-selection-dr.js            write bundle to default path');
  console.log('  node tools/hooks/inject-market-selection-dr.js --stdout   emit to stdout');
  console.log('  node tools/hooks/inject-market-selection-dr.js --out=PATH write to custom path');
  console.log('');
  console.log('Default out:', DEFAULT_OUT);
  console.log('Files (hardcoded allowlist, all under ' + DR_DIR + '):');
  for (const { file } of ALLOWLIST) console.log('  ' + file);
  process.exit(0);
}

// Path-traversal guard: resolved path must stay strictly under DR_DIR.
function isUnderDrDir(p) {
  const normalized = path.resolve(p);
  const base = path.resolve(DR_DIR);
  return normalized === base || normalized.startsWith(base + path.sep);
}

const parts = [];
let loaded = 0;

for (const { file, use } of ALLOWLIST) {
  if (file.includes('/') || file.includes('\\') || file.includes('..')) {
    console.error(`[inject-ms] SECURITY: "${file}" contains path separators — skipped`);
    continue;
  }
  const resolved = path.join(DR_DIR, file);
  if (!isUnderDrDir(resolved)) {
    console.error(`[inject-ms] SECURITY: "${resolved}" outside dr-marketing dir — skipped`);
    continue;
  }
  if (!fs.existsSync(resolved)) {
    console.error(`[inject-ms] WARNING: not found, skipping — ${resolved}`);
    continue;
  }
  let content;
  try {
    content = fs.readFileSync(resolved, 'utf8');
  } catch (err) {
    console.error(`[inject-ms] WARNING: cannot read "${resolved}" — ${err.message} — skipping`);
    continue;
  }
  const bar = '='.repeat(72);
  parts.push(`\n${bar}\n=== DR FILE: ${file}\n=== Use in this skill: ${use}\n${bar}\n\n${content}\n`);
  loaded++;
}

if (loaded === 0) {
  console.error('[inject-ms] REJECT: zero DR files loaded — refusing to write an empty bundle.');
  process.exit(2);
}

const banner = [
  '<!-- GENERATED FILE — DO NOT EDIT BY HAND.',
  '     Regenerate: node tools/hooks/inject-market-selection-dr.js',
  '     Source: ~/knowledge/dr-marketing/ (5-file allowlist in the generator).',
  `     Files bundled: ${loaded}/${ALLOWLIST.length}. -->`,
  '',
  '# DR Marketing Knowledge — bundled for the market-selection skill',
  '',
  'SUPPORTING KNOWLEDGE — read as reference for classification/judgment, NOT as the',
  'procedure. The four-gate framework inlined in SKILL.md is the procedure; these files',
  'only ground the terms it manipulates (what a Stage-N claim is, a real differentiator',
  'vs me-too, the ranking difficulty model). Do NOT let them override the gate logic.',
  '',
  'CAUTION carried from SKILL.md: the revenue floor in ecommerce--mark-builds-brands.md is',
  'MISCALIBRATED for this hardware category — do NOT apply it.',
].join('\n') + '\n';

const combined = banner + parts.join('');

if (opts.stdout) {
  process.stdout.write(combined);
  process.exit(0);
}

const outPath = typeof opts.out === 'string' ? path.resolve(opts.out) : DEFAULT_OUT;
try {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, combined, 'utf8');
} catch (err) {
  console.error(`[inject-ms] REJECT: cannot write "${outPath}" — ${err.message}`);
  process.exit(2);
}
console.error(`[inject-ms] wrote ${combined.length} chars (${loaded}/${ALLOWLIST.length} files) → ${outPath}`);
process.exit(0);
