# Phase 2: Stage M1-S2 — Market-selection gate - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 1 primary artifact (rewrite-in-place), 3 consumed data contracts, 1 run-context, 1 procedure-master
**Analogs found:** 4 / 4 (this is a single-file rewrite; "analogs" = the salvageable self-skeleton + the real data shapes the rewrite must wire to)

> This is a markdown/prompt repo. The "code" the planner pattern-matches against is: the SKILL.md frontmatter+structure, the spec procedure text, and the on-disk JSON data contracts. There is no compiled-code analog. The single build target's *own current version* is its closest structural analog — the rewrite keeps its skeleton and replaces its stale guts.

---

## File Classification

| File | Role | Data Flow | Closest Analog | Match Quality |
|------|------|-----------|----------------|---------------|
| `.claude/skills/market-selection/SKILL.md` (REWRITE) | skill / LLM-invoked judgment prompt (A4-synthesize brick) | transform (structured JSON → ranked markdown decision) | itself (current STALE version) + the spec | self / exact-skeleton |

There is exactly ONE skill in `.claude/skills/` (`market-selection/`). No sibling SKILL.md exists to copy frontmatter conventions from — the *only* in-repo SKILL.md format precedent IS the file being rewritten. Treat its frontmatter (`name` + multi-line `description`) as the house convention to preserve.

**Inputs the rewrite must consume (read-shapes, not files to edit):**

| File (on disk, repo root) | Role | What the gates read |
|------|------|---------------------|
| `space-map.json` | cell + per-brand aggregate | Gate 1/2/3 cell structure, bet_type, sophistication cross-check |
| `brands.json` | per-brand facts | Gate 1 revenue/crowdfunding, Gate 2 price/product/channel |
| `ads/<brand>.json` | per-ad records | Gate 1.1 signal-2 ad longevity |
| `runs/arduview/pre-research-plan.md` | prose run-context | the 4 operator overrides (D-06) |
| `prompts/_specs/market-selection-assessor-spec.md` | MASTER procedure | the source the rewrite inlines (D-01) |

---

## Pattern Assignments

### `.claude/skills/market-selection/SKILL.md` (skill, transform)

**Analog A — its own current skeleton (KEEP these bones, D-01 + code_context):** `/home/kyu3/PMF/.claude/skills/market-selection/SKILL.md`

The current file is structurally sound but semantically STALE. Below are the load-bearing pieces to **preserve verbatim or lightly edited**, with line numbers, and the pieces to **replace**.

**KEEP — Frontmatter shape (lines 1-10).** House convention: `name` + folded `description` that states (a) what it evaluates, (b) when to run it, (c) the A4-not-D1 stop rule. The rewrite edits the description to drop "four ordered kill-gates … Awareness" (Gate 4 is deferred, D-05) and to say Gates 1–3 + provisional survivors:
```yaml
---
name: market-selection
description: >-
  Evaluate candidate transformation-niche pairs (NTPs) through four ordered kill-gates —
  Demand, Product, Sophistication, Awareness — and rank the survivors for testing. Run this
  AFTER a light-pass market scan (prompts/step1-light-pass.md) has produced the per-brand +
  per-market data contract ...
  ... It does NOT pick the market — it produces gate verdicts + a ranked survivor list ...
---
```

**KEEP — A4→D1 framing (lines 14-28).** The Role section + UM-assumed-present rule. Already correct; trace to `capability_inventory.md` locked #10. Do not rewrite the role; it survives intact.
```
You are an **A4 (synthesize) brick feeding a D1 (decide) human** ... You do not select which
pairs get tested — the operator does. Stop at the ranked survivor list + per-pair synthesis.
Do not write "we should test X."
```

**KEEP — `read_first` block (lines 30-39)** but ADD the `pre-research-plan.md` run-context entry (D-06) and the DR-KB auto-inject set (Discretion item; spec §SUPPORTING KNOWLEDGE). Current block already lists `definitions.md`, `workflow.md` Step 0, the light-pass output, `agents/implementation-notes.md`.

