#!/usr/bin/env node
// crowdfund-fetch.js
// Playwright-based fetcher for crowdfunding pages (Kickstarter, Indiegogo,
// Crowd Supply, BackerKit). Bypasses WebFetch 403s by running a real
// headless Chromium with stealth-leaning defaults.
//
// Usage:
//   node crowdfund-fetch.js <slug> <url> [--type=campaign|comments|updates|risks|faq] [--out=<dir>] [--help]
//
// Examples:
//   node crowdfund-fetch.js diptyx https://www.crowdsupply.com/diptyx/diptyx-e-reader
//   node crowdfund-fetch.js bluegen-okpad https://www.kickstarter.com/projects/bluegen/dual-screen-okpad-double-the-screens-double-the-potential --type=campaign
//   node crowdfund-fetch.js bluegen-okpad https://www.kickstarter.com/projects/bluegen/dual-screen-okpad-double-the-screens-double-the-potential/comments --type=comments
//   node crowdfund-fetch.js bluegen-okpad https://www.kickstarter.com/projects/bluegen/dual-screen-okpad-double-the-screens-double-the-potential/posts --type=updates
//
// Output (per call):
//   <outDir>/<slug>/raw/<type>-<timestamp>.html
//   <outDir>/<slug>/raw/<type>-<timestamp>.txt
//   <outDir>/<slug>/raw/<type>-<timestamp>.png
//   <outDir>/<slug>/raw/<type>-<timestamp>.stats.json   (campaign type only — crowdfunding_stats)
//
// Default outDir: runs/eink-tablets/crowdfunding-corpus
// Override with --out=path
//
// Threat mitigations:
//   T-03-05 (SSRF): Host validated against private/loopback/link-local/metadata ranges before goto.
//   T-03-06 (DoS): CF-clear loop bounded; goto/networkidle timeouts; per-page try/catch; null on parse miss.
//   T-03-07 (ReDoS): Bounded/linear regex patterns in Currency-B parser; input capped before regex.

'use strict';

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const dns = require('dns').promises;
const net = require('net');

const args = process.argv.slice(2);
const slug = args.filter(a => !a.startsWith('--'))[0];
const url  = args.filter(a => !a.startsWith('--'))[1];
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help || (!slug && !url)) {
  console.log(
    'Usage: node crowdfund-fetch.js <slug> <url> [--type=campaign|comments|updates|risks|faq]\n' +
    '       [--out=<dir>] [--help]\n' +
    '\n' +
    'Renders a crowdfunding page via Playwright and dumps html/txt/png + stats (campaign type).\n' +
    '\n' +
    '  <slug>             Identifier for this project (used in output directory name)\n' +
    '  <url>              Full URL of the crowdfunding page to fetch\n' +
    '  --type             Page type: campaign (default) | comments | updates | risks | faq\n' +
    '  --out              Output base directory (default: runs/eink-tablets/crowdfunding-corpus)\n' +
    '  --help             Show this help\n' +
    '\n' +
    'On --type=campaign, emits a .stats.json sidecar with crowdfunding_stats:\n' +
    '  { amount_raised, backer_count, funded_vs_failed, delivered_vs_not }\n' +
    '  Unparseable fields are null (never fabricated).\n'
  );
  process.exit(0);
}

if (!slug || !url) {
  console.error('Usage: node crowdfund-fetch.js <slug> <url> [--type=campaign|comments|updates|risks|faq] [--out=<dir>]');
  process.exit(1);
}

const type = opts.type || 'campaign';
const baseOut = opts.out || path.join(__dirname, '..', 'crowdfunding-corpus');

const outDir = path.join(baseOut, slug, 'raw');
fs.mkdirSync(outDir, { recursive: true });

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const fileBase = `${type}-${ts}`;

// ---------------------------------------------------------------------------
// SSRF guard (T-03-05) — validates hand-fed crowdfunding LP URLs before goto.
// Matches the funnel-assemble.js ssrfGuard() implementation exactly.
// Returns true = safe to navigate; false = skip.
// ---------------------------------------------------------------------------
const PRIVATE_RANGES = [
  // IPv4
  /^127\./,
  /^10\./,
  /^172\.(1[6-9]|2\d|3[01])\./,
  /^192\.168\./,
  /^169\.254\./,           // link-local (incl. 169.254.169.254 cloud metadata)
  /^0\./,
  /^255\./,
  // IPv6 loopback / ULA
  /^::1$/,
  /^fc[0-9a-f]{2}:/i,
  /^fd[0-9a-f]{2}:/i,
];

function isPrivateIp(ip) {
  return PRIVATE_RANGES.some(re => re.test(ip));
}

