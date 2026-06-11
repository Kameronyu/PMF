# Phase 17: LP Builder — Pattern Map

**Mapped:** 2026-06-04
**Files analyzed:** 8 (5 net-new artifacts/scripts/skills · 3 reused-or-edited)
**Analogs found:** 8 / 8 (every new file has an in-repo analog — this is a wiring phase, not greenfield)

> Source-of-truth note: this phase has near-total analog coverage. The four shared JS idioms
> (S2 path sanitizer · S3 JSON-store shape · S4 sidecar-log/summary/partial-exit · the
> manifest-contract block) are the proven backbone copied verbatim from `tools/asset-upload.js`,
> `tools/asset-emit.js`, and the `16-05-PLAN.md` `<interfaces>` block. Planner: cite the exact
> lines below in each plan's action section — do not re-derive.

---

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `17-INTERFACES.md` | config (contract doc) | transform (schema freeze) | `16-05-PLAN.md` `<interfaces>` block (L69-85) + the asset-emit `_provenance`/`records[]` shape | role-match (doc, not code) |
| `runs/<space>/site/PAGE-SPEC.md` | config (content contract) | transform | `images.json`/`IMAGES.md` manifest shape (asset-emit `buildImagesMd` L216-345) | role-match |
| `.claude/skills/lp-builder/SKILL.md` | provider (judgment agent) | transform (copy+spec → HTML) | `.claude/skills/asset-classify/SKILL.md` | exact (skill ↔ skill) |
| `tools/lp-hydrate.js` | utility (deterministic script) | transform (string-substitution) | `tools/asset-upload.js` | exact (string-backfill ↔ string-backfill) |
| `.claude/skills/lp-ui-checker/SKILL.md` *or* `tools/lp-ui-check.js` | test (gate) | request-response (PASS/FAIL) | `tools/hooks/validate-asset-record.js` (deterministic reject) + asset-emit CLI shell | role-match |
| `tools/lp-deploy.js` *or* parameterized `surge_drive.py` | utility (deploy wrapper) | file-I/O (PTY deploy) | `runs/arduview/_tooling/surge_drive.py` | exact (deploy ↔ deploy) |
| `runs/<space>/site/integration.json` | config (provisioning) | transform (key→value) | `url-map.json` (consumed by asset-upload L178-190) | role-match |
| `runs/<space>/site/index.html` + `deposit.html` | component (builder output) | request-response (static page) | `runs/arduview/site/index.html` (268 ln) + `deposit.html` (97 ln) | exact (the proven output to match) |

**Reused as-is (NOT new — upstream/downstream deps, do not rebuild):**
`tools/asset-upload.js` (CDN backfill, D-08) · `tools/asset-emit.js` (asset manifest) ·
`runs/arduview/site/styles.css` (locked, LINKED only) · `runs/arduview/site/script.js` (front-end stubs — see Shared Pattern E).

---

## Shared Patterns

These four idioms cut across every new **script** (`lp-hydrate.js`, `lp-ui-check.js`, deploy wrapper)
and the **INTERFACES** doc. Copy them verbatim — they are already verified in-repo.

### S2 — Path sanitizer (apply to every `--space` / `--site` segment)
**Source:** `tools/asset-upload.js` L99-110 (identical in `asset-emit.js` L64-75; `16-05` `<interfaces>` L73-75)
**Apply to:** `lp-hydrate.js`, `lp-ui-check.js`, deploy wrapper — any argv used in a write/read path.
```javascript
function sanitizePathSegment(raw) {
  return String(raw)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, '')
    .replace(/\.\.+/g, '');
}
const SPACE = sanitizePathSegment(opts.space);
if (!SPACE) { console.error('ERROR: --space sanitized to empty; use [a-z0-9._-]'); process.exit(1); }
```
This is the V5 / path-traversal control flagged in RESEARCH Security Domain (T-16-05-01). Non-optional.

### S3 — JSON store shape (one wrapper object, underscore-meta, pretty-printed)
**Source:** `tools/asset-emit.js` L154-173 (`_provenance` block + wrapper) · `16-05` `<interfaces>` L77-78
**Apply to:** the INTERFACES doc's manifest definitions; `integration.json` is the trivial leaf case.
```javascript
const provenance = { source: 'asset-emit.js', space: SPACE, generated_at: ts /* ISO */ };
const imagesJson = { records: imageRecords, _provenance: provenance, gap_list };
fs.writeFileSync(jsonPath, JSON.stringify(imagesJson, null, 2));   // ALWAYS null, 2
```
INTERFACES.md should freeze every produced JSON as `{ <payload>, _provenance, ... }`,
`JSON.stringify(_, null, 2)`, underscore-prefixed meta keys.

