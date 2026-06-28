---
name: skill-builder
description: >-
  Use when writing, reviewing, or hardening a SINGLE agent prompt or skill so its
  output is mechanically verifiable — so each field can be checked as "is this
  actually the thing I asked for?" rather than trusted on sight. Triggers: designing
  a prompt's output contract; adding a completeness or validation block; fixing a
  prompt where the agent emits plausible-but-wrong values (a label that doesn't fit
  the category, a filled-in field that's hollow); deciding what to specify positively
  vs. when to add a "do not" rule; making one prompt do exactly one job. Covers
  positive specification, per-field membership tests, per-field evidence/provenance,
  splitting "complete" into presence vs. soundness, and one-job-per-prompt. For
  pipeline / multi-agent architecture (contracts between steps, lanes, escalation,
  orchestration of many agents), use system-designer instead.
---

# Skill Builder — make one agent's output mechanically verifiable

## When this applies (and when it does NOT)
This skill hardens a JUDGED, STRUCTURED output — a field the agent decides and that something downstream labels, validates, or consumes (a category label, an extracted value, a risk level, a status flag). That is the only case where membership tests, evidence quotes, and PRESENCE/SOUNDNESS earn their cost.
If the output is SUBJECTIVE or unstructured — prose voice, design taste, a creative rewrite, a summary with no contract — there is no field to gate, and this procedure does not apply. Do not bolt membership tests onto taste. Skip this skill and write the draft normally.
> Test before applying: "Could a separate checker mark this field wrong by its SHAPE, without taste?" If no, this skill is the wrong tool.

## Where this sits in the lifecycle
This is the DRAFTING-and-HARDENING step inside `skill-creator`'s loop, not a replacement for it. Run `skill-creator` for the lifecycle (intent → test prompts → eval loop → review → package). When `skill-creator` reaches "Write the SKILL.md" AND the skill's output is a judged contract, run this procedure on that draft so the first eval run starts from an already-hardened prompt. `skill-creator` then measures whether the hardening actually improved outputs.

**Inputs:** the prompt/skill to harden, and which of its output fields are JUDGED (decided by the agent) vs. COPIED (lifted verbatim from input).
**Output:** that prompt, rewritten so every judged field has a positive target + a membership test, a per-field `source`/`evidence`, and a two-part completeness block (PRESENCE + SOUNDNESS); optionally a validator script.
**Consumed by:** the agent that runs the hardened prompt, and any orchestrator / `system-designer` pipeline that embeds it. (For contracts BETWEEN prompts/steps, that's `system-designer`.)

## Core principle
Wherever a prompt asks the agent to JUDGE or LABEL, don't give it a name + a definition and trust recognition. Give it a positively-specified target — a fillable template plus a membership test that can return FALSE — and make it emit the proof the value passed.
> "Complete" means PASSED ITS GATES, never "is non-empty." Most bad outputs aren't missing — they're present but wrong: a label stamped because the slot existed.

## One job per prompt (sectioning)
A prompt that both PRODUCES a value and VERIFIES it is two jobs in one agent — and models are unreliable self-graders. Keep judgment in the prompt; push verification into a SEPARATE pass: a script for anything mechanical, or a separate validator prompt — the `adversarial-reviewer` skill is that separate checker. A separate checker beats one agent doing both. When work fans into several distinct jobs, give each its OWN agent with explicit handoffs and let ONE orchestrator hold the birdseye; an agent gets more than one job only when its job IS to oversee the others. (This is the architectural reason for the "write a script, don't self-grade" rule below.)

## Procedure — run on every JUDGED field
(Copied fields don't need this; decided fields do.)

1. **Specify the target positively** — a fillable template or a closed list of allowed values; prefer template/enum over a paragraph of definition.
2. **Give it a membership test** — yes/no questions that can return FALSE, so a wrong value fails by shape.
3. **Demand the evidence** — each judged field carries a `source` and, where it should trace to input, an `evidence_quote` that is a verbatim substring of that input. No quote → no label.
4. **Build a two-part completeness block** — PRESENCE (the field exists) + SOUNDNESS (the field passed its test); not `emit_ready` until SOUNDNESS passes; on failure emit `BLOCKED:<field>`.
5. **Make examples obey their own gates** — every in-prompt example visibly passes its test, annotated with the gate it passes.
6. **Add a "do not" line only for a known attractor** — one short prohibition, at the END, only when the model has a strong pull the positive spec won't deflect. Otherwise, no negatives.

Also: make the authored prompt declare its OWN inputs, output, and consumers, and drop any emitted field no named consumer reads.

## Write a script for anything mechanical
If a check is mechanical — count items, confirm an id exists, confirm a quote is a real substring, confirm required fields are non-empty — write a SCRIPT; don't ask the model to self-check. Keep judgment in the prompt, verification in code. `reference.md` shows what a validator looks like.

## Run the hardening itself as a workflow (optional)
The full job is seven steps: **(0) mechanize the doc's instructions first — run `instruction-mechanizer` to de-vague the prose, so the output-spec work is not fighting ambiguous instructions** → triage judged-vs-copied fields → author each field's target+test → add provenance → build the completeness block → write the validator → verify (run `adversarial-reviewer` as the sectioned, separate checker, against the captured standard). For a prompt with many judged fields, run them as a workflow — parallel subagents author fields independently, a separate subagent verifies, and you orchestrate with the birdseye. For a small prompt, run them in sequence in one context: every extra handoff is a lossiness point, so split only when the jobs are independent and numerous. To wire several hardened prompts into a pipeline, switch to `system-designer`.

## Membership test — "is this prompt hardened?" (apply to your OWN output)
Not a checklist of parts; a test that can FAIL. The rewrite is hardened only if every line is YES — any NO means not hardened, name the gap:
- Does every judged field have (a) a positive target/template or enum, (b) a membership test, (c) a `source` field?
- Can each membership test return FALSE (a real gate, not "assert YES")?
- Does the completeness block separate PRESENCE from SOUNDNESS?
- Do all in-prompt examples pass their own gates?
- Is every mechanical check delegated to a script rather than self-graded?
- Are negatives held to the few attractors that need them — one line each, at the end?

See `reference.md` for the inlined mechanisms (membership template + verify-in-isolation, enum echo, the `{text,passed,evidence}` assertion shape, the rubric gate, provenance-in-field), a gated worked example, the positive-over-negative evidence, and sources. Everything needed to apply a rule is inline there; the sources list is provenance only.
