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
#   STUB-03  running each step in STUB mode emits EVERY manifest writes[] at the correct path;
#            each emitted .json is valid JSON carrying its EXPECTED top-level keys (per-step
#            expected-shape map, verified against the live emits), is NON-SEED (not the scaffold
#            {} placeholder), and lands on an actual scaffolded slot; each .md is non-empty
#            contract-shaped markdown. A hollow {}/[]/{_stub:true} emit FAILS by name.
#   STUB-04  the envelope carries the soundness-triad-shaped sections (shape now; content deferred).
#   WIRE-03  Step 2 emits raw per-funnel labels on ALL FIVE axes (transformation, angle, niche,
#            bet_type, mechanism); Step 3 canonicalizes EACH axis (canonical non-empty; every
#            raw_variant traces to a Step-2 raw label on that axis; ≥2 raw collapse into fewer
#            canonical — a cosmetic 1:1 copy or a dropped/empty axis FAILS).
#   + emits are DETERMINISTIC — re-running the FULL pipeline into a second fresh space yields
#     byte-identical output for EVERY emitted artifact (not just space-map.json).
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
SPACE2="${SPACE}2"

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
# Expected top-level shape map (STUB-03 hole #1). For each emitted .json
# basename-or-relpath -> the top-level keys that MUST be present. A hollow
# {}/[]/{_stub:true} for any emit is missing these keys and FAILS by name.
# This map is the lightweight stub-gate shape contract; it is NOT a substitute
# for the Phase-5 per-step field validators (see 04-XVERIFY-FIX.md deferrals).
# Self-checked below: the harness re-derives the live emits' actual top-level
# keys and refuses to run if the map drifts from reality (no stale contract).
# ==========================================================================
EXPECTED_SHAPE_JSON='{
  "bet-brief.md":               "__MD__",
  "product-intake.md":          "__MD__",
  "funnel-brief.md":            "__MD__",
  "asset-classify/CLAIM-LIST.json": ["claims"],
  "brands.json":                ["brands"],
  "queries_run.json":           ["queries"],
  "ad-volume-aggregate.json":   ["rows"],
  "funnels/_tally.json":        ["funnels"],
  "space-map.json":             ["transformations","angles","niches","bet_types","mechanisms_in_play","saturation","combos","per_brand"],
  "voc/market-signal/_index.json": ["cells"],
  "voc/gap_candidates.json":    ["candidates"],
  "market-selection.json":      ["ranked"],
  "ntp-pick.json":              ["pick"],
  "voc-bank/_bank.json":        ["entries"],
  "awareness-read.json":        ["awareness_stage","basis"],
  "audit-verdicts.json":        ["verdicts"],
  "copy/_copy.json":            ["sections"],
  "chief-verdicts.json":        ["verdicts"],
  "asset-records.json":         ["records"],
  "review/_review.json":        ["findings","verdict"]
}'

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
#           carries its EXPECTED top-level keys (#1) + is NON-SEED (#2) + lands
#           on a real scaffolded slot (#5); .md non-empty. Driven through the
#           controller (one step at a time, in pipeline order so reads[] exist).
# ==========================================================================
echo "── STUB-03: STUB mode emits every writes[] (shaped, non-seed, on-slot) ──"

# Self-check the expected-shape map against the LIVE emits FIRST: scaffold a probe
# space, run the whole pipeline, and confirm every mapped .json key set is actually
# a subset of the live emit's top-level keys. If the map drifted (a renamed key, a
# new axis), the harness REFUSES to run — the shape contract can never go stale-green.
rm -rf "runs/${SPACE}_probe"
node engine/bricks/store-scaffold.js --space="${SPACE}_probe" >/dev/null 2>&1
probe_ok=1
for id in $STEPS; do
  node "$CTRL" "$id" --space="${SPACE}_probe" --smoke >/dev/null 2>&1 || probe_ok=0
done
if [ "$probe_ok" -ne 1 ]; then
  bad "STUB-03 self-check: probe pipeline run failed (cannot verify expected-shape map)"
