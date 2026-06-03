# Audit: Existing Artifacts vs Project-Agnostic Pipeline

Brutal pass. Question asked of every line: "Would this help ship ANY landing page faster, or only InkLeaf?"

## KEEP (process-relevant)

| Item | Note | Source |
|---|---|---|
| Probe image/video dimensions before sizing container | Universal: `object-fit:cover` silently crops; ffprobe / `identify` first | GUARDRAILS (Layout) |
| Aspect-ratio lock on media frames | Prevents CLS on image load — applies to every page | PATTERNS #6 |
| Lock pricing/spec canon before build | Numbers verbatim everywhere; one source of truth doc | GUARDRAILS (Pricing) |
| Above-the-fold fit check (100vh @ 1366x768) | Hero CTA must not scroll — universal conversion guardrail | GUARDRAILS (Layout) |
| Replace dev stubs before deploy (`onsubmit`, `preventDefault`, `setTimeout`) | Pipeline gate: grep for stubs pre-ship | SHOPIFY-HANDOFF + GUARDRAILS |
| CDN URLs only in production HTML; no relative paths | Deploy-time check before Shopify section paste | GUARDRAILS (Asset pipeline) |
| Classifier manifest as source of truth for image slots | Pattern: slot-intent manifest decouples copy from URLs | GUARDRAILS (Asset pipeline) |
| No base64 video; base64 only sub-5KB marks | Asset-size policy generalizes to any handoff | GUARDRAILS (Asset pipeline) |
| Read platform docs FIRST; docs win on conflict | Universal handoff discipline | SHOPIFY-HANDOFF |
| Check `Templates/` for `.json` vs `.liquid` before assuming layout | Probe-target-before-write principle | SHOPIFY-HANDOFF |
| Report-back checklist (live URLs, IDs wired, edits listed, screenshots) | Reusable deploy receipt template | SHOPIFY-HANDOFF |
| Capture variant/product IDs during setup, not after | Pipeline ordering rule | SHOPIFY-HANDOFF |
| Suppress theme chrome via `template.suffix` guard or slim layout | Generalizable Shopify landing pattern | SHOPIFY-HANDOFF |
| Hoist tokens to shared stylesheet at 3rd page | Refactor trigger rule | PATTERNS #1 |

## CUT (design / copy / project-specific)

| Item | Note |
|---|---|
| Specific palette hex values (#F4EFE6 etc.) | InkLeaf brand only |
| Newsreader / Inter / JetBrains Mono trio | Brand choice |
| Eyebrow + h-section + lede triplet HTML/CSS | Design system, not pipeline |
| Pill button `.btn` system + arrow micro-interaction | Component library |
| Inline `.signup` form CSS | Component library |
| Hero badge row, pulse animation | Component library |
| Alternating `.benefit` row + zig-zag rule | Component library |
| Dark `.specs` block, midband CTA, two-col offer + sticky checkout | Page-specific layouts |
| Em-dash ban, "single canvas/unified surface" banned words | Brand voice |
| Eazeye / Daylight Computer tone reference | Brand positioning |
| Comparison-table 4-rows-max rule | Editorial heuristic |
| InkLeaf section maps (Hero/Trust/Problem/Benefits...) | Page IA, not pipeline |
| Pricing numbers ($9.99/$489/$999/51%) | Project data |
| "InkLeaf Founder Reservation" product/handle naming | Project data |
| Hand-tuned `object-position` values, hero z-index notes | Project tweaks |
| Intentionally-excluded list (no reviews, no video...) | Project scope |
