# REBUILD-ROADMAP — how this project gets rebuilt

The shape: **harden the engine (bones) → bring the new marketing topology → rebuild marketing ON TOP of the hardened engine → build the missing stages → prove end-to-end.** The engine is the stable substrate; marketing is the layer that gets appended.

---

### R0 · Engine wiring hardening  ← **CURRENT (Phase 21)**
Fix every Arduview retrieval/wiring failure; smoke each engine capability green. Engine-only.
- Driver: `engine/contracts/HARDENING.md` + `RETRIEVAL-FAILURES-arduview.md` (via operator's automation skill or `/gsd-execute-phase 21`).
- **Exit:** every `engine/bricks` + `engine/integrations` + the `reddit-extract` retriever has `health: working` in `REGISTRY.md`; E2E coherence run on `runs/_fixture/` passes. Wiring is now appendable.

### R1 · Operator brings marketing docs
The rewritten prompts + the I/O contracts / step+agent topology (what each agent produces, what consumes it).
- **Exit:** a readable topology exists to name the wiring against.

### R2 · Reconcile + de-entangle
- Replace every `PROVISIONAL` step/agent label in `REGISTRY.md` with the real topology names.
- Extract the contracts (enums/schemas) the new prompts depend on into `engine/contracts/` so a prompt rewrite can't break a contract (the H0 work feeds this).
- **Exit:** REGISTRY reflects the real names; contracts are the single source of truth.

### R3 · Nuke + clean slate
- Delete the old marketing/cruft (whitelist what survives — recoverable via `m1-arduview-retro`): `prompts/`, `marketing-lens/`, `definitions.md`, `workflow.md`, `map/`, `_quarantine/`, `.planning/`, `ads/`/`corpus/`/`assets/`, stale handoffs, the marketing `.claude/skills/*`, the stale `.planning/codebase/` map.
- Keep: `engine/`, infra, `reddit-extract`, chosen reference (arduview creds, capability_inventory, lessons, VOC spec).
- **Exit:** repo = hardened `engine/` + infra only.

### R4 · New GSD project
- `/gsd-new-project` (clean repo; skip brownfield mapping — `engine/` is already mapped). Regenerates `PROJECT.md` + requirements + a trustworthy roadmap for the new marketing system.
- Wire the marketing firewall (`guard-marketing.js`) so the build can't corrupt the engine contracts.
- **Exit:** fresh, trusted `.planning/` scoped to the marketing rebuild.

### R5 · Build marketing on the engine
- Author the new marketing agents/prompts/skills against the engine contracts (`enums.json`, `schemas/`, `REGISTRY.md`) — bricks only ever receive file-path args, so this is additive.
- **Exit:** the light-pass → deep-pass → architect → copywriter chain runs on the hardened engine.

### R6 · Build the BUILD-ABSENT stages
The holes no wiring fix touches: **Step 3 VOC** (`handoff-step3-voc-build.md` — Reddit→Bucketer→Ladderer→Language, on the now-green `reddit-extract` retriever) and **spend-validation lift** (comparable-seed ad-longevity into the cells).
- **Exit:** belief chains rest on buyer language + spend-validated signal, not asserted transformation.

### R7 · End-to-end proof
- Run a fresh product through the full pipeline; `gsd-integration-checker` validates every producer→consumer seam.
- **Exit:** a clean run with no null-input decisions — the failure mode that defined the Arduview run is gone.

---

**Invariant across all of it:** the engine never gets rebuilt — only hardened (R0) and named (R2). Everything from R3 on is marketing the operator owns, appended onto bones that are already proven green.
