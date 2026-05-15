# Handoff

Entry point for the next session (likely Claude Code).

## Read these in order

1. `definitions.md` — locked vocabulary. Universal language for the project. Don't modify unless explicitly asked.
2. `workflow.md` — phases of a research run. Workflow layer, not agent layer.
3. `capability_inventory.md` — the ~20 capabilities the system performs. Tagged. Foundational and downstream Unders documented. Locked decisions enumerated at the bottom.

## What's locked

- The capability list (~20 items, see `capability_inventory.md`)
- The phase structure (`workflow.md` — Phases 0–4 substantive, 5–8 deferred)
- The vocabulary (`definitions.md`)
- Architectural decisions enumerated under "Locked decisions" in `capability_inventory.md`

## What's open

Two foundational Unders that must resolve **before** any agent specs get written. Both detailed in `capability_inventory.md`:

1. **Map / persistence layer.** Every capability reads/writes to a shared store. Output schemas depend on this. Read interface matters (Phase 4 gates read from the map). Design this first.
2. **Authorship + source metadata pass-through.** Architectural constraint on the VOC chain. Must be preserved scraper → classifier → clusterer → copy bank. Treat as non-negotiable.

Downstream Unders (parked, resolve via manual runs first — do NOT pre-design):

- Gap analysis scoring (Gate 1)
- Win-decision framework (Gate 2)
- Filter thresholds throughout

## What comes next

In order:

1. **Resolve the two foundational Unders.** Map layer first (gates everything downstream), then authorship/metadata pass-through (likely falls out of map design).
2. **Agent clustering pass.** With the persistence model known, decide which capabilities cluster into which agents. Decisions made per agent, not globally — see locked decision #1 in `capability_inventory.md`.
3. **First agent spec.** Probably per-brand extractor: smallest, most reused, clearest contract. Builds fast, gives a working piece quickly. But this is the call to make after clustering.

Folder structure suggestion when starting specs:
```
ecom-research-system/
  definitions.md
  workflow.md
  capability_inventory.md
  handoff.md
  map/                  # persistence layer design
  agents/               # specs go here, one file per agent
```

## What NOT to do

- Don't redesign the phase structure. It's locked.
- Don't introduce new vocabulary. Use `definitions.md`. If a new term seems needed, propose it explicitly and wait for confirmation.
- Don't pre-cluster agents globally. Cluster per agent during spec writing.
- Don't operationalize gap analysis or Gate 2 thresholds. They calibrate from manual runs.
- Don't write agent specs before the map layer is designed.
- Don't make the cleaner heavy. Dumb version first. Scale when downstream complains.
- Don't change `definitions.md` without explicit ask.

## Working notes

- Direct. Push back when something's wrong. Don't sycophant.
- Dense over verbose. Framework-mapped responses preferred over abstract ones.
- Distinguish synthesis from direct quotation — Kam will catch editorializing.
- Acknowledge what's locked vs open before reasoning. Don't re-open settled questions.
- "I'm not sure" is better than confident bluffing.
- If a session bloats and reasoning degrades, name it and recommend ending.

## Session scope discipline

This is a long-running multi-session build. Each session has one job. If you find yourself wanting to "also just build" or "quickly design" something outside the current session's scope, **stop and write it down for a future session instead.** Drift across sessions is the primary failure mode. If unsure whether something is in scope, it isn't. Park it.
