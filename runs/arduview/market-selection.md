# Arduview Market-Selection Gate Record

**RUN MODE:** soft-gate, PROVISIONAL — Gate 4 (awareness) DEFERRED TO DEEP-RESEARCH STEP  
**Status of every survivor below:** PROVISIONAL — passed Gates 1–3; Gate 4 (awareness reachability) PENDING DEEP-RESEARCH STEP  
**Operator overrides applied:** All 4 SET (from `runs/arduview/pre-research-plan.md` §"Supply-side validation stance" + §"Deferred reads")

---

## #1 BLOCKER — Fix the Trends fetch (Phase 1)

`demand_trend: unknown` for ALL 20 brands. The Trends fetch did not populate. Gate 1 durability
cannot clear with confidence on any cell. Every cell is stamped **durability UNKNOWN**. This must
be resolved before a committed bet pick (MOQ/production).

**Two bare DATA GAPs this run:**

1. `demand_trend.shape == "unknown"` — ALL 20 brands. No trend durability signal available. Every
   Gate 1 record stamps "durability UNKNOWN — Gate 1 cannot clear with confidence."
2. `revenue_est.value_usd_monthly == null` — ALL 20 brands. No monthly revenue floor signal.
   Both revenue null AND trend unknown means Gate 1 runs on crowdfunding + structural bet evidence
   only. No absolute revenue floor applied (the $300–500K/mo from the DR ecommerce file is
   MISCALIBRATED for this category — not applied per SKILL.md caution).

**NOT a bare DATA GAP:**  
`mechanisms_in_play[]` — the `space-map.json` output slot is still absent (cross-phase Phase-1
add, BREAK 5). However, the raw material IS present in `corpus/<brand>/dump.json` →
`creatives[].pitches[].mechanism[]`. This run DERIVES the shared-vs-unique mechanism read per cell
from that source per the stopgap doc, fenced `[INFERENCE]`. Not carried as a bare DATA GAP.

**Comparable-bet-seed brands used as BET-EVIDENCE only** (never candidate cells):  
arduboy, flipper-zero, nothing-phone, skeleton-key. Their ad longevity data (flipper-zero: 117 ads,
many with `run_length_days ≥ 7` — e.g. 155 days, 17 days) confirms the `novel-hardware-as-lead`
bet has won durably at scale. This is durability evidence for the bet, not cell saturation.

---

## Cell Records (All 6 Combos, Soft-Gate Mode)

---

### Cell 1: maker-identity × maker-diy-hobbyists

**Brands in cell (live, in-geo, non-seed):** thumby, gameshell, pwnagotchi, pimoroni, sparkfun  
`combos[].brand_count = 5` | `combos[].claim_count = 3` | `combos[].enhanced_claim_count = 0`  
`anti_fluke.qualifying_creatives = 0`

---

#### Gate 1 — Demand

**Signal 1 — Revenue:** `revenue_est.value_usd_monthly = null` for all 5 brands. No revenue floor
signal. Revenue null — not papered over.

**Signal 2 — Ad longevity:** `anti_fluke.qualifying_creatives = 0` (pre-counted from
`combos[].anti_fluke`). No ad in this cell ran 7+ days. Zero qualifying creatives confirmed.
`ads_flag = "unsure"` for thumby, gameshell, pimoroni, sparkfun; `ads_flag = "no"` for pwnagotchi.

**Signal 3 — Crowdfunding:** gameshell → Kickstarter, raised $350,000+, 700%+ funded, status:
funded-shipped. This is the cleanest validation signal in the cell — a funded-and-shipped raise
at 7× goal confirms someone paid for an open-source modular maker game console.

**Trend:** `demand_trend.shape = "unknown"` for all 5 brands. **Durability UNKNOWN — Gate 1
cannot clear with confidence.** (Per D-09 provisional handling.)

**Scale gate verdict (soft-gate mode):** 5 brands-at-scale by brand count; qualifying creatives = 0;
revenue null; crowdfunding = 1 funded-shipped (gameshell). Under the one-comparable override (SET:
proceed on a single strong comparable to a DRY TEST only), gameshell's funded-shipped raise clears
the minimum threshold for proceeding to test — not to commitment. FLAG: demand provisionally
supported by crowdfunding evidence only; ad longevity = 0; revenue null.

**Demand magnitude (Gate 1.3):** This is a belonging/identity cell. Per override #4 (SET):
intensity is read off community heat + willingness-to-pay-for-aesthetic, NOT pain severity.
Community-heat read deferred (override #2, SET): thin competitor spend does NOT auto-kill — it may
be under-monetized intensity in the maker scene. **FLAG: "requires separate community-heat read —
not scored here."** Bet-evidence comparables (flipper-zero: $169, proven multi-year sell-through;
arduboy: maker heritage brand; nothing-phone: transparent-hardware-as-lead at phone scale) confirm
the structural bet `novel-hardware-as-lead` has won at scale — but these are bet-evidence, not
cell demand.

**Gate 1 verdict (soft-gate):** FLAG — crowdfunding evidence (gameshell funded-shipped) provides
one strong comparable; revenue null; ad longevity = 0; trend unknown. Proceeds to Gate 2 under
one-comparable override. Ranking penalty applied. Durability UNKNOWN.

---

#### Gate 2 — Product

**2.1 Mechanism efficacy:** The product (transparent pocket game console, Arduino-IDE-flashable,
ATmega32U4) demonstrably produces the maker-identity transformation — open hardware, code-yourself
capability, community participation. Passes 2.1.

**2.1b Product-category spend-transfer check:** gameshell's crowdfunding spend is on an
open-source modular game console — same product category as Arduview. No spend-transfer risk
flagged; demand proven on THIS category.

**2.1c Price-conditioning check:** Market conditioned bands from `price_points[]`:
thumby ($19.99–$24.99), gameshell ($159.00), pimoroni ($29.00–$59.00), sparkfun (no price captured),
pwnagotchi ($0 — community build). The open-hardware/maker band spans $20–$160 with gameshell at
$159 being the closest funded-comparable. Arduview's target price (not specified by operator; BOM
reference only) would need to sit within this band or carry a differentiator justifying a premium.
FLAG: "market conditioned to $20–$160 range; operator price must be calibrated against this band."
Operator COGS pending.

**2.2 Differentiating axis (mechanisms-in-play derivation per stopgap):**

Competing bets in this cell (from `per_brand[].bet_type`):
- thumby: `novel-hardware-as-lead` (miniaturization as headline)
- gameshell: `open-source-hackability-as-lead` (modular open-source kit)
- pwnagotchi: `open-source-hackability-as-lead` (open-source AI/WiFi hacking)
- pimoroni: `maker-ecosystem-store` (destination store, no single-product differentiator)
- sparkfun: `maker-ecosystem-store` (destination store)

