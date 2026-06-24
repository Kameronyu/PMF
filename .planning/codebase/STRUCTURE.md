# Codebase Structure

**Analysis Date:** 2026-06-24

## Directory Layout

```
PMF/
├── .claude/
│   ├── skills/                  # Claude skill orchestrators (deployed agent prompts)
│   │   ├── asset-classify/      # Asset classification pipeline orchestrator
│   │   ├── copywriter/          # DR copywriter agent
│   │   ├── funnel-architect/    # Funnel design agent
│   │   ├── funnel-deep-pass/    # Funnel collection orchestrator
│   │   ├── market-selection/    # NTP gate 1 + ranking agent
│   │   ├── pipeline-audit/      # Adversarial soundness audit orchestrator
│   │   └── reddit-extract/      # Headless Reddit thread extractor
│   └── worktrees/               # Git worktree support
├── .planning/
│   ├── audit/                   # Retro audit documents (run chronology, spec drift, etc.)
│   ├── codebase/                # Codebase maps (this file)
│   ├── intel/                   # Strategic intel documents
│   ├── phases/                  # Per-phase GSD plans and summaries
│   │   └── <NN>-<stage-slug>/   # e.g. 01-stage-m1-s1-light-pass/
│   │       ├── <NN>-NN-PLAN.md
│   │       ├── <NN>-NN-SUMMARY.md
│   │       └── <NN>-CONTEXT.md
│   └── quick/
│       └── <date-id>/           # Quick-plan sessions (PLAN.md + SUMMARY.md)
├── .venv/                       # Python virtualenv (gitignored)
├── _quarantine/                 # Deprecated/quarantined agent prompts (01-finder.md … 11-comprehend-video.md + media files)
├── ads/                         # Meta ad library raw dumps per brand
│   └── <slug>.json              # Ads JSON; <slug>_adv.txt also present
├── agents/                      # Implementation notes + run logs (not specs)
│   ├── funnel-deep-pass-run-notes.md
│   └── implementation-notes.md  # Working notes on per-brand extractor + aggregator design
├── assets/                      # Asset classifier runtime media (gitignored)
│   ├── raw/                     # Raw media copies
│   ├── work/                    # Downscaled work copies
│   └── raw-manifest.json        # Asset manifest (gitignored)
├── corpus/                      # Per-brand fetched + cleaned research data
│   └── <brand-slug>/
│       ├── raw/                 # Raw HTML (gitignored — reproducible via fetch.js)
│       ├── clean/               # Normalized text
│       └── dump.json            # Brand record (output of Dumper agent)
├── map/
│   └── data-model-notes.md      # IO schemas, implicit entities, architectural constraints
├── marketing-lens/
│   ├── MAP.md                   # Pipeline map: step-by-step agent/script orientation
│   └── prompts/                 # Per-agent prompt files (01-finder.md … 11-comprehend-video.md)
├── prompts/
│   ├── _generated/              # Auto-generated DR context injections
│   ├── _specs/                  # Spec documents for built + specced-but-unbuilt bricks
│   ├── _templates/              # Prompt templates (pre-research-plan.template.md)
│   ├── funnel-deep-pass.md      # Section Analyzer schema + per-section prompts
│   └── step1-light-pass.md      # Finder + Roster Verifier + Dumper + Space Classifier chain
├── runs/
│   ├── _fixture/                # Test fixtures (committed; whitelisted in .gitignore)
│   │   └── funnels/             # Fixture funnel packages for testing
│   ├── arduview/                # Arduview product run space
│   │   ├── _audit/              # Pipeline audit reports (A and B reviewers)
│   │   ├── _marketing-decisions/ # Locked marketing decisions (markdown)
│   │   ├── _tooling/            # Run-specific CDP/deploy tooling scripts
│   │   ├── asset-classify/      # Asset classification outputs (records/, ranked.json, etc.)
│   │   ├── crowdfunding/        # Crowdfunding LP packages
│   │   ├── funnels/             # Assembled funnel packages + _index.json + _tally.json
│   │   ├── funnels-analyzer-out/ # Section Analyzer raw outputs
│   │   ├── funnels-assembled/   # Intermediate assembled funnels
│   │   ├── funnels-clean/       # Cleaned funnel text
│   │   ├── funnels-scored/      # Scored funnels
│   │   ├── site/                # Built landing page (index.html, deposit.html, styles.css, script.js)
│   │   ├── arduview-pre-research-plan.md
│   │   ├── market-selection.md
│   │   ├── space-map.json
│   │   ├── FUNNEL-DESIGN.md
│   │   ├── COPY-DRAFT.md
│   │   ├── BUILD-FEEDBACK.md
│   │   └── ANGLE-VALIDATION-AUDIT.md
│   └── eink-tablets/            # InkLeaf / eink-tablets product run space
│       └── inkleaf-deep-pass/   # Deep-pass funnel analysis outputs
│           ├── fetch/
│           ├── funnel/
│           ├── funnel-clean/
│           ├── BELIEFS.md
│           ├── CLEANED-COPY.md
│           ├── VISUAL.md
│           └── analyzer-context.md
├── tools/
│   ├── asset/                   # Python asset probe scripts
│   │   ├── probe.py             # Image metadata extractor
│   │   ├── probe_video.py       # Video metadata extractor
│   │   ├── sample_montage.py    # Contact sheet generator
│   │   ├── frame-grab.py        # Frame extraction
│   │   └── section-table.json   # Section table for asset routing
│   ├── hooks/                   # PostToolUse validators + DR injectors
│   │   ├── route.js             # Hook dispatcher (routes by filename)
│   │   ├── validate-finder.js
│   │   ├── validate-dumper.js
│   │   ├── validate-classifier.js
│   │   ├── validate-analyzer.js
│   │   ├── validate-asset-record.js
│   │   ├── validate-revenue.js
│   │   ├── inject-dr.js
│   │   ├── inject-funnel-architect-dr.js
│   │   ├── inject-market-selection-dr.js
│   │   └── inject-copywriter-dr.js
│   └── lib/
│       └── embed.js             # Embedding swap-point (Voyage REST or local stub)
├── brands.json                  # Brand roster with metadata + demand_trend (root-level)
├── capability_inventory.md      # Brick taxonomy, executor routing rules, locked decisions
├── CLAUDE.md                    # Project-level Claude instructions + naming rules
├── definitions.md               # Locked vocabulary (transformation, niche, UM, PMBD, etc.)
├── handoff-m1-build.md          # M1 build handoff document
├── handoff-step3-voc-build.md   # Step 3 VOC build handoff
├── README.md                    # System overview + step-by-step agent links
├── run-retrospective.md         # Run learnings not yet folded into bricks/specs
├── space-map.json               # Global space aggregate (root-level, from light pass)
└── workflow.md                  # Step 0–8 spec + research questions per step
```

