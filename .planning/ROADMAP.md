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

- [ ] **Stage M1-S0: Pre-research planning (bet brief)** — `SEEDED` (not built); the deliberate pre-Step-1 step that authors the per-run bet brief + pipeline inputs. Hand-filled from `prompts/_templates/pre-research-plan.template.md` for now (worked example: `runs/arduview/pre-research-plan.md`); the generator skill is deferred until the operator architects it. Phase 1 already consumes the brief (D-13).
- [~] **Stage M1-S1: Light pass** — `BUILT`; competitor find + space classify (feeds Gate 1)
- [~] **Stage M1-S2: Market-selection gate** — `DRAFTED`; 4 gates → ranked survivors → human pick
- [ ] **Stage M1-S3: Deep competitive analysis (collection layer)** — `PLANNED` (4 plans)
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
**Requirements**: TOOL-01 (partial), BET-01, TREND-01, NET-01
**Status**: BUILT but **needs revision** — structural feedback folded into CONTEXT 2026-06-03 (bet brief, `demand_trend` + Trends source, open `bet_type`, wide-net Finder, multi-domain examples). Built-but-unrun; deltas hit 01-01/02/04. RE-PLAN PENDING.
**Build inputs (read first)**: `01-CONTEXT.md` (decisions incl. the 2026-06-03 revision + the `<revision_impact>` block — read FIRST) · `prompts/step1-light-pass.md` (the prompt being edited) · `prompts/_templates/pre-research-plan.template.md` + `runs/arduview/pre-research-plan.md` (the bet brief Phase 1 consumes) · `capability_inventory.md` · `tools/adlib-one.js` + `tools/crowdfund-fetch.js` (inherit) · `run-retrospective.md` §2/§4 + `agents/implementation-notes.md` · `definitions.md` · `CLAUDE.md`.
**Success Criteria** (what must be TRUE):
  1. `prompts/step1-light-pass.md` emits `brands.json` + `dump.json` + `space-map.json` with the pitch binding, per-combo-cell saturation, `revenue_est`, and `claim_type` (direct/enlarged/mechanism/enhanced).
  2. The layer-3 scripts exist — `fetch.js` / `clean.js` / `dedupe.js` / `revenue-est.js` + the rejection-hook JSON — so a run is reproducible.
  3. Running on a real T/P/N produces a clean space map with no cross-cell saturation pooling and no layer conflation (feature≠claim, mechanism≠transformation).
  4. Kam scans a bucketed sample and confirms letters / themes / typed claims are assigned the way he would.
  5. The agents consume a per-run **bet brief** as prose context (D-13); `fetch.js` reads the brief's `PIPELINE INPUTS` (LP-hunt terms + comparable seeds + trend toggle), NOT a hardcoded template (D-16); the brief is never hook-validated.
  6. Each brand carries a populated `demand_trend` (shape + window + source + basis) fed by a real Google Trends fetch (D-15); the durability column is not empty `unknown` across the board.
  7. `bet_type` is an OPEN classifier-named/clustered/evidence-traced field with a `bet_type_basis` (amended D-12); no `competitive_axis` closed enum remains; the Finder casts a wide net by substitutability AND bet-similarity (D-17).
**Plans**: 5 built + re-plan pending (see `01-CONTEXT.md` `<revision_impact>`)
- [x] 01-01-PLAN.md — **needs revision**: open `bet_type`, `<bet_brief>` consumption, `demand_trend` field, wide-net Finder, multi-domain examples, provenance note
- [x] 01-02-PLAN.md — **needs revision**: add Google Trends source, read LP-hunt from the bet brief
- [x] 01-03-PLAN.md — unaffected
- [x] 01-04-PLAN.md — **needs revision**: validate-classifier open `bet_type` + `demand_trend`-missing reject
- [ ] 01-05-PLAN.md — debug run (runs once after the revisions land; consumes the Arduview brief)

