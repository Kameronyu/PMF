#!/usr/bin/env bash
# h6-video-assemble.sh — HARDENING H6: smoke product-video-assemble (engine/bricks/asset/video-assemble.py).
# Generates a tiny source clip + EDL in-smoke (no committed binary), runs the brick (which uses the
# BUNDLED imageio-ffmpeg static binary — no system ffmpeg on this box), and asserts it writes a
# non-empty mp4 + emits the expected JSON summary. Output -> transient dir, removed at end.
# Exit 0 = cut produced + summary coherent; non-zero names the failure.
set -u
cd "$(dirname "$0")/../.." || exit 1

T="engine/_fixture-video"
RAW="${T}/raw"
OUTMP4="${T}/cuts/hero.mp4"
EDL="${T}/hero-edl.json"
FAIL=0

rm -rf "$T"; mkdir -p "$RAW" "${T}/cuts"

# Resolve the bundled ffmpeg (same one the brick uses) and synthesize a 2s SDR source clip.
FF=$(.venv/bin/python -c "import imageio_ffmpeg; print(imageio_ffmpeg.get_ffmpeg_exe())")
"$FF" -y -hide_banner -loglevel error -f lavfi -i "color=c=blue:s=320x240:r=30" -t 2 \
  -pix_fmt yuv420p -c:v libx264 -preset ultrafast "${RAW}/clip.mp4"
if [ ! -s "${RAW}/clip.mp4" ]; then echo "   FAIL: could not synthesize source clip"; rm -rf "$T"; exit 1; fi

# EDL: one 1s segment from clip.mp4, small target frame for speed.
cat > "$EDL" <<'JSON'
{ "target": { "w": 160, "h": 120, "fps": 15 }, "segments": [ { "id": "clip", "in": 0, "out": 1 } ] }
JSON

echo "── H6.video-assemble: .venv/bin/python video-assemble.py --edl ... --raw-dir ${RAW} --out ${OUTMP4} ──"
SUMMARY=$(.venv/bin/python engine/bricks/asset/video-assemble.py --edl "$EDL" --raw-dir "$RAW" --out "$OUTMP4" 2>/dev/null)
rc=$?
if [ "$rc" -ne 0 ]; then echo "   FAIL: brick exited ${rc}"; echo "H6 video-assemble: FAILED"; rm -rf "$T"; exit 1; fi

if [ -s "$OUTMP4" ]; then echo "   PASS: cut written, $(wc -c < "$OUTMP4") bytes (> 0)"; else echo "   FAIL: no/empty output mp4"; FAIL=1; fi

echo "$SUMMARY" | node -e '
let d="";process.stdin.on("data",c=>d+=c).on("end",()=>{
  let f=0; const ok=m=>console.log("   PASS: "+m); const bad=m=>{console.log("   FAIL: "+m);f=1;};
  let j; try{j=JSON.parse(d.trim());}catch(e){console.log("   FAIL: summary not JSON: "+d.slice(0,80));process.exit(1);}
  (j.segments===1) ? ok("summary segments=1") : bad("segments="+j.segments);
  (j.w===160&&j.h===120&&j.fps===15) ? ok("summary target w/h/fps = 160/120/15") : bad("target wrong: "+JSON.stringify([j.w,j.h,j.fps]));
  (typeof j.duration_s==="number"&&j.duration_s>0&&j.duration_s<=1.5) ? ok("duration_s ~1s ("+j.duration_s+")") : bad("duration_s="+j.duration_s);
  (j.audio===false&&j.captions===false) ? ok("silent + no captions (as designed)") : bad("audio/captions flags wrong");
  (typeof j.bytes==="number"&&j.bytes>0) ? ok("summary bytes>0") : bad("bytes="+j.bytes);
  process.exit(f);
});' || FAIL=1

echo ""
rm -rf "$T"
if [ "$FAIL" -eq 0 ]; then echo "H6 video-assemble: PASS ✓ (transient ${T} cleaned)"; exit 0;
else echo "H6 video-assemble: FAILED — see above"; exit 1; fi
