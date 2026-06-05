---
phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f
verified: 2026-06-05T00:00:00Z
status: passed
score: 8/8
overrides_applied: 0
---

# Phase 20: Deep-Pass Bug Fixes — Verification Report

**Phase Goal:** Apply the remaining SAFE-NOW fail-loud bug fixes from the funnel deep-pass audit (Track B) so a fresh real run surfaces a clear message instead of silently producing null/wrong-path/dropped-section/stubbed output. Fixing existing tools + prompts only — no new capabilities, no schema freeze (Track C / Phase 21).
**Verified:** 2026-06-05
**Status:** passed
**Re-verification:** No — initial verification

---

## Goal Achievement

### Observable Truths

| # | Decision | Truth | Status | Evidence |
|---|----------|-------|--------|----------|
| 1 | D-01 | Markdown ATX headings emit [SECTION] markers; HTML marking unaffected (no regression) | VERIFIED | Behavioral test: markdown body with `## heading` + `### heading` → 2 [SECTION] markers, zero for mid-line `#47`. HTML body with `<h2>` + `<section>` → 2 [SECTION] markers. Both confirmed live. |
| 2 | D-01 (WR-01) | ATX pass runs AFTER tag-strip (code-review fix applied) | VERIFIED | `funnel-clean.js` line ordering confirmed: tag-strip at relative position 8, ATX regex at relative position 22 (within stripToText). Comment on line 174 explicitly documents "Runs AFTER the tag-strip (WR-01)". |
| 3 | D-02 | `funnel-score.js` exits non-zero when package has no Currency A AND no Currency B | VERIFIED | Behavioral test: `nc` package (empty bound_ads, no crowdfunding_stats) → exit 1, no scored file written. `hasValidationCurrency()` helper at line 297 wired at single-file boundary (line 390) and batch boundary (line 334). |
| 4 | D-02 | Valid packages still score and exit 0 (no regression) | VERIFIED | Behavioral test: Currency B package (crowdfunding_stats present) → exit 0, scored file written. Currency A package (non-empty bound_ads) → exit 0, scored file written. Batch mode: `hadNoCurrency` flag (line 325) causes post-loop exit 1 only if any package lacked currency. |
| 5 | D-04/D-05/D-06 | funnel-deep-pass SKILL precondition has corpus-absent + no-ads-DTC exclude guards with no-stub rule and hand-feed escape hatch | VERIFIED | grep confirms: 5 occurrences of "EXCLUDE", 4 of "not stub/never stub/do not stub/not stubbing", 2 of "raw/home.html", 2 of "clean/home.md", 10 of "hand-feed/funnel-assemble" in `.claude/skills/funnel-deep-pass/SKILL.md`. Guard bash snippets at lines 101–119. |
| 6 | D-07 | Every space-map.json pointer unified on `runs/<space>/space-map.json` — zero repo-root references in .claude/, prompts/, tools/ | VERIFIED | grep: repo-root-literal=0, path-join-root=0, bare-default=0, script-run-relative=2 (aggregate-mechanisms-in-play.js line 35), canonical-docs=2 (market-selection SKILL + step1-light-pass both carry `runs/<space>/space-map.json`). |
| 7 | D-09 | Stale "Section Analyzer MUST Read that bundle" line scrubbed from prompts/funnel-deep-pass.md | VERIFIED | grep confirms no "MUST Read that bundle" match. Line 172–173 now reads: "The orchestrator EMBEDS this bundle into the Section Analyzer's spawn prompt — the analyzer never Reads it; the orchestrator regenerates the bundle if the DR sources changed." |
| 8 | D-10 | `belief_kind` and `source_routing` removed from funnel-architect SKILL.md INPUTS spec | VERIFIED | grep confirms zero occurrences of "belief_kind" and "source_routing" in `.claude/skills/funnel-architect/SKILL.md`. `belief_kind` is preserved in `prompts/funnel-deep-pass.md` SCHEMA (line 84, BELIEF_KIND_ENUM line 146) — CONTRACT-GATED work correctly deferred to Phase 21. |

**Score:** 8/8 truths verified

### D-11 — RAG Index Rebuild

| Decision | Truth | Status | Evidence |
|----------|-------|--------|----------|
| D-11 | `runs/arduview/funnels/_index.json` rebuilt; all 43 units carry `source_type` and `routing_flag` | VERIFIED | `_index.json` exists. Unit count=43. `with_routing_flag=43`, `with_source_type=43`. Sample unit keys include `source_type`, `routing_flag`. --source-type/--routing-flag RAG prefilters are now operative (no longer filtering against null). Index is gitignored regenerable scratch (not committed — no-overwrite-v1 respected). |

### Scope Guard (D-03 boundary)

| Check | Result |
|-------|--------|
| No `amount_raised_usd` normalization in funnel-score.js or funnel-clean.js | PASS — zero matches |
| No field-name schema validation (required-field enforcement) leaked in | PASS — zero matches |
| No new npm dependencies | PASS — package.json unchanged |

