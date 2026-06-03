# Birdseye Synthesizer Brief — Cross-Brand Saturation Map

You read every brand corpus from
`runs/eink-tablets/marketing-corpus/<brand>/` and produce a deeper
cross-brand transformation × niche × claim map than the existing
flat-map.

**Read every brand's `landing-pages.md`, `meta-ads.md`,
`funnel-mechanics.md`, `partnerships.md`. Don't skip any.**

## Hard rules (vocabulary discipline)

Read `runs/eink-tablets/scripts/analyzer-framework.md` and
`definitions.md` first. Then enforce:

- **Transformation** = the life-outcome the brand markets the device to
  produce. Read literally from claims. Don't bucket.
- **Niche** = the buyer (identity / community / role). Distinct from
  transformation.
- **Claim** = verbatim outcome-promise. Base + enhanced.
- **Feature** = spec / attribute. NEVER a transformation. Note-taking,
  AI, camera, color, foldable, paper-feel = features, not transformations.
- **Angle** = emotion invoked (driver + pole).
- **Mechanism** = how/why the product achieves the result.

If you can't quote verbatim evidence for a layer-classification, do not
make the classification. Mark as "unclear / no evidence."

## What to produce

Output: `runs/eink-tablets/marketing-corpus/birdseye-map.md`. Structure:

```
# E-Ink Marketing Birdseye Map — Cross-Brand Saturation

## Scope
[what's covered, source corpora, date pulled]

## Per-brand transformation matrix
Every brand × every transformation it runs (not just the primary one).
Verbatim hooks per transformation per brand.
Surface hidden transformations the brand's homepage doesn't lead with
but the ads or sub-LPs do reveal.

| Brand | Transformation | Niche targeted | Verbatim hook | Source artifact (LP/ad-library_id) | # ads | # LPs |
| ... |

## Per-transformation saturation
For each transformation that appears:
- Total brands running it
- Total active ads across all brands
- Total LPs across all brands
- Longest-running claim text in that transformation
- Newest entrant
- Niches each brand targets within the transformation
- Verbatim claim text variants across brands

## Per-claim saturation
The same claim text appearing across multiple brands = saturated.
Group verbatim claims that mean the same thing (e.g., "less distraction"
across brands).
Identify which claims are unique to one brand (defensible) vs shared
(table-stakes).

## Hidden positioning callouts
"Brand X is running [transformation] via [LP/ad] but their homepage
doesn't lead with it." This is the part the surface scan missed.

## Negative space
What is no brand saying? Which transformation × niche cells have ZERO
ads / ZERO LPs across the entire dataset?

## Sources
List every corpus file read.
```

## Saturation rules

- Saturation counts WITHIN a transformation × niche cell only. Don't
  pool across cells.
- A single claim repeated across 5 brands in the same cell = saturated
  for that cell.
- A claim used by 1 brand in 1 cell while another brand uses it in a
  different cell = not the same claim for saturation purposes.

## Distinguishing synthesis from quotation

Quoted material in single quotes or block quotes with source. Your
own words in normal text. If you write a claim count, source it with
specific library_ids or LP URLs in a footnote or inline cite.

## Return a SHORT summary (<400 words)
- File path written
- Total brands × transformations matrix size
- Top 3 most saturated cells (transformation × niche)
- Top 3 hidden-positioning callouts (brand running something its
  homepage doesn't show)
- Top 3 unowned cells (negative space)
- Any vocabulary-discipline issues you couldn't resolve in the data
