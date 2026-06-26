# Offer Construction — Spencer Origins
**Source:** Spencer (Origins course)
**Integration date:** 2026-04-08

---

## OFFER ECONOMICS FOUNDATIONS

**Offer-as-Primary-ROAS-Lever Framework**
- Below $100K/month, the offer is the highest-leverage variable — more than creative, more than LP
- Lever hierarchy by impact:
  1. Ad creative
  2. Offer
  3. Landing page
  4. Advertorials/listicles (irrelevant before $100K/month)
- Infrastructure by stage:
  - $0–10K/month: Shopify PDP directly, no additional tools needed
  - $30–40K/month: PageDeck for LP optimization
  - $100K+/month: advertorials become relevant
- Implication: spending on LP before offer is proven = wrong sequence

**Revenue Per Session (RPS)**
- Formula: RPS = CVR × AOV
- Primary funnel diagnostic metric — captures both conversion and revenue levers in one number
- US targets:
  - Below $1.00: dramatic intervention needed — fundamental funnel problem
  - $1.00–$2.00: viable but use bundles as primary lever
  - $2.50–$3.00: good — focus shifts to media buying efficiency
- Profitability condition: RPS must exceed CPC for profitable operation
- Always use Meta-measured CVR, not Shopify (attribution difference)
- Warning: margin erosion from discounting can improve RPS while worsening Profit Per Session — track both

**RPS Diagnostic Decision Tree (3-Band)**
- Below $1.00: dramatic intervention — offer, pricing, or fundamental avatar-page mismatch
- $1.00–$2.00: bundles are the lever — test quantity break + free gift
- Above $2.00: media buying and creative optimization drive next gains
- Offer-math rule: a discount costing 2% margin can produce 6× revenue per visitor — always evaluate by RPS impact, not margin cost in isolation

**Margin Architecture for Offer Construction**
- Use margin as the primary design constraint for any offer
- Minimums:
  - 60%+ minimum margin for ad-funded growth
  - 70%+ preferred
  - Never test offers below 50% — no runway
- Full formula: Gross Profit = Revenue − COGS − Shipping − Gateway Fees (3% + $0.03)
- Architect offers BACKWARD from required margin — not forward from desired revenue
- Margin floor rules for specific offer types: 50% absolute floor; 52%+ for BOGO; 60%+ for standard discounts

---

## BREAK-EVEN MATH

**Break-Even ROAS Calculation Method (5-Step)** [augments existing Offer/Economics section]
1. Take sale price
2. Subtract COGS
3. Subtract shipping cost
4. Divide Gross Profit by sale price = Gross Margin %
5. Divide 1 by Gross Margin % = Break-Even ROAS (round up)

Example: $60 price − $12 COGS − $8 shipping = $40 GP ÷ $60 = 66.7% margin → 1 ÷ 0.667 = 1.50 Break-Even ROAS

- Model BEFORE testing — never launch without knowing break-even
- Three worked examples required per new offer scenario

**Offer Scenario Modelling Before Launch**
- Before deploying any offer, model three variables:
  - New gross margin × new projected ROAS × new ad spend = gross revenue × margin = gross profit
  - Compare to current baseline
- 2% margin loss producing 50% net profit increase = valid trade — evaluate by gross profit impact, not margin cost
- Margin and Offer Breakdown Sheet: model minimum 2–3 price points before committing; include full cost structure (product + shipping + gateway) in every scenario
- LTV amplification framing: front-end CVR gains compounded by backend upsell attach rate

**Offer Impact on Gross Profit: Revenue Illusion (Named Concept)**
- Revenue increase + maintained ROAS + reduced margin = net profit collapse
- Worked scenario:
  - Baseline: $100K spend, 2× ROAS, 70% margin = $40K net profit
  - New: $150K spend, 2× ROAS, 55% margin = $15K net profit
  - Revenue +50%, profit −62.5%
- Named pattern to recognize and avoid: "Revenue Illusion"
- Test: always run the margin-adjusted net profit calculation before expanding offer discounts

---

## OFFER TYPES & TESTING

