# RETRIEVAL-FAILURES — Arduview run forensic

**What this is:** the per-step map of what the agents tried to retrieve/populate vs. what actually came back BLANK in the Arduview outputs, with each blank classified by root cause. Built by cross-checking the as-ran index (`pmf3/build-base/reference/as-ran-repo/asran-repo-report.md`) against the LIVE artifacts in `runs/arduview/` — every claim verified against the actual file, not the report.

**The split that matters (operator's frame):** *you* specify what to retrieve; *the system* retrieves it. This doc isolates the blanks that were **retrieval/wiring failures** (the system's job — fixable) from blanks that were **genuinely absent data** or **un-built capability / unmade operator decisions** (not a wiring fix).

**Root-cause codes:**
- `WIRING-RETRIEVAL` — a fetch/scrape that should have returned data returned nothing (broken selector, deferred-XHR, stale URL).
- `WIRING-DISCARD` — data WAS produced upstream, then dropped by a script bug before the output.
- `WIRING-GATE-OFF` — a validator/assembler that was built but never wired, or was bypassed at run time.
- `WIRING-GAP` — the field needed retrieval/plumbing but no retriever or carry-path was ever built.
- `DATA-ABSENT` — the data genuinely did not exist in the wild.
- `BUILD-ABSENT` / `MARKETING-JUDGMENT` — a whole stage was never built, or the blank is an unmade operator decision. Not a wiring fix.

---

## HEADLINE

