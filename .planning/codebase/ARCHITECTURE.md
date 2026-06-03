# Architecture

**Analysis Date:** 2026-06-01

## What This Repo Is

This is not a software codebase. It is a **DR marketing / ecommerce research and ad-generation framework** built from markdown spec files, prompt/agent briefs, and manual research "runs." There is no compiled code at the top level beyond a few Playwright-based fetch scripts. The "architecture" is a staged research pipeline from product hypothesis to winning ad messages.

---

## Pattern Overview

**Overall:** Multi-stage research pipeline with human decision gates

**Key Characteristics:**
- Stages 0–8 describe the research sequence; GSD "Steps" are execution units (separate naming convention)
- `definitions.md` is the locked vocabulary that every agent, analyst, and document shares — never modified without explicit unlock
- Work products are `.md` files under `runs/<space>/`; they are the de-facto persistence layer until a formal map layer is built
- Agents are Claude Code subagent invocations, not persistent processes; they read briefs from `scripts/`, write `.md` artifacts, and terminate
- The system is in Milestone 1 (Stages 0–3, research system); Stages 4–8 are stubbed but not built

---

## Pipeline Stages

### Stage 0 — Map a Space
- **Purpose:** Produce a populated map of a product/niche/transformation space to spot opportunity; output is a map, not a hypothesis
- **Entry point:** Human provides T (transformation), P (product), or N (niche) seed — at least one required
- **Key capabilities:** Per-brand extractor, Market aggregator, Trend/temporal signal
- **Gate:** Gap Score = `[(Desire to Solve × D2C Feasibility) − Market Sophistication] × Market Growth`
- **Output artifacts:** `runs/<space>/brands/<Brand>.md` (per-brand records), `runs/<space>/market-map.md`, `runs/<space>/market-opportunity.md`

### Stage 1 — Theorize / Hypothesis Selection
- **Purpose:** Given a space map, solve the unsolved T/P/N variables; select the market hypothesis to pursue
- **Entry:** Human reads the populated map and picks a bet (explicit step, not automated glue)
- **Pipelines:** A (transformation-first), B (product-first — current Inkleaf path), C (niche-first), D (product variation for new transformation)
- **Output:** Candidate market(s) to study deeply

### Stage 2 — Competition (Deep Market Study)
- **Purpose:** Study the chosen market with full depth; evaluate sophistication and identify the winnable gap
- **Key capabilities:** Ad creative + visual extractor, Offer/bundle structure extractor, Channel analysis, VOC chain scoped to competitor reviews
- **Agent pattern:** `finder → analyzers (parallel, one per competitor) → aggregator`
- **Gate:** Gate 2 ("Winnable?") — human judgment against framework after deep research
- **Output artifacts:** `runs/<space>/markets/<slug>/brands/<brand>.md`, `runs/<space>/markets/<slug>/competitive-set.md`, `runs/<space>/markets/<slug>/<slug>-market-profile.md`, `runs/<space>/marketing-corpus/<brand>/` with 5 source files + generated outputs

### Stage 3a — Structural Map of Themes (VOC Frequency)
- **Purpose:** Identify which PMBD themes, frames, and emotions are most frequent in the avatar
- **Three search lanes:** transformation-only (population-wide), transformation inside the niche, adjacent context inside the niche
- **Output:** Ranked themes by prevalence; drives angle selection in Stage 4

### Stage 3b — Verbatim Language Bank
- **Purpose:** Capture actual words the avatar uses around each theme; the copy bank
- **Output:** `copy-bank.md` organized by theme / sub-niche / PMBD layer, with source metadata preserved

### Stage 3c — UM Research
- **Purpose:** Understand the transformation factually — causes, pathways, product candidates, feasibility
- **Output:** Mechanism research doc, product candidate list

### Stage 3d — Loop Back
- **Purpose:** Orchestration step; revise Stage 0/1 based on Stages 2/3 findings

### Stages 4–8 — Test Design → Execution
- **Stage 4:** Test design — define macro test (market × product), micro tests (angles per sub-avatar), pull exact language from copy bank
- **Stage 5:** Hook test — white-square preview; use `days_running` as spend-validated winner proxy
- **Stage 6:** Build-a-brand — 7–12 creatives, funnel build, belief architecture
- **Stage 7:** Eval — kill gates, rotation rules
- **Stage 8:** Iterate or destroy — return verdict to Stage 0 map or commit to scale

---

## Agent Execution Pattern (3-Agent Scan)

The run pattern locked during the Inkleaf eink-tablets run:

```
Finder agent
  → roster checkpoint (human approves competitor list)
  → Analyzer agents (parallel, one per competitor, background invocations)
  → Aggregator agent
  → profile checkpoint (human approves market profile)
```

Rules that govern this pattern:
- One job per subagent — analyzers may not read sibling brand records or the birdseye map (per-brand isolation enforced, not just requested)
- Only `.md` artifacts persist; subagent invocations are ephemeral
- A shared framework file (`scripts/analyzer-framework.md`) is read by every analyzer; corrections propagate by editing one file
- Agents crash at ~60–65 tool uses; run in waves of 5, write incrementally after each section
- When a subagent is blocked (e.g., `node` script sandbox-blocked), the orchestrator runs the fetch, saves raw artifacts, and re-launches the agent pointed at them

---

## Data Flow

### Raw sources → Analysis docs → Ad outputs

