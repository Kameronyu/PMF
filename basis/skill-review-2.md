# Adversarial Review 2 — skill-builder + system-designer (composed)

Reviewed:
- `skills/skill-builder/SKILL.md`, `skills/skill-builder/reference.md`
- `skills/system-designer/SKILL.md`, `skills/system-designer/reference.md`, `skills/system-designer/patterns.md`

Against: `research-findings.md` (the lossless standard). Prior review (`skill-review.md`) consulted so fixed items are not re-flagged as new.
Stance: harsh, severity erring high. Critique only — no rewrites.

**Headline:** skill-builder absorbed nearly all of the prior review (CoVe template + isolation, enum prompt-shadow, rubric-gate, `{text,passed,evidence}` triple, IO/consumers block, membership test for its own output, a gated worked example that returns FALSE, the one-job principle). It is now in good shape. system-designer is the **new** artifact and carries most of the remaining debt: several Stream-2/3 mechanisms are reduced to a bare name, and it has two genuine self-consistency hypocrisies. The two skills compose cleanly at the boundary but **duplicate** a meaningful amount of mechanism text that should live in one place.

---

## AXIS 1 — LOSSINESS vs research

### Stream 2 (Closer / escalation) — mechanism-by-mechanism

**1.1 DSPy hard-vs-soft + Past Output/Instruction injection — PARTIALLY LOST.**
- PROBLEM: Research (Stream 2, DSPy) gives three distinct lifts: (a) hard(halt) vs soft(log-and-continue) dichotomy, (b) `max_backtracks` as the bound, and crucially (c) the **injection of two named fields on retry — `Past Output` (the prior failing output) + `Instruction` (what went wrong + what to fix)**. patterns.md captures (a) HARD/SOFT and (b) the budget well. But (c) is the precise mechanism and it is softened: the retry note has `why_it_failed` + `approaches_already_tried` but never carries the **prior failing output itself** (`Past Output`) as a named field. The single most-liftable DSPy detail — re-inject the failed artifact verbatim alongside the instruction — is reduced.
- EVIDENCE: `patterns.md` "Paste-in retry note" (lines 20-28) has `why_it_failed`, `approaches_already_tried`, `budget_remaining`, `on_exhaustion` — no `past_output` field. SKILL-level Closer step 2 says "carries the FULL prior context" (prose) but the structured note doesn't model it.
- FIX: Add `past_output: <the prior value that failed its gate>` to the paste-in retry note, and one clause: "re-inject the failed output itself, not just a description of why it failed (DSPy Past+Instruction)."

**1.2 Reflexion episodic memory + ReflexionStrategy knob — PARTIALLY LOST.**
- PROBLEM: Research gives a concrete, liftable knob: `ReflexionStrategy ∈ {NONE | LAST_ATTEMPT | REFLEXION | LAST_ATTEMPT_AND_REFLEXION}` = *how much* prior-attempt context the retry agent receives, and the discipline that the reflection is a **textual lesson** ("converts the failure signal into a TEXTUAL lesson"), prepended on the next trial. patterns.md step 6 captures the spirit ("a written lesson... not a blind re-roll" and "last attempt only vs. all attempts") — this is actually decent. The gap is small: it doesn't name that the lesson is a *distinct role* (a self-reflection model separate from the actor/evaluator), which is the Reflexion three-role structure.
- EVIDENCE: `patterns.md` step 6 (line 18). The "Actor / Evaluator / Self-Reflection" three-role split from research is collapsed.
- FIX: Low priority. Optionally note the three-role structure (actor produces, evaluator scores, reflector writes the lesson) so the reader knows the lesson-writer can be its own sectioned step.

**1.3 CRITIC tool-grounding — CAPTURED (good).** patterns.md Closer step 4 states it cleanly ("fill via lookups/searches/tools, NOT by re-reasoning from priors... external tools are what make correction real"). Matches research. No gap.

**1.4 GPT-5 bounded persistence — CAPTURED (good).** patterns.md step 3 + "Bounded non-termination" carry the verbatim phrasing pattern and the tool-call-budget bound. Matches research. No gap.

