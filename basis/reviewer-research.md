# Research capture — adversarial-reviewer
Lossless source for the `adversarial-reviewer` skill. Lists/templates/scales reproduced inline; URLs provenance only.

## A. Making the JUDGE reliable (biases, grading protocol, rubric formats)

**Reference-guided grading is the core justification for this whole skill.** Grading an artifact against a CAPTURED STANDARD is exactly the "reference-guided judge" that Zheng et al. (MT-Bench) name as THE fix for a judge hallucinating correctness. Rule to bake in: every finding must cite the specific standard passage it violates — an ungrounded criticism is hallucination-prone.

**Pointwise, not pairwise.** Pairwise preferences flip ~35% under distractor manipulation vs ~9% for absolute/pointwise scoring; pairwise is more game-able. Our reviewer grades THIS artifact against the standard (pointwise), not A/B tournaments. (If ever comparing two, use swap-and-require-consistency: judge both orders, declare a winner only if it wins both, else tie.)

**Judge bias self-audit checklist (CALM, 12 biases).** Before trusting a verdict, guard against:
1. Position — favoring a slot regardless of content.
2. Verbosity — favoring the longer artifact even if worse.
3. Compassion-fade — judging differently when real names are shown vs anonymized.
4. Bandwagon — caving to a stated majority ("most people think…").
5. Distraction — over-weighting irrelevant detail/padding.
6. Fallacy-oversight — accepting broken reasoning when the conclusion looks right (check the steps, not just the answer).
7. Authority — credited by impressive/fake citations or authoritative phrasing.
8. Sentiment — swayed by emotional tone (hardest bias for all models — watch it).
9. Chain-of-thought — verdict changes if you don't force reasoning first → ALWAYS reason before verdict.
10. Self-enhancement — favoring outputs in the judge's own style.
11. **Refinement-aware — scoring the SAME text higher just because it's labeled "v2/refined/optimized." Re-grade BLIND to revision status.** (Directly relevant: we review revisions.)
12. Diversity — judgment shifting on identity markers.
Self-preference correlates with perplexity (a judge over-rates text that reads like its own). Rule: grade against the standard's CONTENT, never "how I would have written it"; don't penalize mere style difference.

**Calibration tactics:** (1) quote-evidence-before-scoring — quote the offending span + the standard passage, say what fails, THEN score; (2) per-criterion sub-scores kept separate from the overall verdict; (3) abstain — output "uncertain, needs human" when evidence is thin rather than forcing a verdict; (4) Panel of LLMs (PoLL) — 2-3 diverse-family models beat one big judge and cancel self-preference; flag disagreement.

**G-Eval format:** each criterion = a named criterion + an explicit definition + a short auto-generated "evaluation steps" (CoT of how to check it) + a score. Keep score-definitions in the rubric and reasoning in the steps — never mix. (Skip probability-weighted scoring — needs logprobs.)

**Prometheus template (the most liftable artifact — adapt verbatim):**
```
###Task: an instruction, a response to evaluate, a reference answer that scores 5,
and a score rubric. (1) Write detailed feedback strictly against the rubric.
(2) Then give an integer score 1-5. (3) Format: "Feedback: {...} [RESULT] {score}"
###Reference Answer (Score 5): {the captured standard plays this role}
###Score Rubric: {criterion description + a descriptor for EACH level}
```
Feedback BEFORE score; a literal `[RESULT]` separator; the rubric gives a descriptor per level.

**FLASK:** score only the criteria that APPLY to this artifact type (a prompt, a spec, and an output need different sub-checks); rationale before each score.

**TICK / STICK (→ the resolution audit):** decompose the standard into a checklist of atomic YES/NO requirement questions; the judge answers each (reasoning first); pass-rate = score; any residual NO = unresolved → iterate. STICK reuses the same checklist to drive self-refinement (iterate-until-pass).

**promptfoo output contract:** `{reason, pass, score}` — rationale first, then pass/fail, then score. Factuality schema for phrasing lossiness: artifact ⊂ standard = lossy (omission); artifact ⊃ standard = scope-creep/bloat; contradiction = method error.

**Ragas claim-decomposition (→ countable lossiness):** decompose the artifact into atomic claims; coverage = fraction of the standard's points that survive, and fraction of the artifact's claims actually supported by the standard vs invented. Turns "is it lossy?" into a ratio.

## B. How to structure a rigorous review (inspection methodology)

