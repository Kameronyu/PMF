---
phase: quick-260603-wfz
plan: 01
subsystem: funnel-deep-pass (Section Analyzer input layer)
tags: [determinism, prompt-injection-defense, D-17, orchestration]
requires:
  - tools/hooks/inject-dr.js (DR bundler — spawned, not reimplemented)
  - tools/funnel-clean.js ( <funnel_id>-clean.json cleaned_body)
  - tools/funnel-store.js (sanitizePathSegment source, T-03-13)
provides:
  - tools/funnel-analyzer-context.js (deterministic DR + funnel-body assembler)
  - funnel-deep-pass.md ORCHESTRATION contract (embedded analyzer context)
affects:
  - prompts/funnel-deep-pass.md (analyzer context-acquisition step + pipeline diagram)
  - 03-DEBUG-RUN-NOTES.md (D-17 closure note)
tech-stack:
  added: []
  patterns:
    - "child_process.spawnSync to REUSE inject-dr.js (never reimplement the 6-file bundle)"
    - "untrusted third-party content preserved verbatim inside <funnel_copy> data boundary"
    - "path-segment sanitizer copied verbatim from funnel-store.js (security parity)"
key-files:
  created:
    - tools/funnel-analyzer-context.js
  modified:
    - prompts/funnel-deep-pass.md
    - .planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md
decisions:
  - "DR bundle obtained by spawning inject-dr.js --stdout; exit !=0 → exit 2, never fabricate DR content"
  - "cleaned_body resolved via --clean=<path> (space not required) OR --space → runs/<space>/funnels-clean/<id>-clean.json"
  - "funnel body wrapped EXACTLY in the analyzer's existing <funnel_copy> boundary — no escape/trim"
  - "analyzer prompt flipped from 'MUST Read' to 'ALREADY CONTAINS', Read kept as fallback only"
metrics:
  tasks: 3
  files: 3
  completed: 2026-06-03
---

# Phase quick-260603-wfz Plan 01: Funnel Section-Analyzer Context Orchestration Summary

Closed the last non-deterministic seam on the Section Analyzer's INPUT: a new deterministic script
(`funnel-analyzer-context.js`) assembles `[DR bundle via inject-dr.js]` + `[cleaned funnel body in
<funnel_copy>]` into one orchestrator-pasteable block, so the analyzer receives the bytes instead of
being told to `Read` them.

## What was built

- **`tools/funnel-analyzer-context.js`** (new, ~230 lines) — deterministic context assembler.
  Spawns `inject-dr.js --stdout` for the DR bundle (reuse, never reimplement; refuses to fabricate
  on spawn failure → exit 2), reads `cleaned_body` from a `funnel-clean.js` output, and emits ONE
  block: header → DR bundle → trusted funnel-fields preamble → cleaned body wrapped verbatim in
  `<funnel_copy>`. `sanitizePathSegment()` copied verbatim from `funnel-store.js` (T-03-13). CLI
  mirrors repo conventions (`--help`, stderr diagnostics, explicit exit codes 0/1/2). Stdout-default
  (orchestrator-paste), `--out` for file.
- **`prompts/funnel-deep-pass.md`** (doc) — analyzer context-acquisition step now reads
  "ALREADY CONTAINS" (Read kept as fallback only); new **ORCHESTRATION** section documents the
  3-step per-funnel loop; pipeline diagram line updated to the assembler. Schema/enums untouched.
- **`03-DEBUG-RUN-NOTES.md`** (doc) — dated **D-17 closure** subsection with the real verify
  command output; explicitly keeps the live methodology-debug smoke test on D-02.

## Verification

End-to-end (Task 3 automated verify) PASSED on a real `funnel-clean.js` output:

```
[funnel-analyzer-context] emitted 60864 chars (DR bundle 59658 chars, funnel body 51 chars)
PASS: DR MARKETING KNOWLEDGE FILES found   (DR bundle present)
PASS: KAM-VERIFY-FUNNEL-MARKER found       (funnel body present)
PASS: <funnel_copy> boundary found         (untrusted-data boundary present)
VERIFY_OK
```

`node --check tools/funnel-analyzer-context.js` passes; `--help` exits 0. `git diff` confirms no
modification to funnel-store.js / funnel-clean.js / funnel-score.js / funnel-assemble.js / 6a-6b
schema. Copywriter-RAG files (tools/lib/embed.js, tools/funnel-vectorize.js, tools/funnel-rag-query.js)
confirmed absent in this worktree (uncommitted on main worktree) — not recreated, as instructed.

## Deviations from Plan

None — plan executed exactly as written. (Worktree was reset to the correct base per the
`<worktree_branch_check>` step; merge-base differed from expected and was hard-reset before any
work — standard EnterWorktree correction, not a plan deviation.)

## Known Stubs

None. The assembler produces real bytes from real DR files and real cleaned bodies; no placeholder
or empty data paths flow to output (empty `cleaned_body` is a hard error, not a stub).

## Commits

- `ea3fd43` feat(quick-260603-wfz): add funnel-analyzer-context.js deterministic context assembler
- `6af6a93` docs(quick-260603-wfz): wire funnel-deep-pass.md to embedded analyzer context
- `7081458` docs(quick-260603-wfz): record D-17 closure note (deterministic analyzer-context injection)
