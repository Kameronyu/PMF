# Handoff

Entry point for the next session (likely Claude Code).

## Current state (2026-05-23)

- **Faith market scan complete.** End-to-end run of the workflow's Phase 0
  steps 2–3 on faith × focused-devotional-life. Method check: passed. Outputs in
  `runs/eink-tablets/markets/faith/` — finder/analyzer/aggregator briefs, 14
  per-competitor records under `brands/`, the competitive-set roster, and
  `faith-market-profile.md` (cells, claim saturation, differentiation whitespace,
  price-band reality vs $900, Gate 1 evidence dossier).
- **3-agent pattern locked:** finder → analyzers (parallel) → aggregator, beta
  prompts per market, one job per agent. Each runs as its own subagent
  invocation; only artifacts (.md files in the market dir) persist.
- **Methodology corrections from the Faith run are baked into the shared
  analyzer framework** (see "What's locked"). All future market scans inherit
  them through that one file.
- **Two parallel market scans now queued:** Students and Dumb Device. One session
  per market, in parallel. Faith stays as is (already done; profile is solid;
  re-running not worth marginal cost). Gate 1 three-way comparison runs after
  both parallel scans complete, in a 4th session.

## Read these in order

1. `definitions.md` — locked vocabulary. Don't modify.
2. `workflow.md` — phases. Phase 0 steps 2–3 is what the scan does; Gate 1 comes
   after.
3. `capability_inventory.md` — capabilities + locked decisions.
4. `runs/eink-tablets/markets/faith/faith-market-profile.md` — the worked example
   of a market-scan deliverable. Read before running yours.
5. `runs/eink-tablets/scripts/analyzer-framework.md` — the shared analyzer spine.
   Every analyzer agent reads this. Fixes live here, not duplicated per market.

## What's locked

- Capability list, phase structure, vocabulary, `capability_inventory.md`'s
  locked decisions — same as prior handoff.
- **The 3-agent run pattern:** finder → analyzers (parallel) → aggregator. One
  job per agent. Beta prompts per market under `markets/<slug>/`. Each market
  produces a profile at `markets/<slug>/<slug>-market-profile.md`.
