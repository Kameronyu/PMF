# PMF — project instructions

## Naming

- **Step** = a PMF research step (0–8), defined in `workflow.md`. **Stage** = a GSD build unit (`M1-S{n}`). **Phase** = GSD's mechanical roadmap index only (`### Phase N` in `ROADMAP.md`, where Phase N = Stage M1-SN). Never call a PMF research step a "Phase," and never reuse Step numbers for build units. *(Renamed Phase→Step across PMF docs 2026-06-03 to end the collision with GSD's Phase index.)*

## Agent design

- **One job per agent, split to the smallest part, and route each job to the right executor.** Deterministic jobs (fetch, clean, dedupe, count/score, store, validate) are scripts/hooks; only judgment jobs (query design, classify, extract, synthesize) are agents. An "agent that cleans data" is a category error.
- Example: "search" splits into query design (agent) + fetch (script); "analyze" splits into classify (agent) + score (script) + synthesize (agent). Cleaning and storing are scripts, never agents.
