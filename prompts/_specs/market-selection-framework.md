<!-- SOURCE-OF-TRUTH STRATEGY SPEC (verbatim, untouched). Build prompts FROM this; do not re-litigate.
     Operationalized as .claude/skills/market-selection/SKILL.md — that skill is the runnable rendering;
     this file is Kam's original framework, the canonical sauce. -->

# Market Selection Framework

What an NTP (new transformation-niche pair) must pass to be selected for testing, and the information required to judge it.

---

## What you are deciding

You do not pick a market. You evaluate transformation-niche pairs. One product serves several pairs, and each pair has its own competitive set, proven spend, sophistication stage, and awareness level. A transformation is what the product claims it will do for the customer. A niche is the specific person you sell it to. The pair is the unit of analysis.

Run every candidate pair through four gates in fixed order. The survivors are the tests.

A unique mechanism is always assumed present. The operator does not enter a market without a UM. The job is never to ask whether a UM exists. It is to read how much work that UM has to do given what the competition has already said.

---

## Why the gates are ordered

Gates run in increasing order of how reversible a failure is.

- Gate 1 fails on facts about the world the operator cannot change.
- Gate 2 fails on facts about the product, slow to change.
- Gate 3 fails on the claim landscape, sometimes survivable by changing the angle the UM leads with.
- Gate 4 fails on awareness reachability, often survivable by changing ad format.

Eliminate on the cheap and unfixable first, so no creative or testing budget is ever spent discovering what an earlier gate would have revealed for free.

Rules:
- Run gates 1 to 4 in order. Stop at the first kill.
- No later-gate strength offsets an earlier kill. A pair that fails Gate 1 is dead no matter how clean its Gate 3 looks.
- Sophistication (Gate 3) is a kill gate at qualification and a denominator at ranking. Both roles, not one.

---

## The spine

The whole framework is one ratio, unrolled into gates:

**Trend velocity = (desire to solve x d2c feasibility) / market sophistication**

- Desire to solve is the demand numerator. Gate 1.
- D2C feasibility is your ability to deliver. Gate 2.
- Market sophistication is the competitive denominator. Gate 3, with the correction that it also kills, not just divides.
- Market growth sits outside the ratio as a tilt that ranks survivors. Not a gate.

---

## GATE 1 — Demand is real and not a fluke

The existence question. Is anyone provably paying for this transformation for this niche. Computed from the desire-to-solve numerator.

**Step 1.1 — Count competitors clearing the revenue floor.**
A brand qualifies as a data point only if its revenue estimate is at scale AND its winning creative has run long enough to be validated rather than a momentary spike. Count qualifying brands.
- Fewer than 2 qualifying brands = KILL. One brand at scale is the single-operator-riding-a-dying-mechanism case. It does not prove a market.

**Step 1.2 — Read the five-year trend shape.**
Classify as steady, rising, or parabolic spike.
- Parabolic spike = KILL. Spike shape is a fad signature. Current revenue can clear the floor and still vanish in six months.
- Steady or rising = pass the floor.

**Step 1.3 — Score demand magnitude (only if floor passed).**
This does not kill. It ranks survivors against each other.
- Market size: total proven spend across qualifying competitors. Larger = stronger.
- Demand intensity, which revenue does not capture: severity, frequency, core-driver proximity. A market can be large and shallow or small and desperate. Intensity is the second axis.

**Gate 1 output:** pass/kill + demand magnitude (size + intensity).

**The trap this gate exists to catch:** an open, quiet, low-competition market is not an opportunity, it is usually the absence of one. Markets are quiet because someone already found out nobody pays. Never reward a pair for low competition. Reward proven, durable, multi-competitor spend.

---

## GATE 2 — Product delivers and owns one named axis

Does the product actually produce this transformation for this niche, and does it beat the proven field on at least one specific, nameable axis. Computed from the d2c feasibility numerator.

**Step 2.1 — Confirm mechanism efficacy.**
Is there evidence the product actually produces the transformation. Science, reviews, demonstrable result.
- No efficacy evidence = KILL.

**Step 2.2 — Locate the differentiating axis.**
Check for a differentiator on mechanism AND a differentiator on avatar.
- Neither present = KILL (true me-too). Entering a proven market as the nth identical voice teaches nothing and costs a full test cycle.
- The named axis that passes becomes the UM. This gate and UM identification are one finding.

