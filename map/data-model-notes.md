# Data-Model Notes (keeper)

> Distilled 2026-06-04 from `map/data_inventory.md` (hard-deleted, see git history) and the
> cross-cutting rows of `.planning/BUILD-STATE.md` (also hard-deleted). This is the surviving
> home for the non-VOC capability IO schemas, the unresolved cross-cutting design decisions,
> and the open questions. Substrate choice + VOC-chain field-level schemas are re-specified at
> Track B M1-S4 (codebook keystone).

---

## Implicit entities + source-metadata constraint

The capabilities reference these IDs throughout. Final naming/keying decided at substrate time.

- `author_id` — single global ID across platforms (one-author-id decision locked; cross-platform
  joining is a downstream resolver problem).
- `brand_id` — canonical brand identifier (URL-normalized).
- `niche_id` — a niche (broad or narrow). Has `venues[]`.
- `transformation_id` — a specific transformation.
- `transformation_category_id` — T-cat.
- `product_id` — specific product.
- `product_category_id` — P-cat.
- `market_id` — composite of `niche_id × transformation_id`. Unit of competition.
- `subniche_id` (= `pmbd_cluster_id`) — validated PMBD cluster inside a market.
- `voc_record_id` — atomic VOC unit. Granularity resolved — see Open Questions #1 below.
- `quote_id` — verbatim quote extracted from a VOC record.
- `theme_id` — universal schema theme/field (e.g., `pain.bloating`, `belief.salt_causes_bloating`).
- `claim_id` — competitor claim instance.
- `mechanism_id` — biological/causal mechanism.
- `investigation_id` — one research run. Map scope question — see Open Question #2.

**Source metadata** (locked architectural constraint — attached to every VOC record AND every
downstream artifact derived from VOC): `platform`, `venue`, `author_id`, `url`, `timestamp`,
`engagement` (likes/upvotes/comments/etc.). Non-negotiable. Any substrate that drops source
metadata anywhere in the chain is wrong.

---

## Non-VOC capability IO schemas

These are the record-shape definitions for all capabilities outside the VOC chain. Preserve
field lists faithfully — this is the only surviving working-tree copy after data_inventory.md
is deleted.

### Per-brand extractor [Op]

**Input:** `brand_id` (or brand URL).
**Output (one record per brand):**
- `brand_id`, `brand_name`, `url`, `extracted_at`, `depth_pass` (shallow|deep)
- `niche_id` (which niche served — may be multiple)
- `transformations[]` → list of `transformation_id`
- `products[]` → list of `product_id`
- `claims[]` → list: `claim_text`, `claim_type` (base|enhanced), `qualifier_type`
  (speed|condition|mechanism|comparative|other)
- `um_signals[]` → list: `um_text`, `um_type` (Problem|Product|Feature),
  `mechanism_referenced` (free text or `mechanism_id`)
- `angle_signals[]` → list: `angle_text`, `driver` (status|survival|reproduction|belonging),
  `pole` (pain|desire), `ladder_tier` (T1|T2|T3)
- `value_models` → `bundle?`, `pricing`, `discount_pattern`, `guarantee?`, `subscription?`
- `trust_signals[]` → `type` (press|cred|celebrity|UGC|reviews|badges|...),
  `evidence_text`, `extraordinary?` (bool)
- `sophistication_signals` → `revenue_est`, `social_proof_volume`, `distribution_channels[]`,
  `extraordinary_identifier?` (bool)
- `channel_presence[]` → which platforms brand is active on

**Source metadata:** N/A at record level (brand-level, not customer voice). Individual evidence
pieces carry `source_url` + `extracted_at`.

**Read by:** Market aggregator, Gap analysis / Gate 1, Step 2 deep study, Gate 2, Step 4.