- **Methodology corrections from the Faith run** (now in the shared framework):
  - Niche is READ from competitor copy, never assumed.
  - Transformation ≠ feature ≠ mechanism. "Paper-like feel" is a feature, not a
    transformation. Mechanism = why/how the product achieves the result.
  - Split claims (outcome-promises) from features (specs).
  - Problem-mechanism (causal story) recorded SEPARATELY from Problem-UM. A
    causal story repeated across most competitors in a market is SHARED, not a
    UM. Mark UM as "none" unless uniquely positioned. (Faith's "the phone is the
    distraction" is shared across Hallow/Dwell/etc. — corrected from the prior
    handoff's read.)
  - Buyer characterization field on every record — primary buyer (self / parent /
    school / mixed), purchase context, where bought, with verbatim evidence.
  - Ad Library Page-ID sanity check is REQUIRED (Kindle Scribe and Boox both
    resolved wrong on first try in the Faith run). Don't skip the Ad Library
    step — absence of ads is data.
  - Saturation counts ONLY within a market cell (niche × transformation), never
    pooled across cells.
- **The product:** foldable, programmable e-ink tablet. **$900 target retail.**
- **The candidate market set:** Faith (done) · Students · Dumb Device. Selected
  via Pipeline B (product fixed, solving for niche).

## What's open

Foundational Unders (same as prior):

1. **Map / persistence layer.** Currently parked behind the deliverable; the
   manual run artifacts (.md files under `runs/`) are the de facto persistence.
2. **Authorship + source metadata pass-through.**

Downstream Unders (calibrate via the manual runs):
- Gap analysis scoring methodology (Gate 1). After all 3 market profiles exist,
  3 calibration points are available.
- Win-decision framework (Gate 2).
- Filter thresholds.

## What comes next

**Two parallel sessions, one per market.** Kickoff prompts at the bottom of this
doc. Each session runs the full scan end-to-end.

- **Session: Students.** Briefs at `runs/eink-tablets/markets/students/`. Niche:
  students (K-12 + college, **one market — don't bifurcate**; buyer-side is
  mixed and captured per competitor). Transformation: better grades / academic
  performance via focus.
- **Session: Dumb Device.** Briefs at `runs/eink-tablets/markets/dumb-device/`.
  Niche: **LOOSE — discovery-pending.** Defined by buyer *behavior* (buying
  stripped-down tech or distraction-blocking tools to take more control of their
  tech consumption), not a fixed identity. Sub-niches surface from the scan.
  Transformation: **more control** over your relationship with technology
  (digital minimalism framing, NOT productivity-productivity).

**Both sessions reuse the corrected Faith records for the e-ink stratum**
(reMarkable, Boox, Kindle Scribe, Daylight). Do not re-analyze incumbents — read
the Faith record and write a market-specific delta.

**4th session — Gate 1 three-way comparison.** After both parallel scans
complete: read Faith + Students + Dumb-Device market profiles, score
comparatively across Gate 1 axes (Desire to Solve · D2C Feasibility · Market
Sophistication · Market Growth), pick the bet. Phase 2 depth on the winner.

## What NOT to do

- Don't redesign the phase structure. Locked.
- Don't introduce new vocabulary. Use `definitions.md`.
- Don't write permanent agent specs. These briefs are BETA prompts for THIS run;
  locked agent specs are gated on the map-layer Under.
- Don't redesign the briefs from scratch — adapt the templates. Fixes go in the
  shared analyzer framework, not per market.
- **Don't skip the Ad Library step.** Even for free apps / non-DR brands.
- **Don't assume a niche before reading copy.**
- **Don't conflate transformation / feature / mechanism.** Use the worked
  examples in the shared framework.
- Don't bleed scope between the two parallel sessions.
- Don't deep-dive Phase 2 in these scans. Selection only.
- Don't start Gate 1 until both parallel scans are done.

## Session scope discipline

ONE market per parallel session, end-to-end. The aggregator output (the market
profile) is the durable deliverable — once it's written, that session can end.

## Working notes

- Direct. Push back when something's wrong. Don't sycophant.
- Dense over verbose. Framework-mapped responses preferred.
- Distinguish synthesis from direct quotation — Kam will catch editorializing.
- Acknowledge what's locked vs open before reasoning.
- "I'm not sure" beats confident bluffing.
- Match the Faith profile's density and structure as the worked example.

---

## Kickoff prompts

Paste one into a fresh session to launch that market's scan.

### Students session

> You're running the Students market scan for the PMF e-ink tablet project. Read
> `/home/kyu3/PMF/handoff.md` first, then the Students briefs at
> `/home/kyu3/PMF/runs/eink-tablets/markets/students/`. Run the standard pattern:
> finder → **checkpoint with me on the roster** → analyzers (parallel, one per
> must-analyze competitor) → aggregator → **checkpoint with me on the profile**.
> Reuse the existing Faith e-ink records (reMarkable, Boox, Kindle Scribe,
> Daylight) — read them and write a Students-specific delta, don't re-analyze.
> Use the shared framework at
> `/home/kyu3/PMF/runs/eink-tablets/scripts/analyzer-framework.md`. Output to
> `/home/kyu3/PMF/runs/eink-tablets/markets/students/`. Selection only — no
> Phase 2 depth.

### Dumb Device session

> You're running the Dumb Device market scan for the PMF e-ink tablet project.
> Read `/home/kyu3/PMF/handoff.md` first, then the Dumb Device briefs at
> `/home/kyu3/PMF/runs/eink-tablets/markets/dumb-device/`. **Niche is LOOSE** —
> the finder + analyzers surface sub-niches from copy; don't pre-assume any.
> Transformation is **more control over tech** (digital minimalism, NOT
> productivity). Run the standard pattern: finder → **checkpoint with me on the
> roster** → analyzers (parallel) → aggregator → **checkpoint with me on the
> profile**. Reuse the existing Faith e-ink records (reMarkable, Boox, Kindle
> Scribe, Daylight) — read them and write a Dumb-Device-specific delta. Use the
> shared framework at
> `/home/kyu3/PMF/runs/eink-tablets/scripts/analyzer-framework.md`. Output to
> `/home/kyu3/PMF/runs/eink-tablets/markets/dumb-device/`. Selection only — no
> Phase 2 depth.
