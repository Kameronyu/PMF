# Phase 1: Stage M1-S1 — Light pass - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-03
**Phase:** 1 — Stage M1-S1 (Light pass)
**Areas discussed:** KB injection mechanism, Data-point qualification, Useless-info discipline, Session scope, Web traffic

---

## Framing (user, upfront)
The research engine splits into Agent 1 = researcher/collector (Phase 1 — labels, never decides; needs definitional/classification knowledge) and Agent 2 = assessor/decider (Phase 2 skill — needs decision-procedure knowledge). Same KB, different cut. Failure to avoid: InkLeaf Phase 1 misapplied definitions + emitted useless info.

## KB Injection Mechanism

| Option | Selected |
|--------|----------|
| Inline distilled key per agent | (superseded) |
| Read-file pointer | |
| Separate classification-key doc | |

**User's reframe:** Don't add noise. Question was whether KB knowledge helps write better prompts for the *existing* spec'd outputs — biggest concern: how to *mechanically* determine sophistication. Decision-procedure KB is for the Phase 2 skill (user wires that himself), not Phase 1.

**Resolution:** Touch-up not rewrite (D-01/D-02). Existing prompt already fixes InkLeaf structural bugs. One load-bearing gap: sophistication has no mechanical procedure. Inline it (D-03/D-04). Awareness gap dissolved — see below.

## Sophistication test

| Option | Selected |
|--------|----------|
| Yes, that's the test — inline it | ✓ |
| Adjust the tier mapping | |
| Add the angle/trust layers too | |

**User's choice:** Inline the claim_type-distribution→stage ladder (stage = highest tier 2+ live brands occupy = differentiation floor). User's frame: sophistication = "what you'll need to look more impressive than your competition, to out-persuade them and win buyers."

## Awareness (light pass)

| Option | Selected |
|--------|----------|
| Drop it from light pass | ✓ |
| Keep it, inferred-only | |

**User's choice:** Drop. Confirmed awareness never rolls into space-map.json and brands span stages — not decision-useful for the map. Real awareness read = Phase 2 funnel deep-dive.

## Data-point qualification — revenue floor

| Option | Selected |
|--------|----------|
| Attach as data, don't gate in Phase 1 | ✓ |
| Soft-gate: flag below-floor, keep | |
| Hard-gate the roster on it | |

**User's choice:** Attach, don't gate. "I need this product regardless; the gate is which is most promising on competitor revenue — so the gate can't be hard, but it IS data collected and used to decide. The gate goes in the skill."

## Data-point qualification — live-status + ad-attribution

| Option | Selected |
|--------|----------|
| Hard-gate both | |
| Flag, don't drop | ✓ |

**User's choice:** Flag, don't drop.

## Region-only brands

| Option | Selected |
|--------|----------|
| Keep but flag region-only | ✓ |
| Drop if no Western presence | |
| Keep all, no special handling | |

**User's choice:** Flag region-only + old/dead things. Gave the full lens-split rule: Pass 1 (validation/Gate 1) excludes dead + regional from the count (living/scaling/in-geo only — counting a corpse as a heartbeat corrupts the demand proof); Pass 2 re-files them by lens (dead = post-mortem + uncontested-angle archive after classifying cause of death; regional = channel-edge file). The one mistake to avoid: dead brands' old claims inflating live saturation count. → D-08.

## Web traffic (SimilarWeb)

| Option | Selected |
|--------|----------|
| Manual paste now, swappable | (evolved) |
| Try to solve auto-fetch now | |
| Investigate in parallel (Sonnet subagent) | ✓ |

**Investigation result:** No free SimilarWeb API. Best swap = Semrush Trends API (returns monthly_visits, documented endpoint, free tier ~10/day, ±20–40%). SpyFu $89/mo fallback. Auto-browser SimilarWeb = ban risk.

**User's final call:** Use Semrush + multiple logins to clear the rate limit. Implementer wires the multi-login as they build it — not fully specced now. → D-11.

## Session scope

| Option | Selected |
|--------|----------|
| Phase 1 CONTEXT only | ✓ |
| Phase 1 CONTEXT + write the skill too | |
| Just reconcile + run, skip CONTEXT | |

**User's choice:** Phase 1 only. Goal = light pass running as fully-built prompts → clean structured research output. Hand off plan for "up to the structured research run" → plan → build. Skill built in a parallel session while the light pass runs; output-formatting is yet another session (M1-S12).

## Claude's Discretion
- Reconciliation mechanics, exact prompt wording, hook-JSON details, brick-call grouping.

## Deferred Ideas
- Phase 2 market-selection skill (demand gate + dead/regional lenses).
- Deliverable formatting/templating (M1-S12).
- Semrush multi-login wiring (Phase 1 implementer).
- Per-agent negative-example expansion (revisit only if debug run shows layer conflation).
</content>
