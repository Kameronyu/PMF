# Arduview Market-Selection Gate Record (DR-grounded re-run)

**RUN MODE:** soft-gate, PROVISIONAL — Gate 4 (awareness) DEFERRED TO DEEP-RESEARCH STEP
**Status of every survivor below:** PROVISIONAL — passed Gates 1–3; Gate 4 (awareness reachability) PENDING DEEP-RESEARCH STEP
**Operator overrides applied:** All 4 SET (mapped from `runs/arduview/pre-research-plan.md` §"Supply-side validation stance" + §"Deferred reads")
**Grounding:** DR bundle (`_dr-context.generated.md`, 5/5 files) read before running. Mechanisms-in-play read as OBSERVED data from `space-map.json` (BREAK 5 resolved) — no corpus derivation, no `[INFERENCE]` cluster. This supersedes the prior run (executor `ac45de593dcd40346`), which ran with zero DR grounding and derived mechanisms from corpus dumps.

---

## #1 BLOCKER — Fix the Trends fetch (Phase 1)

`demand_trend.shape == "unknown"` for ALL 20 brands. Every cell is stamped **durability UNKNOWN**. Resolve before any committed bet pick (MOQ/production).

**Two bare DATA GAPS this run:**

1. `demand_trend.shape == "unknown"` — ALL 20 brands. No durability signal. Every Gate 1 record stamps "durability UNKNOWN — Gate 1 cannot clear with confidence" (D-09).
2. `revenue_est.value_usd_monthly == null` — ALL 20 brands. No monthly-revenue floor signal. Gate 1 runs on crowdfunding + ad-longevity + structural bet evidence only. **No absolute revenue floor applied** — the $300–500K/mo floor from `ecommerce--mark-builds-brands.md` is MISCALIBRATED for this hardware category (SKILL.md caution; do NOT apply).

**RESOLVED (no longer a DATA GAP):** `mechanisms_in_play[]` is now a first-class field in `space-map.json` — a top-level space-wide catalog AND a per-combo `mechanisms_in_play[]` on each cell. Read directly as observed data; the old corpus-derivation stopgap is RETIRED.

**Ad-longevity verification:** `combos[].anti_fluke.qualifying_creatives = 0` in all 6 cells (pre-counted; read, not recounted). Cross-checked against the on-disk ads files: `ads/anbernic.json` and `ads/divoom.json` (the only two non-seed candidate-cell brands with `ads_flag="yes"`) both return **0 ads / empty `run_length_days`** — confirms no creative in any candidate cell cleared the 7-day floor. The only dense ads file is `flipper-zero.json` (a `comparable_bet_seed`, excluded from candidate cells).

**Comparable-bet-seed brands = BET-EVIDENCE only** (never candidate cells): arduboy, flipper-zero, nothing-phone, skeleton-key.

---

## Space-wide mechanism read (observed — context for every cell's Gate 2.2 / 3.3)

| Mechanism (canonical) | Space-wide brand_count | Ownability | Note |
|---|---|---|---|
| Distinctive low-res / monochrome / pixel display **as the medium** | 4 | **shared** | thumby, divoom, playdate, +1. The "cool pixel/monochrome display" lane is TAKEN space-wide. |
| Code-the-hardware-yourself / built-in dev toolchain (Arduino-compatible SDK + editors) | 3 | **shared** | gameshell, thumby, pico-8. The "program-it-yourself" lane is TAKEN space-wide. |
| Built-in synth/sequencer/drum-machine engine | 2 | unique | pocket-operator (+1) |
| Cartridge-based / one-cart-fits-all library | 2 | unique | analogue-pocket, evercade |
| Online cartridge/community browser | 2 | unique | pico-8, divoom |
| RP2040 / Raspberry-Pi SBC core | 2 | unique | pwnagotchi, thumby |
| Runs existing game engines / emulation core | 2 | unique | gameshell, evercade |
| (10 further mechanisms at brand_count 1 — all unique) | 1 | unique | crank, FPGA, exposed-PCB, IPS-mod, on-device-AI, etc. |

**Load-bearing consequence for Arduview's UM:** Arduview's display is itself a `128×64 monochrome OLED` — falls inside the **shared (n=4)** "distinctive monochrome/pixel display as the medium" mechanism. Arduview's UM must be `transparent / see-through display`, not "distinctive display." "Genuine see-through OLED" appears in NO catalog entry.

