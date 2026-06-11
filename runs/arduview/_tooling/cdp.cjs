#!/usr/bin/env node
/* cdp.cjs — drive the user's real Windows Chrome from WSL over RAW CDP.
 *
 * Why raw CDP (not Playwright connectOverCDP): connectOverCDP attaches at the
 * browser level and HANGS on newer Chrome builds (browser_ui omnibox targets,
 * shared workers). Raw CDP connects straight to ONE page target and never sees
 * those — robust. Needs Node's global WebSocket (re-execs with the flag on v20).
 *
 * Prereq (README-ops.md §A): Chrome with --remote-debugging-port=9333 + the
 * win-chrome-forwarder.py bridging 0.0.0.0:9334 -> 127.0.0.1:9333.
 * HOST defaults to WSL gateway IP; override CDP_HOST / CDP_PORT.
 *
 * Tab pick: --tab=<index|url-substr> (default: first page target).
 * Verbs:
 *   status | tabs                  list page targets
 *   goto <url>                     navigate + wait for load
 *   shot [path]                    screenshot png (default /tmp/win.png)
 *   text [selector]                innerText (pierces shadow DOM; default body)
 *   html [selector]                outerHTML (default documentElement)
 *   attr <selector> <name>         element attribute / property value
 *   click <selector>              deep-query + .click()
 *   clicktext <text>              click most-specific element containing text (prefers button/a)
 *   fill <selector> <value>       React-safe value set + input/change events
 *   press <key>                    Enter | Tab | Escape ... (Input.dispatchKeyEvent)
 *   waitfor <selector> [ms]       poll until deep-query finds it (default 15000)
 *   waiturl <substr> [ms]         poll until target url contains substr
 *   eval <js>                      Runtime.evaluate (returnByValue, awaits promise)
 *
 * Examples:
 *   node cdp.cjs status
 *   node cdp.cjs --tab=dev.shopify clicktext "Create app"
 *   node cdp.cjs --tab=j873ra-dj eval "document.title"
 */
if (typeof WebSocket === 'undefined') {
  const { spawnSync } = require('child_process');
  const r = spawnSync(process.execPath, ['--experimental-websocket', __filename, ...process.argv.slice(2)], { stdio: 'inherit' });
  process.exit(r.status === null ? 1 : r.status);
}

const http = require('http');
const fs = require('fs');
const { execSync } = require('child_process');

function gatewayIP() {
  try { return execSync("ip route show default | awk '{print $3}'").toString().trim(); }
  catch { return '172.29.192.1'; }
}
const HOST = process.env.CDP_HOST || gatewayIP();
const PORT = parseInt(process.env.CDP_PORT || '9334', 10);

function httpJSON(path) {
  return new Promise((res, rej) => {
    http.get({ host: HOST, port: PORT, path, timeout: 8000 }, r => {
      let d = ''; r.on('data', c => d += c).on('end', () => { try { res(JSON.parse(d)); } catch (e) { rej(e); } });
    }).on('error', rej).on('timeout', () => rej(new Error('http timeout')));
  });
}

// one WS per page target; auto-increment command ids; resolve by id
function connect(wsUrl) {
  return new Promise((res, rej) => {
    const ws = new WebSocket(wsUrl);
    const pending = new Map();
    let idc = 0;
    ws.onopen = () => res({
      send(method, params = {}) {
        const id = ++idc;
        return new Promise((rs, rj) => {
          pending.set(id, { rs, rj });
          ws.send(JSON.stringify({ id, method, params }));
          setTimeout(() => { if (pending.has(id)) { pending.delete(id); rj(new Error('cmd timeout ' + method)); } }, 30000);
        });
      },
      close() { try { ws.close(); } catch {} },
    });
    ws.onmessage = (m) => {
      const msg = JSON.parse(m.data);
      if (msg.id && pending.has(msg.id)) {
        const { rs, rj } = pending.get(msg.id); pending.delete(msg.id);
        msg.error ? rj(new Error(msg.error.message)) : rs(msg.result);
      }
    };
    ws.onerror = (e) => rej(new Error('ws error ' + (e.message || '')));
  });
}

// JS injected into the page: deep (shadow-piercing) helpers live on a temp global
const HELPERS = `
(function(){
  if (window.__cdp) return;
  function deepQ(sel, root){ root=root||document;
    let f=root.querySelector(sel); if(f) return f;
    const els=root.querySelectorAll('*');
    for(const el of els){ if(el.shadowRoot){ const r=deepQ(sel, el.shadowRoot); if(r) return r; } }
    return null;
  }
  function deepAll(root, acc){ root=root||document; acc=acc||[];
    const els=root.querySelectorAll('*');
    for(const el of els){ acc.push(el); if(el.shadowRoot) deepAll(el.shadowRoot, acc); }
    return acc;
  }
  function byText(txt, exact){
    const all=deepAll();
    let cands=all.filter(el=>{
      const t=(el.textContent||'').trim();
      return exact ? t===txt : t.includes(txt);
    });
    // most specific = shortest textContent
    cands.sort((a,b)=>(a.textContent||'').length-(b.textContent||'').length);
    return cands[0]||null;
  }
  function clickable(el){
    let n=el;
    while(n){ const tag=n.tagName&&n.tagName.toLowerCase();
      if(tag==='button'||tag==='a'||n.getAttribute&&(n.getAttribute('role')==='button'||n.onclick)) return n;
      n=n.parentElement||(n.getRootNode&&n.getRootNode().host);
    }
    return el;
  }
  function setVal(el, val){
    const proto = el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype;
    const setter = Object.getOwnPropertyDescriptor(proto,'value').set;
    setter.call(el, val);
    el.dispatchEvent(new Event('input',{bubbles:true}));
    el.dispatchEvent(new Event('change',{bubbles:true}));
  }
  window.__cdp={deepQ,deepAll,byText,clickable,setVal};
})();`;

