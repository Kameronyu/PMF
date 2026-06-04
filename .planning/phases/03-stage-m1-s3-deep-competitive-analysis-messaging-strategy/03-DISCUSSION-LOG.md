# Phase 3: Stage M1-S3 — Deep competitive analysis (collection layer) - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 03 — stage-m1-s3-deep-competitive-analysis-messaging-strategy
**Areas discussed:** Phase boundary, input/routing seam, tooling reuse, validation depth, crowdfunding sourcing, storage/RAG boundary, vocab

---

## Source-of-truth swap
The repo `prompts/_specs/deep-market-analysis-framework.md` (two-lens prose) was superseded mid-discuss by
a pasted **"Phase 2 Funnel Analysis — Build Specification (Collection Layer)"** — funnel as the unit,
ad→LP binding, belief-instance records, one-prompt+routing-flag, birdseye deferred. Build off the new spec.

## Phase boundary — does it shrink?
| Option | Selected |
|--------|----------|
| (a) Collection layer only; birdseye/merge → own later phase | ✓ |
| (b) Keep merge + Gate 2 in this phase | |
**Kam:** "yes phase shrinks." → D-01.

## Validation depth (how "done" is judged)
| Option | Selected |
|--------|----------|
| Build + plumbing smoke test + temp Analyzer verify | ✓ |
| Build only, defer all running | |
**Kam:** "yes smoke test but make the analysis temp just to verify that it did it." Market not picked;
build ready-to-run, defer the real methodology debug pass. → D-02, D-17, D-18.

## Crowdfunding source discovery
| Option | Selected |
|--------|----------|
| Out of Phase 3; (initially) recorded as Phase-1 Finder gap | (corrected) |
| Build a mini-finder in Phase 3 | |
**Kam:** flagged the note as a possible "bug that doesn't exist." Verified `step1-light-pass.md:250-254` —
LANE 2 ALREADY searches KS/Indiegogo for in-category campaigns. **No Phase-1 bug.** Phase-1 debug-notes
edit fully reverted. Real open item = off-transformation *container-only* exemplars (none discovered today)
→ D-19 (open strategy call). Arduview dump has 2 crowdfunding funnels (gameshell strong, skeleton-key thin)
— "short, not fail," within bar.

## Routing
**Kam:** "routing is just telling it whether the transformation is similar or not… this won't be terribly
hard to build the router." → D-10: light A2-classify router sets `routing_flag` from transformation
similarity; one prompt + flag, not a structure/messaging split.

## Vocab
**Kam:** "I honestly don't care as long as everything is internally consistent… so there aren't 2 tags for
the same thing." → D-15: Claude resolves vocab to a single consistent set, no human ratification gate.

## Storage / RAG boundary
**Kam:** conflated S4 with the RAG; asked if funnel data exists/is neat, and how the copywriter RAG works.
Corrected: S4 (store) = interim structured JSON, NOT vectors; the vector RAG + funnel-writer + copywriter
are downstream Step-4 machinery. Funnel data does NOT exist yet (no `destination_url`, no LP bodies) —
building the §2b assembler is the spine. → D-06, D-08, D-16. Copywriter-RAG end-state captured in
<specifics> as downstream context, out of scope.

## Claude's Discretion
- Scraper/render/normalization/clustering impl; DR-injection hook mechanics; vocab value lists; JSON schema/
  file naming; model tier per agent.

## Deferred Ideas
- Birdseye synthesis agent (A4→D1: merge / spine+divergences / dead-ground+whitespace / Gate 2) — own phase.
- Vector-DB / RAG ingest + funnel-writer + copywriter — downstream Step 4.
- Off-transformation crowdfunding container-exemplar sourcing — open (D-19).
- Pre-Phase-2 plan template; full review-mining/VOC; word-choice/copy-quality analysis.