---

## Cell Records (All 6 Combos, Soft-Gate Mode)

---

### Cell 1: maker-identity × maker-diy-hobbyists

**Brands in cell (live, in-geo, non-seed):** thumby, gameshell, pwnagotchi, pimoroni, sparkfun
`brand_count = 5` | `claim_count = 3` | `enhanced_claim_count = 0` | `anti_fluke.qualifying_creatives = 0`

#### Gate 1 — Demand
- **Revenue:** `value_usd_monthly = null` for all 5. No floor signal; not papered over.
- **Ad longevity:** `qualifying_creatives = 0`. No creative ran 7+ days. `ads_flag`: unsure (thumby, gameshell, pimoroni, sparkfun), no (pwnagotchi).
- **Crowdfunding:** gameshell → Kickstarter, raised $350,000+, 700%+ funded, status **funded-shipped**.
- **Trend:** unknown for all 5 → **durability UNKNOWN — Gate 1 cannot clear with confidence.**
- **Scale-gate verdict (soft-gate):** 5 brands present; 0 qualifying creatives; revenue null; 1 funded-shipped comparable. Under the one-comparable override (SET → DRY TEST only). FLAG; ranking penalty.
- **Demand magnitude (1.3):** FLAG: "requires separate community-heat read — not scored here."
- **Gate 1 verdict:** FLAG — crowdfunding (gameshell) gives one strong comparable; revenue null; ad-longevity 0; trend unknown. Proceeds under one-comparable override. Durability UNKNOWN.

#### Gate 2 — Product
- **2.1 Efficacy:** PASS.
- **2.1b Spend-transfer:** gameshell's crowdfunding spend is on an open-source modular game console — same product-category as Arduview. No transfer risk.
- **2.1c Price-conditioning:** `price_points` band — thumby $19.99–24.99, gameshell $159, pimoroni $29–59, sparkfun none, pwnagotchi none. Open-hardware/maker band ≈ **$20–$160**. FLAG: operator price must be calibrated against $20–$160; routed to 2.4. Operator COGS pending.
- **2.2 Differentiating axis (observed mechanisms):** competing bets — thumby `novel-hardware-as-lead` (miniaturization), gameshell `open-source-hackability-as-lead`, pwnagotchi `open-source-hackability-as-lead`, pimoroni/sparkfun `maker-ecosystem-store`.
  Cell `mechanisms_in_play[]` (all `ownability:"unique"` at cell grain): code-the-hardware-yourself (gameshell, thumby — n=2, borderline), RP2040 core (pwnagotchi, thumby — n=2), monochrome-display-as-medium (thumby — n=1), on-device-AI (pwnagotchi — n=1), preloaded-games (thumby — n=1), modular dev board (gameshell — n=1), runs-game-engines (gameshell — n=1).
  **Space-grain caution:** code-the-hardware-yourself is `shared` (n=3) space-wide and monochrome-display-as-medium is `shared` (n=4) space-wide. **Arduview's `transparent display` is in NO mechanism entry (cell or space) → ownable UM.**
  UM axis: `novel-hardware-as-lead` on the **transparency** axis. **Craft-credibility tension:** UM strength conditional on maker sub-identity — flag as conditional.
- **2.3 Believability:** Tier 1 self-evident. gameshell's funded-shipped raise = social proof for the open-source maker niche.
- **2.4 Economics:** COGS pending. FLAG "economics pending operator COGS."
- **Gate 2 verdict:** PASS (provisional) — delivers the transformation; ownable UM = transparent-display-as-lead; Tier-1 believability; UM strength conditional on maker sub-identity; economics pending.

