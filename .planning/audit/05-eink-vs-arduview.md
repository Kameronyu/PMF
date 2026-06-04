# 05 — E-Ink Era vs Arduview Boundary Audit

**Date:** 2026-06-04
**Sources:** git log (all commits), git show --stat on key commits, directory recon, targeted brand-name greps.

---

## 1. Resolved Boundary

**Branch `eink-phase0-run` is the current arduview work branch** — it diverged from `main` on 2026-06-03 at commit `18cf913` and every commit on it is Phase 15–17 tooling (Funnel Architect, Asset Classifier, LP Builder). The branch name is a misnomer: the e-ink era work was done pre-branch on old tooling (commits `df3af34` / `675e07f`, 2026-05-21 and 2026-06-01), which predates the current GSD scaffolding entirely.

**Arduview work started 2026-06-03** (commit `074d4fe` "docs(01-stage-m1-s1-light-pass): create phase plan"). The InkLeaf / e-ink-tablets era ended on 2026-06-01 and its run outputs were moved to `_quarantine/` in commit `ff5364b` (2026-06-03, "retire InkLeaf, rewrite GSD project").

**The two runs are distinct products with distinct brand names:**
- E-ink era: brand = **InkLeaf**, product = foldable e-ink tablet for analog-wellness / ADHD-student markets. Run outputs in `_quarantine/runs/eink-tablets/`.
- Arduview era: brand = **Arduview**, product = transparent programmable pocket console. Run outputs in `runs/arduview/`.

---

## 2. Three-Column Classification Table

### E-INK-ERA (candidate slop)

| Path | Files/Lines | Notes |
|------|-------------|-------|
| `_quarantine/runs/eink-tablets/` | 660 files (127 images + 533 text), ~330k lines | Full e-ink corpus: adlibrary dumps, brand profiles, market scans (Faith/Students/Dumb-Device), crowdfunding corpus. Already quarantined. |
| `_quarantine/archive/` | 4 files, ~485 lines | Deprecated session handoffs (2026-05-23), reference runs/eink-tablets/ as source of truth. |
| `launch/inkleaf-landing/` | ~40 files | InkLeaf Shopify LP HTML + assets. Brand: InkLeaf. Not arduview. |
| `launch/inkleaf-launch/` | ~22 files | InkLeaf launch runbook, Shopify/Klaviyo docs, `_deep-pass/` fetched InkLeaf LPs. Brand: InkLeaf. |
| `run-retrospective.md` | 251 lines | Explicitly titled "Inkleaf e-ink arc (2026-04-26 → 05-29)." Learnings reservoir from manual e-ink runs. Some content distilled into `workflow.md` / `agents/implementation-notes.md`; rest is e-ink-era context. |
| `agents/implementation-notes.md` | 52 lines | First line: "Populated from manual research runs — the first being the eink-tablets run." Content is e-ink-era agent notes. |
| `map/data_inventory.md` | 770 lines | Created 2026-05-21 (`df3af34`). No arduview references; models the old capability/workflow structure pre-GSD refactor. |
| `_quarantine/archive/handoff.md` + `handoff-granular-analysis.md` + `handoff-crowdfunding-teardown.md` | ~485 lines combined | E-ink era session handoffs explicitly referencing `runs/eink-tablets/markets/faith/`. |

### ARDUVIEW (current run)

