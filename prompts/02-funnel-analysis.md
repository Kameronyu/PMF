---
step: 02-funnel-analysis
reads: [brands.json]
writes: [ad-volume-aggregate.json, funnels/_tally.json, funnels/]
status: STUB
---

# ROLE
Read each brand's funnel as single-idea units (RAW, per funnel) and deterministically quantify ad
volume per transformation × angle. Emits **raw, un-canonicalized** per-funnel
angle/claim/transformation (WIRE-03 tier 1). (Real Section-Analyzer judgment deferred — see BODY.)

# INPUTS (refuse if missing — P3)
`brands.json` (Step 1) — the verified roster. dumps/ are assembled via the funnel-assemble pre-script.

# OUTPUT CONTRACT — WIRE-03 TIER 1 (raw, per individual funnel; NOT canonicalized)
- `funnels/_tally.json` — `{ funnels: [ { funnel_id, brand_slug, transformation(raw), angle(raw),
  awareness_basis, claims: [ { text, type } ] } ] }`. The `transformation`/`angle`/`claims[].text`
  are **raw local labels** in each funnel's own words — Step 3 canonicalizes them across funnels.
- `ad-volume-aggregate.json` — `{ rows: [ { transformation(raw), angle(raw), funnel_count, ad_count,
  max_ad_longevity_days } ] }`. Rows keyed by RAW transformation × angle (not yet deduped).
- `funnels/` — fan-out dir of per-funnel analyzed records.

# COMPLETENESS (machine-checkable)
_tally.json `funnels` array non-empty, every funnel carries funnel_id + raw transformation + raw
angle + awareness_basis; aggregate `rows` array present with raw transformation+angle keys; funnels/
dir exists.

# HOW IT'S CONSUMED
Step 3 (space map) reads the raw labels from _tally.json + ad-volume-aggregate.json and
**canonicalizes** them into the deduped space-map (WIRE-03 tier 2). The raw labels here are the
`raw_variants` that Step 3's canonical labels must trace back to.

# BODY
<!-- STUB: real funnel-assemble + Router + Section-Analyzer prompt body drops in here (Phase 7). -->

```stub-emit
{
  "_tally.json": {
    "funnels": [
      {
        "funnel_id": "stub-brand-a__f1",
        "brand_slug": "stub-brand-a",
        "transformation": "get organized fast",
        "angle": "beat the overwhelm",
        "awareness_basis": "problem-aware",
        "claims": [ { "text": "clears your desk in a week", "type": "direct" } ]
      },
      {
        "funnel_id": "stub-brand-b__f1",
        "brand_slug": "stub-brand-b",
        "transformation": "finally feel in control",
        "angle": "stop the chaos",
        "awareness_basis": "solution-aware",
        "claims": [ { "text": "control your whole day", "type": "enlarged" } ]
      }
    ]
  },
  "ad-volume-aggregate.json": {
    "rows": [
      { "transformation": "get organized fast", "angle": "beat the overwhelm", "funnel_count": 1, "ad_count": 12, "max_ad_longevity_days": 90 },
      { "transformation": "finally feel in control", "angle": "stop the chaos", "funnel_count": 1, "ad_count": 7, "max_ad_longevity_days": 45 }
    ]
  }
}
```
