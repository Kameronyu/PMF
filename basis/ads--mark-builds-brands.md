# Facebook & Paid Advertising: Frameworks, Strategy, and Execution

Paid advertising frameworks for Facebook, TikTok, and cross-platform e-commerce. Covers creative strategy, campaign structure, audience targeting, technical setup, and scaling methodology. Creative quality is the primary lever (90% of success); media buying and campaign structure are secondary.

---

## 90/90 Rule: Creative and Hook Dominance (Source: Mark Builds Brands)

90% of Facebook/TikTok ad success is determined by creative quality, not product selection or campaign structure. 90% of an individual ad's success is determined by the hook (first 3-5 seconds). This hierarchy makes hook development the single highest-leverage activity in e-commerce advertising. Winning ads scale profitably — more spend behind them increases profitability.

- $250K/month in sales attributed to this creative-first strategy
- Average e-commerce CTR: ~3% (3 out of 100 ad viewers click)
- Creative strategy + high volume = 90% of Facebook success; funnel issues account for ~10% of failures

---

## Hook Anatomy: Copy/Visual/Audio Weighting (Source: Mark Builds Brands)

The hook decomposes into three weighted components: copy (first sentence) = 80% of hook success; scroll-stopper visuals = 15%; audio = 5%. Hook rate — percentage of viewers continuing past the first 3 seconds — is the primary hook performance metric.

**Hook Rate Setup:** Formula = 3-second video plays ÷ impressions. Not natively available in Facebook or TikTok dashboards; must be created as a custom metric via Columns → Edit Custom Columns → Create Custom Metric.

**Target Benchmarks:** Hook rate ≥ 50%; Hold rate ≥ 25% (percentage watching to 50% of video).

---

## Infinite Hook Glitch System (Source: Mark Builds Brands)

Repeatable pipeline for continuous hook generation capable of sustaining $10K+/day ad performance.

1. Use AI agents (GenSpark Super Agent or ChatGPT Operator) to search TikTok for niche-relevant problem terms (not product terms)
2. Filter for high-view + low-follower count videos — this signals hook/content quality rather than audience reach
3. Extract and document winning hooks
4. Upload hooks + product context + foundational documents to Claude or ChatGPT
5. Generate unlimited hook variations in batches (10, 20, or 30 concepts per session)

**Signal:** High views with few followers = hook and content are the driver, not existing audience.

---

## Broke Influencer Syndrome Exploitation (Source: Mark Builds Brands)

Content creators excel at attention metrics (views, followers) but fail at conversion — termed "broke influencer syndrome." Advertisers harvest proven hooks from viral creator content and pair them with direct response copy. Separation of attention-getting (hook) from conversion (copy) is the core leverage mechanism.

---

## Holy Grail Video Ad Structure (Source: Mark Builds Brands)

A definitive video format for new product launches, attributed to $22K/day revenue when properly executed.

**Structure:** Hook → Body (unique mechanism + how it works, 1-2 minutes) → CTA 1 → Social Proof → CTA 2

- Body content must tie every element to tangible outcomes, never features or benefits; people buy outcomes
- CTA 1: simple, outcome-tied instructions, targets already-convinced viewers
- CTA 2: placed after social proof; targets skeptical viewers; must include guarantee + scarcity + special offers

**PIG Method (Chris Hadad):** Hook must create immediate visceral emotional response (Punch in the Gut). If the hook fails, the rest of the ad is irrelevant.

---

## Creative-First Targeting Paradigm and Andromeda Update (Source: Mark Builds Brands)

Facebook's Andromeda update (fully rolled out July 2024) replaced individual ad evaluation with AI grouping of visually/contextually similar ads into clusters, evaluated together. Built on Nvidia Gracehopper superchip; triggered by the surge of AI-generated ad volume. This update caused widespread advertiser performance drops in 2024.

**Implication:** Creative diversity — not variation volume — is the primary differentiator. Facebook's AI reads every visual/textual element (skin tone, gender, age, copy sentiment, background, landing page code) to determine targeting. 90% of effort should go to creatives; 10% to campaign management.

**Strategy shift:** Pre-Andromeda = 80% variations, 20% new concepts. Post-Andromeda = 80% new concepts, 20% variations. Structure CBOs so each ad set represents one unique concept with 2-5 variations per set.

**Minimum threshold for scaling:** 25 net-new creative concepts per week (not variations or iterations) across diverse formats: image ads, short-form UGC, long-form UGC, VSLs, mini-VSLs.

---

## Facebook Ad Auction: Total Value Formula (Source: Mark Builds Brands)

**Formula:** Total Value = Advertiser Bid × Estimated Action Rates × User Value

- Estimated Action Rates include website conversion rate — below 1% CVR triggers Facebook penalty, reducing traffic delivery
- User Value includes relevance scores, thumbnail stop rates, hold rates
- Facebook processes this across tens of millions of ads in 200 milliseconds using a four-step funnel: Retrieval (filters 90%+) → Light Ranking → Final Scoring → Auction
- Auto-bidding handles the bid component; advertisers control action rates and user value via creatives and landing pages

