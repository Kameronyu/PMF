# <PRODUCT> — Pre-Research Plan (Phase 1 Run Context)

> **What this file is.** The product-specific context that travels with a Phase 1 light-pass run.
> It is the planning-phase deliverable (hand-filled for now). It sets the per-run inputs the
> deterministic pipeline locks in at run-start: the bet, the territory net, the definitions, the
> pipeline-input lists, and what the run reports back.
>
> **How Phase 1 consumes it (do not break this):**
> - **Layer A — prose (everything above `PIPELINE INPUTS`):** injected verbatim into the Finder +
>   Classifier as a `<bet_brief>` context block. No schema. Never hook-validated. Write it like a brief.
> - **Layer B — the `PIPELINE INPUTS` block at the bottom:** flat lists the scripts read (fetch.js).
>   Keep the headings; the contents are just bulleted strings.
> - **Layer C — the pipeline's OUTPUT schema:** product-agnostic, lives in the prompt, NOT here.
>   This file never defines output fields.

---

## What this run IS and IS NOT validating
- **IS:** <supply-side demand validation — proven, durable, multi-competitor (or single-strong-comparable) spend behind the bet, with the fad-death check intact. Output = a map for PICKING which territory to study deeply, not the pick.>
- **IS NOT:** <market selection (downstream skill); deep transformation discovery (later VOC); community-heat (separate read). State what the reader must NOT over-claim.>

## The product (physical description, no positioning judgments)
<What it physically is — verbatim from spec/BOM. End with one line: which physical feature is the strongest candidate differentiator and what its primary risk is (e.g. novelty → fad-death → durability is the load-bearing field).>

## THE BET BRIEF
> The transformation slot is intentionally OPEN. The operator supplies the BET, not the transformation —
> competitors reveal the transformation; it is an OUTPUT of the run.

### Primary bet
**<differentiator-under-test> led as the headline, wins in <niche-under-test>, for whatever transformation that niche actually buys.**

### Definitions (operator's own words — every stage reads these, no re-interpretation)
- **<the differentiator>** = <what counts / what does NOT count. Give a one-line test.>
- **<the niche>** = <signals that identify it.>
- <any other interpretation-heavy term pinned once here.>

### Candidate territories the Finder net must span
<List each adjacent territory the product plausibly serves; the run reports each as its own cells.
Hold them LOOSELY. Explicitly invite the data to nominate an UNANTICIPATED territory — that is in scope.>

### Comparable-bet brands that MUST be in the pool (wide-net requirement)
<Named brands making the SAME STRUCTURAL BET (not near-identical clones) + the platforms to sweep
(Kickstarter / Indiegogo / Crowd Supply / Amazon / DTC). An empty comparable pool reads identically
to a failed bet — net width is load-bearing.>

### What the run reports back (per structurally-similar competitor)
1. The transformation the competitor attaches (the OPEN slot).
2. The mechanism / UM they actually LEAD with (guards against the operator's own assumption).
3. Whether the bet won DURABLY (trend shape + crowdfunding status).
4. Which niche they sold to.

## Supply-side validation stance (for the downstream assessor)
<Any conscious anti-fluke override — e.g. "proceed on a single strong comparable, but only to a DRY TEST,
not to commitment." Note that a spiked-and-died comparable is a WARNING, not validation.>

## Deferred reads (out of THIS run's scope)
<Community heat → separate read. True transformation depth → Phase 2 VOC. bet_type × niche × durability
crossing → decision-time synthesis (Phase 1 collects the ingredients only).>

---

## PIPELINE INPUTS
> Layer B. The scripts read these flat lists. Keep the four headings; fill with bulleted strings.

### LP-hunt query terms
<the product's actual territories as search terms — replaces any prior product's hardcoded template>

### Comparable-bet seed brands (Finder must reach these)
<the named brands from the bet brief above, as a flat list>

### Trend source
- Google Trends per brand/category term, ~5yr window — `demand_trend` MUST be populated, not `unknown`.

### Claim-typing example domains (for the Classifier's multi-domain range)
<2–4 domains likely in this pool + one feature-vs-claim trap worked in THIS product's domain
(the striking FEATURE shown as feature/mechanism NOT a claim, beside a real outcome-claim)>
</content>
