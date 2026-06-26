# PMF — project instructions

## Agent design

- **One job per agent, split to the smallest part, and route each job to the right executor.** Deterministic jobs (fetch, clean, dedupe, count/score, store, validate) are scripts/hooks; only judgment jobs (query design, classify, extract, synthesize) are agents. An "agent that cleans data" is a category error.
- Example: "search" splits into query design (agent) + fetch (script); "analyze" splits into classify (agent) + score (script) + synthesize (agent). Cleaning and storing are scripts, never agents.

## Versioning

**no-overwrite-v1 convention** (D-07/D-08/D-09, adopted 2026-06-04):

- **Rule:** A committed run output (any file or directory under `runs/<space>/…`) or an emitted brick is never mutated in place on a re-run. A re-run writes a NEW versioned location (e.g. a `v2/` subdirectory or a `-v2` suffix); v1 stays intact for provenance and diffing.
- **Scope:** Governs committed run outputs + emitted bricks. Does NOT govern logs/scratch (gitignored) or in-flight uncommitted work.
- **Enforcement:** Convention only. A guard hook/script is explicitly DEFERRED — not built yet.

---

<!-- Appended by GSD /gsd-new-project 2026-06-26. Hand-written rules ABOVE this line are preserved; sections below carry GSD markers and are regenerated in-place by generate-claude-md. -->

<!-- GSD:project-start source:PROJECT.md -->
## Project

**PMF Marketing Pipeline**

A multi-step agentic marketing pipeline that turns a product *bet* into a written, audited sales funnel across eleven steps: **0 Bet → 1 Collect → 2 Funnel analysis → 3 Space map → 4 VOC market pass → 5 Market selection → 6 VOC deep pass → 7 Funnel architect → 8 Copywriter → 9 Asset classify → 10 Adversarial re-review** (canonical R1 order). The system separates **mechanism** (the deterministic *shell* — orchestrator, artifact store, per-step I/O contracts, validation, operator gates) from **content** (the marketing judgment inside each prompt and the field-level schemas at each seam). **This milestone builds the shell.**

**Core Value:** A runnable shell of Steps 0–10 that completes **end-to-end on stub prompts** — every declared artifact produced and consumed, deterministic routing, operator gates logged, unbroken receipts chain, **zero orphan outputs / dangling inputs** — so real prompts and field schemas become pure drop-in slots and the only thing not-yet-good is marketing judgment.

### Constraints

