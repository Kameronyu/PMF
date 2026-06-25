# system-designer — reference (contracts, lanes, provenance, hygiene, determinism)

Detail for steps 2, 3, 5, 6 of the workflow. Everything needed to APPLY a rule is inline; the Sources list at the end is provenance only. For the runtime loop patterns (Closer, quick-pass, evaluator-optimizer) see `patterns.md`.

---

## IO CONTRACT (step 2) — the typed handoff
Every edge in the DAG carries a contract. Paste-in template per step:
```
STEP: <name>   (one job-type)
INPUTS:        <only what THIS step needs to decide — the minimal clean slice>
OUTPUT SCHEMA: <typed fields; each field below names its consumer>
  - <field>: <type>   -> consumed by: <downstream step(s)>
PRODUCES-FOR:  <the named consumers; a field with no consumer is DROPPED>
DECIDES-ONLY:  <what this step owns>
MUST-NOT-DECIDE: <one-line reject list — see lanes>
```
Two rules that prevent the common contract failures:
- **Every emitted field names a consumer or is dropped.** Unconsumed fields are interpretation surface for the next agent and dead weight in context.
- **Metadata vs. state:** what the model *decides* and hands forward (a `reason`, a `priority`, a `summary`, a chosen value) is small typed METADATA; durable application state travels out-of-band (a store/context object the orchestrator passes), not stuffed into the model's message. Keep the model-generated payload small and typed.

### C1 — a multi-mode field needs a selection rule (reducers)
If a field can arrive in more than one mode (`OPEN|ASSERTED`, draft|final) or from more than one writer, declare HOW it resolves — don't leave it to chance. Borrow the "reducer" idea: every field states its merge rule —
- `overwrite` (last writer wins — the default for scalars),
- `append` (accumulate — lists/logs; dedupe by id),
- `custom(rule)` (e.g. "ASSERTED only if a source is present, else stays OPEN").
And enforce per-mode constraints: `OPEN` ⇒ value empty; `ASSERTED` ⇒ `source` required. A validator rejects a mode/constraint mismatch.

---

## LANES (step 3) — sectioning and scope
**Sectioning:** the step that PRODUCES a value must not also be the step that JUDGES/SCREENS it — a separate checker measurably outperforms one model doing both. So a "generate" step and a "screen against policy/criteria" step are two lanes, two agents.
**Scope each step three ways:** role (one job), tools (only the tools the job needs), and write-permission (write only to its own outputs; read-only to everything else). Tool/permission scoping enforces a lane structurally — stronger than a prose "stay in your lane."
**Reject-list (the one place a negative earns its keep):** give each step a one-line list of decisions it must NOT make — a winning angle, a validation threshold, a downstream label, a profitability call. Phrase it as a boundary, place it at the end of the step's prompt. Emit **ranked candidates with gate verdicts**, never a single committed pick, when selection belongs downstream.

---

## PROVENANCE ACROSS HANDOFFS (step 5)
A value must not arrive looking more certain than it left. The single-FIELD provenance shape — the `source` enum, the verbatim `evidence_quote`, the required-field/strict-output rule, and the citations-vs-strict-JSON caveat — is authored once in `skill-builder` (rule C2); apply it to each field. This skill adds only what is specific to HANDOFFS:
- **Spans stay checkable downstream.** Carry each fact's id + verbatim span forward so a later step can re-confirm by script that the quote still appears in the cited source — no model call needed.
- **C3 — caveats must be typed fields, not prose.** `status: unproven|proven`, `assertion_unvalidated: true`, `confidence: low|med|high`. Prose qualifiers get reworded or dropped at the next hop; a typed field the next gate is required to read survives. Any abstraction carries its literal anchor alongside: `{literal: <verbatim>, abstracted: <climb>, approved_by: <operator|—>}` — never ship the abstraction alone across a handoff.

---

