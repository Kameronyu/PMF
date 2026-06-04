# Phase 3: Stage M1-S3 — Deep competitive analysis (collection layer) - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

**SCOPE SHRUNK (2026-06-03):** Phase 3 builds the **collection layer only** of deep funnel
analysis — up to but NOT including the birdseye synthesis agent. It pulls competitor ad+LP
funnels, validates them, and emits a pile of structured **belief-instance records + funnel-level
fields**, ready to be synthesized later. It does NOT produce the merged deployable plan (proven
angles / dead ground / whitespace / awareness calibration) and does NOT run Gate 2 — those are
the **birdseye merge** (`A4 Synthesize → D1 Decide`), now split to a **later phase**.

Source-of-truth spec: the updated **"Phase 2 Funnel Analysis — Build Specification (Collection
Layer)"** (pasted into the Phase-3 discuss 2026-06-03; supersedes the prose
`prompts/_specs/deep-market-analysis-framework.md` for the build — save the build spec to
`prompts/_specs/` as the first planning task). PMF terms: this is **Step 2** (deep market study);
GSD terms: **Phase 3 / Stage M1-S3**.

The pipeline (brick string, mirrors how Phase 1 is built):

```
[Scraper/Assembler]  S1 fetch + S2 normalize/cluster (scripts) — pull ads, capture destination_url,
                     normalize + cluster ads→LP by URL into one funnel_package per funnel; render each LP
      |
[Cleaner/Verbatim]   S2 clean (script) — section-marked clean copy incl. on-page reviews; stays dumb
      |
[Validation Scorer]  S3 score (script) — per-funnel validation_strength, TWO currencies, no normalization
      |
[Router]             A2 classify (agent, light) — set routing_flag from transformation-similarity
      |
[Section Analyzer]   A2 classify + A3 extract (agent) — THE judgment workhorse; emits belief-instance records
      |
[Store]              S4 store (script) — structured JSON under runs/<space>/funnels/ ; RAG-ready, NOT vectors
```

**The unit of analysis is the FUNNEL** (one congruent path: one angle / one transformation / one
awareness entry, ads bound to the LP they feed). One competitor with 3 distinct LPs = 3 funnels.
The ad→LP binding (normalized destination URL clustering) IS the unit definition — it is the spine
of the scraper, not an afterthought.

**Out of scope this phase:**
- **Birdseye synthesis agent** (`A4→D1`) — the merge / spine+divergences / dead-ground+whitespace /
  awareness calibration / Gate 2 win-decision. Own later phase. Records here are confirmed sufficient
  to feed it (spec §10).
- **Vector-DB / RAG ingestion + funnel-writer + copywriter** — downstream Step-4 machinery. Phase 3
  makes records RAG-ready (granular `execution_detail`, preserved `verbatim_refs`); it does not vectorize.
- **Crowdfunding-source discovery** — NOT a Phase-3 job. Phase-1 LANE 2 (`step1-light-pass.md:250-254`)
  ALREADY sources **in-transformation** crowdfunding campaigns (KS/Indiegogo/Makuake/BackerKit) with
  raise/backer stats — those arrive as `messaging_full`/`both` funnels when Kam runs S1 on the real
  market. **Open item (NOT a bug):** **off-transformation** crowdfunding projects collected purely as
  funnel-container exemplars (`structure_only`) are discovered by nothing today. Whether to collect them
  is a strategy call (D-19). Phase-3 assembler ACCEPTS a hand-fed crowdfunding LP list either way; it
  does not discover sources.
- **Full review-mining / VOC** — on-page reviews ARE captured into `verbatim_refs[]` tagged
  `review_language`; deep VOC is Track B (Stage M1-S4+), deferred.
- **Word-choice / copy-quality analysis** — different altitude; verbatim goes to corpus untouched.
- **The pre-Phase-2 plan template** (sets per-market routing flags / feature watchlist / awareness
  target / price decision) — separate artifact, deferred.

</domain>

<decisions>
## Implementation Decisions

### Scope & boundary
- **D-01 (phase shrinks to collection):** Phase 3 = collection layer only; birdseye merge + Gate 2
  split to a later phase. ROADMAP Phase-3 success criteria (which described the merge) get rewritten
  to the collection-layer deliverable. (Roadmap update is a planning task.)
