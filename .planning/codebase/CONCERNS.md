# Codebase Concerns

**Analysis Date:** 2026-06-24

Sources: `.planning/RETRO-SESSION-HANDOFF.md`, `.planning/POST-RUN-HARDENING-PLAN.md`,
`.planning/audit/02-io-contracts-and-bloat.md`, `.planning/audit/03-retro-triage.md`,
`.planning/audit/04-spec-drift-hooks.md`, `.planning/audit/08-deep-pass-bugs.md`,
`.planning/audit/11-injection-and-hook-sweep.md`, `.planning/STATE.md`

---

## Tech Debt

**No-overwrite-v1 convention has no enforcement:**
- Issue: The no-overwrite-v1 rule (committed run outputs never mutated in place on a re-run) is documented in `CLAUDE.md` but enforced by convention only. No guard hook or script exists to block in-place mutation.
- Files: `CLAUDE.md` (rule definition, lines 14–18)
- Impact: A re-run on `runs/arduview/` can silently overwrite v1 artifacts. Provenance breaks. The convention depends entirely on the executing agent remembering the rule at the moment of the write.
- Fix approach: Build a guard hook (route.js extension or a dedicated pre-write script) that rejects any Write to a path under `runs/<space>/` where the file already exists, unless the path contains a version suffix (`v2`, `-v2`, etc.). Phase A cleanup plan (`.planning/POST-RUN-HARDENING-PLAN.md`) explicitly lists this as deferred.

**`validate-analyzer.js` is dead — belief records have no schema enforcement:**
- Issue: `tools/hooks/validate-analyzer.js` was built in Phase 03 and is the schema gate for Section Analyzer belief records. It is absent from the `route.js` dispatcher and does not run as an explicit orchestrator step in the funnel-deep-pass SKILL. The SKILL.md incorrectly states it fires via PostToolUse — it cannot, because the Section Analyzer runs as a subagent and hooks do not fire inside subagents.
- Files: `tools/hooks/route.js` (dispatches only finder, dumper, classifier, revenue), `tools/hooks/validate-analyzer.js` (built but unwired), `.claude/skills/funnel-deep-pass/SKILL-funnel-deep-pass.md` (false hook claim), `.planning/audit/11-injection-and-hook-sweep.md` (§ANTI-PATTERN B)
- Impact: Hallucinated `verbatim_refs`, off-enum `execution_type`, wrong position ordinals, and birdseye-only fields all pass through to `runs/<space>/funnels/*.json` with no rejection. Every Arduview funnel record is unvalidated.
- Fix approach: Wire `validate-analyzer.js` as an explicit orchestrator step in the funnel-deep-pass SKILL (between funnel-store.js persist and loop-next), mirroring how `validate-asset-record.js` is handled in the asset-classify skill. Also add it to `route.js` for defense-in-depth for main-session writes.

**`funnel_fields` silently discarded — 6a funnel-level fields permanently null in store:**
- Issue: `funnel-store.js` `buildStoredRecord()` reads the six funnel-level fields (`primary_claim`, `claim_type`, `awareness_entry`, `funnel_sequence`, `offer_mechanic`, `urgency_construction`) directly from the scored assembled package (`funnelPkg.*`). The Section Analyzer writes these fields inside a `funnel_fields` wrapper in its beliefs JSON. `findBeliefsForFunnel()` strips the wrapper and returns only the `belief_records` array. The six fields are loaded then discarded.
- Files: `tools/funnel-store.js` lines 113–154 (`buildStoredRecord`), lines 197–202 and 252–256 (beliefs loading)
- Impact: All four Arduview funnel records have null `primary_claim`, `awareness_entry`, `funnel_sequence`, etc. The funnel-architect consumed this data as ground truth, producing structural inferences from non-competitive sources (confirmed in `_marketing-decisions/deep-funnel-pass.md`). Bug is SAFE-NOW to fix.
- Fix approach: After loading the beliefs JSON, extract `funnel_fields` if present; pass as third argument to `buildStoredRecord(funnelPkg, beliefRecords, funnelFields)`; prefer `funnelFields.X` over `funnelPkg.X` for each of the six fields. (`.planning/audit/08-deep-pass-bugs.md` §Bug 1 has the complete fix design.)

