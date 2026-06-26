# Design spec — rebuilt kb-mechanizer (router architecture)

**Method:** built by running `system-designer`'s 7-step workflow (the pipeline builder) with `skill-builder` hardening the one judged node (TRIAGE). `prose-builder` is NOT used to build the mechanizer — it is a *routing target* the mechanizer invokes for write-content. Architecture choice: **Option B** (split a topic into write+score skills only where it has both jobs), confirmed by internal + external research.

**Goal:** turn `{topic}--{source}.md` KB files into hardened, AI-executable skill files, where each content chunk is routed to the method that fits it (WRITE→prose-builder, SCORE→skill-builder, ROUTE→contract, REFERENCE→shared defs), and a topic emits two skills only when it carries both a generative and a scoring job.

**Hard constraints (carried from the handoff + the failure post-mortem):** lean SKILL.md (progressive disclosure; defs/examples in `references/`); specimens preserved verbatim; exactly one mandatory multi-agent seam (writer ≠ scorer); strip the orchestration that bred the v1/v2/v3 bugs (no per-run system-designer pre-pass, no per-term parallel workers, no 3 parallel reviewers, no unbounded evaluator-optimizer loops).

---

## Step 1 — Decompose into single-job steps

Six steps. Each is one job-TYPE; the split between BUILD-WRITE and BUILD-SCORE is warranted because they are different job-types (generate vs. evaluate) AND it cures self-preference; the split from VERIFY is the mandatory sectioning seam. Everything else stays single-context — no over-sharding.

| # | Step | Job-type | Agent? |
|---|---|---|---|
| S1 | INVENTORY | gather | script-led, no LLM judgment |
| S2 | TRIAGE | classify | **LLM, skill-builder-hardened** (the load-bearing judgment) |
| S3 | SHAPE | route/decide | script (derives skill-set from S2 counts) |
| S4-SCORE | BUILD-SCORE | synthesize (structured) | LLM via skill-builder method — runs only if `emit_score` |
| S4-WRITE | BUILD-WRITE | synthesize (prose) | LLM via prose-builder method — runs only if `emit_write`; **separate agent from S4-SCORE** |
| S5 | VERIFY | screen | LLM via adversarial-reviewer — **separate lane/model** |
| S6 | WRITE-OUT | persist | script |

What was **deleted** vs. the old 14-step skill, and why it's safe: the per-run `system-designer` pre-pass (ceremony for a 1–3-file topic — fold its one useful output, the worker budget, away entirely), Steps 3a/3b ambiguity sub-pipeline with per-term parallel workers (this is where NF3's threshold bug lived; replaced by "reference the shared term registry; escalate a genuine conflict to a human-review file"), and the 3-parallel-reviewer global consistency pass (8a; demoted to a check inside S5 against the shared `definitions.md`). Net: 14 → 6 steps, one mandatory agent seam instead of four orchestration loops.

---

## Step 2 — Typed handoff contracts (every field names a consumer or is dropped)

```
S1 INVENTORY
  INPUTS: project root; optional topic filter
  OUTPUT:
    - topic_chunks: [ {topic, file, block_id, text} ]   -> consumed by: TRIAGE
    - term_registry_ptr: path                            -> consumed by: BUILD-SCORE, BUILD-WRITE
  DECIDES-ONLY: file→topic grouping; chunk boundaries (script-split on headings/blank lines)
  MUST-NOT-DECIDE: any chunk's class (TRIAGE's lane)

S2 TRIAGE   (one chunk in, one typed verdict out)
  INPUTS: one chunk {text, topic, block_id} + term_registry_ptr   [minimal clean slice]
  OUTPUT:
    - chunk_class: enum WRITE|SCORE|ROUTE|REFERENCE   -> consumed by: SHAPE, BUILD-SCORE, BUILD-WRITE
    - score_tier:  enum COUNTABLE|HEURISTIC|FELT|NA    -> consumed by: BUILD-SCORE   (NA unless class=SCORE)
    - source: traces_to:<file#block_id>               -> consumed by: VERIFY
    - evidence_quote: verbatim substring of the chunk  -> consumed by: VERIFY
    - checks: [{text, passed, evidence}]               -> consumed by: VERIFY
  DECIDES-ONLY: this chunk's class + (if SCORE) its tier
  MUST-NOT-DECIDE: the topic's skill set; whether wording gets mechanized (the class decides that)

S3 SHAPE   (script; derives the skill set per Option B)
  INPUTS: all of a topic's TRIAGE verdicts
  OUTPUT:
    - emit_score: bool   # true iff >=1 SCORE chunk whose tier is COUNTABLE or that is membership-testable
    - emit_write: bool   # true iff >=1 WRITE chunk (a real generative job)
    - skill_set: {score?: kb-<topic>-score, write?: kb-<topic>-write}   -> consumed by: BUILD-*, WRITE-OUT
  DECIDES-ONLY: how many skills this topic emits, and which
  MUST-NOT-DECIDE: the content of either skill

S4-SCORE BUILD-SCORE  (skill-builder method)         [lane: structured; runs iff emit_score]
  INPUTS: the topic's SCORE + ROUTE chunks (+ ROUTE rules that gate scoring) + term_registry
  OUTPUT: skills/kb-<topic>-score/SKILL.md (+ references/)  -> consumed by: VERIFY
  DECIDES-ONLY: the scorer's gates and tiers
  MUST-NOT-DECIDE: any wording the writer produces; must NOT score its own output

S4-WRITE BUILD-WRITE  (prose-builder method)         [lane: prose; runs iff emit_write; SEPARATE agent]
  INPUTS: the topic's WRITE chunks (verbatim specimens) + ROUTE chunks (as contract/steering) + term_registry
  OUTPUT: skills/kb-<topic>-write/SKILL.md (+ references/ specimen bank)  -> consumed by: VERIFY
  DECIDES-ONLY: specimens-up-front, craft targets, OPTIONAL patterns, contract rules
  MUST-NOT-DECIDE: its own gate/score (the scorer is a separate skill; never self-grade)

S5 VERIFY   (adversarial-reviewer; separate model)   [the mandatory sectioning seam]
  INPUTS: each emitted SKILL.md + the captured STANDARD (below)
  OUTPUT:
    - sound: bool
    - failing_gaps: [ {skill, check_id, span, fix} ]   -> consumed by: BUILD-* (one retry) then WRITE-OUT/human
  DECIDES-ONLY: pass/revise/escalate against the standard
  MUST-NOT-DECIDE: rewrites (it routes a gap back; it does not author)

S6 WRITE-OUT  (script)
  INPUTS: verified skills; term escalations; proposed definitions.md additions
  OUTPUT: files on disk + one human-review file (escalations + additive def proposals) + a run log
```

