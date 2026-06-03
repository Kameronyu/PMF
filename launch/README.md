# launch — raw import, to be reconciled

The InkLeaf Shopify + Klaviyo + landing-page build/deploy machinery, imported raw from the external build folders on 2026-06-02. **Not cleaned yet.** This becomes the **reusable new-store setup module** (the Phase-6 launch-ops layer): one product-agnostic runbook any store fills with its inputs, plus an agent that drives the browser through it while a human handles the gates.

## What's here

- `inkleaf-launch/` — the funnel setup process. `LAUNCH-RUNBOOK.md` (Shopify deposit + Klaviyo flow + landing page; already ~90% product-agnostic, InkLeaf is the `‹reference›` example), `LAUNCH-INPUTS.md` (the per-launch inputs), `IMAGES.md`/`VIDEOS.md` (CDN manifests), plus status/tasks/copy notes.
- `inkleaf-landing/system/` — the landing-page build system: `BUILD-PLAYBOOK`, `DEPLOY-PLAYBOOK`, `SPEC-TEMPLATE`, `PATTERNS`, `GUARDRAILS`, `SHOPIFY-HANDOFF-TIGHT`, and 6 `_audit-*` drafts (superseded).
- `inkleaf-landing/` — the LP HTML (`index.html`, `deposit.html`, `preview.html`) + `assets/` (hero video, photos).
- `inkleaf-landing/SHOPIFY-HANDOFF.md` — the noisy 2192-word original.

## Known mess (reconcile later)

- Shopify deploy is documented ~4× (`SHOPIFY-HANDOFF` → `-TIGHT` → `DEPLOY-PLAYBOOK` + the runbook). Collapse to one deploy spec.
- Two input files (`SPEC-TEMPLATE` for the build, `LAUNCH-INPUTS` for the funnel). Collapse to one input contract.
- The 6 `system/_audit-*.md` are confirmed superseded drafts — delete on cleanup.
- Generalize: demote InkLeaf values to a worked instance; the process stays product-agnostic.

## Left external (not imported)

- `inkleaf-photos/` — 5.8 GB raw photo pipeline. Media serves from the Shopify CDN; URLs live in `IMAGES.md`/`VIDEOS.md`.
- `inkleaf-theme-push/` — live Shopify theme working copy (deploy artifact).
