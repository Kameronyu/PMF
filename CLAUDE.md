# PMF — project instructions

## Agent design

- **One job per agent, split to the smallest part, and route each job to the right executor.** Deterministic jobs (fetch, clean, dedupe, count/score, store, validate) are scripts/hooks; only judgment jobs (query design, classify, extract, synthesize) are agents. An "agent that cleans data" is a category error.
- Example: "search" splits into query design (agent) + fetch (script); "analyze" splits into classify (agent) + score (script) + synthesize (agent). Cleaning and storing are scripts, never agents.
