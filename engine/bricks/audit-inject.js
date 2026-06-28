#!/usr/bin/env node
// audit-inject.js
// Deterministic COLD-CONTEXT ASSEMBLER for the pipeline soundness audit (see
// .claude/skills/pipeline-audit/). Hooks do NOT fire inside subagents, so DR-law + evidence
// injection into each reviewer is the orchestrator's own SCRIPT step (the funnel-deep-pass
// precedent: tools/funnel-analyzer-context.js). The reviewer receives the bytes between explicit
// boundaries — it never Reads, fetches, or searches.
//
// It assembles ONE block: [CONTEXT RECEIPT instruction] + [THE LAW: scout-selected DR files] +
// [THE EVIDENCE: the fixed run artifacts] + [HARD PROHIBITION]. The orchestrator pastes the block
// into the reviewer's spawn prompt.
//
// Two-sided injection verification (the operator's explicit requirement):
//   1. PRE-SPAWN (this script): refuses to emit (exit 2) if any named law/evidence file is missing
//      or empty — no reviewer ever spawns on a thin/partial context. It also writes a MANIFEST
//      (file list + byte counts) for the orchestrator to check the reviewer's receipt against.
//   2. POST-SPAWN (reviewer prompt + orchestrator): the block instructs the reviewer to emit a
//      CONTEXT RECEIPT first; the orchestrator compares that receipt to this manifest and re-spawns
//      on any mismatch.
//
// B law-denylist: when --reviewer starts with "B", any law file whose basename equals or
// starts-with an entry in the manifest's b_law_denylist (differentiator-framework, angle.md,
// definitions.md) is REFUSED — filtered out, logged, and recorded in manifest.denied[]. B is the
// prompt-blind grounding reviewer and must never receive rule-theory, even if a scout slips one in.
//
// Usage:
//   node tools/audit-inject.js --reviewer=A-collection|A-market|A-funnel|B \
//        --law=<comma-separated paths> --evidence=<comma-separated paths> \
//        [--manifest=<path>] [--out=<path>] [--help]
//
//   --reviewer   REQUIRED. Reviewer-context id. Anything starting with "B" gets the B denylist.
//   --law        Comma-separated law (DR) file paths. ~ is expanded. May be empty (warns).
//   --evidence   Comma-separated evidence file paths. ~ is expanded. May be empty (warns).
//   --manifest   Manifest to read b_law_denylist from
//                (default: .claude/skills/pipeline-audit/evidence-manifest.json under cwd).
//   --out        Write the assembled block to <path> (and the manifest to <path>.manifest.json)
//                instead of stdout. Diagnostics always go to stderr.
//
// Exit codes:
//   0 = block assembled and emitted
//   2 = bad usage, OR any non-denied law/evidence file missing or empty (never fabricate context)
'use strict';

const fs   = require('fs');
const os   = require('os');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI arg parse (--flag=val — canonical repo pattern)
// ---------------------------------------------------------------------------
const rawArgs = process.argv.slice(2);
const opts = Object.fromEntries(
  rawArgs.filter(a => a.startsWith('--')).map(a => {
    const i = a.indexOf('=');
    return i === -1 ? [a.replace(/^--/, ''), true] : [a.slice(2, i), a.slice(i + 1)];
  })
);

if (opts.help) {
  console.log([
    'Usage: node tools/audit-inject.js --reviewer=A-collection|A-market|A-funnel|B \\',
    '         --law=<comma paths> --evidence=<comma paths> [--manifest=<path>] [--out=<path>]',
    '',
    'Assembles ONE reviewer cold-context block = [CONTEXT RECEIPT instruction] + [THE LAW] +',
    '[THE EVIDENCE] + [HARD PROHIBITION], emits to stdout (or --out), and writes a verification',
    'manifest (file list + byte counts) to stderr (or <out>.manifest.json).',
    '',
    'When --reviewer starts with "B", law files on the manifest b_law_denylist are filtered out',
    '(recorded in manifest.denied[]). Any non-denied named file missing/empty -> exit 2.',
  ].join('\n'));
  process.exit(0);
}

