# Corpus Gaps & Notes — Modos Paper Monitor Dev Kit

Captured: 2026-05-24

---

## Fetch Results

| Source | Method | Result |
|---|---|---|
| Campaign main page | Playwright (pre-run by orchestrator) | SUCCESS — raw/campaign-2026-05-24T19-38-47.txt |
| Campaign update detail pages (all) | WebFetch | BLOCKED — HTTP 403 (Crowd Supply blocks direct fetch on update URLs) |
| Crowd Supply comments section | Not attempted (403 expected) | NOT FETCHED |
| modos.tech pre-launch blog | WebFetch | SUCCESS (partial — body summarized, not full verbatim) |
| Hacker News thread | WebFetch | SUCCESS |
| GitHub Glider issues | WebFetch | SUCCESS (titles only, no comment bodies) |
| Liliputing (Aug 2025 article) | WebFetch | SUCCESS |
| Hackaday article | WebFetch | SUCCESS |
| CNX Software article | WebFetch | SUCCESS |
| IEEE Spectrum article | WebFetch | SUCCESS |
| Hackster.io article | WebFetch | SUCCESS |
| Tom's Hardware pre-launch | WebFetch | SUCCESS |
| Tom's Hardware hands-on (Apr 2026) | WebFetch | SUCCESS |
| Notebookcheck article | WebFetch | SUCCESS |
| Crowd Supply Teardown Session 51 | WebFetch | BLOCKED — HTTP 403 |
| Good e-Reader "what happened" | WebFetch | SUCCESS but outdated (pre-campaign) |
| Hacker News older thread (item 31858659) | WebFetch | BLOCKED — HTTP 429 |
| Kicktraq or equivalent | N/A | Crowd Supply not covered by Kicktraq |

---

## Gaps

1. **Campaign update bodies:** All 11 update detail pages returned 403. Only titles and dates confirmed; body text is inferred from search snippets and cached metadata. Body text marked as "not extractable" in updates.md.

2. **Crowd Supply comments section:** Not fetched. No direct backer comment text available. HN thread used as community proxy. Campaign comments section URL pattern unknown.

3. **Daily pledge timeline:** Crowd Supply has no Kicktraq equivalent. No per-day raise data available. Milestone snapshots reconstructed from update publication dates and press embargo timing.

4. **Exact day-1 raise:** Unknown. Campaign launched Aug 4, 2025; first press wave Aug 5–6, suggesting fast early traction but not quantifiable.

5. **Tier backer split (6" vs. 13"):** Crowd Supply does not expose per-tier backer counts in the public campaign page. Total 355 backers across both SKUs. Average pledge ~$556 suggests heavy 13" weighting.

6. **Crowd Supply Teardown Session 51 body:** Blocked (403).

7. **Pre-launch modos.tech blog verbatim full text:** WebFetch returned a summary rather than full verbatim — blog may use JavaScript rendering. Key quotes captured; exact paragraphs not fully verbatim.

8. **Launch agency:** No evidence found. Self-run campaign. NLnet partial funder of Caster (not a launch agency).

9. **BackerKit presence:** No BackerKit pre-launch or post-campaign page found. Fulfillment appears handled entirely through Crowd Supply / Mouser.

10. **Wayback Machine pre-launch URL:** Not checked. Pre-launch Crowd Supply page URL is the same as live campaign URL; Wayback capture of pre-launch state not attempted.

---

## Typos / Errors in Source Material

- Campaign page contains "open hardwayore" (line 148 of txt artifact) — typo for "open hardware." Preserved verbatim in campaign-body.md with note.

---

## Platform Notes

- Crowd Supply uses Cloudflare but Playwright successfully fetched the main campaign page.
- Update detail pages and editorial pages (Teardown Sessions) are blocked via direct WebFetch.
- Crowd Supply does not surface per-tier backer counts or daily raise data publicly.
