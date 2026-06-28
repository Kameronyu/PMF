# ORGANIZE-REPORT — mechanized KB context-engineering pass

**Date:** 2026-06-26  ·  **Input:** `kb/kb-mechanized.zip` (45 skills)  ·  **Tool:** kb-organizer (context-engineering lane)

**Result: COMPLETE.** Every preservation and MECE gate passes; a separate adversarial reviewer signed off (PASS) after one reconcile round. No marketing wording, specimen, scoring gate, or heading was altered — only `name`/`description` frontmatter, additive `## See also` footers, and new navigation files (`KB-INDEX.md`).

---

## What changed (and what deliberately did not)

| Surface | Action |
|---|---|
| `description` frontmatter (all 45) | Rewritten to the MECE 5-slot shape (job · Use when · Covers · Does NOT cover→use kb-Y · WRITES/SCORES+pair · Triggers) |
| `name` frontmatter | Unchanged — all 45 already accurate & consistent with their folder (verified) |
| Skill bodies / specimens / gates / headings | **Untouched, byte-for-byte** (script-verified) |
| References (162 files) | **Untouched, byte-for-byte** |
| File/folder boundaries | No merges, no renames, no splits |
| New navigation | `KB-INDEX.md` (job→files routing) + a `## See also` footer on each skill |

## Pipeline & results

### S0 INVENTORY
45 skills, all `name == folder` (internally consistent), all lean (SKILL.md bodies 74–124 lines, 5.5–11.4 KB; 162 reference files). Read-only snapshot `kb.before/` captured before any edit. **0 exact body-duplicate groups.**

### S1 DEDUP — verbatim redundancy
Mechanical detector found **0 literal duplicates** and **0 shared reference files**. The only verbatim line-overlaps were the *intentional* write↔score pairs of the same topic sharing a few specimen lines by design. 28 candidate pairs (conceptual + cross-topic) were each judged by an independent agent, biased hard to KEEP-SEPARATE:

- **28 KEEP-SEPARATE · 0 MERGE · 0 LITERAL-DUP**

Every conceptually-overlapping pair (e.g. `kb-cro-score` vs `kb-conversion-optimization-score`) was confirmed to share *zero* gates/specimens — same word, different instrument (e-commerce page benchmarks vs Hormozi offer-economics). Nothing merged. Sample verdicts:

- `kb-cro-score` ~ `kb-conversion-optimization-score` → **KEEP-SEPARATE** (high): These two files are structurally similar scorer skills but score entirely different domains with different gate sets, benchmarks, and thresholds. File A (kb-cro-score) is an e-comm…
- `kb-cro-write` ~ `kb-conversion-optimization-score` → **KEEP-SEPARATE** (high): These are a deliberate WRITE/SCORE sibling pair. kb-cro-write generates on-page conversion copy (headlines, CTAs, cart nudges, checkout microcopy) and explicitly defers all grading…
- `kb-upsells-score` ~ `kb-upsells-and-monetization-score` → **KEEP-SEPARATE** (high): The two files are fundamentally different scoring frameworks. File A (kb-upsells-score) covers AOV/OTO funnel mechanics for e-commerce with 5 countable gates plus 2 felt/pairwise s…
- `kb-upsells-score` ~ `kb-aov-optimization-score` → **KEEP-SEPARATE** (high): These two scoring skills are clearly distinct despite sharing broad AOV/upsell domain territory. They grade different things with different gate structures, different bands, and di…

### S2 TAXONOMY
9 concept clusters assigned (every slug placed once). **0 renames** (no name lies found). Variant families that share a concept but differ in content were recorded as keep-separate aliases, NOT merged:

