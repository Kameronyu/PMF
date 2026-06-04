# Phase 3: Stage M1-S3 — Deep competitive analysis (collection layer) - Pattern Map

**Mapped:** 2026-06-03
**Files analyzed:** 7 (5 new + 2 extend) + 1 DR-injection hook + 1 scaffold doc
**Analogs found:** 9 / 9 (every component has a verified in-repo analog)

This phase EXTENDS existing Phase-1 tooling into a parallel brick string for funnels. The
architecture is already proven in the repo: deterministic scripts (`tools/*.js`), validate-on-Write
hooks (`tools/hooks/validate-*.js`), and a single multi-stage agent prompt file (`prompts/step1-light-pass.md`).
The new pipeline mirrors that 1:1. **Do not invent new file conventions — every shape, every hook
pattern, every prompt structure already exists.**

---

## File Classification

| New/Modified File | Brick | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|-------|------|-----------|----------------|---------------|
| `tools/adlib-one.js` (EXTEND) | S1 fetch + S2 normalize | scraper/CLI | file-I/O + transform | itself (current shape) | extend-in-place |
| `tools/funnel-assemble.js` (NEW) | S2 cluster/render | assembler/script | transform + file-I/O | `tools/fetch.js` (Playwright LP render) + `tools/dedupe.js` (cluster/merge) | exact |
| `tools/crowdfund-fetch.js` (EXTEND) | S1 fetch + parse | scraper/CLI | file-I/O + transform | itself (render skeleton) | extend-in-place |
| `tools/funnel-clean.js` (NEW) | S2 clean | cleaner/script | transform | `tools/clean.js` | exact |
| `tools/funnel-score.js` (NEW) | S3 score | scorer/script | transform (arithmetic) | `tools/fetch.js` `classifyTrendShape` (pure-arithmetic classifier) + `tools/revenue-est.js` | role-match |
| `prompts/funnel-deep-pass.md` (NEW) | A2 classify + A3 extract | agent prompt | request-response (LLM) | `prompts/step1-light-pass.md` | exact |
| `tools/funnel-store.js` (NEW) | S4 store | store/script | file-I/O | `tools/fetch.js` `writeRaw` + arduview output layout | role-match |
| `tools/hooks/validate-analyzer.js` (NEW) | hook | validator | request-response (exit code) | `tools/hooks/validate-dumper.js` | exact |
| `tools/hooks/inject-dr.js` (NEW) | hook | DR auto-inject | file-I/O | NONE (see No Analog Found) | partial |
| `.../03-DEBUG-RUN-NOTES.md` (NEW scaffold) | doc | scaffold | — | `.../01-DEBUG-RUN-NOTES.md` | exact |

> The Router (D-10) is NOT a separate agent file. Per spec §4 + D-10 it is a small light-classify
> step whose only output is the funnel-level `routing_flag`, set BEFORE the analyzer. Treat it as a
> short prompt block (Agent 1 in `funnel-deep-pass.md`) or a tiny pre-pass — same file as the analyzer
> prompt, mirroring how `step1-light-pass.md` carries multiple agent blocks in one file. Do not spawn
> a standalone tool for it.

---

## Critical Build Gap — current `adlib-one.js` output shape

The single biggest gap (D-06). **Current** per-ad record emitted by `parseAdsFromText` (lines 95-123):

```javascript
ads.push({ library_id, start_date, end_date, run_length_days, text });
```

And the top-level shape (lines 233-243):

```javascript
const adJson = {
  slug, brand_query: brand, status,
  resolved_advertiser: { name, pageId, followers },
  active_ad_count: count, library_ids_loaded: loaded,
  ads,   // [{ library_id, start_date, end_date, run_length_days, text }]
};
```

**Missing for the §2b binding spine (must be added per ad):** `destination_url` (THE binding key),
`cta_text`, `headline`, `impression_bucket`, `platforms`. Without `destination_url` there is nothing
to cluster on — the funnel unit cannot be assembled. `run_length_days` / `start_date` / `end_date`
ALREADY exist and feed Currency A (`max_run_duration_days`) untouched.

