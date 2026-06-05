---
phase: 20-deep-pass-bug-fixes-funnel-clean-js-markdown-heading-regex-f
reviewed: 2026-06-05T00:00:00Z
depth: standard
files_reviewed: 3
files_reviewed_list:
  - tools/funnel-clean.js
  - tools/funnel-score.js
  - tools/aggregate-mechanisms-in-play.js
findings:
  critical: 0
  warning: 1
  info: 1
  total: 2
  resolved: 1
  deferred: 1
status: resolved
---

> **Resolution (2026-06-05):** WR-01 fixed in commit `54ea38d` — the markdown ATX pass now
> runs after the tag-strip, so `##` inside HTML attribute values / removed tags can no longer
> inject spurious `[SECTION]` markers (verified: markdown marking + HTML no-regression +
> attribute false-positive all green). IN-01 deferred — `arduview` is the only space today;
> a `--space` shorthand is future-proofing outside this phase's D-01..D-11 scope (tracked here
> as a latent footgun for when a second space is added).

# Phase 20: Code Review Report

**Reviewed:** 2026-06-05
**Depth:** standard
**Files Reviewed:** 3
**Status:** issues_found

## Summary

Phase 20 introduced three targeted changes: (1) ATX heading section-marking in `funnel-clean.js`, (2) `hasValidationCurrency()` fail-loud guard in `funnel-score.js`, and (3) SPACE_MAP default path migration in `aggregate-mechanisms-in-play.js`.

All three changes are mechanically correct. The ATX regex is ReDoS-safe, correctly line-anchored, and placed before the tag-strip pass so both HTML and markdown input paths produce section markers. The `hasValidationCurrency()` helper correctly reuses the scoring functions as a single source of truth and is correctly wired at both single-file and batch CLI boundaries. The SPACE_MAP path migration resolves correctly to `runs/arduview/space-map.json` (confirmed to exist).

Two issues found: one warning (the ATX pass runs on HTML input where `##` could appear mid-HTML in `<pre>` or attribute strings and gain spurious markers before the tag-strip; a documentation gap not a functional bug in the common case) and one info item (both `aggregate-mechanisms-in-play.js` defaults are still hardcoded to `arduview` with no `--space` shorthand, creating silent wrong-space behavior when the script is run for a different space without explicitly passing `--space-map` and `--sidecar`).

---

## Warnings

### WR-01: ATX heading pass runs before tag-strip — can inject spurious `[SECTION]` markers from `##` inside HTML attribute strings or `<pre>` blocks

**File:** `tools/funnel-clean.js:174`

**Issue:** The ATX pass (`/^#{1,6}[ \t]+/gm`) is applied at line 174, after the chrome-removal passes (script/style/nav/header/footer) but *before* the general tag-strip at line 177. This ordering is intentional and correct for the declared use case (plain markdown input). However, if `landing_page_body` contains raw HTML with an ATX-like sequence at line-start inside a `<pre>` block, an `aria-label="## Stars"` that happens to sit at the start of a line after a newline in the HTML source, or a code block embedded in a crowdfunding LP description, the pass will prepend `[SECTION]` to that text before it is stripped.

This does not corrupt the downstream Section Analyzer's reading (a spurious `[SECTION]` just adds a structural hint), and the dedup regex at line 198 handles consecutive markers. But it can inflate `cleaned_body` section counts on HTML-heavy inputs, and the comment on line 174 does not document this caveat.

The existing T-03-07 note in the file header covers ReDoS; this is a separate behavioral gap.

**Fix:** Move the ATX pass to run *after* the tag-strip at line 177, so it only fires on the plain-text residue where `##` at line-start unambiguously comes from markdown copy:

```javascript
// Strip all remaining HTML tags (attributes and all). Bounded tag body (500 chars max).
s = s.replace(/<[^>]{0,500}>/g, ' ');

// Insert section markers before markdown ATX headings (D-01).
// Run AFTER tag-strip so '#' sequences embedded in HTML attributes or <pre> blocks
// are already gone. Plain-text '## Heading' at line-start is unambiguous here.
s = s.replace(/^#{1,6}[ \t]+/gm, SECTION_MARKER + '$&');
```

If the HTML-first ordering was a deliberate design choice (e.g., to handle HTML that contains inline markdown), add a comment explaining why and accept the caveat.

---

## Info

### IN-01: `aggregate-mechanisms-in-play.js` defaults are hardcoded to `arduview` with no `--space` shorthand — silent wrong-space behavior for multi-space runs

**File:** `tools/aggregate-mechanisms-in-play.js:34-35`

**Issue:** Both `SIDECAR` and `SPACE_MAP` defaults are hardcoded to the `arduview` subdirectory. If the script is run against a different space (e.g., after `/market-selection` picks a new space) and the operator forgets to pass both `--sidecar` and `--space-map`, it silently reads from `arduview`'s sidecar and writes to `arduview`'s space-map — corrupting the wrong space's data with no warning. The D-07 migration unified the *path structure* correctly, but the *space name* (`arduview`) remains hardcoded in both defaults.

This is an info item because: (a) the script currently has only one real space (`arduview`), (b) a multi-space run does not yet exist, and (c) `--space-map` and `--sidecar` flags exist for the explicit override. But it is a latent footgun as the project adds spaces.

**Fix (deferred is fine):** Add a `--space=<slug>` shorthand that constructs both defaults:

```javascript
const SPACE = opts.space || 'arduview';
const SIDECAR   = path.resolve(opts.sidecar   || path.join(ROOT, 'runs', SPACE, '_mechanisms-in-play.agent.json'));
const SPACE_MAP = path.resolve(opts['space-map'] || path.join(ROOT, 'runs', SPACE, 'space-map.json'));
```

Until then, add a comment on line 34-35 calling out that `arduview` is intentionally hardcoded as the current default and must be updated when a new space is added.

---

_Reviewed: 2026-06-05_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
