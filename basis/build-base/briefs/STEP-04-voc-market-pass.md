---
status: brief
role: Per-step build brief for STEP 4 — VOC market pass (pass-1 / 3a). Points (not copies) to the slices the build session needs.
read-with:
  - INDEX.md
  - reference/handoffs/handoff-step3-voc-build.md
step: 4
covers: VOC market pass — the shallow, per-candidate-cell customer-research pass that feeds Market Selection (demand signal + gap_candidates).
---

> **What this is:** the reading list + duties for the session that builds the **VOC market pass (pass-1)**. **VOC is net-new — there is no as-ran VOC skill to rebuild** (the Arduview run shipped without VOC). So the highest-leverage input is the **VOC build handoff** (§"Start here"), not a prior skill. Build *from* its locked canon; don't re-litigate its settled decisions.

# STEP 04 — VOC market pass (pass-1 / "3a")

## In one line
Run the customer-research engine **shallow, per candidate market cell**: measure transformation **demand signal** (unique-raiser counts, intensity, counter-signal), map **category language**, baseline **niche identity**, and surface **`gap_candidates[]`** (demand the competition isn't serving). Feeds Market Selection's Gate 1 as the demand-side currency.

## ★ Start here — the VOC build context (highest leverage)
There is **no prior VOC skill** — build from the handoff and its canon.
- **The build handoff (primary):** `reference/handoffs/handoff-step3-voc-build.md` — the full, self-contained Step-3 VOC build brief (architecture, the locked decisions §4, the keystone classifier codebook §5, prior-art §7, gotchas §8). For STEP 4 you are building its **PASS 1 (3a)**: the Bucketer + the frequency/co-occurrence/clustering scripts. **Read it top to bottom; do not regenerate its canon.**
- **The keystone — build first:** the **classifier codebook** (handoff §5) — built from `pmf3/definitions.md` (the canonical VOC vocabulary, PMBD × T1–T4; distinct from the as-ran `reference/as-ran-repo/repo-files/definitions.md`) + the VOC contract in **PART3 §5.1** + the handoff's settled decisions (§4), compiled into a tagging contract in the `step1-light-pass.md` format. Passes 1–3 all key off it.
  - **Note — don't chase the stale canon:** the handoff also names `workflow.md` + `capability_inventory.md`, but **those are beyond stale (superseded) — do NOT hunt for them.** The in-base architecture (PART3 §5.1 + `pmf3/definitions.md` + the handoff's own §4/§5 decisions) is sufficient to build the codebook.
- **Prior art (Kam's earlier manual VOC):** the Vindicta prompts/outputs (handoff §7 prior-art + §9 locations, `~/Documents/Vindicta/` — external; reference only, not required) — their frequency-table architecture survives as scripts+hooks; their "three jobs in one prompt" bloat is what the micro-agent split fixes.
- *Format to match:* `reference/as-ran-repo/repo-files/prompts/step1-light-pass.md` (schema contract + deterministic scaffold + reject-hooks + thin per-agent prompts).

## Then build from (architecture — how this step wires into the pipeline)
1. **`architecture/PART0--pipeline-flow.md` → STEP 4** — the job logic (ingests the candidate cells the space map surfaces + the bet-brief; emits `voc-market-signal` 3 sections + `gap_candidates[]`; feeds Market Selection). **Read ⚠ GAP-2 there** — the highest-risk open hole.
2. **`architecture/PART3--architecture-design.md`:**
   - **§5.1 Product 1** — the pass-1/3a contract (what `voc-market-signal` must contain).
   - **§5.2** — how §1 feeds Market Selection Gate 1 (demand-side currency).
   - **§5.3** — why GAP-2 is the priority, routed ○ Job 3.
   - **§1.6 GAP-2** — the formal open decision.
3. **`architecture/PART1--dependency-ordered-map.md` → D1** (VOC integration) — A6 ("the VOC needed to feed market selection is likely very different from designing angle ab tests"), A15 (multi-axis niche study), A37 (one full session on VOC inputs). These set what pass-1 must capture for market selection specifically.
4. **`architecture/PART2--build-order-roadmap.md` → Job 3** — this step's build job (VOC supplies the new currencies).

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- Every load-bearing signal carries a `grounding_ref` and a `carried_risks[]` list to the operator. **The verbatim-grounding hard gate** (handoff §4: agent returns `author_id`+offsets, never quote text; script string-verifies) is the soundness spine here — no LLM-authored customer language.

## Adversarial findings this build must honor (`reference/reviews/`)
- **AUDIT-market GAP-A8 / R2 GAP-2 (the priority).** Pass-1 must add the three lanes PART3 admits are unspecced: **(i)** an invalidation / *unsatisfied-customer* lane (disconfirming signal, not just a counter-signal flag); **(ii)** a *"customers who already have the transformation"* population; **(iii)** the **could-OUR-product-satisfy delta** (demand current solutions don't satisfy but our product structurally could — different from demand-minus-competitor-spend). The handoff's counter-signal flag (§4) is a start; these go further.
- The avatar-quality criteria the law demands (identify with the problem / bought before / unsatisfied / no brand loyalty / VOC-accessible) are **pass-1 inputs to the market pick** — see AUDIT-market GAP-A8.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **R2 GAP-2** lanes (above) — ○ **Job 3**, the highest-priority unflagged hole.
- The **whitespace-vs-scary** policy (a gap with VOC demand but no competitor spend — is it opportunity or warning?) is a **marketing-truth call Kam reserved** (PART1 D1, A6) — surface it, don't decide it.
- Division of labor (handoff §6): Kam owns strategy (codebook content, intensity definition, search lanes); the build owns plumbing — surface only genuine strategy forks.

## Done =
A reusable, templated pass-1 spec (placeholders for niche/transformation/venues) that emits `voc-market-signal` (3 sections) + `gap_candidates[]` per candidate cell, with the three R2-GAP-2 lanes **wired as I/O (their contracts are ○ Job 3 — wire so they drop in; do not invent them)**, every signal verbatim-grounded and `carried_risks[]`-tagged, feeding Market Selection Gate 1 — built **from** the handoff canon, not regenerating it.
