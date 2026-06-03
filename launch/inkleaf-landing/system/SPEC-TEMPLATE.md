# SPEC TEMPLATE

What this is: the upfront input the builder agent reads before writing any code. Fill all required fields before handoff; missing fields will be flagged as blockers and the build will halt until resolved.

---

## Brand

- `brand.name` — Display name used in nav, footer, title tag. Example: `{{BRAND_NAME}}` → `Acme`
- `brand.tagline` — One-line positioning under the wordmark. Example: `Tools for focused work`
- `brand.tone_reference` — Named competitor or aesthetic anchor (NOT adjectives like "warm" or "friendly"). Example: `{{TONE_ANCHOR_1}} + {{TONE_ANCHOR_2}}`
- `brand.palette` — Hex tokens for bg, surface, ink, ink-mid, line, accent, accent-deep. Example: `--bg:{{BG_HEX}}; --accent:{{ACCENT_HEX}}; --ink:{{INK_HEX}}`
- `brand.typography` — Heading face + body face + mono face with weights. Example: `{{HEADING_FONT}} 200/400, {{BODY_FONT}} 400/600, {{MONO_FONT}} 400`
- `brand.banned_glyphs` — Characters forbidden in copy (enforced by grep). Example: `— (em dash), – (en dash), " " (curly quotes)`
- `brand.logo_assets` — Path to wordmark SVG, mark SVG, monochrome variants. Example: `./assets/logo.svg, ./assets/logo-mark.svg, ./assets/logo-mono.svg`

## Product

- `product.name` — Source of truth for hero h1. Example: `{{PRODUCT_NAME}}`
- `product.one_liner` — Sub-headline under h1. Example: `{{PRODUCT_ONE_LINER}}`
- `product.spec_sheet` — Verified hardware/SKU table (dimensions, weight, battery, ports, etc.). Numbers must be confirmed before copy is written. Example: `Weight: {{WEIGHT}}; Battery: {{BATTERY_HOURS}}h`
- `product.feature_pillars` — 3 to 6 pillars, each with name + one-sentence proof. Example: `{{PILLAR_1_NAME}} — {{PILLAR_1_PROOF}}`
- `product.comparison_targets` — Named competitors + axes for the compare table. Example: `vs {{COMPETITOR_1}}, vs {{COMPETITOR_2}}; axes: {{AXIS_1}}, {{AXIS_2}}`

## Sections

- `sections.order` — Ordered list of section IDs the page must render. Example: `hero, trust, problem, features, compare, specs, story, faq, final-cta`
- `sections.copy` — Headline + lede + body per section in plain language. No internal jargon. Example: `{{SECTION_ID}}: headline="{{HEADLINE}}", lede="{{LEDE}}"`
- `sections.faq` — Question/answer pairs with canonical answers, especially for pricing and shipping. Example: `Q: {{FAQ_Q}} A: {{FAQ_A}}`

## CTAs

- `cta.primary_label` and `cta.primary_destination` — Example: `{{PRIMARY_CTA_LABEL}} → {{PRIMARY_CTA_URL}}`
- `cta.secondary_label` and `cta.secondary_destination` — Example: `{{SECONDARY_CTA_LABEL}} → {{SECONDARY_CTA_URL}}`
- `cta.pricing_canon` — Single source of MSRP, founder price, deposit amount, refund policy. Every number on the page reads from this block. Example: `MSRP {{MSRP}}, Founder {{FOUNDER_PRICE}}, Deposit {{DEPOSIT_AMOUNT}} {{REFUND_POLICY}}`
- `cta.form_endpoint` — Production action URL + hidden fields for every form on the page. Example: `action={{FORM_ACTION_URL}}, variant={{VARIANT_ID}}, list_id={{LIST_ID}}`

## Assets

- `assets.hero_media` — Path + intrinsic dimensions + aspect ratio. Required before container sizing. Example: `{{HERO_FILE}}, {{WIDTH}}x{{HEIGHT}}, {{ASPECT_RATIO}}`
- `assets.image_manifest` — slot → file mapping. Example: `{{SLOT_ID}} → {{IMAGE_FILE}}`
- `assets.portrait_assets` — Explicit paths for founder/team shots. Example: `./assets/{{PORTRAIT_FILE}}`
- `assets.third_party_marks` — Pre-cropped logos, badges, payment marks. Example: `./assets/{{BADGE_FILE}}`
- `assets.cdn_base` — Where production assets live. Example: `{{CDN_BASE_URL}}`

## Destination

- `destination.platform` — Shopify, Webflow, static, or email. Example: `{{PLATFORM}}`
- `destination.template_name` — Example: `{{TEMPLATE_JSON}} → {{SECTION_LIQUID}}`
- `destination.theme_globals_suppression` — Which templates suppress global nav/footer. Example: `theme.liquid skips header/footer when template.suffix == '{{SUFFIX}}'`
- `destination.viewport_targets` — Required preview widths in px. Example: `375, 390, 430, 1180`