**Note:** Output already does competitive classification — claim_type, UM_type, angle
driver/pole/tier are differentiator-lever outputs, not raw text. Relevant when classifier-split
question (Open Q #3) gets decided.

---

### Market aggregator [Op]

**Input:** collection of per-brand records for a `market_id`.
**Output (one record per market):**
- `market_id`, `brand_count`
- `claim_counts` → per claim (or normalized claim): count, list of `brand_id`. Distinguishes
  base vs enhanced claim count.
- `mechanism_inventory[]` → distinct mechanisms across competitors
- `um_inventory` → list per `um_type`: count, brands using
- `trend_velocity` → score or category (from trend cap)
- `sophistication_pattern` → distribution across market sophistication Stages 1–5
- `extraordinary_identifier_presence` → bool/count
- `aggregated_at`

**Source metadata:** N/A at record level. Inherits brand-level provenance via brand_id refs.

**Read by:** Gap analysis / Gate 1, Step 2 sophistication assessment, Step 1 underserved+hungry filter.

---

### Ad creative + visual extractor [Op]

**Input:** `brand_id`.
**Output (records per ad/creative/page):**
- `creative_id`, `brand_id`, `extracted_at`
- `format` (image|video|carousel|VSL|advertorial|landing_page)
- `source` + `source_url`
- `hook` → `hook_text`, `hook_modality[]` (audio|visual|text)
- `angle_signals[]`, `claim_signals[]`, `um_signals[]`, `trust_signals[]`
- `objection_handles[]` → `handle_text`, `objection_type`
- `visuals[]` → asset refs + descriptors
- `awareness_target` (estimated: unaware|problem|solution|product|most)
- `engagement_signals`

**Source metadata:** `source_url`, `extracted_at`, `platform`.

**Read by:** Step 2 deep study, Gate 2, Step 4 (steal proven hooks/angles/objection handles).

---

### Offer/bundle structure extractor [Op]

**Input:** `brand_id` (landing pages, checkout flows).
**Output (records per offer/bundle/page):**
- `offer_id`, `brand_id`, `extracted_at`, `source_url`
- `price_points[]` → `unit`, `price`, `quantity`
- `bundle_structure` → SKUs included, bundle savings %
- `free_shipping_threshold`
- `subscription_terms` → frequency, save%, cancellation
- `guarantees[]` → `text`, `days`, `condition`
- `discount_patterns[]` → BOGO|%off|gift_w_purchase|etc.

**Source metadata:** `source_url`, `extracted_at`.

**Read by:** Step 2 deep study, Gate 2, Step 4 (proven offer mechanics).

---

### Channel analysis [Op]

**Input:** `brand_id` OR `market_id`.
**Output:**
- `subject_id`, `analyzed_at`
- `traffic_sources` → SimilarWeb breakdown
- `ad_library_presence` → Meta/TikTok/Google (present|absent + activity volume)
- `social_channel_activity[]` → per-platform: followers, posting cadence, engagement
- `channel_concentration_score`
- `competitors_not_on_meta[]` → flagged opportunity

**Source metadata:** `analyzed_at`, source tools used.

**Read by:** Gap analysis (proven spend), Step 2, Step 4 (macro test channel selection).

---

### Trend / temporal signal [Op]

**Input:** `transformation_id` OR `product_id` OR `niche_id`.
**Output:**
- `subject_id`, `subject_type`, `evaluated_at`
- `trend_velocity` → score + raw signals (search volume slope, social mention slope)
- `why_now_signals[]` → text + source
- `classification` → evergreen | emerging | declining
- `adjacent_trends[]` → related trends with their own scores
- `early_adopter_behaviors[]`

**Source metadata:** sources (Google Trends, TikTok, Reddit growth, etc.) + `evaluated_at`.

**Read by:** Gap analysis / Gate 1 (Market Growth), Step 0 mapping, Step 2.

---

### Mechanism research [Op]

**Input:** `transformation_id`.
**Output:**
- `transformation_id`, `researched_at`, `depth_pass` (shallow|deep)
- `mechanisms[]` → per mechanism: `mechanism_id`, `name`, `description`,
  `evidence_quality` (high|med|low), `evidence_sources[]`
- `existing_solutions[]` → known products/treatments
- `ip_signals` → patent landscape
- `regulatory_status[]` → per geography
- `cogs_floor_signals` → estimated COGS range
- `format_candidates[]` → viable product formats

**Source metadata:** sources cited per finding.

**Read by:** Gate 1 D2C Feasibility, Step 1 solvable-UM filter, Step 3c.

---

### Product candidate discovery [Op]

**Input:** `transformation_id` + Human-generated heuristic seeds.
**Output:**
- `transformation_id`, `generated_at`
- `candidates[]` → per candidate: `product_concept`, `format`, `mechanism_referenced`,
  `source_inspiration`, `existing_analogs[]`, `differentiation_angle`

**Source metadata:** generation sources.

**Read by:** Step 3c Human filter, Step 4 test variable definition.

---

### Transformation-from-product expander [Op]

**Input:** `product_id`.
**Output:**
- `product_id`, `expanded_at`
- `candidate_transformations[]` → per candidate: `transformation_id_or_text`,
  `evidence_source`, `evidence_excerpts[]`, `confidence_signal` (mentions count)

**Source metadata:** per-evidence source URLs + timestamps.

**Read by:** Pipeline B (Step 1: have P, need T).

---

### Transformation-from-niche expander [Op]

**Input:** `niche_id`.
**Output:**
- `niche_id`, `expanded_at`
- `candidate_transformations[]` → per candidate: `transformation_id_or_text`,
  `evidence_source`, `evidence_excerpts[]`, `frequency_signal`

**Source metadata:** niche venue URLs, scrape timestamps.

**Read by:** Pipeline C (Step 1: have N, need T and P).

---

## VOC-chain IO schemas (optional reference)

The VOC chain is architecturally covered in `handoff-step3-voc-build.md`; field-level schemas are
re-specified at M1-S4. A condensed table of ops and key output contracts is kept here for completeness.

| Op | Key output fields | Source metadata |
|----|-------------------|-----------------|
| VOC scraper | `voc_record_id`, `platform`, `venue`, `author_id`, `url`, `timestamp`, `engagement`, `body_text`, `parent_id`, `scrape_context`, `lane` | Yes — full |
| Cleaner | `body_text_cleaned`, `dedup_status`; all source metadata + `parent_id` + `scrape_context` preserved | Preserved end-to-end |
| Classifier/tagger | `voc_record_id`, `tags[]` (theme_id, value, tier, confidence, evidence_span), all source metadata, `classifier_version` | Preserved; attached to every tag |
| Quote extractor | `quote_id`, `voc_record_id`, `theme_id`, `quote_text_verbatim`, `span`, all source metadata, `tier` | Preserved per quote |
| PMBD clusterer | `cluster_id`, `pmbd_signature[]`, `validating_authors[]`, `validation_status`, `cross_niche`, `evidence_record_ids[]`, `market_context[]` | Inherited via evidence_record_ids |
| Frequency/intensity synthesizer | `theme_id`, `scope`, `frequency_count`, `intensity_proxies`, `combined_score`, `top_evidence_quote_ids[]` | Aggregate — provenance via evidence quotes |
| Copy bank builder | `quote_id`-keyed; indexed by `theme_id`, `tier`, `subniche_id`, `market_id`, `platform`, `venue`; each record carries full source metadata | Yes — primary indexing axis |

**Source-metadata-preservation chain:** VOC scraper → Cleaner → Classifier (tag-level) →
Quote extractor (quote-level) → Copy bank (index axis). Non-negotiable end-to-end. No substrate
that breaks this chain is acceptable.

---

## The 5 unresolved cross-cutting decisions

These are the decisions BUILD-STATE.md cited data_inventory.md for. Each is named and described
here with its current status.

### hypothesis-record schema

**Status: OPEN — blocked on substrate**

An explicit Human step lives between Step 0 and Step 1: Kam reads the map and picks a market
hypothesis. This is not invisible glue — it must be recorded.

Schema described (never implemented):
```
hypothesis_record = {
  market_id,
  selected_at,
  rationale_text,
  accumulated_gap_record_ref   // points to the gate-1 gap_score_record that informed selection
}
```

BUILD-STATE.md rows (lines 61, 149): the schema is flagged UNDER with note "no schema defined."
The record belongs in the map, traceable across hypothesis cycles. Interim workaround: a flat
`.md` file per hypothesis; upgrade to structured store JIT when substrate is chosen.

---

### augment-not-overwrite multi-pass write lean

**Status: LEAN LOCKED — not yet implemented**

Locked decision (per Kam): re-run augments, never overwrites. Implications:
- Per-brand extractor record needs `depth_pass` (shallow|deep) + `extracted_at` timestamp.
- Mechanism research needs same.
- Gap analysis records are timestamped and never deleted — Step 3d loop-back produces new
  `gap_score_record` entries, not overwrites.
- Hypothesis records timestamped + chained: each cycle's hypothesis links to previous.

BUILD-STATE.md row (line 137): flagged UNDER at Step 3d row, note "Locked lean stated.
`depth_pass` field and `extracted_at` timestamps required. Not yet implemented anywhere."

This is the same principle that Phase 19's no-overwrite-v1 rule generalizes to run outputs.

---

### awareness-level inference gap

**Status: OPEN / UNDER — blocked on VOC classifier being built**

Step 4 test design requires an awareness target per test. The VOC classifier emits
`awareness_proxies` (signals of awareness level) as a tag on every classified record, but there
is no dedicated awareness-stage inference Op that synthesizes these into a per-market/per-cluster
awareness distribution.

BUILD-STATE.md row (line 150): flagged UNDER at Step 4 row — "Classifier emits proxies; no
dedicated synthesis Op."

Options at design time: (a) derivable from classifier `awareness_proxies` + Human judgment at
Step 4, (b) its own Op (awareness-stage inferencer). Decision parked — depends on how classifier
output looks once built.

---

### author_id-join-as-heaviest constraint

**Status: LOCKED CONSTRAINT — drives substrate decision**

The PMBD clusterer's 5+ rule requires single-individual co-occurrence validation: given a
candidate cluster's PMBD signature, find 5+ distinct authors who expressed 2+ of the signature
PMBDs in a single VOC record. This means author-keyed queries across the full classified VOC
corpus, potentially cross-niche.

This is the heaviest join in the system. It drives the substrate decision more than any other
query pattern. The source-metadata chain is non-negotiable because `author_id` is sourced
from source metadata.

BUILD-STATE.md rows (lines 206–213 cross-cutting section): "Authorship + author_id join (5+ rule
enabler) — SPEC-ONLY — Locked. Not implemented."

