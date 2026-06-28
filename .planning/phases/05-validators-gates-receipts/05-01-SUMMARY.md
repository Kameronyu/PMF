---
phase: 05-validators-gates-receipts
plan: 01
subsystem: infra
tags: [validators, gates, receipts, route-dispatch, acceptance-harness]
note: Backfilled 2026-06-28 from committed code + 05-XVERIFY-FIX.md + gate evidence + xhigh synthesis. Built by an isolated background GSD agent; SUMMARY/VERIFICATION reconstructed for milestone provenance.

requires:
  - phase: 03-step-manifests
    provides: the 11 manifests (validator: field to bind)
  - phase: 04-prompt-stubs-mock-emits
    provides: contract-shaped stub emits the validators must pass on
provides:
  - "engine/hooks/validate-shape.js + engine/contracts/output-shapes.json — generic presence + top-level-shape + non-hollow + drift-guard validator"
  - "engine/hooks/route.js — dispatch extended to ALL ~14 outputs (silent-pass tail removed)"
  - "engine/hooks/validate-classifier.js — WIRE-03 trace-back + axis-presence"
  - "engine/bricks/run-controller.js — preflight hollow-input refusal (VALID-02) + gate-decision + validator_verdicts threaded into receipt (VALID-04/05)"
  - "engine/bricks/receipt-write.js — --verdicts flag"
  - "engine/contracts/validate-smoke.sh — VALID-01..05 + mutation-reject gate"
affects: [06-smoke-run]

key-files:
  created:
    - engine/hooks/validate-shape.js
    - engine/contracts/output-shapes.json
    - engine/contracts/validate-smoke.sh
  modified:
    - engine/hooks/route.js
    - engine/hooks/validate-classifier.js
    - engine/bricks/run-controller.js
    - engine/bricks/receipt-write.js
    - engine/manifests/00..10-*.json   # validator field only (reads/writes/gate/prompt UNCHANGED)

key-decisions:
  - "Engine validation dispatch EXTENDED (route.js table) not rewritten — proven brick cores untouched (operator wiring mandate)"
  - "VALID-02 input refusal reuses validate-shape at the reads[] seam (symmetric input/output validation)"
  - "Gate decision computed before receipt write; auto-approved-smoke for gated+smoke, blocks (exit 4) gated+non-smoke; receipts stay write-once"
  - "__MD__ scaffold-placeholder reject implemented; real multi-line stub .md passes"

patterns-established:
  - "Per-output OUTPUT-CONTRACT-key validation via a declarative output-shapes.json map + a drift-guard that rejects unmapped outputs"

requirements-completed: [VALID-01, VALID-02, VALID-03, VALID-04, VALID-05]

duration: ~14.5min
completed: 2026-06-27
---

# Phase 5 — Validators, Gates & Receipts — Summary (backfilled)

Bound real per-step validators across all 11 manifests (route.js → validate-shape.js +
output-shapes.json, covering all ~14 outputs — the prior silent-pass tail removed), added the
Step-3 classifier WIRE-03 trace-back, preflight hollow-input refusal (VALID-02), gate-decision +
real validator_verdicts in the receipt (VALID-04/05), with `run all --space=smoke` still clean
(real validators pass on the well-formed stub emits) and REJECT/REFUSE on malformed/hollow/missing.

xhigh adversarial verification: 5/5 sound, **0 blockers, false_green_risk=false everywhere** —
validators genuinely execute/reject/gate; run-all green is real not vacuous. 3 non-blocking gaps
closed (regression-net hole on the generic shape gate now RED-pinned + controller-escalation assert;
VALID-02 strengthened to reuse validate-shape at the input seam; __MD__ placeholder reject), all
mutation-proven (05-XVERIFY-FIX.md, commits d7ba9c1/eacfece/448e364).

Commits: 270fdbc (validators + wiring), a7657ab (validate-smoke harness), 4a63e97 (fixtures + mark
complete), d7ba9c1/eacfece/448e364 (xhigh hardening).
