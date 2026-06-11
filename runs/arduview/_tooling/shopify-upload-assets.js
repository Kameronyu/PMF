#!/usr/bin/env node
/* shopify-upload-assets.js — upload local media to Shopify Files, return name->CDN-url map.
 *
 * DURABLE: works for any set of images/video. Handles the 3-step Files flow:
 *   1. stagedUploadsCreate  -> staged GCS targets (+ form params)
 *   2. multipart POST each file to its target (via curl -F; node has no native multipart)
 *   3. fileCreate           -> registers files, then POLL until CDN urls resolve
 *      (images resolve fast; VIDEO is async-processed, hashed url, must be polled)
 *
 * Usage: node shopify-upload-assets.js <dir> [out.json]
 *   reads creds from ./.shopify-creds.json ; uploads every file in <dir> (recursive one level
 *   for img/ + video/), writes {filename: cdn_url} to out.json (default url-map.json next to dir).
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CRED = JSON.parse(fs.readFileSync(path.join(__dirname, '.shopify-creds.json'), 'utf8'));
const GQL = `https://${CRED.store}/admin/api/${CRED.api_version}/graphql.json`;

function gql(query, variables) {
  const body = JSON.stringify({ query, variables });
  const tmp = `/tmp/gql-${Math.abs(hash(body))}.json`;
  fs.writeFileSync(tmp, body);
  const out = execSync(`curl -s -X POST ${JSON.stringify(GQL)} -H "X-Shopify-Access-Token: ${CRED.token}" -H "Content-Type: application/json" --data-binary @${tmp}`, { maxBuffer: 1 << 26 }).toString();
  fs.unlinkSync(tmp);
  const j = JSON.parse(out);
  if (j.errors) throw new Error('GQL: ' + JSON.stringify(j.errors));
  return j.data;
}
function hash(s){let h=0;for(let i=0;i<s.length;i++){h=(h*31+s.charCodeAt(i))|0}return h}

function mime(f) {
  const e = f.toLowerCase().split('.').pop();
  return { jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', gif:'image/gif', webp:'image/webp', svg:'image/svg+xml', mp4:'video/mp4', mov:'video/quicktime', webm:'video/webm' }[e] || 'application/octet-stream';
}
const isVideo = f => /^(video\/)/.test(mime(f));

(async () => {
  const dir = process.argv[2];
  const outPath = process.argv[3] || path.join(dir, 'url-map.json');
  if (!dir) { console.error('usage: shopify-upload-assets.js <dir> [out.json]'); process.exit(1); }

  // collect files (top dir + img/ + video/ subdirs)
  const files = [];
  const scan = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) scan(p);
    else if (mime(e.name) !== 'application/octet-stream') files.push(p);
  });
  scan(dir);
  console.log('files to upload:', files.map(f => path.basename(f)).join(', '));

  // 1. stagedUploadsCreate
  const input = files.map(f => ({
    filename: path.basename(f), mimeType: mime(f),
    resource: isVideo(f) ? 'VIDEO' : 'IMAGE', httpMethod: 'POST',
    fileSize: String(fs.statSync(f).size),
  }));
  const staged = gql(`mutation($input:[StagedUploadInput!]!){stagedUploadsCreate(input:$input){stagedTargets{url resourceUrl parameters{name value}} userErrors{field message}}}`, { input });
  const errs = staged.stagedUploadsCreate.userErrors;
  if (errs.length) throw new Error('staged: ' + JSON.stringify(errs));
  const targets = staged.stagedUploadsCreate.stagedTargets;

  // 2. multipart POST each file to its staged target (curl -F)
  const creates = [];
  for (let i = 0; i < files.length; i++) {
    const f = files[i], t = targets[i];
    const fields = t.parameters.map(p => `-F ${JSON.stringify(p.name + '=' + p.value)}`).join(' ');
    execSync(`curl -s -X POST ${JSON.stringify(t.url)} ${fields} -F "file=@${f}"`, { maxBuffer: 1 << 26 });
    creates.push({ originalSource: t.resourceUrl, contentType: isVideo(f) ? 'VIDEO' : 'IMAGE', alt: path.basename(f) });
    console.log('staged-posted:', path.basename(f));
  }

  // 3. fileCreate
  const created = gql(`mutation($files:[FileCreateInput!]!){fileCreate(files:$files){files{alt fileStatus ... on MediaImage{id image{url}} ... on Video{id sources{url}}} userErrors{field message}}}`, { files: creates });
  const ce = created.fileCreate.userErrors;
  if (ce.length) throw new Error('fileCreate: ' + JSON.stringify(ce));
  let made = created.fileCreate.files;
  const ids = made.map(m => m.id);

  // poll until all resolve to a CDN url
  const map = {};
  for (let attempt = 0; attempt < 40; attempt++) {
    const q = gql(`query($ids:[ID!]!){nodes(ids:$ids){... on MediaImage{id alt fileStatus image{url}} ... on Video{id alt fileStatus sources{url}}}}`, { ids });
    let pending = 0;
    for (const n of q.nodes) {
      if (!n) { pending++; continue; }
      const url = (n.image && n.image.url) || (n.sources && n.sources[0] && n.sources[0].url);
      if (url) map[n.alt] = url.split('?')[0];
      else pending++;
    }
    if (!pending) break;
    process.stdout.write(`waiting on ${pending} (attempt ${attempt + 1})\r`);
    execSync('sleep 3');
  }
  console.log('\nresolved', Object.keys(map).length, 'of', files.length);
  fs.writeFileSync(outPath, JSON.stringify(map, null, 2));
  console.log('wrote', outPath);
  console.log(JSON.stringify(map, null, 2));
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