1. **Raw acquisition:** Playwright scripts (`scripts/adlib-one.js`, `scripts/crowdfund-fetch.js`) fetch landing pages, Meta Ad Library data, Kickstarter campaigns → saved as timestamped `.html`, `.png`, `.txt` in `raw/` subdirs
2. **Per-brand extraction:** Agent reads raw/clean copy files, writes structured `.md` brand record with transformation, niche, mechanism, claims, features, ad data, sophistication signals
3. **Market aggregation:** Aggregator agent reads all per-brand records within a market cell, produces `<slug>-market-profile.md` with claim-saturation table, differentiation whitespace, Gate-1 evidence dossier, price-band comparison
4. **Deep marketing corpus:** For Step 2 brands — separate `marketing-corpus/<brand>/` with 5 source files (`landing-pages.md`, `meta-ads.md`, `funnel-mechanics.md`, `partnerships.md`, `notes.md`) + generated outputs (`granular-analysis.md`, `winning-message-analysis.md`)
5. **Cross-space synthesis:** `market-map.md`, `market-opportunity.md`, `eink-category-evolution/evolution-profile.md`, `eink-category-evolution/transformations-flat-map.md` — written from aggregated brand records, not fresh research
6. **Ad/copy outputs (downstream):** Stage 4 test design pulls verbatim language from the Stage 3b copy bank; Stage 6 builds creatives from that material

### Key data contracts

- **Source metadata is non-negotiable:** every VOC record preserves `platform`, `venue`, `author_id`, `url`, `timestamp`, `engagement` — required for the 5+ co-occurrence rule (sub-niche validation)
- **SYNTHESIS blocks are flagged:** any AI-invented message is fenced and labeled, kept separate from verbatim competitor copy — data-integrity rule for every deliverable
- **Exact figures or "not found"** — no hand-waving; fields must be filled verbatim or explicitly marked absent
- **`days_running` / longest-running ad** is the primary spend-validated winner proxy for Stage 2 and Stage 5

---

## Layers

**Layer 1 — Flow (`flow.md`):**
- Purpose: Thin skeleton — steps, order, purpose; entry point for understanding sequence at a glance
- Depends on: `workflow.md` for depth

**Layer 2 — Workflow (`workflow.md`):**
- Purpose: Full step structure + per-step research questions + gate formulas; the run spine
- Contains: Stages 0–8 definitions, pipelines A/B/C/D, PMBD question battery, gap formula, gate criteria
- Locked: Step structure and `definitions.md` vocabulary are locked; research question depth follows original planning doc

**Layer 3 — Capabilities (`capability_inventory.md`):**
- Purpose: ~20 atomic capabilities tagged Op/Orch/Human/Under; what each accepts and produces
- Contains: Locked decisions (workflow ≠ agents; universal classifier; cleaner dumb-first; VOC chain is 7 ops, not one)
- Note: persistence layer is deprioritized; build just-in-time when manual friction justifies it

**Layer 4 — Data (`map/data_inventory.md`):**
- Purpose: What every capability produces, what every research question consumes, joins between them
- Status: Working enumeration; persistence model not yet designed

**Agent layer (`agents/implementation-notes.md`, `runs/<space>/scripts/*.md`):**
- Purpose: Parked notes for eventual agent specs + run-specific beta prompts
- Status: Run-specific briefs are beta prompts, not locked specs; locked agent specs gated on map layer (deprioritized)

---

## Vocabulary / Source of Truth Hierarchy

In order of authority:
1. `definitions.md` — locked vocabulary; never modify without explicit unlock
2. `workflow.md` — step structure + research questions; structure locked, questions expandable
3. `capability_inventory.md` — capability definitions + locked decisions (list at bottom of file)
4. `handoff.md` — current state, what's locked vs open, kickoff prompts; session entry point
5. Agent briefs / run artifacts — beta prompts and outputs; NOT locked decisions

---

## Entry Points

**Starting a new run:**
- Read `handoff.md` first (explicitly calls this out in README.md)
- Then read `definitions.md`, `workflow.md`, `capability_inventory.md` in that order
- Read the worked example: `runs/eink-tablets/markets/faith/faith-market-profile.md`
- Read the shared analyzer framework: `runs/eink-tablets/scripts/analyzer-framework.md`
- Kickoff prompts for specific sessions are at the bottom of `handoff.md`

**Starting from a specific Stage:**
- Stage 0 map: look at `runs/eink-tablets/brands.md` and `runs/eink-tablets/market-map.md` as worked examples
- Stage 2 market scan: look at `runs/eink-tablets/markets/faith/` as the complete worked example (finder/analyzer/aggregator briefs + per-brand records + market profile)
- Stage 2 deep marketing study: look at `runs/eink-tablets/marketing-corpus/daylight-dc1/` as the worked example

---

## Cross-Cutting Concerns

**Human decision gates (not automatable):**
- Hypothesis selection (Stage 0 → Stage 1): human reads map, picks bet
- Gate 2 Win-decision: human judges against framework after deep research
- Macro test selection (Stage 4): same product × new markets or same market × new products
- Variable definition and sub-niche declaration

**Tooling philosophy:**
- Build just-in-time; automate a step only when it becomes the repeated bottleneck
- Dumb, modular versions first (30-line cleaner script, not a sophisticated NLP pipeline)
- Claude Code IS the orchestrator; stage prompts become `.claude/commands/*.md` slash commands (stated intent, not yet built)

**Naming split:**
- GSD = "Steps" (execution units)
- Research content = "Stages" 0–8 (workflow content)
- Milestone split: M1 = research system (Stages 0–3), M2 = test pipeline (Stages 4–8)

---

*Architecture analysis: 2026-06-01*
