---
status: authoritative
role: Exact current-state snapshot of the pmf3 marketing-pipeline project — what exists, what's decided, what's open, and what's next. Orientation doc; start here to know where things stand.
read-with:
  - INDEX.md
  - architecture/PART0--pipeline-flow.md
  - SHELL-BUILD-SPEC.md
  - OPEN-DECISIONS.md
supersedes: []
---

> **What this is:** a point-in-time status snapshot. **Read by:** the operator and any fresh implementer, first, to know exactly where the project stands before touching anything. **Snapshot date:** 2026-06-26.

# STATE OF PROJECT — pmf3 marketing pipeline

## 1. What the project is

A multi-step agentic marketing pipeline that turns a product *bet* into a written, audited funnel: **0 Bet → 1 Collect → 2 Funnel analysis → 3 Space map → 4 VOC market pass → 5 Market selection → 6 VOC deep pass → 7 Funnel architect → 8 Copywriter → 9 Asset classify → 10 Adversarial re-review** (canonical R1 order; see `PART0`). What lives in `build-base/` today is the **design base** for that pipeline — the architecture, the marketing-soundness standard, the audits, the one built step-skill, and the as-ran MVP it is being rebuilt from. It is not yet a runnable system.

**Phase B (production & launch) — newly drafted.** The numbered pipeline (0–10) is only the Research→Strategy→Copy half. A production & launch half — the Asset-Describe hub, a Visual-Branding pipeline, the Funnel-Architect-as-hub, a Video Strategist/Builder, and HTML + Shopify implementers — is now documented in draft at `architecture/PART5--production-and-launch.md`. Its inter-pipeline **seams are settled** (operator-confirmed); its internal step decompositions + the offer layer stay open. It is a **deferred extension** — the shell build targets Steps 0–10, and Phase B appends later append-only.

## 2. The two layers (the frame everything below uses)

The project has two separable layers:

- **The shell (mechanism):** the orchestrator/run-controller, the artifact store, per-step I/O contracts, routing, validation, operator gates. This is deterministic plumbing. The architecture specifies it (`PART3 §8`) and it is **one-shottable now** — see `SHELL-BUILD-SPEC.md`.
- **The content (marketing judgment):** the actual prompt body inside each step, and the field-level schemas at each seam. This is where marketing quality lives, and it is deliberately deferred.

Almost everything "not done" below is *content*, not *shell*. That separation is the whole strategy.

## 3. What exists today

**Design / spec layer — substantially complete (`authoritative`):**
`PART0` (end-to-end flow), `PART1` (110 KB dependency-ordered annotation vault), `PART2` (Jobs 0–9 build-order roadmap), `PART3` (the primary build-from architecture, incl. §8 orchestration design and §9 the seam list), `PART3-READER` (human map); the standards triad (`SPEC-marketing-soundness`, `marketing-rule-register`, `BUILDER-DIRECTIVE`); the eleven per-step briefs (`briefs/STEP-00…10`); and, new this session, the two interactive agent maps.

