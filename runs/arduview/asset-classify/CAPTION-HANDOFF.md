# Arduview Hero Video — Caption Handoff

**To:** the agent/editor finishing the Arduview hero video.
**Task:** add captions to the assembled LP hero cut, per the visual spec below. The cut is already edited (clips chosen, trimmed, ordered, graded, silent). You are ONLY adding captions.
**Important:** RENDER-ONLY. Do NOT commit anything, and do NOT touch `.planning/STATE.md` or `.planning/ROADMAP.md` — another session owns git/state right now. Just produce the captioned mp4.

---

## File locations
- **Primary target — LP/desktop hero (16:9):** `runs/arduview/asset-classify/cuts/arduview-hero-16x9.mp4` (12.6s, 1920×1080, 30fps, silent)
- Optional — paid-social hero (9:16): `runs/arduview/asset-classify/cuts/arduview-hero-9x16.mp4` (13.7s, 1080×1920)
- **The edit brief / EDL (what each beat is, in order):** `runs/arduview/asset-classify/hero-edl.json` (16:9), `hero-edl-9x16.json` (9:16)
- **Per-beat content + timings (full beat sheets):** `runs/arduview/asset-classify/VIDEO-ANALYSIS.md`
- **The assembly brick (re-render the base cut if you need a 2160p version — see sizing note):** `tools/asset/video-assemble.py` (uses the bundled imageio-ffmpeg; no system ffmpeg)
- Claim/belief list (so captions reinforce the right beat): `runs/arduview/asset-classify/CLAIM-LIST.json`

## The 16:9 hero beat map (write ONE caption line per beat)
Cut points (seconds) and what each beat shows — fade each caption in ~0.3s after the cut, out before the next:

| beat | window | shows | the belief it lands | suggested accent word |
|---|---|---|---|---|
| 1 OPEN | 0.0–2.2 | clean orbital, lit transparent device | "what IS this" / beauty hook | see-through |
| 2 TRANSPARENCY | 2.2–4.6 | PCB + traces through the clear resin | nothing's hidden | really see inside |
| 3 DISPLAY | 4.6–6.6 | see-through display lit | the screen is real, and clear | display, lit |
| 4 GAMES + IN HAND | 6.6–8.6 | in hand, live arcade game UI | it actually plays / pocket size | really plays |
| 5 PLAY | 8.6–10.6 | thumbs on D-pad/A-B | real controls, hands-on | — |
| 6 CLOSE | 10.6–12.6 | clean orbital, collectible | want-it / CTA lead-in | everyone asks |

Write the copy from these beats — short, confident, one line per beat (mobile-first, see sizing). Voice: plain and a little playful (Playdate-ish), no hype. One cyan accent word per line on the load-bearing word (examples in the table; finalize your own). Keep a draft + let the operator approve before final render.

---

## CAPTION VISUAL SPEC (follow exactly)

**Font**
IBM Plex Mono — Medium (500). Free on Google Fonts. It's the site's body/terminal face, so captions read as part of the same system.
If you want more of the dot-matrix/retro flavor instead: Doto (700) — but only for short captions, it's lower legibility at speed. Plex Mono is the safer default for video.

**Color**
- Caption text: white `#FFFFFF`
- One accent word per caption: cyan `#2BE5FF` (the device screen-glow — our only accent). Use it on the load-bearing word, like *see-through*, *really plays*, *everyone asks*.
- Don't color a whole caption cyan — white line, one cyan word.

**Contrast overlay**
Simple bottom-up dark gradient behind the lower-third text (handles the clips' different backgrounds):
```
linear-gradient(to top,
  rgba(0,0,0,0.75) 0%,
  rgba(0,0,0,0.45) 18%,
  rgba(0,0,0,0)   38%)
```
Covers roughly the bottom quarter, fades to clear. In a video editor that's: a black solid, ~20% screen height, anchored to the bottom, with a top-to-bottom opacity ramp 0 → ~75%, or just no fade at all.
Belt-and-suspenders for legibility (use if the gradient alone isn't enough on bright clips): a soft text shadow — `0 1px 12px rgba(0,0,0,0.9)`.

**Sizing / placement**
- Centered, lower-third (sits above the gradient's densest area).
- Size for mobile first — it's the first thing on the page. Roughly 4.5–5% of frame height (~95–110px on a 2160p export), one line per beat.
- Tracking slightly open (mono already is); fade each caption in ~0.3s after the cut, fade out before the next.

> SIZING NOTE: the current `arduview-hero-16x9.mp4` is exported at **1080p**, so 4.5–5% of frame height ≈ **~49–54px**, not 95–110px. If you want the spec's literal 95–110px crispness, first re-render the base cut at 2160p by editing `hero-edl.json` target to `{"w":3840,"h":2160,"fps":30}` and re-running `video-assemble.py`, then caption that. Otherwise scale the px to the 1080p frame.

---

## Rendering path (your choice)
- **In an editor (CapCut / Premiere / Resolve):** follow the spec literally — Plex Mono 500, white line + one cyan word, bottom gradient solid+opacity-ramp, lower-third, per-beat fades.
- **Programmatic (ffmpeg):** build an `.ass` subtitle file (libass supports per-word color overrides via `{\c&H...&}`, fades via `\fad(300,300)`, bottom-center alignment, shadow) + a bottom dark-gradient overlay; point ffmpeg at a downloaded IBM Plex Mono Medium `.ttf`. Check that the bundled ffmpeg has libass; if not, render in an editor.

## What to return
The captioned mp4 (`...-hero-16x9-captioned.mp4`), the final caption copy (one line per beat), and a note on which rendering path you used. Do not commit; hand the file back to the operator.
