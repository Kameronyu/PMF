# engine/contracts/schemas/ — record field-shape contracts

Each `*.schema.json` is the **field shape** of one pipeline record, extracted from the prompt files
(per A1a/A2 rulings). Value *meanings* live in the operator's prompts; *value sets* live in
`../enums.json`; *semantic rules* (verbatim-substring, traceability, no-classify) are enforced by the
named validator, not expressible in the shape.

| Record | Schema file | Produced by (PROVISIONAL) | Enforced by | Enum refs |
|---|---|---|---|---|
| `brands.json` | `brands.schema.json` | s1-finder + revenue-estimate.js + site-fetch.js | validate-finder.js, validate-revenue.js | CHANNEL, LANE, DEMAND_TREND_SHAPE |
| `corpus/<slug>/dump.json` | `dump.schema.json` | s1-dumper (per brand) | validate-dumper.js | — |
| `runs/<space>/space-map.json` | `space-map.schema.json` | s1-space-classifier | validate-classifier.js | CLAIM_TYPE, DEMAND_TREND_SHAPE |
| funnel 6a (funnel-level) | `funnel-fields.schema.json` | s2-section-analyzer + s2-router + funnel-score.js | validate-analyzer.js | CLAIM_TYPE, AWARENESS_ENTRY, ROUTING_FLAG |
| funnel 6b (belief-instance) | `belief-record.schema.json` | s2-section-analyzer | validate-analyzer.js | BELIEF_ID_ANCHORS, BELIEF_KIND, EXECUTION_TYPE, PROOF_TIER, MOVE |
| asset-classify record | `asset-record.schema.json` | asset agents | validate-asset-record.js | SHOT_TYPE, DISQUALIFIER, ASSET_STRENGTH, BEST_USE, DISPLAY_STATE |

**Status notes:**
- `asset-record.schema.json` is PARTIAL (enum refs only) — full shape extraction deferred to H0.
- All `s1-*/s2-*` agent labels are PROVISIONAL — reconciled against the operator's rebuilt I/O contracts.
- `validate-dumper.js`/`validate-classifier.js` semantic rules (verbatim, traceability, per-cell saturation) are in the validator source, intentionally not duplicated here.
