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

### R3 · Quarantine (NOT nuke) → clean slate
- **MOVE** the old marketing/run/planning surface into `_legacy/` and gitignore it — preserved on disk + in git history + the `m1-arduview-retro` tag, but invisible to git/tooling/GSD. Nothing deleted. (Exact command in `HANDOFF.md` §R3.)
- Quarantine: `prompts/`, `marketing-lens/`, `definitions.md`, `workflow.md`, `map/`, `_quarantine/`, `.planning/`, `ads/`, `corpus/`, `assets/`, `README.md`, `run-retrospective.md`, `handoff-*.md` (pull `handoff-step3-voc-build.md` back out at R6), `agents/`, `brands.json`, root `space-map.json`, `runs/arduview/`, `runs/eink-tablets/`, the marketing `.claude/skills/*` (market-selection, funnel-architect, funnel-deep-pass, copywriter, asset-classify, pipeline-audit).
- **Keep live at root:** `engine/`, infra (`CLAUDE.md`, `.gitignore`, `.venv`, `.claude/settings.json`), `.claude/skills/reddit-extract/`, `capability_inventory.md` (engine ref), `runs/_fixture/` (engine smoke fixtures).
- Note: `CLAUDE.md` will then reference quarantined `workflow.md`/`definitions.md` — refresh those refs at R4.
- **Exit:** repo's live surface = hardened `engine/` + infra; everything old tucked in ignored `_legacy/`.

### R4 · New GSD project
- **`/gsd-new-project`** is the right move *because* R3 quarantined `.planning/` — there's no `PROJECT.md` at root to continue from, so GSD regenerates one for the new marketing direction (skip brownfield mapping; `engine/` is already mapped via `REGISTRY.md`). (If you instead kept `.planning/` live, `/gsd-new-milestone` would be the move — but that contradicts the tuck-away.)
- Regenerates `PROJECT.md` + requirements + a trustworthy roadmap for the new marketing system.
- Refresh `CLAUDE.md` references to the now-quarantined `workflow.md`/`definitions.md`. Wire the marketing firewall (`guard-marketing.js`) so the build can't corrupt the engine contracts.
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
