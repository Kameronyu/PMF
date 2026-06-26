# Adversarial review — `instruction-mechanizer/SKILL.md`

Reviewed against `mechanizer-research.md` (the lossless standard) and siblings `skill-builder/SKILL.md`, `skill-builder/reference.md`, `system-designer/SKILL.md`. Harsh pass, organized by the 7 axes. Each finding: PROBLEM / EVIDENCE / FIX.

---

## AXIS 1 — LOSSINESS vs research

Item-by-item walk of every liftable asset in `mechanizer-research.md`. Verdict per asset: CAPTURED / REDUCED / MISSING.

### 1.1 Word lists are materially under-stocked (the core asset, over-compressed)
**PROBLEM.** The skill's whole value is being usable without a link, and the usability of the SCAN step is a direct function of how many real trigger words are inline. The skill dropped a large fraction of the concrete dictionary words the research reproduced verbatim, so the scanner will miss real hits.
**EVIDENCE.** Compare research lists to Step 1.
- INCOSE R7 vague *adjectives* (research line 32): `ancillary, routine, common, generic, flexible, expandable, typical, proficient, customary` — **none** of these nine appear in the skill's Subjective list (SKILL §Step 1 "Subjective"). The skill carries `good, clean, simple, easy, user-friendly, robust, efficient, effective, reasonable, appropriate, suitable, relevant, useful, high-quality, natural, seamless, strong` — a different, smaller set.
- INCOSE R7 vague *quantifiers*: research has `allowable, very nearly, close to` — absent from the skill's "Vague quantity/degree."
- INCOSE R8 escape clauses: research has `so far as is possible, as little as possible, as much as possible, if it should prove necessary, to the extent necessary, if practicable` — the skill's "Escape clauses" omits all six, keeping only a thinner set.
- QuARS Vagueness dictionary (research line 52): `bad, clear, close, far, fast, in front, near, recent, slow` — **none** present in the skill. These are exactly the everyday vague words a prose doc uses; their absence is a real coverage hole.
- QuARS Subjectivity: `similar, similarly, having in mind, take into account` — absent.
- QuARS Optionality: `in case` — absent.
**FIX.** Either (a) fold the missing INCOSE R7/R8 + QuARS Vagueness/Subjectivity words into the existing buckets (cheapest, ~15 added words, negligible bloat), or (b) state explicitly in Step 1 that the lists are *representative, not exhaustive* AND add the highest-frequency missing words (`fast, slow, near, recent, clear, typical, routine, similar, in case`). Right now the skill neither claims exhaustiveness nor is exhaustive — it silently drops words, which is the worst of both.

### 1.2 Femmer's 9 smells — present as coverage, but the mapping is not asserted (traceability gap)
**PROBLEM.** Research frames Femmer as a numbered 9-smell taxonomy that is the backbone of "named symptom + specific span." The skill's Step 1 buckets *do* cover all 9 conceptually, but nowhere is the 9-smell taxonomy named as the spine, and one smell is arguably weakened (see 1.3). A reviewer can't confirm losslessness by inspection.
**EVIDENCE.** SKILL §Step 1 lists ~12 buckets; the Sources footer credits Femmer for "the 9-smell taxonomy" (line 103) but the body never ties buckets→smells. Femmer #2 "Ambiguous Adverbs/Adjectives" (`almost always, too low`) and #4 "Open-ended non-verifiable" (`sufficient, as needed, if needed`) are split across the skill's "Vague quantity/degree" and "Escape clauses"/"Open-ended" buckets without comment — fine functionally, but `too low` (a comparative-degree phrase) isn't obviously caught by any bucket.
**FIX.** This is minor. Add `too low` / `almost always` as examples under "Vague quantity/degree." No need to renumber to Femmer's scheme — the conceptual coverage is genuinely complete except the noted words.

### 1.3 Femmer #7 Negative Statements — REDUCED in scope
**PROBLEM.** Research Femmer #7 is broad: "not, no, neither (risks underspecifying the actual required reaction)" — i.e., ANY negative statement risks underspecifying. The skill narrows this to a single illustrative pattern ("don't be verbose") and frames it only as "demand the positive spec."
**EVIDENCE.** SKILL §Step 1 "Negative-only: 'don't be verbose' → flag and demand the positive spec." This catches negative-only *instructions* but the research's point also covers negative *constraints embedded in otherwise-positive requirements* ("the system shall not …"). Narrower than the source.
**FIX.** Broaden the bucket label to "Negative statement (not / no / neither) — flag; demand the positive spec of the required behavior." Add the INCOSE R16/R26 absolutes (`100%/all/every/always/never`, research line 35) which the skill currently does NOT carry at all — these are a distinct, named smell (over-claiming absolutes) with zero home in Step 1.
**SEVERITY: this is a real MISSING asset** — INCOSE R16/R26 absolutes (`all/every/always/never/100%`) appear nowhere in the skill. A doc saying "always validate every field" has two absolutes the scanner won't flag.

