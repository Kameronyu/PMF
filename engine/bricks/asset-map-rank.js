'use strict';
// asset-map-rank.js — brick 5 (map + rank + gap_list)
//
// Routes each record's demonstrates[].claim to eligible LP sections via section-table.json,
// ranks candidates per section by strength × technical fit, and emits a gap_list of sections
// with no strong+clean asset.
//
// Security (T-16-05-01): sanitizes --space and any id used in the write path using
// sanitizePathSegment (only [a-z0-9._-] allowed).
//
// Usage:
//   node tools/asset-map-rank.js --space=<slug> [--records-dir=<dir>] [--section-list=<path>]
//   node tools/asset-map-rank.js --help

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);

if (opts.help || args.length === 0) {
  console.log(`
asset-map-rank.js — brick 5: route claims to sections, rank candidates, emit gap_list

Usage:
  node tools/asset-map-rank.js --space=<slug> [options]

Options:
  --space=<str>           Market/product space slug (e.g. arduview). REQUIRED.
  --records-dir=<path>    Dir of per-asset JSON records (default: runs/<space>/asset-classify/records/).
  --section-list=<path>   Override section list (default: tools/asset/section-list.default.json).
  --out=<path>            Override output dir (default: runs/<space>/asset-classify/).
  --help                  Show this help.

Output:
  runs/<space>/asset-classify/ranked.json
    { sections: { <section>: [{id, role, claim, strength, min_safe_use, disqualifiers, dup_of}...] },
      gap_list: [{section, reason}...],
      _provenance }
  Also stamps eligible_sections / eligible_slots back onto each source record file.
`);
  process.exit(0);
}

