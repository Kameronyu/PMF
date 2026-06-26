#!/usr/bin/env bash
# h5-e2e.sh — HARDENING H5: deterministic E2E coherence proof on engine/_fixture/.
# Runs the no-agent deterministic spine and asserts each output's required fields are non-null:
#   validate-analyzer (gate) → funnel-clean → funnel-score → funnel-store → funnel-vectorize → funnel-rag-query
# The agent step (Section Analyzer) is replaced by the committed golden fixture
# engine/_fixture/analyzer/gameshell-kickstarter-beliefs.json. fetch/funnel-assemble are
# live-DOM (covered by H3), so the chain starts from the committed funnel_package fixture.
# Products are written to a transient space engine/_fixture-e2e/ which is removed at the end.
# Exit 0 = all hops coherent; non-zero = the failing hop is named.
set -u
cd "$(dirname "$0")/../.." || exit 1   # repo root (engine/contracts/ -> repo)

SPACE="_fixture-e2e"
FX="engine/_fixture"
SCRATCH="runs/${SPACE}"
PKG="${FX}/funnels-assembled/gameshell-kickstarter.json"
BELIEFS="${FX}/analyzer/gameshell-kickstarter-beliefs.json"
FAIL=0
step() { echo ""; echo "── H5.$1 ──"; }
ok()   { echo "   PASS: $1"; }
bad()  { echo "   FAIL: $1"; FAIL=1; }

rm -rf "$SCRATCH"
mkdir -p "${SCRATCH}/funnels"

step "0 validate-analyzer GATE (golden beliefs → exit 0)"
node engine/hooks/validate-analyzer.js "$BELIEFS" >/dev/null 2>&1 \
  && ok "analyzer gate exit 0" || bad "analyzer gate did not pass"

step "1 funnel-clean (package → [SECTION]-marked body)"
node engine/bricks/funnel-clean.js "$PKG" --out="${SCRATCH}" >/dev/null 2>&1
node -e '
const fs=require("fs");const f="'"${SCRATCH}"'/gameshell-kickstarter-clean.json";
if(!fs.existsSync(f)){console.error("   FAIL: no clean output");process.exit(1);}
const c=JSON.parse(fs.readFileSync(f,"utf8"));
const n=(c.cleaned_body||"").length, secs=((c.cleaned_body||"").match(/\[SECTION\]/g)||[]).length;
if(n>0&&secs>=1){console.log("   PASS: cleaned_body "+n+" chars, "+secs+" [SECTION] markers");}
else{console.error("   FAIL: empty body or no [SECTION]");process.exit(1);}
' || FAIL=1

step "2 funnel-score (package → non-null validation_strength)"
node engine/bricks/funnel-score.js "$PKG" --out="${SCRATCH}" >/dev/null 2>&1
node -e '
const fs=require("fs");const f="'"${SCRATCH}"'/gameshell-kickstarter-scored.json";
if(!fs.existsSync(f)){console.error("   FAIL: no scored output");process.exit(1);}
const s=JSON.parse(fs.readFileSync(f,"utf8"));
const B=s.validation_strength&&s.validation_strength.B;
if(Array.isArray(s.validation_lane)&&s.validation_lane.length&&B&&B.amount_raised!=null){
  console.log("   PASS: lane="+s.validation_lane.join("+")+" B.amount_raised="+B.amount_raised);
}else{console.error("   FAIL: null/absent validation_strength");process.exit(1);}
' || FAIL=1

step "3 funnel-store (scored + golden beliefs → 6a non-null + belief_records)"
node engine/bricks/funnel-store.js --space="$SPACE" \
  --funnel="${SCRATCH}/gameshell-kickstarter-scored.json" --beliefs="$BELIEFS" >/dev/null 2>&1
node -e '
const fs=require("fs");const f="'"${SCRATCH}"'/funnels/gameshell-kickstarter.json";
if(!fs.existsSync(f)){console.error("   FAIL: no stored funnel");process.exit(1);}
const r=JSON.parse(fs.readFileSync(f,"utf8"));
const sixA=["primary_claim","claim_type","awareness_entry","funnel_sequence","offer_mechanic","urgency_construction"];
const nulls=sixA.filter(k=>r[k]==null);
if(nulls.length===0 && Array.isArray(r.belief_records) && r.belief_records.length>=1){
  console.log("   PASS: 6a all non-null, belief_records="+r.belief_records.length);
}else{console.error("   FAIL: null 6a ["+nulls.join(",")+"] or no belief_records");process.exit(1);}
' || FAIL=1

step "4 funnel-vectorize (stored → _index with records + vectors)"
node engine/bricks/funnel-vectorize.js --space="$SPACE" >/dev/null 2>&1
node -e '
const fs=require("fs");const f="'"${SCRATCH}"'/funnels/_index.json";
if(!fs.existsSync(f)){console.error("   FAIL: no _index.json");process.exit(1);}
const idx=JSON.parse(fs.readFileSync(f,"utf8"));const recs=idx.records||[];
const vec=recs.filter(r=>Array.isArray(r.vector)&&r.vector.length>0).length;
if(recs.length>=1 && vec===recs.length){console.log("   PASS: "+recs.length+" records, "+vec+" with vectors");}
else{console.error("   FAIL: 0 records or missing vectors ("+vec+"/"+recs.length+")");process.exit(1);}
' || FAIL=1

step "5 funnel-rag-query (index → ranked results)"
node engine/bricks/funnel-rag-query.js --space="$SPACE" --query="why will this ship on time" --top=3 --json >"${SCRATCH}/ragout.json" 2>/dev/null
node -e '
const fs=require("fs");let raw=fs.readFileSync("'"${SCRATCH}"'/ragout.json","utf8").trim();
let arr; try{const j=JSON.parse(raw); arr=Array.isArray(j)?j:(j.results||j.matches||[]);}catch(e){console.error("   FAIL: rag output not JSON");process.exit(1);}
if(arr.length>=1){console.log("   PASS: "+arr.length+" ranked result(s); top belief_id="+JSON.stringify(arr[0].belief_id||arr[0].id||null));}
else{console.error("   FAIL: no ranked results");process.exit(1);}
' || FAIL=1

echo ""
rm -rf "$SCRATCH"
if [ "$FAIL" -eq 0 ]; then echo "H5 E2E: ALL HOPS COHERENT ✓ (transient ${SCRATCH} cleaned)"; exit 0;
else echo "H5 E2E: FAILED — see the named hop above"; exit 1; fi
