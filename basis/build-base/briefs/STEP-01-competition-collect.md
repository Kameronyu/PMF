---
status: brief
role: Per-step build brief for STEP 1 — Competition search / Collect (Finder, Slop Checker, Coverage Checker, Dumper). Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 1
covers: Collect — find competitor brands, verify the roster (slop out / gaps in) before fetch spend, fetch + extract verbatim copy. NO classification of the space here.
---

> **What this is:** the reading list + duties for the session that rebuilds the **Collect** step (Finder + Slop Checker + Coverage Checker + Dumper). Open this, follow the pointers, build — nothing is copied, every line points into the base. **Start with §"What was already run" — the as-ran light-pass skill + its run output are the highest-leverage inputs.** Collect is **cheap prep with no judgment about the space**: find, verify, fetch, extract only. The ★ operator gate sits between verification and fetch spend.

## In one line
Finds competitor brands across search lanes from the bet-brief's territories + comparable-bet seeds, **verifies the roster before any fetch spend** (Slop Checker = per-brand keep-bar; Coverage Checker = search-space audit), then fetches + extracts each brand's copy **verbatim**. Emits `brands.json` (deduped roster) + `queries_run[]` (auditable query trail) + per-brand verbatim dumps. **No space classification here** — that is STEP 3.

## ★ Start here — what was already run (highest leverage)
Read the **as-ran light-pass skill you are rebuilding** and the artifacts it produced, before anything else. The whole point is to improve on a thing that already ran.
- **The as-ran skill (rebuild target):** `pmf3/step1-light-pass.md` — the as-ran "step 1 light pass" (parent folder; catalogued in `reference/EXTERNAL-INPUTS-MAP.md` §A; operator: "should be a built step too"). **Read this first.** Under R1 the light pass is **dissolved** — Finder/Slop/Coverage/Dumper survive as this "Collect" step; everything classificatory moves to STEP 3.
- **The executor prompt:** `reference/as-ran-repo/repo-files/prompts/step1-light-pass.md` — the in-repo executor that actually ran.
- **What it produced on the real run:** `reference/as-ran-repo/repo-files/brands.json` (the deduped roster output) + `…/repo-files/runs/arduview/space-map.json` (downstream consumer, for field reference only).
- **Reader's-guide:** `reference/as-ran-repo/asran-repo-report.md` (index into the as-ran repo + field names; the orchestration/packaging facts).
- (Do **not** re-prosecute the as-ran wiring bugs — null `demand_trend`, `qualifying_creatives=0`; fixed upstream in R1.)

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md` → STEP 1** — the job logic (ingests bet-brief territories + seeds; finds → verifies roster → fetches → extracts; emits `brands.json` + verbatim dumps + `queries_run[]`; feeds Funnel Analysis).
2. **`architecture/PART3--architecture-design.md`:**
   - **§6.2** — the Finder card (two contract changes: emits `queries_run[]`; query generation derived from territories + seeds, every query naming its source field; 12+ queries/lane floor). Refuse: bet-brief contract block missing/invalid.
   - **§6.3** — the Slop Checker + Coverage Checker split (● A39). Slop = per-brand keep-bar (`slop_flags[]`). Coverage = audit the **search space** not the roster, via four named evidence streams (territory×lane query coverage; seed resolution; VOC-named brand presence; marketplace bestseller intersection) → `missing_brands[]` + `coverage_gaps[]`. *The spine of the rebuild.*
   - **§6.4 (Dumper half only)** — verbatim discipline kept (P7 anchor); refuse on missing clean corpus. (Ignore the Space Classifier half — that is STEP 3.)
   - **§1.5 (R1)** — the corrected front-half map: STEP 1 = "find, verify, fetch, extract. NO classification here."
   - **§6.0** — soundness duties row for Slop/Coverage (search is **not** a load-bearing marketing judgment; carry blank/unknown coverage inputs only).
   - **§7.2** — knowledge scope: Finder/Slop/Coverage get "none beyond brief + enums"; Dumper gets the verbatim gate only. **All theory deliberately excluded.**
3. **`architecture/PART1--dependency-ordered-map.md`** — the operator annotations:
   - **A39** (D7 filing) — the slop-checker/brand-missing **split** ("the slop checker and the reviewer to see if there are brands missing should be separate agents… but i dont know how to design the checker whether or not brands are missing"); clean-data-for-classifiers; "Does agent #3 see the output… or read raw data."
   - **A22 / P9** (D4, §10 diag) — data sufficiency = wiring vs query-generation, "all the way back to when we generate queries."
   - **P1** (D3/D4) — niche-control on bets feeds query targeting.
4. **`architecture/PART2--build-order-roadmap.md` → Job 1 (bet-brief) precedes**; the Coverage Checker also consumes `voc-market-signal` §2 named competitors **when present** (D1/Job 3) — wire the I/O so VOC-named brands drop in later.

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- Search is not a marketing judgment, so grounding here is light — but every load-bearing call still carries `carried_risks[]` (blank/unknown coverage inputs), and counted values emit `{value, n, low_n}`. The verbatim **language-custody chain** (P7) starts at the Dumper and must travel unbroken downstream — no LLM-reworded copy ever.

## Adversarial findings this build must honor (`reference/reviews/`)
Read **`AUDIT-collection.md`** in full; the load-bearing ones for Collect specifically:
- **GAP-7 (data side) / §1.1** — the as-ran `qualifying_creatives=0` and thin-roster problem traces partly to coverage. The Coverage Checker's job is to convert "are brands missing?" from vibes into the **four named evidence streams** (§6.3) — A39's exact ask.
- **A39 coverage design** — Coverage Checker checks 1–2 are **pure script** (territory×lane query coverage; seed resolution); the agent judges only ambiguous cases (3–4). Do not let it become a vibe-based "did we miss anyone."
- **GAP-8 (over-claim guard "a sentence not a mechanism")** — the contract-or-refuse posture (P3) applies: Finder refuses on an invalid bet-brief contract block rather than improvising queries over a thin brief.
- **KEEP (do not regress):** the **both-checkers-run-before-fetch-spend** ordering and the ★ operator-applies-flags gate (P9). Slop Checker is unchanged in substance from the as-ran SLOP half.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **A2 — `contract-congruence`** (build-time skill): the Coverage Checker's "every VOC-named brand present in roster or in `dropped[]`" check is a producer/consumer congruence rule; build through this skill if it exists.
- **The §1.1 filename-contract / receipt discipline** (P8): all validators here are **orchestrator-run blocking steps with receipts** — no hook-dependent enforcement.
- **Dependencies that are NOT this build's call:** the VOC §2 named-competitor feed into Coverage → **Job 3**; the bet-brief contract → **Job 1**. Wire the I/O so these drop in; do not hard-code them.

## Done =
The step finds brands from named bet-brief fields, emits `queries_run[]` so coverage is auditable, **verifies the roster before fetch spend** (Slop = per-brand keep-bar; Coverage = the four named search-space evidence streams → `missing_brands[]` + `coverage_gaps[]`), fetches + extracts copy **verbatim** (custody chain intact), makes **no claim about the space**, refuses on an invalid bet-brief contract, and hands the verified roster to Funnel Analysis — with the VOC-named-brand feed left as a wired ○ slot pointing at Job 3.
