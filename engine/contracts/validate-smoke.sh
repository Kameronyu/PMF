#!/usr/bin/env bash
# validate-smoke.sh — VALIDATE-SMOKE: the Phase-5 Validators/Gates/Receipts acceptance harness.
# Asserts VALID-01..05 against a fresh `run all` + a battery of MUTATION tests that must each
# produce a NAMED validator REJECT / preflight REFUSE. Mirrors the engine smoke idiom
# (set -u, cd-to-repo-root, ok/bad accumulate-then-report, inline `node -e` asserts, named
# failures, final "ALL ASSERTS PASS"). All work runs into disposable runs/_vfy* spaces / temp
# manifest dirs and is rm -rf'd after — NO committed file is mutated.
#
# Determinism pin: unset VOYAGE_API_KEY so any embed-touching step (none in stub mode, but the
# pin matches h5-e2e) cannot make a live network call that would break byte-stable re-runs.
#
# Run:  bash engine/contracts/validate-smoke.sh
# Exit 0 = all asserts pass; non-zero = the named assert above failed.
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root
unset VOYAGE_API_KEY

CTRL="engine/bricks/run-controller.js"
SHAPE="engine/hooks/validate-shape.js"
CLASSIFIER="engine/hooks/validate-classifier.js"
ROUTE="engine/hooks/route.js"
SCAFFOLD="engine/bricks/store-scaffold.js"

FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

# A REJECT/REFUSE assert helper: run a command, expect non-zero exit AND a stderr line matching
# a named pattern. Passing (exit 0) or a missing pattern is a FAIL.
expect_reject() {  # $1=label  $2=grep-pattern  ...rest=command
  local label="$1"; shift
  local pat="$1"; shift
  local out rc
  out=$("$@" 2>&1); rc=$?
  if [ "$rc" -eq 0 ]; then bad "$label — command unexpectedly PASSED (exit 0); expected REJECT/REFUSE"; return; fi
  if echo "$out" | grep -qE "$pat"; then ok "$label — named reject: $(echo "$out" | grep -E "$pat" | head -1)"
  else bad "$label — rejected (exit $rc) but no line matched /$pat/; got: $(echo "$out" | grep -iE 'REJECT|REFUSE|ESCALATE' | head -1)"; fi
}

VSP="_vfy_p5_acc"        # fresh acceptance space
rm -rf "runs/${VSP}"

# ==========================================================================
# VALID-01..05 (integrity) — a full `run all` into a fresh space completes clean,
# every output validator verdict = pass, unbroken receipt chain.
# ==========================================================================
echo "── VALID-01..05: full run-all completes clean with unbroken receipt chain ──"
RUNOUT=$(node "$CTRL" all --space="${VSP}" --smoke 2>&1); RC=$?
if [ "$RC" -ne 0 ]; then
  bad "run all --space=${VSP} exited ${RC} (expected 0 clean) — $(echo "$RUNOUT"|grep -E 'REJECT|REFUSE|ESCALATE|FATAL'|head -1)"
else
  ok "run all completed clean (exit 0)"
fi

# 11 steps in pipeline.yaml → exactly 11 receipts, one per step, none missing/duplicate.
NSTEPS=$(grep -cE '^\s*- ' pipeline.yaml)
NRECEIPTS=$(ls "runs/${VSP}/_receipts/" 2>/dev/null | grep -c '\.json$')
[ "$NRECEIPTS" -eq "$NSTEPS" ] \
  && ok "receipt chain: ${NRECEIPTS} receipts == ${NSTEPS} pipeline steps (one per step)" \
  || bad "receipt chain: ${NRECEIPTS} receipts != ${NSTEPS} pipeline steps (missing/duplicate)"

