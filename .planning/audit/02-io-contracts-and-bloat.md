# IO Contracts and Context-Bloat Audit

Audited: 2026-06-04. Branch: eink-phase0-run.

---

## A. HANDOFF GRAPH

Format: **step | INPUTS (what the agent is instructed to read)** | **OUTPUTS (files written)** | **DOWNSTREAM CONSUMER**

Producer→consumer edges marked. Orphan outputs marked ⚠️ ORPHAN. Unneeded inputs marked ⚠️ UNNEEDED.

---

### Step 1 — Light Pass (prompts/step1-light-pass.md)

Five agents run in sequence/parallel. Schema defined in the same file.

#### 1A — Finder

| | Detail |
|--|--|
| INPUTS | pre-research-plan.md (prose bet brief, injected verbatim); web search (live) |
| OUTPUTS | `runs/<space>/brands.json` (kept brands + dropped log) |
| CONSUMER | 1.5 Roster Verifier; fetch.js (PIPELINE INPUTS block); revenue-est.js; Dumper (ads/<brand>.json); market-selection SKILL |
| UNNEEDED | Nothing structural — but the full pre-research-plan.md (77 lines) is injected for prose context. The Finder only needs: bet type/territory/seed-brand list + product definition. The template's "PIPELINE INPUTS" block (LP-hunt terms, trend toggle) is parsed by scripts, not by this agent. Low concern because the template is small (77 lines). |

#### 1.5 — Roster Verifier

| | Detail |
|--|--|
| INPUTS | `brands.json` (kept + dropped); web search (live); starting point (product, category) |
| OUTPUTS | Inline verdict JSON (slop_flags, missing_brands, dedup_channel_fixes, verdict, summary) — **not written to a named file** |
| CONSUMER | Human operator (applies flags to brands.json before fetch) |
| ORPHAN NOTE | Output is conversational/inline — no persisted file. Handoff to next step is a human approval gate. This is intentional by design but the verdict JSON has no canonical storage path. |

#### 1B — Fetch/Clean/AdLib scripts (deterministic)

| | Detail |
|--|--|
| INPUTS | `brands.json`; Playwright browser |
| OUTPUTS | `corpus/<brand>/clean/*.md`; `ads/<brand>.json` |
| CONSUMER | Dumper (reads corpus/clean/); adlib-one.js writes ads/; market-selection reads ads/ |

#### 1C — Dumper (1 per brand, parallel)

| | Detail |
|--|--|
| INPUTS | `corpus/<brand>/clean/*.md` (ONLY clean copy, never raw HTML); `ads/<brand>.json`; `definitions.md` (full 378-line file, "load definitions.md" instruction) |
| OUTPUTS | `corpus/<brand>/dump.json` |
| CONSUMER | Space Classifier (reads all dump.json); funnel-deep-pass (historically, now RETIRED per BREAK 5) |
| ⚠️ UNNEEDED | `definitions.md` full 378 lines → Dumper only needs: CLUSTER 1 (Niche, Transformation — to know what NOT to classify), CLUSTER 2 (Claim, mechanism definitions — for verbatim extraction). CLUSTER 3 (Differentiator levers), CLUSTER 4 (Sophistication/Awareness), CLUSTER 5 (Drivers), CLUSTER 6 (Testing terms) are not used by the Dumper. Roughly 200 of 378 lines (~53%) are irrelevant to the Dumper's job (verbatim extraction, no classification). |

#### 1D — Space Classifier (1 agent, reads all dumps)

| | Detail |
|--|--|
| INPUTS | All `corpus/<brand>/dump.json`; pre-research-plan.md (prose bet brief, injected verbatim); `definitions.md` (referenced via CLAIM_TYPE_ENUM cross-link for claim typing) |
| OUTPUTS | `runs/<space>/space-map.json` |
| CONSUMER | market-selection SKILL; funnel-deep-pass (space-map.json chosen cell); aggregate-mechanisms-in-play.js |

