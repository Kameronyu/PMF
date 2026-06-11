# Arduview Market-Selection Gate Record (DR-grounded re-run)

**RUN MODE:** soft-gate, PROVISIONAL — Gate 4 (awareness) DEFERRED TO DEEP-RESEARCH STEP
**Status of every survivor below:** PROVISIONAL — passed Gates 1–3; Gate 4 (awareness reachability) PENDING DEEP-RESEARCH STEP
**Operator overrides applied:** All 4 SET (mapped from `runs/arduview/pre-research-plan.md` §"Supply-side validation stance" + §"Deferred reads")
**Grounding:** DR bundle (`_dr-context.generated.md`, 5/5 files) read before running. Mechanisms-in-play read as OBSERVED data from `space-map.json` (BREAK 5 resolved) — no corpus derivation, no `[INFERENCE]` cluster. This supersedes the prior run (executor `ac45de593dcd40346`), which ran with zero DR grounding and derived mechanisms from corpus dumps.

---

## #1 BLOCKER — Fix the Trends fetch (Phase 1)

`demand_trend.shape == "unknown"` for ALL 20 brands. The Trends fetch did not populate. Durability is the load-bearing supply-side signal for this novelty/fad-death-prone product (per pre-research-plan §"What it physically is"), so an empty durability column silently disables the most important validation. Gate 1 cannot clear with confidence on any cell. Every cell is stamped **durability UNKNOWN**. Resolve before any committed bet pick (MOQ/production).

**Two bare DATA GAPs this run:**

1. `demand_trend.shape == "unknown"` — ALL 20 brands. No durability signal. Every Gate 1 record stamps "durability UNKNOWN — Gate 1 cannot clear with confidence" (D-09).
2. `revenue_est.value_usd_monthly == null` — ALL 20 brands. No monthly-revenue floor signal. Gate 1 runs on crowdfunding + ad-longevity + structural bet evidence only. **No absolute revenue floor applied** — the $300–500K/mo floor from `ecommerce--mark-builds-brands.md` is MISCALIBRATED for this hardware category (SKILL.md caution; do NOT apply).

**RESOLVED (no longer a DATA GAP):** `mechanisms_in_play[]` is now a first-class field in `space-map.json` — a top-level space-wide catalog AND a per-combo `mechanisms_in_play[]` on each cell. Read directly as observed data; the old corpus-derivation stopgap is RETIRED.

**Ad-longevity verification:** `combos[].anti_fluke.qualifying_creatives = 0` in all 6 cells (pre-counted; read, not recounted). Cross-checked against the on-disk ads files: `ads/anbernic.json` and `ads/divoom.json` (the only two non-seed candidate-cell brands with `ads_flag="yes"`) both return **0 ads / empty `run_length_days`** — confirms no creative in any candidate cell cleared the 7-day floor. The only dense ads file is `flipper-zero.json` (a `comparable_bet_seed`, excluded from candidate cells).

**Comparable-bet-seed brands = BET-EVIDENCE only** (never candidate cells): arduboy, flipper-zero, nothing-phone, skeleton-key. Flipper-zero's sustained ad longevity + multi-year sell-through and Nothing Phone's phone-scale run confirm the `novel-hardware-as-lead` bet has won durably at scale. This is durability evidence for the *bet*, not saturation evidence for any *cell*.

---

## Space-wide mechanism read (observed — context for every cell's Gate 2.2 / 3.3)

From top-level `mechanisms_in_play[]`. Ownability is space-wide here; per-cell ownability is read inside each cell record below.

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

**Load-bearing consequence for Arduview's UM:** Arduview's display is itself a `128×64 monochrome OLED` — i.e. it falls inside the **shared (n=4)** "distinctive monochrome/pixel display as the medium" mechanism. So leading on "cool pixel display" generically enters a TAKEN lane. **The ownable slice is the TRANSPARENCY specifically** — "genuine see-through OLED" appears in NO catalog entry (the catalog captures pixel/monochrome-as-medium, never see-through-ness). Arduview's UM must be `transparent / see-through display`, not "distinctive display." This is the precision the observed catalog buys that the prior corpus-inference run blurred.

---

## Cell Records (All 6 Combos, Soft-Gate Mode)

---

### Cell 1: maker-identity × maker-diy-hobbyists

**Brands in cell (live, in-geo, non-seed):** thumby, gameshell, pwnagotchi, pimoroni, sparkfun
`brand_count = 5` | `claim_count = 3` | `enhanced_claim_count = 0` | `anti_fluke.qualifying_creatives = 0`

