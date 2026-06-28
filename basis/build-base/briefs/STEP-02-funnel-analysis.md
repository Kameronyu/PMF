---
status: brief
role: Per-step build brief for STEP 2 — Funnel analysis (Assemble, Router, Section Analyzer + deterministic quantification). Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 2
covers: Funnel analysis — the expensive core. Package each brand's funnels (LP+PDP, link-path verified), read each one (belief chain, single-idea units, awareness, verbatim), then deterministically quantify ad volume / longevity / spend per transformation and per angle.
---

> **What this is:** the reading list + duties for the session that rebuilds **Funnel Analysis** (funnel-assemble → Router → Section Analyzer → deterministic quantification scripts). Open this, follow the pointers, build — nothing is copied, every line points into the base. **Start with §"What was already run" — the as-ran funnel deep-pass skill + its run are the highest-leverage inputs.** Under R1 this is the **expensive core, run on the FULL verified roster before the space map** — the signals that make the map real (which transformation each funnel runs, the angle, how much spend/longevity sits behind each) only exist after this step.

## In one line
Packages each brand's funnels (one funnel = ad → LP → PDP, link-path verified, same brand), routes each, then reads each funnel **one at a time** as **single distinct idea units** (belief install / identity callout / proof / urgency …) with verbatim spans + per-funnel awareness (`awareness_basis`). Deterministic scripts then **quantify** ad counts + longevity per funnel, **rolled up per transformation and per angle**, plus crowdfunding backing + awareness distribution. Emits per-funnel analyzed records + the **ad-volume aggregate**.

