# Phase 19: Cleanup & health - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Repo cleanup + health for the PMF project:
- **Nuke e-ink-era artifacts:** `_quarantine/runs/eink-tablets/`, `_quarantine/archive/`, `launch/inkleaf-landing/`, `launch/inkleaf-launch/` (incl. untracked `_deep-pass/`), `launch/README.md`.
- **Remove slop docs:** `.planning/BUILD-STATE.md`, `mechanisms-in-play-stopgap.md`, `runs/arduview/STRATEGY-DISCUSS-HANDOFF.md`, `RERUN-BRIEF.md`, `brand-refs/*`, `funnels-context/*`, root `MARKETING-LENS.md` stub, `_asset-classify-proof.md`, the 3 `01-*-SUMMARY.pre-revision.md` snapshots.
- **Remove junk binaries / scratch:** `asset-classify/sheets` (~23M), `_caption_*`, `ads/*_adv.png`, dup root `drive.cjs`.
- **Distill-then-delete:** `map/data_inventory.md` → extract a keeper, then hard-delete the source.
- **gitignore:** add `_index.json`, `_*-log.txt`, `_*.agent.json`, `_caption_*`; delete the junk matches.
- **Adopt** a no-overwrite-v1 versioning rule.
- **Run** `gsd-health` on `.planning/`.

Scope is FIXED by ROADMAP Phase 19 + the two delete-list docs (`intel/INDEX.md`, `POST-RUN-HARDENING-PLAN.md` Phase 19/A). No new cleanup targets beyond those lists.

</domain>

<decisions>
## Implementation Decisions

### Delete vs archive strategy
- **D-01:** **Hard-delete everything.** Git history is the archive. Do NOT create an `_archive/` dir. This **overrides** the POST-RUN-HARDENING-PLAN wording ("archive `launch/inkleaf-*` → `_archive/eink-launch/`") and the audit's `_archive/eink-launch/` recommendations — operator chose hard-delete. ROADMAP "nuke" wins.
- **D-02:** Tracked targets → `git rm`. Untracked targets → plain `rm`. (`_quarantine/` = 660 tracked files / 160M; `launch/` = 36 tracked; `asset-classify` media = mostly untracked.)

### VOC distillation (`map/data_inventory.md`)
- **D-03:** **Distill-then-hard-delete**, NOT delete-blind. Investigation (Sonnet, this session) found the file is lossy to delete outright: while the VOC-specific `voc_record_id` granularity question is already resolved elsewhere (`handoff-step3-voc-build.md:119-124`, `REQUIREMENTS.md` VOC-02 → per-quote, keyed to author+source+char-offsets), the file is the ONLY home for content that `BUILD-STATE.md` itself points back to.
- **D-04:** Create keeper **`map/data-model-notes.md`** absorbing the content not captured anywhere else:
  - Non-VOC capability IO schemas — `data_inventory.md` lines 56–258 (per-brand extractor → transformation expanders).
  - The 5 still-unresolved cross-cutting design decisions `BUILD-STATE.md` cites `data_inventory.md` for: hypothesis-record schema, augment-not-overwrite multi-pass write lean, awareness-level inference gap, author_id-join-as-heaviest constraint, substrate framing (~25 record types). Source: `data_inventory.md` lines 690–759.
  - Open Questions #1–5 (lines 40–44) WITH resolution status (Q1 resolved by handoff; Q2 investigation-scope lean stated; Q3–5 open/deferred).
- **D-05:** VOC scraper/cleaner/classifier IO schemas (`data_inventory.md` lines 263–411) are **optional** in the keeper — the handoff covers them architecturally; S4 will re-specify at field level. Planner's call; not blocking.
- **D-06:** After keeper is written + verified, hard-delete `map/data_inventory.md`. Because `BUILD-STATE.md` is also nuked this phase, the keeper MUST land before both are removed so no load-bearing design context leaves the working tree.

### no-overwrite-v1 rule
- **D-07:** **Rule (default):** a committed run output (a file/dir under `runs/<space>/…`) or an emitted brick is never mutated in place on a re-run. A re-run writes a NEW versioned location (e.g. `…/v2/` or a `-v2` suffix); v1 stays intact for provenance/diffing.
- **D-08:** **Enforcement:** documented convention in project CLAUDE.md only. A guard hook/script is explicitly DEFERRED (not built this phase).
- **D-09:** **Scope:** committed run outputs + emitted bricks. Does NOT govern logs/scratch (gitignored) or in-flight uncommitted work.

