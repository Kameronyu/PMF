# Deploy audit — Shopify handoff friction

The existing `SHOPIFY-HANDOFF.md` is ~230 lines and mixes generic Shopify theme tutorial content with project-specific wiring. The generic parts (what a JSON template is, what `asset_url` does, what a section schema looks like) belong in the docs; the project-specific parts (variant ID swap, form action wiring, theme suppression on these specific suffixes, asset URL conventions used by this build) are the steps the builder must actually do. Below is the deduplicated, ordered deploy playbook.

## Read these FIRST (canonical Shopify dev docs)

Do not paraphrase these — read them, then come back. If anything in this playbook conflicts with these docs, the docs win.

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

Before touching code, check `Templates/` in the theme editor: if you see `.json` files, follow the JSON+section flow below; if you only see `.liquid`, collapse steps 3–4 into a single `templates/page.<suffix>.liquid` containing the section markup directly.

## Deploy steps the builder follows to prevent re-asking the user

1. Create product `InkLeaf Founder Reservation`, price `$9.99`, mark **non-shippable / digital** so checkout skips the shipping step; capture the variant ID from the admin URL (or GraphQL) — paste it into a scratchpad, you will need it twice.
2. Admin → Pages → create two blank pages: handle `inkleaf` with template suffix `inkleaf-launch`; handle `inkleaf-deposit` with template suffix `inkleaf-deposit`. Title and body blank — content comes from the section.
3. Themes → Edit code → `Templates/` → add `page.inkleaf-launch.json` and `page.inkleaf-deposit.json`, each with a single `"main"` section in `sections` and `order`, where `type` matches the section filename.
4. `Sections/` → add `inkleaf-launch.liquid` and `inkleaf-deposit.liquid` by pasting in the body of the corresponding HTML file with `<!doctype html>`, `<html>`, the entire `<head>...</head>`, opening `<body>`, closing `</body>`, and closing `</html>` stripped — the theme layout provides those.
5. Decide CSS placement: for a one-shot launch keep the `<style>` block inline at the top of each section (simplest, no second commit); for a long-lived page extract to `assets/inkleaf-launch.css` + `assets/inkleaf-deposit.css` and reference via `{{ 'inkleaf-launch.css' | asset_url | stylesheet_tag }}`. Pick one and be consistent across both sections.
6. Append a minimal `{% schema %}` block to each section (`name`, empty `settings`, single `preset`) so the section is valid and selectable.
7. Wire the deposit form: in `sections/inkleaf-deposit.liquid` replace `REPLACE_WITH_SHOPIFY_VARIANT_ID` on the hidden `id` input with the variant ID from step 1 (or `{{ products['inkleaf-founder-reservation'].variants.first.id }}`); the form action stays `/cart/add`, method `post`.
8. Strip the dev-only JS stubs: remove `e.preventDefault()` and the `setTimeout(...)` block from the deposit form's inline `<script>` so the POST actually fires and Shopify redirects to `/checkout` (Shop Pay surfaces there automatically — do not add a Shop Pay button manually).
9. Wire the landing signup: replace the placeholder `onsubmit="event.preventDefault();..."` on both signup forms (hero + final CTA) with one real integration — Shopify Customer (`{% form 'customer', class: 'signup' %}` with a hidden `tags=inkleaf-launch`), Klaviyo embed snippet, or Mailchimp embed. Confirm with the user which list, then do both forms with the same integration.
10. Suppress the theme's global header and footer on these two pages — the sections ship their own nav and footer. Wrap the renders in `layout/theme.liquid` with `{% unless template.suffix == 'inkleaf-launch' or template.suffix == 'inkleaf-deposit' %} ... {% endunless %}`, or create `layout/landing.liquid` and add `{% layout 'landing' %}` to both sections.
11. Fix cross-page links: change the deposit footer's `href="index.html"` to `href="/pages/inkleaf"`; replace one hero primary CTA on the landing page with `<a href="/pages/inkleaf-deposit" class="btn btn-accent btn-lg">Reserve for $9.99 →</a>` so high-intent traffic skips the email list.
12. Asset URL convention — do NOT re-upload anything large: all hero/lifestyle/detail JPGs are already on the Shopify CDN at `https://cdn.shopify.com/s/files/1/0864/9234/8609/files/...` and hardcoded in the HTML; videos use `https://cdn.shopify.com/videos/c/o/v/{hash}.mp4`; tiny brand marks (Snoo, Kickstarter wordmark, payment-method badges) are base64-embedded inline in the HTML and stay inline. Only the page CSS (if extracted in step 5) and an optional `payment-icons.png` go into `assets/`.
13. Smoke test live URLs: `/pages/inkleaf` loads with hero image visible above the fold at 375 px and 1180 px; the hero and final-CTA signup forms post to the real list and confirm; in-page anchors (`#features`, etc.) scroll smoothly; `/pages/inkleaf-deposit` "Reserve for $9.99" click lands on Shopify's hosted checkout with a single $9.99 line item and Shop Pay express visible; SSL padlock present on both; theme header/footer NOT rendering on either.
14. Report back with: the two live page URLs, the variant ID used, which email tool the signup is wired to, any HTML/CSS diffs you had to apply (so the source files in `C:\Users\kyu3\inkleaf-landing\` can be updated to match), and one screenshot per page at mobile (375 px) and desktop (1180 px).
