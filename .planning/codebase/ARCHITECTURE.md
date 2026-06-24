# Architecture

**Analysis Date:** 2026-06-24

## Pattern Overview

**Overall:** Brick-composition pipeline with hard executor routing (script vs. agent vs. hook vs. human)

**Key Characteristics:**
- Every job is one of four executor types: script (S), agent (A), hook (H), or human decision (D). Mixing them is a category error defined in `CLAUDE.md` and enforced by convention.
- Agents handle only judgment (query design, classify, extract, synthesize). Scripts handle everything deterministic (fetch, clean, score, store). Hooks gate transitions. Humans make all strategic bets.
- Pipelines are explicit brick strings (`A1 → S1 → H1 → S2 → A2 → S3 → D1`), not monolithic prompts.
- Run outputs are per-space namespaces under `runs/<space>/` — immutable once committed (no-overwrite-v1, D-07/D-08/D-09).

## Layers

**Vocabulary / Theory Layer:**
- Purpose: Locked definitions, research step structure, data model schemas
- Location: `definitions.md`, `workflow.md`, `capability_inventory.md`, `map/data-model-notes.md`
- Contains: Vocabulary (transformation, niche, UM, PMBD, claim types), step specs (Steps 0–8), brick taxonomy, IO schemas
- Depends on: Nothing — these are the source of truth
- Used by: All agents, all scripts, all hook validators

**Skill Layer (Agent Prompts):**
- Purpose: Judgment-agent instruction sets, deployed as Claude skills
- Location: `.claude/skills/<skill-name>/SKILL*.md`
- Contains: Per-skill orchestration logic, agent prompts, enforcement maps, chain-position diagrams
- Skills available:
  - `.claude/skills/market-selection/` — A4 synthesize + D1 feed for Gate 1 (NTP selection)
  - `.claude/skills/funnel-deep-pass/` — orchestrator for Router + Section Analyzer per-funnel loop
  - `.claude/skills/asset-classify/` — orchestrator for relevance-bucket + role-classify/comprehend-video loop
  - `.claude/skills/pipeline-audit/` — adversarial two-reviewer audit orchestrator (Reviewer A + B)
  - `.claude/skills/funnel-architect/` — funnel design agent
  - `.claude/skills/copywriter/` — DR copywriter agent
  - `.claude/skills/reddit-extract/` — headless Chromium Reddit thread extractor (S1 brick via `dump.mjs`)
- Depends on: `definitions.md`, `workflow.md`, `capability_inventory.md`, hook validators, deterministic scripts

**Prompt / Spec Layer:**
- Purpose: Standalone agent prompts (not yet in skills), spec documents for specced-but-unbuilt bricks
- Location: `prompts/`, `prompts/_specs/`, `prompts/_templates/`, `marketing-lens/prompts/`
- Key files:
  - `prompts/step1-light-pass.md` — Finder + Roster Verifier + Dumper + Space Classifier chain
  - `prompts/funnel-deep-pass.md` — Section Analyzer schema + section-by-section prompt
  - `prompts/_specs/funnel-analysis-collection-spec.md` — belief record schema (co-owns with validate-analyzer.js)
  - `prompts/_specs/image-classifier-brick.md` — asset record schema (co-owns with validate-asset-record.js)
  - `marketing-lens/prompts/` — per-agent prompt files (01-finder.md through 11-comprehend-video.md), oriented by `marketing-lens/MAP.md`
- Depends on: `definitions.md`, hook validators (schema ground truth)

