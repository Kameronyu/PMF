# Future-Agent Raw Material — what already exists for the not-yet-built agents

Purpose: when a future session builds one of these agents, this is the inventory of raw material (specs, seeds, run-output exemplars, tooling) that **already exists on disk**, so the session doesn't rediscover or rebuild context. Written after a git-verified recovery audit (2026-06-05).

**Recovery verdict: ZERO unrecoverable loss.** The Phase-19 cleanup deleted only *tracked* files (all git-recoverable) plus the intentional e-ink quarantine. No agent-seed context was committed-then-lost. The one earlier "genuinely gone" suspicion — `agents/implementation-notes.md` — was a **false alarm**: it exists on disk and is git-tracked (`05fd71e`, `3d3aeaa`). The only confirmed untracked loss was `STRATEGY-DISCUSS-HANDOFF.md`, an orphan strategy handoff already classified "work complete."

> Operator owns every prompt/agent spec below. This doc only inventories raw material — it does not spec anything.

## image-analyzer / image classification  — Phase 16, largely BUILT
- `prompts/_specs/image-classifier-brick.md` — brick spec (relevance-bucket + role-classify)
- `.claude/skills/asset-classify/SKILL.md` — orchestrator skill
- `runs/arduview/asset-classify/` — `IMAGES.md`, `images.json`, `IMAGE-PLAN.md`, `records/`
- `.planning/phases/16-asset-classifier-image-and-video-bricks/` — RESEARCH, PATTERNS, FORMALIZE-HANDOFF, plans 16-01..06 (untracked)
- Caveat: shipped WITHOUT a validated I/O contract — refinement needs the contract, not a rebuild.

## video-analyzer  — Phase 16, bricks exist
- `prompts/_specs/image-classifier-brick.md` — video bricks (2v/3v/4v) inlined per D-13
- `runs/arduview/asset-classify/VIDEO-ANALYSIS.md` — 748-line per-clip beat-sheet (output exemplar)
- `marketing-lens/prompts/11-comprehend-video.md`
- `tools/asset/probe_video.py`, `tools/asset/video-assemble.py`, `tools/asset/frame-grab.py`
- `runs/arduview/HERO-VIDEO.md`, `runs/arduview/asset-classify/videos.json`

## product-video-strategist  — no standalone seed (by design: fold into Funnel-Architect)
- No standalone spec ever existed. Design decision: fold into Funnel-Architect, which reads `images.json` / `videos.json`. Ref: `.planning/POST-RUN-HARDENING-PLAN.md:41`.
- Raw material = the asset manifests (`images.json`, `videos.json`) + `VIDEO-ANALYSIS.md`.

## competitor-visual-branding  — Phase 18, 0 plans, design only
- ROADMAP Phase 18 brick-string: pick competitors (similar NTP) → screenshot-dump → visual-analyze (detail enough to recreate look/feel) → branding-decide → DESIGN-DIRECTION. Also `POST-RUN-HARDENING-PLAN.md:44`.
- Tooling already built: CDP screenshot bridge in `runs/arduview/_tooling/` (drive Windows Chrome from WSL).
- No agent spec yet — operator owns it.

## shopify-implementation skill  — REUSABLE SEED EXISTS (built 2026-06-09)
- **Working, run-verified deploy toolkit:** `runs/arduview/_tooling/SHOPIFY-KLAVIYO-DEPLOY.md` (the whole recipe) + scripts:
  - `cdp.cjs` (raw-CDP driver for the user's real Chrome — the only browser-gated steps)
  - `shopify-upload-assets.js` (images/video → Shopify Files CDN map)
  - `shopify-deploy-funnel.js` (HTML funnel → slim layout + Liquid page templates + assets, pushed via Theme Asset API, pages created, checkout + Klaviyo wired). Config-driven; generic for any funnel.
- Proves it end-to-end on Arduview: live at `https://j873ra-dj.myshopify.com/pages/arduview` (+ `/pages/arduview-deposit`).
- The old InkLeaf `git show 0260a1d:launch/inkleaf-landing/SHOPIFY-HANDOFF.md` is **OBSOLETE** (predates Dev Dashboard; assumed assets pre-hosted). The new doc supersedes it.

## klaviyo skill  — REUSABLE SEED EXISTS (built 2026-06-09)
- Covered by the same `SHOPIFY-KLAVIYO-DEPLOY.md` (step C): list creation via API, form wiring via the client subscriptions endpoint (public key, no private key, CORS-open, 202). Arduview list `SPniwZ` in account `UguyM6`.
- **Welcome-flow clone is manual** (Klaviyo flow builder is not API-cloneable; canvas automation nearly corrupted the live InkLeaf flow — documented as a hand step).

## gap-analysis step  — conceptual framework, no agent
- Framed in `workflow.md:167,306` + `.planning/phases/01-CONTEXT.md:174` + `02-CONTEXT.md:245` (bet_type × niche × durability synthesis at Gate 2).
- Recoverable earlier framing: `git show 3d3aeaa:flow.md` (deprecated workflow diagram).
