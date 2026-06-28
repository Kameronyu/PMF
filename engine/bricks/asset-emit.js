'use strict';
// asset-emit.js — brick 7 (emit manifest)
//
// Writes:
//   runs/<space>/asset-classify/images.json   { records:[<image records>...], _provenance, gap_list:[...] }
//   runs/<space>/asset-classify/videos.json   { records:[<video records>...], _provenance, gap_list:[...] }
//   runs/<space>/asset-classify/IMAGES.md     launch-format: base-URL + per-section table + ## Gaps
//   runs/<space>/asset-classify/VIDEOS.md     launch-format: hashed-CDN warning + table + ## Poster frame
//
// Consumes: per-asset JSON records (with eligible_sections/eligible_slots stamped by asset-map-rank.js)
//           + ranked.json (from asset-map-rank.js) for section order + gap_list.
//
// Security (T-16-05-01): sanitizes --space before using it in write paths.
//
// Usage:
//   node tools/asset-emit.js --space=<slug> [--records-dir=<dir>] [--ranked=<path>]
//   node tools/asset-emit.js --help

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
asset-emit.js — brick 7: write images.json / videos.json + IMAGES.md / VIDEOS.md

Usage:
  node tools/asset-emit.js --space=<slug> [options]

Options:
  --space=<str>         Market/product space slug (e.g. arduview). REQUIRED.
  --records-dir=<path>  Dir of per-asset JSON records (default: runs/<space>/asset-classify/records/).
  --ranked=<path>       Path to ranked.json from asset-map-rank.js
                        (default: runs/<space>/asset-classify/ranked.json).
  --out=<path>          Override output dir (default: runs/<space>/asset-classify/).
  --help                Show this help.

Output:
  runs/<space>/asset-classify/images.json
  runs/<space>/asset-classify/videos.json
  runs/<space>/asset-classify/IMAGES.md
  runs/<space>/asset-classify/VIDEOS.md
  runs/<space>/asset-classify/_asset-emit-log.txt
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
const RANKED_PATH = opts.ranked
  ? path.resolve(opts.ranked)
  : path.join(OUT_DIR, 'ranked.json');

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

