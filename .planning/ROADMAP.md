# Roadmap: PMF — Milestone 1 (Research Engine)

> **Naming reconciliation (locked).** GSD's internal phase index (1, 2, 3…) is mechanical bookkeeping only. The human-facing identifier for each build unit is the **Stage** (`M1-S{n}`), never a bare "Phase N". **"Phase" is reserved for PMF research workflow steps 0–8** (`workflow.md`) and appears below only as a *serves* context label, never as an identifier. So: GSD phase-1 = build **Stage M1-S1**, GSD phase-2 = **Stage M1-S2**, and so on. See `BUILD-STATE.md` §NUMBERING/NAMING RECONCILIATION.

## Overview

M1 builds the reusable **research engine** — the asset everything downstream is built from. Its critical path is the **Phase 3 VOC pipeline** (Stages M1-S1 → M1-S8): a codebook-keyed, one-job-per-agent chain that turns a Reddit corpus into a queryable bank of real, attributed customer verbatim plus a frequency/co-occurrence structural map. Two side tracks run independent of the VOC chain: tooling templatization (M1-S9) and the Gate 1 market-bet selection (M1-S10), which then unblocks mechanism research (M1-S11) and the loop-back that revises the original hypothesis (M1-S12). Verification throughout is **UAT, not unit tests** — run the thing on a reference subreddit and Kam reads the output. InkLeaf (`runs/eink-tablets/`) is the first instance and the UAT corpus, never a rebuild target.

**Critical path:** M1-S1 → S2 → S3 → S4 → S5 → S6 → S7 → S8 (the VOC chain).
**Parallel tracks:** M1-S9 (tooling) and M1-S10 (Gate 1) are independent of the VOC chain and runnable any time. M1-S11 depends on S10; M1-S12 depends on S7 + S11.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Each integer phase below = one PMF build **Stage** (`M1-S{n}`). The Stage is the identifier; the GSD phase index is mechanical.

- [ ] **Stage M1-S1: Codebook + record schema** — the keystone machine contract; everything keys off it
- [ ] **Stage M1-S2: Query Planner agent** — three-lane Reddit query generation + no-clean-venue handling
- [ ] **Stage M1-S3: Scraper + cleaner + verbatim gate** — official-API scrape, raw-immutable cleaner, string-match gate
- [ ] **Stage M1-S4: Bucketer agent (pass 1) + cheap filter** — letter + theme + counter-signal + vocab on whole corpus
- [ ] **Stage M1-S5: Frequency + co-occurrence / clustering** — unique-user counts; user×theme matrix → sub-niches
- [ ] **Stage M1-S6: Ladderer agent (pass 2)** — T1–T4 tier + verbatim spans on hot clusters only
- [ ] **Stage M1-S7: Language Analyzer + copy bank store** — organize verbatim into the queryable copy bank
- [ ] **Stage M1-S8: End-to-end UAT** — run the pipeline on a reference subreddit; Kam reads the copy bank
- [ ] **Stage M1-S9: Phase 0/1 agent templatization** — parameterize light-pass + extract deliverable/brief templates
- [ ] **Stage M1-S10: Gate 1 three-way comparison + bet selection** — cross-score 3 markets, pick the InkLeaf bet
- [ ] **Stage M1-S11: Phase 3c mechanism research** — UM research on the winning market's transformation
- [ ] **Stage M1-S12: Phase 3d loop back** — revise the Phase 0/1 hypothesis given Phase 3 learnings

## Phase Details

### Phase 1: Stage M1-S1 — Codebook + record schema
**Goal**: The classifier codebook exists as a machine contract (PMBD × T1–T4 ladder + battery, compiled), with the per-quote record schema and the two materialized-view contracts defined — the keystone every later stage keys off.
**Serves PMF Phase**: 3a / 3b (keystone)
**Depends on**: Nothing (first; keystone)
**Requirements**: VOC-01, VOC-02
**Success Criteria** (what must be TRUE):
  1. A codebook file exists in `phase1-light-pass.md` format with closed enums (PMBD letter, T1–T4 tier, 6 belief surfaces) and open fields (raw theme, trigger, community-vocab) clearly separated, traceable to `definitions.md` + `workflow.md`.
  2. The per-quote record schema lists every locked field — `raw_text, char_offsets, author_id, permalink, upvotes, pmbd_letter, tier, belief_surface, sub_niche_id, trigger, intensity` — with types/enums.
  3. Two materialized-view contracts are written off the one store: a frequency-brief view (aggregate per sub-niche) and a copy-bank view (per-record, slot-retrievable).
  4. Kam can read the codebook and confirm it captures the PMBD battery without rewording any of his strategy vocabulary.
