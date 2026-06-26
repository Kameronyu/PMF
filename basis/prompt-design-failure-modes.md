# Generalizable Prompt-Design Failure Modes
### Mined from the 4 adversarial reviews — framed as system/prompt-engineering flaws, not marketing calls
Audit target: `bet-compiler` (PMF STEP 0). Each entry is a *repeatable* way the prompt's wording lets an untrained agent pass garbage, plus the mechanical rewrite that turns the instruction into a yes/no question the output can be checked against.

---

## THE ONE ROOT CAUSE
Almost every failure the reviewers found is one move: **the prompt gives the agent the NAME of a thing and a definition, then trusts it to recognize membership — instead of giving it a TEST for membership and making it emit the proof.**

> "Look at the page and decide the niche." / "Believable mechanism — the product plausibly delivers the transformation."

These are *labels with no discriminator*. An untrained agent fills the slot with the nearest available token, the slot now has a value, and every downstream reader treats that value as true. The canonical case — `novelty-object-own` entered into a `transformation` slot — is not a marketing mistake at the prompt level; it is a **missing membership function**. The prompt never asked "is this actually a transformation?" in a form that can return false.

**The fix, generalized:** for every field the agent *judges* (not copies), the prompt must supply (a) a fillable template, (b) one or more yes/no gates with objective triggers, and (c) a required pointer to the evidence that fired the gate. "Complete" must mean "passed its gates," never "is non-empty."

The 12 failure modes below are all special cases of this, grouped by where they bite.

---

## GROUP A — Labeling without verification

### A1. Definition without a discriminator (typed slot, no membership test)
**Pattern.** A field names a category (`transformation`, `mechanism`, `niche`, `differentiator`) and defines it in prose, but supplies no operation that, given a candidate string, returns is-a / is-not-a. The agent stamps the category because the slot exists.
**Root cause.** Definitions describe; they don't discriminate. An untrained agent can't run a paragraph as a filter.
**Mechanical fix.** Gate every typed slot before it accepts a value. Example for `transformation`:
- Can it be written as `FROM <buyer's prior state> TO <buyer's new state>`? (template must literally fill)
- Does the after-state describe the **buyer**, not the **object/feature**? Y/N
- If only one value is allowed (OPEN slot), is the field empty? Y/N
- Any NO → reject; relabel as feature/object, do not emit as transformation.

Apply the same shape to `mechanism` ("complete: `<feature>` causes `<transformation>` because `<reason>`; if the BECAUSE can't be filled, it's a feature") and `niche` ("name a real venue this group convenes at for reasons other than your product; if none, it's a desire/affinity label, not a niche").
**In bet-compiler.** `transformation (OPEN|ASSERTED)`, the `mechanism (+ believability)` column, and gate item 1 ("if not, it's a feature, not a mechanism") all name the distinction and supply no test.

### A2. Classify-from-vibes (definition + blob, no named inputs, no evidence citation)
**Pattern.** The prompt hands the agent a definition and raw material, asks for a verdict, but never says *which signals* decide the call or requires the verdict to cite the exact string that triggered it. There's no audit trail proving the label came from data instead of priors.
**Root cause.** "One definition is not enough." Without named decision-inputs, two agents (or two runs) classify differently and neither can be checked.
**Mechanical fix.**
- For each classifier, **enumerate the inputs that decide it** (e.g., niche ← {copy identifiers, people depicted, exclusions, gathering venue}).
- Require every classified field to carry `traces_to: <exact source string/atom id>`. Populated label + empty `traces_to` → reject.
- This is the rule the prompt *already* applies to capability atoms ("each tied to the spec line") — extend it to **all** interpretive fields, not just atoms.
**In bet-compiler.** Atoms are traceable; the load-bearing interpretive fields (`functional_job`, `serves_niche(s)`, `transformation`) are not.

