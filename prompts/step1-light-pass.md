# Step 1 — Light Pass (agents + schema + determinism scaffold)

Goal of the light pass: from a starting point (here: **product**), find the competitor brands,
collect each brand's marketing copy, and classify the space — what transformations/niches are
being sold and how saturated each is. Output is a **map for picking a market**, not deep study.

**Pipeline (3 stages, with deterministic scaffolding around them):**

```
Finder (1 agent)
   → brands.json
Roster Verifier (1 agent, adversarial cross-check)          ← catches slop AND gaps before fetch
   → brands.json updated (flagged drops + suggested missing brands) → human ok → proceed
[SCRIPT: fetch + LP-hunt + ad pull + HTML→clean copy]      ← deterministic, not an agent
   → corpus/<brand>/clean/*.md  +  ads/<brand>.json
Dumper (1 agent per brand, parallel)                        ← reads CLEAN copy only, verbatim
   → corpus/<brand>/dump.json   (claims + creatives, NO classification)
[BARRIER: wait for all dumpers]
Space Classifier (1 agent, reads ALL brands)                ← the only judgment stage
   → space-map.json  (canonical transformations/niches + per-brand + saturation)
```

**Determinism principle.** Anything that can be deterministic is pulled OUT of the agents into
scripts or enforced by hooks. Agents do only the irreducible-judgment part. The "did it classify
correctly" problem is solved by **hooks that reject bad output**, not by trusting the prompt.

---

## SCHEMA (the contract every stage reads/writes)

### `brands.json` — Finder output
```json
{
  "starting_point": { "product": "string", "transformation": null, "niche": null },
  "brands": [
    {
      "brand": "string",
      "slug": "lowercase-hyphenated",
      "url": "string (real DTC/product page, not a review article)",
      "product_observed": "one line, what it physically is — verbatim, not interpreted",
      "sells_observed": "one line, what they say it does — their words, RAW, not classified",
      "channel": "dtc | marketplace | crowdfunding",
      "lane": "major | crowdfunding | marketplace",
      "ads_flag": "yes | no | unsure",
      "crowdfunding": null,
      "found_by": ["query string(s) that surfaced this brand"],
      "relevance": "one line — why this brand belongs in the roster",
      "price_points": ["observed price string(s) from the product/pricing page, verbatim — '$329', '$19/mo'; [] if none found"],
      "revenue_est": {
        "_note": "populated by revenue-est.js, NOT the Finder — agents never compute revenue",
        "value_usd_monthly": null,
        "method": "traffic_formula | review_proxy | disclosed | null",
        "confidence": "high | medium | low",
        "inputs": { "monthly_visits": null, "visits_source": "similarweb-manual | similarweb-api | proxy | review-proxy | null",
                    "cvr_assumption": 0.02, "aov_usd": null, "aov_source": "observed-price | estimate | null" },
        "notes": "string"
      }
    }
  ],
  "dropped": [ { "brand": "string", "url": "string|null", "reason": "one line" } ]
}
```
Crowdfunding brands set `channel:"crowdfunding"` and fill the block instead of `null`:
```json
"crowdfunding": { "platform": "kickstarter|indiegogo|other", "launch_date": "YYYY-MM-DD|unknown",
  "goal": "string|unknown", "raised": "string|unknown", "pct_funded": "string|unknown",
  "status": "live|funded-shipped|funded-delayed|failed|unknown" }
```

