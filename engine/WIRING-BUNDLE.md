# WIRING-BUNDLE — the PMF engine, as a drop-in for a builder

**Read this first.** This folder (`engine/`) is the **non-marketing wiring** of the PMF system:
the deterministic bricks (fetch / clean / funnel / asset / aggregate), the firing layer
(validators + router + DR-context injectors), the deploy integrations, and the contracts they
share. A builder wires the marketing prompts *on top* of these rails. Everything here is **proven**:
`bash engine/contracts/h6-all.sh` → **14/14 green**.

## What's in the bundle
```
engine/
  bricks/         deterministic CLI capabilities (fetch, clean, dedupe, revenue, funnel-*, asset-*, aggregate, audit-*)
  bricks/lib/     shared libs (embed, trends-parse, adlib-graphql)
  bricks/asset/   python asset tools (probe, probe_video, frame-grab, sample_montage, video-assemble) — use bundled ffmpeg
  hooks/          firing layer: guard-marketing, route, validate-*, inject-*-dr
  integrations/   surge / shopify / cloudflare / klaviyo / cdp + lib-creds
  contracts/      the INDEX + proof (see below) + enums.json + schemas/
  _fixture/       smoke inputs (committed) incl. dr-knowledge/ stubs
  package.json · requirements.txt · DEPENDENCIES.md · FIRING-MANIFEST.md · WIRING-BUNDLE.md
```

## The index — where to look
| you want… | read |
|---|---|
| every capability + its I/O, run command, deps, health | **`contracts/REGISTRY.json`** (26 capabilities; `.md` is the human view) |
| what to REUSE vs re-author (non-marketing vs marketing) | **`contracts/REUSE-INDEX.md`** |
| how the firing layer registers + fires + override points | **`FIRING-MANIFEST.md`** |
| what to provision (node/py/CLI + versions) | **`DEPENDENCIES.md`** |
| closed vocabularies + record schemas | **`contracts/enums.json`**, `contracts/schemas/` |
| the engineering failure corpus (what broke + fixes) | **`contracts/ERROR-NOTES.md`** |
| how this bundle was proven | **`contracts/21-CLOSEOUT-SUMMARY.md`** + run `contracts/h6-all.sh` |

## Invocation contract
Every capability is a CLI you call directly — `REGISTRY.json` gives the exact `run` line + `io` per capability. They read/write under a run-space `runs/<space>/…` you choose. The firing hooks register per `FIRING-MANIFEST.md`.

## Declared external INPUTS (the builder supplies at wire-time — not vendored)
1. **DR knowledge dir** — `--dr-dir=<path>` / `$DR_DIR` for the `inject-*-dr` bundlers (the repo's old content is stale; supply fresh).
2. **Run-space root** — the `runs/<space>/` the bricks read/write.
3. **Creds** — surge (`$SURGE_EMAIL`/`$SURGE_PW`), and shopify/cloudflare/klaviyo via `--creds`/env (`lib-creds.js`). None committed.

## Health (P21-H6, 2026-06-26) — 26 capabilities
**22 working · 1 dry-run-verified (surge-deploy) · 1 partial (chrome-cdp, env-dependent) · 2 untested-but-deferred (reddit-extract R6, crowdfund-fetch R7).** Zero unexplained-untested. The whole firing layer is smoke-proven (`h6-firing.sh`). Caveats per entry in REGISTRY (e.g. funnel-assemble's live LP-render hop → R7).

## NOT in the bundle (by design)
- **The marketing layer** — Finder / Roster / Dumper / Space-Classifier / Market-Selection / Router / Section-Analyzer / Funnel-Architect / Copywriter prompts, `definitions.md`, `workflow.md`, `marketing-lens/*` (REUSE-INDEX §5). These are re-authored and plugged in on top.
- **The stale DR knowledge CONTENT** — external input (above); only stub fixtures ship here.

(The LP Builder copy→HTML step is NOT excluded-and-forgotten — it's a real pipeline step tracked under "Downstream implementer steps" below.)

## Downstream implementer steps to fold in (low-fidelity today — DO NOT LOSE)
These turn the bundle's prep/deploy rails into a shipped funnel. They are real STEPS in the pipeline even though they aren't hardened engineering bricks yet — keep them on the roadmap:
- **LP Builder (copy → HTML)** — takes the Copywriter's copy + the asset spec (`asset-classify-build` → `images.json`/`videos.json`/`IMAGES.md`) and implements the landing-page HTML. Today it is a **marketing-decision agent and LOW-FIDELITY**; it's a judgment step (layout/design) so it currently lives in the marketing/agent layer. It MUST be wired in as a pipeline step (and hardened into reusable scaffolding) for an end-to-end build. Decision record + worked example: `runs/arduview/_marketing-decisions/lp-builder.md`; output `runs/arduview/site/` (locked style: `runs/arduview/site/STYLE-LOCK.md`).
- **Shopify implementer** — the CODE is in the bundle (`integrations/shopify/shopify-deploy-funnel.js` + `shopify-upload-assets.js`, REGISTRY `shopify-deploy`), but the operational implementer runbook lives outside it: **`runs/arduview/_tooling/SHOPIFY-KLAVIYO-DEPLOY.md`** — fold it in (or link it) so the deploy step is reproducible. SECURITY: a committed creds file sits beside it (`runs/arduview/_tooling/.shopify-creds.json`) — move to env/`--creds` (same seam as surge) before any reuse.

## Consolidation status (honest)
The code, index, firing proof, and portability fixes are done and committed. The committed test
fixtures still live partly at repo-root `runs/_fixture/` (not yet under `engine/_fixture/`): a clean
physical fold-in needs a few bricks de-coupled from the hardcoded `runs/<space>/…` convention
(e.g. `funnel-claim-tally` resolves its store as `runs/<space>/funnels`), so it is a small
brick-interface change, not a pure `git mv`. Tracked in `contracts/WIRING-BUNDLE-HANDOFF.md`.
Until then, the bundle = `engine/` + the `runs/_fixture/` test inputs; both are needed to run `h6-all.sh`.
