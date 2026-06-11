# Phase 17: LP Builder — Research

**Researched:** 2026-06-04
**Domain:** Reusable copy→HTML LP-builder pipeline (frozen inter-stage contracts; one judgment agent; deterministic token substitution + deploy)
**Confidence:** HIGH (this is an internal-architecture phase grounded in proven in-repo artifacts, not an ecosystem-lookup phase — every recommendation is verified against existing code/specs in this repo, not training data)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions (D-01 … D-13, verbatim intent)
- **D-01:** Pipeline = stages with **frozen inter-stage contracts**, ordered so no stage re-edits an upstream stage's output. Phase 17's FIRST deliverable is an **INTERFACES spec** that freezes every stage's input/output schema. Stages code against the *schema*, not the neighbor's guts. (The "manifest contract" move the asset bricks already used.)
- **D-02:** Stage spine: `design-research → DESIGN-DIRECTION` *(deferred, Phase 18 — NOT a blocker)* → **UI-SPEC** (visual contract, exists) → **PAGE-SPEC** (content contract) → **asset prep** (upstream, Phase-16) → **HTML BUILDER** (the only agent that writes HTML; eats UI-SPEC + PAGE-SPEC + integration-config → tokenized markup, links locked `styles.css`) → **hydrate** (script, fills `{{KLAVIYO_FORM_ACTION}}` / `{{SHOPIFY_CHECKOUT}}`) → **asset-upload.js** (script, exists — filename→CDN) → **deploy** (surge).
- **D-03:** Builder **writes markup; reuses the locked `styles.css`, never re-authors CSS.** Composes against a prebuilt, locked design system. Reference `index.html` is lean (268 lines) — the proven output to match.
- **D-04:** Builder is **pure**: copy + visual-system + assets → markup. No endpoints, secrets, integration knowledge in its prompt. Emits **tokens** (`{{…}}`) and stable asset filenames, never live URLs — testable with zero live accounts, reusable across brands.
- **D-05:** **Additive restraint rule** (BUILD-FEEDBACK §2): render only the brief's visible content; invent no customer-facing chrome (no captions, eyebrows, badge labels, helper microcopy). Non-visible strings (alt, aria, data-attrs, class/file names) unconstrained.
- **D-06:** **No Shopify/Klaviyo agent touches markup.** Each is a **provisioning brick** that outputs config *strings*. Everything in the HTML is either (a) config fed INTO the builder before it runs, or (b) a deterministic token-substitution script run AFTER. No second agent ever opens the HTML.
- **D-07:** **Provisioning posture = manual-paste config** (low fragility), matching `asset-upload.js`'s no-credentialed-automation scope. Operator creates the $5 product + Klaviyo list, pastes two strings into a config file; `hydrate` fills the tokens. Admin-API/Playwright automation deferred to M2.
- **D-08:** Image CDN swap **already solved** by `asset-upload.js` (Phase 16, brick 8): builder leaves stable `assets/img/<name>.jpg`; script backfills `cdn.shopify.com/...` from url-map.
- **D-09:** Produce **UI-SPEC + PAGE-SPEC** as committed contract artifacts. UI-SPEC at `.planning/phases/17/UI-SPEC.md` (exists). PAGE-SPEC = per-instance content manifest.
- **D-10:** **UI-SPEC supersedes STYLE-LOCK + BUILD-FEEDBACK §1** — once it exists it is the single design source; STYLE-LOCK + §1 become inputs-only, never re-read by the builder.
- **D-11:** **§1 page-craft rules port in verbatim as hard constraints** a ui-checker can enforce: per-page fold budget, context-aware accent (no black-on-black, ever), 17px body min, explicit element order per breakpoint, CTA = black-on-accent in a readable face (not Doto). (Already ported into UI-SPEC as HARD-1…HARD-7.)
- **D-12:** Deploy target = **surge.sh** (locked); deploy is a pipeline stage; the Arduview instance gets deployed live as the workflow's validation. Driver: `runs/arduview/_tooling/surge_drive.py`.
- **D-13:** Builder's input contract **requires optimized assets** (~1600px / q82); asset prep is upstream (asset-emit), not a builder/Arduview decision.

### Claude's Discretion
- Token naming/format, hydrate script shape, INTERFACES spec format, where provisioning config lives.
- Exact UI-SPEC/PAGE-SPEC schema fields (constrained by D-09/D-11 and the §1 rules).

### Deferred Ideas (OUT OF SCOPE)
- **`design-research` phase** (Phase 18) — competitor LP picking → DESIGN-DIRECTION. Not a blocker; Arduview's design direction already exists (Glasshouse). Feeds *future* instances' UI-SPECs.
- **Arduview content decisions** — founder copy, trust badges, proof clips, headline A/B, image-numbering. Instance inputs owned by copywriter/operator, NOT builder scope. (Hero A/B harness deferred.)
- **Credentialed Shopify Admin-API / Playwright provisioning automation** — rides M2; v1 uses manual-paste config (D-07).
- **Roadmap edit** — rename Phase 17 away from the Arduview-specific title; insert Phase 18.
- **BUILD-FEEDBACK §3 image-numbering convention — REJECTED as brittle. Do NOT encode.**
</user_constraints>

<phase_requirements>
## Phase Requirements (surfaced for the planner to assign REQ-IDs)

The phase has no pre-assigned REQ-IDs. Based on the locked spine (D-02) and the deliverable boundary, the phase MUST cover these capabilities — each is a natural REQ candidate:

