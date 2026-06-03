# PMF — Requirements (Milestone 1: Research Engine)

Scope: **M1 — the research engine**, two tracks: **Track A competitive analysis** (Step 0/1/2 — light pass [built] → market-selection gate [drafted] → deep analysis [specced]) and **Track B VOC** (Step 3a/3b — specced in `handoff-step3-voc-build.md`). Source of truth: `ROADMAP.md` + `prompts/_specs/` (the strategy frameworks) + `handoff-step3-voc-build.md`. **InkLeaf is RETIRED** (quarantined to `_quarantine/`) — not an instance to regenerate, not a UAT rebuild target.

Naming: **Stage** = GSD build unit; **Step** = PMF research step 0–8. REQ-IDs below are capabilities, mapped to Stages by the roadmap.

---

## v1 Requirements (M1)

### VOC — Voice-of-Customer engine (Step 3a/3b, critical path)

- [ ] **VOC-01**: The classifier codebook exists as a machine contract — compiles `definitions.md` (PMBD × T1–T4 ladder, 6 belief surfaces, sub-niche 5+ rule) + `workflow.md` PMBD battery into a tagging contract in `step1-light-pass.md` format (closed enums hook-rejected off-list, open fields captured verbatim)
- [ ] **VOC-02**: A per-quote record schema is defined (`raw_text, char_offsets, author_id, permalink, upvotes, pmbd_letter, tier, belief_surface, sub_niche_id, trigger, intensity`) with two materialized views off one store — frequency brief + copy bank
- [ ] **VOC-03**: The Query Planner agent generates three search lanes (population-wide / in-niche / adjacent-context) and explicitly handles the no-clean-niche-venue case
- [ ] **VOC-04**: A Reddit scraper runs on Reddit's official commercial API, preserving author_id / permalink / timestamp / upvotes; a cleaner keeps a raw immutable copy and normalizes only a working copy
- [ ] **VOC-05**: A verbatim-gate hook string-matches every extracted span to the raw source and rejects on mismatch (no LLM ever emits quote text)
- [ ] **VOC-06**: The Bucketer agent (pass 1, cheap, whole corpus) assigns PMBD letter + raw theme + counter-signal flag + community-vocab flag, returning row-ids + tags only (never quote text)
- [ ] **VOC-07**: A deterministic intensity scorer (VADER + engagement + length) ranks every record without discarding any
- [ ] **VOC-08**: Frequency + co-occurrence scripts compute unique-user frequency (synonym-deduped via union-find) and a binary user×theme incidence matrix, clustering users into candidate sub-niches (k-modes / LCA / Leiden), capturing all of a user's qualifying quotes — never best-post scoring
- [ ] **VOC-09**: The Ladderer agent (pass 2, hot clusters only) assigns T1–T4 tier and extracts copy-ready verbatim spans; the driver is read once per sub-niche cluster
- [ ] **VOC-10**: The Language Analyzer agent (pass 3) organizes verbatim by theme / sub-niche / tier into copy-ready units (light-clean only, never reword) and persists to the copy-bank store
- [ ] **VOC-11**: The pipeline runs end-to-end on a reference subreddit and Kam can read the resulting copy bank (UAT)

### TOOL — Reusable research tooling

- [ ] **TOOL-01**: `step1-light-pass.md` (finder / verifier / dumper / classifier) is templatized with parameterized niche / transformation / venue slots so a new run uses it without editing the spec
- [ ] **BET-01**: Every Phase 1 run consumes a per-run **bet brief** (prose context, injected verbatim into Finder + Classifier, never hook-validated); `fetch.js` reads the brief's `PIPELINE INPUTS` lists; the bet brief is hand-filled from `prompts/_templates/pre-research-plan.template.md` (planning-phase generator deferred — M1-S0 SEEDED)
- [ ] **TREND-01**: Each brand carries a `demand_trend` (shape ∈ steady/rising/parabolic-spike/declining/unknown + window + source + basis), populated by a real Google Trends ~5yr fetch — guards the Gate-1 fad-death / parabolic-spike kill (a field with no source silently disables it)
- [ ] **NET-01**: The Finder casts a wide net by buyer-substitutability AND structural-bet-similarity (not spec-match), spanning all bet-brief territories + named comparable-bet seeds — an empty comparable pool must not be mistakable for a failed bet
- [ ] **TOOL-02**: A standalone `deliverable-templates.md` (10+ output schemas) and an agent-brief template (role + inputs + rules + schema + self-audit checklist + output path) are extracted from existing briefs

