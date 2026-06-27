#!/usr/bin/env bash
# manifest-smoke.sh — MANIFEST-SMOKE: the Phase-3 step-manifest acceptance harness.
# Asserts MANIFEST-01..04 + WIRE-01 + WIRE-02 + graph integrity (orphans=0/dangling=0)
# against the 11 real manifests under engine/manifests/. Copies the engine's proven
# store-smoke.sh / controller-smoke.sh idiom (set -u, cd-to-repo-root, ok/bad helpers,
# inline `node -e` JSON asserts, named-exit, accumulate-then-report). No test framework —
# bash smoke is the project idiom.
#
# RED-first: authored before the manifests exist. With engine/manifests/ empty, the
# "11 manifests exist + parse" asserts emit named FAIL lines (not bash crashes). When the
# 11 manifests land, this harness turns GREEN unchanged.
#
# Run:
#   bash engine/contracts/manifest-smoke.sh
# Exit 0 = all asserts pass; non-zero = the named assert above failed.
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root

FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

MAN_DIR="engine/manifests"
CTRL="engine/bricks/run-controller.js"

# Canonical R1 step ids (the order pipeline.yaml walks; MANIFEST-01 set).
IDS=(00-bet-compiler 01-collect 02-funnel-analysis 03-space-map 04-voc-market-pass \
     05-market-selection 06-voc-deep-pass 07-funnel-architect 08-copywriter \
     09-asset-classify 10-adversarial-re-review)

# The §5 keys every manifest must carry (must match run-controller.js MANIFEST_KEYS).
KEYS='["id","reads","writes","scripts","prompt","agents","validator","gate"]'

# ==========================================================================
# MANIFEST-01 — all 11 manifests exist, parse as JSON objects, carry §5 keys
#               of the right type (reads[] array, writes[] array, gate boolean).
# ==========================================================================
echo "── MANIFEST-01: 11 manifests exist + parse + §5 shape ──"
COUNT=0
for id in "${IDS[@]}"; do
  f="${MAN_DIR}/${id}.json"
  if [ ! -f "$f" ]; then
    bad "MANIFEST-01: ${id}.json missing"
    continue
  fi
  COUNT=$((COUNT+1))
  MF="$f" KEYS="$KEYS" node -e '
    let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
    const fs=require("fs"); const f=process.env.MF;
    let m=null; try{ m=JSON.parse(fs.readFileSync(f,"utf8")); }catch(e){ bad(f+": not valid JSON ("+e.message+")"); process.exit(1); }
    if(m===null||typeof m!=="object"||Array.isArray(m)){ bad(f+": not a JSON object"); process.exit(1); }
    const keys=JSON.parse(process.env.KEYS);
    keys.every(k=>k in m) ? ok(f+": has all §5 keys") : bad(f+": missing §5 key(s): "+keys.filter(k=>!(k in m)).join(","));
    Array.isArray(m.reads)  ? ok(f+": reads[] is array")  : bad(f+": reads is not an array");
    Array.isArray(m.writes) ? ok(f+": writes[] is array") : bad(f+": writes is not an array");
    (typeof m.gate==="boolean") ? ok(f+": gate is boolean") : bad(f+": gate is not boolean");
    process.exit(fail);
  ' || FAIL=1
done
[ "$COUNT" -eq 11 ] && ok "MANIFEST-01: exactly 11 manifests present" || bad "MANIFEST-01: expected 11 manifests, found ${COUNT}"

# id field must equal the filename stem (the controller loads by <id>.json).
echo "── MANIFEST-01b: id field == filename stem ──"
for id in "${IDS[@]}"; do
  f="${MAN_DIR}/${id}.json"
  [ -f "$f" ] || continue
  MF="$f" STEM="$id" node -e '
    const fs=require("fs"); const m=JSON.parse(fs.readFileSync(process.env.MF,"utf8"));
    (m.id===process.env.STEM)?console.log("   PASS: id matches stem "+process.env.STEM):(console.log("   FAIL: id "+m.id+" != stem "+process.env.STEM),process.exit(1));
  ' || FAIL=1
done