### Phase 2: Stage M1-S2 — Market-selection gate
**Goal**: The 4-gate market-selection skill (Demand → Product → Sophistication → Awareness) runs candidate NTPs through ordered kill-gates, ranks survivors with per-axis evidence, and presents them for the human bet pick — the calibrated methodology that replaces the bare gap score.
**Serves PMF Step**: 0 gate (Gate 1)
**Depends on**: Stage M1-S1 (the light pass produces the gate inputs)
**Requirements**: GATE-01
**Status**: DRAFTED. Authoritative decision procedure = `prompts/_specs/market-selection-assessor-spec.md` (the assessor agent spec — supersedes the older `market-selection-framework.md`). The existing `.claude/skills/market-selection/SKILL.md` is STALE (full awareness Gate 4, no demand_trend/bet_type) — bring it in line. Remaining: reconcile the assessor INPUT CONTRACT to the post-2026-06-03 S1 output (competitive_axis → OPEN bet_type per amend-D-12; demand_trend/run_length_days now present; awareness dropped → Gate 4 deferred), then wire it.
**Build inputs (read first)**: `prompts/_specs/market-selection-assessor-spec.md` (AUTHORITATIVE — the four-gate decision procedure, marketing knowledge, resolved judgments; carries a reconciliation note on the stale input field) · `.claude/skills/market-selection/SKILL.md` (the build target to bring in line — currently stale) · `prompts/_specs/market-selection-framework.md` (older framework, superseded by the assessor spec) · `prompts/step1-light-pass.md` (S1 — the upstream producer; its current schema IS the real input contract: bet_type, demand_trend, run_length_days, per-cell saturation, no awareness) · `workflow.md` Step 0 (the gap variables) · `capability_inventory.md` · `definitions.md`.
**Success Criteria** (what must be TRUE):
  1. The skill runs the four gates in fixed order with the kill rules, stops at the first kill, and outputs ranked survivors citing evidence per axis (exact figures or "not found" — no hand-waving).
  2. The S1 data contract the gates consume is wired to the CURRENT S1 output: claim-typing ✓ + revenue ✓ + demand_trend ✓ + run_length_days/structured ads ✓ + OPEN bet_type (Gate 2.2 reads it, no closed axis enum). Awareness is NOT an S1 input (dropped, D-05) → Gate 4 is deferred to the deep-research step, survivors marked provisional. Any missing/`unknown` input is surfaced as `DATA GAP`, never guessed.
  3. The skill runs Gates 1–3, stops at the first kill, outputs a ranked PROVISIONAL survivor set (Gate 4 pending); the human makes the bet pick, recorded as the input to downstream stages. Per-cell saturation honored; never pooled.
  4. Kam runs candidate NTPs and judges the kill/survive verdicts + ranking sound.
**Plans**: 2 plans (2 waves)
- [x] 02-01-PLAN.md — Rewrite SKILL.md in place: inline the spec, reconcile the input contract to real S1 output, wire D-01..D-10, resolve the repo-root path mismatch, inject DR-KB via read_first (Wave 1)
- [x] 02-02-PLAN.md — Exercise the rewritten skill against real Arduview data → produce runs/arduview/market-selection.md (6 per-cell gate records); Kam judges verdicts + ranking sound (Wave 2, human UAT)

### Phase 3: Stage M1-S3 — Deep competitive analysis (collection layer)
**Goal**: Build the COLLECTION LAYER of deep funnel analysis as a market-agnostic, ready-to-run brick string — scraper/assembler (ad→LP binding) → cleaner → two-currency validation scorer → light routing agent → Section Analyzer → JSON store — that emits validated belief-instance records + funnel-level fields, granular enough to feed a later birdseye synthesis agent. No market is picked yet; every component is parameterized on a chosen-market input. (Scope shrunk 2026-06-03, D-01.)
**Serves PMF Step**: 2 (collection half)
**Depends on**: Stage M1-S2 (a chosen market — for the real run; the build itself is market-agnostic)
**Requirements**: (no v1 REQ — specced capability feeding M2; promote when M2 is planned)
**Status**: PLANNED (4 plans, verified). Spec: `prompts/_specs/funnel-analysis-collection-spec.md` (collection-layer build spec, authoritative); `prompts/_specs/deep-market-analysis-framework.md` kept for the strategic "why".
**Build inputs (read first)**: `prompts/_specs/funnel-analysis-collection-spec.md` (THE build spec — §2b binding, §3 two currencies, §4 routing flag, §5–§8 analyzer, §6 schema, §7 taxonomy, §11 DR injection) · `prompts/step1-light-pass.md` (Phase-1 brick-string + JSON-output template to inherit) · `capability_inventory.md` (brick model) · `~/knowledge/dr-marketing/` (the six files auto-injected into the Section Analyzer, §11).
**Success Criteria** (what must be TRUE):
  1. The collection layer is built as a market-agnostic brick string (scraper/assembler · cleaner · scorer · router · Section Analyzer · store), each component mapped to its brick (deterministic = script/hook, judgment = agent) and runnable the moment a market exists.
  2. The ad→LP binding (normalized `destination_url` clustering) correctly assembles one `funnel_package` per funnel and handles the D-05 edge cases; the two validation currencies (A: ad-longevity, B: crowdfunding raise) are carried as separate lanes, never normalized.
  3. The Section Analyzer emits belief-instance records per the §6 schema — open-with-anchors taxonomy, funnel-level-ordinal `position`, granular `execution_detail` (sub-claims recoverable) — descriptive-not-prescriptive, one funnel at a time; the §10 birdseye-completeness check passes (records sufficient to feed the later merge without re-collection).
  4. A plumbing smoke test re-pulls 1–2 real brands with the new `destination_url` field end-to-end (cluster → render → clean → score) and a throwaway temp run confirms the analyzer emits belief records; the real methodology-debug pass is deferred until a market exists (D-02/D-17).