## Directory Purposes

**`.claude/skills/`:**
- Purpose: Claude skill orchestrators — each skill is one pipeline segment with a judgment agent
- Contains: `SKILL*.md` files (orchestration + agent prompts), generated DR context files (`_dr-context.generated-*.md`)
- Key files: See architecture SKILL files per skill subdirectory
- Pattern: Skill file = orchestration only; schema lives elsewhere (prompts/_specs + hooks); never duplicate schema into skills

**`tools/`:**
- Purpose: All deterministic scripts (S-bricks) and hook validators (H-bricks)
- Contains: Node.js `.js` scripts for fetch/clean/score/store/assemble/validate, Python `.py` scripts for asset probing
- Pattern: Every script must be deterministic — no judgment logic. One job per file.

**`tools/hooks/`:**
- Purpose: PostToolUse gate validators + DR knowledge injectors
- Contains: `route.js` dispatcher + per-agent validators + per-skill DR injectors
- Pattern: Validators exit 0 (pass) or exit 2 + stderr (reject). `route.js` dispatches by filename pattern.

**`tools/lib/`:**
- Purpose: Shared library utilities used by multiple scripts
- Contains: `embed.js` (single embedding swap-point)

**`tools/asset/`:**
- Purpose: Python media processing chain (probe, sample, frame-grab)
- Contains: Python scripts + `section-table.json` (asset routing config) + `section-list.default.json`

