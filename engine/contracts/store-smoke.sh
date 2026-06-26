#!/usr/bin/env bash
# store-smoke.sh — STORE-SMOKE: the COMPLETE Phase-1 artifact-store acceptance harness.
# Asserts STORE-01..05 against runs/<space>/ (default space=smoke). Copies the engine's
# proven h6-*.sh smoke idiom (set -u, cd-to-repo-root, ok/bad helpers, inline `node -e`
# JSON asserts, named-exit). No test framework — bash smoke is the project's idiom.
#
# RED-by-design: STORE-02 + STORE-03 invoke engine/bricks/space-version.js and
# receipt-write.js, which land in Plan 02. Those asserts FAIL RED until then — that is the
# correct, expected Wave-0 state. STORE-01/04/05 are GREEN after Plan 01. Do NOT weaken the
# STORE-02/03 asserts to make the harness pass; the file is complete now, Plan 02 turns it green.
#
# Run:
#   bash engine/contracts/store-smoke.sh --space=smoke
# Exit 0 = all asserts pass; non-zero = the named assert above failed.
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root

# --- arg parse: --space=<s> (default smoke) -------------------------------
SPACE="smoke"
for a in "$@"; do
  case "$a" in
    --space=*) SPACE="${a#--space=}" ;;
  esac
done

FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

# ==========================================================================
# STORE-01 — scaffold: fresh scaffold + every §6/R1 slot dir/file present
# ==========================================================================
echo "── STORE-01: scaffold runs/${SPACE}/ slot tree ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1

for d in _receipts voc/market-signal funnels copy review asset-classify voc-bank corpus dumps ads; do
  test -d "runs/${SPACE}/$d" && ok "dir $d" || bad "dir $d missing"
done
for f in bet-brief.md product-intake.md funnel-brief.md market-selection.json \
         asset-classify/CLAIM-LIST.json funnels/_tally.json voc/gap_candidates.json \
         space-map.json brands.json queries_run.json ad-volume-aggregate.json \
         ntp-pick.json awareness-read.json audit-verdicts.json chief-verdicts.json asset-records.json; do
  test -f "runs/${SPACE}/$f" && ok "file $f" || bad "file $f missing"
done

# ==========================================================================
# STORE-04 — fan-out: __ join + distinct cells → distinct files (GREEN now)
# ==========================================================================
echo "── STORE-04: fan-out filename rule ──"
node -e '
const {buildFanoutName}=require("./engine/bricks/lib/fanout-path");
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
buildFanoutName("edc-aesthetic-collectors","novelty-object-own")==="edc-aesthetic-collectors__novelty-object-own.json"?ok("fanout __ join"):bad("fanout name wrong");
buildFanoutName("a","b")!==buildFanoutName("a","c")?ok("distinct cells distinct files"):bad("collision");
process.exit(fail);
' || FAIL=1

# ==========================================================================
# STORE-05 — smoke space usable: space exists + a slot accepts a write (GREEN now)
# ==========================================================================
echo "── STORE-05: smoke space usable ──"
test -d "runs/${SPACE}" && ok "smoke space exists" || bad "smoke space missing"
echo '{"probe":true}' > "runs/${SPACE}/voc/market-signal/probe__probe.json" && ok "slot writable" || bad "slot not writable"
rm -f "runs/${SPACE}/voc/market-signal/probe__probe.json"

# ==========================================================================
# STORE-02 — no-overwrite versioning (RED until Plan 02 lands space-version.js)
# Resolver is READ-ONLY: it only NAMES the next free space, writes nothing. So on a
# freshly-scaffolded runs/<space> (no runs/<space>-v2) it returns "<space>-v2" and
# leaves runs/<space> byte-intact. Exclude _*-log.txt (volatile, gitignored scratch).
# ==========================================================================
echo "── STORE-02: no-overwrite versioning (RED until Plan 02) ──"
BEFORE=$(find "runs/${SPACE}" -type f -not -name '_*-log.txt' -exec sha256sum {} \; | sort)
NEXT=$(node engine/bricks/space-version.js --space="${SPACE}" 2>/dev/null)
AFTER=$(find "runs/${SPACE}" -type f -not -name '_*-log.txt' -exec sha256sum {} \; | sort)
[ "$BEFORE" = "$AFTER" ] && ok "runs/${SPACE} byte-intact after version-resolve" || bad "v1 mutated by resolver"
[ "$NEXT" = "${SPACE}-v2" ] && ok "version resolver returns ${SPACE}-v2" || bad "resolver returned: '$NEXT' (expected ${SPACE}-v2)"

# ==========================================================================
# STORE-03 — receipt ledger (RED until Plan 02 lands receipt-write.js)
# Write a sample receipt, then validate the required keys + that inputs_hash is a sha256.
# ==========================================================================
echo "── STORE-03: receipt ledger (RED until Plan 02) ──"
node engine/bricks/receipt-write.js --space="${SPACE}" --spawn-id=test-001 \
  --inputs='runs/'"${SPACE}"'/space-map.json' --outputs='runs/'"${SPACE}"'/market-selection.json' --step=05-test >/dev/null 2>&1
node -e '
const fs=require("fs");
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
const p="runs/'"${SPACE}"'/_receipts/test-001.json";
fs.existsSync(p)?ok("receipt file exists"):bad("receipt file missing");
if(fs.existsSync(p)){const r=JSON.parse(fs.readFileSync(p,"utf8"));
  (r.spawn_id && r.inputs_hash && r.validator_verdicts!==undefined && r.outputs && r.ts)?ok("receipt keys present"):bad("missing receipt key: "+JSON.stringify(Object.keys(r)));
  (/^[0-9a-f]{64}$/.test(r.inputs_hash))?ok("inputs_hash is sha256"):bad("inputs_hash not sha256: "+r.inputs_hash);
}
process.exit(fail);
' || FAIL=1
rm -f "runs/${SPACE}/_receipts/test-001.json"

# ==========================================================================
echo ""
if [ "$FAIL" -eq 0 ]; then echo "STORE-SMOKE: ALL ASSERTS PASS ✓"; exit 0;
else echo "STORE-SMOKE: FAILED — see the named assert above"; exit 1; fi
