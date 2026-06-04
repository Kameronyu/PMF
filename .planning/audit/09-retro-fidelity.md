# 09 — Retro Fidelity Check

**Date:** 2026-06-04
**Scope:** Marketing signal (Bucket B) only — agentic/engineering items out of scope.
**Method:** Source retro(s) → decisions file. Each Bucket B item: PRESENT / MISSING / DISTORTED.
**Cross-ref:** `03-retro-triage.md` for original Bucket B classification.

---

## Stage 1 — Light Pass

**Source:** `01-DEBUG-RUN-NOTES.md`
**Decisions:** `runs/arduview/_marketing-decisions/light-pass.md`
**Triage Bucket B count (03-retro-triage):** 1 item (B1)

| # | Signal | Status | Notes |
|---|--------|--------|-------|
| B1 | Gadget/maker pages don't run pain-causal framing; `mechanism[]` is the usable signal, `problem_um_raw` structurally absent — pain-led copy frameworks are a category error for this product | **PRESENT** | Faithfully distilled. Decisions file renders this as the mechanism-vs-transformation framing call and flags the pain-led framework risk. |

**Verdict: CLEAN.** The single Bucket B item is faithfully present.

---

## Stage 3 — Deep Funnel Pass

**Sources:** `03-DEBUG-RUN-NOTES.md` (Task 3 belief-tagging section) + `agents/funnel-deep-pass-run-notes.md`
**Decisions:** `runs/arduview/_marketing-decisions/deep-funnel-pass.md`
**Triage Bucket B count:** 0 items in Phase 03 row; 0 items in agents/funnel-deep-pass-run-notes.md (that file is all-agentic run-notes)

Both source files are entirely agentic:

- `03-DEBUG-RUN-NOTES.md` — the Task 3 belief-tagging section is a deferred stub ("DEFERRED — TO BE FILLED after the first real methodology-debug run"). No marketing judgments were written; it's pending Kam. Triage confirmed: 0 Bucket B items.
- `agents/funnel-deep-pass-run-notes.md` — sections 1–8 are all pipeline mechanics (stub package format, Divoom HTML size, crowdfunding_stats field names, funnel-score.js input routing, Section Analyzer context injection, KS 404 fallback, funnel_fields persistence bug). No marketing content. Triage table confirms this source was not classified separately (no row for it).

The decisions file *does* contain six open marketing calls (belief-tagging not validated; funnel-level fields null; GameShell secondary-source credibility; competitors had zero Meta ads). These came from the funnel-architect debug retro (15-DEBUG), not from the Stage 3 retro sources. They were placed in `deep-funnel-pass.md` because they are *about* the deep-pass outputs, but their source is the funnel architect's retrospective.

**Verdict: CLEAN** for the assigned source files (both are 0-Bucket-B). No marketing signal existed to drop. The decisions file's content is forward-attributed from a later stage and is bonus, not a distortion.

---

## Stage 15 — Funnel Architect

**Source:** `runs/arduview/15-DEBUG-funnel-architect.md`
**Decisions:** `runs/arduview/_marketing-decisions/funnel-architect-copywriter.md`
**Triage Bucket B count:** 6 items (B1–B6)