**`belief_kind` and `source_routing` are ghost fields — documented but never emitted:**
- Issue: `.claude/skills/funnel-architect/SKILL-funnel-architect.md` references `belief_kind` and `source_routing` as belief-record fields the architect consumes. The Section Analyzer prompt does not instruct it to emit these fields. Both are absent from every stored funnel record. The architect silently receives null for both on every run.
- Files: `.claude/skills/funnel-architect/SKILL-funnel-architect.md`, Section Analyzer prompt inside `prompts/funnel-deep-pass.md`, `tools/hooks/validate-analyzer.js` (no enum for these fields)
- Impact: `source_routing` was intended to route belief records to the appropriate copy strategy. With it absent, the RAG prefilter by `routing_flag` in `funnel-rag-query.js` is inoperative (prefilters against null for every record). The copywriter receives unscoped belief records.
- Fix approach: CONTRACT-GATED on operator defining `belief_kind` vocabulary and `source_routing` categories (`.planning/POST-RUN-HARDENING-PLAN.md` Phase C). Short-term SAFE-NOW fix: remove ghost field references from `SKILL-funnel-architect.md` to match reality (`.planning/audit/08-deep-pass-bugs.md` §Bug 5b).

**`adlib-one.js` DOM selectors untested against live Meta Ad Library:**
- Issue: `tools/adlib-one.js` `extractAdCards()` uses heuristic selectors targeting `a[href]` anchors, a Library-ID ancestor walk (up to 20 parents), and heading extraction via `h1/h2/h3/[role="heading"]`. All three paths are marked `TODO(D-17)`. The Meta Ad Library DOM is React-rendered; these selectors were never validated against the live DOM.
- Files: `tools/adlib-one.js` lines 106, 112, 124, 169, 357 (TODO markers)
- Impact: `destination_url` may be broadly null across all ads, collapsing the funnel-assemble path entirely for any new run. The degree of failure is unknown until a live-DOM calibration run.
- Fix approach: Run `adlib-one.js` against a real Ad Library search page, dump raw DOM, inspect card container structure and Library-ID text location, replace heuristic selectors with verified attribute selectors. A debug-run D-02 pass was the planned trigger (`.planning/audit/08-deep-pass-bugs.md` §Bug 4).

**`normalizeUrl()` lets A/B test params through — phantom funnels:**
- Issue: `tools/funnel-assemble.js` `normalizeUrl()` strips only `utm_*` and `fbclid`. A/B test params common in Meta ads (`?variant=B`, `?test=ctrl`, `?lp=2`, `?ver=`, Shopify `_pos`/`_sid`/`_ss`/`_psq`) survive normalization. Two ads to the same LP with different A/B params produce separate funnel assemblies.
- Files: `tools/funnel-assemble.js` lines 90–122 (`normalizeUrl`), lines 103–108 (the `toDelete` filter)
- Impact: Inflated funnel count, duplicate analysis work, misleading competitive signal. The Arduview run's funnel count is unreliable for this reason.
- Fix approach: Expand the strip list with known A/B and session params. Calibrate against per-market LP URL patterns on the first debug run (`.planning/audit/08-deep-pass-bugs.md` §Bug 3 has the exact param list).

**`_index.json` is stale — RAG prefilters inoperative for Arduview run:**
- Issue: `funnel-vectorize.js` `loadUnits()` correctly stamps `source_type` and `routing_flag` from the funnel file. However, the on-disk `runs/arduview/funnels/_index.json` was built before these fields were added to the script. Every record in the current index has null for both fields.
- Files: `runs/arduview/funnels/_index.json` (stale artifact, gitignored), `tools/funnel-vectorize.js` lines 107–129
- Impact: `--source-type` and `--routing-flag` prefilters in `funnel-rag-query.js` filter against null for every record. The copywriter gets unscoped belief retrieval.
- Fix approach: Rebuild with `node tools/funnel-vectorize.js --space=arduview`. No code change. (`.planning/audit/08-deep-pass-bugs.md` §Bug 6)

**Light-pass has no orchestrator skill:**
- Issue: Every research stage is supposed to have a thin orchestrator skill (the brick model). `funnel-deep-pass` and `asset-classify` have orchestrator skills; the light-pass stage (Step 1) does not. The light-pass pipeline is driven directly from `prompts/step1-light-pass.md` which contains all four agent prompts (Finder, Roster Verifier, Dumper, Space Classifier), their output schemas, and pipeline configuration in a single 534-line file. Each spawned agent sees all other agents' prompts and schemas.
- Files: `prompts/step1-light-pass.md` (534 lines, all-in-one spec), `.planning/POST-RUN-HARDENING-PLAN.md` Phase D
- Impact: Every agent spawn in Step 1 receives ~350 lines of contamination from other agents' specs. The Finder sees the Space Classifier prompt; the Dumper sees the `space-map.json` schema it must not classify into. No validator is called between agents. Reproducibility depends on the orchestrating Claude remembering to run each agent's step in sequence.
- Fix approach: Build a light-pass orchestrator SKILL (thin sequencer: call script → spawn judgment agent → run validator → collect), mirroring the funnel-deep-pass pattern. Split agent prompts into per-agent spawn files. (`.planning/POST-RUN-HARDENING-PLAN.md` Phase D)

