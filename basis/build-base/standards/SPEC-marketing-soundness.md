---
status: authoritative
role: The Standard for keeping marketing decisions sound (grounding C2, carry C3/C5/C6/C8, Register C7). Excludes C1/C4 by design.
read-with:
  - standards/marketing-rule-register.md
  - standards/BUILDER-DIRECTIVE.md
supersedes: []
---

> **What this is:** the marketing-soundness Standard. **Read by:** every skill-builder / system-builder session before writing prompts.

# SPEC — Marketing-Soundness Standard

**What this is.** The source of truth for keeping the pipeline's marketing *decisions* good. It defines how every agent grounds a marketing judgment and how it carries forward anything that could change a decision made on its output. It implements six decisions settled in the review/annotation session: **C2, C3, C5, C6, C7, C8**.

**What this is not.** It does not cover whether a prompt mechanically does its stated job (C1) or whether fields line up stage-to-stage (C4). Those are separate sessions (C1 = prompt-mechanization; C4 = I/O-contract + field-continuity). Do not add rules here beyond the six below.

**Audience tags** (every clause is tagged with who acts on it):
- **[SKILL-BUILDER]** — apply when building each individual agent/skill.
- **[SYSTEM-BUILDER]** — apply in the final pass that strings the agents together.
- **[RUNTIME]** — the agent produces this at run time.

The six rules are organized as **three mechanisms**: Grounding (C2), Carry (C3/C5/C6/C8), Register (C7). They interlock — Grounding decides what licenses a call; Carry moves every unresolved risk to the decider; the Register is the operator-owned list of what licenses a call.

---

## Mechanism 1 — Grounding: every load-bearing marketing judgment names the authority that licenses it (C2)

A **load-bearing marketing judgment** is any call that changes a downstream decision if it is wrong — e.g., the transformation label, a gate verdict, an angle choice, an awareness read, a believability call, a differentiator call.

**[RUNTIME]** For each load-bearing judgment, the agent states its grounding:
- `verdict` — the call it made.
- `grounding_ref` — the ID of the authority that licenses it: a **DR-law/test ID** or a **Marketing Rule Register rule-ID**.
- `grounding_quote` — the licensing text, quoted from that authority.
- `application` — one line showing how the quoted authority applies to *this* case.

**[SKILL-BUILDER]** When you build an agent that makes a load-bearing judgment, write this four-field emit-contract into its output spec, and give the agent the **grounding-index** (the Register + the mechanized DR-law set) it is permitted to cite from.

A judgment is **grounded** when its `grounding_ref` resolves to an in-force authority and its `application` shows the fit. **When the agent finds an authority that fits, it cites it. When it cannot, it sets `grounding_ref: UNGROUNDED`, makes its best interpretive call, and records that call as a carried risk (Mechanism 2) for operator review (Mechanism 3).** An agent's own reasoning becomes a citeable grounding only after the operator ratifies it into the Register.

*(Positive form to put in the agent prompt, [SKILL-BUILDER]):* "For every load-bearing call, cite the DR-law/test ID or Register rule-ID that licenses it and quote the licensing text. Where no authority fits, make your best call, mark it UNGROUNDED, and pass it up for review."

---

## Mechanism 2 — Carry: anything that could change a decision travels to whoever makes that decision (C3, C5, C6, C8)

**[RUNTIME]** Every agent output includes a `carried_risks[]` list. The agent adds an entry whenever:
- a load-bearing judgment is UNGROUNDED or interpretive → `kind: ungrounded` (C2/C7);
- a load-bearing input arrived blank or unknown → the agent proceeds with what it has **and** records `kind: blank_input` (C5);
- one of its own checks returned CANNOT-EVALUATE → `kind: cannot_evaluate` (C6);
- a counted/scored/staged value rests on thin data → `kind: low_n` (C8).

Each entry: `{risk, kind, affects_decision, source_stage, severity}`.

**The standard carry clause — [SKILL-BUILDER] put this verbatim in every agent prompt:**
> "Carry forward, in your output, every risk or caveat that could change a decision made on your output. State it where the decision-maker will see it. Resolve a risk only by addressing it — never by dropping it."

**[SYSTEM-BUILDER]** Wire propagation across the pipeline: every consuming stage reads the incoming `carried_risks[]`, resolves what it legitimately can (recording how it resolved each), and re-emits everything it did not resolve — so the union of unresolved risks reaches the operator at each ★ decision gate.

**Supporting runtime contracts:**
- **[RUNTIME]** Each check the agent runs reports exactly one of `PASS | FAIL | CANNOT-EVALUATE`. It reports **CANNOT-EVALUATE** when the rule content, corpus, or input it needs to judge is present-and-usable is absent, and records a `cannot_evaluate` risk. (C6 — CANNOT-EVALUATE is a separate outcome from PASS.)
- **[RUNTIME]** Each counted, scored, or staged value is emitted as `{value, n, low_n}`; the governing rule sets the `low_n` threshold; a `low_n: true` value also appears in `carried_risks[]`. (C8)

*Note (kept out of scope on purpose):* making inputs come up blank **less often** is an upstream-completeness/wiring matter for the C4 field-continuity session. This Standard's job for C5 is the other half — that a blank, whenever it occurs, is always surfaced as a risk to the decider rather than absorbed silently.

---

## Mechanism 3 — Register: the operator-owned source of truth for marketing rules in force (C7)

The **Marketing Rule Register** (`marketing-rule-register.md`) lists every marketing rule currently in force. It is kept **separate from the KB** — because the KB is imperfect and this is uncharted territory — and it is what agents cite by rule-ID and what keeps a validated rule from being silently dropped.

**[SYSTEM-BUILDER] / operator-owned.** Each entry: `{id, statement, grounding, status: in-force | configurable | retired, last_operator_decision}`.

- A rule **stays in force** until the operator changes its status in a logged decision. Changing a rule's status engages the rule's **soundness argument** (whether the rule is right), recorded in `last_operator_decision`.
- **Interpretive flow (the "make the call and give it to me to review" the operator asked for):** when a build session or a run meets a marketing call the KB and Register do not yet cover, it (1) makes the interpretive call, (2) carries it to the operator via `carried_risks[]` (Mechanism 2), and (3) on the operator's review, a ratified call becomes a **new Register rule with an ID** — so the next run cites it as grounding instead of re-deciding.
- **[SYSTEM-BUILDER]** The Register and the mechanized DR-law index share **one ID namespace** — a `grounding_ref` is either a DR-law/test ID or a Register rule-ID. When the DR passages are mechanized, they slot into the same namespace agents already cite, with no rework.

---

## How a fresh build session uses this Standard

**[SKILL-BUILDER] — before writing any agent:** read this Standard and the Register. For each load-bearing judgment your agent will make: write in the grounding emit-contract (Mechanism 1) and the `carried_risks[]` contract (Mechanism 2), include the standard carry clause verbatim, set its checks to the `PASS | FAIL | CANNOT-EVALUATE` form, and emit counted/scored values as `{value, n, low_n}`.

**[SYSTEM-BUILDER] — in the stringing-together pass:** wire `carried_risks[]` propagation across every seam, confirm each ★ operator gate displays the risk union, and own the Register + grounding-index (route every UNGROUNDED/interpretive call to the operator and fold ratified calls back as new rule-IDs).

`BUILDER-DIRECTIVE.md` is the short preamble that hands these two instruction sets to each build session, so a session with no prior context still builds to this Standard.

**Scope check:** this Standard implements C2, C3, C5, C6, C7, C8 and nothing else. C1 (prompt mechanization) and C4 (field continuity) are out of scope by decision.
