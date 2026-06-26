'use strict';
// store-scaffold.js — STORE-01 / STORE-05: scaffold the runs/<space>/ artifact-store
// slot tree (the reconciled §6/R1 slot list). One declared slot per inter-step artifact.
//
// Copies the funnel-store.js brick shell verbatim: CLI arg-parse → --space REQUIRED →
// import the canonical sanitizePathSegment from ./lib/fanout-path → root at
// path.join(cwd,'runs',SPACE) → mkdirSync({recursive:true}) per slot dir → write a stub
// file per slot file (ONLY IF ABSENT — this is what makes the brick idempotent) →
// sidecar log → one-line console summary → exit 0/1.
//
// IDEMPOTENCY / no-overwrite-v1 (STORE-05 + CLAUDE.md "Versioning"): every stub FILE write
// is guarded `if (!fs.existsSync(p))`. A re-scaffold of an existing space leaves existing
// slot contents BYTE-INTACT. Directories use mkdirSync({recursive:true}), already idempotent.
//
// Security (T-01-01): the --space value is sanitized to [a-z0-9._-] (strips "/" and "..")
// BEFORE any path.join, so a hostile --space cannot escape runs/. The smoke harness proves
// this with --space='../evil'.
//
// Conventions applied (RESEARCH §"The Exact runs/<space>/ Slot List"; plan <decisions>):
//   - D-Q1: scaffold BOTH dump conventions' parents — corpus/ (per-brand) AND flat dumps/.
//           Phase 3 manifests lock the final dump write path; Phase 1 only ensures parents exist.
//   - D-Q3: follow the §6 operator-handed slot names VERBATIM (lowercase, §6 extensions):
//           bet-brief.md / product-intake.md / market-selection.json / funnel-brief.md.
//           NAMING.md §5's UPPERCASE rule governs the engine's own deliverables, not these slots.
//   - NOT scaffolded: a creds slot (creds are gitignored seam files — Runtime State Inventory).
//   - engine/_fixture/ is the ENGINE's fixture (distinct from runs/smoke/) — untouched here.
//
// Usage:
//   node engine/bricks/store-scaffold.js --space=<market-space>
//   node engine/bricks/store-scaffold.js --help

const fs   = require('fs');
const path = require('path');

const { sanitizePathSegment } = require('./lib/fanout-path');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

if (opts.help) {
  console.log(`
store-scaffold.js — STORE-01/05: scaffold runs/<space>/ slot tree (idempotent)

Usage:
  node engine/bricks/store-scaffold.js --space=<market-space>

Options:
  --space=<str>   Market space name (e.g. smoke). REQUIRED. Sanitized to [a-z0-9._-];
                  "/" and ".." stripped (no path traversal out of runs/).
  --help          Show this help.

Behavior:
  Creates runs/<space>/ with every §6/R1 slot directory and a stub file per slot file.
  Idempotent: existing slot files are NEVER overwritten (no-overwrite-v1). A re-run
  leaves existing contents byte-intact.

Output:
  runs/<space>/...                       — the scaffolded slot tree
  runs/<space>/_store-scaffold-log.txt   — sidecar log (gitignored: _*-log.txt)
`);
  process.exit(0);
}

if (!opts.space) {
  console.error('ERROR: --space=<market-space> is required');
  process.exit(1);
}

const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) {
  console.error('ERROR: --space value sanitized to empty string; use only [a-z0-9._-]');
  process.exit(1);
}

const SPACE_DIR = path.join(process.cwd(), 'runs', SPACE);

// ---------------------------------------------------------------------------
// The reconciled §6/R1 slot list (RESEARCH "The Exact runs/<space>/ Slot List")
// ---------------------------------------------------------------------------

