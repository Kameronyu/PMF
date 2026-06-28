# Engineering-Skill Design Spec
### The locked decisions + prior art that the two skills are built from
This is the bridge artifact. It turns the 12 failure modes (see `prompt-design-failure-modes.md`) into **positive-spec design rules**, attaches the **prior-art pattern** to lift for each, and assigns each rule a **home skill**. Two skills get authored from this:

- **`system-designer`** — how to architect a multi-step / multi-agent pipeline (contracts between steps, lanes, escalation, provenance, deterministic orchestration).
- **`skill-builder`** — how to write a *single* agent prompt/skill so its output is mechanically verifiable.

---

## 0. THE CORE PRINCIPLE (both skills open with this)
> Wherever a prompt asks an agent to **judge or label**, do not give it a name + a definition and trust recognition. Give it a **positively-specified target** — a fillable template plus a membership test — and make it **emit the proof** that the value passed.

Everything below is a special case. "Complete" must always mean "passed its gates," never "is non-empty."

---

## 1. DESIGN DECISION — positive specification is the primary lever
**Call (locked):** Specify what the output **must be**, precisely, with a fillable template and a membership test. Add a negative / "out-of-lane" constraint **only** where there is a strong, documented failure-attractor the positive spec won't deflect; keep it to **one line**; place it at the **end** of the prompt.

**Why (evidence, not opinion):**
- Vendor consensus is unanimous: Anthropic, OpenAI, and Google prompt guides all say "tell the model what to do, not what not to do," with near-identical reframing examples.
  - Anthropic: https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/claude-4-best-practices
  - OpenAI GPT-4.1 guide (rigid "must/never" rules induce adverse effects; fix with a positive escape clause; end-of-prompt instructions win conflicts): https://cookbook.openai.com/examples/gpt4-1_prompting_guide
  - Google Gemini guide (vague negatives like "do not infer" cause over-indexing; place a needed negative as the final line): https://ai.google.dev/gemini-api/docs/prompting-strategies
