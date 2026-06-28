---
status: authoritative
role: Verbatim custody vault for all 65 operator annotations (A1-A43, P1-P22), depth-sorted under decisions D1-D8.
read-with:
  - architecture/PART2--build-order-roadmap.md
  - architecture/PART3--architecture-design.md
  - reference/reviews/REVIEWS--raw-annotated-prompts.md
supersedes: []
---

> **What this is:** the authoritative annotation store (byte-identical quotes). **Read by:** every build session, to pull its decision's annotations. The source 'PMF annotated prompts and reviews.md' is now in-base at reference/reviews/REVIEWS--raw-annotated-prompts.md.

# PART 1 — Dependency-Ordered Map of the Operator's Annotations

**Arduview pipeline · annotation depth-sort session (Phases 1–2 of the handoff)**
Repo state read: `eink-phase0-run` branch of `Kameronyu/PMF` (the as-ran state: `marketing-lens/MAP.md`, `prompts/step1-light-pass.md`, the market-selection / funnel-deep-pass / funnel-architect / asset-classify skills). Admitted specs only: `15-SPEC-copywriter.md` (copywriter, unbuilt) and `handoff-step3-voc-build.md` (VOC, half-built). Companion document: PART 2 — build-order roadmap.

---

## 0. How this map was built

**Count.** 65 operator annotations: **A1–A43** from `annotations--arduview-pipeline.md` (the standalone doc) and **P1–P22** found only inside `PMF annotated prompts and reviews.md`.

**Custody rules honored.**

- Every annotation appears **verbatim** — typos, mid-sentence breaks and all — under a source tag. Nothing is reworded or compressed. My additions are confined to the header line above each quote and to lines beginning "→" after a quote.
- Where an annotation exists in both docs, the standalone doc's text is used as canonical (it is the operator's own curated copy); the registry in §11 notes the duplication.
- Reviewer A / Reviewer B findings are the backdrop the annotations respond to. They are never filed as operator judgment, and nothing below "challenges" a reviewer claim as though the operator said it.
- Annotations that cut at more than one tier or decision appear at **each** place they touch, in full.
- Source tag damage: P9's annotation opens with a bare `\<` and never closes; P12 carries no annotation tags at all but is unmistakably operator voice appended to a reviewer paragraph (it is included on that basis and flagged here); A15's annotation block in the combined doc has no closing tag (the standalone doc supplies the boundary).

**KB caveat.** The DR knowledge base lives on the operator's WSL filesystem and was not reachable from this session (the repo carries `definitions.md` only). Where a note below grounds a marketing-truth point, it grounds it in law passages quoted *inside the audit docs themselves*, and says so. Those groundings should be re-verified against the full KB in the Phase 3 session.

**Tier vocabulary** (handoff): **SYSTEM-SHAPE** — how the system fits together; **STAGE-DECISION** — what one agent decides and what it must see; **FIELD-LEVEL** — exact I/O: which field, in which file, in what shape, emitted by whom, consumed by whom.

---

## 1. The shape of the mountain

The 65 annotations collapse onto **eight decisions**. Five are open system-shape decisions (D1–D5). One is a small, mostly operator-settled seam decision (D6). One is the topology/knowledge/orchestration decision (D7). One is the gated build of the absent stage (D8). Nearly every stage-decision and field-level annotation is blocked by at least one of these; the genuinely independent remainder fits in one short list (§10).

Tested against the three system-shape outcomes the operator anticipated:

- **KB mechanization — SUPPORTED, strongly.** The single largest cluster in the sort: D3 (the property-test half: named inputs + mechanical test per classified property) plus the knowledge-scoping half of D7 (which agent reads which rule, in what form). A21, A25, P1, A36 and A34 state it as a project-wide pattern, not a per-prompt fix.
- **Agent splitting — SELECTIVELY supported, not wholesale.** The annotations demand named splits (slop-checker vs brand-missing checker, A39; a copy chief, A35; possibly an awareness analyzer, A43; possibly a line-reader, P17 — offered as "not saying we should"). They do *not* support a global micro-agent conversion: the operator himself doubts splitting the architect ("probably not", A43) and defers the full granular build behind other work, explicitly behind a VOC MVP (A36).
- **VOC-driven re-routing — SUPPORTED, strongly — and sharpened.** The annotations demand not one VOC feed but at least **two distinct VOC products**: market-selection-grade signal and funnel/copy-grade language ("the VOC needed to feed market selection is likely very different from designing angle ab tests and belief installs", A6; the multi-axis niche study, A15). This is the largest re-routing in the map and the foundation-changer the handoff predicted.

| # | Decision | Tier | Status | Annotations filed |
|---|----------|------|--------|-------------------|
| D1 | VOC integration: conduct + which stages consume which VOC product, under what I/O contracts | SYSTEM-SHAPE | Open (that VOC enters: settled) | A6, A12, A15, A37, P21, A11, A26, A43† |
| D2 | Transformation-source policy + the transformation test | SYSTEM-SHAPE | Direction settled by operator; test design open | A5, A10, A13, A24, A25, A31, P2, P5, P20 |
| D3 | Determination mechanics for every classified property + definitions.md revision | SYSTEM-SHAPE | Open; pattern named project-wide | A7–A9, A11, A14, A16–A19, A21, A25–A28, A33, A34, A37†, P1, P11–P13, P17, P18 |
| D4 | The bet: definition, pre-research skill, bet-evidence transfer controls | SYSTEM-SHAPE | Open; upstream-most | A20, A22, A23, A30, A38, A39†, P1†, P6, P8, P9, P10, P19 |
| D5 | Validation-currency model (incl. crowdfunding/DTC unification) | SYSTEM-SHAPE | Open | A1, A26, A27, A32, A40†, A43†, P4, P7, P14, P15, P16, P22 |
| D6 | Awareness: producer, placement, evidence, contract | STAGE→FIELD seam | Direction settled (A3/A4); evidence + topology open | A3, A4, A42†, A43†, P14† |
| D7 | Agent topology, knowledge scoping & orchestration | SYSTEM-SHAPE | Open | A16†, A20, A34†, A35†, A36, A39†, A40†, A41, A42, A43†, P17† |
| D8 | Copywriter + copy chief: the absent stage, built to spec | SYSTEM-SHAPE (build-gated) | Unbuilt; gates stacked | A34, A35, P13† |

† = the annotation also appears under another decision; it is filed in full at each.

---

## 2. D1 — VOC integration: how VOC is conducted, and which stages consume which VOC product, under what I/O contracts

**The decision to be made.** Decide (a) how VOC is conducted — the half-built engine in `handoff-step3-voc-build.md` already specs the Reddit-first 3a/3b collection mechanics — and (b) the part **no spec covers**: what distinct VOC products exist, what each contains, and which stage consumes each (market-selection demand gates and gap analysis; niche study; awareness; funnel-architect belief design; copywriter language bank), including the whitespace-vs-scary policy for VOC signal that competition has not validated. Then run the integration design through a modified adversarial review, as the operator requests.

**Status.** Open. *That* VOC enters is settled by the operator. Everything from conduct to consumption wiring is the open design. Note the VOC build spec's own scope line stops at "a stored, queryable copy bank" — the consumption contracts are explicitly outside it, which is exactly the gap these annotations name.

