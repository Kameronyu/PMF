# Arduview Run — Chronological Inventory

_Compiled 2026-06-04. Sources: git log, git show --stat, top-level file skims._
_Note: most runs/arduview/*.md are UNTRACKED (never committed), so dates are inferred from the commit
that first touched related planning/tooling, or from file content cross-refs._

---

## 1. Chronological Step Table

| # | Step | Approx date | Input docs read | Output docs produced | What it did |
|---|------|-------------|-----------------|----------------------|-------------|
| 0 | **Manual pre-run prep** (product context + market framing) | 2026-05-15 to 2026-06-01 | `Arduview_bom.xlsx`, `Arduview_Product_Description.docx` (external), eink corpus imported | `runs/arduview/pre-research-plan.md`, `runs/eink-tablets/` corpus | Operator locked the product bet (transparent pocket console), wrote the run context doc, imported prior eink-market ad-library + corpus data |
| 1 | **Light-pass skill + tooling build** (M1-S1 / Phase 01) | 2026-06-03 (commits 074d4fe → 317b490) | `pre-research-plan.md`, `prompts/step1-light-pass.md`, `definitions.md`, existing eink corpus | `tools/fetch.js`, `tools/clean.js`, `tools/dedupe.js`, `tools/revenue-est.js`, `tools/adlib-one.js`, `brands.json`, `corpus/`, `runs/arduview/space-map.json`, `01-DEBUG-RUN-NOTES.md` | Built the deterministic pipeline (fetch/clean/dedupe/adlib/revenue-est), ran it end-to-end on 20 brands; produced space-map.json (5 transformations, 4 niches, 5 angles, 5 bet_types); CRITICAL: demand_trend 0% fill-rate (Trends deferred load — durability signal disabled) |
| 2 | **Market-selection gate — first run (zero-DR)** | 2026-06-03 (commit 4b6fd12) | `space-map.json`, market-selection SKILL.md (initial) | `runs/arduview/market-selection.md` (v1, superseded) | Ran market-selection skill; no DR files read, no corpus dumps read; mechanisms-in-play derived from `[INFERENCE]` clusters — flagged invalid in RERUN-BRIEF |
| 3 | **Market-selection gate — DR-grounded re-run** | 2026-06-03 (commit 3e56794) | `space-map.json`, DR bundle `_dr-context.generated.md` (5/5 files), `pre-research-plan.md` | `runs/arduview/market-selection.md` (v2, current), `runs/arduview/RERUN-BRIEF.md`, `runs/arduview/STRATEGY-DISCUSS-HANDOFF.md` | Re-ran with real DR grounding; mechanisms-in-play now read from OBSERVED space-map data; gate verdicts provisional (demand_trend still unknown for all 20 brands) |
| 4 | **Deep competitive analysis + funnel collection** (M1-S3 / Phase 03) | 2026-06-03 (commits ebc7b28 → 4c0d73b) | `market-selection.md`, `space-map.json`, crowdfunding URLs for gameshell/playdate/pocket-operator/divoom, brand refs | `runs/arduview/crowdfunding/gameshell*/raw/` (4 variants, 2026-06-04 timestamps), `funnels/` (4 JSON), `funnels-clean/` (4 JSON), `funnels-scored/` (4 JSON), `funnels-assembled/` (4 JSON), `funnels-context/` (4 .md ~930-1840 lines each), `funnels-analyzer-out/` (4 beliefs JSON), `brand-refs/*.md` (nothing/playdate/teenage-engineering) | Built adlib-one binding spine (D-06), funnel-assemble, funnel-clean, funnel-score, crowdfund-fetch Currency-B, validate-analyzer, inject-dr, funnel-store; ran full pipeline on 4 competitors; produced belief_records per brand; code-reviewed and bug-fixed (6 IN + 4 WR fixes) |
| 5 | **RAG engine build** | 2026-06-03 (commit 52c8b7c) | `funnels-analyzer-out/` beliefs, DR files | `tools/rag/embed.js`, `tools/rag/vectorize.js`, `tools/rag/query.js`, Voyage fixture index | Built Voyage-powered funnel-RAG engine to query belief_records by source_type/routing_flag |
| 6 | **Funnel-deep-pass skill + context assembler** | 2026-06-03 (commits ea3fd43, ca23821) | `funnels/` data, DR files | `.claude/skills/funnel-deep-pass/SKILL.md`, `tools/funnel-analyzer-context.js` | Consolidated funnel deep-pass workflow into orchestrator skill; built deterministic analyzer-context injector (funnel-analyzer-context.js) |
| 7 | **Funnel Architect + Copywriter prep** (Phase 15) | 2026-06-04 (commits d91d278 → 904b0d6) | `funnels/`, `funnels-analyzer-out/`, `_tally.json`, DR bundle, RAG index | `tools/inject-funnel-architect-dr.js`, `tools/inject-copywriter-dr.js`, architect DR bundle, copywriter DR bundle, `funnel-claim-tally.js`, Phase 15 plans | Built DR bundlers for architect + copywriter skills; added belief_kind as first-class field; added claim-tally script; added RAG source-type filter |
| 8 | **Funnel Architect run** | 2026-06-04 (untracked session) | DR bundle, `funnels/` store, `_tally.json`, inkleaf funnel teardown, `ASSET-HANDOFF.md` (if it existed then) | `runs/arduview/FUNNEL-DESIGN.md` (258 lines), `runs/arduview/15-DEBUG-funnel-architect.md` (107 lines) | `/funnel-architect` skill produced belief chain + funnel structure + copy brief v1; 15-DEBUG logged 8 macro-layer gaps (missing validation economics, VOC, awareness read, per-comp funnel structure) |
| 9 | **Copywriter run** | 2026-06-04 (untracked session) | `FUNNEL-DESIGN.md`, copywriter DR bundle (Spencer/Carl/Mark) | `runs/arduview/COPY-DRAFT.md` (206 lines) | Wrote LP + deposit page copy off the design brief; honest ceiling flagged (no VOC, so no Spencer Command+F check; founder section bracketed) |
| 10 | **Asset classify — proof + video analysis** | 2026-06-04 (untracked session, before Phase 16 tooling) | Raw photos from `Downloads/arduview visuals/`, 20 raw video files | `runs/arduview/_asset-classify-proof.md` (83 lines), `runs/arduview/asset-classify/VIDEO-ANALYSIS.md` (748 lines), `asset-classify/records/arduview-0001..0005.json`, `asset-classify/records/arduview-vid-01..20.json`, `asset-classify/sheets/` (contact sheet JPGs) | Agent classified 5 images + 20 videos; produced per-asset JSON records with claim tags, shot types, beat sheets, timestamps |
| 11 | **Asset-classify ASSET-HANDOFF + IMAGE-PLAN** | 2026-06-04 (untracked session) | `VIDEO-ANALYSIS.md`, `records/`, `FUNNEL-DESIGN.md` | `runs/arduview/asset-classify/ASSET-HANDOFF.md` (73 lines), `runs/arduview/asset-classify/IMAGE-PLAN.md` (154 lines) | Produced handoff doc for funnel architect (image job definitions + frame picks); IMAGE-PLAN specified 7 final image slots with exact video-id@timestamp citations |
| 12 | **Frame grab + site image extraction** | 2026-06-04 (untracked, tooling run) | `IMAGE-PLAN.md`, raw video files | `asset-classify/frame-grab.json`, `asset-classify/frame-grab-fix.json`, `asset-classify/images-from-frames/` (8 JPGs), `asset-classify/hero-edl.json`, `asset-classify/hero-edl-9x16.json` | Deterministic frame-grab.py extracted 4K stills at specified timestamps; hero EDLs authored for video cuts |
| 13 | **Hero video cut + captions** | 2026-06-04 (untracked session) | `hero-edl.json`, `hero-edl-9x16.json`, raw clips, `FUNNEL-DESIGN.md` | `asset-classify/cuts/arduview-hero-16x9.mp4`, `asset-classify/cuts/arduview-hero-9x16.mp4`, `asset-classify/cuts/arduview-hero-16x9-captioned.mp4`, `asset-classify/_captions.ass`, `asset-classify/_caption_gradient.png/.py`, `runs/arduview/HERO-VIDEO.md` | Cut hero loop (16:9 12.6s + 9:16 13.7s), authored caption spec, burned captions onto captioned cut, wrote HERO-VIDEO.md spec for editor |
| 14 | **CAPTION-HANDOFF** | 2026-06-04 (untracked session) | `HERO-VIDEO.md`, `asset-classify/cuts/`, `IMAGE-PLAN.md` | `runs/arduview/asset-classify/CAPTION-HANDOFF.md` (69 lines) | Wrote caption delivery doc for the editor |
| 15 | **Site LP build** (manual reference build) | 2026-06-04 (untracked session) | `FUNNEL-DESIGN.md`, `COPY-DRAFT.md`, `image-from-frames/`, `asset-classify/cuts/`, inkleaf launch reference | `runs/arduview/site/` (index.html, deposit.html, styles.css, script.js, STYLE-LOCK.md, assets/img/* + assets/video/hero.mp4), `runs/arduview/BUILD-FEEDBACK.md` (122 lines), `runs/arduview/STRATEGY-DISCUSS-HANDOFF.md` (128 lines) | Built the LP + deposit page manually as a reference implementation; locked "Glasshouse" design system; deployed to surge (arduview-see-through.surge.sh); BUILD-FEEDBACK captures visual contract + builder restraint rules for Phase 17 |
| 16 | **Asset classifier tooling build** (Phase 16, bricks 1-8) | 2026-06-04 (commits e9dd316 → 2838049) | `asset-classify/records/`, `asset-classify/VIDEO-ANALYSIS.md`, `space-map.json`, `FUNNEL-DESIGN.md` | `tools/asset/` (asset-fetch.js, probe.py, probe_video.py, sample_montage.py, validate-asset-record.js, asset-map-rank.js, asset-emit.js, asset-upload.js), `asset-classify/CLAIM-LIST.json`, `asset-classify/ranked.json`, `asset-classify/images.json`, `asset-classify/videos.json`, `asset-classify/IMAGES.md`, `asset-classify/VIDEOS.md`, Phase 16 plans | Built the full deterministic asset pipeline as reusable bricks; produced ranked manifest (images.json / videos.json) from the already-classified arduview assets |
| 17 | **Phase 17 LP Builder — discuss-phase only** | 2026-06-04 (untracked) | `BUILD-FEEDBACK.md`, `COPY-DRAFT.md`, `STYLE-LOCK.md` | `.planning/phases/17-lp-builder-.../17-QUESTIONS.html`, `17-QUESTIONS.json` | discuss-phase generated questions for LP builder; context gathering phase only; no plans or execution yet |

---

## 2. Doc Inventory

### runs/arduview/ (top-level)

| File | Lines | Step # | Tag |
|------|-------|--------|-----|
| pre-research-plan.md | 112 | 0 | handoff |
| space-map.json | 273 | 1 | output-data |
| market-selection.md | 287 | 3 | output-data |
| RERUN-BRIEF.md | 72 | 3 | handoff |
| STRATEGY-DISCUSS-HANDOFF.md | 128 | 3 | handoff |
| FUNNEL-DESIGN.md | 258 | 8 | output-data |
| 15-DEBUG-funnel-architect.md | 107 | 8 | retro |
| COPY-DRAFT.md | 206 | 9 | output-data |
| HERO-VIDEO.md | 52 | 13 | handoff |
| BUILD-FEEDBACK.md | 122 | 15 | handoff |
| _asset-classify-proof.md | 83 | 10 | scratch |
| _mechanisms-in-play.agent.json | (small) | 2/3 | scratch |
| RERUN-BRIEF.md | 72 | 3 | handoff |

### runs/arduview/asset-classify/

| File / Group | Lines | Step # | Tag |
|------|-------|--------|-----|
| VIDEO-ANALYSIS.md | 748 | 10 | output-data |
| ASSET-HANDOFF.md | 73 | 11 | handoff |
| IMAGE-PLAN.md | 154 | 11 | output-data |
| IMAGES.md | 144 | 16 | output-data |
| VIDEOS.md | 93 | 16 | output-data |
| CAPTION-HANDOFF.md | 69 | 14 | handoff |
| images.json | 403 | 16 | output-data |
| videos.json | 2166 | 16 | output-data |
| ranked.json | 699 | 16 | output-data |
| CLAIM-LIST.json | 14 | 16 | output-data |
| frame-grab.json | 14 | 12 | output-data |
| frame-grab-fix.json | 9 | 12 | output-data |
| hero-edl.json | 14 | 12/13 | output-data |
| hero-edl-9x16.json | 14 | 12/13 | output-data |
| records/arduview-0001..0005.json | ~5 each | 10 | output-data |
| records/arduview-vid-01..20.json | ~20 each | 10 | output-data |
| sheets/*.jpg (126 images) | binary | 10 | output-data |
| images-from-frames/*.jpg (8) | binary | 12 | output-data |
| cuts/arduview-hero-16x9.mp4 | binary | 13 | output-data |
| cuts/arduview-hero-9x16.mp4 | binary | 13 | output-data |
| cuts/arduview-hero-16x9-captioned.mp4 | binary | 13 | output-data |
| _asset-emit-log.txt | 5 | 16 | scratch |
| _asset-map-rank-log.txt | 2 | 16 | scratch |
| _caption_gradient.png/.py | binary/small | 13 | tooling |
| _captions.ass | small | 13 | output-data |
| _fonts/IBMPlexMono-Medium.ttf | binary | 13 | tooling |

### runs/arduview/funnels/ and subdirs

| Dir / File | Lines | Step # | Tag |
|------|-------|--------|-----|
| funnels/_index.json | 45867 | 4 | output-data |
| funnels/_tally.json | 434 | 7 | output-data |
| funnels/*.json (4 brands) | 268-388 each | 4 | output-data |
| funnels-clean/*.json (4) | 9-11 each | 4 | output-data |
| funnels-scored/*.json (4) | 18-32 each | 4 | output-data |
| funnels-assembled/*.json (4) | 11-18 each | 4 | output-data |
| funnels-context/*.md (4) | 930-1840 each | 4 | output-data |
| funnels-analyzer-out/*.json (4) | 155-218 each | 4 | output-data |

### runs/arduview/crowdfunding/

| Dir | Lines (txt) | Step # | Tag |
|------|-------|--------|-----|
| gameshell/raw/ (html+txt+png+stats) | 10 txt | 4 | output-data |
| gameshell-kbf/raw/ | 10 txt | 4 | output-data |
| gameshell-wb/raw/ | ~10 txt | 4 | output-data |
| gameshell-wb2/raw/ | ~10 txt | 4 | output-data |

### runs/arduview/brand-refs/

| File | Lines | Step # | Tag |
|------|-------|--------|-----|
| nothing.md | 368 | 4 | output-data |
| playdate.md | 533 | 4 | output-data |
| teenage-engineering.md | 474 | 4 | output-data |

### runs/arduview/site/

| File | Tag |
|------|-----|
| index.html, deposit.html, styles.css, script.js | output-data |
| STYLE-LOCK.md | handoff |
| assets/img/*.jpg (8), assets/img/kickstarter.png | output-data |
| assets/video/hero.mp4 | output-data |

### runs/arduview/_tooling/

| File | Tag |
|------|-----|
| README-ops.md | tooling |
| drive.cjs, surge_drive.py, win-chrome-forwarder.py | tooling |

---

## 3. Observations

### 3.1 Market-selection ran twice — first run is effectively orphaned

`market-selection.md` was overwritten in-place by the DR-grounded re-run (commit 3e56794). The first
run (commit 4b6fd12, executor `ac45de593dcd40346`) ran with zero DR grounding and derived
mechanisms-in-play from corpus `[INFERENCE]` clusters. RERUN-BRIEF.md documents the failure mode.
The old output is gone; no archived v1 exists. Any downstream reader sees only the v2 gate record,
which is correctly labelled "DR-grounded re-run."

### 3.2 Funnel architect ran before the asset pipeline existed

ASSET-HANDOFF.md says "you define the image jobs, then choose the frames" — but the funnel architect
(step 8) ran and produced FUNNEL-DESIGN.md before VIDEO-ANALYSIS.md / ASSET-HANDOFF.md existed.
FUNNEL-DESIGN.md v2 note says it was "revised after a copywriting-lens adversarial review," implying
a second pass post-asset-classify. The exact sequencing of the asset-classify agent pass (step 10)
relative to the funnel architect revision is ambiguous — both are untracked and produced on the same
day (2026-06-04).

### 3.3 FUNNEL-DESIGN.md is v2 but v1 is unrecoverable

FUNNEL-DESIGN.md header says "v2 — revised after a copywriting-lens adversarial review." There is no
v1 archived anywhere. The revision was done in-place. If the v1 belief-chain differs materially from
v2, that delta is lost.

### 3.4 Phase 16 tooling built AFTER the actual asset-classify run already happened

The asset classifier bricks (Phase 16: probe.py, asset-fetch.js, validate-asset-record.js,
asset-map-rank.js, asset-emit.js, asset-upload.js) were built 2026-06-04 as a formalized tool suite.
But the actual arduview asset classification (records/, sheets/, VIDEO-ANALYSIS.md) was produced
BEFORE this tooling existed — it was a manual/ad-hoc agent run (_asset-classify-proof.md confirms
this was "live validation of brick 4"). The Phase 16 tools then ran on the already-existing records to
produce the ranked manifest (images.json / videos.json). This means the classified records predate
the validation schema (validate-asset-record.js) — they were not gated by it.

### 3.5 demand_trend was 0% fill-rate throughout — never resolved

The light-pass run (step 1, commit 317b490) logged demand_trend as a CRITICAL gap: Trends data never
populated because the Trends page uses deferred XHR. market-selection.md (both v1 and v2) stamps every
cell "durability UNKNOWN." No subsequent step attempted to fix or work around this — the durability
signal is simply absent from the entire gate analysis. Phase 17 (LP Builder) is proceeding without
any durability validation.

### 3.6 funnels/_index.json is anomalously large (45867 lines)

The funnel store index is 45k lines — roughly 10x the size of any individual funnel. This suggests
it may be accumulating all raw campaign HTML/content inline rather than just indexing. Worth
inspecting before the RAG engine runs at scale.

### 3.7 Orphaned _mechanisms-in-play.agent.json

`runs/arduview/_mechanisms-in-play.agent.json` is a scratch artifact from the first (zero-DR)
market-selection run. The RERUN-BRIEF notes "BREAK 5 resolved" in commit 3e56794 (retired the
stopgap). The file is untracked, and no downstream doc references it — it is effectively dead.

### 3.8 STRATEGY-DISCUSS-HANDOFF never consumed

STRATEGY-DISCUSS-HANDOFF.md (step 3) was written to seed a "fresh session strategy discussion" with
a load order. Nothing in the subsequent commit history or untracked docs indicates that session was
run — the funnel architect appears to have run directly from the funnel store, not from a strategy
discussion session. STRATEGY-DISCUSS-HANDOFF.md may be an orphaned transition doc.
