---
status: reference
role: Cold audit of Reviewer A - Market-Segment Diagnosis vs the redesign. One of the four behind PART4.
read-with:
  - reference/reviews/PART4--review-propagation-audit-and-agent-building-skills.md
  - architecture/PART3--architecture-design.md
supersedes: []
---

> **What this is:** per-segment audit detail behind PART4. **Read by:** Jobs 2/4 + the market-selection stage build.

# AUDIT — Reviewer A / A-MARKET SEGMENT DIAGNOSIS vs the redesigned architecture

Cold adversarial audit. Assigned reviewer output: **Reviewer A — A-MARKET SEGMENT DIAGNOSIS** (reviews file lines ~313–471). Architecture under audit: PART3 (R1/R2), PART0, cross-ref PART1, as-ran report. Default to prosecution; obsolescence must be earned; do not re-prosecute as-ran-only artifact bugs (asran §9 #7/#8/#11).

Calibration note used throughout: Reviewer A — Market prosecutes against the OLD as-ran prompts/outputs. The redesign (R1: deep funnel analysis + ad-volume/spend/longevity quantified pre-selection as currencies; VOC subsystem `voc-market-signal` §1 wired into Gate 1; structured bet brief; R2's six open gaps) is substantial. The DECISION-LEVEL charges (transformation asserted but never re-raised in the load-bearing conclusion; anti-fluke floor cleared by one comparable; ranking on absent demand magnitude) are the ones that survive a substantial redesign. The artifact-wiring charges (demand_trend null, qualifying_creatives=0, fields absent from combos) are largely as-ran bugs the redesign root-causes — but they are NOT the same as the *thresholds/floor-definition* charges, which persist as open ○ holes.

---

## SECTION 1 — SEVERITY-RANKED GAP LIST

Severity order: highest live + un-propagated first.

---

### GAP-A1 — THE KEY ONE: asserted transformation never carried into the load-bearing conclusion (the disclosure violation)

**Reviewer finding (Reviewer A / Market / DECISION 1 + THREAD CHECK Entry-join + PHASE 2), quoted:**
> "the conditions are met for the GATE MECHANICS but NOT for the avatar/transformation content. The run never once flags that the TRANSFORMATION ITSELF is unvalidated as a load-bearing risk in the ranked output or the TOP CANDIDATES section — it flags trend, COGS, community-heat, awareness, but the asserted-transformation risk is demoted to a buried `_provenance` string and never re-raised in the Cell 5 / Cell 1 verdicts that the operator will actually act on... **Verdict: SURVIVED as a gate-procedure ... but VIOLATION on disclosure — the asserted-transformation risk is not carried into the load-bearing conclusion. Degrading.**"

And the THREAD CHECK Entry-join row (verbatim, the named highest-value target):
> "the transformation/avatar the whole map is built on is ASSERTED, and the law (S7, S8) makes that a VOC finding. **The run surfaces this in `_provenance` but does NOT carry it into the load-bearing conclusion (the ranked table / TOP CANDIDATES never re-raise 'this transformation is unvalidated').**"

And PHASE 2's closer:
> "a reader who acts on the ranked table without reading the `_provenance` string and the #1 BLOCKER would be committing to a transformation and an avatar that the law says are still unproven — and the output does not make that impossible to miss."

**Operator-annotated?** YES, heavily — but the annotations *redirect the rule, not the disclosure mechanism*. P5 (DECISION 1 disclosure paragraph): "this rule was written by me that VOC must give transformation but idont think this is actually true. Transformation can absolutely be derived from competition as long as the input and analysis is mechanical enough." A31 (Entry-join): "more nuance than VOC is the only source of determining transformation and competition is useless." P2: "supply side validation is more important if we can prove that they make money." P20: "its unreasonable that transformation is completely underivable from competition." So the operator **rejects the S7 premise** (VOC-only transformation) — which downgrades the *rule-soundness* half of the charge. But the operator **never annotated away the disclosure mechanism itself** — the requirement that "this transformation is unvalidated/provisional" must travel into the artifact the operator acts on. A24/A25 actively *reinforce* the underlying worry: "i seriously doubt that these brands became successful if the true transformation their marketing sold was purely (own a cool object.) no way... its something like show your friends or be cutting edge tech."

**Version-status: LIVE (the disclosure-carry half).** The rule-soundness half (VOC-must-give-transformation) is FALSE-MOOT — operator-killed via P5/A31/P20, and PART3 §2 confirms it against the KB ("No passage anywhere in the 65 files requires transformation to be derived from VOC exclusively"). But the disclosure-carry obligation is class-independent of the VOC debate: whatever licenses the transformation (VOC, competition, or both), the redesign still owes a mandatory "unvalidated/PROVISIONAL" flag that surfaces in the operator's NTP-pick artifact. That class can absolutely recur.

**Propagation: PARTIAL — and this is the named FALSE-MOOT risk realized.** The redesign does exactly what the brief warned against: it ADDS VOC as a source and leaves disclosure as an optional, un-mandated string. Evidence on both sides:

- *Source added (the easy half, done):* PART3 §5.2 wires "Market Selection Gate 1 ← market-signal §1 — Demand-side currency alongside supply-side." §6.5 input changes: "`voc-market-signal` §1 wired into Gate 1 as the demand-side currency." So VOC-as-source is in.
- *Disclosure-carry (the hard half, NOT mandated):* I searched every place the flag should live. §6.5 Market Selection card fixes the I/O but says only: "every verdict carries its evidence row." It does **not** require a per-cell `transformation_validation: asserted|voc-confirmed|both` field, and it does **not** require an unvalidated-transformation flag to ride into the ranked PROVISIONAL output or the operator NTP-pick artifact. §6.5 "Decision: rank surviving cells... Stops at ranked PROVISIONAL survivors." The word "PROVISIONAL" governs the *whole ranking*, not the *transformation specifically* — exactly the as-ran ambiguity the reviewer charged.
- §6.4 Space Classifier: "(1) Every classification it makes — transformation clustering... runs through the D3 test slots once Job 2 writes them (○); until then it carries the run's known failure as a warning label (A24's `novelty-object-own` rolled three unlike outcome-promises into one label). ... (3) Emits per-property `basis` fields universally." A `basis` field is provenance — it is the *same `_provenance`-class string the reviewer said never re-surfaces at the decision*. PART3 has generalized `_provenance` into per-property `basis`, but has **not** mandated that the basis/validation-status re-raises at Market Selection's conclusion.
- PART0 STEP 5: "Finds an NTP with validation through spend (or at least the transformation), VOC validation, and a real customer gap." This describes inputs, not a mandatory output flag on the pick.
- The transformation TEST itself is routed ○: PART3 §10 "the transformation test itself (D2 direction settled ●, design ○)"; §7.3 registry lists `transformation` as a slot with "Content ○ Job 2."

So: the **test** for transformation is a named-empty ○ slot (PARTIAL), and the **disclosure-carry into the conclusion** is ABSENT — no refuse-condition, no output-contract field, mandates the flag. PART3's refuse-conditions for Market Selection (§6.5) gate on `demand_trend` unknown and `voc-market-signal` absent — never on "transformation unvalidated / unflagged."

**Architecture location checked:** §6.5 (Market Selection card — I/O + refuse), §6.4 (Space Classifier basis fields), §5.2 (consumption row), PART0 STEP 5, §10 + §7.3 (routed transformation test/registry).

**Resulting flaw if not addressed:** Identical to the as-ran failure, structurally re-armed. The operator picks an NTP off a ranked PROVISIONAL table whose `run_transformation` (e.g. a `novelty-object-own`-class label) is competitor-asserted and possibly mis-clustered, while the only disclosure is an optional `basis` string that — by the reviewer's own demonstration — a reader acting on the ranked table will miss. VOC pass-1 now *exists* to corroborate, but nothing forces a VOC-vs-asserted *disagreement* to surface as a mandatory flag on the pick; the gap_candidates[] mechanism surfaces demand-minus-spend gaps, not transformation-validity. Lands on: the **operator NTP-pick artifact** (STEP 5 ★) and downstream the **Funnel Architect** (§6.7), which consumes the chosen cell and builds a belief chain on it — the exact "belief chain on an asserted transformation" the as-ran retrospective named (`funnel-architect-copywriter.md`: "No VOC — the belief chain sits on asserted transformation, not buyer language").

---

### GAP-A2 — Gate 1 anti-fluke floor: undefined, routed ○; a single comparable can still clear it

**Reviewer finding (Reviewer A / Market / DECISION 2), quoted (rule + data):**
> "The 2+ anti-fluke floor is correctly stated and defended: 'fewer than 2 qualifying = KILL,' 'Treating one competitor at scale as proof. It is not — 2+ is the anti-fluke floor'... The one-comparable override is licensed only 'TO A DRY TEST (not to commitment)'..."
> "**DATA-SUFFICIENCY — VIOLATION, FATAL-to-confidence (correctly self-charged).** `revenue_est.value_usd_monthly == null` for ALL 20 brands; `demand_trend.shape == "unknown"` for ALL 20 brands; `qualifying_creatives == 0` in all six cells... under the law, NO cell here clears Gate 1 on proven, durable, multi-competitor spend. The run's only surviving demand evidence... is (a) one crowdfunding raise (gameshell, Cell 1) and (b) ad-PRESENCE without longevity."

**Operator-annotated?** YES. P7 (DECISION 2 $300–500K floor paragraph): "the mechanical floor doesnt have to kill candidates, but revenue must absolutelyt be heavily considered against other alternatives for markets at this stage." A40: "I dont think community heat is calculated dependently on low competitor spend, it is just another axis of demand validation that should be present before moving." A32 (PHASE 2): "we need to first find all of the validation currencies that exist (web traffic, ad amounts, estimated AOV, press, verified social proof... people in VOC talking about it, trend signal)." A26: "is that also fed by demand side as another currency."

**Version-status: SPLIT — data-sufficiency half is OBSOLETE-by-redesign (artifact-wiring); the floor-definition half is LIVE.**
- The *delivered-data* charge (revenue null, trend unknown, qualifying_creatives=0) maps to asran §9 #8 (`demand_trend` "structurally present but operationally empty" — fetch.js XHR bug) and #11 (`qualifying_creatives=0` — "aggregation never lifted ad-level longevity into the store"). Per the brief these are as-ran failures I must NOT re-flag as new. R1 root-causes them: §1.1 names both bugs; R1 §1.5 makes ad-volume/longevity a deterministic pre-selection rollup from analyzed funnels, and §6.5 lists "lifted ad-longevity (`qualifying_creatives` fed from raw ads); repaired `demand_trend`." **OBSOLETE for the wiring.**
- The *floor itself* — "does 2+ still hold, and can a single comparable + bet-evidence clear it" — is LIVE and the question the operator is actively reopening (P7: the floor "doesnt have to kill candidates").

**Propagation (floor-definition half): PARTIAL — named ○ open-slot, floor currently UNDEFINED.** Does the new currency model RAISE the floor so a single comparable can't clear it?
- The currencies are *enumerated and wired* (R1 §1.5 ad-volume/spend/longevity per transformation/angle; §5.2 VOC demand + community heat as independent axis). That genuinely adds axes a single crowdfunding comparable did not satisfy in the as-ran run — community heat and VOC demand are now separately required inputs (§6.5 refuse: "`voc-market-signal` absent when the run declares VOC active").
- BUT the *weights and thresholds* — what actually clears Gate 1 — are entirely ○-deferred. §6.5: "**Gate semantics (what 'proven demand' means per currency, thresholds, revenue's weight P7, the never-merge question P16) — ○ Jobs 2/4.** The card only fixes the I/O." §10: "every numeric threshold (A11 ratios, **anti-fluke floors**, currency weights, revenue's weight P7)" routed ○. So the floor is, by the architecture's own statement, **undefined and routed to Job 4**.

**Is "floor undefined, routed to Job 4" addressed-in-principle or a live hole?** Addressed-in-principle that *more currencies exist* and that *VOC + community heat must be present before moving* (A40's "present before moving" is honored as a refuse-condition pattern). But the specific failure CLASS — *a single comparable clearing the floor* — is NOT closed by the architecture; it is reserved to Job 4. This is a **PARTIAL/named-empty-slot**, not ABSENT (the slot exists, A32's currency enumeration is seeded into Job 4, P7's "revenue heavily considered" is carried as a routed note). It needs operator involvement at the Job 4 session — it cannot be silently absorbed at a build session because "what clears the floor" is a marketing-truth threshold call.

**Architecture location checked:** §6.5 (Gate 1 I/O + refuse), §5.2 (currency rows), §1.5 (R1 currency production), §10 + §12 veto-register (○ thresholds), PART2 Job 4 routing.

**Resulting flaw if not addressed:** Until Job 4 sets the floor, Market Selection has named currency *inputs* but no *clearing rule* — a build session wiring Gate 1 could re-implement the as-ran soft-gate-by-default (asran §2b "SOFT-GATE MODE active... Gate-1 kills become FLAG + ranking penalty") and let a single comparable + bet-evidence rank a cell #1 again. Lands on: Market Selection Gate 1 and the operator NTP-pick. The redesign correctly *prevents silent skip* (refuse on absent VOC), but does not yet *prevent a thin pass*.

---

### GAP-A3 — Ranking is ordinal (Cell 5 #1) while its top demand inputs are admittedly unscored ("UM-fit wearing a demand-rank label")

**Reviewer finding (Reviewer A / Market / DECISION 7 + PHASE 2), quoted:**
> "for the two TOP cells (5 and 1, both identity/belonging), demand magnitude is explicitly 'requires separate community-heat read — not scored here,' and trend... is 'unknown' for all brands. So the ranking's two largest terms — demand magnitude and growth — are null or unscored for the very cells it ranks #1 and #2... **The ranking is therefore driven by product-fit, relabeled as demand.**"

And PHASE 2:
> "The conclusion that actually matters — 'Cell 5 ... and Cell 1 are the TOP CANDIDATES' — is NOT earned by the proven-spend law. It is earned by UM-to-cell ALIGNMENT (a Gate 2 product-fit judgment) and then narrated as demand strength."

**Operator-annotated?** PARTIAL — adjacent via A40 (community heat as an independent axis "that should be present before moving") and A32 (enumerate currencies, "if angle type can be aggregated numerically. I dont think so. Which has implication for aggregation and IO contracts"). No annotation directly on the "ranking conflates fit with demand" charge itself. So: medium loss risk.

**Version-status: LIVE.** The class — *producing an ordinal demand ranking when the demand-magnitude inputs for the top cells are unscored* — can recur. R1 adds real demand inputs (ad-volume per transformation, VOC demand, community heat), which *narrows* the gap, but does not by construction forbid ranking on alignment when magnitude is thin.

**Propagation: PARTIAL.** 
- *Helped:* community heat is now "its own axis, not derived from low competitor spend" (§6.5, ● A40/P4), and VOC demand §1 is a Gate-1 currency — so the as-ran "magnitude unscored" hole is partly filled with real signal. The whole output stays explicitly PROVISIONAL (§6.5).
- *Not closed:* whether the ranking arithmetic may lean on UM-fit when demand magnitude is missing is a D5 weight question, routed ○ (§6.5 "magnitude... thresholds ○ Jobs 2/4"; A32's "idk if angle type can be aggregated numerically... implication for aggregation and IO contracts" is exactly the open aggregation contract, routed to Job 4 per §10). The Funnel Auditor (§6.8) checks congruency and input-receipts but is a *funnel-design* checker downstream of the pick — it does not audit Market Selection's ranking logic. No agent in the redesign cross-checks "is this rank a demand rank or a fit rank."

**Architecture location checked:** §6.5 (ranking/magnitude ○), §5.2 (community heat axis), §10 (aggregation/weights ○ Job 4), §6.8 (auditor scope — downstream, not on the pick).

**Resulting flaw if not addressed:** Job 4 must define how magnitude, alignment, and growth combine, and what happens when magnitude is thin; absent that, a build session can reproduce the "alignment relabeled as demand" #1 ranking. Lands on: Market Selection ranking output → operator NTP-pick. Genuinely needs the Job 4 operator session (aggregation policy is marketing-truth).

---

### GAP-A4 — Gate 2.2 softened the law's mechanism-AND-avatar conjunction into a disjunction-kill; avatar differentiation asserted because the avatar is unvalidated

**Reviewer finding (Reviewer A / Market / DECISION 3), quoted:**
> "the differentiator law demands mechanism AND avatar differentiation. The run finds the MECHANISM differentiator (transparency) but the AVATAR differentiator is never established because the avatar itself is unvalidated (Decision 1)... The prompt's Gate 2.2 says 'Check for a differentiator on mechanism AND avatar. Neither = KILL' — note 'Neither = KILL' is weaker than the law's 'mechanism AND avatar' requirement... **The prompt has SOFTENED the law's conjunction into a disjunction-kill.** This is a real RULE drift, degrading."

**Operator-annotated?** YES — and the operator is unsure of the rule. Reviewer A's own inline annotation at S3: "is the rule new mechanism to new avatar or is it is ok as long as we hae one." And A28 (filed at D2, propagated into PART3 §2): the differentiator-conjunction question. PART1 routes A28 to the Job 2 session.

**Version-status: LIVE, but the rule-direction is itself unsettled (so the "drift" framing softens).** PART3 §2 item 3 located the KB law for Job 2: "`differentiator-framework__2_.md` (Hair Dryer failure case)... 5+ competitors on the same mechanism position → a new mechanism **or** a new avatar is required... So the KB supports 'one sufficient differentiator, requirements escalating with sophistication stage' rather than a fixed mechanism-AND-avatar conjunction." This means the redesign's research **contradicts the reviewer's premise**: the KB may license the disjunction the reviewer called a "drift." So the rule-soundness charge is partly FALSE-MOOT (the conjunction the reviewer treated as law is not clearly the KB law). What remains LIVE is the *second* half: avatar differentiation is *asserted* because the niche/avatar is unvalidated — that ties back to GAP-A1 (transformation/avatar validity) and to the niche test.

**Propagation: PARTIAL (named-empty test slot).** §7.3 registry has a `niche` slot ("venue + reading + in/exclusion A9") and the differentiator logic rides the `differentiator`/sophistication test content ○ Job 2. §2 explicitly stages the KB citation for the Job 2 session. So the *rule resolution* is routed (PARTIAL), and it is a **real slot, not vibes** — but it is empty until Job 2. The avatar-validity half inherits GAP-A1's disclosure hole.

**Architecture location checked:** §2 (A28 KB finding), §7.3 (`niche` + differentiator test slots ○), §6.4 (Space Classifier mechanism-vs-feature + believability gate).

**Resulting flaw if not addressed:** If Job 2 doesn't settle "one sufficient differentiator vs mechanism-AND-avatar" and the niche test stays empty, the kill threshold for me-too is undefined and avatar differentiation can be asserted off an unvalidated niche. Lands on: Market Selection Gate 2.2 and the Space Classifier niche call. Needs Job 2 (operator co-design, per A37's one-full-session demand).

---

### GAP-A5 — Bet-evidence inflates cell confidence; NTP-similarity controls for transfer

**Reviewer finding (Reviewer A / Market / DECISION 2 degrading caveat + DECISION 8), quoted:**
> "the law has NO concept of 'the bet won at scale therefore my cell has demand.' S1 demands proven spend FOR THIS transformation×niche, not for an analogous structural bet in adjacent cells. nothing-phone is a $549–699 phone; reading its 'phone-scale run' as validation that EDC-aesthetic collectors will pay for an $80–160 transparent toy console is exactly the spend-transfer error... the bet-evidence frame quietly inflates the confidence of Cells 1 and 5 in the prose ('the single cleanest demand signal in the set') beyond what the cell-level data supports."

**Operator-annotated?** YES, strongly (and this is the VALIDATED-KEEP extension target). DECISION 2 inline: "i highly agree that this must be considered when considering bet validity, does it match the NTP pair similarly, and N, T, and P similarity must be evaluated separately, with their own criteria. Product similarity for example, includes price, product type, etc." A30 (DECISION 8): "can we apply this logic of 'similar NTP required, like similar niche, transformation and product category.' I dont think i ever determined what a niche category even is."

**Version-status: LIVE (and operator-validated as a real requirement).**

**Propagation: ADDRESSED (mechanism present), thresholds ○.** This is one of the better-propagated findings:
- §6.1 Bet Compiler contract fields: "**N/T/P similarity controls as three separate criteria sets** (● P8 'evaluated separately, with their own criteria'); functional-mechanism-equivalence definition for bet-evidence transfer (P19 — ... *does the physically-different feature do the same believable job for the same transformation*); comparable-bet seeds each with fit-verification fields (A23 'how do we verify whether another company fits the bet')."
- §7.3 registry: "`bet-fit` (+ NTP similarity + functional-mech equivalence)" is a named test slot.
- PART1 D4 routes A30/P8 to the bet-fit controls. The "niche category undefined" sub-point (A30) maps to the `niche` registry slot + definitions.md revision (§7.1 reference layer).

The *structure* to control transfer is in (separate N/T/P criteria, functional-mech-equivalence test, fit-verification fields). The *content* (the actual similarity thresholds, the definition of "niche category"/"product category") is ○ Job 1/Job 2. So: ADDRESSED at the contract/slot level, PARTIAL on content.

**Architecture location checked:** §6.1 (bet-brief N/T/P controls), §7.3 (bet-fit slot), §6.5 (spend-transfer consumes bet controls), PART1 D4.

**Resulting flaw if not addressed:** Minor relative to A1/A2 — the mechanism exists; risk is only that the thresholds stay empty and a build session defaults to loose transfer. Lands on: Bet Compiler output + Market Selection spend-transfer (Gate 2.1b). Absorbable at the Job 1 build session.

---

### GAP-A6 — Price-conditioning: COGS-half of Gate 2.4 structurally inert (operator deletes COGS equation)

**Reviewer finding (Reviewer A / Market / DECISION 6), quoted:**
> "**DATA-SUFFICIENCY — VIOLATION (correctly self-charged), degrading.** COGS is 'pending operator COGS' in every cell, so the margin floor (S6: 3× COGS AND $20–25 GP...) CANNOT be assessed... the consequence is that Gate 2.4's kill condition (margin fails minimum) can never fire in this run. Half of Gate 2.4 is structurally inert."

**Operator-annotated?** YES, decisively. DECISION 6 inline: "we should delete the COGS equation. we should determine correct price only. If i cannot profitably run that price, i kill the test." A40: "the market selector should not see COGS or make any decision, it should just understand what price is conditioned into this market."

**Version-status: FALSE-MOOT (resolved by operator decision in the same direction the redesign took).** The operator killed COGS in market selection outright; the reviewer's "Gate 2.4 half-inert" charge is obsoleted by *removing* the inert half.

**Propagation: ADDRESSED.** §6.5: "**COGS and profitability nowhere in its inputs** (● A29/A40): price-conditioning read only — 'what price is conditioned into this market for similar product categories selling the same transformation to the same niche'; the operator alone decides profitability." §4.2 Cut list: "COGS/profitability sight anywhere in market selection (● A29/A40/P3)." §7.2 scoping: Market Selection "Deliberately excluded: COGS anywhere (●)." Fully carried.

**Architecture location checked:** §6.5, §4.2 (Cut), §7.2.

**Resulting flaw if not addressed:** None — addressed. (One forward note, not a flaw in scope: the operator's "determine correct price only" still needs a price-conditioning test in §7.3; the registry has no explicit `price-conditioning` slot — it folds into Market Selection's "price-conditioning read." Minor, absorbable.)

---

### GAP-A7 — Low-n sophistication: stage read off 2–4 claims without surfacing the low-n caveat

**Reviewer finding (Reviewer A / Market / DECISION 5), quoted:**
> "**DATA-SUFFICIENCY — SURVIVED, with one degrading note.** ... the claim corpus is THIN — Cell 5 has 4 claims from 3 brands; Cell 6 has a single brand. A Stage-1/2 read off 2–4 typed claims is mechanically licensed by the prompt's rule but is a low-n saturation judgment... For the others it does not surface the low-n caveat on the stage read itself. Minor; degrading."

**Operator-annotated?** No direct annotation on the sophistication low-n point. (A21 on trend mechanics is adjacent but about trend, not sophistication n.) Low-loss-risk-flagged finding, un-annotated.

**Version-status: LIVE but minor; partly mitigated by R1.** R1 makes the space map a synthesizer over the *full verified roster's* analyzed funnels rather than a thin chosen-cell pass — more brands/claims per cell reduces (does not eliminate) the low-n problem. The class (stage asserted off thin claims without a confidence caveat) can still recur in a genuinely thin cell.

**Propagation: PARTIAL (test slot).** §7.3 has a `sophistication` registry slot; §6.4 routes Space Classifier claim-typing/sophistication "through the D3 test slots once Job 2 writes them (○)." Whether the stage call must carry a low-n confidence flag is unspecified — it would be test content for Job 2. Not separately mandated.

**Architecture location checked:** §7.3 (`sophistication` slot ○), §6.4 (Space Classifier staging ○), §1.5 (fuller roster).

**Resulting flaw if not addressed:** A thin cell gets a confident stage label with no low-n warning, mildly inflating/deflating the differentiation-requirement read. Lands on: Space Classifier sophistication field → Market Selection Gate 3. Low severity; absorbable at Job 2 by adding a low-n basis field to the sophistication test.

---

### GAP-A8 — Avatar-quality criteria (S8) not collected as pick inputs

**Reviewer finding (Reviewer A / Market / DECISION 1 data-sufficiency), quoted:**
> "Per S7/S8 the avatar criteria (identify with the problem? bought before? unsatisfied? no brand loyalty? VOC accessible?) are REQUIRED inputs to a market pick (market-evaluation-criteria.md Avatar). None are present in space-map.json or assessed in market-selection.md. The run cannot assess a single avatar-quality criterion because the data was deliberately not collected."

**Operator-annotated?** Indirectly — the VOC subsystem annotations (A6/A15) and DECISION 3 inline ("how to read a brands material and understand who they sell to... the call outs that they do... what kind of person they purposely exclude"). The avatar-criteria list itself is not annotated item-by-item.

**Version-status: LIVE class, substantially addressed by the new VOC subsystem.** The as-ran "deliberately not collected" cause is removed: VOC pass-1 now exists specifically to collect demand/identity signal pre-selection.

**Propagation: PARTIAL→ADDRESSED with one R2 gap live.** 
- §5.1 Product 1 `voc-market-signal` §1 "Transformation signal — does this niche articulate wanting this transformation: unique-raiser counts for desire/frustration/purchase-intent themes" + §3 "Niche identity baseline." This covers "identify with the problem," "VOC accessible," and partially "unsatisfied."
- BUT "unsatisfied with current solutions" / "bought before" / "no brand loyalty" map directly onto **R2 GAP-2** (the highest-priority unflagged hole): §5.1 "(i) an invalidation / unsatisfied-customer lane... (ii) a 'customers who already have the transformation' population... (iii) a could-our-product-satisfy delta." §5.3 marks GAP-2 the priority, routed ○ Job 3. So the avatar-criteria that the reviewer named as missing are *exactly* the GAP-2 lanes that PART3 admits are not yet specced.

**Architecture location checked:** §5.1 Product 1 §1/§3, §5.2 (Gate 1 ← market-signal §1), §1.6 GAP-2, §5.3, PART0 STEP 4 GAP-2.

**Resulting flaw if not addressed:** If Job 3 doesn't add the GAP-2 lanes, the market pick still lacks the "unsatisfied / already-have / brand-loyalty" avatar inputs the law demands — a partial reproduction of the as-ran avatar blind spot, now on the VOC side. Lands on: VOC pass-1 contract → Market Selection Gate 1. Needs Job 3; PART3 already flags it as highest-priority ○.

---

## SECTION 2 — OBSOLETE: RESOLVED BY REDESIGN

Findings whose targeted structure is GONE *and* whose failure class cannot reintroduce, with the one-line reason.

1. **DECISION 2 data-sufficiency — `demand_trend.shape == "unknown"` for all 20 brands / `qualifying_creatives == 0` in all cells.** OBSOLETE as *delivered-data bugs* (asran §9 #8 fetch.js XHR break; #11 ad-longevity never lifted) — explicitly off-limits to re-flag, and R1 §1.1 root-causes both + §1.5/§6.5 produce ad-volume/longevity deterministically pre-selection and repair Trends. *(The floor-definition half is NOT obsolete — see GAP-A2.)*

2. **DECISION 6 COGS / margin-floor half of Gate 2.4 inert.** OBSOLETE — operator deleted the COGS equation from market selection entirely ("delete the COGS equation... determine correct price only"); §6.5/§4.2/§7.2 remove COGS from Market Selection's sight. The inert-half can't recur because the half is gone.

3. **DECISION 1 rule-soundness premise that "the law (S7) makes the real transformation a VOC finding."** FALSE-MOOT (operator-killed, not architecture-killed): P5/A31/P20 reject the VOC-only premise the reviewer derived from the LAW, and PART3 §2 confirms against the full KB that "No passage anywhere in the 65 files requires transformation to be derived from VOC exclusively." *(The disclosure-carry obligation built on top of this is NOT obsolete — see GAP-A1; and "transformation must still be tested mechanically" persists as the ○ D2/D3 test.)*

4. **Implied-but-absent fields on `combos[]` (sophistication_stage, bet_type, demand_trend at cell grain) framed as missing outputs.** OBSOLETE as the reviewer's *artifact-completeness* charge: asran §9 #9 inverts it — these fields **do exist** in the as-ran run on `per_brand[]`/top-level, just not on `combos[]`; and R1 dissolves the old Space Classifier into a synthesizer whose output schema is openly ○ (§1.5 STEP 3), to be set at the space-map build session. The "fields silently vanished" class (CC-A2) is addressed by P6 "every interpretive check becomes a named test" + §6.4's universal `basis` emission. *(Standalone per-axis quantification remains R2 GAP-1, ○ — but that is a new operator requirement, not this reviewer's finding.)*

---

## SECTION 3 — VALIDATED: KEEP THESE (redesign must not regress)

What Reviewer A — Market found SOUND. The redesign must preserve these; flagged where a regression risk exists.

1. **DECISION 8 — Spend-transfer check (Gate 2.1b): "the strongest part of the output," SURVIVED exemplary.** Quoted: "This catches the '$5 app vs $500 theanine' failure... The run applies it with teeth: Cell 6 near-killed... This is the run doing the law's job against its own product. No charge." **KEEP + EXTEND:** the operator's inline ask (DECISION 8 + A30) is to *generalize* it — "similar NTP required, like similar niche, transformation and product category... N, T, and P similarity must be evaluated separately, with their own criteria." **Captured:** §6.1 Bet Compiler emits "N/T/P similarity controls as three separate criteria sets" + functional-mech-equivalence; §7.3 `bet-fit` slot. *Regression risk:* the transfer logic must not collapse back into one blended similarity score — §6.1's "three separate criteria sets" must survive the Job 1 build. Watch that the niche/product-category definitions (A30's "I never determined what a niche category even is") actually land in definitions.md (§7.1 reference layer) or the transfer control has no `product category` to test against.

2. **DECISION 5 — Sophistication read mechanically, kept SEPARATE from awareness: SURVIVED, strong.** Quoted: "The prompt enforces both: ... Gate 3 'Mechanical, read off typed claims — not a vibe'... Gate 4 (awareness) is explicitly DEFERRED, not faked." **KEEP:** the sophistication/awareness axis separation. *Regression risk:* R1 moves per-funnel awareness *earlier* (STEP 2, feeding the space map) and adds the Awareness Reconciler (§6.6). The redesign must not let awareness leak into the sophistication stage call now that both are computed pre-selection. §6.4 keeps sophistication as a claim-typed Space Classifier property; §6.6 keeps awareness a separate reconciled read — separation preserved, but the seam is new and worth a Job-2 check (the registry has distinct `sophistication` and `awareness` slots, which is the right structure).

3. **DECISION 4 — Believability judged fresh against the stated mechanism for the claimed desire: SURVIVED.** Quoted: "transparency is Tier-1 self-evident... the cells where the mechanism does NOT credibly serve the transformation are flagged ('see-through ≠ authentic retro')... fresh mechanism-to-desire believability reasoning, cell by cell." **KEEP:** the per-cell fresh believability gate. **Strengthened, not regressed:** §6.4 adds a "mechanism-vs-feature + **believability gate**" to the Space Classifier (operator's S4/DECISION 6 inline: "a big screen, if it does not actually plausibly deliver the transformation then its a product feature... must pass a believability gate"); §7.3 registry `mechanism-vs-feature (+ believability gate parameterized by niche, A37)`. The redesign extends this correctly — must not drop the "parameterized by niche" part.

4. **DECISION 3 — me-too KILL genuinely enforced; transparency-as-ownable-UM grounded in observed mechanism occupancy: SURVIVED, strong (mechanism half).** Quoted: "a textbook application of the 5+/shared-claim discount rule... the run actively refuses to enter a shared lane as 'the nth identical voice.'" **KEEP:** observed `mechanisms_in_play[]` ownability driving the UM call, and the refusal to lead on a taken lane. *Regression risk:* §6.4 keeps ownability as a Space Classifier output, but ownability is now recomputed by a synthesizer over a fuller roster (R1) — the "ownable because the cell is only 3 brands deep" artifact the Collection reviewer flagged could change sign with more brands; ensure the ownability read stays per-cell and honest about cell depth.

5. **The PROVISIONAL → DRY-TEST-ONLY discipline (DECISION 1 / DECISION 2 / PHASE 2): the run's "saving grace."** Quoted: "the run is structurally honest about being PROVISIONAL → DRY-TEST-ONLY and never claims to pick the market, which keeps the violations DEGRADING rather than FATAL." Operator confirms scope (DECISION 1 inline: "these are only market tests im running, it is not the job of this project to worry about moq and fulfillment"). **KEEP:** §6.5 "Stops at ranked PROVISIONAL survivors (kept; D1-human discipline)" + STEP 5 ★ operator NTP pick + P9 "Operator decision points are pipeline stages." Do not let any build session promote Market Selection from ranker to picker.

---

## SECTION 4 — SHORTLIST: highest-severity findings STILL LIVE and never propagated into a mandate

Ranked. These are the ones where the redesign has *not* closed the failure class with a mandatory mechanism — only added a source or a routed ○ slot.

1. **GAP-A1 — Asserted/unvalidated transformation is never FORCED into the load-bearing conclusion.** The named FALSE-MOOT risk is realized: the redesign ADDS VOC as a Gate-1 source (§5.2) and generalizes `_provenance` into per-property `basis` (§6.4), but **no refuse-condition or output contract mandates an unvalidated-transformation flag riding into the ranked PROVISIONAL output or the operator NTP-pick artifact.** §6.5's "every verdict carries its evidence row" and STEP 5's "or at least the transformation" are not that mandate. The disclosure-carry obligation is class-independent of the (operator-rejected) VOC-only debate and survives the redesign. *Needs operator decision:* add a mandatory `transformation_validation`/unvalidated-flag field to the Market Selection output contract and the NTP-pick artifact — this is a contract decision a build session can implement but should be operator-blessed because it defines what the operator must see before picking. **This is the single highest-value live finding.**

2. **GAP-A2 (floor-definition half) — Gate 1 anti-fluke floor is undefined, routed ○ to Job 4; a single comparable + bet-evidence can still clear it.** §6.5 + §10 explicitly defer "anti-fluke floors, currency weights, revenue's weight" to Job 4. More currencies exist (good) and VOC/community-heat are now required-present (good), but *what clears the floor* is unwritten — a build session could re-instate soft-gate-by-default. *Needs the Job 4 operator session* (threshold = marketing truth). Carry P7 ("revenue must absolutely be heavily considered") and the 2+ floor into that session.

3. **GAP-A3 — Ranking conflates UM-fit with demand magnitude when magnitude is thin.** Community heat + VOC demand narrow the as-ran gap, but the aggregation rule (A32's "idk if angle type can be aggregated numerically... implication for aggregation and IO contracts") is ○ Job 4, and no agent cross-checks whether the rank is a demand rank or a fit rank. *Needs Job 4* (aggregation/IO contract).

4. **GAP-A8 / R2 GAP-2 — avatar-quality inputs (unsatisfied / already-have-transformation / brand-loyalty) absent.** The exact S8 avatar criteria the reviewer named map onto PART3's own highest-priority unflagged-until-now hole (R2 GAP-2), ○ Job 3. *Needs Job 3.* Without it the pick still lacks the law's demanded avatar inputs, now on the VOC side.

Lower-severity live items absorbable at their build sessions without fresh operator strategy: **GAP-A4** (differentiator conjunction-vs-disjunction + niche test — Job 2, KB citation already staged in §2), **GAP-A5** (NTP-similarity thresholds/niche-category definition — Job 1/2, structure already in §6.1/§7.3), **GAP-A7** (low-n sophistication confidence flag — Job 2, add a basis field).

---

### Auditor's one-line bottom line
Reviewer A — Market's *gate-mechanics* praise (DECISIONS 4/5/8 SURVIVED) is preserved and in several places strengthened by the redesign; its *delivered-data* charges (DECISION 2/6 data) are obsoleted as as-ran bugs the operator either fixed (Trends, ad-longevity) or deleted (COGS). But its two load-bearing *join* findings persist as live holes: the **disclosure-carry** (the transformation's unvalidated status must ride into the conclusion — ABSENT as a mandate, the realized "merely add VOC and bury the disclosure" risk) and the **undefined Gate-1 floor + fit-as-demand ranking** (PARTIAL, routed ○ to Job 4). The redesign made these *fixable* (sources wired, slots named) without yet making them *fixed*.
