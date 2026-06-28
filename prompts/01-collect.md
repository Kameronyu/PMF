---
step: 01-collect
reads: [bet-brief.md]
writes: [brands.json, queries_run.json, dumps/]
status: STUB
---

# ROLE
Search the bet's territories for real competitors, slop-filter, audit coverage, and dump each
brand's verbatim funnel bytes. (Real Finder/Slop/Coverage/Dumper judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`bet-brief.md` (Step 0) — the whole brief is the Finder's net. Refuse if absent/empty.

# OUTPUT CONTRACT
- `brands.json` — `{ brands: [ { slug, brand, url, sells_observed, channel, lane, revenue_est } ] }`.
  Every brand carries a non-empty `url` + `sells_observed`; `channel`∈{dtc|marketplace|crowdfunding};
  `lane`∈{major|crowdfunding|marketplace}; any non-null `revenue_est.value_usd_monthly` carries
  `method`+`confidence` (validate-finder.js + validate-revenue.js enforce this NOW).
- `queries_run.json` — `{ queries: [ { query, territory, hits } ] }` coverage audit trail.
- `dumps/` — fan-out dir of per-brand verbatim funnel dumps (one file per brand).

# COMPLETENESS (machine-checkable)
brands.json `brands` array non-empty + passes finder+revenue validators; queries_run.json has a
`queries` array; dumps/ dir exists.

# HOW IT'S CONSUMED
Step 2 (funnel analysis) reads brands.json as the verified roster and assembles from dumps/.

# BODY
<!-- STUB: real Finder/Slop/Coverage/Dumper prompt body drops in here (Phase 7). -->

```stub-emit
{
  "brands.json": {
    "brands": [
      {
        "slug": "stub-brand-a",
        "brand": "Stub Brand A",
        "url": "https://stub-brand-a.example.com",
        "sells_observed": "stub product line A",
        "channel": "dtc",
        "lane": "major",
        "revenue_est": { "value_usd_monthly": null, "method": "review_proxy", "confidence": "low" }
      },
      {
        "slug": "stub-brand-b",
        "brand": "Stub Brand B",
        "url": "https://stub-brand-b.example.com",
        "sells_observed": "stub product line B",
        "channel": "crowdfunding",
        "lane": "crowdfunding",
        "revenue_est": { "value_usd_monthly": null, "method": "review_proxy", "confidence": "low" }
      }
    ]
  },
  "queries_run.json": {
    "queries": [
      { "query": "<stub query>", "territory": "<stub territory>", "hits": 2 }
    ]
  }
}
```
