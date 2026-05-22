# Data Inventory

What every capability produces, what every research question consumes, and the joins between them. Basis for designing the persistence layer.

Walks `../workflow.md` and `../capability_inventory.md` in parallel. Uses vocab from `../definitions.md` — terms in **bold** are defined there.

This is a working enumeration, not a locked schema. Surfaces gaps, orphans, and joins. Persistence model gets designed on top of this.

---

## Implicit entities surfaced

The capabilities reference these IDs throughout. The data layer will need to track them. Names are placeholders — final naming/keying decided later.

- `author_id` — single global ID across platforms (one-author-id decision locked). Platform-handle joining is a downstream resolver problem. <notes> yes but like its seriously not that deep but i guess it doesnt matter. im not gonna be going to dig for cross platform author ID. maybe if i get bored ill research a few specific people to see wehere that leads. </notes>
- `brand_id` — canonical brand identifier (URL-normalized).
- `niche_id` — a **niche** (broad or narrow). Has `venues[]`.
- `transformation_id` — a specific **transformation**.
- `transformation_category_id` — **T-cat**.
- `product_id` — specific product.
- `product_category_id` — **P-cat**.
- `market_id` — composite of `niche_id × transformation_id`. Unit of competition.
- `subniche_id` (= `pmbd_cluster_id`) — validated PMBD cluster inside a market.
- `voc_record_id` — atomic VOC unit. **Unit-of-record question still open** — see Open Question #1 below.
- `quote_id` — verbatim quote extracted from a VOC record.
- `theme_id` — universal schema theme/field (e.g., `pain.bloating`, `belief.salt_causes_bloating`).
- `claim_id` — competitor claim instance.
- `um_id` — competitor UM instance.
- `mechanism_id` — biological/causal mechanism.
- `investigation_id` — one research run (a market hypothesis being investigated). **Map scope question still open** — see Open Question #2.

**Source metadata** (locked architectural constraint, attached to every VOC record + every downstream artifact derived from VOC): `platform`, `venue`, `author_id`, `url`, `timestamp`, `engagement` (likes/upvotes/comments/etc.).

---

## Open questions surfaced during enumeration

These have to resolve before the persistence layer can be designed. Not resolving now — flagging for the next pass.

1. **VOC unit-of-record granularity.** Is `voc_record_id` = one post/comment/review, or one *PMBD instance* extracted from a post (one review can contain many PMBDs)? Affects clusterer logic (5+ rule operates at whichever level you pick) and storage volume.
2. **Investigation scope.** Is the map one global store across all investigations, or scoped per `investigation_id`? Locked decision lean: one global (per Kam: "stack persistent patterns across spaces"). But cost/complexity of cross-investigation joins is non-trivial.
3. **Competitive classifier as distinct Op.** Per-brand extractor's output includes `claims[]` with claim_type/UM_type — that's classification, not raw extraction. Two options: (a) bundle inside per-brand extractor; (b) split into raw extractor + competitive classifier. Inventory currently does (a) implicitly. Decision parked per Kam.
4. **Multi-pass writes.** Per-brand extractor runs shallow in Phase 0, deep in Phase 2. Locked decision lean: augment, not overwrite (per Kam: "deep diving is expensive, gap-check first"). Implies `depth_pass` field on records or versioned writes. Schema implication noted in cap table.
5. **N/A in classifier output.** Locked decision says N/A is valid for any universal-schema field. Implies sparse storage (record can have most fields null) — fine for document stores, fine for SQL with nullable cols, awkward for tightly-typed schemas. Flagged for substrate decision.

---

## Capability outputs

One block per Op. Order follows `capability_inventory.md`. Deferred capabilities marked.

For each: **Input** | **Output (fields, keyed where relevant)** | **Source metadata flag** | **Read by** (downstream capabilities + research questions).

---

### Per-brand extractor [Op]

**Input:** `brand_id` (or brand URL).
**Output (one record per brand):**
- `brand_id`, `brand_name`, `url`, `extracted_at`, `depth_pass` (shallow|deep)
- `niche_id` (which niche served — may be multiple if cross-niche)
- `transformations[]` → list of `transformation_id`
- `products[]` → list of `product_id`
- `claims[]` → list: `claim_text`, `claim_type` (base|enhanced), `qualifier_type` (speed|condition|mechanism|comparative|other)
- `um_signals[]` → list: `um_text`, `um_type` (Problem|Product|Feature), `mechanism_referenced` (free text or `mechanism_id` if known)
- `angle_signals[]` → list: `angle_text`, `driver` (status|survival|reproduction|belonging), `pole` (pain|desire), `ladder_tier` (T1|T2|T3)
- `value_models` → `bundle?`, `pricing`, `discount_pattern`, `guarantee?`, `subscription?`
- `trust_signals[]` → `type` (press|cred|celebrity|UGC|reviews|badges|...), `evidence_text`, `extraordinary?` (bool)
- `sophistication_signals` → `revenue_est`, `social_proof_volume`, `distribution_channels[]`, `extraordinary_identifier?` (bool)
- `channel_presence[]` → which platforms brand is active on (Meta, TikTok, IG, YouTube, search, retail, etc.)

