# Diptyx E-Reader — E-Ink Category Evolution Per-Competitor Record

- analyzed_at: 2026-05-23
- competitor: Diptyx E-Reader (creator: Martijn den Hoed)
- stratum: e-ink-foldable-open-source
- official_url(s):
  - https://www.crowdsupply.com/diptyx/diptyx-e-reader (campaign — 403 to WebFetch)
  - https://diptyx.dev/ (project site)
  - https://github.com/MartijndenHoed/Diptyx (technical docs / firmware)
  - https://hackaday.io/project/204323-diptyx-e-reader (build log)
- sources_used: diptyx.dev (WebFetch), Yanko Design (WebFetch), NotebookCheck (WebFetch),
  CNX Software, Liliputing, Hackster, Electronics-Lab, Linuxiac, TechEBlog, Good e-Reader,
  MobileRead Forums (WebSearch synthesis). Crowd Supply campaign page returns 403 to
  WebFetch — figures triangulated from CNX, NotebookCheck, Hackster, Electronics-Lab,
  Linuxiac, Yanko Design coverage.

## Product
Single SKU. Dual-panel book-fold e-reader. Two 5.83" monochrome E Ink panels
(640×480 each, ~137 ppi) on a center hinge; closed 4.7×5.9×0.6 in (120×150×14 mm),
opened 226 mm wide; weight 300 g / 10.5 oz. ESP32-S3-N16R8 @ 240 MHz, 16 MB flash,
8 MB RAM, 2 GB user-replaceable microSD, USB-C (file transfer + charge), dual
1500 mAh Li-Po batteries. Wi-Fi / BT physically present in the module but disabled
in firmware. Navigation button array; no touchscreen. Custom firmware reads
DRM-free EPUB only. **Pricing model: one-time, $230 pledge + $12 ROW shipping
(US free)**. No subscription, no app store, no cloud component.

## Transformation(s)
- dominant frame: **Genuine ownership of your reading device and library** —
  "Own your device, own your books" (diptyx.dev hero). The buyer's life-state
  change: stop renting from Amazon/Kobo, become an owner-operator of the reading
  hardware and the EPUB files on it.
- secondary: (a) **Book-shaped reading object restored** — a paperback-feeling
  digital device that "fits in your purse like an old favorite novel" / "brings
  books back to life" (creator framing, TechEBlog headline). (b) **Permanent /
  forever device** — "let you read whenever and wherever you want, forever"
  (diptyx.dev) — implicit anti-obsolescence transformation.
- evidence: diptyx.dev hero "Own your device, own your books." Yanko Design:
  "Most e-readers lock you into one screen, one store, and one way to read your
  digital library without much choice or flexibility." Creator (NotebookCheck):
  built it after his Kobo Clara BW broke and he refused to buy another
  locked-down reader.

## Niche
- niche: **Open-source / DIY hardware tinkerers + anti-DRM digital-ownership
  readers.** A blended identity — the maker/hacker crowd (Hackaday, MobileRead,
  r/eink, KiCad/FreeCAD users) overlapping with the EPUB-hoarder / Calibre-user
  crowd who reject the Amazon-Kindle walled garden.
- targeted sub-niche: Self-identified "I want to own my e-reader" buyer — owns
  their own EPUB library (often via Calibre / non-Amazon stores), already
  resentful of DRM, and wants either a buildable device or a device whose
  schematics they could in principle fork. Secondary: aesthetic-minded readers
  who specifically want the **book metaphor** (two facing pages, hinge,
  paperback shape) over slab-tablet form.
- evidence: Yanko Design "for tinkerers, readers, and anyone who wants to truly
  own their digital books and the device that displays them" (Martijn den Hoed
  quote). diptyx.dev "Fully open-source, Diptyx is easy to repair and customize"
  + "users are free to modify the source code itself: add Wi-Fi functionality
  such as an RSS reader, create unique custom games" + "the limit is your own
  imagination." Crowd Supply platform itself selects for open-hardware buyers.

