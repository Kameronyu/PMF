---
status: authoritative
role: Full architecture & strategy design (topology, per-agent cards S6, knowledge scoping S7, orchestration S8, seams S9, veto register S12). Primary build-from doc.
read-with:
  - architecture/PART0--pipeline-flow.md
  - architecture/PART3-READER--human-map.md
  - standards/SPEC-marketing-soundness.md
supersedes:
  - "within-doc: S1.5 (R1) / S1.6 (R2) govern over S4.1-4.3 and the pre-R1 parts of S6.4/S6.7, which are marked SUPERSEDED trails"
---

> **What this is:** the primary build-from architecture. **Read by:** the system-design pass + every stage build. Build from S1.5/S1.6; S4 is a superseded reasoning trail.

# PART 3 — Architecture & Strategy Design

**Arduview pipeline · Phase 3 of the handoff (design session, fresh window)**
Built on PART 1 (dependency-ordered map, 65 annotations) and PART 2 (build-order roadmap). Repo state read: `eink-phase0-run` of `Kameronyu/PMF` — the as-ran skills, prompts, tools, run artifacts, plus the two admitted specs (`15-SPEC-copywriter.md`, `handoff-step3-voc-build.md`). DR KB read in full this session from `C:\Users\kyu3\Documents\DRKB` (65 canonical files; " - Copy" duplicates excluded) — the re-verifications PART 1 deferred to this session are in §2.

**Scope line (handoff honored):** this is design, not implementation. No skills built, no code wired, no KB mechanized. Every system-design call here is a recommendation the operator can veto; every marketing-truth question is routed to its decision session (PART 2 Jobs 1–4), not decided here.

**⚠ REVISION R1 (operator decision, after PART 3 was first written) — read §1.5 first.** The front half of the pipeline was re-sequenced: deep funnel analysis now runs *before* the space map, on the full verified roster, and each ad is classified so ad-volume/spend can be quantified per transformation and per angle. The "light pass" is dissolved. §1.5 governs wherever it conflicts with §4.1, §4.2, §4.3, §6.4, or §6.7 below — those sections are left intact as the original reasoning trail.

**Three glyphs used throughout:**
- ● = operator-settled in the annotations; honored, not re-opened.
- ◆ = my system-design call, flagged vetoable. All ◆ collected in the veto register (§12).
- ○ = open slot this design shapes but does not fill — content belongs to a PART 2 decision session (marketing truth, thresholds, test content).

---

## ⚠ MARKETING-SOUNDNESS STANDARD — MANDATORY READ BEFORE BUILDING

Every session that builds a skill/agent here, and the final system-design pass, must read **`SPEC-marketing-soundness.md`** (the Standard), **`marketing-rule-register.md`** (the operator-owned rule Register), and **`BUILDER-DIRECTIVE.md`** (the build-session preamble) before writing prompts. These implement six settled decisions about keeping marketing *decisions* good (C2, C3, C5, C6, C7, C8), via three mechanisms:

- **Grounding (C2):** every load-bearing marketing judgment emits `{verdict, grounding_ref, grounding_quote, application}`, citing a DR-law/test ID or a Register rule-ID; where none fits, it is marked `UNGROUNDED` and carried up.
- **Carry (C3/C5/C6/C8):** every output carries `carried_risks[]`; an UNGROUNDED call, a blank input, a `CANNOT-EVALUATE` check, and a low-n value each become a carried risk that propagates to the operator at each ★ gate. Checks report `PASS | FAIL | CANNOT-EVALUATE`; counted/scored values emit `{value, n, low_n}`.
- **Register (C7):** the operator-owned source of truth for in-force marketing rules; interpretive calls are made, carried to the operator, and ratified back as new rule-IDs.

Per-agent soundness duties are in **§6.0**. This Standard is scoped to marketing-decision quality only; prompt-mechanization (C1) and field continuity (C4) are separate sessions.

---

## 1. What this design consumed

1. **PART 1 / PART 2** — the captured judgment and its gating structure. The annotations referenced by ID throughout (A1–A43, P1–P22) are quoted verbatim in PART 1; they are not re-quoted here.
2. **The as-ran repo** — full pass over `MAP.md`, `prompts/step1-light-pass.md`, the six skills, all 40+ scripts in `tools/`, the Arduview run artifacts, `definitions.md`, both admitted specs, and the run's own failure documentation (`run-retrospective.md`, `_agentic-failures.md`, `_marketing-decisions/*`).
3. **The DR KB** — file-by-file inventory: content type, which pipeline decision each file actually bears on (by content, not title — see §7.2), and verbatim extraction of the load-bearing law passages.

### 1.1 Job 0 findings surfaced during exploration (diagnostics PART 2 ordered; answered here for free)

These are facts, not design. They feed the decision sessions as evidence.

- **A22 / P9 (wiring vs query generation):** it was wiring, in three concrete places, before query quality even gets tested. (1) `fetch.js extractTrendSeries()` cannot parse Google Trends' deferred-XHR payload → `demand_trend.shape = "unknown"` for all 20 brands (run-documented as P01-A1). (2) Ad-longevity signal was never lifted from raw `ads/*.json` into the store → `anti_fluke.qualifying_creatives = 0` everywhere while Flipper Zero's raw file holds 53 recovered ads with a 238-day top run (P15-A7). (3) `funnel-store.js` read the 6a funnel fields from the assembled package instead of the analyzer's `funnel_fields` wrapper → `primary_claim`, `awareness_entry`, `funnel_sequence`, `offer_mechanic`, `urgency_construction` stored as null for all 4 funnels even though the analyzer produced them (they sit correct in `funnels-analyzer-out/*-beliefs.json`) (P15-A1). Query generation remains untested as a cause — but A39's suspicion ("comes back to quality of the bet brief") stands unrefuted and D4 still gates it.
- **A39 (what did the orchestration actually do):** each skill is an orchestrator-in-the-main-loop that spawns subagents and runs scripts itself; stages were invoked as slash commands. The headline failure: **`.claude/settings.json` PostToolUse hooks do not fire inside subagents**, so the "validate on write" and "auto-injected DR" stories silently collapsed — the first market-selection run executed all four gates with zero DR grounding and never read the corpus dumps (CC-A1, P02-A1/A2). The committed `market-selection.md` is a corrected re-run. Additionally: `validate-analyzer.js` demonstrably never gated the run's 43 belief records (`belief_kind` is schema-required, validator-enforced, and absent from every record); the deterministic context-assembler (`funnel-analyzer-context.js`) was bypassed in favor of telling analyzers to Read a file (P15-A3); and every `inject-*-dr.js` writes a filename that does not match the committed `_dr-context.generated-*.md` names, so regeneration would strand the `read_first` references.
- **A41 (how funnels were actually packaged):** deterministic and close to the operator's rule already — `funnel-assemble.js` normalizes ad destination URLs, clusters ads per URL, renders the LP via Playwright, emits one package per cluster. Two gaps vs A41: packages carry **LP only, no PDP** and no link-path verification; and the D-05 guard (DTC brand with zero bound ads → EXCLUDE, don't stub) was overridden by hand-feed for Divoom, Playdate, and Pocket Operator — so 3 of 4 analyzed funnels carried zero spend-validation (`validation_lane:["unknown"]`).
- **P15 (did the analyzer see per-brand validation):** no. Validation lanes/strengths were attached at store time by `funnel-score.js`; the analyzer never consumed them, and the architect saw `validation_lane:["unknown"]` on three of the four funnels (GameShell, the one crowdfunding funnel, carried Currency B; the three DTC no-ads funnels were `unknown`).
- **A24 evidence (transformation misclassification):** the classifier ran on `definitions.md` definitions plus its own clustering judgment — no named inputs, no test, no DR bundle. The conditions D2/D3 name as the cause were structurally present; the full post-mortem remains a Job 0/Job 2 input.
- **Null-input run, end to end:** the architect consumed 43 belief records as ground truth with `awareness_entry` null, validation unknown on three of four funnels, `_tally.json` self-flagged unusable (`low_n_warning:true`, 41 of 41 moves "whitespace"), no VOC, and the belief-tagging verdict checkpoint deferred and never completed. No stage refused to run. That fact drives principle P3 below harder than any single bug.

---

## 1.5 — Topology revision R1 (deep-analysis-first; governs the front half)

