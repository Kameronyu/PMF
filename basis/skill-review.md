# Adversarial Review — skill-builder

Reviewed: `skills/skill-builder/SKILL.md`, `skills/skill-builder/reference.md`
Against: `research-findings.md` (standard), `engineering-skill-design-spec.md` (intent, A1–D2).
Stance: harsh. Severity erring high. Critique only — no rewrites.

---

## AXIS 1 — LOSSINESS vs the research

The skill captures the *core* mechanisms but flattens several into a bare name + URL — the exact failure the research preamble warns against ("described fully enough to APPLY without opening the URL"). Mechanism-by-mechanism:

### 1.1 CoVe — reduced to a bare name; the actual template is gone
**PROBLEM:** Research (Stream 1, CoVe) gives a *liftable* per-item template — `CLAIM: <value> belongs to <category>. TEST: <defining question>. ANSWER (yes/no): __. EVIDENCE: __` — and a load-bearing discipline: **answer each verification question in isolation from the draft** (this is *why* CoVe works — it breaks the model's bias to defend its own draft).
**EVIDENCE:** reference.md B1 cites CoVe only as "Chain-of-Verification per-item loop (URL)". A1's membership template omits the CLAIM/TEST/ANSWER/EVIDENCE four-line shape and never mentions "answer in isolation." The agent gets the *idea* but not the *recipe* or the *mechanism that makes it work*.
**FIX:** Inline the four-line CLAIM/TEST/ANSWER/EVIDENCE template into A1, and add the one sentence: "answer each test in isolation from the draft value, so the model can't rationalize a wrong label." This is the single biggest how-to omission.

### 1.2 Self-verification rubric (0–5 per dimension, hard revise gate) — MISSING entirely
**PROBLEM:** A top-5-liftable mechanism (Stream 1, item 4; also Stream 4) — "score the draft 0–5 per dimension (Correctness/Completeness/Clarity/Actionability) and MUST revise+rescore if any dimension < threshold" — appears nowhere in SKILL.md or reference.md. It is named in the PRIOR ART INDEX ("rubric-with-hard-gate") but the how-to is absent.
**EVIDENCE:** Grep the skill: "rubric" appears only in reference.md line 127 as an index entry; no dimensions, no threshold, no rescore loop.
**FIX:** Add a short reference.md rule (e.g. B3) giving the per-dimension 0–5 + hard-gate-revise pattern, or fold it into B2's SOUNDNESS block as the quantitative variant.

### 1.3 Constrained decoding / enums — present but the *mechanism* is link-only
**PROBLEM:** The research explains *how* enums enforce membership: "a JSON-schema enum/regex compiles to a finite-state machine; at each token the FSM hard-masks any token that would leave the valid set... enforced at generation time, not checked after," plus the **prompt-level shadow** ("when you don't control decoding: give the model the closed list and require it to echo the chosen value verbatim from that list").
**EVIDENCE:** reference.md A1: "Strongest form: make the field an enum... Lift: constrained decoding (Outlines, URL), strict structured outputs." The FSM-token-masking mechanism and the crucial prompt-level fallback (most agent authors do NOT control decoding) are both dropped. The skill leaves the reader at a URL to learn the one technique they can actually apply.
**FIX:** Add one line: "If you don't control decoding, give the closed list in-prompt and require the model to echo the chosen value verbatim from that list — the prompt-level shadow of an enum." Optionally one clause on FSM token-masking as the why.

### 1.4 Instructor verbatim-substring — captured well (minor gap)
**PROBLEM (minor):** The `llm_validator("...") -> {is_valid, reason}` re-ask mechanism, where `reason` is fed back as the retry message, is named but its *role* (the reason becomes the next-attempt instruction) is compressed.
**EVIDENCE:** reference.md A2 names "`llm_validator` returning `{is_valid, reason}`" but does not say the reason is the re-ask payload. The verbatim-substring half (the genuinely mechanical, no-2nd-LLM check) IS captured well — good.
**FIX:** Half-sentence: "on failure the `reason` is fed back verbatim as the retry instruction." Low priority.

### 1.5 skill-creator {text,passed,evidence} + "write the script" — captured, but the triple is underspecified
**PROBLEM:** The verbatim rule ("if it can be checked by a script, write the script, don't eyeball it") is captured well in SKILL.md §"When to write a script" and reference.md B1. But the **exact assertion triple `{text, passed, evidence}`** — the actual schema to lift — is only named in B1, not shown as the shape to put in the prompt.
**EVIDENCE:** reference.md B1 cites "skill-creator's `{text, passed, evidence}` assertion triple" but the worked example and templates use a different ad-hoc shape (`test_passed: - value is one of...: YES`). The canonical triple isn't modeled.
**FIX:** Show the `{text, passed, evidence}` triple as the recommended per-assertion shape, and align the worked example to it (see Axis 4 hypocrisy).

### 1.6 Self-Refine localized feedback — captured (good)
Captured in reference.md B2 ("feedback must localize the problem + give a concrete fix"). Adequate.

### 1.7 Constitutional critique-to-named-principle — captured (good)
Captured in reference.md B2 ("critique tied to a named principle... anchored to a contract, not 'looks good'"). Adequate.

### 1.8 BAML co-locate value+source — captured but mechanism (SAP) thin
**PROBLEM:** The skill captures the *prescription* (co-locate value+source) but not the *enabling mechanism*: Schema-Aligned Parsing lets you keep a justification/source field ALONGSIDE the typed value in one schema without breaking the parser. Without that, "co-locate" reads as style, not a parseability guarantee.
**EVIDENCE:** reference.md C2: "BAML co-locating value+source per field (URL)." No mention of SAP / why co-location is parser-safe.
**FIX:** One clause: "schema-aligned parsing keeps value+source in one typed object without breaking the parse." Low-medium priority.

### 1.9 Strict-output required fields — captured (good)
reference.md C2 captures `strict:true` → missing `source` fails the parse, plus the Citations-API-conflict caveat. Good and notably honest.

### 1.10 Positive-vs-negative evidence — captured well, but one synthesis claim is unflagged
**PROBLEM:** SKILL.md §"Positive over negative" asserts the evidence confidently. The research VERDICT (Stream 4) explicitly flags that "membership-test as positive boundary" is **our synthesis (novel)**, "one line" is an **inference** not measured, and the strongest paper (White Bear) is a **preprint**. The skill states these as settled. Minor over-claim, but it contradicts the skill's own provenance ethic.
**EVIDENCE:** SKILL.md line 39 presents White Bear / Context Rot as flat support; reference.md lines 120–124 likewise. No "this is synthesis / preprint" hedge survives.
**FIX:** Add a half-line caveat in reference.md: "(White Bear is a preprint; 'one line' is inferred from Context Rot, not directly measured; 'membership-test = positive boundary' is our framing)."

**Axis 1 net:** Two outright omissions of how-to (CoVe template + isolation; the 0–5 rubric-gate) and three mechanisms reduced to name+URL (enum prompt-shadow, BAML/SAP, llm_validator re-ask). These are the gaps.

---

## AXIS 2 — LINK-DEPENDENCE (knowledge that lives only at a URL)

The research preamble is explicit: "URLs are provenance only." The skill violates this in several spots where the URL is the *only* place the mechanism lives.

**PROBLEM / line-by-line:**
1. reference.md A1, line 24: `Lift: constrained decoding (Outlines, https://github.com/dottxt-ai/outlines), strict structured outputs.` — The applicable technique (prompt-level enum echo) is at the URL, not inlined. **Write instead:** the prompt-shadow line from Axis 1.3.
2. reference.md B1, line 44: `Lift: Chain-of-Verification per-item loop (https://arxiv.org/abs/2309.11495)` — the CoVe template is the lift; it's link-only. **Write instead:** inline the CLAIM/TEST/ANSWER/EVIDENCE template.
3. reference.md A2, line 31: `"FullCite" — every claim → id + verbatim span (https://...2603.14170v1)` — fine as provenance, but note the arxiv id `2603.14170` is **implausible/likely fabricated** (2026-03 numbering on a paper cited as background; verify or drop). A dead/wrong citation is worse than none.
4. reference.md C2, line 65: BAML co-location — mechanism (SAP) at URL only (Axis 1.8).
5. reference.md B2, line 62: Self-Refine + Constitutional both fine — the mechanism IS inlined; URLs are genuinely provenance here. Good.
6. SKILL.md line 42: "`reference.md` shows a small example validator" — this is an internal pointer, fine.

**FIX (general):** For every `Lift: X (URL)` line, ask "could the agent apply X with the URL blocked?" If no, inline the one sentence of mechanism. Keep the URL trailing as provenance. The skill already does this correctly for Self-Refine/Constitutional/strict-outputs — apply the same standard to CoVe, enums, and BAML.

---

## AXIS 3 — CONTEXT BLOAT (always-loaded SKILL.md)

SKILL.md is ~52 lines of body — borderline but not egregious. Specific bloat and redundancy:

**PROBLEM 3.1 — §"Positive over negative" (SKILL.md lines 38–39) duplicates reference.md lines 120–124.**
The full evidentiary argument (White Bear, Context Rot, vendor consensus) is stated in the always-loaded layer AND again in reference.md. The always-loaded layer needs the *rule*, not the *evidence dump*.
**EVIDENCE:** SKILL.md 39 and reference.md 120–124 are near-identical in content.
**FIX:** In SKILL.md, cut to one line: "Specify what the output must be, not what to avoid; negatives cost accuracy and can backfire — reserve them for named attractors, one line, at the end (evidence in reference.md)." Move the citation paragraph fully to reference.md.

**PROBLEM 3.2 — §"A hardened prompt has" (SKILL.md 44–49) restates the 6-step procedure as a checklist.**
It's a near-verbatim recap of steps 1–6 already on the same page. Two presentations of the same content in the always-loaded layer.
**EVIDENCE:** Compare SKILL.md 28–36 (procedure) with 44–49 (checklist) — same five items.
**FIX:** This checklist is actually the more useful artifact (it's the *membership test for "is this prompt hardened"* — see Axis 4). Keep the checklist, compress the prose procedure, or move the procedure's prose detail to reference.md and keep only the checklist + the script rule in SKILL.md.

**PROBLEM 3.3 — The script example pointer + the script example itself.**
SKILL.md line 42 promises reference.md "shows a small example validator"; reference.md lines 91–116 deliver a 25-line Python validator with domain-specific field names (`comparable_bet_seeds`, `why_it_fits`). That's fine on-demand, but the offer to "write a real one tailored to your output contract... say the word" (line 116) is conversational filler in a reference doc.
**FIX:** Keep the validator (good, on-demand). Drop the "say the word and I'll write one" line — a skill is not a chat turn.

**Net:** SKILL.md can lose ~10–12 lines (the evidence paragraph + the redundant recap) with zero capability loss.

---

## AXIS 4 — SELF-CONSISTENCY (does the skill obey its own rules?)

This is where the skill is weakest. It preaches six disciplines and violates several on its own surface.

**PROBLEM 4.1 — No membership test for "is this prompt hardened." (HYPOCRISY)**
The skill's whole thesis is "give every judged output a membership test." The skill's *own* output is a hardened prompt — yet it provides no yes/no test that can return false to certify one. "A hardened prompt has..." (SKILL.md 44–49) is a presence checklist, not a soundness/membership test (e.g. it says "examples that pass their own gates" but gives no procedure to *verify* that). The skill fails its own A1/B2.
**FIX:** Recast "A hardened prompt has" as a PRESENCE+SOUNDNESS membership test (it should eat its own dog food): PRESENCE = the five elements exist; SOUNDNESS = each judged field's membership test can actually return false; every example was audited as agent output; negatives ≤ N and each maps to a named attractor. If a box fails → "this prompt is not hardened," not a green check.

**PROBLEM 4.2 — The worked example does NOT cleanly pass its own gates. (HYPOCRISY vs A3)**
reference.md A3 demands "every example value visibly satisfies its own membership test, annotated with the gate it passes." The After example (reference.md 78–86) uses `test_passed: - value is one of the allowed enum: YES` — an ad-hoc shape, NOT the `{text, passed, evidence}` triple the skill itself cites as the lift (B1). The example also hard-codes `YES` answers, modeling assertion-of-pass rather than a test that *can* return false (the exact anti-pattern A1 warns against — "questions that can return false").
**EVIDENCE:** reference.md 83–85 vs the `{text,passed,evidence}` triple named in B1/line 44.
**FIX:** Rewrite the worked example to use `{text, passed, evidence}`, and show at least one gate evaluating to NO → BLOCKED, so the example demonstrates a test that can fail (presence-vs-soundness in action).

**PROBLEM 4.3 — The skill does not declare ITS OWN inputs/outputs/consumers.** (see Axis 6 — also a self-consistency failure, since D2 "every emitted field maps to a named consumer" is in the family this skill teaches.)

**PROBLEM 4.4 — "minimal context" preached, partly violated** (see Axis 3 redundancy). The skill tells authors every line costs accuracy, then ships a duplicated evidence paragraph and a duplicated checklist in the always-loaded layer.

**PROBLEM 4.5 — Provenance preached, thin on the skill's own claims.**
The skill demands `source` + verbatim `evidence_quote` per judged field. Its own strongest empirical claims (White Bear "can raise odds of X"; "14%→2%") are stated without the synthesis/preprint provenance the research attaches (Axis 1.10). The skill doesn't co-locate its own caveats with its own assertions — the very C2 discipline it teaches.

**Net:** The skill is a competent *description* of the method but does not *demonstrate* it on itself. For a skill whose thesis is "examples teach more strongly than rules," failing to gate its own example (4.2) and lacking a membership test for its own output (4.1) are serious, on-brand failures.

---

## AXIS 5 — SEPARATION decision (skill-builder vs system-designer; internal split)

**RECOMMENDATION: TWO sibling skills (keep skill-builder and system-designer separate), and split skill-builder's reference into the existing two-file shape — no third file needed yet.**

**Rationale:**
- The spec (§2 table) already locks the division cleanly: skill-builder owns A1/A2/A3/B1/B2 + C2-applied (provenance within one field); system-designer owns C1/C3/D1/D2 + the Closer (B3), Quick-Pass (B4), orchestration. These are genuinely different jobs with different outputs (a single verifiable prompt vs. an IO-contract+DAG+lane map). Merging them would bloat the always-loaded description and blur triggers. The current skill's frontmatter already routes pipeline concerns to system-designer correctly (SKILL.md 14, 19) — keep that boundary.
- **Do NOT add more files inside skill-builder.** The skill is small. A `reference.md` (rule catalog + templates + worked example + script) is the right level-3 home. The Python validator is borderline-large but tolerable inline; if it grows or a real tailored validator is added, *then* promote it to `scripts/check_soundness.py` (the research/spec both anticipate this — Stream 3 skill-creator "code in a skill = deterministic behavior"; spec §4C).

**Concrete file tree (recommended):**
```
skills/
  skill-builder/
    SKILL.md         # core principle, procedure (6 steps), script rule, hardened-prompt MEMBERSHIP TEST, IO/consumer block
    reference.md     # A1–A3, B1–B2, C2-applied; inlined CoVe template; enum prompt-shadow; rubric-gate; worked example (gated); positive-over-negative evidence
    scripts/
      check_soundness.py   # ONLY when a real validator is authored; until then keep the illustrative one inline in reference.md
  system-designer/
    SKILL.md
    reference.md     # C1, C3, D1, D2 + Closer (4A), Quick-Pass (4B), orchestration (4C)
```
Provenance (C2) authored once here, referenced from system-designer (per spec §2/§41) — the current skill does this correctly.

---

## AXIS 6 — INPUTS / OUTPUTS / CONSUMERS clarity

**PROBLEM 6.1 — The skill never states ITS OWN inputs/outputs/consumers.**
Nowhere does skill-builder say: input = an existing or draft prompt + the list of fields the agent must judge; output = a hardened prompt with a PRESENCE/SOUNDNESS block (and optionally a validator script); consumer = the agent that will run the prompt, and any orchestrator/system-designer pipeline that embeds it. This is a direct miss of the discipline the skill is adjacent to (spec D2: "every emitted field maps to a named consumer").
**EVIDENCE:** SKILL.md frontmatter describes *when* to use, never the IO contract of the skill itself. No "Inputs/Outputs/Consumes" section exists.
**FIX:** Add a 3-line block near the top of SKILL.md: "**Inputs:** the prompt to harden + which fields it asks the agent to JUDGE (vs copy). **Output:** the same prompt with positive targets, membership tests, per-field source/evidence, and a PRESENCE/SOUNDNESS completeness block; optionally a `scripts/` validator. **Consumed by:** the agent that runs the prompt; an orchestrator/system-designer pipeline that embeds it."

**PROBLEM 6.2 — Partial credit: the skill DOES teach the authored prompt to declare its fields' provenance, but NOT its inputs/outputs/consumers.**
The skill teaches per-field `source`/`evidence_quote` (good) and names "the inputs that decide each classifier" (reference.md A2, line 33 — good, this is the spec's "name which inputs decide it"). But it does NOT teach the authored prompt to declare its overall inputs, its output contract's consumers, or "every emitted field maps to a named consumer." That last one (D2) is assigned to system-designer in the spec — defensible — but the *single-prompt* version ("each field you emit, name who reads it; drop fields no one consumes") belongs here and is absent.
**FIX:** Add to the procedure (or reference.md B2): "For the prompt you author, declare its inputs and its output's consumer(s); for each emitted field, name the consumer or drop it." Cross-reference system-designer for cross-handoff provenance.

---

## AXIS 7 — ORCHESTRATION PRINCIPLE (one job per agent)

**PROBLEM: ABSENT.** The principle — *each distinct job goes to its own agent; one agent holds at most one distinct job UNLESS its job is to oversee them all (orchestrator); prefer subagents for the little jobs while an orchestrator keeps the birdseye* — does not appear in skill-builder at all. The research strongly supports it: Anthropic **sectioning** ("a separate model screens vs. answers — performs better than one model doing both," Stream 3); orchestrator-workers (Stream 2/3); "agent = system prompt + functions" + `Agent.as_tool` scoped sub-agent (Stream 3).
**EVIDENCE:** Grep skill-builder for "orchestrat", "subagent", "sectioning", "one job" → no hits. The spec routes the multi-agent version to system-designer (§2), which is why it's missing — but the *single-prompt corollary* still belongs here and isn't present.
**FIX (phrasing for the single-prompt context):** Add a short principle to SKILL.md, framed at the level a single-prompt author can act on:

> **One job per prompt.** A prompt that both *produces* a value and *verifies* it is two jobs in one agent — and models are unreliable self-graders. Keep judgment in the prompt; push verification into a separate pass (a script, or a separate validator prompt) — this is "sectioning": a separate checker beats one agent doing both. If a single prompt must hold several judged fields, that's still one job (produce the artifact); the *checking* of those fields is the second job and belongs to a different pass. When the work fans into several distinct jobs, give each its own agent and let one orchestrator keep the birdseye — don't pile distinct jobs onto one prompt.

This also reinforces the skill's existing "write the script, don't self-grade" rule (SKILL.md §41) by giving it its architectural justification (sectioning), which it currently lacks.

---

## VERDICT: **MAJOR-REVISE**

The skill has the right spine — core principle, the procedure, the script rule, the PRESENCE/SOUNDNESS split, and an honest treatment of strict-outputs/citations conflict. It is *not* a rebuild. But it (a) loses real how-to to name+URL on its two most liftable mechanisms (CoVe template + isolation; enum prompt-shadow) and drops the rubric-gate entirely; (b) is link-dependent where the research forbids it; (c) does not eat its own dog food — no membership test for its own output, an ungated worked example, no declared IO/consumers; and (d) omits the orchestration / one-job-per-agent principle.

**THE SINGLE MOST IMPORTANT CHANGE:** Make the skill obey itself — replace "A hardened prompt has" (a presence checklist) with a **PRESENCE+SOUNDNESS membership test for "is this prompt hardened,"** and rewrite the worked example to actually pass that gate using the `{text, passed, evidence}` triple with at least one failing (NO → BLOCKED) check. A skill whose thesis is "examples teach more strongly than rules" cannot ship an example that doesn't pass its own gates.
