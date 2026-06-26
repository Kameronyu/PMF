---
status: orchestration-scaffold (PROPOSAL — awaiting operator ratification)
role: Phase 3 proposed folder map + rename list. Nothing has moved yet.
read-with: RECON-PLAN.md (proposed_folder per doc)
---

# MOVES-PLAN — proposed folder map + renames (Phase 3, step 1 of 2)

This is the **proposal**. On your approval I apply the moves and emit `MOVES-LOG.md` (old→new for every file), which Phase 4 uses to repair any path-based links. Cross-references *by name* (e.g. "PART3 §1.5", "AUDIT-funnel GAP-D") survive moving unchanged; only path-style links need repair, and that's Phase 4's job.

## Proposed tree

```
build-base/
├─ INDEX.md                              ← created in Phase 5
├─ BUILD-BASE-WORKFLOW.md                ← runbook, stays at root
├─ OPEN-DECISIONS.md                     ← operator action list, stays at root (high-visibility)
│
├─ architecture/
│   ├─ PART0--pipeline-flow.md
│   ├─ PART1--dependency-ordered-map.md
│   ├─ PART2--build-order-roadmap.md
│   ├─ PART3--architecture-design.md
│   └─ PART3-READER--human-map.md
│
├─ standards/
│   ├─ SPEC-marketing-soundness.md
│   ├─ marketing-rule-register.md
│   └─ BUILDER-DIRECTIVE.md
│
├─ skills/
│   └─ bet-compiler/
│       └─ SKILL.md                      ← RENAMED from bet-compiler-SKILL.md
│
├─ reference/
│   ├─ EXTERNAL-INPUTS-MAP.md            ← routing map to external rebuild inputs
│   ├─ handoffs/
│   │   ├─ HANDOFF-1--bet-and-pre-research.md
│   │   ├─ HANDOFF-PROCESS--open-questions.md
│   │   └─ HANDOFF-annotation-depth-sort.md
│   ├─ reviews/
│   │   ├─ PART4--review-propagation-audit-and-agent-building-skills.md
│   │   ├─ AUDIT-collection.md
│   │   ├─ AUDIT-market.md
│   │   ├─ AUDIT-funnel.md
│   │   ├─ AUDIT-reviewerB.md
│   │   └─ REVIEWS--raw-annotated-prompts.md   ← RENAMED (was "adversarial-reviews/PMF annotated prompts and reviews.md"; kills the spaces)
│   └─ as-ran-repo/
│       ├─ asran-repo-report.md
│       └─ repo-files/…                  ← whole tree moved as a unit, internal structure unchanged
│
└─ _cleanup/                             ← process records, kept out of the way
    ├─ RECON-PLAN.md
    ├─ SKILL-USAGE-PLAN.md
    ├─ MOVES-PLAN.md   (this file)
    └─ MOVES-LOG.md    (created on execution)
```

## The only two renames
1. `bet-compiler-SKILL.md` → `skills/bet-compiler/SKILL.md` — matches the skill-folder convention (a skill = a folder with `SKILL.md`), so a future build session loads it the same way it loads your `skill-builder` / `system-designer`.
2. `adversarial-reviews/PMF annotated prompts and reviews.md` → `reference/reviews/REVIEWS--raw-annotated-prompts.md` — removes the spaces (which break paths/links) and groups it with the audits that prosecute it.

Every other file keeps its current name — deliberately. The PART0–PART4 / AUDIT / HANDOFF docs reference each other heavily by name; renaming them would break those references for no navigability gain.

## Notes
- The `adversarial-reviews/` folder disappears (its one file moves into `reference/reviews/`).
- The two near-duplicate `repo-files/runs/arduview/(arduview-)pre-research-plan.md` files are **kept as-is** (not part of the ratified Phase 2 deletes; they're as-ran artifacts). Flagged only.
- `_cleanup/` uses a leading underscore so it sorts to the bottom and reads as "process meta, not base content."
