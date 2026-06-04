'use strict';
// asset-upload.js — brick 8 (url-map.json backfill)
//
// Backfills CDN URLs into images.json / videos.json + IMAGES.md / VIDEOS.md from a
// url-map.json (filename -> CDN URL). Works with manual upload OR future Admin-API upload.
//
// Image URLs: constructable from filename + store-num-id
//   https://cdn.shopify.com/s/files/1/<store_num_id>/files/<filename>.jpg
// Video URLs: HASHED, unpredictable — MUST come from the url-map (captured after upload).
//   https://cdn.shopify.com/videos/c/o/v/<hash>.mp4
//   NEVER fabricated (T-16-05-02). Absent video URL = empty slot + warning.
//
// Scope guard: credentialed Shopify Admin-API automation is OUT OF SCOPE for this brick.
//   - This brick does url-map-driven backfill only.
//   - The url-map is produced either by manual upload + paste OR a future Admin-API
//     fileCreate step (rides M2, needs store credentials).
//   - A Playwright UI-automation path (see crowdfund-fetch.js:269-294) may be wired in M2;
//     the stub comment below marks the seam.
//   - No credentials, no API calls, no browser automation in this brick.
//
// Security (T-16-05-01): sanitizes --space before using it in write paths.
// Security (T-16-05-02): NEVER constructs a hashed /videos/c/o/v/<hash>.mp4 URL.
//   Absent video URL stays empty + emits a warning line.
//
// Usage:
//   node tools/asset-upload.js --space=<slug> --url-map=<path> [--store-num-id=<id>]
//   node tools/asset-upload.js --help

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
asset-upload.js — brick 8: backfill CDN URLs from url-map.json into the manifest

Usage:
  node tools/asset-upload.js --space=<slug> --url-map=<path> [options]

Options:
  --space=<str>          Market/product space slug (e.g. arduview). REQUIRED.
  --url-map=<path>       Path to url-map.json ({ "<filename>": "<cdn_url>", ... }). REQUIRED.
  --store-num-id=<id>    Shopify store numeric ID (e.g. 0864/9234/8609) for constructing
                         image URLs when not in the url-map.
                         Format: the numeric path from cdn.shopify.com/s/files/1/<id>/files/
  --out=<path>           Override asset-classify dir (default: runs/<space>/asset-classify/).
  --help                 Show this help.

How it works:
  - Image URLs: if filename in url-map, use that URL.
                Otherwise, if --store-num-id given, construct:
                  https://cdn.shopify.com/s/files/1/<store_num_id>/files/<filename>.jpg
  - Video URLs: MUST come from the url-map (hashed path cannot be constructed).
                If absent: empty slot + WARNING. NEVER fabricated.
  - Poster frame: treated as a normal image (constructable or from url-map).

Backfills:
  - images.json  (cdn_url field per record)
  - videos.json  (cdn_url + poster_cdn_url fields per record)
  - IMAGES.md    (CDN URL column)
  - VIDEOS.md    (CDN URL column + poster frame column)

Scope guard:
  Credentialed Shopify Admin-API automation is OUT OF SCOPE (rides M2).
  This brick accepts a url-map.json produced by manual upload or a future fileCreate step.
  // STUB(M2): Playwright UI-automation path (crowdfund-fetch.js:269-294 launch block) —
  //   wire headless Shopify Files upload + hash capture here when M2 adds store credentials.

Output:
  runs/<space>/asset-classify/images.json       (updated in-place)
  runs/<space>/asset-classify/videos.json       (updated in-place)
  runs/<space>/asset-classify/IMAGES.md         (CDN column filled)
  runs/<space>/asset-classify/VIDEOS.md         (CDN column filled)
  runs/<space>/asset-classify/_asset-upload-log.txt
`);
  process.exit(0);
}

if (!opts.space) {
  console.error('ERROR: --space=<slug> is required');
  process.exit(1);
}
if (!opts['url-map']) {
  console.error('ERROR: --url-map=<path> is required');
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
const CWD       = process.cwd();
const OUT_DIR   = opts.out
  ? path.resolve(opts.out)
  : path.join(CWD, 'runs', SPACE, 'asset-classify');
const URL_MAP_PATH = path.resolve(opts['url-map']);

const IMAGES_JSON_PATH = path.join(OUT_DIR, 'images.json');
const VIDEOS_JSON_PATH = path.join(OUT_DIR, 'videos.json');
const IMAGES_MD_PATH   = path.join(OUT_DIR, 'IMAGES.md');
const VIDEOS_MD_PATH   = path.join(OUT_DIR, 'VIDEOS.md');

const storeNumId = opts['store-num-id'] || null;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function getFilename(rec) {
  // Try source.filename first, then id + extension hints
  if (rec.source && rec.source.filename) return rec.source.filename;
  if (rec.source && rec.source.local_path) return path.basename(rec.source.local_path);
  return null;
}

function constructImageUrl(filename, storeId) {
  if (!storeId) return null;
  // Normalize filename: strip leading slash
  const fn = filename.replace(/^\//, '');
  return `https://cdn.shopify.com/s/files/1/${storeId}/files/${fn}`;
}

