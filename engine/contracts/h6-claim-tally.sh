#!/usr/bin/env bash
# h6-claim-tally.sh — HARDENING H6: smoke funnel-claim-tally (engine/bricks/funnel-claim-tally.js).
# GOLDEN COMPARE: re-run the tally over the committed fixture funnel store
# (runs/_fixture/funnels/, which holds sample.json) and assert the output equals the
# committed golden runs/_fixture/funnels/_tally.json EXACTLY, modulo _meta.generated_at
# (the only volatile field — a timestamp). Output goes to a transient dir; the golden is
# never overwritten (no-overwrite-v1). Exit 0 = byte-match; non-zero = the diff is shown.
set -u
cd "$(dirname "$0")/../.." || exit 1

GOLDEN="runs/_fixture/funnels/_tally.json"
OUT="runs/_fixture-tally"
FRESH="${OUT}/_tally.json"
FAIL=0

rm -rf "$OUT"; mkdir -p "$OUT"

echo "── H6.claim-tally: node funnel-claim-tally.js --space=_fixture --out=${FRESH} ──"
node engine/bricks/funnel-claim-tally.js --space=_fixture --out="$FRESH" >/dev/null 2>&1

if [ ! -s "$FRESH" ]; then echo "   FAIL: no/empty tally output"; echo "H6 claim-tally: FAILED"; rm -rf "$OUT"; exit 1; fi

node -e '
const fs=require("fs");
const strip=o=>{const c=JSON.parse(JSON.stringify(o)); if(c._meta) delete c._meta.generated_at; return c;};
const g=strip(JSON.parse(fs.readFileSync("'"$GOLDEN"'","utf8")));
const f=strip(JSON.parse(fs.readFileSync("'"$FRESH"'","utf8")));
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
// substantive equality (deterministic sort means the serialization is stable)
JSON.stringify(g)===JSON.stringify(f) ? ok("golden byte-match (modulo _meta.generated_at)") : bad("golden MISMATCH vs "+"'"$GOLDEN"'");
// spot the load-bearing facts in case the above ever needs triage
(f._meta.total_funnels===1 && f._meta.total_move_keys===14) ? ok("_meta: 1 funnel, 14 move keys") : bad("_meta counts off: "+JSON.stringify(f._meta));
(f.dead_ground.length===0 && f.whitespace.length===14) ? ok("classification: 0 dead ground / 14 whitespace (below threshold 5)") : bad("classification off");
process.exit(fail);
' || FAIL=1

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 claim-tally: GOLDEN MATCH ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 claim-tally: FAILED — see above"; exit 1; fi
