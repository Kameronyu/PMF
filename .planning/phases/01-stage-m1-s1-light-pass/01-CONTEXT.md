# Phase 1: Stage M1-S1 — Light pass - Context

**Gathered:** 2026-06-03
**Status:** Ready for planning

<domain>
## Phase Boundary

Phase 1 is the **collector half** of the research engine:

```
Finder → Roster Verifier → [fetch.js / clean.js / dedupe.js / revenue-est.js] → Dumper → Space Classifier
```

It finds competitor brands and emits **correctly-labeled** structured signal — `brands.json` + `dump.json` + `space-map.json` — that the Phase 2 market-selection skill consumes. **It LABELS, never DECIDES** (demand / whitespace / differentiation / survivor selection is Phase 2's assessor).

**Scope ends at a clean structured research run.** Out of scope this phase:
- The Phase 2 market-selection **skill** (the gate/decision) — separate build session.
- **Nicely-formatted deliverable output / templating** (M1-S12) — separate build session. Phase 1 stops at clean structured JSON.

**This session's job:** get the light pass running as fully-built prompts producing correct structured output, then hand off to `/gsd-plan-phase 1` → build. (The skill gets built in a parallel session while the light pass runs.)
</domain>

<decisions>
## Implementation Decisions

### Approach — touch-up, not rewrite
- **D-01:** The existing `prompts/step1-light-pass.md` already fixes the InkLeaf **structural** failures (per-cell saturation not pooled, claim≠feature, layer discipline with worked examples, problem-mechanism-vs-unique-UM as the classifier's call). Reconcile the master into **one runnable prompt** + the surgical inlines below, then **run on a reference space as a debug pass** (per `run-retrospective.md`: "first run on a space is a debug pass to break the methodology, not produce a deliverable"). Do NOT pre-load KB knowledge the run hasn't shown is needed.
- **D-02:** KB **decision-procedure** knowledge stays OUT of the Phase 1 collector agents — it belongs to the Phase 2 assessor skill (built separately). Phase 1 agents get only the **definitional/classification** knowledge needed to produce the spec'd output correctly. Same KB, different cut.

### Sophistication — the one load-bearing inline (Space Classifier)
- **D-03:** Inline a **mechanical sophistication-determination procedure** into the Space Classifier, derived from the `claim_type` distribution **per combo cell** (transformation × niche). The stage = the height of the most-saturated differentiation layer competitors already occupy, which = **the differentiation FLOOR you must clear to out-persuade them and win buyers** in that cell. Exact text to inline:

  ```
  SOPHISTICATION (per combo cell = transformation × niche)
  The stage = the height of the most-saturated differentiation layer competitors
  already occupy in this cell. It tells you the FLOOR you must clear to out-persuade
  them. Read it off the typed claims — do not eyeball it.

  Across all LIVE, in-geography brands in the cell, look at the claim_type distribution:
    - Stage 1 — barely anyone makes the base claim yet; transformation is fresh.
                (few brands, sparse `direct`) → floor: just state the claim.
    - Stage 2 — multiple brands make the base claim; `enlarged` claims appearing
                (quantified/specified/conditional: "in 14 days", "2x focus").
                → floor: a sharper/specified claim.
    - Stage 3 — `mechanism` claims present (outcome tied to a named how/why:
                "via retinol microspheres", "amber backlight"); a UM exists in the cell.
                → floor: your own mechanism/UM — a bare claim no longer competes.
    - Stage 4 — competing mechanisms + `enhanced` claims stacking mechanism+superlative
                ("the ONLY x clinically shown"); feature-level escalation.
                → floor: an alternative/better Feature-UM + angle.
    - Stage 5 — `enhanced`/extraordinary-identifier saturation: claims maxed, edge is now
                extraordinary identifiers (named authority, major press, proprietary UM
                competitors can't match) + angle + value model.
                → floor: extraordinary-tier trust + angle + copy excellence.

  Mechanical rule: stage = the highest claim_type tier that 2+ LIVE in-geo brands deploy
  in the cell. 5+ RULE: if 5+ live brands make the same base (`direct`) claim, that claim
  is discounted — cell is ≥Stage 2 and claim-saturated. Evidence line MUST cite the
  claim(s) + brand count that set the stage.
  ```

- **D-04:** Sophistication is **derived FROM the typed claims** — `claim_type` and the sophistication call are the same ladder. Hook-checkable: a stage call must be justified by the cell's `claim_type` distribution (reject an unjustified stage).

### Awareness — dropped from the light pass
- **D-05:** **DROP** per-creative `awareness` + `awareness_basis` from the light-pass Dumper. It never rolls into `space-map.json`, and a brand runs creatives across many awareness stages, so a per-creative tag is not decision-useful for the market-pick map — it's the InkLeaf "collected but not useful" failure. The real awareness read is a per-funnel Phase 2 deep-dive job.

### Data-point qualification — flag, don't drop; exclude from live counts
- **D-06:** Roster Verifier **flags** `status` (`live | defunct/EOL/delisted`) and `market_presence` (`in-geo | region-only`). **Flag, don't drop** — every captured brand stays in `brands.json`.
- **D-07:** Ad volume only counts as signal if **attributable to the target product**, not the whole brand (kills the InkLeaf "TCL TVs / Kindle e-reader line = 260/1100 ads" noise). Whole-brand-but-not-product ad counts are flagged non-attributable.
- **D-08 (the anti-noise rule):** Live saturation + demand counts in `space-map.json` count **only living, in-geography brands.** Dead and region-only brands are **listed but EXCLUDED** from per-cell saturation counts and the 2+/5+ sophistication thresholds. A dead brand's frozen old claims must never inflate a live saturation count — otherwise a wide-open territory (competitor left) reads as saturated. The raw signal Phase 2 needs for cause-of-death (creative `run_length_days`) is already captured per-creative; the post-mortem/channel-edge/angle-archive reads are Phase 2's lenses (see Deferred).

### Revenue + web traffic
- **D-09:** `revenue_est` is **collected and attached** to every brand (by `revenue-est.js`, deterministic arithmetic — no LLM computes revenue), **never a hard roster gate in Phase 1.** The $300–500K demand floor is the Phase 2 skill's call ("I need this product regardless; the gate is which is most promising on competitor revenue").
- **D-10:** Never ship a fabricated or empty traffic number as data. `revenue_est` always carries `method` + `confidence`; if `monthly_visits` is null → `method:"review_proxy"` (`confidence:"low"`) or explicit null — never "PENDING" shipped as if populated (the InkLeaf failure: SimilarWeb PENDING on all 31 records).
- **D-11:** Web traffic source = **Semrush Trends API** (returns `monthly_visits` per domain; documented REST endpoint; ±20–40% accuracy). Free tier ≈10 req/day per account → **use multiple logins/accounts** to clear batch volume. The **multi-login wiring is left to the implementer to figure out as they actually wire it up** — not fully specced here. Manual SimilarWeb free-tier paste = **fallback** (`visits_source:"similarweb-manual"`); add `visits_source:"semrush-api"`. No auto-browser SimilarWeb scraping (ToS / ban risk). SpyFu ($89/mo) noted as a secondary fallback only.

### Bet type — per-competitor, page-readable, OPEN field (Gate-2 input)
- **D-12 (AMENDED 2026-06-03 — was a closed enum, now OPEN):** Capture, **per competitor**, the structural **bet** it runs = what kind of differentiation it leads with (the SHAPE of competition in that territory). Page-readable — read off the competitor's own positioning/page, WITHOUT knowing the customer's true dream/desire. Purpose: a **Gate-2 (Stage M1-S2) input** telling the market-selection skill whether the bet under test (e.g. novel-hardware-as-lead) is a *live differentiating axis* in that territory.
  - **OPEN field `bet_type` — NOT a closed enum.** Superseded the original `competitive_axis` closed enum (`function-capability-price | visual-statement | community-openness`), which baked in one product domain's categories (the §4a over-reach). `bet_type` is now classifier-**named + clustered + evidence-traced**, exactly like `transformation` / `niche` / `angle` already work: the Classifier reads each competitor's lead and names the bet in the space's own terms, then unifies variants into canonical bet_types across all brands.
  - **Evidence required:** a `bet_type_basis` string quoting/citing the page signal the call is read off (same discipline as the D-03 sophistication evidence line — read it off the page, do not eyeball it).
  - **Populated for EVERY captured brand** (page-readable regardless of live/dead/region-only — consistent with D-06 flag-don't-drop). Per-brand descriptor, NOT a per-cell saturation count, so the D-08 live-status exclusion does NOT gate whether the field is populated.
  - **Executor = the CLASSIFIER (judgment), NOT the Dumper.** Lives in `space-map.json` `per_brand[]` (Classifier solely owns space-map.json). The Classifier also lists canonical `bet_types[]` with raw variants, same as `transformations[]`.
  - **Quality check (hook):** `tools/hooks/validate-classifier.js` rejects a brand with `bet_type` null/empty or with a missing/empty `bet_type_basis` — and rejects any canonical `bet_type` whose variants don't trace to real per-brand reads. It does **NOT** reject "off-enum" (there is no enum). This is the D-14 rule applied: open categorization, traceability-checked, never enum-checked.
  - *Naming note: `definitions.md` has no "bet"/"axis" term; `bet_type` is a new per-brand descriptor that does not collide with the differentiator-lever or sophistication vocabulary.*

### Structural feedback — REVISION 2026-06-03 (bet brief + open categorization)
> Source: the product-agnostic Phase 1 structural-feedback review. Captured AFTER 01-01..04 executed (built, not yet run — 01-05 debug pass pending), so these are **deltas on a built-but-unrun pipeline**, not a rebuild. See the "Revision impact" block at the end for which built plans change.

- **D-13 (bet brief = prose context, NEVER schema):** Every Phase 1 run consumes a per-run **bet brief** authored by the operator (the §6 planning step; hand-filled from a template for now). It is injected **verbatim as prose** into the Finder + Classifier prompts in a `<bet_brief>` block. It has **no schema and is NEVER hook-validated.** Three strict layers: **(A)** prose brief → agent judgment context; **(B)** a fenced `PIPELINE INPUTS` block in the brief (flat lists: LP-hunt terms, comparable-bet seed brands, trend-source toggle) → scripts read it with a tolerant parse; **(C)** the output schema (`brands/dump/space-map.json`) → hooks. **Hooks only ever touch layer C.** A messy/rich brief can degrade quality, never hard-fail the pipeline. This makes consumption non-brittle by design — the brief deliberately has no clean output schema.
  - The bet brief states: the **bet** (a differentiator × a niche × an **OPEN transformation slot** — the operator does NOT supply the transformation; competitors reveal it, it is an OUTPUT), operator **definitions** of the interpretation-heavy terms (pinned once, no stage re-interprets), and **what the run reports back per structurally-similar competitor** (the transformation they attach, the mechanism they actually LEAD with, whether the bet won durably, which niche).
  - Failure mode it kills: handed only a product, the Classifier reports a literal product feature as the UM/transformation (interpretation-soup). Given a bet, its job becomes answerable: "find brands making a structurally-similar bet, report what transformation THEY attach and whether it won durably."

- **D-14 (closed-enum rule — LOCKED):** Closed / hook-rejected enums ONLY for **finite universal vocabularies** that are DR-theory or data-structure primitives — `channel`, `lane`, `claim_type` (the sophistication ladder), revenue `method`, `visits_source`, `demand_trend.shape`. **OPEN** (classifier-named + clustered + evidence-traced) for any **product-varying categorization** — `bet_type`, `transformation`, `niche`, `angle`. `competitive_axis` was the lone violation (fixed in amended D-12).

- **D-15 (`demand_trend` field + a real fetch SOURCE — §2):** Add per-brand `demand_trend: { shape, window, source, basis }` with **`shape` a closed enum** `steady | rising | parabolic-spike | declining | unknown` (`unknown` = escape valve) + a hook rejecting the field missing. **AND** add an actual trend SOURCE to the fetch stage — **Google Trends per brand/category term, ~5yr window** — that populates it. Both halves are required: a field with no source returns `unknown` for every brand and silently disables the fad-death / durability check, which is the **single most load-bearing anti-fad signal** (Gate-1 parabolic-spike kill). Load-bearing especially for novelty-tech bets.

- **D-16 (LP-hunt query template = per-run INPUT — §3):** The fixed LP-hunt query set moves OUT of `fetch.js` hardcode and becomes a **per-run input** read from the bet brief's `PIPELINE INPUTS` block. The "fixed, not agent-chosen" determinism principle stays; the *contents* become a planning deliverable built from the run's actual territories. (A hardcoded template can't self-correct mid-run; against a different product it deterministically hunts pages that don't exist and misses the ones that do.)

- **D-17 (wide-net Finder — §5):** Instruct the Finder that "similar" = "a product a buyer choosing this would also cross-shop, **OR** a brand making the same structural bet," spanning the full set of bet-brief territories + the named comparable-bet seed brands. **Wide net by substitutability AND bet-similarity, never by spec match.** Rationale: a bet validates only if structurally-similar bets are in the pool; **an empty comparable-bet pool reads identically to a failed bet** — a false-negative that silently kills a live opportunity. The territory list + comparable seeds are per-run inputs from the brief.

- **D-18 (multi-domain claim-typing examples + feature-trap — §7):** The Classifier's claim-typing worked examples must span a **RANGE of domains** likely in the pool, each shown typed across the four `claim_type` values — not one product's domain. Include ≥1 **feature-vs-claim trap** (a striking product FEATURE shown as feature/mechanism, NOT promoted to a claim, beside a real outcome-claim) — the inoculation against miscounting a headline feature as a claim and inflating the stage/saturation read. `definitions.md` stays as-is; the gap is only the multi-domain example range. (Judgment edit — no schema change.)

- **D-19 (provenance note + visible anti-fluke floor — §8):** (a) One-line provenance note in `space-map.json`: *"Canonical transformations are claim-categories competitors ASSERT, not validated customer transformations — true transformation is a later VOC/review-mine finding."* (b) Make the anti-fluke floor (2+ brands at scale; 7+ day ad longevity to qualify a creative) **VISIBLE** in the output rather than only reconstructable later; enforcement stays decision-time (D-09 — Phase 1 never hard-gates).

- **D-20 (`run_length_days` + per-ad records sourced deterministically from the Ad Library — `adlib-one.js`):** Each ad creative's `start_date` / `run_length_days` is **extracted deterministically by `adlib-one.js`**, never estimated by the Dumper. Today `adlib-one.js` emits only an aggregate `active_ad_count` + a raw text blob — so per-ad detail is only recoverable by scraping the `_adv.txt` debug blob. It must instead emit a **structured per-ad `ads[]` array**: each ad carries `library_id`, `start_date`, `end_date` (null while active), `run_length_days`, and the ad's creative text — so the Dumper records per-ad creatives from clean structured data, not a blob parse. This is also what makes the per-transformation `creative_count` and per-ad selling-detail reads (the Gate-2/VOC raw material) trustworthy rather than blob-derived. **Stopped-ad pass required:** to feed the D-08 cause-of-death read (long-run-then-**stop** = fatigue/quit → steal the angle; short-run-then-vanish = fad → avoid), the pull must include an `active_status=all`/inactive pass so dead ads carry an `end_date` + a full `run_length_days` — an active-only pull can never see a run that already ended. Keep the existing active-only pass for `active_ad_count`; the inactive pass is additive (and the part most likely to need debug-run tuning, per "first run = debug pass"). The Dumper **carries the value through verbatim** (D-10 never-fabricate: `null`, never a guessed integer). Brick law applied: ad run length is data → a script extracts it, never an agent.

### Claude's Discretion
- Reconciliation mechanics — how to fold `step1-light-pass.md`'s scaffold + agent prompts into one runnable file, exact prompt wording, and where the two inlines physically sit.
- Hook implementation details (the rejection-hook JSON the prompt specs).
- Whether Finder/Dumper/Classifier run as separate calls or adjacent bricks in one call (per `capability_inventory.md` brick-count note) — a cost decision, not a correctness one.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Master spec (the file being reconciled + inlined)
- `prompts/step1-light-pass.md` — the master prompt: full SCHEMA (brands.json / dump.json / space-map.json with the pitch binding), closed enums, the DETERMINISTIC SCAFFOLD (specs `fetch.js` / `clean.js` / `adlib-one.js` / `dedupe.js` / `revenue-est.js` + the PostToolUse rejection hooks), and the three agent prompts. **This is the file to edit.**

### Vocabulary (single source of truth — overrides KB on any conflict)
- `definitions.md` — §"Market sophistication" (5 stages + the Stage→required-levers matrix + 5+ rule), §"Claim" / "Enhanced claim", §"UM" (Problem/Product/Feature sub-types), §"Niche" / "Transformation" / "Market". The sophistication inline (D-03) traces here.
- `CLAUDE.md` (PMF) — one-job-per-brick law; Phase (research step) vs Stage (build unit) naming.

### Brick decomposition
- `capability_inventory.md` — how the light pass decomposes into bricks (`A1 query → S1 fetch → H1/S2 verify+dedupe → A2 classify → S3 aggregate`); one-job-per-executor rule; "light pass works — leave it unless it breaks."

### DR-marketing KB (BUILD-TIME PROVENANCE ONLY — do NOT load these into agent prompts at runtime)
> The only thing extracted from these is the sophistication ladder, already inlined into the Classifier (D-03). Runtime agent context = `definitions.md` + that inline. These files exist here so whoever writes the inline can check it against the source — agents never read them.
- `~/knowledge/dr-marketing/consumer-psychology--carl-weische.md` §"Five Stages of Market Sophistication" (~L46–58) — the stage table the D-03 inline traces to. *(Awareness table §L30–42 deliberately NOT used — awareness dropped per D-05.)*
- `~/knowledge/dr-marketing/brand-building--spencer-origins.md` §MECHANISM / sophistication progression (Stage 3 = mechanism, Stage 4 = claim escalation, Stage 5 = reset via new mechanism) — supports the `claim_type`→stage ladder.
- `~/knowledge/dr-marketing/ecommerce--mark-builds-brands.md` §"Validation Thresholds" + §"Saturated Product + Validated Demand" (revenue floor $300–500K; anti-fluke: multiple competitors at scale, 5+ yr steady trend, ad longevity) — rationale for the live-vs-dead qualification (D-06/D-08) and the Phase 2 demand gate. **NOTE: thresholds inform Phase 2, not a Phase 1 gate (D-09).**

### Working code to inherit
- `tools/adlib-one.js` — Meta Ad Library page-ID-resolved pull (basis for `adlib-one.js` / S1 ad fetch).
- `tools/crowdfund-fetch.js` — Kickstarter/Indiegogo fetcher (basis for crowdfunding lane fetch).

### Hard-won lessons (the failures this touch-up guards against)
- `run-retrospective.md` — "first run = debug pass"; two-pass Ad Library protocol (keyword pass → re-resolve to Page ID, cap 2 attempts then mark unresolved; absence of ads is data); SimilarWeb-blocked + keyword-collision fetch lessons.
- `agents/implementation-notes.md` — the actionable InkLeaf fix list: per-cell saturation, claims-vs-features split, problem-mechanism-vs-UM, definitional boundaries + worked examples inline, competitive set must include substitutes.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `tools/adlib-one.js` + `tools/crowdfund-fetch.js` — working fetchers (page-ID resolution, Cloudflare bypass) to inherit into the layer-3 fetch scripts.
- `prompts/step1-light-pass.md` DETERMINISTIC SCAFFOLD — already specs `fetch.js` / `clean.js` / `dedupe.js` / `revenue-est.js` and the rejection hooks (not yet built — these are the layer-3 scripts remaining).

### Established Patterns
- **Brick model** (the build law): deterministic jobs → scripts, judgment jobs → agents, gates → hooks (reject bad output, don't trust the prompt). Hooks run PostToolUse on each agent's Write.
- Dumper reads ONLY pre-cleaned `corpus/<brand>/clean/*.md` (file-layout enforces "agent reads clean copy only").

### Integration Points
- `space-map.json` is the contract the **Phase 2 market-selection skill** consumes (`.claude/skills/market-selection/`). The D-06/D-07/D-08 flags + the live-vs-total split + the per-brand `competitive_axis` (D-12) are what let that skill apply its lenses without re-deriving them.
- `revenue-est.js` traffic source is swappable via `visits_source` — Semrush-API (D-11) plugs in here.
</code_context>

<specifics>
## Specific Ideas

- The D-03 sophistication ladder text is to be inlined **verbatim** into the Space Classifier prompt.
- Anchor for the whole approach: **"first run on a space is a debug pass to break the methodology, not produce a deliverable"** — the reference-space run is expected to surface remaining gaps; don't over-build ahead of it.
- The frame for sophistication that the user confirmed: a stage is *"what you'll need in order to look more impressive than your competition — to out-persuade them and win over buyers."* Not academic; it's the differentiation floor.
</specifics>

<deferred>
## Deferred Ideas

### Phase 2 — market-selection skill (separate session, runs while light pass runs)
- Applies the comp-revenue **demand floor** ($300–500K) — the gate D-09 keeps out of Phase 1.
- Reads the per-brand `bet_type` (amended D-12) as the **Gate-2 structural-bet input**: it tells the skill whether the bet under test is a *live differentiating axis* in the territory, without the skill re-deriving it from the pages.
- Assembles the **`bet_type × niche × durability` crossing** (the direct readout of the bet — "bet B × niche N: 4 brands tried it, 3 won durably"). Per operator decision this is **decision-time / gap-analysis synthesis, NOT a Phase 1 output cell** — Phase 1 only collects the three ingredients (`bet_type`, `niche`, `demand_trend`/durability) cleanly per brand; the skill crosses them (§4b).
- **Community-heat read** (passionate-but-under-monetized niches a pure supply-side-spend map under-counts) = a **separate read**, NOT collected in Phase 1. Assessor must not treat thin maker-niche spend as an automatic kill — that judgment lives in the separate read.
- Reads the flagged dead/region-only brands (D-06/D-08) through **different lenses, never double-counted**:
  - **Dead brand = post-mortem, not a model.** Classify cause of death from creative run-length: *long run then stop* = fatigue/operator-quit → steal the proven angle + note the whitespace that just opened; *short run then vanish* = angle failed / fad → avoid. Dead brands are OUT of the live saturation count but IN as a zero-attribution-risk **angle archive**.
  - **Region-only brand = channel-edge signal.** Proven-elsewhere transformation with the competitor absent from your channel = first-mover distribution edge. Filed to a **separate channel-edge output**, never the saturation count.
  - **Finished crowdfunding projects** = prime **structure-lens** material (full post-campaign update logs → will-it-ship credibility moves); "finished is better than live" for that lens.

### §6 — the PLANNING phase (SEEDED, not built this session)
- A deliberate pre-research step that runs **before** Phase 1 and produces the per-run **pre-research plan / bet brief** (the inputs the determinism locks in: bet, definitions, territory net, LP-hunt terms, trend-source confirmation, in-domain examples). **The automated skill is DEFERRED — operator does not have time to architect it cleanly now.** For now the brief is **hand-filled from a template** (`prompts/_templates/pre-research-plan.template.md`; worked example `runs/arduview/pre-research-plan.md`). Planted as a roadmap seed (a future PMF pre-research Step + a GSD stage to build the generator). Principle to hold: **with a product, the operator makes the BET before looking** — no agent derives the bet from the product alone.

### Other build sessions
- **Nicely-formatted deliverable / output templating** = M1-S12. Phase 1 ends at clean structured JSON.
- **Semrush Trends API multi-login wiring** = handled by the implementer during Phase 1 build (D-11), not pre-specced.

### Reviewed, not folded
- Worked/negative-example expansion per agent (the 4th gray area) — user deprioritized. Revisit ONLY if the debug run shows layer conflation surviving the current inline examples.

</deferred>

<revision_impact>
## Revision impact — which built plans change (for the re-plan)

The pipeline is **built but never run** (01-01..04 done; 01-05 debug pass pending). These deltas edit built artifacts in place — not a rebuild.

| Built plan | Status | Delta from this revision |
|---|---|---|
| 01-01 (reconcile prompt + schema) | done → **revise** | amend-D-12 (open `bet_type`, drop `competitive_axis` enum); D-13 (`<bet_brief>` consumption block in Finder + Classifier); D-15 (`demand_trend` field); D-17 (wide-net Finder); D-18 (multi-domain examples + feature-trap); D-19 (provenance note + visible floor); D-20 (Dumper carries `run_length_days` from the ad record, never estimates — one-line prompt/schema note) |
| 01-02 (`fetch.js` + `clean.js` + `adlib-one.js`) | done → **revise** | D-15 (add Google Trends ~5yr source); D-16 (read LP-hunt template from the bet brief's PIPELINE INPUTS instead of hardcode); D-20 (`adlib-one.js` emits structured per-ad `ads[]` with `start_date`/`end_date`/`run_length_days`, incl. a stopped-ad `active_status=all` pass) |
| 01-03 (`dedupe.js` + `revenue-est.js`) | done → **untouched** | none |
| 01-04 (hooks) | done → **revise** | amend-D-12 (`validate-classifier`: open `bet_type` non-null+basis+traceable, drop axis-enum reject); D-15 (reject `demand_trend` missing) |
| 01-05 (debug run + UAT) | pending → **runs once after** | runs for the first time once the above land; now also consumes the Arduview bet brief |

Untouched build that stands: `clean.js`, `dedupe.js`, `revenue-est.js`, `validate-finder.js`, `validate-revenue.js`, `validate-dumper.js`.
</revision_impact>

---

*Phase: 01-stage-m1-s1-light-pass*
*Context gathered: 2026-06-03*