#### Gate 1 — Demand
- **Revenue:** `value_usd_monthly = null` for all 5. No floor signal; not papered over.
- **Ad longevity:** `qualifying_creatives = 0`. No creative ran 7+ days. `ads_flag`: unsure (thumby, gameshell, pimoroni, sparkfun), no (pwnagotchi).
- **Crowdfunding:** gameshell → Kickstarter, raised $350,000+, 700%+ funded, status **funded-shipped**. The cleanest validation signal in any cell — a funded-and-shipped raise at 7× goal proves people paid for an open-source modular maker game console.
- **Trend:** unknown for all 5 → **durability UNKNOWN — Gate 1 cannot clear with confidence.**
- **Scale-gate verdict (soft-gate):** 5 brands present; 0 qualifying creatives; revenue null; 1 funded-shipped comparable. Under the one-comparable override (SET → DRY TEST only), gameshell's funded-shipped raise clears the minimum to proceed to test, NOT to commitment. FLAG; ranking penalty.
- **Demand magnitude (1.3):** Belonging/identity cell. Per override #4 (SET, grounded in Mass Desire core drivers — belonging/status are legitimate demand, not weak demand), read intensity off community heat + willingness-to-pay-for-aesthetic, not pain severity. Per override #2 (SET), thin maker-niche spend does NOT auto-kill — possible under-monetized intensity. **FLAG: "requires separate community-heat read — not scored here."**
- **Gate 1 verdict:** FLAG — crowdfunding (gameshell) gives one strong comparable; revenue null; ad-longevity 0; trend unknown. Proceeds under one-comparable override. Durability UNKNOWN.

#### Gate 2 — Product
- **2.1 Efficacy:** Transparent pocket console (ATmega32U4, Arduino-IDE-flashable, data USB-C, 400 preloaded games on W25Q128 — confirmed off BOM) demonstrably produces the maker-identity transformation (open hardware, code-yourself, community participation). PASS.
- **2.1b Spend-transfer:** gameshell's crowdfunding spend is on an open-source modular game console — same product-category as Arduview. No transfer risk.
- **2.1c Price-conditioning:** `price_points` band — thumby $19.99–24.99, gameshell $159, pimoroni $29–59, sparkfun none, pwnagotchi none. Open-hardware/maker band ≈ **$20–$160**, gameshell ($159) the closest funded comparable. FLAG: operator price must be calibrated against $20–$160; routed to 2.4. Operator COGS pending.
- **2.2 Differentiating axis (observed mechanisms):** competing bets — thumby `novel-hardware-as-lead` (miniaturization), gameshell `open-source-hackability-as-lead`, pwnagotchi `open-source-hackability-as-lead`, pimoroni/sparkfun `maker-ecosystem-store`.
  Cell `mechanisms_in_play[]` (all `ownability:"unique"` at cell grain): code-the-hardware-yourself (gameshell, thumby — n=2, borderline), RP2040 core (pwnagotchi, thumby — n=2), monochrome-display-as-medium (thumby — n=1), on-device-AI (pwnagotchi — n=1), preloaded-games (thumby — n=1), modular dev board (gameshell — n=1), runs-game-engines (gameshell — n=1).
  **Cell-grain:** nothing reaches `shared` (≤2 each), so no mechanism is "taken" within the cell. **Space-grain caution:** code-the-hardware-yourself is `shared` (n=3) space-wide and monochrome-display-as-medium is `shared` (n=4) space-wide — so a generic "open/hackable" or "cool display" lead enters crowded lanes. **Arduview's `transparent display` is in NO mechanism entry (cell or space) → ownable UM.**
  UM axis: `novel-hardware-as-lead` on the **transparency** axis (distinct from thumby's miniaturization). Dual-fit option: Arduview can ALSO claim open-hackability (it is genuinely Arduino-flashable) — but that lane is shared space-wide, so transparency is the stronger lead. **Craft-credibility tension (pre-research-plan maker sub-identity fork):** in the *builder/skill-signal* maker sub-identity a bought-cool object reads slightly wrong → transparency weak; in *cultural-membership* / *cutting-edge-early-adopter* it reads strong. Which sub-identity is real is a VOC question — flag as conditional.
- **2.3 Believability:** Tier 1 self-evident (transparency visible on inspection). gameshell's funded-shipped raise = social proof for the open-source maker niche.
- **2.4 Economics:** COGS pending. FLAG "economics pending operator COGS."
- **Gate 2 verdict:** PASS (provisional) — delivers the transformation; ownable UM = transparent-display-as-lead; Tier-1 believability; UM strength conditional on maker sub-identity; economics pending.

#### Gate 3 — Sophistication
- **3.1 Stage:** `claims[].type` = direct ×3, enlarged ×0, `enhanced_claim_count = 0`. Highest tier deployed by 2+ brands = `direct` → **Stage 1**. Cross-check `per_brand[].sophistication`: thumby/gameshell/pwnagotchi all "Stage 1" — agrees, no disagreement.
- **3.2 Required move:** Stage 1 → direct claim (or Stage-2 enlarged). UM has room for a clean statement.
- **3.3 Executability:** Stage 1/2 — UM has room. Transparent-display mechanism not in the cell's (or space's) mechanism set → not taken → executable.
- **3.4 Defense quality:** 3 direct claims from 5 brands, all orbiting "open source / hackable" — weakly defended; whitespace open for mechanism-level differentiation. Below the 5+-same-claim dead-ground threshold.
- **Gate 3 verdict:** PASS — Stage 1; required move = direct/enlarged claim; transparency UM executable and unclaimed; whitespace open.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** — passed Gates 1–3, Gate 4 PENDING. Flags: Gate 1 crowdfunding-only demand, revenue null, trend unknown, community-heat deferred; Gate 2 UM conditional on maker sub-identity, economics pending; Gate 3 Stage 1 full whitespace.

