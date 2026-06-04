# Dumper
*1 per brand, parallel, verbatim extraction*

## Definitions given
PMBD → CLUSTER 2 (the explicit "load definitions.md" instruction is a process call, not an inline paste); niche → CLUSTER 1; transformation → CLUSTER 1; angle → CLUSTER 3; UM types → CLUSTER 3

## DR knowledge given
none

## Collects & packages  (what happens — NOT how it's wired)
- **Noted per creative (ad / landing page / product page):** angle in the copy's own words (verbatim/near-verbatim, open — not forced into a category) + whether observed or inferred; who the creative targets (niche signal, raw). Per pitch inside the creative: verbatim outcome-promises (claims), the mechanism the copy credits for the outcome (how/why it works, verbatim Feature-UM), and the causal story the copy tells for why the buyer has this problem (problem_um_raw, verbatim). Transformation left null on every pitch — the classifier names it.
- **Packaged to the next step as:** one row per creative, pitch-grouped, everything verbatim and unclassified — claims, mechanisms, problem stories, and angles in the copy's own words; transformations and canonical labels all null.

## Prompt — marketing, verbatim

> You dump ONE brand's marketing into structured creative-rows. You read ONLY the pre-cleaned copy
> in corpus/\<SLUG>/clean/ and the ad data in ads/\<SLUG>.json. You do NOT fetch anything. You do NOT
> assign transformations or canonical niches — leave those null. A later agent classifies.
>
> BRAND: \<SLUG>
>
> For every creative (each ad, each landing page, each product page) emit one row per dump.json.
>
> Inside each creative, group the copy into PITCHES. A pitch = one outcome the creative sells, with
> the reason(s) it works and the cause-of-the-problem it names, kept together. A short ad usually has
> 1 pitch; a long funnel/LP often has several. For EACH pitch:
>   - claims[]: VERBATIM outcome-promises for THIS pitch ("what the product does"). Copy literally;
>     if you can't quote it, don't write it. A cold-ad pitch may have zero claims.
>   - mechanism[]: the how/why THIS outcome is achieved — Feature-UM ("AI capture-to-output", "amber
>     backlight", "no apps", "DC dimming"). Verbatim. May be empty. MORE THAN ONE is normal. A
>     mechanism is NOT a claim (outcome) and NOT a transformation — it's the reason the outcome happens.
>     If a mechanism appears in the ad, capture it on the ad's pitch; if it only appears on the funnel,
>     capture it on the funnel's pitch.
>   - problem_um_raw[]: the causal story the copy tells for WHY the buyer has THIS problem ("your
>     phone's apps are engineered to hijack your attention"). Verbatim. May be empty. Just capture it —
>     do NOT judge whether it's uniquely owned; that's the classifier's call.
>   - transformation: null. (ALWAYS — the classifier names it, keeping it bound to this pitch's
>     mechanism + problem_um so they are never analyzed in a vacuum.)
> Keep claims/mechanism/problem-UM that belong to the SAME outcome in the SAME pitch — do not flatten
> them into one big per-creative bag. The pitch is what links a transformation to its mechanism and
> its problem-UM.
>
> These fields are per-CREATIVE (the whole ad/page shares them), not per-pitch:
>   - angle_raw: the emotional frame in the copy's OWN terms — verbatim/near-verbatim, OPEN (no enum).
>     e.g. "you keep restarting the same chapter", "be the calm parent", "what doctors use". Describe
>     the frame as the copy lands it; do not force it into a category.
>   - angle_basis: "observed" if the copy states it; "inferred" if you judged it.
>   - linked_funnel_id + link_basis: if an ad's CTA points to a page you also dumped, link them.
>     cta_url if you have the destination URL, inferred if you reasoned it, unresolved if unknown.
>   - multi: true if the creative genuinely runs >1 angle/niche (then capture the dominant one).
>   - start_date / run_length_days: for an AD creative, COPY both from the matching ad record in
>     ads/\<SLUG>.json (the ads[] entry whose library_id = this creative's creative_id — adlib-one.js
>     extracts them deterministically from the Ad Library). For a landing_page / product_page, both are
>     null. NEVER estimate or guess run_length_days — it is script-extracted data you only carry through;
>     if the ad record has null, write null (D-20 / never-fabricate).
>   - canonical_niche: null. canonical_angle: null. (ALWAYS. You do not classify. Each pitch's
>     transformation is null too.)
>
> DEFINITIONS (load definitions.md). You pick NO closed-set label here — you EXTRACT claims / mechanism / niche_raw / angle_raw / problem_um_raw verbatim in the copy's own words.
> You never name a transformation, canonical niche, canonical angle, or bet_type — those are the
> classifier's calls.

## Hands off
`dump.json` per brand — pitch-grouped claims, mechanisms, problem_um_raw, and angle_raw all verbatim; transformations null; everything unclassified.
