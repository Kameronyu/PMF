---
status: draft
role: Phase B — the production & launch half of the pipeline (post-strategy), in PART0 format. The inter-pipeline SEAMS are now settled (operator, this session); a few internal items stay open. NOT build-from yet. Each step here is itself a full sub-workflow to be built (operator holds raw material).
read-with:
  - architecture/PART0--pipeline-flow.md
  - architecture/PART3--architecture-design.md
  - SHELL-BUILD-SPEC.md
supersedes: []
---

> **What this is:** a **draft** of the production/launch phase the existing docs don't cover. The **seams between the sub-pipelines are settled** (operator-confirmed this session); what's still open is each step's *internal* decomposition + the offer layer. **Status: DRAFT — do not build from until the ○ items close and it's threaded into PART0/PART3.** Glyphs: ● operator-settled · ◆ design call · ○ open slot. *(Numbering note: "PART4" is the review-propagation audit under `reference/reviews/`; this is the next architecture part.)*

# PART 5 — Production & Launch Phase (Phase B)

## Framing

The documented pipeline (Steps 0–10) is **Phase A — Research → Strategy → Copy.** What the operator described is **Phase B — Branding → Production → Launch**: turning the strategy + copy into real branded assets (a product video, HTML pages) and pushing them live to Shopify.

Three things shape how this is documented:

1. **Each step here is a full sub-workflow, not a single prompt** — the visual-branding analyzer, the video strategist, the video editor, the HTML implementer, the Shopify implementer are each their own multi-step skill to build. Per the artifact-grain principle (`SHELL-BUILD-SPEC §2`), **the architecture pins only the seams between them**; each step's internals are a deferred per-step build, fed by the **raw material the operator already holds** (see §Raw material).
2. **The Funnel Architect (Step 7) is the back-half hub, and it decomposes.** It no longer just briefs the copy — it produces four outputs feeding four different consumers (see §Architect-as-hub). That is *why* the operator flagged it needs to break into more steps.
3. **Two media-handling rules carry the whole phase:** every asset has an `asset_id` + a description + a `file_path`; *descriptions* flow through the pipeline in-context, *bytes* are pulled by id only when a builder needs them (the existing "bytes never in context" doctrine, `PART3 §6.10`).

## The settled back-half seams (producer → artifact → consumer)

This table is the part that's **locked** — the inter-pipeline wiring:

| Producer | Artifact | Consumer(s) |
|---|---|---|
| **Asset Describe** (hub) | per-asset `{asset_id, description, file_path}` | Visual-Branding (product visual desc) · Video Strategist (descriptions) · Video Builder (bytes by id) · HTML Implementer (specific images by id) |
| **Visual-Branding pipeline** | `branding-brief` (one, shared) | Video Builder · HTML Implementer |
| **Funnel Architect** → belief/funnel | funnel/belief design brief | Copywriter |
| **Funnel Architect** → angle | angle / what-to-show | Video Strategist |
| **Funnel Architect** → layout | page layout + image placement | HTML Implementer |
| **Funnel Architect** → price | price / offer | Shopify Implementer |
| **Video Strategist** | `product-video-brief` (clip plan / what to show) | Video Builder |
| **Video Builder** | `product-video` | HTML Implementer (hero embed) **+** ad / standalone asset (terminal) |
| **Copywriter** (Step 8) | LP + PDP copy | HTML Implementer |
| **HTML Implementer** | `html-pages` | Shopify Implementer |
| **Shopify Implementer** | `live-pages` | terminal / operator |

## The flow (ingests → does → emits → feeds)

*Each step is **[sub-workflow]** = a full skill to build; its internals are ○.*

