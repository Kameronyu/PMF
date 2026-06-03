# Technology Stack

**Analysis Date:** 2026-06-01

## What This Is

This is not a software product. It is a **DR marketing / ecommerce research and ad-generation
framework** built from markdown specs, prompt assets, Playwright-based scraping scripts, and
manually produced research "runs." There is no package.json at the repo root, no build system,
no server, and no runtime in the traditional sense.

The "stack" is: a conceptual framework encoded in markdown, LLM agents that execute against those
specs, a small set of Node.js/Playwright scripts for deterministic data collection, and a
directory-tree as the persistence layer (for now).

---

## Framework Spec Layer (the locked core)

These files define what the system does and how it thinks. They are the closest analog to
"source code" — editing them changes system behavior for every downstream agent invocation.

**Core spec files:**
- `definitions.md` — locked vocabulary (Niche, Transformation, Market, PMBD, UM, etc.). Canonical
  reference for all agents and humans. Never modify without a version note.
- `workflow.md` — step structure (Step -1 through 8), research questions per step, gap
  formula, pipeline variants A/B/C/D. Locked structure; research-question depth locked.
- `capability_inventory.md` — ~20 atomic capabilities tagged Op/Orch/Human/Under. Locked
  decisions section governs agent design constraints.
- `flow.md` — thin skeleton of what happens and in what order, three-layer model (Flow /
  Agent prompts / Technical implementation).
- `map/data_inventory.md` — full enumeration of capability inputs/outputs, entity IDs, join
  patterns, and open schema questions. Basis for eventual persistence-layer design.
- `handoff.md` — session entry point. Carries current state, locked decisions, what's open,
  and kickoff prompts. Updated after each run arc.
- `README.md` — layout guide, points to everything else in reading order.
- `agents/implementation-notes.md` — non-spec notes from manual runs; inputs for future
  per-brand-extractor and market-aggregator agent specs.
- `run-retrospective.md` — surfaced patterns from 14 mined session transcripts; signals not
  yet folded into `workflow.md`.

---

## Prompt / Agent Asset Layer

Prompt files are agent instructions — they define what an LLM does when invoked as a
capability. They carry role, input contracts, hard rules, output schemas, self-audit
checklists, and exact output paths.

**Canonical prompt:**
- `prompts/step1-light-pass.md` — full agent spec for the Step 1 light pass: Finder +
  Roster Verifier + Dumper + Space Classifier agents, plus deterministic scaffold (scripts +
  hooks), JSON schemas for `brands.json`, `dump.json`, and `space-map.json`, and closed
  enums that hook-validate.

**Per-run beta prompts (eink-tablets arc, not locked agent specs):**
- `runs/eink-tablets/scripts/analyzer-framework.md` — shared spine for all analyzer agents.
  Every per-market analyzer reads this file; methodology fixes live here, not per-market.
- `runs/eink-tablets/scripts/analyzer-brief.md` — per-competitor analyzer brief.
- `runs/eink-tablets/scripts/corpus-dumper-brief.md` — verbatim corpus dumper brief.
- `runs/eink-tablets/scripts/birdseye-synthesizer-brief.md` — cross-brand space synthesizer.
- `runs/eink-tablets/scripts/crowdfund-finder-brief.md` — crowdfunding campaign roster builder.
- `runs/eink-tablets/scripts/crowdfund-dumper-brief.md` — per-campaign verbatim dump.
- `runs/eink-tablets/scripts/crowdfund-teardown-brief.md` — teardown synthesizer (playbook output).
- `runs/eink-tablets/scripts/granular-analyzer-brief.md` — per-brand deep persuasion inventory.
- `runs/eink-tablets/scripts/market-playbook-brief.md` — per-market playbook synthesizer.
- `runs/eink-tablets/scripts/pass0-fetch-brief.md` — corpus gap-fill fetch coordinator.
- `runs/eink-tablets/markets/faith/finder-brief.md` — market-specific finder brief (Faith).
- `runs/eink-tablets/markets/faith/analyzer-brief.md` — market-specific analyzer brief (Faith).
- `runs/eink-tablets/markets/faith/aggregator-brief.md` — market-specific aggregator brief (Faith).

**Brief template pattern (from `run-retrospective.md`):**
Every brief = role + inputs (which files to read) + hard rules + output schema +
self-audit checklist + exact output path.

---

## Scripting Layer (deterministic, not LLM)

Node.js / Playwright scripts that perform deterministic data collection. Agents are
explicitly forbidden from doing this work — the principle is "anything that can be
deterministic is pulled OUT of agents into scripts."

**Runtime:**
- Node.js v20.20.0 (system install)
- Playwright 1.59.1 (installed globally at `~`, not inside the repo)
- No `package.json` in the repo root; no lockfile; no local `node_modules`
- Playwright uses system Chromium 1217

**Scripts:**
- `runs/eink-tablets/scripts/adlib-one.js` — Meta Ad Library fetcher by advertiser Page ID.
  Resolves brand → pageID via typeahead, queries `view_all_page_id`, scrapes active ad count
  + full ad dump. Writes `adlibrary/<slug>_adv.txt` + `_adv.png`.
- `runs/eink-tablets/scripts/adlib-sweep.js` — batch variant of `adlib-one.js` for sweeping
  multiple brands.
