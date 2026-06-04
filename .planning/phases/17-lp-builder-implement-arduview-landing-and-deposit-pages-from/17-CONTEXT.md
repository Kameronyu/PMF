# Phase 17: LP Builder — Context

**Gathered:** 2026-06-04
**Status:** Ready for planning

<domain>
## Phase Boundary

Build a **reusable, product-agnostic LP-builder workflow** — an ordered pipeline that takes
`{copy brief + visual system + assets}` and emits correct, on-brand HTML landing/deposit pages,
deployed live, with email + checkout wired and no agent ever re-editing another agent's output.

**Arduview is the first test instance, NOT the spec.** The builder knows nothing about
crowdfunding, founders, deposits, or Arduview. Those are *instance inputs* (copy + UI-SPEC for
one brand), never semantics baked into the builder. Anything that hardcodes Arduview/crowdfunding
structure into the engine is a bug.

**Phase title is now misleading** ("implement Arduview landing and deposit pages") — it describes
the test instance, not the deliverable. Recommend renaming the roadmap phase to reflect the
reusable workflow. (Flagged, not yet applied.)

</domain>

<decisions>
## Implementation Decisions

### Core architecture — the no-rework pipeline
- **D-01:** The pipeline is a sequence of stages with **frozen inter-stage contracts**, ordered so no
  stage re-edits an upstream stage's output. Phase 17's FIRST deliverable is an **INTERFACES spec**
  that freezes every stage's input/output schema. Stages code against the *schema*, not the
  neighbor's guts — so build order can't force a re-edit. (This is the "manifest contract" move the
  asset bricks already used.)
- **D-02:** Stage spine:
  1. `design-research` → DESIGN-DIRECTION *(its own phase — see Deferred; NOT a blocker for Arduview)*
  2. **UI-SPEC** = design-direction + style-lock + §1 page-craft rules — the per-instance *visual contract*
  3. **PAGE-SPEC** = copy brief + asset map + section map — the per-instance *content contract*
  4. **asset prep** = downscale/optimize (upstream, Phase-16 territory; builder consumes ready assets)
  5. **HTML BUILDER** = eats UI-SPEC + PAGE-SPEC + integration-config → **tokenized** markup, links the
     locked `styles.css`. **The ONLY agent that ever writes HTML.**
  6. **hydrate** (script) = fills `{{KLAVIYO_FORM_ACTION}}`, `{{SHOPIFY_CHECKOUT}}` tokens from config
  7. **asset-upload.js** (script, already built) = filename→Shopify CDN URL from `url-map.json`
  8. **deploy** = surge script

### The builder (the reusable engine)
- **D-03:** Builder **writes markup; reuses the locked `styles.css`, never re-authors CSS.** It composes
  HTML against a prebuilt, locked design system. (Reference [runs/arduview/site/index.html](runs/arduview/site/index.html) is lean — 268 lines — and is the proven output to match for the Arduview instance.)
- **D-04:** Builder is **pure**: copy + visual-system + assets → markup. No endpoints, secrets, or
  integration knowledge in its prompt. It emits **tokens** (`{{…}}`) and stable asset filenames, not
  live URLs — so it's testable with zero live accounts and stays non-brittle/reusable across brands.
- **D-05:** **Additive restraint rule** (BUILD-FEEDBACK §2) is a builder behavior constraint: render only
  the brief's visible content; invent no customer-facing chrome (no captions, eyebrows, badge labels,
  helper microcopy). Non-visible strings (alt text, aria, data-attrs, class/file names) are unconstrained.

### Integration (Klaviyo + Shopify) — provisioning, not HTML-editing
- **D-06:** **There is no Shopify/Klaviyo agent that touches markup.** Each is a **provisioning brick** that
  outputs config *strings* (Shopify $5-product checkout URL; Klaviyo list-id/form action; store-id for CDN).
  Everything that must appear in the HTML is either (a) config fed INTO the builder before it runs, or
  (b) a deterministic token-substitution script (`hydrate` / `asset-upload.js`) run AFTER. No second
  agent ever opens the HTML.
- **D-07:** **Provisioning posture = manual-paste config** (low fragility), matching `asset-upload.js`'s
  deliberate no-credentialed-automation scope. You create the $5 product + Klaviyo list, paste two
  strings into a config file; `hydrate` fills the tokens. Fully functional, no brittle credentialed
  browser automation required. (Admin-API/Playwright automation stays deferred to M2.)
- **D-08:** Image CDN swap is **already solved** by `asset-upload.js` (Phase 16, brick 8): builder leaves
  stable `assets/img/<name>.jpg` filenames; the script backfills `cdn.shopify.com/...` from the url-map.

### Contracts & artifacts
- **D-09:** Produce **UI-SPEC + PAGE-SPEC** as committed contract artifacts. UI-SPEC lives at
  `.planning/phases/17/UI-SPEC.md` (GSD-native). PAGE-SPEC is the per-instance content manifest.
- **D-10:** **UI-SPEC supersedes STYLE-LOCK + BUILD-FEEDBACK §1** — once it exists it is the single design
  source; STYLE-LOCK + §1 become inputs-only, never re-read by the builder.
- **D-11:** **§1 page-craft rules port in verbatim as hard constraints** a ui-checker can enforce:
  per-page fold budget, **context-aware accent (no black-on-black, ever — this bug recurred twice)**,
  17px body min, explicit element order per breakpoint, CTA = black-on-accent in a readable face
  (not the Doto display font).

