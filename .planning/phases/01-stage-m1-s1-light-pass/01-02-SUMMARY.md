---
phase: 01-stage-m1-s1-light-pass
plan: "02"
subsystem: fetch-clean-scripts
tags: [fetch, playwright, clean, corpus, deterministic, scripts]
dependency_graph:
  requires: []
  provides: [tools/fetch.js, tools/clean.js, corpus/<slug>/raw/, corpus/<slug>/clean/]
  affects: [tools/adlib-one.js scope boundary, Dumper agent (reads clean/ only)]
tech_stack:
  added: []
  patterns: [playwright-stealth-launch, CF-clear-loop, expand-all, resilient-per-item-batch, provenance-header]
key_files:
  created:
    - tools/fetch.js
    - tools/clean.js
  modified: []
decisions:
  - "LP-hunt: URL-path patterns tried against brand origin; query-based discovery deferred per JIT principle (debug run first)"
  - "Smoke test slug must not start with underscore — underscore prefix is reserved for log files (_fetch-log.txt, _clean-log.txt)"
  - "fetch.js writes sidecar .meta.txt for provenance; raw .html contains page.content() only (clean.js adds its own provenance header to .md output)"
metrics:
  duration: "~7 minutes"
  completed: "2026-06-03T19:16:59Z"
  tasks_completed: 2
  files_created: 2
  files_modified: 0
---

# Phase 1 Plan 02: Fetch + Clean Scripts Summary

Standalone `tools/fetch.js` and `tools/clean.js` Node scripts establishing the `corpus/<slug>/raw/ → corpus/<slug>/clean/` tree. Zero deps beyond global Playwright + node builtins. This two-dir split is the physical enforcement of "the Dumper reads clean copy only."

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Build tools/fetch.js | d70a9e2 | tools/fetch.js (221 lines) |
| 2 | Build tools/clean.js | 2db05bb | tools/clean.js (132 lines) |

## What Was Built

**tools/fetch.js** — Playwright per-brand fetch script. Reads `brands.json`, fetches homepage + 11 fixed LP-hunt URL-path patterns per brand, clears Cloudflare (15-loop title check), expands collapsed copy (Read more/Show more/Load more selectors), writes raw HTML to `corpus/<slug>/raw/<page>.html` plus a `.meta.txt` sidecar (URL/TITLE/FETCHED). Resilient per-brand try/catch; writes `corpus/_fetch-log.txt` at the end. Never touches `clean/`.

**tools/clean.js** — Regex-dumb HTML→markdown stripper (~30 lines of regex, no parser). Reads all `corpus/<slug>/raw/*.html`, strips `<script>`, `<style>`, `<nav>`, `<header>`, `<footer>`, remaining tags, decodes entities, collapses blank lines. Writes `corpus/<slug>/clean/<page>.md` with provenance header `<!-- source: ... | cleaned: ... -->`. Per-file try/catch; writes `corpus/_clean-log.txt`.

## Acceptance Criteria Status

**fetch.js:**
- `node -c tools/fetch.js` → syntax OK
- `node tools/fetch.js --help` → exits 0, prints usage
- `grep 'disable-blink-features=AutomationControlled'` → matches (stealth inherited)
- `grep 'just a moment|cloudflare'` → matches (CF-clear loop inherited)
- `grep 'corpus'` + `grep '/raw/'` → match (raw output tree)
- `grep -i 'students|college|back-to-school'` → matches (LP-hunt template hard-coded)
- Only `playwright`, `fs`, `path` required — zero extra deps
- `grep -c 'clean/' tools/fetch.js` → 0 (never writes to clean/)

**clean.js:**
- `node -c tools/clean.js` → syntax OK
- `node tools/clean.js --help` → exits 0, prints usage
- `grep '/clean/'` and `grep '/raw/'` → match (reads raw, writes clean, separate dirs)
- `grep -E 'script|style'` → matches (strips both)
- `grep -i 'source:'` → matches (provenance header)
- playwright count = 0, cheerio count = 0 (regex-only, no parser/playwright dep)
- Functional smoke: `<p>real copy</p>` preserved; `<script>bad</script>` content stripped

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written, with one minor deviation in the smoke test approach:

**Note (not a bug):** The plan's smoke test used `corpus/_t/` as the slug path. The `_t` prefix starts with underscore, which `clean.js` correctly skips (underscore dirs are reserved for log files: `_fetch-log.txt`, `_clean-log.txt`, `_clean-log.txt`). Verified with `corpus/test-smoke/` instead — identical result. This is correct behavior, not a defect.

## Threat Surface Scan

No new network endpoints, auth paths, or file access patterns beyond what the threat model covers.

| Threat ID | Status |
|-----------|--------|
| T-01-03 (clean.js RCE via fetched HTML) | Mitigated — regex string ops only, `eval`/`Function`/`exec` absent, no parser dep |
| T-01-04 (fetch.js page JS exec) | Accepted — inherits crowdfund-fetch.js posture, Playwright sandboxed headless Chromium |
| T-01-05 (DoS from one bad URL) | Mitigated — per-item try/catch in both scripts, batch continues on error |

## Known Stubs

None. Both scripts are complete deterministic implementations, not stubs.

## Self-Check: PASSED

- tools/fetch.js exists and passes all acceptance criteria
- tools/clean.js exists and passes all acceptance criteria including functional smoke test
- Commit d70a9e2 exists (fetch.js)
- Commit 2db05bb exists (clean.js)