- `runs/eink-tablets/scripts/crowdfund-fetch.js` — Playwright-based fetcher for Kickstarter,
  Indiegogo, Crowd Supply, BackerKit. Bypasses Cloudflare 403s + JS-rendered SPAs. Clicks
  "load more" on comments ×5. Outputs `.html` + `.txt` + `.png` per fetch. Supports
  `--type=campaign|comments|updates|risks|faq`.
- `runs/eink-tablets/scripts/sw-login.js` — opens a headed Chromium with persistent profile
  for SimilarWeb auth. Saves session to `~/.cache/pmf-sw-profile`.
- `runs/eink-tablets/scripts/sw-sweep.js` — SimilarWeb traffic sweep across a list of brand
  domains (screenshot + innerText). Reads the persistent profile written by `sw-login.js`.
- `runs/eink-tablets/scripts/explore-typeahead.js` — diagnostic script for Meta Ad Library
  typeahead behavior.
- `runs/eink-tablets/scripts/rerun-adv.sh` — shell loop that re-runs `adlib-one.js` for
  a fixed list of brands with known Page IDs. Single bash script.

**Permission model:**
`/.claude/settings.json` carries an explicit `allow` list of Bash commands the Claude agent
may invoke. Every script invocation is pre-approved per slug + URL. New scripts or new
target URLs require a new allow entry.

---

## File Format Conventions

The framework uses file format as semantic signal — format encodes the type of artifact.

**Spec / doctrine files (`.md` in repo root and `map/`, `agents/`, `prompts/`):**
- Human-readable, human-editable specs and vocabulary
- Locked or versioned — don't edit without a note

**Agent brief files (`.md` in `scripts/` and `markets/<slug>/`):**
- Prompt files for LLM agents; structured as role + rules + schema + output path
- "Beta prompts for this run" — not locked agent specs (locked specs gated on persistence layer)

**Per-competitor brand records (`.md` in `markets/<slug>/brands/`):**
- Structured markdown with defined section headers per `analyzer-framework.md`
- Schema includes: Transformation, Niche, Claims (base/enhanced), Features, Mechanism,
  Problem-Mechanism, UM (sub-type or "none"), Angle, Value Models, Trust Signals,
  Buyer Characterization, Sophistication stage, Ad Library findings

**Market profiles (`.md`, e.g., `markets/faith/faith-market-profile.md`):**
- Aggregated deliverable for a market cell. Contains: competitive-set roster, claim
  saturation per cell, differentiation whitespace, Gate 1 evidence dossier.

**Raw corpus artifacts (`.html`, `.txt`, `.png` in `*/raw/`):**
- Machine-collected, not human-edited
- Naming: `<type>-<ISO-timestamp>.{html,txt,png}`
- Produced by Playwright scripts; `.txt` is visible-text dump; `.png` is screenshot

**Ad Library output (`.txt`, `.png` in `adlibrary/`):**
- Produced by `adlib-one.js`; naming: `<slug>_adv.txt` + `<slug>_adv.png`
- Content: resolved advertiser name, pageID, active ad count, full body innerText

**Crowdfunding corpus (`.html`, `.txt`, `.png` in `crowdfunding-corpus/<slug>/raw/`):**
- Produced by `crowdfund-fetch.js`; same triple-file pattern

---

## Persistence Layer (current state)

No database, no structured store. The filesystem is the de facto persistence layer:
- Per-brand `.md` records under `markets/<slug>/brands/`
- Market profile `.md` files at `markets/<slug>/<slug>-market-profile.md`
- Raw artifacts under `*/raw/`
- No cross-run joins, no author-keyed VOC, no copy bank yet

This is explicitly acknowledged as temporary (see `capability_inventory.md` → Foundational
Unders). The map/persistence layer design is in `map/data_inventory.md` but not built.
Tooling is built just-in-time after shipping brands.

---

## LLM / AI Layer

The framework is LLM-driven — Claude (Claude Code / Claude agent SDK) is the execution
runtime for all agent capabilities. No local models.

**Execution pattern:**
- Main orchestrator Claude session reads handoff + spec files, spawns subagents for
  parallelizable work (one agent per brand analyzer, one agent per crowdfunding dumper)
- Subagents are ephemeral — only `.md` artifacts persist; subagent context does not
- `run_in_background: true` used for parallel analyzer waves

**Agent design constraints (from `capability_inventory.md` locked decisions):**
- Workflow ≠ agents (capabilities are the unit of design; agent clustering is per-spec)
- Per-brand extractor stays shallow; depth comes from composing multiple capabilities
- Classifier: one universal schema; N/A valid for any field; source metadata preserved
  through every link

**Hook enforcement (from `prompts/step1-light-pass.md`):**
- PostToolUse hooks on Write validate agent outputs against schema rules (e.g., Dumper
  cannot set `canonical_niche != null`; claims must be verbatim substrings of clean corpus)
- Enforced by Claude Code hooks, not agent honor system

---

## What Does Not Exist

- No `package.json`, `requirements.txt`, or lockfile at repo root
- No build system, bundler, or compiler
- No local database
- No web server or API
- No frontend
- No CI/CD pipeline
- No test suite
- No deployment target

---

*Stack analysis: 2026-06-01*
