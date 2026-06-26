# KB-INDEX — Marketing Skills Navigation

This KB holds 45 marketing skills covering the full e-commerce/D2C lifecycle: ads, funnels, landing pages, copy, offers, pricing, email, persuasion, research, and brand. An agent reads this file to route a JOB to the ONE right whole skill file, then loads it.

## How the WRITE / SCORE split works

Every topic splits into two job types, and they are run as separate passes:

- **WRITE** skills *generate* prose — hooks, headlines, guarantees, retention messages. They carry winning specimens, craft targets, and optional patterns. Load a write skill when the job is to produce or rewrite copy.
- **SCORE** skills *grade* an artifact against a fixed rubric — countable hard-gates, heuristic soft-caps, and felt pairwise-vs-specimen signals — and emit a band (e.g. SHIP / WARN / BLOCK). Load a score skill when the job is to validate, audit, rank, or decide.

Always run SCORE as a **separate pass** from WRITE. A skill never grades its own output; the scorer judges felt signals pairwise against a held specimen, never self-graded. Write first, then hand off to the sibling scorer.

## JOB → FILES routing table

Pick the row matching the concrete job. "Sibling to pair" is the natural second-pass skill (write↔score, or an adjacent scorer).

| Job | Skill(s) to load | Sibling to pair |
|---|---|---|
| Write a product-page / CRO headline or cart nudge | `kb-cro-write` | `kb-cro-score` |
| Validate a funnel's CVR/ATC stage or call an A/B test | `kb-cro-score` *(test-validity + stage diagnosis lives here, not in funnel-architecture)* | `kb-cro-write` |
| Score a generic conversion/business-change decision (margins, churn, "should I make this change") | `kb-conversion-optimization-score` *(unit-economics & change-hurdle gates, not page-copy)* | `kb-cro-score` |
| Write full landing-page copy (hero, offer section, listicle) | `kb-landing-pages-write` | `kb-landing-pages-score` |
| Audit landing-page structure (section count, review count, archetype) | `kb-landing-pages-score` | `kb-landing-pages-write` |
| Write a cold-traffic ad hook / UGC script | `kb-ad-creative-write` or `kb-ads-write` *(specimen-led)* | `kb-ad-creative-score` / `kb-ads-score` |
| Write many hook variations off ONE offer / name a promo / seasonal reframe | `kb-advertising-write` *(hook-multiplication & promo-naming, not single-ad craft)* | `kb-advertising-score` |
| Score a single creative / swipe / test plan against benchmarks | `kb-ad-creative-score` *(combo counts, scaling, congruency)* | `kb-ads-score` |
| Score ad performance numbers (hook rate, hold, CVR, CPM) / "kill this ad?" | `kb-ads-score` *(performance + config gates)* | `kb-ad-creative-score` |
| Score a whole campaign spend ladder / LTV:CAC / Rule-of-100 | `kb-advertising-score` *(account-level economics, not one creative)* | `kb-ads-score` |
| Write an advertorial / pre-sell page | `kb-advertorial-write` | `kb-advertorial-score` |
| Score an advertorial / pre-sell page | `kb-advertorial-score` | `kb-advertorial-write` |
| Write funnel page copy / make a page congruent with the winning ad | `kb-funnel-architecture-write` | `kb-funnel-architecture-score` |
| Diagnose which funnel LAYER is broken (CTR/ATC/ATP tree) | `kb-funnel-architecture-score` *(full-funnel node tree; use `kb-cro-score` for the 3-gate CVR check)* | `kb-funnel-architecture-write` |
| Write quiz-funnel copy (diagnosis slide, micro-commitment Qs, result page) | `kb-quiz-funnel-write` | `kb-quiz-funnel-score` |
| Score a quiz funnel (question roles, completion KPI, email-before-reveal) | `kb-quiz-funnel-score` | `kb-quiz-funnel-write` |
| Write direct-response copy / headline / CTA (general) | `kb-copywriting-write` | `kb-copywriting-score` |
| Score / rank copy, "will this pass Facebook", grade a headline | `kb-copywriting-score` | `kb-copywriting-write` |
| Write a VSL hook / lead / close / script | `kb-vssl-write` | `kb-vssl-score` |
| Score a VSL / sales-video script | `kb-vssl-score` | `kb-vssl-write` |
| Write a guarantee / scarcity / urgency line / answer an objection in copy | `kb-persuasion-write` | `kb-persuasion-score` |
| Score a persuasion stack / "is this scarcity believable" | `kb-persuasion-score` *(7-criteria stack, copy-side)* | `kb-persuasion-write` |
| Write a sales close / handle live pushback / discovery questions | `kb-persuasion-and-sales-write` *(call/close craft, not ad copy)* | `kb-persuasion-and-sales-score` |
| Score a guarantee 3-slot / anchor tiers / "did I qualify this prospect" | `kb-persuasion-and-sales-score` *(negotiation + qualification gates)* | `kb-persuasion-and-sales-write` |
| Classify awareness/sophistication/desire stage, check VOC/necessary-beliefs | `kb-consumer-psychology-score` *(market-psychology classification, score-only)* | `kb-persuasion-score` |
| Write the offer / guarantee wording / name bonuses / stack value | `kb-offer-construction-write` | `kb-offer-construction-score` |
| Score offer economics (compare-at ratio, margin, tiers, bonus stack) | `kb-offer-construction-score` | `kb-offer-construction-write` |
| Score pricing / "undercut or premium" / launch pricing | `kb-pricing-score` *(price-multiple & positioning, score-only)* | `kb-offer-construction-score` |
| Write upsell / OTO / downsell / thank-you nudge copy | `kb-upsells-write` | `kb-upsells-score` |
| Score an OTO stack / post-purchase sequence (gates) | `kb-upsells-score` *(OTO price/format gates)* | `kb-upsells-write` |
| Score monetization levers (prepay, surge, ROIC, 5X sizing) | `kb-upsells-and-monetization-score` *(lever economics, broader than OTO gates)* | `kb-upsells-score` |
| Score an AOV stack / order page / bump pricing | `kb-aov-optimization-score` *(order-page & bump attach-rate, score-only)* | `kb-upsells-score` |
| Write a price-increase / rebooking / renewal / retention message | `kb-email-and-retention-write` | `kb-email-and-retention-score` |
| Score email cadence / retention numbers / "ready to scale" | `kb-email-and-retention-score` *(retention KPIs + cadence)* | `kb-email-and-retention-write` |
| Audit Klaviyo flows / email setup (flow count, capture, broadcast cadence) | `kb-email-marketing-score` *(flow-architecture gates, score-only)* | `kb-email-and-retention-score` |
| Write a strategic reframe line for a founder / scarcity / pre-order copy | `kb-ecommerce-write` | `kb-ecommerce-score` |
| Score a product / unit economics / validate saturated product / page | `kb-ecommerce-score` | `kb-ecommerce-write` |
| Score a brand plan / "is this angle saturated" / ad-account tier | `kb-brand-building-score` *(brand/saturation gates, score-only)* | `kb-ecommerce-score` |
| Identify the differentiator / "Market or Angle?" axis | `kb-differentiator-score` *(axis enum, score-only)* | `kb-ecommerce-score` |
| Write customer-research / VOC / survey / interview questions | `kb-customer-data-write` | `kb-customer-data-score` |
| Score a research plan / VOC synthesis / cohort coverage | `kb-customer-data-score` | `kb-customer-data-write` |
| Score a product-research idea / MOQ commit / rank product ideas | `kb-product-research-score` *(capital + 7-signal viability, score-only)* | `kb-ecommerce-score` |
| Decide "on-site vs ad problem" / "raise spend?" / channel fit | `kb-case-studies-score` *(case-evidence diagnostic routing, score-only)* | `kb-conversion-optimization-score` |
| Vet / rank a testimonial or comment social proof | `kb-social-proof-score` *(testimonial-fit gates, score-only)* | `kb-customer-data-score` |

