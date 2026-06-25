# ERROR-NOTES.md — the engineering-failure corpus

**Purpose:** the "what turned blank / what broke" knowledge, consolidated from scattered audit + run
notes so it survives the marketing rewrite. This is the punch-list source for the deferred HARDENING
milestone. **Engineering only** — marketing/process retrospectives are pointered, not inlined.

**Reconciled against git 2026-06-24.** Anchor IDs match the `error_notes` links in `REGISTRY.md`/`.json`.

---

## OPEN (still broken / gated)

### #trends-0pct-fill · Google Trends 0% fill-rate — OPERATOR-GATED (code unimplemented)
`fetch.js` `extractTrendSeries()` regexes the initial HTML, but Trends loads the series via a deferred
XHR. Fix approach specified — intercept `/trends/api/widgetdata/multiline` via `page.on('response')`,
strip the `)]}',` XSSI guard, parse `default.timelineData` (see `H3-LIVE-DOM-RUNBOOK.md §H3a`). NOT
implemented: P21 confirmed this WSL egress IP is **HTTP 429**-blocked by Google on BOTH the explore
page AND the direct `/trends/api/explore` endpoint, so the calibration fixture can only be captured via
the operator's real Chrome (CDP bridge) or a non-flagged IP. Code lands once the fixture exists.

### #adlib-typeahead-resolve · Meta advertiser typeahead returns no candidates headless
Separate from the (now-fixed) #adlib-selectors extraction bug: `adlib-one.js` `pickAdvertiser` reads
`li[role=option]` from the typeahead, which comes back empty in WSL headless, so a full run resolves
NONE before reaching the ad pass. **Workaround:** pass a `forcedPageId`, use the keyword-search URL, or
the CDP real-Chrome path. (Discovered P21 during the live adlib confirmation.)

### #source-routing-ghost · documented, never emitted
`funnel-architect` SKILL consumes `source_routing` but the Section Analyzer never emits it (only its
sibling `belief_kind` got resolved in `35581d4`). **Contract-gated:** operator must define the category
vocab (see `enums.json` → `contract_gated`). Short-term SAFE-NOW: remove the ghost references.

### #reddit-extract-ip-gated · VOC retriever smoke blocked from this IP (not a code defect)
P21 H4 attempted to smoke `dump.mjs`; reddit WAF returns "blocked by network security" to the
browser-loaded `.json` from this WSL egress IP (same IP-block class as Trends). The retriever is the
committed, previously-smoke-tested tool — verify from a non-flagged IP / the CDP real-Chrome path.

---

## FIXED (verified in git — do NOT re-add to punch-list)

- **funnel_fields discard** → FIXED `bbff2ff`. `buildStoredRecord(funnelPkg, beliefRecords, funnelFields={})` prefers the wrapper for the 6 funnel-level fields.
- **normalizeUrl A/B phantom funnels** → FIXED `bbff2ff`. Strip list now includes `variant/test/lp/ver/_pos/_sid/_ss/_psq`.
- **belief_kind ghost field** → FIXED `35581d4`. `BELIEF_KIND_ENUM` + hard reject in `validate-analyzer.js`.
- **funnel-clean `.md` headings dropped** → FIXED `3d70cb4` (Phase 20-01). Line-anchored ATX regex `/^#{1,6}[ \t]+/gm` runs after the HTML tag-strip and marks markdown headings; both input paths now emit `[SECTION]`. Verified P21 smoke: md body (2×`##` + 1×`###`) → 3 `[SECTION]`; html body (`<h2>`+`<h3>`) → 2 `[SECTION]`. (ERROR-NOTES had this stale-OPEN; corrected P21.)
- **funnel-score wrong-input / silent-null** → FIXED `30415ef` (Phase 21 H2a). `checkScoreableInput()` at the CLI boundary requires `funnel_id`, recovers the `amount_raised_usd` alias with a warn, and rejects an all-null `crowdfunding_stats` — no more silent-null scored output.
- **validate-analyzer never fired (#analyzer-unwired)** → FIXED `91acec7` (P21 H1). `route.js` routes `*-beliefs.json` → `validate-analyzer.js` (defense-in-depth); the funnel-deep-pass SKILL is corrected to run it as an explicit orchestrator step (hooks don't fire in subagents). Fixture smoke: good→exit 0, bad (off-enum belief_kind)→exit 2.
- **_index.json stale (#index-stale)** → FIXED (P21 free re-run). `funnel-vectorize` rebuild over the recovered funnels; recovered 6a fields propagate (43/43). `routing_flag` stays null pending failure #5 plumbing — not an index bug.
- **adlib destination_url null from DOM scrape (#adlib-selectors)** → FIXED `f44fe39` (P21 H3-Meta). `lib/adlib-graphql.js` extracts `ad_archive_id`/`snapshot.link_url`/dates from the `/api/graphql/` response, overlaid onto the card maps (preferred over the obfuscated DOM). Verified offline against a real captured fixture (`runs/_fixture/adlib/flipper-zero-xhr.json`, 8/10 destination_url non-null). Separate typeahead gap → #adlib-typeahead-resolve (OPEN).
- **integration creds via __dirname (#cred-seam)** → FIXED `5facb30` (P21 H4). `engine/integrations/lib-creds.js` resolves `--creds=<path>` → env → `__dirname` default; all 5 cred-reading integrations wired; resolution unit-tested + clear-error dry-run verified.
- **H0 contract extraction** → DONE `1cee7b2` (P21). 4 validators import `enums.json` (8/8 behavior-preserving), `asset-record.schema.json` completed, `prompts/_generated/enums.md` generator added.

---

## Pointers (marketing/process retros — NOT engineering, not in scope here)
- `run-retrospective.md` — orchestration shape, crash discipline (agents die ~60-65 tool uses; run in waves of 5).
- `.planning/RETRO-SESSION-HANDOFF.md` — contract-before-build lesson; use GSD machinery not freelance subagents; doc drift.
- `agents/implementation-notes.md` — framework layer conflation (features vs claims vs transformations); per-market (not global) saturation.
- `.planning/audit/01–11` — the original (untrusted, double-counting) audit; demoted to cross-check.
