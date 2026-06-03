# Phase 1: Stage M1-S1 — Light Pass - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 7 (5 scripts + 1 hook-config + 1 prompt-edit)
**Analogs found:** 4 / 7 (3 have no code analog — net-new patterns)

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `tools/fetch.js` | script (S1) | fetch / file-I/O | `tools/crowdfund-fetch.js` + `tools/adlib-sweep.js` | exact (Playwright fetch + per-brand loop) |
| `tools/adlib-one.js` (already exists — reuse/relocate) | script (S1) | fetch | `tools/adlib-one.js` (itself) | identity — inherit as-is, only output-path/CLI touch-up |
| `tools/clean.js` | script (S2) | transform / file-I/O | partial: `.txt` dump-write tail in `crowdfund-fetch.js` L129-143 | role-match (no existing HTML→md cleaner) |
| `tools/dedupe.js` | script (S2/merge) | transform / batch | partial: `pickAdvertiser` norm-key logic in `adlib-one.js` L25-51 | partial (domain-key merge, no exact analog) |
| `tools/revenue-est.js` | script (S3) | transform / arithmetic | none | **no analog** (net-new deterministic compute) |
| `.claude/settings.json` (PostToolUse hooks) + hook validator scripts | hook (H1) | event-driven / gate | none | **no analog** (settings.json has only `permissions` today) |
| `prompts/step1-light-pass.md` (Space Classifier inline edit) | agent-prompt-edit | n/a | the prompt's own existing AGENT 3 block (L325-370) | identity — surgical inline, not a code analog |

**Runtime (locked, from STACK.md):** Node.js v20.20.0, Playwright 1.59.1 installed globally at `~` (NOT in repo), system Chromium. **No `package.json`, no lockfile, no local `node_modules`.** Every script is a standalone `node <file>.js` invocation. Hooks must be the same — plain Node, zero deps beyond what's global.

**Path convention note:** existing scripts live in `tools/` (confirmed). STACK.md / settings.json still reference the legacy `runs/eink-tablets/scripts/` path — the canonical home going forward is `tools/`. New scripts go in `tools/`.

---

## Pattern Assignments

### `tools/fetch.js` (script S1, fetch + file-I/O)

**Analogs:** `tools/crowdfund-fetch.js` (Cloudflare bypass + content extraction) + `tools/adlib-sweep.js` (per-brand loop driver).

**CLI-arg parsing pattern** — copy from `crowdfund-fetch.js` L28-43 (positional `slug`+`url`, then `--key=val` flags folded into an `opts` object, usage-error exit):
```javascript
const args = process.argv.slice(2);
const slug = args[0];
const url = args[1];
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--')).map(a => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  })
);
const type = opts.type || 'campaign';
const baseOut = opts.out || path.join(__dirname, '..', 'crowdfunding-corpus');
if (!slug || !url) { console.error('Usage: ...'); process.exit(1); }
```

**Cloudflare-bypass / stealth launch pattern** — copy VERBATIM from `crowdfund-fetch.js` L52-94. This is the load-bearing inherit (`fetch.js` must clear CF on DTC homepages + LP-hunt URLs). Includes: launch args (`--disable-blink-features=AutomationControlled`), spoofed UA + locale + timezone context, `addInitScript` webdriver/plugins/languages masking, and the **CF challenge wait loop**:
```javascript
const browser = await chromium.launch({
  headless: true,
  args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox'],
});
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ... Chrome/130.0.0.0 Safari/537.36',
  viewport: { width: 1440, height: 900 }, locale: 'en-US', timezoneId: 'America/New_York',
  extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' },
});
await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
});
// ...goto, then:
for (let i = 0; i < 15; i++) {
  const t = await page.title().catch(() => '');
  if (!t.match(/just a moment|cloudflare|checking your browser/i)) break;
  await page.waitForTimeout(1000);
}
await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
```

**"Expand all collapsed copy" pattern** — copy from `crowdfund-fetch.js` L99-127 (click every "Read more / Show more / Load more" so the full LP copy lands in the dump). LP-hunt pages have the same pattern.