**The decision (operator, post-PART-3).** The original PART 3 kept the as-ran order — a cheap light pass classifies a space map from dumped copy, then deep funnel analysis runs only on the chosen cell. That is overturned. The operator's reasoning: a space map built on dumped copy is untrustworthy; the signals that make it real — which transformation each funnel actually runs, the angle behind it, **how many ads and how much spend/longevity sit behind each transformation and each angle**, awareness, crowdfunding backing — only exist after the funnels and the ads are actually analyzed. A "medium" intermediate read was rejected as false economy ("it's just as expensive to do a medium funnel and then a deep pass"). So: **one deep analysis pass, run on the full verified roster, before the space map.** Accepted cost risk: run it at full depth, measure against limits, build a cheaper variant only if it actually wrecks them.

This is a system-design (D7 topology) call, fully the operator's to make; it is honored, not relitigated. It ripples into D5 (the quantitative signals it produces are validation currencies) and resolves several earlier worries (A22 thin-map, A24 misclassification, A32 angle-validation-from-ad-counts) more directly than the old order did.

### Corrected front-half map (supersedes the §4.1 map through the NTP pick)

```
STEP 0   Bet Compiler (operator session)                         → bet-brief (structured)

STEP 1   COLLECT  (one command)
         Finder → Slop Checker + Coverage Checker → ★ operator applies flags
         → fetch → clean → Dumper ×brand   (verbatim extraction)
         — find, verify, fetch, extract. NO classification here.

STEP 2   FUNNEL ANALYSIS — the expensive core, runs on the FULL verified roster
         funnel-assemble ×brand (LP+PDP, link-path verified, per A41)
         → Router ×funnel
         → Section Analyzer ×funnel   (belief chain, idea-units, awareness, verbatim)
         → scripts quantify (deterministic, no LLM):
              ads-count + ad-longevity per FUNNEL (packaging already binds ads→funnel)
              → rolled up per transformation and per angle (the funnel carries the angle),
              crowdfunding backing per brand, awareness distribution per cell
         [per-ad angle classification = OPEN ○ — only if within-funnel angle
          distribution is wanted; NOT a committed separate agent]

STEP 3   SPACE MAP = synthesizer over the analyzed-funnel records + the quantitative
         aggregates. INPUT is structured rows, NOT raw copy (the scale point).
         OUTPUT schema is OPEN ○ — not locked here; likely hybrid (tagged cell fields
         + prose basis). Consumed by Market Selection, which also reads the bet brief.

STEP 4   VOC MARKET PASS — per candidate cell the space map surfaces (demand signal)

STEP 5   MARKET SELECTION → ★ OPERATOR NTP PICK

STEP 6   VOC DEEP PASS (winner niche)  +  Awareness Reconciler (cross-funnel + VOC)
STEP 7   FUNNEL ARCHITECT (single agent) → FUNNEL AUDITOR → ★ operator review
STEP 8   COPYWRITER ⇄ COPY CHIEF → ★ operator
STEP 9   ASSET CLASSIFY
STEP 10  MODDED ADVERSARIAL RE-REVIEW
```

### New / changed agents under R1

- **Ad-volume signal — funnel-scoped, mostly script (per-ad classification is OPEN ○, not a committed agent).** "How many ads / how much longevity behind transformation X and angle Y" is computed by counting the ads packaging already bound to each funnel and rolling up by that funnel's transformation/angle — deterministic, no per-ad LLM. This already covers A32 ("small brand, 30 ads, one angle → that angle rips": those 30 ads are one funnel with one angle). The open question (○, for the funnel-step build session): a single landing page can carry ads running *several* angles — if you want that within-funnel split, per-ad angle tagging is added then (cheap, one ad per call). Default is funnel-scope; per-ad is a refinement, not a mandatory stage. (This replaces the standalone "Ad Classifier" R1 first sketched — judged likely redundant with the funnel pass.)
- **Section Analyzer — unchanged job, moved earlier and run on everyone.** Still one funnel per context (belief chain, idea-units per A37, awareness with `awareness_basis`, verbatim spans). Now upstream of the space map, so its awareness read feeds the map (awareness becomes a space-map input, not a post-selection guess).
- **Space Map (was "Space Classifier") — becomes a synthesizer, not a cranker.** It no longer reads every brand's raw copy. It reads the structured per-funnel records + funnel-scoped quantitative rollups and produces the canonical cells with their validation already attached. This dissolves the §6.4 worry about one agent cranking all dumps. **Its output schema is OPEN ○ (likely hybrid — tagged fields + prose basis); not locked here.** Its consumer, Market Selection, reads the space map *plus* the bet brief.
- **Light pass — dissolved.** Finder, Slop/Coverage, Dumper survive as STEP 1 "Collect" (cheap prep, no judgment about the space). Everything the old Space Classifier did moves to STEP 3 and is now fed by real funnel/ad analysis.

### Scale check (the operator's overload worry — answered)

No single agent is overloaded, because the unit of work is bounded and one-per-context throughout:
- A brand running **300 ads** is handled first by **funnel packaging** (ads cluster by destination URL into a few funnels) — correct, that part the operator guessed right. The **deep belief-chain** read is then per **funnel** (a handful per brand), never per-ad, so it is bounded by funnel count, not ad count.
- Ad-volume per transformation/angle is a **script** counting the ads packaging bound to each funnel — 300 ads is one rollup, no LLM. (Only IF the optional per-ad angle split is adopted does it become 300 cheap independent calls — still one ad per context, never one giant window.)
- The **space-map synthesizer** reads compact structured rows (one per funnel, plus aggregate tables), never the raw 40-funnels-of-copy. That is the specific thing that keeps the map agent inside its window.
- Bounded total: deep reads ≈ funnel count across the verified roster (tens, parallel in waves of ≤5 per the 60-tool-use ceiling); cheap reads ≈ ad count (hundreds, parallel). Cost is real but bounded and measurable — which is the test the operator asked for.

### Ripples to confirm in verification (R1 changed the order; these are the seams to recheck)

1. **VOC market pass timing** — it now studies the candidate cells the space map surfaces, so it sits *after* the space map and *before* selection (was: before the map). Confirm nothing downstream assumed VOC-before-map.
2. **Awareness has two moments** — per-funnel awareness produced in STEP 2 (feeds the map); the cross-funnel Awareness Reconciler still runs in STEP 6 (needs the winner + VOC deep bank). Confirm the §6.6 card reads consistently with both.
3. **D5 currency model now consumes STEP 2 outputs directly** — ad-count/spend/longevity per transformation/angle are currencies produced *before* selection, not after. PART 2 Job 4's "consumes Jobs 1+3" gains "consumes STEP 2 quantification."
4. **PART 2 Job ordering** — Jobs 2/3 (determination tests, VOC) still precede the stage builds, but the *stage* that consumes the tests is now the pre-selection Funnel Analysis, not a post-selection deep pass. The roadmap needs a light touch-up to match (flagged, not yet done).

### Contracts R1 adds or remaps (closing the seams the consistency check found)

- **Ad-volume aggregate — named, funnel-scoped (no per-ad agent required).** A deterministic rollup `{transformation, angle, funnel_count, ad_count, max_ad_longevity_days, spend_signal?, crowdfunding_backing?}` computed from the ads packaging already bound to each funnel. IF per-ad angle tagging is later adopted (○), it adds `ad-classified/*.json {ad_id, brand, funnel_id, angle, awareness_cue?}` feeding the same rollup at finer grain. The STEP 3 synthesizer reads the aggregate, not raw rows. Added to §9's seam list. **Space-map output schema itself stays ○ — the synthesizer's emitted contract is decided at the space-map build session, not here.** **⚠ R2 GAP-1:** this aggregate (and every quantification grain in the design) is keyed by the NTP *pair*; the operator also wants niches, transformations, and products quantified **standalone**. The space-map build session must add per-axis standalone rollups, not only pair-keyed cells (§1.6).
- **§5.2 consumption table remap.** Where §5.2 routes `voc-market-signal §2 vocabulary` to "Space Classifier (re-run)," that consumer is now the **STEP 3 Space Map synthesizer**, and the VOC vocabulary feeds the synthesizer's context for naming/clustering cells — it does not re-introduce raw-dump cranking. Read every §5.2 "Space Classifier" row as "STEP 3 synthesizer."
- **§6.6 wording.** The Awareness Reconciler's "placement unchanged" means unchanged *relative to its downstream consumers* (still after VOC deep pass, still feeding the architect); per-funnel awareness itself moved earlier (STEP 2) per this revision.

---

## 1.6 — Reconciliation R2 (bird's-eye job-logic gaps; six open jobs the cards under-specced)