Substrate sizing implication: single-machine scale is tractable (SQLite/DuckDB plausible;
Postgres if multi-process); but the substrate must support author-keyed cross-niche index scans
without a full-table scan per query.

---

### substrate framing (~25 record types)

**Status: FRAMING LOCKED — substrate choice deferred**

The data layer is ~25 distinct joinable record types on a small ID set
(`author_id`, `brand_id`, `market_id`, `niche_id`, `transformation_id`, `subniche_id`,
`voc_record_id`, `theme_id`). Key characteristics:

- **Read patterns:** heavy multi-table joins for Step 4; author-keyed cross-niche scans for
  PMBD clusterer; aggregations for market_aggregator + frequency synthesizer; filtered indexed
  queries for copy bank (subniche × tier × theme × platform).
- **Write patterns:** append-mostly with augment-on-rerun; bulk writes from VOC scraper (10k+
  records per investigation possible); single-record writes for Gates and Human decisions.
- **Scale:** many investigations × dozens of brands × thousands-to-tens-of-thousands of VOC
  records. Single-machine tractable.
- **Sparse fields:** classifier output has N/A everywhere — favors document stores or
  nullable-heavy SQL.
- **Plausible substrates:** SQLite or DuckDB (single-machine, embedded, strong analytical
  queries); Postgres if multi-process parallelism needed. JSON files remain de facto persistence
  until manual friction demands a real substrate.

