// SimilarWeb traffic sweep. Uses the logged-in persistent profile.
// Per domain: screenshot + full innerText dump. Parsing happens afterward.
// Run ONLY after sw-login.js has exited (it holds the profile dir).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const USER_DATA_DIR = '/home/kyu3/.cache/pmf-sw-profile';
const OUT = '/home/kyu3/PMF/runs/eink-tablets/similarweb';

// Brands with a meaningful own domain. Marketplace-only brands (Kindle Scribe,
// Meebook, Guoyue, Eewriter, Bluegen, ememo) are skipped — no domain to measure.
const DOMAINS = [
  ['reMarkable', 'remarkable.com'],
  ['Boox', 'boox.com'],
  ['Kobo', 'kobo.com'],
  ['Supernote', 'supernote.com'],
  ['Bigme', 'bigme.vip'],
  ['Viwoods', 'viwoods.com'],
  ['iFLYTEK', 'iflytek.com'],          // conglomerate — whole-company traffic, flag
  ['Reinkstone', 'reinkstone.com'],
  ['Dasung', 'dasung.com'],
  ['MobiScribe', 'mobiscribe.com'],
  ['PocketBook', 'pocketbook-int.com'],
  ['Hisense-eink', 'hisenseeink.com'],
  ['Fujitsu-Quaderno', 'fujitsuquaderno.com'],
  ['Moaan', 'moaan.store'],
  ['Modos', 'modos.tech'],
  ['Daylight', 'daylightcomputer.com'],
  ['Harbor', 'harborinno.com'],
  ['TCL', 'tcl.com'],                  // conglomerate — flag
  ['XPPen', 'xp-pen.com'],             // mostly graphics tablets — flag
  ['iReader', 'zhangyue.com'],
  ['Hanvon', 'hanvon.com'],
  ['Ridibooks', 'ridibooks.com'],
  ['Pubu', 'pubu.com.tw'],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const ctx = await chromium.launchPersistentContext(USER_DATA_DIR, {
    headless: true,
    viewport: { width: 1440, height: 2400 },
  });
  const page = ctx.pages()[0] || (await ctx.newPage());
  const results = [];
  for (const [brand, domain] of DOMAINS) {
    const url = `https://www.similarweb.com/website/${domain}/`;
    let status = 'ok';
    let text = '';
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(6000); // let the SPA render
      await page.screenshot({ path: path.join(OUT, `${brand}.png`), fullPage: true });
      text = await page.evaluate(() => document.body.innerText);
    } catch (e) {
      status = 'error: ' + e.message;
    }
    fs.writeFileSync(
      path.join(OUT, `${brand}.txt`),
      `# ${brand} — ${domain}\n${url}\nstatus: ${status}\n\n${text}`
    );
    results.push(`${brand} (${domain}): ${status}, ${text.length} chars`);
    console.log(results[results.length - 1]);
    await page.waitForTimeout(3000); // gentle pacing
  }
  await ctx.close();
  fs.writeFileSync(path.join(OUT, '_sweep-log.txt'), results.join('\n'));
  console.log('[sw-sweep] done — ' + DOMAINS.length + ' domains');
})();