// Directories (always mkdirSync({recursive:true}); voc/market-signal/ is nested so its
// parent voc/ is created implicitly, but we list voc/ explicitly for the presence checks).
const SLOT_DIRS = [
  '_receipts',          // run ledger (STORE-03; committed provenance)
  'corpus',             // per-brand research data (D-Q1)
  'dumps',              // flat per-brand verbatim dumps (D-Q1)
  'ads',                // per-brand ad records (fan-out)
  'funnels',            // per-funnel analyzed records (fan-out)
  'voc',                // VOC parent
  'voc/market-signal',  // the canonical fan-out slot (niche × transformation)
  'voc-bank',           // Step 6 copy bank
  'copy',               // Step 8 copy outputs (fan-out)
  'review',             // Step 10 adversarial re-review reports
  'asset-classify',     // holds CLAIM-LIST.json
];

// Stub FILES — created ONLY IF ABSENT (idempotency). Markdown stubs get a single
// `# <slot>` heading; JSON stubs get `{}` ([] reserved for slots that are collections —
// none here are scaffolded as arrays at Phase 1; field contents are deferred, Job 5).
const MD_FILES = [
  'bet-brief.md',        // Step 0 structured contract
  'product-intake.md',   // Step 0 product spec (required input to Step 7)
  'funnel-brief.md',     // Step 7 architect design + copy brief
];

const JSON_FILES = [
  'asset-classify/CLAIM-LIST.json',  // Step 0 capability-claim ledger (consumed by Step 9)
  'brands.json',                     // Step 1 roster
  'queries_run.json',                // Step 1 coverage audit trail
  'funnels/_tally.json',             // Step 2 claim tally (underscore-prefixed meta file)
  'ad-volume-aggregate.json',        // Step 2 deterministic rollup
  'space-map.json',                  // Step 3 synthesizer output
  'voc/gap_candidates.json',         // Step 4 whitespace-vs-scary rows
  'market-selection.json',           // Step 5 ranked survivors
  'ntp-pick.json',                   // Step 5 operator NTP pick
  'awareness-read.json',             // Step 6 awareness reconciler output
  'audit-verdicts.json',             // Step 7 funnel auditor verdicts
  'chief-verdicts.json',             // Step 8 copy chief line verdicts
  'asset-records.json',              // Step 9 classified asset records
];

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(() => {
  const logLines = [];
  let dirCount = 0;
  let fileCount = 0;   // files actually written this run (absent ones)

  try {
    // Directories — mkdirSync({recursive:true}) is idempotent.
    fs.mkdirSync(SPACE_DIR, { recursive: true });
    for (const d of SLOT_DIRS) {
      const p = path.join(SPACE_DIR, d);
      fs.mkdirSync(p, { recursive: true });
      dirCount++;
      logLines.push(`[DIR]  ${path.relative(process.cwd(), p)}`);
    }

    // Markdown stub files — write ONLY IF ABSENT (no-overwrite-v1).
    for (const f of MD_FILES) {
      const p = path.join(SPACE_DIR, f);
      if (!fs.existsSync(p)) {
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, `# ${path.basename(f, '.md')}\n`);
        fileCount++;
        logLines.push(`[FILE] ${path.relative(process.cwd(), p)} (stub)`);
      } else {
        logLines.push(`[SKIP] ${path.relative(process.cwd(), p)} (exists — not overwritten)`);
      }
    }

    // JSON stub files — write ONLY IF ABSENT (no-overwrite-v1).
    for (const f of JSON_FILES) {
      const p = path.join(SPACE_DIR, f);
      if (!fs.existsSync(p)) {
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, JSON.stringify({}, null, 2) + '\n');
        fileCount++;
        logLines.push(`[FILE] ${path.relative(process.cwd(), p)} (stub)`);
      } else {
        logLines.push(`[SKIP] ${path.relative(process.cwd(), p)} (exists — not overwritten)`);
      }
    }

    // Sidecar log (gitignored via .gitignore `_*-log.txt`).
    const summary = `store-scaffold: ${dirCount} dirs, ${fileCount} files, space=${SPACE}`;
    logLines.unshift(`[${new Date().toISOString()}] ${summary}`);
    fs.writeFileSync(
      path.join(SPACE_DIR, '_store-scaffold-log.txt'),
      logLines.join('\n') + '\n'
    );

    console.log(summary);
    process.exit(0);
  } catch (e) {
    console.error(`FATAL: ${e.message}`);
    process.exit(1);
  }
})();
