#!/usr/bin/env bash
# stub-smoke.sh — STUB-SMOKE: the Phase-4 prompt-stub + mock-emit acceptance harness.
# Asserts STUB-01..04 + WIRE-03 against the 11 prompt stubs (prompts/<id>.md) and the
# run-controller STUB-mode emit (engine/bricks/run-controller.js). Copies the proven
# store-smoke/controller-smoke idiom: set -u, cd-to-repo-root, ok/bad helpers, inline
# `node -e` JSON asserts, self-cleaning temp space (runs/_vfy*), named-exit. No test
# framework — bash smoke is the project idiom.
#
# What it proves:
#   STUB-01  one stub prompt exists per step at the manifest-declared prompt: path, on the
#            bet-compiler envelope (frontmatter reads/writes + ROLE + INPUTS + OUTPUT CONTRACT
#            + COMPLETENESS + HOW-IT'S-CONSUMED + BODY).
#   STUB-02  each stub's frontmatter reads/writes match its step manifest.
#   STUB-03  running each step in STUB mode emits EVERY manifest writes[] at the correct path,
#            each emitted .json is valid JSON with the expected top-level shape, each .md is
#            non-empty contract-shaped markdown.
#   STUB-04  the envelope carries the soundness-triad-shaped sections (shape now; content deferred).
#   WIRE-03  Step 2 emits raw per-funnel angle/claim/transformation; Step 3 canonicalizes them
#            (canonical raw_variants trace to Step-2 raw labels; ≥2 raw collapse into 1 canonical).
#   + emits are DETERMINISTIC (run a step twice → byte-identical output).
#
# Run:
#   bash engine/contracts/stub-smoke.sh [--space=_vfy]
# Exit 0 = all asserts pass; non-zero = the named assert above failed.
set -u
cd "$(dirname "$0")/../.." || exit 1   # engine/contracts/ -> repo root

# --- arg parse: --space=<s> (default _vfy scratch) ------------------------
SPACE="_vfy"
for a in "$@"; do
  case "$a" in
    --space=*) SPACE="${a#--space=}" ;;
  esac
done

FAIL=0
ok()  { echo "   PASS: $1"; }
bad() { echo "   FAIL: $1"; FAIL=1; }

CTRL="engine/bricks/run-controller.js"
MAN_DIR="engine/manifests"
STEPS="00-bet-compiler 01-collect 02-funnel-analysis 03-space-map 04-voc-market-pass \
05-market-selection 06-voc-deep-pass 07-funnel-architect 08-copywriter 09-asset-classify \
10-adversarial-re-review"

# Clean START + scaffold the temp space (gitignore does NOT auto-ignore runs/_vfy).
rm -rf runs/_vfy*
node engine/bricks/store-scaffold.js --space="${SPACE}" >/dev/null 2>&1 \
  || bad "store-scaffold crashed (space=${SPACE})"

# ==========================================================================
# STUB-01 — one stub prompt exists per step at the manifest prompt: path,
#           on the bet-compiler envelope.
# ==========================================================================
echo "── STUB-01: 11 stub prompts exist on the envelope ──"
for id in $STEPS; do
  p=$(node -e "process.stdout.write(require('./${MAN_DIR}/${id}.json').prompt||'')")
  if [ -z "$p" ]; then bad "STUB-01 ${id}: manifest declares no prompt: slot"; continue; fi
  if [ ! -f "$p" ]; then bad "STUB-01 ${id}: stub prompt missing at ${p}"; continue; fi
  # Envelope sections (STUB-04 shape): frontmatter status: STUB + the named contract sections.
  miss=""
  for sec in "status: STUB" "# ROLE" "# INPUTS" "# OUTPUT CONTRACT" "# COMPLETENESS" "# HOW IT'S CONSUMED" "# BODY"; do
    grep -qF "$sec" "$p" || miss="${miss} [${sec}]"
  done
  if [ -n "$miss" ]; then bad "STUB-01/04 ${id}: ${p} missing envelope section(s):${miss}"; else ok "STUB-01 ${id} -> ${p} (envelope complete)"; fi
done