**`fetch.js` Google Trends extraction is broken (0% fill-rate):**
- Issue: `tools/fetch.js` `extractTrendSeries()` uses three regex patterns against the initial page HTML. Google Trends now loads the interest-over-time series via a deferred XHR/API call — the data is not embedded in initial HTML.
- Files: `tools/fetch.js` (Trends extraction section)
- Impact: `demand_trend` field is null for every brand on a full light-pass run. Gate 1 (Demand) in the market-selection skill must flag this as a DATA GAP rather than a real signal. The Arduview run had zero trend data.
- Fix approach: Switch to intercepting the deferred XHR via Playwright's `page.route()` or `page.on('response')`, or use the Google Trends public API endpoint directly. (`.planning/audit/03-retro-triage.md` §Phase 01 A1)

**`space-map.json` path mismatch breaks funnel-deep-pass precondition check:**
- Issue: The S1 Space Classifier writes `space-map.json` to the run directory. The funnel-deep-pass SKILL precondition check looks for it at a different path. On a fresh run, the precondition fails or requires manual path correction.
- Files: `.claude/skills/funnel-deep-pass/SKILL-funnel-deep-pass.md` (precondition block), `prompts/step1-light-pass.md` (where the file is actually written)
- Impact: The orchestrator must manually resolve the path on every new run. Risk of using a stale or wrong-space file if the path is not verified.
- Fix approach: Standardize the path in both the Space Classifier output instruction and the funnel-deep-pass precondition to `runs/<space>/space-map.json`. (`.planning/audit/08-deep-pass-bugs.md` §1)

**Context bloat across all pipeline stages — 53% of injected tokens are irrelevant per agent:**
- Issue: Multiple agents receive far more context than they need. Six specific over-read cases are quantified in `.planning/audit/02-io-contracts-and-bloat.md` §B:
  1. `definitions.md` (378 lines) fully loaded by Dumper — only CLUSTER 1+2 (~140 lines) are used; ~200 lines wasted per Dumper spawn.
  2. `step1-light-pass.md` (534 lines) fully loaded by all four light-pass agents — ~350 lines of contamination per spawn.
  3. `workflow.md` (362 lines) fully loaded by market-selection — only the Step 0 section (~30 lines) is needed; ~330 lines wasted.
  4. `~/knowledge/dr-marketing/ecommerce--mark-builds-brands.md` (283 lines) in the market-selection DR bundle — ~278 lines wasted (the anti-fluke logic it was included for is already inlined in SKILL.md).
  5. `~/knowledge/dr-marketing/brand-building--spencer-origins.md` (180 lines) in the market-selection bundle — only ~50 lines (MARKET SOPHISTICATION section) are used; ~130 wasted.
  6. `consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md` (79 lines) in the Section Analyzer DR bundle — nothing maps to Analyzer schema fields; all 79 lines wasted per analyzer spawn.
- Files: `tools/hooks/inject-market-selection-dr.js`, `tools/hooks/inject-dr.js`, `prompts/step1-light-pass.md`, `definitions.md`, `workflow.md`
- Impact: Elevated per-run cost. More critically, agents receiving irrelevant context risk anchoring on it. The Arduview market-selection run had zero DR grounding on its first execution (DR files were listed as auto-injected but no mechanism existed).
- Fix approach: Per recommendations in `.planning/audit/02-io-contracts-and-bloat.md` — create `definitions-dumper.md` (CLUSTER 1+2 only); inline the Step 0 gap variables directly in market-selection SKILL.md and drop the workflow.md read; remove `ecommerce--mark-builds-brands.md` and `consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md` from their respective bundles. Addressed in Phase C (`.planning/POST-RUN-HARDENING-PLAN.md`).

---

## Known Bugs

