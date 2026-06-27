#!/usr/bin/env bash
# controller-smoke.sh — CONTROLLER-SMOKE: the Phase-2 run-controller acceptance harness.
# Asserts CTRL-01..12 against engine/bricks/run-controller.js (the 7-phase loop) driven
# by the fixture pipeline + manifests under runs/_fixture/pipeline/. Copies the engine's
# proven store-smoke.sh idiom (set -u, cd-to-repo-root, ok/bad helpers, inline `node -e`
# JSON asserts, self-cleaning temp space, named-exit). No test framework — bash smoke is
# the project idiom.
#
# State: AUTHORED RED (Plan 02-01, Nyquist Wave-0). The controller arrives in Plan 02-02;
# until then EVERY controller-driven assert is EXPECTED to fail with a clear "FAIL:" line
# (not a bash crash). This mirrors Phase-1's STORE-02/03 asserts authored ahead of their
# bricks. When Plan 02-02 lands run-controller.js, this harness turns GREEN unchanged.
#
# Run:
#   bash engine/contracts/controller-smoke.sh [--space=_ctrlsmoke]
# Exit 0 = all asserts pass; non-zero = the named assert above failed.
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root

# --- arg parse: --space=<s> (default _ctrlsmoke scratch) ------------------
SPACE="_ctrlsmoke"
for a in "$@"; do
  case "$a" in
    --space=*) SPACE="${a#--space=}" ;;
  esac
done

FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

# --- fixture + unit-under-test paths --------------------------------------
CTRL="engine/bricks/run-controller.js"           # the unit under test (Plan 02-02)
FIX_PIPE="runs/_fixture/pipeline/pipeline.yaml"   # fixture flat id list (CTRL-02/10)
FIX_MAN="runs/_fixture/pipeline/manifests"        # fixture §5 manifests
RC_DIR="runs/${SPACE}/_receipts"

# Controller-missing guard: if the brick does not exist yet (RED state), every assert
# below should still emit a single named FAIL line instead of crashing under set -u.
HAVE_CTRL=0
[ -f "$CTRL" ] && HAVE_CTRL=1

# Helper: run the controller; if it is missing, fail the named assert cleanly (RED-safe).
# Usage: run_ctrl "<assert-name>" <args...>  -> sets RC_OUT (stdout+stderr) and RC_STATUS.
run_ctrl() {
  local name="$1"; shift
  if [ "$HAVE_CTRL" -eq 0 ]; then
    RC_OUT=""; RC_STATUS=127
    bad "${name}: controller missing (${CTRL}) — RED until Plan 02-02"
    return 1
  fi
  RC_OUT=$(node "$CTRL" "$@" 2>&1); RC_STATUS=$?
  return 0
}

rm -rf "runs/${SPACE}"                  # clean START (gitignore does NOT auto-ignore runs/_ctrlsmoke)

# ==========================================================================
# CTRL-11 — manifest loader reads the §5 shape (loadManifest)
# `--print-manifest=<id>` debug flag prints the loaded manifest object; assert it
# carries all §5 keys (reads/writes/scripts/prompt/agents/validator/gate).
# ==========================================================================
echo "── CTRL-11: loadManifest returns §5 shape ──"
if run_ctrl "CTRL-11" --print-manifest=fx-01-emit --manifest-dir="$FIX_MAN"; then
  PM_OUT="$RC_OUT" node -e '
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    let m=null; try{ m=JSON.parse(process.env.PM_OUT); }catch(e){}
    const keys=["id","reads","writes","scripts","prompt","agents","validator","gate"];
    (m && keys.every(k=>k in m)) ? ok("CTRL-11: manifest has all §5 keys") : bad("CTRL-11: missing §5 key(s) in print-manifest output");
    process.exit(fail);
  ' || FAIL=1
fi

