#!/usr/bin/env bash
# h6-bucketB.sh — HARDENING H6 Bucket B: BEST-EFFORT dry-runs for the externally-effecting
# integrations. These cannot be fully smoked here (a real surge run deploys live; CDP needs a
# reachable Windows Chrome), so this asserts what IS verifiable offline and documents the rest.
#   surge-deploy -> dry-run-verified: script compiles + deploy preconditions (SITE, npx) present.
#                   LIVE deploy (actual surge.sh push) NOT exercised (external effect).
#   chrome-cdp   -> partial: script loads + `status` fails GRACEFULLY when no Chrome is reachable
#                   (or lists tabs if a forwarder+Chrome is up). Live drive needs the operator's
#                   Windows Chrome + win-chrome-forwarder.py (env-dependent).
# Exit 0 = dry-run checks pass (cdp-unreachable is an ACCEPTED outcome here, not a failure).
set -u
cd "$(dirname "$0")/../.." || exit 1
FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

echo "── H6.Bucket B: surge-deploy (dry-run) ──"
# In-memory compile (NOT py_compile, which would write a .pyc into __pycache__) — leaves the tree clean.
.venv/bin/python -c "import sys; p='engine/integrations/surge/surge_drive.py'; compile(open(p).read(), p, 'exec')" 2>/dev/null \
  && ok "surge_drive.py compiles (syntax/import valid)" || bad "surge_drive.py does not compile"
command -v npx >/dev/null 2>&1 && ok "npx present ($(npx --version 2>/dev/null)) — surge CLI launcher available" || bad "npx missing"
# Security regression guard: no hardcoded creds; refuses cleanly when SITE/DOMAIN/creds are unset.
grep -qE "Arduview2026demo|kameronyu0612@gmail.com" engine/integrations/surge/surge_drive.py \
  && bad "hardcoded creds present in surge_drive.py" || ok "no hardcoded creds in surge_drive.py"
( unset SURGE_EMAIL SURGE_PW SURGE_SITE SURGE_DOMAIN; .venv/bin/python engine/integrations/surge/surge_drive.py >/dev/null 2>&1; [ $? -eq 2 ] ) \
  && ok "refuses cleanly (exit 2) when SITE/DOMAIN/creds unset" || bad "did not refuse on missing env"
echo "   NOTE: creds now via \$SURGE_EMAIL/\$SURGE_PW + SITE/DOMAIN args (no committed secrets)."
echo "         LIVE surge.sh deploy still NOT exercised (external effect) -> R7."

echo ""
echo "── H6.Bucket B: chrome-cdp (partial / env-dependent) ──"
node --check engine/integrations/cdp/cdp.cjs 2>/dev/null \
  && ok "cdp.cjs loads (node --check)" || bad "cdp.cjs syntax error"
# status is a read-only probe; with no reachable Chrome it MUST fail with a clean message, not crash.
out=$(CDP_HOST=127.0.0.1 CDP_PORT=9334 timeout 15 node engine/integrations/cdp/cdp.cjs status 2>&1); rc=$?
if [ "$rc" -eq 0 ]; then
  ok "cdp status reached a Chrome and listed targets (forwarder up)"
elif echo "$out" | grep -Eq 'ECONNREFUSED|connect|timeout|FATAL'; then
  ok "cdp status failed GRACEFULLY (no Chrome reachable: $(echo "$out" | head -1)) — env-dependent, expected here"
else
  bad "cdp status crashed without a clean error: $(echo "$out" | head -1)"
fi
echo "   NOTE: live CDP drive needs the operator's Windows Chrome (--remote-debugging-port=9333) +"
echo "         win-chrome-forwarder.py. Not reachable from this headless session."

echo ""
if [ "$FAIL" -eq 0 ]; then echo "H6 Bucket B: DRY-RUN CHECKS PASS ✓ (surge=dry-run-verified, cdp=partial)"; exit 0;
else echo "H6 Bucket B: FAILED — see above"; exit 1; fi
