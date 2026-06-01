# Authoring and Structural Conventions

**Analysis Date:** 2026-06-01

---

## Controlled Vocabulary — Source of Truth

`definitions.md` is the locked vocabulary. Every term used in research docs, briefs, and
handoffs MUST map to a definition there. Do NOT introduce new terms without adding them.
Do NOT use synonyms for defined terms — use the exact term.

**Defined term clusters:**

**Cluster 1 — Market terms:**
- `niche` — identity group, independent of transformation. Venue-testable.
- `sub-niche` / `PMBD cluster` — co-occurring PMBD pattern inside a market; same object, two terms
- `transformation` — outcome marketed to produce ("X happens to the buyer")
- `transformation category` — one layer above transformation (e.g. Beauty, Wellness)
- `product category` — one layer above product, groups by format/mechanism family
- `market` — `niche × transformation`. The unit of competition.

**Cluster 2 — PMBD:**
- `PMBD` — Pain / Belief / Motif / Desire. The four buyer-side data types.
- `PMBD ladder` — four tiers: T1 (transformation), T2 (transformation category), T3 (driver-frame), T4 (core human driver)
- `Pain`, `Belief`, `Motif`, `Desire` — defined with tests and 4-tier ladders

**Cluster 3 — Differentiator levers:**
- `differentiator` — umbrella: market, UM, angle, value models, trust signals
- `UM` — Unique Mechanism (Problem UM / Product UM / Feature UM)
- `angle` — emotion invoked to drive purchase; maps to driver × pole × PMBD tier
- `claim` / `enhanced claim` — verbal outcome-promise; enhanced = base + qualifier
- `value models` — bundle, pricing, discount, guarantee, subscription
- `trust signals` — credibility reducers; `extraordinary identifier` is the saturated upper bound

**Cluster 4 — Sophistication & awareness:**
- `market sophistication` — stages 1-5; the differentiation floor required to compete
- `awareness level` — unaware / problem-aware / solution-aware / product-aware / most-aware
- `extraordinary identifier` — trust signal competitors cannot replicate at the message level

**Cluster 5 — Drivers:**
- `four core human drivers` — survival / reproduction / status / belonging
- `hidden transformation` — undiscovered off-label use case found in VOC

**Cluster 6 — Testing terms:**
- `macro test` — does product × market have PMF at all
- `micro test` — what resonates within a working product × market

**Hard rule:** "paper-like feel" is an angle, not a transformation. "AI note-taking" is a Feature UM, not a transformation. "Thinnest 4.5mm" is a feature, not a claim. When classifying copy, force it into exactly one layer using the worked examples in `runs/eink-tablets/scripts/analyzer-framework.md`.

---

## File Naming Conventions

### Ad Library artifacts — `runs/<space>/adlibrary/`

Pairs of `.png` + `.txt` files per brand/query:
- `<BrandName>.png` / `<BrandName>.txt` — base brand query result
- `<BrandName>_adv.png` / `<BrandName>_adv.txt` — "adv" (advertiser-resolved) query result
- `<BrandName>_eink.png` / `<BrandName>_eink.txt` — tighter keyword query (e.g. `<brand> e-ink`)
- Variant names: `<BrandName>_kw` = keyword variant; `<slug>_adv` = standard resolved form

**Pattern:** `<PascalOrTitleCase>_<variant>.{png,txt}`. The `.txt` holds structured ad data;
the `.png` is a screenshot of the Ad Library result page.

### Marketing corpus — `runs/<space>/marketing-corpus/<brand>/`

Five source files per brand (always these names):
- `landing-pages.md` — scraped LP copy
- `meta-ads.md` — Meta Ad Library output
- `funnel-mechanics.md` — funnel structure, offer mechanics
- `partnerships.md` — partner/press/collab signals
- `notes.md` — miscellaneous gaps or observations

Generated outputs (written by agents, live alongside source files):
- `granular-analysis.md` — 13-section per-brand deep persuasion inventory
- `notes-pass0-fetch.md` — supplementary fetch pass notes
- `screenshots/` — subdirectory for visual captures

**Key convention:** source files vs generated outputs are a real distinction in the layout.
Never mix them. Generated outputs live in the same brand dir but are named distinctly.

### Crowdfunding corpus — `runs/<space>/crowdfunding-corpus/<slug>/`

9-file schema per campaign (always these names):
- `campaign-body.md`, `tiers.md`, `chronology.md`, `comments.md`
- `pre-launch.md`, `press.md`, `outcome.md`, `updates.md`, `notes.md`
- `raw/` — unprocessed fetched HTML/text

### Market directories — `runs/<space>/markets/<slug>/`

