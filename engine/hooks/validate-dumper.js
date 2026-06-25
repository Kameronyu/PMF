#!/usr/bin/env node
// validate-dumper.js — PostToolUse hook for the DUMPER agent's dump.json Write.
// Reject rules:
//   1. Any creative has canonical_niche != null or canonical_angle != null (dumper must not classify).
//   2. Any pitch has transformation != null (dumper must not classify).
//   3. Any pitch claims[] string is not a verbatim substring of the brand's clean corpus
//      (load-bearing gate against hallucinated/paraphrased claims).
//   4. angle_basis is missing on any creative.
// NOTE: per-creative classification fields dropped per design — this hook does NOT check them.
// Usage: node tools/hooks/validate-dumper.js <path-to-dump.json>
// Exit 0 = pass. Exit 2 + stderr = reject.
'use strict';

const fs = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log('Usage: node tools/hooks/validate-dumper.js <path-to-dump.json>');
  console.log('Validates the Dumper agent output against the dump.json schema.');
  console.log('Loads corpus/<slug>/clean/*.md for verbatim-substring claim verification.');
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('REJECT: missing argument — provide path to dump.json');
  process.exit(2);
}

let raw;
try {
  raw = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`REJECT: cannot read file "${filePath}" — ${err.message}`);
  process.exit(2);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`REJECT: invalid JSON in "${filePath}" — ${err.message}`);
  process.exit(2);
}

const slug = data.slug;
if (!slug || typeof slug !== 'string' || slug.trim() === '') {
  console.error('REJECT: dump.json missing or empty "slug"');
  process.exit(2);
}

const creatives = data.creatives;
if (!Array.isArray(creatives)) {
  console.error('REJECT: dump.json missing "creatives" array');
  process.exit(2);
}

// Load the clean corpus for this slug — used for verbatim-substring check.
// Resolve corpus path relative to dump.json location or CWD.
const dumpDir = path.dirname(path.resolve(filePath));
// Walk up from dump location to find corpus/<slug>/clean/
// Try multiple plausible locations:
//   1. Relative to the dump file's directory (e.g. corpus/<slug>/ is sibling)
//   2. corpus/ at CWD
//   3. Relative to the dump file itself (dump.json may live inside corpus/<slug>/)
function findCleanDir(slug, dumpDir) {
  const candidates = [
    path.join(dumpDir, '..', 'clean'),           // dump.json lives in corpus/<slug>/
    path.join(dumpDir, 'corpus', slug, 'clean'),  // CWD-relative corpus/
    path.join(process.cwd(), 'corpus', slug, 'clean'),
    path.join(dumpDir, slug, 'clean'),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c)) return c;
  }
  return null;
}

const cleanDir = findCleanDir(slug, dumpDir);

// Build the clean corpus string (concatenation of all .md files in clean/)
let cleanCorpus = '';
let cleanCorpusLoaded = false;
if (cleanDir) {
  try {
    const files = fs.readdirSync(cleanDir).filter(f => f.endsWith('.md'));
    const parts = [];
    for (const f of files) {
      parts.push(fs.readFileSync(path.join(cleanDir, f), 'utf8'));
    }
    cleanCorpus = parts.join('\n');
    cleanCorpusLoaded = true;
  } catch (err) {
    // Non-fatal for the corpus load itself; will flag below if claims exist
    cleanCorpusLoaded = false;
  }
}

const violations = [];

for (let ci = 0; ci < creatives.length; ci++) {
  const creative = creatives[ci];
  const cLabel = creative.creative_id || `creative[${ci}]`;

  // Rule 1: canonical_niche must be null (dumper must not classify)
  if (creative.canonical_niche !== null && creative.canonical_niche !== undefined) {
    violations.push(`REJECT: creative "${cLabel}" has canonical_niche set ("${creative.canonical_niche}") — dumper must not classify`);
  }

  // Rule 1: canonical_angle must be null (dumper must not classify)
  if (creative.canonical_angle !== null && creative.canonical_angle !== undefined) {
    violations.push(`REJECT: creative "${cLabel}" has canonical_angle set ("${creative.canonical_angle}") — dumper must not classify`);
  }

  // Rule 4: angle_basis must be present
  if (!creative.angle_basis || typeof creative.angle_basis !== 'string' || creative.angle_basis.trim() === '') {
    violations.push(`REJECT: creative "${cLabel}" missing or empty "angle_basis"`);
  }

  // Check pitches
  const pitches = creative.pitches;
  if (Array.isArray(pitches)) {
    for (let pi = 0; pi < pitches.length; pi++) {
      const pitch = pitches[pi];
      const pLabel = `creative "${cLabel}" pitch[${pi}]`;

      // Rule 2: transformation must be null
      if (pitch.transformation !== null && pitch.transformation !== undefined) {
        violations.push(`REJECT: ${pLabel} has transformation set ("${pitch.transformation}") — dumper must not classify`);
      }

      // Rule 3: each claims[] string must be a verbatim substring of the clean corpus
      if (Array.isArray(pitch.claims)) {
        for (let ki = 0; ki < pitch.claims.length; ki++) {
          const claim = pitch.claims[ki];
          if (typeof claim !== 'string' || claim.trim() === '') continue;

          if (!cleanCorpusLoaded) {
            // Cannot verify without corpus — flag as a missing-corpus error
            violations.push(`REJECT: ${pLabel} claims[${ki}] cannot be verified — clean corpus not found at corpus/${slug}/clean/ (slug: "${slug}")`);
          } else {
            // Verbatim substring check — case-sensitive
            if (!cleanCorpus.includes(claim)) {
              const preview = claim.length > 80 ? claim.slice(0, 80) + '…' : claim;
              violations.push(`REJECT: ${pLabel} claims[${ki}] not a verbatim substring of clean corpus — "${preview}"`);
            }
          }
        }
      }
    }
  }
}

if (violations.length > 0) {
  for (const v of violations) {
    console.error(v);
  }
  process.exit(2);
}

// Pass — exit 0 silently
process.exit(0);