`[INFERENCE]` — mechanisms-in-play derived from `corpus/<brand>/dump.json` →
`creatives[].pitches[].mechanism[]`, live in-geo non-seed brands only:

| Mechanism cluster | Brands (n=) | Ownability |
|---|---|---|
| Arduino/MicroPython/open-source SDK — code the hardware yourself | thumby (MicroPython/Blockly/Arduino C/C++, Code Editor, Arcade community), gameshell (KEYPAD module with Arduino compatibility) | n=2 — NOT yet shared (below 3+ threshold) — unique-ish, borderline |
| Modular swappable hardware / kit assembly | gameshell only | n=1 — unique |
| AI/ML on embedded hardware (A2C + bettercap + Raspberry Pi Zero W) | pwnagotchi only | n=1 — unique (but narrow/niche sub-category) |
| Miniaturization as the hardware-lead mechanism | thumby (RP2040, 72×40 OLED, keychain-size) | n=1 — unique |
| Maker ecosystem store (no mechanism lead) | pimoroni, sparkfun | n=2 — ecosystem play, not product-mechanism |

Confidence: LOWER — derived at decision-time from raw dumps, not a collected typed field. n= per
cluster is brand-count across distinct non-seed live in-geo brands.

**Arduview's transparent-OLED mechanism**: "see-through OLED display" does not appear in any cell
brand's `mechanism[]` — it is `[INFERENCE]` unique in this cell (n=0 in competitors). This is a
candidate ownable differentiator in the maker-identity × maker-diy cell.

