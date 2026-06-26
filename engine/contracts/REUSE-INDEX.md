# REUSE-INDEX — the already-built wiring the next build REUSES (don't rebuild)

**Date:** 2026-06-26 · **Purpose:** index every durable, **non-marketing** piece already built + proven, so the R5 build session plugs marketing *on top* of it and rebuilds none of it. This is the **code + engineering-prompt** index — distinct from `MATERIALS.md` (the arduview *run data*) and `PROMPT-WIRING.md` (the marketing seam map, deferred to R5).

**How to use:** read `REGISTRY.json` (code) + this file (engineering prompts/skills/contracts). Everything in §1–§4 is plug-in-ready. Author only the §5 marketing layer.

---

## 1. Reusable CODE → see `REGISTRY.json` (26 capabilities)
Authoritative, not duplicated here. Every reusable script/hook/integration/lib with I/O, run command, deps, health. Regenerate via the `engine-map` skill. Families:
- **fetch:** `fetch.js` (site+Trends), `crowdfund-fetch.js`, `adlib-one.js`/`adlib-sweep.js` (+`lib/adlib-graphql.js`, `lib/trends-parse.js`)
- **clean/normalize:** `clean.js`, `funnel-clean.js`, `dedupe.js`
- **funnel pipeline:** `funnel-assemble/score/store/claim-tally/analyzer-context.js`
- **embeddings/RAG:** `lib/embed.js`, `funnel-vectorize.js`, `funnel-rag-query.js`
- **aggregate:** `revenue-est.js`, `aggregate-mechanisms-in-play.js`
- **asset pipeline:** `asset-fetch.js`, `asset/*.py` (probe, probe_video, frame-grab, sample_montage, video-assemble), `asset-map-rank.js`, `asset-emit.js`, `asset-upload.js`
- **integrations:** `shopify/`, `cloudflare/`, `klaviyo/`, `surge/`, `cdp/`, `lib-creds.js`
- **firing hooks:** `route.js`, `validate-*.js`, `inject-*-dr.js`

## 2. Reusable ENGINEERING PROMPTS / SPECS (non-marketing) — NOT in REGISTRY
Prompt/spec/wiring files whose logic is mechanical or perceptual, not marketing strategy. Reuse as-is.

| file | what it is | reuse note |
|---|---|---|
| `prompts/_specs/image-classifier-brick.md` | build spec for the asset/image classifier brick (raw images → claim-tagged section→role→file→CDN manifest) | **engineering** (perceptual classification). Arduview worked-example is illustrative only |
| `prompts/_specs/funnel-analysis-collection-spec.md` | build spec for the collection layer (the funnel bricks + section-analyzer contract) | **engineering blueprint** for the bricks in §1. The marketing *rubric* it points a downstream agent at is re-authored (§5); the record/IO contract is reusable |
| `prompts/_generated/enums.md` | generated closed-vocabulary reference | regenerable via `gen-enums-md.js` from `enums.json` |
| `prompts/_generated/section-analyzer-dr-context.md` | generated DR-rubric bundle (built by `inject-dr.js`) | **wiring is engineering** (regenerable); its *content* is DR knowledge consumed by a marketing agent |
| `prompts/_templates/pre-research-plan.template.md` | operator seed-brief template | reusable scaffold (operator fills per run) |
| `engine/hooks/inject-*-dr.js` | DR-context injectors (in REGISTRY) | reuse — the bundler is engineering; swap the source knowledge per run |
| `engine/hooks/validate-*.js` | contract validators enforcing `enums.json`/schemas (in REGISTRY) | reuse as-is |

## 3. Reusable engineering SKILLS
| skill | role | reuse |
|---|---|---|
| `reddit-extract` | reddit thread → verbatim nested markdown (VOC retriever) | as-is — kept live through R3 |
| `pipeline-audit` | cold adversarial audit of a completed run's pipeline | as-is (path refs need a post-reorg touch-up) |
| `skill-builder` · `system-designer` · `instruction-mechanizer` · `adversarial-reviewer` · `automate` · `skill-creator` | general meta-tooling (not PMF-specific) | as-is |

## 4. The CONTRACTS everything plugs into
- `engine/contracts/enums.json` — closed vocabularies (validators import these)
- `engine/contracts/schemas/` — record schemas (e.g. `asset-record.schema.json`)
- `engine/contracts/NAMING.md` — naming law
- `engine/contracts/REGISTRY.json` / `.md` — the code index (§1)

## 5. RE-AUTHOR — do NOT reuse (marketing strategy; rebuilt at R4/R5 per decision B)
- `marketing-lens/prompts/01–08b` — Finder, Roster Verifier, Dumper, Space Classifier, Market Selection Assessor, Router, Section Analyzer, Funnel Architect, Copywriter
- `prompts/_specs/deep-market-analysis-framework.md`, `market-selection-framework.md`, `market-selection-assessor-spec.md`
- `prompts/step1-light-pass.md`, `prompts/funnel-deep-pass.md` (coordinate/MIXED — marketing halves)
- `.claude/skills/market-selection`, `funnel-architect`, `funnel-deep-pass`, `copywriter`
- `definitions.md`, `workflow.md`

### Judgment calls to confirm (the gray line)
- **Asset classification** (`09-relevance-bucket`, `10-role-classify`, `11-comprehend-video` under `marketing-lens/`): their *logic* is engineering/perceptual (what's in the pixels), so it belongs in §2 — but the prompt *instances* live under `marketing-lens/` which decision-B quarantines. **Treated here as: reuse the LOGIC via the `image-classifier-brick.md` spec (§2); re-author any marketing-flavored copy in the instances.** Correct me if you want the instances themselves carried over verbatim.
- **Section Analyzer / Funnel bricks straddle the line:** their firing/contract wiring (bricks, injectors, validators, schemas) is reusable (§1–2); their marketing-judgment *rubric* is re-authored (§5).
