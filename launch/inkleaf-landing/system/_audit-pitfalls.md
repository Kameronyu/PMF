# Audit Pitfalls — Inkleaf Landing

Rules a future assistant must follow when extending marketing surfaces. Each rule has a do, a don't, and a WHY so edge cases can be judged on principle.

## 1. Layout / Visual

- **Aspect ratios.** DO probe source dimensions with ffprobe (or equivalent) before sizing a container. DON'T rely on `object-fit: cover` to "make it fit." WHY: cover silently crops; a 16:9 video in a 1:1 slot loses 44% of the frame, often the subject.
- **Above-the-fold fit.** DO keep hero + signup inside 100vh on a 1366x768 laptop, headline `clamp()` capped near 60px desktop. DON'T let type or padding push the CTA below the fold. WHY: the form is the conversion event; scrolling-to-find kills intent.
- **Contrast on marks.** DO check logo/icon background against the section it sits on every time the palette shifts. DON'T assume a transparent PNG works on cream. WHY: warm-on-warm vanishes; the mark must read at thumbnail size.
- **Palette discipline.** DO use the canon: bg `#F4EFE6`, surface `#FAF6EE`, surface-2 `#EDE6D8`, ink `#1A1714`, ink-mid `#5C544A`, accent `#C76A2D`, accent-deep `#A55620`, accent-soft `#F3DCC2`, line `#D8CFC0`. DON'T introduce off-palette greys or pure white. WHY: clinical white breaks the Daylight-Computer warmth that defines the brand.
- **Type stack.** DO use Newsreader for headings (200/400/500, italic for accent words, 200-italic for "thin"), Inter 400-700 for body, JetBrains Mono 10-12px uppercase 0.08-0.12em for eyebrows and spec labels. DON'T mix in a third sans or use mono for paragraphs. WHY: three roles, three faces; more = visual noise.
- **Signup form responsive.** DO stack under 560px, row at or above 560px, terracotta submit. DON'T ship with the inline placeholder `onsubmit`. WHY: real list integration must replace the stub before launch or signups vanish.
- **Comparison tables.** DO cap at 4 rows, plain language, accent-color the win cell. DON'T include rows where competitors lack the feature entirely. WHY: cherry-picking absent features reads as misleading and erodes trust.

## 2. Copy / Tone

- **Em dashes banned.** DO use commas, periods, or colons. DON'T paste em dashes from drafts. WHY: em dashes are an LLM tell; they flatten the warm hand-written voice.
- **Plain English over jargon.** DO write "1 screen" or "Yes/No." DON'T say "single canvas," "unified surface," etc. WHY: jargon signals marketing-speak; the brand is techy-but-warm, not enterprise.
- **No prices in hero.** DO keep the landing hero dollar-free; show full pricing on the deposit page. DON'T leak `$489` or `$999` above the fold. WHY: price-first framing kills the aspirational read; deposit page is where intent is already qualified.
- **Pricing canon.** DO use MSRP `$999`, founder `$489`, deposit `$9.99` everywhere those numbers appear. DON'T round or paraphrase. WHY: inconsistent numbers across pages trigger refund disputes and look amateur.
- **Spec accuracy.** DO quote the spec sheet verbatim (hinge is 180 degrees, not 360). DON'T invent or extrapolate specs the user didn't ask for. WHY: a single wrong spec on a $999 product is a returns-and-reviews problem.
- **Plain headings over metaphor.** DO write "Sturdy parts. No weak links." DON'T write "Engineered like a piece of furniture." WHY: metaphor-only headings make the reader decode; plain language sells.
- **Brand tone reference.** DO aim Eazeye / Daylight Computer. DON'T drift toward Poppi-warm (too playful) or Apple-clinical (too cold). WHY: the wedge is "calm tech you can touch"; both extremes break it.

## 3. Asset Pipeline

- **Classify, upload, swap.** DO classify locally, upload to Shopify CDN, then swap relative paths for CDN URLs. DON'T ship relative paths in production HTML. WHY: relative paths break the moment the file is embedded in a Shopify section or email.
- **No base64 video.** DO link CDN-hosted MP4/WebM. DON'T inline base64 video. WHY: inlined video bloats the HTML, blocks first paint, and is uncacheable.
- **Base64 only for tiny marks.** DO base64 logos at or under 5KB when the email-preview workflow needs offline rendering. DON'T base64 anything larger. WHY: email clients strip remote images; a tiny inlined mark survives, a 50KB hero does not.
- **Classifier manifest is the source of truth.** DO read per-chunk markdown from `.planning/photos/classifications/` and `inkleaf-photos/MANIFEST.md` for slot-to-CDN mappings. DON'T hand-pick CDN URLs from the Shopify admin. WHY: the manifest is the only place slot intent (`hero-a`, `lifestyle-3`) is preserved; bypassing it desyncs copy from imagery.
- **Don't over-spec.** DO ship only the specs the brief requested. DON'T pad spec tables to look thorough. WHY: every extra spec is a future correction; quote the sheet, nothing more.