## Concept clusters

### CRO & on-page conversion

- `kb-cro-write` — write benefit-led headlines, cart nudges, dollar-savings lines, CTA microcopy.
- `kb-cro-score` — grade funnel-health gates (CVR/ATC/ATP), A/B-test callability, CRO-client readiness.
- `kb-conversion-optimization-score` — grade business-level change decisions: margins, churn, pricing, change-hurdle, customer lifetime.
- `kb-landing-pages-write` — write full LP copy: hero, offer section, listicle, long-form blueprints.
- `kb-landing-pages-score` — audit LP structure: section/review counts, discount band, archetype fit.

### Ads & creative

- `kb-ad-creative-write` — write self-qualifying openers, POV hooks, congruent LP headlines, UGC scripts.
- `kb-ad-creative-score` — score a creative/test plan: combo counts, scaling steps, ad-to-page congruency.
- `kb-ads-write` — write ad hooks from real winning specimens (PetLab, FOMO, pain-first cold).
- `kb-ads-score` — score ad performance numbers + campaign config (hook/hold rate, CVR, CPM, kill signals).
- `kb-advertising-write` — multiply hooks off ONE offer, name promos, seasonal reframes, testimonial hooks.
- `kb-advertising-score` — score campaign-level economics: Rule of 100, LTV:CAC, spend ladders, channel count.