| Path | Files/Lines | Notes |
|------|-------------|-------|
| `runs/arduview/` | all subdirs | All run output from Steps 1–17: funnels, asset-classify, crowdfunding, site, brand-refs, _tooling. See audit/01 §2 for full inventory. |
| `corpus/` | 452 files, 20 brands | Created 2026-06-03 commit `317b490` "run full Arduview pipeline." Arduview competitor set (gameshell, playdate, pocket-operator, divoom + 16 adjacent maker/DIY brands). |
| `ads/` | 12 files | Per-brand ad JSON + screenshots, created in same commit as corpus. Arduview light-pass output. |
| `assets/` | 32 files | `assets/raw/` = arduview product photos/videos; `assets/work/` = downscaled working copies. Created by asset-fetch Phase 16. |
| `brands.json` | 1 file | Arduview competitor brand list, created 2026-06-03 `317b490`. |
| `space-map.json` | 273 lines | Arduview market space map, created 2026-06-03. |
| `.planning/phases/01-` through `03-` | 5 plans each | Light-pass, market-selection, deep-comp build plans. All arduview-scoped. |
| `.planning/phases/15-` | ~5 plans | Funnel Architect + Copywriter build plans. Arduview-scoped. |
| `.planning/phases/16-` | 10 files | Asset classifier tooling build. Arduview-scoped (worked instance = arduview). |
| `.planning/phases/17-` | untracked | LP Builder discuss-phase questions. Arduview-scoped. |
| `runs/_fixture/` | 4 files | Test fixtures for funnel pipeline (synthetic gameshell data). Arduview tooling. |
| `drive.cjs` | untracked | CDP drive script for Windows Chrome; from `runs/arduview/_tooling/` companion. |

### SHARED INFRA (keep, product-agnostic)

| Path | Files/Lines | Notes |
|------|-------------|-------|
| `tools/*.js`, `tools/hooks/`, `tools/lib/`, `tools/asset/*.py` | ~35 files | Full deterministic pipeline: fetch, clean, dedupe, revenue-est, adlib-one, funnel-*, rag-*, asset-*. Product-agnostic scripts with `--brand` / `--run` params. |
| `prompts/step1-light-pass.md` | 533 lines | Light-pass agent prompt. Product-agnostic. |
| `prompts/funnel-deep-pass.md` | 189 lines | Funnel deep-pass prompt. Product-agnostic. |
| `prompts/_specs/*.md` | 5 files | Deep-market-analysis, funnel-analysis, image-classifier, market-selection-assessor, market-selection-framework specs. All product-agnostic (arduview noted only as "worked instance"). |
| `prompts/_templates/` | 1 file | `pre-research-plan.template.md`. Product-agnostic template. |
| `definitions.md` | 378 lines | PMF vocabulary. Product-agnostic. |
| `workflow.md` | 362 lines | PMF step definitions. Product-agnostic. |
| `CLAUDE.md` | ~30 lines | Project agent-design rules. Product-agnostic. |
| `MARKETING-LENS.md` | unknown | DR marketing lens doc. Product-agnostic. |
| `capability_inventory.md` | 110 lines | Brick model rules. Product-agnostic. |
| `handoff-m1-build.md` | 106 lines | Build pickup doc for M1 (arduview-current but framed as the reusable research-engine build; mostly infra). |
| `handoff-step3-voc-build.md` | unknown | VOC pipeline build brief. Product-agnostic build spec. |
| `.planning/ROADMAP.md`, `STATE.md`, `config.json` | 3 files | GSD scaffolding. Product-agnostic. |
| `.claude/skills/` | all skills | market-selection, funnel-architect, funnel-deep-pass, asset-classify. Product-agnostic skill orchestrators. |
| `README.md` | unknown | Project overview. |
| `agents/funnel-deep-pass-run-notes.md` | unknown | Added 2026-06-04 (`a1079b8`, arduview deep-pass run). Infra improvement notes — arduview-sourced but applies to any run. Borderline; classify as shared-infra learnings. |

---

## 3. Cleanup Candidates

> Proposal only — do not move or delete. Confidence = HIGH means no arduview content, no downstream references from current canon; LOW means some signal might still be useful.

