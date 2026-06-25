#!/usr/bin/env node
// tools/fetch.js
// Per-brand Playwright fetch: homepage + brief-driven LP-hunt URL-path patterns + raw HTML write
// + Google Trends ~5yr demand_trend fetch per brand written back into brands.json.
// Deterministic script — not an agent (CLAUDE.md one-job-per-brick law).
//
// Usage:
//   node tools/fetch.js [--brands=./brands.json] [--out=./corpus] [--brief=./bet-brief.md] [--help]
//
// Output:
//   corpus/<slug>/raw/home.html
//   corpus/<slug>/raw/<path-slug>.html
//   corpus/_fetch-log.txt
//   brands.json  (enriched in-place with per-brand demand_trend)

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
    'Usage: node tools/fetch.js [--brands=./brands.json] [--out=./corpus] [--brief=./bet-brief.md] [--help]',
    '',
    'Options:',
    '  --brands=<path>   Path to brands.json (default: ./brands.json)',
    '  --out=<dir>       Output base dir (default: ./corpus)',
    '  --brief=<path>    Path to bet-brief.md with PIPELINE INPUTS block (default: ./bet-brief.md)',
    '                    If absent or malformed the default LP-path list is used (graceful fallback).',
    '  --help            Print this help and exit',
    '',
    'Output tree: <out>/<slug>/raw/<page>.html',
    'Log:         <out>/_fetch-log.txt',
    'demand_trend written back into brands.json per-brand row.',
  ].join('\n'));
  process.exit(0);
}

const brandsPath = opts.brands || './brands.json';
const baseOut = opts.out || './corpus';
const briefPath = opts.brief || './bet-brief.md';

// ---------------------------------------------------------------------------
// D-16: DEFAULT LP-HUNT PATHS (named constant — fallback when no brief present)
// The LP-hunt set is FIXED for the run (not agent-chosen mid-run). When a bet brief
// with a PIPELINE INPUTS block is present, its LP-hunt terms replace this list.
// The contents are a per-run planning INPUT from the brief; the determinism principle
// (fixed-per-run, never dynamically chosen by an agent mid-run) is preserved.
// ---------------------------------------------------------------------------
const DEFAULT_LP_PATHS = [
  '/clp/', '/lp/', '/pages/', '/campaigns/',
  '/education', '/students', '/focus', '/parents',
  '/press', '/blog', '/business',
];

