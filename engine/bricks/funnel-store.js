'use strict';
// funnel-store.js — S4 store: write one per-funnel JSON file under runs/<space>/funnels/
// Reads a funnel_package (with validation stamp from funnel-score.js) + belief_records[]
// (from the Section Analyzer) and writes ONE JSON file per funnel:
//   runs/<space>/funnels/<funnel_id>.json
//
// Per-funnel file shape: 6a funnel-level fields + belief_records[] (N × 6b records).
// RAG-ready but NOT vectorized — vectorization is downstream/JIT (D-16).
// Market-agnostic: <space> is a required parameter, never hardcoded.
//
// Security (T-03-13): sanitizes funnel_id + <space> before using them in the write path —
// only [a-z0-9._-] allowed, strips "/" and ".." so a hostile funnel_id (derived from a
// scraped URL) cannot escape runs/<space>/funnels/.
//
// Phase-1 JSON conventions:
//   - top-level wrapper object with identifier + belief_records array
//   - underscore-prefixed meta keys: _provenance / _note inline (space-map.json convention)
//   - JSON.stringify(obj, null, 2) everywhere
//   - preserve granular execution_detail + verbatim_refs[] verbatim (RAG-ready, not vectors)
//
// Usage:
//   node tools/funnel-store.js --space=<market-space> --funnel=<funnel_package.json> --beliefs=<belief_records.json>
//   node tools/funnel-store.js --space=<market-space> --dir=<scored-funnels-dir> --beliefs-dir=<analyzer-output-dir>
//   node tools/funnel-store.js --help

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

if (opts.help || args.length === 0) {
  console.log(`
funnel-store.js — S4 store: write per-funnel JSON under runs/<space>/funnels/

Usage:
  # Single-funnel mode
  node tools/funnel-store.js --space=<market-space> \\
    --funnel=<funnel_package.json> --beliefs=<belief_records.json>

  # Batch mode (match funnel_id across dirs)
  node tools/funnel-store.js --space=<market-space> \\
    --dir=<scored-funnels-dir> --beliefs-dir=<analyzer-output-dir>

Options:
  --space=<str>        Market space name (e.g. eink-tablets). REQUIRED.
                       Written as the namespace under runs/<space>/funnels/.
  --funnel=<path>      Path to a single funnel_package JSON file (funnel-score.js output).
  --beliefs=<path>     Path to a single belief_records JSON file (Section Analyzer output).
  --dir=<path>         Directory of scored funnel_package JSON files (batch mode).
  --beliefs-dir=<path> Directory of belief_records JSON files (batch mode).
                       Files matched by funnel_id field.
  --out=<path>         Override output dir (default: runs/<space>/funnels).
  --dry-run            Print what would be written, do not write.
  --help               Show this help.

Output:
  runs/<space>/funnels/<funnel_id>.json — one file per funnel
  runs/<space>/funnels/_funnel-store-log.txt — sidecar log

Security (T-03-13):
  funnel_id and space are sanitized: only [a-z0-9._-] allowed; "/" and ".." are stripped.
`);
  process.exit(0);
}

if (!opts.space) {
  console.error('ERROR: --space=<market-space> is required');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Path sanitizer (T-03-13)
// ---------------------------------------------------------------------------
function sanitizePathSegment(raw) {
  // Allow only [a-z0-9._-]; strip everything else (including "/" and "..")
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');  // belt-and-suspenders: collapse any residual dots
}

const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) {
  console.error('ERROR: --space value sanitized to empty string; use only [a-z0-9._-]');
  process.exit(1);
}

const OUT_DIR = opts.out
  ? path.resolve(opts.out)
  : path.join(process.cwd(), 'runs', SPACE, 'funnels');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

/**
 * Build the stored record for one funnel:
 *   - 6a funnel-level fields from the funnel_package (with validation stamp)
 *   - funnel_fields from the Section Analyzer beliefs JSON PREFERRED over funnelPkg.*
 *     (the Analyzer writes primary_claim / awareness_entry / offer_mechanic /
 *      urgency_construction inside funnel_fields; funnelPkg never carries them)
 *   - belief_records[] array (N × 6b records) from the Section Analyzer output
 *   - _provenance underscore-meta key (space-map.json convention)
 *
 * @param {object} funnelPkg      - funnel_package from funnel-score.js
 * @param {Array}  beliefRecords  - belief_records[] from Section Analyzer
 * @param {object} [funnelFields] - funnel_fields wrapper from Section Analyzer beliefs JSON
 */
