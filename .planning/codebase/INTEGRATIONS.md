# External Integrations

**Analysis Date:** 2026-06-01

## Overview

All external data enters the pipeline as manually triggered, script-collected artifacts or
human-fetched content. There are no API keys, no webhooks, no SDK clients, and no
authenticated service connections baked into the repo. External access is always
ephemeral — scripts run, artifacts land on disk, agents read the artifacts.

---

## Meta / Facebook Ad Library

**What it provides:**
- Active ad count per advertiser
- Full ad dump (ad copy, creative format, Library IDs, run dates implied by `days_running`)
- Used to assess whether a brand is scaling on Meta — "absence of ads is data"

**How it's accessed:**
- `runs/eink-tablets/scripts/adlib-one.js` — headless Playwright; resolves brand name →
  Facebook Page ID via typeahead autocomplete, then queries
  `facebook.com/ads/library/?view_all_page_id=<pageId>`
- `runs/eink-tablets/scripts/adlib-sweep.js` — batch variant
- `runs/eink-tablets/scripts/rerun-adv.sh` — shell loop for known brands

**Auth:** None (Meta Ad Library is public). Cookie consent banners are auto-dismissed.

**Output location:** `runs/eink-tablets/adlibrary/<slug>_adv.txt` + `_adv.png`

**Output format:** Plain text — resolved advertiser name, pageID, follower count, active ad
count string, full `document.body.innerText` of the results page.

**Known hazard:** Page ID resolution can mis-fire when brand names collide (e.g., Kindle Scribe
resolved to wrong page in the Faith run). Requires Page-ID sanity check: verify the resolved
advertiser name matches the target brand before counting ads. `analyzer-framework.md` marks
this step REQUIRED, not optional.

**Sample brands analyzed:** Boox, reMarkable, Kobo, Supernote, Kindle Scribe, Daylight,
PocketBook, Viwoods, XPPen, TCL, Dasung, Bigme, FujitsuQuaderno, Harbor — plus adjacents
(Gabb Wireless, Apple, Hallow, Dwell, Logos, GoodNotes, Bark Phone, Mudita Kompakt,
Light Phone).

---

## Crowdfunding Platforms (Kickstarter, Indiegogo, Crowd Supply, BackerKit)

**What it provides:**
- Campaign body (hero copy, reward tiers, stretch goals, specs)
- Backer comments (objections, questions, sentiment)
- Campaign updates (creator posts, shipping delays, pivots)
- Raise chronology (goal, raised, % funded, status, launch date)
- Pre-launch social proof signals

**Why it matters for this framework:**
- Crowdfunding campaigns are the primary data source for understanding how e-ink / adjacent
  hardware brands LAUNCHED — messaging, positioning, proof structure, and objection sets
- The teardown analysis (`handoff-crowdfunding-teardown.md`) produces a "copyable launch
  playbook + objection list" for Inkleaf's own ~$100k campaign

**How it's accessed:**
- `runs/eink-tablets/scripts/crowdfund-fetch.js` — Playwright with stealth defaults.
  Bypasses Cloudflare 403s and JS-rendered SPAs (Kickstarter, Indiegogo both block simple
  WebFetch). Clicks "load more" on comments ×5 to paginate.
- Usage: `node crowdfund-fetch.js <slug> <url> [--type=campaign|comments|updates|risks|faq]`

**Auth:** None for public campaign pages.

**Output location:** `runs/eink-tablets/crowdfunding-corpus/<slug>/raw/<type>-<timestamp>.{html,txt,png}`

**Campaigns fetched:**
- Viwoods AiPaper (Kickstarter — $275k raise)
- Bigme GALY (Kickstarter)
- Reinkstone R1 (Kickstarter)
- ZeroWriter Fold / Ink (Kickstarter / Crowd Supply)
- Diptyx (Crowd Supply — $64k+ raise as of Dec 2025)
- iFLYTEK AiNote 2 (Kickstarter)
- Freewrite Smart Typewriter / Traveler (Kickstarter / Indiegogo)
- Dasung NOT-eReader-7 (Indiegogo)
- Eewrite ePad (Kickstarter)
- Modos Paper (Crowd Supply)
- Bluegen OKPad (Kickstarter — $119k raise; smoke-test case)

---

## Brand Websites (DTC Landing Pages, Product Pages, Funnels)

**What it provides:**
- Hero copy, claims, mechanisms, angle signals
- Offer structure (pricing, bundles, guarantees, subscriptions)
- Trust signals (press logos, UGC, credentials)
- Segmented landing pages (student, professional, faith, etc.) accessible via LP-hunt queries

**How it's accessed:**
- Primary: Claude's built-in WebFetch tool (used directly by analyzer agents)
- Fallback / Cloudflare bypass: `crowdfund-fetch.js` with `--out=runs/eink-tablets/marketing-corpus`
  (same Playwright script, repurposed for any JS-rendered site)
- LP-hunt query template (from `prompts/phase1-light-pass.md`): `<brand> students|college|...`,
  `<brand> focus|distraction-free`, plus URL patterns `/clp/ /lp/ /pages/ /campaigns/ ...`

**Output location:** `runs/eink-tablets/marketing-corpus/<brand>/` — structured `.md` analysis
files (e.g., `meta-ads.md`, `landing-pages.md`, `granular-analysis.md`)

**Brands analyzed (marketing corpus):**
reMarkable (multiple Wayback snapshots), Boox, Supernote, Kindle Scribe, Daylight DC-1,
Light Phone, Mudita Kompakt, iPad (Apple), GoodNotes, Notability — plus market segments:
`markets/M1-paper-replacement/`, `M2-calm/`, `M3-student-notetaking/`, `M4-general-purpose-tablet/`

---

## Wayback Machine (web.archive.org)

