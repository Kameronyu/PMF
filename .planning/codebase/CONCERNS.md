# Codebase Concerns — Engine Analysis

**Analysis Date:** 2026-06-26  
**Scope:** `engine/` only — hardened deterministic wiring and integration layer

---

## Critical Path Issues (Blocking Shell Assembly)

### Portability & Hardcoded Paths
**Files:** `engine/integrations/surge/surge_drive.py`, `engine/bricks/adlib-sweep.js`, `engine/hooks/inject-*-dr.js`

**Issue:** The engine carries machine-specific absolute paths and hardcoded configuration:
- `surge_drive.py` line 8: hardcoded SITE path (`/home/kyu3/PMF/runs/arduview/site`)
- `adlib-sweep.js` line 7: hardcoded output dir (`/home/kyu3/PMF/runs/eink-tablets/adlibrary`)
- All four DR injectors (`inject-dr.js:71`, `inject-funnel-architect-dr.js:60`, `inject-market-selection-dr.js`, `inject-copywriter-dr.js`): resolve `~/knowledge/dr-marketing/` via hardcoded `os.homedir()` path

**Impact:** The engine cannot be dropped into a different workspace or operator setup without path rewriting. Blocks portability and reuse.

**Fix approach:**
- Migrate all hardcoded paths to command-line flags with environment variable fallbacks (e.g., `--dr-dir=$DR_DIR`, `--out=$SURGE_OUT`)
- Provide sensible defaults for back-compatibility
- Document all external input requirements in a `DEPENDENCIES.md` manifest

**Priority:** High — required for R1 (operator brings marketing docs)

---

### Security: Committed Credentials
**Files:** `engine/integrations/surge/surge_drive.py` line 11

**Issue:** Contains a committed "throwaway password" in plaintext (documented in `21-CLOSEOUT-SUMMARY.md`).

**Impact:** Leaks credentials even if "throwaway". Sets bad precedent for future integrations.

**Current mitigation:** This is a one-off throwaway account, not a real service secret, but needs to be removed.

**Fix approach:**
- Move all credentials to `--creds=<path>` flag or environment variables (`$SURGE_EMAIL`, `$SURGE_PW`)
- Use a `.gitignored` creds file for local runs if needed
- Document the credential interface in `DEPENDENCIES.md`

**Priority:** Medium — must be done before any reuse, no data impact currently

---

### Firing Layer Incomplete Proof
**Files:** `engine/hooks/`, `engine/contracts/21-CLOSEOUT-SUMMARY.md` (§Firewall), `WIRING-BUNDLE-HANDOFF.md` (§4)

**Issue:** 12 hooks form the firing layer; only 4 have fixture smoke coverage:
- **Proven:** `inject-dr.js`, `validate-analyzer.js`, `validate-asset-record.js`, `guard-marketing.js`
- **Wired but unsmoked:** `route.js`, `validate-finder.js`, `validate-dumper.js`, `validate-classifier.js`, `validate-revenue.js`, `inject-market-selection-dr.js`, `inject-funnel-architect-dr.js`, `inject-copywriter-dr.js`

**Impact:** If these hooks are called in the shell assembly, failures are unexpected. The 8 unsmoked validators were repointed to `enums.json` in H0 (behavior-preserving), but no fixture exercises the repoint.

**Fix approach:**
- Create `engine/contracts/h6-firing-*.sh` smokes for each validator (good input → exit 0, bad → exit 2)
- Run stub DR injectors against `engine/_fixture/dr-knowledge/` (after portability fix) and assert non-empty bundles
- Smoke `route.js` dispatcher with fixture writes
- Add all firing-layer smokes to `h6-all.sh` verification command

**Priority:** High — required before the shell can reliably run the bricks

---

## Known Bugs (Open, Documented)

### #adlib-typeahead-resolve — Meta Ad Library Typeahead Returns Empty Headless
**Files:** `engine/bricks/adlib-one.js:193–220`

