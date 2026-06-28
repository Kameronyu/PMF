---
step: 06-voc-deep-pass
reads: [ntp-pick.json]
writes: [voc-bank/_bank.json, awareness-read.json, voc-bank/]
status: STUB
---

# ROLE
VOC pass-2/3 on the winner cell: mine PMBDE-frequency verbatims into a slot-scoped copy bank +
read the market's awareness stage. (Real VOC-deep-pass judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`ntp-pick.json` (Step 5) — the winner cell to deep-dive.

# OUTPUT CONTRACT
- `voc-bank/_bank.json` — `{ entries: [ { id, slot, verbatim, pmbde } ] }` — the file-grained
  representative of the voc-bank/ store (consumed by Steps 7 & 8).
- `awareness-read.json` — `{ awareness_stage, basis }` — the reconciled awareness read.
- `voc-bank/` — fan-out dir for the copy bank (vectorized by the funnel-vectorize.js post-script).

# COMPLETENESS (machine-checkable)
_bank.json `entries` array present; awareness-read.json carries `awareness_stage`; voc-bank/ exists.

# HOW IT'S CONSUMED
Step 7 (architect) reads voc-bank/_bank.json + awareness-read.json; Step 8 RAGs the slot-scoped bank.

# BODY
<!-- STUB: real VOC-deep-pass prompt body drops in here (Phase 7). -->

```stub-emit
{
  "_bank.json": {
    "entries": [
      { "id": "voc-1", "slot": "pain", "verbatim": "<stub verbatim pain>", "pmbde": "problem" },
      { "id": "voc-2", "slot": "desire", "verbatim": "<stub verbatim desire>", "pmbde": "desire" }
    ]
  },
  "awareness-read.json": {
    "awareness_stage": "problem-aware",
    "basis": "<stub: dominant awareness frame across the bank>"
  }
}
```
