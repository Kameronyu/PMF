# OPEN DECISIONS — relocated visibility list

> **What this is.** A *relocated* visibility list. It lifts forward-building items that are currently buried inside `PART4--review-propagation-audit-and-agent-building-skills.md` and the `AUDIT-*.md` reference files up to the base root, so a build session reading the architecture set does not miss them. **It makes NO ruling and decides nothing** — every decision still belongs to the operator and/or the later build/decision sessions named here. Each item below is a one-line statement, its source doc + section with a short verbatim quote, and a STATUS. Relocating an item does not change its status, owner, or content.

---

## A. Build-time agent-building skills to build BEFORE Jobs 2/3/4

PART4 §5 proposes five build-time meta-skills; §7 names the **three core** ones as the highest-leverage next move, to be built *before* Jobs 2/3/4 so those sessions run *through* them and can't re-introduce the ambiguity class.

### A1 — `decision-spec` (the flagship)
- **Statement:** A gate every agent must pass before its prompt is written — forces a de-ambiguated Decision Spec (decision sentence with no abstract noun left undefined, named inputs + grain, procedure, verdict enum, licensing rule, refuse condition, n/low-n, worked + known-failure examples). Kills the "underdefined decision verb" class.
- **Source:** `PART4--review-propagation-audit-and-agent-building-skills.md` §5.1 / §7. Quote: *"`decision-spec` — the flagship (kills C1, C2, C8) ... A gate every agent must pass *before its prompt is written*."* and *"build the three core agent-building skills — **`decision-spec`, `contract-congruence`, `grounding-and-refuse`** — *before* Jobs 2/3/4"*.
- **STATUS: needs operator ruling** (build-sequencing decision: whether to build these skills before Jobs 2/3/4).

### A2 — `contract-congruence`
- **Statement:** Every agent declares an I/O contract (consumed/emitted/withheld fields + grain + carry-fields); a pipeline-level checker verifies every consumed field has a producer at the right grain, every emitted field has a consumer, no silent soft-gate default, and no consumer runs before its inputs/checker content exist. Kills producer/consumer mismatch, uncertainty-not-carried, and the sequencing trap.
- **Source:** `PART4--review-propagation-audit-and-agent-building-skills.md` §5.2. Quote: *"`contract-congruence` — \"make each output feed the next\" (kills C3, C4, C5)"*.
- **STATUS: needs operator ruling** (build-sequencing decision, as above).

### A3 — `grounding-and-refuse`
- **Statement:** A checker/validator-authoring skill: any test must name its licensing datum, return UNKNOWN/REFUSE (never PASS) when its parameters or corpus are absent, and propagate rather than swallow uncertainty. Kills naked assertions and green checks over an empty corpus.
- **Source:** `PART4--review-propagation-audit-and-agent-building-skills.md` §5.3. Quote: *"`grounding-and-refuse` — no naked assertions, no green checks over nothing (kills C2, C6)"* and *"**return UNKNOWN/REFUSE — never PASS — when its parameters or corpus are absent**"*.
- **STATUS: needs operator ruling** (build-sequencing decision, as above).

*(PART4 §5 also proposes two supporting skills — `invariant-register` (§5.4) and `adversarial-self-review` (§5.5) — relocated here for completeness; the three above are the ones PART4 §7 prioritizes before Jobs 2/3/4.)*

---

## B. Operator rulings PART4 §6 flags as "needs operator now"

### B1 — L1: unvalidated-transformation carry-field  →  CONFIRM-ONLY, likely closed
- **Statement:** Whether to add a mandatory `transformation_validation` / unvalidated-flag field to the Market-Selection output contract and the NTP-pick artifact, so an asserted/unvalidated transformation rides into the conclusion the operator acts on (rather than being buried in an optional `basis` string).
- **Source:** `PART4--review-propagation-audit-and-agent-building-skills.md` §6 (L1) + `AUDIT-market.md` GAP-A1. Quote (PART4 §6): *"The **unvalidated-transformation carry-field** into the Market-Selection output + NTP-pick artifact (L1) — a quick contract ruling."* Quote (AUDIT-market GAP-A1): *"add a mandatory `transformation_validation`/unvalidated-flag field to the Market Selection output contract and the NTP-pick artifact"*.
- **Note:** This is **already captured as MR-006 in the marketing-rule-register** (RECON-PLAN records MR-006 as "the rule-form of the L1 carry-field"), so the ruling may already be closed.
- **STATUS: CONFIRM-ONLY, likely closed** (confirm MR-006 fully captures the L1 carry-field; if so, no new ruling needed).

### B2 — L3: VOC as a hard precondition for the copy stage
- **Statement:** Whether to make "VOC present" a hard precondition for the copy stage (no soft-gate path into copy) and sequence Job 8 (copywriter) behind Job 3's bank contract — so the Command+F register-check is never a green check over an empty/pass-1 corpus.
- **Source:** `PART4--review-propagation-audit-and-agent-building-skills.md` §6 (L3) + §1 (L3 row) + `AUDIT-funnel.md` GAP-A. Quote (PART4 §6): *"The **\"VOC is a hard precondition for copy\"** rule (L3)."* Quote (PART4 §1, L3): *"make \"VOC present\" a hard precondition for the copy stage (no soft-gate into copy) + sequence Job 8 behind Job 3's bank contract."*
- **STATUS: needs operator ruling.**

### B3 — L6: out-of-chain offer / deposit / asset scope ruling
- **Statement:** A one-line scope ruling — is the offer / deposit-mechanic / assets / founder-voice layer (~half the funnel) **exempt-by-design** (operator-supplied) or **in-scope to ground** as pipeline artifacts? If exempt, say so in §6.7 so the Funnel Auditor stops being expected to vouch for it; if in-scope, it is a new stage in the topology.
- **Source:** `PART4--review-propagation-audit-and-agent-building-skills.md` §6 (L6) + §1 (L6 row) + `AUDIT-reviewerB.md` A1/Shortlist-1. Quote (PART4 §6): *"The **out-of-chain offer/asset scope ruling** (L6) — one line: exempt-by-design or in-scope to ground?"* Quote (AUDIT-reviewerB A1): *"is this layer exempt-by-design ... or in-scope to ground?"* and *"the mechanics/offer/assets half is paid for by out-of-chain references the funnel openly cites"*.
- **STATUS: needs operator ruling.**

---

## C. Missing pricing / anchor registry slot

### C1 — PART3 §7.3 has no pricing / anchor registry slot
- **Statement:** The test registry (PART3 §7.3) has no pricing/anchor slot, so there is no blocking test that the emitted offer anchor (e.g. the $299 MSRP, above the observed $30–$199 cell band) traces to a licensing datum (sum-of-parts or a real comparable at/above the price). A slot should be added — but adding/defining it is the operator's (D5/offer build) call.
- **Source:** `AUDIT-reviewerB.md` Shortlist-2 / B4 + `AUDIT-market.md` GAP-A6. Quote (AUDIT-reviewerB Shortlist-2): *"the registry currently lacks the slot"* and *"§7.3 has no pricing/anchor slot — it should gain one: \"offer anchor must trace to sum-of-parts OR a real comparable at/above the price, else flag.\""* Quote (AUDIT-market GAP-A6 forward note): *"the registry has no explicit `price-conditioning` slot — it folds into Market Selection's \"price-conditioning read.\""*
- **STATUS: needs operator ruling.**

---

*End of relocated visibility list. No item above has been decided here. Owners as named: build-sequencing (operator), Jobs 2/3/4 sessions, the D5/offer build, and the marketing-rule-register (for MR-006 confirmation).*
