# _quarantine — InkLeaf research run (throwaway)

**Do NOT read anything in here as canon, current spec, or a durable prompt.**

This is the May 2026 InkLeaf e-ink research run + superseded session handoffs. It shipped fast
with run-specific "beta" briefs that were never the prompt layer. The owner has declared it
throwaway. It is kept only for history / traceability.

- `runs/` — the InkLeaf research run: brand records, market scans, ad library, crowdfunding
  corpus, and the `*-brief.md` files (run-specific kickoff prompts, NOT reusable templates).
- `archive/` — superseded session handoffs (granular-analysis, crowdfunding-teardown, the
  2026-05-23 handoff).

**The durable value was already extracted:**
- Learnings → `run-retrospective.md` and `agents/implementation-notes.md`.
- Working fetch tooling → rescued to `/tools/` (`adlib-one.js`, `adlib-sweep.js`, `crowdfund-fetch.js`).
  The `sw-*.js` / `explore-typeahead.js` SimilarWeb scripts stayed here — abandoned (SimilarWeb
  blocks Playwright).

If you are an agent building the current workflow: ignore this directory entirely. Read the
durable docs at repo root + `prompts/` + `.claude/skills/`.