**1.5 Self-consistency — CAPTURED but thin.**
- PROBLEM: Research ties self-consistency to the quick-pass explicitly ("3-5 mini-search agents is self-consistency applied to evidence gathering — trust the convergent answer over a single assertion") and to N diverse chains + majority/plurality vote. patterns.md quick-pass step 3 says "Aggregate by convergence" and the named-loop list has "Voting." Adequate, but the mechanism (sample N *diverse* reasoning paths, then majority/plurality) is reduced to "convergence" without the diversity requirement.
- EVIDENCE: `patterns.md` "Voting" entry (line 48) and quick-pass step 3. No mention that the N samples must be *independent/diverse* for voting to mean anything.
- FIX: One clause on Voting: "the N runs must be independent (diverse paths/seeds), else agreement is meaningless."

**1.6 Evaluator-optimizer — CAPTURED (good).** patterns.md named-loop entry is faithful (separate evaluator, explicit criteria, feedback-fed-back, max-iteration cap, "Closer is an evaluator-optimizer where the evaluator is the gate"). No gap.

**1.7 Orchestrator-workers — CAPTURED (good).** patterns.md entry + quick-pass instance. No gap.

**1.8 Gates — CAPTURED (good).** "Prompt-chaining with gates" entry + gates appear throughout. No gap.

**1.9 Voting — see 1.5** (diversity requirement thin).

### Stream 3 (IO contracts / handoffs) — mechanism-by-mechanism

**1.10 Handoff input_type/input_filter (metadata-vs-state) — CAPTURED (good).** reference.md "metadata vs. state" rule + INPUT/OUTPUT HYGIENE "Filter the handoff" capture both halves. The `RECOMMENDED_PROMPT_PREFIX` / "ship a canonical prompt fragment that teaches the lane boundary" lift from research is **dropped**, but it's marginal. Note below.
- MINOR GAP: research's "ship a canonical prompt fragment teaching agents how handoffs work" is absent. Low priority — optionally mention.

**1.11 LangGraph reducers (overwrite/append/custom) — CAPTURED (good).** reference.md C1 is faithful and even adds "dedupe by id" for append and the per-mode constraints. Strong. No gap.

**1.12 Sectioning — CAPTURED (good), but duplicated across files (see Axis 3).** Present in SKILL.md step 3, reference.md LANES, patterns.md named-loop. Faithful; the redundancy is the issue, not the fidelity.

**1.13 Scoped tools/permissions — CAPTURED (good).** reference.md LANES "Scope each step three ways: role, tools, write-permission" matches Google ADK research precisely, including read-only-to-everything-else. No gap.

**1.14 Citations / FullCite verbatim spans — CAPTURED (good).** reference.md PROVENANCE "Each fact = an id + a verbatim span... mechanically checkable downstream" + the Citations-vs-strict-JSON conflict note. Faithful to FullCite and Citations API. No gap. (Sources line dropped the suspect arxiv id — see Axis 2.)

**1.15 Strict-output required fields — CAPTURED (good).** PROVENANCE "Make it a REQUIRED field... with strict structured output a missing `source` fails the parse." Matches Stream 3 strict:true. No gap.

**1.16 trafilatura input cleaning — PARTIALLY LOST.**
- PROBLEM: Research gives a concrete two-tier recipe: "trafilatura first to drop nav/ads/boilerplate; fall back to html-to-markdown for structure-sensitive docs; BeautifulSoup/regex for tags," plus the finding "GPT-4o-class models lose LITTLE accuracy when HTML structure is stripped" and the caveat "over-cleaning strips signal; tune." reference.md INPUT/OUTPUT HYGIENE says "Strip HTML/boilerplate/scaffolding in a SCRIPT first... models lose little accuracy on stripped content" — captures the *finding* but reduces the *recipe* (trafilatura → html-to-markdown fallback → regex) to a bare name in the Sources line only. The "over-cleaning strips signal; tune" caveat is dropped.
- EVIDENCE: `reference.md` INPUT/OUTPUT HYGIENE (line 48); the trafilatura tool name appears only in the Sources footer (line 90).
- FIX: Add half a sentence: "trafilatura for main-content extraction, fall back to html→markdown for structure-sensitive docs; don't over-clean (you can strip signal)." Keeps the how-to off the URL.

**1.17 Idempotent DAG — CAPTURED (good).** DETERMINISM "Idempotent steps: same input → same output, no side effects, safe to re-run." Matches. No gap.

**1.18 Deterministic template expansion — CAPTURED (good).** DETERMINISM "deterministically expanded pipeline (template/DAG) beats an LLM that re-invents the plan." Matches Prompt2DAG. No gap.

