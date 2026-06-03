# DEPLOY PLAYBOOK — Shopify

Imperative deploy steps for porting a built landing page onto a Shopify storefront. Do not paraphrase the docs. If anything below conflicts with the docs, the docs win.

---

## Read these docs FIRST

Read each before touching code. These define the contracts every step below depends on.

1. Theme architecture — https://shopify.dev/docs/storefronts/themes/architecture
2. Page templates — https://shopify.dev/docs/storefronts/themes/architecture/templates/page-template
3. JSON templates — https://shopify.dev/docs/storefronts/themes/architecture/templates/json-templates
4. Sections (`{% schema %}`, presets, settings) — https://shopify.dev/docs/storefronts/themes/architecture/sections
5. Layouts (`theme.liquid`, slim landing layouts) — https://shopify.dev/docs/storefronts/themes/architecture/layouts
6. Liquid `{% form %}` tag — https://shopify.dev/docs/api/liquid/tags/form
7. Cart Ajax API (`/cart/add`) — https://shopify.dev/docs/api/ajax/reference/cart
8. `asset_url` filter — https://shopify.dev/docs/api/liquid/filters/asset_url
9. `stylesheet_tag` filter — https://shopify.dev/docs/api/liquid/filters/stylesheet_tag
10. `template.suffix` object — https://shopify.dev/docs/api/liquid/objects/template
11. Online Store 2.0 conventions — https://shopify.dev/docs/storefronts/themes/os20

Before writing any code, open `Templates/` in the theme editor. If you see `.json` files, follow the JSON+section flow below. If you see only `.liquid`, collapse steps 3 and 4 into a single `templates/page.{{SUFFIX}}.liquid` containing the section markup directly.

## Deploy Steps

1. Create the reservation product. Admin → Products → Add: title `{{RESERVATION_PRODUCT_TITLE}}`, price `{{DEPOSIT_AMOUNT}}`. Mark non-shippable / digital so checkout skips shipping. Capture the variant ID from the admin URL (or GraphQL); paste into a scratchpad — you will reference it twice.

2. Create the pages. Admin → Pages → New: handle `{{LANDING_HANDLE}}` with template suffix `{{LANDING_SUFFIX}}`; handle `{{DEPOSIT_HANDLE}}` with template suffix `{{DEPOSIT_SUFFIX}}`. Leave title and body blank — the section provides content.

3. Create the JSON templates. Themes → Edit code → `Templates/` → add `page.{{LANDING_SUFFIX}}.json` and `page.{{DEPOSIT_SUFFIX}}.json`. Each contains a single `"main"` entry in `sections` and `order`, with `type` matching the section filename.

4. Create the Liquid sections. `Sections/` → add `{{LANDING_SUFFIX}}.liquid` and `{{DEPOSIT_SUFFIX}}.liquid`. Paste the body of each HTML file with `<!doctype html>`, `<html>`, the entire `<head>...</head>`, opening `<body>`, closing `</body>`, and closing `</html>` stripped. The theme layout provides those wrappers.

5. Port HTML to Liquid. Decide CSS placement: for a short-lived launch, keep the `<style>` block inline at the top of each section. For a long-lived page, extract to `assets/{{LANDING_SUFFIX}}.css` and reference via `{{ '{{LANDING_SUFFIX}}.css' | asset_url | stylesheet_tag }}`. Pick one mode and apply consistently to both sections.

6. Append a minimal `{% schema %}` block to each section (`name`, empty `settings`, single `preset`) so the section is valid and selectable in the theme editor.

7. Wire the deposit form. In `sections/{{DEPOSIT_SUFFIX}}.liquid` replace the placeholder variant ID on the hidden `id` input with the variant ID captured in step 1, or use `{{ products['{{RESERVATION_PRODUCT_HANDLE}}'].variants.first.id }}`. Form action stays `/cart/add`, method `post`.

8. Wire the signup form. Replace every placeholder `onsubmit="event.preventDefault();..."` on hero and final-CTA signup forms with the real integration: Shopify Customer (`{% form 'customer', class: 'signup' %}` with a hidden `tags={{LIST_TAG}}`), Klaviyo embed, or Mailchimp embed. Confirm with the user which list before wiring. Wire both forms with the same integration.

9. Remove dev-only JS stubs. Grep every section for `e.preventDefault()`, `event.preventDefault()`, `setTimeout`, and inline `onsubmit` handlers. Remove each so the POST actually fires and Shopify redirects to `/checkout`. Do not add a Shop Pay button manually — Shop Pay surfaces automatically at checkout.

10. Suppress theme header and footer on these two pages. The sections ship their own nav and footer. Either wrap the renders in `layout/theme.liquid` with `{% unless template.suffix == '{{LANDING_SUFFIX}}' or template.suffix == '{{DEPOSIT_SUFFIX}}' %} ... {% endunless %}`, or create `layout/landing.liquid` and add `{% layout 'landing' %}` to both sections. Pick one and apply consistently.

11. Decide asset URLs. Do NOT re-upload large media. Large JPGs and videos already on the Shopify CDN stay at their `https://cdn.shopify.com/s/files/...` URLs hardcoded in the HTML. Tiny brand marks and payment badges (≤10 KB) stay base64-inlined. Only the section CSS (if extracted in step 5) goes into `assets/` via `asset_url`.

12. Fix cross-page links. Replace any `href="index.html"` with `href="/pages/{{LANDING_HANDLE}}"`. Replace any `href="deposit.html"` (or equivalent) with `href="/pages/{{DEPOSIT_HANDLE}}"`. Add a direct deposit CTA on the landing hero so high-intent traffic skips the signup form: `<a href="/pages/{{DEPOSIT_HANDLE}}">{{DEPOSIT_CTA_LABEL}}</a>`.

13. Smoke test live URLs. `/pages/{{LANDING_HANDLE}}` loads with hero visible above the fold at 375 px and 1180 px. Hero and final-CTA signup forms post to the real list and confirm. In-page anchors scroll smoothly. `/pages/{{DEPOSIT_HANDLE}}` CTA click lands on Shopify's hosted checkout with a single line item at `{{DEPOSIT_AMOUNT}}` and Shop Pay express visible. SSL padlock present on both pages. Theme header and footer NOT rendering on either page.

14. Report back. Deliver: the two live page URLs; the variant ID used; which email integration was wired; any HTML/CSS diffs applied during port so the source files can be updated to match; one screenshot per page at 375 px and 1180 px.
