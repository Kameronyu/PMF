#!/usr/bin/env node
// validate-analyzer.js — PostToolUse validate-on-Write hook for the Section Analyzer output.
// Structural copy of validate-dumper.js (same contract, same violations-accumulate-then-dump idiom).
//
// Reject rules (from spec §5/§6b/§7/§8/§9, D-12/D-13/D-14/D-15):
//   1. VERBATIM-SUBSTRING GATE: any verbatim_refs[].text not a verbatim substring of the cleaned
//      funnel copy → REJECT (kills hallucinated/paraphrased verbatim, T-03-11).
//   2. OVERFLOW-BELIEF RULE: belief_id outside the 9-anchor set with belief_confidence != 'low'
//      → REJECT (overflow beliefs must be flagged low for operator review, §7).
//   3. CLOSED-VOCAB REJECT: execution_type / proof_tier / claim_type / move off the closed enums
//      pinned in funnel-deep-pass.md → REJECT (same shape as validate-classifier claim_type reject, D-15).
//   4. POSITION RULE: position values not a funnel-level ordinal — duplicates within a funnel or
//      page-local non-ordinal values → REJECT (§5/D-12, known failure point).
//   5. SINGLE-FUNNEL DISCIPLINE: any birdseye-only field (consensus / divergence / unusual /
//      pool reasoning) present on a belief record → REJECT (§8).
//
// Usage: node tools/hooks/validate-analyzer.js <path-to-output.json>
// Exit 0 = pass (silent). Exit 2 + stderr = reject.
'use strict';

const fs   = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log([
    'Usage: node tools/hooks/validate-analyzer.js <path-to-output.json>',
    '',
    'Validates Section Analyzer output (belief-instance records) against the schema',
    'defined in prompts/funnel-deep-pass.md.',
    '',
    'Reject rules:',
    '  1. VERBATIM-SUBSTRING GATE — verbatim_refs[].text must be a verbatim substring',
    '     of the funnel\'s cleaned body (kills hallucinated/paraphrased verbatim).',
    '  2. OVERFLOW-BELIEF — belief_id outside the 9-anchor set must have belief_confidence=low.',
    '  3. CLOSED-VOCAB — execution_type / proof_tier / claim_type / move must be on-enum.',
    '  4. POSITION — position values must be unique funnel-level ordinals (no duplicates,',
    '     no page-local non-integers).',
    '  5. SINGLE-FUNNEL DISCIPLINE — birdseye-only fields (consensus/divergence/unusual)',
    '     must not appear on belief records.',
    '',
    'Exit 0 = pass (silent). Exit 2 + stderr = REJECT messages.',
  ].join('\n'));
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('REJECT: missing argument — provide path to analyzer output JSON');
  process.exit(2);
}

// --- Read + parse ---
let raw;
try {
  raw = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`REJECT: cannot read file "${filePath}" — ${err.message}`);
  process.exit(2);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`REJECT: invalid JSON in "${filePath}" — ${err.message}`);
  process.exit(2);
}

// --- Closed enum definitions (from funnel-deep-pass.md) ---
const CLAIM_TYPE_ENUM = new Set(['direct', 'enlarged', 'mechanism', 'enhanced']);

const EXECUTION_TYPE_ENUM = new Set([
  'mechanism-explanation',
  'feature-as-evidence',
  'demo',
  'authority',
  'social-proof',
  'founder-credibility',
  'risk-reversal',
  'scarcity',
  'urgency',
  'exclusivity',
  'story-epiphany',
  'comparison',
  'consequence-of-inaction',
]);

const PROOF_TIER_ENUM = new Set(['Tier1', 'Tier2', 'Tier3']);

const MOVE_ENUM = new Set([
  'market-avatar-flip',
  'market-transformation-change',
  'um-mechanism-reveal',
  'um-problem-framing',
  'um-proprietary-naming',
  'angle-desire',
  'angle-pain',
  'angle-external-blame',
  'angle-care-signaling',
  'angle-identity-belonging',
  'angle-curiosity-secret',
  'offer-bundle',
  'offer-guarantee',
  'offer-urgency-scarcity',
  'offer-price-anchor',
]);

// 9-anchor belief_id set (open-with-anchors — overflow allowed but must have belief_confidence=low)
const BELIEF_ANCHOR_SET = new Set([
  'problem-exists',
  'problem-matters',
  'past-solutions-failed',
  'mechanism-is-the-reason',
  'product-delivers-transformation',
  'trust-the-brand-or-founder',
  'it-will-ship',
  'its-worth-the-price',
  'act-now',
]);