### S4 — Sidecar log + one-line summary + partial-success exit
**Source:** `tools/asset-upload.js` L173-355 (`logLines[]`, `_asset-upload-log.txt`, summary, partial exit)
**Apply to:** `lp-hydrate.js`, `lp-ui-check.js`.
```javascript
const logLines = []; const ts = new Date().toISOString(); let ok = 0, warnings = 0;
// ... push [TAG] lines as you go ...
const summary = `lp-hydrate: ${ok} tokens filled, ${warnings} unfilled, space=${SPACE}`;
logLines.unshift(`[${ts}] ${summary}`);
fs.writeFileSync(path.join(SITE, '_hydrate-log.txt'), logLines.join('\n') + '\n');
console.log(summary);
// partial-success: exit 1 ONLY if zero filled AND work was expected (asset-upload.js L352-354)
if (ok === 0 && expectedTokens > 0) { console.error('  WARN: no tokens filled — check config keys'); }
```
Rule from asset-upload L259-261 (T-16-05-02): **never fabricate a missing value** — warn + leave the
token. The hydrate analog of "never construct a hashed video URL" is "never invent a Klaviyo/Shopify URL."

### S5 — CLI arg parse + `--help` early-exit + required-arg guard
**Source:** `tools/asset-upload.js` L35-94 (identical scaffold in `asset-emit.js` L25-59)
**Apply to:** every new Node script. Copy the `opts` reducer + the help block + the `if (!opts.x) exit(1)` guards.
```javascript
const args = process.argv.slice(2);
const opts = Object.fromEntries(
  args.filter(a => a.startsWith('--'))
    .map(a => { const [k, v] = a.replace(/^--/, '').split('='); return [k, v ?? true]; })
);
if (opts.help || args.length === 0) { console.log(`...usage...`); process.exit(0); }
if (!opts.site)  { console.error('ERROR: --site=<dir> is required');   process.exit(1); }
```

---

## Pattern Assignments

### `tools/lp-hydrate.js` (utility, string-substitution) — LPB-04

**Analog:** `tools/asset-upload.js` (exact — both are deterministic post-build string-backfill scripts that read a JSON map and replace tokens/filenames in files, then write a sidecar log with a partial-success exit).

**Imports + CLI:** copy S5 above (asset-upload L29-94). `require('fs')`, `require('path')`, zero third-party deps (RESEARCH A1 — no templating engine; this is a 2-token find-replace).

**Config-load pattern** (mirror asset-upload L178-190 — load JSON map, type-guard it):
```javascript
// integration.json = { "KLAVIYO_FORM_ACTION": "https://manage.kmail-lists.com/...",
//                      "SHOPIFY_CHECKOUT": "https://<store>.myshopify.com/cart/<variant>:1" }
let cfg;
try { cfg = JSON.parse(fs.readFileSync(CONFIG_PATH, 'utf8')); }
catch (e) { console.error(`ERROR: failed to load config at ${CONFIG_PATH}: ${e.message}`); process.exit(1); }
if (typeof cfg !== 'object' || Array.isArray(cfg)) {
  console.error('ERROR: integration.json must be a plain object { "<TOKEN>": "<value>" }'); process.exit(1);
}
```

**Core substitution pattern** (the `.split().join()` string-replace from asset-upload L210-227, applied to `{{TOKEN}}` instead of CDN filenames):
```javascript
const TOKENS = ['KLAVIYO_FORM_ACTION', 'SHOPIFY_CHECKOUT'];  // closed vocab — UI-SPEC token table L214-218
for (const file of ['index.html', 'deposit.html']) {
  const p = path.join(SITE, file);
  if (!fs.existsSync(p)) { logLines.push(`[SKIP] ${file} not found`); continue; }
  let html = fs.readFileSync(p, 'utf8');
  for (const t of TOKENS) {
    if (cfg[t] == null) {                                    // T-16-05-02: warn + leave, never fabricate
      logLines.push(`[WARN] ${t} absent from config — token left unfilled`); warnings++; continue;
    }
    const before = html;
    html = html.split(`{{${t}}}`).join(cfg[t]);             // asset-upload L221: rec.cdn_url assignment analog
    if (html !== before) { logLines.push(`[FILL] ${file} ${t}`); ok++; }
  }
  fs.writeFileSync(p, html);
}
// optional pre-deploy guard: warn on any stray /\{\{[A-Z_]+\}\}/ remaining (Security: token-leak to prod)
```