// ---------------------------------------------------------------------------
// D-16: parsePipelineInputs(briefPath)
// Tolerant parser — reads the bet brief's fenced PIPELINE INPUTS block.
// A missing brief, missing PIPELINE INPUTS block, or malformed lists are all
// handled gracefully: returns sensible defaults and logs a warning; NEVER throws.
// ---------------------------------------------------------------------------
function parsePipelineInputs(briefFilePath) {
  const defaults = {
    lpPaths: DEFAULT_LP_PATHS,
    lpQueries: [],
    comparableSeeds: [],
    trendEnabled: true,
  };

  try {
    if (!fs.existsSync(briefFilePath)) {
      console.warn(`[fetch] WARN: brief not found at ${briefFilePath} — using default LP-path list`);
      return defaults;
    }

    const text = fs.readFileSync(briefFilePath, 'utf8');

    // Extract the PIPELINE INPUTS section. It can be a markdown section (## PIPELINE INPUTS)
    // or a fenced code block whose first line is PIPELINE INPUTS.
    // Read until the next top-level heading or end-of-file.
    const pipelineMatch = text.match(
      /(?:^|\n)(?:```+\s*PIPELINE INPUTS\s*\n|##\s*PIPELINE INPUTS[^\n]*\n)([\s\S]*?)(?:\n```+|\n##\s|\n#\s|$)/
    );

    if (!pipelineMatch) {
      console.warn('[fetch] WARN: no PIPELINE INPUTS block found in brief — using default LP-path list');
      return defaults;
    }

    const block = pipelineMatch[1];

    // Parse a named subsection out of the block.
    // Each subsection ends at the next ### or ## heading, or end of block.
    function extractSection(blockText, heading) {
      const re = new RegExp(
        '###\\s*' + heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '[^\\n]*\\n([\\s\\S]*?)(?=\\n###|\\n##|$)'
      );
      const m = blockText.match(re);
      return m ? m[1] : '';
    }

    // Parse bullet lines from a section, stripping leading - or * markers.
    // Skips blockquote lines (>) and heading lines (#) — they are notes, not data.
    function parseBullets(sectionText) {
      return sectionText
        .split('\n')
        .map(l => l.replace(/^\s*[-*]\s*/, '').trim())
        .filter(l => l.length > 0 && !l.startsWith('>') && !l.startsWith('#'));
    }

    // LP-hunt query terms: bullets that look like URL paths go to lpPaths;
    // everything else goes to lpQueries (search keywords for future use).
    const lpSection = extractSection(block, 'LP-hunt query terms');
    const lpBullets = parseBullets(lpSection);

    const lpPaths = lpBullets.filter(t => t.startsWith('/') || t.startsWith('http'));
    const lpQueries = lpBullets.filter(t => !t.startsWith('/') && !t.startsWith('http'));

    // If the brief supplied URL-path patterns use them; otherwise fall back to DEFAULT_LP_PATHS.
    const resolvedLpPaths = lpPaths.length > 0 ? lpPaths : DEFAULT_LP_PATHS;

    // Comparable-bet seed brands (parsed but not consumed by fetch.js — reserved for Finder).
    const seedSection = extractSection(block, 'Comparable-bet seed brands');
    const comparableSeeds = parseBullets(seedSection);

    // Trend source toggle — treat "off", "disabled", "skip", "none" as operator opt-out.
    const trendSection = extractSection(block, 'Trend source');
    const trendText = trendSection.toLowerCase();
    const trendEnabled = !(
      trendText.includes('off') ||
      trendText.includes('disabled') ||
      trendText.includes('skip') ||
      trendText.includes('none')
    );

    return { lpPaths: resolvedLpPaths, lpQueries, comparableSeeds, trendEnabled };

  } catch (err) {
    console.warn(`[fetch] WARN: error parsing brief at ${briefFilePath}: ${err.message} — using defaults`);
    return defaults;
  }
}

// ---------------------------------------------------------------------------
// D-15: fetchTrend(context, term, windowSpec)
// Uses the SAME Playwright context (no new dep) to hit Google Trends for the
// term over a ~5yr window. Returns [{date, value}] or null on failure.
//
// Approach: navigate to the Trends explore page, wait for the widget to render,
// then extract the interest-over-time series from the page HTML via tolerant regex.
// T-01-13: treated as DATA only — JSON.parse / string ops, never eval/Function/exec.
// T-01-04: inherits the existing crowdfund-fetch.js posture (sandboxed headless Chromium).
// ---------------------------------------------------------------------------
async function fetchTrend(context, term, windowSpec) {
  const encodedTerm = encodeURIComponent(term);
  const trendsUrl = `https://trends.google.com/trends/explore?date=today%205-y&q=${encodedTerm}&hl=en`;

  let page;
  try {
    page = await context.newPage();

    // Navigate with CF-clear loop (same pattern as fetchPage)
    await page.goto(trendsUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
    for (let i = 0; i < 15; i++) {
      const t = await page.title().catch(() => '');
      if (!t.match(/just a moment|cloudflare|checking your browser/i)) break;
      await page.waitForTimeout(1000);
    }

    // Wait for the interest-over-time widget to render (uses a deferred XHR)
    await page.waitForTimeout(3000);
    await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1000);

    const html = await page.content();
    return extractTrendSeries(html, term);

  } catch (err) {
    console.warn(`[fetch] WARN: trend fetch failed for "${term}": ${err.message.slice(0, 120)}`);
    return null;
  } finally {
    if (page) await page.close().catch(() => {});
  }
}

// ---------------------------------------------------------------------------
// extractTrendSeries(html, term)
// Tolerant regex parser for Google Trends HTML.
// Tries three patterns in order; returns [{date, value}] or null.
// T-01-13: DATA only — JSON.parse on extracted strings, no eval.
// ---------------------------------------------------------------------------
function extractTrendSeries(html, term) {
  try {
    // Pattern 1: "timelineData" key embedded as JSON in a script block
    const timelineMatch = html.match(/"timelineData"\s*:\s*(\[[\s\S]*?\])\s*[,}]/);
    if (timelineMatch) {
      const raw = JSON.parse(timelineMatch[1]);
      if (Array.isArray(raw) && raw.length > 0) {
        const series = raw.map(pt => ({
          date: pt.formattedTime || pt.date || '',
          value: Array.isArray(pt.value) ? (pt.value[0] ?? 0) : (pt.value ?? 0),
        })).filter(pt => typeof pt.value === 'number');
        if (series.length > 0) return series;
      }
    }

    // Pattern 2: "interest" array (alternate embed format)
    const interestMatch = html.match(/"interest"\s*:\s*(\[[\s\S]*?\])\s*[,}]/);
    if (interestMatch) {
      const raw = JSON.parse(interestMatch[1]);
      if (Array.isArray(raw) && raw.length > 0) {
        const series = raw.map((v, i) => ({ date: String(i), value: Number(v) || 0 }));
        if (series.length > 0) return series;
      }
    }

    // Pattern 3: scan script blocks for an inline data array with "date"+"value" keys
    const scriptMatches = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
    for (const block of scriptMatches) {
      if (!block.includes('timeline') && !block.includes('interest')) continue;
      const m = block.match(/\[\s*\{[^}]*"date"[^}]*"value"[\s\S]*?\]\s*[;,}]/);
      if (m) {
        try {
          const raw = JSON.parse(m[0].replace(/;$/, '').trim());
          if (Array.isArray(raw) && raw.length > 0) {
            const series = raw.map(pt => ({
              date: pt.date || '',
              value: Array.isArray(pt.value) ? (pt.value[0] ?? 0) : (Number(pt.value) || 0),
            })).filter(pt => typeof pt.value === 'number');
            if (series.length > 0) return series;
          }
        } catch (_) {}
      }
    }

    return null;
  } catch (_) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// D-15: classifyTrendShape(series)
