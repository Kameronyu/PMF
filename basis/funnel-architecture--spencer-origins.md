# Funnel Architecture, LP & CRO — Spencer Origins
**Source:** Spencer (Origins course)
**Integration date:** 2026-04-08

> **CONFLICT — Funnel Complexity (Cold Traffic):**
> Spencer: "Default to PDP for all standard-complexity products. Do not add funnel stages to compensate for weak avatar-page congruency."
> Weische + Mark: "Always use pre-sale pages/advertorials for cold traffic."
> Resolution: Spencer is calibrated for sub-$100K/month operators testing unit economics — PDP keeps it simple and fast. Weische/Mark are calibrated for scaling + brand-funded traffic where advertorials justify the complexity. Both are correct; choose by stage and product complexity.

---

## FUNNEL DEFAULTS

**KISS Principle — Default to Direct PDP**
- Send all standard-complexity ad traffic to the Product Detail Page (PDP)
- Do not add funnel stages to compensate for weak avatar-page congruency — fix the congruency instead
- Exception cases where extended funnel IS appropriate:
  - $2,000+ high-ticket physical product
  - Problem-aware audience with significant education requirement
  - Customer watched full VSL in the ad → send to PDP (advertorial is redundant at that point)
- The funnel is not the problem — avatar-to-page match is the problem

**Shopify Avatar-Congruent PDP Mechanics** [augments Weische's LP section]
- For different ad angles targeting different avatars: duplicate the template → hide from menu/collections → accessible via direct URL only
- At scale: PageDeck / GemPages / Replo linked to ONE product (not duplicated products) to prevent inventory tracking conflicts
- Each angle gets its own LP variant — same product, different hook/headline/social proof emphasis

**High-AOV VSL Funnel Specifics** [augments existing VSL Funnel section]
- $200+ product price threshold triggers VSL funnel consideration
- VSL page structure: NO price shown — education only
- CTA text: "Check Availability" (not "Buy Now") — reduces commitment anxiety
- Hard constraint: 2-page maximum between ad click and purchase
- Benchmark: $400 product, cold traffic → ~1% CVR without education layer; VSL unlocks significantly more

---

## DIAGNOSTIC FRAMEWORK

**CTR-ATC-Purchase 4-Node Diagnostic Tree**
- Used to isolate which node of the funnel is broken before iterating

| Signal | Diagnosis | Action |
|---|---|---|
| CTR ≥ 3% + 0 purchases | On-site problem (LP or checkout) | Do not iterate on ad |
| CTR < 1% | Creative problem | Kill ad, iterate creative |
| CTR ≥ 3% + ATC ≥ 10% + 0 purchases | Checkout friction or pricing issue | Fix checkout or test price |
| CTR ≥ 3% + ATC < 10% | PDP problem | Fix PDP copy/offer/congruency |

- Rule: never iterate on ad when funnel is broken; never iterate on funnel when ad isn't driving qualified clicks
- These are separate problems that require separate fixes — conflating them wastes budget

**Split-Test Protocol for Sub-$100K/Month Brands** [augments Weische's LP section]
- Do NOT wait for statistical significance — too slow at this scale
- Process:
  1. Create new ad set inside existing campaign
  2. Point top-performing ads to new LP variant
  3. Let Meta algorithm resolve winner in 2–3 days via spend allocation
- Meta's spend allocation IS the verdict — it's faster and more reliable than manual statistical significance at sub-$100K/month budgets

---

## TRUST & CONVERSION SIGNALS

**CRO Trust Signal Priority Hierarchy (Early-Stage)**
Ranked for resource-constrained brands — implement in this order:
1. Photo reviews (highest impact, lowest cost)
2. UGC video with multiple avatars (signals broad market fit)
3. Units-sold badges at CHECKOUT specifically (not only PDP — purchase hesitation spikes at checkout)
4. Checkout trust badges (payment security, etc.)
5. Niche-specific PDP copy (avatar-matched headlines, etc.)

**Units-Sold Counter Placement** [augments existing UGC/Trust section]
- Place at CHECKOUT — not only on PDP
- Why: purchase hesitation spikes at checkout (final commitment = highest friction point)
- PDP placement alone misses the moment of maximum hesitation
- Hollow Socks ($50M/year, Meta-heavy): "1 million pairs sold" badge at checkout validates this at scale

**Early-Stage UGC Acquisition** [augments existing UGC/Trust section]
- Acquire UGC by any means at early stage: family, friends, gifted product to contacts
- Multiple avatars visible in UGC signals broad market fit (reduces demographic narrowing perception)
- Do not wait for organic UGC before launching — social proof gap hurts CVR more than imperfect UGC

**AIDA-Plus Additions** [augments existing LP section]
- After hero headline, use video evidence of the PROBLEM (not the product) before introducing solution
  - Viewer sees their experience mirrored → emotional connection before sales resistance activates
- Aggregate ALL social proof sources into one star count above the fold:
  - Shopify reviews + Meta ad comments + emails = one combined number
  - Never show only on-site reviews — artificially depresses displayed social proof count

---

## ALGORITHM & BUDGET ALLOCATION

**Algorithm-Trust Creative Allocation Model**
- Do NOT manually force budget to funnel stages — Meta's algorithm handles retargeting automatically
- Facebook detects 5+ site visits and serves BOF creative automatically — no separate retargeting campaign required at early stage
- Recommended creative allocation:
  - Majority: TOF (top of funnel — new audiences)
  - ~2 creatives: mid-funnel (awareness, consideration)
  - 3–5 creatives: BOF (trust-based — NOT discount-only)
- BOF high-performer: Trustpilot review statics with avatar call-outs outperform discount-only statics

**Walk-and-Talk Brand Owner Q&A Format**
- Format: brand owner answers real customer questions pulled verbatim from Facebook comments
- Production requirements: no captions, face visible, no production polish
- Why it works: mirrors organic content → no ad-feel → trust without sales resistance
- High-performing for BOF and mid-funnel creative
- Source questions from: Facebook ad comment threads (screenshot and extract), customer emails, post-purchase surveys
