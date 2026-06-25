# HARDENING.md — the deferred "perfection" milestone (SCAFFOLD)

**Status:** SCAFFOLD ONLY. Not executed. Run on explicit operator greenlight, AFTER the marketing
rebuild has produced the new I/O contracts (so PROVISIONAL labels reconcile first).

**Mandate:** harden the technical engine WITHOUT touching marketing strategy. Each capability:
**fix the documented bug → smoke-test it standalone on a fixture → flip `REGISTRY` health to green → atomic commit.**

**Guard:** before starting, wire `engine/hooks/guard-marketing.js` into `.claude/settings.json`
(`PreToolUse` Write|Edit) so the milestone physically cannot edit `off-limits.json` paths.

---

## Punch-list (reconciled — smaller than CONCERNS.md claimed)

| Phase | Capability | Fix | Smoke test |
|---|---|---|---|
| **H0** | contracts | repoint the 4 validators to import `contracts/enums.json` (replace inline `new Set`); finish `asset-record.schema.json`; generate `prompts/_generated/enums.md` | replay every existing reject/pass fixture → identical exit codes (behavior-preserving) |
| **H1** | firing | wire `validate-analyzer.js` into the funnel-deep-pass orchestrator + `route.js` (`#analyzer-unwired`) | bad belief record → exit 2; good → exit 0 (`runs/_fixture/`) |
| **H2** | funnel | `funnel-score` required-field check (`#funnel-score-input`); `funnel-clean` markdown headings (`#funnel-clean-md-headings`); rebuild `_index.json` (`#index-stale`) | round-trip: scored package in → non-null validation_strength out; `.md` funnel keeps `[SECTION]` markers |
| **H3** | fetch (live-DOM, riskiest, last) | Trends deferred-XHR (`#trends-0pct-fill`); adlib selector calibration (`#adlib-selectors`) | Trends fill-rate > 0 on a real run; adlib `destination_url` non-null; **capture raw DOM as a committed fixture** |
| **H4** | integrations + retrievers | parameterize creds to `--creds=<path>` (`#cred-seam`) | `--help`/dry-run each `engine/integrations/*`; **smoke `.claude/skills/reddit-extract/dump.mjs` (the VOC retriever) on a live thread** so it's verified-ready when Step 3 is built; confirm arduview invocation still works |
| **H5** | E2E coherence | none (verification) | run the deterministic chain on `runs/_fixture/` with golden-fixture agent outputs (no marketing agent in loop): `fetch→clean→dedupe→funnel-assemble→clean→score→store→vectorize→rag-query`, assert each output's required fields non-null. `gsd-integration-checker` formalizes seam-by-seam. |

**Contract-gated (NOT in H-pass until operator acts):** `source_routing` vocab (`#source-routing-ghost`) — define the category set, then add to `enums.json`; until then only the SAFE-NOW ghost-reference removal.

**Already FIXED (do not re-do):** `funnel_fields` (`bbff2ff`), `normalizeUrl` A/B (`bbff2ff`), `belief_kind` (`35581d4`).

**Reddit/VOC scope note:** H4 smoke-tests the `reddit-extract` RETRIEVER only (verify it dumps a live thread). The full **Step 3 VOC STAGE** (Bucketer→Ladderer→Language pipeline, spec in `handoff-step3-voc-build.md`) is a BUILD, not hardening — it happens during the rebuild. Goal: when the marketing rebuild needs VOC, the retriever is already green.

---

## Sequencing
H0 first (unblocks safe prompt rewrites). H1→H2 low-risk (fixtures exist). H3 last (needs live DOM;
make it reproducible via committed DOM fixture). H4 after the cred parameterization decision. H5 is the
final proof the engine is internally coherent and "ready when the new agents land."

Each phase = atomic GSD commit → independently revertible via `gsd-undo`.
