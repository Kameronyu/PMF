# Analyzer Brief — Phase 0 Per-Brand Competitor Record

You analyze ONE e-ink (or paper-feel) tablet brand and write a structured record.
This is Phase 0 of a DR-marketing market map: collect per-brand competitive data.
Space sketched: transformation category = optimization, product category = tech,
product = e-ink / paper-feel tablet. Niche is an OUTPUT you determine per brand.

---

## FRAMEWORK — classify using these definitions exactly

- **Transformation** — the outcome the product is marketed to produce ("X happens
  to the buyer"). E-ink examples: distraction-free focus, paperless note-taking,
  reduced eye strain / screen fatigue, digital minimalism, better reading.
- **Niche** — who they sell to as an identity/community, independent of the
  transformation (students, writers, knowledge workers, digital minimalists,
  ADHD/focus-seekers, biohackers, executives, readers, artists). Broad or narrow.
- **Market** — niche × transformation.
- **Claim** — the verbal promise of what the product does. **Base claim** = the
  core "what it does" statement stripped of qualifiers.
- **Enhanced claim** — base claim + a qualifier (speed / condition / mechanism /
  comparative). "Write like paper" = base. "Feels exactly like paper, zero lag" =
  enhanced (comparative + condition).
- **UM (Unique Mechanism)** — the unique way the product delivers the
  transformation. Three sub-types:
  - **Problem UM** — differentiates on the CAUSE of the problem ("backlit screens
    wreck your focus and sleep").
  - **Product UM** — differentiates on the SOLUTION / product positioned around a
    mechanism ("e-ink display = no blue light, no glare").
  - **Feature UM** — upgrades a recognized category via a specific feature ("our
    Carta 1300 panel refreshes 2× faster").
- **Market sophistication** — where this brand competes: Stage 1 (introduces a new
  transformation) / Stage 2 (claim + UM + angle + trust + value) / Stage 3 (a
  Product UM already exists; needs an alternative) / Stage 4 (feature-level
  competition) / Stage 5 (saturated; needs extraordinary trust).
- **Awareness level the funnel targets** — unaware / problem-aware /
  solution-aware / product-aware / most-aware.
- **Trust signals** — reviews, UGC volume, press logos, expert endorsement,
  badges, before/after, named credentials. **Extraordinary identifier** = a
  trust signal competitors can't copy with copy alone (named celebrity, major
  press, credentialed authority). Flag if present.
- **Value models** — bundle, pricing, discount, guarantee, subscription.
- **Angle** — the emotion invoked to drive purchase. Maps to a **driver**
  (status / survival / reproduction / belonging) + **pole** (pain / desire).
- **Hook** — the scroll-stopping opener of an ad.
- **Objection handle** — copy that neutralizes a known objection.

---

## PROCEDURE

1. **Product / brand pages.** WebFetch the official URL(s) given. Also fetch any
   distinct landing pages, advertorials, or quiz funnels you discover. Extract:
   product(s) + models + prices, transformation(s), niche signals (who the copy
   and imagery target), claims (verbatim, classified base/enhanced + qualifier
   type), UM/mechanism + UM sub-type, value models, trust signals + whether any
   is an extraordinary identifier, the awareness level the page targets.

2. **Meta Ad Library.** Run:
   `node /home/kyu3/PMF/runs/eink-tablets/scripts/adlib-one.js <slug> "<query>"`
   Use the suggested query first. Then Read `adlibrary/<slug>.txt`. Keyword search
   is NOISY — only count ads whose advertiser/page name and content genuinely
   match THIS brand and its e-ink product. Ignore unrelated ads that merely
   contain the keyword. If the dump is junk-dominated, re-run ONCE with a tighter
   query (e.g. `"<brand> e-ink"`, `"<brand> tablet"`, or the exact advertiser
   name from the brand's own site). Cap at 2 runs. Extract: is the brand running
   Meta ads (yes/no), approx active ad count (genuine only), ad formats, sample
   hooks, angles (driver+pole), claims used in ads, awareness targeting.

3. **Reviews / social proof.** WebSearch for review volume (Amazon, Trustpilot,
   own-site, YouTube), rough sentiment, brand loyalty signals, hidden use cases,
   notable likes/dislikes, press coverage, celebrity endorsement.

4. **Revenue estimate** — tiered, every figure gets a confidence tag + basis:
   - **Reported** — public revenue / valuation / units-sold statements, or
     crowdfunding raise totals. Use directly.
   - **Proxy** — review volume → units → revenue band. Math:
     `units ≈ total_review_count × 30`, `revenue ≈ units × price`. Output a
     RANGE, label "proxy / low confidence", show the numbers used.
   - **Sanity band** — LinkedIn headcount / Crunchbase funding as a cross-check.
   - Nothing usable → "unknown". Never invent a bare number.

5. **Write the record** to `/home/kyu3/PMF/runs/eink-tablets/brands/<slug>.md`
   using the schema below exactly. N/A is a valid value for any field — do not
   force-fit. Distinguish verbatim quotes from your interpretation.

---

## OUTPUT SCHEMA — write exactly this structure

```
# <Brand> — Phase 0 Per-Brand Record

- analyzed_at: <date>
- brand: <name>
- official_url(s): <urls>
- panel_type: <true E Ink electrophoretic | paper-like LCD (NXTPAPER/RLCD)>
- sources_used: <list>

## Product
<product name(s), models, format, price points>

## Transformation(s)
<outcome(s) the product is marketed to produce — verbatim promise + your read>

## Niche
<who they target; evidence from copy/imagery; broad or narrow>

## Claims
| claim (verbatim) | base / enhanced | qualifier type |
|---|---|---|
...
- count: <N base, M enhanced>

## Mechanism / UM
- mechanism(s) referenced: <...>
- UM type played: <Problem | Product | Feature | none> — <the UM text>

## Marketing framing
- angles: <angle text | driver | pole> (from site + ads)
- awareness level(s) targeted: <...>
- hooks (from ads): <...>

## Offers / value models
- pricing / bundle / discount / guarantee / subscription: <...>

## Trust signals
- <list>
- extraordinary identifier: <yes + what | no>

## Sophistication
- market sophistication stage this brand plays at: <1-5 + why>
- revenue_est: <value or range | confidence | basis>
- social_proof_volume: <review counts, follower counts>
- distribution_channels: <where sold>

## Meta Ad Library
- on Meta: <yes | no>
- active ad count (genuine to brand, approx): <...>
- ad formats / sample hooks / angles / claims: <...>
- artifact: adlibrary/<slug>.txt

## Reviews / VOC quick-read
- review volume + rough sentiment: <...>
- brand loyalty signal: <...>
- hidden use cases / notable likes & dislikes: <...>

## Traffic (SimilarWeb)
PENDING — supplied separately by Kam.

## Notes / gaps
<anything ambiguous, missing, or worth flagging>
```

Keep it dense and factual. No marketing fluff in your own writing.