Per market (always these files):
- `finder-brief.md` — agent brief for the finder pass
- `analyzer-brief.md` — agent brief for per-brand analyzers
- `aggregator-brief.md` — agent brief for the aggregator
- `competitive-set.md` — the final roster
- `<slug>-market-profile.md` — the deliverable (e.g., `faith-market-profile.md`)
- `brands/` — per-competitor records (one `<slug>.md` per brand)

### Handoff files — repo root

- `handoff.md` — primary session entry point (current state, what's locked, what's open, kickoff prompts)
- `handoff-<topic>.md` — topic-specific handoffs (e.g., `handoff-crowdfunding-teardown.md`, `handoff-granular-analysis.md`)

### Script files — `runs/<space>/scripts/`

- `<slug>-brief.md` — orchestration brief for an agent (e.g., `crowdfund-finder-brief.md`, `granular-analyzer-brief.md`)
- `<name>.js` — Playwright/Node fetchers (e.g., `crowdfund-fetch.js`, `adlib-one.js`)
- `analyzer-framework.md` — the shared vocabulary spine; every analyzer agent reads this

### Run / space naming

- Runs live under `runs/<space>/` using lowercase-hyphenated slugs (e.g., `eink-tablets`)
- Market slugs: lowercase-hyphenated (e.g., `faith`, `dumb-device`, `students`)
- Brand slugs: lowercase-hyphenated (e.g., `remarkable`, `daylight-dc1`, `kindle-scribe`)
- Market labels for playbooks: `M1-<slug>`, `M2-<slug>`, etc. (e.g., `M4-general-purpose-tablet`)

---

## Doc Separation of Concerns

Each root-level doc has one job. Do not blur them:

| File | Role | Locked? |
|---|---|---|
| `definitions.md` | Controlled vocabulary | Locked — do not modify |
| `workflow.md` | Phase structure + research questions (Phases 0–8) | Phase structure locked |
| `capability_inventory.md` | ~20 atomic capabilities + locked decisions | Capability list locked |
| `handoff.md` | Session state, kickoffs, what's open vs locked | Updates each session |
| `flow.md` | Thin skeleton; 3-layer overview | Reference only |
| `map/data_inventory.md` | Capability I/O contracts, entity IDs, join patterns | Working doc |
| `agents/implementation-notes.md` | Notes toward eventual agent specs | Not specs |
| `run-retrospective.md` | Post-run learnings not yet folded back into docs | Ephemeral |

---

## Differentiator Framework Layers

When classifying any piece of competitor copy, force it into exactly ONE layer:

1. **Transformation** — "X happens to the buyer's life" (outcome, never a spec or emotion)
2. **Niche** — identity group, independent of the transformation; read from copy, never assumed
3. **Mechanism / UM** — why/how the product achieves the result; UM only if uniquely positioned
4. **Feature** — spec or attribute; NEVER a transformation, NEVER a claim
5. **Claim** — verbal outcome-promise; base or enhanced (base + qualifier)
6. **Angle** — emotion invoked; maps to driver (status/survival/reproduction/belonging) + pole (pain/desire)

**Layer-confusion worked examples (from `agents/implementation-notes.md` and `runs/eink-tablets/scripts/analyzer-framework.md`):**
- "Paper-like feel" → decayed Product UM, now a saturated minimalism **angle**. Not a transformation.
- "AI note-taking / capture-to-output" → **Feature UM (mechanism)**. Not a transformation, not an angle.
- "Thinnest 4.5mm / faster refresh / genuine leather / E Ink Carta panel" → **features**. Not claims.
- "Your phone pulls you out of prayer" → **problem-mechanism** (shared causal story). Not a Problem UM unless uniquely positioned.
- "Own the newest / world's first" → **status-curiosity angle**. Not a transformation.
- Saturation is per-market-cell (niche × transformation) only. Never pooled across cells.

---

## Markdown Structure Patterns

### Per-competitor record schema
Defined in `runs/eink-tablets/scripts/analyzer-framework.md`. Sections in order:
1. Metadata + sources
2. Product
3. Transformation(s) — dominant frame, secondary, verbatim evidence
4. Niche — niche, targeted sub-niche, evidence
5. Buyer — primary buyer, purchase context, where bought, evidence
6. Claims (outcome-promises only) — table with verbatim / base/enhanced / qualifier type
7. Features (specs only) — table, never mixed with claims
8. Mechanism / UM — mechanism(s), problem-mechanism, UM sub-type or "none"
9. Marketing framing — angles with driver+pole, awareness levels, hooks
10. Offers / value models
11. Trust signals — list + extraordinary identifier flag
12. Sophistication — stage 1-5 + evidence, revenue/scale estimate (must show basis + confidence tag)
13. Meta Ad Library — page-ID resolution status, ad count, sample hooks
14. Reviews / VOC quick-read
15. Notes / gaps

