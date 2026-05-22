// Meta Ad Library sweep. No login required. Per brand: keyword search,
// screenshot + full innerText dump (ad copy, library IDs, run dates, counts).
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const OUT = '/home/kyu3/PMF/runs/eink-tablets/adlibrary';

const BRANDS = [
  'reMarkable', 'Boox', 'Kindle Scribe', 'Kobo eReader', 'Supernote', 'Bigme',
  'Viwoods', 'iFLYTEK AINOTE', 'Reinkstone', 'Dasung', 'MobiScribe',
  'PocketBook', 'Hisense eink', 'Fujitsu Quaderno', 'Huawei MatePad Paper',
  'Meebook', 'Moaan', 'iReader', 'Hanvon', 'Guoyue', 'Pubook', 'Crema ereader',
  'Ridibooks', 'Eewriter', 'OKPad', 'Modos', 'ememo', 'TCL NXTPAPER',
  'Daylight Computer', 'Harbor Paper', 'XPPen',
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1700 } });
  const page = await ctx.newPage();
  const results = [];
  for (const brand of BRANDS) {
    const slug = brand.replace(/[^a-z0-9]+/gi, '_');
    const q = encodeURIComponent(brand);
    const url =
      `https://www.facebook.com/ads/library/?active_status=active&ad_type=all` +
      `&country=ALL&q=${q}&search_type=keyword_unordered&media_type=all`;
    let status = 'ok';
    let text = '';
    try {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(3000);
      // dismiss cookie consent dialog if present
      for (const label of [
        'Allow all cookies', 'Decline optional cookies',
        'Only allow essential cookies',
      ]) {
        const btn = page
          .locator(`[role="button"]:has-text("${label}"), button:has-text("${label}")`)
          .first();
        if (await btn.count()) {
          try { await btn.click({ timeout: 3000 }); break; } catch (e) {}
        }
      }
      await page.waitForTimeout(4000);
      for (let i = 0; i < 5; i++) {
        await page.mouse.wheel(0, 3000);
        await page.waitForTimeout(1500);
      }
      await page.screenshot({ path: path.join(OUT, `${slug}.png`) });
      text = await page.evaluate(() => document.body.innerText);
    } catch (e) {
      status = 'error: ' + e.message;
    }
    fs.writeFileSync(
      path.join(OUT, `${slug}.txt`),
      `# ${brand}\n${url}\nstatus: ${status}\n\n${text}`
    );
    results.push(`${brand}: ${status}, ${text.length} chars`);
    console.log(results[results.length - 1]);
    await page.waitForTimeout(2000);
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, '_sweep-log.txt'), results.join('\n'));
  console.log('[adlib-sweep] done — ' + BRANDS.length + ' brands');
})();
