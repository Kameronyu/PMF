# Arduview — Pre-Research Plan (Phase 1 Run Context)

> Worked example of `prompts/_templates/pre-research-plan.template.md`. The product-specific context
> that travels with the Phase 1 light-pass run for Arduview. Pairs with: the product-agnostic Phase 1
> structural feedback, the BOM (`Arduview_bom.xlsx`), and the product description
> (`Arduview_Product_Description.docx`) — both attached to the run.

This file is the planning-phase deliverable. It sets the per-run inputs the deterministic pipeline locks in at run-start: the bet, the territory net, the definitions, and what the run reports back.

---

## What this run IS and IS NOT validating

**IS:** supply-side demand validation. Is there proven, durable, multi-competitor (or single-strong-comparable) spend behind the bet(s) below, across the candidate territories, with the fad-death check intact. Output is a map for *picking which territory to study deeply*, not the pick itself.

**IS NOT:** market selection (that is the decision/gap-analysis skill, downstream). NOT transformation discovery in the deep sense — the run surfaces the *claimed* transformations competitors assert; the *true* transformation (e.g. status vs hobby vs belonging for the maker niche) is a later VOC/review-mine job. NOT a community-heat read (deferred — see "Deferred reads"). Whoever reads the output must not over-claim it past supply-side spend validation.

## The product (no positioning judgments — what it physically is)

A fully transparent pocket game console. The DISPLAY is a genuine see-through OLED — game pixels light up on a transparent glass pane you can see through, not a normal screen behind a clear case. Transparent shell + transparent PCB + transparent display. Arduboy-based: ATmega32U4, data-capable USB-C, genuinely Arduino-IDE-flashable / hackable (confirmed off the BOM — the 32U4 + data USB-C means it is programmable, not a sealed ROM box; W25Q128 flash holds the 400 preloaded games, consistent with the Arduboy FX pattern). ~50g. 2.42" 128×64 OLED, ~2hr battery.

Why it matters for the run: the **see-through OLED is exotic/rare hardware** — almost nothing in the adjacent space has a transparent display. That rarity is the product's strongest candidate differentiator, and it is a *novelty-tech* play, which carries fad-death as its primary risk. The durability signal (trend shape) is therefore the load-bearing supply-side field for this product — an empty durability column silently disables the most important validation.

## THE BET BRIEF

The transformation slot is intentionally OPEN in every bet below — the operator does not know it (status? hobby identity? belonging? cutting-edge signalling?) and that is correct: the competitors reveal it, it is an OUTPUT.

### Primary bet
**Novel / flashy / rare hardware, led as the headline differentiator, wins in the maker / open-source / DIY-hobbyist niche — for whatever transformation that niche actually buys.**

### Definitions (operator's, explicit — every stage reads these, no re-interpretation)
- **Flashy / novel hardware as lead** = a rare or visually-striking hardware feature run as the HEADLINE of the pitch (transparent/see-through display, glyph lights, unusual form factor, exotic display tech). NOT a spec-bump (faster/thinner/cheaper). Test: is the unusual hardware THE pitch, or a footnote?
- **Maker / open / DIY niche** = sells to people who value building, modifying, flashing, or owning open/hackable tech themselves. Signals: open-source framing, "program/flash it yourself," community/showcase culture, kit/hackable positioning, Arduino / Raspberry Pi / Flipper adjacency.

### Candidate territories the run must also surface (the Finder net spans ALL of these)
The primary bet is the maker-niche slice. The product plausibly also serves these adjacent territories; the run reports each as its own set of cells so the operator can see where proven spend actually concentrates:
- **Aesthetic / object-as-statement** — bought to own and show a remarkable object; transparency = showpiece. (Strongest UM-to-transformation match; no craft-credibility tension.)
- **Retro-gaming nostalgia** — "modern retro" / clear-electronics-era nostalgia. NOTE: against emulation handhelds (Anbernic/Miyoo) the hardware is underpowered; against the Arduboy/open expectation it is on-spec. Read this territory carefully — do not let an emulation-class comparison wrongly read the hardware as weak.
- **EDC / pocket-carry-cool** — curated cool object you carry and pull out. Minor; let the data flag it if novelty-tech spend clusters here.
- **Learn-to-code / STEM** — programmable teaching object. Fallback only (buyer≠user pivot, weakly preferred), kept in the hunt because institutional spend is real — let demand decide.

Hold all territories LOOSELY. The run should also flag any UNANTICIPATED cluster where novel-tech / form-first objects are winning — a territory the data nominates that the operator did not name. Letting the data nominate a market is explicitly in scope; do not constrain to the named list.

### Comparable-bet brands that MUST be in the pool (wide-net requirement)
The bet validates only if structurally-similar bets are present. The Finder must reach beyond near-identical clones to brands making the same structural bet (novel-hardware-as-lead): e.g. Nothing Phone (transparent-back / glyph — the direct novelty-tech-as-identity analog), Flipper Zero (bought-but-signals-membership maker object), exotic-display / transparent-electronics gadgets, clear-shell retro handhelds, Arduboy itself and its clones, maker/open-hardware crowdfunding projects (Crowd Supply, Kickstarter, Indiegogo). An empty comparable-bet pool reads identically to a failed bet — false-negatives kill live opportunities silently, so the net width is load-bearing.

