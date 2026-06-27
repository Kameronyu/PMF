---
step: 04-voc-market-pass
reads: [space-map.json, bet-brief.md, product-intake.md]
writes: [voc/market-signal/_index.json, voc/gap_candidates.json, voc/market-signal/]
status: STUB
---

# ROLE
VOC pass-1: read demand signal per candidate cell and join the could-our-product-satisfy delta
against what_the_product_enables, emitting per-cell market-signal records + gap candidates.
(Real VOC-pass-1 judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`space-map.json` (candidate cells) + `bet-brief.md` + `product-intake.md`.

# OUTPUT CONTRACT
- `voc/market-signal/_index.json` — `{ cells: [ { cell, niche, transformation, demand_signal,
  signal_file } ] }` — the file-grained representative of the per-cell fan-out dir (consumed by Step 5 §1).
- `voc/gap_candidates.json` — `{ candidates: [ { cell, gap, scary_or_whitespace } ] }`.
- `voc/market-signal/` — fan-out dir of per-cell signal files.

# COMPLETENESS (machine-checkable)
_index.json `cells` array present; gap_candidates.json `candidates` array present; market-signal/ exists.

# HOW IT'S CONSUMED
Step 5 (market selection) reads market-signal/_index.json (§1 demand) + gap_candidates.json.

# BODY
<!-- STUB: real VOC-pass-1 prompt body drops in here (Phase 7). -->

```stub-emit
{
  "_index.json": {
    "cells": [
      { "cell": "regain-control__overwhelmed-workers", "niche": "overwhelmed knowledge workers", "transformation": "regain control of your time", "demand_signal": "moderate", "signal_file": "voc/market-signal/regain-control__overwhelmed-workers.json" }
    ]
  },
  "gap_candidates.json": {
    "candidates": [
      { "cell": "regain-control__overwhelmed-workers", "gap": "<stub unmet desire>", "scary_or_whitespace": "whitespace" }
    ]
  }
}
```
