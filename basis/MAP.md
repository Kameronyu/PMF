# Marketing Lens — Map

This is the lean orientation layer. To EDIT one prompt: read this MAP + that one `prompts/` file. To ONBOARD on the whole system: read this MAP + all `prompts/` files. Term-definitions live in `/definitions.md` (referenced per agent, not recopied here).

---

## Pipeline flow

Pre-Research Plan → Finder → Roster Verifier → Dumper (per brand) → Space Classifier → Market Selection Assessor → [operator NTP pick] → Router (per funnel) → Section Analyzer (per funnel) → Funnel Architect → Copywriter → Relevance Bucket → Role Classify / Comprehend Video

---

## Step 0 — Operator Pre-Research Plan (seed inputs, not an agent)
- **Job / Inputs it seeds:** operator-authored bet brief (1 per run). Pins: what the run IS/IS NOT validating; physical product description; the primary bet (differentiator × niche × open transformation slot); operator definitions of interpretation-heavy terms; candidate territories for the Finder net; comparable-bet seed brands + platforms; LP-hunt query terms; claim-typing example domains for the Classifier's multi-domain range.
- **Hands to:** Finder (bet brief + territory list + comparable-bet seeds), fetch scripts (LP-hunt terms), Space Classifier (claim-typing examples).

---

## Step 1 — Finder (`prompts/01-finder.md`)
- **Job:** find competitor brands across 3 search lanes (major DTC, crowdfunding, marketplace); wide net by substitutability AND structural bet-similarity.
- **Inputs it receives:** bet brief (operator), product/category.
- **How it evaluates:** keep bar (real URL + real product + plausible competitor); net rule (substitutability OR bet-similarity); relevance-drop for borderline entries — no padding.
- **Eats:** bet brief territories, comparable-bet seed brands.
- **Hands to:** Roster Verifier (brands.json — deduped roster with raw observations, no classifications).

## Step 1.5 — Roster Verifier (`prompts/02-roster-verifier.md`)
- **Job:** adversarial cross-check of the Finder's roster before any fetch spend — catches slop in AND gaps from the list.
- **Inputs it receives:** brands.json + product/category.
- **How it evaluates:** slop check (does each brand clear the keep bar?), gap check (obvious omissions verified by web search), dedup/channel sanity.
- **Eats:** brand roster, keep bar criteria.
- **Hands to:** human (flags for operator to apply to brands.json before fetch proceeds).

## Step 1 — Dumper (`prompts/03-dumper.md`)
- **Job:** verbatim extraction of one brand's marketing into pitch-grouped creative rows; no classification.
- **Inputs it receives:** pre-cleaned copy for one brand slug.
- **How it evaluates:** extracts verbatim — claims, mechanisms, problem stories, angle — grouped by pitch (one outcome = one pitch). Leaves transformations and canonical labels null.
- **Eats:** cleaned brand copy (ads + landing pages + product pages).
- **Hands to:** Space Classifier (dump.json per brand — everything verbatim, nothing classified).

## Step 1 — Space Classifier (`prompts/04-space-classifier.md`)
- **Job:** read ALL brands' dumps together and unify vocabulary — the only judgment stage in the light pass.
- **Inputs it receives:** all brands' dump.json files + bet brief.
- **How it evaluates:** clusters claims into canonical transformations; types each claim (direct/enlarged/mechanism/enhanced); clusters niches, angles, bet_types, mechanisms-in-play; assigns sophistication stage per combo cell from typed-claim distribution; carries demand trend shapes from fetch data.
- **Eats:** raw verbatim claims, mechanisms, angles, niche signals, problem stories across all brands.
- **Hands to:** Market Selection Assessor (space-map.json — canonical combos, staged claim distributions, mechanism ownability, demand trends, bet types).

## Step 2 — Market Selection Assessor (`prompts/05-market-selection-assessor.md`)
- **Job:** judge all combo cells (transformation × niche) against 4 gates in fixed order; produce a ranked provisional survivor list.
- **Inputs it receives:** space-map.json.
- **How it evaluates:** Gate 1 demand reality + trend shape → Gate 2 mechanism efficacy + ownable axis + price conditioning → Gate 3 sophistication stage + required move + executability; Gate 4 awareness deferred to deep-research step. First kill stops the cell.
- **Eats:** combo cells with brand counts, typed claims, mechanism ownability, demand trend shapes, bet types, price points, crowdfunding raise data.
- **Hands to:** operator (ranked provisional survivor list + gate verdicts + flags; operator picks the NTP).

