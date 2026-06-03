# InkLeaf — Video CDN URLs

Uploaded to Shopify Files (store `swcdce-b3` / `foldinkleaf`) on 2026-05-29.

> NOTE: Shopify serves videos from a HASHED path (`/videos/c/o/v/{hash}.mp4`), NOT the
> predictable `/files/{name}.mp4` pattern that images use. Use these exact URLs.

| File | Spec | CDN URL |
|---|---|---|
| inkleaf-hero.mp4 | 12.2s · 1920×1080 · captioned, no end card | https://cdn.shopify.com/videos/c/o/v/5db2a08dcee54c0c85aeae793c2726ea.mp4 |
| compare-tablet.mp4 | 2.5s · 1080×1350 (4:5) · 1.125× speed, graded | https://cdn.shopify.com/videos/c/o/v/856dd0b4d4d9464f9bb384114f0072d8.mp4 |
| compare-notebook.mp4 | 2.5s · 1080×1350 (4:5) · 1.25× zoom, 2× slowmo, graded | https://cdn.shopify.com/videos/c/o/v/00cad536d7e34f5186a02b8ebd1fbeb3.mp4 |

## Poster frame
`inkleaf-hero-poster.jpg` is local at `C:\Users\kyu3\inkleaf-landing\assets\inkleaf-hero-poster.jpg`
(NOT yet uploaded — upload it too if you want a poster on the <video> tag).

## Embed snippet (autoplay muted, loop-friendly)
```html
<video autoplay muted loop playsinline
       poster="https://cdn.shopify.com/.../inkleaf-hero-poster.jpg"
       style="width:100%;height:auto;display:block">
  <source src="https://cdn.shopify.com/videos/c/o/v/5db2a08dcee54c0c85aeae793c2726ea.mp4" type="video/mp4">
</video>
```
