# Phase 15 — Copywriter RAG-injection wiring reference (interim, for planning)

This captures the orchestration contract from the throwaway `.claude/skills/copywrite/` stub
(now removed) so the planner has it. It is NOT the copywriter spec — the operator's full
Copywriter Skill prompt is the behavior authority. This file documents only HOW the orchestrator
feeds RAG'd evidence to the copywriter, since hooks do not fire in subagents and injection must be
an explicit orchestrator step (same lesson as inject-dr.js / market-selection).

## The contract the stub established (reuse this, build it out)

- Retrieval is a deterministic SCRIPT, not an agent: `tools/funnel-rag-query.js` (already built,
  Voyage-backed). The copywriter is ONE judgment agent — no parallel fan-out, no subagent needed
  for retrieval.
- The orchestrator (`/copywrite`, main loop) runs, PER SECTION of the architect's copy brief:
  ```
  node tools/funnel-rag-query.js --space=<space> --query="<section.intent>" \
       [--belief=<section.belief_id>] [--proof-tier=<tier>] --top=6
  ```
  and pastes the returned attributed block into the context that writes that section's copy.
  Hooks do NOT auto-inject into the copywriter subagent — this paste is the orchestrator's job.
- The retrieved block carries: granular `execution_detail`, proof tier, validation strength, and
  the `verbatim_refs` tagged `competitor-marketing` vs `review_language`.

## What the stub did NOT do — Phase 15 must add (from the audit)

1. **Source-routed retrieval.** The copywriter spec requires verbatim "scoped per section by the
   brief's source routing" (DTC vs crowdfunding / which funnel type). `funnel-rag-query.js` today
   filters only `--belief` and `--proof-tier`, and `funnel-vectorize.js` DROPS `source_type` from
   the index. Extend both: carry `source_type` (and any agreed routing field) into the index and
   add a source/routing prefilter flag to the query.
2. **The copywriting method itself.** The stub deliberately left the "how to write" empty. Phase 15
   fills it from the operator's Copywriter Skill spec (the two rules, locked format rules,
   RAG-vs-KB separation, output format).
3. **Deterministic DR injection** for the copywriter's 3 craft files
   (`copywriting--spencer-origins/carl-weische/mark-builds-brands.md`) via an
   `inject-copywriter-dr.js` bundler + `read_first` bundle (market-selection pattern). The spec's
   "auto-injected" line is the known mislabel — replace with the deterministic Read.

## Engine already on disk (committed base — do not rebuild)

- `tools/lib/embed.js` — Voyage embed + cosine; stub fallback when no key. The single swap point.
- `tools/funnel-vectorize.js` — builds `runs/<space>/funnels/_index.json` from belief_records.
- `tools/funnel-rag-query.js` — structured prefilter + semantic kNN → attributed injection block.
- `runs/_fixture/funnels/sample.json` — verification scaffold (delete before a real run).
