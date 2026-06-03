# Codebase Structure

**Analysis Date:** 2026-06-01

## Directory Layout

```
PMF/
├── README.md                      # Entry point — reads "start with handoff.md"
├── definitions.md                 # Locked vocabulary / source-of-truth glossary
├── workflow.md                    # Stages 0–8 spec with per-step research questions + gate formulas
├── capability_inventory.md        # ~20 atomic capabilities + locked design decisions
├── flow.md                        # Thin skeleton of the pipeline (layer 1 overview)
├── handoff.md                     # Session entry point: current state, locked/open, kickoff prompts
├── handoff-granular-analysis.md   # Handoff for granular persuasion analysis run
├── handoff-crowdfunding-teardown.md  # Handoff for crowdfunding teardown run
├── run-retrospective.md           # Post-run analysis: what manual runs taught, net-new patterns
├── capability_inventory.md        # ~20 atomic capabilities + locked design decisions
├── map/
│   └── data_inventory.md          # What each capability produces/consumes; joins; open schema questions
├── prompts/
│   └── step1-light-pass.md       # Draft agent + schema spec for Step 1 light pass (3-stage pipeline)
├── agents/
│   └── implementation-notes.md    # Parked notes for future agent specs (not specs themselves)
└── runs/
    └── eink-tablets/              # Worked example run (Pipeline B: product fixed, solving for niche)
```

---

## Top-Level Spec Files

**`README.md`**
- One paragraph overview + directory layout
- Sole purpose: orient a new session; points to `handoff.md` as the real entry point

**`definitions.md`**
- Locked vocabulary for the entire system (niche, transformation, market, PMBD, UM, angle, claim, feature, etc.)
- Never modified without explicit unlock; shared by all agents, analysts, and docs
- Format: clustered glossary — each term has a one-line definition, a test, 1–3 examples, and confusion notes

**`workflow.md`**
- Stages 0–8 full spec: research questions, gate formulas, pipeline variants (A/B/C/D), PMBD question battery
- The run spine; step structure is locked; research question depth follows original planning doc
- Cross-cutting sections at the bottom: execution principles, system constraints, reconciliation note

**`capability_inventory.md`**
- ~20 atomic capabilities tagged Op / Orch / Human / Under
- Contains the locked design decisions list (workflow ≠ agents; one universal classifier; VOC chain is 7 ops; etc.)
- Foundational Unders section: map/persistence layer (deprioritized as of 2026-05-21), authorship pass-through

**`flow.md`**
- Three-layer framing: flow (this doc) / agent prompts (layer 2) / technical implementation (layer 3)
- Thin skeleton of the pipeline — steps, order, purpose; no depth
- Useful for quick orientation; `workflow.md` has the substance

**`handoff.md`**
- Session entry point for Claude Code
- Sections: current state + what completed / 3-agent pattern locked / what to read in order / what's locked / what's open / what comes next / what NOT to do / session scope discipline / kickoff prompts (bottom)
- Kickoff prompts at the bottom are ready-to-paste into a fresh session to launch a market scan

**`handoff-granular-analysis.md`**
- Handoff for the per-brand granular persuasion analysis + per-market sales-message playbook run
- References tooling already on disk under `runs/eink-tablets/scripts/`

**`handoff-crowdfunding-teardown.md`**
- Handoff for the crowdfunding teardown run
- References `crowdfund-fetch.js` and the 3-brief pipeline (finder → dumper → teardown synth)

**`run-retrospective.md`**
- Mined from 14 session transcripts; surfaces what manual runs taught that is NOT yet in `workflow.md`
- Sections: orchestration layer / durable tooling built / deliverable templates / net-new methodology / strategy findings / Kam's data preferences / process learnings / fold-where recommendations

---

## `map/` Directory

**Purpose:** Persistence layer design artifacts (foundational Under — not yet built)

- `map/data_inventory.md` — what every capability produces and consumes; implicit entities (brand_id, market_id, voc_record_id, etc.); open questions for persistence model design

