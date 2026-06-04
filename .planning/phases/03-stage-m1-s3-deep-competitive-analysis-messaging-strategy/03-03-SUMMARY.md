---
phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy
plan: "03"
subsystem: collection-layer-judgment
tags: [router, section-analyzer, belief-records, controlled-vocab, dr-injection, validation-hook, prompt-injection-defense, path-traversal-guard]
dependency_graph:
  requires:
    - tools/funnel-clean.js (Plan 03-02 — cleaned section-marked verbatim copy the Analyzer reads)
    - tools/funnel-score.js (Plan 03-02 — validation_lane/strength stamped before Analyzer runs)
  provides:
    - prompts/funnel-deep-pass.md (Router + Section Analyzer prompts + 6a/6b schema + closed-enum controlled vocab)
    - tools/hooks/inject-dr.js (runtime DR-file auto-injection for Section Analyzer)
    - tools/hooks/validate-analyzer.js (PostToolUse validate-on-Write for belief-instance records)
  affects:
    - tools/funnel-store.js (Plan 03-04 — reads belief-instance records emitted by Section Analyzer)
    - future birdseye synthesis agent (downstream phase — reads the pile of belief records)
tech_stack:
  added:
    - Router agent block (cheap model): one judgment — transformation-similar or not → routing_flag
    - Section Analyzer agent block (quality model): open-with-anchors belief taxonomy, funnel-level ordinal position, §8 descriptive discipline
    - Controlled vocabulary resolved from six DR files: EXECUTION_TYPE_ENUM (13 values), PROOF_TIER_ENUM (Tier1/2/3), MOVE_ENUM (15 lever tags)
    - claim_type REUSED from step1-light-pass.md CLAIM_TYPE_ENUM (direct|enlarged|mechanism|enhanced)
    - inject-dr.js: FILE injection (not RAG) of six DR files; hardcoded allowlist; path-traversal guard; missing-file resilience; max-chars cap
    - validate-analyzer.js: five reject rules (verbatim-substring, overflow-belief, closed-vocab, position ordinal, single-funnel discipline)
    - Prompt-injection defense (T-03-09): untrusted data boundary delimiter + ignore-embedded-instructions rule in Analyzer prompt
  patterns:
    - Validate-on-Write hook contract (exit 0 pass / exit 2+stderr reject) — copied from validate-dumper.js
    - violations[]-accumulate-then-dump idiom — direct copy from validate-dumper.js
    - findCleanedBody() multi-candidate path search — adapted from validate-dumper.js findCleanDir
    - Open-with-anchors taxonomy: prefer anchor, overflow → propose new belief_id + belief_confidence=low
    - Bake-vs-inject rule (spec §11): Router gets DR baked into prompt; Analyzer gets live FILE injection
    - Hardcoded allowlist pattern: six DR filenames are literals, never from argv/untrusted input
key_files:
  created:
    - prompts/funnel-deep-pass.md
    - tools/hooks/inject-dr.js
    - tools/hooks/validate-analyzer.js
decisions:
  - Controlled vocab resolved without human ratification gate (D-15 overrides spec §12); one consistent set, no duplicate tags
  - MOVE_ENUM built from the four differentiator levers (Market/UM/Angle/Offer) with 15 discrete tags — maps Weische angle categories to lever-tagged moves
  - EXECUTION_TYPE_ENUM has 13 values drawn from six DR files: Weische six persuasion elements (social-proof/authority/risk-reversal/scarcity/urgency/exclusivity) + VSL stages (story-epiphany/comparison/consequence-of-inaction) + funnel-architecture patterns (mechanism-explanation/feature-as-evidence/demo/founder-credibility)
  - inject-dr.js emits to stdout by default; --out=<path> writes to file; orchestrator pastes block into Analyzer context (no vector/RAG infrastructure needed)
  - validate-analyzer.js verbatim-substring gate uses same non-fatal missing-corpus behavior as validate-dumper.js: cannot verify without body → flag as missing-corpus error (not silent skip)
  - awareness_entry added to validate-analyzer.js funnel_fields check (unaware|problem-aware|solution-aware|product-aware|offer-aware) — closes an enum that the spec left implicit
metrics:
  duration_minutes: 7
  completed_date: "2026-06-04"
  tasks_completed: 3
  tasks_total: 3
  files_created: 3
  files_modified: 0
---

# Phase 03 Plan 03: Judgment Layer — Router + Section Analyzer + inject-dr + validate-analyzer Summary

