#!/usr/bin/env node
// validate-classifier.js — PostToolUse hook for the SPACE CLASSIFIER agent's space-map.json Write.
// Reject rules:
//   1. Any assigned canonical transformation/niche/angle has zero raw variants tracing to real dumps.
//   2. Saturation computed across cells (must be keyed per combo cell = transformation × niche).
//   3. Any claim_type off CLAIM_TYPE_ENUM (direct|enlarged|mechanism|enhanced).
//   4. A combo missing claim_count or enhanced_claim_count.
//   5. enhanced_claim_count > claim_count in any combo.
//   6. D-12: per_brand[] competitive_axis off COMPETITIVE_AXIS_ENUM.
//   7. D-12: missing or empty competitive_axis_basis when competitive_axis is set.
//   8. D-04: sophistication string is non-empty when combos exist for a brand.
// Usage: node tools/hooks/validate-classifier.js <path-to-space-map.json>
// Exit 0 = pass. Exit 2 + stderr = reject.
'use strict';

const fs = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log('Usage: node tools/hooks/validate-classifier.js <path-to-space-map.json>');
  console.log('Validates the Space Classifier output against the space-map.json schema.');
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('REJECT: missing argument — provide path to space-map.json');
  process.exit(2);
}

const CLAIM_TYPE_ENUM = new Set(['direct', 'enlarged', 'mechanism', 'enhanced']);
const COMPETITIVE_AXIS_ENUM = new Set(['function-capability-price', 'visual-statement', 'community-openness']);

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

const violations = [];

// --- Rule 1: canonical labels must have non-empty raw_variants / raw_claim_variants ---

const transformations = data.transformations || [];
for (let i = 0; i < transformations.length; i++) {
  const t = transformations[i];
  const label = t.canonical || `transformations[${i}]`;
  const variants = t.raw_claim_variants || t.raw_variants;
  if (!Array.isArray(variants) || variants.length === 0) {
    violations.push(`REJECT: transformation "${label}" has zero raw_claim_variants — canonical label must trace to real dump data`);
  }
}

const niches = data.niches || [];
for (let i = 0; i < niches.length; i++) {
  const n = niches[i];
  const label = n.canonical || `niches[${i}]`;
  const variants = n.raw_variants;
  if (!Array.isArray(variants) || variants.length === 0) {
    violations.push(`REJECT: niche "${label}" has zero raw_variants — canonical label must trace to real dump data`);
  }
}

const angles = data.angles || [];
for (let i = 0; i < angles.length; i++) {
  const a = angles[i];
  const label = a.canonical || `angles[${i}]`;
  const variants = a.raw_variants;
  if (!Array.isArray(variants) || variants.length === 0) {
    violations.push(`REJECT: angle "${label}" has zero raw_variants — canonical label must trace to real dump data`);
  }
}

// --- Rule 2: saturation entries must be per combo cell (must have both transformation AND niche) ---

const saturation = data.saturation || [];
for (let i = 0; i < saturation.length; i++) {
  const s = saturation[i];
  const hasTransformation = s.transformation !== undefined && s.transformation !== null && String(s.transformation).trim() !== '';
  const hasNiche = s.niche !== undefined && s.niche !== null && String(s.niche).trim() !== '';

  if (!hasTransformation || !hasNiche) {
    const detail = JSON.stringify({ transformation: s.transformation, niche: s.niche });
    violations.push(`REJECT: saturation[${i}] is NOT keyed per combo cell — must have both transformation AND niche (got ${detail}); saturation must never be pooled across cells`);
  }
}

// --- Rules 3–5: combo claim_type, claim counts ---

const combos = data.combos || [];
for (let i = 0; i < combos.length; i++) {
  const combo = combos[i];
  const label = `combo "${combo.transformation || '?'} × ${combo.niche || '?'}"`;

  // Rule 4: claim_count and enhanced_claim_count must be present
  if (combo.claim_count === undefined || combo.claim_count === null) {
    violations.push(`REJECT: ${label} missing "claim_count"`);
  }
  if (combo.enhanced_claim_count === undefined || combo.enhanced_claim_count === null) {
    violations.push(`REJECT: ${label} missing "enhanced_claim_count"`);
  }

  // Rule 5: enhanced_claim_count must not exceed claim_count
  if (
    typeof combo.claim_count === 'number' &&
    typeof combo.enhanced_claim_count === 'number' &&
    combo.enhanced_claim_count > combo.claim_count
  ) {
    violations.push(`REJECT: ${label} enhanced_claim_count (${combo.enhanced_claim_count}) > claim_count (${combo.claim_count})`);
  }

  // Rule 3: each claim in claims[] must have a valid claim_type
  const claims = combo.claims || [];
  for (let ci = 0; ci < claims.length; ci++) {
    const claim = claims[ci];
    if (claim.type === undefined || claim.type === null) {
      violations.push(`REJECT: ${label} claims[${ci}] missing "type"`);
    } else if (!CLAIM_TYPE_ENUM.has(claim.type)) {
      violations.push(`REJECT: ${label} claims[${ci}] type "${claim.type}" off CLAIM_TYPE_ENUM (direct|enlarged|mechanism|enhanced)`);
    }
  }
}

// --- Rules 6–8: per_brand competitive_axis and sophistication ---

const perBrand = data.per_brand || [];
for (let i = 0; i < perBrand.length; i++) {
  const brand = perBrand[i];
  const label = brand.slug || `per_brand[${i}]`;

  // Rule 6: competitive_axis off enum (D-12)
  if (brand.competitive_axis !== undefined && brand.competitive_axis !== null) {
    if (!COMPETITIVE_AXIS_ENUM.has(brand.competitive_axis)) {
      violations.push(`REJECT: brand "${label}" competitive_axis "${brand.competitive_axis}" off COMPETITIVE_AXIS_ENUM (function-capability-price|visual-statement|community-openness)`);
    }

    // Rule 7: competitive_axis_basis must be present and non-empty when competitive_axis is set (D-12)
    if (
      !brand.competitive_axis_basis ||
      typeof brand.competitive_axis_basis !== 'string' ||
      brand.competitive_axis_basis.trim() === ''
    ) {
      violations.push(`REJECT: brand "${label}" competitive_axis is set ("${brand.competitive_axis}") but competitive_axis_basis is missing or empty — axis call requires page-quoted evidence`);
    }
  }

  // Rule 8: D-04 sophistication backstop — non-empty when combos exist
  // Only require non-empty sophistication if this brand appears in any combo
  const brandInCombos = combos.some(c => Array.isArray(c.brands) && c.brands.includes(label));
  if (brandInCombos) {
    if (!brand.sophistication || typeof brand.sophistication !== 'string' || brand.sophistication.trim() === '') {
      violations.push(`REJECT: brand "${label}" has combo entries but "sophistication" is missing or empty — stage call must cite claim evidence`);
    }
  }
}

if (violations.length > 0) {
  for (const v of violations) {
    console.error(v);
  }
  process.exit(2);
}

// Pass — exit 0 silently
process.exit(0);