- **D-02 (build ready-to-run, market-agnostic):** No market is picked yet. Build every component
  parameterized on a chosen-market input so it runs the moment a market exists. Do NOT lock to a
  market. First real methodology-debug pass + its debug-notes wait for the real market.

### The funnel + the binding (the spine — spec §2 / §2b)
- **D-03 (funnel = the locked unit):** one congruent path (one angle / one transformation / one
  awareness entry) with ads bound to the page they feed. Competitor ≠ unit; single ad ≠ unit.
- **D-04 (binding key = normalized destination URL):** capture each ad's destination URL; strip
  tracking params (utm_*, fbclid), normalize trailing slash/case/protocol; cluster ads by normalized
  URL → each distinct LP = one candidate funnel; the ad cluster = that funnel's bound ad set;
  `variant_count` = distinct active ads in the cluster. **Get normalization right or one funnel
  splatters into ten.**
- **D-05 (assembler edge cases, don't choke):** zero-ad crowdfunding funnel = VALID (LP only,
  validation via Currency B); ad→linktree/homepage = flag `ambiguous_destination`, do not force a
  funnel; same LP with divergent ad angles = still one funnel, capture each ad angle; near-identical
  A/B-variant LPs at different URLs = separate funnels (birdseye notices similarity, not the scraper).

### Tooling reuse — EXTEND, don't rewrite (verified against repo)
- **D-06 (`adlib-one.js` is missing the binding key):** current output =
  `{library_id, start_date, end_date, run_length_days, text}` ONLY — no `destination_url`, no
  `impression_bucket`, no `cta_text/headline/platforms`. The §2b spine has nothing to cluster on yet.
  **Extend `adlib-one.js`** to capture per ad: `destination_url`, `cta_text`, `headline`,
  `impression_bucket` (coarse range, available since early 2026; flip to an EU country filter for
  tighter DSA ranges as an optional richer pass), `platforms`. This is the single biggest build gap.
- **D-07 (`crowdfund-fetch.js` is a dumb dumper):** it renders HTML/text but does not parse
  `amount_raised / backer_count / funded_vs_failed / delivered_vs_not`. Layer a parser for Currency B.
  Reuse its SPA/Cloudflare render skeleton for crowdfunding LP bodies.
- **D-08 (LP render):** fetch each destination LP with a real browser render (Playwright) — full
  rendered copy + all sections + on-page reviews; raw fetch returns empty JS shells. Reuse the
  Playwright pattern already in `tools/`.

### Validation — two currencies, no normalization (spec §3)
- **D-09:** carry a `validation_lane` (A or B) per funnel; never normalize into one number.
  - **Currency A (ad-fed):** `max_run_duration_days` (spine; 60+ ≈ top ~11%, anti-fluke floor) ×
    `impression_bucket` × `variant_count`.
  - **Currency B (crowdfunding):** `amount_raised`, `backer_count`, `funded_vs_failed`,
    `delivered_vs_not` (prior campaign shipped = strongest durability signal).
  - A brand running Meta ads INTO a crowdfunding page has BOTH — record both, birdseye weights per lane.
  - No SEMrush/Similarweb traffic (modeled, weak, gated) — committed money/longevity only.

