# Phase 21 — Engine Wiring Hardening · CONTEXT

**Plan THIS phase from `engine/contracts/`, NOT from `.planning/ROADMAP.md`** (the roadmap is frozen/untrusted pending the marketing rebuild). Engine-only work; the marketing firewall (`engine/contracts/off-limits.json`) lists what must NOT be touched.

## Source of truth (read these first)
- `engine/contracts/HARDENING.md` — the H0–H5 plan (each phase = fix → smoke-test on fixture → flip REGISTRY health green → atomic commit).
- `engine/contracts/RETRIEVAL-FAILURES-arduview.md` — the punch-list, ordered by leverage (free re-runs → code fixes → escalate-as-builds).
- `engine/contracts/ERROR-NOTES.md` — bug-level detail + anchors.
- `engine/contracts/REGISTRY.md`/`.json` — capability map; `health` flips from `untested` to `working`/`broken` here.
- `engine/contracts/enums.json` + `schemas/` — the contracts to fix against (H0 repoints validators to import these).

## Scope (in)
1. **Free re-runs** (code already fixed, data stale): `funnel-store.js` 6a discard (`bbff2ff`) → rebuild `_index.json` → re-run analyzer for `belief_kind` (`35581d4`).
2. **Code fixes** (blast-radius order): Trends deferred-XHR · adlib selector calibration · `validate-analyzer.js` wiring + closed enums in the analyzer prompt · `transformation`/`niche`/`routing_flag` plumbing into the funnel package · 404-content gate in `funnel-clean` · `qualifying_creatives` aggregator · revenue `monthly_visits` feed · KS GraphQL fallback · `sophistication` normalization · cred `--creds` parameterization (H0 contract extraction precedes these).
3. **Smoke** each `engine/bricks/*` + `engine/integrations/*` capability + `.claude/skills/reddit-extract/dump.mjs` (VOC retriever) on a fixture.
4. **E2E coherence** on `runs/_fixture/` with golden agent outputs (no marketing agent in loop).

## Scope (out — escalate as rebuild-time BUILDS, not hardening)
Step 3 VOC stage (Bucketer→Ladderer→Language; the reddit *retriever* is smoke-only here) · spend-validation lift · `source_routing` vocab (contract-gated) · asset reshoots.

## Inputs / tools
- Live re-run targets + smoke fixtures: `runs/arduview/` (and `runs/_fixture/`).
- As-ran reference: `/mnt/c/Users/kyu3/Claude/Projects/pmf3/build-base/reference/as-ran-repo/`.
- Operator's durable automation/wiring-building skill (dropped in next session) — may drive execution in place of `/gsd-execute-phase`.

## Planning note
One plan per H-item (or per capability cluster). Each plan's success = the smoke test passes AND the REGISTRY health entry flips green. Do the free re-runs first (they recover ~24+43 nulled values at zero code cost and de-risk the rest).
