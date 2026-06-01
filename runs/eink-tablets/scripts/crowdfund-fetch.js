#!/usr/bin/env node
// crowdfund-fetch.js
// Playwright-based fetcher for crowdfunding pages (Kickstarter, Indiegogo,
// Crowd Supply, BackerKit). Bypasses WebFetch 403s by running a real
// headless Chromium with stealth-leaning defaults.
//
// Usage:
//   node crowdfund-fetch.js <slug> <url> [--type=campaign|comments|updates|risks|faq] [--out=<dir>]
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
//
// Default outDir: runs/eink-tablets/crowdfunding-corpus
// Override with --out=path

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const slug = args[0];
const url = args[1];
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const type = opts.type || 'campaign';
const baseOut = opts.out || path.join(__dirname, '..', 'crowdfunding-corpus');

if (!slug || !url) {
  console.error('Usage: node crowdfund-fetch.js <slug> <url> [--type=campaign|comments|updates|risks|faq] [--out=<dir>]');
  process.exit(1);
}

const outDir = path.join(baseOut, slug, 'raw');
fs.mkdirSync(outDir, { recursive: true });

const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const fileBase = `${type}-${ts}`;

(async () => {
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

  const page = await context.newPage();

  let status = 'ok';
  let bytesHtml = 0;
  let bytesText = 0;
  let title = '';

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

    fs.writeFileSync(path.join(outDir, `${fileBase}.html`), html);
    fs.writeFileSync(
      path.join(outDir, `${fileBase}.txt`),
      `URL: ${url}\nTITLE: ${title}\nFETCHED: ${new Date().toISOString()}\n\n${text}`
    );
    await page
      .screenshot({ path: path.join(outDir, `${fileBase}.png`), fullPage: true })
      .catch(() => {});
  } catch (err) {
    status = 'err';
    fs.writeFileSync(
      path.join(outDir, `${fileBase}.err.txt`),
      `URL: ${url}\nERR: ${err.message}\n`
    );
  } finally {
    await browser.close();
  }

  console.log(
    `${slug}: status=${status} | type=${type} | title="${title.slice(0, 80)}" | html=${bytesHtml} | text=${bytesText} | out=${path.join(outDir, fileBase)}`
  );
})();
