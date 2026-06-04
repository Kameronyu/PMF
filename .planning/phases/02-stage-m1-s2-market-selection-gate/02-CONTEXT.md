# Phase 2: Stage M1-S2 — Market-selection gate - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the **decision half** of Track A: bring the stale `.claude/skills/market-selection/SKILL.md`
in line with the authoritative `prompts/_specs/market-selection-assessor-spec.md`, reconcile its
input contract to the **current** S1 output (the real Arduview run), and make it runnable.

```
space-map.json / brands.json / ads/*.json  +  runs/<space>/pre-research-plan.md (run-context)
        → [4-gate assessor skill: Gate 1 Demand → 2 Product → 3 Sophistication → (4 Awareness DEFERRED)]
        → runs/<space>/market-selection.md  (ranked PROVISIONAL survivors + per-cell gate records + flags)
        → human bet pick (D1)
```

It **DECIDES** (kill/survive/rank) over already-labeled S1 data. It does **not** collect, re-research,
or re-label (that is S1). It is an **A4 (synthesize) brick feeding a D1 (decide) human** — stops at the
ranked survivor list; never writes "we should test X."

**Out of scope this phase:**
- Gate 4 (awareness) — deferred to the deep-research step (D-05 from Phase 1; S1 emits no awareness tag).
- Step 3 deep competitive analysis (Phase 3) — the assessor only ranks which cells to study deeply.
- Fixing the S1 Google Trends fetch / the `mechanisms_in_play[]` schema slot — those are thin Phase-1
  patches noted as cross-phase dependencies, not built here.

</domain>

<decisions>
## Implementation Decisions

### Build target & source-of-truth
- **D-01:** `prompts/_specs/market-selection-assessor-spec.md` is the **MASTER** — it is the
  implementation/decision-making instructions (the four gates, the marketing knowledge, the resolved
  judgments), **not** the runnable skill itself. `.claude/skills/market-selection/SKILL.md` is the
  **runnable artifact built FROM the spec**: the spec's procedure is inlined into SKILL.md so it
  executes when invoked, and SKILL.md carries a header — *"Derived from
  prompts/_specs/market-selection-assessor-spec.md — edit the spec, regenerate this."* The current
  SKILL.md is **stale** (full Gate-4 awareness, no `demand_trend`/`bet_type`) and is rewritten to
  match the spec + the reconciled input contract below. Spec stays source-of-truth in the hierarchy.

### Input contract — reconcile the spec to the CURRENT S1 output
- **D-02 (`competitive_axis` → OPEN `bet_type`):** Rewrite Gate 2.2 **and** the spec's INPUTS block to
  read the OPEN `bet_type` + `bet_type_basis` the Classifier named (`per_brand[]` in `space-map.json`).
  **Drop** the dead closed enum `competitive_axis (function-capability-price | visual-statement |
  community-openness)` and its enum-worded worked example (amend-D-12). Gate 2.2 reasons over whatever
  bet the classifier named, not a fixed enum. (The spec's reconciliation note flags this; the Gate-2.2
  **body** must actually be rewritten, not just noted.)
- **D-03 (scale-gate wiring to real files):** Gate 1.1 reads the real shapes:
  - **Signal 1 — revenue:** `revenue_est.{value_usd_monthly, method, confidence}` (brands.json). Aligned;
    mostly `null` on the Arduview run — weight by method/confidence, distrust `review_proxy`/`low`.
  - **Signal 2 — ad longevity:** per-ad `ads[]` array in `ads/<brand>.json`
    (`library_id/start_date/end_date/run_length_days/text`), **not** space-map.
    `combos[].anti_fluke.qualifying_creatives` is **pre-counted** (came back **0** on this run — no ad
    cleared 7+ days). brands.json carries per-brand `ads_flag`.
  - **Signal 3 — crowdfunding:** `crowdfunding.{platform, raised, pct_funded, status}` (brands.json).
    Aligned, no change.
  - **Aligned / no action:** `price_points`, `product_observed`, `channel` (dtc/marketplace/crowdfunding),
    per-cell `saturation[]` + `combos[].anti_fluke`, `comparable_bet_seed` exclusion, `demand_trend` shape.

