# Workflow — End-to-End Research System

This is the workflow layer. Phases describe the sequence of work a research run goes through, **and the research questions answered at each**. The **capability layer** (what jobs the system performs) lives in `capability_inventory.md`. The **vocabulary** lives in `definitions.md`. The **data each capability produces/consumes** lives in `map/data_inventory.md`. Agents are a downstream construct — they cluster capabilities. Workflow ≠ agents.

Phases below are stages of work, not agent boundaries. Many capabilities are reused across phases (e.g. per-brand extractor runs in Phase 0 and Phase 2; the VOC chain runs in Phase 1, 2 and 3).

Each phase carries its **research questions** — what a run must answer there. These were merged back from Kam's original planning doc; an earlier workflow draft had compressed or dropped them. Where the two sources conflicted: **phase structure and the gap formula** follow the newer draft; **research-question depth** follows the planning doc. The phase structure and `definitions.md` vocabulary are locked. See the reconciliation note at the bottom.

**Naming.** "Phase" = a research step (0–8), defined here. "Stage" = a GSD build unit. Never reuse Phase numbers for build units.

**Three layers** (where depth lives): **Layer 1 — flow** (the skeleton: steps, order, purpose; see `README.md`). **Layer 2 — agent prompts** (the theory, variables, and classification rules each step runs; this doc is the reservoir that drains into the prompts as each is built). **Layer 3 — scripts/hooks** (APIs, wiring, storage).

**Starting point sets the query order.** A run begins from a Transformation, a Product, or a Niche (T/P/N), or a combination. That choice picks the Phase 1 pipeline (A = T-first, B = P-first, C = N-first, D = product-variation). InkLeaf starts from P.

**This doc's role.** It is the phase spec and the theory reservoir. Built phases live in their prompts; unbuilt phases are mined from here. Run learnings not yet folded in live in `run-retrospective.md` — drain the relevant section into the phase/prompt when you build that part.

---

## Phase 0 — Map a space

Goal: produce a populated map of a space so you can spot opportunity. Output is a map, not a hypothesis.

1. **Sketch a space.** Inputs: transformation category, product category, niche — at whatever specificity is available. May be partial. (Partial-seed handling = Under, deferred.)
   - *Narrowing NTP from broad to exact:* what transformations can I create? What spaces will I know? What avatars will I know?
2. **Collect per-brand info** across players in the space:
   - Transformation(s)
   - Product
   - Niche
   - Sophistication signals: revenue estimate, social proof, distribution
3. **Roll up market-level info** from the brand collection:
   - Claim count + types
   - Trend velocity
   - Mechanisms played
4. **Can you solve any of these problems?** D2C feasibility scan: intuition, mechanism/science research, general web search, commercializability check.
5. **Gap analysis (Gate 1).** Formula:
   ```
   Gap Score = [(Desire to Solve × D2C Feasibility) − Market Sophistication] × Market Growth
   ```
   - **Desire to Solve:** proven spend (existing brands making money in adjacent transformations is evidence), core driver proximity, severity, frequency
   - **D2C Feasibility:** mechanism efficacy (does it actually work — science, reviews, evidence), believability (self-evident UM / authority proof / social proof), economics (COGS, margins, shippability)
   - **Market Sophistication:** claim count, enhanced claim count, competitor sophistication, estimated revenue, distribution sophistication, unique identifiers / massive social proof, UM availability (can you actually differentiate on mechanism)
   - **Market Growth:** trend velocity (growing or stagnant), adjacent trend signals (TikTok virality, search trends, early-adopter behavior)

   Subtraction (not division) on sophistication: strong UM + persuasion can win at any stage. Growth multiplies what's left.

   Variables locked. Scoring methodology Under — calibrate after running manually on 2–3 spaces.

---

## Between Phase 0 and Phase 1 — Hypothesis selection

Human work. Read the populated map, pick a bet (specific T × P × N to pursue). The same decision repeats on every iteration cycle, against a more filled-in map. Not invisible — explicit step.

---

## Phase 1 — Theorize

Goal: given a hypothesis, solve the unsolved variables. A **market** is niche × transformation — you must solve *who sells the transformation* and *who sells to the niche*. You usually start with one, not both.

