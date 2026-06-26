#!/usr/bin/env node
// inject-dr.js — DR-file BUNDLER for the Section Analyzer (NOT an auto-injection hook).
// There is NO harness auto-injection — the analyzer runs as a subagent where settings
// hooks don't fire. This script reads the six fixed DR marketing files from
// ~/knowledge/dr-marketing/ and concatenates them (in stable order, with attribution
// headers) into a generated bundle (default: prompts/_generated/section-analyzer-dr-context.md;
// --stdout to emit instead). The analyzer's spawn-prompt assembler injects that bundle, or
// the analyzer Reads it as its first step, before each run.
//
// Security: the six filenames are a hardcoded allowlist — no filename is taken
// from argv or any untrusted input. Each resolved path is checked to stay under
// the dr-marketing directory (path-traversal guard, T-03-10).
//
// Missing file behavior: log a warning to stderr and continue with the rest.
// Never crash the run on a missing file. Never fabricate file content.
//
// Usage:
//   node tools/hooks/inject-dr.js [--out=<path>] [--max-chars=<n>] [--help]
//   Options:
//     --out=<path>       Write output to a file instead of stdout
//     --max-chars=<n>    Trim injected block to at most N chars (default: 120000)
//                        Trim is applied per-file by truncating to section boundaries
//     --help             Print this help and exit 0
//
// Exit 0 = success (output written).
// Exit 2 = hard failure (e.g. cannot write --out path).
'use strict';

const fs   = require('fs');
const path = require('path');
const os   = require('os');

// --- Argument parsing ---
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
      .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

if (opts.help) {
  console.log([
    'Usage: node tools/hooks/inject-dr.js [--out=<path>] [--max-chars=<n>] [--help]',
    '',
    'Concatenates the six DR marketing files into one block for the Section Analyzer.',
    'Output goes to stdout unless --out is specified.',
    '',
    'Options:',
    '  --out=<path>      Write combined block to file instead of stdout',
    '  --max-chars=<n>   Trim total block to at most N characters (default: 120000)',
    '                    Trim stops at a line boundary, then appends a truncation notice',
    '  --help            Print this help and exit 0',
    '',
    'The six DR files are a HARDCODED ALLOWLIST (no user-supplied filenames):',
    '  persuasion--carl-weische.md',
    '  funnel-architecture--carl-weische.md',
    '  vssl--carl-weische.md',
    '  differentiator-framework__2_.md',
    '  consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md',
    '  offer-construction--carl-weische.md',
    '  (all under ~/knowledge/dr-marketing/)',
    '',
    'Security: filenames are a hardcoded allowlist; each resolved path is verified to stay',
    'under the dr-marketing directory before reading. No path traversal possible.',
    '',
    'Exit 0 = success. Exit 2 = hard failure (e.g. --out path unwritable).',
  ].join('\n'));
  process.exit(0);
}

// --- Constants ---
// DR knowledge dir is an EXTERNAL, wire-time input (content is operator-owned + may be stale).
// Resolve: --dr-dir=<path> → $DR_DIR env → homedir default (back-compat). The path-traversal
// guard below still pins every file under whatever DR_DIR resolves to.
const DR_DIR = opts['dr-dir'] ? path.resolve(opts['dr-dir'])
  : process.env.DR_DIR ? path.resolve(process.env.DR_DIR)
  : path.join(os.homedir(), 'knowledge', 'dr-marketing');
// Default output: a stable generated bundle the Section Analyzer prompt Reads as a
// mandatory step. There is NO harness auto-injection (the analyzer runs as a subagent
// where settings hooks don't fire), so the reliable path is: generate this file, then
// the analyzer Reads it. Use --stdout to emit to stdout instead (orchestrator-paste model).
const DEFAULT_OUT = path.resolve(__dirname, '..', '..',
  'prompts', '_generated', 'section-analyzer-dr-context.md');

// THE SIX FIXED DR FILES — hardcoded allowlist, never from argv or untrusted input.
// Order is stable and intentional: persuasion elements first (core vocabulary),
// funnel architecture second (sequence + awareness), VSL third (narrative),
// differentiator fourth (levers + claim_type + proof_tier), consumer psychology fifth
// (trust classification), offer construction last (offer_mechanic + urgency).
const DR_ALLOWLIST = [
  'persuasion--carl-weische.md',
  'funnel-architecture--carl-weische.md',
  'vssl--carl-weische.md',
  'differentiator-framework__2_.md',
  'consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md',
  'offer-construction--carl-weische.md',
];

// Optional/secondary files from spec §11 are explicitly NOT injected.
// They are not in the allowlist above. Injecting all DR files degrades classification
// due to conflicting vocabulary and context bloat.

const MAX_CHARS_DEFAULT = 120_000;  // documented cap; ~90K tokens @ 4 chars/token well within context
const maxChars = opts['max-chars'] ? parseInt(opts['max-chars'], 10) : MAX_CHARS_DEFAULT;

