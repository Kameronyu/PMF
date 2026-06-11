# Agentic Failures — Arduview Pipeline Run

Mined from orchestrator-produced run debug docs only: 01-DEBUG-RUN-NOTES.md,
03-DEBUG-RUN-NOTES.md, runs/arduview/15-DEBUG-funnel-architect.md,
agents/funnel-deep-pass-run-notes.md, and runs/arduview/BUILD-FEEDBACK.md.
Audit index (03-retro-triage.md) used as a pointer only — each entry verified
against the primary debug doc above. Symptoms only — no fix prescriptions.

---

## Phase 01 — Light Pass (fetch.js / Classifier / space-map schema)

| ID | Symptom | Source doc | Affected stage/component | Contract-dependent? |
|----|---------|------------|--------------------------|---------------------|
| P01-A1 | `extractTrendSeries()` uses three regex patterns to find `timelineData` in Trends page HTML. Google Trends now loads via a deferred XHR — the data is NOT embedded in initial HTML. All 20 brands returned `demand_trend.shape: unknown`. | 01-DEBUG §D-01 BREAK 1 | fetch.js — Google Trends extraction | N |
| P01-A2 | Full 20-brand fetch with Google Trends runs too long (>600s) in a single pass. Brands 15-20 not reached; required a second targeted pass. | 01-DEBUG §D-01 BREAK 2 | fetch.js — batch timeout | N |
| P01-A3 | `space-map.json` has no `mechanisms_in_play[]` array. The Classifier was told to do the analysis but given no field to write the result into. Whether it ran the clustering is unverifiable — the output has no record of it either way. | 01-DEBUG §BREAK 5 / §BREAK 6 | Classifier output schema — `space-map.json` | N |
| P01-A4 | `mechanisms_in_play[]` lacks per-combo cell scoping. A mechanism shared in a different cell doesn't make it taken here; downstream gates 2.2 and 3.3-S3 need per-cell presence. The early stopgap used a flat global list. | 01-DEBUG §Run-1-Classifier-Fix-Handoff Fix 4 | Classifier schema + aggregate-mechanisms-in-play.js | N |
| P01-A5 | Bet-type classification step is not wired to consume the brief's discrimination test. "The brief's discrimination test ('is the hardware THE pitch or a footnote?') is stranded in context — the bet-type step never tells the agent to apply it. Wiring gap." | 01-DEBUG §Run-1-Classifier-Fix-Handoff Failure 1 | Classifier prompt — step 4b wiring | N |
| P01-A6 | Classifier clusters bets by product category, not by structural kind of differentiation edge. Analogue-pocket (`no-emulation authenticity`) and Evercade (`biggest-licensed-library value-breadth`) were merged because both are retro handhelds. "No principle that same-category brands can make OPPOSITE bets." | 01-DEBUG §Run-1-Classifier-Fix-Handoff Failure 2 | Classifier prompt — bet unification logic | N |
| P01-A7 | Bet-type/angle assignment reads by vibe, not by copy-weight or text position. "Frame was assigned by impression rather than by where it is textually loaded." Flipper Zero got `community-membership-signal` on thin copy while pwnagotchi's page explicitly stated it and did not get the tag. | 01-DEBUG §Run-1-Classifier-Fix-Handoff Failure 3 | Classifier prompt — prominence-check instruction | N |
| P01-A8 | No `leads_with` field in the output schema. The distinction between the brand's claimed lead and its real page lead is unrecoverable from current output. | 01-DEBUG §Run-1-Classifier-Fix-Handoff Fix 3 | Classifier output schema — per-brand `leads_with` | N |

---

## Phase 02 — Market Selection

| ID | Symptom | Source doc | Affected stage/component | Contract-dependent? |
|----|---------|------------|--------------------------|---------------------|
| P02-A1 | The first run executed the entire gate with zero DR grounding. SKILL.md falsely claimed its DR files were "auto-injected"; no such mechanism existed, so the agent never read them. | 03-retro-triage §Phase 02 A1 (verified against market-selection.md grounding note: "supersedes the prior run … which ran with zero DR grounding") | market-selection SKILL.md — DR injection wiring | N |
| P02-A2 | First run never read the corpus dumps. Only ran `ls corpus/`; the `[INFERENCE]` mechanisms-in-play clusters were not sourced to the data they cited. | 03-retro-triage §Phase 02 A2 (verified against market-selection.md: "no corpus derivation, no [INFERENCE] cluster" in the corrected re-run note) | market-selection SKILL — corpus read instruction | N |

---

## Phase 03 — Deep Competitive Analysis / Funnel Pipeline