**Issue:** WSL headless environment returns zero candidates from Meta Ad Library typeahead dropdown. Extraction logic works (via GraphQL API), but the typeahead selector path never populates. Arbitrary brands with `ads_flag=yes` have real ads; the blocker is environment-specific (headless).

**Impact:** Full runs on headless resolve NONE before reaching ad pass. Blocks automated VOC/ad-data retrieval from headless WSL.

**Current status:** Documented OPEN in `ERROR-NOTES.md`. Not flagged as critical because adlib also works via GraphQL path (used in fallback). Scope: deferred to R7 (live E2E).

**Workaround:** Pass `forcedPageId`, use keyword-search URL, or run via real Windows Chrome + CDP bridge.

**Why fragile:** Three independent selectors (L106, L112, L124) all carry `TODO(D-17): calibrate against live DOM` comments. Live-only regression risk if DOM changes.

**Reference:** `RETRIEVAL-FAILURES-arduview.md` line 38, `21-CLOSEOUT-SUMMARY.md` line 50, `ERROR-NOTES.md` line 13–17

---

### #reddit-extract-fingerprint — Headless Blocked by WAF; Requires Residential IP
**Files:** `.claude/skills/reddit-extract/dump.mjs`, `engine/contracts/RETRIEVAL-FAILURES-arduview.md`

**Issue:** Headless mode triggers Reddit edge WAF (403 Network Security). Same AWS datacenter IP from headed mode returns 200. Automated rate-limiting prevented a clean end-to-end dump during Phase 21.

**Impact:** Can't run unattended VOC extraction from AWS/datacenter environments. Blocks R6 VOC pipeline if relying on automated reddit scraping.

**Current status:** Marked OPEN/deferred R6. Fixed directionally (`6dc6a30`) with headed-by-default + retry-on-403 + headless fallback, but not clean-verified.

**Production path:** Use reddit's official OAuth API (documented in `STATE.md` M1-S6) — works from datacenter IPs with registered app token.

**Fragility:** Dependency on external WAF rules; any IP/fingerprint change breaks this. Edge-case-sensitive.

**Reference:** `ERROR-NOTES.md` lines 19–31, `21-CLOSEOUT-SUMMARY.md` line 48

---

### #source-routing-ghost — Contract-Gated Field Never Emitted
**Files:** `engine/bricks/funnel-architect.js` (SKILL reference), `engine/contracts/AMBIGUITY-LEDGER.md`

**Issue:** `funnel-architect` SKILL reads `source_routing` field from the funnel package, but Section Analyzer never emits it. Only its sibling `belief_kind` was resolved.

**Impact:** Routing logic incomplete; the field is silently null. No production impact if router doesn't require it, but wiring is incomplete.

**Current status:** Contract-gated per `HARDENING.md` — operator must define the vocab before adding to `enums.json`. Short-term safe approach: remove ghost references.

**Fix approach:** Define category vocab, add to `enums.json`, wire emission in analyzer. Currently deferred pending operator decision.

**Reference:** `ERROR-NOTES.md` lines 19–22, `AMBIGUITY-LEDGER.md` §4 A1c

---

## Reorg-Introduced Path Breaks (Both Fixed, But Signal of Fragility)

### Funnel Analyzer Context: Inject-DR Path Break
**Files:** `engine/bricks/funnel-analyzer-context.js`

**Issue:** Post-reorg, brick resolved `engine/bricks/hooks/inject-dr.js`, which no longer existed after bricks/hooks reorganization. Module not found → exit 2.

**Status:** FIXED `a57d30e` (changed to `../hooks/inject-dr.js`).

**Fragility signal:** Silent break — nothing exercised analyzer-context spawn before P21, so the error was invisible. H6 smoke (`h6-analyzer-context.sh`) surfaced it. Indicates incomplete test coverage of spawned processes.

**Reference:** `21-CLOSEOUT-SUMMARY.md` line 55, `ERROR-NOTES.md` lines 35–38