Pipelines describe the variable-solving order based on what you already have. Each composes existing capabilities — per-brand extractor, market aggregator, transformation-from-product expander, transformation-from-niche expander, mechanism research, VOC chain (see `capability_inventory.md`). Phase tags below show where each sub-question routes.

**Pipeline A — Transformation first.** You have T, need N and P.
1. Transformation (given).
2. Who sells the transformation, with what mechanism, to which niche, at what price, and how (what does their marketing look like)? → Phase 2.
3. Who wants this transformation, and what do we know about them (the niche)? → Phase 3a.
4. Who sells similar transformations to the niche(s) of interest — with what mechanism, to whom, at what price, how? → Phase 2.
5. VOC. → Phase 3b.
6. What can achieve this transformation? Evaluate on D2C feasibility, economics, novelty, believability (niche-specific). → Phase 3c.
7. Test design. → Phase 4.

**Pipeline B — Product first.** You have P (and its T(s)), need N.
1. What transformations can this product serve? → Phase 1 / 3b.
2. Who sells the transformation(s)/product, with what mechanism, to which niche(s), at what price, how? → Phase 2.
3. Who wants this transformation, and what do we know about them? → Phase 3a.
4. Who sells similar transformations to the niche(s) of interest? → Phase 2.
5. VOC. → Phase 3b.
6. Test design. → Phase 4.

**Pipeline C — Niche first.** You have N, need T and P.
1. What do we know about this niche? → Phase 3a.
2. What transformations do they want? → Phase 1.
3. Who sells similar transformation(s), with what mechanism, to your niche, at what price, how? → Phase 2.
4. VOC. → Phase 3b.
5. What can achieve this transformation? Evaluate on D2C feasibility, economics, novelty, believability. → Phase 3c.
6. Test design. → Phase 4.

**Pipeline D — Product variation for a new transformation.** Take a variation of an existing product and point it at a new transformation.

### Filter questions — Pipeline A / B (transformation/product candidates)

Each filter consumes capability outputs. Threshold application is Human until thresholds calibrate (downstream Under).

- Strong desire / proven spend? (either-or)
- Core driver proximity (proven in VOC) × severity × frequency
- Evergreen?
- Why now?
- Emerging transformation? (trends, Glimpse, human read, early-adopter watching)
- Underserved + hungry? (likely specific — human, reviews/VOC)
- Solvable / believable UM? (AI)

### Pipeline B — product-specific questions

- What can your product believably do? Transformation change? Hidden transformation? Multi-benefit and trending?
- Change buyer? (gift-buying, changing demographic/psychographic)
- Format change possible? (likely invention)
- Emerging? (Glimpse, trends, human, early-adopter watching)
- Believable? (AI, human)
- Overlooked? (likely ultra-specific, or for an emerging transformation)

### Pipeline C — niche-specific questions

- Describable? (e.g. "older women's beauty," "older women's wellness")
- Specific, distinct, describable buyer? (Mintel, Reddit)

---

## Phase 2 — Competition (deep market study)

Goal: study the chosen market with full depth. Two framing questions:
- Who is selling to your niche, what transformations, in the same general space?
- Who is selling your transformation, to what niches?

> **Niche-competition definition.** "Who is marketing to your niche?" is *not* everything they buy. It is the general **category** level (e.g. beauty), not the specific transformation (e.g. less-saggy eye bags). Who is selling in your category to which niche. Thus **niche** here = similar person × similar transformation.

Same per-brand extractor used in Phase 0, plus additional capabilities composing around each brand:

- Ad creative + visual extraction (Foreplay, Meta Ad Library, GetHookd, websites)
- Offer/bundle structure extraction
- Channel analysis (SimilarWeb, ad library presence/absence)
- Review mining (VOC chain scoped to competitor reviews)

Depth comes from composition, not from the extractor being smarter. Sources: web, GetHookd, Meta Ad Library.

### Sophistication & landscape evaluation

Ideally: proven spending but easy competition.

- How many of the same **claims** are made to the market? (Keep base claims under 5 — the 5+ rule discounts a claim regardless of copy quality.)
- **Evaluate each competitor:**
  - What claims are they making? (transformation)
  - What products are they selling? (mechanisms)
  - Who are they selling to? (niche)
  - What is their framing in ads and on the website? (angles)
  - What awareness levels are they selling to?
  - Extraordinary identifier on their website? (sophistication)
  - Tons of UGC reviews? Press coverage? Celebrity endorsement?
  - Estimated revenue of your niche & transformation competitors.
  - What are they bundling? What do their offers look like?
  - Brand loyalty?