#### Gate 3 — Sophistication
- **3.1 Stage:** `claims[].type` = direct ×3, enlarged ×0, `enhanced_claim_count = 0`. Highest tier deployed by 2+ brands = `direct` → **Stage 1**. Cross-check `per_brand[].sophistication`: thumby/gameshell/pwnagotchi all "Stage 1" — agrees, no disagreement.
- **3.2 Required move:** Stage 1 → direct claim (or Stage-2 enlarged). UM has room for a clean statement.
- **3.3 Executability:** Stage 1/2 — UM has room. Transparent-display mechanism not in the cell's (or space's) mechanism set → not taken → executable.
- **3.4 Defense quality:** 3 direct claims from 5 brands. Below the 5+-same-claim dead-ground threshold. Whitespace open for mechanism-level differentiation.
- **Gate 3 verdict:** PASS — Stage 1; required move = direct/enlarged claim; transparency UM executable and unclaimed; whitespace open.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** — passed Gates 1–3, Gate 4 PENDING. Flags: Gate 1 crowdfunding-only demand, revenue null, trend unknown, community-heat deferred; Gate 2 UM conditional on maker sub-identity, economics pending; Gate 3 Stage 1 full whitespace.

---

### Cell 2: learn-to-code × maker-diy-hobbyists

**Brands (live, in-geo, non-seed):** thumby, pico-8
`brand_count = 2` | `claim_count = 3` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- **Revenue:** null (both). **Ad longevity:** 0 qualifying; `ads_flag` no (pico-8), unsure (thumby). **Crowdfunding:** none. **Trend:** unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 2 brands present; 0 qualifying creatives; no crowdfunding; revenue null. Below the one-comparable override threshold (no funded-shipped signal). FLAG: thinnest signal class; heavy ranking penalty.
- **Demand magnitude:** pico-8 $14.99 (software) + thumby $19.99–24.99 — low AOV ceiling. FLAG: thin; intensity unknown.
- **Gate 1 verdict:** FLAG — brand-presence only; revenue null, ad-longevity 0, no crowdfunding, trend unknown.

#### Gate 2 — Product
- **2.1 Efficacy:** Arduino-IDE / programmable hardware delivers learn-to-code. PASS.
- **2.1b Spend-transfer:** pico-8 is SOFTWARE ($14.99), not hardware. FLAG: "hardware-to-code demand weaker; partly proven on software (pico-8)."
- **2.1c Price-conditioning:** $15–$25 band. Very low ceiling; any Arduview price >~$80 faces a steep conditioning gap with no differentiator in this cell.
- **2.2 Differentiating axis (observed):** bets — thumby `novel-hardware-as-lead`, pico-8 `open-source-hackability-as-lead`. Cell mechanisms (all `unique` at cell grain): code-the-hardware-yourself (pico-8, thumby — n=2), monochrome-display-as-medium (pico-8, thumby — n=2), synth engine (pico-8 — n=1), community browser (pico-8 — n=1), preloaded-games (thumby — n=1), RP2040 (thumby — n=1). **Space-grain:** both n=2 cell mechanisms (toolchain, display-medium) are `shared` space-wide. Arduview's transparency is unclaimed. FLAG: weak UM fit for this transformation.
- **2.4 Economics:** $15–$25 conditioning; no differentiator justifies an Arduview premium in this cell.
- **Gate 2 verdict:** FLAG — delivers learn-to-code, but no compelling differentiating axis here and price conditioning far below viable Arduview pricing.

#### Gate 3 — Sophistication
- **3.1 Stage:** direct ×3, enlarged ×0 → **Stage 1**. Cross-check: thumby "Stage 1", pico-8 "Stage 2". Disagreement flagged; cell-grain rule governs → **Stage 1**.
- **3.2–3.4:** Stage 1 → direct/enlarged; transparency unclaimed but weak-fit; weakly defended, whitespace open.
- **Gate 3 verdict:** PASS — Stage 1, whitespace; but Gate 1/2 flags dominate.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3, Gate 4 PENDING. Flags: Gate 1 heavy (no qualifying signals); Gate 2 weak UM fit + price conditioning misaligned.

---

### Cell 3: learn-to-code × learn-to-code-students

**Brands (live, in-geo, non-seed):** thumby, pico-8 (meowbit: page 404, excluded)
`brand_count = 2` | `claim_count = 2` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- Revenue null; 0 qualifying ads; no crowdfunding; trend unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 2 brands, 0 qualifying, no crowdfunding. FLAG: thin supply-side signal; real spend may sit on uncaptured institutional channels. Ranking penalty.
- **Demand magnitude:** pico-8 $14.99 + thumby $19.99–24.99 — low consumer WTP.
- **Gate 1 verdict:** FLAG — thin, with the caveat that institutional spend is unrepresented here.