| Candidate ID | Capability | Source | Verifiable by |
|----|----|----|----|
| LPB-01 | INTERFACES spec freezing every stage's I/O schema | D-01 | committed `INTERFACES.md`; each stage cites it |
| LPB-02 | PAGE-SPEC content-contract schema + Arduview instance | D-02/D-09 | committed `PAGE-SPEC.md` schema + `runs/arduview/.../PAGE-SPEC.md` |
| LPB-03 | HTML builder agent (the sole HTML writer; pure; tokenized out) | D-03/D-04/D-05 | builder skill exists; emits tokenized HTML matching reference |
| LPB-04 | `hydrate` deterministic token-substitution script | D-06/D-07 | `tools/lp-hydrate.js`; fills `{{…}}` from config; idempotent |
| LPB-05 | Provisioning config contract (manual-paste, Klaviyo + Shopify strings) | D-07 | committed config schema + Arduview instance file |
| LPB-06 | ui-checker enforcing HARD-1…HARD-7 deterministically | D-11 | checker script/skill; fails reference with an injected violation |
| LPB-07 | Deploy stage wired to `surge_drive.py` | D-12 | parameterized deploy driver; Arduview live |
| LPB-08 | End-to-end pipeline run producing the live Arduview LP + deposit page (validation instance) | whole-phase | live URL; tokens resolved; CDN images; no re-edits |

The reused-as-is bricks (`asset-upload.js`, `asset-emit.js`) are **not** new REQs — they are upstream/downstream dependencies already built (Phase 16). The planner should confirm whether LPB-08 is a separate plan/wave (UAT gate) or the closeout of LPB-07.
</phase_requirements>

## Summary

This is an **internal pipeline-architecture phase**, not a library-selection phase. The "standard stack" is the existing repo's own conventions — the brick model (`CLAUDE.md`: one job per agent, deterministic→script, judgment→agent), the Phase-16 manifest-contract precedent (16-05), the already-built `asset-upload.js`/`asset-emit.js`/`surge_drive.py`, and the already-approved UI-SPEC. The phase's entire job is to **freeze the seams** between stages so build order can't force a re-edit, then build the one judgment agent (the HTML builder) plus three deterministic scripts (hydrate, the reused asset-upload, deploy) plus one checker.

The load-bearing architectural insight is already locked in CONTEXT: **the builder is the only thing that writes HTML, and it writes tokens not values.** This collapses every integration concern (Klaviyo form action, Shopify checkout URL, CDN image URLs) into a single deterministic post-build substitution pass. CDN URLs *only exist after upload*, so a post-build pass was mandatory regardless — folding Klaviyo + Shopify into the same pass is free. The builder stays pure and testable with zero live accounts because it never sees a live URL.

The single biggest planning risk is **scope creep into Arduview semantics**. The builder must contain zero Arduview/crowdfunding/deposit knowledge — all of that lives in PAGE-SPEC (content) and UI-SPEC (visual) as instance inputs. The reference `index.html`/`deposit.html` are the *proven output to match for the Arduview instance*, not the builder's spec. A second risk is **re-authoring CSS**: `styles.css` (378 lines) is locked; the builder needs class *names* only (the UI-SPEC Component Inventory supplies them), never the CSS body.

**Primary recommendation:** Build the INTERFACES spec FIRST (it is the contract every other stage codes against), derive PAGE-SPEC from it, then build the builder agent + hydrate script + checker against frozen schemas in parallel, then wire deploy. Mirror the Phase-16 16-05 manifest-contract pattern exactly — it is the proven precedent for D-01.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Freeze stage I/O schemas (INTERFACES) | Contract artifact (.md) | — | A document, not code; the law every stage reads |
| Author visual contract (UI-SPEC) | Contract artifact (.md) | — | Done (approved). Per-instance visual decision surface |
| Author content contract (PAGE-SPEC) | Contract artifact (.md) | plan-time extraction | Per-instance copy + asset map + section map; extracted from COPY-DRAFT |
| Compose tokenized HTML | **Judgment agent** (builder skill) | — | The one judgment job: layout/markup decisions against locked CSS + restraint rule |
| Fill `{{…}}` integration tokens | **Deterministic script** (hydrate) | — | Pure string substitution from config; never an agent (D-06) |
| Backfill CDN image URLs | **Deterministic script** (asset-upload.js, exists) | — | Already built (Phase 16 brick 8); filename→CDN from url-map |
| Provision Klaviyo/Shopify strings | **Human + manual-paste config** | future Admin-API (M2) | D-07 posture; no credentialed automation in v1 |
| Enforce HARD-1…HARD-7 | **Deterministic checker** (script or checker-agent) | — | D-11 — machine-checkable rules; gate before deploy |
| Deploy to live URL | **Deterministic script** (surge_drive.py, exists) | — | PTY-driven; already built |

**Reading:** exactly ONE judgment agent (the builder). Everything else is a script, a contract doc, or a human gate. This is a direct application of the PMF agent-design law and must be preserved — "an agent that hydrates/deploys/provisions" is a category error.

## Standard Stack

This phase introduces **no new third-party dependencies.** The "stack" is the repo's own toolchain, all verified present.

### Core (in-repo, verified)
| Component | Location | Purpose | Status |
|---|---|---|---|
| Node.js | v20.20.0 `[VERIFIED: node --version]` | Runtime for all deterministic scripts | present |
| `tools/asset-upload.js` | repo | Brick 8 — filename→CDN backfill from `url-map.json` (D-08) | **built, reuse as-is** |
| `tools/asset-emit.js` | repo | Brick 7 — emits the queryable asset manifest the builder/PAGE-SPEC consume | **built** |
| `runs/arduview/_tooling/surge_drive.py` | repo | PTY-driven surge deploy (D-12) | **built; needs parameterization** |
| `runs/arduview/site/styles.css` | repo (378 lines) | Locked Glasshouse design system — **LINKED, never re-authored** (D-03) | **locked** |
| `runs/arduview/site/script.js` | repo | Front-end stubs (scroll reveal + email capture + checkout stub) | **present; see Pitfall 5** |
| UI-SPEC | `.planning/phases/17/17-UI-SPEC.md` | Approved visual contract (HARD-1…HARD-7, Component Inventory, Tokenization table) | **approved** |