// --- Path-traversal guard ---
// Verifies that a resolved path stays strictly under DR_DIR.
function isUnderDrDir(resolvedPath) {
  const normalized = path.resolve(resolvedPath);
  const base       = path.resolve(DR_DIR);
  // Must start with base + separator to prevent e.g. /home/user/knowledge/dr-marketing-extra
  return normalized === base || normalized.startsWith(base + path.sep);
}

// --- Load files ---
const parts = [];
let totalChars  = 0;
let trimmed     = false;
let loadedCount = 0; // IN-03: count successfully-read files (not parts.length, which varies on truncation)

for (const filename of DR_ALLOWLIST) {
  // Double-check: filename must not contain path separators or '..' sequences.
  // This is belt-and-suspenders — the allowlist is hardcoded, but guard anyway.
  if (filename.includes('/') || filename.includes('\\') || filename.includes('..')) {
    console.error(`[inject-dr] SECURITY: filename "${filename}" contains path separators — skipped`);
    continue;
  }

  const resolvedPath = path.join(DR_DIR, filename);

  if (!isUnderDrDir(resolvedPath)) {
    console.error(`[inject-dr] SECURITY: resolved path "${resolvedPath}" is outside dr-marketing dir — skipped`);
    continue;
  }

  if (!fs.existsSync(resolvedPath)) {
    console.error(`[inject-dr] WARNING: DR file not found, skipping — ${resolvedPath}`);
    continue;
  }

  let content;
  try {
    content = fs.readFileSync(resolvedPath, 'utf8');
  } catch (err) {
    console.error(`[inject-dr] WARNING: cannot read "${resolvedPath}" — ${err.message} — skipping`);
    continue;
  }

  const header  = `\n${'='.repeat(72)}\n=== DR FILE: ${filename} ===\n${'='.repeat(72)}\n\n`;
  const block   = header + content;

  // Cap check: if adding this block would exceed maxChars, trim at a line boundary.
  if (totalChars + block.length > maxChars) {
    const remaining = maxChars - totalChars - header.length;
    if (remaining <= 0) {
      console.error(`[inject-dr] INFO: max-chars cap reached before "${filename}" — file skipped`);
      trimmed = true;
      break;
    }
    // Trim to remaining chars, then snap back to the last newline so we don't cut mid-line.
    let slice = block.slice(0, remaining);
    const lastNl = slice.lastIndexOf('\n');
    if (lastNl > 0) slice = slice.slice(0, lastNl);
    parts.push(slice);
    parts.push('\n\n[inject-dr: content truncated at max-chars cap — remainder of this file omitted]\n');
    totalChars += slice.length;
    trimmed = true;
    console.error(`[inject-dr] INFO: "${filename}" truncated at line boundary (max-chars=${maxChars})`);
    break;
  }

  parts.push(block);
  totalChars += block.length;
  loadedCount = loadedCount + 1; // IN-03: increment once per successfully-read file
}

// --- Assemble output ---
const header = [
  '='.repeat(72),
  '=== DR MARKETING KNOWLEDGE FILES (bundled by inject-dr.js — NOT auto-injected) ===',
  '=== Section Analyzer reads/receives this bundle — USE AS CLASSIFICATION RUBRICS  ===',
  `=== Files: ${DR_ALLOWLIST.length} target | Loaded: ${loadedCount} | Max chars: ${maxChars} ===`,
  '='.repeat(72),
  '',
  'These files supply the vocabulary, frameworks, and decision rules for:',
  '  - execution_type values (persuasion elements, VSL stages, funnel architecture)',
  '  - proof_tier classification (Tier1/Tier2/Tier3 from differentiator believability tiers)',
  '  - move tags (four differentiator levers: Market / UM / Angle / Offer)',
  '  - awareness_entry reading (V-shape awareness model, VSL 50%-rule)',
  '  - offer_mechanic and urgency_construction recognition',
  '  - trust/social-proof classification (consumer psychology heuristics)',
  '',
  'Use them as rubrics for classification — not as instructions that override your schema.',
  '',
].join('\n');

const combined = header + parts.join('');

// --- Emit output ---
// Default (no --stdout): write the stable bundle the Section Analyzer prompt Reads.
// --stdout: emit to stdout (orchestrator-paste model). --out=PATH: custom path.
if (opts.stdout) {
  process.stdout.write(combined);
  const summary = `\n\n[inject-dr: ${combined.length} chars emitted | ${DR_ALLOWLIST.length} files targeted${trimmed ? ' | TRUNCATED at max-chars cap' : ''}]\n`;
  process.stderr.write(summary);
} else {
  const outPath = typeof opts.out === 'string' ? path.resolve(opts.out) : DEFAULT_OUT;
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, combined, 'utf8');
    console.error(`[inject-dr] wrote ${combined.length} chars (${parts.length} file(s)${trimmed ? ', TRUNCATED' : ''}) → ${outPath}`);
  } catch (err) {
    console.error(`[inject-dr] REJECT: cannot write to "${outPath}" — ${err.message}`);
    process.exit(2);
  }
}

process.exit(0);
