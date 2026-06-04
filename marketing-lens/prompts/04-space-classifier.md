# Space Classifier
*1 agent, reads ALL dumps — the only judgment stage in the light pass*

## Definitions given
transformation → CLUSTER 1; niche → CLUSTER 1; market → CLUSTER 1; claim → CLUSTER 2; enhanced claim → CLUSTER 2; UM types → CLUSTER 3; angle → CLUSTER 3; sophistication stages → CLUSTER 4; awareness levels → CLUSTER 4 (referenced for D-05 drop note)

## DR knowledge given
none

## Collects & packages  (what happens — NOT how it's wired)
- **Noted per brand:** canonical transformation(s) with raw claim variants, canonical niches, canonical angles, structural bet type (named in the space's own terms, page-quoted basis), demand trend shape (carried from fetch — not recomputed), and a sophistication stage (1–5) read off the typed-claim distribution in the brand's combo cell(s), with an evidence line citing the claims and brand count that set the stage.
- **Noted per combo cell (transformation × niche):** brand count, creative count, typed claims with claim_type (direct/enlarged/mechanism/enhanced), enhanced claim count, mechanism ownability (shared = 3+ brands, unique = ≤2), and the anti-fluke qualifying counts.
- **Space-wide:** canonical mechanisms-in-play with ownability across all live in-geo brands; canonical bet_types with raw variants tracing to real per-brand reads; saturation per combo cell (never pooled across cells).
- **Packaged to the next step as:** one unified space-map covering all transformation × niche combos, staged claim-type distributions, mechanism ownability (shared/unique), demand trend shapes, and per-brand bet types. This is the sole decision input for the Market Selection assessor.

## Prompt — marketing, verbatim

> You read EVERY brand's dump.json together and classify the space. You are the only stage that sees
> all brands at once — your job is to unify vocabulary so the same thing isn't named two ways.
>
> \<bet_brief>
> The operator authors a per-run bet brief (hand-filled from prompts/_templates/pre-research-plan.template.md;
> worked example runs/arduview/pre-research-plan.md). It is injected here VERBATIM as PROSE context — it has
> no schema and is NEVER hook-validated. Read it as judgment context, never as a field contract. Three strict layers:
>   (A) the prose brief → your judgment context (this block);
>   (B) a fenced `PIPELINE INPUTS` block inside the brief (flat lists: LP-hunt terms, comparable-bet seed
>       brands, trend-source toggle) → read by SCRIPTS with a tolerant parse, NOT by you;
>   (C) the output schema (space-map.json) → enforced by hooks. Hooks only ever touch layer C.
> The brief states: the BET = a differentiator × a niche × an OPEN transformation slot — the operator does
> NOT supply the transformation; competitors REVEAL it as OUTPUT. It also pins operator definitions of the
> interpretation-heavy terms (no stage re-interprets them) and lists the named comparable-bet seed brands +
> the territory set. Use the brief's pinned definitions when you name canonical transformations/niches/angles/bet_types,
> and report, per structurally-similar competitor, the transformation they attach, the mechanism they actually
> LEAD with, whether the bet won durably, and which niche.
> A messy or rich brief may degrade quality but must NEVER hard-fail the run.
> \</bet_brief>
>
> DO:
> 1. For each PITCH (across all creatives), cluster its claims into a canonical TRANSFORMATION and
>    stamp it onto that pitch. "stay locked in" / "deep work" / "stop doomscrolling" → "focus-productivity".
>    List raw_claim_variants under each. A transformation is a CLAIM CATEGORY — the life-outcome the
>    claims promise, not a feature/spec/angle. Because you label the pitch (not the creative), each
>    transformation stays BOUND to its pitch's mechanism + problem_um — never analyzed in a vacuum.
>    This lets you ask "transformation X is achieved by which mechanisms / justified by which cause?"
> 1b. TYPE each claim — assign exactly one CLAIM_TYPE_ENUM value, the sophistication-ladder read
>     (traces to definitions.md stages). This is the load-bearing field for Gate 3 downstream:
>       - direct    — bare outcome promise ("removes wrinkles", "blocks distractions").
>       - enlarged  — specified / quantified / conditional ("removes wrinkles in 14 days", "2x focus").
>       - mechanism — claim tied to a named how/why ("removes wrinkles via retinol microspheres").
>       - enhanced  — claim stacked on a UM or superlative differentiation ("the ONLY retinol clinically
>                     shown to…", "patented amber backlight no competitor can run").
>     WORKED EXAMPLES (span domains — do NOT anchor on one product's vocabulary):
>       - direct    — "removes wrinkles" (skincare) · "fall asleep faster" (sleep) · "blocks distractions" (productivity).
>       - enlarged  — "removes wrinkles in 14 days" (skincare) · "asleep in under 20 min" (sleep) · "2x deep-work hours" (productivity).
>       - mechanism — "via retinol microspheres" (skincare) · "via magnesium glycinate" (supplement) · "via an amber distraction-free display" (hardware).
>       - enhanced  — "the ONLY retinol clinically shown to…" (skincare) · "the only magnesium with 3 published RCTs" (supplement).
>     FEATURE-vs-CLAIM TRAP (the inoculation): a striking FEATURE is NOT a claim and is NOT typed —
>       "a 4.5mm titanium body / 16K-pressure stylus" is a FEATURE/mechanism shown as spec, NOT promoted to a
>       claim — sitting beside a real outcome-claim "write for 40 days on one charge" (that is the typed claim).
>       Miscounting a headline feature as a claim inflates the stage/saturation read — do NOT do it.
>     LAYER DISCIPLINE (do not conflate — a mistype here corrupts the stage read):
>       - A FEATURE is not a claim. "thinnest 4.5mm / 16K stylus / faster refresh" = features → NOT typed.
>       - A MECHANISM alone is not a claim; it becomes claim_type:"mechanism" only when bound to an outcome.
>       - "Paper-like feel" = a decayed Product-UM now a saturated minimalism ANGLE → NOT a claim.
>     Per combo cell, output `claim_count`, `enhanced_claim_count`, and the typed `claims[]` list.
> 2. Cluster niche_raw signals into canonical NICHES the same way.
> 2b. Cluster angle_raw signals into canonical ANGLES the same way (the emotional-frame families
>     actually run in this space — emergent, not a fixed list). List raw variants under each.
> 3. Stamp canonical_transformation + canonical_niche + canonical_angle back onto context, and build
>    COMBOS (transformation × niche) with brand_count + creative_count + which brands.
> 4. Per brand: list its transformations (+ creative counts), niches, a bet_type call (see
>    BET TYPE below), a demand_trend carry (see DEMAND TREND below), and a sophistication call
>    (Stage 1-5) read off the cell's claim_type distribution per the SOPHISTICATION block below —
>    the evidence line cites the claim(s) + brand count that set the stage; never eyeball the stage.
> 4b. BET TYPE (per brand) — read OFF the brand's OWN positioning/page what structural bet it leads
>     with. This is page-readable: you decide from how the brand presents itself, WITHOUT needing to
>     know the customer's true dream/desire. NAME the structural bet in the space's own terms — do NOT
>     pick from a fixed list, there is no enum; this is OPEN like transformation/niche/angle.
>     Populate for EVERY captured brand (live, dead, or region-only alike — it is a per-brand
>     descriptor, not a live-saturation count, so the live-only exclusion does NOT apply here).
>     Record a `bet_type_basis` that QUOTES/CITES the page signal you read the bet off — same
>     discipline as the sophistication evidence line: read it off the page, do NOT eyeball it.
>     Then unify the per-brand bet_type reads into canonical `bet_types[]` with `raw_variants`,
>     exactly as you cluster transformations — variants must trace back to real per-brand reads.
>     This feeds the Phase 2 Gate-2 structural-bet read.
> 4c. DEMAND TREND (per brand) — carry each brand's `demand_trend` record from its brands.json entry
>     into per_brand[]. Do NOT recompute it — it is a fetch.js Google Trends read, not your judgment.
>     If a brand's `demand_trend.shape` is `unknown`, list it as `unknown` — never guess a shape.
>     demand_trend is the load-bearing fad-death / parabolic-spike durability signal the Phase 2
>     Gate-1 kill reads (a parabolic-spike brand in a declining trend = structural fad risk).
> SOPHISTICATION (per combo cell = transformation × niche)
> The stage = the height of the most-saturated differentiation layer competitors
> already occupy in this cell. It tells you the FLOOR you must clear to out-persuade
> them. Read it off the typed claims — do not eyeball it.
>
> Across all LIVE, in-geography brands in the cell, look at the claim_type distribution:
>   - Stage 1 — barely anyone makes the base claim yet; transformation is fresh.
>               (few brands, sparse `direct`) → floor: just state the claim.
>   - Stage 2 — multiple brands make the base claim; `enlarged` claims appearing
>               (quantified/specified/conditional: "in 14 days", "2x focus").
>               → floor: a sharper/specified claim.
>   - Stage 3 — `mechanism` claims present (outcome tied to a named how/why:
>               "via retinol microspheres", "amber backlight"); a UM exists in the cell.
>               → floor: your own mechanism/UM — a bare claim no longer competes.
>   - Stage 4 — competing mechanisms + `enhanced` claims stacking mechanism+superlative
>               ("the ONLY x clinically shown"); feature-level escalation.
>               → floor: an alternative/better Feature-UM + angle.
>   - Stage 5 — `enhanced`/extraordinary-identifier saturation: claims maxed, edge is now
>               extraordinary identifiers (named authority, major press, proprietary UM
>               competitors can't match) + angle + value model.
>               → floor: extraordinary-tier trust + angle + copy excellence.
>
> Mechanical rule: stage = the highest claim_type tier that 2+ LIVE in-geo brands deploy
> in the cell. 5+ RULE: if 5+ live brands make the same base (`direct`) claim, that claim
> is discounted — cell is ≥Stage 2 and claim-saturated. Evidence line MUST cite the
> claim(s) + brand count that set the stage.
>
> 5. Saturation: count brands per COMBO CELL (transformation × niche). NEVER pool across cells.
> 6. Mechanisms-in-play judgment (PRIMARY) → `mechanisms_in_play[]`. Cluster the per-pitch `mechanism[]`
>    strings (the rich how/why field — the Feature-UM the brand leads with) into canonical mechanisms,
>    exactly as you unify `bet_types[]` (4b): each canonical carries `raw_variants` that trace back to real
>    per-pitch reads. Then per cluster, count DISTINCT brands and set `ownability`:
>      - `shared` = 3+ distinct brands lead the same mechanism → NOT ownable (taken).
>      - `unique` = ≤2 brands (1 = clean candidate UM; 2 = borderline / not-yet-shared — keep `brand_count:2`
>        so the nuance stays visible).
>    Emit BOTH: (a) the space-wide canonical `mechanisms_in_play[]`, and (b) a per-combo
>    `mechanisms_in_play[]` on each `combos[]` cell, with `ownability` recomputed PER CELL — a
>    mechanism shared in another cell is not taken here (Gate 3.3-S3 reads the per-cell set).
>    EXCLUDE `comparable_bet_seed` and dead/region-only brands from the counts (same live-only
>    discipline as saturation, D-08). This shared-vs-unique call can only be made here, with all
>    brands in view.
>    Source = `mechanism[]` (rich, ~30/36 non-empty); NOT `problem_um_raw`.
> 7. Problem-UM judgment (SECONDARY, only when non-empty): cluster the `problem_um_raw` causal stories the
>    same shared(3+)/unique(1) way. KEEP THIS SEPARATE from `mechanisms_in_play[]` — never fold a pain-causal
>    "why you suffer" story into a how-it-works mechanism. `problem_um_raw` is sparse by design for
>    gadget/maker spaces (~6/36); empty is expected, not a gap — skip the cluster if there are no non-empty
>    entries. This is supplementary to the mechanism read above, not a substitute for it.
>
> RULES:
> - Every canonical label must trace to raw variants actually present in the dumps. No invented categories.
> - Transformation ≠ feature ≠ angle ≠ mechanism. Worked examples span domains (see WORKED EXAMPLES
>   above): "paper-like feel" = decayed Product-UM acting as a minimalism ANGLE, not a transformation.
>   "AI note-taking" = a mechanism/feature, not a transformation. "thinnest 4.5mm" = a feature, not a
>   claim. "fall asleep faster" = direct claim (sleep domain). "via magnesium glycinate" = mechanism
>   claim only when bound to an outcome. Apply FEATURE-vs-CLAIM TRAP discipline across ALL domains —
>   do NOT anchor examples on one product's vocabulary.
> - bet_type is the structural bet each brand leads with, NAMED in the space's own terms (OPEN — no
>   enum), with a page-quoted basis — never eyeballed; canonical bet_types[] must trace to real
>   per-brand reads.

## Hands off
`space-map.json` — canonical transformation × niche combos, staged claim-type distributions, mechanism ownability (shared/unique), demand_trend shapes, bet_types per brand. This is the sole decision input for the Market Selection assessor.
