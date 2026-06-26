# Adversarial-reviewer self-review (review #6 — confirmatory re-review)

TARGET: `skills/adversarial-reviewer/SKILL.md` (revised)
STANDARD: `reviewer-research.md`
ARTIFACT TYPE: a Claude skill (instruction prompt executed by another agent)
PRIOR REVIEW (audited): `skill-review-5-self.md` (findings F1–F10, verdict REVISE on F6)

Bias note: judged blind to revision status. The "revised" label was not allowed to
raise any score; each resolution claim below is grounded in a quoted span from the
current text, and the fresh lens pass was run independently of the prior verdict.

---

## paraphrase

The revised skill is structurally identical to the version reviewed in #5 (same
spine: description/triggers → Inputs/Output/Consumed-by → Core stance → separated
roles → bias guardrails → Step 1 Paraphrase → Step 2 four lenses → Step 3 lossiness
→ Step 4 self-consistency → finding unit → resolution audit → verdict → output
contract → membership test → worked example → composition → sources). The changes
versus #5 are localized: (a) the Core stance gate (L21) and finding-unit `violates`
clause (L60) now admit a "standard scope the claim falls outside" alternative for
claims absent from the standard; (b) bias guardrails (L31) now name tone/sentiment
as the hardest bias plus confidence/citations; (c) Step 2 close (L45) adds bounded-
chunk review and a "record what the artifact does well" instruction; (d) the output
contract gains a `strengths:` line (L79); (e) severity is justified by "frequency ×
impact × persistence" (L61, L88), restoring the standard's term; (f) PASS is framed
as "no open major defect, not perfection" (L69).

---

## findings (NEW only)

None. The fresh four-lens + self-consistency pass surfaced no new level-3 or
level-4 finding, and no new level-1/2 finding beyond the prior set that remained
open as nits. The previously-blocking F6 is resolved; the revision introduced no
regression (see regression check).

---

## strengths

- The load-bearing spine is fully preserved: reference-grounded pointwise grading,
  the quoted-pair anti-hallucination gate, log-don't-fix / author≠reviewer, the four
  PBR lenses with execute-on-one-example, the six-class taxonomy, severity 0–4,
  reason-before-verdict, and the abstain (`UNCERTAIN — needs human`) verdict.
- The F6 fix is minimal and correct: the gate (L21, L60) now expressly handles the
  one defect class — claims absent from the standard — that previously could not be
  filed, with no collateral edits.
- The added `strengths` instruction (L45) + output line (L79) close the calibration
  gap (F3) without diluting the defect-hunting lenses.
- Self-consistent: the worked example (L95) and membership test (L85-91) still match
  the revised finding unit, and the persistence rename (F7) is now consistent across
  L61, L88, and the example's "low-recoverability" gloss.

---

## resolution_audit

- { prior_id: F1, status: RESOLVED, evidence: L45 "Review the artifact in bounded chunks — section by section; do not judge a long artifact in one skim." — the rate/chunk discipline (research L52/L82) is now present. }
- { prior_id: F2, status: RESOLVED, evidence: L69 "Ship it; the bar is \"no open major defect,\" not perfection." — the not-perfect framing (research L80) is now in the PASS condition. }
- { prior_id: F3, status: RESOLVED, evidence: L45 "also record what the artifact does well (its load-bearing strengths), so the verdict stays calibrated rather than only destructive." + L79 output-contract "strengths: [ ... ]" — research L79 "call out what's good" satisfied. }
- { prior_id: F4, status: RESOLVED, evidence: L31 "Tone and sentiment do not change a verdict (this is the hardest bias to resist — watch it); neither do confidence or impressive-sounding citations." — the bias research flagged as hardest (research L18, item 8) is now explicitly named, with authority/citations folded in. The full CALM-12 enumeration is still compressed, but the specific gap F4 raised (the hardest bias, silently dropped) is closed. }
- { prior_id: F5, status: UNRESOLVED, evidence: no Panel-of-LLMs / multi-pass clause added; the text still relies on the four independent lenses. Non-blocking — F5 was logged sev 1 (nit) and the four-independent-lenses design partly substitutes. }
- { prior_id: F6, status: RESOLVED, evidence: L21 "or — for a claim absent from the standard — the standard scope the claim falls outside." and L60 "or — when the claim is absent from the standard (Extraneous / Incorrect-fact) — names the standard scope the claim falls outside. A finding with a quoted `span` but none of these is dropped." The gate now admits exactly the class Step 3 (L48-50) generates; the unsatisfiability is removed. This was the sole blocker. }
- { prior_id: F7, status: RESOLVED, evidence: L61 "Justify the number by frequency × impact × persistence." and L88 "severity justified by frequency × impact × persistence." — matches research L76 "Frequency × Impact × Persistence"; the "recoverability" rename is reverted while the parenthetical recoverability gloss survives in the worked example consistently. }
- { prior_id: F8, status: UNRESOLVED, evidence: L101-109 citation block remains, still fenced L101 "(provenance only — you do not need to open these)". Non-blocking — F8 was logged sev 1 and accepted as legitimate fenced provenance. }
- { prior_id: F9, status: UNRESOLVED, evidence: L41 still reads "Execute the artifact on one concrete example; log a finding at every point where the simulation stalls" with no specification of which example to pick or what counts as a "stall." Non-blocking — sev 2, not a major. Recommend addressing opportunistically. }
- { prior_id: F10, status: UNRESOLVED, evidence: no cross-reference added between the Adversary lens (L42) and Step 3 (L48) as twin homes for Incorrect-fact. Non-blocking — sev 1 nit; both paths remain individually valid. }

Regression check: PASS. The revised spans (L21, L31, L45, L60, L61, L69, L79) were
each re-read against the rest of the skill. No new contradiction, ambiguity, or
omission of severity ≥ 3 was introduced. The new L21/L60 scope-boundary clause is
consistent with Step 3 (no longer in tension); the `strengths` output line matches
the L45 instruction; the persistence rename is uniform. No NEW level-3 or level-4
finding.

Resolution summary: 6 RESOLVED (F1, F2, F3, F4, F6, F7) — including the sole prior
blocker F6 — and 4 UNRESOLVED, all of which are non-blocking (F5 sev1, F8 sev1,
F9 sev2, F10 sev1). No open level-3 or level-4 finding remains.

---

## verdict

```
verdict: PASS
blocking_findings: []
evidence:
  By the skill's own rule (L69) PASS holds iff no open level-3 or level-4 finding
  remains. The single prior blocker — F6, sev 3 — is RESOLVED: the Core-stance gate
  (L21) and finding-unit clause (L60) now explicitly admit a "standard scope the
  claim falls outside" alternative for claims absent from the standard, so the gate
  is satisfiable for the Extraneous/Incorrect-fact class that Step 3 (L48-50)
  mandates. The regression check found no new level-3/4 finding introduced by the
  revision. The four remaining open items (F5, F8, F9, F10) are all sev 1-2 and
  non-blocking by the gate. Judged blind to revision status — the verdict flips to
  PASS only because the load-bearing defect was actually fixed in the text quoted
  above, not because the artifact is labeled "revised." Ship it; the bar is no open
  major defect, not perfection.

  Optional follow-ups to raise coverage (none blocking): F9 (specify the concrete
  example + define "stall"), F4 residue (name the remaining CALM biases), F5/F8/F10
  nits.
```
