---
phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy
verified: 2026-06-03T00:00:00Z
status: human_needed
score: 3/4
overrides_applied: 0
human_verification:
  - test: "Run the D-17 plumbing smoke test end-to-end on 1-2 live brands"
    expected: "destination_url populated on at least one ad; at least one funnel_package assembled with rendered landing_page_body; validation_lane/validation_strength stamped; Section Analyzer emits >= 1 belief record that passes validate-analyzer.js; funnel-store.js writes runs/<space>/funnels/<funnel_id>.json"
    why_human: "Requires live Meta Ad Library DOM access (Playwright), live LP rendering, and a throwaway LLM call to the Section Analyzer. Cannot be verified with static analysis. Every dependent script exists and is individually validated, but end-to-end live plumbing has not been run."
---

# Phase 03: Deep Competitive Analysis (Collection Layer) Verification Report

**Phase Goal:** Build the COLLECTION LAYER of deep funnel analysis as a market-agnostic, ready-to-run brick string — scraper/assembler (ad->LP binding) -> cleaner -> two-currency validation scorer -> light routing agent -> Section Analyzer -> JSON store — that emits validated belief-instance records + funnel-level fields, granular enough to feed a later birdseye synthesis agent. No market is picked yet; every component is parameterized on a chosen-market input.

**Verified:** 2026-06-03
**Status:** human_needed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Collection layer built as a market-agnostic brick string (scraper/assembler, cleaner, scorer, router, Section Analyzer, store), each component mapped to its brick, runnable the moment a market exists | VERIFIED | All 7 components exist as files: adlib-one.js (scraper), funnel-assemble.js (assembler), funnel-clean.js (cleaner), funnel-score.js (scorer), funnel-deep-pass.md AGENT 1 (router), funnel-deep-pass.md AGENT 2 (analyzer), funnel-store.js (store). All deterministic tools exit 0 on --help. Brick model correct: scripts for fetch/clean/score/store; agent prompts for router + section analyzer; inject-dr.js hook for runtime DR injection. Market-agnostic: --space, --competitor, --source-type are parameters; no market hardcoded. |
| 2 | The ad->LP binding (normalized destination_url clustering) assembles one funnel_package per funnel and handles D-05 edge cases; two validation currencies (A: ad-longevity, B: crowdfunding raise) carried as separate lanes, never normalized | VERIFIED | funnel-assemble.js: normalizeUrl() strips utm_*/fbclid, lowercases host, drops trailing slash, forces https; clusters ads via Map keyed on normalizeUrl(destination_url); emits funnel_package with landing_page_url, landing_page_body, bound_ads[], variant_count, crowdfunding_stats. Edge cases confirmed: ambiguous_destination flag for null/linktree URLs; zero-ad crowdfunding funnels via --crowdfund-lps. funnel-score.js: validation_lane is an array (['A'], ['B'], or ['A','B']); validation_strength is a per-lane object; the two currencies are never merged into one scalar. Currency A: max_run_duration_days x impression_bucket_multiplier x variant_count. Currency B: amount_raised, backer_count, funded_vs_failed, delivered_vs_not carried verbatim from crowdfunding_stats. |
| 3 | The Section Analyzer emits belief-instance records per the §6 schema (open-with-anchors taxonomy, funnel-level-ordinal position, granular execution_detail), descriptive-not-prescriptive, one funnel at a time; §10 birdseye-completeness check passes | VERIFIED | funnel-deep-pass.md contains both agent blocks (AGENT 1 ROUTER, AGENT 2 SECTION ANALYZER). All 9 belief anchors present verbatim (problem-exists through act-now). Funnel-level ordinal position discipline baked into prompt and enforced by validate-analyzer.js (duplicate/page-local position rejects). Granularity requirement baked verbatim with worked example. Single-funnel discipline enforced: "NEVER reason about the pool, consensus, or divergence." Prompt-injection guard: funnel copy wrapped in <funnel_copy> delimiter with explicit SECURITY block. validate-analyzer.js enforces all 5 reject rules: verbatim-substring gate, overflow-belief confidence, closed-vocab, position ordinal, single-funnel discipline. Closed enums declared hard-reject. claim_type reused verbatim from step1-light-pass.md ("direct | enlarged | mechanism | enhanced"). inject-dr.js: 6-file hardcoded allowlist, path-traversal guard, missing-file resilience, max-chars cap. |
| 4 | A plumbing smoke test re-pulls 1-2 real brands end-to-end and confirms the analyzer emits belief records | DEFERRED (human_needed) | Explicitly deferred by operator decision during Plan 03-04 execution. Not run. Documented in 03-04-SUMMARY.md and 03-DEBUG-RUN-NOTES.md. Each brick individually validated; live DOM calibration and end-to-end smoke test deferred to D-02 (after market pick). |

