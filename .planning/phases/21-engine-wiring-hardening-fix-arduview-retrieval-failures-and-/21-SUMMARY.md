# Phase 21 — Engine Wiring Hardening · SUMMARY

**Date:** 2026-06-25 · **Mandate:** harden the technical engine without touching marketing strategy.
**Planned from:** `engine/contracts/HARDENING.md` (H0–H5) + `RETRIEVAL-FAILURES-arduview.md`. Engine-only;
`off-limits.json` honored (no marketing-strategy content edited; the two coordinate-file edits were
firing-mechanics wiring only). Recovery tag: `m1-arduview-retro`.

## What's GREEN (verified this session)

| Item | Capability | Verification | Commit |
|---|---|---|---|
| Free re-run 1 | `funnel-store` | 24/24 6a fields recovered (null→populated), v1↔v2 diff | `a2209b4` |
| Free re-run 2 | `embeddings-rag` | index rebuilt; recovered 6a propagate 43/43; 43 vectors @1024 | (gitignored derived) |
| **H0** | `firing-hooks` (validators) | 4 validators import `enums.json`; **8/8 exit codes identical** pre/post; asset schema completed; `enums.md` generator | `1cee7b2` |
| **H1** | `firing-hooks` (analyzer) | `validate-analyzer` now FIRES: route.js `*-beliefs.json` rule + SKILL orchestrator step; fixture **good→0 / bad→2** | `91acec7` |
| **H2a** | `funnel-score` | required-field check at CLI boundary; 5-case smoke (valid passes, wrong/malformed reject, alias recovered) | `30415ef` |
| **H2b** | `funnel-clean` | `#funnel-clean-md-headings` was already fixed `3d70cb4` (P20); re-verified (md 3 / html 2 `[SECTION]`); ERROR-NOTES corrected | `75a25e5` |
| **H3-Meta** | `meta-ad-fetch` | `#adlib-selectors` fixed via `/api/graphql/` extraction (`lib/adlib-graphql.js`); **captured a real fixture headless**; offline smoke 8/10 destination_url non-null | `f44fe39` |
| **H4** | `cloudflare-dns`, `klaviyo`, `shopify-deploy` | `#cred-seam` fixed (`lib-creds.js`: `--creds` → env → `__dirname`); resolution unit-tested; all 5 integrations fail clearly on missing creds | `5facb30` |
| **H5** | E2E spine | `engine/contracts/h5-e2e.sh`: clean→score→store→vectorize→rag-query + analyzer gate, **ALL HOPS COHERENT** on `runs/_fixture/` | `cc73b76` |

REGISTRY health flipped **untested→working** for: `funnel-store`, `embeddings`, `embeddings-rag`,
`funnel-score`, `funnel-clean`, `firing-hooks`, `meta-ad-fetch`, `shopify-deploy`, `cloudflare-dns`,
`klaviyo` (10). Authoritative per-capability health + `p21` notes live in `REGISTRY.json`.

## What's DEFERRED / GATED (with rationale)

- **Trends fix (`#trends-0pct-fill`) — OPERATOR-GATED, code unimplemented.** Fix approach fully specified
  (intercept `/trends/api/widgetdata/multiline`, strip XSSI, parse `timelineData`). Empirically blocked:
  this WSL egress IP gets **HTTP 429** from Google on BOTH the explore page and the direct API. The
  calibration fixture must be captured via the operator's real Chrome (CDP bridge) or a non-flagged IP.
  Runbook: `H3-LIVE-DOM-RUNBOOK.md §H3a`. `web-site-fetch` stays untested.
- **reddit-extract smoke — IP-GATED.** reddit WAF returns "blocked by network security" to the
  browser-loaded `.json` from this IP (same class as Trends). Not a code defect — the retriever is the
  committed, previously-smoke-tested tool. Verify from a non-flagged IP / CDP real-Chrome.
- **belief_kind arduview backfill — DEFERRED.** `belief_kind` is a judgment field (only the Section
  Analyzer agent can produce it); re-running it is a marketing-content-producing LLM job. The capability
  it would prove (validator fires + enum enforcement) is already proven by the H1 fixture smoke, and the
  target (arduview-v2) is quarantine-bound — so no durable benefit. Engine win (the validator fires) is banked.
- **`#adlib-typeahead-resolve` — NEW OPEN gap (separate from the fixed extraction bug).** The Meta
  advertiser typeahead returns no candidates in WSL headless, so a full live run resolves NONE before the
  ad pass. Workaround: `forcedPageId` / keyword-URL / CDP. The destination_url extraction fix is independent.

## Out of scope (escalate as rebuild BUILDS, not hardening)
Failure #5 (`transformation`/`niche`/`routing_flag` plumbing — RAG `routing_flag` prefilter still null) ·
Step-3 VOC stage · spend-validation lift · `source_routing` vocab (contract-gated) · asset reshoots ·
revenue `monthly_visits` feed.

## Session conventions / artifacts
- **no-overwrite-v1:** arduview re-runs written to space `arduview-v2` (→ `runs/arduview-v2/`); v1
  byte-intact. `arduview-v2` appended to the R3 quarantine loop (`HANDOFF.md §R3` + `REBUILD-ROADMAP.md`).
- New committed fixtures under `runs/_fixture/`: `analyzer/`, `analyzer-bad/`, `funnels-clean/`,
  `funnels-assembled/`, `adlib/flipper-zero-xhr.json`. New harness `engine/contracts/h5-e2e.sh`.
- 9 atomic commits (one per fix) → each independently revertible via `gsd-undo`.

## Next
Engine is green on the deterministic spine. Remaining: operator captures the Trends + (optionally
fuller adlib) fixtures via real Chrome to close `web-site-fetch`; then the rebuild proceeds at
`REBUILD-ROADMAP.md` R3 (quarantine) → `/gsd-new-project`.