**Step 2.3 — Rate believability by robustness tier.**
Assign the strongest available proof type:
- Tier 1, self-evident: provable on demo (vacuum picks up dog hair on demand).
- Tier 2, authority: credentialed source, doctors, science.
- Tier 3, social proof: volume, virality, trend velocity.
Record the tier. It carries to Gate 3 Step 3.3.

**Step 2.4 — Confirm economics.**
COGS, margin, shippability against the operator's minimums.
- Economics fail = KILL.

**Gate 2 output:** pass/kill + named UM axis + believability tier.

---

## GATE 3 — Sophistication decision procedure

How saturated is the claim space, which sets how hard the UM has to work to be heard. Mechanical, not a vibe read. Identify the stage, derive the required move, test whether you can execute it.

**Step 3.1 — Identify the stage.**
Read claim count and enhanced-claim count off the market aggregate. Requires claims to arrive typed.

| Stage | Market state |
|---|---|
| 1 | New market. Few claims, no UMs in play. |
| 2 | Early competition. Claims present, getting specific, no UMs. |
| 3 | Growing. UMs appearing, direct claims saturated. |
| 4 | Established. Multiple UMs in play, enhanced claims emerging. |
| 5 | Saturated. Enhanced claims exhausted, identity and status plays. |

**Step 3.2 — Derive the required move from the stage.**

| Stage | Required move |
|---|---|
| 1 | Direct claim |
| 2 | Enlarged / specified claim |
| 3 | UM differentiation |
| 4 | Enhanced claim on top of the UM |
| 5 | Identity / extraordinary identification |

**Step 3.3 — Test executability of the required move.**
- Stage 1 or 2: the UM has room to make a clean statement. Executable.
- Stage 3: is the UM (from Gate 2) real AND not already in the mechanisms-in-play set. If the intended UM is already claimed by a qualifying competitor, it is not a differentiator = KILL.
- Stage 4: run the enhanced claim through two tests. (a) Is it desirable to the niche. (b) Is it believable. Fail either = KILL.
- Stage 5: identity execution is out of scope for a rapid test = KILL or deprioritize per operator policy.

**Step 3.4 — Read claim-space defense quality.**
Distinguish "many competitors making many differentiated sophisticated claims" from "many competitors all repeating the same undifferentiated claim." The second is weakly defended even at the same competitor count, and the demand is still proven. This is the best version of a clearable Gate 3. It raises the winnability score for survivors. The 5-plus-competitors-saying-the-same-thing rule marks saturated claims as dead ground; what is left is the whitespace.

**Gate 3 output:** pass/kill + stage + required move + defense-quality read.

> **Open joint, not yet settled.** Step 3.3 routes Stage 4 enhanced-claim believability through the Gate 2 product believability tier. If enhanced-claim believability is a different question than product believability, this is wrong and Step 3.3 needs its own believability read. Resolve before finalizing.

---

## GATE 4 — Awareness reachability

Orthogonal to Gate 3. Read independently. Sophistication tells you what claim to make. Awareness tells you whether the customer is warm enough to hear any claim through your ad format. A market can be high-sophistication and low-awareness at once. Never collapse them into one saturation read.

**Step 4.1 — Identify the market's awareness stage.**
Read how much problem-education the competitor funnels perform before they sell. Heavy education = problem-unaware or unaware. Minimal = solution-aware or product-aware.
- Problem-unaware or unaware for a rapid test = KILL or deprioritize per operator policy. Education cost is high and the feedback loop is slow. Prefer solution-aware or product-aware entry where the customer already knows a solution exists and just needs repositioning.

**Step 4.2 — Measure the awareness gap.**
Stages between where the customer currently sits and where the pitch needs them to buy.

**Step 4.3 — Test format bridge capacity against the gap.**
Short-form ad bridges roughly 1 stage. Advertorial or long-form bridges more.
- Required bridge greater than format capacity = KILL. The funnel breaks at the handoff even when demand and UM are both strong.

**Gate 4 output:** pass/kill + awareness stage + gap-vs-format verdict.

---

## Survivor ranking (only on pairs passing all four gates)

Growth is the tilt. It never qualifies or kills, it only orders survivors.

Score = demand magnitude (Gate 1) and believability tier (Gate 2) weighted against sophistication difficulty (Gate 3), then tilted by market growth: trend velocity + adjacent trend signals (TikTok virality, search trends, early-adopter behavior). A growing market is tailwind. Growth never rescues a pair that failed the proven-spend floor or the sophistication gate.

