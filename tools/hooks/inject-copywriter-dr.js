#!/usr/bin/env node
// inject-copywriter-dr.js — DR craft-knowledge bundler for the copywriter skill.
//
// WHY THIS EXISTS
//   copywriter/SKILL.md used to claim its DR supporting-knowledge files were
//   "auto-injected." Nothing injected them — there is no such harness mechanism, and
//   the copywriter runs as an @-referenced subagent, where settings-based PreToolUse
//   hooks do NOT fire. The 2026-06 Arduview run executed the market-selection gate
//   with ZERO DR-doc grounding because this step was silently skipped (SKILL.md
//   falsely claimed the files were auto-injected; no such mechanism exists).
//
//   This script is the deterministic fix: it concatenates the three canonical craft DR
//   files into one generated bundle that SKILL.md `read_first` loads with a single Read.
//   One Read works on every invocation path (subagent @-ref, main-thread Skill tool,
//   or direct read) — no event-hook semantics to silently misfire.
//
//   This is NOT the Section Analyzer's inject-dr.js or the Funnel Architect's
//   inject-funnel-architect-dr.js — different component, different allowlist.
//   Do not merge them.
//
// THE THREE FILES (hardcoded allowlist — never from argv/untrusted input):
//   copywriting--spencer-origins.md   — word/line-level craft: power-word substitution,
//                                       show-dont-tell, steal-frameworks-not-words,
//                                       Grade-6 readability. Primary file for HOW a
//                                       line is written.
//   copywriting--carl-weische.md      — section/paragraph construction and flow:
//                                       Hook-Pain-Bridge-Outcome, feature-to-benefit,
//                                       sensory language, advertorial frameworks,
//                                       deliberate-element flow model,
//                                       readability/dont-dilute. Primary file for HOW
//                                       a section is built.
//   copywriting--mark-builds-brands.md — body-copy structure (eight-element sales page,
//                                        advertorial body structure, PIG
//                                        punch-in-the-gut) and slippery-slide
//                                        copy-chiefing pass. Secondary file for
//                                        body-copy structure and final flow check.
//
//   NOTE: The fourth copywriting DR file is DELIBERATELY EXCLUDED per operator spec
//   (see 15-SPEC-copywriter.md section SUPPORTING KNOWLEDGE for rationale) — off-target
//   for landing-page prose craft (too weighted toward outreach/sales-call/offer material).
//
// SECURITY: filenames are a hardcoded allowlist; each resolved path is verified to
// stay under ~/knowledge/dr-marketing/ before reading (path-traversal guard).
// Missing file -> warn to stderr and continue; never crash, never fabricate content.
//
// USAGE
//   node tools/hooks/inject-copywriter-dr.js            # write the bundle to its default path
//   node tools/hooks/inject-copywriter-dr.js --stdout   # emit to stdout instead
//   node tools/hooks/inject-copywriter-dr.js --out=PATH # write to a custom path
//   node tools/hooks/inject-copywriter-dr.js --help
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
const DEFAULT_OUT = path.resolve(__dirname, '..', '..', '.claude', 'skills', 'copywriter', '_dr-context.generated.md');

// THE THREE FILES -- order is intentional: word/line craft first (Spencer),
// then section/paragraph construction (Carl), then body-copy structure + chiefing pass (Mark).
// The fourth copywriting DR file is excluded per operator spec (off-target for LP prose craft).
const ALLOWLIST = [
  { file: 'copywriting--spencer-origins.md',    use: 'Word/line-level craft: power-word substitution, show-dont-tell, steal-frameworks-not-words, Grade-6 readability -- primary file for HOW a line is written' },
  { file: 'copywriting--carl-weische.md',        use: 'Section/paragraph construction and flow: Hook-Pain-Bridge-Outcome, feature-to-benefit, sensory language, advertorial frameworks, deliberate-element flow model, readability/dont-dilute -- primary file for HOW a section is built' },
  { file: 'copywriting--mark-builds-brands.md',  use: 'Body-copy structure (eight-element sales page, advertorial body structure, PIG punch-in-the-gut) and slippery-slide copy-chiefing pass -- secondary file for body-copy structure and final flow check' },
];

if (opts.help) {
  console.log('inject-copywriter-dr.js -- bundle the 3 craft DR files for the copywriter skill.');
  console.log('');
  console.log('  node tools/hooks/inject-copywriter-dr.js            write bundle to default path');
  console.log('  node tools/hooks/inject-copywriter-dr.js --stdout   emit to stdout');
  console.log('  node tools/hooks/inject-copywriter-dr.js --out=PATH write to custom path');
  console.log('');
  console.log('Default out:', DEFAULT_OUT);
  console.log('Files (hardcoded allowlist, all under ' + DR_DIR + '):');
  for (const { file } of ALLOWLIST) console.log('  ' + file);
  console.log('');
  console.log('NOTE: The fourth copywriting DR file is excluded per operator spec.');
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
    console.error(`[inject-copywriter] SECURITY: "${file}" contains path separators -- skipped`);
    continue;
  }
  const resolved = path.join(DR_DIR, file);
  if (!isUnderDrDir(resolved)) {
    console.error(`[inject-copywriter] SECURITY: "${resolved}" outside dr-marketing dir -- skipped`);
    continue;
  }
  if (!fs.existsSync(resolved)) {
    console.error(`[inject-copywriter] WARNING: not found, skipping -- ${resolved}`);
    continue;
  }
  let content;
  try {
    content = fs.readFileSync(resolved, 'utf8');
  } catch (err) {
    console.error(`[inject-copywriter] WARNING: cannot read "${resolved}" -- ${err.message} -- skipping`);
    continue;
  }
  const bar = '='.repeat(72);
  parts.push(`\n${bar}\n=== DR FILE: ${file}\n=== Use in this skill: ${use}\n${bar}\n\n${content}\n`);
  loaded++;
}

if (loaded === 0) {
  console.error('[inject-copywriter] REJECT: zero DR files loaded -- refusing to write an empty bundle.');
  process.exit(2);
}

const banner = [
  '<!-- GENERATED FILE -- DO NOT EDIT BY HAND.',
  '     Regenerate: node tools/hooks/inject-copywriter-dr.js',
  '     Source: ~/knowledge/dr-marketing/ (3-file allowlist in the generator).',
  `     Files bundled: ${loaded}/${ALLOWLIST.length}. -->`,
  '',
  '# This is the Copywriter craft knowledge bundle',
  '',
  'CRAFT LAYER -- word/line and section/paragraph writing craft, NOT strategy.',
  "The Architect's copy brief governs strategy (angle, belief assignment, install spec,",
  'source routing). These files govern HOW the words are written once strategy is set.',
  '',
  'Use these files to reason about flow, word choice, show-dont-tell, sentence construction,',
  'and structural patterns. Do NOT let them override the brief or the locked format rules.',
  '',
  'NOTE: The fourth copywriting DR file is deliberately excluded per operator spec --',
  'off-target for landing-page prose craft (weighted toward outreach/sales-call material).',
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
  console.error(`[inject-copywriter] REJECT: cannot write "${outPath}" -- ${err.message}`);
  process.exit(2);
}
console.error(`[inject-copywriter] wrote ${combined.length} chars (${loaded}/${ALLOWLIST.length} files) -> ${outPath}`);
process.exit(0);
