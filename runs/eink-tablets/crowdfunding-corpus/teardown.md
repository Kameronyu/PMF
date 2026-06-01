# Crowdfunding Teardown — E-Ink Tablets & Writing Devices

compiled: 2026-05-24
campaigns covered: 12 with corpus (10 deep-dive + 2 underperformers) + 6 skim per roster
scope note: Skim campaigns (Bluegen OKPad, Freewrite Alpha, Bigme inkNote Color, Mudita Kompakt,
  Pomera DM250US, BLOOMIN8) do not have per-campaign corpus directories. Their figures are
  cited from the campaign roster and evolution-profile records where needed. Data quality flags
  are per-field throughout.

---

## Data quality and scope caveats (read first)

**Fetch limitations.** All Kickstarter pages returned HTTP 403 to WebFetch. All Crowd Supply
campaign pages returned HTTP 403. The Indiegogo pages returned 404 (Dasung) or a JS-gated SPA
(Freewrite Traveler, EeWrite E-Pad IGG phase). Playwright/crowdfund-fetch.js was used for
a subset of campaigns and raw .txt files exist in several raw/ subdirectories. Where raw
files exist they are used as primary source; where blocked, data is reconstructed from press
coverage, Kicktraq, and search aggregates.

**"not found"** appears throughout where a figure could not be confirmed from any accessible
source. No backer count or raise figure has been estimated or interpolated without explicit
labeling.

**Underperformer count.** The roster identifies Dasung Not-eReader 7.8" (IGG 2018) and
EeWrite E-Pad (KS + IGG 2019) as the two underperformers. Both are outside the strict
2022-onward scope but included because they are the only confirmed failure-pattern cases in
the dataset. The "what funded vs. capped/failed" comparison in Section D is directional
rather than statistically clean because all skim campaigns are 300%+ funded and neither
underperformer was a clean "capped" case — they funded and then failed to deliver.

**Reinkstone R1 reclassification.** Reinkstone R1 ($1.02M, 2,424 backers) is listed as
"Shipped" on Kickstarter but is treated here as a failure case. First batch shipped December
2022 (14 months late); last creator update August 2023; 1,318 comment-thread refund demands
with no creator response; company has since removed all R1 product pages and pivoted to
e-ink phone cases. Some units were delivered; the majority of 2,424 backers appear unfulfilled.
It funded enormous and then abandoned its backers. Treated accordingly in Section D.

---

## Section A — Campaign table

| Campaign | Product | Led with (classified) | Spec role | Platform | Raised / goal / % | Backers / avg pledge | Tiers (early-bird to regular) | Day-one spike? | Shipped? |
|---|---|---|---|---|---|---|---|---|---|
| Zerowriter Fold | Clamshell e-ink word processor, 6" mono, mechanical keyboard | transformation:distraction-free writing | Feature: weeks battery, hot-swap keyboard, open-source | KS | $147,963 CAD / $50,616 CAD / 292% (day 5; campaign live) | 558 / ~$265 USD | First Wave CA$329 (sold out, 500 cap) → Standard CA$355 | YES — funded in 41 min; 558 backers by day 5 | Not yet (est. Mar 2027) |
| Zerowriter Ink | E-paper word processor, 5.2" mono, mechanical keyboard | transformation:distraction-free writing | Feature: open-source, weeks battery, no subscription | CS | $143,023 / $30,000 / 476% | 570 / ~$251 | Single tier: $199 (campaign) → $279 (post-campaign store) | Moderate — 53% of goal in 2 days | Shipped (Oct 2025, ~8 months late) |
| Diptyx | Book-fold dual-screen e-reader, 2x 5.83" mono, open-source | form-factor | Spec: open-source, no DRM, ESP32 | CS | $86,610 / $27,000 / 320% | 240 / $361 | Single tier: $230 flat | YES — 238% funded on launch day | Not yet (est. May 2026 for backers) |
| Viwoods AiPaper | 10.65" mono e-ink AI tablet, Carta 1300 flexible | spec/utility | Feature: AI, 4.5mm thin, 300 PPI, local privacy | KS | ~$275k (HK$2.15M) / ~$5k / 5,498% | 542 / ~$507 | Early-bird floor ~$378 → regular ~$490 (10.65") | YES — 500% funded in 30 min; $75,240 day 1 | Shipped (Nov 2024, ~4 weeks late) |
| iFlytek AINOTE 2 | 10.65" mono e-ink AI tablet, 4.2mm, Guinness record | spec/utility | Feature: "World's First GPT-5-Powered Paper Tablet," thinnest Guinness-certified | KS | ~$1.13M (HK$8.83M) / ~$9k / ~12,360% | 1,691 / ~$670 | Super Early Bird ~$480-$519 → retail ~$599-$649 | YES — goal in 5 min | Shipped on time (Nov 2025) |
| Bigme Galy | 8" color e-ink tablet, Gallery 3 panel, Android | spec/utility | Feature: "World's First Color E Ink Gallery 3 Tablet" | KS | ~$421k (HK$3.29M) / ~$6.4k / 6,576% | 696 / ~$605 | Super Early Bird $489 → Early Bird $539 → Standard $599 | YES — goal hit within 24h | Shipped (late; batch 3 shipped Sep 2023, 7+ months post-close) |
| Reinkstone R1 | 10.1" color DES e-paper tablet, Android 11 | spec/utility | Feature: "World's First True Color DES E-Paper," 140-color PPI | KS | $1,019,677 / $100,000 / 1,020% | 2,424 / $421 | Super Early Bird $329 → Early Bird $379 → KS Special $429 → KS Exclusive $479 | YES — 100% funded in 15 min; $500k+ in 12h | FAILED: first batch Dec 2022 (14 months late); company went dark Aug 2023; 1,318 refund-demand comments; company pivoted to phone cases |
| Freewrite Smart Typewriter (Hemingwrite) | Full-size e-ink mechanical typewriter, writing only | transformation:distraction-free writing | Feature: cloud sync, instant-on, mechanical keyboard | KS | $342,471 / $250,000 / 137% | 1,096 / $312 | Super Early Bird $349 → Early Bird $369 → Standard $399 | YES — $112,526 day 1 (33% of total); goal hit in 36h | Shipped (2016, ~12 months late) |
| Freewrite Traveler | Foldable clamshell e-ink writing device, 6" mono, scissor keyboard | transformation:distraction-free writing | Feature: foldable, 30-hour battery, portable | IGG | ~$600k+ IGG / $50k / 1,200%+ (IGG portion); ~$745k combined | not found / not found | Super Early Bird $269 (sold out) → Standard $309 → General $329 | YES — goal hit in 28 min; $300k+ in week 1 | Shipped (Oct-Nov 2020, ~2 years late from Jun 2019 estimate) |
| Modos Paper Dev Kit | Open-hardware e-paper monitor dev kit, 6" and 13", 75 Hz | spec/utility | Spec: 75 Hz refresh, open hardware, FPGA, HDMI | CS | $197,588 / $110,000 / 179% | 355 / ~$556 | 6" kit $199 / 13" kit $599 (no early-bird discount) | Not strong — funded on Sep 18 (day ~9 of campaign) | Not yet (shipping commenced ~early 2026) |

**Skim campaigns (figures from roster and evolution records, no per-corpus deep-dive):**

| Campaign | Product | Led with (classified) | Platform | Raised / goal / % | Backers | Shipped? |
|---|---|---|---|---|---|---|
| Bluegen OKPad | 8.9" LCD + 7.8" E Ink hybrid, 360-degree hinge | form-factor | KS | ~$119k (HK$931,695) / HK$39.5k / 2,359% | 436 | Shipped (delays reported) |
| Freewrite Alpha | Compact e-ink word processor, chiclet keyboard | transformation:distraction-free writing | IGG | $451,810 / $25,000 / ~1,807% | 1,275 | Shipped |
| Bigme inkNote Color | 10.3" Kaleido color e-ink tablet, cameras, Android | spec/utility | KS | ~$624k (HK$4.87M) / HK$785k / 620% | 1,187 | Shipped |
| Mudita Kompakt | 4.3" mono e-ink minimalist phone | identity | KS / IGG | ~$503k (EUR 466,191) / EUR 150k / 311% | 1,389 | Shipping (2025) |
| Pomera DM250US | Reflective LCD distraction-free typewriter (e-ink adjacent) | transformation:distraction-free writing | IGG | $85,333 / $10,000 / 853% | not found | Shipped Mar 2025 |
| BLOOMIN8 EinkCanvas | Full-color e-ink art frame, Spectra 6 | spec/utility | KS | $1,530,000 / not found / 7,991% | 3,000+ | Shipping |

**Underperformers:**

| Campaign | Product | Led with (classified) | Platform | Raised / goal / % | Backers | Outcome |
|---|---|---|---|---|---|---|
| Dasung Not-eReader 7.8" | 7.8" e-ink Android tablet + monitor | spec/utility | IGG | ~$252k CAD / not found / not found | "hundreds" (exact not found) | FAILED: fewer than 60 units delivered; company went dark; backers revolting in comments; campaign page since deleted |
| EeWrite E-Pad (Wisky) | 10.3" e-ink Android tablet, 4G, Wacom stylus | spec/utility | KS + IGG | ~$408k KS / $10k / 4,084%; ~$800k+ combined | 893 (KS) | FAILED QUALITY: shipped broken promises — "snail's pace" navigation, 2-day battery vs. promised week-plus, "basically a doorstop" prototype; creator went back to drawing board |

**"Led with" breakdown:**
- transformation:distraction-free writing: Zerowriter Fold, Zerowriter Ink, Freewrite Smart Typewriter, Freewrite Traveler, Freewrite Alpha, Pomera DM250US (6 campaigns)
- spec/utility: Viwoods AiPaper, iFlytek AINOTE 2, Bigme Galy, Reinkstone R1, Modos Paper Dev Kit, Bigme inkNote Color, Dasung Not-eReader 7.8", EeWrite E-Pad, BLOOMIN8 (9 campaigns)
- form-factor: Diptyx, Bluegen OKPad (2 campaigns)
- identity: Mudita Kompakt (1 campaign)

---

## Section B — Chronology notes (4 most relevant campaigns)

### Zerowriter Fold (KS, 2026 — live)

Pre-launch window: The creator ran a dedicated pre-launch page at zerowriter.ink/pages/zerowriter-fold
with "signing up holds your spot and your First Wave price, no payment required until the campaign
goes live." The Zerowriter Ink Crowd Supply backer list was seeded via a cross-promotional update
titled "More Orders Fulfilled Plus a Pre-Launch Announcement." Pre-launch window length is not
confirmed, but the sign-up mechanism appears to have been live for at least several weeks before
May 19, 2026 launch. No BackerKit pre-launch page and no launch agency involvement found.

Day 1: Goal ($50,616 CAD) hit in 41 minutes. By day 4-5: 558 backers, $147,963 CAD raised
(292% funded). The First Wave tier (CA$329, 500-unit cap) was almost certainly exhausted in
day 1 based on 558 total backers at day 5 against a 500-unit cap. No separate day-1 USD
total is calculable from available data, but the 41-minute funded milestone and rapid backer
accumulation place this in the top tier of day-1 spikes in the dataset.

Mid-campaign: Campaign still live at time of capture (May 24, 2026; 15 days remaining through
June 9). Kicktraq projected $750,295 CAD final based on day-5 pacing, but projection models are
unreliable at this stage. No mid-campaign second-wave data available.

Final 72h: Not yet available (campaign ends June 9, 2026).

Launch agency / creator partners: None identified. Creator's own description: "I have hundreds
of people I talk to... That is a very different way to build a business." Purely community-driven.
Press coverage was organic: PCWorld creator interview published on launch day (May 19); followed
by Notebookcheck, Hackster, Liliputing, Stuff SA, and Gadgective through May 21-22.

---

### Reinkstone R1 (KS, 2021 — funded huge, abandoned backers)

Pre-launch window: No dedicated pre-launch landing page recovered. The $329 Super Early Bird
tier (600-unit cap) and coordinated PR Newswire press release on launch day (June 22, 2021)
plus a pre-seeded Good e-Reader hands-on review (June 25, 3 days post-launch) suggest
pre-campaign press seeding rather than a mailing-list capture funnel.

Day 1: Goal ($100,000) funded in 15 minutes. "Over $600,000 CAD" raised within 24 hours
per Good e-Reader (June 22, 2021). Kicktraq shows $500k+ in 12 hours, $650k+ by day 7.
Day-1 raise is estimated at 50-60%+ of the $1.02M final total. The Super Early Bird tier
(600 units at $329, "Save 40%") sold out near-instantly, amplifying FOMO.

Mid-campaign: Day 7 at $650k (64% of final), 1,600 backers (66% of final). The remaining 23
days added only $370k and ~824 backers. Classic media-spike-then-flatline. A "8% cash-back"
stretch goal announced day 7 may have driven a small bump.

Final 72h: No specific data. Campaign ran 30 days (June 22 to July 22, 2021).

Launch agency: None identified. Parent company Wiwood had prior Kickstarter experience
(EeWrite E-Pad, though that was a different brand name). Relied on novelty (first color
DES e-paper tablet) + press seeding + low goal to engineer the spike.

Note on outcome: The campaign funded at 10x, shipped a partial first batch 14 months late,
posted its last update August 2023, and went completely dark. Reinkstone.com now sells only
e-ink phone cases. R1 product pages return 404.

---

### Freewrite Smart Typewriter / Hemingwrite (KS, 2014)

Pre-launch window: Creator Adam Leeb ran hemingwrite.com on a basic WordPress site with
MailChimp + Sumo email capture from mid-October 2014 through launch on December 10, 2014.
Accumulated 9,000+ email subscribers and ~125,000 site visits in approximately 8 weeks.
Competed in Engadget's Insert Coin hardware competition (October 2014), resulting in pre-launch
press coverage and an angel investor introduction. Coordinated media embargo with approximately
five journalists (TechCrunch, HuffPost, CNET, The Verge) for launch-day simultaneous coverage.
Self-managed; no launch agency.

Day 1: $112,526 raised from 312 backers (33% of total). Over $200,000 in 20 hours. Goal
($250,000) hit in ~36 hours. The Super Early Bird ($349, limited quantity) and Early Bird ($369)
tiers both sold out during the campaign.

Mid-campaign: The campaign raised $320,000 by day 29 of 44 (CES demo) and closed at $342,471.
Final 2 weeks added only $22,471 (~$1,600/day vs ~$5,600/day in mid-campaign). No strong
final-72h bump visible. CES demo on January 8, 2015 generated a press hit but did not cause
a visible second spike at the scale of launch.

Launch agency: None. The pre-launch investment was all creator-owned (email list, press
relationships, hardware competition entry). Campaign cost $0 in ad spend based on creator's
own account.

---

### Freewrite Traveler (IGG, 2018)

