# Handoff — Build M1 (the Research Engine)

Pick-up doc for **finishing Milestone 1**. Read this top-to-bottom, then the canon it points to.
Build FROM the specs — don't regenerate them. **InkLeaf is retired: ignore `_quarantine/` and
`launch/` (that's M2).** Source of truth for stage status is `ROADMAP.md`.

## What M1 delivers

A T/P/N seed → **a validated market bet** + **a queryable bank of real, attributed customer language**.
M1 is done when: a market is picked via the gates (Track A) AND the VOC copy bank runs end-to-end on a
reference space and Kam reads it and trusts it (Track B).

## The law (read first, obey)

- **`capability_inventory.md` — the brick model.** One job per brick. Deterministic work (fetch, clean,
  dedupe, count/score, store, validate) = **scripts/hooks**; judgment (query design, classify, extract,
  synthesize) = **agents**; gates = agent-prep → **human Decide**. Every stage below is a brick string.
- **`CLAUDE.md`** — agent-design rules + naming (Phase = research step 0–8; Stage = GSD build unit).
- **`definitions.md`** — locked vocabulary; every prompt loads it.
- **Verification = UAT, not unit tests.** Run on a reference space; Kam reads the output.

## Current build state

- **BUILT:** `prompts/phase1-light-pass.md` (light pass — Finder/Verifier/Dumper/Space Classifier,
  enriched with `revenue_est` + `claim_type`).
- **DRAFTED:** `.claude/skills/market-selection/SKILL.md` (the 4-gate decision skill).
- **SPECCED (build these):** `prompts/_specs/market-selection-framework.md`,
  `prompts/_specs/deep-market-analysis-framework.md`, and `handoff-phase3-voc-build.md` (the whole VOC chain).

## Two tracks (independent — run in parallel sessions, `git worktree` per session so they don't clobber)

### Track A — Competitive analysis (closest to a result)
Goal: pick a market. Brick string: `A1 query → S1 fetch → H1/S2 verify+clean → S4 store → A2 classify → S3 aggregate → A4 shallow analysis → D1 Gate 1`.
- **M1-S1 Light pass — BUILT.** Remaining: the **layer-3 scripts** it specs — `fetch.js` / `clean.js` /
  `dedupe.js` / `revenue-est.js` + the hook JSON. Mine `tools/adlib-one.js` + `tools/crowdfund-fetch.js`
  for the page-ID-resolution + Cloudflare-bypass lessons. Until built, the orchestrator runs fetches
  manually (InkLeaf style) and feeds the agents.
- **M1-S2 Market-selection gate — DRAFTED.** Wire the S1 data contract the gates consume (the SKILL's
  INPUT DATA CONTRACT lists it: claim-typing ✓ + revenue ✓ now in the light pass; still to add =
  trend-shape, adjacent-signals, market-awareness rollup). `GATE-01`.
- **M1-S3 Deep competitive analysis + messaging strategy — SPECCED.** Build as a brick string; runs on
  the chosen market's top ~5 brands. Two lenses (structure + messaging) → merge. Serves Phase 2 + front-half Phase 4.

### Track B — VOC pipeline (the bulk; fully specced)
**`handoff-phase3-voc-build.md` is the complete build brief** — architecture, the 3-pass pipeline, every
decision locked, prior-art steal-list. Brick string: `A1 Query Planner → S1 scraper → S2 cleaner →
A2 Bucketer → S3 freq+intensity+co-occurrence → A3 Ladderer → H1 verbatim gate → A4 Language Analyzer →
S4 copy bank → D1 sub-niche call`.
- **M1-S4 Codebook + per-quote record schema (KEYSTONE) — BUILD FIRST.** Everything in VOC keys off it.
  `VOC-01/02`. (definitions.md PMBD×tier + workflow.md battery, compiled into a tagging contract in the
  `phase1-light-pass.md` format: closed enums hook-rejected, open fields verbatim.)
- **M1-S5** Query Planner (3 lanes + no-clean-venue handling) — `VOC-03`.
- **M1-S6** Scraper (Reddit official commercial API) + cleaner (raw-immutable copy) + verbatim-gate hook — `VOC-04/05`.
- **M1-S7** Bucketer (pass 1, cheap, whole corpus) + intensity scorer (VADER+engagement+length) — `VOC-06/07`.
- **M1-S8** Frequency + co-occurrence clustering (unique-user counts; user×theme matrix → sub-niches; **the
  novel piece, no prior art**) — `VOC-08`.
- **M1-S9** Ladderer (pass 2, hot clusters only) — `VOC-09`.
- **M1-S10** Language Analyzer + copy-bank store — `VOC-10`.
- **M1-S11** End-to-end VOC UAT on a reference subreddit — `VOC-11`.

### Cross-cutting (after the tracks)
- **M1-S12** Templatize light pass + extract `deliverable-templates.md` — `TOOL-01/02`.
- **M1-S13** Phase 3c mechanism research (after a market is picked) — `UM-01`.
- **M1-S14** Phase 3d loop-back (augment-not-overwrite; `depth_pass` + `extracted_at`) — `LOOP-01`.

## Recommended order (ASAP)

Run the two tracks in **parallel** sessions:
1. **Track B first lift = M1-S4 codebook** (the keystone; unblocks all of VOC, biggest piece). VOC builds
   product-agnostic — it doesn't need a chosen market to *build*; it needs one to *run*.
2. **Track A in parallel:** finish S1 scripts + S2 wiring → run light pass + gates on a real T/P/N → **pick a
   market**. Closest to a tangible result; its output is what VOC and S3 then point at.
3. Then: S3 deep comp on the chosen market · S6–S11 VOC through to the copy bank + UAT · S13 mechanism ·
   S14 loop-back · S12 templatize.

## How to run a stage

`/gsd-plan-phase <n> --skip-research` (the specs ARE the research — nothing to investigate) →
`/gsd-execute-phase <n>`. Or build directly holding the brick discipline. **Build the prompt right before
running it; first 2–3 runs are debugging, not research** (`run-retrospective.md` §1).

## Gotchas (locked)

- **Reddit ingestion = official commercial API only** (GummySearch died Nov 2025 over API licensing).
- **No-clean-niche-venue:** behavior-defined niches (e.g. "dumb-device") have no anchor subreddit — the
  Query Planner (S5) must run the three-lane search without one.
- **Verbatim grounding = hard hook:** agents return `(author_id, source, char-offsets)`, never quote text;
  a script slices from the raw immutable copy and string-verifies; reject on mismatch. No LLM authors a
  customer sentence into the bank — that's the moat.
- **Normalization breaks char-offsets** — keep a raw immutable copy, index offsets into *that*.
- **Schema authority:** `prompts/_specs/` frameworks + `phase1-light-pass.md` win. `map/data_inventory.md`
  is reference only (its `base/enhanced` claim_type is superseded by `direct/enlarged/mechanism/enhanced`).

## Reservoir (mine when building; not runnable specs)

`workflow.md` (phase theory + the PMBD battery = the classifier's schema spine), `run-retrospective.md`
(run lessons), `agents/implementation-notes.md` (layer-conflation worked examples — **critical** for the
codebook + every classify step).

## DR knowledge

`~/knowledge/dr-marketing/` — read **on demand**, not wholesale. For Gate-1 / analysis classification
quality: `differentiator-framework__2_.md`, `angle.md`, `consumer-psychology--*`. Not needed for VOC plumbing.

---
*Created 2026-06-03. M1 = research engine; M2 (launch) deliberately parked. Stage status: `ROADMAP.md`.*