---

## Step 3 — Lanes (sectioning + reject-lists)

The one seam that must be two agents/models: **the producer of prose (S4-WRITE) is never the screener of it (S5)**, and within a both-jobs topic the **write skill and the score skill are separate artifacts**, so at runtime neither grades itself. This is the single defect the whole rebuild exists to remove (self-preference). Every other step stays in one context.

Reject-lists (one line each, at the end of each step's prompt): TRIAGE must not decide the skill set; BUILD-WRITE must not emit a gate/score or abstract a specimen into a slot; BUILD-SCORE must not emit wording or hard-gate a FELT criterion; VERIFY must not author rewrites.

---

## Step 4 — Gates + the Closer (bounded; no unbounded loops)

A real predicate sits on each edge (not "looks done"): TRIAGE→ every chunk has a class + a verbatim `evidence_quote` (script-checkable substring) or it is `BLOCKED`. BUILD-WRITE→ every specimen is a verbatim substring of a source file (script foreign-key check — this is the anti-rot gate that stops specimens decaying into templates). Each SKILL.md→ passes the leanness check (length bound; defs/examples must live in `references/`).

The **Closer** handles the one field that legitimately can't fill: a topic has a generative job but **<3 usable specimens** in the source. Declared **SOFT** — log `specimens_found: N`, flag the write skill `[BELOW SPECIMEN FLOOR — human to add ≥3]`, continue. Genuine **cross-topic term conflict** → SOFT escalate to the human-review file (replaces the old per-term worker pipeline). Load-bearing structural failure (a SCORE skill with zero FALSE-capable gates) → **HARD** halt with `BLOCKED:<skill>`. Every loop is bounded: VERIFY routes a gap back **once**; persistent → escalate, never re-loop.

---

## Step 5 — Provenance across handoffs

Each TRIAGE verdict carries `source: traces_to:<file#block>` + a verbatim `evidence_quote`; a script confirms the quote still appears at WRITE-OUT — no model call. Specimens travel with their verbatim source span. Caveats are typed fields, not prose: `score_tier`, `specimens_found:N`, `below_specimen_floor:bool`, `term_conflict:bool`. Nothing arrives looking more certain than it left.

---

## Step 6 — Determinism (one command; judgment in LLMs, plumbing in scripts)

Fixed DAG, idempotent steps. Scripts (not tokens) do: chunk-splitting (S1), the SHAPE count→skill-set decision (S3), the specimen-verbatim substring check, the round-number / length / timeframe COUNTABLE gates inside a score skill, and the leanness/length check. The LLM does only the three genuine judgments: TRIAGE (classify), BUILD-* (synthesize), VERIFY (screen).

---

## Step 7 — Section the verifier — the captured STANDARD

S5 runs `adversarial-reviewer` against a standard that can FAIL **on the right axis** — the handoff's six acceptance checks, restated as falsifiable gates, plus the write/score discrimination and leanness. This is the fix for the deepest failure: three prior review rounds polished internal consistency and never caught that prose was being mechanized, because the standard didn't ask. Now it does:

1. Are SCORE and WRITE **separate skills** for any both-jobs topic (no runtime self-grading)?
2. Does each write skill **lead with ≥3 verbatim specimens** (substring-confirmed), not slot templates?
3. Are FELT criteria **pairwise-vs-specimen triage signals**, with only COUNTABLE ones hard-gated?
4. Are negatives **≤5 and located in the checker**, each paired with a positive target?
5. Are ROUTE rules kept as contract; are wording-level rules absent from the scorer?
6. Is each SKILL.md **lean** (defs/examples in `references/`; under the length bound)?

---

## The hardened TRIAGE node (skill-builder applied — the centerpiece)

This is the node that fixes kb-hooks. Every membership gate below is FALSE-capable and each worked example is a real kb-hooks mistake, annotated with the gate that now catches it.

```
FIELD: chunk_class        ALLOWED (echo one): WRITE | SCORE | ROUTE | REFERENCE
MEMBERSHIP TEST (all the chosen class's gates YES; the rival disqualifier NO):

WRITE  — YES if the chunk's payload is wording a reader FEELS (a hook line, headline, body,
         or a formula that dictates the actual words) AND a separate checker could NOT mark
         it wrong purely by shape.
         ANTI-ROT GATE: if routing this chunk to SCORE/ROUTE would require turning felt wording
         into a hard pass/fail gate or a required ordered slot -> it is WRITE; keep it as
         specimen/steering, do NOT mechanize the wording.
         DISQUALIFIER (-> not WRITE): the chunk only assigns a label/band and dictates no wording.

SCORE  — YES if the chunk yields a judged classification or pass/fail gate whose output a
         separate checker COULD mark wrong by shape (a category, a criterion verdict, a band).
         THEN set score_tier:
           COUNTABLE  — reduces to a deterministic check (round-number test, length/sentence
                        bound, timeframe-present, regex/contains). -> hard-gate.
           HEURISTIC  — a count with a real false-positive rate (passive voice, filler density).
                        -> soft-cap / warn, never hard-fail.
           FELT       — a judgment of feel ("would a viewer stop here?", curiosity, resonance).
                        -> NOT a membership gate; a pairwise-vs-specimen triage signal, never self-graded.
         DISQUALIFIER (-> not SCORE): the verdict is purely felt with no countable core and no
         specimen to compare against -> that is steering for the writer (WRITE), not a gate.

ROUTE  — YES if the chunk selects among options or orders/sequences steps by a NAMED trigger
         (which hook type for which awareness stage; "resolve within 5-10s") WITHOUT dictating wording.
         DISQUALIFIER (-> not ROUTE): it dictates the actual words (WRITE) or assigns a quality verdict (SCORE).

REFERENCE — YES if it states what a term IS, or sets context, with no obligation and no felt-prose
         output. -> goes to shared definitions/references, not into a writer or scorer body.

PROVENANCE: every chunk carries source + a verbatim evidence_quote (script-confirmable). No quote -> BLOCKED.

EXAMPLES (each passes its own gate; audit as if agent output):
  - "every sentence withholds one piece of info resolved by the next"  -> WRITE
        (anti-rot gate fires: hard-gating it would cage wording)   [kb-hooks mis-mechanized: R-SPE-01a]
  - "Would a viewer stop watching here?"                                -> SCORE / FELT
        (pairwise-vs-specimen triage, never a FALSE-returning gate) [kb-hooks laundered: R-SPE-01d]
  - "if the only numeric claim is a round number, FAIL Criterion 4"    -> SCORE / COUNTABLE
        (deterministic round-number script gate)                   [correctly mechanizable]
  - "fear hook for problem-aware; negative-curiosity for solution-aware" -> ROUTE
        (selection by named trigger, no wording)
  - "A hook is the packaging that buys attention to receive the message" -> REFERENCE
```

COMPLETENESS for the node: PRESENCE (class set; tier set if SCORE; evidence_quote present) + SOUNDNESS (class passed its membership gate; SCORE chunk has a tier; evidence_quote is a verbatim substring) → `emit_ready` else `BLOCKED:<field>`.

---

## Acceptance test for the skill itself (any NO = not done)

- Is the mechanizer's lead method `system-designer`, with `skill-builder` hardening TRIAGE and `prose-builder` used only as a routing target (never to build the mechanizer)?
- Is the DAG ≤6 single-job steps with exactly one mandatory writer≠scorer seam, and no per-term worker pool / 3-reviewer global pass?
- Does TRIAGE classify with FALSE-capable gates, including the ANTI-ROT gate and the COUNTABLE/HEURISTIC/FELT tier split?
- Does SHAPE implement Option B (two skills only when emit_write AND emit_score)?
- Are specimens preserved verbatim behind a substring gate; is leanness a ship-blocker?
- Does VERIFY run a separate model against the 6-point standard that can FAIL on the prose-vs-structured axis?
