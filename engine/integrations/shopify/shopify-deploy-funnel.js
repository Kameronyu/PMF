#!/usr/bin/env node
/* shopify-deploy-funnel.js — turn a standalone multi-page HTML funnel into a live Shopify
 * storefront: custom slim layout + per-page Liquid templates + asset files, pushed via the
 * Theme Asset API, then create the matching Online Store pages.
 *
 * DURABLE / generic. Driven entirely by a config JSON (see CONFIG below / pass as argv[2]).
 * It does NOT read any handoff doc — the recipe lives here as code.
 *
 * What it does per page:
 *   - extract <body>…</body> inner markup (drops doctype/html/head/script-src wrappers)
 *   - rewrite local asset paths (assets/img|video/NAME) -> uploaded CDN urls / overrides
 *   - rewrite cross-page links (index.html/deposit.html -> /pages/<handle>)
 *   - rewrite the checkout CTA href -> the Shopify cart permalink
 *   - emit templates/page.<suffix>.liquid = `{% layout %}` + body
 * Shared files emitted once: layout/<name>.liquid (slim, no theme header/footer),
 *   assets/<name>.css (verbatim), assets/<name>.js (scroll-reveal + Klaviyo subscribe).
 *
 * Usage: node shopify-deploy-funnel.js [config.json]
 *   creds from .shopify-creds.json ; default config = Arduview (below).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const { loadCreds, positionals } = require('../lib-creds');
// #cred-seam: --creds=<path> → env SHOPIFY_CREDS → __dirname default.
const CRED = loadCreds(__dirname, '.shopify-creds.json', 'SHOPIFY_CREDS');
const API = `https://${CRED.store}/admin/api/${CRED.api_version}`;

// ---- default config (Arduview) ----
const DEFAULT = {
  siteDir: path.resolve(__dirname, '../site'),
  urlMap: '/tmp/arduview-url-map.json',          // {basename: cdn_url} from shopify-upload-assets.js
  assetOverrides: { 'hero.mp4': 'https://arduview-see-through.surge.sh/assets/video/hero.mp4' },
  themeId: null,                                  // null -> main theme
  ns: 'arduview',                                 // layout/css/js base name
  klaviyo: { company_id: 'SvpLu3', list_id: 'XdSSdg' },  // separate Arduview Klaviyo account (was UguyM6/SPniwZ in InkLeaf acct)
  checkoutUrl: '/cart/42581886599253:1',
  pages: [
    { file: 'index.html',   handle: 'arduview',         title: 'Arduview',         suffix: 'arduview-landing', role: 'landing' },
    { file: 'deposit.html', handle: 'arduview-deposit', title: 'Arduview Reserve', suffix: 'arduview-deposit', role: 'deposit'  },
  ],
};

function rest(method, p, body) {
  const tmp = `/tmp/rest-${Date.now()}-${Math.random().toString(36).slice(2)}.json`;
  let cmd = `curl -s -X ${method} ${JSON.stringify(API + p)} -H "X-Shopify-Access-Token: ${CRED.token}" -H "Content-Type: application/json"`;
  if (body) { fs.writeFileSync(tmp, JSON.stringify(body)); cmd += ` --data-binary @${tmp}`; }
  const out = execSync(cmd, { maxBuffer: 1 << 26 }).toString();
  if (body) fs.unlinkSync(tmp);
  try { return JSON.parse(out); } catch { return out; }
}

(async () => {
  const cfgArg = positionals()[0];
  const cfg = cfgArg ? { ...DEFAULT, ...JSON.parse(fs.readFileSync(cfgArg, 'utf8')) } : DEFAULT;
  const themeId = cfg.themeId || rest('GET', `/themes.json`).themes.find(t => t.role === 'main').id;
  console.log('theme:', themeId, '| ns:', cfg.ns);

  const imgMap = JSON.parse(fs.readFileSync(cfg.urlMap, 'utf8'));
  const assetMap = { ...imgMap, ...cfg.assetOverrides };

  const handleByFile = {};
  cfg.pages.forEach(p => { handleByFile[p.file] = p.handle; });

  function transformBody(html) {
    let body = html.slice(html.indexOf('<body>') + 6, html.lastIndexOf('</body>'));
    body = body.replace(/\s*<script\s+src=["'][^"']*["']><\/script>/gi, ''); // drop local script tags
    // asset paths -> cdn/override
    body = body.replace(/assets\/[a-z]+\/([\w.\-]+)/gi, (m, name) => assetMap[name] || m);
    // cross-page links
    for (const [file, handle] of Object.entries(handleByFile)) {
      body = body.split(`href="${file}"`).join(`href="/pages/${handle}"`);
    }
    // checkout CTA
    body = body.replace(/href="#"\s+data-checkout/gi, `href="${cfg.checkoutUrl}" data-checkout`);
    return body.trim();
  }

  // ---- shared layout ----
  const layout = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ page.title | default: shop.name }}</title>
  {%- if page.metafields.custom.description -%}<meta name="description" content="{{ page.metafields.custom.description }}">{%- endif -%}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Doto:wght@400;700;800;900&family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet">
  {{ '${cfg.ns}.css' | asset_url | stylesheet_tag }}
  <link rel="icon" type="image/svg+xml" href="{{ '${cfg.ns}.favicon.svg' | asset_url }}">
  {{ content_for_header }}
</head>
<body>
  {{ content_for_layout }}
  {{ '${cfg.ns}.js' | asset_url | script_tag }}
</body>
</html>`;

  // ---- shared js: scroll reveal + Klaviyo client subscribe (no private key needed) ----
  const js = `/* ${cfg.ns} storefront — scroll reveal + Klaviyo list subscribe + checkout passthrough */
