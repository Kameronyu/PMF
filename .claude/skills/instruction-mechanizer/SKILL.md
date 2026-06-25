---
name: instruction-mechanizer
description: >-
  Use to take any EXISTING markdown prompt / instruction / skill / spec and rewrite
  its vague, interpretive instructions into mechanical, checkable ones — so an agent
  follows calculated rules instead of "vibes." Triggers: "make this prompt less
  ambiguous / more mechanical / less interpretive"; "de-vague this doc"; "audit this
  prompt for instructions an agent would have to guess at"; an agent is making
  judgment calls by feel where you wanted a rule. It scans for vague language, decides
  what each fix needs, rewrites into a checkable form, flags what cannot be
  mechanized, and outputs the rewritten doc + a change report. This is the RETROFIT
  front-door for an existing doc; for specifying a NEW prompt's output contract use
  skill-builder (which invokes this as its first step), and for wiring several prompts
  into a pipeline use system-designer.
---

# Instruction Mechanizer — turn vague instructions into checkable ones

**Inputs:** any markdown doc (a prompt / skill / spec); optionally, the doc's purpose and what is going wrong with it.
**Output:** the rewritten markdown (instructions mechanized) + a CHANGE REPORT (per change: span, smell, fix, why) + a FLAGGED list of spans that need human judgment, each with a disposition.
**Consumed by:** the doc's author; or `skill-builder` / `system-designer` as cleaned input.

## Core principle
An instruction is "mechanical" when a careful agent follows it the same way every time and you can check whether it did. Where an instruction leaves the agent to decide by feel, either give it a rule you can measure (a test, named inputs, a number, a procedure) or flag it for a human. Change wording, not meaning.

## The decision gate — mechanize TRUE vagueness, leave mere generality
Apply this at the keep/discard decision for every span the scan flags:
- **VAGUE** = admits borderline cases with no measurable cutoff; you cannot state how to check fulfillment ("respond quickly," "keep it short," "a good summary"). → MECHANIZE.
- **GENERAL** = one word covers many specifics but context makes it decidable on demand ("handle the file"). → LEAVE, unless the agent must make a judgment call to apply it.
- One test decides it: "Can I state how to measure whether this was followed?" No → vague. Yes → leave.

Flagging every adjective is itself a failure; this gate is what prevents it.

## Step 1 — SCAN for smells (named, span-located; flag, do not auto-replace)
Each hit is a named smell at a specific span, judged in context. The word lists are representative, not exhaustive — flag any word that fails the gate above.
- **Subjective:** good, clean, simple, easy, user-friendly, robust, efficient, effective, reasonable, appropriate, suitable, relevant, useful, high-quality, seamless, strong, similar, customary, typical, routine, generic, ancillary.
- **Vague quantity/degree:** some, several, many, few, about, approximately, minimal, significant, sufficient, adequate, most, a lot, roughly, nearly, flexible, expandable.
- **Vague descriptive (everyday):** bad, clear, close, far, fast, slow, near, recent.
- **Escape clauses / loopholes:** as appropriate, as needed, as required, if possible, where possible, if necessary, to the extent practical, to the extent necessary, as far as possible, if practicable.
- **Open-ended:** etc., and so on, including but not limited to.
- **Superlatives / comparatives:** best, highest, most, better, faster, more X, as X as possible.
- **Absolutes:** all, every, always, never, none, 100% — flag; require the real bound or the actual required reaction.
- **Weak verbs (no obligation):** can, could, may, might, "try to," should (where you mean must).
- **Vague pronouns / references:** it, this, that, they, the above, the former/latter — when the referent is not pinned.
- **Under-specified nouns:** a bare category noun that needs an instance — "format the output" (which format?), "the data," "access."
- **Temporal vagueness:** quickly, soon, eventually, periodically, in a timely manner.
- **Compound / coordination scope:** one sentence carrying several obligations (and/or, lists), or unclear scope of and/or ("A and B or C") → split.
- **Negative-only:** "don't be verbose" → flag, demand the positive spec ("≤ 5 sentences").

## Step 2 — CLASSIFY each kept flag (what KIND of fix it needs)
- **JUDGMENT** (evaluate something): give a membership test or a rubric with named criteria + a pass-threshold — reuse `skill-builder`'s A1 membership test. Put criteria before the verdict; verdict last.
- **TRIGGER/TIMING** (when or whether to act): pin the trigger to a named signal or threshold; recast with an EARS WHEN/WHILE/IF-THEN form.
- **LOOKUP** (find/decide from data): name the exact inputs/signals/source that decide it — "decide the niche from {copy identifiers, who is depicted, exclusions, gathering venue}."
- **TRANSFORM** (produce/convert): give the explicit steps + the output format.
- **CONSTANT** (a fixed value left fuzzy): pin the value in the doc.
- **FILLER** (no load — "be helpful," "do your best"): delete it.

