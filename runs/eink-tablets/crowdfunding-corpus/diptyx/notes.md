# Diptyx E-Reader — Corpus Notes / Gaps / Blocks
- captured: 2026-05-24

---

## Fetch Status by Source

| Source | Type | Status |
|---|---|---|
| crowdsupply.com/diptyx/diptyx-e-reader | campaign body | BLOCKED — 403 |
| crowdsupply.com/diptyx/diptyx-e-reader/updates/* (all 3 known slugs) | updates | BLOCKED — 403 |
| diptyx.dev | pre-launch / hero copy | SUCCESS — WebFetch |
| cnx-software.com Dec 12 2025 | press | SUCCESS — WebFetch |
| liliputing.com Dec 12 2025 | press | SUCCESS — WebFetch |
| techeblog.com Oct 26 2025 | press | SUCCESS — WebFetch |
| yankodesign.com Oct 28 2025 | press | SUCCESS — WebFetch (partial summary) |
| notebookcheck.net Oct 24 2025 | press | SUCCESS — WebFetch |
| hackaday.com Dec 24 2025 | press | SUCCESS — WebFetch |
| linuxiac.com Dec 14 2025 | press | SUCCESS — WebFetch |
| goodereader.com Oct 27 2025 | press | SUCCESS — WebFetch |
| hackster.io (2 articles) | press | SUCCESS — WebFetch (partial summaries) |
| hackaday.io/project/204323 | project log | SUCCESS — WebFetch |
| mobileread.com forums (pages 1–3) | comments | SUCCESS — WebFetch |
| electronics-lab.com | press | BLOCKED — 403 |
| ereadersforum.com | comments | BLOCKED — 403 |
| web.archive.org | Wayback | BLOCKED — agent restriction |
| github.com/MartijndenHoed/Diptyx | repo | SUCCESS — WebFetch (partial) |

---

## Known Gaps

1. **Campaign body verbatim** — hero/story/risks/FAQ copy directly from the Crowd Supply campaign page not extractable. Filled from diptyx.dev (confirmed as mirroring campaign copy) and press quotations. Risk: campaign page may contain additional copy, a longer story section, or a risks section not surfaced in press.

2. **Risks & Challenges section** — not found in any press source. Likely exists on campaign page (standard Crowd Supply element) but inaccessible.

3. **Full FAQ** — only 2 Q&A fragments surfaced via search (3D printing housing, EU shipping costs). Actual campaign FAQ not recovered.

4. **Updates body text** — all 9 updates identified by slug/title; body text of 3 known slugs not extractable (403). 6 additional updates have neither titles nor body text.

5. **Exact campaign close date** — approximately late January 2026 based on "39 days remaining" on Dec 14, but not confirmed precisely.

6. **Chronology anomaly** — Linuxiac (Dec 14) reports $17,410 / 39 days remaining, which conflicts with CNX/Liliputing (Dec 12) reporting $64,440. Likely a cached/pre-surge Linuxiac fetch or different metric. Do not use Linuxiac figure as authoritative mid-campaign data point without verification.

7. **Wayback Machine** — blocked for this agent. Cannot verify earliest diptyx.dev snapshot date or confirm what the pre-launch page looked like before Oct 23 2025.

8. **GitHub earliest commit date** — not captured. Cannot confirm when code was first published.

9. **Open-source release completion** — creator promised to release FreeCAD + KiCad + firmware post-campaign. GitHub repo exists (9 stars, 0 forks) but whether full open-source release is complete not confirmed.

10. **Shipping confirmation** — May 2026 delivery window is current. No confirmed "units shipped" reports found. Outcome should be refreshed after June 2026.

11. **Pre-launch subscriber count** — Crowd Supply notify-me system was in use; subscriber count not found in any source.

12. **Reddit posts by u/spacerower** — NotebookCheck confirms creator is u/spacerower on Reddit and posted to the e-reader subreddit pre-launch. Specific posts not fetched.

---

## PLAYWRIGHT BLOCKED

`crowdfund-fetch.js` Bash command blocked by sandbox (permission denial). All crowdsupply.com pages 403 to direct WebFetch. No raw/ artifacts created.

---

## Meta Ad Library

- Not run (adlib-one.js Bash blocked in prior session and this session).
- High-confidence prior: zero Meta ads. Solo-dev Crowd Supply campaign; buyer pool is maker/open-source press. Running Meta ads for an anti-corporate-lock-in device would be self-undermining.