**What resolving it unblocks or deletes.** The market-selection revision (Gate 1 demand evidence, community heat, gap analysis), the awareness evidence question (D6), the funnel architect's input set, the copywriter's RAG bank (D8 — the spec's RAG input currently does not exist), the VOC lane of the currency model (D5), and the VOC-fed mechanical thresholds in D3 (A11). Per the handoff's expectation, this is the system-shape boulder with the widest re-routing consequences.

### System-shape annotations

**A6** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S1, after the STANDARD line
*Referring to: The broader question of how VOC integrates with the system going forward*

> but yes agreed, the best data is the customers, and we need to put VOC in this system going forward and understand how it interacts with the others. We need IO contracts with the VOC and i dont know how this should work together. This will require lots of thinking. For example. I think that demand validation and these gates for the market selector should be fed VOC, full stop. VOC can absolutely gauge whether people actually want it as well as competitor spend. It needs to be discussed very thoroughly how VOC is 1, conducted, and 2, how the outputs are fed into this system. I get that VOC was omitted to ship fast, and i get that bang for buck, the easiest thing is just to take what your competitors have already proven, and i still think that proven messaging is important, but i need to evaluate the value of, say, if theres an angle or an emotion or a transformation or an identity (niche) that buys a specific thing and they talk about it a lot in the VOC but isnt validated by competition, is that whitespace, or scary? I think gap analysis absolutely has to include VOC inputs and theres a lot of untangling to do because gap analysis, or actually market selection, was not VOC fed. We need to understand what market selections job is, and then how VOC can indicate gaps of what might resonate with the market that isnt being run by other brands. We might need a voc pass just for this, before we start figuring out angles and funnel architecture. Because the VOC needed to feed market selection is likely very different from designing angle ab tests and belief installs and such. We might want to utilize after designing how VOC is fed into the system, we should probably run it through a form of the adversarial reviewer again, probably modded.
→ This one annotation states D1 nearly completely: conduct + I/O contracts, the two-product split (market-selection VOC vs angle/belief VOC), the whitespace-or-scary policy (a marketing-truth call the operator explicitly reserved for discussion), and the modded adversarial re-review of the design. It is the single highest-leverage annotation in the corpus.

**A12** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 1 (transformation stamped from competitor claims, VOC deferred), end of the decision block
*Referring to: The broader question of how VOC and supply-side research work together to select NTP pairing, architect the funnel, and write copy*

> i think going forward we need to figure out, like given this analysis how VOC and the supply side research are gonna go together to select the NTP pairing and then architect the funnel and then also write the copy. How and what VOC inputs feed what.

**A15** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 3, DATA-SUFFICIENCY violation, end of block
*Referring to: The importance of VOC in studying the niche across multiple axes before finalizing market selection*

> i think this next pass when fully finalizing the system, i think VOC has to be at least drafted, but id say built. Because in reality VOC is so important. And also, we can study the niche in so many different ways. Do they have signal for this transformation. (market selection) then how do they talk about it, how do they talk about things in their transformation category, and what are just general shared values beliefs / PMBDEs across this niche regardless of transformation.
→ "at least drafted, but id say built" sets VOC's build priority ahead of full system finalization; independently, A36 (filed at D7) orders a VOC MVP before the KB mega-build. PART 2 honors this ordering. The three study axes named here (signal for the transformation; how they talk about it; shared values/beliefs regardless of transformation) are the seed of the market-selection-VOC product definition.

**A37** — `annotations--arduview-pipeline.md` · Context receipt / end of the funnel diagnosis doc, third annotation block
*Referring to: Mechanism believability varying by niche; the need to classify each distinct idea in copy one by one as structured data; and the need for a full session on VOC inputs for market selection and funnel architect*

> sometimes, mechanism believability completely different based on niche. Like maybe mechanism for old people is "all natural" while for biohackers its "backed at clinical doses." for the funnel analyzer, we might want to have predefined things of what a piece of copy can be, i guess thats belief architecture, but it might get more granular, like a piece of copy could be about adhd for the purpose of identifying with the in group. I guess the belief would then be, "this product is made for ME". i would like an interpretation of how the current funnel analyzer does at this case. The reason i would like to classify each, distinct and single idea one by one, is that if thats put as structured data and classified correctly, that is huge ammo for writing a funnel. I think were kind of there with the beliefs and funnel architect but maybe not quite. We require one full session figuring out which inputs to capture in VOC, and bake it into the market selection framework and especially the funnel architect.
→ The "one full session" demand is the SS core here: VOC inputs baked into the market-selection framework and the funnel architect together — i.e., D1 and the consuming stages are co-designed, not sequenced. The mechanism-believability-by-niche and classify-each-idea parts of this annotation are filed at D3.

**P21** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-4 data-sufficiency verdict end

> yes though i agree and integrating VOC, figuring out inputs and outputs is genuinely gonna  be such a huge deal during this build and how the inputs get fed and analyzed.

### Stage-decision annotations gated by D1

**A11** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S8, Hexclad/Ridge "desire-first" cite
*Referring to: The role of articulated customer frustration and purchase intent*

> yes i think articulated customer frustration, and articulated customer purchase intent is important, and to make it mechanical, well we want to see how many people raise it, if the number is large relative to how much data we have.
→ Also filed at D3: the mechanical form (count of independent raisers relative to corpus size) is a VOC output contract item — it can only be specced once D1 fixes what VOC emits.

**A26** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S1, first bullet (proven market demand)
*Referring to: How proven market demand is mechanically determined — supply side and demand side*

> mechanically, how do we determine what proven market demand even means, and for what. Demand that this niche wants this transformation? And how is that determined on supply side, and is that also fed by demand side as another currency rather than attempting to manufacture new demand…
→ Also filed at D3 and D5: "is that also fed by demand side as another currency" makes VOC a demand currency feeding market selection — D1 supplies the feed, D5 prices it.

**A43** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: funnel architect
*Referring to: Light knowledge on funnel architecture; inputs needed; whether to split into agents; how awareness level is determined (competitor funnels vs VOC); who analyzes awareness; whether crowdfunding should be treated separately from DTC; granularity of belief analysis for funnel architect; and whether a funnel auditor should follow the funnel builder*

> my actual knowledge on funnel architecture is light. 1, i need to make sure this thing has tapped inputs / all the inputs it would need to do its job well. 2, is this worth splitting up into agents, probably not. For determining awareness, of what awareness level to sell to, this likely comes from other competitor's funnels. But maybe should come from VOC. i dont know. For forum marketing i think awareness level can be derived from VOC. also, who analyzes awareness? Is that its own agent? The reason i ask is because the funnel deep pass seems quite mechanical. I dont know. I think it is fitting to have awareness analyzed in funnel deep pass but idk if it is. Also i think the currencies are good but it treats crowdfunding as something entirely separate as direct response or direct to consumer which is bad. I think the most valuable funnel we have is a deposit funnel that makes a similar bet to us. I need to understand how granular the belief analysis in section analyzer needs to be in order for funnel architect to do its job correctly. Do you think a funnel auditor should go after the funnel builder? Happy to split these jobs into more parts.
→ Filed here for one part only: "For forum marketing i think awareness level can be derived from VOC. i dont know." — the VOC-as-awareness-evidence question. The rest of this annotation is filed at D5, D6 and D7.

**Policy cross-reference.** What may determine a *transformation* (VOC vs competition vs spend) is D2, filed next; D1's contracts implement whatever D2 settles.

---

## 3. D2 — Transformation-source policy & the transformation test

**The decision to be made.** Settle, as written policy, what evidence is licensed to determine a transformation (competitor supply-side claims, VOC, spend) and under what analysis; then render the policy as a mechanical transformation test (named inputs → analysis → conclusion) under D3's pattern, and amend `definitions.md` accordingly.

**Status.** The marketing-truth direction is substantially **settled by the operator across these annotations**: transformation IS derivable from competition if the inputs and analysis are mechanical (P5, P20); VOC is the best data but not the only source (A6, A31); supply-side weighs heavily when real money is proven (P2). What remains open is the test design itself and the definitions.md amendment.

**Custody note (flagged, not silently applied).** This is the one place the annotations overrule a rule in the project's own law file — and the operator identifies that rule as his own authorship, "not even a true DR source of truth" (P20). So the revision is the operator amending himself, not this session overruling the KB. For grounding: the law passages quoted in the audit docs (e.g., Mark's "The best raw data is customers' own words") support VOC primacy for *copy language*; nothing quoted in the audits requires VOC *exclusivity* for market-level transformation classification. The operator's settle is consistent with what the quoted law actually claims. [Grounded only in audit-quoted law; re-verify against the full KB in Phase 3.]

