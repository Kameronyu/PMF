# Granular Analyzer Brief — Per-Brand Deep Persuasion Inventory

ONE BRAND. ONE AGENT. ONE OUTPUT FILE.

You produce an exhaustive verbatim inventory of every persuasion element
a single brand deploys. A separate Pass 2 synthesizer compares across
brands later. **You do not.**

## Hard rules — read before writing anything

These rules failed in prior runs when ignored. They are non-negotiable.

1. **Verbatim-only.** Every claim, headline, hook, angle, objection handle,
   testimonial, and trust signal in your output MUST be a direct quote
   from a source file or fetched page, paired with a `source_artifact`
   reference (file path + line range, or URL). If you cannot quote it
   verbatim, do not include it. Paraphrasing is a violation.

2. **Classify-with-evidence.** Every layer classification (transformation
   vs claim vs feature vs angle vs mechanism) MUST cite the verbatim copy
   it was read from. Ambiguous? Mark `unclear / no evidence`. Do not
   force-fit.

3. **Anti-bucket.** Two different verbatim quotes = two rows, not one.
   Two hooks that mean similar things are two rows. Synthesis groups
   things. You catalog them.

4. **No cross-brand comparison.** You are forbidden from referencing,
   comparing to, or even reading other brands' files. "Unlike reMarkable…"
   in your output = automatic rewrite. Cross-brand comparison is Pass 2's
   only job.

5. **No saturation calls.** The 5+ saturation rule does not apply at this
   layer. Per-brand agents do not call anything "saturated."

