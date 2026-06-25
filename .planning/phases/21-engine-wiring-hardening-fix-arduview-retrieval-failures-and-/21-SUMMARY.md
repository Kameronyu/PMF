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

| **H3-Trends** | `web-site-fetch` | `#trends-0pct-fill` FIXED — consent-warm + `/widgetdata/multiline` XHR intercept (`lib/trends-parse.js`); offline fixture 262 pts, fill-rate>0; live-captured from this AWS IP | `f2c6555` |
| follow-up | `reddit-extract` | hardened to headed-default + retry-on-403 (`6dc6a30`); headless fingerprint was the block (headed got 200) — clean dump pending residential IP / OAuth | `6dc6a30` |

REGISTRY health flipped **untested→working** for **11** capabilities: `funnel-store`, `embeddings`,
`embeddings-rag`, `funnel-score`, `funnel-clean`, `firing-hooks`, `meta-ad-fetch`, `web-site-fetch`
(Trends), `shopify-deploy`, `cloudflare-dns`, `klaviyo`. Authoritative per-capability health + `p21`
notes live in `REGISTRY.json`.

**Late finding (operator pushed to exhaust workarounds — it paid off):** the live-DOM items were NOT
hard IP-blocked. **Meta** works headless (just needed scroll→graphql). **Trends** works from this AWS
datacenter IP once you **warm a google.com consent session** (the 429 was the cold-consent gate, not
the IP) — so it's fully fixed, not operator-gated. **Reddit** is blocked on the **headless fingerprint**
(headed returns 200), now hardened to headed; a clean end-to-end dump just needs a residential IP
(this sandbox's AWS IP rate-limits reddit under repeated load) or the official OAuth API.

## What's DEFERRED / GATED (with rationale)

- **Trends fix (`#trends-0pct-fill`) — FIXED `f2c6555` (NOT gated after all).** Initial read (IP-429
  block) was wrong: the 429 came from a COLD/no-consent session. Warming a google.com consent session
  first → Trends serves the `/widgetdata/multiline` XHR from this AWS IP. Implemented (consent-warm +
  intercept + `lib/trends-parse.js`), verified offline (262 pts, fill-rate>0) + live. `web-site-fetch`
  flipped working.
- **reddit-extract — hardened, clean dump pending residential IP.** The block was the HEADLESS
  fingerprint (headed returned 200 from the same IP), now headed-by-default + retry-on-403 (`6dc6a30`).
  A clean end-to-end dump didn't complete this session because repeated testing rate-limited this AWS
  datacenter IP. Runs from a residential IP; production VOC should use reddit's official OAuth API
  (STATE.md M1-S6). Stays untested (no clean live dump captured).
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
