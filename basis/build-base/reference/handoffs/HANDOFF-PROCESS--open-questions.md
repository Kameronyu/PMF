---
status: reference
role: Parked agenda for a future session that designs how the prompt-build phase runs (nothing here is implemented).
read-with:
  - architecture/PART2--build-order-roadmap.md
supersedes: []
---

> **What this is:** open questions on build-process design. **Read by:** whoever designs the build-process pass.

# Build-Process & Handoff Design — Open Questions (parked for a dedicated pass)

Captured from the operator's reflections so nothing is lost. This is NOT decided yet — it's the agenda for a session that designs *how the prompt-build phase runs*. Nothing here is implemented.

## The core problem the operator is stumped on

How should the ~10 step-prompts actually get built, given the steps depend on each other (downstream steps need upstream contracts), without (a) losing the annotations that already settled things and (b) seams between independently-built steps failing to hold.

## Models the operator floated

1. **Build each step in isolation, then one final session reads the whole thing** to do the job only possible by reading everything (e.g. confirming whose outputs get read by whom).
2. **Each build session produces an artifact that feeds the downstream build sessions** (chained).
3. Make the handoffs **now**, vs make them after the architecture is settled.

## Recommended resolution (my read — for discussion, not settled)

PART 2 already implies the answer and it's a hybrid of (1) and (2):

- PART 2's job order exists *precisely* so the cross-cutting decisions (bet definition, the determination-test registry, VOC contracts, the validation-currency model) are settled **before** the stage prompts that consume them. So prompt-building is **not** "each step in isolation" — it follows PART 2's order: settle shared contracts first, then build stage prompts against locked contracts (model 2), then a final reconciliation/seam-check pass = PART 2 Job 9 (model 1's tail).
- So the handoff design = formalizing, per job/session: **what it reads** (which slice of PART 1's annotations by decision D1–D8, which PART 3 section, which as-ran prompt, which upstream job artifacts) and **what it emits** (the contract the next sessions consume).

## Granularity-per-step: decide now or at each step's build?

- Operator leans: decide **major** agent splits now (genuinely different jobs), defer **fine** sub-splitting to each step's own build session. I agree.
- Line already drawn in PART 3: major splits ARE this session's job and are decided (slop vs coverage; architect-not-split; auditor; chief; ad-classifier vs funnel-analyzer; the 4 VOC collection agents). Fine granularity (e.g. is the funnel analyzer 1 agent or 3; is market-selection VOC 2 agents or 5) is **left open (○)** to each step's build session.
- Open question to confirm: is any *major* "genuinely different job" split still un-relitigated that must be settled before handoffs? Candidates the operator raised: Finder → query-designer + roster-judge split; market-selection VOC = many agents; copy VOC = even more agents. These are currently ○-bookmarked.

## Rules the operator proposed (to confirm in the handoff pass)

- Each step's build session should **also read that step's as-ran prompt** (ground truth for what exists). Leaning yes. `asran-repo-report.md` already distills all of them; the raw prompt adds fidelity for the stage being rebuilt.
- Don't let any session miss the annotations that settled its step → the per-session reading list must pull the relevant verbatim annotations from PART 1 by decision ID.

## What to produce in the handoff-design pass

A short packet per build session (one per PART 2 job), each stating: its goal; its reading list (PART 1 annotation IDs for its decision, PART 3 section(s), as-ran prompt(s), upstream job artifacts); the artifact it emits; the downstream sessions that consume that artifact. Plus the final reconciliation session's job (read everything, verify seams + who-reads-whom).

## Still-open items the operator flagged for later (bookmarked, not lost)

- Market-selection VOC: more than one agent (count ○).
- Copy VOC: possibly more agents than the market-selection VOC (count ○).
- Finder internal split (query design vs roster judgment) ○.
- Whether each major agent breakdown needs relitigating now vs at step-build time (leaning: later).