---

### Asset Map-Rank: Section-Table Path Break
**Files:** `engine/bricks/asset-map-rank.js`

**Issue:** Pre-reorg, brick resolved `tools/asset/section-table.json` via `CWD`. After reorg, path no longer exists → exit 1 on every run.

**Status:** FIXED `0ad0fe6` (changed to `path.resolve(__dirname, 'asset', …)`).

**Fragility signal:** Same as analyzer-context — silent break from incomplete reorg coverage. The default section list path also broke; both indicate hardcoded path assumptions.

**Reference:** `21-CLOSEOUT-SUMMARY.md` line 55, `ERROR-NOTES.md` lines 35–38

---

## Large Bricks with Complex Logic

### Fetch.js — 591 Lines, Multiple Integrations
**Files:** `engine/bricks/fetch.js`

**Contents:** Site fetch (HTML), Google Trends XHR parsing, live-DOM dependent, deferred-data handling, consent warming.

**Fragility:**
- Trends fill-rate = 0% in Phase 21 until XHR interception was added (L37, `#trends-0pct-fill`).
- DOM-dependent; any Google Trends UI change breaks it.
- Cookie/consent state affects success (discovered cold→429, warmed→200).

**Status:** Working (Phase 21 H3 smoke verified), but high sensitivity to external changes.

**Maintenance:** Monitor Trends API changes; consider contract-based mocking for offline development.

---

### Funnel-Assemble.js — 587 Lines, Multi-Stage Transformation
**Files:** `engine/bricks/funnel-assemble.js`

**Contents:** URL normalization (A/B phantom funnels), funnel stage parsing, claim aggregation, revenue synthesis, conflict resolution.

**Fragility:**
- URL normalization strip list constantly grows (last fix added variant/test/lp/ver/_pos/_sid/_ss/_psq to filter A/B phantoms — `bbff2ff`).
- Claim-type deduction from naming heuristics (fragile to brand naming convention changes).
- Silent nulls if data missing (now caught by validators, but structure is soft).

**Status:** Working, but strip list maintenance is ongoing.

---

### Adlib-One.js — 460 Lines, Live-DOM Scraping
**Files:** `engine/bricks/adlib-one.js`

**Contents:** Meta Ad Library card extraction (multiple selector paths), GraphQL fallback, destination URL mapping, metadata enrichment.

**Fragility:**
- Three independent selector paths (L106, L112, L124) all marked `TODO(D-17): calibrate against live DOM`.
- Multiple fallbacks (GraphQL → DOM scrape → null) hide selector failures.
- Headless detection (line 24) changes behavior; environment-dependent.

**Status:** Partially working (GraphQL path verified; DOM selectors unverified). High regression risk on Ad Library DOM changes.

**Known issue:** `#adlib-typeahead-resolve` — typeahead returns empty headless.

---

### Asset-Classify Pipeline (Distributed) — 5 Large Bricks + Python Probes
**Files:** `engine/bricks/asset-map-rank.js` (363 lines), `engine/bricks/asset-emit.js` (460 lines), `engine/bricks/asset/probe.py`, `asset/probe_video.py`, `asset/frame-grab.py`, `asset/sample_montage.py`

**Issue:** Image classification is perceptual + deterministic (working), but video frame helpers are **live-only**:
- `probe_video.py`, `frame-grab.py`, `sample_montage.py` only exercised in a live comprehend-video run (R7+).
- No fixture smoke coverage for video helpers.
- Python/PIL/imageio-ffmpeg dependencies not vendored; `.venv` must have them.

**Status:** Deterministic asset bricks (local mode) are working; video helpers unverified.

**Reference:** `REUSE-INDEX.md` §2 line 54, `21-CLOSEOUT-SUMMARY.md` line 23

---

### Crowdfund-Fetch.js — 422 Lines, Multiple Platforms
**Files:** `engine/bricks/crowdfund-fetch.js`

