// tools/revenue-est.js
// Deterministic revenue-estimate arithmetic for each brand in brands.json.
// Formula (verbatim spec L174, worked example: 300,000 × 0.02 × $60 = $360,000/mo):
//   value_usd_monthly = monthly_visits × cvr_assumption × aov_usd
//   cvr_assumption default = 0.02 (stored as an assumption, never a measured fact)
//   aov_usd ← derived from brand.price_points (first $NNN numeric); else --aov= flag; else null
//   monthly_visits ← inputs.monthly_visits (operator-populated; this script NEVER fetches traffic)
//
// Never-fabricate rule (D-10):
//   - Always emit method + confidence alongside any value_usd_monthly
//   - monthly_visits null → method:"review_proxy" (value ≈ review_count × category_multiplier × aov_usd), confidence:"low"
//   - Neither visits nor review proxy → value_usd_monthly:null, method:null, confidence omitted/null
//   - NEVER write "PENDING" as a value (the InkLeaf failure: SimilarWeb PENDING on all 31 records)
//   - revenue_est is attached to every brand; it is NEVER a hard roster gate (D-09)
//
// D-11: NO auto-browser SimilarWeb scraping; no traffic fetch; monthly_visits arrives pre-populated.
// API keys must NEVER be hardcoded/committed (T-01-06).
//
// Usage:
//   node tools/revenue-est.js [--in=brands.json] [--out=brands.json] [--aov=NNN] [--help]

const fs = require('fs');
const path = require('path');

const CVR_DEFAULT = 0.02;

// Closed category_multiplier for review_proxy (rough ecom industry benchmarks)
// review_count × category_multiplier × aov ≈ monthly_revenue_proxy
const REVIEW_PROXY_MULTIPLIER = 10;

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log(
    'Usage: node tools/revenue-est.js [--in=brands.json] [--out=brands.json] [--aov=NNN] [--help]\n' +
    '\n' +
    'Compute revenue_est.value_usd_monthly per brand by deterministic arithmetic.\n' +
    '  --in   Path to input brands.json (default: brands.json)\n' +
    '  --out  Path to output brands.json (default: same as --in)\n' +
    '  --aov  Override aov_usd for brands with no price_points (numeric, e.g. 60)\n' +
    '  --help Show this help\n' +
    '\n' +
    'Worked example sanity: 300000 × 0.02 × 60 = ' + (300000 * CVR_DEFAULT * 60) + '/mo\n'
  );
  process.exit(0);
}

const inFile = opts.in || 'brands.json';
const outFile = opts.out || inFile;
const globalAovOverride = opts.aov ? parseFloat(opts.aov) : null;

// Parse first $NNN or $N,NNN numeric from price_points array
function parseAov(pricePoints) {
  if (!Array.isArray(pricePoints)) return null;
  for (const pp of pricePoints) {
    const m = String(pp).match(/\$([\d,]+(?:\.\d+)?)/);
    if (m) {
      const v = parseFloat(m[1].replace(/,/g, ''));
      if (!isNaN(v) && v > 0) return v;
    }
  }
  return null;
}

// Parse review_count from brand fields (look for reviews_count or similar)
function parseReviewCount(brand) {
  // Check common field names
  for (const field of ['reviews_count', 'review_count', 'num_reviews']) {
    if (typeof brand[field] === 'number') return brand[field];
  }
  // Check inside revenue_est.inputs if already present
  const inputs = brand.revenue_est && brand.revenue_est.inputs;
  if (inputs && typeof inputs.review_count === 'number') return inputs.review_count;
  return null;
}

// Determine confidence from visits_source
function confidenceFromSource(visitsSource) {
  if (visitsSource === 'semrush-api') return 'medium';
  if (visitsSource === 'similarweb-manual') return 'medium';
  if (visitsSource === 'proxy') return 'low';
  return 'low';
}