### `dump.json` — Dumper output (one per brand). **No transformation/niche classification.**
The **creative is the unit of record.** Each ad / landing page / product page is one creative.
A creative always has a niche-target read + angle; it MAY carry zero claims.
```json
{
  "slug": "string",
  "creatives": [
    {
      "creative_id": "library_id for ads | canonical-URL for pages",
      "type": "ad | landing_page | product_page",
      "url": "string",
      "ad_id": "string|null",
      "page_id": "string|null",
      "start_date": "YYYY-MM-DD|null",
      "run_length_days": "int|null",
      "format": "image|carousel|video|page|null",
      "niche_raw": "who this creative is aimed at, verbatim signal | null",
      "angle_raw": "the emotional frame in the copy's own terms — OPEN, not an enum",
      "canonical_angle": null,
      "angle_basis": "observed | inferred",

      "pitches": [
        {
          "claims": ["verbatim outcome-promise string", "..."],
          "mechanism": ["how/why THIS outcome is achieved, as the copy states it — Feature-UM ('AI capture-to-output','amber backlight','no apps'). verbatim. may be empty. >1 allowed. PER-PITCH, never clustered.", "..."],
          "problem_um_raw": ["the causal story for WHY the buyer has THIS problem ('your phone's apps are engineered to steal your focus'). verbatim. may be empty. shared-vs-unique is the classifier's call.", "..."],
          "transformation": null
        }
      ],

      "canonical_niche": null,
      "linked_funnel_id": "creative_id of the page this ad's CTA points to | null",
      "link_basis": "cta_url | inferred | unresolved",
      "multi": false
    }
  ],
  "notes": "gaps, blocked pages, unresolved links"
}
```
- `transformation` and `canonical_niche` are **always null here** — the classifier fills them.
- A cold ad with no claim: `claims: []`, but `angle_raw`/`niche_raw` still filled.
- `claims[]` strings must be **verbatim substrings of the clean copy** (hook-enforced).

### `space-map.json` — Space Classifier output (reads all `dump.json`)
```json
{
  "transformations": [
    { "canonical": "focus-productivity",
      "raw_claim_variants": ["stay locked in", "deep work", "stop doomscrolling"],
      "brand_count": 7, "creative_count": 41 }
  ],
  "niches": [
    { "canonical": "knowledge-workers", "raw_variants": ["remote engineers","busy professionals"],
      "brand_count": 9 } ],
  "angles": [
    { "canonical": "shameful-behavior-pain", "raw_variants": ["still doomscrolling at 2am","you keep restarting the chapter"],
      "creative_count": 14 } ],
  "combos": [
    { "transformation": "focus-productivity", "niche": "students",
      "brand_count": 3, "creative_count": 9, "brands": ["slug","..."],
      "claim_count": 9, "enhanced_claim_count": 2,
      "claims": [ { "text": "stay locked in for hours", "type": "direct" },
                  { "text": "2x deeper work, clinically measured", "type": "enhanced" } ] }
  ],
  "per_brand": [
    { "slug": "string",
      "transformations": [ {"canonical":"...", "creative_count": 4} ],
      "niches": ["canonical","..."],
      "competitive_axis": "function-capability-price | visual-statement | community-openness",
      "competitive_axis_basis": "page-quoted signal the axis call is read off — verbatim/cited, not eyeballed",
      "sophistication": "stage 1-5 + one-line evidence" } ],
  "saturation": [ { "transformation": "focus-productivity", "brand_count": 7, "saturated": true } ]
}
```
- Saturation = brand_count within a **combo cell (transformation × niche)**, never pooled across cells.
- Every `transformation`/`canonical_niche`/`canonical_angle` the classifier assigns must trace to
  raw values (`claims`/`niche_raw`/`angle_raw`) actually present in the dumps (hook-checkable).
- `competitive_axis` (per brand) = what competitors in this territory actually compete on, read off
  the brand's OWN positioning/page (page-readable; you do NOT need to know the customer's true
  dream/desire). One PRIMARY axis per brand from the closed enum:
  - `function-capability-price` — competes on what it does / specs / features / cost.
  - `visual-statement` — competes as a visual showpiece / object-as-statement / aesthetic identity.
  - `community-openness` — competes on community, openness, transparency.
  Populated for EVERY captured brand (live/dead/region-only alike — it is a per-brand descriptor, NOT
  a live-saturation count, so D-08 live-only exclusion does not apply). The Classifier assigns it; it
  feeds the Phase 2 Gate-2 transparency-axis read. `competitive_axis_basis` MUST quote/cite the page
  signal it is read off (same discipline as the sophistication evidence line — hook-checkable).