**Score:** 3/4 truths verified (Truth 4 is a documented human/live-run item, not a build failure)

---

### Deferred Items

| # | Item | Addressed In | Evidence |
|---|------|-------------|----------|
| 1 | D-17 plumbing smoke test — end-to-end run on live data confirming destination_url populated, funnel assembled, validation stamped, belief record emitted | After market pick (D-02) | 03-DEBUG-RUN-NOTES.md §D-17: "The real methodology-debug pass remains deferred to D-02 (after a market is picked)." 03-04-SUMMARY.md: "Task 4 smoke test: NOT RUN — explicitly deferred, NOT claimed as passed." |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `tools/adlib-one.js` | Per-ad capture of destination_url + cta_text + headline + impression_bucket + platforms | VERIFIED | All 5 fields present in extractAdCards() DOM walk and textFallbackFields() fallback. existing Currency-A fields (run_length_days, start_date, end_date) untouched. never-fabricate preserved (null on unparseable). |
| `tools/funnel-assemble.js` | URL normalize + cluster ads->LP + Playwright LP render + emit one funnel_package per cluster | VERIFIED | normalizeUrl() present; utm_*/fbclid stripping confirmed; new Map() clustering; Playwright chromium launch + page.goto + networkidle; funnel_package shape complete; ambiguous_destination flag; zero-ad crowdfunding path; _funnel-assemble-log.txt sidecar. |
| `tools/crowdfund-fetch.js` | Currency-B stat parser (amount_raised, backer_count, funded_vs_failed, delivered_vs_not) | VERIFIED | parseCurrencyBStats() present; all 4 fields parsed via tolerant multi-pattern regex cascade; crowdfunding_stats emitted into .stats.json sidecar; render skeleton preserved; --type= convention intact. |
| `tools/funnel-clean.js` | Section-marked clean copy + on-page review preservation (stays dumb) | VERIFIED | stripToText() with [SECTION] marker insertion on h1-h4 and structural elements; extractReviewBlocks() with [REVIEW_LANGUAGE_START/END] tags; landing_page_body read from funnel_package; no belief_id references (grep returns empty); provenance header; per-funnel try/catch batch. |
| `tools/funnel-score.js` | Two-currency validation_lane + validation_strength, no normalization | VERIFIED | validation_lane[] array (not string); validation_strength{} per-lane object; Currency A: max_run_duration_days x bucket multiplier x variant_count; Currency B: crowdfunding_stats fields carried verbatim; ANTI_FLUKE_FLOOR_DAYS=60 surfaced, never gated; no LLM call (only "CLAUDE.md" string in a comment reference). |
| `tools/funnel-store.js` | S4 store — namespaced per-funnel JSON under runs/<space>/funnels/ | VERIFIED | Writes runs/<space>/funnels/<funnel_id>.json; belief_records[] included; _provenance underscore-meta; JSON.stringify(obj, null, 2); execution_detail + verbatim_refs[] preserved; no consensus/divergence birdseye fields; sanitizePathSegment() path guard (T-03-13); --space parameter, not hardcoded. |
| `tools/hooks/inject-dr.js` | Runtime DR-file auto-injection hook for Section Analyzer (6 files) | VERIFIED | DR_ALLOWLIST hardcoded with all 6 filenames; isUnderDrDir() path-traversal guard; fs.readFileSync per file with try/catch resilience; stdout or --out= emit; max-chars cap; no optional files (advertorial/landing-pages absent from allowlist and source). |
| `tools/hooks/validate-analyzer.js` | Validate-on-Write hook for belief-instance records | VERIFIED | 5 reject rules enforced: verbatim-substring gate, overflow-belief confidence rule, closed-vocab reject, position ordinal uniqueness, single-funnel discipline (consensus/divergence/unusual/pool rejection). exit 0 (pass) / exit 2+stderr (REJECT) contract. violations[]-accumulate-then-dump idiom. --help exits 0. |
| `prompts/funnel-deep-pass.md` | Router + Section Analyzer prompts + 6a/6b schema + closed-enum controlled vocab | VERIFIED | Both agent blocks present (AGENT 1 ROUTER, AGENT 2 SECTION ANALYZER); routing_flag enum (structure_only/messaging_full/both); all 9 anchors listed; 6a/6b schema fields complete; claim_type REUSED from step1 (direct/enlarged/mechanism/enhanced verbatim); closed enums declared "a value off-list is a hard reject"; funnel_copy data delimiter + SECURITY block for prompt injection defense; DR files referenced as "auto-injected by inject-dr.js at runtime"; single-funnel discipline baked verbatim. |
| `.planning/ROADMAP.md` Phase 3 section | Collection-layer scope with corrected spec pointer and birdseye deferral | VERIFIED | Phase 3 section contains: "collection", "funnel-analysis-collection-spec.md", "belief-instance", "deferred", "birdseye". Goal describes the brick string. Success Criteria reference belief-instance records, market-agnostic, birdseye deferral. Spec pointer updated from deep-market-analysis-framework.md. |
| `03-DEBUG-RUN-NOTES.md` | Empty scaffold mirroring 01-DEBUG-RUN-NOTES.md, marked deferred | VERIFIED | File exists; D-17 deferral explicitly documented; pipeline stages scaffolded; 6 known failure points listed (URL normalization, position, two-currency normalization, etc.); marked "DEFERRED — TO BE FILLED on the first real deep-analysis run." |

