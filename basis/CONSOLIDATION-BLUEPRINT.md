# Consolidation / Renaming Blueprint (for a FUTURE session — DO NOT merge now)

**Current state:** 28 topics / 45 skills (each topic has a `-write` and/or `-score` variant; 17 topics have both, 11 are score-only).
**Projected post-consolidation:** ~13 topics / ~24 skills (write+score pairs preserved where both jobs exist).

Guiding rule: keep the mechanizer's **write vs score split** intact inside every merged topic (a writer that grades itself inflates its own output). "Merge" means merge by *topic*, then keep up to two skills (one WRITE, one SCORE) under the merged job-name. Name skills by the **job the user is doing**, not by the source-file label.

---

## Cluster 1 — {ads, ad-creative, advertising, advertorial}
**Verdict: PARTIAL MERGE.** Three of the four are the same job at different altitudes; advertorial is a distinct format.
- `ads` + `ad-creative` + `advertising` → **MERGE** into one topic: **`paid-ad-creative`** (write + score). All three cover the paid-social creative job: hook, angle, awareness→hook routing, creative-matrix combinatorics, the ≤20 dynamic-creative cap, 2×AOV budget, 3-2-2 read. They are near-duplicates that will drift if kept apart.
- `advertorial` → **KEEP SEPARATE** as **`advertorial`** (write + score). It is a long-form editorial-styled landing format with its own structural contract (story-driven testimonials, native-article framing), closer to landing-pages/VSL than to scroll-stopping ad creative.
- Net: 4 topics → 2 topics.

## Cluster 2 — {cro, conversion-optimization}
**Verdict: MERGE.** These are the same job under two names (one abbreviation, one full phrase).
- → **`conversion-optimization`** (write + score). Fold `cro`'s sequencing contracts (More→Better→New, Four Levers, anchor-high, onboarding handoff) and the 5+ saturation gate into the single skill. Drop the `cro` alias.
- Net: 2 topics → 1 topic.

## Cluster 3 — {funnel-architecture, quiz-funnel, landing-pages}
**Verdict: KEEP SEPARATE (rename the umbrella).** These are a parent + two concrete surfaces, not duplicates.
- `funnel-architecture` → **`funnel-architecture`** (write + score) — the cross-surface sequencing/flow contract (page-to-page handoff, data carry-through). Keep as the umbrella.
- `quiz-funnel` → **`quiz-funnel`** (write + score) — distinct interactive diagnostic surface (5-question pain-diagnostic ordering, quiz→sales-page data carry).
- `landing-pages` → **`landing-pages`** (write + score) — the static LP surface (above-fold social-proof count, discount-anchor band, seven-component section).
- Rationale: each has its own countable gates that would collide if fused; the registry already treats them as peer surfaces. Net: 3 topics → 3 topics (no change; recommend cross-linking, not merging).

## Cluster 4 — {offer-construction, pricing}
**Verdict: MERGE.** Pricing is a sub-component of offer construction (the registry's `value models` lever already contains pricing, bundle, discount, guarantee, subscription).
- → **`offer-construction`** (write + score). Absorb `pricing`'s gates (compare-at 2×, margin floors, three-tier pricing, break-even ROAS) — they are already largely duplicated inside offer-construction-score. Keep pricing rules as a section, not a topic.
- Net: 2 topics → 1 topic.

## Cluster 5 — {upsells, upsells-and-monetization, aov-optimization}
**Verdict: MERGE all three.** One job (raise order value / lifetime value post-add-to-cart) under three names.
- → **`aov-and-monetization`** (write + score). Consolidate: post-purchase upsell sequencing, re-anchor-to-just-purchased rules, value-stack order, offer-variation tiers, quantity-booster anchoring, decoy pricing. `upsells-and-monetization` is itself already a fusion symptom — collapse it.
- Net: 3 topics → 1 topic.

## Cluster 6 — {persuasion, persuasion-and-sales, consumer-psychology, copywriting}
**Verdict: SPLIT-THEN-MERGE into two clean jobs** (do not lump all four).
- `persuasion` + `persuasion-and-sales` → **MERGE** into **`offer-and-sales-persuasion`** (write + score): the Hormozi/Cialdini stack — guarantee structure, three-tier anchor, MESO/negotiation moves, scarcity/urgency, authority/social-proof stacking. These two overlap heavily (cold-offer stack vs sales-call stack) and should be one skill with a channel switch.
- `consumer-psychology` → **KEEP SEPARATE** as **`consumer-psychology`** (score-only today): it is the *diagnostic* layer (Awareness level, Market sophistication, Stage→levers matrix, driver mapping, Command+F verbatim rule) — registry-term classification, not persuasive copy generation. Different job: judge readiness, not write the pitch.
- `copywriting` → **KEEP SEPARATE** as **`copywriting`** (write + score): general prose craft routed by Awareness level (Hook/Angle/UM/PMBD execution). It is the writing-craft skill; persuasion is the offer-economics skill; consumer-psychology is the diagnostic. Three distinct jobs.
- Net: 4 topics → 3 topics.

## Cluster 7 — {email-and-retention, email-marketing}
**Verdict: MERGE.** Same channel, two names; `email-and-retention` is the superset.
- → **`email-and-retention`** (write + score). Fold `email-marketing`'s gates in (deliverability, broadcast/flow structure). Retention/lifecycle is the broader frame and should be the keeper name.
- Net: 2 topics → 1 topic.

---

## Topics NOT in any cluster (keep as-is, no merge): 
brand-building, case-studies, customer-data, differentiator, ecommerce, product-research, social-proof, vssl. (8 topics.) Note: `social-proof` could optionally be absorbed into the persuasion/trust skill in a later pass, but it has a distinct job today — scoring comment-section testimonials before planting — so KEEP SEPARATE for now.

## Roll-up math
- Cluster 1: 4 → 2 (merge ads/ad-creative/advertising; keep advertorial)
- Cluster 2: 2 → 1
- Cluster 3: 3 → 3 (keep)
- Cluster 4: 2 → 1
- Cluster 5: 3 → 1
- Cluster 6: 4 → 3
- Cluster 7: 2 → 1
- Unclustered keepers: 8 → 8
- **Topics: 28 → ~20.** Skills: 45 → ~33 (preserving write/score pairs). If clusters 3 and 6 are merged more aggressively in a later pass the floor is ~13 topics; the conservative, write/score-preserving target above is the recommended first pass.

## Cross-cutting actions for the merge session
1. Before merging any pair, confirm both members anchor the SAME registry terms; reconcile the `kb-quiz-funnel-score` "social proof" anchor (re-point to **Trust signals**).
2. Reconcile the 5-category "new-mechanism" checklist (brand-building, offer-construction) against the registry's 3-sub-type **UM** model — pick one canonical taxonomy.
3. Preserve the WRITE/SCORE separation in every merged topic; never fuse a writer and its grader into one skill.