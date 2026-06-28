#!/usr/bin/env python3
# Deploy a static site dir to a live surge.sh URL, non-interactively.
# surge's email/password prompt needs a real TTY (piping stdin fails),
# so we spawn it inside a pty and feed credentials when the prompt appears.
#
# All run-specific values come from args/env — NO committed paths or credentials:
#   SITE   : positional arg 1, or $SURGE_SITE   (the site dir to deploy)
#   DOMAIN : positional arg 2, or $SURGE_DOMAIN (target <name>.surge.sh)
#   creds  : $SURGE_EMAIL + $SURGE_PW (REQUIRED; never hardcoded — use a throwaway host account)
# Usage: SURGE_EMAIL=.. SURGE_PW=.. python3 surge_drive.py <site-dir> <domain>
import os, pty, time, sys, select

_args  = [a for a in sys.argv[1:] if not a.startswith('-')]
SITE   = (_args[0] if len(_args) > 0 else os.environ.get('SURGE_SITE', '')).strip()
DOMAIN = (_args[1] if len(_args) > 1 else os.environ.get('SURGE_DOMAIN', '')).strip()
_email = os.environ.get('SURGE_EMAIL', '')
_pw    = os.environ.get('SURGE_PW', '')
_missing = [n for n, v in (('SITE/$SURGE_SITE', SITE), ('DOMAIN/$SURGE_DOMAIN', DOMAIN),
                           ('$SURGE_EMAIL', _email), ('$SURGE_PW', _pw)) if not v]
if _missing:
    sys.stderr.write('surge_drive: missing required input(s): ' + ', '.join(_missing) + '\n'
                     '  usage: SURGE_EMAIL=.. SURGE_PW=.. python3 surge_drive.py <site-dir> <domain>\n')
    sys.exit(2)
if not os.path.isdir(SITE):
    sys.stderr.write('surge_drive: site dir not found: ' + SITE + '\n'); sys.exit(2)
EMAIL = _email.encode() + b'\n'
PW    = _pw.encode() + b'\n'

argv = ['npx', '--yes', 'surge', '.', DOMAIN]
pid, fd = pty.fork()
if pid == 0:
    os.chdir(SITE)
    os.execvp(argv[0], argv)
else:
    buf = b''; sent = False; start = time.time()
    while True:
        if time.time() - start > 220:
            print('\n[TIMEOUT]'); os.write(fd, b'\x03'); break
        try:
            r, _, _ = select.select([fd], [], [], 1)
        except OSError:
            break
        if fd in r:
            try: data = os.read(fd, 4096)
            except OSError: break
            if not data: break
            sys.stdout.buffer.write(data); sys.stdout.flush()
            buf += data
            if not sent and b'email:' in buf.lower():
                time.sleep(0.4); os.write(fd, EMAIL)
                time.sleep(0.8); os.write(fd, PW)
                sent = True
        try:
            wpid, _ = os.waitpid(pid, os.WNOHANG)
            if wpid: break
        except ChildProcessError:
            break