**What it provides:**
- Historical snapshots of competitor landing pages and positioning — used to reconstruct
  how brands messaged at launch vs. current (category evolution research)
- Source for understanding how reMarkable, Boox, Supernote evolved their messaging over time

**How it's accessed:**
- Via `crowdfund-fetch.js` with Wayback URLs as the target:
  `https://web.archive.org/web/*/supernote.com/preorder*`
- Explicit allowed commands in `.claude/settings.json` for `remarkable-wayback`,
  `supernote-wayback`, `boox-wayback`, `apple-ipad-wayback` snapshots

**Output location:** `runs/eink-tablets/marketing-corpus/<brand>-wayback/raw/`

---

## SimilarWeb (Traffic Analysis)

**What it provides:**
- Traffic source breakdown per brand domain (direct, organic, social, referral, paid)
- Channel concentration signals
- "Competitors NOT scaling on Meta" flag — gap opportunity

**How it's accessed:**
- `runs/eink-tablets/scripts/sw-login.js` — opens headed Chromium with persistent profile
  for manual login; saves session to `~/.cache/pmf-sw-profile`
- `runs/eink-tablets/scripts/sw-sweep.js` — batch sweep using saved profile; screenshots +
  innerText per domain

**Auth:** Requires a real SimilarWeb account. Login is manual (headed browser); session
persists in `~/.cache/pmf-sw-profile`.

**Brands in sweep:** reMarkable, Boox, Kobo, Supernote, Bigme, Viwoods, iFLYTEK, Reinkstone,
Dasung, MobiScribe, PocketBook, Hisense-eink, Fujitsu-Quaderno, Moaan, Modos, Daylight,
Harbor, TCL, XPPen, iReader, Hanvon, Ridibooks, Pubu (24 domains)

**Note:** iFLYTEK and TCL are conglomerates — traffic is whole-company, flagged in script.

---

## Research Literature (scite / Web of Science)

**What it provides:**
- Mechanism research: known biological pathways, evidence quality, IP signals
- Used in Phase 3c (UM research) — understand what the transformation does factually

**How it's accessed:**
- Cited as tool in `capability_inventory.md` → Mechanism research Op:
  "scite, web of science, web search"
- `scite` MCP server is available in the Claude environment
- Outputs land in mechanism research records (currently produced manually in runs)

**Current status:** Mechanism research capability is defined but not yet run for the eink
arc (Phase 3 not yet executed).

---

## Alibaba AI (Product Sourcing Intelligence)

**What it provides:**
- COGS floor signals
- Product format candidates for a given transformation
- Existing manufacturer/supplier landscape

**How it's accessed:**
- Listed as a tool in `capability_inventory.md` → Mechanism research and Product candidate
  discovery Ops: "Alibaba AI, emerging product scanning"
- Currently manual / not yet scripted

**Current status:** Planned capability; not executed in eink arc.

---

## Mintel / IBISWorld / MRI-Simmons / Statista (Institutional Reports)

**What it provides:**
- Large-scale demographic and category market research
- Feeds Phase 3a Lane 3 (adjacent context in niche venue)
- Cross-referenced with VOC to validate avatar characteristics at scale
- Reduces "Frankenstein avatar" risk by grounding niche claims in non-noisy large datasets

**How it's accessed:**
- Defined in `capability_inventory.md` → Institutional report retrieval Op
- Access assumed to be via subscriptions; no scripted integration
- Retrieved content feeds the classifier as another VOC source

**Current status:** Capability defined; not yet run in eink arc.

---

## Reddit / Amazon / TikTok / YouTube / Facebook / Quora (VOC Sources)

**What it provides:**
- Raw voice-of-customer (VOC) text for Phase 3a/3b PMBD mining
- Sub-niche validation (5+ co-occurrence rule)
- Verbatim copy bank (exact buyer language for ad copy)

**How it's accessed:**
- `capability_inventory.md` defines VOC scraper as an Op that "may fragment into
  platform-specific scrapers (Reddit JSON, Amazon scrape, TikTok, YouTube) under one
  umbrella capability"
- No scrapers currently built; VOC phases not yet run in the eink arc

**Current status:** Capability designed but not implemented. Phase 3 is explicitly marked
"Not yet run. Full theory in the reservoir" in `flow.md`.

---

## Google Trends / Glimpse (Trend Signals)

**What it provides:**
- Trend velocity per transformation, product, or niche
- "Why now" signals, adjacent trend identification
- Evergreen vs. emerging classification

**How it's accessed:**
- Named as sources in `capability_inventory.md` → Trend/temporal signal Op
- Currently accessed manually by human or general web search during runs

**Current status:** Capability defined; partially used manually in Phase 0 runs.

---

## Integration Access Pattern Summary

| Source | Auth Required | Scripted | Status |
|--------|--------------|---------|--------|
| Meta Ad Library | No | Yes (`adlib-one.js`) | Active, used in all market scans |
| Kickstarter/Indiegogo/Crowd Supply | No | Yes (`crowdfund-fetch.js`) | Active, crowdfunding arc |
| Brand DTC websites | No | Fallback only | Active, WebFetch primary |
| Wayback Machine | No | Via `crowdfund-fetch.js` | Active, category evolution |
| SimilarWeb | Yes (manual login) | Yes (`sw-sweep.js`) | Active, eink arc |
| scite / academic lit | No (MCP) | No | Planned, Phase 3c |
| Alibaba | No | No | Planned, Phase 3c |
| Mintel / IBISWorld | Yes (subscription) | No | Planned, Phase 3a |
| Reddit/Amazon/TikTok/YouTube | No | No | Planned, Phase 3b VOC chain |
| Google Trends / Glimpse | No | No | Planned, Phase 0/1 trend signals |

---

*Integration audit: 2026-06-01*