## INPUT / OUTPUT HYGIENE (D2)
- **Minimal clean input per step.** Give a classifying step only the decision-relevant slice. Strip HTML/boilerplate/scaffolding in a SCRIPT first (deterministic, cheap) — models lose little accuracy on stripped content and you cut interpretation surface. Recipe: a main-content extractor (trafilatura-style) first; fall back to HTML→markdown for structure-sensitive docs; regex/tag-strip last. Caveat: over-cleaning strips signal — tune the balance. If input is noisy, a step flags `dirty_input` rather than classifying through it.
- **Filter the handoff.** When passing history/context forward, strip what the next step doesn't need (e.g. tool-call noise) — pass the slice, not the transcript.
- **Fence untrusted/data regions.** When a step's prompt mixes instructions with data or quoted content, wrap the data in explicit delimiters and treat it as untrusted (it must not be read as instructions) — a concrete transformation, vs. the vague "be careful with input."
- **Agent-as-a-function.** Prefer invoking a scoped step as a typed function: it takes typed inputs, returns a typed result, and control returns to the caller — it can't wander out of lane or mutate shared state. Reserve free-roaming "agent" behavior for steps that genuinely need dynamic self-direction.

---

## DETERMINISM (step 6) — one command, reproducible
- **Fixed DAG, not a self-planning agent.** Lay out the steps and edges explicitly. A deterministically expanded pipeline (template/DAG) beats an LLM that re-invents the plan each run.
- **Idempotent steps:** same input → same output, no side effects, safe to re-run. This is what makes retries and partial re-runs safe.
- **Deterministic work in scripts BETWEEN the LLM calls:** cleaning, counting, foreign-key checks, substring/provenance checks, schema validation — all code, not tokens. Keep judgment in the LLM step; keep verification and plumbing in scripts.
- **Use the right tool for orchestration:** a real runner (Make/Prefect/Dagster-style) gives you scheduling, retries/backoff, and re-runs; an LLM-graph framework is for the in-step branching logic, not for being your scheduler — don't rely on it for retry/backfill it doesn't provide.

---

## GATED EXAMPLE — a 2-step handoff (shows a contract failing)
```
STEP find_competitors  (job: gather)
  INPUTS: bet_brief.territories (clean list)
  OUTPUT:
    - brands: [ {name, url, source:traces_to:<query>} ]  -> consumed by: classify_space
  MUST-NOT-DECIDE: bet_type, winner            # that's classify_space's / market-sel's lane
STEP classify_space    (job: classify)  [separate lane from gather]
  INPUTS: find_competitors.brands (name+url only — minimal slice)
  OUTPUT:
    - per_brand: [ {brand, bet_type, source, evidence_quote} ] -> consumed by: market_selection
```
PASS: every field names a consumer; gather and classify are separate lanes; `bet_type` carries `evidence_quote`.
FAIL the gate catches:
```
  per_brand: [ {brand, bet_type:"novelty", source:agent_inference, evidence_quote:""} ]
  => BLOCKED: per_brand.evidence_quote  (classification with no verbatim trigger — A2 / provenance)
```

---

## SOURCES (provenance only — you do not need to open these)
- Typed handoffs, metadata-vs-state, input filtering, agent-as-tool: OpenAI Agents SDK handoffs docs
- Reducers / typed state channels (overwrite/append/custom): LangGraph State docs
- Sectioning, routing, separation-of-concerns, the "gate" between steps: anthropic.com/engineering/building-effective-agents
- Scoped role/tools/write-permission: Google ADK multi-agent patterns
- Provenance / verbatim spans, FullCite "each claim → id + span": Anthropic Citations API; citation-enforced RAG literature
- Required schema fields / strict outputs / citations-vs-JSON conflict: platform.claude.com/docs (structured outputs, citations)
- HTML/boilerplate stripping before the classifier: trafilatura / clean-html-for-llm
- Idempotent DAG, deterministic template expansion, runner-vs-graph-framework: Prefect/Dagster practice; "Prompt2DAG"
