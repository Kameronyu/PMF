# PMF Marketing Pipeline — Retrospective

## Milestone: v1.0 — Shell

**Shipped:** 2026-06-28
**Phases:** 6 | **Plans:** 5 (+ inline Phase 6) | **Acceptance gates:** 7 green

### What Was Built
A runnable shell of Steps 0–10 that completes end-to-end on stub prompts: the `runs/<space>/`
artifact store (no-overwrite-v1 + receipts), the PART3 §8 7-phase run-controller + `pipeline.yaml`,
11 declarative step manifests (producer→consumer graph closed), 11 bet-compiler-envelope prompt
stubs with deterministic STUB-mode mock emits, per-step validators + operator gates + an unbroken
receipts chain, and a Definition-of-Done harness (`smoke-dod.sh`) that asserts the Core Value at the
run grain with a completeness preflight. Mechanism, not content — real prompts and field schemas are
now pure drop-in slots.

### What Worked
- **Per-phase xhigh adversarial verification as a hard gate.** A Claude Workflow spawning 5
  skeptical verifiers + a synthesis after each phase caught real false-greens the GSD review/verify
  passes missed — every phase: a high-sev silent receipt overwrite (P1), an unbounded wave-count DoS
  + same-ms ordering false-green (P2), a producer-blind graph check (P3), a harness that green-lit
  hollow content (P4), an unpinned regression-net (P5). All fixed before the phase closed.
- **Wave-0 RED-then-green acceptance harnesses.** Authoring each gate RED first (it fails before the
  unit exists) made "done" mechanical and caught the completeness-preflight gap by construction.
- **Atomic per-task commits.** When background agents died mid-run (API transport drops), state was
  always recoverable from git — no lost work, re-dispatch from the last commit.
- **Reuse-not-rewrite.** The controller is pure ordering glue over existing engine bricks; the shell
  never rewrote the proven fetch/clean/route layer (h6-all stayed 14/14).

### What Was Inefficient
- **API transport drops** killed two background build agents on the final phase (ConnectionRefused /
  stream-watchdog). Cost ~2 dead runs (~35 min) before switching Phase 6 to inline execution.
- **GSD artifact lag.** Background agents committed code + CONTEXT + XVERIFY-FIX but not the GSD
  SUMMARY/VERIFICATION files, so Phases 3–6 needed a backfill pass at milestone close.
- A pre-existing **WSL2 fs-visibility race** in `store-scaffold` made scaffold-dependent gates
  intermittently flaky, causing some false "FAIL then PASS" confusion mid-build.

### Patterns Established
- **xhigh adversarial verify after every phase** (reusable Workflow scriptPath; python-extract the
  synthesis, never Read the raw output).
- **Ordered, producer-id-bound graph integrity** — at the manifest grain (`manifest-smoke`) and
  mirrored at the run grain (`smoke-dod` SMOKE-05a) + enforced live (runAll completeness preflight).
- **Validator reuse at both seams** — `validate-shape` runs on outputs (route.js) AND on load-bearing
  inputs (preflight), so input/output refuse symmetrically.
- **Determinism pin for gates** — `unset VOYAGE_API_KEY` so an embed-touching step uses the
  deterministic stub backend; a regression gate must not depend on a live network API.

### Key Lessons
- Treat the acceptance harness itself as an adversarial target: most phase false-greens were in the
  GATE (over-claiming coverage), not the build. Mutation-test the harness.
- When infra is unreliable, prefer drop-resilient execution (inline + per-task commits) over
  re-throwing background agents into a transport storm.
- A flaky gate is a real cost even when "self-corrects on retry" — it erodes trust in the signal.

### Cost Observations
- Model mix: Opus throughout (quality profile); xhigh effort for all adversarial verification.
- Conductor pattern: thin dispatcher (main session) + isolated per-phase build agents + per-phase
  xhigh verify Workflow. Heavy work stayed out of the main context until Phase 6 went inline.

## Cross-Milestone Trends

| Milestone | Phases | Gates | xhigh findings fixed | Notes |
|-----------|--------|-------|----------------------|-------|
| v1.0 Shell | 6 | 7 | 1 high + several med/low (harness false-greens) per phase; P6 clean | First milestone; mechanism-only shell |