**Contents:** Kickstarter (delisted fallback to GraphQL/Wayback), Indiegogo, Crowdsupply.

**Fragility:**
- Kickstarter URLs often delisted (404). Wayback fallback rate-limited / URL format-sensitive.
- Live-only; Kickstarter 403 Cloudflare blocker deferred to R7 (documented in `21-CLOSEOUT-SUMMARY.md` line 48).
- Crowdsupply works from datacenter, but host-specific failover logic.

**Status:** Deferred R7. Partially working (host-dependent).

---

## Integration Fragility

### Integration Credentials Seam
**Files:** `engine/integrations/lib-creds.js`, `engine/integrations/surge/surge_drive.py`, `engine/integrations/shopify/shopify-*.js`, `engine/integrations/cloudflare/*.js`, `engine/integrations/klaviyo/*.js`

**Issue:** Credentials resolution chain is generic but split across files:
- `lib-creds.js` provides the resolution (`--creds` → env → `__dirname` fallback)
- Each integration replicates the pattern: Shopify, Cloudflare, Klaviyo, Surge
- No single point of truth for cred location/format

**Impact:** Operator must understand each integration's cred interface separately. Error messages vary. Difficult to audit all secret uses.

**Current state:** Unit-tested + dry-run verified in Phase 21 H4, but not centralized.

**Fix approach:** Consolidate into a single secret-loading hook with a manifest of which integrations need what, validated at startup.

**Reference:** `21-CLOSEOUT-SUMMARY.md` line 71 (follow-up note), `WIRING-BUNDLE-HANDOFF.md` §1

---

### Shopify Deployment Coupling
**Files:** `engine/integrations/shopify/shopify-deploy-funnel.js`, `engine/integrations/shopify/shopify-upload-assets.js`, `runs/arduview/_tooling/SHOPIFY-KLAVIYO-DEPLOY.md`

**Issue:** Shopify deployment code is in `engine/`, but the operational runbook lives in `runs/arduview/_tooling/SHOPIFY-KLAVIYO-DEPLOY.md`. Credentials sit in `runs/arduview/_tooling/.shopify-creds.json`.

**Impact:** Deploy step is not reproducible from the engine bundle alone — the runbook lives outside. Credentials are gitignored but path-specific to arduview.

**Fix approach:**
- Fold runbook into engine (or link it).
- Migrate `.shopify-creds.json` to `--creds` flag + env (not run-specific committed file).

**Reference:** `WIRING-BUNDLE.md` line 2

---

### Surge.sh Deployment: Live-Only
**Files:** `engine/integrations/surge/surge_drive.py`

**Status:** `dry-run-verified` — validates args, preconditions (SITE, npx, surge present), but live deploy to surge.sh not exercised in fixture smokes.

**Impact:** Real deployment unverified. First live use is R7 + unknown unknowns.

**Fragility:** Surge API changes, rate limits, TTY/pty expectations (driver spawns surge in a pseudo-terminal).

---

### Chrome-CDP: Partial & Environment-Dependent
**Files:** `engine/integrations/cdp/`

**Status:** `partial` — loads, fails gracefully (ECONNREFUSED) if Chrome unavailable. Live drive requires Windows Chrome + forwarder reachable.

**Impact:** Not usable in headless AWS environments without local Chrome setup.

**Blocker:** Live Windows Chrome via WSL loopback (documented in `reference_wsl_windows_chrome_cdp.md` reference runbook) — setup-dependent, not automated.

---

## Validator/Contract Gaps

### Validate-Analyzer.js: Not Wired into Orchestrator
**Files:** `engine/hooks/validate-analyzer.js`, `engine/bricks/funnel-analyzer-context.js`

**Issue:** Validator exists but was not wired into `route.js` or the deep-pass orchestrator until Phase 21 H1 (FIXED `91acec7`). Belief records were unvalidated, letting off-enum values pass.

**Status:** FIXED (H1), but indicates incomplete wiring coverage.

