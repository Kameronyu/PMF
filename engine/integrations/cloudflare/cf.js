#!/usr/bin/env node
/* cf.js — minimal Cloudflare API client (uses .cloudflare-creds.json token).
 * Usage:
 *   node cf.js GET  /zones?name=arduview.com
 *   node cf.js POST /zones/<id>/dns_records '{"type":"A","name":"@","content":"1.2.3.4","proxied":false}'
 *   node cf.js DELETE /zones/<id>/dns_records/<rid>
 * Prints { success, errors, result } compactly. Token via env CF_TOKEN overrides file.
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const TOKEN = process.env.CF_TOKEN || JSON.parse(fs.readFileSync(path.join(__dirname, '.cloudflare-creds.json'), 'utf8')).api_token;

const method = process.argv[2] || 'GET';
const p = process.argv[3];
const body = process.argv[4];

const opts = {
  method,
  hostname: 'api.cloudflare.com',
  path: '/client/v4' + p,
  headers: { 'Authorization': 'Bearer ' + TOKEN, 'Content-Type': 'application/json' },
};
const req = https.request(opts, r => {
  let d = '';
  r.on('data', c => d += c).on('end', () => {
    try {
      const j = JSON.parse(d);
      console.log(JSON.stringify({ success: j.success, errors: j.errors, messages: j.messages, result: j.result }, null, 2));
    } catch (e) { console.log('RAW', d.slice(0, 500)); }
  });
});
req.on('error', e => { console.error('ERR', e.message); process.exit(1); });
if (body) req.write(body);
req.end();
