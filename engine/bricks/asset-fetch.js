/**
 * asset-fetch.js — brick 1: local/Drive fetch + id assignment + raw-manifest.json
 *
 * Usage:
 *   node tools/asset-fetch.js --local=<dir> [--product=<name>] [--out=<dir>] [--help]
 *   node tools/asset-fetch.js --drive-folder-id=<id> [--product=<name>] [--out=<dir>] [--help]
 *
 * --local=<dir>           Glob *.jpg/*.jpeg/*.png/*.mp4 from dir, copy to assets/raw/, run probe.py
 *                         per image, write assets/raw-manifest.json. (UAT path — build + run this)
 * --drive-folder-id=<id>  [BLOCKED] Prod path via Drive MCP. See comment below.
 * --product=<name>        Product prefix for ids (default: arduview). Sanitized to [a-z0-9._-].
 * --out=<dir>             Base output dir (default: ./assets)
 * --help                  Show this help
 *
 * Output: raw-manifest.json array of { id, source:{local_path,work_path?,original_name}, kind, technical? }
 *
 * Exit contract (S4):
 *   Partial success -> exit 0 (written records ARE on disk)
 *   Zero succeeded  -> exit 1
 *   probe.py failure on a file -> status:"error" on that record, never crash the loop
 *
 * Security (T-16-02-01, T-16-02-02):
 *   - sanitizePathSegment() applied to --product and all generated ids
 *   - path.resolve + path.relative traversal guard on every globbed filename
 *   - spawnSync with argv arrays only (no shell interpolation of filenames)
 */

'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
// No glob package; use fs.readdirSync with extension filter (pure Node built-ins)

// ---------------------------------------------------------------------------
// S1 — CLI arg/opts parse
// ---------------------------------------------------------------------------
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help || args.length === 0) {
  console.log(
    'Usage: node tools/asset-fetch.js --local=<dir> [--product=<name>] [--out=<dir>]\n' +
    '       node tools/asset-fetch.js --drive-folder-id=<id> [--product=<name>] [--out=<dir>]\n' +
    '\n' +
    '  --local=<dir>            Glob images+videos from a local directory (UAT path)\n' +
    '  --drive-folder-id=<id>   Google Drive folder id (BLOCKED — see source comment)\n' +
    '  --product=<name>         Product prefix for ids, default=arduview\n' +
    '  --out=<dir>              Base output dir, default=./assets\n' +
    '  --help                   Show this help\n' +
    '\n' +
    'Outputs:\n' +
    '  assets/raw/<id>.<ext>    Copied originals\n' +
    '  assets/work/<id>.jpg     Downscaled work copies (images only)\n' +
    '  assets/raw-manifest.json Array of { id, source, kind, technical? }\n'
  );
  process.exit(0);
}

// ---------------------------------------------------------------------------
// S2 — Path sanitizer (T-03-13)
// ---------------------------------------------------------------------------
function sanitizePathSegment(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');
}

// ---------------------------------------------------------------------------
// S5 — Spawn probe.py via explicit venv python
// ---------------------------------------------------------------------------
const VENV_PY = path.resolve(process.cwd(), '.venv', 'bin', 'python');
const PROBE_PY = path.resolve(__dirname, 'asset', 'probe.py');

function runProbe(rawPath, workPath) {
  const run = spawnSync(
    VENV_PY,
    [PROBE_PY, rawPath, workPath],
    { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 }
  );
  if (run.error || run.status !== 0 || !run.stdout) {
    const why = run.error
      ? run.error.message
      : run.status !== 0
        ? `probe.py exited ${run.status}`
        : 'no stdout';
    throw new Error(`probe.py failed — ${why} (refusing to fabricate technical{})\n${run.stderr ? run.stderr.trim() : ''}`);
  }
  return JSON.parse(run.stdout);
}

// ---------------------------------------------------------------------------
// Id assignment helpers
// ---------------------------------------------------------------------------
function assignIds(files, product) {
  let imgCount = 0;
  let vidCount = 0;
  return files.map(filePath => {
    const ext = path.extname(filePath).toLowerCase();
    const isVideo = ['.mp4', '.mov', '.avi', '.webm'].includes(ext);
    if (isVideo) {
      vidCount++;
      const id = `${product}-vid-${String(vidCount).padStart(2, '0')}`;
      return { filePath, ext, id, kind: 'video' };
    } else {
      imgCount++;
      const id = `${product}-${String(imgCount).padStart(4, '0')}`;
      return { filePath, ext, id, kind: 'image' };
    }
  });
}