**Prose synthesis:** Demand is provisionally proven by gameshell's funded-shipped Kickstarter ($350K+, 700%) plus bet-evidence from flipper-zero/arduboy — the single cleanest demand signal in the set — but revenue is null and trend unknown, so durability is UNKNOWN. The product wins on a `transparent-display-as-lead` axis that appears in no observed mechanism entry (the generic "open/hackable" and "pixel display" lanes are both shared space-wide, so transparency is the only ownable slice), with the caveat that its strength depends on which maker sub-identity is real (strong for cutting-edge/membership, weak for builder/skill-signal). The claim space is Stage 1 — direct "open source" claims only, weakly defended, whitespace wide open for a clean mechanism statement. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 2: learn-to-code × maker-diy-hobbyists

**Brands (live, in-geo, non-seed):** thumby, pico-8
`brand_count = 2` | `claim_count = 3` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- **Revenue:** null (both). **Ad longevity:** 0 qualifying; `ads_flag` no (pico-8), unsure (thumby). **Crowdfunding:** none. **Trend:** unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 2 brands present; 0 qualifying creatives; no crowdfunding; revenue null. Below the one-comparable override threshold (no funded-shipped signal). FLAG: thinnest signal class; heavy ranking penalty.
- **Demand magnitude:** maker/DIY-adjacent; community-heat deferred. pico-8 $14.99 (software) + thumby $19.99–24.99 — low AOV ceiling. FLAG: thin; intensity unknown.
- **Gate 1 verdict:** FLAG — brand-presence only; revenue null, ad-longevity 0, no crowdfunding, trend unknown.

#### Gate 2 — Product
- **2.1 Efficacy:** Arduino-IDE / programmable hardware delivers learn-to-code. PASS.
- **2.1b Spend-transfer:** pico-8 is SOFTWARE ($14.99), not hardware. Demand partly on a different product-category. FLAG: "hardware-to-code demand weaker; partly proven on software (pico-8)."
- **2.1c Price-conditioning:** $15–$25 band (pico-8 software + thumby). Very low ceiling; any Arduview price >~$80 faces a steep conditioning gap with no differentiator in this cell.
- **2.2 Differentiating axis (observed):** bets — thumby `novel-hardware-as-lead`, pico-8 `open-source-hackability-as-lead`. Cell mechanisms (all `unique` at cell grain): code-the-hardware-yourself (pico-8, thumby — n=2), monochrome-display-as-medium (pico-8, thumby — n=2), synth engine (pico-8 — n=1), community browser (pico-8 — n=1), preloaded-games (thumby — n=1), RP2040 (thumby — n=1). **Space-grain:** both n=2 cell mechanisms (toolchain, display-medium) are `shared` space-wide. Arduview's transparency is unclaimed — but transparency does not credibly serve the *learn-to-code* hook (it's an aesthetic/novelty mechanism, not a pedagogy mechanism). FLAG: weak UM fit for this transformation.
- **2.4 Economics:** $15–$25 conditioning; no differentiator justifies an Arduview premium in this cell.
- **Gate 2 verdict:** FLAG — delivers learn-to-code, but no compelling differentiating axis here and price conditioning far below viable Arduview pricing.

