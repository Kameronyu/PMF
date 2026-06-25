#!/usr/bin/env node
// tools/funnel-claim-tally.js
// Deterministic pre-pass script — NOT an agent (CLAUDE.md one-job-per-brick law).
//
// PURPOSE: Count typed sub-claims (moves[] tags) across all analyzed funnels in one
// funnel store and classify each move key as DEAD GROUND (saturated; funnel_count >=
// threshold) or WHITESPACE (below threshold). Output is consumed by the Funnel Architect
// at Step 6 (dead-ground / whitespace analysis).
//
// INPUT: All *.json files under runs/<space>/funnels/ that do NOT start with '_'.
//        Each file is one funnel record (funnel_id + belief_records[]).
//
// OUTPUT: runs/<space>/funnels/_tally.json  (default)
//         or --out=<path> override
//         or stdout via --json
//
// Pattern mirrors aggregate-mechanisms-in-play.js: same arg parsing, fail(), distinct(),
// stderr log prefix [claim-tally], exit codes, stable sort.
//
// Security: --space is sanitized ([a-z0-9._-] only) before use in filesystem paths —
// T-15-02-1 parity with funnel-rag-query.js (T-03-13).
//
// Usage:
//   node tools/funnel-claim-tally.js --space=<space> [--threshold=<n>] [--out=<path>] [--json] [--help]

'use strict';

const fs   = require('fs');
const path = require('path');

// --- CLI arg parsing (identical pattern to all other repo tools) ---
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
      .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

if (opts.help || !opts.space) {
  console.log([
    'Usage: node tools/funnel-claim-tally.js --space=<space> [options]',
    '',
    'Counts moves[] tags across all analyzed funnels and classifies each as dead ground or whitespace.',
    '',
    '  --space        required. market space slug (sanitized to [a-z0-9._-])',
    '                 Resolves to runs/<space>/funnels/',
    '  --threshold=n  integer. funnels-per-move to classify as dead ground (default 5; must be >= 1)',
    '  --out=<path>   write JSON output to a file (default: runs/<space>/funnels/_tally.json)',
    '  --json         emit JSON to stdout (in addition to --out if set, or instead if --out not set)',
    '  --help         this help',
  ].join('\n'));
  process.exit(opts.space ? 0 : (opts.help ? 0 : 2));
}

// --- helpers ---
function fail(msg) { console.error(`[claim-tally] REJECT: ${msg}`); process.exit(2); }
const distinct = (arr) => [...new Set(arr)];

// --- path sanitization (T-03-13 / T-15-02-1 parity with funnel-rag-query.js) ---
function sanitizePathSegment(s) {
  return String(s).replace(/[^a-z0-9._-]/gi, '').replace(/\.\.+/g, '').toLowerCase();
}

// --- 1. RESOLVE PATHS ---
const space = sanitizePathSegment(opts.space);
if (!space) fail('--space is empty after sanitization');

const storeDir = path.join('runs', space, 'funnels');
const outPath  = opts.out ? String(opts.out) : path.join(storeDir, '_tally.json');

// validate threshold
let threshold;
if (opts.threshold !== undefined) {
  const raw = parseInt(opts.threshold, 10);
  if (opts.threshold === '0' || (typeof opts.threshold === 'string' && opts.threshold.startsWith('-'))) {
    fail('threshold must be >= 1');
  }
  threshold = isNaN(raw) ? 5 : raw;
  if (threshold < 1) fail('threshold must be >= 1');
} else {
  threshold = 5;
}

if (!fs.existsSync(storeDir)) {
  fail(`store directory does not exist: ${storeDir}`);
}

// --- 2. ENUMERATE FUNNEL FILES ---
const files = fs.readdirSync(storeDir)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'));

// --- helpers for empty-store path ---
function writeResult(result) {
  const json = JSON.stringify(result, null, 2) + '\n';
  if (opts.out || !opts.json) {
    // write to file (default path or explicit --out)
    fs.writeFileSync(outPath, json);
    console.error(`[claim-tally] written ${path.basename(outPath)}`);
  }
  if (opts.json) {
    process.stdout.write(json);
  }
}

if (files.length === 0) {
  const result = {
    _meta: {
      space: opts.space,
      generated_at: new Date().toISOString(),
      threshold,
      total_funnels: 0,
      total_move_keys: 0,
      dead_ground_count: 0,
      whitespace_count: 0,
      low_n_warning: true,
    },
    dead_ground: [],
    whitespace: [],
  };
  console.error(`[claim-tally] 0 funnels · 0 move keys · 0 dead ground / 0 whitespace`);
  console.error(`[claim-tally] WARN: store has 0 funnels < threshold ${threshold} — dead-ground classification is unreliable; see _meta.low_n_warning.`);
  writeResult(result);
  process.exit(0);
}

