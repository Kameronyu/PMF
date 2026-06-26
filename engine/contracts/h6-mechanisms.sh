#!/usr/bin/env bash
# h6-mechanisms.sh — HARDENING H6: smoke mechanisms-aggregate
# (engine/bricks/aggregate-mechanisms-in-play.js). The brick reads a canonical_mechanisms[]
# sidecar (the agent JUDGMENT) + a space-map.json and merges mechanisms_in_play[] INTO the
# space-map (top-level catalog + per-combo cell-scoped). It MUTATES the space-map in place,
# so the smoke runs it against a TRANSIENT COPY (no-overwrite-v1); the committed fixture is read-only.
# ownability: brand_count >= 3 -> shared, <= 2 -> unique (cell ownability from the intersection).
# Exit 0 = mechanisms_in_play written correctly top-level + per-combo; non-zero names the gap.
# (NOTE: closeout row drifted — this brick does NOT read funnels nor write mechanisms-tally.json.)
set -u
cd "$(dirname "$0")/../.." || exit 1

FXDIR="runs/_fixture/mechanisms"
OUT="runs/_fixture-mech"
SM="${OUT}/space-map.json"
FAIL=0

rm -rf "$OUT"; mkdir -p "$OUT"
cp "${FXDIR}/space-map.json" "$SM"   # transient copy — brick mutates this, not the fixture

echo "── H6.mechanisms: node aggregate-mechanisms-in-play.js --sidecar=... --space-map=${SM} ──"
node engine/bricks/aggregate-mechanisms-in-play.js \
  --sidecar="${FXDIR}/_mechanisms-in-play.agent.json" --space-map="$SM" >/dev/null 2>&1
rc=$?
if [ "$rc" -ne 0 ]; then echo "   FAIL: brick exited ${rc}"; echo "H6 mechanisms: FAILED"; rm -rf "$OUT"; exit 1; fi

node -e '
const fs=require("fs");
const sm=JSON.parse(fs.readFileSync("'"$SM"'","utf8"));
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
// top-level catalog
const top=sm.mechanisms_in_play;
(Array.isArray(top)&&top.length===2) ? ok("top-level mechanisms_in_play has 2 entries") : bad("top-level wrong: "+JSON.stringify(top));
const modular=top&&top.find(m=>m.canonical==="modular-swappable");
const opensrc=top&&top.find(m=>m.canonical==="open-source");
(modular&&modular.brand_count===3&&modular.ownability==="shared") ? ok("modular-swappable = 3 brands / shared") : bad("modular wrong: "+JSON.stringify(modular));
(opensrc&&opensrc.brand_count===2&&opensrc.ownability==="unique") ? ok("open-source = 2 brands / unique") : bad("open-source wrong: "+JSON.stringify(opensrc));
// sorted most-shared first
(top&&top[0].canonical==="modular-swappable") ? ok("sorted most-shared first") : bad("sort order wrong");
// per-combo cell-scoped presence (intersection)
const c0=sm.combos[0].mechanisms_in_play, c1=sm.combos[1].mechanisms_in_play;
(Array.isArray(c0)&&c0.length===2) ? ok("combo0 {alpha,beta}: 2 mechanisms") : bad("combo0 wrong: "+JSON.stringify(c0));
(Array.isArray(c1)&&c1.length===1&&c1[0].canonical==="modular-swappable") ? ok("combo1 {gamma}: only modular (open-source intersection empty -> dropped)") : bad("combo1 wrong: "+JSON.stringify(c1));
// additivity: original keys preserved
("bet_types" in sm && sm.combos[0].brands && sm.combos[0].claims!==undefined) ? ok("original space-map keys preserved (additive)") : bad("space-map keys clobbered");
process.exit(fail);
' || FAIL=1

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 mechanisms: ALL ASSERTS PASS ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 mechanisms: FAILED — see above"; exit 1; fi
