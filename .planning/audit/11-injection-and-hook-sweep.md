---
audit: 11-injection-and-hook-sweep
date: 2026-06-04
investigator: claude-sonnet-4-6 (agent)
scope: Anti-pattern A (compliance-based injection) + Anti-pattern B (dead validators)
cross-ref: .planning/audit/04-spec-drift-hooks.md (prior partial findings)
---

# Injection + Hook Sweep

---

## ANTI-PATTERN A — Injection relies on model compliance instead of deterministic embedding

**Total instances found: 8**

Verdict key:
- `COMPLIANCE-ONLY (BUG)` — model must read/obey the instruction; no orchestrator-paste step exists
- `HAS-DETERMINISTIC-INJECTION` — a bundler/assembler pasts the bytes; model compliance not required
- `COMPLIANCE-ONLY (UNBUILT)` — skill not yet built; injection unresolved

### Instance A-1
**File:** `.planning/ROADMAP.md` line 92
**Phrasing:** `~/knowledge/dr-marketing/ (the six files auto-injected into the Section Analyzer, §11)`
**Verdict:** `COMPLIANCE-ONLY (BUG)` — The spec this ROADMAP line references was corrected (F-02), but the ROADMAP itself was not updated. Any agent reading ROADMAP as a build reference gets the lie as its primary instruction. The actual mechanism (funnel-analyzer-context.js + inject-dr.js) is not reflected here.

### Instance A-2
**File:** `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-funnel-architect.md` line 107
**Phrasing:** `The DR files are auto-injected / pasted alongside this skill.`
**Verdict:** `COMPLIANCE-ONLY (BUG)` — This is the verbatim operator source-spec, intentionally preserved. The built SKILL.md was corrected to use `read_first` + bundler (A-3 below). But this source spec is the authority a future implementer reads first — it gives the wrong instruction before the verification mandate at line 183 contradicts it. Lie + correction live in the same file; lie comes first.

### Instance A-3
**File:** `.claude/skills/funnel-architect/SKILL.md` lines 13–23 (`read_first` block)
**Phrasing:** `read_first ... _dr-context.generated.md — all 5 DR files bundled. ONE Read loads them all. If missing or stale, regenerate with node tools/hooks/inject-funnel-architect-dr.js then Read it. Do NOT proceed without it`
**Verdict:** `HAS-DETERMINISTIC-INJECTION` — bundler script exists (`inject-funnel-architect-dr.js`); generated bundle exists (`.claude/skills/funnel-architect/_dr-context.generated.md`). Model compliance is still required to execute the Read, but the bundle is pre-built and the instruction is a one-step Read of a committed file, not a chain of individual file reads. Closest to deterministic the skill pattern allows.

### Instance A-4
**File:** `.claude/skills/market-selection/SKILL.md` lines 48–61 (`read_first` block)
**Phrasing:** `There is NO auto-injection — you must Read it: .claude/skills/market-selection/_dr-context.generated.md`
**Verdict:** `HAS-DETERMINISTIC-INJECTION` — Same pattern as A-3. Bundler (`inject-market-selection-dr.js`) + committed generated file. Explicit warning that auto-injection doesn't exist; single-file Read instruction. Correct.

### Instance A-5
**File:** `.planning/phases/02-stage-m1-s2-market-selection-gate/02-PATTERNS.md` lines 214–217
**Phrasing:** `DR-KB auto-inject (Discretion — supporting knowledge at invocation) … mechanism is Claude's discretion`
**Verdict:** `COMPLIANCE-ONLY (BUG)` — PATTERNS doc still uses the original pre-fix language. No bundler reference, no `read_first` instruction, explicit attribution to "Claude's discretion" which is exactly the compliance-only anti-pattern. This doc was not patched when the SKILL.md was corrected.