**UM axis read:** Arduview would occupy `novel-hardware-as-lead` (like thumby), but on the
see-through OLED axis — not the miniaturization axis (thumby's lead). Differentiation is available
on the novelty-hardware axis IF the transparent display is the lead.

**2.3 Believability tier:** Tier 1 self-evident — transparent display is demonstrable on visual
inspection. gameshell's funded-shipped raise provides social proof for the open-source maker niche.

**2.4 Economics:** COGS pending operator data. FLAG: "economics pending operator COGS."

**Gate 2 verdict:** PASS (provisional) — product delivers the maker transformation; differentiating
axis available (transparent OLED as novel-hardware-lead, distinct from thumby's miniaturization
and gameshell's modularity); believability Tier 1; economics pending.

---

#### Gate 3 — Sophistication

**3.1 Stage (per-cell typed claims):**  
`combos[].claim_count = 3` | `enhanced_claim_count = 0` | `claims[].type`: direct (×3), enlarged (×0)

Claims present:
- "fully open-source and customizable, so you can extend it in whatever way you like" — `direct`
- "An Open Source Portable Game Console" — `direct`
- "Pwnagotchi: Deep Reinforcement Learning for WiFi pwning!" — `direct`

All types: `direct` only. `enhanced_claim_count = 0`. Mechanical rule: stage = highest `claim_type`
tier 2+ live brands deploy. 2+ brands deploy `direct` → **Stage 1–2 (direct/enlarged claims only;
no mechanism claims from 2+ brands)**. `[INFERENCE]` stage assignment.

Cross-check: `per_brand[].sophistication` for thumby = "Stage 1", gameshell = "Stage 1", pwnagotchi
= "Stage 1". All agree at Stage 1. No disagreement to flag.

**3.2 Required move:** Stage 1 → deploy a direct claim or Stage 2 enlarged/specified claim. UM has
room for a clean statement.

**3.3 Executability:** Stage 1/2 — UM has room. The transparent-OLED mechanism is NOT in the
mechanisms-in-play set for this cell (n=0 competitors leading with transparent display). The UM's
lead claim is executable. `[INFERENCE]` — derived from mechanism corpus.

**3.4 Defense quality:** 3 direct claims from 5 brands — undifferentiated, same "open source"
claim pattern (gameshell + pwnagotchi + thumby all orbit "open/hackable"). Weakly defended —
whitespace open for mechanism-level differentiation. Dead ground NOT yet reached (no 5+ same-claim
saturation in this cell).

**Gate 3 verdict:** PASS — Stage 1, required move = direct or enlarged claim; UM executable and
not yet claimed by competitors in this cell; whitespace open.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** — passed Gates 1–3, Gate 4 (awareness reachability) PENDING DEEP-RESEARCH STEP.  
Flags: Gate 1 — crowdfunding-only demand signal; revenue null; trend unknown; community-heat deferred;
ranking penalty applied. Gate 2 economics pending. Gate 3 Stage 1 — full whitespace.

**Prose synthesis:** Demand is provisionally supported by gameshell's funded-shipped Kickstarter
raise ($350K+, 700%) and bet-evidence from flipper-zero and arduboy, but revenue is null and
trend unknown for all brands — durability UNKNOWN. The product wins on the transparent-OLED-as-lead
axis, which is absent from any competitor's mechanism array in this cell — a candidate ownable UM —
though Arduview's bet_type (`open-source-hackability-as-lead` or `novel-hardware-as-lead`) needs
operator confirmation. The claim space is Stage 1 (direct claims only, all centered on "open/hackable"
identity), whitespace wide open for mechanism differentiation. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 2: learn-to-code × maker-diy-hobbyists

**Brands in cell (live, in-geo, non-seed):** thumby, pico-8  
`combos[].brand_count = 2` | `combos[].claim_count = 3` | `combos[].enhanced_claim_count = 0`  
`anti_fluke.qualifying_creatives = 0`

---

#### Gate 1 — Demand

**Signal 1 — Revenue:** `revenue_est.value_usd_monthly = null` for both brands. Revenue null.

**Signal 2 — Ad longevity:** `anti_fluke.qualifying_creatives = 0`. No ads ran 7+ days in this
cell. `ads_flag = "no"` for pico-8; `ads_flag = "unsure"` for thumby.

**Signal 3 — Crowdfunding:** No crowdfunding for thumby or pico-8.

**Trend:** `demand_trend.shape = "unknown"` for both brands. **Durability UNKNOWN — Gate 1 cannot
clear with confidence.**

**Scale gate verdict (soft-gate mode):** 2 brands-at-scale by brand count; qualifying creatives = 0;
revenue null; no crowdfunding. Below the one-comparable override threshold (no funded-shipped signal).
FLAG: demand signal is thin — no ad longevity, no revenue, no crowdfunding, trend unknown. Ranking
penalty applied.

**Demand magnitude (Gate 1.3):** This is a maker/DIY adjacent cell. Community-heat deferred.
pico-8 at $14.99 represents budget software demand; thumby at $20–$25 represents budget hardware.
Low AOV signals a ceiling. FLAG: thin demand signal; no funded comparable; intensity unknown.

**Gate 1 verdict (soft-gate):** FLAG — two brands-at-scale but zero qualifying signals beyond brand
presence; revenue null; ad longevity = 0; no crowdfunding; trend unknown. Weakest Gate 1 profile
of the 6 cells. Heavy ranking penalty.

---

#### Gate 2 — Product

**2.1 Mechanism efficacy:** The product can deliver learn-to-code via Arduino IDE / MicroPython
programmability (confirmed on BOM). Passes 2.1.

**2.1b Product-category check:** pico-8 is SOFTWARE ($14.99 software subscription), not hardware.
Spend proven for the "learn to code on game hardware" transformation, but partially on a different
product-category (software vs hardware). FLAG: "demand partially proven on software category
(pico-8); hardware-to-code demand weaker."

**2.1c Price-conditioning:** Market conditioned to $15–$25 (pico-8 software + thumby hardware).
Very low AOV ceiling. Any Arduview price above ~$80 faces a steep conditioning gap with no strong
differentiator evident in this cell.

**2.2 Differentiating axis (mechanisms-in-play derivation):**

Competing bets:
- thumby: `novel-hardware-as-lead` (miniaturization)
- pico-8: `open-source-hackability-as-lead` (creative constraints + built-in toolchain)

`[INFERENCE]` — mechanisms-in-play from corpus:

| Mechanism cluster | Brands (n=) | Ownability |
|---|---|---|
| Built-in constrained development environment (all tools in console: code/music/sound/sprites) | pico-8 only | n=1 — unique |
| Microcontroller SDK + code editor + community arcade (MicroPython/Blockly/Arduino C/C++) | thumby only | n=1 — unique |

No mechanism shared by 2+ brands in this cell. Both mechanisms are distinct (pico-8: creative
constraints; thumby: physical microcontroller SDK). Arduview's transparent-OLED is absent from both
— candidate unique mechanism if the transparent display is positioned as the learn-to-code hook
(e.g., "see your code run in hardware — transparent display shows the circuit while you program it").
That is a stretch narrative — transparent OLED is stronger as a novelty/aesthetic hook than a
learn-to-code mechanism. `[INFERENCE]`.

**UM axis read:** No clear differentiating axis for Arduview in learn-to-code vs these two brands.
pico-8 owns the creative-constraints/built-in-IDE axis; thumby owns the miniaturized-physical-SDK
axis. Arduview does not obviously beat either on this transformation for this niche.

**2.4 Economics:** $14.99 (pico-8) to $25 (thumby) conditions this niche to very low spend.
Arduview at a higher price has no obvious differentiator in THIS cell to justify premium.

**Gate 2 verdict:** FLAG — product can deliver learn-to-code, but the cell's price conditioning
($15–$25) is far below any viable Arduview price, and the UM axis (transparent OLED) does not
clearly serve the learn-to-code transformation. No compelling differentiating axis for Arduview
in this specific cell. FLAG: weak UM fit for this niche; economics misaligned.

---

#### Gate 3 — Sophistication

**3.1 Stage:**  
`claim_count = 3` | `enhanced_claim_count = 0` | `claims[].type`: direct (×3), enlarged (×0)

All direct claims:
- thumby: "Thumby™ is an itty-bitty game system...easy learning tool all-in-one" — `direct`
- pico-8: "PICO-8 is a fantasy console for making, sharing and playing tiny games" — `direct`
- pico-8: "Create a whole game or program in one sitting without needing to leave the cosy development environment!" — `direct`

2+ brands deploy `direct` → Stage 1. `[INFERENCE]`.

Cross-check: thumby = "Stage 1", pico-8 = "Stage 2" (per `per_brand[].sophistication`). Disagreement:
pico-8's brand-level string reads Stage 2 (enlarged claim present: "in one sitting" as a time/condition
specifier). At the cell level, claims[].type shows all `direct`. The per-brand string may see Stage 2
for pico-8 alone; the cell-level rule reads Stage 1 (the highest tier deployed by 2+ brands is
`direct`). Cross-check flagged; cell-level verdict = Stage 1.

**3.2 Required move:** Stage 1 — direct claim or enlarged/specified claim. Executable.

**3.3 Executability:** Stage 1 — UM has room. Transparent OLED mechanism not claimed. `[INFERENCE]`.

**3.4 Defense quality:** Weak — 3 direct claims, undifferentiated. Open whitespace.

**Gate 3 verdict:** PASS — Stage 1; whitespace available. However, Gate 1 and Gate 2 flags severely
weaken this cell's ranking.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate mode) — passed Gates 1–3, Gate 4 PENDING DEEP-RESEARCH STEP.  
Flags: Gate 1 heavy penalty (no qualifying signals); Gate 2 FLAG (weak UM fit, price conditioning
misaligned). Ranked last or near-last.

**Prose synthesis:** Demand signal is the weakest in the set — no qualifying ad creatives, no
crowdfunding, no revenue, two brands present only at brand-presence level — durability UNKNOWN.
The product can deliver learn-to-code, but Arduview has no clear differentiating axis against pico-8
(creative constraints) or thumby (miniaturized SDK), and the cell's price conditioning ($15–$25)
creates a large gap for any viable Arduview price. The claim space is Stage 1 with full whitespace,
but low demand + weak UM fit make this a low-confidence cell. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 3: learn-to-code × learn-to-code-students

**Brands in cell (live, in-geo, non-seed):** thumby, pico-8 (meowbit: page 404, excluded)  
`combos[].brand_count = 2` | `combos[].claim_count = 2` | `combos[].enhanced_claim_count = 0`  
`anti_fluke.qualifying_creatives = 0`

---

#### Gate 1 — Demand

**Signal 1 — Revenue:** `revenue_est.value_usd_monthly = null` for both. Revenue null.

**Signal 2 — Ad longevity:** `anti_fluke.qualifying_creatives = 0`. No qualifying ads.
`ads_flag = "no"` for pico-8; `ads_flag = "unsure"` for thumby.

**Signal 3 — Crowdfunding:** None for thumby or pico-8.

**Trend:** `demand_trend.shape = "unknown"` for both. **Durability UNKNOWN — Gate 1 cannot clear
with confidence.**

**Scale gate verdict (soft-gate mode):** 2 brands, 0 qualifying creatives, no crowdfunding, revenue
null. Same thin profile as Cell 2. NOTE: the learn-to-code-students niche is different from
maker-diy-hobbyists — this is the buyer=student/parent/educator scenario. Institutional spend may
exist but is not captured here (no edu-channel brands in the data). FLAG: thin supply-side signal;
the real spend in this niche may be on institutional/platform channels not represented. Ranking
penalty.

**Demand magnitude:** Demand-type override #4 (SET) applies less here — students are closer to a
functional/pain buyer (skill acquisition) than a belonging/identity buyer. However, community-heat
read deferred. pico-8 ($14.99) + thumby ($20–$25) indicate low consumer willingness-to-pay.

**Gate 1 verdict (soft-gate):** FLAG — same thin profile as Cell 2, with the added caveat that the
real learn-to-code-students spend may sit on institutional channels (Scratch, MakeCode, LEGO
Mindstorms) not captured in this run. Ranking penalty.

---

#### Gate 2 — Product

**2.1 Mechanism efficacy:** Same as Cell 2 — the product delivers programmability. Passes.

**2.1b Product-category check:** pico-8 is software. Same flag as Cell 2. Additionally, meowbit
(the most student-targeted brand) returned 404 — not counted. The data is thin on dedicated
student-facing hardware brands.

**2.1c Price-conditioning:** Same $15–$25 band as Cell 2. Steep conditioning gap for Arduview.

**2.2 Differentiating axis:**

Competing bets:
- thumby: `novel-hardware-as-lead`
- pico-8: `open-source-hackability-as-lead`

`[INFERENCE]` — mechanisms-in-play same as Cell 2 (same brands):
- pico-8: built-in constrained toolchain (n=1, unique)
- thumby: microcontroller SDK + community (n=1, unique)

No mechanism claimed by 2+ brands. Same conclusion as Cell 2: Arduview's transparent OLED does not
obviously serve the student learn-to-code hook.

**Gate 2 verdict:** FLAG — same as Cell 2. Weak UM alignment for transparent-display hardware in a
student learn-to-code context.

---

#### Gate 3 — Sophistication

**3.1 Stage:**  
`claim_count = 2` | `enhanced_claim_count = 0` | `claims[].type`: direct (×2)

Claims:
- thumby: "Thumby™ is an itty-bitty game system...easy learning tool all-in-one" — `direct`
- pico-8: "Create a whole game or program in one sitting without needing to leave the cosy development environment!" — `direct`

2+ brands deploy `direct` → Stage 1. `[INFERENCE]`.

Cross-check: thumby = "Stage 1", pico-8 = "Stage 2". Same disagreement as Cell 2 — cell-level
verdict = Stage 1.

**3.2–3.4:** Same as Cell 2 — Stage 1, executable, whitespace open.

**Gate 3 verdict:** PASS — Stage 1.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate mode) — passed Gates 1–3, Gate 4 PENDING DEEP-RESEARCH STEP.  
Flags: Gate 1 heavy penalty; Gate 2 FLAG; ranked last alongside Cell 2.

