#!/usr/bin/env node
// reddit-extract — link -> verbatim Reddit thread as clean nested markdown (+ raw JSON).
//
// Usage:  node dump.mjs <reddit-thread-url> [outDir]
//   outDir default: current directory. Writes <slug>.md and <slug>.raw.json
//
// Why this works when curl/requests/playwright-goto all 403:
//   Reddit edge-blocks raw .json requests by IP/UA. But a REAL browser loading the
//   HTML thread page succeeds (200). We then call .json + /api/morechildren.json
//   from INSIDE that loaded page (same-origin fetch) — it carries the real browser's
//   TLS fingerprint + cookies, so it passes. The morechildren loop runs until the
//   comment tree is fully expanded (handles 1000+ comment threads).

import { createRequire } from 'module';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const require = createRequire(import.meta.url);

// --- locate playwright across machines/dirs (don't hardcode one node_modules) ---
function loadPlaywright() {
  const candidates = [
    'playwright',
    '/home/kyu3/node_modules/playwright/index.mjs',
    '/home/kyu3/PMF/node_modules/playwright',
    process.env.PLAYWRIGHT_PATH,
  ].filter(Boolean);
  for (const c of candidates) {
    try { return require(c); } catch { /* try next */ }
  }
  throw new Error('playwright not found. Install it or set PLAYWRIGHT_PATH. Tried: ' + candidates.join(', '));
}

// --- args ---
const rawUrl = process.argv[2];
const outDir = process.argv[3] || process.cwd();
// Accept any reddit link form that points at a SPECIFIC post — a thread permalink, a redd.it short
// link, or a /s/ share link. Reject subreddit/user/search/home pages up front so we never silently
// grab a feed's top post. Host/query variants (old./m./np., ?utm_) are fine; the browser resolves them.
const isReddit = /(reddit\.com|redd\.it)\//i.test(rawUrl || '');
const isThread = /\/comments\/[a-z0-9]+/i.test(rawUrl || '');
const isShare  = /\/r\/[^/]+\/s\/[a-z0-9]+/i.test(rawUrl || '');
const isShort  = /(^|\/\/)redd\.it\/[a-z0-9]+/i.test(rawUrl || '');
if (!rawUrl || !isReddit || !(isThread || isShare || isShort)) {
  console.error('Usage: node dump.mjs <reddit-url> [outDir]');
  console.error('  Give a link to a SPECIFIC post: a thread permalink, a redd.it short link, or a /s/ share link.');
  console.error('  Accepts old./m./np. hosts and ?utm_ junk. Subreddit / user / search / home pages are not threads.');
  console.error('  outDir is positional (created if missing; defaults to cwd).');
  process.exit(2);
}

const { chromium } = loadPlaywright();
const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
});
const page = await ctx.newPage();

