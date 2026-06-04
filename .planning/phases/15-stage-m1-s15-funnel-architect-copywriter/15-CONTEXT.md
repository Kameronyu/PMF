# Phase 15: Funnel Architect + Copywriter — Context

**Gathered:** 2026-06-04
**Status:** Ready for planning
**Source:** Operator-supplied behavior-authority specs (2) + codebase investigation (2 Sonnet agents) + operator decisions

<domain>
## Phase Boundary

Build two coupled judgment skills + the deterministic scaffolding they require, turning the deep-analysis funnel store (belief_records[] + funnel fields) into finished crowdfunding copy:

1. **Funnel Architect** (judgment agent, conversational) — reads the funnel store + deterministically-injected DR KB + operator run-context + a claim-tally, and produces a congruent funnel DESIGN + COPY BRIEF (belief chain in order, install spec per belief, single governing angle, awareness-calibrated structure, offer/urgency, dead-ground/whitespace). Behavior authority: `15-SPEC-funnel-architect.md` (verbatim, untouched).

2. **Copywriter** (judgment agent, conversational) — consumes the Architect's copy brief + per-section source-routed RAG'd verbatim and writes finished prose in the locked format. Does NOT re-decide strategy. Behavior authority: `15-SPEC-copywriter.md` (verbatim, untouched).

Both are operator-spec'd; built together so the shared copy-brief contract is designed with producer AND consumer in view.

**HARD DATA DEPENDENCY:** the funnel store is EMPTY except a synthetic fixture (`runs/_fixture/funnels/`) until a real market run. Built + verified against the fixture now; live-on-real-funnels validation rides downstream (D-02).

**Out of scope:** the birdseye synthesis agent (downstream); collecting/classifying funnels (Phase 3, done); running a real market.
</domain>

<decisions>
## Implementation Decisions (LOCKED)

### D1 — belief_kind comes from upstream
`belief_kind` (crowdfunding-specific | general-DR) is in the Architect spec's INPUT contract but ABSENT from the Phase-3 6a/6b schema. **Decision: extend the Section Analyzer schema upstream** to emit `belief_kind` per belief record. The store is fixture-only, so re-running is free. Architect reads it; does not re-derive. Update the fixture (`runs/_fixture/funnels/sample.json`) and the validator (`tools/hooks/validate-analyzer.js`) accordingly.

### D2 — source_routing: minimal fix, no per-belief field
Both specs require per-section source-routed retrieval (ship-trust fill from crowdfunding sources; general-DR fill from DTC + in-transformation crowdfunding). Today `source_type`/`routing_flag` exist only at FUNNEL level, and `funnel-vectorize.js` DROPS them from the index while `funnel-rag-query.js` filters only `belief_id`/`proof_tier`.
**Decision (minimal, elegant):**
- `funnel-vectorize.js` — carry funnel-level `source_type` (and `routing_flag`) into each indexed retrieval unit (stop dropping them).
- `funnel-rag-query.js` — add a `--source-type` (and/or `--routing-flag`) prefilter.
- The Architect's brief specifies, per section, which source gate to apply.
- **No new per-belief `source_routing` field** — a record's source is a property of its funnel; funnel-level `source_type` on the record + a query filter is sufficient. Avoids re-touching the Phase-3 schema for routing.