**Revenue-est.js / dedupe.js / adlib-one.js / fetch.js** run between agents as deterministic scripts. Their I/O is covered by the scripts' own file contracts.

---

### Step 2 — Market Selection (.claude/skills/market-selection/SKILL.md)

| | Detail |
|--|--|
| INPUTS (required) | `runs/<space>/space-map.json`; `runs/<space>/brands.json`; `runs/<space>/ads/<brand>.json` (per-brand, for run_length_days); `runs/<space>/pre-research-plan.md` (operator overrides — prose) |
| INPUTS (listed as needed but RETIRED) | `corpus/<brand>/dump.json` — BREAK 5 note says "gate no longer reads these — mechanisms-in-play read now comes from space-map.json". Listed for provenance only. ⚠️ UNNEEDED: if agent still reads these, it reads full per-brand dumps that are now redundant with space-map.json. |
| INPUTS (DR knowledge bundle) | `.claude/skills/market-selection/_dr-context.generated.md` — 995 lines, ~60KB, bundled from 5 DR files via inject-market-selection-dr.js. Full file read mandated by read_first. |
| INPUTS (framework docs) | `definitions.md` (378 lines); `workflow.md` Step 0 section only (full 362-line file read); `agents/implementation-notes.md` (52 lines) |
| OUTPUTS | `runs/<space>/market-selection.md` |
| CONSUMER | funnel-deep-pass (confirms chosen NTP cell / space-map.json cell); funnel-architect (operator supplies from run context); human D1 decision point |

---

### Step 3 — Funnel Deep Pass (.claude/skills/funnel-deep-pass/SKILL.md)

#### 3A — Router (cheap model, 1 per funnel)

| | Detail |
|--|--|
| INPUTS | funnel package metadata (competitor, source_type, run_transformation, transformation_definition); NO funnel body, NO DR files |
| OUTPUTS | `{ funnel_id, routing_flag }` — inline JSON passed to orchestrator |
| CONSUMER | Orchestrator (passes routing_flag to Section Analyzer context) |

#### 3B — funnel-analyzer-context.js (deterministic assembler)

| | Detail |
|--|--|
| INPUTS | `runs/<space>/funnels-clean/<funnel_id>-clean.json` (cleaned funnel body); spawns inject-dr.js to get DR bundle |
| OUTPUTS | Assembled context block (stdout or file) = DR bundle + funnel metadata + `<funnel_copy>` body |
| CONSUMER | Section Analyzer spawn prompt (orchestrator embeds the block) |

#### 3C — Section Analyzer (quality model, 1 per funnel)

| | Detail |
|--|--|
| INPUTS | Assembled context block from funnel-analyzer-context.js embedded in spawn prompt. Block contains: DR bundle (6 files, ~60KB via inject-dr.js, same as prompts/_generated/section-analyzer-dr-context.md); funnel metadata; cleaned funnel body in `<funnel_copy>`. Agent does NOT Read anything independently. |
| OUTPUTS | JSON: funnel_fields + belief_records[] — passed to orchestrator → funnel-store.js |
| CONSUMER | funnel-store.js → `runs/<space>/funnels/<id>.json`; later funnel-vectorize.js |

#### 3D — Scripts

| Script | Reads | Writes | Consumer |
|--|--|--|--|
| funnel-assemble.js | ads JSON, destination URLs | `funnels-assembled/*.json` | funnel-clean.js |
| funnel-clean.js | `funnels-assembled/*.json` | `funnels-clean/<id>-clean.json` | funnel-analyzer-context.js |
| funnel-score.js | funnel packages | stamps validation_lane/strength | funnel-store.js |
| funnel-store.js | analyzer output + scored packages | `runs/<space>/funnels/<id>.json` | funnel-vectorize.js, funnel-architect |
| funnel-vectorize.js | `runs/<space>/funnels/*.json` | `runs/<space>/funnels/_index.json` | /copywrite skill |
| funnel-claim-tally.js | `runs/<space>/funnels/*.json` | `runs/<space>/funnels/_tally.json` | funnel-architect |

