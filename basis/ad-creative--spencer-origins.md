# Ad Creative, Testing & Scaling — Spencer Origins
**Source:** Spencer (Origins course)
**Integration date:** 2026-04-08

---

## CREATIVE STRATEGY FOUNDATIONS

**Creative-First Scaling Hierarchy**
- Ad creatives are the only lever capable of 5–10× scaling an ad account
- Two non-linear levers: (1) ad creative quality, (2) offer strength — everything else is marginal
- One winning ad can 5× spend AND 2× ROAS simultaneously
- Account structure, audiences, and campaign optimization are irrelevant below $50K/day
- Fix creatives before testing new offers when sub-$10K/month

**Opportunity Cost of Micro-Optimization** [augments existing ad scaling sections]
- At $300/day spend: 10% structural optimization = $30/day (additive)
- Single creative win = $400/day → $2,000/day = +$1,600/day indefinitely (multiplicative)
- Rule: 1 hour analysis / 5 hours creative production — not the reverse
- Structural optimization adds $30–200/day at sub-$10K/day; creative win adds $1,600+/day indefinitely

---

## TESTING METHODOLOGY

**Marksman Method**
- Run multiple distinct angles simultaneously, one execution per angle
- Purpose: directional signal only — identify which angle resonates before investing in depth
- Wide-surface testing across angles before committing creative resources

**Sniper Method**
- One confirmed angle, full creative congruency, deeper investment
- Used AFTER Marksman identifies the winning angle
- Sequence: Marksman to find → Sniper to scale

**3-2-2 Ad Testing Structure**
- 3 creatives × 2 body copies × 2 headlines per test batch
- 7-day minimum evaluation period
- Designed for systematic signal extraction, not creative dumping

**Shotgun Method**
- Formalized for creator pipelines only (TikTok Shop, UGC seeding)
- Explicitly prohibited for internal creative teams
- Do not conflate with Marksman — Shotgun is volume-based, not angle-based

**Ad Feedback Loop System**
- Document hypothesis BEFORE testing: "Why do I think this will work?"
- Ranked post-mortem after results: reasons ordered by confidence (highest to lowest)
- Distinguish surface learnings ("video ads work") from complete learnings ("this sub-avatar responds to X angle at Y awareness stage")
- Track hit rate = winners ÷ total concepts launched over time

---

## PERFORMANCE EVALUATION

**Winner / Loser / Super Winner Definitions (Spend Thresholds)**
- Loser: below 10% of account spend after 7 days AND/OR below KPI ROAS
- Winner: 10%+ of account spend AND hits KPI ROAS
- Super Winner: enables budget scaling while maintaining KPI at majority of account spend
- Hard decision criteria tied to spend percentages — not vanity ROAS reads

**Percentage-of-Spend Performance Framework**
- Meta's spend allocation is the primary success signal, not ROAS in isolation
- Ad's % of account spend = actual performance measure
- An ad Meta won't spend on is already a verdict — ROAS is irrelevant if spend is near zero

**7-Day vs. 3-Day Evaluation Framework**
- Algorithm learns in 7 days; 3-day reads are directional only
- Kill signals require composite metrics — never single-metric decisions
- Composite kill = low spend % + below KPI ROAS + low CTR across 7 days

**ROAS Evaluation Window** [augments existing ad scaling sections]
- 3-day minimum evaluation; 7-day optimal rolling window
- ~50 purchases required for statistical confidence
- Worked example: $300/day spend, 51 purchases, 7-day ROAS 3.3 = reliable read
- Sub-50 purchases = directional, not conclusive

**Turn-Off Decision Framework**
- Before killing a high-spend ad: ask "Would redistributed spend achieve better ROAS?"
- Never kill without asking this question
- A high-spend loser may still be the best available option until a replacement is ready

**Account-Wide vs. Ad-Level ROAS Priority**
- Account-wide ROAS = north star metric
- Ad-level ROAS = diagnostic tool only
- Individual ads optimized in context of whole account, not in isolation

---

## BUDGET MANAGEMENT

**40-Hour Budget Adjustment Rule**
- Minimum 40–48 hour hold cycle between budget adjustments
- Do not touch budget inside this window — let algorithm stabilize
- Violating this resets learning and corrupts read

**Budget Scaling Rule: 20% Every 48–72 Hours**
- Standard increment: +20% per adjustment cycle
- Timing: 48–72 hour minimum between adjustments
- Aggressive scaling exception: see EAM Protocol below

**Minimum Daily Spend (MDS) Framework**
- Non-negotiable floor spend thresholds:
  - Early-stage brand: $100–200/day
  - Large brand: $10K+/day
- At MDS: stop cutting — fix root cause instead (launch DCTs, funnel audit, research, new offers)
- Cutting below MDS destroys signal and prevents recovery

**EAM Scaling Protocol — 24-Hour Decision Tree**
- Daily evaluation cadence
- Standard hold: 48–72 hours before any adjustment
- Attribution gate: 60%+ click-based purchases required before scaling up [augments existing]
- Exception conditions skip the 48–72 hr hold (promos, new winners)
- Standard scale-up: +20%
- Aggressive scale-up: when ROAS is 50%+ above KPI target → match the ROAS surplus percentage
- Scale-down: −20% at break-even miss
- EAM ceiling benchmarks: $50K/day single CBO; $100K single Black Friday day documented [augments existing]

**Delta-Based ROAS Target Reset**
- Formula: New Target ROAS = New Break-Even ROAS + (Old Target ROAS − Old Break-Even ROAS)
- Rule of thumb: Target = Break-Even + 1.0
- Purpose: preserves margin safety buffer when offer economics change
- Use whenever changing price, COGS, or offer structure

**Frequency as Funnel Position Indicator**
- Frequency 1.0–2.0 = prospecting behavior (new audience)
- Frequency 3.0+ = retargeting pattern (different ROAS expectations apply)
- Don't evaluate retargeting-frequency ads against prospecting ROAS benchmarks

**CPC as Funnel Role Indicator**
- Low CPC = prospecting vehicle (broad reach, low intent)
- High CPC + high ROAS = retargeting pattern (narrow reach, high intent)
- Use to set ROAS expectations per ad before evaluating results

---

## CAMPAIGN ARCHITECTURE

**ABO as Isolation Chamber for Experimental Creatives**
- Use ABO (Ad Set Budget Optimization) — NOT CBO — for unproven/experimental formats
- Set maximum spend cap (~£50/day) to limit risk
- Migrate proven concepts from ABO → CBO only after validation
- Never test new formats in CBO — contaminates proven campaigns

**Weekly Creative Drip-Feed Protocol**
- Controlled weekly batch launches: 3–4 videos Monday midnight
- Do NOT dump all creatives at once
- Prevents creative cannibalization (ads fighting each other for budget)
- Prevents algorithm confusion from simultaneous launches

---

## ACCOUNT INFRASTRUCTURE

**3-Business-Manager (3BM) Facebook Asset Structure**
- BM1: pixel only
- BM2: central holding (pages, assets)
- BM3: ad account host (all spend)
- 3+ real profile admins per Business Manager for redundancy
- Why: single profile ban = loss of all running ads — 3BM architecture prevents total shutdown
- Non-negotiable for any brand spending $1K+/day

**Account Warming Protocol**
- Method A: 7-day engagement campaign with emotional content before conversion spend
- Method B (Pyramid): page likes campaign → scale to conversions
- Purpose: prevents cold account rejection signals from Meta
- Use when launching fresh accounts or after bans/resets
