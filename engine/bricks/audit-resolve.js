#!/usr/bin/env node
// audit-resolve.js
// Deterministic EVIDENCE RESOLVER for the pipeline soundness audit (see
// .claude/skills/pipeline-audit/). Replaces the spec's "Sonnet artifact-scout" with a script:
// resolving a FIXED evidence list to real on-disk paths is pure lookup (no judgment, no roaming),
// so per the CLAUDE.md deterministic->script law it is a script, not an agent.
//
// What it does: reads evidence-manifest.json, expands any glob entries (e.g.
// funnels-analyzer-out/*-beliefs.json), confirms every resolved file exists and is non-empty, and
// emits a resolved per-segment plan as JSON on stdout. Required evidence missing -> exit 1 so the
// orchestrator surfaces CANNOT ASSESS for that segment rather than silently auditing a thin set.
// It NEVER free-discovers files — the list is fixed; this only confirms reality matches it.
//
// Usage:
//   node tools/audit-resolve.js --segment=A-collection|A-market|A-funnel|B \
//        [--space=<space>] [--manifest=<path>] [--help]
//
//   --segment   REQUIRED. Which reviewer segment to resolve.
//   --space     Optional override of the manifest's `space` (sanitized).
//   --manifest  Optional path to the evidence manifest
//               (default: .claude/skills/pipeline-audit/evidence-manifest.json under cwd).
//
// Output (stdout, JSON): {
//   segment, space, prompts:[{path,exists,bytes}], evidence:[{logical,role,seq,strip,required,
//   status:'ok'|'missing', files:[{path,bytes}]}], missing:[...], optional_missing:[...],
//   a_law_always_include:[...], b_law_denylist:[...] }
// Diagnostics go to stderr so stdout stays clean JSON.
//
// Exit codes:
//   0 = all required prompts + evidence present and non-empty
//   1 = one or more REQUIRED prompts/evidence missing or empty (CANNOT ASSESS condition)
//   2 = bad usage / unreadable manifest / unknown segment
'use strict';

const fs   = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI arg parse (--flag=val — canonical repo pattern)
// ---------------------------------------------------------------------------
const rawArgs  = process.argv.slice(2);
const opts = Object.fromEntries(
  rawArgs.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log([
    'Usage: node tools/audit-resolve.js --segment=A-collection|A-market|A-funnel|B \\',
    '         [--space=<space>] [--manifest=<path>] [--help]',
    '',
    'Resolves the FIXED audit evidence list (evidence-manifest.json) to real on-disk paths for one',
    'reviewer segment, expanding globs and confirming every file exists + is non-empty. Emits a',
    'resolved plan as JSON on stdout. Required item missing -> exit 1 (CANNOT ASSESS).',
    '',
    'Exit 0 = all required present. Exit 1 = required missing/empty. Exit 2 = bad usage.',
  ].join('\n'));
  process.exit(0);
}

// Path sanitizer — same allowlist as funnel-analyzer-context.js / funnel-store.js.
function sanitizePathSegment(raw) {
  return String(raw).toLowerCase().replace(/[^a-z0-9._-]/g, '').replace(/\.\.+/g, '');
}

const SEGMENTS = ['A-collection', 'A-market', 'A-funnel', 'B'];
const segment = opts.segment;
if (!segment || segment === true || !SEGMENTS.includes(segment)) {
  console.error(`ERROR: --segment must be one of ${SEGMENTS.join(' | ')}`);
  process.exit(2);
}

// ---------------------------------------------------------------------------
// Load the manifest
// ---------------------------------------------------------------------------
const manifestPath = (typeof opts.manifest === 'string' && opts.manifest.length > 0)
  ? path.resolve(opts.manifest)
  : path.join(process.cwd(), '.claude', 'skills', 'pipeline-audit', 'evidence-manifest.json');

if (!fs.existsSync(manifestPath)) {
  console.error(`ERROR: manifest not found — ${manifestPath}`);
  process.exit(2);
}