### Market sophistication (Gate 3) — per-CELL, recompute
- **D-04:** Market sophistication is a **per-CELL** property — *how many competing offers pitch the same
  transformation to the same niche* — **NOT a brand attribute**. Gate 3 derives the stage from the
  cell's competing typed claims (`combos[].claim_count` / `enhanced_claim_count` / `claims[].type`) per
  the spec's mechanical rule (stage = highest `claim_type` tier 2+ live in-geo brands deploy in the
  cell). S1's `per_brand[].sophistication` **string is mis-grained and is NOT the gate input** (cross-
  check only; flag disagreement).
  - *Phase-1 cleanup note (cross-phase, not built here):* S1 attaches a cell-level measure to brand
    records — relocate `sophistication` to the cell in a future S1 revision.

### Mechanisms-in-play (Gate 2.2 + Gate 3.3-S3) — thin S1 schema patch, skill consumes
- **D-05:** The shared-vs-unique mechanism cluster the gates need is **already computed** by the
  Classifier (`prompts/step1-light-pass.md` step 6: cluster `problem_um_raw`, 3+ brands = SHARED/not-
  ownable, 1 = candidate Problem-UM) — it just has **no output slot** in `space-map.json`. Fix = a
  **thin S1 schema patch**: add `mechanisms_in_play[]` (each: mechanism/story, `brand_count`,
  `shared|unique`) so the Classifier writes what it already clusters. **Source = `mechanism[]`** (rich,
  30/36 pitches non-empty), **not `problem_um_raw`** (sparse, 6/36, correct-for-space). Once the field
  exists, Phase 2's skill CONSUMES it directly. **No re-fetch / no research — schema + re-aggregate only.**
  - **The real structural fix is specced in** `01-DEBUG-RUN-NOTES.md` **BREAK 5** (folds into the same S1
    revision as the Trends fix). Cross-phase dependency — a small Phase-1 add, NOT built in Phase 2.
  - **Stopgap until the slot lands:** the skill reads
    `.claude/skills/market-selection/mechanisms-in-play-stopgap.md` and **derives** the shared-vs-unique
    read on the fly from the recorded per-pitch `mechanism[]` in the dumps, labeled `[INFERENCE]`. It does
    **NOT** emit a bare `DATA GAP` and skip the check — the raw material is present, so it derives + flags.

### Operator overrides — read from the run brief, no schema
- **D-06:** The assessor reads the run's `pre-research-plan.md` (the bet brief) as **run-context** and
  maps its prose §"Supply-side validation stance" + §"Deferred reads" onto the spec's 4 override slots.
  Per Phase-1 D-13: **prose, never schema, never hook-validated.** For the **Arduview run, all four are
  effectively SET**: (1) one-comparable → PASS-to-a-DRY-TEST only (never to MOQ/commitment); (2)
  community-heat → do not auto-kill thin maker-niche spend, flag for the separate deferred read; (3)
  durability-load-bearing → spiked-and-died = WARNING, weight parabolic-spike harder; (4) demand-type →
  belonging/identity/status is legitimate demand, read intensity off community heat not pain severity.
  If a run supplies no brief override stance, the skill runs generic **and FLAGS that it ran without
  overrides**.

### Candidate cells — evaluate all of them
- **D-07:** The assessor evaluates **EVERY cell in `combos[]`** (all 6 on the Arduview run, including any
  data-nominated cluster the brief invited) — **no pre-curated shortlist**. `comparable_bet_seed` brands
  (Nothing Phone / Flipper Zero / Arduboy / etc.) stay **BET-EVIDENCE only** and **never become
  candidate cells** (cross-category; excluded from per-cell saturation per D-08). They answer the bet's
  durability question, not a cell's saturation.

### Soft-gate mode (first/debug run) + demand_trend dark
- **D-08 (soften the kill gates, for now):** For the first/debug run, **kills become flags + ranking
  penalties, not eliminations.** The gates still run in fixed order and produce per-gate verdicts, but
  cells are **RANKED by relative demand** rather than hard-killed on an absolute floor — because
  `revenue_est` is mostly null/unreliable and the operator does not yet know what it will look like.
  **All cells are carried through** to the ranked output. **Hard-kill discipline RE-ENABLES** once
  `revenue_est` + `demand_trend` inputs are trustworthy. Rationale: hard kills on unreliable inputs
  would either nuke every cell or fire arbitrarily; "first run = debug pass."
