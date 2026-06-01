# Capability Inventory

What the system needs to do, decomposed into atomic capabilities. **Not agents.** Agents are a downstream clustering decision — multiple capabilities may live inside one agent, or each may be its own. That call gets made per agent when writing specs, not globally up front.

Tags:
- **Op** — atomic operation, clean I/O, agentifiable
- **Orch** — composition/sequencing logic
- **Human** — judgment moment, not agentifiable (now or maybe ever)
- **Under** — not built enough to spec; flagged below as foundational or downstream

---

## Discovery / mapping

### Space-sketcher (partial-seed expander) — [Under, deferred]
Input: partial seed across {T-cat, P-cat, niche} at varying specificity.
Output: candidate completions for missing slots.
Status: deferred. Current research runs assume all 3 inputs known. Revisit when a partial-seed case appears.

### Per-brand extractor — [Op]
Input: brand URL or identifier.
Output: transformation(s), product, niche, sophistication signals (revenue estimate, social proof, distribution).
Notes: workhorse capability. Reused in Phase 0 (shallow scan) and Phase 2 (depth study, composed with other capabilities).

### Market aggregator — [Op]
Input: collection of per-brand outputs.
Output: claim count + types, mechanism inventory, trend velocity, sophistication patterns.
Notes: operates on the collection, not individuals. Separate from per-brand extractor.

---

## Deep brand/market study (Phase 2 capabilities)

### Ad creative + visual extractor — [Op]
Input: brand identifier.
Output: structured ad creative inventory + landing page visuals + copy (from Foreplay, Meta Ad Library, GetHookd, website scraping).
Tools: visual scraping, screenshot capture, Playwright.

### Offer/bundle structure extractor — [Op]
Input: brand identifier (specifically: landing pages, checkout flows).
Output: pricing, bundles, offer mechanics, free-shipping thresholds, subscription terms, guarantees.

### Channel analysis — [Op]
Input: brand identifier or market.
Output: traffic source breakdown (SimilarWeb), ad library presence/absence, social channel activity, channel concentration.
Notes: surfaces "competitors NOT scaling on Meta" → opportunity to be first on that channel.

### Trend / temporal signal — [Op]
Input: transformation or product or niche.
Output: trend velocity, "why now" signals, evergreen vs emerging classification, adjacent trend signals (TikTok virality, search trends, early adopter behavior).
Notes: called from Phase 0 mapping, Phase 1 filters, Phase 2 market eval.

---

## Mechanism research

### Mechanism research — [Op]
Input: transformation.
Output: known causes, biological pathways, existing solutions, evidence quality, IP/patentability signals, regulatory status, COGS floor signals, format candidates.
Notes: merged from prior "commercializable mechanism" (Phase 0) + "mechanism/science research" (Phase 3c). Same tools (scite, web of science, web search, Alibaba), same general operation, different framings of output. One capability.

### Product candidate discovery — [Op]
Input: transformation + Human-generated heuristic seeds (format change, household items, adherence issues, emerging product expansion).
Output: candidate products for the transformation.
Tools: Alibaba AI, emerging product scanning on social, generative ideation.
Notes: generative, not extractive. Downstream Human filtering against avatar fit, believability, IP, etc.

---

## Seed expansion (Pipelines B and C support)

### Transformation-from-product expander — [Op]
Input: product.
Output: candidate transformations the product can serve.
Sources: Amazon reviews (hidden use cases), science search, social media.

### Transformation-from-niche expander — [Op]
Input: niche.
Output: candidate transformations the niche verbalizes wanting.
Notes: VOC machinery pointed at a niche venue, scoped to "what do they want changed."

---

## VOC pipeline (chained capabilities)

A pipeline, not a single capability. Each link has its own contract. Source metadata (platform, venue, author ID, link, timestamp, engagement) is preserved through every link. Authorship preservation enables the 5+ co-occurrence rule downstream — non-negotiable.

### VOC scraper — [Op]
Input: scoping params (venue, query, depth, date range).
Output: raw dump (posts, comments, reviews) with all metadata preserved.
Notes: may fragment into platform-specific scrapers (Reddit JSON, Amazon scrape, TikTok, YouTube) under one umbrella capability. Different platforms = different tooling, same capability shape.

### Cleaner — [Op, lightweight]
Input: raw scraper dump.
Output: deduped, normalized, junk-stripped text with all metadata intact.
Notes: dumb version first — strip URLs in body text, remove `[deleted]`/`[removed]`, dedup exact-match, normalize encoding. ~30 lines of Python. Scale up only when downstream complains. Probably a script, not an agent.

