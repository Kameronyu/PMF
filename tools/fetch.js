#!/usr/bin/env node
// tools/fetch.js
// Per-brand Playwright fetch: homepage + fixed LP-hunt URL-path patterns + raw HTML write.
// Deterministic script — not an agent (CLAUDE.md one-job-per-brick law).
//
// Usage:
//   node tools/fetch.js [--brands=./brands.json] [--out=./corpus] [--help]
//
// Output:
//   corpus/<slug>/raw/home.html
//   corpus/<slug>/raw/<path-slug>.html
//   corpus/_fetch-log.txt

const { chromium } = require('playwright');
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
    'Usage: node tools/fetch.js [--brands=./brands.json] [--out=./corpus] [--help]',
    '',
    'Options:',
    '  --brands=<path>   Path to brands.json (default: ./brands.json)',
    '  --out=<dir>       Output base dir (default: ./corpus)',
    '  --help            Print this help and exit',
    '',
    'Output tree: <out>/<slug>/raw/<page>.html',
    'Log:         <out>/_fetch-log.txt',
  ].join('\n'));
  process.exit(0);
}

const brandsPath = opts.brands || './brands.json';
const baseOut = opts.out || './corpus';

// Fixed LP-hunt URL-path patterns (deterministic, not agent-chosen — spec §scaffold item 1)
const LP_PATH_PATTERNS = [
  '/clp/', '/lp/', '/pages/', '/campaigns/',
  '/education', '/students', '/focus', '/parents',
  '/press', '/blog', '/business',
];

// LP-hunt query strings for future search-engine integration (logged, not fetched in this pass)
// Per JIT principle: URL-path patterns are the minimum for the debug run.
// Query set preserved here for traceability (spec LP-hunt template verbatim):
//   <brand> students|college|back-to-school
//   <brand> focus|distraction-free
//   <brand> calm|digital-wellbeing|screen-time
//   <brand> parents|kids|family
//   <brand> writers|journaling|note-taking
//   <brand> professionals|business|work
//   <brand> education|teachers
//   <brand> faith|Bible

function slugifyPath(urlPath) {
  if (!urlPath || urlPath === '/') return 'home';
  return urlPath.replace(/^\//, '').replace(/\/$/, '').replace(/[^a-z0-9]+/gi, '_') || 'home';
}

async function fetchPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

  // CF-clear wait loop (verbatim from crowdfund-fetch.js L90-94)
  for (let i = 0; i < 15; i++) {
    const t = await page.title().catch(() => '');
    if (!t.match(/just a moment|cloudflare|checking your browser/i)) break;
    await page.waitForTimeout(1000);
  }

  // Let JS-rendered content settle
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});

  // Expand collapsed copy (verbatim from crowdfund-fetch.js L99-127)
  const expandSelectors = [
    'button:has-text("Read more")',
    'button:has-text("Show more")',
    'button:has-text("Load more")',
    'a:has-text("Read more")',
    '[aria-label="Read more"]',
  ];
  for (const sel of expandSelectors) {
    try {
      const btns = await page.$$(sel);
      for (const b of btns) {
        await b.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(400);
      }
    } catch (_) {}
  }

  const html = await page.content();
  const title = await page.title().catch(() => '');
  return { html, title };
}

function writeRaw(outDir, filename, html, sourceUrl, title) {
  fs.mkdirSync(outDir, { recursive: true });
  // Write raw HTML (no provenance header in the html file — clean.js adds its own header to clean output)
  fs.writeFileSync(path.join(outDir, filename), html);
  // Write a sidecar provenance file alongside the raw HTML
  fs.writeFileSync(
    path.join(outDir, filename.replace(/\.html$/, '.meta.txt')),
    `URL: ${sourceUrl}\nTITLE: ${title}\nFETCHED: ${new Date().toISOString()}\n`
  );
}

(async () => {
  let brandsData;
  try {
    brandsData = JSON.parse(fs.readFileSync(brandsPath, 'utf8'));
  } catch (e) {
    console.error(`[fetch] ERROR: cannot read brands.json at ${brandsPath} — ${e.message}`);
    process.exit(1);
  }

  const brands = brandsData.brands || [];
  if (!brands.length) {
    console.error('[fetch] ERROR: brands array is empty or missing in brands.json');
    process.exit(1);
  }

  fs.mkdirSync(baseOut, { recursive: true });

  const browser = await chromium.launch({
    headless: true,
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
    ],
  });

  const context = await browser.newContext({
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36',
    viewport: { width: 1440, height: 900 },
    locale: 'en-US',
    timezoneId: 'America/New_York',
    extraHTTPHeaders: {
      'Accept-Language': 'en-US,en;q=0.9',
    },
  });

  // Light fingerprint masking (verbatim from crowdfund-fetch.js L73-77)
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  });

  const results = [];

  // Per-brand loop (resilient batch — adlib-sweep.js pattern)
  for (const brand of brands) {
    const { slug, url } = brand;
    if (!slug || !url) {
      const line = `[SKIP] slug="${slug}" url="${url}" — missing slug or url`;
      results.push(line);
      console.log(line);
      continue;
    }

    const rawDir = path.join(baseOut, slug, 'raw');
    const fetched = [];
    const errors = [];

    // Reuse one page per brand to avoid browser overhead
    const page = await context.newPage();

    try {
      // (a) Fetch homepage
      try {
        const { html, title } = await fetchPage(page, url);
        writeRaw(rawDir, 'home.html', html, url, title);
        fetched.push('home');
      } catch (e) {
        errors.push(`home: ${e.message}`);
      }

      // (b) LP-hunt: try fixed URL-path patterns off the brand origin
      let origin;
      try {
        origin = new URL(url).origin;
      } catch (_) {
        origin = url.replace(/\/+$/, '');
      }

      for (const pattern of LP_PATH_PATTERNS) {
        const lpUrl = origin + pattern;
        const filename = slugifyPath(pattern) + '.html';
        try {
          const { html, title } = await fetchPage(page, lpUrl);
          writeRaw(rawDir, filename, html, lpUrl, title);
          fetched.push(pattern.replace(/^\//, ''));
        } catch (e) {
          // Absence of a page is data — log it, don't crash
          errors.push(`${pattern}: ${e.message.slice(0, 80)}`);
        }
      }
    } finally {
      await page.close();
    }

    const line = `${slug}: fetched=[${fetched.join(',')}] errors=${errors.length}${errors.length ? ' [' + errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : '') + ']' : ''}`;
    results.push(line);
    console.log(line);
  }

  await browser.close();

  fs.writeFileSync(path.join(baseOut, '_fetch-log.txt'), results.join('\n') + '\n');
  console.log(`[fetch] done — ${brands.length} brands processed`);
})();