// belief_kind closed vocab (D1 per Phase 15) — crowdfunding-specific vs general-DR
const BELIEF_KIND_ENUM = new Set(['crowdfunding-specific', 'general-dr']);

// Birdseye-only fields that must NOT appear on belief records (§8 single-funnel discipline)
const BIRDSEYE_ONLY_FIELDS = ['consensus', 'divergence', 'unusual', 'pool', 'pool_reasoning', 'pool-reasoning'];

// ---  Verbatim corpus loading ---
// Locate the cleaned funnel body for verbatim-substring verification.
// Convention: the funnel output JSON is expected to carry funnel_id; the cleaned body
// lives at corpus/<funnel_id>/_funnel-clean.json or corpus/<funnel_id>/clean.txt or similar.
// Fallback search strategy mirrors validate-dumper.js findCleanDir: walk up from the
// output file's directory, try multiple plausible locations.

// WR-02: The Section Analyzer is instructed to quote verbatim from the CLEANED body
// (HTML stripped, entities decoded). The verbatim gate must therefore compare against
// the same cleaned text. Never compare against raw landing_page_body — entity-encoded
// HTML will cause false-rejects for any substring that contains decoded characters
// (e.g. "&" from "&amp;", "'" from "&#39;"). If only raw HTML is available, apply
// the same stripToText transform that funnel-clean.js uses before verifying.

// Minimal entity-decode + tag-strip mirror of funnel-clean.js stripToText.
// Kept inline so this hook has no runtime dependency on funnel-clean.js.
function stripToTextForVerify(html) {
  let s = html.slice(0, 2_000_000);
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  s = s.replace(/<header[\s\S]*?<\/header>/gi, '');
  s = s.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  s = s.replace(/<[^>]{0,500}>/g, ' ');
  s = s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');
  s = s.replace(/[ \t]+$/gm, '');
  s = s.replace(/\n{4,}/g, '\n\n\n');
  return s.trim();
}

function findCleanedBody(funnel_id, outputDir) {
  if (!funnel_id) return null;

  const candidates = [
    // runs/<space>/funnels/<funnel_id>-clean.txt  (sidecar convention)
    path.join(outputDir, `${funnel_id}-clean.txt`),
    // sibling clean file
    path.join(outputDir, '..', `${funnel_id}-clean.txt`),
    // corpus/<funnel_id>/clean.txt (if stored under corpus)
    path.join(process.cwd(), 'corpus', funnel_id, 'clean.txt'),
    path.join(process.cwd(), 'corpus', funnel_id, 'cleaned_body.txt'),
    // runs/ tree
    path.join(process.cwd(), 'runs', funnel_id, 'clean.txt'),
  ];

  for (const c of candidates) {
    if (fs.existsSync(c)) {
      try {
        return fs.readFileSync(c, 'utf8');
      } catch (_) {
        // non-fatal; try next
      }
    }
  }

  // Also try loading from a funnel_package JSON (cleaned_body or landing_page_body field).
  // WR-05: include the funnel-clean.js default output path funnels-clean/<funnel_id>-clean.json.
  // WR-02: ONLY use pkg.cleaned_body (already decoded/stripped) as the comparison corpus.
  //        If only landing_page_body (raw HTML) is present, run it through stripToTextForVerify
  //        so entity-decoded characters in verbatim quotes are not wrongly rejected.
  const packageCandidates = [
    // funnel-clean.js default output (WR-05: was missing from candidates)
    path.join(outputDir, '..', 'funnels-clean', `${funnel_id}-clean.json`),
    path.join(process.cwd(), 'funnels-clean', `${funnel_id}-clean.json`),
    path.join(outputDir, `${funnel_id}.json`),
    path.join(outputDir, '..', `${funnel_id}.json`),
    path.join(process.cwd(), 'runs', funnel_id + '.json'),
  ];
  for (const c of packageCandidates) {
    if (fs.existsSync(c)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(c, 'utf8'));
        // Prefer cleaned_body (already entity-decoded + tag-stripped by funnel-clean.js)
        if (pkg.cleaned_body) return pkg.cleaned_body;
        // Fall back to landing_page_body, but apply the same strip transform so the
        // comparison corpus matches what the analyzer was shown (WR-02).
        if (pkg.landing_page_body) return stripToTextForVerify(pkg.landing_page_body);
      } catch (_) {
        // non-fatal
      }
    }
  }

  return null;
}

// --- Extract belief_records from output ---
// The analyzer emits: { funnel_fields: {...}, belief_records: [...] }
// or may emit a flat array of records — handle both.
const funnel_id = data.funnel_fields ? data.funnel_fields.funnel_id : data.funnel_id;
const belief_records = Array.isArray(data.belief_records)
  ? data.belief_records
  : Array.isArray(data)
    ? data
    : null;