**KEEP — Layer-discipline port (lines 89-104).** Transformation/Claim/Mechanism/Angle/Feature/Problem-UM-vs-Problem-mechanism worked examples. Gate 3 dies without it; survives intact. Note its e-ink worked examples ("AI note-taking", "Paper-like feel", "Thinnest 4.5mm") are still on-domain.

**KEEP — Per-pair output record + `[INFERENCE]` fencing (lines 209-235).** The output-record shape (Pair → per-gate verdict with cited datum → verdict → 4-sentence prose synthesis), the write target `runs/<space>/market-selection.md`, and the SYNTHESIS-fencing rule. EDIT: drop the Gate-4 line from the record (line 221), restyle survivor label to "passed Gates 1–3, Gate 4 PENDING DEEP-RESEARCH" (matches spec line 138).

**KEEP — Self-audit checklist (lines 237-249).** The standing-biases gate (rewarding low competition / one-competitor-as-proof / sophistication-awareness-collapse) + gate-order + per-cell + typed-claims + DATA-GAP + A4-not-D1 checks. EDIT bias-3: awareness is now *deferred entirely* not just "read separately" (spec standing-bias #3, line 129).

**KEEP — DATA GAP discipline (lines 50-52).** `Emit DATA GAP: <field> (needed for Gate N) and halt that gate — never guess`. This is the D-09/D-05 mechanism for `demand_trend: unknown` and the missing `mechanisms_in_play[]`.

---

**REPLACE — what is STALE in the current SKILL.md:**

| Stale element | Lines | Replace with |
|---|---|---|
| Gate 4 (Awareness reachability) full procedure | 180-195 | The spec's DEFERRED stub (spec lines 105-106): "do NOT attempt Gate 4 … label survivor PROVISIONAL." Per D-05. |
| `INPUT DATA CONTRACT` "❌ add to schema" table | 48-86 | The RECONCILED contract below — these fields now EXIST on disk; wire to real shapes, not a wishlist. |
| `days_running ≥ 7` field name | 66, 120, 216 | Real field is `run_length_days` (ads/*.json). And use pre-counted `combos[].anti_fluke.qualifying_creatives`. |
| Five-year trend shape as a to-collect field | 76, 121 | `demand_trend.{shape,window,source,basis}` (real, but `unknown` everywhere → D-09 provisional). |
| Gate 1 hard `< 2 = KILL` (line 117) | 114-131 | D-08 SOFT-GATE: kills → flags + ranking penalties; rank all 6 cells by relative demand. |
| Gate 2.2 generic "differentiating axis" | 138 | Wire to OPEN `bet_type` + `bet_type_basis` (D-02). Drop any `competitive_axis` enum framing inherited from spec. |
| Gate 3 stage off untyped claims | 150 | Off `claims[].type` (real values seen: `direct`, `enlarged`) + `claim_count` + `enhanced_claim_count` per `combos[]`. |

---

**Analog B — the MASTER procedure to inline (D-01):** `/home/kyu3/PMF/prompts/_specs/market-selection-assessor-spec.md`

The spec is the authoritative decision text; the rewrite **inlines its procedure** and carries a derived-from header (Discretion item):
> `Derived from prompts/_specs/market-selection-assessor-spec.md — edit the spec, regenerate this.`

Spec sections to inline, with the ONE reconciliation the spec itself flags (its RECONCILIATION NOTE, lines 155-169):
- **Gate 1 SCALE GATE** (spec lines 67-79): three OR-signals — revenue (weight by method/confidence), ad volume+longevity (`run_length_days` 7+), crowdfunding (`raised`/`pct_funded`/`status`). Anti-fake-signal + no-absolute-dollar-floor + DR `$300–500K` floor is MISCALIBRATED, do not apply.
- **Gate 2.2** (spec lines 86): spec STILL says `competitive_axis (function-capability-price | visual-statement | community-openness)`. **This enum is dead (D-02).** The Gate-2.2 *body* in SKILL.md must be rewritten to reason over the OPEN `bet_type` the classifier named — not just noted. (The spec's own bottom note, line 161-162, instructs this rewire.)
- **Gate 3** (spec lines 91-104): mechanical rule = `stage = highest claim_type tier 2+ LIVE in-geo brands deploy in the cell`. Per-CELL, NOT a brand attribute (D-04). S1's `per_brand[].sophistication` STRING is mis-grained → cross-check only, flag disagreement.
- **OPERATOR OVERRIDES** (spec lines 116-122) — the 4 slots, mapped onto run-prose by D-06.
- **STANDING BIASES** (spec lines 126-130) + **EPISTEMIC DISCIPLINE** (spec lines 147-151).

---

## The Reconciled INPUT CONTRACT (real on-disk shapes — wire the gates to THESE)

> All paths are repo-root on disk now (`/home/kyu3/PMF/space-map.json`, `/brands.json`, `/ads/*.json`). The skill's `<space>` indirection still points at `runs/<space>/`; the planner must note the current run's files live at repo root, not under `runs/arduview/` (only `pre-research-plan.md` is there). This path mismatch is itself a wiring decision for the plan.

### `space-map.json` — top-level keys (CONFIRMED on disk)
```
['_provenance', '_anti_fluke_floor', '_comparable_bet_seed_note',
 'transformations', 'niches', 'angles', 'bet_types', 'combos', 'per_brand', 'saturation']
```
**NO `mechanisms_in_play[]` slot — CONFIRMED ABSENT (D-05 validated).** `grep` for `mech` in top-level keys returns `[]`. → Gate 2.2 / Gate 3.3-S3 must emit `DATA GAP: mechanisms_in_play (S1 computes it, no output slot yet)` and run at lowered confidence. Never invent the cluster.

**`combos[]` — the per-CELL gate unit (6 cells; Gate 1/2/3 iterate these). Real record:**
```json
{
  "transformation": "maker-identity",
  "niche": "maker-diy-hobbyists",
  "brand_count": 5,
  "creative_count": 5,
  "brands": ["thumby","gameshell","pwnagotchi","pimoroni","sparkfun"],
  "claim_count": 3,
  "enhanced_claim_count": 0,
  "claims": [ {"text": "...", "type": "direct"} ],
  "anti_fluke": { "brands_at_scale": 5, "qualifying_creatives": 0 },
  "_note": "Comparable_bet_seeds (arduboy, flipper-zero) EXCLUDED ..."
}
```
- `claims[].type` values actually present on this run: **`direct`, `enlarged`** only (no `mechanism`/`enhanced` typed) → Gate 3 will read Stage 1–2 across the board; `enhanced_claim_count` is **0** in every cell.
- `anti_fluke.qualifying_creatives` is **PRE-COUNTED = 0 in ALL 6 cells** (D-03: no ad cleared 7+ days). Gate 1.1 signal-2 reads this, does NOT recount.
- `combos[]._note` carries the comparable-seed exclusion already applied (D-07/D-08).
- **6 cells total** (evaluate EVERY one, D-07): maker-identity×maker-diy, learn-to-code×maker-diy, learn-to-code×learn-to-code-students, retro-gaming-relive×retro-gamers, novelty-object-own×edc-aesthetic-collectors, music-creation×edc-aesthetic-collectors.

**`per_brand[]` — bet_type + sophistication cross-check. Real record:**
```json
{
  "slug": "arduboy",
  "transformations": [{"canonical":"maker-identity","creative_count":1}, ...],
  "niches": ["maker-diy-hobbyists"],
  "comparable_bet_seed": true,
  "bet_type": "open-source-hackability-as-lead",
  "bet_type_basis": "Page leads: 'open source — Learn to code ...'",
  "demand_trend": {"shape":"unknown","window":null,"source":null,"basis":null},
  "sophistication": "Stage 1 — in maker-identity × maker-diy cell: ..."
}
```
- **Gate 2.2 reads `bet_type` + `bet_type_basis`** (D-02), NOT a closed enum. Canonical `bet_types[]` at top level: `novel-hardware-as-lead`, `open-source-hackability-as-lead`, `hardware-authenticity-as-lead`, `value-breadth-as-lead`, `maker-ecosystem-store`. Each carries `raw_variants[]` + `brand_count`.
- `demand_trend.shape == "unknown"` for ALL brands (D-09) → Gate 1.2 cannot clear with confidence; stamp every cell "durability UNKNOWN", surface "fix Trends fetch (Phase 1)" as #1 blocker.
- `per_brand[].sophistication` is a STRING at brand grain → D-04: cross-check only, flag disagreement; the GATE input is the cell's typed claims.
- `comparable_bet_seed: true` brands stay BET-EVIDENCE only, never a candidate cell (D-07).

### `brands.json` — `{starting_point, brands[], dropped[]}`. Real per-brand record:
```json
{
  "brand": "Arduboy", "slug": "arduboy", "url": "...",
  "product_observed": "Credit-card-sized open-source handheld ...",
  "channel": "dtc", "lane": "major", "ads_flag": "unsure",   // ads_flag ∈ {yes,no,unsure}
  "crowdfunding": null,
  "price_points": ["$64.00","$79.00"],
  "revenue_est": {
    "value_usd_monthly": null, "method": null, "confidence": null,
    "inputs": {"monthly_visits": null, "cvr_assumption": 0.02, "aov_usd": 64, "aov_source": "observed-price"},
    "notes": "monthly_visits null and no review proxy available — explicit null, not PENDING"
  },
  "demand_trend": {"shape":"unknown", ...},
  "comparable_bet_seed": true, "status": "live", "market_presence": "in-geo"
}
```
- **Gate 1 signal-1 (revenue):** `revenue_est.{value_usd_monthly, method, confidence}` — mostly `null` on this run (D-03). Weight by method/confidence; distrust `review_proxy`/`low`.
- **Gate 1 signal-3 (crowdfunding):** populated example — `gameshell`: `{"platform":"kickstarter","raised":"$350,000+","pct_funded":"700%+","status":"funded-shipped"}`. `skeleton-key` has crowdfunding all-`unknown`. Read `raised`/`pct_funded`/`status`.
- **Gate 2.1c (price):** `price_points[]` verbatim (e.g. `["$64.00","$79.00"]`).
- **Gate 2 product-category:** `product_observed`, `channel` (dtc|marketplace|crowdfunding).

### `ads/<brand>.json` — Gate 1.1 signal-2 (ad longevity). Real record:
```json
{
  "slug": "flipper-zero", "status": "ok",
  "resolved_advertiser": {"name":"Flipper Zero","pageId":"...","followers":16900},
  "active_ad_count": "48", "library_ids_loaded": ...,
  "ads": [
    { "library_id":"848913417899257", "start_date":"2025-12-30",
      "end_date": null, "run_length_days": 155, "text":"... Flipper Zero Sponsored ..." }
  ]
}
```
- **Field is `run_length_days`** (NOT `days_running`). 7+ = validated (spec Gate 1.1 signal-2).
- Most files have `ads: []` and `active_ad_count: "0"` (e.g. anbernic). Only `flipper-zero.json` is densely populated (117 ads, active_ad_count 48). This is WHY `qualifying_creatives` came back 0 for the candidate cells (flipper is a comparable-seed, excluded).
- Cross-check `brands.json` per-brand `ads_flag` against the ads file presence.

### `runs/arduview/pre-research-plan.md` — operator overrides as PROSE (D-06)
Maps onto spec's 4 override slots. Real anchors (line numbers in that file):
- **§"Supply-side validation stance"** (line 62): override-1 one-comparable → "proceed on a single strong validated comparable — but only to a DRY TEST, not to commitment" (line 64); override-3 durability-load-bearing → "spiked and died is a WARNING, not validation" (line 65).
- **§"Deferred reads"** (line 67): override-2 community-heat → "do not treat thin competitor-spend in the maker niche as an automatic kill … judgment lives in the separate read" (line 69).
- Override-4 demand-type (belonging/identity = legitimate demand) is grounded in §"WHICH maker identity is real" (lines 50-53).
- Read as **layer-A prose, never schema, never hook-validated** (D-06 / Phase-1 D-13). For the Arduview run, **all 4 overrides are effectively SET**.

---

## Shared Patterns

### DATA GAP discipline (cross-cutting, applies to every gate)
**Source:** current SKILL.md lines 50-52.
**Apply to:** every gate sub-check whose input is `null`/`unknown`/absent.
```
Emit DATA GAP: <field> (needed for Gate N) and halt that gate — never guess a value.
Exact figure or "not found"; no hand-waving.
```
Three live triggers this run: `demand_trend: unknown` (all brands, D-09), `mechanisms_in_play[]` absent (D-05), `revenue_est.value_usd_monthly: null` (most brands, D-03).

### `[INFERENCE]` fencing (cross-cutting, output)
**Source:** current SKILL.md lines 229-231 + spec EPISTEMIC DISCIPLINE (spec 147-151) + D-10.
**Apply to:** every AI read — stage assignment, intensity proxy, is-live inference. Cite the datum (count/claim/trend/axis) behind every verdict; no verdict without its datum.

### Soft-gate mode (cross-cutting, this run only — D-08)
**Source:** D-08 + the spec's "say so, lower confidence, do not silently proceed" (spec line 55).
**Apply to:** Gate 1 (and any kill). Kills → flags + ranking penalties; gates run in fixed order and emit per-gate verdicts, but cells are RANKED by relative demand, ALL 6 carried through. Hard-kill discipline re-enables once `revenue_est`+`demand_trend` are trustworthy.

### DR-KB auto-inject (Discretion — supporting knowledge at invocation)
**Source:** spec §SUPPORTING KNOWLEDGE (spec lines 19-28) + CONTEXT canonical-refs.
**Apply to:** skill invocation (hook or read_first — mechanism is Claude's discretion).
Assessor-cut set: `~/knowledge/dr-marketing/consumer-psychology--carl-weische.md` (sophistication+awareness tables, Mass Desire drivers), `brand-building--spencer-origins.md` (sophistication progression, 5 mechanism types, 5+=dead), `ecommerce--mark-builds-brands.md` (anti-fluke thresholds — but $300–500K floor MISCALIBRATED, do not apply), a differentiator-framework file (Gate 2.2 real-axis read). Reference, NOT the procedure.

---

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| (none) | — | — | Single-file rewrite. Its own current skeleton + the spec are the analogs; data shapes are confirmed on disk. The only genuinely-absent input is `mechanisms_in_play[]` — handled via DATA GAP discipline, not a missing analog. |

---

## Metadata

**Analog search scope:** `.claude/skills/` (1 skill total), repo-root data contracts (`space-map.json`, `brands.json`, `ads/*.json`), `runs/arduview/`, `prompts/_specs/`, `prompts/step1-light-pass.md`.
**Files scanned:** SKILL.md (1), spec (1), step1-light-pass.md (1), space-map.json + brands.json + 4 ads/*.json (data), pre-research-plan.md (1).
**Confirmed facts for the planner:** (a) no `mechanisms_in_play[]` slot in space-map.json — VALIDATED ABSENT; (b) real ad field is `run_length_days` not `days_running`; (c) `qualifying_creatives = 0` in all 6 cells, pre-counted; (d) `demand_trend.shape == "unknown"` for all brands; (e) `claims[].type` only `direct`/`enlarged` present, `enhanced_claim_count = 0` everywhere; (f) `bet_types[]` is OPEN canonical list, not the dead 3-value enum; (g) data lives at repo ROOT not `runs/arduview/` — path-wiring decision for the plan.
**Pattern extraction date:** 2026-06-03
