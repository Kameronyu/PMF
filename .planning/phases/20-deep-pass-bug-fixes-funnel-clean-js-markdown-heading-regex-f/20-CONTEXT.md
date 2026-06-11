# Phase 20: Deep-pass bug fixes - Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Apply the remaining SAFE-NOW bug fixes from the funnel deep-pass pipeline audit so a fresh real run does not hit the silent-null / wrong-path / dropped-section failures the arduview run surfaced. **Fixing existing tools + prompts only — no new capabilities.**

This is Track B ("Deep-pass bug fixes") of the POST-RUN-HARDENING-PLAN. Track A (cleanup) was Phase 19. The contract-locking work (full I/O schema enforcement) is Track C — explicitly DEFERRED and gated on the marketing track settling; Phase 20 does only the minimal fail-loud behavior, not the schema freeze.

**Scope reconciliation (verified on disk, not just from the audit framing):**

| Item | State going into Phase 20 |
|---|---|
| funnel_fields persistence, normalizeUrl A/B strip | DONE (commit bbff2ff) — out of scope |
| #6 funnel-level position ordinal | LARGELY DONE — `validate-analyzer.js` already checks unique/integer/≥1; no further work unless a sequential-gap check is wanted (not requested) |
| #1 funnel-clean markdown-heading regex | TODO — in scope |
| #2 funnel-score fail-fast validation | TODO — in scope (minimal only) |
| #3 corpus-absent guard | TODO — in scope (clear-cut) |
| #4 no-ads DTC path | TODO — in scope (decision below) |
| #5 space-map.json precondition path | TODO — in scope (decision below) |
| #7 DR-injection MUST rule | LARGELY DONE — SKILL.md already encodes deterministic embed; only a stale contradicting doc line remains |

</domain>

<decisions>
## Implementation Decisions

### funnel-clean.js — markdown-heading regex (#1)
- **D-01:** Extend the section-boundary regex in `tools/funnel-clean.js` (currently ~lines 159–163, matches HTML `<h1-h4>` / `<section|article|main|aside>` only) to ALSO match markdown ATX headings (`#`, `##`, `###`…) so the `clean/home.md` fallback path stops silently dropping all `[SECTION]` markers. Make both input paths (raw HTML and clean markdown) emit section markers correctly. Claude's call — operator deferred.

### funnel-score.js — fail-fast field validation (#2)
- **D-02:** Make `funnel-score.js` **fail loud** instead of silently scoring null/"unknown". Minimum bar: error (non-zero exit) when a funnel package has **neither** `bound_ads` (Currency A) **nor** valid `crowdfunding_stats` (Currency B) — i.e. no validation currency at all → there is nothing legitimate to score.
- **D-03:** **Scope guard — do NOT build the full field-name schema validator here.** The canonical field-name contract (e.g. enforcing `amount_raised` vs `amount_raised_usd`) belongs to Track C / future Phase 21 ("Hardening: I/O contracts"). Building it now would be double-work because the marketing prompts that produce these fields have not settled. The `amount_raised_usd` mismatch is a documented footgun (run-notes §4), not a logged incident — minimal fail-fast is sufficient insurance for now.

### corpus-absent orchestrator guard (#3)
- **D-04:** Add an early-exit / exclude guard so that when `corpus/<brand>/raw/home.html` AND `corpus/<brand>/clean/home.md` are both absent, the brand is **excluded with a clear message** — never stubbed with placeholder data. Lives in the funnel-deep-pass orchestrator precondition path (`.claude/skills/funnel-deep-pass/SKILL.md`). Consistent with the project "exclude, do not stub" principle (run-notes §1).

### no-ads DTC path (#4)
- **D-05:** A DTC brand (non-crowdfunding) with no ads has **no funnel and no validation currency** — no ad→LP funnel to reconstruct (no Currency A) and no `crowdfunding_stats` (run-notes §3 forbids adding them to DTC brands → no Currency B). **Decision: EXCLUDE with a clear message, do NOT stub a fake funnel package.** Stubbing would manufacture ungrounded belief records.
- **D-06:** If a no-ads brand's landing page is ever worth analyzing, the operator **hand-feeds the LP** as a deliberate act (mirroring the existing crowdfunding hand-feed path in `funnel-assemble.js` lines ~474–553) — the pipeline never auto-invents a funnel.

