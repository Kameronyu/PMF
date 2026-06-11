# Phase 20: Deep-pass bug fixes - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-06-04
**Phase:** 20-deep-pass-bug-fixes
**Areas discussed:** markdown-heading handling, funnel-score fail-fast, no-ads DTC path, space-map.json location, DR-injection verification, project-state / git-race concern

---

## markdown-heading handling (#1)

| Option | Description | Selected |
|--------|-------------|----------|
| Fix the regex | Add markdown `#`/`##` support so the `.md` fallback works | ✓ |
| HTML-only + loud guard | Keep HTML-only, error when fed `.md` | |

**User's choice:** Deferred to Claude ("you would know how to fix these better than I can"). Resolved to fix the regex.

## funnel-score fail-fast (#2)

| Option | Description | Selected |
|--------|-------------|----------|
| Minimal fail-fast | Error when no valid currency / required field; defer full field-name contract | ✓ |
| Full schema validator now | Enforce canonical field names this phase | |

**User's choice:** Fail-fast yes ("don't let a run silently shit the bed"). User flagged that field-name constancy comes with the I/O contracts in later phases (21+) — so full schema validation is explicitly deferred to Track C. **Notes:** Stat field mismatch (`amount_raised` vs `amount_raised_usd`) verified to be a documented footgun (run-notes §4), never a logged incident.

## no-ads DTC path (#4)

| Option | Description | Selected |
|--------|-------------|----------|
| Exclude with clear message | Skip; never fabricate a funnel | ✓ |
| Auto-detect + stub | Build a placeholder package | |
| Require operator flag | Explicit opt-in | |

**User's choice:** Exclude with a clear message, don't stub. **Notes:** User asked why DTC-no-ads differs from crowdfunding-no-ads; clarified — crowdfunding LP is a self-contained funnel with a validation currency (money raised); DTC-no-ads has neither ad-funnel nor crowdfunding stats, so nothing real to analyze. Hand-feed the LP if one is ever wanted (deliberate operator act).

## space-map.json location (#5)

| Option | Description | Selected |
|--------|-------------|----------|
| `runs/<space>/space-map.json` | Move classifier output there; matches runs/ convention | ✓ |
| Repo root | Change deep-pass precondition to check root | |

**User's choice:** Deferred to Claude — "as long as all file pointings are ensured to be internally consistent." Resolved to `runs/<space>/` with a hard internal-consistency requirement.

## DR-injection verification (audit/08 #2/#7)

**User concern:** "I thought I implemented that after, as deterministic scripts — is it a fluke that never actually worked?"

**Verified:** Deterministic injection IS built and is the source of truth in `.claude/skills/funnel-deep-pass/SKILL.md` (Section Analyzer never Reads; orchestrator embeds bytes). `funnel-analyzer-context.js` + `inject-dr.js` exist. The arduview failure was a one-run orchestration improvisation, not missing tooling. **Outcome:** Only fix = scrub the one stale contradicting `Read` line in the relocated `prompts/funnel-deep-pass.md`.

## Project-state / git-race concern

**User concern:** "Am I running parallel sessions and the git race geeks it? Do I need an inconsistency audit?"

**Verified:** No parallel sessions, no worktrees, no GSD workspaces; last 12 commits linear and single-session (20:31→20:48). The "drift" is transient analysis-artifact lag (run-notes + audit/08 are snapshots written before the SKILL consolidation that already fixed some items), not git corruption or doc rot. Phase 19 deleted the dead e-ink era (a different mess); the structural anti-drift answer (agent-readable index) is Track G, deliberately deferred. No new audit needed — burn down the existing one (this phase).

## Claude's Discretion

- Exact markdown-heading regex form.
- Error wording / exit codes for fail-fast and exclude guards.
- Whether corpus-absent and no-ads-DTC excludes share one code path.
- space-map.json canonical location (chose `runs/<space>/`).

## Deferred Ideas

- adlib-one.js DOM selector calibration → first real debug run (D-02).
- `belief_kind`/`source_routing` schema ADD → Track C / Phase 21.
- Full field-name I/O contract enforcement → Track C / Phase 21.
- Sequential-gap position check (not requested).
- Archive consumed analysis artifacts (audit/01–11, run-notes) → later cleanup pass; structural fix is Track G.