#### Gate 3 — Sophistication
- **3.1 Stage:** direct ×3, enlarged ×0 → **Stage 1** (highest tier 2+ brands deploy = direct). Cross-check: thumby "Stage 1", pico-8 "Stage 2" (brand string sees "in one sitting" as a condition specifier). Disagreement flagged; cell-grain rule governs → **Stage 1**.
- **3.2–3.4:** Stage 1 → direct/enlarged; transparency unclaimed but weak-fit; weakly defended, whitespace open.
- **Gate 3 verdict:** PASS — Stage 1, whitespace; but Gate 1/2 flags dominate.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3, Gate 4 PENDING. Flags: Gate 1 heavy (no qualifying signals); Gate 2 weak UM fit + price conditioning misaligned.

**Prose synthesis:** Demand is among the weakest in the set — two brands at presence only, no qualifying creatives, no crowdfunding, revenue null — durability UNKNOWN. The product delivers learn-to-code but has no ownable axis here: the cell's two real mechanisms (code-yourself toolchain, pixel-display-as-medium) are both shared space-wide, and Arduview's only unclaimed mechanism (transparency) is an aesthetic hook that does not credibly serve a pedagogy transformation. The claim space is Stage 1 with whitespace, but thin demand + weak UM fit + a $15–$25 conditioning ceiling make this low-priority. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 3: learn-to-code × learn-to-code-students

**Brands (live, in-geo, non-seed):** thumby, pico-8 (meowbit: page 404, excluded)
`brand_count = 2` | `claim_count = 2` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- Revenue null; 0 qualifying ads; no crowdfunding; trend unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 2 brands, 0 qualifying, no crowdfunding. Same thin profile as Cell 2. The learn-to-code-students niche is buyer=student/parent/educator; real institutional spend (Scratch, MakeCode, LEGO Mindstorms) is NOT captured in this data. FLAG: thin supply-side signal; real spend may sit on uncaptured institutional channels. Ranking penalty.
- **Demand magnitude:** override #4 applies less (students are closer to a functional/skill-acquisition buyer than belonging/identity); community-heat deferred. pico-8 $14.99 + thumby $19.99–24.99 — low consumer WTP.
- **Gate 1 verdict:** FLAG — thin, with the caveat that institutional spend is unrepresented here.

#### Gate 2 — Product
- **2.1 Efficacy:** delivers programmability. PASS. **2.1b:** pico-8 software; meowbit (most student-targeted) 404, uncounted — data thin on dedicated student hardware. **2.1c:** same $15–$25 band; steep gap.
- **2.2 (observed):** same two brands as Cell 2 → same cell mechanisms (code-the-hardware-yourself n=2, monochrome-display-as-medium n=2, both shared space-wide; plus pico-8's synth/community, thumby's preloaded/RP2040 at n=1). Transparency unclaimed but weak-fit for a student learn-to-code hook. FLAG.
- **Gate 2 verdict:** FLAG — same conclusion as Cell 2; weak UM alignment for transparent-display hardware in a student context.

#### Gate 3 — Sophistication
- **3.1 Stage:** direct ×2 → **Stage 1**. Cross-check: thumby "Stage 1", pico-8 "Stage 2" — same disagreement as Cell 2; cell-grain governs → Stage 1.
- **3.2–3.4:** Stage 1, executable, whitespace open.
- **Gate 3 verdict:** PASS — Stage 1.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3, Gate 4 PENDING. Flags: Gate 1 heavy; Gate 2 weak UM fit.

**Prose synthesis:** Demand is identical to Cell 2 — same two brands, same thin profile, revenue null, trend unknown — durability UNKNOWN, with the added caveat that the real learn-to-code-students spend may sit on institutional channels (MakeCode, Scratch) absent from this run. The product delivers learn-to-code but transparency is not a credible pedagogy mechanism, and the cell's real mechanisms are shared space-wide; price conditioning ($15–$25) is far below viable Arduview pricing. Stage 1 with whitespace, but weak demand + poor UM fit keep it low-priority. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 4: retro-gaming-relive × retro-gamers