### space-map.json precondition path (#5)
- **D-07:** Canonical location is **`runs/<space>/space-map.json`** (aligns with the project `runs/<space>/` output convention). Resolve the mismatch by making the **light-pass / market-selection classifier write there** (it currently writes to repo root per `.claude/skills/market-selection/SKILL.md` lines ~99–100), and ensure the funnel-deep-pass SKILL precondition check (line ~86, already checks `runs/<space>/`) matches. **Requirement: every pointer to space-map.json across all SKILLs/scripts/docs must be made internally consistent — zero remaining references to the repo-root path.** Operator deferred location choice to Claude; the binding constraint is internal consistency.

### DR-injection deterministic embed (#2/#7 in audit/08)
- **D-08:** The deterministic injection is **already built and is the source of truth** in `.claude/skills/funnel-deep-pass/SKILL.md` ("Section Analyzer NEVER `Read`s files… orchestrator EMBEDS those bytes into the spawn prompt", lines ~66–68, 142–156). `tools/funnel-analyzer-context.js` + `tools/hooks/inject-dr.js` exist and are verified. The arduview failure was an orchestration improvisation that one run, not missing tooling.
- **D-09:** The only fix needed: **scrub the one stale contradicting line** in the gutted/relocated `prompts/funnel-deep-pass.md` (line ~172: "The Section Analyzer MUST `Read` that bundle as its first step") so it cannot mislead anyone reading the old file. That file's orchestration was already relocated to SKILL.md (commit 8e45fa6); this is residual cleanup.

