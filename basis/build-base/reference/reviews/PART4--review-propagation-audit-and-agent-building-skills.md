---
status: authoritative
role: Audit of whether the four reviews propagated into PART0/1/3, an 8-class failure taxonomy, and proposed build-time agent-building skills.
read-with:
  - reference/reviews/AUDIT-collection.md
  - reference/reviews/AUDIT-market.md
  - reference/reviews/AUDIT-funnel.md
  - reference/reviews/AUDIT-reviewerB.md
  - OPEN-DECISIONS.md
supersedes: []
---

> **What this is:** the audit synthesis over the four AUDITs + forward skill proposals. **Read by:** the operator + Jobs 2/3/4. (Its forward items are surfaced in OPEN-DECISIONS.md.)

# PART 4 — Adversarial-Review Propagation Audit + Recurring-Failure Taxonomy & Proposed Agent-Building Skills

**What this is.** A cold audit of whether the four adversarial-review outputs (Reviewer B grounding audit; Reviewer A Collection / Market-Selection / Funnel) propagated into the redesigned architecture (PART0/PART1/PART3) — *and*, on the operator's instruction, a distillation of the **repeated, generalizable failure classes** across those reviews + the operator annotations, into a proposal for **build-time agent-building skills** that stop the system re-hitting the same failures every time a new agent is authored.

**Method.** Four opus auditors, one per reviewer output, each running the full version-triaged propagation method (extract verbatim finding → score operator-annotated? → version-triage against the redesign → propagation check in PART3/PART0 → damage if live → cross-check against PART3 §1.1 and as-ran §3/§9 so nothing already-absorbed is re-flagged). Calibration kept throughout: **PART1's A#/P# entries are the operator's `<annotate>` reactions, not the reviewers' findings** — so a reviewer finding propagated only where an annotation happened to cover it. Obsolescence was earned only where the targeted structure is *gone* **and** the failure class cannot recur. Quotes spot-verified against the source (reviews lines 150, 454, 577, 611, 615). Full per-segment detail: `AUDIT-reviewerB.md`, `AUDIT-collection.md`, `AUDIT-market.md`, `AUDIT-funnel.md`.

---

## 0. The one thing to take away

Reviewer B's headline — *"None that are laundered upgrades. The chain's core integrity threads (cell, differentiator, demand-validation) survive without silent hardening"* (line 150) — means **the redesign inherited a clean chain**. The prosecutable question therefore flips from *"what did the redesign fix"* to *"what can it now break,"* and **nearly every live residue across all four segments has the identical shape**:

> A decision the operator agrees is still *"definition + vibes"* — for which the architecture has correctly built the **slot** (test-registry §7.3, universal `basis` fields §6.4, refuse-conditions, named ○ gaps) but has **deferred the actual test content** to a later session (Jobs 2/3/4).

That is exactly the operator's flagged problem: *"transformation" was never correctly defined because the word is ambiguous.* It is not one bug. It is a **class** that recurs at every classifying seam (transformation, niche, bet_type, mechanism-vs-feature, sophistication, "trend of what," congruency, never-merge). **Naming a slot is not closing a finding.** The high-leverage fix is not more per-decision patching — it is a small set of **build-time skills** that make it *impossible to author an agent that has not defined what it decides and how its output feeds the next stage* (§5–§6).

---

## 1. Severity-ranked LIVE gap list (synthesized, deduped across segments)

Mirrors the reviewers' FATAL/DEGRADING ordering. "Annotated?" = covered by an adjacent operator `<annotate>` (→ a PART1 P#/A#). "Needs operator?" answers the operator's request to filter what genuinely requires their involvement vs. what a build session / a skill can absorb.

