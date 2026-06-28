---
name: kb-hooks-score
description: >-
  Score a hook for production viability against the 7-criteria system before spending
  test budget. Use to grade hooks (written by a human, kb-hooks-write, or any source) and
  return DISCARD / VIABLE / HIGH-PRIORITY with per-criterion evidence. Hard-gates only the
  countable criteria (specificity, length, timeframe); treats felt criteria (curiosity,
  credibility) as pairwise-against-specimen signals, never self-graded pass/fail. Run as a
  SEPARATE pass from the writer. Triggers: "score this hook", "is this hook worth testing",
  "rank these hooks".
---

# Hooks — score viability before you spend test budget

Grade each hook against 7 criteria, then band it. **Do not run this in the same pass that
wrote the hook** — a writer grading itself rates its own output higher. Score against the
winning specimens in `references/scoring-specimens.md`, ideally on a different model.

Tier discipline (the rule the old fused skill broke): **hard-gate only the countable**;
**soft-cap the heuristic**; **compare the felt against a specimen — never hard-FALSE it.**

## The 7 criteria (each: positive target → how it's judged → tier)

1. **Curiosity / open loop** — *target:* the line withholds something resolved only by
   continuing. *Judge:* FELT — rate pull **pairwise against a winning specimen**, not a
   yes/no gate. Tier: FELT (triage signal; never a hard FALSE).
2. **Pain callout** — *target:* names a *specific* felt pain ("my face is puffy"), not a
   category ("skin issues"). *Judge:* FELT — signal pairwise against a pain specimen;
   specific-vs-category is a felt judgment, not a script gate.
3. **Solution promise** — *target:* contains a claim that resolves the Criterion-2 pain.
   *Judge:* FELT — is a claim present AND does it resolve the named pain (judged, not scripted)?
4. **Specificity** *(highest weight)* — *target:* ≥1 specific non-round number, named
   outcome, or concrete timeframe. *Judge:* **script gate** — contains a number/outcome/
   timeframe AND it is not a round number. Tier: COUNTABLE → **hard-gate**.
5. **Simplicity** — *target:* fewest words that keep the meaning; 1 sentence beats 3.
   *Judge:* **script gate** — sentence/word count under the cap. Tier: COUNTABLE → hard-gate.
6. **Credibility / skepticism-bridging** — *target:* language that pre-empts doubt ("I was
   skeptical too," prior-failure framing, third-party framing, mechanism specificity).
   *Judge:* FELT — signal against a credibility specimen; never a hard FALSE.
7. **Timeframe to results** — *target:* states how fast the outcome arrives ("in 6 days").
   *Judge:* **script gate** — a timeframe token is present. Tier: COUNTABLE → hard-gate.

Per-criterion membership tests and the COUNTABLE gate definitions (round-number test,
length cap, timeframe tokens) are in `references/criteria-tests.md`.

## Bands (derive from criteria that actually passed — not a hollow count)

- **0–3 → DISCARD** (rewrite before any test).
- **4–5 → VIABLE** (moderate test budget).
- **6–7 → HIGH-PRIORITY** (top creative budget).

Count only criteria that passed their tier's check. A felt criterion contributes only when
the pairwise judge prefers it over the specimen; it never manufactures a pass on its own.
**Length override:** a hook scoring 6–7 that runs ≥2 sentences fails Criterion 5 — drop one
band and note "condense to 1 sentence to restore."
**Niche override (structural):** if the hook's niche ∈ {weight-loss, make-money, dating} and
no credibility signal is present (C6 returns `weaker`), cap the band at DISCARD regardless of
count — in saturated niches, omitting credibility causes immediate scroll-past. The niche-list
membership is countable; the credibility absence is the felt C6 signal.

## The negatives live here (≤5), each paired with a positive target

Moved out of the writer (where banning a token summons it). Each is a checker rule:

- **Round-number specificity** → flag; replace "$10,000" with "$9,340". (positive: odd, precise figure)
- **All-curiosity, no specifics** → fails C4 and usually C2/C3; flag PRIORITY REVISION. (positive: one concrete detail)
- **Pain without solution** → flag; add the resolving claim. (positive: pain→relief pairing)
- **Long hook, many criteria** → a 6-criteria 4-sentence hook loses to a 6-criteria 1-sentence hook. (positive: cut to one)
- **Missing credibility in a saturated niche** (weight-loss / make-money / dating) → flag. (positive: add a skepticism bridge)

## Pre-production validation (ROUTE — for VIABLE / HIGH-PRIORITY hooks)

Before committing to video production, route the surviving hooks through the white-square
traffic test: render 10 image ads showing only the hook copy as black text on white; run as
one ad set at $50–100 total; auto-off each ad at 1,000 impressions; the highest-CTR hook
proceeds to production; any hook with zero clicks at 1,000 impressions → reclassify DISCARD.
`[SOURCE: hooks KB pre-production protocol — from the broader KB, beyond the two raw files in this demo]`

## Output contract (per hook)

```
hook: "<verbatim>"
criteria: [ {n, target, verdict: pass|fail|signal, tier, evidence_quote, source} ]
countable_gates: {specificity, simplicity, timeframe}   # script results, pass/fail
felt_signals: {curiosity, pain, solution, credibility}  # pairwise-vs-specimen, prefer|tie|weaker
band: DISCARD | VIABLE | HIGH-PRIORITY
flags: [ ... ]    # from the negatives list
```

## COMPLETENESS — PRESENCE vs SOUNDNESS

**PRESENCE:** every criterion has a verdict; band present.
**SOUNDNESS:** every COUNTABLE verdict came from the script (not eyeballed); every felt
verdict is pairwise-vs-specimen, not self-graded; band derived only from passed criteria;
each `pass` carries an `evidence_quote`. `emit_ready` only if SOUNDNESS holds; else
`BLOCKED:<criterion>`.

## Self-test (is this grader sound?) — any NO, fix

- Are only C4/C5/C7 hard-gated (by script), with C1/C6 as pairwise-vs-specimen signals?
- Is the felt judgment run separately from the writer, against a real specimen?
- Does the band come from criteria that passed their tier's check, not a raw count?
- Are the negatives ≤5, here in the checker, each paired with a positive target?
- Are structural overrides (niche band-cap, pre-production validation) kept as ROUTE rules?
- Is every quoted specimen a verbatim substring of a source file (no composites)?
