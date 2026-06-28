---
status: reference
role: Per-session context packet for the Bet & Pre-Research session; also the HANDOFF-N template for future per-session packets.
read-with:
  - architecture/PART0--pipeline-flow.md
  - skills/bet-compiler/SKILL.md
  - reference/handoffs/HANDOFF-annotation-depth-sort.md
supersedes: []
---

> **What this is:** the bet-session packet + the HANDOFF-N template. **Read by:** whoever runs the bet session.

# HANDOFF 1 — Bet & Pre-Research Definition Session

> **What this is:** the packet the next build session reads to start. It defines pipeline Step 0 (the bet + pre-research). It is run **WITH the operator** — the bet is a marketing call; the session structures, interrogates, and contracts it. It is design, not implementation.

---

# ⓿ FILES TO LOAD FIRST

**Standing rule: more context over less, nothing lossy.** Load Tier 1–2 before doing anything. Tier 3 is repo ground truth — **assume repo access and load by path.** Tier 4 connects next session. Tier 5 on-demand. Guardrails below keep "more" from becoming "drowned."

### Tier 1 — Design spine (mandatory, read whole)
These are **session markdown docs** (not in the repo — the operator hands them over; see the list at the very bottom):
- **`PART0--pipeline-flow.md`** — **read this FIRST.** The bird's-eye end-to-end flow (each step: ingests → decides → emits → feeds next). Orients where your bet step sits and what consumes its output. STEP 0 is yours; note **GAP-2**, which depends on a field you produce (see the dependency callout in "What this session emits" below).
- **`PART3--architecture-design.md`** — the full architecture doc, **read entirely.** This is the system you're building Step 0 *of*. Key: §1.5 (R1 reorder), §1.6 (R2 — the six bird's-eye gaps), §6.1 (Bet Compiler card), §7.2 (bet knowledge scope), §9/§10 (seams + open items).
- **`PART1--dependency-ordered-map.md`** — operator annotations, **verbatim.** Mandatory: §5 (D4) in full; skim §1 for how the bet gates everything. Work from the quotes. IDs: **A38, A39 (bet part), A20, A23, A30, P1 (calibration sentence), P6, P8, P9, P10, P19** + A22/§10 diagnostics.
- **`PART2--build-order-roadmap.md`** — read **Job 1** (this session) and **Job 0** (feeds it).
- **`HANDOFF-1--bet-and-pre-research.md`** — this doc.
- **`HANDOFF-annotation-depth-sort.md`** — the constitution: custody/freedom rules (marketing-truth = operator/KB; system-design = yours; annotations verbatim; flag for veto).

### Tier 2 — Annotation custody (loss-prevention)
- **PART 1 is the verbatim vault** — all 65 annotations byte-identical, with a registry index. D4 is the bet slice.
- **Flag:** the raw originals (`annotations--arduview-pipeline.md`, `PMF annotated prompts and reviews.md`) are NOT in the repo or any session. PART 1 is a faithful copy and suffices; if the operator still has the raw files, supply them as backup.

### Tier 3 — As-ran repo ground truth (bundled — no repo access needed)

**These files are bundled in the base at `reference/as-ran-repo/repo-files/` (paths preserved, e.g. `reference/as-ran-repo/repo-files/runs/arduview/pre-research-plan.md`).** Original source: branch `eink-phase0-run` of `Kameronyu/PMF`. **Use `asran-repo-report.md` as your index — it already distilled the whole repo. For each file below, read the report section first; open the raw file only for the specific reason noted. Do not go looking for anything outside the bundle.**

**READ THESE (exact paths, in order):**
1. **`runs/arduview/pre-research-plan.md` + `runs/arduview/arduview-pre-research-plan.md`** — the **only as-ran bet artifact**: the prose bet brief that ran. This is THE prior you formalize into a contract. Read both in full. (Report §1 Step 0 + §5 summarize their shape.)
2. **`prompts/step1-light-pass.md`** — the consolidated **as-built** executor. The real Finder is **AGENT 1 inside this file** + the brief is consumed as "layer A"; this holds the `bet_type` / `comparable_bet_seed` schema + closed enums. ⚠️ NOT `marketing-lens/prompts/01-finder.md` — that's an older numbered stub MAP.md points at but the build doesn't use. Read the report's **§2a card first**; open the raw file only for exact JSON schema / enum wording.
3. **`definitions.md`** (repo root) — niche, transformation, product category, sub-niche, UM, NTPMA terms; you amend these. Read the report's **§8 index first**; open the raw file only for the exact term you're amending.
4. **`prompts/_specs/market-selection-assessor-spec.md`** — read **only** the part on how NTP/bet evidence feeds selection (so your emit contract fits its consumer). Report §2b summarizes it.