# ==========================================================================
# CTRL-01 — single step runs all 7 phases + a receipt lands
# scaffold so the fixture reads[] (bet-brief.md) exists, then run one step.
# ==========================================================================
echo "── CTRL-01: single step runs all 7 phases ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-01" fx-01-emit --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  [ "$RC_STATUS" -eq 0 ] && ok "CTRL-01: single-step exit 0" || bad "CTRL-01: single-step exit ${RC_STATUS} (want 0)"
  MISS=0
  for marker in PREFLIGHT PLAN CONTEXT SPAWN VALIDATE STORE GATE; do
    echo "$RC_OUT" | grep -q "$marker" || { MISS=1; }
  done
  [ "$MISS" -eq 0 ] && ok "CTRL-01: all 7 phase markers present" || bad "CTRL-01: missing one of the 7 phase markers"
  ls "$RC_DIR"/*.json >/dev/null 2>&1 && ok "CTRL-01: a receipt landed under _receipts/" || bad "CTRL-01: no receipt under ${RC_DIR}"
fi

# ==========================================================================
# CTRL-04 — plan-print declares the DAG BEFORE anything runs
# The PLAN block must appear before the first SPAWN/STORE/"wrote" line.
# ==========================================================================
echo "── CTRL-04: plan-print precedes execution ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-04" fx-01-emit --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  RC_OUT="$RC_OUT" node -e '
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    const lines=(process.env.RC_OUT||"").split("\n");
    const planIdx=lines.findIndex(l=>/PLAN/.test(l));
    const runIdx =lines.findIndex(l=>/SPAWN|STORE|wrote/.test(l));
    (planIdx>=0 && (runIdx<0 || planIdx<runIdx)) ? ok("CTRL-04: PLAN block precedes first SPAWN/STORE line") : bad("CTRL-04: plan did not print before execution (plan="+planIdx+" run="+runIdx+")");
    process.exit(fail);
  ' || FAIL=1
fi

# ==========================================================================
# CTRL-05 — context assembly embeds the reads[] bytes (no file to Read)
# Under --smoke the controller surfaces the assembled context block; assert it carries
# a DATA boundary marker for bet-brief.md (the agent receives bytes, not a fetch).
# ==========================================================================
echo "── CTRL-05: context embeds reads[] bytes ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-05" fx-01-emit --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  echo "$RC_OUT" | grep -q "bet-brief.md" && echo "$RC_OUT" | grep -qE "<<<DATA|CONTEXT" \
    && ok "CTRL-05: assembled context embeds bet-brief.md bytes (DATA boundary)" \
    || bad "CTRL-05: no embedded reads[] bytes / DATA boundary in context"
fi

# ==========================================================================
# CTRL-06 — spawn waves capped ≤5 (agents:6 → 2 waves: 5 + 1)
# ==========================================================================
echo "── CTRL-06: spawn waves capped ≤5 ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-06" fx-03-wave --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  RC_OUT="$RC_OUT" node -e '
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    const out=process.env.RC_OUT||"";
    // expect two waves for agents:6, none larger than 5. Match a "wave N" log with a count.
    const w1=/wave 1[^0-9]*\(?5/.test(out);
    const w2=/wave 2[^0-9]*\(?1/.test(out);
    const over=/wave \d+[^0-9]*\(?([6-9]|\d{2,})/.test(out);  // any wave of size >=6 is a violation
    (w1 && w2 && !over) ? ok("CTRL-06: agents:6 fans into 2 waves (5+1), none >5") : bad("CTRL-06: wave-cap not 2 waves of 5+1 (or a wave >5)");
    process.exit(fail);
  ' || FAIL=1
fi

# ==========================================================================
# CTRL-02 — `run all` walks the fixture pipeline in R1 (file) order
# fx-01-emit must be stored BEFORE fx-02-gate. Order is proven from the controller's
# STORE emit SEQUENCE in stdout (a monotonic per-step index), NOT from millisecond ts:
# two steps can mint receipts in the same ISO-ms, which would false-green a non-strict
# `ts<=ts` compare for BOTH the forward (CTRL-02) and reversed (CTRL-10) assert. The
# STORE-line index is strictly increasing per executed step, so it cannot collide.
# ==========================================================================
echo "── CTRL-02: run all walks pipeline in order ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-02" all --pipeline="$FIX_PIPE" --manifest-dir="$FIX_MAN" --space="${SPACE}" --smoke; then
  [ "$RC_STATUS" -eq 0 ] && ok "CTRL-02: run all exit 0" || bad "CTRL-02: run all exit ${RC_STATUS} (want 0)"
  RC_OUT="$RC_OUT" node -e '
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    // Derive step order from the monotonic STORE emit sequence in stdout (sequence, not wall-clock).
    const stores=(process.env.RC_OUT||"").split("\n").filter(l=>/^STORE \[/.test(l));
    const iEmit=stores.findIndex(l=>l.indexOf("[fx-01-emit]")>=0);
    const iGate=stores.findIndex(l=>l.indexOf("[fx-02-gate]")>=0);
    // STRICT < AND both present AND distinct lines → robust to a same-millisecond collision.
    (iEmit>=0 && iGate>=0 && iEmit<iGate) ? ok("CTRL-02: fx-01-emit stored before fx-02-gate (STORE sequence, strict)") : bad("CTRL-02: STORE order does not follow the pipeline file (emit#"+iEmit+" gate#"+iGate+")");
    process.exit(fail);
  ' || FAIL=1
fi

# ==========================================================================
# CTRL-10 — pipeline order = a config edit (reverse the file → receipt order follows)
# Copy the fixture pipeline reversed; run --pipeline=<temp>; assert order flips. No code edit.
# ==========================================================================
echo "── CTRL-10: reorder = config edit, no code ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
TMP_PIPE="runs/${SPACE}/_rev-pipeline.yaml"
printf 'steps:\n  - fx-02-gate\n  - fx-01-emit\n' > "$TMP_PIPE"
if run_ctrl "CTRL-10" all --pipeline="$TMP_PIPE" --manifest-dir="$FIX_MAN" --space="${SPACE}" --smoke; then
  RC_OUT="$RC_OUT" node -e '
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    // Same monotonic STORE-sequence proof as CTRL-02, but the reversed pipeline must flip it:
    // fx-02-gate now stored BEFORE fx-01-emit. Strict < on the sequence index — a same-ms ts
    // collision could satisfy BOTH directions under the old `ts<=ts`; the index cannot.
    const stores=(process.env.RC_OUT||"").split("\n").filter(l=>/^STORE \[/.test(l));
    const iEmit=stores.findIndex(l=>l.indexOf("[fx-01-emit]")>=0);
    const iGate=stores.findIndex(l=>l.indexOf("[fx-02-gate]")>=0);
    (iEmit>=0 && iGate>=0 && iGate<iEmit) ? ok("CTRL-10: reversed file → fx-02-gate stored before fx-01-emit (order follows config)") : bad("CTRL-10: STORE order did not follow the reversed pipeline file (emit#"+iEmit+" gate#"+iGate+")");
    process.exit(fail);
  ' || FAIL=1
fi
# (temp pipeline lives under the scratch space — removed with the rm -rf at end.)

# ==========================================================================
# CTRL-03 — preflight named refusal on a missing input (negative)
# scaffold, DELETE the reads[] artifact, then run → exit≠0 + stderr names the path + REFUSE.
# ==========================================================================
echo "── CTRL-03: preflight named refusal ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
rm -f "runs/${SPACE}/bet-brief.md"
if run_ctrl "CTRL-03" fx-01-emit --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  [ "$RC_STATUS" -ne 0 ] && ok "CTRL-03: missing input → exit ${RC_STATUS} (non-zero)" || bad "CTRL-03: missing input did NOT refuse (exit 0)"
  echo "$RC_OUT" | grep -q "REFUSE" && echo "$RC_OUT" | grep -q "bet-brief.md" \
    && ok "CTRL-03: stderr names REFUSE + the missing bet-brief.md path" \
    || bad "CTRL-03: refusal did not name REFUSE + the missing path"
fi

# ==========================================================================
# CTRL-07 — validator invoked EXPLICITLY; reject → re-spawn ≤2 → escalate (negative)
# fx-bad-emit writes space-map.json (a stub) → route.js dispatches validate-classifier.js
# → reject (exit 2). The controller re-spawns ≤2 then escalates non-zero.
# ==========================================================================
echo "── CTRL-07: validator explicit + reject→re-spawn≤2→escalate ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-07" fx-bad-emit --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  echo "$RC_OUT" | grep -qiE "classifier|reject|VALIDATE" \
    && ok "CTRL-07: a validator subprocess ran (explicit, not a silent pass)" \
    || bad "CTRL-07: no validator output — validate phase did not fire explicitly"
  { [ "$RC_STATUS" -ne 0 ] && echo "$RC_OUT" | grep -qi "escalate"; } \
    && ok "CTRL-07: reject → escalate line + non-zero exit (${RC_STATUS}) after bounded re-spawn" \
    || bad "CTRL-07: bad emit did not escalate non-zero (exit ${RC_STATUS})"
fi

# ==========================================================================
# CTRL-08 — no-overwrite version + receipt write-once, unique id (3 sub-asserts)
#   (a) happy run leaves a receipt with the required keys + sha256 inputs_hash
#   (b) UNIT: space-version.js prints <space>-v2 after scaffold (read-only NAMING)
#   (c) UNIT: receipt-write.js twice with the same spawn-id → second exits 1 (write-once)
# ==========================================================================
echo "── CTRL-08: no-overwrite version + receipt write-once ──"
# (a) receipt keys from a happy run
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-08a" fx-01-emit --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  SPACE="$SPACE" node -e '
    const fs=require("fs");
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    const dir="runs/"+process.env.SPACE+"/_receipts";
    let recs=[];
    try{ recs=fs.readdirSync(dir).filter(f=>f.endsWith(".json")); }catch(e){}
    if(!recs.length){ bad("CTRL-08(a): no receipt to inspect"); process.exit(fail); }
    const r=JSON.parse(fs.readFileSync(dir+"/"+recs[0],"utf8"));
    (r.spawn_id && r.inputs_hash!==undefined && r.validator_verdicts!==undefined && r.gate!==undefined) ? ok("CTRL-08(a): receipt carries spawn_id/inputs_hash/validator_verdicts/gate") : bad("CTRL-08(a): receipt missing required key");
    (/^[0-9a-f]{64}$/.test(r.inputs_hash||"")) ? ok("CTRL-08(a): inputs_hash is sha256") : bad("CTRL-08(a): inputs_hash not sha256: "+r.inputs_hash);
    process.exit(fail);
  ' || FAIL=1
fi
# (b) UNIT: space-version.js NAMING (independent of the controller — always runnable)
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
NEXT=$(node engine/bricks/space-version.js --space="${SPACE}" 2>/dev/null)
[ "$NEXT" = "${SPACE}-v2" ] && ok "CTRL-08(b): space-version names ${SPACE}-v2 (no-overwrite NAMING)" || bad "CTRL-08(b): space-version returned '$NEXT' (want ${SPACE}-v2)"
# (c) UNIT: receipt-write.js write-once (same spawn-id twice → second exit 1)
node engine/bricks/receipt-write.js --space="${SPACE}" --spawn-id=dup-08 --step=fx --inputs="runs/${SPACE}/bet-brief.md" >/dev/null 2>&1
node engine/bricks/receipt-write.js --space="${SPACE}" --spawn-id=dup-08 --step=fx --inputs="runs/${SPACE}/bet-brief.md" >/dev/null 2>&1
[ "$?" -ne 0 ] && ok "CTRL-08(c): receipt-write refuses a colliding spawn-id (write-once)" || bad "CTRL-08(c): second write with same spawn-id did NOT exit non-zero"

# ==========================================================================
# CTRL-09 — gate block-and-log (gate:true fixture, --smoke auto-approves, logged)
# stdout shows GATE [fx-02-gate] auto-approved; receipt gate.step_gated===true.
# ==========================================================================
echo "── CTRL-09: gate block-and-log ──"
rm -rf "runs/${SPACE}"
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1
if run_ctrl "CTRL-09" fx-02-gate --space="${SPACE}" --smoke --manifest-dir="$FIX_MAN"; then
  echo "$RC_OUT" | grep -q "GATE \[fx-02-gate\]" && echo "$RC_OUT" | grep -qi "auto-approved" \
    && ok "CTRL-09: GATE [fx-02-gate] auto-approved logged (never silent)" \
    || bad "CTRL-09: gate decision not logged for fx-02-gate"
  SPACE="$SPACE" node -e '
    const fs=require("fs");
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    const dir="runs/"+process.env.SPACE+"/_receipts";
    let recs=[];
    try{ recs=fs.readdirSync(dir).filter(f=>f.endsWith(".json")).map(f=>JSON.parse(fs.readFileSync(dir+"/"+f,"utf8"))); }catch(e){}
    const gated=recs.some(r=>r.gate && r.gate.step_gated===true);
    gated ? ok("CTRL-09: receipt records gate.step_gated===true") : bad("CTRL-09: no receipt with gate.step_gated===true");
    process.exit(fail);
  ' || FAIL=1
fi

# ==========================================================================
# CTRL-12 — assembled from bricks, NOT rewritten (STATIC grep on the controller source)
# The controller MUST NOT re-implement hashing / sanitization / version-scan / a slot list;
# it MUST require ./lib/fanout-path and spawn receipt-write.js / space-version.js / route.js.
# RED until Plan 02-02 writes run-controller.js.
# ==========================================================================
echo "── CTRL-12: assembled from bricks (static grep) ──"
if [ "$HAVE_CTRL" -eq 0 ]; then
  bad "CTRL-12: controller missing (${CTRL}) — RED until Plan 02-02"
else
  CTRL="$CTRL" node -e '
    const fs=require("fs");
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    const src=fs.readFileSync(process.env.CTRL,"utf8");
    // NONE of these may appear (no re-implemented brick logic):
    const banned=[
      [/createHash/, "createHash (re-implements receipt sha256)"],
      [/\[a-z0-9\._-\]/, "inline sanitize regex (re-implements fanout-path)"],
      [/replace\(\/\\\.\\\./, "inline ../ strip (re-implements sanitizer)"],
      [/-v\\d/, "inline -vN version scan (re-implements space-version)"]
    ];
    let clean=true;
    for(const [re,why] of banned){ if(re.test(src)){ clean=false; bad("CTRL-12: forbidden inline brick logic: "+why); } }
    clean && ok("CTRL-12: no re-implemented hash/sanitize/version logic");
    // MUST reuse the shared sanitizer + spawn the bricks:
    /require\(.\.\/lib\/fanout-path.\)/.test(src) ? ok("CTRL-12: requires ./lib/fanout-path") : bad("CTRL-12: does not require ./lib/fanout-path");
    /receipt-write\.js/.test(src) ? ok("CTRL-12: spawns receipt-write.js") : bad("CTRL-12: does not spawn receipt-write.js");
    /space-version\.js/.test(src) ? ok("CTRL-12: spawns space-version.js") : bad("CTRL-12: does not spawn space-version.js");
    /route\.js/.test(src) ? ok("CTRL-12: dispatches via route.js") : bad("CTRL-12: does not dispatch via route.js");
    process.exit(fail);
  ' || FAIL=1
fi

# ==========================================================================
rm -rf "runs/${SPACE}"                  # clean END — leave git status clean for runs/
echo ""
if [ "$FAIL" -eq 0 ]; then echo "CONTROLLER-SMOKE: ALL ASSERTS PASS ✓"; exit 0;
else echo "CONTROLLER-SMOKE: FAILED — see the named assert above"; exit 1; fi
