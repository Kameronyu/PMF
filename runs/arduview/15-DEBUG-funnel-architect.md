# Funnel Architect — Input Requirements & Gaps

**What this is:** from the funnel architect's seat, the information I *needed* to do the job well vs. what the previous research runs (Stage 0–1 light-pass + market-selection; Stage 2–3 deep competitive analysis + messaging) actually handed me. Written so the next run fixes the inputs, not just the output.

**The meta-pattern:** the deep-pass delivered a strong **MICRO** layer — belief_records with verbatim_refs, moves, proof_tier, source_routing (this part was genuinely good). But the **MACRO / context** layer arrived **null, inferred, or piecemeal**. The architect's ceiling is set by the macro layer. I spent the session reconstructing macro context (validation, awareness, funnel structure, objections) that should have been delivered.

---

## Priority summary

| # | Missing input | Owner stage | Status this run | Impact on the design |
|---|---|---|---|---|
| 1 | **Validation economics** (ad longevity/spend per angle; raise/backers/delivered; trend durability; revenue) | Stage 0–1 (light-pass + market-selection) | null/unknown everywhere; recovered ad hoc via a spawned agent | message selection was **reputation-driven, not validation-driven** — the framework's core promise |
| 2 | **VOC + the real transformation** (verbatim buyer language; validated transformation vs asserted) | Stage 2–3 (messaging/VOC) | none; transformation was the *asserted* one (space-map says so) | copy ceiling = "good DR," not buyer-voice; identity beats weakest; Spencer's Command+F unrunnable |
| 3 | **Awareness read** (awareness_entry per comp; backer awareness for the chosen cell) | Stage 0–1 / 2–3 | `awareness_entry` null for all 4; I inferred from comp opening structure | structure-follows-awareness + spec-led-vs-transformation-led decided on inference |
| 4 | **Per-comp funnel structure** (funnel_sequence, offer_mechanic, urgency_construction) | Stage 2–3 (deep-pass) | null for all 4; only belief_records populated | structural references came from ONE operator funnel (inkleaf) + DR, not the analyzed comps |
| 5 | **The product's real objection set** | operator + Stage 2–3 | never compiled; inferred | belief presence/emphasis tuned on inference, not researched objections |
| 6 | **Cross-brand winning-vs-not map** | Stage 0–1 / 2–3 | didn't exist; closest was the ad-hoc Sonnet agent | couldn't systematically borrow from winners / avoid losers' angles |
| 7 | **Blocked ports / trust-asset reality** (founder, press, prototypes, production, prior-shipped) | operator, pre-design | discovered & corrected mid-session; founder still open | trust pillar (founder) designed blind; re-do loops |
| 8 | **Offer/price + COGS** | operator, pre-design | arrived mid-session ($299/$146/$5) | offer designed with placeholder economics |
| 9 | **Asset inventory as a design input** (photos/videos + aesthetic + claim coverage) | asset pass | arrived in waves AFTER the design | image picks redone twice; assets drove nothing in the belief chain |

---

## The gaps in detail

