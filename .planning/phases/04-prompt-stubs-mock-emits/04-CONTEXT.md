# Phase 4 — Prompt Stubs ×11 + Mock Emits — CONTEXT

## Goal (one paragraph)

Drop **11 stub prompts** (one per step 0..10) at each manifest's declared `prompt:` slot, each on the
**bet-compiler envelope** (frontmatter + ROLE + INPUTS-refuse + OUTPUT CONTRACT + COMPLETENESS +
HOW-IT'S-CONSUMED + empty BODY), and wire **STUB-mode mock emits** so that running each step through the
run-controller produces **every** artifact in that step's manifest `writes[]` at the exact scaffolded slot
path, with **contract-shaped** mock content (valid JSON matching the live validators' expected top-level
shape; markered markdown for `.md` slots; representative `_index/_tally/_bank/_copy/_review` files for
fan-out dirs). Emits are deterministic (no timestamps/random in committed mock content) to honor
idempotency + no-overwrite-v1. WIRE-03: Step 2's funnel records carry **raw per-funnel**
angle/claim/transformation; Step 3's space-map carries the **canonicalized** set whose `raw_variants`
trace back to Step 2's raw values. Mechanism only — real marketing prompt bodies are a deferred drop-in
slot (Phase 7 / content job). The shell must run end-to-end on these stubs (proven in Phase 6); Phase 5
adds real presence/shape validators.

## Hard constraints

- DO NOT modify any of the 11 manifests in `engine/manifests/` or `pipeline.yaml` (Phase 3 frozen).
- DO NOT push. DO NOT touch the `eink-phase0-run` branch. Branch = `pmf-shell-build`.
- Reuse the run-controller mechanism; add only the MINIMAL stub-invocation hook needed to emit ALL
  `writes[]` (today it emits only `writes[0]` with a generic payload — insufficient).
- Mock content co-located with the prompt stub (a STUB-EMIT block) so the Phase-7 real-prompt drop-in
  is a pure slot-fill with no controller/manifest rewiring.

<canonical_refs>

### Envelope yardstick (the shape every stub mirrors)
- `basis/build-base/skills/bet-compiler/SKILL.md` — OUTPUT CONTRACT (named artifact + fields) +
  COMPLETENESS (machine-checkable membership block) + HOW IT'S CONSUMED + INPUTS (refuse if missing) +
  SCOPE/STOP-LINE. The stub reproduces this envelope with STUB content and an empty/markered BODY.
- `basis/build-base/SHELL-BUILD-SPEC.md §6` — the drop-in stub envelope template (frontmatter
  `step/reads/writes/status: STUB` + the contract sections + `<<< BODY filled later >>>`).
- Soundness triad (envelope shape now, content deferred): `standards/SPEC-marketing-soundness.md`,
  `standards/marketing-rule-register.md`, `standards/BUILDER-DIRECTIVE.md`.

### Canonical flow + per-step I/O
- `basis/build-base/architecture/PART0--pipeline-flow.md` — R1 order 0..10, each step ingests→emits→feeds.
- `basis/build-base/briefs/STEP-00..10-*.md` — per-step manifest I/O detail.

### The frozen Phase-3 manifests (prompt slot + writes[] — the emit contract)
| step | prompt: | writes[] (every one must be emitted) |
|---|---|---|
| 00-bet-compiler | prompts/00-bet-compiler.md | bet-brief.md, product-intake.md, asset-classify/CLAIM-LIST.json |
| 01-collect | prompts/01-collect.md | brands.json, queries_run.json, dumps/ |
| 02-funnel-analysis | prompts/02-funnel-analysis.md | ad-volume-aggregate.json, funnels/_tally.json, funnels/ |
| 03-space-map | prompts/03-space-map.md | space-map.json |
| 04-voc-market-pass | prompts/04-voc-market-pass.md | voc/market-signal/_index.json, voc/gap_candidates.json, voc/market-signal/ |
| 05-market-selection | prompts/05-market-selection.md | market-selection.json, ntp-pick.json |
| 06-voc-deep-pass | prompts/06-voc-deep-pass.md | voc-bank/_bank.json, awareness-read.json, voc-bank/ |
| 07-funnel-architect | prompts/07-funnel-architect.md | funnel-brief.md, audit-verdicts.json |
| 08-copywriter | prompts/08-copywriter.md | copy/_copy.json, chief-verdicts.json, copy/ |
| 09-asset-classify | prompts/09-asset-classify.md | asset-records.json |
| 10-adversarial-re-review | prompts/10-adversarial-re-review.md | review/_review.json, review/ |

NB: a `writes[]` entry ending in `/` is a fan-out DIRECTORY — it is satisfied by the dir existing
(its representative `_*.json` index file is the sibling write). The controller's existing preflight only
requires regular files for reads[]; dir writes need only `mkdir -p`.

### store-scaffold slot paths (emits must match these EXACTLY — zero drift)
- `engine/bricks/store-scaffold.js` — SLOT_DIRS + MD_FILES + JSON_FILES. The scaffolded slot names are
  the authoritative paths; a stub emit that writes a different path is a wiring break.

### run-controller stub-invocation mechanism (what to extend, minimally)
- `engine/bricks/run-controller.js` — Phase 4 `mockEmit(m, space)` currently writes only `writes[0]`
  with `m.stub_emit ?? {_stub,step}`. EXTEND so STUB mode (smoke) emits EVERY `writes[]` with the
  contract-shaped payload declared in that step's prompt-stub STUB-EMIT block. Phase 5 swaps the stub
  spawn for a real agent spawn; the wave-chunking seam is unchanged.

### The live validators the emits must satisfy (route.js dispatch, Phase 5 keeps tightening)
- `engine/hooks/route.js`: `brands.json` → validate-finder.js + validate-revenue.js;
  `space-map.json` → validate-classifier.js; `*-beliefs.json` → validate-analyzer.js.
- `validate-finder.js`: `brands[]` array; each brand needs non-empty `url` + `sells_observed`;
  `channel`∈{dtc,marketplace,crowdfunding}; `lane`∈{major,crowdfunding,marketplace}.
- `validate-revenue.js`: any `revenue_est.value_usd_monthly` non-null needs `method`+`confidence`;
  never the string "PENDING".
- `validate-classifier.js`: `transformations[].raw_claim_variants[]` (non-empty);
  `niches[]/angles[]/bet_types[]/mechanisms_in_play[].raw_variants[]` (non-empty);
  `saturation[]` keyed per cell (transformation AND niche); `combos[].claim_count`+`enhanced_claim_count`
  (enhanced ≤ claim); `claims[].type`∈{direct,enlarged,mechanism,enhanced};
  `per_brand[].bet_type`+`bet_type_basis`+`demand_trend.shape`∈{steady,rising,parabolic-spike,declining,unknown}.

### WIRE-03 — two-tier classification (the raw→canonical seam, made real in mock data)
- Step 0 §4 locked decision: Section Analyzer (Step 2) emits **raw per-funnel** angle/claim/transformation;
  Space Classifier (Step 3) **canonicalizes** across all funnels.
- Mock representation:
  - Step 2 `funnels/_tally.json` + per-funnel record carry RAW fields:
    `transformation` (raw string, per funnel), `angle` (raw), `claims[].text/type` (raw, per funnel),
    `awareness_basis`. The `ad-volume-aggregate.json` rows are `{transformation, angle, funnel_count,
    ad_count, max_ad_longevity_days}` — still raw/un-canonicalized labels.
  - Step 3 `space-map.json` carries CANONICAL: `transformations[].{canonical, raw_claim_variants[]}`,
    `angles[].{canonical, raw_variants[]}`, `niches[].{canonical, raw_variants[]}` — where each
    `raw_variants[]` value is one of Step 2's raw labels (the seam: canonical groups ≥1 raw variant).
    The mock makes ≥2 distinct Step-2 raw labels collapse into 1 Step-3 canonical, so the two tiers
    visibly differ.

</canonical_refs>

## Deferred (and to where)
- Real presence/shape validators per step → Phase 5 (VALID-01..05).
- Real marketing prompt BODIES → deferred content job (Phase 7 order), pure slot-fill into BODY.
- Field-level seam schemas / contract-congruence → Job 5 (tightens validators, no rewiring).