**Why this is hard, and where the existing pattern helps:** the Ad Library DOM is hashed, so the
current code does NOT use selectors — it chunks `document.body.innerText` on the `Library ID:`
delimiter (line 100) and regex-extracts fields per chunk. `destination_url` / `cta_text` / `headline`
are NOT in `innerText` the same way (the destination URL is on the "See ad details" / CTA anchor href,
impression bucket only appears on the EU/DSA view). The extend must either (a) add per-card DOM
extraction in the `page.evaluate` step (lines 167-174 typeahead pattern shows the `page.evaluate`
DOM-read convention), or (b) extend the text-chunk regex where the fields do surface. Calibration
against the live DOM is a debug-pass task (D-17), exactly as the header comment at lines 80-85 already
anticipates ("The 01-05 debug pass calibrates these patterns against the real DOM").

---

## Pattern Assignments

### `tools/adlib-one.js` (EXTEND — scraper, S1/S2)

**Analog:** itself. Preserve the working skeleton; add fields only.

**Per-ad emit to extend** (line 119) — add the binding key + new fields:
```javascript
// CURRENT:
ads.push({ library_id, start_date, end_date, run_length_days, text });
// TARGET (D-06):
ads.push({ library_id, start_date, end_date, run_length_days, text,
           destination_url, cta_text, headline, impression_bucket, platforms });
```

**Never-fabricate discipline to inherit** (lines 116-117): when a field cannot be parsed, write
`null` — never a guess. The code already does this for `run_length_days`; the new URL/CTA/headline
fields MUST follow the same rule (a missing destination URL = `null`, which the assembler treats as
`ambiguous_destination`, D-05).

**DOM-read convention to copy** (lines 167-174) — `page.evaluate` returning structured objects:
```javascript
candidates = await page.evaluate(() => {
  return [...document.querySelectorAll('li[role="option"]')]
    .map((li) => { const m = (li.getAttribute('id')||'').match(/pageID:(\d+)/);
                   return m ? { pageId: m[1], text: li.innerText.trim() } : null; })
    .filter(Boolean);
});
```
The new per-card extraction (destination href, CTA button text) follows this exact shape: query
nodes, map to plain-object records, filter nulls.

**CLI + opts + output conventions to keep** (lines 13-22, 244): positional + `--flag` arg split,
`fs.writeFileSync(path.join(OUT, '<slug>.json'), JSON.stringify(adJson, null, 2))`, and the one-line
console summary (lines 254-256). Do not change the output path or filename — downstream reads `ads/<slug>.json`.

---

### `tools/funnel-assemble.js` (NEW — assembler, S2 cluster + LP render)

This is the §2b spine: normalize destination URLs → cluster ads → render each LP → emit one
`funnel_package` per cluster. No single analog does all of it; it composes two.

**Analog A — LP render: `tools/fetch.js` `fetchPage` (lines 333-367).** Copy verbatim. It already
bundles the CF-clear loop + networkidle + "Read more" expansion that JS-rendered DTC/crowdfunding LPs
need (D-08):
```javascript
async function fetchPage(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  for (let i = 0; i < 15; i++) {           // CF-clear loop (from crowdfund-fetch.js L90-94)
    const t = await page.title().catch(() => '');
    if (!t.match(/just a moment|cloudflare|checking your browser/i)) break;
    await page.waitForTimeout(1000);
  }
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  const expandSelectors = ['button:has-text("Read more")', /* ... */];
  for (const sel of expandSelectors) { /* click all */ }
  const html = await page.content();
  return { html, title: await page.title().catch(() => '') };
}
```
Also copy the browser/context boilerplate with fingerprint masking (`fetch.js` lines 414-439) —
identical block already shared between `fetch.js` and `crowdfund-fetch.js`.

**Analog B — clustering/merge: `tools/dedupe.js`.** Merge-by-key (domain) is the proven pattern;
funnel clustering is merge-by-normalized-destination-URL. Also see `adlib-one.js` `mergeAds`
(lines 124-132) which de-dupes by `library_id` with a `Map` — the exact idiom for
"group records by a key into clusters":
```javascript
function mergeAds(a, b) {
  const byId = new Map();
  for (const ad of [...a, ...b]) {
    const prev = byId.get(ad.library_id);
    if (!prev) byId.set(ad.library_id, ad);
    else if (!prev.end_date && ad.end_date) byId.set(ad.library_id, ad);
  }
  return [...byId.values()];
}
```
Funnel clustering is the same `Map`-by-key — keyed on `normalizeUrl(destination_url)` instead of
`library_id`. `variant_count = cluster.length`.

**URL normalization** — net-new helper, no exact analog, but follow the tolerant-pure-function style
of `fetch.js` `slugifyPath` (lines 325-328): strip `utm_*`/`fbclid` query params, lowercase host,
drop trailing slash, normalize protocol (D-04). Edge cases per D-05: a linktree/homepage destination →
do not cluster, stamp `ambiguous_destination`; zero-ad crowdfunding LP → a valid funnel with empty
`bound_ads[]`.