**Seeded comparables are BET-EVIDENCE, not saturation-evidence.** The named seeds (Nothing, Flipper, Arduboy, etc.) are guaranteed into the pool to prove "this structural bet won durably at scale" — they answer the bet's durability question. They MUST NOT have their (often massive, cross-category) revenue counted into a maker-niche saturation cell: Nothing Phone at phone-scale does not make the maker handheld niche saturated. The Classifier tags these as `comparable_bet_seed: true` and reads them as bet-durability evidence only; their counts are excluded from per-cell saturation exactly the way dead/region-only brands are excluded from live saturation (D-08 discipline). Two jobs, kept separate: they prove the bet, not the cell.

### The maker sub-identity fork the run should help discriminate (context for the report-back)
The maker bet's strength depends on WHICH maker identity is real, and these have different durability/UM implications:
- **builder/skill-signal** — flex is "I built this"; a bought-cool object reads slightly wrong → transparency weak.
- **cultural-membership** — flex is "I'm in this scene" (Flipper-type bought-but-belongs) → transparency okay.
- **cutting-edge / early-adopter** — flex is "I know about and have the rarest/newest tech"; bought-and-exotic is the point → transparency STRONG; well-supported by Nothing/Flipper precedent; KEY RISK is durability not validity. May also be the best crowdfunding-MOMENT fit (a pre-launch is an early-adopter sale by definition).
The run cannot fully resolve this (it is partly a VOC question), but sorting comparable-bet competitors into durable-won vs spiked-died, and capturing which sub-identity their positioning targets, is most of the pre-VOC answer.

### What the run reports back (per structurally-similar competitor)
1. The transformation the competitor attaches to the flashy-hardware-lead (the OPEN slot — the operator cannot pre-fill it).
2. The mechanism / UM they actually LEAD with — so the operator sees whether "novel hardware" is genuinely the lead or whether the real lead is something else (guards against the operator's own assumption).
3. Whether the bet won DURABLY (trend shape + crowdfunding status).
4. Which niche they sold to (so bet × niche can be crossed at the decision step).

## Supply-side validation stance (operator decisions, for the assessor downstream)

- **Anti-fluke floor override, consciously made:** the framework default is 2+ brands at scale. For this novelty/crowdfunding play the operator will **proceed on a single strong validated comparable — but only to a DRY TEST, not to commitment.** One validated competitor justifies testing (cheap, bounded); it does NOT justify skipping the dry test to commit MOQ/production. The validation-before-MOQ rule (10–30 real purchase signals before committing) is the backstop that keeps "proceed on one comparable" safe.
- Durability is the load-bearing supply-side signal here (fad-death is the #1 risk). A comparable that spiked and died is a WARNING, not validation, even if its peak revenue cleared a floor.

## Deferred reads (explicitly out of THIS run's scope)

- **Community heat** → separate read, NOT collected here. The maker/open niche may have intense-but-under-monetized demand (passionate small community, few brands hard-monetizing) that a pure supply-side-spend map under-counts. Operator decision: deferred to a separate read; this run uses validated competitor spend as the supply-side gate. (Implication the assessor should hold: do not treat thin competitor-spend in the maker niche as an automatic kill — but that judgment lives in the separate read, not this run.)
- **True transformation depth (signal vs craft, the dream-of-the-dream)** → Phase 2 VOC / review-mine. This run captures only the CLAIMED transformations competitors assert.
- **bet_type × niche × durability crossing** → assembled at the decision / gap-analysis step. This run collects the three ingredients per brand; the crossing is decision-time synthesis, not a Phase 1 output cell.

---

## PIPELINE INPUTS
> Layer B — the flat lists the scripts read. Headings are load-bearing; contents are bulleted strings.

### LP-hunt query terms
> Search queries — territory-derived, rich (no leading `/`, so the parser routes these to lpQueries). Replaces any prior product's hardcoded template.
- retro-handheld
- transparent / clear-shell gadget
- maker / open-hardware
- EDC / pocket-carry
- novelty-tech / collectible
- gift
- learn-to-code / STEM
> URL-path patterns — LEAN. Hardware-gadget brands segment by product line, not by buyer-transformation, so paths are mostly generic commerce + the few maker pages that live at predictable paths. These leading-`/` bullets route to lpPaths and prevent fallback to the InkLeaf territory-path template (`/focus` `/students` `/parents`), which is wrong for this product type.
- /products/
- /collections/
- /shop/
- /store
- /hackable
- /open-source
- /sdk
- /docs
- /pages/

### Comparable-bet seed brands (Finder must reach these)
- Nothing Phone (transparent-back / glyph — novelty-tech-as-identity analog)
- Flipper Zero (bought-but-signals-membership maker object)
- Arduboy + its clones
- exotic-display / transparent-electronics gadgets
- clear-shell retro handhelds
- maker/open-hardware crowdfunding projects — Crowd Supply, Kickstarter, Indiegogo

### Trend source
- Google Trends per brand/category term, ~5yr window — `demand_trend` MUST be populated, not `unknown` (durability is the #1 signal for this novelty bet).

### Claim-typing example domains (multi-domain range incl. feature-vs-claim trap)
- Feature-vs-claim trap (THIS domain): "see-through display / transparent OLED" = FEATURE/mechanism, NOT a claim; "relive the games you grew up on" = an outcome-claim. Inoculates against miscounting the headline feature as a claim and inflating the stage read.
- plus ≥1 non-gadget domain (e.g. supplement, skincare) typed across direct/enlarged/mechanism/enhanced so the classifier doesn't over-fit one domain.
</content>
