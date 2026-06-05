<!-- BUILD SPEC (not Kam's verbatim strategy sauce). Build the bricks FROM this.
     Brick model is the build law (capability_inventory.md): deterministic -> script/hook,
     judgment -> agent, gate -> human. One job per brick, split to the smallest part.
     Worked instance: Arduview (fully transparent pocket game console). Source of product facts:
     Drive "Arduview Product Description.docx" + "arduview-pre-research-plan.md". -->

# Image Classifier — Brick Spec

Turns a folder of raw product images (Google Drive) into a **queryable, claim-tagged manifest** that
an LP-building / copywriting agent can pull from to place the *right* image behind each thing it is
trying to prove. The output format is a section -> role -> file -> CDN-slot manifest (the **classification
is richer than a hand-catalogue** so the builder can retrieve images by the *claim they demonstrate*, not
just by the slot they sit in). Minimal manifest shape:

```
## hero
| role    | pick              | claim+strength                      | CDN URL |
| primary | arduview-0001     | see_through_display_on (strong)     |         |
| also    | arduview-0001     | transparency_internals_visible (strong) |      |

## feature_transparency
| role    | pick              | claim+strength                          | CDN URL |
| primary | arduview-0002     | transparency_internals_visible (strong) |         |
| also    | arduview-0002     | build_material_quality (partial)        |         |
```

---

## The design principle: classify backward from the consumer

The consumer is an agent building a landing page. It does **not** think "give me hero image #3." It
thinks claim-first — *"I'm writing the section that has to make a skeptic believe this is genuinely
see-through, not a clear case over a normal screen. What image proves that, hard?"* (This mirrors the
`copywrite` skill: install a belief per section, retrieve the proven material for it.)

So the manifest's **primary key is the product claim an image visually proves**, with a strength read.
Section/slot is a *derived* convenience, not the organizing axis. A classifier that only emits
"section: hero" is useless to a builder that needs "this shot proves transparency, strongly, with the
internal PCB visible, on a clean background, no text overlay, hero-resolution."

