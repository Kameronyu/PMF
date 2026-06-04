// Meta Ad Library lookup by ADVERTISER PAGE (kills keyword-collision noise).
//   node adlib-one.js <slug> "<brand name>" [pageId] [--out=./ads]
// If a numeric pageId is given as the 3rd arg, the typeahead step is skipped
// and that page is queried directly (use to fix a mis-resolved auto-pick).
// Otherwise: land on a page with the search box -> type brand -> read typeahead
// (each <li role=option> carries id="pageID:NNN") -> auto-pick the genuine
// advertiser -> load view_all_page_id -> read the exact active-ad count + dump.
// Output: <out>/<slug>.json (+ <out>/<slug>_adv.png + <out>/<slug>_adv.txt for debug)
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const rawArgs = process.argv.slice(2);
const flagArgs = rawArgs.filter(a => a.startsWith('--'));
const posArgs = rawArgs.filter(a => !a.startsWith('--'));

const opts = Object.fromEntries(
  flagArgs.map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log(
    'Usage: node adlib-one.js <slug> "<brand name>" [pageId] [--out=./ads]\n' +
    '\n' +
    'Fetch Meta Ad Library by advertiser page ID (kills keyword-collision noise).\n' +
    '  slug      Brand slug for output filename\n' +
    '  brand     Brand name to search (quoted if multi-word)\n' +
    '  pageId    Optional: skip typeahead, use this page ID directly\n' +
    '  --out     Output directory (default: ./ads)\n' +
    '  --help    Show this help\n'
  );
  process.exit(0);
}

const slug = posArgs[0];
const brand = posArgs[1] || slug;
const forcedPageId = (posArgs[2] && /^\d+$/.test(posArgs[2])) ? posArgs[2] : null;

if (!slug) {
  console.error('usage: node adlib-one.js <slug> "<brand name>" [pageId] [--out=./ads]');
  process.exit(1);
}

const OUT = opts.out || './ads';

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

// --- D-20: structured per-ad extraction (run_length_days from the Ad Library) ---
// Card boundaries on the Ad Library DOM are obfuscated/hashed, so chunking the
// rendered results text on the "Library ID" delimiter is more robust than guessing
// container selectors. The 01-05 debug pass calibrates these patterns against the
// real DOM. adlib-one.js is a normal Node CLI (not a workflow script), so new Date()
// is fine for the active-ad "run so far" anchor.
//
// D-06 binding-spine fields added: destination_url (THE funnel-binding key), cta_text,
// headline, impression_bucket, platforms. Per-card DOM extraction added in extractAdCards
// (page.evaluate step). Text-chunk regex fallbacks for fields that surface in innerText.
// Calibration against the live DOM is a debug-pass task (D-17) — patterns are wired with
// TODO markers; never-fabricate: null over guess for any unresolvable field.
function toISO(d) {
  const t = new Date(d);
  return isNaN(t.getTime()) ? null : t.toISOString().slice(0, 10);
}
function daysBetween(a, b) {
  const t1 = new Date(a), t2 = new Date(b);
  if (isNaN(t1.getTime()) || isNaN(t2.getTime())) return null;
  return Math.max(0, Math.round((t2 - t1) / 86400000));
}