**Offer Testing Hierarchy (7-Step Ranked by Priority)**
1. Bundle and Save (highest priority)
2. Price Testing (test higher price as quality signal first)
3. Minimum Order Quantity
4. BOGO (Buy One Get One)
5. Percentage off on quantity breaks
6. Free shipping threshold
7. Free gift (test and remove if not driving conversion — see Charging for Shipping)

**Buy X Get X Free Framework (BOGO)**
- Use BOGO as primary offer for consumables — not just as upsell
- Iteration sequence: Buy 1 get 1 → Buy 2 get 1 → Buy 2 get 3 free
- Set minimum purchase quantity to protect margin
- Margin floor: 52%+
- Scale result benchmark: Buy 2 get 3 free → $1M/month for one brand

**Conditional Offer Stacking**
- Base offer (20–30% discount) + conditional second-unit unlock (50% off) for customers already in purchase intent
- Psychological mechanism: commitment-and-consistency — once they've decided to buy, second unit is easy
- Requires shipping economics to improve at higher quantity (bundle shipping flat cost = margin lever)
- Implementation: in-page bundle (show at PDP) or post-ATC conditional offer (show after add-to-cart)

**Offer Construction Hierarchy (4-Step Priority)**
1. Avatar-specific bonus (highest relevance leverage)
2. Quantity breaks (margin-neutral to positive)
3. Free gift (test and remove if not needed — free gifts add perceived value but also complexity)
4. Higher price as quality signal vs. discounting to compete with Amazon

**Free Shipping Threshold as AOV Lever**
- Do NOT use free shipping as the primary offer — too weak to drive conversion on its own
- Use as bundle sweetener or spend-threshold incentive above single-unit AOV
- Charging <$5 is often more profitable than free shipping
- Year 2 data: charging for shipping enabled significantly more Meta ad spend via improved margins

**Charging for Shipping Test Sequence** [augments existing Offer section]
- Test sequence:
  1. Remove free gifts first — if sales continue, gifts weren't driving conversion
  2. Then test charging shipping
- This isolates which offer element was actually doing work vs. which was overhead

---

## OFFER STRATEGY

**Desire-Product Gap Analysis**
- Assess desire saturation BEFORE angle selection
- If desire has already been met by existing products, claiming it again fails regardless of copy quality
- Rule: "A desire that has been met by existing products cannot be claimed again without a new mechanism"
- Do this analysis at the offer construction stage, not just competitive research

**Law of Large Numbers Discount Display** [augments existing Offer section]
- Low AOV product: use percentage off (typically the larger-seeming number)
- High AOV product: use dollar amount (typically the larger-seeming number)
- Always display whichever appears larger — the visually larger number anchors value perception

**Offer Addiction Warning (Structural Dependency)** [augments existing Offer section]
- Named concept: once launched, brands cannot easily remove discounts without revenue decline
- Customers train to expect the discount → baseline becomes the discounted price
- Rule: launch with margin awareness and documented break-even calculations, not tactical desperation
- Alternative: use conditional discounts (only unlocked by adding second unit) to avoid baseline dependency

**Two-Product Reality (Functional Product Mapping)** [augments existing Offer section]
- Before building offer, map the functional product explicitly:
  - List all problems solved
  - List all benefits delivered
  - List all experiences created
- Features without a functional bridge to customer outcome consistently underperform
- Assumed New Mechanism 5-Category Checklist (structured discovery prompt):
  1. Application system (how it's used)
  2. Hardware grade (material/quality differentiator)
  3. Functional placement (where on body/environment)
  4. Integrated systems (what it works with)
  5. Comfort engineering (experience while using)

**Offer-to-Landing-Page Testing Protocol (5-Step)**
1. Duplicate the product page
2. Apply new offer to duplicate only (original stays live)
3. Create new ad set pointing to duplicate URL
4. Run 7+ days inside Meta — let algorithm stabilize
5. Compare Meta-level CVR and AOV (not Shopify — attribution differs)
- URL-embedded discount codes for shareable links (e.g., ?discount=CODE in URL)
- Never test offer changes against the live page during active campaigns
