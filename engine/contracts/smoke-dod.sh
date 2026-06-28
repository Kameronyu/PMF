#!/usr/bin/env bash
# smoke-dod.sh — SMOKE-DOD: the Phase-6 milestone Definition-of-Done acceptance harness.
# Asserts the PROJECT Core Value at the RUN grain — the shell completes end-to-end on stub
# prompts: every declared artifact produced AND consumed, deterministic routing, operator
# gates logged, unbroken receipts chain, zero orphan outputs / dangling inputs (SMOKE-01..05),
# plus a completeness/canonical-order guard (SMOKE-05) proven RED-first: a dropped or reordered
# producer must fail fast with a NAMED `pipeline incomplete/misordered` refusal BEFORE any spawn.
#
# Mirrors the engine smoke idiom (set -u, cd-to-repo-root, ok/bad accumulate-then-report, inline
# `node -e` asserts, named failures, final "ALL ASSERTS PASS"). All work runs into disposable
# runs/_vfy* spaces + temp pipeline files and is rm -rf'd after — NO committed file is mutated
# (never touches runs/smoke/, pipeline.yaml, or engine/manifests/).
#
# Determinism pin: unset VOYAGE_API_KEY so any embed-touching step cannot make a live network
# call that would break byte-stable re-runs (matches h5-e2e / validate-smoke).
#
# Run:  bash engine/contracts/smoke-dod.sh
# Exit 0 = all asserts pass; non-zero = the named assert above failed.
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root
unset VOYAGE_API_KEY

CTRL="engine/bricks/run-controller.js"
MANIFEST_DIR="engine/manifests"
PIPELINE="pipeline.yaml"

FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

# REJECT/REFUSE assert: run a command, expect non-zero exit AND a stderr line matching a named
# pattern. Passing (exit 0) or a missing pattern is a FAIL.
expect_reject() {  # $1=label  $2=grep-pattern  ...rest=command
  local label="$1"; shift
  local pat="$1"; shift
  local out rc
  out=$("$@" 2>&1); rc=$?
  if [ "$rc" -eq 0 ]; then bad "$label — command unexpectedly PASSED (exit 0); expected REFUSE"; return; fi
  if echo "$out" | grep -qE "$pat"; then ok "$label — named refusal: $(echo "$out" | grep -E "$pat" | head -1)"
  else bad "$label — failed (exit $rc) but no line matched /$pat/; got: $(echo "$out" | grep -iE 'REJECT|REFUSE|ESCALATE|FATAL' | head -1)"; fi
}

VSP="_vfy_dod"            # primary DoD run space
DSP="_vfy_dod_det2"       # determinism + happy-path custom-pipeline run space
TMPD="runs/_vfy_dod_tmp"  # temp pipeline fixtures
rm -rf "runs/${VSP}" "runs/${DSP}" "$TMPD"
mkdir -p "$TMPD"

# ==========================================================================
# Drive ONE clean full pipeline into a fresh space; reuse it for SMOKE-01..05.
# ==========================================================================
echo "── SMOKE-01: run all --smoke completes end-to-end on stub prompts ──"
RUNOUT=$(node "$CTRL" all --space="${VSP}" --smoke 2>&1); RC=$?
if [ "$RC" -ne 0 ]; then
  bad "SMOKE-01: run all --space=${VSP} exited ${RC} (expected 0) — $(echo "$RUNOUT"|grep -E 'REJECT|REFUSE|ESCALATE|FATAL'|head -1)"
else
  ok "SMOKE-01: run all completed clean (exit 0)"
fi