6. **Feature ≠ claim ≠ transformation** — examples from
   `analyzer-framework.md`:
   - "paper-like feel" → angle (NOT transformation)
   - "AI note-taking" → feature (NOT transformation)
   - "thinnest 4.5mm" → feature (NOT claim)
   - "your phone pulls you out of prayer" → problem-mechanism (NOT UM
     unless uniquely positioned)
   - "the only computer designed for deep focus" → transformation (claim
     of an outcome on the buyer's life)

7. **UM honesty.** Most brands have NO unique mechanism. `none` is the
   correct answer. Do not invent one.

8. **Self-audit checklist at end of writing.** You must confirm before
   returning:
   - Every claim has a source_artifact
   - Every angle has driver + pole + transformation it attaches to
   - No feature is in the claims table
   - No transformation is presented as a feature
   - Every "longest-running hook" has a start_date
   - No comparisons to other brands anywhere in the output

## Inputs (read ONLY these)

- The brand's 5 existing corpus files at
  `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/<brand>/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md`
- The brand's Pass 0 supplementary fetch notes at
  `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/<brand>/notes-pass0-fetch.md`
- The brand's Pass 0 screenshot artifacts at
  `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/<brand>/screenshots/`
  (if any) — read the `.txt` files for additional copy; reference `.png`
  files for the visual-look-and-feel section
- `/home/kyu3/PMF/runs/eink-tablets/scripts/analyzer-framework.md`
- `/home/kyu3/PMF/definitions.md`

## DO NOT read

- Sibling brand corpora
- `birdseye-map.md`
- `eink-category-evolution/` files
- `transformations-flat-map.md`

## Output

Write `runs/eink-tablets/marketing-corpus/<brand>/granular-analysis.md`
with these 13 sections in this order:

### 1. Metadata + sources read
- brand, slug, panel/format (e-ink slate, foldable, phone, app, etc.)
- files consumed (paths)
- screenshots referenced (count + paths)
- date of analysis
- known gaps (Pass-0 things that were absent, scope you couldn't reach)

### 2. Headlines catalog
Every H1 / H2 / hero / sub-hero / section header / ad headline, verbatim.
Table:

| Headline (verbatim) | Location classification | Source artifact |
|---|---|---|

Location values: `hero | section | modal | ad | press-quote | testimonial-header | FAQ-question | CTA-button`

### 3. Visual look and feel
From screenshots and copy:
- Color palette (hex if pulled from screenshots, descriptive otherwise — e.g., "warm white #F5F1E8 dominant, near-black headlines, single accent color")
- Typography (serif/sans, weight, families if named)
- Imagery archetypes (hand-with-pen / lifestyle-with-coffee / product-on-desk / dark-room-glow / outdoor / studio-isolation / illustration)
- Density (whitespace-heavy vs information-dense)
- Motion (still images / video hero / animations / static)
- Screenshot references (paths to screenshots that anchor each call)

If no screenshots exist for this brand, state so + derive what you can
from copy alone.

### 4. Customer call-outs
Every direct buyer-address verbatim. Two sub-tables:

**Named identity call-outs** (the copy literally names a buyer type):
| Verbatim call-out | Buyer identity | Source artifact |
|---|---|---|

**Behavior call-outs** (the copy addresses a behavior or pain, not an identity):
| Verbatim call-out | Behavior/pain described | Source artifact |
|---|---|---|

Plus a list of every testimonial subject:
| Name | Role/title verbatim | Quote verbatim | Source artifact |
|---|---|---|---|

### 5. Claims catalog (verbatim)
Every outcome-claim. Table:

| Claim (verbatim) | Base or Enhanced | Qualifier type | Source artifact |
|---|---|---|---|

Qualifier type values: `speed | condition | mechanism | comparative | duration | quantitative | none (base)`

End the section with counts: `N base claims, M enhanced claims, P total.`

### 6. Features catalog (verbatim)
Every spec / attribute mentioned. Table:

| Feature (verbatim) | Type | Source artifact |
|---|---|---|

Type values: `display | hardware-spec | software | input-method | connectivity | physical-dimension | battery | accessory | partnership | other`

NEVER mix with claims. If a copy element is ambiguous between claim and
feature, default to feature (claims are outcome-promises, features are
attributes).

### 7. Transformation framing — per transformation
For EACH distinct transformation the brand runs (you may find 1, you may
find 15 — read all the copy and identify):

```
#### Transformation: <verbatim hero or pillar copy that names the outcome>
- Niche this transformation targets: <buyer identity verbatim or "general">
- Verbatim setup copy: <how does the brand introduce the problem/desire>
- Verbatim build copy: <how does the brand frame the mechanism/proof>
- Verbatim payoff copy: <how does the brand close to the buyer outcome>
- Angles attached (verbatim, cross-reference to §8 angle IDs):
- Site-vs-ads divergence: <are site and ads telling the same story or different ones>
- Source artifacts: <LP URLs and ad library_ids>
```

### 8. Angles catalog (verbatim)
Every emotional pull, indexed. Table:

| ID | Angle text (verbatim) | Driver | Pole | Transformation it attaches to (§7 reference) | Source artifact |
|---|---|---|---|---|---|

Driver values: `status | survival | reproduction | belonging`
Pole values: `pain | desire`

### 9. Objection handles (verbatim)
Every preempted objection. Table:

| Handle copy (verbatim) | Objection it neutralizes | Funnel location |
|---|---|---|

Funnel location values: `ad | LP hero | LP mid | LP feature-block | FAQ | checkout | post-purchase | risks-section`

### 10. Hooks ranked by longevity
Drawn from `meta-ads.md` ad library data + any Pass-0 enrichment. Table
sorted by `days_running` descending:

| Rank | Hook (verbatim) | Start date | Days running | Ad format | Angle (§8 ID) | Claim (§5 ID) | Library ID |
|---|---|---|---|---|---|---|---|

Flag rank-1 explicitly as `**proven winner — longest-running**`.

If the brand has zero ads OR no start_date data: write "no ad-longevity
data available for this brand" + state why (zero active ads, sandbox
block on ad library, etc.).

### 11. Funnel structure — page sections
For EACH LP encountered, list its sections in order:

```
#### LP: <URL>
- Section 1: <type — e.g., hero> | verbatim section header | content type (text / image / video / table / form)
- Section 2: <type — e.g., social-proof-bar> | verbatim section content
- ...
- CTAs on this page (count + verbatim text + placement):
  - "<verbatim CTA text>" — above-fold | mid-page | sticky | footer
```

Section type vocabulary: `hero | hero-sub | social-proof-bar | transformation-block | mechanism-explainer | feature-grid | testimonial-wall | comparison-table | press-quote-wall | FAQ | CTA-block | guarantee-block | risks | partnership-callout | newsletter-signup | footer-CTA`

### 12. Trust signals catalog
Every trust signal. Table:

| Trust signal (verbatim) | Type | Source artifact |
|---|---|---|

Type values: `review-count | press-logo | press-quote | expert-endorsement | certification | named-celebrity | UGC | before/after | payment-badge | guarantee | refund-policy | traffic-counter | years-in-business | award | university-pilot | clinical-pilot`

Flag any **extraordinary identifier** (a uniquely brand-defining trust
signal that competitors can't match) in bold.

### 13. Deposit funnel evidence
- Yes / No / Unknown
- If yes:
  - Deposit amount verbatim
  - Refund terms verbatim
  - Urgency mechanic (countdown / limited-edition / sold-out language)
  - Page URL
  - Verbatim hero copy of the deposit page
- If no:
  - "No deposit-funnel evidence found across these files: <list>"
  - "No deposit-funnel page found at probed URLs: <list from Pass-0 notes>"

## Self-audit checklist (run before returning)

Tick each before submitting summary:
- [ ] Every claim in §5 has a source_artifact reference
- [ ] Every angle in §8 has driver + pole + transformation reference
- [ ] No feature appears in the claims table
- [ ] No transformation is presented as a feature
- [ ] Every "longest-running hook" entry in §10 has a start_date OR §10
      states "no ad-longevity data available"
- [ ] No comparisons to other brands anywhere in the output
- [ ] No "saturated" calls anywhere in the output
- [ ] All 13 sections present (even if a section says "N/A" or "none found")

## Return a SHORT summary (<250 words)

- Brand + slug
- Counts: headlines extracted, claims extracted (base/enhanced split), features extracted, transformations identified, angles cataloged, objection handles, hooks ranked
- Deposit funnel verdict (yes/no/unknown + one-line evidence summary)
- Longest-running hook (verbatim text + days running + library_id) OR "no ad data"
- Extraordinary identifier (if any) + what it is
- Any gaps or unclear-flagged entries that the synth should be aware of
- File path written

NO transformation/saturation analysis across brands. NO comparison to
other brands. NO "this brand vs that brand" framing.
