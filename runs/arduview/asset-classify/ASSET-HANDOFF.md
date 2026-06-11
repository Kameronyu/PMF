# Arduview — Asset Handoff for the Funnel Architect

**To:** the agent/skill that designs the Arduview funnel + landing page (knows the belief chain + persuasion mechanics).
**From:** the asset-classification + production pass.

**Your job, IN THIS ORDER:**
1. **Design the strategy first** — the belief chain for this funnel/LP, and from that, define what IMAGE JOBS the page needs (what each image slot must make the visitor believe/feel, and in what order).
2. **THEN select the images yourself** — for each image job you defined, go look at the available frames below, judge which one best serves that job (persuasion first, then which "looks pretty"), and pick it. Cite each pick as `video-id @ mm:ss.ff` + the aspect/crop you want. **You decide what goes on the site.**
3. You may KEEP AT MOST ONE of the 5 existing product photos if it does a job no frame does as well.
4. Flag any image job you defined that has NO usable frame (a gap → reshoot or copy-only).

You are NOT being handed a finished image set. You define the jobs, then choose the frames. Once you specify picks (`video @ timestamp` + aspect), a deterministic brick (`tools/asset/frame-grab.py`) extracts them at full 4K — so you only need to specify, not produce.

---

## 1. Product (one-liner + facts)
Arduview — a transparent-shell pocket game console. ~50g, ~85×43×13mm (palm/pocket). Clear resin enclosure you see the PCB through; a **see-through display** with game pixels lit on a transparent pane; physical **D-pad + A/B** retro controls; **USB-C / Arduino-flashable** (hackable/open); resin finish; collectible. DR **crowdfunding** launch. Positioning: transparent-tech premium meets indie retro handheld — explicitly NOT a cheap toy.

## 2. Belief / claim inventory (what the imagery can prove)
LOAD-BEARING (the bet rides on these two):
- `transparency_internals_visible` — see the PCB/board through the shell
- `see_through_display_on` — game pixels lit on the transparent pane

Supporting: `pocket_scale` · `retro_gaming` · `collectible_object` · `hackable_maker` · `build_material_quality` · `whats_in_box`
Full list: `runs/arduview/asset-classify/CLAIM-LIST.json`

## 3. YOUR FRAME UNIVERSE — what's out there + which look good

**Your pick bucket = the top-5 videos by aesthetic grade** (the only footage clean enough to pull stills from). Each contact sheet is a grid of frames at 5fps with an `mm:ss.ff` timestamp on every cell — **READ these to choose frames**, then cite the timestamp you want:

| video | orientation | what it contains | contact sheets |
|---|---|---|---|
| arduview-vid-18 | landscape 16:9 | clean wood-grain bg orbital, PCB through shell, lit display | `sheets/arduview-vid-18-s01.jpg`, `-s02.jpg` |
| arduview-vid-16 | portrait 9:16 | live Pong/paddle gameplay + menu on transparent display, neutral grey bg | `sheets/arduview-vid-16-s01.jpg` … `-s05.jpg` |
| arduview-vid-13 | landscape 16:9 | clean desk orbital, lit display, transparency throughout | `sheets/arduview-vid-13-s01.jpg` … `-s04.jpg` |
| arduview-vid-12 | portrait 9:16 | transparent enclosure, PCB + LiPo battery clearly visible | `sheets/arduview-vid-12-s01.jpg` |
| arduview-vid-08 | portrait 9:16 | rotation transparency reveal, START screen, unobstructed device near end | `sheets/arduview-vid-08-s01.jpg` … `-s05.jpg` |

(All sheets live in `runs/arduview/asset-classify/sheets/`. Landscape frames are 3840×2160, portrait are 2160×3840 — factor that into the crop you request per slot.)

**"Which look pretty" — the aesthetic read:** every clip was graded; the 5 above are the top of that ranking (clean backgrounds, best focus/stability). The per-clip aesthetic scores (lighting/composition/focus/background/color/stability) + standout/weakness + the full timestamped content beat sheets are in:
- `runs/arduview/asset-classify/VIDEO-ANALYSIS.md` ← read this to know what each frame shows and how good it looks before you pick.

**Existing product photos (KEEP AT MOST ONE):**
- `assets/raw/arduview-0001.jpg` — in-hand, rich live arcade game UI (sprite/hearts/coin), foliage bg, portrait
- `assets/raw/arduview-0002.jpg` … `-0005.jpg` — near-duplicate macro "GAME OVER / 13 score" detail crops (weak)
Read them; keep the one (if any) that does a job your chosen frames can't.

> Optional prior opinion (NOT binding — ignore if it anchors you): an art-director did one selection pass at `runs/arduview/asset-classify/IMAGE-PLAN.md`. Treat it as one view, not the answer. You set the strategy and make the real call.

## 4. Hero video (silent, NO captions yet — captions are a later step)
- 16:9 LP/desktop: `runs/arduview/asset-classify/cuts/arduview-hero-16x9.mp4` (12.6s)
- 9:16 paid-social: `runs/arduview/asset-classify/cuts/arduview-hero-9x16.mp4` (13.7s; has the real gameplay)
Beat sheets + poster frames: `VIDEO-ANALYSIS.md`. Decide where the hero video sits in your structure.

## 5. Brand visual references (the look/voice to borrow — pick which leads)
- `runs/arduview/brand-refs/nothing.md` — transparent-tech identity: dot-matrix type, see-through-as-brand, black + one accent (closest sibling)
- `runs/arduview/brand-refs/teenage-engineering.md` — object-as-art premium; the anti-"cheap-toy" defense
- `runs/arduview/brand-refs/playdate.md` — indie-handheld LP **structure** (full section-by-section) + playful confident voice + "sell a weird device" mechanics

## 6. Constraints / gaps (design around these)
- **Aesthetic ceiling:** all 20 videos graded 0/20 "ad-ready" — raw handheld footage. Even the top-5 are flat-light/slightly soft. Stills salvage the best beats but this isn't studio material; per-clip weaknesses are your reshoot fix-list (VIDEO-ANALYSIS.md).
- **`whats_in_box` has NO asset** anywhere — packaging/cable/unboxing beat is copy-only or a reshoot.
- **Everything is silent + uncaptioned.**
- **Mixed orientation:** best gameplay is vertical (9:16); beauty orbitals are landscape (16:9) — that's why there are two hero cuts.

## 7. WHAT TO RETURN
1. The **belief chain / section order** for the funnel/LP.
2. The **image jobs** you defined (what each slot must do, tied to a belief).
3. Your **selected frame per job** — `video-id @ mm:ss.ff` + requested aspect/crop + the claim it carries + one-line why it serves that job.
4. The **kept photo** (if any) and why.
5. **Gaps** — any image job with no usable asset (esp. `whats_in_box`).
6. Where the **hero video** sits.