# 11 receipts + canonical R1 order proven BY the receipts (sorted by ts, non-decreasing along
# pipeline order) — order proven by the run, not by re-reading pipeline.yaml.
node -e '
  const fs=require("fs"),path=require("path");
  const VSP=process.argv[1], PIPE=process.argv[2];
  const rdir=path.join("runs",VSP,"_receipts");
  const canon=fs.readFileSync(PIPE,"utf8").split("\n").map(l=>l.trim()).filter(l=>l.startsWith("- ")).map(l=>l.slice(2).trim());
  let f=[]; try{ f=fs.readdirSync(rdir).filter(x=>x.endsWith(".json")); }catch(e){}
  const recs=f.map(x=>JSON.parse(fs.readFileSync(path.join(rdir,x),"utf8")));
  if(recs.length!==11){ console.log("BAD SMOKE-01: expected 11 receipts, got "+recs.length); process.exit(1); }
  // one receipt per canonical step, none missing/dup
  const steps=recs.map(r=>r.step).sort();
  const want=[...canon].sort();
  if(JSON.stringify(steps)!==JSON.stringify(want)){ console.log("BAD SMOKE-01: receipt steps != canonical 11: "+steps.join(",")); process.exit(1); }
  // canonical order: ts of step at pipeline pos i must be <= ts at pos i+1 (ISO sorts lexically)
  const tsBy={}; for(const r of recs) tsBy[r.step]=r.ts;
  for(let i=0;i+1<canon.length;i++){
    if(!(tsBy[canon[i]]<=tsBy[canon[i+1]])){ console.log("BAD SMOKE-01: out-of-order ts: "+canon[i]+"("+tsBy[canon[i]]+") > "+canon[i+1]+"("+tsBy[canon[i+1]]+")"); process.exit(1); }
  }
  console.log("OK SMOKE-01: 11 receipts, one per canonical step, ts non-decreasing in R1 order");
' "$VSP" "$PIPELINE" >/tmp/_dod_s1.txt 2>&1
if grep -q "^OK SMOKE-01" /tmp/_dod_s1.txt; then ok "$(grep '^OK SMOKE-01' /tmp/_dod_s1.txt|sed 's/^OK //')"; else bad "$(grep '^BAD SMOKE-01' /tmp/_dod_s1.txt|head -1|sed 's/^BAD //' || echo 'SMOKE-01 receipt/order check crashed')"; fi

# ==========================================================================
# SMOKE-02 — every preflight green + every validator verdict == pass.
# (preflight-green is implied: a REFUSE aborts the run, so exit 0 + 11 receipts ⇒ all preflights passed.)
# ==========================================================================
echo "── SMOKE-02: every validator verdict == pass across the whole run ──"
node -e '
  const fs=require("fs"),path=require("path");
  const rdir=path.join("runs",process.argv[1],"_receipts");
  const recs=fs.readdirSync(rdir).filter(x=>x.endsWith(".json")).map(x=>JSON.parse(fs.readFileSync(path.join(rdir,x),"utf8")));
  let bad=0;
  for(const r of recs){
    const vv=r.validator_verdicts;
    if(!Array.isArray(vv)||vv.length===0){ console.log("BAD SMOKE-02: "+r.step+" has empty validator_verdicts"); bad++; continue; }
    for(const v of vv){ if(v.verdict!=="pass"){ console.log("BAD SMOKE-02: "+r.step+" verdict not pass: "+JSON.stringify(v)); bad++; } }
  }
  if(bad===0) console.log("OK SMOKE-02: all "+recs.length+" receipts carry non-empty all-pass validator_verdicts");
' "$VSP" >/tmp/_dod_s2.txt 2>&1
if grep -q "^OK SMOKE-02" /tmp/_dod_s2.txt; then ok "$(grep '^OK SMOKE-02' /tmp/_dod_s2.txt|sed 's/^OK //')"; else bad "$(grep '^BAD SMOKE-02' /tmp/_dod_s2.txt|head -1|sed 's/^BAD //' || echo 'SMOKE-02 crashed')"; fi

# ==========================================================================
# SMOKE-03 — every declared writes[] slot (all 11 manifests, {space}->VSP) materialized on disk.
# ==========================================================================
echo "── SMOKE-03: every declared writes[] slot materialized under the run space ──"
node -e '
  const fs=require("fs"),path=require("path");
  const VSP=process.argv[1], MDIR=process.argv[2];
  const ids=fs.readdirSync(MDIR).filter(f=>f.endsWith(".json")).map(f=>f.replace(/\.json$/,"")).sort();
  let missing=0, n=0;
  for(const id of ids){
    const m=JSON.parse(fs.readFileSync(path.join(MDIR,id+".json"),"utf8"));
    for(const w of (m.writes||[])){
      const p=w.replace("{space}",VSP); n++;
      const isDir=p.endsWith("/");
      const exists=isDir ? (fs.existsSync(p)&&fs.statSync(p).isDirectory()) : fs.existsSync(p);
      if(!exists){ console.log("BAD SMOKE-03: unmaterialized "+(isDir?"dir":"file")+" slot: "+p+" (step "+id+")"); missing++; }
    }
  }
  if(missing===0) console.log("OK SMOKE-03: all "+n+" declared writes[] slots materialized");
