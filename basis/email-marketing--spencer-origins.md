# Email Marketing & Retention — Spencer Origins
**Source:** Spencer (Origins course)
**Integration date:** 2026-04-08

---

## DELIVERABILITY

**180-Day Deliverability Segmentation**
- Definition of "engaged": opened OR clicked in last 180 days
- Never send campaigns to your full list — only to engaged segment
- Klaviyo implementation:
  1. Build "engaged last 180 days" segment
  2. Set all campaign sends to target that segment only
  3. Leave unengaged subscribers in list but exclude from all sends
- Risk framing: 30K unengaged + 30K engaged in same send = spam classification risk for ALL future sends
- Rule: the unengaged subscribers don't hurt you by sitting there — they hurt you the moment you send to them

**Frequency Fear Pitfall** [augments Mark's Email Cadence section]
- Under-sending is the bigger mistake, not over-sending
- Unsubscribes from new subscribers offset naturally as list matures
- Leaving 3 sends/week on the table costs more long-term than managing occasional unsubscribes
- Do not reduce frequency because of unsubscribe anxiety — track revenue per send, not unsubscribe rate

**Platform Migration Timing** [augments existing Email Flows section]
- Shopify native email: sufficient at early stage (sub-$10K/month)
- Migrate to Klaviyo as list scales — triggers, segmentation, and deliverability controls justify the switch
- Do not migrate prematurely — Klaviyo's value compounds with list size

---

## FLOW ARCHITECTURE

**Flow Priority Order** [augments existing Email Flows section]
Build and optimize in this sequence:
1. Abandoned checkout (highest ROI — purchase intent already established)
2. Abandoned cart
3. Browse abandonment
4. Welcome sequence
5. Post-purchase

**Post-Purchase Flow Must-Includes** [augments existing Email Flows section]
- Shipping address confirmation
- Shipping timeline expectation (sets expectation, reduces "where is my order?" support tickets)
- Refund-incentivized survey (target: 5 refunds/month → reduces disputes and captures honest feedback)
  - Offer refund in exchange for completing survey
  - Two-question minimum structure

**Day-One Pop-Up Rule** [augments Mark's Email Cadence section]
- 10%+ discount offer on pop-up, live from day one — do not delay
- Common mistake: launching store without pop-up while running ads = leaving list-building revenue on the table

---

## CAMPAIGNS & CADENCE

**Peak Period Cadence** [augments Mark's Email Cadence section]
- During Black Friday weekend: 9+ campaigns across channels (email + SMS + WhatsApp)
- Frequency that feels excessive off-peak is appropriate during peak season
- Segment by geography: Thanksgiving sends go to US only, exclude UK — geographic relevance increases engagement

**Omni-Channel Retention Stack**
- Coordinated stack: Email + SMS + WhatsApp + Google remarketing + Meta remarketing
- Email MER (Marketing Efficiency Ratio) improves when all channels run simultaneously — lift is cross-channel, not additive
- Build region-based segments for channel-specific sends (US vs. UK timing/content)

---

## REVIEWS & SOCIAL PROOF

**Star-Rating Review Routing System**
- Mechanism: star-rating links embedded in delivery confirmation email
  - 1–3 stars → Judge.me (private resolution — captures complaints before they go public)
  - 4–5 stars → Trustpilot (public — builds review count where it matters for acquisition)
- Gift voucher incentive offered in CTA text, but value withheld: "get a gift voucher" not "get £10 voucher"
  - Why: withholding the value increases click-through without anchoring expectations
- Result: 780 Trustpilot reviews at 4.8 rating
- Downstream lever: high Trustpilot score enables pre-orders (customers tolerate longer shipping windows) and improves cold-traffic conversion

**Trust-First Review Routing (Retention Context)**
- Gift voucher value: £10
- Send timing: at or shortly after confirmed delivery
- Strategic outcome chain: Trustpilot Excellent score → enables pre-orders → pre-orders activate scarcity + collect upfront cash → downstream acquisition improvement and AOV lever

---

## UGC & AFFILIATES

**UGC Affiliate Funnel (Klaviyo + UpPromote)**
- Klaviyo trigger: 2–3 weeks post-delivery (after product experience, before enthusiasm fades)
- Email structure: two binary questions
  1. "Do you love it?"
  2. "Do you want to earn money?"
- Google Drive UGC upload link in same email (remove friction from submission)
- Platform: UpPromote (Shopify) for affiliate management and tracking
- Commission: 10% minimum viable floor
- Manual seeding process: Instagram DM → gift product → track in spreadsheet (Instagram handle / TikTok / email)
- Single affiliate ceiling documented: £15,000 brand revenue → £1,500 commission at 10%
- Organic referrals expand network after seeded affiliates produce visible results