- Mechanistic evidence that "do not X" can **amplify** X, worsening under context load — "White Bear: Ironic Negation in Transformer Models" (2025): https://arxiv.org/abs/2511.12381
- Every constraint line has an accuracy cost; buried constraints get dropped — "Context Rot" (https://research.trychroma.com/context-rot) and "Lost in the Middle" (https://arxiv.org/abs/2307.03172). Multi-constraint benchmarks flag negation as a hard category and show compliance falling past ~10 constraints.
- The positive lever is where the measured win is: constrained/enum outputs cut one reported error rate 14%→2%. Spec-driven development frames this as "acceptance criteria give the agent and its verifier something checkable."

**Operating rule for the skills:** membership tests, completeness predicates, and schema constraints are **positive specification**, not negatives. Reserve true "do-not" lines for attractors (the model's pull toward picking a winner, hedging, over-emitting) — one line, at the end.

---

## 2. THE TWO SKILLS — division of labor
| Concern | `system-designer` | `skill-builder` |
| --- | --- | --- |
| Scope | the pipeline / many agents / handoffs | one agent prompt / one SKILL.md |
| Owns rules | C1, C2, C3, D1, D2 + the Closer (B3) and Quick-Pass (B4) patterns + orchestration determinism | A1, A2, A3, B1, B2 + provenance *inside* one output (C2 applied) |
| Output | an IO-contract + DAG + lane map for a system | a single verifiable prompt with a completeness/soundness block |
| Shared | the Core Principle (§0) and the positive-spec rule (§1) appear in both, briefly, with a cross-reference |

Provenance (C2) is shared: `system-designer` enforces it *across handoffs*; `skill-builder` enforces it *within one field*. Write it once in `skill-builder`, reference from `system-designer`.

---

## 3. RULE CATALOG — each failure → positive-spec rule → prior art to lift → home

### A1 — Typed slot needs a membership test  → `skill-builder`
**Rule (positive):** Every judged field declares a fillable template + a yes/no membership test that can return false. Example for a state-change field: must fill `FROM <prior state> TO <new state>` describing the *subject*, not the object; if it can't fill, it's the wrong category — relabel.
**Lift:** Chain-of-Verification per-item template "CLAIM / TEST / ANSWER(yes-no) / EVIDENCE," answered in isolation from the draft (https://arxiv.org/abs/2309.11495). Closed-list **enums** as the strongest membership test (Outlines: https://github.com/dottxt-ai/outlines; strict structured outputs). Spec-driven acceptance criteria.

### A2 — Cite the evidence that triggered a classification  → `skill-builder`
**Rule:** Every classified field carries an `evidence_quote` that must be a **verbatim substring** of the named input; no quote → no label. Name, per classifier, *which inputs* decide it.
**Lift:** Instructor exact-citations + `llm_validator` returning `{is_valid, reason}` (https://python.useinstructor.com/concepts/semantic_validation/). "FullCite": every claim → doc-id + verbatim span (https://arxiv.org/html/2603.14170v1). Anthropic Citations API for system-extracted spans (https://platform.claude.com/docs/en/build-with-claude/citations) — note: native citations conflict with strict-JSON, so for typed output use a prompt-enforced verbatim-quote field instead.

### A3 — Examples must pass the gates they teach  → `skill-builder`
**Rule:** Every in-prompt example visibly passes the same membership tests the agent must apply; annotate the example with the gate it passes. Audit examples as if they were agent output.
**Lift:** OpenAI GPT-4.1 guide — "ensure any behavior shown in examples is also cited in your rules," and vice-versa (https://cookbook.openai.com/examples/gpt4-1_prompting_guide).

### B1 — Count gate needs a per-item quality predicate  → `skill-builder`
**Rule:** Every "produce N items" pairs with a per-item predicate a script can check; the final count is **derived from rows that passed**, never asserted. Predicates: FK references resolve, required tokens present, no placeholder shapes.
**Lift:** CoVe per-item verification loop. skill-creator's `{text, passed, evidence}` assertion triple + "if it can be checked by a script, write the script, don't eyeball it" (https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md).

### B2 — Presence ≠ soundness; split the completeness block  → `skill-builder`
**Rule:** The completeness block has a **PRESENCE** section (field exists) and a **SOUNDNESS** section (field passed its gate). Artifact is not `emit_ready` until SOUNDNESS passes; on failure emit `BLOCKED: <field>`, not a green check. Each soundness check references a *named rule* so the critique is anchored, not vibes.
**Lift:** Self-Refine — feedback must localize the problem + give a concrete fix (https://arxiv.org/abs/2303.17651). Constitutional-AI critique tied to a named principle (https://arxiv.org/abs/2212.08073). Rubric "score each dimension, revise if < threshold."

### B3 — A required field is sometimes genuinely unreturnable → the **Closer/Escalation pattern**  → `system-designer` (see §4)

### B4 — Negative/uniqueness with no defined corpus → the **Relative-Evidence Quick-Pass**  → `system-designer` (see §4)
**Rule (positive form):** A uniqueness/prevalence verdict must declare the set it was checked against and default to `PROVISIONAL` when that set is empty. At a pre-search step, "unique" is not assertable — emit `PROVISIONAL-UNSEARCHED`.
**Lift:** Self-consistency (sample 3–5, trust convergence: https://arxiv.org/abs/2203.11171); orchestrator-workers fan-out (Anthropic). CRITIC: don't judge from priors, ground in tool lookups (https://arxiv.org/abs/2305.11738).

### C1 — Multi-mode field needs a selection rule  → `system-designer`
**Rule:** Every multi-mode field (`OPEN|ASSERTED`, draft/final) has an objective trigger choosing the mode + per-mode constraints (OPEN ⇒ value empty; ASSERTED ⇒ source required). Validator rejects mode/constraint mismatch.
**Lift:** LangGraph **reducers** — each field declares how it merges (overwrite/append/custom) via `Annotated[type, reducer]` (https://reference.langchain.com/python/langgraph/graph/state/StateGraph). `Command(goto, update)` = route + write in one object.

### C2 — Per-field provenance/source tag  → shared (authored in `skill-builder`, enforced across handoffs by `system-designer`)
**Rule:** Every judged field carries `source ∈ {operator_verbatim | traces_to:<id> | kb:<cite> | agent_inference}`; empty source → reject; `agent_inference` → flagged. Make `source` a **required schema field** so omission is a hard failure.
**Lift:** strict structured outputs `strict:true` (https://platform.claude.com/docs/en/build-with-claude/structured-outputs); BAML schema-aligned parsing to co-locate `value`+`source` per field (https://github.com/BoundaryML/baml); Citations API as the enforced gold standard.

### C3 — Carry caveats verbatim as typed fields  → `system-designer`
**Rule:** Qualifiers (`status: unproven|proven`, `assertion_unvalidated: true`) are **typed fields, not prose** — prose gets reworded away across hops, typed fields survive. Any abstraction carries its literal anchor: `{literal, abstracted, abstraction_operator_approved}`.
**Lift:** OpenAI handoff `input_type` for typed metadata that crosses the boundary (https://openai.github.io/openai-agents-python/handoffs/); pydantic-ai validation-error-feedback-retry as the enforcement teeth.

### D1 — Explicit lane scoping (the one place negatives earn their keep)  → `system-designer`
**Rule:** Each step gets a positive role spec *and* a one-line reject list of decisions it must not make (winning angle, awareness stage, threshold, profitability) + a ban on superlative/selection words in judged fields; emit **ranked candidates**, not a committed pick. Enforce structurally via scoped tools where possible.
**Lift:** Anthropic "Building Effective Agents" — **sectioning** (a separate model screens vs. answers beats one model doing both) and routing/separation-of-concerns (https://www.anthropic.com/engineering/building-effective-agents). Google ADK scoped-role/scoped-tool/scoped-write guidance. Claude Code `allowed-tools` frontmatter as the structural enforcement.

### D2 — Input/output hygiene  → `system-designer`
**Rule:** Every emitted field maps to a **named consumer** or is dropped. Every classifier is fed the **minimal clean slice** (strip HTML/scaffolding; no downstream-only fields). Keep machine-parsed layers physically separate from judgment prose and parse-check the flat layer.
**Lift:** OpenAI `input_filter` / `remove_all_tools` + metadata-vs-state rule (handoff payload = model-decided metadata only; durable state out-of-band). trafilatura two-tier cleaning before the classifier (low accuracy risk: https://github.com/shubhamofbce/clean-html-for-llm). `Agent.as_tool` = scoped sub-agent invoked as a typed function.

---

## 4. CROSS-CUTTING PATTERN SPECS (the two mechanisms, written once, reused)

### 4A. The Closer / Escalation pattern (resolves B3)
**Problem:** A required field is sometimes genuinely unreturnable on the first pass (a lookup comes back blank). Hard-failing the run is wrong; so is shipping a blank.
**Spec:**
1. **Gate** between steps detects the unfilled field (not "looks done" — a real predicate).
2. On blank, hand the failing artifact to a **Closer** — *same system prompt*, sole job: fill this one field by any means. The handoff carries the **full prior context** + a structured retry note `{failed_field, why_it_failed, approaches_already_tried}`.
3. The Closer is **persistent but bounded**: "do not end your turn until `<field>` is filled or you have exhausted every available approach," where *exhausted* = a concrete budget (N attempts / N tool calls), never the model's discretion.
4. The Closer must be **tool-grounded** — fill via lookups/searches, not by re-reasoning from priors.
5. **Two outcomes, declared up front per field:**
   - **HARD** (field is load-bearing) → on exhaustion, **HALT** the run with `BLOCKED:<field>`.
   - **SOFT** (field is non-critical) → on exhaustion, **LOG what was tried and CONTINUE** with the field marked `unresolved + attempts:[...]`.
6. Each failed attempt becomes **structured memory** appended to the retry note, so attempt N+1 is sharper than attempt N (not a blind re-roll).
**Lift / citations:** DSPy Assert(hard-halt) vs Suggest(soft-log-continue) injecting `Past Output + Instruction`, bounded by `max_backtracks` (https://dspy.ai/learn/programming/7-assertions/ — note API deprecated, cite the mechanism, use `dspy.Refine`/`BestOfN` if implementing). Reflexion episodic-memory-of-failures (https://github.com/noahshinn/reflexion). CRITIC tool-grounded correction (https://arxiv.org/abs/2305.11738). GPT-5 persistence phrasing bounded by a tool-call budget (https://cookbook.openai.com/examples/gpt-5/gpt-5_prompting_guide). Anthropic evaluator-optimizer "gate" + stopping conditions (https://www.anthropic.com/engineering/building-effective-agents).

### 4B. The Relative-Evidence Quick-Pass (resolves/loosens B4)
**Problem:** Feature-uniqueness can't be a hard absent/present gate at a pre-search step, and uniqueness is mostly inferable — so don't over-engineer it.
**Spec:**
1. Spawn **3–5 mini-search agents** (a self-consistency budget), each gathering *relative prevalence* in the product category: roughly how many things out there use this mechanism for this job.
2. Return **counts / "relatively unique vs. common"**, not a binary "nobody does this." Non-gating: this informs, it doesn't kill.
3. Aggregate by convergence across the 3–5 passes; emit `prevalence: {estimate, basis, confidence}`.
4. Default the uniqueness verdict to `PROVISIONAL` until this pass runs; never assert "unique" from priors.
**Lift:** self-consistency (https://arxiv.org/abs/2203.11171); orchestrator-workers; evaluator deciding "are more searches warranted" (Anthropic).

### 4C. Deterministic orchestration (the "one command runs the pipeline" ask)
**Spec:** Fixed DAG of steps; each step is **idempotent** (same input → same output, no side effects, safe to re-run); deterministic work (cleaning, parsing, validation, counts) lives in **scripts between** the `claude -p` calls, not inside an LLM call. Use a real orchestrator (Make/Prefect/Dagster) for scheduling/retry/backfill; reserve graph frameworks for in-step logic.
**Lift:** idempotent-DAG practice + the honest caveat that LangGraph lacks scheduling/retry/backfill (https://arxiv.org/html/2509.13487v1 Prompt2DAG; orchestration comparisons). Anthropic workflow-vs-agent split ("workflows = predefined code paths"). skill-creator: "code in a skill provides deterministic, repeatable behavior" where token-generation is unreliable.

---

## 5. BET-BRIEF APPLICATION NOTES (the test case, per operator)
- **Loosen B4 there:** replace any hard uniqueness gate with the §4B quick-pass returning relative prevalence; uniqueness verdict ships as `PROVISIONAL` for the Finder to confirm.
- **Move D1 out:** lane-scoping is general system design — it lives in `system-designer`, referenced from the bet-brief, not hard-coded into it.
- **Split its completeness block** (B2): the current block checks fields *exist*; add the SOUNDNESS section so a mislabeled-but-present transformation can't pass its own validator.
- **Don't pick the winner:** remove "the lever the bet leads on / strongest" framing (D1 attractor); emit `candidate_differentiators[]` with gate verdicts only.

---

## 6. SKILL FORMAT (both)
Author as Anthropic Agent Skills (progressive disclosure): `SKILL.md` with YAML frontmatter (`name`, `description` carrying all the when-to-use triggers) as the always-loaded layer; lean body; bundled `reference.md` / checklist / template files loaded on demand. Spec: https://agentskills.io/ ; reference: https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md
> Install note: these files are authored here as deliverables; install them via Settings → Capabilities (they can't be registered into the environment from this session).

---

## 7. PRIOR-ART QUICK INDEX (most-liftable, by skill)
**`skill-builder`:** CoVe membership template · Instructor verbatim-substring citations · skill-creator `{text,passed,evidence}` + "write the script, don't eyeball it" · rubric-with-hard-gate · enums/strict-output · Self-Refine localized feedback.
**`system-designer`:** Anthropic "Building Effective Agents" (sectioning, gates, evaluator-optimizer, orchestrator-workers) · DSPy Assert/Suggest · Reflexion memory · CRITIC tool-grounding · GPT-5 bounded persistence · LangGraph State+reducers · OpenAI handoff input_type/input_filter · Citations API / FullCite · trafilatura cleaning · idempotent DAG (Prefect/Dagster).
