# frame-grab.py — brick: pull full-res stills from product videos for use as LP images.
# Per frame: seek to timestamp, tone-map HDR(HLG/PQ)->SDR if needed, center-crop to the slot
# aspect, scale the long side down to max_long_px, write a high-quality JPG.
# Decoder = bundled imageio-ffmpeg (no system ffmpeg). Autorotate is on, so portrait clips
# come out in display orientation and crop math uses the displayed iw/ih.
#
# Usage:
#   .venv/bin/python tools/asset/frame-grab.py --spec runs/<space>/asset-classify/frame-grab.json
#
# Spec JSON: { raw_dir, out_dir, max_long_px, frames:[{id,t,aspect:"w:h",out,slot}] }

import sys, os, json, subprocess, argparse
from imageio_ffmpeg import get_ffmpeg_exe

FF = get_ffmpeg_exe()


def run(args):
    subprocess.run([FF, "-y", "-hide_banner", "-loglevel", "error"] + args, check=True)


def is_hdr(src):
    r = subprocess.run([FF, "-hide_banner", "-i", src], capture_output=True, text=True)
    s = r.stderr.lower()
    return ("arib-std-b67" in s) or ("smpte2084" in s) or ("bt2020" in s)


def grab(spec_path):
    spec = json.load(open(spec_path))
    raw_dir = spec.get("raw_dir", "assets/raw")
    out_dir = spec.get("out_dir", ".")
    maxpx = int(spec.get("max_long_px", 2160))
    os.makedirs(out_dir, exist_ok=True)
    results = []
    for fr in spec["frames"]:
        src = os.path.join(raw_dir, fr["id"] + ".mp4")
        if not os.path.exists(src):
            print(f"ERROR: missing {src}", file=sys.stderr); sys.exit(2)
        tw, th = (int(x) for x in fr["aspect"].split(":"))
        ar = tw / th
        out = os.path.join(out_dir, fr["out"] + ".jpg")

        chain = []
        if is_hdr(src):
            chain += ["zscale=t=linear:npl=100", "tonemap=tonemap=hable:desat=0",
                      "zscale=p=bt709:t=bt709:m=bt709:r=tv", "format=yuv420p"]
        # center-crop to target aspect (works for any source orientation)
        chain += [
            f"crop='if(gte(iw/ih,{ar}),ih*{ar},iw)':'if(gte(iw/ih,{ar}),ih,iw/{ar})'",
            # scale long side down to maxpx, keep aspect, even dims
            f"scale='if(gte(iw,ih),min(iw,{maxpx}),-2)':'if(gte(iw,ih),-2,min(ih,{maxpx}))'",
        ]
        vf = ",".join(chain)
        run(["-ss", str(fr["t"]), "-i", src, "-frames:v", "1", "-vf", vf,
             "-q:v", "2", out])
        results.append({"out": out, "slot": fr.get("slot"), "from": f"{fr['id']}@{fr['t']}",
                        "aspect": fr["aspect"], "bytes": os.path.getsize(out)})
    print(json.dumps({"grabbed": len(results), "out_dir": out_dir, "frames": results}, indent=1))


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--spec", required=True)
    a = ap.parse_args()
    grab(a.spec)