' "$VSP" "$MANIFEST_DIR" >/tmp/_dod_s3.txt 2>&1
if grep -q "^OK SMOKE-03" /tmp/_dod_s3.txt; then ok "$(grep '^OK SMOKE-03' /tmp/_dod_s3.txt|sed 's/^OK //')"; else bad "$(grep '^BAD SMOKE-03' /tmp/_dod_s3.txt|head -1|sed 's/^BAD //' || echo 'SMOKE-03 crashed')"; fi

# ==========================================================================
# SMOKE-04 — operator gates logged + unbroken receipt chain.
#   GATED={00,01,05,07,08,10}: step_gated===true, decision==="auto-approved-smoke".
#   non-gated: step_gated===false, decision===null.  inputs_hash 64-hex; verdicts non-empty all-pass.
# ==========================================================================
echo "── SMOKE-04: gates logged + unbroken 11-receipt chain ──"
node -e '
  const fs=require("fs"),path=require("path");
  const rdir=path.join("runs",process.argv[1],"_receipts");
  const GATED=new Set(["00-bet-compiler","01-collect","05-market-selection","07-funnel-architect","08-copywriter","10-adversarial-re-review"]);
  const recs=fs.readdirSync(rdir).filter(x=>x.endsWith(".json")).map(x=>JSON.parse(fs.readFileSync(path.join(rdir,x),"utf8")));
  let bad=0;
  if(recs.length!==11){ console.log("BAD SMOKE-04: chain length "+recs.length+" != 11"); bad++; }
  const seen=new Set();
  for(const r of recs){
    if(seen.has(r.step)){ console.log("BAD SMOKE-04: duplicate receipt for "+r.step); bad++; } seen.add(r.step);
    if(!/^[0-9a-f]{64}$/.test(r.inputs_hash||"")){ console.log("BAD SMOKE-04: "+r.step+" inputs_hash not 64-hex"); bad++; }
    const g=r.gate||{};
    if(GATED.has(r.step)){
      if(g.step_gated!==true||g.decision!=="auto-approved-smoke"){ console.log("BAD SMOKE-04: gated "+r.step+" gate="+JSON.stringify(g)); bad++; }
    } else {
      if(g.step_gated!==false||g.decision!==null){ console.log("BAD SMOKE-04: non-gated "+r.step+" gate="+JSON.stringify(g)); bad++; }
    }
  }
  if(bad===0) console.log("OK SMOKE-04: 11-receipt chain unbroken; 6 gated log auto-approved-smoke, 5 non-gated null; all inputs_hash 64-hex");
' "$VSP" >/tmp/_dod_s4.txt 2>&1
if grep -q "^OK SMOKE-04" /tmp/_dod_s4.txt; then ok "$(grep '^OK SMOKE-04' /tmp/_dod_s4.txt|sed 's/^OK //')"; else bad "$(grep '^BAD SMOKE-04' /tmp/_dod_s4.txt|head -1|sed 's/^BAD //' || echo 'SMOKE-04 crashed')"; fi