| Path | File/Dir size | Confidence | Reason |
|------|---------------|------------|--------|
| `_quarantine/runs/eink-tablets/` | 660 files | **HIGH** | Already quarantined; InkLeaf brand; no downstream reference from any current canon doc or script. Safe to archive (zip + delete) or hard-delete. |
| `_quarantine/archive/` | 4 files, ~485 lines | **HIGH** | Deprecated e-ink era session handoffs; README says "not maintained." Zero current canon reference. |
| `launch/inkleaf-landing/` + `launch/inkleaf-launch/` | 62 files combined | **HIGH** | Brand = InkLeaf, not Arduview. The `launch/README.md` explicitly calls this a "raw import" not yet reconciled into the reusable module. Phase 17 builds the arduview LP from `runs/arduview/site/` reference, not from this. |
| `run-retrospective.md` | 251 lines | **MEDIUM** | Titled "Inkleaf e-ink arc." `workflow.md` and `capability_inventory.md` are stated as the canonical distillation targets. However, §8 maps remaining unfolded learnings — scan for any not-yet-distilled signal before deleting. |
| `map/data_inventory.md` | 770 lines | **MEDIUM** | Created 2026-05-21 on old tooling schema; models pre-GSD structure. No arduview reference. BUT: may contain persistence-layer design notes relevant to VOC (Step 3) build. Scan §§ relevant to Step 3 before archiving. |
| `agents/implementation-notes.md` | 52 lines | **MEDIUM** | Explicitly e-ink-era populated; but may have signal not yet folded into prompts. Short enough to scan manually — fold any surviving signal into `prompts/_specs/` then delete. |

---

## 4. Re-scope My Audit (01 and 03)

### audit/01-run-chronology.md

This doc is correctly scoped — **all 17 steps it inventories are arduview work**. However, two items in its Step 0 row contain e-ink-era source references that should be flagged:

| Audit 01 finding | Status | Note |
|-----------------|--------|------|
| Step 0 row: "eink corpus imported" listed as an input | **E-INK-ERA — stale** | The `runs/eink-tablets/` corpus is in `_quarantine/`; it was never consumed by the arduview pipeline. Remove from the arduview input chain. |
| Step 0 row: "`runs/eink-tablets/` corpus" listed as an output | **E-INK-ERA — stale** | Same. The arduview run produced `corpus/` (20 maker brands), not `runs/eink-tablets/`. The Step 0 row conflates the two runs. |
| All Steps 1–17 | **ARDUVIEW — valid** | Correct. All GSD phases, tooling builds, and run outputs are arduview/shared-infra work. |
| Observations 3.1–3.8 | **ARDUVIEW — valid** | All sourced from arduview pipeline outputs. No e-ink-era contamination. |

### audit/03-retro-triage.md

This doc scans 8 arduview sources and is **correctly scoped throughout** — all 58 findings are from arduview pipeline phases (01, 02/RERUN-BRIEF, 03, 15, 16, 15-DEBUG, BUILD-FEEDBACK). Zero e-ink-era source docs were included.

One nuance: the archive `handoff.md` (in `_quarantine/archive/`) references "Faith / Students / Dumb-Device market scans" run on `runs/eink-tablets/markets/` — those are e-ink-era scans that were never referenced in audit/03. This is correct; they should not be in scope.

**No findings in audit/03 are e-ink-era. All 58 findings are valid for arduview/shared-infra.**

---

## 5. Summary Verdict

| Question | Answer |
|----------|--------|
| What is `eink-phase0-run` branch? | Current arduview work branch (misleadingly named). Contains Phases 15–17 arduview + tooling commits only. |
| When did arduview work start? | 2026-06-03 (commit `074d4fe`). |
| Is there unquarantined e-ink-era slop? | Yes: `launch/inkleaf-*/` (62 files), `run-retrospective.md` (251 lines), `map/data_inventory.md` (770 lines), `agents/implementation-notes.md` (52 lines). The bigger mass (`_quarantine/runs/eink-tablets/`, 660 files) is already quarantined but not yet deleted. |
| Are audit docs 01 and 03 contaminated? | 01 has two stale cells in Step 0 conflating eink-tablets corpus with arduview. 03 is clean. |