### Deploy & assets
- **D-12:** Deploy target = **surge.sh** (locked); deploy is a pipeline stage and the Arduview instance
  gets deployed live as the workflow's validation. Driver: `runs/arduview/_tooling/surge_drive.py`.
- **D-13:** Builder's input contract **requires optimized assets** (~1600px / q82); asset prep is upstream
  (asset-emit), not a builder or Arduview decision.

### Claude's Discretion
- Token naming/format, hydrate script shape, INTERFACES spec format, where provisioning config lives.
- Exact UI-SPEC/PAGE-SPEC schema fields (constrained by D-09/D-11 and the §1 rules).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### The build contract (design + restraint)
- `runs/arduview/site/STYLE-LOCK.md` — locked "Glasshouse" system (color/type/architecture). **Input to UI-SPEC** (the Arduview instance's design direction); retired as a builder read once UI-SPEC exists (D-10).
- `runs/arduview/BUILD-FEEDBACK.md` §1 — page-craft deltas STYLE-LOCK lacks (fold budget, contrast/accent rule, responsive order, CTA legibility). Port verbatim into UI-SPEC (D-11).
- `runs/arduview/BUILD-FEEDBACK.md` §2 — additive-restraint rule = builder behavior constraint (D-05).
- *(BUILD-FEEDBACK §3 image-numbering = REJECTED as brittle — do NOT encode it.)*

### Reference build (the proven output to match for the Arduview instance)
- `runs/arduview/site/` — `index.html`, `deposit.html`, `styles.css`, `script.js`, `assets/`. **Edit/compose; never re-author `styles.css`.**

### Content source (Arduview instance only — feeds PAGE-SPEC, not the builder)
- `runs/arduview/COPY-DRAFT.md` — Arduview copy + asset map. Source for the Arduview PAGE-SPEC instance. The builder never opens this; PAGE-SPEC does.

### Bricks & integration (already built / to wire)
- `tools/asset-upload.js` — brick 8, filename→Shopify CDN backfill from `url-map.json` (the post-build image swap, D-08).
- `tools/asset-emit.js` — asset prep upstream (optimized assets the builder consumes).

### Principles & infra
- `CLAUDE.md` (PMF) — agent-design rule: one job per agent; scripts for deterministic jobs (fetch/swap/hydrate), agents for judgment (builder); hooks to gate. This pipeline is a direct application.
- Memory `reference_surge_static_deploy` — surge deploy (PTY-driven).
- Memory `reference_wsl_windows_chrome_cdp` — WSL→Windows Chrome bridge (only if any provisioning step is automated later; manual-paste is the v1 posture per D-07).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- **`runs/arduview/site/styles.css`** — the locked Glasshouse design system. Linked, never regenerated. This is the reuse that prevents bloat (no agent invents one-off CSS).
- **`tools/asset-upload.js`** — already implements the deterministic image→CDN swap; the builder just needs to leave stable filename tokens (it already does: `src="assets/img/<name>.jpg"`).
- **`tools/asset-emit.js` + Phase-16 asset bricks** — produce optimized assets + manifests upstream.
- **`runs/arduview/_tooling/`** — surge deploy driver + browser bridge scripts (already built).

### Established Patterns
- **Brick model** (`capability_inventory.md`): scripts for deterministic jobs, agents for judgment, hooks to gate. The builder is the one judgment agent; hydrate/asset-upload/deploy are scripts.
- **Manifest contracts between bricks** (Phase 16, 16-05) — the precedent for D-01's frozen INTERFACES spec.

### Integration Points
- Builder output tokens → `hydrate` (Klaviyo action, Shopify checkout) + `asset-upload.js` (CDN) → surge deploy.
- Provisioning config (manual-paste) → hydrate input.

</code_context>

<specifics>
## Specific Ideas

- Tokens-not-inline is the load-bearing choice: it keeps the builder pure, lets it run with zero live
  accounts, and folds Klaviyo + Shopify-checkout + CDN into the single post-build substitution pass we
  already need (CDN URLs only exist after upload).
- "The builder is the only thing that writes HTML" is the one-line rule that resolves every re-edit worry.

</specifics>

<deferred>
## Deferred Ideas

- **`design-research` phase** (its own phase, user decision): an agent skilled at picking competitor LPs
  for visual/design inspo → screenshot capture (script) → visual analysis (agent) → synthesize
  DESIGN-DIRECTION (agent) that feeds UI-SPEC. **Not a blocker for Phase 17** — the Arduview instance's
  design direction already exists (Glasshouse/STYLE-LOCK). It feeds *future* instances' UI-SPECs. Needs
  adding to the roadmap.
- **Arduview content decisions** — founder copy, trust badges, through-page proof clips, headline A/B,
  image-numbering. These are **instance inputs** owned by the copywriter/operator, NOT builder scope.
  (Hero A/B harness: deferred; builder lays out whatever copy slots it's given.)
- **Credentialed Shopify Admin-API / Playwright provisioning automation** — rides M2; v1 uses manual-paste config (D-07).
- **Roadmap edit** — rename Phase 17 away from the Arduview-specific title; insert the `design-research` phase.

</deferred>

---

*Phase: 17-lp-builder-implement-arduview-landing-and-deposit-pages-from*
*Context gathered: 2026-06-04*