# Per-receipt integrity: non-null inputs_hash, populated validator_verdicts (all pass), and a
# populated gate.decision for the 6 gated steps (00,01,05,07,08,10); null for the others.
node -e '
  const fs=require("fs"),path=require("path");
  const dir="runs/'"${VSP}"'/_receipts";
  const GATED=new Set(["00-bet-compiler","01-collect","05-market-selection","07-funnel-architect","08-copywriter","10-adversarial-re-review"]);
  let fail=0;
  const seen=new Set();
  for(const f of fs.readdirSync(dir).filter(f=>f.endsWith(".json"))){
    const r=JSON.parse(fs.readFileSync(path.join(dir,f),"utf8"));
    const step=r.step;
    if(seen.has(step)){console.error("FAIL dup receipt for step "+step);fail=1;} seen.add(step);
    if(typeof r.inputs_hash!=="string"||r.inputs_hash.length!==64){console.error("FAIL "+step+" inputs_hash not a 64-hex sha256");fail=1;}
    if(!Array.isArray(r.validator_verdicts)||r.validator_verdicts.length===0){console.error("FAIL "+step+" validator_verdicts empty (VALID-04)");fail=1;}
    else if(!r.validator_verdicts.every(v=>v.verdict==="pass")){console.error("FAIL "+step+" a validator_verdict != pass");fail=1;}
    if(GATED.has(step)){
      if(!r.gate||r.gate.step_gated!==true){console.error("FAIL "+step+" gated step but gate.step_gated!=true");fail=1;}
      if(!r.gate||r.gate.decision!=="auto-approved-smoke"){console.error("FAIL "+step+" gated step gate.decision="+JSON.stringify(r.gate&&r.gate.decision)+" (expected auto-approved-smoke) (VALID-05)");fail=1;}
    } else {
      if(!r.gate||r.gate.step_gated!==false||r.gate.decision!==null){console.error("FAIL "+step+" non-gated step gate should be {step_gated:false,decision:null}, got "+JSON.stringify(r.gate));fail=1;}
    }
  }
  process.exit(fail);
' 2>/tmp/vs-rcpt-$$.err \
  && ok "every receipt: 64-hex inputs_hash + non-empty all-pass validator_verdicts + correct gate.decision" \
  || bad "receipt integrity: $(cat /tmp/vs-rcpt-$$.err | head -3)"
rm -f /tmp/vs-rcpt-$$.err

# Every manifest's validator field is now bound (not null) — VALID-01 wiring.
node -e '
  const fs=require("fs");
  let fail=0;
  for(const f of fs.readdirSync("engine/manifests").filter(f=>f.endsWith(".json"))){
    const j=JSON.parse(fs.readFileSync("engine/manifests/"+f,"utf8"));
    if(j.validator!=="engine/hooks/route.js"){console.error("FAIL "+f+" validator="+JSON.stringify(j.validator)+" (expected engine/hooks/route.js)");fail=1;}
  }
  process.exit(fail);
' 2>/tmp/vs-man-$$.err \
  && ok "all 11 manifests bind validator -> route.js (VALID-01 wired)" \
  || bad "manifest validator binding: $(cat /tmp/vs-man-$$.err | head -2)"
rm -f /tmp/vs-man-$$.err

# ==========================================================================
# MUTATION (a) — a step output with wrong/missing top-level shape → validator REJECT.
# Tightened: the assert REQUIRES validate-shape's OUTPUT-CONTRACT-key wording, so it can ONLY be
# satisfied by validate-shape's L134 missing-key gate — NOT by validate-finder's dual coverage of
# brands.json (which would reject on its own "missing brands array" wording). This pins the right
# validator for the brands path; MUTATION (a2) below pins it for a GENERIC non-brands output.
# ==========================================================================
echo "── MUTATION (a): wrong top-level shape (brands.json -> {wrong}) → validate-shape REJECT ──"
MUT="runs/${VSP}_mut/brands.json"
mkdir -p "$(dirname "$MUT")"
printf '{"wrong":[]}\n' > "$MUT"
expect_reject "MUTATION(a) brands wrong shape via validate-shape" 'REJECT: brands\.json output missing top-level OUTPUT-CONTRACT key' \
  node "$SHAPE" "$MUT"