**Deferred to a later phase**: the BIRDSEYE synthesis agent (A4→D1) — the merge / proven-angles / dead-ground / whitespace / awareness-calibration / Gate-2 win-decision. Collection records here are confirmed sufficient to feed it (spec §10).
**Plans**: 4 plans (4 waves) — collection layer only; birdseye merge + Gate 2 deferred.
- [x] 03-01-PLAN.md — Scraper binding spine: extend adlib-one.js (destination_url) + funnel-assemble.js (normalize/cluster/render) (Wave 1)
- [x] 03-02-PLAN.md — Mechanical bricks: crowdfund-fetch Currency-B parser + funnel-clean + funnel-score (Wave 2)
- [x] 03-03-PLAN.md — Judgment agent: funnel-deep-pass.md (Router + Section Analyzer) + inject-dr.js + validate-analyzer.js (Wave 3)
- [x] 03-04-PLAN.md — Store (funnel-store.js) + ROADMAP rewrite + debug-notes scaffold + live smoke test (Wave 4)

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
| 2 | 2/2 | Complete   | 2026-06-04 |
| 3 | 4/4 | Complete   | 2026-06-04 |
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

### Phase 15: Stage M1-S15 — Funnel Architect + Copywriter (Step-4 copy generation)
**Goal**: Two coupled judgment skills exist that turn the deep-analysis funnel store into finished crowdfunding copy. The **Funnel Architect** reads the funnel store (funnel fields + belief_records[]) + deterministically-injected DR knowledge + operator run-context, and produces a congruent funnel DESIGN + COPY BRIEF (belief chain in order, install spec per belief, single governing angle, awareness-calibrated structure, offer/urgency, dead-ground/whitespace). The **Copywriter** consumes that brief + per-section RAG'd verbatim copy and writes the finished prose in the locked format. Both are operator-spec'd; this phase builds them together so the shared copy-brief contract is designed with producer AND consumer in view.
**Serves PMF Step**: 4 (test design / copy generation — the downstream "Step-4 machinery")
**Depends on**: Stage M1-S3 (the Section Analyzer + funnel store that produces belief_records). HARD DATA DEPENDENCY: the store is EMPTY except a synthetic fixture until a real market run — built + verified against the fixture now; live-on-real-funnels validation rides D-02.
**Requirements**: FUNNEL-01 (architect), FUNNEL-02 (copywriter)
**Status**: SPECCED. Operator specs in hand (Funnel Architect Skill + Copywriter Skill prompts) = behavior authority.
**Reuses (already built this session, to be committed as the base)**: `tools/lib/embed.js`, `tools/funnel-vectorize.js`, `tools/funnel-rag-query.js` (Voyage RAG), `runs/_fixture/funnels/` (verification scaffold). The interim `.claude/skills/copywrite/` wiring stub is REPLACED by the real copywriter and removed.
**Known gaps from audit (resolve in planning, do not pre-decide)**:
  - `belief_kind` (crowdfunding-specific | general-DR) — assumed per-belief by the specs; ABSENT from the 6a/6b schema. Decide: extend the Section Analyzer upstream, or derive in the architect.
  - `source_routing` (per-belief) — ABSENT; only funnel-level `routing_flag` + `source_type` exist. Decide if per-belief routing is needed.
  - RAG cannot scope by source — `funnel-rag-query.js` filters only `belief_id`/`proof_tier`, and `funnel-vectorize.js` drops `source_type` from the index. The copywriter spec REQUIRES per-section source-routed retrieval → extend both.
  - DR injection NOT wired for either skill — build `inject-funnel-architect-dr.js` + `inject-copywriter-dr.js` bundlers + `read_first` bundles, EXACTLY mirroring the market-selection deterministic pattern. Both specs say "auto-injected" — the SAME mislabel that caused a zero-grounding run; replace with the deterministic Read.
  - `claim-tally` pre-pass — listed as an architect input; ABSENT (deferred to birdseye). Decide if needed now.