- **Analyze their reviews:** hidden use cases? what do they like? what don't they like? who are they?
- What does their marketing physically look like? (GetHookd, Ads Manager, website)
- Where are they getting customers? Competitors NOT scaling on Meta? → opportunity to be first on that channel.

### Evaluate the market

- Saturation (count) for each individual claim you see.
- Multiple huge / sophisticated players?
- What are the products in the space? How many brands with the same product?
- What are the common / winning variables in this space?
- What do people pay for this transformation? Proven demand / market?
- How do you think you'll differentiate? Did you find anything in the reviews?

### Critical Decision Point — Gate 2: Winnable?

Now that the market is studied, the avatar understood, the science mapped: do you still think you can win here? Ideally proven spend but easy competition. You *can* win a competitive market with a great / convincing / extraordinary mechanism or product (Human judgment) — strong UM + easy competition / gap are the biggest difference-makers.

Gate 2 is judgment against a framework. Framework structure: differentiation is structurally a Product UM play 95% of the time, gated by gap analysis, with proven variables stolen from competition. Scoring methodology Under — calibrate alongside Gate 1.

---

## Phase 3a — Structural map of themes

Goal: identify which themes, frames, emotions, and PMBDs (pains, beliefs, motifs, desires) are frequent in the avatar, and which core drivers sit underneath them. Output: ranked themes by prevalence. Drives angle selection in Phase 4 (frequency × intensity scoring on candidate angles).

**Two-phase VOC approach:**
1. **Broad pattern discovery** — frequency tables across the market: which characteristics are probable. Also which answers **co-occur in clusters** (they mention X *and* Y in the context of problem Z) — build this into the pattern. Mintel × demographic × science is the friend here: large, non-noisy datasets alongside VOC clustering.
2. **Deep language analysis** — take the high-frequency patterns and dig into the actual words used around them.

**Avatar definition problem.** Searching only by transformation frankensteins a fake avatar by combining traits from different people who share one pain. Fix: anchor the search to a niche identifier *other than the pain*, then layer the transformation on top — use venues where avatar traits are pre-filtered (subreddits anchored on age, life stage, identity).

**Three search lanes** — all feed the same VOC chain. Run all three to triangulate.

- **Lane 1 — Transformation only (population-wide).** No niche filter. How anyone with this problem talks about it.
- **Lane 2 — Transformation inside the niche.** Niche-anchored venue + transformation query. Isolates niche-specific language; compare against Lane 1.
- **Lane 3 — Adjacent context inside the niche.** Niche venue + the broader category the transformation sits inside. Surfaces the surrounding belief system, identity, worldview — feeds the Belief/identity layers, not just the immediate pain. The Mintel pipeline is most useful here: search for a relevant Mintel report — a customer-research report for product category × niche.

### Research questions — the PMBD battery

The question battery below appears once, here. Phase 3b runs the same themes for verbatim copy capture rather than frequency — it does not re-list them. Researchers must **also look for core differentiators** while running this battery, not just PMBDs.

**Belief**
- What do they believe (about themselves and their situation)?
- What do they trust (sources, brands, people)?
- Where do they get their information?
- What do they believe / feel about other products and the category?
- What specifically about your category would they agree or disagree with? ("all-natural good, processed bad")
- Are they loyal to specific brands?
- What do they believe are the barriers to the outcome — about other products, themselves, or the transformation? ("it's just genetics," "all those supplements are crap")

**Experiences** (feeds Belief and Motif)
- Experiences with other products: what have they bought in this category, what did they expect, where did it fall short, what did they like?
- Other life experiences relevant to the transformation.

**Motif** (behaviors / actions — observable from outside)
- Behaviors related to the problem — coping strategies, habits in any relation to the desired transformation (including adjacent contexts: what they do when they feel ugly, not only what they do about the puffiness itself).
- What they have bought / what they currently do around the problem (e.g. drink water to depuff).