**`funnel-score.js` accepts wrong input file — silently produces null for crowdfunding fields:**
- Symptoms: `crowdfunding_stats` fields (`amount_raised`, `backers_count`) are null in scored output when `funnels-clean/` JSON is passed instead of the assembled package.
- Files: `tools/funnel-score.js` (no required-field check at CLI boundary)
- Trigger: Operator passes `funnels-clean/<id>-clean.json` to `funnel-score.js`. The clean file has no ads or crowdfunding stats. The script accepts any JSON without checking required fields are present.
- Workaround: Pass the assembled package from `funnels-assembled/` as documented in `agents/funnel-deep-pass-run-notes.md` §5.

**`crowdfunding_stats` field name mismatch — silent nulls:**
- Symptoms: `amount_raised` resolves null in scored output even when the crowdfund-fetch ran successfully.
- Files: `tools/funnel-score.js` or the field read path from `crowdfund-fetch.js` output
- Trigger: Using `amount_raised_usd` (wrong key) instead of `amount_raised` (correct key). Documented in `agents/funnel-deep-pass-run-notes.md` §4.
- Workaround: Use the correct field name. No schema validation at the input boundary to catch this.

---

## Security Considerations

**No SSRF issues in new code (confirmed):**
- `tools/crowdfund-fetch.js` has `ssrfGuard()` ported from `funnel-assemble.js`. DNS failure defaults to skip (fail-closed). `169.254.254.254` cloud metadata caught by link-local CIDR check. (`.planning/STATE.md` Phase 03 decisions)
- No additional surface identified.

**Operator-supplied URLs pass through `funnel-assemble.js` without SSRF guard:**
- Risk: `funnel-assemble.js` calls `ssrfGuard()` but only for URLs in the assembled funnel body. Operator-supplied override URLs (e.g., direct LP URLs passed at run time) may bypass the guard if passed outside the standard input contract.
- Files: `tools/funnel-assemble.js` (`ssrfGuard` call sites)
- Current mitigation: `ssrfGuard()` is present; gap is whether it's called for all URL sources.
- Recommendations: Audit all URL entry points in `funnel-assemble.js` and confirm `ssrfGuard()` is called before any fetch.

---

## Fragile Areas

**DR injection is compliance-based in 4 surviving doc locations:**
- Files: `.planning/ROADMAP.md` line 92 (still says "auto-injected"), `.planning/phases/15-stage-m1-s15-funnel-architect-copywriter/15-SPEC-funnel-architect.md` line ~107 (source spec preserved verbatim, says "auto-injected/pasted alongside"), `.planning/phases/02-stage-m1-s2-market-selection-gate/02-PATTERNS.md` lines 214–217 ("Claude's discretion"), `.planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-03-SUMMARY.md` lines 12+80 (calls inject-dr.js "auto-injection hook")
- Why fragile: A new operator or subagent reading any of these four docs as authoritative gets the wrong instruction. The original zero-grounding run was caused by exactly this. The corrected SKILL.md and the incorrect source spec live in the same codebase with no single authority.
- Safe modification: `.planning/audit/11-injection-and-hook-sweep.md` identifies each instance (A-1, A-2, A-5, A-8). The corrected pattern is `read_first` block pointing to a pre-built generated bundle (confirmed working in market-selection and funnel-architect SKILL.md).

**Copywriter skill is structurally incomplete — SKILL.md stub only:**
- Files: `.claude/skills/copywriter/` contains only `_dr-context.generated-copywriter.md.md` (note the doubled `.md.md` extension — this is a naming error). No `SKILL.md` exists.
- Why fragile: The DR bundle exists for the copywriter but the skill that would use it via `read_first` has not been built. The downstream consumer of the funnel-architect copy brief has no defined I/O contract, no orchestration steps, and no validator. The inject-copywriter-dr.js bundler (`tools/hooks/inject-copywriter-dr.js`) exists as a CLI script requiring explicit invocation.
- Safe modification: The copywriter SKILL.md build is gated on the operator locking the copywriter prompt (marketing track, `_marketing-decisions/funnel-architect-copywriter.md`). Do not build the SKILL.md until that lock lands; stub states are intentional. (`.planning/RETRO-SESSION-HANDOFF.md` §OPEN MARKETING PROBLEMS)

