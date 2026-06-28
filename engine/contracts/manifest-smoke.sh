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
# MANIFEST-02 — GRAPH INTEGRITY (ORDERED, PRODUCER-ID-BOUND). The earlier version of
# this check was producer-BLIND: it unioned all writes into one flat Set and all reads
# into another, then diffed the two sets. That carried a confirmed false_green_risk —
# three classes of real defect passed GREEN:
#   (1) a WRONG step emitting a path that string-matches a terminal slot was excused
#       (terminals were matched by path, not bound to the one step allowed to emit them);
#   (2) WRITE-WRITE duplication (two steps writing the same path) dedup'd invisibly in
#       the flat Set — a no-overwrite-v1 clobber hazard;
#   (3) the dangling check was ORDER-BLIND — a read satisfied only by a LATER step's
#       write, or a step reading its own output (self-loop), passed.
# This rewrite builds an ORDERED, per-step, producer-id-bound graph instead:
#   producedBy[path] = [stepId,...]  (in pipeline order via numeric id prefix)
#   - DANGLING: every read must have a STRICTLY-EARLIER producer (reject self + backward).
#   - WRITE-WRITE: no path may be written by >1 step.
#   - ORPHAN: every write must be consumed by a STRICTLY-LATER step OR be an allowlisted
#     TERMINAL bound to THE EXACT step that owns it (wrong-producer terminal => FAIL).
#   - PIPELINE-ENTRY reads (no upstream producer) handled by an explicit, bound allowlist.
# A directory write (ends "/") is consumed if a STRICTLY-LATER step reads a path under it.
# ==========================================================================
echo "── MANIFEST-02: ordered producer-bound graph (orphans=0, dangling=0, no write-write, no back/self edges) ──"
node -e '
  const fs=require("fs"),path=require("path");
  const dir="engine/manifests";
  // pipeline order = numeric id prefix order (matches pipeline.yaml / R1 walk).
  const ids=["00-bet-compiler","01-collect","02-funnel-analysis","03-space-map","04-voc-market-pass","05-market-selection","06-voc-deep-pass","07-funnel-architect","08-copywriter","09-asset-classify","10-adversarial-re-review"];
  const pos=Object.fromEntries(ids.map((id,i)=>[id,i]));
  let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
  const norm=p=>p.replace("{space}","SPACE");

  // Per-step reads/writes (ordered), and producedBy[path] = [stepId,...].
  const readsBy={}, writesBy={}, producedBy={};
  for(const id of ids){
    const f=path.join(dir,id+".json");
    if(!fs.existsSync(f)){ bad("MANIFEST-02: "+id+" missing — cannot compute graph"); process.exit(1); }
    const m=JSON.parse(fs.readFileSync(f,"utf8"));
    readsBy[id]=(m.reads||[]).map(norm);
    writesBy[id]=(m.writes||[]).map(norm);
    for(const w of writesBy[id]){ (producedBy[w]=producedBy[w]||[]).push(id); }
  }

  // PIPELINE-ENTRY: a read with NO upstream producer — documented entry input, bound to
  // the EXACT step allowed to read it raw. (Step 0 has empty reads; operator-asset bytes
  // are NOT a declared slot — script-assembled. So the entry allowlist is currently empty.)
  const PIPELINE_ENTRY={};  // path -> Set(stepId) allowed to read it with no producer
  // TERMINAL: a write consumed by nobody — bound to the ONE step allowed to emit it.
  // A terminal emitted by the WRONG step must FAIL (closes hole #1).
  const TERMINAL={
    "runs/SPACE/queries_run.json":    "01-collect",              // Step 1 auditable query trail
    "runs/SPACE/dumps/":              "01-collect",              // Step 1 verbatim custody store
    "runs/SPACE/audit-verdicts.json": "07-funnel-architect",    // Step 7 auditor verdicts (★ review gate)
    "runs/SPACE/review/_review.json": "10-adversarial-re-review", // Step 10 final deliverable
    "runs/SPACE/review/":             "10-adversarial-re-review"  // Step 10 deliverable dir
  };

  // ---- (2) WRITE-WRITE DUPLICATION: no path written by >1 step ----------------------
  let dup=0;
  for(const p of Object.keys(producedBy)){
    if(producedBy[p].length>1){ bad("MANIFEST-02 WRITE-WRITE (path written by multiple steps): "+p+" <- ["+producedBy[p].join(",")+"]"); dup++; }
  }
  dup===0?ok("MANIFEST-02: no write-write duplication"):bad("MANIFEST-02: "+dup+" duplicated write path(s)");

  // helper: earliest producer of a path that is a directory child READ.
  // For a read R, return the set of step positions that produce R, or produce a dir D
  // (ends "/") with R under D. We want a STRICTLY-EARLIER producer.
  const earlierProducerExists=(reader,p)=>{
    const rp=pos[reader];
    // direct file producer
    const direct=(producedBy[p]||[]).map(id=>pos[id]).filter(q=>q<rp);
    if(direct.length) return true;
    // producer of a parent directory slot that this read sits under
    for(const w of Object.keys(producedBy)){
      if(w.endsWith("/") && p!==w && p.startsWith(w)){
        if((producedBy[w]||[]).some(id=>pos[id]<rp)) return true;
      }
    }
    return false;
  };

  // ---- (3) DANGLING / BACK-EDGE / SELF-LOOP READS -----------------------------------
  // Every read must have a STRICTLY-EARLIER producer. A read produced only by the same
  // step (self-loop) or only by a later step (back-edge) is a FAIL.
  let dangling=0;
  for(const id of ids){
    for(const r of readsBy[id]){
      // pipeline-entry: read with no producer at all, bound to this exact step.
      const noProducer=!(r in producedBy) && !Object.keys(producedBy).some(w=>w.endsWith("/")&&r.startsWith(w));
      if(noProducer){
        if(PIPELINE_ENTRY[r] && PIPELINE_ENTRY[r]===id) continue;
        bad("MANIFEST-02 DANGLING read (no producer / not a bound pipeline-entry): "+id+" reads "+r); dangling++; continue;
      }
      if(earlierProducerExists(id,r)) continue;
      // a producer exists but none strictly-earlier => self-loop or back-edge.
      const producers=(producedBy[r]||[]).join(",")||"(dir-parent)";
      bad("MANIFEST-02 BACK/SELF-EDGE read (no strictly-earlier producer): "+id+" reads "+r+" produced-by ["+producers+"]"); dangling++;
    }
  }
  dangling===0?ok("MANIFEST-02: every read has a strictly-earlier producer (no dangling/back/self)"):bad("MANIFEST-02: "+dangling+" bad read edge(s)");

  // helper: is a write consumed by a STRICTLY-LATER step?
  const laterConsumerExists=(writer,w)=>{
    const wp=pos[writer];
    for(const id of ids){
      if(pos[id]<=wp) continue;
      for(const r of readsBy[id]){
        if(r===w) return true;                              // direct file read later
        if(w.endsWith("/") && r!==w && r.startsWith(w)) return true; // child of dir read later
      }
    }
    return false;
  };

  // ---- (1) ORPHAN WRITES (producer-id-bound terminals) ------------------------------
  // A write must be consumed by a strictly-later step, OR be a TERMINAL bound to THIS
  // exact emitting step. A terminal-matching path emitted by the WRONG step => FAIL.
  let orphan=0;
  for(const id of ids){
    for(const w of writesBy[id]){
      if(laterConsumerExists(id,w)) continue;                 // consumed downstream
      if(w in TERMINAL){
        if(TERMINAL[w]===id) continue;                        // correct owner of the terminal
        bad("MANIFEST-02 WRONG-PRODUCER terminal (slot owned by "+TERMINAL[w]+"): "+id+" emits "+w); orphan++; continue;
      }
      bad("MANIFEST-02 ORPHAN write (no later consumer, not a bound terminal): "+id+" writes "+w); orphan++;
    }
  }
  orphan===0?ok("MANIFEST-02: every write consumed downstream or a bound terminal"):bad("MANIFEST-02: "+orphan+" orphan/wrong-producer write(s)");
  process.exit(fail);