### Routing (spec §4 — one prompt + flag)
- **D-10 (router = light A2-classify brick):** ONE section-analysis prompt + ONE record schema for
  every funnel — NOT a structure/messaging prompt split. A funnel-level `routing_flag` governs what's
  KEPT: `structure_only` (off-transformation crowdfunding — keep container/sequence/ship-scaffolding,
  DISCARD their specific claims/angles), `messaging_full` (in-transformation brand — keep everything,
  esp. claims/angles/proof), `both` (in-transformation crowdfunding — richest). Build a small router
  that judges transformation-similar-vs-not (given competitor + the run's transformation) and sets the
  flag — grounded in the transformation definition (`definitions.md`) + run-1 examples. The Section
  Analyzer runs the SAME full extraction regardless; the flag governs keep/discard, set BEFORE the
  analyzer, never inferred by it.

### Section Analyzer — the one judgment agent (spec §5–§8)
- **D-11 (belief delimitation):** one section = one belief installed/reinforced at one point. The
  Cleaner marks structure (dumb, no belief boundaries); the **Analyzer** segments by belief-job
  (judgment). A belief installed in §1 and reinforced in §4 = TWO records, same `belief_id`, different
  `position`.
- **D-12 (`position` = funnel-level ordinal):** 1st/2nd/3rd belief-instance encountered across the
  whole funnel — NOT "section 3 of the page." Birdseye aligns funnels by belief sequence and cannot if
  position is page-local. Known failure point — get it right.
- **D-13 (belief taxonomy = open-with-anchors, spec §7):** classify against the 9 anchors
  (problem-exists / problem-matters / past-solutions-failed / mechanism-is-the-reason /
  product-delivers-transformation / trust-the-brand-or-founder / it-will-ship / it's-worth-the-price /
  act-now). Prefer an anchor; if none fits, propose a new `belief_id` with low `belief_confidence` for
  operator review. Anchors are the shelf; DEPTH lives in `execution_detail`, not in more anchors.
- **D-14 (descriptive-not-prescriptive, spec §8 — bake into the prompt):** the Analyzer records what
  proven funnels DO; never judges good/bad, never rewrites/optimizes copy, operates on ONE funnel at a
  time, NEVER reasons about "the pool"/consensus/divergence (that's birdseye). Force two internal
  passes: (1) record literal facts, (2) map to tags via rubric. `execution_detail` must be GRANULAR
  enough that the sub-claim is recoverable (sub-claims live inside execution detail, not a separate
  field — this is what lets birdseye separate healthy shared beliefs from saturated dead-ground claims).

### Controlled vocabulary (spec §9)
- **D-15 (Claude's call under one hard rule):** Kam does not care about specific tag values — the ONLY
  constraint is a single internally-consistent controlled vocab conforming to existing repo conventions,
  with **no two tags for the same thing**. Resolve `execution_type`, `proof_tier`, `claim_type`, `move`
  value lists from the six DR files + repo conventions. **No human ratification gate** (overrides spec
  §12's "~15-min ratification").

### Storage (spec §6 / capability_inventory S4)
- **D-16 (interim structured JSON, NOT vectors):** belief records + funnel fields land as structured
  JSON under `runs/<space>/funnels/` (one `funnel_package` + N belief records per funnel), shaped to be
  vectorizable later. S4 ≠ the RAG. Vectorization is JIT/downstream (PROJECT.md). Conform field names /
  tag formats / file naming to the Phase-1 repo conventions (`brands.json` / `space-map.json` / `ads/`).

### Crowdfunding sources (CORRECTED 2026-06-03)
- **D-19 (no Phase-1 bug; off-transformation container exemplars = open strategy call):** Phase-1
  Finder LANE 2 already pulls in-transformation crowdfunding (verified `step1-light-pass.md:250-254`),
  so a real S1 run yields crowdfunding *messaging* funnels natively — no fix needed. The ONLY gap is
  **off-transformation** crowdfunding projects harvested for their **container only** (`structure_only`,
  the "borrow the will-it-ship scaffolding even when the transformation is unrelated" idea). Nothing
  discovers those today, and it is NOT something Phase-1 was specced to do. **PENDING KAM'S CALL:**
  (a) skip off-transformation container exemplars for now (assembler still accepts hand-fed crowdfunding
  LPs), or (b) add a small off-transformation crowdfunding discovery lane later. Phase-3 builds the
  assembler to ACCEPT crowdfunding funnels regardless; discovery is out of scope here.

### Validation of the build (how "done" is judged)
- **D-17 (build + plumbing smoke test + temp analyzer verify):** build everything ready-to-run, then
  re-pull 1-2 real brands WITH the new `destination_url` field to prove ad→LP clustering → LP render →
  cleaner → scorer end-to-end on live data, AND run the Section Analyzer on one funnel **temporarily,
  just to verify it emits belief records** (throwaway — not a methodology deliverable). No market needed.
  The real methodology-debug pass (does the Analyzer tag beliefs the way Kam would) + the Phase-3
  debug-notes content wait for the real market.
- **D-18 (Phase-3 debug-notes artifact):** scaffold a `03-DEBUG-RUN-NOTES.md` (the
  `01-DEBUG-RUN-NOTES.md` analog) now; fill it on the first real deep-analysis run.

### Claude's Discretion
- Exact scraper/render/normalization/clustering implementation (D-04/D-06/D-08).
- The DR-file auto-injection hook mechanics for the Section Analyzer — how the 6 files are loaded /
  trimmed / ordered / cached / kept within context limits (spec §11 leaves this to the implementer).
- Controlled-vocab value lists (D-15), under the no-duplicate-tags rule.
- JSON schema serialization / file naming / store layout (conform to Phase-1 repo conventions).
- Model/cost tier per agent (mechanical bricks = cheap; Section Analyzer = the one that needs quality).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The build spec (MASTER for the build)
- The pasted **"Phase 2 Funnel Analysis — Build Specification (Collection Layer)"** — AUTHORITATIVE
  for what to build (unit of analysis, §2b binding, two currencies, one-prompt+routing-flag, belief
  taxonomy, record schema, DR-file assignments, scope state). **First planning task: save it verbatim
  to `prompts/_specs/funnel-analysis-collection-spec.md`** so downstream agents read it from disk.
- `prompts/_specs/deep-market-analysis-framework.md` — the prior prose framework. SUPERSEDED for the
  build by the collection spec; keep for the strategic "why" (two lenses / merge intent / channel-edge).

### Brick model + conventions to inherit (the standardization rule, spec §0)
- `capability_inventory.md` — the brick set (S1 fetch / S2 clean / S3 score / A2 classify / A3 extract /
  S4 store / H1 gate / D1 decide), the one-job-per-brick law, the A4≠D1 rule. The collection layer is a
  brick string; map each component to its brick.
- `CLAUDE.md` (project) — agent-design rules (deterministic = script/hook, judgment = agent).
- `definitions.md` — vocabulary; the transformation definition the router keys off (D-10).
- `prompts/step1-light-pass.md` — Phase-1 build; the cleanest existing pattern for agent separation +
  the format template. Inherit its JSON/output conventions (the §0 standardization rule).

### Upstream input contract (what the collection layer CONSUMES)
- The PMF-stage (S1/S2) output — `brands.json` / `space-map.json` / `ads/<brand>.json` /
  `runs/<space>/market-selection.md`. Supplies `competitor / source_type / transformation / niche`
  per funnel. **NOTE the seam:** S2 ranks cells, it does NOT emit a per-competitor funnel list with
  `routing_flag` assigned — the router (D-10) derives `routing_flag`; transformation/niche come from
  the chosen-cell context. `runs/arduview/*` is the only real run data (in-transformation only; no
  crowdfunding structure-sources yet — see 01-DEBUG-RUN-NOTES.md gap 6).

### Existing tooling to EXTEND (verified shapes)
- `tools/adlib-one.js` — Meta Ad Library pull; emits `{library_id,start_date,end_date,run_length_days,text}`.
  MISSING `destination_url / impression_bucket / cta_text / headline / platforms` (D-06). Extend.
- `tools/crowdfund-fetch.js` — SPA/Cloudflare render; dumps HTML/text, does NOT parse raise/backer
  stats (D-07). Add Currency-B parser; reuse render skeleton for crowdfunding LP bodies.
- `tools/fetch.js` — existing Playwright fetch pattern; reuse for LP render (D-08).

### DR marketing knowledge — AUTO-INJECTED into the Section Analyzer at runtime (spec §11, all verified present)
- `~/knowledge/dr-marketing/persuasion--carl-weische.md` — 6 cold-offer persuasion elements + objection→element map (execution_type, anchors 6–9).
- `~/knowledge/dr-marketing/funnel-architecture--carl-weische.md` — funnel types, V-shape awareness, pre-sale 4-part, 8-step advertorial, six-section sales page (funnel_sequence, awareness_entry, anchors 1–5 install order).
- `~/knowledge/dr-marketing/vssl--carl-weische.md` — 8-stage VSL narrative; "product not named in first 50%" awareness logic (story-epiphany / authority execution types).
- `~/knowledge/dr-marketing/differentiator-framework__2_.md` — four levers, claim-typing, believability tiers (claim_type, proof_tier, move angle-lever tags).
- `~/knowledge/dr-marketing/consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md` — perceived value + trusted-source heuristic (trust/proof classification).
- `~/knowledge/dr-marketing/offer-construction--carl-weische.md` — offer/commitment-hook construction (offer_mechanic, urgency_construction).
- Optional (inject only if testing shows a gap): `advertorial--carl-weische.md`, `landing-pages--carl-weische.md`, `consumer-psychology--carl-weische.md`. **Do NOT inject all DR files** — conflicting vocab + context bloat degrades classification.
- **Bake-vs-inject rule (§11):** mechanical bricks get NO DR. Router + every non-Analyzer agent: the
  orchestrator BAKES distilled logic into the prompt (no raw DR docs at runtime). The Section Analyzer
  is the ONE exception — a hook auto-injects the 6 files into its context each run.

### Phase-1 crowdfunding sourcing (CORRECTED — no bug)
- `prompts/step1-light-pass.md:250-254` (LANE 2) — Phase-1 Finder ALREADY searches KS/Indiegogo/
  Makuake/BackerKit for in-category campaigns + captures raise/backer/%-funded/status. In-transformation
  crowdfunding is covered. Only off-transformation container exemplars are uncovered (D-19, open call).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tools/adlib-one.js` — ad-pull skeleton (advertiser resolve + per-ad loop). Extend to capture the binding key + new fields (D-06).
- `tools/crowdfund-fetch.js` — SPA/Cloudflare render skeleton. Reuse for crowdfunding LP bodies; add Currency-B parser (D-07).
- `tools/fetch.js` — Playwright fetch pattern; reuse for destination-LP render (D-08).
- `prompts/step1-light-pass.md` — the brick-composition + JSON-output template to mirror (Finder/Verifier/Dumper/Classifier split ≈ Scraper/Cleaner/Scorer/Analyzer split).

### Established Patterns
- Brick model: deterministic = scripts (Scraper/Cleaner/Scorer/Store), judgment = agents (Router, Section Analyzer). Hooks gate. Mirrors Phase 1 exactly.
- Output = structured JSON per record, source-metadata preserved (author/url/timestamp/engagement) — the same pass-through discipline as the VOC bricks.
- "First run is a debug pass to break the methodology" (run-retrospective / 01-DEBUG-RUN-NOTES) — applies to the eventual real run, deferred until a market exists (D-02/D-17).

### Integration Points
- INPUT: PMF-stage output (`brands.json` / `space-map.json` / `ads/` / `market-selection.md`) + a chosen-market parameter + (hand-fed) crowdfunding LP list.
- OUTPUT: `runs/<space>/funnels/` JSON store — the birdseye agent (later phase) and the vector RAG (downstream) both read from here.

</code_context>

<specifics>
## Specific Ideas

- The copywriter-RAG end state (downstream, NOT this phase): ingest funnel records into vectors → a
  *funnel writer* assembles the proven belief-spine into a draft → a *copywriter* re-voices it in VOC
  language from the Step-3 copy bank. Phase 3's only obligation: records granular + verbatim-preserving
  enough to vectorize cleanly. The spec's §10 birdseye-completeness check guarantees this.
- "Make the analysis temp just to verify it did it" (D-17) — the smoke-test Analyzer run is a
  throwaway correctness check on the plumbing, not a deliverable; discard its output.

</specifics>

<deferred>
## Deferred Ideas

- **Birdseye synthesis agent** (A4→D1): merge / spine+divergences / dead-ground+whitespace / awareness
  calibration / Gate 2 win-decision — own later phase. Add to roadmap when planning Phase 3.
- **Off-transformation crowdfunding container-exemplar sourcing** (`structure_only`) — open strategy call
  (D-19), not a Phase-1 bug. In-transformation crowdfunding is already sourced by S1 LANE 2 (Arduview dump
  has 2: gameshell = strong, skeleton-key = thin). Assembler accepts hand-fed crowdfunding LPs regardless.
- **Vector-DB / RAG ingestion + funnel-writer + copywriter** — downstream Step-4 machinery.
- **Pre-Phase-2 plan template** (per-market routing flags / feature watchlist / awareness target / price decision) — separate artifact.
- **Full review-mining / VOC** — Track B (M1-S4+); on-page reviews captured here as `review_language` only.
- **Word-choice / copy-quality analysis** — different altitude; mined later from the verbatim corpus.

</deferred>

---

*Phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy*
*Context gathered: 2026-06-03*