### Closed enums (a value off-list is a hard reject)
```
CHANNEL_ENUM:          dtc | marketplace | crowdfunding
CLAIM_TYPE_ENUM:       direct | enlarged | mechanism | enhanced   (classifier assigns per claim; off-list = hard reject)
COMPETITIVE_AXIS_ENUM: function-capability-price | visual-statement | community-openness   (classifier assigns one primary axis per brand; off-list = hard reject)
```
Open (captured verbatim by the dumper, clustered by the classifier): claims · mechanism · niche · angle.
Closed (dumper picks from the enum, hook-rejected off-list): channel · lane.
Classifier-assigned, hook-rejected off-list: claim_type (the classifier types each claim once the space is in view — see AGENT 3) · competitive_axis (one primary page-read axis per brand, with a page-quoted basis — see AGENT 3).

---

## DETERMINISTIC SCAFFOLD (scripts + hooks — NOT agent honor system)

**Scripts (run by orchestrator, agents never do this work):**
1. `fetch.js` (Playwright) — per brand: homepage + LP-hunt + ad pull. **LP-hunt query set is a
   fixed template, not agent-chosen:** `<brand> students|college|back-to-school`,
   `<brand> focus|distraction-free`, `<brand> calm|digital-wellbeing|screen-time`,
   `<brand> parents|kids|family`, `<brand> writers|journaling|note-taking`,
   `<brand> professionals|business|work`, `<brand> education|teachers`, `<brand> faith|Bible`;
   plus URL patterns `/clp/ /lp/ /pages/ /campaigns/ /education /students /focus /parents /press /blog /business`.
2. `clean.js` — strips nav, cookie banners, footers, scripts, boilerplate → writes
   `corpus/<brand>/clean/<page>.md` = **pure copy only**. The Dumper reads ONLY `clean/`. It never
   sees raw HTML. (This is the "agent reading copy reads clean copy" rule, enforced by file layout.)
3. `adlib-one.js` — page-ID-resolved Meta Ad Library pull → `ads/<brand>.json`.
4. `dedupe.js` — merges Finder brands by domain → clean `brands.json`.
5. `revenue-est.js` — computes `revenue_est.value_usd_monthly` per brand, **deterministically (no LLM computes revenue — it is arithmetic)**. Formula: `monthly_visits × cvr_assumption × aov_usd`. `cvr_assumption` defaults to **0.02** (industry 2–2.5%; stored as an assumption, never a measured fact). `aov_usd` derived from `price_points` (else operator-set). `monthly_visits` from the traffic source: operator-pasted SimilarWeb free-tier figure (`visits_source:"similarweb-manual"`) or a proxy API. **Fallback when `monthly_visits` is null:** `method:"review_proxy"` — units ≈ review_count × category multiplier, × AOV, `confidence:"low"`. Worked example: `300,000 × 0.02 × $60 = $360,000/mo`.

**Hooks (PostToolUse on each agent's Write — reject, don't trust):**
- DUMPER: reject if any creative has `canonical_niche != null` / `canonical_angle != null`, or any
  pitch has `transformation != null` (dumper must not classify). Reject if any pitch `claims[]`
  string is not a verbatim substring of that brand's `clean/` corpus (kills hallucinated/paraphrased
  claims). Reject if `angle_basis` missing.
- CLASSIFIER: reject if any assigned `canonical` transformation/niche/angle has zero raw variants
  tracing to real dumps. Reject saturation computed across cells (must be per combo cell). Reject any
  `claim_type` off CLAIM_TYPE_ENUM; reject a combo missing `claim_count`/`enhanced_claim_count`; reject
  `enhanced_claim_count` > `claim_count`. Reject any per-brand `competitive_axis` off
  COMPETITIVE_AXIS_ENUM; reject a missing/empty `competitive_axis_basis` when `competitive_axis` is set.
