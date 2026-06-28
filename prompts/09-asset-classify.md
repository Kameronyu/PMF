---
step: 09-asset-classify
reads: [asset-classify/CLAIM-LIST.json]
writes: [asset-records.json]
status: STUB
---

# ROLE
Classify each operator-supplied asset against the product's capability CLAIM-LIST, emitting one
record per asset. (Real asset-classify judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`asset-classify/CLAIM-LIST.json` (Step 0, WIRE-01). Operator-asset bytes are script-assembled by the
asset-fetch.js pre-script (never in context).

# OUTPUT CONTRACT
- `asset-records.json` — `{ records: [ { asset_id, claim_ids, asset_type, supports } ] }` — each
  record maps an asset to the claim(s) it supports.

# COMPLETENESS (machine-checkable)
asset-records.json `records` array present; every record carries asset_id + claim_ids.

# HOW IT'S CONSUMED
Step 10 (adversarial re-review) reads asset-records.json as the asset evidence manifest.

# BODY
<!-- STUB: real asset-classify prompt body drops in here (Phase 7). -->

```stub-emit
{
  "asset-records.json": {
    "records": [
      { "asset_id": "asset-1", "claim_ids": ["claim-1"], "asset_type": "image", "supports": true },
      { "asset_id": "asset-2", "claim_ids": ["claim-2"], "asset_type": "video", "supports": false }
    ]
  }
}
```