**Executable layer — barely started:**
**One** of the ~11 steps is actually built: `skills/bet-compiler/SKILL.md` (Step 0). It is the *yardstick* — it shows the bar a "done" step hits (explicit OUTPUT CONTRACT + machine-checkable COMPLETENESS + a HOW-IT'S-CONSUMED map). **Every other step is designed but not built.** There is **no assembled orchestrator / run-controller and no `pipeline.yaml` ordering yet** — but a substantial **glue raw-material layer exists** at `build-base/engine/`: fetch/process `bricks/`, `hooks/` (validators + DR-injectors), `integrations/` (Shopify/Cloudflare/Klaviyo/CDP), and `contracts/schemas/`. It is unordered and imperfect (some bricks are as-ran/pre-R1) — the shell gets **assembled** from it per the blueprint, not written from scratch.

**Reference layer (`reference`, read-not-built-from):**
the as-ran "Arduview" run (the MVP being rebuilt — `reference/as-ran-repo/`), the four AUDITs, `PART4` (the review-propagation synthesis), and the handoffs. Per the precedence rule (§5), these inform but never override the architecture.

## 4. Wiring readiness: ~70%

A 16-agent assessment (this session) built the full producer→consumer graph and stress-tested it. Headline: **artifact-grain routing is already deterministic** (every step's file inputs/outputs and the order are defined in `PART0` + `PART3 §5.2`), so an implementer knows which file feeds which step. The gap is one level down — **field-grain continuity** at the seams the R1 redesign created. Per-step wiring readiness:

| Step | Wiring | Note |
|---|---|---|
| 0 Bet Compiler | ready | the built yardstick |
| 1 Collect | minor-gaps | spine locked; two new R1 fields unschema'd (intra-step) |
| 2 Funnel analysis | minor-gaps | record schema recoverable from as-ran; angle producer was the hole (now decided, §5) |
| 3 Space map | minor-gaps | output schema is an authorized open slot; inherits the seam-congruence risk |
| 4 VOC market pass | minor-gaps | load-bearing outputs contracted; §3 niche-identity is an orphan output |
| 5 Market selection | ready | full as-ran skill + assessor with exact field paths |
| 6 VOC deep pass | minor-gaps | consumers named; per-view schemas prose-only |
| 7 Funnel architect | minor-gaps | inputs now explicit (§5); brief field-schema prose-only |
| 8 Copywriter + Chief | minor-gaps | loop topology fully specified |
| 9 Asset classify | **was blocked → resolved** | CLAIM-LIST producer decided this session (§5) |
| 10 Re-review | minor-gaps | terminal; under-spec never breaks 0–9 |
| Cross-cutting | **blocked** | no seam field-map / congruence checker (the dominant open item) |

Full detail in the assessment artifact (`build-base-wiring-readiness.md`, delivered this session).

## 5. Decisions locked THIS session

These are settled and recorded on the agent map; they should be reflected in the architecture docs on the next edit pass.

1. **Step 0 produces `CLAIM-LIST.json`.** The product's own capability-claim ledger (with a best-guess `load_bearing` flag) is emitted by the Bet Compiler, resolving the Step-9 dangling input. Kept distinct from the bet-brief's *competitor* claim-type enum. `load_bearing` flags may be refined by the architect once the angle is locked.
2. **The Funnel Architect explicitly consumes the bet-brief AND the product spec/intake `.md`** from Step 0 — confirmed required inputs, not optional.
3. **Source-of-truth precedence:** `standards/` (decision quality) → **build-base architecture (scope, I/O, routing)** → the built bet-compiler SKILL (the "done" bar) → **as-ran repo + old prompts = reference only.** When the as-ran and the architecture disagree about what a step should produce/consume, **the architecture wins.** As-ran is evidence (vocabulary, feasibility proof, failure record), not contract.
4. **Angle / claim / transformation classification is two-tier:** the Section Analyzer (Step 2) emits a *raw* per-funnel angle/claim/transformation grounded in that funnel's belief chain + execution; the Space Classifier (Step 3), which sees all funnels, *canonicalizes* across them. The product CLAIM-LIST (Step 9 input) is a separate artifact, produced at Step 0 — not the same as competitor-funnel claims.
5. **Build strategy = shell-first.** Wire the runnable shell at the artifact grain; drop prompts and field-level schemas in later. See `SHELL-BUILD-SPEC.md`.

## 6. The confirmed wiring blockers and their status

⚠ **Naming note:** the assessment's blocker labels (here prefixed **WB**) are *not* the same as the `OPEN-DECISIONS.md` labels (A1/B1/C1). Kept separate on purpose.

- **WB1 — no central seam field-map + no field-continuity checker.** STATUS: **OPEN — dominant.** This is the same need as `OPEN-DECISIONS A2` (`contract-congruence`) and PART2 **Job 5** (the contract spine). Until a producer→consumer field map exists and a checker enforces it, two independently-built steps can wire incongruent fields at a seam — the exact silent failure the as-ran run suffered. **Closing this is the single highest-leverage next move.**
- **WB2 — `CLAIM-LIST.json` had no producer.** STATUS: **RESOLVED BY DECISION** (Step 0 produces it, §5.1) — needs implementing when Step 0/Step 9 are built.
- **WB3 — funnel-level `angle` had no producer at the right grain.** STATUS: **RESOLVED BY DECISION** (two-tier, §5.4) — needs implementing when Steps 2/3 are built.

## 7. What's open (decisions not yet made)

From `OPEN-DECISIONS.md` (no rulings made there):

- **Three build-time skills, A1–A3** — `decision-spec`, `contract-congruence`, `grounding-and-refuse`: `PART4 §7` recommends building these *before* Jobs 2/3/4 so those sessions run through them. **Needs a sequencing ruling.** (`contract-congruence` = the WB1 checker.)
- **Operator rulings:** **L1** transformation-validation carry-field (likely already closed via `MR-006` — confirm only); **L3** make "VOC present" a hard precondition for copy + sequence Job 8 behind Job 3; **L6** offer/deposit/asset scope — exempt-by-design or in-scope to ground (~half the funnel's provenance hinges on this).
- **C1** — `PART3 §7.3` has no pricing/anchor registry slot (the $299-anchor-traces-to-a-datum test has nowhere to live).

From `PART0` / `PART3 §1.6` — six bird's-eye job-logic gaps **GAP-1…6** (standalone niche/transformation quantification; VOC pass-1's invalidation + already-have-transformation + product-satisfaction delta; pass-2 per-PMBDE frequency; architect adjacent-market funnels; frequency×phrase language bank; the missing end-to-end narrative, now fixed by PART0).

**Marketing content reserved to Jobs 2–4** (`PART3 §10`): the determination tests, the validation-currency model, every numeric threshold, whitespace-vs-scary, the idea-unit ontology, the claim-typing taxonomy. None of this blocks the shell; all of it is the "mediocre-marketing-acceptable" trade.

## 8. Build order (where we are on PART2's Jobs 0–9)

`PART2` derives the work-order: **Job 0** settled edits + diagnostics → **Job 1** bet definition → **Jobs 2+3** determination-mechanics + VOC integration (co-design dyad) → **Job 4** currency model → **Job 5** the contract spine (seams) → **Job 6** agent topology + orchestration → **Job 7** stage revisions against locked seams → **Job 8** copywriter/chief → **Job 9** e2e reconciliation + re-review.

**Where we are:** Job 0's findings were surfaced inside `PART3 §1.1`. Step 0 (bet-compiler) is built. Nothing past it is built. Job 5 (the seams) and Job 6 (the orchestration/prompt-split) are the structurally pivotal unbuilt jobs — and the shell-first plan front-loads Job 6's orchestration mechanism while leaving Job 5's field content as drop-in slots.

## 9. Artifacts produced this session

- `pipeline-agent-map.html` — detailed white-theme flow graph (every agent, full I/O, editable notes, decisions baked in).
- `pipeline-agent-map-compact.html` — names-only serpentine navigator (fits a screen; hover-trace + click-isolate).
- `build-base-wiring-readiness.md` — the ~70% assessment + confirmed-blocker punch-list.
- `STATE-OF-PROJECT.md` (this doc) and `SHELL-BUILD-SPEC.md`.

## 10. Recommended immediate next steps

1. **One-shot the shell** per `SHELL-BUILD-SPEC.md` — runnable end-to-end with stub prompts (proves the wiring independent of marketing quality).
2. **Write the seam field-map** (closes WB1 / `OPEN-DECISIONS A2` / Job 5), derived consumer-first from the architecture, with the precedence rule as line one.
3. **Rule on the three build-time skills' sequencing** (A1–A3) and the quick operator rulings (L1 confirm, L3, L6).
4. **Then build step prompts** in `PART2` order, dropping each into its shell slot and validating against the (now-pinned) seam contract.

*Maintenance: when any decision in §5 is reflected back into the architecture docs, or any open item in §7 is ruled, update this snapshot and re-date it.*
