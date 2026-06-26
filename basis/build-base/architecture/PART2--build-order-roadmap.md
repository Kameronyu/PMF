---
status: authoritative
role: Build-order roadmap (Jobs 0-9) derived from PART1's gating.
read-with:
  - architecture/PART1--dependency-ordered-map.md
  - architecture/PART3--architecture-design.md
supersedes: []
---

> **What this is:** the work-order/sequence for the per-session builds. **Read by:** the orchestrator/operator sequencing the builds.

# PART 2 — Build-Order Roadmap

**Derived from PART 1's gating structure. Not imposed from outside.** Annotation IDs refer to PART 1, where every annotation appears verbatim. This roadmap is the work-order the Phase 3 design session and the downstream implementation passes execute against; nothing here is implemented in this session.

---

## How the order was derived

Three mechanical rules, applied to PART 1's map:

1. **A decision that gates more items resolves earlier.** D3 (determination mechanics) and D1 (VOC integration) gate the most; D4 (bet) gates everything downstream of search because the as-ran Finder builds its queries from the bet brief.
2. **No field-level contract is specced before the decision that defines its meaning.** This single rule is what demotes the contract spine from first place (see Contradictions, below).
3. **Co-design where the operator demanded co-design.** A37 requires one full session baking VOC inputs into the market-selection framework and the funnel architect together — so Jobs 2 and 3 are a dyad, not a line.

Priority signals taken from the annotations themselves: A15 ("i think VOC has to be at least drafted, but id say built") and A36 ("get a VOC system MVP down first" — before the KB mega-build) put VOC ahead of the knowledge-mechanization build. A39 ("this analysis will just come back to quality of the bet brief") puts the bet definition at the front of the research chain.

---

## The order of work

### Job 0 — Settled edits + diagnostics (independent; start immediately, parallel-safe)

**What it resolves.** Everything in PART 1 §10 that no boulder gates.

- **Settled edits (spec-level, small):** remove COGS and profitability from market selection — price-conditioning read only (A29, A40, P3); cut winning-angle determination from the light pass scope (A39); enforce the basic awareness contract — deep pass produces it, nothing downstream invents it (A3, A4).
- **Diagnostics (evidence for the decision sessions):** the data-insufficiency investigation — wiring vs query generation, starting from the reviewers' finding that `demand_trend` never reached the delivered space-map (A22, P9); the transformation-misclassification post-mortem (A24, A13); whether the section analyzer consumed the per-brand validation outputs (P15); document what the orchestration actually did in the Arduview run (A39) and how funnels were actually packaged (A41).

**Clears:** A2 (closed), A24, A29, P3, P9, P15, the actionable parts of A3/A4/A22/A39/A40/A41.
**Unblocks:** Jobs 1–4 start with evidence instead of suspicion; D7 gets a current-state orchestration map.

### Job 1 — Bet & pre-research definition session (resolves D4)