**Plans**: TBD

### Phase 2: Stage M1-S2 — Query Planner agent
**Goal**: A Query Planner agent generates the three search lanes for a given niche/transformation and explicitly handles the no-clean-niche-venue case.
**Serves PMF Phase**: 3a
**Depends on**: Stage M1-S1 (codebook defines what's being queried for)
**Requirements**: VOC-03
**Success Criteria** (what must be TRUE):
  1. Given a niche + transformation seed, the agent emits three labeled lanes — population-wide, in-niche, adjacent-context — as concrete subreddit/query targets.
  2. When no clean anchor subreddit exists (e.g. behavior-defined "dumb-device"), the agent produces a documented fallback strategy rather than failing or inventing a fake venue.
  3. An optional manual seed-injection slot is available but not required to run.
  4. Kam reads a sample lane plan for a reference niche and judges the venues sensible.
**Plans**: TBD

### Phase 3: Stage M1-S3 — Scraper + cleaner + verbatim gate
**Goal**: A Reddit scraper on the official commercial API pulls posts with full source metadata; a thin cleaner keeps a raw immutable copy; a hook string-matches every extracted span to source and rejects mismatches.
**Serves PMF Phase**: 3a
**Depends on**: Stage M1-S1 (schema), Stage M1-S2 (query outputs)
**Requirements**: VOC-04, VOC-05
**Success Criteria** (what must be TRUE):
  1. The scraper runs on Reddit's official commercial API and persists `author_id`, `permalink`, `timestamp`, and `upvotes` on every record.
  2. The cleaner writes a raw immutable copy and normalizes only a separate working copy, so char-offsets index into the untouched raw text.
  3. The verbatim-gate hook slices a span by `(author_id, source, char-offsets)`, string-verifies against the raw copy, and rejects on any mismatch — no LLM emits quote text.
  4. A manual test of the gate with a deliberately altered span is rejected; a correct span passes.
**Plans**: TBD

### Phase 4: Stage M1-S4 — Bucketer agent (pass 1) + cheap filter
**Goal**: The Bucketer agent classifies the whole corpus cheaply — PMBD letter + raw theme + counter-signal flag + community-vocab flag — returning row-ids + tags only, never quote text; a deterministic intensity scorer ranks every record without discarding any.
**Serves PMF Phase**: 3a
**Depends on**: Stage M1-S1, Stage M1-S3
**Requirements**: VOC-06, VOC-07
**Success Criteria** (what must be TRUE):
  1. The Bucketer runs on the full corpus via a cheap-filter → classify two-stage and returns `(row_id, pmbd_letter, raw_theme, counter_signal, vocab_flag)` tuples with zero quote text emitted.
  2. The intensity scorer assigns every record a score from VADER + engagement + length, deterministically, deleting nothing (low-intensity records persist, ranked low).
  3. Off-list PMBD letters are hook-rejected; raw-theme open text is captured verbatim.
  4. Kam can scan a bucketed sample and confirm letters/themes are assigned the way he'd assign them.
**Plans**: TBD

### Phase 5: Stage M1-S5 — Frequency + co-occurrence / clustering
**Goal**: Deterministic scripts compute unique-user frequency (synonym-deduped) and a binary user×theme incidence matrix, clustering users into candidate sub-niches and auto-selecting hot clusters as deep-dive targets — the novel per-individual co-occurrence piece.
**Serves PMF Phase**: 3a (structural output)
**Depends on**: Stage M1-S4
**Requirements**: VOC-08
**Success Criteria** (what must be TRUE):
  1. Frequency is counted by unique users (one prolific poster ≠ a trend), with synonym codes union-find-deduped before counting.
  2. A binary user×theme incidence matrix is built capturing ALL of a user's qualifying quotes — never best-post scoring.
  3. A clustering method (k-modes / LCA / Leiden) groups users into candidate sub-niches; hot clusters (high freq × tight co-occurrence) are auto-flagged as pass-2 targets.
  4. Candidate sub-niches surface with their unique-user co-occurrence counts so the 5+ single-individual rule can be checked.
**Plans**: TBD

### Phase 6: Stage M1-S6 — Ladderer agent (pass 2)
**Goal**: The Ladderer agent deep-dives the hot clusters only — assigning T1–T4 tier and extracting copy-ready verbatim spans (as offsets), with the driver read once per sub-niche cluster.
**Serves PMF Phase**: 3b
**Depends on**: Stage M1-S5 (hot clusters from frequency)
**Requirements**: VOC-09
**Success Criteria** (what must be TRUE):
  1. The Ladderer runs only on auto-selected hot clusters, not the whole corpus.
  2. Each laddered record carries a T1–T4 tier and copy-ready verbatim spans expressed as `(author_id, source, char-offsets)` — passing the M1-S3 verbatim gate.
  3. The driver is read once per sub-niche cluster (a cluster-level property), not per quote.
  4. Kam reviews a laddered hot cluster and confirms tier assignments match his ladder.
**Plans**: TBD

### Phase 7: Stage M1-S7 — Language Analyzer + copy bank store
**Goal**: The Language Analyzer organizes the verbatim by theme / sub-niche / tier into copy-ready units (light-clean only, never reword) and persists to the copy-bank store, materializing both the frequency brief and the copy bank.
**Serves PMF Phase**: 3b (output)
**Depends on**: Stage M1-S6
**Requirements**: VOC-10
**Success Criteria** (what must be TRUE):
  1. Verbatim is organized into copy-ready units grouped by theme / sub-niche / PMBD-tier; no customer sentence is reworded or authored by the agent.
  2. The copy-bank store persists per-quote records retrievable by slot (theme / sub-niche / tier).
  3. The two materialized views — frequency brief and copy bank — both render off the single store.
  4. A spot-check confirms every stored quote still traces to a live permalink + char-offsets in the raw copy.
**Plans**: TBD

### Phase 8: Stage M1-S8 — End-to-end UAT
**Goal**: The full pipeline runs end-to-end on a reference subreddit and Kam reads the resulting copy bank — the M1 critical-path acceptance gate.
**Serves PMF Phase**: 3a / 3b validation
**Depends on**: Stage M1-S7
**Requirements**: VOC-11
**Success Criteria** (what must be TRUE):
  1. One command/run takes a reference subreddit from scrape → bucket → frequency/cluster → ladder → copy bank with no manual hand-patching between stages.
  2. The output copy bank is populated with attributed verbatim (permalinks resolve) organized by sub-niche and tier.
  3. Kam reads the copy bank end-to-end and judges it trustworthy and reusable (the M1 core-value test).
  4. Any failure surfaces as a readable artifact (which stage, which records), not a silent drop.
**Plans**: TBD

### Phase 9: Stage M1-S9 — Phase 0/1 agent templatization
**Goal**: The Phase 0/1 tooling is made reusable — `phase1-light-pass.md` parameterized into niche/transformation/venue slots, plus a standalone `deliverable-templates.md` and an agent-brief template extracted from existing briefs.
**Serves PMF Phase**: 0, 1
**Depends on**: Nothing (parallel-runnable with M1-S1 through M1-S8)
**Requirements**: TOOL-01, TOOL-02
**Success Criteria** (what must be TRUE):
  1. `phase1-light-pass.md` (finder / verifier / dumper / classifier) has parameterized niche / transformation / venue slots; a new run uses it without editing the spec body.
  2. A standalone `deliverable-templates.md` consolidates 10+ output schemas described in `run-retrospective.md` §3.
  3. A standalone agent-brief template captures role + inputs + rules + schema + self-audit checklist + output path.
  4. Kam can point a fresh hypothetical run at the templates and confirm nothing InkLeaf-specific is hardcoded.
**Plans**: TBD

### Phase 10: Stage M1-S10 — Gate 1 three-way comparison + bet selection
**Goal**: The three existing market profiles (faith / students / dumb-device) are cross-scored on Desire × Feasibility − Sophistication × Growth and the InkLeaf market bet is selected (human decision, framework-assisted).
**Serves PMF Phase**: 0 gate
**Depends on**: Nothing for tooling (uses existing `runs/eink-tablets/markets/`); independent of the VOC chain
**Requirements**: GATE-01
**Success Criteria** (what must be TRUE):
  1. All three profiles are scored on the four axes in one comparable artifact (the three existing profiles are the inputs, not regenerated).
  2. A written rationale accompanies the scores, surfacing the genuine forks rather than a bare number.
  3. Kam selects one InkLeaf market bet and the decision is recorded as the input to M1-S11.
**Plans**: TBD

### Phase 11: Stage M1-S11 — Phase 3c mechanism research
**Goal**: Mechanism (UM) research is run on the winning market's transformation, producing a mechanism doc + product-candidate list.
**Serves PMF Phase**: 3c
**Depends on**: Stage M1-S10 (need the selected bet)
**Requirements**: UM-01
**Success Criteria** (what must be TRUE):
  1. A mechanism doc explains the winning transformation's underlying mechanism, sourced (scite / web), for the market chosen in M1-S10.
  2. A product-candidate list is produced, filtered against avatar fit / believability / economics heuristics.
  3. Kam reads the mechanism doc + candidate list and judges them sufficient to inform a future test design.
**Plans**: TBD

### Phase 12: Stage M1-S12 — Phase 3d loop back
**Goal**: The Phase 0/1 hypothesis records are revised given Phase 3a/3b/3c learnings — augment, not overwrite, with `depth_pass` + `extracted_at` versioning.
**Serves PMF Phase**: 3d
**Depends on**: Stage M1-S7 (copy bank), Stage M1-S11 (mechanism research)
**Requirements**: LOOP-01
**Success Criteria** (what must be TRUE):
  1. The original Phase 0/1 hypothesis records are updated with Phase 3 learnings by augmentation — prior values are preserved, not overwritten.
  2. Each revised record carries a `depth_pass` marker and an `extracted_at` timestamp so the version history is legible.
  3. Kam can diff before/after and see exactly what Phase 3 changed about the original bet.
**Plans**: TBD

## Progress

**Execution Order:**
Critical path 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Stages 9 and 10 are independent of the VOC chain and may run in parallel. 11 follows 10; 12 follows 7 and 11.

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. M1-S1 Codebook + record schema | 0/TBD | Not started | - |
| 2. M1-S2 Query Planner agent | 0/TBD | Not started | - |
| 3. M1-S3 Scraper + cleaner + verbatim gate | 0/TBD | Not started | - |
| 4. M1-S4 Bucketer agent (pass 1) + cheap filter | 0/TBD | Not started | - |
| 5. M1-S5 Frequency + co-occurrence / clustering | 0/TBD | Not started | - |
| 6. M1-S6 Ladderer agent (pass 2) | 0/TBD | Not started | - |
| 7. M1-S7 Language Analyzer + copy bank store | 0/TBD | Not started | - |
| 8. M1-S8 End-to-end UAT | 0/TBD | Not started | - |
| 9. M1-S9 Phase 0/1 agent templatization | 0/TBD | Not started | - |
| 10. M1-S10 Gate 1 three-way comparison + bet selection | 0/TBD | Not started | - |
| 11. M1-S11 Phase 3c mechanism research | 0/TBD | Not started | - |
| 12. M1-S12 Phase 3d loop back | 0/TBD | Not started | - |

---

## Next milestone: M2 — Launch / Execution Engine (deferred)

M2 (the launch/execution engine — PMF Phases 4–8 plus the InkLeaf crowdfunding fold: test design, language packs, hook test, deposit-funnel build, belief-installation sequence, creatives, eval, iterate-or-destroy) is the **next milestone**, deliberately deferred by rolling-wave decision and **not enumerated as phases here**. It depends on M1 completing (copy bank + UM candidates). Its full stage breakdown is recorded in `BUILD-STATE.md` §"Milestone 2 — Launch/Execution Engine"; plan it only after M1 shakes out.