**Output `funnel_package` shape** (spec §2b lines 78-91 — the contract, build exactly):
```javascript
funnel_package {
  funnel_id, competitor, source_type, landing_page_url /*normalized*/, landing_page_body /*raw rendered*/,
  bound_ads: [ { ad_creative_ref, primary_text, headline, cta_text,
                 started_running_date, impression_bucket, platforms } ],   // may be []
  crowdfunding_stats: { amount_raised, backer_count, funded_vs_failed, delivered_vs_not }  // if applicable
}
```

**Resilient-batch discipline to inherit** (`fetch.js` lines 444-533): per-funnel try/catch, push
errors to a log array, never abort the batch on one bad LP. Write a `_funnel-assemble-log.txt`
sidecar exactly like `fetch.js` writes `_fetch-log.txt` (line 548).

---

### `tools/crowdfund-fetch.js` (EXTEND — Currency-B parser, S1 + parse)

**Analog:** itself. The render skeleton (lines 51-152) is already correct and is reused verbatim by
`fetch.js`. Keep it; ADD a parser (D-07).

**Render skeleton to reuse as-is** (lines 86-131): goto → CF-clear loop → networkidle →
expand-controls → `document.body.innerText`. It currently DUMPS `.html`/`.txt`/`.png` (lines 136-143)
and parses nothing.

**What to add — a Currency-B stat parser** (D-07, spec §3 lines 110-117). After the text extraction
at line 131, parse from the rendered text/HTML:
```javascript
crowdfunding_stats { amount_raised, backer_count, funded_vs_failed, delivered_vs_not }
```
Use the tolerant multi-pattern regex idiom already proven in `fetch.js` `extractTrendSeries`
(lines 199-247) — try several patterns in order, return `null` on no-match, never throw. Kickstarter/
Indiegogo/Crowd Supply each render these numbers differently, so a pattern-cascade (KS pattern →
Indiegogo pattern → generic `$[\d,]+ pledged` / `[\d,]+ backers`) is the right shape. `delivered_vs_not`
(prior-campaign-shipped, the strongest durability signal) comes from the creator's profile/history,
likely a separate `--type=` fetch.

**Keep the `--type=` multi-page convention** (lines 37, 118-127): `campaign|comments|updates|risks|faq`.
The stat parse runs on `--type=campaign`; comments/updates feed `verbatim_refs` review-language later.

---

### `tools/funnel-clean.js` (NEW — cleaner, S2)

**Analog:** `tools/clean.js`. Near-direct reuse.

**Core stripper to copy** (`clean.js` lines 45-71) — `stripToText(html)`: kills `<script>/<style>/
<nav>/<header>/<footer>`, strips remaining tags, decodes entities, collapses whitespace. This is the
"dumb regex, swappable later" brick (header comment line 6). It stays dumb — it does NOT decide belief
boundaries (spec §5: the Analyzer cuts beliefs, the cleaner only marks structure).

**Difference from `clean.js`:** funnel-clean reads `landing_page_body` from the `funnel_package` (one
funnel = one body), not `corpus/<slug>/raw/*.html`. And per spec §1/§6c it must produce
**section-marked** clean copy AND capture **on-page reviews** verbatim (tagged `review_language` for
`verbatim_refs[]` later). So extend `stripToText` to emit structural section markers rather than
flatten everything, and to preserve review blocks rather than treat them as footer chrome.

**Provenance header convention to keep** (`clean.js` lines 109-110):
```javascript
const provenance = `<!-- source: ${rawPath} | cleaned: ${new Date().toISOString()} -->`;
```