- **D-09 (`demand_trend` wholesale unknown):** `demand_trend` is `unknown` for all 20 brands and revenue
  mostly null (the Trends fetch didn't populate). The skill **RUNS PROVISIONAL**: produce the full gated
  map off ad-longevity + crowdfunding signals, **stamp every cell "durability UNKNOWN — Gate 1 cannot
  clear with confidence," lower confidence**, and surface **"fix the Trends fetch (Phase 1)" as the #1
  blocker** before any committed bet pick. Matches the spec ("say so, lower confidence, do not silently
  proceed") and D-08.

### Output + role
- **D-10:** Output = a ranked **PROVISIONAL** survivor set (Gates 1–3 run; Gate 4 awareness DEFERRED per
  D-05) with per-cell gate records, evidence citations (cite the count/claim/trend/axis behind every
  call — no verdict without its datum), and all flags, written to `runs/<space>/market-selection.md`.
  `[INFERENCE]`-fence any AI read (stage, intensity proxy). The skill **STOPS** at the ranked survivors +
  per-cell synthesis; **Kam makes the bet pick** (D1).

### Claude's Discretion
- SKILL.md reconciliation mechanics — how the spec's procedure physically inlines, where the input-
  contract wiring sits, the "derived-from" header format.
- Which DR-KB files auto-inject as supporting knowledge (the assessor-cut set the spec names) and the
  injection mechanism (hook / read_first).
- Exact prose wording of the rewritten Gate 2.2 and the reconciled INPUTS block.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The procedure (MASTER) + the build target
- `prompts/_specs/market-selection-assessor-spec.md` — **AUTHORITATIVE** four-gate decision procedure,
  marketing knowledge, resolved judgments, operator-overrides menu, standing biases, output form. The
  spec to inline. Carries a reconciliation note (bottom) on the stale `competitive_axis` field.
- `.claude/skills/market-selection/SKILL.md` — the **build target** (currently STALE: full Gate-4
  awareness, no `demand_trend`/`bet_type`). Bring in line with the spec + reconciled contract.
- `.claude/skills/market-selection/mechanisms-in-play-stopgap.md` — **read at decision-time** until the
  S1 `mechanisms_in_play[]` slot lands (D-05): how to derive the shared-vs-unique mechanism read from the
  recorded per-pitch `mechanism[]`, labeled `[INFERENCE]`.
- `prompts/_specs/market-selection-framework.md` — older framework, **superseded** by the assessor spec.

### Upstream producer — the REAL input contract (read the actual shapes)
- `prompts/step1-light-pass.md` — S1 spec; its current schema IS the input contract. Step 6 = the
  `problem_um_raw` shared-vs-unique clustering (D-05).
- `space-map.json` (Arduview run output) — `combos[]` (per-cell: `claim_count`, `enhanced_claim_count`,
  `claims[].type`, `anti_fluke`), `per_brand[]` (`bet_type`, `bet_type_basis`, `demand_trend`,
  `sophistication`, `comparable_bet_seed`), `saturation[]`, `transformations[]`/`niches[]`/`bet_types[]`.
  **No `mechanisms_in_play[]` slot yet (D-05).**
- `brands.json` — `{starting_point, brands[], dropped[]}`; per-brand `revenue_est`, `price_points`,
  `product_observed`, `channel`, `ads_flag`, `crowdfunding`, `demand_trend`, `status`, `market_presence`.
- `ads/<brand>.json` — per-ad `ads[]` (`library_id/start_date/end_date/run_length_days/text`) +
  `active_ad_count` (Gate 1.1 signal-2 source, D-03).

### Run-context (operator overrides source)
- `runs/arduview/pre-research-plan.md` — the bet brief; §"Supply-side validation stance" + §"Deferred
  reads" carry the 4 operator overrides as prose (D-06). `prompts/_templates/pre-research-plan.template.md`
  is the generic template.

### Vocabulary + brick law + prior decisions
- `definitions.md` — sophistication stages + Stage→required-lever matrix + 5+ rule; Claim / Enhanced
  claim; UM sub-types; Niche / Transformation / Market. Gate 3 + Gate 2 trace here.
- `workflow.md` Step 0 — the gap variables (Desire · D2C Feasibility · Sophistication · Growth) the gates unroll.
- `capability_inventory.md` — brick model; the A4-synthesize → D1-human adjacency rule (locked #10).
- `CLAUDE.md` (PMF) — one-job-per-brick; Step vs Stage naming.
- `.planning/phases/01-stage-m1-s1-light-pass/01-CONTEXT.md` — Phase-1 locks this phase inherits:
  amend-D-12 (OPEN `bet_type`), D-05 (awareness dropped → Gate 4 deferred), D-08/D-19 (per-cell
  saturation, anti-fluke floor, comparable-seed exclusion), D-09 (revenue floor is Phase 2's call),
  D-13 (bet brief = prose run-context), D-20 (structured per-ad records).

### DR-marketing KB — assessor-cut supporting knowledge (auto-inject at skill invocation, per spec)
> The spec names these by role; wire the assessor-cut set. Build-time provenance for the gate logic.
- `~/knowledge/dr-marketing/consumer-psychology--carl-weische.md` — sophistication-stage + awareness-stage
  tables + Mass Desire core drivers (belonging/status = legitimate demand — grounds override #4).
- `~/knowledge/dr-marketing/brand-building--spencer-origins.md` — sophistication progression (Stage 3 =
  mechanism, 4 = claim escalation, 5 = reset), 5 mechanism types, dead-ground/whitespace (5+ = dead).
- `~/knowledge/dr-marketing/ecommerce--mark-builds-brands.md` — validation thresholds + anti-fluke
  (multi-competitor, trend durability, ad longevity). NOTE: the $300–500K floor is MISCALIBRATED for
  this category — do NOT apply it (spec Gate 1; D-09).
- A differentiator framework file (market-vs-angle test, me-too pattern) — for Gate 2.2's real-axis read.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- The stale `SKILL.md` already has correct skeleton bones to keep: the A4→D1 framing, layer-discipline
  port, per-pair output record shape, the self-audit checklist (standing biases). Salvage these; replace
  Gate 4, the `competitive_axis` enum, and the pre-`demand_trend`/`bet_type` input contract.
- `space-map.json` / `brands.json` / `ads/*.json` are produced and on disk — the skill can be exercised
  against the real Arduview data immediately (no need to re-run S1).

### Established Patterns
- **Brick model:** the skill is a judgment agent (A4); deterministic prep (counts, qualifying-creative
  tallies) is already done by S1 scripts. The skill reasons, it does not compute saturation.
- **Three-layer brief discipline (D-13):** prose brief = agent judgment context (overrides); PIPELINE
  INPUTS = scripts; output schema = hooks. The skill consumes layer A (prose), never hook-validates it.
- **DATA GAP discipline:** missing/`unknown` input → `DATA GAP: <field>`, never a guessed value.

### Integration Points
- Input: `runs/<space>/{space-map.json, brands.json, ads/*.json, pre-research-plan.md}`.
- Output: `runs/<space>/market-selection.md` → human bet pick → feeds Phase 3 (deep analysis on the
  chosen cell) and Phase 13 (mechanism research on the chosen transformation).
- Cross-phase dependencies on S1 (thin patches, not built here): `mechanisms_in_play[]` output slot
  (D-05); a working Google Trends fetch so `demand_trend` ≠ `unknown` (D-09); relocate per-brand
  `sophistication` to the cell (D-04 note).

</code_context>

<specifics>
## Specific Ideas

- The spec is "instructions on how to implement the skill file, with pretty detailed decision-making" —
  not the skill itself (Kam's framing). Inline it; keep the spec as the editable master.
- Market sophistication framing Kam pinned: *"how many competing offers a market experiences —
  specifically who is pitching similar products with the same transformation to the same niche."* A
  per-cell count of competing offers, never a brand trait.
- Soften the kill gates for this run because "idk what the rev estimate is gonna look like" — judge on
  relative demand, rank all 6, don't hard-kill on an input that's null/untrusted.

</specifics>

<deferred>
## Deferred Ideas

- **Gate 4 (awareness reachability)** — deferred to the deep-research step (Phase 3); S1 emits no
  awareness tag (D-05). Survivors are PROVISIONAL until then.
- **Phase-1 thin patches** surfaced here, not built in Phase 2: (a) add `mechanisms_in_play[]` output
  slot to `space-map.json` (D-05); (b) fix the Google Trends fetch so `demand_trend` populates (D-09);
  (c) relocate per-brand `sophistication` to the cell grain (D-04 note).
- **Community-heat read** — the separate deferred read for under-monetized maker/identity intensity
  (override #2). NOT collected; the assessor flags such cells, never resolves them.
- **`bet_type × niche × durability` crossing** — decision-time / gap-analysis synthesis; the skill has
  the three ingredients per brand, the crossing is the operator's read at the pick (per Phase-1 brief).
- **Re-enable hard-kill discipline** — once `revenue_est` + `demand_trend` are trustworthy, flip D-08
  soft-gate mode back to the spec's "stop at first kill" default.

</deferred>

---

*Phase: 02-stage-m1-s2-market-selection-gate*
*Context gathered: 2026-06-03*
</content>
</invoke>
