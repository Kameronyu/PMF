#!/usr/bin/env node
// tools/funnel-assemble.js
// §2b binding spine: normalize destination URLs → cluster ads → render each LP via Playwright
// → emit one funnel_package per URL cluster.
//
// Deterministic script — not an agent (CLAUDE.md one-job-per-brick law).
// This is the load-bearing assembler: it DEFINES the funnel unit by clustering ads on the
// normalized destination URL. Get URL normalization wrong and one funnel splatters into ten (D-04).
//
// Usage:
//   node tools/funnel-assemble.js <ads-json> [--competitor=<name>] [--source-type=DTC|crowdfunding]
//                                 [--out=./funnels] [--crowdfund-lps=<file>] [--help]
//
// Inputs:
//   <ads-json>           Path to the ads/<slug>.json produced by adlib-one.js (extended with D-06 fields)
//   --competitor         Competitor name (defaults to slug from ads JSON)
//   --source-type        DTC or crowdfunding (from PMF stage output; market-agnostic — D-02)
//   --out                Output directory for funnel_package JSON files (default: ./funnels)
//   --crowdfund-lps      Optional: path to a JSON file with hand-fed crowdfunding LP URLs
//                        (D-19: assembler ACCEPTS hand-fed list; does NOT discover CF sources)
//   --help               Show this help
//
// Output:
//   <out>/<funnel_id>.json   One funnel_package per distinct normalized destination LP
//   <out>/_funnel-assemble-log.txt  Sidecar log (resilient-batch — one bad LP never aborts)
//
// Threat mitigations implemented (see plan threat model):
//   T-03-01 (SSRF): Before goto, normalizeUrl + SSRF guard rejects private/loopback/metadata hosts.
//   T-03-02 (DoS): Hard timeout on goto (60s) + networkidle (30s); per-funnel try/catch; one bad
//                   page never aborts the batch; "Read more" expansion click count capped.

'use strict';

const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const dns = require('dns').promises;
const net = require('net');
const crypto = require('crypto');

// ---------------------------------------------------------------------------
// CLI arg parse (positional + --flag=val — canonical adlib-one.js pattern)
// ---------------------------------------------------------------------------
const rawArgs = process.argv.slice(2);
const flagArgs = rawArgs.filter(a => a.startsWith('--'));
const posArgs  = rawArgs.filter(a => !a.startsWith('--'));

const opts = Object.fromEntries(
  flagArgs.map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);

if (opts.help) {
  console.log(
    'Usage: node tools/funnel-assemble.js <ads-json> [--competitor=<name>]\n' +
    '       [--source-type=DTC|crowdfunding] [--out=./funnels]\n' +
    '       [--crowdfund-lps=<file>] [--help]\n' +
    '\n' +
    'Normalize destination URLs, cluster ads into funnels, render each LP via Playwright,\n' +
    'and emit one funnel_package per URL cluster (§2b binding spine).\n' +
    '\n' +
    '  <ads-json>        ads/<slug>.json from adlib-one.js (with D-06 binding fields)\n' +
    '  --competitor      Competitor name (default: slug from ads JSON)\n' +
    '  --source-type     DTC or crowdfunding (from PMF stage; market-agnostic D-02)\n' +
    '  --out             Output directory (default: ./funnels)\n' +
    '  --crowdfund-lps   JSON file with hand-fed crowdfunding LP URLs (D-19)\n' +
    '  --help            Show this help\n'
  );
  process.exit(0);
}

const adsJsonPath = posArgs[0];
if (!adsJsonPath) {
  console.error('usage: node tools/funnel-assemble.js <ads-json> [--competitor=<name>] ...');
  process.exit(1);
}

const OUT      = opts.out || './funnels';
const SRC_TYPE = opts['source-type'] || null;
const CF_LPS   = opts['crowdfund-lps'] || null;