**What resolving it unblocks or deletes.** Deletes A5's confusion and answers A10 outright. Unblocks: the space classifier's transformation clustering (the run's `novelty-object-own` failure), the market-selection gate semantics, D1's transformation-related VOC contract, and the definitions.md revision filed at D3 (P18).

### Policy annotations (operator's marketing judgment — system-shape consequences)

**A5** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S1, first bullet (transformation definition)
*Referring to: The standard that transformation is VOC-found, not asserted*

> this is kind of confusing. Why would it say transformation is only VOC found. Its whatever outcome for the customer that my competition is communicating to the customer.

**A10** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S8 (operator-note standard / missing VOC tradeoff), "true transformation is VOC-found" cite
*Referring to: Whether VOC-found transformation is a hard rule*

> is true transformation is VOC found a hard rule?

**A31** — `annotations--arduview-pipeline.md` · THREAD CHECK — Entry join, first bullet
*Referring to: The nuance that competition and spend are not useless for determining transformation — more nuanced than VOC is the only valid source*

> again, more nuance than VOC is the only source of determining transformation and competition is useless.

**P2** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 1 (asserted transformation), after the _provenance quote

> we need to balance what VOC validated vs market validated means. Imo, supply side validation is more important if we can prove that they make money.

**P5** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 1, disclosure-violation paragraph

> this rule was written by me that VOC must give transformation but idont think this is actually true. Transformation can absolutely be derived from competition as long as the input and analysis is mechanical enough or has proper insrtructions. I actually need to discuss with the prompt builder how an agent would look at a competitor and assert the true transformation. And if transformation comes from reading the claims, the claims must be accurately labeled as well, as in product features should not be claims.

**P20** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-4 header (belief chain on asserted transformation)

> this being said one more time like its unreasonable that transformation is completely underivable from competition and the doc that said this is the doc I wrote its not even a true DR source of truth.

### Stage-decision annotations gated by D2

**A13** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 2 (novelty-object-own as a "transformation"), RULE-SOUNDNESS violation paragraph
*Referring to: What the real transformation would be for this product type — what buyers actually want after purchase*

> agree. It would be what happens after that. Do they buy it to look at, buy a cool gift, look cool, be in the know of cutting edge tech.
→ The candidate output classes for this product type (display/gift/status/in-the-know) — seed material for the transformation test's answer space.

**A24** — `annotations--arduview-pipeline.md` · PHASE 2 — PROSECUTING THE COMPOSITION, second weakest join paragraph, "novelty-object-own" as run_transformation
*Referring to: What caused the transformation classification to go wrong*

> i wonder what caused this classification to go south like this.
→ Diagnostic; runnable now (§10). The reviewer's backdrop suggests the answer will implicate the clustering rule (three unlike outcome-promises rolled into one label) — which is exactly what the D2 test must make impossible.

**A25** — `annotations--arduview-pipeline.md` · PHASE 2, same paragraph, end — discussion of spend proving transformation and the real problem being misclassification
*Referring to: Two issues: (1) why spend alone doesn't prove transformation, and (2) the mechanicality problem with how DR properties like transformation are determined across the whole system*

> 2 things. One thing that needs to be discussed, is why wouldn't a lot of spend prove a transformation, and 2, wouldn't the true problem be that the classified transformation is not the true transformation, and that is probably because again, check if whether a definition is truly enough to define a brand's transformation (or any other DR properties) or do we name specific inputs and how they will be analyzed to come to the conclusion that this is a transformation. Because i seriously doubt that these brands became successful if the true transformation their marketing sold was purely (own a cool object.) no way. Subtly, chances are high that its something like show your friends or be cutting edge tech or something. I think like the mechanicality of how properties of a brand are determined. Well actually this entire system's mechanicality, especially like funnel analyzer, its shaky.
→ Part 1 (why wouldn't spend prove a transformation) is a D2 policy question. Part 2 (the whole system's mechanicality) is filed at D3 as a system-shape statement.

---

## 4. D3 — Determination mechanics for every classified property ("definition + vibes" → named inputs + mechanical test) + definitions.md revision

**The decision to be made.** For each DR property the pipeline classifies — transformation (test per D2's policy), niche, mechanism vs feature, claim typing, trend/durability, proven demand, congruency, angle, awareness (evidence per D6), belief/idea units — decide the **named inputs**, the **mechanical test**, and the **evidence wiring**, replacing definition-plus-interpretation classification everywhere. Then revise `definitions.md` so it carries the tests, not just the definitions.

**Status.** Open. The operator names this as a *project-wide pattern*, not a list of local fixes ("Look for this pattern of failure elsewhere in this project if it exists" — A21; "this will be true for ALL classification steps" — P1). This is the property-test half of the anticipated KB mechanization; the presentation half (which agent reads which rule, in what form) is D7. P1 also warns the test inventory may *create new jobs* — meaning D3's output feeds D7's topology decision.

**What resolving it unblocks or deletes.** Almost every field-level item in the corpus: the evidence fields each stage must emit and consume are dictated by the tests. Until D3 lands, speccing those fields would freeze the wrong contracts.

### System-shape annotations

**A21** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 8 (demand trend / fad-death durability), RULE-SOUNDNESS survived paragraph
*Referring to: The need to define mechanically what trend is being assessed, what keywords or signals to look for, and how durability is calculated*

> yes but we need to ask, what are we actually going to assess the trend of? What are the keywords or how is trend actually validated? What trend are we looking for? The trend of people looking for the transformation? The trend of the niche growing and the niche is proved to want this transformation? Just DR judgement on whether or not this transformation is a core human driver? Temporal signals from the rapid growth of direct competitors? Read market research reports themselves? Theres so much market research that I do have access to. The CAGR of the market? How is this mechanically calculated, not left up to an agent that decides what is trend without knowing what thing it needs to verify is trending, or what things it should look at together. Look for this pattern of failure elsewhere in this project if it exists.

**A25** — `annotations--arduview-pipeline.md` · PHASE 2, same paragraph, end — discussion of spend proving transformation and the real problem being misclassification
*Referring to: Two issues: (1) why spend alone doesn't prove transformation, and (2) the mechanicality problem with how DR properties like transformation are determined across the whole system*

> 2 things. One thing that needs to be discussed, is why wouldn't a lot of spend prove a transformation, and 2, wouldn't the true problem be that the classified transformation is not the true transformation, and that is probably because again, check if whether a definition is truly enough to define a brand's transformation (or any other DR properties) or do we name specific inputs and how they will be analyzed to come to the conclusion that this is a transformation. Because i seriously doubt that these brands became successful if the true transformation their marketing sold was purely (own a cool object.) no way. Subtly, chances are high that its something like show your friends or be cutting edge tech or something. I think like the mechanicality of how properties of a brand are determined. Well actually this entire system's mechanicality, especially like funnel analyzer, its shaky.
→ Filed here for part 2: "the mechanicality of how properties of a brand are determined. Well actually this entire system's mechanicality, especially like funnel analyzer, its shaky." Part 1 is at D2.

**P1** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Collection Diagnosis, DECISION 9 (comparable-bet-seed exclusion), rule-soundness paragraph

> yes, make sure the bets are calibrated to control for niche and transformation. So like a bet that works for one niche cannot be determined to reach for another. We also need someone to figure out how to actually determine niche. How to determine who theyre selling to. This could be through copy identigfiers where the marketer tries to relate to the viewer, identifiers (adhd), the people in their marketing, what their marketing looks like (you can just look at ka chava branding and understand its almond mom girly vs huel which is optimizer biohacker.) like i said before, there needs to be careful consideration for classification, like what evidence is fed into classification to ensure that we are finding the right thing. And how do we make sure that each signal is read nad ocnsidered, instead of telling an agent ,look at the page and determine the niche. And this will be true for ALL classification steps. Trends, angles. Niche. Trasnformation. Mechanism. Belief. We need to audit the basis on which things are being defined and what inputs are needed to define it instead of letting an agent see the definition and then just decide on vibes. I dont think one definition is truly enough. It also mght be true that this introcues a bunch of other distinct new jobs that weren tin the system befotrre.

**A34** — `annotations--arduview-pipeline.md` · PHASE 0 — S-1, after the "greased slide copywriting principle" reference
*Referring to: The need for better mechanical tests — e.g., an agent reads copy and predicts what a regular user would think next, then that gets sent back to the copywriter*

> for example, greased slide copywriting principle. Yes it makes sense in theory, but there are better tests than this. Like maybe an agent reads one piece of copy, then tries to predict or decide the most logical thing a regular user would be thinking, and then that gets sent to the copywriter who wrote the first copy draft. This is true across the entire thing and when writing each prompt this question must be asked across any step of the way.
→ Filed here for the closing principle — "This is true across the entire thing and when writing each prompt this question must be asked across any step of the way." The specific copy test it proposes is filed at D8.

### Stage-decision annotations gated by D3 (grouped by property)

**Trend / durability / proven demand**

**A7** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S5 (demand durability / fad-death)
*Referring to: The standard that novelty-tech plays require a durability read*

> okay, yes like forever desires vs a fad or trend. We need to understand what mechanical inputs would actually determine this.

**A26** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S1, first bullet (proven market demand)
*Referring to: How proven market demand is mechanically determined — supply side and demand side*

> mechanically, how do we determine what proven market demand even means, and for what. Demand that this niche wants this transformation? And how is that determined on supply side, and is that also fed by demand side as another currency rather than attempting to manufacture new demand…

**A27** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S2 (durability of demand), Google Trends cite
*Referring to: The need to define mechanics for trend and demand determination*

> yes we need trend determination or demand determination mechanics defined.

**Niche (venue test, niche-reading, in/exclusion)**

**A8** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S6 (niche and market definition), venue test sentence
*Referring to: The venue test requirement for edc-aesthetic-collectors as a real niche*

> for something like this, should we run a venue test just to look for venues? How would this work what step would this be in. again, what mechanical inputs would determine this.

**A14** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 3 (edc-aesthetic-collectors as a "niche"), RULE-SOUNDNESS paragraph, venue test sentence
*Referring to: The venue test requirement for the niche label*

> ok, we should put this test in then.

**A9** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S7 (saturation must never be pooled)
*Referring to: The standard that which brands count in a cell is a load-bearing honesty test*

> decision needs to be made of what brands get excluded and included.

**P11** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 3, avatar-differentiator strain paragraph

> okay. I think like we need to understand how to read a brands material and understand who they sell to. I think a lot of it comes down to the way in which they try to install beliefs regarding relating to the customer (funnel deep pass), how to identify with their customer , like the caall outs that they do, and also, if they do, what kind of person they  purposely exclude (this isn’t for …., this is for xxx person)

**Mechanism vs feature (definition, believability gate, separate tracking)**

**A16** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 6 (mechanism ownability), RULE-SOUNDNESS violation, "Mechanism ≠ UM" cite
*Referring to: The definition of mechanism and how it differs from product features, and the need for a believability gate*

> i think this definition is old, i think mechanism is the pathway in which your product achieves the transformation, which must pass a believability gate before we use a mechanism. So a big screen, if it does not actually plausibly deliver the transformation then its a product feature. But the feature might contribute to the transformation. This might need to be discussed, with output examples so we can go down the list and classify. We might need to have some of these downstream analyzers ALSO read outputs and work through them with me. Not fully sure.

**A17** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 6, within the mechanism clustering discussion, "Long battery life" / "Premium high-density display" examples
*Referring to: Agreement that specs/features being counted as mechanisms is wrong*

> agreeV

**A18** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 6, after the "UM is how a product is positioned around it" sentence
*Referring to: Clarification of unique mechanism definition*

> unique mechanism is just mechanism that other people aren't using for the transformation. This has to pass a believability gate.

**A19** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 6, DATA-SUFFICIENCY survived paragraph
*Referring to: The need to track product features separately from proposed mechanisms, and to make mechanism classification more mechanical*

> we do want to track all product features, but just needs to be separate from proposed mechanism. And mechanism classification should be given a test / made more mechanical.

**A28** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S3 (differentiator required), header line
*Referring to: Whether the rule is new mechanism to new avatar, or just having one differentiator is sufficient*

> is the rule new mechanism to new avatar or is it ok as long as we have one
→ Open rule question the test must answer; the reviewer's backdrop found the as-ran prompt had softened the law's conjunction (mechanism AND avatar) into a kill-only-if-neither. Resolve against the KB in the D3 session.

**P13** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, S-5 (sell outcomes, not features)

> yes with a caveat for whether or not the niche, at the awareness level, cares about the features. A customer who cares about dosing o the supplement because they know the outcome the supplement gets, should probably be presented the dose.  Well, maybe not, i was thinking about sleeping pills or uh sickness or allergy mecdecine and why a very dominant angle is “maximum strength.” emotionally , its not really a product feature but more of a maximally avoid pain and make no other tradeoffs which i guess is piece of mind i dont really know. And then 10g melatonin, yes thats a product feature, but thats a well understood mechanism by the buyer for achieving the transformation of falling asleep. So they are selling the outcome. This is different than naming specs that dont matter. This logic should probably be discussed and turned into a test of how to actually reason through selling the features of aproduct as in they need to be mechanisms for the transfomraiton and the mechanism needs to be  believable or understood by the customer (melatonin dose \= sleep)
→ Also filed at D8 — the reasoning pattern ("is this feature a believed mechanism for the transformation at this awareness level") becomes a copy-chief test there.

**Congruency / angle / line-level**

**A33** — `annotations--arduview-pipeline.md` · PHASE 0 — S-1 (Congruency Law), after the funnel definition quote
*Referring to: The need to make congruency mechanically testable rather than vibe-based — specifically asking what a rigorous test for congruency between sections would look like*

> for all of these rules, i need to discuss and figure out the rules that dont have great mechanical application and come up based on vibes, because if an agent read that funnel definition and read a funnel and was asked if it was congruent, i dont really know if it would produce a useful response. What would be the mechanical rigor test for whether or not each section is congruent to the one before it and everything is congruent to one funnel. I think we actually use all the right rules, but making sure they are being factually applied and not based on vibes of what an agent thinks congruent means is the key.

**P17** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-3 (one-driver-per-piece / curiosity)

> a few things. curiosity is the type of emotion. Angle is the emotion. This is valid. What are they curious about, like what is the information they wanna know, and what is the motivation for why they would like to learn more? Of course you cannot just derive all agnes as core drivers. Curiosity is honestly more of just a copywriting principle of getting the customer to want to read more. This is why i want a through application of rules and get specific. Like an untrained agent reads a piece of copy and asks, does this invite curious? Do i want to read more?” and does it line by line. Like not saying we should, but that literally could be its own singular agent in of itself. The do i want to read th next line after reading a line checker.
→ Also filed at D7 (the possible line-checker agent).

**VOC-fed thresholds**

**A11** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S8, Hexclad/Ridge "desire-first" cite
*Referring to: The role of articulated customer frustration and purchase intent*

> yes i think articulated customer frustration, and articulated customer purchase intent is important, and to make it mechanical, well we want to see how many people raise it, if the number is large relative to how much data we have.
→ Also filed at D1; the threshold spec consumes D1's output contract.

**A37** — `annotations--arduview-pipeline.md` · Context receipt / end of the funnel diagnosis doc, third annotation block
*Referring to: Mechanism believability varying by niche; the need to classify each distinct idea in copy one by one as structured data; and the need for a full session on VOC inputs for market selection and funnel architect*

> sometimes, mechanism believability completely different based on niche. Like maybe mechanism for old people is "all natural" while for biohackers its "backed at clinical doses." for the funnel analyzer, we might want to have predefined things of what a piece of copy can be, i guess thats belief architecture, but it might get more granular, like a piece of copy could be about adhd for the purpose of identifying with the in group. I guess the belief would then be, "this product is made for ME". i would like an interpretation of how the current funnel analyzer does at this case. The reason i would like to classify each, distinct and single idea one by one, is that if thats put as structured data and classified correctly, that is huge ammo for writing a funnel. I think were kind of there with the beliefs and funnel architect but maybe not quite. We require one full session figuring out which inputs to capture in VOC, and bake it into the market selection framework and especially the funnel architect.
→ Filed here for: mechanism believability varying by niche (the believability gate is parameterized by niche) and "classify each, distinct and single idea one by one... as structured data" (the belief/idea-unit granularity test that the architect's job depends on). The VOC-session demand is at D1.

**A15** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 3, DATA-SUFFICIENCY violation, end of block
*Referring to: The importance of VOC in studying the niche across multiple axes before finalizing market selection*

> i think this next pass when fully finalizing the system, i think VOC has to be at least drafted, but id say built. Because in reality VOC is so important. And also, we can study the niche in so many different ways. Do they have signal for this transformation. (market selection) then how do they talk about it, how do they talk about things in their transformation category, and what are just general shared values beliefs / PMBDEs across this niche regardless of transformation.
→ Filed here for the niche-study axes (the multi-axis study defines what the niche test must look at); primary filing at D1.

### Field-level annotations gated by D3

**P12** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 6 (price conditioning), end of rule-soundness paragraph (untagged operator text)

> Yes, price conditioning for this niche being sold similar product and similar transforpation. Do the agents have the definitions for product and product category?

**P18** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-3 (belonging vs status driver mistag)

> yes, and we need to get to the bottom of why it got it wrong or its ambiguous. I also might wnat to revise definitions md to get rid of that test.

**A30** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 8 (spend-transfer check), DATA-SUFFICIENCY survived paragraph
*Referring to: Applying the spend-transfer logic with NTP controls — similar niche, transformation, and product category required; need to define what a niche category is*

> can we apply this logic of "similar NTP required, like similar niche, transformation and product category." I dont think i ever determined what a niche category even is.
→ Filed here for "I dont think i ever determined what a niche category even is" — a missing definition the test inventory must produce. The NTP-transfer application is the primary filing at D4.

---

## 5. D4 — The bet: definition, pre-research skill, bet-evidence transfer controls

**The decision to be made.** Define what a **bet** is and what the pre-research hypothesis actually outputs; build the pre-market-research skill and fix where it sits in the pipeline; and spec the bet-evidence machinery — how to verify another company "fits our bet," N/T/P-similarity controls evaluated separately with their own criteria, functional-mechanism equivalence as the unit of comparison, and how bet evidence relates to cell membership and saturation.

**Status.** Open, and upstream-most: the operator traces run-quality complaints back to the bet brief ("i think that this analysis will just come back to quality of the bet brief" — A39), and the as-ran Finder generates queries directly from the brief's territories and comparable-bet seeds, so everything downstream of search inherits this decision.

**What resolving it unblocks or deletes.** The light-pass revision (query generation, roster quality), the space classifier's comparable-bet-seed/cell logic (A23's question), the spend-transfer controls in market selection (A30, P8), the bet-evidence lane of D5's currency model, and the missing `bet_type` emission contract the reviewers flagged.

### System-shape annotations

**A38** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: light pass, opening annotation
*Referring to: The need to clearly define what a bet is and build/understand the pre-market research skill and where it fits in the pipeline*

> What is a bet? This needs to be clearly defined and the pre market research skill needs to be built and understood where it goes.

**A39** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: light pass, large annotation block
*Referring to: A wide range of system design questions: redefining the bet / hypothesis output, orchestration design, query generation from starting inputs, slop checker vs brand-missing checker as separate agents, funnel packaging before analysis, mechanism/claim/feature conflation, DR knowledge injection, agent context cleanliness, and the light pass vs deep pass scope*

> We need to redefine what the bet is / what the actual output of the hypothesis done in pre-research is. Also i dont know how this is orchestrated / if it is orchestrated correctly at all. As in, is the orchestrator literally just running all the agent prompts itself? What about the scripts that it is told to run, is there anyway to reinforce this as a workflow that deterministically runs or no. like a series of claude p calls with scripts in between, how should this work. I would like to run just one command and give the inputs that the command needs. I would not trust the strength of this here. We can override system design for sure. Can you (the agent reading this) tell me specifically how queries are generated based on starting inputs? We should go back to my notes on how the bets are made back in my annotations of the review. I think in theory this finder is good but again like my other annotations may need to be more structurally mechanical to leave less interpretation up to the agent. Ok for 1.5, i think the slop checker and the reviewer to see if there are brands missing should be separate agents. But i dont know how to design the checker whether or not brands are missing. For the agent that actually works on building the prompts, i will paste more analysis on how the arduview run could have computed more brands. But i think that this analysis will just come back to quality of the bet brief. As in the pre research plan whether that was thorough enough or not. When creatives are evaluated, should they be evaluated together as part of one funnel? As in should we do the funnel packaging step before any analysis should be completed? What advantages would that give? For the light pass. Deep pass is still later as it is significantly more expensive. Another thing is that the line between a mechanism and a claim and a product feature is all blurry and often gets conflated. I think the reviewer gave examples. Please as a reviewer ask for outputs when you need them to understand how the prompt needs to be tweaked. Does anything that needs to be read and classified, do all agents that have this job of classifying anything get the cleanest version of that data without anything else it needs to read (html scaffolding, etc) in order to get the decision? We can use lots of cheap models to make sure everything is clean. Does agent #3 see the output of the agents before it in dump json or do we just go back to agent #3 reading raw data?? Also for differentiation i see that it says it needs an open transformation, idk what that means and probably needs clarification because we can use a proven transformation to a new niche that could use the same transformation, also i do NOT think that this light pass needs to determine winning angle at all. As in emotion leading the bet. We need a reinforced "mechanism" definition i believe. Some product features ARE mechanisms for the transformation and some are not. The definitions md is not perfect especially when interpretation is involved by an untrained agent.
→ Filed here for the opening: redefining the bet / the actual output of the pre-research hypothesis. The orchestration, splitting and context-hygiene parts are filed at D7; the mechanism/claim/feature conflation rides D3; "i do NOT think that this light pass needs to determine winning angle at all" is an independently actionable directive (§10). On the direct question "how are queries generated": as-ran, the Finder writes its own queries at run time — three lanes (major-DTC / crowdfunding / marketplace), 12+ varied queries per lane, seeded by the bet brief's territories and comparable-bet seed brands; the LP-hunt query set is a per-brand input to fetch.js. Query quality therefore traces straight to bet-brief quality, confirming this annotation's suspicion and D4's upstream position.

**P6** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 2 (anti-fluke floor), overrides cite

> this entire thing is designing what NTP should be dry tested and how to do it. Has nothing to do with sourcing.

**P19** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-3 OPERATOR NOTE 1 (transparency as lead bet)

> bet type applies here. Like, i know transparency itself may not be proven.but you need to ask, what transformation does transparency achieve, and have similar mechanisms worked for this same transformation to this same niche. But in roder to judge what a similar mechanism means, like its not the piece of tech feature itself. But the mechansim of action in how it gets achieved, thats the important part. For example. A fidget spinner on the back of a similarly useless but cool EDC device that has tons of validation, if you can test whether or not the transparent game is functionally doing the same job, and the mechanism is believable for the transformation, then the fact that we have the transparent screen is huge.  Like its the same as if we sell to this niche, the transformation of status, but instead of a transparent screen its likke a special digital camera or something. Is the product similar? Not really at all. But is the feature functionally achieving the same purpose as the trasnparency? Like maybe. In which case if theres a bunch of other brands with a mechanism that is different from ourselves physically but functionally they achieve the same thing with different features. like  for the status transformation, the mechanism of transparency wins because its an impressive piece of technology that people dont typically see. So the transformation moight be, stand out, por seem to ther people like you have unique niche hobbies or something. If theres another rare piece that achieves this same exact thing believably but the piece of hardware is physically different, thats actually one of the best signals because this mechanism type DOES work and we have a unique one. This is what i actually wanted to get to the bottom of for the pre research discussion / bet type and i this pre phase discussion is really its own thijgn.
→ "this pre phase discussion is really its own thijgn" — the operator himself promotes functional-mechanism-equivalence to a first-class pre-research design topic. This is the richest single statement of what bet-evidence transfer must test.

### Stage-decision annotations gated by D4

**A20** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 7 (bet type), RULE-SOUNDNESS survived paragraph, "Actions-Only Reality Filter" cite
*Referring to: The need to revise prompts with more DR knowledge, define bets clearly, verify bet fit, and ensure downstream sessions have the right inputs*

> a big job in this thing is to revise the prompts with more DR knowledge, and the reviewer's context and how they used it should be read through when referenced so the agent can decide what context to put in the prompt, because ive never heard of this before. And we need mechanical application of the rules for it. Like we need to discuss bets somewhere. How do we verify whether another company fits the bet that we are making? I also need there to be heavy analysis on what inputs the downstream marketer sessions should be given in order so that we can work through it, i think its likely the downstream sessions need to read outputs or some stuff that is in the project to do their jobs well. Like this agent just surfaced a shit ton of rules that are relevant to keep in mind for these decisions and the ones that werent being previously considered should be.
→ Also filed at D7 (downstream-session input analysis). Filed here for: "we need to discuss bets somewhere. How do we verify whether another company fits the bet that we are making?"

**A23** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 9 (comparable-bet-seed exclusion), HAZARD paragraph
*Referring to: Why the bet logic excludes certain brands from the cell, and whether validated comparable bets should inform funnel execution — plus the need to control NTP when transferring bet evidence*

> why did this ever happen? What is the design that excludes it? What i need to see what the bet logic actually is. What is the exclusion what is the cell, what is the cell used for? Funnel execution? Or are we just on space map. Because to build the funnel if someone has successfully done our bet. Thats validation and we should also study how that bet was executed. And bet needs to control for NTP to make sure that we arent say, selling to a different niche.

**A30** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 8 (spend-transfer check), DATA-SUFFICIENCY survived paragraph
*Referring to: Applying the spend-transfer logic with NTP controls — similar niche, transformation, and product category required; need to define what a niche category is*

> can we apply this logic of "similar NTP required, like similar niche, transformation and product category." I dont think i ever determined what a niche category even is.

**P8** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 2, degrading caveat (bet-evidence / spend-transfer)

> i highly agree that this must be considered when considering bet validity, does it match the NTP pair sikmailarly, and N, T, and P similarity must be evaluated separately, with their own criteria. Productsimilary for example, includes price, product type, etc

**P10** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 3 (differentiator), me-too kill paragraph

> the pre research discussion skill needs to be built on this basis how the product structurally can or cannot deliver certain things.

**A22** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 8, DATA-SUFFICIENCY FATAL violation paragraph, end of block
*Referring to: Whether the data sufficiency issue is a wiring/search problem or a query generation problem going all the way back to how competitor brands are identified*

> data sufficiency may either be a wiring thing, like searches coming up null, or it might be a thing about whether or not the agent that starts searching for data is even asking for the right things, all the way back to when we generate queries for the web to actually search for the competitors in the first place, as in what brands are we even trying to look for in here.
→ Doubles as a diagnostic runnable now (§10): the wiring-vs-query-generation question has a concrete starting point — the reviewers found `demand_trend` absent from the delivered space-map even though the prompt mandates carrying it.

**P1** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Collection Diagnosis, DECISION 9 (comparable-bet-seed exclusion), rule-soundness paragraph

> yes, make sure the bets are calibrated to control for niche and transformation. So like a bet that works for one niche cannot be determined to reach for another. We also need someone to figure out how to actually determine niche. How to determine who theyre selling to. This could be through copy identigfiers where the marketer tries to relate to the viewer, identifiers (adhd), the people in their marketing, what their marketing looks like (you can just look at ka chava branding and understand its almond mom girly vs huel which is optimizer biohacker.) like i said before, there needs to be careful consideration for classification, like what evidence is fed into classification to ensure that we are finding the right thing. And how do we make sure that each signal is read nad ocnsidered, instead of telling an agent ,look at the page and determine the niche. And this will be true for ALL classification steps. Trends, angles. Niche. Trasnformation. Mechanism. Belief. We need to audit the basis on which things are being defined and what inputs are needed to define it instead of letting an agent see the definition and then just decide on vibes. I dont think one definition is truly enough. It also mght be true that this introcues a bunch of other distinct new jobs that weren tin the system befotrre.
→ Filed here for the opening sentence (bets calibrated to control for niche and transformation); the classification-audit body is the primary filing at D3.

**P9** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 2, data-sufficiency violation end (malformed tag)

> we must run an investigation on the prompts to see what is actually causing such insufficient data. Is it search volume, like or writing the outputs down and ensuring output.

---

## 6. D5 — Validation-currency model

**The decision to be made.** Enumerate every validation currency that exists; define per-currency validation mechanics and thresholds; spec how angle-level and funnel-component-level validation works; decide what can and cannot be aggregated numerically and write the resulting aggregation + I/O contracts; unify crowdfunding vs DTC treatment (including the deposit-funnel's value and the crowdfunding trust-skew); place community heat as an independent demand axis; and set revenue's weight in market comparison.

**Status.** Open. This is what the earlier roadmap called "validation-economics reasoning," but the annotations make it bigger: a full currency model with contracts, consuming D4 (bet evidence as a currency with NTP controls) and D1 (VOC as a currency).

**What resolving it unblocks or deletes.** The market-selection demand gates rewrite, the `scored.json` / `validation_strength` / angle-audit contracts (including the SA-1 failure the reviewers found, where unknown-lane funnels were treated as proven), and the funnel architect's authority model inputs.

### System-shape annotations

**A32** — `annotations--arduview-pipeline.md` · PHASE 2 — VERDICT, bottom of the "single weakest join" paragraph / validation currencies discussion
*Referring to: The need to enumerate all validation currencies, define how angle validation works numerically or structurally, and think through aggregation and IO contracts*

> we need to first find all of the validation currencies that exist (web traffic, ad amounts, estimated AOV, press, verified social proof (google or amazon) etc, people in VOC talking about it, trend signal. In addition, there needs to be significant speccing regarding how angle validation or specific funnel components are validated. An example of this would be, if a small brand is running only one angle and its all of their 30 ads, that angle probably rips. Also, if one type of angle or type of social proof is consistent across multiple funnels that are validated, good. If one consistently comes up as null, bad. Idk if angle type can be aggregated numerically. I dont think so. Which has implication for aggregation and IO contracts.

**A43** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: funnel architect
*Referring to: Light knowledge on funnel architecture; inputs needed; whether to split into agents; how awareness level is determined (competitor funnels vs VOC); who analyzes awareness; whether crowdfunding should be treated separately from DTC; granularity of belief analysis for funnel architect; and whether a funnel auditor should follow the funnel builder*

> my actual knowledge on funnel architecture is light. 1, i need to make sure this thing has tapped inputs / all the inputs it would need to do its job well. 2, is this worth splitting up into agents, probably not. For determining awareness, of what awareness level to sell to, this likely comes from other competitor's funnels. But maybe should come from VOC. i dont know. For forum marketing i think awareness level can be derived from VOC. also, who analyzes awareness? Is that its own agent? The reason i ask is because the funnel deep pass seems quite mechanical. I dont know. I think it is fitting to have awareness analyzed in funnel deep pass but idk if it is. Also i think the currencies are good but it treats crowdfunding as something entirely separate as direct response or direct to consumer which is bad. I think the most valuable funnel we have is a deposit funnel that makes a similar bet to us. I need to understand how granular the belief analysis in section analyzer needs to be in order for funnel architect to do its job correctly. Do you think a funnel auditor should go after the funnel builder? Happy to split these jobs into more parts.
→ Filed here for: "i think the currencies are good but it treats crowdfunding as something entirely separate as direct response or direct to consumer which is bad. I think the most valuable funnel we have is a deposit funnel that makes a similar bet to us." The awareness and topology parts are at D6 and D7.

### Stage-decision annotations gated by D5

**A1** — `annotations--arduview-pipeline.md` · HANDOFF 1 — space-map.json → market-selection.md, under first GROUNDED claim
*Referring to: The grounded claim about `demand_trend.shape == "unknown"` for all 20 brands*

> are my prompts extremely specific on demand currencies that are at my disposal to use, based on the knowledge in the dr files that name specific currencies?

**A26** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S1, first bullet (proven market demand)
*Referring to: How proven market demand is mechanically determined — supply side and demand side*

> mechanically, how do we determine what proven market demand even means, and for what. Demand that this niche wants this transformation? And how is that determined on supply side, and is that also fed by demand side as another currency rather than attempting to manufacture new demand…
→ Also filed at D1 and D3.

**A27** — `annotations--arduview-pipeline.md` · PHASE 0 — THE STANDARD, S2 (durability of demand), Google Trends cite
*Referring to: The need to define mechanics for trend and demand determination*

> yes we need trend determination or demand determination mechanics defined.
→ Also filed at D3; the trend lane's mechanics are specced there, its currency weight here.

**A40** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: market selection
*Referring to: Market selector should not see COGS or decide profitability — only determine what price is conditioned into the market. Prompts should not receive information they don't need. Community heat is an independent demand axis, not dependent on low competitor spend.*

> the market selector should not see COGS or make any decision, it should just understand what price is conditioned into this market for similar product categories selling the same transformation to the same niche. I will just decide whether or not this thing is profitable / anything that is deferred to other steps these prompts do not need to know. The prompts should not be given information it doesnt need to know. I dont think community heat is calculated dependently on low competitor spend, it is just another axis of demand validation that should be present before moving.
→ Filed here for the community-heat sentence (an independent demand axis, not derived from low competitor spend). The COGS directive is independently actionable (§10); the information-hygiene principle is filed at D7.

**P4** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 1, disclosure-violation paragraph (community-heat flag list)

> community heat is information from a different source, that may be feeding this stage, and probably should.

**P7** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 2, $300-500K floor paragraph

> the mechanical floor doesnt have to kill candidates, but revenue must absolutelyt be heavily considered against other alternatives for markets at this stage.

**P14** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, ROUTER R-2 (structure is transformation-independent)

> yes but it must not be just assumed that all crowdfunders exist on one awarnesslevel and this needs or should be verified by other validated brands’ funnels, aggregated.
→ Also filed at D6: aggregation across validated funnels is both an awareness-evidence rule and a currency-model rule.

**P16** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-1 (three-layer authority model)

> is the goal to NEVER merge, what does that even mean.  I am just fearing whether or not slapping messaging on top of crowdfunding structure is proven. I guess if its matched to awareness levels i get it. But i dont know, i want to challenge this a bit
→ A marketing-truth challenge the operator wants to run at the architect's never-merge rule. The audit-quoted law supports "don't merge non-comparable evidence" as stated, but whether awareness-matched messaging-on-structure counts as proven is exactly the open question; take it to the D5 session with the KB in hand. [Grounded only in audit-quoted law.]

**P22** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-5 (trust pillar = founder section alone)

> its tough, i dont have any of these. Plus, its worth noting that crowdfunding skews the trust of what needs to be trusted (will this work vs will they ship

### Field-level annotations gated by D5

**P15** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, SECTION ANALYZER SA-1 (descriptive-not-prescriptive)

> i wonder if this read the agent output that investigated per brand validation signal during the funnel run.
→ Also a diagnostic runnable now (§10).

---

## 7. D6 — Awareness: producer, placement, evidence, contract

**The decision to be made.** Confirm and contract what the operator has already directed — awareness is determined **per-funnel**, in the **funnel deep pass**, and **consumed by the funnel architect** — then decide what evidence determines it (competitor funnel structure, VOC, aggregation across validated funnels), whether it warrants its own agent, and the field contract that makes the run's failure impossible (values invented at the belief layer while Gate 4 was deferred upstream; the architect reading a null/contradicted field).

**Status.** Direction settled by the operator (A3, A4). Evidence sources and topology open (A43, P14). Note from the as-ran files: the deep-pass skill *already* emits `awareness_entry` per funnel, read off problem-education load — so the operator's relocation matches what the skill claims to do; what failed in the run was contract enforcement and evidence basis, not stage placement.

### Settled directives (operator judgment, recorded)

**A3** — `annotations--arduview-pipeline.md` · HANDOFF 2 — market-selection.md → deep-pass store, under NAKED / degrading, `awareness_entry` values bullet
*Referring to: The finding that `awareness_entry` was assigned in the belief stores despite Gate 4 being explicitly deferred upstream in market-selection*

> we need to update, awareness is determined per-funnel, which has to happen in funnel deep pass.

**A4** — `annotations--arduview-pipeline.md` · FATAL vs DEGRADING — ranked, DEGRADING section, third bullet
*Referring to: The degrading flag on `awareness_entry` being assigned in belief stores despite Gate 4 deferral upstream (same issue as Annotation 3, surfaced again in the ranked summary)*

> ok so awareness is supposed to happen during funnel deep pass and be used by the funnel architect.

### Stage-decision annotations gated by D6

**A43** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: funnel architect
*Referring to: Light knowledge on funnel architecture; inputs needed; whether to split into agents; how awareness level is determined (competitor funnels vs VOC); who analyzes awareness; whether crowdfunding should be treated separately from DTC; granularity of belief analysis for funnel architect; and whether a funnel auditor should follow the funnel builder*

> my actual knowledge on funnel architecture is light. 1, i need to make sure this thing has tapped inputs / all the inputs it would need to do its job well. 2, is this worth splitting up into agents, probably not. For determining awareness, of what awareness level to sell to, this likely comes from other competitor's funnels. But maybe should come from VOC. i dont know. For forum marketing i think awareness level can be derived from VOC. also, who analyzes awareness? Is that its own agent? The reason i ask is because the funnel deep pass seems quite mechanical. I dont know. I think it is fitting to have awareness analyzed in funnel deep pass but idk if it is. Also i think the currencies are good but it treats crowdfunding as something entirely separate as direct response or direct to consumer which is bad. I think the most valuable funnel we have is a deposit funnel that makes a similar bet to us. I need to understand how granular the belief analysis in section analyzer needs to be in order for funnel architect to do its job correctly. Do you think a funnel auditor should go after the funnel builder? Happy to split these jobs into more parts.
→ Filed here for the awareness questions: which evidence (competitor funnels vs VOC), who analyzes it, whether it is its own agent. Topology disposition goes to D7/Phase 3; evidence rule lands here.

**P14** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, ROUTER R-2 (structure is transformation-independent)

> yes but it must not be just assumed that all crowdfunders exist on one awarnesslevel and this needs or should be verified by other validated brands’ funnels, aggregated.

### Field-level annotations gated by D6

**A42** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: section analyzer
*Referring to: Concerns about DR knowledge allocation to the section analyzer prompt, potential lossiness in belief install analysis, verbatim extraction as a solution, and awareness level analysis*

> I need to make sure that an agent understands the DR knowledge files that is given to whatever prompt its given to improve, relative to the other DR knowledge. I dont know whether these prompts are being given DR info it doesnt need, or omitted DR info it DOES need, or is given info that an LLM would have a hard time actually using / if it is too much up to interpretation and could go any way. Also, im a little concerned this step is lossy because i dont know if it analyzes how the belief is installed correctly. We would fix this problem if everything was extracted verbatim for the section and the belief so it tags the belief and then the execution of that belief install was verbatim but idk if thats too much for funnel architect to handle. Id like some advice on that. I don't know whether awareness level is analyzed here. This prompt seems mechanical.
→ Filed here for "I don't know whether awareness level is analyzed here." Factual answer from the as-ran skill: yes — the section analyzer assigns `awareness_entry` per funnel from problem-education load. The DR-allocation and verbatim-extraction parts of this annotation are filed at D7.

---

## 8. D7 — Agent topology, knowledge scoping & orchestration

**The decision to be made.** Decide (a) **which agents exist** — the named splits the annotations demand, versus the wholesale micro-agent conversion the operator floats but defers; (b) **what knowledge each agent consumes and in what form** — rules rendered as mechanical tests placed next to the work, theory placed as disposition (system-prompt-like), each agent given only what its decision needs, on the cleanest possible input; and (c) **how the pipeline actually runs** — deterministic orchestration, one command with declared inputs, scripts between agent calls.

**Status.** Open. This is the presentation half of KB mechanization (D3 is the test-content half) plus the splitting hypothesis. The split verdict from the annotations: **supported at named seams** — slop-checker vs brand-missing checker (A39), copy chief (A35, filed at D8), possibly an awareness analyzer (A43), possibly a line-reader (P17, offered as "not saying we should") — and **not supported as a global conversion**: the operator doubts splitting the architect ("probably not", A43), and A36 defers the mega-build behind a VOC MVP. Per the handoff, this session records the gating; the actual topology recommendation is Phase 3's job, and the knowledge-scoping spec produced there is what the downstream coding pass mechanizes.

**What resolving it unblocks or deletes.** Every prompt revision (each needs its knowledge scope decided first), the orchestration build, the input-cleaning layer, and the per-agent context contracts A20 demands.

### System-shape annotations

**A36** — `annotations--arduview-pipeline.md` · Context receipt / end of the funnel diagnosis doc, second annotation block
*Referring to: The idea of splitting prompts extremely granularly — one agent per DR file / DR principle — and rethinking how DR knowledge gets used across the system; also the question of whether Claude Opus ultracode could fold the entire DR knowledge base into mechanical agent-parsable rules*

> a lot of this funnel architect, but really all of the prompts, we might want to split them extremely granularly. Like, one thing writes hooks by reading the hook writing property, and system goes by hormozi's write 100 hooks, 3 bodies, 1 cta or whatever the rule is, and then that is actually how ads get made. I think a question we wanna ask for the broad prompt engineering / deciding what prompts get made is, is there a DR file for something, and can that be its own agent? Like theres SO much that goes into say, offer construction. What information should that agent consume to build that? What are the research inputs, (Data) and then decision algorithm? Like we should read the titles of the DR files and ask whether or not it deserves its own agent. Like genuinely at the granular enough level, ingesting funnel deep pass and then architecting the funnel and writing the copy could be like 20 different separate jobs. Im also starting to reconsider how the DR knowledge actually gets used in this project. Theres a lot of theory, and theres a lot of rules. And each rule might want to be fleshed out into mechanical application or each definition might want a mechanical full test of how to determine it, and theory, and then the exact rules and only the rules that each agent needs to consume and the theory get injected into it, but in an agent parsable way. Broader theory should be separated in the prompt from exact rules at least in location, where theory is something of how it thinks, think a system prompt, while rules get broken down into mechanical tests that the agent must perform in order to determine the definition and the rule adherence. This would be a ridiculously massive job though. I wonder what claude opus ultracode xhigh + workflows could do for me here to get the necessary DR knowledge into each step. It might be the case where its infinitely more useful to do a lot of other things before i touch that build, too, like get a VOC system MVP down first. But this should be kept in mind. At the same time, i wouldn't totally doubt that if we built the full agent spectrum of all the micro agents, that claude ultracode would be incapable of reading the DR files, taking the rules and making it super mechanical while giving it all the theory and deduping anything that is repeated so that its not a dr knowledge base like the entire knowledge base gets folded into the agents with the exact information they need presented in a way where an agent cant really get it wrong.

**A39** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: light pass, large annotation block
*Referring to: A wide range of system design questions: redefining the bet / hypothesis output, orchestration design, query generation from starting inputs, slop checker vs brand-missing checker as separate agents, funnel packaging before analysis, mechanism/claim/feature conflation, DR knowledge injection, agent context cleanliness, and the light pass vs deep pass scope*

> We need to redefine what the bet is / what the actual output of the hypothesis done in pre-research is. Also i dont know how this is orchestrated / if it is orchestrated correctly at all. As in, is the orchestrator literally just running all the agent prompts itself? What about the scripts that it is told to run, is there anyway to reinforce this as a workflow that deterministically runs or no. like a series of claude p calls with scripts in between, how should this work. I would like to run just one command and give the inputs that the command needs. I would not trust the strength of this here. We can override system design for sure. Can you (the agent reading this) tell me specifically how queries are generated based on starting inputs? We should go back to my notes on how the bets are made back in my annotations of the review. I think in theory this finder is good but again like my other annotations may need to be more structurally mechanical to leave less interpretation up to the agent. Ok for 1.5, i think the slop checker and the reviewer to see if there are brands missing should be separate agents. But i dont know how to design the checker whether or not brands are missing. For the agent that actually works on building the prompts, i will paste more analysis on how the arduview run could have computed more brands. But i think that this analysis will just come back to quality of the bet brief. As in the pre research plan whether that was thorough enough or not. When creatives are evaluated, should they be evaluated together as part of one funnel? As in should we do the funnel packaging step before any analysis should be completed? What advantages would that give? For the light pass. Deep pass is still later as it is significantly more expensive. Another thing is that the line between a mechanism and a claim and a product feature is all blurry and often gets conflated. I think the reviewer gave examples. Please as a reviewer ask for outputs when you need them to understand how the prompt needs to be tweaked. Does anything that needs to be read and classified, do all agents that have this job of classifying anything get the cleanest version of that data without anything else it needs to read (html scaffolding, etc) in order to get the decision? We can use lots of cheap models to make sure everything is clean. Does agent #3 see the output of the agents before it in dump json or do we just go back to agent #3 reading raw data?? Also for differentiation i see that it says it needs an open transformation, idk what that means and probably needs clarification because we can use a proven transformation to a new niche that could use the same transformation, also i do NOT think that this light pass needs to determine winning angle at all. As in emotion leading the bet. We need a reinforced "mechanism" definition i believe. Some product features ARE mechanisms for the transformation and some are not. The definitions md is not perfect especially when interpretation is involved by an untrained agent.
→ Filed here for: the orchestration questions (is the orchestrator just running prompts itself; deterministic workflow; "I would like to run just one command"), the slop-checker/brand-missing split, funnel packaging before analysis, clean-data-for-classifiers ("Does anything that needs to be read and classified... get the cleanest version of that data"), and agent context hygiene. The bet parts are at D4.

**A40** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: market selection
*Referring to: Market selector should not see COGS or decide profitability — only determine what price is conditioned into the market. Prompts should not receive information they don't need. Community heat is an independent demand axis, not dependent on low competitor spend.*

> the market selector should not see COGS or make any decision, it should just understand what price is conditioned into this market for similar product categories selling the same transformation to the same niche. I will just decide whether or not this thing is profitable / anything that is deferred to other steps these prompts do not need to know. The prompts should not be given information it doesnt need to know. I dont think community heat is calculated dependently on low competitor spend, it is just another axis of demand validation that should be present before moving.
→ Filed here for the information-hygiene principle: "The prompts should not be given information it doesnt need to know." This is a contract rule for every seam in the spine.

### Stage-decision annotations gated by D7

**A20** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 7 (bet type), RULE-SOUNDNESS survived paragraph, "Actions-Only Reality Filter" cite
*Referring to: The need to revise prompts with more DR knowledge, define bets clearly, verify bet fit, and ensure downstream sessions have the right inputs*

> a big job in this thing is to revise the prompts with more DR knowledge, and the reviewer's context and how they used it should be read through when referenced so the agent can decide what context to put in the prompt, because ive never heard of this before. And we need mechanical application of the rules for it. Like we need to discuss bets somewhere. How do we verify whether another company fits the bet that we are making? I also need there to be heavy analysis on what inputs the downstream marketer sessions should be given in order so that we can work through it, i think its likely the downstream sessions need to read outputs or some stuff that is in the project to do their jobs well. Like this agent just surfaced a shit ton of rules that are relevant to keep in mind for these decisions and the ones that werent being previously considered should be.
→ Filed here for: reading the reviewer's context-usage to decide what context goes in each prompt, and the "heavy analysis on what inputs the downstream marketer sessions should be given," including downstream sessions reading run outputs.

**A16** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 6 (mechanism ownability), RULE-SOUNDNESS violation, "Mechanism ≠ UM" cite
*Referring to: The definition of mechanism and how it differs from product features, and the need for a believability gate*

> i think this definition is old, i think mechanism is the pathway in which your product achieves the transformation, which must pass a believability gate before we use a mechanism. So a big screen, if it does not actually plausibly deliver the transformation then its a product feature. But the feature might contribute to the transformation. This might need to be discussed, with output examples so we can go down the list and classify. We might need to have some of these downstream analyzers ALSO read outputs and work through them with me. Not fully sure.
→ Filed here for: "We might need to have some of these downstream analyzers ALSO read outputs and work through them with me. Not fully sure." — an operator-in-the-loop topology option. The mechanism-test content is the primary filing at D3.

**A42** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: section analyzer
*Referring to: Concerns about DR knowledge allocation to the section analyzer prompt, potential lossiness in belief install analysis, verbatim extraction as a solution, and awareness level analysis*

> I need to make sure that an agent understands the DR knowledge files that is given to whatever prompt its given to improve, relative to the other DR knowledge. I dont know whether these prompts are being given DR info it doesnt need, or omitted DR info it DOES need, or is given info that an LLM would have a hard time actually using / if it is too much up to interpretation and could go any way. Also, im a little concerned this step is lossy because i dont know if it analyzes how the belief is installed correctly. We would fix this problem if everything was extracted verbatim for the section and the belief so it tags the belief and then the execution of that belief install was verbatim but idk if thats too much for funnel architect to handle. Id like some advice on that. I don't know whether awareness level is analyzed here. This prompt seems mechanical.
→ Filed here for: per-prompt DR allocation (given info it doesn't need? omitted info it does? info an LLM can't actually use?), and the verbatim-extraction lossiness question with its explicit request for advice ("Id like some advice on that" — answered in Phase 3 when the architect's input granularity is designed; A37's classify-each-idea filing at D3 is the same thread).

**A43** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: funnel architect
*Referring to: Light knowledge on funnel architecture; inputs needed; whether to split into agents; how awareness level is determined (competitor funnels vs VOC); who analyzes awareness; whether crowdfunding should be treated separately from DTC; granularity of belief analysis for funnel architect; and whether a funnel auditor should follow the funnel builder*

> my actual knowledge on funnel architecture is light. 1, i need to make sure this thing has tapped inputs / all the inputs it would need to do its job well. 2, is this worth splitting up into agents, probably not. For determining awareness, of what awareness level to sell to, this likely comes from other competitor's funnels. But maybe should come from VOC. i dont know. For forum marketing i think awareness level can be derived from VOC. also, who analyzes awareness? Is that its own agent? The reason i ask is because the funnel deep pass seems quite mechanical. I dont know. I think it is fitting to have awareness analyzed in funnel deep pass but idk if it is. Also i think the currencies are good but it treats crowdfunding as something entirely separate as direct response or direct to consumer which is bad. I think the most valuable funnel we have is a deposit funnel that makes a similar bet to us. I need to understand how granular the belief analysis in section analyzer needs to be in order for funnel architect to do its job correctly. Do you think a funnel auditor should go after the funnel builder? Happy to split these jobs into more parts.
→ Filed here for: "is this worth splitting up into agents, probably not", "Do you think a funnel auditor should go after the funnel builder? Happy to split these jobs into more parts."

**P17** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, FA-3 (one-driver-per-piece / curiosity)

> a few things. curiosity is the type of emotion. Angle is the emotion. This is valid. What are they curious about, like what is the information they wanna know, and what is the motivation for why they would like to learn more? Of course you cannot just derive all agnes as core drivers. Curiosity is honestly more of just a copywriting principle of getting the customer to want to read more. This is why i want a through application of rules and get specific. Like an untrained agent reads a piece of copy and asks, does this invite curious? Do i want to read more?” and does it line by line. Like not saying we should, but that literally could be its own singular agent in of itself. The do i want to read th next line after reading a line checker.
→ Filed here for the possible line-checker agent ("that literally could be its own singular agent in of itself").

**A34** — `annotations--arduview-pipeline.md` · PHASE 0 — S-1, after the "greased slide copywriting principle" reference
*Referring to: The need for better mechanical tests — e.g., an agent reads copy and predicts what a regular user would think next, then that gets sent back to the copywriter*

> for example, greased slide copywriting principle. Yes it makes sense in theory, but there are better tests than this. Like maybe an agent reads one piece of copy, then tries to predict or decide the most logical thing a regular user would be thinking, and then that gets sent to the copywriter who wrote the first copy draft. This is true across the entire thing and when writing each prompt this question must be asked across any step of the way.
→ Filed here for the loop topology it implies (a reader-agent predicting the next thought, output routed back to the writer). Test content at D3, copy-chief instantiation at D8.

### Field-level annotations gated by D7

**A41** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: router
*Referring to: How funnels are packaged and classified — one LP and one PDP per funnel, verified by following links from ad to LP to PDP within the same brand*

> How are funnels packaged and classified? A funnel should only have 1 LP and 1 PDP, and you need to see where the links lead in order to verify whether the funnel is the same so ad to lp to pdp path is one path, if u want u can verify, as long as they come from the same brand though thats really all u need, i dont really understand how the funnels are packaged as of rn.
→ Factual answer from the as-ran tooling: packaging is deterministic — `funnel-assemble.js` clusters ads to LPs by normalized destination URL and emits one funnel package per ad cluster; the deep-pass skill hard-fails if packages are missing. The 1-LP+1-PDP rule and the follow-the-links/same-brand verification this annotation demands are a contract change to write into the spine (PART 2, Job 5).

---

## 9. D8 — Copywriter + copy chief: the absent stage, built to spec

**The decision to be made.** Build the copywriter against its admitted spec (`15-SPEC-copywriter.md`) and decide the **copy-chiefing pipeline** the annotations add on top: a per-line does-it-do-something / belief-install believability test, the greased-slide next-thought prediction loop feeding back to the copywriter, and the readability gate as a mechanical test.

**Status.** Per the handoff: the copywriter never properly built, so these annotations tier as **gated on a build decision**, not as fixes to an existing stage. Gates stacked on the build: (1) the architect's output as a real, locked artifact (the spec's primary input); (2) the VOC copy bank (the spec's RAG input — the run conceded "NO VOC corpus exists", so this build is blocked by D1); (3) D3's mechanical-test pattern for the chief's checks. The spec already carries greased-slide flow, grade-6/7 readability, and blocked-ports rules as prose guidance; what it does **not** contain is the chief as a separate testing agent with a feedback loop — that is new topology from A35/A34, and the recommendation belongs to Phase 3.

### System-shape annotations

**A35** — `annotations--arduview-pipeline.md` · Context receipt / end of the funnel diagnosis doc, after BOTTOM LINE
*Referring to: The need for a copy chiefing agent that tests each line for belief installation and readability, and runs the greased slide test*

> additional notes: we need a copy chiefing agent that reads the copy and tests whether or not each line does something, if its believable for installing the belief… for example, "i will ship this by aug 30" in the page does not successfully install the belief of "will they ship?" as well as the greased slide test of it trying to predict the next phase as a dumb consumer, this is an entire build spec in of itself for the copy pipeline. Or the 6 to 7th grade reading level. Like thats a test of can i understand exactly what this says near telepathically, without having to think whatsoever, or is this the simplest most understandable to the youngest person version of this statement.

### Stage-decision annotations gated by D8

**A34** — `annotations--arduview-pipeline.md` · PHASE 0 — S-1, after the "greased slide copywriting principle" reference
*Referring to: The need for better mechanical tests — e.g., an agent reads copy and predicts what a regular user would think next, then that gets sent back to the copywriter*

> for example, greased slide copywriting principle. Yes it makes sense in theory, but there are better tests than this. Like maybe an agent reads one piece of copy, then tries to predict or decide the most logical thing a regular user would be thinking, and then that gets sent to the copywriter who wrote the first copy draft. This is true across the entire thing and when writing each prompt this question must be asked across any step of the way.

**P13** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, S-5 (sell outcomes, not features)

> yes with a caveat for whether or not the niche, at the awareness level, cares about the features. A customer who cares about dosing o the supplement because they know the outcome the supplement gets, should probably be presented the dose.  Well, maybe not, i was thinking about sleeping pills or uh sickness or allergy mecdecine and why a very dominant angle is “maximum strength.” emotionally , its not really a product feature but more of a maximally avoid pain and make no other tradeoffs which i guess is piece of mind i dont really know. And then 10g melatonin, yes thats a product feature, but thats a well understood mechanism by the buyer for achieving the transformation of falling asleep. So they are selling the outcome. This is different than naming specs that dont matter. This logic should probably be discussed and turned into a test of how to actually reason through selling the features of aproduct as in they need to be mechanisms for the transfomraiton and the mechanism needs to be  believable or understood by the customer (melatonin dose \= sleep)
→ Filed here for the copy-reasoning test it asks for (when feature-forward copy IS outcome-selling); the underlying mechanism-believability test is at D3.

---

## 10. Residual — genuinely independent items

**Settled directives, actionable without any boulder.**

**A29** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 6 (price conditioning / economics), DATA-SUFFICIENCY violation paragraph, end of annotation block in the doc
*Referring to: Removing COGS from the equation — just determine correct price, and kill the test if it's not profitable*

> we should delete the COGS equation. we should determine correct price only. If i cannot profitably run that price, i kill the test.

**A40** — `annotations--arduview-pipeline.md` · PROMPT FEEDBACK: market selection
*Referring to: Market selector should not see COGS or decide profitability — only determine what price is conditioned into the market. Prompts should not receive information they don't need. Community heat is an independent demand axis, not dependent on low competitor spend.*

> the market selector should not see COGS or make any decision, it should just understand what price is conditioned into this market for similar product categories selling the same transformation to the same niche. I will just decide whether or not this thing is profitable / anything that is deferred to other steps these prompts do not need to know. The prompts should not be given information it doesnt need to know. I dont think community heat is calculated dependently on low competitor spend, it is just another axis of demand validation that should be present before moving.
→ The COGS sentence is the settled directive: market selection determines the conditioned price only; the operator decides profitability. P3 (below) bounds the project's scope the same way. (A40's community-heat sentence is filed at D5; its information-hygiene sentence at D7.)

**P3** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 1, dry-test/commitment conditions sentence

> yes these are only market tests im running, it is not the job of this project to worry about moq an dfulfillment

- From A39 (filed at D4/D7): **"i do NOT think that this light pass needs to determine winning angle at all."** — independently actionable scope cut on the light pass.
- From A3/A4 (filed at D6): the basic contract fix — deep pass officially produces awareness; nothing downstream invents it — is actionable now even though the evidence rule lands with D6.

**Closed, no action.**

**A2** — `annotations--arduview-pipeline.md` · HANDOFF 1 — space-map.json → market-selection.md, under Arduview product facts bullet (end of NAKED section)
*Referring to: The flag that Arduview spec facts (~50g, OLED, battery, games, ATmega32U4) are external injections not licensed by the space-map*

> this is real dw
→ Operator confirms the externally-injected Arduview product facts are fine; closes the reviewer's flag.

**Diagnostics runnable now (no upstream decision needed; results feed the decision sessions).**

- **A24** — `annotations--arduview-pipeline.md` · PHASE 2 — PROSECUTING THE COMPOSITION, second weakest join paragraph, "novelty-object-own" as run_transformation
*Referring to: What caused the transformation classification to go wrong*

> i wonder what caused this classification to go south like this.
- **A22** — `annotations--arduview-pipeline.md` · PHASE 1 — DECISION 8, DATA-SUFFICIENCY FATAL violation paragraph, end of block
*Referring to: Whether the data sufficiency issue is a wiring/search problem or a query generation problem going all the way back to how competitor brands are identified*

> data sufficiency may either be a wiring thing, like searches coming up null, or it might be a thing about whether or not the agent that starts searching for data is even asking for the right things, all the way back to when we generate queries for the web to actually search for the competitors in the first place, as in what brands are we even trying to look for in here.
- **P9** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — Market Segment Diagnosis, DECISION 2, data-sufficiency violation end (malformed tag)

> we must run an investigation on the prompts to see what is actually causing such insufficient data. Is it search volume, like or writing the outputs down and ensuring output.
- **P15** — `PMF annotated prompts and reviews.md` (present only in this doc) · Reviewer A — A-Funnel Diagnosis, SECTION ANALYZER SA-1 (descriptive-not-prescriptive)

> i wonder if this read the agent output that investigated per brand validation signal during the funnel run.
- From A39: document what the orchestration actually did in the Arduview run (what ran what, where scripts fired) — input to D7.
- From A41: verify the packaging answer above against the run's actual funnel packages — input to the spine contract.

---

## 11. Appendix — annotation registry index

Every operator annotation, its source, and where it is filed in this map. A-numbers: standalone doc (canonical text; most also appear inside the combined doc and are marked ✦). P-numbers: present only in the combined doc.

| ID | Source | Operator's location tag | Filed under |
|---|---|---|---|
| A1 | standalone ✦ | HANDOFF 1 — space-map.json → market-selection.md, under first GROUNDED claim | D5 |
| A2 | standalone ✦ | HANDOFF 1 — space-map.json → market-selection.md, under Arduview product facts bullet (end of NAKED section) | §10 closed |
| A3 | standalone ✦ | HANDOFF 2 — market-selection.md → deep-pass store, under NAKED / degrading, `awareness_entry` values bullet | D6 |
| A4 | standalone ✦ | FATAL vs DEGRADING — ranked, DEGRADING section, third bullet | D6 |
| A5 | standalone ✦ | PHASE 0 — THE STANDARD, S1, first bullet (transformation definition) | D2 |
| A6 | standalone ✦ | PHASE 0 — THE STANDARD, S1, after the STANDARD line | D1 |
| A7 | standalone ✦ | PHASE 0 — THE STANDARD, S5 (demand durability / fad-death) | D3 |
| A8 | standalone ✦ | PHASE 0 — THE STANDARD, S6 (niche and market definition), venue test sentence | D3 |
| A9 | standalone ✦ | PHASE 0 — THE STANDARD, S7 (saturation must never be pooled) | D3 |
| A10 | standalone ✦ | PHASE 0 — THE STANDARD, S8 (operator-note standard / missing VOC tradeoff), "true transformation is VOC-found" cite | D2 |
| A11 | standalone ✦ | PHASE 0 — THE STANDARD, S8, Hexclad/Ridge "desire-first" cite | D1, D3 |
| A12 | standalone ✦ | PHASE 1 — DECISION 1 (transformation stamped from competitor claims, VOC deferred), end of the decision block | D1 |
| A13 | standalone ✦ | PHASE 1 — DECISION 2 (novelty-object-own as a "transformation"), RULE-SOUNDNESS violation paragraph | D2 |
| A14 | standalone ✦ | PHASE 1 — DECISION 3 (edc-aesthetic-collectors as a "niche"), RULE-SOUNDNESS paragraph, venue test sentence | D3 |
| A15 | standalone ✦ | PHASE 1 — DECISION 3, DATA-SUFFICIENCY violation, end of block | D1, D3 |
| A16 | standalone ✦ | PHASE 1 — DECISION 6 (mechanism ownability), RULE-SOUNDNESS violation, "Mechanism ≠ UM" cite | D3, D7 |
| A17 | standalone ✦ | PHASE 1 — DECISION 6, within the mechanism clustering discussion, "Long battery life" / "Premium high-density display" examples | D3 |
| A18 | standalone ✦ | PHASE 1 — DECISION 6, after the "UM is how a product is positioned around it" sentence | D3 |
| A19 | standalone ✦ | PHASE 1 — DECISION 6, DATA-SUFFICIENCY survived paragraph | D3 |
| A20 | standalone ✦ | PHASE 1 — DECISION 7 (bet type), RULE-SOUNDNESS survived paragraph, "Actions-Only Reality Filter" cite | D4, D7 |
| A21 | standalone ✦ | PHASE 1 — DECISION 8 (demand trend / fad-death durability), RULE-SOUNDNESS survived paragraph | D3 |
| A22 | standalone ✦ | PHASE 1 — DECISION 8, DATA-SUFFICIENCY FATAL violation paragraph, end of block | D4, §10 diag |
| A23 | standalone ✦ | PHASE 1 — DECISION 9 (comparable-bet-seed exclusion), HAZARD paragraph | D4 |
| A24 | standalone ✦ | PHASE 2 — PROSECUTING THE COMPOSITION, second weakest join paragraph, "novelty-object-own" as run_transformation | D2, §10 diag |
| A25 | standalone ✦ | PHASE 2, same paragraph, end — discussion of spend proving transformation and the real problem being misclassification | D2, D3 |
| A26 | standalone ✦ | PHASE 0 — THE STANDARD, S1, first bullet (proven market demand) | D1, D3, D5 |
| A27 | standalone ✦ | PHASE 0 — THE STANDARD, S2 (durability of demand), Google Trends cite | D3, D5 |
| A28 | standalone ✦ | PHASE 0 — THE STANDARD, S3 (differentiator required), header line | D3 |
| A29 | standalone ✦ | PHASE 1 — DECISION 6 (price conditioning / economics), DATA-SUFFICIENCY violation paragraph, end of annotation block in the doc | §10 settled |
| A30 | standalone ✦ | PHASE 1 — DECISION 8 (spend-transfer check), DATA-SUFFICIENCY survived paragraph | D3, D4 |
| A31 | standalone ✦ | THREAD CHECK — Entry join, first bullet | D2 |
| A32 | standalone ✦ | PHASE 2 — VERDICT, bottom of the "single weakest join" paragraph / validation currencies discussion | D5 |
| A33 | standalone ✦ | PHASE 0 — S-1 (Congruency Law), after the funnel definition quote | D3 |
| A34 | standalone ✦ | PHASE 0 — S-1, after the "greased slide copywriting principle" reference | D3, D7, D8 |
| A35 | standalone ✦ | Context receipt / end of the funnel diagnosis doc, after BOTTOM LINE | D8 (topology noted at D7) |
| A36 | standalone ✦ | Context receipt / end of the funnel diagnosis doc, second annotation block | D7 |
| A37 | standalone ✦ | Context receipt / end of the funnel diagnosis doc, third annotation block | D1, D3 |
| A38 | standalone ✦ | PROMPT FEEDBACK: light pass, opening annotation | D4 |
| A39 | standalone ✦ | PROMPT FEEDBACK: light pass, large annotation block | D4, D7, §10 |
| A40 | standalone ✦ | PROMPT FEEDBACK: market selection | D5, D7, §10 |
| A41 | standalone ✦ | PROMPT FEEDBACK: router | D7, §10 diag |
| A42 | standalone ✦ | PROMPT FEEDBACK: section analyzer | D6, D7 |
| A43 | standalone ✦ | PROMPT FEEDBACK: funnel architect | D1, D5, D6, D7 |
| P1 | combined only | Reviewer A — A-Collection Diagnosis, DECISION 9 (comparable-bet-seed exclusion), rule-soundness paragraph | D3, D4 |
| P2 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 1 (asserted transformation), after the _provenance quote | D2 |
| P3 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 1, dry-test/commitment conditions sentence | §10 settled |
| P4 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 1, disclosure-violation paragraph (community-heat flag list) | D5 |
| P5 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 1, disclosure-violation paragraph | D2 |
| P6 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 2 (anti-fluke floor), overrides cite | D4 |
| P7 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 2, $300-500K floor paragraph | D5 |
| P8 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 2, degrading caveat (bet-evidence / spend-transfer) | D4 |
| P9 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 2, data-sufficiency violation end (malformed tag) | D4, §10 diag |
| P10 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 3 (differentiator), me-too kill paragraph | D4 |
| P11 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 3, avatar-differentiator strain paragraph | D3 |
| P12 | combined only | Reviewer A — Market Segment Diagnosis, DECISION 6 (price conditioning), end of rule-soundness paragraph (untagged operator text) | D3 |
| P13 | combined only | Reviewer A — A-Funnel Diagnosis, S-5 (sell outcomes, not features) | D3, D8 |
| P14 | combined only | Reviewer A — A-Funnel Diagnosis, ROUTER R-2 (structure is transformation-independent) | D5, D6 |
| P15 | combined only | Reviewer A — A-Funnel Diagnosis, SECTION ANALYZER SA-1 (descriptive-not-prescriptive) | D5, §10 diag |
| P16 | combined only | Reviewer A — A-Funnel Diagnosis, FA-1 (three-layer authority model) | D5 |
| P17 | combined only | Reviewer A — A-Funnel Diagnosis, FA-3 (one-driver-per-piece / curiosity) | D3, D7 |
| P18 | combined only | Reviewer A — A-Funnel Diagnosis, FA-3 (belonging vs status driver mistag) | D3 |
| P19 | combined only | Reviewer A — A-Funnel Diagnosis, FA-3 OPERATOR NOTE 1 (transparency as lead bet) | D4 |
| P20 | combined only | Reviewer A — A-Funnel Diagnosis, FA-4 header (belief chain on asserted transformation) | D2 |
| P21 | combined only | Reviewer A — A-Funnel Diagnosis, FA-4 data-sufficiency verdict end | D1 |
| P22 | combined only | Reviewer A — A-Funnel Diagnosis, FA-5 (trust pillar = founder section alone) | D5 |

✦ = also appears inside `PMF annotated prompts and reviews.md`; the standalone text is canonical.

**Custody verification.** All 65 annotations were extracted programmatically from the two source docs and injected into this document by script (no retyping). Every quote above is byte-identical to its source text (modulo the markdown blockquote prefix and the source docs' backslash-escaping of the annotation tags themselves).
