# tools/asset — Asset Classifier bricks (Phase 16 / Stage M1-S16)

## Node <-> Python split (load-bearing convention)
Pixel work is Python (PIL on this box); orchestration/emit/upload is Node. Node bricks spawn the
python pixel bricks via the EXPLICIT venv interpreter path so spawn works without an active shell:

    const { spawnSync } = require('child_process');
    const path = require('path');
    const VENV_PY = path.resolve(process.cwd(), '.venv', 'bin', 'python');
    const run = spawnSync(VENV_PY,
      [path.resolve(__dirname, 'asset', 'probe.py'), rawPath, workPath],
      { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
    if (run.error || run.status !== 0 || !run.stdout) {
      console.error('ERROR: probe.py failed — refusing to fabricate technical{}');
      if (run.stderr) console.error(run.stderr.trim());
      process.exit(2);
    }
    const technical = JSON.parse(run.stdout);   // python bricks print JSON to stdout

Never call bare `python3` (PEP 668 venv must be used). Never use shell-string interpolation of
filenames into the spawn — pass argv arrays only (command-injection guard, T-16-02).

## Brick map
| # | Brick | Lang | File |
|---|-------|------|------|
| 1 | fetch | Node | tools/asset-fetch.js |
| 2 | probe (+downscale +phash) | Python | tools/asset/probe.py |
| 2v | probe-video | Python | tools/asset/probe_video.py |
| 3v | sample + montage | Python | tools/asset/sample_montage.py |
| 3 | relevance-bucket | agent | .claude/skills/asset-classify/SKILL.md |
| 4 | role-classify | agent | .claude/skills/asset-classify/SKILL.md |
| 4v | comprehend-video | agent | .claude/skills/asset-classify/SKILL.md |
| validate | validate-asset-record | Node hook | tools/hooks/validate-asset-record.js |
| 5 | map + rank | Node | tools/asset-map-rank.js |
| 6 | pick gate | human | — |
| 7 | emit manifest | Node | tools/asset-emit.js |
| 8 | upload + url-backfill | Node | tools/asset-upload.js |

## Setup
    python3 -m venv .venv
    .venv/bin/python -m pip install imagehash imageio-ffmpeg   # Pillow already present