## ★ Start here — what was already run (highest leverage)
Read the **as-ran funnel deep-pass skill you are rebuilding** and the artifacts it produced, before anything else.
- **The as-ran skill (rebuild target):** `pmf3/SKILL-funnel-deep-pass.md` — the MVP funnel deep-pass skill (parent folder; catalogued in `reference/EXTERNAL-INPUTS-MAP.md` §A). **Read this first** — you are rebuilding it better, and moving it *earlier* (pre-map) on the full roster.
- **What it produced + the packaging/orchestration facts:** `reference/as-ran-repo/asran-repo-report.md` (§9 packaging answer, the `belief_kind`/null-store ghost-field cautionary tale, the per-brand validation-lane facts) is the reader's guide. Run artifacts under `reference/as-ran-repo/repo-files/runs/arduview/`.
- (Do **not** re-prosecute the as-ran wiring bugs — null 6a store fields, `qualifying_creatives=0`, unusable tally, analyzer blind to validation lane; all root-caused in PART3 §1.1 and closed in R1.)

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md` → STEP 2** — the job logic (ingests the full verified roster; packages → reads each funnel → scripts quantify; emits per-funnel records + the ad-volume aggregate `{transformation, angle, funnel_count, ad_count, max_ad_longevity_days, spend_signal?, crowdfunding_backing?}`; feeds the Space Map).
2. **`architecture/PART3--architecture-design.md`:**
   - **§6.7 (Funnel Deep Pass half: Packaging + Router + Section Analyzer)** — the current card. *The spine of the rebuild.* Packaging contract (A41): follow CTA links LP→PDP, verify same-brand, emit `path_verified` + `pdp_body`; the D-05 no-ads guard stays and any override becomes a logged `validation_override{by,reason}`. Section Analyzer: unit of analysis = the **single distinct idea** (A37); per-funnel validation lane/strength enters its **inputs** (P15 gap closed). Read the §6.7 ⚠ banner — only the "input set closed" framing is pre-R1.
   - **§1.5 (R1)** — the deep-analysis-first reorder + the **scale check** (per-funnel reads bounded by funnel count not ad count; ad-volume rollup is a script; the per-ad angle split is OPEN ○, not a committed agent) + the **ad-volume aggregate contract**.
   - **§6.0** — soundness duties row for the Section Analyzer (grounds idea-unit / awareness classification via `awareness_basis`; carries missing `awareness_basis` + unknown validation lane).
   - **§7.2** — Section Analyzer knowledge scope (idea-unit ontology ○ Job 2; belief-id anchors; proof tiers; disposition from copywriting--mark belief-install, consumer-psychology--carl awareness frames, funnel-architecture--carl section roles; **excludes** offer pricing + ad-production volume law).
   - **§7.3** — registry slots it feeds: `idea-unit/belief`, `awareness` (evidence + aggregation), `mechanism-vs-feature` (+ believability gate parameterized by niche). Content ○ Job 2; **slots** fixed.
3. **`architecture/PART1--dependency-ordered-map.md`** — the operator annotations:
   - **A37** (D3) — "classify each, distinct and single idea one by one… that is huge ammo for writing a funnel"; mechanism believability **varies by niche**.
   - **A41** (D7/§10 diag) — funnel packaging: 1 LP + 1 PDP, follow ad→LP→PDP, same-brand verification.
   - **A42** (D6/D7) — section-analyzer DR-allocation worry + the verbatim-extraction lossiness question ("Id like some advice on that"); "I don't know whether awareness level is analyzed here."
   - **P15** (D5/§10 diag) — did the analyzer see per-brand validation signal (it did not; now wired into inputs).
4. **`architecture/PART2--build-order-roadmap.md` → Job 4** supplies the **validation-currency model** (what the quantified ad-volume/spend/longevity currencies *mean*); Job 2 supplies the idea-unit ontology. This build wires the I/O + the deterministic rollup; Jobs 2/4 set semantics.

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- Every load-bearing verdict carries a `grounding_ref` (DR-law/test ID or Register rule-ID, else `UNGROUNDED`) + `carried_risks[]`. The Section Analyzer's `awareness_basis` is a **required evidence-field** (no value without evidence). The verbatim **language-custody chain** (P7) runs through the analyzer's idea-unit spans unbroken.
- **MR-003** (cross-cell brands = structure reference only, never in-cell evidence) is enforced here at store time via the validation lane the analyzer now sees.

## Adversarial findings this build must honor (`reference/reviews/`)
Read **`AUDIT-funnel.md`** in full; the load-bearing ones for this step:
- **GAP I (A37/A41/A42 thread) — Section Analyzer DISCIPLINE clause.** With the validation lane now in-context, the analyzer must record descriptively **but not treat an `unknown`-lane funnel as proven** (the as-ran SA-1 "asserts provenness it can't see" failure). The input-half is closed; the descriptive-clause threading is ○ this build (Job 7).
- **GAP E (S-2 awareness)** — per-funnel awareness now produced here in STEP 2; the `awareness_basis` evidence rule's *precedence* stays ○ (D6, Job 2/3) — wire the required field, leave precedence as a ○ slot.
- **GAP B (proven-fill, data side)** — R1 quantification on the full roster is the fix for the as-ran Currency-A starvation; this build's rollup is what supplies it. Do not let the rollup conflate ad-presence with longevity.
- **KEEP (do not regress):** the **D-05 no-ads guard** (override = logged, never silent hand-feed); the Router's closed enum + transformation-gated routing (SURVIVED); the single-idea unit as "ammo."

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **A1/A2/A3** — the three build-time meta-skills touch every Job 2/3/4 step; the Section Analyzer's idea-unit ontology is a `decision-spec` target; build through them if they exist.
- **R2 GAP-1 (PART3 §1.6) — standalone quantification.** The ad-volume aggregate is keyed by the NTP **pair** (transformation×angle); the operator also wants niches/transformations/products quantified **alone**. This is routed to the **Space-Map build (STEP 3)** but the rollup grain originates here — emit per-axis-friendly rows, not only pair-keyed ones.
- **Dependencies that are NOT this build's call:** the idea-unit ontology + believability-gate parameters → **Job 2**; the currency-model semantics for the quantified signals → **Job 4**; the per-ad angle split → an OPEN ○ refinement. Wire the I/O so these drop in; do not hard-code them.

## Done =
The step packages funnels (LP+PDP, `path_verified`, same-brand), reads each funnel as **single-idea units with verbatim spans + a required `awareness_basis`**, the analyzer **knows what's validated while reading** (validation lane in inputs), deterministic scripts produce the **ad-volume aggregate per transformation and per angle** (plus crowdfunding backing + awareness distribution), refuses on missing packages / null awareness, never silently treats an unknown-lane funnel as proven — with the idea-unit ontology, believability-gate parameters, and currency semantics left as wired ○ slots pointing at Jobs 2/4.