| # | Signal | Status | Notes |
|---|--------|--------|-------|
| B1 | Validation economics absent — ad-longevity/spend per angle; message selection was reputation-driven, not spend-validated | **PRESENT** | Decisions file: "No validation economics — message selection was reputation-driven, not spend-validated." Exact match. |
| B2 | No VOC — belief chain built on asserted transformation, not buyer language; Spencer's Command+F unrunnable | **PRESENT** | Decisions file: "No VOC — the belief chain sits on asserted transformation, not buyer language." Explicit mention of Command+F ceiling. |
| B3 | Awareness_entry null for all 4 comps — architect inferred from comp opening structure; "structure follows awareness" was guesswork | **PRESENT** | Decisions file: "Awareness field was null — architect inferred from comp opening structure instead of a stored read." |
| B4 | Funnel-level shape fields (funnel_sequence, offer_mechanic, urgency_construction) null for all 4 comps — architect drew structural refs from non-competitive sources | **PRESENT** | Decisions file: "Funnel-level shape fields were null for all four competitors." |
| B5 | DR bundle split (architect vs. copywriter) is role-based, not situation-based; brief-level hook/claim craft (hook construction, claim-typing, Mark's necessary-beliefs) was architect-relevant but excluded from architect's bundle | **PRESENT** | Decisions file: "DR bundle split (architect vs. copywriter) is role-based, not situation-based." |
| B6 | Pain-led DR framework loaded for a desire-driven product — irrelevant and anchoring risk | **PRESENT** | Decisions file: "Pain-led DR framework applied to a desire-driven product." Explicit. |

Additionally the triage surfaced two Phase 15 Bucket B items (B1: crowdfunding vs. general DR belief_kind distinction; B2: claim-tally primary key / saturation granularity; B3: locked DR file list; B4: structural vs. language retrieval conflation; B5: funnel-level shape null) from the Phase 15 RESEARCH.md/SUMMARY source, not the 15-DEBUG source. Checking these against the decisions file:

| Triage ref | Signal | Status |
|---|---|---|
| Ph15-B1 | Crowdfunding-specific vs. general-DR belief_kind missing | **PRESENT** — "Crowdfunding vs. general DR — the belief type distinction was never drawn." |
| Ph15-B2 | Primary key for saturated vs. ownable moves undefined | **PRESENT** — "No defined primary key for saturated vs. ownable persuasive moves." |
| Ph15-B3 | DR file allowlist for architect undefined | **PRESENT** — "Which DR files the funnel architect actually operates on was undefined." |
| Ph15-B4 | Structural reference conflated with language retrieval | **PRESENT** — "Structural reference (belief-order modeling) was conflated with copy-language retrieval." |
| Ph15-B5 | Funnel-level shape null (same as 15-DEBUG B4) | **PRESENT** — duplicate, both hits covered. |

**Verdict: CLEAN.** All 6 Bucket B items from 15-DEBUG, and all 5 from Phase 15 build sources, are present and faithfully distilled.

---

## Stage 15 — Copywriter

**Question: does a copywriter retro exist?**

No dedicated copywriter retrospective file exists. Checked:
- `runs/arduview/COPY-DRAFT.md` — copy prose + a "Build notes" section (§Build notes, lines 179–206). The build notes cover layout mechanics (fold budget, nav, video placement, price leak fixes) and explicitly scoped-out feedback ("Rejected: messaging overrides by non-marketers"). This is a build handoff note, not a retrospective. No agentic break analysis, no marketing-signal audit, no Bucket B items.
- `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/` — contains PLAN files, SUMMARY files, specs, and wiring references. No copywriter DEBUG or run-notes file.
- No `*copywriter*debug*`, `*copy*retro*`, or `*COPY*NOTES*` files anywhere in `runs/arduview/`.

The copywriter ran inside the same Phase 15 session as the funnel architect. Its retrospective signal was captured from the architect's seat (`15-DEBUG-funnel-architect.md`, especially the "What I observed about DR-knowledge selection" section and the "Session-process retrospective"). The triage (`03-retro-triage`) classified two BUILD-FEEDBACK.md items as Bucket B (B1: hero headline black-on-black contrast; B2: fold budget / element ordering unspecified in copy brief). Both are in scope for `funnel-architect-copywriter.md`:

| Build-feedback Bucket B | Status |
|---|---|
| B1: Hero headline highlight black-on-black (STYLE-LOCK.md missing context-aware accent rules) | **MISSING** from decisions file. This is a marketing-adjacent copy-delivery problem (the headline that carries the primary claim was invisible on dark backgrounds) — not pure CSS. |
| B2: LP fold budget / element ordering per breakpoint not specified in copy brief | **MISSING** from decisions file. The copy brief specifies what to say but not page-fold budgets; corrected mid-build via feedback. |

**Verdict: 2 MISSING** (from BUILD-FEEDBACK.md Bucket B). No standalone copywriter retro exists.

- MISSING-1: Contrast failure on the primary headline ("see right through" rendered black-on-black) — style spec has no context-aware accent rule. Affects the load-bearing claim delivery.
- MISSING-2: Copy brief has no fold-budget / above-fold element ordering per breakpoint — this drove mid-build correction loops.

---

## Summary

| Stage | Source Bucket B count | Verdict |
|---|---|---|
| Light pass | 1 | **CLEAN** |
| Deep funnel pass | 0 (sources are 0-B) | **CLEAN** (nothing to distill) |
| Funnel architect | 11 (6 from 15-DEBUG + 5 from Ph15 build) | **CLEAN** |
| Copywriter | No dedicated retro exists. 2 B-items from BUILD-FEEDBACK missing from decisions file. | **2 MISSING** |

**Copywriter retro:** Does not exist as a standalone file. Signal captured piecemeal via BUILD-FEEDBACK.md and the architect's session retro. Two marketing-relevant items from BUILD-FEEDBACK were not carried into the decisions file.
