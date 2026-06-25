#!/usr/bin/env node
// validate-asset-record.js — orchestrator-run validator for asset classification records.
// Structural twin of validate-analyzer.js (same contract, same violations-accumulate-then-dump idiom).
//
// Reject rules:
//   1. CLOSED-VOCAB — CLAIM: demonstrates[].claim must be in the run's claim list (loaded from --claim-list).
//   2. CLOSED-VOCAB — SHOT_TYPE: shot_type must be in SHOT_TYPE_ENUM (images only; videos have no shot_type).
//   3. CLOSED-VOCAB — DISQUALIFIERS: every disqualifiers[] value must be in DISQUALIFIER_ENUM.
//   4. CLOSED-VOCAB — STRENGTH: demonstrates[].strength must be in STRENGTH_ENUM.
//   5. GROUNDING GATE: each demonstrates[] entry must have a non-empty evidence (image) OR motion_value (video)
//      AND a strength. Missing → REJECT. (Script-enforceable half of "tag only what's in the pixels".)
//   6. DISPLAY_STATE: if present, must be in DISPLAY_STATE_ENUM.
//   7. VIDEO CHECKS: if record has segments / best_use / eligible_slots, treat as video record:
//      - demonstrates[].at (timestamp) must be present
//      - best_use ∈ BEST_USE_ENUM
//      - loop_safe and needs_audio must be booleans
//
// INVOCATION: orchestrator-run on each returned record before persist.
//   Hooks don't fire inside subagents — the SKILL.md orchestrator runs this as a step.
//   (Form of a PostToolUse hook; invocation is an orchestrator step.)
//
// Usage: node tools/hooks/validate-asset-record.js <record.json> [--claim-list=<CLAIM-LIST.json>]
// Exit 0 = pass (silent). Exit 2 + stderr = REJECT.
'use strict';

const fs   = require('fs');
const path = require('path');

if (process.argv.includes('--help')) {
  console.log([
    'Usage: node tools/hooks/validate-asset-record.js <record.json> [--claim-list=<CLAIM-LIST.json>]',
    '',
    'Validates an asset classification record against closed enums + the run\'s claim list.',
    'The record may be a single object OR { "records": [...] } — both are handled.',
    '',
    'Reject rules:',
    '  1. CLOSED-VOCAB CLAIM — demonstrates[].claim must be in the --claim-list ids.',
    '  2. CLOSED-VOCAB SHOT_TYPE — shot_type must be one of the SHOT_TYPE_ENUM values (images only).',
    '  3. CLOSED-VOCAB DISQUALIFIERS — every disqualifiers[] value must be in DISQUALIFIER_ENUM.',
    '  4. CLOSED-VOCAB STRENGTH — demonstrates[].strength must be in STRENGTH_ENUM.',
    '  5. GROUNDING GATE — each demonstrates[] entry must have evidence (image) or motion_value (video) + strength.',
    '  6. DISPLAY_STATE — if present, must be off | on_glow | on_legible.',
    '  7. VIDEO — if record has segments/best_use/eligible_slots: at present per demonstrates[], best_use on-enum,',
    '     loop_safe + needs_audio are booleans.',
    '',
    'Default claim list: runs/arduview/asset-classify/CLAIM-LIST.json',
    'Exit 0 = pass (silent). Exit 2 + stderr = REJECT messages.',
  ].join('\n'));
  process.exit(0);
}

// --- Closed enum definitions (verbatim from spec prompts/_specs/image-classifier-brick.md) ---
// Closed enums imported from the single source of truth (H0 contract extraction).
// require() resolves relative to this module (cwd-independent). STRENGTH_ENUM is
// namespaced ASSET_STRENGTH in enums.json to avoid a cross-contract collision.
const ENUMS = require('../contracts/enums.json').enums;
const SHOT_TYPE_ENUM = new Set(ENUMS.SHOT_TYPE.values);
const DISQUALIFIER_ENUM = new Set(ENUMS.DISQUALIFIER.values);
const STRENGTH_ENUM     = new Set(ENUMS.ASSET_STRENGTH.values);
const BEST_USE_ENUM     = new Set(ENUMS.BEST_USE.values);
const DISPLAY_STATE_ENUM = new Set(ENUMS.DISPLAY_STATE.values);