if (!opts.space) {
  console.error('ERROR: --space=<slug> is required');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Path sanitizer (T-16-05-01)
// ---------------------------------------------------------------------------
function sanitizePathSegment(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');
}

const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) {
  console.error('ERROR: --space sanitized to empty; use [a-z0-9._-]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const CWD         = process.cwd();
const OUT_DIR     = opts.out
  ? path.resolve(opts.out)
  : path.join(CWD, 'runs', SPACE, 'asset-classify');
const RECORDS_DIR = opts['records-dir']
  ? path.resolve(opts['records-dir'])
  : path.join(OUT_DIR, 'records');
// Post-reorg: the section config ships alongside the brick at engine/bricks/asset/,
// not the pre-reorg CWD-relative tools/asset/. Resolve relative to __dirname so it works
// regardless of the process CWD. (--section-list still overrides.)
const SECTION_LIST_PATH = opts['section-list']
  ? path.resolve(opts['section-list'])
  : path.resolve(__dirname, 'asset', 'section-list.default.json');
const SECTION_TABLE_PATH = path.resolve(__dirname, 'asset', 'section-table.json');
const RANKED_OUT = path.join(OUT_DIR, 'ranked.json');

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function collectJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter(f => f.endsWith('.json') && !f.startsWith('_'))
    .map(f => path.join(dir, f));
}

// Strength rank (higher = better)
const STRENGTH_RANK = { strong: 3, partial: 2, incidental: 1 };

// min_safe_use rank (higher = better resolution fit for hero slots)
const MIN_SAFE_USE_RANK = { hero: 3, section: 2, thumb: 1 };

function strengthScore(strength) {
  return STRENGTH_RANK[strength] || 0;
}

function minSafeUseScore(record) {
  const minUse = (record.technical && record.technical.min_safe_use) || 'thumb';
  return MIN_SAFE_USE_RANK[minUse] || 0;
}

function isClean(record) {
  return Array.isArray(record.disqualifiers) && record.disqualifiers.length === 0;
}

function isDeduped(record) {
  return !!record.dup_of;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(function main() {
  const logLines = [];
  const ts = new Date().toISOString();

  // Load routing table
  let sectionTable;
  try {
    sectionTable = loadJson(SECTION_TABLE_PATH);
  } catch (e) {
    console.error(`ERROR: failed to load section-table.json: ${e.message}`);
    process.exit(1);
  }

  // Load section list
  let sectionListData;
  try {
    sectionListData = loadJson(SECTION_LIST_PATH);
  } catch (e) {
    console.error(`ERROR: failed to load section list at ${SECTION_LIST_PATH}: ${e.message}`);
    process.exit(1);
  }
  const imageSections = Array.isArray(sectionListData.sections) ? sectionListData.sections : [];
  const videoSlots    = Array.isArray(sectionListData.video_slots) ? sectionListData.video_slots : [];

  // Collect records
  const recordFiles = collectJsonFiles(RECORDS_DIR);
  if (recordFiles.length === 0) {
    logLines.push(`[WARN] no records found in ${RECORDS_DIR} — writing empty ranked.json`);
  }

  const records = [];
  for (const f of recordFiles) {
    try {
      const rec = loadJson(f);
      rec._source_path = f;  // track for write-back
      records.push(rec);
    } catch (e) {
      logLines.push(`[ERROR] failed to load ${f}: ${e.message}`);
    }
  }

  // -------------------------------------------------------------------------
  // Route each record's demonstrates[] to sections
  // -------------------------------------------------------------------------
  // sections map: section -> [{id, role, claim, strength, min_safe_use, disqualifiers, dup_of, _record}]
  const sectionsMap = {};
  const allSections = [...imageSections, ...videoSlots];
  for (const s of allSections) sectionsMap[s] = [];

  for (const rec of records) {
    if (!Array.isArray(rec.demonstrates)) continue;

    const isVideo = !!(rec.eligible_slots !== undefined || rec.best_use || (rec.probe && rec.probe.duration_s));
    const derivedSections = new Set();
    const derivedSlots    = new Set();

    for (const demo of rec.demonstrates) {
      const claim    = demo.claim;
      const strength = demo.strength;
      const tableEntry = sectionTable[claim];
      if (!tableEntry) continue;

      const primary = Array.isArray(tableEntry.primary) ? tableEntry.primary : [];
      const also    = Array.isArray(tableEntry.also)    ? tableEntry.also    : [];

      // Honor the requires.display_state conditional
      const requiresDisplayState = tableEntry.requires && tableEntry.requires.display_state;

      const routePrimary = !requiresDisplayState || (rec.display_state === requiresDisplayState);
      const routeAlso    = !requiresDisplayState || true; // 'also' sections get the record even if conditional fails

      if (isVideo) {
        // Video records route to video_slots
        const allCandidates = [...primary, ...also];
        for (const slot of allCandidates) {
          if (videoSlots.includes(slot)) {
            derivedSlots.add(slot);
            if (!sectionsMap[slot]) sectionsMap[slot] = [];
            sectionsMap[slot].push({
              id: rec.id,
              role: primary.includes(slot) && routePrimary ? 'primary' : 'also',
              claim,
              strength,
              min_safe_use: (rec.probe && rec.probe.w >= 1080) ? 'hero' : 'section',
              disqualifiers: rec.disqualifiers || [],
              dup_of: rec.dup_of || null,
              _record: rec,
            });
          } else if (imageSections.includes(slot)) {
            derivedSections.add(slot);
          }
        }
      } else {
        // Image records route to image sections
        if (routePrimary) {
          for (const s of primary) {
            derivedSections.add(s);
            if (!sectionsMap[s]) sectionsMap[s] = [];
            sectionsMap[s].push({
              id: rec.id,
              role: 'primary',
              claim,
              strength,
              min_safe_use: (rec.technical && rec.technical.min_safe_use) || 'thumb',
              disqualifiers: rec.disqualifiers || [],
              dup_of: rec.dup_of || null,
              _record: rec,
            });
          }
        }
        for (const s of also) {
          derivedSections.add(s);
          if (!sectionsMap[s]) sectionsMap[s] = [];
          sectionsMap[s].push({
            id: rec.id,
            role: 'also',
            claim,
            strength,
            min_safe_use: (rec.technical && rec.technical.min_safe_use) || 'thumb',
            disqualifiers: rec.disqualifiers || [],
            dup_of: rec.dup_of || null,
            _record: rec,
          });
        }
      }
    }

    // Stamp eligible_sections / eligible_slots back onto the record
    if (isVideo) {
      rec.eligible_slots = [...derivedSlots];
    } else {
      rec.eligible_sections = [...derivedSections];
    }
  }

  // -------------------------------------------------------------------------
  // Rank each section's candidates
  // -------------------------------------------------------------------------
  // Sort order: strong > partial > incidental, then hero > section > thumb
  // Deduped records (dup_of set) are excluded from primary-pick ranking
  // Records with non-empty disqualifiers are downgraded (sorted after clean records)
  for (const section of Object.keys(sectionsMap)) {
    sectionsMap[section].sort((a, b) => {
      // Deduped records last
      if (isDeduped(a._record) !== isDeduped(b._record)) return isDeduped(a._record) ? 1 : -1;
      // Clean records before disqualified
      const aClean = a.disqualifiers.length === 0;
      const bClean = b.disqualifiers.length === 0;
      if (aClean !== bClean) return aClean ? -1 : 1;
      // Sort by strength
      const strengthDiff = strengthScore(b.strength) - strengthScore(a.strength);
      if (strengthDiff !== 0) return strengthDiff;
      // Sort by min_safe_use
      return minSafeUseScore(b._record) - minSafeUseScore(a._record);
    });

    // Remove the _record ref (don't serialize full records into ranked.json)
    sectionsMap[section] = sectionsMap[section].map(({ _record, ...rest }) => rest);
  }

  // -------------------------------------------------------------------------
  // Emit gap_list
  // -------------------------------------------------------------------------
  // A section is in the gap_list if NO candidate is strong AND clean (disqualifiers:[] AND dup_of:null)
  const gap_list = [];
  for (const section of allSections) {
    const candidates = sectionsMap[section] || [];
    const hasStrongClean = candidates.some(
      c => c.strength === 'strong' && c.disqualifiers.length === 0 && c.dup_of === null
    );
    if (!hasStrongClean) {
      gap_list.push({
        section,
        candidate_count: candidates.length,
        reason: candidates.length === 0
          ? 'no candidates routed here'
          : 'no strong+clean asset — reshoot or source',
      });
    }
  }

  // -------------------------------------------------------------------------
  // Write back eligible_sections / eligible_slots onto source record files
  // -------------------------------------------------------------------------
  let writeOk = 0;
  let writeErr = 0;
  for (const rec of records) {
    const srcPath = rec._source_path;
    if (!srcPath) continue;
    try {
      const copy = { ...rec };
      delete copy._source_path;
      fs.writeFileSync(srcPath, JSON.stringify(copy, null, 2));
      writeOk++;
    } catch (e) {
      logLines.push(`[ERROR] failed to write back ${srcPath}: ${e.message}`);
      writeErr++;
    }
  }

  // -------------------------------------------------------------------------
  // Write ranked.json
  // -------------------------------------------------------------------------
  const output = {
    sections: sectionsMap,
    gap_list,
    _provenance: {
      source:        'asset-map-rank.js',
      space:         SPACE,
      records_dir:   RECORDS_DIR,
      section_table: SECTION_TABLE_PATH,
      section_list:  SECTION_LIST_PATH,
      record_count:  records.length,
      generated_at:  ts,
    },
  };

  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(RANKED_OUT, JSON.stringify(output, null, 2));
  logLines.push(`[WRITTEN] ${RANKED_OUT}`);

  // -------------------------------------------------------------------------
  // Sidecar log + summary
  // -------------------------------------------------------------------------
  const summary = `asset-map-rank: ${records.length} records, ${Object.keys(sectionsMap).length} sections, ${gap_list.length} gaps, writebacks=${writeOk}/${writeOk + writeErr}, space=${SPACE}`;
  logLines.unshift(`[${ts}] ${summary}`);
  fs.writeFileSync(path.join(OUT_DIR, '_asset-map-rank-log.txt'), logLines.join('\n') + '\n');

  console.log(summary);
  if (writeErr > 0) {
    console.error(`  WARN: ${writeErr} record write-back(s) failed`);
  }
})();
