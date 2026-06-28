#!/usr/bin/env node
// funnel-clean.js
// Section-marked verbatim cleaner for funnel_package landing_page_body.
//
// Deterministic script — NOT an agent (CLAUDE.md one-job-per-brick law).
// This is the "dumb regex, swappable later" brick (spec §5, D-11):
//   - Reads landing_page_body from funnel_package JSON files
//   - Strips chrome (script/style/nav/header/footer) via regex
//   - Inserts structural section markers on heading/block boundaries
//     (both HTML <h1-h4> tags AND markdown ATX headings like ## Heading)
//   - Preserves on-page review blocks verbatim, tagged review_language
//   - Does NOT decide belief boundaries (that is the Section Analyzer's job)
//   - Does NOT classify, interpret, or rewrite copy
//
// Usage:
//   node tools/funnel-clean.js <funnel-package.json> [--out=<dir>] [--help]
//   node tools/funnel-clean.js ./funnels/ [--out=./funnels-clean] [--help]
//
// Input: one funnel_package JSON file (or a directory of them) produced by funnel-assemble.js
// Output: <out>/<funnel_id>-clean.json with:
//   { funnel_id, competitor, landing_page_url, cleaned_body (section-marked), review_blocks[], provenance }
//
// Threat mitigations:
//   T-03-07 (ReDoS): Bounded/linear regex patterns; no nested unbounded quantifiers on untrusted input.
//                    Input size capped before regex (MAX_BODY_BYTES).
//   T-03-08 (prompt injection): Content preserved verbatim by design (§6c). This script only marks +
//                               preserves; it never executes the content. Analyzer boundary mitigates
//                               downstream injection.

'use strict';

const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------------------
// CLI arg parse (positional + --flag=val — canonical adlib-one.js pattern)
// ---------------------------------------------------------------------------
const rawArgs = process.argv.slice(2);
const flagArgs = rawArgs.filter(a => a.startsWith('--'));
const posArgs  = rawArgs.filter(a => !a.startsWith('--'));

const opts = Object.fromEntries(
  flagArgs.map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log(
    'Usage: node tools/funnel-clean.js <funnel-package.json|dir> [--out=<dir>] [--help]\n' +
    '\n' +
    'Reads landing_page_body from funnel_package(s), strips chrome, inserts structural\n' +
    'section markers, preserves review blocks tagged review_language. Stays dumb —\n' +
    'does NOT decide belief boundaries (that is the Section Analyzer\'s job).\n' +
    '\n' +
    '  <funnel-package.json>  Path to a single funnel_package JSON, or a directory\n' +
    '                         containing funnel_package JSON files (*-funnel.json or *.json)\n' +
    '  --out                  Output directory (default: same as input dir / ./funnels-clean)\n' +
    '  --help                 Show this help\n' +
    '\n' +
    'Output per funnel: <out>/<funnel_id>-clean.json\n' +
    '  { funnel_id, competitor, landing_page_url, cleaned_body, review_blocks[], provenance }\n'
  );
  process.exit(0);
}