const reviewer = opts.reviewer;
if (!reviewer || reviewer === true) {
  console.error('ERROR: --reviewer is required (A-collection | A-market | A-funnel | B)');
  process.exit(2);
}
const isB = String(reviewer).toUpperCase().startsWith('B');
const isA = String(reviewer).toUpperCase().startsWith('A');

// Expand ~ and resolve a path against cwd.
function resolvePath(p) {
  let s = String(p).trim();
  if (s === '~' || s.startsWith('~/')) s = path.join(os.homedir(), s.slice(1));
  return path.resolve(process.cwd(), s);
}

// Split a comma list flag into resolved {raw,abs,base} entries (drops empty segments).
function parseList(flag) {
  if (typeof flag !== 'string' || flag.length === 0) return [];
  return flag.split(',').map(s => s.trim()).filter(Boolean).map(raw => {
    const abs = resolvePath(raw);
    return { raw, abs, base: path.basename(abs) };
  });
}

// Expand a repo-root-relative path (possibly with a basename glob) to basenames of matching files
// on disk; non-glob returns its literal basename. Used to build the B strip-enforcement set.
function expandBasenames(relPath) {
  if (!relPath.includes('*')) return [path.basename(relPath)];
  const abs = path.resolve(process.cwd(), relPath);
  const dir = path.dirname(abs);
  const pat = path.basename(abs).replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/\*/g, '.*');
  const rx = new RegExp('^' + pat + '$');
  try { return fs.readdirSync(dir).filter(n => rx.test(n)); } catch (_) { return []; }
}

let lawList      = parseList(opts.law);
const evidenceList = parseList(opts.evidence);

// ---------------------------------------------------------------------------
// Load denylist from manifest (only consulted for B)
// ---------------------------------------------------------------------------
const manifestPath = (typeof opts.manifest === 'string' && opts.manifest.length > 0)
  ? path.resolve(opts.manifest)
  : path.join(process.cwd(), '.claude', 'skills', 'pipeline-audit', 'evidence-manifest.json');

let denylist = [];
let mustBeStripped = new Set();  // basenames of B's strip:true items (the enforcement set)
let strippedDir = null;          // abs path of runs/<space>/_audit/b-stripped
let runNotes = [];               // OPERATOR PROSECUTION NOTES — injected for A only