**Error handling + exit:** copy S4 verbatim. Token landing per UI-SPEC token table (L214-218) and RESEARCH Pitfall 5: `{{KLAVIYO_FORM_ACTION}}` → email `<form action>`; `{{SHOPIFY_CHECKOUT}}` → the deposit `<a data-checkout href>` (replaces the `#` placeholder in current `script.js`/`deposit.html`).

---

### `.claude/skills/lp-builder/SKILL.md` (provider, judgment agent) — LPB-03

**Analog:** `.claude/skills/asset-classify/SKILL.md` (exact — the only other "one judgment agent, everything around it is a script" orchestrator skill in the repo; the YAML-frontmatter + "what this is" + "chain position" + ENFORCEMENT MAP shape ports directly).

**Frontmatter + intro pattern** (asset-classify SKILL L1-30): `---\nname:\ndescription: >-\n  ...\n---` then a `> SCHEMA NOT DUPLICATED HERE` pointer line, then `# Title` + `## What this is`. The builder's description must state it is **the sole HTML writer**, **pure** (copy+visual-system+assets → markup), and emits **tokens not URLs** (D-03/D-04).

**Chain-position block** (copy the ASCII chain shape from asset-classify SKILL L40-52). For the builder:
```
UI-SPEC.md (visual) + PAGE-SPEC.md (content) + integration token names
  → /lp-builder  ← THE ONLY AGENT THAT WRITES HTML
    → lp-ui-check.js (deterministic gate, HARD-1..7) — FAIL loops back here, the sole re-writer
      → lp-hydrate.js (deterministic — {{TOKENS}})
        → asset-upload.js (deterministic — assets/img/<name>.jpg → CDN)
          → surge deploy (PTY)
```

**ENFORCEMENT MAP** (asset-classify SKILL L56-72 table — port the "Step | Kind | Mechanism | What enforces it" table). For the builder, exactly ONE row is JUDGMENT (compose markup); hydrate/asset-upload/check/deploy are DETERMINISTIC. This directly encodes the CLAUDE.md agent-design law.

**"Load-bearing truths" stated as plain fact** (asset-classify SKILL pattern): the builder (1) reads UI-SPEC class *names* + HARD-1..7, never the `styles.css` body (D-03 / RESEARCH Pattern 3); (2) renders only PAGE-SPEC visible copy (HARD-7 restraint — no invented figcaptions/eyebrows); (3) emits only the closed UI-SPEC token vocab + stable `assets/img/<name>.jpg` filenames. The reference `index.html` is the **proven output to match for the Arduview instance**, NOT the builder's spec (anti-pattern: Arduview semantics in the engine — RESEARCH Pitfall 4).

**Restraint / anti-tells reference:** UI-SPEC HARD-7 (L172-177) is the builder behavior constraint; the reference markup already demonstrates the locked component set (see `index.html` classes `.hero`, `.split`, `.feature__k`, `.cta__form`, `.frame--dark` and the CSS-hidden `figcaption.frame__tag` at L90/100/139).

---

### `.claude/skills/lp-ui-checker/SKILL.md` or `tools/lp-ui-check.js` (test, gate) — LPB-06

