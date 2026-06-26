#!/usr/bin/env bash
# h6-asset-classify.sh — HARDENING H6: smoke asset-classify-build (asset-map-rank.js -> asset-emit.js).
# Validates the fixture records, then runs the chain offline: map-rank routes demonstrates[].claim
# to LP sections via section-table.json and writes ranked.json; emit splits records into
# images.json / videos.json + IMAGES.md / VIDEOS.md. map-rank STAMPS eligible_sections back onto
# the source records, so the smoke runs against a TRANSIENT COPY (no-overwrite-v1); the committed
# fixtures are read-only. Exit 0 = chain coherent; non-zero names the failing hop.
set -u
cd "$(dirname "$0")/../.." || exit 1

FXDIR="runs/_fixture/asset-classify"
CLAIMS="${FXDIR}/CLAIM-LIST.json"
T="runs/_fixture-assetcls"
FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

rm -rf "$T"; mkdir -p "$T/records"; cp "${FXDIR}/records/"*.json "$T/records/"

echo "── H6.asset-classify ──"
# 0. records pass the contract validator (exercises validate-asset-record.js)
for r in img-001 img-002 vid-001; do
  node engine/hooks/validate-asset-record.js "${FXDIR}/records/${r}.json" --claim-list="$CLAIMS" >/dev/null 2>&1 \
    && ok "validate-asset-record: ${r} valid (exit 0)" || bad "validate-asset-record: ${r} rejected"
done

# 1. map-rank
node engine/bricks/asset-map-rank.js --space=_fixture --records-dir="$T/records" --out="$T" >/dev/null 2>&1
[ $? -eq 0 ] && [ -s "$T/ranked.json" ] && ok "map-rank wrote ranked.json" || bad "map-rank failed/no ranked.json"
node -e '
const r=require("./'"$T"'/ranked.json");
let f=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);f=1;};
r._provenance.record_count===3 ? ok("ranked record_count=3") : bad("record_count "+r._provenance.record_count);
const ft=r.sections.feature_transparency||[];
ft.some(x=>x.id==="img-001"&&x.strength==="strong") ? ok("transparency_internals_visible(strong) routed img-001 -> feature_transparency") : bad("img-001 not routed to feature_transparency");
(r.sections.feature_scale||[]).some(x=>x.id==="img-002") ? ok("pocket_scale routed img-002 -> feature_scale") : bad("img-002 not routed to feature_scale");
// every candidate carries required non-null fields
const all=Object.values(r.sections).flat();
all.every(c=>c.id&&c.strength&&Array.isArray(c.disqualifiers)&&("dup_of" in c)) ? ok("every ranked candidate has id/strength/disqualifiers/dup_of") : bad("a candidate missing required fields");
process.exit(f);' || FAIL=1

# 2. emit
node engine/bricks/asset-emit.js --space=_fixture --records-dir="$T/records" --ranked="$T/ranked.json" --out="$T" >/dev/null 2>&1
[ $? -eq 0 ] || bad "emit exited non-zero"
node -e '
const fs=require("fs");
const i=JSON.parse(fs.readFileSync("'"$T"'/images.json","utf8"));
const v=JSON.parse(fs.readFileSync("'"$T"'/videos.json","utf8"));
let f=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);f=1;};
const img=i.records.map(x=>x.id).sort().join(",");
img==="img-001,img-002" ? ok("emit: images.json has the 2 image records") : bad("images.json ids: "+img);
(v.records.length===1&&v.records[0].id==="vid-001") ? ok("emit: videos.json has the 1 video record") : bad("videos.json wrong: "+JSON.stringify(v.records.map(x=>x.id)));
(fs.existsSync("'"$T"'/IMAGES.md")&&fs.existsSync("'"$T"'/VIDEOS.md")) ? ok("emit: IMAGES.md + VIDEOS.md launch reports written") : bad("missing md reports");
process.exit(f);' || FAIL=1

echo ""
rm -rf "$T"
if [ "$FAIL" -eq 0 ]; then echo "H6 asset-classify: CHAIN COHERENT ✓ (transient ${T} cleaned)"; exit 0;
else echo "H6 asset-classify: FAILED — see above"; exit 1; fi
