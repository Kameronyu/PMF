# 08 — Deep-Pass Bugs: Triage + Fix Design
_Generated 2026-06-04_

Source files read:
- `agents/funnel-deep-pass-run-notes.md` (193 lines)
- `.planning/phases/03-.../03-DEBUG-RUN-NOTES.md`
- `.planning/audit/07-belief-records-ingest.md`
- `tools/funnel-store.js`, `tools/funnel-vectorize.js`, `tools/funnel-assemble.js` (`normalizeUrl`), `tools/adlib-one.js` (`extractAdCards`)

---

## JOB 1 — Triage: funnel-deep-pass-run-notes.md

Each section classified as A (Agentic/engineering), B (Marketing/operator), or C (Useless/redundant).

| § | Verbatim quote (abbreviated) | Bucket | Underlying problem |
|---|------------------------------|--------|--------------------|
| §1 space-map.json | "The S1 classifier writes space-map.json to the repo root … SKILL.md precondition check will fail on a fresh run" | **A** | Precondition path mismatch — SKILL.md checks wrong location; needs path fix or doc clarification |
| §1 corpus req | "pipeline assumes corpus/<brand>/raw/home.html and corpus/<brand>/clean/home.md exist … If a brand has no corpus … exclude it, do not stub" | **A** | Missing corpus guard — orchestrator has no early-exit logic for absent corpus files |
| §1 ads req | "funnel-assemble.js expects an ads JSON … for most maker/gadget brands this file will be empty" | **A** | Misleading SKILL.md framing that ads are required; no-ads path must be explicit |
| §2 no-ads fallback | "How to build a stub package for a no-ads DTC brand" (full playbook) | **A** | Orchestration gap — no no-ads codepath in the pipeline; relies on operator improvisation |
| §3 Divoom HTML caveat | "Option A (preferred): use the raw HTML … Option B (fallback): use clean/home.md … Markdown headings are NOT processed by funnel-clean.js" | **A** | funnel-clean.js regex only matches HTML heading tags; .md fallback silently drops all [SECTION] markers |
| §4 crowdfunding_stats field names | "`amount_raised` NOT `amount_raised_usd` — using wrong name silently produces null" | **A** | Silent field-name mismatch between operator notes and scored output; no schema validation at input boundary |
| §5 funnel-score.js input | "Do NOT pass funnels-clean/ output to funnel-score.js … Passing it gives the scorer no ads and no crowdfunding stats" | **A** | Wrong-file input error; script accepts any JSON without checking required fields are present |
| §6 context injection | "orchestrator instead told the Section Analyzer subagents to Read a pre-assembled context file … violates the design" | **A** | DR injection relied on LLM read compliance, not deterministic spawn-prompt embedding |
| §7 KS 404 fallback | "Wayback Machine blocks archiving of Kickstarter pages … Pull campaign stats from secondary sources" | **B** | Operator judgment — which secondary sources are credible; what stats can be trusted |
| §8 funnel_fields persistence gap | "funnel-store.js reads from assembled package, not the analyzer output … primary_claim: null … correct values are in funnels-analyzer-out/*-beliefs.json under funnel_fields" | **A** | buildStoredRecord() ignores funnel_fields wrapper; 6a fields permanently null in store |

**Counts: A=8, B=1 (§7), C=0**

---

## JOB 2 — Bug Diagnoses + Fix Designs

### Bug 1 — funnel_fields persistence gap (§8 run-notes)

**Root cause:** `funnel-store.js` `buildStoredRecord()` (lines 113–154) reads all 6a fields (`primary_claim`, `claim_type`, `awareness_entry`, `funnel_sequence`, `offer_mechanic`, `urgency_construction`) directly from `funnelPkg.*`. The Section Analyzer writes these fields inside a `funnel_fields` wrapper object in its beliefs JSON — `{ funnel_fields: { primary_claim, ... }, belief_records: [...] }`. The store receives the scored assembled package as `funnelPkg`, which was produced by `funnel-score.js` and never had those fields. The beliefs JSON is only used to extract `belief_records` array (line 253–255 single-funnel mode; line 200–202 batch mode). The wrapper `funnel_fields` object is loaded but then discarded — only `parsed.belief_records` is returned.