**Analog:** `tools/hooks/validate-asset-record.js` (the repo's "deterministic reject" precedent — closed-vocab / grounding reject before persist) + the asset-emit CLI shell (S5/S2/S4). The checker is the deterministic gate that fails the build on a HARD-rule violation, exactly as `validate-asset-record.js` rejects an off-vocab record.

**CLI + sanitizer + exit:** copy S5 + S2; exit-code IS the gate (exit 1 on any HARD violation — RESEARCH test map: "inject black-on-black `.hl` → expect exit 1").

**Static-parse checks** (HARD-1/2/3/7 — no render needed; parse emitted HTML + the known locked CSS rules):
- **HARD-1 (no black-on-black, RESEARCH Pitfall 1):** for every `.hl` inside a `--black`/`--black-2`/`.hero`/`.section--dark`/`.deposit-hero` container, computed text color ≠ computed bg. Highest-priority rule (recurred twice). Reference: the cascade branches live in the locked `styles.css`; checker asserts the builder did not *place* a highlight where it collapses.
- **HARD-2 (CTA legibility):** every primary `.btn` = accent bg, `#000` text, non-Doto (`var(--mono)`) font-family.
- **HARD-3:** `body { font-size: 17px }`; no primary reading text < 17px (allow the listed fine-print classes).
- **HARD-7 (restraint):** no rendered `figcaption` text; no visible string absent from PAGE-SPEC copy.

**Render-only check** (flag for planner — the one check that may need Playwright at `/home/kyu3/node_modules/playwright`, RESEARCH Open Q2): **HARD-4** "hero video ≥50% of hero area." HARD-5 breakpoint order can be a static DOM-order check.

---

### `tools/lp-deploy.js` / parameterized `surge_drive.py` (utility, deploy) — LPB-07

**Analog:** `runs/arduview/_tooling/surge_drive.py` (exact). Keep the PTY mechanism verbatim — `pty.fork()` + `select` loop + 220s timeout + feed `EMAIL`/`PW` on the `email:` prompt is the proven credential-feed (piping stdin fails surge's prompt; see memory `reference_surge_static_deploy`).

**Only change — parameterize SITE + DOMAIN** (currently hardcoded at L8-9):
```python
# was: SITE = '/home/kyu3/PMF/runs/arduview/site'; DOMAIN = 'arduview-see-through.surge.sh'
SITE   = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('LP_SITE',   '/home/kyu3/PMF/runs/arduview/site')
DOMAIN = sys.argv[2] if len(sys.argv) > 2 else os.environ.get('LP_DOMAIN', 'arduview-see-through.surge.sh')
```
**Keep verbatim:** the `argv = ['npx','--yes','surge','.',DOMAIN]` invocation (L13), the `pty.fork`/`os.execvp` child (L14-17), the select/read/feed loop (L19-41), the `b'email:' in buf.lower()` trigger (L33-35). Flag for planner: the plaintext throwaway creds (L10-11) stay throwaway — do NOT commit real credentials (RESEARCH Runtime State / Security).

---

### `17-INTERFACES.md` (config, schema freeze) — LPB-01

**Analog:** `16-05-PLAN.md` `<interfaces>` block (L69-85) — the manifest-contract precedent for D-01. Each stage gets a documented Reads/Writes/Invariants block; downstream "Reads" matches upstream "Writes" by schema name only (RESEARCH Pattern 1).

**Shape to mirror** (one stage-block per stage; the RESEARCH Pattern-1 template at RESEARCH L191-201):
```markdown
### Stage: HTML BUILDER
**Reads:** UI-SPEC.md (Component Inventory class names, HARD-1..7, token table) · PAGE-SPEC.md (copy + asset map + section map)
**Writes:** {space}/site/index.html, deposit.html — tokenized HTML
**Output invariants:**
  - every {{TOKEN}} ∈ the UI-SPEC token table (no invented tokens)
  - every <img src> = assets/img/<name>.jpg per PAGE-SPEC asset map (no live URLs)
  - links <link rel=stylesheet href=styles.css> (never inlines/authors CSS)
  - every visible string ∈ PAGE-SPEC copy (HARD-7)
**MUST NOT:** author CSS · invent chrome · emit live URLs · embed Arduview/crowdfunding semantics
```
Carry S3 (the `{records, _provenance, gap_list}` wrapper, `JSON.stringify(_,null,2)`) as the frozen shape for every JSON seam (`integration.json`, `url-map.json`, the asset manifests).

---

### `runs/<space>/site/PAGE-SPEC.md` (config, content contract) — LPB-02

**Analog:** the `IMAGES.md` manifest emitter (`asset-emit.js` `buildImagesMd` L216-345) — a markdown table manifest with section headers + per-row asset/claim columns, plus the `images.json` queryable JSON shape. PAGE-SPEC is the same idea for *copy + section map*: ordered section→component table, a closed copy-slot table, an asset-map (filename→alt) table, and a tokens-used list (⊆ UI-SPEC token table). Schema template in RESEARCH L311-340.

Recommendation (RESEARCH Open Q5): PAGE-SPEC marks the single per-section `.hl` highlight explicitly (e.g. `{{hl:...}}`) so the builder never *chooses* emphasis (feeds HARD-1's checker, preserves HARD-7 restraint). Content extracted at plan-time from `runs/arduview/COPY-DRAFT.md` — the **builder never opens COPY-DRAFT**.

---

### `runs/<space>/site/integration.json` (config, provisioning) — LPB-05

**Analog:** `url-map.json` (the trusted operator-pasted map consumed by `asset-upload.js` L178-190). Same posture: a plain `{ "<KEY>": "<value>" }` object, manual-paste, treated as trusted operator input (16-05 T-16-05-03 "accept"). Type-guard on load (asset-upload L186-189). Shape: `{ "KLAVIYO_FORM_ACTION": string, "SHOPIFY_CHECKOUT": string }`. Non-secret public endpoint strings by design (D-04/D-07) — distinct from the surge host creds.

---

### `runs/<space>/site/index.html` + `deposit.html` (component, builder output) — LPB-08

**Analog:** `runs/arduview/site/index.html` (268 ln) + `deposit.html` (97 ln) — **the proven output to match for the Arduview instance** (not the builder spec). These are what the builder regenerates tokenized. Concrete conventions the builder must reproduce:

**`<head>` font-load + stylesheet link** (index.html L9-13 — verbatim, never re-authored):
```html
<link href="https://fonts.googleapis.com/css2?family=Doto:wght@400;700;800;900&family=Space+Grotesk:wght@400;500;600&family=IBM+Plex+Mono:ital,wght@0,400;0,500;1,400&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="styles.css" />
```
**Section markup convention** (index.html L72-93 — `.section--dark` → `.wrap` → `.split` → `.split__copy`/`.split__media` with a `.frame--dark` figure; the `figcaption.frame__tag` is CSS-hidden, satisfying HARD-7).
**Email-capture form** (index.html L40-43 — `.cta__form` + `.cta__input` + `.btn`). The builder must add `action="{{KLAVIYO_FORM_ACTION}}"` (the reference form has NO action today — RESEARCH Pitfall 5).
**Stable asset filenames** (already correct in reference: `assets/img/transparency.jpg`, `maker.jpg`, `gameplay.jpg`, `scale.jpg`, `kickstarter.png`, `hero-poster.jpg`, `assets/video/hero.mp4` — UI-SPEC L220). asset-upload.js backfills CDN.

---

## Shared Pattern E: `script.js` is a DEMO stub — reconcile, don't rebuild (RESEARCH Pitfall 5)

**Source:** `runs/arduview/site/script.js`. Current behavior: (a) **every** `.cta__form` submit does
`window.location.href = "deposit.html"` (demo click-through, L41-44 of script.js); (b) the
`[data-checkout]` handler only logs + changes button text — never navigates to Shopify (L49-58).

**Decision the INTERFACES spec must lock** (RESEARCH Open Q3/Q4): aim to keep `script.js` **token-free**
— forms POST natively to `{{KLAVIYO_FORM_ACTION}}` via the `<form action>`, and the deposit link
navigates to `{{SHOPIFY_CHECKOUT}}` via the `data-checkout` href. Then `lp-hydrate.js` touches ONLY the
two HTML files; `script.js` stays reveal/UX-only and is the shared static file (not per-instance, not
hydrated). If real Klaviyo submission needs a `fetch`, `script.js` joins the hydrate pass — confirm with
the operator's Klaviyo embed-mode answer (A3/A4, MEDIUM-risk assumptions).

---

## No Analog Found

None. Every new file maps to an existing in-repo analog. The only genuinely *new* judgment surface is
the builder's HTML-composition prompt body (the layout decisions) — but even its **structure** (skill
frontmatter, chain-position, enforcement-map, load-bearing-truths) is copied from `asset-classify/SKILL.md`,
and its **output target** is the existing reference `index.html`/`deposit.html`.

---

## Metadata

**Analog search scope:** `tools/` (asset-upload, asset-emit, hooks) · `.claude/skills/` (asset-classify, copywriter, funnel-*) · `runs/arduview/site/` (index/deposit/styles/script) · `runs/arduview/_tooling/` (surge_drive.py) · `.planning/phases/16-*/16-05-PLAN.md`.
**Files scanned:** 9 read in full + 1 skill listing + 16-05 interface/grep.
**Pattern extraction date:** 2026-06-04
**Key precedent chain:** `16-05` froze the manifest contract (D-01 precedent) → `asset-upload.js` is the string-backfill model for `lp-hydrate.js` → `asset-classify/SKILL.md` is the one-judgment-agent model for `lp-builder` → `surge_drive.py` is the deploy → the reference `index.html` is the proven output. This phase is ~80% wiring proven bricks behind frozen contracts.