---

## `prompts/` Directory

**Purpose:** Emerging agent prompt specs; one file currently

- `prompts/step1-light-pass.md` — draft 3-stage pipeline spec (Finder → Roster Verifier → Dumper → Space Classifier) with schema contract and determinism principle

---

## `agents/` Directory

**Purpose:** Parked implementation notes for eventual agent specs; not specs themselves

- `agents/implementation-notes.md` — per-brand extractor corrections from the eink-tablets run (layer-conflation examples, claims-vs-features split, problem-mechanism vs Problem-UM, sub-niche capture, competitive-set scoping); market aggregator corrections (output per market cell, saturation is per-market only)

---

## `runs/` Directory

**Purpose:** Manual research run artifacts — the de-facto persistence layer

Each run is `runs/<space>/`. The only worked example is `runs/eink-tablets/`.

---

## `runs/eink-tablets/` — Worked Example Structure

```
runs/eink-tablets/
├── brands.md                      # Initial brand roster (Step 0 sweep)
├── brands/                        # Per-brand shallow records (Step 0 extraction)
│   ├── Boox.md
│   ├── Daylight.md
│   ├── KindleScribe.md
│   └── ... (31 brands total, CamelCase filenames)
├── adlibrary/                     # Raw Meta Ad Library data per brand
│   ├── <Brand>.png                # Screenshot of ad library page
│   ├── <Brand>.txt                # Extracted text
│   ├── <Brand>_adv.png            # Advanced/detail view screenshot
│   └── <Brand>_adv.txt            # Advanced/detail view text
├── crowdfunding-scan.md           # 16-row seed list of crowdfunded campaigns
├── market-map.md                  # Cross-brand transformation/niche map
├── market-opportunity.md          # Cross-market Gate-1 comparison; bet-selection artifact
├── markets/                       # Per-market scan outputs (Stage 2 pattern)
│   ├── faith/
│   │   ├── finder-brief.md        # Beta prompt for Finder agent
│   │   ├── analyzer-brief.md      # Beta prompt for Analyzer agents
│   │   ├── aggregator-brief.md    # Beta prompt for Aggregator agent
│   │   ├── competitive-set.md     # Approved competitor roster
│   │   ├── faith-market-profile.md  # Final deliverable (cells, saturation, whitespace, Gate-1 dossier)
│   │   └── brands/                # Per-brand analysis records for this market
│   │       ├── remarkable.md
│   │       ├── daylight.md
│   │       └── ... (market-specific delta records for incumbents, full records for new brands)
│   ├── students/                  # Same structure as faith/
│   └── dumb-device/               # Same structure as faith/
├── marketing-corpus/              # Deep Step 2 marketing study per brand
│   ├── <brand>/
│   │   ├── landing-pages.md       # Source file — LP copy, structure, sections verbatim
│   │   ├── meta-ads.md            # Source file — ad copy, days_running, transformation, angle, awareness
│   │   ├── funnel-mechanics.md    # Source file — offer/bundle structure, checkout, guarantees
│   │   ├── partnerships.md        # Source file — press, celebrity, co-dev relationships
│   │   ├── notes.md               # Source file — researcher observations
│   │   ├── granular-analysis.md   # Generated output — 13-section persuasion analysis
│   │   ├── winning-message-analysis.md  # Generated output — 7-section portability-oriented extraction
│   │   ├── raw/                   # Timestamped raw fetches (.html, .txt, .err.txt)
│   │   └── screenshots/           # Timestamped screenshot captures (.html, .png, .txt)
│   ├── markets/                   # Per-market playbook outputs (cross-brand synthesis)
│   │   ├── M1-paper-replacement/
│   │   ├── M2-calm/
│   │   ├── M3-student-notetaking/
│   │   └── M4-general-purpose-tablet/
│   └── birdseye-map.md            # Cross-brand transformation cells map (16 cells × 10 brands)
├── crowdfunding-corpus/           # Crowdfunding campaign teardown data
│   ├── <slug>/
│   │   ├── campaign-body.md       # Hero copy, description, reward structure verbatim
│   │   ├── tiers.md               # Reward tiers, prices, limits
│   │   ├── chronology.md          # Raise progression over time
│   │   ├── comments.md            # Backer comments, objections
│   │   ├── pre-launch.md          # Pre-launch email list evidence
│   │   ├── press.md               # Press coverage captured
│   │   ├── outcome.md             # Final raise, backer count, verdict
│   │   ├── updates.md             # Campaign updates
│   │   ├── notes.md               # Researcher notes
│   │   └── raw/                   # Raw fetched files (timestamped .html, .txt, .png)
│   └── ... (12 campaigns: bigme-galy, dasung-not-ereader-7, diptyx, eewrite-epad,
│           freewrite-smart, freewrite-traveler, iflytek-ainote2, modos-paper,
│           reinkstone-r1, viwoods-aipaper, zerowriter-fold, zerowriter-ink)
├── eink-category-evolution/       # Category-evolution / wedge analysis (distinct from cross-sectional scan)
│   ├── evolution-profile.md       # Cross-brand chronological synthesis: claim lifecycle, wedge timing
│   ├── transformations-flat-map.md  # Foldable × transformation whitespace cross-tab
│   └── brands/                    # Per-brand evolution records (9 brands with wedge/UM/raise data)
│       ├── viwoods-aipaper.md
│       ├── diptyx.md
│       └── ...
└── scripts/                       # Briefs (beta agent prompts) + fetch scripts for this run
    ├── analyzer-framework.md      # Shared vocabulary spine read by every analyzer agent
    ├── analyzer-brief.md          # Generic analyzer brief template
    ├── aggregator-brief.md        # Aggregator brief (replaced by per-market versions)
    ├── birdseye-synthesizer-brief.md  # Brief for cross-brand birdseye synthesis
    ├── corpus-dumper-brief.md     # Brief for marketing corpus dump pass
    ├── pass0-fetch-brief.md       # Brief for supplementary fetch pass (screenshots + ad start-dates)
    ├── granular-analyzer-brief.md # Brief for 13-section per-brand granular analysis
    ├── market-playbook-brief.md   # Brief for per-market sales-message playbook synthesis
    ├── crowdfund-finder-brief.md  # Brief for crowdfunding campaign roster
    ├── crowdfund-dumper-brief.md  # Brief for per-campaign verbatim dump
    ├── crowdfund-teardown-brief.md  # Brief for crowdfunding teardown synthesis
    ├── adlib-one.js               # Meta Ad Library fetcher (enriches days_running / start-date)
    ├── adlib-sweep.js             # Meta Ad Library batch sweep
    ├── crowdfund-fetch.js         # Playwright fetcher — bypasses Cloudflare/SPA blocks
    ├── sw-login.js                # SimilarWeb login script
    ├── sw-sweep.js                # SimilarWeb sweep script
    └── explore-typeahead.js       # Typeahead exploration script
```