Pre-launch window: No dedicated pre-launch LP recovered from archives. The velocity (goal hit
in 28 minutes, $300,000+ in week 1) implies an existing audience: ~1,100 backers from the 2014
Hemingwrite KS, an established Freewrite owner base (product launched ~2016), and an active
mailing list. Creator worked with a full-service crowdfunding marketing agency ("generally known
as the premiere IGG agency" per Adam Leeb, name not published) that had a close relationship
with the Indiegogo team and secured contractual promotional commitments from IGG.

Day 1: Goal ($50,000) hit in 28 minutes. "Over $300,000 in one week" per E Ink Corp blog
(October 11, 2018). No precise day-1 dollar figure recovered from accessible sources.

Mid-campaign: Day 30 at $530,000+ (Adam Leeb's own projection was "$500k max" — the campaign
beat it in the first month). IGG campaign closed at ~$600,000+ (approximate). Post-campaign
IGG InDemand added ~$145,000+ to reach ~$745,000 combined.

Final 72h: No specific data. Campaign ran ~60 days (typical IGG duration).

Launch agency: IGG-specialist crowdfunding agency with contractual promotional arrangement with
Indiegogo directly — Indiegogo's "concrete" promotional commitments in exchange for this choice
over Kickstarter. Agency name withheld by creator.

Outcome note: Shipped October-November 2020, approximately two years after the June 2019
promised date. Multiple revised dates (June → August → Fall → November 2019 → Spring →
Fall 2020). Quality product once it arrived but the delay caused confirmed pre-order cancellations.

---

## Section C — Objection list (ranked by frequency)

All objection themes below trace to verbatim or near-verbatim quotes from corpus comment files
and press/forum sources. Themes marked with a source campaign and direct quote. Themes invented
from assumptions are not included.

| Rank | Objection theme | Campaigns where appeared | Verbatim representative quote | Campaign source |
|---|---|---|---|---|
| 1 | "Will you actually ship? / Fulfillment reliability" | 7 campaigns (Reinkstone R1, Dasung 7.8", EeWrite E-Pad, Freewrite Traveler, Zerowriter Ink, Bigme Galy, Freewrite Smart) | "This project is the reason why I will never back a project again.... At least be honest...." | Reinkstone R1 comments |
| 2 | "Why not buy a reMarkable / Boox / existing device?" | 4 campaigns (Diptyx, Freewrite Smart, Freewrite Traveler, EeWrite E-Pad) | "I'm not willing to drop $500 on an unknown commodity from an obscure Chinese company." (Dasung); "with devices like the Boox Tab Mini C and Boox Tab Ultra C in the market the Bigme Galy feels a bit lacking and outdated" | Dasung Not-eReader comments; Bigme Galy reviews |
| 3 | "Shipping delays / date slippage" | 6 campaigns (Freewrite Traveler, Freewrite Smart, EeWrite E-Pad, Bigme Galy, Zerowriter Ink, Reinkstone R1) | "The projected delivery date repeatedly shifted: June → August → Fall 2019 → November 2019 → Spring 2020." | Freewrite Traveler backer account |
| 4 | "Software maturity / firmware not ready" | 5 campaigns (EeWrite E-Pad, Bigme Galy, Viwoods AiPaper, iFlytek AINOTE 2, Freewrite Traveler) | "response times are so poor that basic functions like navigation, touch-typing or writing... move unreliably and at a snail's pace" | EeWrite E-Pad reviews |
| 5 | "Price vs. what you get" | 5 campaigns (Freewrite Smart, Dasung 7.8", Diptyx, EeWrite E-Pad, Zerowriter Fold) | "The thing weighs four pounds and costs $349 for a limited number of people now and ultimately $499 for everyone else." (Freewrite Smart); "I'd agree [the $230 price is not justified] vs. Boox Go 6" (Diptyx MobileRead) | Freewrite Smart press; Diptyx MobileRead forums |
| 6 | "AI features feel incomplete / cloud-dependent" | 3 campaigns (Viwoods AiPaper, iFlytek AINOTE 2, EeWrite E-Pad) | "My guess? Some investor wanted AI to be added to the pitch deck." / "Otherwise the AI functionality is pretty pointless." | Viwoods AiPaper reviews (splitbrain.org) |
| 7 | "Resolution / display quality inadequate" | 3 campaigns (Diptyx, Bigme Galy, EeWrite E-Pad) | "That looks like what someone who has never actually used an e-reader would imagine how one should be...Too small screens with still a large footprint. Fail." (Diptyx); "failed experiment in using Gallery 3 Screen tech" (Bigme Galy) | Diptyx MobileRead forums; Bigme Galy reviews |
| 8 | "Data privacy / China data compliance" | 2 campaigns (iFlytek AINOTE 2, Viwoods AiPaper) | "the company's terms require users to abide by export control laws adopted by China" / "I'm not sure how secure the data is when sent to Viwoods server" | iFlytek AINOTE 2 reviews; Viwoods AiPaper reviews |
| 9 | "Early-bird sold out before I saw it / tier confusion" | 2 campaigns (Reinkstone R1, Zerowriter Fold) | Not a direct verbatim quote from corpus; inferred from Reinkstone's Early Bird (1,300-unit cap, effectively exhausted) and Zerowriter Fold First Wave (500-unit cap, exhausted by day 1-2) | Reinkstone R1 tiers; Zerowriter Fold tiers |
| 10 | "Hinge / fold durability" | 1 campaign (Zerowriter Fold — proxy; not confirmed in KS comments) | No verbatim KS comment available. Gadgective clarified: "the Zerowriter Fold is simply a clamshell device and has a 6-inch e-paper display that does not fold" (i.e., only the enclosure hinges, not the display). Hinge concern is a predicted objection, not a confirmed verbatim one. | Gadgective press (not a backer comment) |

Notes:
- Objection #10 (hinge durability) is flagged as predicted, not confirmed verbatim from backer
  comments. Including it because it is expected for any foldable/clamshell device.
- Objection #9 (tier confusion / early-bird FOMO) is inferred from tier data, not a verbatim
  complaint quote. All others are confirmed verbatim or near-verbatim.
- The Reinkstone R1 refund thread (1,318 comments, all negative) is the most extreme data point
  in the dataset. The top-ranked objection (fulfillment reliability) is heavily weighted by this
  single catastrophic case.

---

## Section D — What the funded ones did that the capped/failed ones didn't

This is the section that matters for planning. Comparators: 10 funded campaigns (including
Reinkstone R1 as the "funded huge and then failed backers" cautionary case) vs. 2 underperformers
(Dasung Not-eReader 7.8", EeWrite E-Pad). Skim campaigns are used as supporting reference
where they add a data point. "Directional" label applies where sample is thin.

---

### 1. Led-with classification: transformation beats spec for durable funding

The writing-device campaigns that built lasting communities (Freewrite brand, Zerowriter) all
led with transformation: "distraction-free writing," "write anywhere," "write without being pulled
away." The spec-first campaigns (Reinkstone, Bigme, Dasung, EeWrite) led with "World's First
[panel]" or "10-core processor with 4G LTE." They raised money at similar or higher raw totals
during the campaign but then hit the wall: the spec claim decays in 12 months when a better
panel ships, and the buyers who came in for the spec novelty do not form a community that
sustains the brand. Reinkstone $1M funded, company now sells phone cases. EeWrite $408k funded,
shipped a "doorstop." Dasung $252k CAD funded, fewer than 60 units delivered.

The funded writing-device campaigns launched campaigns 2 through N off the back of their first
community. Freewrite ran the Hemingwrite (2014), the Traveler (2018), the Alpha (2022), the
Freewrite Smart Typewriter (ongoing retail). Each one restarted on the prior backer list. The
spec-first OEM campaigns (Bigme, Reinkstone) have no cross-product cohesion — each SKU is a
fresh "World's First" claim with no accumulated audience. When the spec claim decays, the
audience does not carry forward.

Exception and nuance: iFlytek AINOTE 2 ($1.13M) led with spec ("World's First GPT-5-Powered
Paper Tablet") and shipped on time. The difference is institutional credibility: iFlytek is a
$2.9B-revenue public company with a Guinness World Record and paid Unbox Therapy as a
trust signal. The spec claim worked because it was backed by extraordinary identifiers a smaller
OEM cannot replicate. A new entrant leading with spec without that institutional backing is in
the Reinkstone / Dasung risk bucket.

---

### 2. Pre-launch window and mailing list

Every high-performing campaign had a pre-launch list before launch day. The correlation is
direct:

- Freewrite Smart Typewriter: 9,000+ email subscribers, ~125,000 site visits in 8 weeks
  before launch. Coordinated press embargo with 5 journalists. Goal hit in 36 hours.
- Freewrite Traveler: existing Freewrite owner base (~1,100 prior backers, retail customers),
  IGG-specialist agency with contractual IGG promotional support. Goal hit in 28 minutes.
- Zerowriter Fold: built off Zerowriter Ink's 570 backers plus a cross-promoted pre-launch
  announcement to Ink backers. Creator's own pre-launch LP at zerowriter.ink/pages/zerowriter-fold
  with "hold your First Wave price" CTA. Goal ($50,616 CAD) hit in 41 minutes.
- Viwoods AiPaper: dedicated pre-launch.viwoods.com page with "register to be notified" CTA,
  at least 5 weeks pre-launch. 500% funded in 30 minutes.
- iFlytek AINOTE 2: higizmos.com reservation page for email capture before launch, plus
  Good e-Reader pre-launch press article 1 month before launch. Goal ($8,600 USD equivalent)
  hit in 5 minutes.

Dasung and EeWrite had no confirmed pre-launch list or email funnel. Their day-1 spikes
relied purely on press seeding and product novelty. When production problems hit and
communication dried up, there was no community to manage.

The failure-safe signal from the data: campaigns that had a pre-campaign list hit their goals
in minutes. Campaigns that lacked one (Freewrite Smart's $250k goal hit in 36 hours) still
succeeded, but by design — the Freewrite Smart team spent 8 weeks explicitly building the list
before launch. The lesson is not "you need a large list" but "you need some evidence of organic
demand before you launch."

---

### 3. Tier structure: early-bird discount gap and scarcity

The campaigns with the strongest day-1 spikes share a consistent pattern: a first tier with
a hard unit cap and a meaningful discount, paired with a price step-up that creates FOMO.

- Reinkstone R1: Super Early Bird $329 (600-unit cap, "Save 40%") → Early Bird $379 →
  KS Special $429. The $220 gap between Super Early Bird and implied retail ($549) was the
  largest absolute dollar discount in the dataset. The cap sold out near-instantly.
- Freewrite Traveler: Super Early Bird $269 (sold out quickly) → Standard $329. Claimed
  "45% cheaper than retail" in campaign copy. The $269 tier selling out drove urgency for
  the $309 and $329 tiers.
- Zerowriter Fold: First Wave CA$329 (~$238 USD, "save $90 USD off retail") capped at 500 units.
  Already exhausted by day 1-2. Standard tier stepped up to CA$355 (~$257 USD).
- Diptyx: single $230 tier, no early-bird discount. Funded 238% on launch day but the
  final raise ($86,610) was lower than comparably-positioned campaigns. The absence of a
  scarcity tier may have left backer urgency on the table.
- Modos Paper Dev Kit: no early-bird discount, two flat-price SKUs. Took until day 9 to
  reach goal — no spike, steady accumulation.

The pattern: a capped first tier with a 25-40% discount gap versus retail, paired with
a meaningful absolute dollar savings ($50-$220), drives the day-1 spike that makes the
campaign look funded and creates social proof for mid-campaign pledgers. Campaigns without
scarcity tiers rely entirely on ongoing interest rather than urgency.

The caution from Reinkstone: the Super Early Bird spike (600 units at $329 sold in minutes)
also concentrated backer expectations and compressed the implied timeline. When production
problems hit, the buyers who paid the most (per percentage savings) were also the most
vocally disappointed.

---

### 4. Day-one spike and creator/partner drivers

A day-1 spike above 100% of goal is the single strongest predictor of a campaign reaching
3x+ goal across this dataset. Every campaign that hit goal within 24 hours exceeded 300%
final funding. None of the two underperformers had confirmed day-1 spikes on record (Dasung
and EeWrite are pre-2021; day-1 data not recovered, but the absence of any "funded in X
minutes" milestone press coverage is itself a signal).

Creator partners and press embargoes accelerated the spike:
- Bigme Galy: Good e-Reader co-brand + parallel store pre-order. Good e-Reader article 3 days
  before KS launch seeded the audience.
- iFlytek AINOTE 2: paid Unbox Therapy partnership (220 active Meta ads); Good e-Reader
  pre-launch article 1 month out; institutional credibility.
- Freewrite Smart: coordinated TechCrunch + HuffPost + CNET + Engadget embargo, all publishing
  on launch day.
- Zerowriter Fold: PCWorld creator interview published on launch day (organic, not paid);
  Liliputing, Notebookcheck, Hackster all published within 3 days.

The Freewrite Alpha ($451,810, 1,275 backers) shows what happens when transformation
positioning and a brand repeat combine: same Astrohaus brand as Freewrite Smart and Traveler,
same "distraction-free writing" transformation, $25k goal, $451k final. The brand did the work
of the pre-launch list.

---

### 5. Hero copy: vague vs. concrete buyer outcome

The transformation-led campaigns use concrete, single-sentence buyer outcomes in their hero
copy. The spec-led campaigns front-load feature lists.

Transformation-led hero copy:
- Zerowriter Fold: "Write anywhere. Distraction free." (4 words + 2 words)
- Freewrite Smart: "A Distraction Free Digital Typewriter" (tagline) — with "What the Kindle
  did for reading, we want to do for writing" as the founder's framing
- Freewrite Traveler: "Set your story free, whenever and wherever inspiration strikes"
- Diptyx: "Own your device, own your books." (5 words + 4 words)

Spec-led hero copy (verbatim):
- Reinkstone R1: "Reinkstone R1, The Ultimate True Color DES E-Paper Tablet. The most
  paper-like experience for reading and writing. Ultra-long battery life. Powered by Android 11."
- iFlytek AINOTE 2: "AINOTE 2: The World's First GPT-5-Powered Paper Tablet" + "Why juggle
  three devices when one can give you more?"
- Bigme Galy: "World's First Color E Ink Gallery 3 Tablet"
- EeWrite E-Pad: "E-PAD, The E-Ink Android Tablet. The World's First E-Ink Android Tablet
  With 4G Connectivity."

The spec-led copy performs at launch (it feeds the "world's first" coverage cycle in the press)
but does not create the ongoing community coherence that sustains a brand across multiple
products. None of the spec-first brands in this dataset ran a successful follow-on campaign
from the same community. All of the transformation-first brands did.

The exception: iFlytek. "World's First GPT-5-Powered Paper Tablet" worked because GPT-5 is a
brand-borrowed specificity (not just a generic spec claim), Guinness certification validated
the hardware record independently, and iFlytek had institutional distribution to ensure the
device shipped. The spec claim was backstopped by extraordinary trust signals the campaign
copy alone cannot create.

---

### 6. Risks/FAQ candor: handled objections head-on vs. ignored them

The successful campaigns all addressed the most predictable objections in the campaign itself,
either in the Risks & Challenges section or the FAQ. This matters because backer confidence
in delivery is the primary barrier in a hardware campaign.

- Zerowriter Fold: Creator Adam Wilk explicitly acknowledged the Ink campaign ran "about a
  year longer to finish than I had expected" in a published interview on launch day. Pre-launch
  LP acknowledged tariff costs for US and EU buyers. The FAQ addresses battery range ambiguity
  directly: "depends on writing pace, thinking time, screen refresh settings, and brightness."
- Modos Paper Dev Kit: Risks section (verbatim, accessible from raw file): acknowledged
  supply-chain risks explicitly, promised transparent updates, cited NLnet/EU funding as
  partial third-party validation of project legitimacy.
- Freewrite Smart: Creator Adam Leeb's blog series (adamleeb.com) documented the full
  campaign journey including failures in the Engadget competition and production uncertainties.
  The Risks & Challenges section (verbatim not recovered due to KS 403) was noted in press
  as addressed.

The underperformer pattern: Dasung and EeWrite both had no Risks & Challenges text recovered,
no FAQ addressing likely objections, and both went silent when production problems hit. The
absence of proactive objection handling in campaign copy correlated with the absence of
transparent communication post-campaign.

Reinkstone's Risks & Challenges (verbatim): "With our years of experience with e-reading product
development, our team is very confident with our product quality, user experience, and shipping
schedule... If something goes wrong, we promise to keep our backers updated." The promise was
broken and the communication stopped at update #29 in August 2023. Candid risks language that
is then violated damages credibility more than no risks language at all.

---

### 7. Update cadence during campaign and post-campaign

The successful campaigns maintained update cadence through the campaign and after. Gaps in
updates are the single strongest leading indicator of the failure cases.

- Zerowriter Fold: 16 updates in first 5 days of a live campaign. Active response in comment
  section (Kate and Adam directly responding to backer questions).
- Freewrite Smart: 32 total updates through campaign lifecycle.
- Zerowriter Ink: 9+ updates through campaign + fulfillment. Creator acknowledged the Ink ran
  8 months late and communicated regularly about it.
- Viwoods AiPaper: 29 updates through campaign + fulfillment; only 6 public KS comments (meaning
  backers were communicating through backer channels, not the public comment section).

Failure patterns:
- Reinkstone R1: 29-31 updates through August 2023 (including some active months), then
  complete blackout. The 1,318 refund comments that followed contain multiple "last update was
  August 2023" references as explicit triggers of loss of trust.
- Dasung Not-eReader 7.8": "have not posted anything in over two months" per Good e-Reader
  (October 2019). Distributors had no prototypes. This 2-month silence was the primary
  trigger of the vaporware assessment and backer revolt.
- EeWrite E-Pad: "high percentage of people cancelling their pledges, because of the lack of
  transparency and the ever changing release date" per Good e-Reader. The date changes without
  explanation caused cancellations; later going silent on the drawing-board redesign caused
  the rest.

The update cadence pattern is clear across the full dataset: a campaign that posts 10+ updates
during the campaign, acknowledges problems explicitly, and stays in contact post-campaign
maintains backer goodwill even through significant delays (Freewrite Traveler: 2 years late,
product still respected; Zerowriter Ink: 8 months late, community still active). A campaign
that goes silent loses trust irreversibly regardless of whether the product eventually ships.

---

## Quick-reference: Reinkstone R1 as the $1M cautionary case

Reinkstone raised $1,019,677 with 2,424 backers on a compelling "world's first true color"
spec claim. It funded in 15 minutes and had $650k by day 7. Every metric at campaign close
looked like a success. Then:

- First batch shipped December 2022, 14 months late (promised November 2021).
- Last creator update August 22, 2023. Complete communication blackout after that.
- 1,318-comment refund thread with no creator responses to any refund demand.
- Company pivoted to selling e-ink phone cases; all R1 product pages return 404 today.
- Used R1 devices selling on eBay for $15.50 at time of data capture.

The $1M raise with 2,424 backers means the potential liability if all unfulfilled backers
were entitled to refunds would be in the hundreds of thousands of dollars. Kickstarter
provides no enforcement mechanism. The KS platform still shows the project as "Shipped"
despite the comment-section evidence.

For a foldable campaign: the lesson is that spec-novelty raises $1M+ and then the spec decays
while fulfillment obligations remain. The writers who backed Freewrite in 2014 are still
writing on Freewrites in 2026. The readers who backed Reinkstone R1 in 2021 got refund
demands with no response.

---

*Sources: all data from per-campaign corpus directories at
`/home/kyu3/PMF/runs/eink-tablets/crowdfunding-corpus/<slug>/` (9 .md files per campaign)
and raw Playwright txt files where present in `raw/` subdirectories. Cross-references to
`eink-category-evolution/evolution-profile.md` and `marketing-corpus/birdseye-map.md`
for category context. Campaign roster at `campaign-roster.md`. Compiled 2026-05-24.*

---

## Section E — Per-Campaign Verbatim Copy Vault

This section contains the full campaign page copy (hero, story, risks, FAQ, tiers) and
Meta/FB ad copy where available. All quoted text is verbatim from the primary source.
Source notes are inline per campaign. "not found in accessible source" means the page
returned 403 or 404 to all fetch methods and no substitute verbatim source was available.

Deep-dive campaigns appear first, skim campaigns at the end.

---

# Section E — Verbatim Copy Vault: Group 1
Campaigns: Reinkstone R1 | Zerowriter Fold | Zerowriter Ink
Generated: 2026-05-24

---

### Reinkstone R1 (Kickstarter, 2021)

**Hero headline:** "Reinkstone R1, The Ultimate True Color DES E-Paper Tablet"
**Subhead / tagline:** "The most paper-like experience for reading & writing | Ultra-long battery life | Powered by Android 11."

**Story copy (verbatim, in section order):**

"We live in a world surrounded by technology and digital media, and yet nothing really beats the comfort and pleasure of reading from paper. Digital reading devices such as Kindle replicate the paper-reading experience but lack the ability to do more."

"What if you need to read notes and research papers in color? And what should I use to read comics and newspapers? Black and white are boring, how can we get some color?"

"Reinkstone R1 is the world's first & thinnest book-sized color E-Paper Android tablet. With 140 color PPI, it has the highest color display among all color E-paper devices. It is perfectly designed for reading, writing, working, and entertainment while providing users the best eye protection."

Reading Front Light
"With the Reinkstone Natural Low Light Technology, you can comfortably read anytime and anywhere. No matter if it's under sunlight or at night, you won't need to endure the eye strain of reading with electronic devices or the inconvenience of paper books."

Sleek Design
"With a vertical notebook design only 0.68cm thick, Reinkstone makes reading and writing easier and more comfortable in any position and it's lightweight and slim for travel."

Long Battery Life
"Its thin, powerful, large capacity 4500mAh battery gives Reinkstone 100 days standby time/300 hours working time on a single charge. Read more, do more, and say goodbye to battery anxiety."

Unlimited Formats
"With support for unlimited formats and searchable files, Reinkstone makes the perfect media library for users who want the pleasure of paper-realistic reading without the inconvenience of traditional books."

Effortless Input
"4096 Level pressured Stylus with eraser and EMR layer gives you a paper-like writing experience. Taking notes and signing documents has never been easier. Don't feel like jotting it down? Voice record meetings and notes with the R1's double noise-reduction MIC to capture it all."

Faster Sharing
"Convert handwritten notes into text with one click. Share your notes with others in a single click via Wi-Fi,Bluetooth, OTG, or screencast."

DES New Color E-Paper
"DES is a new display electronic slurry module that adopts a novel display structure. It is completely different from the existing micro cup structure and micro capsule structure. This structure forms a layer of a cofferdam on the surface of the TFT which makes the microstructure invisible from the front side and reduces the number of layers. It thereby obtains a higher definition and higher resolution display than previous generations of color E-paper"

Better Performance
"1.8GHz 4 Core processor with 4GB RAM & 64GB ROM makes reading and writing effortless. Need more storage room? Reinkstone R1 supports OTG to expand its memory."

"Besides the unparalleled reading experience, Reinkstone is also a fully functional Android 11 tablet with upgradable operating system, allowing you to install the APPs you need. One Reinkstone is all you need for study, work, and entertainment."

Protect Their Eyes
"Reinkstone's DES E-paper screen is the best in protecting our users' eyes. It allows your children to read comics, manga, or any books harmlessly without distraction or eye fatigue."

Best For Audiobooks
"According to the Audio Publishers Association, audiobooks help 'build and enhance vital literacy skills such as fluency, vocabulary, language acquisition, pronunciation, phonemic awareness, and comprehension—skills that often boost reading scores.'"

"Reinkstone R1's double BOX speaker makes it the best audiobook reader while providing both you and your children some personal time."

Inspire Their Talent
"'Color is a power which directly influences the soul.' By Wassily Kandinsky. Don't let black and white limit their talent and possibilities. R1 is here to help expand and record children's colorful imaginations."

"Be a Reinkstone user, reduce your carbon footprints with one simple decision."

"According to The Eco Guide, 'In 2008 alone, the publishing industry was responsible for the harvest of nearly 125 million trees.' Using an E-reader that can hold thousands of books saves paper, saves trees, and helps save the planet."

"We are a young and passionate team from the Wiwood Company with 10 years of experience in the field of tablets and e-Paper readers. Our team is dedicated to creating a colorful reading world with a premium e-reader, eye protection, and comfort for users, while contributing to environmental protection at the same time. We hope this product can salute the classic as it becomes the next classic."

"Reinkstone is a professional and responsible company based around people. It designs, develops, manufactures, and delivers innovative e-Paper Readers through cutting-edge science and technology for people who love reading and are searching for a better reading experience. After more than ten years of black and white e-reading experience, we believe users should open a new reading world with a color e-reader. This is why we created Reinkstone."

**Risks & Challenges (verbatim):**
"With our years of experience with e-reading product development, our team is very confident with our product quality, user experience, and shipping schedule for Reinkstone R1.
However, there might be some hidden obstacles and challenges during production. Because of that, we've made sure to account for some amount of unforeseen problems that may occur in our schedule. We are confident that our team is well-prepared to provide a carefree experience throughout the campaign.
The speed of shipping may vary from country to country especially under the worldwide pandemic outbreak. Our team will try our best to expedite the shipping and provide the best service for our backers after we reach our funding goal.
Please be aware that there may be extra customs fees due to the policy of different countries. Please check the local regulation of customs duties first. Backers need to take care of it by themselves.
If something goes wrong, we promise to keep our backers updated and informed about any issues and how we solve them. You can support us with confidence."

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source — KS FAQ page returned HTTP 403 (Cloudflare block). Campaign header shows "FAQ 6" indicating 6 entries exist.

**Reward tiers (verbatim):**
- Reinkstone VIP Club: $1 — "Thanks for the support and love for Reinkstone! We will include you in the newsletter of our VIP club!" | Est. delivery: Nov 2021
- Reinkstone R1 Super Early Bird: $329 (600 cap, 3 left at capture) — "Get your Reinkstone R1 at the BEST price! Save 40%!" Includes: Reinkstone R1, Reinkstone Stylus, USB-C Charging Cable. Add-ons: +$30 additional Stylus (Save 50%), +$25 Case (Save 50%), +$20 for 10 Stylus Tips (Save 50%). "We will collect your Shipping Address after the campaign ends in a post-campaign survey. Please stay tuned." | Est. delivery: Nov 2021
- Reinkstone R1 Early Bird: $379 (1,300 cap, 1 left at capture) — "Get your Reinkstone R1 at a GREAT price! Save 31%!" Includes: Reinkstone R1, Reinkstone Stylus, USB-C Charging Cable. Add-ons same as above. | Est. delivery: Nov 2021
- Reinkstone R1 KS Special: $429 (1,500 cap, 1,293 remaining) — "Get your Reinkstone R1 at a GREAT price! Save 22%!" Includes: Reinkstone R1, Reinkstone Stylus, USB-C Charging Cable. Add-ons same as above. | Est. delivery: Nov 2021
- Reinkstone R1 KS Exclusive: $479 (no cap stated) — "Get your Reinkstone R1 at a GREAT price! Save 13%!" Includes: Reinkstone R1, Reinkstone Stylus, USB-C Charging Cable. Add-ons same as above. | Est. delivery: Nov 2021
- Reinkstone Double Pack Super Early Bird: $638 (SOLD OUT) — "Get TWO Reinkstone R1 at the BEST price! Save 42%!" Includes: 2x Reinkstone R1, 2x Reinkstone Stylus, 2x USB-C Charging Cable. | Est. delivery: Nov 2021
- Reinkstone Double Pack Early Bird: $838 (100 cap, 68 remaining) — "Get TWO Reinkstone R1 at a GREAT price! Save 24%!" Includes: 2x Reinkstone R1, 2x Reinkstone Stylus, 2x USB-C Charging Cable. | Est. delivery: Nov 2021
- Reinkstone Family Pack Super Early Bird: $1,276 (SOLD OUT) — "Get FOUR Reinkstone R1 for you and your families at the BEST price! Save 42%!" Includes: 4x Reinkstone R1, 4x Reinkstone Stylus, 4x USB-C Charging Cable. | Est. delivery: Nov 2021
- Reinkstone Family Pack Early Bird: $1,676 (10 cap, 7 remaining) — "Get FOUR Reinkstone R1 for you and your families at a GREAT price! Save 24%!" Includes: 4x Reinkstone R1, 4x Reinkstone Stylus, 4x USB-C Charging Cable. | Est. delivery: Nov 2021
- Reinkstone R1 Distribution Pack: $3,140 (5 cap, 1 remaining) — "Get TEN Reinkstone R1 at the BEST price! Save 43%!" Includes: 10x Reinkstone R1, 10x Reinkstone Stylus, 10x USB-C Charging Cable. | Est. delivery: Nov 2021

**Meta/FB ads (from adlibrary):**
0 active ads found. Reinkstone page (pageID 101715638722373, ~1,500 followers) shows "No ads match your search criteria." Company appears to have pivoted to phone cases (Reinkstonecase, separate page). No ad copy retrievable.

---

### Zerowriter Fold (Kickstarter, 2026)

**Hero headline:** "Write anywhere. Distraction free."
**Subhead / tagline:** "Zerowriter Fold is the paper-like word processor built for writers. Six-inch e-ink display, mechanical keyboard, weeks of battery life, and user-controllable lighting. No subscriptions. No bloat."

Note: KS campaign story/body returned HTTP 403 to Playwright. Story copy below is verbatim from the creator's own landing page (zerowriter.ink/pages/zerowriter-fold), captured 2026-05-24. KS raw Playwright file captured only the reward tiers and campaign header (not blocked by Cloudflare on that page), confirming tier data. KS page header shows "FAQ 16."

**Story copy (verbatim, in section order):**

Opening Value Statement
"Write anywhere. Distraction free."
"Zerowriter Fold is the paper-like word processor built for writers. Six-inch e-ink display, mechanical keyboard, weeks of battery life, and user-controllable lighting. No subscriptions. No bloat."

"No WiFi required. No notifications. No AI integrations. No mandatory cloud. No subscriptions. No tracking. No browser."

Feature Block 1 — Display
"Fast 6" e-ink display with frontlight"
"No perceptible typing delay, exceptional contrast"

Feature Block 2 — Keyboard
"Low-profile mechanical keyboard"
"Hot-swappable Choc switches, 60% layout, customizable"

Feature Block 3 — Battery
"Weeks of battery life. Instant on"
"Opens and resumes writing immediately"

Feature Block 4 — Portability
"Goes everywhere you do"
"Protective folding enclosure, adjustable angles"

Software Section
"No subscriptions. Venture capitalists hate us. Buy it once, own it forever."
"Open source at the core" — "Built on Zerowriter Core (Arduino-based)"
"Your files, your way" — "Saves to micro-SD, USB-C file management"
"Files created as plain text (.txt) and markdown (.md) formats"

Drafting Mode — "Always-forward, distraction-free writing"
Word Processing Mode — "Full editing, bookmarks, document management"

Coming soon: "Cloud Push (optional Google Drive integration)"

Company Value Statement
"A good, reliable writing device shouldn't cost an arm and a leg. We're here to make it happen." — Adam, Founder

"No subscriptions. Venture capitalists hate us. Buy it once, own it forever."

**Risks & Challenges (verbatim):**
not found in accessible source — KS Risks section not retrievable (403). From PCWorld interview (Adam Wilk, May 19, 2026): "So we did the [ZeroWriter Ink] Crowdfunding in winter 2024, and it is now 2026, still fulfilling. It took about a year longer to finish than I had expected. Which always sucks. There's not really any nice way to put it, I think I do have some good excuses considering the state of the world, and, ah, international trade." Creator LP shipping notes: "US customers: Approximately 10% tariff on Canadian imports (as of 2026)" and "European customers: Expect VAT (varies by country: 19% Germany, 20% France/UK, 25%+ Scandinavia)"

**FAQ (verbatim excerpts — key Q&As only):**
Note: KS FAQ page not accessible (403). 16 FAQ entries noted in KS header. Below are verbatim Q&As from the creator's landing page (zerowriter.ink/pages/zerowriter-fold) and from KS comments section (Adam Wilk responses), captured 2026-05-24.

Q: Why does battery life vary (50-100 hours)?
A: "Depends on writing pace, thinking time, screen refresh settings, and brightness level. Slow writers with screen light off see longer battery life than those using frontlight continuously."

Q: Is it compatible with Mac, PC, Linux?
A: "Works with Mac, PC, and Linux via plain text files. No proprietary software or drivers required."

Q: What if I sign up but don't order?
A: "No problem. We don't spam, so you won't hear from us very often."

Q: Why open source?
A: "Even if the company isn't around someday, people can still build, modify, and develop for the Fold. Your work and writing is secure and stable."

Q: Does it have WiFi?
A: "The Zerowriter Fold has the guts that allow for wifi. They are disabled by default. If the user wants, they can enable it in the settings. Wifi will only be used for sending documents to a connected service. The only service I plan on building support for is google drive, but any could be added." (Adam Wilk, KS comments, 2026-05-24)

Q: What chip/processor does it use?
A: "The chip is ESP32-S3, so a different chip than Ink but still in the esp32 family. I decided to leave those technical details out of the Kickstarter campaign as it might confuse people expecting laptop-style specs." (Adam Wilk, KS comments, 2026-05-24)

Q: Will there be other language keyboard options?
A: "Yeah, we'll be adding German keyboard as an option in the Pledge Manager at the end of the campaign. Definitely a popular request!" (Adam Wilk, KS comments, 2026-05-24) / "Yes, the Fold supports Spanish, and we'll roll out keycaps for different languages (starting with common Latin languages like German, French, Italian, Scandinavian languages, etc...) after the campaign closes." (Kate, KS comments, 2026-05-24)

Q: Is there a Google Drive sync option?
A: "Sync: no, push: yes! We've got Google Drive push (Zerowriter fold -> drive) sorted and it should be available at launch as an option. 2-way Syncing is a bit more complicated and has more room for problems, but we'll investigate options!" (Adam Wilk, KS comments, 2026-05-24)

**Reward tiers (verbatim):**
Note: Tier names, prices, and descriptions from KS raw Playwright capture (2026-05-24). Prices shown in CAD on KS; USD approximations shown as rendered by KS.

- Zerowriter Fold - First Wave: CA$329 (~$238 USD) (500 cap — SOLD OUT, None left) — "Save $90~USD off retail. Get a Zerowriter Fold for the limited first wave price. You'll be one of the first shipments out of our warehouse. Includes everything you need to write anywhere. Further customize your Zerowriter Fold in the pledge manager when the campaign ends." 4 items included + optional add-ons. | Est. delivery: Jan 2027
- Zerowriter Fold: CA$355 (~$257 USD) — "Save $70~USD off retail. Get a Zerowriter Fold for the Kickstarter exclusive price. Shipped in sequential order: first-in, first-out. Includes everything you need to write anywhere. Further customize your Zerowriter Fold in the pledge manager when the campaign ends." 4 items included + optional add-ons. | Est. delivery: Mar 2027

Shipping: "approximately $20-35 USD depending on location" (creator LP). "Final pricing handled via pledge manager after campaign closes."

**Meta/FB ads (from adlibrary):**
none found in adlibrary — no adlibrary file captured for Zerowriter. Note from KS comments: backer Janine Shull posted "When I first saw the ad for this on FB I was instantly going to fund it," confirming Meta ads were running during campaign, but no ad copy was retrievable.

---

### Zerowriter Ink (Crowd Supply, 2024)

**Hero headline:** "Zerowriter Ink is an e-paper word processor with a low-profile mechanical keyboard, great readability, and long-lasting battery life."
**Subhead / tagline:** "Your open-source e-paper typewriter"

Note: Crowd Supply main campaign page returned HTTP 403 to WebFetch during initial corpus build. Body copy below is verbatim from the Playwright raw txt capture of the Crowd Supply page (campaign-2026-05-24T19-38-50.txt), which successfully loaded the page content.

**Story copy (verbatim, in section order):**

"Zerowriter Ink is an e-paper word processor with a low-profile mechanical keyboard, great readability, and long-lasting battery life. This is a collaboration between Zerowriter and Soldered Electronics, makers of the Inkplate series of e-paper displays. We are building an active, robust community around Zerowriter Ink, and we hope you'll be a part of it!"

An Open Typewriter for Writers
"We designed Zerowriter Ink as a dependable and expandable alternative to some of our favorite products, the Alphasmart Neo and the Pomera DM30. It's for writers first and device hackers second. It's for anyone who wants a simple, dedicated writing tool. It's for working at home, on the road, in the park, or by the sea. It ships with easy-to-use software and it just works, right out of the box."

"If you like to tinker, you can dive right in and make it yours. If you don't, it'll help you get those words out and then stay out of your way."

No Compromises
"I launched the Zerowriter Project with a Raspberry Pi Zero, a cheap e-paper panel, and a mission: to build an open source alternative to commercial distraction-free writing tools. Hundreds of people have gotten involved by contributing code, sharing designs, learning, making, and hammering out words."

"It was a good start, but it wasn't quite the device I was looking for. What I wanted was a minimal e-paper typewriter I could throw in my backpack and use anywhere. All it had to do was produce text files, but I needed it to fit comfortably in my bag, wake up instantly, and be ready whenever creativity hits. So I went back to the drawing board and rebuilt my dream device on the remarkable Inkplate 5 – my absolute favorite e-paper display. No compromises, this time."

"I finally had the product I was looking for. I also learned that other people wanted one too, but most weren't interested in building their own. And that's how we ended up here: crowdfunding a fully assembled, open source Zerowriter Ink."

Features & Specifications
"Display: second-edition Inkplate 5.2" display with an upgraded 1280 x 720 widescreen resolution for crisp, clean text."
"Refresh Rate: variable e-paper refresh rate produces almost no perceptible lag while you're typing."
"Keyboard: hot-swappable, 60% mechanical keyboard with Kailh Choc Pro Red low-profile switches and keycaps. US English layout with printed legends. Swap and customize as you like. Includes optional arrow keys to replace bottom right modifier keys."
"Languages: customizeable keyboard with support for most western languages, like English, French, German, Spanish, Italian, and more. Uses extended ASCII 256 chars."
"Dimensions Powerfully portable at 300 mm x 195 mm x 15 mm (12" x 7.5" x 0.6"). Slide it into your backpack and go. Fits in most 13" laptop sleeves."
"Software: Instant-on, distraction-free writing software. No fiddling with accounts or logins."
"Connectivity: Manage your files on the included microSD card. Connect via USB cable to transfer text files with companion app (via UART). Transfer files to your phone via QR Code."
"Battery: Up to weeks of daily use on a single charge. Built-in, user-replaceable LiPo battery with USB Type-C charging."
"Session Tools: Optional session tools to count words, track total writing time, page counts, set goals, hit milestones, and more."
"Hackability: Easy-to-hack, Arduino-based software with full access so you can make it do whatever you want."
"Transparency: No gimmicks, no marketing babble, no renders, and no mockups. What you see is what you'll get."

Software & Experience
"A high-contrast, high-resolution e-paper screen with best-in-class performance. Readable in sunlight and easy on the eyes. Make it yours by configuring the size, spacing, and font to your liking or by adjusting the refresh rate to fit your needs."

"Navigate and manage files using the on-device menu to Save, Save-As, Delete, and Rename files. View current battery life and word count. Easily access configuration options, and extend device functionality with plugins and settings."

"Work on longer documents or projects with ease. Quickly review previous pages by scrolling through the open file, then continue writing by pressing any key. Supports 3,000 lines (approximately 24,000 words) per document."

"Zerowriter Ink's software is built for how you write. Choose between two modes: drafting, and word-processing. Toggle back and forth as you need, on the fly."

"If you want to quick-fix a mistake, no problem. You can easily make simple edits with arrow-key navigation and cursor-based edits."

"Sometimes, less is more. Zerowriter Ink's writing software is focused on getting that first draft done. The canvas is minimal and clean. It supports configurable text sizes, line spacing, and custom fonts. You can adjust the screen refresh rate to suit your needs and balance your power usage. You can manage your files on-device, with a menu to save, rename, or delete your work. Finally, there are optional motivational tools that will give you word counts and session times to keep you on track and making progress."

"When you're done drafting, your .txt files will be ready for you to bring them over to a word processor for additional editing, formatting, and revision."

"Looking for something else? Open software means Zerowriter Ink can do whatever you want it to do – or whatever someone in the community dreams up!"

Software Updates & Roadmap
"Some of the recent software updates include: wide language support for most western/latin-based languages, support for custom fonts, and a suite of fully-functional writing shortcuts like what you'd expect in a word processor."

"We're constantly working on refining the software for Zerowriter Ink. You can easily update your device by dragging a file on to your SD card, and powering on your unit. It will automatically update with the new firmware."

"This also makes it easy for other developers to share their own custom builds with the community."

"We'll be sharing developments and features in our campaign updates, or you can join the Zerowriter discord server to discuss more software ideas."

Private by Default. Open to New Experiences.
"Your words stay on your microSD card. Zerowriter Ink has no 'subscription model,' no software-as-a-service, and no cloud storage by default. Shipping without wireless connectivity means less development time, less red-tape, and less cost to you. Zerowriter Ink supports Wi-Fi and Bluetooth at the hardware level, though, so you could implement cloud storage and other online features in code or through a community update or extensions."

"This is a small project with a very small team. We are focused on creating a foundation for others to build upon, but that doesn't mean you have to be the one laying the bricks. The Zerowriter community is already a scrappy group of writers and geeks, and we only expect it to grow. We are excited to see what new features our community implements."

"Want to try something out? Installing a new build will be as easy as downloading a file, and starting up your Zerowriter Ink. Since your writing is stored separately on the microSD card, there's minimal risk of data loss. You can always revert to the default build."

Support & Documentation
"Each Zerowriter Ink includes a getting started guide. When you open the box and power it up, you will be straight in to a document and ready to go. This means Zerowriter Ink is the perfect gift for anyone who writes, even those who don't get along too well with modern technology."

"Open source makes sense for projects like this. We can't support every language, keyboard layout, cloud service, or software request out of the box. Instead, we will provide a basic tool with all of the core functionality you expect. Other developers can extend our software (and our hardware!) to add features."

"Zerowriter Ink is built around the ubiquitous ESP32 module, and our software is written entirely in Arduino, which is one of the easiest languages to learn if you want to work with hardware. Our goal is to keep everything approachable and transparent."

"Our hardware design files are available in our GitHub. Our source code will all be published on GitHub."

"You can get help or contribute to the project on the Zerowriter discord server."

**Risks & Challenges (verbatim):**
not found in accessible source — Crowd Supply campaign page did not expose a dedicated Risks & Challenges section in the Playwright capture. From press coverage (CNX Software, Sep 18, 2024): "Hardware designs and source code will be published on GitHub before shipping starts." Later acknowledged in campaign updates: ~300 spacebars from original batch were faulty; awaited replacement shipment. From PCWorld interview (Adam Wilk, May 19, 2026): "it took about a year longer to finish than I had expected."

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source — Crowd Supply FAQ not captured. Inferred from updates and press:

Q: Is it open source?
A: "Hardware designs and source code will be published on GitHub before shipping starts." (campaign copy, via CNX Software, Sep 18, 2024)

Q: Where is it made?
A: "Zerowriter came to Soldered with an advanced prototype, which Soldered helped improve and finalize (designing in a better battery charging circuit) and then manufactured on their assembly line in Croatia." (campaign body, via Crowd Supply page, captured 2026-05-24)

Q: Does it require accounts or cloud?
A: "Your words stay on your microSD card. Zerowriter Ink has no 'subscription model,' no software-as-a-service, and no cloud storage by default." (campaign body verbatim)

**Reward tiers (verbatim):**
- Zerowriter Ink: $199 (campaign price, single tier) — "A distraction-free e-paper word processor that's always ready to write. Comes with a USB Type-C to Type-A cable." | Shipping: $8 US / $18 international | Est. delivery: February 28, 2025

Post-campaign store price: $285 (price at time of Playwright capture, 2026-05-24; orders placed then ship Jun 19, 2026).

Note: Crowd Supply ran a single-SKU structure. No early-bird or multi-tier pricing. 570 backers total. Final raise: $143,023 against $30,000 goal (476% funded).

**Meta/FB ads (from adlibrary):**
none found in adlibrary — no adlibrary file captured for Zerowriter Ink. Campaign ran on Crowd Supply (not Kickstarter); Meta ad spend not investigated.
# Section E — Verbatim Copy Vault (Group 2)
# Campaigns: diptyx, viwoods-aipaper, iflytek-ainote2
# Produced: 2026-05-24

---

### Diptyx E-Reader (Crowd Supply, 2025–2026)

**Hero headline:** "Diptyx E-Reader"
**Subhead / tagline:** "An open-source, dual-screen e-reader"

**Story copy (verbatim, in section order):**

[Opening paragraph — from raw campaign page]
"Diptyx E-Reader is an ESP32-based, open-source e-reader. Its unique dual-screen design allows it to close like a book, protecting the screens without requiring a case, making it perfect for reading on the go. Automatic standby mode and e-ink displays enable the device to run for weeks on a single charge, while it powers up in seconds with the press of a button. Fully open-source, Diptyx E-Reader is easy to repair and customize, letting you read whenever and wherever you want, forever."

Own Your Device, Own Your Books
"Diptyx E-Reader runs on custom, open-source firmware designed specifically for reading ebooks. Simply upload your digital books as EPUB files through the USB Type-C connector, and start reading."

"It features no DRM, allowing you to read books from any digital bookstore, as long as they are in EPUB format. That enables full offline use anywhere you go: no internet connection, accounts, or cloud services are required."

"When you're done reading, the device automatically enters deep sleep mode, reducing power consumption to an absolute minimum. Its stellar power management, two large batteries, and efficient circuitry allow for weeks of use on a single charge. In standby, the device can last for months, but it can still be fully powered off if you need to save every microamp."

"Diptyx E-reader is constructed in a unique way: rather than hiding the electronics within the device, the circuit boards are actually put on display as part of the other shell, covered with beautiful art-nouveau illustrations. But don't worry, The exposed layers contain no active circuits, so even deep scratches won't affect functionality."

Firmware & User Experience
"The Diptyx E-reader firmware is designed to provide the simplest possible reading experience. Starting from power-off, it boots directly into your library of books, which are sorted by author. Of course, if you were reading something the last time you used the device, it will directly open that instead."

"With the physical buttons you can navigate through the pages of the book, and a convenient quick menu is available for scrolling through chapters, toggling dark mode, or jumping to your bookmarks. Details on how the book is displayed can be changed in the general settings menu, where you can choose a variety of fonts, tune the line-spacing, and much more. Other device-settings can be customized as well, such as the automatic standby timeout or whether you want to use the internal haptic buzzer."

"Since the device is open-source, the community is free to modify the source-code in whatever way they want. This opens a range of possibilities: activate Wi-Fi functionality to access RSS feeds, create unique custom games, or connect a bluetooth keyboard and make a two-screen writerdeck—the limit is your imagination."

Support & Documentation
"Device longevity and right-to-repair are core principles for us. Therefore, we make extensive use of open-source design software: the enclosure is designed in FreeCAD, the electronics are designed in KiCad, and the firmware is developed with VS Code. After the campaign is finished and the design is finalized, these design files will be made open source, making it easy to customize and repair your own device."

"Diptyx E-Reader's firmware builds on prior open-source work and will be released under the MIT license. We are excited to see what custom software and applications users will develop."

Manufacturing Plan
"Many, many prototypes have been constructed during development, but we are happy to say that the design of the Diptyx E-reader is almost finalized. All core hardware functions are working reliably, so production can begin shortly after funding. It has been designed from the ground up for easy production and assembly, whilst keeping it as compact as possible."

"The main circuit boards will be manufactured and assembled by a reputable PCB house. Assembly of the devices, as well as production of the enclosures, will be performed by us, in the Netherlands. In this way we keep the supply chain as small as possible, while making sure every device meets our quality expectations."

Fulfillment Plan
"After the campaign has finished, we can start with the first production run. Depending on the amount of orders, the production will possibly be spread into several smaller batches. We will then package everything up and send it along to Crowd Supply's fulfillment partner, Mouser Electronics, who will handle distribution to backers worldwide. You can learn more about Crowd Supply's fulfillment service under Ordering, Paying, and Shipping in their guide."

**Risks & Challenges (verbatim):**
"Production: Small scale production is always hard, and we depend on multiple sources of components, international shipping, and new tarifs. To reduce production risks and ensure the longevity of our product, the design uses mostly off-the-shelf components which can be sourced from multiple suppliers. In this way, we can switch suppliers in case there are issues, and replacement parts will be easy to source in the future.

Software support: Because EPUB is an open and loosely defined standard, some books may render unexpectedly. We'll continue refining the firmware with feedback and help from the community to ensure the best possible reading experience."

**FAQ (verbatim excerpts — key Q&As only):**
Not found in accessible source. Campaign page returned 403. No verbatim FAQ text recovered from any press or search source.

**Reward tiers (verbatim):**
- Diptyx E-Reader: $249 (no cap stated) — Open-source, dual-screen e-reader | Est. delivery: Sep 30, 2026 (post-campaign orders); May 13, 2026 (campaign backer orders)
- USB 3.1 Cable: Type-C to Type-C (100 cm): $19 — A 100 cm cable with a USB Type-C connectors on both ends. No additional shipping charge when ordered with other products. | Est. delivery: In stock
- USB 2.0 Cable: Type-C to Type-A (100 cm): $8 — A 100 cm cable with a USB Type-C and a USB Type-A connector. | Est. delivery: May 13, 2026

Note: Shipping — Free US / +$12 Worldwide on main device.

**Meta/FB ads (from adlibrary):**
none found in adlibrary

---

### Viwoods AiPaper Carta 1300 E Ink Tablet (Kickstarter, 2024)

**Hero headline:** "Viwoods AiPaper Carta 1300 E Ink Tablet"
**Subhead / tagline:** "Ultra-Thin & Light | High-Resolution Screen | Paper-like experience | AI Integration | Instant File Sharing | Long-Lasting Battery"

**Story copy (verbatim, in section order):**

Blending Innovation with Classic Paper Feel
"At Viwoods, we are committed to innovation, blending modern technology with the timeless feel of traditional paper. Our passion for paper-based reading and writing, combined with cutting-edge technology, drives us to offer an unparalleled experience."

Staying True to Our Roots
"Our team comprises professionals with a deep affection for paper and writing. We understand the importance of paper in everyday life and aim to merge its best qualities with the convenience of modern technology through our revolutionary Viwoods AiPaper product."

AiPaper: The Future in Your Hands
"Viwoods AiPaper is a revolutionary tablet that seamlessly integrates E Ink screen technology with advanced artificial intelligence. Designed to deliver a paper-like reading and writing experience with its high-resolution, flexible screen, AiPaper not only feels as natural as reading and writing on paper but also enhances productivity with its powerful AI capabilities."

"With AiPaper, every use feels intuitive and efficient, making it the perfect companion for students, professionals, and anyone who values the blend of analog comfort and digital innovation."

Commitment to the Environment
"We care deeply about environmental protection. The design and manufacturing of AiPaper aim to minimize environmental impact, promoting green reading and writing by reducing paper consumption and waste."

Looking Forward
"As technology evolves, we will continue to innovate and provide better products and services. We believe our efforts will help more people enjoy a paper-like digital reading and writing experience."

"Viwoods combines the classic essence of paper with digital innovation, leading a revolution in reading and writing. Join us in celebrating the launch of Viwoods AiPaper on Kickstarter and witness the future together."

Long-lasting design [Environmental commitments section]
"One of the key features of AiPaper is its battery life. The tablet is built to last, offering weeks of use on a single charge. This extended battery life is ideal for users who need a reliable device for long periods without the worry of frequent recharging."

Reusability and recyclability
"AiPaper is an E Ink tablet designed to facilitate a paperless lifestyle. The device's E Ink display provides a paper-like reading and writing experience, which is easier on the eyes and helps users reduce their use of physical paper."

Use of AI
"Our project is not aimed at raising funds for AI tools, nor does it rely on AI-generated content. However, we have harnessed the power of AI by integrating it into our system through our own dedicated server, enhancing our product's capabilities and user experience: AI Text Conversion: Our system employs AI to seamlessly convert handwritten notes into digital text for easier organization and sharing. AI Content Analysis: Utilizing AI, we provide users with comprehensive content analysis and concise summaries for efficient information processing. By integrating AI into our core system with a custom-built server, we ensure a seamless, secure, and responsive experience, setting our product apart in terms of functionality and user engagement."

**Risks & Challenges (verbatim):**
"Production Timing: Unexpected events in production, such as material scarcity or manufacturing hiccups, could lead to delays. To counter this, Viwoods has secured alternative suppliers and incorporated additional lead time into our production schedule.

Standard Assurance: Attaining uniform excellence in every Viwoods device is essential. We've established a stringent quality assurance framework featuring successive quality checkpoints and ongoing collaboration with our production partners.

Dispatch and Delivery: The intricacies of logistics, including precise cost assessments, customs clearance, and potential shipping lags, present potential obstacles. Viwoods has teamed up with seasoned logistics firms and is committed to keeping our supporters informed.

Compliance Adherence: We've undertaken thorough research to adhere to all regulatory and safety standards. While unforeseen compliance issues could emerge, Viwoods is dedicated to engaging proactively with regulatory authorities to find swift resolutions.

Capacity Management: Should demand exceed forecasts, scaling production could be challenging. Viwoods has completed a thorough capacity assessment and fostered robust ties with our manufacturing partners to ensure we can meet heightened demand.

Viwoods is dedicated to delivering a superior AiPaper E Ink Tablet. We pledge transparency, proactivity, and ongoing communication with our backers, ensuring they are part of every step of this journey."

**FAQ (verbatim excerpts — key Q&As only):**
Q: Warranty coverage?
A: "14-month warranty that covers the main device and the writing stylus for functional defects. The warranty does not apply to accessories such as protective cases or pen tips, and it does not cover damage from accidents, unauthorized modifications, or the use of non-official accessories."

Q: Shipping times?
A: "US customers: 3-7 days to receive; Other countries: 8-15 days to receive. Additionally, non-US orders ship via international express, duties borne by the customer."

Q: Battery life?
A: "up to one week of daily use (2 hours per day) or 4 weeks on standby"

Q: Handwriting-to-text?
A: "AiPaper supports handwriting-to-text conversion through three distinct ways: real-time as you write, selective conversion of any portion of the document, and full-page AI-powered recognition for unmatched accuracy."

Q: Shipping regions?
A: "Asia, Europe, North America, and Oceania"

**Reward tiers (verbatim):**
- Viwoods AiPaper Mini E Ink Tablet Pack: HK$2,869 (80 cap, 5 left of 80) — Viwoods AiPaper Mini E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / 39% OFF from $599 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- Viwoods AiPaper Mini E Ink Tablet: HK$2,945 (200 cap, 134 left of 200) — Viwoods AiPaper Mini E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / 39% OFF from $599 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- Viwoods AiPaper Mini E Ink Tablet: HK$3,024 — Viwoods AiPaper Mini E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / Guaranteed Delivery by Viwoods team | Est. delivery: Nov 2024
- Viwoods AiPaper Mini E Ink Table: HK$3,110 — Viwoods AiPaper Mini E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / Guaranteed Delivery by Viwoods team | Est. delivery: Dec 2024
- Viwoods AiPaper E Ink Tablet Pack: HK$3,739 (80 cap, None left) — Viwoods AiPaper E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / 41% OFF from $799 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- Viwoods AiPaper E Ink Tablet Pack: HK$3,815 (260 cap, 12 left of 260) — Viwoods AiPaper E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / 39% OFF from $799 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- Viwoods AiPaper E Ink Tablet: HK$3,889 — Viwoods AiPaper E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / Guaranteed Delivery by Viwoods team | Est. delivery: Nov 2024
- Viwoods AiPaper E Ink Tablet: HK$4,279 — Viwoods AiPaper E Ink Tablet X1 / Leather Case X1 / Stylus with Eraser X1 / Long-lasting Tips X1 / Smooth-writing Tips X10 / Guaranteed Delivery by Viwoods team | Est. delivery: Dec 2024
- AiPaper Mini E Ink Tablet Pack X2: HK$5,738 (25 cap, 23 left of 25) — Viwoods AiPaper Mini E Ink Tablet X2 / AiPaper Mini Leather Case X2 / Stylus with Eraser X2 / Long-lasting Tips X2 / Smooth-writing Tips X20 / 39% OFF from $1,198 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- AiPaper + AiPaper Mini E Ink Tablet Pack: HK$6,608 (30 cap, 27 left of 30) — Viwoods AiPaper E Ink Tablet X1 / Viwoods AiPaper Mini E Ink Tablet X1 / AiPaper Leather Case X1 / AiPaper Mini Leather Case X1 / Stylus with Eraser X2 / Long-lasting Tips X2 / Smooth-writing Tips X20 / 40% OFF from $1,398 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- AiPaper + AiPaper Mini E Ink Tablet Pack: HK$6,608 (27 cap, 3 left of 27) — Viwoods AiPaper E Ink Tablet X1 / Viwoods AiPaper Mini E Ink Tablet X1 / AiPaper Leather Case X1 / AiPaper Mini Leather Case X1 / Stylus with Eraser X2 / Long-lasting Tips X2 / Smooth-writing Tips X20 / 40% OFF from $1,398 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- AiPaper E Ink Tablet Pack X2: HK$7,478 (25 cap, 18 left of 25) — Viwoods AiPaper E Ink Tablet X2 / AiPaper Leather Case X2 / Stylus with Eraser X2 / Long-lasting Tips X2 / Smooth-writing Tips X20 / 41% OFF from $1,598 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- AiPaper E Ink Tablet Pack X2: HK$7,478 (16 cap, 13 left of 16) — Viwoods AiPaper E Ink Tablet X2 / AiPaper Leather Case X2 / Stylus with Eraser X2 / Long-lasting Tips X2 / Smooth-writing Tips X20 / 41% OFF from $1,598 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024
- AiPaper + AiPaper Mini Pack X2: HK$13,216 (20 cap, 17 left of 20) — Viwoods AiPaper E Ink Tablet X2 / Viwoods AiPaper Mini E Ink Tablet X2 / AiPaper Leather Case X2 / AiPaper Mini Leather Case X2 / Stylus with Eraser X4 / Long-lasting Tips X4 / Smooth-writing Tips X40 / 40% OFF from $2,796 MSRP / Guaranteed Delivery by Viwoods team | Est. delivery: Oct 2024

**Meta/FB ads (from adlibrary):**
none found in adlibrary

---

### AINOTE 2 (Kickstarter, 2025)

**Hero headline:** "AINOTE 2: The World's First GPT-5-Powered Paper Tablet"
**Subhead / tagline:** "GPT-5-Powered Workflow | 10.65", 4.2mm, 295g | 15-Language Transcription + 133-Language Handwriting OCR | Android & Google Play Ready"

**Story copy (verbatim, in section order):**

All-in-One Paper Tablet
"Why juggle three devices when one can give you more?"

"AINOTE 2 is your crystal-clear voice recorder, your sharp, eye-friendly E-reader, and your drawing tablet—all in one sleek tablet. Sketch freely. Read for hours without strain. Capture every word with reliable audio. No app-switching. No extra gear. Just one device. Triple the power. True peace of mind."

Why Choose AINOTE 2 [The Reviews Are In]
"Professional E-Ink Device Reviewer @How To Do Stuff admired AINOTE 2's real-time transcription feature: 'I was especially impressed with how well it handled the voice transcription, even with background noise.'"

"Tech reviewer @OS Reviews praised the versatility of AINOTE 2, commenting: 'This isn't just an e-reader — it's more versatile than typical e-ink tablets, thanks to Android and Google Play support. From sketching and note-taking to real-time multilingual transcription, it's a device that adapts to how you work and create.'"

"Professional Tech Reviewer @Sami Luo Tech spotlighted AINOTE 2's AI capabilities, sharing: 'From real-time transcription to one-tap AI meeting summaries, this device has completely changed how I work. It's not just thin and elegant—it's an all-in-one AI tool that saves hours of organizing notes and meetings. I honestly can't imagine my workflow without it anymore.'"

"Tech Enthusiast @Rawan's Reviews praised the ultra-thin and lightweight design of the AINOTE 2, commenting: 'As soon as I took it out of the box, I was blown away by how thin and lightweight it is. Holding it in your hand feels like holding a stack of papers and not a high-tech device.'"

"Professional Gadget Reviewer @Spencer Scott Pugh highlighted the impressive battery life, saying: 'Battery life to me has been killer. I've only charged it once and we're probably at 75%, which is wild.'"

"Professional Tech Reviewer @TechTalkTech emphasized the AI-powered summarization, commenting: 'If you press this button, it will use deep thinking AI to summarize the entire content for you, which is truly a life-saving feature.'"

"E-Reader Reviewer @Good E-Reader praised the writing precision and AI performance of AINOTE 2: 'The conical tips give a lot of control, and the responsiveness is extremely low latency. With the AI button, everything is processed accurately and instantly. For what it is, it does extremely well, giving you every tool under the sun to complete your work.'"

AI Engine for Your Work—Powered by GPT-5
"Circle any text, handwritten or printed, and get instant answers. Powered by ChatGPT 4o mini, AINOTE 2 solves your questions on the spot, without interrupting your flow."

"Tap the Quick Bar. Press the AI button. AINOTE 2 answers. No app-switching, no interruptions. Empowered by GPT-5."

"Fill in fields, instantly generate polished documents. From business proposals to marketing plans, AINOTE 2 delivers professional results—fast and simple."

"One tap, instant meeting minutes. Powered by GPT-5, AINOTE 2 captures notes and recordings into clean, share-ready summaries. Key points highlighted. Pending items stand out. Decisions stay sharp."

"No editing. No wasted time. Just send and move forward."

Next-Gen Hardware—Faster, Lighter, Thinner
"The world's slimmest paper tablet. Just 4.2 mm thin, 40% lighter than an iPad. A 10.65" 300 PPI eye-friendly screen that goes anywhere."

"Low latency. Instant response."

"Smooth page turns, fluent typing, and natural handwriting. Every action flows-nothing slows you down."

Leading Meeting Notes Power
"Never miss a word. AINOTE 2 captures speech in 15 languages with professional-grade accuracy. Meetings, lectures, or brainstorming, every word is transcribed, every idea preserved. Stay focused on the discussion, not the keyboard."

"No barriers. Just connection."

"Break down language barriers effortlessly. AINOTE 2 translates in real time delivers real-time translation across 10 languages. Follow the discussions in global meetings. Collaborate seamlessly as if everyone spoke the same language."

"Write naturally, just like on paper."

"AINOTE 2 turns handwriting into digital text with high accuracy across 133 languages."

"Your scribbles become searchable. Your thoughts stay organized. And your ideas? Ready to share in seconds."

"Capture every voice, without missing a word."

"AINOTE 2 records and transcribes every speaker in your meeting with crystal-clear accuracy. Track ideas, assign actions, and keep everyone aligned — all in real time."

"No more lost details. Never confused. Just clarity, ready to share."

"Write it down, play it back."

"With Live Link Notes, every handwritten line connects to the exact moment in your recording. Tap a word, jump to the audio. Replay, review, and catch every detail."

"Your notes aren't just notes—they'rea map back to the conversation."

"Blank page freeze? Not anymore."

"With 80+ templates for meetings, projects, and brainstorming, AINOTE 2 gives you a hint every time when you sit down to create."

Paper-Like Handwriting
"We tested over 100 pens across 1,000+ samples and hundreds of tests, and refined them into six brush styles that capture every nuance of real handwriting."

"Every angle, pressure, speed, and resistance was fine-tuned down to the pixel, making every stroke unique."

"Designed for comfort and precision. Perfectly balanced with a natural grip, featuring with Wacom felt tips that replicate true paper resistance."

"AINOTE 2 is the only paper tablet that supports native handwritten mind maps. Expand, move, and adjust nodes freely—No typing, just pure handwriting flow."

All-in-One Schedule & Task Hub
"AINOTE 2 syncs perfectly with Google Calendar, with more integrations coming soon. Stay in flow with the tools you already use, no compromises."

"Turn doodles into to-dos. Circle, triangle, or star—every mark becomes an actionable task, instantly synced to your schedule. Your day stays organized, your priorities never lost."

"Sync your files across PC, mobile, and device in real-time. With AINOTE 2, your work stays safe, backed up, and accessible."

"Just bring your ideas to life—anytime, anywhere."

"One tap, instant share. To Web, Word, PDF, QR code, or Email. AINOTE 2 makes sharing seamless. No conversion, no hassle."

Comfortable Reading Experience
"Fast-refresh screen, smooth page turns, easy on the eyes. Enjoy Kindle, Kobo, and other favorite reading apps—your entire library, always within reach."

"Read on one side, take notes on the other. AINOTE 2 brings a true-to-life reading experience."

"Highlight, scribble, annotate. Every mark links back to context. AINOTE 2 lets your ideas grow freely and naturally."

Open, Compatibility &Secure
"Install APKs, download from Google Play, or connect OneDrive. Unlike other tools, AINOTE 2 adapts to your workflow, not the other way around."

"PDFs, EPUBs, Office docs, and more. Use AINOTE 2 to read, annotate, and share all major formats, without restrictions."

Data Privacy
"AINOTE 2 respects your privacy and data rights. Every note, recording, and summary is stored on AWS cloud with enterprise-grade security. All your content remains visible only to you. Your ideas stay fully private and protected."

About AINOTE Team
"We are a team of creators and thinkers who have always cherished the quiet joy of handwriting. From jotting ideas on a napkin before bed to keeping journals of our travels, the simple act of putting pen to paper has always been both soothing and inspiring. Yet, we have all experienced the frustration of piles of notes lost in moving boxes, fleeting ideas fading before they could be captured, or favorite notebooks buried and forgotten."

"These moments sparked a question: could we preserve the soul of handwriting while giving it the freedom of the digital world? We tried countless apps and digital solutions, but none could recreate replicate the satisfying texture of pen on paper or the natural flow of our thoughts."

"To solve this, we poured our passion and expertise into creating AINOTE 2. From the soft, precise pen tip to the responsive, eye-friendly screen, every detail is designed to let your ideas flow naturally - whether a sudden spark of inspiration at night or a detailed plan in the office. With AINOTE 2, your notes are not only beautifully captured , but also organized, searchable, and always ready to accompany you."

"Our vision goes beyond tools and technology. We want every note to feel like a personal moment, every idea to be preserved effortlessly, and every user to feel understood. AINOTE 2 is the result of this journey, a blend of tradition and innovation designed for real people living real lives. And this is just the beginning. We will continue exploring new technologies and experiences, so every note you write becomes more than just a record—it becomes a part of your story."

Marketing Partner
"This campaign is fully managed and promoted by Vinyl, an official Kickstarter Expert Partner."

"Since 2017, Vinyl has raised $150M+ and led million-dollar projects like AnkerMake ($8M+) and LaserPecker ($6M+), providing expert promotion and marketing services for global success."

"This project is promoted by Jellop, the ad tech power behind the best Kickstarters with 7,000+ successful Kickstarter projects with over $1.4 Billion raised between them."

Use of AI
"AINOTE 2 integrates AI features powered by ChatGPT-4o, including real-time transcription, translation, smart summaries, and note organization. AI is applied within the device to improve productivity and user experience, not to create project content or develop new AI models."

**Risks & Challenges (verbatim):**
"As with any hardware launch, challenges such as production timelines and logistics may arise. To minimize risks, we have partnered with experienced manufacturers and global logistics providers. Our team is committed to transparent communication and timely delivery, ensuring that every backer receives a reliable, high-quality AINOTE 2."

**FAQ (verbatim excerpts — key Q&As only):**
Not found in accessible source. KS FAQ page returned 403 on direct fetch; no verbatim FAQ text recovered from any press or search aggregator source.

**Reward tiers (verbatim):**
- AINOTE 2: HK$3,669 (200 cap, 159 left of 200) — [Limited] Super Early Bird. Save $200 from MSRP $649, 31% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 | Est. delivery: Nov 2025
- AINOTE 2: HK$3,669 (137 cap, 109 left of 137) — [Limited] Super Early Bird. Save $200 from MSRP $649, 31% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 | Est. delivery: Nov 2025
- AINOTE 2: HK$3,669 (120 cap, 92 left of 120) — [Limited] Super Early Bird. Save $200 from MSRP $649, 31% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 | Est. delivery: Nov 2025
- AINOTE 2: HK$3,669 (100 cap, 97 left of 100) — Late Pledge Offer — Save $50 from MSRP $649, 8% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case Bundle: HK$3,886 (200 cap, 129 left of 200) — [Limited] Super Early Bird. Save $210 from MSRP $709, 30% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 / Your protective case color selection will be collected after the campaign ends. | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case Bundle: HK$3,886 (200 cap, 133 left of 200) — [Limited] Super Early Bird. Save $210 from MSRP $709, 30% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 / Your protective case color selection will be collected after the campaign ends. | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case Bundle: HK$3,886 (200 cap, 132 left of 200) — [Limited] Super Early Bird. Save $210 from MSRP $709, 30% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 / Your protective case color selection will be collected after the campaign ends. | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case Bundle Set: HK$3,886 (200 cap, 193 left of 200) — Late Pledge Offer — Save $60 from MSRP $709, 8% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case&Pen Refill: HK$4,042 (600 cap, 335 left of 600) — [Limited] Super Early Bird. Save $220 from MSRP $739, 30% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / Pen Refill Set x1 (5 refills per set) / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 / Your protective case color selection will be collected after the campaign ends. | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case&Pen Refill: HK$4,042 (600 cap, 184 left of 600) — [Limited] Super Early Bird. Save $220 from MSRP $739, 30% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / Pen Refill Set x1 (5 refills per set) / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 / Your protective case color selection will be collected after the campaign ends. | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case&Pen Refill: HK$4,042 (300 cap, 141 left of 300) — [Limited] Super Early Bird. Save $220 from MSRP $739, 30% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / Pen Refill Set x1 (5 refills per set) / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 / Your protective case color selection will be collected after the campaign ends. | Est. delivery: Nov 2025
- AINOTE 2 with Protective Case&Pen Refill: HK$4,042 (200 cap, 188 left of 200) — Late Pledge Offer — Save $74 from MSRP $739, 10% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Protective Case x 1 / Pen Refill Set x 1 (5 refills per set) / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from November 2025 | Est. delivery: Nov 2025
- AINOTE 2 with Keyboard Case&Pen Refill [Featured]: HK$4,739 (600 cap, 114 left of 600) — [Limited] Super Early Bird. Save $249 from MSRP $858, 29% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Keyboard Case x 1 / Pen Refill Set x 1 (5 pcs) / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from December 2025 | Est. delivery: Dec 2025
- AINOTE 2 with Keyboard Case&Pen Refill: HK$4,739 (300 cap, 291 left of 300) — Late Pledge Offer — Save $89 from MSRP $858, 10% OFF. Including: AINOTE 2 x 1 / Stylus x 1 / Keyboard Case x 1 / Pen Refill Set x 1 (5 pcs) / 1-Year Free Warranty / Customs Fee Included / Guaranteed shipping from December 2025 | Est. delivery: Dec 2025

Note: Add-ons available (protective case in three colors: Orange, Dark Blue, Light Gray — color selection collected post-campaign via survey).

**Meta/FB ads (from adlibrary):**
none found in adlibrary
# Section E — Verbatim Copy Vault: Group 3

Campaigns: Bigme Galy, Hemingwrite (freewrite-smart), Freewrite Traveler
Produced: 2026-05-24

---

### Bigme Galy (Kickstarter, 2022)

**Hero headline:** "Bigme Galy: World's First Color E Ink Gallery™ 3 Tablet"

**Subhead / tagline:** "Gallery 3 Screen|Dual Camera|Dual Front Light|Voice-to-text|Handwritten notes to text|2-on-1 Screen Split Mode|Open Android 11"

**Story copy (verbatim, in section order):**

[No section headings in retrieved body — continuous copy below]

"Bigme Galy is co-branded with Good e-Reader to make this best-ever color e-paper tablet! (Good e-Reader is the leading provider of news, reviews and previews on e-readers.)"

"Bigme x Goodereader 8" GALLERY 3 e-Note is one of the first commercially viable products to employ the newest E Ink Gallery 3 color e-paper technology, which brings better color depth and pixel density."

"Since 2008, Bigme has been engaged in the R&D of E-ink screen readers and has gained valuable product development experience over the past 13 years. As a professional and responsible team specialized in the digital paper tablets industry, Bigme aims to deliver innovative electronic products that offer a pure, paper-like experience for people who pursue superior, eye-friendly, quality tablets. Bigme also cares greatly about the user experience and provides reliable after-sales service of all products!"

"Through everyone's effort, we made Bigme inkNote Color happen last year and achieved enormous success."

"This project is constructed and presented to you by OTO1 Crowdfunding Agency, the marketing expert who've helped make 250+ campaigns successful, risk-free."

"This project is promoted by Jellop, the ad tech power behind the best Kickstarter launches with 2,500+ successful Kickstarter projects and over $850M raised in total."

Source note: Raw Playwright text from campaign-2026-05-24T19-38-54.txt. The KS campaign body beyond the above was not rendered in the Playwright capture (video/image-heavy sections did not produce additional text blocks). press-sourced copy is in campaign-body.md and is NOT quoted here per verbatim-only rule.

**Risks & Challenges (verbatim):**

"With our years of experience with e-reading product development, our team is very confident with our product quality, user experience, and shipping schedule for Bigme Galy.
However, there might be some hidden obstacles and challenges during production. Because of that, we've made sure to account for some amount of unforeseen problems that may occur in our schedule. We are confident that our team is well-prepared to provide a carefree experience throughout the campaign.
The speed of shipping may vary from country to country especially under the worldwide pandemic outbreak. Our team will try our best to expedite the shipping and provide the best service for our backers after we reach our funding goal.
Please be aware that there may be extra customs fees due to the policy of different countries. Please check the local regulation of customs duties first. Backers need to take care of it by themselves.
If something goes wrong, we promise to keep our backers updated and informed about any issues and how we solve them. You can support us with confidence."

**FAQ (verbatim excerpts — key Q&As only):**

not found in accessible source — KS FAQ tab not rendered in Playwright capture; KS page 403'd on WebFetch.

**Reward tiers (verbatim):**

- Bigme Galy SEB: $489 (HK$3,833) (cap: 100; 80 backers, 20 left) — "Get your Bigme Galy and Stylus with LIMITED Super Early Bird special offer to revolutionize how you read ebooks in 2023 and beyond! *Shipping fees will be collected and charged through the post-campaign survey." Includes: Bigme Galy E Ink Tablet, Smart Pen A5 (Stylus). Ships: Anywhere in the world. | Est. delivery: Feb 2023
- Bigme Galy EB: $539 (HK$4,224) (cap: 600; 482 backers, 118 left) — "Get your Bigme Galy and Stylus with LIMITED Early Bird special offer to enjoy reading ebook in full color especially for comics and manga! *Shipping fees will be collected and charged through the post-campaign survey." Includes: Bigme Galy E Ink Tablet, Smart Pen A5 (Stylus). Ships: Anywhere in the world. | Est. delivery: Feb 2023
- Bigme Galy KS Special: $599 (HK$4,695) (no cap stated; 10 backers) — "Get your Bigme Galy and Stylus with KS Special offer to experience the world's first innovative E INK Gallery 3 display with the most colors and eye-safe reading. *Shipping fees will be collected and charged through the post-campaign survey." Includes: Bigme Galy E Ink Tablet, Smart Pen A5 (Stylus). Ships: Anywhere in the world. | Est. delivery: Feb 2023
- 2x Bigme Galy Early Bird: $978 (HK$7,665) (cap: 100; 86 backers, 14 left) — "Get one for yourself and one for your loved one to boost your productivity and efficiency and free your imagination with the Bigme Galy Combo Pack. *Shipping fees will be collected and charged through the post-campaign survey." Includes: 2x Bigme Galy E Ink Tablet, 2x Smart Pen A5 (Stylus). Ships: Anywhere in the world. | Est. delivery: Feb 2023
- 2x Bigme Galy KS Special: $1,078 (HK$8,449) (no cap stated; 8 backers) — "Experience the E Ink tablet with colorful possibility and get your Bigme Galy Combo Pack with KS Double Special offer! *Shipping fees will be collected and charged through the post-campaign survey." Includes: 2x Bigme Galy E Ink Tablet, 2x Smart Pen A5 (Stylus). Ships: Anywhere in the world. | Est. delivery: Feb 2023

**Meta/FB ads (from adlibrary):**

none found in adlibrary — bigme-galy_adv.txt: active_ad_count: 0, "No ads match your search criteria."

---

### Hemingwrite (Kickstarter, 2014)

**Hero headline:** "Hemingwrite - A Distraction Free Smart Typewriter"

**Subhead / tagline:** "The Hemingwrite is a distraction free writing tool with modern technology including a mechanical keyboard, e-paper screen and cloud backups."

**Story copy (verbatim, in section order):**

[Opening / Why]

"The Hemingwrite is a distraction-free writing tool. It combines the simplicity of a typewriter with all of the modern conveniences of living in 2014: cloud documents, e-paper display, and full-size mechanical keyboard."

"The Hemingwrite is the Kindle of writing composition."

"Laptops and iPads are multi-purpose devices loaded with games, social media, work email, funny cat videos, and those birthday photos you still need to edit. Like many of you, when we tried to get down to writing, we quickly found ourselves down a YouTube rabbit hole which we rationalized to ourselves as research. Sound familiar? Don't worry, you are not alone!"

"As our computers and phones get more powerful, we become less productive."

"This is why we built the Hemingwrite, a single-function alternative."

"The Hemingwrite combines the best features of all previous writing tools with the addition of modern technology. It is dedicated like a typewriter, has a better keyboard and battery life than your computer and is distraction free like a word processor. Finally, we sync your documents to the cloud in real-time so you never have to worry about saving, syncing or backing up your work."

"Turn off your phone and laptop, grab your Hemingwrite, and find your typing space."

Professional quality hardware

"We think a dedicated tool should be as durable as it can be! For this reason, we chose to use only the best components for our first product. The Hemingwrite is rugged enough to join you wherever you find your muse -- on the road, at the cabin, or at the pub."

"It features a daylight readable, high contrast electronic paper screen for writing indoors, outdoors, in the daytime or at night. (Good luck trying to write on the beach with a high-gloss LCD!)"

"The Hemingwrite features a 4+ week battery life with typical usage. Can your laptop do that?"

"We have included the highest quality mechanical keyboard switches for the happiest fingers – remember those old keyboards with great tactile feedback? This is like that but better."

"It is all wrapped in a beautiful, lightweight aluminum housing with built-in handle."

Pledge your support

"We need your help! Pledge now to push the project into production to receive one of the following awesome perks:"

Holiday Shoppers

"Want to buy a Hemingwrite as a gift for the holidays? We are offering a Secret Santa opportunity for backers that pledge early. While we are not shipping the Hemingwrite until 2015, we want to give you something special for this holiday season. Complete the optional $5 purchase here and we'll send you a small souvenir to keep for yourself or give as a gift to tide over the recipient until the Hemingwrite starts shipping next year. (Order must be received by December 19 11:59am EST, Domestic US purchasers only.)"

Your New Writing Routine

"The Hemingwrite fits into a routine that many writers find critical to their workflow: separate drafting and editing sessions. First, you draft, going from start to finish. Then, you review and make edits later."

"Decouple the first draft from the edited second, third, fourth, and beyond."

"You can backspace and review your work with page up/page down, but there is no copying and paste. The intent is to force you to just keep going! If you aren't happy with what you just wrote, you can write it again -- just like everyone had to before 1979 (and the debut of WordStar)."

"Fortunately, the addition of cloud syncing to the Hemingwrite enables you to move from composition to editing with ease. After you have finished your first draft, simply open up your computer and all of your work is automagically synced. Begin revisions in your favorite editor of choice, whether that is Microsoft Word, Evernote, or Google Docs."

Super simple software

"There are no settings menus, popup notifications, or toolbars on the device. As soon as you turn it on, it is ready to go. It is just you and a clean slate. Just start writing! The Hemingwrite works right out of the box with no manual required."

"We included only the essential features needed for drafting and excluded everything else. Wherever possible, we tried to emulate the simpler writing experience of a typewriter and stayed away from the excesses of modern word processing software."

"There is no mysterious user interface to learn before you can start writing on your new tool."

Core Features

"Instant On – The Hemingwrite is on in a flash and instantly ready to go. You don't have to open writing software or close distracting apps. Sit down and just start typing."

"Folder Navigation – Work on three active documents at one time. Folders are chosen quickly and easily using the left selector knob. Pickup exactly where you left off."

"Page up, page down – Review your previous work easily with dedicated page up and page down buttons. The status screen shows you exactly where you are in your documents. Simply start typing again to continue from where you left off."

"Status bars – A choice of status bars can be cycled through with a dedicated keyboard key to provide you with additional feedback about your work. Show your word and character count or start up a basic timer. Blank is also an option for even fewer distractions."

"Quick wifi for cloud documents – Connecting to a new wifi network is very simple. The right selector knob has three positions to control the wifi radio: OFF, ON, and NEW. Move the selector knob to 'NEW' to have the Hemingwrite scan for available networks. Pick one and put in the password to connect. Once you are connected, move the knob back to 'ON' and you will start syncing. Move the knob to 'OFF' to turn off the wifi and save battery. Don't worry, all of you work is saved locally to the machine and will automatically be pushed to the cloud the next time you are connected."

Rock solid back-end

"The cloud-connected Hemingwrite saves all of your documents effortlessly and automatically to our online web application, Postbox. From Postbox, you can setup your Hemingwrite to automatically sync your documents to any of the productivity applications you are already using like Dropbox, Evernote, and Google Docs."

Postbox: type at home, work in the cloud

"Write your first draft on the Hemingwrite, then shift to your desktop or laptop for final editing: your document is automatically downloaded for a seamless transition."

"Our core offering includes document storage integrations for Dropbox, Google Docs, Evernote, iCloud, OneDrive, ownCloud, and SpiderOak. You decide where you want your documents saved."

Printing

"The Hemingwrite includes a dedicated Send key right on the keyboard."

"Print jobs are simultaneously emailed to you as a PDF attachment (useful for quickly sharing drafts with writing peers!) and queued for printing in your account on Postbox. After a one-time setup, your printer is linked to your digital Postbox account to receive print jobs and process them whenever your Hemingwrite is connected to the internet!"

"We expect it to be useful for quickly printing drafts that can be edited in paper form (with your new commemorative Lamy Safari fountain pen perk!)."

And more!

"By connecting the Hemingwrite to the internet via Postbox, we are able to do powerful things like process markdown on the fly to convert plain text into a fully formatted document."

"We intend that the core integrations with Google Docs, Evernote, and others are only the beginning. Our software platform will be open and available for further development by the community of users."

"For web developers, Postbox provides a secure REST API for third-party applications to interact with your documents when permitted by you."

"And for software developers, we will be providing an open software development kit (SDK) to further customize the user experience of the Hemingwrite itself. We can't promise what future third-party plugins will be developed, but for those of you that require tighter Final Draft or Scrivener integration, the open platform can accommodate you. (we are also keen on seeing the first Vim environment!)"

International Buyers

"We have heard from so many of our friends from around the globe that we put a whole section here for international buyers. The first answer to your questions is yes, we will ship around the world! Additional postage will be required to cover the costs to get a Hemingwrite to you from the States and you will be responsible for any tariffs/duties from your country."

"The Hemingwrite will be available in an ISO keyboard layout that should be what you are accustom to on your home computer. You can select this option in the survey after the Kickstarter. The ISO layout has a larger Enter key and adds an extra key next to the left shift button."

"We will also provide keyboard mappings for as many languages as we can. This means you will be able to choose your language at time of setup and you will have all of the special letters and diacritics you need to type in your native language. Need an umlaut (ö) or a tilde (ñ), no problem!"

Stretch Goal 1 ($300k) - additional language support

"We already promised keyboard language support for English, German, Italian, Portuguese, Spanish, French, and Turkish. However, we left some important ones out! For our first stretch goal at $300,000, we will support the following additional languages: Danish, Korean, Swedish, Chinese, Russian, Hebrew, Japanese, Greek, Dutch"

Our Story

"We conceived the idea for the Hemingwrite in March of this year and quickly moved into development mode. What started as a side project for both of us has turned into our full-time focus. After quietly putting some renders online for a hardware contest, the world caught wind of the project and after thousands of emails, we felt compelled to get this product out into the world! It has been a complete whirlwind."

"We have been so humbled and surprised by the attention we've received to date for our unusual, single-purpose writing tool, and are ready for the next steps. We've pushed our prototypes as far as they can go -- and now we're asking you to help us kickstart the Hemingwrite!"

"Our funding goal of $250,000 will be used to cover the costs for refining our engineering for manufacturing and fixed costs to get us into production. Funds exceeding our goal will go toward making the Hemingwrite even better with expanded software to accommodate more third-party tools like Final Draft and Scrivener. Everything will be relayed to our backers regularly so that you stay in the loop throughout the process."

Team

"Adam Leeb – Mechanical Designer – Adam is a graduate of MIT with a degree in mechanical engineering and a focus on product design. His experience is diverse across design, finance and entrepeneurship. He is a constant tinkerer and loves to develop unique consumer products."

"Patrick Paul – Software Developer – Patrick is a Michigan State graduate and full-stack software developer. He is the developer for the on-board software as well as the Postbox web application. He has also worked professionally in international development and rooftop solar."

"We have come far with our efforts but it hasn't been without help! We are very thankful for the myriad of contributors that have provided support during the prototyping phase of this project."

"To push the Hemingwrite into production, we have lined a up a leading manufacturing group with decades of experience getting products to market to work with us. We will also tap other experts in specific fields to make sure we have the best possible product for you."

**Risks & Challenges (verbatim):**

"The beauty of the Hemingwrite is that it is not a complicated product by today's electronics standards. Unlike the latest laptop or fitness wearable, we are not trying to create the fastest, slimmest, lightest, most powerful product in the world. However, there are some risks and challenges associated with creating anything that backers should be aware of:

Fulfillment – Mail gets lost, trucks crash, ships lose cargo and people make mistakes. Logistical errors happen and can result in delays or extra expense.

Supply chain – There are limited sources of electronic paper screens and mechanical keyboard switches. While we have already established relationships with these vendors, there could be unforeseen circumstances that prevent us from getting the specific technology we want into the product.

Design – sometimes we dreamed too big and the design needs to change. We are admittedly still early in the manufacturing process and the design will certainly be tweaked as we go. However, we will attempt to keep it as similar to the prototypes as possible."

**FAQ (verbatim excerpts — key Q&As only):**

not found in accessible source — KS FAQ tab not rendered in Playwright capture; page 403'd on direct WebFetch.

**Reward tiers (verbatim):**

- $5 tier: $5 (no cap) — "For $5 and up, you will receive our eternal gratitude and an invitation to participate in our product features questionnaire via email. You will also be kept in the loop on all future product announcements including presales and limited edition releases." | Est. delivery: Jan 2015
- $25 tier: $25 (no cap) — "Hemingwrite T-Shirt - Simple and comfortable. Not plaid. You can let us know your size in the post-kickstarter survey" Ships: Anywhere in the world. | Est. delivery: Feb 2015
- $45 tier: $45 (no cap; 1 backer) — "Backspace Key Sabotage Kit - Want the discipline of a typewriter on a computer or word processor you already own? Eliminate premature editing by eliminating your backspace key! Enjoy (or hate) the practice of thinking through your entire sentence before committing words to screen. Kit includes: Key remover and hammer. We are not responsible for damaged computer hardware or bludgeoned fingers. Please use safety glasses and common sense when breaking stuff." Ships: Only certain countries. | Est. delivery: Sep 2015
- $125 tier: $125 (no cap; 4 backers) — "Writer's Block + Custom Lamy Safari Fountain Pen (Red) - We'll ship you your very own Writer's Block for use as a paperweight or a refrigerator magnet, and you can amuse all your friends and guests with your newest pun. You'll also get a custom red Lamy Safari fountain pen for all your editing needs." Ships: Anywhere in the world. | Est. delivery: Aug 2015
- Hemingwrite (crazy early): $349 (cap: quantity sold out — none left; 25 backers) — "Receive 1 Hemingwrite at the absolute best price. Act quick before they are gone." Ships: Anywhere in the world. | Est. delivery: Sep 2015
- Hemingwrite (early bird): $369 (cap: 500; 498 backers, 2 left) — "Receive 1 Hemingwrite at $130 off of the retail price." Ships: Anywhere in the world. | Est. delivery: Sep 2015
- Hemingwrite (LATE early bird): $369 (cap: 100; 100 backers — none left) — "We have extended Early Bird pricing for another 100 units to push us past our goal! Get them quick!" Ships: Anywhere in the world. | Est. delivery: Sep 2015
- Hemingwrite (regular bird): $399 (no cap; 117 backers) — "Receive your Hemingwrite at a deep discount to the retail price." Ships: Anywhere in the world. | Est. delivery: Sep 2015
- Hemingwrite + Beta Testing group + SDK/API: $499 (cap: 100; 44 backers, 56 left) — "Recieve a Hemingwrite and become part of our exclusive beta testing group with early access to test units and our SDK. You Hemingwrite will be shipped first!" Ships: Anywhere in the world. | Est. delivery: Aug 2015
- 2 Hemingwrites: $749 (no cap; 17 backers) — "Buy two for twice the fun." Ships: Anywhere in the world. | Est. delivery: Sep 2015
- 4 Hemingwrites: $1,450 (no cap; 4 backers) — "Get one for the whole family!" Ships: Anywhere in the world. | Est. delivery: Sep 2015
- Custom Color Hemingwrite: $1,500 (cap: 50; 0 backers) — "Pick your color, any color. We will paint your Hemingwrite in any color you want. Send us a paint chip and we will match it. The finish will be show quality. (Shipping included)" Ships: Anywhere in the world. | Est. delivery: Sep 2015
- Super Custom Hemingwrite: $5,000 (cap: 10; 0 backers) — "We will customize your Hemingwrite to your exact specs (within reason). Choose any housing finishing including paint or plating. You can also customize the keycaps to be whatever you want. Want a chrome plated Hemingwrite with black keys, no problem! Go even further with more customization. Our team will work with you to develop something truly unique. (Shipping Included)" Ships: Anywhere in the world. | Est. delivery: Sep 2015
- $10,000 tier: $10,000 (cap: 1; 0 backers) — "Mind blowing, singularity inducing, perk of incredible value. Details to be announced soon!" Ships: Anywhere in the world. | Est. delivery: Sep 2015

**Meta/FB ads (from adlibrary):**

none found in adlibrary — freewrite-smart_adv.txt: resolved_advertiser: NONE, active_ad_count: n/a. freewrite-smart-typewriter_adv.txt: resolved_advertiser: NONE, active_ad_count: n/a.

---

### Freewrite Traveler (Indiegogo, 2018)

**Hero headline:** "Traveler: The Ultimate Distraction-Free Writing Tool"

**Subhead / tagline:** "Set your story free, whenever and wherever inspiration strikes"

**Story copy (verbatim, in section order):**

Source note: IGG campaign page BLOCKED (React SPA, 403). The Playwright raw (campaign-2026-05-24T19-38-57.txt) returned the generic Indiegogo homepage, not the Traveler campaign. All verbatim extracts below are from campaign-body.md, which sourced them from press articles and creator-adjacent URLs published Oct–Nov 2018. Direct IGG body text was not retrievable.

Problem Frame

"modern devices like laptops and cell phones are multipurpose tools that make it exceedingly difficult to focus on the simple task of writing"

"a single interruption can cause a 25-minute delay to return to the original task"

"There's no email, no social media, no games, no alerts or notifications, no video streaming, and no apps."

Social Proof from Previous Product

"Over 45 million words have been written on Freewrites to date including several published books and screenplays."

"writers who use Freewrite see their hourly word output double"

Portability / Design

"A featherweight device that's half the size of a laptop"

"a sleek, low-profile" exterior

"The original Freewrite weighed four pounds, while the Traveler weighs in at 1.8 pounds"

Flow State Copy

"when writers can write unencumbered, they enter into a flow state in which their productivity and creativity peak"

"Everything about the Traveler has been meticulously designed to be the perfect tool for the modern writer."

**Risks & Challenges (verbatim):**

"not found in accessible source — IGG page blocked. Section not reproduced in any press article reviewed."

**FAQ (verbatim excerpts — key Q&As only):**

not found in accessible source — IGG page blocked. No FAQ content reproduced in press coverage.

**Reward tiers (verbatim):**

Note: IGG page blocked; tier names are press-assigned labels, not IGG verbatim tier names. Verbatim tier descriptions not recoverable.

- Super Early Bird: $269 (sold out quickly per Liliputing Oct 2 2018) — 1x Freewrite Traveler | Est. delivery: June 2019
- Standard Pre-order / Next Early Bird: $309 (available after $269 tier sold out, per Liliputing, The Next Web Oct 2 2018) — 1x Freewrite Traveler | Est. delivery: June 2019
- General Pledge: $329 — "45% cheaper than its retail price which will be $599" (verbatim from campaign copy as reported by Ubergizmo Oct 3 2018) — 1x Freewrite Traveler | Est. delivery: June 2019
- 2-Pack: $558 (per Liliputing Oct 2 2018) — 2x Freewrite Traveler ($279/unit) | Est. delivery: June 2019
- Traveler + Freewrite Smart Typewriter bundle: $728 (per Liliputing Oct 2 2018) — 1x Freewrite Traveler + 1x Freewrite Smart Typewriter | Est. delivery: June 2019

**Meta/FB ads (from adlibrary):**

none found in adlibrary for Traveler specifically.

- freewrite_adv.txt: resolved_advertiser: NONE, active_ad_count: n/a — no ads returned.
- freewrite-final_adv.txt: pageId 911139335596993 matched (Freewrite / @getfreewrite, 16.2K followers) but active_ad_count: n/a, ads dump empty — no active ads returned.
- freewrite-tightq_adv.txt (query: "Freewrite Traveler"): resolved_advertiser: NONE — no ads returned.
- freewrite-alpha_adv.txt (query: "Freewrite Alpha"): resolved_advertiser: NONE — no ads returned.
# Section E — Verbatim Copy Vault (Group 4)

Campaigns: Modos Paper Monitor, Dasung Not-eReader 7.8", EeWrite E-Pad

---

### Modos Paper Monitor (Crowd Supply, 2025)

**Hero headline:** "Modos Paper Monitor"
**Subhead / tagline:** "A fast, low-latency, open-hardware e-paper monitor and dev kit"

**Story copy (verbatim, in section order):**

Lead description
"Modos Paper Dev Kit includes nearly everything you need to create an open-hardware e-paper monitor with a fast 75 Hz refresh rate, low latency, various screen-update configurations, multiple image modes, and flexible dithering options. It can be connected through HDMI or USB, and it works on Linux, macOS, and Windows. We are offering 6-inch and 13-inch monochrome kits, both powered by the same display controller, which can also be used with other panels."

At the Cutting Edge of E-Paper
"Twenty years ago, the release of the first e-paper devices marked a significant milestone in display technology, giving rise to e-readers and digital signage. Electrophoretic displays stand out for their unique qualities: they are easy on the eyes, mimic the aesthetics of paper, conserve power when idle, and offer high contrast with wide viewing angles even in direct sunlight.

In recent years, improvements in e-paper technology have expanded its applications beyond traditional e-readers. Despite these advancements, however, key challenges still hold back widespread adoption of e-paper devices:

Proprietary Hardware and Software: Most e-paper devices operate on closed, proprietary systems.
Lack of Standards: There is a shortage of best practices and guidelines for designing user interfaces optimized for e-paper.
High Costs: The expense of e-paper panels limits experimentation and broader adoption.

We built the Modos Developer Kit to allow engineers, product designers, programmers, and enthusiasts to re-purpose e-paper screens in creative ways. We're also building a community that's committed to establishing the standards, best practices, and guidelines needed to realize the full potential of e-paper technology. Join us on Discord and by following us on Mastodon, Bluesky, Matrix, and Twitter."

High Refresh Rate
"Our Developer Kit leverages Caster, an open-source FPGA-based electrophoretic display controller engineered for low-latency performance and capable of driving e-paper screens at up to 60 Hz. By dividing the screen into multiple update regions, the Caster processes and displays new images or text instantly, without waiting for previous updates to complete. Each pixel is managed independently, and early cancellation techniques ensure that pixels update as soon as new data is available. The result is smooth, responsive performance with high frame rates and superior contrast, ideal for dynamic content and fluid interactions."

Compatible With a Variety of Screens
"Got a spare e-paper screen gathering dust or looking to re-purpose a display for your project? Our Developer Kit makes it simple. Compatible with a wide range of screens—from 6-inch up to 13.3-inch, in both monochrome and color—the kit lets you easily connect and reuse unused displays. With our monitor enclosure design files, you can build a custom monitor housing that perfectly fits your project's needs.

Explore our GitHub repository for a complete list of compatible screens."

Reuse. Experiment. Create.
"Every kit includes the Glider Mega Adapter, giving you out-of-the-box support for a wide range of e-paper panels. With one adapter set, you can connect displays from 4.3" up to 13.3". The Glider Mega Adapter includes support for the following (which is not a comprehensive list, as some panels are untested but expected to work):

39-pin 0.3mm pitch: Certain 4.3", 5", and 13.3" screens (ED043WC1, ED043WC3, ED050SU3, ES133UTx, ED133UTx, EC133UJ1)
33-pin 0.5mm pitch: Most 9.7" screens (ED097OCx, ED097ODx, ED097TCx)
0.5mm pitch, 7.8"–10.3" screens: (ED078KCx, ED078KHx, EC078KHx, ED080TC1, EC080SC2, ED100UC1, ES103TCx, ED103TCx)
34-pin 0.5mm pitch: Most 6.0" screens (ED060SCF, ED060SCP, ED060XC3/C5/C8/C9/CG/D4/D6/G1/H2, ED060KC1/C4/D1/G1, etc.)
50-pin 0.5mm pitch: Most 11.3" screens (ED113TCx)

With these adapters, anyone interested in working with e-paper has much more flexibility to experiment by reusing e-paper panels from existing devices as well as trying out new ones."

User-Defined Modes & API
"While commercial e-paper products rely on preset driving strategies (text, graphics, video modes) to cope with the technology's limitations, our Developer Kit goes further. It offers full customization so you can tailor the display experience to your specific needs.

For example, the Hybrid Greyscale Mode allows the Caster to switch between a fast binary mode for quick updates and a slower, detailed greyscale mode for refined rendering. This minimizes latency and visual flashing by updating in binary first, then refining in greyscale as the image stabilizes.

With our C API, you gain direct control over screen and mode selection, letting you optimize the display for a wide range of applications. Our broader vision includes developing native e-paper applications and a protocol for seamless mode transitions based on content type."

Manufacturing Plan
"The Modos Developer Kit has passed pre-production revisions and undergone thorough validation and testing. We have established partnerships with contract manufacturers in China, our chosen partner will handle board manufacturing and assembly. The panels are sourced directly from E Ink Corporation. With the Caster completed and the design finalized, we now have a full Bill of Materials (BOM) and supplier quotes in place as we prepare for production. Once the campaign concludes, manufacturing will commence, and we'll keep you updated via campaign emails."

Fulfillment & Logistics
"After our production run is finished, we will package everything and send it to Crowd Supply's fulfillment partner, Mouser Electronics, for distribution to backers worldwide. For more details about Crowd Supply's fulfillment service, please refer to their guide under Ordering, Paying, and Shipping."

Support & Documentation
"The Modos Developer Kit is open hardwayore built using open-source software, with all design files and source code available on GitHub. Our documentation offers extensive information on electrophoretic displays, drawing from both public sources and our original research. This serves as a comprehensive guide for anyone looking to dive deeper into e-paper technology.

For additional support or to join the discussion, please visit Discord and follow us on Mastodon, Bluesky, Matrix, and Twitter."

Thank You to the NLnet Foundation and the NGI Zero Entrust Fund
"Our team would like to acknowledge partial funding for development of Caster from the NGI0 Entrust Fund, a fund established by NLnet with financial support from the European Commission's Next Generation Internet program."

"Modos Paper Monitor is part of AMD FPGA Playground"

**Risks & Challenges (verbatim):**
"The development of the Modos Developer Kit has been ongoing for over a year. Throughout this time, the core functionalities of our display controller board have proven stable, allowing us to focus on refining the hardware design and solving engineering challenges. We are confident in the robustness of our final product.

That said, as with any hardware project, the production process and supply-chain management present inherent risks. To mitigate these risks, we have built strong partnerships with our suppliers and manufacturers. In the event of any setbacks, we are committed to minimizing delays and will keep our backers informed with transparent, timely updates throughout the process."

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source

**Reward tiers (verbatim):**
- 6" Modos Paper Dev Kit: $199 (no cap stated) — "Pre-assembled development kit for the 6-inch version of our low-latency, 1448 x 1072 e-paper display. Includes a screen, a mainboard, a ribbon cable, and a Glider Mega Adapter to support e-paper panels of various sizes. Comes with a USB Type-C cable." | Est. delivery: May 29, 2026
- 13" Modos Paper Dev Kit: $599 (no cap stated) — "Pre-assembled development kit for the 13-inch version of our low-latency, 1600 x 1200 e-paper display. Includes a screen, a mainboard, a ribbon cable, and a Glider Mega Adapter to support e-paper panels of various sizes. Comes with a USB Type-C cable." | Est. delivery: May 29, 2026

**Meta/FB ads (from adlibrary):**
none found in adlibrary

---

### Dasung Not-eReader 7.8" (Indiegogo, 2018)

**Hero headline:** "Not-eReader: First E-ink Mobile-Phone Monitor by DASUNG"
**Subhead / tagline:** "the world's first E Ink mobile-phone monitor and PC monitor"

**Story copy (verbatim, in section order):**

Note: IGG campaign page returned HTTP 404 (deleted). All copy below is sourced verbatim from contemporaneous press coverage (Geeky Gadgets, Liliputing, The eBook Reader, Good e-Reader) citing the live campaign page. Direct campaign body text was not rendered (React SPA, JS-gated) and Wayback Machine was blocked in this environment.

Eye-strain hook (Geeky Gadgets citing campaign copy):
"90 percent of people experience eye discomfort when staring at LCD displays for more than 3 hours."

5-in-1 device pitch (Liliputing citing campaign copy):
"It can be used as an ereader (despite the name suggesting the contrary), a tablet, a video player, a PC monitor, and a mobile phone monitor."

Open Android platform pitch (Geeky Gadgets citing campaign copy):
"ran an open Android platform, allowing users to install standard applications like Twitter and Facebook"

**Risks & Challenges (verbatim):**
"not found in accessible source — IGG page 404; no press coverage quoted verbatim from Risks & Challenges section"

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source — IGG page 404; no press coverage quoted verbatim from FAQ section

**Reward tiers (verbatim):**
Note: IGG page 404; tier copy reconstructed verbatim from contemporaneous press coverage (Liliputing, The eBook Reader, Oct 2018).
- Early Bird: $369 (cap not found) — Dasung Not-eReader 7.8" device; 26% off retail | Est. delivery: March 2019
- Standard Backer: $439 (cap not found) — Dasung Not-eReader 7.8" device; 12% off retail | Est. delivery: March 2019

**Meta/FB ads (from adlibrary):**
none found in adlibrary

---

### EeWrite E-Pad (Kickstarter, 2019)

**Hero headline:** "E-PAD, The E-Ink Android Tablet"
**Subhead / tagline:** "10.3'' Carta Screen, Android 8.0, 4G Network. E-Pad is the best companion for reading, writing, sketching, browsing news and emails."

**Story copy (verbatim, in section order):**

Designed For: Student | Professional | Sketch Artist | Manga Fan | Book Enthusiast | Architect

"No matter how advanced mobile phones become, they still can't compete with plain old paper for reading and handwriting. The E-Pad is an Android Tablet that aims to bridge the gap by offering digital convenience with a truly paper-like experience."

"E-Pad makes note taking and reading a pleasure. It mimics the experience of reading and writing on paper. Jotting down notes, signing papers or making notations on documents is smooth and natural using the included stylus or simply a finger."

"But E-Pad is more than just a powerful notepad and digital reader. It supports Wi-Fi and is also 4G compatible which lets you stay connected virtually anywhere. It is equipped with the advanced Android system, allowing you to download all your favorite apps. And with a 10-core processor, it has low latency and the power to run the latest apps and quickly browse image heavy news and websites."

4G Network | Bluetooth | Android System | 10 Core Processor | Wi-Fi | Dual Touch Control | 32GB + Storage | 10.3'' Carta | Front Light Supported | Video-Play Supported

All Formats Supported | Powerful Reading System | 10.3" Mobius Carta Screen
"E-Pad with a 10.3" Carta screen is perfect for reading any type of document and kinds of literature. E-Ink display reflects light like real paper, letting you read for hours without eyes fatigue."

All Formats Supported | Read without limitation
"E-Pad is designed as the perfect document viewer with full compatibility with all common file formats including: pdf, djvu, epub, mobi, doc, docm, docx, azw, azw3, fb2, fbz, html, odt, prc, rtf, sxw, trc, txt, chm.

It also has support for image and audio formats: jpg, png, bmp, tiff, cbr, cbz, mp3, wav, that are common on news sites, blogs and other websites."

Powerful Reading System | Have your books & marks organized
"When you read with E-Pad, you'll find this reading system is incredibly convenient and make your life more efficient. You can save or screenshot any annotations for capture ideas while on-the-go and search any handwriting notes or typed texts to avoid you got messy in the bulk notes. Besides, allowing you to adjust page arrangement and screen contrast, E-Pad will meet your reading preference."

10.3" Mobius Carta Screen | Bigger screen, Higher resolution
"The Carta display is designed to closely mimic the appearance of real paper, including surface friction when writing. The screen uses the latest E-Ink technology – a based TFT that is flexible, lightweight and durable. This new E-Ink display has incredible high definition and optimum contrast that reflects light like real paper, letting you read for hours without eye strain."

New Writing Experience | Handwriting Search & Store | Sketching Your Brilliant Artwork
"E-Pad gives you an authentic pen-to-paper note-taking experience, the surface tension is similar to real paper and with its convenient digital features it will totally replace your notebooks, printouts, and documents. This groundbreaking device changes how people work."

New Writing Experience | No need for pen and paper anymore
"Enjoy unlimited annotation and document mark-up on any file. You can make notes as easily as a paper notepad. Enjoy the efficiency of instant notes for work, school or creativity."

Handwriting Search & Store | Never lose your idea again
"E-Pad can convert your handwritten note to typed text, making the notes easy to refine and share. No matter whether your notes are diagrams, formulas or simply words, they can be transferred quickly."

"Search, sync and share any notes for your work, study or entertainment, all your files are always handy. All notes can be searched, you will never lose your ideas-including the ones you write down by hand. Everything you put in the third party/PC is automatically synced across your E-Pad."

Sketching Your Brilliant Artwork | Digitalize all your sketches
"E-Pad stylus pen responds to the pressure of your hand precisely, the stroke widens as you press more firmly. It will give you superior control to create very artistic images and text, just like you would on a sheet of paper."

"E-Pad allows you to use various pages formats while you are taking notes, you can even insert an image and polish it."

4G Network, Keep Connected | The world's first E-Ink tablet with 4G connectivity
"Other E-Readers and E-Ink tablets lack support for SIM cards or cellular data, leaving you limited by Wi-Fi only network connections. That makes them impractical for work, travel, or study on the go. With E-Pad, you can enjoy high speed 4G data connectivity and stay connected anytime and anywhere. Your work, study, email or reading can continue as you move from home, to school or office. Simply insert a SIM card and you've got data anywhere. E-Pad is fast, friendly and efficient."

Best Company For Writer | Support Bluetooth keyboard/earbuds/speaker
"If you do any serious business or schoolwork on your phone or tablet, you know that typing on a screen can be a bit frustrating. E-Pad adds convenience and enhanced typing capabilities with support for Bluetooth keyboards. Connect seamlessly and type faster and more comfortably."

Android 8.0 | Allows you to download apps from Google play store
"Using the E-Pad as a tablet is simple through full support of Google's Play framework, including the Google Play store. This means that you can install virtually any Android application. Android system also offers better compatibility for third-party applications. You can download apps according to your personal needs and make E-Pad your personalized tablet!"

Ten-Core Processor with 2GB RAM | Faster running speed
"Push the performance envelope with a powerful 10-core processor and 2 GB of random access memory to handle large documents and memory heavy apps. The speedy processor means that websites and programs load fast and smooth. Enjoy reading, writing, news and surfing with ease on the E-Pad.

When documents get large and more storage is desired, you can easily add up to 32 GB of memory with TF card support. Download and store large books or collections without worry."

More Than 20 Days of Standby Time
"E-Pad is designed for active lifestyles and is made to go anywhere you go. A full battery charge will result in about 1 week of use or 4 weeks of standby time."

Dual Touch Control System
"E-Pad has Dual Touch technology that helps you manage your E-Pad with ease and convenience. Use your finger with capacitive touch for quick notes or sketching or use the included Wacom stylus for writing, document mark-up or detailed drawing. The smooth action of the screen makes writing effortless no matter which method you prefer."

Stylus Pen with Eraser
"The advanced Wacom stylus makes writing simple and precise. Write, draw or sketch and if you make a mistake don't worry, the stylus has an erasure feature built in that works just like a pencil eraser. Simply turn over the stylus and correct your work."

**Risks & Challenges (verbatim):**
"With our years of experience in paper tablet research and development, we are very confident with our process and production schedule for E-Pad.

However, we also know that hidden obstacles and challenges often occur. Because of that, we've made sure to account for some amount of craziness or unforeseen problems that may occur in our schedule. If something does go wrong, we promise to keep our backers updated and communicate with them honestly about any issues and the way in which we are solving them.

Any pledge amount brings us one step closer to our goal. Help us bring this product to life by clicking the 'Back This Project' button at the top of the page, or by helping us spread the word by sharing our page."

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source — KS FAQ page returned 403 Forbidden

**Reward tiers (verbatim):**
- $1 Thank you!: $1 (no cap) — "Thanks for the support and love for E-pad! We will include you in the newsletter of our VIP club!" | Est. delivery: Aug 2019
- $5 I was there on day one!: $5 (no cap) — "Let the world know you showed your support right on the first day. If you like, we'd love to include your Name among the pioneers in a special section of our website." | Est. delivery: Aug 2019
- Super Early Bird | E-Pad: $399 (cap: 200, 3 left at capture) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 43% OFF our retail value of $699! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad | Est. delivery: Aug 2019
- Super Early Bird Stylus Pack: $424 (cap: 50, 1 left at capture) — "Get your E-Pads and Stylus with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$15 for one E-Pad Case" — Includes: E-Pad, Stylus | Est. delivery: Aug 2019
- Super Early Bird Combo Pack: $434 (cap: 50, 1 left at capture) — "Get your E-Pads Combo Pack with a great price to experience the paper tablet and no eye strain reading." — Includes: E-Pad, Stylus, E-Pad Case | Est. delivery: Aug 2019
- Early Bird | E-Pad: $449 (cap: 500, 477 left at capture) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 36% OFF our retail value of $699! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad | Est. delivery: Aug 2019
- Early Bird Stylus Pack: $474 (cap: 100, 68 left at capture) — "Get your E-Pad and Stylus with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$15 for one E-Pad Case" — Includes: E-Pad, Stylus | Est. delivery: Aug 2019
- Super Early Bird Upgrade Pack: $479 (cap: 200, sold out at capture) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 4GB RAM + 64GB Storgae Upgrade Pack Now is Coming! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad (4GB RAM+64GB Storage) | Est. delivery: Aug 2019
- Early Bird Combo Pack: $484 (cap: 100, 3 left at capture) — "Get your E-Pad Combo Pack with a great price to experience the paper tablet and no eye strain reading." — Includes: E-Pad, Stylus, E-Pad Case | Est. delivery: Aug 2019
- Kickstarter Special Price | E-Pad: $499 (no cap) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 29% OFF our retail value of $699! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad | Est. delivery: Aug 2019
- [New Reward]-38% OFF E-Pad Special Kit: $499 (no cap, 48-hour flash) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 38% OFF our retail value of $699! Only Last for 48 HOURS! From April 9 8:00 AM PDT to April 11 8:00 AM PDT. E-Pad Special Kit Including: Upgraded E-Pad*1 Stylus*1 E-Pad Case*1" — Includes: E-Pad (4GB RAM+64GB Storage), Stylus, E-Pad Case | Est. delivery: Aug 2019
- Super Early Bird - E-Pad Duo: $798 (cap: 50, 35 left at capture) — "Get two E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 2x E-Pad | Est. delivery: Aug 2019
- Early Bird - E-Pad Duo: $898 (cap: 100, 99 left at capture) — "Get two E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 2x E-Pad | Est. delivery: Aug 2019
- E-Pad Triple Pack: $1,197 (no cap) — "Get three E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 3x E-Pad | Est. delivery: Aug 2019
- E-Pad Family Pack: $1,995 (no cap) — "Get five E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 5x E-Pad | Est. delivery: Aug 2019

**Meta/FB ads (from adlibrary):**
none found in adlibrary
# Section E: Campaign Copy Blocks — Skim Campaigns (Group 5)

compiled: 2026-05-24
campaigns: Bluegen OKPad, Freewrite Alpha, Bigme inkNote Color, Mudita Kompakt, Pomera DM250US, BLOOMIN8 EinkCanvas

---

### Bluegen OKPad (KS, 2024) — SKIM

**Hero headline:** "not found"
**Subhead / tagline:** "not found"

**Known story copy (verbatim, from press/adlibrary):**
"not recovered — skim campaign, no corpus directory"

**Reward tiers (from roster):**
- Raised ~$119k (HK$931,695) / goal HK$39.5k / 2,359% funded
- 436 backers
- Shipped (delays reported on BackerKit)

**Meta/FB ads (from adlibrary):**
File `bluegen_adv.txt` exists. Resolved advertiser: Blue Genie Art Bazaar (pageID 85556303424) — wrong entity, no relation to Bluegen OKPad. Active ad count: 0. No OKPad campaign ads found in Meta Ad Library.

---

### Freewrite Alpha (IGG, 2022) — SKIM

**Hero headline:** "not found"
**Subhead / tagline:** "not found"

**Known story copy (verbatim, from press/adlibrary):**
"not recovered — skim campaign, no corpus directory"

**Reward tiers (from roster):**
- Raised $451,810 / goal $25,000 / ~1,800% funded
- 1,275 backers
- Shipped

**Meta/FB ads (from adlibrary):**
File `freewrite-alpha_adv.txt` exists. Resolved advertiser: NONE (no typeahead match, no page identified). Active ad count: n/a. No ads recovered.

---

### Bigme inkNote Color (KS, 2022) — SKIM

**Hero headline:** "not found"
**Subhead / tagline:** "not found"

**Known story copy (verbatim, from press/adlibrary):**
"not recovered — skim campaign, no corpus directory"

**Reward tiers (from roster):**
- Raised ~$624k (HK$4.87M) / goal HK$785k / 620% funded
- 1,187 backers
- Shipped

**Meta/FB ads (from adlibrary):**
File `bigme-galy_adv.txt` exists (for Bigme Galy page, pageID 102763479301850). Active ad count: 0. Note: this file covers the Galy campaign page, not inkNote Color; the two are separate KS campaigns.

File `Bigme_adv.txt` also checked (Bigme eInk Tablet page, pageID 108495751929413). Active ad count: 0 — "No ads match your search criteria."

`Bigme.txt` keyword search file also checked (~190 results). All results are for an unrelated Indian wellness brand ("BIGME" period/hangover patches at bigme.in) and third-party retailer pages. No ads for the 2022 KS inkNote Color campaign found in any file.

---

### Mudita Kompakt (KS then IGG, 2024) — SKIM

**Hero headline:** "not found"
**Subhead / tagline:** "not found"

**Known story copy (verbatim, from press/adlibrary):**
"not recovered — skim campaign, no corpus directory"

**Reward tiers (from roster):**
- Raised ~$503k (EUR 466,191) / goal EUR 150k / 311% funded
- 1,389 backers
- Shipping (Apr-May 2025)

**Meta/FB ads (from adlibrary):**
File `mudita-kompakt_adv.txt` exists. Resolved advertiser: NONE. Active ad count: n/a. No ads recovered.

File `mudita_adv.txt` also checked (brand query: "We Are Mudita"). Resolved advertiser: NONE. Typeahead returned Mudita (@wearemudita, 11.1K followers, pageID 357682101356773) but score was too low (15.0) for resolution. No ads dump present. No Mudita Kompakt ads found in Meta Ad Library.

---

### Pomera DM250US (IGG, 2025) — SKIM

**Hero headline:** "not found"
**Subhead / tagline:** "not found"

**Known story copy (verbatim, from press/adlibrary):**
"not recovered — skim campaign, no corpus directory"

**Reward tiers (from roster):**
- Raised $85,333 / goal $10,000 / 853% funded
- Backers: not found in roster
- Shipped Mar 2025

**Meta/FB ads (from adlibrary):**
No adlibrary file found matching `pomera*`. No ads recovered.

---

### BLOOMIN8 EinkCanvas (KS, 2024-25) — SKIM

**Hero headline:** "not found"
**Subhead / tagline:** "not found"

**Known story copy (verbatim, from press/adlibrary):**
"not recovered — skim campaign, no corpus directory"

**Reward tiers (from roster):**
- Raised $1,530,000 / goal not found in roster (implied ~$19k at 7,991%) / 7,991% funded
- 3,000+ backers
- Shipping / fulfilling

**Meta/FB ads (from adlibrary):**
No adlibrary file found matching `bloomin*` or `bloom*`. No ads recovered.
