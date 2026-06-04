# 07 — Belief-Records Ingest Audit
_Generated 2026-06-04_

## 1. WHO ingests the 43 belief records

**funnel-architect** (`SKILL.md`) is the primary consumer of the full belief store.
Its `read_first` block instructs it to `Read runs/<space>/funnels/*.json` (all per-funnel JSON files, which contain the full `belief_records[]` arrays) and `runs/<space>/funnels/_tally.json`.

**Copywriter** (`/copywrite`) does NOT read the raw store directly. It is a downstream consumer of the RAG query script (`funnel-rag-query.js`), which the orchestrator runs and pastes the output block into the copywriter's spawn prompt. The copywriter sees only whatever the RAG query returns.

## 2. HOW funnel-architect consumes the belief records

The architect is instructed to `Read runs/<space>/funnels/*.json` — a direct file `Read` of every per-funnel JSON. This is **(a) full belief records (all fields)**. There is no RAG retrieval step in the architect's flow; it reads the raw store files in full before reasoning.

The `_tally.json` is also read directly as a second structured input — **(c)**.

The RAG path (`funnel-rag-query.js` → `_index.json`) is the **copywriter's** retrieval mechanism, not the architect's. The architect bypasses the index entirely.

**Retrieval mechanism for the copywriter (for completeness):** `funnel-rag-query.js` embeds the query, cosine-ranks against `_index.json`, and emits the top-N records as a text block. What it returns per hit: `execution_detail`, `verbatim_refs`, `validation_strength`, `validation_lane`, `belief_id`, `execution_type`, `proof_tier`, `competitor`, `transformation`, `primary_claim`, `claim_type`, `awareness_entry`, `moves`, `position`, `funnel_id`. The `vector` field is stripped (`vector: undefined`). The `embed_text` field is NOT emitted in the output block (it's indexing scaffolding only). So RAG returns **full record minus vector minus embed_text** — not just the summary.

## 3. Full field set and architect usage

### Per-funnel store file (`runs/<space>/funnels/<funnel_id>.json`)

**Funnel-level fields (from `funnel-store.js → buildStoredRecord`):**

| Field | Status |
|---|---|
| `funnel_id` | USED — cited in architect's source-routing and validation reasoning |
| `competitor` | USED — architect attributes belief sources by competitor |
| `source_type` | USED — architect's three-layer model routes fill by DTC vs crowdfunding |
| `transformation` | USED — congruency law requires checking transformation match |
| `niche` | USED — architect uses niche in awareness calibration |
| `routing_flag` | USED — determines whether fill or structure-only from a funnel |
| `primary_claim` | USED — architect references claim and claim_type per funnel |
| `claim_type` | USED — direct/enlarged/mechanism/enhanced governs fill authority |
| `awareness_entry` | USED — Step 2 structural shape selection depends on this |
| `funnel_sequence` | USED — architect maps the structural shape from proven sequences |
| `offer_mechanic` | USED — Step 5 offer/urgency design |
| `urgency_construction` | USED — Step 5 |
| `validation_lane` | USED — Currency A vs B routing (three-layer model) |
| `validation_strength` | USED — validation weighting, epistemic discipline |
| `_provenance` | NOT USED — bookkeeping only |

**Belief-instance record fields (per record in `belief_records[]`):**

| Field | Status |
|---|---|
| `funnel_id` | USED — attribution back to funnel |
| `position` | USED — belief order (the relative sequence prior) |
| `belief_id` | USED — belief chain construction |
| `belief_confidence` | USED — present in store, used to weight confidence in an install |
| `execution_type` | USED — install spec for the copy brief |
| `execution_detail` | USED — granular install spec; sub-claims recoverable here |
| `proof_tier` | USED — persuasion element mapping |
| `moves` | USED — angle/market/UM move tags |
| `verbatim_refs` | USED — copywriter brief references these as "proven language to pull toward" |
| `belief_kind` | NOT PRESENT in actual records (absent from store) — SKILL.md references it but the Section Analyzer did not emit it |
| `source_routing` | NOT PRESENT in actual records — same situation |

### Fields in `_index.json` records (RAG index, copywriter path only)

The index carries all the above belief-level and funnel-level attribution fields PLUS `embed_text` (indexing scaffold, not emitted to consumers) and `vector` (stripped before output). **Missing from the on-disk `_index.json` vs. current `funnel-vectorize.js`:** `source_type` and `routing_flag` — the vectorize code assigns them but the existing index was built from an older version; a rebuild is required.

## 4. Lossy-vs-full verdict

**The architect reasons from the FULL records, not from `embed_text`.** It reads `runs/<space>/funnels/*.json` directly — all fields, no summary truncation. The 600-char `embed_text` is strictly the vectorization input for the RAG index; it never reaches the architect.

The **copywriter** via RAG also gets near-full records: all attribution and content fields are returned per hit. The `embed_text` and `vector` are stripped from the output. The only field not in the RAG output that is in the store is `embed_text` itself (irrelevant) and `vector` (irrelevant). Copywriter ingestion is not lossy on the content fields.

**Summary:** no path in the current implementation causes the architect to reason from lossy summaries. The 600-char `embed_text` is an indexing artifact only.

---

### Known gaps found during audit (not fixes — informational only)

1. `belief_kind` and `source_routing` are referenced in SKILL.md's INPUTS section but are absent from actual belief_records in the store — the Section Analyzer did not emit them.
2. The on-disk `_index.json` is missing `source_type` and `routing_flag` fields (present in current `funnel-vectorize.js` but index pre-dates that addition). The `--source-type` and `--routing-flag` prefilters in `funnel-rag-query.js` are therefore inoperative until the index is rebuilt.
