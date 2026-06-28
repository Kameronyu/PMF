#!/usr/bin/env bash
# h6-analyzer-context.sh — HARDENING H6: smoke funnel-analyzer-context
# (engine/bricks/funnel-analyzer-context.js). Asserts it assembles ONE context block =
# [DR bundle via inject-dr.js] + [funnel metadata] + [cleaned body inside <funnel_copy>].
# Uses the committed clean fixture; spawns inject-dr.js (DR files under ~/knowledge/dr-marketing/),
# capped via --max-chars so the smoke stays small. Output to a transient dir, removed at end.
# Exit 0 = block assembled with all required boundaries + verbatim body; non-zero names the gap.
set -u
cd "$(dirname "$0")/../.." || exit 1

CLEAN="engine/_fixture/funnels-clean/gameshell-kickstarter-clean.json"
OUT="engine/_fixture-anactx"
BLOCK="${OUT}/ctx.txt"
FAIL=0

rm -rf "$OUT"; mkdir -p "$OUT"

echo "── H6.analyzer-context: node funnel-analyzer-context.js --funnel=gameshell-kickstarter --clean=... ──"
node engine/bricks/funnel-analyzer-context.js \
  --funnel=gameshell-kickstarter --clean="$CLEAN" --max-chars=3000 --out="$BLOCK" >/dev/null 2>&1
rc=$?
if [ "$rc" -ne 0 ]; then echo "   FAIL: brick exited ${rc}"; echo "H6 analyzer-context: FAILED"; rm -rf "$OUT"; exit 1; fi
if [ ! -s "$BLOCK" ]; then echo "   FAIL: no/empty context block"; echo "H6 analyzer-context: FAILED"; rm -rf "$OUT"; exit 1; fi

node -e '
const fs=require("fs");
const b=fs.readFileSync("'"$BLOCK"'","utf8");
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
b.includes("SECTION ANALYZER CONTEXT") ? ok("analyzer-context header present") : bad("no analyzer-context header");
b.includes("DR MARKETING KNOWLEDGE FILES") ? ok("DR bundle spliced in (inject-dr reused)") : bad("DR bundle missing");
b.includes("FUNNEL FIELDS") && b.includes("funnel_id: gameshell-kickstarter") ? ok("funnel metadata block present") : bad("funnel metadata missing");
(b.includes("<funnel_copy>") && b.includes("</funnel_copy>")) ? ok("<funnel_copy> boundary present") : bad("funnel_copy boundary missing");
b.includes("Every part is a module") ? ok("cleaned body preserved verbatim inside boundary") : bad("cleaned body not embedded");
(b.length>1000) ? ok("assembled block non-trivial ("+b.length+" chars)") : bad("block too small ("+b.length+")");
process.exit(fail);
' || FAIL=1

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 analyzer-context: ALL ASSERTS PASS ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 analyzer-context: FAILED — see above"; exit 1; fi
