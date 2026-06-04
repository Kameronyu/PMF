# Doc Index — runs/ · agents/ · map/

Generated: 2026-06-04. Skim-pass only (headers + opening lines).

---

## runs/arduview/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `runs/arduview/market-selection.md` | Gate 1–3 verdicts for arduview; blockers (trends fetch null, revenue null); provisional survivor cells | market-selection skill, operator | KEEP |
| `runs/arduview/pre-research-plan.md` | Per-run inputs contract for Phase 1 light-pass: bet, territory net, what is/isn't validated; product physical description | Phase 1 pipeline, operator | KEEP |
| `runs/arduview/FUNNEL-DESIGN.md` | v2 funnel design + copy brief (belief chain, angle, install spec, offer framing); primary input to copywriter | funnel-architect skill, copywriter | KEEP |
| `runs/arduview/COPY-DRAFT.md` | v1 copy (no VOC; plausible not verified); bracketed founder section; A/B hero variants; test-ready draft | LP builder (Phase 17), operator | KEEP |
| `runs/arduview/BUILD-FEEDBACK.md` | Post-mortem from manual reference LP build; builder read-set allowlist; visual contract source-of-truth for Phase 17 | Phase 17 discuss/ui-phase | KEEP |
| `runs/arduview/HERO-VIDEO.md` | Hero video spec — points to finished cut; 6 final captions to burn; older from-scratch fallback | caption editor / video agent | KEEP |
| `runs/arduview/STRATEGY-DISCUSS-HANDOFF.md` | Paste-in brief for a fresh session to discuss marketing strategy after market-selection; load order + where convo left off | operator / fresh session | SLOP (superseded by _marketing-decisions/ + BUILD-FEEDBACK; ephemeral handoff doc) |
| `runs/arduview/RERUN-BRIEF.md` | Paste-in brief for re-running market-selection gate with DR grounding; explains why first run was broken | operator / fresh session | SLOP (one-shot handoff, the re-run is done — market-selection.md is the output) |
| `runs/arduview/15-DEBUG-funnel-architect.md` | Funnel architect input-gap audit: what macro context was null, what had to be inferred, what to fix for next run | funnel-architect, pipeline designers | PROMOTE (should become a pre-requisite input-contract spec for the funnel-architect skill) |
| `runs/arduview/_asset-classify-proof.md` | Live proof-of-concept for image-classifier brick 4 on 5 Arduview photos; JSON records with vision classification | asset-classify pipeline / brick spec authors | SLOP (superseded by full asset-classify/ output; its skeleton data is in IMAGES.md) |

---

## runs/arduview/_marketing-decisions/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `runs/arduview/_marketing-decisions/INDEX.md` | Master index of 19 open marketing decisions across 4 files with one-line hooks | operator | KEEP |
| `runs/arduview/_marketing-decisions/light-pass.md` | 1 open decision: gadget/maker spaces don't run pain framing — mechanism vs transformation anchor | operator | KEEP |
| `runs/arduview/_marketing-decisions/funnel-architect-copywriter.md` | 10 open decisions: crowdfunding vs DR belief tagging, belief chain built on null inputs, every macro call still open | operator | KEEP |
| `runs/arduview/_marketing-decisions/deep-funnel-pass.md` | 6 open decisions: 43 belief records consumed as ground truth without review; tagging gaps across all 4 comps | operator | KEEP |
| `runs/arduview/_marketing-decisions/lp-builder.md` | 2 open decisions: accent contrast on dark surfaces unspecified; copy brief missing fold budgets | operator / Phase 17 | KEEP |

---

## runs/arduview/asset-classify/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `runs/arduview/asset-classify/ASSET-HANDOFF.md` | Handoff to funnel architect: define image jobs first, then select frames from video; instructions for frame-grab brick | funnel architect / LP builder | KEEP |
| `runs/arduview/asset-classify/CAPTION-HANDOFF.md` | Handoff to caption editor: add captions to finished 16:9 + 9:16 hero cuts; render-only, no commit | caption editor / video agent | KEEP |
| `runs/arduview/asset-classify/IMAGE-PLAN.md` | Art-directed image set (7 images); slot/job, claims proved, source frame per image | LP builder / Phase 17 | KEEP |
| `runs/arduview/asset-classify/IMAGES.md` | Arduview image CDN URL manifest; specs table; base URL pattern pending Shopify store ID | LP builder / asset-upload | KEEP |
| `runs/arduview/asset-classify/VIDEOS.md` | Arduview video CDN URL manifest (parallel to IMAGES.md) | LP builder / asset-upload | KEEP |
| `runs/arduview/asset-classify/VIDEO-ANALYSIS.md` | Per-clip beat sheets (20 videos): content at timestamp, claims proved, technical specs, ad_ready grade | funnel architect / LP builder | KEEP |