**Source metadata:** N/A at record level (brand-level data, not customer voice). Individual evidence pieces (e.g., a quoted claim from a landing page) carry `source_url` + `extracted_at`.

**Read by:**
- Market aggregator (rollups across brands)
- Gap analysis / Gate 1 (claim counts, enhanced claim counts, sophistication, UM availability per brand)
- Sophistication assessment (Phase 2)
- Gate 2 (Phase 2)
- Phase 4 — define dependent (proven) variables; steal proven angles/UMs/claims

**Note:** Output is *already doing competitive classification* — claim_type, UM_type, angle driver/pole/tier are differentiator-lever framework outputs, not raw text. Worth flagging when classifier-split question gets decided.

---

### Market aggregator [Op]

**Input:** collection of per-brand records for a `market_id` (or for a `transformation_id` space).
**Output (one record per market or space):**
- `market_id` (or `space_descriptor` if pre-hypothesis)
- `brand_count`
- `claim_counts` → per `claim_text` (or normalized claim): count, list of `brand_id` making it. Distinguishes base claim count vs enhanced claim count.
- `mechanism_inventory[]` → distinct `mechanism_id` (or text) across competitors
- `um_inventory` → list per `um_type`: count, brands using
- `trend_velocity` → score or category (from trend signal cap)
- `sophistication_pattern` → distribution of brands across Stages 1–5 (per `definitions.md` market sophistication)
- `extraordinary_identifier_presence` → bool/count
- `aggregated_at`

**Source metadata:** N/A at record level. Inherits brand-level provenance via brand_id refs.

**Read by:**
- Gap analysis / Gate 1 (Market Sophistication variable: claim count, enhanced claim count, competitor sophistication, UM availability)
- Sophistication assessment (Phase 2)
- Underserved + hungry filter (Phase 1)

---

### Ad creative + visual extractor [Op]

**Input:** `brand_id`.
**Output (records per ad/creative/page):**
- `creative_id`, `brand_id`, `extracted_at`
- `format` (image|video|carousel|VSL|advertorial|landing_page)
- `source` (Meta Ad Library|Foreplay|GetHookd|website|TikTok|other) + `source_url`
- `hook` → `hook_text`, `hook_modality[]` (audio|visual|text)
- `angle_signals[]` (as in per-brand extractor)
- `claim_signals[]` (as in per-brand extractor)
- `um_signals[]` (as in per-brand extractor)
- `trust_signals[]`
- `objection_handles[]` → `handle_text`, `objection_type`
- `visuals[]` → asset refs (screenshots, frames) + descriptors
- `awareness_target` (estimated: unaware|problem|solution|product|most)
- `engagement_signals` → impressions/reach if available

**Source metadata:** `source_url`, `extracted_at`, `platform`. Author = brand, not consumer.

**Read by:**
- Phase 2 deep study (compose with per-brand extractor)
- Gate 2 (Phase 2 — competitive depth)
- Phase 4 — steal proven hooks/angles/objection handles

---

### Offer/bundle structure extractor [Op]

**Input:** `brand_id` (specifically: landing pages, checkout flows).
**Output (records per offer/bundle/page):**
- `offer_id`, `brand_id`, `extracted_at`, `source_url`
- `price_points[]` → `unit`, `price`, `quantity`
- `bundle_structure` → SKUs included, bundle savings %
- `free_shipping_threshold`
- `subscription_terms` → frequency, save%, cancellation
- `guarantees[]` → `text`, `days`, `condition`
- `discount_patterns[]` → BOGO|%off|gift_w_purchase|etc.

**Source metadata:** `source_url`, `extracted_at`.

**Read by:**
- Phase 2 deep study
- Gate 2
- Phase 4 — define dependent variables (proven offer mechanics)

---

### Channel analysis [Op]

**Input:** `brand_id` OR `market_id`.
**Output:**
- `subject_id` (brand or market), `analyzed_at`
- `traffic_sources` → SimilarWeb breakdown (direct, organic, social, referral, paid)
- `ad_library_presence` → Meta/TikTok/Google ad library (present|absent + activity volume)
- `social_channel_activity[]` → per-platform: followers, posting cadence, engagement
- `channel_concentration_score` → how concentrated brand is in one channel vs diversified
- `competitors_not_on_meta[]` → flagged opportunity (brands NOT scaling Meta)

**Source metadata:** `analyzed_at`, source tools used.

**Read by:**
- Gap analysis (proven spend signal feeds Desire to Solve)
- Phase 2 deep study
- Phase 4 — macro test selection (which channels to deploy on)

---

### Trend / temporal signal [Op]

**Input:** `transformation_id` OR `product_id` OR `niche_id`.
**Output:**
- `subject_id`, `subject_type`, `evaluated_at`
- `trend_velocity` → score + raw signals (search volume slope, social mention slope)
- `why_now_signals[]` → text + source (TikTok virality, news event, cultural shift)
- `classification` → evergreen | emerging | declining
- `adjacent_trends[]` → related trends with their own scores
- `early_adopter_behaviors[]` → motifs surfacing in early communities