// --- 3. PARSE FUNNEL RECORDS ---
const funnels = [];
const seenIds = new Set();

for (const f of files) {
  const filePath = path.join(storeDir, f);
  let funnel;
  try {
    funnel = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    fail(`cannot parse ${f}: ${e.message}`);
  }
  if (!funnel.funnel_id || typeof funnel.funnel_id !== 'string') {
    fail(`missing funnel_id in ${f}`);
  }
  if (seenIds.has(funnel.funnel_id)) {
    // T-15-02-2: duplicate funnel_id = store corrupted
    fail(`duplicate funnel_id "${funnel.funnel_id}" found in ${f}`);
  }
  seenIds.add(funnel.funnel_id);

  if (!Array.isArray(funnel.belief_records)) {
    console.error(`[claim-tally] WARN: funnel "${funnel.funnel_id}" has no belief_records — treating as empty`);
    funnel.belief_records = [];
  }

  funnels.push(funnel);
}

// --- 4. BUILD THE MOVE→FUNNELS INDEX ---
// count DISTINCT funnels per tag (not raw occurrences)
const moveIndex = new Map();  // move_tag -> Set<funnel_id>

// --- 5. BUILD BELIEF-ID ANNOTATION MAP ---
const moveBelief = new Map();  // move_tag -> Set<belief_id>

for (const funnel of funnels) {
  const funnel_id = funnel.funnel_id;
  const belief_records = funnel.belief_records || [];

  for (const record of belief_records) {
    const moves = Array.isArray(record.moves) ? record.moves : [];
    const belief_id = record.belief_id || null;

    for (const move_tag of moves) {
      if (!move_tag || typeof move_tag !== 'string') {
        console.error(`[claim-tally] WARN: skipping empty/non-string move tag in funnel "${funnel_id}"`);
        continue;
      }

      // move index
      if (!moveIndex.has(move_tag)) moveIndex.set(move_tag, new Set());
      moveIndex.get(move_tag).add(funnel_id);

      // belief annotation
      if (!moveBelief.has(move_tag)) moveBelief.set(move_tag, new Set());
      if (belief_id) moveBelief.get(move_tag).add(belief_id);
    }
  }
}

// --- 6. CLASSIFY ---
const dead_ground = [];
const whitespace  = [];

for (const [move_tag, funnel_set] of moveIndex) {
  const count = funnel_set.size;
  const entry = {
    move: move_tag,
    funnel_count: count,
    funnels: [...funnel_set].sort(),
    belief_ids: [...(moveBelief.get(move_tag) || new Set())].sort(),
  };
  if (count >= threshold) {
    dead_ground.push(entry);
  } else {
    whitespace.push(entry);
  }
}

// --- 7. SORT EACH LIST ---
// dead_ground: descending by funnel_count, then move name asc (byShareThenName pattern)
dead_ground.sort((a, b) => (b.funnel_count - a.funnel_count) || a.move.localeCompare(b.move));
// whitespace: ascending by funnel_count, then move name asc (least-used first)
whitespace.sort((a, b) => (a.funnel_count - b.funnel_count) || a.move.localeCompare(b.move));

// --- 8. COMPUTE METADATA ---
const total_funnels  = funnels.length;
const total_moves    = moveIndex.size;
const dead_count     = dead_ground.length;
const white_count    = whitespace.length;
const low_n_warning  = (total_funnels < threshold);

// --- 9. WRITE OUTPUT ---
const result = {
  _meta: {
    space: opts.space,
    generated_at: new Date().toISOString(),
    threshold,
    total_funnels,
    total_move_keys: total_moves,
    dead_ground_count: dead_count,
    whitespace_count: white_count,
    low_n_warning,
  },
  dead_ground,
  whitespace,
};

console.error(`[claim-tally] ${total_funnels} funnels · ${total_moves} move keys · ${dead_count} dead ground / ${white_count} whitespace`);
if (low_n_warning) {
  console.error(`[claim-tally] WARN: store has ${total_funnels} funnels < threshold ${threshold} — dead-ground classification is unreliable; see _meta.low_n_warning.`);
}

writeResult(result);
process.exit(0);
