# Funnel Architect / Copywriter — marketing decisions you own

> Surfaced from Phase 15 (funnel architect/copywriter build) and the live 15-DEBUG session retro. Same stage seen twice. The "what went wrong" is signal; the fixes are yours to decide.

---

## Crowdfunding vs. general DR — the belief type distinction was never drawn

**What happened:** Belief records don't tag whether a persuasion move is crowdfunding-specific (e.g. backer-risk reduction, early-adopter framing) or a general DR move. The architect couldn't filter by context fit.

**Why it matters (marketing):** Crowdfunding funnels have persuasion obligations that standard DR funnels don't (trust in the founder, delivery risk, backer identity). If those aren't distinguished, the architect may apply the wrong moves or miss crowdfunding-specific ones entirely.

**Your call:** Define which belief moves are crowdfunding-required for Arduview vs. which are general DR. What does a Kickstarter backer need to believe that a retail buyer doesn't?

---

## No defined primary key for saturated vs. ownable persuasive moves

**What happened:** The claim tally had no defined primary key (individual `moves[]` tags). Without it, the architect couldn't determine which persuasive moves are overused by competitors and which are ownable.

**Why it matters (marketing):** Saturation detection at the wrong granularity produces either false scarcity ("no one is doing X category") or false crowding ("everyone does Y"). The architect's angle selection depends on this read being accurate.

**Your call:** Decide the right granularity for "saturated" in this space. What counts as a move — a named tactic, a claim type, a structural beat? What makes a move ownable vs. table stakes?

**Note:** Engineer builds the plumbing to support this.

---

## Which DR files the funnel architect actually operates on was undefined

**What happened:** The architect's DR bundle had no formally locked file list. The architect operated on whatever happened to be loaded — which wasn't verified or stable across sessions.

**Why it matters (marketing):** Inconsistent DR grounding means the architect's persuasion logic, framework references, and copy craft decisions shift run to run. You can't debug or improve a funnel if the reasoning layer is different each time.

**Your call:** Lock which DR files are authoritative for this product's funnel. Which frameworks apply? Which ones are off-limits because they're wrong for this product category?

**Note:** Engineer builds the plumbing to support this.

---

## Structural reference (belief-order modeling) was conflated with copy-language retrieval

**What happened:** The retrieval pipeline mixed two distinct needs: modeling the belief-order structure of a competitor funnel, and retrieving competitor copy language for tone/phrasing reference. These are different jobs and were not separated.

**Why it matters (marketing):** A funnel that borrows structure from the wrong comp and language from another produces inconsistent logic. The sequence a comp uses to build belief is not the same as how they phrase claims — treating them as one retrieval task corrupts both.

**Your call:** For Arduview, identify which comp(s) you want to model structurally (belief-order reference) vs. which you want for language/tone reference. These may not be the same brand.

---

## Funnel-level shape fields were null for all four competitors

**What happened:** The deep-pass captured belief-level micro data but none of the funnel-level shape fields — sequence, offer mechanic, urgency construction — for any of the four analyzed competitors. The architect had no structural reference from the real competitive set.

**Why it matters (marketing):** Funnel structure decisions (where to install beliefs, where to place the offer, how urgency is built) were made without knowing how the actual competitive set is structured. The architect worked from non-competitive sources instead.

**Your call:** For each competitor you care about, what is their funnel sequence, offer mechanic, and urgency construction? This is a judgment read you need to supply — it can't be inferred from belief-level data alone.

**Note:** Engineer builds the plumbing to support this once you define what fields matter.

---

## No validation economics — message selection was reputation-driven, not spend-validated

**What happened:** The architect's input contract had no validation map. Per brand × angle, the architect needed ad count, max run-length, total active-days, impression bucket, and variant count to determine what the market has actually paid to run. None of this was present.

**Why it matters (marketing):** Without spend validation, angle selection defaults to "looks credible" rather than "has survived market contact." An angle the architect likes may be exactly the one the market rejected.

