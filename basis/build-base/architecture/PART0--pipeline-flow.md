---
status: authoritative
role: Bird's-eye end-to-end pipeline flow (each step ingests->decides->emits->feeds next), reconciled to PART3 R1 order.
read-with:
  - architecture/PART3--architecture-design.md
  - architecture/PART3-READER--human-map.md
supersedes: []
---

> **What this is:** the canonical step-order narrative. **Read by:** every per-step build session + the system-design pass, first, for orientation.

# PART 0 — Pipeline Flow & Job Logic (the bird's-eye spine)

**Read this first.** PART 1 (decisions), PART 2 (build order), and PART 3 (architecture) are organized by decision-ID, by agent-card, and by build-job — none of them states the pipeline as one end-to-end story. This doc does: each step as **ingests → decides/does → emits → feeds next**. It is the operator's own bird's-eye model, reconciled against the architecture's R1 step order.

It is deliberately job-logic only — no agent splits, no model choices, no thresholds. For the mechanics of any step, follow the §-pointer into PART 3.

**Six gaps live in this flow** — job logic the operator described that no design doc captured before this pass. Each is marked **⚠ GAP-x** inline and collected in the routing index at the end. PART 3's new **R2** block carries the same six as formal open decisions next to the architecture.

Glyphs match PART 3: ● operator-settled · ◆ system-design call (vetoable) · ○ open slot a build session fills.

---

## ⚠ MARKETING-SOUNDNESS STANDARD — MANDATORY READ BEFORE BUILDING

Before building any step below, read **`SPEC-marketing-soundness.md`**, **`marketing-rule-register.md`**, and **`BUILDER-DIRECTIVE.md`** (also flagged in PART 3, top + §6.0). They keep marketing *decisions* good (C2, C3, C5, C6, C7, C8): every step's emitted artifacts carry the **grounding** contract (each load-bearing judgment cites a DR-law/test ID or a Register rule-ID, or is marked `UNGROUNDED`) and a **`carried_risks[]`** list (UNGROUNDED calls, blank inputs, `CANNOT-EVALUATE` checks, and low-n values all travel to the operator at each ★ gate). Scope: marketing-decision quality only — prompt-mechanization (C1) and field continuity (C4) are separate sessions.

---

## The flow, end to end

Step numbers follow PART 3 §1.5 (the R1 reorder: deep funnel analysis runs *before* the space map; the VOC market pass sits *after* the map and *before* selection). The operator's own numbering is noted in parentheses.

---

### STEP 0 — Product intake + Bet brief  (operator's steps 1–2)  · PART 3 §6.1
- **Ingests:** the operator's product (specs, what it physically is) + operator knowledge; a KB digest (case-studies, differentiator-framework, market-evaluation-criteria, product-research).
- **Does:** captures what the product *is* physically (intake), then compiles the **bet** — what the product is functionally doing / could do / hypothesis on the unique strength it can win on. Interrogates the operator for completeness; the operator decides, the agent structures.
- **Emits:** `bet-brief` — a structured contract (tagged fields, prose inside): product overview/features, what the hardware structurally enables, the differentiator, the niche, the **open transformation slot**, NTP-similarity controls (3 separate criteria sets), functional-mechanism-equivalence test, comparable-bet seeds, territories, LP-hunt terms, claim-typing examples.
- **Feeds:** Competition Search (queries derive from `territories` + seeds); and nearly every downstream step reads the brief.
- **Note:** product intake is **not** a standalone stage today — it's folded into the bet-brief as `product_overview / product_features / what_hardware_enables`. If the operator wants intake as its own first step, that's a shape decision (see GAP-6).

### STEP 1 — Competition search / Collect  (operator's step 3)  · PART 3 §1.5 STEP 1, §6.2–6.3
- **Ingests:** the bet-brief (territories, comparable-bet seeds) + product/category.
- **Does:** finds competitor brands relevant to the bet, across search lanes; verifies the roster (slop out, gaps in) before any fetch spend; fetches and extracts each brand's copy verbatim. **No classification of the space here** — find, verify, fetch, extract only.
- **Emits:** `brands.json` (deduped roster) + per-brand verbatim dumps + `queries_run[]` (auditable query trail).
- **Feeds:** Funnel Analysis.