### 1. Validation economics — the load-bearing miss
The architect routes each belief's fill to the angle/claim with the most real validation. I got almost none.
- **Currency A (messaging):** per brand × angle I needed — ad count, max run-length-days, total active-days, impression bucket, variant count. The store had **`qualifying_creatives = 0` everywhere** → zero ad-longevity signal. The real signal (Flipper's curiosity hook: 53/117 ads, 238-day top run, 1M+ sold) sat in raw `ads/` and was only recovered by a subagent I spawned.
- **Currency B (structure):** raise / backers / funded% / delivered per crowdfunding comp. Only gameshell had it; **arduboy-mini's funded Kickstarter was dropped** (the closest analog crowdfunding proof).
- **Durability:** `demand_trend.shape` was **null for all 20 brands** (market-selection's own #1 blocker). For a fad-death-prone novelty toy this is the single most important demand read, and it was empty.
- **Revenue:** `revenue_est` null for all 20 → no brand-scale sense.
- **What I needed, concretely:** a per-brand × angle table collapsing to *"which angle has the most proven spend behind it; which structures are proven-fundable; which brands are durable vs spiked-and-died."*

### 2. Voice-of-customer + the real transformation
- No VOC corpus at all. Both Carl and Mark call VOC *the* foundation (80% of copy effort). I needed: pains/desires/objections in **verbatim buyer language**, the **casual-referral register**, and the **self-identity labels** buyers use. Without them the copy is competent-DR-register, not buyer-voice — and Spencer's Command+F verbatim check is impossible to run.
- The transformation I designed against is the **asserted/canonical** one — `space-map.json` explicitly says "canonical transformations are claim-categories competitors ASSERT, not validated customer transformations — true transformation is a later VOC/review-mine finding." That review-mine never happened, so the whole belief chain sits on an unvalidated transformation.

### 3. Awareness read
- `awareness_entry` was **null for all four** comps. The skill's own law is "structure follows awareness." I had to infer the backer's awareness from how each comp *opens* (all open on a striking object claim, zero problem-education → solution-aware, desire-driven). That inference drove the biggest structural call (hybrid UM-led hero, no problem beat, no spec grid) and the spec-led-vs-transformation-led decision.
- Gate 4 (awareness) was *deliberately* deferred to deep-research in market-selection — but the architect runs after that and still needs it. The deep-research awareness read either didn't happen or didn't reach me.

### 4. Per-comp funnel structure
- `funnel_sequence`, `offer_mechanic`, `urgency_construction` were **null for all four**. The deep-pass captured the belief records but not the funnel-level shape. So my structural references came from the operator's **own inkleaf** funnel + the DR frameworks — not from the analyzed in-cell comps. A proper deep-pass should emit each comp's actual page order, offer mechanic, and urgency construction.

### 5. The product's real objection set
- The skill expects "the real objection set" (will-it-ship, is-the-transparency-a-gimmick, is-the-price-justified). It was never compiled. I inferred it. It should be **researched** from comp reviews/comments + crowdfunding-backer psychology and handed over, so belief presence/emphasis is tuned to real objections.

### 6. Cross-brand winning-vs-not map
- The synthesis you asked for — *which brands are winning, on which angle, backed by how much spend; which are flat/failing* — never existed as an input. It's the natural output of #1 + a per-brand angle read. The only version produced was the ad-hoc Sonnet investigation I had to commission mid-design.

### 7–9. Operator/pre-design inputs that arrived late or never
- **Blocked ports / trust assets:** founder identity + track record, press, prototype count, production stage, prior shipped product — collected mid-session or still open (founder). For a debut crowdfunder the founder *is* the trust pillar; designing it blind forced re-do loops.
- **Offer/price + COGS:** arrived mid-session; market-selection had flagged "economics pending operator COGS."
- **Asset inventory:** the photo/video set and its claim/aesthetic coverage arrived in waves *after* the belief chain was designed, so assets confirmed nothing and the image selection was redone twice. Assets should be an input the design can lean on (which beliefs have visual proof, which are copy-only).

---

## What WAS delivered well (keep doing)
- **belief_records** — rich: belief_id + kind + execution_type + execution_detail + proof_tier + moves[] + verbatim_refs[] + source_routing. The deep-pass micro layer is the strongest part of the pipeline.
- The **DR bundle** (5 files, verified-injected) and the **brand-refs** (Nothing/TE/Playdate).
- The **product facts** (BOM + form) — clean.

## The one-line fix
Stage 1/2 should hand the architect a single **"architect input pack" per cell**: validation map (#1) + VOC corpus & validated transformation (#2) + awareness read (#3) + per-comp funnel structure (#4) + researched objection set (#5) + winning-vs-not map (#6) + blocked-ports/assets/offer collected up front (#7–9). Today the **micro** layer (belief_records) arrives rich while the **macro** layer arrives null or piecemeal — and the macro layer is what actually bounds a funnel architect's quality.

---

## Session-process retrospective (how this run executed)

### What worked
- **Subagents on the right jobs:** the lost-signal audit (recovered the validation signal — see #1), the frame-selection agent (byte-clean visual pick from contact sheets), the copywriting adversarial review (caught the Pocket-Operator functional-claim over-claim, the 2/7 hook, the deposit-page angle break, the price leaks). Each added specific value.
- **Adversarial review materially improved the design** — most v2 fixes came from it.
- **Honest flagging** of unproven / blocked / reputational throughout, rather than asserting confidence the data didn't support.

### What didn't
- **Anchored to the wrong artifact twice before reading the source of truth:** accepted the art-director's pre-extracted frames before reading the handoff that called them non-binding; and the initial belief chain leaned on reputational fill because validation was absent and I didn't demand it up front.
- **Loaded image bytes into main context** (5 photos) when a subagent should have done the looking — corrected only after the operator flagged it; the project's own "bytes never enter context" principle existed and I didn't apply it.
- **Validation reconstructed late** instead of demanded as an input (#1).
- **Many small re-do loops** (copy / images / captions) because inputs arrived piecemeal across the session rather than as one complete brief — churn was input-sequencing, not design error.

### Audit method note (for next time)
Auditing a session belongs **in-session, before compaction** — the value is the decision trace, which lives in conversation, not the run files. A fresh "reconstructor" agent is the wrong tool (no trace, reads irrelevant artifacts). The right use of a second agent is to **red-team this written doc** (one focused file) for blind spots.

### Recommendations
1. Build the upstream **validation map** (#1) so message selection is validation-driven, not reputation-driven. This generalizes to every PMF funnel run.
2. Run **VOC** (#2) before the next funnel — it's the resonance ceiling.
3. Collect operator inputs (founder facts, offer/price, blocked ports, assets) as **one pre-design brief**, not piecemeal.
4. Keep the strong micro layer (belief_records) — the fix is the macro layer around it.

---

## What I observed about DR-knowledge selection (the copywriting pass) — observations only, no prescription

This came up when the work moved from designing the funnel to actually writing copy.

- **The architect bundle had no copywriting file — but copywriting DR turned out to be architect-relevant.** The funnel-architect bundle is 5 Carl files (funnel-architecture, persuasion, differentiator, consumer-psychology, offer-construction); zero copywriting. In practice, hook construction (Carl's curiosity-viral / core-desire headline; Mark's 7-point hook checklist + hook archetypes), claim-typing, feature-to-benefit, Mark's "necessary beliefs document" (which *is* the belief chain), and the dual-persona/gift framing were all needed to write the brief well. The "architect = structure/persuasion/offer, copywriter = words" split leaked: the brief-level hook/claim work straddles both roles.

- **Spencer (line-craft) was the missing primary file — it lived only in the copywriter bundle.** It was the file that hard-confirmed the no-VOC ceiling (its Command+F verbatim check is unrunnable without VOC) and gave the steal-frameworks-not-words rule (= the [STRUCT] discipline I used). The architect operated without it until the operator pointed me to the copywriter skill mid-session.

- **A large share of the loaded copywriting DR didn't fit this product.** Much of it is pain-led advertorial machinery (PIG punch-in-the-gut, problem-amplification cascade, Disney hero story, deep-pain LP). Arduview is desire-driven with no pain, so that half was inapplicable — and an anchoring risk. The bundle is a fixed, wholesale allowlist; it wasn't filtered to the product's awareness/desire/crowdfunding profile.

- **Redundancy across bundles + gaps within them.** The copywriting files repeat awareness-stage / unique-mechanism / mass-desire concepts that are already in the architect's consumer-psychology + differentiator files (duplicated context), while the line-craft layer the architect actually needed was absent from its bundle. The curation optimized per role, not per situation — producing both overlap and holes.

- **When the right file was present, the DR knowledge worked well as a decision-guide / validator.** Spencer's steal-frameworks → the [STRUCT] rule; Carl's curiosity-viral headline matched the situation; Mark's 7-point checklist let me score and reject the weak hook; Carl's feature-detail-shot structure validated the visual-guts-grid; Mark's necessary-beliefs frame mapped onto the belief chain. The knowledge itself was valuable — the friction was *which files were routed to which agent*, not the content.

- **Selection was static, not situation-driven.** ~60 DR files exist in the KB; each skill bundles a small fixed allowlist regardless of the run. The right subset depends on the product (desire vs pain, awareness stage, crowdfunding vs DTC) — but the allowlist doesn't flex to that.
