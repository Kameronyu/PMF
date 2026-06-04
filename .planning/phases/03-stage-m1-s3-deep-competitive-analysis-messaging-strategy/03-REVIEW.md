---
phase: 03-stage-m1-s3-deep-competitive-analysis-messaging-strategy
reviewed: 2026-06-03T00:00:00Z
depth: standard
files_reviewed: 9
files_reviewed_list:
  - prompts/funnel-deep-pass.md
  - tools/adlib-one.js
  - tools/crowdfund-fetch.js
  - tools/funnel-assemble.js
  - tools/funnel-clean.js
  - tools/funnel-score.js
  - tools/funnel-store.js
  - tools/hooks/inject-dr.js
  - tools/hooks/validate-analyzer.js
findings:
  critical: 0
  warning: 5
  info: 6
  total: 11
status: issues_found
---

# Phase 3: Code Review Report

**Reviewed:** 2026-06-03
**Depth:** standard
**Files Reviewed:** 9
**Status:** issues_found

## Summary

Reviewed the §2b funnel-analysis pipeline: Ad Library scraper (`adlib-one.js`), crowdfunding fetcher (`crowdfund-fetch.js`), the assembler/clean/score/store scripts, two PostToolUse hooks, and the analyzer prompt. Overall the threat model is well thought through — SSRF guards fail closed on DNS error, regex inputs are byte-capped against ReDoS, resilient-batch try/catch is consistently applied, the path sanitizer in `funnel-store.js` is solid, and the prompt-injection boundary in `funnel-deep-pass.md` is explicit with a hook that does not trust the model.

No critical issues. The five warnings are correctness/security gaps that survive the happy path but bite under adversarial or partial-data conditions: a redirect-based SSRF bypass, a verbatim-gate false-reject caused by an entity-decoding mismatch between the cleaner and the validator's fallback corpus, an SSRF DNS-rebinding window, a funnel-count miscount, and a silent verbatim-gate downgrade when the corpus is missing. Info items are robustness/clarity nits.

## Warnings

### WR-01: SSRF guard is bypassed by HTTP redirects

**File:** `tools/funnel-assemble.js:376-403`, `tools/crowdfund-fetch.js:252-294`
**Issue:** `ssrfGuard()` validates the *initial* host's resolved IPs, then `page.goto(url)` runs with Playwright's default redirect-following. A safe public host (e.g. an attacker-controlled `https://evil.example/`) can 30x-redirect the headless browser to `http://169.254.169.254/` (cloud metadata) or `http://127.0.0.1/`. The guard never re-runs on the redirected host, so the private-range check is defeated. The destination URLs here are scraped from third-party ad creatives (`destination_url`) and hand-fed CF lists — both untrusted — so this is a real SSRF surface.
**Fix:** Re-validate on every navigation. Register a request/redirect interceptor that aborts disallowed hosts:
```js
await context.route('**/*', async (route) => {
  const u = new URL(route.request().url());
  if (net.isIP(u.hostname) ? isPrivateIp(u.hostname) : !(await ssrfGuard(u.href))) {
    return route.abort();
  }
  return route.continue();
});
```
(or set `maxRedirects: 0` semantics by checking `response.request().redirectedFrom()` after goto and re-validating the final URL before reading content).

### WR-02: Verbatim gate false-rejects when only raw `landing_page_body` is available

**File:** `tools/hooks/validate-analyzer.js:166` (with `tools/funnel-clean.js:169-180`)
**Issue:** The Section Analyzer is instructed to quote verbatim substrings from the **cleaned** body, which has HTML entities decoded (`&amp;`→`&`, `&#39;`→`'`, etc.) and tags stripped (`funnel-clean.js` `stripToText`). When `findCleanedBody()` cannot find a `*-clean.txt`/`cleaned_body` source it falls back to `pkg.landing_page_body` — the **raw, un-decoded, un-stripped HTML**. Any legitimate verbatim the analyzer copied from the cleaned text (e.g. containing a decoded `&` or `'`, or text split across now-removed tags) will fail `cleanedBody.includes(text)` and be wrongly REJECTED. The gate silently changes meaning depending on which corpus file exists.
**Fix:** Never fall back to raw `landing_page_body` for the substring check. Prefer `pkg.cleaned_body`; if only `landing_page_body` exists, run it through the same `stripToText` transform (or refuse to verify rather than verify against the wrong corpus). At minimum, drop `|| pkg.landing_page_body` on line 166 so the gate verifies only against cleaned text.

### WR-03: SSRF guard has a DNS-rebinding / TOCTOU window

**File:** `tools/funnel-assemble.js:149-173`, `tools/crowdfund-fetch.js:107-125`
**Issue:** `ssrfGuard()` resolves the host via `dns.lookup()` and approves it, but `page.goto()` performs its **own** DNS resolution moments later. An attacker controlling DNS can return a public IP to the guard and a private IP (127.0.0.1 / 169.254.169.254) to the browser (classic DNS rebinding). The check-then-use gap means the validated IP is not the one actually connected to.
**Fix:** Pin the resolved address. Either resolve once and navigate to the literal IP with a `Host:` header override, or enforce at the network layer via the request interceptor in WR-01 (which inspects the actual connection target). Document this as accepted residual risk if pinning is impractical, but it should not be silent.

### WR-04: `funnelCount` over-reports — counts skipped CF entries

