# GUARDRAILS.md — InkLeaf Do/Don't Rules

Front-loaded by impact. Each rule has a do, a don't, and a WHY so you can judge edge cases on principle.

## Pricing & spec accuracy (highest stakes)

- **Pricing canon — verbatim everywhere.** DO use MSRP `$999`, founder `$489`, deposit `$9.99`, and "51% off." DON'T round, paraphrase, or invent a "starting at" variant. WHY: Inconsistent numbers across pages trigger refund disputes, chargebacks, and look amateur on a $999 product.
- **Spec accuracy — quote the sheet.** DO use the exact spec (hinge is 180°, not 360°). DON'T extrapolate, pad, or invent specs the user didn't supply. WHY: A single wrong spec is a returns-and-reviews problem at this price point.
- **Don't over-spec.** DO ship only the specs in the brief. DON'T pad the spec table to look thorough. WHY: Every extra spec is a future correction.
- **No prices in the landing hero.** DO keep `index.html` above-the-fold dollar-free; full pricing lives on `deposit.html`. DON'T leak `$489` or `$999` above the fold. WHY: Price-first framing kills the aspirational read before intent is qualified.

## Brand voice & copy

- **Em dashes banned.** DO use commas, periods, or colons. DON'T paste em dashes from drafts. WHY: Em dashes are an LLM tell and flatten the warm, hand-written voice.
- **Plain English over jargon.** DO write "1 screen" or "Yes/No." DON'T write "single canvas" or "unified surface." WHY: Jargon signals marketing-speak; the brand is techy-but-warm, not enterprise.
- **Plain headings over metaphor.** DO write "Sturdy parts. No weak links." DON'T write "Engineered like a piece of furniture" as the only headline. WHY: Metaphor-only headings make readers decode; plain language sells.
- **Tone reference is Eazeye / Daylight Computer.** DON'T drift toward Poppi-warm (too playful) or Apple-clinical (too cold). WHY: The wedge is "calm tech you can touch"; both extremes break it.
- **Comparison tables: 4 rows max.** DO accent the win cell. DON'T include rows where competitors lack the feature entirely. WHY: Cherry-picking absent features reads as misleading.

## Palette & type discipline

- **Palette is closed.** DO use the canon tokens (`#F4EFE6`, `#FAF6EE`, `#EDE6D8`, `#1A1714`, `#5C544A`, `#C76A2D`, `#A55620`, `#F3DCC2`, `#D8CFC0`). DON'T introduce off-palette greys or pure white. WHY: Clinical white breaks the Daylight-Computer warmth that defines the brand.
- **Three faces, three roles.** DO use Newsreader for headings, Inter for body, JetBrains Mono 10–12px uppercase 0.08–0.12em for eyebrows + spec labels. DON'T add a third sans or use mono for paragraphs. WHY: More faces = visual noise.
- **Contrast on every mark.** DO re-check logo/icon contrast every time it sits on a new section color. DON'T assume a transparent PNG works on cream. WHY: Warm-on-warm vanishes at thumbnail size.

## Layout

- **Above-the-fold fit.** DO keep hero + signup inside 100vh on a 1366×768 laptop; cap headline near 60px desktop via `clamp()`. DON'T let type or padding push the CTA below the fold. WHY: The form is the conversion event; scroll-to-find kills intent.
- **Aspect ratios before sizing.** DO probe source image dimensions before sizing a container. DON'T rely on `object-fit: cover` to "make it fit." WHY: Cover silently crops; a 16:9 video in a 1:1 slot loses 44% of the frame, often the subject.
- **Signup form is responsive.** DO stack under 560px, row at ≥560px, terracotta submit. DON'T ship with the placeholder `onsubmit` stub. WHY: Real list integration must replace the stub or signups disappear.

## Asset pipeline

- **CDN URLs only in production HTML.** DO classify locally, upload to Shopify CDN, then swap relative paths for CDN URLs. DON'T ship relative paths. WHY: They break the moment HTML lands in a Shopify section or email.
- **Classifier manifest is the source of truth.** DO read slot-to-CDN mappings from `.planning/photos/classifications/` and `inkleaf-photos/MANIFEST.md`. DON'T hand-pick URLs from Shopify admin. WHY: Slot intent (`hero-a`, `lifestyle-3`) only lives in the manifest; bypassing it desyncs copy from imagery.
- **No base64 video, ever.** DO link CDN-hosted MP4/WebM. DON'T inline base64 video. WHY: Inline video bloats HTML, blocks first paint, and is uncacheable.
- **Base64 only for sub-5KB marks.** DO inline tiny logos when the email-preview workflow needs offline rendering. DON'T base64 anything larger. WHY: Email clients strip remote images, so a tiny inlined mark survives, but a 50KB hero does not.