# ==========================================================================
# MANIFEST-01c — controller-CONTRACT value checks (the loose type checks in MANIFEST-01
# are not enough; these enforce the exact runtime properties run-controller.js relies on,
# so a future manifest edit can't go green-but-broken):
#   - writes[0] is a CONCRETE FILE (not a dir / not "") — mockEmit writes to writes[0]
#     (run-controller.js L195-208); a "<dir>/" writes[0] is an EISDIR crash at run time.
#   - NO reads[] entry is a directory ("<x>/") — preflight (L134-153) refuses a non-regular
#     -file input with exit 3; a dir-read would named-refuse during `run all`.
#   - agents is a POSITIVE INTEGER — agentCount (L216-228) refuses 0 / negatives / strings /
#     floats; "1" or 0 would mis-size or vacuously-pass the spawn waves.
#   - prompt is a NON-EMPTY STRING — the §5 prompt slot must name a (stub) prompt file.
# ==========================================================================
echo "── MANIFEST-01c: writes[0] is a file · no dir in reads · agents int · prompt str ──"
for id in "${IDS[@]}"; do
  f="${MAN_DIR}/${id}.json"
  [ -f "$f" ] || continue
  MF="$f" node -e '
    const fs=require("fs"); const m=JSON.parse(fs.readFileSync(process.env.MF,"utf8"));
    let fail=0; const ok=s=>console.log("   PASS: "+m.id+" "+s); const bad=s=>{console.log("   FAIL: "+m.id+" "+s);fail=1;};
    const w0=(m.writes||[])[0];
    (typeof w0==="string" && w0!=="" && !w0.endsWith("/")) ? ok("writes[0] is a concrete file ("+w0+")") : bad("writes[0] is missing/empty/a directory ("+w0+")");
    const dirReads=(m.reads||[]).filter(r=>typeof r!=="string" || r.endsWith("/"));
    dirReads.length===0 ? ok("no directory in reads[]") : bad("directory/non-string in reads[]: "+dirReads.join(","));
    (Number.isInteger(m.agents) && m.agents>0) ? ok("agents is a positive integer ("+m.agents+")") : bad("agents not a positive integer ("+JSON.stringify(m.agents)+")");
    (typeof m.prompt==="string" && m.prompt!=="") ? ok("prompt is a non-empty string") : bad("prompt not a non-empty string ("+JSON.stringify(m.prompt)+")");
    process.exit(fail);
  ' || FAIL=1
done

# ==========================================================================
# MANIFEST-03 — the gate:true set is EXACTLY {0,1,5,7,8,10}; all others false.
# ==========================================================================
echo "── MANIFEST-03: gate:true set == {0,1,5,7,8,10} ──"
node -e '
  const fs=require("fs"),path=require("path");
  const dir="engine/manifests";
  const expectTrue=new Set(["00-bet-compiler","01-collect","05-market-selection","07-funnel-architect","08-copywriter","10-adversarial-re-review"]);
  let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
  const ids=["00-bet-compiler","01-collect","02-funnel-analysis","03-space-map","04-voc-market-pass","05-market-selection","06-voc-deep-pass","07-funnel-architect","08-copywriter","09-asset-classify","10-adversarial-re-review"];
  for(const id of ids){
    const f=path.join(dir,id+".json");
    if(!fs.existsSync(f)){ bad("MANIFEST-03: "+id+" missing"); continue; }
    const m=JSON.parse(fs.readFileSync(f,"utf8"));
    const want=expectTrue.has(id);
    (m.gate===want)?ok("MANIFEST-03: "+id+" gate="+m.gate):bad("MANIFEST-03: "+id+" gate="+m.gate+" want="+want);
  }
  process.exit(fail);
' || FAIL=1

# ==========================================================================
# MANIFEST-04 — pre/post scripts is an object with pre[]/post[] arrays (the §5 shape
#               the controller reads via planPrint). Loose check (existence of named
#               bricks is wired-but-dormant in Phase 3; binding is Phase 5/6).
# ==========================================================================
echo "── MANIFEST-04: scripts.{pre,post} are arrays ──"
for id in "${IDS[@]}"; do
  f="${MAN_DIR}/${id}.json"
  [ -f "$f" ] || continue
  MF="$f" node -e '
    const fs=require("fs"); const m=JSON.parse(fs.readFileSync(process.env.MF,"utf8"));
    const s=m.scripts;
    (s && typeof s==="object" && Array.isArray(s.pre) && Array.isArray(s.post))
      ? console.log("   PASS: "+m.id+" scripts.pre/post arrays")
      : (console.log("   FAIL: "+m.id+" scripts.pre/post not arrays"),process.exit(1));
  ' || FAIL=1
