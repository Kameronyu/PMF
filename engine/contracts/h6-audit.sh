#!/usr/bin/env bash
# h6-audit.sh — HARDENING H6: smoke audit-tooling (the pipeline-audit support bricks).
# Proves all four contracts deterministically + offline:
#   audit-inject.js   — assembles a cold-context block + a sidecar manifest with correct counts
#   audit-resolve.js  — resolves evidence globs; exit 0 all-present, exit 1 required-missing
#   validate-receipt.js — exit 0 when a CONTEXT RECEIPT matches the inject manifest, exit 1 on mismatch
#   validate-strip.js — exit 0 when justification is stripped (smaller + must/must-not), exit 1 on no-op
# Fixtures under runs/_fixture/audit/; transient outputs under runs/_fixture-audit/ (removed at end).
set -u
cd "$(dirname "$0")/../.." || exit 1

FXA="runs/_fixture/audit"
OUT="runs/_fixture-audit"
FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }
expect_rc() { # $1=actual $2=expected $3=label
  if [ "$1" -eq "$2" ]; then ok "$3 (rc=$1)"; else bad "$3 (rc=$1 expected $2)"; fi
}

rm -rf "$OUT"; mkdir -p "$OUT"

echo "── H6.audit ──"
# 1. audit-inject -> block + sidecar manifest
node engine/bricks/audit-inject.js --reviewer=A-collection \
  --law="${FXA}/law/law1.md" --evidence="${FXA}/evidence/run1.json" \
  --manifest="${FXA}/inject-manifest.json" --out="${OUT}/block.txt" >/dev/null 2>&1
expect_rc $? 0 "audit-inject assembles block"
if [ -s "${OUT}/block.txt" ] && [ -s "${OUT}/block.txt.manifest.json" ]; then
  node -e '
  const fs=require("fs");
  const b=fs.readFileSync("'"$OUT"'/block.txt","utf8");
  const m=JSON.parse(fs.readFileSync("'"$OUT"'/block.txt.manifest.json","utf8"));
  let f=0; const ok=x=>console.log("   PASS: "+x); const bad=x=>{console.log("   FAIL: "+x);f=1;};
  (b.includes("BEGIN LAW FILE: law1.md")&&b.includes("run1.json")) ? ok("block embeds law + evidence by name") : bad("block missing law/evidence");
  b.includes("CONTEXT RECEIPT") ? ok("block carries CONTEXT RECEIPT instruction") : bad("no receipt instruction");
  (m.law_count===1&&m.evidence_count===1&&Array.isArray(m.denied)&&m.denied.length===0) ? ok("sidecar manifest counts (law=1, evidence=1, denied=0)") : bad("sidecar counts wrong");
  process.exit(f);' || FAIL=1
else bad "block or sidecar manifest not written"; fi

# 2. audit-resolve happy + missing
node engine/bricks/audit-resolve.js --segment=A-collection --manifest="${FXA}/resolve-manifest.json" >"${OUT}/resolve.json" 2>/dev/null
expect_rc $? 0 "audit-resolve all-present"
node -e 'const r=require("./'"$OUT"'/resolve.json");const ev=r.evidence[0];if(ev.status==="ok"&&ev.files.length>=1&&r.missing.length===0)console.log("   PASS: resolve glob -> status ok, 1 file, 0 missing");else{console.log("   FAIL: resolve shape wrong");process.exit(1);}' || FAIL=1
node engine/bricks/audit-resolve.js --segment=A-collection --manifest="${FXA}/resolve-manifest-missing.json" >/dev/null 2>&1
expect_rc $? 1 "audit-resolve required-missing -> exit 1"

# 3. validate-receipt match + mismatch
node engine/bricks/validate-receipt.js --manifest="${OUT}/block.txt.manifest.json" \
  --receipt="CONTEXT RECEIPT: law_files=1 [law1.md]; evidence_files=1 [run1.json]" >/dev/null 2>&1
expect_rc $? 0 "validate-receipt MATCH -> exit 0"
node engine/bricks/validate-receipt.js --manifest="${OUT}/block.txt.manifest.json" \
  --receipt="CONTEXT RECEIPT: law_files=2 [law1.md, extra.md]; evidence_files=1 [run1.json]" >/dev/null 2>&1
expect_rc $? 1 "validate-receipt MISMATCH -> exit 1"

# 4. validate-strip good + no-op
node engine/bricks/validate-strip.js --original="${FXA}/strip-original.md" --stripped="${FXA}/strip-stripped.md" \
  --must-contain="Fact A||amount_raised" --must-not-contain="Verdict||Recommendation||Caveat" >/dev/null 2>&1
expect_rc $? 0 "validate-strip GOOD (smaller + facts kept + verdicts gone) -> exit 0"
node engine/bricks/validate-strip.js --original="${FXA}/strip-original.md" --stripped="${FXA}/strip-original.md" \
  --must-not-contain="Verdict" >/dev/null 2>&1
expect_rc $? 1 "validate-strip NO-OP (not smaller) -> exit 1"

echo ""
rm -rf "$OUT"
if [ "$FAIL" -eq 0 ]; then echo "H6 audit: ALL ASSERTS PASS ✓ (transient ${OUT} cleaned)"; exit 0;
else echo "H6 audit: FAILED — see above"; exit 1; fi