**Fagan inspection — the three-pass spine + role separation:**
- Phases: planning → overview → preparation (individual study — where most defects are found) → inspection meeting → rework → follow-up.
- Roles: Author (wrote it; does the rework; does NOT narrate their own work); **Reader (paraphrases the artifact in their own words** — surfaces the gap between intended and actual); Inspector (raises defects); Moderator (owns the process, verifies rework, impartial); Scribe (logs).
- Disciplines to lift: **LOG defects, don't FIX them in the review** (fixing is a separate pass); **author ≠ reviewer**; the high-level REFERENCE = our captured standard, and a defect = any deviation of the artifact from it; **entry criteria** (don't review junk) / **exit criteria** (don't pass until met); **follow-up verifies each item is fixed AND no new defects were introduced**; **rate limits** — inspect in bounded chunks, don't skim a huge artifact in one gulp (detection collapses past ~400 LOC / ~2 hours).

**Perspective-Based Reading (PBR) — multiple lenses, each scoped:**
Read the artifact from several named stakeholder perspectives, each with its OWN question list; combine the independent findings (different lenses catch different defects → union >> one pass). Canonical perspectives → our lenses for a prompt/skill:
- **End-User** — does it actually do the job for whoever invokes it? (completeness of function)
- **Executing-Agent** — can an LLM follow these instructions step-by-step with one reading? (ambiguity, missing steps) — deepen by TRYING TO EXECUTE the skill on a concrete example; gaps surface where the simulation stalls.
- **Adversary / Tester** — where does it break; what input makes it fail; what's untestable/underspecified? (deepen by trying to write the acceptance test from it)
- **Maintainer** — consistent, extensible, contradiction-free?
PBR's deep trick: find defects by TRYING TO BUILD/EXECUTE the downstream artifact. Scope each lens (don't make every lens check everything). Structure beats ad-hoc (CBR/PBR find ~2-3× the defects of ad-hoc).

**Defect taxonomy — tag every finding with one class (Basili/Shull, from IEEE 830):**
1. Omission — a missing step / unhandled input / undefined output format / missing success criteria / undefined term.
2. Ambiguity — an instruction an LLM could read two ways; a vague qualifier with no operational meaning.
3. Inconsistency — two instructions that conflict; an example that contradicts its rule.
4. Incorrect fact — a claim/assumption that's false or impossible under the stated constraints; wrong tool/API name.
5. Extraneous — filler that dilutes signal; irrelevant instruction; redundancy.
6. Misplaced — right content, wrong section (an output rule buried in the persona).

**Severity scale (Nielsen 0-4) → finding tiers + the loop-terminating gate:**
- 0 = not actually a problem (drop it)
- 1 = cosmetic / nit (fix only if time)
- 2 = minor (low priority)
- 3 = major (must fix)
- 4 = catastrophe / blocker (cannot ship)
Justify each severity by Frequency × Impact × Persistence (how often it bites, how bad, can the agent recover). **VERDICT = PASS only when no level-3/4 finding is open** — this is the objective gate that stops nit-driven infinite loops. Multiple independent passes find far more (1 evaluator ~35%, 3-5 ~75%) → run several lenses independently and union.

**Modern code review (Google/SmartBear) — the pragmatic frame:**
- Reviewer checklist generalized: Design (structure makes sense), Functionality (does the job for its users + edge cases), Complexity/over-engineering (bloat, speculative generality), Tests (are there examples / acceptance criteria), Naming/Clarity, Consistency-with-standard, **Every-Line (review the whole artifact; if you can't understand a part, that's a defect, not a skip)**, Context (does it degrade the health of the skill library), and **call out what's good** (calibrated, not only destructive).
- Pass bar: **"net-better with all majors closed," NOT perfect** ("no such thing as perfect, only better") — prevents perfectionist loops.
- Verdict states: Approve / Request-changes (list the blocking defects, loop back). Tag non-blocking as "Nit:".
- Chunk/rate discipline: review bounded chunks; don't rubber-stamp a large artifact in one skim.

## C. Resulting design (sketch for the build)
Inputs: the artifact + the captured standard + the artifact TYPE (to scope which criteria apply).
Method: (1) Reader-paraphrase what the artifact actually does. (2) Run the four lenses independently. (3) Each finding = {span quoted, standard-passage quoted, defect-class, severity 0-4 justified, fix}. (4) Apply the bias guardrails (esp. re-grade blind to "v2"). (5) Reason before verdict; per-criterion before overall. (6) Resolution audit = YES/NO checklist from the standard; PASS iff no open 3/4 AND net-better. (7) Verdict keep/major-revise/rebuild with per-level descriptors; output {paraphrase, findings[], resolution-audit, verdict}. Pointwise, reference-grounded, log-don't-fix, author≠reviewer. It IS the concrete "section the verifier" step the other skills reference, and it reviews itself.