// --- Parse args ---
const args = process.argv.slice(2);
const positional = args.filter(a => !a.startsWith('--'));
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v !== undefined ? v : true];
  })
);

const filePath = positional[0];
if (!filePath) {
  console.error('REJECT: missing argument — provide path to asset record JSON');
  process.exit(2);
}

// --- Read + parse record ---
let raw;
try {
  raw = fs.readFileSync(filePath, 'utf8');
} catch (err) {
  console.error(`REJECT: cannot read "${filePath}" — ${err.message}`);
  process.exit(2);
}

let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error(`REJECT: invalid JSON in "${filePath}" — ${err.message}`);
  process.exit(2);
}

// --- Normalize to array of records ---
// Accepts: single record object OR { records: [...] }
const records = Array.isArray(data.records) ? data.records : [data];

// --- Load claim list from --claim-list= (default path) ---
const claimListPath = opts['claim-list'] ||
  path.join(process.cwd(), 'runs', 'arduview', 'asset-classify', 'CLAIM-LIST.json');

let claimIdSet;
try {
  const claimRaw = fs.readFileSync(claimListPath, 'utf8');
  const claimData = JSON.parse(claimRaw);
  if (!Array.isArray(claimData.claims)) {
    console.error(`REJECT: claim list at "${claimListPath}" is missing "claims" array`);
    process.exit(2);
  }
  claimIdSet = new Set(claimData.claims.map(c => c.id));
} catch (err) {
  console.error(`REJECT: cannot load claim list from "${claimListPath}" — ${err.message}`);
  process.exit(2);
}

// --- Accumulate violations (never throw) ---
const violations = [];

