---
name: market-selection
description: >-
  Evaluate candidate transformation-niche pairs (NTPs) through three ordered kill-gates —
  Demand, Product, Sophistication — with Awareness (Gate 4) DEFERRED to the deep-research step;
  ranks PROVISIONAL survivors for the human bet pick. Run this AFTER a light-pass market scan
  (prompts/step1-light-pass.md) has produced the per-brand + per-market data contract, when
  deciding which NTP(s) to take into deep competitor analysis. This is PMF Step 0/1 Gate 1
  (the bet-selection decision). It does NOT pick the market — it produces gate verdicts + a
  ranked PROVISIONAL survivor list and presents them for the human's call.
---

> Derived from prompts/_specs/market-selection-assessor-spec.md — edit the spec, regenerate this.

# Market Selection — three live gates + Gate 4 deferred (PROVISIONAL survivors)

## Role

You evaluate **transformation-niche pairs (NTPs)**, not markets. One product serves several
pairs; each pair has its own competitive set, proven spend, sophistication stage, and awareness
level. **The pair is the unit of analysis.** You run every candidate pair through four gates in
fixed order; Gate 4 (awareness) is DEFERRED — you run Gates 1–3 and label all survivors
PROVISIONAL.

You are an **A4 (synthesize) brick feeding a D1 (decide) human** (see `capability_inventory.md`
locked decision #10 + adjacency rule). You compute kill/pass verdicts and rank survivors with
evidence. **You do not select which pairs get tested — the operator does.** Stop at the ranked
survivor list + per-pair synthesis. Do not write "we should test X."

A **unique mechanism (UM) is always assumed present** — the operator never enters a market
without one. Never ask *whether* a UM exists. Ask *how much work it has to do* given what the
competition has already said.

## read_first (load before running — do not proceed without these)

- `definitions.md` — locked vocabulary: PMBD, transformation, niche, UM types, awareness stages,
  the four drivers, sophistication stages. Every label you assign traces here.
- `workflow.md` Step 0 — the locked gap variables (Desire to Solve · D2C Feasibility · Market
  Sophistication · Market Growth). The gates below are these variables, unrolled.
- The **light-pass output** for this space (`runs/<space>/` — the `space-map.json` / market
  aggregate + per-brand records produced by `prompts/step1-light-pass.md`). This is your data.
- `agents/implementation-notes.md` — the layer-discipline worked examples (Gate 3 depends on them).
- `runs/<space>/pre-research-plan.md` — the bet brief; the operator overrides live in its prose
  §"Supply-side validation stance" + §"Deferred reads". Read as layer-A prose, never schema,
  never hook-validated (D-06). For the Arduview run: `runs/arduview/pre-research-plan.md`.

### SUPPORTING KNOWLEDGE (auto-injected — read as reference, NOT as the procedure)

The four-gate framework inlined below is the procedure. These DR files are SUPPORTING KNOWLEDGE
so you correctly understand the terms you manipulate — what a Stage-4 claim is, what a real
differentiator looks like, how sophistication and awareness differ. Consult them to classify
and judge correctly; do NOT let them override the procedure.

- `~/knowledge/dr-marketing/consumer-psychology--carl-weische.md` — sophistication-stage +
  awareness-stage tables + Mass Desire core drivers (belonging/status/comparison = legitimate
  demand, not weak demand — grounds override #4).
- `~/knowledge/dr-marketing/brand-building--spencer-origins.md` — sophistication progression
  (Stage 3 = mechanism, 4 = claim escalation, 5 = reset), 5 mechanism types,
  dead-ground/whitespace rule (5+ same claim = dead).
- `~/knowledge/dr-marketing/ecommerce--mark-builds-brands.md` — anti-fluke thresholds (multi-
  competitor, trend durability, ad longevity). **CAUTION: its $300–500K/mo revenue floor is
  MISCALIBRATED for this product category — do NOT apply it.** The operator minimum from the
  run context is the only absolute bar; absent that, qualify on signals 2 or 3 and state no
  floor was set.
- `~/knowledge/dr-marketing/differentiator-framework__2_.md` — market-vs-angle test, me-too
  failure pattern, worked failures (for Gate 2.2 real-axis read and the don't-merge-markets
  judgment).

---

## INPUTS

### Canonical layout

The skill expects:
- `runs/<space>/space-map.json` — cell aggregate + per-brand fields
- `runs/<space>/brands.json` — per-brand facts
- `runs/<space>/ads/<brand>.json` — per-ad longevity records
- `runs/<space>/corpus/<brand>/dump.json` — per-brand creative dumps (Gate 2.2 / 3.3 mechanism derivation)
- `runs/<space>/pre-research-plan.md` — prose operator overrides

### Arduview run — PATH MISMATCH (load-bearing)

For the current Arduview debug run, the four data file sets live at **repo root**, NOT under
`runs/arduview/`:
- `space-map.json` → `/home/kyu3/PMF/space-map.json`
- `brands.json` → `/home/kyu3/PMF/brands.json`
- `ads/<brand>.json` → `/home/kyu3/PMF/ads/<brand>.json`
- `corpus/<brand>/dump.json` → `/home/kyu3/PMF/corpus/<brand>/dump.json`

Only `pre-research-plan.md` is under the run directory:
- `pre-research-plan.md` → `/home/kyu3/PMF/runs/arduview/pre-research-plan.md`

Pass the actual on-disk paths when invoking this skill against the Arduview run. Plan 02 runs
against these exact files.

---

## RECONCILED INPUT CONTRACT

A signal is collected only because a gate consumes it. If a required field is absent or comes
back `unknown` at high rate, SAY SO and lower confidence — do not silently proceed as if you
had it. **Emit `DATA GAP: <field> (needed for Gate N)` and halt that gate — never guess a value.**
Exact figure or "not found"; no hand-waving.

### Gate 1 inputs — Demand

| Signal | File | Real field path | Notes |
|--------|------|-----------------|-------|
| Revenue | `brands.json` | `revenue_est.{value_usd_monthly, method, confidence}` | null for all 20 brands this run; weight by method/confidence; distrust `review_proxy`/`low` |
| Ad longevity | `ads/<brand>.json` | `ads[].run_length_days` | 7+ days = validated; NOT `days_running` (retired field name) |
| Ad longevity (pre-counted) | `space-map.json` | `combos[].anti_fluke.qualifying_creatives` | PRE-COUNTED = 0 in all 6 cells this run — READ this, do not recount |
| Crowdfunding | `brands.json` | `crowdfunding.{platform, raised, pct_funded, status}` | funded-shipped = clean validation signal |
| Trend shape | `space-map.json` → `per_brand[]` | `demand_trend.{shape, window, source, basis}` | shape = "unknown" for ALL 20 brands this run (D-09 provisional handling, Gate 1.2) |
| Candidate cells | `space-map.json` | `combos[]` — 6 cells; iterate ALL | never pre-curate a shortlist |

### Gate 2 inputs — Product

| Signal | File | Real field path | Notes |
|--------|------|-----------------|-------|
| Bet axis (Gate 2.2) | `space-map.json` → `per_brand[]` | `bet_type` + `bet_type_basis` | OPEN canonical list; Gate 2.2 body reasons over these, NOT a dead closed enum |
| Canonical bet list | `space-map.json` | `bet_types[]` | top-level OPEN list: `novel-hardware-as-lead`, `open-source-hackability-as-lead`, `hardware-authenticity-as-lead`, `value-breadth-as-lead`, `maker-ecosystem-store` |
| Price conditioning | `brands.json` | `price_points[]` | verbatim |
| Product / channel | `brands.json` | `product_observed`, `channel` | dtc / marketplace / crowdfunding |
| Mechanisms-in-play | Derived — see DATA GAP note below | — | ABSENT from space-map.json; derive via stopgap |

### Gate 3 inputs — Sophistication

| Signal | File | Real field path | Notes |
|--------|------|-----------------|-------|
| Stage (per CELL) | `space-map.json` | `combos[].claim_count`, `combos[].enhanced_claim_count`, `combos[].claims[].type` | types present this run: `direct`, `enlarged` only; `enhanced_claim_count` = 0 in every cell |
| Per-brand sophistication | `space-map.json` → `per_brand[]` | `sophistication` (STRING) | MIS-GRAINED at brand grain, NOT the gate input — cross-check only; flag any disagreement |

### DATA GAP triggers for this run

Two bare DATA GAPs:
1. `demand_trend: unknown` — ALL 20 brands; Gate 1 cannot clear with confidence (D-09). Stamp
   every cell "durability UNKNOWN." Surface "fix the Trends fetch (Phase 1)" as the #1 blocker
   before any committed bet pick. Run PROVISIONAL.
2. `revenue_est.value_usd_monthly: null` — most/all brands (D-03). Weight remaining signals
   (ad longevity, crowdfunding); state no revenue floor was applied.

The THIRD field that appears DATA-GAP-shaped — `mechanisms_in_play[]` — is **NOT** a bare DATA
GAP for this run. The `space-map.json` output slot is absent (a cross-phase Phase-1 add per
`01-DEBUG-RUN-NOTES.md` BREAK 5, not built here), BUT at decision-time the skill READS
`.claude/skills/market-selection/mechanisms-in-play-stopgap.md` and DERIVES the
shared-vs-unique mechanism read on the fly from per-pitch `mechanism[]` in
`corpus/<brand>/dump.json` → `creatives[].pitches[].mechanism[]` (canonical-layout label
`runs/<space>/corpus/<brand>/dump.json`; for the Arduview run the dumps are at repo-root
`corpus/<brand>/dump.json`). Fence the derived read `[INFERENCE]`, surface `n=` per cluster,
lower the cell's confidence. Do NOT emit a bare `DATA GAP` and skip the mechanism check for
this field — the raw material is present, so derive it.

---

## LAYER DISCIPLINE (port — Gate 3 dies without it)

Claim-TYPE tagging fails when framework layers are conflated. Force every piece of copy into
**exactly one** layer. Worked examples (from `agents/implementation-notes.md`):

- **Transformation** = the life-outcome ("study better", "protect your eyes"). NOT a feature.
- **Claim** = the verbal outcome-promise.
- **Mechanism / UM** = *why* it works. "AI note-taking / capture-to-output" = mechanism, **not** a
  transformation, **not** an angle.
- **Angle** = the emotional frame. "Paper-like feel" = a decayed Product-UM now acting as a
  saturated **minimalism angle**, **not** a transformation.
- **Feature** = a spec. "Thinnest 4.5mm / faster refresh / 16K stylus" = features, **not** claims.
- **Problem-mechanism vs Problem-UM:** "your iPad has distracting apps" is a problem-mechanism (a
  causal story). It is only a Problem-**UM** if *unique* — an everyone-knows-it cause shared by all
  competitors never rises to a UM.

---

## THE GATES

Gates run in **increasing order of how reversible a failure is** — eliminate on the cheap and
unfixable first. **Run 1→4 in order.**

### SOFT-GATE MODE (first/debug run — D-08)

For this first/debug run, a Gate-1 kill becomes a FLAG + a ranking penalty, NOT an elimination.
Gates still run in fixed order and emit per-gate verdicts, but ALL 6 cells are carried through to
the ranked output, RANKED by relative demand. Rationale: hard kills on null/unreliable revenue
would nuke every cell or fire arbitrarily given the current data quality.

**Hard-kill discipline RE-ENABLES once `revenue_est` + `demand_trend` are trustworthy (D-08).**
When that happens, revert to the spec default: stop at the first kill; no later-gate strength
offsets an earlier kill.

---

### GATE 1 — Demand is real and not a fluke

The existence question: is anyone *provably* paying for this transformation, for this niche?

**SOFT-GATE MODE ACTIVE** — Gate-1 kills become flags + ranking penalties this run (see above).

#### 1.1 Scale gate — count competitors clearing the floor

A brand counts as a real-operating data point only if it clears the SCALE GATE AND its winning
creative ran long enough (`run_length_days ≥ 7`) to be validated, not a 3-day spike. Count
qualifying brands per cell using `combos[].anti_fluke.qualifying_creatives` (pre-counted; do NOT
recount) and verify with `ads/<brand>.json` → `ads[].run_length_days`.

**THE SCALE GATE — a brand qualifies if it clears ANY of these three signals:**

1. **Monthly revenue.** `revenue_est.value_usd_monthly` (from `brands.json`) clears the
   operator-set minimum. WEIGHT by `revenue_est.method` + `confidence`: a `traffic_formula`
   estimate at `high` confidence qualifies; a `review_proxy` / `low`-confidence estimate is weak
   and does NOT alone clear the gate. **No absolute dollar floor from the DR knowledge** — the
   $300–500K/mo floor from the DR ecommerce file is MISCALIBRATED for this category, do NOT apply.
2. **Ad volume + longevity.** `ads/<brand>.json` → `ads[].run_length_days ≥ 7`. Sustained ad
   volume over 7+ days is a real spend-and-still-running signal. A brand running validated ads at
   volume qualifies even if the revenue estimate is thin. Pre-counted signal: read
   `combos[].anti_fluke.qualifying_creatives` (= 0 in all 6 cells this run — the only dense ads
   file is flipper-zero.json, a comparable_bet_seed excluded from candidate cells).
3. **Crowdfunding success.** `brands.json` → `crowdfunding.{raised, pct_funded, status}`. A
   funded-shipped raise is a clean validation signal.

**Anti-fake-signal:** a professional-looking site or a pile of reviews does NOT clear the gate —
only the three signals above do. When signal quality is poor, lower the cell's confidence.

**Is the brand still RUNNING?** There is no direct `is_live` field — INFER from: currently-running
ads (`ads_flag` + recent `run_length_days`), crowdfunding `status`, and whether the site resolved
during fetch. State it is an inference, not a stamped field — fence `[INFERENCE]`.

Default floor: fewer than 2 qualifying = KILL → FLAG + ranking penalty (soft-gate mode).
**SUBJECT TO THE ONE-COMPARABLE OVERRIDE — see OPERATOR OVERRIDES.**

#### 1.2 Trend shape — durability check

Read `demand_trend.shape` from `space-map.json` → `per_brand[]`. Shapes: parabolic-spike = KILL
(→ soft FLAG + ranking penalty); steady / rising = pass; declining = warning, weight down.

**Because `demand_trend.shape == "unknown"` for ALL 20 brands this run (D-09):**
- Stamp every cell: **"durability UNKNOWN — Gate 1 cannot clear with confidence."**
- LOWER confidence for every cell.
- Surface **"fix the Trends fetch (Phase 1)"** as the **#1 blocker** before any committed bet pick.
- RUN PROVISIONAL — produce the full gated map off ad-longevity + crowdfunding signals only.

**Durability-is-load-bearing override (override #3):** for novelty/early-adopter products, a
comparable that spiked-and-died is a WARNING, not validation, even at high peak revenue. Weight
parabolic-spike harder than usual.

#### 1.3 Demand magnitude — ranking only, does not kill

Market size = total proven spend in cell (confidence-weighted from 1.1).

For PAIN markets: score off severity / frequency signals.
For BELONGING / IDENTITY markets: intensity is read off community heat / willingness-to-pay-for-
aesthetic — **but the light-pass does NOT collect community heat (deferred).** For belonging/
identity cells: FLAG intensity as **"requires separate community-heat read — not scored here"** —
do NOT fabricate a score from absent data (override #4). The maker/open niche may have intense-
but-under-monetized demand; do not auto-kill on thin spend alone — flag it for the separate read.

**Output:** pass/kill (→ flag in soft-gate mode) + demand magnitude.
**Trap:** low competition is NOT opportunity — it usually means nobody pays. **Never reward a
cell for low competition.**

---

### GATE 2 — Product delivers and owns one named axis

Does the product produce this transformation for this niche, and beat the proven field on at
least one specific, nameable axis?

#### 2.1 Mechanism efficacy

Evidence the product produces the transformation (science, reviews, demonstrable result).
None = KILL.

#### 2.1b Product-category spend-transfer check

Is the proven spend on YOUR product-category, or on a substitute? Check `product_observed`
(from `brands.json`). If qualifying spend is overwhelmingly on a substitute product-category,
FLAG "demand proven for the transformation but on a different product-category — transfer
unproven" and weight down (or KILL if the substitute is strictly cheaper/easier with no
reason to cross over).

#### 2.1c Price-conditioning check

Read `price_points[]` (verbatim, `brands.json`). What is the market conditioned to pay?
If the operator's required price sits far above the conditioned band with no differentiator
justifying the premium, FLAG "market conditioned to [band]; operator price must clear this"
and route the final pass/kill to Gate 2.4 economics.

#### 2.2 Differentiating axis — wire to OPEN bet_type (load-bearing, D-02)

Check for a differentiator on mechanism AND on avatar. Neither = KILL (true me-too).

**Read the cell's competing bets from `space-map.json` → `per_brand[]`.** For each brand,
`bet_type` (e.g. `open-source-hackability-as-lead`, `novel-hardware-as-lead`,
`hardware-authenticity-as-lead`, `value-breadth-as-lead`, `maker-ecosystem-store`) and
`bet_type_basis` (the page-quoted evidence for the bet) are the gate inputs.

The canonical `bet_types[]` list (top-level in `space-map.json`) is OPEN — the classifier
names whatever bet it observed, not a fixed closed enum. Gate 2.2 reasons over the OPEN
`bet_type` the classifier named, using `bet_type_basis` as the supporting evidence.
**Do NOT reason from any closed 3-value competitive axis enum** (function-capability-price /
visual-statement / community-openness are dead values not present in the current output).

The named axis that passes **IS the UM**. This gate and UM identification are one finding.

**Mechanisms-in-play (D-05 stopgap):** Gate 2.2 also needs to know which mechanisms the cell's
competitors lead with. Since `mechanisms_in_play[]` is absent from `space-map.json`, DERIVE
this read using the procedure in
`.claude/skills/market-selection/mechanisms-in-play-stopgap.md`:
- Source: `corpus/<brand>/dump.json` → `creatives[].pitches[].mechanism[]`
- Collect from LIVE, in-geo brands in this cell; exclude `comparable_bet_seed` + dead/region-only
- Cluster near-duplicates by meaning; count distinct brands per cluster
- Classify: shared (3+ brands) = not ownable; unique (1 brand) = ownable
- Scope per cell — a cross-cell mechanism is not taken here
- Use `mechanism[]` as primary; `problem_um_raw` only as secondary when non-empty
- Fence the entire derived read `[INFERENCE]` with `n=` per cluster; lower cell confidence

A real differentiator at 2.2 can also JUSTIFY a price premium flagged at 2.1c — connect them.

#### 2.3 Believability tier

Tier 1 self-evident (provable on demo) / Tier 2 authority / Tier 3 social proof. Record the
strongest available. SUPPORTING evidence for believability judgments, not a verdict substitute.

#### 2.4 Economics (resolves 2.1c)

COGS, margin, shippability vs operator minimums, AND operator's required price vs the
conditioned price band from 2.1c. COGS is the operator's data — if absent, FLAG "economics
pending operator COGS" rather than passing it blind.

Kill conditions: margin fails operator minimum = KILL; OR required price exceeds conditioned
band AND no differentiator justifies the premium = KILL. A premium IS survivable if 2.2 gives
a real differentiator the buyer pays for.

**Output:** pass/kill + named UM axis + believability tier.

---

### GATE 3 — Sophistication decision procedure

Mechanical, not a vibe. How saturated is the claim space — sets how hard the UM must work.

#### 3.1 Identify the stage — PER CELL (D-04)

Mechanical rule: **stage = highest `claim_type` tier that 2+ LIVE in-geo brands deploy in
the cell.** Derived from:
- `combos[].claim_count` / `combos[].enhanced_claim_count` / `combos[].claims[].type`
  (per `space-map.json` — these are PER-CELL aggregates)

| Stage | Market state |
|-------|-------------|
| 1 | New. Few claims, no UMs. |
| 2 | Early. Claims getting specific, no UMs. |
| 3 | Growing. UMs appearing, direct claims saturated. |
| 4 | Established. Multiple UMs, enhanced claims emerging. |
| 5 | Saturated. Enhanced claims exhausted; identity/status plays. |

`claims[].type` values present this run: `direct` and `enlarged` only; `enhanced_claim_count = 0`
in every cell → reads Stage 1–2 across the board.

**`per_brand[].sophistication` STRING is MIS-GRAINED** (brand grain, not cell grain) — it is
CROSS-CHECK ONLY. Flag any disagreement between the string and the cell-derived stage;
never use the string as the gate input.

#### 3.2 Required move

S1 → direct claim · S2 → enlarged/specified claim · S3 → UM differentiation ·
S4 → enhanced claim on the UM · S5 → identity / extraordinary identification.

#### 3.3 Executability

- **S1/S2:** UM has room for a clean statement. Executable.
- **S3:** is the Gate-2 UM real AND **not already in the mechanisms-in-play set** (derived via
  the stopgap above — `[INFERENCE]`)? If already claimed by a qualifying competitor → not a
  differentiator → KILL. **Do NOT emit a bare `DATA GAP` here** — derive the mechanism set from
  the corpus dumps and proceed, fenced `[INFERENCE]`.
- **S4:** run the enhanced claim through (a) desirable to the niche AND (b) believable.
  Fail either → KILL. **Believability resolved:** reason FRESH at the enhanced claim — given the
  enhanced claim + the mechanism/reason-why + the target niche, does the stated mechanism
  plausibly support the claim? The Gate-2 believability tier is SUPPORTING evidence, not the
  answer. Show your reasoning; cite the mechanism judged against.
- **S5:** identity execution is out of scope for a rapid test → KILL or deprioritize per
  operator policy.

#### 3.4 Defense quality (ranking)

"Many competitors making many *differentiated* sophisticated claims" (strongly defended) vs
"many competitors repeating the *same undifferentiated* claim" (weakly defended — demand still
proven, whitespace open). The **5-plus-same-claim rule** marks dead ground; what's left is
whitespace. Raise winnability for cells with weak defense.

**Output:** pass/kill + stage + required move + defense-quality read.

---

### GATE 4 — Awareness reachability — DEFERRED TO DEEP-RESEARCH STEP

Awareness is orthogonal to sophistication and must be read independently (never collapse them
— standing bias #3). BUT the light-pass does NOT capture an awareness tag (it was dropped as a
per-creative field; the real awareness read is a deep-research-step per-funnel job).

**Do NOT attempt Gate 4. Do not infer awareness from thin signals.**

Label every Gate-1–3 survivor: **"passed Gates 1–3, Gate 4 (awareness reachability) PENDING
DEEP-RESEARCH STEP — PROVISIONAL."**

A survivor here is PROVISIONAL — confirmed only after the deep-research step reads awareness.
This keeps survivors honest rather than overclaiming a full pass.

---

### OPERATOR OVERRIDES (map from pre-research-plan.md prose — D-06)

Read the run's `pre-research-plan.md` as **layer-A prose, never schema, never hook-validated**.
The overrides live in §"Supply-side validation stance" + §"Deferred reads". Map the prose onto
these 4 slots. **For the Arduview run, all 4 overrides are SET:**

1. **One-comparable override (Gate 1.1).** Override SET: proceed on a single strong validated
   comparable — but only to a DRY TEST, not to commitment. One comparable justifies testing; it
   does NOT justify skipping the dry test to commit MOQ/production. State which case you applied.
2. **Community-heat caveat (Gate 1).** Override SET: for belonging/identity niches (maker/open/
   DIY), thin competitor-spend is NOT an automatic kill — it may be under-monetized intensity.
   Flag such a cell as "low spend, possible under-monetized intensity — community-heat read
   required (separate, deferred)" and let the operator decide. Do NOT pass it as proven.
3. **Durability-is-load-bearing (Gate 1.2).** Override SET: for this novelty/early-adopter
   product, a comparable that spiked-and-died is a WARNING, not validation, even at high peak
   revenue. Weight parabolic-spike harder than usual.
4. **Demand-type override (Gate 1.3).** Override SET: belonging/identity/status cells read
   intensity off community heat + willingness-to-pay-for-aesthetic, NOT pain severity/frequency.
   (Grounded in Mass Desire core drivers — belonging, social comparison, status are legitimate
   demand, not weak demand.) Measuring such a cell by pain-severity wrongly reads it as shallow.

**If a run supplies no brief override stance:** run generic AND FLAG that you ran without overrides.

---

### CANDIDATE CELLS — evaluate ALL 6

Evaluate **EVERY cell in `combos[]`** (all 6 this run) — no pre-curated shortlist.

`comparable_bet_seed: true` brands (arduboy, flipper-zero, nothing-phone, skeleton-key) stay
**BET-EVIDENCE only**. They NEVER become candidate cells (cross-category; excluded from per-cell
saturation). They answer the bet's durability question, not a cell's saturation.

The 6 cells this run:
1. maker-identity × maker-diy-hobbyists
2. learn-to-code × maker-diy-hobbyists
3. learn-to-code × learn-to-code-students
4. retro-gaming-relive × retro-gamers
5. novelty-object-own × edc-aesthetic-collectors
6. music-creation × edc-aesthetic-collectors

---

## SURVIVOR RANKING (cells passing Gates 1–3 in standard mode; all 6 ranked in soft-gate mode)

Growth is the **tilt** — it never qualifies or kills, only orders survivors.

Score = demand magnitude (G1) + believability tier (G2), weighted against sophistication
difficulty (G3, via the 3-variable difficulty model: desire × awareness × sophistication — note
awareness is provisional pending the deep-research step), then tilted by market growth: trend
shape + adjacent signals (virality, search trends, early-adopter behavior).

**Growth never rescues a cell that failed the proven-spend floor or the sophistication gate.**

In soft-gate mode this run: rank all 6 cells by relative demand; Gate-1 flags carry forward as
ranking penalties.

---

## OUTPUT

Write to `runs/<space>/market-selection.md` (for the Arduview run: `runs/arduview/market-selection.md`).
One record per candidate cell (transformation × niche), then the ranked survivor table.

**Per-cell record:**
- **Cell:** `<transformation> × <niche>`
- **Gate 1 — Demand:** pass/flag · qualifying competitors at scale (list + revenue + `run_length_days`) ·
  trend shape · demand magnitude (size + intensity, intensity flagged proxy/VOC). Durability
  UNKNOWN for this run — state blockers.
- **Gate 2 — Product:** pass/kill · named UM axis (`bet_type` + `bet_type_basis`) · believability
  tier · efficacy + economics evidence · mechanisms-in-play `[INFERENCE]` read.
- **Gate 3 — Sophistication:** pass/kill · stage (per-cell typed claims) · required move ·
  executability · defense-quality · dead-ground vs whitespace (per cell).
- **Gate 4 — Awareness:** PENDING DEEP-RESEARCH STEP.
- **Verdict:** PROVISIONAL SURVIVOR (passed Gates 1–3, Gate 4 pending) / killed-at-Gate-N
  (→ flagged-at-Gate-N in soft-gate mode) + the one-line reason.
- **Prose synthesis (4 sentences):** demand is proven by these competitors at this scale with
  this shape, or not · the product wins on this named axis (bet_type), or has no differentiator ·
  the claim space is at this stage with this whitespace so the UM's lead claim has this much work
  and the required move is/isn't executable · awareness PENDING DEEP-RESEARCH STEP.

**SYNTHESIS fencing:** every claim of fact cites observed evidence (brand, figure, source). Any
AI **inference** (a stage read, an intensity proxy, a bridged estimate, the mechanisms-in-play
cluster) is fenced and labeled `[INFERENCE]` with `n=` per cluster — never blended into observed
data.

**Which overrides were applied** (or "ran generic, no overrides provided").

**Stop here.** Present the ranked PROVISIONAL survivors. The operator runs D1 (which survivors
to test).

---

## SELF-AUDIT (run before writing — reject your own output if any fails)

- [ ] **Standing bias 1 — rewarding low competition?** Did any pair score *up* for being quiet?
      Reverse it: low competition usually = no demand (Gate 1's whole purpose).
- [ ] **Standing bias 2 — one competitor treated as proof?** Two-plus-at-scale is the floor
      (unless override #1 is set — and even then, only to a dry test).
- [ ] **Standing bias 3 — sophistication and awareness collapsed?** Awareness is DEFERRED
      ENTIRELY — it is not just "read separately" but not attempted at all for this run.
      Gate 3 and Gate 4 are fully orthogonal and Gate 4 is not run.
- [ ] **Gate order honored?** Gates run 1→3 in fixed order; soft-gate mode flags but does not
      skip the gate-order logic.
- [ ] **Per-cell saturation?** No claim/enhanced-claim count pooled across niche×transformation
      cells. Comparable-bet-seeds excluded from per-cell saturation.
- [ ] **Claims typed?** Every Gate-3 stage read traces to typed claims (`claims[].type`), not
      raw captures or the mis-grained `per_brand[].sophistication` string.
- [ ] **Layer discipline?** No feature labeled a claim, no mechanism labeled a transformation.
- [ ] **DATA GAPs surfaced, not guessed?** Every missing input is `DATA GAP:`, not an invented
      value. `demand_trend: unknown` and `revenue_est: null` are surfaced; `mechanisms_in_play[]`
      is derived `[INFERENCE]` from corpus dumps (not a bare DATA GAP).
- [ ] **A4 not D1?** Output stops at ranked PROVISIONAL survivors; no "we should test X."
- [ ] **Soft-gate mode applied?** Hard kills are flags + ranking penalties; all 6 cells carried
      through to the output.