**Your call:** Which angles do you want spend-validated before the architect selects from them? What's the minimum longevity signal you'd trust (e.g., 90-day run = validated)?

**Note:** Engineer builds the plumbing to pull and structure this data.

---

## No VOC — the belief chain sits on asserted transformation, not buyer language

**What happened:** No VOC step preceded funnel design. Both Carl and Mark's frameworks call VOC the foundation of copy (80% of the effort). The architect had no verbatim buyer language — no pains, desires, or objections sourced from real buyers.

**Why it matters (marketing):** A belief chain built without VOC is hypothesis, not copy. Claims that don't echo back the buyer's own language fail to create recognition. Arduview's funnel was built on the operator's description of the product, not on what buyers actually say.

**Your call:** What VOC do you have for this product/audience? What research do you want done before the next funnel build — Reddit threads, reviews of adjacent products, interviews?

---

## Awareness field was null — architect inferred from comp opening structure instead of a stored read

**What happened:** `awareness_entry` was null for all four comps. The architect's own operating law is "structure follows awareness." With no stored awareness read, the architect guessed the backer's awareness level from how each comp opens — an inference, not a read.

**Why it matters (marketing):** Starting a crowdfunding funnel at the wrong awareness level is a structural error that no amount of copy craft fixes. Too high = confusion. Too low = insults a knowledgeable audience.

**Your call:** What is the Arduview backer's awareness entry point? Are they problem-aware, solution-aware, or product-aware? What evidence supports your call?

**Note:** Engineer builds the plumbing to store and surface this field once you define it.

---

## DR bundle split (architect vs. copywriter) is role-based, not situation-based

**What happened:** The line between brief-level hook/claim work (architect) and copy prose (copywriter) is porous. Copywriting craft — hook construction, claim-typing, feature-to-benefit translation, Mark's "necessary beliefs" document — was architect-relevant but was excluded from the architect's bundle.

**Why it matters (marketing):** The architect writing a brief without access to copy craft principles produces briefs that are structurally sound but unusable as writing inputs. The copywriter then has to re-derive what the brief should have specified.

**Your call:** Where do you draw the line between brief work and copy work for this product? Which craft frameworks should the architect operate on vs. which belong only to the writer?

---

## Fold budget and element order must be specified in the copy brief

> *Originally surfaced in `lp-builder.md` / `BUILD-FEEDBACK.md` as an LP builder correction loop.
> Cross-linked here because the root cause is a copy-brief authoring gap — the copywriter prompt
> must specify fold budgets or the builder (human or agent) makes default guesses that bury hooks.*

**What happened:** The copy brief specified what to say but not what goes above the fold on each
page or in what order. LP hero and deposit page both required mid-build corrections when fold
priority hadn't been pre-decided.

**Why it matters (marketing):** Above-the-fold real estate is the highest-value decision in an LP.
On the deposit page specifically, the offer value (51% off) is the conversion hook — if its fold
position isn't specified, the builder will make a default guess that may bury the hook. This
applies equally to whatever the copywriter prompt instructs the copywriter to brief.

**Your call:** When authoring the copywriter prompt, require fold budget as an explicit output
field: per page (LP hero, deposit page), which elements must be visible before scroll, in what
order, and which is the single dominant CTA. This is a copy-brief input, not a design decision.

---

## Pain-led DR framework applied to a desire-driven product

**What happened:** A large share of the loaded copywriting DR was pain-led advertorial machinery. Arduview is desire-driven with no meaningful pain. The irrelevant framework was in context and created anchoring risk toward the wrong persuasion structure.

**Why it matters (marketing):** Pain-led and desire-led funnels have different structure, belief order, and hook types. Anchoring on the wrong template produces a funnel that sounds like a pharma ad for a gadget people want — which kills conversion for a different reason than "bad copy."

**Your call:** Confirm the product's persuasion profile: desire-led, no pain, curiosity/aspiration driven? If yes, explicitly decide which frameworks are off-limits for this run and which desire-led alternatives you want in play.
