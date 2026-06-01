# Flow

The high-level flow — what happens, in what order, what each step is for. Thin by design.

**Three layers.** This doc is layer 1. Depth does not belong here:
- **Layer 1 — Flow (this doc).** The skeleton. Steps, order, purpose.
- **Layer 2 — Agent prompts.** Theory-heavy. The variables, questions, heuristics, and
  classification rules each step collects and what they mean. Each `!Agent` step below points
  here. (Raw material lives in the original workflow doc — cut up and dropped into the prompt
  for the step that uses it.)
- **Layer 3 — Technical implementation.** APIs, software wiring, how data is stored/structured/joined.

**Starting point sets the query order.** You begin from a Transformation, a Product, or a Niche
(T / P / N) — or a combination. That choice determines which query the Finder leads with and
what you're solving for. (Inkleaf starts from **P**: product fixed, solving for niche/market.)

---

## Phase 0: Signal Generation
- What transformations can I create?
- What market categories can I spot opportunity in?
- What avatars will I know?

## Phase 1: Sketch Your Competition

**!Finder Agent** *(prompt: layer 2)*
- Fancy query-pair generation.
- If you have a transformation, look for which brands sell your transformation.
- If you have an avatar, look at what brands the avatar buys from.
- If you have a product, look for what brands sell your product / similar products.
- *or any combination of these 3.* ← this is the T/P/N starting-point routing.

**!Light Brand Analysis Agent** *(prompt: layer 2)*
- Analyze per-brand: Product, Mechanism, Niche, Transformation, Sophistication Signals.

**!Light Space Analysis Agent** *(prompt: layer 2)*
- Analyze space: brand and claim frequency and ad volume per product / niche / transformation /
  claim / mechanism.

**!Gap Analysis Agent + Human** *(prompt: layer 2 — scoring spine lives here: Desire to Solve ×
D2C Feasibility − Market Sophistication × Market Growth)*
- Which markets could my product serve that aren't being served / are underserved?
- Does this market already spend similar amounts on similar products? Do we have validated
  demand? If not, does the customer talk about wanting to spend money on a product like ours?
- What edge does my product have over the competition — what can it do differently, for what
  purpose, that provides the customer a uniquely desirable benefit?
- What is the trend velocity?
- Perform feasibility evaluation.

### 1.1 — For each new candidate market

**!Finder Agent** *(prompt: layer 2)*
- Find competition specific to the new market you selected. Realistic that they all sell
  similar products.

**!Light Brand Analysis Agent** *(prompt: layer 2)*
- Analyze per-brand: Product, Mechanism, Niche, Transformation, Sophistication Signals.

**!Light Space Analysis Agent** *(prompt: layer 2)*
- Analyze space across the candidate market's brand set.

**!Gap Analysis Agent + Human** *(prompt: layer 2)*
- Does this market already spend similar amounts on similar products? Validated demand? If not,
  does the customer talk about wanting to spend on a product like ours?
- What edge does my product have, for what purpose, that's uniquely desirable?
- What is the trend velocity?
- Perform feasibility evaluation.

**!Decision Agent + Human** *(prompt: layer 2)*
- Should we pursue this?

## Phase 2: Study Your Competition

**!Deep Brand Analysis Agent** *(prompt: layer 2)* — run on top 5 brands in the market.

Ads:
- Ad run length
- Transformation
- Angle
- Niche
- Awareness level
- Corresponding funnel link

Frequency per Angle, Transformation, Niche, Awareness Level.

Funnel:
- Corresponding ad link
- Funnel structure / full breakdown
- Transformation
- Angle
- Niche
- Awareness level

**!Persuasion Analysis Agent** *(prompt: layer 2)*
- How do we use the winning elements from other brands in our brand, while staying congruent
  with the differentiated edge from Phase 1?

## Phase 3: Study Your Customer
> **Not yet run.** No VOC / customer research happened in the e-ink run. Full theory (PMBD
> ladder, avatar-frankenstein problem, three search lanes, frequency-then-language) lives in
> the reservoir (original workflow doc) → goes into layer 2 when built. Sub-phases: 3a
> learn/choose market · 3b voice-of-customer copy bank · 3c UM/mechanism research · 3d loop back.

## Phases 4–8: Test → Launch → Eval
> **Not yet run.** Theory in the reservoir. 4 = test design (macro/micro tests, angle types) ·
> 5 = hook test · 6 = build-a-brand · 7 = eval/kill gates · 8 = iterate or destroy.
