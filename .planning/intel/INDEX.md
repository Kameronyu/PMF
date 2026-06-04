# Project Doc Index

*Read this first. Every `.md` in the project is classified here so an agent (or human) knows what to read and what to skip — without reading boatloads. Per-file rows live in the three area files below. This is the cleanup safety net and the seed for the eventual codebase-intel map (Phase G).*

## Area files
- [`doc-index-core.md`](doc-index-core.md) — prompts, `_specs`, skills, root + `.planning` loose docs, audits
- [`doc-index-runs.md`](doc-index-runs.md) — the arduview run outputs, handoffs, asset-classify, `_marketing-decisions`, `_tooling`
- [`doc-index-phases-launch.md`](doc-index-phases-launch.md) — `.planning/phases/` (coarse, per-phase) + `launch/` + the e-ink reference-check

## Classification scheme
KEEP · GSD-ARTIFACT · SLOP (cleanup candidate) · PROMOTE (good content not yet an official prompt/spec) · DUPLICATE · EINK (e-ink-era, nuke candidate) · KEEP-DISTILL (extract the useful part, then archive)

---

## Cleanup action lists (drives Phase 18)

### NUKE — e-ink, reference-checked clear (zero active hard deps)
- `_quarantine/runs/eink-tablets/` (660 files)
- `_quarantine/archive/`
- `launch/inkleaf-landing/`, `launch/inkleaf-launch/` (incl. untracked `_deep-pass/`), `launch/README.md`
- Caveat: `prompts/_specs/image-classifier-brick.md` cites a `launch/inkleaf-launch/IMAGES.md` as a *format example* — re-point or inline that one cite before deleting (illustrative only, not a hard dep).

### DISTILL-THEN-ARCHIVE
- `map/data_inventory.md` — extract the unique VOC unit-of-record / `voc_record_id` design notes (guidance for VOC build M1-S4+) into a keeper, then archive the rest.

### SLOP — archive or delete (non-e-ink)
- `MARKETING-LENS.md` (root) — redirect stub (or keep as a pointer)
- `.planning/BUILD-STATE.md` — superseded by ROADMAP.md, stale InkLeaf framing
- `.claude/skills/market-selection/mechanisms-in-play-stopgap.md` — retired, "do NOT run" header
- `runs/arduview/STRATEGY-DISCUSS-HANDOFF.md`, `RERUN-BRIEF.md` — ephemeral session briefs, work complete
- `runs/arduview/brand-refs/{nothing,playdate,teenage-engineering}.md` — raw fetches, reconciled into `site/STYLE-LOCK.md`
- `runs/arduview/funnels-context/*-context.md` — machine-gen analyzer inputs (biggest byte cleanup; outputs live in the funnel store)
- `runs/arduview/_asset-classify-proof.md` — superseded by the full asset-classify pass
- `.planning/phases/01-*/01-*-SUMMARY.pre-revision.md` (3) — vestigial pre-edit snapshots
- scratch: `_*-log.txt`, `_*.agent.json`, `_caption_*.{py,png,ass}`, dup root `drive.cjs`

### PROMOTE — good content that should become official
- `runs/arduview/15-DEBUG-funnel-architect.md` → formalize as the funnel-architect **input-contract spec** (it's the macro-input-gap audit)
- `.planning/phases/01-*/01-DEBUG-RUN-NOTES.md` → distill into phase PATTERNS before archiving

### MUST-KEEP (do NOT sweep)
- `prompts/_specs/15-SPEC-funnel-architect.md`, `15-SPEC-copywriter.md` — operator behavior-authority specs
- `prompts/_specs/15-CLAIM-TALLY-IMPL-SPEC.md` — active design for an unbuilt tool
- `prompts/_specs/image-classifier-brick.md` — active spec
- `run-retrospective.md`, `agents/implementation-notes.md` — e-ink learnings, still used
- `.planning/audit/*` — the decision trail for this whole initiative
- `tools/` — rescued, in active use