// ---------------------------------------------------------------------------
// Core manifest-write logic (shared between --local and future --drive mode)
// ---------------------------------------------------------------------------
function processFiles(files, product, rawDir, workDir, logLines) {
  const assigned = assignIds(files, product);
  const manifest = [];

  for (const { filePath, ext, id, kind } of assigned) {
    try {
      const originalName = path.basename(filePath);
      const safeId = sanitizePathSegment(id);
      if (!safeId) throw new Error(`id sanitized to empty: ${id}`);

      const destExt = ext.replace(/^\./, '').toLowerCase();
      const rawDest = path.join(rawDir, `${safeId}.${destExt}`);
      fs.copyFileSync(filePath, rawDest);

      const record = {
        id: safeId,
        source: {
          local_path: rawDest,
          original_name: originalName,
        },
        kind,
        status: 'ok',
      };

      if (kind === 'image') {
        const workDest = path.join(workDir, `${safeId}.jpg`);
        const technical = runProbe(rawDest, workDest);
        record.technical = technical;
        record.source.work_path = workDest;
      }
      // Videos: NO probe here (plan 03 probe_video.py). Record kind:"video" + raw path only.

      manifest.push(record);
      logLines.push(`[OK] ${safeId} (${kind}) <- ${originalName}`);
    } catch (err) {
      // Per-file isolation: set status:"error", never throw out of the loop
      manifest.push({
        id: sanitizePathSegment(id) || id,
        source: { original_name: path.basename(filePath) },
        kind,
        status: 'error',
        error: err.message,
      });
      logLines.push(`[ERROR] ${id}: ${err.message}`);
    }
  }

  return manifest;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  const product = sanitizePathSegment(opts.product || 'arduview');
  if (!product) {
    console.error('ERROR: --product sanitized to empty; use [a-z0-9._-]');
    process.exit(1);
  }

  const baseOut = opts.out ? path.resolve(opts.out) : path.resolve(process.cwd(), 'assets');
  const rawDir  = path.join(baseOut, 'raw');
  const workDir = path.join(baseOut, 'work');
  fs.mkdirSync(rawDir,  { recursive: true });
  fs.mkdirSync(workDir, { recursive: true });

  const logLines = [];
  let manifest = [];

  // -------------------------------------------------------------------------
  // --local mode (UAT)
  // -------------------------------------------------------------------------
  if (opts.local) {
    const localDir = path.resolve(String(opts.local));
    if (!fs.existsSync(localDir)) {
      console.error(`ERROR: --local dir not found: ${localDir}`);
      process.exit(1);
    }

    // Read directory and filter by extension (pure fs, no glob package)
    const IMAGE_EXTS = new Set(['.jpg', '.jpeg', '.png']);
    const VIDEO_EXTS = new Set(['.mp4', '.mov', '.avi', '.webm']);
    let files = fs.readdirSync(localDir)
      .filter(name => {
        const ext = path.extname(name).toLowerCase();
        return IMAGE_EXTS.has(ext) || VIDEO_EXTS.has(ext);
      })
      .map(name => path.join(localDir, name))
      .sort();  // stable id assignment

    if (files.length === 0) {
      console.error(`ERROR: no images/videos found in ${localDir}`);
      process.exit(1);
    }

    // Path traversal guard (T-16-02-01)
    files = files.filter(f => {
      const rel = path.relative(localDir, f);
      if (rel.startsWith('..')) {
        logLines.push(`[SKIP] path traversal rejected: ${f}`);
        return false;
      }
      return true;
    });

    logLines.push(`[${new Date().toISOString()}] asset-fetch --local: ${files.length} files found in ${localDir}`);
    manifest = processFiles(files, product, rawDir, workDir, logLines);

  // -------------------------------------------------------------------------
  // --drive-folder-id mode (prod — BLOCKED on cross-account share)
  // -------------------------------------------------------------------------
  } else if (opts['drive-folder-id']) {
    /*
     * DRIVE MODE — NOT WIRED YET
     *
     * Plan (when unblocked):
     *   1. list folder via Drive MCP: mcp.drive.list({ folderId: opts['drive-folder-id'] })
     *   2. download each file to assets/raw/ (Drive MCP download or fetch by fileId)
     *   3. run identical id-assignment + manifest-write via processFiles()
     *
     * BLOCKED: Louis Huang's shared folder returns "not found" for the service account.
     *   Cross-account share requires the folder owner to re-share to the correct principal.
     *   --local is the UAT path until that is resolved.
     *
     * The processFiles() / id-assignment / manifest-write helpers above are ALREADY wired —
     * Drive mode only needs to supply the downloaded file paths and then call processFiles().
     */
    console.error(
      'ERROR: Drive mode not wired — use --local=<dir> until cross-account share is resolved.\n' +
      '  Drive mode is documented in the source; the shared id/manifest helpers are ready.'
    );
    process.exit(1);

  } else {
    console.error('ERROR: must supply --local=<dir> or --drive-folder-id=<id>');
    process.exit(1);
  }

  // -------------------------------------------------------------------------
  // Write raw-manifest.json (S4 sidecar + summary)
  // -------------------------------------------------------------------------
  const manifestPath = path.join(baseOut, 'raw-manifest.json');
  const cleanManifest = manifest.map(r => {
    // Strip internal status field from the emitted manifest (keep it clean)
    const { status, error, ...rest } = r;
    return rest;
  });
  fs.writeFileSync(manifestPath, JSON.stringify(cleanManifest, null, 2));

  const ok     = manifest.filter(r => r.status === 'ok');
  const errors = manifest.filter(r => r.status === 'error');
  const summary = `asset-fetch: ${ok.length} ok, ${errors.length} errors, product=${product}, out=${baseOut}`;
  logLines.unshift(`[${new Date().toISOString()}] ${summary}`);
  fs.writeFileSync(path.join(baseOut, '_asset-fetch-log.txt'), logLines.join('\n') + '\n');
  console.log(summary);

  // S4 exit contract: errors to stderr; exit 1 only if zero succeeded
  if (errors.length > 0) {
    for (const r of errors) console.error(`  ERROR: ${r.id}: ${r.error || 'unknown'}`);
    if (ok.length === 0) process.exit(1);
  }
}

main().catch(err => {
  console.error('FATAL:', err.message);
  process.exit(2);
});