---

### Step 4 — Funnel Architect (.claude/skills/funnel-architect/SKILL.md)

| | Detail |
|--|--|
| INPUTS (required) | `runs/<space>/funnels/*.json` (entire funnel store — all analyzed competitor funnels); `runs/<space>/funnels/_tally.json` (claim tally); `.claude/skills/funnel-architect/_dr-context.generated.md` (910 lines, 5 DR files) |
| INPUTS (operator-supplied conversationally) | product UM, objection set, backer awareness level, offer/price decision, blocked ports |
| OUTPUTS | Conversational funnel design + copy brief (no structured file output defined) |
| CONSUMER | Copywriter skill (reads the brief; separate downstream step) |
| ⚠️ ORPHAN | Output is prose/conversational — no canonical output file path defined. The copy brief produced here has no schema-level contract specifying where it's stored. The copywriter reads `runs/<space>/funnels/_index.json` (RAG index), not this brief directly. |

---

### Step 5 — Asset Classify (.claude/skills/asset-classify/SKILL.md)

#### 5A — Relevance-bucket (cheap model, 1 per asset)

| | Detail |
|--|--|
| INPUTS | asset_id, product name, kind (image/video); Reads `work_path` (downscaled image) |
| OUTPUTS | `{ id, relevance }` — inline JSON |
| CONSUMER | Orchestrator (gate: skip if irrelevant/sensitive) |

#### 5B — Role-classify / Comprehend-video (quality model, fan-out)

| | Detail |
|--|--|
| INPUTS | Assembled context block (orchestrator-built inline): product fact sheet (from pre-research-plan or product description); CLAIM-LIST.json (per-run); controlled vocabularies (embedded inline); Reads `work_path` (image) or contact sheet paths (video) |
| OUTPUTS | Claim-tagged record JSON → `runs/<space>/asset-classify/records/<id>.json` |
| CONSUMER | asset-map-rank.js |

#### 5C — Scripts

| Script | Reads | Writes | Consumer |
|--|--|--|--|
| asset-fetch.js | local dir / Drive | `assets/raw/<id>.*`; `raw-manifest.json` | probe.py, orchestrator |
| probe.py / probe_video.py | raw asset files | technical{} metadata | asset-fetch.js inline / records |
| sample_montage.py | video files | `runs/<space>/asset-classify/sheets/<id>-s0N.jpg` | comprehend-video agent |
| asset-map-rank.js | records dir; section-table.json | ranked per-section map + gap_list | asset-emit.js |
| asset-emit.js | records dir | `runs/<space>/asset-classify/images.json`; `IMAGES.md`; `videos.json`; `VIDEOS.md` | human pick gate → Phase 15 builder |
| asset-upload.js | images.json / videos.json | `url-map.json` (CDN backfill) | Phase 15 builder |

**images.json / IMAGES.md / videos.json / VIDEOS.md downstream:** Referenced by the Phase 15 LP builder (/copywrite) and Phase 17 LP builder. The asset-classify SKILL.md labels this "Phase 15 builder" but no SKILL.md for that builder exists yet (only a _dr-context.generated.md in the copywriter skill directory with no SKILL.md file). The downstream consumer exists but is not fully defined in the skill layer.

---

## ORPHAN OUTPUTS (no downstream reader)

| Output | Written by | Stated consumer | Status |
|--|--|--|--|
| Roster Verifier inline JSON | Roster Verifier (1.5) | Human operator | Not a file — conversational. By design, but no canonical storage. |
| funnel-architect copy brief | funnel-architect SKILL | "copywriter" downstream | No output file path specified. Copywriter RAGs _index.json directly; the design brief is prose with no contract. ⚠️ |
| `prompts/_generated/section-analyzer-dr-context.md` | inject-dr.js (default mode) | Section Analyzer fallback Read | The SKILL now uses funnel-analyzer-context.js which spawns inject-dr.js --stdout. The generated file is a fallback path but gets regenerated unnecessarily on each run that uses the default path. No bloat issue, but the file is partially redundant with the context assembler path. |