else
  node -e '
    const fs=require("fs"),path=require("path");
    const space=process.argv[1];
    const map=JSON.parse(process.argv[2]);
    let bad=[];
    for(const [rel,want] of Object.entries(map)){
      if(want==="__MD__") continue;
      const p="runs/"+space+"/"+rel;
      if(!fs.existsSync(p)){ bad.push("map references "+rel+" but it was not emitted live"); continue; }
      let o; try{ o=JSON.parse(fs.readFileSync(p,"utf8")); }catch(e){ bad.push(rel+" live emit not JSON"); continue; }
      if(o===null||typeof o!=="object"||Array.isArray(o)){ bad.push(rel+" live emit not a keyed object"); continue; }
      const have=new Set(Object.keys(o));
      for(const k of want){ if(!have.has(k)) bad.push("expected-shape map drift: "+rel+" should carry key \""+k+"\" but live emit does not"); }
    }
    if(bad.length){console.error(bad.join("; "));process.exit(1);}
    process.exit(0);
  ' "${SPACE}_probe" "$EXPECTED_SHAPE_JSON" 2>/tmp/stub-mapchk-$$.err \
    && ok "STUB-03 expected-shape map verified against live emits (no drift)" \
    || bad "STUB-03 expected-shape map self-check: $(cat /tmp/stub-mapchk-$$.err)"
fi
rm -f /tmp/stub-mapchk-$$.err
rm -rf "runs/${SPACE}_probe"

# Authoritative scaffolded-slot list (#5): a freshly-scaffolded space IS the slot
# contract. An emit to a non-scaffolded path (drift/orphan) must FAIL.
SCAFFOLD_FILE_SLOTS=$(cd "runs/${SPACE}" && find . -type f ! -name '_*-log.txt' | sed 's#^\./##' | sort | tr '\n' '|')
SCAFFOLD_DIR_SLOTS=$(cd "runs/${SPACE}" && find . -type d | sed 's#^\./##' | grep -v '^$' | sort | tr '\n' '|')

