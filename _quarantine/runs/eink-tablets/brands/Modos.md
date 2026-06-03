# Modos — Phase 0 Per-Brand Record

- analyzed_at: 2026-05-20
- brand: Modos (Modos Tech Inc.)
- official_url(s): https://modos.tech/ ; https://www.crowdsupply.com/modos-tech (Paper Monitor / Paper Dev Kit, Modos Flow) ; https://www.kickstarter.com/projects/2124728444/modos-flow-the-fast-paper-like-monitor-for-everyday-use (Flow pre-launch preview)
- panel_type: true E Ink electrophoretic (standard e-paper panels driven by a custom open-source FPGA controller — "Glider" driver board)
- sources_used: modos.tech homepage (WebFetch); WebSearch — Crowd Supply campaign data, Liliputing, Tom's Hardware, Notebookcheck, Hackaday, IEEE Spectrum, GIGAZINE, Yanko Design, Hackster.io, The Register, FOSDEM 2024 archive, Hacker News; Meta Ad Library via adlib-one.js (2 runs)

## Product
Open-hardware e-ink display project, three product lines — note the monitor-vs-tablet distinction matters here:
- **Modos Paper Monitor / Paper Dev Kit** — shipping/funded product. A *monitor* (external display), not a tablet. Sold as a dev kit: motherboard + e-paper panel, no case, no finished consumer product. 6" version = $199; 13.3" version = $599 (3:4, 1600×1200 monochrome, ~75 Hz). Driver board = "Glider", FPGA-based, fully open (CERN-OHL-S v2, files on Modos Labs GitHub). Delivery scheduled Jan 2026.
- **Modos Flow** — next-gen product, *touch + stylus*, the closest thing to a tablet but still positioned as a "paper-like monitor." 13.3" E Ink, 3200×2400 (3.2K), 60 Hz, sub-100ms latency, front light (7 brightness / 7 color-temp steps), 3 programmable buttons, 2× USB-C, ~700 g metal body, VESA-mountable, B&W or color variant. Price not yet announced. Crowdfunding campaign not yet launched (Kickstarter preview page only; Modos says it will likely run on Crowd Supply).
- It is an external display / monitor, not a standalone tablet — no onboard OS or apps. Touch/stylus on Flow narrows the gap but it still requires a host computer (Mac/Windows/Linux).

## Transformation(s)
- "a calmer space, for focused work" (verbatim) — distraction-free focus / calm-tech.
- "end screen fatigue forever" (verbatim) — reduced eye strain / screen-fatigue relief.
- "the fast paper-like monitor for everyday use" (verbatim) — paper-feel reading/writing without sacrificing usability.
- My read: dual transformation — (1) eye-strain / screen-fatigue relief and (2) calm/focused work — wrapped in an open-hardware, anti-planned-obsolescence ethos (repairability, user-owned firmware).

## Niche
- Primary: makers, hardware hackers, developers, designers — the open-hardware / FPGA / "hack your own e-ink device" community. Evidence: dev-kit-only SKUs, GitHub-published design files, CERN-OHL license, FPGA controller marketed as a customization surface, press in Hackaday / Hackster / The Register / FOSDEM talks. Founder line: "instead of our secret sauce, we have open sauce."
- Secondary (Flow): broadening toward general knowledge workers / multi-OS users who want a daily-driver focus monitor ("everyday use", touch/stylus, finished case).
- Narrow today (enthusiast/maker), with a deliberate widening attempt via Flow. Identity sold = open-hardware believers / digital-ownership crowd, not mass consumers.

## Claims
| claim (verbatim) | base / enhanced | qualifier type |
|---|---|---|
| "the fast paper-like monitor for everyday use" | enhanced | comparative (paper-like) + speed (fast) |
| "end screen fatigue forever" | enhanced | condition (forever) |
| "a calmer space, for focused work" | base | none |
| "75 Hz refresh rate" / "60 Hz refresh rate" (Flow) | enhanced | speed (numeric) |
| "sub-100ms latency" (Flow) | enhanced | speed (numeric) |
| "open-hardware e-paper monitor" / "open source firmware" | enhanced | mechanism |
| "the fastest ePaper Display" (Paper Dev Kit press framing) | enhanced | comparative (superlative) |
- count: 1 base, 6 enhanced