**File:** `tools/funnel-assemble.js:538`
**Issue:** `const funnelCount = clusters.size + crowdfundLps.length;` adds the full hand-fed CF list length, but CF entries are skipped (via `continue`) when the URL is unnormalizable (L441), ambiguous (L449), or SSRF-rejected (L459). The summary line then claims more funnels were produced than files were written. Misleading operator-facing count.
**Fix:** Track actual writes:
```js
let cfWritten = 0;
// ...increment cfWritten only just before/after each fs.writeFileSync in the CF loop
const funnelCount = clusters.size + cfWritten;
```

### WR-05: Verbatim gate downgrades to a hard reject instead of an explicit skip when corpus is missing

**File:** `tools/hooks/validate-analyzer.js:295-300`
**Issue:** When the cleaned body cannot be located, every `verbatim_refs[].text` produces a REJECT. Combined with WR-02's fragile corpus discovery (narrow, hardcoded candidate paths that don't include the `funnel-clean.js` default output dir `funnels-clean/<funnel_id>-clean.json`), a correctly-functioning analyzer run will be rejected purely because the validator couldn't find the corpus. This turns a corpus-wiring problem into a content-rejection, which is hard to diagnose from the REJECT message and could mask real verbatim hallucinations behind noise.
**Fix:** Broaden `findCleanedBody` candidates to include `funnels-clean/<funnel_id>-clean.json` (the actual `funnel-clean.js` output) and read its `cleaned_body` field. If still not found, exit with a distinct configuration-error code/message ("corpus not found — cannot run verbatim gate") rather than fabricating per-ref content rejects.

## Info

### IN-01: `mergeCardData` is defined but never used

**File:** `tools/adlib-one.js:202-218`
**Issue:** `mergeCardData()` is dead code — `parseAdsFromText` does the DOM-merge inline via `cardDataMap`, and `mergeCardData` is never called.
**Fix:** Remove `mergeCardData` (and confirm `textFallbackFields`/the inline path fully supersede it) to avoid drift between two merge implementations.

### IN-02: `funded`/`failed` regex overlap can mislabel funded campaigns

**File:** `tools/crowdfund-fetch.js:196-212`
**Issue:** The bare `/\bfunded\b/i` test on L199 matches inside "not successfully funded" / "Funding Unsuccessful" pages, setting `funded` first; the failed block on L204 then overrides. This works only because failed is checked second and is broader. But `/\bfailed\b/i` (L208) will also fire on incidental copy like "we never failed our backers," flipping a genuinely-funded campaign to `failed`. The override ordering makes the classifier brittle to marketing prose.
**Fix:** Anchor the failed patterns to status phrasing only (drop the bare `\bfailed\b`), or require the failed signal to co-occur with a funding-status context word. Prefer the most specific phrase match and return early.

### IN-03: `inject-dr.js` header "Loaded" count is computed with a no-op

**File:** `tools/hooks/inject-dr.js:166`
**Issue:** `Loaded: ${parts.length - (trimmed ? 0 : 0)}` subtracts zero in both branches — clearly an unfinished expression. Also, when a file is truncated, `parts` gains two entries (slice + truncation notice), so `parts.length` overcounts loaded files.
**Fix:** Track a dedicated `loadedCount` incremented once per successfully-read file and use it here.

### IN-04: `resolveImpressionMultiplier` substring matching can mis-bucket

**File:** `tools/funnel-score.js:151-153`
**Issue:** The fallback loop accepts a match when `key.includes(norm)` — so a short/garbled bucket label like `"1,000"` is a substring of `"1,000 - 5,000"` and resolves to multiplier 2, while also being a substring of `"500,000 - 1,000,000"` (multiplier 7) depending on iteration order. Object key order makes the result order-dependent and potentially wrong.
**Fix:** Drop the bidirectional `includes`; keep exact-match plus a normalized-digit comparison, or anchor on the lower bound only. Falling back to `DEFAULT_IMPRESSION_MULTIPLIER` on ambiguous input is safer than a confident wrong bucket.

### IN-05: `parseFloat`/`parseInt` on regex captures with thousands separators is partially handled

**File:** `tools/adlib-one.js:60-63`
**Issue:** Follower parsing uses `parseFloat(fol[1])` where `fol[1]` is `[\d.]+` — a value like `1.2M` parses fine, but a comma-formatted `12,000 followers` would be captured as `12` (regex stops at the comma), undercounting by 1000×. Low impact (followers is only a capped tiebreaker), hence info.
**Fix:** Include `,` in the follower-number character class and strip commas before `parseFloat`, consistent with the backer-count handling in `crowdfund-fetch.js:184`.

### IN-06: `funnel-store.js` batch mode exits non-zero on any single error despite resilient-batch intent

**File:** `tools/funnel-store.js:332-335`
**Issue:** Batch mode accumulates per-funnel errors (good), but the final block `process.exit(1)` whenever `errors.length > 0`. A 99/100 successful batch returns a failure exit code, which an orchestrator may read as "store failed" and abort downstream. Successes are still written, so the exit code contradicts the partial-success semantics the rest of the function implements.
**Fix:** Decide and document the contract. If partial success is acceptable, exit 0 and surface the error count in the summary (the log already records errors); reserve non-zero for total failure (zero successes). If non-zero on any error is intended, add a comment so it isn't read as a bug.

---

_Reviewed: 2026-06-03_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_
