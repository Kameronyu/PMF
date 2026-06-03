# Market Playbook Brief — Per-Market Sales-Message Synthesizer

ONE MARKET. ONE AGENT. ONE OUTPUT PLAYBOOK.

You synthesize the per-brand granular files for ONE market into an
adaptable winning-sales-messages playbook that drops into Kam's deposit
funnel as proven copy + structural patterns.

The four markets and their brand sets:

| Market | Slug | Brands |
|---|---|---|
| M1 — Paper-replacement | `M1-paper-replacement` | supernote, kindle-scribe, remarkable |
| M2 — Calm / digital boundary | `M2-calm` | daylight-dc1, light-phone, mudita-kompakt |
| M3 — Student note-taking | `M3-student-notetaking` | remarkable, boox, supernote, ipad, notability-goodnotes |
| M4 — General-purpose tablet (knowledge worker + e-reader) | `M4-general-purpose-tablet` | ALL 10 brands (highest priority — Kam's actual funnel) |

You will be told which market via the kickoff prompt.

## Inputs (read ALL of these)

- The granular-analysis files for your market's brands:
  `runs/eink-tablets/marketing-corpus/<brand>/granular-analysis.md`
- The cross-brand birdseye saturation map:
  `runs/eink-tablets/marketing-corpus/birdseye-map.md` (you can read this
  now — Pass 1 was forbidden from)
- The vocabulary spine:
  `runs/eink-tablets/scripts/analyzer-framework.md`
- The locked vocabulary:
  `/home/kyu3/PMF/definitions.md`
- The prior cross-brand transformation flat-map:
  `runs/eink-tablets/eink-category-evolution/transformations-flat-map.md`

## Hard rules

1. **Verbatim for proven copy.** Sections 4 (hooks), 5 (headlines), 6
   (claim saturation), 7 (angles), 8 (objections), 9 (trust signals), 10
   (funnel patterns) MUST be verbatim from the granular files. If you
   cannot cite the verbatim text + brand + source artifact, omit it.

2. **Synthesis clearly flagged.** Section 12 (recommended messages for
   Kam's funnel) is the ONLY place you may produce derivative copy. It
   MUST be flagged with a `> SYNTHESIS — derived from sources cited inline`
   block. Every derivative message must trace each component back to a
   verbatim source.

3. **Ranking by spend signal.** Hooks rank by `days_running` descending.
   Where multiple brands run the same message-meaning, group them and
   show the longest-running version as the lead.

4. **5+ saturation rule.** A base claim appearing in 5+ brand cells in
   this market = saturated → call it out as "discounted in market
   sophistication." 1-2 brand cells = defensible.

5. **No fabricated metrics.** If you don't have a count, write "not
   captured" — don't estimate.

6. **For M4 specifically.** Call out which brands successfully merge
   e-reader + knowledge-worker messaging (Kindle Scribe, reMarkable Paper
   Pro, Boox have both; iPad spans both) vs brands that pitch only one.
   This split matters for Kam's funnel.

## Output

Write `runs/eink-tablets/marketing-corpus/markets/<slug>/playbook.md`
with these 13 sections:

### 1. Market definition
- Niche × transformation in the incumbents' verbatim language
- Buyer identity (primary, secondary)
- Source brands

### 2. Sophistication call
- Stage 1-5 + why (Kennedy / Schwartz framework)
- Base claims that are now table-stakes (apply 5+ rule)
- Levers that are still differentiating
- Inflection point in the market timeline if visible

### 3. Awareness map
- For each Schwartz awareness level (unaware / problem-aware / solution-aware
  / product-aware / most-aware): what % of brand creative in this market
  targets it (approximate, with evidence)
- Which level has the thinnest competition (= opportunity for Kam's funnel)

### 4. Proven hooks shortlist (top 15)
**Load-bearing section.** Top 15 hooks across all market brands, ranked
by `days_running` descending. Dedupe by meaning (group hooks that say
the same thing — show longest-running version as canonical, list the
others as variants).

| Rank | Hook (verbatim) | Brand | Start date | Days running | Angle | Claim carried | Library ID | Variants from other brands (if any) |
|---|---|---|---|---|---|---|---|---|

### 5. Proven headlines shortlist (top 20)
Top 20 LP headlines (hero + section headers) verbatim. Prefer headlines
on highest-traffic / longest-lived pages (campaign LPs running for years,
homepage variants, dedicated `/clp/` style landing pages).

| Rank | Headline (verbatim) | Brand | LP URL | Section position | Companion CTA |
|---|---|---|---|---|---|

### 6. Claim saturation table
Every base claim in the market × which brands run it × enhanced variants:

| Base claim | Brands using it | Enhanced variants verbatim | Saturated (5+)? |
|---|---|---|---|

Split into two sub-sections:
- **Saturated → discounted** (5+ brands)
- **Defensible → still owns differentiation** (1-2 brands)

### 7. Angle inventory
Every verbatim angle grouped by driver+pole. Table:

| Angle verbatim | Driver | Pole | Brand sources | # times appearing | Notes |
|---|---|---|---|---|---|

Flag explicitly:
- **Over-fished**: drivers with too many brand entries
- **Wide open**: driver+pole combos with zero or one brand

### 8. Objection handle library
Every verbatim objection handle + the objection + how many brands address
it:

| Objection | Universal? (# brands) | Handles verbatim | Brand sources | Funnel location |
|---|---|---|---|---|

### 9. Trust signal benchmarks
Market floor (what most brands have) + extraordinary identifiers (what
only one brand has):

| Signal type | Market floor | Brand extraordinary identifiers |
|---|---|---|

### 10. Funnel structure patterns
- Most common LP section sequence in this market (from §11 of each
  granular file)
- Variations and what they signal
- **Deposit funnel section** — which brand(s) in this market have the
  tightest deposit funnel. Verbatim copy of the deposit/pre-order page +
  refund terms + urgency mechanic. If no brand in this market runs a
  deposit funnel: state explicitly.

### 11. Visual / aesthetic conventions
- Palette range across brands (from §3 of each granular)
- Typography conventions
- Imagery archetypes that dominate
- Where a fresh visual would break attention (negative space)

### 12. Negative space + recommended messages for Kam's funnel

`> SYNTHESIS — derived from sources cited inline`

Two parts:
- **Unowned cells**: transformation × niche × angle × awareness combos
  that NO brand in this market is currently running
- **5-10 ready-to-test message candidates** — each remixes a proven hook
  structure (cite source verbatim) + an unowned angle. Format per
  candidate:

```
**Candidate N: <one-line summary>**
- Proven hook structure source (verbatim): "<verbatim>" — Brand, library_id
- Unowned angle being added: <angle text + driver+pole + why unowned>
- Synthesized message text: "<recommended copy for Kam's funnel>"
- Risk: <what could fail about this>
- Test priority: high / medium / low + why
```

### 13. Sources
Every file read this synthesis. Bullet list with paths.

## Return a SHORT summary (<400 words)

- Market + slug
- Section counts (e.g., "top 15 hooks confirmed, top 20 headlines confirmed,
  N claims cataloged with M saturated")
- Top 3 hooks by days_running (verbatim + brand)
- Top 3 unowned cells worth testing
- Most universal objection handle in the market
- For M4: which brands merge e-reader + knowledge-worker vs which split,
  one line each
- Any vocabulary-discipline issues you couldn't resolve from the granular
  files
- File path written