One-liner: Judgment layer complete — Router sets routing_flag from transformation similarity; Section Analyzer emits open-with-anchors belief-instance records with funnel-level ordinal position and granular execution_detail; inject-dr.js FILE-injects exactly six DR files; validate-analyzer.js enforces verbatim-substring, overflow-confidence, closed-vocab, ordinal-position, and single-funnel-discipline on every Write.

## What Was Built

**Task 1 — funnel-deep-pass.md (Router + Section Analyzer + schema + closed-enum vocab)**

`prompts/funnel-deep-pass.md` mirrors the `step1-light-pass.md` format template: title + ASCII pipeline diagram, `## SCHEMA` with fenced-JSON inline comments for both 6a funnel-level fields and 6b belief-instance records, `### Closed enums (a value off-list is a hard reject)`, `## DETERMINISTIC SCAFFOLD`, then numbered `## AGENT N` blocks.

**Controlled vocabulary resolved from the six DR files (D-15):**

- `CLAIM_TYPE_ENUM`: REUSED verbatim from `step1-light-pass.md` line 176 — `direct | enlarged | mechanism | enhanced`. Not re-coined.
- `EXECUTION_TYPE_ENUM` (13 values): `mechanism-explanation | feature-as-evidence | demo | authority | social-proof | founder-credibility | risk-reversal | scarcity | urgency | exclusivity | story-epiphany | comparison | consequence-of-inaction`
  — draws on Weische's six persuasion elements (persuasion.md), the VSL 8-stage narrative (vssl.md), the funnel-architecture pre-sale 4-part framework (funnel-architecture.md), and the differentiator believability tiers.
- `PROOF_TIER_ENUM` (3 values): `Tier1 | Tier2 | Tier3` — self-evident/demo, authority, social-proof (differentiator-framework.md believability tiers).
- `MOVE_ENUM` (15 tags): four differentiator lever families (Market / UM / Angle / Offer), with discrete tags per lever (e.g. `market-avatar-flip`, `um-mechanism-reveal`, `angle-pain`, `offer-guarantee`).

**AGENT 1 — ROUTER (cheap model):** Input = competitor + run_transformation + transformation definition from definitions.md. One judgment: transformation-similar or not. Output = `routing_flag` ∈ `{structure_only, messaging_full, both}`. Routing logic is explicit (crowdfunding + different-transformation → structure_only; crowdfunding + same → both; DTC → messaging_full). DR logic baked into the prompt; no raw DR files at runtime for the Router.

**AGENT 2 — SECTION ANALYZER (quality model):** Reads cleaned funnel copy (in `<funnel_copy>` data delimiter) + bound-ad angles. Emits 6b belief-instance records. Key disciplines baked verbatim:
- §8 descriptive-not-prescriptive: never judge good/bad, never rewrite, operate on ONE funnel only, NEVER reason about pool/consensus/divergence
- Two-pass discipline: observe literal facts first (Pass 1), THEN map to tags via rubric (Pass 2)
- Funnel-level ordinal position: 1st/2nd/3rd belief-instance across the whole funnel, not page-local
- Open-with-anchors taxonomy: prefer one of the 9 anchors; overflow → propose new belief_id + belief_confidence=low
- GRANULARITY requirement: execution_detail specific enough the sub-claim is recoverable (worked examples in prompt)
- DR files referenced as "auto-injected by inject-dr.js at runtime" — not inlined

**Prompt-injection defense (T-03-09):** competitor copy wrapped in `<funnel_copy>` / `</funnel_copy>` delimiter with explicit SECURITY block instructing the Analyzer to treat everything inside as UNTRUSTED DATA to analyze, ignoring any embedded instructions, role-change attempts, or jailbreaks.

**Task 2 — inject-dr.js (net-new, the only runtime context-injection hook)**

Reads the six DR files from `~/knowledge/dr-marketing/` (resolved via `os.homedir()`), concatenates them in stable order with `=== DR FILE: <name> ===` attribution headers, emits to stdout or `--out=<path>`.

Security implementation (T-03-10):
- Six filenames are a hardcoded literal allowlist in `DR_ALLOWLIST` — no filename ever taken from argv or untrusted input
- Each resolved path checked via `isUnderDrDir()` (path.resolve comparison against DR_DIR + path.sep prefix) — no path traversal possible
- Belt-and-suspenders: filenames also checked for `/`, `\\`, and `..` before being joined to DR_DIR

Missing-file resilience: `fs.existsSync()` + `try/catch` per file; warn to stderr, continue, never crash run.