**The decision (operator, post-PART-3).** The operator restated the pipeline as a plain end-to-end data-flow (captured as **PART 0**) and an audit compared it line-by-line against this architecture. The architecture's per-agent cards (§6), topology maps (§1.5/§4.1), and consumption matrix (§5.2) carry the I/O, but six pieces of *job logic* the operator's model assumes were not written down in any doc. They are recorded here as open jobs and routed to their build sessions, each annotating the real section below where the work lands. **R2 adds no new agents and overturns nothing in R1; it marks holes so a build session fills them instead of silently skipping them.** Full step-by-step narrative is PART 0; this is the architecture-internal register.

- **GAP-1 — Standalone quantification of niches / transformations / products (○).** §1.5 STEP 3 + the ad-volume aggregate quantify only the NTP *pair* (keyed transformation×angle); the space-map output schema is open. The operator also wants each axis — niche, transformation, product — quantified **alone**, decoupled from the pairing. Annotates §1.5 (ad-volume aggregate) + §6.4. *Routed: space-map build (Job 7 stage).*
- **GAP-2 — VOC pass 1's full job (○, highest priority — was unflagged).** §5.1 Product 1 specs demand-signal + `gap_candidates[]` (demand-minus-competitor-spend). Three operator-required jobs are missing: **(i)** invalidation / unsatisfied-customer as a first-class lane (today only a "counter-signal flag"); **(ii)** "customers who **already have** the transformation" as a distinct population; **(iii)** the **could-our-product-satisfy** delta (demand current solutions don't fully serve but our product structurally could — a different computation than demand-vs-spend). Annotates §5.1 Product 1 + §5.3. *Routed: VOC build (Job 3).*
- **GAP-3 — VOC pass 2 per-PMBDE-theme frequency counts (○).** §5.1 Product 2 names a "frequency brief" but contracts frequency only for pass 1. The deep pass's job — a count-per-PMBDE-theme table (Pain/Mechanism/Belief/Dream/Experience) for the winner market — is named, not specced. Annotates §5.1 Product 2 + §5.3. *Routed: VOC build (Job 3).*
- **GAP-4 — Funnel architect reading adjacent-market funnels (○).** §6.7's architect input set is a closed list; adjacent-market funnels (operator's "potentially reads other funnels from adjacent markets") aren't in it, so they'd be skipped. Annotates §6.7. *Routed: funnel-architect build (Job 7).*
- **GAP-5 — Language bank as (frequency × phrase + links) (○).** §5.1 Product 2's copy bank is keyed by belief/tier/sub-niche/register, with frequency in a separate brief. The operator wants the bank organized as phrase × frequency per theme, with source links. Annotates §5.1 Product 2. *Routed: VOC build (Job 3).*
- **GAP-6 — No single end-to-end job-logic narrative (resolved).** The docs were organized by decision-ID, agent-card, and build-job; the bird's-eye flow lived nowhere. **PART 0 now carries it**; keep PART 0 and this block in sync on any topology change.

---

## 2. KB re-verifications (PART 1 deferred these to this session)

1. **D2 custody note — CONFIRMED against the full KB.** No passage anywhere in the 65 files requires transformation to be derived from VOC exclusively. The closest law is Mark's "The best raw data is customers' own words, which can then be amplified by AI" (`consumer-psychology--mark-builds-brands.md`) — a quality ranking for copy language, not an evidence-licensing rule for market-level classification. Multiple KB files use competitor claims, competitor-audience review mining, and supply-side observation as legitimate transformation/UM inputs (`differentiator-framework__2_.md` worked cases; `advertorial--mark-builds-brands.md` lists "competitor claims" as a research input). The operator's settle (P5/P20/A31/P2: derivable from competition when inputs and analysis are mechanical) is **consistent with the KB as written**. D2's remaining work is test design only (○ Job 2).
2. **P16 never-merge — NOT IN THE KB.** Exhaustive search: no "never merge" rule and no three-layer authority model exist anywhere in the KB. The architect skill's THREE-LAYER AUTHORITY MODEL (Currency A validates messaging, Currency B validates structure/promise, never merge) is **prompt-local law with no KB provenance**. The nearest KB law is funnel congruency (Carl: ad → page → retargeting must match angle/language), which governs messaging consistency, not evidence merging. The operator's instinct to challenge it (P16) is unobstructed by the KB; whether the rule survives is a D5 session call (○ Job 4). Design consequence in §6.7: the rule stays *configurable*, not hard-coded.
3. **A28 (differentiator conjunction) — KB input located for the Job 2 session.** `differentiator-framework__2_.md` (Hair Dryer failure case) carries the operative law: 5+ competitors on the same mechanism position → a new mechanism **or** a new avatar is required; `angle.md`'s sophistication table frames differentiation requirements by stage. So the KB supports "one sufficient differentiator, requirements escalating with sophistication stage" rather than a fixed mechanism-AND-avatar conjunction. Test content ○ Job 2.

One more KB fact the design uses: **A36's "read the titles and ask whether it deserves its own agent" needs a correction the operator himself supplied mid-session — titles are not reliable scope guides.** Confirmed concretely: the as-ran funnel-architect bundle (5 files) contains **no copywriting file**, yet the architect's output is a copy brief whose belief-install specs lean on belief-change architecture that lives in `copywriting--mark-builds-brands.md` and PMBD material in `copywriting--carl-weische.md`. Knowledge scoping in §7 is therefore indexed by **decision**, not by filename.

---

## 3. Design principles

Nine principles, each traced to its source. These are the compressed form of everything below; if a future revision contradicts one, it should say why.

- **P1 — One decision, one owner.** Already repo doctrine (`CLAUDE.md`), already operator instinct (A39 splits, A43 restraint). Kept. Every agent in §6 owns exactly one decision; every split below exists because two decisions shared an owner.
- **P2 — Judgment in agents, determinism in scripts.** Repo doctrine, kept and extended: *counting, scoring, slicing, verifying, storing, assembling context are scripts; only classify/extract/synthesize/design are agents* (A39's "agent that cleans data is a category error" survives).
- **P3 — Contract-or-refuse.** No agent runs on inputs that fail its preflight. The Arduview run proved the inverse: every stage improvised over nulls and the run "succeeded" into a design built on nothing (§1.1). Every card in §6 names a refuse condition. (A1, A22, the null-input run; A40's hygiene rule is the other half.)
- **P4 — Clean feed, minimum feed.** Every classifier gets the cleanest version of exactly what its decision needs and nothing else (A39 "cleanest version of that data", A40 "prompts should not be given information it doesnt need to know"). Instantiated per seam in §9.
- **P5 — Knowledge scoped by decision, in two forms.** Per A36: theory enters as *disposition* (system-prompt-placed, how-to-think); rules enter as *mechanical tests placed next to the work*. Per A42 + operator's title note: scope is assigned from the KB coverage map (§7.2), never from filenames.
- **P6 — Every interpretive check becomes a named test.** The D3 pattern, architecturally enforced: each classified property gets a test slot (named inputs → procedure → verdict + basis fields). Test *content* is Job 2's (○); the *slots, registry, and enforcement points* are designed here (§7.3).
- **P7 — Language custody chain.** Buyer/competitor language is extracted verbatim, stored attributed, transformed only by retrieval — never reworded in transit. Already enforced at dumper and analyzer (`verbatim_refs`, substring gates) and hard-gated in the VOC spec; §5/§6 extend the chain unbroken from Reddit/review/funnel sources to the copywriter's Command+F check. (A37's structured idea units, A42's verbatim extraction, VOC spec's no-LLM-copy rule, `copywriting--spencer-origins.md` Command+F law.)
- **P8 — No hook-dependent enforcement.** Hooks don't fire in subagents (§1.1). Every validator becomes an orchestrator-run blocking step with a logged receipt; PostToolUse hooks may remain as belt-and-suspenders but nothing may *depend* on them. (A39's distrust, CC-A1.)
- **P9 — Operator decision points are pipeline stages.** NTP pick, belief-tagging verdict, architect review, chief escalations, gap policy: each is a named artifact + explicit sign-off the runner blocks on — never an implicit "the operator will probably look." (A16 "work through them with me", the deferred-and-never-completed verdict checkpoint, P9 of the run.)

---

## 4. Target topology

> ⚠ **SUPERSEDED — reasoning trail only, do not build from.** Build-from order is **§1.5 (R1) / §1.6 (R2)**; this §4 topology is kept for the *why* of the reorder. (The light pass / "Space Classifier reads all dumps" order below is pre-R1; under §1.5 the light pass is dissolved and the Space Classifier becomes the STEP 3 Space Map synthesizer over structured rows.)

### 4.1 The map