**Script Layer (Deterministic Tools):**
- Purpose: All fetch, clean, score, store, retrieve, assemble, validate operations
- Location: `tools/*.js`, `tools/asset/*.py`, `tools/lib/embed.js`
- Key scripts:
  - `tools/fetch.js` — Playwright per-brand homepage + LP fetch → `corpus/<slug>/raw/`
  - `tools/adlib-one.js` — Meta ad library scraper → `ads/<slug>.json`
  - `tools/crowdfund-fetch.js` — Crowdfunding LP fetch → `runs/<space>/crowdfunding/`
  - `tools/clean.js` / `tools/dedupe.js` — S2 brick (normalize, deduplicate)
  - `tools/funnel-assemble.js` — Playwright LP renderer, clusters ads by destination URL → `runs/<space>/funnels/`
  - `tools/funnel-analyzer-context.js` — Builds [DR bundle + cleaned funnel body] context for Section Analyzer
  - `tools/funnel-store.js` — Persists belief records to `runs/<space>/funnels/`
  - `tools/funnel-vectorize.js` — Embeds belief store for RAG (uses `tools/lib/embed.js`)
  - `tools/funnel-score.js` — Scores funnels (S3 brick)
  - `tools/funnel-claim-tally.js` — Claim frequency counts (S3 brick)
  - `tools/asset-fetch.js` — Copies raw assets into `assets/raw/`
  - `tools/asset-map-rank.js` — Routes + ranks classified assets
  - `tools/asset-emit.js` — Emits `images.json` + `IMAGES.md` / `videos.json` + `VIDEOS.md`
  - `tools/audit-inject.js` — Assembles reviewer context for pipeline-audit
  - `tools/audit-resolve.js` — Resolves evidence manifest paths
  - `tools/revenue-est.js` — Revenue estimation (S3 brick)
  - `tools/aggregate-mechanisms-in-play.js` — Mechanism aggregation (S3 brick)
  - `tools/asset/*.py` — Video/image probe chain (probe.py, probe_video.py, sample_montage.py, frame-grab.py)
  - `tools/lib/embed.js` — Dual-backend embedding (Voyage REST or local stub; swap-point for RAG)
- Depends on: Node.js / Playwright / Python, `brands.json`, run space outputs

**Hook Layer (Validation Gates):**
- Purpose: PostToolUse validators that reject off-contract agent output; H1 brick
- Location: `tools/hooks/`
- Key files:
  - `tools/hooks/route.js` — Dispatcher: routes Write events to the correct validator by filename
  - `tools/hooks/validate-finder.js` — Validates `brands.json` output from Finder agent
  - `tools/hooks/validate-dumper.js` — Validates `dump.json` from Dumper agent
  - `tools/hooks/validate-classifier.js` — Validates `space-map.json` from Space Classifier
  - `tools/hooks/validate-analyzer.js` — Validates Section Analyzer belief records
  - `tools/hooks/validate-asset-record.js` — Validates asset classification records
  - `tools/hooks/validate-revenue.js` — Validates revenue estimates
  - `tools/hooks/inject-dr.js` / `inject-funnel-architect-dr.js` / `inject-market-selection-dr.js` / `inject-copywriter-dr.js` — DR knowledge injection hooks
- Depends on: Schemas co-owned with `prompts/_specs/`

**Data / Corpus Layer:**
- Purpose: Raw and cleaned research data, per-brand records
- Location: `corpus/<brand-slug>/raw/` (gitignored) and `corpus/<brand-slug>/clean/`, `corpus/<brand-slug>/dump.json`
- Structure per brand: `raw/` (HTML, gitignored), `clean/` (normalized), `dump.json` (brand record)
- Root data files: `brands.json` (brand roster with metadata), `space-map.json` (space aggregate)

**Run Output Layer:**
- Purpose: Per-product-run research artifacts, funnel packages, analysis outputs — immutable once committed
- Location: `runs/<space>/` (e.g., `runs/arduview/`, `runs/eink-tablets/`)
- No-overwrite-v1: re-runs write `v2/` subdirectory or `-v2` suffix; v1 stays intact
- Sub-structure within a run space:
  - `runs/<space>/funnels/` — assembled funnel packages (`*.json`) + `_tally.json` + `_index.json`
  - `runs/<space>/funnels-clean/` — cleaned funnel text
  - `runs/<space>/funnels-scored/` — scored funnels
  - `runs/<space>/funnels-analyzer-out/` — Section Analyzer outputs
  - `runs/<space>/crowdfunding/` — crowdfunding LP packages
  - `runs/<space>/asset-classify/` — classified asset records, ranked outputs
  - `runs/<space>/_audit/` — pipeline audit reports (A and B reviewers)
  - `runs/<space>/site/` — built site output (HTML/CSS/JS)
  - `runs/<space>/market-selection.md` — market selection analysis output
  - `runs/<space>/space-map.json` — per-run space aggregate
  - `runs/<space>/FUNNEL-DESIGN.md`, `COPY-DRAFT.md`, `BUILD-FEEDBACK.md` — funnel and copy deliverables
  - `runs/<space>/pre-research-plan.md` — operator bet brief (seeds the run)
  - `runs/_fixture/` — test fixtures (committed; excluded from gitignore patterns)