**Success Criteria** (what must be TRUE):
  1. A `funnel-architect` skill implements its operator spec (congruency law, three-layer authority model, awareness→structure, design procedure, named failure modes) and emits a COPY BRIEF in a defined, documented format.
  2. A `copywriter` skill implements its operator spec (the two rules, locked format rules, RAG-vs-KB separation) and consumes the architect's brief + per-section RAG'd verbatim to write finished prose.
  3. Both skills' DR knowledge is injected DETERMINISTICALLY (bundler + `read_first` bundle, market-selection pattern), verified present in context — NOT "auto-injected".
  4. The RAG supports per-section source-routed retrieval (source_type/routing scoping), with the index carrying the needed field.
  5. Every assumed-but-absent field (`belief_kind`/`source_routing`) is either added upstream or resolved by derivation, with the decision recorded.
  6. The full chain runs end-to-end against the synthetic fixture: funnel store → architect → brief → copywriter → prose. Live-on-real-funnels validation explicitly deferred to D-02.
**Plans**: 5 plans in 4 waves
Plans:
- [x] 15-01-PLAN.md — belief_kind schema extension: schema doc + fixture + validator (Wave 0)
- [x] 15-02-PLAN.md — RAG source routing + claim-tally script: vectorize/rag-query extend + funnel-claim-tally.js (Wave 0)
- [x] 15-03-PLAN.md — Funnel Architect skill: inject-funnel-architect-dr.js + SKILL.md (Wave 1)
- [ ] 15-04-PLAN.md — Copywriter skill: inject-copywriter-dr.js + SKILL.md (Wave 2)
- [ ] 15-05-PLAN.md — End-to-end operator verification: all injection points + fixture chain (Wave 3)

### Phase 16: Stage M1-S16 — Asset Classifier (image + video bricks)
**Goal**: A product-agnostic brick string turns a folder of raw product images/videos into a queryable, claim-tagged manifest (`IMAGES.md`/`VIDEOS.md` + `images.json`/`videos.json`) that the LP-build/copywriter agents (Phase 15) pull from to place the right asset behind each belief they install. Designed backward from the consumer: the PRIMARY KEY is the product claim an asset visually proves + strength, not the slot. Section is a derived convenience.
**Serves PMF Step**: 4 (launch LP-build support — same Step-4/launch-adjacent pull-forward as M1-S15).
**Depends on**: Phase 15 (consumer — the Funnel Architect/Copywriter that query the manifest by belief); soft — the classifier can be built and UAT'd standalone against the Arduview asset set before S15 consumes it. Section list ultimately wires to the deep-analysis funnel container (M1-S3), default crowdfunding/DTC sections until then.
**Requirements**: ASSET-01..ASSET-10 (assigned in planning — fetch/probe/classify/video/comprehend/map-rank/emit/upload/orchestrator/UAT).
**Status**: SPECCED + PROVEN. Spec authority: `prompts/_specs/image-classifier-brick.md` (images + the 5fps-montage video extension). Live proof on real Arduview shots: `runs/arduview/_asset-classify-proof.md` — validated copy→PIL-downscale→vision→claim-tagged record; auto-surfaced dedupe + background-disqualifier + no-clean-hero gap.
**Brick string** (brick model: deterministic→script/hook, judgment→agent, gate→human): (1) fetch [script] (2) probe [script] (3) relevance-bucket [cheap agent] (4) role-classify [agent — core judgment, fan-out one subagent per asset] (5) map+rank [script] (6) pick gate [🧑] (7) emit manifest [script] (8) upload+url-backfill [script, Shopify Files; video CDN URLs are hashed]. Video adds probe-video + sample-at-5fps + montage-into-timestamped-contact-sheets so the vision agent comprehends the whole clip in order.
**Known gaps from proof (resolve in planning, do not pre-decide)**:
  - No ffmpeg on the box → video sample/montage needs a decoder (`pip install av` or `imageio[ffmpeg]`). Images work via PIL today.
  - Section list is default crowdfunding/DTC; wire to the funnel container from M1-S3 deep analysis once available.
  - Per-product claim list is a per-launch input (Arduview worked instance defined in the spec) — decide where it's authored/stored.
  - `eligible_sections` routing kept in a deterministic table (claim→sections), NOT in the agent — confirm the table lives as an editable artifact.