**Affected code:**
- Single-funnel: `tools/funnel-store.js` lines 252–256 (loads beliefs, strips to array only)
- Batch: `tools/funnel-store.js` `findBeliefsForFunnel()` lines 197–202 (same strip)
- `buildStoredRecord()` lines 113–154: reads from `funnelPkg.*` only

**Fix design:**
1. In single-funnel mode, after loading the beliefs JSON, extract `funnel_fields` if present: `const funnelFields = raw.funnel_fields ?? {};`
2. Pass `funnelFields` as a third argument to `buildStoredRecord(funnelPkg, beliefRecords, funnelFields)`.
3. In `buildStoredRecord`, for each of the 6a fields, prefer `funnelFields.X` over `funnelPkg.X`: e.g., `primary_claim: funnelFields.primary_claim ?? funnelPkg.primary_claim ?? null`.
4. In batch mode, `findBeliefsForFunnel()` should return `{ records, funnel_fields }` instead of the bare array, so the caller can pass `funnel_fields` through.

**Classification: SAFE-NOW** — pure plumbing, no prompt change, no marketing data contract change. The fields are already produced by the Analyzer; this just stops discarding them.

---

### Bug 2 — DR injection relied on LLM read compliance, not deterministic embedding (§6 run-notes / 03-DEBUG-RUN-NOTES.md §D-17 closure)

**Root cause:** The SKILL instructs the orchestrator to run `funnel-analyzer-context.js` and embed the output directly in the Section Analyzer's spawn prompt. In the arduview run, the orchestrator instead passed a file path and told the subagent to `Read` it. This is non-deterministic — one missed Read = no DR rubric. `funnel-analyzer-context.js` exists and is verified (PASS on all three grep checks in the debug notes). The gap is purely in the orchestrator's procedure.

**Affected code:** No code bug — the tool exists and works. The gap is orchestration procedure in the funnel-deep-pass SKILL (`prompts/funnel-deep-pass.md` ORCHESTRATION section) and any future operator runs.

**Fix design:** In `prompts/funnel-deep-pass.md`, add a hard MUST rule in the ORCHESTRATION section: "MUST capture `funnel-analyzer-context.js --funnel=<id>` stdout and paste it verbatim into the Section Analyzer spawn prompt between `<funnel_copy>` markers. MUST NOT pass a file path and rely on subagent Read." The fallback note already exists in the Section Analyzer prompt — clarify it is emergency-only.

**Classification: SAFE-NOW** — prompt procedure note, no data contract change.

---

### Bug 3 — normalizeUrl() strips UTM/fbclid but not A/B variant params → phantom funnels

**Root cause:** `tools/funnel-assemble.js` `normalizeUrl()` (lines 90–122) strips only `utm_*` and `fbclid`. A/B test params common in Meta ads (e.g., `?variant=B`, `?test=ctrl`, `?lp=2`, `?ver=`, Shopify `_pos`/`_sid`/`_ss`/`_psq`) survive normalization. Two ads pointing to the same LP with different A/B params normalize to different keys, producing two separate funnel assemblies instead of one — "phantom funnels."

**Affected code:** `tools/funnel-assemble.js` lines 103–108 (the `toDelete` filter).

**Fix design:** Expand the strip list to also delete known A/B and session params: add a second regex branch `|| /^(variant|test|lp|ver|_pos|_sid|_ss|_psq|ref|source|medium|campaign|content|term|gclid|gclsrc|dclid|msclkid)$/i.test(key)`. After the first real run, inspect `ambiguous_destinations.json` sidecar and calibrate to the specific market's LP URL patterns as noted in `03-DEBUG-RUN-NOTES.md` failure point 1.

**Classification: SAFE-NOW** — normalization logic, no marketing contract change. The sidecar `ambiguous_destinations.json` is already emitted by `funnel-assemble.js` for post-run inspection.

---

### Bug 4 — adlib-one.js DOM selectors unverified (TODO(D-17))

**Root cause:** `tools/adlib-one.js` `extractAdCards()` (lines 110–220+) uses heuristic selectors targeting `a[href]` anchors filtered by text length and absence of `facebook.com/ads/library` in href. The "Library ID" ancestor walk (up to 20 parents) is heuristic and untested against the live Meta Ad Library DOM. The headline extraction uses `h1/h2/h3/[role="heading"]` inside the card ancestor. All three paths are marked `TODO(D-17)`. If Meta's React-rendered DOM doesn't match, `destination_url` may be broadly null — collapsing the entire ads-dependent assembly path.

