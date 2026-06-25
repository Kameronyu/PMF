# Run this with WINDOWS python (python.exe), NOT WSL python.
# It bridges Windows-loopback Chrome DevTools to an interface WSL can reach.
#
# WHY: real Chrome bound with --remote-debugging-port listens on 127.0.0.1 only
# (it ignores --remote-debugging-address=0.0.0.0). WSL2 (NAT mode) cannot reach
# Windows loopback. This forwarder listens on 0.0.0.0:9334 (reachable from WSL
# via the Windows gateway IP) and forwards to Chrome's 127.0.0.1:9333.
#
# Canonical path used this session: C:\Users\kyu3\arduview-fwd.py
import socket, threading

SRC = ("0.0.0.0", 9334)
DST = ("127.0.0.1", 9333)

def pipe(a, b):
    try:
        while True:
            d = a.recv(65536)
            if not d:
                break
            b.sendall(d)
    except OSError:
        pass
    finally:
        for s in (a, b):
            try: s.shutdown(socket.SHUT_RDWR)
            except OSError: pass

def handle(c):
    try:
        s = socket.create_connection(DST)
    except OSError:
        c.close(); return
    threading.Thread(target=pipe, args=(c, s), daemon=True).start()
    pipe(s, c)
    try: c.close()
    except OSError: pass

l = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
l.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
l.bind(SRC); l.listen(64)
print("fwd 0.0.0.0:9334 -> 127.0.0.1:9333", flush=True)
while True:
    c, _ = l.accept()
    threading.Thread(target=handle, args=(c,), daemon=True).start()