**Source metadata:** sources (Google Trends, TikTok, Reddit growth, etc.) + `evaluated_at`.

**Read by:**
- Gap analysis / Gate 1 (Market Growth variable: trend velocity, adjacent trend signals)
- Phase 1 filters: evergreen, why now, emerging
- Phase 0 mapping, Phase 2 market eval

---

### Mechanism research [Op]

**Input:** `transformation_id`.
**Output:**
- `transformation_id`, `researched_at`
- `mechanisms[]` → per mechanism: `mechanism_id`, `name`, `description`, `evidence_quality` (high|med|low), `evidence_sources[]` (scite refs, web of science DOIs, web search refs)
- `existing_solutions[]` → known products/treatments addressing the mechanism
- `ip_signals` → patent landscape (`patentability` flags, blocking patents)
- `regulatory_status[]` → per geography: FDA/EU/etc. status
- `cogs_floor_signals` → estimated COGS range from Alibaba scans + competitor pricing inference
- `format_candidates[]` → viable product formats (capsule, topical, device, etc.)

**Source metadata:** sources cited per finding.

**Read by:**
- Gap analysis / Gate 1 (D2C Feasibility variable: mechanism efficacy, believability, economics)
- Phase 1 filter: solvable UM
- Phase 3c (deep mechanism research feeds Phase 4 UM choices)
- Product candidate discovery (input)

---

### Product candidate discovery [Op]

**Input:** `transformation_id` + Human-generated heuristic seeds (format change, household items, adherence issues, emerging product expansion).
**Output:**
- `transformation_id`, `generated_at`
- `candidates[]` → per candidate: `product_concept`, `format`, `mechanism_referenced` (`mechanism_id` or text), `source_inspiration` (which heuristic generated it), `existing_analogs[]` (similar products in market), `differentiation_angle`

**Source metadata:** generation sources (Alibaba AI, emerging-product scan venues, generative ideation transcript).

**Read by:**
- Phase 3c (downstream Human filter against avatar fit, believability, IP, etc.)
- Phase 4 — test variable definition (new product introductions)

---

### Transformation-from-product expander [Op]

**Input:** `product_id`.
**Output:**
- `product_id`, `expanded_at`
- `candidate_transformations[]` → per candidate: `transformation_id_or_text`, `evidence_source` (Amazon review|science|social), `evidence_excerpts[]`, `confidence_signal` (mentions count)

**Source metadata:** per-evidence source URLs + timestamps.

**Read by:**
- Pipeline B (Phase 1: have P, need to choose T)
- Hidden transformation discovery (cross-references with VOC review mining)

---

### Transformation-from-niche expander [Op]

**Input:** `niche_id`.
**Output:**
- `niche_id`, `expanded_at`
- `candidate_transformations[]` → per candidate: `transformation_id_or_text`, `evidence_source` (which niche venue), `evidence_excerpts[]`, `frequency_signal`

**Source metadata:** niche venue URLs, scrape timestamps.

**Read by:**
- Pipeline C (Phase 1: have N, need to pick T and P)
- Niche-scoped opportunity surfacing

---

### VOC scraper [Op]

**Input:** scoping params — `venue` (subreddit|FB group|Amazon ASIN|TikTok hashtag|YouTube channel|...), `query` (transformation|niche|product term), `depth`, `date_range`.
**Output:** raw dump, one record per atomic unit (post|comment|review|video transcript chunk).
- `voc_record_id` (raw), `scraped_at`
- `platform`, `venue`, `author_id`, `url`, `timestamp`, `engagement` (likes/upvotes/replies/etc.) — **source metadata, locked architectural constraint, preserved**
- `body_text` (raw)
- `parent_id` (for replies/comments)
- `scrape_context` → `transformation_id?`, `niche_id?`, `product_id?` (what query brought this in)
- `lane` (1|2|3 if from 3a search — see Phase 3a) — optional

**Source metadata:** Yes, full schema attached.

**Read by:**
- Cleaner (next step)
- Re-scrape audit (provenance)

**Open:** May fragment into platform-specific scrapers (Reddit JSON, Amazon scrape, TikTok, YouTube) under one umbrella capability. Same schema shape, different fetchers.

---

### Cleaner [Op, lightweight]

**Input:** raw VOC dump (records from scraper).
**Output:** same record shape as scraper, with:
- `voc_record_id` (carry from scraper)
- `body_text_cleaned` (URLs stripped from body, `[deleted]`/`[removed]` removed, encoding normalized)
- `dedup_status` (kept|dropped_exact_dup)
- All source metadata + `parent_id` + `scrape_context` preserved

**Source metadata:** Preserved end-to-end.

**Read by:**
- Classifier (next step)
- Quote extractor (reads cleaned text directly for verbatim pulls)

**Note:** Per locked decision #6 — dumb regex version first, ~30 lines of Python, swap for real cleaner later without touching downstream.

---

### Classifier / tagger [Op]

