# BUILD PLAYBOOK

Imperative steps the builder agent executes in order. Do not skip phases. Do not improvise outside the spec.

---

## PHASE 1 — SETUP

1. Read `SPEC-TEMPLATE.md` filled in by the user. Parse every field listed under Brand, Product, Sections, CTAs, Assets, Destination.
2. Flag every missing or empty required field as a `BLOCKER:` line. Halt and surface blockers to the user. Do not proceed to IMPLEMENT until all blockers are resolved.
3. Probe every asset listed in `assets.hero_media` and `assets.image_manifest`. Run `ffprobe` on video and `identify` (ImageMagick) or equivalent on images. Record intrinsic width, height, and exact aspect ratio (e.g., `1920x1536 → 5:4`). Do NOT trust the spec's aspect-ratio claim — verify it.
4. If an asset is missing from disk, flag as `BLOCKER:` and halt.
5. Lock the pricing canon: copy `cta.pricing_canon` into a `:root` CSS custom-property block or a top-of-file constants block. Every price string on the page reads from this constant. Reject any hardcoded number elsewhere.
6. Confirm the spec sheet (`product.spec_sheet`) matches the source-of-truth doc the user references. Copy errors here compound across the page.

## PHASE 2 — IMPLEMENT

7. Create file structure: `index.html` at root, `./assets/` for local images and CSS, `./preview.html` for the multi-viewport iframe grid. Add additional HTML files for sibling pages (e.g., `deposit.html`, `thanks.html`) if `sections.order` implies them.
8. Build mobile-first at 375 px. Every section must reflow cleanly at 375 before any `@media (min-width: 840px)` rule is written. Do not write desktop CSS first.
9. Build the hero section. Set the media container's `aspect-ratio` to exactly the value probed in step 3. Use `object-fit: cover` only after the aspect ratio is locked. Tune the h1 via `clamp()`, not via padding hacks.
10. Enforce above-the-fold at laptop `100svh` minus nav height: the h1 + sub-headline + primary CTA (and signup form if present) must all be visible at 1366x768. Tune `clamp()` on h1 size to fit; never reduce padding to force-fit.
11. Build remaining sections in the order specified by `sections.order`. Use the headline/lede/body verbatim from `sections.copy`. Do not invent copy.
12. Hoist shared CSS tokens (`--bg`, `--accent`, etc.) to a single `:root` block at the top of the stylesheet. If you find yourself repeating a token on the third page, hoist immediately.
13. Re-check logo contrast every time a section background changes. Swap to the monochrome logo variant where the wordmark would clash.
14. Decide base64 vs CDN per asset: assets ≤10 KB (logos, icons, payment marks) inline as base64; photos and video reference the `assets.cdn_base` URL in production. Keep both paths viable so the email-zip bundle still renders.
15. Wire every cross-file link. Every `href` to a sibling page must resolve. Every in-page anchor (`#features`, etc.) must point at an existing `id`.
16. For form integrations, leave a clearly-flagged stub if the destination platform's wiring happens during DELIVER (e.g., Shopify variant ID). Mark with `<!-- REMOVE BEFORE LAUNCH -->` and a placeholder token like `{{VARIANT_ID}}`.

## PHASE 3 — VERIFY

17. Aspect-ratio match: open every media container in DevTools and confirm the computed `aspect-ratio` equals the probed intrinsic ratio. No silent cropping.
18. Em-dash and banned-glyph grep: run a search across all HTML files for every glyph in `brand.banned_glyphs`. Replace each hit. Re-run until zero hits.
19. Above-the-fold check at 1366x768: hero h1 + sub + primary CTA visible without scroll. Re-tune `clamp()` if not.
20. Pricing-canon consistency: grep for every numeric string in `cta.pricing_canon` (e.g., `$799`, `$50`). Confirm each appears only as a reference to the constants block, never as a hardcoded literal in section copy.
21. Plain-language audit: grep for jargon tokens the user flagged in `sections.copy` notes (e.g., "canvas", "modality"). Rewrite each in plain language.
22. Link audit: walk every `href` in every HTML file. Confirm sibling-page links resolve and in-page anchors target existing IDs. Fix broken links before declaring done.
23. Generate `preview.html` if not already present: an iframe grid pointing at `index.html` at each width in `destination.viewport_targets`. Open it. Confirm no horizontal scroll, no clipped CTAs, no broken images, no leaked placeholder copy at any width.

## PHASE 4 — DELIVER

24. Confirm `preview.html` is current and passes at all viewport widths.
25. Decide asset-URL mode based on `destination.platform`:
    - For production CDN handoff: confirm every large media URL points at `assets.cdn_base`.
    - For email handoff: swap CDN URLs to relative `./assets/` paths and bundle.
26. Email-zip bundle: zip `index.html` + sibling HTML + `./assets/`. Open the zip on a fresh machine path; confirm the page renders fully from `file://` with the network disabled. No external dependency may break it.
27. Final delivery message lists: every file shipped, the variant/IDs captured (if any), the asset-URL mode chosen, and any deferred wiring the deploy phase must complete.
