# 03 — Retro Triage: Arduview Pipeline Run

**Date:** 2026-06-04
**Sources scanned:** 8 retro/debug/feedback documents across 4 pipeline phases.
**Classification rule:** (A) AGENTIC — engineering/tooling/contracts/orchestration. (B) MARKETING — DR knowledge, funnel reasoning, copy strategy, what marketing info an agent needs. (C) USELESS — too vague, purely prescriptive, no underlying signal.

---

## Count Table (phase × bucket)

| Source phase / step                       | A  | B  | C  | Total |
|-------------------------------------------|----|----|----|-------|
| Phase 01 — Light Pass                     | 8  | 1  | 3  | 12    |
| Phase 02 — Market Selection (RERUN-BRIEF) | 2  | 0  | 1  | 3     |
| Phase 03 — Deep Competitive / Messaging   | 5  | 0  | 1  | 6     |
| Phase 15 — Funnel Architect / Copywriter  | 4  | 5  | 2  | 11    |
| Phase 16 — Asset Classifier               | 3  | 0  | 2  | 5     |
| runs/arduview/15-DEBUG-funnel-architect   | 5  | 6  | 2  | 13    |
| runs/arduview/BUILD-FEEDBACK              | 4  | 2  | 2  | 8     |
| **TOTAL**                                 | **31** | **14** | **13** | **58** |

---

## Phase 01 — Light Pass

**Source:** `.planning/phases/01-stage-m1-s1-light-pass/01-DEBUG-RUN-NOTES.md`

### Bucket A — AGENTIC

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| A1 | "The `extractTrendSeries()` function in `fetch.js` uses three regex patterns to find `timelineData` in the Trends page HTML. Google Trends now loads the interest-over-time series via a deferred XHR/API call — the data is NOT embedded in the initial page HTML." | `fetch.js` Google Trends extraction is broken (0% fill-rate); deferred-XHR data never captured. |
| A2 | "The full 20-brand fetch with Google Trends runs too long (>600s) in a single pass." | Fetch is sequential; single-pass batch times out before completing all brands. |
| A3 | "space-map.json has no `mechanisms_in_play[]` array. The Classifier was told to do the analysis but given no field to write the result into." | Output schema missing `mechanisms_in_play[]` slot — classifier judgment falls into a void; aggregate never written. |
| A4 | "a mechanism shared in a *different* cell doesn't make it taken here. Emit both the space-wide canonical list ... AND per-combo presence" | Mechanisms-in-play lacks per-combo cell scoping; downstream gates (2.2, 3.3-S3) receive a flat global list instead of cell-scoped data. |
| A5 | "The brief's discrimination test ('is the hardware THE pitch or a footnote?') is stranded in context — the bet-type step never tells the agent to apply it. Wiring gap." | Bet-type classification step is not wired to consume the brief's discrimination test; agent ignores it. |
| A6 | "No principle that same-category brands can make OPPOSITE bets. ... They were merged because both are 'retro handhelds.'" | Classifier clusters bets by product category rather than by structural kind of differentiation edge. |
| A7 | "Frame was assigned by impression rather than by where it is textually loaded — same root cause as Failure 1." | Bet-type/angle assignment reads by vibe, not by copy-weight or text position; no prominence-check instruction in the step. |
| A8 | "Add explicit per-brand field: `leads_with`: the mechanism/UM the brand actually leads with — page-quoted" | No `leads_with` field in the output schema; the distinction between claimed lead and real page lead is unrecoverable from current output. |

### Bucket B — MARKETING

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| B1 | "For this product class `mechanism[]` is the usable signal, NOT `problem_um_raw`. ... gadget/maker pages don't run pain-causal 'here's why you suffer' stories." | Classifier prompt treats `problem_um_raw` and `mechanism[]` as equivalent signal sources; for gadget/maker spaces the pain-causal framing is absent by design, not a gap. |

### Bucket C — USELESS

