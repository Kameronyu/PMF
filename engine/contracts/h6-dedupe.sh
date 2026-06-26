#!/usr/bin/env bash
# h6-dedupe.sh — HARDENING H6: smoke dedupe (engine/bricks/dedupe.js).
# Asserts: rows sharing a normalized domain merge into one (alpha + alpha-dup both
# resolve to host "examplecom"), output brand count < input count, NO duplicate
# normalized domains remain, top-level shape (starting_point/brands/dropped) preserved,
# and the merged row keeps the richest channel (crowdfunding > dtc) + unions found_by.
# Reads the committed fixture runs/_fixture/brands.json; writes to a transient dir removed at end.
# Exit 0 = all asserts pass; non-zero names the failing assert.
set -u
cd "$(dirname "$0")/../.." || exit 1

FX="runs/_fixture/brands.json"
OUT="runs/_fixture-dedupe"
OUTFILE="${OUT}/brands.json"
FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

rm -rf "$OUT"; mkdir -p "$OUT"

echo "── H6.dedupe: node dedupe.js --in=${FX} --out=${OUTFILE} ──"
node engine/bricks/dedupe.js --in="$FX" --out="$OUTFILE" >/dev/null 2>&1

if [ ! -s "$OUTFILE" ]; then bad "no/empty dedupe output"; echo "H6 dedupe: FAILED"; rm -rf "$OUT"; exit 1; fi
ok "dedupe output exists"

node -e '
const fs=require("fs");
const inp=JSON.parse(fs.readFileSync("'"$FX"'","utf8"));
const out=JSON.parse(fs.readFileSync("'"$OUTFILE"'","utf8"));
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
const norm=u=>{try{let s=u.trim();if(!/^https?:\/\//i.test(s))s="https://"+s;return new URL(s).hostname.replace(/^www\./i,"").toLowerCase().replace(/[^a-z0-9]+/g,"");}catch(e){return null;}};
// shape preserved
["starting_point","brands","dropped"].every(k=>k in out) ? ok("top-level shape preserved") : bad("shape lost");
// count shrank
(out.brands.length < inp.brands.length) ? ok("count "+inp.brands.length+" -> "+out.brands.length+" (merged)") : bad("count did not shrink");
// no dup normalized domains
const keys=out.brands.map(b=>norm(b.url));
const dups=keys.filter((k,i)=>k&&keys.indexOf(k)!==i);
dups.length===0 ? ok("no duplicate normalized domains") : bad("duplicate domains: "+dups.join(","));
// merged example row: examplecom keeps richest channel crowdfunding + union found_by
const merged=out.brands.find(b=>norm(b.url)==="examplecom");
if(!merged){bad("merged examplecom row missing");}
else{
  merged.channel==="crowdfunding" ? ok("merged row kept richest channel (crowdfunding)") : bad("wrong channel: "+merged.channel);
  (merged.found_by.includes("finder-a")&&merged.found_by.includes("finder-b")) ? ok("found_by unioned") : bad("found_by not unioned: "+JSON.stringify(merged.found_by));
}
process.exit(fail);
' || FAIL=1

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 dedupe: ALL ASSERTS PASS ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 dedupe: FAILED — see the named assert above"; exit 1; fi
