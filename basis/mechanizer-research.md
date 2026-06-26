# Research capture — instruction-mechanizer
Lossless source for the `instruction-mechanizer` skill. Lists/templates reproduced inline so the skill needs no link. URLs are provenance only.

## A. Prompt-improver / linter tools (how they scan + rewrite)

**Anthropic Prompt Improver** (Claude Console). Takes a prompt, applies a FIXED set of named transformations + returns a change summary. The 5 transformations: (1) add a dedicated chain-of-thought/reasoning section BEFORE the answer; (2) standardize embedded examples into consistent format; (3) enrich examples with matching reasoning; (4) rewrite for clearer structure + fix grammar; (5) add a prefill to enforce output format. Pipeline: identify examples → draft structured template → add CoT → enhance examples. Honest trade-off it discloses: output gets longer/more thorough but slower. URL: claude.com/blog/prompt-improver.

**OpenAI prompt optimizer / meta-prompt** (published verbatim). "Optimize" scans for named failure modes: contradictions; missing/unclear format spec; inconsistencies between prompt and its few-shot examples. Evaluates clarity, CoT ordering, structure, specificity; returns revised prompt + summary of changes. Meta-prompt rules to lift: **"if user guidelines are vague, break them down into sub-steps"**; **Minimal Changes / preserve user content** (don't gratuitously rewrite); **Reasoning before conclusions — NEVER start with conclusions; result/classification ALWAYS last** (reverse examples that put answer first); use placeholders `[in brackets]`; avoid bland filler instructions; specify output format explicitly. URL: platform.openai.com/docs/guides/prompt-generation.

**PromptLint** ("ESLint for prompts", deterministic, 20+ rules, no LLM). Liftable rules = our scan menu: `clarity-vague-terms` (flag vague qualifiers → demand measurable def); `actionability-weak-verbs` (non-directive verbs → imperative); `consistency-terminology` (one concept named ≥2 ways → unify); `output-format-missing` (output instruction with no format); `specificity-constraints` / `completeness-edge-cases` (rule with no boundary / no "what if"); `verbosity-redundancy` (41 filler phrases, e.g. "in order to"→"to") + `politeness-bloat`. Small single-dev project — cite as pattern source, not standard. URL: promptlint.dev.

**promptfoo assertions** (the "checkable forms" menu — what a de-vagued instruction compiles to). Deterministic (free, identical every run): `equals`, `contains`/`contains-all`/`contains-any`/`icontains`, `regex`, `starts-with`/`ends-with`, `is-json`/`contains-json`, `is-xml`/`is-html`, `rouge-n` (overlap threshold), `levenshtein` (edit distance), `latency`, `cost`, custom `javascript`/`python`. Every type negatable with `not-` prefix. Model-graded: `llm-rubric` with numeric `threshold`. `weight` per assertion. Discipline: prefer deterministic; fall back to rubric+threshold only when genuinely subjective. URL: promptfoo.dev/docs/configuration/expected-outputs.

**DSPy / MIPROv2 — LIMITS (don't over-claim).** Optimizes prompts via examples + a numeric metric + Bayesian search; needs ~300+ labeled examples; does NOT de-vague prose or reason about why an instruction is ambiguous. Complementary, not a substitute. Borrowable idea: each de-vagued instruction should ideally name how you'd MEASURE compliance.

**Microsoft Spotlighting.** Mechanical transforms to separate instructions from data: delimit (wrap untrusted text in randomized delimiters), datamark (special char between words), encode (base64/ROT13). Lift: if a prompt mixes instructions with data/quoted content, fence the data region explicitly. URL: arxiv 2403.14720.

## B. Requirements-engineering ambiguity detection (lists/taxonomy/templates)

**Femmer — 9 Requirements Smells** (each = named symptom + specific span + detection; flag, don't auto-mangle; a smell is NOT necessarily a defect — judge in context):
1. Subjective Language — user-friendly, easy to use, cost-effective, simple, efficient.
2. Ambiguous Adverbs/Adjectives — almost always, significant, minimal, too low.
3. Loopholes — as far as possible, if possible, as appropriate.
4. Open-ended non-verifiable — sufficient, as needed, if needed.
5. Superlatives — highest, best, most, lowest.
6. Comparatives — more exact, better, faster, higher than.
7. Negative Statements — not, no, neither (risks underspecifying the actual required reaction).
8. Vague Pronouns — it, this, they, which (unclear referent).
9. Incomplete References — a reference the reader can't follow. URL: arxiv 1611.08847.

**INCOSE Guide to Writing Requirements v4 — word lists + quality characteristics.**
- R7 Vague quantifiers: some, any, allowable, several, many, a lot of, a few, almost always, very nearly, nearly, about, close to, almost, approximate. Vague adjectives: ancillary, relevant, routine, common, generic, significant, flexible, expandable, typical, sufficient, adequate, appropriate, efficient, effective, proficient, reasonable, customary.
- R8 Escape clauses: so far as is possible, as little as possible, where possible, as much as possible, if it should prove necessary, if necessary, to the extent necessary, as appropriate, as required, to the extent practical, if practicable.
- R9 Open-ended: including but not limited to, etc., and so on.
- R16/R26 Absolutes & not: avoid "not"; avoid 100%/all/every/always/never.
- R19 Combinators (singularity): and, or, then, unless, but, as well as, but also, however, whether, meanwhile, whereas, otherwise.
- R35 Temporal: eventually, until, before, after, as, once, earliest, latest, instantaneous, simultaneous — define explicitly.
- R34 measurable target; R32 "each" not "all/any"; R2 active voice; R5 "the" not "a".
- 9 quality characteristics (post-rewrite acceptance test): Necessary, Appropriate, **Unambiguous** (one reading by all audiences), Complete, **Singular** (one capability), Feasible, **Verifiable** (measurable), Correct, Conforming.

**EARS templates** (rewrite forms; recast "the agent" as <system>, "shall/must" as obligation; order: While <precond>, when <trigger>, the <system> shall <response>):
1. Ubiquitous: "The <system> shall <response>."
2. State (WHILE): "While <precondition>, the <system> shall <response>."
3. Event (WHEN): "When <trigger>, the <system> shall <response>."
4. Optional (WHERE): "Where <feature included>, the <system> shall <response>."
5. Unwanted (IF/THEN): "If <trigger>, then the <system> shall <response>."
6. Complex: combine. (Rule: 0+ preconditions, 0–1 trigger, 1 actor, 1+ responses → doubles as a singularity/split check.) URL: alistairmavin.com/ears.

**QuARS — per-defect dictionaries.**
- Optionality: possibly, eventually, in case, if possible, if appropriate, if needed.
- Subjectivity: similar, similarly, having in mind, take into account, as [adj] as possible.
- Vagueness: adequate, bad, clear, close, easy, far, fast, good, in front, near, recent, significant, slow, strong, suitable, useful.
- Weakness (weak verbs, no obligation): can, could, may.
- Implicity: this/these/that/those, it/they, previous/next/following/last, above/below.
- Multiplicity: and/or, or, itemized lists → split into atomic instructions.
- Under-specification: a bare category noun needing an instance (flow→data flow, access→write access, testing→unit testing).

**Ambiguity Handbook (Berry, Kamsties, Krieger) — the decision rule + structural checks.**
- Types: lexical (one word, many meanings), syntactic (multiple parses — attachment, coordination/"and-or" scope), semantic (scope of not/every/only), pragmatic (referential anaphora — "treat the roads before they freeze": they = roads or trucks?; deictic — now/here).
- **Vagueness vs Generality (the flag-or-not gate):** VAGUE = admits borderline cases, "inquiry resistant", no way to measure fulfillment (tall, fast response) → must mechanize. GENERAL = covers many specifics but decidable on demand (cousin, "handle the file") → may be fine. RE rule: "a requirement is vague if it is not clear how to measure whether it is fulfilled."
- Two-reader disambiguation self-check: imagine two agents each reading it one way; if both survive, still ambiguous. URL: cs.uwaterloo.ca/~dberry/handbook.

**Controlled Natural English (ACE) / SOPHIST** — restricting prose to a small checkable grammar kills ambiguity; EARS is the pragmatic sweet spot (we don't need full ACE formalism).

## C. What this improves in the ALREADY-WRITTEN skills
- skill-builder: add a "checkable forms" menu (promptfoo deterministic assertions + rubric/threshold fallback) so a membership/soundness test has a concrete compile target; add "reasoning before verdict, verdict last" (Anthropic/OpenAI).
- system-designer (D2): add "fence/delimit untrusted data regions" (Spotlighting) as a concrete input-hygiene transform.
