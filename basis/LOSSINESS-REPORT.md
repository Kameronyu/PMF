# KB Mechanization — Lossiness Audit Report

**Result:** {'complete': 2, 'minor': 3, 'major': 22}  · audited 27/28 (landing-pages failed, will re-run).
**Lost units to restore:** 68 HIGH (execution-relevant) + 142 MED (supporting). LOW (39) = intentional/parked, skip.

Coverage = (preserved+relocated+transformed) / source units. COMPLETE = differentiator (the careful pilot) and social-proof.

## Per-topic

| topic | verdict | coverage | HIGH | MED |
|---|---|---|---|---|
| conversion-optimization | MAJOR-LOSS | 0.54 | 10 | 8 |
| email-and-retention | MAJOR-LOSS | 0.79 | 6 | 8 |
| case-studies | MAJOR-LOSS | 0.31 | 5 | 13 |
| advertising | MAJOR-LOSS | 0.74 | 5 | 5 |
| cro | MAJOR-LOSS | 0.82 | 4 | 13 |
| ecommerce | MAJOR-LOSS | 0.80 | 4 | 8 |
| brand-building | MAJOR-LOSS | 0.62 | 4 | 7 |
| upsells | MAJOR-LOSS | 0.79 | 4 | 4 |
| persuasion-and-sales | MAJOR-LOSS | 0.46 | 3 | 15 |
| ads | MAJOR-LOSS | 0.85 | 3 | 7 |
| vssl | MAJOR-LOSS | 0.74 | 3 | 5 |
| upsells-and-monetization | MAJOR-LOSS | 0.80 | 3 | 4 |
| quiz-funnel | MAJOR-LOSS | 0.85 | 3 | 3 |
| copywriting | MAJOR-LOSS | 0.95 | 2 | 2 |
| customer-data | MAJOR-LOSS | 0.81 | 2 | 2 |
| consumer-psychology | MAJOR-LOSS | 0.60 | 1 | 11 |
| ad-creative | MAJOR-LOSS | 0.85 | 1 | 6 |
| email-marketing | MAJOR-LOSS | 0.83 | 1 | 4 |
| offer-construction | MAJOR-LOSS | 0.90 | 1 | 3 |
| advertorial | MAJOR-LOSS | 0.85 | 1 | 2 |
| pricing | MAJOR-LOSS | 0.80 | 1 | 2 |
| aov-optimization | MAJOR-LOSS | 0.89 | 1 | 1 |
| funnel-architecture | MINOR-LOSS | 0.90 | 0 | 5 |
| persuasion | MINOR-LOSS | 0.83 | 0 | 3 |
| product-research | MINOR-LOSS | 0.90 | 0 | 1 |
| differentiator | COMPLETE | 1.00 | 0 | 0 |
| social-proof | COMPLETE | 1.00 | 0 | 0 |

## HIGH-severity lost units by topic (what an agent could no longer do)

### conversion-optimization  (coverage 0.54)
- **Value Through Friction Removal Framework (five friction types)** (classification scheme) → restore to: A ROUTE/diagnostic contract in route-rules.md or a checklist in the skill — it is a named execution scheme for auditing an offer, neither a numeric gate nor a registry term.
- **Sales Step-Down Commitment Ladder (5-rung procedure)** (execution procedure) → restore to: An ordered ROUTE contract (sequence of closing offers) in route-rules.md; completely absent.
- **ICE Framework (Impact, Confidence, Ease) — taught twice in source** (decision/prioritization framework) → restore to: A scoring rubric in the SKILL (it is literally a scoring framework) — the skill captures the 20%-upside gate but drops the I/C/E rubric that governs which change to pick.
- **Maximizer vs. Optimizer Mental Model** (framework / decision rule) → restore to: A decision-orientation contract steering when to ignore ROI in favor of absolute scale; absent from skill and refs.
- **Return on Invested Capital (ROIC) vs LTV:CAC Hierarchy** (framework / metric hierarchy) → restore to: A unit-economics evaluation rule alongside the gates (could be a ROIC bar gate); absent.
- **Brand as Economic Multiplier (Four Revenue Levers) with benchmarks** (framework + benchmarks) → restore to: Either benchmark gates or a ROUTE framework (brand as four-lever multiplier: conversion, CTR, price, repurchase); entirely absent.
- **Secret Shopping Your Own Business (audit checklist)** (execution procedure / checklist) → restore to: A diagnostic checklist contract in references; absent.
- **Point-of-Sale Discount for Immediate Review (6-step procedure + latency rule)** (execution procedure + decision rule) → restore to: An ordered ROUTE procedure in route-rules.md (review-tactics is only one vague line); the 6 steps and the latency principle are gone.
- **Theory of Constraints for Metrics** (decision rule / method) → restore to: A prioritization rule for which metric to fix first; absent (only a generic leading/lagging route line exists).
- **Wrong Customer Unit Economics Destruction Model** (framework / causal model) → restore to: A diagnostic model paired with the ICP-reset route; the route captures the fix but not the model that justifies it.