**Brands (live, in-geo, non-seed):** analogue-pocket, evercade, bitboy (anbernic: brand presence, no verbal claims typed; miyoo: excluded, defunct/region-only per D-08)
`brand_count = 3` | `claim_count = 3` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- Revenue null (all). Ad longevity: `qualifying_creatives = 0`; `ads_flag = "yes"` for anbernic (presence, not 7+-day longevity — verified `ads/anbernic.json` = 0 ads / empty `run_length_days`); unsure for the rest. Crowdfunding: none. Trend: unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 3 brands at scale (analogue-pocket $219.99, evercade $79.99–129.99, bitboy $29.99–49.99) + anbernic at presence (confirmed live ads). The MOST active candidate field by brand-at-presence density. But no 7+-day ad longevity captured; revenue null. FLAG; moderate ranking penalty.
- **Demand magnitude:** functional/nostalgia demand (pain-adjacent, not identity-first) → pain/desire-severity read is appropriate here (override #4 less applicable). Price band $30–$220 shows WTP across a wide spectrum.
- **Gate 1 verdict:** FLAG — multi-brand active field, confirmed ad presence (anbernic), but no longevity validation; revenue null; trend unknown. Stronger demand breadth than Cells 2/3; weaker validation than Cell 1.

#### Gate 2 — Product
- **2.1 Efficacy:** Arduview (~50g, 2.42" 128×64 OLED, ~2hr battery, 400 preloaded games) delivers retro-gaming at Arduboy/small-catalog scale, NOT at emulation-breadth scale. Per pre-research-plan: underpowered vs Anbernic/Miyoo emulation class; on-spec vs the Arduboy/open expectation. FLAG: delivers retro-gaming, but not at the emulation breadth competitors lead with.
- **2.1b Spend-transfer:** dominant retro spend is on emulation handhelds (anbernic full SNES/GBA/PSP) or FPGA-authentic systems (analogue-pocket). FLAG: "demand proven for retro-gaming, but primarily on emulation-breadth + hardware-authenticity categories — transfer to an Arduboy-scale catalog unproven."
- **2.1c Price-conditioning:** $30 (bitboy) → $220 (analogue-pocket), mid $80–$130 (evercade). Arduview must compete in-band with a reason not to buy the emulation-breadth device instead.
- **2.2 Differentiating axis (observed):** bets — analogue-pocket / evercade / bitboy all `hardware-authenticity-as-lead`; anbernic `value-breadth-as-lead`. Cell `mechanisms_in_play[]` (all `unique` at cell grain): cartridge-library (analogue-pocket, evercade — n=2), FPGA-hardware-accurate (analogue-pocket — n=1), IPS-mod display (bitboy — n=1), premium high-density display (analogue-pocket — n=1), runs-game-engines (evercade — n=1). **Three of the four bets converge on hardware-authenticity** — that is the cell's dominant bet direction. Arduview's transparency mechanism is unclaimed, BUT it is a novelty/aesthetic mechanism, **cross-grain** to an authenticity-dominant cell. FLAG: "transparent OLED is a novelty mechanism, not an authenticity mechanism — Arduview cannot match the cell's dominant bet."
- **Gate 2 verdict:** FLAG — delivers retro-gaming at Arduboy-catalog scale only; cannot compete on emulation breadth (anbernic) or FPGA/cartridge authenticity (analogue-pocket, evercade); its ownable mechanism cross-cuts the cell's authenticity-dominant demand.

#### Gate 3 — Sophistication
- **3.1 Stage:** cell `claims[].type` = direct ×3 (incl. analogue-pocket's "No emulation." typed `direct` as a bare identity statement). By the cell-grain mechanical rule (highest tier 2+ brands deploy = direct) → cell reads **Stage 1–2**. BUT per-brand strings disagree upward: analogue-pocket **"Stage 3"** (named mechanism: "two FPGAs, no emulation"), evercade **"Stage 2"** (enlarged: "biggest collection of licensed cartridges"), bitboy **"Stage 2"** (enlarged: IPS-specified). **Disagreement flagged:** the cell typing under-reads because the FPGA/cartridge mechanism claims were typed from the headline position. True cell state ≈ **Stage 2, edging Stage 3** (2 brands at Stage 2, 1 at Stage 3). Primary verdict: **Stage 2** (conservative); analogue-pocket signals Stage-3 motion.
- **3.2 Required move:** Stage 2 → enlarged/specified claim; Stage-3 approach → UM differentiation.
- **3.3 Executability:** the cell's lead UM (FPGA-no-emulation, analogue-pocket — observed `ownability:"unique"` n=1, i.e. held by one strong brand) is NOT one Arduview can claim (different silicon). Arduview's transparency UM is unclaimed in the cell but its credibility for *retro-authenticity* is doubtful (see-through ≠ authentic retro). Marginal.
- **3.4 Defense quality:** multiple distinct mechanisms (FPGA, licensed carts, IPS) — moderately defended; the FPGA-authenticity axis is strongly held by analogue-pocket. Whitespace exists only in the novelty/value-breadth lane, weakly aligned to the cell's authenticity demand.
- **Gate 3 verdict:** PASS (marginal) — Stage 2 (Stage-3 elements); UM has room but the dominant authenticity mechanism is taken and Arduview's mechanism cross-cuts the cell.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3 with flags, Gate 4 PENDING. Flags: Gate 1 moderate; Gate 2 (transfer unproven, UM cross-grain); Gate 3 marginal (Stage 2–3).

**Prose synthesis:** The retro cell has the most active brand field (analogue-pocket, evercade, bitboy + anbernic's confirmed ads), suggesting real demand, but no qualifying creatives, revenue null, trend unknown — durability UNKNOWN. Arduview cannot match the cell's two dominant UM axes — emulation breadth and FPGA/cartridge authenticity (observed: cartridge-library n=2, FPGA n=1) — and its transparency mechanism cross-cuts an authenticity-dominant demand pattern. The claim space sits at Stage 2 edging Stage 3 (analogue-pocket's named FPGA mechanism), the authenticity axis is held, and the only open whitespace (novelty/value-breadth) maps poorly to retro-authenticity buyer expectations. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 5: novelty-object-own × edc-aesthetic-collectors

**Brands (live, in-geo, non-seed):** playdate, pocket-operator, divoom (nothing-phone: excluded, comparable_bet_seed)
`brand_count = 3` | `claim_count = 4` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`

#### Gate 1 — Demand
- Revenue null (all). Ad longevity: `qualifying_creatives = 0`; `ads_flag = "yes"` for divoom (presence — verified `ads/divoom.json` = 0 ads / empty `run_length_days`); unsure for playdate, pocket-operator. Crowdfunding: none. Trend: unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 3 brands at scale; divoom confirmed ad presence; nothing-phone ($549–699, `comparable_bet_seed`, `novel-hardware-as-lead` at massive scale) is adjacent BET-EVIDENCE validating the structural bet's durability in the EDC-aesthetic space. One-comparable override (SET): bet-evidence justifies testing, not commitment.
- **Demand magnitude:** belonging/identity/aesthetic cell. Per override #2 (SET), thin spend does NOT auto-kill; per override #4 (SET, grounded in Mass Desire), read intensity off community heat + WTP-for-aesthetic, not pain. Price band $30 (divoom) – $199 (playdate). FLAG: community-heat read deferred; magnitude proxy unknown.
- **Gate 1 verdict:** FLAG — multi-brand field, adjacent bet-evidence (nothing-phone), divoom ad presence; qualifying creatives 0; revenue null; trend unknown. Strongest flag profile after Cell 1's crowdfunding. Community-heat read required.

#### Gate 2 — Product
- **2.1 Efficacy:** "own a remarkable transparent tech object" IS exactly the novelty-object-own transformation; transparent OLED is the showpiece. Strong fit. PASS.
- **2.1b Spend-transfer:** spend is ON this product-category — novelty/aesthetic gadgets (playdate novel-hardware console, divoom LED pixel-art device, pocket-operator exposed-PCB synth). No transfer risk; demand proven on the hardware-as-object category. **No craft-credibility tension here** (pure aesthetic, per pre-research-plan: "Strongest UM-to-transformation match").
- **2.1c Price-conditioning:** $30–$199 band; playdate $199 is the indie novel-hardware ceiling. Arduview at ~$80–$160 well-conditioned.
- **2.2 Differentiating axis (observed):** ALL THREE brands share bet_type `novel-hardware-as-lead` — the cell's dominant + uniform bet. Cell `mechanisms_in_play[]` (all `unique` at cell grain): **monochrome/pixel-display-as-medium (divoom, playdate — n=2)**, app-controlled pixel-art (divoom — n=1), synth engine (pocket-operator — n=1), caseless single-PCB (pocket-operator — n=1), long battery (pocket-operator — n=1), novel analog input / crank (playdate — n=1), community browser (divoom — n=1).
  **Observed-data precision (key delta):** the "distinctive display-as-medium" mechanism is already occupied by **2 brands** in this cell (divoom's LED pixel matrix, playdate's reflective monochrome) — and is `shared` (n=4) space-wide. So Arduview cannot differentiate on "distinctive display" generically. **Transparency** specifically appears in NO entry → that is the ownable slice. Arduview occupies the cell's dominant `novel-hardware-as-lead` bet AND an unclaimed mechanism (transparent display), distinct from crank / exposed-PCB / LED-pixel-art. Adjacent to pocket-operator's exposed-PCB ("see-through = the design") but distinct (transparent display vs exposed circuit). **Best UM-to-cell fit of the 6 cells** — now with the qualifier that it must lead on transparency, not display-distinctiveness.
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

**Prose synthesis:** Demand is supported by 3 brands (playdate, pocket-operator, divoom), divoom's ad presence, and adjacent nothing-phone bet-evidence validating `novel-hardware-as-lead` at scale — but revenue is null and trend unknown, so durability is UNKNOWN. The product's transparent-display mechanism is the strongest UM-to-cell fit across all six cells — it sits inside the cell's uniform `novel-hardware-as-lead` bet, achieves Tier-1 believability, and is unclaimed — with the observed-data qualifier that the broader "distinctive display" lane is already occupied (divoom + playdate, and shared n=4 space-wide), so the UM must lead specifically on *transparency*, not display-distinctiveness. The claim space is Stage 1–2 with mechanism-differentiated (not saturated) defense, so a transparency-led claim enters clean whitespace, and unlike the maker cell there is no craft-credibility tension. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 6: music-creation × edc-aesthetic-collectors

**Brands (live, in-geo, non-seed):** pocket-operator (only)
`brand_count = 1` | `claim_count = 3` | `enhanced_claim_count = 0` | `qualifying_creatives = 0`
`_note`: single brand — below the 2+ anti-fluke floor.

#### Gate 1 — Demand
- Revenue null; 0 qualifying ads; no crowdfunding; trend unknown → durability UNKNOWN.
- **Scale-gate (soft-gate):** 1 brand (pocket-operator) — BELOW the 2+ floor. One-comparable override (SET → DRY TEST only): pocket-operator is a real, durable DTC brand (Teenage Engineering), sufficient to justify testing, not commitment. FLAG: single brand; narrow subsegment; ranking penalty.
- **Demand magnitude:** aesthetic/identity cell; per override #4, intensity off WTP-for-aesthetic. pocket-operator $49–89 shows real WTP for an aesthetic music device. Single brand, trend unknown, community-heat deferred.
- **Gate 1 verdict:** FLAG — single brand below floor; one-comparable override applies; revenue null; trend unknown.

#### Gate 2 — Product
- **2.1 Efficacy:** Arduview (game console: ATmega32U4, 128×64 OLED, no audio synth engine) does NOT natively produce the music-creation transformation. Delivering it would require a synthesizer app becoming the headline offer — a different product identity. **FLAG (near-kill): mechanism efficacy for music-creation is UNPROVEN for Arduview.**
- **2.1b Spend-transfer:** observed `mechanisms_in_play[]` for pocket-operator are purpose-built music/hardware mechanisms — **"Built-in synth/sequencer/drum-machine engine"** + **"Caseless single-PCB — cost savings reinvested in [sound] components"** + "Long battery life." These are exactly what makes it a music device; Arduview has no equivalent. Spend proven on a dedicated music-device category; transfer to a game console running music software is unproven and requires buyer-behavior change. **This is now grounded in observed mechanisms, not asserted** — the prior run flagged it but ranked the cell on speculative "exposed-hardware adjacency"; the observed catalog confirms the mechanism gap is real and structural.
- **2.2 / 2.4 (for record):** pocket-operator bet `novel-hardware-as-lead` (exposed PCB + studio sound). Its mechanisms (synth engine, caseless-for-sound, long battery) are music-device mechanisms Arduview lacks. No differentiating axis available to Arduview in music-creation. Economics moot without a music app in scope.
- **Gate 2 verdict:** FLAG (near-kill, grounded) — product does not deliver the transformation; requires product-category repositioning; spend proven on a dedicated music device whose lead mechanisms Arduview structurally lacks.

#### Gate 3 — Sophistication
- **3.1 Stage:** single brand — no cell-level stage rule applies (requires 2+ brands). `claims[].type` = enlarged ×1, direct ×2. If forced, pocket-operator brand string = "Stage 2." Cell stage "not established."
- **Gate 3 verdict:** CONDITIONAL — single brand; no saturation baseline; whitespace not meaningful with one competitor.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate) — passed Gates 1–3 with a grounded near-kill Gate 2 flag, Gate 4 PENDING. Flags: Gate 1 (single brand, below floor); Gate 2 HEAVY (mechanism-efficacy fail, now observed-grounded). Weakest product-fit cell.

**Prose synthesis:** Demand for music-creation in the EDC-aesthetic niche is signaled by a single durable brand (pocket-operator) at $49–89 WTP, but it is a single-brand cell below the anti-fluke floor with revenue null and trend unknown — durability UNKNOWN. The observed `mechanisms_in_play[]` confirm pocket-operator leads with purpose-built music mechanisms — a built-in synth/sequencer engine and a caseless single-PCB whose cost savings buy better sound components — that Arduview (a game console with no synth engine) structurally cannot match, so the Gate-2 mechanism-efficacy flag is load-bearing and grounded, not speculative. The cell has no cell-level stage (one competitor), and the mechanism mismatch makes it the weakest candidate for Arduview specifically; any rise depends on a product decision (shipping a music app as the headline), which is out of market-selection scope. Awareness PENDING DEEP-RESEARCH STEP.

---

## Ranked PROVISIONAL Survivor List (Soft-Gate, All 6 Carried)

Ranked by relative demand, tilted by UM-to-cell alignment (now observed) and sophistication difficulty (3-variable model: desire × awareness × sophistication; awareness provisional/deferred). Growth tilt only — never qualifies or kills. Gate-1 flags carried as ranking penalties.

**Operator overrides applied (all 4 SET):** (1) one-comparable → DRY TEST only, not commitment; (2) community-heat caveat → thin identity-niche spend not an auto-kill, deferred read required; (3) durability-load-bearing → spiked-and-died = WARNING (fad-death is the #1 risk); (4) demand-type → belonging/identity/aesthetic cells read off community heat + WTP-for-aesthetic, not pain severity.

| Rank | Cell | Gate 1 | Gate 2 | Gate 3 stage | Key demand signal | UM alignment (observed) | Move vs prior |
|------|------|--------|--------|--------------|-------------------|-------------------------|---------------|
| 1 | novelty-object-own × edc-aesthetic-collectors | FLAG (3 brands, divoom ads, nothing-phone bet-evidence) | PASS STRONG | Stage 1–2 | 3 brands + adjacent comparable | BEST — transparent-display fits the cell's uniform novel-hardware bet; ownable, but must lead on *transparency* (display-as-medium lane already n=2 / shared n=4) | = (held; UM read now qualified) |
| 2 | maker-identity × maker-diy-hobbyists | FLAG (gameshell funded-shipped + bet-evidence) | PASS | Stage 1 | gameshell Kickstarter $350K+ (funded-shipped) — cleanest demand proof | GOOD — transparency ownable; open-hackability lane shared space-wide; UM strength conditional on maker sub-identity | = |
| 3 | retro-gaming-relive × retro-gamers | FLAG (3–4 brands, anbernic ads) | FLAG (transfer unproven, UM cross-grain) | Stage 2 (→3) | most active brand field | WEAK — transparency cross-grain to authenticity-dominant cell (FPGA/cartridge held) | = |
| 4 | learn-to-code × maker-diy-hobbyists | FLAG HEAVY (0 qualifying signals) | FLAG (price $15–25; weak UM) | Stage 1 | thumby + pico-8, presence only | WEAK — transparency not a pedagogy mechanism; real lanes shared | ▲ +1 (was 5) |
| 5 | learn-to-code × learn-to-code-students | FLAG HEAVY (0 qualifying signals) | FLAG (same as #4) | Stage 1 | same brands; institutional spend uncaptured | WEAK — same | ▲ +1 (was 6) |
| 6 | music-creation × edc-aesthetic-collectors | FLAG (single brand, below floor) | HEAVY FLAG (mechanism-efficacy fail, observed-grounded) | not established (1 brand) | pocket-operator only | POOR — game console ≠ music device; observed synth/caseless-for-sound mechanisms Arduview lacks | ▼ −2 (was 4) |

**Ranking moves vs prior run (the point of the re-run):**
- **Music-creation dropped 4 → 6.** The prior run ranked it 4th on speculative "exposed-hardware adjacency to transparent OLED." The observed `mechanisms_in_play[]` now show pocket-operator's lead mechanisms are a built-in synth/sequencer engine and a caseless single-PCB-for-sound — purpose-built music mechanisms Arduview structurally lacks — so the mechanism-efficacy fail is grounded, not adjacency speculation. A single-brand cell where the product can't deliver the transformation ranks below the learn-to-code cells, where the product at least can deliver.
- **Both learn-to-code cells rose one rank** to fill the gap (Arduview genuinely delivers learn-to-code via Arduino-flashability, even if demand and UM fit are weak).
- **Top 3 held**, but the #1 UM read is now sharper and slightly more qualified: transparency, not display-distinctiveness, is the ownable slice (the "distinctive display-as-medium" lane is observed-occupied at n=2 in-cell and shared n=4 space-wide).

**Forward note (hard-gate consequences once revenue + trend are trustworthy, D-08):** under hard-gate discipline, Cell 6 would KILL at Gate 2.1 (mechanism efficacy) and Cells 2/3 would likely KILL at Gate 2.4 (required price clears no conditioning band with no differentiator). Only Cells 1 and 5 survive a hard read on current evidence.

**TOP CANDIDATES on this data:** Cell 5 (novelty-object-own × edc-aesthetic-collectors) and Cell 1 (maker-identity × maker-diy-hobbyists). Both require before any committed pick: (1) Trends fetch fix — durability UNKNOWN for all brands; (2) community-heat read (identity/aesthetic cells, override #2); (3) operator COGS verification; (4) Gate 4 awareness read (PENDING DEEP-RESEARCH STEP).

**This output stops at ranked PROVISIONAL survivors. The bet pick (which cell(s) to take to a dry test) is the operator's D1 decision.**