**`prompts/`:**
- Purpose: Standalone agent prompts and spec documents not yet promoted to skills
- Contains: Built prompts (`step1-light-pass.md`, `funnel-deep-pass.md`), specs (`_specs/`), templates (`_templates/`), generated context (`_generated/`)
- Key: `prompts/_specs/` + `tools/hooks/validate-*.js` co-own schemas — hook is ground truth

**`corpus/`:**
- Purpose: Per-brand research data (fetched + cleaned)
- Contains: `raw/` (gitignored HTML), `clean/` (normalized text), `dump.json` (brand record)
- Pattern: One subdirectory per brand slug (e.g., `corpus/flipper-zero/`, `corpus/playdate/`)

**`runs/<space>/`:**
- Purpose: All output artifacts for one product research run — immutable once committed
- Contains: Funnel packages, analysis outputs, site builds, audit reports, market selection outputs
- Convention (no-overwrite-v1): Re-runs write `v2/` subdir or `-v2` suffix; v1 never mutated

**`ads/`:**
- Purpose: Raw Meta ad library dumps per competitor brand
- Contains: `<slug>.json` (structured ad data), `<slug>_adv.txt` (raw ad text)

**`marketing-lens/`:**
- Purpose: Orientation layer for the full pipeline — canonical prompt files + MAP.md index
- Contains: `MAP.md` (pipeline flow diagram, step-by-step agent/input/output), `prompts/` (01 through 11 agent files)

**`_quarantine/`:**
- Purpose: Deprecated prompt files removed from active use but kept for reference
- Contains: Old agent prompts (01-finder.md through 11-comprehend-video.md) + media assets
- Do not use as active prompts — use `.claude/skills/` and `prompts/` instead

**`.planning/`:**
- Purpose: GSD planning artifacts — phase plans, summaries, audit documents, codebase maps
- Contains: Subdirs per concern (phases, audit, intel, quick, codebase)
- Pattern: Phase plans in `.planning/phases/<NN>-<stage-slug>/`; quick plans in `.planning/quick/<date-id>/`

## Key File Locations

**Theory / Vocabulary (read before writing any agent or script):**
- `definitions.md` — locked vocabulary; every label an agent assigns must trace here
- `workflow.md` — Steps 0–8 spec, research questions, pipeline A/B/C/D
- `capability_inventory.md` — brick taxonomy, executor routing, locked decisions
- `map/data-model-notes.md` — IO schemas, implicit entity IDs, source-metadata constraint

**Active Agent Prompts:**
- `prompts/step1-light-pass.md` — Finder + Dumper + Space Classifier chain (Steps 0–1)
- `prompts/funnel-deep-pass.md` — Section Analyzer schema + section prompts
- `.claude/skills/market-selection/SKILL market selection.md` — NTP gate + ranking
- `.claude/skills/funnel-deep-pass/SKILL-funnel-deep-pass.md` — funnel collection orchestrator
- `.claude/skills/asset-classify/SKILL-asset-classify.md` — asset classification orchestrator
- `.claude/skills/pipeline-audit/SKILL.md` — audit orchestrator

**Hook Routing:**
- `tools/hooks/route.js` — entry point for all PostToolUse write validation

**Embedding / RAG:**
- `tools/lib/embed.js` — single swap-point; set `VOYAGE_API_KEY` for real embeddings

**Run Outputs (current active runs):**
- `runs/arduview/` — Arduview product (complete run through site build + audit)
- `runs/eink-tablets/inkleaf-deep-pass/` — InkLeaf eink-tablets deep-pass outputs

**Build Reference:**
- `runs/arduview/site/` — built landing page (index.html, deposit.html, styles.css, script.js, favicon.svg)
- `runs/arduview/_marketing-decisions/` — locked marketing decisions for Arduview

## Naming Conventions

