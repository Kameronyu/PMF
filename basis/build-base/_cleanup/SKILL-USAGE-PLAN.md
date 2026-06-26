---
status: orchestration-scaffold
role: How the orchestrator will use the two operator-provided skills across Phases 1–7
read-with: BUILD-BASE-WORKFLOW.md
note: This is cleanup scaffolding, not a base design doc. Phase 1 may classify/retire it.
---

# Skill-Usage Orchestration Plan — build-base cleanup

How I will use the two operator-provided skills to drive Phases 1→7 of `BUILD-BASE-WORKFLOW.md`.

## The two skills (one line each)

- **skill-builder** — hardens **one** agent prompt so its output is *mechanically verifiable*: positive target (template/enum) + a membership test that can return FALSE + per-field `source`/`evidence_quote` + a two-part completeness block (PRESENCE vs. SOUNDNESS) + one-job-per-prompt (push verification to a script or a separate checker).
- **system-designer** — designs a multi-step job as a **deterministic DAG of single-job steps** wired by **typed handoff contracts**: lanes/sectioning (producer ≠ verifier), gates + the Closer (escalation), provenance across handoffs, run-from-one-command determinism. *(The runbook calls this "system-builder"; the installed skill is `system-designer` — same thing.)*

## The core idea: these skills are dual-use here

They are not just Phase-4/6 tools. They apply two ways at once:

1. **As the method for running the cleanup itself.** The 7-phase cleanup *is* a multi-agent pipeline, so **system-designer governs how I orchestrate it** and **skill-builder governs how I write each phase agent's prompt.** (system-designer even says: "practice it the way it tells you to build.")
2. **As the lens for what "clean" means.** The docs being cleaned are *themselves* pipeline-design docs (PART0–4) and step-skills (e.g. `bet-compiler-SKILL.md`). So "engineered for AI pickup" (Phase 4) and "per-step brief" (Phase 6) mean **shaped the way a future skill-builder / system-designer build session will read them.**

## How I drive the whole job (system-designer applied to the 7 phases)

- **Fixed DAG, single-job phases.** Each phase = one job-type; I do not let a phase both produce and self-certify.
- **A typed spine carries state between phases** — `RECON-PLAN.md` (Phase 1→2), `MOVES-LOG.md` (Phase 3→4), `INDEX.md` + `STEP-NN` briefs (Phase 5/6→7). Each is the contract the next phase consumes; I define its schema before spawning.
- **Every phase agent is spawned cold-clean** — minimal context package, **no prior conclusions** (esp. Phase 1). This is system-designer's *minimal-clean-input* + *lanes*, and skill-builder's *verify-in-isolation*, used structurally to keep each agent's judgment its own.
- **Each phase prompt is hardened with skill-builder before I spawn it** — the agent's deliverable gets a positive target, a membership test, required evidence, and a PRESENCE/SOUNDNESS completeness block, so I can check "is this actually the thing I asked for?" not trust it on sight.
- **★ operator gates are the gate pattern**; **Phase 7 is system-designer's "section the verifier"** — the sectioned final check that the base is self-sufficient.
- **Determinism:** mechanical work (moves, link-repair, cross-ref/anchor checks, manifest counts) runs in **scripts between** the LLM phases, not as eyeballed model output.

## Per-phase skill usage

### Phase 1 — Inventory + RECON-PLAN (Agent 1, Reviewer)
- **skill-builder → harden Agent 1's own output.** The manifest is a judged artifact. `proposed_status` and `freshness` become **enums with membership tests that can return FALSE**; every status carries an **`evidence_quote`** (a verbatim substring from the doc) — a `superseded` row must quote what supersedes it; a `delete-candidate` row must show no forward-building value survives after sauce extraction. Completeness = PRESENCE (every base file has exactly one row) + SOUNDNESS (every status passed its test; every `sauce_that_belongs_elsewhere` cites a verbatim span + a target home).
- **system-designer → define `RECON-PLAN.md` as the typed Phase 1→2 contract** now, and keep Agent 1 in a pure producer lane: briefing context only (Goal + standing principles + `SPEC-marketing-soundness.md`), **never my read** — so its determination is genuinely independent.