### email-and-retention  (coverage 0.79)
- **37 Magical Moments Rule** (decision rule / framework) → restore to: score skill ROUTE rules or a service-recovery contract; or write skill as recovery-copy steering
- **Customer Results Flywheel** (framework / execution procedure) → restore to: score skill ROUTE rules or write skill contract (engineer capture moments)
- **Product Improvement Through Deletion** (execution procedure + decision rule) → restore to: score/route contract (only the survey line survives as a write specimen; the procedure and #1-cancel-reason rule are absent)
- **Nine C's of Recurring Revenue Stickiness** (classification scheme / named framework) → restore to: score skill ROUTE rules (levers to evaluate a membership against) or REFERENCE
- **Negative Word of Mouth / Invisible Hand (CAC-vs-CPM diagnostic)** (decision rule / quantitative test) → restore to: score skill as a countable diagnostic gate (compare CAC growth to CPM growth)
- **Price Raise Process for Existing Customers** (named multi-step execution procedure) → restore to: write skill (brace email / loyalty-discount copy steps) or score ROUTE sequence

### case-studies  (coverage 0.31)
- **Quadruple-Bypass Comment new-avatar discovery procedure** (execution procedure) → restore to: A ROUTE/procedure rule (avatar-discovery-from-comment) or a reference case; absent from skill and registry
- **AI Mechanism Discovery Prompt structured template** (execution instruction) → restore to: A ROUTE/procedure or reference; the prompt inputs are an executable recipe, absent entirely
- **Desire spike via external events / news-monitoring (Skate-Cut Gear 36x MER)** (decision rule) → restore to: A ROUTE rule or reference heuristic; absent
- **Boom-bust new-mechanism runway threshold (Dubai Chocolate / Hexclad)** (threshold / decision rule) → restore to: A threshold near the saturation gate; absent (the saturation gate only counts 5+ competitors, not the runway window)
- **Review mining for competitor-mentioned ingredients (Norse Organics speed-as-mechanism)** (execution heuristic) → restore to: A reference heuristic / mechanism-discovery procedure; absent

### advertising  (coverage 0.74)
- **Five Scaling Levers for Paid Acquisition** (framework / diagnostic) → restore to: kb-advertising-score ROUTE block or a diagnostic-framework reference — it is the named decision framework for WHAT to improve to scale spend; the skill teaches spend ceilings but never which lever to pull when ROAS drops.
- **Common Factors Analysis — Skill Acquisition Loop** (execution procedure) → restore to: A reference procedure consumed by both skills — it is the repeatable method for IMPROVING ad creative from data; nothing in either skill tells an agent how to derive what makes the winning ads win.
- **Pain-Based Demonstration Ad Structure** (execution template / ad structure) → restore to: kb-advertising-write as a named OPTIONAL structure/contract. The write skill teaches hook multiplication and testimonial hooks but omits this full ad build template (pain hook -> demo -> on-screen CTA, 15s) which is a distinct, executable creative pattern.
- **Four-Level Lead Generation Leverage Hierarchy** (classification scheme / scaling framework) → restore to: ROUTE/reference for scaling acquisition. The score skill's channel-sequencing rule does not encode the centralized-vs-decentralized leverage tiers that determine how lead-gen scales beyond management capacity.
- **Three-Phase Agency-to-In-House Playbook (+ Agency Learning Method)** (execution procedure / playbook) → restore to: A reference playbook. This named, phased procedure (the magic question 'What would it take for you to teach me one-on-one?', $750/hr figures, 21-day fatigue rule, 2-3%-of-spend consulting fee) is wholly absent; an agent advising on agency-vs-in-house has nothing to route to.

### cro  (coverage 0.82)
- **Conversion Formula (the core diagnostic model)** (framework) → restore to: kb-cro-score route-contract.md (as the diagnostic model behind funnel scoring) or definitions.md; currently only name-dropped in kb-cro-write/references/routing.md without its components
- **Diagnostic Failure Analysis — creative vs funnel metric split** (framework/decision-rule) → restore to: kb-cro-score route-contract.md item 3 (diagnose-before-kill) — the sequence is kept but the diagnostic instrument/metric split is dropped
- **Diagnostic metric benchmarks (Hook/Hold/CTR thresholds)** (threshold) → restore to: kb-cro-score criteria-tests.md as a gate or context for the creative-side diagnosis
- **Impact Grading System for Hypothesis Prioritization (10 KPIs, 0-15 scale)** (classification/decision-rule) → restore to: kb-cro-score (a scoring/prioritization scheme) — only the 'one test per page' clause survives in gate 6; the 0-15 grading framework is absent

### ecommerce  (coverage 0.8)
- **Valley of Despair / Cycle of Change 5-stage mindset model (+ Conviction-vs-Motivation distinction + 10,000-Hour mastery trajectory)** (framework + decision rule) → restore to: An ecommerce mindset/route reference, or at minimum a steering note. Only the lone maxim "Skill is permanent; revenue is not" survives (as a writer specimen); the entire 5-stage model, the quit-at-Stage-3-resets rule, the 30-60 day timeline, and the conviction-building loop are absent from every emitted skill and the registry.
- **E-commerce Exit Structure Selection framework (asset vs share deal decision rule)** (decision framework + thresholds) → restore to: kb-ecommerce-score as a ROUTE/decision contract (it selects an option by named conditions) or a reference. Entirely absent from all kb-out skills and the registry — 'asset deal', 'share deal', 'Dubai free zone', 'MBO/LBO $50M threshold' return zero hits.
- **5-Tab Master Document Architecture (creative-context document SOP)** (execution procedure) → restore to: A creative-prep ROUTE/reference in the ecommerce or product-research skill set. The named 5-tab structure and its 'quote density = primary copy lever' rule appear nowhere ('5-Tab', 'New Information', 'New Mechanism' tab structure absent from ecommerce skills).
- **7-Step Product Overview Document (sequential pre-copy procedure)** (execution procedure) → restore to: An ecommerce/copywriting ROUTE/reference. The 7-step ordered procedure is gone ('7-Step Product', 'Hidden mechanism' as this step list return zero hits); only the Hemingway Grade-6 check survives independently in G8.

### brand-building  (coverage 0.625)
- **Alex Hormozi Three Brand Eras Framework** (classification scheme) → restore to: A kb-brand-building-write skill (felt brand-evolution framework), or at minimum a references/ specimen — neither was emitted; it is not in the registry.
- **Brand Metrics (Influence, Direction, Reach)** (measurement framework) → restore to: A write skill or references specimen as an evaluative framework for diagnosing brand health; absent everywhere and not a registry term.
- **New Mechanism Differentiation Framework (5 Mechanism Types)** (classification scheme) → restore to: Should anchor or extend G3 differentiator handling / a ROUTE taxonomy in the score skill. G3 only checks differentiator presence (mechanism vs avatar); the five-type taxonomy used to identify which mechanism type you have is absent and not in the registry.
- **New Mechanism Category Creation 5-Step Audit** (execution procedure) → restore to: Should be a ROUTE rule alongside R7/R8 in references/route-rules.md. R7 covers mechanism *testing* and R8 the Foreplay board; the distinct ordered category-creation audit is absent.

### upsells  (coverage 0.79)
- **AOV-as-competitive-acquisition-advantage framework (incl. Dan Kennedy maxim)** (framework / strategic decision rule) → restore to: kb-upsells-score ROUTE/diagnostic contract or a registry term; this is the WHY that decides when AOV is the lever to pull. Also stated in upsells--carl-weische.md ('Higher AOV directly enables higher customer acquisition cost tolerance, unlocking more aggressive and profitable media buying'). Present in NEITHER skill.
- **Cart gamification with spend-threshold progress bar (mechanic, not copy)** (execution instruction / structural contract) → restore to: kb-upsells-score ROUTE rules at the 'cart' stage. Only the COPY line 'Spend $X more for free shipping' survives in the writer; the cart mechanic (progress bar + free-gift unlock + one-click add) is absent from both skills.
- **AOV framing through lifestyle imagery (multi-unit normalization)** (execution instruction) → restore to: kb-upsells-score ROUTE rules at the product/collection stage, or kb-upsells-write craft guidance. Entirely absent from both upsells skills.
- **Data-driven 'frequently bought together' cross-sell integration** (execution instruction / decision rule) → restore to: kb-upsells-score ROUTE rules (product-page cross-sell selection). The string 'frequently bought together' appears in NO emitted upsells file.

### persuasion-and-sales  (coverage 0.46)
- **Three Jobs of a Salesperson** (framework / organizing taxonomy) → restore to: Should anchor either SKILL.md as the spine the source explicitly says all other sales concepts map into ('All nine sales concepts map into these three buckets'). Absent from both skills and the registry.
- **Job 1 cluster: Maximize Opportunities (Maximum Hours Availability + Sales Multipliers)** (decision rule / threshold (execution lever)) → restore to: An execution lever the SCORE/WRITE skills entirely omit. The skill set only addresses Job 2 (conversion structure) and never the quantified opportunity-volume levers (sell 7 days = +29%, work the most hours, sell off-hours 4pm-8pm). No home in skills or registry.
- **Sales Script Adherence Over Closing (Reward the Process)** (decision rule / team-management procedure) → restore to: A counterintuitive, actionable management rule (reward adherence not closing; pay a $5 adherence bonus; lone wolves create false positives). Not present in either skill nor registry; routing-contract.md routes objections but never team/script management.

### ads  (coverage 0.85)
- **AI-powered creative/hook production pipelines (Infinite Hook Glitch System; Swipe Method; Original Concept Creation; TikTok Hook Mining)** (execution procedure) → restore to: kb-ads-write (a generation procedure for producing hooks/concepts at volume) or a routed reference; the writer only says 'produce several diverse drafts' and never carries the named pipelines, tools, or the high-view/low-follower signal, the 7+-day-longevity swipe signal, or the Gemini/Highfield/Nano Banana production chain.
- **Engagement-Driven CPM Reduction Strategy (engineer comment volume -> lower CPMs / cheaper traffic)** (execution procedure / decision rule) → restore to: kb-ads-write craft targets (a deliberate creative move) and/or kb-ads-score route-rules as a CPM-reduction lever; the only trace is the bare label 'Karen hybrid: seven-element controversy + DR structure' in route-rules, which names a structure but never teaches the engagement->CPM mechanism or the participation-prompt tactic.
- **White-Label Persona / Whitelisted Influencer Ad Strategy (whitelisting vs partnership ads, dark posts, persona accounts, 10-15 creators for social-proof saturation)** (execution procedure / selection rule) → restore to: kb-ads-score route-rules (a named selection: run-from-creator-page vs brand-page; partnership vs whitelisting; the 10-15-creator saturation rule) — none of this appears in either skill or the registry.

### vssl  (coverage 0.74)
- **Three-Pillar VSL Production Framework (Psychology / Words / Presentation)** (framework/classification scheme) → restore to: A diagnostic framework / ROUTE-as-contract in kb-vssl-write or a route reference; absent from both skills and from the registry.
- **VSL Content Production Stack — editor-direction clip-by-clip Google Sheets map** (execution procedure) → restore to: A production/handoff execution instruction; should be a ROUTE/reference step or checker prerequisite. Absent from both skills and registry. Its paired pitfall 'No editor direction system' was also not carried into the scorer's negatives.
- **AI-Powered VSL Research Process (six-step ChatGPT + OpenAI Operator workflow)** (execution procedure) → restore to: The procedure that produces the artifact G3 counts ('>=5 pages'). The score skill keeps the count but the how-to-produce-it procedure is gone from both skills and the registry.

### upsells-and-monetization  (coverage 0.8)
- **Dollars Per Box (Unit Economics Obsession)** (framework/execution-discipline) → restore to: A ROUTE rule or gate in the score skill (choose ONE fully-loaded unit-economic metric; load all costs; negotiate every line item) — absent from SKILL.md, references/, and the registry.
- **LTV as the Advertising Arms Race (decision rules)** (decision-rules/thresholds) → restore to: ROUTE rules / decision-rule section of the score skill; the whole framework (incl. the back-to-front rule and the CAC-1-2x vs LTV-is-the-differentiator threshold) is entirely absent from the skill set and registry.
- **In-Person Event Renewal System** (execution-procedure) → restore to: A ROUTE/sequencing rule for renewals in references/route-rules.md — completely absent (only the file's own title line matched on search); not in the registry.

### quiz-funnel  (coverage 0.85)
- **Emotional Priming is THE real mechanism (decision rule: NOT personalization/product-matching/AOV)** (decision-rule / mental-model with optimization consequence) → restore to: kb-quiz-funnel-write SKILL.md craft-targets/intro as a steering principle. The write SKILL only vaguely gestures ('primes a cold prospect into a purchase-ready state') without teaching the load-bearing rule that priming, not personalization/AOV, is the mechanism and therefore the optimization target.
- **Common pitfall: misattributing performance to personalization rather than emotional priming** (decision-rule / pitfall-with-consequence) → restore to: kb-quiz-funnel-score anti-pitfall presence checks (route-contract.md anti-pitfall duals). The score skill's anti-pitfall list omits this entirely; it is the one pitfall that changes WHAT a user optimizes for, so its absence is execution-relevant.
- **Bionic Model — Personalized Supplement Formulation (advanced quiz-funnel model)** (named framework / worked model (highest-differentiation variant)) → restore to: kb-quiz-funnel-write or a route-contract as an advanced/optional model. It is a named, teachable architectural variant (quiz/blood-test -> individual profile -> custom formulation) with a distinct value proposition (eliminates over-supplementation/under-targeting) and a brand-authority overlay device (celebrity equity). Appears in neither skill nor the registry.

### copywriting  (coverage 0.95)
- **Desire-to-Headline 12×2 Matrix (generative headline scaffold)** (framework / generative scaffold) → restore to: kb-copywriting-write SKILL.md or references/formulas.md as an optional generative pattern; it is a copy-GENERATION method, not a gate
- **Sub-Avatar Research Method (400+ comment signal) — 6-step Reddit-to-headline procedure** (execution procedure) → restore to: kb-copywriting-write references (a research→wording procedure feeding the writer); the write skill's route-rules only says 'mine VOC first' and never teaches this concrete sub-avatar → Reddit-by-pain → verbatim-quote → 3-5 headlines pipeline

### customer-data  (coverage 0.81)
- **Shipping / 68% cart-abandonment worked example of qual-quant convergence** (named worked example) → restore to: kb-customer-data-score/references/synthesis-specimens.md (Convergence reference) or field-tests.md Field 3 — the score skill states the convergence rule abstractly but drops the only concrete worked demonstration of how a qual finding + a specific quant signal + the 68% number combine into a justified A/B test.
- **Sufficient-volume-before-analysis / sample-size decision rule** (decision rule / threshold) → restore to: kb-customer-data-score/SKILL.md as a judged field or field-tests.md gate. Source teaches it twice (Process step 2 'Accumulate sufficient volume of responses before analysis' + Key Metrics) yet no skill checks adequate volume before clustering; not in the registry.

### consumer-psychology  (coverage 0.6)
- **Pain Threshold Crossing Framework (3 levers: Timing/Priming/Focus) + loss-aversion 2x multiplier** (framework + decision rule) → restore to: kb-consumer-psychology-score route-rules.md as a named lever/contract, or the registry; absent from every emitted file

### ad-creative  (coverage 0.85)
- **AI-Powered Video Ad Creation System (named tool stack + costs + Sora 2 workflow)** (execution procedure / tool stack) → restore to: kb-ad-creative-score route-contract.md (R12) or a tool-stack reference; nothing names a single tool or cost anywhere in either skill or the registry

### email-marketing  (coverage 0.83)
- **Personalized Abandoned Cart Recovery Sequence — named worked example (persona 'Natalie' + custom video + chat-style 1:1 landing page; two-email structure with differentiation in Email 2)** (framework/worked-example/execution-procedure) → restore to: A kb-email-marketing-write skill, or a specimen in references/; the mechanizer emitted no write skill so this generative job was dropped entirely.

### offer-construction  (coverage 0.9)
- **Offer-to-Landing-Page Testing Protocol (5-Step)** (execution-procedure) → restore to: kb-offer-construction-score/references/route-rules.md as the procedure for how to validate a new offer before banding; the skills route WHAT to test (Offer Testing Hierarchy) but never HOW to test it cleanly, and this named procedure is in neither skill nor the registry

### advertorial  (coverage 0.85)
- **Authority-Mimicry Pre-Sell Design (NYT-mimicry credibility-transfer technique)** (framework/execution-technique) → restore to: kb-advertorial-write SKILL.md or patterns.md as an optional design pattern, and/or a ROUTE rule in route-contracts.md; nothing in either skill nor the registry teaches it. Only the '100,000+ studies' number survived (as score G4), with the mimicry technique itself dropped.

### pricing  (coverage 0.8)
- **Execution levers for premium pricing (the four-item HOW: brand visual identity/packaging, marketing copy that frames value not cost, customer experience/unboxing, social proof/community)** (execution framework / instruction list) → restore to: kb-pricing-score should route these to a sibling kb-pricing-write skill or carry them as a checklist/specimen the F1 positioning-conviction judge can test against; instead they appear nowhere in SKILL.md, references/, or the registry. The F1 felt criterion grades whether positioning is convincing but supplies no levers for producing it.

### aov-optimization  (coverage 0.89)
- **Offer-variation anchoring design rule (how to structure/label tiers to shift the average)** (framework / execution decision rule) → restore to: SKILL.md or references/route-rules.md as a tier-construction rule; not relocatable to registry (registry has only the unrelated 'PMBD ladder anchors')