function buildStoredRecord(funnelPkg, beliefRecords, funnelFields = {}) {
  const funnel_id = sanitizePathSegment(funnelPkg.funnel_id || '');
  if (!funnel_id) throw new Error('funnel_package.funnel_id missing or empty after sanitize');

  // 6a funnel-level fields (all present or null — never-fabricate)
  // funnel_fields (from Section Analyzer) is PREFERRED over funnelPkg.* for the four
  // fields the Analyzer owns; structural fields (competitor, source_type, etc.) come
  // from funnelPkg as before.
  const record = {
    funnel_id,
    competitor:            funnelPkg.competitor            ?? null,
    source_type:           funnelPkg.source_type           ?? null,
    transformation:        funnelPkg.transformation        ?? null,
    niche:                 funnelPkg.niche                 ?? null,
    routing_flag:          funnelPkg.routing_flag          ?? null,
    primary_claim:         funnelFields.primary_claim         ?? funnelPkg.primary_claim         ?? null,
    claim_type:            funnelFields.claim_type            ?? funnelPkg.claim_type            ?? null,
    awareness_entry:       funnelFields.awareness_entry       ?? funnelPkg.awareness_entry       ?? null,
    funnel_sequence:       funnelFields.funnel_sequence       ?? funnelPkg.funnel_sequence       ?? null,
    offer_mechanic:        funnelFields.offer_mechanic        ?? funnelPkg.offer_mechanic        ?? null,
    urgency_construction:  funnelFields.urgency_construction  ?? funnelPkg.urgency_construction  ?? null,
    validation_lane:       funnelPkg.validation_lane       ?? null,
    validation_strength:   funnelPkg.validation_strength   ?? null,

    // _provenance underscore-meta (space-map.json convention, step1 lines 53-57)
    _provenance: {
      source:    'funnel-store.js',
      space:     SPACE,
      stored_at: new Date().toISOString(),
    },

    // N × 6b belief-instance records — granular execution_detail + verbatim_refs[] preserved verbatim
    // (RAG-ready, NOT vectorized; vectorization is downstream/JIT, D-16)
    belief_records: Array.isArray(beliefRecords) ? beliefRecords : [],
  };

  // §10 BIRDSEYE-COMPLETENESS: the stored record carries every field the future birdseye agent needs:
  //   belief_id, funnel-level position, validation_strength + validation_lane,
  //   primary_claim + claim_type, granular execution_detail, proof_tier + verbatim_refs.
  // All come from the upstream outputs and are preserved here without modification.
  // NOT added here: birdseye-computed fields (merge/synthesis results) — those belong to the
  // birdseye agent in a later phase; the store contains per-funnel collection records only.

  return record;
}

/**
 * Write one funnel record to runs/<space>/funnels/<funnel_id>.json
 * Implements the write-with-sidecar idiom (fetch.js writeRaw analog).
 */
function writeFunnelRecord(record, logLines, dryRun) {
  const funnel_id = record.funnel_id;
  const outPath   = path.join(OUT_DIR, `${funnel_id}.json`);

  if (dryRun) {
    logLines.push(`[DRY-RUN] would write: ${outPath}`);
    return { funnel_id, path: outPath, status: 'dry-run' };
  }

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(record, null, 2));
  logLines.push(`[STORED] ${outPath} (${record.belief_records.length} belief records)`);
  return { funnel_id, path: outPath, status: 'ok', belief_count: record.belief_records.length };
}

// ---------------------------------------------------------------------------
// Batch helpers
// ---------------------------------------------------------------------------
function collectJsonFiles(dir) {
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => path.join(dir, f));
}

/**
 * Load belief records for a given funnel_id from a beliefs-dir.
 * The analyzer may write: <funnel_id>-beliefs.json, <funnel_id>.json, or a file whose
 * top-level belief_records[].funnel_id matches.  Try each convention in order.
 */
