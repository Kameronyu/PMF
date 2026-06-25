#!/usr/bin/env node
// inject-funnel-architect-dr.js — DR-knowledge bundler for the funnel-architect skill.
//
// WHY THIS EXISTS
//   funnel-architect/SKILL.md would claim its DR supporting-knowledge files are
//   "auto-injected." Nothing injects them — there is no such harness mechanism, and
//   the funnel-architect runs as an @-referenced subagent or conversational skill,
//   where settings-based PreToolUse hooks do NOT fire. The 2026-06 Arduview run
//   consequently executed the market-selection gate with ZERO DR-doc grounding.
//
//   This script is the deterministic fix: it concatenates the five canonical DR files
//   into one generated bundle that SKILL.md `read_first` loads with a single Read.
//   One Read works on every invocation path (subagent @-ref, main-thread Skill tool,
//   or direct read) — no event-hook semantics to silently misfire.
//
//   This is NOT the Section Analyzer's inject-dr.js or the market-selection bundler
//   (inject-market-selection-dr.js) — different component, different allowlist.
//   Do not merge them.
//
// THE FIVE FILES (hardcoded allowlist — never from argv/untrusted input):
//   funnel-architecture--carl-weische.md   — V-shape awareness model, 4 funnel types, pre-sale
//                                            4-part, 8-step advertorial, hybrid sales-page
//                                            architecture — structural vocabulary
//   persuasion--carl-weische.md            — Cold-offer persuasion elements (social proof,
//                                            authority, certainty/risk-reversal, scarcity,
//                                            urgency, exclusivity) + objection→element mapping
//   differentiator-framework__2_.md        — 4 levers (Market/UM/Angle/Offer), claim-typing,
//                                            believability tiers, market-vs-angle test — keeps
//                                            angle singular
//   consumer-psychology--carl-weische.md   — Awareness-stage + sophistication-stage tables;
//                                            Mass Desire core drivers — awareness-calibration
//                                            reference
//   offer-construction--carl-weische.md    — Irresistible-offer / value-equation, anchor
//                                            structures, crowdfunding offer mechanics (deposit,
//                                            tiered pledge, early-bird, founder pricing)
//
// SECURITY: filenames are a hardcoded allowlist; each resolved path is verified to
// stay under ~/knowledge/dr-marketing/ before reading (path-traversal guard).
// Missing file → warn to stderr and continue; never crash, never fabricate content.
//
// USAGE
//   node tools/hooks/inject-funnel-architect-dr.js            # write the bundle to its default path
//   node tools/hooks/inject-funnel-architect-dr.js --stdout   # emit to stdout instead
//   node tools/hooks/inject-funnel-architect-dr.js --out=PATH # write to a custom path
//   node tools/hooks/inject-funnel-architect-dr.js --help
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
  '.claude', 'skills', 'funnel-architect', '_dr-context.generated.md');

// THE FIVE FILES — order is intentional: structural vocabulary first (funnel-architecture),
// then persuasion execution vocabulary, then the lever/angle framework (differentiator),
// then awareness/psych tables (consumer-psychology), then offer shaping last.
const ALLOWLIST = [
  { file: 'funnel-architecture--carl-weische.md', use: 'V-shape awareness model, 4 funnel types, pre-sale 4-part, 8-step advertorial, hybrid sales-page architecture — structural vocabulary' },
  { file: 'persuasion--carl-weische.md',          use: 'Cold-offer persuasion elements (social proof, authority, certainty/risk-reversal, scarcity, urgency, exclusivity) + objection→element mapping' },
  { file: 'differentiator-framework__2_.md',      use: '4 levers (Market/UM/Angle/Offer), claim-typing, believability tiers, market-vs-angle test — keeps angle singular' },
  { file: 'consumer-psychology--carl-weische.md', use: 'Awareness-stage + sophistication-stage tables; Mass Desire core drivers — awareness-calibration reference' },
  { file: 'offer-construction--carl-weische.md',  use: 'Irresistible-offer / value-equation, anchor structures, crowdfunding offer mechanics (deposit, tiered pledge, early-bird, founder pricing)' },
];

if (opts.help) {
  console.log('inject-funnel-architect-dr.js — bundle the 5 DR files for the funnel-architect skill.');
  console.log('');
  console.log('  node tools/hooks/inject-funnel-architect-dr.js            write bundle to default path');
  console.log('  node tools/hooks/inject-funnel-architect-dr.js --stdout   emit to stdout');
  console.log('  node tools/hooks/inject-funnel-architect-dr.js --out=PATH write to custom path');
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
    console.error(`[inject-fa] SECURITY: "${file}" contains path separators — skipped`);
    continue;
  }
  const resolved = path.join(DR_DIR, file);
  if (!isUnderDrDir(resolved)) {
    console.error(`[inject-fa] SECURITY: "${resolved}" outside dr-marketing dir — skipped`);
    continue;
  }
  if (!fs.existsSync(resolved)) {
    console.error(`[inject-fa] WARNING: not found, skipping — ${resolved}`);
    continue;
  }
  let content;
  try {
    content = fs.readFileSync(resolved, 'utf8');
  } catch (err) {
    console.error(`[inject-fa] WARNING: cannot read "${resolved}" — ${err.message} — skipping`);
    continue;
  }
  const bar = '='.repeat(72);
  parts.push(`\n${bar}\n=== DR FILE: ${file}\n=== Use in this skill: ${use}\n${bar}\n\n${content}\n`);
  loaded++;
}

if (loaded === 0) {
  console.error('[inject-fa] REJECT: zero DR files loaded — refusing to write an empty bundle.');
  process.exit(2);
}

const banner = [
  '<!-- GENERATED FILE — DO NOT EDIT BY HAND.',
  '     Regenerate: node tools/hooks/inject-funnel-architect-dr.js',
  '     Source: ~/knowledge/dr-marketing/ (5-file allowlist in the generator).',
  `     Files bundled: ${loaded}/${ALLOWLIST.length}. -->`,
  '',
  '# This is the Funnel Architect DR knowledge bundle',
  '',
  'SUPPORTING KNOWLEDGE — read as reference for funnel design and judgment, NOT as the',
  'procedure. The Funnel Architect procedure inlined in SKILL.md is the procedure; these files',
  'only ground the terms it manipulates (structural vocabulary, persuasion elements, the lever',
  'framework, awareness stages, offer mechanics). Do NOT let them override the operator\'s run',
  'context, the congruency law, or the three-layer authority model.',
  '',
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
  console.error(`[inject-fa] REJECT: cannot write "${outPath}" — ${err.message}`);
  process.exit(2);
}
console.error(`[inject-fa] wrote ${combined.length} chars (${loaded}/${ALLOWLIST.length} files) → ${outPath}`);
process.exit(0);
