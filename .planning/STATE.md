---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 19-03-PLAN.md
last_updated: "2026-06-05T00:33:22.819Z"
last_activity: 2026-06-05
progress:
  total_phases: 20
  completed_phases: 3
  total_plans: 33
  completed_plans: 22
  percent: 67
---

# Project State

## Project Reference

See: .planning/PROJECT.md · Roadmap: .planning/ROADMAP.md (rewritten 2026-06-03)

**Core value:** A reusable research engine that converts a T/P/N seed into a validated market bet plus a
queryable bank of real, attributed customer language (verbatim, live permalinks).
**Current focus:** Phase 19 — cleanup-health-nuke-e-ink-quarantine-eink-tablets-quarantine
(Step 0/1/2, closest to running) and **Track B: VOC** (Step 3a/3b, specced).

## Current Position

Phase: 19 (cleanup-health-nuke-e-ink-quarantine-eink-tablets-quarantine) — EXECUTING
Plan: 4 of 5
Milestone: M1 of 2 (Research Engine; M2 launch engine deferred / rolling-wave)
Build model: brick model locked (`capability_inventory.md`) — scripts for deterministic jobs, agents for judgment, hooks to gate.

**Track A — Competitive analysis:**

- M1-S1 Light pass — **BUILT** (`prompts/step1-light-pass.md`, enriched with revenue_est + claim_type). Remaining: layer-3 scripts to run automated.
- M1-S2 Market-selection gate — **DRAFTED** (`.claude/skills/market-selection/SKILL.md` + verbatim spec). Remaining: wire the S1 data contract.
- M1-S3 Deep competitive analysis + messaging strategy — **SPECCED** (`prompts/_specs/deep-market-analysis-framework.md`).

**Track B — VOC (Step 3a/3b):** all SPECCED in `handoff-step3-voc-build.md`; starts at the **M1-S4 codebook keystone** (everything keys off it). Not yet built.

Status: Ready to execute
Next action: pick a track. Track A → finish S1 scripts + S2 wiring to pick a market now. Track B → build the S4 codebook keystone. Run via `/gsd-plan-phase <n> --skip-research` (the specs ARE the research) → `/gsd-execute-phase <n>`. Parallel tracks → use `git worktree` per session.
Last activity: 2026-06-05

Progress: [░░░░░░░░░░] 0% built (S1 light pass built but not yet run end-to-end through the new pipeline)

## Performance Metrics

**Velocity:**

- Total plans completed: 4
- Average duration: — min

## Accumulated Context

### Decisions