**What it resolves.** What a bet is; the pre-research hypothesis output contract; where the pre-market-research skill sits; N/T/P-similarity controls evaluated separately with their own criteria; functional-mechanism equivalence as the unit of bet-evidence comparison (P19); the structural-deliverability basis (P10); how bet evidence relates to cell membership and saturation (A23).
**Clears:** A38, P6, P19, A20 (bet part), A23, A30 (transfer part), P8, P10, A39 (bet part), P1 (calibration sentence), A22 (query-generation root cause, with Job 0's findings).
**Unblocks:** light-pass revision (query generation inherits the brief), space-classifier comparable-bet/cell logic, the bet-evidence lane of Job 4, the `bet_type` emission contract in Job 5.
**Why first among the decision sessions:** it is upstream-most — every downstream artifact inherits the brief — and it does not depend on Jobs 2–4.

### Job 2 — Determination mechanics + definitions revision (resolves D2 + D3) — co-designed with Job 3

**What it resolves.** The transformation-source policy, rendered as a written rule (the operator has already settled direction: derivable from competition when inputs and analysis are mechanical — P5, P20, A31, P2); then the full test inventory: per classified property, named inputs + mechanical test + evidence wiring (mechanism vs feature with believability gate, niche venue/reading tests, claim typing, trend/durability, proven demand, congruency, angle taxonomy, belief/idea-unit granularity); then the `definitions.md` revision (P18, P12).
**Clears:** A5, A7–A11, A13, A14, A16–A19, A21, A25–A28, A31, A33, P1, P2, P5, P11–P13 (test part), P17 (test part), P18, P20, A37 (test parts), A15 (niche-axes part).
**Unblocks:** every stage revision in Job 7; the chief's checks in Job 8; the new-jobs question P1 raises feeds Job 6's topology; VOC output requirements for Job 3.

### Job 3 — VOC integration design (resolves D1) — co-designed with Job 2

**What it resolves.** The two (or more) VOC products and their consumers: market-selection-grade signal (demand gates, community heat, niche study axes per A15, whitespace-vs-scary policy — the operator's reserved marketing call in A6) and funnel/copy-grade language (beliefs, awareness evidence per D6, the copywriter's RAG bank). I/O contracts for each; how the half-built collection engine's outputs (`handoff-step3-voc-build.md`, which deliberately stops at the copy bank) map onto those contracts; then the modded adversarial review of the integration design (A6).
**Clears:** A6, A12, A15, A37 (session demand), P21, A11 (threshold contract), A26 (demand-side feed), A43 (VOC-awareness part), the open half of D6.
**Unblocks:** market-selection revision, funnel-architect input set, Job 4's VOC currency lane, Job 8's RAG bank, finishing the VOC build itself.
**Sequencing note.** The collection-engine build (the existing VOC spec) can proceed in parallel once this job fixes its output contracts; the operator's priority signal (A15, A36) says get this moving before the knowledge-mechanization pass.

### Job 4 — Validation-currency model (resolves D5; consumes Jobs 1 + 3)

**What it resolves.** The currency enumeration (A32's list as the seed); per-currency validation mechanics and thresholds; angle- and component-level validation speccing; the aggregation question (A32 doubts angle types aggregate numerically — that doubt has I/O-contract consequences); crowdfunding/DTC unification including the deposit-funnel's standing and the trust-skew (A43, P22); the never-merge challenge resolved against the KB (P16); community heat as an independent axis (A40, P4); revenue's weight (P7).
**Clears:** A1, A26, A27 (currency side), A32, A40 (community-heat part), A43 (currency part), P4, P7, P14, P15, P16, P22.
**Unblocks:** the market-selection demand-gate rewrite, the `scored.json`/validation contracts in Job 5, the architect's authority-model rewrite in Job 7.

### Job 5 — Contract spine (the seams, now derivable)

**What it resolves.** Seam-by-seam I/O for the whole pipeline, written from Jobs 1–4's outputs: the space-map emission contract (demand_trend, bet_type, sophistication stage actually emitted — the reviewers found all three missing as delivered); beliefs/scored contracts including verbatim-extraction granularity (A42) and structured single-idea classification (A37); the awareness field contract (A3/A4 + Job 3's evidence rule); the funnel-package contract — 1 LP + 1 PDP, link-path verification, same-brand rule (A41); the information-hygiene rule applied at every seam (A40); aggregation contracts (A32).
**Clears:** the field-level residue of A19, A30, A37, A41, A42, P12, and the reviewer-found field gaps the operator annotated around.
**Unblocks:** Job 7's stage revisions against locked seams — the reference roadmap's original intent, now in its correct position.

### Job 6 — Agent topology + knowledge-scoping spec + orchestration design (resolves D7; Phase 3 produces the recommendation)

**What it resolves.** Which agents exist (named splits: slop-checker vs brand-missing checker per A39; copy chief per A35; awareness analyzer and funnel auditor as open calls per A43; line-reader per P17 — each recommended-and-vetoable in Phase 3); per-agent knowledge scope with the theory-vs-rules placement A36 specifies; clean-input layer; deterministic orchestration (one command, declared inputs, scripts between agent calls — A39). The output is the spec the downstream coding pass (the operator's planned KB-mechanization pass) implements.
**Clears:** A16 (operator-in-loop option), A20 (input analysis), A34 (loop topology), A36, A39 (orchestration/splits), A42 (DR allocation), A43 (split/auditor calls), P17 (agent option), A40 (hygiene rule instantiated).
**Unblocks:** the mechanization coding pass; Job 7's per-prompt revisions.

### Job 7 — Stage revisions in data-flow order, against locked seams

Light pass → space classifier → market selection → funnel deep pass (router + section analyzer) → funnel architect. Each revision consumes: its locked seam (Job 5), its knowledge scope (Job 6), its tests (Job 2), its currencies (Job 4), its VOC feeds (Job 3). This is where the reference shape's "revise each agent in data-flow order" survives intact.
**Clears:** the long tail of stage-level items at each stage (A1's currency-naming in prompts, A8/A14's venue test placement, A9's in/exclusion implementation, mechanism re-typing per A16–A19, P11's niche-reading, A28's differentiator rule as implemented).

### Job 8 — Copywriter + copy chief build (resolves D8)

Build the copywriter to `15-SPEC-copywriter.md`; build the chiefing pipeline (per-line belief-install test, greased-slide next-thought loop, readability gate — A35, A34, P13). Gates honored: architect output real (Job 7), VOC copy bank exists (Job 3 → VOC build), test patterns exist (Job 2).
**Clears:** A34, A35, P13.

### Job 9 — End-to-end reconciliation + adversarial re-review

Verify every seam held across independently revised stages; re-run the audit machinery (the pipeline-audit skill exists in-repo) in the modded form the operator requested for the VOC integration (A6), extended to the revised pipeline. The reference shape's reconciliation pass survives, with the re-review added.

---

## Where this order contradicts the reference shape (findings, per the handoff)

1. **The contract spine is not first — it is Job 5.** The reference sketch locked the I/O spine before revising stages. The annotations show the seams are *functions of open decisions* (awareness evidence, validation contracts, bet_type, demand fields, VOC feeds). Locking the spine first would re-freeze exactly the contracts the annotations dispute. This is the largest divergence, and it is a finding, not an error.
2. **Two first-class jobs the reference never named:** the bet/pre-research definition (Job 1) and the determination-mechanics/definitions revision (Job 2). Together they absorb the largest share of annotations — the reference shape had no slot for either.
3. **"Validation-economics reasoning" survives but grew.** It is now a full currency model (Job 4) that *consumes* the bet decision and the VOC decision rather than running as an independent side track.
4. **"New-data-currency collection" dissolves** into Job 3 (VOC supplies the new currencies) and Job 4 (the model that prices them); it no longer stands alone.
5. **"Copywriter once the architect's output is real" survives, with two added gates:** the VOC copy bank and the chiefing spec (Job 8).
6. **Jobs 2 and 3 are a co-design dyad, not sequential steps** — A37's "one full session" demand replaces any linear ordering between determination mechanics and VOC integration.
7. **Reconciliation survives, extended** with the operator-requested modded adversarial re-review (Job 9).

---

## Scope line

This session stops here, per the handoff: judgment captured and depth-sorted (PART 1), dependency map built (PART 1), build order derived (PART 2). No skills built, no code wired, no KB mechanized, no files cleaned. **Next step:** hand PART 1 + PART 2 to a fresh Phase 3 session for the architecture and strategy design; its outputs then feed the implementation passes in the order above.