---

## Naming Conventions

**Run directories:**
- Lowercase, hyphenated: `runs/eink-tablets/`, `runs/<space>/`
- Space name should be the product category or hypothesis space

**Brand records (shallow Step 0):**
- CamelCase at the top level: `brands/Boox.md`, `brands/KindleScribe.md`
- Lowercase-hyphenated within market subdirectories: `markets/faith/brands/kindle-scribe.md`

**Market directories:**
- Lowercase-hyphenated slug: `markets/faith/`, `markets/dumb-device/`

**Market profile deliverable:**
- `<slug>-market-profile.md` inside the market directory: `markets/faith/faith-market-profile.md`

**Ad library files:**
- `<Brand>.png` / `<Brand>.txt` — base view
- `<Brand>_adv.png` / `<Brand>_adv.txt` — advanced/enriched view
- Lowercase-hyphenated for keyword-searched variants: `boox-kw_adv.png`

**Crowdfunding campaign directories:**
- Lowercase-hyphenated slug matching campaign name: `crowdfunding-corpus/viwoods-aipaper/`

**Marketing corpus directories:**
- Lowercase-hyphenated brand + variant: `marketing-corpus/daylight-dc1/`, `marketing-corpus/remarkable-wayback/`

**Raw fetch files:**
- Timestamped ISO format: `lp-2026-05-24T21-56-38.html`, `campaign-2026-05-24T19-38-51.txt`