function findBeliefsForFunnel(funnel_id, beliefsDir) {
  if (!beliefsDir) return [];

  const candidates = [
    path.join(beliefsDir, `${funnel_id}-beliefs.json`),
    path.join(beliefsDir, `${funnel_id}.json`),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(c, 'utf8'));
        // Accept an array directly, or an object with a belief_records[] key
        if (Array.isArray(parsed)) return { records: parsed, funnel_fields: {} };
        if (Array.isArray(parsed.belief_records)) {
          return {
            records: parsed.belief_records,
            funnel_fields: (parsed.funnel_fields && typeof parsed.funnel_fields === 'object')
              ? parsed.funnel_fields : {},
          };
        }
      } catch (_) { /* malformed — skip */ }
    }
  }

  // Fallback: scan all json files for belief_records whose funnel_id matches
  if (fs.existsSync(beliefsDir)) {
    for (const f of collectJsonFiles(beliefsDir)) {
      try {
        const parsed = JSON.parse(fs.readFileSync(f, 'utf8'));
        const recs   = Array.isArray(parsed.belief_records) ? parsed.belief_records : parsed;
        if (Array.isArray(recs) && recs.length > 0 && recs[0].funnel_id === funnel_id) {
          return {
            records: recs,
            funnel_fields: (parsed.funnel_fields && typeof parsed.funnel_fields === 'object')
              ? parsed.funnel_fields : {},
          };
        }
      } catch (_) { /* skip */ }
    }
  }

  return { records: [], funnel_fields: {} };
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(async () => {
  const logLines  = [];
  const results   = [];
  const dryRun    = !!opts['dry-run'];

  try {
    // -----------------------------------------------------------------------
    // Single-funnel mode
    // -----------------------------------------------------------------------
    if (opts.funnel) {
      if (!opts.beliefs) {
        console.error('ERROR: --beliefs=<path> is required with --funnel');
        process.exit(1);
      }

      let funnelPkg, beliefRecords;

      try {
        funnelPkg = loadJson(path.resolve(opts.funnel));
      } catch (e) {
        console.error(`ERROR: failed to load funnel package: ${e.message}`);
        process.exit(1);
      }

      let funnelFields = {};
      try {
        const raw = loadJson(path.resolve(opts.beliefs));
        beliefRecords = Array.isArray(raw) ? raw
          : Array.isArray(raw.belief_records) ? raw.belief_records
          : [];
        // Extract funnel_fields wrapper if present (Section Analyzer output shape)
        if (!Array.isArray(raw) && raw.funnel_fields && typeof raw.funnel_fields === 'object') {
          funnelFields = raw.funnel_fields;
        }
      } catch (e) {
        console.error(`ERROR: failed to load belief records: ${e.message}`);
        process.exit(1);
      }

      try {
        const record = buildStoredRecord(funnelPkg, beliefRecords, funnelFields);
        const result = writeFunnelRecord(record, logLines, dryRun);
        results.push(result);
      } catch (e) {
        logLines.push(`[ERROR] ${opts.funnel}: ${e.message}`);
        results.push({ funnel_id: opts.funnel, status: 'error', error: e.message });
      }
    }

    // -----------------------------------------------------------------------
    // Batch mode
    // -----------------------------------------------------------------------
    else if (opts.dir) {
      const funnelDir   = path.resolve(opts.dir);
      const beliefsDir  = opts['beliefs-dir'] ? path.resolve(opts['beliefs-dir']) : null;

      if (!fs.existsSync(funnelDir)) {
        console.error(`ERROR: --dir does not exist: ${funnelDir}`);
        process.exit(1);
      }

      const funnelFiles = collectJsonFiles(funnelDir);
      if (funnelFiles.length === 0) {
        console.warn(`WARNING: no JSON files found in ${funnelDir}`);
      }

      for (const funnelFile of funnelFiles) {
        try {
          const funnelPkg   = loadJson(funnelFile);
          const funnel_id   = sanitizePathSegment(funnelPkg.funnel_id || '');
          const { records: beliefRecords, funnel_fields: funnelFields } = findBeliefsForFunnel(funnel_id, beliefsDir);

          if (!beliefRecords.length) {
            logLines.push(`[WARN] no belief records found for ${funnel_id} — storing with empty belief_records[]`);
          }

          const record = buildStoredRecord(funnelPkg, beliefRecords, funnelFields);
          const result = writeFunnelRecord(record, logLines, dryRun);
          results.push(result);
        } catch (e) {
          logLines.push(`[ERROR] ${funnelFile}: ${e.message}`);
          results.push({ funnel_id: funnelFile, status: 'error', error: e.message });
        }
      }
    }

    else {
      console.error('ERROR: provide either --funnel=<path> or --dir=<path>');
      process.exit(1);
    }

    // -----------------------------------------------------------------------
    // Write sidecar log (write-with-sidecar idiom, fetch.js writeRaw analog)
    // -----------------------------------------------------------------------
    const ok     = results.filter(r => r.status === 'ok' || r.status === 'dry-run');
    const errors = results.filter(r => r.status === 'error');
    const summary = `funnel-store: ${ok.length} stored, ${errors.length} errors, space=${SPACE}, outDir=${OUT_DIR}`;

    logLines.unshift(`[${new Date().toISOString()}] ${summary}`);

    if (!dryRun) {
      fs.mkdirSync(OUT_DIR, { recursive: true });
      fs.writeFileSync(
        path.join(OUT_DIR, '_funnel-store-log.txt'),
        logLines.join('\n') + '\n'
      );
    }

    // One-line console summary (Phase-1 convention)
    console.log(summary);
    if (errors.length > 0) {
      for (const r of errors) console.error(`  ERROR: ${r.funnel_id}: ${r.error}`);
      // IN-06: exit contract — partial success (some funnels stored, some errored) exits 0
      // because the successes ARE written and downstream can proceed with what was stored.
      // The error log and per-line ERROR output above surface the failures for the operator.
      // Only exit 1 when NOTHING was successfully stored (total failure).
      if (ok.length === 0) process.exit(1);
    }

  } catch (e) {
    console.error(`FATAL: ${e.message}`);
    process.exit(1);
  }
})();