---

## runs/arduview/brand-refs/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `runs/arduview/brand-refs/nothing.md` | Nothing.tech brand DNA: visual fetch + product page teardown for Arduview LP reference | LP builder / site/STYLE-LOCK.md derivation | SLOP (consumed and reconciled into site/STYLE-LOCK.md; raw source no longer needed for build) |
| `runs/arduview/brand-refs/playdate.md` | Playdate brand + LP architecture reference: site fetch, voice, page structure, pricing pattern | LP builder / site/STYLE-LOCK.md derivation | SLOP (consumed and reconciled into site/STYLE-LOCK.md) |
| `runs/arduview/brand-refs/teenage-engineering.md` | Teenage Engineering visual intelligence: product page teardown, restraint/object-as-art aesthetic for Arduview | LP builder / site/STYLE-LOCK.md derivation | SLOP (consumed and reconciled into site/STYLE-LOCK.md) |

---

## runs/arduview/funnels-context/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `runs/arduview/funnels-context/divoom-79bf5e01-context.md` | Full assembled context blob (DR rubrics + funnel body) fed to section-analyzer for Divoom | funnel-analyzer-context.js (tool); section analyzer agent | SLOP (machine-generated input bundle; analysis output lives in belief_records) |
| `runs/arduview/funnels-context/gameshell-8d8735c7-context.md` | Same assembled context blob for GameShell | funnel-analyzer-context.js / section analyzer | SLOP (same as above) |
| `runs/arduview/funnels-context/playdate-e4b7147e-context.md` | Same assembled context blob for Playdate | funnel-analyzer-context.js / section analyzer | SLOP (same as above) |
| `runs/arduview/funnels-context/pocket-operator-af179d62-context.md` | Same assembled context blob for Pocket Operator | funnel-analyzer-context.js / section analyzer | SLOP (same as above) |

---

## runs/arduview/site/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `runs/arduview/site/STYLE-LOCK.md` | Locked visual strategy ("Glasshouse"): reconciled tokens from 3 brand refs — colors, type, surface rules, accent usage | Phase 17 ui-phase / LP builder (until UI-SPEC.md exists) | KEEP |

---

## agents/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `agents/funnel-deep-pass-run-notes.md` | Run notes for funnel-deep-pass skill: known data preconditions (space-map.json dual-file trap, corpus requirements, step-specific gotchas) | funnel-deep-pass skill / any agent running that pipeline | KEEP |
| `agents/implementation-notes.md` | Parked notes (from eink-tablets run) for eventual per-brand extractor + market-aggregator agent specs; NOT specs | future agent spec authors | KEEP |

---

## map/

| path | one-line | who reads it | classification |
|------|----------|-------------|----------------|
| `map/data_inventory.md` | VOC pipeline design notes + data inventory (unique content on within-individual co-occurrence, white-space method, extraction gaps surfaced from eink run) | Phase 3 VOC pipeline builders | KEEP-DISTILL (extract VOC design notes before any archive) |

---

## Summary

| classification | count |
|---|---|
| KEEP | 20 |
| KEEP-DISTILL | 1 |
| SLOP | 10 |
| PROMOTE | 1 |
| DUPLICATE | 0 |
| EINK | 0 |

**Notable non-KEEP items:**

- **PROMOTE:** `runs/arduview/15-DEBUG-funnel-architect.md` — input-gap audit that should become a formal pre-requisite input contract spec for the funnel-architect skill; too good to stay a debug note.
- **SLOP / ephemeral handoffs:** `STRATEGY-DISCUSS-HANDOFF.md`, `RERUN-BRIEF.md` — one-shot paste-in briefs; the work they pointed at is done.
- **SLOP / superseded by STYLE-LOCK:** `brand-refs/nothing.md`, `brand-refs/playdate.md`, `brand-refs/teenage-engineering.md` — raw fetch notes fully reconciled into `site/STYLE-LOCK.md`.
- **SLOP / machine-generated context blobs:** all 4 `funnels-context/*-context.md` — large assembled input bundles produced by `funnel-analyzer-context.js`; analysis outputs live elsewhere.
- **SLOP / superseded by asset-classify/:** `_asset-classify-proof.md` — 5-image skeleton proof, replaced by the full pass in `asset-classify/`.
- **KEEP-DISTILL:** `map/data_inventory.md` — unique VOC design content; extract before any archive.