## Step 3 — Router (`prompts/06-router.md`)
- **Job:** classify one funnel's transformation similarity to route it as structure-only, messaging-full, or both.
- **Inputs it receives:** competitor slug, source_type (dtc/crowdfunding), run_transformation, transformation definition.
- **How it evaluates:** transformation same + crowdfunding = both; transformation same + DTC = messaging_full; transformation different + crowdfunding = structure_only.
- **Eats:** funnel source type, transformation match/mismatch.
- **Hands to:** Section Analyzer (routing_flag per funnel).

## Step 3 — Section Analyzer (`prompts/07-section-analyzer.md`)
- **Job:** analyze one funnel's copy and emit a sequenced belief-record store — the judgment workhorse of the collection layer.
- **Inputs it receives:** cleaned funnel copy + DR knowledge bundle + routing_flag.
- **How it evaluates:** two internal passes (observe → classify); segments copy into belief-units by job (not page structure); classifies each against the 9-anchor taxonomy; captures verbatim refs and granular execution detail (sub-claims recoverable); assigns funnel-level fields (awareness entry, funnel sequence, offer mechanic, urgency construction).
- **Eats:** funnel copy verbatim; DR persuasion/funnel-architecture/offer-construction knowledge as classification rubrics.
- **Hands to:** Funnel Architect (per-funnel belief-record store with verbatim refs, sequenced belief chain, funnel-level fields).

## Step 4 — Funnel Architect (`prompts/08-funnel-architect.md`)
- **Job:** design the crowdfunding funnel by reasoning over the full proven belief-record store; produce a copy brief for the copywriter.
- **Inputs it receives:** all per-funnel belief-record stores + claim tally (_tally.json) + DR knowledge bundle + run context.
- **How it evaluates:** three-layer authority model (belief order = proven sequences as priors; belief presence/emphasis = calibrated to backer awareness + product objections; fill/execution = proven in-transformation messaging). Congruency law: one angle, one transformation, every touchpoint matching.
- **Eats:** belief sequences, execution types and details, verbatim refs, validation strength and lane, awareness entries, funnel sequences, offer mechanics, urgency constructions, routing flags; claim tally for dead-ground / whitespace.
- **Hands to:** Copywriter (funnel design brief — belief chain in order, install specs, single angle, structural shape, offer mechanic, dead-ground/whitespace notes).

## Step 5 — Copywriter (`prompts/08b-copywriter-STUB.md`)
- **Job:** write final LP copy from the architect's brief, RAGing the verbatim corpus.
- **Status:** prompt NOT yet authored — pending roadmap plan 15-04.
- **Hands to:** LP builder.

## Steps 6–8 — Asset Classify

### Step 6 — Relevance Bucket (`prompts/09-relevance-bucket.md`)
- **Job:** gate each asset into one of five relevance buckets before full classification runs.
- **Inputs it receives:** asset id, product name, kind (image/video), file path.
- **How it evaluates:** one visual judgment — product shot vs brand asset vs lifestyle vs irrelevant vs sensitive.
- **Eats:** the asset file.
- **Hands to:** orchestrator (relevance bucket — drops irrelevant/sensitive, passes product_shot to role-classify/comprehend-video).

### Step 7 — Role Classify (`prompts/10-role-classify.md`)
- **Job:** classify one product image with full claim tagging and pixel-grounded evidence.
- **Inputs it receives:** product fact sheet + per-product claim list + controlled vocabularies + image file path.
- **How it evaluates:** two internal passes (literal description → claim-list walk); tags only claims the pixels carry; flags disqualifiers; judges shot type and display state.
- **Eats:** product images; per-product claim list.
- **Hands to:** asset-map-rank.js (claim-tagged image record).

### Step 8 — Comprehend Video (`prompts/11-comprehend-video.md`)
- **Job:** comprehend one product video from timestamped contact sheets and emit a full claim-tagged timeline record.
- **Inputs it receives:** product fact sheet + per-product claim list + controlled vocabularies + ordered contact-sheet file paths.
- **How it evaluates:** builds a timestamped timeline from sheets in order; tags claims with when + motion value (what motion proves a still cannot); judges best_use, loop safety, poster frame.
- **Eats:** video contact sheets; per-product claim list.
- **Hands to:** asset-map-rank.js (claim-tagged video record).