#### Gate 2 — Product
- **2.1 Efficacy:** delivers programmability. PASS. **2.1b:** pico-8 software; meowbit (most student-targeted) 404, uncounted — data thin on dedicated student hardware. **2.1c:** same $15–$25 band; steep gap.
- **2.2 (observed):** same two brands as Cell 2 → same cell mechanisms (code-the-hardware-yourself n=2, monochrome-display-as-medium n=2, both shared space-wide; plus pico-8's synth/community, thumby's preloaded/RP2040 at n=1). Transparency unclaimed but weak-fit for a student learn-to-code hook. FLAG.
- **Gate 2 verdict:** FLAG — weak UM alignment for transparent-display hardware in a student context.

#### Gate 3 — Sophistication
- **3.1 Stage:** direct ×2 → **Stage 1**. Cross-check: thumby "Stage 1", pico-8 "Stage 2" — same disagreement as Cell 2; cell-grain governs → Stage 1.
- **3.2–3.4:** Stage 1, executable, whitespace open.
- **Gate 3 verdict:** PASS — Stage 1.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3, Gate 4 PENDING. Flags: Gate 1 heavy; Gate 2 weak UM fit.

---

### Cell 4: retro-gaming-relive × retro-gamers

**Brands (live, in-geo, non-seed):** analogue-pocket, evercade, bitboy (anbernic: brand presence, no verbal claims typed; miyoo: excluded, defunct/region-only per D-08)
`brand_count = 3` | `claim_count = 3` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- Revenue null (all). Ad longevity: `qualifying_creatives = 0`; `ads_flag = "yes"` for anbernic (presence, not 7+-day longevity — verified `ads/anbernic.json` = 0 ads / empty `run_length_days`); unsure for the rest. Crowdfunding: none. Trend: unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 3 brands at scale (analogue-pocket $219.99, evercade $79.99–129.99, bitboy $29.99–49.99) + anbernic at presence (confirmed live ads). The MOST active candidate field by brand-at-presence density. But no 7+-day ad longevity captured; revenue null. FLAG; moderate ranking penalty.
- **Demand magnitude:** Price band $30–$220.
- **Gate 1 verdict:** FLAG — multi-brand active field, confirmed ad presence (anbernic), but no longevity validation; revenue null; trend unknown. Stronger demand breadth than Cells 2/3; weaker validation than Cell 1.

