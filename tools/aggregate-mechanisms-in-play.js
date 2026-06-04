#!/usr/bin/env node
// aggregate-mechanisms-in-play.js — BREAK 5 deterministic merge step.
//
// Reads the scoped clustering agent's sidecar (canonical mechanisms + brand membership — the JUDGMENT)
// and merges a `mechanisms_in_play[]` field into space-map.json (the COUNTING + WRITING — deterministic).
// Brick law: agent canonicalizes; this script counts distinct brands, computes ownability, scopes per
// cell, and writes. The agent never touches space-map.json.
//
//   Top-level mechanisms_in_play[] = space-wide catalog: { canonical, raw_variants[], brand_count, ownability }
//   Per-combo  mechanisms_in_play[] = cell-scoped:        { canonical, brand_count, ownability, brands[] }
//   ownability: shared ⟺ brand_count >= 3 (taken) ; unique ⟺ <= 2 (ownable). Cell ownability is recomputed
//   from the intersection of the canonical's brands with that cell's brands (a mechanism shared elsewhere
//   is not taken here).
//
// Idempotent: rebuilds the field from the sidecar each run (overwrites any prior mechanisms_in_play).
// Re-serializes space-map.json with 2-space indent. Verify additivity semantically (deep-equal all other
// keys), not by raw text diff — re-serialization drops cosmetic blank lines only.
//
// Usage: node tools/aggregate-mechanisms-in-play.js
//   [--sidecar=PATH] (default runs/arduview/_mechanisms-in-play.agent.json)
//   [--space-map=PATH] (default space-map.json)
// Exit 0 = written. Exit 2 = bad input.
'use strict';

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

const ROOT = path.resolve(__dirname, '..');
const SIDECAR = path.resolve(opts.sidecar || path.join(ROOT, 'runs', 'arduview', '_mechanisms-in-play.agent.json'));
const SPACE_MAP = path.resolve(opts['space-map'] || path.join(ROOT, 'space-map.json'));

function fail(msg) { console.error(`[aggregate-mechanisms] REJECT: ${msg}`); process.exit(2); }

let sidecar, spaceMap;
try { sidecar = JSON.parse(fs.readFileSync(SIDECAR, 'utf8')); } catch (e) { fail(`cannot read sidecar ${SIDECAR} — ${e.message}`); }
try { spaceMap = JSON.parse(fs.readFileSync(SPACE_MAP, 'utf8')); } catch (e) { fail(`cannot read space-map ${SPACE_MAP} — ${e.message}`); }

const clusters = sidecar.canonical_mechanisms;
if (!Array.isArray(clusters) || clusters.length === 0) fail('sidecar has no canonical_mechanisms[]');

const ownability = (n) => (n >= 3 ? 'shared' : 'unique');
const distinct = (arr) => [...new Set(arr)];
// Stable sort: most-shared first, then alphabetical canonical.
const byShareThenName = (a, b) => (b.brand_count - a.brand_count) || a.canonical.localeCompare(b.canonical);

// --- Top-level space-wide catalog ---
const topLevel = clusters.map(c => {
  const brands = distinct(c.brands || []);
  if (!c.canonical || !Array.isArray(c.raw_variants) || c.raw_variants.length === 0 || brands.length === 0) {
    fail(`malformed cluster: ${JSON.stringify(c).slice(0, 120)}`);
  }
  return { canonical: c.canonical, raw_variants: c.raw_variants, brand_count: brands.length, ownability: ownability(brands.length) };
}).sort(byShareThenName);

// --- Per-combo cell-scoped presence (intersection of each canonical's brands with the cell's brands) ---
const combos = spaceMap.combos || [];
const perCombo = new Map(); // combo index -> mechanisms_in_play[]
for (let i = 0; i < combos.length; i++) {
  const cellBrands = new Set(combos[i].brands || []);
  const cellMechs = [];
  for (const c of clusters) {
    const inter = distinct(c.brands || []).filter(b => cellBrands.has(b));
    if (inter.length === 0) continue;
    inter.sort();
    cellMechs.push({ canonical: c.canonical, brand_count: inter.length, ownability: ownability(inter.length), brands: inter });
  }
  cellMechs.sort(byShareThenName);
  perCombo.set(i, cellMechs);
}

// --- Rebuild space-map with controlled key order (top-level field after bet_types; per-combo after claims) ---
function reorder(obj, insertAfterKey, newKey, newVal) {
  const out = {};
  for (const k of Object.keys(obj)) {
    if (k === newKey) continue; // drop any prior copy (idempotent)
    out[k] = obj[k];
    if (k === insertAfterKey) out[newKey] = newVal;
  }
  if (!(newKey in out)) out[newKey] = newVal; // fallback: append if anchor missing
  return out;
}

const rebuiltCombos = combos.map((c, i) => reorder(c, 'claims', 'mechanisms_in_play', perCombo.get(i)));
let rebuilt = { ...spaceMap, combos: rebuiltCombos };
rebuilt = reorder(rebuilt, 'bet_types', 'mechanisms_in_play', topLevel);

fs.writeFileSync(SPACE_MAP, JSON.stringify(rebuilt, null, 2) + '\n', 'utf8');

const sharedTop = topLevel.filter(m => m.ownability === 'shared').length;
console.error(`[aggregate-mechanisms] wrote ${topLevel.length} top-level mechanisms (${sharedTop} shared / ${topLevel.length - sharedTop} unique) + per-combo presence for ${combos.length} cells → ${SPACE_MAP}`);
process.exit(0);