### Phase 2 — Reconcile content (Agent 2, Reconciler)
- **system-designer → consume the ratified `RECON-PLAN.md` (typed contract) in a separate lane** from Agent 1 (planner ≠ executor). **Reject-list:** must not invent new statuses, must not delete anything not ratified, must extract sauce *before* any delete. **Closer/quarantine fallback:** any reconciliation in doubt routes to quarantine, never hard-delete.
- **skill-builder → harden Agent 2's completeness:** SOUNDNESS = every ratified action done; every deletion logged with its extracted sauce relocated **and attributed**; no delete without prior extraction.

### Phase 3 — Organize folders + rename (Agent 3, Organizer)
- **system-designer → `MOVES-LOG.md` (old→new) is the typed Phase 3→4 contract** for link repair; the actual moves run as a **deterministic script** that emits the log. Two-step gate: map first, then move.
- **skill-builder → the proposed folder-map is a judged output:** membership test = every survivor maps to exactly one folder under the grouping rules (each multi-file skill → its own folder; architecture → `/architecture`; Standard+Register+Directive → `/standards`; reference/quarantined → `/reference`). A file that fits no rule **fails the test → flagged, not guessed.**

### Phase 4 — Engineer docs for AI pickup (Agent 4 + 4b) ← skills named in runbook
- **skill-builder → Agent 4 (Doc-Cleanup), per file.** Front-matter `{status, role, read-with, supersedes}` is skill-builder's *declare-inputs/output/consumers* + provenance at doc scope; the one-line "what this is / who reads it" is the *single-purpose + who-reads* discipline; "no buried supersession" is the SOUNDNESS rule. Target: each doc exposes a **minimum-feed slice** a future skill-builder session can grab.
- **system-designer → Agent 4b (System-Cleanup), across files = step 7 "section the verifier."** Runs the *system* membership test over the doc set: cross-refs resolve (script-checked anchors), PART0 flow matches reconciled PART3, no surviving contradiction. Producer (4) ≠ verifier (4b) = sectioning.
- **Both real skill prompts go in the context package** so cleanup matches how the builders will actually read (see Dep-1 below).

### Phase 5 — Index (Agent 5)
- **system-designer → `INDEX.md` is the pipeline's single entry point / "one command":** routing-by-session-type = the DAG's edges made navigable; the folder-tree map = the human-navigable view.
- **skill-builder → manifest-table soundness:** every doc present, status matching the Phase 1 ratified call, final folder from `MOVES-LOG.md`.

### Phase 6 — Per-step briefs (Agent 6, Brief-Builder) ← system-designer named in runbook
- **system-designer → THE lens.** Each `STEP-NN` brief is one node's **IO contract**: the minimal clean slice that step's build session needs, **by pointer not copy** (*agent-as-a-function / minimal-clean-input*). Review **one** sample brief first = evaluator-optimizer gate before fan-out.
- **skill-builder → harden Agent 6:** each brief's pointers must **resolve to a real anchor in a real file** (mechanical → script-checked); each step's soundness duties trace to `SPEC §6.0` with a span.

### Phase 7 — Cold-read validation (Agent 7, Validator)
- **system-designer → the sectioned final verifier.** Minimal context (`INDEX.md` + one `STEP-NN` only) tests whether the typed contract is self-sufficient with **zero operator context**. Emits typed `{could_proceed, missing[], ambiguous[]}` → evaluator-optimizer fix loop on whatever failed.
- **skill-builder → the gap report is a judged output** with its own PRESENCE/SOUNDNESS.

## Dep-1 update (changes the runbook's assumption)

The runbook's open decision Dep-1 assumed "builder skills not built yet." **They now exist** at `pmf3/skills/skill-builder/` and `pmf3/skills/system-designer/`. So Phase 4 and Phase 6 get the **real skill prompts** in their context packages — not just `BUILDER-DIRECTIVE.md` — and no later re-tune is needed. Recommendation: proceed (option a), upgraded by feeding the real prompts in.

## Before I spawn Phase 1 — ratification gate (★)

1. **Scope boundary — RESOLVED (operator, 2026-06-24).** Cleanup operates on `build-base/` **only**. The 19 parent-folder design docs are **external rebuild inputs** (future per-step sessions read them as "what ran" to rebuild step skills) — catalogued in `EXTERNAL-INPUTS-MAP.md`, **not** reorganized here, and **withheld from Phase 1** so the reviewer stays independent. The 61 persona KB docs are **untouched**.
2. **This plan** — confirm the skill-usage mapping above, or adjust.

I will not spawn any subagent, move, rename, or delete anything until you ratify. I have deliberately **not** formed any view on which base docs are stale/keep/cut — that determination is Phase 1's to make cleanly.