**Penalty threshold:** Website conversion rate below 1% = reduced traffic delivery.

---

## Broad Targeting Frameworks (Source: Mark Builds Brands)

**Two implementations:**
- **Old School Broad:** Manually set only age, gender, language; all other targeting fields blank
- **Advantage Plus Audiences:** Facebook handles all targeting automatically; accesses hundreds of millions of users; preferred for established accounts

**Why legacy targeting failed post-iOS 14 (2021):**
- Interest targeting: Facebook charges premium for "interest buyers"; audience capped; competes with all advertisers for same segment
- Lookalike audiences: CPMs frequently exceed $150 post-iOS 14; you pay twice (seed audience build + targeting); strongest 2018-2019
- Custom audiences: fewer users entered post-iOS 14, reducing overall power

**For new ad accounts:** Disable Advantage+ initially; US-only; wide age ranges; single relevant interest only.

---

## Campaign Structure and Technical Configuration (Source: Mark Builds Brands)

**Facebook Campaign Hierarchy:** Campaign (objective) → Ad Set (audience) → Ad (creative)

**Sales Objective Rule:** Always select "Sales" objective optimizing for "Purchase" conversion event. Traffic campaigns deliver traffic, not buyers — the most common and costly beginner mistake.

**Post-Andromeda Technical Config:**
- Campaign: Sales objective, CBO enabled
- Ad Set: Website conversions, max conversions goal, purchase optimization, 7-day click / 1-day view attribution
- Targeting: United States, broad language, Advantage Plus placements, ages 18-65+, all genders
- Schedule: Start next day at 6 AM EST
- Ad level: Disable promo codes, branding, site links, overlays, visual touch-ups, music, text improvements, animation

**CBO Budget Rule:** Minimum daily budget = total number of ads × $10; absolute floor = $50/day regardless of constraints. Example: 9 ads × $10 = $90/day minimum.

**CBO Structure:** 3-5 ad sets (concepts) × 2-5 variations per set; keep images and videos in separate ad sets or CBOs to prevent cannibalization.

---

## Diagnostic Frameworks: Ad-Side and Funnel-Side (Source: Mark Builds Brands)

**Soft Metrics (ad-side, no purchase required):** CPC, CTR, CPM, hook rate, hold rate, frequency
**Hard Metrics (conversion actions):** Add to cart, initiate checkout, purchases, subscriptions

**Ad-Side Failure Thresholds (US traffic):**
- CPM > $30: ad-side problem
- CTR < 3%: ad-side problem
- CPC > $1.50: ad-side problem

**Soft Metric Benchmarks:**
- Link CPC: ~$1.50 US; $1.00-$1.50 big four countries
- Link CTR: 3% universal
- CPM: $30-$50 US
- Hook rate KPI: 50%
- Hold rate KPI: 25%

**CTR All vs CTR Link Diagnostic:** Large discrepancy = audience interest without purchase intent. Fix via creative adjustment targeting higher-intent buyers.

**Custom Columns to Track:** Impressions, CPM, CTR (link), CPC (link), Link Clicks, Landing Page Views, Add to Cart, Initiate Checkout, Purchases, Purchase Conversion Value, Cost Per Purchase, Purchase ROAS. Save preset as "run more ads."

---

## Product-Price Budget Rule and Testing Protocol (Source: Mark Builds Brands)

**Budget rule:** Daily budget = product retail price (e.g., $30 product → $30/day). Run minimum 3 days before evaluating. Minimum spend per test = 3× product price ($90 for $30 product).

**Simple 4-Ad-Set Test Structure:** 4 ad sets at $50/day each = $200/day total. Ad Set 1: US + interest targeting; Ad Set 2: US + Advantage Plus; Ad Set 3: Non-US tier-one + interest; Ad Set 4: Non-US tier-one + Advantage Plus. Each set runs 3 ads with different hooks, identical bodies.

**Kill Signals:** CTR under 1%, CPC over $2-3, CPM over $50.

**Shotgun Protocol:** Launch 3-5 creatives per product, each with distinct angle. Expect 80-90% failure rate; 10-20% winners are normal. Double down on winning angles across entire funnel.

**One Relaunch Rule:** When metrics are poor and far from break-even ROAS, allow exactly one strategic relaunch (full analysis → one significant change). If profitability not achieved, cut the product.

---

## AI-Powered Creative Production Workflows (Source: Mark Builds Brands)

**Swipe Method:** Use Get Hooked to find competitor ads running 7+ days (longevity = profitability signal). Upload to pre-configured Gemini Gem → AI outputs: formula for why ad works, copy variations with your branding, image generation prompts. Generate images via Highfield with Nano Banana Pro. Swipes have higher win rates than originals because concept is pre-validated by competitor spend.

**Original Concept Creation:** Use Claude Sonnet 4.5 loaded with foundational documents. Prompt to identify emotional triggers and hot points from research, then convert to static ad concepts. Generate 10, 20, or 30 concepts per session; output includes unique formats and novel spins on proven formats.

