---
status: brief
role: Per-step build brief for STEP 0 — Bet Compiler. The bet-skill is ALREADY BUILT; this session ratifies/extends it. Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 0
covers: Bet Compiler — the operator-in-the-loop session that compiles the operator's bet into a structured, machine-checkable contract and challenges incompleteness. It does not decide the bet; the operator does.
---

> **What this is:** the reading list + duties for the session that **ratifies and extends** the **Bet Compiler** skill. **This brief is the one exception to the "rebuild" framing:** the bet skill is already BUILT (`skills/bet-compiler/SKILL.md`). This session does **not** rebuild from scratch — it reads what was built, ratifies it against the architecture, and extends the contract where the audits/open-decisions demand. **Start with §"What was already run" — the built skill + the as-ran pre-research artifact are the highest-leverage inputs.** STEP 0 is **operator-in-the-loop** (A16/A38): the agent interrogates and structures; the operator decides the bet.

# STEP 00 — Bet Compiler

## In one line
Compiles the operator's bet into a **structured contract** (`bet-brief` with a machine-checkable block) — bet statement + `bet_type` + the open-transformation slot + **N/T/P similarity as three separate criteria sets** + functional-mechanism-equivalence test + comparable-bet fit-verification fields + territories + LP-hunt terms + claim-typing examples. Every downstream query, cell, and bet-transfer inherits it; it owns **no** marketing decision of its own.

## ★ Start here — what was already run (highest leverage)
This step is unique: **the bet skill is already BUILT.** Read it first, then the as-ran prior and the original session packet, before extending anything.
- **The BUILT skill (ratify/extend target):** `skills/bet-compiler/SKILL.md` — the one built step-skill in this base (INDEX manifest). **Read this first** — you are ratifying and extending it, not rebuilding it.
- **The as-ran prior:** `reference/as-ran-repo/repo-files/runs/arduview/pre-research-plan.md` (the bet/pre-research artifact the MVP actually produced) + `…/runs/arduview/arduview-pre-research-plan.md`. The as-ran brief was **prose**; A39 traced run quality straight back to it — the build's whole point is the machine-checkable block.
- **The session packet that defined this stage:** `reference/handoffs/HANDOFF-1--bet-and-pre-research.md` — the bet session's own context packet.
- **Reader's-guide:** `reference/as-ran-repo/asran-repo-report.md` (index into the as-ran repo + field names).

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md` → STEP 0** — the job logic (intake folded into the bet-brief; emits the structured contract; feeds Competition Search + nearly every downstream step). Note the intake-as-its-own-step shape question (PART0 GAP-6).
2. **`architecture/PART3--architecture-design.md`:**
   - **§6.1** — the Bet Compiler card (its full contract field list, why a stage and not a doc, model = quality/conversational, validator = structural completeness). *The spine of the ratify/extend.*
   - **§6.0** — its per-card soundness duties row (grounds `bet_type`, N/T/P similarity, functional-mech equivalence; carries UNGROUNDED bet calls + blank operator inputs).
   - **§7.2** — its knowledge scope (bet-fit / NTP-similarity / functional-mech-equivalence / structural-deliverability tests; disposition from case-studies--spencer, differentiator-framework, market-evaluation-criteria, product-research--spencer; **excludes** copy/funnel craft).
   - **§7.3** — registry slots it owns/feeds: `bet-fit` (+ NTP similarity + functional-mech equivalence), `venue`. Content ○ Job 1/2; the **slots** are fixed.
3. **`architecture/PART1--dependency-ordered-map.md` → D4** (the bet decision), by annotation:
   - **A38** ("What is a bet? This needs to be clearly defined…"), **A39** (the bet-half: redefine the bet / the hypothesis output; "open transformation, idk what that means"), **A20/A23** (how to verify another company fits the bet), **P19** (functional-mechanism-equivalence — the fidget-spinner/transparent-screen logic, "this pre phase discussion is really its own thijgn"), **P8** (N/T/P evaluated separately, with their own criteria; product similarity includes price/type), **P10** (pre-research built on how the product structurally can/cannot deliver), **P1** (bets calibrated to control niche + transformation).
4. **`architecture/PART2--build-order-roadmap.md` → Job 1 (D4)** — the session that fills the §6.1 contract's ○ content. This build wires the contract shell; Job 1 sets the bet-fit/similarity test content.

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0** (per-card soundness duties).
- Every load-bearing verdict carries a `grounding_ref` (a DR-law/test ID or Register rule-ID, else `UNGROUNDED`) and a `carried_risks[]` list. Counts/scores emit `{value, n, low_n}`; checks report `PASS | FAIL | CANNOT-EVALUATE`.
- **MR-006** (the transformation-validation carry-field) originates here: the bet-brief's open-transformation slot must be typed so its asserted/unvalidated status can ride downstream into Market Selection's pick.

## Adversarial findings this build must honor (`reference/reviews/`)
Read **`AUDIT-reviewerB.md`** in full (the bet-transfer findings live there); cross-ref `AUDIT-collection.md` and `AUDIT-market.md` GAP-A5:
- **AUDIT-reviewerB B1/B2 (decision-half) + shortlist #3** — the `bet_type` / `sophistication` **determination test** with a **refuse-condition**: the synthesizer/bet-brief can emit `bet_type` on a `basis` that is page-vocabulary, not structural-bet evidence. Write the forcing rule (refuse if the basis does not license the structural-bet conclusion) into the §6.1 contract.
- **AUDIT-market GAP-A5** — bet-evidence inflating cell confidence; the **spend-transfer** control. **KEEP + EXTEND** DECISION 8 (the reviewer's "strongest part of the output"): N/T/P stay **three separate criteria** — do NOT collapse into one blended similarity score (= MR-003-adjacent discipline; VALIDATED-KEEP).
- **AUDIT-reviewerB §3.3 (regression watch)** — the bet-transfer / functional-mechanism-equivalence logic (P19) must **not silently re-label an unproven verbal hook as proven** once a *different* product's bet validates. Carry this watch to the D5 session.
- **AUDIT-collection GAP-7** — the bet-exclusion-vs-thin-cell interaction (A23): "what is the bet logic / how do we verify fit" is a named Job-1 contract slot here.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **A1/A2/A3** — the three build-time meta-skills (`decision-spec`, `contract-congruence`, `grounding-and-refuse`) are proposed to be built **before** Jobs 2/3/4; the Bet Compiler's bet-fit determination test is a prime `decision-spec` target (kills the "what is a bet" ambiguity at authoring time). Build through them if they exist.
- **The niche/product-category definition** (A30: "I dont think i ever determined what a niche category even is") must land in `definitions.md` (PART3 §7.1 reference layer) or the N/T/P transfer control has no `product category` to test against.
- **Dependencies that are NOT this build's call:** the actual similarity thresholds + bet-fit test content → **Job 1/2** (operator). Wire the contract so they drop in; do not hard-code them.

## Done =
The bet skill, **ratified against §6.1 and extended**, emits a `bet-brief` with a **machine-checkable contract block** carrying: bet statement + `bet_type` (with a **licensing refuse-condition**, not just a basis string) + the typed open-transformation slot (MR-006-ready) + **N/T/P similarity as three separate criteria sets** + the functional-mechanism-equivalence test + comparable-bet fit-verification fields + territories + LP-hunt terms + claim-typing examples — **interrogating the operator for completeness** (★ operator-in-the-loop), owning no marketing decision itself, and leaving every threshold it can't yet set as a wired ○ slot pointing at Job 1/2.
