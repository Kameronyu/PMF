---
name: market-selection
description: >-
  Evaluate candidate transformation-niche pairs (NTPs) through four ordered kill-gates —
  Demand, Product, Sophistication, Awareness — and rank the survivors for testing. Run this
  AFTER a light-pass market scan (prompts/step1-light-pass.md) has produced the per-brand +
  per-market data contract, when deciding which NTP(s) to take into deep competitor analysis.
  This is PMF Step 0/1 Gate 1 (the bet-selection decision). It does NOT pick the market — it
  produces gate verdicts + a ranked survivor list and presents them for the human's call.
---

# Market Selection — the four selection gates

## Role

You evaluate **transformation-niche pairs (NTPs)**, not markets. One product serves several
pairs; each pair has its own competitive set, proven spend, sophistication stage, and awareness
level. **The pair is the unit of analysis.** You run every candidate pair through four gates in
fixed order and rank the survivors.

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

## Inputs

- `<space>` — the run directory (e.g. `runs/<space>/`).
- The **candidate NTP list** — the pairs to evaluate (operator-supplied or read from the space map).
- The **data contract** below, already collected by the light pass.

---

## INPUT DATA CONTRACT (what each gate consumes — "make sure research gets the info it needs")

A signal is collected only because a gate consumes it. If a required field is absent, you cannot
run that gate. **Emit `DATA GAP: <field> (needed for Gate N)` and halt that gate — never guess
a value.** Exact figure or "not found"; no hand-waving (retrospective §6).

### Per-brand (raw material, collected on each competitor)

| Field | Feeds | In light pass today? |
|---|---|---|
| Transformation(s), **verbatim** | Pair definition + claim landscape | ✅ `claims[]` + classifier |
| Product | Gate 2 (same-category vs different-product-same-transformation) | ✅ `product_observed` |
| Niche | Pair definition + proven-for-your-niche vs adjacent | ✅ `niche_raw` / canonical |
| **Revenue estimate** | Gate 1 floor (two-plus brands at scale) | ❌ **add to schema** |
| Social-proof depth | Gate 3 competitor sophistication + table-stakes proof | ❌ **add** |
| Distribution sophistication | Gate 3 (one funnel vs many; statics vs advertorials; retail+DTC) | ❌ **add** |
| Mechanism / UM | Gate 3 stage read | ✅ `mechanism[]` (per pitch) |
| **Claim TYPE per claim** (direct / enlarged / mechanism / enhanced) | Gate 3 stage identification | ❌ **add — load-bearing** |
| **Ad longevity** (`days_running`; ≥7 = validated, 3 = not) | Gate 1 anti-fluke | ⚠️ partial (`run_length_days` exists; `adlib-one.js` emits `days_running`) |

### Per-market (aggregated across the brand set — the actual decision inputs)

| Field | Feeds | In light pass today? |
|---|---|---|
| Competitor count **at scale** | Gate 1 two-plus anti-fluke | ❌ (needs revenue) |
| Claim count + frequency (**per cell**) | Gate 3 saturation / 5-plus dead-ground rule | ✅ classifier saturation |
| **Enhanced-claim count** | Gate 3 stage — single most load-bearing field; distinguishes Stage 3/4/5 | ❌ **add** |
| Mechanisms-in-play | Gate 3 stage + UM-already-taken check | ⚠️ partial (problem-UM shared-vs-unique exists) |
| **Trend velocity + 5-yr SHAPE** | Gate 1 parabolic anti-fad + growth tilt | ❌ **add (collected fresh)** |
| Adjacent trend signals | Growth tilt | ❌ **add** |
| **Awareness stage of market** | Gate 4 (read funnel education load) | ⚠️ partial (per-creative awareness; no market-level read) |

**The two fields people skip that break the analysis:**
1. **Claim TYPE classification, not just claim capture.** Tagging each claim direct / enlarged /
   mechanism / enhanced is the work — it is the *only* thing that places the stage, and the stage
   is the whole winnability decision. Raw untyped claims force a guessed stage.
2. **Trend SHAPE over five years, not the current value.** A single reading cannot tell durable
   demand from a fad mid-spike.

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
unfixable first. **Run 1→4 in order. Stop at the first kill. No later-gate strength offsets an
earlier kill.** Sophistication (Gate 3) is a kill gate at qualification AND a denominator at
ranking — both roles.

