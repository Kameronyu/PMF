# Handoff — Re-running the KB Mechanizer without the kb-hooks failures

**Why this exists:** the last mechanize pass (`kb-hooks`) hardened a KB topic the way you'd harden a STRUCTURED-OUTPUT agent. That was right for half the topic, wrong for the other half, and it fused both halves into one bloated skill. This handoff tells a fresh session how to redo it.

**References (read all three first):**
- `skill-builder` (rigid / structured outputs): `C:\Users\kyu3\Claude\Projects\pmf3\skills\skill-builder`
- `prose-builder` (prose / felt outputs — the sibling): `C:\Users\kyu3\Claude\Projects\pmf3\skills\prose-builder`
- Evidence base: `C:\Users\kyu3\Claude\Projects\pmf3\research--copy-prose-and-llm-elicitation.md`

---

## The one rule that fixes most of it

A KB topic skill almost always contains TWO jobs:

- **SCORE / EVALUATE** — judged, structured classifications (e.g. a hook's 7-criteria DISCARD / VIABLE / HIGH-PRIORITY). → harden with **skill-builder**.
- **WRITE / GENERATE** — prose the reader feels (the hook itself). → build with **prose-builder**.

Route them to the two different methods, and **SPLIT them into two skills** (`kb-<topic>-score` and `kb-<topic>-write`). Do not co-house them: a skill that writes and scores its own output self-grades, and the writer learns to optimize toward passing its own gate instead of toward the reader.

---

## What went south in kb-hooks (and the corrective for each)

1. **Writer + scorer in one mechanized skill → self-preference conflict.** A model rates its own output higher, so a fused write+score skill games its own gate. → **SPLIT.** The scorer is a SEPARATE pass on a different model (prose-builder §"split the WRITER from the SCORER").

2. **The 5 writing formulas were mechanized into REQUIRED ordered slots** (R-SPE-05/07/09/11/12) → compliant, same-y hooks, and the proven specimens (the Spencer/Mark worked examples) were abstracted away into slot descriptions. → **Lead with the real specimens; keep formulas OPTIONAL** (prose-builder §1, §3). Specimens beat rule-stacks — this is the strongest finding in the research.

3. **Heavy positive+negative constraint on the GENERATIVE step → regression to the bland mean** — the opposite of a scroll-stopper. → Steer the writer lightly; constrain the *contract* and the *checks*, not the wording (prose-builder §2, §6).

4. **Negative prose bans inside the writer** (e.g. R-SPE-03b "no rhetorical questions / clever wordplay") → ironic rebound (banning a token makes it a stronger prior), and wrong location. → Move every prose ban to a **≤5-item post-hoc check**, each paired with a positive target (prose-builder §5).

5. **Pseudo-precise gates** — C1 "open loop / would a viewer stop here?" was laundered as a FALSE-returning membership test when it is a felt Tier-2 judgment (and was self-graded). → In the scorer, **hard-gate only the countable** (C4 specificity / round-number, C5 length, C7 timeframe); **demote curiosity/credibility/pain-resonance to triage signals** scored PAIRWISE against a winning specimen, never self-graded (prose-builder §4 tiers; research §3).

6. **Bloat** — the mechanized SKILL.md ballooned (term preamble + every rule + every example inline). → Keep it **LEAN**: term definitions and example banks go in `references/`; SKILL.md stays tight (progressive disclosure). Length is a smell, not a sign of rigor.

---

## Per-topic procedure for the mechanizer

1. Read the source file(s). **Triage every chunk** into SCORING content vs WRITING content.
2. Build `kb-<topic>-score` with **skill-builder**, applying three-tier discipline: hard-gate the countable, soft-cap the heuristic, demote felt criteria to triage signals (NOT hard gates dressed as membership tests).
3. Build `kb-<topic>-write` with **prose-builder**: 3–5 preserved specimens up top, a few positive craft targets, OPTIONAL patterns, and a separate rubric+specimen judge.
4. **Keep structural / routing rules** (e.g. "fear hook for problem-aware, negative-curiosity for solution/product-aware"; "Push-Pull resolves within 5–10s"). Those are contract constraints and are fine to mechanize. Only the WORDING-level generation is off-limits to hard rules.
5. **Preserve specimens verbatim.** Keep each SKILL.md lean; push defs/examples to references.

---

## Acceptance check before shipping a redone topic

A test that can FAIL — any NO means not done; name the gap:
- Are SCORE and WRITE **separate skills** (no self-grading)?
- Does the writer **lead with real specimens**, not slot templates?
- Are felt criteria **triage signals** (pairwise vs specimen), with only countable ones hard-gated?
- Are negatives **≤5 and in the checker**, not the generator?
- Are structural/routing rules kept, wording-level rules dropped?
- Is each SKILL.md **lean** (defs/examples in references)?