function computeRevEst(brand) {
  // Read inputs block if it exists (operator may have pre-populated some fields)
  const existingInputs = (brand.revenue_est && brand.revenue_est.inputs) || {};

  const monthlyVisits = existingInputs.monthly_visits != null
    ? Number(existingInputs.monthly_visits)
    : null;
  const visitsSource = existingInputs.visits_source || null;
  const cvrAssumption = typeof existingInputs.cvr_assumption === 'number'
    ? existingInputs.cvr_assumption
    : CVR_DEFAULT;

  // AOV: price_points first, then --aov flag, then null
  const parsedAov = parseAov(brand.price_points);
  let aovUsd = null;
  let aovSource = null;
  if (parsedAov !== null) {
    aovUsd = parsedAov;
    aovSource = 'observed-price';
  } else if (globalAovOverride !== null) {
    aovUsd = globalAovOverride;
    aovSource = 'estimate';
  } else if (typeof existingInputs.aov_usd === 'number') {
    aovUsd = existingInputs.aov_usd;
    aovSource = existingInputs.aov_source || 'estimate';
  }

  const inputs = {
    monthly_visits: monthlyVisits,
    visits_source: visitsSource,
    cvr_assumption: cvrAssumption,
    aov_usd: aovUsd,
    aov_source: aovSource,
  };

  // Never-fabricate logic (D-10)
  if (monthlyVisits !== null && !isNaN(monthlyVisits) && monthlyVisits > 0 && aovUsd !== null) {
    // traffic_formula path
    const value = monthlyVisits * cvrAssumption * aovUsd;
    return {
      value_usd_monthly: Math.round(value),
      method: 'traffic_formula',
      confidence: confidenceFromSource(visitsSource),
      inputs,
      notes: `${monthlyVisits} visits × ${cvrAssumption} CVR × $${aovUsd} AOV`,
    };
  }

  if (monthlyVisits === null || isNaN(monthlyVisits)) {
    // review_proxy path (D-10: null visits → review_proxy or explicit null)
    const reviewCount = parseReviewCount(brand);
    if (reviewCount !== null && reviewCount > 0 && aovUsd !== null) {
      const value = reviewCount * REVIEW_PROXY_MULTIPLIER * aovUsd;
      return {
        value_usd_monthly: Math.round(value),
        method: 'review_proxy',
        confidence: 'low',
        inputs: Object.assign({}, inputs, { visits_source: 'review-proxy', review_count: reviewCount }),
        notes: `review_proxy: ${reviewCount} reviews × ${REVIEW_PROXY_MULTIPLIER} multiplier × $${aovUsd} AOV (low confidence)`,
      };
    }
    // No visits and no review proxy → explicit null (never "PENDING")
    return {
      value_usd_monthly: null,
      method: null,
      confidence: null,
      inputs,
      notes: 'monthly_visits null and no review proxy available — explicit null, not PENDING',
    };
  }

  // Has visits but no AOV — can't compute
  return {
    value_usd_monthly: null,
    method: null,
    confidence: null,
    inputs,
    notes: 'monthly_visits present but aov_usd unavailable — supply price_points or --aov flag',
  };
}

// --- Main ---
let raw;
try {
  raw = fs.readFileSync(path.resolve(inFile), 'utf8');
} catch (e) {
  console.error(`revenue-est.js: cannot read ${inFile}: ${e.message}`);
  process.exit(1);
}

let data;
try {
  data = JSON.parse(raw);
} catch (e) {
  console.error(`revenue-est.js: invalid JSON in ${inFile}: ${e.message}`);
  process.exit(1);
}

const brands = Array.isArray(data.brands) ? data.brands : [];
const results = [];

for (const brand of brands) {
  try {
    const revEst = computeRevEst(brand);
    const updated = Object.assign({}, brand, { revenue_est: revEst });
    results.push(updated);
  } catch (e) {
    console.error(`revenue-est.js: error processing brand ${brand.slug || '(no slug)'}: ${e.message}`);
    // Resilient: keep original brand with null revenue_est
    results.push(Object.assign({}, brand, {
      revenue_est: {
        value_usd_monthly: null,
        method: null,
        confidence: null,
        inputs: {},
        notes: `error during computation: ${e.message}`,
      }
    }));
  }
}

const out = Object.assign({}, data, { brands: results });
fs.writeFileSync(path.resolve(outFile), JSON.stringify(out, null, 2));

const computed = results.filter(b => b.revenue_est && b.revenue_est.value_usd_monthly !== null).length;
const reviewProxy = results.filter(b => b.revenue_est && b.revenue_est.method === 'review_proxy').length;
const nullOut = results.filter(b => b.revenue_est && b.revenue_est.value_usd_monthly === null).length;
console.log(
  `revenue-est.js: ${brands.length} brands processed. ` +
  `traffic_formula=${computed - reviewProxy}, review_proxy=${reviewProxy}, null=${nullOut}. ` +
  `Written to ${outFile}`
);
