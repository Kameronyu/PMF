# Build Audit — Inputs and Discipline

A builder agent should never have to chase the user mid-build for facts that belong in the spec, and should never finish a build without running a fixed set of integrity checks. This audit codifies both, seeded from the InkLeaf session.

## 1. Spec inputs the builder needs upfront

### Brand
- `brand.name` — Display name used in nav, footer, title tag. Example: `Acme`
- `brand.tagline` — One-line positioning under the wordmark. Example: `Tools for focused work`
- `brand.tone_reference` — A named competitor/aesthetic anchor, not adjectives. Example: `Eazeye + Daylight Computer` (NOT "warm and friendly")
- `brand.palette` — Hex tokens: bg, surface, ink, ink-mid, line, accent, accent-deep. Example: `--bg:#F4EFE6; --accent:#C76A2D`
- `brand.typography` — Heading face + body face + mono face, with weights. Example: `Newsreader 200/400, Inter 400/600, JetBrains Mono 400`
- `brand.banned_glyphs` — Characters forbidden in copy. Example: `— (em dash), – (en dash), " "` (curly quotes)
- `brand.logo_assets` — Path to wordmark SVG + mark SVG + monochrome variants. Example: `./assets/logo.svg, ./assets/logo-mark.svg`

### Product
- `product.name` and `product.one_liner` — Hero h1 source of truth. Example: `Foldable e-ink reader-writer`
- `product.spec_sheet` — Verified hardware/SKU table (dimensions, weight, battery, ports, hinge angle). Example: `Hinge: 180°` — must be confirmed before copy writing.
- `product.feature_pillars` — 3–6 pillars with name + 1-sentence proof. Example: `Two screens — read on left, annotate on right`
- `product.comparison_targets` — Named competitors + axes for the compare table. Example: `vs reMarkable, vs Kindle Scribe; axes: weight, screens, sync`

### Sections
- `sections.order` — Ordered list of section IDs the page must render. Example: `hero, trust, problem, features, software, compare, specs, story, faq, final-cta`
- `sections.copy` — Headline + lede + body per section in plain language (no internal jargon). Example: avoid "single canvas," say "one continuous page across both screens"
- `sections.faq` — Q/A pairs with the canonical answer, especially pricing/shipping. Example: `Q: When does it ship? A: Q4 2026`

### CTAs
- `cta.primary_label` and `cta.primary_destination` — Example: `Reserve for $50 → /deposit`
- `cta.secondary_label` and `cta.secondary_destination` — Example: `Email me at launch → #signup`
- `cta.pricing_canon` — Single source of MSRP, founder price, deposit amount, refund policy. Example: `MSRP $799, Founder $599, Deposit $50 fully refundable`
- `cta.form_endpoint` — Final production action URL + hidden fields. Example: `Shopify: /cart/add, variant 12345`

### Assets
- `assets.hero_media` — Path + intrinsic dimensions + aspect ratio. Example: `hero.mp4, 1920x1536, 5:4`
- `assets.image_manifest` — slot → file mapping (output of vision-classification pass). Example: `problem-1 → overhead-annotation.jpg`
- `assets.founder_portrait` — Explicit path, not "somewhere on disk". Example: `./assets/founder.jpg`
- `assets.third_party_marks` — Pre-cropped Reddit/Kickstarter/payment badges. Example: `./assets/kickstarter-wordmark.svg`
- `assets.cdn_base` — Where production assets live. Example: `https://cdn.shopify.com/s/files/1/0000/.../files/`

### Destination
- `destination.platform` — Shopify / Webflow / static / email. Example: `Shopify Liquid section`
- `destination.template_name` — Example: `page.landing.json → sections/landing.liquid`
- `destination.theme_globals_suppression` — Which templates suppress global nav/footer. Example: `theme.liquid skips header/footer when template.suffix == 'landing'`
- `destination.viewport_targets` — Required preview widths. Example: `375, 390, 430, 1180`

## 2. Build-time discipline (in order)

1. Lock the **pricing canon** in a single constants block at the top of the file; every section reads from it. No hardcoded numbers elsewhere.
2. Verify the **spec sheet** against the source-of-truth doc (hinge angle, weight, battery) BEFORE writing any copy — copy errors compound.
3. Run `ffprobe` / image-dim probe on every hero asset; set the container `aspect-ratio` to match exactly. Never guess 16:9.
4. Build **mobile-first at 375 px**; every section must reflow cleanly before any `@media(min-width:840px)` rule is written.
5. Enforce **hero above-the-fold**: at laptop 100svh − nav height, the h1 + sub + signup form + primary CTA must all be visible. Tune the `clamp()` on h1, not the padding.
6. Generate `preview.html` early — an iframe grid at 375 / 390 / 430 / 1180 px pointing at `index.html`. Use it after every section.
7. Re-check **logo contrast** every time a section background changes; swap mono variants where needed.
8. Decide **base64 vs CDN** per asset: ≤10 KB logos/icons → inline base64 (offline email render); photos and video → CDN URL (production). Keep both paths working.
9. Run an **em-dash and curly-quote grep** across all HTML files; replace per `brand.banned_glyphs`.
10. Audit **plain-language**: grep for internal jargon tokens ("canvas," "modality," etc.) and rewrite.
11. Audit **cross-file links**: every `href` to a sibling page must resolve after any rename; run a link-check pass before declaring done.
12. Strip Shopify form **placeholder stubs** (`onsubmit` JS, fake variant IDs) or clearly flag them with `<!-- REMOVE BEFORE LAUNCH -->`.
13. For Shopify handoff: produce the Liquid section with doctype/html/head/body wrappers stripped; head assets move to `theme.liquid` or section schema.
14. **Email bundle**: zip `index.html` + `assets/` with all CDN URLs swapped to relative paths; verify it renders opened directly from disk (file://) with no network.
15. Final pass: open `preview.html` at all four widths, confirm no horizontal scroll, no clipped CTAs, no broken images, no leaked placeholder copy.