### gitignore + tracked-file handling
- **D-10:** Add patterns: `_index.json`, `_*-log.txt`, `_*.agent.json`, `_caption_*`.
- **D-11:** **Junk → throw out now** (operator: "if they're junk just throw them out"):
  - `_*-log.txt` (7 files, none tracked) → delete.
  - `_caption_*` (untracked png/py scratch) → delete.
  - `_*.agent.json` → `runs/arduview/_mechanisms-in-play.agent.json` is tracked (parked-decision #3, "retired") → `git rm` it.
- **D-12:** `_index.json` is regenerable emitter output, NOT junk. Gitignore the pattern; `git rm --cached` the untracked-or-tracked run copies. **Nuance for planner:** `runs/_fixture/funnels/_index.json` is a tracked test fixture — preserve it (e.g. `!runs/_fixture/**` negation) rather than letting the new ignore pattern drop it. Verify before committing.

### image-classifier-brick.md cite fix (precondition for deleting `launch/`)
- **D-13:** `prompts/_specs/image-classifier-brick.md` cites `launch/inkleaf-launch/IMAGES.md` as a format example (illustrative, not a hard dep). Before deleting `launch/`, **inline a minimal format snippet** into the spec (or re-point to a kept example). Claude's discretion on the exact fix; inline is simplest.

### PROMOTE items (folded from PROMOTE-scope question)
- **D-14:** The 2 PROMOTE items are NOT in the delete scope and are **kept in place** this phase; their promotion is **deferred** (see Deferred Ideas):
  - `runs/arduview/15-DEBUG-funnel-architect.md` → (later) formalize as funnel-architect input-contract spec.
  - `.planning/phases/01-*/01-DEBUG-RUN-NOTES.md` → (later) distill into phase PATTERNS.
  - Note: a `FORMALIZE-HANDOFF.md` already exists in the phase-16 dir — promotion work may route through there.

### Health
- **D-15:** Run `gsd-health` on `.planning/` as the final verification step; address any repairable issues it surfaces.

### Claude's Discretion
- Exact form of the `image-classifier-brick.md` cite fix (D-13).
- Whether to include the VOC chain IO schemas in the keeper (D-05).
- Commit granularity within the phase (atomic per cleanup group is fine).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Delete lists (authoritative scope)
- `.planning/intel/INDEX.md` — top-level classification + cleanup action lists (NUKE / DISTILL / SLOP / PROMOTE / MUST-KEEP).
- `.planning/intel/doc-index-core.md` — per-file rows: prompts, `_specs`, skills, root + `.planning` loose docs, audits.
- `.planning/intel/doc-index-runs.md` — per-file rows: arduview run outputs, asset-classify, `_marketing-decisions`, `_tooling`.
- `.planning/intel/doc-index-phases-launch.md` — per-file rows: `.planning/phases/`, `launch/`, e-ink reference-check.
- `.planning/POST-RUN-HARDENING-PLAN.md` §A ("Cleanup & health") — the phase brief (NOTE: its "archive" wording is overridden by D-01 hard-delete).
- `.planning/audit/06-cleanup-manifest.md` — the safe-cleanup manifest behind the lists.
- `.planning/audit/10-phaseA-decisions.md` — the prior decision analysis on the 3 parked items (esp. lines 18–51 on `data_inventory.md`).

### VOC distillation
- `map/data_inventory.md` — the distill source (line refs in D-04/D-05).
- `handoff-step3-voc-build.md` §3–4 (esp. lines 119–124) — resolves the `voc_record_id` granularity question (per-quote storage contract).
- `.planning/REQUIREMENTS.md` VOC-02 (line 14) — per-quote unit-of-record requirement.
- `.planning/BUILD-STATE.md` (lines 61, 137, 149, 150, 212) — cites `data_inventory.md` for the 5 unresolved decisions the keeper must absorb. (This file is itself nuked — read for D-04 before deleting.)

### Cite precondition
- `prompts/_specs/image-classifier-brick.md` — the cite to re-point/inline (D-13).

### Versioning rule target
- `~/dotfiles/claude/CLAUDE.md` (symlinked `~/CLAUDE.md`) and/or project `PMF/CLAUDE.md` — where the no-overwrite-v1 convention is documented (D-08). Confirm with operator which file; remind to push if the dotfiles one is edited.

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `.gitignore` already structured by category (corpus raw, ad screenshots, .venv, assets/) — append the new patterns in the same comment-grouped style.

### Established Patterns
- Emitter scripts produce `_index.json` and `_*-log.txt` as side outputs (regenerable) — confirms they belong in gitignore, not the tree.
- `runs/<space>/…` is the run-output convention the no-overwrite-v1 rule governs.

### Integration Points
- `prompts/_specs/image-classifier-brick.md` is the only hard touch-point that blocks the `launch/` delete (D-13) — fix it first.
- `gsd-health` operates on `.planning/`.

</code_context>

<specifics>
## Specific Ideas

- Operator: "hard delete" — no archive directory; trust git.
- Operator: for VOC, investigate the VOC build phase / planted seeds / VOC handoff brief and whether `data_inventory.md` holds anything useful (done this session via Sonnet subagent — verdict captured in D-03/D-04).
- Operator: "explain ignore patterns, if they're junk just throw them out" — junk deleted now, not just ignored.

</specifics>

<deferred>
## Deferred Ideas

- **PROMOTE: formalize `15-DEBUG-funnel-architect.md`** as the funnel-architect input-contract spec — kept in place, promotion deferred (D-14). Likely routes through phase-16 `FORMALIZE-HANDOFF.md`.
- **PROMOTE: distill `01-DEBUG-RUN-NOTES.md`** into phase-01 PATTERNS — kept in place, promotion deferred (D-14).
- **no-overwrite-v1 guard hook/script** — only the convention is adopted now; an enforced hook is deferred (D-08).
- Broader VOC build (Stages M1-S4..S11, Track B) — already roadmapped; the keeper (D-04) feeds it.

</deferred>

---

*Phase: 19-cleanup-health-nuke-e-ink-quarantine-eink-tablets-quarantine*
*Context gathered: 2026-06-04*
