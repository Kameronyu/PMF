---
step: 05-market-selection
reads: [space-map.json, voc/market-signal/_index.json, voc/gap_candidates.json, bet-brief.md]
writes: [market-selection.json, ntp-pick.json]
status: STUB
---

# ROLE
Rank surviving cells on supply-side map + demand signal + gap candidates against the bet's NTP gate,
and surface the operator's NTP pick. (Real market-selection judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`space-map.json` (supply) + `voc/market-signal/_index.json` (§1 demand) + `voc/gap_candidates.json`
+ `bet-brief.md` (NTP gate context).

# OUTPUT CONTRACT
- `market-selection.json` — `{ ranked: [ { cell, niche, transformation, score, verdict } ] }`.
- `ntp-pick.json` — `{ pick: { cell, niche, transformation }, decided_by }` — the winner cell
  (operator gate ★) that Step 6 deep-dives.

# COMPLETENESS (machine-checkable)
market-selection.json `ranked` array present; ntp-pick.json carries a `pick` object with a cell.

# HOW IT'S CONSUMED
Step 6 (VOC deep pass) reads ntp-pick.json (the winner cell); Step 7 reads market-selection.json.

# BODY
<!-- STUB: real market-selection prompt body drops in here (Phase 7). -->

```stub-emit
{
  "market-selection.json": {
    "ranked": [
      { "cell": "regain-control__overwhelmed-workers", "niche": "overwhelmed knowledge workers", "transformation": "regain control of your time", "score": 0.82, "verdict": "selected" }
    ]
  },
  "ntp-pick.json": {
    "pick": { "cell": "regain-control__overwhelmed-workers", "niche": "overwhelmed knowledge workers", "transformation": "regain control of your time" },
    "decided_by": "operator (auto-approved in smoke)"
  }
}
```