### GATE 1 — Demand is real and not a fluke
The existence question: is anyone *provably* paying for this transformation, for this niche?

- **1.1 Count competitors clearing the revenue floor.** A brand counts only if its revenue
  estimate is at scale **AND** its winning creative ran long enough (`days_running ≥ 7`) to be
  validated, not a spike. → **< 2 qualifying brands = KILL** (the single-operator-on-a-dying-
  mechanism case).
- **1.2 Read the five-year trend shape.** steady / rising / parabolic-spike. → **parabolic spike
  = KILL** (fad signature; current revenue can clear the floor and vanish in 6 months).
- **1.3 Score demand magnitude** (ranking only, does not kill): market size (total proven spend
  across qualifiers) + demand **intensity** (severity · frequency · core-driver proximity — the
  axis revenue doesn't capture). *Intensity needs VOC; at Step 0 use proxy signals and mark it
  `intensity: proxy`. It ranks survivors, it never kills — so the VOC-not-run-at-P0 gap does not
  block this gate.*

**Output:** pass/kill + demand magnitude (size + intensity).
**Trap this gate catches:** a quiet, low-competition market is usually the *absence* of an
opportunity — someone already found nobody pays. **Never reward low competition.**

### GATE 2 — Product delivers and owns one named axis
Does the product produce this transformation for this niche, and beat the proven field on at
least one specific, nameable axis?

- **2.1 Confirm mechanism efficacy** (science / reviews / demonstrable result). → no evidence = KILL.
- **2.2 Locate the differentiating axis** — a differentiator on mechanism AND on avatar. →
  **neither = KILL** (true me-too). The named axis that passes **becomes the UM** (this gate and
  UM identification are one finding).
- **2.3 Rate believability by robustness tier:** Tier 1 self-evident (provable on demo) · Tier 2
  authority (credentialed) · Tier 3 social proof (volume/virality). Record it — it carries to 3.3.
- **2.4 Confirm economics** (COGS, margin, shippability vs operator minimums). → fail = KILL.

**Output:** pass/kill + named UM axis + believability tier.

### GATE 3 — Sophistication decision procedure
Mechanical, not a vibe. How saturated is the claim space → how hard the UM must work to be heard.

- **3.1 Identify the stage** (off the per-cell market aggregate; **requires typed claims**):

  | Stage | Market state |
  |---|---|
  | 1 | New. Few claims, no UMs. |
  | 2 | Early. Claims getting specific, no UMs. |
  | 3 | Growing. UMs appearing, direct claims saturated. |
  | 4 | Established. Multiple UMs, enhanced claims emerging. |
  | 5 | Saturated. Enhanced claims exhausted; identity/status plays. |

- **3.2 Derive the required move:** S1 → direct claim · S2 → enlarged/specified claim · S3 → UM
  differentiation · S4 → enhanced claim on the UM · S5 → identity / extraordinary identification.
- **3.3 Test executability of the required move:**
  - S1/S2: UM has room for a clean statement. Executable.
  - **S3:** is the Gate-2 UM real **AND not already in the mechanisms-in-play set**? If already
    claimed by a qualifying competitor → not a differentiator → **KILL**.
  - **S4:** run the enhanced claim through (a) desirable to the niche, (b) believable. Fail either → **KILL**.
  - **S5:** identity execution is out of scope for a rapid test → **KILL or deprioritize** per operator policy.
- **3.4 Read claim-space defense quality.** "Many competitors making many *differentiated*
  sophisticated claims" vs "many competitors all repeating the *same undifferentiated* claim." The
  second is **weakly defended** at the same count, demand still proven — the best clearable Gate 3.
  Raises the winnability score. The **5-plus-saying-the-same-thing** rule marks saturated claims as
  **dead ground**; what's left is **whitespace**.

**Output:** pass/kill + stage + required move + defense-quality read.
> **Open joint (carry forward, do not silently resolve):** 3.3 routes S4 enhanced-claim
> believability through the Gate-2 *product* believability tier. If enhanced-claim believability
> is a different question than product believability, this is wrong and 3.3 needs its own read.
> Flag it on any pair that hits S4; do not paper over it.

### GATE 4 — Awareness reachability
**Orthogonal to Gate 3 — read independently.** Sophistication says *what* claim to make; awareness
says *whether the customer is warm enough to hear any claim through your ad format*. A market can be
high-sophistication and low-awareness at once. **Never collapse them.**

- **4.1 Identify the market's awareness stage** by reading how much problem-education competitor
  funnels run before they sell (heavy = unaware/problem-unaware; minimal = solution/product-aware).
  → **problem-unaware / unaware for a rapid test = KILL or deprioritize** (education cost high,
  feedback loop slow). Prefer solution-aware / product-aware entry.
- **4.2 Measure the awareness gap** — stages between where the customer sits and where the pitch
  needs them to buy.
- **4.3 Test format bridge capacity vs the gap.** Short-form ad ≈ 1 stage; advertorial / long-form
  bridges more. → **required bridge > format capacity = KILL** (funnel breaks at the handoff even
  when demand and UM are strong).

**Output:** pass/kill + awareness stage + gap-vs-format verdict.

---

## SURVIVOR RANKING (only pairs passing all four gates)

Growth is the **tilt** — it never qualifies or kills, only orders survivors.
`Score = demand magnitude (G1) and believability tier (G2), weighted against sophistication
difficulty (G3), then tilted by market growth (trend velocity + adjacent signals: TikTok
virality, search trends, early-adopter behavior).` A growing market is tailwind. **Growth never
rescues a pair that failed the proven-spend floor or the sophistication gate.**

---

## OUTPUT

Write to `runs/<space>/market-selection.md` (cross-pair, the bet-selection artifact bridging
Step 0 → Step 1). One record per candidate pair, then the ranked survivor table.

**Per-pair record (the synthesis the agent produces):**
- **Pair:** `<transformation> × <niche>`
- **Gate 1 — Demand:** pass/kill · qualifying competitors at scale (list + revenue + `days_running`) ·
  trend shape · demand magnitude (size + intensity, intensity flagged proxy/VOC).
- **Gate 2 — Product:** pass/kill · named UM axis · believability tier · efficacy + economics evidence.
- **Gate 3 — Sophistication:** pass/kill · stage · required move · executability · defense-quality ·
  dead-ground vs whitespace (per cell).
- **Gate 4 — Awareness:** pass/kill · awareness stage · gap-vs-format verdict.
- **Verdict:** SURVIVOR / killed-at-Gate-N + the one-line reason.
- **Prose synthesis (4 sentences):** demand is proven by these competitors at this scale with this
  shape, or not · the product wins on this named axis, or has no differentiator and dies · the claim
  space is at this stage with this whitespace so the UM's lead claim has this much work and the
  required move is/ isn't executable · the customer sits at this awareness stage and the format can/
  can't carry them.

**SYNTHESIS fencing:** every claim of fact cites observed evidence (brand, figure, source). Any
AI **inference** (a stage read, an intensity proxy, a bridged estimate) is fenced and labeled
`[INFERENCE]` — never blended into observed data.

**Stop here.** Present the ranked survivors. The operator runs D1 (which survivors to test).

---

## SELF-AUDIT (run before writing — reject your own output if any fails)

- [ ] **Standing bias 1 — rewarding low competition?** Did any pair score *up* for being quiet?
      Reverse it: low competition usually = no demand (Gate 1's whole purpose).
- [ ] **Standing bias 2 — one competitor treated as proof?** Two-plus-at-scale is the floor.
- [ ] **Standing bias 3 — sophistication and awareness collapsed?** Gate 3 and Gate 4 read separately.
- [ ] **Gate order honored?** First kill stops the chain; no later-gate strength resurrected a pair.
- [ ] **Per-cell saturation?** No claim/enhanced-claim count pooled across niche×transformation cells.
- [ ] **Claims typed?** Every Gate-3 stage read traces to typed claims, not raw captures.
- [ ] **Layer discipline?** No feature labeled a claim, no mechanism labeled a transformation.
- [ ] **DATA GAPs surfaced, not guessed?** Every missing input is `DATA GAP:`, not an invented value.
- [ ] **A4 not D1?** Output stops at ranked survivors; no "we should test X."