| # | Verbatim quote (1-2 lines) | Why C |
|---|----------------------------|-------|
| C1 | "miyoo.com returned ERR_CONNECTION_REFUSED. Brand retained per D-06." | Isolated one-off site-offline event; no systemic problem. |
| C2 | "3 pages returned 404 — skeleton-key Crowd Supply... meowbit KittenBot." | Same: one-off dead pages, no actionable systemic signal. |
| C3 | "(optional/low-priority) — Niche resolution: only one niche captured per brand when the page names multiple." | Vague improvement wish without signal about what broke. |

---

## Phase 02 — Market Selection (RERUN-BRIEF)

**Source:** `runs/arduview/RERUN-BRIEF.md`

### Bucket A — AGENTIC

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| A1 | "The first run executed the entire gate with **zero DR grounding** — SKILL.md falsely claimed its DR files were 'auto-injected'; no such mechanism existed, so the agent never read them." | SKILL.md declared DR files as auto-injected when no such hook was wired; agent skipped all DR knowledge. |
| A2 | "It also **never read the corpus dumps** (only ran `ls corpus/`), so the `[INFERENCE]` mechanisms-in-play clusters weren't sourced to the data they cite." | Agent ran `ls` instead of reading content; claimed inference from corpus it never opened. |

### Bucket C — USELESS

| # | Verbatim quote | Why C |
|---|----------------|-------|
| C1 | "This brief mandates reading the corpus." | Pure process directive, not a diagnosed problem. |

---

## Phase 03 — Deep Competitive Analysis / Messaging

**Source:** `.planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md`

### Bucket A — AGENTIC

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| A1 | "URL normalization splatter — a single competitor's ads may point to multiple near-identical URLs (A/B variants, utm param variants not fully stripped) and incorrectly assemble as separate funnels instead of one." | `normalizeUrl()` regex in `funnel-assemble.js` is uncalibrated for real LP URL patterns; A/B and UTM variants fragment into phantom separate funnels. |
| A2 | "Funnel-level position vs page-local — the Section Analyzer is instructed to emit funnel-level ordinal `position`... but this is a known failure point." | Belief position field may be page-local ordinal rather than funnel-level ordinal; duplicate-position hook rejects are the expected detection signal. |
| A3 | "DOM selector calibration (adlib-one.js) — the `extractAdCards()` DOM selectors are marked `TODO(D-17)`... may miss `destination_url`, `cta_text`, or `headline` on the live Ad Library DOM." | Ad Library DOM extraction selectors are heuristic/unverified; live-run null rates unknown. |
| A4 | "The Section Analyzer was TOLD — `read_first` / 'As your FIRST step you MUST Read...' — to fetch the DR bundle... Both are LLM-compliance steps, not guarantees: one missed Read = no DR rubric or no funnel body in context." | Subagent DR + funnel-body ingestion relied on LLM compliance (`read_first` instruction), not deterministic injection; any missed Read silently breaks the analysis. |
| A5 | "Review-block tagging (funnel-clean.js) — `extractReviewBlocks()` uses HTML class-name heuristics. Platforms with hashed class names (Kickstarter React rendering) may return empty `review_blocks[]`." | Review-block extraction on React-rendered pages (Kickstarter) is unreliable due to hashed class names. |

### Bucket C — USELESS

| # | Verbatim quote | Why C |
|---|----------------|-------|
| C1 | "Belief over-classification — the Section Analyzer may emit too many belief-instance records per funnel (one per sentence rather than one per belief installed)." | Anticipated failure with no evidence it occurred; no data from a real run. |

---

## Phase 15 — Funnel Architect / Copywriter Build

**Source:** `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-RESEARCH.md` + `15-01-SUMMARY.md`

