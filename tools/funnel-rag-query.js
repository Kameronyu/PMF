#!/usr/bin/env node
// tools/funnel-rag-query.js
// The retrieval step of the copywriter-RAG. Deterministic script — NOT an agent
// (CLAUDE.md): embedding a query + cosine-kNN is arithmetic, and there is exactly ONE
// copywriter downstream, so there is no parallel-agent reason to make retrieval an agent.
//
// This is what the /copywrite ORCHESTRATOR runs. Hooks do NOT fire inside subagents, so
// knowledge is injected the way inject-dr.js already does it: the orchestrator runs this
// script and pastes the output block into the copywriter's spawn prompt.
//
// Pipeline (hybrid retrieval):
//   1. structured PREFILTER (free — labels already in the index): --belief / --proof-tier
//   2. semantic RANK: embed --query (same backend as the index) → cosine vs each unit
//   3. emit top-N as an attributed injection block (inject-dr format) or --json
//
// Usage:
//   node tools/funnel-rag-query.js --space=<space> --query="<belief/section to write>" \
//        [--belief=<belief_id>] [--proof-tier="Tier 1"] [--top=6] [--json] [--out=<path>]
//
// Reads runs/<space>/funnels/_index.json (built by funnel-vectorize.js).
// IMPORTANT: query is embedded with the SAME backend that built the index — a stub index
// must be queried by a stub (this is enforced by reading _meta.is_stub and warning on drift).

'use strict';

const fs   = require('fs');
const path = require('path');
const { embed, cosine, backendName, isStub } = require('./lib/embed');

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
      .map(a => { const i = a.indexOf('='); return i === -1
        ? [a.replace(/^--/, ''), true]
        : [a.slice(2, i), a.slice(i + 1)]; })
);

if (opts.help || !opts.space || !opts.query) {
  console.log([
    'Usage: node tools/funnel-rag-query.js --space=<space> --query="<text>" [options]',
    '',
    'Retrieves the winning-funnel belief installs most similar to the section you are about to write.',
    '',
    '  --space        required. market space (sanitized to [a-z0-9._-])',
    '  --query        required. the belief / section to write (free text)',
    '  --belief       prefilter: only this belief_id (e.g. it-will-ship)',
    '  --proof-tier   prefilter: only this proof_tier (e.g. "Tier 1")',
    '  --top          number of records to return (default 6)',
    '  --json         emit JSON instead of the injection text block',
    '  --out          write to a file instead of stdout',
    '  --help         this help',
  ].join('\n'));
  process.exit((opts.space && opts.query) ? 0 : 2);
}

function sanitizePathSegment(s) {
  return String(s).replace(/[^a-z0-9._-]/gi, '').replace(/\.\.+/g, '').toLowerCase();
}
const space = sanitizePathSegment(opts.space);
const top   = Math.max(1, parseInt(opts.top, 10) || 6);
const INDEX = path.join('runs', space, 'funnels', '_index.json');

if (!fs.existsSync(INDEX)) {
  console.error(`No index at ${INDEX}. Run: node tools/funnel-vectorize.js --space=${space}`);
  process.exit(2);
}

const index = JSON.parse(fs.readFileSync(INDEX, 'utf8'));
const meta  = index._meta || {};
let records = Array.isArray(index.records) ? index.records : [];

// backend-drift guard: a stub-built index queried by Voyage (or vice-versa) gives garbage cosine.
if (!!meta.is_stub !== isStub()) {
  console.error(`[warn] index backend (${meta.backend}) != current backend (${backendName()}).`);
  console.error('[warn] Rebuild the index with the same backend you query with, or results are meaningless.');
}

// --- 1. structured prefilter (free; labels already present) ---
const norm = s => String(s == null ? '' : s).trim().toLowerCase();
if (opts.belief)        records = records.filter(r => norm(r.belief_id)  === norm(opts.belief));
if (opts['proof-tier']) records = records.filter(r => norm(r.proof_tier) === norm(opts['proof-tier']));

if (records.length === 0) {
  console.error('[warn] prefilter eliminated all records — relax --belief/--proof-tier.');
}

(async () => {
  // --- 2. semantic rank ---
  let ranked = records;
  if (records.length > 0) {
    const [qvec] = await embed([opts.query], { inputType: 'query' });
    ranked = records
      .map(r => ({ r, sim: cosine(qvec, r.vector) }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, top);
  }

  // --- 3. emit ---
  if (opts.json) {
    const out = JSON.stringify({
      query: opts.query, space, backend: backendName(),
      prefilter: { belief: opts.belief || null, proof_tier: opts['proof-tier'] || null },
      results: ranked.map(({ r, sim }) => ({ sim, ...r, vector: undefined })),
    }, null, 2);
    return write(out);
  }

  const lines = [];
  lines.push(`=== WINNING-FUNNEL RAG · space=${space} · backend=${backendName()}${meta.is_stub ? ' · STUB(lexical-only)' : ''} ===`);
  lines.push(`Query: ${opts.query}`);
  const pf = [opts.belief && `belief=${opts.belief}`, opts['proof-tier'] && `proof_tier=${opts['proof-tier']}`].filter(Boolean).join(', ');
  lines.push(`Prefilter: ${pf || 'none'} · returned ${ranked.length} of ${index.records.length} indexed`);
  lines.push('Use these as STRUCTURAL/PERSUASIVE reference for how proven funnels install this belief — adapt, do not copy verbatim into a different transformation.');
  lines.push('');
  ranked.forEach(({ r, sim }, i) => {
    lines.push(`--- [${i + 1}] sim=${sim.toFixed(3)} · ${r.competitor || 'unknown'} · belief=${r.belief_id || '?'} · ${r.proof_tier || '?'} · exec=${r.execution_type || '?'}`);
    if (r.validation_strength != null) lines.push(`    proven: lane ${r.validation_lane || '?'} · ${typeof r.validation_strength === 'object' ? JSON.stringify(r.validation_strength) : r.validation_strength}`);
    lines.push(`    execution: ${r.execution_detail || '(none)'}`);
    const refs = (r.verbatim_refs || []);
    if (refs.length) {
      lines.push('    verbatim:');
      for (const ref of refs) {
        const t = typeof ref === 'string' ? ref : (ref.text || ref.quote || ref.verbatim || '');
        const tag = (ref && ref.tag) ? ` (${ref.tag})` : '';
        if (t) lines.push(`      - "${t}"${tag}`);
      }
    }
    lines.push('');
  });
  write(lines.join('\n'));

  function write(s) {
    if (opts.out) { fs.writeFileSync(String(opts.out), s); console.error(`[written] ${opts.out}`); }
    else process.stdout.write(s + '\n');
  }
})().catch(e => { console.error(`rag-query failed: ${e.message}`); process.exit(2); });