**funnel-architect output has no file contract:**
- Files: `.claude/skills/funnel-architect/SKILL-funnel-architect.md` (OUTPUTS section — conversational only), `.planning/audit/02-io-contracts-and-bloat.md` §ORPHAN OUTPUTS
- Why fragile: The copy brief produced by the funnel-architect is a working-session artifact with no canonical output path, no schema, and no validator. If the architect session ends, the brief is gone. The downstream copywriter reads `runs/<space>/funnels/_index.json` (the RAG index), not the brief directly. There is no machine-readable handoff from architect to copywriter.
- Safe modification: Define a canonical path (`runs/<space>/FUNNEL-DESIGN.md` is used in practice for Arduview) and a structured brief schema. Add this to Phase C (I/O contracts keystone, `.planning/POST-RUN-HARDENING-PLAN.md`).

**Roster Verifier output is conversational — no persisted canonical file:**
- Files: `prompts/step1-light-pass.md` (§1.5 Roster Verifier), `.planning/audit/02-io-contracts-and-bloat.md` §ORPHAN OUTPUTS
- Why fragile: The Roster Verifier emits inline JSON (slop_flags, missing_brands, dedup_channel_fixes, verdict, summary). There is no persisted file. Handoff to the next step is a human approval gate. If the session is interrupted or the output scrolls out of context, the verdict is lost and must be re-run.
- Safe modification: Add a canonical write target (`runs/<space>/roster-verdict.json`) to the Roster Verifier output contract. Straightforward addition in the light-pass orchestrator build (Phase D).

**`runs/eink-tablets/` is untracked and was supposed to be quarantined:**
- Files: `runs/eink-tablets/` (untracked, shows up in `git status`)
- Why fragile: The InkLeaf RETIRED decision (`ROADMAP.md` header, Phase 19) called for quarantining `runs/eink-tablets/` to `_quarantine/`. Phase 19 executed the archived deletions but this directory remains untracked. It contains live belief records (`inkleaf-deep-pass/inkleaf-b6dc125e-beliefs.json`) that are not part of the current build.
- Safe modification: Either commit the directory to `_quarantine/` (for provenance) or gitignore it. Do not reference it in any pipeline step.

**`runs/arduview/_tooling/clickxy.cjs` is untracked:**
- Files: `runs/arduview/_tooling/clickxy.cjs`
- Why fragile: New tooling file untracked in an active run directory. Under the no-overwrite-v1 convention, any tooling added to `runs/<space>/` should be tracked if it's a committed artifact, or explicitly gitignored if it's scratch.

**`runs/arduview/asset-classify/cuts/` is untracked:**
- Files: `runs/arduview/asset-classify/cuts/`
- Why fragile: Untracked output directory in the asset-classify run. If this is a v1 artifact (generated from the first classify run), it should either be committed or explicitly gitignored per the no-overwrite-v1 rule.

---

## Missing Critical Features

**I/O contracts between pipeline stages are undocumented:**
- Problem: No machine-readable I/O contract exists that specifies each stage's inputs, outputs, and downstream consumers. The audit in `.planning/audit/02-io-contracts-and-bloat.md` is the closest thing — a manually produced prose table. The contract between funnel-architect (producer) and copywriter (consumer) is entirely informal.
- Blocks: Building downstream stages (Phase C) without contracts risks rework. The `belief_kind`/`source_routing` ghost field problem is a direct consequence. Operators cannot validate whether a stage consumed its correct inputs without running the full pipeline.
- Planned as: Phase C — `.planning/POST-RUN-HARDENING-PLAN.md` (GATED on operator marketing lock)

**Copywriter prompt has no skill — 15-04 plan not executed:**
- Problem: The copywriter prompt was not authored during Phase 15. `.claude/skills/copywriter/` contains only the generated DR bundle (with a doubled `.md.md` filename bug). No `SKILL.md`, no output schema, no validator.
- Blocks: The funnel-architect copy brief has no downstream executor. The full Step 4 pipeline (architect → copywriter → LP builder) has a broken handoff at the copywriter seam.
- Planned as: Phase E, gated on operator locking the copywriter prompt (`.planning/POST-RUN-HARDENING-PLAN.md`)

**Diagnosis via raw subagents instead of GSD machinery — roadmap derived from untrusted audit:**
- Problem: The entire `.planning/audit/01–11` audit was run as freelance subagents (plain `Agent`/`Explore`), not via `gsd-forensics` / `gsd-map-codebase` / `gsd-intel`. The operator requested GSD tooling 4+ times during the session. As a result, `POST-RUN-HARDENING-PLAN.md` and the current Phase 19–20 roadmap are derived from an untrusted raw audit that demonstrably missed at least one file (`agents/funnel-deep-pass-run-notes.md`) and never audited doc drift.
- Blocks: Phase 19+ plans cannot be trusted as complete. The RETRO-SESSION-HANDOFF.md explicitly demotes `.planning/audit/` to cross-check status. The redo sequence requires `gsd-forensics` on the arduview run first (`.planning/RETRO-SESSION-HANDOFF.md` §GSD WORKFLOW TO RUN).
- Current state: The Phase 19 cleanup and Phase 20 bug fixes are committed and verified. The remaining roadmap (Phases 21+) should be re-derived from a `gsd-forensics` run before execution.

