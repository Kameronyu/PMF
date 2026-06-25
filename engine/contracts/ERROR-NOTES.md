# ERROR-NOTES.md — the engineering-failure corpus

**Purpose:** the "what turned blank / what broke" knowledge, consolidated from scattered audit + run
notes so it survives the marketing rewrite. This is the punch-list source for the deferred HARDENING
milestone. **Engineering only** — marketing/process retrospectives are pointered, not inlined.

**Reconciled against git 2026-06-24.** Anchor IDs match the `error_notes` links in `REGISTRY.md`/`.json`.

---

## OPEN (still broken — feeds HARDENING)

### #trends-0pct-fill · Google Trends 0% fill-rate
`fetch.js` `extractTrendSeries()` uses regex against initial HTML, but Trends loads the series via a
deferred XHR — never captured. `demand_trend` null for every brand; the anti-fad/parabolic-spike
durability signal (Phase-2 Gate-1 kill) is dark. **Fix:** intercept the XHR via `page.route()` /
`page.on('response')`, or hit the Trends API. *(src: audit/03-retro-triage §A1; 01-DEBUG-RUN-NOTES.)*

### #adlib-selectors · Meta Ad Library DOM selectors uncalibrated
`adlib-one.js` `extractAdCards()` uses heuristic selectors (anchor walk, heading scrape) marked
`TODO(D-17)`, never validated against the live React DOM. `destination_url` may be broadly null →
collapses the whole funnel-assemble path. **Fix:** live-DOM calibration run, dump DOM, replace with
verified attribute selectors. *(src: audit/08 §Bug 4.)*

### #analyzer-unwired · validate-analyzer.js never fires
Built + enum-complete (incl. BELIEF_KIND), but absent from `route.js` and not an explicit orchestrator
step in the funnel-deep-pass SKILL (hooks don't fire in subagents — the SKILL's PostToolUse claim is
false). Every belief record is unvalidated; hallucinated `verbatim_refs`, off-enum values pass through.
**Fix:** wire as an explicit orchestrator step (mirror `validate-asset-record.js` in asset-classify) +
add to `route.js` for defense-in-depth. *(src: CONCERNS.md; audit/11 §ANTI-PATTERN B.)*

### #funnel-score-input · wrong-input + field-name silent nulls
`funnel-score.js` accepts any JSON without a required-field check: passing a `funnels-clean/` file (no
ads/stats) yields null `validation_strength`; `amount_raised_usd` vs `amount_raised` key mismatch →
silent null. **Fix:** required-field check at the CLI boundary. *(src: agents/funnel-deep-pass-run-notes §4-5.)*

### #index-stale · _index.json predates source_type/routing_flag
`runs/arduview/funnels/_index.json` was built before `funnel-vectorize.js` added `source_type`/
`routing_flag`; every record has null → RAG prefilters inoperative. **Fix (no code):**
`node engine/bricks/funnel-vectorize.js --space=arduview`. *(src: audit/08 §Bug 6.)*

### #source-routing-ghost · documented, never emitted
`funnel-architect` SKILL consumes `source_routing` but the Section Analyzer never emits it (only its
sibling `belief_kind` got resolved in `35581d4`). **Contract-gated:** operator must define the category
vocab (see `enums.json` → `contract_gated`). Short-term SAFE-NOW: remove the ghost references.

### #cred-seam · integration creds via __dirname
Promoted `engine/integrations/*` scripts resolve creds by `path.join(__dirname, '.x-creds.json')`; after
promotion the creds live at `runs/arduview/_tooling/`, so the `__dirname` lookup misses. **Fix (H4):**
parameterize to `--creds=<path>` (default env), pass the arduview path explicitly. Generic code,
run-supplied secret.

---

## FIXED (verified in git — do NOT re-add to punch-list)

- **funnel_fields discard** → FIXED `bbff2ff`. `buildStoredRecord(funnelPkg, beliefRecords, funnelFields={})` prefers the wrapper for the 6 funnel-level fields.
- **normalizeUrl A/B phantom funnels** → FIXED `bbff2ff`. Strip list now includes `variant/test/lp/ver/_pos/_sid/_ss/_psq`.
- **belief_kind ghost field** → FIXED `35581d4`. `BELIEF_KIND_ENUM` + hard reject in `validate-analyzer.js`.
- **funnel-clean `.md` headings dropped** → FIXED `3d70cb4` (Phase 20-01). Line-anchored ATX regex `/^#{1,6}[ \t]+/gm` runs after the HTML tag-strip and marks markdown headings; both input paths now emit `[SECTION]`. Verified P21 smoke: md body (2×`##` + 1×`###`) → 3 `[SECTION]`; html body (`<h2>`+`<h3>`) → 2 `[SECTION]`. (ERROR-NOTES had this stale-OPEN; corrected P21.)
- **funnel-score wrong-input / silent-null** → FIXED `30415ef` (Phase 21 H2a). `checkScoreableInput()` at the CLI boundary requires `funnel_id`, recovers the `amount_raised_usd` alias with a warn, and rejects an all-null `crowdfunding_stats` — no more silent-null scored output.

---

## Pointers (marketing/process retros — NOT engineering, not in scope here)
- `run-retrospective.md` — orchestration shape, crash discipline (agents die ~60-65 tool uses; run in waves of 5).
- `.planning/RETRO-SESSION-HANDOFF.md` — contract-before-build lesson; use GSD machinery not freelance subagents; doc drift.
- `agents/implementation-notes.md` — framework layer conflation (features vs claims vs transformations); per-market (not global) saturation.
- `.planning/audit/01–11` — the original (untrusted, double-counting) audit; demoted to cross-check.
