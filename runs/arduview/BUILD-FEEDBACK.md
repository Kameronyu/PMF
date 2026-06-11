# Arduview LP — Build Feedback & Session Post-Mortem

Source-of-truth capture from the manual reference build (this session). Feeds GSD **Phase 17 (LP Builder)** — discuss-phase / ui-phase should pull the visual contract from here so the build doesn't re-derive it. Reference implementation: `runs/arduview/site/` (live at https://arduview-see-through.surge.sh).

---

## 0. Builder read-set (READ THIS FIRST — hard allowlist)

The Phase-17 builder reads ONLY what's below. Everything else in `runs/arduview/` is archived strategy/process — do not open it. The whole point: lean down, pre-build, stop handing the agent anything it doesn't need.

**READ (canonical inputs):**

| Input | What it is | Concern / how to use |
|---|---|---|
| `UI-SPEC.md` *(Phase 17 output, not yet created)* | the single visual/design contract | ui-phase produces it by merging STYLE-LOCK + §1–3 of this doc. Once it exists it **supersedes both** — design source becomes UI-SPEC alone. |
| `STYLE-LOCK.md` | locked "Glasshouse" system (color/type/architecture) | **PARTIAL** — missing the fold/contrast/responsive layer (§1 here supplies it). It's an *input to UI-SPEC*, not a standalone read once UI-SPEC exists. |
| this doc, **§1–3 only** | the visual deltas, builder restraint rule, image-numbering convention | Read §1–3. §4–5 (asset pointers, post-mortem) are human/process — **not builder-facing**. |
| `PAGE-SPEC.md` *(to be created at plan time)* | lean copy + asset map + section map | plan-phase extracts it from COPY-DRAFT so the builder **never reads COPY-DRAFT or full HTML**. |
| `runs/arduview/site/` | pre-built reference: HTML + `styles.css` + assets | **Edit, don't rebuild.** `styles.css` is LINKED, never read (agent needs class *names* only, from the section map). HTML: read only the *target block* via the map — never end-to-end. |

**DO NOT READ (archived — slop for a builder):** brand-refs (1,380 ln, already distilled into STYLE-LOCK) · COPY-DRAFT.md preamble/notes/rejected sections (only copy+asset map matters → PAGE-SPEC) · HERO-VIDEO.md (video-editor spec; video is already cut) · SHOPIFY-HANDOFF\* (only if deploying to Shopify; we use surge) · FUNNEL-DESIGN / STRATEGY-DISCUSS-HANDOFF / RERUN-BRIEF / market-selection / space-map (upstream strategy).

**Going forward (standing directive):**
1. **Lean down** — ui-phase merges STYLE-LOCK + §1–3 into ONE UI-SPEC; after that, retire the two-doc read, UI-SPEC is the only design source.
2. **Pre-build, reuse, never regenerate** — the design system (`styles.css`), component markup, downscaled assets, and deploy/preview scripts (`_tooling/`) are already built. The builder composes/edits; it does not author CSS or re-derive the system.
3. **Content as a manifest** — plan-phase extracts PAGE-SPEC (copy + asset + section map) so the builder never opens COPY-DRAFT or reads a full HTML file, only the mapped block it's editing.
4. **Hard allowlist** — the READ list is exhaustive. Anything not on it stays closed; new material gets distilled INTO UI-SPEC/PAGE-SPEC, never handed raw.
5. **Endgame read budget per task** — UI-SPEC + PAGE-SPEC (each once) + the ~20 lines of the one block being edited. Nothing else.

---

## 1. Visual delta list (what the original docs did NOT specify — had to be given mid-build)

The copy brief covered *what to say*; it did not cover the *page craft*. Every item below was user feedback during the build. These become the UI-SPEC.

### Contrast / legibility (recurred twice — systemic, not a one-off)
- Hero headline highlight "see right through" rendered **black-on-black**.
- Same bug hit again: deposit "$5 deposit" highlight black-on-black.
- Root cause (one rule, two symptoms): the accent-highlight class defaulted to dark ink and was only patched for *some* dark containers. **Rule:** the accent/highlight color must be context-aware — readable on BOTH light and dark surfaces. No text on a same-value background, ever.
- General: base font size and secondary-text contrast were too low. Bumped body to 17px, leads up, greys darkened on light / lightened on dark.

### CTA legibility
- CTA text must be **black on the accent**, in a **readable face** — NOT the dot-matrix/display font. The brand display font is unreadable at button size.

### Fold budget (the single most-iterated thing — 3 passes on the hero)
- **LP hero above the fold:** title + CTA + video. Subheader sits BELOW the fold. Video is the centerpiece (≥ half the hero), bigger than instinct.
- **Deposit above the fold:** image + title + CTA + the value (51% off). Image beside the title (no scroll to see it). CTA up top. Description can drop below.
- State the fold budget per page explicitly; don't leave it to the builder.

### Element order per breakpoint (state both, don't infer)
- **LP desktop:** headline + CTA left, video right; subheader full-width below.
- **LP mobile:** title → CTA → video → subheader. Hero media full-bleed (edge-to-edge) on mobile.
- **Deposit mobile:** image on top (capped height) → title → price → CTA.

### Copy hierarchy / risk-reversal (deposit page)
- Tighten copy but **do not delete any risk-reversal move** (deposit credits toward price; fully refundable; money-back). **Do not repeat yourself** — each risk-reversal point appears once, in one zone. Value (51%) above the fold; reassurance as they scroll.

### Decorative cleanup
- Remove image captions (figcaptions). They were builder-invented annotation — see the restraint rule (§2).