## Buyer
- primary buyer: **Self.** Adult, technically literate, almost certainly male-
  skewed given the Hackaday / Crowd Supply / KiCad audience profile. Self-buys
  at $230 + $12 for an unproven first-run device — not a gift, not institutional.
- purchase context: Direct crowdfunding pledge on Crowd Supply. Pre-order, no
  retail. Buyer accepts ~6-month wait for May 2026 delivery and the risk profile
  of a sub-$100k indie campaign by a solo developer.
- where bought: Crowd Supply only (campaign window). Post-fulfillment,
  hardware/firmware open-sourced on GitHub — implicitly invites
  self-manufacture as a long-tail "channel."
- evidence: $230 pledge tier, single SKU, no enterprise / EDU tier, no parental
  framing in any source. Crowd Supply's audience itself is the audience signal.

## Claims  (outcome-promises only)
| claim (verbatim) | base / enhanced | qualifier type |
|---|---|---|
| "Own your device, own your books." | base | none (pure ownership claim) |
| "let you read whenever and wherever you want, forever" | enhanced | duration ("forever") + condition ("whenever/wherever") |
| "run for weeks on a single charge" / "months in standby" | enhanced | speed/duration |
| "easy to repair and customize" | base | none |
| "read books from any digital bookstore, as long as they are in EPUB format" | enhanced | condition (EPUB) |
| "No internet connection, accounts, or cloud services are required" | enhanced | condition (no cloud) |
| "Brings Books Back to Life with a Dual-Screen Design" (press headline, not Diptyx copy) | — | press framing |
- count: ~5 base / 4 enhanced (small surface — solo-dev campaign, copy is
  spare).

## Features  (specs / attributes — NOT claims)
- Two 5.83" mono E Ink panels, 640×480 each (~137 ppi); combined 210 cm² open
- Book-style center hinge; folds shut paperback-size (120×150×14 mm / 4.7×5.9×0.6 in); 300 g / 10.5 oz
- ESP32-S3-N16R8, 240 MHz, 16 MB flash, 8 MB RAM
- Wi-Fi + BLE physically present, **disabled in firmware** (security/no-cloud-by-design feature)
- 2 GB user-replaceable microSD for book storage
- Dual 1500 mAh Li-Po batteries; weeks of active use / months in deep sleep
- USB-C for charging + EPUB sideload
- Navigation button array (no touchscreen)
- Custom firmware on ESP32-S3 (developed in VS Code, builds on prior open-source EPUB work)
- Enclosure designed in FreeCAD
- KiCad schematics + PCB layout
- **MIT license** on firmware, full open-source release of enclosure + schematics + firmware after campaign
- DRM-free EPUB only — no PDF, no Kindle, no proprietary formats
- No accounts, no cloud, no app store

## Mechanism / UM
- mechanism(s) — how/why it works:
  - **Book metaphor as form-factor mechanism** — two facing screens on a center
    hinge replicate the open-paperback reading surface, eliminating the
    "swipe a slab" interaction and giving 2-page parallel display. Hinge also
    serves as the case (no separate folio needed).
  - **Owner-operator hardware mechanism** — ESP32-S3 + open KiCad + FreeCAD +
    MIT firmware means the device is forkable; Wi-Fi disabled in firmware =
    no remote-disable / no telemetry path.
  - **EPUB-only / no-DRM mechanism** — single-format, sideload-only delivery
    eliminates store dependency.
- problem-mechanism (causal story, shared across the open-source / right-to-repair
  community, NOT unique to Diptyx): "Mainstream e-readers lock you into one
  screen, one store, one way to read… your Kindle/Kobo can brick, can be
  remote-wiped, can lose access to books you paid for, and you can't fix it."
  This is the canonical anti-platform-lock-in story and is shared with Pine64,
  Framework Laptop, /e/OS, Mudita, and the broader right-to-repair movement.
