---
status: brief
role: Per-step build brief for STEP 7 — Funnel Architect (+ Awareness Reconciler, + Funnel Auditor). Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 7
covers: Funnel Architect — the single agent that architects the funnel for the chosen market; plus the Awareness Reconciler (runs before it) and the Funnel Auditor (cold checks after it). Ends at ★ operator review.
---

> **What this is:** the reading list + duties for the session that rebuilds the **Funnel Architect** (single agent, ● A43 "probably not" to splitting), with its two companions: the **Awareness Reconciler** (upstream, thin) and the **Funnel Auditor** (cold checker between architect and operator). Open this, follow the pointers, build — nothing is copied, every line points into the base. **Start with §"What was already run" — the as-ran funnel-architect skill + its run are the highest-leverage inputs.** Ends at the ★ operator review (P9).

## In one line
Architects the funnel for the chosen market — reads the market's own funnel teardowns + the quantified VOC + the reconciled awareness-read + the validation-currency model, and designs the **congruent belief chain**. A cold Funnel Auditor runs mechanical checks (congruency per seam, belief-chain coverage, claim legality, input receipts) → ★ operator review. Single agent; its *checking* burden moves out to the Auditor, not a split inside the decision.

## ★ Start here — what was already run (highest leverage)
Read the **as-ran funnel-architect skill you are rebuilding** and the artifacts it produced, before anything else.
- **The as-ran skill (rebuild target):** `pmf3/SKILL-funnel-architect.md` — the MVP funnel-architect skill (parent folder; catalogued in `reference/EXTERNAL-INPUTS-MAP.md` §A). **Read this first** — including its THREE-LAYER AUTHORITY / never-merge model, which §2 found has **no KB provenance** and is now a *configurable* policy input.
- **What it produced + the headline absences:** `reference/as-ran-repo/asran-repo-report.md` is the reader's guide (the null-input run: belief chain on asserted transformation, awareness null, tally self-flagged unusable, no VOC). Run artifacts under `reference/as-ran-repo/repo-files/runs/arduview/`.
- (Do **not** re-prosecute the as-ran wiring bugs — null 6a store, unusable tally consumed anyway, analyzer blind to validation lane; all root-caused in PART3 §1.1 and closed in R1/§6.7.)

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md` → STEP 7** — the job logic (ingests analyzed-funnel store + tally + reconciled awareness-read + voc-bank belief/angle view + currency model + bet-brief/market selection; emits a design brief → auditor → ★ operator review). **Read PART0 GAP-4 inline** — adjacent-market funnels.
2. **`architecture/PART3--architecture-design.md`:**
   - **§6.7 (Funnel Architect half)** — the architect card: single agent (● A43), input set completed per A43's "tapped inputs" worry, refuse conditions (null awareness-read; tally `low_n_warning` without override; missing voc-bank when VOC active; missing currency policy). **The three-layer authority / never-merge rule is a declared, configurable policy input, NOT hard-coded.** *The spine of the rebuild.* Read the ⚠ banner: only "input set closed" is pre-R1 — **R2 GAP-4** reopens it to optional adjacent-market funnels.
   - **§6.6** — the Awareness Reconciler card (NEW, thin ◆): reconcile per-funnel `awareness_entry` across funnels **weighted by validation strength** (P14) against the VOC awareness view; aggregation = script, agent adjudicates conflicts only; refuse on null `awareness_entry`.
   - **§6.8** — the Funnel Auditor card (NEW ◆): cold checker, verdicts only, no design authority; the test battery (congruency per seam, belief-chain coverage vs awareness, claim legality vs blocked ports, dead-ground avoidance, **input receipts**, whitespace-use justification). Mid model, no Read access beyond brief + locked inputs.
   - **§6.0** — soundness duties rows for Architect (grounds belief-chain/offer/angle via MR-001 never-merge + DR-law; carries UNGROUNDED proven-vs-reputational fill + never-merge status), Reconciler, and Auditor (`CANNOT-EVALUATE` where test content is ○ — **never PASS on an empty test**).
   - **§7.2 / §7.3** — knowledge scope (conditional digests: advertorial/VSSL/quiz load only when the chosen shape needs them) + registry slots: `congruency` (per seam ○), `awareness` (evidence + aggregation ○), `angle`, offer-construction.
3. **`architecture/PART1--dependency-ordered-map.md`** — the operator annotations:
   - **A43** (D1/D5/D6/D7) — light funnel knowledge; "make sure this thing has tapped inputs"; do-not-split; awareness from competitor funnels vs VOC; crowdfunding-vs-DTC; deposit funnel as the most valuable; auditor-after-builder.
   - **A33** (D3) — the **mechanical rigor test for congruency** per seam, "not based on vibes."
   - **P14** (D5/D6) — never assume all crowdfunders share one awareness level; verify by other validated brands' funnels, aggregated.
   - **P16** (D5) — challenge the never-merge rule ("what does that even mean").
   - **D6** (PART1 §7) — awareness producer/placement/evidence/contract (A3/A4 settled; evidence ○).
4. **`architecture/PART2--build-order-roadmap.md` → Job 4 (D5)** supplies the currency model + never-merge's fate + crowdfunding/DTC unification + deposit-funnel standing; **Job 2** supplies the congruency test content the Auditor runs. This build wires the architect's I/O + the auditor's enforcement points; Jobs 2/4 set the rules they enforce.

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- Every load-bearing verdict carries a `grounding_ref` + `carried_risks[]`. **MR-001** (never-merge, configurable-pending-D5) governs the architect's authority model; **MR-005** (blocked ports — a debut claims only what it can back) is the Auditor's claim-legality check; **MR-002/MR-003** guard the proven-fill against laundered/cross-cell evidence.
- The verbatim **custody chain** (P7): the architect consumes the **structured roll-up** and pulls verbatim **on demand, slot-scoped, via the RAG index** — never the wholesale verbatim store (A42's lossiness answer).

## Adversarial findings this build must honor (`reference/reviews/`)
Read **`AUDIT-funnel.md`** in full **+ `AUDIT-reviewerB.md`**; the load-bearing ones:
- **AUDIT-funnel GAP B (FATAL at the fill)** — the proven-governed FILL layer can again have zero in-transformation Currency-A backing on a thin winner cell; the architect's disposition is unchanged, and the Auditor's proven-vs-reputational test is ○ Job 2/4. Wire the refuse-on-`low_n_warning` + the whitespace-justification check; carry the GAP-D linkage to D5.
- **AUDIT-funnel GAP C (congruency)** — the Auditor is the right enforcement point but its per-seam **driver-identity test is ○ Job 2**; A33 forbids a vibe-based congruency check, so the Auditor must `CANNOT-EVALUATE` (not PASS) until the test lands. The concrete break to catch: status↔belonging asserted as one angle.
- **AUDIT-funnel GAP D (never-merge regression risk)** — this was the cold reviewer's **strongest single finding**; making it configurable risks reviving GAP B. Carry to D5 that "no KB file" ≠ "no support" (= MR-001 + `invariant-register`, OPEN-DECISIONS C7).
- **AUDIT-funnel GAP E/F/G/H** — awareness evidence-sufficiency (○), feature-as-believed-mechanism test (○ Job 2), single-leg trust (P22 ○ Job 4), $299 anchor credibility (no auditor anchor-vs-band check).
- **AUDIT-reviewerB A1 / shortlist #1 (closest to fatal) — the out-of-chain offer/asset dependency** (~half the funnel: deposit mechanic + offer + assets + founder voice not pipeline-produced). GAP-4 only adds adjacent-market funnels as *inspiration*. **This needs the L6 scope ruling** — if exempt-by-design, say so in §6.7 so the Auditor stops being expected to vouch for it.
- **AUDIT-reviewerB B4 / §3.3** — the $299 above-band anchor with no forcing test; and the bet-transfer logic must not silently re-label the "transparency" verbal hook as proven.
- **KEEP (do not regress):** blocked-port discipline (MR-005); the differentiator's "ownable-but-unproven, cosmetic-only" honesty; "cleverness earned live" routed to a dry test.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **B3 / L6** — the **out-of-chain offer/asset scope ruling** (exempt-by-design or in-scope to ground?). **Highest-value here** — it decides what the Funnel Auditor is expected to vouch for.
- **C1** — the missing **pricing/anchor registry slot** (PART3 §7.3): "offer anchor must trace to sum-of-parts OR a real comparable at/above the price, else flag." Add the slot for the Auditor.
- **A1/A2/A3** — the three build-time meta-skills; the Auditor's empty tests are exactly the `grounding-and-refuse` "empty test = REFUSE, never PASS" case.
- **R2 GAP-4** — adjacent-market funnels as an architect input: decide whether they are an input and how they're selected/scoped (else silently skipped).
- **Dependencies that are NOT this build's call:** never-merge's fate + currency model + crowdfunding/DTC unification → **Job 4**; congruency + feature-as-believed-mechanism test content → **Job 2**; awareness evidence precedence → **Job 2/3**. Wire the I/O so these drop in; do not hard-code them.

## Done =
The architect is a **single agent** with a **completed, tapped input set** (store + tally + reconciled awareness-read + voc-bank + currency policy + bet/market), designs a **congruent belief chain on buyer language**, consumes never-merge as a **declared configurable policy** (not hard-coded), refuses on null awareness-read / unusable tally without override / missing voc-bank when VOC active; the **Awareness Reconciler** produces a validation-weighted, VOC-reconciled read (no null); the **Funnel Auditor** runs cold mechanical checks and returns `CANNOT-EVALUATE` (never PASS) on any ○-content test — handing the brief to the ★ operator, with congruency/currency/never-merge/anchor rules left as wired ○ slots pointing at Jobs 2/4 and the L6/C1 rulings.