**1.19 Agent-as-tool — CAPTURED (good).** INPUT/OUTPUT HYGIENE "Agent-as-a-function... takes typed inputs, returns a typed result, control returns to the caller." Matches `Agent.as_tool`. No gap.

**1.20 Runner-vs-graph-framework (LangGraph not a scheduler) — CAPTURED (good).** DETERMINISM "Use the right tool... a real runner (Make/Prefect/Dagster) gives scheduling/retries/backoff; an LLM-graph framework is for in-step branching, not your scheduler." This is the Stream-3 HYPE FLAG, captured faithfully. No gap.

### skill-builder rebuild — did it LOSE anything vs research?

Cross-checked the prior review's flagged gaps against the current file:
- CoVe template + "answer in isolation" — **now inlined** (reference.md A1 "Verify in isolation" + CLAIM/TEST/ANSWER/EVIDENCE shape). Fixed.
- Enum prompt-shadow (echo-from-closed-list when you don't control decoding) — **now inlined** (reference.md A1 "Strongest form — enum"). Fixed.
- Rubric 0-5 + hard revise gate — **now inlined** (reference.md B2 "rubric with a hard gate"). Fixed.
- `{text,passed,evidence}` triple modeled in the worked example — **now used** (reference.md worked example + WHAT A SCRIPT LOOKS LIKE). Fixed.
- IO/consumers block, membership test for own output, one-job principle — **all present**. Fixed.

Residual Stream-1 losses in skill-builder (minor):
- **1.21 Guardrails AI / RAVG provenance-validator** and **pydantic-ai `ModelRetry`** — neither named. The *behavior* (validator returns a specific retry message; `llm_validator` `reason` fed back) is captured in A2. Acceptable — these are corroborating sources, not unique mechanisms. No action needed.
- **1.22 Self-Refine ~20% gain / "stops on good-enough OR cap"** — the stop condition is implicit. Low priority.

**Axis 1 net:** system-designer has three real reductions — **DSPy Past-Output injection (1.1)**, **trafilatura recipe + over-clean caveat (1.16)**, and **voting-diversity (1.5)** — plus minor drops (handoff prompt-fragment, Reflexion three-role). skill-builder lost essentially nothing in its rebuild.

---

## AXIS 2 — LINK-DEPENDENCE

Both skills now quarantine URLs to a Sources footer and inline the how-to. Spot-checks:

**2.1 No mechanism is URL-only in skill-builder.** Every `Lift` from the prior review is inlined. PASS.

**2.2 system-designer — trafilatura is the one borderline case.** The extraction *recipe* lives only in the Sources footer name "trafilatura / clean-html-for-llm" (reference.md line 90); the body has the finding but not the tool-chain. Mild link-dependence (you'd want the URL to know *which* tool). FIX: inline the one clause (Axis 1.16). Everything else applies with URLs blocked.

**2.3 Likely-fabricated / implausible citations.**
- PROBLEM: research-findings.md cites FullCite as `arxiv.org/html/2603.14170v1`. `2603.xxxxx` decodes to **March 2026** — a future/implausible id for a paper used as background, and the format (`/html/...v1`) is atypical. This is **likely fabricated or mis-transcribed**.
- EVIDENCE: `research-findings.md` Stream 3 FullCite (line 85) and Stream 3 TOP-5 (line 97).
- GOOD NEWS: the skills did **not** propagate the id — system-designer `reference.md` Sources line 88 cites FullCite *by name only* ("Anthropic Citations API; citation-enforced RAG literature"), no arxiv id. So the contamination stopped at research. FIX: flag the id in research-findings as unverified; the skills are clean.
- Other ids spot-checked: White Bear `2511.12381` (Nov 2025) — plausible given a Jan-2026 cutoff, and research itself flags it "Preprint." Prompt2DAG `2509.13487` — cited in research only, not in skills. Reflexion `2303.11366`, CRITIC `2305.11738`, Self-Consistency `2203.11171`, CoVe `2309.11495`, Self-Refine `2303.17651`, Constitutional `2212.08073`, Lost-in-the-Middle `2307.03172` — all real, correctly placed. No action.

---

## AXIS 3 — CONTEXT BLOAT (always-loaded SKILL.md)

Both SKILL.md bodies are reasonable length, but there is **cross-skill duplication** of mechanism text — the most important bloat finding, because it's the one neither skill can see in isolation.

**3.1 Sectioning is stated three+ times per skill and again across both. (REDUNDANCY)**
- PROBLEM: "the step that produces a value must not also verify it — a separate checker beats one agent doing both" appears in: skill-builder SKILL.md ("One job per prompt" + procedure step + "Run the hardening as a workflow"), skill-builder reference.md ("One job per prompt — detail"), system-designer SKILL.md (step 3 + "When to spawn a subagent"), system-designer reference.md (LANES), and system-designer patterns.md (named-loop "Sectioning"). That's ~6 statements of one idea across the pair.
- EVIDENCE: grep "separate checker" / "sectioning" / "produces ... verifies" across both skills returns hits in all five files.
- FIX: Pick ONE canonical home (system-designer reference.md LANES is the natural owner, since lanes = sectioning) and have the others say "sectioning — see system-designer → LANES" rather than re-deriving it. skill-builder's single-prompt corollary ("produce ≠ verify, push verification to a script/separate pass") can stay as one line since it's the single-prompt specialization, but it shouldn't re-explain *why* sectioning wins.

**3.2 skill-builder SKILL.md "Run the hardening itself as a workflow" (lines 45-46) restates the bounded-decomposition caveat that's also in system-designer.**
- PROBLEM: "every extra handoff is a lossiness point, so split only when the jobs are genuinely independent and numerous" (skill-builder SKILL.md 46) duplicates system-designer SKILL.md step 1 ("Do NOT over-shard: every split adds a handoff... a coherent job stays one step") and the membership-test line "Is the decomposition bounded." Same principle, two always-loaded homes.
- EVIDENCE: skill-builder SKILL.md line 46 vs system-designer SKILL.md line 32 + line 51.
- FIX: This is the *defining* principle of system-designer; it should own it. skill-builder can keep a one-line pointer ("split into a workflow only when jobs are genuinely independent — bounded decomposition, see system-designer") instead of re-stating the rationale.

**3.3 skill-builder SKILL.md — "One job per prompt (sectioning)" section (lines 27-28) AND "Run the hardening as a workflow" (45-46) AND the procedure's step about it.** Three touches of one-job in the always-loaded layer.
- FIX: Collapse to one. The "Procedure" + "membership test" already carry it; the standalone section can shrink to a single principle line.

**3.4 system-designer SKILL.md is at the upper bound of acceptable (53 lines, dense).** The "When to spawn a subagent vs. keep it in one context" paragraph (line 41) is good content but partially restates the bounded-decomposition rule from step 1. Mild. Could tighten by 2-3 lines but not urgent.

**3.5 Within skill-builder reference.md: "One job per prompt — detail" (lines 94-95) vs SKILL.md "One job per prompt" — the reference adds the `Agent.as_tool` mechanism, so it's not pure duplication. Acceptable.**

**Net:** The two SKILL.md files are individually lean but **collectively** repeat sectioning and bounded-decomposition. Author each once (system-designer owns both, since they're architectural), cross-reference from skill-builder. Saves ~8-10 always-loaded lines across the pair and removes the risk of the two drifting out of sync.

---

## AXIS 4 — SELF-CONSISTENCY (eat own dog food)

### skill-builder — now strong, two residual nits

**4.1 GOOD:** It declares its own Inputs/Output/Consumed-by (SKILL.md 19-21). It has a membership test for its own output that can return FALSE ("any NO means not hardened, name the gap," SKILL.md 48-56). Its worked example shows a gate returning FALSE → BLOCKED (reference.md 115-126). Examples are gated. Negatives are minimized and the rule about them is itself one line. This is genuine dog-fooding — the prior review's central complaint is fixed.

**4.2 NIT — the positive-over-negative claims still under-cite their own provenance ethic.** reference.md "POSITIVE-OVER-NEGATIVE" (lines 156-166) now *does* include the synthesis/preprint caveat ("White Bear is a preprint; 'one line' is inferred; 'membership test is a positive boundary' is our synthesis") — line 165. So this is largely fixed. Residual: SKILL.md itself doesn't carry even a half-flag, but it points to reference.md, which is acceptable. No action required; note as resolved.

**4.3 NIT — the skill says "drop any emitted field no named consumer reads" (SKILL.md 40) but its own output (a hardened prompt) doesn't enumerate which consumer reads which part.** Minor — the IO block names consumers at the artifact level, which is proportionate for a single-prompt skill. Acceptable.

### system-designer — two genuine hypocrisies

**4.4 HYPOCRISY — system-designer does not fully eat its own "every emitted field names a consumer" rule on its OWN output.**
- PROBLEM: The skill's central contract rule is "every emitted field names a consumer or is dropped" (SKILL.md step 2; reference.md IO CONTRACT). Its own declared Output is "a DAG of single-job steps, each with a typed IO contract... lanes, gates + escalation, provenance fields, and a deterministic run plan" (SKILL.md 22). But it never says **which consumer reads which part of its own output** — e.g. "the engineer reads the run plan; skill-builder reads each node-prompt's field list; the orchestrator reads the DAG edges." It declares consumers as a flat list (SKILL.md 23) without mapping output-part → consumer, which is exactly the granularity it demands of every node it designs.
- EVIDENCE: SKILL.md lines 22-23 (Output + Consumed-by are two separate flat lists, not a per-field mapping).
- FIX: Map its own output parts to consumers: "DAG + edges → orchestrator/engineer; per-node prompt contracts → skill-builder; run plan → engineer." Eat the rule.

**4.5 HYPOCRISY — system-designer claims "this skill is itself run as a workflow of single-job steps" but the workflow's verifier step is not sectioned from the authoring steps in practice.**
- PROBLEM: SKILL.md step 7 says "Section the verifier — a separate review step (its own agent) checks the assembled system." Good in principle. But the skill provides **no membership/contract for that verifier's own output** — what does step 7 emit, who consumes its verdict, can it return FALSE? Steps 1-6 each have rich detail; step 7 is one line. The skill that preaches "every step has a typed contract" leaves its own final step contract-less. (Compare skill-builder, which gives its self-check a full membership test that can fail.)
- EVIDENCE: SKILL.md step 7 (line 38) vs the membership test block (lines 43-52) — the membership test IS effectively the verifier's checklist, but step 7 doesn't point to it as its output contract, so the workflow's last node has no declared IO.
- FIX: Wire step 7 to the membership test: "step 7 emits a typed verdict {sound: bool, failing_gaps: [...]}, consumed by the engineer; it runs the membership test below; any NO blocks ship." Now the verifier has a contract that can return FALSE.

**4.6 GOOD:** system-designer declares its own Inputs/Output/Consumed-by (SKILL.md 21-23), has a membership test that can return FALSE ("any NO = not sound, name the gap," 43-52), gates examples (reference.md GATED EXAMPLE shows a FAIL), and confines negatives to the reject-list (reference.md LANES "the one place a negative earns its keep"). Mostly dog-foods. The two gaps above (4.4, 4.5) are the exceptions.

**4.7 MINOR — "minimize negatives" partly violated by the membership tests themselves.** Both skills' membership tests are phrased as questions, which is fine. But system-designer's reject-list guidance is sound and self-consistent. No action.

---

## AXIS 5 — WORKFLOW / ORCHESTRATION CORRECTNESS

**5.1 system-designer expresses its method as single-job steps with an orchestrator — CORRECT.** THE WORKFLOW (steps 1-7) is genuinely one-job-per-step (decompose / contract / lanes / gates / provenance / determinism / verify), and "When to spawn a subagent" names the orchestrator as the birdseye-holder that "gets to hold multiple jobs only because overseeing IS its one job" (SKILL.md 41). Faithful to research. PASS.

**5.2 Bounded-decomposition caveat — PRESENT and CORRECT.** "Split only where the type of work genuinely differs... Do NOT over-shard: every split adds a handoff, and handoffs lose fidelity — so a coherent job stays one step" (SKILL.md step 1) + membership-test line "Is the decomposition bounded (no split that exists only to be reassembled)" (line 51). This is exactly right and is the strongest part of the skill. PASS. (Caveat: it's also duplicated in skill-builder — see Axis 3.2.)

**5.3 "When to spawn a subagent vs keep in-context" — SOUND.** SKILL.md 40-41: spawn when "a genuinely distinct type AND (independent/parallelizable... OR needs isolated minimal context); keep in one context when handoff overhead exceeds benefit (small, tightly-coupled work)." Matches research (sectioning + agent-as-tool + handoff-is-lossy). PASS.

**5.4 Deterministic-spine point — PRESENT, not contradicted.** "Fixed DAG; idempotent steps; deterministic work in scripts BETWEEN the LLM calls; one command runs the whole thing" (SKILL.md step 6; reference.md DETERMINISM). Consistent everywhere. PASS.

**5.5 GAP — the workflow steps don't carry per-step IO contracts among THEMSELVES (ties to 4.5).** The skill says "this skill is itself this workflow" but the seven steps are described as prose jobs, not as nodes with typed handoffs (step 1 outputs *what* that step 2 consumes?). For a skill whose thesis is "every edge has a typed contract," presenting its own workflow without inter-step contracts is a missed demonstration. FIX: optionally annotate each workflow step with "produces → consumed by next step," turning the workflow into a worked example of its own method. Medium priority — it would make the skill self-exemplifying.

**5.6 skill-builder workflow framing — CORRECT but lighter.** "Run the hardening itself as a workflow" (SKILL.md 45-46) correctly decomposes hardening into 6 jobs (triage → author → provenance → completeness → validator → verify), parallel subagents author fields, separate subagent verifies, orchestrator holds birdseye, "every extra handoff is a lossiness point, so split only when... genuinely independent and numerous." Sound and consistent with system-designer. PASS.

---

## AXIS 6 — COMPOSITION & SEPARATION

**6.1 Boundary is stated in BOTH skills — GOOD.** skill-builder SKILL.md frontmatter routes pipeline concerns to system-designer (lines 13-14) and the Inputs block names system-designer as a consumer (line 21). system-designer has a dedicated "Relationship to skill-builder" section ("This skill designs the DAG... skill-builder hardens each individual node-prompt inside the DAG," lines 28-29) and names skill-builder as a consumer (line 23). The boundary is bidirectional and consistent. PASS.

**6.2 They compose cleanly — GOOD.** system-designer's workflow step 2 produces node IO contracts; skill-builder consumes a single node-prompt and hardens its judged fields. The seam ("design the system here; harden each node there," system-designer SKILL.md 29) is clean and non-overlapping at the conceptual level.

**6.3 PROBLEM — provenance is authored TWICE, not once-and-referenced.**
- PROBLEM: The prior review (Axis 5) said "Provenance (C2) authored once in skill-builder, referenced from system-designer." The current files do **not** do this — both fully re-derive provenance. skill-builder reference.md "C2 (applied)" (lines 84-85) gives `source` typing + co-location + the Citations-vs-strict-JSON caveat. system-designer reference.md "PROVENANCE ACROSS HANDOFFS" (lines 38-43) gives the **same** `source ∈ {operator_verbatim | traces_to | kb | agent_inference}` enum, the **same** "id + verbatim span, mechanically checkable," and the **same** Citations-vs-strict-JSON caveat. That's the identical mechanism written out in two places — exactly the cross-skill duplication this review's Axis 3 warns about, and it risks drift.
- EVIDENCE: skill-builder reference.md 84-85 vs system-designer reference.md 38-43; the `source` enum and the Citations caveat are near-verbatim in both.
- FIX: Decide an owner. The *single-field* provenance mechanism (what a `source`/`evidence_quote` field looks like inside one prompt) is skill-builder's; the *cross-handoff* survival of provenance (typed caveats that don't get reworded at the next hop, C3) is system-designer's unique contribution. Keep C3 (typed-caveat-survives-handoff, the `{literal, abstracted, approved_by}` shape) in system-designer — that's genuinely its own. Move the shared *base* (the `source` enum + verbatim-span + Citations caveat) to skill-builder and have system-designer say "per-field provenance shape: see skill-builder → A2/C2; across handoffs, additionally:" then give only the C3 delta. Removes ~5 duplicated lines and kills the drift risk.

**6.4 PROBLEM — a concept falls between the two skills: who owns the global field→consumer map across the whole DAG vs. per-prompt?**
- PROBLEM: skill-builder teaches "each emitted field maps to a NAMED consumer or is dropped" at the single-prompt level (SKILL.md 40; reference.md "Declare inputs/output/consumers"). system-designer teaches the same at the edge level ("every emitted field names a consumer," reference.md IO CONTRACT). These overlap heavily — a reader hardening a node might apply both and wonder which owns "consumer naming." It's not a *gap* (both cover it) but a soft *overlap* with no stated division.
- EVIDENCE: skill-builder reference.md "Declare inputs / output / consumers" (lines 89-90) vs system-designer reference.md IO CONTRACT "Every emitted field names a consumer or is dropped" (line 18).
- FIX: State the division explicitly: "Within one prompt's output schema, naming consumers is skill-builder's job; naming the consumer *across a handoff edge* (which downstream STEP reads it) is system-designer's. The field-level rule is the same; the scope differs." One cross-reference line in each.

**6.5 GOOD — no orphaned concept otherwise.** Escalation/Closer, quick-pass, reducers, determinism all sit cleanly in system-designer; membership tests, per-field evidence, presence/soundness sit cleanly in skill-builder. The two cover the research between them with no dropped mechanism (modulo the Axis-1 reductions).

---

## AXIS 7 — INPUTS / OUTPUTS / CONSUMERS

**7.1 Both skills declare their OWN IO/consumers — GOOD.** skill-builder SKILL.md 19-21; system-designer SKILL.md 21-23. Both have explicit Inputs / Output / Consumed-by. PASS (this was a prior-review miss for skill-builder, now fixed, and system-designer ships with it).

**7.2 skill-builder teaches its ARTIFACT (a hardened prompt) to declare inputs/output/consumers — GOOD.** SKILL.md 40 "make the authored prompt declare its OWN inputs, output, and consumers, and drop any emitted field no named consumer reads"; reference.md "Declare inputs / output / consumers" section. The artifact-level teaching is present. PASS.

**7.3 system-designer teaches its ARTIFACT (a step contract) to declare inputs/output/consumers — GOOD.** reference.md IO CONTRACT template has INPUTS / OUTPUT SCHEMA / PRODUCES-FOR / DECIDES-ONLY / MUST-NOT-DECIDE, with per-field consumer naming. Strong. PASS.

**7.4 GAP — neither artifact template requires declaring the CONSUMER of the *whole step/prompt*, only per-field consumers.** The IO CONTRACT names "consumed by: <downstream step>" per field and "PRODUCES-FOR: <named consumers>" — good. But skill-builder's authored-prompt guidance says "declare its consumers" without a template slot enforcing it (unlike the per-field `source` which IS templated). Minor asymmetry. FIX: add a `CONSUMED-BY:` line to skill-builder's authored-prompt declaration the way system-designer's contract has `PRODUCES-FOR:`. Low priority.

**7.5 GAP (ties to 4.4) — system-designer's own output doesn't map output-part → consumer.** Already covered in Axis 4.4. The skill that mandates per-field consumer mapping doesn't apply it to its own multi-part output.

---

## PER-SKILL VERDICTS

### skill-builder — **KEEP (minor revise)**
The rebuild absorbed essentially the entire prior review: CoVe template + isolation, enum prompt-shadow, rubric-gate, the `{text,passed,evidence}` triple modeled in a worked example that returns FALSE, IO/consumers, a membership test for its own output, the one-job principle, and the synthesis/preprint caveat on positive-over-negative. It dog-foods its own thesis. Remaining work is small: trim cross-skill duplication (sectioning, bounded-decomposition), and resolve the provenance ownership with system-designer.
- **Single most important change:** Stop re-deriving sectioning and bounded-decomposition (own one-line corollaries, cross-reference system-designer) and let skill-builder own the *single-field* provenance mechanism so system-designer can reference it instead of duplicating it (Axis 6.3). This removes the only real cross-skill drift risk.

### system-designer — **MAJOR-REVISE**
Architecturally correct and faithful on most mechanisms (reducers, scoped lanes, determinism, agent-as-tool, runner-vs-graph, bounded decomposition — all strong). But it carries the bulk of the remaining debt: (a) three Stream-2/3 reductions (DSPy Past-Output injection 1.1, trafilatura recipe 1.16, voting-diversity 1.5); (b) two self-consistency hypocrisies — it doesn't map its own output's parts to consumers (4.4) and leaves its own verifier step (step 7) contract-less (4.5); (c) it re-derives provenance that should be referenced from skill-builder (6.3). It is not a rebuild — the spine is sound — but it needs a real pass.
- **Single most important change:** Make it eat its own contract rules — give workflow step 7 (the verifier) a typed output `{sound, failing_gaps}` wired to the membership test that can return FALSE, and map its own multi-part output to named consumers (DAG→orchestrator, node-contracts→skill-builder, run-plan→engineer). A skill whose entire thesis is "every step has a typed contract and every field names a consumer" must demonstrate both on itself.

---

## CROSS-CUTTING — research-findings.md note (not a skill defect)
The FullCite arxiv id `2603.14170v1` (research Stream 3, lines 85/97) is implausible (March-2026 numbering, atypical `/html/...v1` form) and likely fabricated or mis-transcribed. It did **not** leak into either skill (system-designer cites FullCite by name only). Flag it in research-findings as unverified so a future edit doesn't reintroduce it.
