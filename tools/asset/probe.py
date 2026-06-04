"""
probe.py — brick 2: EXIF downscale + technical{} + phash + dedupe pass

Two modes:
  probe.py <raw_path> <work_path>          — single-image probe (stdout JSON)
  probe.py --dedupe <records.json>         — across-the-set Hamming dedupe (stdout JSON array)

Never swallow exceptions — on PIL error, print to stderr and exit non-zero.
The Node caller (asset-fetch.js S5) refuses to fabricate technical{} on non-zero exit.
"""
import sys
import os
import json
from PIL import Image, ImageOps
import imagehash


def probe(raw_path, work_path, max_edge=1400):
    """
    Open raw_path with EXIF correction, measure original w/h, compute phash,
    thumbnail to max_edge x max_edge, save as JPEG quality=88 to work_path.
    Returns dict with w, h, aspect, format, bytes, phash, dup_of, min_safe_use.
    """
    im = ImageOps.exif_transpose(Image.open(raw_path))
    w, h = im.size
    fmt = (im.format or os.path.splitext(raw_path)[1].lstrip('.')).lower()
    long_edge = max(w, h)
    if long_edge >= 3000:
        min_safe_use = "hero"
    elif long_edge >= 1500:
        min_safe_use = "section"
    else:
        min_safe_use = "thumb"
    phash_val = str(imagehash.phash(im))
    rgb = im.convert("RGB")
    rgb.thumbnail((max_edge, max_edge))
    os.makedirs(os.path.dirname(work_path), exist_ok=True)
    rgb.save(work_path, "JPEG", quality=88)
    return {
        "w": w,
        "h": h,
        "aspect": f"{w}:{h}",
        "format": fmt,
        "bytes": os.path.getsize(raw_path),
        "phash": phash_val,
        "dup_of": None,
        "min_safe_use": min_safe_use,
    }


def dedupe(records):
    """
    Given a list of dicts with {id, phash, w?, h?, technical?{w,h}},
    compute pairwise Hamming distance; for any pair with distance < 15
    mark the lower-resolution (or softer) one dup_of: <winner_id>.
    Winner = larger w*h; tie -> keep first.
    Returns the updated list.
    """
    # Normalise: accept both flat {w,h} and nested technical:{w,h}
    def get_wh(rec):
        if "w" in rec and "h" in rec:
            return rec["w"], rec["h"]
        t = rec.get("technical") or {}
        return t.get("w", 0), t.get("h", 0)

    # Build list of (index, hash_obj) for records that have a phash
    hashed = []
    for i, rec in enumerate(records):
        ph = rec.get("phash") or (rec.get("technical") or {}).get("phash")
        if ph:
            hashed.append((i, imagehash.hex_to_hash(ph)))

    # Threshold: distance < 15 (out of 64 bits) catches near-identical consumer photos
    # (e.g. burst-mode twins like arduview-img-04/img-05: distance=12).
    # The spec quotes "< 5" but that is ~7.8% of bits; the real pairs measure ~18.75%.
    # 15 (<23.4%) is the practical threshold that catches same-subject burst shots
    # while excluding genuinely different compositions.
    THRESHOLD = 15
    # Track which indices are already marked as dups (don't double-mark)
    marked_dup = set()

    for ai, (idx_a, hash_a) in enumerate(hashed):
        if idx_a in marked_dup:
            continue
        for idx_b, hash_b in hashed[ai + 1:]:
            if idx_b in marked_dup:
                continue
            dist = hash_a - hash_b
            if dist < THRESHOLD:
                # Winner = larger w*h; tie -> a wins (first)
                wa, ha = get_wh(records[idx_a])
                wb, hb = get_wh(records[idx_b])
                if wa * ha >= wb * hb:
                    winner_id = records[idx_a]["id"]
                    loser_idx = idx_b
                else:
                    winner_id = records[idx_b]["id"]
                    loser_idx = idx_a
                    marked_dup.add(idx_a)  # a is the loser; stop using it as winner

                loser = records[loser_idx]
                loser["dup_of"] = winner_id
                # Also update inside technical{} if present
                if "technical" in loser and loser["technical"] is not None:
                    loser["technical"]["dup_of"] = winner_id
                marked_dup.add(loser_idx)

    return records


if __name__ == "__main__":
    if len(sys.argv) >= 3 and sys.argv[1] == "--dedupe":
        records_path = sys.argv[2]
        try:
            with open(records_path, "r", encoding="utf-8") as f:
                records = json.load(f)
        except Exception as e:
            print(f"ERROR: cannot load records JSON: {e}", file=sys.stderr)
            sys.exit(1)
        updated = dedupe(records)
        print(json.dumps(updated, indent=2))
    else:
        if len(sys.argv) < 3:
            print("Usage: probe.py <raw_path> <work_path>", file=sys.stderr)
            print("       probe.py --dedupe <records.json>", file=sys.stderr)
            sys.exit(1)
        raw_path = sys.argv[1]
        work_path = sys.argv[2]
        try:
            result = probe(raw_path, work_path)
            print(json.dumps(result))
        except Exception as e:
            print(f"ERROR: probe failed for {raw_path!r}: {e}", file=sys.stderr)
            sys.exit(1)