**Scripts (briefs):**
- Lowercase-hyphenated + `-brief.md`: `granular-analyzer-brief.md`, `crowdfund-finder-brief.md`

**Source vs generated output distinction:**
- Source files (5 per brand): `landing-pages.md`, `meta-ads.md`, `funnel-mechanics.md`, `partnerships.md`, `notes.md`
- Generated outputs (in same dir): `granular-analysis.md`, `winning-message-analysis.md`
- This distinction is load-bearing — never mix source and generated content

---

## Where to Add New Code / Artifacts

**New research run:**
- Create `runs/<space>/` directory
- Start with `runs/<space>/brands/` for Step 0 shallow records
- Add `runs/<space>/scripts/analyzer-framework.md` as the shared spine before running any analyzer
- Kickoff prompt pattern: paste from bottom of `handoff.md`

**New market scan (Stage 2) within an existing run:**
- Create `runs/<space>/markets/<slug>/`
- Create `finder-brief.md`, `analyzer-brief.md`, `aggregator-brief.md` briefs
- Create `brands/` subdir for per-brand records
- Output goes to `<slug>-market-profile.md`

**New deep marketing study (Step 2 depth):**
- Create `runs/<space>/marketing-corpus/<brand>/`
- Populate the 5 source files first, then generate outputs
- Raw fetches go in `raw/`, screenshots in `screenshots/`

**New crowdfunding teardown:**
- Create `runs/<space>/crowdfunding-corpus/<slug>/`
- Follow the 9-file schema: `campaign-body`, `tiers`, `chronology`, `comments`, `pre-launch`, `press`, `outcome`, `updates`, `notes` + `raw/`

**New agent brief:**
- Goes in `runs/<space>/scripts/<purpose>-brief.md`
- Every brief = role + inputs (which files to read) + hard rules + output schema + self-audit checklist + exact output path

**New framework spec (capability or workflow update):**
- Capabilities go in `capability_inventory.md`
- Workflow step changes go in `workflow.md` (structure locked; additions only)
- Never add new vocabulary — use `definitions.md` terms or explicitly unlock and add there

**Handoff for a new session:**
- Update `handoff.md` current state section
- Add/update kickoff prompts at the bottom
- If a distinct analysis type, create `handoff-<analysis-type>.md`

---

## Key File Locations

**Entry points (always read first):**
- `handoff.md` — current state + kickoff prompts
- `definitions.md` — locked vocabulary
- `workflow.md` — stage definitions and research questions

**Worked examples:**
- `runs/eink-tablets/markets/faith/faith-market-profile.md` — canonical market-scan deliverable
- `runs/eink-tablets/scripts/analyzer-framework.md` — canonical shared analyzer spine
- `runs/eink-tablets/marketing-corpus/daylight-dc1/` — canonical deep marketing corpus structure

**Decision artifacts:**
- `runs/eink-tablets/market-opportunity.md` — cross-market Gate-1 comparison; the bet-selection artifact
- `runs/eink-tablets/eink-category-evolution/evolution-profile.md` — category-evolution / wedge analysis

**Durable tooling:**
- `runs/eink-tablets/scripts/crowdfund-fetch.js` — reusable Playwright fetcher (bypasses Cloudflare/SPA)
- `runs/eink-tablets/scripts/adlib-one.js` — Meta Ad Library fetcher with `days_running` enrichment

---

*Structure analysis: 2026-06-01*