---

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| tools/adlib-one.js | tools/funnel-assemble.js | destination_url field on each ad record | WIRED | normalizeUrl(ad.destination_url) is the cluster key in clusterAdsByUrl(); ambiguous destination and null destination_url handled per D-05 |
| tools/funnel-assemble.js | normalized URL cluster | Map keyed on normalizeUrl(destination_url) | WIRED | `const clusters = new Map()` with normalizeUrl() as key confirmed at line 255 |
| tools/funnel-assemble.js (Plan 01) | tools/funnel-clean.js | landing_page_body field on funnel_package | WIRED | funnel-clean.js reads `pkg.landing_page_body` at line 198; confirmed present |
| tools/funnel-assemble.js (Plan 01) | tools/funnel-score.js | bound_ads[].run_length_days + crowdfunding_stats | WIRED | scoreCurrencyA() maps bound_ads[].run_length_days; scoreCurrencyB() reads crowdfunding_stats; both confirmed |
| tools/funnel-score.js + funnel-deep-pass.md | tools/funnel-store.js | funnel_package + belief_records[] written to runs/<space>/funnels/ | WIRED | funnel-store.js accepts --funnel (funnel_package JSON) + --beliefs (belief records JSON); writes runs/<space>/funnels/<funnel_id>.json |
| tools/hooks/inject-dr.js | Section Analyzer context | fs.readFileSync over the six dr-marketing/*.md files | WIRED | readFileSync confirmed; DR_DIR resolved via os.homedir(); 6 files in allowlist with attribution headers |
| tools/hooks/validate-analyzer.js | cleaned funnel copy | verbatim-substring gate on verbatim_refs[] | WIRED | findCleanedBody() multi-path search; verbatim_refs[].text checked via includes() against cleaned body |

---

### Data-Flow Trace (Level 4)

Applicable only to scripts that render dynamic data. The scripts here are data-processing tools, not UI renderers. The critical data-flow to trace is: destination_url -> cluster key -> funnel_package -> cleaned_body -> belief_records -> store.

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|--------------|--------|-------------------|--------|
| funnel-assemble.js | destination_url | adlib-one.js per-ad DOM extraction | Conditional (null when DOM selectors miss — calibration deferred to D-17) | CONDITIONAL — extraction wired with TODO(D-17) markers; text-chunk fallback partially compensates. Real data on live DOM requires calibration. |
| funnel-score.js | run_length_days | adlib-one.js daysBetween() | Real arithmetic from start/end dates | FLOWING |
| funnel-store.js | belief_records[] | Section Analyzer output file (--beliefs) | Depends on Analyzer run | CONDITIONAL — store correctly reads belief files; populates when Analyzer produces output |

---

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| adlib-one.js exits 0 on --help | node tools/adlib-one.js --help | exit 0 | PASS |
| funnel-assemble.js exits 0 on --help | node tools/funnel-assemble.js --help | exit 0 | PASS |
| funnel-clean.js exits 0 on --help | node tools/funnel-clean.js --help | exit 0 | PASS |
| funnel-score.js exits 0 on --help | node tools/funnel-score.js --help | exit 0 | PASS |
| funnel-store.js exits 0 on --help | node tools/funnel-store.js --help | exit 0 | PASS |
| crowdfund-fetch.js exits 0 on --help | node tools/crowdfund-fetch.js --help | exit 0 | PASS |
| inject-dr.js exits 0 on --help | node tools/hooks/inject-dr.js --help | exit 0 | PASS |
| validate-analyzer.js exits 0 on --help | node tools/hooks/validate-analyzer.js --help | exit 0 | PASS |
| End-to-end live smoke test | node adlib-one.js <brand> -> assemble -> clean -> score -> analyze -> store | NOT RUN | SKIP (live DOM + LLM required; deferred to D-02) |

---

### Requirements Coverage

No formal v1 REQ-IDs assigned to this phase per PLAN frontmatter and explicit operator instruction. This is a specced capability feeding M2; promote when M2 is planned. No REQUIREMENTS.md traceability to check — not a gap.

---

### Anti-Patterns Found

| File | Pattern | Severity | Impact |
|------|---------|----------|--------|
| tools/adlib-one.js | `TODO(D-17)` DOM calibration markers on extractAdCards() selectors | Info | Intentional planned stub — the selectors are best-effort heuristics; text-chunk fallback compensates; live calibration is the deferred D-17 debug pass. Will produce null fields on live data until calibrated. Not a build gap. |
| tools/crowdfund-fetch.js | `delivered_vs_not` rarely populated from campaign page alone (creator profile fetch not yet implemented) | Info | Documented known stub in 03-02-SUMMARY.md. Field is in schema; populated when creator-profile fetch type is added. Strongest durability signal; weakens Currency B until filled. Not blocking. |
| tools/hooks/validate-analyzer.js (WR-05 from review) | Verbatim gate silently downgrades to raw landing_page_body fallback when only cleaned body is unavailable | Warning (WR-05) | Could pass paraphrased verbatim that would fail against the true cleaned text. Known review finding — not blocking collection-layer build verification but should be fixed before methodology runs. |
| tools/funnel-assemble.js (WR-01/WR-03 from review) | SSRF guard bypassed by HTTP redirects (WR-01) and has DNS-rebinding TOCTOU window (WR-03) | Warning (known) | Operator-acknowledged as known gaps in 03-REVIEW.md. Neither is critical; both survive the happy path. Do not block collection-layer build verification per explicit instruction. |

---

### Human Verification Required

#### 1. D-17 End-to-End Plumbing Smoke Test

**Test:** Run the full brick string on 1-2 live brands (e.g. a known Arduview-pool brand):
1. `node tools/adlib-one.js <slug> "<brand>"` — confirm at least one ad has non-null `destination_url`
2. `node tools/funnel-assemble.js ads/<slug>.json --competitor=<name> --source-type=DTC --out=./funnels` — confirm at least one funnel_package.json with rendered `landing_page_body` and `bound_ads[]`
3. `node tools/funnel-clean.js funnels/<funnel_id>.json` — confirm `[SECTION]` markers in cleaned output
4. `node tools/funnel-score.js funnels/<funnel_id>.json` — confirm `validation_lane[]` and `validation_strength{}` stamped
5. Run Section Analyzer (AGENT 2 from funnel-deep-pass.md with inject-dr.js context) on ONE funnel (throwaway) — confirm output passes `node tools/hooks/validate-analyzer.js <output.json>`
6. `node tools/funnel-store.js --space=<space> --funnel=<pkg> --beliefs=<records>` — confirm `runs/<space>/funnels/<funnel_id>.json` written

**Expected:** All stages run without unhandled errors; destination_url populated on at least one ad; at least one funnel_package assembled with rendered landing_page_body; validation_lane/validation_strength present; at least one belief record passes validate-analyzer.js exit-0; a store JSON file written. (Content quality of belief tagging is NOT judged here — that is the deferred methodology pass.)

**Why human:** Requires live Meta Ad Library DOM (Playwright browser), live competitor LP rendering, and a live LLM call to the Section Analyzer. Cannot be verified with static grep analysis. DOM selector calibration (TODO(D-17) markers) may surface null fields that need fixing before the smoke test passes fully.

---

### Gaps Summary

No build gaps. The three automated-verifiable success criteria (1-3) are all VERIFIED. Success criterion 4 (the D-17 smoke test) was explicitly deferred by operator decision and is a human/live-run item, not a build deficiency. The collection-layer brick string is structurally complete and correct.

Known issues from the code review (03-REVIEW.md) are warnings, not critical findings. WR-01 and WR-03 (SSRF edge cases) are operator-acknowledged. WR-05 (verbatim gate fallback) is a tightening opportunity. None block the collection-layer build.

---

_Verified: 2026-06-03_
_Verifier: Claude (gsd-verifier)_
