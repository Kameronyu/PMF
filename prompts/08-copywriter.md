---
step: 08-copywriter
reads: [funnel-brief.md, voc-bank/_bank.json]
writes: [copy/_copy.json, chief-verdicts.json, copy/]
status: STUB
---

# ROLE
Write the funnel copy from the locked brief + slot-scoped VOC RAG, then the Copy Chief grades each
line. (Real copywriter/chief judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`funnel-brief.md` (locked, Step 7) + `voc-bank/_bank.json` (slot-scoped RAG, via funnel-rag-query.js).

# OUTPUT CONTRACT
- `copy/_copy.json` — `{ sections: [ { section, slot, copy } ] }` — the file-grained representative
  of the copy/ fan-out dir.
- `chief-verdicts.json` — `{ verdicts: [ { line_id, verdict, note } ] }` — Copy Chief line grades.
- `copy/` — fan-out dir of per-section copy files.

# COMPLETENESS (machine-checkable)
_copy.json `sections` array present; chief-verdicts.json `verdicts` array present; copy/ exists.

# HOW IT'S CONSUMED
Step 10 (adversarial re-review) reads copy/_copy.json + chief-verdicts.json as the copy evidence.

# BODY
<!-- STUB: real copywriter + copy-chief prompt body drops in here (Phase 7). -->

```stub-emit
{
  "_copy.json": {
    "sections": [
      { "section": "hook", "slot": "headline", "copy": "<stub headline copy>" },
      { "section": "offer", "slot": "cta", "copy": "<stub CTA copy>" }
    ]
  },
  "chief-verdicts.json": {
    "verdicts": [
      { "line_id": "hook-1", "verdict": "pass", "note": "<stub>" },
      { "line_id": "cta-1", "verdict": "pass", "note": "<stub>" }
    ]
  }
}
```