const inputPath = posArgs[0];
if (!inputPath) {
  console.error('usage: node tools/funnel-clean.js <funnel-package.json|dir> [--out=<dir>]');
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

// Cap input body size before regex to prevent pathological-length processing (T-03-07).
const MAX_BODY_BYTES = 2_000_000; // 2 MB — ample for any realistic LP

// Structural section marker token emitted between major blocks.
// Chosen to be distinctive without being LLM-specific; the Section Analyzer reads these.
const SECTION_MARKER = '\n\n[SECTION]\n\n';

// Review block marker token — preserved verbatim for verbatim_refs[] tagged review_language.
const REVIEW_OPEN  = '[REVIEW_LANGUAGE_START]';
const REVIEW_CLOSE = '[REVIEW_LANGUAGE_END]';

// ---------------------------------------------------------------------------
// stripToText(html) — core from clean.js (lines 45-71), extended for funnel use.
// Kills script/style/nav/header/footer, strips remaining tags, decodes entities,
// collapses whitespace. EXTENDS clean.js by:
//   1. Emitting SECTION_MARKER on heading/major-block boundaries
//   2. Preserving review blocks verbatim tagged review_language
//   3. Bounded/linear regex only (T-03-07)
//
// This is STRUCTURAL marking only. The cleaner stays dumb — it inserts markers
// at HTML heading tags and major visual boundaries, and preserves review-looking
// blocks. It does NOT decide what a "belief" is. That is the Section Analyzer's job.
// ---------------------------------------------------------------------------
function extractReviewBlocks(html) {
  // Identify review block patterns before stripping HTML.
  // These patterns target common on-page review containers; captured verbatim.
  // Heuristics (not perfect — the Analyzer gets the full cleaned body anyway):
  //   - KS/IGG style: <div class="*review*">, <div class="*testimonial*">
  //   - Star ratings with accompanying text
  //   - Quoted text blocks with attribution
  // Bounded patterns only — no nested unbounded quantifiers (T-03-07).
  const reviewBlocks = [];

  // Pattern 1: common review/testimonial container class attributes
  const reviewContainerRe = /<[a-z][a-z0-9]*[^>]*class="[^"]{0,200}(?:review|testimonial|customer-quote|user-review|star-rating)[^"]{0,200}"[^>]*>([\s\S]{0,5000}?)<\/[a-z][a-z0-9]*>/gi;
  let m;
  while ((m = reviewContainerRe.exec(html)) !== null) {
    // Strip tags from captured block to get text
    const blockText = m[1]
      .replace(/<[^>]{0,500}>/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (blockText.length > 20) { // skip trivially empty captures
      reviewBlocks.push(blockText);
    }
  }

  // Pattern 2: blockquote elements (often used for testimonials/reviews)
  const blockquoteRe = /<blockquote[^>]{0,200}>([\s\S]{0,3000}?)<\/blockquote>/gi;
  while ((m = blockquoteRe.exec(html)) !== null) {
    const blockText = m[1]
      .replace(/<[^>]{0,500}>/g, ' ')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    if (blockText.length > 10) {
      reviewBlocks.push(blockText);
    }
  }

  return reviewBlocks;
}

function stripToText(html) {
  // Cap input size before any regex (T-03-07)
  let s = html.slice(0, MAX_BODY_BYTES);

  // Remove <script>...</script> blocks entirely (bounded alternation, non-greedy)
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove <style>...</style> blocks entirely
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove <nav>...</nav> blocks (common chrome/boilerplate)
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  // Remove <header>...</header> blocks
  s = s.replace(/<header[\s\S]*?<\/header>/gi, '');
  // Remove <footer>...</footer> blocks
  s = s.replace(/<footer[\s\S]*?<\/footer>/gi, '');

  // Insert section markers before heading tags — structural only, not belief boundaries.
  // The Section Analyzer uses these as orientation points when cutting belief-units.
  // Headings h1-h4 reliably indicate major section transitions.
  s = s.replace(/<h[1-4][^>]{0,200}>/gi, SECTION_MARKER + '$&');

  // Also insert a section marker before <section>, <article>, <main>, <aside> elements
  // (common LP structural containers)
  s = s.replace(/<(?:section|article|main|aside)[^>]{0,200}>/gi, SECTION_MARKER + '$&');

  // Strip all remaining HTML tags (attributes and all). Bounded tag body (500 chars max).
  s = s.replace(/<[^>]{0,500}>/g, ' ');

  // Insert section markers before markdown ATX headings (D-01).
  // Markdown ATX headings (## Heading) are plain text — they survive HTML tag-stripping and
  // are never caught by the HTML heading/block passes above. The clean/home.md fallback path
  // (run-notes §3 Option B) otherwise produces a flat body with zero [SECTION] markers.
  // This makes BOTH input paths (raw HTML and clean markdown) emit section markers.
  // Runs AFTER the tag-strip (WR-01): tag-strip removes whole tags including attribute values,
  // so a stray line-start '##' inside an HTML attribute (e.g. aria-label="## x") can't trigger
  // a spurious marker. Markdown bodies carry no tags, so the tag-strip is a no-op for them and
  // their headings survive intact to be marked here.
  // Regex: line-anchored, bounded — /^#{1,6}[ \t]+/gm matches start-of-line ATX headings only.
  // A mid-line '#' (e.g. "issue #47") does NOT match because '^' requires start-of-line.
  // ReDoS-safe: no nested/unbounded quantifiers — one linear pass (T-03-07).
  s = s.replace(/^#{1,6}[ \t]+/gm, SECTION_MARKER + '$&');

  // Decode common HTML entities
  s = s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&hellip;/g, '…');

  // Collapse runs of blank lines and trailing whitespace per line
  s = s.replace(/[ \t]+$/gm, '');
  s = s.replace(/\n{4,}/g, '\n\n\n');

  // Deduplicate repeated SECTION_MARKER sequences that may appear from nested containers
  s = s.replace(/(\[SECTION\]\s*){2,}/g, '[SECTION]\n\n');

  return s.trim();
}

// ---------------------------------------------------------------------------
// cleanFunnelPackage(pkg, sourcePath) — main transform per funnel
// Returns: { funnel_id, competitor, landing_page_url, cleaned_body, review_blocks, provenance }
// ---------------------------------------------------------------------------
function cleanFunnelPackage(pkg, sourcePath) {
  const funnel_id = pkg.funnel_id || path.basename(sourcePath, '.json');
  const landing_page_body = pkg.landing_page_body || '';

  if (!landing_page_body) {
    return {
      funnel_id,
      competitor: pkg.competitor || null,
      landing_page_url: pkg.landing_page_url || null,
      cleaned_body: '',
      review_blocks: [],
      _note: 'landing_page_body was empty — nothing to clean',
      provenance: `<!-- source: ${sourcePath} | cleaned: ${new Date().toISOString()} -->`,
    };
  }

  // Extract review blocks BEFORE stripping (operates on raw HTML for container-class detection)
  const review_blocks = extractReviewBlocks(landing_page_body);

  // Strip chrome and mark structure
  const cleaned = stripToText(landing_page_body);

  // Append review blocks section to cleaned body, tagged for verbatim_refs[] downstream
  // Per spec §6c: capture into verbatim_refs[] tagged review_language; do NOT score or mine.
  let cleaned_body = cleaned;
  if (review_blocks.length > 0) {
    cleaned_body +=
      `\n\n${SECTION_MARKER}${REVIEW_OPEN}\n` +
      review_blocks.map((b, i) => `[REVIEW ${i + 1}]\n${b}`).join('\n\n') +
      `\n${REVIEW_CLOSE}`;
  }

  return {
    funnel_id,
    competitor: pkg.competitor || null,
    source_type: pkg.source_type || null,
    landing_page_url: pkg.landing_page_url || null,
    cleaned_body,
    review_blocks,  // raw extracted blocks for downstream verbatim_refs[] assembly
    _review_language_note: 'review_language blocks preserved verbatim per spec §6c. Tag as review_language in verbatim_refs[]. Do NOT score, mine, or classify these. That is VOC research (deferred).',
    provenance: `<!-- source: ${sourcePath} | cleaned: ${new Date().toISOString()} -->`,
  };
}

// ---------------------------------------------------------------------------
// Discover input funnel packages (single file or directory)
// ---------------------------------------------------------------------------
const results = [];
let funnelFiles = [];

const stat = fs.statSync(inputPath);
if (stat.isDirectory()) {
  const outDir = opts.out || path.join(inputPath, '..', 'funnels-clean');
  fs.mkdirSync(outDir, { recursive: true });

  try {
    funnelFiles = fs.readdirSync(inputPath)
      .filter(f => f.endsWith('.json') && !f.startsWith('_'))
      .map(f => path.join(inputPath, f));
  } catch (e) {
    console.error(`[funnel-clean] ERROR: cannot read directory ${inputPath} — ${e.message}`);
    process.exit(1);
  }

  // Per-funnel try/catch batch — one bad funnel never aborts the batch (clean.js 106-124 pattern)
  for (const funnelFile of funnelFiles) {
    try {
      const raw = fs.readFileSync(funnelFile, 'utf8');
      const pkg = JSON.parse(raw);
      const cleaned = cleanFunnelPackage(pkg, funnelFile);
      const outFile = path.join(outDir, `${cleaned.funnel_id}-clean.json`);
      fs.writeFileSync(outFile, JSON.stringify(cleaned, null, 2));
      const line = `${cleaned.funnel_id}: ok (body=${cleaned.cleaned_body.length} chars, reviews=${cleaned.review_blocks.length})`;
      results.push(line);
      console.log(line);
    } catch (e) {
      const line = `[ERROR] ${path.basename(funnelFile)}: ${e.message}`;
      results.push(line);
      console.log(line);
    }
  }

  // Write sidecar log
  try {
    fs.writeFileSync(path.join(outDir, '_funnel-clean-log.txt'), results.join('\n') + '\n');
  } catch (_) {}

  console.log(`[funnel-clean] done — ${funnelFiles.length} funnel(s) processed`);

} else {
  // Single file mode
  const outDir = opts.out || path.dirname(inputPath);

  try {
    const raw = fs.readFileSync(inputPath, 'utf8');
    const pkg = JSON.parse(raw);
    const cleaned = cleanFunnelPackage(pkg, inputPath);

    fs.mkdirSync(outDir, { recursive: true });
    const outFile = path.join(outDir, `${cleaned.funnel_id}-clean.json`);
    fs.writeFileSync(outFile, JSON.stringify(cleaned, null, 2));

    console.log(`[funnel-clean] ${cleaned.funnel_id}: ok (body=${cleaned.cleaned_body.length} chars, reviews=${cleaned.review_blocks.length})`);
    console.log(`[funnel-clean] output: ${outFile}`);
  } catch (e) {
    console.error(`[funnel-clean] ERROR: ${e.message}`);
    process.exit(1);
  }
}
