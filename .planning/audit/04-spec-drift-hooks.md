---
audit: 04-spec-drift-hooks
date: 2026-06-04
investigator: claude-sonnet-4-6 (agent)
scope: prior investigation check, hook enforcement reality, spec-slop examples
---

# Spec Drift + Hook Enforcement Audit

---

## 1. PRIOR INVESTIGATION

### What exists

There was one prior investigation, plus a follow-up fix commit, plus a follow-up quick task:

**Commit `f57cdf6` (2026-06-04 00:09)** — "fix: resolve spec-drift audit findings F-01..F-03"  
This commit closed three findings:
- **F-01 (HIGH)** — `prompts/_specs/market-selection-assessor-spec.md`: Gate 2.2 still instructed the agent to read `competitive_axis`, a field removed from S1 output. Rewired to `bet_type` / `mechanisms_in_play[]`.
- **F-02 (MEDIUM)** — `prompts/_specs/funnel-analysis-collection-spec.md`: claimed DR files "auto-injected at runtime via a hook that doesn't exist." Replaced with the real mechanism (inject-dr.js bundler → prompts/_generated/ → assembler/Read).
- **F-03 (LOW)** — `tools/hooks/inject-dr.js`: header banner still said "auto-injection hook." Corrected to "BUNDLER (NOT auto-injected)."

**Quick task `260603-wfz`** (separate, same day) — "deterministic analyzer-context injection"  
Built `tools/funnel-analyzer-context.js` — a deterministic context assembler that spawns inject-dr.js --stdout and embeds the cleaned funnel body, so the Section Analyzer receives the bytes rather than being told to Read them. Wired `prompts/funnel-deep-pass.md` to say "ALREADY CONTAINS" instead of "MUST Read." Verified end-to-end on real data.

### Resolution status

**Partially resolved.** The three explicit F-01..F-03 findings are closed. The injection lie is corrected in the three files that originally stated it (funnel-analysis-collection-spec.md, market-selection-assessor-spec.md, inject-dr.js). The deterministic context assembler is built and wired.

**BUT — the original lie is still live in three places the prior investigation did not touch:**

1. `prompts/_specs/funnel-analysis-collection-spec.md` §Build inputs in `.planning/ROADMAP.md` line 92: still says "the six files **auto-injected** into the Section Analyzer, §11." The spec itself was fixed; the ROADMAP reference to the spec was not.

2. `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-funnel-architect.md` line ~107: the original operator spec still says "The DR files are **auto-injected / pasted alongside** this skill." This is the source-of-truth behavior spec (intentionally preserved verbatim per the operator); the built SKILL.md was corrected (verified by phase-15 plan), but the *source spec* still carries the lie.

3. `.planning/phases/02-stage-m1-s2-market-selection-gate/02-PATTERNS.md` line 214-216: "DR-KB auto-inject (Discretion — supporting knowledge at invocation) … mechanism is Claude's discretion." This is a patterns doc that still uses auto-inject language without the "no such mechanism" correction.

---

## 2. HOOK ENFORCEMENT REALITY

### What the spec promised

Every agent spec that needed DR marketing context originally promised: "DR files are **auto-injected at runtime** via a hook (PostToolUse/settings hook) when the skill runs."

This language appeared in:
- `prompts/_specs/funnel-analysis-collection-spec.md` (Section Analyzer, §11)
- `prompts/_specs/market-selection-assessor-spec.md` (§SUPPORTING KNOWLEDGE)
- `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-funnel-architect.md` (§SUPPORTING KNOWLEDGE)
- `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-copywriter.md` (§SUPPORTING KNOWLEDGE)

### What is actually configured

**Project-level hooks** (`/home/kyu3/PMF/.claude/settings.json`):
```json
"hooks": {
  "PostToolUse": [{
    "matcher": "Write",
    "hooks": [{ "command": "node tools/hooks/route.js \"$CLAUDE_TOOL_INPUT_PATH\" validate-finder validate-dumper validate-classifier validate-revenue" }]
  }]
}
```