- **conversion-optimization**: `kb-cro-score`, `kb-cro-write`, `kb-conversion-optimization-score` — kb-cro-* are e-commerce funnel-benchmark CRO (page benchmarks, cart/checkout microcopy); kb-conversion-optimization-score is Hormozi unit-economics/offer gates 
- **upsells-and-AOV-monetization**: `kb-upsells-score`, `kb-upsells-write`, `kb-upsells-and-monetization-score`, `kb-aov-optimization-score` — kb-aov-optimization-score grades the order-page + post-purchase sequencing config against benchmark bands; kb-upsells-score grades an OTO stack/sequence/tier-fo
- **pricing-vs-offer**: `kb-pricing-score`, `kb-offer-construction-score`, `kb-offer-construction-write` — kb-pricing-score judges brand-premium price viability; kb-offer-construction-score judges the structural soundness of a value-stacked offer; kb-offer-constructi
- **persuasion**: `kb-persuasion-score`, `kb-persuasion-write`, `kb-persuasion-and-sales-score`, `kb-persuasion-and-sales-write`, `kb-consumer-psychology-score` — kb-persuasion-* targets cold-traffic strangers with zero trust (guarantee/scarcity/authority stack); kb-persuasion-and-sales-* targets warm 1:1 sales (closes, o
- **ads-creative-advertising**: `kb-ads-score`, `kb-ads-write`, `kb-advertising-score`, `kb-advertising-write`, `kb-ad-creative-score`, `kb-ad-creative-write` — kb-ads-* is general direct-response ad creative (hook/headline/CTA); kb-advertising-* is Hormozi countable campaign gates (Rule of 100, creative-quality→daily-s
- **email-retention**: `kb-email-marketing-score`, `kb-email-and-retention-score`, `kb-email-and-retention-write` — kb-email-marketing-score is an e-commerce email/SMS retention-floor benchmark check; kb-email-and-retention-score is Hormozi lifecycle/retention threshold scori
- **funnel-page-types**: `kb-funnel-architecture-score`, `kb-funnel-architecture-write`, `kb-quiz-funnel-score`, `kb-quiz-funnel-write`, `kb-advertorial-score`, `kb-advertorial-write`, `kb-landing-pages-score`, `kb-landing-pages-write` — kb-funnel-architecture-* is whole-funnel flow/architecture; kb-quiz-funnel-* is the quiz mechanic specifically (questions, diagnosis, loading screen); kb-advert
- **copywriting-vs-vsl**: `kb-copywriting-score`, `kb-copywriting-write`, `kb-vssl-score`, `kb-vssl-write` — kb-copywriting-* is general short-to-mid direct-response copy (headlines, hooks, ad body, naming); kb-vssl-* is the video-sales-letter long-form script specific

### S3 NAME + DESCRIBE
All 45 descriptions rewritten (frontmatter only) to the 5-slot routing shape. Each `Covers:` line was written against the file's actual headings (honesty gate); each carries an explicit `Does NOT cover X → use kb-Y` boundary to its most-confusable siblings.

### S4 SIZE / COHERENCE
**0 oversize skills** (all bodies < 125 lines). **0 grab-bag/incoherence flags** — every name is honest to its contents (no split or re-mechanize needed).
Advisory: descriptions run ~150 words (827–1236 chars) — longer than the 60–110-word guide, a deliberate trade to fit the multiple boundary clauses MECE required. No action needed.

### S5 INDEX
`KB-INDEX.md` built: WRITE/SCORE explainer, a **job→files routing table** (40+ concrete jobs, each routed to the right one of any confusable pair with a one-phrase reason), 9 cluster sections with one-line purposes, and a glossary pointer to `term_registry.json` / `definitions.md`. A ≤3-link `## See also` footer was appended to each skill.

### S6 VERIFY
- `check_preservation.py` → **PASS**: every pre-existing body line (headings included) and every reference survives byte-for-byte; only `name`/`description` changed; footers are append-only; links resolve.
- `check_descriptions.py` → **PASS**: 44 near-neighbor pairs all cross-point; every boundary clause present; all pointer targets resolve; 0 verbatim trigger collisions.
- **Adversarial reviewer (separate agent), 2 rounds:** round 1 → REVISE (7 cross-point gaps + 5 trigger collisions); reconciled; round 2 → caught 1 residual (guarantee-writing overlap between `kb-offer-construction-write` & `kb-persuasion-write`); fixed; **final → PASS.**

## Reconcile log (the only post-workflow edits)
Cross-pointer pairs made bidirectional: ads-write↔copywriting-write, case-studies-score↔customer-data-score, cro-write↔upsells-write, ecommerce-score↔product-research-score, funnel-architecture-write↔landing-pages-write, offer-construction-score↔persuasion-and-sales-score, persuasion-write↔social-proof-score, aov-optimization-score↔upsells-score, offer-construction-write↔persuasion-write. Trigger phrases de-collided (single owner each): "score this offer", "score this product", "score this upsell", "score this funnel", "rewrite this ad copy", and "write a/the guarantee".

## Escalations
**None requiring a human or a mechanizer re-run.** No skill needed a content split; no name misrepresented its file; nothing could only be fixed by touching marketing wording.

## Membership test
- [x] Captured kb.before/ before editing; changed ONLY name/description + new nav (footers/index) — never wording/headings
- [x] check_preservation.py confirms every body line survives whole-line; only name/description changed; 0 bogus renames honored
- [x] check_descriptions.py passes — near-neighbors cross-point, no MECE gap
- [x] DEDUP merged only mechanically-clear redundancy — defaulted to KEEP-SEPARATE (0 merges on interpretive calls)
- [x] Every description is 5-slot, honest Covers:, with Does NOT cover→use kb-Y; the set is MECE
- [x] Oversize/incoherent skills: none; nothing silently rewritten
- [x] KB-INDEX.md has a job→files routing table + one-level See also links
- [x] A SEPARATE reviewer (not the producer) checked MECE + marketing non-degradation → PASS
- [x] Mechanical work lives in scripts/ (inventory, dedup, preservation, descriptions); reproducible

## Artifacts in this folder
- `KB-INDEX.md` — navigation / routing table
- `renames.json` — `{}` (no renames)
- `clusters.json` — near-neighbor adjacency used by the MECE gate
- `ORGANIZE-REPORT.md` — this file