- REVENUE: `revenue-est.js` must not emit `value_usd_monthly` without a `method`+`confidence`; reject
  `method:"traffic_formula"` when `inputs.monthly_visits` is null (use `review_proxy` instead).
- FINDER: reject `channel`/`lane` off-enum; reject brand row missing `url` or `sells_observed`.

*(Hook configs are JSON in settings — written after these prompts are approved. Listed here so the
enforcement is part of the spec, not an afterthought.)*

---

## AGENT 1 — FINDER  (1 agent, product-start)

```
You find competitor BRANDS for a direct-response market-research pass. You do NOT analyze
marketing, classify transformations, or judge fit. You return a deduped, relevant brand list.

STARTING POINT: product = "<PRODUCT>". (Category: "<CATEGORY>".)

The quota is a FLOOR ON SEARCHING EFFORT, not a floor on kept brands. Run at least 12 varied
queries per lane; then keep ONLY brands that clear the relevance + real-brand bar below. Do NOT
pad the roster to hit a number — a short, clean roster beats a padded one. If a lane genuinely has
few real players, keep few and say so.

Search THREE lanes (≥12 queries each, varied phrasing):
  LANE 1 — major/established: well-known brands selling <category> direct to consumers.
  LANE 2 — crowdfunding: search Kickstarter AND Indiegogo (and Makuake/BackerKit if relevant) for
           <category> campaigns, live and past. For each, capture platform, launch date, goal,
           raised, % funded, status.
  LANE 3 — marketplace/regional: Amazon / AliExpress / regional brands selling <category>.

KEEP BAR (a brand makes the roster only if ALL are true):
  - It actually sells a product in or adjacent to <category> (real e-commerce/crowdfunding page,
    not a review article, listicle, blog, parked domain, or unrelated SaaS).
  - You can verify a real product/brand URL (not a guess).
  - It is plausibly a real competitor or substitute a buyer would consider — give a one-line
    `relevance` reason per kept brand tying it to the product/category.
RELEVANCE-DROP, don't keep-and-flag: if a brand is borderline-irrelevant, DROP it (logged), do not
park it in the roster "just in case." Slop in the roster poisons the whole downstream analysis.

For each brand return (exact schema — brands.json):
  brand, slug, url (real DTC/product page, NOT a review article), product_observed (verbatim, what
  it physically is), sells_observed (their words for what it does — RAW, do not classify),
  channel (dtc|marketplace|crowdfunding), lane, ads_flag (yes|no|unsure), crowdfunding (block or null),
  found_by (the query that surfaced it), relevance (one line — why this brand belongs in the roster),
  price_points (observed price string(s) from the product/pricing page, verbatim — for AOV; [] if none).
  Leave revenue_est null — a script (revenue-est.js) computes it; you never estimate revenue.

RULES:
- Observation only. product_observed / sells_observed are copied, never interpreted. Do NOT tag
  transformations, niches, or markets — that is a later agent's job.
- Dedupe by domain. Same brand from two lanes = one row (merge found_by + keep richest channel).
- Drop junk (review articles, parked domains, off-category, unverifiable). Log every drop with a
  one-line reason in `dropped`. No silent drops.
- If you cannot verify a real URL, drop it — do not guess.
- Output ONLY valid brands.json. No prose.
```

## AGENT 1.5 — ROSTER VERIFIER  (1 agent, adversarial cross-check, runs after Finder)

