# PMF — project instructions

## Agent design

- **One job per agent, split to the smallest part, and route each job to the right executor.** Deterministic jobs (fetch, clean, dedupe, count/score, store, validate) are scripts/hooks; only judgment jobs (query design, classify, extract, synthesize) are agents. An "agent that cleans data" is a category error.
- Example: "search" splits into query design (agent) + fetch (script); "analyze" splits into classify (agent) + score (script) + synthesize (agent). Cleaning and storing are scripts, never agents.

## Versioning

**no-overwrite-v1 convention** (D-07/D-08/D-09, adopted 2026-06-04):

- **Rule:** A committed run output (any file or directory under `runs/<space>/…`) or an emitted brick is never mutated in place on a re-run. A re-run writes a NEW versioned location (e.g. a `v2/` subdirectory or a `-v2` suffix); v1 stays intact for provenance and diffing.
- **Scope:** Governs committed run outputs + emitted bricks. Does NOT govern logs/scratch (gitignored) or in-flight uncommitted work.
- **Enforcement:** Convention only. A guard hook/script is explicitly DEFERRED — not built yet.