**Success Criteria** (what must be TRUE):
  1. The 8-brick string exists per the spec, each brick the right executor (scripts deterministic, the two judgment reads are agents, the pick is a human gate).
  2. `role-classify` emits the claim-tagged record (claim + strength + pixel evidence, grounded — tags only what's visible), fanned out one subagent per asset.
  3. Running the string on the real Arduview asset set produces `IMAGES.md`/`VIDEOS.md` + JSON the builder can query by claim+strength, with dedupe, disqualifiers, and a gap list.
  4. Video bricks extract at 5fps and montage into timestamped sheets; the agent returns a segment timeline + motion_value + best_use (hero_loop/feature_demo) + poster_frame.
  5. UAT: the human reads the manifest and makes the per-section picks (gate); the picks are usable by Phase 15.
**Plans**: 6 plans in 5 waves
Plans:
- [x] 16-01-PLAN.md — Setup + data artifacts: .venv + pip (imagehash, imageio-ffmpeg) + section-table.json / section-list.default.json / CLAIM-LIST.json + spawn convention (Wave 0)
- [x] 16-02-PLAN.md — Image string: asset-fetch.js (--local) + probe.py (downscale + EXIF + phash dedupe) (Wave 1)
- [x] 16-03-PLAN.md — Video string: probe_video.py + sample_montage.py (5fps + PIL timestamped sheets) — parallel to 02 (Wave 1, human-verify)
- [x] 16-04-PLAN.md — Judgment core: validate-asset-record.js + asset-classify/SKILL.md (relevance-bucket + role-classify + comprehend-video fan-out) (Wave 2)
- [x] 16-05-PLAN.md — Manifest contract: asset-map-rank.js + asset-emit.js + asset-upload.js (Wave 3)
- [ ] 16-06-PLAN.md — UAT + human pick gate: replay the proof on the Arduview set, close brick 6 (Wave 4, human gate)

### Phase 17: LP Builder — reusable copy→pretty-HTML pipeline (Arduview = first instance)

**Goal:** A product-agnostic LP-builder pipeline that eats `{copy brief + visual system + assets}` and emits correct, on-brand landing/deposit HTML — deployed live, with email (Klaviyo) + checkout (Shopify) wired — under a no-rework contract where the builder is the ONLY agent that writes HTML and everything else is config-in or deterministic-token-substitution-out. Arduview is the first test instance, NOT the spec. Context: `17-CONTEXT.md`.
**Requirements**: LPB-01, LPB-02, LPB-03, LPB-04, LPB-05, LPB-06, LPB-07, LPB-08
**Depends on:** Phase 16 (asset bricks — `asset-upload.js` CDN backfill, optimized assets). NOT blocked on Phase 18 — the Arduview instance bootstraps its design direction from the already-locked Glasshouse system (`STYLE-LOCK.md` + `BUILD-FEEDBACK.md` §1).
**Stages** (frozen inter-stage contracts; builder = sole HTML writer): INTERFACES spec → UI-SPEC (visual contract) → PAGE-SPEC (content contract) → asset prep → **HTML builder** [agent] → hydrate [script] → asset-upload [script] → deploy [surge].
**Plans:** 6 plans

Plans:
- [ ] 17-01-PLAN.md — INTERFACES spec: freeze every stage's I/O contract (LPB-01)
- [ ] 17-02-PLAN.md — PAGE-SPEC content contract (Arduview) + manual-paste integration.json (LPB-02, LPB-05)
- [ ] 17-03-PLAN.md — lp-hydrate.js token substitution + parameterized surge deploy (LPB-04, LPB-07)
- [ ] 17-04-PLAN.md — lp-ui-check.js HARD-1..7 deterministic gate (LPB-06)
- [ ] 17-05-PLAN.md — lp-builder SKILL: the sole, pure HTML-writing agent (LPB-03)
- [ ] 17-06-PLAN.md — end-to-end Arduview pipeline run + live surge deploy (LPB-08)

### Phase 18: Design-research — competitor visual analysis → DESIGN-DIRECTION (feeds future UI-SPECs)

**Goal:** A judgment subsystem that, for a given brand/market, picks the right competitor LPs for design inspiration, captures them, visually analyzes them, and synthesizes a `DESIGN-DIRECTION` artifact that feeds the Phase-17 UI-SPEC. Generalizes the design-direction step that was done by hand for the Arduview/Glasshouse instance.
**Requirements**: TBD (assigned in planning)
**Depends on:** Phase 17 (consumes Phase 17's UI-SPEC input contract). Conceptually design-research PRECEDES UI-SPEC in the data flow, but is sequenced after the builder in build-order because Phase 17's first instance already has its design direction — this phase makes that step reusable for future instances.
**Brick string** (per PMF agent-design: judgment→agent, deterministic→script): (1) pick competitors [agent — judgment, "highly educated on how to pick competitors to visually analyze for design inspo"] (2) screenshot/capture [script] (3) visual analysis [agent] (4) synthesize DESIGN-DIRECTION [agent → feeds UI-SPEC].
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 18 to break down)

### Phase 19: Cleanup & health: nuke e-ink (_quarantine/eink-tablets, _quarantine/archive, launch/inkleaf-*, launch/README.md), slop docs (BUILD-STATE.md, mechanisms-in-play-stopgap.md, STRATEGY-DISCUSS-HANDOFF.md, RERUN-BRIEF.md, brand-refs/*, funnels-context/*, root MARKETING-LENS.md stub), junk binaries (asset-classify/sheets ~23M, _caption_* , ads/*_adv.png); distill VOC notes from map/data_inventory.md then archive; gitignore _index.json + _*-log.txt; no-overwrite-v1 rule. Full delete lists in .planning/intel/INDEX.md and .planning/POST-RUN-HARDENING-PLAN.md (Phase 19).

**Goal:** The repo carries only live, non-e-ink artifacts: every e-ink/InkLeaf relic and slop doc is hard-deleted (git history is the archive), the durable VOC/data-model design notes are distilled into a keeper before their source is removed, regenerable scratch is gitignored without dropping the tracked test fixture, the no-overwrite-v1 versioning convention is documented, and `.planning/` passes gsd-health.
**Requirements**: none (cleanup/health phase — no mapped REQ-IDs; must-haves derive from the phase goal + CONTEXT decisions D-01..D-15)
**Depends on:** Phase 18
**Plans:** 2/5 plans executed

Plans:
- [x] 19-01-PLAN.md — Distill map/data_inventory.md + BUILD-STATE.md into keeper map/data-model-notes.md (D-03/04/06; distill-before-delete)
- [x] 19-02-PLAN.md — Inline the image-classifier-brick.md IMAGES.md cite so launch/ can be deleted (D-13 precondition)
- [ ] 19-03-PLAN.md — Hard-delete e-ink artifacts: _quarantine/ + launch/ (D-01/02)
- [ ] 19-04-PLAN.md — Delete slop docs + junk binaries; remove data_inventory.md/BUILD-STATE.md gated on keeper (D-01/04/06/11/14)
- [ ] 19-05-PLAN.md — gitignore + fixture negation + junk removal + no-overwrite-v1 rule + gsd-health (D-07..D-15)

### Phase 20: Deep-pass bug fixes: funnel-clean.js markdown-heading regex, funnel-score.js fail-fast field validation, corpus-absent orchestrator guard, no-ads DTC path, light-pass SKILL precondition path, funnel-level position ordinal. (3 fixes already committed in bbff2ff.) Scope in .planning/POST-RUN-HARDENING-PLAN.md (Phase 20) and .planning/audit/08-deep-pass-bugs.md.

**Goal:** [To be planned]
**Requirements**: TBD
**Depends on:** Phase 19
**Plans:** 0 plans

Plans:
- [ ] TBD (run /gsd-plan-phase 20 to break down)

---

*Rewritten 2026-06-03: two-track research engine, build-state-aware, InkLeaf retired — kept in GSD
`### Phase N` format so the tooling resolves stages. Supersedes the prior VOC-only 12-stage roadmap.*