// Load the manifest once if present. B REQUIRES it (denylist + strip set); A uses it for run_notes;
// bare unit tests may omit it (no --manifest, default path absent) and still assemble.
let man = null;
if (fs.existsSync(manifestPath)) {
  try {
    man = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (e) {
    console.error(`ERROR: cannot parse manifest "${manifestPath}" — ${e.message}`);
    process.exit(2);
  }
}
if (isB) {
  if (!man) {
    console.error(`ERROR: --reviewer=B needs the manifest (b_law_denylist + strip set), not found — ${manifestPath}`);
    process.exit(2);
  }
  denylist = man.b_law_denylist || [];
  strippedDir = path.resolve(process.cwd(), 'runs', man.space || '', '_audit', 'b-stripped');
  // Strip-enforcement set: basenames of every B evidence flagged strip:true, expanded against the
  // ORIGINAL on-disk files. Any such basename handed to B MUST come from strippedDir — never the
  // unstripped original. Deterministic, not honor-system.
  const bEvidence = (man.segments && man.segments.B && man.segments.B.evidence) || [];
  for (const item of bEvidence) {
    if (item.strip === true) for (const bn of expandBasenames(item.path)) mustBeStripped.add(bn);
  }
}
if (isA && man) {
  // Run-specific operator prosecution notes: global a_run_notes + this segment's run_notes.
  // A ONLY — never assembled for B (B is judgment-blind to operator framing).
  const segNotes = (man.segments && man.segments[reviewer] && man.segments[reviewer].run_notes) || [];
  runNotes = [...(man.a_run_notes || []), ...segNotes];
}

// basename matches a denylist entry by exact-equal OR prefix (so "differentiator-framework"
// catches "differentiator-framework__2_.md").
function isDenied(base) {
  return denylist.some(e => base === e || base.startsWith(e));
}

const denied = [];
if (isB && denylist.length) {
  lawList = lawList.filter(f => {
    if (isDenied(f.base)) { denied.push(f.base); return false; }
    return true;
  });
}
denied.forEach(b => console.error(`[audit-inject] B-DENYLIST: refused rule-theory law file "${b}" (B must not see how-to-reason)`));

// ---------------------------------------------------------------------------
// B STRIP-ENFORCEMENT GUARD (deterministic — closes the honor-system gap):
//   (1) any evidence whose basename is a strip:true item MUST resolve under strippedDir — refuse
//       the unstripped original;
//   (2) EVERY strip:true item must be present as a stripped file — a strip item can't be silently
//       dropped. Either violation exits 2: B never prosecutes an un-stripped verdict/rationale.
// ---------------------------------------------------------------------------
if (isB && mustBeStripped.size) {
  const underStripped = (abs) => abs === strippedDir || abs.startsWith(strippedDir + path.sep);
  for (const e of evidenceList) {
    if (mustBeStripped.has(e.base) && !underStripped(e.abs)) {
      console.error(`ERROR: Reviewer B was handed the UNSTRIPPED "${e.base}" (${e.abs}). ` +
        `strip:true items must be the stripped copy under ${strippedDir}. Run strip-for-b first, ` +
        `then inject the b-stripped/ path. Refusing — no honor system.`);
      process.exit(2);
    }
  }
  const presentStripped = new Set(evidenceList.filter(e => underStripped(e.abs)).map(e => e.base));
  const missing = [...mustBeStripped].filter(bn => !presentStripped.has(bn));
  if (missing.length) {
    console.error(`ERROR: Reviewer B is missing required stripped copies for: ${missing.join(', ')}. ` +
      `Every strip:true item must be present as a runs/<space>/_audit/b-stripped/ file before B runs. ` +
      `Run strip-for-b (+ validate-strip.js) for these first.`);
    process.exit(2);
  }
}

// ---------------------------------------------------------------------------
// Read every named file; refuse on any missing/empty (never fabricate context)
// ---------------------------------------------------------------------------
function readOrDie(entry, kind) {
  if (!fs.existsSync(entry.abs)) {
    console.error(`ERROR: ${kind} file not found — ${entry.raw} (resolved ${entry.abs})`);
    process.exit(2);
  }
  const body = fs.readFileSync(entry.abs, 'utf8');
  if (body.length === 0) {
    console.error(`ERROR: ${kind} file is empty — ${entry.raw} (never inject an empty file)`);
    process.exit(2);
  }
  return body;
}

const law      = lawList.map(e => ({ ...e, body: readOrDie(e, 'law') }));
const evidence = evidenceList.map(e => ({ ...e, body: readOrDie(e, 'evidence') }));

if (law.length === 0)      console.error('[audit-inject] WARNING: 0 law files — reviewer will have no standard to prosecute against.');
if (evidence.length === 0) console.error('[audit-inject] WARNING: 0 evidence files — reviewer will have nothing to prosecute.');

// ---------------------------------------------------------------------------
// Assemble ONE block with explicit boundaries
// ---------------------------------------------------------------------------
const SEP = '='.repeat(72);

const lawNames = law.map(f => f.base).join(', ') || '(none)';
const evNames  = evidence.map(f => f.base).join(', ') || '(none)';

const header = [
  SEP,
  `=== AUDIT REVIEWER CONTEXT (assembled by audit-inject.js — reviewer=${reviewer}) ===`,
  '=== This block is your FULL context. It is already in front of you. Do NOT Read,    ===',
  '=== fetch, or search for anything to obtain it.                                      ===',
  SEP,
  '',
  '=== CONTEXT RECEIPT REQUIRED — output this FIRST, before any analysis ===',
  'Your very first output line MUST be exactly one CONTEXT RECEIPT confirming what you received:',
  '  CONTEXT RECEIPT: law_files=<N> [<basenames>]; evidence_files=<M> [<basenames>]',
  'Count and name them from what actually appears below — do not guess. If the orchestrator finds',
  'the counts/names do not match what it injected, it discards your review and re-spawns you. Report',
  'exactly what is present.',
  '',
].join('\n');

function fileBlock(tag, f) {
  return [
    '',
    `--- BEGIN ${tag} FILE: ${f.base} ---`,
    f.body.replace(/\s+$/,''),
    `--- END ${tag} FILE: ${f.base} ---`,
    '',
  ].join('\n');
}

const lawSection = [
  SEP,
  '=== THE LAW (DR principles — the standard you prosecute against) ===',
  SEP,
  ...law.map(f => fileBlock('LAW', f)),
].join('\n');

const evidenceSection = [
  SEP,
  '=== THE EVIDENCE (what you prosecute) ===',
  SEP,
  ...evidence.map(f => fileBlock('EVIDENCE', f)),
].join('\n');

const prohibitionLines = [
  SEP,
  '=== HARD PROHIBITION ===',
  SEP,
  'You may use ONLY the material above. You may NOT search the DR corpus, the project, the web, or',
  'the filesystem. You may NOT Read, fetch, or request more files. If a judgment requires evidence',
  'not in this context, your verdict for that point is CANNOT ASSESS — name exactly what is missing.',
  'Reaching outside this injected context is a failure of the audit, not a help.',
];
if (isB) {
  prohibitionLines.push(
    '',
    'You have INTENTIONALLY not been given any rule-theory (the differentiator framework, angle',
    'doctrine, or definitions/vocabulary files). You judge only whether each claim is paid for by the',
    'output before it — never whether the reasoning was "right." Do not infer, reconstruct, or ask',
    'for those frameworks.'
  );
}
const prohibition = prohibitionLines.join('\n');

// OPERATOR PROSECUTION NOTES (A only) — sits between the receipt header and THE LAW. Never built
// for B (runNotes stays empty), so B remains blind to operator framing.
const notesSection = (isA && runNotes.length) ? [
  SEP,
  '=== OPERATOR PROSECUTION NOTES (Reviewer A only — withheld from Reviewer B) ===',
  '=== Run-specific charges to fold into your prosecution of the evidence below.       ===',
  SEP,
  '',
  ...runNotes,
  '',
  '',
].join('\n') : '';

const assembled = header + '\n' + notesSection + lawSection + '\n' + evidenceSection + '\n' + prohibition + '\n';

// ---------------------------------------------------------------------------
// Verification manifest
// ---------------------------------------------------------------------------
const manifest = {
  reviewer,
  law: law.map(f => ({ file: f.base, path: f.abs, bytes: f.body.length })),
  evidence: evidence.map(f => ({ file: f.base, path: f.abs, bytes: f.body.length })),
  law_count: law.length,
  evidence_count: evidence.length,
  total_bytes: assembled.length,
  denied
};

// ---------------------------------------------------------------------------
// Emit
// ---------------------------------------------------------------------------
if (typeof opts.out === 'string' && opts.out.length > 0) {
  const outPath = path.resolve(opts.out);
  try {
    fs.mkdirSync(path.dirname(outPath), { recursive: true });
    fs.writeFileSync(outPath, assembled, 'utf8');
    fs.writeFileSync(outPath + '.manifest.json', JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  } catch (e) {
    console.error(`ERROR: cannot write --out path "${outPath}" — ${e.message}`);
    process.exit(2);
  }
  console.error(`[audit-inject] wrote ${assembled.length} chars → ${outPath} ` +
    `(law ${law.length}: ${lawNames}; evidence ${evidence.length}: ${evNames}; denied ${denied.length})`);
  console.error(`[audit-inject] manifest → ${outPath}.manifest.json`);
} else {
  process.stdout.write(assembled);
  console.error(`[audit-inject] emitted ${assembled.length} chars for reviewer=${reviewer} ` +
    `(law ${law.length}: ${lawNames}; evidence ${evidence.length}: ${evNames}; denied ${denied.length})`);
  console.error('[audit-inject] MANIFEST ' + JSON.stringify(manifest));
}

process.exit(0);
