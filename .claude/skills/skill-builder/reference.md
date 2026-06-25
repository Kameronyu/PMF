# skill-builder — reference

Detail for the procedure in `SKILL.md`. Open this when you need the exact mechanism, a paste-in template, the worked example, or the sources. **Everything needed to APPLY a rule is written out here; the Sources list at the end is provenance only — you never need to open a URL to use this skill.**

---

## A1 — every judged field needs a membership test
A definition *describes* a category; it doesn't *discriminate*. An untrained agent can't run a paragraph as a filter, so it stamps the nearest token. Replace the definition with a fillable template + a yes/no test.

Paste-in, per judged field:
```
FIELD: <name>
MUST FILL: <the exact shape, e.g. "FROM <prior state> TO <new state>">
ALLOWED VALUES: <closed list, if the field is categorical>
MEMBERSHIP TEST (all YES or the value is the wrong category — relabel, do not emit):
  - <question 1 that can return false>
  - <question 2 ...>
```
Worked: a "transformation" field whose test is `Q1 fills FROM x TO y? Q2 the after-state describes the buyer, not the product/object? Q3 maps to a felt change?` rejects an object-label like `novelty-object-own` by shape — no "don't emit object labels" rule needed.

**Verify in isolation.** When you check a drafted value, answer its membership questions in a SEPARATE step from the one that produced the value — if the model grades in the same breath it generated, it defends its draft. Portable shape:
```
CLAIM: <value> is a <category>.
TEST: <the defining yes/no question>
ANSWER (yes/no): __
EVIDENCE: __
```
Run TEST without the original reasoning in view.

**Strongest form — enum.** Make the field a closed list; a value outside it can't be chosen. If you control decoding, a schema `enum` masks invalid tokens at generation time. If you DON'T (a plain prompt), reproduce the effect: put the closed list in the prompt and require the agent to ECHO the chosen value verbatim from that list — reject anything not character-for-character on the list.

---

## A2 — each classification cites its trigger
Per judged field:
- `source` ∈ `{operator_verbatim | traces_to:<input_id> | kb:<cite> | agent_inference}`
- `evidence_quote`: a **verbatim substring** of the named input (where the value should come from input). If you can't quote it verbatim, you may not assign the label.

The substring rule is MECHANICAL — a script confirms the quote literally appears in the source, no second model call. If you do use a model-judge to check support, have it return `{is_valid: bool, reason: str}` and feed `reason` back as the retry message.

Also **name the inputs that decide each classifier.** Not "read it and decide the niche" but "decide the niche from {copy identifiers, people depicted, exclusions, gathering venue}." The agent classifies from named signals, not vibes. Rule of thumb for any emitted fact: it carries an id + a verbatim span from its source.

---

## A3 — examples must pass the gates they teach
Few-shot examples set behavior more strongly than rules (2–3 demonstrations beat a zero-shot rule statement for format/classification; the label space shown in the demos drives behavior). So every example VALUE in the prompt must satisfy its own membership test, annotated with the gate it passes. Audit your examples as if they were agent output — a demo that conflates feature/mechanism installs that conflation. Pair every example with the rule it shows, and every rule with an example.

---

## B1 — a count gate needs a per-item predicate
"Produce N items" is satisfiable with N hollow items. Pair every count with a per-item predicate a script can check, and DERIVE the count from the rows that passed:
- every row's `traces_to` id resolves to a real upstream id (foreign-key check),
- every row has its required tokens (not just prose),
- no row is a placeholder shape.