### Supporting (to build this phase)
| Artifact | Type | Purpose |
|---|---|---|
| `INTERFACES.md` | contract doc | Freeze every stage's I/O schema (D-01) — the first deliverable |
| `PAGE-SPEC.md` (schema + Arduview instance) | contract doc | Per-instance content contract (D-09) |
| LP-builder skill (`.claude/skills/lp-builder/SKILL.md`) | judgment agent | The sole HTML writer (D-03/D-04/D-05) |
| `tools/lp-hydrate.js` | deterministic script | Fill `{{KLAVIYO_FORM_ACTION}}` / `{{SHOPIFY_CHECKOUT}}` from config (D-06) |
| provisioning config (e.g. `runs/<space>/site/integration.json`) | committed config | Manual-paste Klaviyo + Shopify strings (D-07) |
| ui-checker (`.claude/skills/lp-ui-checker/` or `tools/lp-ui-check.js`) | checker | Enforce HARD-1…HARD-7 (D-11) |
| deploy wrapper | script | Parameterize `surge_drive.py` for `--site` / `--domain` (D-12) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|---|---|---|
| Token substitution in a JS script | A templating engine (Handlebars/EJS) | Rejected — adds a dependency for what is a 2-token find-replace; `asset-upload.js` already does string backfill with zero deps. Match that pattern. `[ASSUMED]` no templating engine is warranted |
| Builder emits raw HTML files | Builder emits a JSON "section plan" hydrated by a renderer | Rejected by D-03 intent — the reference output IS hand-authored lean HTML; a renderer would re-introduce CSS/markup authoring outside the builder. Builder writes HTML directly |
| New checker agent | Reuse `gsd-ui-checker` (referenced in UI-SPEC header) | The UI-SPEC says "verified by gsd-ui-checker" — confirm whether that GSD checker exists and can enforce HARD-1…7, OR build a phase-local deterministic checker. See Open Questions. |

**Installation:** None. No `npm install`. All Python bricks (none new here) use `.venv/bin/python` per the Phase-16 PEP-668 convention `[VERIFIED: STATE.md Phase 16 decision]` — but this phase's new scripts are Node, no venv needed.

## Architecture Patterns

### System Architecture Diagram

```
                 ┌─────────────────── CONTRACT LAYER (frozen, D-01) ───────────────────┐
                 │                                                                       │
   [INTERFACES.md] ── defines I/O schema for every stage below ──────────────────┐      │
                 │                                                                 │      │
   [UI-SPEC.md] (visual contract, approved)        [PAGE-SPEC.md] (content)       │      │
        │ class names, HARD-1..7, token table          │ copy + asset map + section map │
        └──────────────┬───────────────────────────────┘                         │      │
                        ▼                                                          │      │
   ┌──────────── PURE BUILDER (the ONE agent) ───────────────┐                    │      │
   │  inputs:  UI-SPEC + PAGE-SPEC                            │  ← codes against ──┘      │
   │  links:   styles.css (names only, never authored)       │     the schema, not       │
   │  output:  index.html + deposit.html with                │     neighbor's guts        │
   │           {{TOKENS}} + stable assets/img/<name>.jpg      │                            │
   └───────────────────────┬─────────────────────────────────┘                            │
                            │ tokenized HTML (no live URLs — testable w/ zero accounts)    │
                            ▼                                                               │
   ┌──────── ui-checker (gate, D-11) ────────┐                                             │
   │  HARD-1..7 deterministic checks         │ ── FAIL → back to builder (only re-writer) │
   └───────────────────┬─────────────────────┘                                             │
                        │ PASS                                                              │
                        ▼                                                                   │
   ════════ DETERMINISTIC POST-BUILD SUBSTITUTION PASS (no agent ever re-opens HTML) ════  │
                        │                                                                   │
   [integration.json] ─▶ lp-hydrate.js  ── {{KLAVIYO_FORM_ACTION}}, {{SHOPIFY_CHECKOUT}} ──┘
   (manual-paste, D-07)         │
                                ▼
   [url-map.json] ─────▶ asset-upload.js (EXISTS) ── assets/img/<name>.jpg → cdn.shopify.com/...
   (after upload)               │
                                ▼
                        surge deploy (surge_drive.py, PTY) ──▶  LIVE URL  (validation)
```

Data-flow trace (primary use case): copy brief + visual system enter as two contract docs → builder composes one tokenized HTML pair → checker gates → hydrate fills integration tokens → asset-upload fills CDN URLs → deploy ships live. The arrows never loop back except on a checker FAIL, and only to the builder (the sole writer).

### Recommended Project Structure
```
.planning/phases/17-.../
├── 17-INTERFACES.md        # NEW — frozen stage I/O contract (D-01, first deliverable)
├── 17-UI-SPEC.md           # EXISTS — visual contract (approved)
└── 17-RESEARCH.md          # this file

.claude/skills/
├── lp-builder/SKILL.md     # NEW — the one judgment agent (composes HTML)
└── lp-ui-checker/SKILL.md  # NEW (or tools/lp-ui-check.js) — HARD-1..7 gate

tools/
├── lp-hydrate.js           # NEW — {{TOKEN}} substitution from integration.json
├── lp-deploy.js            # NEW (thin) — parameterized surge wrapper, or call surge_drive.py
├── asset-upload.js         # EXISTS — CDN backfill (reuse)
└── asset-emit.js           # EXISTS — asset manifest (upstream)

runs/<space>/site/          # per-instance build output (arduview = first)
├── PAGE-SPEC.md            # NEW — per-instance content contract
├── integration.json        # NEW — manual-paste Klaviyo + Shopify strings (D-07)
├── index.html              # builder output (tokenized → hydrated → CDN'd)
├── deposit.html
├── styles.css              # LINKED copy of the locked system (never re-authored)
├── script.js               # front-end stubs
└── assets/{img,video}/
```

