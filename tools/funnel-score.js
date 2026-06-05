#!/usr/bin/env node
// funnel-score.js
// Two-currency validation scorer for funnel_package records.
//
// Deterministic pure-arithmetic script — NO LLM (CLAUDE.md: deterministic → script).
// Modeled on fetch.js classifyTrendShape (lines 263-291): pure arithmetic, documented
// thresholds, no judgment.
//
// TWO CURRENCIES — NEVER normalized into one number (D-09, spec §3):
//   Currency A (ad-fed): max_run_duration_days × impression_bucket × variant_count
//   Currency B (crowdfunding): amount_raised, backer_count, funded_vs_failed, delivered_vs_not
//
// A funnel running Meta ads INTO a crowdfunding page carries BOTH lanes. Both are stamped.
// The birdseye agent (downstream) weights within each lane — cross-currency weighting is NOT
// done here. The scorer's only job: stamp validation_lane + validation_strength onto the funnel.
//
// Anti-fluke discipline (spec §3, step1 lines 159-161):
//   The 60-day floor is SURFACED (flagged in output), NEVER used to gate/drop funnels.
//   Weak funnels stay in the corpus — birdseye sees everything.
//
// Usage:
//   node tools/funnel-score.js <funnel-package.json> [--out=<dir>] [--help]
//   node tools/funnel-score.js ./funnels/ [--out=./funnels-scored] [--help]
//
// Output per funnel: <out>/<funnel_id>-scored.json
//   Original funnel_package + stamped validation_lane + validation_strength (per-lane object)

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI arg parse (positional + --flag=val — canonical adlib-one.js pattern)
// ---------------------------------------------------------------------------
const rawArgs = process.argv.slice(2);
const flagArgs = rawArgs.filter(a => a.startsWith('--'));
const posArgs  = rawArgs.filter(a => !a.startsWith('--'));

const opts = Object.fromEntries(
  flagArgs.map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log(
    'Usage: node tools/funnel-score.js <funnel-package.json|dir> [--out=<dir>] [--help]\n' +
    '\n' +
    'Stamps validation_lane + validation_strength onto funnel_package records.\n' +
    'Two currencies (A = ad-fed, B = crowdfunding) — never normalized into one number.\n' +
    '\n' +
    '  <funnel-package.json>  Path to a funnel_package JSON or a directory of them\n' +
    '  --out                  Output directory (default: ./funnels-scored)\n' +
    '  --help                 Show this help\n' +
    '\n' +
    'Output per funnel: <out>/<funnel_id>-scored.json\n' +
    '  Original funnel_package fields + validation_lane[] + validation_strength{}\n' +
    '\n' +
    'Currency A (ad-fed): max_run_duration_days × impression_bucket_multiplier × variant_count\n' +
    '  60-day floor = anti-fluke threshold (~top 11% of all active ads). SURFACED, not gated.\n' +
    'Currency B (crowdfunding): amount_raised, backer_count, funded_vs_failed, delivered_vs_not\n' +
    '  delivered_vs_not is the strongest durability signal (prior campaign shipped).\n'
  );
  process.exit(0);
}

