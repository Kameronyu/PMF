# Ecommerce, Dropshipping & Operations — Spencer Origins
**Source:** Spencer (Origins course)
**Integration date:** 2026-04-08

---

## MINDSET & PROGRESSION

**Valley of Despair / Cycle of Change Model**
- 5-stage psychological progression every operator goes through:
  1. Uninformed Optimism ("this will be easy")
  2. Informed Pessimism ("this is harder than I thought")
  3. Valley of Despair ("this doesn't work / I'm not cut out for this")
  4. Informed Optimism ("I know what to do now")
  5. Success
- Fatal pattern: quitting at Stage 3 resets all accumulated skill — you return to Stage 1 for the next attempt
- Lucky-skip pattern: some operators accidentally hit a winner early and skip to Stage 5 without building skills → crash when the lucky product dies
- Timeline: most operators need 30–60 days minimum to reach Stage 4; some take longer — the timeline is indefinite but earned

**Conviction vs. Motivation Distinction**
- Motivation: transient, external, unreliable — driven by results
- Conviction: persistent, internal, built through personal feedback loops — survives losing streaks
- Mindset issues persist at $10M/month — skill level does not eliminate psychological challenges
- Build conviction: small wins → documented → reviewed during low periods
- Do not rely on motivation to sustain work during the Valley of Despair — conviction is the only reliable fuel

**10,000-Hour Mastery Trajectory**
- Income milestones mapped to hour thresholds with daily schedule variants
- "Skill is permanent; revenue is not" — ROAS drops, ad accounts get banned, products die; skill compounds
- Implication: early losses are skill-building investments, not failures

---

## OPERATIONS & INFRASTRUCTURE

**Shopify-Native Facebook Pixel Setup SOP (6-Step)**
1. Go to Shopify Admin → Apps → Facebook & Instagram channel app
2. Connect Facebook Business Manager
3. Select existing pixel OR create new
4. Activate Conversions API (CAPI) — required for post-iOS attribution
5. Set data sharing to "Maximum" — share all available events
6. Verify pixel is firing on Shopify checkout (test with Meta Pixel Helper extension)

**5-Tab Master Document Architecture**
- Tabs maintained as persistent context fed into Claude before any creative session:
  1. Product — features, COGS, mechanism, differentiation
  2. Research — verbatim customer quotes (density = primary copy quality lever)
  3. Avatars — sub-avatars with visual prompt for static creative
  4. New Information — educational angle material (feeds hook development)
  5. New Mechanism — mechanism candidates (feeds angle matrix)
- Rule: verbatim quote density in the Research/Avatars tab is the primary lever for copy quality
- Update document after every research session or sub-avatar discovery

