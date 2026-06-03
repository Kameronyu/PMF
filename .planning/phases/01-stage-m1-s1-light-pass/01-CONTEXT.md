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
- **D-01:** The existing `prompts/phase1-light-pass.md` already fixes the InkLeaf **structural** failures (per-cell saturation not pooled, claim≠feature, layer discipline with worked examples, problem-mechanism-vs-unique-UM as the classifier's call). Reconcile the master into **one runnable prompt** + the surgical inlines below, then **run on a reference space as a debug pass** (per `run-retrospective.md`: "first run on a space is a debug pass to break the methodology, not produce a deliverable"). Do NOT pre-load KB knowledge the run hasn't shown is needed.
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

### Claude's Discretion
- Reconciliation mechanics — how to fold `phase1-light-pass.md`'s scaffold + agent prompts into one runnable file, exact prompt wording, and where the two inlines physically sit.
- Hook implementation details (the rejection-hook JSON the prompt specs).
- Whether Finder/Dumper/Classifier run as separate calls or adjacent bricks in one call (per `capability_inventory.md` brick-count note) — a cost decision, not a correctness one.
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Master spec (the file being reconciled + inlined)
- `prompts/phase1-light-pass.md` — the master prompt: full SCHEMA (brands.json / dump.json / space-map.json with the pitch binding), closed enums, the DETERMINISTIC SCAFFOLD (specs `fetch.js` / `clean.js` / `adlib-one.js` / `dedupe.js` / `revenue-est.js` + the PostToolUse rejection hooks), and the three agent prompts. **This is the file to edit.**

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
- `prompts/phase1-light-pass.md` DETERMINISTIC SCAFFOLD — already specs `fetch.js` / `clean.js` / `dedupe.js` / `revenue-est.js` and the rejection hooks (not yet built — these are the layer-3 scripts remaining).

### Established Patterns
- **Brick model** (the build law): deterministic jobs → scripts, judgment jobs → agents, gates → hooks (reject bad output, don't trust the prompt). Hooks run PostToolUse on each agent's Write.
- Dumper reads ONLY pre-cleaned `corpus/<brand>/clean/*.md` (file-layout enforces "agent reads clean copy only").

### Integration Points
- `space-map.json` is the contract the **Phase 2 market-selection skill** consumes (`.claude/skills/market-selection/`). The D-06/D-07/D-08 flags + the live-vs-total split are what let that skill apply its lenses without re-deriving them.
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
- Reads the flagged dead/region-only brands (D-06/D-08) through **different lenses, never double-counted**:
  - **Dead brand = post-mortem, not a model.** Classify cause of death from creative run-length: *long run then stop* = fatigue/operator-quit → steal the proven angle + note the whitespace that just opened; *short run then vanish* = angle failed / fad → avoid. Dead brands are OUT of the live saturation count but IN as a zero-attribution-risk **angle archive**.
  - **Region-only brand = channel-edge signal.** Proven-elsewhere transformation with the competitor absent from your channel = first-mover distribution edge. Filed to a **separate channel-edge output**, never the saturation count.
  - **Finished crowdfunding projects** = prime **structure-lens** material (full post-campaign update logs → will-it-ship credibility moves); "finished is better than live" for that lens.

### Other build sessions
- **Nicely-formatted deliverable / output templating** = M1-S12. Phase 1 ends at clean structured JSON.
- **Semrush Trends API multi-login wiring** = handled by the implementer during Phase 1 build (D-11), not pre-specced.

### Reviewed, not folded
- Worked/negative-example expansion per agent (the 4th gray area) — user deprioritized. Revisit ONLY if the debug run shows layer conflation surviving the current inline examples.

</deferred>

---

*Phase: 01-stage-m1-s1-light-pass*
*Context gathered: 2026-06-03*
</content>
</invoke>
