#!/usr/bin/env node
/* cf-migrate-dns.js — reconcile arduview.com DNS in Cloudflare for the GoDaddy->Cloudflare move.
 * Ensures Shopify + Klaviyo records exist; deletes GoDaddy-email records (we're moving email to
 * Cloudflare Email Routing). Idempotent. Uses .cloudflare-creds.json token.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const TOKEN = JSON.parse(fs.readFileSync(path.join(__dirname, '.cloudflare-creds.json'), 'utf8')).api_token;
const ZONE = 'ca2dc248af59ce0741ec842c09f1c85b';

function api(method, p, body) {
  return new Promise((res, rej) => {
    const req = https.request({ method, hostname: 'api.cloudflare.com', path: '/client/v4' + p,
      headers: { Authorization: 'Bearer ' + TOKEN, 'Content-Type': 'application/json' } }, r => {
      let d = ''; r.on('data', c => d += c).on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(new Error(d.slice(0, 300))); } });
    });
    req.on('error', rej);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// desired records to ENSURE exist
const want = [
  { type: 'A', name: 'arduview.com', content: '23.227.38.65', proxied: false, ttl: 1 },
  { type: 'CNAME', name: 'www', content: 'shops.myshopify.com', proxied: false, ttl: 1 },
  { type: 'NS', name: 'send', content: 'ns1.klaviyo.com', ttl: 1 },
  { type: 'NS', name: 'send', content: 'ns2.klaviyo.com', ttl: 1 },
  { type: 'NS', name: 'send', content: 'ns3.klaviyo.com', ttl: 1 },
  { type: 'NS', name: 'send', content: 'ns4.klaviyo.com', ttl: 1 },
  { type: 'TXT', name: 'arduview.com', content: 'klaviyo-site-verification=SvpLu3', ttl: 1 },
];

(async () => {
  const list = await api('GET', `/zones/${ZONE}/dns_records?per_page=200`);
  if (!list.success) { console.log('LIST FAIL', JSON.stringify(list.errors)); process.exit(1); }
  const have = list.result;
  const norm = s => (s || '').replace(/^"|"$/g, '').replace(/\.$/, '').toLowerCase();
  console.log('current records:');
  have.forEach(r => console.log(`  [${r.id.slice(0,8)}] ${r.type} ${r.name} -> ${norm(r.content)}`));

  // 1. ensure desired exist
  console.log('\n--- ensuring desired records ---');
  for (const w of want) {
    const exists = have.find(r => r.type === w.type && norm(r.name) === norm(w.name === 'arduview.com' ? 'arduview.com' : w.name + '.arduview.com') && norm(r.content) === norm(w.content));
    if (exists) { console.log(`ok exists: ${w.type} ${w.name} ${w.content}`); continue; }
    const r = await api('POST', `/zones/${ZONE}/dns_records`, w);
    console.log(r.success ? `ADDED: ${w.type} ${w.name} ${w.content}` : `ADD FAIL ${w.type} ${w.name} ${w.content}: ${JSON.stringify(r.errors)}`);
  }

  // 2. delete GoDaddy-email records (moving email to Cloudflare Routing)
  console.log('\n--- deleting GoDaddy email records ---');
  const killIf = r =>
    (r.type === 'MX' && /secureserver\.net/i.test(r.content)) ||
    (r.type === 'SRV' && /secureserver\.net/i.test(r.content || JSON.stringify(r.data || {}))) ||
    (r.type === 'SRV' && /_autodiscover/i.test(r.name)) ||
    (r.type === 'TXT' && /include:secureserver\.net/i.test(r.content)) ||
    (r.type === 'CNAME' && /secureserver\.net|\.dkim\./i.test(r.content)) ||
    (r.type === 'CNAME' && /^autodiscover|^email\b/i.test(r.name));
  for (const r of have.filter(killIf)) {
    const d = await api('DELETE', `/zones/${ZONE}/dns_records/${r.id}`);
    console.log(d.success ? `DELETED: ${r.type} ${r.name} -> ${norm(r.content)}` : `DEL FAIL ${r.id}: ${JSON.stringify(d.errors)}`);
  }

  console.log('\n--- final records ---');
  const fin = await api('GET', `/zones/${ZONE}/dns_records?per_page=200`);
  fin.result.forEach(r => console.log(`  ${r.type} ${r.name} -> ${norm(r.content)}${r.proxied ? ' (proxied)' : ''}`));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
