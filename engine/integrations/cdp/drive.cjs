const { chromium } = require('/home/kyu3/node_modules/playwright');
const http = require('http');
const HOST = '172.29.192.1', PORT = 9334;

function wsUrl() {
  return new Promise((res, rej) => {
    http.get(`http://${HOST}:${PORT}/json/version`, r => {
      let d = ''; r.on('data', c => d += c).on('end', () => {
        try {
          const u = JSON.parse(d).webSocketDebuggerUrl;
          res(u.replace(/ws:\/\/[^/]+/, `ws://${HOST}:${PORT}`));
        } catch (e) { rej(e); }
      });
    }).on('error', rej);
  });
}

(async () => {
  const cmd = process.argv[2] || 'status';
  const arg = process.argv[3];
  const b = await chromium.connectOverCDP(await wsUrl());
  const ctx = b.contexts()[0];
  const pages = ctx.pages();
  const p = pages.find(x => !x.url().startsWith('devtools://')) || pages[0];

  if (cmd === 'goto') { await p.goto(arg, { waitUntil: 'domcontentloaded' }); }
  if (cmd === 'shot') { await p.screenshot({ path: arg || '/tmp/win.png' }); }

  console.log('PAGES:', pages.map(x => x.url()).join('\n       '));
  console.log('ACTIVE URL:', p.url());
  console.log('TITLE:', await p.title());
  if (cmd === 'shot') console.log('shot ->', arg || '/tmp/win.png');
  process.exit(0);   // disconnect without closing the real browser
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
