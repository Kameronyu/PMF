---
status: brief
role: Per-step build brief for STEP 9 — Asset classify. Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 9
covers: Asset classify — the kept asset-classification chain (claim-list + closed vocab, script-assembled inputs, bytes never in context). One delta only: validators become orchestrator-run with receipts.
---

> **What this is:** the reading list + duties for the session that rebuilds the **Asset Classify** step. Open this, follow the pointers, build — nothing is copied, every line points into the base. **Start with §"What was already run" — the as-ran asset-classify skill is the highest-leverage input.** This step is **KEPT, nearly unchanged**: no annotations cut against it; it already embodies the design principles (P2/P4). The only delta is enforcement (validators orchestrator-run, P8). There is **no dedicated AUDIT** and **no open PART1 decision** for this step — keep the brief thin.

## In one line
Classifies the operator's assets against a **closed claim-list + closed vocabulary**, with inputs **script-assembled** and bytes **never in context** (P2/P4 already embodied). The single delta vs as-ran: validators become **orchestrator-run blocking steps with receipts** (P8), matching the rest of the pipeline. The asset CLAIM-LIST is the candidate source-of-truth for physical-capability claims (see Reviewer B B5 cross-ref).

## ★ Start here — what was already run (highest leverage)
Read the **as-ran asset-classify skill you are rebuilding** before anything else. It is the closest-to-correct stage in the as-ran system.
- **The as-ran skill (rebuild target):** `pmf3/SKILL-asset-classify.md` — the MVP asset-classify skill (parent folder; catalogued in `reference/EXTERNAL-INPUTS-MAP.md` §A). **Read this first** — it already does the right thing (closed vocab, script-assembled inputs, bytes-out-of-context); the rebuild's job is the validator-enforcement delta, not a redesign.
- **What it produced + the load-bearing claims:** `reference/as-ran-repo/asran-repo-report.md` (§5 carries the asset CLAIM-LIST, e.g. `see_through_display_on` as a load-bearing claim grounded in pixels) is the reader's guide.
- (Do **not** re-prosecute as-ran wiring — this stage had no headline failures; the only change is P8 enforcement.)

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md`** — the asset step sits after copywriting and before the adversarial re-review (PART0 STEP 8b feeds "asset classification + the adversarial re-review"). It has no standalone STEP block — its job logic is the as-ran chain, kept.
2. **`architecture/PART3--architecture-design.md`:**
   - **§6.10** — the Asset chain + pipeline-audit card (KEPT). *The spine of the rebuild.* "No annotations cut against them; asset-classify already embodies P2/P4 (bytes never in context, script-assembled inputs, closed vocab). One delta: validators become orchestrator-run steps with receipts (P8)."
   - **§6.0** — soundness duties row: Asset agents ground claim-list + vocab (existing); minimal carry.
   - **§7.2** — knowledge scope: Asset agents get "claim-list + vocab (existing)"; **everything else deliberately excluded.**
   - **§8** — orchestration (the P8 enforcement model: preflight → plan print → context assembly → spawn → **validate (blocking, orchestrator-run)** → store + receipt). This is where the one delta lives.
3. **`architecture/PART1--dependency-ordered-map.md`** — no decision is filed against this step (the INDEX R1 table shows "—" for Asset classify). The only relevant principle is **P8** (no hook-dependent enforcement) from PART3 §3 / PART1 A39 (orchestration distrust). No annotation-by-ID work needed.
4. **`architecture/PART2--build-order-roadmap.md`** — asset-classify is in the "Kept" set (§4.2 delta list); it rides the spine session (Job 5) for the validator-receipt contract. This build wires the closed vocab + the orchestrator-run validators.

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- Asset classification grounds against its closed claim-list + vocab; every load-bearing call carries `carried_risks[]`, and checks report `PASS | FAIL | CANNOT-EVALUATE`. **MR-005** (a debut claims only what it can back) bears on which capability claims the asset CLAIM-LIST may license.

## Adversarial findings this build must honor (`reference/reviews/`)
There is **no dedicated AUDIT** for asset classify. The single cross-cutting finding that touches it:
- **`AUDIT-reviewerB.md` B5** — no "claim vs product-fact" check exists in the funnel-copy chain for physical-capability captions; but the asset-classify CLAIM-LIST **already grounds** `see_through_display_on` (asran §5). Decision option carried here: **the asset CLAIM-LIST can be declared the single source of truth for capability claims**, so a copy caption asserting a physical capability must map to it. Low severity — flag, don't redesign.
- **KEEP (do not regress):** the closed-vocab / script-assembled / bytes-out-of-context discipline (P2/P4) the as-ran stage already exhibited.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **A1/A2/A3** — the build-time meta-skills (`decision-spec`, `contract-congruence`, `grounding-and-refuse`) apply to every agent authored; the asset agents' closed enums are an easy `decision-spec` pass. Build through them if they exist.
- No step-specific open ruling. (Asset classify carries none of the L1–L10 items.)
- **Dependency that is NOT this build's call:** the validator-receipt contract format → the **spine session (Job 5)**. Wire to it; do not invent a parallel format.

## Done =
The asset chain classifies against its **closed claim-list + closed vocabulary** with **script-assembled, bytes-out-of-context** inputs (P2/P4 preserved), its **validators run as orchestrator-run blocking steps with receipts** (the one P8 delta), and the CLAIM-LIST is positioned as the candidate source-of-truth for capability claims (Reviewer B B5) — with the validator-receipt format deferred to the spine session and nothing else reopened.