### Classifier / tagger — [Op]
Input: cleaned text + universal schema (the locked question/theme list — pains, beliefs, behaviors, dreams, drivers, language, identity, etc.).
Output: each text unit tagged against the schema with frequency rollup. Authorship and source metadata preserved.
**Locked design decision:** one classifier, one universal schema, content-based classification. N/A is a valid output for any schema field (no force-fitting when content doesn't address a question). Source metadata is preserved and attached to every record, but does NOT route to different schemas. See "Locked decisions" below.

### Quote extractor — [Op]
Input: classified text.
Output: verbatim quotes pulled per theme, exact language preserved, indexed to themes and source.
Notes: separable from classifier so re-extraction can happen without re-classification.

### PMBD clusterer — [Op]
Input: classified extracts with author IDs.
Output: candidate sub-niche clusters with single-individual co-occurrence verified against the 5+ rule.
Notes: cross-niche clusters are stronger (validate they're not platform artifacts).

### Frequency / intensity synthesizer — [Op] — Phase 3a output
Input: classified data.
Output: ranked themes by prevalence, intensity proxies (length, repetition, emotional language density).
Notes: this IS the structural map of "what patterns are common." Drives angle selection in Phase 4.

### Copy bank builder — [Op] — Phase 3b output
Input: extracted quotes indexed to themes + source metadata.
Output: copy bank organized by theme / sub-niche / PMBD layer, queryable by source.
Notes: source-aware. Filterable to "purchase-anchored language" (Amazon) vs "community language" (Reddit) for different funnel stages.

### Institutional report retrieval — [Op]
Input: niche × category.
Output: relevant Mintel / IBISWorld / MRI-Simmons / Statista report content, structured.
Notes: feeds into classifier downstream (treated as another VOC source after structure extraction).

---

## Purchase signal evaluation

### Purchase signal composite — [Op]
Input: VOC outputs + demographic data + reachability data + growth/newness signals.
Output: scored signal on buying power, growth, newness, reachability for a candidate cluster.
Notes: one composite for now. May fragment later if downstream needs different slices.

---

## Test design support

### VOC language extractor (scoped) — [Op, reuses Copy bank builder]
Input: copy bank + specific test variables (angles, claims, offers).
Output: filtered exact-language snippets for ad copy and landing page work.
Notes: same agent as Copy bank builder, narrower scoping input. Not a separate capability — same machinery, different query.

---

## Orchestration / decision layer (not Ops)

- **Pipelines A / B / C** — [Orch]. Decision logic for which capabilities to call in what order given input shape.
- **Phase 3d loop** — [Orch]. Revise Phase 0/1 given new data.
- **Hypothesis selection** (Phase 0 → Phase 1) — [Human]. Read map, pick a bet.
- **Differentiation strategy** (Phase 4) — [Human-with-framework]. Framework: Product UM play gated by gap analysis + steal proven variables. Framework structure locked, threshold methodology Under.
- **Macro test selection** — [Human]. Same product × new markets, or same market × new products.
- **Variable definition** (test design) — [Human]. Read competitor outputs + lock proven + define test variables.
- **Sub-niche declaration** — [Human]. Clusterer surfaces candidates meeting 5+ rule; you decide which to pursue.

---

## Foundational Unders (must resolve before agent specs)

> **Course correction (2026-05-21).** Persistence layer is **deprioritized.** PMF's job is shipping brands — the manual workflow + research questions already delivers that (proven on the eink-tablets run). Build tooling **just-in-time**: automate a step only once it is the repeated bottleneck across brand-ships. The persistence layer is no longer a hard gate on agent specs; it gets built when manual friction justifies it, after shipping. See `agents/implementation-notes.md`.

### 1. Map / persistence layer
Every capability writes to and reads from a shared store. Phase 4 is read-heavy on accumulated Op outputs — decision gates read from the map, they don't trigger fresh research. Affects every Op's output schema (must be structured, dedupable, joinable). Read interface matters as much as write interface. Has to be designed before agent specs are written.

### 2. Authorship + source metadata pass-through
Every link in the VOC chain must preserve author ID, platform, venue, URL, timestamp, engagement. Non-negotiable for the 5+ co-occurrence rule and downstream source-aware analysis. Treat as an architectural constraint, not a feature.

---

## Downstream Unders (parked; resolve via manual runs first)

### 1. Gap analysis scoring (Gate 1)
Variables locked, weights/thresholds not. Calibrate after running manually on 2–3 real spaces.

### 2. Win-decision framework (Gate 2)
Structure locked (Product UM play + steal proven variables, gated by gap analysis). Threshold methodology open. Calibrate alongside Gate 1.

### 3. Filtering thresholds
Strong desire / proven spend / evergreen / underserved-hungry / solvable UM filters throughout the workflow. All consume Op outputs. Thresholds calibrate from manual runs.

---

## Locked decisions (preserve in next session)

1. **Workflow ≠ agents.** Capabilities are the unit of design. Agent clustering happens per agent during spec writing, not globally up front.

2. **Per-brand extractor stays shallow.** Depth in Phase 2 comes from *composing* multiple capabilities around one brand (extractor + ad creative + offer/bundle + channel + review mining), not from the extractor itself getting smarter.

3. **3a and 3b are distinct operations.** Frequency synthesizer (3a) and copy bank builder (3b) both branch downstream of the classifier. Same raw material, different outputs.

4. **Universal classifier, one schema.** Classifier reads any cleaned text from any source against a unified schema. N/A is valid for any field. Source metadata is preserved and attached, but does not route to source-specific schemas. Cross-source insights (Reddit thread that's actually a product review, Amazon review that contains worldview) get caught natively.

5. **Mechanism research = one capability.** Phase 0 commercializability + Phase 3c science research are the same operation with different output framing. Merged.

6. **Cleaner: dumb version first.** Modular contract means the cleaner can be swapped for a real one later without touching downstream. Build 30 lines of regex now, scale when something breaks.

7. **VOC chain is ~7 ops, not one.** Scraper → cleaner → classifier → (quote extractor + frequency synthesizer + clusterer) → copy bank. Branches at classifier output.

8. **Hypothesis selection is an explicit Human step** between Phase 0 and Phase 1. Not invisible glue.

9. **Gate 2 = "do I want to run ads for this."** Gap analysis (Gate 1) gates whether the space is worth pursuing. After deep research (Phase 2/3), Gate 2 gates whether to actually commit.

---

## Capability count

~20 distinct capabilities currently named. Some will likely cluster into shared agents (visual scrapers, e.g.). Some are scripts more than agents (cleaner). Final agent count is open — decided per agent during spec writing.