### A3. The example demonstrates the anti-pattern it should forbid
**Pattern.** Few-shot examples *teach behavior*. If the worked example does the thing the gates are meant to catch, the example installs the failure.
**Root cause.** Examples are stronger than rules; agents imitate the demo over the instruction.
**Mechanical fix.** Every in-prompt example must visibly pass the same gates the agent is told to apply, ideally annotated with the gate it passes. Audit examples as if they were agent output.
**In bet-compiler.** The Arduview walkthrough climbs a *feature* ("see-through screen") into an *object-label* ("a rare, eye-catching, WTF object") and calls the result a functional job/transformation — modeling exactly the feature→object conflation A1 is supposed to block.

---

## GROUP B — Gates that don't actually gate

### B1. Count without quality (cardinality satisfiable by filler)
**Pattern.** A completeness check enforces a number (`≥3 seeds`, `≥5 rows`, "every column filled") with no floor on whether each item *means* anything. The count goes green on hollow rows.
**Root cause.** Validators can count; they can't see meaning unless you give them a structural predicate to check.
**Mechanical fix.** Pair every cardinality gate with a per-item predicate a script can evaluate:
- `every what_the_product_enables row's traces_to_feature references a real product_features id` (foreign-key check)
- `every comparable seed's why_it_fits contains an N token, a T token, and a P token` (not prose)
- `every transformation cell contains a FROM→TO string`
- reject reserved placeholder shapes (bare nouns, `-own`, `-object`) in judged columns.
**In bet-compiler.** COMPLETENESS is pure cardinality; "every column filled" passes on confident filler.

### B2. Presence ≠ soundness (completeness checks existence, not validity)
**Pattern.** A "machine-checkable" completeness block certifies that fields *exist*, and that certificate is then read as "the brief is good." Disclosure of a gap is treated as if it cured the gap.
**Root cause.** Two different questions — "is it filled?" vs "is it valid?" — share one checkbox.
**Mechanical fix.** Split the block into **PRESENCE** checks and **SOUNDNESS** checks. The artifact is not `emit_ready` until soundness passes:
- `[ ] every transformation cell passed the A1 gate`
- `[ ] every mechanism cell passed the A1 BECAUSE test`
- `[ ] no judged field is a placeholder`
If a soundness check fails, emit `BLOCKED: <field>` instead of a passing block.
**In bet-compiler.** The completeness block checks `transformation_slot(mode)` is present, never that its contents are a transformation.

### B3. Conjunction silently degraded to disjunction at the kill-gate
**Pattern.** The intent is "require A AND B," but the gate is written "kill only if NOT A AND NOT B" — which is logically "pass if A OR B." Having one of two required properties survives a gate meant to demand both.
**Root cause.** Negated conjunctions are easy to invert by accident when phrased as kill-conditions.
**Mechanical fix.** Never phrase gates as "neither = kill." Write each required property as its own pass-gate and AND them: `pass = gate_A AND gate_B`. Decompose bundled verdicts (e.g., a single uniqueness call that secretly covers both mechanism and niche) into separately scored gates.
**In bet-compiler.** Gate item 2 bundles transformation and niche into one "unique mechanism" verdict; a novel mechanism on an undifferentiated niche still passes.

### B4. Negative/uniqueness claim with no defined corpus
**Pattern.** A gate hinges on a negative — "others aren't already using this," "unique," "ownable" — but never names the set the negative is asserted *over*. "Unique" is unfalsifiable unless it's "unique within THIS named set," and at a step that hasn't searched yet, the set is empty.
**Root cause.** Absence-of-knowledge gets laundered into absence-of-competition. Zero observed competitors reads as "white space" when it actually means "not yet looked."
**Mechanical fix.** Force the verdict to declare its basis and default to provisional:
- `UM_basis = { brands_checked: [...] | "NONE — priors only", corpus: <KB|prior-run|none> }`
- if `brands_checked = NONE` → verdict must be `PROVISIONAL`, flagged for the downstream searcher to confirm. An unconditional "UNIQUE" at a pre-search step is not permitted.
**In bet-compiler.** STEP 0 is told to judge `unique_mechanism?` before the Finder has searched — a verdict with no corpus to check against.

