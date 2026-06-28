# Proposed Edit B for skill-creator (source-of-truth skill is read-only)

skill-creator is Anthropic's installed skill and cannot be edited in place. If you ever
fork/own a copy, insert the block below into its `## Creating a skill` → `### Write the
SKILL.md` section, immediately **before** `### Skill Writing Guide`.

---

### Harden judged outputs before the first eval (conditional)

Branch on the skill's output type before you run any test cases:

- If the skill produces a STRUCTURED / JUDGED output — a field the agent decides that gets labeled, validated, or consumed downstream (a category, an extracted value, a risk level, a status) — harden the draft with the `skill-builder` skill first. Give each judged field a positive target + a membership test that can return FALSE + a `source`/evidence, and a PRESENCE/SOUNDNESS completeness block. Walking into the eval loop with an already-hardened draft means the runs surface real behavioral problems instead of rediscovering hollow or mislabeled fields.
- If the skill's output is SUBJECTIVE or unstructured (writing voice, design, creative rewrite, open-ended summary), skip `skill-builder` — there is no field contract to gate, and forcing one wastes effort. Draft normally and rely on the human review loop.

This is a branch, not a mandate: structured-output skills take it, subjective ones skip it.
