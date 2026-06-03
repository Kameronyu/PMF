# PMF

PMF is a research-to-launch system for direct-response e-commerce. You start from a product, a transformation, or a niche, and it works that input down a fixed flow: map a space, pick a market worth entering, study the competition and the customer, design and run a creative test, then launch or kill. What comes out is a validated market, the exact customer language to sell with, and a funnel ready to take money. InkLeaf (a foldable e-ink tablet) is the first product running through it; the machinery is built to work for the next one without being rewritten.

*Each `!` step is an agent: click its name to open the exact prompt it runs. Steps marked **+ Human** need a person to make the call. Where an agent is specced but not built yet, the link opens its spec.*

---

## Phase 0: Signal Generation

- What transformations (a transformation is what your product does for the customer) can I create?
- What market categories can I spot opportunity in?
- What avatars (the specific kind of customer you sell to) will I know?

## Phase 1: Sketch Your Competition

**! [Finder Agent](prompts/phase1-light-pass.md)**
- Fancy query pair generation (building the search queries that surface competitor brands).
- If you have a transformation, look for which brands sell your transformation.
- If you have an avatar, what brands does the avatar buy from.
- If you have a product, look for what brands sell your product / similar products.
- *or any combination of these 3.*

**! [Light Brand Analysis Agent](prompts/phase1-light-pass.md)**
- Analyze per-brand: Product, Mechanism (how the product delivers the transformation), Niche (the specific group of people you sell to), Transformation, Sophistication Signals (how advanced and saturated the competitors' marketing already is).

**! [Light Space Analysis Agent](prompts/phase1-light-pass.md)**
- Analyze space: brand and claim (a claim is a promise the marketing makes) frequency and ad volume per product / niche / transformation / claim / mechanism.

**! [Gap Analysis Agent](.claude/skills/market-selection/SKILL.md) + Human**
- Which markets could my product serve that aren't being served / are underserved.
- Does this market already spend similar amounts of money on similar products? Do we have validated demand? If not, does the customer talk about wanting to spend money on a product like ours?
- What edge does my product have over the competition, what can it do differently and for what purpose, that gives the customer a uniquely desirable benefit.
- What is the trend velocity (how fast the market is growing)?
- Perform feasibility evaluation (can we realistically make this and sell it at a profit).

### 1.1 For the new markets

**! [Finder Agent](prompts/phase1-light-pass.md)**
- Find your competition specific to the new market you selected. It is realistic that they all sell similar products.

**! [Light Brand Analysis Agent](prompts/phase1-light-pass.md)**
- Analyze per-brand: Product, Mechanism, Niche, Transformation, Sophistication Signals.

**! [Light Space Analysis Agent](prompts/phase1-light-pass.md)**
- Analyze space: brand and claim frequency and ad volume per product / niche / transformation / claim / mechanism.

**! [Gap Analysis Agent](.claude/skills/market-selection/SKILL.md) + Human**
- Does this market already spend similar amounts of money on similar products? Do we have validated demand? If not, does the customer talk about wanting to spend money on a product like ours?
- What edge does my product have over the competition, for what purpose, that gives the customer a uniquely desirable benefit.
- What is the trend velocity?
- Perform feasibility evaluation.

**! [Decision Agent](.claude/skills/market-selection/SKILL.md) + Human**
- Should we pursue this?

## Phase 2: Study Your Competition

**! [Deep Brand Analysis Agent](prompts/_specs/deep-market-analysis-framework.md)** *(specced, not built)*

Ads:
- Ad run length
- Transformation
- Angle (the specific way the pitch is framed)
- Niche
- Awareness level (how much the customer already knows about the problem and the solutions)
- Corresponding funnel (the path from ad to purchase) link

Frequency per Angle, Transformation, Niche, Awareness Level.

Funnel:
- Corresponding ad link
- Funnel structure / full breakdown
- Transformation
- Angle
- Niche
- Awareness level

Run this on the top 5 brands in the market.

**! [Persuasion Analysis Agent](prompts/_specs/deep-market-analysis-framework.md)** *(specced, not built)*
- How are we going to use the winning elements from other brands in our brand, while staying congruent with the differentiated edge from Phase 1.

## Phase 3: Study Your Customer

Not built yet. Voice-of-customer research (the customer's own words, pulled from reviews and forums). Full spec: **[handoff-phase3-voc-build.md](handoff-phase3-voc-build.md)**. Sub-phases: 3a frequency map of themes, 3b verbatim copy bank, 3c UM / mechanism research (unique mechanism: the specific reason your product works that competitors don't claim), 3d loop back.

## Phases 4 to 8

Defined but not built. See **[workflow.md](workflow.md)**. 4 = test design, 5 = hook test, 6 = build-a-brand, 7 = eval / kill gates, 8 = iterate or destroy.