### Market profile schema (`<slug>-market-profile.md`)
Per the retrospective (`run-retrospective.md`), the durable template has 5 sections:
1. Market cells (niche × transformation mapping)
2. Per-cell claim saturation
3. Differentiation whitespace
4. Price-band reality vs $900 (mandatory — every profile compares target price against competitor band)
5. Gate-1 evidence dossier — per axis: Desire to Solve / D2C Feasibility / Market Sophistication / Market Growth, with evidence per axis (not a bare score)

### Agent brief structure (from `run-retrospective.md` §2)
Every brief = role + inputs (which files to read) + hard rules + output schema + self-audit checklist + exact output path.

### Granular analysis (13 sections, per `runs/eink-tablets/scripts/granular-analyzer-brief.md`)
Sections in strict order:
1. Metadata + sources read
2. Headlines catalog (table: verbatim / location / source artifact)
3. Visual look and feel
4. Customer call-outs (named identity + behavior call-outs + testimonial subjects)
5. Claims catalog — verbatim table; counts at end
6. Features catalog — verbatim table; never mix with claims
7. Transformation framing — per-transformation block with setup/build/payoff copy
8. Angles catalog (table: ID / verbatim / driver / pole / transformation ref / source)
9. Objection handles (table: handle copy / objection / funnel location)
10. Hooks ranked by `days_running` descending
11. Funnel structure — per-LP section list
12. Trust signals catalog (table: verbatim / type / source)
13. Deposit funnel evidence

### Crowdfunding teardown (A/B/C/D, per `runs/eink-tablets/scripts/crowdfund-teardown-brief.md`)
- A: Campaign table (led-with classification is the key field)
- B: Chronology notes (3-4 most relevant campaigns)
- C: Objection list ranked by frequency — verbatim quotes required
- D: What funded campaigns did that capped ones didn't

---

## Prompt / Agent Authoring Conventions

### Hard rules format
Every brief begins with numbered hard rules before any other content. These list
failure modes from prior runs. Example structure from `runs/eink-tablets/scripts/granular-analyzer-brief.md`:
```
## Hard rules — read before writing anything
1. Verbatim-only. Every claim... MUST be a direct quote... paired with a source_artifact reference.
2. Classify-with-evidence. Every layer classification... MUST cite the verbatim copy...
...
8. Self-audit checklist at end of writing.
```

### Self-audit checklist
Every agent brief includes a checklist the agent runs before returning. Formatted as a
`- [ ]` list the agent ticks off. Catches layer-conflation errors, missing source citations,
cross-brand leakage, and missing sections.

### Per-brand isolation
Per-brand analyzer agents are forbidden from reading sibling brand files, cross-brand synthesis
files (`birdseye-map.md`, `transformations-flat-map.md`), or category-evolution files. Enforced
by an explicit "DO NOT read" section in every per-brand brief.

### Shared framework propagation
Corrections to classification rules go in `runs/eink-tablets/scripts/analyzer-framework.md`,
not duplicated per brief. Every analyzer reads this file. One edit propagates to all markets.

### Closed enums (from `prompts/phase1-light-pass.md`)
Some fields are closed-set; off-list values are hard rejects:
- `awareness`: `unaware | problem-aware | solution-aware | product-aware | most-aware`
- `channel`: `dtc | marketplace | crowdfunding`
Open fields (verbatim, clustered later): claims, mechanism, niche, angle.

### SYNTHESIS block rule
Any AI-invented message, synthesis, or recommendation must be fenced with a `SYNTHESIS` label
and kept separate from verbatim competitor copy. Data-integrity rule for every deliverable.
Prevents editorializing from contaminating the copy bank.

### Output format discipline
- No em dashes in any deliverable
- Exact figures or "not found" — never estimate or hand-wave numbers
- "N/A" is valid for any field — do not force-fit
- Verbatim quotes in single quotes or block quotes; analyst prose in plain text
- Dense over verbose; framework-mapped over descriptive

---

## Naming Decisions and System Terminology

- Framework uses **Stages** (0–8) for research content; **Phases** for GSD execution. Do not swap.
- M1/M2/etc. are market labels for the e-ink run, not universal
- "Under" means an item is not built enough to spec; "locked" means the decision is final
- "Beta prompts" = briefs written for a specific run, not locked agent specs
- `days_running` = the ad longevity proxy for spend-validated winner detection
- "Exact figures or 'not found'" is a formatting rule, not a preference

---

*Convention analysis: 2026-06-01*
