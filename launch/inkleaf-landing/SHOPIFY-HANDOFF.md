# InkLeaf Landing + Deposit → Shopify Deployment Handoff

You are the next agent. Your job is to ship two pages into a live Shopify store: the **landing page** (email signup, $9.99 founder reservation pitch) and the **deposit page** (one-click $9.99 founder reservation that funnels into Shopify's native secure checkout).

---

## 📚 Reference docs — read these BEFORE you start porting

The instructions below paraphrase Shopify's theme architecture. **If anything in this handoff conflicts with the official docs, the official docs win.** Read these first so you don't fight the theme:

- **Theme architecture overview** — https://shopify.dev/docs/storefronts/themes/architecture
- **Page templates** (how `templates/page.*.json` resolves to a layout + section) — https://shopify.dev/docs/storefronts/themes/architecture/templates/page-template
- **JSON templates** (structure, `sections` + `order` keys) — https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
- **Sections** (`{% schema %}`, presets, settings) — https://shopify.dev/docs/storefronts/themes/architecture/sections
- **Layouts** (`layout/theme.liquid`, creating a custom slim landing layout) — https://shopify.dev/docs/storefronts/themes/architecture/layouts
- **Liquid `{% form %}` tag** (customer signup, cart) — https://shopify.dev/docs/api/liquid/tags/form
- **Cart Ajax API** (`/cart/add.js`, `/cart/add` form action) — https://shopify.dev/docs/api/ajax/reference/cart
- **`asset_url` filter** (referencing CSS/JS/images from `/assets/`) — https://shopify.dev/docs/api/liquid/filters/asset_url
- **`stylesheet_tag` filter** — https://shopify.dev/docs/api/liquid/filters/stylesheet_tag
- **Template suffix on pages** (`template.suffix`, how Shopify maps `page.<suffix>` to a page in admin) — https://shopify.dev/docs/api/liquid/objects/template
- **Online Store 2.0 theme conventions** (folder layout, what goes in `sections/` vs `snippets/`) — https://shopify.dev/docs/storefronts/themes/os20

**Theme-specific compatibility:** check which theme the user is on (Dawn, Sense, Refresh, Trade, or a 3rd-party) before assuming folder layouts. Dawn-derived themes share conventions; older themes may use `template.liquid` (not JSON) — if so, drop the `templates/page.*.json` step and instead create `templates/page.inkleaf-launch.liquid` containing the section markup directly. Check the theme's `Templates` folder for `.json` vs `.liquid` to decide.

---

## ⚠️ You have full permission to modify the HTML

The HTML in `index.html` and `deposit.html` was authored as a standalone static prototype. **You are explicitly authorized to change anything required to make it work inside Shopify**, including:

- Replacing `<form>` actions, hidden inputs, and submit handlers with real Shopify cart/checkout endpoints
- Replacing inline `<style>` blocks with theme asset files (`assets/*.css`)
- Replacing Google Fonts links / preconnects / preloads with theme-level head includes
- Replacing hardcoded internal links (`href="index.html"`, `href="#features"`) with Shopify URL filters or page handles
- Wrapping content in Liquid blocks (`{% schema %}`, `{% form %}`, `{% section %}`, etc.)
- Removing the `<!doctype>`, `<html>`, `<head>`, `<body>` wrappers when porting into Liquid sections (the theme layout already provides those)
- Swapping placeholder email-form JS with real Klaviyo / Shopify Customer / Mailchimp wiring
- Swapping the deposit page's `REPLACE_WITH_SHOPIFY_VARIANT_ID` for the actual variant ID of a $9.99 reservation product
- Substituting the inline-CSS payment-method badges for Shopify's native checkout badges, or for the user's screenshot PNG saved as a theme asset
- Adjusting `object-position`, padding, or spacing values if the theme's wrapper layout (header height, announcement bar) shifts visual layout

**Do not** change:
- Brand voice / copy (headlines, sub-heads, FAQ answers, perk lines) unless there's a factual error
- Pricing ($9.99 deposit · $489 founder · $999 MSRP · "51% off")
- Color tokens or font choices (the warm cream + terracotta palette is intentional)
- Image CDN URLs (already pointing at live Shopify CDN — these are the final assets)

If you discover a layout bug or visual issue while porting, fix it in line and note it in your handoff back.

---

## Files in this folder

| File | Purpose | Action |
|---|---|---|
| `C:\Users\kyu3\inkleaf-landing\index.html` | Main landing page (signup list, full marketing page) | Port into Shopify as `templates/page.inkleaf-launch.json` + `sections/inkleaf-launch.liquid` |
| `C:\Users\kyu3\inkleaf-landing\deposit.html` | One-click $9.99 deposit page (hybrid checkout) | Port into Shopify as `templates/page.inkleaf-deposit.json` + `sections/inkleaf-deposit.liquid` |
| `C:\Users\kyu3\inkleaf-landing\preview.html` | Multi-device mobile preview wrapper | **Dev only — do not deploy** |
| `C:\Users\kyu3\inkleaf-photos\MANIFEST.md` | Image manifest with the Shopify CDN URLs already wired into both pages | Reference only — all URLs are live |

All hero/lifestyle/detail images are already hosted on the user's Shopify CDN (`https://cdn.shopify.com/s/files/1/0864/9234/8609/files/…`), so no asset upload step is required.

---

## What the pages are

### `index.html` — Landing page
- **Goal:** Email-signup list ("Get launch access"). No payment captured here.
- **Hero:** Full-bleed image (`inkleaf-overhead-annotation.jpg`) with dark scrim. White headline + sub on overlay.
- **Primary CTA:** Email form, submits to placeholder JS handler. Replace with real list integration (Klaviyo / Shopify Customer / Mailchimp).
- **Secondary CTA:** Should funnel to `deposit.html` — but in current code the hero "Sign up" buttons land in the same on-page form. **Recommended change:** add a button labeled "Reserve for $9.99" that links to the deposit page (`/pages/inkleaf-deposit`), to give visitors a higher-intent conversion path.

### `deposit.html` — Deposit page
- **Goal:** Capture a $9.99 fully-refundable founder reservation. One click → Shopify's native secure checkout. Zero form fields on the page.
- **Hero image:** `inkleaf-hero-armchair-closed.jpg` (woman in warm armchair with closed InkLeaf).
- **Layout:** Two-column on desktop (offer left, checkout box right), stacks on mobile.
- **Primary CTA:** Single button "Reserve for $9.99" → `POST /cart/add` with the $9.99 reservation product variant ID → Shopify routes user to native checkout (Shop Pay included automatically by Shopify on checkout step).
- **No card fields, no email field, no name field on this page.** That's intentional — Shopify's hosted checkout collects all of that securely.

---

## Section map of `index.html` (top to bottom)

1. Hero (full-bleed image + email signup)
2. Trust strip (3 single-line proof points)
3. Problem ("One screen always makes you choose")
4. 3 Benefits (read+write / folds / pen on paper)
5. "Works wherever you do" lifestyle 3-up
6. "Engineered like a piece of furniture" hardware detail 3-up
7. Spec sheet (dark card, 8 specs)
8. Versus the alternatives (comparison table: InkLeaf vs reMarkable 2 / Boox Note Air / Kindle Scribe)
9. Founder quote
10. FAQ (6 questions, native `<details>` accordion)
11. Final CTA (second email signup)
12. Footer (dark, 4-column desktop)

## Section map of `deposit.html`

1. Top bar (dark, logo + "Secure reservation · 256-bit SSL")
2. Two-column body:
   - **Left:** "Founder reservation" eyebrow → "Reserve your *InkLeaf*." headline → `$9.99` price + "Save 51% at launch" tag → lede → 3 perks (founder price / priority shipping / refundable) → product image
   - **Right (sticky on desktop):** Reassurance line → big "Reserve for $9.99" button → white badge row (PayPal, Visa, MC, Amex, Discover, Diners) → SSL line → fine print
3. Slim footer

---

## Deployment recipe (do this for BOTH pages)

### 1. Create the $9.99 reservation product
- Shopify admin → Products → Add product.
- Title: `InkLeaf Founder Reservation`
- Price: `$9.99`
- **Important:** mark it as a non-shippable digital product (no shipping required) so checkout doesn't ask for shipping. The deposit is a placeholder — actual fulfillment happens later when the customer is invited to the real pre-order at $489.
- Note the **variant ID** (visible in the URL when editing the variant, or via admin GraphQL). You will paste this into `deposit.html`.

### 2. Create two Shopify pages
- Admin → Online Store → Pages → Add page.
  - Page 1: Title "InkLeaf" (handle `/pages/inkleaf`). Body blank. Template suffix: `inkleaf-launch`.
  - Page 2: Title "InkLeaf Reserve" (handle `/pages/inkleaf-deposit`). Body blank. Template suffix: `inkleaf-deposit`.

### 3. Create page templates
- Online Store → Themes → ⋯ → Edit code.
- In `Templates`, click "Add a new template" → `page` → JSON → name `inkleaf-launch`. Repeat for `inkleaf-deposit`.

Each template should reference its section:
```json
{
  "sections": {
    "main": { "type": "inkleaf-launch" }
  },
  "order": ["main"]
}
```

(For `templates/page.inkleaf-deposit.json`, use `"type": "inkleaf-deposit"`.)

### 4. Create the sections
In `Sections`, add `inkleaf-launch.liquid` and `inkleaf-deposit.liquid`.

For each:
1. Open the corresponding HTML file.
2. **Strip these tags out:** `<!doctype html>`, `<html>`, `<head>...</head>`, opening `<body>`, closing `</body>`, closing `</html>`.
3. Keep everything inside `<body>`: nav/header/main/footer markup.
4. Move the `<style>...</style>` block either inline (top of the section) or extract to `assets/inkleaf-launch.css` / `assets/inkleaf-deposit.css` and reference with `{{ 'inkleaf-launch.css' | asset_url | stylesheet_tag }}` at the top of the section. The CSS extraction is cleaner.
5. Move the Google Fonts `<link>` tags into `layout/theme.liquid` `<head>` so they're cached across pages, OR leave them in the section (will work, just re-fetched per page).
6. Append a schema block at the end of each section file:
```liquid
{% schema %}
{
  "name": "InkLeaf Launch",
  "settings": [],
  "presets": [{ "name": "InkLeaf Launch" }]
}
{% endschema %}
```

### 5. Wire up the deposit page's checkout
In `sections/inkleaf-deposit.liquid`, find:
```html
<form id="reserveForm" action="/cart/add" method="post">
  <input type="hidden" name="id" value="REPLACE_WITH_SHOPIFY_VARIANT_ID" />
  <input type="hidden" name="quantity" value="1" />
  <button type="submit" class="btn-primary">
    Reserve for $9.99 <span class="arrow">→</span>
  </button>
  <div class="under-cta">Takes you to Shopify's secure checkout. No account needed.</div>
</form>
```

Do two things:
- Replace `REPLACE_WITH_SHOPIFY_VARIANT_ID` with the real variant ID from step 1. Use Liquid if you want it dynamic: `value="{{ products['inkleaf-founder-reservation'].variants.first.id }}"`.
- In the inline `<script>` at the bottom, **remove** the `e.preventDefault();` and the `setTimeout(...)` block. They are dev-only stubs. The form should genuinely submit so Shopify takes over.

The form action `/cart/add` is a Shopify-native endpoint. After POST, Shopify adds the item and redirects to `/checkout` automatically, where Shop Pay express is shown by Shopify itself. **You do not need to add a Shop Pay button manually** — Shopify does it on the next page.

### 6. Wire up the landing page's email signup
In `sections/inkleaf-launch.liquid`, the hero signup form currently has:
```html
<form class="signup" id="signup" onsubmit="event.preventDefault();...">
```

Replace with one of:
- **Shopify Customer signup:** wrap in `{% form 'customer', class: 'signup' %}` so the email goes to Customers list with the `accepts_marketing` flag set. Tag with `inkleaf-launch` for segmenting later.
- **Klaviyo embed:** swap the entire form for the Klaviyo embed snippet.
- **Mailchimp embed:** same idea.

Do the same for the second signup form in the Final CTA section.

### 7. Cross-link the pages
- On the **landing page**, the hero's secondary CTA currently scrolls to `#signup` (the email form). Replace one of the primary CTAs with `<a href="/pages/inkleaf-deposit" class="btn btn-accent btn-lg">Reserve for $9.99 →</a>` so high-intent visitors can go straight to checkout.
- On the **deposit page**, the footer's "← Back to InkLeaf" link currently points at `href="index.html"`. Change to `href="/pages/inkleaf"`.
- Any other in-page `href="#features"` style anchors continue to work as-is (they're scrolling within the same page).

### 8. Suppress theme's default header/footer
Both pages have their own nav and footer. If your theme is rendering its global header/footer on top, either:
- Wrap the global header/footer renders in `layout/theme.liquid` with a guard: `{% unless template.suffix == 'inkleaf-launch' or template.suffix == 'inkleaf-deposit' %} ... {% endunless %}`
- Or create a slimmed `layout/landing.liquid` (no header/footer sections, just `<!doctype>`, `<head>`, `{{ content_for_layout }}`) and add `{% layout 'landing' %}` at the top of both sections.

### 9. Smoke-test
- Visit `/pages/inkleaf` on mobile and desktop. Verify hero image loads, signup form submits, all anchor scrolls work.
- Visit `/pages/inkleaf-deposit`. Click "Reserve for $9.99". Confirm you land on Shopify's checkout with the $9.99 line item.
- Check `<title>` and `<meta description>` render correctly in the live HTML for both pages.
- Confirm SSL padlock shows (Shopify gives this free for `.myshopify.com` and custom domains).

---

## Known gotchas

- The hero scrim is layered on top of the image via `position:absolute` + `z-index:-1`. If your theme has its own `z-index` stack (e.g., a sticky announcement bar), you may need to bump the scrim's `z-index` up.
- `object-position: 50% 100% / 50% 95%` on the hero image is hand-tuned to push the tablet to the bottom of the frame. If the section is rendered inside a theme wrapper that adds top padding, the visible crop will shift — re-tune.
- The deposit page's payment badges are inline HTML+CSS (PayPal/Visa/MC/Amex/Discover/Diners). The user may prefer their own brand-screenshot PNG — if they provide one, swap the `.cards` block for `<img src="{{ 'payment-icons.png' | asset_url }}" alt="Accepted payment methods">`.
- `<details>` FAQ accordion is native HTML, no JS needed. Works in every browser, including AMP.
- The signup form's `onsubmit` inline handler is the placeholder. **Remove it before launch** so real submission happens.
- No analytics/pixels included. Add GTM / Meta Pixel / Shopify pixel-manager block as needed.
- No JSON-LD structured data. Add `Product` schema on the deposit page if SEO matters.

## What's intentionally NOT included

- No Shopify product Buy button on the landing page (it's a signup list, not a product page).
- No reviews block (pre-launch, no reviews yet).
- No video (24 raw MP4s exist at `C:\Users\kyu3\inkleaf-photos\Inkleaf\` but were not classified or uploaded).
- No founder portrait (no source photo works — quote stands alone).
- No card-detail fields on the deposit page (Shopify's hosted checkout collects all of that securely on the next step).

---

## After you deploy, report back with:

1. The two live page URLs (`/pages/inkleaf` and `/pages/inkleaf-deposit`).
2. The Shopify variant ID you wired into the deposit form.
3. Which email tool the signup is now connected to (Shopify Customers / Klaviyo / Mailchimp).
4. Any HTML/CSS you had to modify to make Shopify happy — list them so the source files in `C:\Users\kyu3\inkleaf-landing\` can be updated to match.
5. Any visual diffs from the source HTMLs (a screenshot per page is fine).