const inputPath = posArgs[0];
if (!inputPath) {
  console.error('usage: node tools/funnel-score.js <funnel-package.json|dir> [--out=<dir>]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// DOCUMENTED THRESHOLD BLOCK (classifyTrendShape style — explicit, calibrated)
// These thresholds are the load-bearing constants for Currency A scoring.
//
// Anti-fluke floor: 60 days
//   Source: Meta Ad Library data — ~11% of all active ads have been running 60+ days.
//   Rationale: An ad running 60+ days has survived at least 2 billing cycles and Facebook's
//   own auto-optimization kill switch. This is the empirical floor below which ad longevity
//   is ambiguous (could be a test budget holdover). SURFACE this threshold — do NOT use it
//   to gate. The scorer stamps it; birdseye weights it.
//
// Impression bucket multipliers (coarse range → relative weight):
//   Meta Ad Library exposes impression buckets, not exact counts. DSA-mandate data (EU filter)
//   gives tighter ranges. Map each bucket to an ordinal multiplier for relative weighting.
//   These are relative weights, not absolute impression counts.
//   Source: Meta Ad Library bucket labels as observed in the Ad Library UI (2026).
//
// Variant count multiplier:
//   Each additional distinct active ad pointing to the same LP = additional creative investment.
//   More variants ≈ more spend ≈ higher confidence. Used as a multiplier, not a gate.
// ---------------------------------------------------------------------------

const ANTI_FLUKE_FLOOR_DAYS = 60; // ~top 11% of all active ads; surface only, never gate

// Map impression bucket label → ordinal multiplier (1-7 scale, linear enough for ranking)
// Bucket labels as they appear in Meta Ad Library innerText:
const IMPRESSION_BUCKET_MULTIPLIERS = {
  // KS Meta Ad Library labels (US/global view)
  'less than 1,000': 1,
  'under 1,000':     1,
  '1,000 - 5,000':  2,
  '1000 - 5000':    2,
  '5,000 - 10,000': 3,
  '5000 - 10000':   3,
  '10,000 - 50,000':  4,
  '10000 - 50000':    4,
  '50,000 - 100,000': 5,
  '50000 - 100000':   5,
  '100,000 - 500,000':  6,
  '100000 - 500000':    6,
  '500,000 - 1,000,000': 7,
  '500000 - 1000000':    7,
  '1,000,000+':   8,
  '1000000+':     8,
  // EU/DSA labels (tighter ranges when filtering by EU country)
  '< 1,000':   1,
  '1,000–5,000': 2,
  '5,000–10,000': 3,
  '10,000–50,000': 4,
  '50,000–100,000': 5,
  '100,000–500,000': 6,
  '500,000–1,000,000': 7,
};

const DEFAULT_IMPRESSION_MULTIPLIER = 1; // unknown bucket → minimum multiplier (never null out)

// ---------------------------------------------------------------------------
// Helper: daysBetween — from adlib-one.js lines 96-99 (copyable arithmetic)
// ---------------------------------------------------------------------------
function daysBetween(a, b) {
  const t1 = new Date(a), t2 = new Date(b);
  if (isNaN(t1.getTime()) || isNaN(t2.getTime())) return null;
  return Math.max(0, Math.round((t2 - t1) / 86400000));
}

// ---------------------------------------------------------------------------
// resolveImpressionMultiplier(bucket_label) — map bucket string to multiplier
// ---------------------------------------------------------------------------
function resolveImpressionMultiplier(bucket) {
  if (!bucket) return DEFAULT_IMPRESSION_MULTIPLIER;
  const norm = String(bucket).trim().toLowerCase();
  // Exact match (covers all defined label variants including comma/dash/en-dash forms)
  for (const [key, val] of Object.entries(IMPRESSION_BUCKET_MULTIPLIERS)) {
    if (key.toLowerCase() === norm) return val;
  }
  // IN-04: dropped bidirectional includes() fallback — it is order-dependent and ambiguous.
  // A short label like "1,000" is a substring of multiple bucket keys ("1,000 - 5,000" AND
  // "500,000 - 1,000,000"), so the match depends on Object.keys() iteration order.
  // Falling back to the default multiplier on an unrecognised label is safer than a
  // confident wrong bucket assignment.
  return DEFAULT_IMPRESSION_MULTIPLIER;
}

// ---------------------------------------------------------------------------
// scoreCurrencyA(bound_ads) — ad-fed validation (spec §3 Currency A)
//
// max_run_duration_days: Math.max over all bound ads' run_length_days — the spine.
//   60+ days ≈ top ~11% anti-fluke floor. SURFACED, never gated.
// impression_bucket_multiplier: resolveImpressionMultiplier on the BEST bucket across ads.
// variant_count: number of distinct ads in the cluster.
//
// Returns null if bound_ads is empty (no Currency A signal).
// Never drops the funnel — returns a scored object even for weak signals.
// ---------------------------------------------------------------------------
function scoreCurrencyA(bound_ads) {
  if (!bound_ads || bound_ads.length === 0) return null;

  // max_run_duration_days from pre-computed run_length_days (adlib-one.js daysBetween output)
  // Fall back to computing from started_running_date if run_length_days absent (D-06 compatibility)
  const durations = bound_ads.map(ad => {
    if (typeof ad.run_length_days === 'number') return ad.run_length_days;
    if (ad.started_running_date) {
      return daysBetween(ad.started_running_date, new Date().toISOString().slice(0, 10));
    }
    return null;
  }).filter(d => d !== null);

  const max_run_duration_days = durations.length > 0 ? Math.max(...durations) : null;

  // impression_bucket_multiplier: take the highest bucket across all ads in the cluster
  const bucketMultipliers = bound_ads.map(ad =>
    resolveImpressionMultiplier(ad.impression_bucket)
  );
  const impression_bucket_multiplier = Math.max(...bucketMultipliers, DEFAULT_IMPRESSION_MULTIPLIER);

  // impression_bucket: record the label of the highest-multiplier ad for auditability
  const bestBucketIdx = bucketMultipliers.indexOf(impression_bucket_multiplier);
  const impression_bucket = bound_ads[bestBucketIdx]?.impression_bucket || null;

  const variant_count = bound_ads.length;

  // Composite score: max_run × impression_multiplier × variant_count
  // This is an ORDINAL ranking instrument, not an absolute measurement.
  // The components are kept separate so birdseye can weight them independently.
  const composite = max_run_duration_days !== null
    ? max_run_duration_days * impression_bucket_multiplier * variant_count
    : null;

  return {
    max_run_duration_days,
    impression_bucket,
    impression_bucket_multiplier,
    variant_count,
    composite_rank_score: composite,
    meets_anti_fluke_floor: max_run_duration_days !== null
      ? max_run_duration_days >= ANTI_FLUKE_FLOOR_DAYS
      : null,
    _anti_fluke_floor: ANTI_FLUKE_FLOOR_DAYS,
    _anti_fluke_note: `${ANTI_FLUKE_FLOOR_DAYS}-day floor = ~top 11% of all active Meta ads. SURFACED only — weak funnels are NOT dropped.`,
    _scoring_note: 'Composite = max_run_duration_days × impression_bucket_multiplier × variant_count. Ordinal ranking instrument only.',
  };
}

// ---------------------------------------------------------------------------
// scoreCurrencyB(crowdfunding_stats) — crowdfunding validation (spec §3 Currency B)
//
// Carries the four Currency-B fields as-is from crowdfunding_stats.
// delivered_vs_not is the strongest durability signal (prior campaign shipped).
// Returns null if crowdfunding_stats is null/absent.
// ---------------------------------------------------------------------------
function scoreCurrencyB(crowdfunding_stats) {
  if (!crowdfunding_stats) return null;

  const { amount_raised, backer_count, funded_vs_failed, delivered_vs_not } = crowdfunding_stats;

  // All fields carried verbatim — no normalization. birdseye weights these.
  return {
    amount_raised:    amount_raised    ?? null,
    backer_count:     backer_count     ?? null,
    funded_vs_failed: funded_vs_failed ?? null,
    delivered_vs_not: delivered_vs_not ?? null,
    _scoring_note: 'Committed money, not modeled traffic. delivered_vs_not = strongest durability signal (prior campaign shipped). All fields carried verbatim for birdseye weighting.',
    _delivered_signal: delivered_vs_not === 'delivered'
      ? 'STRONG: prior campaign confirmed shipped — highest durability signal'
      : delivered_vs_not === 'not_delivered'
      ? 'WEAK: prior campaign not yet confirmed shipped'
      : 'UNKNOWN: delivered_vs_not not surfaced on this page (check creator profile)',
  };
}

// ---------------------------------------------------------------------------
// scoreFunnelPackage(pkg) — stamp validation_lane + validation_strength
//
// A funnel running Meta ads INTO a crowdfunding page carries BOTH lanes.
// validation_lane is an array, not a string — it can be ['A'], ['B'], or ['A', 'B'].
// validation_strength is a per-lane object keyed by 'A' and/or 'B'.
//
// NEVER normalize the two lanes into a single number (D-09).
// ---------------------------------------------------------------------------
function scoreFunnelPackage(pkg) {
  const scoreA = scoreCurrencyA(pkg.bound_ads);
  const scoreB = scoreCurrencyB(pkg.crowdfunding_stats);

  const validation_lane   = [];
  const validation_strength = {};

  if (scoreA !== null) {
    validation_lane.push('A');
    validation_strength['A'] = scoreA;
  }
  if (scoreB !== null) {
    validation_lane.push('B');
    validation_strength['B'] = scoreB;
  }

  // A funnel with no ads and no crowdfunding stats still gets stamped (unknown lane)
  if (validation_lane.length === 0) {
    validation_lane.push('unknown');
    validation_strength['unknown'] = {
      _note: 'No bound_ads and no crowdfunding_stats — validation lane cannot be determined.',
    };
  }

  return {
    ...pkg,
    validation_lane,
    validation_strength,
    _validation_note: 'TWO CURRENCIES — NOT normalized into one number (D-09, spec §3). Birdseye weights within each lane. validation_lane can be A, B, or both.',
  };
}

// ---------------------------------------------------------------------------
// hasValidationCurrency(pkg) — D-02 fail-fast guard
//
// Returns true if the package carries at least one legitimate validation currency:
//   Currency A = non-empty bound_ads array (scoreCurrencyA returns non-null)
//   Currency B = present crowdfunding_stats object (scoreCurrencyB returns non-null)
//
// Reuses the existing scoring functions so "valid" stays single-sourced.
// Wired at the CLI boundary only — scoreFunnelPackage is left intact so
// any downstream caller importing the function is unaffected.
// ---------------------------------------------------------------------------
function hasValidationCurrency(pkg) {
  return scoreCurrencyA(pkg.bound_ads) !== null || scoreCurrencyB(pkg.crowdfunding_stats) !== null;
}

// ---------------------------------------------------------------------------
// Discover input funnel packages (single file or directory)
// ---------------------------------------------------------------------------
const results = [];
let funnelFiles = [];

const stat = fs.statSync(inputPath);

if (stat.isDirectory()) {
  const outDir = opts.out || path.join(inputPath, '..', 'funnels-scored');
  fs.mkdirSync(outDir, { recursive: true });

  try {
    funnelFiles = fs.readdirSync(inputPath)
      .filter(f => f.endsWith('.json') && !f.startsWith('_'))
      .map(f => path.join(inputPath, f));
  } catch (e) {
    console.error(`[funnel-score] ERROR: cannot read directory ${inputPath} — ${e.message}`);
    process.exit(1);
  }

  // D-02 no-currency flag — set true if any funnel in the batch lacks both currencies.
  // Batch stays resilient (one bad funnel never aborts), but exits non-zero at the end
  // so the run cannot silently pass with unscoreable packages.
  let hadNoCurrency = false;

  // Resilient batch — one bad funnel never aborts (fetch.js pattern)
  for (const funnelFile of funnelFiles) {
    try {
      const raw = fs.readFileSync(funnelFile, 'utf8');
      const pkg = JSON.parse(raw);

      // D-02: no-currency guard — do NOT write a scored file for packages with no currency.
      if (!hasValidationCurrency(pkg)) {
        const funnel_id = pkg.funnel_id || path.basename(funnelFile, '.json');
        const line = `[NO-CURRENCY] ${path.basename(funnelFile)}: ${funnel_id} has no validation currency — neither bound_ads (Currency A) nor crowdfunding_stats (Currency B). Excluded from scored output. No-ads DTC brands must be EXCLUDED upstream, not scored — see funnel-deep-pass SKILL corpus/no-ads guard.`;
        results.push(line);
        console.error(line);
        hadNoCurrency = true;
        continue;
      }

      const scored = scoreFunnelPackage(pkg);
      const funnel_id = scored.funnel_id || path.basename(funnelFile, '.json');
      const outFile = path.join(outDir, `${funnel_id}-scored.json`);
      fs.writeFileSync(outFile, JSON.stringify(scored, null, 2));

      const laneStr = scored.validation_lane.join('+');
      const aScore = scored.validation_strength['A'];
      const bScore = scored.validation_strength['B'];
      const aSummary = aScore
        ? `A: ${aScore.max_run_duration_days}d × ${aScore.impression_bucket_multiplier} × ${aScore.variant_count}v = ${aScore.composite_rank_score} [floor=${aScore.meets_anti_fluke_floor}]`
        : '';
      const bSummary = bScore
        ? `B: raised=${bScore.amount_raised} backers=${bScore.backer_count} funded=${bScore.funded_vs_failed} delivered=${bScore.delivered_vs_not}`
        : '';

      const line = `${funnel_id}: lane=${laneStr} | ${[aSummary, bSummary].filter(Boolean).join(' | ')}`;
      results.push(line);
      console.log(line);
    } catch (e) {
      const line = `[ERROR] ${path.basename(funnelFile)}: ${e.message}`;
      results.push(line);
      console.log(line);
    }
  }

  // Write sidecar log
  try {
    fs.writeFileSync(path.join(outDir, '_funnel-score-log.txt'), results.join('\n') + '\n');
  } catch (_) {}

  console.log(`[funnel-score] done — ${funnelFiles.length} funnel(s) scored`);

  // D-02: fail loud if any package lacked currency — run cannot pass silently
  if (hadNoCurrency) {
    console.error('[funnel-score] FAIL: one or more packages had no validation currency — see _funnel-score-log.txt');
    process.exit(1);
  }

} else {
  // Single file mode
  const outDir = opts.out || path.dirname(inputPath);

  try {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const pkg = JSON.parse(raw);

    // D-02: no-currency guard — fail loud before scoring or writing any output
    if (!hasValidationCurrency(pkg)) {
      const funnel_id = pkg.funnel_id || path.basename(inputPath, '.json');
      console.error(`[funnel-score] FAIL: ${funnel_id} has no validation currency — neither bound_ads (Currency A) nor crowdfunding_stats (Currency B). Nothing legitimate to score. (No-ads DTC brands must be EXCLUDED upstream, not scored — see funnel-deep-pass SKILL corpus/no-ads guard.)`);
      process.exit(1);
    }

    const scored = scoreFunnelPackage(pkg);
    const funnel_id = scored.funnel_id || path.basename(inputPath, '.json');

    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${funnel_id}-scored.json`);
    fs.writeFileSync(outFile, JSON.stringify(scored, null, 2));

    const laneStr = scored.validation_lane.join('+');
    const aScore = scored.validation_strength['A'];
    const bScore = scored.validation_strength['B'];
    const aSummary = aScore
      ? `A: ${aScore.max_run_duration_days}d × ${aScore.impression_bucket_multiplier} × ${aScore.variant_count}v = ${aScore.composite_rank_score} [floor=${aScore.meets_anti_fluke_floor}]`
      : '';
    const bSummary = bScore
      ? `B: raised=${bScore.amount_raised} backers=${bScore.backer_count} funded=${bScore.funded_vs_failed} delivered=${bScore.delivered_vs_not}`
      : '';

    console.log(`[funnel-score] ${funnel_id}: lane=${laneStr} | ${[aSummary, bSummary].filter(Boolean).join(' | ')}`);
    console.log(`[funnel-score] output: ${outFile}`);
  } catch (e) {
    console.error(`[funnel-score] ERROR: ${e.message}`);
    process.exit(1);
  }
}
