#!/usr/bin/env bash
# store-smoke.sh — STORE-SMOKE: the COMPLETE Phase-1 artifact-store acceptance harness.
# Asserts STORE-01..05 against runs/<space>/ (default space=smoke). Copies the engine's
# proven h6-*.sh smoke idiom (set -u, cd-to-repo-root, ok/bad helpers, inline `node -e`
# JSON asserts, named-exit). No test framework — bash smoke is the project's idiom.
#
# State: STORE-01/02/03/04/05 are all GREEN as of Plan 02 (space-version.js and
# receipt-write.js now exist). The full harness passes; every assert below is expected
# to be GREEN. Do NOT weaken any assert — if one goes RED it is a real regression.
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
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1 \
  || bad "store-scaffold crashed (space=${SPACE})"

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
# STORE-02 — no-overwrite versioning (GREEN now)
# Resolver is READ-ONLY: it only NAMES the next free space, writes nothing. So on a
# freshly-scaffolded runs/<space> (no runs/<space>-v2) it returns "<space>-v2" and
# leaves runs/<space> byte-intact. Exclude _*-log.txt (volatile, gitignored scratch).
# ==========================================================================
echo "── STORE-02: no-overwrite versioning ──"
BEFORE=$(find "runs/${SPACE}" -type f -not -name '_*-log.txt' -exec sha256sum {} \; | sort)
NEXT=$(node engine/bricks/space-version.js --space="${SPACE}" 2>/dev/null)
AFTER=$(find "runs/${SPACE}" -type f -not -name '_*-log.txt' -exec sha256sum {} \; | sort)
[ "$BEFORE" = "$AFTER" ] && ok "runs/${SPACE} byte-intact after version-resolve" || bad "v1 mutated by resolver"
[ "$NEXT" = "${SPACE}-v2" ] && ok "version resolver returns ${SPACE}-v2" || bad "resolver returned: '$NEXT' (expected ${SPACE}-v2)"

# ==========================================================================
# STORE-03 — receipt ledger (GREEN now)
# Write a sample receipt, then validate the required keys + BIND inputs_hash to its inputs.
# The hash must demonstrably depend on the declared input BYTES — not be a hardcoded
# constant, path-only, or unsorted. We do three binding checks (within the ok/bad idiom):
#   (1) inputs_hash equals a reference sha256 we recompute the SAME way the brick does —
#       sorted input paths, each as path + NUL + file-bytes (matching hashInputs()).
#   (2) content-sensitivity: changing an input file's bytes changes inputs_hash.
#   (3) order-independence: --inputs=a,b yields the same hash as --inputs=b,a.
# Together these prove the hash is bound to input bytes, not merely sha256-shaped.
# ==========================================================================
echo "── STORE-03: receipt ledger ──"
# Fixed known input set (two files with known bytes) under the space.
R3DIR="runs/${SPACE}/_smoke-store03"
rm -rf "$R3DIR"; mkdir -p "$R3DIR"
A="${R3DIR}/a.json"; B="${R3DIR}/b.json"
printf '%s' '{"a":1}'  > "$A"
printf '%s' '{"b":2}'  > "$B"

node engine/bricks/receipt-write.js --space="${SPACE}" --spawn-id=test-001 \
  --inputs="${A},${B}" --outputs='runs/'"${SPACE}"'/market-selection.json' --step=05-test >/dev/null 2>&1 \
  || bad "receipt-write crashed (space=${SPACE})"

# (1) Reference hash, computed inline the SAME way hashInputs() does:
#     for each path in SORTED order: emit path, a NUL byte, then the file's bytes; sha256 the stream.
#     Sorted order of "$A" then "$B": a.json < b.json, so A then B.
REF=$( { printf '%s' "$A"; printf '\0'; cat "$A"; printf '%s' "$B"; printf '\0'; cat "$B"; } | sha256sum | awk '{print $1}' )

# Checks (1) binding, (2) content-sensitivity (mutate input bytes), (3) order-independence
# are all performed inside the node block below (it re-runs the brick to read back hashes).
node -e '
const fs=require("fs"), cp=require("child_process");
let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
const SPACE="'"${SPACE}"'";
const p="runs/"+SPACE+"/_receipts/test-001.json";
const REF="'"${REF}"'";
const A="'"${A}"'", B="'"${B}"'";
fs.existsSync(p)?ok("receipt file exists"):bad("receipt file missing");
if(fs.existsSync(p)){
  const r=JSON.parse(fs.readFileSync(p,"utf8"));
  (r.spawn_id && r.inputs_hash && r.validator_verdicts!==undefined && r.outputs && r.ts)?ok("receipt keys present"):bad("missing receipt key: "+JSON.stringify(Object.keys(r)));
  (/^[0-9a-f]{64}$/.test(r.inputs_hash))?ok("inputs_hash is sha256"):bad("inputs_hash not sha256: "+r.inputs_hash);
  // (1) BIND: receipt hash equals the independently-recomputed reference over input bytes.
  (r.inputs_hash===REF)?ok("inputs_hash binds to declared input bytes (== reference sha256)"):bad("inputs_hash != reference: got "+r.inputs_hash+" want "+REF);
}
// helper: run the brick and read back the inputs_hash for a given spawn-id + inputs csv.
function hashFor(id, inputsCsv){
  cp.execFileSync("node",["engine/bricks/receipt-write.js","--space="+SPACE,"--spawn-id="+id,"--inputs="+inputsCsv],{stdio:"ignore"});
  const rp="runs/"+SPACE+"/_receipts/"+id+".json";
  return JSON.parse(fs.readFileSync(rp,"utf8")).inputs_hash;
}
// (2) content-sensitivity: mutate B bytes, hash must change.
const hOrig=hashFor("s03-c1", A+","+B);
fs.writeFileSync(B, "{\"b\":999}");
const hMut=hashFor("s03-c2", A+","+B);
(hOrig!==hMut)?ok("content-sensitivity: changing an input byte changes inputs_hash"):bad("hash unchanged after input mutation (path-only/constant hash?)");
// restore B for (3)
fs.writeFileSync(B, "{\"b\":2}");
// (3) order-independence: a,b == b,a (brick sorts before hashing).
const hAB=hashFor("s03-o1", A+","+B);
const hBA=hashFor("s03-o2", B+","+A);
(hAB===hBA)?ok("order-independence: --inputs=a,b == b,a"):bad("hash depends on input order (a,b != b,a)");
process.exit(fail);
' || FAIL=1
rm -f "runs/${SPACE}/_receipts/test-001.json" \
      "runs/${SPACE}/_receipts/s03-c1.json" "runs/${SPACE}/_receipts/s03-c2.json" \
      "runs/${SPACE}/_receipts/s03-o1.json" "runs/${SPACE}/_receipts/s03-o2.json"
rm -rf "$R3DIR"

# ==========================================================================
echo ""
if [ "$FAIL" -eq 0 ]; then echo "STORE-SMOKE: ALL ASSERTS PASS ✓"; exit 0;
else echo "STORE-SMOKE: FAILED — see the named assert above"; exit 1; fi