- InkLeaf RETIRED — `runs/eink-tablets/` quarantined; not canon, not a UAT rebuild target. Learnings live in `run-retrospective.md` + `agents/implementation-notes.md`; fetch tooling rescued to `tools/`.
- Brick model is the build law: one job per brick, deterministic → script/hook, judgment → agent, gates → agent-prep + human Decide.
- Schema authority for the per-brand/per-market record = `prompts/_specs/` frameworks + `step1-light-pass.md` (the older `map/data_inventory.md` base/enhanced claim_type is superseded by direct/enlarged/mechanism/enhanced).
- GSD used lightweight: roadmap tracking + `/gsd-plan-phase --skip-research` → `/gsd-execute-phase`; heavy ceremony stays off.
- Verification is UAT, not unit tests — run on a reference space and Kam reads the output.
- [Phase 02]: DR-KB injection resolved to read_first block (no hook infrastructure in .claude/skills/)
- [Phase 02]: Gate 2.2 wired to OPEN bet_type/bet_type_basis; dead competitive_axis enum removed
- [Phase 02]: mechanisms_in_play[] absence: [INFERENCE] derivation from corpus dumps via stopgap, not bare DATA GAP
- [Phase 02]: Soft-gate mode active for first/debug run: kills become flags + ranking penalties, all 6 cells ranked
- [Phase 02]: novelty-object-own x edc-aesthetic-collectors ranked #1: transparent OLED is unique in cell and matches cell dominant bet type novel-hardware-as-lead
- [Phase 02]: maker-identity x maker-diy-hobbyists ranked #2: gameshell funded-shipped crowdfunding is only demand signal; community-heat read deferred per override #2
- [Phase 03]: Per-card DOM extraction wired with TODO(D-17) markers; text-chunk fallback fills null slots; live-DOM calibration deferred to debug-run pass
- [Phase 03]: ssrfGuard() DNS failure defaults to skip (fail-closed), not fail-open; 169.254.169.254 cloud metadata caught by link-local CIDR check
- [Phase 03]: ssrfGuard() ported from funnel-assemble.js to crowdfund-fetch.js — operator-supplied CF URLs need same SSRF protection (T-03-05)
- [Phase 03]: validation_lane is array not string to carry both A+B lanes simultaneously without a combined/merged field (D-09 invariant)
- [Phase 03]: extractReviewBlocks() runs on raw HTML before stripToText() — container class attributes only detectable before tag stripping
- [Phase 03]: Controlled vocab resolved without ratification gate (D-15 overrides spec §12): EXECUTION_TYPE_ENUM 13 values, PROOF_TIER_ENUM Tier1/2/3, MOVE_ENUM 15 lever tags; claim_type REUSED from step1
- [Phase 03]: inject-dr.js emits to stdout by default; orchestrator pastes block into Analyzer context (FILE injection, not RAG)
- [Phase 03]: validate-analyzer.js verbatim-substring gate uses same non-fatal missing-corpus behavior as validate-dumper.js; awareness_entry enum (unaware/problem-aware/solution-aware/product-aware/offer-aware) added to funnel_fields validation
- [Phase 03]: funnel_id + space sanitized to [a-z0-9._-] before write path (T-03-13 compliance)
- [Phase 03]: birdseye-computed fields (merge/synthesis) NOT added to funnel-store.js — collection records only
- [Phase 03]: D-17 plumbing smoke test DEFERRED by operator at plan 03-04 closeout — validated-by-construction (syntax checks + prior Self-Check PASSes), end-to-end live run deferred to D-02 after market pick
- [Phase 16]: .venv is project-level venv; all Python bricks use .venv/bin/python explicit spawn (PEP 668 box)
- [Phase 16]: section-table.json in tools/asset/ (product-agnostic default); per-run overrides at runs/<space>/asset-classify/
- [Phase 16]: Hamming threshold 15/64 (not spec 5/64): real img-04/img-05 burst-shot pair measures distance=12; 5 would miss them
- [Phase 16]: asset-fetch.js uses fs.readdirSync + ext filter (no glob package in project)
- [Phase 16]: PIL tile+timestamp instead of ffmpeg drawtext: bundled static binary may lack freetype/fontconfig; intent (5fps timestamped contact sheets) fully preserved
- [Phase 16]: validate-asset-record.js runs as orchestrator step (not PostToolUse hook) — hooks don't fire in subagents; grounding gate rejects demonstrates[] missing evidence/motion_value at script level; video detection by presence of segments/best_use/eligible_slots fields
- [Phase 16]: gap_list logic: section gapped if NO candidate is strong AND clean (disqualifiers:[] && dup_of:null); records with busy backgrounds route to sections but still generate a gap
- [Phase 16]: T-16-05-02: absent video CDN URL = empty slot + warning; never fabricate /videos/c/o/v/<hash>.mp4 — hashed path must come from url-map
- [Phase 19]: VOC-chain schemas in keeper use condensed table (not full field dumps) — handoff covers them architecturally and M1-S4 re-specs at field level
- [Phase 19]: Source-metadata preservation chain documented as a named section anchor in data-model-notes.md keeper
- [Phase 19]: Inline manifest format rows drawn from runs/arduview/asset-classify/IMAGES.md as the canonical shape illustration before deleting launch/
- [Phase 19]: Atomic commits per deletion group (_quarantine/ then launch/) per D-01 revertability; no _archive/ dir created — git history is the archive

### Pending Todos

None tracked here.

### Blockers/Concerns

- Track B M1-S5: the open "no-clean-niche-venue" design problem (behavior-defined niches have no anchor subreddit) — flagged for the Query Planner stage.
- Track B M1-S6: Reddit ingestion must run on the official commercial API (GummySearch died Nov 2025 over API licensing).
- Track A M1-S1 revenue signal: monthly-visits source is manual-paste / review-proxy (no paid SimilarWeb API) — `revenue_est.method/confidence` keeps it swappable.

### Roadmap Evolution