// --- D-06: Per-card DOM extraction (binding-spine fields) ---
// Runs inside page.evaluate so it has access to the live hashed DOM.
// TODO(D-17): calibrate selectors against the real Ad Library DOM during the debug-run pass.
// The Ad Library uses obfuscated/hashed class names; these selectors are best-effort patterns
// targeting semantic role/aria attributes and link href structures that are less likely to change.
// never-fabricate: any field that cannot be resolved = null, NEVER a guess (D-10).
async function extractAdCards(page) {
  return page.evaluate(() => {
    // TODO(D-17): verify these selectors against the live Ad Library DOM.
    // Strategy: each ad card contains a "Library ID" text node; we locate card boundaries
    // by finding elements whose text includes "Library ID:" and walk to the enclosing card.
    // The destination URL is on the CTA/See-ad-details anchor. Impression bucket surfaces
    // on EU/DSA-view cards as a "Estimated audience size" or reach-range text.

    const cards = [];

    // Attempt 1: query all anchors with an href that looks like an external CTA destination.
    // The Ad Library wraps each ad card; the CTA "Shop Now" / "Learn More" anchor is the
    // most reliable source for destination_url. "See ad details" links to the ad's own
    // library page (facebook.com/ads/library/?id=NNN) — skip those.
    // TODO(D-17): replace with the verified container selector after live-DOM inspection.
    const allLinks = [...document.querySelectorAll('a[href]')];
    const ctaLinks = allLinks.filter(a => {
      const href = a.href || '';
      // Skip internal FB/Meta library links and empty anchors
      if (!href || href.includes('facebook.com/ads/library') || href.startsWith('#')) return false;
      // Skip navigation/footer/header links (heuristic: they lack ad-card ancestry)
      const text = (a.innerText || '').trim();
      // A CTA button typically has short text (1-4 words) and an external href
      return text.length > 0 && text.length < 80;
    });

    // Build a map: library_id -> card data, extracted from text chunks for correlation.
    // For each CTA link, try to find the library_id of the enclosing card by walking up.
    for (const link of ctaLinks) {
      try {
        let node = link;
        let libraryId = null;
        // Walk up to 20 ancestors to find a "Library ID" text marker
        for (let i = 0; i < 20; i++) {
          node = node.parentElement;
          if (!node) break;
          const txt = node.innerText || '';
          const m = txt.match(/Library ID:?\s*(\d{5,})/i);
          if (m) { libraryId = m[1]; break; }
        }
        if (!libraryId) continue;

        // destination_url: the CTA link's normalized href (tracking params stripped downstream)
        const destination_url = link.href || null;
        // cta_text: the CTA button label
        const cta_text = (link.innerText || '').trim() || null;

        // headline: look for a heading element (h1/h2/h3) inside the same card ancestor
        let headline = null;
        let cardNode = link;
        for (let i = 0; i < 20; i++) {
          cardNode = cardNode.parentElement;
          if (!cardNode) break;
          const h = cardNode.querySelector('h1, h2, h3, [role="heading"]');
          if (h) { headline = (h.innerText || '').trim() || null; break; }
        }

        // impression_bucket: EU/DSA view only — text pattern like "< 1,000" or "1K-5K"
        // or "Estimated audience size: X–Y" ranges. null on non-EU view (most runs).
        // TODO(D-17): calibrate against the EU DSA ad library view.
        let impression_bucket = null;
        let impNode = link;
        for (let i = 0; i < 20; i++) {
          impNode = impNode.parentElement;
          if (!impNode) break;
          const t = impNode.innerText || '';
          // Patterns: "under 1,000", "1,000 - 5,000", "1K–5K", "1M+"
          const m2 = t.match(/(under\s*1[,.]?000|<\s*1[,.]?000|[\d.,]+[KM]?\s*[-–]\s*[\d.,]+[KM]?|[\d.,]+[KM]\+)/i);
          if (m2) { impression_bucket = m2[0].trim(); break; }
        }

        // platforms: look for platform indicator text (Facebook, Instagram, etc.)
        // The Ad Library typically shows "Platforms: Facebook, Instagram" or similar.
        let platforms = null;
        let platNode = link;
        for (let i = 0; i < 20; i++) {
          platNode = platNode.parentElement;
          if (!platNode) break;
          const t = platNode.innerText || '';
          const m3 = t.match(/(?:Platforms?:?\s*)((?:Facebook|Instagram|Messenger|WhatsApp|Audience Network)(?:[,\s/]+(?:Facebook|Instagram|Messenger|WhatsApp|Audience Network))*)/i);
          if (m3) { platforms = m3[1].trim(); break; }
        }

        cards.push({ library_id: libraryId, destination_url, cta_text, headline, impression_bucket, platforms });
      } catch (_) { /* skip malformed card, keep the rest */ }
    }

    return cards;
  });
}