if (!belief_records) {
  console.error('REJECT: output missing "belief_records" array (expected { funnel_fields: {...}, belief_records: [...] })');
  process.exit(2);
}

// --- Load cleaned funnel body for verbatim gate ---
const outputDir   = path.dirname(path.resolve(filePath));
const cleanedBody = findCleanedBody(funnel_id, outputDir);
const cleanedBodyLoaded = cleanedBody !== null && cleanedBody.length > 0;

// WR-05: If the corpus cannot be found, fail immediately with a distinct config-error
// rather than accumulating per-ref REJECTs that look like content hallucinations.
// This keeps "corpus wiring problem" clearly separated from real verbatim failures.
if (!cleanedBodyLoaded) {
  const hasVerbatimRefs = Array.isArray(belief_records) && belief_records.some(
    r => Array.isArray(r.verbatim_refs) && r.verbatim_refs.some(
      v => v && typeof v.text === 'string' && v.text.trim() !== ''
    )
  );
  if (hasVerbatimRefs) {
    console.error(
      `CONFIG-ERROR: cleaned funnel body not found for funnel_id="${funnel_id}" — ` +
      `verbatim gate cannot run. Ensure funnel-clean.js has been run and its output ` +
      `(funnels-clean/${funnel_id}-clean.json) is accessible from the validator's working directory. ` +
      `Cannot distinguish corpus-wiring failure from real verbatim hallucinations — aborting.`
    );
    process.exit(2);
  }
}

// --- Accumulate violations ---
const violations = [];

// Track position values for funnel-level ordinal uniqueness check (Rule 4)
const positionsSeen = new Set();

