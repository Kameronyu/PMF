# Corpus Dumper Brief — Per-Brand Marketing Archaeology

You dump ONE brand's marketing materials to a brand-specific corpus directory.
**No synthesis. No classification. No interpretation. Verbatim extraction only.**
A separate synthesizer agent does the analysis later.

## Hard rules

1. **Verbatim only.** Quote actual copy from the source. If you cannot quote
   it, do not write it.
2. **Do NOT tag transformations / claims / niches / angles.** The synthesizer
   does that. You only extract.
3. **Source every extract.** Each copy block gets a URL or `library_id` + ad
   timestamp + date pulled.
4. **Exhaustive over efficient.** Better to over-dump than miss a hidden LP
   or ad. Synthesizer will trim.
5. **No video transcription.** Note video ads exist with format + visible
   text overlay if any; the user will watch them separately.

## Procedure

### Step 1 — Landing page hunt
Discover every landing page the brand runs, not just the main nav.

- WebFetch the brand homepage + main product/pricing/about pages.
- WebSearch these query sets (run all that are plausible for the brand):
  - `<brand> students` · `<brand> college` · `<brand> back to school`
  - `<brand> focus` · `<brand> distraction free`
  - `<brand> calm` · `<brand> digital wellbeing` · `<brand> screen time`
  - `<brand> parents` · `<brand> kids` · `<brand> family`
  - `<brand> writers` · `<brand> journaling` · `<brand> note taking`
  - `<brand> professionals` · `<brand> business` · `<brand> work`
  - `<brand> education` · `<brand> teachers`
  - `<brand> faith` · `<brand> Bible` (if plausible)
- Check known URL patterns: `/clp/`, `/lp/`, `/pages/`, `/campaigns/`,
  `/education`, `/students`, `/focus`, `/parents`, `/kids`, `/press`,
  `/blog`, `/partnerships`, `/business`, `/enterprise`, `/.edu`
- For each LP discovered: WebFetch it. Dump hero copy verbatim + URL.

### Step 2 — Meta Ad Library full dump
For every active ad the brand is running:

- Check `runs/eink-tablets/adlibrary/` for existing `<brand>*.txt`
  artifacts. If recent (within this session), reuse. If stale or missing,
  request the orchestrator to re-run `adlib-one.js` (you may be sandbox-
  blocked from executing it yourself — that is fine, ask).
- For each ad, extract:
  - Verbatim ad copy (primary text + headline + description if present)
  - Landing page URL the ad links to (the CTA destination)
  - PDP URL if different from the LP
  - Ad format (image / carousel / video / collection)
  - `library_id`
  - Start date / "Started running on" if visible in the dump
  - Page section / advertiser-page if the brand has multiple pages
- If page-ID resolves wrong (script picked the wrong advertiser),
  note it and try one tighter query. Cap at 2 tries. Do not invent ads.

### Step 3 — Funnel mechanics
While crawling the site, note (verbatim):
- Pricing tiers / bundles (capture text and price)
- Discount triggers (UNiDAYS, .edu, military, first-purchase, etc.)
- Scarcity / urgency mechanisms ("limited," countdown, stock notices)
- Social proof (review counts, press quotes, testimonials — verbatim)
- Email-capture popups (text + offer if visible)
- Email-sequence trigger pages (newsletter, "get notified")
- CTA-button text variations across pages

### Step 4 — Partnerships / press
- Press releases mentioning the brand (verbatim headline + URL)
- School / pilot / institutional partnerships (verbatim copy + URL)
- Affiliate / referral programs
- Notable influencer / creator collabs (verbatim mention + URL)

## Output

Write to `runs/eink-tablets/marketing-corpus/<brand-slug>/`:

```
landing-pages.md       — every LP discovered, verbatim hero copy + URL
meta-ads.md            — every active ad, verbatim + library_id + LP-URL + start_date + format
funnel-mechanics.md    — pricing tiers, discounts, scarcity, social proof, popups, CTAs
partnerships.md        — press, pilots, partnerships, affiliates
notes.md               — gaps, blocked pages, page-ID issues, anything ambiguous
```

Slug convention: lowercase, hyphenated, brand name only (e.g.,
`supernote`, `kindle-scribe`, `remarkable`, `daylight-dc1`,
`daylight-kids`, `light-phone`, `mudita-kompakt`, `boox`, `ipad`,
`notability-goodnotes`).

## Return a SHORT summary (<200 words)
- Brand + slug
- Counts: LPs discovered, active ads dumped, partnerships found
- Any sandbox blocks or page-ID issues the orchestrator should know about
- One sentence on the dump's completeness
- File paths written
- NO transformation/claim analysis (that's the synthesizer's job)
