<!-- SOURCE-OF-TRUTH BUILD SPEC (verbatim, untouched). Build prompts/scripts FROM this; do not re-litigate.
     This is the COLLECTION LAYER of PMF Step 2 (deep market study) — birdseye synthesis is OUT of scope here.
     Supersedes the prose `deep-market-analysis-framework.md` for the build (that file keeps the strategic "why").
     GSD: Phase 3 / Stage M1-S3. Pasted into the Phase-3 discuss 2026-06-03. -->

# Phase 2 Funnel Analysis — Build Specification (Collection Layer)

This document specifies everything to be built for the deep-analysis stage **up to, but not including, the birdseye synthesis agent**. The birdseye agent is downstream and out of scope here; this doc's job is to guarantee the collection layer produces records complete enough for the birdseye agent to do its work later.

This is a build spec for an implementer (Claude Code session). It assumes the implementer has access to the project repo. The implementer is NOT assumed to know direct-response (DR) marketing — where marketing judgment is required, this doc names the exact DR source files to load.

---

## 0. MANDATORY FIRST STEP FOR THE IMPLEMENTER — read before building anything

Before writing any agent, prompt, or schema, the implementer MUST locate and read these repo files to conform to existing conventions. Do not invent tag vocabularies, output formats, or naming conventions — inherit them.

- **`capability-inventory.md`** (or similarly named capability/workflow doc). Read it to understand what capabilities already exist, what the agentic architecture looks like, and how new agents plug in.
- **The PMF-stage output schema** (the stage that runs before this one — supply-side validation / market selection output). Read its output record format. Phase 2 collection CONSUMES this output (transformation match, niche, validation data per competitor). The field names, tag conventions, and JSON/markdown structure used there are AUTHORITATIVE. Match them exactly.

> Note on terminology: this system uses "stages," not "phases," in some places and the reverse elsewhere. Use whatever term the existing repo docs use. Do not introduce a competing term.

**Standardization rule (applies to every schema field, tag, and file-naming decision in this doc):** Wherever this spec describes WHAT to capture but the exact tag value, field name, or serialization format is left open, the implementer resolves it by matching the convention already established in the PMF-workspace repo docs above. Any discrepancy that is NOT a marketing-knowledge question — i.e. it's about how to write a tag, what schema format to serialize to, or how to name a file — is resolved by conforming to the existing repo, NOT by the implementer's own choice. Only marketing-knowledge questions (what is a belief, what is an execution type) are resolved from the DR files named in this doc.

---

## 1. WHAT THIS LAYER BUILDS — the shape of the thing

The collection layer takes one **funnel** (the locked unit of analysis) and produces a set of structured **belief-instance records** plus a small set of **funnel-level fields**, tagged with validation strength, ready to be piled together by the birdseye agent across all funnels in a market.

The pipeline, in order:

```
[Scraper/Assembler]  mechanical — pull ads + LPs, BIND ads→LP by destination URL into
                     one funnel_package per funnel (§2b), + validation data
      |
[Cleaner/Verbatim]   mechanical — clean, section-marked verbatim copy (incl. on-page reviews)
      |
[Validation Scorer]  mechanical — compute validation_strength per funnel, two currencies
      |
[Section Analyzer]   JUDGMENT — the workhorse. Emits belief-instance records.
      |
   (outputs land in a store the birdseye agent reads later — birdseye NOT built here)
```

Four components to build. Three are mechanical (cheap model / dumb scripts). One requires marketing judgment (the Section Analyzer).

---

## 2. THE LOCKED UNIT OF ANALYSIS

**One funnel = one congruent funnel path:** one angle, one transformation, one awareness entry, with the ads bound to the page they feed. NOT the competitor (a competitor with three distinct funnels is three units). NOT a single ad (half a sentence without its page).

A funnel's record set therefore is: the funnel-level fields (recorded once) + N belief-instance records (one per belief installed in the funnel) + the ad set bound to it (for validation).

---

## 2b. HOW A FUNNEL IS DISCOVERED AND ASSEMBLED (the scraper's real job — read carefully)