- UM: **Product UM** — dual-panel book-fold form factor positioned as the
  *correct* way to display a book (mechanism = facing-pages metaphor). This is
  novel in the e-ink market — only Readmoo mooInk V approaches it commercially
  (single bending screen, not dual-panel) and no Kindle/Kobo/Boox uses it. The
  open-source layer on top is **shared-mechanism** within the right-to-repair
  niche (Pine64, Framework, etc.), not a unique mechanism — open source by
  itself is **table stakes** inside this niche, not a differentiator. The UM
  that actually slots Diptyx into a unique position is the **book-fold form
  factor × open-source bundle** — neither alone is unique, but the combination
  is.

## Marketing framing
- angles:
  - **Status / belonging — desire pole — driver-level (T3)**: "be the kind of
    person who owns their device and their books" — identity angle, points at
    the maker/owner self-image. (diptyx.dev hero, Yanko Design "tinkerers,
    readers, and anyone who wants to truly own.")
  - **Status / belonging — pain pole — category-level (T2)**: "stop being
    locked-in by Amazon" — competitor-disqualification angle, runs through
    Yanko Design + NotebookCheck press framing. Not stated as harshly in
    Diptyx's own copy as in press; Diptyx's own voice is softer (philosophy)
    and the press is sharper (anti-Kindle).
  - **Nostalgia / aesthetic — desire pole — T1**: "fits in your purse like an
    old favorite novel" / "brings books back to life" — sensory/identity angle
    on the book-shape form factor. Reproduction-adjacent (intimacy with reading
    object) more than status.
- awareness level(s) targeted: **Solution-aware → Product-aware.** Buyer
  already knows DRM-free / open-source e-readers exist (or wants one to exist);
  Diptyx introduces *this* specific product. Copy doesn't educate problem
  (assumes the reader already hates Kindle lock-in); does educate product
  (book-fold form factor is novel and needs explanation).
- hooks (from press / project copy, not ads — Diptyx runs no paid media):
  - "Open-source hardware, dual-screen e-book reader folds like a paper book"
    (CNX Software / @cnxsoft tweet)
  - "Opens Like a Real Book with No Amazon Lock-In" (Yanko Design headline)
  - "Brings Books Back to Life with a Dual-Screen Design" (TechEBlog)
  - "Own your device, own your books" (own hero)

## Offers / value models
- pricing: $230 single tier, +$12 ROW shipping (US free). One-time, no
  subscription, no bundle, no upsell.
- bundle: none.
- discount: none (no early-bird tier reported).
- guarantee: none stated (typical for Crowd Supply hardware campaigns — risk
  borne by backer).
- subscription: none — actively anti-subscription as a positioning point.

## Trust signals
- Crowd Supply curation (Crowd Supply vets every campaign — itself a trust
  signal in the open-hardware buyer's mental model; comparable to a Mozilla
  Foundation endorsement for that audience).
- MIT license commitment with public GitHub repo (MartijndenHoed/Diptyx) — code
  is verifiable.
- Hackaday.io project page (#204323) — multi-month build log, peer-readable.
- Press coverage: CNX Software, Liliputing, Hackster, Electronics-Lab,
  Linuxiac, NotebookCheck, Good e-Reader, Yanko Design, TechEBlog,
  MobileRead Forums. Heavy maker/open-source press, near-zero mainstream/lifestyle
  press. That distribution itself signals niche fit.
- Origin story (creator's Kobo Clara BW died, decided to build his own) —
  authenticity / "scratch your own itch" trust signal.
- extraordinary identifier: **no.** No named celebrity, no major mainstream
  press logo (Vogue / NYT / Forbes — not even WIRED). Trust pool is purely
  open-source / maker-press credibility. For this niche, that *is* the right
  trust stack — but it would not transfer to a general consumer market.

## Sophistication
- market sophistication stage this competitor plays at: **Stage 3 — Product UM
  emergence in the open-source / DIY e-reader cell.** Within commercial
  e-readers the market is Stage 4–5 (heavily saturated on UM and Feature UM),
  but Diptyx isn't competing in that market — it's competing in the
  open-source e-reader micro-market where prior entries are sparse (PineNote,
  Open Book by joeycastillo, Inkplate-based DIY builds, MNT Reform with e-ink
  mod). Inside *that* market, Diptyx introduces a Product UM (dual-panel
  book-fold form factor) that prior open-source efforts didn't have — they
  were mostly single-panel slabs. Open-source itself is table stakes here, not
  a UM. So: Stage 3 inside the niche, Stage 1 of the foldable-e-ink-open-source
  cell specifically.
- revenue/scale_est: **Reported $64,440 raised at Dec 12, 2025** (CNX Software
  / Liliputing reporting window — a few days into the campaign). Goal $27,000,
  so already ~239% funded at that snapshot. **Mid-flight figure — final raise
  not captured.** Conservative final-raise band: **$80k–$200k**, basis: prior
  Crowd Supply open-hardware projects with similar fundraising velocity
  (Modos Paper Dev Kit closed at $197k from $110k goal; the comparable
  Zerowriter Ink earlier campaign closed in the $100k+ band). Units at $230
  pledge: ~$64k / $230 ≈ 280 units at snapshot; final unit estimate 350–870.
  Confidence: **low** (mid-flight + solo-dev campaign + no historical data
  on this creator).
- social_proof_volume: **32+ backers in the first few hours** (Crowd Supply
  press); ~280 implied backers at the $64k snapshot. No reviews yet (device
  doesn't ship until May 2026). MobileRead Forums thread + Hackaday.io
  project page provide qualitative discussion volume. GitHub repo exists
  but stars/forks not captured here.
- distribution_channels: **Crowd Supply only during campaign.** Post-campaign
  unclear — solo dev, no e-commerce site, no Amazon plan stated; long-tail
  channel is self-manufacture from GitHub schematics.

## Meta Ad Library
- page-ID resolution: **not run.** The orchestrator-provided
  `node runs/eink-tablets/scripts/adlib-one.js diptyx "Diptyx"` was blocked by
  the sandbox in this session (Bash permission denial on the script). No
  `adlibrary/diptyx_adv.txt` artifact exists in the directory either, so this
  has not been resolved in a prior session.
- on Meta: **almost certainly no** — high-confidence prior. Diptyx is a solo-
  developer Crowd Supply campaign with a $27k goal and ~$64k raised; the
  buyer pool is open-source / maker press readers reached via Hackaday + CNX
  + Linuxiac + Mastodon, not Meta. Solo indie hardware developers funded at
  this scale virtually never run Meta DR. **Absence of ads is the expected
  outcome and itself the data point**: this brand reaches its niche through
  earned tech-press + community channels, not paid social — which is consistent
  with the open-source / anti-platform positioning (running Meta ads to sell
  an anti-corporate-lock-in device would be self-undermining).
- active ad count (genuine, approx): unverified; expected zero.
- ad formats / sample hooks / angles / claims: N/A.
- artifact: **N/A** — script blocked in this session.

## Reviews / VOC quick-read
- review/rating volume + rough sentiment: **No end-user reviews yet** (device
  ships May 2026). Press sentiment overwhelmingly positive in the open-source
  /maker corner: CNX, Liliputing, Hackster, Electronics-Lab, Yanko Design,
  Linuxiac all positive; tone is "finally" + "refreshing."
- brand loyalty signal: Crowd Supply pledge velocity (~$64k against $27k goal
  within days) + active MobileRead Forums thread + Hackaday project followers
  indicates real demand inside the open-source / EPUB-hoarder niche. Loyalty
  isn't to the *brand* (there is no brand history) — it's to the *thesis*
  (open-source e-reader, book-fold form factor).
- hidden use cases / notable likes & dislikes:
  - Liked: book-shape form factor as more than novelty (2-page parallel
    display, no case needed, fits a pocket/purse).
  - Liked: Wi-Fi disabled in firmware — read as a *feature* (no telemetry, no
    remote-brick path) by this audience, not a limitation.
  - Liked: MIT license + KiCad + FreeCAD — full forkability.
  - Disliked / questioned (forum + Hackaday discussion): no PDF support, no
    touchscreen, 137 ppi is below modern e-reader baseline (~300 ppi on
    Kindle/Kobo), small storage (2 GB microSD), display refresh / partial-update
    behavior on ESP32 vs purpose-built e-reader SoC, hardware-button-only
    navigation, single firmware author = bus-factor risk despite MIT license.
  - Hidden use case (latent): **customizable open device** — diptyx.dev openly
    invites users to add RSS reader / custom games / other software on top.
    Creator framing positions Diptyx not just as a reader but as a hackable
    e-ink computer platform. This is the same hidden-transformation pattern
    that turned Inkplate boards into note-takers, dashboards, weather displays,
    etc.

## Evolution Anchor

- **Launch year:** 2025 (Crowd Supply campaign live Dec 2025; press wave
  Dec 12–14 2025; deliveries promised May 2026).

- **Main differentiation claim AT LAUNCH (verbatim):** "Own your device, own
  your books." (diptyx.dev hero) — paired with the form-factor claim "Diptyx
  E-Reader… its unique dual-screen design allows it to close like a book,
  protecting the screens without requiring a case" (CNX Software / Crowd
  Supply lead). The two claims together = ownership + book-metaphor form
  factor.

- **What pre-existing claims competed with:** **NOT competing with commercial
  e-ink tablets at all.** Diptyx does not enter the reMarkable / Boox /
  Kindle Scribe / Daylight / Supernote conversation — wrong price point,
  wrong size, no notes, no stylus, no AI, no PDF, no Android. It competes
  with:
  - **Closed Amazon / Kobo / Pocketbook walled-garden e-readers** for the
    open-source / digital-ownership crowd's wallet (Kindle Paperwhite, Kobo
    Clara BW, etc. — the creator's own Kobo Clara BW dying is the explicit
    origin story).
  - **Prior open-source / DIY e-reader projects** as a category alternative:
    Open Book (joeycastillo), Inkplate-based DIY builds, PineNote (Pine64),
    custom Calibre-server + dumb-reader setups. Diptyx beats these on
    finishedness (an actual product you can pledge for, not a parts list).
  - It implicitly competes with **Mudita Kompakt / Light Phone / Brick** for
    the "I want to own a deliberately limited device" wallet — same identity
    driver (refusal of platform capture), different transformation (reading
    vs. minimal phone).

- **New claim / mechanism / feature introduced:**
  - **Form-factor mechanism: dual-panel book-fold as a DESIGN CHOICE, not
    just a foldable form factor.** The two-facing-screens layout deliberately
    replicates open-paperback reading — the hinge is the case, the layout
    is the metaphor. This is different from Bluegen OKPad (commercial 360°
    convertible — hinge is for mode-switching, not metaphor) and from
    Readmoo mooInk V (commercial single bending screen — flex panel as
    spec, not metaphor). The book metaphor is the *meaning* of the hinge in
    Diptyx; in OKPad and mooInk V the hinge has no narrative.
  - **Open-source as a verifiable commitment (MIT firmware + KiCad + FreeCAD
    on GitHub), not as marketing language.** Diptyx's open-source claim is
    falsifiable post-campaign — most "open" products aren't.
  - **No-cloud / Wi-Fi-disabled-in-firmware as a default-on privacy feature**
    rather than a missing feature.

- **Where this slots in the "foldable e-ink evolution" thesis:**

  | Brand | Market layer | Hinge meaning | Open-source? | Price | Status |
  |---|---|---|---|---|---|
  | Bluegen OKPad (2024 KS) | Commercial hybrid (IPS + e-ink) | Mode-switching (laptop/tent/tablet) | No | $199–$399 | Shipping (delays) |
  | Readmoo mooInk V (2025) | Commercial color e-reader (Taiwan) | Flex-screen spec | No | ~$615 | Shipped TW |
  | **Diptyx E-Reader (2025 CS)** | **Open-source / maker e-reader** | **Book metaphor (facing pages)** | **Yes (MIT)** | **$230** | **Campaigning** |

  Diptyx represents the **open-source / maker pole** of the foldable e-ink
  experimentation. The three together bracket the design space:
  - OKPad explores foldable-as-convertible-laptop (productivity bet).
  - mooInk V explores foldable-as-flexible-display (consumer-electronics bet).
  - Diptyx explores foldable-as-book-metaphor (literary/identity bet).
  None of them have settled the foldable thesis yet — three different brands
  are each making a different bet on *what the hinge is for*. Diptyx's bet
  is the most narratively coherent (form follows reading metaphor) and the
  least commercially scalable (open-source / niche / solo-dev).

- **Open-source as a positioning UM — real differentiator or table stakes
  in this niche?** **Table stakes inside the open-source / Crowd Supply
  buyer pool.** Every credible competitor on Crowd Supply / in the open-
  hardware e-reader cell ships open schematics or licenses firmware
  permissively — PineNote, Open Book, Modos Paper Dev Kit, MNT Reform-with-
  e-ink, Inkplate builds. If Diptyx shipped *closed*, it would be
  disqualified, not differentiated. So inside this niche, open-source is
  baseline. **Where it becomes a UM is the bundle**: open-source × book-fold
  form factor × $230 finished product (not a parts list) × MIT-licensed
  firmware is the combination that nobody else has. The book-fold form
  factor carries the UM weight; open source is the credibility-pass that
  lets the buyer trust the rest.

  Cross-market read: in the **commercial** e-reader market (Kindle, Kobo,
  Boox, reMarkable), open-source is *not* table stakes — it is a strong
  Product UM that almost nobody plays. Boox runs Android with closed
  customizations; Kindle/Kobo are fully closed. So if a Diptyx-style device
  ever bridged into the commercial market, "fully open-source e-reader"
  would become a Product UM in that arena. Inside its own arena, it's the
  ticket of entry.

## Notes / gaps

- **Crowd Supply campaign page returned 403 to WebFetch.** All campaign-side
  numbers ($230 pledge, $27k goal, $64,440 raised at Dec 12) are triangulated
  from CNX Software, NotebookCheck, Yanko Design, Liliputing, Hackster,
  Electronics-Lab, Linuxiac — all consistent. **Final raise still unknown**
  as campaign was mid-flight at last reporting; flagged for refresh before
  citing a final number.
- **Meta Ad Library check not run** — Bash blocked in this session for the
  adlib-one.js script. No prior `adlibrary/diptyx*.txt` artifact exists.
  Strong prior that result would be zero (solo-dev open-source Crowd Supply
  campaign reaches its buyer via earned tech-press + Hackaday + Mastodon,
  not Meta DR). Absence of ads here is **expected and itself a positioning
  signal** — running Meta to sell an anti-corporate-lock-in device would be
  off-brand.
- **No end-user reviews exist yet.** Ships May 2026. All sentiment is press +
  forum pre-orders.
- **Solo-dev / bus-factor risk** is the largest delivery risk. Crowd Supply
  curation reduces but does not eliminate it. MIT license + GitHub
  publication is the mitigation (community can fork).
- **No mention of Bigme / Boox / reMarkable in any Diptyx copy** — confirms
  Diptyx is not positioning against commercial e-ink tablets. Diptyx's
  comparator-set in its own words is Kindle / Kobo (closed) + prior
  open-source e-reader projects (incomplete). The orchestrator's "Diptyx is
  a different lane from Bluegen OKPad / commercial foldables" hypothesis is
  fully supported by the source data.
- **Hidden transformation latent in copy**: diptyx.dev openly invites users
  to extend the device into an RSS reader, custom games, etc. Diptyx is
  framed as a hackable e-ink computer platform with a book metaphor as the
  default app. If shipped, the relevant comparison may not be other
  e-readers at all but Inkplate / open-hardware e-ink dev boards — an
  adjacent market.
