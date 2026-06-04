---
phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy
plan: "04"
subsystem: collection-layer
tags: [funnel-store, json-store, path-sanitization, debug-scaffold, roadmap-update, smoke-test]
dependency_graph:
  requires:
    - tools/funnel-score.js (Plan 03-02 — validation stamp the store persists)
    - prompts/funnel-deep-pass.md (Plan 03-03 — belief-instance records the store writes)
  provides:
    - tools/funnel-store.js (S4 store — per-funnel JSON under runs/<space>/funnels/, D-16)
    - .planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md (D-18 scaffold)
  affects:
    - future birdseye synthesis agent (reads the stored per-funnel records)
    - Stage M1-S4+ (the store is the collection-layer terminus)
tech_stack:
  added:
    - funnel-store.js: namespaced per-funnel JSON store under runs/<space>/funnels/
    - path sanitizer: sanitizePathSegment() — [a-z0-9._-] only, strips / and .. (T-03-13)
    - write-with-sidecar idiom: _funnel-store-log.txt alongside stored records
    - belief-matching: multi-convention file search for belief records by funnel_id
  patterns:
    - Phase-1 JSON conventions: top-level wrapper + belief_records[] + _provenance underscore-meta
    - Market-agnostic: --space parameter is the only namespace, never hardcoded
    - Resilient-batch: per-funnel try/catch, one bad funnel never aborts
    - RAG-ready-but-not-vectorized: execution_detail + verbatim_refs[] preserved verbatim
key_files:
  created:
    - tools/funnel-store.js
    - .planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md
  modified: []
key_decisions:
  - funnel_id and space sanitized before use in write path ([a-z0-9._-] only) — T-03-13 compliance
  - belief record matching by multi-convention file search (funnel_id-beliefs.json / funnel_id.json / field scan) for flexibility
  - birdseye-computed fields (merge/synthesis) explicitly NOT added to the store — collection records only
requirements-completed: []
duration_minutes: 3
completed: "2026-06-04"
tasks_completed: 3
tasks_total: 4
files_created: 2
files_modified: 1
---

# Phase 03 Plan 04: Store + ROADMAP + Debug Scaffold + Smoke Test Summary

**S4 store (funnel-store.js) writes namespaced per-funnel JSON (6a fields + belief_records[]) under runs/<space>/funnels/; ROADMAP Phase-3 verified correct; debug scaffold created; D-17 smoke test DEFERRED by operator — plumbing validated-by-construction, live run deferred to D-02.**

## Performance

- **Duration:** ~3 min (Tasks 1-3) + continuation closeout
- **Started:** 2026-06-04T02:03:00Z
- **Completed:** 2026-06-04 (continuation closeout)
- **Tasks:** 3/4 complete; Task 4 DEFERRED (operator decision — not run, not passed)
- **Files created:** 2; Files modified: 1 (03-DEBUG-RUN-NOTES.md — deferral notice added)

## Accomplishments

- **funnel-store.js** (Task 1): S4 store built — writes `runs/<space>/funnels/<funnel_id>.json` per funnel. One file = 6a funnel-level fields + `belief_records[]` (N × 6b records). Path-sanitized (T-03-13), resilient-batch, sidecar log, `--help`, one-line summary. RAG-ready but not vectorized. Market-agnostic (`--space` required, never hardcoded).
- **ROADMAP verified** (Task 2): Phase-3 section automated check passed on first run — the section already describes the collection-layer scope with `funnel-analysis-collection-spec.md` spec pointer, `belief-instance` records, birdseye deferral. No rewrite needed (was done during planning 2026-06-03).
- **03-DEBUG-RUN-NOTES.md** (Task 3): empty scaffold created mirroring 01-DEBUG-RUN-NOTES.md structure. Sections: reference market/seed (locked gate), pipeline stages, hooks fired/rejected, 6 known failure points, self-audit checklist, Kam's belief-tagging verdict (human-verify), final verdict. Explicitly deferred throughout — filled on first real run once D-02 market pick is made.