### D3 — Retrieval model: 2-gate + broad semantic rank (architect specifies gates, not funnels)
The Architect does NOT hand-pick funnel sections to RAG (brittle, and the Copywriter spec forbids the copywriter picking funnels). Instead:
- **The funnel store = the competitive set** (already transformation-scoped by virtue of being the analyzed set for the NTP). No extra product/transformation filter needed.
- **Per section, retrieval applies 2 gates:** (1) belief gate (`belief_id` matches the section's belief), (2) source gate (`source_type` per D2). Then **semantic rank** by the section's angle/intent string; take top-k **liberally** (~6-10).
- **Copywriter Rule 1** ("the brief's angle beats the RAG's angle, always") is the designed safeguard that makes broad retrieval safe — pull patterns/beats broadly, bend to the brief's one angle.
- **The Architect's per-section instruction is 3 fields:** `belief_id` + angle/intent string + source gate. It does NOT enumerate funnels for language.
- **Structural reference is separate:** the Architect names the specific competitor funnel(s) whose belief-ORDER/shape it models (qualitative, Currency B), distinct from language retrieval.
- Index is pre-built once per run (`funnel-vectorize.js`); the query runs per-section at copy time. The Architect never runs retrieval.

### D4 — Build the claim-tally now (moves[]-based)
Confirmed it does NOT exist (`aggregate-mechanisms-in-play.js` is a different layer — brands per mechanism, not sub-claims per funnel). **Decision: build a minimal deterministic claim-tally now**, per `15-CLAIM-TALLY-IMPL-SPEC.md`:
- Sub-claim key = `moves[]` tags (already a closed taxonomy — a move IS a typed sub-claim). No upstream schema change.
- Count DISTINCT funnels per move; dead-ground = >= threshold (default 5); whitespace = the rest.
- `_meta.low_n_warning` when store has < threshold funnels (fixture has 1).
- Output `runs/<space>/funnels/_tally.json`; injected into the Architect's context deterministically.

### D5 — DR injection is deterministic, never assumed "auto-injected"
Both specs say DR files are "auto-injected / pasted alongside" — this is the KNOWN MISLABEL that caused a zero-grounding run, because **hooks do NOT fire inside subagents.** **Decision: mirror the market-selection pattern exactly:**
- Build `tools/hooks/inject-funnel-architect-dr.js` and `tools/hooks/inject-copywriter-dr.js`, each with a HARDCODED DR-file allowlist (never from argv), path-traversal guard, `=== DR FILE: <name> ===` headers, write to a generated bundle.
- Architect bundle → `.claude/skills/funnel-architect/_dr-context.generated.md` (architect-cut: funnel-architecture, persuasion, differentiator-framework, consumer-psychology, offer-construction/pricing).
- Copywriter bundle → `.claude/skills/copywriter/_dr-context.generated.md` (craft files: `copywriting--spencer-origins.md`, `copywriting--carl-weische.md`, `copywriting--mark-builds-brands.md`; Hormozi excluded per spec).
- Each SKILL.md declares its bundle in a `## read_first` section as a mandatory pre-read (mirror `market-selection/SKILL.md`).
- The orchestrator/skill explicitly Reads the bundle; no reliance on settings-hook auto-injection.

### D6 — Both skills are conversational judgment agents
Per both specs: propose → operator pushes → revise. Not one-shot generators. Architect is deliberately KB-heavy and legible so the operator (who does not deeply know funnel architecting) can push on the reasoning. The single copywriter has no parallel fan-out.

### D7 — Reuse the already-built engine (do not rebuild)
Committed base to build ON: `tools/lib/embed.js` (Voyage embed + cosine, stub fallback), `tools/funnel-vectorize.js`, `tools/funnel-rag-query.js`, `runs/_fixture/funnels/` (verification scaffold — delete before a real run). The interim `.claude/skills/copywrite/` stub is already removed; its contract is captured in `15-COPYWRITE-WIRING-REFERENCE.md`.

### Claude's Discretion
- Exact DR-file allowlist per bundle (within the spec's named categories).
- Exact SKILL.md structure/wording, beyond the required `read_first`.
- CLI flag names where not pinned (follow `funnel-rag-query.js` / mechanism-tool conventions).
- Test/fixture scaffolding details for verification.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents (researcher, planner, executor) MUST read these before planning or implementing.**

### Behavior authority (the two specs — source of truth, verbatim)
- `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-funnel-architect.md` — Funnel Architect behavior + the OPERATOR VERIFICATION MANDATE
- `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-copywriter.md` — Copywriter behavior + the OPERATOR VERIFICATION MANDATE

### Phase-15 design artifacts
- `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-CLAIM-TALLY-IMPL-SPEC.md` — implementation-ready claim-tally spec (moves[]-based)
- `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-COPYWRITE-WIRING-REFERENCE.md` — RAG-injection wiring contract salvaged from the removed stub

### Engine to build ON (do not rebuild)
- `tools/lib/embed.js` — Voyage embed + cosine; stub fallback; the single embedding swap point
- `tools/funnel-vectorize.js` — builds `runs/<space>/funnels/_index.json` (MUST be extended to carry source_type — D2)
- `tools/funnel-rag-query.js` — structured prefilter + semantic kNN (MUST add --source-type filter — D2)
- `runs/_fixture/funnels/sample.json` + `_index.json` — verification scaffold (1 funnel, dim=1024)

### Pattern to mirror for deterministic injection (D5)
- `tools/hooks/inject-dr.js` — Section Analyzer DR bundler (the pattern)
- `tools/hooks/inject-market-selection-dr.js` — market-selection DR bundler (the pattern)
- `.claude/skills/market-selection/SKILL.md` — the `## read_first` declaration pattern
- `prompts/_generated/section-analyzer-dr-context.md` — example generated bundle

### Pattern to mirror for the claim-tally (D4)
- `tools/aggregate-mechanisms-in-play.js` — repo conventions for a deterministic tally script

### Schema + validation (D1)
- `prompts/funnel-deep-pass.md` — 6a funnel schema + 6b belief-instance schema (MUST add belief_kind)
- `tools/hooks/validate-analyzer.js` — output validator (MUST accept belief_kind)

### DR knowledge base (the fill for the bundles — D5)
- `~/knowledge/dr-marketing/` — funnel-architecture--*, persuasion--*, differentiator-framework__2_.md, consumer-psychology--*, offer-construction--*, pricing--*, copywriting--spencer-origins.md, copywriting--carl-weische.md, copywriting--mark-builds-brands.md
</canonical_refs>

<specifics>
## Specific Ideas

- The Architect→Copywriter handoff is the central contract: brief carries per section { belief_id, angle/intent, source gate, install spec, dead-ground, blocked ports }. Design it with both producer and consumer in view.
- The 2-gate retrieval (D3) is the elegant collapse of the source_routing question — belief gate + source gate + semantic rank, broad recall, congruency enforced downstream by the copywriter's Rule 1.
- Every "auto-injected" reference in both specs is a trap — the verification mandate exists because Claude has historically failed to wire injection in subagents. Plan MUST include explicit runtime-proof verification tasks (D5, D4).
</specifics>

<deferred>
## Deferred Ideas

- Birdseye synthesis agent (downstream phase).
- Live-on-real-funnels validation (rides D-02; this phase verifies against the fixture only).
- Per-belief source_routing field (rejected as redundant — D2).
- Dynamic/proportional claim-tally threshold (rejected — breaks reproducibility; low_n_warning + architect judgment instead).
</deferred>

---

*Phase: 15-stage-m1-s15-funnel-architect-copywriter*
*Context gathered: 2026-06-04*