### ghost-field doc cleanup (audit/08 #5b)
- **D-10:** Remove `belief_kind` and `source_routing` references from `SKILL.md` INPUTS spec — they document fields the Section Analyzer never emits (audit/07). Doc-correction only. The CONTRACT-GATED version (actually ADDING these fields to the schema, audit/08 #5a) is DEFERRED to Track C / Phase 21.

### _index.json rebuild (audit/08 #6)
- **D-11:** Rebuild the stale arduview index so the `--source-type`/`--routing-flag` RAG prefilters become operative: `node tools/funnel-vectorize.js --space=arduview`. Rebuild only, no code change. Respect no-overwrite-v1 (regenerated index is regenerable scratch, gitignored per Phase 19).

### Claude's Discretion
- Exact regex form for markdown-heading matching (D-01).
- Exact error message wording and exit codes for fail-fast (D-02) and exclude guards (D-04, D-05).
- Whether the corpus-absent guard and no-ads-DTC exclude share one code path or are two checks (both produce "exclude with message").

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Scope source-of-truth
- `.planning/audit/08-deep-pass-bugs.md` — bug triage + per-bug fix designs + SAFE-NOW/CONTRACT-GATED classifications. Primary scope doc.
- `.planning/POST-RUN-HARDENING-PLAN.md` §B — Track B definition; §C/G — what is deferred and why (the gating rationale).
- `agents/funnel-deep-pass-run-notes.md` — the original 8 friction points from the arduview run (§1 corpus/ads/precondition, §3 markdown caveat, §4 stat field names, §6 DR injection). **Analysis artifact — consume, do not keep in sync.**
- `.planning/audit/07-belief-records-ingest.md` — source for the ghost-field finding (D-10).
- `.planning/audit/11-injection-and-hook-sweep.md` — position-ordinal + no-schema-enforcement context.

### Code to fix
- `tools/funnel-clean.js` §~159–163 — section-boundary regex (D-01).
- `tools/funnel-score.js` §~225–276 — `scoreCurrencyB` / `scoreFunnelPackage`, no input validation today (D-02).
- `tools/funnel-assemble.js` §~474–553 — existing crowdfunding zero-ad hand-feed path; reference for D-06.
- `.claude/skills/funnel-deep-pass/SKILL.md` §~82–96 (precondition), INPUTS spec — corpus guard (D-04), space-map path (D-07), ghost-field cleanup (D-10), DR-embed source of truth (D-08).
- `.claude/skills/market-selection/SKILL.md` §~99–100 — documents repo-root space-map.json; must change to `runs/<space>/` (D-07).
- `prompts/funnel-deep-pass.md` §~172 — stale `Read` line to scrub (D-09).
- `tools/funnel-analyzer-context.js`, `tools/hooks/inject-dr.js` — verified-built DR assembly; no change (D-08).
- `tools/hooks/validate-analyzer.js` §~283–297 — position-ordinal validation, already done (#6); no change unless sequential-gap check is later requested.
- `tools/funnel-vectorize.js` — rebuild command target (D-11).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **Crowdfunding zero-ad path** (`funnel-assemble.js` ~474–553): the pattern to mirror for D-06 hand-feed; the precedent that a `bound_ads: []` funnel is valid *when it has a validation currency*.
- **Position-ordinal validator** (`validate-analyzer.js` ~283–297): roadmap item #6 is already satisfied here.
- **Deterministic DR-embed chain** (`SKILL.md` ~142–156 + `funnel-analyzer-context.js` + `inject-dr.js`): already built; D-08/D-09 are cleanup around an existing, working mechanism.

### Established Patterns
- **"Exclude, do not stub"** (run-notes §1, project principle): absent inputs → skip with a message, never fabricate. Governs D-04 and D-05.
- **Deterministic-not-agent**: validation/guards belong in scripts/hooks, not agents (project CLAUDE.md). All Phase 20 fixes are script/prompt edits, no new agent judgment.
- **no-overwrite-v1** (project CLAUDE.md): D-11 index rebuild produces regenerable scratch (gitignored), not a mutated committed artifact.

### Integration Points
- The funnel-deep-pass orchestrator SKILL.md precondition block is where D-04 (corpus guard) and D-07 (space-map path) land.
- D-02 fail-fast sits at `funnel-score.js` input boundary, before scoring.

</code_context>

<specifics>
## Specific Ideas

- Fail-loud philosophy is the operator's explicit ask: "don't let a run silently shit the bed." Every Phase 20 fix should surface a clear message rather than degrade quietly.
- Minimal-now / contract-later split is explicit (D-03): the marketing I/O contracts are downstream of prompts that haven't settled; locking them now buys rework. Phase 20 = behavior fixes, Phase C/21 = schema freeze.
- The "three documents disagree" feeling was diagnosed as transient analysis-artifact lag (run-notes + audit/08 are snapshots to be consumed), not live doc rot. No git race / parallel sessions — history is linear and single-session. Only one live contradiction (D-09).

</specifics>

<deferred>
## Deferred Ideas

- **adlib-one.js DOM selector calibration** (audit/08 #4): a live-Meta-DOM task, not a code-logic fix. Deferred to the first real debug run (D-02 in the run plan) where the live DOM can be dumped and selectors verified. Until then, `destination_url` null-rate should be checked before trusting assembled packages.
- **`belief_kind` / `source_routing` schema ADD** (audit/08 #5a, CONTRACT-GATED): adding these as real fields the architect consumes requires defining their vocabulary — operator judgment. Deferred to Track C / Phase 21. Phase 20 only does the doc-removal half (D-10).
- **Full field-name I/O contract enforcement** (D-03 boundary): the canonical schema lock (field names, types, required-ness) is Track C / Phase 21, gated on the marketing prompts settling.
- **Sequential-gap position check**: `validate-analyzer.js` checks uniqueness/integer/≥1 but not strict 1..N no-gaps. Not requested; note only.
- **Archive consumed analysis artifacts** (audit/01–11, run-notes) once burned down — the lightweight "repo freshen-up" the operator asked about. Belongs in a later cleanup/health pass, not Phase 20. The structural anti-drift answer (agent-readable index) is Track G (`gsd-map-codebase`/`gsd-intel`/`gsd-graphify`), deliberately last.

</deferred>

---

*Phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f*
*Context gathered: 2026-06-04*