### Pattern 1: Manifest contract (D-01) — mirror 16-05 exactly
**What:** Each stage reads/writes a documented schema; downstream stages code against the schema, not the producer's internals.
**When to use:** Every seam in this pipeline.
**Precedent (verified in-repo):** Phase 16 plan 16-05 froze the `images.json`/`videos.json` shape: `{ records: [...], _provenance, gap_list: [...] }`, one wrapper object, `JSON.stringify(obj, null, 2)`, underscore-meta keys (`_provenance`). The builder queries `records[]` by field (claim+strength+disqualifiers) — never re-runs the producer. `[VERIFIED: .planning/phases/16-.../16-05-PLAN.md]`
**INTERFACES spec shape (recommended):** one table per stage —

```markdown
### Stage: HTML BUILDER
**Reads:** UI-SPEC.md (Component Inventory class names, HARD-1..7, token table) · PAGE-SPEC.md (copy + asset map + section map)
**Writes:** {space}/site/index.html, deposit.html — tokenized HTML
**Output invariants:**
  - every {{TOKEN}} ∈ the UI-SPEC token table (no invented tokens)
  - every <img src> = assets/img/<name>.jpg matching PAGE-SPEC asset map (no live URLs)
  - links <link rel=stylesheet href=styles.css> (never inlines/authors CSS)
  - every visible string ∈ PAGE-SPEC copy (HARD-7 restraint)
**MUST NOT:** author CSS · invent chrome · emit live URLs · embed Arduview/crowdfunding semantics
```

Each downstream stage's "Reads" must match the upstream "Writes" by schema name only.

### Pattern 2: Single post-build substitution pass (D-06)
**What:** All `{{…}}` tokens + CDN filenames are filled by deterministic scripts AFTER the builder, in a fixed order: `hydrate` → `asset-upload` → deploy. No agent re-opens the HTML.
**Why it composes:** CDN URLs only exist after upload, so a post-build pass was already mandatory. Klaviyo/Shopify strings fold into the same pass for free. `asset-upload.js` already does exactly this kind of string backfill (find the filename, replace with the URL) — `lp-hydrate.js` should mirror its structure (load config → walk records/HTML → string-replace → write + sidecar log → one-line summary + partial-success exit).

### Pattern 3: Builder reads class names, not CSS (D-03)
**What:** The builder's only knowledge of the design system is the UI-SPEC **Component Inventory** (locked class names: `.hero`, `.split`, `.feature__k`, `.offer__cta`, etc.) + the HARD constraints. It links `styles.css` and never reads its body.
**Verified:** The reference `index.html` uses exactly these classes; UI-SPEC's Component Inventory table enumerates them. The builder's read budget per BUILD-FEEDBACK §0: UI-SPEC + PAGE-SPEC (each once) + ~20 lines of the block being edited. Nothing else.