### GATE — Market bet selection

- [ ] **GATE-01**: The three existing market profiles (faith / students / dumb-device) are cross-scored on Desire × Feasibility − Sophistication × Growth and the InkLeaf market bet is selected (human decision, framework-assisted)

### UM — Mechanism research

- [ ] **UM-01**: Step 3c mechanism research is run on the winning market's transformation, producing a mechanism doc + product-candidate list

### LOOP — Loop back

- [ ] **LOOP-01**: Step 3d revises the Step 0/1 hypothesis records given Step 3a/3b/3c learnings (augment-not-overwrite; `depth_pass` + `extracted_at` versioning)

---

## v2 / Deferred (next milestone — M2 launch engine)

Deferred to Milestone 2 (rolling-wave; do not plan before M1 shakes out): test design (Step 4), language packs, hook test (Step 5), deposit-funnel build + belief-installation sequence + creatives (Step 6), eval / kill gates (Step 7), iterate-or-destroy (Step 8). Full breakdown in `BUILD-STATE.md` §Milestone 2.

---

## Out of Scope (M1)

- **Step 4 copywriting** — VOC ends at a stored, queryable copy bank; writing copy from it is Step 4 (M2).
- **Step 3c as a built agent beyond UM-01's research run** — mechanism research uses existing tools (scite/web), not a new agent pipeline in M1.
- **Vector DB / RAG embeddings** — JIT; add when Step 4 needs semantic retrieval.
- **Persistence / substrate layer** — DEFERRED; `.md` files suffice until manual friction demands a store.
- **`space-sketcher`** — DEFERRED; no partial-seed case yet.
- **InkLeaf research run** — RETIRED, quarantined to `_quarantine/`. Not regenerated, not used as a UAT corpus. Learnings already mined into `run-retrospective.md` + `agents/implementation-notes.md`.

---

## Traceability

REQ-ID → Stage (GSD step index in parens). Naming: the Stage is the identifier; the GSD step index is mechanical. 15/15 v1 REQs mapped, each to exactly one stage.

| Requirement | Stage | Serves PMF Step | Status |
|-------------|-------|------------------|--------|
| GATE-01 | M1-S2 (market-selection gate) | 0 gate | **Drafted** |
| TOOL-01 | M1-S1 (light pass) + M1-S12 | 0, 1 | Light pass **built**; templatize pending |
| TOOL-02 | M1-S12 | 0, 1 | Pending |
| VOC-01 | M1-S4 | 3a/3b | Pending (specced) |
| VOC-02 | M1-S4 | 3a/3b | Pending (specced) |
| VOC-03 | M1-S5 | 3a | Pending (specced) |
| VOC-04 | M1-S6 | 3a | Pending (specced) |
| VOC-05 | M1-S6 | 3a | Pending (specced) |
| VOC-06 | M1-S7 | 3a | Pending (specced) |
| VOC-07 | M1-S7 | 3a | Pending (specced) |
| VOC-08 | M1-S8 | 3a | Pending (specced) |
| VOC-09 | M1-S9 | 3b | Pending (specced) |
| VOC-10 | M1-S10 | 3b | Pending (specced) |
| VOC-11 | M1-S11 | 3a/3b validation | Pending (specced) |
| UM-01 | M1-S13 | 3c | Pending |
| LOOP-01 | M1-S14 | 3d | Pending |

**Coverage: 16/16 mapped.** Note: Track A's deep competitive analysis + messaging strategy (M1-S3,
`prompts/_specs/deep-market-analysis-framework.md`) serves Step 2 + front-half Step 4 and is not yet a
numbered v1 REQ — it's a specced capability feeding the launch engine; promote to a REQ when M2 is planned.
