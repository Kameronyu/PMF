# Agent Implementation Notes

Parked notes for the eventual agent specs. **Not specs.** Populated from manual research runs — the first being the eink-tablets run (`runs/eink-tablets/`), which surfaced the extraction and aggregation gaps below.

Per the course correction (see `capability_inventory.md` → Foundational Unders), agents get built just-in-time, after shipping. These notes are the input for whoever writes the per-brand-extractor and market-aggregator specs.

---

## Per-brand extractor (Phase 0 — space mapping)

### Distinguish the framework layers — with worked examples
The eink-tablets run conflated framework layers: features, angles, and mechanisms ended up labelled as transformations or claims. The extractor prompt needs explicit definitional boundaries **and worked examples** — not just the definitions.md glossary.

Force every piece of competitor copy into exactly one layer:
- **Transformation** — the outcome ("X happens to the buyer's life": be more productive, study better, protect your eyes).
- **Niche** — the identity group, independent of the transformation.
- **Mechanism / UM** — *why* it works.
- **Angle** — the emotional frame.
- **Claim** — the verbal outcome-promise.
- **Feature** — a spec / Feature UM attribute.

Worked examples (from the eink run — the kind the prompt should carry):
- "Paper-like feel" → a Product UM that went universal and **decayed into a saturated minimalism angle.** NOT a transformation.
- "AI note-taking / capture-to-output" → a **Feature UM (mechanism)**. NOT a transformation, NOT an angle.
- "Thinnest 4.5mm / faster refresh / 16K stylus / long battery" → **features.** NOT claims.
- "Own the newest / world's first" → a **status-curiosity angle.** NOT a transformation.
- "Your iPad has distracting apps" → a **problem mechanism** (a causal story). It is NOT a Problem UM unless it is *unique* — an obvious, everyone-knows-it cause shared by all competitors never rises to a Problem UM.

### Split claims from features
The schema (`map/data_inventory.md` → Per-brand extractor → `claims[]`) lumps outcome-promises and spec attributes together. Separate them: `claims[]` = outcome-promises; `features[]` = specs / Feature UM attributes.

### Problem-mechanism vs Problem-UM
Record the causal story (the problem mechanism — can be shared across competitors) separately from whether it is a *unique, differentiating* Problem UM. A shared causal story is a mechanism; only a uniquely-positioned one is a UM.

### Capture the targeted sub-niche
Competitor marketing reveals which sub-niche (PMBD cluster) a brand is *aiming at* — readable from hooks, imagery, segmented creative. Add a field for the targeted sub-niche per brand. This is supply-side, distinct from VOC-validated sub-niches, which still require the Phase 3a/3b clusterer.

### Scoping — competitive set
A market's competitive set is everything serving the same niche × transformation, **including substitutes** (for an e-ink note tablet: iPads, paper planners, software). Scoping a scan to one product category undercounts the real competition.

---

## Market aggregator

### Output organized by market
The eink run produced one flat rollup across all 31 brands regardless of which market each competes in. Wrong. The aggregator must first cluster brands into **market cells = niche × transformation**, then aggregate within each cell.

### Saturation is per-market only
Saturation = how many competitors make the same claim / run the same angle **within the same market cell.** Counting a claim across brands that sit in different markets badly overstates saturation. (eink run: "eye comfort" looked saturated at 12/13 brands, but those brands span ~6 different markets — within any single market it was far less saturated.)

### Per-market frequency breakdown
For each market cell, output frequency counts for: sub-niches targeted, angles, claims, features. That per-market breakdown is the real saturation picture and the basis for spotting the open lane.
