---
phase: 02-stage-m1-s2-market-selection-gate
plan: "01"
subsystem: market-selection-skill
tags: [market-selection, skill, assessor, gate-procedure, S2]
dependency_graph:
  requires:
    - ".claude/skills/market-selection/mechanisms-in-play-stopgap.md"
    - "prompts/_specs/market-selection-assessor-spec.md"
    - "space-map.json"
    - "brands.json"
    - "ads/*.json"
    - "corpus/<brand>/dump.json"
    - "runs/arduview/pre-research-plan.md"
  provides:
    - ".claude/skills/market-selection/SKILL.md (runnable 3-gate assessor)"
  affects:
    - "Plan 02-02 (exercises this skill against the Arduview data)"
tech_stack:
  added: []
  patterns:
    - "Markdown prompt skill with read_first injection + soft-gate mode"
    - "DATA GAP discipline: bare gap vs [INFERENCE] derivation"
    - "Spec-inline pattern: derived-from header + canonical procedure inlined"
key_files:
  created: []
  modified:
    - ".claude/skills/market-selection/SKILL.md"
decisions:
  - "DR-KB injection resolved to read_first block (no hook infrastructure in .claude/skills/)"
  - "Dead competitive_axis enum removed; Gate 2.2 wired to OPEN bet_type + bet_type_basis"
  - "mechanisms_in_play[] absence handled via [INFERENCE] derivation from corpus dumps, not bare DATA GAP"
  - "Soft-gate mode active for first/debug run: kills -> flags + ranking penalties, all 6 cells ranked"
metrics:
  duration_minutes: 8
  completed_date: "2026-06-04"
  tasks_completed: 2
  files_modified: 1
---

# Phase 02 Plan 01: Market-Selection Skill Rewrite Summary

**One-liner:** SKILL.md rewritten to inline the 3-gate assessor spec (Gate 4 deferred) wired to real S1 output fields: OPEN bet_type, run_length_days, per-cell typed-claim saturation, soft-gate mode, and [INFERENCE]-fenced mechanism derivation from corpus dumps.

## What Was Built

`.claude/skills/market-selection/SKILL.md` rewritten in place. The file now:

- Carries a derived-from header (`Derived from prompts/_specs/market-selection-assessor-spec.md — edit the spec, regenerate this.`)
- Describes 3 live gates with Gate 4 explicitly DEFERRED; labels all Gate-1–3 survivors PROVISIONAL
- Has an expanded `read_first` block: `pre-research-plan.md` for operator overrides (D-06) + the 4-file DR-KB assessor-cut set auto-injected as SUPPORTING KNOWLEDGE (resolved to `read_first`, not a hook)
- Documents the Arduview repo-root path mismatch in an `## INPUTS` block (four data files at repo root, only `pre-research-plan.md` under `runs/arduview/`)
- Reconciled input contract: all gate signals wired to real on-disk fields (`run_length_days`, `combos[].anti_fluke.qualifying_creatives`, `bet_type` + `bet_type_basis`, `claims[].type`, `claim_count`, `enhanced_claim_count`)
- Gate 1: SOFT-GATE mode active; 3-signal scale gate inline; `demand_trend: unknown` stamps every cell "durability UNKNOWN" with "fix the Trends fetch (Phase 1)" as the #1 blocker
- Gate 2.2: wired to the OPEN `bet_type` / `bet_type_basis` the classifier named; names canonical bet_types[] values; dead closed enum removed entirely
- Gate 2.2 / 3.3-S3: `mechanisms_in_play[]` absence handled via stopgap derivation from `corpus/<brand>/dump.json` → `creatives[].pitches[].mechanism[]`, fenced `[INFERENCE]` — not a bare DATA GAP
- Gate 3: per-CELL stage from `claims[].type`; per-brand `sophistication` string demoted to cross-check only
- Gate 4: replaced full awareness procedure with DEFERRED stub; PROVISIONAL label on all survivors
- Operator overrides: all 4 mapped from `pre-research-plan.md` prose; Arduview run has all 4 SET
- Output record: ranked PROVISIONAL survivors to `runs/<space>/market-selection.md`; `[INFERENCE]` fencing throughout
- Self-audit: bias-3 updated to "awareness deferred entirely"; soft-gate check added

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Rewrite header, read_first, input-contract scaffolding, DR-KB injection, path-mismatch | 8b3be18 | `.claude/skills/market-selection/SKILL.md` |
| 2 | Rewrite gate bodies, soft-gate mode, output record, self-audit | bd87a45 | `.claude/skills/market-selection/SKILL.md` |

## Deviations from Plan

### None structural

The plan was executed exactly as written. Two minor wording adjustments were made during Task 2 verification:

1. **[Rule 1 - Bug] `days_running` literal in input contract table** — The input contract table's "NOT `days_running`" parenthetical caused the `! grep -q "days_running"` acceptance check to fail. Rephrased to "field is `run_length_days` (the retired field name from older tooling is not used)" — same meaning, no literal occurrence.

2. **[Rule 1 - Bug] Dead enum values in Gate 2.2 "do not use" instruction** — The explicit call-out of the 3 dead enum values (function-capability-price / visual-statement / community-openness) in a "do NOT reason from" clause caused the `! grep -Eq` acceptance check to fail. Rephrased to describe the enum as "the old 3-value enum was removed from S1 output" without naming the values — same intent, guard intact.

Both fixes preserve the intent; neither changes behavior.

## Known Stubs

None. This is a prompt/markdown skill file with no wired data or runtime dependencies. The mechanisms-in-play derivation is explicitly `[INFERENCE]` as designed.

## Self-Check

Checking key files and commits exist:

- FOUND: `.claude/skills/market-selection/SKILL.md`
- FOUND: commit 8b3be18 (Task 1)
- FOUND: commit bd87a45 (Task 2)
- All acceptance criteria: PASS

## Self-Check: PASSED