This is the part that is easy to under-spec. "Scrape the ads and the LP" hides the actual hard problem: **binding which ads feed which landing page, and splitting one competitor into multiple funnels when they run more than one path.** Do not treat this as trivial collection. The binding IS the unit definition.

**The binding key is the landing-page URL.** Meta Ad Library exposes, per ad, the destination URL (the LP the ad's CTA points to). That URL is how ads cluster into funnels:

1. **Pull all of a competitor's active ads** from Meta Ad Library (by Page name). For each ad capture: creative, primary text, headline, CTA button text, **destination URL**, started-running date, impression bucket, platforms.
2. **Normalize destination URLs.** Strip tracking params (utm_*, fbclid, etc.) so `site.com/deep-work?utm=x` and `site.com/deep-work?utm=y` resolve to the same LP. Normalize trailing slashes, case, and protocol. This normalization is what makes the clustering correct — get it wrong and one funnel splatters into ten.
3. **Cluster ads by normalized destination URL.** Each distinct destination LP = one candidate funnel. All ads pointing to it = that funnel's bound ad set. `variant_count` for the funnel = number of distinct active ads in the cluster.
4. **Fetch each destination LP** (the actual page the ads point to) — full rendered copy, all sections, on-page reviews. This is the page body the cleaner will process. Use a real browser render (Playwright), because most DTC/crowdfunding LPs are JS-rendered and a raw fetch returns empty shells.
5. **One competitor → possibly several funnels.** If a competitor's ads point to three different LPs, that's three funnels, each its own package. This is the "competitor with three distinct funnels is three units" rule, made mechanical: the destination-URL clusters ARE the funnels.

**Crowdfunding nuance.** A crowdfunding funnel may have NO trackable Meta ads (it's driven by the platform's own traffic, email, press). In that case the funnel is just: the crowdfunding project page itself (the LP), with no bound ad set, and validation comes from Currency B (raise/backers — §3) instead of ad longevity. The assembler must handle "LP with zero bound ads" as a valid funnel, not an error. Conversely, an in-transformation brand may run Meta ads INTO a crowdfunding page — then it has both a bound ad set (Currency A) and raise data (Currency B); record both, let birdseye weight per lane.

**Edge cases the assembler must not choke on:**
- Ad destination is a linktree / homepage, not a dedicated LP → flag as `ambiguous_destination`; do not force it into a funnel. A homepage is not a congruent path.
- Same LP reached by ads with wildly different angles → still one funnel by URL, BUT the differing ad angles are data: capture each ad's angle. (The "one angle per funnel" ideal can be violated by a competitor; record what's actually there, don't force-correct it. Birdseye can later see a funnel being run at multiple angles.)
- Multiple near-identical LPs (A/B variants at different URLs) → keep as separate funnels; their similarity is birdseye's to notice, not the scraper's to merge.

**What the assembler outputs per funnel — the package handed to the cleaner:**
```
funnel_package {
  funnel_id
  competitor
  source_type                 (DTC / crowdfunding — from PMF stage)
  landing_page_url            (normalized)
  landing_page_body           (full rendered copy + on-page reviews, raw)
  bound_ads[] {               (may be empty for crowdfunding)
     ad_creative_ref, primary_text, headline, cta_text,
     started_running_date, impression_bucket, platforms
  }
  crowdfunding_stats { amount_raised, backer_count, funded_vs_failed, delivered_vs_not }  (if applicable)
}
```
The cleaner reads `landing_page_body` and produces section-marked clean copy. The scorer reads `bound_ads[]` and/or `crowdfunding_stats` and computes validation. The section analyzer reads the cleaned copy + the bound ads' angles (ads are part of the congruent path — the ad's hook is the funnel's awareness-entry signal).

> So yes: the implementer will know "this ad links to this LP" — it's the normalized destination URL that establishes it, and the cluster of ads sharing that URL IS the funnel. This binding step is the spine of the scraper, not an afterthought.

---

## 3. THE TWO VALIDATION CURRENCIES (LOCKED — mechanical, no judgment)

Validation strength is computed by the scorer and stamped onto the funnel. **Two currencies. Do NOT normalize them into one number.** Keep them as separate lanes; carry a `validation_lane` field so downstream knows which kind of proof backs a funnel.

### Currency A — ad-driven funnels (DTC and ad-fed crowdfunding)
Source: Meta Ad Library (free, public). Signal:
- `max_run_duration_days` — the spine. 60+ days ≈ top ~11% of all ads (anti-fluke floor). Computed from each ad's "started running on" date at scrape time.
- `impression_bucket` — coarse range bucket (under-1K … 1M+), available per ad since early 2026. Multiplier.
- `variant_count` — number of distinct active ads pointing to the same LP. More variants ≈ more spend. Multiplier.

Note for scraper: Meta does not archive paused ads and shows no spend/CTR for commercial ads. Validation is a point-in-time snapshot; "started running on" date IS the baked-in history. If the competitor runs ads in the EU, flip the country filter to an EU market for tighter impression/reach ranges (DSA-mandated) — optional richer pass.

### Currency B — crowdfunding funnels
Source: the crowdfunding platform page (Kickstarter / Indiegogo / Crowd Supply — free, permanent). Signal:
- `amount_raised`
- `backer_count`
- `funded_vs_failed`
- `delivered_vs_not` (did a prior campaign by this creator actually ship — strongest durability signal)

Committed money, not modeled traffic. This is a STRONGER signal than any traffic estimate, which is why we do not use SEMrush/Similarweb traffic for validation (modeled, weak at low volume, gated/paid for history anyway).

### Cross-currency rule
The birdseye agent (later) weights WITHIN each lane and reports which lane backs each proven move. The collection layer's only job here is to stamp the funnel with the right currency's numbers + the `validation_lane` tag. No conversion between currencies.

---

## 4. ONE PROMPT + ROUTING FLAG (LOCKED — not two prompts)

There is **one** section-analysis prompt and **one** record schema for every funnel. There is NOT a separate "structure" prompt and "messaging" prompt. What differs by source is a **routing flag** set at plan time (from the PMF-stage transformation-match + source-type data), which tells downstream which fields are load-bearing for that funnel:

| Source type (from PMF stage) | routing_flag | What's load-bearing |
|---|---|---|
| Crowdfunding, OFF your transformation | `structure_only` | Keep belief-sequence, container, ship-scaffolding, offer-mechanic. **Discard their specific claims/angles** — they're for a different transformation and would pollute the messaging pile + corrupt birdseye's whitespace map. |
| In-transformation brand (DTC or crowdfunding) | `messaging_full` | Keep everything, especially claims/angles/proof — this is your proven persuasion. |
| In-transformation crowdfunding | `both` | Richest source. Keep everything — container AND message. |

The agent runs the same full extraction regardless. The flag governs what gets KEPT and what gets marked discard-for-messaging-purposes. The flag is a funnel-level field set at plan time, NOT inferred by the agent.

**Rationale the agent must understand (put this in its prompt):** We take winning *messaging* from real in-transformation brands and adapt it to the *funnel container and awareness level* of a crowdfunding campaign. Structure is transformation-independent (a will-it-ship machine works the same regardless of what's being sold); messaging is transformation-specific (only borrow it from brands selling our transformation). The adaptation to awareness happens later at the merge step — the analyzer COLLECTS angles regardless of the awareness temperature they ran at, and never warms/cools them itself.

---

## 5. SECTION DELIMITATION RULE (LOCKED)

**One section = one belief installed (or reinforced) at one point in the funnel.**

- A belief can be installed in one place and reinforced elsewhere. "Will it ship" installed in section 1 and reinforced in section 4 = TWO belief-instance records, **same `belief_id`, different `position`.**
- The Cleaner produces clean copy with structural markers (it stays dumb — it does NOT decide belief boundaries).
- The Section Analyzer decides belief-unit boundaries (it reads the marked copy and segments by belief-job). This is where the cut happens, because cutting requires marketing judgment and the cleaner has none.
- `position` MUST be a **funnel-level ordinal** (1st belief-instance encountered, 2nd, 3rd…), NOT "section 3 of the page." Birdseye aligns funnels by belief sequence and cannot do it if position is page-local. This is a known failure point — get it right.

---

## 6. THE RECORD SCHEMA

### 6a. Funnel-level fields (recorded ONCE per funnel)

| Field | Source | Notes |
|---|---|---|
| `funnel_id` | scraper | unique |
| `competitor` | PMF stage | |
| `source_type` | PMF stage | crowdfunding / DTC |
| `transformation` | PMF stage | the ONE transformation this congruent funnel sells. Already known from PMF stage — do not re-derive. |
| `primary_claim` (verbatim) | analyzer | the headline claim the funnel leads with |
| `claim_type` | analyzer | direct / enlarged / mechanism / enhanced (from differentiator + selection framework). The funnel's top-line claim type. |
| `niche` | PMF stage | confirms proven spend is for OUR niche |
| `routing_flag` | plan time | structure_only / messaging_full / both (see §4) |
| `awareness_entry` | analyzer | where on the awareness ladder the funnel OPENS (unaware → most-aware). Read off problem-education load: count sentences before product is named; is the problem explained or assumed. |
| `funnel_sequence` | analyzer | ordered list of pages and what each does (the container skeleton) |
| `offer_mechanic` | analyzer | deposit / tiered pledge / early-bird / founder pricing / bundle / guarantee — the commitment hook |
| `urgency_construction` | analyzer | the mechanic AND the number (e.g. "first 200 at $X then steps to $Y"), not just "they used urgency" |
| `validation_lane` | scorer | A or B |
| `validation_strength` | scorer | the currency-appropriate numbers (§3) |

> NOTE on the claim/transformation question: transformation and primary_claim live at the funnel level because the locked unit IS one congruent transformation. They are NOT per-section fields. Sub-claims (specific assertions made by individual sections in service of the transformation) are NOT a separate field — they are captured *inside the execution detail* of each belief-instance record, which is why execution capture must be granular (see §6b). Birdseye mines sub-claim saturation out of the granular execution text. Belief frequency ≠ claim frequency; the granularity is what lets birdseye separate "healthy shared belief sequence" from "saturated identical sub-claim = dead ground."

### 6b. Belief-instance records (one per belief installed/reinforced — N per funnel)

| Field | Notes |
|---|---|
| `funnel_id` | links to parent funnel |
| `position` | funnel-level ordinal (§5) |
| `belief_id` | the belief being installed. Open-with-anchors taxonomy (§7). |
| `belief_confidence` | flag for overflow beliefs the agent proposed outside the anchor set (§7) |
| `execution_type` | controlled vocab — HOW the belief is installed (mechanism-explanation / feature-as-evidence / demo / authority / social-proof / founder-credibility / risk-reversal / scarcity / story-epiphany / comparison …). Vocab finalized at implementation against repo conventions — see §9. |
| `execution_detail` | **GRANULAR free text.** The specific install, captured specifically enough that the sub-claim is recoverable. E.g. NOT "they build trust" but "founder names the exact factory, shows a dated production photo, and states he has placed the full MOQ order himself — installing ship-confidence via founder-financial-skin-in-game." This granularity is load-bearing: it's where sub-claims and proof-detail live for birdseye and for the copywriter corpus. |
| `proof_tier` | Tier 1 self-evident/demo · Tier 2 authority · Tier 3 social proof (from differentiator framework believability tiers). Which proof type carries this belief. |
| `moves[]` | the discrete persuasive moves in this section (tagged) |
| `verbatim_refs[]` | pointers to the exact verbatim copy that executed this belief — for the language corpus / later RAG. Tag whether the verbatim is competitor-marketing or on-page-review language. |

### 6c. On-page reviews (scope-limited)
On-page reviews (reviews living ON the scraped funnel page) ARE captured — they're part of the funnel artifact and the cleaner already has them. Capture them into `verbatim_refs[]` tagged as `review_language`. **Do NOT build a separate review-mining / VOC pipeline** — full review mining is VOC research, explicitly deferred and out of scope for Phase 2.

---

## 7. THE BELIEF TAXONOMY (open-with-anchors)

The Section Analyzer classifies each belief-instance against this anchor set. It is **open-with-anchors**: prefer an anchor; if a section installs a belief that fits none, propose a new `belief_id` and set `belief_confidence` low so the operator can review overflow. This keeps mergeability (anchors aggregate cleanly at birdseye) while catching genuine novelty.

The anchor set (the shallow shelf — depth lives in `execution_detail`, NOT here):

1. **problem-exists** — there is a problem / the prospect has it
2. **problem-matters** — the problem costs you something; consequences of inaction
3. **past-solutions-failed** — why what they've tried didn't work (validates past effort, opens room for the mechanism)
4. **mechanism-is-the-reason** — this specific mechanism is WHY the solution works (the UM)
5. **product-delivers-transformation** — this product produces the transformation for someone like you (features-as-evidence live here)
6. **trust-the-brand-or-founder** — the people behind this are credible
7. **it-will-ship** — the promised product will actually be delivered (crowdfunding-load-bearing; near-absent in standard DTC)
8. **it's-worth-the-price** — value relative to cost; anchor logic
9. **act-now** — urgency/scarcity; reason to commit now vs later

Anchors 1–5 map to Carl's pre-sale warming sequence and 8-stage advertorial/VSL structure. 6–9 map to the cold-offer persuasion elements + crowdfunding scaffolding. The agent should be told these anchors are the typical INSTALL ORDER for cold→converted, but funnels reorder, skip, and repeat freely — `position` records actual order, the anchor list is not a required sequence.

---

## 8. DESCRIPTIVE-NOT-PRESCRIPTIVE DISCIPLINE (critical — put in the analyzer prompt)

The Section Analyzer **records what proven funnels do; it does not judge whether they're right or improve on them.** Hard rules for the prompt:

- The agent NEVER evaluates whether a move is "good" or whether a feature is "actually persuasive." A long-running, high-validation funnel leading with feature X IS the evidence that X works. The `validation_strength` is the judgment; the agent's opinion is not.
- The agent NEVER rewrites, optimizes, or suggests better copy. It extracts and tags. (Word-choice/copy-quality analysis is a different altitude and explicitly out of scope — folding it in produces mush. Verbatim goes to the corpus untouched; a later copy pass mines it.)
- The agent operates on ONE funnel at a time. It NEVER reasons about "the pool," consensus, or divergence — those don't exist at single-funnel resolution. Divergence is computed later by birdseye from the pile. Any agent attempt to flag "this is unusual" is a bug.
- The agent observes first, classifies second. Failure mode of an untrained agent is interpreting before observing ("they use urgency to drive FOMO" = mush). Force two internal passes: (1) record literal facts ("a countdown showing 6 days sits above the pledge button"); (2) map to tags via the rubric ("countdown with hard deadline → urgency_construction, time-based; act-now belief"). Each tag has a decision rule so the agent matches rather than emotes.

---

## 9. CONTROLLED VOCABULARY — DEFERRED TO IMPLEMENTATION

The exact value lists for `execution_type`, `proof_tier`, `claim_type`, and `move` tags are NOT finalized in this doc. At implementation:
- Resolve them into a single controlled vocabulary,
- Standardized to match the tagging conventions already in the PMF-workspace repo (see §0),
- So nothing breaks when birdseye and the vector-DB ingestion read these records later.

This is an implementation/standardization task, not a marketing-strategy decision. Conform to the repo.

---

## 10. BIRDSEYE COMPLETENESS CHECK (why the schema is shaped this way — birdseye NOT built here)

Confirming the records above contain everything the future birdseye agent needs, so we don't discover a missing field after collection is done:

| Birdseye job | Needs | Present? |
|---|---|---|
| Align funnels by belief | `belief_id` | ✓ |
| Build the proven belief-spine (consensus sequence) | `position` (funnel-level ordinal) | ✓ §5 |
| Weight proof | `validation_strength` + `validation_lane` | ✓ |
| Map dead-ground vs whitespace | claim/sub-claim frequency — from `primary_claim`+`claim_type` (funnel) and granular `execution_detail` (sub-claims) | ✓ §6b granularity requirement |
| Tell builder which proof backs a move | `proof_tier` + `verbatim_refs` | ✓ |
| Surface validated divergences (spine + divergences output) | the pile of records weighted by validation — computed by birdseye, NOT recorded per-funnel | ✓ correctly absent from collection |

**Decision recorded for birdseye (not built now):** its output is **spine + divergences** — the consensus belief sequence AND the points where strongly-validated funnels break consensus (candidate whitespace plays). This is interpretive/judgment-heavy and DR-knowledge-heavy; it is the one genuinely "smart" agent. Noting it here only so the collection records are confirmed sufficient to feed it. No collection-layer field is missing for it.

---

## 11. DR MARKETING FILE ASSIGNMENTS — which agent needs which knowledge

The implementer is not assumed to know DR marketing. Below: exactly which DR source files each build needs.

**Hard rule on how DR knowledge is used — read this before §11 details:**
- For every agent EXCEPT the Section Analyzer: the **orchestrator** reads DR files and BAKES the needed concepts, vocab, and decision rules INTO the prompt it writes. It does NOT inject raw DR docs into those agents' contexts. Those runtime agents receive self-contained prompts with the distilled logic written out.
- **The Section Analyzer is the exception: it DOES get the DR files at runtime — via a generated BUNDLE, NOT auto-injection.** There is NO harness auto-injection (the analyzer runs as a subagent where settings hooks do not fire — see the DR-bundle failure that shipped exactly this lie). `tools/hooks/inject-dr.js` concatenates the DR files named below (§11) into `prompts/_generated/section-analyzer-dr-context.md`; the analyzer's spawn-prompt assembler injects that bundle (plus the cleaned funnel copy) into the analyzer's context, or the analyzer Reads it as its first step. The operator does not hand-pick context per funnel — the bundle carries the chosen set every time. This doc specifies WHICH files (the marketing-strategy call). The implementer decides the WAY the bundle is loaded/trimmed/ordered/cached and how it is injected into or read by the analyzer — that is an implementation decision, not specified here.
- Mechanical agents (Scraper/Assembler, Cleaner, Validation Scorer) NEVER get DR anything.

### Scraper / Assembler — DR files needed: NONE
Pure data collection and binding. Mechanical, but NOT trivial — the ad→LP binding (§2b) is its real work. Build it to the §2b spec: pull ads, normalize + cluster by destination URL, render each LP, emit one `funnel_package` per URL cluster, handle the zero-ads crowdfunding case and the ambiguous-destination edge cases.

### Cleaner / Verbatim — DR files needed: NONE
Produces clean section-marked copy. Mechanical. (It marks structural breaks, it does NOT classify beliefs.)

### Validation Scorer — DR files needed: NONE
Arithmetic on §3 currencies. Mechanical.

### Section Analyzer — these DR files are bundled into its context at runtime (via inject-dr.js, NOT auto-injection)
Per the §11 rule, `tools/hooks/inject-dr.js` bundles these files into `prompts/_generated/section-analyzer-dr-context.md`, which the analyzer's spawn-prompt assembler injects (or the analyzer Reads as its first step) when it runs — there is no auto-injection hook. This doc picks the files (the strategy call); the implementer decides how to load/trim/order them. What each supplies:

- **`persuasion--carl-weische.md`** — the six cold-offer persuasion elements (social proof, authority, certainty/risk-reversal, scarcity, urgency, exclusivity) and the objection→element mapping. Core source for `execution_type` values and belief anchors 6–9.
- **`funnel-architecture--carl-weische.md`** — the four funnel types, the V-shape awareness model, the pre-sale 4-part framework, the 8-step advertorial structure, the six-section sales page. Core source for `funnel_sequence`, `awareness_entry`, and the belief INSTALL ORDER behind anchors 1–5.
- **`vssl--carl-weische.md`** — the 8-stage VSL narrative (hook → expand → authority → epiphany → problem-education → product-intro → solution-education → CTA). Reinforces the belief-install sequence and the "product not mentioned in first 50%" awareness logic. Use for recognizing story-epiphany and authority-building execution types.
- **`differentiator-framework__2_.md`** — the four levers (Market/UM/Angle/Offer), the claim-typing logic, and the believability tiers (Tier 1 self-evident / Tier 2 authority / Tier 3 social). Core source for `claim_type`, `proof_tier`, and the angle-lever tags inside `moves[]`.
- **`consumer-psychology-persuasion-buyer-behavior--mark-builds-brands.md`** — perceived-value and the trusted-source/quality-filter heuristic (why social proof and authority answer "has someone like me gotten this result"). Use to classify trust and proof execution correctly.
- **`offer-construction--carl-weische.md`** — offer/commitment-hook construction. Source for `offer_mechanic` and `urgency_construction` recognition.

Optional/secondary (inject only if testing shows the analyzer needs deeper coverage on that axis; not required for a first build):
- `advertorial--carl-weische.md` (advertorial-specific belief sequencing)
- `landing-pages--carl-weische.md` (page-section job recognition)
- `consumer-psychology--carl-weische.md` (awareness-level reading depth)

**Do NOT bundle all DR files.** The six files above are the load-bearing set to bundle into the Section Analyzer's context. The full library spans four educators with overlapping/competing vocab; bundling everything creates conflicting terminology and context bloat that degrades classification. Bundle the six; the optional/secondary files are added only if testing shows the analyzer needs deeper coverage on a specific axis.

### Anything left open that is NOT marketing knowledge
For any schema-format, tag-serialization, file-naming, or storage-location question that is NOT about marketing: do not decide it from DR files and do not improvise. Conform to what already exists in the PMF-workspace repo (§0). If the repo is silent, flag it for the operator rather than guessing.

---

## 12. STRATEGY DECISION STATE (what the operator has settled vs what's still open)

This section reports the state of the MARKETING-STRATEGY decisions only. It does NOT certify implementation-readiness — the implementer judges whether each piece is buildable and how to build it. "Settled" below means the strategy/collection intent is decided and stable, not that the engineering is figured out.

**Strategy settled — stable enough to hand to implementation:**
- Two validation currencies + no-cross-normalization rule (§3)
- The ad→LP binding logic and funnel-package definition (§2b) — the binding KEY (normalized destination URL) and clustering INTENT are settled; the implementer decides how to build the scraper/render/normalization
- Belief taxonomy, open-with-anchors (§7)
- Section delimitation rule (§5)
- One-prompt-plus-routing-flag (§4)
- Record schema (§6 — claim/claim_type at funnel level, granular execution carries sub-claims)
- Which DR files the Section Analyzer gets, and the bake-vs-inject rule (§11)

**Still needs the operator (marketing judgment):**
- Ratify the controlled-vocabulary value lists once they're drafted from the six DR files (§9). ~15 min of marketing-judgment ratification.

**Implementation decisions explicitly left to the implementer (NOT specified here — out of my lane):**
- How the scraper/assembler is actually built (render method, URL normalization implementation, clustering, storage)
- How the DR-file bundle is built + injected/read (inject-dr.js loading, trimming, ordering, caching, context limits) (§11)
- Schema serialization, tag formats, file naming, storage location — conform to the PMF-workspace repo (§0)
- Model choice / cost tier per agent
- Whether each piece is, in fact, ready to build — that is the implementer's call, not this doc's

**Explicitly deferred / out of scope for this layer:**
- Birdseye synthesis agent (downstream; records confirmed sufficient to feed it, §10)
- Vector-DB ingestion + RAG copywriter contract (downstream)
- Full review-mining / VOC pipeline (on-page reviews captured, §6c; deep VOC deferred)
- Word-choice / copy-quality analysis (different altitude, deferred, mined later from verbatim corpus)
- The pre-Phase-2 plan template (separate artifact; it sets per-market values: routing flags, belief-taxonomy instance, feature watchlist, awareness target, price decision, validation-lane note)
