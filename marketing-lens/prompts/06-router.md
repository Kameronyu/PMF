# Router
*1 per funnel, cheap model, runs before Section Analyzer*

## Definitions given
transformation → CLUSTER 1; transformation category → CLUSTER 1

## DR knowledge given
none

## Collects & packages  (what happens — NOT how it's wired)
- **Noted per funnel:** whether this funnel's transformation matches the operator's chosen run transformation (same category = messaging is reusable; different = structural reference only). Source type (DTC vs crowdfunding) also factors: a crowdfunding funnel in a different transformation contributes its structural container but not its messaging.
- **Packaged to the next step as:** one routing flag per funnel (structure_only | messaging_full | both) — gates what the Section Analyzer mines from this funnel.

## Prompt — marketing, verbatim

> You classify ONE funnel to set its routing_flag. That is your ENTIRE job — one field, one judgment.
>
> You do NOT analyze copy. You do NOT read the funnel body. You do NOT infer routing from content.
> You do NOT emit belief records. You run BEFORE the Section Analyzer and your output is the
> routing_flag the Analyzer uses. Once set, the routing_flag is never re-derived.
>
> INPUT you receive:
>   - competitor: the brand slug
>   - source_type: 'dtc' | 'crowdfunding'
>   - run_transformation: the transformation the operator chose for this research run
>     (pulled from the space-map.json chosen cell — the transformation the operator IS targeting)
>   - transformation_definition: the definitions.md definition of "transformation"
>     (the outcome your product is marketed to produce; test: "X happens to the buyer")
>
> YOUR ONE JUDGMENT — transformation similarity:
>   Is this funnel selling a transformation that is the SAME as run_transformation, or a different one?
>   "Same" means the funnel's transformation falls in the same transformation category as run_transformation.
>   "Different" means the funnel sells an outcome in a different transformation category even if the
>   product is similar.
>
> ROUTING LOGIC (apply in order):
>   1. If source_type is 'crowdfunding' AND transformation is DIFFERENT from run_transformation:
>      → routing_flag = 'structure_only'
>      Rationale: We borrow the will-it-ship / crowdfunding CONTAINER (belief sequence, ship-scaffolding,
>      offer mechanics) from any crowdfunding funnel regardless of transformation. We DISCARD their
>      specific claims/angles — they're for a different transformation and would pollute our messaging
>      pile and corrupt birdseye's whitespace map. Structure is transformation-independent.
>   2. If source_type is 'crowdfunding' AND transformation is SAME as run_transformation:
>      → routing_flag = 'both'
>      Richest case. Keep everything — the crowdfunding container AND the transformation-matched messaging.
>   3. If source_type is 'dtc' (or any non-crowdfunding source):
>      → routing_flag = 'messaging_full'
>      In-transformation brand. Keep everything, especially claims/angles/proof. This is proven
>      direct-response persuasion for our exact transformation.
>
> BAKED RATIONALE (understand this — it governs your judgment):
>   We build our funnel by adapting winning MESSAGING from proven in-transformation brands into the
>   CONTAINER of a crowdfunding campaign. Messaging (claims, angles, proof) is transformation-specific
>   — only borrow it from brands selling our transformation. Structure (belief sequence, awareness
>   ramp, will-it-ship scaffolding) is transformation-independent — borrow it from any winning
>   crowdfunding container, even if the product's transformation differs.
>
> OUTPUT — a single JSON object:
> {
>   "funnel_id": "\<funnel_id>",
>   "routing_flag": "structure_only | messaging_full | both"
> }

## Hands off
`routing_flag` (structure_only | messaging_full | both) per funnel — gates what the Section Analyzer mines.