### Bucket A — AGENTIC

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| A1 | "The operator's #1 risk is injection wiring: both specs say DR files are 'auto-injected / pasted alongside' — this is the documented mislabel that caused a zero-grounding run in 2026-06." | Agent spec documentation falsely described DR injection as automatic; this is a recurring pattern across multiple skills. |
| A2 | "The existing `_index.json` records confirmed by inspection carry NO `source_type` or `routing_flag` fields — `funnel-vectorize.js` `loadUnits()` never adds them to the unit object." | `funnel-vectorize.js` drops `source_type`/`routing_flag` when indexing; RAG retrieval cannot filter by source without them. |
| A3 | "No cleaned-body fixture wired. The verbatim gate aborts with CONFIG-ERROR because no `*-clean.json` / `-clean.txt` exists for funnel_id `gameshell-kickstarter`. The synthetic fixture ships without one." | Synthetic test fixture missing a cleaned-body companion; validator exits on CONFIG-ERROR instead of running the validation it's meant to test. |
| A4 | "Fixture violates pre-existing enums. `proof_tier` uses `'Tier 1'` (space) vs `PROOF_TIER_ENUM = Tier1`; `moves` use descriptive freeform tags (e.g. `exploded-diagram`) not in `MOVE_ENUM`." | Test fixture out of sync with validator's closed enums; pre-existing schema drift makes the fixture non-runnable. |

### Bucket B — MARKETING

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| B1 | "`belief_kind` (crowdfunding-specific | general-DR) is ABSENT from the 6b schema." | Belief records don't distinguish crowdfunding-specific persuasion moves from general DR moves; downstream funnel architect cannot filter by context-fit. |
| B2 | "Primary key = individual `moves[]` tag... Individual move tags are the correct granularity for saturation detection — they name discrete persuasive acts at a level the Architect can act on." | Claim-tally had no defined primary key; without it the architect can't distinguish saturated from ownable persuasive moves. |
| B3 | "5-file ALLOWLIST: funnel-architecture, persuasion, differentiator, consumer-psychology, offer-construction (all carl-weische variant + one shared file)" | Funnel architect DR bundle had no formally locked file list; which DR knowledge the architect operates on was undefined. |
| B4 | "Structural reference (competitor funnel whose belief-order is modeled) is separate from language retrieval." | RAG retrieval pipeline conflated structural reference (belief-order modeling) with copy-language retrieval; two distinct uses required separate query paths. |
| B5 | "`funnel_sequence`, `offer_mechanic`, `urgency_construction` were **null for all four**. The deep-pass captured the belief records but not the funnel-level shape." | Deep-pass schema captures belief-level micro data but no funnel-level shape fields (sequence, offer mechanic, urgency); architect has no structural reference from analyzed comps. |

---

## Phase 16 — Asset Classifier

**Source:** `.planning/phases/16-asset-classifier-image-and-video-bricks/16-06-SUMMARY.md` + `FORMALIZE-HANDOFF.md`

### Bucket A — AGENTIC

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| A1 | "vid-01/vid-02 comprehension re-run: first pass misread mm:ss.ff timestamps as minutes (hallucinated multi-minute timelines for ~13s clips); re-run with explicit duration fixed it." | Comprehend-video agent prompt does not embed clip duration; without it the model guesses and fabricates timeline data. |
| A2 | "**Dedupe hamming threshold 5 → 15** (16-02): the real img-04/img-05 pair sits at distance 12; spec's 5 would miss it. Measured, documented in code." | Hamming dedupe threshold in spec was set without measuring on real data; spec value (5) is too tight for actual near-duplicate pairs. |
| A3 | "asset-emit.js hand-edited after 16-05: added image specs table... fixed the video gap_list to derive from best_use coverage (was emitting spurious 0-candidate gaps)." | `asset-emit.js` gap_list derivation logic was incorrect in its shipped form; emitted false gaps (0-candidate sections) before hand-editing. |

### Bucket C — USELESS

