# notes.md — Bigme Galy
slug: bigme-galy
captured: 2026-05-24

---

## Fetch Blockers

### PLAYWRIGHT BLOCKED
- `node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js` — Bash execution was denied in this session. No raw HTML/TXT/PNG artifacts were generated. `/raw/` directory created but empty.
- Impact: verbatim KS campaign body, reward tier descriptions, risks & challenges, FAQ, and comments sections could NOT be captured from the KS page directly.

### Kickstarter 403 on WebFetch
- https://www.kickstarter.com/projects/bigme/galy — 403 Forbidden
- https://www.kickstarter.com/projects/bigme/galy/posts/3772910 (Update #7) — 403 Forbidden
- https://www.kickstarter.com/projects/bigme/galy/posts/4665712 (Update #14) — 403 Forbidden

### Indiegogo 403
- https://www.indiegogo.com/projects/bigme-galy-world-s-first-e-ink-gallery-3-tablet — page loaded but returned only header/title (SPA rendered; no campaign body extracted)

### BackerKit 403
- https://www.backerkit.com/projects/bigme/galy — 403 Forbidden

### Wayback Machine blocked
- web.archive.org — not accessible from this environment ("Claude Code is unable to fetch from web.archive.org")

### EIN Presswire / press syndication 403s
- https://www.bigcountryhomepage.com/business/press-releases/... — 403
- https://www.einnews.com/pr_news/... — 403
- Benzinga press release URL used instead successfully (partial)
- markets.financialcontent.com version retrieved successfully for core press release content

### ktm2day 403
- https://www.ktm2day.com/bigme-galy-worlds-first-color-e-ink-gallery-3-tablet/ — 403 Forbidden

---

## Data Gaps

### Tier descriptions
Verbatim reward tier names and exact contents not retrieved. Prices confirmed ($489 super-early-bird / $539 early-bird / $599 standard / $699 retail) from 5+ independent sources. Backer counts per tier, exact quantity limits, and add-on structure unknown.

### Risks & Challenges section
Not retrieved. KS page blocked.

### FAQ section
Not retrieved. KS page blocked.

### KS comments (verbatim)
Not retrieved. KS /comments 403'd. Comment themes reconstructed from published reviews only.

### Updates #2–6 and #8–13
Content not retrieved. Only Update #1 (goal-hit, Nov 17) and Update #7 (shipping batch 3, Sep 27, 2023) partially reconstructed from search snippets. Update #14 (Apr 16, 2026) title confirmed but body 403'd.

### Daily pledge data / Kicktraq chart
Kicktraq page loaded but daily chart images not extractable as text. Day-1 exact amount, first 48h total, and final-72h bump all unquantified.

### Full fulfillment date
Whether all 696 backers received their units is not confirmed. Last confirmed batch (#125–160) shipped Sep 27, 2023. Remaining fulfillment status unknown.

### Indiegogo InDemand totals
Post-KS raise amount not confirmed. Bigme's $700k lifetime figure appears to include IGG + retail.

### Battery discrepancy
Battery capacity: sources cite either 3,000 mAh (Liliputing, Notebookcheck, Good e-Reader Nov 19) or 4,000 mAh (evolution record, Good e-Reader pre-launch Nov 13). The 4,000 mAh figure may reflect pre-production spec that was revised; 3,000 mAh more frequently cited in review-era coverage.

### Camera discrepancy
Pre-launch (Nov 13): "5 MP front and 5 MP rear" (Good e-Reader pre-launch)
Launch / review coverage: "8 MP rear + 5 MP front" (Liliputing Nov 16, Notebookcheck Nov 18, evolution record)
Likely pre-launch spec change; 8 MP rear is the shipping spec.

---

## Reuse from Evolution Record

The following content was sourced from `/home/kyu3/PMF/runs/eink-tablets/eink-category-evolution/brands/bigme-galy.md` (analyzed 2026-05-23) rather than re-researched:
- Full hardware spec list
- Transformation / mechanism / UM classification (not included in corpus per brief — synth's job)
- Pricing tiers ($539 / $599 / $699)
- Trust signal: prior inkNote Color campaign (~$624k / 1,187 backers)
- VOC summary (battery, sluggishness, color praise)
- Distribution channels
- Revenue estimate ($421k KS / $700k lifetime)
- Evolution status and competitive context
