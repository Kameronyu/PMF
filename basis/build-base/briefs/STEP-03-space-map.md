---
status: brief
role: Per-step build brief for STEP 3 — Space Map (Space Classifier reborn as synthesizer). Points (not copies) to the exact slices the build session needs.
read-with:
  - INDEX.md
step: 3
covers: Space Map — the synthesizer over analyzed-funnel records + quantitative rollups that produces the canonical NTP cells with validation already attached. INPUT is structured rows, NOT raw copy.
---

> **What this is:** the reading list + duties for the session that rebuilds the **Space Map** (the Space Classifier reborn under R1 as a **synthesizer**, not a raw-dump cranker). Open this, follow the pointers, build — nothing is copied, every line points into the base. **Start with §"What was already run" — the as-ran Space-Classifier section + the full root `space-map.json` it produced are the highest-leverage inputs.** Under R1 it reads **compact structured rows** (one per funnel + aggregate tables), never the raw 40-funnels-of-copy — that is the scale point.

## In one line
Synthesizes the canonical space from the **analyzed-funnel records + the quantitative aggregates** (structured rows, not raw copy): the NTP cells with their validation already attached, quantifying ad volume / LP volume / backer counts / mechanisms behind each NTP pair. Emits the `space-map` (output schema ○ — likely hybrid: tagged cell fields + prose basis). Feeds the VOC market pass + Market Selection.

