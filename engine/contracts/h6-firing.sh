#!/usr/bin/env bash
# h6-firing.sh — HARDENING H6: smoke the FIRING LAYER (the glue that makes the agents run).
# Closes the coverage gap the H6 brick pass left: the 4 per-agent validators (good->0 / bad->2),
# route.js (basename dispatch + exit-code propagation), and the 4 DR-context injectors (bundle from
# a --dr-dir fixture). validate-analyzer + validate-asset-record are already covered by
# h5-e2e / h6-asset-classify; this proves the rest. Fully offline. Fixtures under runs/_fixture/firing/
# + the DR stubs under engine/_fixture/dr-knowledge/. Exit 0 = firing layer coherent.
set -u
cd "$(dirname "$0")/../.." || exit 1

F="runs/_fixture/firing"
DRFX="engine/_fixture/dr-knowledge"
T="runs/_fixture-firing"
FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }
rc_is() { [ "$1" -eq "$2" ] && ok "$3 (rc=$1)" || bad "$3 (rc=$1 expected $2)"; }

rm -rf "$T"; mkdir -p "$T"

echo "── H6.firing: per-agent validators (good->0 / bad->2) ──"
node engine/hooks/validate-finder.js "$F/brands-good.json"        >/dev/null 2>&1; rc_is $? 0 "validate-finder good"
node engine/hooks/validate-finder.js "$F/brands-bad-finder.json"  >/dev/null 2>&1; rc_is $? 2 "validate-finder bad (off-enum channel)"
node engine/hooks/validate-revenue.js "$F/brands-good.json"       >/dev/null 2>&1; rc_is $? 0 "validate-revenue good"
node engine/hooks/validate-revenue.js "$F/brands-bad-revenue.json">/dev/null 2>&1; rc_is $? 2 "validate-revenue bad (PENDING placeholder)"
node engine/hooks/validate-dumper.js "$F/dumper/dump.json"        >/dev/null 2>&1; rc_is $? 0 "validate-dumper good (claim verbatim in corpus)"
node engine/hooks/validate-dumper.js "$F/dumper/dump-bad.json"    >/dev/null 2>&1; rc_is $? 2 "validate-dumper bad (dumper classified)"
node engine/hooks/validate-classifier.js "$F/space-map-good.json" >/dev/null 2>&1; rc_is $? 0 "validate-classifier good"
node engine/hooks/validate-classifier.js "$F/space-map-bad.json"  >/dev/null 2>&1; rc_is $? 2 "validate-classifier bad (off-enum demand_trend.shape)"

echo ""
echo "── H6.firing: route.js (exact-basename dispatch + exit propagation) ──"
cp "$F/brands-good.json" "$T/brands.json"
node engine/hooks/route.js "$T/brands.json" >/dev/null 2>&1; rc_is $? 0 "route brands.json (good) -> finder+revenue pass -> 0"
cp "$F/brands-bad-finder.json" "$T/brands.json"
node engine/hooks/route.js "$T/brands.json" >/dev/null 2>&1; rc_is $? 2 "route brands.json (bad) -> finder rejects -> propagates 2"
node engine/hooks/route.js "$T/unmatched.json" >/dev/null 2>&1; rc_is $? 0 "route unmatched basename -> pass 0"

echo ""
echo "── H6.firing: DR-context injectors (bundle from --dr-dir fixture) ──"
inj_check() { # $1=script $2=expected stub filename in output
  local out; out=$(node "engine/hooks/$1.js" --stdout --dr-dir="$DRFX" 2>/dev/null)
  if [ "${#out}" -gt 200 ] && printf '%s' "$out" | grep -q "$2"; then ok "$1 bundled from --dr-dir (refs $2)"; else bad "$1 did not bundle $2 from --dr-dir"; fi
}
inj_check inject-dr                    "persuasion--carl-weische.md"
inj_check inject-funnel-architect-dr   "funnel-architecture--carl-weische.md"
inj_check inject-market-selection-dr   "product-research--spencer-origins.md"
inj_check inject-copywriter-dr         "copywriting--carl-weische.md"

echo ""
rm -rf "$T"
if [ "$FAIL" -eq 0 ]; then echo "H6 firing: FIRING LAYER COHERENT ✓ (transient ${T} cleaned)"; exit 0;
else echo "H6 firing: FAILED — see above"; exit 1; fi