(async () => {
  const argv = process.argv.slice(2);
  let tabSel = null; const rest = [];
  for (const a of argv) { if (a.startsWith('--tab=')) tabSel = a.slice(6); else rest.push(a); }
  const cmd = rest[0] || 'status';
  const arg = rest[1];
  const arg2 = rest.slice(2).join(' ');

  const list = (await httpJSON('/json/list')).filter(t => t.type === 'page');
  if (cmd === 'status' || cmd === 'tabs') {
    list.forEach((t, i) => console.log(`[${i}] ${t.url}`));
    process.exit(0);
  }
  let tgt;
  if (tabSel === null) tgt = list[0];
  else if (/^\d+$/.test(tabSel)) tgt = list[parseInt(tabSel, 10)];
  else tgt = list.find(t => t.url.includes(tabSel)) || list[0];
  if (!tgt) { console.error('ERR no matching tab'); process.exit(1); }

  const wsUrl = tgt.webSocketDebuggerUrl.replace(/ws:\/\/[^/]+/, `ws://${HOST}:${PORT}`);
  const c = await connect(wsUrl);

  async function evil(expr, awaitP = true) {
    const r = await c.send('Runtime.evaluate', { expression: `(()=>{${HELPERS}; return (${expr});})()`, returnByValue: true, awaitPromise: awaitP });
    if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text);
    return r.result.value;
  }

  const out = {};
  try {
    switch (cmd) {
      case 'goto':
        await c.send('Page.enable');
        await c.send('Page.navigate', { url: arg });
        await new Promise(r => setTimeout(r, 2500));
        break;
      case 'shot': {
        const r = await c.send('Page.captureScreenshot', { format: 'png' });
        const path = arg || '/tmp/win.png';
        fs.writeFileSync(path, Buffer.from(r.data, 'base64'));
        out.shot = path; break;
      }
      case 'text': out.text = await evil(`(window.__cdp.deepQ(${JSON.stringify(arg || 'body')})||document.body).innerText`); break;
      case 'html': out.html = await evil(`(window.__cdp.deepQ(${JSON.stringify(arg || 'html')})||document.documentElement).outerHTML`); break;
      case 'attr': out.attr = await evil(`(()=>{const e=window.__cdp.deepQ(${JSON.stringify(arg)});if(!e)return null;return e[${JSON.stringify(arg2)}]!==undefined?e[${JSON.stringify(arg2)}]:e.getAttribute(${JSON.stringify(arg2)})})()`); break;
      case 'click': out.click = await evil(`(()=>{const e=window.__cdp.deepQ(${JSON.stringify(arg)});if(!e)return 'NOT FOUND';e.scrollIntoView({block:'center'});e.click();return 'clicked'})()`); break;
      case 'clicktext': out.click = await evil(`(()=>{let e=window.__cdp.byText(${JSON.stringify(arg)},true)||window.__cdp.byText(${JSON.stringify(arg)},false);if(!e)return 'NOT FOUND';e=window.__cdp.clickable(e);e.scrollIntoView({block:'center'});e.click();return 'clicked: '+e.tagName})()`); break;
      case 'fill': out.fill = await evil(`(()=>{const e=window.__cdp.deepQ(${JSON.stringify(arg)});if(!e)return 'NOT FOUND';e.focus();window.__cdp.setVal(e,${JSON.stringify(arg2)});return 'filled'})()`); break;
      case 'press': {
        const keyMap = { Enter: { key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13 }, Tab: { key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 }, Escape: { key: 'Escape', code: 'Escape', windowsVirtualKeyCode: 27 } };
        const k = keyMap[arg] || { key: arg, code: arg };
        await c.send('Input.dispatchKeyEvent', { type: 'keyDown', ...k });
        await c.send('Input.dispatchKeyEvent', { type: 'keyUp', ...k });
        out.press = arg; break;
      }
      case 'waitfor': {
        const ms = parseInt(arg2 || '15000', 10); const t0 = Date.now(); let ok = false;
        while (Date.now() - t0 < ms) { if (await evil(`!!window.__cdp.deepQ(${JSON.stringify(arg)})`)) { ok = true; break; } await new Promise(r => setTimeout(r, 400)); }
        out.waitfor = ok ? 'found' : 'TIMEOUT'; break;
      }
      case 'waiturl': {
        const ms = parseInt(arg2 || '15000', 10); const t0 = Date.now(); let ok = false;
        while (Date.now() - t0 < ms) { const u = await evil('location.href'); if (u.includes(arg)) { ok = true; break; } await new Promise(r => setTimeout(r, 400)); }
        out.waiturl = ok ? 'matched' : 'TIMEOUT'; break;
      }
      case 'eval': out.result = await evil(arg); break;
      default: break;
    }
  } catch (e) {
    console.error('ERR', cmd, '->', String(e.message).split('\n')[0]);
    c.close(); process.exit(1);
  }

  const url = await evil('location.href').catch(() => tgt.url);
  console.log('ACTIVE:', url);
  for (const k of Object.keys(out)) {
    const v = out[k];
    console.log(`${k.toUpperCase()}:`, typeof v === 'string' ? v : JSON.stringify(v, null, 2));
  }
  c.close(); process.exit(0);
})().catch(e => { console.error('FATAL', e.message); process.exit(1); });
