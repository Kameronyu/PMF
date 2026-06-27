# HANDOFF — PMF Shell Build (autonomous) — branch `pmf-shell-build`

> Read this first on resume. Everything needed to continue the autonomous 6-phase build without re-discovery. eink-phase0-run is untouched. **DO NOT push.**

## Mission
Runnable SHELL of the PMF marketing pipeline (Steps 0–10) on STUB prompts, mechanism not content. 6 phases. Source of truth: `basis/build-base/ONE-SHOT-SHELL.md` (+ `SHELL-BUILD-SPEC.md`, `architecture/PART0`, `PART3 §8/§9/§5.2`). **Reuse root `/engine` bricks, never rewrite.** Quality profile = Opus agents.

## Conductor recipe (thin dispatcher — repeat per phase N = 3→6)
1. **Dispatch ONE isolated bg agent** (`general-purpose`, model opus, `run_in_background`). Its job, fully autonomous (no prompts, atomic commits, NO push): write a minimal infra `NN-CONTEXT.md` with a `<canonical_refs>` block pointing at that phase's basis sources → `Skill(gsd-plan-phase N)` → `Skill(gsd-execute-phase N --no-transition)` → `Skill(gsd-code-review N)` → if findings `Skill(gsd-code-review-fix N --auto)` → re-confirm all gates → report a structured build report. Include a Wave-0 acceptance harness `engine/contracts/<phase>-smoke.sh` (authored RED, code turns it GREEN).
2. **Re-arm a Monitor** on git commits; exit when `NN-VERIFICATION.md` appears + re-run gates.
3. On verification passed → **launch the xhigh adversarial verify Workflow** (below) with phase-specific targets.
4. **Extract synthesis with python** (raw_decode the object containing `synthesis` from the workflow `.output`; print per-verdict status/severity/false_green + synthesis.overall/blockers/concerns/summary). NEVER `Read` the raw `.output` (overflows context).
5. If synthesis has blockers / `false_green_risk` → dispatch a targeted fix agent, re-confirm. If clean → next phase. Every phase's xhigh verify has caught real bugs — keep running it.

## Reusable xhigh verify Workflow
`scriptPath`: `/home/kyu3/.claude/projects/-home-kyu3-PMF/fd245313-7588-4b80-917e-cc766741a9b4/workflows/scripts/phase-verify-xhigh-wf_196524c9-968.js`
Invoke: `Workflow({scriptPath, args:{phase, phaseDir, gateCmd, targets:[{id, prompt}]}})`. `args` parsed object-or-string (defensive). Spawns 5 adversarial verifiers at `effort:'xhigh'` + skeptical synthesis. Each target prompt = "adversarially verify X; try to BREAK it / find false-green; create only `runs/_vfy*` temp, clean up, touch no committed file." Synthesis marks `clean` only if no fail/high/critical/false_green.

## Gates (must stay green every phase)
- `bash engine/contracts/store-smoke.sh --space=smoke`  (Phase 1 STORE-01..05)
- `bash engine/contracts/controller-smoke.sh`           (Phase 2 CTRL-01..12)
- `bash engine/contracts/h6-all.sh`                     (engine regression, 14/14)

## Progress
- **PHASE 1 DONE ✓** Artifact Store. `engine/bricks/{store-scaffold,space-version,receipt-write}.js`, `engine/bricks/lib/fanout-path.js`, `engine/contracts/store-smoke.sh`. xhigh-verify caught 1 high (receipt silent-overwrite) + 2 true-green; all fixed.
- **PHASE 2 DONE ✓** Run-Controller. `engine/bricks/run-controller.js` (7-phase loop + loadManifest + parsePipeline + runAll), `pipeline.yaml` (repo ROOT, steps 0..10 R1), `bin/run` (CLI), `engine/contracts/controller-smoke.sh`, fixtures `runs/_fixture/pipeline/`. 12/12 verified; reuse-not-rewrite confirmed. xhigh-verify found 2 medium + 2 cheap — **ALL FIXED** (F1 wave-COUNT upper bound, agents=1e9 no longer hangs; F2 non-file `reads[]` → named preflight REFUSE; F3 controller-smoke strict ordering assert; F4 non-object manifest → named REFUSE; recorded in `02-XVERIFY-FIX.md`). Gates confirmed green: controller-smoke PASS, store-smoke + h6-all no-regression.
- **PHASES 3–6 PENDING.**

## Deferred items (HONOR in the owning phase — recorded, not dropped)
- **Phase 5 / VALID-02:** refuse empty/non-null-CONTENT load-bearing input (Phase-2 preflight only checks existence + is-file).
- **Phase 5 / VALID-05:** populate operator-gate decision in the receipt (currently `{step_gated, decision:null}`).
- **Phase 6 / SMOKE-05:** pipeline-completeness / canonical-order assertion (controller walks `pipeline.yaml` as-is; a DROPPED step exits 0 — the DoD smoke must catch it as a dangling input).

## Remaining phases (requirements)
- **Phase 3 — Step Manifests ×11:** MANIFEST-01..04 + WIRE-01 (Step0 emits `asset-classify/CLAIM-LIST.json`, Step9 reads it) + WIRE-02 (Step7 reads `bet-brief.md` AND `product-intake.md`). 11 declarative manifests; reads/writes per `PART3 §5.2`; `gate:true` on steps 0,1,5,7,8,10. Likely create real `engine/manifests/` set (doesn't exist yet — controller currently runs only the fixtures).
- **Phase 4 — Prompt Stubs ×11 + mock emits:** STUB-01..04 + WIRE-03 (Step2 raw per-funnel angle/claim/transformation; Step3 canonicalizes). Envelope template = `basis/build-base/skills/bet-compiler/SKILL.md`. STUB mode emits a contract-shaped artifact.
- **Phase 5 — Validators/Gates/Receipts:** VALID-01..05 + the 2 deferred Phase-5 items above.
- **Phase 6 — Smoke Run & DoD:** SMOKE-01..05. `run all --space=smoke` clean end-to-end; zero orphan/dangling; + deferred SMOKE-05. Then milestone lifecycle: `gsd-audit-milestone` → `gsd-complete-milestone`.

## Conventions
no-overwrite-v1 (receipts write-once; whole-space `-vN`). Build agents commit atomically (per build mandate) but DON'T push. Wave-0 RED-then-green harness. Engine bricks invoked as subprocesses, not re-implemented.

## Open non-build item
`.claude/settings.local.json` permissions allowlist NOT yet written (for hands-off overnight; connection died before it was created). If wanted: read existing → merge → allow `Bash, Task, Monitor, Workflow, Write, Edit, Skill, Read, TodoWrite`. It's gitignored.

## To resume
Phases 1 & 2 are DONE (gates green). Read this file → dispatch **Phase 3 (Step Manifests ×11)** per the conductor recipe — next action = the bg build agent for Phase 3. Memory file `project_pmf_shell_milestone.md` also has the high-level state.