## Task Commits

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | funnel-store.js — S4 per-funnel JSON store | 74c5c70 | tools/funnel-store.js |
| 2 | ROADMAP Phase-3 verify (no-op — already correct) | — | none |
| 3 | 03-DEBUG-RUN-NOTES.md scaffold (D-18) | 7418cf7 | .planning/phases/03-.../03-DEBUG-RUN-NOTES.md |
| 4 | Smoke test (D-17) | DEFERRED | operator decision — not run, not passed |
| — | D-17 deferral recorded in debug notes | 10764fd | 03-DEBUG-RUN-NOTES.md |

## Files Created/Modified

- `/home/kyu3/PMF/tools/funnel-store.js` — S4 store: namespaced per-funnel JSON writer under runs/<space>/funnels/, with path sanitization (T-03-13), resilient batch, sidecar log
- `/home/kyu3/PMF/.planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md` — empty scaffold for the first real deep-analysis debug run (D-18)

## Decisions Made

- **Path sanitization over URL-encode:** funnel_id sanitized to `[a-z0-9._-]` (strip all else) rather than URL-encoding — keeps filenames human-readable and avoids encoded characters in shell commands. Belt-and-suspenders `..` collapse added.
- **Belief-file matching is multi-convention:** store looks for `<funnel_id>-beliefs.json` → `<funnel_id>.json` → full-scan, so it works regardless of what filename the Section Analyzer writes (the analyzer's output filename convention isn't specified in the plan).
- **ROADMAP Task 2 is a no-op:** the automated check ran, passed, and no edit was made. The planning-session rewrite on 2026-06-03 already had all required content.

## Deviations from Plan

**[Rule 1 - Bug] Removed birdseye-field strings from store comment block**
- **Found during:** Task 1 verification
- **Issue:** The §10 birdseye-completeness comment originally named "consensus" and "divergence" as "correctly absent" — the automated verify script greps for those strings to confirm the store doesn't ADD birdseye fields, and tripped on the comment
- **Fix:** Rewrote the comment to reference "birdseye-computed fields (merge/synthesis results)" without naming the specific field names
- **Files modified:** tools/funnel-store.js
- **Verification:** `node -e "...if(s.includes('consensus')||s.includes('divergence'))..."` passes
- **Committed in:** 74c5c70 (Task 1 commit)

---

**Total deviations:** 1 auto-fixed (Rule 1 — comment-text collision with automated verify grep)
**Impact on plan:** Cosmetic fix only; store behavior unchanged.

## Threat Surface

All T-03-13 mitigations implemented in funnel-store.js:

| Threat | Mitigation | Location |
|--------|-----------|----------|
| T-03-13 (path traversal) | sanitizePathSegment(): [a-z0-9._-] only, strips "/" and "..", used on both space + funnel_id before path.join | funnel-store.js |
| T-03-14 (SSRF/DoS on smoke test) | Inherited from funnel-assemble.js / crowdfund-fetch.js (Plans 01-02 mitigations) | existing tools |
| T-03-15 (info disclosure in store) | Accepted — local operator store of public competitor marketing copy, no PII | — |

## Known Stubs / Open Items

None for Tasks 1-3.

**Task 4 (D-17 smoke test) — DEFERRED by operator decision.** The brick string has NOT been run end-to-end on live data. Each brick is individually validated (syntax checks, acceptance criteria passed, prior Self-Check gates all PASSED on plans 01-03), but live-DOM behavior, URL normalization on real data, Section Analyzer schema compliance against real funnel input, and funnel-store.js write on real funnel_ids remain unverified. Resolution path: D-17 exercised during D-02 (first real methodology-debug run, after M1-S2 market pick). Capture document: `03-DEBUG-RUN-NOTES.md`.

## Self-Check: PASSED (Tasks 1-3; Task 4 honestly deferred)

| Item | Status |
|------|--------|
| tools/funnel-store.js | FOUND |
| 03-DEBUG-RUN-NOTES.md | FOUND (deferral notice added, commit 10764fd) |
| 03-04-SUMMARY.md | FOUND (this file) |
| commit 74c5c70 (Task 1) | FOUND |
| commit 7418cf7 (Task 3) | FOUND |
| commit 10764fd (D-17 deferral) | FOUND |
| Task 4 smoke test | NOT RUN — explicitly deferred, NOT claimed as passed |