```
You audit a competitor roster the Finder produced, BEFORE any expensive fetching happens. You look
in BOTH directions at once: slop that shouldn't be there, and real competitors that are missing.
You are adversarial — assume the Finder was both lazy and sloppy until the roster proves otherwise.

INPUT: brands.json (kept brands + dropped log) + the starting point (product "<PRODUCT>", category
"<CATEGORY>").

DO:
1. SLOP CHECK — for every kept brand, judge against the keep bar: does it actually sell a product in
   or adjacent to <category>, with a verifiable real URL, plausibly a competitor/substitute a buyer
   would consider? Spot-check the URL by web search if a brand looks thin or off-category. Flag any
   that fail with a one-line reason. Be skeptical of: review articles mistaken for brands, parked
   domains, unrelated SaaS, brands whose `relevance` line is vague hand-waving.
2. GAP CHECK — name obvious competitors or substitutes a knowledgeable operator would expect in
   <category> that are NOT on the roster. Web-search to confirm each suggestion is real before listing
   it. Don't pad — only genuine, verifiable omissions.
3. DEDUP/CHANNEL SANITY — flag duplicate brands that slipped dedupe, or wrong channel/lane tags.

OUTPUT (JSON):
{
  "slop_flags": [ { "slug": "string", "reason": "why it fails the keep bar", "recommend": "drop|keep-but-bench" } ],
  "missing_brands": [ { "brand": "string", "url": "string", "why": "why it belongs", "lane": "..." } ],
  "dedup_channel_fixes": [ { "slug": "string", "issue": "string", "fix": "string" } ],
  "verdict": "clean | needs-human-review",
  "summary": "2-3 sentences: is this roster trustworthy to spend fetch budget on?"
}

RULES:
- You may web-search to verify, but do NOT fetch full corpora — this is a cheap cross-check, not analysis.
- Recommend, don't rewrite. A human applies your flags to brands.json before fetch.
- If the roster is clean, say so plainly — don't invent problems to look useful.
```

## AGENT 2 — DUMPER  (1 per brand, parallel, verbatim)

```
You dump ONE brand's marketing into structured creative-rows. You read ONLY the pre-cleaned copy
in corpus/<SLUG>/clean/ and the ad data in ads/<SLUG>.json. You do NOT fetch anything. You do NOT
assign transformations or canonical niches — leave those null. A later agent classifies.

BRAND: <SLUG>

For every creative (each ad, each landing page, each product page) emit one row per dump.json.

Inside each creative, group the copy into PITCHES. A pitch = one outcome the creative sells, with
the reason(s) it works and the cause-of-the-problem it names, kept together. A short ad usually has
1 pitch; a long funnel/LP often has several. For EACH pitch:
  - claims[]: VERBATIM outcome-promises for THIS pitch ("what the product does"). Copy literally;
    if you can't quote it, don't write it. A cold-ad pitch may have zero claims.
  - mechanism[]: the how/why THIS outcome is achieved — Feature-UM ("AI capture-to-output", "amber
    backlight", "no apps", "DC dimming"). Verbatim. May be empty. MORE THAN ONE is normal. A
    mechanism is NOT a claim (outcome) and NOT a transformation — it's the reason the outcome happens.
    If a mechanism appears in the ad, capture it on the ad's pitch; if it only appears on the funnel,
    capture it on the funnel's pitch.
  - problem_um_raw[]: the causal story the copy tells for WHY the buyer has THIS problem ("your
    phone's apps are engineered to hijack your attention"). Verbatim. May be empty. Just capture it —
    do NOT judge whether it's uniquely owned; that's the classifier's call.
  - transformation: null. (ALWAYS — the classifier names it, keeping it bound to this pitch's
    mechanism + problem_um so they are never analyzed in a vacuum.)
Keep claims/mechanism/problem-UM that belong to the SAME outcome in the SAME pitch — do not flatten
them into one big per-creative bag. The pitch is what links a transformation to its mechanism and
its problem-UM.

These fields are per-CREATIVE (the whole ad/page shares them), not per-pitch:
  - angle_raw: the emotional frame in the copy's OWN terms — verbatim/near-verbatim, OPEN (no enum).
    e.g. "you keep restarting the same chapter", "be the calm parent", "what doctors use". Describe
    the frame as the copy lands it; do not force it into a category.
  - angle_basis: "observed" if the copy states it; "inferred" if you judged it.
  - linked_funnel_id + link_basis: if an ad's CTA points to a page you also dumped, link them.
    cta_url if you have the destination URL, inferred if you reasoned it, unresolved if unknown.
  - multi: true if the creative genuinely runs >1 angle/niche (then capture the dominant one).
  - canonical_niche: null. canonical_angle: null. (ALWAYS. You do not classify. Each pitch's
    transformation is null too.)

DEFINITIONS (load definitions.md). You pick NO closed-set label here — you EXTRACT claims / mechanism / niche_raw / angle_raw / problem_um_raw verbatim in the copy's own words.
You never name a transformation, canonical niche, canonical angle, or competitive_axis — those are the
classifier's calls. Output ONLY valid dump.json.
```

