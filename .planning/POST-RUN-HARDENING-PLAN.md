# Post-Run Hardening & Extension Plan

*Derived from the arduview first-run audit (`.planning/audit/01–08`). Lightweight GSD: each phase → `/gsd-plan-phase <n> --skip-research` → `/gsd-execute-phase`. Verification = UAT.*

---

## Two parallel tracks + the gate

- **Operator track (marketing) — your surface, unblocks hardening:**
  - Work the 19 decisions in `runs/arduview/_marketing-decisions/`.
  - Author the Copywriter prompt (pending roadmap plan 15-04) + any Funnel-Architect prompt edits.
  - Do the deferred deep-pass **Task-3 belief-tagging validation** (the 6 open items in `_marketing-decisions/deep-funnel-pass.md`) — the 43 belief records were never marketing-validated, yet the architect consumes them as ground truth.

- **Claude track (agentic) — everything below.** Phases **A–B run now**. **C onward is GATED** until the marketing track lands, because the I/O contracts are downstream of the prompts — locking them before the prompts settle just buys rework.

---

## Sequence (dependency-ordered)

### A — Cleanup & health  `[unblocked, now]`
Execute the safe cleanup manifest (`audit/06`): remove the exact-dup root `drive.cjs`, gitignore `_*-log.txt`, archive `launch/inkleaf-*` → `_archive/eink-launch/`. Resolve the 3 parked decisions (`map/data_inventory.md`, `STRATEGY-DISCUSS-HANDOFF.md`, `_mechanisms-in-play.agent.json`). Run `gsd-health` on `.planning/`. Adopt a no-overwrite-v1 versioning rule.
→ GSD: `gsd-cleanup` / quick task. **Awaiting operator approval of the moves + the 3 decisions.**

### B — Deep-pass bug fixes  `[mostly unblocked, now]`
Apply the 5 SAFE-NOW fixes (`audit/08`): `funnel_fields` persistence (`funnel-store.js`), `normalizeUrl()` strip-list (`funnel-assemble.js`), `_index.json` rebuild, deterministic-DR-injection rule, ghost-field doc cleanup. Hold the 1 CONTRACT-GATED fix (`belief_kind`/`source_routing` schema add) for Phase C.
⚠️ 2 of the 5 touch prompt/skill files (your surface) — coordinate before applying those two.

### C — Hardening: I/O contracts + context discipline  `[GATED on operator track]`  ← keystone
- Formalize per-step **I/O contracts** (the machine-readable form of `marketing-lens/MAP.md`): each step declares inputs / outputs / consumer.
- Scope the over-broad reads: Dumper reads only the definition clusters it uses; mirror the per-agent prompt split (already done in `marketing-lens/prompts/`) into the runtime prompts; drop unneeded DR files from bundles.
- **Wire the 2 unwired validators** (`validate-analyzer`, `validate-asset-record`) into the `route.js` PostToolUse dispatcher.
- **Kill the "auto-injected DR" lie** across the 5 docs + make injection real (bundler + read_first, or a real hook).
- Apply the gated `belief_kind`/`source_routing` fix.
→ GSD: `gsd-plan-phase`.

### D — Orchestrator per research stage  `[after C]`
**Decision: yes — one THIN orchestrator skill per research stage** (the brick model, already the pattern for `funnel-deep-pass` & `asset-classify`). Build the missing **light-pass orchestrator** (it's the only stage without one). The orchestrator is a fixed sequencer: call pre-built script → spawn judgment agent → run validator → collect. **No runtime script-writing** — all determinism is committed bricks.
→ GSD: `gsd-plan-phase`.

### E — Re-scope existing + author gaps  `[after C; partly operator]`
Split Funnel-Architect's off-job work (it did asset/video work that isn't architecting). Land the Copywriter prompt (15-04 — your marketing content, I scaffold). Fold product-video-strategist into Funnel-Architect (reads the existing `images.json`/`videos.json`).

### F — New launch-adjacent skills  `[M2 / pull-forward, after C/D]`
Competitor visual branding (screenshot-dump → visual-analyze → branding-decide; runs parallel to copywriter). Then Shopify implementation skill. Then Klaviyo.
→ GSD: `gsd-add-phase` ×N → plan → execute.

### G — Agent-readable project index  `[LAST — after structure stabilizes]`
So an investigation agent never reads boatloads to find what it needs: an index of what each file is, who reads it, what it contains. GSD-native: `gsd-intel` (`.planning/intel/`) + `gsd-map-codebase` (`.planning/codebase/`) + optionally `gsd-graphify` (knowledge graph). Fed by `MAP.md` + the Phase-C I/O contracts. This is the structural answer to the original context-bleed complaint.

### VOC  `[later]`
Already roadmapped as M1-S4…S11 (Track B, specced). Surface at the right trigger via `gsd-plant-seed`.

---

## Architecture decisions (answering the open questions)

1. **One orchestrator per research stage?** **Yes** — a thin orchestrator skill per stage. It's already the working pattern (`funnel-deep-pass`, `asset-classify`); light-pass is the gap. Each stage = a slash-command/skill.

2. **Will the orchestrator write scripts at runtime?** **No — by design.** All deterministic work (fetch/clean/dedupe/score/store/validate) is **pre-built, committed scripts (bricks)**. The orchestrator runs a FIXED recipe — script → judgment agent → validator → collect — it never authors code at run time. Per-run cost = judgment agents + cheap script invocations only. That's the long-term-cheap shape, and it matches the brick model already locked in `capability_inventory.md`.

3. **Can we index it so agents don't read boatloads?** **Yes — Phase G**, via `gsd-intel` / `gsd-map-codebase` / `gsd-graphify`, fed by `MAP.md` and the I/O contracts. Done last, once the file structure has stabilized.

---

## Pending verification
- **Retro-fidelity check** (light-pass / deep-funnel / funnel-architect / copywriter): confirm the retro → `_marketing-decisions/` extraction wasn't lossy. *(Continuation of the prior triage agent isn't possible — no resume capability — so this is either an inline pass or one fresh sonnet.)*