for (let ri = 0; ri < records.length; ri++) {
  const rec    = records[ri];
  const rLabel = `records[${ri}]` + (rec.id ? ` (id: ${rec.id})` : '');

  // Detect video record: has segments OR best_use OR eligible_slots
  const isVideo = (
    (rec.segments !== undefined && rec.segments !== null) ||
    (rec.best_use !== undefined && rec.best_use !== null) ||
    (rec.eligible_slots !== undefined && rec.eligible_slots !== null)
  );

  // --- Rule 2: shot_type ∈ SHOT_TYPE_ENUM (images only — videos don't have shot_type) ---
  if (!isVideo) {
    if (rec.shot_type !== undefined && rec.shot_type !== null) {
      if (!SHOT_TYPE_ENUM.has(rec.shot_type)) {
        violations.push(
          `REJECT: ${rLabel} shot_type="${rec.shot_type}" is off-enum — must be one of: ${[...SHOT_TYPE_ENUM].join(' | ')}`
        );
      }
    }
  }

  // --- Rule 3: disqualifiers[] ⊆ DISQUALIFIER_ENUM ---
  if (Array.isArray(rec.disqualifiers)) {
    for (let di = 0; di < rec.disqualifiers.length; di++) {
      const dq = rec.disqualifiers[di];
      if (typeof dq !== 'string' || dq.trim() === '') continue;
      if (!DISQUALIFIER_ENUM.has(dq)) {
        violations.push(
          `REJECT: ${rLabel} disqualifiers[${di}]="${dq}" is off-enum — must be one of: ${[...DISQUALIFIER_ENUM].join(' | ')}`
        );
      }
    }
  }

  // --- Rule 6: display_state ∈ DISPLAY_STATE_ENUM (if present) ---
  if (rec.display_state !== undefined && rec.display_state !== null) {
    if (!DISPLAY_STATE_ENUM.has(rec.display_state)) {
      violations.push(
        `REJECT: ${rLabel} display_state="${rec.display_state}" is off-enum — must be one of: ${[...DISPLAY_STATE_ENUM].join(' | ')}`
      );
    }
  }

  // --- Rules 1, 4, 5: demonstrates[] per-entry checks ---
  if (!Array.isArray(rec.demonstrates)) {
    // No demonstrates array — not a hard reject (relevance-bucket records don't have it)
    // Only reject if the record claims to be a classified product shot (has shot_type or best_use)
    if (rec.shot_type || rec.best_use) {
      violations.push(
        `REJECT: ${rLabel} is a classified record (has shot_type/best_use) but missing "demonstrates" array`
      );
    }
  } else {
    for (let di = 0; di < rec.demonstrates.length; di++) {
      const entry      = rec.demonstrates[di];
      const dLabel     = `${rLabel} demonstrates[${di}]`;

      if (!entry || typeof entry !== 'object') {
        violations.push(`REJECT: ${dLabel} is not an object`);
        continue;
      }

      // Rule 1: claim ∈ claim list
      if (!entry.claim || typeof entry.claim !== 'string' || entry.claim.trim() === '') {
        violations.push(`REJECT: ${dLabel} missing "claim" field`);
      } else if (!claimIdSet.has(entry.claim)) {
        violations.push(
          `REJECT: ${dLabel} claim="${entry.claim}" is not in the claim list (off-vocab) — valid ids: ${[...claimIdSet].join(' | ')}`
        );
      }

      // Rule 4: strength ∈ STRENGTH_ENUM
      if (!entry.strength || typeof entry.strength !== 'string' || entry.strength.trim() === '') {
        violations.push(`REJECT: ${dLabel} missing "strength" — must be one of: ${[...STRENGTH_ENUM].join(' | ')}`);
      } else if (!STRENGTH_ENUM.has(entry.strength)) {
        violations.push(
          `REJECT: ${dLabel} strength="${entry.strength}" is off-enum — must be one of: ${[...STRENGTH_ENUM].join(' | ')}`
        );
      }

      // Rule 5: grounding gate
      // Image record: must have non-empty evidence
      // Video record: must have non-empty motion_value OR evidence
      if (isVideo) {
        const hasGrounding = (
          (typeof entry.motion_value === 'string' && entry.motion_value.trim() !== '') ||
          (typeof entry.evidence === 'string' && entry.evidence.trim() !== '')
        );
        if (!hasGrounding) {
          violations.push(
            `REJECT: ${dLabel} is missing "motion_value" (video grounding) — agent must cite what the motion proves; cannot tag claims without pixel/motion evidence`
          );
        }
        // Video: at (timestamp) must be present
        if (!entry.at || typeof entry.at !== 'string' || entry.at.trim() === '') {
          violations.push(
            `REJECT: ${dLabel} is missing "at" timestamp — video demonstrates[] entries must include the timestamp where the claim is proven`
          );
        }
      } else {
        // Image: evidence must be present and non-empty
        if (!entry.evidence || typeof entry.evidence !== 'string' || entry.evidence.trim() === '') {
          violations.push(
            `REJECT: ${dLabel} is missing "evidence" (grounding gate) — agent must cite pixel evidence for every claim; cannot tag claims without observed evidence`
          );
        }
      }
    }
  }

  // --- Rule 7: video-specific field checks ---
  if (isVideo) {
    // best_use ∈ BEST_USE_ENUM
    if (rec.best_use !== undefined && rec.best_use !== null) {
      if (!BEST_USE_ENUM.has(rec.best_use)) {
        violations.push(
          `REJECT: ${rLabel} best_use="${rec.best_use}" is off-enum — must be one of: ${[...BEST_USE_ENUM].join(' | ')}`
        );
      }
    } else {
      violations.push(`REJECT: ${rLabel} is a video record (has segments/eligible_slots) but missing "best_use"`);
    }

    // loop_safe must be boolean
    if (rec.loop_safe !== undefined && rec.loop_safe !== null) {
      if (typeof rec.loop_safe !== 'boolean') {
        violations.push(`REJECT: ${rLabel} loop_safe="${rec.loop_safe}" must be a boolean (true | false)`);
      }
    } else {
      violations.push(`REJECT: ${rLabel} is a video record but missing "loop_safe" boolean`);
    }

    // needs_audio must be boolean
    if (rec.needs_audio !== undefined && rec.needs_audio !== null) {
      if (typeof rec.needs_audio !== 'boolean') {
        violations.push(`REJECT: ${rLabel} needs_audio="${rec.needs_audio}" must be a boolean (true | false)`);
      }
    } else {
      violations.push(`REJECT: ${rLabel} is a video record but missing "needs_audio" boolean`);
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
