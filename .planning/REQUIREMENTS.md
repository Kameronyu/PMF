# PMF — Requirements (Milestone 1: Research Engine)

Scope: **M1 — the research engine**, with the **Phase 3 VOC pipeline as the critical path**. Source of truth: `BUILD-STATE.md` (M1/M2 split) + `handoff-phase3-voc-build.md` (VOC build brief). InkLeaf (`runs/eink-tablets/`) is the first instance / UAT corpus.

Naming: **Stage** = GSD build unit; **Phase** = PMF research step 0–8. REQ-IDs below are capabilities, mapped to Stages by the roadmap.

---

## v1 Requirements (M1)

### VOC — Voice-of-Customer engine (Phase 3a/3b, critical path)

- [ ] **VOC-01**: The classifier codebook exists as a machine contract — compiles `definitions.md` (PMBD × T1–T4 ladder, 6 belief surfaces, sub-niche 5+ rule) + `workflow.md` PMBD battery into a tagging contract in `phase1-light-pass.md` format (closed enums hook-rejected off-list, open fields captured verbatim)
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

- [ ] **TOOL-01**: `phase1-light-pass.md` (finder / verifier / dumper / classifier) is templatized with parameterized niche / transformation / venue slots so a new run uses it without editing the spec
- [ ] **TOOL-02**: A standalone `deliverable-templates.md` (10+ output schemas) and an agent-brief template (role + inputs + rules + schema + self-audit checklist + output path) are extracted from existing briefs

### GATE — Market bet selection

- [ ] **GATE-01**: The three existing market profiles (faith / students / dumb-device) are cross-scored on Desire × Feasibility − Sophistication × Growth and the InkLeaf market bet is selected (human decision, framework-assisted)

### UM — Mechanism research

- [ ] **UM-01**: Phase 3c mechanism research is run on the winning market's transformation, producing a mechanism doc + product-candidate list

### LOOP — Loop back

- [ ] **LOOP-01**: Phase 3d revises the Phase 0/1 hypothesis records given Phase 3a/3b/3c learnings (augment-not-overwrite; `depth_pass` + `extracted_at` versioning)

---

## v2 / Deferred (next milestone — M2 launch engine)

Deferred to Milestone 2 (rolling-wave; do not plan before M1 shakes out): test design (Phase 4), language packs, hook test (Phase 5), deposit-funnel build + belief-installation sequence + creatives (Phase 6), eval / kill gates (Phase 7), iterate-or-destroy (Phase 8). Full breakdown in `BUILD-STATE.md` §Milestone 2.

---

## Out of Scope (M1)

- **Phase 4 copywriting** — VOC ends at a stored, queryable copy bank; writing copy from it is Phase 4 (M2).
- **Phase 3c as a built agent beyond UM-01's research run** — mechanism research uses existing tools (scite/web), not a new agent pipeline in M1.
- **Vector DB / RAG embeddings** — JIT; add when Phase 4 needs semantic retrieval.
- **Persistence / substrate layer** — DEFERRED; `.md` files suffice until manual friction demands a store.
- **`space-sketcher`** — DEFERRED; no partial-seed case yet.
- **Regenerating InkLeaf artifacts** — they are validated instance data / UAT corpus.

---

## Traceability

<!-- Filled by roadmap: REQ-ID → Stage -->

(pending roadmap)
