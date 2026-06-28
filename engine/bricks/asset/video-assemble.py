# video-assemble.py — brick: assemble a hero cut from an EDL using the bundled ffmpeg.
# Per segment: tone-maps HDR(HLG/PQ)->SDR when needed, scales+center-crops to FILL the
# target frame (no pillarbox), normalizes fps, concatenates, fades in/out, writes a SILENT
# mp4. NO captions/text (operator adds those downstream).
# Decoder/encoder = bundled imageio-ffmpeg static binary (no system ffmpeg on this box).
#
# Usage:
#   .venv/bin/python tools/asset/video-assemble.py \
#       --edl runs/<space>/asset-classify/hero-edl.json \
#       --raw-dir assets/raw \
#       --out runs/<space>/asset-classify/cuts/<name>.mp4 \
#       [--grade]   # extra mild contrast/saturation bump after tone-map
#
# EDL JSON: { "target": {"w":1920,"h":1080,"fps":30}, "segments":[{"id","in","out"}...] }
# Clips are scaled with force_original_aspect_ratio=increase then center-cropped to W:H,
# so any source orientation FILLS the target frame (cross-orientation clips are center-cropped).

import sys, os, json, subprocess, tempfile, shutil, argparse
from imageio_ffmpeg import get_ffmpeg_exe

FF = get_ffmpeg_exe()


def run(args):
    subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error"] + args, check=True)


def is_hdr(src):
    # Detect HDR transfer/primaries from the input banner (HLG = arib-std-b67, PQ = smpte2084).
    r = subprocess.run([FF, "-hide_banner", "-i", src], capture_output=True, text=True)
    s = r.stderr.lower()
    return ("arib-std-b67" in s) or ("smpte2084" in s) or ("bt2020" in s)


def build_vf(hdr, w, h, fps, grade):
    chain = []
    if hdr:
        # HLG/PQ -> linear light -> Hable tone-map -> bt709 SDR
        chain += [
            "zscale=t=linear:npl=100",
            "tonemap=tonemap=hable:desat=0",
            "zscale=p=bt709:t=bt709:m=bt709:r=tv",
            "format=yuv420p",
        ]
    # cover + center-crop to FILL target (no black bars, any orientation)
    chain += [
        f"scale={w}:{h}:force_original_aspect_ratio=increase",
        f"crop={w}:{h}",
        "setsar=1",
        f"fps={fps}",
    ]
    if grade:
        chain.append("eq=contrast=1.04:saturation=1.06")
    return ",".join(chain)


def assemble(edl_path, raw_dir, out_path, grade):
    edl = json.load(open(edl_path))
    t = edl.get("target", {})
    w, h, fps = int(t.get("w", 1920)), int(t.get("h", 1080)), int(t.get("fps", 30))
    segs = edl["segments"]
    if not segs:
        print("ERROR: EDL has no segments", file=sys.stderr); sys.exit(2)

    os.makedirs(os.path.dirname(out_path) or ".", exist_ok=True)
    tmp = tempfile.mkdtemp(prefix="vasm-")
    try:
        parts, total = [], 0.0
        for i, s in enumerate(segs):
            src = os.path.join(raw_dir, s["id"] + ".mp4")
            if not os.path.exists(src):
                print(f"ERROR: source not found: {src}", file=sys.stderr); sys.exit(2)
            dur = round(float(s["out"]) - float(s["in"]), 3)
            if dur <= 0:
                print(f"ERROR: non-positive duration for {s['id']}", file=sys.stderr); sys.exit(2)
            vf = build_vf(is_hdr(src), w, h, fps, grade)
            seg = os.path.join(tmp, f"seg{i:02d}.mp4")
            run(["-ss", str(s["in"]), "-i", src, "-t", str(dur), "-an", "-vf", vf,
                 "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(fps),
                 "-preset", "medium", "-crf", "18", seg])
            parts.append(seg); total += dur

        listf = os.path.join(tmp, "list.txt")
        with open(listf, "w") as f:
            for p in parts:
                f.write(f"file '{p}'\n")

        total = round(total, 3)
        fade_out_st = max(0.0, round(total - 0.5, 2))
        run(["-f", "concat", "-safe", "0", "-i", listf,
             "-vf", f"fade=t=in:st=0:d=0.4,fade=t=out:st={fade_out_st}:d=0.5",
             "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", "-r", str(fps),
             "-preset", "medium", "-crf", "18", out_path])

        print(json.dumps({"output": out_path, "segments": len(segs),
                          "duration_s": total, "w": w, "h": h, "fps": fps,
                          "bytes": os.path.getsize(out_path), "audio": False, "captions": False}))
    finally:
        shutil.rmtree(tmp, ignore_errors=True)


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--edl", required=True)
    ap.add_argument("--raw-dir", default="assets/raw")
    ap.add_argument("--out", required=True)
    ap.add_argument("--grade", action="store_true")
    a = ap.parse_args()
    assemble(a.edl, a.raw_dir, a.out, a.grade)