**Planning Layer:**
- Purpose: GSD phase plans, phase summaries, audit intel, codebase maps
- Location: `.planning/`
- Sub-structure:
  - `.planning/phases/<NN>-<stage-slug>/` — per-phase plans (`NN-NN-PLAN.md`, `NN-NN-SUMMARY.md`, `NN-CONTEXT.md`)
  - `.planning/audit/` — retro audit documents
  - `.planning/intel/` — strategic intel documents
  - `.planning/quick/<id>/` — quick-plan sessions (`<id>-PLAN.md`, `<id>-SUMMARY.md`)
  - `.planning/codebase/` — codebase maps (this file)

**Human Decision Layer (D1):**
- Purpose: Strategic bets and gate calls — not automated
- Location: `runs/<space>/pre-research-plan.md` (bet brief), marketing-decisions docs
- Decisions: hypothesis selection, NTP selection, Gate 1 / Gate 2 pass/fail, angle / variable / test design, human pick gate on assets
- Depends on: All A4 (synthesize) outputs feeding upward

## Data Flow

**Full Research Pipeline (Steps 0–1):**
1. Operator authors `runs/<space>/pre-research-plan.md` (bet brief — D1 seeds)
2. `tools/adlib-one.js` / Finder agent (`prompts/step1-light-pass.md`) finds brands → `brands.json`
3. `tools/fetch.js` (S1) fetches per-brand pages → `corpus/<slug>/raw/` (gitignored)
4. `tools/clean.js` + `tools/dedupe.js` (S2) normalize → `corpus/<slug>/clean/`
5. Dumper + Space Classifier agents (in `prompts/step1-light-pass.md`) run → `corpus/<slug>/dump.json` → `space-map.json`
6. Hook: `route.js → validate-finder.js / validate-dumper.js / validate-classifier.js` gates each write
7. Market Selection skill (`/market-selection`) synthesizes (A4) → ranked NTP survivors → D1 human pick

**Deep Funnel Analysis (Steps 2–3):**
1. `tools/funnel-assemble.js` (S1) clusters ads by destination URL, renders LPs → `runs/<space>/funnels/*.json`
2. `/funnel-deep-pass` skill orchestrates per-funnel: Router agent (scope) → `funnel-analyzer-context.js` (context assembly) → Section Analyzer agent → `validate-analyzer.js` → `funnel-store.js`
3. `tools/funnel-vectorize.js` embeds belief store via `tools/lib/embed.js`
4. `/market-selection` + `/funnel-architect` + copywriter agent run → `FUNNEL-DESIGN.md` + `COPY-DRAFT.md`

**Asset Classification Chain:**
1. `tools/asset-fetch.js` copies raw media → `assets/raw/`
2. `tools/asset/probe.py` / `probe_video.py` / `sample_montage.py` extract technical metadata + contact sheets
3. `/asset-classify` orchestrates: relevance-bucket agent → role-classify/comprehend-video agent → `validate-asset-record.js` → `runs/<space>/asset-classify/records/<id>.json`
4. `tools/asset-map-rank.js` routes + ranks → `tools/asset-emit.js` emits `IMAGES.md` / `VIDEOS.md`
5. D1 human pick gate → Phase 15 builder

**Pipeline Audit:**
1. `/pipeline-audit` reads completed run outputs (space-map.json + market-selection + funnels store + FUNNEL-DESIGN)
2. Fans out Sonnet DR-scouts → resolves evidence paths (`audit-resolve.js`) → strips B inputs (`audit-inject.js`)
3. Spawns Opus Reviewer A (×3 segments) + Opus Reviewer B (×1 chain) → diagnosis-only reports in `runs/<space>/_audit/`

**State Management:**
- Interim persistence: flat `.md` files and `.json` under `runs/<space>/`
- Heavy persistence (`S4`/`S5`) deferred — build JIT when manual friction justifies it
- Embeddings: `tools/lib/embed.js` with Voyage REST or local stub (swap via `VOYAGE_API_KEY`)
- No shared database; all state is file-system JSON/MD under version-controlled run namespaces

## Key Abstractions

**Brick:**
- Purpose: Smallest single-job unit; typed by executor (A/S/H/D)
- Defined in: `capability_inventory.md`
- Types: A1 Query Design, A2 Classify, A3 Extract, A4 Synthesize; S1 Fetch, S2 Clean, S3 Score, S4 Store, S5 Retrieve; H1 Validate/gate; D1 Decide