### Instance A-6
**File:** `prompts/funnel-deep-pass.md` (Section Analyzer spawn template)
**Phrasing:** `Your context ALREADY CONTAINS the DR marketing knowledge bundle... Do NOT attempt to Read them — they are already in front of you. (FALLBACK ONLY — if for some reason the bundle is absent... regenerate it with node tools/hooks/inject-dr.js and Read prompts/_generated/section-analyzer-dr-context.md)`
**Verdict:** `HAS-DETERMINISTIC-INJECTION` — The orchestrator (funnel-deep-pass SKILL.md step b) runs `funnel-analyzer-context.js` which embeds DR bundle + funnel body into the spawn prompt before the subagent is spawned. Bytes are in the prompt; the fallback Read is the backup path, not the primary path. Built by quick-task 260603-wfz. Correct.

### Instance A-7
**File:** `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-copywriter.md` line 104 (OPERATOR VERIFICATION MANDATE)
**Phrasing:** `the DR copywriting craft files ... must be wired via a DETERMINISTIC injection step ... NOT assumed "auto-injected" — hooks do not fire inside subagents`
**Verdict:** `COMPLIANCE-ONLY (UNBUILT)` — The spec correctly identifies the problem and mandates deterministic injection, but the copywriter SKILL.md has not been built (`.claude/skills/copywriter/` contains only `_dr-context.generated.md`, no SKILL.md). The bundle exists; the skill that would use it via `read_first` does not. Injection is unresolved.

### Instance A-8
**File:** `.planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-03-SUMMARY.md` line 12 + 80
**Phrasing:** `tools/hooks/inject-dr.js (runtime DR-file auto-injection for Section Analyzer)` / `DR files referenced as "auto-injected by inject-dr.js at runtime"`
**Verdict:** `COMPLIANCE-ONLY (BUG)` — Historical summary doc still carries the pre-fix label. inject-dr.js is a bundler, not an auto-injection hook; calling it "auto-injection" in a summary doc that agents may read propagates the lie.

### Summary table

| # | File | Has deterministic injection? |
|---|------|------------------------------|
| A-1 | ROADMAP.md line 92 | NO (bug) |
| A-2 | 15-SPEC-funnel-architect.md line 107 | NO (bug — source spec preserved verbatim) |
| A-3 | funnel-architect/SKILL.md read_first | YES (bundler + committed file) |
| A-4 | market-selection/SKILL.md read_first | YES (bundler + committed file) |
| A-5 | 02-PATTERNS.md lines 214-217 | NO (bug — "Claude's discretion") |
| A-6 | funnel-deep-pass.md Analyzer spawn | YES (funnel-analyzer-context.js embeds bytes) |
| A-7 | 15-SPEC-copywriter.md | UNBUILT (SKILL.md missing) |
| A-8 | 03-03-SUMMARY.md lines 12+80 | NO (mislabeled bundler as auto-injection) |

**Compliance-only bugs: 4 (A-1, A-2, A-5, A-8)**
**Has deterministic injection: 3 (A-3, A-4, A-6)**
**Unbuilt / unresolved: 1 (A-7)**

---

## ANTI-PATTERN B — Hooks/validators expected to gate subagent output (hooks don't fire in subagents)

### All validators in tools/hooks/

| Validator | What it gates | In route.js dispatcher? | Gate target inside a subagent? | Orchestrator runs it as explicit step? | Status |
|-----------|---------------|------------------------|-------------------------------|---------------------------------------|--------|
| `validate-finder.js` | `brands.json` Write | YES (on `brands.json`) | The space-classifier writes brands.json in main session | N/A — hook fires | LIVE + WIRED |
| `validate-dumper.js` | `dump.json` Write | YES (on `dump.json`) | The adlib/dumper writes dump.json in main session | N/A — hook fires | LIVE + WIRED |
| `validate-classifier.js` | `space-map.json` Write | YES (on `space-map.json`) | The space-classifier writes space-map.json in main session | N/A — hook fires | LIVE + WIRED |
| `validate-revenue.js` | `brands.json` Write | YES (co-fires with validate-finder) | Same as validate-finder | N/A — hook fires | LIVE + WIRED |
| `validate-analyzer.js` | Section Analyzer belief records | **NO — absent from route.js** | YES — Section Analyzer runs as a subagent | **Partially** — funnel-deep-pass SKILL.md step c says "validate-analyzer.js (PostToolUse) gates its Write automatically" but this is FALSE for subagents; the orchestrator is NOT explicitly running it as a step in the SKILL.md procedure | **DEAD / AT-RISK** |
| `validate-asset-record.js` | Asset classification records | **NO — absent from route.js** | YES — role-classify/comprehend-video run as subagents | YES — asset-classify SKILL.md step d explicitly runs `node tools/hooks/validate-asset-record.js` as an orchestrator step before persist | LIVE (orchestrator-step workaround) |

