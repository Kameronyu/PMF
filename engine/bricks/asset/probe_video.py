"""
Brick 2v — probe_video.py
Reads video metadata via the bundled imageio-ffmpeg binary (no system ffmpeg on this box).
Emits JSON: { duration_s, w, h, fps, codec, has_audio, aspect, bytes, oversize }

Security (T-16-03-01): subprocess.run called with an argv LIST, never shell=True,
never an f-string interpolated into a shell command.

Resource note: oversize is flagged (bytes > 150 MB) so callers can decide before sampling.
"""

import sys
import os
import re
import json
import subprocess
from imageio_ffmpeg import get_ffmpeg_exe


def probe_video(video):
    """
    Probe a video file using the bundled ffmpeg binary (-i parses stderr).
    Returns a dict with: duration_s, w, h, fps, codec, has_audio, aspect, bytes, oversize.
    Unparseable numeric fields are null (never fabricated).
    """
    try:
        ffmpeg_exe = get_ffmpeg_exe()
    except Exception as e:
        print(f"ERROR: could not locate bundled ffmpeg binary: {e}", file=sys.stderr)
        sys.exit(1)

    # ffmpeg -i with no output file always exits non-zero — that is expected.
    # Stream/container info is printed to stderr.
    r = subprocess.run(
        [ffmpeg_exe, "-i", video],
        capture_output=True,
        text=True
    )
    s = r.stderr  # stream info lives in stderr

    out = {"bytes": os.path.getsize(video)}

    # Duration: HH:MM:SS.ff
    m = re.search(r"Duration:\s*(\d+):(\d+):(\d+\.\d+)", s)
    if m:
        h, mn, sec = int(m.group(1)), int(m.group(2)), float(m.group(3))
        out["duration_s"] = round(h * 3600 + mn * 60 + sec, 2)
    else:
        out["duration_s"] = None

    # Video stream — try combined regex first, then fall back to separate searches
    # Combined: "Video: <codec> ..., WxH ..., N fps"
    v = re.search(
        r"Stream.*Video:\s*([\w0-9]+).*?(\d{2,5})x(\d{2,5}).*?([\d.]+)\s*fps",
        s
    )
    if v:
        out["codec"] = v.group(1)
        out["w"] = int(v.group(2))
        out["h"] = int(v.group(3))
        out["fps"] = float(v.group(4))
    else:
        # Fallback: extract codec, resolution, fps separately
        codec_m = re.search(r"Stream.*Video:\s*([\w0-9]+)", s)
        res_m = re.search(r"(\d{2,5})x(\d{2,5})", s)
        # tbr / fps / tbn — try fps first, then tbr
        fps_m = re.search(r"([\d.]+)\s*fps", s)
        if not fps_m:
            fps_m = re.search(r"([\d.]+)\s*tbr", s)

        out["codec"] = codec_m.group(1) if codec_m else None
        out["w"] = int(res_m.group(1)) if res_m else None
        out["h"] = int(res_m.group(2)) if res_m else None
        out["fps"] = float(fps_m.group(1)) if fps_m else None

    # Aspect — derived from w/h if both parsed
    if out.get("w") and out.get("h"):
        out["aspect"] = f"{out['w']}:{out['h']}"
    else:
        out["aspect"] = None

    # Audio stream presence
    out["has_audio"] = bool(re.search(r"Stream.*Audio:", s))

    # Oversize flag — 150 MB threshold (real Arduview MP4s are 177/192/224 MB)
    out["oversize"] = out["bytes"] > 150 * 1024 * 1024

    return out


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: probe_video.py <video_path>", file=sys.stderr)
        sys.exit(1)

    video_path = sys.argv[1]
    if not os.path.isfile(video_path):
        print(f"ERROR: file not found: {video_path}", file=sys.stderr)
        sys.exit(1)

    print(json.dumps(probe_video(video_path)))