---

## GROUP C — State that doesn't survive transit

### C1. Multi-mode field with no selection rule
**Pattern.** A field offers modes (`OPEN | ASSERTED`, draft/final, hypothesis/finding) but gives no trigger deciding which applies. The agent picks the better-reading mode, and a guess gets emitted as a finding.
**Root cause.** Optionality without a decision function is just "agent's discretion."
**Mechanical fix.** Replace the free choice with a keyed gate and enforce per-mode constraints:
- `if operator/KB states the value → mode = ASSERTED, source required; else → mode = OPEN, value MUST be empty.`
- validator: any ASSERTED value missing a source → reject; any OPEN row with a populated value → reject.
- name the cases the binary misses (e.g., "proven elsewhere, applied to a new context" is `ASSERTED-with-precedent`, not OPEN) so the agent stops collapsing them.
**In bet-compiler.** `transformation_slot: <OPEN | ASSERTED: <hypothesis>>` ships the modes with no selection rule — the operator's own note ("idk what an open transformation means") is this gap.

### C2. No provenance/source tag on load-bearing fields
**Pattern.** Fields that downstream gates depend on are emitted with no recorded origin, so three steps later nobody can tell an observed datum from an invented one. "Naked vs grounded" is only reconstructable by an auditor, never rejectable at the source.
**Root cause.** Provenance isn't free; if the schema has no slot for it, it doesn't exist.
**Mechanical fix.** Mandatory `source` enum on every emitted judged field: `operator_verbatim | traces_to_atom:<id> | kb_principle:<cite> | agent_inference`.
- validator: any judged field with empty `source` → reject.
- any field with `source = agent_inference` must also carry the "my call" flag (the prompt's `◆`).
**In bet-compiler.** Only `◆` exists, globally; rows carry no per-cell source.

### C3. Caveat/qualifier not carried verbatim (lossy hand-off)
**Pattern.** A load-bearing qualifier — *unproven*, *cosmetic-only*, *un-re-verified*, *OPEN* — exists at the source but isn't required to travel with the datum. A downstream reader sees the datum without its caveat and treats asserted material as proven. Worse: the abstracted form ("the screen is clear") detaches from its literal anchor and silently strengthens.
**Root cause.** Free-prose qualifiers get reworded or dropped at every hop; only structured fields survive transit.
**Mechanical fix.**
- Make qualifiers **structured fields**, not adjectives in prose: `status: unproven|proven`, `assertion_unvalidated: true`. Reworded prose can drop a caveat; a typed field downstream gates must read cannot.
- Require any abstraction to carry its literal anchor: `{ literal: <verbatim atom>, abstracted: <climb>, abstraction_operator_approved: Y/N }`. Emit-the-abstraction-only → reject.
**In bet-compiler.** CUSTODY says preserve operator words verbatim, but nothing forces the literal feature to travel beside its abstraction or a qualifier to remain a typed field.

---

## GROUP D — Boundary & context hygiene

### D1. Scope creep — the step decides what a later step owns
**Pattern.** A prompt declares "stay in your lane," but its generative core still emits a value belonging to a downstream decision (a winning angle, a confirmed-unique verdict, a validation threshold). Trigger words are superlatives and selection verbs: *strongest, the lever it leads on, best, hero, winning*.
**Root cause.** "Enumerate" and "select" blur whenever the prompt asks for *the* X instead of *candidate* Xs; selection language smuggles a decision in.
**Mechanical fix.**
- Add an explicit **out-of-lane reject list** as a validator gate: `no field may state a winning angle | an awareness stage | a validation threshold | a competitor's bet_type | a profitability/COGS call.`
- Ban superlative/selection words in judged fields; emit **ranked candidates with their gate verdicts**, never a committed pick (unless the operator pins it, flagged).
- Redefine borderline fields as capabilities, not decisions: `differentiator = strongest enabled capability` invites angle-selection; change to `candidate_differentiators: [ {enabled_job, UM_verdict, comparables_findable} ]`.
**In bet-compiler.** `differentiator: <the lever the bet leads on — the strongest enabled job>` is a winning-angle pick the operator says STEP 0 must not make; the SCOPE list forbids several things but not this.

### D2. Input/output over-feeding (context the step shouldn't have)
**Pattern.** Two directions: (a) a classifying agent is handed raw scaffolding, downstream-only fields, or positioning prose — expanding interpretation surface and inviting out-of-lane calls; (b) the step over-emits fields no named consumer reads, expanding the next agent's interpretation surface.
**Root cause.** "Give the model everything, it'll figure out what matters" — but every extra token is another thing to misread, and any field present is a field something will act on.
**Mechanical fix.**
- **Output:** every emitted field must map to a named consumer; `field with no consumer → drop`. (List the consumers in the prompt; gate against the list.)
- **Input:** hand each classifier the **minimal clean decision set** (atoms + intake + gate + cap), stripped of HTML/positioning. If input contains noise, the agent flags `dirty_input` rather than classifying through it.
- Keep machine-parsed layers physically separate from judgment prose (the prompt's Layer A / Layer B split) and parse-check the flat layer.
**In bet-compiler.** Intent is right ("emit only what downstream needs," "nothing more") but there's no per-field consumer map and no input-hygiene gate; the long DR-flavored exposition is itself extra interpretation surface.

---

## DROP-IN DESIGN CHECKLIST (apply to ANY prompt in this system)
Run each prompt through these. Every "no" is a place an untrained agent can diverge.

1. **Membership, not naming.** For every field the agent *judges*: is there a fillable template + a yes/no gate that can return false? (A1)
2. **Named inputs.** Does the prompt say which signals decide each classification, and require a `traces_to` pointer to the triggering string? (A2)
3. **Honest examples.** Does every worked example pass the gates the agent is told to apply? (A3)
4. **Quality, not count.** Does every cardinality check have a per-item structural predicate? (B1)
5. **Sound, not present.** Is "complete" defined as "passed its gates," with a separate PRESENCE vs SOUNDNESS split? (B2)
6. **AND stays AND.** Is every required property its own pass-gate, never a "neither = kill"? (B3)
7. **Named corpus for negatives.** Does every "unique / no one else / white space" verdict declare the set it's checked against, and default to PROVISIONAL when that set is empty? (B4)
8. **Mode selection rule.** Does every multi-mode field have an objective trigger choosing the mode, plus per-mode constraints? (C1)
9. **Provenance slot.** Does every judged field carry a `source`, with agent-inference flagged? (C2)
10. **Typed qualifiers.** Are caveats structured fields (not prose) and do abstractions carry their literal anchor? (C3)
11. **Lane gate.** Is there an explicit reject-list of decisions this step must not make, and a ban on selection/superlative words? (D1)
12. **Context diet.** Does every emitted field have a named consumer, and is every classifier fed the minimal clean input? (D2)

---

## Appendix — coverage map (which review surfaced what)
- **Reviewer B (grounding / thread-survival):** A1, B1, B4, C1, C2, C3, D1 — the "naked vs grounded," term-mutation-across-handoffs, and corpus-for-negatives findings.
- **Reviewer A — Collection:** A1, A2, A3, B1, B2, D1 — the `novelty-object-own`/`edc-collectors` mislabels and "audit the basis on which things are defined instead of letting an agent decide on vibes."
- **Reviewer A — Market Selection:** B1, B3, B4, C1, C2, D1 — proxy-evidence floors, softened conjunction, "judged fresh" with no anchor, scope creep (COGS/rank it shouldn't decide).
- **Reviewer A — Funnel:** A1, A2, B2, C3, D1, D2 — congruency has nothing to anchor to when the upstream term is under-specified; "light pass must not pick the winning angle"; input hygiene.