## Step 3 — REWRITE into a checkable form
Recast each kept flag so compliance is checkable. Templates (name the actor "the agent"; use "must"):
- **Always:** "The agent must <response>."
- **Trigger (WHEN):** "When <trigger>, the agent must <response>."
- **State (WHILE):** "While <condition>, the agent must <response>."
- **Optional (WHERE):** "Where <feature present>, the agent must <response>."
- **Edge / unwanted (IF/THEN):** "If <bad condition>, then the agent must <response>."

Rewrite operators: break a vague instruction into sub-steps · replace a degree word with a number or a named set · split a compound into singular instructions (≥2 triggers or ≥2 obligations in one rule → split) · name the actor (active voice) · unify a concept referred to by ≥2 names · specify the output format · fence/delimit any data region · if the doc carries few-shot examples, make each pass its own gate (`skill-builder` A3).

A rewritten CHECK lowers to a concrete form (`skill-builder` reference → "Checkable forms"): e.g. `contains` / `regex` / `is-json` / a sentence-count bound / a numeric threshold. Use a rubric + pass-threshold only where no deterministic check can decide the quality.

## Step 4 — ACCEPTANCE TEST each rewrite (it must be able to return FALSE)
A rewrite is done only when it is: **Unambiguous** (one reading) · **Verifiable** (you can state how to check compliance) · **Singular** (one obligation) · **Complete** (names actor, trigger, response) · **Intent-preserving** (meaning unchanged). Two-reader test: imagine two agents each reading it one way — if both readings survive, it is still ambiguous. On any FALSE, return the span to Step 3 and re-test. Acceptance is a separate pass from rewriting.

## Step 5 — route the irreducible + report
- If a span needs human or taste judgment that no rule can decide, flag it.
- Do not put fake precision onto a flagged span.
- For each flagged span, record `{span, why-irreducible, routed-to: author | decision-step | named skill, what-would-resolve-it}`.
- Emit the rewritten doc + a CHANGE REPORT: per change → `{span, smell, classification, rewrite, why}`, plus the flagged list above.

## Handoffs (when another skill owns the span)
- If a flagged span is about an OUTPUT FIELD's contract, de-vague the prose here, then hand that field to `skill-builder` — do not build the soundness block here.
- If the doc describes ≥2 distinct job-types handing off to each other, route to `system-designer` to decompose it first.

## Discipline
- Rewrite a span only if it carries a kept flag (leave unflagged prose untouched).
- A smell is a candidate judged in context, not an auto-replace.
- Mechanizing lengthens a doc and makes it more rigid; state the size/rigidity increase in the change report.

## Membership test — "is this doc mechanized?" (answer each from the artifact; any NO = not done)
- Of the spans you LEFT, take the 3 most general: can you name the context that makes each one decidable? If not, you under-mechanized.
- Does every change in the report carry a named smell + a specific span?
- Does every rewrite pass Step 4 (Unambiguous + Verifiable + Singular + Complete + intent-preserving)?
- Does every JUDGMENT put criteria before verdict and lower to a checkable form (or a rubric + threshold)?
- Does every flagged span carry a routed-to + what-would-resolve-it?

## Worked example (gated)
**Before:** "Write a good, concise summary and include relevant details where appropriate."
**Scan:** "good" (subjective), "concise" (vague degree), "relevant … where appropriate" (loophole + open-ended).
**After:**
> When asked for a summary, the agent must produce one that:
> - is ≤ 5 sentences;
> - states each of {the decision made, who it affects, the deadline};
> - excludes any fact already stated in the parent thread.

**Change report:** `good` → deleted (subjective, no criterion; replaced by the three requirements) · `concise` → "≤ 5 sentences" · `relevant … where appropriate` → a named set + an explicit exclude-rule whose source is named (the parent thread).
**A rewrite that FAILS Step 4 (so the gate bites):** "the agent must include relevant details" → Verifiable? NO (no named set of which details) → return to Step 3 → becomes the three-item named set above.
**Flagged-irreducible:** none.

## Sources (provenance only — you do not need to open these)
- Requirements Smells (Femmer et al., arxiv 1611.08847): the smell taxonomy + flag-don't-mangle discipline.
- INCOSE Guide to Writing Requirements v4: the weak-word lists (vague terms / escape clauses / open-ended / absolutes / temporal) + the quality characteristics (unambiguous, verifiable, singular, complete) used as the acceptance test.
- EARS (Mavin et al., alistairmavin.com/ears): the WHEN/WHILE/WHERE/IF-THEN/ubiquitous rewrite templates + the singularity count rule.
- QuARS (Fabbrini et al.): per-smell weak-word dictionaries (weak verbs can/could/may; under-specified nouns; multiplicity → split).
- Ambiguity Handbook (Berry, Kamsties, Krieger): the vagueness-vs-generality gate ("vague if you cannot measure fulfillment"), referential/scope ambiguity, the two-reader test.
- Anthropic Prompt Improver: named-transformations + change-report shape; reasoning-before-conclusion.
- OpenAI prompt optimizer / meta-prompt: "break vague instructions into sub-steps," minimal-changes / preserve-intent, the failure-mode scan, result-last ordering.
- promptfoo: the deterministic checkable-forms menu + rubric-with-threshold fallback.
- Microsoft Spotlighting (arxiv 2403.14720): fence/delimit untrusted data regions.
