# Phase 2: Run-Controller & Pipeline Spine - Context

**Gathered:** 2026-06-27
**Status:** Ready for planning
**Mode:** Auto-generated (INFRASTRUCTURE phase — discuss skipped; Claude's discretion on implementation, bound to the authoritative sources below)

<domain>
## Phase Boundary

A single command — `run <step> --space=<s>` (one step) and `run all --space=<s>` (walk the pipeline) — drives the **PART3 §8 SEVEN-PHASE loop** (Preflight → Plan-print → Context-assembly → Spawn → Validate → Store+receipt → Operator-gate) over `pipeline.yaml` in **canonical R1 order (steps 0..10)**, plus a **manifest loader** that reads per-step manifests to sequence/route/validate. The controller is **ASSEMBLED from existing engine bricks** (`route.js`, `hooks/`, Phase-1 store bricks) per `FIRING-MANIFEST.md` — **NOT rewritten**. This is deterministic plumbing (mechanism), not marketing content; every step internal is a black box (wire at the artifact grain).

**In scope (CTRL-01..12):** the run-controller binary/script, `pipeline.yaml` (R1 step-id list), the manifest loader, a fixture/example manifest set + acceptance harness proving the 7-phase loop runs.
**Out of scope (Phase 3+):** the 11 REAL step manifests, the 11 prompt stubs + mock emits, field-level seam schemas, real validators. Phase 2 must load **whatever manifests exist** and prove the loop on a **minimal fixture manifest** (see Manifest-availability decision below).

</domain>

<canonical_refs>
## MUST-READ authoritative sources (precedence order; architecture wins on conflict)

**THE verbatim spec — read first:**
- `basis/build-base/architecture/PART3--architecture-design.md`
  - **§8 (lines 445–457)** — the run-controller / 7-phase loop, written out VERBATIM. This is THE spec the controller implements. The 7 phases (exact wording):
    1. **Preflight** (script) — input contracts checked (P3): schema, non-null load-bearing fields, version stamps; missing → **named refusal, never improvisation**.
    2. **Plan print** (script) — the step's DAG (every script command + agent spawn) declared **before anything runs**; deviation visible by diffing receipts vs plan.
    3. **Context assembly** (script per agent) — digest + corpus bytes embedded; the agent **never Reads shared state** (there is no file to Read).
    4. **Spawn** (agent) — waves of **≤5** with incremental writes.
    5. **Validate** (script, blocking, orchestrator-run — P8) — per-stage validator gates the store; reject → **bounded re-spawn (≤2)** → escalate to operator.
    6. **Store + receipt** (script) — **no-overwrite versioning**; receipt = inputs hash, digest version, validator verdicts, run-ledger entry.
    7. **Operator gates** (P9) — runner blocks on a **sign-off artifact**; "deferred" is a **logged state, not a silent skip**.
  - **§9 (line 461–463)** — contract-spine / seam list (the inter-step artifacts the manifests will declare; Phase-3 detail, read for grain).
  - **§5.2 (line ~277)** — file consumption matrix (who reads what — the wiring discipline the loader sequences by).
  - **§1.5 / §1.6 (lines 61–128)** — **canonical R1 step order** for `pipeline.yaml`. The verbatim R1 map (lines 70–101): STEP 0 Bet Compiler → 1 Collect → 2 Funnel Analysis → 3 Space Map → 4 VOC Market Pass → 5 Market Selection (NTP pick) → 6 VOC Deep Pass + Awareness Reconciler → 7 Funnel Architect + Auditor → 8 Copywriter ⇄ Chief → 9 Asset Classify → 10 Modded Adversarial Re-review.
  - **NB: §4.x is SUPERSEDED by R1** (§1.5 line 67: "supersedes the §4.1 map through the NTP pick"). Use §1.5/§1.6 for order, not §4.1.

**Build procedure + manifest-as-data:**
- `basis/build-base/SHELL-BUILD-SPEC.md`
  - **§3** — run-controller is "the heart"; restates the 7-phase loop (line 47). "Reuse the bricks — don't rewrite the glue" (line 45).
  - **§5** — the **step manifest as DATA**: `id / reads / writes / scripts{pre,post} / prompt / agents / validator / gate`. `pipeline.yaml` just lists step ids in R1 order; `run all` walks it; reordering = edit the list.
  - **§8** — the acceptance test idiom: STUB-mode mock emits; `run all --space=smoke` completes e2e (every preflight green, validators green on declared top-level shape, gates block-and-log auto-approve-in-smoke, unbroken `_receipts/` chain, zero orphan outputs / dangling inputs).
  - **§9** — shell build order: step 2 = "build the run-controller + `pipeline.yaml` step list + the manifest loader" (THIS phase). Step 3 (author 11 manifests) + step 4 (11 prompt stubs) are Phase 3+.
- `basis/build-base/architecture/PART0--pipeline-flow.md` — end-to-end flow/order (corroborates R1).

**Reuse — assemble, don't rewrite:**
- `basis/build-base/ONE-SHOT-SHELL.md` — **§5.2** honor the architecture's orchestration design; **§5.4** reuse engine bricks (assemble + order per blueprint).
- `engine/FIRING-MANIFEST.md` — how validators / `route.js` / DR-injectors register + fire. **CRITICAL (§4): hooks do NOT fire in subagents** — the controller's Validate phase must invoke the validator **explicitly as an orchestrator step**, NOT rely on the PostToolUse hook. `route.js` (basename→validator dispatch) is reusable as the explicit dispatcher.
- `engine/contracts/REGISTRY.md` + `engine/contracts/REUSE-INDEX.md` — the brick index; firing hooks (`route.js`, `validate-*.js`, `inject-*-dr.js`) are §1 reusable. Do NOT rewrite glue.
- `engine/DEPENDENCIES.md` — runtimes: **Node.js ≥20 (20.20.0 verified)**, Python 3.12. Controller should be Node (stdlib only — match the Phase-1 bricks; no new third-party dep).

**Phase 1 deliverables to BUILD ON (assemble these into the loop):**
- `engine/bricks/store-scaffold.js` — STORE-01/05: scaffolds `runs/<space>/` slot tree (idempotent, no-overwrite). Controller's setup / store phase relies on the scaffolded slots existing.
- `engine/bricks/space-version.js` — STORE-02: READ-ONLY whole-space next-version resolver (prints `<base>` / `<base>-vN`). The controller's no-overwrite decision uses this to NAME a bumped space.
- `engine/bricks/receipt-write.js` — STORE-03: per-spawn receipt writer (sha256 inputs_hash, **WRITE-ONCE / refuses overwrite**). The controller's **Store+receipt phase (CTRL-08) calls this brick** — honor its write-once/no-overwrite behavior (a colliding spawn-id is a surfaced bug, never a silent overwrite). Receipt shape: `{spawn_id, step, space, inputs_hash, inputs[], outputs[], validator_verdicts[], gate, ts}`.
- `engine/bricks/lib/fanout-path.js` — STORE-04: `sanitizePathSegment` (path-traversal-safe `[a-z0-9._-]`) + `buildFanoutName`. Reuse `sanitizePathSegment` for `--space` / `--step` sanitization (every Phase-1 brick imports it — the controller must too, do not re-paste).

**Phase / requirement docs:**
- `.planning/REQUIREMENTS.md` — **CTRL-01..12 exact text** (lines 22–33). Every id must be covered by the plan.
- `.planning/ROADMAP.md` — Phase 2 line: "Assemble the PART3 §8 7-phase loop, `pipeline.yaml` (R1 order), and the manifest loader from existing engine bricks."
- `.planning/PROJECT.md` — constraints (artifact-grain wiring, reuse-don't-rewrite, no-overwrite-v1, scope-guard Steps 0–10, shell-first).

</canonical_refs>

<decisions>
## Implementation Decisions

### Claude's Discretion (infrastructure phase)
All implementation choices are at Claude's discretion, **bound to the authoritative sources above**. The design is fixed by PART3 §8 + SHELL-BUILD-SPEC §3/§5/§9; planning decides the cleanest assembly. Defaults this phase locks in:

- **Language/runtime:** Node.js (stdlib only — `fs`/`path`/`child_process`/`crypto`), matching the Phase-1 bricks and `engine/package.json` (no new third-party dep). The controller is `engine/bricks/run-controller.js` (or similar) wired to a thin `run` entrypoint.
- **`pipeline.yaml`:** a flat ordered list of the 11 R1 step ids (0..10). Parse with a minimal stdlib YAML reader (the file is a simple `steps:` list — avoid pulling in a YAML lib; a small hand-parser or a `.json`-backed reader is acceptable if it keeps zero-dep). Reordering steps = editing this list only (CTRL-10).
- **Manifest loader (CTRL-11):** reads per-step manifest files (the §5 shape) to sequence/route/validate. Loads **whatever manifests exist** — the 11 real manifests are Phase 3.
- **Validate phase (CTRL-07):** invokes the validator **explicitly** (FIRING-MANIFEST §4 — hooks don't fire in subagents). Reuse `route.js` as the basename→validator dispatcher where a manifest names no explicit validator; bounded re-spawn ≤2 then escalate.
- **Store+receipt phase (CTRL-08):** calls `receipt-write.js` (honor write-once) + uses `space-version.js` for the no-overwrite naming decision.
- **Operator gate (CTRL-09):** blocks on a sign-off artifact; **auto-approve in smoke mode** (a `--smoke` / `--auto-approve` flag), and the gate decision is **logged into the receipt** (`gate` field), never silent.

### Manifest-availability decision (the key Phase-2/Phase-3 boundary call)
Phase 2 builds the CONTROLLER + `pipeline.yaml` + manifest LOADER; the **11 real step manifests are Phase 3**. So the controller must load whatever manifests exist, and the **Phase-2 acceptance test exercises the loop with a minimal fixture manifest set (or a dry-run mode), NOT the real 11.** Planning picks the cleanest of:
- **(A — recommended) A tiny fixture manifest set** under e.g. `engine/_fixture/pipeline/` (1–3 minimal manifests with a fixture `pipeline.yaml`) whose stub steps mock-emit a valid-shaped artifact, so the harness drives the **full 7-phase loop end-to-end** on a fixture exactly as `run all --space=smoke` will later drive the real 11. This proves each phase fires + the chain is unbroken without depending on Phase-3 content. **Preferred** — mirrors SHELL-BUILD-SPEC §8 and the engine `_fixture/` precedent.
- **(B) A `--dry-run` mode** that prints the plan (phases 1–2) and skips Spawn — weaker (doesn't exercise Spawn/Validate/Store live). Use only as a supplement, not the primary proof.
Decide and STATE the chosen approach in the plan. The real `pipeline.yaml` still lists 0..10 in R1 order (CTRL-10/CTRL-02); the fixture has its own small list for the harness.

### Reuse (do NOT rewrite — CTRL-12)
- `engine/hooks/route.js` — basename→validator dispatch (explicit invocation, not as a hook).
- `engine/hooks/validate-*.js` — per-agent validators (Phase 3 manifests bind them).
- `engine/bricks/store-scaffold.js` / `space-version.js` / `receipt-write.js` / `lib/fanout-path.js` — Phase-1 store layer.
- `engine/bricks/lib/fanout-path.js#sanitizePathSegment` — `--space`/`--step` sanitization.
The controller ORDERS these per the §8 blueprint; it does not re-implement hashing, sanitization, scaffolding, or versioning.

</decisions>

<code_context>
## Existing Code Insights

- **Brick CLI idiom** (mirror it): `--flag=value` parse via `Object.fromEntries(... .split('='))`; `--space` REQUIRED → `sanitizePathSegment` → `path.join(cwd,'runs',SPACE)`; `--help`; one-line console summary; `process.exit(0/1)`. See `store-scaffold.js`.
- **Smoke-harness idiom** (mirror for the acceptance harness): `engine/contracts/store-smoke.sh` and `engine/contracts/h6-*.sh` — `set -u`, `cd "$(dirname "$0")/../.."` to repo root, `ok()/bad()` helpers, inline `node -e` JSON asserts, named-exit, final `ALL ASSERTS PASS ✓` / non-zero. New harness e.g. `engine/contracts/controller-smoke.sh`.
- **Receipt-write is WRITE-ONCE**: a colliding `spawn_id` → exit 1 (refuses overwrite, no-overwrite-v1). The controller must use a **unique spawn-id per spawn** (e.g. `<step>-<wave>-<n>` or a timestamp/uuid) so re-spawns within a step don't collide.
- **Gitignore reality (IMPORTANT for the harness):** `runs/` is NOT wholesale-gitignored — only `_index.json`, `_*-log.txt`, `_*.agent.json`, `_caption_*` and a few creds files are. So a `runs/smoke/` left by the harness would get committed. **Mitigation:** the harness should run against a temp `runs/_*`-prefixed space (underscore-prefixed dirs read as scratch) OR `rm -rf` the test space at start/end (store-smoke.sh `rm -rf "runs/${SPACE}"` precedent). The build task MUST clean up temp `runs/_*` spaces before finishing.
- **`_receipts/<spawn_id>.json` is COMMITTED provenance** (not under any gitignore pattern) — intentional. The fixture harness's receipts live under its temp space and are removed on cleanup.
- **No `pipeline.yaml` and no controller exist yet** — greenfield for this phase. No prior Phase-2 partial artifacts to resume (the dir was empty).

</code_context>

<specifics>
## Specific Ideas

No specific requirements beyond the authoritative sources — infrastructure phase. The 7-phase loop, R1 order, manifest shape, and reuse set are all fixed above. Planning produces: the controller, `pipeline.yaml`, the loader, a fixture manifest set, and `controller-smoke.sh`. Every CTRL-01..12 id must map to a concrete deliverable + a harness assert.

</specifics>

<deferred>
## Deferred Ideas

- The **11 real step manifests** + 11 prompt stubs + mock emits → Phase 3.
- **Field-level seam schemas** + field-continuity validators → later (Job 5 / a later milestone); Phase 2 validators check presence/top-level shape only.
- **Real operator sign-off UX** — Phase 2 logs the gate decision + auto-approves in smoke; a human sign-off flow is later.
- The **no-overwrite guard hook** — explicitly DEFERRED project-wide (CLAUDE.md Versioning); convention + the write-once `receipt-write.js` carry it this phase.
- **Cheap-model cleanliness QA** (PART3 §8 line 457, optional ◆) — not built this phase.

</deferred>