**Prose synthesis:** Demand signal is identical to Cell 2 — same two brands (thumby, pico-8),
same thin supply-side profile, revenue null, trend unknown — durability UNKNOWN. The product
delivers learn-to-code but has no clear UM advantage in the student context; transparent OLED is
not an obvious learn-to-code feature, and price conditioning ($15–$25) is far below viable
Arduview pricing. The claim space is Stage 1 with whitespace, but the weak demand + poor UM fit
makes this a low-priority cell. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 4: retro-gaming-relive × retro-gamers

**Brands in cell (live, in-geo, non-seed):** analogue-pocket, evercade, bitboy  
(anbernic: live in-geo but no verbal claims typed — counted as brand presence; miyoo: excluded,
defunct/region-only per D-08)  
`combos[].brand_count = 3` | `combos[].claim_count = 3` | `combos[].enhanced_claim_count = 0`  
`anti_fluke.qualifying_creatives = 0`

---

#### Gate 1 — Demand

**Signal 1 — Revenue:** `revenue_est.value_usd_monthly = null` for all 3 brands. Revenue null.

**Signal 2 — Ad longevity:** `anti_fluke.qualifying_creatives = 0`. `ads_flag = "yes"` for
anbernic (live ads confirmed, but zero qualifying creatives pre-counted — ads_flag signals ad
presence, not 7+ day longevity). `ads_flag = "unsure"` for analogue-pocket, evercade, bitboy.

**Signal 3 — Crowdfunding:** None for any brand in this cell.

**Trend:** `demand_trend.shape = "unknown"` for all brands. **Durability UNKNOWN — Gate 1 cannot
clear with confidence.**

**Scale gate verdict (soft-gate mode):** 3 brands-at-scale (analogue-pocket at $219.99, evercade
at $79.99–$129.99, bitboy/retromodding at $29.99–$49.99). anbernic (yes ads) adds a 4th brand-at-
presence level. A 3–4 brand field with anbernic's confirmed ad presence suggests the retro-gaming
market is active, but zero qualifying creatives means no 7+ day ad-longevity signal captured.
Under the one-comparable override (SET), anbernic's confirmed `ads_flag = "yes"` is a weak signal
of active paid demand — but `qualifying_creatives = 0` means no individual ad cleared the 7+ day
floor. FLAG: market appears active (4 brands, confirmed ads for anbernic) but no ad-longevity
validation captured; revenue null; trend unknown. Moderate ranking penalty.

**Demand magnitude:** Retro-gaming is a functional demand cell (nostalgia + reliving experiences —
pain-adjacent rather than identity-first). Price band $30–$220 indicates willingness to pay across
a wide spectrum.

**Gate 1 verdict (soft-gate):** FLAG — multi-brand field, confirmed ad spend (anbernic), but no
7+ day longevity captured; revenue null; trend unknown. Moderate demand signal — stronger than
Cells 2/3, weaker than Cell 1 and Cells 5/6. Moderate ranking penalty.

---

#### Gate 2 — Product

**2.1 Mechanism efficacy:** The product (transparent pocket game console, ~50g, 2.42" OLED,
~2hr battery) can deliver retro-gaming-relive in the Arduboy/small-catalog sense (400 preloaded
games). However, against anbernic/miyoo class (hundreds of ROMs, full SNES/GBA/PSP emulation)
the hardware is underpowered; against analogue-pocket (FPGA, authentic cartridge compatibility)
it is in a different category. Per the pre-research-plan.md: "against emulation handhelds
(Anbernic/Miyoo) the hardware is underpowered; against the Arduboy/open expectation it is
on-spec." FLAG: product delivers retro-gaming but NOT at the emulation-breadth level competitors
lead with.