| # | Finding (reviewer · segment, quoted) | Annotated? | Version | Propagation | Location | Damage if unaddressed | Needs operator? |
|---|---|---|---|---|---|---|---|
| **L1** | **Unvalidated transformation never forced into the load-bearing conclusion.** A (Market, THREAD/PHASE 2): *"surfaces this in `_provenance` but does NOT carry it into the load-bearing conclusion (the ranked table / TOP CANDIDATES never re-raise 'this transformation is unvalidated')."* | YES (A31/P5) | **LIVE** (the disclosure-carry half; the "VOC-is-the-only-source" half is operator-killed, FALSE-MOOT) | **PARTIAL→ABSENT.** VOC added as a Gate-1 source (§5.2) and `_provenance` generalized to per-property `basis` (§6.4) — but **no output-contract field or refuse-condition mandates an "unvalidated/PROVISIONAL transformation" flag riding into the ranked output or the NTP-pick artifact.** §6.5 "every verdict carries its evidence row" + STEP 5 "or at least the transformation" are not that mandate. | §6.5, §6.4, §5.2, PART0 STEP 5 | The named FALSE-MOOT *realized*: operator picks an NTP off a PROVISIONAL table whose `run_transformation` is competitor-asserted/possibly mis-clustered, disclosure buried in an optional string a reader "will miss." Belief chain then sits on it (architect §6.7). | **YES** — a quick output-contract ruling (add a mandatory `transformation_validation` carry-field to the Market-Selection output + NTP-pick artifact). |
| **L2** | **"Define what you are deciding" unsolved for transformation / bet_type / sophistication / mechanism-vs-feature / niche / "trend of what" / congruency.** A (Collection D2/D6/D8), A (Funnel S-1 via A33: *"what would be the mechanical rigor test for whether… each section is congruent… not based on vibes"*), B (naked-assertion class). | YES (A21, A33, D6 notes, P5) | **LIVE** | **PARTIAL.** Registry slots exist (§7.3), basis-fields universal (§6.4), but **test content is ○ Job 2.** A `basis` field is a place to *write a citation*, not a datum that *licenses the label*. | §6.4, §7.3, §10 | Synthesizer re-emits `novelty-object-own`-class labels, specs typed as "mechanisms," niches that may be two communities — all flowing into Market Selection. The ambiguity recurs at *every* classifying agent. | **YES for content** (marketing truth, Job 2) **+ build-time skill** so it stops recurring (§6, `decision-spec`). |
| **L3** | **Command+F register-check unrunnable = FATAL at copy.** A (Funnel S-4): *"NO VOC was run, so Spencer's Command+F verbatim check is unrunnable… plausible, not verified against buyer language. That is the exact failure the LAW names."* (line 611/615) | YES (A37) | **LIVE** | **PARTIAL.** Mechanism named (Copy Chief test #5 vs voc-bank §6.9; refuse "missing voc-bank when run declares VOC active"), **but** survives one **soft-gate toggle** (the same D-08 escape that produced the VOC-absent run), the copy-bank content it checks against is ○ (R2 GAP-3/GAP-5, §5.3), and §11 builds the bank *after* the copywriter. | §6.9, §5.2, §6.5/§6.7, §1.6 | A *green* register-check over an empty/pass-1 corpus — **worse than the as-ran honest "unrunnable,"** because a checker now signs off on unverified copy. | **YES** — one rule: make "VOC present" a hard precondition for the copy stage (no soft-gate into copy) + sequence Job 8 behind Job 3's bank contract. |
| **L4** | **Gate-1 anti-fluke floor: undefined; a single comparable can still clear it.** A (Market D2): *"under the law, NO cell here clears Gate 1 on proven, durable, multi-competitor spend."* | YES (P7, A32, A40) | **SPLIT** — data bugs (revenue null, trend unknown, creatives 0) OBSOLETE as as-ran wiring; **floor-definition LIVE** | **PARTIAL.** More currencies now exist & VOC/community-heat are required-present (§5.2/§6.5), but **what clears the floor — weights, the 2+ rule, revenue's weight — is ○ Job 4** (§6.5, §10). | §6.5, §5.2, §10 | A build session could re-instate soft-gate-by-default and rank a single-comparable cell #1 again. Prevents silent *skip*; does not prevent a thin *pass*. | **YES** — Job 4 threshold session (marketing truth). |
| **L5** | **Ranking conflates UM-fit with demand magnitude when magnitude is thin.** A (Market D7/PHASE 2): *"The ranking is therefore driven by product-fit, relabeled as demand."* | PARTIAL (A40/A32) | **LIVE** | **PARTIAL.** Community-heat + VOC demand narrow the gap; the aggregation rule (A32: *"idk if angle type can be aggregated numerically… implication for… IO contracts"*) is ○ Job 4, and **no agent cross-checks "is this a demand rank or a fit rank."** | §6.5, §10 | Build session reproduces "alignment relabeled as demand" #1 ranking into the NTP pick. | **YES** — Job 4 aggregation/IO-contract policy. |
| **L6** | **~Half the funnel rests on out-of-chain references.** B (Handoff 3, "closest to fatal"): *"the mechanics/offer/assets half is paid for by out-of-chain references the funnel openly cites"* (inkleaf teardown, LP blueprints, operator BOM, founder voice). | No | **LIVE** | **PARTIAL.** Architect inputs enumerated (§6.7) + auditor checks input *receipts* (§6.8) — but **no stage makes the offer / deposit mechanic / assets / founder voice grounded pipeline artifacts**; R2 GAP-4 only adds adjacent-market funnels as *inspiration*. | §6.7, §6.8, §1.5 | Auditor can verify the brief *cited* its inputs, not that the offer/deposit/asset claims are *grounded* — the chain can't vouch for half the funnel. | **YES** — a one-line **scope ruling**: is this layer exempt-by-design (operator-supplied) or in-scope to ground? If exempt, say so in §6.7 so the auditor stops being expected to vouch for it. |
| **L7** | **never-merge / three-layer authority demoted to "configurable."** A (Funnel FA-1): *"SURVIVED — strongest single piece of reasoning in the segment"* (line 577). | YES (P16) | **LIVE (regression risk, not a residual flaw)** | **ADDRESSED-as-open** — §2 found "no KB provenance," §6.7/veto-#8 make it a vetoable D5 policy. | §2, §6.7, §10 | Demoting the cold reviewer's *soundest* finding because it lacks a *KB file* conflates provenance with soundness; if D5 weakens it, the architect may merge non-comparable currencies → revives the FATAL FA-1/proven-fill over-claim (L-fill below). | **YES** — D5 must be told this was the reviewer's strongest finding; "configurable" ≠ "off by default." |
| **L8** | **Avatar-quality inputs (unsatisfied / already-have-transformation / brand-loyalty) absent.** A (Market D1 data): *"The run cannot assess a single avatar-quality criterion because the data was deliberately not collected."* | PARTIAL (A6/A15) | **LIVE** | **PARTIAL.** Maps exactly onto **R2 GAP-2** — the highest-priority *unflagged-until-now* VOC hole (invalidation lane + already-have population + could-our-product-satisfy delta), ○ Job 3. | §5.1, §1.6, §5.3 | Pick still lacks the law's demanded avatar inputs, now on the VOC side. | **YES** — Job 3 (already flagged highest-priority ○). |
| **L9** | **Proven-fill join (FATAL at the fill).** A (Funnel FA-1/PHASE 2): *"the FILL layer… has ZERO in-transformation Currency-A backing… the model is sound; the fill is unsound; the design proceeds as if the fill satisfied the model."* | PARTIAL | **LIVE** (downgraded from FATAL) | **PARTIAL.** R1 quantification supplies more Currency A (§1.5 STEP 2); architect refuses on `low_n_warning` (§6.7); auditor checks whitespace-justification (§6.8) — **but the currency model is ○ Job 4 and the auditor's proven-vs-reputational test content is ○ Job 2.** | §1.5, §6.7, §6.8, §10 | A thin winner cell again pours reputational language into the proven-governed fill, uncatchable because the auditor's test is empty. Compounded by L7. | **Partly** — Job 2/4; surface the L7 linkage to D5. |
| **L10** | **Checker content built after / independent of its consumer (sequencing).** Cross-cutting (Funnel close): *"a first end-to-end run before Jobs 2/3/4… reproduces the reviewer's fatal data-sufficiency findings under a passing auditor/chief."* | n/a | **LIVE** | **PARTIAL.** P3 (contract-or-refuse) + P9 (gates) *can* express it, but build order (§11) does **not** guarantee an input/test lands before its consumer runs. | §11, §3 P3/P9 | The most dangerous systemic trap: green checks over not-yet-built content. | **No** — a refuse-precondition discipline (skill-enforceable, §6). |

**Lower-severity LIVE (absorbable at the named build session, no fresh operator strategy):** awareness *evidence-sufficiency* (thin-evidence guess; null-class closed by §6.6 refuse) · low-n sophistication confidence flag · single-leg trust (operator-accepted constraint, P22 ○ Job 4) · $299 anchor credibility (price-conditioning read exists; **no auditor anchor-vs-band check — registry has no pricing slot**) · Section-Analyzer descriptive clause (downstream receipts catch it).

---

## 2. OBSOLETE — resolved by the redesign (failure class cannot recur)

Each earned; none re-flagged from as-ran §3/§9.

- **"One agent cranks ALL raw dumps"** (Collection's framing premise) — DISSOLVED: light pass gone; Space Map is a synthesizer over compact structured rows, never raw copy (§1.5, §6.4). *(Classification decisions persist — L2.)*
- **Trends parse bug → `demand_trend` "unknown"** — as-ran wiring, root-caused §1.1 / as-ran §9#8; repaired input §6.5. *(The "trend of what" class is LIVE — L2.)*
- **`qualifying_creatives = 0` everywhere** — as-ran wiring (ad-longevity never lifted), §1.1 / §9#11; R1 quantifies it deterministically (§1.5). *(Thin-cell *design* hazard separate.)*
- **Null 6a store fields (awareness/primary_claim)** — `funnel-store.js` bug, §1.1 / §9#4; awareness now produced STEP 2, refuse-on-null §6.6. *(Evidence-sufficiency residual LIVE.)*
- **"Fields absent from `combos[]`" (bet_type/sophistication/stage)** — as-ran §9#9 shows they exist on `per_brand[]`; synthesizer schema is freshly designed (§1.5 STEP 3). *(Determination test class LIVE — L2.)*
- **COGS half of Gate 2.4 structurally inert** — operator *deleted* COGS from market selection (§6.5/§4.2/§7.2); the inert half is gone.
- **Architect-writes-copy role collapse** — happened only because the copywriter was never built (§9#13); now a separate Copywriter + Copy Chief (§6.9, D8).
- **Architect consumed an unusable tally / silent stubbing of no-ads DTC / analyzer blind to validation lane** — closed by §6.7 (refuse on `low_n_warning`; logged `validation_override`; validation lane enters analyzer inputs, P15).

---

## 3. VALIDATED — keep these (the redesign must not regress them)

What the reviewers found *sound* — with the specific regression vector to watch.

1. **No laundered demand upgrade** (B, line 150). *Watch:* the new pre-selection demand currencies + VOC `gap_candidates[]` are the **first real path this pipeline has ever had to launder a demand upgrade**. The reserved whitespace-vs-scary policy (○) must never let `voc_strength` alone clear a demand gate; the "evidence row" rule must force *both* supply- and demand-side cells populated.
2. **Exclusion discipline** (B — gameshell carried as structure-reference, not in-cell evidence). *Watch:* if D5 weakens never-merge (L7), this separation can collapse.
3. **Differentiator never silently hardened** ("ownable-but-unproven, cosmetic-only" survived). *Watch:* the bet-transfer / functional-mechanism-equivalence logic (§6.1, P19) must not silently re-label the *verbal hook* "transparency" as proven once a different product's bet validates.
4. **Blocked-port discipline** (B/A — refused gameshell's "Available at Amazon," press logos, backer counts for a debut). Preserved + made checkable (§6.8, §6.9 "blocked ports absolute"). Keep it an auditor *check*, not an architect courtesy — esp. once GAP-4 feeds adjacent-market funnels.
5. **Spend-transfer check** — A: *"the strongest part of the output."* Captured + extended (§6.1 N/T/P separate criteria, A30). *Watch:* must not collapse back into one blended similarity score; the niche/product-category definitions A30 asks for must land in `definitions.md`.
6. **PROVISIONAL → dry-test-only discipline** (Market's "saving grace"). Keep §6.5 "ranked PROVISIONAL survivors" + STEP 5 ★ pick; never promote Market Selection from ranker to picker.
7. **Mechanical sophistication rule kept separate from awareness; fresh per-cell believability gate; router transformation-gating** — all SURVIVED; preserved in §6.4/§6.6/§6.7. Keep "believability parameterized by niche" (A37).

---

## 4. Recurring-failure taxonomy — the cross-cutting pattern (the operator's actual ask)

Every item above collapses into **eight generalizable classes**. Each is evidenced by ≥2 reviews and/or annotations, recurs at a *new* seam in the redesign, and is killable at **authoring time** rather than per-decision. This is the case for agent-building skills.

**C1 — Underdefined decision verb ("define what you are deciding").** *The flagship.* The agent is told to decide "transformation / niche / bet / mechanism / trend / congruent / never-merge" — labels with no operational definition — so it fills the gap with vibes. Evidence: Collection D2 (`novelty-object-own` = possession-desire mislabeled), D3 (niche = possible Frankenstein of two communities, "no raw_variants"), D6 ("Long battery life" typed a mechanism); A21 (*"what are we actually going to assess the trend of?"*); A33 (*"mechanical rigor test for… congruent… not based on vibes"*); A30 (*"I dont think i ever determined what a niche category even is"*); P16 (*"is the goal to NEVER merge, what does that even mean"*). Recurs at: the synthesizer, Bet Compiler, auditor, chief — every classifying agent. → **Skill: `decision-spec`.**

**C2 — Basis/provenance ≠ license.** A citation slot records *what was read*, not *whether it permits the label*; a "rigorous prompt" with no enforcing test. Evidence: B's entire naked-assertion method; Collection PHASE 2 (*"that guard is a sentence, not a mechanism"*; *"the reasoning is sound; the produced evidence does not instantiate the reasoning"*); the universal `basis` field (§6.4) is necessary-but-not-sufficient. → **Skill: `grounding-and-refuse`.**

**C3 — Risk/uncertainty not carried into the consuming conclusion.** A load-bearing caveat is demoted to a `_provenance`/`basis` string and never re-raised at the decision the operator acts on. Evidence: Market L1 (the realized FALSE-MOOT); B's awareness + anchor findings. → **Skill: `contract-congruence` (uncertainty-carry rule).**

**C4 — Producer/consumer mismatch ("each output must feed the other").** *The operator's explicit second ask.* Fields produced but never read (validation lanes, P15); produced then nulled (awareness 6a fields); clustered with no output field → *"silently vanished"* (CC-A2); present at the wrong grain (bet_type/sophistication on `per_brand` not `combos`). Evidence spans all four segments + as-ran §9. → **Skill: `contract-congruence`.**

**C5 — Improvise-over-nulls / soft-gate-by-default.** The as-ran *"every stage improvised over nulls and the run succeeded into a design built on nothing"* (§1.1). The soft-gate toggle survives as a single point of failure (Command+F recurs on one toggle, L3); checker content can be built after its consumer (L10). → **Skill: `contract-congruence` (no-silent-default + sequencing) — generalizes P3/P9.**

**C6 — A checker wrapping an empty test returns PASS.** Named enforcement points with ○ content: Funnel Auditor congruency, Copy Chief tests #2/#5. A *green* check over an empty corpus is worse than honest absence. Evidence: Funnel GAP-C/A/F. → **Skill: `grounding-and-refuse` (empty test = UNKNOWN/REFUSE, never PASS).**

**C7 — A validated invariant silently made optional.** never-merge (the reviewer's strongest finding) demoted to configurable because "no KB file names it" — conflating *provenance* with *soundness* (L7). → **Skill: `invariant-register`.**

**C8 — n / confidence not surfaced on aggregates.** Sophistication read off 2–4 claims; single comparable clears the floor; no low-n caveat travels. Evidence: Market D5 / D2. → folded into **`decision-spec`** (every verdict carries n + a low-n flag).

---

## 5. Proposed agent-building skills (build-time meta-skills)

The leverage: the architecture *already has* this machinery at the per-decision level — the test registry (§7.3), basis fields (§6.4), P3/P4/P8, the A40 withheld-list, the Job-9 modded re-review. Today it gets *filled in per stage* during Jobs 2–9, which means **the ambiguity is re-discovered, and re-deferred, at every build session.** A build-time skill **lifts that machinery to authoring time** so no agent in this system can be written without it. Three core skills kill the eight classes; two supporting skills harden the edges.

### 5.1 `decision-spec` — the flagship (kills C1, C2, C8)

A gate every agent must pass *before its prompt is written*. It forces a one-page Decision Spec:

1. **Decision sentence, de-ambiguated** — one sentence, with **no abstract noun left undefined**. An ambiguity-detector sub-pass flags any term (transformation, niche, bet, mechanism, angle, congruent, proven) that lacks an operational definition or a `TEST:` pointer. *This is the mechanical guard for the "transformation was never defined" problem — applied to every future agent.*
2. **Named inputs** — exact fields, **source stage, and grain** (the `combos`-vs-`per_brand` grain trap).
3. **Procedure** — the mechanical steps from inputs to verdict.
4. **Verdict enum** — closed.
5. **Licensing rule** — *what datum permits each label* (not a place to cite — a rule that says when the label is earned).
6. **Refuse condition** — when the agent must not run / must return UNKNOWN.
7. **n / confidence** — every count or score carries n and a low-n flag (C8).
8. **Worked examples, including a known-failure example** (e.g., why `novelty-object-own` fails the transformation spec).

`definitions.md` gains a `TEST:` pointer per term (§7.1 already wants this); the skill *enforces* that no agent may use a term lacking one. This generalizes §7.3 from a per-decision artifact into an authoring gate.

### 5.2 `contract-congruence` — "make each output feed the next" (kills C3, C4, C5)

Every agent declares an I/O contract: **consumed** fields `{name, source_stage, grain, refuse-if-missing}`, **emitted** fields `{name, consumer(s), grain}`, **withheld** list (A40), and **carry-fields** (every load-bearing uncertainty an upstream stage holds must have a required field that re-surfaces it in the consumer — C3). A pipeline-level checker (build-time + orchestrator preflight, P3/P8) verifies: every consumed field has a producer at the right grain; every emitted field has a consumer or is cut; no soft-gate silent default (C5); **no consumer runs before its inputs and its checker content exist** (L10/C5 sequencing). Kills "output doesn't feed output," wrong-grain, silently-vanished, disclosure-burial, and the sequencing trap in one stroke.

### 5.3 `grounding-and-refuse` — no naked assertions, no green checks over nothing (kills C2, C6)

A checker/validator-authoring skill. Any test an agent or auditor runs must (a) name its licensing datum, (b) **return UNKNOWN/REFUSE — never PASS — when its parameters or corpus are absent** (C6: the empty-Command+F problem), and (c) propagate uncertainty rather than swallow it. This is what makes the §6.4 `basis` field actually ground something instead of merely recording a citation.

### 5.4 `invariant-register` — don't silently switch off what the reviews validated (kills C7)

A living list of validated / first-principle rules (never-merge, exclusion discipline, PROVISIONAL→dry-test, blocked-ports, no-laundered-demand), each with its **soundness argument and its provenance held separately**. Downgrading any one to "configurable/off" requires an explicit logged decision that engages the *soundness* argument — so "no KB file" can never again be mistaken for "no support."

### 5.5 `adversarial-self-review` — generalize Job 9 to every agent (process)

Every new agent ships with a prompt-blind grounding pass (Reviewer-B style) + a law-prosecution pass against its own Decision Spec, *before* it is accepted. This is the modded re-review (§10/Job 9) turned from an end-of-pipeline event into a per-agent acceptance test.

---

## 6. What genuinely needs the operator (filtered, per your request)

**Needs an operator decision now** (marketing truth or a scope/contract ruling a skill can't make):
- The **transformation / niche / trend / congruency / mechanism test content** (Job 2) — but `decision-spec` makes the session *produce it correctly and once*, not re-discover the ambiguity.
- The **Gate-1 floor + ranking-aggregation weights** (Job 4, L4/L5).
- The **unvalidated-transformation carry-field** into the Market-Selection output + NTP-pick artifact (L1) — a quick contract ruling.
- The **out-of-chain offer/asset scope ruling** (L6) — one line: exempt-by-design or in-scope to ground?
- **never-merge's fate** (D5, L7) — with the note that it was the reviewer's strongest finding.
- **VOC GAP-2 lanes** (Job 3, L8).
- The **"VOC is a hard precondition for copy"** rule (L3).

**Skill-preventable / build-session-absorbable** (no fresh operator strategy call): the ambiguity class itself (`decision-spec`), producer/consumer congruence and sequencing (`contract-congruence`), empty-test-returns-PASS (`grounding-and-refuse`), low-n caveats, the analyzer descriptive clause, anchor-vs-band check (add a registry pricing slot).

---

## 7. Recommendation

The architecture's *shape* is sound and most reviewer findings either propagated or are honestly routed to ○ slots. The real exposure is **C1–C6 recurring at every future build** and the **L10 sequencing trap** (green checks over not-yet-built content). Highest-leverage next move: build the three core agent-building skills — **`decision-spec`, `contract-congruence`, `grounding-and-refuse`** — *before* Jobs 2/3/4, so those sessions are run *through* the skills and can't re-introduce the ambiguity. The two operator output-contract rulings (L1 carry-field, L6 scope) and the L3 VOC-precondition rule are fast and unblock the rest.
