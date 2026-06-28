#!/usr/bin/env node
// validate-finder.js — PostToolUse hook for the FINDER agent's brands.json Write.
// Rejects off-enum channel/lane values and brand rows missing url or sells_observed.
// Usage: node tools/hooks/validate-finder.js <path-to-brands.json>
// Exit 0 = pass. Exit 2 + stderr = reject.
'use strict';

const fs = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log('Usage: node tools/hooks/validate-finder.js <path-to-brands.json>');
  console.log('Validates the Finder agent output against the brands.json schema.');
  process.exit(0);
}

const filePath = process.argv[2];
if (!filePath) {
  console.error('REJECT: missing argument — provide path to brands.json');
  process.exit(2);
}

// Closed enums imported from the single source of truth (H0 contract extraction).
// require() resolves relative to this module, so cwd does not matter.
const ENUMS = require('../contracts/enums.json').enums;
const CHANNEL_ENUM = new Set(ENUMS.CHANNEL.values);
const LANE_ENUM = new Set(ENUMS.LANE.values);

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
  const label = brand.slug || brand.brand || `index ${i}`;

  // Reject missing url
  if (!brand.url || typeof brand.url !== 'string' || brand.url.trim() === '') {
    violations.push(`REJECT: brand "${label}" missing or empty "url"`);
  }

  // Reject missing sells_observed
  if (!brand.sells_observed || typeof brand.sells_observed !== 'string' || brand.sells_observed.trim() === '') {
    violations.push(`REJECT: brand "${label}" missing or empty "sells_observed"`);
  }

  // Reject off-enum channel
  if (brand.channel !== undefined && brand.channel !== null) {
    if (!CHANNEL_ENUM.has(brand.channel)) {
      violations.push(`REJECT: brand "${label}" channel "${brand.channel}" off CHANNEL_ENUM (dtc|marketplace|crowdfunding)`);
    }
  }

  // Reject off-enum lane
  if (brand.lane !== undefined && brand.lane !== null) {
    if (!LANE_ENUM.has(brand.lane)) {
      violations.push(`REJECT: brand "${label}" lane "${brand.lane}" off LANE_ENUM (major|crowdfunding|marketplace)`);
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