for (let ri = 0; ri < belief_records.length; ri++) {
  const rec    = belief_records[ri];
  const rLabel = `belief_records[${ri}]` + (rec.funnel_id ? ` (funnel: ${rec.funnel_id})` : '');

  // --- Rule 5: Single-funnel discipline — no birdseye-only fields ---
  for (const bfField of BIRDSEYE_ONLY_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(rec, bfField)) {
      violations.push(
        `REJECT: ${rLabel} has birdseye-only field "${bfField}" — Section Analyzer must NOT set consensus/divergence/unusual/pool fields (§8 single-funnel discipline)`
      );
    }
  }

  // --- Rule 4: position — funnel-level ordinal uniqueness ---
  const pos = rec.position;
  if (pos === undefined || pos === null) {
    violations.push(`REJECT: ${rLabel} missing "position" field`);
  } else if (typeof pos !== 'number' || !Number.isInteger(pos) || pos < 1) {
    violations.push(
      `REJECT: ${rLabel} position="${pos}" is not a positive integer — position must be a funnel-level ordinal (1, 2, 3…), NOT a page section number`
    );
  } else if (positionsSeen.has(pos)) {
    violations.push(
      `REJECT: ${rLabel} duplicate position=${pos} within the funnel — position must be a unique funnel-level ordinal; each belief-instance gets a distinct ordinal`
    );
  } else {
    positionsSeen.add(pos);
  }

  // --- Rule 2: overflow-belief confidence ---
  const belief_id         = rec.belief_id;
  const belief_confidence = rec.belief_confidence;
  if (!belief_id || typeof belief_id !== 'string' || belief_id.trim() === '') {
    violations.push(`REJECT: ${rLabel} missing or empty "belief_id"`);
  } else if (!BELIEF_ANCHOR_SET.has(belief_id)) {
    // Overflow belief — belief_confidence MUST be 'low'
    if (belief_confidence !== 'low') {
      violations.push(
        `REJECT: ${rLabel} belief_id="${belief_id}" is not in the 9-anchor set but belief_confidence="${belief_confidence}" — overflow beliefs (outside the anchor set) must have belief_confidence="low" for operator review (§7/D-13)`
      );
    }
  }

  // --- Rule 2b: belief_kind closed vocab (D1 per Phase 15) ---
  if (rec.belief_kind === undefined || rec.belief_kind === null) {
    violations.push(`REJECT: ${rLabel} missing "belief_kind" — must be 'crowdfunding-specific' | 'general-dr'`);
  } else if (!BELIEF_KIND_ENUM.has(rec.belief_kind)) {
    violations.push(`REJECT: ${rLabel} belief_kind="${rec.belief_kind}" is off-enum — must be 'crowdfunding-specific' | 'general-dr'`);
  }

  // --- Rule 3: closed-vocab — execution_type ---
  const execution_type = rec.execution_type;
  if (!execution_type || typeof execution_type !== 'string' || execution_type.trim() === '') {
    violations.push(`REJECT: ${rLabel} missing or empty "execution_type"`);
  } else if (!EXECUTION_TYPE_ENUM.has(execution_type)) {
    violations.push(
      `REJECT: ${rLabel} execution_type="${execution_type}" is off-enum — must be one of: ${[...EXECUTION_TYPE_ENUM].join(' | ')}`
    );
  }

  // --- Rule 3: closed-vocab — proof_tier ---
  const proof_tier = rec.proof_tier;
  if (!proof_tier || typeof proof_tier !== 'string' || proof_tier.trim() === '') {
    violations.push(`REJECT: ${rLabel} missing or empty "proof_tier"`);
  } else if (!PROOF_TIER_ENUM.has(proof_tier)) {
    violations.push(
      `REJECT: ${rLabel} proof_tier="${proof_tier}" is off-enum — must be one of: ${[...PROOF_TIER_ENUM].join(' | ')}`
    );
  }

  // --- Rule 3: closed-vocab — claim_type (if present on record; optional per-record field) ---
  if (rec.claim_type !== undefined && rec.claim_type !== null) {
    if (!CLAIM_TYPE_ENUM.has(rec.claim_type)) {
      violations.push(
        `REJECT: ${rLabel} claim_type="${rec.claim_type}" is off-enum — must be one of: ${[...CLAIM_TYPE_ENUM].join(' | ')}`
      );
    }
  }

  // --- Rule 3: closed-vocab — moves[] ---
  if (Array.isArray(rec.moves)) {
    for (let mi = 0; mi < rec.moves.length; mi++) {
      const move = rec.moves[mi];
      if (typeof move !== 'string' || move.trim() === '') continue;
      if (!MOVE_ENUM.has(move)) {
        violations.push(
          `REJECT: ${rLabel} moves[${mi}]="${move}" is off-enum — must be one of: ${[...MOVE_ENUM].join(' | ')}`
        );
      }
    }
  }

  // --- Rule 1: verbatim-substring gate on verbatim_refs[] ---
  if (Array.isArray(rec.verbatim_refs)) {
    for (let vi = 0; vi < rec.verbatim_refs.length; vi++) {
      const ref = rec.verbatim_refs[vi];
      if (!ref || typeof ref !== 'object') continue;
      const text = ref.text;
      if (typeof text !== 'string' || text.trim() === '') continue;

      if (!cleanedBodyLoaded) {
        // Cannot verify — flag as a missing-corpus error (same behavior as validate-dumper)
        violations.push(
          `REJECT: ${rLabel} verbatim_refs[${vi}].text cannot be verified — cleaned funnel body not found ` +
          `(searched for funnel_id="${funnel_id}" sidecar files; ensure funnel-clean.js has run)`
        );
      } else {
        // Verbatim substring check — case-sensitive, must be an exact substring
        if (!cleanedBody.includes(text)) {
          const preview = text.length > 80 ? text.slice(0, 80) + '…' : text;
          violations.push(
            `REJECT: ${rLabel} verbatim_refs[${vi}].text is not a verbatim substring of the cleaned funnel body — ` +
            `"${preview}" (hallucinated or paraphrased verbatim; T-03-11)`
          );
        }
      }
    }
  }
}

// --- Funnel-level fields validation (if present) ---
if (data.funnel_fields) {
  const ff = data.funnel_fields;

  // claim_type at funnel level must be on-enum if set
  if (ff.claim_type !== undefined && ff.claim_type !== null) {
    if (!CLAIM_TYPE_ENUM.has(ff.claim_type)) {
      violations.push(
        `REJECT: funnel_fields.claim_type="${ff.claim_type}" is off-enum — must be one of: ${[...CLAIM_TYPE_ENUM].join(' | ')}`
      );
    }
  }

  // awareness_entry must be a known awareness-ladder value if set
  const AWARENESS_ENUM = new Set(['unaware', 'problem-aware', 'solution-aware', 'product-aware', 'offer-aware']);
  if (ff.awareness_entry !== undefined && ff.awareness_entry !== null) {
    if (!AWARENESS_ENUM.has(ff.awareness_entry)) {
      violations.push(
        `REJECT: funnel_fields.awareness_entry="${ff.awareness_entry}" is off-enum — must be one of: ${[...AWARENESS_ENUM].join(' | ')}`
      );
    }
  }
}

// --- Emit result ---
if (violations.length > 0) {
  for (const v of violations) {
    console.error(v);
  }
  process.exit(2);
}

// Pass — exit 0 silently
process.exit(0);
