---
name: prose-builder
description: >-
  Use when writing, reviewing, or hardening a skill whose OUTPUT IS PROSE — copy,
  hooks, headlines, narrative, voice rewrites, persuasive or creative text that is
  judged by feel, not by shape. The subjective-side sibling of skill-builder.
  Triggers: building a copywriting / hook / story / voice skill; a generative
  prompt that produces competent-but-generic "AI voice"; deciding how to specify a
  target voice; setting up the checks for a prose skill; separating the WRITER from
  the SCORER. Use this instead of skill-builder whenever the thing produced is FELT
  rather than a label a checker could mark wrong by its shape. For a JUDGED,
  STRUCTURED output (a category, an extracted value, a risk level, a status — markable
  wrong by shape), use skill-builder. Most real skills carry BOTH; split them.
---

# Prose Builder — make one agent's PROSE good without gating taste

**Inputs:** the prose skill to build/harden, plus a handful of real winning examples of the target output.
**Output:** that skill, rewritten to lead with specimens, steer (not cage) the generation, and push every check into a SEPARATE scorer — mechanical parts to a script, felt parts to a rubric+specimen judge.
**Consumed by:** the agent that writes the prose, and a separate scorer (often a skill-builder-hardened evaluator) that judges it.

## When this applies (and when it does NOT)
Applies when the output is FELT — voice, pull, freshness, "earns the next line," emotional resonance. You cannot gate taste; you SHOW it and JUDGE it separately.
If the output is a JUDGED, STRUCTURED field a checker could mark wrong by its SHAPE (a label, an extracted value, a score band), that half belongs to `skill-builder`. Most real skills have BOTH halves — split them (see below), don't fuse them.

## Core principle
Specify the target by SPECIMEN, not by definition. Showing 3–5 real winning examples steers a model harder than any stack of adjectives or rules — and heavy positive+negative constraint on a GENERATIVE prompt pushes output toward the bland, high-likelihood mean, the opposite of what copy and hooks need.
> A definition tells the model what to claim it did. A specimen shows it what to do. Lead with specimens; keep the rules few and the generation lightly steered.

## One job per prompt: split the WRITER from the SCORER
A prompt that both WRITES prose and SCORES it is two jobs — and models are self-preferring graders (they rate their own output higher). Keep generation in the writer; push judgment into a SEPARATE pass. The mechanical part of that pass is a script (or a `skill-builder`-hardened check); the felt part is a rubric judge run PAIRWISE against a known-good specimen, on a different model, with order randomized. Never let the writer pass its own gate — it optimizes toward "looks like it has an open loop," not "stops the scroll."

## Procedure — building/hardening the prose skill
1. **Lead with specimens.** Put 3–5 curated winning examples of the target output up top, each annotated with WHY it works. Preserve the real examples from the source — do NOT abstract them up into ordered-slot templates; that discards the high-value thing (the example) and keeps the low-value thing (the slot description).
2. **State craft targets positively, as steering not law** — e.g. momentum (every line earns the next), specificity over superlative, enter the desire the reader already has, clarity over cleverness. A short list the model can hold, not an exhaustive rulebook.
3. **Keep named patterns OPTIONAL.** Offer formulas as patterns to reach for, never as required ordered slots — forced slots produce compliant, same-y output, which is the failure mode for anything whose whole job is to stand out.
4. **Tier the checks** (this is where `skill-builder` plugs in for the mechanical tier):
   - **Tier 1 — MECHANICAL → script-gate, hard pass/fail:** length / word budget, banned-phrase / regex, required elements present (CTA, link), literal repetition, reading-grade BAND (advisory below ~100 words — i.e. most hooks/headlines), register / verbatim-in-corpus.
   - **Tier 1.5 — HEURISTIC → warn / soft-cap, never hard-fail:** passive-voice count, adverb / filler density.
   - **Tier 2 — FELT → rubric + pairwise-against-specimen judge:** voice, pull, freshness, resonance. Separate model; randomize order; penalize verbosity explicitly; treat any single score as noisy (≈58% human-agreement ceiling — good for triage, not certification).
5. **Negatives: ≤5, and put them in the CHECKER, not the writer.** A prose ban inside the generative instruction tends to summon the thing it bans (ironic rebound). "No rhetorical-question spine," "no em-dash pile-up," "no it's-not-X-it's-Y" belong as post-hoc regex / judge checks, each paired with a positive target.
6. **Sample, don't max-likelihood.** Steer decoding toward top-p ≈0.9–0.95 or min-p; temperature is not a creativity dial. Feed concrete source material to fight homogenization.

## Membership test — "is this prose skill well-built?" (apply to your OWN output)
A test that can FAIL — any NO means not done; name the gap:
- Does the prompt lead with ≥3 annotated real specimens rather than adjective lists?
- Are named patterns OPTIONAL, not required ordered slots?
- Is the WRITER separated from the SCORER, with no self-grading?
- Are checks tiered — mechanical to a script, felt to a rubric+specimen pairwise judge on a separate model?
- Are negatives ≤5 and located in the checker, not the generator?
- Is the generative step lightly steered (specimens + a few positive targets) rather than caged in heavy positive+negative constraint?
- Is it LEAN — definitions and examples in references, SKILL.md tight — not an inflated rulebook?

See `research--copy-prose-and-llm-elicitation.md` for the craft + elicitation evidence behind every rule here (specimens beat adjectives; constraint causes mode-collapse toward the mean; negative constraints rebound; the mechanical-vs-felt split). For the structured-output sibling, see `skill-builder`.
