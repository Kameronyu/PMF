#!/usr/bin/env node
// validate-revenue.js — PostToolUse hook for the REVENUE script's brands.json Write.
// Mirrors the never-fabricate logic from revenue-est.js (D-10).
// Reject rules:
//   1. Any brand with a non-null value_usd_monthly missing method or confidence.
//   2. method:"traffic_formula" when inputs.monthly_visits is null (must be review_proxy).
//   3. value_usd_monthly is the literal string "PENDING" (D-10 never-fabricate).
// Usage: node tools/hooks/validate-revenue.js <path-to-brands.json>
// Exit 0 = pass. Exit 2 + stderr = reject.
'use strict';

const fs = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log('Usage: node tools/hooks/validate-revenue.js <path-to-brands.json>');
  console.log('Validates revenue_est fields in brands.json against the never-fabricate rules.');
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('REJECT: missing argument — provide path to brands.json');
  process.exit(2);
}

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

const brands = data.brands;
if (!Array.isArray(brands)) {
  console.error('REJECT: brands.json missing "brands" array');
  process.exit(2);
}

const violations = [];

for (let i = 0; i < brands.length; i++) {
  const brand = brands[i];
  const label = brand.slug || brand.brand || `brands[${i}]`;
  const rev = brand.revenue_est;

  if (!rev) continue; // No revenue_est block — nothing to validate

  const value = rev.value_usd_monthly;

  // Rule 3: value_usd_monthly must not be the literal string "PENDING" (D-10 never-fabricate)
  if (value === 'PENDING') {
    violations.push(`REJECT: brand "${label}" revenue_est.value_usd_monthly is "PENDING" — never ship a fabricated placeholder as data (D-10); use null instead`);
  }

  // Only validate further if value_usd_monthly is populated (non-null, non-"PENDING")
  if (value !== null && value !== undefined && value !== 'PENDING') {
    // Rule 1: method and confidence must be present
    if (!rev.method || typeof rev.method !== 'string' || rev.method.trim() === '') {
      violations.push(`REJECT: brand "${label}" has non-null value_usd_monthly but missing "method" — every revenue estimate must carry method + confidence`);
    }
    if (!rev.confidence || typeof rev.confidence !== 'string' || rev.confidence.trim() === '') {
      violations.push(`REJECT: brand "${label}" has non-null value_usd_monthly but missing "confidence" — every revenue estimate must carry method + confidence`);
    }

    // Rule 2: method:"traffic_formula" requires inputs.monthly_visits to be non-null
    if (rev.method === 'traffic_formula') {
      const inputs = rev.inputs;
      if (!inputs || inputs.monthly_visits === null || inputs.monthly_visits === undefined) {
        violations.push(`REJECT: brand "${label}" method is "traffic_formula" but inputs.monthly_visits is null — use method:"review_proxy" when monthly_visits is unavailable`);
      }
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
