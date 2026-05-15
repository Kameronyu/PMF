# Workflow — End-to-End Research System

This is the workflow layer. Phases describe the sequence of work a research run goes through. The **capability layer** (what jobs the system performs) lives in `capability_inventory.md`. The **vocabulary** lives in `definitions.md`. Agents are a downstream construct — they cluster capabilities. Workflow ≠ agents.

Phases below are stages of work, not agent boundaries. Many capabilities are reused across phases (e.g., per-brand extractor runs in Phase 0 and Phase 2; VOC chain runs in Phase 1, Phase 2, and Phase 3).

---

## Phase 0 — Map a space

Goal: produce a populated map of a space so you can spot opportunity. Output is a map, not a hypothesis.

1. **Sketch a space.** Inputs: transformation category, product category, niche — at whatever specificity is available. May be partial. (Partial-seed handling = Under, deferred.)
2. **Collect per-brand info** across players in the space:
   - Transformation(s)
   - Product
   - Niche
   - Sophistication signals: revenue estimate, social proof, distribution
3. **Roll up market-level info** from the brand collection:
   - Claim count + types
   - Trend velocity
   - Mechanisms played
4. **Can you solve any of these problems?** D2C feasibility scan: intuition, mechanism research, commercializability check.
5. **Gap analysis (Gate 1).** Formula:
   ```
   Gap Score = [(Desire to Solve × D2C Feasibility) − Market Sophistication] × Market Growth
   ```
   - **Desire to Solve:** proven spend, core driver proximity, severity, frequency
   - **D2C Feasibility:** mechanism efficacy, believability (self-evident UM / authority proof / social proof), economics
   - **Market Sophistication:** claim count, enhanced claim count, competitor sophistication, UM availability
   - **Market Growth:** trend velocity, adjacent trend signals

   Subtraction (not division) on sophistication: strong UM + persuasion can win at any stage. Growth multiplies what's left.

   Variables locked. Scoring methodology Under — calibrate after running manually on 2–3 spaces.

---

## Between Phase 0 and Phase 1 — Hypothesis selection

Human work. Read the populated map, pick a bet (specific T × P × N to pursue). The same decision repeats on every iteration cycle, against a more filled-in map. Not invisible — explicit step.

---

## Phase 1 — Theorize

Goal: given a hypothesis, solve the unsolved variables.

Pipelines describe the variable-solving order based on what you already have:

- **Pipeline A — Transformation first.** You have T, need to pick N and P.
- **Pipeline B — Product first.** You have P (and its T(s)), need to pick N.
- **Pipeline C — Niche first.** You have N, need to pick T and P.

Each pipeline composes existing capabilities — per-brand extractor, market aggregator, transformation-from-product expander, transformation-from-niche expander, mechanism research, VOC chain. See `capability_inventory.md` for what each does.

Filter questions inside each pipeline (strong desire / proven spend, evergreen, why now, emerging, underserved + hungry, solvable UM, describable buyer) consume capability outputs. Threshold application is Human until thresholds calibrate.

---

## Phase 2 — Competition (deep market study)

Goal: study the chosen market with full depth. Same per-brand extractor used in Phase 0, plus additional capabilities composing around each brand:

- Ad creative + visual extraction (Foreplay, Meta Ad Library, GetHookd, websites)
- Offer/bundle structure extraction
- Channel analysis (SimilarWeb, ad library presence/absence)
- Review mining (VOC chain scoped to competitor reviews)

Depth comes from composition, not from the extractor being smarter.

### Sophistication & landscape evaluation

Read the aggregated outputs. Count claims per type. Identify enhanced claims. Map sophistication levels per competitor (revenue, distribution, unique identifiers, massive social proof). Assess UM availability.

### Critical Decision Point — Gate 2

Now that the market is studied, the avatar is understood, and the science is mapped: do you still think you can win here?

Gate 2 is judgment against a framework. Framework structure: differentiation is structurally a Product UM play 95% of the time, gated by gap analysis, with proven variables stolen from competition. Scoring methodology Under — calibrate alongside Gate 1.