// Load whatever was pasted — browser follows redd.it / /s/ share-link / mobile redirects natively.
await page.goto(rawUrl, { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(1500);

// Resolve the canonical thread permalink from the loaded page (zero guesswork on URL form).
// og:url FIRST — on a thread page it's the canonical permalink; on a subreddit/user feed it's the
// feed URL (no /comments/), so we correctly reject instead of grabbing a feed post's shreddit-post.
const canonical = await page.evaluate(() => {
  const og = document.querySelector('meta[property="og:url"]')?.getAttribute('content');
  if (og) { try { return new URL(og).pathname; } catch { /* fall through */ } }
  const fromAttr = document.querySelector('shreddit-post')?.getAttribute('permalink');
  if (fromAttr) return fromAttr;
  return location.pathname;
});
const PERMALINK = (canonical || '').replace(/\/+$/, '') + '/';
if (!/\/comments\/[a-z0-9]+\//i.test(PERMALINK)) {
  console.error('Resolved link is not a specific Reddit thread (no /comments/<id>/): ' + PERMALINK);
  console.error('Pass a link to a post/thread, not a subreddit, user, or search page.');
  await browser.close();
  process.exit(2);
}
const THREAD_URL = 'https://www.reddit.com' + PERMALINK;

// Normalize to the www origin: old./m./np. hosts can block the same-origin .json (403). The jget
// retry below absorbs any hydration race from this re-navigation.
if (new URL(page.url()).host !== 'www.reddit.com') {
  await page.goto(THREAD_URL, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);
}
const idMatch = PERMALINK.match(/\/comments\/([a-z0-9]+)\//i);
const postId = idMatch ? idMatch[1] : 'thread';
const subMatch = PERMALINK.match(/\/r\/([^/]+)\//);
const slugMatch = PERMALINK.match(/\/comments\/[a-z0-9]+\/([^/]+)\//i);
const fileBase = `r-${subMatch ? subMatch[1] : 'x'}-${postId}-${slugMatch ? slugMatch[1] : 'thread'}`.slice(0, 120);

// same-origin JSON GET from inside the real browser page. Paths are relative, so they resolve
// against whatever host we landed on (www/old/m all serve .json) — no re-navigation needed.
// Retries once on a transient "Failed to fetch" (hydration can abort an in-flight request).
async function jget(path) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await page.evaluate(async (p) => {
        const r = await fetch(p, { headers: { Accept: 'application/json' } });
        return { status: r.status, text: await r.text() };
      }, path);
    } catch (e) {
      if (attempt === 2) throw e;
      await page.waitForTimeout(1000);
    }
  }
}

// 1. main listing
const main = await jget(PERMALINK + '.json?limit=500&raw_json=1');
if (main.status !== 200) { console.error('main listing fetch failed:', main.status); await browser.close(); process.exit(1); }
const data = JSON.parse(main.text);
const post = data[0].data.children[0].data;
const linkId = post.name; // t3_xxx
const topComments = data[1].data.children;

// 2. harvest "more" node child ids
let moreIds = [];
function harvestMore(nodes) {
  for (const n of nodes) {
    if (n.kind === 'more') moreIds.push(...(n.data.children || []));
    else if (n.data?.replies?.data) harvestMore(n.data.replies.data.children);
  }
}
harvestMore(topComments);

// 3. resolve morechildren until dry (results can themselves yield more)
const resolved = [];
let round = 0;
while (moreIds.length && round < 80) {
  round++;
  const batch = moreIds.splice(0, 100);
  const res = await jget(`/api/morechildren.json?api_type=json&link_id=${linkId}&children=${batch.join(',')}&raw_json=1&limit_children=false`);
  if (res.status !== 200) { console.error('morechildren', res.status, 'round', round); continue; }
  let things;
  try { things = JSON.parse(res.text).json.data.things; } catch { console.error('parse fail round', round); continue; }
  for (const t of things) {
    if (t.kind === 'more') moreIds.push(...(t.data.children || []));
    else resolved.push(t.data);
  }
  await page.waitForTimeout(600);
}
await browser.close();

// 4. reassemble unified tree
const byId = {};
const childrenOf = {};
const ensure = (p) => (childrenOf[p] ||= []);

function nodeFrom(d) {
  return {
    author: d.author, body: d.body, score: d.score, name: d.name,
    created: d.created_utc, edited: d.edited, permalink: d.permalink, replies: [],
  };
}
function ingest(nodes, parent) {
  for (const n of nodes) {
    if (n.kind === 'more') continue;
    const d = n.data;
    const node = nodeFrom(d);
    byId[d.name] = node;
    ensure(parent).push(node);
    if (d.replies?.data) ingest(d.replies.data.children, d.name);
  }
}
ingest(topComments, linkId);
for (const d of resolved) {
  const node = byId[d.name] || nodeFrom(d);
  byId[d.name] = node;
  ensure(d.parent_id).push(node);
}
for (const [parent, kids] of Object.entries(childrenOf)) {
  if (byId[parent]) byId[parent].replies = kids;
}
const roots = childrenOf[linkId] || [];

// 5. render clean nested markdown (rich enough that the JSON is never needed for reading)
function iso(utc) { return utc ? new Date(utc * 1000).toISOString().slice(0, 16).replace('T', ' ') + 'Z' : ''; }
let total = 0;
function render(node, depth, path) {
  total++;
  const ind = '> '.repeat(depth);
  const author = node.author || '[deleted]';
  const score = node.score ?? '?';
  const when = iso(node.created);
  const ed = node.edited ? ' · edited' : '';
  const link = node.permalink ? ` · https://www.reddit.com${node.permalink}` : '';
  const body = (node.body || '[deleted]').trim().split('\n').map((l) => ind + l).join('\n');
  let out = `\n${ind}**${path} u/${author}** · ${score} pts · ${when}${ed}${link}\n${ind}\n${body}\n`;
  node.replies.forEach((c, i) => { out += render(c, depth + 1, `${path}${i + 1}.`); });
  return out;
}

let md = `# ${post.title}\n\n`;
md += `**Subreddit:** r/${post.subreddit} | **OP:** u/${post.author} | **Score:** ${post.score} | **Comments (reported):** ${post.num_comments} | **Posted:** ${iso(post.created_utc)}\n`;
md += `**URL:** ${THREAD_URL}\n\n---\n\n## Original Post\n\n`;
md += post.selftext?.trim() ? post.selftext.trim() : '*(no text body — link/image post)*';
if (post.url && !post.url.includes('/comments/')) md += `\n\n**Link:** ${post.url}`;
md += `\n\n---\n\n## Comments\n`;
roots.forEach((r, i) => { md += render(r, 0, `${i + 1}.`); });
md += `\n\n---\n*Extracted ${total} comments verbatim (post reports ${post.num_comments}; gap = deleted/removed). ${round} morechildren round(s).*\n`;

mkdirSync(outDir, { recursive: true });
const mdPath = join(outDir, fileBase + '.md');
const jsonPath = join(outDir, fileBase + '.raw.json');
writeFileSync(mdPath, md);
writeFileSync(jsonPath, main.text);
console.log(`extracted ${total} comments (reported ${post.num_comments}) in ${round} morechildren round(s)`);
console.log('markdown: ' + mdPath);
console.log('raw json: ' + jsonPath);