### Copy-layer asks (upstream/copywriter's job, logged for completeness, NOT builder scope)
- Remove em dashes + AI tells. "handheld" → "handheld console." Drop "2 hours of play."

---

## 2. Builder restraint rule (de-AI for the builder — NOT the humanizer skill)

The builder does not need the `humanizer` skill: by build time the copy is locked (copywriter's job). The builder's only AI-tell risk is **over-building**. One rule:

> **Additive restraint: the builder renders the brief in the locked visual system and adds no _customer-facing_ content the brief didn't ask for — in words or in chrome.**
> Every **visible** word comes from the copy brief. The builder lays out and styles; it does not author customer-facing copy. No image captions, no invented section eyebrows/kickers, no badge labels, no helper microcopy, no "what is this" tags. No decorative UI the brief didn't call for. When you feel the urge to add a visible label/caption to "help" — that's the tell, don't.
>
> **The rule applies ONLY to customer-facing/visible content.** Anything the customer never sees is unconstrained — write whatever helps: `alt` text, `aria-*` labels, code comments, `data-*` attributes, class names, file names, build notes. Be as descriptive there as you want; it's good practice, not chrome. Functional visible strings that are unavoidable and conventional (form placeholders, button states) are also fine, kept minimal.

Why: over-annotation is itself an AI tell. AI builders label everything because they pattern-match "complete-looking page." Restraint reads as designed; annotation reads as generated. The captions were one symptom of this; the rule covers the whole class.

Visual AI-tells to also avoid: gratuitous gradients, emoji-as-icons, three-identical-feature-cards, centered-everything defaults. (The locked "Glasshouse" system in `STYLE-LOCK.md` already fights these — the contract should just say so.)

---

## 3. Image-numbering convention (so photo swaps are unambiguous)

"Image N on the page" = the **framed product photos in document order**, hero video EXCLUDED:
- **image 1** = section "why it's clear" lead → `transparency.jpg`
- **image 2** = section "why it's clear" guts → `maker.jpg`
- **image 3** = section "what it is" → `gameplay.jpg`
- **image 4** = section "who it's for" → `scale.jpg`
- (deposit hero image referred to as "the deposit image" → `deposit.jpg`)

---

## 4. Asset & hosting pointers
- Working site: `runs/arduview/site/` — `index.html`, `deposit.html`, `styles.css`, `script.js`, `assets/img/*`, `assets/video/hero.mp4`.
- Locked visual system: `runs/arduview/STYLE-LOCK.md` (partial UI contract — has color/type/architecture; MISSING the fold/contrast/responsive layer that §1 supplies).
- Accent color decision (cyan `#2be5ff`) came from `HERO-VIDEO.md`, not invented.
- Source photos: `/mnt/c/Users/kyu3/Downloads/` (raw) + `runs/arduview/asset-classify/images-from-frames/`. Downscale to ~1600px / q82 before use (keeps the deploy small).
- Live link: https://arduview-see-through.surge.sh — redeploy with `runs/arduview/_tooling/surge_drive.py` (see §5).

---

## 5. SESSION POST-MORTEM — token waste & reusable figure-outs

### Reads that were heavy or partially wasted
- **3 brand-ref docs (~1,380 lines)** — the biggest single spend. User-requested, so justified, but now fully distilled into `STYLE-LOCK.md`. **Never re-read the brand-refs;** read STYLE-LOCK instead.
- **`SHOPIFY-HANDOFF-TIGHT.md`** — read in full for Shopify mechanics, then we pivoted to surge. The Shopify-specific liquid/template detail went unused. Partially wasted; fine to skip unless actually deploying to Shopify.
- **`COPY-DRAFT.md` read fully ~3×** as it changed. Later passes only needed the `ASSET` lines — grep those instead of full re-reads.
- **A few forced HTML re-reads** from "file modified since read" after the user edited files. Minor.
- **One dead `ToolSearch`** ("browser playwright") returned unrelated tools (no browser MCP exists). Skip — use Playwright via node directly.

### Things I had to figure out that are now STORED (so never re-figured)
1. **Drive real Windows Chrome from WSL over CDP** — the hard one (~8 calls of diagnosis). Recipe + scripts saved → memory `reference_wsl_windows_chrome_cdp` + `runs/arduview/_tooling/`.
2. **Deploy a static folder to a live URL (surge.sh)** — creds prompt needs a PTY; piping fails. Driver saved → memory `reference_surge_static_deploy` + `_tooling/surge_drive.py`.
3. **Playwright lives at `/home/kyu3/node_modules/playwright`** (NOT the project) — scripts must `require()` the absolute path. Hit MODULE_NOT_FOUND twice.
4. **Headed browser in WSL** works via WSLg `DISPLAY=:0`; the `WebGL blocklisted` warnings are harmless.
5. **Share gotcha:** a zipped static site opened from *inside* the zip loses all CSS/images (siblings not extracted). Host it (surge) or tell recipients "Extract All first." Never rely on in-zip double-click.

### Back-and-forth that should never recur (now captured)
- The entire §1 visual delta list + §2 restraint rule → this doc → Phase 17 UI-SPEC. This is the #1 "store so we never re-derive."
- Image-numbering convention (§3).
- Hosting preference (live link) + the WSL→Windows bridge → memory.

**Net:** future LP builds read `STYLE-LOCK.md` + this doc (not the brand-refs). Infra (browser bridge, deploy) is one script away. The only thing a fresh session needs to be told is *new* creative direction, not how to render or how to ship.