| ID | Symptom | Source doc | Affected stage/component | Contract-dependent? |
|----|---------|------------|--------------------------|---------------------|
| P03-A1 | `funnel-level position vs page-local`: Section Analyzer instructed to emit funnel-level ordinal `position`, but this is a known failure point. Validate-analyzer.js duplicate-position rejects are the expected detection signal. (Not yet observed on real data — flagged pre-run.) | 03-DEBUG §Known failure 2 | Section Analyzer — position ordinal; validate-analyzer.js | N |
| P03-A2 | `extractAdCards()` DOM selectors in `adlib-one.js` are marked `TODO(D-17)` — heuristic, unverified on live Ad Library DOM. May miss `destination_url`, `cta_text`, or `headline`. Null rates on a real run are unknown. | 03-DEBUG §Known failure 5 | adlib-one.js — DOM selector calibration | N |
| P03-A3 | `extractReviewBlocks()` in `funnel-clean.js` uses HTML class-name heuristics. Platforms with hashed class names (Kickstarter React rendering) may return empty `review_blocks[]`. | 03-DEBUG §Known failure 6 | funnel-clean.js — review-block extraction | N |

---

## Phase 15 — Funnel Deep-Pass / Architect-Copywriter

| ID | Symptom | Source doc | Affected stage/component | Contract-dependent? |
|----|---------|------------|--------------------------|---------------------|
| P15-A1 | All 4 stored funnels have `primary_claim: null`, `awareness_entry: null`, `funnel_sequence: null`, `offer_mechanic: null`, `urgency_construction: null`. `funnel-store.js` reads 6a fields from the assembled package, not from the Section Analyzer's `funnel_fields` wrapper. Correct values exist only in `funnels-analyzer-out/*-beliefs.json`. | funnel-deep-pass-run-notes §8 | funnel-store.js — `buildStoredRecord` / `funnel_fields` persistence | N |
| P15-A2 | `funnel-score.js` was passed clean output (`funnels-clean/`) instead of assembled packages for the first 3 DTC brands. "The correct input to funnel-score.js for DTC stubs is the stub package itself." Passing the clean output loses `bound_ads` and `crowdfunding_stats`. | funnel-deep-pass-run-notes §5 | funnel-score.js — input-file selection | N |
| P15-A3 | Orchestrator told Section Analyzer subagents to `Read` a pre-assembled context file instead of embedding bytes via `funnel-analyzer-context.js`. "This worked because the file existed … but it violates the design." | funnel-deep-pass-run-notes §6 | Section Analyzer orchestration — deterministic context embed | N |
| P15-A4 | `crowdfunding_stats` silent field-name footgun: `funnel-score.js` destructures `amount_raised` but a writer may supply `amount_raised_usd`. Reads as `undefined`, stamps null, no error thrown. Lane B scores as unknown with no indication of the cause. | funnel-deep-pass-run-notes §4 | funnel-score.js — `crowdfunding_stats` field-name validation | N |
| P15-A5 | `funnel-vectorize.js` `loadUnits()` never adds `source_type` or `routing_flag` to the indexed unit object. Existing `_index.json` records carry neither field. RAG prefilters filter against null for every record, rendering `--source-type` / `--routing-flag` flags inoperative. | 15-RESEARCH.md §Summary | funnel-vectorize.js — loadUnits field propagation | N |
| P15-A6 | Synthetic fixture `runs/_fixture/funnels/sample.json` has no companion cleaned-body file. `validate-analyzer.js` verbatim gate exits CONFIG-ERROR instead of running validation. Fixture also uses `"Tier 1"` (space) where `PROOF_TIER_ENUM = Tier1`, and `moves` carry freeform tags not in `MOVE_ENUM`. | 15-01-SUMMARY §Deviation | validate-analyzer.js test fixture — enum drift + missing clean-body | N |
| P15-A7 | `qualifying_creatives = 0` everywhere in the funnel store. Ad-longevity signal (e.g. Flipper's 53/117 ads, 238-day top run) sat in raw `ads/` files and required a spawned subagent to recover. "The store had qualifying_creatives = 0 everywhere → zero ad-longevity signal." | 15-DEBUG-funnel-architect.md §1 | Funnel store — ad-level validation aggregation | Y |
| P15-A8 | Architect skill lacks a hard "images are never read in main context" rule. "Loaded image bytes into main context (5 photos) when a subagent should have done the looking — corrected only after the operator flagged it." | 15-DEBUG-funnel-architect.md §Session process retrospective | Funnel architect SKILL.md — image-read constraint | N |
| P15-A9 | Architect-facing handoff docs contained competing artifacts with no clear single source of truth. Architect anchored to the wrong artifact (art-director pre-extracted frames) twice before reading the source of truth. | 15-DEBUG-funnel-architect.md §Session process retrospective | Architect input brief / handoff structure | Y |

---

## Phase 16 — Asset Classifier

| ID | Symptom | Source doc | Affected stage/component | Contract-dependent? |
|----|---------|------------|--------------------------|---------------------|
| P16-A1 | Comprehend-video agent prompt does not embed clip duration. First pass misread mm:ss.ff timestamps as minutes; "hallucinated multi-minute timelines for ~13s clips"; required a re-run with explicit duration. | 16-06-SUMMARY §Deviations | comprehend-video agent prompt | N |
| P16-A2 | Hamming dedupe threshold in spec set to 5 without measuring on real data. "The real img-04/img-05 pair sits at distance 12; spec's 5 would miss it." Threshold had to be bumped to 15. | 16-06-SUMMARY §Deviations | probe.py — phash dedupe threshold | N |
| P16-A3 | `asset-emit.js` `gap_list` derivation was incorrect as shipped: "was emitting spurious 0-candidate gaps." Required hand-editing after Phase 16-05. Changes are uncommitted (working tree modified). | 16-06-SUMMARY §Deviations; git status M tools/asset-emit.js | asset-emit.js — gap_list derivation | N |

---

## Cross-cutting

| ID | Symptom | Source doc | Affected stage/component | Contract-dependent? |
|----|---------|------------|--------------------------|---------------------|
| CC-A1 | "Auto-injected" DR fiction: at least Phases 02, 03, 15 had SKILL.md or spec docs declaring DR files as auto-injected when no such mechanism existed. Runs relying on this claim executed with zero DR grounding. | 03-retro-triage §Cross-cutting 1; 15-RESEARCH §Summary; funnel-deep-pass-run-notes §6 | Multiple SKILL.md files — DR injection wiring | N |
| CC-A2 | Schema holes that drop agent judgment: Phases 01 and 03 both instructed agents to produce an analysis (mechanisms-in-play clustering; funnel-level shape fields) but provided no output field to write the result into. The analysis silently vanished. | 03-retro-triage §Cross-cutting 2; 01-DEBUG §BREAK 5/6; 03-DEBUG §Known failure 2 | Classifier output schema; Section Analyzer output schema | N |
| CC-A3 | Builder context loop re-reads full large files on every modification cycle. "COPY-DRAFT.md read fully ~3× as it changed. Later passes only needed the ASSET lines." No targeted-read or grep-section convention in the builder spec. | BUILD-FEEDBACK.md §Session post-mortem | LP Builder SKILL / build spec | N |
| CC-A4 | Builder spec has no explicit additive-restraint rule. Agent adds customer-facing content the brief never authorized (invented captions, section labels, badge text). "The builder does not need the humanizer skill … The builder's only AI-tell risk is over-building." | BUILD-FEEDBACK.md §Builder restraint rule | LP Builder SKILL.md | N |
| CC-A5 | Retro/audit is run post-compaction on a fresh agent with no decision trace. "Auditing a session belongs in-session, before compaction — the value is the decision trace, which lives in conversation, not the run files. A fresh 'reconstructor' agent is the wrong tool." | 15-DEBUG-funnel-architect.md §Session process retrospective | Retro / audit process | N |

---

## ALREADY-RESOLVED (do not re-fix)

| Item | Commit |
|------|--------|
| funnel-clean.js: markdown ATX heading section-marking (D-01) | `3d70cb4` |
| funnel-score.js: no-currency fail-loud guard (D-02) | `b34fc16` |
| funnel-deep-pass SKILL: corpus-absent + no-ads-DTC exclude guards (D-04, D-05) | `0b225d1` |
| All space-map.json pointers unified on `runs/<space>/` including aggregate-mechanisms-in-play.js default (D-07) | `bbea538` |
| belief_kind + source_routing ghost fields removed from funnel-architect INPUTS spec (D-10) | `97ac03a` |
| normalizeUrl A/B-test URL param stripping (URL splatter phantom funnels) | `bbff2ff` |
| funnel-store.js funnel_fields persistence (primary_claim, awareness_entry, etc.) | `bbff2ff` |
| belief_kind first-class field: schema + fixture + validator rule | `1c016d8`, `35581d4` |
| source_type + routing_flag carried through funnel-vectorize.js loadUnits; --source-type/--routing-flag prefilters added to funnel-rag-query.js | `205db9a` |
| Stale "Section Analyzer MUST Read that bundle" line scrubbed from prompts/funnel-deep-pass.md (D-09) | `65ede11` |
| mechanisms_in_play[] slot added to space-map.json schema + aggregate-mechanisms-in-play.js built | resolved in Phase 01 run (documented in 01-DEBUG §BREAK 5 ✅ block) |