**Three planned additions not yet in the roadmap:**
- Problem: `.planning/RETRO-SESSION-HANDOFF.md` §LOCKED DECISIONS #10 lists three features the operator wants but that were not yet added to the roadmap at session close: (a) doc-consistency as its own phase (canonical-source registry + drift check + prevention system), (b) end-to-end coherence verification phase (`gsd-integration-checker` — validate every producer→consumer seam on a reference run), (c) contract-before-build gate enforced in `gsd-plan-phase`/`gsd-plan-checker`.
- Blocks: Without the doc-consistency phase, the 4 surviving "auto-inject" lie instances and the spec drift pattern that caused the zero-grounding run will recur. Without the E2E coherence phase, the pipeline can drift out of agreement between stages silently.

---

## Test Coverage Gaps

**No end-to-end pipeline test — verification is UAT only:**
- What's not tested: The pipeline has no automated integration test. The only verification mechanism is running the pipeline on a reference space (UAT) and having the operator read the output. There are no unit tests for any script in `tools/`.
- Files: All of `tools/` — `funnel-store.js`, `funnel-assemble.js`, `funnel-score.js`, `funnel-clean.js`, `adlib-one.js`, `crowdfund-fetch.js`, `asset-emit.js`, `asset-map-rank.js`
- Risk: The `funnel_fields` discard bug (Bug 1 above) was not caught until a post-run audit because there is no assertion that the 6a fields are populated in the stored record. Similarly, the `normalizeUrl()` phantom-funnel bug has no test covering A/B param handling.
- Priority: Medium — the brick model (scripts are deterministic, agents are judgment) makes scripts the correct target for unit tests. The highest-value tests would be for `funnel-store.js` (round-trip: beliefs JSON in → stored record with populated funnel_fields out) and `funnel-assemble.js` (normalizeUrl: A/B params stripped).

**Hook validators are wired but their rejection behavior is untested on live runs:**
- What's not tested: `validate-finder.js`, `validate-dumper.js`, `validate-classifier.js`, `validate-revenue.js` fire via PostToolUse on Write events in the main session. There is no test confirming they correctly reject malformed output (exit 2) vs. pass valid output (exit 0) on real pipeline artifacts.
- Files: `tools/hooks/validate-finder.js`, `tools/hooks/validate-dumper.js`, `tools/hooks/validate-classifier.js`, `tools/hooks/validate-revenue.js`, `.claude/settings.json` (hook configuration)
- Risk: A false-negative validator (bug in the validator itself that fails to reject bad output) would be invisible until a downstream stage consumed the bad data.
- Priority: Low — the validators are straightforward schema checks and were smoke-tested during phase execution. Risk is low but coverage is zero.

---

## Open Marketing Blockers (operator-owned, not engineering)

**`runs/arduview/_marketing-decisions/` contains open problems, not decisions:**
- Files: `runs/arduview/_marketing-decisions/INDEX.md`, `light-pass.md`, `funnel-architect-copywriter.md`, `deep-funnel-pass.md`, `lp-builder.md`
- Status: These are unresolved marketing problems from the Arduview run. The folder name "decisions" is a misnomer. They document what went wrong marketing-wise. None of these files unlocks engineering gates yet. The operator is still working through the architecture + inputs/outputs for each stage.
- Specific open items blocking Phase C: the `belief_kind`/`source_routing` vocabulary (operator defines what categories exist), the belief-tagging validation for 43 belief records (Task 3 validation — never marketing-validated), the crowdfunding-vs-general DR distinction.

**Task 3 belief-tagging validation never ran:**
- Files: `.planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md` (Task 3 section is a deferred stub), `runs/arduview/_marketing-decisions/deep-funnel-pass.md` (6 open items)
- Status: The 43 Arduview belief records were analyzed by the Section Analyzer but were never validated by the operator for marketing correctness. The funnel-architect consumed them as ground truth. Phase C cannot be gated open until this validation runs.

---

*Concerns audit: 2026-06-24*