## Mechanism / UM
- mechanism(s) referenced: custom open-source FPGA display controller ("Glider" board); high refresh rate (60–75 Hz vs typical e-ink ~1 Hz updates); sub-100ms latency; multiple image/dithering modes; four display modes on Flow (Writing, Browsing, Watching, Reading); open firmware users can modify; repairable open-hardware design.
- UM type played: **Feature UM** (primary) — upgrades the recognized e-ink-display category on a specific feature axis: refresh-rate/latency ("60–75 Hz, sub-100ms" vs slow conventional e-ink). Secondary **Product UM** — the open-hardware / open-firmware / user-repairable architecture is positioned as a structurally different kind of e-ink product (anti-lock-in, anti-planned-obsolescence). Not a Problem UM — they assume the buyer already accepts e-ink, they compete on how fast/open it is.

## Marketing framing
- angles:
  - "end screen fatigue forever" | relief from eye strain / health | survival | pain
  - "a calmer space, for focused work" | calm, control over attention | status (mastery/productivity) | desire
  - "open sauce" / own and repair your hardware | autonomy, anti-corporate, belonging to the open-hardware tribe | belonging | desire
  - "the fastest ePaper Display" | technical superiority / bragging rights | status | desire
- awareness level(s) targeted: **solution-aware to product-aware** — the audience already knows e-ink exists and wants it; copy and SKUs assume that and compete on speed/openness. Early-adopter/enthusiast framing throughout (dev kits, GitHub, FPGA). Not problem-aware (no effort spent convincing anyone screens are bad).
- hooks (from ads): N/A — brand runs no Meta ads. Press-headline hooks observed in lieu of ad hooks: "E-Paper Display Reaches the Realm of LCD Screens"; "Modos Makes E-ink Go Fast"; "the fastest ePaper Display."

## Offers / value models
- pricing: Paper Dev Kit — $199 (6") / $599 (13.3"). Flow — unannounced (press expects a premium price given 3.2K panel + finished case).
- bundle: dev kit = motherboard + panel bundled; not a finished consumer device.
- discount: N/A (crowdfunding early-bird tiers likely but not confirmed in sources).
- guarantee: N/A — crowdfunding model, no money-back guarantee surfaced.
- subscription: none. One-time hardware purchase; firmware/design files free and open.
- distribution: crowdfunding-led (Crowd Supply primary; Kickstarter used as preview/pre-launch).

## Trust signals
- Press coverage: IEEE Spectrum, TechRadar, PC Gamer, Tom's Hardware, The Register, Hackaday, Hackster.io, Notebookcheck, GIGAZINE, Yanko Design, CNX Software, Liliputing.
- Crowdfunding social proof: Paper Monitor campaign reported ~331 backers, ~$197.6K raised, ~179% of a $110K goal (per WebSearch summary of Crowd Supply — not independently verified on-page; Crowd Supply blocked direct fetch).
- Open-hardware credibility: full design files + firmware public on GitHub under CERN-OHL-S v2; FOSDEM 2024 conference talks by founder.
- Named founders: Alexander Soto (founder) and Wenting Zhang (co-founder / hardware engineer).
- extraordinary identifier: **borderline yes** — IEEE Spectrum feature coverage ("E-Paper Display Reaches the Realm of LCD Screens") is a credentialed, hard-to-copy third-party endorsement; plus a genuine technical first (highest-refresh open e-paper). Not a celebrity, but credible expert/press authority competitors can't replicate with copy alone. Treat as a moderate extraordinary identifier.

