---
status: brief
role: Per-step build brief for STEP 5 — Market Selection (→ NTP pick). Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 5
covers: Market Selection — the operator-in-the-loop ranker that stops at ranked PROVISIONAL survivors; the operator picks the NTP.
---

> **What this is:** the reading list + duties for the session that (re)builds the **Market Selection** skill. Open this, follow the pointers, build — nothing is copied, every line points into the base. **Start with §"What was already run" — that as-ran skill + its run is the highest-leverage input.** **This is the "market selector you speak with":** it ranks, it does **not** pick — STEP 5 ends at the ★ operator NTP pick.

# STEP 05 — Market Selection (→ NTP pick)

## In one line
Ranks surviving NTP (niche×transformation×product) cells under the gate order, consuming **supply-side** currencies (ad volume / spend / longevity, from funnel analysis) **and demand-side** currencies (`voc-market-signal` §1 + community heat + `gap_candidates[]`). Stops at **ranked PROVISIONAL survivors**; **the operator picks**. No COGS, no profitability — price-conditioning read only.

## ★ Start here — what was already run (highest leverage)
Read the **as-ran market-selection skill you are rebuilding** and the artifacts it actually produced, before anything else. The whole point is to improve on a thing that already ran — so understand exactly what it did and what came out.
- **The as-ran skill (rebuild target):** `pmf3/SKILL_market_selection.md` — the MVP market-selection skill that was run (parent folder; catalogued in `reference/EXTERNAL-INPUTS-MAP.md` §A). **Read this first** — you are rebuilding it better.
- **The spec behind it:** `reference/as-ran-repo/repo-files/prompts/_specs/market-selection-assessor-spec.md` — the 4-gate Assessor Agent spec; its decision procedure + resolved judgments are durable.
- **What it produced on the real run:** `reference/as-ran-repo/repo-files/runs/arduview/space-map.json` (the market-selection-filtered output — cells kept/killed, the chosen cell) + `…/_marketing-decisions/` (open decisions the run surfaced).
- **Reader's-guide to both:** `reference/as-ran-repo/asran-repo-report.md` §2b (market-selection card) + §5 (artifacts + field names).
- (Do **not** re-prosecute the as-ran wiring bugs — null `demand_trend`, `qualifying_creatives=0`; fixed upstream in R1.)

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md` → STEP 5** — the job logic (ingests space-map + `voc-market-signal` §1 + `gap_candidates[]`; ranks; emits ranked survivors → ★ operator pick).
2. **`architecture/PART3--architecture-design.md`:**
   - **§6.5** — the Market Selection card (I/O, gate inputs, refuse conditions). *The spine of the rebuild.*
   - **§5.2** — the consumption row (VOC §1 wired into Gate 1; community heat as its own axis).
   - **§7.2** — knowledge scoping for this stage (COGS deliberately excluded).
   - **§7.3** — registry slots it depends on: `bet-fit` (+ NTP similarity), `price-conditioning` (slot missing — see Open), `sophistication`, `niche`.
   - **§10 / §12** — the ○ items it must NOT invent: gate **thresholds, anti-fluke floor, currency weights, revenue's weight** — all routed to Job 4.
3. **`architecture/PART1--dependency-ordered-map.md`** — the operator annotations, by decision:
   - **D1** (VOC integration) — A6, A12, A15, A26 (A6: "the VOC needed to feed market selection is likely very different…"; A26: VOC as a demand currency).
   - **D5** (validation-currency model) — A1, A26, A27, A32, A40, P4, P7, P14, P15, P16, P22 (A40: community heat an independent axis "present before moving"; P7: revenue heavily considered; A32: currency enumeration + the aggregation doubt; P16: never-merge).
4. **`architecture/PART2--build-order-roadmap.md` → Job 4** — the validation-currency model that supplies this step's thresholds/weights/aggregation. **Gate *semantics* come from Job 4** (operator session); this build wires the I/O, Job 4 sets what clears the gate.

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0** (per-card soundness duties).
- Every load-bearing verdict carries a `grounding_ref` (a DR-law/test ID or Register rule-ID, else `UNGROUNDED`) and a `carried_risks[]` list that travels to the operator at the ★ pick.
- **MR-006** (the transformation-validation carry-field) and **MR-001** (never-merge, configurable-pending-D5) apply directly here.

## Adversarial findings this build must honor (`reference/reviews/`)
Read **`AUDIT-market.md`** in full; the load-bearing ones:
- **GAP-A1 — the #1 live finding (disclosure-carry).** An asserted/unvalidated transformation must be **forced into the ranked output + the operator NTP-pick artifact** — not buried in a `basis` string. **Mandate a `transformation_validation: asserted|voc-confirmed|both` (+ unvalidated flag) field on the pick.** (= MR-006 / PART4-L1; confirm wired — OPEN-DECISIONS B1.)
- **GAP-A2 — the Gate-1 anti-fluke floor is undefined (○ Job 4).** Don't re-instate the as-ran soft-gate-by-default; a single comparable + bet-evidence must not silently clear. Carry P7 + the 2+ floor into Job 4.
- **GAP-A3 — don't let ranking conflate UM-fit with demand magnitude** when magnitude is thin (aggregation rule ○ Job 4).
- **GAP-A8 / R2 GAP-2** — avatar-quality inputs (unsatisfied / already-have-transformation / brand-loyalty) come from VOC pass-1; ○ Job 3.
- **KEEP (do not regress):** DECISION 8 **spend-transfer / Gate 2.1b** (keep N/T/P similarity as *three separate* criteria, don't blend); and the **PROVISIONAL → operator-pick** discipline (never promote this skill from ranker to picker).
- Cross-ref **`AUDIT-reviewerB.md`** for the **$299 anchor / pricing-slot** point.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **B1 / L1** — the `transformation_validation` carry-field (confirm MR-006 captures it). **Highest-value.**
- **C1** — add the missing **pricing/anchor slot** to PART3 §7.3 (price-conditioning test).
- **L6** — the out-of-chain offer/asset scope ruling (affects what "price conditioned into this market" must cover).
- **Dependencies that are NOT this build's call:** gate thresholds/weights/floor → **Job 4** (operator session); avatar GAP-2 lanes → **Job 3**. Wire the I/O so these drop in; do not hard-code them.

## Done =
The skill ranks NTP cells from named currencies, emits **ranked PROVISIONAL survivors each carrying its evidence row + the transformation-validation flag + `carried_risks[]`**, refuses on absent VOC (when VOC active) / unknown `demand_trend`, reads price-conditioning only (no COGS), and **hands the pick to the operator** — with every threshold it can't yet set left as a wired ○ slot pointing at Job 4.
