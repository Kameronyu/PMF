// Exploration: land on a keyword-search results page (which renders the search
// box), type a brand, and dump the typeahead dropdown structure so the real
// advertiser-resolution script can be written against actual selectors.
const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await (await browser.newContext({ viewport: { width: 1400, height: 1400 } })).newPage();
  const url =
    'https://www.facebook.com/ads/library/?active_status=active&ad_type=all' +
    '&country=ALL&q=reMarkable&search_type=keyword_unordered&media_type=all';
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(3500);

  for (const lab of ['Allow all cookies', 'Decline optional cookies', 'Only allow essential cookies']) {
    const b = page.locator(`[role="button"]:has-text("${lab}"), button:has-text("${lab}")`).first();
    if (await b.count()) { try { await b.click({ timeout: 3000 }); break; } catch (e) {} }
  }
  await page.waitForTimeout(2500);

  const inp = page.getByPlaceholder(/keyword|advertiser/i).first();
  const found = await inp.count();
  console.log('search input count:', found);

  if (found) {
    await inp.click();
    await inp.fill('reMarkable');
    await page.waitForTimeout(5000);
    const dump = await page.evaluate(() => {
      const res = {};
      res.options = [...document.querySelectorAll('[role="option"]')].map((e) => ({
        text: e.innerText.trim().slice(0, 200),
        html: e.outerHTML.slice(0, 300),
      }));
      res.listboxes = [...document.querySelectorAll('[role="listbox"]')].map((e) =>
        e.innerText.trim().slice(0, 600)
      );
      res.links = [...document.querySelectorAll('a[href*="view_all_page_id"]')].map((e) => ({
        text: e.innerText.trim().slice(0, 120),
        href: e.getAttribute('href'),
      }));
      return res;
    });
    console.log(JSON.stringify(dump, null, 1));
    await page.screenshot({ path: '/home/kyu3/PMF/runs/eink-tablets/scripts/typeahead-test.png' });
    console.log('screenshot: scripts/typeahead-test.png');
  }
  await browser.close();
})();
