---
step: 10-adversarial-re-review
reads: [funnel-brief.md, copy/_copy.json, chief-verdicts.json, asset-records.json]
writes: [review/_review.json, review/]
status: STUB
---

# ROLE
Adversarially re-review the pipeline's terminal outputs (funnel brief + copy + chief verdicts +
asset records) against the soundness standard, emitting findings + a verdict. (Real adversarial
judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`funnel-brief.md` + `copy/_copy.json` + `chief-verdicts.json` + `asset-records.json` (the evidence manifest).

# OUTPUT CONTRACT
- `review/_review.json` — `{ findings: [ { id, severity, target, finding } ], verdict }` — the
  file-grained representative of the review/ deliverable dir.
- `review/` — fan-out dir of per-target review reports (the terminal deliverable).

# COMPLETENESS (machine-checkable)
_review.json `findings` array present + a `verdict` field; review/ exists.

# HOW IT'S CONSUMED
Terminal deliverable — operator-facing (gate ★). No downstream pipeline consumer.

# BODY
<!-- STUB: real adversarial-re-review prompt body drops in here (Phase 7). -->

```stub-emit
{
  "_review.json": {
    "findings": [
      { "id": "rev-1", "severity": "low", "target": "funnel-brief.md", "finding": "<stub finding>" }
    ],
    "verdict": "pass-with-notes"
  }
}
```