**2.1b Product-category check:** The dominant retro-gaming spend is on emulation handhelds
(Anbernic: full SNES/GBA/PSP library) or FPGA-authentic systems (Analogue Pocket). Arduview's
Arduboy-based hardware does not compete on emulation breadth. FLAG: "demand proven for retro-
gaming-relive transformation, but primarily on emulation-breadth and hardware-authenticity
categories — transfer to a Arduboy-scale catalog is unproven."

**2.1c Price-conditioning:** Market conditioned from $30 (bitboy accessories) to $220 (analogue-
pocket). Mid-range: $80–$130 (evercade). Arduview's likely price needs to compete in this band
with a clear reason not to buy the emulation-breadth device instead.

**2.2 Differentiating axis (mechanisms-in-play derivation):**

Competing bets:
- analogue-pocket: `hardware-authenticity-as-lead`
- evercade: `hardware-authenticity-as-lead`
- bitboy: `hardware-authenticity-as-lead`
- anbernic: `value-breadth-as-lead`

`[INFERENCE]` — mechanisms-in-play from corpus:

| Mechanism cluster | Brands (n=) | Ownability |
|---|---|---|
| FPGA hardware replication — no emulation, exact silicon accuracy | analogue-pocket (two FPGAs, no emulation) | n=1 — unique in cell |
| Licensed physical cartridges — authentic format + pixel-perfect emulation | evercade (licensed carts, "One cart fits all", pixel-perfect emulation) | n=1 — unique |
| Display upgrade mechanism — IPS LCD + transparent/modern shell mod | bitboy (IPS LCD for Game Boy, FunnyPlaying display) | n=1 — unique |
| Multi-cartridge format compatibility (GB/GBC/GBA/Game Gear/Neo Geo Pocket/TG-16/Atari Lynx) | analogue-pocket only | n=1 — unique |
| Value breadth — most games at lowest price, multiple form factors | anbernic (implied by catalog positioning) | n=1 in cell |

No mechanism shared by 3+ brands in this cell. However, all three core brands (analogue-pocket,
evercade, bitboy) converge on hardware-authenticity bets — different mechanisms, same bet type.
The dominant bet type in this cell is `hardware-authenticity-as-lead`.

Arduview's transparent-OLED is absent from all mechanism arrays in this cell. It could occupy
a unique mechanism slot — BUT: the transparent display is a novelty/aesthetic feature, not an
authenticity feature. In a cell dominated by hardware-authenticity bets, Arduview's novel-hardware
lead sits cross-grain to the cell's dominant claim direction. FLAG: "transparent OLED is a
novelty-hardware mechanism, not a hardware-authenticity mechanism — cell is dominated by
authenticity bet, which Arduview cannot match."

**Gate 2 verdict:** FLAG — product can deliver retro-gaming-relive at Arduboy-catalog scale but
cannot compete on emulation breadth (anbernic) or hardware authenticity (analogue-pocket, evercade).
The cell's dominant UM axis (hardware-authenticity) is not Arduview's strength. Weak differentiating
axis in this specific cell. FLAG: UM misalignment with cell's dominant bet type.

---

#### Gate 3 — Sophistication

**3.1 Stage:**  
`claim_count = 3` | `enhanced_claim_count = 0` | `claims[].type`: direct (×3)

Claims:
- "Relive and Discover Gaming's Greatest" — `direct`
- "A tribute to portable gaming." — `direct`
- "No emulation." — `direct` (problem-UM frame — identifies a disqualifying alternative)

2+ brands deploy `direct`. However, from per-brand strings: analogue-pocket = "Stage 3" (mechanism
claim present: "Completely engineered in two FPGAs" + "No emulation."); evercade = "Stage 2"
(enlarged: "The biggest collection of classic, licensed video game cartridges"); bitboy = "Stage 2"
(enlarged: "Crisp and Vibrant Displays" with "IPS LCD" mechanism specifier).

**Disagreement flagged:** analogue-pocket's `per_brand[].sophistication = "Stage 3"` because it
has a named mechanism ("two FPGAs, no emulation"). At the cell grain: `claims[].type = direct` only
(the FPGA claim was typed `direct` as a bare identity statement in the combos[] record). There IS
a mechanism-type claim present at analogue-pocket's brand level — the cell-level aggregation typed
it `direct` because the combos[] record typing was from the headline position, not the full pitch.
Cross-check flag: the retro-gaming-relive cell is closer to Stage 2–3 than Stage 1 alone; the
dominant per-brand strings show Stage 2–3 range.

Cell-level verdict per mechanical rule: highest `claim_type` tier 2+ brands deploy = `direct` →
**Stage 2** (evercade and bitboy both deploy enlarged claims at brand level; two brands at Stage 2
per per-brand strings; one brand at Stage 3). Cell reads Stage 2–3 range. Primary verdict: **Stage 2**
(conservative, per typed-claims at cell grain). Flag: analogue-pocket at Stage 3 signals the cell
is moving toward Stage 3.

**3.2 Required move:** Stage 2 → enlarged/specified claim; Stage 3 approach → UM differentiation.

**3.3 Executability:** The dominant UM in the cell (FPGA-no-emulation for analogue-pocket) IS taken
by a competitor. Arduview cannot claim FPGA authenticity (different hardware). However, Arduview's
transparent-OLED mechanism is NOT in the cell's mechanism set — it is unique in the cell. Whether
it serves the retro-gaming-relive transformation credibly is doubtful (transparent display ≠ retro
authenticity). `[INFERENCE]`.

**3.4 Defense quality:** Stage 2–3 claims present; multiple distinct mechanisms (FPGA, licensed
carts, IPS display). Moderately defended. The FPGA-no-emulation axis is strongly defended by
analogue-pocket alone. Whitespace exists in the value-breadth / novelty-hardware lane but it is
weak alignment with the cell's dominant demand.