Recommended per-assertion shape (from Anthropic's `skill-creator` grading): each check is `{text: <the assertion>, passed: <bool>, evidence: <what makes it pass/fail>}`. **If an assertion is mechanically checkable, write and run a script for it rather than eyeballing it.**

---

## B2 — split "complete" into PRESENCE and SOUNDNESS
A block that only checks fields *exist* certifies hollow output as done. Split it:
```
## COMPLETENESS
### PRESENCE  (the field exists / has a value)
- [ ] <field> present
- [ ] <list> has >= N items

### SOUNDNESS  (the field passed its membership test — names the rule it enforces)
- [ ] every <judged field> passed its A1 membership test
- [ ] every <classified field> carries a verbatim evidence_quote (A2)
- [ ] every count's items each passed their per-item predicate (B1)
- [ ] no judged field is a placeholder

STATUS: emit_ready ONLY if every SOUNDNESS box is checked; else emit  BLOCKED: <field>
```
Each SOUNDNESS check NAMES the rule it enforces, so the self-critique is anchored to a contract, not "looks good." Two disciplines make the critique bite:
- **Localized feedback:** a check must name the exact field and the concrete fix, never "looks good" — a global thumbs-up can't drive a repair.
- **Critique against a named principle:** "check field X against rule A1" beats "is this good?" — the named rule is what makes the verdict falsifiable.

For fuzzy quality that resists a yes/no, use a **rubric with a hard gate**: score the draft 0–5 on each named dimension (e.g. Correctness, Completeness, Grounding) and REQUIRE a revise+rescore if any dimension is below your threshold. The revise-if-below gate is what separates this from decorative scoring.

---

## Checkable forms — what a test compiles to
A membership test or soundness check should lower to a concrete, repeatable form. Prefer a DETERMINISTIC check a script runs identically every time: `equals` · `contains` / `contains-all` / `contains-any` · `regex` · `starts-with`/`ends-with` · `is-json` / `is-xml` · a length or sentence-count bound · an edit-distance or overlap threshold · a numeric threshold — each also usable negated (`not-contains`, `not-regex`). Fall back to a model-graded RUBRIC with an explicit numeric pass-threshold ONLY when the quality is genuinely subjective (tone, on-brand) — never leave it as a bare adjective. And order a judged field so its reasoning/criteria come BEFORE its verdict (verdict last), so the verdict is earned and inspectable.

---

## C2 (applied) — provenance lives inside the field
Make `source` a REQUIRED field in the output schema so omission is a hard failure, and co-locate it WITH the value (don't bury provenance in a trailing block). A schema that keeps `value` and `source` in one typed object lets you demand provenance per field and still parse cleanly. With strict structured output, a missing `source` fails the parse. (Caveat: a native citations feature that returns system-extracted verbatim spans can conflict with strict-JSON output — for typed output, enforce your own `evidence_quote` field in-prompt instead.) This is the canonical single-field provenance shape; `system-designer` references it for provenance across handoffs rather than re-deriving it.

---

## Declare inputs / output / consumers (the single-prompt form of context hygiene)
The authored prompt should state, up top: its inputs, its output shape, and who consumes the output. Then: every emitted field maps to a NAMED consumer or is dropped. Feed the prompt only the minimal clean slice it needs to decide — strip scaffolding/noise in a script first; don't hand it downstream-only fields. Templated:
```
INPUTS: <the minimal clean slice this prompt needs>
OUTPUT:
  <field>: <type>   CONSUMED-BY: <named consumer>   # drop any field no consumer reads
```

---

## One job per prompt — detail
Producing and verifying are different jobs; a separate checker outperforms one agent self-grading. For a single prompt that means: don't let the prompt that produces a value also grade it — push verification to a script or a separate checker subagent that returns a typed verdict and hands control back. The full treatment of lanes, sectioning, scoped tools/permissions, and orchestrating several agents (and when to spawn subagents vs. keep work in one context) lives in `system-designer`.

---

## WORKED EXAMPLE — before / after (gated; demonstrates the gate returning FALSE)
**Before** (label with no discriminator — nothing can reject a wrong value):
```
category: <classify this item's category>
```
**After** (positive target + membership test + evidence; a PASSING object):
```
category:
  value: "B"                                   # MUST be one of the enum: A | B | C
  source: traces_to:item_text
  evidence_quote: "ships in 24 hours"          # must be a verbatim substring of item_text
  checks:
    - {text: "value is one of [A,B,C]", passed: true, evidence: "B is in the list"}
    - {text: "evidence_quote is a verbatim substring of item_text", passed: true, evidence: "found at char 41"}
    - {text: "category B requires a shipping-speed cue", passed: true, evidence: "'ships in 24 hours'"}
```
**A FAILING object the gate catches** (proof the test can return false):
```
category:
  value: "B"
  source: agent_inference
  evidence_quote: ""                           # nothing quoted
  checks:
    - {text: "value is one of [A,B,C]", passed: true,  evidence: "B is in the list"}
    - {text: "evidence_quote is a verbatim substring of item_text", passed: false, evidence: "empty — no trigger in source"}
=> BLOCKED: category.evidence_quote            # not emit_ready
```
Completeness SOUNDNESS line: `[ ] category.evidence_quote is a verbatim substring of item_text`.

---

## WHAT "A SCRIPT" LOOKS LIKE
A validator is a small program that answers the SOUNDNESS checks true/false — the LLM never self-grades the mechanical parts:
```python
# check_soundness.py — reads one output object, enforces the contract
import json, sys
obj = json.load(open(sys.argv[1])); problems = []
# A1 / enum: value in allowed set
if obj["category"]["value"] not in {"A", "B", "C"}:
    problems.append("category.value not in enum")
# A2: evidence_quote must be a real substring of the source
src = obj.get("item_text", ""); q = obj["category"].get("evidence_quote", "")
if not q or q not in src:
    problems.append("category.evidence_quote not a verbatim substring of source")
# B1: count + per-item predicate
seeds = obj.get("comparable_seeds", [])
if len(seeds) < 3:
    problems.append("fewer than 3 seeds")
for s in seeds:
    if not s.get("why_it_fits"):
        problems.append(f"seed {s.get('id')} has empty why_it_fits")
print("emit_ready" if not problems else "BLOCKED:\n- " + "\n- ".join(problems))
```
When a real, tailored validator exists, put it in `skills/skill-builder/scripts/check_soundness.py`.

---

## POSITIVE-OVER-NEGATIVE — the evidence behind step 6 (with caveats)
Specify what the output MUST be, not a list of what to avoid:
- Three major vendor guides (Anthropic, OpenAI, Google) independently say "say what to do, not what not to do" — reframing forces the specificity that produces good output.
- A "do not X" can RAISE the odds of X (to obey it the model must activate X), and it worsens as surrounding context grows — shown mechanistically in the 2025 "White Bear" study. *(Preprint — directional, not yet peer-reviewed.)*
- Every constraint line costs accuracy and buried constraints get dropped ("Lost in the Middle": U-shaped position effect; Chroma "Context Rot": a long input degrades accuracy well before the window limit, ~8% from length alone).
- The positive lever is where a measured win exists: a constrained/enum output cut one reported error rate 14%→2%.

When a negative is genuinely needed (a hard safety/boundary attractor): make it absolute, specific, ONE line, at the END; phrase it as a descriptive boundary ("X does not …") rather than an imperative "DO NOT."

*Provenance ethic applied to ourselves:* "a membership test is a positive boundary, not a negative" is our synthesis, not a cited result; "one line" is inferred from the context-length findings, not directly measured.

---

## SOURCES (provenance only — you do not need to open these to apply the rules above)
- Membership test / verify-in-isolation (Chain-of-Verification): arxiv.org/abs/2309.11495
- Verbatim-substring citations + llm_validator {is_valid, reason}: python.useinstructor.com/concepts/semantic_validation/
- `{text, passed, evidence}` assertion shape + "write the script, don't eyeball it": github.com/anthropics/skills (skill-creator)
- Constrained decoding / enums (FSM token-masking): github.com/dottxt-ai/outlines
- Localized self-feedback (Self-Refine): arxiv.org/abs/2303.17651
- Critique against a named principle (Constitutional AI): arxiv.org/abs/2212.08073
- Co-locate value+source in one typed object (BAML schema-aligned parsing): github.com/BoundaryML/baml
- Required schema fields / citations-vs-strict-JSON conflict: platform.claude.com/docs (structured outputs, citations)
- Sectioning / one-job-per-agent: anthropic.com/engineering/building-effective-agents
- Positive-over-negative: Anthropic/OpenAI/Google prompt guides; "White Bear" arxiv.org/abs/2511.12381; Chroma "Context Rot"; "Lost in the Middle" arxiv.org/abs/2307.03172