**Per-file try/catch batch** (`clean.js` lines 106-124, comment "one bad file doesn't abort the
batch") — inherit it per funnel.

---

### `tools/funnel-score.js` (NEW — validation scorer, S3)

**Analog:** `tools/fetch.js` `classifyTrendShape` (lines 263-291) — the proven pure-arithmetic,
no-LLM classifier (its header comment: "Deterministic pure-arithmetic classifier — NO LLM
(CLAUDE.md: deterministic → script)"). This IS the model: a script that maps numbers to a stamped
field with documented thresholds, zero judgment.

**Two currencies, NO normalization** (spec §3, D-09). Stamp `validation_lane` (A or B) +
`validation_strength`, never collapse to one number:
```javascript
// Currency A (ad-fed): max_run_duration_days (spine; 60+ ≈ top ~11%) × impression_bucket × variant_count
// Currency B (crowdfunding): amount_raised, backer_count, funded_vs_failed, delivered_vs_not
```
`max_run_duration_days` is `Math.max(...bound_ads.map(a => a.run_length_days))` — the
`run_length_days` field `adlib-one.js` already computes (`daysBetween`, lines 90-94). A funnel running
ads INTO a crowdfunding page has BOTH lanes — record both.

**Documented-threshold style to inherit** (`classifyTrendShape` lines 254-262, the block comment that
spells out every threshold). Do the same: write the 60-day anti-fluke floor and bucket multipliers as
a documented constant block. `daysBetween` / `toISO` helpers (`adlib-one.js` lines 86-94) are
copyable arithmetic.

**Anti-fluke "surface, don't gate" precedent** (`space-map.json` `anti_fluke`, step1 lines 159-161):
Phase 1 NEVER hard-gates on the floor — it surfaces the number. Carry the same discipline: the scorer
stamps `validation_strength`, it does not drop weak funnels.

---

### `prompts/funnel-deep-pass.md` (NEW — Router + Section Analyzer, the one judgment file)

**Analog:** `prompts/step1-light-pass.md`. This is the format template to inherit wholesale (spec §0
standardization rule; canonical_refs explicitly names it as "the cleanest existing pattern for agent
separation + the format template").

**Structure to mirror** (`step1-light-pass.md` overall layout):
1. A `# Title` + goal + an ASCII pipeline diagram (lines 7-21).
2. A `## SCHEMA (the contract every stage reads/writes)` block with fenced JSON (lines 29-181) —
   build the §6a funnel-level + §6b belief-instance record schemas here, in the same fenced-JSON-with-
   inline-comments style.
3. A `### Closed enums (a value off-list is a hard reject)` block (lines 173-181) — this is where the
   D-15 controlled vocab (`execution_type`, `proof_tier`, `claim_type`, `move`) gets pinned as closed
   enums, resolved against repo conventions + the six DR files. `claim_type` ALREADY exists as
   `CLAIM_TYPE_ENUM: direct | enlarged | mechanism | enhanced` (line 176) — REUSE IT, do not coin a
   second claim-type vocab (the no-duplicate-tags rule, D-15).
4. A `## DETERMINISTIC SCAFFOLD (scripts + hooks — NOT agent honor system)` section listing the
   companion scripts + the validate-on-Write hooks (lines 185-218).
5. Numbered `## AGENT N — NAME` blocks, each a fenced prompt the orchestrator pastes (lines 222-503).

**Agent-block prompt conventions to copy** (e.g. Dumper, lines 329-378):
- Opens by stating what the agent does AND a hard list of what it must NOT do ("You do NOT fetch...
  You do NOT assign transformations — leave those null").
- "Observation first, classify second" / "verbatim, copied not interpreted" discipline — directly
  reusable for the Analyzer's §8 descriptive-not-prescriptive rule and its two-pass requirement
  (observe literal facts, THEN map to tags).
- Ends with "Output ONLY valid <schema>. No prose."

**Two agent blocks in this one file** (mirrors step1 carrying Finder/Verifier/Dumper/Classifier):
- **AGENT 1 — ROUTER (light A2-classify, D-10):** input = competitor + run transformation (from
  `space-map.json` chosen cell) + `definitions.md` transformation definition; output = funnel-level
  `routing_flag` ∈ `{structure_only, messaging_full, both}`. ONE judgment: transformation-similar or
  not. Set BEFORE the analyzer, never inferred by it. (Model: cheap tier.)
- **AGENT 2 — SECTION ANALYZER (A2+A3, the workhorse):** reads cleaned funnel copy + bound-ad angles;
  emits the §6b belief-instance records (open-with-anchors taxonomy §7, funnel-level ordinal `position`
  §5, granular `execution_detail` §6b). Bake §8 hard rules into the prompt verbatim. The DR files are
  AUTO-INJECTED by the hook (§11) — the prompt references them as available context, does not inline
  them. (Model: quality tier — the one agent that needs it, D-Discretion.)

**Bake-vs-inject rule (§11, canonical_refs):** Router + every block EXCEPT the Analyzer get DR logic
BAKED into the prompt prose (no raw DR at runtime). Only the Section Analyzer gets the live 6-file
injection. This file therefore reads as: Router prompt = self-contained; Analyzer prompt = self-
contained PLUS "DR files injected at runtime by inject-dr.js."

---

### `tools/funnel-store.js` (NEW — store, S4)

**Analog:** `tools/fetch.js` `writeRaw` (lines 372-381) for the write-with-sidecar idiom, plus the
repo's existing run-output layout.

**D-16: output under `runs/<space>/funnels/`**, NOT repo-root. NOTE the real Phase-1 run output
actually lives at repo ROOT (`./ads/`, `./corpus/<slug>/`, `./brands.json`, `./space-map.json`) —
`runs/arduview/` today holds only `pre-research-plan.md`. The spec/D-16 wants the new funnel store
namespaced under `runs/<space>/funnels/`. Conform field NAMES and JSON-format to the Phase-1
conventions (below) while using the namespaced path.

**Phase-1 JSON conventions to conform to:**
- Top-level wrapper object with a `slug`/identifier + a records array, e.g. `ads/<slug>.json`:
  `{ slug, brand_query, status, resolved_advertiser, active_ad_count, ads: [...] }`.
- `space-map.json` uses `_provenance` / `_note` underscore-prefixed meta keys inline (step1 lines
  53-57, 123-124) — reuse that convention for any store-level metadata.
- Pretty-printed: `JSON.stringify(obj, null, 2)` everywhere (every tool uses this).
- One funnel = one `funnel_package` + N belief records. Shape: a per-funnel JSON file under
  `runs/<space>/funnels/<funnel_id>.json` (mirrors `ads/<slug>.json` one-file-per-unit), each
  carrying the §6a funnel fields + the `belief_records[]` array.

**Vectorizable-but-not-vectors** (D-16): preserve granular `execution_detail` + `verbatim_refs[]`
(with `review_language` vs competitor-marketing tags, §6c). S4 is structured JSON only — vectorization
is downstream/JIT.

---

### `tools/hooks/validate-analyzer.js` (NEW — validate-on-Write hook)

**Analog:** `tools/hooks/validate-dumper.js`. Near-direct structural copy.

**Hook contract to copy exactly** (validate-dumper lines 11-44): `node <hook> <path-to-output.json>`;
read file → REJECT on read error (exit 2 + stderr) → `JSON.parse` → REJECT on parse error →
validate → `process.exit(2)` with `REJECT: ...` messages on violation, silent `process.exit(0)` on
pass. The `violations[]`-accumulate-then-dump pattern (lines 99, 154-159) is the idiom.

**Verbatim-substring gate to adapt** (validate-dumper lines 132-148): the Dumper hook rejects any
`claims[]` string that is not a verbatim substring of the brand's clean corpus. The Analyzer hook does
the same for `verbatim_refs[]` against the cleaned funnel copy — kills hallucinated/paraphrased
verbatim. Copy `findCleanDir` + corpus-load (lines 66-97) and point it at the funnel's cleaned body.

**Analyzer-specific reject rules (from spec):**
- `belief_id` off the §7 anchor set with `belief_confidence` NOT lowered → reject (overflow beliefs
  must be flagged for review, §7).
- `execution_type`/`proof_tier`/`claim_type`/`move` off the closed vocab (D-15) → reject (same shape
  as step1's `claim_type` off-enum reject, lines 209-212).
- `position` not a funnel-level ordinal (e.g. duplicated/page-local) → reject (§5/D-12, the known
  failure point).
- Any field the analyzer must NOT set that birdseye computes (consensus/divergence) present → reject
  (§8 single-funnel discipline — same spirit as the dumper's "must not classify" rejects, lines 105-113).

---

### `.../03-DEBUG-RUN-NOTES.md` (NEW scaffold)

**Analog:** `.planning/phases/01-stage-m1-s1-light-pass/01-DEBUG-RUN-NOTES.md`. Scaffold the same
section structure now (D-18); fill on the first real deep-analysis run (D-17 — the methodology-break
pass waits for a real market).

---

## Shared Patterns

### Playwright browser + fingerprint-masking boilerplate
**Source:** `tools/fetch.js` lines 414-439 (identical block also in `tools/crowdfund-fetch.js` lines 51-77).
**Apply to:** `funnel-assemble.js`, and the `crowdfund-fetch.js` extension.
```javascript
const browser = await chromium.launch({ headless: true,
  args: ['--disable-blink-features=AutomationControlled', '--no-sandbox', '--disable-setuid-sandbox'] });
const context = await browser.newContext({
  userAgent: 'Mozilla/5.0 (Macintosh; ...) Chrome/130.0.0.0 Safari/537.36',
  viewport: { width: 1440, height: 900 }, locale: 'en-US', timezoneId: 'America/New_York',
  extraHTTPHeaders: { 'Accept-Language': 'en-US,en;q=0.9' } });
await context.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
  Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] }); });
```

### CLI arg parsing (positional + `--flag=val`)
**Source:** every tool — canonical at `tools/adlib-one.js` lines 13-22, `tools/fetch.js` lines 20-26.
**Apply to:** all new scripts.
```javascript
const args = process.argv.slice(2);
const opts = Object.fromEntries(args.filter(a => a.startsWith('--'))
  .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; }));
```
Always ship a `--help` block (every tool has one) and a one-line console summary on completion.

### Resilient-batch + sidecar log
**Source:** `tools/fetch.js` lines 444-548 (per-item try/catch, push to `results[]`, write `_*-log.txt`),
`tools/clean.js` lines 106-130.
**Apply to:** `funnel-assemble.js`, `funnel-clean.js`, `funnel-score.js`, `funnel-store.js`. One bad
funnel never aborts the batch; absence of a page is data, logged not thrown.

### Never-fabricate (null over guess)
**Source:** `tools/adlib-one.js` lines 116-117 ("never-fabricate (D-10): no parseable start → null
run_length, never a guess"), echoed in step1 (line 371) and the dumper hook's verbatim-substring gate.
**Apply to:** every parser (new fields in adlib-one, the Currency-B parser, all analyzer verbatim).
Unparseable field = `null`; never a fabricated value.

### Validate-on-Write hook contract (exit 0 pass / exit 2 + stderr reject)
**Source:** `tools/hooks/validate-dumper.js` (and `validate-classifier.js`, `validate-finder.js`,
`validate-revenue.js` — four working examples).
**Apply to:** `validate-analyzer.js`. Same `node <hook> <path>` signature, same
violations-accumulate-then-exit-2 idiom. Hooks reject bad output — they do NOT trust the prompt
(step1 lines 23-26, 201).

### Closed-enum / controlled-vocab as hard-reject
**Source:** `prompts/step1-light-pass.md` lines 173-181 + `validate-classifier.js`.
**Apply to:** the D-15 vocab in `funnel-deep-pass.md`. REUSE the existing `CLAIM_TYPE_ENUM`
(`direct|enlarged|mechanism|enhanced`) for the funnel `claim_type` field — do not coin a parallel one.
New closed sets (`execution_type`, `proof_tier`, `move`) get the same off-list-is-hard-reject treatment.

### `JSON.stringify(obj, null, 2)` + underscore-meta keys
**Source:** every tool; `_provenance`/`_note`/`_anti_fluke_floor` meta convention from `space-map.json`
(step1 lines 53-57). **Apply to:** `funnel-store.js` and all JSON emit.

---

## No Analog Found

| File | Role | Reason | Planner guidance |
|------|------|--------|------------------|
| `tools/hooks/inject-dr.js` | DR auto-injection hook (§11) | No runtime context-injection hook exists in the repo. Phase-1 hooks are all PostToolUse VALIDATORS (reject bad output); none INJECT context into an agent's window pre-run. | Net-new mechanism. Spec §11 + D-Discretion leave the HOW open (load/trim/order/cache/context-limits). Reuse only the file-read idiom (`fs.readFileSync` over the six `~/knowledge/dr-marketing/*.md` paths listed in CONTEXT canonical_refs). The six target files are fixed; the hook concatenates/trims them into the Section Analyzer's context each run. This is the one component the planner should treat as genuinely new design, grounded in RESEARCH.md if it covers agent context-injection. |

The off-transformation crowdfunding **discovery** lane (D-19) is explicitly NOT built this phase — the
assembler ACCEPTS a hand-fed crowdfunding LP list; nothing discovers off-transformation containers.
No analog needed because no file is built for it.

---

## Metadata

**Analog search scope:** `tools/`, `tools/hooks/`, `prompts/`, repo-root run output (`ads/`, `corpus/`,
`brands.json`, `space-map.json`), `runs/arduview/`, `.planning/phases/01-*`.
**Files scanned:** `adlib-one.js`, `crowdfund-fetch.js`, `fetch.js`, `clean.js`, `dedupe.js`,
`revenue-est.js`, `step1-light-pass.md`, `validate-dumper.js`, `validate-classifier.js`, plus output
samples (`ads/anbernic.json`, `brands.json`, `space-map.json`, `corpus/gameshell/`).
**Pattern extraction date:** 2026-06-03