// Text-chunk fallback extraction for fields that sometimes surface in innerText
// (headline often visible in text dumps; impression_bucket on EU view).
// Fills in null fields on the ad record from the text chunk when DOM extraction missed them.
// never-fabricate: returns the ad unchanged if no new data found.
function textFallbackFields(ad, chunk) {
  let { destination_url, cta_text, headline, impression_bucket, platforms } = ad;

  // headline: first non-date, non-ID short line in the chunk (heuristic, calibrate D-17)
  if (!headline) {
    const lines = chunk.split(/\n/).map(l => l.trim()).filter(l =>
      l.length > 5 && l.length < 200 &&
      !/^Library ID/i.test(l) &&
      !/^\d{5,}$/.test(l) &&
      !/started running|ran from|active for/i.test(l)
    );
    headline = lines[0] || null;
  }

  // impression_bucket: pattern in text chunk (EU DSA view)
  if (!impression_bucket) {
    const m = chunk.match(/(under\s*1[,.]?000|<\s*1[,.]?000|[\d.,]+[KM]?\s*[-–]\s*[\d.,]+[KM]?|[\d.,]+[KM]\+)/i);
    impression_bucket = m ? m[0].trim() : null;
  }

  // platforms: pattern in text chunk
  if (!platforms) {
    const m = chunk.match(/(?:Platforms?:?\s*)((?:Facebook|Instagram|Messenger|WhatsApp|Audience Network)(?:[,\s/]+(?:Facebook|Instagram|Messenger|WhatsApp|Audience Network))*)/i);
    platforms = m ? m[1].trim() : null;
  }

  return { ...ad, destination_url, cta_text, headline, impression_bucket, platforms };
}

