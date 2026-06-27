---
phase: 2
slug: run-controller-pipeline-spine
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-06-27
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.
> Bash smoke is the project's idiom (no JS test framework — mirrors `h6-*.sh` / `store-smoke.sh`).
> The mechanical proof is `engine/contracts/controller-smoke.sh`: one named assert per CTRL id.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | bash smoke harness (project idiom — NOT jest/vitest/pytest) + node stdlib asserts |
| **Config file** | none — each harness is a standalone `engine/contracts/*.sh` |
| **Quick run command** | `bash engine/contracts/controller-smoke.sh` |
| **Full suite command** | `bash engine/contracts/h6-all.sh && bash engine/contracts/store-smoke.sh --space=smoke` |
| **Estimated runtime** | ~10-20 seconds |

---

## Sampling Rate

- **After every task commit:** `bash engine/contracts/controller-smoke.sh` (fast, self-cleaning)
- **After every plan wave:** `bash engine/contracts/h6-all.sh` + `bash engine/contracts/store-smoke.sh --space=smoke` (regression guard — the controller must not break the store/engine layer)
- **Before `/gsd-verify-work`:** `controller-smoke.sh` ALL ASSERTS PASS **and** clean `git status` for `runs/`
- **Max feedback latency:** ~20 seconds

---

## Per-Task Verification Map

| Req ID | Behavior | Test Type | Automated Command / Assert | File Exists | Status |
|--------|----------|-----------|----------------------------|-------------|--------|
| CTRL-01 | single step runs all 7 phases | smoke | `run <fx-step> --space=_ctrlsmoke --smoke` exits 0; plan-print shows 7 phase markers; a receipt lands | ❌ W0 | ⬜ pending |
| CTRL-02 | `run all` walks pipeline in R1 order | smoke | `run all --pipeline=<fixture> --space=_ctrlsmoke --smoke` exits 0; receipts appear in fixture-id order | ❌ W0 | ⬜ pending |
| CTRL-03 | preflight named refusal on missing input | smoke (negative) | run a fixture step with a `reads[]` artifact deleted → exit≠0 + stderr names the missing path (REFUSE) | ❌ W0 | ⬜ pending |
| CTRL-04 | plan-print declares DAG before running | smoke | capture stdout; the plan block (pre/spawn/post/validator/gate) prints BEFORE any emit/receipt line | ❌ W0 | ⬜ pending |
| CTRL-05 | context assembled, agent never Reads store | smoke | the assembled context block embeds the `reads[]` bytes (mock-emit consumes the block, not the file) | ❌ W0 | ⬜ pending |
| CTRL-06 | spawn waves capped ≤5 | unit | fixture manifest `agents:6` → 2 waves (5+1) in plan/log; no wave >5 | ❌ W0 | ⬜ pending |
| CTRL-07 | validator invoked EXPLICITLY; reject→re-spawn≤2→escalate | smoke + negative | (a) a validator subprocess ran (not a hook); (b) bad emit → ≤2 re-spawns then escalate line + exit≠0 | ❌ W0 | ⬜ pending |
| CTRL-08 | no-overwrite version + receipt write-once, unique id | smoke + unit | (a) `_receipts/<id>.json` has required keys + sha256 `inputs_hash`; (b) `space-version.js` returns `<base>-v2` after scaffold; (c) re-write same spawn-id → exit 1 | ❌ W0 | ⬜ pending |
| CTRL-09 | gate blocks/auto-approves, logged never silent | smoke | `gate:true` fixture step `--smoke` → `GATE [...] auto-approved-smoke` logged AND receipt `gate.step_gated===true` | ❌ W0 | ⬜ pending |
| CTRL-10 | pipeline order = config edit, no code | unit | reorder fixture `pipeline.yaml` → receipt order follows the file (no controller edit) | ❌ W0 | ⬜ pending |
| CTRL-11 | manifest loader reads §5 shape | unit | `loadManifest(fx-id)` returns object with `reads/writes/scripts/prompt/agents/validator/gate` keys | ❌ W0 | ⬜ pending |
| CTRL-12 | assembled from bricks, not rewritten | static (grep) | `run-controller.js`: NO `createHash`, NO inline sanitize regex, NO `-v(\d+)` scan, NO slot-list literal; DOES `require('./lib/fanout-path')` + spawn `receipt-write.js`/`space-version.js`/`route.js` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `engine/bricks/run-controller.js` — the unit under test (must exist before the harness asserts pass)
- [ ] `engine/contracts/controller-smoke.sh` — covers CTRL-01..12 (one named assert per id; mirrors `store-smoke.sh`)
- [ ] `runs/_fixture/pipeline/pipeline.yaml` (or fixture location) — fixture flat id list (drives CTRL-02/10)
- [ ] `runs/_fixture/pipeline/manifests/*.json` — 1–3 minimal §5-shaped manifests (one with recognized `validator`/basename, one `gate:true`, one `agents:6` for the wave assert)
- [ ] Framework install: none — bash + node stdlib already present
- [ ] (negative fixtures) inline `rm` of a `reads[]` input (CTRL-03) + a known-bad-emit manifest (CTRL-07) — inline in the harness, mirroring `store-smoke.sh`'s inline mutation pattern

*The real `pipeline.yaml` (root, steps 0..10 in R1 order) is the production artifact (CTRL-10/02); the fixture has its own small list for the harness.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| (none) | — | All Phase-2 behaviors have automated bash-smoke verification | — |

*All phase behaviors have automated verification via `controller-smoke.sh`.*

---

## Validation Sign-Off

- [ ] All CTRL ids have an automated assert in `controller-smoke.sh` or a Wave 0 dependency
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references (controller + harness + fixtures)
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