// ---------------------------------------------------------------------------
// normalizeUrl — strips tracking params, lowercases host, drops trailing slash,
// normalizes protocol to https. This normalization IS the clustering key (D-04).
// Tolerant pure fn (slugifyPath style): returns null on unparseable input.
// ---------------------------------------------------------------------------
function normalizeUrl(raw) {
  if (!raw || typeof raw !== 'string') return null;
  try {
    // Normalize protocol
    let urlStr = raw.trim();
    if (urlStr.startsWith('//')) urlStr = 'https:' + urlStr;
    if (!/^https?:\/\//i.test(urlStr)) urlStr = 'https://' + urlStr;

    const u = new URL(urlStr);

    // Force https
    u.protocol = 'https:';

    // Strip tracking params (utm_* and fbclid)
    const toDelete = [];
    for (const key of u.searchParams.keys()) {
      if (/^utm_/i.test(key) || key === 'fbclid') toDelete.push(key);
    }
    for (const k of toDelete) u.searchParams.delete(k);

    // Lowercase host
    u.hostname = u.hostname.toLowerCase();

    // Drop trailing slash on pathname (but keep root '/')
    if (u.pathname.length > 1 && u.pathname.endsWith('/')) {
      u.pathname = u.pathname.replace(/\/+$/, '');
    }

    return u.toString();
  } catch (_) {
    return null;
  }
}

// ---------------------------------------------------------------------------
// SSRF guard (T-03-01) — before Playwright navigates to a destination URL,
// check the host is not a private/loopback/link-local/metadata IP range.
// Returns true if the URL is SAFE to navigate; false if it should be skipped.
// Only http/https schemes are allowed.
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
  // navigation hop, which substantially reduces the effective attack window (the attacker
  // would need the rebind to fire within a single request's DNS TTL, against two
  // independent resolvers). Full pinning (navigate-by-IP + Host header override) is not
  // practical with Playwright's high-level API without a custom proxy. Residual risk
  // accepted and documented; the interceptor is the primary enforcement layer.
  try {
    const u = new URL(urlStr);
    if (u.protocol !== 'https:' && u.protocol !== 'http:') return false;
    const host = u.hostname;

    // Raw IP check
    if (net.isIP(host)) return !isPrivateIp(host);

    // DNS resolve — check all returned addresses
    try {
      const addrs = await dns.lookup(host, { all: true });
      for (const { address } of addrs) {
        if (isPrivateIp(address)) return false;
      }
    } catch (_) {
      // DNS failure — skip the URL rather than fail open
      return false;
    }

    return true;
  } catch (_) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// isAmbiguousDestination — linktree / homepage / generic hub detection.
// Returns true if the URL should be flagged ambiguous_destination rather than
// treated as a dedicated LP (D-05).
// ---------------------------------------------------------------------------
const AMBIGUOUS_PATTERNS = [
  /linktree\.com/i,
  /linktr\.ee/i,
  /linkpop\.com/i,
  /beacons\.ai/i,
  /bio\.site/i,
  /tap\.bio/i,
];

function isAmbiguousDestination(urlStr) {
  if (!urlStr) return false;
  try {
    const u = new URL(urlStr);
    // Match known link-in-bio services
    if (AMBIGUOUS_PATTERNS.some(re => re.test(u.hostname))) return true;
    // Homepage = no meaningful path (just '/' or empty)
    if (u.pathname === '/' || u.pathname === '') return true;
    return false;
  } catch (_) {
    return false;
  }
}

// ---------------------------------------------------------------------------
// fetchPage — verbatim copy from tools/fetch.js lines 333-367.
// CF-clear loop + networkidle + "Read more" expansion + page.content().
// T-03-02: hard timeouts (goto 60s, networkidle 30s); "Read more" clicks capped at 20.
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
  // T-03-02: cap clicks to avoid hostile infinite-expand loops
  const expandSelectors = [
    'button:has-text("Read more")',
    'button:has-text("Show more")',
    'button:has-text("Load more")',
    'a:has-text("Read more")',
    '[aria-label="Read more"]',
  ];
  let clickCount = 0;
  for (const sel of expandSelectors) {
    if (clickCount >= 20) break; // T-03-02: hard cap
    try {
      const btns = await page.$$(sel);
      for (const b of btns) {
        if (clickCount >= 20) break;
        await b.click({ timeout: 2000 }).catch(() => {});
        await page.waitForTimeout(400);
        clickCount++;
      }
    } catch (_) {}
  }

  const html = await page.content();
  const title = await page.title().catch(() => '');
  return { html, title };
}

