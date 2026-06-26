#!/usr/bin/env bash
# h6-revenue.sh — HARDENING H6: smoke revenue-estimate (engine/bricks/revenue-est.js).
# Reuses runs/_fixture/brands.json. Asserts the deterministic arithmetic + the D-10
# never-fabricate rule:
#   - alpha: 300000 visits x 0.02 CVR x $60 AOV = 360000 (traffic_formula) — the code's worked example
#   - gamma: 1200 reviews x 10 x $40 = 480000 (review_proxy)
#   - every brand carries a revenue_est object (value numeric where computable, explicit null else)
#   - NO "PENDING" anywhere (the InkLeaf failure this rule exists to prevent)
# Writes to a transient dir removed at end. Exit 0 = all pass; non-zero names the failure.
set -u
cd "$(dirname "$0")/../.." || exit 1

FX="runs/_fixture/brands.json"
OUT="runs/_fixture-revenue"
OUTFILE="${OUT}/brands.json"
FAIL=0

rm -rf "$OUT"; mkdir -p "$OUT"

echo "── H6.revenue: node revenue-est.js --in=${FX} --out=${OUTFILE} ──"
node engine/bricks/revenue-est.js --in="$FX" --out="$OUTFILE" >/dev/null 2>&1

if [ ! -s "$OUTFILE" ]; then echo "   FAIL: no/empty output"; echo "H6 revenue: FAILED"; rm -rf "$OUT"; exit 1; fi

node -e '
const fs=require("fs");
const out=JSON.parse(fs.readFileSync("'"$OUTFILE"'","utf8"));
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
const by=s=>out.brands.find(b=>b.slug===s);
// every brand has a complete revenue_est object
const complete=out.brands.every(b=>b.revenue_est && ["value_usd_monthly","method","confidence","inputs","notes"].every(k=>k in b.revenue_est));
complete ? ok("every brand has a revenue_est object (value/method/confidence/inputs/notes)") : bad("a brand is missing revenue_est fields");
// worked example: alpha traffic_formula = 360000
const a=by("alpha").revenue_est;
(a.value_usd_monthly===360000 && a.method==="traffic_formula") ? ok("alpha = 360000 traffic_formula (300000x0.02x$60)") : bad("alpha wrong: "+JSON.stringify(a.value_usd_monthly)+"/"+a.method);
// review proxy: gamma
const g=by("gamma").revenue_est;
(g.value_usd_monthly===480000 && g.method==="review_proxy") ? ok("gamma = 480000 review_proxy (1200x10x$40)") : bad("gamma wrong: "+JSON.stringify(g.value_usd_monthly)+"/"+g.method);
// never-fabricate: value_usd_monthly is ALWAYS a number or explicit null — never the string "PENDING".
// (The literal word "PENDING" appears only in the note text documenting the rule; that is fine.)
const badVals=out.brands.filter(b=>{const v=b.revenue_est.value_usd_monthly;return !(typeof v==="number"||v===null);});
badVals.length===0 ? ok("no value_usd_monthly is a string/PENDING (D-10 never-fabricate)") : bad("non-numeric/non-null value: "+JSON.stringify(badVals.map(b=>b.slug)));
const b=by("beta").revenue_est;
(b.value_usd_monthly===null && b.method===null) ? ok("beta uncomputable -> explicit null (not PENDING)") : bad("beta should be explicit null: "+JSON.stringify(b.value_usd_monthly));
// at least one numeric
out.brands.some(x=>typeof x.revenue_est.value_usd_monthly==="number") ? ok("at least one numeric value") : bad("no numeric values");
process.exit(fail);
' || FAIL=1

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 revenue: ALL ASSERTS PASS ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 revenue: FAILED — see the named assert above"; exit 1; fi