| # | Verbatim quote | Why C |
|---|----------------|-------|
| C1 | "**`whats_in_box` has NO asset** — no packaging/cable/unboxing footage." | Operator content gap, not a pipeline problem. |
| C2 | "**Aesthetics: 0/20 videos graded 'ad-ready'** — raw handheld footage." | Product reality, not a tooling or process failure. |

---

## runs/arduview/15-DEBUG-funnel-architect.md

**Source:** `runs/arduview/15-DEBUG-funnel-architect.md`

### Bucket A — AGENTIC

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| A1 | "The store had **`qualifying_creatives = 0` everywhere** → zero ad-longevity signal. The real signal (Flipper's curiosity hook: 53/117 ads, 238-day top run, 1M+ sold) sat in raw `ads/` and was only recovered by a spawned agent." | Funnel store doesn't aggregate ad-level validation data (longevity, spend, active-days per angle) into a form the architect can consume; raw `ads/` data is unreachable without a subagent. |
| A2 | "Anchored to the wrong artifact twice before reading the source of truth: accepted the art-director's pre-extracted frames before reading the handoff that called them non-binding." | Architect-facing handoff docs contain competing artifacts with no clear single source of truth; session starts on the wrong artifact. |
| A3 | "**Loaded image bytes into main context** (5 photos) when a subagent should have done the looking — corrected only after the operator flagged it." | Architect skill lacks a hard "images are never read in main context" rule; operator must catch the violation. |
| A4 | "Auditing a session belongs **in-session, before compaction** — the value is the decision trace, which lives in conversation, not the run files. A fresh 'reconstructor' agent is the wrong tool." | Retro/audit is run post-compaction on a fresh agent with no decision trace; the audit process produces low-signal reconstruction instead of real trace analysis. |
| A5 | "**Many small re-do loops** (copy / images / captions) because inputs arrived piecemeal across the session rather than as one complete brief." | Architect input-gathering is sequential and mid-session; operator data (offer, assets, founder facts) arrive as the design is being built, not before. |

