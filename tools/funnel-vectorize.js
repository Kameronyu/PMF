#!/usr/bin/env node
// tools/funnel-vectorize.js
// JIT index builder for the copywriter-RAG (D-16: vectorization is downstream/just-in-time).
//
// Deterministic script — NOT an agent (CLAUDE.md one-job-per-brick law). Embedding is
// arithmetic; the only judgment already happened upstream in the Section Analyzer that
// produced the belief_records.
//
// Reads the funnel store written by funnel-store.js:
//   runs/<space>/funnels/<funnel_id>.json   (6a funnel fields + belief_records[] = N × 6b)
// Flattens every belief_record into one retrieval unit, carries the funnel-level
// attribution fields onto it, embeds the load-bearing text (belief_id + execution_detail
// + verbatim), and writes ONE index:
//   runs/<space>/funnels/_index.json
//
// The retrieval unit is the BELIEF, not the funnel: the copywriter writes section by
// section, and each section installs one belief — so it retrieves matching belief installs.
//
// Embedding backend is tools/lib/embed.js (Voyage if VOYAGE_API_KEY set, else local stub).
// Run this ONCE after the Section Analyzer populates the store, and again whenever it grows.
//
// Usage:
//   node tools/funnel-vectorize.js --space=<market-space> [--out=<path>] [--help]
//
// Security: <space> is sanitized (only [a-z0-9._-]) before use in the read/write path —
// mirrors funnel-store.js (T-03-13). No untrusted value reaches the filesystem unsanitized.

'use strict';

const fs   = require('fs');
const path = require('path');
const { embed, backendName, isStub } = require('./lib/embed');

// --- args ---
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
      .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

if (opts.help || !opts.space) {
  console.log([
    'Usage: node tools/funnel-vectorize.js --space=<market-space> [--out=<path>]',
    '',
    'Embeds every belief_record under runs/<space>/funnels/ into runs/<space>/funnels/_index.json.',
    'Run after the Section Analyzer populates the store. Backend: Voyage if VOYAGE_API_KEY set, else local stub.',
    '',
    '  --space   required. market space (e.g. arduview). Sanitized to [a-z0-9._-].',
    '  --out     override index path (default runs/<space>/funnels/_index.json)',
    '  --help    this help',
  ].join('\n'));
  process.exit(opts.space ? 0 : (opts.help ? 0 : 2));
}

// --- sanitize <space> (T-03-13 parity with funnel-store) ---
function sanitizePathSegment(s) {
  return String(s).replace(/[^a-z0-9._-]/gi, '').replace(/\.\.+/g, '').toLowerCase();
}
const space = sanitizePathSegment(opts.space);
if (!space) { console.error('--space is empty after sanitize'); process.exit(2); }

const FUNNEL_DIR = path.join('runs', space, 'funnels');
const OUT_PATH   = opts.out ? String(opts.out) : path.join(FUNNEL_DIR, '_index.json');

if (!fs.existsSync(FUNNEL_DIR)) {
  console.error(`No funnel store at ${FUNNEL_DIR}. Run the Section Analyzer + funnel-store.js first.`);
  process.exit(2);
}

// --- pull verbatim text out of a verbatim_ref (string | {text|quote|verbatim} | object) ---
function refText(ref) {
  if (ref == null) return '';
  if (typeof ref === 'string') return ref;
  return ref.text || ref.quote || ref.verbatim || ref.copy || '';
}

// --- build the text we embed for one belief record ---
// Weight the load-bearing fields: belief_id (what), execution_detail (how, granular),
// then verbatim (the actual words). primary_claim gives funnel-level framing.
function embedText(funnel, br) {
  const verbatim = (Array.isArray(br.verbatim_refs) ? br.verbatim_refs : [])
    .map(refText).filter(Boolean).join(' · ');
  return [
    `belief: ${br.belief_id || ''}`,
    `execution_type: ${br.execution_type || ''}`,
    `execution: ${br.execution_detail || ''}`,
    verbatim ? `verbatim: ${verbatim}` : '',
    funnel.primary_claim ? `funnel_claim: ${funnel.primary_claim}` : '',
  ].filter(Boolean).join('\n');
}

// --- load every funnel file, flatten belief_records into retrieval units ---
function loadUnits() {
  const files = fs.readdirSync(FUNNEL_DIR)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => path.join(FUNNEL_DIR, f));

  const units = [];
  let funnelCount = 0;
  for (const file of files) {
    let funnel;
    try { funnel = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (e) { console.error(`[skip] ${file}: ${e.message}`); continue; }
    funnelCount++;
    const beliefs = Array.isArray(funnel.belief_records) ? funnel.belief_records : [];
    for (const br of beliefs) {
      units.push({
        // funnel-level attribution (so a retrieved unit is self-explanatory)
        funnel_id:           funnel.funnel_id,
        competitor:          funnel.competitor ?? null,
        transformation:      funnel.transformation ?? null,
        primary_claim:       funnel.primary_claim ?? null,
        claim_type:          funnel.claim_type ?? null,
        awareness_entry:     funnel.awareness_entry ?? null,
        validation_lane:     funnel.validation_lane ?? null,
        validation_strength: funnel.validation_strength ?? null,
        // belief-level (the retrieval unit)
        position:        br.position ?? null,
        belief_id:       br.belief_id ?? null,
        execution_type:  br.execution_type ?? null,
        proof_tier:      br.proof_tier ?? null,
        execution_detail: br.execution_detail ?? null,
        moves:           Array.isArray(br.moves) ? br.moves : [],
        verbatim_refs:   Array.isArray(br.verbatim_refs) ? br.verbatim_refs : [],
        embed_text:      embedText(funnel, br),
      });
    }
  }
  return { units, funnelCount };
}

(async () => {
  const { units, funnelCount } = loadUnits();
  if (units.length === 0) {
    console.error(`No belief_records found across ${funnelCount} funnel file(s) in ${FUNNEL_DIR}.`);
    process.exit(2);
  }

  if (isStub()) {
    console.error('[warn] VOYAGE_API_KEY not set — using deterministic LOCAL STUB embeddings.');
    console.error('[warn] Stub cosine = lexical overlap only, NOT semantic. Set VOYAGE_API_KEY for real recall.');
  }

  const vectors = await embed(units.map(u => u.embed_text), { inputType: 'document' });

  const records = units.map((u, i) => ({ ...u, vector: vectors[i] }));
  const index = {
    _meta: {
      space,
      backend: backendName(),
      is_stub: isStub(),
      dim: vectors[0] ? vectors[0].length : 0,
      funnel_count: funnelCount,
      record_count: records.length,
      built_from: FUNNEL_DIR,
      _note: isStub()
        ? 'LOCAL STUB embeddings — lexical overlap only. Rebuild with VOYAGE_API_KEY for semantic recall.'
        : 'Voyage semantic embeddings.',
    },
    records,
  };

  fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2));
  console.log(`[indexed] ${records.length} belief records from ${funnelCount} funnel(s) → ${OUT_PATH}`);
  console.log(`[backend] ${backendName()} | dim=${index._meta.dim}`);
})().catch(e => { console.error(`vectorize failed: ${e.message}`); process.exit(2); });