### Anti-Patterns to Avoid
- **Arduview semantics in the builder prompt** — "deposit page", "crowdfunding", "founder" must NOT appear as builder logic. They are PAGE-SPEC content. The builder lays out whatever sections the section-map gives it.
- **Re-authoring `styles.css`** — the builder needs names, not CSS. Re-authoring is the bloat the whole locked-system move prevents.
- **A second agent touching HTML** — Klaviyo/Shopify are provisioning bricks emitting *strings* (D-06). No "Shopify agent" opens `deposit.html`.
- **Inventing tokens** — the token vocabulary is fixed by the UI-SPEC token table (`{{KLAVIYO_FORM_ACTION}}`, `{{SHOPIFY_CHECKOUT}}`). The builder emits only these.
- **Re-deriving the visual contract** — UI-SPEC supersedes STYLE-LOCK + BUILD-FEEDBACK §1 (D-10). Don't re-read those once UI-SPEC exists.
- **Encoding image-numbering** — BUILD-FEEDBACK §3 is REJECTED. Do not add image-N labels/position semantics.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Image filename → CDN URL swap | a new CDN-backfill script | `tools/asset-upload.js` (D-08) | Already built, handles hashed video URLs + constructable image URLs + MD/JSON backfill |
| Asset manifest the builder queries | a new asset reader | `tools/asset-emit.js` output (`images.json`/`videos.json`) | Phase 16 already emits the queryable, claim-tagged manifest |
| Static deploy to a live URL | a deploy-from-scratch | `runs/arduview/_tooling/surge_drive.py` (D-12) | PTY credential-feed already solved (piping stdin fails surge's prompt) — see memory `reference_surge_static_deploy` |
| The visual/page-craft rules | re-deriving fold budget / contrast / order | UI-SPEC HARD-1…HARD-7 | Already ported verbatim from BUILD-FEEDBACK §1; supersedes STYLE-LOCK |
| Front-end JS (reveal, email capture, checkout stub) | new client JS | reference `script.js` | Already wired for 3 CTA forms + `[data-checkout]`; see Pitfall 5 for the one change needed |
| Inter-stage contract format | inventing a schema doc style | the 16-05 manifest-contract shape | Proven precedent for D-01 |

**Key insight:** This phase is ~80% wiring already-built bricks behind frozen contracts and ~20% net-new (INTERFACES, PAGE-SPEC, builder agent, hydrate, checker). The temptation to rebuild `asset-upload`/`surge_drive`/the design system is the main waste risk — they exist and work.

## Runtime State Inventory

> This is a build phase (new pipeline + first instance), not a rename/refactor. Most categories are N/A, but the **integration provisioning** surface has real runtime state worth flagging.

| Category | Items Found | Action Required |
|---|---|---|
| Stored data | None — static marketing pages, no datastore. The reference `script.js` writes leads to `localStorage` (demo stub only). | None |
| Live service config | **Klaviyo list + form action** and **Shopify $5-product checkout URL** live in external dashboards, NOT in git. These are the two manual-paste strings (D-07). Also the **surge.sh host account** (creds in `surge_drive.py` — throwaway account `kameronyu0612@gmail.com` / pw in plaintext). | Operator provisions Klaviyo list + Shopify product, pastes 2 strings into `integration.json`. Surge account exists. |
| OS-registered state | None | None |
| Secrets/env vars | `surge_drive.py` has a **plaintext throwaway password** (`Arduview2026demo!`) and email hardcoded. Klaviyo/Shopify strings are public-ish (a form action + a hosted checkout URL — not secrets, by design D-04/D-07). | Flag: deploy script secrets are hardcoded. Acceptable for a throwaway host account; note for the planner not to commit real credentials. `integration.json` holds non-secret public endpoint strings. |
| Build artifacts | Per-instance `runs/<space>/site/` is the build output (HTML + a copy of `styles.css` + assets). The CDN url-map.json is produced after manual Shopify Files upload. | None stale; these are produced fresh per run. |

**Net:** the only "live state" is the two provisioning strings (Klaviyo, Shopify) + the surge host account — all manual-paste per D-07, exactly matching `asset-upload.js`'s no-credentialed-automation scope.

## Common Pitfalls

### Pitfall 1: Black-on-black accent (HARD-1 — recurred TWICE in the manual build)
**What goes wrong:** The `.hl` highlight class defaults to dark ink; on a dark surface (`.hero`, `.section--dark`, `.deposit-hero`) the highlighted text renders invisible (black-on-black). Hit on the hero "see right through" highlight AND the deposit "$5 deposit" highlight.
**Why it happens:** The class was patched for *some* dark containers, not all; the cascade leaves the highlight same-value in an unpatched container.
**How to avoid:** UI-SPEC HARD-1: any highlight inside a dark surface MUST resolve to cyan glow (`color: var(--glow)`), never inherit `--ink`. The locked CSS already encodes both branches — the builder must not *place* a highlight where the cascade collapses it. **The ui-checker MUST test: for every highlighted run, computed text color ≠ computed background color.**
**Warning signs:** any `.hl` placed in a `--black`/`--black-2` container without confirming the cascade branch.

### Pitfall 2: CTA in the display font (HARD-2)
**What goes wrong:** CTA button text rendered in Doto (dot-matrix display font) — unreadable at button size.
**How to avoid:** CTA = black (`#000`) on cyan fill, IBM Plex Mono weight 500. NEVER Doto. Checker test: every primary CTA has accent bg, black text, non-Doto font-family.

### Pitfall 3: Builder over-builds / adds chrome (HARD-7 / D-05)
**What goes wrong:** Builder invents captions, eyebrows, badge labels, helper microcopy ("complete-looking page" pattern). The manual build had builder-invented figcaptions that had to be removed.
**How to avoid:** Additive restraint — every *visible* word from PAGE-SPEC; non-visible strings (alt/aria/data/class/file) unconstrained. The locked CSS already hides `.frame__tag` via `display:none`. Checker test: no figcaptions rendered; no visible string absent from PAGE-SPEC.

### Pitfall 4: Scope leak — Arduview semantics in the engine
**What goes wrong:** The builder learns "deposit page", "$5", "crowdfunding" as logic, breaking reusability.
**How to avoid:** Builder is product-agnostic; all instance content is PAGE-SPEC. Validate by asking "would this builder prompt work for a SaaS LP with different sections?" If a line says "deposit" or "founder", it's a bug.

### Pitfall 5: The reference `script.js` is a DEMO stub, not production wiring
**What goes wrong:** `script.js` currently (a) routes EVERY email form to `deposit.html` (`window.location.href = "deposit.html"`) as a demo click-through, and (b) the checkout stub only prints to console + changes button text — it never navigates to Shopify. The CTA `<a data-checkout href="#">` has a placeholder `#`.
**Why it matters:** The token plan must account for this. `{{SHOPIFY_CHECKOUT}}` replaces the `data-checkout` href `#` (UI-SPEC token table confirms this). But the *email* capture is a localStorage stub — real Klaviyo submission means the form `action` attribute (or a fetch) needs `{{KLAVIYO_FORM_ACTION}}`. The reference forms have NO `action` attribute today; the builder must emit `<form action="{{KLAVIYO_FORM_ACTION}}" ...>` and the demo `script.js` redirect behavior must be reconciled with real submission.
**How to avoid:** INTERFACES spec must state exactly where each token lands (form `action` vs `data-checkout` href) AND whether `script.js` is hydrated/edited or left as-is. Decide: does the builder emit a Klaviyo-native `<form action>` (Klaviyo hosted form post) or does `script.js` do a fetch to the form action? See Open Question 3.

### Pitfall 6: Fold budget left to the builder (HARD-4 — most-iterated thing, 3 passes)
**What goes wrong:** Builder guesses what's above the fold; subheader creeps above, video shrinks below half the hero.
**How to avoid:** HARD-4 states it explicitly per page. LP hero above fold = title + CTA + video (video ≥50% of hero); subheader below. Deposit above fold = image + title + CTA + 51% value. Checker test: above-the-fold DOM contains exactly the budgeted elements.

## Code Examples

### Token substitution (hydrate) — mirror asset-upload.js structure
```javascript
// Source: pattern verified from tools/asset-upload.js (in-repo, lines 153-168, 340-355)
// lp-hydrate.js — fill {{TOKEN}} from integration.json (deterministic, no agent)
'use strict';
const fs = require('fs'), path = require('path');
// args: --site=<dir> --config=<integration.json>
const cfg = JSON.parse(fs.readFileSync(configPath, 'utf8'));
// cfg = { KLAVIYO_FORM_ACTION: "https://manage.kmail-lists.com/...", SHOPIFY_CHECKOUT: "https://<store>.myshopify.com/cart/<variant>:1" }
const TOKENS = ['KLAVIYO_FORM_ACTION', 'SHOPIFY_CHECKOUT'];   // closed vocab — from UI-SPEC token table
for (const file of ['index.html', 'deposit.html']) {
  let html = fs.readFileSync(path.join(site, file), 'utf8');
  for (const t of TOKENS) {
    if (cfg[t] == null) { /* warn + leave token (partial-success), do not fabricate */ continue; }
    html = html.split(`{{${t}}}`).join(cfg[t]);
  }
  // optional: assert no stray {{...}} remain → stderr warning + exit 1 only if zero filled (S4 pattern)
  fs.writeFileSync(path.join(site, file), html);
}
// + sidecar _hydrate-log.txt, one-line summary, partial-success exit (asset-upload.js:340-355 pattern)
```

### Deploy (parameterize surge_drive.py)
```python
# Source: runs/arduview/_tooling/surge_drive.py (in-repo) — PTY-driven, feeds creds on 'email:' prompt
# Recommended change: take SITE + DOMAIN from argv/env instead of hardcoding, so it's instance-agnostic.
# Everything else (pty.fork, select loop, 220s timeout, feed EMAIL+PW on prompt) is proven — keep verbatim.
SITE   = sys.argv[1] if len(sys.argv) > 1 else os.environ.get('LP_SITE', '/home/kyu3/PMF/runs/arduview/site')
DOMAIN = sys.argv[2] if len(sys.argv) > 2 else os.environ.get('LP_DOMAIN', 'arduview-see-through.surge.sh')
```

### PAGE-SPEC schema (recommended shape — content contract, D-09)
```markdown
# PAGE-SPEC — <space> (content contract; builder reads THIS, never COPY-DRAFT)
## Pages
- index.html  (LP — email capture)
- deposit.html (offer/checkout)

## Section map (ordered; section → locked UI-SPEC component)
| order | section_id | component (UI-SPEC class) | surface | assets (filename) |
|-------|-----------|---------------------------|---------|-------------------|
| 1 | hero | .hero / .hero__video | dark | assets/video/hero.mp4, assets/img/hero-poster.jpg |
| 2 | why-clear | .split (.section--dark) | dark | assets/img/transparency.jpg, maker.jpg |
| ... | ... | ... | ... | ... |

## Copy (every visible string the builder may render — HARD-7 closed set)
| slot_id | section | text |
|---------|---------|------|
| hero.headline | hero | The pocket game console you can {{hl:see right through}}. |
| hero.cta | hero | get early access → |
| ... | ... | ... |

## Asset map (filename → alt text; alt is NON-visible, unconstrained)
| filename | alt |
|----------|-----|
| transparency.jpg | Arduview front-on, clear shell showing the board... |

## Tokens used (must ⊆ UI-SPEC token table)
- {{KLAVIYO_FORM_ACTION}} (email forms)
- {{SHOPIFY_CHECKOUT}} (deposit data-checkout)
```
The `{{hl:...}}` convention is one option for marking the single per-section highlight (HARD-1); the planner should decide whether highlights are marked in PAGE-SPEC copy or chosen by the builder (recommend PAGE-SPEC marks them, so the builder never *chooses* emphasis — restraint).

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| STYLE-LOCK + BUILD-FEEDBACK §1 as two builder reads | Single UI-SPEC (supersedes both) | This phase (D-10) | Builder reads ONE design doc; §1 rules now machine-checkable HARD-1…7 |
| Builder reads COPY-DRAFT + full HTML | Builder reads PAGE-SPEC + the one block being edited | This phase (D-09, BUILD-FEEDBACK §0) | Read budget collapses; COPY-DRAFT never opened by builder |
| Integration baked inline (live URLs in HTML) | Tokens + single post-build substitution pass | This phase (D-04/D-06) | Builder testable with zero live accounts; reusable across brands |
| Manual reference build (this session) | Reproducible product-agnostic pipeline | This phase | Arduview becomes the validation instance, not the spec |

**Deprecated/outdated:**
- BUILD-FEEDBACK §3 image-numbering — REJECTED as brittle; do not encode.
- Reading the brand-refs (1,380 lines) — fully distilled into STYLE-LOCK→UI-SPEC; never re-read.
- Shopify Liquid/template detail (SHOPIFY-HANDOFF) — unused; deploy target is surge, not Shopify-hosted.

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | No templating engine needed; `lp-hydrate.js` is a plain string-replace mirroring `asset-upload.js` | Standard Stack / Alternatives | Low — if tokens grow complex, revisit; current vocab is 2 tokens |
| A2 | The builder should be a `.claude/skills/lp-builder/SKILL.md` orchestrated like `asset-classify` | Project Structure | Low — matches repo skill convention; planner may choose a prompt file instead |
| A3 | Klaviyo integration = a `<form action="{{KLAVIYO_FORM_ACTION}}">` post (Klaviyo hosted-form pattern) | Pitfall 5 / Open Q3 | **Medium** — Klaviyo has multiple embed modes (hosted form action vs JS onsite form vs API). The exact mechanism affects what token lands where and whether `script.js` changes. Needs operator confirmation. |
| A4 | `{{SHOPIFY_CHECKOUT}}` is a permalink cart URL (`/cart/<variant>:1`) for the $5 product | Code Examples / Open Q3 | **Medium** — could instead be a Shopify-hosted checkout or a Buy Button. Affects the deposit `data-checkout` href value. Needs operator confirmation. |
| A5 | The deploy script's hardcoded surge creds are an acceptable throwaway-account posture | Runtime State | Low — already in-repo and working; flagged for planner not to expand |
| A6 | UI-SPEC's referenced "gsd-ui-checker" may not enforce HARD-1…7 out of the box; a phase-local checker is likely needed | Alternatives / Open Q2 | Medium — affects whether LPB-06 builds a new checker or configures an existing one |

## Open Questions

1. **INTERFACES spec location & granularity.**
   - What we know: D-01 makes it the first deliverable; the 16-05 manifest-contract shape is the precedent.
   - What's unclear: Does it live at `.planning/phases/17/17-INTERFACES.md` (planning artifact) or as a reusable `prompts/_specs/lp-builder-interfaces.md` (since the pipeline is meant to be reusable beyond Arduview)? Given D-09 puts UI-SPEC in `.planning/phases/17/`, recommend INTERFACES alongside it, with a note that it graduates to `prompts/_specs/` when M2 generalizes the pipeline.
   - Recommendation: `.planning/phases/17/17-INTERFACES.md`; one stage-block per stage (Reads/Writes/Invariants/MUST-NOT).

2. **ui-checker: reuse gsd-ui-checker or build phase-local?**
   - What we know: UI-SPEC header says "verified by gsd-ui-checker"; HARD-1…7 are written AS machine-checkable.
   - What's unclear: whether the GSD checker can enforce *these specific* rules (computed-color contrast on highlights, fold-budget DOM membership, non-Doto CTA font). HARD-1/HARD-4/HARD-5 need DOM+computed-style inspection (a headless render), which is heavier than a regex check.
   - Recommendation: build a phase-local deterministic checker. For HARD-1/2/3/7 (color, font-family, body size, no-figcaption) a static parse of the emitted HTML + the known locked CSS rules suffices. For HARD-4/5 (fold budget, breakpoint order) — confirm whether a static DOM-order check is enough or a headless browser (Playwright at `/home/kyu3/node_modules/playwright` per BUILD-FEEDBACK §5) is needed. **Flag for planning: HARD-4 "video ≥50% of hero area" is the only check that may truly need a render; the rest are static.**

3. **Klaviyo + Shopify integration mechanism (A3/A4).**
   - What we know: manual-paste config (D-07); tokens `{{KLAVIYO_FORM_ACTION}}` (forms) + `{{SHOPIFY_CHECKOUT}}` (deposit data-checkout).
   - What's unclear: the exact Klaviyo embed mode (hosted form `action` POST vs onsite JS form vs list-subscribe API) and the exact Shopify checkout URL type (cart permalink vs hosted checkout vs Buy Button). This determines (a) what string the operator pastes, (b) whether `script.js` changes, (c) whether the builder emits a `<form action>` or the JS does a fetch.
   - Recommendation: the operator (Kam) decides at provisioning time; the INTERFACES spec should define `integration.json` as `{ KLAVIYO_FORM_ACTION: string, SHOPIFY_CHECKOUT: string }` and the builder emits the token in the form `action` + the `data-checkout` href. Confirm Klaviyo mode with Kam in discuss/planning. **This is the one external-knowledge gap — pull from `~/knowledge/dr-marketing/` only if it covers Klaviyo embed mechanics; otherwise it's an operator decision.**

4. **`script.js` per-instance: edited, hydrated, or static-shared?**
   - What we know: reference `script.js` is a demo stub (Pitfall 5) — routes all CTAs to `deposit.html`, checkout only logs.
   - What's unclear: whether real submission needs `script.js` changes (fetch to Klaviyo) or whether a `<form action>` post + a real `data-checkout` href makes `script.js` reveal/UX-only. If `script.js` needs the token, it joins the hydrate pass.
   - Recommendation: aim to keep `script.js` token-free (forms POST natively to `{{KLAVIYO_FORM_ACTION}}`, deposit link navigates to `{{SHOPIFY_CHECKOUT}}`), so hydrate only touches the two HTML files. Confirm with Q3's answer.

5. **PAGE-SPEC: who authors it, and does it mark highlights?**
   - What we know: D-09 says PAGE-SPEC is the per-instance content manifest extracted from COPY-DRAFT at plan time (BUILD-FEEDBACK §0).
   - Recommendation: plan-time extraction (a planning task, not a builder task). Recommend PAGE-SPEC marks the single per-section `.hl` highlight explicitly (e.g. `{{hl:...}}` inline) so the builder never *chooses* emphasis — keeps restraint (HARD-7) and feeds HARD-1's checker.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---|---|---|
| Node.js | hydrate, asset-upload, deploy wrapper | ✓ | v20.20.0 | — |
| Python 3 | surge_drive.py | ✓ (system; bricks use `.venv`) | 3.x | — |
| surge (via npx) | deploy | ✓ (npx --yes surge) | latest | — |
| surge.sh host account | deploy | ✓ | throwaway (`kameronyu0612@gmail.com`) | — |
| Playwright | possible HARD-4/5 render check | ✓ | at `/home/kyu3/node_modules/playwright` (NOT project) — `require()` absolute path | static DOM-order check (no render) for HARD-5; HARD-4 area-check may need it |
| Klaviyo account/list | provisioning (`{{KLAVIYO_FORM_ACTION}}`) | ✗ (operator provisions) | — | tokens stay unfilled; builder still testable (D-04) |
| Shopify $5 product | provisioning (`{{SHOPIFY_CHECKOUT}}`) | ✗ (operator provisions) | — | tokens stay unfilled; deposit checkout inert until pasted |
| ffmpeg | NOT needed this phase (video already cut) | ✗ | — | hero video is pre-cut (`hero.mp4`); no encoding in-phase |

**Missing dependencies with no fallback:** none block the *build*. Klaviyo/Shopify provisioning are manual-paste (D-07) and intentionally decoupled — the pipeline builds and the Arduview HTML deploys with unfilled tokens; the operator pastes strings to go fully live. This decoupling is the point of D-04.

**Missing dependencies with fallback:** Playwright (only if HARD-4 area-check is implemented as a render; static checks cover HARD-1/2/3/5/7).

## Validation Architecture

> `workflow.nyquist_validation` not explicitly false in config; STATE.md records the project verifies via **UAT, not unit tests** ("run on a reference space and Kam reads the output"). The validation here is the live-deploy gate, not a test suite — but the deterministic scripts and checker DO warrant per-script smoke checks in the 16-05 verify style.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | none (no jest/pytest in project) — verification is inline `node -e` smoke checks + UAT |
| Config file | none |
| Quick run command | per-script `node tools/<script>.js ... && node -e "assert..."` (16-05 pattern) |
| Full suite command | end-to-end: builder → checker → hydrate → asset-upload → deploy → live URL loads |

### Phase Requirements → Test Map
| Req | Behavior | Test Type | Command | Exists? |
|-----|----------|-----------|---------|---------|
| LPB-04 | hydrate fills tokens, leaves none stray | smoke | `node tools/lp-hydrate.js --site=/tmp/s --config=... && grep -L '{{' /tmp/s/*.html` | ❌ Wave 0 |
| LPB-06 | checker fails reference with an injected black-on-black `.hl` | smoke | `node tools/lp-ui-check.js --site=... ; expect exit 1` | ❌ Wave 0 |
| LPB-03 | builder emits only UI-SPEC tokens + PAGE-SPEC copy | UAT + static | diff builder output vs reference `index.html`; assert no live URLs | manual |
| LPB-07 | deploy ships to live URL | UAT | run deploy wrapper; `curl -sI <url>` 200 | partial (surge_drive exists) |
| LPB-08 | end-to-end: live Arduview LP + deposit, tokens resolved, CDN images | UAT (Kam reads) | full pipeline run | ❌ |

### Sampling Rate
- **Per task commit:** the script's own `node -e` smoke check (16-05 style).
- **Per wave merge:** the checker run against the current builder output.
- **Phase gate:** full pipeline → live URL loads, tokens resolved, Kam confirms parity with reference.

### Wave 0 Gaps
- [ ] `lp-hydrate.js` smoke check (tokens fill / none stray)
- [ ] `lp-ui-check.js` against reference + an injected violation (must fail)
- [ ] No framework install — inline `node -e` asserts suffice (matches 16-05)

## Security Domain

> `security_enforcement` not set false; this phase ships a public marketing site + handles operator-pasted config + a deploy path. Threat surface is small but real (path handling, URL injection into HTML, plaintext deploy creds).

### Applicable ASVS Categories
| ASVS Category | Applies | Standard Control |
|---|---|---|
| V2 Authentication | no | static site; surge host auth is a throwaway account |
| V3 Session Management | no | no sessions |
| V4 Access Control | no | public pages |
| V5 Input Validation | yes | sanitize `--space`/`--site` path segments (S2 sanitizer, verbatim from asset-upload.js); treat `integration.json` URLs as data, not code |
| V6 Cryptography | no | no crypto; payment handled by hosted Shopify checkout (card never touches the page — per deposit copy) |

### Known Threat Patterns
| Pattern | STRIDE | Standard Mitigation |
|---|---|---|
| Path traversal via `--space`/`--site` into write paths | Tampering | `sanitizePathSegment()` (S2 idiom, verified in asset-upload.js:99-104) on every path segment; reject empty-after-sanitize |
| Malicious/incorrect URL pasted into `integration.json` → injected into HTML | Tampering/Spoofing | `integration.json` is trusted operator input (same posture as url-map.json, 16-05 T-16-05-03 "accept"); the live-deploy + Kam review is the backstop. Optionally validate the pasted strings are well-formed https URLs before substitution. |
| Plaintext surge creds in `surge_drive.py` | Information disclosure | Throwaway host account (documented); flag for planner to NOT commit real creds and to keep the account disposable. Acceptable for v1. |
| Token left unfilled (`{{…}}`) shipped to production | Information disclosure / broken UX | hydrate emits a warning on a null config value and (recommended) the pre-deploy check greps for stray `{{` — never fabricate a URL (mirror T-16-05-02: never fabricate a hashed video URL). |
| XSS via builder-emitted copy | Tampering | copy is operator-authored static text (PAGE-SPEC), not user input; no dynamic rendering. Low risk; keep copy as static HTML text. |

## Sources

### Primary (HIGH confidence — in-repo, verified this session)
- `runs/arduview/site/index.html` (268 ln), `deposit.html` (97 ln), `script.js`, `styles.css` (378 ln) — the proven reference output + locked design system.
- `tools/asset-upload.js` — brick 8 CDN backfill; the string-substitution + S2-sanitizer + S4-exit pattern to mirror.
- `.planning/phases/16-.../16-05-PLAN.md` — the manifest-contract precedent for D-01 (JSON store shape, interfaces block, threat model).
- `.claude/skills/asset-classify/SKILL.md` — the orchestrator-skill + per-asset fan-out convention; the builder-skill model.
- `runs/arduview/_tooling/surge_drive.py` — PTY deploy driver (D-12).
- `runs/arduview/BUILD-FEEDBACK.md` §0/§1/§2 — read-set allowlist, the visual deltas (now HARD-1…7), the restraint rule.
- `.planning/phases/17/17-UI-SPEC.md` — approved visual contract (HARD-1…7, Component Inventory, token table).
- `.planning/phases/17/17-CONTEXT.md` — D-01…D-13 (the spec).
- `CLAUDE.md` (PMF) — agent-design law (one job per agent; scripts vs agents).
- `node --version` → v20.20.0 `[VERIFIED]`; `.claude/skills/` listing `[VERIFIED]`.

### Secondary (MEDIUM — operator-decision gaps)
- Klaviyo embed mechanism + Shopify checkout-URL type — not resolvable from repo; operator decision (Open Q3). `~/knowledge/dr-marketing/` may inform if it covers Klaviyo/Shopify embed mechanics.

### Tertiary (LOW)
- None — this phase is grounded entirely in verified in-repo artifacts; no training-data-only claims load-bearing.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — all in-repo, verified present; no new deps.
- Architecture: HIGH — directly specified in CONTEXT (D-01…13) + proven by the 16-05 precedent + the live reference build.
- Pitfalls: HIGH — drawn from the actual manual-build post-mortem (BUILD-FEEDBACK), not hypothesized.
- Integration mechanism (Klaviyo/Shopify exact mode): MEDIUM — operator decision deferred (Open Q3); does not block the build, only the live-fill.

**Research date:** 2026-06-04
**Valid until:** stable (~30 days) — internal architecture; the only volatile piece is the external Klaviyo/Shopify embed mechanics, resolved at provisioning time.
