---
step: 03-space-map
reads: [ad-volume-aggregate.json, funnels/_tally.json, bet-brief.md]
writes: [space-map.json]
status: STUB
---

# ROLE
See ALL funnels at once and **canonicalize** the raw per-funnel labels into a deduped space map —
transformations / niches / angles / saturation cells. Emits the **canonical** tier (WIRE-03 tier 2).
(Real Space-Classifier judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`ad-volume-aggregate.json` + `funnels/_tally.json` (Step 2 raw signals) + `bet-brief.md` (Step 0 ntp
context). Refuse on a missing/invalid bet-brief.

# OUTPUT CONTRACT — WIRE-03 TIER 2 (canonical, across all funnels)
`space-map.json` carries canonical groups whose `raw_variants` trace back to Step 2's raw labels:
- `transformations: [ { canonical, raw_claim_variants[] } ]` — each canonical dedupes ≥1 Step-2 raw
  transformation. (validate-classifier.js: zero raw_claim_variants is a REJECT.)
- `niches: [ { canonical, raw_variants[] } ]`, `angles: [ { canonical, raw_variants[] } ]`,
  `bet_types: [ { canonical, raw_variants[] } ]`, `mechanisms_in_play: [ { canonical, raw_variants[] } ]`.
- `saturation: [ { transformation, niche, ... } ]` — keyed PER CELL (both fields required).
- `combos: [ { transformation, niche, claim_count, enhanced_claim_count, claims: [ { type } ] } ]`.
- `per_brand: [ { slug, bet_type, bet_type_basis, demand_trend: { shape }, sophistication } ]`.

# COMPLETENESS (machine-checkable)
Passes validate-classifier.js: every canonical label has non-empty raw_variants; saturation per-cell;
combos carry claim_count+enhanced_claim_count (enhanced ≤ claim) + on-enum claim types; per_brand
carries bet_type+bet_type_basis+on-enum demand_trend.shape.

# HOW IT'S CONSUMED
Step 4 (VOC market pass) reads candidate cells; Step 5 (market selection) reads the supply-side map.
The canonical labels here are the dedupe of Step 2's raw tier — that raw→canonical collapse IS WIRE-03.

# BODY
<!-- STUB: real Space-Classifier prompt body drops in here (Phase 7). -->

```stub-emit
{
  "space-map.json": {
    "transformations": [
      { "canonical": "regain control of your time", "raw_claim_variants": ["get organized fast", "finally feel in control"] }
    ],
    "niches": [
      { "canonical": "overwhelmed knowledge workers", "raw_variants": ["overwhelmed", "chaos sufferers"] }
    ],
    "angles": [
      { "canonical": "tame the overwhelm", "raw_variants": ["beat the overwhelm", "stop the chaos"] }
    ],
    "bet_types": [
      { "canonical": "productivity-as-calm", "raw_variants": ["organizer", "control system"] }
    ],
    "mechanisms_in_play": [
      { "canonical": "single-surface capture", "raw_variants": ["one place for everything", "central hub"], "ownability": "unique", "brand_count": 2 }
    ],
    "saturation": [
      { "transformation": "regain control of your time", "niche": "overwhelmed knowledge workers", "level": "moderate" }
    ],
    "combos": [
      {
        "transformation": "regain control of your time",
        "niche": "overwhelmed knowledge workers",
        "brands": ["stub-brand-a", "stub-brand-b"],
        "claim_count": 2,
        "enhanced_claim_count": 1,
        "claims": [ { "type": "direct" }, { "type": "enlarged" } ]
      }
    ],
    "per_brand": [
      { "slug": "stub-brand-a", "bet_type": "organizer", "bet_type_basis": "stub: page quote A", "demand_trend": { "shape": "steady" }, "sophistication": "stage-3" },
      { "slug": "stub-brand-b", "bet_type": "control system", "bet_type_basis": "stub: page quote B", "demand_trend": { "shape": "rising" }, "sophistication": "stage-2" }
    ]
  }
}
```
