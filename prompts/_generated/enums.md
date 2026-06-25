<!-- GENERATED FILE — do not edit by hand. Source: engine/contracts/enums.json.
     Regenerate: node engine/bricks/gen-enums-md.js -->

# Closed enums (engine contract)

These are the **frozen value sets** the engine enforces. A value off-list is a HARD REJECT
at the enforcing validator. Value *meanings* live in the marketing prompts/definitions — this
file carries only the value sets, so a prompt rewrite cannot silently drift a contract.

## CHANNEL  `(closed)`

Allowed values:
- `dtc`
- `marketplace`
- `crowdfunding`

- **enforced by:** validate-finder.js
- **consumed by:** brands.json (per-brand channel)

## LANE  `(closed)`

Allowed values:
- `major`
- `crowdfunding`
- `marketplace`

- **enforced by:** validate-finder.js
- **consumed by:** brands.json (per-brand lane)

## CLAIM_TYPE  `(closed)`

Allowed values:
- `direct`
- `enlarged`
- `mechanism`
- `enhanced`

- **enforced by:** validate-classifier.js, validate-analyzer.js
- **consumed by:** space-map.json (combos[].claims[].type), funnel-fields (claim_type)
- **note:** REUSED across light-pass and deep-pass — do NOT coin a parallel vocab.

## DEMAND_TREND_SHAPE  `(closed)`

Allowed values:
- `steady`
- `rising`
- `parabolic-spike`
- `declining`
- `unknown`

- **enforced by:** validate-classifier.js
- **consumed by:** brands.json (demand_trend.shape), space-map.json (per_brand.demand_trend.shape)
- **note:** 'unknown' is the escape valve when no trend source resolves.

## EXECUTION_TYPE  `(closed)`

Allowed values:
- `mechanism-explanation`
- `feature-as-evidence`
- `demo`
- `authority`
- `social-proof`
- `founder-credibility`
- `risk-reversal`
- `scarcity`
- `urgency`
- `exclusivity`
- `story-epiphany`
- `comparison`
- `consequence-of-inaction`

- **enforced by:** validate-analyzer.js
- **consumed by:** belief-record (execution_type)

## PROOF_TIER  `(closed)`

Allowed values:
- `Tier1`
- `Tier2`
- `Tier3`

- **enforced by:** validate-analyzer.js
- **consumed by:** belief-record (proof_tier)

## MOVE  `(closed)`

Allowed values:
- `market-avatar-flip`
- `market-transformation-change`
- `um-mechanism-reveal`
- `um-problem-framing`
- `um-proprietary-naming`
- `angle-desire`
- `angle-pain`
- `angle-external-blame`
- `angle-care-signaling`
- `angle-identity-belonging`
- `angle-curiosity-secret`
- `offer-bundle`
- `offer-guarantee`
- `offer-urgency-scarcity`
- `offer-price-anchor`

- **enforced by:** validate-analyzer.js
- **consumed by:** belief-record (moves[])

## BELIEF_ID_ANCHORS  `(open-with-anchors)`

Allowed values:
- `problem-exists`
- `problem-matters`
- `past-solutions-failed`
- `mechanism-is-the-reason`
- `product-delivers-transformation`
- `trust-the-brand-or-founder`
- `it-will-ship`
- `its-worth-the-price`
- `act-now`

- **enforced by:** validate-analyzer.js
- **consumed by:** belief-record (belief_id)
- **note:** Prefer an anchor. If none fits, a new belief_id is allowed BUT belief_confidence MUST be 'low' (overflow flagged for review).

## BELIEF_KIND  `(closed)`

Allowed values:
- `crowdfunding-specific`
- `general-dr`

- **enforced by:** validate-analyzer.js
- **consumed by:** belief-record (belief_kind)
- **note:** Added commit 35581d4 (Phase 15 D1). Was a ghost field; now enforced.

## AWARENESS_ENTRY  `(closed)`

Allowed values:
- `unaware`
- `problem-aware`
- `solution-aware`
- `product-aware`
- `offer-aware`

- **enforced by:** validate-analyzer.js
- **consumed by:** funnel-fields (awareness_entry)

## ROUTING_FLAG  `(closed)`

Allowed values:
- `structure_only`
- `messaging_full`
- `both`

- **enforced by:** funnel-deep-pass schema (Router-set at plan time)
- **consumed by:** funnel-fields (routing_flag), funnel-rag-query.js (routing prefilter)
- **H0 verify:** Confirm a validator Set actually enforces this on write (no ROUTING_FLAG_ENUM Set found in validate-analyzer.js grep).

## SHOT_TYPE  `(closed)`

Allowed values:
- `hero`
- `detail_macro`
- `in_hand_scale`
- `lifestyle_context`
- `screen_on_ui`
- `turntable_frame`
- `packaging_unboxing`
- `group_collection`
- `diagram_annotated`

- **enforced by:** validate-asset-record.js
- **consumed by:** asset-record (shot_type)

## DISQUALIFIER  `(closed)`

Allowed values:
- `text_overlay`
- `watermark`
- `low_res`
- `wrong_product`
- `competitor_ad`
- `sensitive`

- **enforced by:** validate-asset-record.js
- **consumed by:** asset-record (disqualifiers[])

## ASSET_STRENGTH  `(closed)`

Allowed values:
- `strong`
- `partial`
- `incidental`

- **enforced by:** validate-asset-record.js
- **consumed by:** asset-record (strength)
- **note:** Declared as STRENGTH_ENUM in validate-asset-record.js; namespaced ASSET_STRENGTH here to avoid collision.

## BEST_USE  `(closed)`

Allowed values:
- `hero_loop`
- `feature_demo`
- `full_explainer`

- **enforced by:** validate-asset-record.js
- **consumed by:** asset-record (best_use)

## DISPLAY_STATE  `(closed)`

Allowed values:
- `off`
- `on_glow`
- `on_legible`

- **enforced by:** validate-asset-record.js
- **consumed by:** asset-record (display_state)

---

## Contract-gated (NOT yet frozen)

Fields documented but NOT yet a frozen enum. The engine will not invent values; the operator must define the value set, then it moves into `enums` above.

### source_routing
- **status:** pending-operator-vocab
- **referenced by:** funnel-architect SKILL (consumes), funnel-rag-query.js (routing_flag prefilter)
- **note:** Ghost field — referenced downstream but never emitted. belief_kind was its sibling and got resolved (35581d4); source_routing still needs the operator to define categories. Until then: a SAFE-NOW fix removes the ghost references.