---

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `tools/funnel-clean.js` | Section-marking for HTML heading tags AND markdown ATX headings | VERIFIED | ATX regex `/^#{1,6}[ \t]+/gm` at line 181, after tag-strip at line 167. WR-01 code-review fix applied. |
| `tools/funnel-score.js` | Fail-loud guard with `process.exit(1)` on no-currency packages | VERIFIED | `hasValidationCurrency()` at line 297; wired at single-file (line 390) and batch (line 334) CLI boundaries. |
| `.claude/skills/funnel-deep-pass/SKILL.md` | Corpus-absent + no-ads-DTC exclude guards in precondition | VERIFIED | PER-BRAND EXCLUDE GUARDS block at lines 95–129 with bash snippets, no-stub language, and hand-feed escape hatch referencing `funnel-assemble.js`. |
| `.claude/skills/market-selection/SKILL.md` | `runs/<space>/space-map.json` pointer | VERIFIED | Contains `runs/<space>/space-map.json`; no repo-root references. |
| `prompts/step1-light-pass.md` | Classifier write-path pinned to `runs/<space>/space-map.json` | VERIFIED | Contains `runs/<space>/space-map.json` (canonical-docs count=2 confirmed). |
| `tools/aggregate-mechanisms-in-play.js` | SPACE_MAP default migrated to `runs/arduview/space-map.json` | VERIFIED | Line 35: `path.join(ROOT, 'runs', 'arduview', 'space-map.json')`. No `path.join(ROOT, 'space-map.json')` form remains. |
| `prompts/funnel-deep-pass.md` | Stale Read instruction scrubbed | VERIFIED | Embed framing in place at lines 172–173. No "MUST Read that bundle" anywhere in file. |
| `.claude/skills/funnel-architect/SKILL.md` | INPUTS spec free of `belief_kind` / `source_routing` ghost fields | VERIFIED | Zero occurrences of both fields in the file. |
| `runs/arduview/funnels/_index.json` | RAG index with `source_type` + `routing_flag` on each unit | VERIFIED | 43/43 units carry both fields. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `funnel-clean.js stripToText` | `[SECTION]` marker emission | `/^#{1,6}[ \t]+/gm` regex after tag-strip | VERIFIED | Live test confirms 2 markers emitted on markdown body with 2 ATX headings; mid-line `#` does not trigger. |
| `funnel-score.js scoreFunnelPackage / CLI boundary` | non-zero exit | `hasValidationCurrency()` → `process.exit(1)` | VERIFIED | `hasValidationCurrency` reuses `scoreCurrencyA` + `scoreCurrencyB`; wired at both CLI paths. |
| `funnel-deep-pass SKILL PRECONDITION CHECK` | exclude-with-message on absent corpus / no-currency | PER-BRAND EXCLUDE GUARDS block | VERIFIED | Both bash snippets present; "not stubbing" language explicit. |
| `aggregate-mechanisms-in-play.js --space-map default` | `runs/arduview/space-map.json` | `path.join(ROOT, 'runs', 'arduview', 'space-map.json')` | VERIFIED | Line 35 confirmed; usage-doc comment updated to match. |

### Behavioral Spot-Checks

| Behavior | Result | Status |
|----------|--------|--------|
| `funnel-clean.js` on markdown body: ≥2 [SECTION] markers, no mid-line `#` trigger | sections=2, midHash=false | PASS |
| `funnel-clean.js` on HTML body: [SECTION] markers still emitted (no regression) | sections=2 | PASS |
| `funnel-score.js` no-currency package: exit 1, no scored file written | rcA=1, wroteNc=false | PASS |
| `funnel-score.js` Currency B package: exit 0, scored file written | rcB=0, wroteCf=true | PASS |
| `funnel-score.js` Currency A package: exit 0, scored file written | rcC=0, wroteAds=true | PASS |
| RAG index: 43 units with routing_flag + source_type | with_routing_flag=43, with_source_type=43 | PASS |

### Anti-Patterns Found

None found. No TODO/FIXME/placeholder comments in modified files. No empty return stubs. No hardcoded empty data passed to rendering paths. No new npm dependencies.

The code-review warning WR-01 (ATX pass running before tag-strip) was found and fixed in commit `54ea38d` — the ATX pass now runs after the tag-strip. This fix is verified above (line ordering confirmed).

The code-review info item IN-01 (hardcoded `arduview` default in aggregate-mechanisms-in-play.js) is a known deferred footgun documented in 20-REVIEW.md. It is out of scope for Phase 20 (D-07 scoped to path unification, not space parameterization). Not a blocker.

### Human Verification Required

None. All must-haves are verifiable programmatically. The behavioral spot-checks confirmed live execution of the key code paths.

---

## Gaps Summary

No gaps. All 8 decisions (D-01, D-02, D-04, D-05, D-06, D-07, D-09, D-10) verified in the codebase. D-11 verified live. Scope guard (D-03) confirmed clean. Code-review fix (WR-01) confirmed applied.

---

_Verified: 2026-06-05_
_Verifier: Claude (gsd-verifier)_