rm -rf "runs/${VSP}_mut"

# ==========================================================================
# MUTATION (a2) — DEFINITIVE PIN of validate-shape's generic shape gate (regression-net hole).
# validate-shape's L134 missing-top-level-key REJECT is the SOLE shape gate for the GENERIC outputs
# of 7 of 11 steps (04-10) — basenames with NO sibling deep validator. MUTATION (a) drives
# brands.json, which is ALSO covered by validate-finder, so gutting L134 would leave (a) green via
# finder. Drive a GENERIC non-brands output (market-selection.json: a step-05 output with no deep
# validator) with a renamed top-level key through validate-shape AND through route.js's else-branch,
# asserting the OUTPUT-CONTRACT-key wording — which ONLY validate-shape's L134 can emit. Gutting
# L134 RED-fails THIS assert (proven RED-first in 05-XVERIFY-FIX.md).
# ==========================================================================
echo "── MUTATION (a2): GENERIC non-brands output wrong key (market-selection.json) → validate-shape REJECT ──"
GMUT="runs/${VSP}_gmut/market-selection.json"
mkdir -p "$(dirname "$GMUT")"
printf '{"renamed_ranked":[]}\n' > "$GMUT"            # contract requires top-level key "ranked"
expect_reject "MUTATION(a2) generic missing-key via validate-shape direct" 'REJECT: market-selection\.json output missing top-level OUTPUT-CONTRACT key.*\[ranked\]' \
  node "$SHAPE" "$GMUT"
expect_reject "MUTATION(a2) generic missing-key via route.js else-branch" 'REJECT: market-selection\.json output missing top-level OUTPUT-CONTRACT key.*\[ranked\]' \
  node "$ROUTE" "$GMUT"
rm -rf "runs/${VSP}_gmut"

