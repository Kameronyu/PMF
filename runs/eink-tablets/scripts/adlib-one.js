// Meta Ad Library lookup by ADVERTISER PAGE (kills keyword-collision noise).
//   node adlib-one.js <slug> "<brand name>" [pageId]
// If a numeric pageId is given as the 3rd arg, the typeahead step is skipped
// and that page is queried directly (use to fix a mis-resolved auto-pick).
// Otherwise: land on a page with the search box -> type brand -> read typeahead
// (each <li role=option> carries id="pageID:NNN") -> auto-pick the genuine
// advertiser -> load view_all_page_id -> read the exact active-ad count + dump.
// Output: runs/eink-tablets/adlibrary/<slug>_adv.txt (+ _adv.png)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const slug = process.argv[2];
const brand = process.argv[3] || slug;
const forcedPageId = (process.argv[4] && /^\d+$/.test(process.argv[4])) ? process.argv[4] : null;
if (!slug) {
  console.error('usage: node adlib-one.js <slug> "<brand name>" [pageId]');
  process.exit(1);
}
const OUT = '/home/kyu3/PMF/runs/eink-tablets/adlibrary';

const FAV_CAT = /(technolog|electronic|computer|software|product|company|brand|retail|shopping|store|gadget)/i;
const BAD_CAT = /(agency|fan page|fan club|news|media|blog|community|gamer|musician|artist|public figure|personal blog)/i;

function pickAdvertiser(cands, brand) {
  const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const bnorm = norm(brand);
  let best = null;
  for (const c of cands) {
    const lines = c.text.split('\n').map((x) => x.trim()).filter(Boolean);
    const name = lines[0] || '';
    const meta = c.text.toLowerCase();
    const fol = (c.text.match(/([\d.]+)\s*([KM]?)\s*follow/i) || [0, 0, '']);
    let followers = parseFloat(fol[1]) || 0;
    if (fol[2].toUpperCase() === 'K') followers *= 1e3;
    if (fol[2].toUpperCase() === 'M') followers *= 1e6;
    let score = 0;
    const nn = norm(name);
    if (nn === bnorm) score += 100;
    else if (nn.startsWith(bnorm)) score += 45;
    else if (nn.includes(bnorm)) score += 22;
    if (FAV_CAT.test(meta)) score += 15;
    if (BAD_CAT.test(meta)) score -= 35;
    score += Math.min(followers / 1e6, 5); // small tiebreaker, capped
    c._score = score;
    c._name = name;
    c._followers = followers;
    if (!best || score > best._score) best = c;
  }
  return best && best._score >= 30 ? best : null;
}

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1400, height: 1700 } });
  const page = await ctx.newPage();
  let status = 'ok';
  let resolved = null;
  let candidates = [];
  let count = 'n/a';
  let loaded = 0;
  let text = '';
  try {
    await page.goto(
      `https://www.facebook.com/ads/library/?active_status=active&ad_type=all` +
        `&country=ALL&q=${encodeURIComponent(brand)}&search_type=keyword_unordered&media_type=all`,
      { waitUntil: 'domcontentloaded', timeout: 45000 }
    );
    await page.waitForTimeout(3500);
    for (const lab of ['Allow all cookies', 'Decline optional cookies', 'Only allow essential cookies']) {
      const b = page.locator(`[role="button"]:has-text("${lab}"), button:has-text("${lab}")`).first();
      if (await b.count()) { try { await b.click({ timeout: 3000 }); break; } catch (e) {} }
    }
    await page.waitForTimeout(2000);

    if (forcedPageId) {
      resolved = { pageId: forcedPageId, _name: '(forced pageId)', _followers: 0, _score: 999 };
    } else {
      const inp = page.getByPlaceholder(/keyword|advertiser/i).first();
      await inp.click({ timeout: 12000 });
      await page.keyboard.press('Control+A');
      await inp.type(brand, { delay: 70 });
      await page.waitForTimeout(5000);
      candidates = await page.evaluate(() => {
        return [...document.querySelectorAll('li[role="option"]')]
          .map((li) => {
            const m = (li.getAttribute('id') || '').match(/pageID:(\d+)/);
            return m ? { pageId: m[1], text: li.innerText.trim() } : null;
          })
          .filter(Boolean);
      });
      resolved = pickAdvertiser(candidates, brand);
    }

    if (resolved) {
      await page.goto(
        `https://www.facebook.com/ads/library/?active_status=active&ad_type=all` +
          `&country=ALL&view_all_page_id=${resolved.pageId}&media_type=all`,
        { waitUntil: 'domcontentloaded', timeout: 45000 }
      );
      await page.waitForTimeout(6500);
      for (let i = 0; i < 6; i++) {
        await page.mouse.wheel(0, 3200);
        await page.waitForTimeout(1400);
      }
      await page.screenshot({ path: path.join(OUT, `${slug}_adv.png`) });
      text = await page.evaluate(() => document.body.innerText);
      loaded = (text.match(/Library ID/g) || []).length;
      if (/no ads match/i.test(text)) {
        count = '0';
      } else {
        const cm = text.match(/~?\s*([\d,]+)\s+results?/i);
        count = cm ? cm[1] : (loaded ? loaded + '+ (count text not found; Library IDs loaded)' : 'unknown');
      }
    }
  } catch (e) {
    status = 'error: ' + e.message;
  }
  await browser.close();

  const candLines = candidates
    .map((c) => `  ${c.pageId} | score=${c._score != null ? c._score.toFixed(1) : '-'} | ${c.text.replace(/\n/g, ' / ')}`)
    .join('\n');
  fs.writeFileSync(
    path.join(OUT, `${slug}_adv.txt`),
    `# ${slug}\nbrand_query: ${brand}\nstatus: ${status}\n` +
      `resolved_advertiser: ${resolved ? `${resolved._name} (pageID ${resolved.pageId}, ${resolved._followers} followers)` : 'NONE'}\n` +
      `active_ad_count: ${count}\nlibrary_ids_loaded: ${loaded}\n\n` +
      `TYPEAHEAD CANDIDATES:\n${candLines || '  (none — forced pageId or no matches)'}\n\n--- ADS DUMP ---\n${text}`
  );
  console.log(
    `${slug}: status=${status} | resolved=${resolved ? resolved._name + ' (' + resolved.pageId + ')' : 'NONE'} | active_ads=${count}`
  );
})();
