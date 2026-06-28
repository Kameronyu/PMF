# Milestones

## v1.0 Shell (Shipped: 2026-06-28)

**Phases completed:** 6 phases, 5 plans, 9 tasks

**Key accomplishments:**

- Idempotent runs/<space>/ slot-tree scaffolder + shared __-join fan-out namer + committed `smoke` space + the complete STORE-01..05 bash acceptance harness (STORE-02/03 RED by design until Plan 02).
- Whole-space no-overwrite-v1 version resolver (read-only, names the next free `<base>-vN`, mutates nothing) + per-spawn `_receipts/<spawn_id>.json` ledger writer with a sha256-over-sorted-bytes `inputs_hash` — turning the full `store-smoke.sh` GREEN across STORE-01..05.
- Authored the real R1 pipeline.yaml, a git-whitelisted §5 fixture manifest set, and controller-smoke.sh (one named assert per CTRL-01..12) — the executable RED contract Plan 02-02's run-controller must turn green.
- Built `engine/bricks/run-controller.js` — the PART3 §8 seven-phase loop (preflight → plan-print → context-assembly → spawn → validate → store+receipt → operator-gate) assembled as pure ordering glue over the Phase-1 store bricks + route.js — plus the thin `bin/run` entrypoint, turning Plan 01's RED `controller-smoke.sh` GREEN (all 12 CTRL asserts pass) with no store/engine regression.

---