### 1.4 EARS templates — CAPTURED but mislabeled and missing the singularity rule
**PROBLEM.** (a) The skill renames "Ubiquitous" to "Always" — harmless. (b) More importantly, EARS carries a *structural singularity rule* the research calls out as load-bearing: "0+ preconditions, 0–1 trigger, 1 actor, 1+ responses → doubles as a singularity/split check" (research line 47). The skill drops this rule entirely. It mentions "Singular" in Step 4 but never connects the EARS shape to the split test, losing the mechanism that makes EARS *self-checking*.
**EVIDENCE.** SKILL §Step 3 lists the 5 templates; §Step 4 asserts "Singular (one obligation)" as an acceptance criterion but with no procedure. Research line 47 gives the actual counting rule.
**FIX.** Add one line to Step 3: "Each rewrite has at most one trigger and exactly one actor; ≥2 triggers or ≥2 obligations means split (this is the singularity check)." This is the EARS→singular bridge and it's nearly free.

### 1.5 Vagueness-vs-generality gate — CAPTURED (good), but missing "inquiry-resistant"
**PROBLEM.** The gate is well-rendered, including the "can't measure fulfillment" rule and the two-reader test. One research nuance dropped: VAGUE is "inquiry resistant" (research line 60) — i.e., no amount of asking the author resolves it because there's no fact of the matter. This distinguishes vague (no answer exists) from under-specified (author knows, didn't say). Minor but it sharpens the FLAG decision.
**EVIDENCE.** SKILL §"The decision gate" captures borderline-cases + measurability + two-reader, omits inquiry-resistance.
**FIX.** Optional. Add to the VAGUE bullet: "(no answer would settle it — it's inquiry-resistant)." Low priority.

### 1.6 Ambiguity Handbook structural types — REDUCED to two
**PROBLEM.** Research enumerates four ambiguity classes with examples: lexical, syntactic (attachment, coordination/and-or scope), semantic (scope of not/every/only), pragmatic (referential anaphora + deictic). The skill captures referential ("they" with two antecedents) and scope ("only/all/not" reach) — but lexical and syntactic-attachment ambiguity are absent, and the vivid worked cue ("treat the roads before they freeze") is gone.
**EVIDENCE.** SKILL §Step 1 "Unpinned referent / scope" + "Vague pronouns/references." No bucket for lexical ambiguity (one word, multiple meanings) or coordination scope ("A and B or C"). Research lines 59–61 carry all four.
**FIX.** Add a "Coordination/attachment scope" note to the scope bucket: "'A and B or C' — group explicitly." Lexical ambiguity is lower-yield in instruction docs; acceptable to omit if 1.1 word coverage is fixed. The roads example is illustrative-only; skip.

### 1.7 Anthropic/OpenAI improver transformations — PARTIALLY captured
**PROBLEM.** The research lists named improver transformations; the skill captures most but drops two.
- CAPTURED: break-into-sub-steps (Step 3 rewrite operators), minimal-changes/preserve-intent (§Discipline), reasoning-before-conclusion / verdict-last (Step 2 + membership test), failure-mode scan (Step 1), change report (Step 5).
- MISSING: **"standardize/enrich embedded examples"** (Anthropic transforms 2+3, research line 6) — if the doc being mechanized contains few-shot examples, the skill never says to normalize them or make them obey their gates. This is a real transformation in scope ("any existing markdown … skill") and it's the one place the skill could *reuse* skill-builder's A3 ("examples must pass the gates they teach") but doesn't.
- MISSING: **the explicit honest trade-off the improvers disclose** is present (§Discipline "honest trade-off") — OK.
- MISSING: OpenAI's "use placeholders `[in brackets]`" and "reverse examples that put answer first" — the bracket-placeholder convention is absent; the answer-first reversal is implied by verdict-last but not stated as an operation on existing examples.
**EVIDENCE.** SKILL §Step 3 rewrite operators; §Composition. No example-normalization operator anywhere.
**FIX.** Add a rewrite operator: "If the doc contains examples, normalize them to one format and make each obey the rule it teaches — reuse `skill-builder` A3." This both closes the gap and demonstrates the reuse the skill claims (see Axis 5).

