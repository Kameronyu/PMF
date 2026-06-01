# PMF

PMF is a research-to-launch system for direct-response e-commerce. You give it a starting point (a product, a transformation, or a niche) and it works that input through a fixed sequence: map the market, pick a bet, study the competition and the customer, design and run a creative test, then launch or kill. What comes out is a validated market, the exact customer language to sell with, and a funnel ready to take money.

It is built to be reused. The first product running through it is InkLeaf, a foldable e-ink tablet. The machinery is meant to work for the next product without being rewritten.

## How to read this repo

Three layers, kept separate on purpose:

- **`workflow.md`** is the canonical flow: every phase, the research questions it answers, and the decision gates. Start here.
- **`definitions.md`** is the locked vocabulary. The terms below (transformation, niche, PMBD, UM, awareness level) mean exactly what that file says, nothing looser.
- **`flow.md`** is a thin skeleton sketch. When it disagrees with `workflow.md`, `workflow.md` wins.

One naming rule: **"Phase" always means a research step, 0 through 8, as defined in `workflow.md`.** Nothing else in the project reuses Phase numbers.

## The flow

The eight phases split into two engines.

### Research engine, Phases 0 to 4: find a market worth entering and learn how to sell to it

- **Phase 0, Map a space.** Collect every player in a space, roll the per-brand data up to market-level signal, and score the opportunity. The output is a populated map, not yet a bet. The score is Gate 1: `(Desire to solve x D2C feasibility) minus Market sophistication, all x Market growth`.
- **Decision, pick the bet.** A person reads the map and chooses one specific transformation x product x niche to pursue.
- **Phase 1, Theorize.** A market is niche x transformation. Given the one or two pieces you have, solve for the rest: who sells it, who wants it, with what mechanism, at what price, and how they market it.
- **Phase 2, Competition.** Study the chosen market in full depth: ads, funnels, offers, reviews, and how sophisticated the field is. This ends at Gate 2: now that you understand the market, do you still believe you can win it?
- **Phase 3, Customer.** Voice-of-customer research. 3a maps which pains, beliefs, and desires show up most often. 3b banks the customer's exact words, each quote tied back to its source. 3c researches the mechanism, whether the thing actually works. 3d loops what was learned back into the earlier phases.
- **Phase 4, Test design.** Decide what to test and why. Take the proven variables from competitors, define what you are changing against them, choose angles by how frequent and how intense they are, and pull exact wording from the 3b copy bank.

### Execution engine, Phases 5 to 8: test it, launch it, judge it

- **Phase 5, Hook test.** Validate hooks cheaply before building full creative.
- **Phase 6, Build-a-brand.** Build the funnel, write 7 to 12 creatives, sequence the belief architecture, and run the test.
- **Phase 7, Eval.** The kill gates. When to push through a weak first result, when to rotate creative, when to stop.
- **Phase 8, Iterate or destroy.** Take the verdict and either iterate the market, product, or angle, or kill it and return to the map.

## Where a human decides

The system does the research. A person makes the bets. The decision points are deliberate:

| When | Decision |
|---|---|
| Phase 0 | Gate 1: is this market worth the work? |
| Phase 0 to 1 | Pick the bet: the specific transformation x product x niche |
| Phase 2 | Gate 2: now that you understand it, can you win it? |
| Phase 4 | Which angles to test (frequency ranks them, judgment picks) |
| Phase 7 | Kill, push through, or rotate creative |

## Status

First real run: InkLeaf, in the e-ink tablet space. Honest state today:

- **Phases 0 to 2** have run for real on e-ink. 3 candidate markets mapped, 31 competitors recorded, 10 studied in depth. The reusable templates are still being pulled out of that run.
- **Phase 3, the VOC engine,** is fully specified but not yet built. It is the current build priority. The full spec is in `handoff-phase3-voc-build.md`.
- **Phases 4 to 8** are defined in `workflow.md` but not yet built. Launch and crowdfunding research for InkLeaf is already done, ahead of where the flow would normally reach it.

## Layout

- `workflow.md`, `definitions.md`, `flow.md`: the system, described above
- `capability_inventory.md`: the roughly 20 atomic jobs the system performs
- `runs/eink-tablets/`: the InkLeaf run, all real data and analysis to date
- `prompts/`, `agents/`: agent specifications, being built out
- `.planning/`: the build-state map and project planning