## ★ Start here — what was already run (highest leverage)
Read the **as-ran Space-Classifier logic you are rebuilding** and the full output it produced, before anything else.
- **The as-ran skill (rebuild target):** `pmf3/step1-light-pass.md` — **the Space Classifier section** of the as-ran light-pass skill (parent folder; catalogued in `reference/EXTERNAL-INPUTS-MAP.md` §A). **Read this first.** Under R1 the light pass is dissolved and the Space Classifier becomes this STEP 3 synthesizer over structured rows — but the as-ran classification logic (transformation clustering, claim typing, niche/bet_type/sophistication) is what you are improving.
- **What it produced on the real run:** `reference/as-ran-repo/repo-files/space-map.json` — the **full root** space-map output (cells, mechanisms, claims, per_brand fields). Read this for the field names + the `novelty-object-own` mis-cluster the rebuild must make impossible.
- **Reader's-guide:** `reference/as-ran-repo/asran-repo-report.md` (§5 artifacts + field names; §2c the sophistication-grain note; §9 which fields live on `per_brand[]` vs `combos[]`).
- (Do **not** re-prosecute the as-ran wiring bugs — fields "absent from combos" were a grain/strip artifact, root-caused in PART3 §1.1 / asran §9; the synthesizer's fresh schema dissolves it.)

## Then build from (authoritative — in this order)
1. **`architecture/PART0--pipeline-flow.md` → STEP 3** — the job logic (ingests analyzed-funnel records + quantitative aggregates, **structured rows not raw copy**; synthesizes the NTP cells with validation attached; emits `space-map`, schema ○). **Read PART0 GAP-1 inline** — standalone quantification.
2. **`architecture/PART3--architecture-design.md`:**
   - **§1.5 (R1)** — the reborn Space Map: "synthesizer, not a cranker," reads structured rows, output schema **OPEN ○ (hybrid)**, scale check. *The spine of the rebuild.*
   - **§6.4** — the Dumper + Space Classifier card (read the ⚠ banner: the "reads-all-dumps" framing is pre-R1; the **three current contract changes are live**: (1) every classification runs through the D3 test slots once Job 2 writes them — until then carry the run's `novelty-object-own` failure as a warning label; (2) consume `voc-market-signal` §2 vocabulary when present; (3) emit per-property `basis` fields universally). **Winning-angle determination is out of scope** (● A39).
   - **§1.6 GAP-1** — standalone per-axis (niche / transformation / product) quantification, decoupled from the NTP pairing. **This is the operator's explicit instruction for this build.**
   - **§6.0** — soundness duties row (grounds transformation, claim-type, mechanism-vs-feature, sophistication, niche; carries UNGROUNDED classifications + blank inputs + low-n cells).
   - **§7.2 / §7.3** — knowledge scope + registry slots it owns: `transformation`, `niche` (venue + reading + in/exclusion), `claim-type`, `mechanism-vs-feature` (+ believability gate), `sophistication`, `trend/durability`, `venue`. Content ○ Job 2; **slots** fixed.
3. **`architecture/PART1--dependency-ordered-map.md` → D3** (determination mechanics) — by annotation:
   - **A24/A25** (D2/D3) — what caused the `novelty-object-own` mis-classification; "definition is not enough, name inputs + tests."
   - **A21** (D3) — "trend of WHAT" — what is actually being trended.
   - **A8/A14/P11** (D3) — the venue test + "how to read a brand's material and understand who they sell to."
   - **A16/A17/A18/A19** (D3) — mechanism = pathway to the transformation, must pass a believability gate; track features separately from proposed mechanisms.
   - Cross-ref **D3** as the parent decision (PART1 §4) — the project-wide "definition + vibes → named inputs + mechanical test" pattern.
4. **`architecture/PART2--build-order-roadmap.md` → Job 2 (D2+D3)** supplies the test content for every slot above. This build wires the synthesizer + the open schema + the basis fields; Job 2 fills the licensing tests.

## Marketing-soundness duties (non-negotiable — read first)
- `standards/BUILDER-DIRECTIVE.md` → `standards/SPEC-marketing-soundness.md` → `standards/marketing-rule-register.md`. Apply **PART3 §6.0**.
- Every load-bearing classification carries a `grounding_ref` (DR-law/test ID or Register rule-ID, else `UNGROUNDED`) + `carried_risks[]`; low-n cells emit `{value, n, low_n}`. A `basis` field is **necessary but not sufficient** — it records what was read, not what licenses the label (PART4 C2).
- **MR-001** (never-merge, configurable-pending-D5) and **MR-003** (cross-cell = structure reference) bear on how cells are formed and how validation is attached.

## Adversarial findings this build must honor (`reference/reviews/`)
Read **`AUDIT-collection.md`** in full (this is the Space Classifier's audit); the four LIVE residues are all the same shape — a classification decision with a named slot but ○ test content:
- **GAP-1 — `bet_type` / `sophistication` have no licensing test.** The `basis` field is a write-slot, not a license; made worse because `bet_type` now also lives in the Bet Compiler — keep the determination-test ownership clear. Routed Job 2 (+ Job 1 for the bet-brief half).
- **GAP-2 — the transformation determination is still definition-plus-clustering.** The `novelty-object-own`-class mis-cluster must be made impossible; the reviewer's **competitive-set-change sub-test** (a pixel-art display and a synth do not share a competitive set) exists nowhere — it is exactly what the `transformation` slot must hold. Routed Job 2 (co-designed with Job 3 VOC).
- **GAP-3 — durability-validation CLASS ("trend of WHAT").** A repaired fetch can populate a trend that measures the wrong thing; A21's options are ○ Job 2/3.
- **GAP-4 / GAP-5 — niche venue evidence + claim-vs-feature / mechanism-vs-feature.** Best-covered structurally (the believability gate matches the operator's redefinition, parameterized by niche) but content ○ Job 2.
- **KEEP (do not regress):** the **claim-typing schema + feature-vs-claim trap** (DECISION 4 SURVIVED); the **mechanical sophistication rule** (DECISION 5); **winning-angle determination stays out of scope**; the warning-label honesty posture.

## Open decisions touching this step (`OPEN-DECISIONS.md`)
- **A1/A2/A3** — the three build-time meta-skills touch this Job 2/3 step directly; `decision-spec` is the mechanical guard for the "transformation was never defined" problem at **every** classifying seam here. Build through them if they exist.
- **C1 (pricing/anchor slot)** — not owned here, but the synthesizer's price-utterance handling feeds the price-conditioning read; keep price observations as observed vocabulary, no verdict.
- **Dependencies that are NOT this build's call:** all classification **test content** → **Job 2** (operator, marketing truth); VOC §2 vocabulary feed → **Job 3**. The **output schema itself** is this build's call (it is ○ here, not deferred) — design the hybrid schema and the standalone-axis rollups.

## Done =
The synthesizer reads **structured funnel rows + quantitative aggregates** (never raw copy), emits canonical NTP cells **with validation attached + a `basis` per judgment**, produces **both pair-keyed and per-axis standalone** quantification (GAP-1), routes every classification through its named D3 test slot (carrying the `novelty-object-own` warning label until Job 2 fills them), makes no winning-angle call, refuses on missing dumps / invalid bet-brief — with every classification test left as a wired ○ slot pointing at Job 2/3.
