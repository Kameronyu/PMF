#!/usr/bin/env node
/* kl.js — minimal Klaviyo API client for the InkLeaf account (.klaviyo-inkleaf-creds.json).
 * Usage:
 *   node kl.js GET  /api/metrics/
 *   node kl.js POST /api/segments/ '{...json...}'
 * Body can be a literal JSON string or @path/to/file.json. Prints status + parsed JSON.
 * Revision pinned to 2024-10-15 (override via env KL_REV).
 */
const https = require('https');
const fs = require('fs');
const path = require('path');
const KEY = JSON.parse(fs.readFileSync(path.join(__dirname, '.klaviyo-inkleaf-creds.json'), 'utf8')).private_key;
const REV = process.env.KL_REV || '2024-10-15';

const method = process.argv[2] || 'GET';
const p = process.argv[3];
let body = process.argv[4];
if (body && body.startsWith('@')) body = fs.readFileSync(body.slice(1), 'utf8');

const opts = {
  method,
  hostname: 'a.klaviyo.com',
  path: p,
  headers: {
    'Authorization': 'Klaviyo-API-Key ' + KEY,
    'revision': REV,
    'accept': 'application/json',
    'content-type': 'application/json',
  },
};
const req = https.request(opts, r => {
  let d = '';
  r.on('data', c => d += c).on('end', () => {
    console.log('HTTP', r.statusCode);
    try { console.log(JSON.stringify(JSON.parse(d), null, 2)); }
    catch (e) { console.log(d.slice(0, 1000)); }
  });
});
req.on('error', e => { console.error('ERR', e.message); process.exit(1); });
if (body) req.write(body);
req.end();
