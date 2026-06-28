---
status: brief
role: Per-step build brief for STEP 6 — VOC deep pass (pass-2/3 / 3b). Points (not copies) to the slices the build session needs.
read-with:
  - INDEX.md
  - reference/handoffs/handoff-step3-voc-build.md
step: 6
covers: VOC deep pass — the deep, winner-only research pass that builds the verbatim copy bank + frequency brief the funnel architect and copywriter pull from.
---

> **What this is:** the reading list + duties for the session that builds the **VOC deep pass (pass-2/3 → the copy bank)**. **VOC is net-new — no as-ran VOC skill to rebuild.** Highest-leverage input is the **VOC build handoff** (§"Start here"). Build *from* its locked canon; don't re-litigate its settled decisions. Same engine as STEP 4, run deep on the winning niche only.

# STEP 06 — VOC deep pass (pass-2/3 / "3b")

## In one line
Run the customer-research engine **deep, on the chosen niche only**: ladder verbatim spans to T1–T4, read one **driver per sub-niche**, and organize attributed verbatim into a queryable **copy bank** + a **frequency brief** (per-PMBDE-theme counts). The bank is what the Funnel Architect and Copywriter RAG from.

## ★ Start here — the VOC build context (highest leverage)
There is **no prior VOC skill** — build from the handoff and its canon.
- **The build handoff (primary):** `reference/handoffs/handoff-step3-voc-build.md`. For STEP 6 you are building its **PASS 2 (extraction) + PASS 3 (bank)** = 3b: the **Ladderer**, the **Language Analyzer**, the verbatim-gate hook, the driver-at-cluster-level read, and the copy-bank store. **Read it top to bottom; do not regenerate its canon.**
- **The keystone (shared with STEP 4):** the **classifier codebook** — built from `pmf3/definitions.md` (PMBD × T1–T4, 6 belief surfaces, sub-niche rule) + the VOC contract in **PART3 §5.1** + the handoff's settled decisions (§4/§5). Here the Ladderer assigns **tier** (T1–T4) off the same codebook (handoff §5 split: Bucketer=letter+theme in pass-1, Ladderer=tier in pass-2).
  - **Note — don't chase the stale canon:** the handoff names `workflow.md` + `capability_inventory.md`, but those are **beyond stale (superseded) — do NOT hunt for them.** The in-base architecture is sufficient (same as STEP 4).
- **Storage contract (handoff §4):** the per-quote record (`raw_text, char_offsets, author_id, permalink, upvotes, pmbd_letter, tier, belief_surface, sub_niche_id, trigger, intensity`) and the **two materialized views** off the one store: the **frequency brief** (what Kam strategizes from) + the **copy bank** (what Step 4 copy RAGs from).
- **Prior art:** Vindicta deep-dive outputs (handoff §9) — evidence the real method is broad-pass→scoped-deep-dives. *Format to match:* `reference/as-ran-repo/repo-files/prompts/step1-light-pass.md`.

## Then build from (architecture — how this step wires into the pipeline)
1. **`architecture/PART0--pipeline-flow.md` → STEP 6** — the job logic (ingests the chosen winner cell at pass-2/3 depth; emits `voc-bank` = copy bank + frequency brief + belief/angle + awareness evidence views; feeds Awareness Reconciler, Funnel Architect, Copywriter). **Read ⚠ GAP-3** (per-PMBDE-theme frequency counts: named, not yet contracted).
2. **`architecture/PART3--architecture-design.md`:**
   - **§5.1 Product 2** — the pass-2/3 / copy-bank contract.
   - **§6.6 / §6.9** — its consumers (the Awareness Reconciler's evidence rule; the Copywriter's RAG bank, whose input "currently does not exist" — this build creates it).
3. **`architecture/PART1--dependency-ordered-map.md` → D1** — A6 (the two-VOC-products split: market-selection VOC vs angle/belief VOC — this is the **angle/belief** one), A15, A37 ("classify each distinct idea... huge ammo for writing a funnel").
4. **`architecture/PART2--build-order-roadmap.md` → Job 3** (with Job 8 the downstream consumer — the copywriter's RAG bank).

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- **The verbatim-grounding hard gate is the moat** (handoff §4, §10 No-LLM-generated-copy rule): the Language Analyzer organizes and light-cleans verbatim but **NEVER rewords or authors** a customer phrase; every span string-verifies to the raw immutable source by `(author_id, char-offsets)`. This is the soundness spine — real attributed verbatim with live permalinks vs the digital-twin wave.

## Adversarial findings this build must honor (`reference/reviews/`)
- **PART0 GAP-3 — per-PMBDE-theme frequency counts.** The "frequency brief" is named but only pass-1's frequency machinery is specced; the deep pass owes a **count-per-PMBDE-theme table for the chosen market** (don't inherit the pass-1 shape and stop). Routed ○ Job 3.
- **AUDIT-funnel** — the copy stage's belief-chain must sit on **buyer language, not asserted transformation** (the as-ran retrospective's named failure: "No VOC — the belief chain sits on asserted transformation"). The copy bank this step builds is exactly what removes that failure — so the verbatim spans + belief surfaces must be rich enough for the architect to ground beliefs in real language.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **GAP-3** per-PMBDE-theme frequency table — ○ **Job 3**.
- The **co-occurrence / per-individual clustering** (handoff §4) is the build's genuinely-novel piece (no prior art) — capture ALL of a user's qualifying quotes, never best-post scoring; that's a strategy-relevant fork to confirm with Kam.
- Intensity **weighting** (vs the default VADER+engagement+length score) is Kam's strategy call (handoff §4) — surface, don't decide.

## Done =
A reusable, templated pass-2/3 spec that, on the winning niche, emits the attributed **copy bank** (retrievable by slot) + the **frequency brief** (per-PMBDE-theme, laddered, driver-keyed) + the awareness/belief evidence views — every span verbatim-gated to source, nothing reworded — feeding the Awareness Reconciler, Funnel Architect, and Copywriter. Built **from** the handoff canon.