Of the blanks across the run, the damage concentrates in **five wiring failures** (the system's job), not in missing data:

| # | Wiring failure | Scope | Code | Status |
|---|---|---|---|---|
| 1 | **Google Trends never parsed** → `demand_trend.shape="unknown"` | 20/20 brands | WIRING-RETRIEVAL | OPEN |
| 2 | **Meta Ad Library never ran** → `bound_ads:[]`, `qualifying_creatives=0` | all 20 brands / all cells | WIRING-RETRIEVAL | OPEN |
| 3 | **funnel-store discarded 6a fields** → `primary_claim` etc. null | 6 fields × 4 funnels = 24 values | WIRING-DISCARD | **FIXED `bbff2ff` — needs re-run** |
| 4 | **validate-analyzer never gated** → `belief_kind` absent, `execution_type`/`moves` off-enum | 43 belief records | WIRING-GATE-OFF | enum FIXED `35581d4`; wiring OPEN |
| 5 | **transformation/niche/routing_flag never plumbed** into the package | 4 funnels → cascades to 43 index records | WIRING-GAP | OPEN |

The two BIGGEST structural holes — **no VOC** and **no spend-validation lift** — are *not* wiring breaks; they are stages that were never built (see "Not a wiring fix").

---

## WIRING-CAUSED BLANKS (the system's job — fixable)

| Stage / retriever | Field requested | What came back | Code | Evidence | Fix |
|---|---|---|---|---|---|
| `fetch.js` Trends | `demand_trend.shape/window/source/basis` | `"unknown"`/null — **20/20** | WIRING-RETRIEVAL | `brands.json` all 20; `space-map.json per_brand[]` carries it forward | intercept the deferred XHR (`page.on('response')` / Trends API), not regex the initial HTML. `#trends-0pct-fill` |
| `adlib-one.js` Meta ads | per-brand ad set → `bound_ads`, `anti_fluke.qualifying_creatives` | **never ran** — no `ads/` dir, `bound_ads:[]` all 4 funnels, `qualifying_creatives=0` all 6 cells | WIRING-RETRIEVAL | `funnels-assembled/*.json bound_ads:[]`; selectors `TODO(D-17)` uncalibrated. Brands with `ads_flag=yes` (Flipper 53 ads/238-day run, Nothing, Anbernic, Divoom) had real ads → not data-absent | live-DOM calibration of selectors, then run for `ads_flag=yes` brands + re-assemble. `#adlib-selectors` |
| `funnel-store.js` | 6a: `primary_claim, claim_type, awareness_entry, funnel_sequence, offer_mechanic, urgency_construction` | `null` — **all 4 funnels**; but all 6 are POPULATED in `funnels-analyzer-out/*-beliefs.json` `funnel_fields{}` | WIRING-DISCARD | proved: divoom analyzer-out had the 6 keys; stored `funnels/divoom-79bf5e01.json` has them null. `urgency_construction` "none"→null = signal collapse | **already fixed (`bbff2ff`)** — just re-run `funnel-store.js` against existing analyzer-out. Zero re-analysis cost |
| Section Analyzer + `validate-analyzer.js` | `belief_kind` (req'd), `execution_type` (13-enum), `moves[]` (15-enum) | `belief_kind` absent in all 43; `execution_type`/`moves` are freeform prose in all 43 | WIRING-GATE-OFF | validator absent from `route.js`, doesn't fire in subagents, context-assembler bypassed (P15-A3); `_tally.json` = 41 unique move strings count=1 → cross-funnel aggregation dead | wire `validate-analyzer.js` as an explicit orchestrator step; add the closed enums + `belief_kind` to the analyzer spawn prompt; re-run 4 funnels; rebuild `_tally.json`. enum part FIXED `35581d4` |
| Orchestrator → package | `transformation`, `niche`, `routing_flag` on the funnel_package | `null`/`KEY-MISSING` all 4; Router PRODUCED `routing_flag` but it was never persisted | WIRING-GAP | `funnels-scored/gameshell-*.json` shows `KEY-MISSING`; `_index.json routing_flag` null all 43 → RAG prefilter inoperative | pass `--transformation/--niche` + persist Router output into the package before score/store; rebuild index |
| `funnel-clean.js` | LP sub-page copy | stored **404 boilerplate as real content** — gameshell 8/10, playdate 8/10 sub-pages (191–199 b "404 Error") | WIRING-RETRIEVAL/DISCARD | `corpus/*/clean/*.md` 404 bodies | add an HTTP-status / 404-text gate before clean+store |
| `revenue-est.js` | `revenue_est.value_usd_monthly/method/confidence` | `null` — 20/20 (no `monthly_visits` feed) | WIRING-GAP | `brands.json` all 20 `monthly_visits:null` | wire a traffic source (SimilarWeb/Ahrefs/operator-fill) before the script runs |
| `crowdfund-fetch.js` | GameShell KS stats | 404 (delisted URL) + Wayback blocked + wrong Wayback URL format | WIRING-RETRIEVAL | `crowdfunding/gameshell*/raw/*` 329–1071 b error pages. (The $350K/2300-backer B stats in `funnels-scored/gameshell` were recovered by hand, not by the fetcher) | use KS GraphQL (`api.kickstarter.com/v1/projects/by_url`) or CDX API for a real snapshot |
| `space-map` aggregation | `combos[].anti_fluke.qualifying_creatives` | `0` — all 6 cells | WIRING-GAP | even where ad data existed (Flipper), no script lifted `ads[].run_length_days` into the cell | build a pre-classifier aggregator: read `ads/<slug>.json[].run_length_days`, apply ≥7-day floor, write counts |
| Space Classifier | `per_brand[].sophistication` | present but a prose STRING, not the int/enum Gate 3 needs | WIRING-DISCARD (mis-grain) | `space-map.json per_brand[]` | normalize to `{stage:int, description}`; validator enforces the int |

**Free wins (code already fixed, data just stale — re-run, no new code):**
- `funnel-store.js` 6a discard → re-run against `funnels-analyzer-out/` (restores 24 values + the architect's structural reads).
- `belief_kind` enum (`35581d4`) → re-run analyzer with updated prompt.
- `_index.json` staleness → rebuild after store fix.

---

## NOT A WIRING FIX (don't put these on the hardening punch-list)

| Blank | Code | Why it's not retrieval |
|---|---|---|
| `enhanced_claim_count=0`, only `direct`+`enlarged` claim types | DATA-ABSENT | true Stage 1–2 market — no competitor used enhanced/mechanism claims. Accurate extraction. |
| `validation_lane:["unknown"]` for divoom/playdate/pocket-operator | DATA-ABSENT (mostly) | 3 DTC brands genuinely run no Meta ads. (Can only be fully confirmed once adlib #2 is fixed and run.) |
| skeleton-key / meowbit / miyoo thin/empty corpus | DATA-ABSENT | brands genuinely offline (404 / conn-refused). Low priority — filtered out of the chosen cell. |
| asset gaps: `hero_loop`, `feature_demo`, `offer`, `whats_in_box` (0 ad-ready) | DATA-ABSENT | no asset exists — needs a reshoot, not a retriever. |
| `starting_point.transformation/niche` null | MARKETING-JUDGMENT | by design — operator fills after the NTP pick. |
| **No VOC** — belief chain on asserted transformation, not buyer language | **BUILD-ABSENT** | Step 3 VOC pipeline (Reddit→Bucketer→Ladderer→Language) was never built. Spec exists (`handoff-step3-voc-build.md`); no code. **This is the single largest hole and no wiring fix touches it.** |
| **No spend-validation economics** in copy/architect | BUILD-ABSENT + WIRING-GAP | compound: no comparable-seed ad-longevity lift (#qualifying_creatives gap) AND no VOC. |
| `source_routing` ghost field | MARKETING-JUDGMENT | contract-gated: operator must define the category vocab first (`enums.json`). |

---

## HANDOFF TO THE HARDENING SESSION

Order by leverage (lead with free re-runs, then code fixes, then builds):

1. **Re-run, no code** (recovers 24+43 values for free): `funnel-store.js` (6a discard, `bbff2ff`) → rebuild `_index.json` → re-run analyzer for `belief_kind` (`35581d4`).
2. **Code fixes** (the OPEN wiring blanks, blast-radius order): Trends XHR → adlib selector calibration → analyzer-validator wiring + enum-in-prompt → transformation/niche/routing_flag plumbing → 404-content gate → qualifying_creatives aggregator → revenue visits-feed → KS GraphQL fallback → sophistication normalization.
3. **Not for hardening** (escalate as new builds, not retrieval fixes): Step 3 VOC pipeline; spend-validation lift; `source_routing` vocab; asset reshoots.

Cross-ref: bug-level detail in [ERROR-NOTES.md](ERROR-NOTES.md); fix milestone scaffold in [HARDENING.md](HARDENING.md). Evidence root: `runs/arduview/` (live) + the as-ran index at `pmf3/build-base/reference/as-ran-repo/`.