---

## Phase 3a — Structural map of themes

Goal: identify which themes, frames, emotions, beliefs, behaviors, pains, dreams, and drivers are frequent in the avatar.

Output: ranked themes by prevalence. The structural map of "what patterns are common."

Drives angle selection in Phase 4 (frequency × intensity scoring on candidate angles).

Three VOC search lanes, all feeding the same chain:

- **Lane 1 — Transformation only (population-wide).** No niche filter.
- **Lane 2 — Transformation inside the niche.** Niche-anchored venue + transformation query.
- **Lane 3 — Adjacent context inside the niche.** Niche venue + broader category beyond the transformation. Surfaces beliefs/identity/PMBD layers.

Mintel and other institutional databases supplement Lane 3.

---

## Phase 3b — Verbatim language bank

Goal: capture the actual words the avatar uses around each theme. The copy bank.

Same raw material as Phase 3a. Different operation: where 3a counts frequencies, 3b extracts verbatim quotes indexed to themes.

Output: copy bank organized by theme / sub-niche / PMBD layer, with source metadata preserved (platform, venue, author, link, engagement). Source-aware: queries can filter to purchase-anchored language (Amazon reviews) vs community language (Reddit) etc.

### Sub-niche validation (strict)

PMBD clusters must be observed in single individuals (not assembled across people). 5+ independent individuals each demonstrating co-occurrence of 2+ cluster PMBDs in one comment/review/post → validated sub-niche. Anything less is a Frankenstein avatar.

---

## Phase 3c — UM research

Goal: understand the transformation factually. Causes, biological pathways, existing solutions, evidence quality. Surface product candidates.

Two main capabilities (see inventory):
- Mechanism research (scite, web of science, web search, IP/regulatory/COGS signals, format candidates)
- Product candidate discovery (Alibaba AI, emerging product scanning, format-change ideation seeded by Human heuristics)

Filtering against avatar fit, believability, IP, regulatory, economics, LTV is Human (some pieces Op-supported).

---

## Phase 3d — Loop back

Revise Phase 0 and Phase 1 based on what was learned. Orchestration step, not new work.

---

## Phase 4 — Test design

Goal: define what you're going to test and why.

### Inputs

- Gap analysis (Gate 1) — from Phase 0
- Win-decision (Gate 2) — from Phase 2
- Avatar understanding — from Phase 3a/3b
- Mechanism + product candidates — from Phase 3c
- Competitor data — from Phase 2 (proven variables to steal)

### Test design

1. **Define dependent (proven) variables** from competitor data — what's been validated.
2. **Define test variables** — what you're changing relative to proven.
3. **Macro test selection** — same product to new markets, or same market with new products. Decided by which lever gap analysis pointed at + which one the Product UM hypothesis supports.
4. **Reason awareness levels** given the macro test.
5. **Micro tests / angles** — sub-avatar by sub-avatar. Pick angles by frequency × intensity. Angle types: pain, desire, authority, objection handle, offer (offer angle for warm traffic).
6. **Pull exact language** from the Phase 3b copy bank for each test variable.
7. **ToT through** why the test would or wouldn't work before committing.

Target: 7–12 creatives covering as much surface area as possible across as many levers as can be identified.

---

## Phases 5–8 — Deferred

Hook test, build-a-brand, eval, iterate. Not in current scope. Downstream of the research system working at all.

---

## Cross-cutting

- **Map / persistence layer:** every capability writes to and reads from a shared store. Foundational Under — has to be designed before capability specs. See `capability_inventory.md`.
- **Source metadata** (platform, venue, author, link, engagement) is preserved through every capability in the VOC chain. Non-negotiable. Enables the 5+ co-occurrence rule, the source-aware copy bank, and downstream analysis (Reddit vs Amazon vs TikTok comparisons).
- **3a and 3b are distinct operations on the same raw material.** 3a is structural (frequency). 3b is linguistic (verbatim quotes). Both consume classified VOC; they branch downstream of the classifier.