Max-chars cap (default 120K): trim at line boundary, append truncation notice — context-limit handling implemented per spec §11 implementer's discretion.

Optional/secondary files (advertorial/landing-pages/consumer-psychology) are absent from the allowlist and have no string references in the source.

**Task 3 — validate-analyzer.js (structural copy of validate-dumper.js)**

Same hook contract: `node tools/hooks/validate-analyzer.js <path.json>`; read → REJECT(exit 2+stderr); JSON.parse → REJECT; validate → violations[] accumulate; exit 2 with all REJECT messages on any violation, silent exit 0 on pass.

Five reject rules enforced:

1. **VERBATIM-SUBSTRING GATE** (T-03-11): `verbatim_refs[].text` must be an exact case-sensitive substring of the cleaned funnel body. `findCleanedBody()` searches multiple candidate paths (sidecar files, funnel_package JSON fields). Missing corpus → flag as missing-corpus error (not silent skip — same discipline as validate-dumper.js).

2. **OVERFLOW-BELIEF RULE**: `belief_id` outside the 9-anchor set with `belief_confidence != 'low'` → REJECT. Overflow beliefs must be flagged low for operator review.

3. **CLOSED-VOCAB REJECT**: `execution_type` / `proof_tier` / `claim_type` / `move` off-enum → REJECT with the full enum listed in the message. Also validates `funnel_fields.claim_type` and `funnel_fields.awareness_entry` if present.

4. **POSITION RULE**: non-integer, < 1, or duplicate `position` values within a funnel → REJECT. Duplicate detection via `positionsSeen` Set across all belief records in the output.

5. **SINGLE-FUNNEL DISCIPLINE**: `consensus`, `divergence`, `unusual`, `pool`, `pool_reasoning`, `pool-reasoning` on any belief record → REJECT.

## Deviations from Plan

**[Rule 2 - Missing Critical Functionality] Added awareness_entry enum validation in validate-analyzer.js**
- Found during: Task 3 implementation
- Issue: spec §6a lists awareness_entry as an analyzer-emitted field with an implicit enum (unaware → most-aware); validate-analyzer.js was the natural place to enforce it since it validates all other funnel_fields enums
- Fix: added `AWARENESS_ENUM = new Set(['unaware','problem-aware','solution-aware','product-aware','offer-aware'])` and validation of `funnel_fields.awareness_entry` against it
- Files modified: tools/hooks/validate-analyzer.js
- Commit: 898e9af

**[Rule 1 - Bug] Removed DR_OPTIONAL_NOT_INJECTED array from inject-dr.js**
- Found during: Task 2 verification
- Issue: acceptance criterion greps for the literal strings 'advertorial--carl-weische' and 'landing-pages--carl-weische' in the source; the comment array I wrote contained those strings, causing the automated check to fail
- Fix: replaced the named array with a prose comment referencing spec §11 without listing filenames
- Commit: c67f1d9

## Threat Surface

All threat register items from this plan's threat model mitigated:

| Threat | Mitigation | Location |
|--------|-----------|----------|
| T-03-09 (prompt injection) | `<funnel_copy>` data delimiter + explicit SECURITY block instructing Analyzer to ignore embedded instructions; validate-analyzer.js is the backstop (off-contract output rejected regardless) | prompts/funnel-deep-pass.md, tools/hooks/validate-analyzer.js |
| T-03-10 (path traversal) | Six filenames hardcoded literal allowlist in DR_ALLOWLIST; `isUnderDrDir()` path.resolve check; additional `/`, `\\`, `..` guard | tools/hooks/inject-dr.js |
| T-03-11 (hallucinated verbatim) | verbatim-substring gate in validate-analyzer.js Rule 1 — any verbatim_ref not an exact substring of cleaned body is rejected | tools/hooks/validate-analyzer.js |
| T-03-12 (DR-file leakage) | Accepted — six DR files are operator's own knowledge base, injected locally only, no external exposure | — |

## Known Stubs

None. All three artifacts are complete. A throwaway smoke-test run of the Section Analyzer on one real funnel is Plan 03-04 scope (D-17) — that is a validation step, not a stub.

## Self-Check: PASSED

| Item | Status |
|------|--------|
| prompts/funnel-deep-pass.md | FOUND |
| tools/hooks/inject-dr.js | FOUND |
| tools/hooks/validate-analyzer.js | FOUND |
| 03-03-SUMMARY.md | FOUND (this file) |
| commit 29ca944 (Task 1) | FOUND |
| commit c67f1d9 (Task 2) | FOUND |
| commit 898e9af (Task 3) | FOUND |
