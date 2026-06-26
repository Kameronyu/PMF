---
status: authoritative
role: Short preamble that points any build session at the Standard + Register.
read-with:
  - standards/SPEC-marketing-soundness.md
  - standards/marketing-rule-register.md
supersedes: []
---

> **What this is:** the 'read first' wrapper for build sessions. **Read by:** any session building a skill/agent, or running the system-design pass.

# Builder Directive — Marketing Soundness (read first)

Hand this to **any session that builds a skill/agent in this pipeline, or that runs the final system-design pass.** It is a pointer, not the substance: the substance lives in `SPEC-marketing-soundness.md` (the Standard) and `marketing-rule-register.md` (the Register). This directive exists so a session with no prior context still builds to the Standard.

It carries only the six marketing-soundness decisions (C2, C3, C5, C6, C7, C8). It does **not** govern prompt-mechanization (C1) or field continuity (C4) — those are separate sessions.

## Step 0 (every build session)
Read `SPEC-marketing-soundness.md` and `marketing-rule-register.md` before writing anything.

## If you are building an agent  — [SKILL-BUILDER]
For each **load-bearing marketing judgment** the agent makes (any call that changes a downstream decision if wrong):
1. **Ground it.** Write in the emit-contract `{verdict, grounding_ref, grounding_quote, application}`, and give the agent the grounding-index (Register + DR-law) it may cite. Where no authority fits, the agent makes its best call, marks it `UNGROUNDED`, and passes it up.
2. **Carry risk.** Write in the `carried_risks[]` contract and include this clause verbatim: *"Carry forward, in your output, every risk or caveat that could change a decision made on your output. State it where the decision-maker will see it. Resolve a risk only by addressing it — never by dropping it."* A blank input, an UNGROUNDED call, a CANNOT-EVALUATE check, and a low-n value each become a carried-risk entry.
3. **Report checks as `PASS | FAIL | CANNOT-EVALUATE`**, and emit counted/scored/staged values as `{value, n, low_n}`.

## If you are running the final system pass — [SYSTEM-BUILDER]
1. **Propagate risk.** Wire every consuming stage to read the incoming `carried_risks[]`, resolve what it can (recording how), and re-emit the rest, so the union reaches the operator at each ★ gate.
2. **Own the Register + grounding-index.** Route every UNGROUNDED/interpretive call to the operator for review; fold ratified calls back into the Register as new rule-IDs so the next run cites them.
3. **Confirm** each ★ operator gate displays the carried-risk union.

That is the whole directive: read the Standard + Register, implement the grounding and carry contracts, and (system pass) wire propagation and own the Register. The Standard is authoritative; this guarantees you read it.