**Files:**
- Scripts: `<job>-<verb>.js` (e.g., `funnel-assemble.js`, `asset-emit.js`, `validate-analyzer.js`)
- Skill files: `SKILL-<name>.md` or `SKILL.md` (one per skill directory)
- Prompt files: `<NN>-<agent-name>.md` (two-digit prefix for ordering, e.g., `07-section-analyzer.md`)
- Run artifacts: `UPPERCASE.md` for major deliverables (`FUNNEL-DESIGN.md`, `COPY-DRAFT.md`, `BELIEFS.md`)
- Per-funnel packages: `<brand-slug>-<hash>.json` (e.g., `divoom-79bf5e01.json`)

**Directories:**
- Brand slugs: lowercase-hyphenated (e.g., `flipper-zero`, `analogue-pocket`)
- Run spaces: lowercase-hyphenated product name (e.g., `arduview`, `eink-tablets`)
- Phase plan dirs: `<NN>-<stage-slug>` (e.g., `01-stage-m1-s1-light-pass`)
- Sub-pipeline output dirs within a run: lowercase-hyphenated descriptive name (e.g., `funnels-clean`, `asset-classify`)

**Vocabulary (enforced — see CLAUDE.md):**
- "Step" = PMF research step 0–8 (workflow.md)
- "Stage" = GSD build unit (M1-SN)
- "Phase" = GSD roadmap index only (Phase N = Stage M1-SN in ROADMAP.md)
- Never call a research step a Phase

## Where to Add New Code

**New S-brick (deterministic script):**
- Implementation: `tools/<job>-<verb>.js` (Node.js) or `tools/asset/<script>.py` (Python for media)
- Pattern: One job per file; no judgment logic; deterministic and resumable; sidecar `_*-log.txt` for errors

**New H-brick (hook validator):**
- Implementation: `tools/hooks/validate-<agent>.js`
- Register in: `tools/hooks/route.js` routing table (by output filename pattern)
- Pattern: Exit 0 = pass; exit 2 + stderr = reject

**New A-brick (agent skill):**
- Implementation: `.claude/skills/<skill-name>/SKILL-<name>.md`
- Schema: Define in `prompts/_specs/<spec-name>.md`; schema ground truth lives in the matching validator
- DR injection: add `tools/hooks/inject-<skill-name>-dr.js` if DR knowledge injection is needed

**New agent prompt (not yet a skill):**
- Implementation: `prompts/<NN>-<name>.md`
- Also add to: `marketing-lens/prompts/<NN>-<name>.md` + update `marketing-lens/MAP.md`

**New run space:**
- Create: `runs/<space>/pre-research-plan.md` (operator bet brief — first artifact)
- Follow: no-overwrite-v1 for all committed outputs under that space

**New phase plan:**
- Create: `.planning/phases/<NN>-<stage-slug>/`
- Files: `<NN>-01-PLAN.md`, `<NN>-CONTEXT.md` (at minimum)

## Special Directories

**`corpus/*/raw/`:**
- Purpose: Raw HTML fetched by `tools/fetch.js` per brand
- Generated: Yes (via `tools/fetch.js`)
- Committed: No (gitignored — reproducible)

**`assets/`:**
- Purpose: Asset classifier media runtime (raw copies + downscaled work copies)
- Generated: Yes (via `tools/asset-fetch.js` + `tools/asset/*.py`)
- Committed: No (gitignored)

**`runs/_fixture/`:**
- Purpose: Test fixture funnels for script and hook testing
- Generated: No — hand-curated
- Committed: Yes (explicitly whitelisted in `.gitignore` with `!runs/_fixture/**`)

**`_quarantine/`:**
- Purpose: Deprecated prompt files kept for provenance
- Generated: No
- Committed: Yes
- Note: Do not import from here — active prompts are in `.claude/skills/` and `prompts/`

**`.venv/`:**
- Purpose: Python 3.12 virtual environment for asset probe scripts
- Generated: Yes
- Committed: No (gitignored)
- Usage: `PEP 668` — invoke as `.venv/bin/python` explicitly

---

*Structure analysis: 2026-06-24*
