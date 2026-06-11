# Arduview ops — reusable infra (so it's never re-figured)

## A. Drive the real Windows Chrome from WSL (CDP)

Use the user's actual Chrome (NOT Playwright's bundled "Chrome for Testing" — Google/Shopify
block the testing build as automation). Steps:

1. **Launch real Chrome on Windows** with a debug port + isolated profile (from WSL):
   ```bash
   nohup "/mnt/c/Program Files/Google/Chrome/Application/chrome.exe" \
     --remote-debugging-port=9333 --remote-debugging-address=0.0.0.0 \
     --remote-allow-origins='*' --user-data-dir='C:\Users\kyu3\arduview-cdp' \
     --no-first-run --no-default-browser-check \
     'https://admin.shopify.com/store/useinkleaf' >/tmp/winchrome.log 2>&1 &
   ```
   Chrome ignores `0.0.0.0` and binds `127.0.0.1:9333` anyway (confirm: `cmd.exe /c "netstat -ano -p tcp | findstr 9333"`).

2. **Start the forwarder with WINDOWS python** (bridges loopback → WSL-reachable):
   ```bash
   cp win-chrome-forwarder.py /mnt/c/Users/kyu3/arduview-fwd.py   # one-time
   nohup "/mnt/c/Users/kyu3/AppData/Local/Programs/Python/Python311/python.exe" \
     'C:\Users\kyu3\arduview-fwd.py' >/tmp/fwd.log 2>&1 &
   ```

3. **Find the Windows gateway IP** from WSL: `ip route show default | awk '{print $3}'` (was `172.29.192.1`).

4. **Verify:** `curl -s http://172.29.192.1:9334/json/version` → returns a Windows-UA Chrome.

5. **Drive it** with `drive.cjs` (uses `connectOverCDP`, rewriting the advertised
   `ws://127.0.0.1` host to the gateway:9334 — Chrome advertises loopback which WSL can't reach):
   ```bash
   node /home/kyu3/PMF/drive.cjs shot /tmp/win.png      # status + screenshot
   ```

Gotchas: Playwright lives at `/home/kyu3/node_modules/playwright` (require the absolute path).
Headed browser in WSL works via WSLg `DISPLAY=:0`; `WebGL blocklisted` warnings are harmless.

## B. Deploy the static site to a live URL (surge.sh)

`surge`'s credential prompt needs a real TTY (piping fails). `surge_drive.py` spawns it in a pty
and feeds creds. Live URL: **https://arduview-see-through.surge.sh**.

```bash
# refresh the site, then deploy:
python3 /home/kyu3/PMF/runs/arduview/_tooling/surge_drive.py
```
Account: kameronyu0612@gmail.com (throwaway host pw in the script — change at surge.sh).
Redeploy hits the same URL. Downscale photos to ~1600px/q82 first to keep uploads small.

## C. Share a static folder WITHOUT a host
Opening `index.html` from *inside* a zip strips CSS/images (siblings not extracted).
Either host it (B) or tell recipients: **Extract All, then open index.html.** Never in-zip double-click.
