# notes.md — EeWrite E-Pad (eewrite-epad)
Captured: 2026-05-24

---

## Fetch attempts and results

| URL | Type | Status |
|---|---|---|
| https://www.kickstarter.com/projects/479880611/e-pad-the-e-ink-android-tablet | campaign | BLOCKED — 403 Forbidden |
| https://www.kickstarter.com/projects/479880611/e-pad-the-e-ink-android-tablet/faqs | faq | BLOCKED — 403 Forbidden |
| https://www.kickstarter.com/projects/479880611/e-pad-the-e-ink-android-tablet/posts | updates | BLOCKED — 403 Forbidden |
| https://www.kickstarter.com/projects/479880611/e-pad-the-e-ink-android-tablet/posts/2823046/comments | comments | BLOCKED — 403 Forbidden |
| https://www.kicktraq.com/projects/479880611/e-pad-the-e-ink-android-tablet/ | chronology | SUCCESS — milestone data retrieved |
| https://www.kicktraq.com/projects/479880611/e-pad-the-e-ink-android-tablet/#chart-daily | daily chart | PARTIAL — chart images not text-readable |
| https://www.indiegogo.com/projects/e-pad-the-e-ink-android-tablet--4 | IGG campaign | BLOCKED — only page title returned |
| https://web.archive.org/web/2019*/... | Wayback | BLOCKED — web.archive.org fetch fails in this environment |
| https://news.ycombinator.com/item?id=20128737 | HN comments | BLOCKED — 429 Too Many Requests |
| https://liliputing.com/2019/03/... | press | BLOCKED — 403 Forbidden |
| node crowdfund-fetch.js | Playwright | BLOCKED — Bash execution denied |

---

## PLAYWRIGHT BLOCKED

The crowdfund-fetch.js Playwright helper was not executed. Bash tool permission was denied. All KS campaign body text, tier copy, FAQ, updates, and comments were sourced from secondary materials (press coverage, reviews, forums).

---

## Data gaps

1. **Hero copy / story verbatim**: KS campaign body not retrievable. Reconstructed from press release and pre-launch articles. The PR Newswire release (2019-03-26) is the closest to primary source available.

2. **Risks & Challenges section**: Not found in any secondary source.

3. **FAQ section**: Not found. Exists at KS but blocked.

4. **Update post titles and bodies**: 19 total updates confirmed, but individual post content not retrievable. One post URL found (/posts/2823046) but also 403.

5. **KS comment verbatims**: KS comments page 403. No backer-verbatim comment text obtained. Community voice comes from MobileRead (pre-launch skepticism), NotebookChat (one post-ship backer), and press editorial summaries.

6. **Pledge cancellation count**: GoodEReader describes "high percentage" but gives no number. Kicktraq shows 893 final backers but no cancellation tracking.

7. **IGG campaign totals**: IGG page returned only title. $800k+ combined figure sourced from GoodEReader editorial statement only — not independently verified from IGG page.

8. **Tier backer counts and sold-out flags**: Not recoverable.

9. **Exact ship date**: Approximate — some units appear to have shipped by June–September 2019 (KOReader issue June 12, HLarch backer post September 29). Processor redesign may have delayed a second wave.

10. **Liliputing article body**: 403 Forbidden. Headline and URL confirmed but content not extracted.

---

## Source reliability notes

- GoodEReader (Michael Kozlowski) is the primary source for most qualitative claims. MobileRead community has documented GoodEReader as "a very poor resource" with credibility issues. However, GoodEReader's "going back to drawing board" article is corroborated by review evidence from NotebookCheck and NotebookChat, so the core failure narrative is treated as reliable.
- The ~$800k total cross-platform figure comes from GoodEReader only. Should be treated as approximate.
- NotebookCheck review and HLarch backer forum post are treated as most reliable negative signal sources — independent of GoodEReader.
