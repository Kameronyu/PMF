#!/usr/bin/env bash
# h6-asset-fetch.sh — HARDENING H6: smoke asset-fetch LOCAL mode (engine/bricks/asset-fetch.js).
# The REMOTE download path is Bucket C (deferred R7); this proves the offline --local path:
# read a flat dir of images+videos -> copy to <out>/raw/<id>.<ext>, downscale images to
# <out>/work/<id>.jpg, probe each image via .venv/bin/python asset/probe.py, write raw-manifest.json.
# Input is GENERATED deterministically via PIL inside the smoke (no committed binary blobs;
# fully reproducible). Output -> transient dir, removed at end.
# Exit 0 = manifest coherent (image technical non-null, video skipped); non-zero names the gap.
set -u
cd "$(dirname "$0")/../.." || exit 1

T="runs/_fixture-assetfetch"
SRC="${T}/src"
OUT="${T}/out"
FAIL=0

rm -rf "$T"; mkdir -p "$SRC"

# Generate 3 images at sizes that exercise all three min_safe_use buckets (>=3000 hero,
# >=1500 section, else thumb) + a placeholder video (local mode copies videos un-probed).
.venv/bin/python - "$SRC" <<'PY'
import sys, os
from PIL import Image
src = sys.argv[1]
Image.new("RGB", (3200, 2000), (200, 50, 50)).save(os.path.join(src, "large.jpg"), "JPEG", quality=90)
Image.new("RGB", (1600, 1000), (50, 200, 50)).save(os.path.join(src, "medium.png"), "PNG")
Image.new("RGB", (800, 600), (50, 50, 200)).save(os.path.join(src, "small.png"), "PNG")
open(os.path.join(src, "clip.mp4"), "wb").write(b"\x00\x00\x00\x18ftypmp42placeholder-not-decoded-in-local-mode")
print("generated:", sorted(os.listdir(src)))
PY

echo "── H6.asset-fetch (local): node asset-fetch.js --local=${SRC} --product=fixture --out=${OUT} ──"
node engine/bricks/asset-fetch.js --local="$SRC" --product=fixture --out="$OUT" >/dev/null 2>&1
rc=$?
if [ "$rc" -ne 0 ] && [ "$rc" -ne 0 ]; then :; fi   # asset-fetch exits 0 on any success
if [ ! -s "${OUT}/raw-manifest.json" ]; then echo "   FAIL: no raw-manifest.json (rc=$rc)"; echo "H6 asset-fetch: FAILED"; rm -rf "$T"; exit 1; fi

node -e '
const fs=require("fs"), path=require("path");
const OUT="'"$OUT"'";
const m=JSON.parse(fs.readFileSync(path.join(OUT,"raw-manifest.json"),"utf8"));
let f=0; const ok=x=>console.log("   PASS: "+x); const bad=x=>{console.log("   FAIL: "+x);f=1;};
Array.isArray(m) ? ok("manifest is an array") : bad("manifest not an array");
m.length===4 ? ok("4 records (3 image + 1 video)") : bad("record count "+m.length);
const imgs=m.filter(r=>r.kind==="image"), vids=m.filter(r=>r.kind==="video");
(imgs.length===3&&vids.length===1) ? ok("3 image + 1 video kinds") : bad("kinds: img="+imgs.length+" vid="+vids.length);
// image technical non-null
const techOk=imgs.every(r=>r.technical&&r.technical.w>0&&r.technical.h>0&&r.technical.bytes>0&&/^[0-9a-f]+$/.test(r.technical.phash||"")&&["thumb","section","hero"].includes(r.technical.min_safe_use));
techOk ? ok("every image has technical{w,h,bytes,phash(hex),min_safe_use}") : bad("an image has null/invalid technical");
// all three buckets exercised
const buckets=imgs.map(r=>r.technical.min_safe_use).sort().join(",");
buckets==="hero,section,thumb" ? ok("min_safe_use buckets = {hero,section,thumb}") : bad("buckets: "+buckets);
// video skipped: no technical, no work_path
const v=vids[0];
(!v.technical && !(v.source&&v.source.work_path)) ? ok("video record has no technical / no work copy (un-probed in local mode)") : bad("video unexpectedly probed");
// work copies: one jpg per image, none for video
const work=fs.existsSync(path.join(OUT,"work"))?fs.readdirSync(path.join(OUT,"work")):[];
work.length===3 && work.every(w=>w.endsWith(".jpg")) ? ok("work/ has 3 downscaled jpgs (images only)") : bad("work dir: "+JSON.stringify(work));
process.exit(f);
' || FAIL=1

echo ""
rm -rf "$T"
if [ "$FAIL" -eq 0 ]; then echo "H6 asset-fetch: LOCAL MODE PASS ✓ (transient ${T} cleaned)"; exit 0;
else echo "H6 asset-fetch: FAILED — see above"; exit 1; fi