# ==========================================================================
# SMOKE-05 (positive) — zero orphan / zero dangling over the REAL emitted run.
#   Build producedBy[path]=[pos...] from each step's receipt.outputs in canonical order, then:
#     * every receipt.inputs entry has a strictly-earlier producer (direct or dir-parent), else DANGLING;
#     * every output consumed by a strictly-later step OR a TERMINAL bound to its owning step, else ORPHAN.
#   (mirrors manifest-smoke.sh MANIFEST-02 matching, computed over the real run not the manifests.)
# ==========================================================================
echo "── SMOKE-05a: zero orphan / zero dangling over the REAL run ──"
node -e '
  const fs=require("fs"),path=require("path");
  const VSP=process.argv[1], PIPE=process.argv[2];
  const rdir=path.join("runs",VSP,"_receipts");
  const canon=fs.readFileSync(PIPE,"utf8").split("\n").map(l=>l.trim()).filter(l=>l.startsWith("- ")).map(l=>l.slice(2).trim());
  const pos={}; canon.forEach((id,i)=>pos[id]=i);
  const recById={};
  for(const x of fs.readdirSync(rdir).filter(x=>x.endsWith(".json"))){ const r=JSON.parse(fs.readFileSync(path.join(rdir,x),"utf8")); recById[r.step]=r; }
  // producedBy over the real run (outputs), keyed by path -> [positions]
  const producedBy={};
  for(const id of canon){ const r=recById[id]; if(!r)continue; for(const o of (r.outputs||[])){ (producedBy[o]=producedBy[o]||[]).push(pos[id]); } }
  const sp=s=>s.replace("{space}",VSP);
  const TERMINAL={ [sp("runs/{space}/queries_run.json")]:pos["01-collect"], [sp("runs/{space}/dumps/")]:pos["01-collect"],
                   [sp("runs/{space}/audit-verdicts.json")]:pos["07-funnel-architect"],
                   [sp("runs/{space}/review/_review.json")]:pos["10-adversarial-re-review"], [sp("runs/{space}/review/")]:pos["10-adversarial-re-review"] };
  const earlierProducer=(p,rp)=>{
    if((producedBy[p]||[]).some(q=>q<rp)) return true;                       // direct
    for(const w of Object.keys(producedBy)){ if(w.endsWith("/")&&p!==w&&p.startsWith(w)&&(producedBy[w]||[]).some(q=>q<rp)) return true; } // dir-parent
    return false;
  };
  let dangling=0, orphan=0;
  for(const id of canon){ const r=recById[id]; if(!r)continue; const rp=pos[id];
    for(const inp of (r.inputs||[])){ if(!earlierProducer(inp,rp)){ console.log("BAD SMOKE-05a DANGLING: "+id+" reads "+inp+" with no strictly-earlier producer in the real run"); dangling++; } }
  }
  const consumedLater=(w,wp)=>{
    for(const id of canon){ const r=recById[id]; if(!r||pos[id]<=wp)continue;
      for(const inp of (r.inputs||[])){ if(inp===w) return true; if(w.endsWith("/")&&inp!==w&&inp.startsWith(w)) return true; }
    } return false;
  };
  for(const id of canon){ const r=recById[id]; if(!r)continue; const wp=pos[id];
    for(const w of (r.outputs||[])){
      if(consumedLater(w,wp)) continue;
      if(w in TERMINAL){ if(TERMINAL[w]===wp) continue; console.log("BAD SMOKE-05a WRONG-PRODUCER terminal: "+id+" emits "+w); orphan++; continue; }
      console.log("BAD SMOKE-05a ORPHAN: "+id+" writes "+w+" (no later consumer, not a bound terminal)"); orphan++;
    }
  }
  if(dangling===0&&orphan===0) console.log("OK SMOKE-05a: real run is graph-closed — 0 dangling inputs, 0 orphan outputs");
' "$VSP" "$PIPELINE" >/tmp/_dod_s5a.txt 2>&1
if grep -q "^OK SMOKE-05a" /tmp/_dod_s5a.txt; then ok "$(grep '^OK SMOKE-05a' /tmp/_dod_s5a.txt|sed 's/^OK //')"; else bad "$(grep '^BAD SMOKE-05a' /tmp/_dod_s5a.txt|head -1|sed 's/^BAD //' || echo 'SMOKE-05a crashed')"; fi

