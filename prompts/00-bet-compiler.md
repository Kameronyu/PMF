---
step: 00-bet-compiler
reads: []
writes: [bet-brief.md, product-intake.md, asset-classify/CLAIM-LIST.json]
status: STUB
---

# ROLE
Decide the product **bet** and enumerate what the product enables, emitting the bet-brief +
product-intake + the product's own capability-CLAIM-LIST. (Real judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
Operator intake (what the product physically is) + KB digest. This step has no upstream artifact
reads; the operator hands the intake in conversation. Refuse if the product's physical nature is
unknowable.

# OUTPUT CONTRACT
- `bet-brief.md` — markdown: product_overview, product_features (≥3), what_the_product_enables
  table, ≥1 bet (statement + differentiator + niche + transformation_slot + ntp_anchors),
  comparable_bet_seed_brands, territories (≥3).
- `product-intake.md` — markdown: the product spec / BOM the architect (Step 7) re-reads.
- `asset-classify/CLAIM-LIST.json` — `{ claims: [ { claim_id, text, load_bearing } ] }` — the
  product's own capability-claim ledger consumed by Step 9 (WIRE-01).

# COMPLETENESS (machine-checkable)
bet-brief.md non-empty + has a `# BET BRIEF` heading; product-intake.md non-empty; CLAIM-LIST.json
has a `claims` array, every claim carries `claim_id` + `text` + boolean `load_bearing`.

# HOW IT'S CONSUMED
Finder (Step 1) ingests the whole bet-brief; Space Map (Step 3) reads bet-brief for ntp context;
VOC pass-1 (Step 4) joins against what_the_product_enables; Step 7 re-reads product-intake.md;
Step 9 reads CLAIM-LIST.json (the former dangling input, now closed).

# BODY
<!-- STUB: real bet-compiler prompt body drops in here (Phase 7 content job). -->

```stub-emit
{
  "bet-brief.md": "# BET BRIEF — <stub product>\n\n## product_overview\n<stub: what the product physically is>\n\n## product_features\n- <stub feature 1>\n- <stub feature 2>\n- <stub feature 3>\n\n## what_the_product_enables\n| capability_id | functional_job | transformation | serves_niche |\n| --- | --- | --- | --- |\n| cap-1 | <stub job> | <stub transformation> | <stub niche> |\n\n## bets\n### bet-1\nbet_statement: <stub bet>\ndifferentiator: <stub lever>\nniche: <stub niche>\ntransformation_slot: ASSERTED: <stub>\nntp_anchors: { niche: <stub>, transformation: <stub>, product_category: <stub> }\n\n## territories\n- <stub territory 1>\n- <stub territory 2>\n- <stub territory 3>\n\n## comparable_bet_seed_brands\n- <stub-brand>\n",
  "product-intake.md": "# product-intake — <stub product>\n\n<!-- STUB: product spec / BOM. Re-read by Step 7 (WIRE-02). -->\n- form_factor: <stub>\n- key_components: <stub>\n- deliverability_notes: <stub>\n",
  "CLAIM-LIST.json": {
    "claims": [
      { "claim_id": "claim-1", "text": "<stub capability claim>", "load_bearing": true },
      { "claim_id": "claim-2", "text": "<stub secondary claim>", "load_bearing": false }
    ]
  }
}
```