(function(){
  "use strict";
  var KLAVIYO_COMPANY = ${JSON.stringify(cfg.klaviyo.company_id)};
  var KLAVIYO_LIST = ${JSON.stringify(cfg.klaviyo.list_id)};
  var AFTER_SIGNUP = "/pages/${cfg.pages.find(p=>p.role==='deposit') ? cfg.pages.find(p=>p.role==='deposit').handle : ''}";

  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:0.15,rootMargin:"0px 0px -8% 0px"});
    reveals.forEach(function(el){io.observe(el);});
  } else { reveals.forEach(function(el){el.classList.add("in");}); }

  var EMAIL_RE = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
  document.querySelectorAll(".cta__form").forEach(function(form){
    form.addEventListener("submit", function(ev){
      ev.preventDefault();
      var input = form.querySelector(".cta__input");
      var email = (input && input.value || "").trim();
      if (!EMAIL_RE.test(email)) { if(input){input.focus();} return; }
      var btn = form.querySelector("button,[type=submit]"); if(btn){btn.disabled=true;}
      fetch("https://a.klaviyo.com/client/subscriptions/?company_id=" + KLAVIYO_COMPANY, {
        method:"POST",
        headers:{"content-type":"application/json","revision":"2024-10-15"},
        body: JSON.stringify({data:{type:"subscription",attributes:{profile:{data:{type:"profile",attributes:{email:email}}}},relationships:{list:{data:{type:"list",id:KLAVIYO_LIST}}}}})
      }).then(function(){ if(AFTER_SIGNUP){ window.location.href = AFTER_SIGNUP; } else { form.innerHTML = "<p>you're on the list.</p>"; } })
        .catch(function(){ if(btn){btn.disabled=false;} alert("Something went wrong — try again."); });
    });
  });
})();`;

  // ---- assemble files ----
  const styles = fs.readFileSync(path.join(cfg.siteDir, 'styles.css'), 'utf8');
  const files = [
    { key: `layout/${cfg.ns}.liquid`, value: layout },
    { key: `assets/${cfg.ns}.css`, value: styles },
    { key: `assets/${cfg.ns}.js`, value: js },
  ];
  const favPath = path.join(cfg.siteDir, 'favicon.svg');
  if (fs.existsSync(favPath)) files.push({ key: `assets/${cfg.ns}.favicon.svg`, value: fs.readFileSync(favPath, 'utf8') });
  for (const p of cfg.pages) {
    const html = fs.readFileSync(path.join(cfg.siteDir, p.file), 'utf8');
    const tpl = `{% layout '${cfg.ns}' %}\n${transformBody(html)}`;
    files.push({ key: `templates/page.${p.suffix}.liquid`, value: tpl });
  }

  // ---- push assets ----
  for (const f of files) {
    const r = rest('PUT', `/themes/${themeId}/assets.json`, { asset: { key: f.key, value: f.value } });
    const ok = r.asset && r.asset.key;
    console.log(ok ? 'PUT  ok ' : 'PUT  FAIL ', f.key, ok ? '' : JSON.stringify(r).slice(0, 200));
  }

  // ---- create/update pages ----
  const existing = rest('GET', `/pages.json?limit=250`).pages || [];
  for (const p of cfg.pages) {
    const found = existing.find(e => e.handle === p.handle);
    const payload = { page: { title: p.title, handle: p.handle, template_suffix: p.suffix, published: true, body_html: '' } };
    let r;
    if (found) r = rest('PUT', `/pages/${found.id}.json`, { page: { id: found.id, ...payload.page } });
    else r = rest('POST', `/pages.json`, payload);
    const pg = r.page;
    console.log(pg ? `PAGE ok  /pages/${pg.handle}  (id ${pg.id}, suffix ${pg.template_suffix})` : 'PAGE FAIL ' + JSON.stringify(r).slice(0, 200));
  }
  console.log('\nDONE. Storefront:');
  cfg.pages.forEach(p => console.log(`  https://${CRED.store}/pages/${p.handle}`));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