function parseAdsFromText(blob, cardDataMap) {
  if (!blob) return [];
  const today = new Date().toISOString().slice(0, 10);
  const ads = [];
  const DATE = /([A-Z][a-z]{2,8}\.?\s+\d{1,2},\s+\d{4})/;
  const parts = blob.split(/Library ID:?\s*/i).slice(1); // drop preamble before first ID
  for (const part of parts) {
    try {
      const idm = part.match(/^(\d{5,})/);
      if (!idm) continue;
      const library_id = idm[1];
      // A "Mon D, YYYY - Mon D, YYYY" range means the ad has stopped → second date is end_date.
      const range = part.match(new RegExp(DATE.source + /\s*[-–—]\s*/.source + DATE.source));
      let start_date = null, end_date = null;
      if (range) {
        start_date = toISO(range[1]);
        end_date = toISO(range[2]);
      } else {
        const sm = part.match(new RegExp(/Started running on\s+/.source + DATE.source, 'i'));
        if (sm) start_date = toISO(sm[1]);
      }
      // never-fabricate (D-10): no parseable start → null run_length, never a guess.
      const run_length_days = start_date ? daysBetween(start_date, end_date || today) : null;
      const text = part.replace(/\s+/g, ' ').trim().slice(0, 1200);

      // D-06: binding-spine fields. Pull from cardDataMap (DOM extract) if available,
      // then text-chunk fallback. never-fabricate: null if unparseable.
      const domCard = cardDataMap ? cardDataMap.get(library_id) : null;
      const destination_url = domCard ? (domCard.destination_url || null) : null;
      const cta_text = domCard ? (domCard.cta_text || null) : null;
      let headline = domCard ? (domCard.headline || null) : null;
      let impression_bucket = domCard ? (domCard.impression_bucket || null) : null;
      let platforms = domCard ? (domCard.platforms || null) : null;

      // Text-chunk fallback for fields still null after DOM extraction
      const partialAd = { library_id, start_date, end_date, run_length_days, text,
                          destination_url, cta_text, headline, impression_bucket, platforms };
      const filledAd = textFallbackFields(partialAd, part);

      ads.push(filledAd);
    } catch (e) { /* skip a malformed card, keep the rest */ }
  }
  return ads;
}
function mergeAds(a, b) {
  const byId = new Map();
  for (const ad of [...a, ...b]) {
    const prev = byId.get(ad.library_id);
    if (!prev) byId.set(ad.library_id, ad);
    else if (!prev.end_date && ad.end_date) byId.set(ad.library_id, ad); // prefer the record carrying an end_date
  }
  return [...byId.values()];
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
  let textAll = '';
  let cardMapActive = new Map();
  let cardMapAll = new Map();
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

      // D-06: Extract per-card DOM data (binding-spine fields) from the active pass.
      // extractAdCards runs inside page.evaluate; results are merged with text-parse output.
      // TODO(D-17): calibrate selectors against live DOM during the debug-run pass.
      let activeCardData = [];
      try {
        activeCardData = await extractAdCards(page);
      } catch (e) {
        status += ' | active-card-extract error: ' + e.message.slice(0, 80);
      }

      // D-20 stopped-ad pass: active_status=all surfaces ads that have STOPPED (they
      // carry an end_date → a full run_length_days), which the active-only pass can
      // never see. Feeds the D-08 cause-of-death read. The active pass above remains
      // the source for active_ad_count, so that aggregate's meaning is unchanged.
      let allCardData = [];
      try {
        await page.goto(
          `https://www.facebook.com/ads/library/?active_status=all&ad_type=all` +
            `&country=ALL&view_all_page_id=${resolved.pageId}&media_type=all`,
          { waitUntil: 'domcontentloaded', timeout: 45000 }
        );
        await page.waitForTimeout(6500);
        for (let i = 0; i < 6; i++) {
          await page.mouse.wheel(0, 3200);
          await page.waitForTimeout(1400);
        }
        textAll = await page.evaluate(() => document.body.innerText);
        // D-06: Extract per-card DOM data from the all-ads pass as well.
        try {
          allCardData = await extractAdCards(page);
        } catch (e) {
          status += ' | all-card-extract error: ' + e.message.slice(0, 80);
        }
      } catch (e) {
        status += ' | all-pass error: ' + e.message;
      }

      // Build card data maps (library_id -> card) for both passes.
      cardMapActive = new Map(activeCardData.map(c => [c.library_id, c]));
      cardMapAll = new Map(allCardData.map(c => [c.library_id, c]));
    }
  } catch (e) {
    status = 'error: ' + e.message;
  }
  await browser.close();

  // D-20: structured per-ad records merged across the active + stopped-ad passes,
  // de-duped by library_id (prefer the record carrying an end_date).
  // D-06: pass card data maps so parseAdsFromText can attach binding-spine fields.
  const ads = mergeAds(parseAdsFromText(text, cardMapActive), parseAdsFromText(textAll, cardMapAll));

  const candLines = candidates
    .map((c) => `  ${c.pageId} | score=${c._score != null ? c._score.toFixed(1) : '-'} | ${c.text.replace(/\n/g, ' / ')}`)
    .join('\n');

  // Emit structured ads/<brand>.json (spec scaffold contract)
  const adJson = {
    slug,
    brand_query: brand,
    status,
    resolved_advertiser: resolved
      ? { name: resolved._name, pageId: resolved.pageId, followers: resolved._followers }
      : null,
    active_ad_count: count,
    library_ids_loaded: loaded,
    ads,
  };
  fs.writeFileSync(path.join(OUT, `${slug}.json`), JSON.stringify(adJson, null, 2));

  // Keep _adv.txt for debug
  fs.writeFileSync(
    path.join(OUT, `${slug}_adv.txt`),
    `# ${slug}\nbrand_query: ${brand}\nstatus: ${status}\n` +
      `resolved_advertiser: ${resolved ? `${resolved._name} (pageID ${resolved.pageId}, ${resolved._followers} followers)` : 'NONE'}\n` +
      `active_ad_count: ${count}\nlibrary_ids_loaded: ${loaded}\n\n` +
      `TYPEAHEAD CANDIDATES:\n${candLines || '  (none — forced pageId or no matches)'}\n\n--- ADS DUMP ---\n${text}`
  );
  console.log(
    `${slug}: status=${status} | resolved=${resolved ? resolved._name + ' (' + resolved.pageId + ')' : 'NONE'} | active_ads=${count} | structured_ads=${ads.length}`
  );
})();