---

## Information required to run the framework

The data contract. A signal is collected only because a gate consumes it. Two levels: per-brand (raw material) and per-market (the actual decision inputs, mostly aggregated from per-brand).

### Per-brand (collected on each competitor)

| Field | Feeds |
|---|---|
| Transformation(s), verbatim | Pair definition + claim landscape. Verbatim because exact claims are counted for saturation. |
| Product | Gate 2, same-category vs different-product-same-transformation. |
| Niche | Pair definition + whether spend is proven for your niche or an adjacent one. |
| Revenue estimate | Gate 1 floor. Per-brand because the floor is two-plus brands each at scale. |
| Social proof depth | Competitor sophistication + table-stakes proof level the market now expects. |
| Distribution sophistication | Competitor sophistication. One funnel vs many, statics vs advertorials, retail + DTC. |
| Mechanism / UM | Gate 3 stage read. How you count whether UMs are in play. |
| Claim type per claim | Gate 3 stage identification. Each claim tagged direct / enlarged / mechanism / enhanced. |
| Ad longevity | Gate 1 anti-fluke. 7-plus days = validated creative; 3 days is not. |

### Per-market (aggregated across the brand set; the decision inputs)

| Field | Feeds |
|---|---|
| Competitor count at scale | Gate 1 anti-fluke, the two-plus rule. Catches the single-corpse case. |
| Claim count + frequency | Gate 3 saturation. The 5-plus-saying-the-same-thing rule. Saturated = dead ground; gaps = whitespace. |
| Enhanced claim count | Gate 3 stage. The single most load-bearing field: distinguishes Stage 3 / 4 / 5. Without it the required move cannot be derived. |
| Mechanisms in play | Gate 3 stage + UM-already-taken check. If your UM is already three competitors' UM, it is not a differentiator. |
| Trend velocity + shape | Gate 1 parabolic anti-fad check + survivor-ranking growth tilt. Collect the five-year shape, not just the current value. |
| Adjacent trend signals | Growth tilt. Early demand not yet visible in competitor revenue. |
| Awareness stage of market | Gate 4 reachability. Not derivable from sophistication fields. Collected on its own by reading funnel education load. |

### The two fields people skip that break the analysis

- **Claim TYPE classification, not just claim capture.** Listing claims is easy. Tagging each as direct / enlarged / mechanism / enhanced is the work, and it is the only thing that places the stage. Raw untyped claims force the agent to guess the stage, and the stage is the whole winnability decision.
- **Trend SHAPE over five years, not the current value.** A single reading cannot tell durable demand from a fad mid-spike. The shape is what protects Gate 1 from clearing on a market that will not exist in six months.

### How the two levels relate

Per-brand collection exists almost entirely to be aggregated. Revenue rolls up to competitor-count-at-scale. Claims roll up to claim-frequency and enhanced-claim-count. Mechanisms roll up to mechanisms-in-play. The only per-brand fields used directly rather than aggregated are the ones that qualify a brand as a valid data point at all: revenue and ad longevity, the anti-fluke filters. Two per-market fields do not aggregate from brands and must be collected fresh: trend shape and awareness stage.

---

## Standing biases to correct for

Three errors a market evaluation drifts into. The agent should actively watch for them.

1. **Rewarding low competition.** Low competition usually means no demand. Gate 1 exists to reject it.
2. **Treating one competitor at scale as proof.** It is not. Two-plus is the anti-fluke floor.
3. **Collapsing sophistication and awareness into one saturation feeling.** Different axes, different responses, read separately. Gate 3 vs Gate 4.

---

## Per-pair synthesis the agent produces

For each pair, state:
- Demand is proven by these competitors at this scale with this trend shape, or it is not.
- The product wins on this named axis, or it has no differentiator and dies.
- The claim space is at this stage with these claims saturated and this whitespace remaining, so the UM's lead claim has this much work to do, and the required move is or is not executable.
- The customer sits at this awareness stage and the intended format can or cannot carry them to purchase.

A surviving pair: demand is real and durable, the product has a genuine differentiating axis, the claim space leaves room for the UM to be heard via an executable required move, and the awareness gap is bridgeable by the intended format. That is the testable hypothesis the rest of the system acts on.