done

# ==========================================================================
# WIRE-01 — step0.writes includes asset-classify/CLAIM-LIST.json AND
#           step9.reads includes it.
# ==========================================================================
echo "── WIRE-01: CLAIM-LIST producer(0) -> consumer(9) ──"
node -e '
  const fs=require("fs");
  const w0=JSON.parse(fs.readFileSync("engine/manifests/00-bet-compiler.json","utf8")).writes;
  const r9=JSON.parse(fs.readFileSync("engine/manifests/09-asset-classify.json","utf8")).reads;
  const slot="runs/{space}/asset-classify/CLAIM-LIST.json";
  let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
  w0.includes(slot)?ok("WIRE-01: step0 writes CLAIM-LIST"):bad("WIRE-01: step0 does NOT write "+slot);
  r9.includes(slot)?ok("WIRE-01: step9 reads CLAIM-LIST"):bad("WIRE-01: step9 does NOT read "+slot);
  process.exit(fail);
' || FAIL=1

# ==========================================================================
# WIRE-02 — step7.reads includes BOTH bet-brief.md AND product-intake.md.
# ==========================================================================
echo "── WIRE-02: architect reads bet-brief AND product-intake ──"
node -e '
  const fs=require("fs");
  const r7=JSON.parse(fs.readFileSync("engine/manifests/07-funnel-architect.json","utf8")).reads;
  let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
  r7.includes("runs/{space}/bet-brief.md")?ok("WIRE-02: step7 reads bet-brief.md"):bad("WIRE-02: step7 missing bet-brief.md");
  r7.includes("runs/{space}/product-intake.md")?ok("WIRE-02: step7 reads product-intake.md"):bad("WIRE-02: step7 missing product-intake.md");
  process.exit(fail);
' || FAIL=1

# ==========================================================================
# MANIFEST-02 — GRAPH INTEGRITY: zero orphan writes, zero dangling reads across
#               the 11 manifests. Load all manifests, build the produced-set (union
#               of writes) and consumed-set (union of reads); diff against two small,
#               justified allowlists:
#   PIPELINE-ENTRY (a read with no upstream producer — documented entry input)
#   TERMINAL       (a write consumed by nobody — a terminal/operator-facing deliverable)
# A directory write (path ends with "/") is satisfied if any read OR write references a
# path UNDER it (the file-grained representative of a fan-out dir).
# ==========================================================================
echo "── MANIFEST-02: graph integrity (orphans=0, dangling=0) ──"
node -e '
  const fs=require("fs"),path=require("path");
  const dir="engine/manifests";
  const ids=["00-bet-compiler","01-collect","02-funnel-analysis","03-space-map","04-voc-market-pass","05-market-selection","06-voc-deep-pass","07-funnel-architect","08-copywriter","09-asset-classify","10-adversarial-re-review"];
  let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
  const norm=p=>p.replace("{space}","SPACE");
  const reads=new Set(), writes=new Set();
  for(const id of ids){
    const f=path.join(dir,id+".json");
    if(!fs.existsSync(f)){ bad("MANIFEST-02: "+id+" missing — cannot compute graph"); process.exit(1); }
    const m=JSON.parse(fs.readFileSync(f,"utf8"));
    (m.reads||[]).forEach(r=>reads.add(norm(r)));
    (m.writes||[]).forEach(w=>writes.add(norm(w)));
  }
  // No upstream producer is needed for these documented pipeline-entry inputs.
  // (Step 0 has empty reads; operator-asset bytes are NOT a declared slot — script-assembled.)
  const PIPELINE_ENTRY=new Set([]);
  // Consumed by nobody, but a legitimate terminal / operator-facing deliverable.
  const TERMINAL=new Set([
    "runs/SPACE/queries_run.json",      // Step 1 auditable query trail (operator-facing)
    "runs/SPACE/dumps/",                // Step 1 verbatim custody store (terminal corpus)
    "runs/SPACE/audit-verdicts.json",   // Step 7 auditor verdicts surfaced at the ★ review gate
    "runs/SPACE/review/_review.json",   // Step 10 = final pipeline deliverable
    "runs/SPACE/review/"                // Step 10 deliverable dir (terminal by definition)
  ]);
  // helper: is a directory-slot (ends "/") satisfied by a file under it?
  const coveredByChild=(d,set)=>[...set].some(p=>p!==d && p.startsWith(d));

  // DANGLING READS — a read with no producer (and not a pipeline-entry input).
  let dangling=0;
  for(const r of reads){
    if(writes.has(r)) continue;
    if(PIPELINE_ENTRY.has(r)) continue;
    bad("MANIFEST-02 DANGLING read (no producer): "+r); dangling++;
  }
  dangling===0?ok("MANIFEST-02: zero dangling reads"):bad("MANIFEST-02: "+dangling+" dangling read(s)");

  // ORPHAN WRITES — a write consumed by nobody (and not terminal, and not a dir whose
  // file-grained child is actually READ downstream). NB: a dir is satisfied ONLY by a
  // child in the READS set (real consumption) — NOT by a child that is merely another
  // write (that would excuse a dir nothing ever reads). A dir-write whose rep file is
  // itself unread must be listed in TERMINAL to pass.
  let orphan=0;
  for(const w of writes){
    if(reads.has(w)) continue;                                // consumed directly
    if(TERMINAL.has(w)) continue;                             // declared terminal deliverable
    if(w.endsWith("/") && coveredByChild(w,reads)) continue;  // dir consumed via a file under it that is READ
    bad("MANIFEST-02 ORPHAN write (no consumer): "+w); orphan++;
  }
  orphan===0?ok("MANIFEST-02: zero orphan writes"):bad("MANIFEST-02: "+orphan+" orphan write(s)");
  process.exit(fail);