The substrate CHOICE itself stays deferred (per capability_inventory.md §Foundational Unders).
Capture the framing, not a decision.

---

## Open Questions #1-5 (with resolution status)

1. **VOC unit-of-record granularity** — RESOLVED: per-quote, keyed `author_id` + `source` +
   char-offsets. (`handoff-step3-voc-build.md` §3-4, lines ~119-124; `REQUIREMENTS.md` VOC-02.)
   The per-quote record schema: `raw_text, char_offsets, author_id, permalink, upvotes,
   pmbd_letter, tier, belief_surface, sub_niche_id, trigger, intensity`. The clusterer 5+ rule
   operates at the per-quote level (capture ALL of a user's qualifying quotes, never
   best-post scoring — destroys co-occurrence signal).

2. **Investigation scope** — LEAN STATED: one global map; no `investigation_id` on records;
   cross-investigation queries are first-class (e.g., "where does the bloating-belief-genetics
   cluster appear across all markets ever studied?"). Cost of cross-investigation joins noted —
   not blocking, drives substrate sizing.

3. **Competitive classifier as distinct Op** — OPEN/PARKED: bundle vs split raw-extractor +
   classifier (universal schema covers PMBD; competitive needs differentiator-lever schema).
   Per Kam: parked. Per-brand extractor currently bundles both implicitly.

4. **Multi-pass writes** — LEAN STATED (augment not overwrite) — see decision subsection above.
   Implies `depth_pass` + `extracted_at` on per-brand and mechanism research records; timestamped
   gap and hypothesis records.

5. **N/A in classifier output** — RESOLVED-AS-CONSTRAINT: N/A valid for any universal-schema
   field → sparse storage; favors document store / nullable-heavy SQL. The classifier codebook
   (M1-S4) must treat N/A as a first-class value everywhere.