**SKIM FOR VALUES ONLY (don't read whole — the report already quotes the key fields):**
5. **`runs/arduview/space-map.json`** — just `per_brand[].bet_type`, `bet_type_basis`, `_comparable_bet_seed_note` (what the as-ran bet logic produced). ⚠️ Two different files exist: root `space-map.json` (6 combos, full) vs `runs/arduview/space-map.json` (1 chosen cell). See report §5.
6. **`brands.json`** — just `comparable_bet_seed` + `starting_point{product, transformation, niche}`.
7. **`runs/arduview/_marketing-decisions/INDEX.md` + `light-pass.md`** — pull only the bet-relevant open operator decisions.

**DO NOT READ unless a specific decision forces it** (the report covers these at summary level — §3 orchestration, §4 tools, §9 discrepancies): the rest of `prompts/`, all `.claude/skills/*` (funnel, copywriter, asset — downstream of you), `tools/` + `tools/hooks/`, the 20 corpus dumps, the deep-pass/funnel/copywriter specs, `run-retrospective.md` + the run debug docs, `CLAUDE.md`/`workflow.md`/`MAP.md` (doctrine — report §1/§3 already extract what matters), and any `_dr-context.generated*.md` bundle.

- **`asran-repo-report.md`** (session distillation, handed over) is your map to all of the above: §1 (pipeline shape + Step 0), §2a (Finder/light-pass card), §2b (market selection), §5 (artifacts + exact field names), §8 (definitions index), §9 (doc-vs-artifact discrepancies).

### Tier 4 — DR knowledge base (connects next session; scope to the bet)
Ground marketing-truth calls here and cite the law (PART 3 §7.2): `market-evaluation-criteria.md`, `differentiator-framework__2_.md`, `angle.md`, `case-studies--spencer-origins.md`, `offer-construction--carl-weische.md`, `product-research--spencer-origins.md`, `consumer-psychology--spencer-origins.md`, `ecommerce--mark-builds-brands.md`. Titles aren't reliable scope guides (PART 3 §2) — if a bet question needs law not listed, pull by decision, not filename.

### Tier 5 — Reference / on-demand
`PART3-READER--human-map.md` (plain-language orientation), `HANDOFF-PROCESS--open-questions.md` (how the build phase runs), rest of repo + KB.

### Guardrails
- **Do NOT read `_dr-context.generated*.md` bundles whole** — huge, mixed; skim for specifics only.
- **Do NOT ingest the whole KB or whole repo up front** — scope by the decision in front of you.
- Large Hormozi KB files are mostly off-target for the bet — named sections only.

### Gap flags (don't hunt for these)
- **The bet skill now exists: `skills/bet-compiler/SKILL.md`** is the realized STEP 0 Bet Compiler (frontmatter `name: bet-compiler`), emitting a structured `bet-brief.md`. (The as-ran report §9 + §2a predate it; the prose `pre-research-plan.md` was the original prior.) This session **ratifies/extends** that existing skill's contract — it is **not** creating one from scratch.
- **Raw annotation originals** not reachable from repo/KB (Tier 2).

### Custody rule (applies to every decision below)
Every agenda decision traces to an annotation ID. Calls the annotations don't cover → flag ◆ for operator veto. Marketing-truth questions → ground in the KB (Tier 4), cite the law, don't overrule the operator from priors. Preserve any operator annotation quoted, verbatim.

---

## Where this sits in the build sequence

Each session settles a contract the later ones consume; the last reads everything and checks the seams.

1. **Bet & pre-research (this handoff)** — defines the bet + bet-brief contract. ← NEXT
2. **Determination tests + definitions** — the mechanical test per classified property.
3. **VOC integration** — the two VOC products + contracts (VOC collection MVP buildable in parallel).
4. **Validation-currency model** — every currency priced; consumes the bet decision + R1's funnel-scoped spend quantification.
5. **Contract spine** — every seam I/O, written once the decisions above exist.
6. **Stage prompt builds** — each pipeline step rebuilt against locked contracts, in data-flow order.
7. **Copywriter + copy chief build.**
8. **Reconciliation + modded adversarial re-review** — reads the whole thing, verifies the seams hold.

Each future session gets its own HANDOFF-N like this one. **This doc IS the HANDOFF-N template** — copy its structure (tiered reading-list → settled/open agenda → emits-contract → seams → stop line) for Jobs 2–9.

---

## The one thing this session resolves

**What a bet is, what the pre-research hypothesis outputs, where the pre-research skill sits, and the bet-evidence transfer controls** — rendered as a structured `bet-brief` contract the whole pipeline inherits. (This is PART 1's decision **D4**, the upstream-most system-shape decision.)

---

## Already settled — honor, do not re-open (●)

- **The bet leads with a differentiator × niche × an OPEN transformation slot** (as-ran brief structure; the open slot is deliberate).
- **N, T, and P similarity are evaluated SEPARATELY, each with its own criteria** (P8). Product-similarity includes price, product type, etc.
- **Pre-research is about designing what NTP to dry-test and how — not sourcing/fulfillment** (P6, P3).
- **Bets must be calibrated to control for niche and transformation** — a bet proven for one niche does not transfer to another unproven (P1).
- **Transformation is derivable from competition when inputs + analysis are mechanical** (settled at D2; the bet's transformation slot does not require VOC-only evidence — confirmed against the KB in PART 3 §2).

---

## The open decisions this session must make (the agenda)

Each is a real decision; its annotation IDs are the operator's own framing.

1. **Define "a bet."** What it is, precisely, and what the pre-research hypothesis actually outputs. (A38, A39-bet)
2. **Place the pre-research skill.** Where in the pipeline it sits and what it consumes/emits — it currently has no home. (A38; A39-bet)
3. **Bet-fit verification.** How you verify another company "fits the bet you're making" — the test that decides a competitor is evidence *for your bet* vs noise. (A20, A23)
4. **NTP-similarity controls, three separate criteria sets.** Niche-, transformation-, product-similarity each get their own definition and test. Includes defining "niche category" / "product category" — the operator never pinned these. (P8, A30)
5. **Functional-mechanism equivalence — the richest piece.** The unit of bet-evidence transfer is not the physical feature but the *mechanism of action*: does a physically-different feature do the *same believable job* for the *same transformation* to the *same niche*? (Fidget-spinner-vs-transparent-screen reasoning.) The operator flags this as "really its own thing." Make it a stated, testable comparison. (P19)
6. **Structural-deliverability basis.** The pre-research must reason about how the product structurally *can or cannot* deliver certain transformations. (P10)
7. **Query generation from the brief.** How the Finder's queries derive from the brief's territories + comparable-bet seeds — and whether the as-ran data-insufficiency was query-quality or pure wiring (PART 3 §1.1 showed the run's failures were wiring; confirm query-gen is sound or fix it). (A22, P9, A39)
8. **Clarify the open-transformation slot.** A39 flags "needs an open transformation, idk what that means" — define what the slot is and how it's filled (e.g., a proven transformation carried to a new niche).

Granularity note (○, decide here or defer): whether the Bet Compiler is one operator-assisted agent or splits (e.g., query-designer separate from bet-structurer). PART 3 leans: one session; revisit if heavy.

---

## What this session emits — the `bet-brief` contract

A structured brief, **tagged fields with prose inside** (the operator's confirmed format: `product_overview:` then prose, `bet_type:` then a tag). Some fields are enums/numbers; most are prose-in-a-tag. The tags let every downstream agent grab "the bet" or "the transformation" without parsing a paragraph.

Proposed field set (session **ratifies/extends** it — ○ on exact fields). **The spine is `skills/bet-compiler/SKILL.md`'s emitted contract** (`what_the_product_enables` table, `ntp_anchors`, `comparable_bet_seeds[].why_it_fits`); reconcile the set below toward that file where they differ — it is the later, governing version:

```
bet_id
bet_statement:            prose — the bet in a sentence or two
bet_type:                 tag/enum + basis (page/evidence-quoted)
differentiator:           prose — the lever the bet leads on
niche:                    prose + niche_category tag
transformation_slot:      prose — open; how it gets filled
product_overview:         prose
product_features:         [list]
what_hardware_enables:    prose — structural-deliverability basis (P10)
ntp_controls:             { niche_criteria, transformation_criteria, product_criteria }   (P8)
functional_mechanism:     prose — the equivalence test for bet-evidence transfer (P19)
comparable_bet_seeds:     [ {brand, why_it_fits (bet-fit verification, A20/A23)} ]
territories:              [search territories → Finder queries]
lp_hunt_terms:            [list]
claim_typing_examples:    [list]
deferred_reads / overrides
```

A machine-checkable completeness block on top of the prose (so the next session can verify the brief is whole before building on it).

---

## Who consumes what this emits (the seams)

- **Finder** (Step 1) — generates queries from `territories` + `comparable_bet_seeds`.
- **Slop / Coverage Checkers** — judge brands against the bet's keep-bar and seed list.
- **Funnel Analysis + Space Map** (R1, Steps 2–3) — bet context frames the cells.
- **Market Selection** (Step 5) — reads the bet brief alongside the space map (it needs to know what it's selecting *for*).
- **Determination-tests session (Handoff 2)** — NTP-control + functional-mechanism definitions become inputs to the transformation/mechanism tests.
- **Validation-currency session (Handoff 4)** — bet-evidence transfer becomes a priced currency lane.

---

## Stop line

This session ends at: the bet definition, the `bet-brief` contract shape, the pre-research skill's placement, and the NTP/functional-mechanism transfer controls — as a spec the implementation pass renders into a prompt. It does not write the final prompt text and does not run the live bet unless the operator chooses to at the end as a first real exercise of the contract.