```
STEP 0   Bet Compiler ★ (operator session)
         └→ bet-brief.md (STRUCTURED CONTRACT, not prose)        [D4 ○ content]

STEP 1   LIGHT PASS (one command)
         Finder ──→ queries_run[] + brands.json
           ├─ Slop Checker        (keep-bar audit, per brand)    [● A39 split]
           └─ Coverage Checker    (search-space audit)           [● A39 split, ◆ design]
         ★ operator applies flags
         fetch.js (Trends repaired) → clean.js → Dumper ×N → Space Classifier
         └→ space-map.json

STEP 2   VOC MARKET PASS (3a depth, per candidate cell)          [D1; ● A6 "voc pass just for this"]
         Query Planner → scrape/clean (engine per VOC spec) → Bucketer
         → frequency/intensity scripts
         └→ voc-market-signal.json  (+ gap_candidates[] ○ policy reserved)

STEP 3   MARKET SELECTION  (space-map + voc-market-signal + brands)
         gates consume VOC demand currency + community heat       [D5 ○ weights]
         └→ survivors → ★ OPERATOR NTP PICK

STEP 4   VOC DEEP PASS (3b depth, chosen niche only)
         Ladderer → verbatim gate → Language Analyzer
         └→ voc-bank: copy bank + frequency brief + evidence views

STEP 5   FUNNEL DEEP PASS
         funnel-assemble.js (LP+PDP path contract per A41) → Router ×N
         → Section Analyzer ×N (idea-units + awareness evidence)
         → validators → funnel-store → tally → vectorize
         ★ belief-tagging verdict checkpoint (was skipped in run)
         Awareness Reconciler (thin) → awareness-read.json        [◆ §6.6]

STEP 6   FUNNEL ARCHITECT (single agent ● A43)
         consumes: store + tally + awareness-read + voc-bank views + currency model
         └→ design brief → FUNNEL AUDITOR (cold checks ◆) → ★ operator review

STEP 7   COPYWRITER ⇄ COPY CHIEF loop (≤2 rounds, then ★ operator)  [● A35/A34]
         copywriter: brief + slot-scoped RAG (voc-bank + funnel index)
         chief: per-line test battery (§6.9)

STEP 8   ASSET CLASSIFY (validators → orchestrator-run; else unchanged)

STEP 9   MODDED ADVERSARIAL RE-REVIEW (pipeline-audit, extended)   [● A6, Job 9]
```

★ = operator gate (P9). The VOC collection engine (scrape → clean → store, hard verbatim gates) is **one subsystem invoked twice at two depths** — pass-1 breadth for candidates, pass-2/3 depth for the winner. That is the architectural answer to A6's "the VOC needed to feed market selection is likely very different from designing angle ab tests and belief installs": same engine, two products, two consumers, two depths.

> ⚠ **SUPERSEDED — reasoning trail only, do not build from.** Build-from order is **§1.5 (R1) / §1.6 (R2)**; the light-pass framing in this delta list is pre-R1.

### 4.2 What changed vs as-ran (delta list)

**New:** Bet Compiler (Step 0 becomes an agent-assisted session producing a contract, not operator prose); Slop Checker + Coverage Checker (split of Roster Verifier ●); the VOC subsystem wired in at two points (D1); Awareness Reconciler (thin ◆); Funnel Auditor (◆); Copywriter built to spec (D8); Copy Chief (●); operator checkpoints as blocking stages (P9).
**Changed:** Space Classifier and Market Selection re-run on repaired inputs and Job-2 tests (○); funnel packaging contract gains PDP + link-path verification (A41); Section Analyzer's unit becomes the single idea (A37); every DR injection becomes digest-based (§7); all validators orchestrator-run (P8).
**Kept:** Finder, Dumper, Router, the deterministic script spine (fetch/clean/assemble/score/store/tally/vectorize), asset-classify chain, pipeline-audit skill, cheap/quality model split.
**Cut:** winning-angle determination anywhere in the light pass (● A39, §10 of PART 1); COGS/profitability sight anywhere in market selection (● A29/A40/P3); the "auto-injected DR" fiction and all hook-dependent enforcement (P8).

> ⚠ **SUPERSEDED — reasoning trail only, do not build from.** Build-from order is **§1.5 (R1) / §1.6 (R2)**; kept for the *why* of the split decisions (the verdicts themselves are realized in the §6 cards).

### 4.3 The splitting verdict (D7's core question)

The annotations support **named splits at decision seams, not a global micro-agent conversion** — and the as-ran evidence agrees: the run's failures were contract and enforcement failures, almost never "one agent was too big." Verdicts:

- **Roster Verifier → Slop Checker + Coverage Checker — SPLIT ●** (A39 settles it). Two genuinely different decisions: "is each kept brand real" (per-row audit) vs "is the search space covered" (set-level audit). §6.3 supplies the coverage design A39 asked for.
- **Funnel Architect — DO NOT SPLIT ●** (A43 "probably not", honored). The architect's eight reasoning steps share one decision: one congruent funnel design. Splitting creates seams inside a single judgment. Its *checking* burden moves out instead → Auditor.
- **Funnel Auditor after the builder — YES ◆** (A43 asked my opinion). Builder/checker separation is the one split that adds rigor without adding a seam *inside* a decision: the auditor runs mechanical checks (§6.8) the builder is structurally bad at running on itself. Cold context, cheap-to-mid model, no design authority — verdicts and flags only.
- **Awareness analyzer as its own agent — NO for the per-funnel read, YES (thin) for the cross-funnel reconcile ◆** (A43 left it open). Per-funnel awareness is evidence-bound to the funnel copy the Section Analyzer already holds; extracting it would re-feed the same copy to a second agent for one field (violates P4). The *aggregation* across funnels weighted by validation, plus VOC corroboration (P14, A43), is a separate small decision → §6.6.
- **Line-reader (P17, "not saying we should") — ABSORBED into the Copy Chief ◆.** The chief's greased-slide check *is* the line-reader: per-line, cheap-model, "do I want to read the next line." A standalone agent would duplicate the chief's loop plumbing for one of its five tests. If the operator wants it standalone later, the chief's test battery is designed so tests are detachable (§6.9).
- **Copy Chief — NEW AGENT ●** (A35 settles its existence; A34 settles the loop topology).
- **Global "one agent per DR file" conversion (A36) — DEFERRED, by the operator's own signal.** A36 itself defers the mega-build behind a VOC MVP, and A15/PART 2 ordered VOC first. The knowledge architecture in §7 is designed so the granular conversion remains *available* (digests are per-decision; a decision can always be promoted to an agent) without being prerequisite. The titles-aren't-scope correction (§2) further weakens file-per-agent as a partition rule.

---

## 5. The VOC subsystem (D1 — the integration architecture)

The half-built spec (`handoff-step3-voc-build.md`) already designed the **collection engine** well: Reddit-first, 3-pass, one job per agent (Query Planner / Bucketer / Ladderer / Language Analyzer), hard verbatim grounding (agents return offsets, scripts slice and string-verify, no LLM-generated copy ever), unique-user frequency, user×theme co-occurrence. **Nothing below re-designs collection.** What was explicitly outside the spec's scope line — what the products are, who consumes them, under what contracts — is exactly what A6/A12/A37/P21 demand and what this section supplies.

### 5.1 Two products, not one feed (● A6; axes from A15)

**Product 1 — `voc-market-signal` (strategy grade; pass-1/3a depth; per candidate niche×transformation cell).** A15's three study axes become its three sections:

1. **Transformation signal** — does this niche articulate wanting this transformation: unique-raiser counts for desire/frustration/purchase-intent themes, intensity scores, counter-signal flags. A11's mechanical form lands here verbatim as the contract: *count of independent raisers relative to corpus size* — `{theme, unique_raisers, corpus_users, ratio, intensity, exemplar_permalinks[]}`. Thresholds ○ Job 2/4.
2. **Category language map** — how they talk about the transformation category: vocabulary, named competitors/products (feeds Coverage Checker §6.3), price utterances (feeds price-conditioning read), mechanism-belief utterances (feeds believability-by-niche, A37).
3. **Niche identity baseline** — shared values/beliefs/PMBDEs regardless of transformation: the sub-niche map (5+ co-occurrence rule from `definitions.md`), in-group markers, venue census (the venue test's evidence base — A8/A14).

Plus **`gap_candidates[]`** — themes with high frequency/intensity in VOC but no validated competitor spend (cross-referenced against `space-map.json` mechanisms/claims). Each row carries both signals side by side: `{theme, voc_strength, competitor_validation: none|weak|strong, exemplars}`. **The whitespace-vs-scary policy — whether such a gap is opportunity or warning — is the operator's reserved marketing call (● A6), routed to the Job 3 session. The design's only commitment: the pipeline must *surface* gaps with evidence on both sides, and must not auto-treat either side as a verdict** (○).

**⚠ R2 GAP-2 — VOC pass 1's job needs three additions (○, Job 3; highest priority — this hole was previously unflagged).** As written, Product 1 measures demand and surfaces demand-minus-competitor-spend gaps. The operator's model also requires: **(i) an invalidation / unsatisfied-customer lane** — actively find disconfirming signal and customers current solutions fail, not just a `counter_signal_flag`; **(ii) a "customers who already have the transformation" population** — distinct from those who articulate wanting it, and nowhere modeled today; **(iii) a could-our-product-satisfy delta** — for a transformation validated by spend *and* VOC, what is wanted that current solutions don't fully serve **but our product structurally could** (joins to the bet-brief's `what_hardware_enables`, P10). This is a different computation than `gap_candidates[]` and must be its own contract. See §1.6.