### 1.8 promptfoo checkable-forms menu — CAPTURED (adequately compressed)
**PROBLEM.** None material. Step 3 lists `equals / contains / regex / is-json / length-or-sentence-count / numeric threshold (each negatable)` + rubric-with-threshold fallback. Research's fuller menu (`contains-all/any`, `starts/ends-with`, `is-xml/html`, `rouge-n`, `levenshtein`, `latency/cost`, `weight`) is trimmed, but the trimmed set is a faithful representative subset and the discipline ("prefer deterministic; rubric only when subjective") is intact.
**FIX.** None required. Optionally add `contains-all/any` since multi-item coverage checks ("covers each of {…}") are common in mechanized output — and the worked example literally uses a "covers each of {3 items}" form that maps to `contains-all`.

### 1.9 Spotlighting delimit-data — CAPTURED (reduced to one of three)
**PROBLEM.** Research gives three Spotlighting transforms (delimit, datamark, encode). The skill keeps only "fence/delimit any data region" (Step 3 operator + Sources). For a *de-vaguing* skill this is the right one to keep; datamark/encode are anti-injection, out of scope. Acceptable reduction.
**FIX.** None.

### 1.10 DSPy/MIPROv2 LIMITS — DROPPED (acceptable)
**PROBLEM.** Research carries a "don't over-claim" note (DSPy needs 300+ examples, doesn't de-vague prose). The skill omits it. Since the skill never claims to optimize via examples, the disclaimer is unnecessary. Acceptable.
**FIX.** None.

### 1.11 PromptLint rules — folded in (acceptable)
**PROBLEM.** Research's PromptLint rule names (`clarity-vague-terms`, `actionability-weak-verbs`, `consistency-terminology`, `output-format-missing`, etc.) are absorbed into Step 1 buckets + Step 3 operators conceptually. The "41 filler phrases / politeness-bloat" verbosity rule maps to the skill's FILLER class. Acceptable; PromptLint was explicitly "cite as pattern, not standard."
**FIX.** None.

**AXIS 1 SUMMARY.** The method-shape is lossless; the *dictionaries are not*. Real MISSING assets: INCOSE R16/R26 absolutes (all/every/always/never) — no home at all; ~15+ concrete vague words (QuARS Vagueness/Subjectivity, INCOSE R7 adjectives) that a working scanner needs; the EARS singularity-counting rule; example-normalization (Anthropic transforms 2/3, also a missed reuse of skill-builder A3). These are the gaps to close.

---

## AXIS 2 — LINK-DEPENDENCE

**PROBLEM.** None found. This axis passes.
**EVIDENCE.** The Sources footer (SKILL lines 102–111) is explicitly provenance-only and headed "you do not need to open these." Every method element — word lists, EARS templates, the gate, the two-reader test, the checkable-forms menu, the change-report shape — is reproduced inline. No instruction anywhere reads "see <URL> for …". The one cross-reference that *could* have become a link ("reuse skill-builder's A1 membership test," Step 2) points to a sibling skill file, not a URL, which is correct.
**FIX.** None. (Caveat: the inline content is link-*independent* but, per Axis 1, not fully lossless — link-independence and completeness are separate tests and only the former is clean here.)

---

## AXIS 3 — SELF-CONSISTENCY (the key test)

A skill that bans vague language must contain none. I hunted the skill's own prose against its own Step 1 list. Findings, quoted.

### 3.1 The skill uses its OWN banned words in its OWN instructions
**PROBLEM.** Multiple instruction-bearing sentences use words the skill flags as smells. By its own Step 4 ("Singular/Verifiable"), these would fail.
**EVIDENCE (each quoted):**
- **"usually LEAVE"** — SKILL §decision gate, GENERAL bullet: "→ usually **LEAVE**; mechanize only if…". `usually` is a vague-quantity/temporal hedge (cf. `almost always` in Femmer #2). An agent can't tell when "usually" doesn't apply. **Self-violation.**
- **"genuinely subjective" / "genuinely can't be mechanized" / "genuinely needs"** — appears 3×: Step 3 ("only when the quality is **genuinely** subjective"), Step 5 ("**genuinely** needs human/marketing/taste judgment"), §Discipline. `genuinely` is an intensifier doing the work of a threshold without one — exactly the "subjective qualifier" smell. What test distinguishes genuinely-subjective from not? Unstated. **Self-violation** (and it's load-bearing — it gates the rubric-fallback and the FLAG decision).
- **"don't gratuitously rewrite clear prose"** — §Discipline. `gratuitously` and `clear` are both on the smell lists (`clear` is literally in the QuARS Vagueness dictionary, research line 52). Negative-only phrasing too. **Self-violation, triple.**
- **"where it should trace to input"** — not present here but the pattern `where possible` family: check Step 3 "fence/delimit any data region" — fine. But Step 5 "route it to a decision step" leaves "decision step" an under-specified noun (which decision step? defined where?). Minor.
- **"note it if it matters"** — §Discipline honest-trade-off: "note it **if it matters**." `if it matters` is an escape clause (cf. R8 "if necessary / as appropriate"). When does it matter? Undefined. **Self-violation.**
- **"don't over-reach" / "don't over-claim" / "Over-flagging … is itself a failure"** — these are negative-only framings (the very Femmer #7 smell), stated without the positive spec the skill demands of others ("demand the positive spec"). The skill tells authors to convert negatives to positives but states its own discipline as negatives.
**FIX.** Mechanize the skill's own prose:
- "usually LEAVE" → "LEAVE unless the agent must make a judgment call to apply it (then mechanize)." (Removes the hedge; states the condition.)
- "genuinely subjective" → define the test once, up top: "*subjective* = no deterministic check (equals/contains/regex/count/threshold) can decide it; only then use a rubric+threshold." Then drop "genuinely" everywhere and point to that test.
- "don't gratuitously rewrite clear prose" → "Rewrite a span only if it carries a kept flag (passed the gate). Leave any span with no kept flag unchanged." (Positive, checkable, removes `clear`/`gratuitously`.)
- "note it if it matters" → "State the length/rigidity increase in the change report's summary." (Always, not conditional.)
- Restate the three "don't over-reach" disciplines positively where possible, or accept them as the rare END-placed negatives skill-builder permits — but then say so.

### 3.2 Vague pronoun in the skill's own text
**PROBLEM.** The skill flags "vague pronouns … when the referent isn't pinned" yet uses one.
**EVIDENCE.** §Discipline honest-trade-off: "mechanizing makes a doc longer and more rigid — that's the deal you're buying; **note it** if it matters." `it` = the trade-off? the deal? the longer-ness? Two antecedents survive (fails the skill's own two-reader test). Also Step 5: "do NOT fake precision onto **it**" — `it` is recoverable here (the instruction), borderline.
**FIX.** "note the increase in length/rigidity in the change report." (Pins the referent.)

### 3.3 Compound instructions in the skill's own steps
**PROBLEM.** Step 1 bans "one sentence carrying several obligations." Several skill sentences carry several obligations.
**EVIDENCE.**
- Step 5 bullet 1: "**FLAG it for the author** (or route it to a decision step) — do NOT fake precision onto it." Three obligations (flag OR route; and don't-fake) in one sentence with an or-branch and a negative — exactly the "Compound" + "Combinators (and/or/unless)" smell (research R19).
- §Core principle: "either give it a calculable rule (a test, named inputs, a number, a procedure) or flag it for a human." Two-branch obligation in one sentence — acceptable as a genuine either/or, but it's the same shape the skill would flag in someone else's doc.
**FIX.** By the skill's own Step 3 ("split a compound into singular instructions"), split Step 5: "(1) If an item is irreducible, FLAG it for the author. (2) Optionally route it to a named decision step. (3) Never fake precision onto a flagged item." The skill should eat its own dog food here or it fails its membership test's "Is every rewrite … Singular."

### 3.4 Does the membership test actually return FALSE? — WEAK
**PROBLEM.** The "is this instruction mechanized?" test (SKILL §Membership test, lines 82–88) is phrased as yes/no questions, but several can't really return FALSE in a way that bites, because they're self-attesting.
**EVIDENCE.**
- "Did you apply the vagueness-vs-generality gate (not just flag every adjective)?" — an agent that over-flagged will still answer YES ("I applied it"). The check doesn't measure the *outcome* (did you leave the general ones?), only self-reported process. Compare skill-builder's membership test which the skill cites as the model: skill-builder's reads "Can each membership test return FALSE (a real gate, not 'assert YES')?" — the mechanizer's own test violates the standard it points to.
- "Is the change report present?" — binary, real. Good.
- "Are irreducible items flagged for a human, not fake-precised?" — can return FALSE. Good.
**FIX.** Convert the soft ones to outcome checks an external reader can falsify: "Pick the 3 most general spans you LEFT — for each, can you name the context that makes it decidable? If not, you under-flagged." And: "Pick any rewritten span — does a second reader get the same single reading? (two-reader test applied to your own output)." Anchor each line to an artifact, not to self-report.

### 3.5 Does the worked example pass the skill's own acceptance test? — MOSTLY, with one hole
**PROBLEM.** The worked example (SKILL lines 90–100) is good and visibly runs Scan→After→Change report→Acceptance. But it does NOT demonstrate the gate returning FALSE anywhere (skill-builder's worked example explicitly shows a FAILING object; the mechanizer's shows only success). And "omits background the reader already has" — the third rewritten requirement — is itself **not verifiable**: how does the agent check what "the reader already has"? That clause fails the skill's own Step 4 "Verifiable" and "Unambiguous" (which reader? what do they know?).
**EVIDENCE.** SKILL line 97: "omits background the reader already has." No named input tells the agent what the reader knows; this is a LOOKUP with un-named inputs (Step 2 LOOKUP requires "name the exact inputs/signals/source"). The example thus ships a rewrite that violates the skill's own classification rule, in the skill's flagship demonstration.
**FIX.** Either fix the example rewrite to "omits any of {definitions, prior-context} already stated in the parent thread §X" (names the source), or — better — change that third bullet to something fully checkable and add a second worked example (or an inline FAILING line) that shows the acceptance test returning FALSE, mirroring skill-builder's "proof the test can return false." Right now the example proves the happy path only.

### 3.6 Does the skill declare its own inputs/outputs/consumers? — YES (good)
**PROBLEM.** None. SKILL lines 18–20 declare **Inputs / Output / Consumed-by** explicitly, matching skill-builder's and system-designer's house style. This is correct and a strength. (Cross-ref Axis 7.)
**FIX.** None.

**AXIS 3 SUMMARY.** The skill fails its own standard in several places: `usually`, `genuinely` (×3, load-bearing), `clear`/`gratuitously`, `if it matters`, an unpinned `it`, two compound/negative-branch instructions, a membership test with self-attesting (non-falsifiable) lines, and a flagship worked example whose third rewrite is not verifiable and which never shows the gate returning FALSE. For a skill whose entire thesis is "remove vague language," these are not cosmetic — they are credibility-determining. **This is the axis that should drive the verdict.**

---

## AXIS 4 — METHOD CORRECTNESS

### 4.1 Pipeline soundness — mostly sound, one ordering nit
**PROBLEM.** Scan→Classify→Rewrite→Acceptance→Report is logically complete and each step consumes the prior step's output (scan→flags; classify→fix-kind; rewrite→checkable form; acceptance→pass/fail; report→record). The decision gate is correctly placed BEFORE Step 1's flagging in the document order (it appears above Step 1) and is correctly described as "apply it before touching anything." Good.
**EVIDENCE.** SKILL §decision gate ("apply it before touching anything") precedes §Step 1. Correct.
**FIX.** None on ordering. But note: the gate is described as filtering *before* flagging, while Step 1 says "Flag, don't auto-replace — judge each in context" and the gate is re-invoked inside the membership test. Slight redundancy in *where* the gate runs (before scan vs. during classify). Clarify the gate runs at the flag/keep decision (i.e., between scan-hit and kept-flag), not before scanning — you must scan to have something to gate.

### 4.2 The CLASSIFY taxonomy has a coverage gap
**PROBLEM.** JUDGMENT / LOOKUP / TRANSFORM / CONSTANT / FILLER — does every instruction type have a home? Consider an instruction that asks the agent to **decide WHETHER to act** (a conditional/trigger that's vague about the trigger, not the action): e.g., "escalate when the request is unusual." The *action* (escalate) is clear; the *trigger* ("unusual") is the vague part. Which class? It's not JUDGMENT (no field to evaluate/label), not cleanly LOOKUP (it's a threshold on a signal), arguably CONSTANT (pin "unusual" to a cutoff) — but the taxonomy doesn't say trigger-vagueness maps to CONSTANT/LOOKUP. Also: a **CONTROL/SEQUENCING** instruction ("do X before Y," temporal ordering, R35) has no obvious class — it's not produce/convert (TRANSFORM is about output), it's about ordering. Temporal vagueness is flagged in Step 1 but has no classification target in Step 2.
**EVIDENCE.** SKILL §Step 2 (5 classes). §Step 1 flags "Temporal vagueness: quickly, soon, eventually, periodically" — but Step 2 offers no class for "when must this happen?" A flagged temporal smell has nowhere to be classified, so Step 3 can't pick a template for it cleanly (though EARS WHEN/WHILE partly covers it).
**FIX.** Add a sixth class or fold explicitly: "**TRIGGER/TIMING** (asks WHEN/whether to act, vague about the condition): pin the trigger to a named signal or threshold; recast with EARS WHEN/WHILE/IF-THEN." This closes the temporal/conditional gap and connects Step 2→Step 3 templates. Alternatively state that trigger-vagueness is handled as CONSTANT (pin the cutoff) or LOOKUP (name the signal) — but say so, because right now it's homeless.

### 4.3 Decision gate statement — correct
**PROBLEM.** None. The gate is correctly stated: VAGUE (no measurable cutoff, can't tell if fulfilled) → mechanize; GENERAL (decidable on demand in context) → usually leave. Matches research lines 60. The "can you state how you'd measure whether this was followed" test is the research's RE rule verbatim-equivalent. Correct.
**FIX.** None (except remove "usually," per 3.1).

### 4.4 EARS templates applied correctly? — YES, with the singularity caveat from 1.4
**PROBLEM.** Actor/trigger/response structure is correct; "name the actor as 'the agent'; use 'must'" is the right recast of EARS "<system> shall." All five templates map correctly to research lines 42–47. The only defect is the dropped singularity-counting rule (see 1.4) — without it, "Complete (names actor, trigger, response)" in Step 4 is asserted but the *one-trigger-one-actor* bound isn't enforced.
**FIX.** Per 1.4, add the count rule to Step 3 or Step 4.

### 4.5 Input/output flow between steps — one orphaned output
**PROBLEM.** Does every step's output get consumed? Step 2's CLASSIFY emits a classification per flag. The change report (Step 5) records `{span, smell, classification, rewrite, why}` — so classification IS consumed. Good. But Step 4's ACCEPTANCE TEST produces a pass/fail verdict per rewrite — where is a FAILED acceptance routed? The pipeline has no loop-back: if a rewrite fails the two-reader test, Step 4 says "fix it" but doesn't say "return to Step 3." Minor, but the produce→verify separation (which skill-builder and system-designer both stress) is collapsed into Step 4 doing both "test" and "fix it," violating the sectioning principle the siblings teach.
**EVIDENCE.** SKILL §Step 4: "if both readings survive, it's still ambiguous; fix it." "Fix it" = re-run Step 3. Not stated as a loop; and the same agent tests and fixes (self-grading, which skill-builder §"One job per prompt" warns against).
**FIX.** State the loop: "On any FALSE, return the span to Step 3 and re-test. (Acceptance is a separate check from rewriting — don't grade in the same breath you wrote.)" This also imports the sibling sectioning discipline cheaply.

**AXIS 4 SUMMARY.** Pipeline is sound and the gate is correctly placed. Two real gaps: (a) the CLASSIFY taxonomy has no home for temporal/trigger vagueness even though Step 1 flags it; (b) acceptance→rewrite has no declared loop-back and collapses produce+verify into one step, against the siblings' own sectioning rule. Plus the dropped EARS singularity-count (1.4).

---

## AXIS 5 — COMPOSITION with siblings

### 5.1 Reuse of skill-builder is CLAIMED but largely RE-DERIVED (duplication)
**PROBLEM.** The skill says (line 80) "reuse `skill-builder`'s rules rather than repeating them" — then repeats several of them inline, which is the duplication the instruction warns against.
**EVIDENCE.**
- **Checkable-forms menu** is duplicated. SKILL §Step 3 line 65 reproduces `equals / contains / regex / is-json / length-or-sentence-count / numeric threshold (each negatable) … rubric with pass-threshold` — which is verbatim-equivalent to skill-builder/reference.md §"Checkable forms — what a test compiles to" (line 85). This is the same menu, re-stated, not referenced. Since reference.md owns it, the mechanizer should point to it.
- **Reasoning-before-verdict / verdict-last** is duplicated. SKILL §Step 2 ("Put the criteria/reasoning BEFORE the verdict; verdict last") restates skill-builder/reference.md §Checkable-forms last line ("order a judged field so its reasoning/criteria come BEFORE its verdict") and skill-builder is itself sourced to Anthropic/OpenAI. Re-derived.
- **Membership test that can return FALSE** — the skill builds its OWN membership test (lines 82–88) rather than referencing skill-builder's "can this return FALSE" standard, and (per 3.4) does it worse.
- **Provenance / evidence_quote** — Step 2 JUDGMENT says "reuse skill-builder's A1 membership test" (good, a real reference!) but Step 5's change report invents `{span, smell, classification, rewrite, why}` without referencing skill-builder's `{text, passed, evidence}` assertion shape or the `source`/`evidence_quote` provenance machinery, even though the change report IS a provenance artifact.
**FIX.** Replace the inlined checkable-forms list in Step 3 with: "compile to a checkable form — see `skill-builder/reference.md` §Checkable forms for the menu and the deterministic-first / rubric-fallback rule." Keep ONE example inline for usability, drop the rest. Same for verdict-last: "(verdict-last ordering — `skill-builder` reference)." This both removes bloat (Axis 6) and makes the claimed reuse real. The skill currently *says* reuse but *acts* duplicate — internally inconsistent with its own Composition section.

### 5.2 Boundary statement — CORRECT and well-placed
**PROBLEM.** None. The three-way boundary is stated clearly and correctly in the description (lines 11–13) and §Composition (line 80): mechanizer = de-vague an existing doc; skill-builder = spec a NEW output contract; system-designer = wire a pipeline. This matches all three siblings' self-descriptions. Strength.
**FIX.** None.

### 5.3 Gap that falls between mechanizer and skill-builder with no owner
**PROBLEM.** When the mechanizer hits an instruction about an OUTPUT FIELD's contract (e.g., "emit a good label"), the right move is to hand off to skill-builder's full field-hardening (positive target + membership test + evidence + presence/soundness). The skill gestures at this ("For the OUTPUT-spec portion … reuse skill-builder's rules") but never says **at what point to STOP mechanizing and hand off** vs. fix in place. Result: an ambiguous boundary case — a vague output-field instruction — could be half-mechanized by the mechanizer (de-vagued prose) and never handed to skill-builder for the membership-test/soundness treatment. No owner for "who builds the soundness block."
**EVIDENCE.** SKILL §Composition line 80 is a pointer, not a handoff *trigger*. Contrast system-designer step 2 which explicitly hands each node's IO contract to skill-builder.
**FIX.** Add a handoff trigger: "If a flagged instruction is about an OUTPUT FIELD's contract (what the doc must EMIT and how it's validated), de-vague the prose here, then hand that field to `skill-builder` for the membership-test + presence/soundness block — do not build the soundness block here." Names the seam and the owner.

### 5.4 Hand-off to system-designer — present but thin
**PROBLEM.** "To wire several mechanized prompts into a pipeline, use system-designer" (line 80) is correct but gives no trigger for *when* a single doc reveals it's actually a multi-step pipeline (e.g., the doc mechanized turns out to describe 3 sequential jobs). The mechanizer could mechanize prose that should have been decomposed.
**EVIDENCE.** SKILL line 80, terse.
**FIX.** Add: "If the doc describes ≥2 distinct job-types handing off to each other, stop and route to `system-designer` to decompose before mechanizing each step." (Mirrors system-designer's own decomposition trigger.)

**AXIS 5 SUMMARY.** Boundary is correct (strength). But the skill *claims* reuse while *duplicating* skill-builder's checkable-forms menu, verdict-last rule, and (re-inventing) its membership-test/provenance shapes — the exact duplication its Composition section forbids. Two seams lack a handoff trigger (output-field→skill-builder; multi-step-doc→system-designer).

---

## AXIS 6 — BLOAT / RIGHT-SIZING

(Single-file is an explicit user choice — flagging only genuinely removable redundancy.)

### 6.1 Duplicated checkable-forms menu is removable bloat
**PROBLEM.** Per 5.1, Step 3's full checkable-forms list duplicates skill-builder/reference.md. In an always-loaded file, every duplicated line is paid on every activation.
**EVIDENCE.** SKILL line 65 ≈ skill-builder/reference.md line 85.
**FIX.** Replace with a one-line reference + a single inline example. Saves ~2 lines of always-loaded weight and makes reuse real. Net win.

### 6.2 The decision gate is stated three times
**PROBLEM.** The vagueness-vs-generality gate appears (1) as its own §section, (2) restated in Step 1 framing ("Flag, don't auto-replace — judge each in context"), (3) again in the membership test ("Did you apply the vagueness-vs-generality gate"), and (4) the "over-flagging is a failure" warning twice (§gate line 31 and implied in Discipline). Some repetition aids a working skill, but the gate's *core test* ("can I state how you'd measure") is paraphrased in 2–3 places.
**EVIDENCE.** SKILL lines 25–31, 34, 83, 31.
**FIX.** State the gate once in full; let Step 1 and the membership test *reference* it ("apply the gate above") rather than re-paraphrase. Minor savings, improves single-source-of-truth.

### 6.3 §Discipline overlaps §decision gate and Step 1
**PROBLEM.** §Discipline ("Minimal changes," "Flag, don't mangle," "Honest trade-off") restates points already made: "Flag, don't mangle" = Step 1's "Flag, don't auto-replace"; "Minimal changes" overlaps the gate's "don't over-flag." Some duplication.
**EVIDENCE.** SKILL §Discipline (lines 74–77) vs §Step 1 line 34 vs §gate line 31.
**FIX.** Merge "Flag, don't mangle" into Step 1 (where it already half-lives) and keep §Discipline to the two genuinely-new points (minimal-change scope-control + the longer/rigid trade-off). Saves ~1–2 lines.

### 6.4 What does NOT need to move out — justified weight
**PROBLEM.** None — the word lists, EARS templates, the gate, the worked example, and the membership test all belong in an always-loaded working skill. (Indeed Axis 1 argues the word lists should be *bigger*.) The always-loaded weight is justified for a skill you invoke to *do* the work line-by-line.
**FIX.** None.

**AXIS 6 SUMMARY.** Modest removable bloat: the duplicated checkable-forms menu (also an Axis-5 fix), thrice-stated gate, and §Discipline overlap. Removing duplication would *shrink* the file while *strengthening* sibling reuse — these fixes are aligned, not in tension. No core method should move out; if anything the dictionaries should grow.

---

## AXIS 7 — IO / CONSUMERS

### 7.1 Declares its own IO — YES (strength)
**PROBLEM.** None. SKILL lines 18–20 declare Inputs / Output / Consumed-by, matching the sibling house style. Good.
**FIX.** None.

### 7.2 Change report names the consumer of flagged-irreducible items — PARTIALLY
**PROBLEM.** The skill says irreducible items get FLAGGED "for the author (or route it to a decision step)" (Step 5) and the Consumed-by line names "the doc's author; or skill-builder / system-designer." But the change report's FLAGGED list (line 72) does NOT, per-item, say WHO acts on it or WHAT happens next. A flagged item is a dangling obligation unless the report assigns it. Contrast system-designer's typed `{sound, failing_gaps}` which names the consumer (the engineer).
**EVIDENCE.** SKILL line 72: "plus the list of FLAGGED-irreducible items." No owner/disposition field per flagged item.
**FIX.** Give each flagged item a disposition field: `{span, why-irreducible, routed-to: <author | decision-step:<name>>, what-resolves-it}`. Then a flagged item is a tracked handoff, not a shrug. This also closes the Axis-4.5 orphan (failed acceptance) if you route those too.

### 7.3 Does every emitted field have a consumer? — the change report's `why` field
**PROBLEM.** Minor. The change report emits `{span, smell, classification, rewrite, why}`. Who reads `why`? Presumably the author, to approve/contest the change. That's plausible but unstated. skill-builder's rule ("drop any field no named consumer reads") applied to the mechanizer's own output would ask this.
**EVIDENCE.** SKILL line 72.
**FIX.** One clause: "(the author reads `why` to accept/contest each change)." Trivial, but it's the discipline the skill imports.

**AXIS 7 SUMMARY.** IO declaration is present and correct (strength). The gap is downstream: flagged-irreducible items and failed-acceptance items lack a per-item disposition/owner, so the report can emit dangling obligations. Add a routed-to / what-resolves-it field per flagged item.

---

## VERDICT

**MAJOR-REVISE.** (Not rebuild: the method shape is sound, the boundary is correct, the IO is declared, the gate is correctly placed, and the worked example largely works. Not keep: the skill fails its own central test in several places and silently drops dictionary content it needs to be usable.)

The defects cluster into three fixable buckets:
1. **Self-consistency (Axis 3)** — the skill uses its own banned words (`genuinely` ×3 load-bearing, `usually`, `clear`, `gratuitously`, `if it matters`), ships compound/negative-only instructions, a membership test with self-attesting lines, and a flagship example whose third rewrite isn't verifiable and never shows the gate returning FALSE.
2. **Dictionary lossiness (Axis 1)** — INCOSE R16/R26 absolutes have no home; ~15+ concrete vague words and the EARS singularity-count are dropped; example-normalization is missing.
3. **Claimed-but-fake reuse (Axis 5)** — duplicates skill-builder's checkable-forms menu and verdict-last rule instead of referencing them; two handoff seams lack triggers.

### The single most important change
**Make the skill pass its own Step 4 acceptance test on its own prose** — purge `genuinely`/`usually`/`clear`/`gratuitously`/`if it matters`/the unpinned `it`, split its compound Step-5 instruction, convert its membership-test lines to falsifiable outcome checks, and fix the worked example's unverifiable "omits background the reader already has" while adding a FALSE-returning case. A skill whose product is "remove vague language" has no standing to ship vague language; until it eats its own dog food, every other strength is undercut. Everything else (bigger word lists, real sibling references, the temporal-classification home) is secondary to that credibility gate.