### STEP 2 — Funnel analysis  (operator's step 4)  · PART 3 §1.5 STEP 2, §6.7
- **Ingests:** the full verified roster.
- **Does:** packages each brand's funnels (ad → LP → PDP, link-path verified), then reads each funnel one at a time — belief chain, single-idea units, awareness, verbatim spans. Deterministic scripts then **quantify** ad counts + ad-longevity per funnel, rolled up per transformation and per angle; crowdfunding backing per brand; awareness distribution.
- **Emits:** per-funnel analyzed records + the **ad-volume aggregate** `{transformation, angle, funnel_count, ad_count, max_ad_longevity_days, spend_signal?, crowdfunding_backing?}`.
- **Feeds:** the Space Map.

### STEP 3 — Space map  (operator's step 5a)  · PART 3 §1.5 STEP 3, §6.4
- **Ingests:** the analyzed-funnel records + the quantitative aggregates (structured rows, **not** raw copy — the scale point).
- **Does:** synthesizes the canonical space — the NTP cells with their validation already attached. Quantifies the numbers **behind each NTP pair**: ad volume, LP volume, backer counts, mechanisms in play.
- **Emits:** `space-map` (output schema ○ — likely tagged cell fields + prose basis).
- **Feeds:** the VOC market pass + Market Selection (which also reads the bet-brief).
- **⚠ GAP-1 — standalone quantification.** The operator also wants **niches, transformations, and products quantified ALONE**, not only paired through NTP. Today every quantification grain in the architecture is the NTP *pair* (the aggregate is keyed by transformation×angle), and the space-map output schema is explicitly left open — so a build session would produce pair-only numbers unless told to also emit per-axis standalone rollups. *Routed to the Space-Map build session.*

### STEP 4 — VOC market pass / VOC pass 1  (operator's step 5b)  · PART 3 §1.5 STEP 4, §5.1 Product 1
- **Ingests:** the candidate cells the space map surfaces; the bet-brief; product intake. (Per-cell, pass-1/3a depth.)
- **Does (as documented):** for each candidate niche×transformation — measures **transformation demand signal** (do they articulate wanting it; unique-raiser counts, intensity, counter-signal flags); maps **category language**; baselines **niche identity**; and surfaces `gap_candidates[]` = themes with high VOC strength but no validated competitor spend.
- **Emits:** `voc-market-signal` (3 sections) + `gap_candidates[]`.
- **Feeds:** Market Selection (demand-side currency + the gap rows).
- **⚠ GAP-2 — VOC pass 1's full job is under-specced** (the operator flagged this himself). Three pieces are not written down anywhere: **(i) invalidation as a first-class lane** — find *un*satisfied customers and disconfirming signal, not just a vague "counter-signal flag"; **(ii) "customers who already have the transformation"** as a population to mine (distinct from those who want it) — appears nowhere; **(iii) the could-OUR-product-satisfy delta** — the documented gap is *demand minus competitor spend*; the operator wants *demand that current solutions don't fully satisfy but our product structurally could.* That product-satisfaction delta is a different computation and isn't modeled. *Routed to the VOC build session (Job 3); this is the highest-risk gap because the docs don't even flag it as open.*

### STEP 5 — Market selection → NTP pick  (operator's step 6)  · PART 3 §6.5, §5.2
- **Ingests:** the space map (supply-side: competition/saturation/spend per cell) **and** `voc-market-signal` §1 (demand-side) **and** `gap_candidates[]` (the whitespace/gap). Dual-source is wired ● — this is documented, not a gap.
- **Does:** ranks surviving NTP cells under the gate order, weighing competition vs demand vs the served/unserved gap. Finds an NTP with validation through spend (or at least the transformation), VOC validation, and a real customer gap.
- **Emits:** ranked provisional survivors → **★ operator picks the NTP.**
- **Feeds:** the VOC deep pass + the funnel architect.
- **Open (not a gap, just deferred ○):** the gate *weights/thresholds* and the whitespace-vs-scary verdict policy — reserved to Jobs 2/4 with the operator.

### STEP 6 — VOC deep pass / VOC pass 2  (operator's step 9)  · PART 3 §1.5 STEP 6, §5.1 Product 2
- **Ingests:** the chosen niche (winner cell only), at pass-2/3 depth.
- **Does:** quantifies, in numbers, the customers' **PMBDE** for this market — how often each Pain, Mechanism/Motif, Belief, Dream, Experience theme is raised, by frequency; builds the deep evidence views.
- **Emits:** `voc-bank` — copy bank + **frequency brief** + belief/angle + awareness evidence views.
- **Feeds:** the Awareness Reconciler, the Funnel Architect, the VOC language bank, the Copywriter.
- **⚠ GAP-3 — per-PMBDE-theme frequency counts.** A "frequency brief" is named, but the architecture only specs the frequency machinery for *pass 1* (`{theme, unique_raisers, ratio, intensity}`). The deep pass's job — a **count-per-PMBDE-theme table for the chosen market** — is named, not contracted. A builder would inherit the pass-1 shape and might not extend it to the P/M/B/D/E breakdown the operator wants. *Routed to the VOC build session.*

