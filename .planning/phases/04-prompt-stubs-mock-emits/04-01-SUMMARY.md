---
phase: 04-prompt-stubs-mock-emits
plan: 01
subsystem: infra
tags: [prompt-stubs, stub-emit, two-tier-classification, acceptance-harness]
note: Backfilled 2026-06-28 from committed code + 04-XVERIFY-FIX.md + gate evidence + xhigh synthesis. Built by an isolated background GSD agent; SUMMARY/VERIFICATION reconstructed for milestone provenance.

requires:
  - phase: 03-step-manifests
    provides: the 11 manifests (prompt: slot paths + writes[] each stub must emit)
provides:
  - "prompts/00..10-*.md — 11 bet-compiler-envelope stubs, each with a marked BODY drop-in region + a ```stub-emit fenced mock-emit block"
  - "engine/bricks/run-controller.js — minimal additive multi-write STUB-mode emit (readStubEmit/writeOne/array mockEmit + REFUSE guards); Mode A fixtures preserved"
  - "engine/contracts/stub-smoke.sh — STUB-01..04 + WIRE-03 (5-axis trace) + emit-vs-seed + determinism + slot-fidelity gate"
affects: [05-validators, 06-smoke-run]

key-files:
  created:
    - prompts/00-bet-compiler.md
    - prompts/01-collect.md
    - prompts/02-funnel-analysis.md
    - prompts/03-space-map.md
    - prompts/04-voc-market-pass.md
    - prompts/05-market-selection.md
    - prompts/06-voc-deep-pass.md
    - prompts/07-funnel-architect.md
    - prompts/08-copywriter.md
    - prompts/09-asset-classify.md
    - prompts/10-adversarial-re-review.md
    - engine/contracts/stub-smoke.sh
  modified:
    - engine/bricks/run-controller.js

key-decisions:
  - "STUB mode emits EVERY writes[] (not just writes[0]); a prompt's ```stub-emit block must carry a payload for each file write or the controller REFUSEs (no silent hollow emit)"
  - "Emits are deterministic (no Date/random) → byte-identical re-runs, no-overwrite-v1 safe"
  - "WIRE-03 two-tier: Step2 _tally.json carries RAW per-funnel angle/claim/transformation/niche/bet_type/mechanism; Step3 space-map canonicalizes all 5 axes with raw_variants tracing to Step2 labels"
  - "Real marketing prompt BODY left as an explicit marked drop-in slot (deferred CONTENT-01)"

patterns-established:
  - "Bet-compiler envelope stub (OUTPUT CONTRACT + COMPLETENESS + HOW-IT'S-CONSUMED + marked empty BODY + stub-emit block)"

requirements-completed: [STUB-01, STUB-02, STUB-03, STUB-04, WIRE-03]

duration: ~23min
completed: 2026-06-27
---

# Phase 4 — Prompt Stubs ×11 + Mock Emits — Summary (backfilled)

11 bet-compiler-envelope stub prompts, each emitting its manifest `writes[]` as contract-shaped
deterministic mock artifacts in STUB mode (minimal additive controller hook). WIRE-03 two-tier
classification realised: Step2 raw per-funnel axes → Step3 canonical, all 5 axes traced. The full
`run all --space=smoke` already completes end-to-end clean at this phase.

xhigh adversarial verification: 5/5 content verdicts sound (26 writes materialize, WIRE-03 real
two-tier all 5 axes, byte-deterministic); 1 HIGH HARNESS over-claim (stub-smoke passed hollow {},
emit-vs-seed indistinct, WIRE-03 transform-axis-only, determinism only space-map, no slot-fidelity)
fixed — shape map + non-seed + all-5-axis collapse/trace + full determinism + slot fidelity, 6
mutations RED-proven (04-XVERIFY-FIX.md, commit bb4d92a).

Commits: fc9504d (context), fa6991d (11 stubs + multi-write emit), 506dd2e (harness),
22bf40a (harden emit + full WIRE-03 trace), ece8d69 (mark complete), bb4d92a (xhigh harness hardening).
