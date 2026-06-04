# 01-05 Debug Run Notes — Light Pass Reference Run

> First run on a space is a DEBUG PASS to break the methodology, not produce a deliverable (D-01).
> Surfacing gaps IS the deliverable. Record every break; do not over-build to pre-empt gaps that
> haven't appeared.

## Task 1 — Reference seed (DECISION CHECKPOINT: locked)

- **Seed (operator's pick, not from the three plan defaults):** **Arduview** — a fully transparent
  pocket game console. See-through OLED (game pixels on a transparent glass pane), transparent shell +
  PCB. Arduboy-based: ATmega32U4 + data-capable USB-C → genuinely Arduino-IDE-flashable/hackable;
  W25Q128 holds 400 preloaded games. ~50g, 2.42" 128×64 OLED, ~2hr battery.
- **Finder seed shape:** product = "Arduview" (transparent pocket game console), category seeded across
  the candidate territories below.
- **NOT** the quarantined eink-tablets / InkLeaf run.
- **Brief that travels with the run:** `runs/arduview/pre-research-plan.md` (prose bet_brief + fenced
  PIPELINE INPUTS block). Passed to fetch via `--brief=runs/arduview/pre-research-plan.md`.

### Run config locked at run-start (from the brief)
- **bet (transformation OPEN):** novel/flashy/rare-hardware-as-headline wins in the maker/DIY niche —
  competitors reveal the transformation; it is an OUTPUT.
- **Candidate territories (Finder net spans all + may nominate an unanticipated cluster):** aesthetic/
  object-as-statement, retro-gaming nostalgia, EDC/pocket-carry, learn-to-code/STEM, plus the maker slice.
- **LP-hunt queries (rich):** retro-handheld · transparent/clear-shell gadget · maker/open-hardware ·
  EDC/pocket-carry · novelty-tech/collectible · gift · learn-to-code/STEM.
- **LP-hunt paths (lean):** /products/ /collections/ /shop/ /store /hackable /open-source /sdk /docs
  /pages/ (generic commerce + maker-specific; deliberately NOT the InkLeaf buyer-transformation paths).
- **Comparable-bet seeds (guaranteed-in, TAGGED bet-evidence not saturation-evidence):** Nothing Phone,
  Flipper Zero, Arduboy + clones, exotic-display/transparent-electronics gadgets, clear-shell retro
  handhelds, maker crowdfunding (Crowd Supply / Kickstarter / Indiegogo). Their scale proves the bet won
  durably; it MUST NOT inflate any maker-niche saturation cell (same discipline as dead-brand exclusion).
- **Trend source:** Google Trends per brand/category, ~5yr, ON. Durability is the load-bearing signal
  (novelty-tech → fad-death is risk #1). An empty durability column is a quiet failure.

## Task 2 — Pipeline run + self-audit

Run date: 2026-06-03. Seed: Arduview (transparent pocket game console, Arduboy-based).

### Pipeline stages completed

| Stage | Status | Notes |
|-------|--------|-------|
| FINDER (Agent 1) | PASS | 21 brands found → 20 after dedupe (arduboy/arduboy-fx same domain). Roster Verifier: merged panic-playdate dupe URL, added Divoom (gap), flagged pwnagotchi (community project, no DTC store). All 5 seeded comparable-bet brands present (arduboy, flipper-zero, nothing-phone, skeleton-key, plus crowd-supply territory covered). |
| FINDER hook | PASS | validate-finder.js — all brands pass channel/lane enum + url + sells_observed checks. |
| SCRIPTS: dedupe | PASS | 21 → 20 brands (arduboy-fx merged into arduboy; same domain). |
| SCRIPTS: fetch.js | PARTIAL | 14/20 brands fetched in first pass (600s timeout). 5 remaining fetched manually. 1 failure: miyoo.com ERR_CONNECTION_REFUSED (site offline). LP-hunt paths from brief PIPELINE INPUTS loaded correctly. |
| SCRIPTS: clean.js | PASS | 19 slug dirs cleaned (miyoo has no corpus). All clean/*.md files written. |
| SCRIPTS: adlib-one.js | PASS | flipper-zero: 48 active ads, 117 total structured ads. nothing-phone: 0. anbernic: 0. divoom: 0. Active + stopped-ad pass ran for flipper-zero. |
| SCRIPTS: revenue-est.js | PASS | All 20 brands processed. 0 traffic_formula, 0 review_proxy, 20 null (no monthly_visits available — no Semrush API wired). NEVER-FABRICATE held: no PENDING, all null with method:null. validate-revenue hook: PASS. |
| DUMPER (Agent 2 × 20) | PASS | All 20 dump.json files written and validate-dumper hook passed. 3 page failures: miyoo.com (ERR_CONNECTION_REFUSED), skeleton-key Crowd Supply (404), meowbit product page (404). These are logged as blocked-page failures; creatives[] = [] or []. |
| DUMPER hook | PASS (with fixes) | 3 hook rejects during dumper phase — all fixed before passing: (1) arduboy: claim "300+ Games pre-installed titles by members of the Community" not verbatim → corrected to "300+ Games"; (2) playdate: claim with non-standard whitespace around crank text → removed; (3) pico-8: "PICO-8 is a fantasy console" paraphrased → corrected to exact text with double-spaces. |
| CLASSIFIER (Agent 3) | PASS | space-map.json written. validate-classifier hook: PASS. |
| Automated verify | PASS | test -f brands.json && test -f space-map.json && node -e check → OK |

### Hooks fired / rejected

**validate-finder.js:** PASS on first write.

**validate-revenue.js:** PASS on first write after revenue-est.js ran.

**validate-dumper.js — 3 rejects caught and fixed:**

1. `arduboy/dump.json`: "300+ Games pre-installed titles by members of the Community" not verbatim. Fixed → "300+ Games" (exact text from clean corpus).
2. `playdate/dump.json`: crank claim had non-standard whitespace from HTML rendering. Fixed → removed the claim from claims[] (it's a mechanism, not an outcome claim anyway).
3. `pico-8/dump.json`: "PICO-8 is a fantasy console" paraphrased the HTML-rendered text `PICO-8 is a  fantasy console  for making, sharing and playing tiny games and`. Fixed → exact verbatim text with double-spaces.

**validate-classifier.js:** PASS on first write.

### Hook-detected layer conflation / pooling fixes

None surfaced by hook — classifier passed first time. Manual self-audit below confirmed no layer conflation in the written space-map.

### D-01 Debug breaks surfaced

**BREAK 1 (CRITICAL): demand_trend fill-rate = 0% (20/20 brands return `unknown`)**

The `extractTrendSeries()` function in `fetch.js` uses three regex patterns to find `timelineData` in the Trends page HTML. Google Trends now loads the interest-over-time series via a deferred XHR/API call — the data is NOT embedded in the initial page HTML. The 3-second wait + networkidle was insufficient for the XHR to complete and the response to be injected into the DOM. All 20 brands returned `shape: unknown`.

**Impact:** This is the most load-bearing anti-fad signal for the Arduview novelty-tech bet. A 0% fill-rate means the fad-death check is completely disabled for this run. The space-map.json is structurally complete and correct, but the durability signal — which is explicitly the #1 signal the operator needs — is missing.

**Fix needed:** `fetch.js` Google Trends implementation needs to be updated to either:
- (a) Intercept the XHR network response (Playwright request interception on `*/explore/graph*` or `*/widgetdata*` endpoint)
- (b) Increase wait time and verify the widget DOM element is present before extraction
- (c) Use the unofficial Trends API directly instead of scraping the rendered page

**BREAK 2 (MINOR): fetch.js 600s timeout**

The full 20-brand fetch with Google Trends runs too long (>600s) in a single pass. Brands 15-20 were not reached. Workaround: ran a second targeted fetch for the missing 5 brands. Root cause: 20 brands × (homepage + 9 LP paths + Trends) × ~10s average = ~200s minimum; actual was much longer due to Trends wait timeouts. Fix: parallelize brand fetches, or run Trends as a separate post-fetch pass.

**BREAK 3 (MINOR): miyoo.com offline**

miyoo.com returned ERR_CONNECTION_REFUSED. Brand retained per D-06 (flag-don't-drop). Status updated to `defunct/EOL/delisted`, market_presence to `region-only`. No DTC presence; primarily Amazon/AliExpress marketplace. Excluded from saturation counts per D-08.

**BREAK 4 (MINOR): 3 pages returned 404**

- `skeleton-key` (Crowd Supply project page): 404. Campaign likely ended.
- `meowbit` (KittenBot product URL): 404. Product page moved or discontinued.
- These brands retained in brands.json (D-06); dump.json reflects empty creatives.

**BREAK 5 (STRUCTURAL): `mechanisms_in_play` recorded per-pitch but never aggregated to `space-map.json`**

> **✅ RESOLVED (2026-06-03).** `space-map.json` now carries `mechanisms_in_play[]` — top-level
> space-wide catalog `{canonical, raw_variants[], brand_count, ownability}` + per-combo cell-scoped
> `combos[].mechanisms_in_play[]` `{canonical, brand_count, ownability, brands[]}`. Built per the brick
> law: the classifier agent canonicalizes `mechanism[]` (judgment); `tools/aggregate-mechanisms-in-play.js`
> counts distinct brands + computes ownability (shared ≥3 / unique ≤2, cell-scoped) + writes (deterministic,
> additive — verified byte-identical to HEAD on all other fields). Schema + step 6 added to
> `prompts/step1-light-pass.md`; traceability/ownability rule added to `tools/hooks/validate-classifier.js`.
> Stopgap (`mechanisms-in-play-stopgap.md`) RETIRED; the market-selection gate now reads the field directly
> (no corpus derivation, no `[INFERENCE]`). Implemented as a standalone S1 touch-up rather than folded into
> the BREAK 1 Trends fix.

Surfaced during Phase 2 (M1-S2 market-selection-gate) discuss — the assessor's input contract expects a
mechanisms-in-play list (which mechanisms competitors lead with, and whether each is **shared** = 3+ brands
tell it → not ownable, or **unique** = 1 brand → candidate UM). It feeds **Gate 2.2** ("is your UM
differentiated?") and **Gate 3.3-S3** ("is your mechanism already claimed by a competitor?"). S1 does **not**
emit such a field — but the raw material **was collected** and the clustering **was instructed**; only the
output slot is missing. Recorded-but-not-logged.

**Data state confirmed (2026-06-03, across all 20 dumps):**
- `creatives[].pitches[].mechanism[]` — present on **36/36 pitches, non-empty on 30/36**. Rich. (e.g.
  analogue-pocket "engineered in two FPGAs / no emulation"; flipper-zero "combine all the hardware tools…";
  pocket-operator "components under the LCD, no outer case".)
- `creatives[].pitches[].problem_um_raw[]` — present on 36/36, **non-empty on only 6/36**. Sparse **by
  design**: gadget/maker pages don't run pain-causal "here's why you suffer" stories. For this product class
  `mechanism[]` is the usable signal, NOT `problem_um_raw`.
- Classifier prompt **step 6** already instructs the shared-vs-unique cluster (3+ = SHARED/not-ownable, 1 =
  candidate Problem-UM) — but `space-map.json` has no array to write it into, so the aggregate was never
  produced.

**Impact:** **no re-fetch / no re-scrape / no new research** — purely a schema + aggregation gap. The raw
mechanism strings sit in the 20 `dump.json` files; the deliverable just never rolled them up. Until fixed,
the Phase-2 gate has no clean mechanisms-in-play input (handled short-term by `mechanisms-in-play-stopgap.md`
— derive on the fly + `[INFERENCE]` label; see that doc).

**Fix needed (the real structural fix):**
1. **Add a canonical cluster array to `space-map.json` — `mechanisms_in_play[]`**, same shape as the existing
   `bet_types[]` / `transformations[]` arrays: each `{ canonical, raw_variants[], brand_count,
   ownability: "shared" | "unique" }` where `shared` = 3+ distinct LIVE in-geo brands lead the same
   mechanism (not ownable), `unique` = exactly 1 (candidate UM).
2. **Source = `mechanism[]`** (the rich 30/36 field), **not** `problem_um_raw` (sparse). Keep the
   `problem_um_raw` shared/unique read as a SEPARATE secondary cluster only when non-empty — never fold a
   pain-causal story and a how-it-works mechanism into one cluster. Empty `problem_um_raw` for maker/gadget
   spaces is expected, not a gap.
3. **Per-cell scoping:** like saturation, the "already-claimed?" question is asked inside a combo cell
   (transformation × niche) — a mechanism shared in a *different* cell doesn't make it taken here. Emit both
   the space-wide canonical list (the `bet_types[]` pattern) AND per-combo presence so Gate 3.3-S3 can check
   "is this mechanism in THIS cell's set?". Exclude `comparable_bet_seed` + dead/region-only brands from the
   counts (same discipline as saturation, D-08).
4. **Hook:** `validate-classifier.js` gains one rule — each `mechanisms_in_play[]` canonical must trace to
   ≥1 real per-pitch `mechanism[]` read (same traceability as `bet_type`, D-12/D-14); `ownability` must be
   consistent with `brand_count`. Open categorization, traceability-checked, never enum-checked.
5. **Brick law:** canonicalize near-duplicates = Classifier (judgment); count distinct brands = the
   aggregation script. Exactly parallel to how `bet_types[]` / `transformations[]` are already produced —
   an additive array, not a new agent.

**Scope:** ~one-plan S1 touch-up (Classifier output-schema addition + one hook rule + re-aggregate). No new
collection. **Folds into the same S1 revision as BREAK 1** (Trends fix) — both are "the data/instruction
exists, the output slot/source is broken."

### Self-audit: structural checks

**Saturation keyed per combo cell (transformation × niche)?**
YES — all 6 combos in saturation[] carry both `transformation` and `niche`. No pooled counts. Automated verify passed.

**No layer conflation (feature ≠ claim, mechanism ≠ transformation)?**
YES — audited:
- Flipper Zero: "Sub-1 GHz transceiver (CC1101)", "NFC module (13.56 MHz)" etc. → correctly placed in `mechanism[]`, NOT in `claims[]`.
- Analogue Pocket: "Completely engineered in *two FPGAs" → placed in `mechanism[]` alongside outcome claim "No emulation." — NOT typed as a standalone claim. Correct.
- Pocket Operator: "single multiple-layer circuit board" → in mechanism[]. "a wall of sound in your pocket" → direct claim. Correct.
- Nothing Phone: transparent back / Glyph lights → placed in `mechanism[]` only; no verbal outcome claims present in homepage copy. Correct — feature is NOT promoted to a claim.
- Playdate: crank → mechanism. "familiar, but unlike anything you've ever seen" → direct claim. Correct.
- "paper-like feel" type lines: not present in this space (hardware gadgets, not e-ink/writing devices). Feature-trap test not triggered.

**Revenue: no PENDING, every method + confidence present?**
YES — 20/20 brands have `revenue_est.method: null` (null, not PENDING). All nulls with explicit `"notes": "monthly_visits null and no review proxy available — explicit null, not PENDING"`. Never-fabricate held.

**Awareness field in any dump.json?**
NO — grep -rl '"awareness"' corpus/*/dump.json → zero hits. D-05 held.

**Comparable-bet seeds excluded from saturation?**
YES — arduboy, flipper-zero, nothing-phone, skeleton-key all tagged `comparable_bet_seed: true` in brands.json and in per_brand[]. Their brands are NOT counted in any saturation[] brand_count. They appear in per_brand[] with bet_type populated but are excluded from combo brand_counts.

**demand_trend fill-rate:**
0% (0/20 real shapes). All `unknown`. This is the quiet-failure field — explicitly flagged. See BREAK 1 above.

**Seeded comparables present in pool?**
YES: arduboy (merged with arduboy-fx), flipper-zero, nothing-phone, skeleton-key all in brands.json. Crowd Supply / Kickstarter / Indiegogo territory covered via skeleton-key + gameshell.

### Verdict

**gaps-to-fold:**
1. **(Critical)** demand_trend Google Trends extraction broken — 0% fill-rate. fetch.js needs XHR interception or API approach to get the trend series. This is the single biggest gap: the durability check is disabled.
2. **(Minor)** fetch.js batch timeout — needs parallelization or separate Trends pass.
3. **(Minor)** miyoo.com offline, skeleton-key 404, meowbit 404 — noted, brands retained.
4. **(Minor)** Pimoroni, SparkFun, Adafruit pages yielded only catalog copy with no verbal transformation claims — these are ecosystem-store brands where the homepage doesn't carry marketing claims. The dump correctly returns empty claims[]. Not a pipeline bug; is a genuine signal (these brands don't make transformation promises, they sell components).
5. **(Structural)** `mechanisms_in_play[]` never aggregated to space-map.json — Classifier records `mechanism[]` per pitch (30/36 non-empty) and step 6 instructs the shared-vs-unique cluster, but there's no output slot, so the aggregate is absent. Phase-2 gate needs it (Gate 2.2 / 3.3-S3). Source = `mechanism[]` (rich), NOT `problem_um_raw` (sparse, 6/36, correct-for-space). Add a canonical cluster array (the `bet_types[]` pattern) + per-combo presence + a hook trace rule. No re-fetch — schema + re-aggregate only. Folds into the same S1 revision as gap 1. See BREAK 5.

## Task 3 — Kam's bucketed-sample verdict (HUMAN-VERIFY CHECKPOINT)

> Kam scans space-map.json + a 2-3 brand dump.json sample. Records: confirmed, or specific
> mis-assignments to fold (creative + field + Kam's call).

_(pending Kam)_

## Verdict

_(clean | gaps-to-fold — pending)_