**Per-brand loop driver pattern** — copy from `adlib-sweep.js` L18-67 (iterate a brand/URL list, slug each, try/catch per item so one failure doesn't kill the sweep, push a results line, `_sweep-log.txt` at the end). **`fetch.js` reads its brand list from `brands.json`** (post-dedupe) rather than the hard-coded `BRANDS` array in the analog.

**LP-hunt query/URL template (from spec, NOT agent-chosen)** — the master spec L162-168 fixes the query set + URL-path patterns. Hard-code this template into `fetch.js`; it is deterministic, never passed in by an agent:
```
queries:   <brand> students|college|back-to-school · <brand> focus|distraction-free ·
           <brand> calm|digital-wellbeing|screen-time · <brand> parents|kids|family ·
           <brand> writers|journaling|note-taking · <brand> professionals|business|work ·
           <brand> education|teachers · <brand> faith|Bible
url-paths: /clp/ /lp/ /pages/ /campaigns/ /education /students /focus /parents /press /blog /business
```

**Output convention** — `fetch.js` writes raw HTML to `corpus/<slug>/raw/<page>.html` (mirror `crowdfund-fetch.js`'s `<slug>/raw/<type>-<ts>.html` L45-48). `clean.js` consumes `raw/`, never `fetch.js` writing clean directly.

---

### `tools/adlib-one.js` (script S1 — ALREADY EXISTS, inherit as-is)

**Analog:** itself (`tools/adlib-one.js`, fully working).

Per the master spec scaffold item 3 and `capability_inventory.md` ("light pass works — leave it unless it breaks"), the ad-pull script is **already built**. Do NOT rewrite it. The only changes the planner may need:
- Parameterize the hard-coded output path `const OUT = '.../runs/eink-tablets/adlibrary'` (L20) → accept `--out` like `crowdfund-fetch.js` does, so it writes `ads/<brand>.json` per the spec contract.
- Currently emits a `_adv.txt` text dump (L125-131); the scaffold wants structured `ads/<brand>.json`. Light JSON-emit touch-up only.

**Load-bearing patterns to preserve (do not regress):**
- **Page-ID resolution** (`pickAdvertiser`, L25-51): typeahead `<li role="option">` carries `id="pageID:NNN"`; normalize-and-score against brand name (exact match +100, prefix +45, substring +22), category boost/penalty (`FAV_CAT`/`BAD_CAT` L22-23), follower tiebreaker capped at 5. **This is what kills keyword-collision noise (the InkLeaf "TCL TVs = 260 ads" failure, D-07).** `score >= 30` threshold or NONE.
- **`forcedPageId` override** (L15, L77-78): 3rd CLI arg lets the operator fix a mis-resolved auto-pick. Preserve.
- **Two-pass / re-resolve-to-PageID protocol** (`run-retrospective.md`): keyword pass → re-resolve to `view_all_page_id` (L96-101). Absence of ads is data (`count='0'` on "no ads match", L110).
- **Cookie-consent dismissal loop** (L71-74) — shared with `adlib-sweep.js` L36-46.

---

### `tools/clean.js` (script S2, transform — HTML→clean-markdown)

**Analog:** partial only — the visible-text extraction tail of `crowdfund-fetch.js` L129-143 (`document.body.innerText` + write `.txt`). There is **no existing HTML-stripping cleaner** in the repo. Per `capability_inventory.md` locked-decision #6: "Cleaner is dumb first — ~30 lines of regex now; modular contract lets it be swapped later."

**Input/output contract (the file-layout rule, from spec L169-171):**
- Reads: `corpus/<slug>/raw/*.html`
- Writes: `corpus/<slug>/clean/<page>.md` = **pure copy only** (nav, cookie banners, footers, `<script>`, boilerplate stripped).
- **This file layout IS the enforcement** of "the agent that reads copy reads CLEAN copy only" — the Dumper is pointed at `clean/`, never `raw/`. Do not collapse the two dirs.

**Write pattern to mirror** (from `crowdfund-fetch.js` L136-139) — `fs.mkdirSync(dir, {recursive:true})` then `fs.writeFileSync`, plus a provenance header line (URL / fetched-at) at the top of each clean file.

**Build note:** keep it regex-dumb (strip tag blocks, collapse whitespace). Do not reach for a heavy HTML parser — the JIT principle (capability_inventory Foundational Unders) says don't over-build ahead of the debug run.

---

### `tools/dedupe.js` (script S2/merge, transform — brands.json by domain)

**Analog:** partial — the normalize-key technique in `adlib-one.js` `pickAdvertiser` L25-26 (`norm = s.toLowerCase().replace(/[^a-z0-9]+/g,'')`). No full dedupe analog exists.

**Job (from spec scaffold item 4 + Finder rule L234 + OPEN DECISIONS L381):** merge Finder brand rows by **domain** (dedup key = domain for brands). Same brand surfaced by two lanes → one row: **merge `found_by`, keep the richest `channel`**. Emit clean `brands.json`.

**Pattern to copy** — the domain-normalization + key-collapse idiom from `adlib-one.js` L25-26, applied to each brand's `url` host. Group by normalized host, fold `found_by[]` arrays, prefer the row whose `channel` is most specific.

**No-LLM constraint:** this is pure arithmetic/set logic — a script, never an agent (CLAUDE.md one-job-per-brick law; Finder dedup is "judgment" only at the keep-bar, the mechanical merge is deterministic).

---

### `tools/revenue-est.js` (script S3, transform — deterministic arithmetic)

**Analog:** NONE. Net-new. (The quarantined `_quarantine/.../sw-sweep.js` is the *traffic-fetch* sibling, not the compute — and it's quarantined / not the chosen source.)

**Job (from spec scaffold item 5 + D-09/D-10/D-11):** compute `revenue_est.value_usd_monthly` per brand, attach to `brands.json`. **No LLM ever computes revenue — it is arithmetic.**

**The formula (verbatim from spec L174):**
```
value_usd_monthly = monthly_visits × cvr_assumption × aov_usd
cvr_assumption default = 0.02  (industry 2–2.5%; stored as an assumption, never a measured fact)
aov_usd        ← derived from brands.json price_points (else operator-set)
monthly_visits ← traffic source (see below)
worked example: 300,000 × 0.02 × $60 = $360,000/mo
```

**Traffic source (D-11):** primary = Semrush Trends API → `visits_source:"semrush-api"` (multi-login wiring left to implementer, NOT specced here). Fallback = operator-pasted SimilarWeb free-tier → `visits_source:"similarweb-manual"`. No auto-browser SimilarWeb scraping (ToS/ban). The `inputs.visits_source` field makes the source swappable (code_context integration point).

**Never-fabricate rule (D-10) — drives the method/confidence logic:**
```
- always emit method + confidence with any value_usd_monthly
- monthly_visits null → method:"review_proxy" (units ≈ review_count × category_multiplier × AOV), confidence:"low"
- NEVER ship "PENDING" as if populated (the InkLeaf failure: SimilarWeb PENDING on all 31 records)
- explicit null is allowed; a fake number is not
```

This logic is **mirrored by the REVENUE hook** below — the script self-enforces, the hook is the backstop.

---

### `.claude/settings.json` PostToolUse hooks + validator scripts (hook H1)

**Analog:** NONE in code. Today `.claude/settings.json` (read) contains **only a `permissions.allow` array** — there is no `hooks` block yet. The hooks are net-new.

**The pattern to establish** (since none exists): a `hooks.PostToolUse` block in `.claude/settings.json` matching `Write`, invoking small **Node validator scripts** (same runtime as everything else — no new language, no deps). Each validator reads the just-written JSON, applies the reject rules, exits non-zero with a message on violation. Keep them per-agent (DUMPER / CLASSIFIER / REVENUE / FINDER) for one-job-per-brick cleanliness.

**Reject rules to encode (verbatim from spec L176-190):**

*FINDER hook:* reject `channel`/`lane` off-enum; reject brand row missing `url` or `sells_observed`.

*DUMPER hook:* reject if any creative has `canonical_niche != null` or `canonical_angle != null`, or any pitch `transformation != null` (dumper must not classify). **Reject if any pitch `claims[]` string is not a verbatim substring of that brand's `clean/` corpus** (kills hallucinated/paraphrased claims — the load-bearing gate). Reject if `angle_basis` missing.

*CLASSIFIER hook:* reject any assigned `canonical` transformation/niche/angle with zero raw variants tracing to real dumps. **Reject saturation computed across cells (must be per combo cell).** Reject any `claim_type` off `CLAIM_TYPE_ENUM`. Reject a combo missing `claim_count`/`enhanced_claim_count`; reject `enhanced_claim_count > claim_count`. **Reject any per-brand `competitive_axis` off `COMPETITIVE_AXIS_ENUM`; reject a missing/empty `competitive_axis_basis` when `competitive_axis` is set (D-12).**

*REVENUE hook:* reject `value_usd_monthly` emitted without `method`+`confidence`; reject `method:"traffic_formula"` when `inputs.monthly_visits` is null (must use `review_proxy`).

**Closed enums the hooks validate against (spec L148-156):**
```
CHANNEL_ENUM:          dtc | marketplace | crowdfunding
CLAIM_TYPE_ENUM:       direct | enlarged | mechanism | enhanced
COMPETITIVE_AXIS_ENUM: function-capability-price | visual-statement | community-openness
```
**D-05 impact:** awareness + awareness_basis are **dropped from the light-pass Dumper** (so AWARENESS_ENUM is gone from the enum list above, and the DUMPER hook above carries no awareness reject rule — both already reconciled). The Dumper prompt + dump.json schema also lose those fields. Planner must reconcile spec L90-91, L150, L180, L311 against D-05 (Plan 01 Task 1).

---

### `prompts/step1-light-pass.md` (agent-prompt edit — NOT a code analog)

**"Analog" = the file's own existing structure.** The Finder / Roster Verifier / Dumper / Space Classifier are LLM prompts inside the master file, not scripts. The pattern to follow is the **existing AGENT block structure** (L194-370), reconciled/inlined per CONTEXT decisions — there is no external code to copy.

**Edits the planner must apply (from CONTEXT):**
1. **D-03 sophistication inline (verbatim):** drop the CONTEXT.md L34-61 `SOPHISTICATION (per combo cell = transformation × niche)` block into AGENT 3 — SPACE CLASSIFIER, adjacent to step 4 / step 1b (the `claim_type` typing, prompt L340-351). It is load-bearing and traces to `definitions.md` §Market sophistication. Physical placement is Claude's discretion (D-decisions "Claude's Discretion").
2. **D-05 awareness removal:** strip `awareness` / `awareness_basis` from the Dumper prompt (L311, L314-315) and the dump.json schema (L90-91), and from the DUMPER hook rules.
3. **D-04 wiring:** make the stage call hook-checkable against the cell's `claim_type` distribution (claim_type and the sophistication ladder are the same ladder — already structurally present at L340-351; the inline cements it).
4. **D-01 reconciliation:** fold the scaffold + 3 agent prompts into one runnable file; do NOT pre-load KB decision-procedure knowledge (D-02 — only definitional/classification knowledge stays in Phase 1 agents).
5. **D-08 / D-11 schema reconciliation:** fix the `saturation` schema example to be keyed per combo cell (transformation × niche), and the `visits_source` enum to name `semrush-api` not `similarweb-api` (Plan 01 Task 3).
6. **D-12 competitive_axis:** add a per-competitor `competitive_axis` (closed enum: `function-capability-price | visual-statement | community-openness`) + a page-quoted `competitive_axis_basis` to the `space-map.json` `per_brand[]` block; add `COMPETITIVE_AXIS_ENUM` to the closed-enums block; wire AGENT 3 (the Classifier) to assign one primary page-read axis per brand with a quoted basis, populated for every captured brand regardless of live status; keep the Dumper guard that it never classifies competitive_axis (one-job-per-executor; one-writer-per-file — Classifier owns space-map.json). It is the Phase 2 Gate-2 transparency-axis input (Plan 01 Task 4; hook-enforced in Plan 04).

---

## Shared Patterns

### Playwright launch + standalone-node invocation
**Source:** `tools/crowdfund-fetch.js` L52-77 (stealth) / `tools/adlib-sweep.js` L20-21 (plain).
**Apply to:** `fetch.js`, and any traffic-fetch helper.
Every script is `node tools/<x>.js <args>`, zero local deps, Playwright resolved from the global `~` install. No `require` outside `playwright` + node builtins (`fs`, `path`).

### CLI args: positional + `--flag=val`
**Source:** `crowdfund-fetch.js` L28-43.
**Apply to:** all new scripts that take operator input (`fetch.js`, `clean.js`, `dedupe.js`, `revenue-est.js`).

### Per-item try/catch + sweep log (resilient batch)
**Source:** `adlib-sweep.js` L24-67.
**Apply to:** `fetch.js` (per-brand), `clean.js` (per-page), `revenue-est.js` (per-brand). One item's failure must not abort the batch; write a `_sweep-log.txt` / status line per item.

### Provenance header on every written artifact
**Source:** `crowdfund-fetch.js` L138-139 (`URL: ... TITLE: ... FETCHED: ...`); `adlib-one.js` L127-131.
**Apply to:** `clean.js` clean-md files, `fetch.js` raw files. Never write a bare blob; always stamp source + timestamp (feeds the never-fabricate discipline, D-10).

### Output-path is a `--out` flag, default `corpus/<slug>/...`
**Source:** `crowdfund-fetch.js` L38, L45.
**Apply to:** all fetch/clean scripts. Canonical tree is `corpus/<slug>/raw/` (fetch) → `corpus/<slug>/clean/*.md` (clean) → `corpus/<slug>/dump.json` (dumper agent) → `space-map.json` (classifier). `ads/<brand>.json` from `adlib-one.js`. This tree IS the clean-copy-only enforcement.

### Domain/name normalization key
**Source:** `adlib-one.js` L25-26.
**Apply to:** `dedupe.js` (brand merge by host).

---

## No Analog Found

| File | Role | Data Flow | Reason / what to use instead |
|------|------|-----------|------------------------------|
| `tools/revenue-est.js` | script S3 | arithmetic | No deterministic-compute script exists. Use the spec formula L174 + D-09/D-10/D-11 verbatim. No external pattern to copy. |
| `.claude/settings.json` hooks + validator scripts | hook H1 | event-driven gate | `settings.json` has only `permissions` today — no `hooks` block, no validator scripts anywhere. Net-new pattern: PostToolUse→Write→Node validator. Reject rules are fully specced (L176-190); enums L148-156. |
| `tools/clean.js` | script S2 | transform | No HTML→md cleaner exists. Only the `innerText` extraction tail of `crowdfund-fetch.js` L129-143 is reusable. Keep it ~30-line regex-dumb (capability_inventory #6). |

---

## Metadata

**Analog search scope:** `tools/`, `.claude/`, `_quarantine/runs/eink-tablets/scripts/`, repo-wide `*.js`/`*.json`/`*.md` grep for hooks/runtime.
**Files scanned:** `tools/adlib-one.js`, `tools/crowdfund-fetch.js`, `tools/adlib-sweep.js`, `.claude/settings.json`, `_quarantine/.../sw-sweep.js`, `.planning/codebase/STACK.md`, plus CONTEXT + master spec + capability_inventory.
**Runtime confirmed:** Node v20.20.0, Playwright 1.59.1 (global), no package.json/lockfile/local node_modules.
**Pattern extraction date:** 2026-06-03
</content>
