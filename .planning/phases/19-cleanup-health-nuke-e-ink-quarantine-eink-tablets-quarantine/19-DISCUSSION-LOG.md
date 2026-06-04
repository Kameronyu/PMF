# Phase 19: Cleanup & health - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 19-cleanup-health-nuke-e-ink-quarantine-eink-tablets-quarantine
**Areas discussed:** Delete vs archive, VOC distillation, no-overwrite-v1 rule, gitignore + tracked files

---

## Delete vs archive

| Option | Description | Selected |
|--------|-------------|----------|
| Hard-delete (git is the archive) | `git rm`/`rm` everything; no `_archive/` dir | ✓ |
| Move to `_archive/` and keep in tree | Per hardening-plan / audit recommendation | |
| Delete from tree but tag a git ref first | Extra provenance safety | |

**User's choice:** Hard-delete.
**Notes:** Overrides POST-RUN-HARDENING-PLAN "archive `launch/inkleaf-*`" wording and audit `_archive/eink-launch/` recommendations. ROADMAP "nuke" wins. (D-01/D-02)

---

## VOC distillation (`map/data_inventory.md`)

| Option | Description | Selected |
|--------|-------------|----------|
| Hard-delete blind | Nothing useful, trust git | |
| Distill-then-delete | Extract keeper, then hard-delete source | ✓ |
| Keep as-is | No cleanup | |

**User's choice:** "for voc please look in the voc build phase for context or planted seeds, there was like a voc handoff brief for the voc phase, i want you to send a subagent sonnet to investigate whether or not there's anything useful in data map."
**Notes:** Sonnet `Explore` subagent dispatched this session. Verdict: the VOC-specific `voc_record_id` question is already resolved (`handoff-step3-voc-build.md:119-124`, REQUIREMENTS VOC-02), BUT the file is the sole home for non-VOC IO schemas + 5 unresolved design decisions that `BUILD-STATE.md` cites. → distill into keeper `map/data-model-notes.md`, then hard-delete. (D-03–D-06)

---

## no-overwrite-v1 rule

| Option | Description | Selected |
|--------|-------------|----------|
| Documented convention (default) | Rule in CLAUDE.md, no enforcement code | ✓ |
| Naming convention only (v1/v2 suffix) | | |
| Guard hook/script | Enforced at write-time | (deferred) |

**User's choice:** "pick default for no overwrite."
**Notes:** Default = documented convention; never mutate committed run outputs/bricks in place, re-runs write a new version. Guard hook deferred. (D-07–D-09)

---

## gitignore + tracked files

| Option | Description | Selected |
|--------|-------------|----------|
| Ignore + delete junk now | Add patterns AND throw out the junk matches | ✓ |
| Ignore only | Leave existing files on disk | |

**User's choice:** "explain ignore patterns, if they're junk just throw them out."
**Notes:** Patterns added: `_index.json`, `_*-log.txt`, `_*.agent.json`, `_caption_*`. Junk (logs, caption scratch, `_mechanisms-in-play.agent.json`) deleted. `_index.json` is regenerable not junk → ignore + `git rm --cached`, but preserve the `runs/_fixture/` test fixture. (D-10–D-12)

---

## Claude's Discretion

- Exact form of the `image-classifier-brick.md` cite fix (inline vs re-point).
- Whether VOC chain IO schemas go in the keeper.
- Commit granularity within the phase.

## Deferred Ideas

- PROMOTE: formalize `15-DEBUG-funnel-architect.md` → input-contract spec.
- PROMOTE: distill `01-DEBUG-RUN-NOTES.md` → phase PATTERNS.
- no-overwrite-v1 guard hook/script.
- Broader VOC build (M1-S4..S11), fed by the keeper.
