# funnel-deep-pass — run notes (arduview / novelty-object-own × edc-aesthetic-collectors)

Run date: 2026-06-04. Brands: Playdate, Pocket Operator, Divoom (DTC, no ads), GameShell (crowdfunding, KS 404).

These notes exist for future agents running this pipeline. Read before touching any step.

---

## 1. Known data preconditions

### space-map.json — two files, two purposes

The S1 classifier writes `space-map.json` to the **repo root**, not to `runs/<space>/`. The SKILL.md precondition check (`test -f runs/<space>/space-map.json`) will fail on a fresh run because that file does not exist yet.

The `runs/<space>/space-map.json` is a **filtered derivative** created during `/market-selection` — it contains only the chosen cell (`_chosen_cell`, `run_transformation`, `run_niche`, and the single filtered `combos[]` entry). It is NOT the same as root `space-map.json`.

**Before the judgment loop:** confirm `runs/<space>/space-map.json` has `_chosen_cell`, `run_transformation`, and `run_niche` populated. If only the root file exists, run `/market-selection` first — it produces the filtered derivative. Do not manually copy the root file; it has 6 combos, not 1.

### Corpus requirements

The pipeline assumes `corpus/<brand>/raw/home.html` and `corpus/<brand>/clean/home.md` exist for each brand. These are written by `fetch.js` + `clean.js` from the S1 light-pass. If a brand has no corpus (site offline, 404), it cannot be assembled — exclude it from the funnel run, do not stub.

### Ads requirement — NOT universal

`funnel-assemble.js` expects an ads JSON from `adlib-one.js`. For most maker/gadget brands this file will be empty (0 ads). See Section 2 (brands-with-no-ads fallback).

---

## 2. Fallback playbook — brands with no Meta ads

Playdate, Pocket Operator, and Divoom all had 0 Meta ads. The standard chain (`funnel-assemble.js <ads-json>`) produces a valid package but with `bound_ads: []`. The scorer then returns `validation_lane: ['unknown']` because there are no ads to score. This is correct behavior — do not try to force lane A.

**How to build a stub package for a no-ads DTC brand:**

1. Source the landing page body from `corpus/<brand>/raw/home.html` (preferred for section-marking) or `corpus/<brand>/clean/home.md` (see Section 3 for caveat on markdown).

2. Required top-level fields in the stub JSON:
   ```json
   {
     "funnel_id": "<brand>-<8-char-hash>",
     "competitor": "<brand>",
     "source_type": "DTC",
     "landing_page_url": "<url>",
     "landing_page_body": "<html or md content>",
     "bound_ads": [],
     "_provenance": {
       "_note": "Stub — no Meta ads; body from corpus/<brand>/raw/home.html"
     }
   }
   ```

3. Do NOT add `crowdfunding_stats` for DTC brands. Its presence triggers Currency B scoring.

4. Pass this stub directly to `funnel-clean.js`, then `funnel-score.js`. Expected result: `validation_lane: ['unknown']`. That is correct and intentional — birdseye will use the belief records regardless; the lane just won't carry ad validation weight.

5. The correct input to `funnel-score.js` for DTC stubs is the stub package itself (not the clean output). See Section 5.

---

## 3. Divoom / large-HTML caveat

Divoom's `corpus/divoom/raw/home.html` is ~1.75MB. The first ~90KB is a Shopify cookie consent wall before any marketing copy. Passing this to `funnel-clean.js` produces a `cleaned_body` that starts with sections of cookie/consent boilerplate.

**Option A (preferred): use the raw HTML anyway.** `funnel-clean.js` inserts `[SECTION]` markers on HTML `<h1>–<h4>`, `<section>`, `<article>`, `<main>`, `<aside>` tags (see line 156–163 of `tools/funnel-clean.js`). Despite the large file, the Section Analyzer can still locate real copy after the consent wall — the verbatim-refs gate enforces that refs point to real copy in the body.

**Option B (fallback): use `corpus/<brand>/clean/home.md`.** Markdown headings (`# Heading`, `## Heading`) are NOT processed by `funnel-clean.js` — it only matches HTML heading tags via regex. If you use a `.md` file as `landing_page_body`, the output will have NO `[SECTION]` markers. The Section Analyzer will receive a flat unmarked body. This works — `[SECTION]` markers are orientation points, not belief boundaries — but the Analyzer gets less structural guidance.

