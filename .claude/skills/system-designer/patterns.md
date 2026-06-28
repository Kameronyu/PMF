# system-designer — patterns (runtime loops)

The loop/escalation patterns referenced by workflow step 4. Each is written out fully; the Sources list is provenance only.

---

## THE CLOSER (escalation) — for a required field that sometimes can't be filled
**Problem:** a required field comes back blank on the first pass (a lookup failed). Hard-failing the run is wrong; shipping a blank is wrong.

**Spec:**
1. **Gate** at the edge detects the unfilled field — a real predicate (`field is empty / failed its membership test`), not "looks done."
2. On blank, hand the failing artifact to a **Closer** — same system prompt, sole job: fill this ONE field by any means. The handoff carries the FULL prior context plus a structured retry note: `{failed_field, why_it_failed, approaches_already_tried:[...]}`.
3. The Closer is **persistent but bounded**: *"Do not end your turn until `<field>` is filled or you have demonstrably exhausted every available approach."* "Exhausted" = a concrete budget (N attempts or N tool calls), never the model's discretion.
4. The Closer must be **tool-grounded** — fill via lookups/searches/tools, NOT by re-reasoning from priors. (A model re-thinking alone is an unreliable self-corrector; external tools are what make correction real.)
5. **Two outcomes, declared per field up front:**
   - **HARD** (load-bearing field) → on exhaustion, HALT the run with `BLOCKED:<field>`.
   - **SOFT** (non-critical field) → on exhaustion, LOG what was tried and CONTINUE, with the field marked `unresolved, attempts:[...]`.
6. **Each failed attempt becomes structured memory** appended to the retry note, so attempt N+1 is sharper than attempt N — a written lesson ("tried X via Y, got nothing because Z"), not a blind re-roll. You choose how much prior-attempt context to carry (last attempt only vs. all attempts). Three roles drive the loop: produce the attempt → evaluate the failure → write the lesson that conditions the next attempt.

Paste-in retry note:
```
RETRY for <field>:
  past_output: <the prior value that failed the gate — re-injected so the Closer sees exactly what to beat>
  why_it_failed: <what the gate saw>
  approaches_already_tried:
    - {approach, tool, result}
  budget_remaining: <N attempts / N tool calls>
  on_exhaustion: HARD(halt) | SOFT(log+continue)
```
Encapsulate the whole loop behind one interface: the outer pipeline only ever sees `field filled` or `field exhausted`.

---

## THE RELATIVE-EVIDENCE QUICK-PASS — for "is this roughly unique / how common is X?"
**Problem:** a uniqueness/prevalence question can't be a hard absent/present gate at a pre-search step, and over-engineering it wastes budget — but asserting "unique" from priors is the failure to avoid.

**Spec:**
1. Spawn **3–5 mini-search workers** (a small fixed sample budget) — an orchestrator dispatches them, each gathers one slice of *relative prevalence* in the product category ("roughly how many things out there use this mechanism for this job").
2. Return **counts / "relatively rare vs. common,"** NOT a binary "nobody does this." This INFORMS; it does not gate/kill.
3. **Aggregate by convergence** across the 3–5 passes (trust the agreed estimate over any single run) — the passes must be INDEPENDENT (different queries/sources); convergence among non-independent runs just counts the same answer twice. Emit `prevalence: {estimate, basis, confidence}`.
4. Default any uniqueness verdict to `PROVISIONAL` until this pass runs; never write "unique" from the model's own knowledge — absence-of-knowledge is not absence-of-competition.

---

## NAMED LOOP PATTERNS (vocabulary to reach for)
- **Evaluator–Optimizer:** one step generates a candidate; a SEPARATE step evaluates it against EXPLICIT criteria; on reject, the feedback is fed back and the candidate is regenerated — loop until the evaluator approves or a max-iteration cap hits. Use when a human could articulate the feedback and a model can apply it. (The Closer is an evaluator-optimizer where the evaluator is the gate.)
- **Orchestrator–Workers:** a central step breaks work into subtasks decided at runtime, delegates to worker steps, and synthesizes their results. Use for gathering/analyzing from multiple sources (the quick-pass is an instance).
- **Prompt-chaining with gates:** fixed steps with a programmatic check ("gate") between them; the gate catches a bad intermediate before it propagates (this is where the Closer attaches).
- **Voting:** run the same step several times and aggregate (majority / convergence) for a cheap confidence boost on a noisy call — only meaningful when the runs are independent/diverse (vary the query or seed), else you're counting one answer repeatedly.
- **Sectioning:** split "answer" and "screen/verify" into two steps/agents — measurably better than one model doing both (the architectural basis for one-job-per-step).

---

## BOUNDED NON-TERMINATION (applies to every loop above)
No loop runs unbounded. Every retry/escalation/voting loop carries an explicit bound — a max-attempts / max-iterations count OR a tool-call budget — plus an explicit definition of "done" or "exhausted." Pair persistence ("keep going until resolved") with a stop condition every time; "try harder" without a budget is how you get an infinite loop. Operationalize "exhausted every approach" as a concrete number + the structured attempt log, never the model's judgment alone.

---

## SOURCES (provenance only — you do not need to open these)
- Closer hard/soft + failed-output-plus-instruction injection: DSPy Assert/Suggest (mechanism; the API itself is deprecated — use current equivalents)
- Episodic memory of failures fed to the next attempt: Reflexion (arxiv.org/abs/2303.11366)
- Self-correction must be tool-grounded, not priors: CRITIC (arxiv.org/abs/2305.11738)
- Same-prompt produce-then-repair is sound: Self-Refine (arxiv.org/abs/2303.17651)
- N-sample convergence: Self-Consistency (arxiv.org/abs/2203.11171)
- Evaluator-optimizer, orchestrator-workers, gates, voting, sectioning, "include stopping conditions": anthropic.com/engineering/building-effective-agents
- Persistence phrasing bounded by a tool-call budget: OpenAI GPT-5 prompting guide
