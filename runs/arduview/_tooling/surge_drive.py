#!/usr/bin/env python3
# Deploy ./site to a live surge.sh URL, non-interactively.
# surge's email/password prompt needs a real TTY (piping stdin fails),
# so we spawn it inside a pty and feed credentials when the prompt appears.
# Usage: python3 surge_drive.py   (run from the site folder, or set CWD below)
import os, pty, time, sys, select

SITE = '/home/kyu3/PMF/runs/arduview/site'
DOMAIN = 'arduview-see-through.surge.sh'
EMAIL = b'kameronyu0612@gmail.com\n'
PW    = b'Arduview2026demo!\n'          # throwaway host account; change at surge.sh

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