**If using .md as fallback:** note in `_provenance._note` that the body is from the clean markdown file, not raw HTML, and that section markers are absent. The Section Analyzer prompt already states `[SECTION]` markers are not belief boundaries, so the behavioral impact is minimal.

---

## 4. crowdfunding_stats — correct field name reference

`funnel-score.js` destructures `crowdfunding_stats` at line 228 as:

```js
const { amount_raised, backer_count, funded_vs_failed, delivered_vs_not } = crowdfunding_stats;
```

**Exact field names (all required if known, null if unknown):**

| Field | Type | Notes |
|-------|------|-------|
| `amount_raised` | number (USD) | NOT `amount_raised_usd` — using the wrong name silently produces `null` → lane B scores as unknown |
| `backer_count` | number | integer |
| `funded_vs_failed` | `"funded"` \| `"failed"` | |
| `delivered_vs_not` | `"delivered"` \| `"not_delivered"` \| `null` | strongest durability signal; null = not surfaced |

**Silent failure:** if you write `amount_raised_usd` instead of `amount_raised`, the scorer reads it as `undefined`, stamps it as `null`, and the validation still runs (lane B gets stamped) — but the dollar figure is lost. No error is thrown.

**Minimal valid crowdfunding_stats for a known-funded-delivered campaign:**
```json
{
  "amount_raised": 350000,
  "backer_count": 2300,
  "funded_vs_failed": "funded",
  "delivered_vs_not": "delivered"
}
```

---

## 5. funnel-score.js — which file to pass as input

`funnel-score.js` reads `pkg.bound_ads` and `pkg.crowdfunding_stats` from the input file. Use the **assembled package** (from `funnel-assemble.js` or the stub), not the clean output.

| Source type | Input to funnel-score.js |
|-------------|--------------------------|
| DTC with ads | assembled package from `funnel-assemble.js` (has `bound_ads`) |
| DTC stub (no ads) | the stub package JSON (has `bound_ads: []`) |
| Crowdfunding | assembled package from `funnel-assemble.js` with `crowdfunding_stats` added |

**Do NOT pass `funnels-clean/` output to `funnel-score.js`.** The clean output (`funnel-clean.js`) writes `cleaned_body` and `review_blocks` but does NOT carry `bound_ads` or `crowdfunding_stats`. Passing it gives the scorer no ads and no crowdfunding stats, guaranteeing `lane: unknown` for every brand — including ones where you have valid crowdfunding data.

In the arduview run, the first 3 DTC brands were scored from clean output instead of assembled packages. For brands with no crowdfunding stats this produced the same `lane: unknown` result either way, but the pattern is wrong. Always score from the assembled package.

---

## 6. Context injection to the Section Analyzer

