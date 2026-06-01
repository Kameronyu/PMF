# BOOX — Notes / Gaps / Issues

- brand: BOOX
- slug: boox
- pulled_at: 2026-05-23
- author note: this corpus was completed by a second agent after a prior crash that left only `landing-pages.md` written. No re-runs of the adlib script were needed — existing artifacts in `runs/eink-tablets/adlibrary/` (Boox.txt, Boox_adv.txt, boox-kw_adv.txt) were reused.

---

## 1. Resolved-advertiser confirmation
- Resolved Meta page: BOOX (pageID `332982860126864`, 75,700 followers, @boox.global, Electronics Company) — confirmed via both `Boox_adv.txt` and `boox-kw_adv.txt` typeahead headers. This is the canonical BOOX brand page, not an imposter.
- Adlib script reported `~230 active ads` at pull time. We dumped 45 unique creative clusters in `meta-ads.md` (cap per brief was ~30; we slightly over-shot to cover all distinct pitches across Palma, Go 10.3, Note Air5 C, Tab X C, B2B, Tappy, mission-statement, and 7 distributor pages).
- Note in brief incorrectly attributed "835 followers" — that was Bigme. BOOX has 75.7K followers. No page-ID confusion in our pull.

---

## 2. Scope caps / under-coverage
- BOOX runs ~230 active ads. We captured 45 unique creative clusters covering all visible pitch lanes. Remaining ~185 ads are largely:
  - Format-variant duplicates (same primary text, different aspect ratio / video vs image)
  - Regional-language duplicates from distributor pages
  - "X ads use this creative and text" rollups (each rollup represents the same copy in N slot-variants)
- If synthesizer needs deeper coverage on any single lane (e.g., 5G/A-GPS Palma sub-pitch), the source text files in `runs/eink-tablets/adlibrary/` retain the full ~93 library_ids that were loaded (per `boox-kw_adv.txt` line 7: `library_ids_loaded: 93`).

---

## 3. Blocked / partially-captured pages

### WebFetch refused full body (copyright)
- Brain Rot pillar blog (shop.boox.com/blogs/news/brain-rot-is-real-here-s-how-to-reverse-it) — title + section headers + opening sentences captured; full paragraphs need direct browser fetch.
- Same constraint applies to most blog-post bodies — landing-pages.md has titles + section headers but most full paragraphs are not reproduced.

### Not fetched in this run (URL surfaced but not WebFetched)
- Most of the "Additional discovered LPs" in landing-pages.md §21 (the long list of ~60 blog URLs) had titles captured from the index but bodies NOT fetched. If the synthesizer needs verbatim hero/body from any specific one, it must be fetched individually.

### Authentication-walled
- affiliates.boox.com and affiliateseu.boox.com — affiliate program terms not captured (portal login required).
- business.boox.com — contact form fields captured, but enterprise pricing / case studies not surfaced (sales-team-driven).

### Popups / overlays not captured
- shop.boox.com homepage and PDPs were captured via WebFetch which renders DOM text without JS-triggered popups. Email-capture / exit-intent / first-visit overlays — if BOOX runs them — are NOT in this corpus.

---

## 4. Page-ID / advertiser ambiguity
- None for the main BOOX page (cleanly resolved).
- Distributor pages are clearly separate advertisers running BOOX-branded creative (Onyx Boox Türkiye, Onyx BOOX Singapore, BOOX ישראל, Ereader Argentina, Czytio.pl, eBookReader.dk, Akishop). Synthesizer should treat these as **distinct paid-media surfaces** — they may run pitches BOOX-corporate would not (e.g., Akishop's heavy discount bundling).

---

## 5. Pricing ambiguity
- Palma 2 Pro: PDP shows $379.99 in our capture; an earlier WebSearch snippet shows $399.99. Suspect a recent price change. Use $379.99 as canonical-as-of-2026-05-23.
- Go 10.3 (Gen II) shows two different prices ($419.99 on homepage best-seller card vs $399.99 on PDP). Different SKUs in the three-tier ladder (Lumi/standard/Gen-I).

---

## 6. Stale artifacts
- booxstudent.myshopify.com footer copyright is "© 2022 Onyx International Inc." — store is live but footer year is stale. Note for record.

---

## 7. Notable absences (worth synthesizer attention)

These are things we LOOKED for and did NOT find in BOOX's surfaces — they may be deliberate brand decisions or genuine gaps:

- **No faith / Bible pitch** despite that being on the brief's standard query set. BOOX does NOT run a faith-segment landing page or ad.
- **No kids / family / parent pitch.** BOOX has zero "for kids" or "for parents" LP. (Compare: Daylight runs a dedicated `daylight-kids` brand.)
- **No school / institutional case studies / named pilots.** B2B exists but is sales-team-driven, not case-study-driven.
- **No customer-review aggregation** (star ratings, review counts) on shop.boox.com PDPs — social proof is press-quote-driven not customer-review-driven.
- **No countdown timers, in-stock urgency, or first-visit popup** captured. Scarcity runs through fixed promotional windows (back-to-school, anniversary sale) only.
- **No subscription / membership / loyalty program** surfaced.
- **No trade-in / used-device-buyback program** mentioned in homepage nav (though "Used devices" tab exists at shop.boox.com/collections/used-device — sells used inventory but trade-in mechanism not captured).

---

## 8. Pitch-lane saturation observation (verbatim-quote scope only — NOT synthesis)

The blog index has 30+ distinct posts mapping to the "digital wellness / brain rot / doomscrolling / mindfulness / focus / digital minimalism / intentional living" cluster (see landing-pages.md §21). Same recurring vocabulary in active ad-copy: "slow down, minimize distractions, and be present" / "pocket escape from the algorithm" / "calm color ePaper device" / "mindful space" / "balanced lifestyle" / "intentional living". The synthesizer should weight this lane heavily when scoring BOOX's transformation positioning.

---

## 9. Files written this run
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/boox/landing-pages.md` (written by prior agent; reused, NOT modified)
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/boox/meta-ads.md` (written this run)
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/boox/funnel-mechanics.md` (written this run)
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/boox/partnerships.md` (written this run)
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/boox/notes.md` (this file)
