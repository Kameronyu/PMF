# Analyzer Framework — Per-Competitor Record (shared spine)

The reusable spine for analyzer agents scanning a competitor in any market. Each
market provides a thin per-market wrapper (market context + strata + must-includes)
that points here for the framework, procedure, and schema. **Do NOT duplicate this
file per market — fixes update here and propagate to every market scan.**

---

## FRAMEWORK — classify every piece of copy into exactly ONE layer

Forcing copy into the wrong layer is the #1 error from prior runs. Definitions
plus worked examples:

- **Transformation** — the outcome the product is marketed to produce ("X happens
  to the buyer's life"). An outcome — never a spec, never an emotion.
- **Niche** — the identity / community targeted, independent of the transformation.
  Broad or narrow. Read from copy + imagery; verbatim evidence required.
- **Targeted sub-niche** — the specific PMBD cluster the brand's marketing aims at,
  readable from hooks, imagery, segmented creative. Supply-side; record it.
- **Buyer** — who actually purchases the product. Often = user, but NOT for
  parent-buyer / gift / institutional markets. Record primary buyer + evidence.
- **Mechanism** — *why / how* the product achieves the result. That is all it is.
  NOT the outcome, NOT a spec attribute, NOT the emotion.
- **Problem-mechanism** — the causal story for *why the problem exists*. Can be
  shared across competitors. Record it separately. **A problem-mechanism repeated
  across most competitors in the same market is a SHARED CAUSAL STORY, not a
  Problem UM.** Mark UM as "none" unless the positioning is genuinely unique.
- **UM (Unique Mechanism)** — a mechanism positioned as *unique* differentiation.
  Problem-UM (unique cause) / Product-UM (unique solution) / Feature-UM (upgrade
  within a recognized category). Most competitors have NONE — "none" is the
  honest answer. Do not invent one.
- **Feature** — a spec / attribute. A feature is NEVER a transformation and NEVER
  a claim.
- **Claim** — the verbal outcome-promise. Base claim = the core "what it does"
  stripped of qualifiers. Enhanced claim = base + qualifier (speed / condition /
  mechanism / comparative).
- **Angle** — the emotion invoked to drive purchase. Maps to a driver (status /
  survival / reproduction / belonging) + pole (pain / desire).

Worked layer-classification examples (carry these in mind):

- "Paper-like feel" → a Product-UM that went universal and decayed into a
  saturated minimalism **angle**. NOT a transformation.
- "AI note-taking / capture-to-output" → a **Feature-UM (mechanism)**.
- "Thinnest 4.5mm / faster refresh / genuine leather / E Ink Carta panel" →
  **features.** NOT claims.
- "Your phone pulls you out of prayer" / "Your iPad has distracting apps" /
  "Your group chat is blowing up during class" → **problem-mechanism (causal
  story)**. NOT a Problem-UM unless uniquely positioned in this market.
- "Heirloom-quality, hand-bound" → a **trust / quality feature**, drives a
  status / belonging angle.

---

## PROCEDURE

Adapt by stratum:

1. **Primary pages.**
   - Physical product → WebFetch site + product/pricing pages.
   - App → WebFetch site + App Store / Play Store listing (description, pricing
     tiers, rating count).
   - Tablet / device → WebFetch product + pricing pages.
   - Software → WebFetch site + pricing page.
   Extract: product(s) + models + **prices** (and model: one-time / subscription /
   freemium), transformation(s), niche + targeted sub-niche signals (with verbatim
   evidence), buyer signals (who actually purchases — copy, imagery, ad targeting),
   claims (verbatim, base/enhanced + qualifier), features (verbatim, separate from
   claims), mechanism + problem-mechanism + UM (sub-type or "none"), value models,
   trust signals + extraordinary identifier, awareness level targeted.

2. **Meta Ad Library — REQUIRED, do not skip.** Even for free apps or non-DR
   brands, run the check. Absence of ads is data. Run:
   `node /home/kyu3/PMF/runs/eink-tablets/scripts/adlib-one.js <slug> "<query>"`
   then Read `runs/eink-tablets/adlibrary/<slug>.txt`.

   **Page-ID sanity check (required).** Before counting ads, verify the resolved
   advertiser is actually the target brand. The script can resolve the wrong
   advertiser when names collide (in the Faith run: Kindle Scribe resolved to
   "Doc genie - Kindle Scribe Cloud Storage" on first try; Boox resolved to a
   reseller). If the advertiser doesn't match, re-run ONCE with a tighter query
   (`"<brand> e-ink"`, `"<brand> tablet"`, the exact advertiser name from the
   brand's own site, etc.). Cap at 2 runs. If still wrong, note "ad library page
   unresolved" — do NOT count noise.

   Extract: running Meta ads (yes / no / page-unresolved), approx genuine active
   ad count, formats, sample hooks, angles (driver+pole), claims used in ads,
   awareness targeting. Ads may frame a different transformation / niche than
   the site — note divergence.

3. **Reviews / social proof.** WebSearch for review or rating volume, rough
   sentiment, brand loyalty, hidden use cases, notable likes/dislikes, press,
   celebrity endorsement.

4. **Revenue / scale estimate** — every figure gets a confidence tag + basis:
   - **Reported** — public revenue / valuation / units / installs / funding raise.
   - **Proxy** — physical: `units ≈ review_count × 30`, `revenue ≈ units × price`.
     App: rating count / public install bands × price or known ARPU. Output a
     RANGE, label "proxy / low confidence," show the numbers used.
   - **Sanity band** — headcount / Crunchbase funding as cross-check.
   - Nothing usable → "unknown." Never invent a bare number.

5. **Write the record** to `<output_dir>/brands/<slug>.md` using the schema below.
   N/A is valid for any field — do not force-fit. Distinguish verbatim quotes
   from your own interpretation.

---

## OUTPUT SCHEMA — write exactly this structure

```
# <Competitor> — <Market Name> Per-Competitor Record

- analyzed_at: <date>
- competitor: <name>
- stratum: <market-specific value>
- official_url(s): <urls>
- sources_used: <list>

## Product
<product name(s), models, format, price points + pricing model>

## Transformation(s)
- dominant frame: <the ONE transformation it leads with — "X happens to the buyer">
- secondary: <other transformations claimed, or N/A>
- evidence: <verbatim hero copy the dominant frame is read from>

## Niche
- niche: <identity group targeted | "general / not specified" if no evidence>
- targeted sub-niche: <PMBD cluster the marketing aims at, or N/A>
- evidence: <verbatim copy / imagery description>

## Buyer
- primary buyer: <self / parent / school / gift-giver / mixed — who actually pays>
- purchase context: <gift / back-to-school / class requirement / self-buy / impulse / etc>
- where bought: <DTC / Amazon / app store / retail / school program / etc>
- evidence: <verbatim copy or imagery that supports the buyer call>

## Claims  (outcome-promises only)
| claim (verbatim) | base / enhanced | qualifier type |
- count: <N base, M enhanced>

## Features  (specs / attributes — NOT claims)
- <verbatim feature list>

## Mechanism / UM
- mechanism(s) — how/why it works: <...>
- problem-mechanism (causal story, may be shared): <... or N/A>
- UM: <Problem | Product | Feature | none> — <the UM text, only if uniquely positioned>

## Marketing framing
- angles: <angle text | driver | pole>  (from site + ads)
- awareness level(s) targeted: <...>
- hooks (from ads): <...>

## Offers / value models
- pricing / bundle / discount / guarantee / subscription: <...>

## Trust signals
- <list>
- extraordinary identifier: <yes + what | no>

## Sophistication
- market sophistication stage this competitor plays at: <1-5 + why>
- revenue/scale_est: <value or range | confidence | basis>
- social_proof_volume: <review / rating / follower counts>
- distribution_channels: <where sold>

## Meta Ad Library
- page-ID resolution: <verified match | re-run tightened query | unresolved>
- on Meta: <yes | no | page-unresolved>
- active ad count (genuine, approx): <...>
- ad formats / sample hooks / angles / claims: <...>
- artifact: adlibrary/<slug>.txt  (or N/A)

## Reviews / VOC quick-read
- review/rating volume + rough sentiment: <...>
- brand loyalty signal: <...>
- hidden use cases / notable likes & dislikes: <...>

## Notes / gaps
<anything ambiguous, missing, or worth flagging>
```

Keep it dense and factual. No marketing fluff in your own writing.
