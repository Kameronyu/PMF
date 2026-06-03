// Opens a headed Chromium with a persistent profile so the SimilarWeb login
// survives for the later sweep. Stays open until /tmp/sw-ready appears.
const { chromium } = require('playwright');
const fs = require('fs');

const USER_DATA_DIR = '/home/kyu3/.cache/pmf-sw-profile';
const SENTINEL = '/tmp/sw-ready';

(async () => {
  const ctx = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: false,
    viewport: { width: 1440, height: 900 },
    args: ['--start-maximized'],
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  await page.goto('https://www.similarweb.com/', { waitUntil: 'domcontentloaded' });
  console.log('[sw-login] Browser open at similarweb.com. Log in, then have Claude touch ' + SENTINEL);

  if (fs.existsSync(SENTINEL)) fs.unlinkSync(SENTINEL);
  while (!fs.existsSync(SENTINEL)) {
    await new Promise((r) => setTimeout(r, 2000));
  }
  fs.unlinkSync(SENTINEL);

  await ctx.close(); // flushes cookies to the profile dir
  console.log('[sw-login] Session saved to ' + USER_DATA_DIR + '. Browser closed.');
})();
