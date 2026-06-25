#!/usr/bin/env node
'use strict';
// gen-enums-md.js — generate prompts/_generated/enums.md from engine/contracts/enums.json.
// Deterministic build step (no LLM): the validators IMPORT enums.json; agent prompts READ
// the generated markdown copy. Regenerate whenever enums.json changes so the two never drift.
//
//   node engine/bricks/gen-enums-md.js [--check]
//     (no flag) writes prompts/_generated/enums.md
//     --check   prints the rendered markdown to stdout, writes nothing (CI/diff use)
//
// Paths resolve relative to this module, so cwd does not matter.

const fs   = require('fs');
const path = require('path');

const ENUMS_PATH = path.join(__dirname, '..', 'contracts', 'enums.json');
const OUT_PATH   = path.join(__dirname, '..', '..', 'prompts', '_generated', 'enums.md');

const doc = JSON.parse(fs.readFileSync(ENUMS_PATH, 'utf8'));
const { enums, contract_gated } = doc;

const lines = [];
lines.push('<!-- GENERATED FILE — do not edit by hand. Source: engine/contracts/enums.json.');
lines.push('     Regenerate: node engine/bricks/gen-enums-md.js -->');
lines.push('');
lines.push('# Closed enums (engine contract)');
lines.push('');
lines.push('These are the **frozen value sets** the engine enforces. A value off-list is a HARD REJECT');
lines.push('at the enforcing validator. Value *meanings* live in the marketing prompts/definitions — this');
lines.push('file carries only the value sets, so a prompt rewrite cannot silently drift a contract.');
lines.push('');

for (const [name, e] of Object.entries(enums)) {
  lines.push(`## ${name}  \`(${e.kind})\``);
  lines.push('');
  lines.push('Allowed values:');
  for (const v of e.values) lines.push(`- \`${v}\``);
  lines.push('');
  if (e.enforced_by)  lines.push(`- **enforced by:** ${e.enforced_by.join(', ')}`);
  if (e.consumed_by)  lines.push(`- **consumed by:** ${e.consumed_by.join(', ')}`);
  if (e.note)         lines.push(`- **note:** ${e.note}`);
  if (e._verify_in_h0) lines.push(`- **H0 verify:** ${e._verify_in_h0}`);
  lines.push('');
}

if (contract_gated) {
  lines.push('---');
  lines.push('');
  lines.push('## Contract-gated (NOT yet frozen)');
  lines.push('');
  lines.push(contract_gated._note || '');
  lines.push('');
  for (const [name, g] of Object.entries(contract_gated)) {
    if (name.startsWith('_')) continue;
    lines.push(`### ${name}`);
    lines.push(`- **status:** ${g.status}`);
    if (g.referenced_by) lines.push(`- **referenced by:** ${g.referenced_by.join(', ')}`);
    if (g.note) lines.push(`- **note:** ${g.note}`);
    lines.push('');
  }
}

const out = lines.join('\n');

if (process.argv.includes('--check')) {
  process.stdout.write(out);
} else {
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, out);
  const rel = path.relative(path.join(__dirname, '..', '..'), OUT_PATH);
  console.log(`[gen-enums-md] wrote ${rel} (${Object.keys(enums).length} enums)`);
}
