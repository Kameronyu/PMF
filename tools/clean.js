#!/usr/bin/env node
// tools/clean.js
// Regex-dumb HTML→clean-markdown stripper.
// Reads corpus/<slug>/raw/*.html, writes corpus/<slug>/clean/<page>.md.
// Deterministic script — not an agent (CLAUDE.md one-job-per-brick law).
// ~30 lines of regex (capability_inventory.md locked-decision #6 — dumb first, swappable later).
//
// Usage:
//   node tools/clean.js [--in=./corpus] [--out=./corpus] [--help]
//
// Output:
//   corpus/<slug>/clean/<page>.md  (pure copy with provenance header)
//   corpus/_clean-log.txt

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log([
    'Usage: node tools/clean.js [--in=./corpus] [--out=./corpus] [--help]',
    '',
    'Options:',
    '  --in=<dir>    Corpus input base dir (default: ./corpus)',
    '  --out=<dir>   Corpus output base dir (default: same as --in)',
    '  --help        Print this help and exit',
    '',
    'Reads:  <in>/<slug>/raw/*.html',
    'Writes: <out>/<slug>/clean/<page>.md',
    'Log:    <out>/_clean-log.txt',
  ].join('\n'));
  process.exit(0);
}

const inBase = opts.in || './corpus';
const outBase = opts.out || inBase;

function stripToText(html) {
  let s = html;
  // Remove <script ...>...</script> blocks entirely (single-line and multi-line, non-greedy)
  s = s.replace(/<script[\s\S]*?<\/script>/gi, '');
  // Remove <style ...>...</style> blocks entirely
  s = s.replace(/<style[\s\S]*?<\/style>/gi, '');
  // Remove <nav ...>...</nav> blocks (common chrome/boilerplate)
  s = s.replace(/<nav[\s\S]*?<\/nav>/gi, '');
  // Remove <header ...>...</header> blocks
  s = s.replace(/<header[\s\S]*?<\/header>/gi, '');
  // Remove <footer ...>...</footer> blocks
  s = s.replace(/<footer[\s\S]*?<\/footer>/gi, '');
  // Strip all remaining HTML tags (attributes and all)
  s = s.replace(/<[^>]+>/g, ' ');
  // Decode common HTML entities
  s = s
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');
  // Collapse runs of blank lines and trailing whitespace
  s = s.replace(/[ \t]+$/gm, '');
  s = s.replace(/\n{3,}/g, '\n\n');
  return s.trim();
}

// Discover all raw HTML files: corpus/<slug>/raw/*.html
const results = [];
let slugDirs;
try {
  slugDirs = fs.readdirSync(inBase).filter(name => {
    // skip log files and hidden dirs
    if (name.startsWith('_') || name.startsWith('.')) return false;
    const rawDir = path.join(inBase, name, 'raw');
    return fs.existsSync(rawDir) && fs.statSync(rawDir).isDirectory();
  });
} catch (e) {
  console.error(`[clean] ERROR: cannot read corpus dir ${inBase} — ${e.message}`);
  process.exit(1);
}

for (const slug of slugDirs) {
  const rawDir = path.join(inBase, slug, 'raw');
  const cleanDir = path.join(outBase, slug, 'clean');
  let htmlFiles;
  try {
    htmlFiles = fs.readdirSync(rawDir).filter(f => f.endsWith('.html'));
  } catch (e) {
    const line = `[ERROR] ${slug}/raw: ${e.message}`;
    results.push(line);
    console.log(line);
    continue;
  }

  for (const htmlFile of htmlFiles) {
    const rawPath = path.join(rawDir, htmlFile);
    const mdFile = htmlFile.replace(/\.html$/, '.md');
    const cleanPath = path.join(cleanDir, mdFile);

    try {
      const html = fs.readFileSync(rawPath, 'utf8');
      const text = stripToText(html);
      const provenance = `<!-- source: ${rawPath} | cleaned: ${new Date().toISOString()} -->`;
      const output = provenance + '\n\n' + text;

      fs.mkdirSync(cleanDir, { recursive: true });
      fs.writeFileSync(cleanPath, output);

      const line = `${slug}/${mdFile}: ok (${text.length} chars)`;
      results.push(line);
      console.log(line);
    } catch (e) {
      // Per-file try/catch — one bad file doesn't abort the batch (T-01-05 mitigated)
      const line = `[ERROR] ${slug}/${htmlFile}: ${e.message}`;
      results.push(line);
      console.log(line);
    }
  }
}

try {
  fs.mkdirSync(outBase, { recursive: true });
  fs.writeFileSync(path.join(outBase, '_clean-log.txt'), results.join('\n') + '\n');
} catch (_) {}

console.log(`[clean] done — ${slugDirs.length} slug dirs scanned`);