// ---------------------------------------------------------------------------
// clusterAdsByUrl — Map-by-key idiom (mergeAds pattern, adlib-one.js 124-132).
// Key = normalizeUrl(destination_url). Returns Map<normalizedUrl, ad[]>.
// Ads with null or ambiguous destination are collected separately.
// ---------------------------------------------------------------------------
function clusterAdsByUrl(ads) {
  const clusters = new Map();      // normalizedUrl -> ad[]
  const ambiguous = [];            // ads with null or ambiguous destination

  for (const ad of ads) {
    const norm = normalizeUrl(ad.destination_url);
    if (!norm) {
      ambiguous.push(ad);
      continue;
    }
    if (isAmbiguousDestination(norm)) {
      ambiguous.push({ ...ad, _ambiguous_reason: 'linktree-or-homepage' });
      continue;
    }
    if (!clusters.has(norm)) clusters.set(norm, []);
    clusters.get(norm).push(ad);
  }

  return { clusters, ambiguous };
}

// ---------------------------------------------------------------------------
// buildBoundAd — maps an ad record to the funnel_package bound_ads[] shape (§2b).
// never-fabricate: any missing field = null.
// ---------------------------------------------------------------------------
function buildBoundAd(ad) {
  return {
    ad_creative_ref: ad.library_id || null,
    primary_text:    ad.text       || null,
    headline:        ad.headline   || null,
    cta_text:        ad.cta_text   || null,
    started_running_date: ad.start_date || null,
    impression_bucket:    ad.impression_bucket || null,
    platforms:            ad.platforms || null,
  };
}