**Grounding rule (load-bearing, mirrors VOC's verbatim discipline):** the agent tags only what is
*visibly true in the pixels*. It tags `transparency_internals_visible` only if it can actually see the
board through the shell — never because "the product is transparent." A manifest that claims an image
proves something it doesn't will send the builder to put a weak image on a load-bearing claim. The
agent describes and tags; it never flatters the image and never writes customer copy.

---

## The brick string

Per the build law — two judgment bricks (agents), the rest deterministic, one human gate.

| # | Brick | Type | Job | In -> Out |
|---|-------|------|-----|-----------|
| 1 | **fetch** | script | List the Drive folder, download every image to `assets/raw/`. *This is why fetch is its own brick: images land on disk so the vision agents read file paths, never base64-through-context.* | folder id -> `assets/raw/*` + `raw-manifest.json` |
| 2 | **probe** | script | Per file: width/height, aspect, format, bytes, perceptual-hash dedupe, `min_safe_use` (thumb/section/hero by resolution). The BUILD-PLAYBOOK asset check, as a brick. | raw files -> `technical{}` per image |
| 3 | **relevance-bucket** | agent (cheap) | View each image, bucket it: `product_shot \| brand_asset \| lifestyle \| irrelevant \| sensitive`. The "is this even a shot of THIS product" gate. (Even an all-product folder needs product-shot vs logo vs lifestyle split.) | image -> `relevance` |
| 4 | **role-classify** | agent | View each kept product shot, emit the full claim-tagged record (schema below). **The core judgment.** Fan out one subagent per image, in parallel. | image + product fact sheet + vocab -> classification record |
| 5 | **map + rank** | script | Map claim-tags -> eligible LP sections via the section table; per section, rank candidates by demonstration strength x technical fit; flag sections with **no strong image** (a gap to shoot/source). | records -> ranked candidates per section + gap list |
| 6 | **pick gate** | 🧑 human | Approve the per-section picks. Literally "we discuss what pics go in it." | ranked -> chosen set |
| 7 | **emit manifest** | script | Write `IMAGES.md` + `images.json`: section -> role -> file -> (empty CDN slot). | picks -> manifest |
| 8 | **upload + url-backfill** | script | Push picks to Shopify Files (runbook Phase D.0), capture CDN URLs, fill the manifest. | picks -> manifest with live CDN URLs |

Bricks 3 and 4 are where vision lives. Everything else is deterministic; the one human judgment is the pick.

---

## The classification record (brick 4 output — one per image)

```json
{
  "id": "arduview-0007",
  "source": { "drive_id": "1...", "filename": "Gemini_..._5lcqvl.png", "local_path": "assets/raw/arduview-0007.png" },

  "// agent-filled below //": "",
  "relevance": "product_shot",
  "shot_type": "detail_macro",
  "in_frame": "device face-on, screen off, transparent shell; internal PCB, chips and ribbon cable visible through the body; black studio background",
  "display_state": "off",                       // off | on_glow | on_legible  (special-cases the see-through OLED claim)

  "demonstrates": [                             // THE primary field. Claim must come from the product's claim list. Tag only what the pixels show.
    { "claim": "transparency_internals_visible", "strength": "strong",   "evidence": "PCB traces, chips and ribbon clearly read through the shell" },
    { "claim": "build_material_quality",         "strength": "partial",  "evidence": "clean resin edges, no seams visible" }
  ],

  "composition": { "background": "studio_black", "text_overlay": false, "watermark": false, "orientation": "landscape", "crop": "full_device" },
  "tone": ["premium", "techy"],                 // editorial read, for tone-matching a section
  "disqualifiers": [],                          // text_overlay | watermark | low_res | wrong_product | competitor_ad | sensitive  (non-empty = exclude or downgrade)
  "caption_hint": "See straight through to the board.",   // a hook the copy agent can adapt; NOT final copy
  "selection_note": "sharpest internals shot; single best proof of genuine transparency",

  "// script-filled below //": "",
  "technical": { "w": 4000, "h": 3000, "aspect": "4:3", "format": "png", "bytes": 9749066, "dup_of": null, "min_safe_use": "hero" },
  "eligible_sections": ["feature_transparency", "hero"]    // derived from demonstrates[] via the section table, NOT decided by the agent
}
```

**Field ownership.** The agent owns the *read* (`relevance`, `shot_type`, `in_frame`, `display_state`,
`demonstrates[]`, `composition`, `tone`, `disqualifiers`, `caption_hint`, `selection_note`). The script
owns the *measurements* (`technical`) and the *routing* (`eligible_sections`, via the table). Keeping
section-assignment in a deterministic table — not in the agent's head — makes it auditable and editable
without re-running vision.

---

## How the vision subagent actually classifies (brick 4 method)

Each subagent is handed: **one image (local path), the product fact sheet, the claim list, and the
controlled vocabularies.** It does NOT get the other images and does NOT write page copy. Steps:

1. **Describe literally first (`in_frame`).** What is actually in the frame — device state, angle,
   what's visible, background, any text/people. Ground the read before interpreting it. If it's not a
   shot of this product, stop and bucket it (`relevance`) — don't invent product features to fit.

2. **Walk the claim list, not your imagination (`demonstrates[]`).** For *each* claim in the product's
   provided claim list, ask: *does this image visibly demonstrate it?* Answer with a strength and the
   pixel evidence:
   - `strong` — the claim is the **point** of the shot; a skeptic looking at this image would believe it.
   - `partial` — the claim is supported but not the focus, or shown weakly.
   - `incidental` — the thing is present in frame but the shot doesn't *sell* it.
   - (omit) — not shown. Never tag a claim the pixels don't carry.
   Multi-tag is expected; a strong hero often proves 2-3 claims at once.

3. **Special-case the load-bearing differentiator.** For Arduview the headline bet is *exotic
   see-through hardware*, and its sharpest proof is the **display lit while you see through it**. So
   `display_state` is a dedicated field: `on_legible` (pixels lit AND readable through the glass) is the
   single most valuable state for the hero and must not be flattened into a generic "screen on."
   Per-product, the fact sheet names which one or two claims are load-bearing and get this treatment.

4. **Read composition + tone** for slot fit (a busy lifestyle background disqualifies a spec callout;
   a clean studio shot is wrong for the lifestyle band).

5. **Flag disqualifiers honestly.** Text overlay / watermark / low-res / competitor-ad / wrong-product /
   sensitive. A non-empty `disqualifiers` list is the agent telling the builder "do not use this for a
   primary slot," even if the subject is right.

6. **Write `selection_note` + `caption_hint`** — one line each. The note is *why this image wins or
   loses for its best use* (e.g. "best for screen-content callout"). The caption hint is a
   seed the copy agent may rewrite — it is never shipped as-is (no LLM-authored customer copy ships
   unreviewed).

**Parallelization:** fan out brick 4 as one `agent()` per image (or small batches), same fact sheet +
vocab to each, each returns one record. Brick 5 collects and ranks. This is the "subagents that look at
the pictures" — blind to each other, identical rubric, structured return.

---

## Controlled vocabularies (the part that makes records mergeable)

**`shot_type`:** `hero` · `detail_macro` · `in_hand_scale` · `lifestyle_context` · `screen_on_ui` ·
`turntable_frame` (from video) · `packaging_unboxing` · `group_collection` · `diagram_annotated`.

**`claim` list (per product — Arduview worked instance, from the product description + pre-research plan):**
- `transparency_internals_visible` — see the PCB/board through shell+display (the differentiator)
- `see_through_display_on` — game pixels lit on the transparent pane (load-bearing; pairs with `display_state`)
- `pocket_scale` — size in hand / next to a common object (~50 g, 85x43x13 mm; EDC territory)
- `retro_gaming` — classic D-pad + A/B, pixel game on screen (nostalgia territory)
- `collectible_object` — shown as a desirable object to own/display (aesthetic / object-as-statement territory)
- `hackable_maker` — USB-C data / Arduino-flashable / open framing (maker niche — only if the shot actually signals it)
- `build_material_quality` — resin finish, clean edges, premium feel
- `whats_in_box` — unit + cable + packaging (offer completeness)

> The claim list is a **per-launch input**, like `LAUNCH-INPUTS.md`. It is derived from the product's
> real attributes and its candidate differentiators/territories — NOT invented by the classifier. Swap
> the list per product; the machinery above is product-agnostic.

**Section table (claim -> eligible LP sections; brick 5 uses this, editable without re-running vision):**

| Claim | Primary section(s) | Also eligible |
|---|---|---|
| `see_through_display_on` (display_state=on_legible) | `hero` | `feature_transparency` |
| `transparency_internals_visible` | `feature_transparency` | `hero`, `specs` |
| `pocket_scale` | `feature_scale` | `lifestyle`, `hero` |
| `retro_gaming` | `feature_games` | `lifestyle`, `social_proof` |
| `collectible_object` | `lifestyle`, `final_cta` | `hero` |
| `hackable_maker` | `feature_maker` | `specs` |
| `build_material_quality` | `feature_transparency` | `specs` |
| `whats_in_box` | `offer` | `final_cta` |

---

## I/O contract

**Inputs (per launch):** Drive folder id (the product image set); product fact sheet + claim list;
the LP section list for this funnel (defaults above; ultimately comes from the deep-analysis structure
lens / funnel container).

**Outputs:** `assets/raw/*` (local), `images.json` (all records, machine-readable, queryable by claim),
`IMAGES.md` (human/builder-readable, section -> role -> file, CDN slots), and a **gap list** of sections
with no strong image (tells you what to shoot or source before the LP can be built).

**Why this is useful to the builder (the whole point):** the builder queries `images.json` by the claim
it is installing, filtered to `strength: strong` and `disqualifiers: []`, ranked by technical fit — and
gets the image that actually proves that claim, with a selection note explaining why and a caption seed
to start from. Section is just the fast path; the claim tags are the real index.

---

---

# Video Classifier — the temporal extension

Same machine, one more dimension. A still proves a claim in one frame; a video proves it **through
motion** — rotating the shell proves the transparency is real glass and not a printed photo, a lit
screen refreshing proves the display actually works, a hand opening/pressing proves usability. The
classifier's job for video is to understand *what the full clip does over time* and tell the builder
which clip to put where (and critically, which one becomes the silent autoplay **hero loop**).

## Sample at 5 fps, then montage so the agent reads the whole clip

Per your instruction: extract **5 frames per second** so nothing meaningful is missed. But a 30 s clip
at 5 fps = 150 frames, and an agent cannot read 150 separate images. So the extraction script does two
things:

1. **Sample** to `frames/<video>/f0001.jpg …` at 5 fps (ffmpeg `-vf fps=5`).
2. **Montage** those frames into **timestamp-labeled contact sheets** — e.g. a 5x6 grid = 30 frames =
   6 seconds per sheet, each cell stamped with its `mm:ss.ff`. (ffmpeg `tile=5x6` + `drawtext`.)

The vision agent then reads the **sheets in order** — six seconds of real motion per image it opens — and
reconstructs the full timeline. 5 fps is preserved (every cell is a real sampled frame); the agent just
consumes them 30-at-a-time. A 30 s clip becomes 5 sheets, not 150 reads.

## The two extra bricks (slot into the same string)

| # | Brick | Type | Job |
|---|-------|------|-----|
| 2v | **probe-video** | script | duration, resolution, fps, codec, `has_audio`, aspect, bytes. (The 198 MB Arduview screen-recording is why this runs first — flag oversize before sampling.) |
| 3v | **sample + montage** | script | 5 fps -> `frames/`; tile into timestamp-labeled contact sheets `sheets/<video>-s01.jpg …`. |

Bricks 1 (fetch), 6 (pick gate), 7 (emit), 8 (upload) are shared with the image string. Brick 4 is
replaced by **comprehend-video** below; brick 5's map+rank gains video-only slots (`hero_loop`,
`feature_demo`).