- **Precedence (rule #1):** `standards/` → build-base architecture (`PART0`/`PART3`/`PART1`) → built bet-compiler SKILL → as-ran repo (reference only). Where as-ran/old prompts disagree with the architecture, **the architecture wins.** (ONE-SHOT §3)
- **Wire at the artifact grain, not the prompt grain** — only inter-step artifact flow must be deterministic; step internals are black boxes. (ONE-SHOT §5.1)
- **Reuse engine bricks, don't rewrite** — assemble + order per the blueprint. (ONE-SHOT §5.4)
- **Scope guard** — target Steps 0–10 only; do not thread Phase B into the wiring now.
- **No-overwrite-v1 versioning** — committed run outputs / emitted bricks are never mutated in place on a re-run (project convention, `CLAUDE.md`).
- **Build strategy = shell-first** — wire now, drop prompts + field schemas in later.
<!-- GSD:project-end -->

<!-- GSD:stack-start source:STACK.md -->
## Technology Stack

Technology stack not yet documented. Will populate after codebase mapping or first phase.
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

| Skill | Description | Path |
|-------|-------------|------|
| adversarial-reviewer | >- Use to review/critique/audit an artifact (a prompt, skill, spec, or output) against a captured STANDARD and emit findings + a verdict. This is the concrete "verify / section-the-verifier" step that skill-builder and system-designer name. Triggers: "review / critique / audit this skill or prompt"; "did this revision actually fix the prior findings"; check an artifact for lossiness vs a source-of-truth, self-consistency, ambiguity, contradiction, bloat, composition, or IO clarity. Grades pointwise (this artifact vs. the standard), reference-grounded, and logs defects without fixing them (fixing is the builder's separate pass). | `.claude/skills/adversarial-reviewer/SKILL.md` |
| automate | >- Use when capturing a task that an agent figured out once into a durable design a FRESH session can re-run without re-discovering anything — and when executing one. Triggers: "turn this into a repeatable workflow / runbook / automation"; pre-writing the code + steps so next time it "just runs"; deciding which steps to freeze into code vs. leave the agent to figure out live; a hardened workflow that broke when the UI/API/data changed; "should I even automate this or just do it again by hand"; running a pre-written design safely with preflight checks and a fallback when a step fails. Covers the harden-or-not gate, the freeze/adapt/human-required label test, the declarative durable-design template with a membership test per field, preflight + golden-output + the 3-tier fallback ladder, Human Gates (planned pauses where AI is literally blocked — pings the human with exact instructions and opens the required interface), the amendment-agent protocol (self-improvement without human involvement), the blocker protocol (when a step returns blocked / forbidden / rate-limited / captcha'd / "not supported", exhaust workarounds W1–W4 — alternate endpoints like appending .json to a Reddit URL, then an investigation subagent, then real-input RPA — before ever calling it impossible), a PRESENCE/SOUNDNESS completeness block, and a validator. For designing the DAG + typed contracts of the frozen part, use system-designer; to harden one node-prompt, use skill-builder; to de-vague prose, use instruction-mechanizer; to ship-check the design, use adversarial-reviewer. | `.claude/skills/automate/SKILL.md` |
| instruction-mechanizer | >- Use to take any EXISTING markdown prompt / instruction / skill / spec and rewrite its vague, interpretive instructions into mechanical, checkable ones — so an agent follows calculated rules instead of "vibes." Triggers: "make this prompt less ambiguous / more mechanical / less interpretive"; "de-vague this doc"; "audit this prompt for instructions an agent would have to guess at"; an agent is making judgment calls by feel where you wanted a rule. It scans for vague language, decides what each fix needs, rewrites into a checkable form, flags what cannot be mechanized, and outputs the rewritten doc + a change report. This is the RETROFIT front-door for an existing doc; for specifying a NEW prompt's output contract use skill-builder (which invokes this as its first step), and for wiring several prompts into a pipeline use system-designer. | `.claude/skills/instruction-mechanizer/SKILL.md` |
| skill-builder | >- Use when writing, reviewing, or hardening a SINGLE agent prompt or skill so its output is mechanically verifiable — so each field can be checked as "is this actually the thing I asked for?" rather than trusted on sight. Triggers: designing a prompt's output contract; adding a completeness or validation block; fixing a prompt where the agent emits plausible-but-wrong values (a label that doesn't fit the category, a filled-in field that's hollow); deciding what to specify positively vs. when to add a "do not" rule; making one prompt do exactly one job. Covers positive specification, per-field membership tests, per-field evidence/provenance, splitting "complete" into presence vs. soundness, and one-job-per-prompt. For pipeline / multi-agent architecture (contracts between steps, lanes, escalation, orchestration of many agents), use system-designer instead. | `.claude/skills/skill-builder/SKILL.md` |
| skill-creator | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, edit, or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. | `.claude/skills/skill-creator/SKILL.md` |
| system-designer | >- Use when designing or fixing a multi-step / multi-agent pipeline — anything where more than one prompt, agent, or script hands work to the next. Triggers: defining the contract between two steps; deciding how to split work into agents; a field that sometimes can't be filled (need retry/escalation); a "is this relatively unique / how common is X" check before committing; making provenance survive across handoffs; keeping each step in its lane; making the pipeline run deterministically from one command; deciding when to spawn a subagent vs. keep work in one context. Covers IO contracts, lanes/sectioning, the Closer (escalation) pattern, the relative-evidence quick-pass, provenance across handoffs, and deterministic DAG orchestration. For hardening a SINGLE prompt's output, use skill-builder. | `.claude/skills/system-designer/SKILL.md` |
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->