async function ssrfGuard(urlStr) {
  // WR-03 (DNS-rebinding / TOCTOU): There is an inherent gap between this dns.lookup()
  // call and the browser's own DNS resolution in page.goto(). An attacker controlling
  // DNS could return a public IP here and a private IP to the browser (DNS rebinding).
  // Mitigation: the context.route() interceptor (WR-01) re-runs ssrfGuard() on every
  // navigation hop, substantially reducing the effective attack window. Full IP-pinning
  // is not practical with Playwright's high-level API without a custom proxy. Residual
  // risk accepted and documented; the interceptor is the primary enforcement layer.
  try {
    const u = new URL(urlStr);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    const host = u.hostname;
    if (net.isIP(host)) return !isPrivateIp(host);
    try {
      const addrs = await dns.lookup(host, { all: true });
      for (const { address } of addrs) {
        if (isPrivateIp(address)) return false;
      }
    } catch (_) {
      return false; // DNS failure — fail closed
    }
    return true;
  } catch (_) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Currency-B stat parser (D-07, spec §3)
// Tolerant multi-pattern regex cascade — try KS -> Indiegogo -> Crowd Supply ->
// generic fallback, return null on no-match, NEVER throw (T-03-07: bounded patterns).
//
// Fields:
//   amount_raised     — total money pledged/raised (string, e.g. "$42,000" or null)
//   backer_count      — number of backers/supporters (number or null)
//   funded_vs_failed  — "funded" | "failed" | null  (did the campaign hit its goal?)
//   delivered_vs_not  — "delivered" | "not_delivered" | null
//                       (did a PRIOR campaign by this creator actually ship — strongest durability
//                        signal. Requires creator-profile/history data; often not present on the
//                        campaign page itself. Set null when not inferrable from this page.)
//
// Never-fabricate: unparseable stat = null, never a guess.
// ---------------------------------------------------------------------------

// Cap input before regex to avoid pathological-length processing (T-03-07).
const MAX_PARSE_BYTES = 500_000; // 500 KB is ample for rendered text

function parseCurrencyBStats(text, html) {
  // Defensive cap
  const t = (text || '').slice(0, MAX_PARSE_BYTES);
  const h = (html || '').slice(0, MAX_PARSE_BYTES);

  // ---- amount_raised --------------------------------------------------------
  // KS pattern 1: "$42,195 pledged" / "€12,345 pledged"
  // KS pattern 2: "$42,195\npledged" (multi-line in innerText)
  // Indiegogo: "$42,195 raised" / "42,195 USD raised"
  // Crowd Supply: "$42,195 raised" or "Raised $42,195"
  // Generic: any currency-prefixed number followed by pledged/raised
  let amount_raised = null;
  const amountPatterns = [
    /([£$€¥₹]\s?[\d,]+(?:\.\d{1,2})?)\s*(?:pledged|raised)/i,
    /Raised\s+([£$€¥₹]\s?[\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+)\s+(?:USD|EUR|GBP|CAD|AUD)\s+(?:pledged|raised)/i,
    /([£$€¥₹]\s?[\d,]+(?:\.\d{1,2})?)\s*\n\s*(?:pledged|raised)/im,
  ];
  for (const pat of amountPatterns) {
    const m = t.match(pat);
    if (m) { amount_raised = m[1].trim(); break; }
  }

  // ---- backer_count --------------------------------------------------------
  // KS: "1,234 backers" / "1234\nbackers"
  // Indiegogo: "1,234 backers" / "1,234 supporters"
  // Crowd Supply: "1,234 backers"
  let backer_count = null;
  const backerPatterns = [
    /([\d,]+)\s*backers?/i,
    /([\d,]+)\s*supporters?/i,
    /([\d,]+)\s*\n\s*backers?/im,
    /([\d,]+)\s*\n\s*supporters?/im,
  ];
  for (const pat of backerPatterns) {
    const m = t.match(pat);
    if (m) {
      const raw = m[1].replace(/,/g, '');
      const n = parseInt(raw, 10);
      if (!isNaN(n)) { backer_count = n; break; }
    }
  }

  // ---- funded_vs_failed ----------------------------------------------------
  // KS: "Successfully funded" / "This project was successfully funded"
  //     "This project was not successfully funded" / "Funding Unsuccessful"
  // Indiegogo: "In Demand" (=> funded) / "Funding" / "Closed" (ambiguous)
  // Crowd Supply: "Funded" / "Not funded"
  let funded_vs_failed = null;
  if (
    /successfully\s+funded/i.test(t) ||
    /\bfunded\b/i.test(t) ||
    /\bin\s+demand\b/i.test(t) ||
    /\bgoal\s+reached\b/i.test(t)
  ) {
    funded_vs_failed = 'funded';
  }
  if (
    /not\s+successfully\s+funded/i.test(t) ||
    /funding\s+unsuccessful/i.test(t) ||
    /\bnot\s+funded\b/i.test(t) ||
    /\bfailed\b/i.test(t)
  ) {
    // Failed signal overrides (more specific)
    funded_vs_failed = 'failed';
  }

  // ---- delivered_vs_not ----------------------------------------------------
  // This signal ideally comes from the creator's profile/history (a separate --type=
  // fetch against the creator page). On the campaign page itself it may appear as:
  // "Estimated delivery: [past date]" + "All rewards have been fulfilled"
  // "Shipping Now" / "In Production" / "Delivered" status badges
  // KS creator profile: "X previously successful projects" / "delivered"
  // Absent from this page in most cases → null (never guess).
  let delivered_vs_not = null;
  if (
    /all\s+rewards?\s+(?:have\s+been\s+)?(?:fulfilled|delivered|shipped)/i.test(t) ||
    /\bshipping\s+now\b/i.test(t) ||
    /\bdelivered\b/i.test(t) ||
    /successfully\s+delivered/i.test(t)
  ) {
    delivered_vs_not = 'delivered';
  }
  if (
    /not\s+(?:yet\s+)?delivered/i.test(t) ||
    /\bin\s+production\b/i.test(t) ||
    /expected\s+to\s+ship/i.test(t)
  ) {
    if (!delivered_vs_not) delivered_vs_not = 'not_delivered';
  }

  return {
    amount_raised,
    backer_count,
    funded_vs_failed,
    delivered_vs_not,
    _note: 'Currency-B stats parsed from rendered page text. delivered_vs_not is strongest when sourced from creator profile (separate --type fetch); may be null if not surfaced on campaign page.',
  };
}

// ---------------------------------------------------------------------------
// Main render + parse
// ---------------------------------------------------------------------------
(async () => {
  // SSRF guard — validate the URL before launching Playwright (T-03-05)
  const isSafe = await ssrfGuard(url);
  if (!isSafe) {
    console.error(`[crowdfund-fetch] SSRF guard rejected URL: ${url}`);
    process.exit(1);
  }

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

  // Light fingerprint masking: hide webdriver, plugin/lang spoof
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
  });

  // T-03-05 (WR-01): Re-validate EVERY navigation/redirect target against the SSRF guard.
  // ssrfGuard() checked the initial URL above; page.goto follows 30x redirects to the final
  // host. Register a request interceptor so each hop is checked before the browser connects.
  await context.route('**/*', async (route) => {
    const reqUrl = route.request().url();
    try {
      const u = new URL(reqUrl);
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return route.continue();
      if (net.isIP(u.hostname)) {
        if (isPrivateIp(u.hostname)) return route.abort();
        return route.continue();
      }
      const safe = await ssrfGuard(reqUrl);
      if (!safe) return route.abort();
    } catch (_) {
      return route.abort();
    }
    return route.continue();
  });

  const page = await context.newPage();

  let status = 'ok';
  let bytesHtml = 0;
  let bytesText = 0;
  let title = '';
  let crowdfunding_stats = null;

  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    // Wait for any Cloudflare challenge to clear (up to 15s extra)
    for (let i = 0; i < 15; i++) {
      const t = await page.title().catch(() => '');
      if (!t.match(/just a moment|cloudflare|checking your browser/i)) break;
      await page.waitForTimeout(1000);
    }

    // Let lazy / JS-rendered content settle
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});

    // Click expansion controls (campaign body "Read more", "Show more")
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

    // For comments pages, attempt to load more if pagination present
    if (type === 'comments') {
      for (let i = 0; i < 5; i++) {
        const more = await page
          .$('button:has-text("Load more comments"), button:has-text("Show more comments")')
          .catch(() => null);
        if (!more) break;
        await more.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(1500);
      }
    }

    title = await page.title().catch(() => '');
    const html = await page.content();
    const text = await page.evaluate(() => document.body.innerText);

    bytesHtml = html.length;
    bytesText = text.length;

    // --- Currency-B stat parse (D-07) — runs on --type=campaign only ---
    if (type === 'campaign') {
      try {
        crowdfunding_stats = parseCurrencyBStats(text, html);
      } catch (_) {
        crowdfunding_stats = null; // parse failure = null, never throw (T-03-06)
      }
    }

    fs.writeFileSync(path.join(outDir, `${fileBase}.html`), html);
    fs.writeFileSync(
      path.join(outDir, `${fileBase}.txt`),
      `URL: ${url}\nTITLE: ${title}\nFETCHED: ${new Date().toISOString()}\n\n${text}`
    );
    await page
      .screenshot({ path: path.join(outDir, `${fileBase}.png`), fullPage: true })
      .catch(() => {});

    // Emit crowdfunding_stats sidecar for campaign type (fed into funnel_package by funnel-assemble.js)
    if (type === 'campaign') {
      const statsOut = {
        slug,
        url,
        fetched: new Date().toISOString(),
        crowdfunding_stats,
      };
      fs.writeFileSync(
        path.join(outDir, `${fileBase}.stats.json`),
        JSON.stringify(statsOut, null, 2)
      );
    }
  } catch (err) {
    status = 'err';
    fs.writeFileSync(
      path.join(outDir, `${fileBase}.err.txt`),
      `URL: ${url}\nERR: ${err.message}\n`
    );
  } finally {
    await browser.close();
  }

  const statsLine = crowdfunding_stats
    ? ` | raised=${crowdfunding_stats.amount_raised} backers=${crowdfunding_stats.backer_count} funded=${crowdfunding_stats.funded_vs_failed}`
    : '';

  console.log(
    `${slug}: status=${status} | type=${type} | title="${title.slice(0, 80)}" | html=${bytesHtml} | text=${bytesText}${statsLine} | out=${path.join(outDir, fileBase)}`
  );
})();