// ---------------------------------------------------------------------------
// generateFunnelId — deterministic short id from competitor + normalizedUrl.
// ---------------------------------------------------------------------------
function generateFunnelId(competitor, normalizedUrl) {
  const hash = crypto.createHash('sha1')
    .update(competitor + '|' + (normalizedUrl || ''))
    .digest('hex')
    .slice(0, 8);
  return `funnel_${hash}`;
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------
(async () => {
  fs.mkdirSync(OUT, { recursive: true });

  // --- Load ads JSON ---
  let adsData;
  try {
    adsData = JSON.parse(fs.readFileSync(adsJsonPath, 'utf8'));
  } catch (e) {
    console.error(`[funnel-assemble] ERROR: cannot read ads JSON at ${adsJsonPath} — ${e.message}`);
    process.exit(1);
  }

  const slug       = adsData.slug || path.basename(adsJsonPath, '.json');
  const competitor = opts.competitor || adsData.resolved_advertiser?.name || slug;
  const source_type = SRC_TYPE || 'DTC';
  const ads = adsData.ads || [];

  // --- Load hand-fed crowdfunding LPs (D-19) ---
  // Assembler ACCEPTS a hand-fed list; it does NOT discover CF sources.
  let crowdfundLps = [];
  if (CF_LPS) {
    try {
      const raw = JSON.parse(fs.readFileSync(CF_LPS, 'utf8'));
      crowdfundLps = Array.isArray(raw) ? raw : (raw.lps || []);
    } catch (e) {
      console.warn(`[funnel-assemble] WARN: cannot read crowdfund-lps at ${CF_LPS} — ${e.message}`);
    }
  }

  // --- Cluster ads by normalized destination URL ---
  const { clusters, ambiguous } = clusterAdsByUrl(ads);

  const results = [];
  const errors  = [];

  // --- Launch Playwright browser with fingerprint masking ---
  // Browser/context boilerplate verbatim from fetch.js lines 414-439.
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

  // Light fingerprint masking (verbatim from fetch.js / crowdfund-fetch.js)
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver',  { get: () => undefined });
    Object.defineProperty(navigator, 'languages',  { get: () => ['en-US', 'en'] });
    Object.defineProperty(navigator, 'plugins',    { get: () => [1, 2, 3, 4, 5] });
  });

  // T-03-01 (WR-01): Re-validate EVERY navigation/redirect target against the SSRF guard.
  // ssrfGuard() only checks the initial URL; page.goto follows 30x redirects to the final
  // host. Register a request interceptor so each hop is checked. If the redirected host
  // resolves to a private range, abort the navigation before the browser connects.
  // Raw-IP case handled inline (synchronous) to avoid abort-after-connect timing issues.
  await context.route('**/*', async (route) => {
    const reqUrl = route.request().url();
    try {
      const u = new URL(reqUrl);
      // Only gate http/https navigations (allow data:, blob:, etc. through)
      if (u.protocol !== 'https:' && u.protocol !== 'http:') return route.continue();
      // Raw-IP: check synchronously — if private, abort immediately
      if (net.isIP(u.hostname)) {
        if (isPrivateIp(u.hostname)) return route.abort();
        return route.continue();
      }
      // DNS-resolved host: re-run the full ssrfGuard on each hop
      const safe = await ssrfGuard(reqUrl);
      if (!safe) return route.abort();
    } catch (_) {
      // Unparseable URL — abort to fail closed
      return route.abort();
    }
    return route.continue();
  });

  // --- Process each ad-url cluster → one funnel_package ---
  for (const [landing_page_url, clusterAds] of clusters) {
    const funnel_id = generateFunnelId(competitor, landing_page_url);
    let landing_page_body = null;
    let renderError = null;

    // T-03-01: SSRF guard — reject private/metadata hosts before navigating.
    const safe = await ssrfGuard(landing_page_url);
    if (!safe) {
      const msg = `[SKIP] funnel_id=${funnel_id} url=${landing_page_url} — SSRF guard: private/metadata host rejected`;
      results.push(msg);
      errors.push(msg);
      console.log(msg);
      // Emit the package with ambiguous_destination flag instead of skipping entirely,
      // so the log captures it and downstream knows why there's no body.
      const pkg = {
        funnel_id,
        competitor,
        source_type,
        landing_page_url,
        landing_page_body: null,
        ambiguous_destination: true,
        _ambiguous_reason: 'ssrf-guard-rejected',
        bound_ads: clusterAds.map(buildBoundAd),
        variant_count: clusterAds.length,
        crowdfunding_stats: null,
      };
      fs.writeFileSync(path.join(OUT, `${funnel_id}.json`), JSON.stringify(pkg, null, 2));
      continue;
    }

    // Resilient-batch: per-funnel try/catch — one hostile/slow page never aborts the batch (T-03-02).
    const page = await context.newPage();
    try {
      const { html } = await fetchPage(page, landing_page_url);
      landing_page_body = html;
    } catch (e) {
      renderError = e.message.slice(0, 200);
      errors.push(`[LP-RENDER-ERROR] funnel_id=${funnel_id} url=${landing_page_url} — ${renderError}`);
    } finally {
      await page.close();
    }

    // Build the §2b funnel_package
    const funnel_package = {
      funnel_id,
      competitor,
      source_type,
      landing_page_url,
      landing_page_body,         // raw rendered HTML (null on render error)
      bound_ads: clusterAds.map(buildBoundAd),
      variant_count: clusterAds.length,
      crowdfunding_stats: null,  // populated by crowdfund-fetch.js Currency-B parser (D-07)
      _render_error: renderError || undefined,
    };

    const outPath = path.join(OUT, `${funnel_id}.json`);
    fs.writeFileSync(outPath, JSON.stringify(funnel_package, null, 2));

    const line = `[OK] funnel_id=${funnel_id} url=${landing_page_url} ads=${clusterAds.length} rendered=${landing_page_body !== null}`;
    results.push(line);
    console.log(line);
  }

  // --- Process hand-fed crowdfunding LPs (D-19) — zero-ad funnels ---
  // A crowdfunding LP with no Meta ads is a VALID funnel (empty bound_ads[]).
  // Validation comes from Currency B (amount_raised / backers) via crowdfund-fetch.js.
  // WR-04: track only actually-written funnels (skipped entries must not inflate the count).
  let cfWritten = 0;
  for (const lpEntry of crowdfundLps) {
    const rawUrl = typeof lpEntry === 'string' ? lpEntry : lpEntry.url;
    const cfMeta  = typeof lpEntry === 'object' ? lpEntry : {};
    const norm    = normalizeUrl(rawUrl);

    if (!norm) {
      const msg = `[SKIP-CF] url=${rawUrl} — cannot normalize URL`;
      results.push(msg);
      errors.push(msg);
      console.log(msg);
      continue;
    }

    if (isAmbiguousDestination(norm)) {
      const msg = `[SKIP-CF] url=${norm} — ambiguous_destination (linktree/homepage)`;
      results.push(msg);
      errors.push(msg);
      console.log(msg);
      continue;
    }

    // T-03-01: SSRF guard for hand-fed CL LPs too
    const safe = await ssrfGuard(norm);
    if (!safe) {
      const msg = `[SKIP-CF] url=${norm} — SSRF guard rejected`;
      results.push(msg);
      errors.push(msg);
      console.log(msg);
      continue;
    }

    // Skip if we already produced a funnel for this URL from the ad clusters
    const funnel_id = generateFunnelId(competitor, norm);
    const existingPath = path.join(OUT, `${funnel_id}.json`);
    let existingPkg = null;
    if (fs.existsSync(existingPath)) {
      try { existingPkg = JSON.parse(fs.readFileSync(existingPath, 'utf8')); } catch (_) {}
    }

    let landing_page_body = existingPkg ? existingPkg.landing_page_body : null;
    let renderError = null;

    if (!landing_page_body) {
      const page = await context.newPage();
      try {
        const { html } = await fetchPage(page, norm);
        landing_page_body = html;
      } catch (e) {
        renderError = e.message.slice(0, 200);
        errors.push(`[CF-LP-RENDER-ERROR] funnel_id=${funnel_id} url=${norm} — ${renderError}`);
      } finally {
        await page.close();
      }
    }

    const funnel_package = {
      funnel_id,
      competitor: cfMeta.competitor || competitor,
      source_type: 'crowdfunding',
      landing_page_url: norm,
      landing_page_body,
      bound_ads: [],             // zero-ad crowdfunding funnel — valid per §2b
      variant_count: 0,
      crowdfunding_stats: cfMeta.crowdfunding_stats || null,
      _render_error: renderError || undefined,
      _note: 'Hand-fed crowdfunding LP (D-19). Validation via Currency B (crowdfund-fetch.js).',
    };

    fs.writeFileSync(path.join(OUT, `${funnel_id}.json`), JSON.stringify(funnel_package, null, 2));
    cfWritten = cfWritten + 1; // WR-04: count only actually-written CF funnels

    const line = `[CF-OK] funnel_id=${funnel_id} url=${norm} bound_ads=0 rendered=${landing_page_body !== null}`;
    results.push(line);
    console.log(line);
  }

  // --- Log ambiguous destinations (D-05) — do NOT force into funnels ---
  if (ambiguous.length > 0) {
    const ambigLine = `[AMBIGUOUS] ${ambiguous.length} ads had null or ambiguous destination_url — stamped ambiguous_destination, not assembled into funnels`;
    results.push(ambigLine);
    console.log(ambigLine);
    // Write an ambiguous_destinations.json sidecar for downstream audit
    fs.writeFileSync(
      path.join(OUT, 'ambiguous_destinations.json'),
      JSON.stringify({
        _note: 'Ads with null or linktree/homepage destination_url. Not assembled into funnels (D-05).',
        ambiguous_destination: true,
        ads: ambiguous.map(a => ({
          ad_creative_ref: a.library_id || null,
          destination_url: a.destination_url || null,
          _ambiguous_reason: a._ambiguous_reason || 'null-destination',
        })),
      }, null, 2)
    );
  }

  await browser.close();

  // --- Write sidecar log (resilient-batch pattern, fetch.js line 548) ---
  const logPath = path.join(OUT, '_funnel-assemble-log.txt');
  fs.writeFileSync(logPath, results.join('\n') + '\n');

  // One-line console summary
  // WR-04: use cfWritten (actually written) not crowdfundLps.length (input list length)
  const funnelCount = clusters.size + cfWritten;
  console.log(
    `[funnel-assemble] done — competitor=${competitor} funnels=${funnelCount} errors=${errors.length} ambiguous=${ambiguous.length}`
  );
})();
