# Aggregator Brief — Faith Market · Market Profile

**One job:** roll up the per-competitor records into one market profile. You do NOT
analyze new competitors and you do NOT score — you assemble.

## Inputs

- All competitor records in `runs/eink-tablets/markets/faith/brands/` (14 records).
- `runs/eink-tablets/markets/faith/competitive-set.md` (the roster).
- Context: our product is a $900 foldable, programmable e-ink tablet. Market =
  faith / devotional people × a focused, present devotional life.

## Procedure

1. **Read all 14 records.**

2. **Cluster competitors into market cells** = niche × transformation. Different
   transformations = different cells (e.g. Bible access / study depth / prayer-calm /
   physical journaling / premium Bible-as-object / faith hardware / general focus
   tablet). A competitor sits in one primary cell.

3. **Per cell, aggregate** — frequency counts for: claims (base + enhanced),
   mechanisms / UMs, angles, features, targeted sub-niches. Plus: price band,
   sophistication stage, who runs paid acquisition.
   **Saturation is counted WITHIN a cell only** — never pool a claim across cells;
   that overstates saturation (the prior eink run's "eye comfort 12/13" was fake —
   it spanned ~6 markets).

4. **Cross-cell synthesis:**
   - The differentiation whitespace — what transformation / lane is unclaimed.
   - The price-band reality — every cell's price band laid against our $900 target;
     name the ceilings and what (if anything) gives $900 air.
   - The proven-spend picture — where money demonstrably flows, with figures.
   - The Problem-UM vs problem-mechanism read — is the phone-distraction causal
     story a *unique* Problem UM, or a shared causal story already claimed by
     competitors? (If shared, the differentiation is a Product UM, not a Problem UM.)

5. **Light trend research** — WebSearch for digital-faith / faith-tech growth and
   "why now" signals (faith-app funding trajectory, faith-tech adoption, etc.).

6. **Assemble the Gate 1 evidence dossier** — organize the evidence under the four
   Gate 1 variables so this market can later be scored comparatively against other
   markets. **Do NOT score or weight. Assemble evidence only.**
   - **Desire to Solve** — proven spend, core-driver proximity, severity, frequency.
   - **D2C Feasibility** — believability (can a $900 e-ink device credibly deliver
     "a focused, present devotional life"?), economics (price-band fit vs $900).
   - **Market Sophistication** — claim / enhanced-claim counts, competitor
     sophistication, revenue, distribution, UM availability.
   - **Market Growth** — trend velocity, why-now, adjacent signals.

## Output

Write `runs/eink-tablets/markets/faith/faith-market-profile.md`:

```
# Faith Market — Market Profile

## Market cells
<table: cell | competitors | transformation | niche>

## Per-cell aggregation
<for each cell: claim/mechanism/angle/feature/sub-niche frequency tables;
 price band; sophistication stage; paid-acquisition presence>

## Cross-cell synthesis
- Differentiation whitespace: <...>
- Price-band reality vs $900: <...>
- Proven-spend picture: <...>
- Problem-UM vs problem-mechanism: <...>

## Why-now / trend signals
<...>

## Gate 1 evidence dossier  (evidence only — not scored)
- Desire to Solve: <...>
- D2C Feasibility: <...>
- Market Sophistication: <...>
- Market Growth: <...>

## Notes / gaps
<...>
```

Dense and factual. Cite which record each figure comes from.