Only one hook fires: the `route.js` dispatcher, which runs four VALIDATION hooks (find, dump, classify, revenue) on Write events. No inject-dr.js, no inject-funnel-architect-dr.js, no inject-copywriter-dr.js, no inject-market-selection-dr.js appears in any hooks block.

**Global-level hooks** (`/home/kyu3/.claude/settings.json`):
GSD framework hooks only (SessionStart: gsd-check-update + gsd-session-state; PostToolUse: gsd-context-monitor + gsd-phase-boundary; PreToolUse: gsd-prompt-guard + gsd-read-guard + gsd-workflow-guard + gsd-validate-commit). No PMF-specific injection.

**The injection scripts that exist on disk:**
- `tools/hooks/inject-dr.js` — bundler for Section Analyzer DR files
- `tools/hooks/inject-funnel-architect-dr.js` — bundler for funnel architect DR files
- `tools/hooks/inject-copywriter-dr.js` — bundler for copywriter DR files
- `tools/hooks/inject-market-selection-dr.js` — bundler for market selection DR files

All four exist as **CLI scripts / bundlers only** — none are wired as hook commands in any settings.json. They require explicit manual execution.

### Concrete gaps (spec vs. reality)

**Gap 1 — validate-analyzer.js not in the hook dispatcher**
`tools/hooks/validate-analyzer.js` was built in Phase 03 as a PostToolUse validator for belief-instance records (exit 0 pass / exit 2 reject), identical in contract to validate-dumper.js. The `route.js` dispatcher currently runs: `validate-finder validate-dumper validate-classifier validate-revenue`. `validate-analyzer` is absent — it is built, it is wired to nothing. Any Write of a belief-instance record bypasses the validator entirely.

**Gap 2 — validate-asset-record.js not in the hook dispatcher**
`tools/hooks/validate-asset-record.js` was built in Phase 16 for asset classification records (closed-vocab + grounding reject). Also absent from the `route.js` command in settings.json. The plan's response: "hooks don't fire in subagents, so the orchestrator runs the validator on each returned record before persist" — this is the workaround, but there is no enforcement in the main session's Write hook either.

**Gap 3 — ROADMAP line 92 still states "auto-injected"**
`.planning/ROADMAP.md` line 92 describes the Section Analyzer build inputs as "the six files **auto-injected** into the Section Analyzer, §11." This is the planning document agents read to understand the build; the correction in funnel-analysis-collection-spec.md did not propagate here.

**Gap 4 — 15-SPEC-funnel-architect.md source spec still claims auto-injection**
The operator's source behavior spec for the Funnel Architect (15-SPEC-funnel-architect.md) still reads: "The DR files are **auto-injected / pasted alongside** this skill." A footnote in the same file warns implementers to ignore this and use the deterministic pattern — but the primary instruction and the footnote are now contradictory. A new implementer reading the spec top-to-bottom gets the wrong instruction first.

**Note on the subagent limitation** — confirmed intentional workaround pattern:  
`16-04-PLAN.md` explicitly states: "hooks don't fire in subagents, so the orchestrator runs the validator on each returned record before persist." This is the known workaround: run validators as explicit orchestrator steps, not PostToolUse hooks. The plans acknowledge this. The gap is that this workaround isn't enforced in the SKILL.md orchestration steps in a verifiable way.

---

## 3. SPEC-SLOP EVIDENCE

### Slop Instance 1 — `prompts/_specs/funnel-analysis-collection-spec.md` §0, lines 14-23

```
## 0. MANDATORY FIRST STEP FOR THE IMPLEMENTER — read before building anything

Before writing any agent, prompt, or schema, the implementer MUST locate and read
these repo files to conform to existing conventions...

> Note on terminology: this system uses "stages," not "phases," in some places...
  Use whatever term the existing repo docs use. Do not introduce a competing term.

Standardization rule (applies to every schema field, tag, and file-naming decision):
Wherever this spec describes WHAT to capture but the exact tag value, field name, or
serialization format is left open, the implementer resolves it by matching the
convention already established in the PMF-workspace repo docs above...
```