**Input:** cleaned VOC records + universal schema (the locked question/theme list: pains, beliefs, motifs, desires, drivers, language, identity, etc.).
**Output:** one tagged record per cleaned VOC record. **Source metadata preserved.**
- `voc_record_id` (carry)
- `tags[]` → per tag: `theme_id` (e.g., `pain.bloating`, `belief.salt_causes_bloating`), `value` (free text excerpt | enum | N/A), `tier` (T1|T2|T3|T4), `confidence`, `evidence_span` (offsets in cleaned text)
- All source metadata preserved
- `classifier_version` (for reproducibility)

**Schema fields covered (universal schema, from definitions.md PMBD ladder):**
- `pain.*` × T1–T4
- `belief.*` × T1–T4 (6 belief surfaces: self/situation, trust sources, info sources, other-product beliefs, brand loyalties, perceived barriers)
- `motif.*` × T1–T4
- `desire.*` × T1–T4
- `driver` (status|survival|reproduction|belonging) → T4 anchor
- `language` (verbatim phrases per theme — links to quote extractor)
- `identity_signals` (who they say they are)
- `awareness_proxies` (signals of awareness level)

**N/A is valid for every field** (locked decision).

**Source metadata:** Preserved, attached to every tag.

**Read by:**
- Quote extractor (Phase 3b)
- PMBD clusterer (Phase 3b sub-niche validation)
- Frequency/intensity synthesizer (Phase 3a)
- Copy bank builder (Phase 3b)
- Phase 1 filters (describable buyer, strong desire)

**Open:** Whether competitive-side text also gets classified by this same Op (universal schema covers PMBD; competitive needs differentiator-lever schema). Per Kam: parked.

---

### Quote extractor [Op]

**Input:** classified VOC records.
**Output:** per quote:
- `quote_id`, `voc_record_id` (source), `theme_id` (which schema field it evidences)
- `quote_text_verbatim` (exact, no paraphrase)
- `span` (offsets in source body)
- All source metadata preserved (`platform`, `venue`, `author_id`, `url`, `timestamp`, `engagement`)
- `tier` (T1|T2|T3|T4)

**Source metadata:** Preserved per quote.

**Read by:**
- Copy bank builder
- Phase 4 — pull exact language for ad copy and LP per test variable

---

### PMBD clusterer [Op]

**Input:** classified VOC records (with `author_id` and tags).
**Output:**
- `candidate_clusters[]` → per cluster:
  - `cluster_id` (proposed `subniche_id`)
  - `pmbd_signature[]` → list of (theme_id, tier) the cluster co-occurs on (e.g., `[(pain.bloating, T1), (belief.bad_genetics, T3)]`)
  - `validating_authors[]` → list of `author_id` who expressed 2+ of the signature in a single record (the 5+ rule)
  - `validation_status` (validated if `len(validating_authors) >= 5`, else `candidate`)
  - `cross_niche` (bool — appears in 2+ niches)
  - `evidence_record_ids[]` → which VOC records demonstrate the co-occurrence
  - `market_context[]` → which `market_id`(s) the cluster appears in

**Source metadata:** Inherited via `evidence_record_ids` → can join back to full source metadata.

**Read by:**
- Sub-niche declaration (Human)
- Copy bank builder (organizes copy by `subniche_id`)
- Phase 4 — sub-avatar definition

**Note:** This is the heaviest join in the entire system. Validates 5+ rule on single-individual co-occurrence — requires author-keyed queries across the full classified VOC corpus.

---

### Frequency / intensity synthesizer [Op] — Phase 3a output

**Input:** classified VOC records (optionally filtered to a `market_id`, `subniche_id`, or `lane`).
**Output:** ranked theme table:
- `theme_id`, `scope` (market|subniche|lane|global)
- `frequency_count` — # of records mentioning theme
- `intensity_proxies` → mean record length, repetition count within records, emotional language density score
- `combined_score` (frequency × intensity)
- `top_evidence_quote_ids[]` (links to quote extractor for examples)

**Source metadata:** Aggregate level — inherits provenance via evidence quotes.

**Read by:**
- Phase 4 — angle selection (frequency × intensity → angle priority)
- Phase 0/Phase 1 — surface high-frequency PMBDs feeding Desire to Solve (Gate 1)

---

### Copy bank builder [Op] — Phase 3b output

**Input:** quotes from quote extractor + source metadata + classified tags.
**Output:** queryable copy bank organized by axes:
- Records keyed by `quote_id`
- Indexed by: `theme_id`, `tier`, `subniche_id`, `market_id`, `platform`, `venue` (for source-aware filtering)
- Each record carries: full quote text, source metadata, tier, theme(s) evidenced, `author_id`
- Query interface supports: "purchase-anchored language" filter (`platform = Amazon|Trustpilot`), "community language" filter (`platform IN [Reddit, forum, FB_group]`), per-PMBD-cluster filter (`subniche_id = X`)

**Source metadata:** Yes, primary indexing axis.

**Read by:**
- Phase 4 — pull exact language per test variable
- VOC language extractor (scoped) — same machinery, narrower query

**Note:** Locked decision — VOC language extractor (Phase 4 support) is NOT a separate capability. Same as copy bank builder with a narrower scoping query. One Op, two query patterns.

---

### Institutional report retrieval [Op]