**TikTok Hook Mining:** AI agents search TikTok for problem-related terms → filter high views + low followers → extract hook text → feed into Claude or ChatGPT with product context → generate variations.

---

## Pixel, Tracking, and Infrastructure (Source: Mark Builds Brands)

**Pixel Setup:** Facebook Pixel (called "Data Sets" in Business Manager). Shopify integration via native partner connection, not manual code. Conversions API should remain enabled. Pixel trains Facebook algorithm on buyer profile.

**Pixel Obfuscation Strategy:** Send only front-end purchase data to Facebook's browser-side pixel; Facebook underestimates true customer LTV → lower CPAs. Use server-side tracking (e.g., Hyros) to maintain full data quality for internal optimization without exposing upsell revenue.

**Domain Verification:** Required before launching campaigns. Unverified domains risk ad rejection or lower quality traffic. Verify via Business Manager → Brand Safety → Domains → Add. Domain cost: ~$20-30 on GoDaddy.

**Infrastructure Risk Management:** Maintain multiple ad accounts, business managers, pages, and pixels. Account shutdowns/shadow bans cause 30-50% performance drops. Must be able to relaunch within one day of any component going down.

**Pixel seasoning:** $50,000-$100,000 in ad spend required to fully season a pixel for optimal buyer identification.

---

## Top-of-Funnel Creative Strategy: Indirect vs. Direct Ads (Source: Mark Builds Brands)

**Indirect ads (cold traffic):** Sell an idea or concept; place viewer in emotional problem state; never reveal product or offer in the ad. Result: 7-10% CTR vs. ~3% for standard product-focused ads. Incompatible with standard Shopify product page — requires advertorial or pre-sell page.

**Direct ads (warm/retargeting traffic):** Product prominently displayed; clear CTA; benefit statements; testimonials; social proof.

**Dating Analogy:** Presenting an offer without building awareness, desire, and trust first = asking someone home on a first date.

**Omni-Channel Retargeting:** Activate Facebook, Google Shopping, Google Search, YouTube, Gmail, Bing, TikTok, Snapchat simultaneously. Retargeting is highest-ROI ad spend category available.

---

## Affluent Audience Targeting for Higher AOV (Source: Mark Builds Brands)

Explicitly call out high-income professions (lawyers, doctors, corporate workers) in ad copy and targeting to attract buyers predisposed to $100+ purchases. Facebook categorizes users by income level — use these segments. Messaging determines whether you attract $30 buyers or $100 buyers. Core principle: solve rich people's problems.

---

## Data Advantage and the Advertising as Data Purchase Framework (Source: Mark Builds Brands)

Advertising spend is reframed as purchasing optimization data. More spend → more data → better optimization. Facebook, TikTok, and Google are fundamentally data companies; accumulated pixel and account data creates compounding competitive advantage. New ad accounts start at severe structural disadvantage against established competitors — one-to-one copying fails because you lack their data asset.

**Data-as-Purchase Mindset:** When a campaign fails, ask "why?" not "which product next?" Emotional decision-making (turning off campaigns after early losses) is the primary failure mode.

---

**Key Metrics & Benchmarks**
- Hook rate KPI: ≥50%; Hold rate KPI: ≥25%
- Link CTR: ≥3%; Link CPC: ~$1.50 (US); CPM: $30-$50 (US)
- Lookalike CPMs post-iOS 14: often >$150
- Website CVR below 1% → Facebook delivery penalty
- CBO minimum budget: $10/ad or $50/day floor
- Product-price budget rule: daily spend = product price; evaluate after 3 days minimum
- Test structure: 3-5 concepts, expect 10-20% winners
- Scaling creative volume: minimum 25 net-new concepts/week
- Pixel seasoning: $50K-$100K in spend for full optimization
- Performance drop from account shutdowns: 30-50%
- $9,867,257 generated in 2025 using branded dropshipping + this methodology
- Top-of-funnel indirect ads: 7-10% CTR; standard product ads: ~3% CTR

**Common Pitfalls**
- Selecting Traffic campaign objective instead of Sales when goal is purchases
- Using Advantage Plus on brand-new accounts before sufficient pixel data is accumulated
- Stacking multiple interests instead of using a single relevant interest for initial targeting
- Testing variations of the same creative (spam testing) instead of diverse new concepts post-Andromeda
- Copying competitor ads one-to-one without adaptation — fails due to competitor's data advantage
- Optimizing for engagement or add-to-cart events instead of purchase events
- Using lifetime budget instead of daily budget — reduces hands-on control
- Ignoring landing page conversion rate (below 1% triggers Facebook traffic penalty)
- Running ads on unverified domains
- Monitoring only soft or only hard metrics — misdiagnosis without both
- Abandoning campaigns after early losses without diagnosing root cause
- Building organic content instead of prioritizing paid ad selling skills early-stage (recommended 80% time on selling, 20% or less on content)
- Neglecting omni-channel retargeting in favor of prospecting only