### DEAD validator: validate-analyzer.js

**Status: DEAD / AT-RISK**

Three enforcement failures compound:

1. **Not in route.js dispatcher.** The hook command in `.claude/settings.json` is:
   ```
   node tools/hooks/route.js "$CLAUDE_TOOL_INPUT_PATH" validate-finder validate-dumper validate-classifier validate-revenue
   ```
   `validate-analyzer` is absent. Even if the Section Analyzer wrote directly to disk in the main session, the hook would not fire.

2. **Section Analyzer runs as a subagent.** PostToolUse hooks fire on the session that executes the Write tool call. Subagents run in a separate context. A Write inside a subagent does NOT trigger the parent session's PostToolUse hooks. This is confirmed explicitly in funnel-deep-pass SKILL.md: "Hooks do not fire inside subagents — injection is YOUR step."

3. **Orchestrator does NOT run it as an explicit step.** Unlike validate-asset-record.js (which asset-classify SKILL.md runs explicitly at step d), the funnel-deep-pass SKILL.md step c says `validate-analyzer.js (PostToolUse) gates its Write automatically` — this is the bug: it asserts hook-based gating that cannot fire for a subagent Write. There is no `node tools/hooks/validate-analyzer.js` in the orchestration loop.

**Consequence:** The Section Analyzer's belief records are persisted by `funnel-store.js` with NO schema enforcement. Hallucinated verbatim_refs, off-enum execution_type, birdseye-only fields, wrong position ordinals — all pass through to `runs/<space>/funnels/*.json` silently.

### AT-RISK: validate-asset-record.js (correct workaround, verify it runs)

**Status: LIVE (orchestrator-step workaround) — verify it's followed**

asset-classify SKILL.md step d correctly runs:
```bash
node tools/hooks/validate-asset-record.js /tmp/asset-record-<id>.json --claim-list=...
```
This is the right pattern. The validator is not in route.js (correctly omitted — it requires `--claim-list`) and it gates at the orchestrator level instead. Risk: if an operator runs the asset-classify skill and skips step d (or uses a variant that doesn't invoke the validator), records persist unvalidated. The guard is procedural (in the SKILL.md prose), not mechanical (not enforced by the hook infrastructure).

### Hook dispatcher summary

**settings.json hook (the only PMF hook):**
```json
"PostToolUse" → matcher: "Write" → route.js → validate-finder + validate-dumper + validate-classifier + validate-revenue
```

Four validators fire. Two do not: `validate-analyzer` (DEAD), `validate-asset-record` (correct — orchestrator step).

The inject-* bundler scripts (`inject-dr.js`, `inject-funnel-architect-dr.js`, `inject-copywriter-dr.js`, `inject-market-selection-dr.js`) are NOT wired as hooks — they are CLI scripts requiring explicit invocation. This is correct given the subagent limitation; the gap is the docs that still say they are auto-injected (Anti-pattern A).

---

## COUNTS

- **Anti-pattern A instances:** 8 (4 compliance-only bugs, 3 with deterministic injection, 1 unbuilt)
- **Anti-pattern B validators surveyed:** 6 total
  - Wired + firing correctly: 4 (finder, dumper, classifier, revenue)
  - DEAD (not wired, not an orchestrator step): 1 (validate-analyzer)
  - Correct orchestrator-step workaround: 1 (validate-asset-record)