# ==========================================================================
# SMOKE-05 (negative) — the completeness/canonical-order guard. RED until the runAll preflight lands.
#   A DROPPED producer (drop 02 -> step 03 reads ad-volume-aggregate.json dangling) and a
#   REORDERED producer (03 before 02) must each fail fast with a NAMED `pipeline incomplete/misordered`
#   refusal BEFORE any spawn. A complete custom pipeline must PASS (guard is not a blanket reject).
# ==========================================================================
echo "── SMOKE-05b: dropped/reordered producer fails fast (named completeness refusal); full pipeline passes ──"
ALL=$(grep -E '^\s*- ' "$PIPELINE" | sed 's/^[[:space:]]*-[[:space:]]*//')
# fixture: full copy (happy path)
printf 'steps:\n' > "$TMPD/pipe-full.yaml";    for s in $ALL; do printf -- '- %s\n' "$s" >> "$TMPD/pipe-full.yaml"; done
# fixture: drop 02-funnel-analysis
printf 'steps:\n' > "$TMPD/pipe-drop.yaml";     for s in $ALL; do [ "$s" = "02-funnel-analysis" ] || printf -- '- %s\n' "$s" >> "$TMPD/pipe-drop.yaml"; done
# fixture: reorder — 03-space-map placed BEFORE 02-funnel-analysis
printf 'steps:\n' > "$TMPD/pipe-reorder.yaml"
for s in $ALL; do
  if [ "$s" = "02-funnel-analysis" ]; then continue
  elif [ "$s" = "03-space-map" ]; then printf -- '- %s\n' "03-space-map" >> "$TMPD/pipe-reorder.yaml"; printf -- '- %s\n' "02-funnel-analysis" >> "$TMPD/pipe-reorder.yaml"
  else printf -- '- %s\n' "$s" >> "$TMPD/pipe-reorder.yaml"; fi
done

expect_reject "SMOKE-05b: dropped producer (02 removed)"   "pipeline incomplete/misordered" \
  node "$CTRL" all --space="_vfy_dod_drop" --smoke --pipeline="$TMPD/pipe-drop.yaml"
rm -rf "runs/_vfy_dod_drop"
expect_reject "SMOKE-05b: reordered producer (03 before 02)" "pipeline incomplete/misordered" \
  node "$CTRL" all --space="_vfy_dod_reord" --smoke --pipeline="$TMPD/pipe-reorder.yaml"
rm -rf "runs/_vfy_dod_reord"

# happy-path: a COMPLETE custom pipeline passes the guard AND runs clean (also the determinism 2nd run).
HRUN=$(node "$CTRL" all --space="${DSP}" --smoke --pipeline="$TMPD/pipe-full.yaml" 2>&1); HRC=$?
if [ "$HRC" -eq 0 ]; then ok "SMOKE-05b: complete custom pipeline passes the guard and runs clean (exit 0)"; else bad "SMOKE-05b: complete pipeline unexpectedly failed (exit $HRC) — $(echo "$HRUN"|grep -E 'REFUSE|REJECT|FATAL'|head -1)"; fi

# ==========================================================================
# DETERMINISM — two fresh full runs byte-identical (exclude _receipts/ + *-log.txt).
# (DSP was produced by the happy-path full custom pipeline above = a 2nd independent full run.)
# ==========================================================================
echo "── DETERMINISM: two fresh full runs byte-identical (excl _receipts/, *-log.txt) ──"
DIFF=$(diff -r --exclude="_receipts" --exclude="*-log.txt" "runs/${VSP}" "runs/${DSP}" 2>&1)
if [ -z "$DIFF" ]; then ok "DETERMINISM: runs/${VSP} and runs/${DSP} byte-identical (excl receipts/logs)"; else bad "DETERMINISM: runs differ — $(echo "$DIFF"|head -3|tr '\n' ' ')"; fi

# ==========================================================================
# Cleanup — no committed state mutated; all disposable spaces + temp fixtures removed.
# ==========================================================================
rm -rf "runs/${VSP}" "runs/${DSP}" "$TMPD" /tmp/_dod_s*.txt
rm -rf runs/_vfy_dod_drop runs/_vfy_dod_reord 2>/dev/null

echo ""
if [ "$FAIL" -eq 0 ]; then echo "SMOKE-DOD: ALL ASSERTS PASS ✓"; exit 0
else echo "SMOKE-DOD: FAILED — see the named assert(s) above"; exit 1; fi
