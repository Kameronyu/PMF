---
name: system-designer
description: >-
  Use when designing or fixing a multi-step / multi-agent pipeline — anything where
  more than one prompt, agent, or script hands work to the next. Triggers: defining
  the contract between two steps; deciding how to split work into agents; a field
  that sometimes can't be filled (need retry/escalation); a "is this relatively
  unique / how common is X" check before committing; making provenance survive across
  handoffs; keeping each step in its lane; making the pipeline run deterministically
  from one command; deciding when to spawn a subagent vs. keep work in one context.
  Covers IO contracts, lanes/sectioning, the Closer (escalation) pattern, the
  relative-evidence quick-pass, provenance across handoffs, and deterministic DAG
  orchestration. For hardening a SINGLE prompt's output, use skill-builder.

  This skill is itself run as a workflow of single-job steps (below) — practice it
  the way it tells you to build.
---

# System Designer — turn a goal into a deterministic DAG of single-job steps

**Inputs:** the pipeline's goal; the work it must do; the raw inputs available; the constraints (what must be deterministic, what must never be decided early).
**Output:** a DAG of single-job steps + their typed IO contracts, lanes, gates + escalation, provenance fields, and a deterministic run plan.
**Consumed by (which part goes where):** the DAG + edges → the orchestrator that runs them; each node's typed IO contract → `skill-builder`, which hardens that node-prompt; the gates + provenance fields + deterministic run-plan → the engineer wiring the pipeline.

## Core principle
A system is a DAG of single-job steps connected by **typed contracts**. Every handoff is a lossiness point, so the whole craft is: minimize handoffs, type the ones you keep, and let one step decide only what it owns. A step that holds two distinct jobs, or that decides something a later step should own, is the defect — not a style choice.

## Relationship to skill-builder
This skill designs the DAG, the contracts between nodes, the lanes, and the orchestration. `skill-builder` hardens each individual node-prompt *inside* the DAG (positive targets, membership tests, per-field evidence, presence/soundness). Design the system here; harden each node there.

## THE WORKFLOW (each step is one distinct job — run them in order; this skill is itself this workflow)
1. **Decompose into single-job steps.** One distinct job-TYPE per step. Split only where the type of work genuinely differs (gather ≠ classify ≠ verify ≠ synthesize). Do NOT over-shard: every split adds a handoff, and handoffs lose fidelity — so a coherent job stays one step.
2. **Define each handoff contract.** For every edge: the inputs the next step needs, its output schema, and WHICH consumer reads each field. A field no named consumer reads is dropped. (See `reference.md` → IO contract template.)
3. **Assign lanes (sectioning).** Each step decides only what it owns; the step that *produces* a value is not the step that *verifies* it — a separate checker beats one agent doing both. Give each step a one-line reject-list of decisions it must NOT make (a winner, a threshold, a downstream label) and, where possible, scope its tools.
4. **Insert gates + the Closer.** At each edge, a programmatic gate checks the output is real (not "looks done"). If a required field can't be filled, route to the **Closer** (escalation), don't hard-fail. (See `patterns.md` → Closer.)
5. **Wire provenance through.** Load-bearing values carry a typed `source` and any caveat as a typed field (not prose), so nothing arrives looking more certain than it left. (See `reference.md` → provenance.)
6. **Make orchestration deterministic.** Fixed DAG; idempotent steps; deterministic work (cleaning, counting, validating) lives in scripts BETWEEN the LLM calls; one command runs the whole thing. (See `reference.md` → determinism.)
7. **Section the verifier.** A separate review step — run the `adversarial-reviewer` skill against the captured standard — checks the assembled system against this workflow before it ships, and emits a typed `{sound: bool, failing_gaps: [...]}` (consumed by the engineer) by running the membership test below; `sound:false` blocks ship.

## When to spawn a subagent vs. keep it in one context
Spawn a subagent for a step when its job is a genuinely distinct type AND (it's independent/parallelizable, e.g. 3–5 search workers or N fields to harden) OR (it needs an isolated, minimal context). Keep it in one context when the handoff overhead would exceed the benefit (small, tightly-coupled work). The orchestrator holds the birdseye and sequences; it gets to hold "multiple jobs" only because overseeing IS its one job. Workers return a typed result and hand control back.

## Membership test — "is this system sound?" (apply to your OWN design; any NO = not sound, name the gap)
- Does every step do exactly one job-type (or is it the orchestrator)?
- Does every edge have a typed contract, and does every emitted field name a consumer?
- Is producing separated from verifying (sectioning)?
- Does every step have a reject-list of what it must not decide?
- Does every field that can fail have a gate + a Closer route (hard-halt or soft-log declared)?
- Do load-bearing values carry a typed `source`/caveat across each handoff?
- Is the run a fixed, idempotent DAG with deterministic work in scripts — runnable from one command?
- Is the decomposition bounded (no split that exists only to be reassembled)?

See `reference.md` for contracts, lanes, provenance, IO hygiene, and determinism (all inlined), and `patterns.md` for the Closer, the relative-evidence quick-pass, and the named loop patterns. Sources are provenance only — you never need to open a URL to apply this skill.