# ==========================================================================
# STUB-02 — each stub's frontmatter reads/writes match its step manifest.
# ==========================================================================
echo "── STUB-02: stub frontmatter reads/writes match the manifest ──"
for id in $STEPS; do
  node -e '
    const fs=require("fs");
    const id=process.argv[1], manDir=process.argv[2];
    const m=require("./"+manDir+"/"+id+".json");
    const p=m.prompt;
    const src=fs.readFileSync(p,"utf8");
    const fm=src.match(/^---\n([\s\S]*?)\n---/);
    if(!fm){console.error("no frontmatter");process.exit(1);}
    function arr(key){
      const line=fm[1].split("\n").find(l=>l.trim().startsWith(key+":"));
      if(!line)return null;
      const inside=line.slice(line.indexOf("[")+1, line.lastIndexOf("]"));
      return inside.split(",").map(s=>s.trim()).filter(Boolean);
    }
    // manifest reads/writes -> basenames (strip runs/{space}/ prefix, keep trailing / for dirs)
    function base(x){ return x.replace("runs/{space}/",""); }
    const manReads=(m.reads||[]).map(base);
    const manWrites=(m.writes||[]).map(base);
    const fmReads=arr("reads")||[];
    const fmWrites=arr("writes")||[];
    // Compare as SETS of basenames (frontmatter uses the same runs/{space}/-stripped names).
    const norm=a=>JSON.stringify([...a].sort());
    if(norm(manReads)!==norm(fmReads)){console.error("reads mismatch: manifest="+norm(manReads)+" stub="+norm(fmReads));process.exit(1);}
    if(norm(manWrites)!==norm(fmWrites)){console.error("writes mismatch: manifest="+norm(manWrites)+" stub="+norm(fmWrites));process.exit(1);}
    process.exit(0);
  ' "$id" "$MAN_DIR" 2>/tmp/stub-fm-$$.err \
    && ok "STUB-02 ${id} reads/writes match" \
    || bad "STUB-02 ${id}: $(cat /tmp/stub-fm-$$.err)"
done
rm -f /tmp/stub-fm-$$.err