- Phase 20 added (2026-06-04): Deep-pass bug fixes — funnel-clean.js markdown-heading regex, funnel-score.js fail-fast field validation, corpus-absent orchestrator guard, no-ads DTC path, light-pass SKILL precondition path, funnel-level position ordinal. 3 fixes already committed in bbff2ff; remainder scoped in POST-RUN-HARDENING-PLAN.md and audit/08-deep-pass-bugs.md.
- Phase 19 added (2026-06-04): Cleanup & health — nuke e-ink quarantine dirs, slop docs, junk binaries; distill VOC notes from map/data_inventory.md then archive; gitignore _index.json + _*-log.txt; enforce no-overwrite-v1 rule. Full delete lists in .planning/intel/INDEX.md and .planning/POST-RUN-HARDENING-PLAN.md.
- Phase 15 added (2026-06-04): Stage M1-S15 — Funnel Architect + Copywriter (Step-4 copy generation). Two coupled skills in one phase so the shared copy-brief contract is designed producer+consumer together. Seeded from an audit that found `belief_kind`/`source_routing` assumed-but-absent, RAG source-scoping missing, and DR injection unwired for both skills. Reuses this session's Voyage RAG tooling; the interim copywrite wiring stub is replaced.
- Phase 16 added (2026-06-04): Stage M1-S16 — Asset Classifier (image + video bricks). Step-4/launch-adjacent pull-forward (same pattern as S15). Turns a folder of raw product images/videos into a claim-tagged manifest the LP-build/copywriter agents query by belief. SPECCED + PROVEN: spec `prompts/_specs/image-classifier-brick.md`; live vision proof on real Arduview shots in `runs/arduview/_asset-classify-proof.md` (auto-surfaced dedupe, background disqualifiers, no-clean-hero gap). Open gaps for planning: no ffmpeg → video decoder needed; section list wires to M1-S3 container; per-product claim list authorship. Videos NOT yet analyzed (user hold).
- Phase 17 added (2026-06-04): LP Builder — implement the Arduview landing + deposit pages from the (tapped) copy brief and locked "Glasshouse" visual system. Scope is front-end page implementation ONLY; copy/funnel and picture selection are upstream inputs. Seeded from a manual reference build this session (`runs/arduview/site`, live at arduview-see-through.surge.sh) whose iteration surfaced the spec gaps the phase must close via a UI-SPEC build contract: per-page above-the-fold budget (LP: title+CTA+video; deposit: image+title+CTA+51%-value), explicit element order per breakpoint, contrast/accent rules (no text on same-value bg; accent highlight readable on light AND dark — the recurring black-on-black `.hl` bug), type scale + min sizes, CTA legibility (readable face + black-on-accent, not the dot-matrix display font), decorative-vs-essential (captions removable), deposit risk-reversal placement + no-repetition rule, and a de-AI rule-set (copy AI-tells + humanizer skill; visual AI-tells: no generic centered-card/emoji-icon/gradient defaults). Existing inputs: COPY-DRAFT.md, brand-refs, HERO-VIDEO.md, STYLE-LOCK.md (partial visual contract — missing the fold/contrast/responsive layer). Suggested flow: discuss-phase (--power) → ui-phase (UI-SPEC) → plan-phase → execute-phase.

### Quick Tasks Completed

| # | Description | Date | Commit | Directory |
|---|-------------|------|--------|-----------|
| 260603-wfz | Fix funnel Section Analyzer to be orchestrator-managed (deterministic DR + funnel-body injection) | 2026-06-04 | 7081458 | [260603-wfz-fix-funnel-section-analyzer-to-be-orches](./quick/260603-wfz-fix-funnel-section-analyzer-to-be-orches/) |
| 260603-x8o | Author /funnel-deep-pass orchestrator skill consolidating the funnel deep-pass workflow (source of truth; agent prompts folded in, schema referenced) | 2026-06-04 | 8e45fa6 | [260603-x8o-author-funnel-deep-pass-orchestrator-ski](./quick/260603-x8o-author-funnel-deep-pass-orchestrator-ski/) |
| Phase 16-asset-classifier-image-and-video-bricks P01 | 144 | 3 tasks | 6 files |
| Phase 16-asset-classifier-image-and-video-bricks P02 | 18 | 2 tasks | 3 files |
| Phase 16-asset-classifier-image-and-video-bricks P04 | 5 | 2 tasks | 2 files |
| Phase 16 P05 | 15 | 3 tasks | 3 files |
| Phase 19 P01 | 5 | 1 tasks | 1 files |
| Phase 19 P02 | 3 | 1 tasks | 1 files |
| Phase 19 P03 | 3 | 2 tasks | 696 files |

## Deferred Items

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| Milestone | M2 — launch engine (Steps 4–8 + the `launch/` Shopify/Klaviyo fold) | Deferred (rolling-wave) | 2026-06-03 |
| Capability | Vectorization / RAG vector DB | Deferred (JIT for Step 4) | 2026-06-02 |
| Capability | Persistence / substrate layer | Deferred (.md files suffice) | 2026-06-02 |
| Capability | `space-sketcher` (partial-seed expander) | Deferred (no case yet) | 2026-06-02 |
| Phase 02 P01 | 8 | 2 tasks | 1 files |
| Phase 02 P02 | 30 | 1 tasks | 1 files |
| Phase 03 P01 | 5 | 2 tasks | 2 files |
| Phase 03 P02 | 6 | 3 tasks | 3 files |
| Phase 03 P03 | 7 | 3 tasks | 3 files |
| Phase 03 P04 | 3 | 3 tasks | 2 files |
| Phase 03 P04 | 5 | 3 tasks | 3 files |

## Session Continuity

Last session: 2026-06-05T00:33:22.816Z
Stopped at: Completed 19-03-PLAN.md
Resume file: None