**Pain** (laddered)
- Physical & symptom-related: what happens to their body.
- Surface pain: the symptom they notice ("look puffy," "feel tired").
- Pain of pain: what happens *because* of the pain (embarrassed on a date, bed-rot all day).
- Pain of pain of pain: the true root (don't want to be seen as "less than"; scared of running out of time).
- Core human driver: survival / reproduction / status / belonging.

**Desire** (laddered)
- Immediate relief (not feel uncomfortable from a hot flash; look more attractive).
- Outcome of the desire (get the date, get complimented, less mental space taken up by it).
- Desire of the desire of the desire (to be the person others want to be; to be respected; to feel desired).
- Core human driver.

The broad-discovery pass (above) records which of these answers **co-occur in clusters** — when the same individual expresses X *and* Y around problem Z. That clustering is what feeds sub-niche validation in Phase 3b.

**Sources:** competitor reviews from Phase 2 · Reddit · Quora · Facebook groups · TikTok / Instagram comments and posts · YouTube posts (highest-engagement framings).

### Evaluation

- What words will they use about the probable characteristics? (some make good sub-niches)
- What framings of the situation are dominant? Nail their exact emotions — articulate *their* feelings so it feels like talking to themselves.
- For what reasons / motivations do they want the transformation, or would pick you over alternatives? Focus on recurring PMBDs likely to drive purchase. (Frequency surfaces angles; intensity is Kam's call.)
- They buy on emotion and justify with logic — what do they believe, trust, and emotionally resonate with?
- Who are you selling to, broadly? What do they think about your general category?
- How aware do they get? Estimate education requirements / possible awareness levels.

---

## Phase 3b — Verbatim language bank

Goal: capture the actual words the avatar uses around each theme. The copy bank. Same raw material as 3a; different operation — where 3a counts frequencies, 3b extracts verbatim quotes indexed to themes.

Output: copy bank organized by theme / sub-niche / PMBD layer, with source metadata preserved (platform, venue, author, link, engagement). Source-aware: queries can filter to purchase-anchored language (Amazon reviews) vs community language (Reddit). Sources: Amazon reviews, TikTok, Facebook, Reddit, Quora, YouTube.

It runs the same research questions as 3a, but for verbatim copy capture rather than frequency.

**Purchase signal / strong desire:** large (high prevalence/frequency) · specific (VOC) · purchasing power (demographics / type of transformation) · reachability · growing? · new? · what are problems that used to not be problems?

### Sub-niche validation (strict)

PMBD clusters must be observed in single individuals (not assembled across people). 5+ independent individuals each demonstrating co-occurrence of 2+ cluster PMBDs in one comment/review/post → validated sub-niche. Anything less is a Frankenstein avatar.

---

## Phase 3c — UM research

Goal: understand the transformation factually. Causes, biological pathways, existing solutions, evidence quality. Surface product candidates. Factual standpoint, not customer standpoint.

Two main capabilities (see inventory):
- Mechanism research (scite, Web of Science, web search, Google Trends / Glimpse, IP/regulatory/COGS signals, format candidates)
- Product candidate discovery (Alibaba AI, emerging-product scanning, format-change ideation seeded by Human heuristics)

**Generation heuristics — Feature UM:**
- Only one player for a mechanism? Can we format-change? (e.g. a gummy)
- Regular household items related to the problem (pillowcases & skin, towels & skin) — could they be causing the problem, or be a novel way to fix it?
- Adherence issues to a routine people want to keep — how do I make it easier? (AG1)

**Generation heuristics — Product UM / market change** (Pipeline B/D territory):
- Start with an emerging product booming in one market — does it solve other permanent desires?
- What can your product believably do? Transformation change? Hidden transformation? Multi-benefit and trending?
- Change buyer? (gift-buying, changing demographic/psychographic)

**Filters — apply to any candidate** (filtering is Human, some pieces Op-supported):
- Aligns with your customer avatar?
- Believable? (AI, human)
- Not used by competitors?
- Overlooked? (likely ultra-specific / niche, or for an emerging transformation)
- Consumable with high LTV?
- Economics: COGS floor, margins, shippability.
- Patentability / IP barriers. Regulatory barriers.
- Does your market already understand your mechanism? How aware is the market of what you're about to tell them?

---

## Phase 3d — Loop back

Revise Phase 0 and Phase 1 based on what was learned. Orchestration step, not new work. Then either move to test design, or re-evaluate and do more research.

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

1. **Review competitor data.** How will you differentiate, and can you win this market?
2. **Define dependent (proven) variables** from competitor data — what's been validated.
3. **Define test variables** — what you're changing relative to proven.
4. **ToT through** why the test would or wouldn't work, before committing.
5. **Macro test selection** — same product to new markets, or same market with new products. Decided by which lever gap analysis pointed at + which one the Product UM hypothesis supports.
6. **Reason awareness levels** given the macro test (market × product).
7. **Micro tests / angles** — sub-avatar by sub-avatar, maximum diversity. Pick angles by frequency × intensity. Why would they pick you over alternatives? Angle types: pain (shameful behavior), desire (aspirations), authority, objection-handle, offer (offer angle for warm traffic).
8. **Pull exact language** from the Phase 3b copy bank for each test variable.

Target: 7–12 creatives covering as much surface area as possible across as many levers as can be identified.

---

## Phases 5–8 — Execution (lighter scope)

Downstream of the research system working at all. Not in current build scope — kept lighter than Phases 0–4 — but real stubs, not placeholders.

### Phase 5 — Hook test

White-square test preview. Test your hooks before building full creative. Preferably take hooks from the titles of high-engagement VOC posts — a post that earned engagement organically has a validated hook. Read the data; try to draw conclusions or direction from it.

### Phase 6 — Build-a-brand

- 7–12 creatives.
- Funnel build.
- Belief architecture.
- Run the test.

**Execution principles** (see Cross-cutting below for the full statement): become the customer, externalize the UM ("it's not their fault"), play out their purchase logic.

### Phase 7 — Eval

- What are your kill gates?
- When do you rotate creatives out?
- When do you push through after the first test vs. kill altogether?

### Phase 8 — Iterate or destroy

Take the verdict from Phase 7 and either iterate the market/product/angles or kill it and return to the map.

---

## Cross-cutting — Execution principles

- **Become your customer.** Relate via behaviors, beliefs, situations. Be on their side. To convince them is to speak their language — a biohacker reasons toward a purchase differently than a menopausal woman.
- **UM externalization.** Tell them it's not their fault — that is how people justify purchases to themselves.
- **Play out the purchase.** Walk through how this specific person justifies buying, the logic they use, the journey they take if eventually convinced. Think their thoughts.

## Cross-cutting — System

- **Map / persistence layer:** every capability writes to and reads from a shared store. **Deprioritized (2026-05-21 course correction): build just-in-time when manual friction justifies it, not before capability specs.** Interim persistence = flat `.md` files. See `capability_inventory.md` and `map/data_inventory.md`.
- **Source metadata** (platform, venue, author, link, engagement) is preserved through every capability in the VOC chain. Non-negotiable. Enables the 5+ co-occurrence rule, the source-aware copy bank, and downstream analysis.
- **3a and 3b are distinct operations on the same raw material.** 3a is structural (frequency). 3b is linguistic (verbatim quotes). Both consume classified VOC; they branch downstream of the classifier.

---

## Reconciliation note

This doc merges two sources: an earlier workflow draft (newer; clean phase structure, corrected gap formula) and Kam's original project planning doc (older; deeper research questions). Restored from the planning doc: Pipeline D, the niche-competition definition, the laddered VOC research questions (pain ladder, desire ladder, the six belief surfaces, the experience and motif questions), the Phase 2 sophistication/market checklists, the Phase 3a search lanes and source list, the Phase 3c generation heuristics and filters, the Phase 4 angle types, the Phase 5–8 stubs, and the execution principles. The gap formula and phase structure are the newer draft's. `definitions.md` vocabulary and the phase structure (0–8) are locked.

Dropped from the planning doc as out-of-scope: the `trend velocity = (desire × feasibility) / sophistication` formula (superseded by the Gap formula above — subtraction, plus Market Growth); the operator self-assessment ("what am I good at / what can I sell / moat"); the wellness/tech niche scratch sketch; the "human type questions" build-the-system meta-checklist (deprioritized by the course correction — the manual workflow is the product); and agent-implementation asides and scratch notes.