#### Gate 2 — Product
- **2.1 Efficacy:** Arduview (~50g, 2.42" 128×64 OLED, ~2hr battery, 400 preloaded games on W25Q128) delivers retro-gaming at Arduboy/small-catalog scale, NOT at emulation-breadth scale. FLAG: delivers retro-gaming, but not at the emulation breadth competitors lead with.
- **2.1b Spend-transfer:** FLAG: "demand proven for retro-gaming, but primarily on emulation-breadth + hardware-authenticity categories — transfer to an Arduboy-scale catalog unproven."
- **2.1c Price-conditioning:** $30 (bitboy) → $220 (analogue-pocket), mid $80–$130 (evercade).
- **2.2 Differentiating axis (observed):** bets — analogue-pocket / evercade / bitboy all `hardware-authenticity-as-lead`; anbernic `value-breadth-as-lead`. Cell `mechanisms_in_play[]` (all `unique` at cell grain): cartridge-library (analogue-pocket, evercade — n=2), FPGA-hardware-accurate (analogue-pocket — n=1), IPS-mod display (bitboy — n=1), premium high-density display (analogue-pocket — n=1), runs-game-engines (evercade — n=1). **Three of the four bets converge on hardware-authenticity.** Arduview's transparency mechanism is unclaimed, BUT it is a novelty/aesthetic mechanism, **cross-grain** to an authenticity-dominant cell. FLAG: "transparent OLED is a novelty mechanism, not an authenticity mechanism — Arduview cannot match the cell's dominant bet."
- **Gate 2 verdict:** FLAG — delivers retro-gaming at Arduboy-catalog scale only; cannot compete on emulation breadth (anbernic) or FPGA/cartridge authenticity (analogue-pocket, evercade); its ownable mechanism cross-cuts the cell's authenticity-dominant demand.

#### Gate 3 — Sophistication
- **3.1 Stage:** cell `claims[].type` = direct ×3. Cell-grain mechanical rule → **Stage 1–2**. Per-brand disagree upward: analogue-pocket **"Stage 3"** (named mechanism: "two FPGAs, no emulation"), evercade **"Stage 2"** (enlarged: "biggest collection of licensed cartridges"), bitboy **"Stage 2"** (enlarged: IPS-specified). Disagreement flagged; true cell state ≈ **Stage 2, edging Stage 3** (2 brands at Stage 2, 1 at Stage 3). Primary verdict: **Stage 2** (conservative); analogue-pocket signals Stage-3 motion.
- **3.2 Required move:** Stage 2 → enlarged/specified claim; Stage-3 approach → UM differentiation.
- **3.3 Executability:** FPGA-no-emulation UM (analogue-pocket, `ownability:"unique"` n=1) is NOT one Arduview can claim. Arduview's transparency UM is unclaimed in the cell but credibility for *retro-authenticity* is doubtful. Marginal.
- **3.4 Defense quality:** multiple distinct mechanisms (FPGA, licensed carts, IPS) — moderately defended; FPGA-authenticity axis strongly held by analogue-pocket. Whitespace exists only in the novelty/value-breadth lane, weakly aligned to the cell's authenticity demand.
- **Gate 3 verdict:** PASS (marginal) — Stage 2 (Stage-3 elements); UM has room but the dominant authenticity mechanism is taken and Arduview's mechanism cross-cuts the cell.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3 with flags, Gate 4 PENDING. Flags: Gate 1 moderate; Gate 2 (transfer unproven, UM cross-grain); Gate 3 marginal (Stage 2–3).

---

### Cell 5: novelty-object-own × edc-aesthetic-collectors

**Brands (live, in-geo, non-seed):** playdate, pocket-operator, divoom (nothing-phone: excluded, comparable_bet_seed)
`brand_count = 3` | `claim_count = 4` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- Revenue null (all). Ad longevity: `qualifying_creatives = 0`; `ads_flag = "yes"` for divoom (presence — verified `ads/divoom.json` = 0 ads / empty `run_length_days`); unsure for playdate, pocket-operator. Crowdfunding: none. Trend: unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 3 brands at scale; divoom confirmed ad presence; nothing-phone ($549–699, `comparable_bet_seed`, `novel-hardware-as-lead` at massive scale) is adjacent BET-EVIDENCE. One-comparable override (SET): bet-evidence justifies testing, not commitment.
- **Demand magnitude:** Price band $30 (divoom) – $199 (playdate). FLAG: community-heat read deferred; magnitude proxy unknown.
- **Gate 1 verdict:** FLAG — multi-brand field, adjacent bet-evidence (nothing-phone), divoom ad presence; qualifying creatives 0; revenue null; trend unknown. Strongest flag profile after Cell 1's crowdfunding. Community-heat read required.

#### Gate 2 — Product
- **2.1 Efficacy:** transparent OLED is the showpiece for the novelty-object-own transformation. Strong fit. PASS.
- **2.1b Spend-transfer:** spend is ON this product-category — novelty/aesthetic gadgets (playdate, divoom, pocket-operator). No transfer risk. **No craft-credibility tension here** (pure aesthetic, per pre-research-plan: "Strongest UM-to-transformation match").
- **2.1c Price-conditioning:** $30–$199 band; playdate $199 is the indie novel-hardware ceiling. Arduview at ~$80–$160 well-conditioned.
- **2.2 Differentiating axis (observed):** ALL THREE brands share bet_type `novel-hardware-as-lead`. Cell `mechanisms_in_play[]` (all `unique` at cell grain): **monochrome/pixel-display-as-medium (divoom, playdate — n=2)**, app-controlled pixel-art (divoom — n=1), synth engine (pocket-operator — n=1), caseless single-PCB (pocket-operator — n=1), long battery (pocket-operator — n=1), novel analog input / crank (playdate — n=1), community browser (divoom — n=1).
  **"Distinctive display-as-medium" mechanism is already occupied by 2 brands in this cell and `shared` (n=4) space-wide.** Transparency specifically appears in NO entry → ownable slice. Arduview occupies the cell's dominant `novel-hardware-as-lead` bet AND an unclaimed mechanism (transparent display). **Best UM-to-cell fit of the 6 cells** — with the qualifier that it must lead on transparency, not display-distinctiveness.
- **2.3 Believability:** Tier 1 self-evident. pocket-operator's exposed-PCB-as-design is a proven-believable precedent that "transparent hardware IS the product."
- **2.4 Economics:** conditioned $30–$199; pocket-operator $49–89 and playdate $199 bracket the viable range. COGS pending. FLAG.
- **Gate 2 verdict:** PASS (strong) — delivers the transformation; ownable UM = transparent-display (within an occupied display-as-medium lane, differentiated on transparency); bet_type aligns with the cell's uniform pattern; Tier-1 believability; reasonable price band; no craft-credibility tension.

#### Gate 3 — Sophistication
- **3.1 Stage:** `claims[].type` = direct ×3, enlarged ×1 (pocket-operator); `enhanced_claim_count = 0`. Highest tier deployed by 2+ brands = `direct` → **Stage 1**, with Stage 2 entering (1 brand enlarged). Cross-check: playdate "Stage 1", divoom "Stage 1", pocket-operator "Stage 2" — agrees; cell-grain → **Stage 1–2 (transitioning)**.
- **3.2 Required move:** Stage 1/2 — UM has room for a direct or enlarged statement; transparency UM has clean whitespace to enter.
- **3.3 Executability:** transparency mechanism not present in any cell competitor's array → not taken → executable.
- **3.4 Defense quality:** 4 claims from 3 brands, each leading a DISTINCT mechanism (crank / exposed-PCB / LED-pixel-art) — mechanism-differentiated, NOT the 5+-same-claim dead-ground pattern. Whitespace open; a new-mechanism entrant faces low defense resistance.
- **Gate 3 verdict:** PASS — Stage 1–2; transparency UM executable; whitespace open; defense mechanism-differentiated, not saturated.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** — passed Gates 1–3, Gate 4 PENDING. Best UM-to-cell alignment in the set. Flags: Gate 1 (revenue null, ad-longevity 0, trend unknown — community-heat deferred); Gate 2 economics pending.

---

### Cell 6: music-creation × edc-aesthetic-collectors

**Brands (live, in-geo, non-seed):** pocket-operator (only)
`brand_count = 1` | `claim_count = 3` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`
`_note`: single brand — below the 2+ anti-fluke floor.

#### Gate 1 — Demand
- Revenue null; 0 qualifying ads; no crowdfunding; trend unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 1 brand (pocket-operator) — BELOW the 2+ floor. One-comparable override (SET → DRY TEST only). FLAG: single brand; narrow subsegment; ranking penalty.
- **Demand magnitude:** pocket-operator $49–89 shows real WTP for an aesthetic music device. Single brand, trend unknown, community-heat deferred.
- **Gate 1 verdict:** FLAG — single brand below floor; one-comparable override applies; revenue null; trend unknown.

#### Gate 2 — Product
- **2.1 Efficacy:** Arduview (game console: ATmega32U4, 128×64 OLED, no audio synth engine) does NOT natively produce the music-creation transformation. **FLAG (near-kill): mechanism efficacy for music-creation is UNPROVEN for Arduview.**
- **2.1b Spend-transfer:** observed `mechanisms_in_play[]` for pocket-operator: **"Built-in synth/sequencer/drum-machine engine"** + **"Caseless single-PCB — cost savings reinvested in [sound] components"** + "Long battery life." Arduview has no equivalent. Spend proven on a dedicated music-device category; transfer to a game console running music software is unproven.
- **2.2 / 2.4 (for record):** pocket-operator bet `novel-hardware-as-lead` (exposed PCB + studio sound). Its mechanisms (synth engine, caseless-for-sound, long battery) are music-device mechanisms Arduview lacks. No differentiating axis available to Arduview in music-creation. Economics moot without a music app in scope.
- **Gate 2 verdict:** FLAG (near-kill, grounded) — product does not deliver the transformation; requires product-category repositioning; spend proven on a dedicated music device whose lead mechanisms Arduview structurally lacks.

#### Gate 3 — Sophistication
- **3.1 Stage:** single brand — no cell-level stage rule applies (requires 2+ brands). `claims[].type` = enlarged ×1, direct ×2. pocket-operator brand string = "Stage 2." Cell stage "not established."
- **Gate 3 verdict:** CONDITIONAL — single brand; no saturation baseline; whitespace not meaningful with one competitor.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3 with a grounded near-kill Gate 2 flag, Gate 4 PENDING. Flags: Gate 1 (single brand, below floor); Gate 2 HEAVY (mechanism-efficacy fail, now observed-grounded). Weakest product-fit cell.

---

## Ranked PROVISIONAL Survivor List (Soft-Gate, All 6 Carried)

**Operator overrides applied (all 4 SET):** (1) one-comparable → DRY TEST only, not commitment; (2) community-heat caveat → thin identity-niche spend not an auto-kill, deferred read required; (3) durability-load-bearing → spiked-and-died = WARNING (fad-death is the #1 risk); (4) demand-type → belonging/identity/aesthetic cells read off community heat + WTP-for-aesthetic, not pain severity.

| Rank | Cell | Gate 1 | Gate 2 | Gate 3 stage | Key demand signal | UM alignment (observed) | Move vs prior |
|------|------|--------|--------|--------------|-------------------|-------------------------|---------------|
| 1 | novelty-object-own × edc-aesthetic-collectors | FLAG (3 brands, divoom ads, nothing-phone bet-evidence) | PASS STRONG | Stage 1–2 | 3 brands + adjacent comparable | BEST — transparent-display fits the cell's uniform novel-hardware bet; ownable, but must lead on *transparency* (display-as-medium lane already n=2 / shared n=4) | = (held; UM read now qualified) |
| 2 | maker-identity × maker-diy-hobbyists | FLAG (gameshell funded-shipped + bet-evidence) | PASS | Stage 1 | gameshell Kickstarter $350K+ (funded-shipped) — cleanest demand proof | GOOD — transparency ownable; open-hackability lane shared space-wide; UM strength conditional on maker sub-identity | = |
| 3 | retro-gaming-relive × retro-gamers | FLAG (3–4 brands, anbernic ads) | FLAG (transfer unproven, UM cross-grain) | Stage 2 (→3) | most active brand field | WEAK — transparency cross-grain to authenticity-dominant cell (FPGA/cartridge held) | = |
| 4 | learn-to-code × maker-diy-hobbyists | FLAG HEAVY (0 qualifying signals) | FLAG (price $15–25; weak UM) | Stage 1 | thumby + pico-8, presence only | WEAK — transparency not a pedagogy mechanism; real lanes shared | ▲ +1 (was 5) |
| 5 | learn-to-code × learn-to-code-students | FLAG HEAVY (0 qualifying signals) | FLAG (same as #4) | Stage 1 | same brands; institutional spend uncaptured | WEAK — same | ▲ +1 (was 6) |
| 6 | music-creation × edc-aesthetic-collectors | FLAG (single brand, below floor) | HEAVY FLAG (mechanism-efficacy fail, observed-grounded) | not established (1 brand) | pocket-operator only | POOR — game console ≠ music device; observed synth/caseless-for-sound mechanisms Arduview lacks | ▼ −2 (was 4) |

**Ranking moves vs prior run:**
- **Music-creation dropped 4 → 6.**
- **Both learn-to-code cells rose one rank.**
- **Top 3 held**, but the #1 UM read is now sharper and slightly more qualified: transparency, not display-distinctiveness, is the ownable slice.

**Forward note (hard-gate consequences once revenue + trend are trustworthy, D-08):** under hard-gate discipline, Cell 6 would KILL at Gate 2.1 (mechanism efficacy) and Cells 2/3 would likely KILL at Gate 2.4 (required price clears no conditioning band with no differentiator). Only Cells 1 and 5 survive a hard read on current evidence.

**TOP CANDIDATES on this data:** Cell 5 (novelty-object-own × edc-aesthetic-collectors) and Cell 1 (maker-identity × maker-diy-hobbyists). Both require before any committed pick: (1) Trends fetch fix — durability UNKNOWN for all brands; (2) community-heat read (identity/aesthetic cells, override #2); (3) operator COGS verification; (4) Gate 4 awareness read (PENDING DEEP-RESEARCH STEP).

**This output stops at ranked PROVISIONAL survivors. The bet pick (which cell(s) to take to a dry test) is the operator's D1 decision.**
