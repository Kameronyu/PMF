---
status: brief
role: Per-step build brief for STEP 10 — Adversarial re-review (the modded pipeline-audit, extended). Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 10
covers: Adversarial re-review — the modded, extended pipeline-audit that runs over the redesigned pipeline + the VOC integration. The "rebuild target" here is the review PROCESS itself, not a parent skill.
---

> **What this is:** the reading list + duties for the session that rebuilds the **Adversarial re-review** step. Open this, follow the pointers, build — nothing is copied, every line points into the base. **Start with §"What was already run" — the review PROCESS itself (PART4 + the four AUDITs + the raw annotated prompts) is the as-ran reference and the highest-leverage input.** Unlike the other steps, there is **no `pmf3/SKILL-*` rebuild target** — the thing being rebuilt is the version-triaged adversarial-review method that produced PART4. The re-review is itself an ★ operator-facing gate (● A6).

## In one line
Re-runs the adversarial review over the redesigned pipeline + the VOC integration design — extended to the new VOC seams and the new artifacts — using the **version-triaged propagation method**: prompt-blind grounding pass (Reviewer-B style) + law-prosecution pass, per-finding version-triage (LIVE / OBSOLETE / FALSE-MOOT), propagation check, damage-if-live, with do-not-re-flag discipline for already-absorbed wiring bugs. Emits the audit synthesis → ★ operator.

