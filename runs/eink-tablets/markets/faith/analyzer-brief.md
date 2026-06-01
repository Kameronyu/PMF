# Analyzer Brief — Faith Market · Per-Competitor Record

You analyze ONE competitor in the faith / devotional market and write a structured
record. **One job: one competitor → one record.** This is a DR-marketing competitive
scan to grade the market and find the differentiation lane.

- **Our product (fixed):** foldable, programmable e-ink tablet, $900 target retail.
- **Market:** faith / devotional people × a focused, present devotional life.
- The competitor may be a physical product, an app, a tablet/software ecosystem, or
  an e-ink device. Its **stratum** is given to you.
- **Niche is an OUTPUT** you determine from the competitor's own copy — never assumed.

---

## FRAMEWORK — classify every piece of copy into exactly ONE layer

Forcing copy into the wrong layer is the #1 error from the prior run. Definitions
plus worked examples:

- **Transformation** — the outcome the product is marketed to produce ("X happens to
  the buyer's life"). Faith examples: be present in Scripture, a deeper prayer life,
  hear God without distraction. An outcome — never a spec, never an emotion.
- **Niche** — the identity / community targeted, independent of the transformation
  (e.g. women's quiet-time journaling, pastors / sermon prep, men's discipleship,
  Catholic prayer, evangelical Bible study, new believers). Read from copy + imagery.
- **Targeted sub-niche** — the specific PMBD cluster the brand's marketing aims at,
  readable from hooks, imagery, segmented creative. Supply-side; record it.
- **Mechanism** — *why / how* the product achieves the result. That is all it is.
  E.g. "reflective e-ink display — reflects ambient light instead of emitting it,"
  "wide margins give room to write," "no app store / no browser." NOT the outcome,
  NOT a spec attribute, NOT the emotion.
- **Problem-mechanism** — the causal story for *why the problem exists* ("your phone
  pulls you out of prayer with notifications"). Can be shared across competitors.
  Record it separately. It is NOT a Problem-UM unless it is *uniquely positioned* —
  an obvious cause everyone names never rises to a UM.
- **UM (Unique Mechanism)** — a mechanism positioned as *unique* differentiation.
  Problem-UM (unique cause) / Product-UM (unique solution) / Feature-UM (upgrade
  within a recognized category). Most competitors have NONE — "none" is the honest
  answer. Do not invent one.
- **Feature** — a spec / attribute. "4.5mm thin," "Carta 1300 panel," "leather
  cover," "highlighter tool." A feature is NEVER a transformation and NEVER a claim.
- **Claim** — the verbal outcome-promise. **Base claim** = the core "what it does"
  stripped of qualifiers. **Enhanced claim** = base + qualifier (speed / condition /
  mechanism / comparative).
- **Angle** — the emotion invoked to drive purchase. Maps to a driver (status /
  survival / reproduction / belonging) + pole (pain / desire).

Worked layer-classification examples (carry these in mind):
- "Paper-like feel" → a Product-UM that went universal and decayed into a saturated
  minimalism **angle**. NOT a transformation.
- "AI note-taking / capture-to-output" → a **Feature-UM (mechanism)**. NOT a
  transformation, NOT an angle.
- "Thinnest 4.5mm / faster refresh / genuine leather" → **features.** NOT claims.
- "Be present with Scripture, not your notifications" → a **claim** built on a
  problem-mechanism (the phone-distraction causal story).
- "Heirloom-quality, hand-bound" → a **trust / quality feature**, drives a
  status / belonging angle. NOT a transformation.

---

## PROCEDURE

Adapt by stratum.

1. **Primary pages.**
   - Physical product / brand → WebFetch the official site + product/pricing pages.
   - App → WebFetch the website + App Store / Play Store listing (description,
     pricing tiers, rating count).
   - Tablet / software ecosystem → WebFetch the product + pricing pages.
   Extract: product(s) + models + **prices** (and model: one-time / subscription /
   freemium), transformation(s), niche + targeted sub-niche signals (who copy and
   imagery target — quote the evidence), claims (verbatim, base/enhanced + qualifier
   type), features (verbatim, separate from claims), mechanism + problem-mechanism +
   UM (sub-type, or "none"), value models, trust signals + any extraordinary
   identifier, the awareness level the page targets.

2. **Meta Ad Library** (for brands that may run Meta ads — skip for free apps with
   no DR motion). Run:
   `node /home/kyu3/PMF/runs/eink-tablets/scripts/adlib-one.js <slug> "<query>"`
   then Read `runs/eink-tablets/adlibrary/<slug>.txt`. Keyword search is NOISY —
   count only ads genuinely from THIS brand. Cap at 2 runs. Extract: running Meta
   ads (yes/no), approx genuine active ad count, formats, sample hooks, angles
   (driver+pole), claims used in ads, awareness targeting. Ads may frame a different
   transformation / niche than the site — note divergence.

3. **Reviews / social proof.** WebSearch for review or rating volume, rough
   sentiment, brand loyalty, hidden use cases, notable likes/dislikes, press,
   celebrity / ministry endorsement.

4. **Revenue / scale estimate** — every figure gets a confidence tag + basis:
   - **Reported** — public revenue / valuation / units / installs / funding raise.
   - **Proxy** — physical: `units ≈ review_count × 30`, `revenue ≈ units × price`.
     App: rating count / public install bands × price or known ARPU. Output a RANGE,
     label "proxy / low confidence," show the numbers used.
   - **Sanity band** — headcount / Crunchbase funding as cross-check.
   - Nothing usable → "unknown." Never invent a bare number.

5. **Write the record** to
   `runs/eink-tablets/markets/faith/brands/<slug>.md` using the schema below.
   N/A is valid for any field — do not force-fit. Distinguish verbatim quotes from
   your own interpretation.

---

## OUTPUT SCHEMA — write exactly this structure

```
# <Competitor> — Faith Market Per-Competitor Record

- analyzed_at: <date>
- competitor: <name>
- stratum: <physical | app | general-tablet | e-ink>
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

## Claims  (outcome-promises only)
| claim (verbatim) | base / enhanced | qualifier type |
|---|---|---|
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
- on Meta: <yes | no | n/a>
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
