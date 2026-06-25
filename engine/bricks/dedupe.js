// tools/dedupe.js
// Merge brands.json rows that share a normalized domain into one row.
// Domain key = host of row.url, normalized: strip protocol/path/www., then
//   .toLowerCase().replace(/[^a-z0-9]+/g, '')
// For each group:
//   - Union found_by[] across all rows (dedupe the array)
//   - Keep richest channel: crowdfunding > dtc > marketplace
//   - Keep first non-empty url, product_observed, sells_observed, relevance, price_points
// Emits clean brands.json preserving top-level shape (starting_point, brands[], dropped[]).
// Idempotent: running twice on already-deduped input yields the same output.
//
// Usage:
//   node tools/dedupe.js [--in=brands.json] [--out=brands.json] [--help]

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log(
    'Usage: node tools/dedupe.js [--in=brands.json] [--out=brands.json] [--help]\n' +
    '\n' +
    'Merge brands.json rows that share a normalized domain into one row.\n' +
    '  --in   Path to input brands.json (default: brands.json)\n' +
    '  --out  Path to output brands.json (default: same as --in)\n' +
    '  --help Show this help\n'
  );
  process.exit(0);
}

const inFile = opts.in || 'brands.json';
const outFile = opts.out || inFile;

// Channel richness order (higher index = richer)
const CHANNEL_RANK = { marketplace: 0, dtc: 1, crowdfunding: 2 };

function normalizeHost(url) {
  if (!url) return null;
  try {
    let u = url.trim();
    if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
    const host = new URL(u).hostname.replace(/^www\./i, '');
    return host.toLowerCase().replace(/[^a-z0-9]+/g, '');
  } catch (e) {
    // Fallback: strip protocol + www. + paths manually
    const stripped = url
      .replace(/^https?:\/\//i, '')
      .replace(/^www\./i, '')
      .split('/')[0];
    return stripped.toLowerCase().replace(/[^a-z0-9]+/g, '');
  }
}

function pickFirst(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
}

function pickFirstArray(...arrays) {
  for (const a of arrays) {
    if (Array.isArray(a) && a.length > 0) return a;
  }
  return [];
}

function mergeGroup(rows) {
  if (rows.length === 1) return rows[0];

  // Sort by channel richness descending so the "richest" row is first
  const sorted = [...rows].sort((a, b) => {
    const ra = CHANNEL_RANK[a.channel] ?? -1;
    const rb = CHANNEL_RANK[b.channel] ?? -1;
    return rb - ra;
  });

  const richest = sorted[0];

  // Union found_by arrays
  const foundBySet = new Set();
  for (const row of rows) {
    if (Array.isArray(row.found_by)) {
      for (const fb of row.found_by) foundBySet.add(fb);
    }
  }

  const merged = Object.assign({}, richest);
  merged.found_by = Array.from(foundBySet);

  // Keep first non-empty values from all rows (richest first)
  merged.url = pickFirst(...sorted.map(r => r.url));
  merged.product_observed = pickFirst(...sorted.map(r => r.product_observed));
  merged.sells_observed = pickFirst(...sorted.map(r => r.sells_observed));
  merged.relevance = pickFirst(...sorted.map(r => r.relevance));
  merged.price_points = pickFirstArray(...sorted.map(r => r.price_points));

  // Keep crowdfunding block from richest row that has one
  const crowdfundRow = sorted.find(r => r.crowdfunding && typeof r.crowdfunding === 'object');
  if (crowdfundRow) merged.crowdfunding = crowdfundRow.crowdfunding;

  return merged;
}

// --- Main ---
let raw;
try {
  raw = fs.readFileSync(path.resolve(inFile), 'utf8');
} catch (e) {
  console.error(`dedupe.js: cannot read ${inFile}: ${e.message}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error(`dedupe.js: invalid JSON in ${inFile}: ${e.message}`);
  process.exit(1);
}

const brands = Array.isArray(data.brands) ? data.brands : [];
const groups = new Map();

for (const brand of brands) {
  const key = normalizeHost(brand.url);
  const bucket = key || `__no_url_${brand.slug || Math.random()}`;
  if (!groups.has(bucket)) groups.set(bucket, []);
  groups.get(bucket).push(brand);
}

const deduped = [];
let mergeCount = 0;
for (const [, group] of groups) {
  if (group.length > 1) mergeCount++;
  deduped.push(mergeGroup(group));
}

const out = Object.assign({}, data, { brands: deduped });

fs.writeFileSync(path.resolve(outFile), JSON.stringify(out, null, 2));
console.log(
  `dedupe.js: ${brands.length} → ${deduped.length} brands (${mergeCount} groups merged). Written to ${outFile}`
);