**Fragility:** Validators are hook-fired, not orchestrator-driven in some paths. Subagent runs (deep-pass SKILL) don't fire hooks; they need explicit orchestrator calls.

**Reference:** `ERROR-NOTES.md` lines 43–46, `RETRIEVAL-FAILURES-arduview.md` line 26

---

### Enum Drift Risk
**Files:** `engine/contracts/enums.json`, `engine/bricks/validate-*.js` (4 validators)

**Issue:** Closed vocabularies live in both `enums.json` and inline `new Set([...])` in 4 validators. Phase 21 H0 extracted them to the contract file, but validators still carry duplicates for back-compat.

**Impact:** If operator adds a new value to `enums.json` and forgets to update a validator, silent drift occurs.

**Fix approach:** All validators should import `enums.json`; no inline fallbacks.

**Reference:** `AMBIGUITY-LEDGER.md` §4 A4, `HARDENING.md` phase H0

---

## Null-Input Gaps (Silent Failures)

### Funnel-Score: Required-Field Check
**Files:** `engine/bricks/funnel-score.js`

**Issue:** `checkScoreableInput()` did not validate `funnel_id` or recover `amount_raised_usd` alias until Phase 21 H2a (FIXED `30415ef`).

**Impact:** All-null `crowdfunding_stats` would score silently, producing unreliable output.

**Status:** FIXED (now checks for required fields and rejects if missing).

---

### Funnel-Store.js: Field Discard
**Files:** `engine/bricks/funnel-store.js:370`

**Issue:** `buildStoredRecord()` prefers wrapper for 6a funnel fields but discarded them if present in input. Phase 21 found 24 nulled values (FIXED `bbff2ff`).

**Status:** FIXED, but indicates soft data-handling logic.

---

## Unverified Live Paths (Deferred R6/R7)

### Reddit-Extract Retriever: No Clean Live Dump Captured
**Files:** `.claude/skills/reddit-extract/dump.mjs`

**Status:** SKILL is maintained, HEAD reads work, but end-to-end dump repeatedly rate-limited from AWS IP during Phase 21. OAuth path (production) not exercised.

**Deferred:** R6 (requires registered reddit OAuth app).

**Reference:** `21-CLOSEOUT-SUMMARY.md` line 48

---

### Asset-Fetch: Remote Path Unverified
**Files:** `engine/bricks/asset-fetch.js`

**Status:** Local mode working (Phase 21 h6-asset-fetch.sh). REMOTE download path (S3/CDN) not exercised.

**Deferred:** R7 (live remote artifact retrieval).

---

### Meta Ad-Fetch Adlib Typeahead
**Files:** `engine/bricks/adlib-one.js:193–220`