## AGENT 3 — SPACE CLASSIFIER  (1 agent, reads ALL dumps — the only judgment stage)

```
You read EVERY brand's dump.json together and classify the space. You are the only stage that sees
all brands at once — your job is to unify vocabulary so the same thing isn't named two ways.

INPUT: all corpus/<slug>/dump.json.

DO:
1. For each PITCH (across all creatives), cluster its claims into a canonical TRANSFORMATION and
   stamp it onto that pitch. "stay locked in" / "deep work" / "stop doomscrolling" → "focus-productivity".
   List raw_claim_variants under each. A transformation is a CLAIM CATEGORY — the life-outcome the
   claims promise, not a feature/spec/angle. Because you label the pitch (not the creative), each
   transformation stays BOUND to its pitch's mechanism + problem_um — never analyzed in a vacuum.
   This lets you ask "transformation X is achieved by which mechanisms / justified by which cause?"
1b. TYPE each claim — assign exactly one CLAIM_TYPE_ENUM value, the sophistication-ladder read
    (traces to definitions.md stages). This is the load-bearing field for Gate 3 downstream:
      - direct    — bare outcome promise ("removes wrinkles", "blocks distractions").
      - enlarged  — specified / quantified / conditional ("removes wrinkles in 14 days", "2x focus").
      - mechanism — claim tied to a named how/why ("removes wrinkles via retinol microspheres").
      - enhanced  — claim stacked on a UM or superlative differentiation ("the ONLY retinol clinically
                    shown to…", "patented amber backlight no competitor can run").
    LAYER DISCIPLINE (do not conflate — a mistype here corrupts the stage read):
      - A FEATURE is not a claim. "thinnest 4.5mm / 16K stylus / faster refresh" = features → NOT typed.
      - A MECHANISM alone is not a claim; it becomes claim_type:"mechanism" only when bound to an outcome.
      - "Paper-like feel" = a decayed Product-UM now a saturated minimalism ANGLE → NOT a claim.
    Per combo cell, output `claim_count`, `enhanced_claim_count`, and the typed `claims[]` list.
2. Cluster niche_raw signals into canonical NICHES the same way.
2b. Cluster angle_raw signals into canonical ANGLES the same way (the emotional-frame families
    actually run in this space — emergent, not a fixed list). List raw variants under each.
3. Stamp canonical_transformation + canonical_niche + canonical_angle back onto context, and build
   COMBOS (transformation × niche) with brand_count + creative_count + which brands.
4. Per brand: list its transformations (+ creative counts), niches, a competitive_axis call (see
   COMPETITIVE AXIS below), and a sophistication call (Stage 1-5) read off the cell's claim_type
   distribution per the SOPHISTICATION block below — the evidence line cites the claim(s) + brand
   count that set the stage; never eyeball the stage.
4b. COMPETITIVE AXIS (per brand) — assign exactly ONE primary axis from COMPETITIVE_AXIS_ENUM,
    read OFF the brand's OWN positioning/page. This is page-readable: you decide what the brand
    competes on from how it presents itself, WITHOUT needing to know the customer's true dream/desire.
      - function-capability-price — competes on what it does / specs / features / cost.
      - visual-statement — competes as a visual showpiece / object-as-statement / aesthetic identity.
      - community-openness — competes on community, openness, transparency.
    Populate it for EVERY captured brand (live, dead, or region-only alike — it is a per-brand
    descriptor, not a live-saturation count, so the live-only exclusion does NOT apply here).
    Record a `competitive_axis_basis` that QUOTES/CITES the page signal you read the axis off — same
    discipline as the sophistication evidence line: read it off the page, do NOT eyeball it. This
    feeds the Phase 2 Gate-2 transparency-axis read (is community-openness a live axis in this
    territory?). If a brand's dominant axis fits none of the three values, flag it in `notes` — that
    is debug-pass signal to extend the enum, NOT a license to guess.
SOPHISTICATION (per combo cell = transformation × niche)
The stage = the height of the most-saturated differentiation layer competitors
already occupy in this cell. It tells you the FLOOR you must clear to out-persuade
them. Read it off the typed claims — do not eyeball it.

Across all LIVE, in-geography brands in the cell, look at the claim_type distribution:
  - Stage 1 — barely anyone makes the base claim yet; transformation is fresh.
              (few brands, sparse `direct`) → floor: just state the claim.
  - Stage 2 — multiple brands make the base claim; `enlarged` claims appearing
              (quantified/specified/conditional: "in 14 days", "2x focus").
              → floor: a sharper/specified claim.
  - Stage 3 — `mechanism` claims present (outcome tied to a named how/why:
              "via retinol microspheres", "amber backlight"); a UM exists in the cell.
              → floor: your own mechanism/UM — a bare claim no longer competes.
  - Stage 4 — competing mechanisms + `enhanced` claims stacking mechanism+superlative
              ("the ONLY x clinically shown"); feature-level escalation.
              → floor: an alternative/better Feature-UM + angle.
  - Stage 5 — `enhanced`/extraordinary-identifier saturation: claims maxed, edge is now
              extraordinary identifiers (named authority, major press, proprietary UM
              competitors can't match) + angle + value model.
              → floor: extraordinary-tier trust + angle + copy excellence.

Mechanical rule: stage = the highest claim_type tier that 2+ LIVE in-geo brands deploy
in the cell. 5+ RULE: if 5+ live brands make the same base (`direct`) claim, that claim
is discounted — cell is ≥Stage 2 and claim-saturated. Evidence line MUST cite the
claim(s) + brand count that set the stage.

5. Saturation: count brands per COMBO CELL (transformation × niche). NEVER pool across cells.
6. Problem-UM judgment: cluster the `problem_um_raw` causal stories. For each, count how many brands
   tell it. If 3+ brands tell the same causal story → it's a SHARED problem-mechanism (not ownable).
   If exactly 1 brand tells it → flag it a candidate Problem-UM (uniquely owned). This shared-vs-unique
   call can only be made here, with all brands in view — the dumper could not make it.

RULES:
- Every canonical label must trace to raw variants actually present in the dumps. No invented categories.
- Transformation ≠ feature ≠ angle ≠ mechanism. (Worked examples from definitions.md: "paper-like feel"
  = decayed Product-UM acting as a minimalism ANGLE, not a transformation. "AI note-taking" = a
  mechanism/feature, not a transformation. "thinnest 4.5mm" = a feature, not a claim.)
- competitive_axis is ONE primary axis per brand, on the closed enum, with a page-quoted basis — never
  an eyeballed call, never off-enum.
- Output ONLY valid space-map.json.
```

---

## OPEN DECISIONS (ruled inline as we build; flag any to change)

- **Scope = light pass.** Per-creative combo rows are captured but per-AD deep combo analysis
  (the top-5 deep study) is Step 2, not here. Light pass combos roll up at claim/creative level.
- **Multi-angle creatives:** capture dominant + `multi:true`. Not splitting into segments in the light pass.
- **transformation:null is a legal final value** for a claimless cold ad (teaser) — it's a countable state, not a gap.
- **ad↔funnel link may be unresolved** — `link_basis:"unresolved"` is legal; we don't fake clean links.
- **Dedup keys:** ads by `library_id`, pages by canonical URL, brands by domain.
- **Awareness dropped from the light pass (D-05)** — per-creative tag isn't decision-useful for the market-pick map; real awareness read is a Phase 2 per-funnel job.