# ==========================================================================
# MUTATION (a3) — CONTROLLER-ESCALATION pin: drive a generic bad emit (step 05 emits
# market-selection.json with a wrong top-level key) THROUGH the run-controller and assert the
# Validate phase REJECTs → re-spawn → ESCALATE with NO receipt minted (mirrors CTRL-07 but for a
# generic 04-10 output, proving validate-shape gates the REAL run — not just direct invocation).
# Build a clean space up to step 04, then point the prompt's STUB-EMIT for step 05 at a wrong-key
# payload via a temp manifest-dir copy whose 05 manifest declares stub_emit (Mode A single-write).
# ==========================================================================
echo "── MUTATION (a3): generic bad emit THROUGH controller → ESCALATE, no receipt ──"
ESP="${VSP}_escal"
EMD="runs/${ESP}_md"          # temp manifest dir
rm -rf "runs/${ESP}" "$EMD"
mkdir -p "$EMD"
cp engine/manifests/*.json "$EMD/"
# Rewrite the 05 manifest to Mode-A fixture emit of a WRONG-key market-selection.json (drop ntp-pick
# write so the single stub_emit lands on writes[0]=market-selection.json), preserving reads/gate.
node -e '
  const fs=require("fs"); const f="'"$EMD"'/05-market-selection.json";
  const m=JSON.parse(fs.readFileSync(f,"utf8"));
  m.writes=["runs/{space}/market-selection.json"];
  m.stub_emit={ renamed_ranked: [] };       // missing top-level OUTPUT-CONTRACT key "ranked"
  fs.writeFileSync(f, JSON.stringify(m,null,2));
'
# Walk steps 00-04 cleanly into the space (real manifests), then run the MUTATED 05 from the temp dir.
node "$CTRL" all --space="${ESP}" --smoke --pipeline=<(printf -- '- 00-bet-compiler\n- 01-collect\n- 02-funnel-analysis\n- 03-space-map\n- 04-voc-market-pass\n') >/dev/null 2>&1
expect_reject "MUTATION(a3) controller ESCALATE on generic bad emit" 'ESCALATE \[05-market-selection\]|REJECT.*market-selection\.json output missing top-level OUTPUT-CONTRACT key' \
  node "$CTRL" 05-market-selection --space="${ESP}" --smoke --manifest-dir="$EMD"
# Prove NO receipt was minted for the escalated step (gate held — no false success).
N05=$(ls "runs/${ESP}/_receipts/" 2>/dev/null | grep -c '^05-market-selection')
[ "$N05" -eq 0 ] \
  && ok "MUTATION(a3) no receipt minted for escalated step 05 (gate held)" \
  || bad "MUTATION(a3) ${N05} receipt(s) minted for escalated step 05 (should be 0 — false success)"
rm -rf "runs/${ESP}" "$EMD"

# ==========================================================================
# MUTATION (b) — a hollow {} seed as a load-bearing INPUT → VALID-02 preflight REFUSE.
# Build a fresh space, then HOLLOW out a load-bearing input (brands.json, read by step 02),
# and run step 02: preflight must refuse the hollow input by name.
# ==========================================================================
echo "── MUTATION (b): hollow {} load-bearing input → VALID-02 preflight REFUSE ──"
MSP="${VSP}_hollow"
rm -rf "runs/${MSP}"
node "$CTRL" all --space="${MSP}" --smoke >/dev/null 2>&1
printf '{}\n' > "runs/${MSP}/brands.json"      # hollow the input step 02 reads
expect_reject "MUTATION(b) hollow input" 'REFUSE.*preflight.*(empty|hollow).*brands\.json' \
  node "$CTRL" 02-funnel-analysis --space="${MSP}" --smoke
rm -rf "runs/${MSP}"

# ==========================================================================
# MUTATION (c) — a gated step → receipt.gate.decision is populated (not null).
# (Positive assert: the gated-step receipt from the clean run carries a real decision.)
# ==========================================================================
echo "── MUTATION (c): gated step receipt.gate.decision populated (not null) ──"
node -e '
  const fs=require("fs");
  const f=fs.readdirSync("runs/'"${VSP}"'/_receipts").find(x=>x.startsWith("05-market-selection"));
  const r=JSON.parse(fs.readFileSync("runs/'"${VSP}"'/_receipts/"+f,"utf8"));
  if(r.gate && r.gate.step_gated===true && r.gate.decision && r.gate.decision!==null){
    console.log("OK decision="+r.gate.decision); process.exit(0);
  }
  console.error("FAIL gate="+JSON.stringify(r.gate)); process.exit(1);
' 2>/tmp/vs-gate-$$.err \
  && ok "MUTATION(c) gated step 05 receipt.gate.decision is populated (VALID-05)" \
  || bad "MUTATION(c) gated step receipt.gate.decision null/missing: $(cat /tmp/vs-gate-$$.err)"
rm -f /tmp/vs-gate-$$.err

# ==========================================================================
# MUTATION (d) — space-map with an untraceable raw_variant OR a dropped axis → classifier REJECT.
# Copy the clean space-map + its sibling tally into a temp dir, then mutate.
# ==========================================================================
echo "── MUTATION (d1): untraceable raw_variant → classifier REJECT ──"
MDIR="runs/${VSP}_classmut"
mkdir -p "$MDIR/funnels"
cp "runs/${VSP}/space-map.json" "$MDIR/space-map.json"
cp "runs/${VSP}/funnels/_tally.json" "$MDIR/funnels/_tally.json"
node -e '
  const fs=require("fs"); const p="'"$MDIR"'/space-map.json";
  const j=JSON.parse(fs.readFileSync(p,"utf8"));
  j.transformations[0].raw_claim_variants.push("a-raw-label-that-no-funnel-emitted");
  fs.writeFileSync(p, JSON.stringify(j,null,2));
'
expect_reject "MUTATION(d1) untraceable raw_variant" 'REJECT.*WIRE-03.*traces to NO Step-2' \
  node "$CLASSIFIER" "$MDIR/space-map.json"

echo "── MUTATION (d2): dropped axis (mechanisms_in_play: []) → classifier REJECT ──"
node -e '
  const fs=require("fs"); const p="'"$MDIR"'/space-map.json";
  const j=JSON.parse(fs.readFileSync("runs/'"${VSP}"'/space-map.json","utf8"));
  j.mechanisms_in_play=[];
  fs.writeFileSync(p, JSON.stringify(j,null,2));
'
expect_reject "MUTATION(d2) dropped axis" 'REJECT.*WIRE-03 axis "mechanisms_in_play" is missing/empty' \
  node "$CLASSIFIER" "$MDIR/space-map.json"
rm -rf "$MDIR"

# ==========================================================================
# MUTATION (e) — a missing output file → validator REJECT (not a silent pass).
# ==========================================================================
echo "── MUTATION (e): missing output file → validator REJECT (no silent pass) ──"
# A MAPPED output basename (market-selection.json) that is absent must hit the presence check,
# proving validate-shape rejects a missing real output rather than passing silently.
rm -f "runs/${VSP}_acc_missing_market-selection.json" 2>/dev/null
expect_reject "MUTATION(e) missing mapped output" 'REJECT.*market-selection\.json output missing' \
  node "$ROUTE" "runs/${VSP}/nonexistent-dir/market-selection.json"
# Also prove an UNMAPPED real-looking output basename does not silently pass (drift guard).
expect_reject "MUTATION(e2) unmapped output basename" 'REJECT.*no OUTPUT-CONTRACT entry' \
  node "$SHAPE" "runs/${VSP}/totally-unknown-output.json"

# ==========================================================================
# Cross-space determinism: re-run the full pipeline into a 2nd fresh space; every emitted
# artifact must be byte-identical (receipts/log excluded — they carry per-run spawn-ids/ts).
# ==========================================================================
echo "── DETERMINISM: full pipeline re-run -> emitted artifacts byte-identical ──"
VSP2="${VSP}_det2"
rm -rf "runs/${VSP2}"
node "$CTRL" all --space="${VSP2}" --smoke >/dev/null 2>&1
node -e '
  const fs=require("fs"),path=require("path");
  function walk(d){let o=[];if(!fs.existsSync(d))return o;for(const e of fs.readdirSync(d,{withFileTypes:true})){if(e.name==="_receipts")continue;const p=path.join(d,e.name);if(e.isDirectory())o=o.concat(walk(p));else if(!/^_.*-log\.txt$/.test(e.name))o.push(p);}return o;}
  const a="runs/'"${VSP}"'", b="runs/'"${VSP2}"'";
  const ra=walk(a).map(p=>p.slice(a.length+1)).sort();
  let fail=0, n=0;
  for(const rel of ra){
    const fa=path.join(a,rel), fb=path.join(b,rel);
    if(!fs.existsSync(fb)){console.error("FAIL missing in 2nd space: "+rel);fail=1;continue;}
    if(!fs.readFileSync(fa).equals(fs.readFileSync(fb))){console.error("FAIL non-deterministic emit: "+rel);fail=1;}
    n++;
  }
  console.error("checked "+n+" emitted artifacts");
  process.exit(fail);
' 2>/tmp/vs-det-$$.err
if [ $? -eq 0 ]; then ok "all emitted artifacts byte-identical across two fresh full-pipeline runs ($(grep checked /tmp/vs-det-$$.err))"
else bad "determinism: $(grep FAIL /tmp/vs-det-$$.err | head -2)"; fi
rm -f /tmp/vs-det-$$.err
rm -rf "runs/${VSP2}"

# --- cleanup ---
rm -rf "runs/${VSP}"

echo
if [ "$FAIL" -eq 0 ]; then echo "VALIDATE-SMOKE: ALL ASSERTS PASS ✓"; exit 0
else echo "VALIDATE-SMOKE: FAILURES ABOVE ✗"; exit 1; fi