## ★ Start here — what was already run (highest leverage)
The "as-ran skill" here is the **review process that produced PART4** — read it and its four segment audits and their raw source, before anything else. This is the method you are rebuilding into a repeatable, modded re-review.
- **The process + synthesis (rebuild target):** `reference/reviews/PART4--review-propagation-audit-and-agent-building-skills.md` — the audit-of-the-audits: the method (§Method), the 8-class failure taxonomy (§4), and the proposed build-time agent-building skills (§5). **Read this first** — it *is* the review process, codified.
- **The four segment audits (the method applied):** `reference/reviews/AUDIT-collection.md`, `AUDIT-market.md`, `AUDIT-funnel.md`, `AUDIT-reviewerB.md` — each runs the full version-triaged propagation method on one reviewer output. Read these as worked examples of the re-review you are building.
- **The provenance source:** `reference/reviews/REVIEWS--raw-annotated-prompts.md` — the raw annotated prompts + reviewer findings the audits prosecute against (the operator's `<annotate>` blocks that became PART1's A#/P#).
- **Reader's-guide:** `reference/as-ran-repo/asran-repo-report.md` (§3/§9 the already-absorbed wiring bugs the re-review must NOT re-flag).

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md`** — the re-review sits at the end of the flow (STEP 10, "MODDED ADVERSARIAL RE-REVIEW," ● A6). PART0 gives the end-to-end story the re-review audits against.
2. **`architecture/PART3--architecture-design.md`:**
   - **§10** — the re-review slot. *The spine of the rebuild.* "**Job 9 / re-review slot (● A6):** pipeline-audit extends to the VOC seams and the integration design itself — modded reviewers, evidence manifest grown to the new artifacts. Runs after the Job 3 contracts exist; runs again end-to-end after Job 7 stage revisions." Also read §10's full list of routed ○ slots — the re-review's job is to verify those got filled (not re-deferred).
   - **§6.10 (pipeline-audit half)** — the kept pipeline-audit skill that gains the Job 9 extension.
   - **§6.0** — the soundness Standard the re-review checks every emitting agent against (grounding contract + `carried_risks[]` propagation to the operator at each ★ gate).
   - **§12** — the veto register (the ◆ calls the re-review may re-examine).
3. **The four AUDITs' own SECTION structure** (`reference/reviews/AUDIT-*.md`) — each audit's **SHORTLIST** (highest-severity LIVE findings) + **VALIDATED-KEEP** lists are the regression watchlist the modded re-review must carry forward:
   - `AUDIT-collection.md` — GAP-1/2/3/5 (the four "definition + vibes" residues).
   - `AUDIT-market.md` — GAP-A1 (disclosure-carry), GAP-A2 (floor), GAP-A3 (fit-as-demand), GAP-A8/R2-GAP-2 (avatar inputs).
   - `AUDIT-funnel.md` — GAP A (Command+F runnability), GAP B (proven-fill), GAP C (congruency), GAP D (never-merge regression).
   - `AUDIT-reviewerB.md` — A1 (out-of-chain dependency), B4 ($299 anchor), the three regression watches (§3.1–3.3): laundered-demand path, never-merge weakening, bet-transfer hook-promotion.
4. **`architecture/PART1`** (annotation custody) + **`architecture/PART2--build-order-roadmap.md` → Job 9** — the re-review consumes the whole annotation map to verify nothing was lost, and runs in Job 9's slot (after Job 3 contracts; again after Job 7 revisions).

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- The re-review's entire job is grounding-and-carry enforcement at the system level: it verifies every emitting agent carries `grounding_ref` + `carried_risks[]`, that checks report `PASS | FAIL | CANNOT-EVALUATE` (never PASS over nothing), and that the **whole Register** (MR-001…006 + DR-LAW-a…e) is honored — these are the things it prosecutes.

## Adversarial findings this build must honor (`reference/reviews/`)
Read **the four `AUDIT-*.md` + `PART4`** in full — they are simultaneously this step's *method* and its *findings*. The load-bearing meta-findings the re-review must institutionalize:
- **PART4 §4 — the 8-class failure taxonomy** (C1 underdefined decision verb … C8 n/confidence not surfaced). The re-review's prosecution checklist is exactly these eight classes recurring at new seams.
- **PART4 §0 / the central thesis** — Reviewer B found **no laundered upgrades**; the re-review's question flips from "what was fixed" to "what can now break." The new pre-selection demand currencies + VOC `gap_candidates[]` are the **first real laundered-demand path** — the re-review must watch it (= MR-002 both-sides rule).
- **L10 (sequencing trap)** — the most dangerous systemic trap: green checks over not-yet-built content (a re-review run before Jobs 2/3/4 land reproduces fatal data-sufficiency findings under a *passing* auditor). The re-review must verify input/checker content exists before its consumer ran.
- **Do-not-re-flag discipline** — already-absorbed wiring bugs (PART3 §1.1 / asran §3/§9) must not be re-prosecuted as new; obsolescence is earned only where the structure is gone AND the class cannot recur.
- **KEEP (do not regress):** the version-triage rigor, the operator-`<annotate>`-vs-reviewer-finding calibration, and the VALIDATED-KEEP lists across all four audits (they are the regression watchlist).

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **A1/A2/A3 — the three build-time meta-skills** are this step's closest kin: **`adversarial-self-review`** (PART4 §5.5) generalizes this whole re-review to a per-agent acceptance test. The re-review build should align with / consume these skills, and verify Jobs 2/3/4 ran *through* them.
- **C7 / `invariant-register`** — the re-review enforces that no VALIDATED invariant (never-merge, exclusion discipline, PROVISIONAL→dry-test, blocked-ports, no-laundered-demand) was silently switched off — "no KB file" ≠ "no support."
- **All of L1–L10** — the re-review's standing agenda is to confirm each open ruling (L1 carry-field, L3 VOC-precondition, L6 scope, L7 never-merge, the Job 2/3/4 content) was *closed*, not re-deferred.
- **Dependencies that are NOT this build's call:** every marketing-truth ruling stays with its named session (Jobs 2/3/4 + operator). The re-review **prosecutes and surfaces**; it does not decide.

## Done =
The re-review runs the **version-triaged adversarial method** over the redesigned pipeline + the VOC integration, **extended to the new VOC seams + artifacts**, with an evidence manifest grown to the new outputs; it prosecutes the **8-class taxonomy** at every new seam, watches the **laundered-demand / never-merge / bet-transfer regression vectors**, honors **do-not-re-flag** for absorbed wiring bugs, confirms each L1–L10 ruling was closed (not re-deferred) and that no consumer ran before its checker content existed — emitting an audit synthesis to the ★ operator, deciding no marketing truth itself.