## Sophistication
- market sophistication stage this brand plays at: **Stage 4 (feature-level competition).** A Product UM (e-ink = no blue light / no glare / paper feel) already exists industry-wide and is fully commoditized; Modos does not introduce a new transformation. It competes on a specific feature axis — refresh rate / latency ("60–75 Hz, sub-100ms" vs slow e-ink) — and on a structural differentiator (open hardware/firmware). That is textbook Stage 4. The open-hardware angle pushes lightly toward Stage 3 (an alternative mechanism for a crowd dissatisfied with closed devices), but the dominant message is feature/spec superiority → Stage 4.
- revenue_est: **~$200K cumulative crowdfunding raise, low confidence, basis = Reported.** Paper Monitor campaign reported ~$197.6K raised / ~331 backers (Crowd Supply, via WebSearch summary — not page-verified). Flow campaign not yet launched → $0 to date. No recurring revenue; pre-revenue / crowdfunded startup. Sanity band: 2-person core team (Soto + Zhang), no Crunchbase funding surfaced → consistent with a small pre-revenue open-hardware startup.
- social_proof_volume: ~331 crowdfunding backers (Paper Monitor); no Amazon/Trustpilot listings (not retail-distributed); follower counts not captured. Review "volume" is press articles + maker-community discussion (Hacker News thread on the e-ink laptop concept), not consumer reviews.
- distribution_channels: crowdfunding platforms only — Crowd Supply (primary), Kickstarter (preview). No Amazon, no retail, no own-site checkout for finished product. Direct-to-maker.

## Meta Ad Library
- on Meta: **no**
- active ad count (genuine to brand, approx): **0**
- ad formats / sample hooks / angles / claims: none. Run 1 ("Modos paper") returned 95KB of dump but every "modos" hit was the Spanish word *modos* ("modes") inside unrelated ads (a BOOX ad, a Spanish-language kidney-disease advertorial) — zero genuine Modos ads. Run 2 (tighter query "Modos Flow e-ink monitor") returned Meta's explicit "No ads match your search criteria." Confirmed: Modos does not advertise on Meta. Growth is 100% earned media + crowdfunding-platform discovery + open-hardware community.
- artifact: adlibrary/Modos.txt (note: file was overwritten by run 2; it now holds the "no results" page, not the run-1 keyword dump)

## Reviews / VOC quick-read
- review volume + rough sentiment: no consumer review corpus (Amazon/Trustpilot) — product is dev-kit-only and not retail-sold. Sentiment proxy = tech press + maker community, broadly positive/enthusiastic ("blazing fast" for e-ink, "genuinely interactive", "open sauce" praised). Skepticism centers on it being a dev kit, not a finished product, and on inherent e-ink trade-offs.
- brand loyalty signal: strong niche affinity within the open-hardware crowd — driven by GitHub-published designs, CERN-OHL license, repairability, and founder visibility (FOSDEM talks). Loyalty is ideological (open hardware) more than consumer-experiential.
- hidden use cases / notable likes & dislikes: likes — high refresh enabling responsive stylus sketching, UI-mockup scrolling in real time, paper-like feel, repairable/ownable hardware. Dislikes/trade-offs — higher refresh increases ghosting and lowers contrast vs slow e-ink modes; Paper Monitor cannot display color (Flow adds a color variant); dev kit ships without a case; requires a host computer; pricing high for what you get; Flow price still unknown. Hidden use case: founder's broader ambition is an e-ink laptop / "reimagining personal computing with e-ink" — the monitor/Flow are stepping stones.

## Traffic (SimilarWeb)
PENDING — supplied separately by Kam.

## Notes / gaps
- **Monitor vs tablet:** Modos is fundamentally NOT a tablet brand. Paper Monitor/Dev Kit = external monitor. Modos Flow adds touch + stylus and is the only product that resembles a tablet, but it still has no onboard OS/apps and needs a host PC — it is a "paper-like monitor," not a standalone e-ink tablet. Classify as an adjacent/edge competitor in the e-ink tablet map, not a head-to-head one.
- **Biggest data gap:** no verified financials. The ~$197.6K / ~331-backer figure comes from a WebSearch summary; Crowd Supply blocked direct WebFetch (403), so the raise total, current backer count, and Flow campaign status/price are all unconfirmed on-page. Flow pricing entirely unannounced.
- Not on Meta — confirmed via 2 Ad Library runs. Any DR/paid-social comparison is N/A for this brand; it is a research/positioning reference point only.
- Same-name noise: "Modos" = Spanish for "modes," which polluted the keyword Ad Library search heavily. Future Ad Library checks for this brand should use "Modos Tech" or "Modos Flow" exact strings, not "Modos paper."
- adlibrary/Modos.txt currently holds the run-2 ("no results") page because run 2 overwrote run 1; the run-1 dump contained no genuine Modos ads anyway, so no data lost.