**Why it reads as slop:** The spec doesn't name the files to read — just "locate and read" a vaguely described capability/workflow doc. The terminology note admits the system is inconsistent and asks the implementer to figure it out. The standardization rule is a ~3-sentence disclaimer telling the implementer to use their judgment on everything the spec didn't decide. None of this is actionable. The correct version is either naming the exact files (like Phase 16 does) or trusting the implementer to know the repo. This preamble exists to cover the spec author's ass about incompleteness, not to help the builder.

---

### Slop Instance 2 — `prompts/_specs/image-classifier-brick.md` §Open items, lines 289-297

```
## Open items

- **Access:** the real Arduview set (Louis Huang's Drive folder) must be shared to
  the connected Google account before bricks 3-4 can run on it...
- **Video frames:** `turntable_frame` requires a frame-extraction step... Defer until
  a product video is in scope.
- **Section list source:** hardcoded defaults here; wire to the funnel container once
  M2's deep-analysis -> test-design path produces it.
```

**Why it reads as slop:** Two of three open items describe problems that were already solved by the time Phase 16 shipped (video extraction is bricks 2v/3v, section list is `tools/asset/section-list.default.json`). The third (Drive access) is a runtime ops note, not a spec item. This section became stale the moment Phase 16 plans were written, but it was never removed or updated. A builder reading this spec cold gets three "open items" that are either already closed or not their problem.

---

### Slop Instance 3 — `.planning/phases/16-asset-classifier-image-and-video-bricks/16-RESEARCH.md` (520 lines)

The file is 520 lines of pre-research that duplicates what the spec already says. Spot-check: the "Open items" section within 16-RESEARCH lists the same items as the spec's Open items section (Drive access, video frames, section list source) verbatim. The "Environment Availability" section lists Python and Node versions and confirms pip is available — information that any builder discovers in 10 seconds. The "Code Examples" section contains 80+ lines of copy-pasteable Python for imagehash and PIL montage.

**Why it reads as slop:** The code examples section is useful (no analog in repo, provides the exact ffmpeg invocation). The rest is padding: "confirmed availability" checks that happen during Task 1 anyway, repeated Open items from the spec, a "Closest-Analog Map" that is also fully reproduced in 16-PATTERNS.md. A single builder-facing PATTERNS.md would replace both files without loss of signal.

---

### Slop Instance 4 — `.planning/ROADMAP.md` line 293 + ROADMAP Phase-15 notes

ROADMAP entry for Phase 15 contains:
```
3. Both skills' DR knowledge is injected DETERMINISTICALLY (bundler + read_first bundle,
   market-selection pattern), verified present in context — NOT "auto-injected".
```

This is a success criterion written as a correction to a bug. The underlying bug was injecting a lie into Phase 15 plans; fixing the ROADMAP criteria to explicitly negate the lie is a record of the bug, not the criteria itself. A clean success criterion would be: "Section Analyzer receives a 6-file DR bundle assembled by inject-dr.js" — not a negation of a historical error. The negation language persists across five separate places in the repo (ROADMAP, PATTERNS, spec, plan, CONTEXT) because each document was patched independently rather than one of them being the authority.

---

## 4. ROOT CAUSE PATTERN

The spec-drift is not random padding. It follows a consistent failure mode:

1. Spec author writes "X will be auto-injected by a hook" because that's the intent.
2. No one builds the hook (hooks don't fire in subagents anyway; the architecture doesn't support it).
3. A run executes with zero grounding because the agent trusted the spec.
4. Post-mortem patches the spec in-place, adding a "(NOT auto-injection)" disclaimer to the original lie.
5. The disclaimer propagates to 4-5 dependent docs as each is patched individually.
6. The original source-of-truth spec (15-SPEC-funnel-architect.md, the operator's verbatim) is never patched — only the derived SKILL.md is.
7. Result: the repo now has both the lie and the correction, sometimes in the same file, sometimes in different files, with no single authoritative statement.

The fix is not more patches — it is to identify which file is the SINGLE authority for each mechanism contract and correct only that file, then delete the copies.
