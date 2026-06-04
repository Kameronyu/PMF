# Phase 2: Stage M1-S2 — Market-selection gate - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 2 — Stage M1-S2 market-selection gate
**Areas discussed:** Build target & SoT, Operator overrides, Candidate cells, S1 data reconcile (+ discrepancy flagging, kill-rule softening)

---

## Build target & source-of-truth

| Option | Description | Selected |
|--------|-------------|----------|
| Inline, spec stays master | Inline the spec's procedure into SKILL.md (runnable); assessor-spec stays editable source-of-truth | ✓ |
| One file — fold into SKILL.md | Rewrite SKILL.md as the single doc; archive the spec | |
| Thin loader | SKILL.md just points at the spec | |

**User's choice:** Inline, spec stays master. User reframed it sharply: the assessor-spec is "instructions on how to implement the skill file with pretty detailed decision-making" — NOT the skill file itself. The skill is the runnable artifact derived from the spec.
**Notes:** User pasted the full spec back and asked for any discrepancies vs the real S1 output (logged below).

## Discrepancies flagged (spec-as-written vs real S1 output)

- **`competitive_axis` → OPEN `bet_type`** — confirmed stale; Gate 2.2 body + INPUTS need rewrite, not just the reconciliation note.
- **Mechanisms-in-play cluster** — User corrected the initial framing: the Classifier (step 6) ALREADY clusters `problem_um_raw` into shared (3+) vs unique (1); `dump.json` carries `mechanism[]`/`problem_um_raw[]`. The only gap is `space-map.json` has no output slot. → thin S1 schema patch, not downstream inference.
- **`demand_trend` unknown for all 20 brands + revenue mostly null** — data-state, not schema.
- **`run_length_days`** lives in `ads/<brand>.json` per-ad array; `combos[].anti_fluke.qualifying_creatives` pre-counted (0 on run).
- **Sophistication exists twice** — per-brand string (mis-grained) vs per-cell claim counts.
- Aligned (no action): crowdfunding obj, price_points, product_observed, channel enum, per-cell saturation.

## Operator overrides

| Option | Description | Selected |
|--------|-------------|----------|
| Read from run brief, no schema | Skill reads `pre-research-plan.md` prose, maps to spec's 4 override slots | ✓ (settled by the brief itself) |

**User's choice:** Settled by inspection — the Arduview `pre-research-plan.md` already authors all 4 overrides in prose (§Supply-side validation stance + §Deferred reads). All 4 effectively SET for Arduview. Per D-13: prose, never schema.

## Candidate cells

| Option | Description | Selected |
|--------|-------------|----------|
| Evaluate all combos[] cells | Run all 6 (incl. data-nominated); comparable seeds = bet-evidence only, never candidate cells | ✓ |
| Operator-curated shortlist | Kam hands the skill a shortlist | |

**User's choice:** Run all 6 cells (re-confirmed explicitly: "no run all 6 cells"). Settled by the brief's "letting the data nominate a market is explicitly in scope."

## S1 data reconcile

### Sophistication grain
| Option | Description | Selected |
|--------|-------------|----------|
| Recompute per-cell | Gate 3 computes stage from cell's competing typed claims | ✓ (with definitional correction) |
| Trust S1's per-brand string | Roll up the per-brand string | |

**User's choice:** Recompute per-cell, with a correction: "market sophistication is not brand sophistication signal, different things. Market sophistication is how many competing offers a market experiences — specifically who is pitching similar products with the same transformation to same niche." → per-cell property, S1's per-brand string is mis-grained and not the gate input.

### demand_trend wholesale-unknown handling
| Option | Description | Selected |
|--------|-------------|----------|
| Run provisional + flag | Produce gated map off ad-longevity/crowdfunding, stamp durability UNKNOWN, lower confidence, surface "fix Trends fetch" as #1 blocker | ✓ |
| Hard-block on durability | Refuse a pick until demand_trend backfilled | |
| Treat unknown as soft-pass | Neutral, clear Gate 1 on scale alone | |

**User's choice:** Run provisional + flag.

### Mechanisms-in-play source
| Option | Description | Selected |
|--------|-------------|----------|
| Infer from typed claims + flag | Skill builds the set itself, labels [INFERENCE] | |
| Surface as DATA GAP, defer to S1 | Treat as missing input | ✓ (refined) |

**User's choice:** Refined past both options — the analysis is already done by the Classifier; the fix is a thin S1 schema patch to add the output slot. Skill consumes the field; emits DATA GAP only until the slot lands.

### Kill-rule softening (raised mid-discussion)
**User's choice:** "for the kill rules, it should just judge markets based on having more demand, or just soften the kill gates for now… because idk what the rev estimate is gonna look like." → Soft-gate mode for the debug run: kills become flags + ranking penalties, rank by relative demand, carry all cells through; re-enable hard kills once revenue + demand_trend are trustworthy.

## Claude's Discretion

- SKILL.md reconciliation mechanics, DR-KB auto-injection set + mechanism, exact rewritten Gate 2.2 / INPUTS wording.

## Deferred Ideas

- Gate 4 awareness (→ Phase 3 deep-research). Phase-1 thin patches: `mechanisms_in_play[]` slot, Trends-fetch fix, relocate per-brand sophistication. Community-heat read. `bet_type × niche × durability` crossing. Re-enable hard-kill discipline when inputs trustworthy.
</content>
