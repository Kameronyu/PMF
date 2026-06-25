#!/usr/bin/env node
/* clickxy.cjs — real mouse click at CSS coordinates via raw CDP Input.dispatchMouseEvent.
 * Shopify Polaris/React ignores synthetic .click(); this sends a true mouse press+release.
 * Usage: node clickxy.cjs [--tab=<idx|substr>] <x> <y>   (x,y in CSS pixels, NOT screenshot px)
 * Screenshot px -> CSS: divide by devicePixelRatio (1.5 here). Also: type <text>, key <Key>.
 */
if (typeof WebSocket === 'undefined') {
  const { spawnSync } = require('child_process');
  const r = spawnSync(process.execPath, ['--experimental-websocket', __filename, ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(r.status === null ? 1 : r.status);
}
const http = require('http');
const { execSync } = require('child_process');
const HOST = process.env.CDP_HOST || (() => { try { return execSync("ip route show default | awk '{print $3}'").toString().trim(); } catch { return '172.29.192.1'; } })();
const PORT = parseInt(process.env.CDP_PORT || '9334', 10);

function httpJSON(path) {
  return new Promise((res, rej) => {
    http.get({ host: HOST, port: PORT, path, timeout: 8000 }, r => { let d=''; r.on('data',c=>d+=c).on('end',()=>{try{res(JSON.parse(d));}catch(e){rej(e);}}); }).on('error', rej).on('timeout', () => rej(new Error('http timeout')));
  });
}
function connect(wsUrl) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(wsUrl); const pending = new Map(); let idc = 0;
    ws.onopen = () => res({
      send(method, params={}) { const id=++idc; return new Promise((rs,rj)=>{ pending.set(id,{rs,rj}); ws.send(JSON.stringify({id,method,params})); setTimeout(()=>{if(pending.has(id)){pending.delete(id);rj(new Error('timeout '+method));}},30000); }); },
      close(){ try{ws.close();}catch{} },
    });
    ws.onmessage = m => { const msg=JSON.parse(m.data); if(msg.id&&pending.has(msg.id)){ const {rs,rj}=pending.get(msg.id); pending.delete(msg.id); msg.error?rj(new Error(msg.error.message)):rs(msg.result); } };
    ws.onerror = e => rej(new Error('ws '+(e.message||'')));
  });
}
(async () => {
  const argv = process.argv.slice(2); let tabSel=null; const rest=[];
  for (const a of argv) { if (a.startsWith('--tab=')) tabSel=a.slice(6); else rest.push(a); }
  const cmd = rest[0];
  const list = (await httpJSON('/json/list')).filter(t => t.type === 'page');
  let target = list[0];
  if (tabSel !== null) {
    const byIdx = /^\d+$/.test(tabSel) ? list[parseInt(tabSel,10)] : null;
    target = byIdx || list.find(t => (t.url||'').includes(tabSel)) || list[0];
  }
  const c = await connect(target.webSocketDebuggerUrl.replace(/ws:\/\/[^/]+/, `ws://${HOST}:${PORT}`));
  await c.send('Input.enable').catch(()=>{});
  if (cmd === 'type') {
    for (const ch of rest[1]) await c.send('Input.dispatchKeyEvent', { type:'char', text: ch });
    console.log('TYPED:', rest[1]);
  } else if (cmd === 'key') {
    const map = { Enter:{key:'Enter',code:'Enter',windowsVirtualKeyCode:13}, Tab:{key:'Tab',code:'Tab',windowsVirtualKeyCode:9}, Escape:{key:'Escape',code:'Escape',windowsVirtualKeyCode:27}, Backspace:{key:'Backspace',code:'Backspace',windowsVirtualKeyCode:8} };
    const k = map[rest[1]]; if (!k) { console.log('unknown key'); process.exit(1); }
    await c.send('Input.dispatchKeyEvent', { type:'keyDown', ...k });
    await c.send('Input.dispatchKeyEvent', { type:'keyUp', ...k });
    console.log('KEY:', rest[1]);
  } else {
    const x = parseFloat(rest[0]), y = parseFloat(rest[1]);
    await c.send('Input.dispatchMouseEvent', { type:'mouseMoved', x, y });
    await c.send('Input.dispatchMouseEvent', { type:'mousePressed', x, y, button:'left', clickCount:1 });
    await c.send('Input.dispatchMouseEvent', { type:'mouseReleased', x, y, button:'left', clickCount:1 });
    console.log('CLICK:', x, y, 'on', target.url);
  }
  c.close(); process.exit(0);
})().catch(e => { console.error('ERR', e.message); process.exit(1); });
