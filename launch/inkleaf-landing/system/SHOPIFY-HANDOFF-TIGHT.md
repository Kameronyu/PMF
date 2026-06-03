# InkLeaf → Shopify Handoff (Tight)

Ship two pages: **landing** (`/pages/inkleaf`, email signup) and **deposit** (`/pages/inkleaf-deposit`, $9.99 one-click reservation → native checkout).

## Read these Shopify docs FIRST

If anything below conflicts with the docs, the docs win.

- Theme architecture — https://shopify.dev/docs/storefronts/themes/architecture
- Page templates — https://shopify.dev/docs/storefronts/themes/architecture/templates/page-template
- JSON templates — https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
- Sections — https://shopify.dev/docs/storefronts/themes/architecture/sections
- Layouts — https://shopify.dev/docs/storefronts/themes/architecture/layouts
- Liquid `{% form %}` — https://shopify.dev/docs/api/liquid/tags/form
- Cart Ajax API (`/cart/add`) — https://shopify.dev/docs/api/ajax/reference/cart
- `asset_url` — https://shopify.dev/docs/api/liquid/filters/asset_url
- `stylesheet_tag` — https://shopify.dev/docs/api/liquid/filters/stylesheet_tag
- `template.suffix` — https://shopify.dev/docs/api/liquid/objects/template
- OS 2.0 conventions — https://shopify.dev/docs/storefronts/themes/os20

Check theme `Templates/` for `.json` vs `.liquid` before assuming OS 2.0 layout.

## Files → destinations

| Source | Shopify destination |
|---|---|
| `index.html` | `templates/page.inkleaf-launch.json` + `sections/inkleaf-launch.liquid` |
| `deposit.html` | `templates/page.inkleaf-deposit.json` + `sections/inkleaf-deposit.liquid` |
| `preview.html` | Dev only — do not deploy |
| `inkleaf-photos/MANIFEST.md` | Reference; all image URLs already point at live Shopify CDN |

## Pages + product

- Page 1: title "InkLeaf", handle `/pages/inkleaf`, template suffix `inkleaf-launch`.
- Page 2: title "InkLeaf Reserve", handle `/pages/inkleaf-deposit`, template suffix `inkleaf-deposit`.
- Reservation product: title "InkLeaf Founder Reservation", price `$9.99`, **non-shippable digital** (no shipping prompts at checkout). Capture the variant ID.

## Section maps

**index.html (top to bottom):** Hero (full-bleed image + email signup) · Trust strip (3 proof points) · Problem · 3 Benefits (read+write / folds / pen on paper) · "Works wherever you do" lifestyle 3-up · "Engineered like furniture" hardware 3-up · Spec sheet (dark card, 8 specs) · Versus alternatives (reMarkable 2 / Boox Note Air / Kindle Scribe) · Founder quote · FAQ (`<details>` accordion) · Final CTA (second signup) · Footer.

**deposit.html:** Top bar (logo + SSL line) · Two-column body: left offer (eyebrow → serif H1 → $9.99 + save-51% tag → lede → 3 perks → product image), right sticky checkout (reassurance → big "Reserve for $9.99" → payment badges → SSL line → fine print) · Slim footer.

## Form wiring

**Deposit (`sections/inkleaf-deposit.liquid`):**
- Swap `value="REPLACE_WITH_SHOPIFY_VARIANT_ID"` → real variant ID, or use `value="{{ products['inkleaf-founder-reservation'].variants.first.id }}"`.
- In the inline script, REMOVE the `e.preventDefault();` and `setTimeout(...)` dev stubs. Form must genuinely POST to `/cart/add`.
- Shop Pay is auto-injected by Shopify on the checkout step — do not add manually.

**Landing (`sections/inkleaf-launch.liquid`):** Replace `<form class="signup" onsubmit="...">` (both hero and final-CTA copies) with one of: `{% form 'customer', class: 'signup' %}` tagged `inkleaf-launch`; or Klaviyo embed; or Mailchimp embed.

**Cross-links:** `href="index.html"` → `/pages/inkleaf`. Add `<a href="/pages/inkleaf-deposit" class="btn btn-accent btn-lg">Reserve for $9.99 →</a>` in the landing hero.

## Brand non-negotiables (DO NOT CHANGE)

- **Pricing canon:** $9.99 deposit · $489 founder · $999 MSRP · "51% off." Never round or paraphrase.
- **Palette:** bg `#F4EFE6` · surface `#FAF6EE` · surface-2 `#EDE6D8` · ink `#1A1714` · ink-mid `#5C544A` · accent `#C76A2D` · accent-deep `#A55620` · accent-soft `#F3DCC2` · line `#D8CFC0`. No off-palette greys, no pure white.
- **Type:** Newsreader (headings), Inter (body), JetBrains Mono (eyebrows/labels). No third face.
- **Tone:** Eazeye / Daylight Computer. Plain English, no em dashes, no metaphor-only headings, no jargon ("single canvas," "unified surface" — banned).
- **Image URLs:** Already live CDN (`cdn.shopify.com/s/files/1/0864/9234/8609/files/…`); do not re-host.
- **Copy:** Don't edit headlines, sub-heads, FAQ answers, or perk lines unless fixing a factual error.

## Asset URL convention

All production paths use the live Shopify CDN prefix above. Theme-local CSS/JS goes through `{{ 'inkleaf-launch.css' | asset_url | stylesheet_tag }}`. Never ship relative paths.

## Gotchas

- Hero scrim uses `z-index:-1`; bump it if a theme announcement bar overlays.
- Hero `object-position: 50% 100% / 50% 95%` is hand-tuned; re-tune if the theme wrapper adds top padding.
- Deposit payment badges are inline HTML; if the user supplies a PNG, swap the `.cards` block for `<img src="{{ 'payment-icons.png' | asset_url }}">`.
- Suppress theme header/footer via `{% unless template.suffix == 'inkleaf-launch' or template.suffix == 'inkleaf-deposit' %}` guard, or use a slim `layout/landing.liquid`.

## Intentionally excluded

No landing Buy button (signup list). No reviews (pre-launch). No video (raw MP4s exist but unclassified). No founder portrait. No card fields on deposit (Shopify checkout handles it).

## Report back

1. Live URLs for both pages. 2. Variant ID wired in. 3. Email tool connected (Customers / Klaviyo / Mailchimp). 4. Any HTML/CSS edits made — list them so source files stay in sync. 5. One screenshot per page.
