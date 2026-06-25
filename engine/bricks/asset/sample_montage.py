"""
Brick 3v — sample_montage.py
Samples a video at 5fps with the bundled imageio-ffmpeg binary (no system ffmpeg on this box),
then tiles the frames into timestamped contact sheets using PIL.

Deliberate spec deviation: the spec names ffmpeg tile=5x6 + drawtext for the grid/labels.
We do the tile+timestamp in PIL instead (ImageDraw.text). The bundled static ffmpeg binary may
lack the freetype/fontconfig required by the drawtext filter. The intent — 5fps timestamped
contact sheets the vision agent can read in order to rebuild the video timeline — is fully
preserved.

Security (T-16-03-01): subprocess.run called with an argv LIST, never shell=True, never an
f-string interpolated into a shell command. video path and output path are passed as discrete
argv elements.

Resource safety (T-16-03-02):
  - Frames are extracted to a scratch dir and shutil.rmtree'd after montage.
  - Each cell is downscaled to ~360px so a 5x6 sheet stays a normal Read-able JPEG.
  - 30 frames per sheet (5x6 = 6s at 5fps) caps single-sheet size.
  - Operator-verified: the 224 MB clip was the UAT target for this brick.
"""

import sys
import os
import glob
import json
import shutil
import subprocess
import argparse
from imageio_ffmpeg import get_ffmpeg_exe
from PIL import Image, ImageDraw

FFMPEG = get_ffmpeg_exe()


def sample(video, outdir, fps=5):
    """
    Extract frames at fps using the bundled ffmpeg binary.
    Frames written as f0001.jpg, f0002.jpg, ... in outdir.

    Security: all paths passed as discrete argv elements (no shell=True).
    """
    os.makedirs(outdir, exist_ok=True)
    frame_pattern = os.path.join(outdir, "f%04d.jpg")
    subprocess.run(
        [FFMPEG, "-i", video, "-vf", f"fps={fps}", frame_pattern],
        check=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )


def montage(frames_dir, sheet_dir, vid_id, fps=5, cols=5, rows=6, cell=360):
    """
    Tile extracted frames into 5x6 (cols x rows) contact sheets with PIL.
    Each cell is downscaled to ~cell px and stamped with its mm:ss.ff timestamp
    computed as global_frame_index / fps_sampled (deterministic, not guessed).

    Returns: (list_of_sheet_paths, total_frame_count)
    """
    os.makedirs(sheet_dir, exist_ok=True)
    frames = sorted(glob.glob(os.path.join(frames_dir, "f*.jpg")))
    total_frames = len(frames)
    per_sheet = cols * rows  # 30 frames per sheet at 5x6

    sheets = []
    num_sheets = (total_frames + per_sheet - 1) // per_sheet

    for s in range(num_sheets):
        chunk = frames[s * per_sheet : (s + 1) * per_sheet]
        sheet_w = cols * cell
        sheet_h = rows * cell
        sheet = Image.new("RGB", (sheet_w, sheet_h), "black")
        d = ImageDraw.Draw(sheet)

        for i, fp in enumerate(chunk):
            thumb = Image.open(fp)
            thumb.thumbnail((cell, cell))

            # Position in the grid
            col_idx = i % cols
            row_idx = i // cols
            x = col_idx * cell
            y = row_idx * cell

            # Paste frame — center in cell if thumbnail is smaller
            paste_x = x + (cell - thumb.width) // 2
            paste_y = y + (cell - thumb.height) // 2
            sheet.paste(thumb, (paste_x, paste_y))

            # Timestamp: global frame index -> mm:ss.ff
            global_idx = s * per_sheet + i
            t = global_idx / fps  # seconds (exact, deterministic)
            minutes = int(t // 60)
            seconds = t % 60
            ts = f"{minutes:02d}:{seconds:05.2f}"

            # Legibility backing + label (yellow on black)
            label_x = x + 2
            label_y = y + 2
            d.rectangle([label_x, label_y, label_x + 76, label_y + 16], fill="black")
            d.text((label_x + 2, label_y + 2), ts, fill="yellow")

        sheet_path = os.path.join(sheet_dir, f"{vid_id}-s{s + 1:02d}.jpg")
        sheet.save(sheet_path, "JPEG", quality=85)
        sheets.append(sheet_path)

    return sheets, total_frames


def run(video, vid_id, frames_dir, sheets_dir, fps=5):
    """
    Full pipeline: sample -> montage -> cleanup.
    Returns dict: { vid_id, fps_sampled, frame_count, sheets }
    """
    # Step 1: extract frames to scratch dir
    sample(video, frames_dir, fps=fps)

    # Step 2: montage into contact sheets
    sheets, frame_count = montage(frames_dir, sheets_dir, vid_id, fps=fps)

    # Step 3: clean up scratch frames (T-16-03-02 — no lingering ~150 JPGs)
    if os.path.exists(frames_dir):
        shutil.rmtree(frames_dir)

    return {
        "vid_id": vid_id,
        "fps_sampled": fps,
        "frame_count": frame_count,
        "sheets": sheets,
    }


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Brick 3v: sample video at 5fps and produce PIL timestamped contact sheets"
    )
    parser.add_argument("video", help="Path to the input video file")
    parser.add_argument("vid_id", help="Video identifier (used in output filenames)")
    parser.add_argument(
        "--frames-dir",
        required=True,
        help="Scratch directory for extracted frames (cleaned up after montage)",
    )
    parser.add_argument(
        "--sheets-dir",
        required=True,
        help="Output directory for contact sheet JPEGs",
    )
    parser.add_argument(
        "--fps",
        type=int,
        default=5,
        help="Sample rate in frames per second (default: 5)",
    )
    args = parser.parse_args()

    if not os.path.isfile(args.video):
        print(f"ERROR: video file not found: {args.video}", file=sys.stderr)
        sys.exit(1)

    result = run(
        video=args.video,
        vid_id=args.vid_id,
        frames_dir=args.frames_dir,
        sheets_dir=args.sheets_dir,
        fps=args.fps,
    )
    print(json.dumps(result))