**7-Step Product Overview Document**
- Sequential pre-copy document to articulate the product before any copy is written:
  1. Features list
  2. Benefits per feature
  3. Desires each benefit addresses
  4. Emotions attached to each desire
  5. Hidden mechanism (what makes it work differently)
  6. Avatar (who feels these desires most acutely)
  7. Competitive gap (what others aren't saying)
- Claude used iteratively throughout — but "outputs are ideation only" — use as starting point, validate against research
- Hemingway App: validate Grade 6 reading level on any copy generated from this document

---

## DROPSHIPPING & SUPPLY CHAIN

**4-Stage Dropshipping Escalation Protocol**
- Stage 1 — Pure Dropshipping (validation):
  - Supplier ships direct; no inventory commitment
  - Use for first 10 sales signal
  - Never commit MOQ without 10+ real purchase signals
- Stage 2 — 50-Unit Pre-Stock (trigger: 10 sales):
  - Order 50 units; control shipping quality and speed
  - Reduces delivery time; builds supplier relationship
- Stage 3 — Outright Bulk (trigger: 10 units remaining):
  - Reorder threshold: when stock reaches 10 units
  - 60–90 day forward-demand horizon in order calculation
  - Sea freight: 45–48 days from China
  - Q4 surcharge note: fulfillment cost rises from $7 → $11–12/unit during Q4
- Stage 4 — Manufacturer + 3PL ($350K+/month):
  - Direct manufacturer relationship (no middleman)
  - Third-party logistics partner in destination market
  - Enables pre-orders, domestic returns, faster shipping signals

**Reverse Logistics Partner in Destination Market**
- Local returns partner: inspects returned goods, re-packs, relists for resale
- Conversion benefit: domestic returns address presence signals domestic credibility → improves CVR
- Route returns to local partner rather than back to China — faster resolution, lower cost long-term

**Charging for Shipping as Margin Lever**
- UK worked example: £3.10 fulfillment cost, £4.95 charged to customer = £1.85 net positive per order
- Free-shipping threshold mechanic: set floor above single-unit AOV (e.g., £60 for free shipping) to force AOV lift
- Year 2 data: charging for shipping enabled significantly more Meta ad spend via improved margins
- Sequencing: test removing free gifts first → if sales continue, introduce shipping charge

**Pre-Order Strategy for Scarcity + Cash Flow**
- Deploy during stockout periods
- Activates scarcity (sold out = validated demand), collects upfront cash, can improve CVR
- Requires existing Trustpilot reviews for credibility — customers need social proof before accepting shipping delay
- Framing copy: "Sold out four times this year — pre-order now to reserve yours"

---

## CREATIVE PRODUCTION & DELEGATION

**Video Editor Delegation Brief System**
- Google Doc brief structure:
  - Lock: brand constraints (font, stroke style, color palette, logo usage)
  - Free: creative freedom (transitions, music, pacing, B-roll selection)
  - B-roll annotation: note which clips go where in the brief
- Rate: $40/deliverable for 3 angle variations
- Sourcing: X (Twitter DMs) / Upwork
- Relationship compounds: long-term editor improves faster than constant freelancer cycling

**Hiring Guide for Video Editors and Creative Strategists**
- Hire sequence: content creator first, video editor second
- Volume benchmarks:
  - 20+ interviews minimum before first hire
  - 30-minute paid brief assessment (test the actual skill, not the interview)
  - Dual requirement: skill AND drive — skill without drive = inconsistent output
- Weekly review cadence with hired editors
- Editor compensation models:
  - $10–25/hour + 5% of ad spend (scales with performance), OR
  - $100 per winning ad (pure output incentive)
- Scale benchmark: $1M+/month achievable with founder + VA + editors only (no large team required)
- Volume benchmark for creative strategist role: 1,500+ applications, 200+ interviews before finding quality hire
- Role reframe: "Job is to create winning ads, not edit videos" — output orientation, not effort orientation

**Edit-It-Yourself Skill-First Scaling Model**
- For sub-$100K/month: self-editing outperforms cheap editors
- Skill path: self-edit → 2–3 concepts/day → compound until revenue attracts quality talent → hire with structured training doc
- Why self-editing wins early: you know the avatar, the angle, and the research — no brief required; feedback loop is instant

---

## SUB-AVATAR OPERATIONS

**Statics-First Belief Signal Validation Sequence**
- Validate new sub-avatars using statics (product image + Claude-generated hooks) BEFORE investing in video
- Three belief signals ranked by strength:
  1. Purchase (strongest — one is sufficient to proceed to full creative)
  2. Comments (volume + sentiment — 10+ positive comments = proceed)
  3. CTR (3%+ = confirmed resonance; below 1% = kill)
- Rule: never produce video creative for unvalidated sub-avatar

**Sub-Avatar Minimum Signal Threshold** [augments existing Avatar Research section]
- 5–10 independent instances of the same self-description = minimum signal to declare a new sub-avatar
- Not enough to find 2–3 people saying the same thing — need statistical weight before building creative around it

**Trustpilot as Self-Description Mining Source** [augments existing Avatar Research section]
- Distinct from Reddit/Amazon/YouTube — different linguistic register
- Trustpilot reviews: formal, post-purchase, outcome-focused
- Use specifically for self-identification language ("as a [identity]," "I've always been someone who...")
- Mine for sub-avatar labels the audience applies to themselves (not labels you assign)

**Peak-Season-Only Validation Gate** [augments existing Avatar Research section]
- Validate new sub-avatars during peak season only
- Off-season validation produces false negatives: slow data + seasonal confounding makes it impossible to distinguish "wrong sub-avatar" from "wrong time of year"

**Counter-Cyclical Market Flip**
- Seasonal UK/US products → test in AU/NZ during their opposite-hemisphere season
- Enter early: late entry = compressed data window + CPM inflation as competitors crowd in
- This applies to both product launches AND sub-avatar validation timing

**B-Roll Andromeda Detection Avoidance**
- Meta's Andromeda system detects and penalizes recycled B-roll footage (reach suppression)
- Tools to refresh: Nano Banana (AI video generation) + Kling 2.6
- Clip specs: 3–5 seconds optimal; 30 seconds maximum
- Rotate proactively BEFORE reach suppression triggers — do not wait for performance drop to diagnose

---

## AVATAR STRATEGY

**Avatar Narrowing Protocol** [augments existing Avatar Research section]
- Test top 2–3 avatars simultaneously
- On traction: immediately expand messaging variations within the winner BEFORE testing new avatars
- Why: depth within winning avatar > breadth across avatars at early stage
- Community-specific terminology extracted from winning avatar's research can become standalone hook

**$100/Day × 30 Days Validation Budget Timing** [augments existing Avatar Research section]
- $100/day × 30 days = $3,000 minimum validation budget per sub-avatar
- Tied to payment processor payout frequency unlock timing — need consistent revenue to unlock faster payouts before reducing validation runway

**Seasonal Strategy Integration**
- Primary market off-season → test in opposite hemisphere during their peak (see Counter-Cyclical Market Flip)
- Hemisphere flip applies to: product launches, sub-avatar validation, media buying tests
- Enter early — late entry compresses the data window and inflates CPMs as competitors flood the peak