function isVideoRecord(rec) {
  // Video records carry probe{} or segments[] or best_use or eligible_slots
  return !!(rec.probe || rec.segments || rec.best_use || rec.eligible_slots);
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(function main() {
  const logLines = [];
  const ts       = new Date().toISOString();

  // Load ranked.json (may not exist if map-rank hasn't run yet)
  let ranked = null;
  if (fs.existsSync(RANKED_PATH)) {
    try {
      ranked = loadJson(RANKED_PATH);
    } catch (e) {
      logLines.push(`[WARN] failed to load ranked.json at ${RANKED_PATH}: ${e.message} — section order will be undefined`);
    }
  } else {
    logLines.push(`[WARN] ranked.json not found at ${RANKED_PATH} — gap_list will be empty, sections from records only`);
  }

  const gap_list  = ranked ? (ranked.gap_list || []) : [];
  const sectionsRanked = ranked ? (ranked.sections || {}) : {};

  // Collect records
  const recordFiles = collectJsonFiles(RECORDS_DIR);
  if (recordFiles.length === 0) {
    logLines.push(`[WARN] no records found in ${RECORDS_DIR}`);
  }

  const imageRecords = [];
  const videoRecords = [];

  for (const f of recordFiles) {
    try {
      const rec = loadJson(f);
      if (isVideoRecord(rec)) {
        videoRecords.push(rec);
      } else {
        imageRecords.push(rec);
      }
    } catch (e) {
      logLines.push(`[ERROR] failed to load ${f}: ${e.message}`);
    }
  }

  const provenance = {
    source:      'asset-emit.js',
    space:       SPACE,
    records_dir: RECORDS_DIR,
    ranked_path: RANKED_PATH,
    generated_at: ts,
  };

  // -------------------------------------------------------------------------
  // Write images.json (S3 shape)
  // -------------------------------------------------------------------------
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const imagesJson = {
    records:    imageRecords,
    _provenance: provenance,
    gap_list,
  };
  const imagesJsonPath = path.join(OUT_DIR, 'images.json');
  fs.writeFileSync(imagesJsonPath, JSON.stringify(imagesJson, null, 2));
  logLines.push(`[WRITTEN] ${imagesJsonPath} (${imageRecords.length} image records)`);

  // -------------------------------------------------------------------------
  // Write videos.json (S3 shape, video records carry extra fields)
  // -------------------------------------------------------------------------
  const videosJson = {
    records:    videoRecords,
    _provenance: provenance,
    gap_list: gap_list.filter(g => ['hero_loop', 'feature_demo'].includes(g.section)),
  };
  const videosJsonPath = path.join(OUT_DIR, 'videos.json');
  fs.writeFileSync(videosJsonPath, JSON.stringify(videosJson, null, 2));
  logLines.push(`[WRITTEN] ${videosJsonPath} (${videoRecords.length} video records)`);

  // -------------------------------------------------------------------------
  // IMAGES.md — mirror launch/inkleaf-launch/IMAGES.md
  // -------------------------------------------------------------------------
  const imagesMd = buildImagesMd(SPACE, imageRecords, sectionsRanked, gap_list);
  const imagesMdPath = path.join(OUT_DIR, 'IMAGES.md');
  fs.writeFileSync(imagesMdPath, imagesMd);
  logLines.push(`[WRITTEN] ${imagesMdPath}`);

  // -------------------------------------------------------------------------
  // VIDEOS.md — mirror launch/inkleaf-launch/VIDEOS.md
  // -------------------------------------------------------------------------
  const videosMd = buildVideosMd(SPACE, videoRecords, sectionsRanked, gap_list);
  const videosMdPath = path.join(OUT_DIR, 'VIDEOS.md');
  fs.writeFileSync(videosMdPath, videosMd);
  logLines.push(`[WRITTEN] ${videosMdPath}`);

  // -------------------------------------------------------------------------
  // Sidecar log + summary (S4)
  // -------------------------------------------------------------------------
  const summary = `asset-emit: ${imageRecords.length} images, ${videoRecords.length} videos, ${gap_list.length} gaps, space=${SPACE}, outDir=${OUT_DIR}`;
  logLines.unshift(`[${ts}] ${summary}`);
  fs.writeFileSync(path.join(OUT_DIR, '_asset-emit-log.txt'), logLines.join('\n') + '\n');
  console.log(summary);
})();

// ---------------------------------------------------------------------------
// IMAGES.md builder
// ---------------------------------------------------------------------------
function buildImagesMd(space, imageRecords, sectionsRanked, gap_list) {
  const lines = [];
  const spaceTitle = space.charAt(0).toUpperCase() + space.slice(1);

  lines.push(`# ${spaceTitle} Image CDN URLs`);
  lines.push('');
  lines.push('All product photos. Use CDN URLs in landing page HTML once uploaded.');
  lines.push('');
  lines.push('**Base URL pattern**: `https://cdn.shopify.com/s/files/1/<STORE_NUM_ID>/files/{filename}.jpg`');
  lines.push('*(Fill in STORE_NUM_ID after first Shopify Files upload, or run asset-upload.js --store-num-id=<id>)*');
  lines.push('');
  lines.push('---');
  lines.push('');

  // Asset specs table (dimensions + aspect ratio) — operator wants dims in the report
  if (imageRecords.length > 0) {
    lines.push('## Image specs');
    lines.push('');
    lines.push('| id | dimensions | aspect | shot_type | min_safe_use |');
    lines.push('|---|---|---|---|---|');
    for (const rec of imageRecords) {
      const t    = rec.technical || {};
      const dims = (t.w && t.h) ? `${t.w}×${t.h}` : '—';
      const ar   = t.aspect_ratio || '—';
      const st   = rec.shot_type || '—';
      const msu  = t.min_safe_use || '—';
      lines.push(`| ${rec.id} | ${dims} | ${ar} | ${st} | ${msu} |`);
    }
    lines.push('');
  }

  // Build a lookup from record id -> record
  const byId = {};
  for (const rec of imageRecords) {
    if (rec.id) byId[rec.id] = rec;
  }

  // Collect sections that have candidates
  const sectionNames = Object.keys(sectionsRanked).filter(s =>
    !['hero_loop', 'feature_demo'].includes(s)
  );

  // Also include any sections from eligible_sections on records that aren't in ranked
  const allSectionsSet = new Set(sectionNames);
  for (const rec of imageRecords) {
    if (Array.isArray(rec.eligible_sections)) {
      for (const s of rec.eligible_sections) allSectionsSet.add(s);
    }
  }

  // Render per-section tables using ranked order where available
  for (const section of allSectionsSet) {
    const candidates = sectionsRanked[section] || [];
    // Also include records with this section in eligible_sections but not in ranked
    const rankedIds = new Set(candidates.map(c => c.id));
    const extra = imageRecords
      .filter(r => Array.isArray(r.eligible_sections) && r.eligible_sections.includes(section) && !rankedIds.has(r.id))
      .map(r => ({
        id: r.id,
        role: 'also',
        claim: ((r.demonstrates || [])[0] || {}).claim || '—',
        strength: ((r.demonstrates || [])[0] || {}).strength || '—',
        min_safe_use: (r.technical && r.technical.min_safe_use) || '—',
        disqualifiers: r.disqualifiers || [],
        dup_of: r.dup_of || null,
      }));

    const allCandidates = [...candidates, ...extra];
    if (allCandidates.length === 0) continue;

    lines.push(`## ${section}`);
    lines.push('');
    lines.push('| role | pick | claim+strength | CDN URL |');
    lines.push('|---|---|---|---|');

    for (const c of allCandidates) {
      const rec = byId[c.id];
      const role        = c.role || '—';
      const pickLabel   = formatPickLabel(c, rec);
      const claimStr    = `${c.claim} (${c.strength})`;
      const cdnUrl      = (rec && rec.cdn_url) ? rec.cdn_url : '';
      lines.push(`| ${role} | ${pickLabel} | ${claimStr} | ${cdnUrl} |`);
    }
    lines.push('');
  }

  // Dropped / deduped records
  const deduped = imageRecords.filter(r => r.dup_of);
  if (deduped.length > 0) {
    lines.push('## Dropped (deduped)');
    lines.push('');
    lines.push('| id | dup_of | note |');
    lines.push('|---|---|---|');
    for (const rec of deduped) {
      const note = rec.selection_note || 'near-duplicate';
      lines.push(`| ${rec.id} | ${rec.dup_of} | ${note} |`);
    }
    lines.push('');
  }

  // Disqualified (non-empty disqualifiers, not deduped)
  const disqualified = imageRecords.filter(r => !r.dup_of && Array.isArray(r.disqualifiers) && r.disqualifiers.length > 0);
  if (disqualified.length > 0) {
    lines.push('## Disqualifiers');
    lines.push('');
    lines.push('| id | disqualifiers | note |');
    lines.push('|---|---|---|');
    for (const rec of disqualified) {
      const note = rec.selection_note || '';
      lines.push(`| ${rec.id} | ${rec.disqualifiers.join(', ')} | ${note} |`);
    }
    lines.push('');
  }

  // Gaps section
  const imageGaps = gap_list.filter(g => !['hero_loop', 'feature_demo'].includes(g.section));
  if (imageGaps.length > 0) {
    lines.push('## Gaps');
    lines.push('');
    lines.push('Sections with no strong+clean asset — reshoot or source before LP build:');
    lines.push('');
    lines.push('| section | candidates | reason |');
    lines.push('|---|---|---|');
    for (const g of imageGaps) {
      lines.push(`| ${g.section} | ${g.candidate_count} | ${g.reason} |`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatPickLabel(candidate, rec) {
  if (!rec) return candidate.id;
  const parts = [candidate.id];
  if (rec.shot_type) parts.push(rec.shot_type);
  if (candidate.disqualifiers && candidate.disqualifiers.length > 0) {
    parts.push(`[DISQUALIFIED: ${candidate.disqualifiers.join(', ')}]`);
  }
  return parts.join(' — ');
}

// ---------------------------------------------------------------------------
// VIDEOS.md builder
// ---------------------------------------------------------------------------
function buildVideosMd(space, videoRecords, sectionsRanked, gap_list) {
  const lines = [];
  const spaceTitle = space.charAt(0).toUpperCase() + space.slice(1);

  lines.push(`# ${spaceTitle} — Video CDN URLs`);
  lines.push('');
  lines.push(`Product videos for ${spaceTitle}. Upload to Shopify Files and capture CDN URLs via asset-upload.js.`);
  lines.push('');
  // HASHED-path warning — verbatim from launch/inkleaf-launch/VIDEOS.md
  lines.push('> NOTE: Shopify serves videos from a HASHED path (`/videos/c/o/v/{hash}.mp4`), NOT the');
  lines.push('> predictable `/files/{name}.mp4` pattern that images use. Use these exact URLs.');
  lines.push('');

  if (videoRecords.length === 0) {
    lines.push('*(No video records yet — run asset-fetch.js + comprehend-video + asset-map-rank.js first.)*');
    lines.push('');
  } else {
    lines.push('| file | spec | best_use | aesthetic | CDN URL |');
    lines.push('|---|---|---|---|---|');

    for (const rec of videoRecords) {
      const filename = (rec.source && rec.source.filename) || rec.id || '—';
      const probe    = rec.probe || {};
      const spec     = [
        probe.duration_s ? `${probe.duration_s}s` : null,
        (probe.w && probe.h) ? `${probe.w}×${probe.h}` : null,
        probe.aspect_ratio || null,
        probe.has_audio === false ? 'silent' : probe.has_audio ? 'audio' : null,
      ].filter(Boolean).join(' · ') || '—';
      const bestUse  = rec.best_use || '—';
      const aes      = rec.aesthetics || {};
      const aesCell  = (aes.overall != null) ? `${aes.overall}/10 ${aes.ad_ready ? '✓ad-ready' : '✗reshoot'}` : '—';
      const cdnUrl   = rec.cdn_url  || '';
      lines.push(`| ${filename} | ${spec} | ${bestUse} | ${aesCell} | ${cdnUrl} |`);
    }
    lines.push('');

    // Poster frame section
    lines.push('## Poster frame');
    lines.push('');
    lines.push('The poster frame is uploaded as a normal image (predictable URL) and used as `poster=` on the `<video>` tag.');
    lines.push('');
    lines.push('| video | poster_frame | CDN URL |');
    lines.push('|---|---|---|');
    for (const rec of videoRecords) {
      const filename = (rec.source && rec.source.filename) || rec.id || '—';
      const poster   = rec.poster_frame || '—';
      const cdnUrl   = rec.poster_cdn_url || '';
      lines.push(`| ${filename} | ${poster} | ${cdnUrl} |`);
    }
    lines.push('');

    // Aesthetic grades (picture-only production-quality grade; silent footage)
    if (videoRecords.some(r => r.aesthetics)) {
      lines.push('## Aesthetic grades');
      lines.push('');
      lines.push('Production-quality grade (picture only). Subscores 1-5; overall 1-10; ad_ready = runnable as a paid-ad / LP hero WITHOUT a reshoot.');
      lines.push('');
      lines.push('| file | overall | ad_ready | light | comp | focus | bg | color | stable | standout / weakness |');
      lines.push('|---|---|---|---|---|---|---|---|---|---|');
      for (const rec of videoRecords) {
        const a = rec.aesthetics;
        if (!a) continue;
        lines.push(`| ${rec.id} | ${a.overall}/10 | ${a.ad_ready ? 'yes' : 'NO'} | ${a.lighting} | ${a.composition} | ${a.focus_sharpness} | ${a.background} | ${a.color_grade} | ${a.stability} | ${a.standout || ''} — ${a.weakness || ''} |`);
      }
      lines.push('');
    }
  }

  // Video gaps — derive from actual best_use coverage (silent product videos: hero_loop + feature_demo)
  const VIDEO_SLOTS = ['hero_loop', 'feature_demo'];
  const slotsCovered = new Set(videoRecords.map(r => r.best_use).filter(Boolean));
  const videoGaps = VIDEO_SLOTS
    .filter(s => !slotsCovered.has(s))
    .map(s => ({ section: s, candidate_count: 0, reason: 'no video classified for this slot' }));
  if (videoGaps.length > 0) {
    lines.push('## Gaps');
    lines.push('');
    lines.push('| slot | candidates | reason |');
    lines.push('|---|---|---|');
    for (const g of videoGaps) {
      lines.push(`| ${g.section} | ${g.candidate_count} | ${g.reason} |`);
    }
    lines.push('');
  }

  // Embed snippet
  lines.push('## Embed snippet (autoplay muted loop)');
  lines.push('');
  lines.push('```html');
  lines.push('<video autoplay muted loop playsinline');
  lines.push('       poster="<POSTER_CDN_URL>"');
  lines.push('       style="width:100%;height:auto;display:block">');
  lines.push('  <source src="<VIDEO_CDN_URL>" type="video/mp4">');
  lines.push('</video>');
  lines.push('```');
  lines.push('');

  return lines.join('\n');
}