### Asset Describe & Classify  [sub-workflow] · the upstream HUB · = relocation of Step 9
- **Ingests:** the operator's **file of product photos + videos** ● (○ format/manifest).
- **Does:** describes/classifies each asset — what it is, what's in the video — and assigns each an `asset_id`.
- **Emits:** per-asset record `{asset_id, description, file_path}` ● (◆ also carries claim-mappings to `CLAIM-LIST.json` — i.e. this is the existing Step-9 asset-classify, expanded with descriptions). Bytes never in context.
- **Feeds:** Visual-Branding (the product's *visual description*), Video Strategist (asset descriptions), Video Builder (bytes by id), HTML Implementer (specific images by id).
- **⚠ Re-sequencing:** the existing Step 9 was documented as near-terminal; here it is an **upstream hub**. Structural change to the 0–10 order.

### Visual-Branding pipeline  [sub-workflow] · attaches any time after Step 5 · (merges the competitor visual study + the branding brief)
- **Ingests:** the **3 most successful direct competitors in the exact chosen market** ● (it **self-captures** their visuals — own fetch, no ripple back into Step 1 collect; ○ producer of "the top-3 in the chosen market" — likely from market-selection / space-map) + the **product info** (bet-brief/intake) + the **product's visual description** (from Asset Describe).
- **Does:** analyzes the top competitors' visual branding + pages, and fuses with the product's look into the brief.
- **Emits:** `branding-brief` ● — **one brief, shared by both the Video Builder and the HTML Implementer** (○ field schema). It is styling/look ("the vibes"), not page structure (structure comes from the Architect).
- **Feeds:** Video Builder + HTML Implementer.

### Funnel Architect (decomposes — see §Architect-as-hub)  [sub-workflow]
- Produces the four outputs in the seam table. **Internal decomposition ○** (operator's call; hypothesis below).

### Video Strategist  [sub-workflow] · strategy-aware
- **Ingests:** the Architect's **angle / what-to-show** brief ● + the **asset descriptions** (Asset Describe) ●.
- **Does:** real strategy work — decides what the video should show and which clips get strung together to sell the angle.
- **Emits:** `product-video-brief` ○ (clip plan / shot list / which assets / pacing).
- **Feeds:** Video Builder.

### Video Builder / Editor  [sub-workflow]
- **Ingests:** `product-video-brief` (Strategist) + `branding-brief` (Visual-Branding) + the **asset media bytes** (pulled by `asset_id`/`file_path`) ●.
- **Does:** edits the product video.
- **Emits:** `product-video` ● → **embedded as the funnel's hero video (HTML Implementer)** *and* **reused as an ad / standalone asset** (terminal). (○ specs / count.)

### HTML Page Implementer  [sub-workflow] · DUMB executor (not marketing-educated)
- **Ingests:** the **LP + PDP copy** (Step 8) + the **`product-video`** + the **specific images** (by `asset_id`) + the Architect's **page layout + image placement** ● + the **`branding-brief`** ("what it should look like / the vibes") ●.
- **Does:** implements exactly what it's handed into real, nice HTML — no marketing judgment.
- **Emits:** `html-pages` ○ (page set / format).
- **Feeds:** Shopify Implementer.

### Shopify Implementer  [sub-workflow] · PARKED — low priority, operator-handheld
- **Ingests:** `html-pages` + the **price** (from the Architect) ● (○ + the rest of the product/offer data — variants/SKU/inventory).
- **Does:** uploads the product + price and pushes the pages live.
- **Emits:** `live-pages` ○ (receipt). **★ launch gate / manual** — publishing is irreversible; the operator will handhold this step for now, so it does not need to be perfect or fully automated for the MVP.

## Architect-as-hub (why Step 7 decomposes)

The Funnel Architect now wears four hats: **strategy** (belief chain / funnel → copy), **video direction** (angle / what-to-show → video strategist), **page architecture** (layout + image placement → HTML implementer), and **pricing** (price → Shopify). That is why a single agent is wrong. **Hypothesis from the seams (◆, operator to confirm):** split into a **funnel/belief strategist** (angle + belief chain) → a **page architect** (layout + image placement) → an **offer/pricing** step (the out-of-chain offer layer). Resolved in the architect build.

## What's still open (small now — the seams are settled)

1. **Architect internal decomposition** ○ — how Step 7 splits (hypothesis above); its own sub-design.
2. **Offer / price layer** ○ — the Architect produces the price; the broader offer data (SKU/variants/deposit/$299 anchor) is the out-of-chain layer (`OPEN-DECISIONS B3/C1`). **Parked** — operator handholds Shopify.
3. **Asset-classify dual output** ◆ — confirm it emits descriptions *and* the CLAIM-LIST mappings (one step, two outputs).
4. **A few output schemas** ○ — `product-video-brief`, `branding-brief` fields, `html-pages` format. These are *internal contract* details for each sub-workflow's build, not inter-pipeline seams.
5. **Re-review scope** ○ — does Step 10 extend to the produced video + pages + live store?
6. **Top-3 competitor producer** ○ — which artifact names "the 3 top direct competitors in the chosen market" (market-selection / space-map).

## Raw material / external inputs

The operator **already holds raw material** for several of these sub-workflows (the analyzer, video strategist, video editor, etc.). Each Phase-B build consumes its raw material the way the front-half rebuilds consume the as-ran skills mapped in `reference/EXTERNAL-INPUTS-MAP.md`. Some Phase-B glue **already exists** in `build-base/engine/`: `integrations/shopify/` (deploy + asset upload), `integrations/cloudflare/` + `integrations/klaviyo/`, and `bricks/asset/` (`frame-grab`, `probe_video`, `sample_montage`, `video-assemble`) + the `asset-*.js` bricks — raw material for the **Shopify implementer, video builder, and asset-describe**. **Action ○:** the operator points at where each step's raw material lives; then it's staged + catalogued as a Phase-B external-inputs map (one row per step).

## How this threads into the existing docs (the follow-on, after §open closes)

New **PART0** step blocks · insertion into **PART3 §1.5/§1.6** order + the Phase A/B boundary + re-sequence asset-classify out of the near-terminal slot · new **§5.2** consumption rows (the seam table above) · a **§6.x** card per Phase-B step (with **Internal sub-workflow ○**) · new **§9** seams (the branding-brief + the Architect's four outputs) · **PART1** annotations capturing the operator's rules · **PART2** Jobs per Phase-B build + the Phase-B external-inputs map · new **briefs/** · the **agent maps** gain the Phase-B nodes/edges · **OPEN-DECISIONS** gets the offer layer + re-review scope.

## Relationship to the shell handoff

Phase B does **not** block the front-half shell. The shell wires at the artifact grain, so adding Phase B later is **append-only** (new manifests + artifact slots + `pipeline.yaml` rows, no rewiring). The shell build targets **Steps 0–10 only**; Phase B is a **documented, deferred extension.** `STATE-OF-PROJECT.md`, `INDEX.md`, and `HANDOFF-context-engineering.md` reference this doc so the shell builder knows 0–10 isn't the whole system.