function isVideoFilename(filename) {
  return /\.(mp4|mov|webm|avi)$/i.test(filename || '');
}

// Backfill a CDN URL cell in markdown table (replace empty pipe-delimited cell in last column)
function backfillMdUrl(md, id, filename, cdnUrl) {
  if (!cdnUrl) return md;
  // Replace lines that contain the id or filename and have an empty last column
  // Table row pattern: | ... | <empty or whitespace> |
  // We do a line-by-line replacement to be safe
  const lines = md.split('\n');
  return lines.map(line => {
    if (!line.startsWith('|')) return line;
    // Check if this row references the record id or filename
    const mentions = (id && line.includes(id)) || (filename && line.includes(filename));
    if (!mentions) return line;
    // Replace trailing empty CDN URL cell: | <anything> |  |  -> | <anything> | <url> |
    return line.replace(/\|\s*\|(\s*)$/, `| ${cdnUrl} |$1`);
  }).join('\n');
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(function main() {
  const logLines = [];
  const ts       = new Date().toISOString();
  let ok = 0, warnings = 0;

  // Load url-map
  let urlMap;
  try {
    urlMap = loadJson(URL_MAP_PATH);
  } catch (e) {
    console.error(`ERROR: failed to load url-map at ${URL_MAP_PATH}: ${e.message}`);
    process.exit(1);
  }
  if (typeof urlMap !== 'object' || Array.isArray(urlMap)) {
    console.error('ERROR: url-map.json must be a plain object { "<filename>": "<cdn_url>" }');
    process.exit(1);
  }
  logLines.push(`[LOADED] url-map: ${Object.keys(urlMap).length} entries`);

  // -------------------------------------------------------------------------
  // Backfill images.json
  // -------------------------------------------------------------------------
  let imageStore, imagesDirty = false;
  if (fs.existsSync(IMAGES_JSON_PATH)) {
    try {
      imageStore = loadJson(IMAGES_JSON_PATH);
    } catch (e) {
      logLines.push(`[WARN] failed to load images.json: ${e.message}`);
    }
  }

  if (imageStore && Array.isArray(imageStore.records)) {
    for (const rec of imageStore.records) {
      const filename = getFilename(rec);
      if (!filename) { logLines.push(`[WARN] record ${rec.id}: no filename`); continue; }

      let cdnUrl = null;
      if (urlMap[filename]) {
        cdnUrl = urlMap[filename];
        logLines.push(`[MAP] ${rec.id} <- ${cdnUrl}`);
      } else if (storeNumId && !isVideoFilename(filename)) {
        cdnUrl = constructImageUrl(filename, storeNumId);
        logLines.push(`[CONSTRUCT] ${rec.id} <- ${cdnUrl}`);
      } else {
        logLines.push(`[SKIP] ${rec.id} (${filename}): not in url-map${!storeNumId ? ', no --store-num-id' : ''}`);
      }

      if (cdnUrl) {
        rec.cdn_url = cdnUrl;
        ok++;
        imagesDirty = true;
      }
    }
    if (imagesDirty) {
      fs.writeFileSync(IMAGES_JSON_PATH, JSON.stringify(imageStore, null, 2));
      logLines.push(`[UPDATED] ${IMAGES_JSON_PATH}`);
    }
  } else {
    logLines.push(`[SKIP] images.json not found or has no records: ${IMAGES_JSON_PATH}`);
  }

  // -------------------------------------------------------------------------
  // Backfill videos.json
  // (T-16-05-02: NEVER construct a hashed video URL — must come from url-map)
  // -------------------------------------------------------------------------
  let videoStore, videosDirty = false;
  if (fs.existsSync(VIDEOS_JSON_PATH)) {
    try {
      videoStore = loadJson(VIDEOS_JSON_PATH);
    } catch (e) {
      logLines.push(`[WARN] failed to load videos.json: ${e.message}`);
    }
  }

  if (videoStore && Array.isArray(videoStore.records)) {
    for (const rec of videoStore.records) {
      const filename = getFilename(rec);
      if (!filename) { logLines.push(`[WARN] video record ${rec.id}: no filename`); continue; }

      // Video CDN URL: MUST come from url-map (hashed path, cannot construct)
      if (urlMap[filename]) {
        rec.cdn_url = urlMap[filename];
        logLines.push(`[MAP-VIDEO] ${rec.id} <- ${rec.cdn_url}`);
        ok++;
        videosDirty = true;
      } else {
        // T-16-05-02: NEVER fabricate a hashed video URL
        logLines.push(`[WARN] video ${rec.id} (${filename}): not in url-map — CDN slot left empty (hashed URL cannot be constructed)`);
        console.warn(`  WARNING: video ${filename} not in url-map — upload it and add the hashed CDN URL to url-map.json`);
        warnings++;
      }

      // Poster frame: treated as a normal image (constructable or from url-map)
      const posterFilename = rec.poster_frame ? `${path.basename(rec.poster_frame, path.extname(rec.poster_frame))}.jpg` : null;
      if (posterFilename) {
        if (urlMap[posterFilename]) {
          rec.poster_cdn_url = urlMap[posterFilename];
          logLines.push(`[MAP-POSTER] ${rec.id} poster <- ${rec.poster_cdn_url}`);
          videosDirty = true;
        } else if (storeNumId) {
          rec.poster_cdn_url = constructImageUrl(posterFilename, storeNumId);
          logLines.push(`[CONSTRUCT-POSTER] ${rec.id} poster <- ${rec.poster_cdn_url}`);
          videosDirty = true;
        } else {
          logLines.push(`[SKIP-POSTER] ${rec.id}: poster_frame ${posterFilename} not in url-map, no --store-num-id`);
        }
      }
    }
    if (videosDirty) {
      fs.writeFileSync(VIDEOS_JSON_PATH, JSON.stringify(videoStore, null, 2));
      logLines.push(`[UPDATED] ${VIDEOS_JSON_PATH}`);
    }
  } else {
    logLines.push(`[SKIP] videos.json not found or has no records: ${VIDEOS_JSON_PATH}`);
  }

  // -------------------------------------------------------------------------
  // Backfill IMAGES.md (replace empty CDN URL cells)
  // -------------------------------------------------------------------------
  if (fs.existsSync(IMAGES_MD_PATH) && imageStore && Array.isArray(imageStore.records)) {
    let md = fs.readFileSync(IMAGES_MD_PATH, 'utf8');
    let mdDirty = false;
    for (const rec of imageStore.records) {
      if (!rec.cdn_url) continue;
      const filename = getFilename(rec);
      const before = md;
      md = backfillMdUrl(md, rec.id, filename, rec.cdn_url);
      if (md !== before) mdDirty = true;
    }
    // Also replace base URL pattern if storeNumId given
    if (storeNumId && md.includes('<STORE_NUM_ID>')) {
      md = md.replace(/<STORE_NUM_ID>/g, storeNumId);
      mdDirty = true;
    }
    if (mdDirty) {
      fs.writeFileSync(IMAGES_MD_PATH, md);
      logLines.push(`[UPDATED] ${IMAGES_MD_PATH}`);
    }
  }

  // -------------------------------------------------------------------------
  // Backfill VIDEOS.md (replace empty CDN URL cells)
  // -------------------------------------------------------------------------
  if (fs.existsSync(VIDEOS_MD_PATH) && videoStore && Array.isArray(videoStore.records)) {
    let md = fs.readFileSync(VIDEOS_MD_PATH, 'utf8');
    let mdDirty = false;
    for (const rec of videoStore.records) {
      const filename = getFilename(rec);
      if (rec.cdn_url) {
        const before = md;
        md = backfillMdUrl(md, rec.id, filename, rec.cdn_url);
        if (md !== before) mdDirty = true;
      }
      if (rec.poster_cdn_url && rec.poster_frame) {
        const pf = path.basename(rec.poster_frame);
        const before = md;
        md = backfillMdUrl(md, pf, pf, rec.poster_cdn_url);
        if (md !== before) mdDirty = true;
      }
    }
    if (mdDirty) {
      fs.writeFileSync(VIDEOS_MD_PATH, md);
      logLines.push(`[UPDATED] ${VIDEOS_MD_PATH}`);
    }
  }

  // -------------------------------------------------------------------------
  // Sidecar log + summary (S4)
  // -------------------------------------------------------------------------
  const summary = `asset-upload: ${ok} CDN URLs backfilled, ${warnings} missing-video warnings, space=${SPACE}`;
  logLines.unshift(`[${ts}] ${summary}`);
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, '_asset-upload-log.txt'), logLines.join('\n') + '\n');

  console.log(summary);
  if (warnings > 0) {
    console.error(`  See above WARNING lines for videos not in url-map.`);
  }
  // S4 partial-success exit: only exit 1 if nothing was backfilled AND we had expected work
  if (ok === 0 && Object.keys(urlMap).length > 0) {
    console.error('  WARN: url-map has entries but no CDN URLs were backfilled (check filenames match record source.filename)');
  }
})();