**Gate 3 verdict:** PASS (marginal) — Stage 2 with Stage 3 elements; UM has room but the dominant
mechanism (FPGA authenticity) is taken; Arduview's mechanism axis (novelty-transparent-hardware)
cross-cuts the cell's authenticity-dominant demand. Whitespace exists but is cross-grain.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate mode) — passed Gates 1–3 with flags, Gate 4 PENDING DEEP-RESEARCH STEP.  
Flags: Gate 1 moderate penalty; Gate 2 FLAG (product-category transfer unproven; UM misaligned
with cell's dominant bet type); Gate 3 marginal (Stage 2–3, mechanism cross-grain). Ranked mid-low.

**Prose synthesis:** The retro-gaming cell shows multi-brand presence and confirmed ad activity
(anbernic ads_flag=yes), suggesting real demand, but no qualifying ad creatives captured, revenue
null, trend unknown — durability UNKNOWN. Arduview's hardware cannot compete on emulation breadth
or FPGA authenticity — the two dominant UM axes in this cell — and its transparent-OLED novelty
mechanism cross-cuts the cell's authenticity-dominant demand pattern. The cell is at Stage 2–3
range (multiple brands with enlarged/mechanism claims); the FPGA-authenticity axis is taken by
analogue-pocket; whitespace exists in novelty-hardware but maps poorly to retro-authenticity
buyer expectations. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 5: novelty-object-own × edc-aesthetic-collectors

**Brands in cell (live, in-geo, non-seed):** playdate, pocket-operator, divoom  
(nothing-phone: excluded, comparable_bet_seed)  
`combos[].brand_count = 3` | `combos[].claim_count = 4` | `combos[].enhanced_claim_count = 0`  
`anti_fluke.qualifying_creatives = 0`

---

#### Gate 1 — Demand

**Signal 1 — Revenue:** `revenue_est.value_usd_monthly = null` for all 3 brands. Revenue null.

**Signal 2 — Ad longevity:** `anti_fluke.qualifying_creatives = 0`. `ads_flag = "yes"` for divoom
(confirmed active ads). `ads_flag = "unsure"` for playdate, pocket-operator.

**Signal 3 — Crowdfunding:** None for playdate, pocket-operator, divoom.

**Trend:** `demand_trend.shape = "unknown"` for all. **Durability UNKNOWN — Gate 1 cannot clear
with confidence.**

**Scale gate verdict (soft-gate mode):** 3 brands at scale; divoom with confirmed ad spend
(`ads_flag = "yes"`); qualifying_creatives = 0 but divoom ads file shows 0 qualifying creatives
(ads.json count = 0 despite ads_flag = yes — no `run_length_days` data returned). Bet-evidence
via nothing-phone ($549–$699, `comparable_bet_seed=true`, confirmed active ads, `novel-hardware-
as-lead` bet at massive scale) validates the structural bet durably in the adjacent EDC aesthetic
space. One comparable override (SET): nothing-phone's scale is bet-evidence for `novel-hardware-
as-lead` durability; does not make the cell proven, but justifies testing.

Per override #2 (SET): this is a belonging/identity/aesthetic cell — thin competitor spend does
not auto-kill; community-heat read required. Per override #4 (SET): intensity read off community
heat + willingness-to-pay-for-aesthetic, not pain severity.

**Demand magnitude:** Playdate ($199), pocket-operator ($49–$89), divoom ($30–$80) — price band
$30–$200. The novelty-object-own transformation in the edc-aesthetic-collectors niche shows
multi-brand field with spread AOV. FLAG: community-heat read deferred; demand magnitude proxy
unknown.

**Gate 1 verdict (soft-gate):** FLAG — multi-brand field, confirmed adjacent bet-evidence
(nothing-phone), divoom with confirmed ads; qualifying_creatives = 0; revenue null; trend unknown.
Provisionally supported by structural bet durability and brand-presence density. Community-heat
read required. Moderate-to-light ranking penalty (strongest flag profile after Cell 1).

---

#### Gate 2 — Product

**2.1 Mechanism efficacy:** The product delivers novelty-object-own for edc-aesthetic-collectors
— transparent OLED is a showpiece, and "own a remarkable transparent tech object" is exactly the
transformation. Strong mechanism fit. Passes 2.1.

**2.1b Product-category check:** Spend is ON this product category — transparent/novelty aesthetic
gadgets (playdate = novel hardware game console; divoom = LED pixel art device; pocket-operator =
exposed PCB synth). No spend-transfer risk; demand proven on the hardware-as-object category.

**2.1c Price-conditioning:** $30–$200 band. Playdate at $199 is the price ceiling for an indie
novel-hardware device in this cell. Arduview at a similar $80–$160 range would be well-conditioned.

**2.2 Differentiating axis (mechanisms-in-play derivation):**

Competing bets:
- playdate: `novel-hardware-as-lead` (crank as headline)
- pocket-operator: `novel-hardware-as-lead` (exposed PCB as aesthetic identity)
- divoom: `novel-hardware-as-lead` (LED pixel art display as product identity)

ALL three brands in this cell have the SAME bet_type: `novel-hardware-as-lead`. This is the
dominant + shared bet in this cell.

`[INFERENCE]` — mechanisms-in-play from corpus:

| Mechanism cluster | Brands (n=) | Ownability |
|---|---|---|
| Exposed/transparent hardware as the aesthetic identity (PCB as design, no case needed) | pocket-operator (single PCB design, no case, cost savings = quality signal) | n=1 — unique |
| Analog physical input as novel interaction (crank as headline) | playdate (crank, reflective non-backlit screen) | n=1 — unique |
| LED pixel art display = expressive identity + community | divoom (LED matrix, app-controlled, pixel art community) | n=1 — unique |
| No-case/transparent circuit board as cost-quality mechanism | pocket-operator (placed components under LCD → no case → better components) | n=1 — unique (sub-type of above) |

No mechanism shared by 3+ brands. Each brand occupies a distinct mechanism within the same
`novel-hardware-as-lead` bet type. The bet TYPE is shared across all three; the specific MECHANISM
is unique per brand.

Arduview's transparent-OLED mechanism: "see-through display / transparent OLED" is NOT present
in any of the three brands' mechanism arrays. It is a candidate unique mechanism in this cell.
The transparent-OLED mechanism is adjacent to pocket-operator's exposed-PCB mechanism (both
"see-through = the design") but distinct (transparent display vs exposed circuit board).

**UM axis for Arduview in this cell:** `novel-hardware-as-lead` via transparent-OLED-as-display.
This fits the cell's dominant bet type AND occupies a distinct mechanism slot (not claimed by
playdate's crank, pocket-operator's exposed PCB, or divoom's LED pixel art). Best UM-to-cell
alignment across all 6 cells. `[INFERENCE]`.

**2.3 Believability tier:** Tier 1 self-evident — transparent display is visible on inspection.
pocket-operator's exposed-PCB-as-design sets a precedent: "the transparent hardware IS the
product" is a proven believable claim in this cell.

**2.4 Economics:** Market conditioned to $30–$199; pocket-operator at $49–$89 and playdate at
$199 bracket the viable range. Operator COGS pending. FLAG: "economics pending operator COGS."

**Gate 2 verdict:** PASS (strong) — product delivers the transformation; UM axis (transparent
OLED as novel-hardware-lead) is distinct from all 3 competitors' mechanisms; bet type aligns with
the cell's dominant pattern; price band reasonable; Tier 1 believability.

---

#### Gate 3 — Sophistication

**3.1 Stage:**  
`claim_count = 4` | `enhanced_claim_count = 0` | `claims[].type`: direct (×3), enlarged (×1)

Claims:
- "Playdate is familiar, but unlike anything you've ever seen" — `direct`
- "Bring personality, widgets and pixel visuals into your workspace" — `direct`
- "a wall of sound in your pocket." — `direct`
- "pocket operators are small, ultra-portable music devices, with studio quality sound and the flexibility to make music on the go. affordable for everyone and compatible with all other music gear." — `enlarged`

2+ brands deploy `direct`; 1 brand deploys `enlarged`. Stage = highest tier 2+ brands deploy =
`direct` → Stage 1 by mechanical rule. However, 1 enlarged claim is present (pocket-operator).
Per-brand cross-check: playdate = "Stage 1", pocket-operator = "Stage 2", divoom = "Stage 1".
Disagreement: pocket-operator at Stage 2 at brand level; cell-level only 1 brand at Stage 2 →
Stage 1 by cell rule. Cell reads Stage 1 with Stage 2 entering.

**Cell stage verdict: Stage 1–2** (transitioning). `[INFERENCE]`.

**3.2 Required move:** Stage 1/2 — UM has room for a direct or enlarged/specified claim.
Transparent OLED as the lead mechanism has clean whitespace to enter with a statement.

**3.3 Executability:** Stage 1–2; transparent-OLED mechanism not present in any competitor's
mechanism array in this cell → not taken → executable. `[INFERENCE]`.

**3.4 Defense quality:** 4 claims from 3 brands — each brand leads with a distinct mechanism.
The cell is NOT uniformly defended (different claim directions, not the "5+ same claim = dead
ground" saturation pattern). Whitespace open; entering with a novel-hardware mechanism claim
faces low defense resistance. Good whitespace for a new mechanism entrant.

**Gate 3 verdict:** PASS — Stage 1–2; transparent-OLED mechanism executable; whitespace open;
defense is mechanism-differentiated (each brand distinct), not saturated.

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** — passed Gates 1–3, Gate 4 (awareness reachability) PENDING DEEP-RESEARCH STEP.  
Best UM-to-cell alignment in the 6-cell set. Flags: Gate 1 (revenue null, ad longevity 0, trend
unknown — community-heat deferred); economics pending. Ranked high.

**Prose synthesis:** Demand is supported by 3 brands in the novelty-object-own cell (playdate,
pocket-operator, divoom), divoom's confirmed ad spend, and the adjacent nothing-phone
comparable-bet-seed validating `novel-hardware-as-lead` at scale — but revenue is null and trend
unknown for all brands, so durability UNKNOWN. The product's transparent-OLED mechanism is the
strongest UM-to-cell fit across all 6 cells — it sits within the cell's dominant `novel-hardware-
as-lead` bet type, occupies a distinct mechanism slot not claimed by any current competitor, and
achieves Tier-1 believability (visible on inspection). The claim space is Stage 1–2 with
mechanism-differentiated defense (each brand distinct), meaning transparent-OLED enters with
clean whitespace. Awareness PENDING DEEP-RESEARCH STEP.

---

### Cell 6: music-creation × edc-aesthetic-collectors

**Brands in cell (live, in-geo, non-seed):** pocket-operator (only)  
`combos[].brand_count = 1` | `combos[].claim_count = 3` | `combos[].enhanced_claim_count = 0`  
`anti_fluke.qualifying_creatives = 0`  
`_note`: "Single brand — below the 2+ anti-fluke floor. Not an established market in this data set."

---

#### Gate 1 — Demand

**Signal 1 — Revenue:** `revenue_est.value_usd_monthly = null`. Revenue null.

**Signal 2 — Ad longevity:** `anti_fluke.qualifying_creatives = 0`. No qualifying ads.

**Signal 3 — Crowdfunding:** None.

**Trend:** `demand_trend.shape = "unknown"`. **Durability UNKNOWN — Gate 1 cannot clear with
confidence.**

**Scale gate verdict (soft-gate mode):** 1 brand (pocket-operator). BELOW the 2+ anti-fluke floor.
Under the one-comparable override (SET): one validated comparable justifies proceeding to a DRY
TEST only — NOT to commitment. pocket-operator is a real DTC brand with a launched product and
confirmed market presence (`ads_flag = "unsure"`). Sufficient to proceed to test under the override.
FLAG: single brand; below anti-fluke floor; music-creation transformation in edc-aesthetic-collectors
niche is a narrow subsegment. Ranking penalty.

**Demand magnitude (Gate 1.3):** This is an aesthetic/identity cell — intensity measured off
willingness-to-pay-for-aesthetic per override #4 (SET). pocket-operator at $49–$89 shows real
willingness to pay for an aesthetic music-making device. However: single brand, trend unknown.
Community-heat deferred.

**Gate 1 verdict (soft-gate):** FLAG — single brand below anti-fluke floor; one-comparable override
applies; revenue null; trend unknown. Thinner than Cell 1 but pocket-operator is a legitimate
single comparable. Ranking penalty.

---

#### Gate 2 — Product

**2.1 Mechanism efficacy:** The product (transparent pocket game console) does NOT natively
produce music-creation. Arduview is a game console, not a synthesizer or drum machine. The
music-creation transformation would require significant product repositioning or added functionality
(software synthesizer app running on the Arduview hardware). FLAG: "mechanism efficacy for
music-creation transformation is UNPROVEN for Arduview; pocket-operator is a purpose-built
music device."

**2.1b Product-category check:** Spend is on a purpose-built music synthesizer (pocket-operator).
Arduview is a game console. Spend transfer from music-creation synthesizer to a game console
running music software is unproven and requires buyer behavior change. KILL condition approaching.

**Gate 2 verdict:** FLAG (near-kill) — product does not natively deliver the music-creation
transformation; this requires product-category repositioning; spend proven on a dedicated music
device category. Arduview cannot credibly compete on music-creation without a purpose-built music
app becoming the headline offer — which changes the product identity entirely. Heavy flag.

**Note:** Gates 2.2, 2.3, 2.4 analysis abbreviated given the mechanism-efficacy flag; completing
for record:

**2.2:** Competing bet = pocket-operator: `novel-hardware-as-lead` (exposed PCB + studio sound).
`[INFERENCE]` mechanisms: "single PCB, no case, cost savings → better sound" + "16 sound drum
machine and synthesizer with sequencer" + "studio quality sound." These mechanisms are purpose-
built music device mechanisms. Arduview has no equivalent. No differentiating axis available
in music-creation.

**2.4 Economics:** pocket-operator at $49–$89. Arduview at a similar price would need a music
application; no such application in scope.

---

#### Gate 3 — Sophistication

**3.1 Stage:**  
`claim_count = 3` | `enhanced_claim_count = 0` | `claims[].type`: enlarged (×1), direct (×2)

Claims:
- enlarged: "pocket operators are small, ultra-portable music devices, with studio quality sound and the flexibility to make music on the go. affordable for everyone and compatible with all other music gear."
- direct: "a wall of sound in your pocket."
- direct: "affordable for everyone and compatible with all other music gear."

Only 1 brand. No cell-level stage rule applies (requires 2+ brands). With a single brand,
cannot derive a cell-level stage mechanically. Stage is "not established" — single-brand cell.
`[INFERENCE]` if forced: Stage 1–2 by pocket-operator's brand-level sophistication = "Stage 2."

**Gate 3 verdict:** CONDITIONAL — single brand; stage not established at cell level; whitespace
not meaningful when there is only one competitor (no saturation baseline). If Arduview enters,
the cell has effectively Stage 1 by default (first real competitor after pocket-operator).

#### Gate 4 — Awareness
PENDING DEEP-RESEARCH STEP — PROVISIONAL.

#### Verdict
**PROVISIONAL SURVIVOR** (soft-gate mode) — passed Gates 1–3 with heavy Gate 2 flag, Gate 4 PENDING.  
Flags: Gate 1 (single brand, below anti-fluke floor); Gate 2 HEAVY FLAG (mechanism efficacy
unproven; product-category transfer required). Ranked low due to product-transformation mismatch.

**Prose synthesis:** Demand for music-creation in the edc-aesthetic-collectors niche is signaled
by a single real brand (pocket-operator), showing willingness-to-pay at $49–$89 for an aesthetic
music device, but revenue is null, trend unknown, and this is a single-brand cell below the
anti-fluke floor — durability UNKNOWN. Arduview cannot credibly compete on music-creation without
becoming a different product — a game console repurposed as a music synthesizer is not a clean
product-transformation match — so the Gate 2 mechanism-efficacy flag is load-bearing. The claim
space is effectively Stage 1 with one incumbent, but the mechanism mismatch makes this a weak
candidate for Arduview specifically. Awareness PENDING DEEP-RESEARCH STEP.

---

## Ranked PROVISIONAL Survivor List (Soft-Gate, All 6 Carried)

All 6 cells carried through (soft-gate mode). Ranked by relative demand + UM-to-cell alignment +
sophistication difficulty (lower stage = less difficult entry), adjusted for Gate 1/2 flags.

**Operator overrides applied (all 4 SET this run):**
1. One-comparable override: proceed on single strong comparable to DRY TEST only, not commitment.
2. Community-heat caveat: thin maker/identity spend is not an auto-kill; deferred read required.
3. Durability-is-load-bearing: spiked-and-died = WARNING; fad-death is primary risk for this product.
4. Demand-type override: belonging/identity/aesthetic cells read off community heat + willingness-
   to-pay, not pain severity.

---

| Rank | Cell | Gate 1 | Gate 2 | Gate 3 Stage | Key demand signal | UM alignment | Notes |
|------|------|--------|--------|--------------|-------------------|--------------|-------|
| 1 | novelty-object-own × edc-aesthetic-collectors | FLAG (multi-brand, divoom ads, nothing-phone bet-evidence) | PASS STRONG | Stage 1–2 | 3 brands + adj. comparable; divoom confirmed ads | BEST — transparent OLED fits cell's novel-hardware bet; distinct from all 3 competitor mechanisms | Community-heat deferred; trend unknown |
| 2 | maker-identity × maker-diy-hobbyists | FLAG (gameshell funded-shipped + bet-evidence) | PASS | Stage 1 | gameshell crowdfunding $350K+ (funded-shipped); bet-evidence from flipper-zero/arduboy | GOOD — transparent OLED unique in cell; open-hackability angle also available | Community-heat deferred; one-comparable via crowdfunding only |
| 3 | retro-gaming-relive × retro-gamers | FLAG (4 brands, anbernic ads) | FLAG (UM misaligned) | Stage 2–3 | anbernic confirmed ads; multi-brand active field | WEAK — transparent OLED cross-grain to authenticity-dominant cell demand | Product-category transfer partially unproven at emulation scale; authenticity axis taken |
| 4 | music-creation × edc-aesthetic-collectors | FLAG (single brand) | HEAVY FLAG (mechanism mismatch) | Stage 1–2 (single brand) | pocket-operator: 1 real brand, $49–89 willingness to pay | POOR — game console ≠ music device without repurposing | Product-transformation mismatch; single brand below anti-fluke floor |
| 5 | learn-to-code × maker-diy-hobbyists | FLAG HEAVY (0 qualifying signals) | FLAG (price conditioning $15–$25) | Stage 1 | thumby + pico-8: brand presence only; no qualifying signals | WEAK — transparent OLED not a learn-to-code mechanism | Price band far below viable Arduview price; UM misaligned |
| 6 | learn-to-code × learn-to-code-students | FLAG HEAVY (0 qualifying signals) | FLAG (same as Cell 2) | Stage 1 | Same brands as Cell 5; same thin signal | WEAK — same UM misalignment | Institutional/STEM spend possible but not captured; same conclusions as Cell 2 |

---

**Note on Cells 5 and 6 (learn-to-code):** Ranked 5 and 6 as near-equivalent; their order is
interchangeable given the data. Cell 6 (learn-to-code-students) may have real institutional demand
not captured in this run; that would move it up if confirmed. Both require separate reads before
ascending.

**Note on Cell 4 (retro-gaming-relive):** Ranks 3 because of multi-brand active field and confirmed
ad spend, but the UM misalignment is a real structural problem for Arduview specifically. A different
product with FPGA or emulation-breadth capability would rank this cell higher.

**Note on Cell 6 (music-creation) vs Cells 5/6 (learn-to-code):** Music-creation ranks 4 despite
single-brand below-anti-fluke profile because pocket-operator's mechanism-fit precedent (exposed
hardware = aesthetic music object) is structurally adjacent to Arduview's transparent-OLED — if
Arduview ships a music-synthesis app as a primary feature, this cell could rise. That is a product
decision, not a market-selection read.

---

**TOP PRIORITY:** Cells 1 and 2 (novelty-object-own × edc-aesthetic-collectors and maker-identity
× maker-diy-hobbyists) are the clearest candidates based on this data. Both require:
- Trends fetch fix (demand durability unknown for all brands)
- Community-heat read (identity/aesthetic cells per override #2)
- Operator COGS verification (economics pending)
- Gate 4 awareness read (PENDING DEEP-RESEARCH STEP)

**This output stops here. The bet pick (which cell(s) to take to a dry test) is the operator's D1 decision.**