**Affected code:** `tools/adlib-one.js` lines 112–220, specifically the `ctaLinks` filter, the Library ID walk, and the headline selector.

**Fix design:** This is a live-DOM calibration task, not a code logic fix. During the first real debug run (D-02): (a) dump raw DOM of one loaded Ad Library search page; (b) inspect the actual card container structure and library-ID text location; (c) replace heuristic selectors with verified aria-role or data-attribute selectors. Until then, flag in the run notes that `destination_url` null-rate should be checked before trusting assembled packages. The existing fallback (text-parse path in `adlib-one.js`) produces partial data when DOM extraction fails.

**Classification: SAFE-NOW** — no marketing contract change; only affects which ads get extracted, not what fields the downstream contract requires.

---

### Bug 5 — belief_kind + source_routing ghost fields (07-belief-records-ingest.md)

**Root cause:** `SKILL.md` references `belief_kind` and `source_routing` as belief-record fields. The Section Analyzer prompt does not instruct it to emit these fields, so actual belief records don't contain them. The architect SKILL reads `belief_kind` and `source_routing` from the store — both are absent, so the architect operates as if they're null/undefined without error.

**Affected code:** Section Analyzer prompt (wherever `belief_kind` and `source_routing` are expected); `SKILL.md` INPUTS spec (documents fields that don't exist).

**Fix design:**
- Option A (CONTRACT-GATED): add `belief_kind` and `source_routing` to the Section Analyzer prompt's output schema, define their vocabulary, validate with `validate-analyzer.js`. Requires defining what these fields mean (operator judgment on what `belief_kind` categories are and what `source_routing` routes to).
- Option B (SAFE-NOW): remove `belief_kind` and `source_routing` from `SKILL.md` INPUTS spec so the architecture doc matches reality. No data change, no contract change.

**Classification: Option A = CONTRACT-GATED (adds new fields the architect consumes), Option B = SAFE-NOW (doc correction only).**

---

### Bug 6 — _index.json missing source_type + routing_flag (07-belief-records-ingest.md)

**Root cause:** `funnel-vectorize.js` `loadUnits()` (lines 107–129) correctly assigns `source_type` and `routing_flag` from the funnel file onto each retrieval unit. However, the on-disk `_index.json` for the arduview run was built from an older version of the script that lacked these fields. The `--source-type` and `--routing-flag` prefilters in `funnel-rag-query.js` are therefore inoperative — they filter against null for every record.

**Affected code:** No code bug in current `funnel-vectorize.js`. The issue is a stale index artifact.

**Fix design:** Rebuild the index: `node tools/funnel-vectorize.js --space=arduview`. This regenerates `_index.json` with the current code that includes both fields. The copywriter RAG prefilters then become operative. No code change required — rebuild only.

**Classification: SAFE-NOW** — rebuild only, no code or contract change.

---

## Summary table

| # | Bug | File | Fix one-liner | Tag |
|---|-----|------|---------------|-----|
| 1 | funnel_fields lost — 6a fields null in store | `funnel-store.js` | Extract `funnel_fields` from beliefs JSON; pass to buildStoredRecord; prefer over funnelPkg.* | SAFE-NOW |
| 2 | DR injection non-deterministic (LLM Read, not spawn embed) | `prompts/funnel-deep-pass.md` | Add hard MUST rule: capture funnel-analyzer-context.js stdout, paste directly into spawn prompt | SAFE-NOW |
| 3 | normalizeUrl() lets A/B params through → phantom funnels | `tools/funnel-assemble.js` | Expand strip list to known A/B/session params; calibrate per-market on D-02 | SAFE-NOW |
| 4 | adlib-one.js DOM selectors untested (TODO D-17) | `tools/adlib-one.js` | Live-DOM calibration task on D-02; check destination_url null-rate before trusting packages | SAFE-NOW |
| 5a | belief_kind + source_routing absent — ghost fields | Section Analyzer prompt | Define vocab + add to output schema + add validate-analyzer.js rule | CONTRACT-GATED |
| 5b | SKILL.md documents fields that don't exist | `SKILL.md` | Remove ghost field references to match reality | SAFE-NOW |
| 6 | _index.json stale — source_type/routing_flag missing → RAG prefilters dead | rebuild only | Run `node tools/funnel-vectorize.js --space=arduview` | SAFE-NOW |