### Funnel pages & flow

- `kb-funnel-architecture-write` — write congruent funnel pages and quiz hook questions, picking page FORM by awareness.
- `kb-funnel-architecture-score` — diagnose which funnel layer is broken via the CTR-ATC-purchase node tree.
- `kb-quiz-funnel-write` — write quiz screens: diagnosis, micro-commitment Qs, result page.
- `kb-quiz-funnel-score` — score quiz funnel: question roles, completion KPI, email-before-reveal.
- `kb-advertorial-write` — write advertorial/pre-sell pages: hooks, leads, listicle and comparison shapes.
- `kb-advertorial-score` — score advertorials: split ratios, reveal-holding, CTA stack, listicle counts.

### Copywriting & VSL

- `kb-copywriting-write` — write general DR copy: headlines, hooks, CTAs, named formulas.
- `kb-copywriting-score` — grade/rank copy: reading level, FB compliance, hook checklist, valence.
- `kb-vssl-write` — write VSL hooks, leads, closes, sequencing the 8-stage / 9-ingredient orders.
- `kb-vssl-score` — score VSL: product-mention position, readability, necessary beliefs, congruence.

### Persuasion & psychology

- `kb-persuasion-write` — write guarantees, scarcity/urgency, objection-answering copy.
- `kb-persuasion-score` — grade a persuasion stack against the 7 criteria.
- `kb-persuasion-and-sales-write` — write closes, objection handles, discovery questions for live selling.
- `kb-persuasion-and-sales-score` — score guarantees, anchor tiers, MESO, prospect qualification.
- `kb-consumer-psychology-score` — classify awareness/sophistication/desire, check VOC & necessary beliefs.

### Offer, pricing & monetization

- `kb-offer-construction-write` — write offers, guarantees, bonus stacks, mechanism naming.
- `kb-offer-construction-score` — score offer economics: compare-at ratio, margins, tiers, bonus sum.
- `kb-pricing-score` — score pricing: premium multiple, undercut-free gate, launch sequencing.
- `kb-upsells-write` — write OTO, downsell, thank-you-page upsell copy.
- `kb-upsells-score` — score OTO stacks: AOV ratio, OTO price cap, count, format match.
- `kb-upsells-and-monetization-score` — score monetization levers: prepay, surge, ROIC, 5X sizing.
- `kb-aov-optimization-score` — score AOV stacks: order-bump attach rate, order-page elements.

### Email & retention

- `kb-email-and-retention-write` — write rebooking, renewal, price-increase, membership-close messages.
- `kb-email-and-retention-score` — score retention KPIs, cadence, give:ask, scale-readiness.
- `kb-email-marketing-score` — audit flow architecture: flow count/length, capture placement, broadcast cadence.

### Ecommerce ops & brand

- `kb-ecommerce-write` — write founder-facing strategic reframes, scarcity/pre-order lines.
- `kb-ecommerce-score` — score product/unit-economics/page viability and saturated-product validation.
- `kb-brand-building-score` — score brand plans, angle saturation, avatar count, ad-account tier.
- `kb-differentiator-score` — classify the differentiator axis (Market/Mech/Angle/Offer/Dual/None).

### Research & evidence

- `kb-customer-data-write` — write VOC survey/interview questions, mine customer language.
- `kb-customer-data-score` — score research plans: cohort coverage, mining-first, quant convergence.
- `kb-product-research-score` — score product ideas: capital floor, 7-signal viability, MOQ.
- `kb-case-studies-score` — route diagnostics: on-site vs ad problem, raise-spend, channel fit.
- `kb-social-proof-score` — vet/rank testimonials: function-fit, target-named, customer-voice.

## Glossary

Shared terms (awareness stages, MER, NTPMA, value equation, AOV, LTV:CAC, etc.) live in `term_registry.json` and `definitions.md` at the project root. Consult those rather than redefining terms here.