**Input:** `niche_id` × `transformation_category_id` (or `product_category_id`).
**Output:**
- `report_id`, `source` (Mintel|IBISWorld|MRI-Simmons|Statista|other), `retrieved_at`, `report_title`, `report_date`
- `extracted_sections[]` → per section: `topic`, `text` (or structured table), `relevance_to_query`
- Optionally: classified output (feeds classifier as another VOC source)

**Source metadata:** `source` (publisher), `report_date`, `retrieved_at`.

**Read by:**
- Classifier (treated as another text source after structure extraction)
- Phase 3a Lane 3 supplementation
- Gap analysis (market growth + sophistication context)

---

### Purchase signal composite [Op]

**Input:** VOC outputs (frequency synthesizer, copy bank) + demographic data + reachability data + growth signals (trend cap) + per-brand revenue/distribution (per-brand extractor + channel analysis).
**Output:** per candidate cluster (`subniche_id` or `market_id`):
- `signal_id`, `subject_id`, `scored_at`
- `buying_power_score` + raw evidence
- `growth_score` + raw evidence
- `newness_score` + raw evidence
- `reachability_score` + raw evidence (which channels viable)
- `composite_score`

**Source metadata:** N/A directly — aggregate scoring layer. Provenance via input refs.

**Read by:**
- Phase 1 filters (proven spend, emerging, underserved+hungry)
- Phase 4 — sub-avatar prioritization

**Note:** "One composite for now. May fragment later if downstream needs different slices." (from inventory)

---

### Space-sketcher (partial-seed expander) [Op, DEFERRED]

Not built. Skipped in enumeration. Returns when partial-seed cases appear.

---

## Phase walkthrough

For each phase: research questions in order, data needed to answer, capability that produces it. Cross-references the capability blocks above. Flags joins, gaps, and decision points.

---

### Phase 0 — Map a space

**Workflow goal:** populated map of a space; output is a map, not a hypothesis.

**Step 1 — Sketch a space.** Inputs: T-cat, P-cat, niche at varying specificity.
- Source: **Human** (or `space-sketcher` when built — deferred).
- Data written: `space_descriptor` → `{transformation_category_id?, product_category_id?, niche_id?}`. Becomes seed for downstream work.

**Step 2 — Collect per-brand info across players in the space.**
- Source: **Per-brand extractor** (shallow `depth_pass`).
- Output written: per-brand records (see capability block) — `transformations`, `products`, `niche_id`, `sophistication_signals` (revenue est, social proof, distribution).
- Volume: typically dozens of brands per space.

**Step 3 — Roll up market-level info from the brand collection.**
- Source: **Market aggregator** reading from per-brand records.
- Output written: market aggregate record — claim counts, mechanism inventory, trend velocity (joined in from trend cap), sophistication patterns.
- **Join:** market_aggregator joins per-brand records by `niche_id × transformation_id` → `market_id`. Needs trend velocity from trend cap.