### STEP 7 — Funnel architect  (operator's step 10)  · PART 3 §1.5 STEP 7, §6.6–6.7
- **Ingests (documented):** the analyzed funnel store + tally + reconciled awareness-read + `voc-bank` belief/angle view + the validation-currency model outputs + product intake + bet-brief and/or market selection.
- **Does:** architects the funnel for the chosen market — reads the teardowns of the market's own funnels and the quantified VOC, designs the congruent belief chain.
- **Emits:** a funnel design brief → auditor → ★ operator review.
- **Feeds:** the Copywriter.
- **⚠ GAP-4 — adjacent-market funnels.** The operator wants the architect to *potentially read funnels from adjacent markets* for inspiration. The architect's input set is enumerated as a **closed list** in §6.7 and adjacent-market funnels aren't in it — so it'd be silently skipped. *Routed to the Funnel-Architect build session (Job 7); decide whether adjacent funnels are an input and how they're selected.*

### STEP 8a — VOC language bank  (operator's step 11)  · PART 3 §5.1 Product 2 (copy bank)
- **Ingests:** the VOC frequency output + the source permalinks.
- **Does:** builds the language bank — for each quantified theme, the **phrase × frequency** pairing, verbatim, with links back to source.
- **Emits:** the copy bank, retrievable for the copywriter.
- **Feeds:** the Copywriter (slot-scoped RAG).
- **⚠ GAP-5 — frequency×phrase shape.** The documented copy bank is keyed by belief_id / PMBD tier / sub-niche / register, with frequency living in a *separate* brief. The operator's specific fusion — a bank organized as **(frequency × phrase) per theme, with links** — isn't the documented contract. *Routed to the VOC build session; decide whether the bank carries per-phrase frequency weight or stays slot-keyed with a join to the frequency brief.*

### STEP 8b — Copywriting  (operator's step 12)  · PART 3 §6.9
- **Ingests:** the locked architect brief + slot-scoped verbatim from the copy bank + the funnel index.
- **Does:** writes the copy under the brief's angle; a copy chief reads it per line and loops revisions.
- **Emits:** the drafted funnel copy → ★ operator.
- **Feeds:** asset classification + the adversarial re-review (PART 3 STEP 9–10).

---

## ⚠ GAP-6 — the structural gap (your actual question)

There was **no single end-to-end job-logic narrative anywhere** before this doc. PART 3 §4.1/§1.5 are topology maps (boxes + arrows + decision-IDs); §6 is per-agent cards (I/O sliced by agent); §5.2 is a consumption matrix; PART 3-READER is plain-language but deliberately stripped of decision logic. The bird's-eye "ingests X → decides Y → emits Z → feeds next" was reconstructable by cross-referencing, but never stated in one place. **This PART 0 is the fix.** *Owner: this doc; keep it in sync when the architecture changes.*

---

## Gap routing index

| Gap | What's missing | Lives in (PART 3) | Routed to build session |
|---|---|---|---|
| **GAP-1** | Standalone quantification of niches / transformations / products, separate from NTP pairs | §1.5 STEP 3 + ad-volume aggregate; R2 | **Space-Map build** (Job 7, space-map stage) |
| **GAP-2** | VOC pass 1: invalidation lane + "already have the transformation" population + could-our-product-satisfy delta | §5.1 Product 1, §5.3; R2 | **VOC build (Job 3)** — highest priority, unflagged before now |
| **GAP-3** | VOC pass 2: per-PMBDE-theme frequency counts for the winner market | §5.1 Product 2, §5.3; R2 | **VOC build (Job 3)** |
| **GAP-4** | Funnel architect reading adjacent-market funnels | §6.7; R2 | **Funnel-Architect build (Job 7)** |
| **GAP-5** | Language bank as (frequency × phrase + links) per theme | §5.1 Product 2; R2 | **VOC build (Job 3)** |
| **GAP-6** | No single end-to-end job-logic narrative | this doc (PART 0); R2 | **resolved here** — maintain on change |

---

*Companion to PART 1 (decisions) · PART 2 (build order) · PART 3 (architecture). When any of GAP-1…5 is resolved by its build session, update both this doc and PART 3 §R2.*
