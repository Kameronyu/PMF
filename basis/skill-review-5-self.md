# Adversarial-reviewer self-review (review #5)

TARGET: `skills/adversarial-reviewer/SKILL.md`
STANDARD: `reviewer-research.md`
ARTIFACT TYPE: a Claude skill (instruction prompt executed by another agent)
Prior review: none (resolution_audit empty)

---

## paraphrase

- **Frontmatter / description (L1-12):** Declares the skill triggers on "review / critique / audit this skill or prompt" and on "did this revision fix prior findings." It grades pointwise (one artifact vs a standard), is reference-grounded, and logs defects without fixing them.
- **Header + Inputs/Output/Consumed-by (L14-18):** Four inputs (artifact, captured STANDARD, artifact TYPE, optional prior review). Output is four parts: paraphrase, findings[], resolution_audit, verdict. Consumed by the artifact's builder, skill-builder (verify step), system-designer (step 7).
- **Core stance (L20-21):** Critique against the standard, not taste. A finding is valid only if it quotes the artifact span AND the standard passage (or artifact's own rule); otherwise drop it. Log, don't rewrite.
- **One job, separated roles (L23-26):** Reviewer critiques, never fixes; must paraphrase actual text before judging; grade pointwise.
- **Bias guardrails (L28-34):** Judge blind to revision status; length ≠ quality; tone/citations don't move verdict; check each reasoning step; penalize standard-violations not style; reason before verdict.
- **Step 1 Paraphrase (L36-37):** Restate the artifact section by section; a part you cannot restate becomes an Ambiguity finding.
- **Step 2 Four lenses (L39-43):** End-User (Omission), Executing-Agent (execute on one concrete example, log every stall), Adversary/Tester (find failing input, try to write the acceptance test), Maintainer (Inconsistency/Extraneous/Misplaced).
- **Step 3 Lossiness (L45-50):** Decompose into claims; standard-point-absent = Omission; artifact-claim-absent-from-standard = Extraneous/Incorrect-fact; contradiction = Inconsistency/Incorrect-fact. Report coverage ratio = kept ÷ total.
- **Step 4 Self-consistency (L52-53):** Test the artifact against its own rules; scan its own prose for what it forbids.
- **Finding unit (L55-60):** {id, lens, defect_class, span, violates, severity, fix}; six defect classes; severity 0-4 justified by frequency × impact × recoverability; fix is a mechanical instruction.
- **Resolution audit (L62-63):** Only with a prior review; mark RESOLVED/PARTIAL/UNRESOLVED with quoted evidence; regression check for new level-3/4.
- **Verdict (L65-70):** PASS / REVISE / REBUILD / UNCERTAIN-needs-human.
- **Output contract (L72-80), Membership test (L82-88), Worked example (L90-93), Composition (L95-96), Sources (L98-106).**

---

## findings

- **F1** — { id: F1, lens: Adversary/Tester, defect_class: Omission, span: the entire Step 2 / verdict path contains no rate/chunk limit — e.g. "## Step 2 — Read through four lenses (run each independently, then merge the findings)", violates: reviewer-research L52 "**rate limits** — inspect in bounded chunks, don't skim a huge artifact in one gulp (detection collapses past ~400 LOC / ~2 hours)" and L82 "Chunk/rate discipline: review bounded chunks; don't rubber-stamp a large artifact in one skim", severity: 2, fix: Add to Step 1 or Step 2: "If the artifact exceeds ~400 lines, split it into bounded chunks and review each separately; do not review a large artifact in one pass." }

- **F2** — { id: F2, lens: End-User, defect_class: Omission, span: Verdict section L65-70 lists PASS/REVISE/REBUILD/UNCERTAIN but states the bar only as "no open level-3 or level-4 finding remains. Ship it.", violates: reviewer-research L80 "Pass bar: **\"net-better with all majors closed,\" NOT perfect** (\"no such thing as perfect, only better\")" and L86 "PASS iff no open 3/4 AND net-better", severity: 2, fix: Add "and net-better than the prior version" to the PASS condition, and add the "no such thing as perfect, only better" framing so the gate is not read as demanding perfection. }

- **F3** — { id: F3, lens: End-User, defect_class: Omission, span: Modern-code-review checklist is absent; the skill never instructs the reviewer to "call out what's good" — the four lenses (L39-43) are purely defect-hunting, violates: reviewer-research L79 "**call out what's good** (calibrated, not only destructive)", severity: 2, fix: Add a line to the output contract or stance: "Also note what the artifact does well, so the verdict is calibrated rather than only destructive." }

- **F4** — { id: F4, lens: Maintainer, defect_class: Omission, span: the bias guardrails L28-34 enumerate six guards, dropping Position, Compassion-fade, Bandwagon, Sentiment, Self-enhancement, Diversity from the CALM 12, violates: reviewer-research L10-22 "Judge bias self-audit checklist (CALM, 12 biases)" listing all twelve incl. "8. Sentiment — swayed by emotional tone (hardest bias for all models — watch it)" and "1. Position", severity: 2, fix: Either add the dropped biases (at minimum Sentiment, flagged as hardest, and Bandwagon) or add a sentence stating the compression is deliberate and which biases were folded in. The current set silently omits the bias the research explicitly flags as hardest. }

- **F5** — { id: F5, lens: Adversary/Tester, defect_class: Omission, span: nowhere does the skill mention the Panel-of-LLMs / abstain-on-thin-evidence calibration beyond the UNCERTAIN verdict; the PoLL tactic is absent, violates: reviewer-research L25 "(4) Panel of LLMs (PoLL) — 2-3 diverse-family models beat one big judge and cancel self-preference; flag disagreement", severity: 1, fix: Optionally note "for high-stakes reviews, run multiple independent passes and flag disagreement" — or accept the drop as a deliberate single-agent scoping decision. (Logged as a nit because the four-independent-lenses design partly substitutes for multi-pass.) }

- **F6** — { id: F6, lens: Executing-Agent, defect_class: Ambiguity, span: Step 3 L48 "an artifact claim absent from the standard → Extraneous or Incorrect-fact (scope-creep or invented)", violates: the skill's own Core stance L21 "A finding is valid only when it quotes the artifact span AND the standard passage ... it violates" — an Extraneous/Incorrect-fact finding by definition has NO violated standard passage to quote (the claim is absent from the standard), so the gate is unsatisfiable for exactly the class Step 3 generates, severity: 3, fix: Amend the gate: "For Extraneous/Incorrect-fact findings where the claim is absent from the standard, `violates` quotes the standard's SCOPE boundary (or states 'no standard support exists for X') instead of a matching passage." Without this, the executing agent cannot file the very findings Step 3 instructs it to produce. }

- **F7** — { id: F7, lens: Executing-Agent, defect_class: Incorrect-fact, span: severity rubric L59 "Justify the number by frequency × impact × recoverability" and L84 "severity justified by frequency × impact × recoverability", violates: reviewer-research L76 "Justify each severity by Frequency × Impact × Persistence (how often it bites, how bad, can the agent recover)" — the standard's third factor is **Persistence**, and the skill silently renames it "recoverability." (Recoverability is one half of the parenthetical gloss, but Persistence ≠ recoverability: a defect can be persistent yet recoverable.), severity: 2, fix: Restore "frequency × impact × persistence" or state the factor as "persistence (and recoverability)" to match the standard. Self-consistency note: the Worked example L93 uses "low-recoverability" consistently with the skill's own renamed term, so the skill is internally consistent but lossy vs the standard. }

- **F8** — { id: F8, lens: Maintainer, defect_class: Extraneous, span: Sources L98 "(provenance only — you do not need to open these)" followed by 9 lines of citations L99-106, violates: the skill's own Core-stance principle that the standard is the reference and the artifact should carry load-bearing instruction only — and self-consistency vs bias guardrail L31 "impressive-sounding citations do not change a verdict"; the dense citation block is exactly the authority-signal the skill warns reviewers to discount, embedded in the skill itself, severity: 1, fix: Keep (provenance is legitimately useful) but acknowledge: this is a nit, not a blocker, since the block is explicitly fenced as non-load-bearing. }

- **F9** — { id: F9, lens: Adversary/Tester, defect_class: Ambiguity, span: Step 2 Executing-Agent L41 "Execute the artifact on one concrete example; log a finding at every point where the simulation stalls", violates: the skill's own untestability concern (Adversary lens L42 "what is underspecified or untestable") — "one concrete example" is unspecified: who chooses it, must it be adversarial or typical, and what counts as a "stall" is undefined, so two reviewers run different tests, severity: 2, fix: Specify: "Pick one realistic input artifact of the target TYPE; a 'stall' = any step where you cannot determine the single next action from the text alone. Prefer an input that exercises a branch (e.g., the prior-review path)." }

- **F10** — { id: F10, lens: Maintainer, defect_class: Inconsistency, span: defect_class enum L57 is "Omission, Ambiguity, Inconsistency, Incorrect-fact, Extraneous, Misplaced" (six), but Step 2 lens annotations only surface five — the Maintainer lens L43 lists "Inconsistency, Extraneous, Misplaced" and no lens is mapped to catch Incorrect-fact except Adversary L42, while End-User maps only to Omission, violates: reviewer-research L54-60 PBR principle "Scope each lens (don't make every lens check everything)" combined with L62-68 requiring all six classes be reachable — the mapping is fine, but Incorrect-fact appears under Adversary while Step 3 ALSO generates Incorrect-fact, creating two non-co-located homes for one class with no cross-reference, severity: 1, fix: Add a one-line note that Incorrect-fact can arise from either the Adversary lens or the Step 3 lossiness check. (Nit — both paths are individually valid.) }

---

## resolution_audit

(empty — no prior review supplied)

---

## verdict

```
verdict: REVISE
blocking_findings: [F6]
evidence:
  F6 is the single open level-3 finding. The Core-stance gate (L21) requires every
  finding to quote "the standard passage ... it violates," but Step 3 (L48) instructs
  the agent to file Extraneous/Incorrect-fact findings for claims ABSENT from the
  standard — which have no such passage to quote. The gate is unsatisfiable for a
  class the skill itself mandates, so an executing agent following the skill literally
  cannot complete Step 3 (demonstrated in F6 of this very run, which had to quote a
  SCOPE boundary rather than a matching passage to file F8). This is frequent (every
  review with scope-creep), high-impact (blocks a whole defect class), and
  low-recoverability (the agent has no in-skill instruction to fall back on).

  F1-F5, F7 are level-2 lossiness findings: coverage ratio against reviewer-research
  is ~10 standard points dropped or altered out of ~30 load-bearing points
  (≈ 0.7 coverage). The biggest losses are rate/chunk limits (F1), the net-better/
  not-perfect framing (F2), call-out-what's-good (F3), the CALM bias set incl.
  Sentiment (F4), and the persistence→recoverability rename (F7). None alone blocks,
  but together they erode the research standard's calibration and anti-loop guards.

  Strengths (calibration, per L79): the skill faithfully preserves the load-bearing
  spine — reference-grounded pointwise grading, the quoted-pair anti-hallucination
  gate, log-don't-fix / author≠reviewer, the four PBR lenses with execute-on-example,
  the six-class taxonomy, severity 0-4, reason-before-verdict, the abstain verdict,
  and it correctly reviews itself. These are the highest-value items in the research.

  Recommendation: fix F6 (one-clause amendment to the gate), then PASS is reachable
  without touching the level-2 items; address F1/F2/F4/F7 opportunistically to raise
  coverage.
```