---

## RETIRED / DEAD INPUT STILL LISTED

| Input | Step that lists it | Status |
|--|--|--|
| `corpus/<brand>/dump.json` | market-selection §INPUTS | RETIRED (BREAK 5). Space-map.json now carries mechanisms_in_play[]. SKILL.md notes "Listed for provenance only; not a required gate input." Not a bloat risk IF the agent respects the note. Risk: a run that doesn't read the note will still open every dump.json. |

---

## B. CONTEXT-WASTE FLAGS

Format: **file path | lines | KB | what agent reads it for | what it actually needs | strip-to recommendation**

---

### Flag 1 — ecommerce--mark-builds-brands.md (full file read by market-selection)

| Field | Value |
|--|--|
| File | `/home/kyu3/knowledge/dr-marketing/ecommerce--mark-builds-brands.md` |
| Lines / KB | 283 lines / ~14KB |
| Bundled into | `.claude/skills/market-selection/_dr-context.generated.md` (last file in bundle) |
| What market-selection says it needs | "anti-fluke thresholds (multi-competitor, trend durability, ad longevity). CAUTION: $300–500K/mo floor MISCALIBRATED." |
| What it actually needs | ~2 grep hits for "anti-fluke" in the file (the term doesn't even appear there). The thresholds are actually reproduced inline in SKILL.md's gate text. The file contains: dropshipping philosophy, product selection frameworks, dry testing methodology, AI tool stacks, revenue validation, credit card rules — none relevant to the 4-gate market analysis. |
| Strip-to | Extract the 1-2 paragraphs covering ad longevity + multi-competitor signals; drop the rest (250+ lines). Or remove from bundle entirely — SKILL.md already inlines the anti-fluke logic. |

---

### Flag 2 — definitions.md fully loaded by Dumper (light-pass Agent 2)

| Field | Value |
|--|--|
| File | `/home/kyu3/PMF/definitions.md` |
| Lines / KB | 378 lines / 36KB |
| Read by | Dumper (light-pass Agent 2): "DEFINITIONS (load definitions.md)" |
| What the Dumper needs | CLUSTER 1 definitions of niche + transformation (to know what NOT to classify); CLUSTER 2 definitions of claim + mechanism (for verbatim extraction discipline). Clusters 3 (differentiator levers), 4 (sophistication/awareness stages), 5 (drivers), 6 (testing terms) are not used by the Dumper — it explicitly does not classify. |
| Unused portion | ~200 of 378 lines (~53%). CLUSTER 4 alone (sophistication + awareness: ~80 lines) is pure overhead for a verbatim-extraction agent. |
| Strip-to | Provide Dumper with a subset file: CLUSTER 1 (niche/transformation/market ~50 lines) + CLUSTER 2 (PMBD/claim/mechanism/angle ~90 lines) = ~140 lines. Space Classifier gets the full file (it needs CLUSTER 4 for claim-typing). |

---

### Flag 3 — workflow.md full file loaded by market-selection

| Field | Value |
|--|--|
| File | `/home/kyu3/PMF/workflow.md` |
| Lines / KB | 362 lines / 24KB |
| Read by | market-selection SKILL: "workflow.md Step 0 — the locked gap variables" |
| What it needs | Step 0 section only (~30 lines): the Gap Score formula and the 4 gap variable definitions (Desire to Solve, D2C Feasibility, Market Sophistication, Market Growth). The market-selection gates ARE those variables, unrolled. |
| Unused portion | Steps 1–8, cross-cutting principles, sub-niche validation rules, test design, VOC pipeline — ~330 of 362 lines (~91%) irrelevant to the 4-gate assessment. |
| Strip-to | Read only "## Step 0 — Map a space" section (~lines 19–49). Or inline the 4 gap variable definitions directly into SKILL.md and drop the workflow.md read entirely. |

---

### Flag 4 — DR bundle read by funnel-deep-pass Section Analyzer (6 files, ~60KB)

| Field | Value |
|--|--|
| File | `prompts/_generated/section-analyzer-dr-context.md` (embedded by funnel-analyzer-context.js) |
| Lines / KB | 902 lines / 60KB |
| Read by | Section Analyzer (quality model) — receives the full bundle inline via funnel-analyzer-context.js |
| Files in bundle | persuasion--carl-weische.md (67 lines), funnel-architecture--carl-weische.md (255 lines), vssl--carl-weische.md (128 lines), differentiator-framework__2_.md (157 lines), consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md (79 lines), offer-construction--carl-weische.md (171 lines) |
| What it needs | execution_type vocab (persuasion.md + funnel-arch.md + vssl.md), proof_tier (differentiator-framework sections on believability), move tags (differentiator-framework levers), awareness_entry (funnel-arch V-shape + vssl 50% rule), offer_mechanic/urgency_construction (offer-construction.md) |
| Unused portions | consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md (79 lines) — its content is about perceived-value pricing, information filtering, locus of control, external validation trap. None of these map to the Analyzer's schema fields (execution_type, proof_tier, move, awareness_entry, offer_mechanic). It was included for "trust heuristic / social proof" rationale but the persuasion.md file already covers social proof taxonomy. |
| Strip-to | Drop consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md from the inject-dr.js allowlist. The Section Analyzer's actual schema fields are fully covered by the remaining 5 files. Saves ~79 lines (~5KB) of noise on every analyzer spawn. |

---

### Flag 5 — step1-light-pass.md loaded whole by the orchestrating agent

| Field | Value |
|--|--|
| File | `/home/kyu3/PMF/prompts/step1-light-pass.md` |
| Lines / KB | 534 lines / 40KB |
| Read by | The orchestrator running the light-pass pipeline (main loop reads the full spec to execute the pipeline) |
| Problem | This single file contains: full schema (brands.json, dump.json, space-map.json — ~130 lines each), ALL 4 agent prompts (verbatim, folded in), closed enums, deterministic scaffold descriptions, open decisions. Each agent should only receive its OWN prompt and the schema relevant to its output. Instead, when this file is loaded to spawn Agent 1 (Finder), the model also sees Agent 2, 3, 4 prompts + full dump.json + space-map.json schemas it won't use. |
| Actual waste | Each agent spawned from this file receives the full 534-line spec even though it only needs: its own prompt (~50-80 lines) + its output schema (~40 lines) + bet brief context. The Finder receiving the Space Classifier's prompt is ~150 lines of contamination; the Dumper receiving the space-map.json schema is ~40 lines it must not classify into. |
| Strip-to | Split agent prompts into separate files (already suggested by the skill architecture pattern). Each agent receives: its own prompt + its output schema + relevant shared definitions. The schemas stay in step1-light-pass.md as the source of truth; each agent spawn block references only its output schema section. |

---

### Flag 6 — market-selection _dr-context.generated.md loads full ecommerce--mark file

(Covered in Flag 1 above — same file, same problem from the bundle side.)

Additional waste: the market-selection bundle (995 lines, 60KB) also includes the full brand-building--spencer-origins.md (180 lines) when market-selection only needs its MARKET SOPHISTICATION section (~50 lines covering Stage 3/4/5 transitions + 5 mechanism types + dead-ground rule). The MECHANISM & POSITIONING, BRAND BUILDING, POSITIONING & COMPETITIVE STRATEGY, and SCALING sections (~130 lines) are not used for the 4-gate assessment.

| File | Lines | Needed | Unused |
|--|--|--|--|
| `brand-building--spencer-origins.md` | 180 | ~50 (MARKET SOPHISTICATION + mechanism types + dead-ground) | ~130 lines (~72%) |

Strip-to: Extract only the "MARKET SOPHISTICATION" section + "MECHANISM & POSITIONING" section headers + five mechanism types. Drop BRAND BUILDING, POSITIONING, SCALING from the market-selection bundle.

---

### Summary table — top 6 worst offenders

| Rank | File path | Lines | Used by | Actual need | Lines wasted (est.) | Strip-to recommendation |
|--|--|--|--|--|--|--|
| 1 | `~/knowledge/dr-marketing/ecommerce--mark-builds-brands.md` | 283 | market-selection (bundled) | ~5 lines anti-fluke concept (already inlined in SKILL.md) | ~278 | Remove from market-selection bundle entirely — logic already inlined in SKILL.md gate text |
| 2 | `/home/kyu3/PMF/prompts/step1-light-pass.md` | 534 | Orchestrator + all 4 agents see the whole file | Each agent needs: own prompt (~70 lines) + own output schema (~40 lines) | ~350 per agent spawn | Split into per-agent spawn files; each file contains only that agent's prompt + output schema |
| 3 | `/home/kyu3/PMF/workflow.md` | 362 | market-selection (`read_first`) | Step 0 gap variables (~30 lines) | ~330 | Read only "## Step 0" section, or inline the 4 gap variable defs in SKILL.md and drop the read |
| 4 | `/home/kyu3/PMF/definitions.md` | 378 | Dumper agent (light-pass Agent 2) | CLUSTER 1+2 only (~140 lines: niche/transformation/claim/mechanism) | ~200 | Create `definitions-dumper.md` with CLUSTER 1+2 only; Space Classifier gets full file |
| 5 | `~/knowledge/dr-marketing/brand-building--spencer-origins.md` | 180 | market-selection (bundled) | MARKET SOPHISTICATION section + 5 mechanism types (~50 lines) | ~130 | Extract to a trimmed slice for the bundle; drop BRAND BUILDING / POSITIONING / SCALING sections |
| 6 | `~/knowledge/dr-marketing/consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md` | 79 | Section Analyzer (funnel-deep-pass, bundled) | Nothing maps to Analyzer schema fields; persuasion.md covers social proof | ~79 | Remove from inject-dr.js allowlist; all 6-file bundle members cover its purported use cases already |

---

## ADDITIONAL FINDINGS

### _specs files are design docs, not runtime reads

`prompts/_specs/` (market-selection-assessor-spec.md, funnel-analysis-collection-spec.md, image-classifier-brick.md, deep-market-analysis-framework.md, market-selection-framework.md) are DERIVED sources: "Derived from _specs — edit the spec, regenerate this." No agent is instructed to Read them at runtime. They are human-facing design documents, not context waste. No action needed.

### DR bundle triplication

Three separate inject-*.js bundlers produce three generated DR bundles for three skills (funnel-deep-pass, market-selection, funnel-architect). The bundles overlap significantly:
- `differentiator-framework__2_.md` appears in all three bundles
- `consumer-psychology--carl-weische.md` appears in funnel-architect + market-selection bundles
- `persuasion--carl-weische.md` appears in funnel-deep-pass + funnel-architect bundles

This is structurally correct (each skill gets only what it needs) but the triplication means the same underlying DR text gets loaded 2-3x across a full pipeline run. Not a per-invocation bloat problem (each bundle is ~60KB, within context limits) but worth noting for future consolidation.

### corpus/dump.json ghost input in market-selection

market-selection/SKILL.md §INPUTS lists `corpus/<brand>/dump.json` with a note "gate no longer reads these." The note exists but the input is still listed in the Arduview path-mismatch section (line 102). Risk: a model reading the INPUTS table may still attempt to Read these files. The listing should be removed or moved to a retired-inputs footnote.

### funnel-architect output has no file contract

funnel-architect produces a conversational design + copy brief but no output schema, no canonical file path, no validator. The downstream copywriter skill reads `runs/<space>/funnels/_index.json` (the RAG index from funnel-vectorize.js), not the architect's brief. The brief is effectively a working-session artifact with no persistent handoff contract. This is an I/O gap: if the architect session ends, the brief is lost and the copywriter has no structured input other than the raw funnel store.