let manifest;
try {
  manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
} catch (e) {
  console.error(`ERROR: cannot parse manifest "${manifestPath}" — ${e.message}`);
  process.exit(2);
}

const seg = manifest.segments && manifest.segments[segment];
if (!seg) {
  console.error(`ERROR: segment "${segment}" not defined in manifest`);
  process.exit(2);
}

// --space override is informational only (paths in the manifest are already concrete); sanitize for
// the report so a caller can't inject a weird value into downstream labels.
const space = (typeof opts.space === 'string' && opts.space.length > 0)
  ? sanitizePathSegment(opts.space)
  : (manifest.space || 'unknown');

// ---------------------------------------------------------------------------
// Resolver helpers
// ---------------------------------------------------------------------------
// Expand a repo-root-relative path that MAY contain a single-segment glob in its basename
// (e.g. "dir/*-beliefs.json"). Returns absolute file paths, sorted. Non-glob paths return [self].
function expand(relPath) {
  const abs = path.resolve(process.cwd(), relPath);
  if (!relPath.includes('*')) return [abs];
  const dir = path.dirname(abs);
  const pat = path.basename(abs);
  if (!fs.existsSync(dir)) return [];
  // glob basename -> anchored regex; escape regex metachars except '*', which becomes '.*'
  const rx = new RegExp('^' + pat.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*') + '$');
  return fs.readdirSync(dir)
    .filter(name => rx.test(name))
    .map(name => path.join(dir, name))
    .sort();
}

function statBytes(abs) {
  try { return fs.statSync(abs).size; } catch (_) { return -1; }
}

const missing = [];
const optionalMissing = [];

// ---- prompts (always required when present in the segment) ----
const prompts = (seg.prompts || []).map(rel => {
  const abs = path.resolve(process.cwd(), rel);
  const bytes = statBytes(abs);
  const exists = bytes > 0;
  if (!exists) missing.push({ kind: 'prompt', path: rel, why: bytes === 0 ? 'empty' : 'not found' });
  return { path: rel, abs, exists, bytes: Math.max(bytes, 0) };
});

// ---- evidence ----
const evidence = (seg.evidence || []).map(item => {
  const files = expand(item.path).map(abs => ({ path: abs, bytes: statBytes(abs) }))
    .filter(f => f.bytes >= 0); // keep present files (incl. empty=0 so empties stay visible); drop -1 (not found)
  const present = files.length > 0;
  const anyEmpty = files.some(f => f.bytes === 0);
  const status = (present && !anyEmpty) ? 'ok' : 'missing';
  if (status !== 'ok') {
    const rec = { kind: 'evidence', logical: item.logical, path: item.path,
      why: !present ? 'no match / not found' : 'empty file matched' };
    if (item.required) missing.push(rec); else optionalMissing.push(rec);
  }
  return {
    logical: item.logical,
    role: item.role || null,
    seq: item.seq != null ? item.seq : null,
    strip: item.strip === true,
    required: item.required === true,
    status,
    note: item.note || null,
    files
  };
});

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------
const out = {
  segment,
  space,
  manifest: manifestPath,
  prompts,
  evidence,
  missing,
  optional_missing: optionalMissing,
  a_law_always_include: manifest.a_law_always_include || [],
  b_law_denylist: manifest.b_law_denylist || [],
  kb_root: manifest.kb_root || null,
  map: manifest.map || null
};

process.stdout.write(JSON.stringify(out, null, 2) + '\n');

const okEvidence = evidence.filter(e => e.status === 'ok').length;
console.error(
  `[audit-resolve] segment=${segment} space=${space} — prompts ${prompts.filter(p => p.exists).length}/${prompts.length} ok, ` +
  `evidence ${okEvidence}/${evidence.length} ok, required-missing ${missing.length}, optional-missing ${optionalMissing.length}`
);

if (missing.length > 0) {
  console.error(`[audit-resolve] REQUIRED MISSING -> CANNOT ASSESS: ` +
    missing.map(m => m.logical || m.path).join(', '));
  process.exit(1);
}
process.exit(0);