The SKILL.md states (load-bearing truth #1):

> The Section Analyzer NEVER Reads files. funnel-analyzer-context.js deterministically assembles [DR bundle] + [cleaned funnel body in <funnel_copy>] and the orchestrator EMBEDS those bytes into the Section Analyzer's spawn prompt.

In this run, the orchestrator instead told the Section Analyzer subagents to `Read` a pre-assembled context file. This worked because the file existed and the verbatim-refs gate still enforced correctness — but it violates the design.

**Correct procedure:**
1. Run `node tools/funnel-analyzer-context.js --funnel=<funnel_id> [--space=<space>] [--clean=<path>]` as the orchestrator.
2. Capture stdout (or use `--out=<path>` to write to a file the orchestrator reads).
3. Embed those bytes directly in the Section Analyzer's Task prompt, between the `<funnel_copy>` markers.

The Section Analyzer prompt already contains the fallback: "FALLBACK ONLY — if for some reason the bundle is absent from your context, regenerate it with `node tools/hooks/inject-dr.js`." Do not rely on this fallback as normal operation — it only works if the subagent has file-read access and the DR bundle exists on disk.

---

## 7. Kickstarter campaign unavailability fallback

The GameShell 2018 KS campaign page is 404. Wayback Machine blocks archiving of Kickstarter pages. The original pledge tiers, backer-count page, and "backed by X people" stats are unrecoverable from the page itself.

**What to do:**

1. Pull campaign stats from secondary sources: brand's "about" or press page, crowdfunding analytics sites (BackerKit, Kicktraq), press coverage, or the creator's product page history.

2. Use the current DTC product page (`corpus/<brand>/raw/home.html`) as `landing_page_body`. Note in `_provenance._note` that the original KS page is 404 and the body is the current product page. This is what was done for GameShell.

3. Populate `crowdfunding_stats` from whatever secondary data you can verify. Do not fabricate. For GameShell: `amount_raised: 350000`, `backer_count: 2300`, `funded_vs_failed: "funded"`, `delivered_vs_not: "delivered"` — sourced from press coverage and the creator's site text.

4. The current product page (clockworkpi.com/gameshell) lacks pledge tiers and ship-scaffolding copy. The Section Analyzer will note sparse belief coverage for `it-will-ship` and `act-now` — this is accurate and correct, not a pipeline failure.

5. Set `source_type: "crowdfunding"` in the stub so the Router and Section Analyzer receive the correct signal. The funnel-score.js will correctly stamp lane B from `crowdfunding_stats` even if the LP body is thin.

---

## 8. funnel_fields persistence gap — funnel-store.js reads from the assembled package, not the analyzer output

`funnel-store.js` builds the stored record (`runs/<space>/funnels/<funnel_id>.json`) by reading 6a funnel-level fields (`primary_claim`, `claim_type`, `awareness_entry`, `funnel_sequence`, `offer_mechanic`, `urgency_construction`) from the **funnel_package input** (the `--funnel` or `--dir` argument). The Section Analyzer writes these fields into a `funnel_fields` wrapper object in its output JSON — but `funnel-store.js` does not read from `funnel_fields`. It reads from `funnelPkg.primary_claim` etc. (lines 125–131 of `tools/funnel-store.js`).

**Result:** if the assembled/scored package has `primary_claim: undefined` (which it does — this field is set by the Analyzer, not by assemble/score), the stored file will have `primary_claim: null` even if the Analyzer produced a correct value.

**Confirmed in this run:** all 4 stored funnels (`runs/arduview/funnels/*.json`) have `primary_claim: null`, `awareness_entry: null`, etc. The correct values are in `runs/arduview/funnels-analyzer-out/*-beliefs.json` under `funnel_fields`.

**Workaround (until funnel-store.js is patched):** read `funnel_fields` from `runs/<space>/funnels-analyzer-out/<funnel_id>-beliefs.json` when you need `primary_claim`, `awareness_entry`, `funnel_sequence`, `offer_mechanic`, or `urgency_construction`. The `belief_records[]` array in the stored files is correct — only the 6a fields are missing.

**The fix:** `funnel-store.js` `buildStoredRecord()` should also accept the beliefs JSON and merge `funnel_fields.*` into the record before writing. Currently it only reads `beliefRecords` (the array), not the wrapper object that contains `funnel_fields`.

---

## Quick reference — step order and correct inputs

```
corpus/<brand>/raw/home.html          ← source for landing_page_body
              ↓
[stub package JSON if no ads, else funnel-assemble.js output]
              ↓
funnel-clean.js <stub-or-assembled.json>  → funnels-clean/<funnel_id>.json
              ↓
funnel-score.js <stub-or-assembled.json>  → funnels-scored/<funnel_id>-scored.json
    NOTE: pass the ASSEMBLED package, not the clean output
              ↓
funnel-analyzer-context.js --funnel=<id>  → embed stdout in Section Analyzer prompt
              ↓
Section Analyzer subagent (quality model, embedded context)
    → funnels-analyzer-out/<funnel_id>-beliefs.json
    {
      "funnel_fields": { ... },      ← 6a fields live HERE (not in stored file)
      "belief_records": [ ... ]
    }
              ↓
funnel-store.js --funnel=<scored.json> --beliefs=<beliefs.json>
    → funnels/<funnel_id>.json       ← belief_records[] correct; 6a fields = null (bug)
              ↓
funnel-vectorize.js --space=<space>  → funnels/_index.json
```
