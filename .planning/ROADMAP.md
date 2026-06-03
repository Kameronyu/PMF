# Roadmap: PMF — Milestone 1 (Research Engine)

> **Naming (locked).** The GSD **Phase** index (`### Phase 1, 2, 3…`) is mechanical bookkeeping; the human
> identifier is the **Stage** (`M1-S{n}`). GSD Phase-N = build **Stage M1-SN**. **"Step" is reserved for PMF
> research steps 0–8** (`workflow.md`) and appears below only as a *Serves PMF Step* label, never as an
> identifier. (Renamed from "Phase" → "Step" on 2026-06-03 to end the collision with GSD's Phase index.)
>
> **InkLeaf is RETIRED.** The `runs/eink-tablets/` research run + throwaway briefs are quarantined to
> `_quarantine/` — not canon, not a UAT rebuild target. Learnings live in `run-retrospective.md` +
> `agents/implementation-notes.md`; fetch tooling rescued to `tools/`. Launch machinery → `launch/` (M2).

## Overview

M1 builds the reusable **research engine**: a T/P/N seed → a validated market bet + a queryable bank of
attributed customer language. Everything composes from the **brick model** (`capability_inventory.md` —
one job per brick; deterministic = scripts/hooks, judgment = agents; gates = agent-prep → human Decide).

Two tracks (independent — runnable in parallel via `git worktree`):
- **Track A — Competitive analysis** (Step 0/1/2): light pass **BUILT** → market-selection gate
  **DRAFTED** → deep analysis **SPECCED**. Picks the market.
- **Track B — VOC** (Step 3a/3b): **SPECCED** in `handoff-step3-voc-build.md`; the codebook keystone
  (S4) unblocks the rest. Produces the copy bank.

**M2 — launch engine** (Steps 4–8 + the `launch/` machinery) is deferred, rolling-wave.

Status legend: `BUILT` · `DRAFTED` (exists, needs finishing) · `SPECCED` (spec ready — build it).

## Phases

- [~] **Stage M1-S1: Light pass** — `BUILT`; competitor find + space classify (feeds Gate 1)
- [~] **Stage M1-S2: Market-selection gate** — `DRAFTED`; 4 gates → ranked survivors → human pick
- [ ] **Stage M1-S3: Deep competitive analysis + messaging strategy** — `SPECCED`
- [ ] **Stage M1-S4: VOC codebook + record schema** — `SPECCED` (keystone — build first for Track B)
- [ ] **Stage M1-S5: Query Planner agent** — `SPECCED`
- [ ] **Stage M1-S6: Scraper + cleaner + verbatim gate** — `SPECCED`
- [ ] **Stage M1-S7: Bucketer (pass 1) + intensity scorer** — `SPECCED`
- [ ] **Stage M1-S8: Frequency + co-occurrence clustering** — `SPECCED`
- [ ] **Stage M1-S9: Ladderer (pass 2)** — `SPECCED`
- [ ] **Stage M1-S10: Language Analyzer + copy bank** — `SPECCED`
- [ ] **Stage M1-S11: End-to-end VOC UAT** — `SPECCED`
- [ ] **Stage M1-S12: Tooling templatization + deliverable templates** — `SPECCED`
- [ ] **Stage M1-S13: Step 3c mechanism research** — `SPECCED`
- [ ] **Stage M1-S14: Step 3d loop-back** — `SPECCED`

## Phase Details

### Phase 1: Stage M1-S1 — Light pass
**Goal**: The light pass (Finder → Roster Verifier → Dumper → Space Classifier) finds competitor brands and classifies the space — transformations/niches sold, per-cell saturation, typed claims, and a revenue signal — emitting the data the Gate-1 market-selection skill consumes.
**Serves PMF Step**: 0 / 1
**Depends on**: Nothing
**Requirements**: TOOL-01 (partial)
**Status**: BUILT (`prompts/step1-light-pass.md`, enriched with `revenue_est` + `claim_type`); layer-3 scripts remaining.
**Build inputs (read first)**: `prompts/step1-light-pass.md` (the prompt — its DETERMINISTIC SCAFFOLD section specs every script + hook to build) · `capability_inventory.md` (brick split: A1 query / S1 fetch / S2 clean / dedupe / H1 hooks) · `tools/adlib-one.js` + `tools/crowdfund-fetch.js` (page-ID-resolution + Cloudflare-bypass to inherit) · `run-retrospective.md` §2/§4 + `agents/implementation-notes.md` (fetch lessons: keyword-collision, page-ID resolution, SimilarWeb blocked) · `definitions.md` · `CLAUDE.md`.
**Success Criteria** (what must be TRUE):
  1. `prompts/step1-light-pass.md` emits `brands.json` + `dump.json` + `space-map.json` with the pitch binding (claims↔mechanism↔problem-UM bound, not parallel arrays), per-combo-cell saturation, `revenue_est`, and `claim_type` (direct/enlarged/mechanism/enhanced).
  2. The layer-3 scripts it specs exist — `fetch.js` / `clean.js` / `dedupe.js` / `revenue-est.js` + the rejection-hook JSON — so a run is reproducible (mine `tools/adlib-one.js` + `tools/crowdfund-fetch.js`).
  3. Running on a real T/P/N produces a clean space map with no cross-cell saturation pooling and no layer conflation (feature≠claim, mechanism≠transformation).
  4. Kam scans a bucketed sample and confirms letters / themes / typed claims are assigned the way he would.
**Plans**: 5 plans
- [ ] 01-01-PLAN.md — reconcile step1-light-pass.md: strip awareness (D-05), inline the D-03 sophistication ladder
- [ ] 01-02-PLAN.md — layer-3 fetch + clean scripts (tools/fetch.js, tools/clean.js)
- [ ] 01-03-PLAN.md — layer-3 transform scripts (tools/dedupe.js, tools/revenue-est.js) + adlib-one.js touch-up
- [ ] 01-04-PLAN.md — PostToolUse rejection hooks + four per-agent validators
- [ ] 01-05-PLAN.md — debug run on a reference T/P/N + Kam's bucketed-sample confirmation (UAT)

### Phase 2: Stage M1-S2 — Market-selection gate
**Goal**: The 4-gate market-selection skill (Demand → Product → Sophistication → Awareness) runs candidate NTPs through ordered kill-gates, ranks survivors with per-axis evidence, and presents them for the human bet pick — the calibrated methodology that replaces the bare gap score.
**Serves PMF Step**: 0 gate (Gate 1)
**Depends on**: Stage M1-S1 (the light pass produces the gate inputs)
**Requirements**: GATE-01
**Status**: DRAFTED (`.claude/skills/market-selection/SKILL.md` + verbatim spec `prompts/_specs/market-selection-framework.md`); data-contract wiring remaining.
**Build inputs (read first)**: `.claude/skills/market-selection/SKILL.md` (the skill — its INPUT DATA CONTRACT lists every gate input) · `prompts/_specs/market-selection-framework.md` (the verbatim framework) · `prompts/step1-light-pass.md` (S1 — the upstream producer of the gate inputs) · `workflow.md` Step 0 (the gap variables) · `capability_inventory.md` · `definitions.md`.
**Success Criteria** (what must be TRUE):
  1. The skill runs the four gates in fixed order with the kill rules, stops at the first kill, and outputs ranked survivors citing evidence per axis (exact figures or "not found" — no hand-waving).
  2. The S1 data contract the gates consume is wired: claim-typing ✓ + revenue ✓ in the light pass; trend-shape + adjacent-signals + market-awareness rollup added; any missing input is surfaced as `DATA GAP`, never guessed.
  3. The skill stops at A4 (ranked survivors); the human makes the D1 bet pick, recorded as the input to downstream stages. Per-cell saturation honored; never pooled.
  4. Kam runs candidate NTPs and judges the kill/survive verdicts + ranking sound.
**Plans**: TBD

### Phase 3: Stage M1-S3 — Deep competitive analysis + messaging strategy
**Goal**: Deep analysis of the chosen market's top ~5 brands via two lenses (structure + messaging) over one competitor pool, merged into a deployable plan — proven angles / dead ground / whitespace / container / awareness calibration — with a human Gate 2 win-decision.
**Serves PMF Step**: 2 (+ front-half Step 4)
**Depends on**: Stage M1-S2 (a chosen market)
**Requirements**: (no v1 REQ — specced capability feeding M2; promote when M2 is planned)
**Status**: SPECCED (`prompts/_specs/deep-market-analysis-framework.md`).
**Build inputs (read first)**: `prompts/_specs/deep-market-analysis-framework.md` (the framework) · `prompts/step1-light-pass.md` (the format template + the pitch binding to inherit) · `capability_inventory.md` (brick model) · `run-retrospective.md` §4 (days_running winner detection, SYNTHESIS fencing, survivorship-bias hunt) · `agents/implementation-notes.md` (layer discipline) · `~/knowledge/dr-marketing/` (copywriting/offer/funnel for the messaging merge — read on demand).
**Success Criteria** (what must be TRUE):
  1. A deep-pass prompt is built as a brick string from the framework spec (structure lens + messaging lens + the merge), running only on the chosen market's top ~5 brands.
  2. Winner detection uses `days_running` (longest-running ad = spend-validated); every deliverable fences AI inference from observed competitor copy (SYNTHESIS-block rule).
  3. The merge produces one congruent plan: proven angles, dead ground, whitespace, the funnel container, and per-angle awareness calibration.
  4. Kam reads it and judges the messaging strategy congruent with the differentiated edge from S1/S2 (Gate 2).
**Plans**: TBD

### Phase 4: Stage M1-S4 — VOC codebook + record schema
**Goal**: The classifier codebook exists as a machine contract (PMBD × T1–T4 ladder + battery, compiled), with the per-quote record schema and the two materialized-view contracts defined — the keystone every later VOC stage keys off.
**Serves PMF Step**: 3a / 3b (keystone)
**Depends on**: Nothing (Track B keystone; build first)
**Requirements**: VOC-01, VOC-02
**Status**: SPECCED (`handoff-step3-voc-build.md` §5).
**Success Criteria** (what must be TRUE):
  1. A codebook file exists in `step1-light-pass.md` format with closed enums (PMBD letter, T1–T4 tier, 6 belief surfaces) and open fields (raw theme, trigger, community-vocab) cleanly separated, traceable to `definitions.md` + `workflow.md`.
  2. The per-quote record schema lists every locked field — `raw_text, char_offsets, author_id, permalink, upvotes, pmbd_letter, tier, belief_surface, sub_niche_id, trigger, intensity` — with types/enums.
  3. Two materialized-view contracts are written off the one store: a frequency-brief view (aggregate per sub-niche) and a copy-bank view (per-record, slot-retrievable).
  4. Kam reads the codebook and confirms it captures the PMBD battery without rewording his strategy vocabulary.
**Plans**: TBD

### Phase 5: Stage M1-S5 — Query Planner agent
**Goal**: A Query Planner agent generates the three search lanes (population-wide / in-niche / adjacent-context) for a given niche/transformation and explicitly handles the no-clean-niche-venue case.
**Serves PMF Step**: 3a
**Depends on**: Stage M1-S4 (codebook defines what's queried for)
**Requirements**: VOC-03
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. Given a niche + transformation seed, the agent emits three labeled lanes as concrete subreddit/query targets.
  2. When no clean anchor subreddit exists (behavior-defined niche), it produces a documented fallback rather than inventing a fake venue.
  3. An optional manual seed-injection slot is available but not required to run.
  4. Kam reads a sample lane plan and judges the venues sensible.
**Plans**: TBD

### Phase 6: Stage M1-S6 — Scraper + cleaner + verbatim gate
**Goal**: A Reddit scraper on the official commercial API pulls posts with full source metadata; a thin cleaner keeps a raw immutable copy; a hook string-matches every extracted span to source and rejects mismatches.
**Serves PMF Step**: 3a
**Depends on**: Stage M1-S4 (schema), Stage M1-S5 (query outputs)
**Requirements**: VOC-04, VOC-05
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. The scraper runs on Reddit's official commercial API and persists `author_id`, `permalink`, `timestamp`, `upvotes` on every record.
  2. The cleaner writes a raw immutable copy and normalizes only a separate working copy, so char-offsets index into the untouched raw text.
  3. The verbatim-gate hook slices a span by `(author_id, source, char-offsets)`, string-verifies against the raw copy, and rejects on mismatch — no LLM emits quote text.
  4. A manual test with a deliberately altered span is rejected; a correct span passes.
**Plans**: TBD

### Phase 7: Stage M1-S7 — Bucketer (pass 1) + intensity scorer
**Goal**: The Bucketer agent classifies the whole corpus cheaply — PMBD letter + raw theme + counter-signal flag + community-vocab flag — returning row-ids + tags only; a deterministic intensity scorer ranks every record without discarding any.
**Serves PMF Step**: 3a
**Depends on**: Stage M1-S4, Stage M1-S6
**Requirements**: VOC-06, VOC-07
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. The Bucketer runs via cheap-filter → classify and returns `(row_id, pmbd_letter, raw_theme, counter_signal, vocab_flag)` tuples with zero quote text emitted.
  2. The intensity scorer assigns every record a score from VADER + engagement + length, deterministically, deleting nothing (low-intensity records persist, ranked low).
  3. Off-list PMBD letters are hook-rejected; raw-theme open text is captured verbatim.
  4. Kam scans a bucketed sample and confirms letters/themes are assigned the way he would.
**Plans**: TBD

### Phase 8: Stage M1-S8 — Frequency + co-occurrence clustering
**Goal**: Deterministic scripts compute unique-user frequency (synonym-deduped) and a binary user×theme incidence matrix, clustering users into candidate sub-niches and auto-selecting hot clusters — the novel per-individual co-occurrence piece.
**Serves PMF Step**: 3a
**Depends on**: Stage M1-S7
**Requirements**: VOC-08
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. Frequency is counted by unique users (one prolific poster ≠ a trend), synonym codes union-find-deduped before counting.
  2. A binary user×theme incidence matrix captures ALL of a user's qualifying quotes — never best-post scoring.
  3. A clustering method (k-modes / LCA / Leiden) groups users into candidate sub-niches; hot clusters auto-flagged as pass-2 targets.
  4. Candidate sub-niches surface with unique-user co-occurrence counts so the 5+ single-individual rule is checkable.
**Plans**: TBD

### Phase 9: Stage M1-S9 — Ladderer (pass 2)
**Goal**: The Ladderer agent deep-dives the hot clusters only — assigning T1–T4 tier and extracting copy-ready verbatim spans (as offsets), with the driver read once per sub-niche cluster.
**Serves PMF Step**: 3b
**Depends on**: Stage M1-S8
**Requirements**: VOC-09
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. The Ladderer runs only on auto-selected hot clusters, not the whole corpus.
  2. Each laddered record carries a T1–T4 tier and copy-ready spans as `(author_id, source, char-offsets)` — passing the S6 verbatim gate.
  3. The driver is read once per sub-niche cluster, not per quote.
  4. Kam reviews a laddered hot cluster and confirms tier assignments match his ladder.
**Plans**: TBD

### Phase 10: Stage M1-S10 — Language Analyzer + copy bank
**Goal**: The Language Analyzer organizes the verbatim by theme / sub-niche / tier into copy-ready units (light-clean only, never reword) and persists to the copy-bank store, materializing both the frequency brief and the copy bank.
**Serves PMF Step**: 3b
**Depends on**: Stage M1-S9
**Requirements**: VOC-10
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. Verbatim is organized into copy-ready units grouped by theme / sub-niche / PMBD-tier; no customer sentence is reworded or authored by the agent.
  2. The copy-bank store persists per-quote records retrievable by slot (theme / sub-niche / tier).
  3. The two materialized views — frequency brief and copy bank — both render off the single store.
  4. A spot-check confirms every stored quote traces to a live permalink + char-offsets in the raw copy.
**Plans**: TBD

### Phase 11: Stage M1-S11 — End-to-end VOC UAT
**Goal**: The full VOC pipeline runs end-to-end on a reference subreddit and Kam reads the resulting copy bank — the M1 VOC acceptance gate.
**Serves PMF Step**: 3a / 3b validation
**Depends on**: Stage M1-S10
**Requirements**: VOC-11
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. One run takes a reference subreddit from scrape → bucket → frequency/cluster → ladder → copy bank with no manual hand-patching between stages.
  2. The output copy bank is populated with attributed verbatim (permalinks resolve) organized by sub-niche and tier.
  3. Kam reads the copy bank end-to-end and judges it trustworthy and reusable (the M1 core-value test).
  4. Any failure surfaces as a readable artifact (which stage, which records), not a silent drop.
**Plans**: TBD

### Phase 12: Stage M1-S12 — Tooling templatization + deliverable templates
**Goal**: The Step 0/1 tooling is made reusable — `step1-light-pass.md` parameterized into niche/transformation/venue slots, plus a standalone `deliverable-templates.md` and an agent-brief template.
**Serves PMF Step**: 0, 1
**Depends on**: Stage M1-S1
**Requirements**: TOOL-01, TOOL-02
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. `step1-light-pass.md` has parameterized niche / transformation / venue slots; a new run uses it without editing the spec body.
  2. A standalone `deliverable-templates.md` consolidates the output schemas.
  3. A standalone agent-brief template captures role + inputs + rules + schema + self-audit checklist + output path.
  4. Kam points a fresh hypothetical run at the templates and confirms nothing instance-specific is hardcoded.
**Plans**: TBD

### Phase 13: Stage M1-S13 — Step 3c mechanism research
**Goal**: Mechanism (UM) research is run on the winning market's transformation, producing a mechanism doc + product-candidate list.
**Serves PMF Step**: 3c
**Depends on**: Stage M1-S2 (the selected bet)
**Requirements**: UM-01
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. A mechanism doc explains the winning transformation's underlying mechanism, sourced (scite / web).
  2. A product-candidate list is produced, filtered against avatar fit / believability / economics heuristics.
  3. Kam reads the mechanism doc + candidate list and judges them sufficient to inform a future test design.
**Plans**: TBD

### Phase 14: Stage M1-S14 — Step 3d loop-back
**Goal**: The Step 0/1 hypothesis records are revised given Step 3a/3b/3c learnings — augment, not overwrite, with `depth_pass` + `extracted_at` versioning.
**Serves PMF Step**: 3d
**Depends on**: Stage M1-S10 (copy bank), Stage M1-S13 (mechanism research)
**Requirements**: LOOP-01
**Status**: SPECCED.
**Success Criteria** (what must be TRUE):
  1. The original Step 0/1 hypothesis records are updated by augmentation — prior values preserved, not overwritten.
  2. Each revised record carries a `depth_pass` marker and an `extracted_at` timestamp.
  3. Kam can diff before/after and see exactly what Step 3 changed about the original bet.
**Plans**: TBD

## Progress

**Execution order:** Two parallel tracks. Track A: S1 → S2 → S3 (pick a market, then study it). Track B
(VOC): S4 keystone → S5 → S6 → S7 → S8 → S9 → S10 → S11. Cross-cutting: S12 (any time), S13 (after S2),
S14 (after S10 + S13). Tracks A and B are independent — run in parallel `git worktree` sessions.

| Phase | Stage | Status | Plans |
|-------|-------|--------|-------|
| 1 | M1-S1 Light pass | Built (scripts pending) | 0/TBD |
| 2 | M1-S2 Market-selection gate | Drafted | 0/TBD |
| 3 | M1-S3 Deep competitive analysis | Specced | 0/TBD |
| 4 | M1-S4 VOC codebook (keystone) | Specced | 0/TBD |
| 5 | M1-S5 Query Planner | Specced | 0/TBD |
| 6 | M1-S6 Scraper + cleaner + gate | Specced | 0/TBD |
| 7 | M1-S7 Bucketer + intensity | Specced | 0/TBD |
| 8 | M1-S8 Frequency + co-occurrence | Specced | 0/TBD |
| 9 | M1-S9 Ladderer | Specced | 0/TBD |
| 10 | M1-S10 Language Analyzer + copy bank | Specced | 0/TBD |
| 11 | M1-S11 End-to-end VOC UAT | Specced | 0/TBD |
| 12 | M1-S12 Templatization | Specced | 0/TBD |
| 13 | M1-S13 Mechanism research | Specced | 0/TBD |
| 14 | M1-S14 Loop-back | Specced | 0/TBD |

---

## Next milestone: M2 — Launch / Execution Engine (deferred)

M2 (PMF Steps 4–8 + the `launch/` Shopify/Klaviyo/LP machinery generalized into a reusable new-store
setup) is the next milestone, deliberately deferred. Plan it via `/gsd-new-milestone` after M1 produces
a validated bet + copy bank. Source state in `launch/README.md`.

---

*Rewritten 2026-06-03: two-track research engine, build-state-aware, InkLeaf retired — kept in GSD
`### Phase N` format so the tooling resolves stages. Supersedes the prior VOC-only 12-stage roadmap.*