' || FAIL=1

# ==========================================================================
# MANIFEST-02b — DIRECTORY-SCAN exactly-11 (F4). MANIFEST-01 iterates the hardcoded IDS
# list, so a rogue/duplicate engine/manifests/99-rogue.json on disk would pass GREEN.
# Scan the directory itself and assert the *.json set == the canonical 11 ids (no more,
# no fewer, no rogues). A rogue or duplicate file must FAIL.
# ==========================================================================
echo "── MANIFEST-02b: directory-scan == exactly the canonical 11 ids ──"
node -e '
  const fs=require("fs");
  const dir="engine/manifests";
  const want=["00-bet-compiler","01-collect","02-funnel-analysis","03-space-map","04-voc-market-pass","05-market-selection","06-voc-deep-pass","07-funnel-architect","08-copywriter","09-asset-classify","10-adversarial-re-review"].sort();
  let fail=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);fail=1;};
  const onDisk=fs.readdirSync(dir).filter(f=>f.endsWith(".json")).map(f=>f.replace(/\.json$/,"")).sort();
  const extra=onDisk.filter(x=>!want.includes(x));
  const missing=want.filter(x=>!onDisk.includes(x));
  (extra.length===0 && missing.length===0 && onDisk.length===want.length)
    ? ok("MANIFEST-02b: on-disk *.json set == canonical 11")
    : bad("MANIFEST-02b: on-disk set != canonical 11 (extra=["+extra.join(",")+"] missing=["+missing.join(",")+"])");
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
