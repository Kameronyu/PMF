---
phase: 06-smoke-run-definition-of-done
plan: 01
status: complete
requirements: [SMOKE-01, SMOKE-02, SMOKE-03, SMOKE-04, SMOKE-05]
requirements-completed: [SMOKE-01, SMOKE-02, SMOKE-03, SMOKE-04, SMOKE-05]
gates_green: 7
built_by: inline (main session) — after two background build agents died on API transport drops
---

# Phase 6 — Smoke Run & Definition-of-Done — SUMMARY

The FINAL build phase. Formalizes the milestone Definition-of-Done as a 7th acceptance
gate and closes the last deferred shell hole (SMOKE-05).

## Built
- **`engine/contracts/smoke-dod.sh`** (new, the 7th gate) — the milestone DoD harness. Runs
  `run all --space=<fresh> --smoke` and asserts the Core Value at the RUN grain:
  - **SMOKE-01** — 11 steps run in canonical R1 order, exit 0; 11 receipts; order proven by
    receipt `ts` non-decreasing along pipeline order (not by re-reading pipeline.yaml).
  - **SMOKE-02** — every receipt's `validator_verdicts` non-empty and every verdict == pass.
  - **SMOKE-03** — all 26 declared `writes[]` slots (11 manifests, {space}-substituted, files + dirs)
    materialized on disk.
  - **SMOKE-04** — gates logged + unbroken chain: gated {00,01,05,07,08,10} log
    `decision='auto-approved-smoke'`, non-gated `null`, every `inputs_hash` 64-hex.
  - **SMOKE-05a** — zero orphan / zero dangling computed over the REAL emitted run
    (`producedBy[]` from receipt.outputs[]/inputs[] in canonical order; TERMINAL allowlist).
  - **SMOKE-05b** — a DROPPED producer (drop 02) and a REORDERED producer (03 before 02) each
    fail fast with the NAMED `pipeline incomplete/misordered` refusal; a complete custom pipeline passes.
  - **DETERMINISM** — two fresh full runs byte-identical (excl `_receipts/`, `*-log.txt`).
  - RED-first: authored so SMOKE-05b fails (generic preflight missing-input refuse, not the
    completeness refusal) until the controller preflight lands; verified RED, then GREEN.
- **`engine/bricks/run-controller.js`** — a `runAll()` **pipeline-completeness preflight** in front
  of the spawn loop (the SMOKE-05 mechanism). Builds `producedBy[]` over the ACTIVE pipeline; a step
  reading a path with no strictly-earlier producer → NAMED `pipeline incomplete/misordered` refusal,
  `exit 1`, BEFORE any spawn. **Subtlety:** a read produced by NO manifest in the manifest-dir is a
  genuine external pipeline-entry input (e.g. a seeded `bet-brief.md`) and is ALLOWED — the canonical
  manifest-dir scan distinguishes a dropped/reordered internal producer (refuse) from an external
  entry (allow). Dropping a step from the pipeline FILE does not delete its manifest, so a dropped
  internal producer is still caught. Pure front-guard: `runStep`/`loadManifest`/`parsePipeline`/
  `preflight` unchanged, no per-step special-casing.

## Regression caught + fixed during build
The first preflight cut refused the fixture pipelines (their steps read an external seeded
`bet-brief.md` that no fixture manifest produces) → controller-smoke CTRL-02 + the deliberate
reversed-order CTRL-10 went red. Fixed by the external-entry classification (manifest-dir canonical
scan) — NOT by weakening the fixtures. Both gates recovered; smoke-dod stayed green.

## Acceptance (all verified)
- **7 gates green:** store-smoke, controller-smoke, h6-all, manifest-smoke, stub-smoke,
  validate-smoke, smoke-dod.
- Committed `run all --space=smoke --smoke` exits 0; `runs/smoke/` byte-intact after restore.
- Frozen: `pipeline.yaml`, `engine/manifests/*.json`, `prompts/`, `runs/smoke/` UNCHANGED.
  `git diff` touches only `engine/contracts/smoke-dod.sh` (new) + `engine/bricks/run-controller.js`.
- No stray `runs/_vfy*` spaces.

## Commits
- `00942ff` test(06): smoke-dod DoD harness — RED on completeness preflight
- `e5ca778` feat(06): run-all pipeline-completeness preflight (SMOKE-05) — GREEN

## Build note
Built inline in the main session after two background build agents died on API ConnectionRefused /
stream-watchdog drops (transport, not logic). The surviving `gsd-plan-phase 6` plan (`06-01-PLAN.md`)
was followed task-by-task with per-task commits for drop-resilience. An independent xhigh adversarial
verification was run afterward (same quality gate as every prior phase).

## Deferred (NOT this milestone — content jobs / future milestones)
- Real field-level seam schemas / contract-congruence (CONTENT-02).
- Real marketing prompt BODIES (pure slot-fill into the marked `# BODY` + ```` ```stub-emit ```` region).
- Prompt-division (1-vs-N agents per step); Phase B (production & launch).
- `writeOne` no-overwrite destructive-write guard hook — explicitly CLAUDE.md-deferred (convention only).