### Bucket B — MARKETING

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| B1 | "**Currency A (messaging):** per brand × angle I needed — ad count, max run-length-days, total active-days, impression bucket, variant count." | The architect's input contract has no validation map; message selection defaults to reputation-driven rather than spend-validated. |
| B2 | "No VOC corpus at all. Both Carl and Mark call VOC *the* foundation (80% of copy effort). I needed: pains/desires/objections in **verbatim buyer language**." | No VOC step precedes funnel design; the entire belief chain sits on asserted transformation rather than validated buyer language. |
| B3 | "`awareness_entry` was **null for all four** comps. The skill's own law is 'structure follows awareness.' I had to infer the backer's awareness from how each comp *opens*." | Awareness field is not captured in the funnel store; architect must infer awareness from comp opening structure, a guess rather than a stored read. |
| B4 | "`funnel_sequence`, `offer_mechanic`, `urgency_construction` were **null for all four**." (duplicate of Phase 15 B5 — same problem surfaced from architect seat) | Deep-pass never captures funnel-level shape; architect builds structural references from non-competitive sources (operator's own inkleaf LP + DR frameworks). |
| B5 | "**The architect bundle had no copywriting file — but copywriting DR turned out to be architect-relevant.** Hook construction, claim-typing, feature-to-benefit, Mark's 'necessary beliefs document' were all needed to write the brief well." | DR bundle split (architect vs copywriter) is role-based, not situation-based; the line between brief-level hook/claim work and copy prose is porous, causing the architect to operate blind on craft decisions. |
| B6 | "**A large share of the loaded copywriting DR didn't fit this product.** Much of it is pain-led advertorial machinery... Arduview is desire-driven with no pain, so that half was inapplicable — and an anchoring risk." | DR bundles are static allowlists; they aren't filtered by product awareness/desire/pain profile, creating irrelevant context that anchors toward wrong frameworks. |

### Bucket C — USELESS

| # | Verbatim quote | Why C |
|---|----------------|-------|
| C1 | "**Blocked ports / trust assets:** founder identity + track record, press, prototype count... collected mid-session or still open (founder)." | Operator data-collection gap, not a pipeline or marketing knowledge problem. |
| C2 | "**Asset inventory as a design input**... arrived in waves AFTER the design." | Sequencing problem on this run; addressed by pre-design brief discipline, not a structural fix needed. |

---

## runs/arduview/BUILD-FEEDBACK.md

**Source:** `runs/arduview/BUILD-FEEDBACK.md`

### Bucket A — AGENTIC

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| A1 | "**COPY-DRAFT.md read fully ~3×** as it changed. Later passes only needed the `ASSET` lines — grep those instead of full re-reads." | Builder context loop re-reads full large files on every change; no targeted-read pattern or grep-for-section convention in the builder spec. |
| A2 | "**3 brand-ref docs (~1,380 lines)** — the biggest single spend. User-requested, so justified, but now fully distilled into STYLE-LOCK.md. **Never re-read the brand-refs**." | Brand-ref docs are read raw by downstream agents even though all needed information is already distilled into STYLE-LOCK.md; no hard allowlist enforced. |
| A3 | "The builder does not need the `humanizer` skill... The builder's only AI-tell risk is **over-building**." | No explicit additive-restraint rule in the builder spec; agent adds customer-facing content (captions, section labels) that the copy brief never authorized. |
| A4 | "**One dead `ToolSearch`** ('browser playwright') returned unrelated tools. Skip — use Playwright via node directly." | Wasted tool call from an ambiguous search term; no knowledge-base entry stating how Playwright is invoked in this project. |

### Bucket B — MARKETING

| # | Verbatim quote (1-2 lines) | Underlying problem |
|---|----------------------------|--------------------|
| B1 | "Hero headline highlight 'see right through' rendered **black-on-black**. Same bug hit again: deposit '$5 deposit' highlight black-on-black. Root cause: the accent/highlight class defaulted to dark ink and was only patched for *some* dark containers." | Style spec (STYLE-LOCK.md) does not define context-aware accent/highlight rules; contrast behavior on dark surfaces is unspecified. |
| B2 | "**LP hero above the fold:** title + CTA + video... **Deposit above the fold:** image + title + CTA + the value (51% off)... State the fold budget per page explicitly." | Copy brief specifies what to say but not page fold budgets or element ordering per breakpoint; these had to be corrected mid-build via feedback. |

### Bucket C — USELESS

| # | Verbatim quote | Why C |
|---|----------------|-------|
| C1 | "**Playwright lives at `/home/kyu3/node_modules/playwright`** (NOT the project)" | One-time environment quirk, already stored in memory. |
| C2 | "The entire §1 visual delta list + §2 restraint rule → this doc → Phase 17 UI-SPEC." | Process note, not a problem signal. |

---

## Cross-cutting patterns (notable clusters across phases)

1. **"Auto-injected" DR fiction (A-recurring):** At least 3 phases (02, 03, 15) all hit the same root issue — a SKILL.md or spec claimed DR files were auto-injected when no such mechanism existed. Every run that relied on this claim ran with zero DR grounding until the issue was caught.

2. **Schema holes that drop agent judgment (A-recurring):** Phases 01 and 03 both had cases where the agent was instructed to do an analysis (mechanisms-in-play clustering; funnel-level shape) but had no output field to write the result into. The analysis silently vanished.

3. **Macro-layer inputs arrive null (B-recurring):** The funnel architect debug (15-DEBUG) surfaces that validation economics, VOC, awareness, funnel structure, and objection set were all null or inferred — a systemic pattern that affects every run on a new product.

4. **Static DR bundles unfit for product profile (B-recurring):** Both the architect debug and the copywriter setup surface that fixed allowlists produce irrelevant context (pain-led copy for a desire-driven product) while missing relevant context (line-craft for the architect role).