' || FAIL=1

# ==========================================================================
# CONTROLLER-LOAD — the existing run-controller.js loads every real manifest via its
# --print-manifest debug path (proves loadManifest accepts the §5 shape with NO
# controller change). Default manifest dir is engine/manifests, so no --manifest-dir flag.
# (A full `run all` is deferred to Phase 6 — it needs Phase-4 stubs + Phase-5 validators.)
# ==========================================================================
echo "── CONTROLLER-LOAD: run-controller loads all 11 (default dir engine/manifests) ──"
if [ ! -f "$CTRL" ]; then
  bad "CONTROLLER-LOAD: controller missing (${CTRL})"
else
  for id in "${IDS[@]}"; do
    OUT=$(node "$CTRL" --print-manifest="$id" 2>&1); ST=$?
    if [ "$ST" -ne 0 ]; then
      bad "CONTROLLER-LOAD: ${id} failed to load (exit ${ST}): ${OUT}"
    else
      PM_OUT="$OUT" node -e '
        let m=null; try{ m=JSON.parse(process.env.PM_OUT); }catch(e){}
        (m && m.id) ? console.log("   PASS: controller loaded "+m.id) : (console.log("   FAIL: controller print-manifest not parseable"),process.exit(1));
      ' || FAIL=1
    fi
  done
fi

# ==========================================================================
# PIPELINE-WALK — pipeline.yaml lists exactly the 11 real manifest ids in R1 order,
# so `run all` walks the real set (CTRL-10 / wiring requirement #5).
# ==========================================================================
echo "── PIPELINE-WALK: pipeline.yaml == 11 ids in R1 order ──"
node -e '
  const fs=require("fs");
  const want=["00-bet-compiler","01-collect","02-funnel-analysis","03-space-map","04-voc-market-pass","05-market-selection","06-voc-deep-pass","07-funnel-architect","08-copywriter","09-asset-classify","10-adversarial-re-review"];
  const got=fs.readFileSync("pipeline.yaml","utf8").split("\n").map(l=>l.trim()).filter(l=>l.startsWith("- ")).map(l=>l.slice(2).trim());
  let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
  (got.length===want.length && got.every((g,i)=>g===want[i]))
    ? ok("PIPELINE-WALK: pipeline.yaml matches the 11 R1 ids in order")
    : bad("PIPELINE-WALK: pipeline.yaml mismatch — got ["+got.join(",")+"]");
  // each pipeline id must have a manifest file on disk
  for(const id of got){ fs.existsSync("engine/manifests/"+id+".json")?ok("PIPELINE-WALK: manifest exists for "+id):bad("PIPELINE-WALK: no manifest for pipeline id "+id); }
  process.exit(fail);
' || FAIL=1

# ==========================================================================
echo ""
if [ "$FAIL" -eq 0 ]; then
  echo "ALL ASSERTS PASS"
  exit 0
else
  echo "MANIFEST-SMOKE FAILED — see named FAIL line(s) above"
  exit 1
fi
