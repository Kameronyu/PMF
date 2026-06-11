# Phase 16 — Formalize Handoff (commit + verify + complete)

**Run this in ONE dedicated window when the caption / funnel-architect / LP-builder(Phase 17) sessions are IDLE.**
All of phase-16 close is git + STATE/ROADMAP writing. Multiple sessions are sharing this working tree (`eink-phase0-run`) — concurrent git access collides. Serialize: this must be the only active git-writer while it runs.

The work is DONE and on disk; this is bookkeeping only. Context (deviations, decisions, scope notes) is in `16-06-SUMMARY.md` — read it first.

---

## 0. Pre-check
```bash
cd /home/kyu3/PMF
git status --short        # confirm no OTHER session is mid-write
git branch --show-current # expect eink-phase0-run
```
`assets/` is already gitignored (4 GB raw — stays out). Good.

## 1. Extend .gitignore (regenerable media + other sessions' WIP — do NOT commit these)
Append to `.gitignore`:
```
# Asset-classifier heavy/regenerable outputs
runs/arduview/asset-classify/sheets/
runs/arduview/asset-classify/cuts/
runs/arduview/asset-classify/images-from-frames/
runs/arduview/asset-classify/_fonts/
runs/arduview/asset-classify/_captions.ass
runs/arduview/asset-classify/_caption_gradient.*
runs/arduview/asset-classify/_*-log.txt
```
(Sheets 23M, cuts 37M, frames 2M — all regenerable from the committed bricks + EDLs + source footage. `_fonts/`, `_captions.*` belong to the caption session, not phase 16.)

## 2. Commit ONLY phase-16 deliverables (surgical — explicit paths; do NOT `git add -A`)
Other untracked files in the tree belong to other work and MUST be left alone:
**DO NOT COMMIT:** `.planning/phases/17-*`, `runs/arduview/{FUNNEL-DESIGN,COPY-DRAFT,HERO-VIDEO,BUILD-FEEDBACK,STRATEGY-DISCUSS-HANDOFF}.md`, `runs/arduview/_tooling/`, `drive.cjs`, `runs/arduview/asset-classify/frame-grab-fix.json` (architect's), and the pre-existing `M` files (`runs/arduview/market-selection.md`, `.planning/config.json` unless you confirm the change is yours).

Stage exactly:
```bash
# bricks (asset-emit.js is MODIFIED; video-assemble.py + frame-grab.py are NEW; rest already committed in 16-01..05)
git add tools/asset-emit.js tools/asset/video-assemble.py tools/asset/frame-grab.py

# phase docs (PLANs + all SUMMARYs incl. the new 16-06 + this handoff)
git add ".planning/phases/16-asset-classifier-image-and-video-bricks/"

# classifier text outputs (records + manifests + plans + EDLs + handoffs — NOT sheets/cuts/images/fonts)
git add runs/arduview/asset-classify/records/ \
        runs/arduview/asset-classify/*.md \
        runs/arduview/asset-classify/*.json
# brand refs
git add runs/arduview/brand-refs/

git status --short   # REVIEW staged set before committing — confirm no media, no other-session files
git commit -m "feat(phase-16): asset classifier — live UAT run, manifests, hero-cut + frame-grab tooling

25 records (5 img + 20 vid) classified + validated; IMAGES/VIDEOS/VIDEO-ANALYSIS manifests;
asset-emit aspect/silent/aesthetics columns + gap fix; video-assemble.py + frame-grab.py (M2 launch tooling);
brand refs + asset/caption handoffs. See 16-06-SUMMARY.md.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```
(`.gitignore` change goes in this commit too: `git add .gitignore` before committing.)

## 3. Mark plan progress (if gsd-tools tracking is used)
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" roadmap update-plan-progress 16 06 complete
```
(16-01..16-05 were already marked by their executors.)

## 4. Verify the phase goal (portable — reads on-disk artifacts)
Spawn the gsd-verifier (or run `/gsd-verify-work 16`). Phase goal: "turn a folder of raw product images/videos into a claim-tagged manifest the LP/copywriter agents query by belief, + human pick gate."
- Must-haves: deterministic chain (fetch→probe→montage), validate gate, SKILL orchestrator, map-rank/emit manifests, the live run output (25 records + IMAGES.md/VIDEOS.md).
- **Tell the verifier:** `video-assemble.py` + `frame-grab.py` are out-of-scope LAUNCH tooling (see 16-06-SUMMARY §Out-of-scope) — do not score them as S16 must-haves.
- Known gaps (not failures): `whats_in_box` has no asset; 0/20 videos ad-ready (reshoot signal).

## 5. Mark phase complete
```bash
node "$HOME/.claude/get-shit-done/bin/gsd-tools.cjs" phase complete 16
git add .planning/ROADMAP.md .planning/STATE.md .planning/REQUIREMENTS.md \
        ".planning/phases/16-asset-classifier-image-and-video-bricks/"*-VERIFICATION.md 2>/dev/null
git commit -m "docs(phase-16): complete phase execution

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>"
```

## 6. (Optional) Code review
`/gsd-code-review 16` on the changed bricks (asset-emit.js, video-assemble.py, frame-grab.py). Advisory; non-blocking.

## Decision-log lines to carry into STATE (from 16-06-SUMMARY)
- hamming dedupe 5→15 (measured); vid-09 = silent feature_demo not explainer; all clips SILENT (operator); mixed orientation → two hero cuts; HDR HLG→SDR tonemap; asset-emit hand-edited post-15; video-assemble/frame-grab = M2 launch tooling built early.