## How the vision subagent comprehends a video (brick 4v method)

Handed: the ordered contact sheets for **one** video, the product fact sheet, claim list, vocab. It does
NOT get other videos and does NOT write copy. Steps:

1. **Read the sheets in order and build a `segments[]` timeline.** For each beat, record the timestamp
   range and what happens: `0:00–0:02 device closed, face-on, screen off` -> `0:02–0:05 rotates,
   internals visible through shell` -> `0:05–0:09 screen lights, pixel game legible`. This is the thing
   a still cannot give you and the whole reason for 5 fps.
2. **Tag `demonstrates[]` with WHEN + how motion helps.** Same claim list as images, but each tag carries
   the timestamp where it's proven and a `motion_value` note — *what the movement proves that a photo
   can't* (e.g. `see_through_display_on @0:05 strong — rotation while lit rules out a faked screen`).
3. **Judge `best_use`** — `hero_loop` (clean, silent-readable, loops without a jarring cut) vs
   `feature_demo` (shows one capability, may need context) vs `full_explainer` (needs audio/captions).
   The runbook embeds the hero as `<video autoplay muted loop playsinline poster=…>`, so a hero-loop
   candidate **must read with sound off** and **loop cleanly** — flag `loop_safe` and `needs_audio`.
4. **Pick a `poster_frame`** — the single timestamp whose still best sells the product before play
   (this becomes the `poster=` image and the fallback).