// Deterministic pure-arithmetic classifier — NO LLM (CLAUDE.md: deterministic → script).
// Maps the interest-over-time series to one of the CLOSED enum values.
//
// Shape rules (documented explicitly — thresholds are simple and calibrated by the debug run):
//   null/empty series  → "unknown"        escape valve — only here, never the blanket return
//   all-zero series    → "unknown"        no data resolved from Trends
//   parabolic-spike    window-max >= 2.5x trailing-third mean AND end-value <= 50% of window-max
//                                         the fad-death signal — Gate-1 parabolic-spike kill
//   rising             end-third mean >= start-third mean * 1.25, no parabolic spike
//   declining          end-third mean <= start-third mean * 0.75
//   steady             everything else — no dominant direction, no spike
// ---------------------------------------------------------------------------
function classifyTrendShape(series) {
  if (!series || series.length === 0) return 'unknown';

  const values = series.map(pt => pt.value);
  const n = values.length;
  if (n === 0) return 'unknown';

  const windowMax = Math.max(...values);
  if (windowMax === 0) return 'unknown'; // all zeros — no data resolved

  // Divide into thirds for direction detection
  const third = Math.floor(n / 3) || 1;
  const startSlice = values.slice(0, third);
  const endSlice = values.slice(n - third);
  const startMean = startSlice.reduce((a, b) => a + b, 0) / startSlice.length;
  const endMean = endSlice.reduce((a, b) => a + b, 0) / endSlice.length;

  // Spike detection: peak >> trailing mean AND end well below peak
  const trailingMean = endMean || 1;
  const endValue = values[n - 1];
  const isSpike =
    windowMax >= trailingMean * 2.5 && // peak is 2.5x the trailing mean
    endValue <= windowMax * 0.5;        // end is ≤50% of peak (steep post-peak drop)

  if (isSpike) return 'parabolic-spike';
  if (startMean > 0 && endMean >= startMean * 1.25) return 'rising';
  if (startMean > 0 && endMean <= startMean * 0.75) return 'declining';
  return 'steady';
}

// ---------------------------------------------------------------------------
// buildBasis(series, shape)
// One-line human-readable description of the trend curve for demand_trend.basis.
// ---------------------------------------------------------------------------
function buildBasis(series, shape) {
  if (!series || series.length === 0) return null;
  const values = series.map(pt => pt.value);
  const windowMax = Math.max(...values);
  const windowMin = Math.min(...values);
  const endValue = values[values.length - 1];
  const startValue = values[0];
  const first = (series[0] && series[0].date) ? series[0].date : '';
  const last = (series[series.length - 1] && series[series.length - 1].date) ? series[series.length - 1].date : '';

  if (shape === 'parabolic-spike') {
    const drop = windowMax > 0 ? Math.round((1 - endValue / windowMax) * 100) : 0;
    return `peak of ${windowMax} then -${drop}% to ${endValue} by end (${first}–${last})`;
  }
  if (shape === 'rising') {
    const gain = startValue > 0 ? Math.round((endValue / startValue - 1) * 100) : 0;
    return `rising ~${gain}% from ${startValue} to ${endValue} over ${first}–${last}`;
  }
  if (shape === 'declining') {
    const drop = startValue > 0 ? Math.round((1 - endValue / startValue) * 100) : 0;
    return `declining ~${drop}% from ${startValue} to ${endValue} over ${first}–${last}`;
  }
  return `steady (range ${windowMin}–${windowMax}) over ${first}–${last}`;
}