for id in $STEPS; do
  out=$(node "$CTRL" "$id" --space="${SPACE}" --smoke 2>&1); rc=$?
  if [ "$rc" -ne 0 ]; then bad "STUB-03 ${id}: controller exit ${rc} -- $(echo "$out"|grep -E 'REJECT|REFUSE|ESCALATE|FATAL'|head -1)"; continue; fi
  # Every manifest writes[] entry must now exist, be shaped, be non-seed, and be on a slot.
  node -e '
    const fs=require("fs"),path=require("path");
    const id=process.argv[1], manDir=process.argv[2], space=process.argv[3];
    const map=JSON.parse(process.argv[4]);
    const fileSlots=new Set(process.argv[5].split("|").filter(Boolean));
    const dirSlots=new Set(process.argv[6].split("|").filter(Boolean));
    const m=require("./"+manDir+"/"+id+".json");
    let bad=[];
    for(const w of (m.writes||[])){
      const rel=w.replace("runs/{space}/","");
      const p=w.replace("{space}",space);
      // --- fan-out DIRECTORY slot (trailing /) ---
      if(p.endsWith("/")){
        if(!fs.existsSync(p)||!fs.statSync(p).isDirectory()){ bad.push("dir "+p+" missing"); continue; }
        const dirRel=rel.replace(/\/$/,"");
        if(!dirSlots.has(dirRel)) bad.push("emit dir \""+dirRel+"\" is not a scaffolded slot (drift/orphan)");
        continue;
      }
      // --- FILE slot ---
      if(!fs.existsSync(p)){ bad.push("file "+p+" missing"); continue; }
      // (#5) slot fidelity: an emitted FILE must be a scaffolded file slot, OR live inside a
      // scaffolded directory slot (e.g. copy/_copy.json under the copy/ dir slot). A path that
      // is neither is a drifted/orphan emit and FAILS.
      const parentRel=path.dirname(rel)==="."?"":path.dirname(rel);
      if(!fileSlots.has(rel) && !(parentRel && dirSlots.has(parentRel))){
        bad.push("emit path \""+rel+"\" is not a scaffolded slot (drift/orphan)");
      }
      const body=fs.readFileSync(p,"utf8");
      if(body.trim()===""){ bad.push(p+" empty"); continue; }
      if(p.endsWith(".json")){
        // (#2) non-seed: the scaffold pre-seeds every .json slot with "{}\n". A no-op emit
        // leaves that seed. Reject a body byte-equal to the empty-object seed.
        if(body==="{}\n"||body.trim()==="{}"||body.trim()==="[]"){ bad.push(rel+" is the scaffold {} seed / empty container (emit produced no content)"); continue; }
        let o; try{ o=JSON.parse(body); }catch(e){ bad.push(rel+" invalid JSON"); continue; }
        if(o===null||typeof o!=="object"){ bad.push(rel+" not a JSON object/array"); continue; }
        // (#1) real top-level shape: the emit must carry the expected top-level keys for its
        // slot. A hollow {} / [] / {_stub:true} is missing them and FAILS by name.
        const want=map[rel];
        if(!want){ bad.push(rel+" has no entry in the expected-shape map (unmapped emit)"); continue; }
        if(want==="__MD__"){ bad.push(rel+" mapped as markdown but is .json"); continue; }
        if(Array.isArray(o)){ bad.push(rel+" is a bare array; expected an object carrying keys ["+want.join(",")+"]"); continue; }
        const have=new Set(Object.keys(o));
        const missing=want.filter(k=>!have.has(k));
        if(missing.length) bad.push(rel+" missing expected top-level key(s): ["+missing.join(",")+"] (hollow/mis-shaped emit; have ["+[...have].join(",")+"])");
      } else if(p.endsWith(".md")){
        if(!/^#/m.test(body)) bad.push(rel+" markdown has no heading");
        if(map[rel]!=="__MD__") bad.push(rel+" markdown emit has no __MD__ map entry");
      }
    }
    if(bad.length){console.error(bad.join("; "));process.exit(1);}
    process.exit(0);
  ' "$id" "$MAN_DIR" "$SPACE" "$EXPECTED_SHAPE_JSON" "$SCAFFOLD_FILE_SLOTS" "$SCAFFOLD_DIR_SLOTS" 2>/tmp/stub-emit-$$.err \
    && ok "STUB-03 ${id} emitted all writes[] (shaped, non-seed, on-slot)" \
    || bad "STUB-03 ${id}: $(cat /tmp/stub-emit-$$.err)"
done
rm -f /tmp/stub-emit-$$.err

# ==========================================================================
# WIRE-03 — two-tier classification across ALL FIVE axes: Step 2 raw per-funnel
#           labels; Step 3 canonical labels whose raw_variants trace to the
#           Step-2 raw labels, with a real collapse on each axis.
# ==========================================================================
echo "── WIRE-03: two-tier raw (Step 2) -> canonical (Step 3) on ALL FIVE axes ──"
node -e '
  const space=process.argv[1];
  const t=require("./runs/"+space+"/funnels/_tally.json");
  const s=require("./runs/"+space+"/space-map.json");
  let bad=[];
  // Step 2 raw tier: every funnel carries RAW transformation + angle + niche + bet_type + mechanism + claims.
  if(!Array.isArray(t.funnels)||t.funnels.length===0) bad.push("Step2 _tally.funnels empty");
  const raw={transformation:new Set(),angle:new Set(),niche:new Set(),bet_type:new Set(),mechanism:new Set()};
  for(const f of (t.funnels||[])){
    if(!Array.isArray(f.claims)) bad.push("Step2 funnel "+(f.funnel_id||"?")+" missing raw claims[]");
    for(const k of Object.keys(raw)){
      if(!f[k]) bad.push("Step2 funnel "+(f.funnel_id||"?")+" missing raw "+k);
      else raw[k].add(f[k]);
    }
  }
  // Step 3 canonical tier: EVERY axis canonicalizes. axis -> [space-map field, raw-tier key].
  // transformations use raw_claim_variants; the rest use raw_variants.
  const axes=[["transformations","transformation"],["angles","angle"],["niches","niche"],["bet_types","bet_type"],["mechanisms_in_play","mechanism"]];
  for(const [field,rawKey] of axes){
    const entries=s[field]||[];
    // (a) canonical set non-empty
    if(!Array.isArray(entries)||entries.length===0){ bad.push("Step3 axis "+field+" is empty (dropped axis)"); continue; }
    let canonCount=0;
    for(const x of entries){
      if(!x.canonical){ bad.push("Step3 "+field+" entry missing canonical"); continue; }
      canonCount++;
      const v=x.raw_claim_variants||x.raw_variants||[];
      if(!Array.isArray(v)||v.length===0){ bad.push("Step3 "+field+" \""+(x.canonical||"?")+"\" has no raw_variants"); continue; }
      // (b) every raw_variant traces to a Step-2 raw label on THIS axis
      for(const rv of v){ if(!raw[rawKey].has(rv)) bad.push("Step3 "+field+" raw_variant \""+rv+"\" does not trace to a Step-2 raw "+rawKey); }
    }
    // (c) a REAL collapse: >=2 distinct Step-2 raw labels fold into FEWER canonicals on this axis.
    // Rejects a cosmetic 1:1 raw==canonical copy AND a dropped/empty axis.
    if(!(raw[rawKey].size>=2)) bad.push("Step2 axis "+rawKey+" has <2 distinct raw labels (cannot prove collapse: raw="+raw[rawKey].size+")");
    else if(!(canonCount<raw[rawKey].size)) bad.push("axis "+field+" did not collapse: raw="+raw[rawKey].size+" canonical="+canonCount+" (a 1:1 copy is not canonicalization)");
  }
  if(bad.length){console.error(bad.join("; "));process.exit(1);}
  process.exit(0);
' "$SPACE" 2>/tmp/stub-wire-$$.err \
  && ok "WIRE-03 raw->canonical seam holds on all 5 axes (traces + real collapse, no cosmetic copy / dropped axis)" \
  || bad "WIRE-03: $(cat /tmp/stub-wire-$$.err)"
rm -f /tmp/stub-wire-$$.err

# ==========================================================================
# DETERMINISM — re-running the FULL pipeline into a SECOND fresh space yields
#               byte-identical output for EVERY emitted artifact (#4), not just
#               space-map.json. Any non-byte-identical emit FAILS named.
# ==========================================================================
echo "── DETERMINISM: full pipeline re-run -> EVERY emit byte-identical ──"

# Idempotency: re-running one step in-place leaves its emit byte-identical (no-overwrite-v1 safe).
before=$(sha256sum "runs/${SPACE}/space-map.json" | cut -d' ' -f1)
node "$CTRL" 03-space-map --space="${SPACE}" --smoke >/dev/null 2>&1
after=$(sha256sum "runs/${SPACE}/space-map.json" | cut -d' ' -f1)
[ "$before" = "$after" ] && ok "DETERMINISM: re-running 03-space-map left space-map.json byte-identical" \
  || bad "DETERMINISM: re-running 03-space-map changed space-map.json"

# Cross-space byte-identity over the WHOLE emit set: a second fresh space run top-to-bottom
# must produce byte-identical bytes for every emitted artifact (no Date/random anywhere).
rm -rf "runs/${SPACE2}"
node engine/bricks/store-scaffold.js --space="${SPACE2}" >/dev/null 2>&1
for st in $STEPS; do
  node "$CTRL" "$st" --space="${SPACE2}" --smoke >/dev/null 2>&1
done
# Enumerate every emitted artifact in SPACE (exclude receipts — they carry per-run spawn-ids/
# timestamps by design — and the gitignored sidecar log) and byte-diff each against SPACE2.
det_fail=""
while IFS= read -r f; do
  rel="${f#runs/${SPACE}/}"
  g="runs/${SPACE2}/${rel}"
  if [ ! -f "$g" ]; then det_fail="${det_fail} ${rel}(absent-in-${SPACE2})"; continue; fi
  if ! diff -q "$f" "$g" >/dev/null 2>&1; then det_fail="${det_fail} ${rel}"; fi
done < <(find "runs/${SPACE}" -type f | grep -vE "/_receipts/|_store-scaffold-log\.txt" | sort)
if [ -z "$det_fail" ]; then
  ndiff=$(find "runs/${SPACE}" -type f | grep -vcE "/_receipts/|_store-scaffold-log\.txt")
  ok "DETERMINISM: all ${ndiff} emitted artifacts byte-identical across two fresh full-pipeline runs"
else
  bad "DETERMINISM: non-deterministic emit(s):${det_fail}"
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