**Product 2 — `voc-bank` (language grade; pass-2/3 depth; chosen cell only).** The spec's copy bank + frequency brief, extended with two consumer-facing views:

- **Belief/angle evidence view** (architect): per belief-surface and PMBD tier — what buyers already believe, objections in their words, identity callouts, transformation language. Drives belief-chain design on buyer language instead of asserted transformation (the run's headline absence).
- **Awareness evidence view** (reconciler §6.6): articulations binned by what the speaker demonstrably knows (problem/solution/product vocabulary use) → corroborates or contradicts funnel-derived awareness (A43 "for forum marketing i think awareness level can be derived from VOC").
- **Copy bank** (copywriter, via slot-scoped RAG): retrievable by belief_id / PMBD tier / sub-niche / register, verbatim with attribution, per the spec's storage record.

**⚠ R2 GAP-3 — per-PMBDE-theme frequency counts (○, Job 3).** The "frequency brief" is named here but frequency is contracted only for pass-1 (`{theme, unique_raisers, ratio, intensity}`). The operator's pass-2 job is an explicit **count-per-PMBDE-theme table** (Pain / Mechanism / Belief / Dream / Experience) for the winner market. The VOC build session must contract that table, not inherit the pass-1 shape by default. See §1.6.

**⚠ R2 GAP-5 — language bank as (frequency × phrase + links) (○, Job 3).** The copy bank above is keyed by belief/tier/sub-niche/register, with frequency held in the separate frequency brief. The operator wants a bank organized as **phrase × frequency per quantified theme, carrying source permalinks**. Decide whether the bank carries per-phrase frequency weight directly or joins to the frequency brief at retrieval. See §1.6.

### 5.2 Consumption contracts (who reads what — the wiring A6/A12 asked for)

| Consumer | VOC product · section | What it licenses there |
|---|---|---|
| Market Selection Gate 1 | market-signal §1 | Demand-side currency alongside supply-side (A26 "fed by demand side as another currency"); community heat as **independent axis** (● A40, P4) |
| Market Selection gap analysis | gap_candidates[] | Surfaces whitespace-vs-scary rows for the operator (○ policy) |
| Coverage Checker | market-signal §2 | VOC-named brands the Finder missed |
| Space Classifier (re-run) | market-signal §2 | Niche vocabulary for clustering; believability-by-niche evidence (A37) ○ test content |
| Awareness Reconciler | voc-bank awareness view | Corroboration lane (P14, A43) |
| Funnel Architect | voc-bank belief/angle view | Belief chain grounded in buyer language; objection set in buyer words |
| Copywriter | voc-bank copy bank | Slot-scoped verbatim RAG (spec's "retrievable by slot", now contracted per brief section) |
| Copy Chief | voc-bank copy bank | Register check: Command+F that copy vocabulary exists in buyer language (P7) |
| Validation-currency model (D5) | market-signal §1 | VOC as a priced currency lane (○ Job 4 prices it) |

**Sequencing honored:** A15 ("VOC has to be at least drafted, but id say built") and A36 ("get a VOC system MVP down first") put the collection-engine build ahead of the KB mega-mechanization; PART 2 Job 3 already ordered this. This design adds: build pass-1 first (market-signal is the MVP — it unblocks market selection, the most upstream consumer), pass-2/3 second.

**Re-review hook (● A6 end):** once the Job 3 session fixes the contracts above, the integration design goes through the modded adversarial review — §10/Job 9 carries the slot.

### 5.3 What stays open (○, for the Jobs 2/3 co-design session per A37)

Exact field schemas per product section; thresholds (what ratio/intensity clears a gate); the whitespace-vs-scary policy; which VOC inputs are *captured* per theme (A37's "which inputs to capture in VOC" — the session bakes them into market-selection and architect frameworks together, per the operator's one-full-session demand); how the Query Planner handles venue-less niches (the spec flags it open). **Plus the three R2 VOC gaps (§1.6): GAP-2** pass-1's invalidation lane + "already-have-the-transformation" population + could-our-product-satisfy delta; **GAP-3** pass-2's per-PMBDE-theme frequency-count table; **GAP-5** the copy bank's frequency×phrase organization. GAP-2 is the priority — it was unflagged before this pass.

---

## 6. Per-agent design cards

Format per card: **Decision** (the one thing it owns) · **Inputs** (and refuse condition, P3) · **Outputs** · **Knowledge** (disposition / tests / reference, per §7) · **Model** · **Validator** (orchestrator-run, P8). Unchanged stages (Dumper, Router, asset chain) get deltas only.

### 6.0 Marketing-soundness duties per card (applies to every card below)

Every card below inherits the **Marketing-Soundness Standard** (`SPEC-marketing-soundness.md`): each agent that makes a load-bearing marketing judgment emits the grounding contract `{verdict, grounding_ref, grounding_quote, application}` and a `carried_risks[]` list, runs its checks as `PASS | FAIL | CANNOT-EVALUATE`, and emits counted/scored values as `{value, n, low_n}`. The build session writes these in per the **[SKILL-BUILDER]** steps in `BUILDER-DIRECTIVE.md`; the final system pass wires `carried_risks[]` propagation per the **[SYSTEM-BUILDER]** steps. The specific duties:

| Agent (card) | Grounds (cite Register/DR-law) | Carries as risk |
|---|---|---|
| Bet Compiler (§6.1) | bet_type, N/T/P similarity, functional-mech equivalence | UNGROUNDED bet calls; blank operator inputs |
| Slop / Coverage (§6.3) | — (search is not a load-bearing marketing judgment) | blank/unknown coverage inputs |
| Space Classifier / synthesizer (§6.4) | transformation, claim-type, mechanism-vs-feature, sophistication, niche | UNGROUNDED classifications; blank inputs; low-n cells |
| Market Selection (§6.5) | gate verdicts per currency; **MR-006** transformation-validation carry | unvalidated-transformation status into the NTP-pick artifact; blank/unknown `demand_trend`; low-n; `CANNOT-EVALUATE` on absent currency |
| Awareness Reconciler (§6.6) | awareness read (evidence rule) | funnel↔VOC conflicts; thin-evidence (low-n); blank awareness |
| Section Analyzer (§6.7) | idea-unit / awareness classification (`awareness_basis`) | missing `awareness_basis`; unknown validation lane |
| Funnel Architect (§6.7) | belief-chain / offer / angle (Register **MR-001** never-merge policy, DR-law) | UNGROUNDED fill (proven-vs-reputational); blank inputs; never-merge status |
| Funnel Auditor (§6.8) | runs the architect's tests as checks | `CANNOT-EVALUATE` where test content is ○ (e.g. congruency) — never reports PASS on an empty test |
| Copywriter (§6.9) | copy grounded in voc-bank + blocked-ports (**MR-005**) | RAG-empty sections |
| Copy Chief (§6.9) | per-line test battery | register/Command+F = `CANNOT-EVALUATE` when voc-bank is absent (carried, not PASS) |

### 6.1 Bet Compiler — NEW (Step 0; operator-in-loop session) [D4 shell; ○ content = Job 1]

- **Decision:** none of its own — it *compiles the operator's bet* into a structured contract and challenges incompleteness. The operator decides; the agent interrogates and structures (A38 "what is a bet? needs to be clearly defined"; A20 "we need to discuss bets somewhere").
- **Inputs:** operator conversation; prior run retrospectives; KB digest (case-studies, differentiator-framework, market-evaluation-criteria, product-research).
- **Output — `bet-brief.md` with a machine-checkable block** (the as-ran brief was prose; A39 traced run quality straight back to it). Contract fields the Job 1 session finalizes (○): bet statement; `bet_type` + basis; the open-transformation slot clarified (A39 flagged "open transformation, idk what that means"); N/T/P similarity controls **as three separate criteria sets** (● P8 "evaluated separately, with their own criteria"); functional-mechanism-equivalence definition for bet-evidence transfer (P19 — the fidget-spinner/transparent-screen logic stated as a testable comparison: *does the physically-different feature do the same believable job for the same transformation*); comparable-bet seeds each with fit-verification fields (A23 "how do we verify whether another company fits the bet"); structural-deliverability basis (P10); territories; LP-hunt terms; claim-typing examples; deferred reads/overrides.
- **Why a stage and not a doc:** every downstream query, cell, and transfer-control inherits it (A39); making it an agent-assisted session with a contract output is what makes "query generation traces to brief quality" *testable* rather than suspected.
- **Model:** quality, conversational. **Validator:** structural completeness of the contract block.

### 6.2 Finder — KEPT, two contract changes

- Emits **`queries_run[]`** (lane, query, territory/seed it derives from, hit count) so coverage becomes auditable (new field; consumed by §6.3). Refuse condition: bet-brief contract block missing/invalid.
- Query generation stays derived from territories + comparable-bet seeds (as-ran behavior, now an explicit contract: every query must name its source field in the brief). ◆ small call: keep 12+ queries/lane floor until Job 1 revisits.

### 6.3 Slop Checker + Coverage Checker — SPLIT of Roster Verifier (● A39) [◆ coverage design]

- **Slop Checker.** Decision: per kept brand, does it clear the keep bar (real product, live URL, plausible competitor/bet-fit). Inputs: `brands.json` row + brief. Output: `slop_flags[]` with recommend drop/keep-bench. Cheap model, web-check allowed. Unchanged in substance from the as-ran SLOP half.
- **Coverage Checker.** A39: "i dont know how to design the checker whether or not brands are missing." ◆ Design: audit the **search space**, not the roster. Inputs: `queries_run[]`, brief territories + seeds, `voc-market-signal` §2 named competitors (when present), marketplace category bestseller sweeps. Mechanical sub-checks: (1) every territory × lane has ≥N executed queries with logged hits; (2) every seed brand resolved or explicitly dropped-with-reason; (3) every VOC-named brand/product present in roster or in `dropped[]`; (4) marketplace bestseller intersection — top-K category listings not in roster get flagged. Output: `missing_brands[]` + `coverage_gaps[]` (territory/lane holes). The agent judges only ambiguous cases; checks 1–2 are pure script. This converts "are brands missing?" from vibes into four named evidence streams — which is the D3 pattern applied to the checker itself.
- **Both run before fetch spend** (as-ran ordering kept); operator applies flags (P9 gate).

### 6.4 Dumper + Space Classifier — KEPT / REVISED

> ⚠ **Read §1.5 (R1) first.** The "light-pass judgment / reads-all-dumps" framing below is pre-R1: under §1.5 the light pass is dissolved and the Space Classifier is the STEP 3 Space Map synthesizer over *structured rows*, not the raw-dump cranker. The card's contract changes (D3 test slots, per-property `basis`, winning-angle-out-of-scope) are current.

- **Dumper:** unchanged (verbatim discipline already enforced and validated; P7 anchor). Refuse: missing clean corpus.
- **Space Classifier:** same single owner of light-pass judgment, three changes. (1) Every classification it makes — transformation clustering, claim typing, niche/angle/bet_type clustering, sophistication — runs through the D3 test slots once Job 2 writes them (○); until then it carries the run's known failure as a warning label (A24's `novelty-object-own` rolled three unlike outcome-promises into one label). (2) Consumes `voc-market-signal` §2 vocabulary when present (re-run case). (3) Emits per-property `basis` fields universally (claim-quoted evidence per call — extends the existing `bet_type_basis` pattern to every judgment). **Winning-angle determination is out of scope** (● A39): `angles[]` remains observed vocabulary; no winner call anywhere in the light pass.
- **Refuse:** dumps missing for listed brands; brief contract invalid.

### 6.5 Market Selection — REVISED

- **Decision:** rank surviving cells under the gate order, consuming both supply-side and demand-side currencies. Stops at ranked PROVISIONAL survivors (kept; D1-human discipline).
- **Input changes:** `voc-market-signal` §1 wired into Gate 1 as the demand-side currency (A26) and community heat as its own axis, not derived from low competitor spend (● A40/P4); repaired `demand_trend` (the Trends fix is implementation, already root-caused §1.1); lifted ad-longevity (`qualifying_creatives` fed from raw ads). **COGS and profitability nowhere in its inputs** (● A29/A40): price-conditioning read only — "what price is conditioned into this market for similar product categories selling the same transformation to the same niche"; the operator alone decides profitability.
- **Gate semantics** (what "proven demand" means per currency, thresholds, revenue's weight P7, the never-merge question P16) — ○ Jobs 2/4. The card only fixes the I/O: gates read named currencies from named fields; every verdict carries its evidence row.
- **Refuse:** `demand_trend` shape unknown above tolerance, or `voc-market-signal` absent **when the run declares VOC active** (soft-gate mode stays available as an explicit operator override, never a silent default — the D-08 lesson).
- **Knowledge:** market-evaluation-criteria + demand/durability digests (ecommerce--mark, consumer-psychology--spencer, product-research--spencer), pricing digest. The as-ran 5-file bundle shrinks to decision-indexed digests (§7).

### 6.6 Awareness Reconciler — NEW, thin ◆ (D6 topology; evidence rule ○ Job 3/2)

- **Decision:** the run-level awareness read the architect consumes: reconcile per-funnel `awareness_entry` (produced in deep pass ● A3/A4 — placement unchanged) across funnels **weighted by validation strength** (P14: never assume all crowdfunders share one level; verify by other validated brands' funnels, aggregated) **against the VOC awareness view** (A43's "maybe should come from VOC. i dont know" becomes: both, reconciled, disagreement surfaced).
- **Shape:** aggregation arithmetic = script; the agent only adjudicates conflicts and emits `awareness-read.json {entry_distribution, recommended_entry, basis[], conflicts[]}`. Cheap-to-mid model. If the operator vetoes the agent half, the script half still replaces today's null field.
- **Refuse:** stored funnels with null `awareness_entry` (P15-A1 made this the run's reality — the store fix is implementation).

### 6.7 Funnel Deep Pass (Router + Section Analyzer) — REVISED; Funnel Architect — REVISED, NOT SPLIT (●)

> ⚠ **Read §1.5 / §1.6 first.** This is a current card; only the "input set currently closed" framing is pre-R1 — **R2 GAP-4** (flagged inline below) reopens it to optional adjacent-market funnels.

- **Packaging contract (A41):** one funnel = ad → LP → PDP, link-path verified, same brand (`funnel-assemble.js` extends: follow CTA links LP→PDP, verify same-brand, emit `path_verified` + `pdp_body`). ◆ The D-05 no-ads guard stays, and overriding it becomes a logged operator decision on the package (`validation_override{by, reason}` field contract), never a silent hand-feed (P3/P9).
- **Router:** unchanged decision; enum stays closed.
- **Section Analyzer:** unit of analysis becomes the **single distinct idea** (A37: "classify each, distinct and single idea one by one... that is huge ammo"): each record = one idea, classified (belief install / identity callout / proof / urgency / …), with execution detail and verbatim span. The 9-anchor open-with-anchors taxonomy stays; the ontology of what an idea can be is ○ Job 2 (A37's "predefined things of what a piece of copy can be"). Awareness stays produced here (● A3/A4 — placement only) and ◆ gains a required `awareness_basis` evidence-field contract (no value without evidence; *which* evidence sources count, and their precedence, stay ○ with D6's open evidence rule). Per-funnel validation lane/strength enters its *inputs* (P15 gap closed: the analyzer should know what's validated while reading). Belief_kind / source-layer fields: schema decision rides Job 5; the §1.1 ghost-field mess is the cautionary tale.
- **A42's advice request, answered ◆:** verbatim extraction is not too much for the architect *if the architect never receives it wholesale*. Custody design: analyzer stores idea-units with verbatim spans (full granularity, nothing lossy); the architect consumes the **structured roll-up** (idea units, claims, tally, awareness-read) and pulls verbatim **on demand, slot-scoped, via the existing RAG index** when designing a specific install; the copywriter receives verbatim only for its brief's sections. Granularity preserved at rest, bandwidth controlled in flight. This is also the D7 filing of A37 (structured single-idea data as "ammo for writing a funnel").
- **Funnel Architect:** single agent (● A43 "probably not" honored). Input set completed per A43's #1 worry ("make sure this thing has tapped inputs"): store (6a fields populated once the §1.1 store bug is fixed — implementation), `_tally.json` (with a low-N refuse condition now — the run's tally was self-flagged unusable and consumed anyway), `awareness-read.json`, voc-bank belief/angle view, currency model outputs (○ D5), operator run context. **⚠ R2 GAP-4 (○, Job 7):** this input set is currently closed; the operator wants the architect to *optionally read funnels from **adjacent markets*** for design inspiration. The funnel-architect build session must decide whether adjacent-market funnels are an input and how they're selected/scoped — otherwise they are silently skipped (§1.6). **The three-layer authority model / never-merge rule becomes a declared, configurable policy input** — not hard-coded prompt law — because §2 found it has no KB basis and P16 challenges it; the D5 session decides its fate and the architect consumes whatever policy that session writes (○). Crowdfunding/DTC handling likewise consumes D5's unification (A43's deposit-funnel point ○ Job 4). Conversational operator review stays (P9).
- **Refuse (architect):** null awareness-read; tally `low_n_warning` without operator override; missing voc-bank when run declares VOC active; missing currency policy.

### 6.8 Funnel Auditor — NEW ◆ (recommended yes to A43's direct question)

- **Decision:** none over design — verdicts only. Cold-context checker between architect and operator review (mirrors the repo's proven pipeline-audit pattern at design time).
- **Test battery (mechanical where possible):** congruency checks per seam — one angle, one transformation, every section's belief install consistent with the chain (the *test content* for "is this congruent" is ○ Job 2 per A33; the auditor is its enforcement point); belief-chain coverage vs awareness-read (no skipped belief for the entry level); claim legality vs blocked ports + claim-typing; dead-ground avoidance vs tally; input receipts (did the brief actually consume the inputs it cites — the run's null-input lesson made checkable); whitespace-use justification present where the brief leans on unvalidated moves.
- **Output:** pass/flag list with evidence rows → operator review (P9). Mid model, no Read access to anything but the brief + locked inputs (cold).

### 6.9 Copywriter + Copy Chief — BUILD (D8; gates per PART 1 honored)

- **Copywriter:** built to `15-SPEC-copywriter.md` as the behavior authority (admitted spec): constrained writer, brief's angle beats RAG's angle, blocked ports absolute, locked format rules, grade 6–7 target, greased-slide craft, "steal frameworks, not words." Inputs: architect brief (locked) + slot-scoped RAG from voc-bank copy bank and funnel index (`funnel-rag-query.js` extended for source routing per brief section — the spec's OPERATOR VERIFICATION MANDATE already requires exactly this). Refuse: missing brief section fields; RAG-empty sections get written conservative + flagged (spec behavior, kept).
- **Copy Chief — separate agent, loop topology ● (A35, A34):** reads the draft **per line** and runs five detachable tests:
  1. **Does-something test** — every line either advances its section's assigned belief or earns its place; lines that do nothing are flagged (A35 "tests whether or not each line does something").
  2. **Believability test** — does the line *install* its belief or merely assert it (A35's "i will ship this by aug 30" failure case; P13's feature-as-believed-mechanism logic is one of its rules ○ Job 2 content).
  3. **Greased-slide next-thought test** — chief-as-dumb-consumer predicts the most likely next thought after each line; prediction routed back to the copywriter with the line (A34's loop, verbatim); P17's line-reader lives here.
  4. **Readability gate** — mechanical: grade-level score (script) + per-line "telepathic comprehension" call (A35).
  5. **Register check** — script-assisted Command+F: flag copy vocabulary absent from the voc-bank/run corpus (P7; `copywriting--spencer-origins.md` law).
- **Loop contract:** chief emits per-line verdicts `{line, test, verdict, predicted_next_thought?, evidence}`; copywriter revises; **≤2 rounds then operator** (unbounded agent loops burn context and converge on mush — the bound is a P9 gate, vetoable constant).
- **Models:** copywriter quality; chief cheap-to-mid (its tests are narrow by design — that's what makes a per-line battery affordable).
- **Gates honored (PART 1 §9):** architect output real, voc-bank exists, Job-2 test patterns exist. Build order unchanged from PART 2 Job 8.

### 6.10 Asset chain + pipeline-audit — KEPT

No annotations cut against them; asset-classify already embodies P2/P4 (bytes never in context, script-assembled inputs, closed vocab). One delta: validators become orchestrator-run steps with receipts (P8), matching everything else. Pipeline-audit gains the Job 9 extension (§10).

---

## 7. Knowledge architecture — the spec the mechanization coding pass implements

This is the design A36 asked for and the handoff ordered this session to produce: *for each agent, what knowledge it needs, and which currently-interpretive checks become mechanical.* The coding pass renders it; the Job 2 session supplies test content; the operator signs off the marketing substance (custody).

### 7.1 Three layers per agent (A36's theory/rules split, made structural)

1. **Disposition layer** — theory as how-to-think, short, system-prompt-positioned. Curated digest, not whole files (the as-ran bundles concatenated entire KB files — 745–1800 lines of mixed-relevance prose per agent; A42's exact worry: "given DR info it doesnt need, or omitted DR info it DOES need, or... too much up to interpretation").
2. **Test layer** — rules rendered as mechanical tests *placed next to the work*: named inputs → procedure → verdict + required basis fields + worked examples (A16's "with output examples so we can go down the list"). Enforced twice: in-prompt as a checklist the agent must fill per item, and post-hoc by the stage validator wherever string/enum/count-checkable.
3. **Reference layer** — `definitions.md` terms + closed enums. Revision shape per P18/P12: **every definition gains a `TEST:` pointer into the test registry** (a definition without a determination procedure is exactly the "definition + vibes" failure A21/P1 name; P12's "do the agents have the definitions for product and product category" becomes checkable: the registry indexes which agent receives which definition+test).

### 7.2 Per-agent scoping table (decision-indexed; titles are not scope — §2)

The KB inventory mapped every file to the decisions it actually carries. Allocation below is by decision; the mechanization pass extracts the named material into per-agent digests with provenance pointers back to source files (so the operator can audit any digest line against the KB — custody requirement).

| Agent | Tests consumed (registry §7.3) | Disposition digest drawn from (content, not whole files) | Deliberately excluded |
|---|---|---|---|
| Bet Compiler | bet-fit, NTP-similarity, functional-mech-equivalence, structural-deliverability | case-studies--spencer (desire-first worked cases), differentiator-framework (lever logic), market-evaluation-criteria (solving order), product-research--spencer | copy/funnel craft |
| Finder / Slop / Coverage | keep-bar, coverage sub-checks | none beyond brief + enums (search is not a DR decision) | all theory |
| Dumper | verbatim gate (existing) | none | everything |
| Space Classifier | transformation test (D2 ○), niche venue/reading test, claim-typing, mechanism-vs-feature + believability gate, trend/durability inputs, sophistication staging | angle.md (lever + sophistication frames), differentiator-framework (worked classifications), consumer-psychology--carl (sophistication/awareness frames) | funnel/copy craft, offer law |
| Market Selection | demand currencies, durability, saturation/sophistication, price-conditioning read | market-evaluation-criteria, ecommerce--mark (channel-existing-demand law), consumer-psychology--spencer (permanent vs trending desire), pricing--mark | COGS anywhere (●), copy craft |
| VOC Bucketer/Ladderer/Language Analyzer | codebook (PMBD×tier, belief surfaces, 5+ rule — already specced) | definitions.md PMBD cluster only | all supply-side law |
| Router | routing enum test (existing) | none | everything |
| Section Analyzer | idea-unit ontology (○ Job 2), belief-id anchors, execution typing, proof tiers, awareness evidence rule (○), verbatim gate | belief-change architecture (copywriting--mark §4-docs), consumer-psychology--carl (awareness/desire frames), funnel-architecture--carl (section roles) | offer pricing, ad-production volume law |
| Awareness Reconciler | awareness evidence + aggregation rule (○ Job 2/3) | Schwartz five-levels digest (consumer-psychology--carl; advertising--hormozi §awareness extract) | the rest of hormozi advertising (off-target B2B bulk) |
| Funnel Architect | congruency-per-seam test (○ A33), belief-chain coverage vs awareness, offer-construction rules, evidence-policy (D5 output ○) | funnel-architecture--carl/--mark/--spencer (structure law), **copywriting--mark belief-install + necessary-beliefs material (the §2 title-correction case)**, **copywriting--carl PMBD framework**, angle.md, offer-construction--carl + value-equation--mark, quiz/advertorial/vssl files *when the structural shape calls for them* (conditional digest) | sales-call law (persuasion--hormozi), email/retention |
| Funnel Auditor | the architect's test battery, run as checks (no theory needed — that's the point) | none (cold) | everything |
| Copywriter | locked format rules (spec), greased-slide, readability, register/Command+F, blocked ports | copywriting--spencer + --carl (primary craft), copywriting--mark (body structure) — the spec's three-file choice confirmed; hooks--spencer (open-loop law) added for line craft ◆ | hormozi copywriting (spec's own exclusion, confirmed off-target) |
| Copy Chief | the five-test battery (§6.9) | minimal craft digest (greased-slide + believability frames) — a checker, not a writer | strategy law (it must not re-architect) |
| Asset agents | claim-list + vocab (existing) | none | everything |

Two cross-cutting allocation rules: **(1) conditional digests** — structure-specific law (advertorial/VSSL/quiz) loads only when the architect's chosen shape needs it (P4 against 2600-line always-on bundles); **(2) dedupe at digest level** (A36's dedupe demand) — one canonical statement per law in the registry; agent digests *reference* it; no law lives in two prompts in two phrasings (today's congruency law exists in at least three wordings across skills).

### 7.3 The test registry (D3's architectural half)

One registry file per classified property: `transformation`, `niche` (venue + reading + in/exclusion A9), `mechanism-vs-feature` (+ believability gate parameterized by niche, A37), `claim-type`, `trend/durability`, `proven-demand` (per currency), `sophistication`, `awareness` (evidence + aggregation), `congruency` (per seam), `angle`, `idea-unit/belief`, `bet-fit` (+ NTP similarity + functional-mech equivalence), `venue`, plus chief-side `line-does-something`, `believability-install`, `readability`, `register`. Each entry: named inputs (exact fields) → procedure → verdict enum → required basis fields → worked examples → owning agent(s) → enforcing validator. **Content ○ Job 2 with the operator** (marketing truth); the registry format, slots, owners, and enforcement points are fixed here so the session fills holes instead of inventing structure.

### 7.4 Generation + custody workflow (the coding pass itself, specced)

1. Coding pass builds digests + registry from the KB per §7.2, every line carrying a `src:` pointer (file + section).
2. **Operator sign-off gate on every digest** (P9; custody: a digest is a marketing-truth artifact — I design the pipeline, the operator owns the law). Diffs re-reviewed on KB change.
3. Injection stays deterministic and *verified*: assembler script per agent (the `funnel-analyzer-context.js` pattern generalized), byte-embedded by the orchestrator, **filename contract fixed** (§1.1's mismatch), receipt logged per spawn (which digest version, which corpus bytes).
4. `definitions.md` revision lands with the registry (P18's "revise definitions md to get rid of that test" handled as: tests live in the registry, definitions point at them — deletion/amendment happens in one place).

---

## 8. Orchestration design (A39's questions, answered as design)

**The direct answers first.** *"Is the orchestrator literally just running all the agent prompts itself?"* — yes, that is what ran, and this design **keeps Claude-as-orchestrator but de-trusts it**: determinism comes from scripts, validators, receipts, and refuse-gates around every agent call, not from hoping the orchestrator behaves. *"Is there anyway to reinforce this as a workflow that deterministically runs... like a series of claude p calls with scripts in between?"* — yes: every step below is either a script (runs deterministically) or an agent spawn whose input is script-assembled and whose output is script-validated before anything consumes it; the orchestrator's only degrees of freedom are retry/escalate. *"I would like to run just one command"* — `run <step> --space=<s>`:

1. **Preflight** (script): input contracts checked (P3) — schema, non-null load-bearing fields, version stamps; missing → named refusal, never improvisation.
2. **Plan print** (script): the step's DAG — every script command and agent spawn, declared before anything runs. The orchestrator executes the printed plan; deviation is visible by diffing receipts against the plan.
3. **Context assembly** (script per agent): digest + corpus bytes embedded; agent never Reads shared state (P15-A3's bypass becomes structurally pointless: there is no file to Read).
4. **Spawn** (agent): waves of ≤5 with incremental writes (retro's 60–65-tool-use death is a platform fact the runner respects).
5. **Validate** (script, blocking, orchestrator-run — P8): per-stage validator gates the store; reject → bounded re-spawn (≤2) → escalate to operator (P9).
6. **Store + receipt** (script): no-overwrite versioning (kept from CLAUDE.md doctrine); receipt = inputs hash, digest version, validator verdicts, the run ledger entry.
7. **Operator gates** (P9): NTP pick, belief-tagging verdict, architect review, chief escalation, gap policy — runner blocks on a sign-off artifact; "deferred" is a logged state, not a silent skip (the run's never-completed verdict checkpoint is the lesson).

Cheap-model cleanliness QA (A39's "lots of cheap models to make sure everything is clean") slots in as optional per-corpus checks where regex cleaners are known-weak (hashed React class names, P03-A3) ◆. PostToolUse hooks may stay as redundancy; nothing depends on them (P8).

---

## 9. Contract-spine implications (slots Job 5 fills; this section creates no contracts)

New/changed seams the topology creates, for the spine session to spec after Jobs 1–4 land: `bet-brief` contract block (§6.1); `queries_run[]` (§6.2); coverage outputs (§6.3); `voc-market-signal` + `gap_candidates[]` + `voc-bank` views (§5); per-property `basis` fields on the space-map; funnel package + `pdp_body` + `path_verified` + logged `validation_override` (A41/A40); idea-unit records + `awareness_basis`; `awareness-read.json`; architect brief ↔ auditor verdicts; chief line-verdicts; per-seam application of the **information-hygiene rule (● A40): each contract names not just what flows but what is withheld** — the withheld list is part of the seam definition. The spine session also resolves the §1.1 ghost-field cleanups (belief_kind vs source-layer) rather than inheriting them silently.

---

## 10. What this design does NOT decide (routed ○ slots)

Marketing truth and thresholds, all reserved: the whitespace-vs-scary policy (A6 — Job 3, with the operator); all test *content* in the registry (Job 2, co-designed with Job 3 per A37's one-full-session demand); the transformation test itself (D2 direction settled ●, design ○); every numeric threshold (A11 ratios, anti-fluke floors, currency weights, revenue's weight P7); the currency model — enumeration seeded by A32, crowdfunding/DTC unification, deposit-funnel standing, trust-skew (P22), never-merge's fate (P16 — with §2's finding that the KB does not protect it); awareness evidence precedence when funnel-derived and VOC-derived reads conflict (the reconciler surfaces, the rule decides ○); the idea-unit ontology (A37); claim-typing taxonomy (KB gap confirmed — the registry has the slot); and the **six R2 bird's-eye job-logic gaps (§1.6 / PART 0):** standalone niche/transformation/product quantification (GAP-1), VOC pass-1's invalidation + already-have-transformation + could-our-product-satisfy delta (GAP-2), pass-2 per-PMBDE frequency counts (GAP-3), architect adjacent-market funnels (GAP-4), the frequency×phrase language bank (GAP-5). Where any of these touch the KB, the relevant passages are already extracted and cited in the inventory for the session to use.

**Job 9 / re-review slot (● A6):** pipeline-audit extends to the VOC seams and the integration design itself — modded reviewers, evidence manifest grown to the new artifacts. Runs after the Job 3 contracts exist; runs again end-to-end after Job 7 stage revisions (PART 2's reconciliation, unchanged).

---

## 11. How PART 2's jobs consume this document

| PART 2 job | What it takes from here |
|---|---|
| Job 0 | §1.1 findings close most diagnostics (A22/P9 root causes, A39 orchestration map, A41 packaging answer, P15 answer); remaining: A24 full post-mortem |
| Job 1 (D4) | §6.1 bet-brief contract shell + Coverage Checker dependency; fills ○ content |
| Job 2 (D2+D3) | §7.3 registry slots + §7.1 enforcement architecture + §2 KB citations (V1, A28); fills test content |
| Job 3 (D1) | §5 products/contracts/placement + gap_candidates mechanism; decides whitespace-vs-scary + field schemas; then A6's modded re-review |
| Job 4 (D5) | §6.5/§6.7 currency consumption points + §2's never-merge finding + A32 seed list |
| Job 5 (spine) | §9 seam list + §6 refuse conditions + A40 withheld-lists |
| Job 6 (D7) | this entire document is Job 6's deliverable — the recommendation PART 2 said Phase 3 produces |
| Job 7 | §6 per-stage cards as revision targets, in PART 2's data-flow order |
| Job 8 (D8) | §6.9 copywriter/chief design; gates unchanged |
| Job 9 | §10 re-review slot |

Sequencing note honored (● A15/A36): the VOC collection MVP (pass-1) is buildable immediately against the existing spec + §5.1 product definitions — before the KB mechanization pass, which waits on Job 2 content.

---

## 12. Veto register (