5. **Flag disqualifiers over time** — text overlay, watermark, UI chrome (a raw screen-recording with a
   status bar is not hero-clean), dead air, wrong product.

## Video record (brick 4v output)

```json
{
  "id": "arduview-vid-01",
  "source": { "drive_id": "1oVFo2…", "filename": "ScreenRecording_03-07.MP4", "local_path": "assets/raw/arduview-vid-01.mp4" },
  "probe": { "duration_s": 22.4, "w": 1080, "h": 1920, "fps": 30, "has_audio": false, "aspect": "9:16", "bytes": 198253962 },
  "sampling": { "fps_sampled": 5, "frame_count": 112, "sheets": 4 },

  "segments": [
    { "t": "0:00-0:03", "beat": "device closed, face-on, screen off, hand holding" },
    { "t": "0:03-0:08", "beat": "slow rotate; PCB and ribbon visible through transparent shell" },
    { "t": "0:08-0:15", "beat": "screen lights; pixel game running, legible through the glass" },
    { "t": "0:15-0:22", "beat": "thumb works the D-pad; gameplay responds" }
  ],
  "demonstrates": [
    { "claim": "transparency_internals_visible", "at": "0:03-0:08", "strength": "strong", "motion_value": "rotation proves real glass, not a printed photo" },
    { "claim": "see_through_display_on",          "at": "0:08-0:15", "strength": "strong", "motion_value": "live pixels refreshing rule out a faked screen" },
    { "claim": "retro_gaming",                    "at": "0:15-0:22", "strength": "partial", "motion_value": "input->response shows it actually plays" }
  ],
  "best_use": "hero_loop",
  "loop_safe": true,
  "needs_audio": false,
  "poster_frame": "0:09",
  "tone": ["techy", "playful"],
  "disqualifiers": [],
  "selection_note": "the single clip that proves transparency AND a working see-through screen in one motion; strongest hero candidate",

  "// script-filled //": "",
  "eligible_slots": ["hero_loop", "feature_transparency"]
}
```

## Video manifest + the CDN gotcha

Brick 7 writes `VIDEOS.md` alongside `IMAGES.md`. **Carry the runbook's warning forward:** Shopify video
CDN URLs are **hashed and unpredictable** (`cdn.shopify.com/videos/c/o/v/<hash>.mp4`) — unlike images you
cannot construct them from the filename. So brick 8 must **grab each exact URL after upload** and also
upload the chosen `poster_frame` as a normal image (predictable URL) for the `poster=` attribute.

The builder consumes `videos.json` the same way as images: query by claim + `best_use: hero_loop` +
`loop_safe: true` + `needs_audio: false` to get the autoplay hero, or by `feature_demo` for a section
embed — each with its segment timeline, poster frame, and selection note.

---

## Open items

- **Access:** the real Arduview set (Louis Huang's Drive folder) must be shared to the connected Google
  account before bricks 3-4 can run on it. The Drive MCP is authed to one account; cross-account folders
  return "not found."
- **Video frames:** `turntable_frame` requires a frame-extraction step (script: ffmpeg sample every N
  frames) before the vision agent sees stills. Defer until a product video is in scope.
- **Section list source:** hardcoded defaults here; wire to the funnel container once M2's deep-analysis
  -> test-design path produces it.