**Step 4 — Can you solve any of these problems? D2C feasibility scan.**
- Source: **Mechanism research** (lightweight at Phase 0; deep version runs in Phase 3c).
- Plus: **Human** judgment (intuition, commercializability).
- Output written: mechanism research record with `evidence_quality`, `cogs_floor_signals`, `format_candidates`. Plus Human notes (separate Human-output schema — see Open Question #6 below).

**Step 5 — Gap analysis (Gate 1).**

Formula: `Gap Score = [(Desire to Solve × D2C Feasibility) − Market Sophistication] × Market Growth`

Per-variable data dependencies:

| Variable | Sub-variables | Capability producing data | Notes |
|---|---|---|---|
| **Desire to Solve** | proven spend | Per-brand extractor (revenue est) + channel analysis (paid traffic) | |
| | core driver proximity | Classifier (T4 driver tags) + frequency synthesizer | **Gap (P0):** workflow doesn't currently position VOC in P0. Either lightweight VOC runs in P0, or Desire to Solve uses proxy signals only at P0 and proper PMBD scoring waits for Phase 3. **Open question.** |
| | severity | Classifier (pain intensity proxies) | Same gap |
| | frequency | Frequency synthesizer | Same gap |
| **D2C Feasibility** | mechanism efficacy | Mechanism research (`evidence_quality`) | |
| | believability — self-evident UM | Mechanism research + Human framing | |
| | believability — authority proof | (no current cap — would need authority-proof scanner; could be a sub-routine of mechanism research) | **Gap surfaced.** |
| | believability — social proof | Per-brand extractor (`social_proof_volume`) | |
| | economics | Mechanism research (`cogs_floor_signals`) + offer/bundle extractor (competitor pricing) | |
| **Market Sophistication** | claim count | Market aggregator (`claim_counts`, base) | |
| | enhanced claim count | Market aggregator (`claim_counts`, enhanced) | |
| | competitor sophistication | Market aggregator (`sophistication_pattern`) | |
| | UM availability | Market aggregator (`um_inventory`) | |
| **Market Growth** | trend velocity | Trend / temporal signal | |
| | adjacent trend signals | Trend / temporal signal (`adjacent_trends[]`) | |

**Joins surfaced for Gap analysis:**
- Per-brand records → market aggregator → Gate 1 inputs
- Trend cap → market aggregator + direct to Gate 1
- Mechanism research → Gate 1 D2C Feasibility
- VOC chain (if run in P0) → Gate 1 Desire to Solve

**Gap output:** stored as `gap_score_record` keyed by `market_id` (or `space_descriptor` if pre-market). Variables stored individually (not just composite score) so we can recompute when thresholds change.

**Locked-decision flag:** Gap scoring methodology is downstream Under — calibrate after 2–3 manual runs. So at this stage, Gate 1 record stores raw inputs + heuristic score, not final calibrated score.

---

### Between Phase 0 and 1 — Hypothesis selection

**Human work.** Reads the map (per-brand records, market aggregates, gap scores) and picks a `market_id` (or `market_descriptor`) to pursue.

**Data written:** `hypothesis_record` → `{market_id, selected_at, rationale_text, accumulated_gap_record_ref}`. Belongs in the map (so it's traceable across cycles).

**Reads:** the map.

**Note:** Locked decision #8 — this is an explicit Human step, not invisible glue. Write it down in the data layer.

---

### Phase 1 — Theorize

**Workflow goal:** given a hypothesis, solve unsolved variables.

**Pipelines** = orchestration decisions about which capabilities to call.

**Pipeline A — Transformation first** (have T, need N and P):
- **Transformation-from-product expander** (to find P candidates given T) — wait, this is backwards. Pipeline A starts with T. So to find P: probably mechanism research → product candidates → per-brand reverse lookup. To find N: VOC scraper queries on transformation surfaces niche venues.
- Compose with: per-brand extractor (on candidate brands), VOC chain (on niche venues), trend cap.

**Pipeline B — Product first** (have P + T, need N):
- VOC chain scoped to niche-venue searches around the product.
- Plus channel analysis (which niches the brands currently serve).

**Pipeline C — Niche first** (have N, need T and P):
- **Transformation-from-niche expander** → candidate transformations.
- Per-brand extractor on brands in those candidate transformations.
- Mechanism research → product candidates per transformation.

**Filter questions inside each pipeline:** Each filter consumes capability outputs.

| Filter | Capability(ies) providing data |
|---|---|
| Strong desire / proven spend | Per-brand extractor (revenue) + channel analysis (paid traffic) + classifier (T4 driver intensity) + purchase signal composite |
| Evergreen | Trend cap (`classification = evergreen`) |
| Why now | Trend cap (`why_now_signals[]`) |
| Emerging | Trend cap (`classification = emerging`) + product candidate discovery |
| Underserved + hungry | Market aggregator (saturation) joined with classifier+frequency (demand intensity) |
| Solvable UM | Mechanism research (`evidence_quality`, `format_candidates`) |
| Describable buyer | Classifier + PMBD clusterer (validated sub-niche exists?) |

**Threshold application:** Human until thresholds calibrate (Downstream Under).

**Phase 1 output written:** updated `hypothesis_record` with filter outcomes per market candidate. Or sub-hypothesis records per pipeline run.

---

### Phase 2 — Competition (deep market study)

**Workflow goal:** study the chosen market with full depth.

**Capabilities composed around each `brand_id`:**
- Per-brand extractor (now `depth_pass = deep`) → augments shallow record from P0
- Ad creative + visual extractor → ad inventory records
- Offer/bundle structure extractor → offer records
- Channel analysis → channel records
- VOC chain scoped to competitor reviews → classified records with `scrape_context.product_id` set to competitor product

**Joins:** per-brand record ↔ ad creative records ↔ offer records ↔ channel record ↔ VOC review records — all keyed by `brand_id`.

**Sophistication & landscape evaluation:**
- Reads aggregated per-brand + market aggregator outputs.
- Maps sophistication stage per competitor (uses `revenue`, `distribution`, `extraordinary_identifier`, `social_proof_volume` from per-brand sophistication signals).
- Output: `sophistication_assessment` record per `market_id` with per-brand stage assignments + UM availability summary.

**Gate 2 — Do you still think you can win.**
- Reads: gap analysis (Gate 1), per-brand deep records (Phase 2), sophistication assessment, VOC outputs from P3a/3b if available.
- Framework structure locked: Product UM play 95% of time, gated by gap analysis, with proven variables stolen.
- Output: `gate2_record` keyed by `market_id` — `decision` (go|no-go|pivot), `rationale`, `inputs_referenced[]`.
- Locked-decision flag: Gate 2 threshold methodology is Under. Store inputs + Human decision rather than calibrated score.

---

### Phase 3a — Structural map of themes

**Workflow goal:** identify which themes are frequent in the avatar.

**Three VOC search lanes** — all feed the same VOC chain:
- Lane 1: transformation only (population-wide), no niche filter.
- Lane 2: transformation × niche.
- Lane 3: adjacent context in niche venue (broader category beyond transformation).
- Plus: institutional report retrieval supplements Lane 3.

**VOC chain (per lane):** scraper → cleaner → classifier → frequency synthesizer (and parallel branches to quote extractor, clusterer, copy bank).

**Phase 3a output:** frequency synthesizer record, scoped to (`market_id`, `lane`, optionally `subniche_id`). Ranked themes by prevalence and intensity.

**Joins:** classifier output joins to scraper output by `voc_record_id` (preserves source metadata). Frequency synthesizer joins classifier outputs grouped by `theme_id` + scope.

---

### Phase 3b — Verbatim language bank

**Workflow goal:** capture actual words avatar uses around each theme. The copy bank.

**Same raw material as 3a, different downstream:**
- VOC chain → quote extractor → copy bank builder
- Plus: PMBD clusterer running on classified records (sub-niche validation).

**Phase 3b output:** copy bank records + cluster records (validated sub-niches).

**Sub-niche validation (strict — 5+ rule):**
- PMBD clusterer joins classified records by `author_id`, checks single-individual co-occurrence of 2+ PMBDs from candidate cluster, counts distinct authors.
- Output stored with `validation_status` field. Only `validated` ones become declared sub-niches.
- **Heaviest join in the system.** Author-keyed, cross-niche-possible (per definitions.md cross-niche caveat).

---

### Phase 3c — UM research

**Workflow goal:** understand the transformation factually + surface product candidates.

**Capabilities:**
- Mechanism research (deep version — augments P0 shallow record)
- Product candidate discovery

**Multi-pass writes:** mechanism research deep run augments P0 record (per Open Question #4 lean: augment, not overwrite). Output schema same; `depth_pass` field distinguishes.

**Human filtering:** against avatar fit, believability, IP, regulatory, economics, LTV. Some sub-checks are Op-supportable (e.g., regulatory_status from mechanism cap), most are Human. Output stored as `product_filter_decision` records pointing at `product_candidate_id`s + Human rationale.

---

### Phase 3d — Loop back

**Workflow:** revise Phase 0 and Phase 1 based on what was learned.

**Data implication:** Phase 0 records (per-brand, market aggregate, gap analysis) get re-evaluated. New `gap_score_record` written with updated inputs. Hypothesis_record updated or new one written.

**Data layer requirement:** records need versioning OR append-only with `evaluated_at` so we can see how the picture evolved.

---

### Phase 4 — Test design

**Workflow goal:** define what to test and why. Heavy read phase.

**Inputs (joined from across the map):**

| Input | Source records |
|---|---|
| Gap analysis (Gate 1) | `gap_score_record` from P0 |
| Win-decision (Gate 2) | `gate2_record` from P2 |
| Avatar understanding — frequencies | Frequency synthesizer records (P3a) |
| Avatar understanding — verbatim | Copy bank records + cluster records (P3b) |
| Mechanism + product candidates | Mechanism research + product candidate records (P3c) |
| Competitor data — proven variables | Per-brand deep records + ad creative records + offer records (P2) |

**Steps and what they write:**

1. **Define dependent (proven) variables** — Human reads competitor data, identifies what's validated. Output: `proven_variables_record` keyed by `market_id` listing locked claim formats, angles, hooks, offer structures, UMs.
2. **Define test variables** — Human picks what to change relative to proven. Output: `test_variables_record` referencing `proven_variables_record` + listing variations.
3. **Macro test selection** — Human picks same-product/new-markets OR same-market/new-products. Output: `macro_test_record` keyed by `test_id`.
4. **Awareness levels** given macro test — Human derives. Reads classifier `awareness_proxies`. Output: `awareness_target_record` per test.
5. **Micro tests / angles** — sub-avatar by sub-avatar. Reads frequency synthesizer (frequency × intensity scoring) per `subniche_id`. Output: `micro_test_record[]` per `(test_id, subniche_id)` with `angle_type` (pain|desire|authority|objection|offer), driver, pole, ladder tier, predicted resonance.
6. **Pull exact language** from copy bank per test variable. Output: `language_pack_record` per `(test_id, subniche_id, angle)` listing `quote_id`s used.
7. **ToT through** why test would/wouldn't work. Output: Human notes attached to test records.

**Final artifact:** 7–12 creatives covering as much surface area as possible. Each creative = composite record referencing all of the above + creative-specific copy/visual outputs.

**Volume profile:** Phase 4 is read-heavy on the map, low-write. Confirms the workflow.md cross-cutting note: "Phase 4 is read-heavy on accumulated Op outputs — decision gates read from the map, they don't trigger fresh research."

---

## Cross-cutting observations

### Joins that matter (ranked by load-bearing-ness)

1. **`author_id` joins across classified VOC records** — for PMBD clusterer 5+ rule. Heaviest. Author-keyed, cross-niche-possible. Drives the substrate decision more than any other query.
2. **`brand_id` joins across competitive captures** — per-brand + ad + offer + channel + competitor-VOC. Wide table, dozens of brands per market.
3. **`market_id` joins** — per-brand → market_aggregate → gate1/gate2/sophistication. Aggregation queries.
4. **`theme_id` × `scope` rollups** — classifier → frequency synthesizer. Group-by queries.
5. **`subniche_id` → copy bank filtered queries** — Phase 4 language pulls. Multi-axis filter (subniche × tier × theme × platform).
6. **Cross-phase joins for Phase 4** — Gate 1 + Gate 2 + frequency + copy + competitor data. Read-heavy, many tables.

### Gaps surfaced

1. **VOC positioning in Phase 0.** Gap analysis Desire to Solve variables (core driver proximity, severity, frequency) require VOC + classifier output, but the workflow doesn't explicitly run VOC in Phase 0. Either (a) lightweight VOC runs in P0, (b) Desire to Solve uses proxy signals only at P0 and full PMBD scoring waits, or (c) Gate 1 is intentionally rough at P0 and recalibrated at P3d loop-back. **Decision needed.**
2. **Authority proof scanner.** Gate 1 D2C Feasibility "believability — authority proof" has no capability mapped. Could be sub-routine of mechanism research, or its own Op.
3. **Awareness level inference at scale.** Phase 4 step 4 needs awareness target per test. Classifier emits `awareness_proxies` but no dedicated awareness-stage inference Op exists. Might be derivable from classifier tags + Human, or might need its own step.
4. **Hypothesis selection record format.** Locked as explicit Human step but no schema defined. Quick decision needed.
5. **Human output schemas in general.** Per Kam: "outputs I read and outputs you read should not be different." Currently every capability output is machine-side. Need a parallel layer for Human-facing rendered views (filterable map views, gap dashboards, copy bank browsers). Doesn't change underlying schema but adds a rendering layer.

### Orphans

- **Institutional report retrieval** — feeds Lane 3 but also flagged to "feed into classifier downstream (treated as another VOC source after structure extraction)." Path is loose. Confirm whether reports are tagged like VOC or have their own treatment.
- **Hidden transformation discovery** — mentioned in definitions and inventory but no explicit capability owns it. Likely emerges from joining transformation-from-product expander + VOC review mining. Worth naming if it's a real workflow.

### Source-metadata chain (architectural constraint)

Preserved end-to-end:
- VOC scraper writes full source metadata on every record.
- Cleaner carries it untouched.
- Classifier attaches to every tag.
- Quote extractor attaches to every quote.
- Copy bank indexes by it.
- PMBD clusterer joins on `author_id` from it.

**Non-negotiable.** Any substrate that drops source metadata anywhere in this chain is wrong.

### Multi-pass writes (locked lean)

Per Kam: augment, not overwrite. Implies:
- Per-brand record needs `depth_pass` field (shallow|deep) + `extracted_at` timestamp.
- Mechanism research needs same.
- Gap analysis records timestamped, never deleted (Phase 3d loop produces new gap records, not overwrites).
- Hypothesis records timestamped + chained (each cycle's hypothesis links to previous).

### Investigation scope (lean: one global map)

Per Kam: stack persistent patterns across spaces. Implies:
- No `investigation_id` field on records.
- Cross-investigation queries are first-class (e.g., "where does the bloating-belief-genetics cluster appear across all markets I've ever studied?").
- Cost: harder substrate choice (needs to scale across many investigations, not just one).

### Human-facing rendering layer (separate from substrate)

Per Kam: AI outputs ≠ Human outputs. Implication for the data layer:
- One canonical store underneath (machine-readable, joinable, lossless).
- Generated views on top — filterable map dashboards, gap score dashboards, copy bank browsers, cluster visualizers, possibly Obsidian-rendered knowledge pages.
- The "view layer" is downstream of substrate design. Don't lock it now; design substrate first.

---

## What this enumeration unlocks

With this in place, the substrate decision becomes concrete:

- **Storage shape**: ~25 distinct record types, all joinable on a small set of IDs (`author_id`, `brand_id`, `market_id`, `niche_id`, `transformation_id`, `subniche_id`, `voc_record_id`, `theme_id`). Classic relational/document-store territory.
- **Read patterns**: heavy multi-table joins for Phase 4, author-keyed cross-niche scans for PMBD clusterer, aggregations for market_aggregator and frequency synthesizer, filtered indexed queries for copy bank.
- **Write patterns**: append-mostly with augment-on-rerun; bulk writes from VOC scraper (10k+ records per investigation possibly); single-record writes for Gates and Human decisions.
- **Scale**: many investigations × dozens of brands per × thousands to tens of thousands of VOC records per. Single-machine tractable. SQLite or duckdb both plausible; postgres if multi-process.
- **Sparse fields**: classifier output has N/A everywhere — favors document stores or nullable-heavy SQL.

Substrate decision is now a focused question: pick the storage tech that handles the join patterns + sparse classifier output + multi-investigation scale + Human-view-renderable. Real decision, not abstract.

---

## What's NOT in this doc (and why)

- **Substrate choice** (SQLite vs duckdb vs postgres vs JSON files vs ...) — downstream of this enumeration. Next session.
- **Final ID generation strategies** (UUIDs vs slugs vs composite keys) — depends on substrate.
- **View/render layer design** (Obsidian? UI? generated markdown?) — separate concern, design substrate first.
- **Agent clustering** (which capabilities go in which agents) — locked rule: parked, designed per agent during spec writing.
- **Classifier-same-or-different** for competitive vs VOC — parked per Kam.
- **Pixel/purchase data** — Phases 5–8 territory, deferred entirely.