// ---------------------------------------------------------------------------
// slugifyPath helper
// ---------------------------------------------------------------------------
function slugifyPath(urlPath) {
  if (!urlPath || urlPath === '/') return 'home';
  return urlPath.replace(/^\//, '').replace(/\/$/, '').replace(/[^a-z0-9]+/gi, '_') || 'home';
}

// ---------------------------------------------------------------------------
// fetchPage helper
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// writeRaw helper
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(async () => {
  // D-16: read LP-hunt template from the bet brief's PIPELINE INPUTS (tolerant parse).
  // The LP-hunt set is FIXED for the run — a per-run planning INPUT from the brief
  // rather than a code hardcode. The determinism principle holds: fixed per run,
  // never agent-chosen mid-run. No brief = DEFAULT_LP_PATHS fallback.
  const pipelineInputs = parsePipelineInputs(briefPath);
  const { lpPaths, trendEnabled } = pipelineInputs;

  if (!trendEnabled) {
    console.log('[fetch] INFO: trend-source toggle is OFF in PIPELINE INPUTS — demand_trend.shape will be "unknown" for all brands');
  }

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

      // (b) LP-hunt: try URL-path patterns from brief's PIPELINE INPUTS (D-16),
      //     falling back to DEFAULT_LP_PATHS if no brief / no paths in brief.
      let origin;
      try {
        origin = new URL(url).origin;
      } catch (_) {
        origin = url.replace(/\/+$/, '');
      }

      for (const pattern of lpPaths) {
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

    // (c) D-15: Google Trends ~5yr demand_trend fetch per brand.
    // Per-brand try/catch — one Trends failure yields shape:"unknown" for that brand
    // only and does NOT abort the batch (adlib-sweep resilient-batch pattern).
    // T-01-13: Trends series is DATA — JSON.parse / string ops, never eval/Function/exec.
    // T-01-14: per-brand try/catch; batch continues on any Trends failure.
    let demand_trend;
    if (!trendEnabled) {
      // Operator opted out via PIPELINE INPUTS trend-source toggle (explicit, not a failure)
      demand_trend = { shape: 'unknown', window: null, source: null, basis: null };
    } else {
      try {
        // Use the brand name as the search term; fall back to slug if name field missing
        const trendTerm = brand.brand || brand.name || slug;
        const series = await fetchTrend(context, trendTerm, 'today 5-y');
        const shape = classifyTrendShape(series);
        const basis = series ? buildBasis(series, shape) : null;
        demand_trend = {
          shape,
          window: series ? 'today 5-y' : null,
          source: series ? 'google-trends' : null,
          basis,
        };
        const trendLine = `  trend(${slug}): shape=${shape}${basis ? ' | ' + basis : ''}`;
        results.push(trendLine);
        console.log(trendLine);
      } catch (e) {
        console.warn(`[fetch] WARN: trend failed for ${slug}: ${e.message.slice(0, 80)}`);
        demand_trend = { shape: 'unknown', window: null, source: null, basis: null };
        errors.push(`trend: ${e.message.slice(0, 80)}`);
      }
    }

    // Attach demand_trend to the brand row in-memory; written back after loop.
    brand.demand_trend = demand_trend;

    const line = `${slug}: fetched=[${fetched.join(',')}] errors=${errors.length}${errors.length ? ' [' + errors.slice(0, 3).join('; ') + (errors.length > 3 ? '...' : '') + ']' : ''}`;
    results.push(line);
    console.log(line);
  }

  await browser.close();

  // D-15: Write enriched brands.json back — brands array now carries per-brand demand_trend.
  // Preserves the rest of brandsData (starting_point, dropped, etc.).
  // T-01-13: no eval — JSON.stringify of DATA-only plain objects.
  try {
    brandsData.brands = brands;
    fs.writeFileSync(brandsPath, JSON.stringify(brandsData, null, 2));
    console.log(`[fetch] brands.json updated with demand_trend for ${brands.length} brands`);
  } catch (e) {
    console.error(`[fetch] ERROR: could not write demand_trend back to brands.json: ${e.message}`);
  }

  fs.writeFileSync(path.join(baseOut, '_fetch-log.txt'), results.join('\n') + '\n');
  console.log(`[fetch] done — ${brands.length} brands processed`);
})();
