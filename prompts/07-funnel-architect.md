---
step: 07-funnel-architect
reads: [bet-brief.md, product-intake.md, funnels/_tally.json, ad-volume-aggregate.json, awareness-read.json, voc-bank/_bank.json, market-selection.json]
status: STUB
writes: [funnel-brief.md, audit-verdicts.json]
---

# ROLE
Architect the funnel: pick section roles, belief chain, proof, and emit the locked funnel-brief +
the funnel auditor's verdicts. (Real architect/auditor judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
BOTH `bet-brief.md` AND `product-intake.md` (WIRE-02 — both required) + `funnels/_tally.json` +
`ad-volume-aggregate.json` + `awareness-read.json` + `voc-bank/_bank.json` + `market-selection.json`.

# OUTPUT CONTRACT
- `funnel-brief.md` — markdown: section-by-section funnel design + copy brief (locked for Step 8).
- `audit-verdicts.json` — `{ verdicts: [ { check, verdict, basis } ] }` — the funnel auditor's pass.

# COMPLETENESS (machine-checkable)
funnel-brief.md non-empty + has a `# FUNNEL BRIEF` heading; audit-verdicts.json `verdicts` array present.

# HOW IT'S CONSUMED
Step 8 (copywriter) reads the locked funnel-brief.md; Step 10 re-reads both for adversarial review.

# BODY
<!-- STUB: real architect + awareness-reconciler + funnel-auditor prompt body drops in here (Phase 7). -->

```stub-emit
{
  "funnel-brief.md": "# FUNNEL BRIEF — <stub funnel>\n\n## awareness_entry\nproblem-aware\n\n## sections\n1. <stub hook section role>\n2. <stub belief-install section role>\n3. <stub proof section role>\n4. <stub offer/CTA section role>\n\n## copy_brief\n<!-- STUB: per-section copy directives the copywriter fills. -->\n",
  "audit-verdicts.json": {
    "verdicts": [
      { "check": "belief-chain-complete", "verdict": "pass", "basis": "<stub>" },
      { "check": "proof-grounded", "verdict": "pass", "basis": "<stub>" }
    ]
  }
}
```