# ==========================================================================
# STUB-03 — STUB mode emits EVERY writes[] at the correct path; .json valid +
#           shaped; .md non-empty. Driven through the controller (one step at a
#           time, in pipeline order so each step's reads[] exist).
# ==========================================================================
echo "── STUB-03: STUB mode emits every writes[] (contract-shaped) ──"
for id in $STEPS; do
  out=$(node "$CTRL" "$id" --space="${SPACE}" --smoke 2>&1); rc=$?
  if [ "$rc" -ne 0 ]; then bad "STUB-03 ${id}: controller exit ${rc} -- $(echo "$out"|grep -E 'REJECT|REFUSE|ESCALATE|FATAL'|head -1)"; continue; fi
  # Every manifest writes[] entry must now exist at its scaffolded slot path.
  node -e '
    const fs=require("fs"),path=require("path");
    const id=process.argv[1], manDir=process.argv[2], space=process.argv[3];
    const m=require("./"+manDir+"/"+id+".json");
    let bad=[];
    for(const w of (m.writes||[])){
      const p=w.replace("{space}",space);
      if(p.endsWith("/")){ if(!fs.existsSync(p)||!fs.statSync(p).isDirectory()) bad.push("dir "+p+" missing"); continue; }
      if(!fs.existsSync(p)){ bad.push("file "+p+" missing"); continue; }
      const body=fs.readFileSync(p,"utf8");
      if(body.trim()===""){ bad.push(p+" empty"); continue; }
      if(p.endsWith(".json")){ try{ const o=JSON.parse(body); if(o===null||typeof o!=="object"){bad.push(p+" not a JSON object/array");} }catch(e){ bad.push(p+" invalid JSON"); } }
      else if(p.endsWith(".md")){ if(!/^#/m.test(body)) bad.push(p+" markdown has no heading"); }
    }
    if(bad.length){console.error(bad.join("; "));process.exit(1);}
    process.exit(0);
  ' "$id" "$MAN_DIR" "$SPACE" 2>/tmp/stub-emit-$$.err \
    && ok "STUB-03 ${id} emitted all writes[] (shaped)" \
    || bad "STUB-03 ${id}: $(cat /tmp/stub-emit-$$.err)"
done
rm -f /tmp/stub-emit-$$.err

# ==========================================================================
# WIRE-03 — two-tier classification: Step 2 raw per-funnel labels; Step 3
#           canonical labels whose raw_variants trace to the Step-2 raw labels.
# ==========================================================================
echo "── WIRE-03: two-tier raw (Step 2) -> canonical (Step 3) ──"
node -e '
  const space=process.argv[1];
  const t=require("./runs/"+space+"/funnels/_tally.json");
  const s=require("./runs/"+space+"/space-map.json");
  let bad=[];
  // Step 2 raw tier: every funnel carries RAW transformation + angle + claims.
  if(!Array.isArray(t.funnels)||t.funnels.length===0) bad.push("Step2 _tally.funnels empty");
  const rawT=new Set(), rawA=new Set();
  for(const f of (t.funnels||[])){
    if(!f.transformation) bad.push("Step2 funnel "+(f.funnel_id||"?")+" missing raw transformation");
    if(!f.angle) bad.push("Step2 funnel "+(f.funnel_id||"?")+" missing raw angle");
    if(!Array.isArray(f.claims)) bad.push("Step2 funnel "+(f.funnel_id||"?")+" missing raw claims[]");
    if(f.transformation) rawT.add(f.transformation);
    if(f.angle) rawA.add(f.angle);
  }
  // Step 3 canonical tier: transformations/angles carry canonical + raw_variants tracing to Step 2.
  const tr=s.transformations||[]; const an=s.angles||[];
  if(tr.length===0) bad.push("Step3 transformations empty");
  for(const x of tr){
    const v=x.raw_claim_variants||x.raw_variants||[];
    if(!x.canonical) bad.push("Step3 transformation missing canonical");
    if(!Array.isArray(v)||v.length===0) bad.push("Step3 transformation "+(x.canonical||"?")+" has no raw_variants");
    for(const rv of v){ if(!rawT.has(rv)) bad.push("Step3 raw_variant \""+rv+"\" does not trace to a Step-2 raw transformation"); }
  }
  for(const x of an){
    const v=x.raw_variants||[];
    for(const rv of v){ if(!rawA.has(rv)) bad.push("Step3 angle raw_variant \""+rv+"\" does not trace to a Step-2 raw angle"); }
  }
  // The two tiers must VISIBLY differ: >=2 distinct Step-2 raw transformations collapse into fewer canonicals.
  if(!(rawT.size>=2 && tr.length<rawT.size)) bad.push("two tiers do not differ: rawT="+rawT.size+" canonical="+tr.length+" (need >=2 raw collapsing into fewer)");
  if(bad.length){console.error(bad.join("; "));process.exit(1);}
  process.exit(0);
' "$SPACE" 2>/tmp/stub-wire-$$.err \
  && ok "WIRE-03 raw->canonical seam holds (Step2 raw traces; tiers differ)" \
  || bad "WIRE-03: $(cat /tmp/stub-wire-$$.err)"
rm -f /tmp/stub-wire-$$.err

# ==========================================================================
# DETERMINISM — re-running a step's stub emits byte-identical output
#               (idempotency / no-overwrite-v1 safe).
# ==========================================================================
echo "── DETERMINISM: re-run a step -> byte-identical emit ──"
before=$(sha256sum "runs/${SPACE}/space-map.json" | cut -d' ' -f1)
node "$CTRL" 03-space-map --space="${SPACE}" --smoke >/dev/null 2>&1
after=$(sha256sum "runs/${SPACE}/space-map.json" | cut -d' ' -f1)
[ "$before" = "$after" ] && ok "DETERMINISM: re-running 03-space-map left space-map.json byte-identical" \
  || bad "DETERMINISM: re-running 03-space-map changed space-map.json"

# Cross-space byte-identity: a fresh space produces the same space-map bytes (no Date/random).
rm -rf "runs/${SPACE}2"
node engine/bricks/store-scaffold.js --space="${SPACE}2" >/dev/null 2>&1
for st in 00-bet-compiler 01-collect 02-funnel-analysis 03-space-map; do
  node "$CTRL" "$st" --space="${SPACE}2" --smoke >/dev/null 2>&1
done
if diff -q "runs/${SPACE}/space-map.json" "runs/${SPACE}2/space-map.json" >/dev/null 2>&1; then
  ok "DETERMINISM: space-map.json byte-identical across two fresh spaces"
else
  bad "DETERMINISM: space-map.json differs across spaces (non-deterministic emit)"
fi

# ==========================================================================
# Cleanup — side-effect-free on tracked content.
# ==========================================================================
rm -rf runs/_vfy*

echo
if [ "$FAIL" -eq 0 ]; then
  echo "STUB-SMOKE: ALL ASSERTS PASS ✓"
  exit 0
else
  echo "STUB-SMOKE: FAILURES ABOVE ✗"
  exit 1
fi