**Status:** Extraction works; headless typeahead empty (described above as #adlib-typeahead-resolve).

**Deferred:** R7 (requires real Windows Chrome or residential IP).

---

### Crowdfund-Fetch: Host-Specific Blockers
**Files:** `engine/bricks/crowdfund-fetch.js`

**Status:** Kickstarter 403 (Cloudflare). Crowdsupply works from datacenter. No unified solution.

**Deferred:** R7 (requires different hosting approach or API upgrade).

---

## Test Coverage Gaps

### No Offline Fixture Smoke for Video Frame Helpers
**Files:** `engine/bricks/asset/probe_video.py`, `frame-grab.py`, `sample_montage.py`

**Issue:** These helpers are live-only and only exercised in a comprehend-video run (R7+). No offline smoke.

**Impact:** Regression risk if ffmpeg/PIL behavior changes. Can't verify these work until live run.

**Priority:** Medium — video is R7+ scope, but should have fixtures.

---

### Insufficient Selector Coverage
**Files:** `engine/bricks/adlib-one.js` (line comments TODO D-17), `engine/contracts/H3-LIVE-DOM-RUNBOOK.md`

**Issue:** Multiple selector paths have no live fixture; they're documented as `TODO(D-17)` comments. Only GraphQL path has verified fixture (`runs/_fixture/adlib/flipper-zero-xhr.json`).

**Impact:** Selector-based extraction untested live. Regression risk on DOM changes.

---

## Architectural Risks

### Pipeline Topology: PROVISIONAL Naming
**Files:** `engine/contracts/REGISTRY.json` (`step_served` labels), `workflow.md`, `engine/contracts/AMBIGUITY-LEDGER.md` §4 A5

**Issue:** REGISTRY step-producer/consumer seams are marked `(PROVISIONAL)` pending reconciliation against operator's rebuilt I/O contracts.

**Impact:** Shell assembly wiring against PROVISIONAL names carries mismatch risk. R2 must reconcile real topology.

**Mitigation:** `AMBIGUITY-LEDGER.md` ruling: `workflow.md` stays operator-owned; engine reads its topology as PROVISIONAL. First run will expose gaps.

---

### DR Knowledge Bundling: Stale Content
**Files:** `engine/hooks/inject-*-dr.js` (4 injectors), `~/.knowledge/dr-marketing/` (external, old)

**Issue:** DR injectors hardcode `~/knowledge/dr-marketing/` via `os.homedir()`. This directory contains stale/operator-rejected knowledge (documented in `WIRING-BUNDLE-HANDOFF.md` §1 — "operator-confirmed 2026-06-26 … old/stale").

**Impact:** The engine ships pre-loaded with outdated marketing knowledge. Must be replaced at R5 (rebuild).

**Fix approach:** Make `DR_DIR` configurable (`--dr-dir=$DR_DIR`); ship bundle with fixture DR stub only; operator provides fresh knowledge at wire-time. Breaks stale-content dependency.

**Reference:** `WIRING-BUNDLE-HANDOFF.md` §1 line 56

---

### No-Overwrite-V1 + Reorg Risk
**Files:** All of `engine/bricks/`, `engine/contracts/`, `engine/hooks/`

**Issue:** Phase 21 reorg (`tools/` → `engine/`; multiple path breaks. Reorg was completed, but signal: distributed, implicit path knowledge makes refactoring risky.

**Fragility:** Moving or splitting large brick files (e.g., split `fetch.js` 591 lines into separate concerns) could silently break cross-references or relative paths.

**Mitigation:** Centralize path resolution; use `path.resolve(__dirname, 'relative/path')` consistently. Add linting rule to catch `../../` chain navigation.

---

## Documentation Drift

### REGISTRY Path References Pre-Consolidation
**Files:** `engine/contracts/REGISTRY.md`, `engine/contracts/REGISTRY.json`

**Issue:** REGISTRY references fixtures as `runs/_fixture/` (they live there now), but planned consolidation (`WIRING-BUNDLE-HANDOFF.md` §2) moves them into `engine/_fixture/`. Paths must be updated post-move.

**Impact:** After consolidation, REGISTRY will be stale until manually regenerated.

**Fix:** Use `engine-map` skill to regenerate paths, or manually update all `runs/_fixture/` → `engine/_fixture/` in REGISTRY + smoke scripts.

---

### REGISTRY Health Status: Not Per-Hook
**Files:** `engine/contracts/REGISTRY.json`, `engine/contracts/WIRING-BUNDLE-HANDOFF.md` §4

**Issue:** REGISTRY has a blanket `firing_hooks: { health: "working" }` entry, but only 4 of 12 hooks are actually smoke-proven. The entry conflates wired + proven.

**Impact:** A builder reading REGISTRY thinks all 12 are green; only 4 are. Misleading signal.

**Fix:** Split `firing_hooks` entry into per-hook status (8 unsmoked marked `wired-unsmoked`; 4 marked `working`).

---

## Security & Compliance

### No Audit Log for Secret Access
**Files:** `engine/integrations/lib-creds.js`

**Issue:** Credentials are resolved silently; no audit log of when/where they're used.

**Impact:** Difficult to trace credential usage or detect misuse.

**Recommendation:** Log credential resolution attempts (stderr, not stdout) with context.

---

### Integration-Specific Secret Files Still Gitignored
**Files:** `engine/integrations/shopify/.shopify-creds.json`, `engine/integrations/cloudflare/.cloudflare-creds.json` (gitignored)

**Issue:** Legacy integration load via `__dirname` default paths. If `.gitignore` rule is missed or removed, secrets can be committed.

**Fix:** Migrate all to `--creds` flag; never store in repo.

---

## Deferred Build Stages (Not Wiring Breaks, But Architectural Gaps)

### Step 3 VOC Pipeline Missing
**Files:** No code. Spec only: `handoff-step3-voc-build.md` (will be quarantined to `_legacy/` at R3)

**Issue:** Belief chains currently rest on asserted transformations, not buyer language. Step 3 (Reddit→Bucketer→Ladderer→Language) was never built.

**Impact:** Core validation methodology (comparative seed ad-longevity + buyer-language grounding) incomplete. Single largest hole in Arduview run (per `RETRIEVAL-FAILURES-arduview.md` line 64).

**Deferred:** R6 build (separate from engine hardening).

---

### Spend-Validation Lift Missing
**Files:** No code. Architectural gap in scoring.

**Issue:** No comparable-seed ad-longevity aggregator (`qualifying_creatives` gap documented in `RETRIEVAL-FAILURES-arduview.md` line 45).

**Impact:** Copy ranking ignores ad-run-duration signal. Weakens economic signal in claims.

**Deferred:** R6 build (compound: depends on VOC + adlib fixes).

---

## Summary Table: Risk by Category

| Category | Count | Blocking Shell? | Priority |
|---|---|---|---|
| Portability/hardcoded paths | 3 | Yes | Critical |
| Security (committed creds) | 1 | No (low severity) | High |
| Firing layer unsmoked | 8 | Yes | High |
| Open bugs (documented, deferred R6/R7) | 3 | No | Medium |
| Path breaks (fixed but fragile) | 2 | No | Medium |
| Large/complex bricks (>400 lines) | 5 | No | Low |
| Integration fragility | 3 | No | Medium |
| Validator/contract gaps | 2 | No | Medium |
| Null-input handling | 2 | No (fixed) | Low |
| Live-only paths (unverified) | 4 | No | Low |
| Test coverage gaps | 2 | No | Low |
| Architectural (PROVISIONAL naming) | 1 | No (R2 mitigates) | Low |
| Stale DR knowledge bundling | 1 | No (R5 mitigates) | Low |
| Documentation drift (post-consolidation) | 2 | No (manual sync) | Low |
| Build-absent stages (VOC, spend-validation) | 2 | No (R6 build) | Low |

---

## What Shell Assembly Must Know

1. **Before wiring the shell:** Migrate hardcoded paths (`surge_drive.py`, `adlib-sweep.js`, 4 DR injectors) to flags + env; parameterize `DR_DIR`; remove committed surge credentials.

2. **Before firing the bricks:** Add 8 missing smoke tests for unproven hooks (`route.js`, 5 validators, 3 DR injectors). Current `h6-all.sh` validates bricks, not firing layer.

3. **At wire-time:** R2 reconciliation must align PROVISIONAL step names against operator's new topology; `REGISTRY.json` is not yet a reliable contract.

4. **For live runs:** Expect #adlib-typeahead-resolve (headless blocker), #reddit-extract-fingerprint (WAF/IP), and crowdfund-fetch (host-specific failures) to re-occur. These are deferred-not-broken.

5. **Know what's missing:** VOC pipeline + spend-validation lift are R6 builds, not wiring fixes. Engine is a skeleton; marketing agents + the missing stages are the meat.

---

*Concerns audit completed 2026-06-26. All file paths verified against git HEAD. Status reflects `21-CLOSEOUT-SUMMARY.md` + Phase 21 H6 closeout.*
