# Re-run brief — Arduview market-selection gate (fresh session)

Paste this into a fresh session (or `@`-reference it). It re-runs the market-selection gate against
the Arduview data — this time properly DR-grounded and with the corpus actually read.

## Why we're re-running

The first run (`market-selection.md`, executor `ac45de593dcd40346`) executed the entire gate with
**zero DR grounding** — SKILL.md falsely claimed its DR files were "auto-injected"; no such
mechanism existed, so the agent never read them. It also **never read the corpus dumps** (only ran
`ls corpus/`), so the `[INFERENCE]` mechanisms-in-play clusters weren't sourced to the data they
cite. Both are now fixed: the DR files are bundled and the skill mandates reading them; this brief
mandates reading the corpus.

## Run it in the MAIN thread (not a subagent)

Settings hooks don't fire inside subagents and the skill is loaded by `Read`/@-ref, so do the
analysis in the main session. If you must use a subagent, the brief below still works because every
load step is an explicit `Read` — but main thread is simpler.

## Load order

1. **Invoke `/market-selection`** (or `Read .claude/skills/market-selection/SKILL.md`). Follow its
   inlined four-gate procedure exactly — do NOT re-derive gate logic.
2. **Read the DR bundle (now mandatory, per the skill's `read_first`):**
   `.claude/skills/market-selection/_dr-context.generated.md` — all five DR files in one Read
   (consumer-psychology, differentiator-framework, brand-building, product-research, ecommerce).
   If missing/stale: `node tools/hooks/inject-market-selection-dr.js`, then Read it.
3. **Read** `definitions.md` (locked vocab) and `runs/arduview/pre-research-plan.md` (bet brief + the
   4 operator overrides, read as prose). (The mechanisms-in-play stopgap is RETIRED — see below.)

## The data you're analyzing — PATH MISMATCH (load-bearing)

The four data sets live at **repo root**, NOT under `runs/arduview/`:
- `space-map.json` — cell aggregates + per-brand fields (the spine; 6 `combos[]` cells)
- `brands.json` — per-brand facts (revenue, price_points, crowdfunding, bet_type)
- `ads/<brand>.json` — per-ad longevity (only: anbernic, divoom, flipper-zero, nothing-phone)
- `corpus/<brand>/dump.json` — per-brand creative dumps (provenance only; NOT needed for this re-run)

**Mechanisms-in-play is now a first-class field in `space-map.json` (BREAK 5 resolved).** Read the
top-level `mechanisms_in_play[]` (space-wide) and each `combos[].mechanisms_in_play[]` (cell-scoped,
`{canonical, brand_count, ownability, brands[]}`) directly — `ownability:"shared"` (3+) = taken,
`"unique"` (≤2) = ownable. **You do NOT need to read the corpus dumps** — the prior run's gap
(skipping them) is moot now that the aggregate is persisted and grounded. Seed/dead exclusion
(`comparable_bet_seed`: arduboy, flipper-zero, nothing-phone, skeleton-key; dead: meowbit, miyoo)
was already applied upstream when the field was built. The gate reads only `space-map.json`,
`brands.json`, `ads/<brand>.json`, and `pre-research-plan.md`.

## Locked run facts the output must reflect (do not paper over)

- `revenue_est.value_usd_monthly` = **null** for all 20 brands → state no revenue floor applied
  (the DR ecommerce $/mo floor is MISCALIBRATED for hardware — do NOT apply it).
- `demand_trend.shape` = **unknown** for all 20 → every cell stamped **durability UNKNOWN**;
  surface "fix the Trends fetch (Phase 1)" as the #1 blocker.
- `anti_fluke.qualifying_creatives` = **0** in all 6 cells (read it, don't recount).
- **SOFT-GATE MODE** (D-08): Gate-1 kills → flags + ranking penalties; carry all 6 cells through.
- **All 4 operator overrides SET** (one-comparable → dry-test-only; community-heat deferred;
  durability-load-bearing; demand-type read off community heat/willingness-to-pay for identity cells).
- `mechanisms_in_play[]` is now PRESENT in `space-map.json` (top-level + per-combo, BREAK 5 resolved)
  → read it as observed data. Do NOT derive, do NOT fence `[INFERENCE]`, do NOT read corpus dumps.

## Output

Write `runs/arduview/market-selection.md`: one record per cell (all 6 combos), then the ranked
PROVISIONAL survivor table. Stop at ranked survivors — no bet pick (that's the operator's D1 call).
Run the SKILL.md SELF-AUDIT before writing.

## After it's done

Compare the new verdicts/ranking against the prior `market-selection.md` and call out where the
DR-grounded + corpus-read pass actually moved (especially the mechanisms-in-play clusters and the
ranking). That delta is the point of the re-run.