**Run Space:**
- Purpose: Namespaced container for all outputs of one product research run
- Location: `runs/<space>/` (e.g., `runs/arduview/`, `runs/eink-tablets/`)
- Convention: no-overwrite-v1 — re-runs add new versioned path, never mutate committed outputs

**Funnel Package:**
- Purpose: Unit of funnel analysis — one LP cluster with all ads and rendered page content
- Location: `runs/<space>/funnels/<funnel_id>.json`
- Assembled by: `tools/funnel-assemble.js`

**Belief Record:**
- Purpose: Atomic unit of funnel analysis output from Section Analyzer
- Location: `runs/<space>/funnels/*.json` (via `funnel-store.js`)
- Schema ground truth: `tools/hooks/validate-analyzer.js` + `prompts/_specs/funnel-analysis-collection-spec.md`

**Brand Record:**
- Purpose: Per-brand research output (dump.json per brand slug)
- Location: `corpus/<slug>/dump.json`
- Schema: defined in `map/data-model-notes.md`

**Skill:**
- Purpose: A deployed Claude orchestrator — wraps one pipeline segment; instructs the main agent how to run its brick chain
- Location: `.claude/skills/<name>/SKILL*.md`
- Pattern: Skill SKILL.md = orchestration only; schema lives in prompts/_specs + validators (not duplicated)

## Entry Points

**Research Run Start:**
- Location: `runs/<space>/pre-research-plan.md`
- Triggers: Operator authors bet brief; first agent invoked is Finder via `/project:step1-light-pass` or `prompts/step1-light-pass.md`
- Responsibilities: Seeds brand candidate list, defines what IS/IS NOT being validated, pins NTP candidates

**Funnel Deep Pass:**
- Location: `.claude/skills/funnel-deep-pass/SKILL-funnel-deep-pass.md`
- Triggers: After `/market-selection` picks NTP cell AND funnel packages are assembled
- Precondition: `runs/<space>/funnels/*.json` must exist; `space-map.json` must have a chosen cell

**Asset Classification:**
- Location: `.claude/skills/asset-classify/SKILL-asset-classify.md`
- Triggers: After asset files are in `assets/raw/` and `CLAIM-LIST.json` + `section-table.json` exist

**Pipeline Audit:**
- Location: `.claude/skills/pipeline-audit/SKILL.md`
- Triggers: After a complete product run (space-map + market-selection + funnel deep-pass store + FUNNEL-DESIGN/COPY-DRAFT)
- Responsibilities: Diagnosis only; produces reports in `runs/<space>/_audit/`; touches no pipeline output

## Error Handling

**Strategy:** Hook-gate rejection (exit 2 + stderr) before persistence; per-item try/catch in batch scripts (one bad LP/asset never aborts the batch)

**Patterns:**
- `tools/hooks/route.js` dispatches PostToolUse Write events to per-validator; validator exits 2 to reject
- Schema co-ownership: `prompts/_specs/*.md` + matching `tools/hooks/validate-*.js` — hook is ground truth
- `funnel-assemble.js`: per-LP try/catch; timeout guards (60s goto, 30s networkidle); SSRF guard; "Read more" click cap
- Batch resilience: sidecar `_*-log.txt` files (gitignored) capture per-item errors without aborting

## Cross-Cutting Concerns

**Naming:** PMF "Steps 0–8" = research steps (defined in `workflow.md`). GSD "Stage M1-SN" = build unit. GSD "Phase N" = roadmap index only. Never call a research step a Phase. Never reuse Step numbers as Stage identifiers.

**No-overwrite-v1:** Any committed run output under `runs/<space>/` is immutable. Re-runs write new versioned location (`v2/` subdir or `-v2` suffix). Convention only — no guard script yet (deferred).

**Schema co-ownership:** Closed enums and record schemas live jointly in `prompts/_specs/` (spec) and `tools/hooks/validate-*.js` (enforced ground truth). Never duplicate schemas into skill files.

**DR knowledge injection:** `tools/hooks/inject-dr.js` and its per-skill variants inject DR marketing knowledge into agent context at hook time. This keeps DR strategy out of prompts and testable separately.

**Source metadata pass-through:** Every VOC brick must preserve `platform`, `venue`, `author_id`, `url`, `timestamp`, `engagement`. Non-negotiable architectural constraint for 5+ co-occurrence rule (see `map/data-model-notes.md`).

---

*Architecture analysis: 2026-06-24*
