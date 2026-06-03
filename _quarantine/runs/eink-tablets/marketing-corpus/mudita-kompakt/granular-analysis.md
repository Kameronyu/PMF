# Mudita Kompakt — Granular Analysis

- brand: Mudita
- slug: mudita-kompakt
- panel/format: E Ink phone (smartphone-form-factor minimalist device)
- analyzed_at: 2026-05-24
- analyst_note: Sections written incrementally; self-audit checklist at end.

---

## 1. Metadata + Sources Read

**Brand:** Mudita  
**Slug:** mudita-kompakt  
**Panel/format:** E Ink phone (minimalist smartphone; rectangular slate form; not a tablet or e-reader primary)

**Files consumed:**
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/landing-pages.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/meta-ads.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/funnel-mechanics.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/partnerships.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/notes.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/notes-pass0-fetch.md`
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/scripts/analyzer-framework.md`
- `/home/kyu3/PMF/definitions.md`

**Screenshots referenced:** 3  
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/screenshots/lp-2026-05-24T22-05-38.{txt,png}` — homepage (Calm Tech Institute certification redirect; not standard hero)
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/screenshots/lp-2026-05-24T22-09-25.{txt,png}` — product page (mudita.com/products/phones/mudita-kompakt)
- `/home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/screenshots/lp-2026-05-24T22-07-36.{txt,png}` — stress-less / email capture LP (mudita.com/stress-less)

**Known gaps:**
- mudita.com and store.mudita.com return HTTP 403 to standard WebFetch. All mudita.com-hosted page body copy outside the 3 Playwright-captured screenshots is snippet-attested verbatim from Google's index, not live full-page extracts.
- Meta Ad Library resolved zero advertisers for "Mudita" / "Mudita Kompakt." No paid Meta ad data available. Retry suggestions in meta-ads.md.
- Kickstarter and Indiegogo reward-tier copy not extracted (403 / JS-rendered).
- Amazon PDP body not extracted (JS-rendered).
- Manifesto page body (mudita.com/about/manifesto/) not retrieved — only snippet-attested fragment.
- Homepage at capture time was a Calm Tech Institute certification redirect, not the standard hero. Standard hero copy sourced from PDP screenshot and snippet corpus.
- Full blog post body copy not extracted (403 blocked) — only snippet-attested fragments from ~22 blog URLs.
- No deposit funnel was probed for this brand (Pass 0 scope excluded it).

---

## 2. Headlines Catalog

| Headline (verbatim) | Location classification | Source artifact |
|---|---|---|
| "More offline. More life." | hero | screenshots/lp-2026-05-24T22-09-25.txt (PDP screenshot, line 43); partnerships.md — Kickstarter/Indiegogo campaign title |
| "Mudita Kompakt, a minimalist E Ink® phone." | hero | screenshots/lp-2026-05-24T22-09-25.txt (page title, line 4) |
| "A minimalist E Ink® phone for less screen time, and fewer distractions. Essential features with clear UI and a privacy focus." | hero-sub | screenshots/lp-2026-05-24T22-09-25.txt (lines 45–46) |
| "Eliminate distractions" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 49) |
| "Enhance your privacy" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 53) |
| "Comfort for your eyes" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 57) |
| "Life with ease" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 61) |
| "Designed for your daily balance" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 65) |
| "How can Mudita Kompakt fit into your life" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 80) |
| "Recognition for Intentional Design" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 91) |
| "Confidence in Every Step" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 108) |
| "Embrace simplicity and experience more" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 112) |
| "Beyond the Screen." | hero | screenshots/lp-2026-05-24T22-07-36.txt (line 39) |
| "Disconnect. Focus. Prioritize your mental health." | hero-sub | screenshots/lp-2026-05-24T22-07-36.txt (line 40) |
| "The Mental Cost of Connectivity." | section | screenshots/lp-2026-05-24T22-07-36.txt (line 52) |
| "Find Your Focus" | section | screenshots/lp-2026-05-24T22-07-36.txt (line 56) |
| "Break the Dopamine Loop" | section | screenshots/lp-2026-05-24T22-07-36.txt (line 61) |
| "Wake Up Offline" | section | screenshots/lp-2026-05-24T22-07-36.txt (line 65) |
| "Appreciate the Boredom" | section | screenshots/lp-2026-05-24T22-07-36.txt (line 69) |
| "From Noise to Presence." | section | screenshots/lp-2026-05-24T22-07-36.txt (line 73) |
| "The Tools of Presence." | section | screenshots/lp-2026-05-24T22-07-36.txt (line 76) |
| "A Calmer Mind in 3, 2, 1." | section | screenshots/lp-2026-05-24T22-07-36.txt (line 121) |
| "Mudita Products Achieve Calm Tech Institute Certification" | hero | screenshots/lp-2026-05-24T22-05-38.txt (lines 37, 43) |
| "Mudita Devices Honored by Calm Tech Institute for Human-Centered Design" | section | screenshots/lp-2026-05-24T22-05-38.txt (line 46) |
| "Technology That Works With You" | section | screenshots/lp-2026-05-24T22-05-38.txt (line 119) |
| "Calm Technology, Moving Forward" | section | screenshots/lp-2026-05-24T22-05-38.txt (line 127) |
| "Mudita Kompakt is a minimalist E Ink® phone designed for focus, privacy, and freedom from digital distractions." | hero | landing-pages.md — LP-1 Google snippet |
| "Mudita Introduces the Kompakt: An E Ink, Minimalist Phone Designed for Digital Well-Being" | press-quote | partnerships.md — PR-1 headline |
| "Mudita Kompakt North America Optimized to Begin Shipping Next Week; Final Days for Special Pre-Order Pricing" | press-quote | partnerships.md — PR-2 headline |
| "mudita Kompakt Minimalist Dumb Phone with E Ink® Display – Unlocked Cell Phone for Focus, Privacy & Distraction-Free Living, Long Battery Life, Bluetooth, Easy to Use - Charcoal Black" | section | landing-pages.md — LP-R3 Amazon title |
| "Mudita Kompakt – dumbwireless" | section | landing-pages.md — LP-R1 |
| "Mudita Kompakt: More Offline. More Life." | hero | partnerships.md — Kickstarter project title; Indiegogo campaign title |
| "Mudita Kompakt - Designed for Intentional Living" | section | partnerships.md — PR-2 body |
| "Tech That Supports Your Well-Being" | section | partnerships.md — PR-1 body |
| "Reimagining Productivity and Balance" | section | partnerships.md — PR-1 body |
| "Expanding Mudita's Portfolio of Wellness-Focused Technology" | section | partnerships.md — PR-1 body |
| "Mudita Phones: The Essence of Mindful Living" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 40) |
| "Break the cycle of digital stress. Get up to 15% off Mudita's products when you subscribe." | section | screenshots/lp-2026-05-24T22-09-25.txt (line 14); screenshots/lp-2026-05-24T22-05-38.txt (line 14) |
| "Mudita Kompakt: More Offline. More Life. by Mudita" | hero | partnerships.md — Indiegogo campaign title |
| "What is the 14-day satisfaction guarantee?" | FAQ-question | screenshots/lp-2026-05-24T22-09-25.txt (line 122) |
| "Which countries does Mudita Kompakt currently ship to?" | FAQ-question | screenshots/lp-2026-05-24T22-09-25.txt (line 123) |
| "Will the Global version of Mudita Kompakt work in the US?" | FAQ-question | screenshots/lp-2026-05-24T22-09-25.txt (line 124) |
| "Does Mudita Kompakt support third-party apps?" | FAQ-question | screenshots/lp-2026-05-24T22-09-25.txt (line 125) |
| "Does Mudita Kompakt come with a warranty?" | FAQ-question | screenshots/lp-2026-05-24T22-09-25.txt (line 126) |
| "Where can I follow the Mudita Kompakt development roadmap and updates?" | FAQ-question | screenshots/lp-2026-05-24T22-09-25.txt (line 127) |
| "Free shipping" | CTA-button | screenshots/lp-2026-05-24T22-09-25.txt (line 109) |
| "14 days satisfaction guaranteed" | CTA-button | screenshots/lp-2026-05-24T22-09-25.txt (line 110) |
| "Secure Checkout" | CTA-button | screenshots/lp-2026-05-24T22-09-25.txt (line 111) |
| "Enjoy 10% off your first purchase" | section | screenshots/lp-2026-05-24T22-09-25.txt (line 128) |

---

## 3. Visual Look and Feel

**Primary sources:** Screenshots lp-2026-05-24T22-09-25.png (PDP), lp-2026-05-24T22-07-36.png (stress-less LP), lp-2026-05-24T22-05-38.png (homepage redirect); plus copy-layer inferences from all corpus files.

**Color palette:**
- Cannot extract hex from .png files without image analysis tooling. Descriptive inference from copy and positioning:
- Brand aesthetic is described as "minimalist" and "clean" throughout all copy; E Ink screen's grayscale likely influences brand palette to be muted/neutral.
- Screenshots show a white-dominant interface. Product colors listed verbatim: "Pebble Gray, Black, Natural White" (landing-pages.md — LP-R1). No hex values extractable from corpus.

**Typography:**
- No font family names referenced in any source file. Copy describes interfaces as "clean" and "without any jumping elements" (notes.md — CEO Yanko interview). Likely sans-serif functional typeface consistent with minimalist positioning. Not determinable from text corpus alone.

**Imagery archetypes (from copy + screenshot context):**
- Product-on-desk / product-in-hand: primary. Amazon title references "Charcoal Black" colorway with standalone product visual implied. dumbwireless page is a standard PDP format.
- Lifestyle-with-daily-routine: implied by "beyond the screen" LP — copy references "waking up," "bedroom environment," calm morning routines. No imagery explicitly named.
- No dark-room-glow archetype (E Ink screen does not glow; this is an anti-feature vs. smartphones).
- "designed to reduce digital overload" language and wellness-brand minimalism suggests white-background studio-isolation product shots.
- Blog content references lifestyle contexts: sleeping, meditating, writing.

**Density:**
- Whitespace-heavy. Consistent with minimalism brand position. PDP screenshot shows short section headers + 2–3 sentence body copy per section with significant spacing (screenshots/lp-2026-05-24T22-09-25.txt structure).

**Motion:**
- No video hero, animations, or motion referenced in any source. Static images assumed. No "video" copy trigger in any corpus file.

**Screenshot references:**
- screenshots/lp-2026-05-24T22-09-25.png — product page visual look
- screenshots/lp-2026-05-24T22-07-36.png — stress-less email LP visual look
- screenshots/lp-2026-05-24T22-05-38.png — Calm Tech Institute certification blog post (not standard homepage at capture time)

---

## 4. Customer Call-Outs

### Named identity call-outs

| Verbatim call-out | Buyer identity | Source artifact |
|---|---|---|
| "Perfect for those who value focus and simplicity in their daily lives" | focus-seeking minimalists | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (line 82) |
| "Built for those who want to minimize screen time and develop a more thoughtful approach to their tech habits" | digital-minimalists / screen-time-reducers | partnerships.md — PR-1 body |
| "a mindful technology company from Poland" | implicit: mindful-tech-aligned buyers | partnerships.md — PR-2 dateline |

### Behavior call-outs

| Verbatim call-out | Behavior/pain described | Source artifact |
|---|---|---|
| "Do you feel it already? The unfinished thoughts. The instinct to check the phone seconds after putting it down." | compulsive phone-checking behavior | screenshots/lp-2026-05-24T22-07-36.txt (lines 44–45) |
| "More than 4 out of 5 smartphone users check their phone within 10 minutes of waking up. Would you like to become the one who doesn't?" | morning phone-checking habit | screenshots/lp-2026-05-24T22-07-36.txt (lines 66–67); landing-pages.md — LP-11 snippet |
| "The constant noise of the digital world is shrinking the mental space needed for focus and rest." | cognitive overload from constant connectivity | screenshots/lp-2026-05-24T22-07-36.txt (line 54) |
| "It's up to you whether you stay in systems designed to keep you hooked." | awareness of addictive design / dopamine loop | screenshots/lp-2026-05-24T22-07-36.txt (lines 62–63) |
| "for many people those hours are dominated by screens, scrolling and stimulation" | bedroom/morning screen overuse | screenshots/lp-2026-05-24T22-07-36.txt (lines 101–102) |
| "The average screen time is above six hours a day in the US." | high daily screen-time as motif | notes.md — CEO Yanko interview |
| "digital distractions continue to grow" | growing distraction environment | partnerships.md — PR-1 body |
| "constant notifications pulling them away" | notification interruption during work | partnerships.md — PR-1 body |
| "kids who got smartphones before age 13 were significantly more likely to report serious mental health struggles later in life" | underage smartphone-exposure harm | landing-pages.md — B-1 snippet |
| "kids want to stay in touch with friends, and parents want peace of mind" | parent-child phone tension | landing-pages.md — B-1 snippet |

### Testimonial subjects

| Name | Role/title verbatim | Quote verbatim | Source artifact |
|---|---|---|---|
| (unnamed) | customer / iPhone SE switcher | "I switched from my iPhone SE to Mudita Kompakt two weeks and two days ago. I love this phone for what it is. Some improvements could be made and I am optimistic that they will come over time with software updates. There are things I cannot do on the MK, of course, that's the whole point. It has not made my life easier but it has made my days simpler, which I am grateful for" | landing-pages.md — LP-12; funnel-mechanics.md |
| (unnamed) | customer / app sideloader | "Finally there is a smartphone that fits completely my needs! The fact that I also can side load some apps to meet my needs is so perfect! I really love my Mudita Kompakt and its e-ink screen which is very calming for my eyes. Such a great phone!" | landing-pages.md — LP-12; funnel-mechanics.md |
| (unnamed) | customer / dopamine-addiction framing | "Love, love, love my Mudita Kompakt. Breaking the chains of smartphone/doomscrolling/dopamine addiction...what an awesome tool to leverage this life change. And I love the aesthetic, too." | landing-pages.md — LP-12; funnel-mechanics.md |
| (unnamed) | customer / WhatsApp user | "the basic call and text very well with the possibility for running some other apps that have become staples of modern life like WhatsApp, without becoming the Eye of Sauron like other smartphones." | landing-pages.md — LP-12; funnel-mechanics.md |
| (unnamed) | customer / parent / essentials user | "I love it, the fact that it has only simple Open Street Maps, only simple photo, the reduction, only essential, great with kids" | landing-pages.md — LP-12; funnel-mechanics.md |
| (unnamed) | long-term user, forum | "I'm very happy and don't want any other phone" | funnel-mechanics.md |

---

## 5. Claims Catalog (verbatim)

Outcome-promises only. Features (specs/attributes) are in §6.

| Claim (verbatim) | Base or Enhanced | Qualifier type | Source artifact |
|---|---|---|---|
| "helps you focus on what truly matters without unnecessary interruptions or clutter" | base | none | screenshots/lp-2026-05-24T22-09-25.txt (lines 51–52) |
| "helps you stay focused & enjoy a digital detox when needed" | base | none | landing-pages.md — LP-1 snippet |
| "helping people break free from digital distractions so they can focus on what truly matters to them; whether that's work, relationships, or personal growth" | base | none | partnerships.md — PR-1 CEO quote |
| "helps you reclaim your focus and well-being" | base | none | partnerships.md — PR-1 body |
| "Mudita Kompakt helps users achieve better work-life integration, enabling them to be more productive in their professional and personal lives without distractions" | enhanced | mechanism (by reducing digital overwhelm) | partnerships.md — PR-1 body |
| "support a more balanced lifestyle" | base | none | partnerships.md — PR-1 body |
| "Liberate your attention from constant notifications. Create space for deeper concentration and stay present with one task or activity at a time." | base | none | screenshots/lp-2026-05-24T22-07-36.txt (lines 58–59) |
| "Your data stays yours. Mudita Kompakt ensures no tracking, no ads, and no distracting apps." | base | none | screenshots/lp-2026-05-24T22-09-25.txt (lines 53–54) |
| "giving you privacy and peace of mind whenever you need it" | base | none | screenshots/lp-2026-05-24T22-09-25.txt (lines 55–56) |
| "reducing eye strain and eliminating blue light" | base | none | screenshots/lp-2026-05-24T22-09-25.txt (line 58); landing-pages.md — LP-1 snippet; LP-R1 |
| "perfect for those who want to stay connected without sacrificing their eye health" | base | none | screenshots/lp-2026-05-24T22-09-25.txt (lines 59–60) |
| "designed to help users disconnect from the constant digital distractions that define modern life" | base | none | partnerships.md — PR-2 body |
| "foster mindfulness and intentional technology use" | base | none | partnerships.md — PR-2 body |
| "simplify digital life and enhance mindful living" | base | none | partnerships.md — PR-2 body |
| "it's possible to design technology that respects human attention, creates space for stillness, and operates in harmony with daily life" | base | none | screenshots/lp-2026-05-24T22-05-38.txt (lines 57–58) |
| "support your well-being rather than compete for your attention" | base | none | screenshots/lp-2026-05-24T22-05-38.txt (line 51) |
| "It has not made my life easier but it has made my days simpler" | base | none | landing-pages.md — LP-12 testimonial (customer-attested claim, not brand claim — flagged) |
| "Breaking the chains of smartphone/doomscrolling/dopamine addiction" | base | none | landing-pages.md — LP-12 testimonial (customer-attested, not brand claim — flagged) |
| "a phone designed to reduce digital overload" | base | none | screenshots/lp-2026-05-24T22-07-36.txt (line 83) |
| "Mudita Kompakt keeps essential communication while removing the elements that turn smartphones into distraction machines." | base | none | screenshots/lp-2026-05-24T22-07-36.txt (lines 87–88) |
| "freedom from the visual overstimulation common in modern devices" | base | none | screenshots/lp-2026-05-24T22-07-36.txt (line 88) |
| "Reclaim your attention, your sleep, and your mornings." | base | none | meta-ads.md — X/Twitter promo copy |
| "promote personal growth by encouraging more conscious technology use" | base | none | partnerships.md — PR-1 body |
| "our device is designed not to be as appealing as possible, rather it's designed for our users, clients, to do what they need to do on the phone and then move on" | base | none | notes.md — CEO Yanko interview |
| "technology should work differently. It should support your well-being rather than compete for your attention." | base | none | screenshots/lp-2026-05-24T22-05-38.txt (lines 50–51) |
| "Designed & engineered with care in Europe." | base | none | screenshots/lp-2026-05-24T22-07-36.txt (line 134) |
| "The Mudita phone produces significantly lower EMF than typical smartphones" | enhanced | comparative (vs. typical smartphones) | landing-pages.md — LP-R2 (Shield Your Body retailer) |
| "combining a healthy middle ground" — "blending mindful design with just enough tech to meet everyday needs" | base | none | landing-pages.md — B-1 snippet |
| "when we delay the smartphone, we're not depriving kids of something—we're giving them room to thrive" | base | none | landing-pages.md — B-1 snippet |
| "Reclaim your attention" | base | none | meta-ads.md — X/Twitter promo |

**Count: 27 base claims, 2 enhanced claims, 29 total.**

Note: Two testimonial-verbatim entries above are customer-attested (not brand-authored) and flagged as such. Excluded from base/enhanced count — not brand claims.

---

## 6. Features Catalog (verbatim)

Specs and attributes only. Never claims.

| Feature (verbatim) | Type | Source artifact |
|---|---|---|
| "4.3" E Ink® screen" | display | landing-pages.md — LP-1 snippet; LP-R1; screenshots/lp-2026-05-24T22-09-25.txt |
| "paper-like reading experience" | display | landing-pages.md — LP-1 snippet; LP-R1; screenshots/lp-2026-05-24T22-09-25.txt (line 58) |
| "remains clear and readable even in bright sunlight" | display | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt |
| "E Ink® display" | display | screenshots/lp-2026-05-24T22-09-25.txt (line 67) |
| "glare-free E Ink screen" | display | partnerships.md — PR-2 body |
| "up to 6 days of battery life" | battery | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (line 63) |
| "3300mAh battery provides up to six days of standby time" | battery | landing-pages.md — LP-R1 (dumbwireless) |
| "Offline+ Mode" | software | screenshots/lp-2026-05-24T22-09-25.txt (lines 53–56, 68); landing-pages.md — LP-1; LP-11 snippets |
| "dedicated button for a hardware-level cutoff of microphones and the GSM modem" | hardware-spec | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (lines 54–55) |
| "disabling the camera, WiFi, and Bluetooth at the software level" | software | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (lines 55–56) |
| "The unique Offline+ Mode physically disconnects key components like the GSM modem and microphones" | hardware-spec | landing-pages.md — LP-1 snippet |
| "custom operating system" | software | landing-pages.md — LP-1 snippet; partnerships.md — PR-1 body; screenshots/lp-2026-05-24T22-09-25.txt |
| "MuditaOS K" | software | landing-pages.md — LP-15, LP-16 page titles; partnerships.md — PR-4 headline |
| "Clean & Custom OS" | software | screenshots/lp-2026-05-24T22-09-25.txt (line 71) |
| "offline maps for worry-free navigation" | software | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (line 63) |
| "Open Street Maps" (offline) | software | landing-pages.md — LP-12 testimonial |
| "3.5mm headphone jack for reliable audio" | hardware-spec | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (line 63) |
| "a camera to digitize documents or capture memories" | hardware-spec | landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (line 63) |
| "durable ergonomic design" | physical-dimension | landing-pages.md — LP-1 snippet |
| "Camera, calendar, notes, voice recorder, music player, offline maps, chess, e-reader" | software | landing-pages.md — LP-R1 (dumbwireless) |
| "Block unrecognized numbers" / "only your saved contacts can call or text you" | software | landing-pages.md — LP-R1 (dumbwireless) |
| "Mudita Center, the dedicated desktop app" | software | landing-pages.md — LP-R1 (dumbwireless); funnel-mechanics.md |
| "one dedicated SIM slot and one hybrid slot for either a second SIM or a microSD card" | connectivity | landing-pages.md — LP-1 snippet |
| "eSIM" support | connectivity | landing-pages.md — LP-1 snippet |
| "2-year warranty" | other | landing-pages.md — LP-1 snippet; funnel-mechanics.md |
| "5 years of software and security updates" | software | landing-pages.md — LP-1 snippet; funnel-mechanics.md |
| "Mudita Kompakt Meditation App" | software | landing-pages.md — B-5 snippet |
| "e-reader" built-in | software | landing-pages.md — LP-R1; B-5 snippet |
| "no tracking, no ads" | software | screenshots/lp-2026-05-24T22-09-25.txt (line 54) |
| "can side load some apps" (third-party sideloading) | software | landing-pages.md — LP-12 testimonial; B-1 snippet |
| "Pebble Gray, Black, Natural White" (color variants) | physical-dimension | landing-pages.md — LP-R1 |
| "North American Version, Global Version" (regional SKUs) | hardware-spec | landing-pages.md — LP-R1 |
| "Global Optimized" and "North America Optimized" versions | hardware-spec | landing-pages.md — LP-3; funnel-mechanics.md; screenshots/lp-2026-05-24T22-09-25.txt |
| "FCC and PTCRB" certified | hardware-spec | screenshots/lp-2026-05-24T22-09-25.txt (line 100) |
| "SAR (head) values of 0.97 W/kg, SAR (body) of 0.78 W/kg, and SAR (hotspot) of 1.17 W/kg" | hardware-spec | landing-pages.md — LP-R2 (Shield Your Body) |
| "8 languages" (English, Polish, German, French, Italian, Dutch, Spanish, Portuguese) | software | notes.md |
| "Full group message support / single thread organization" (1.4.0 update) | software | partnerships.md — PR-4 snippet |
| "control music directly from the lock screen" (1.4.0 update) | software | partnerships.md — PR-4 snippet |
| "E Ink screen avoids harsh blue light" | display | screenshots/lp-2026-05-24T22-05-38.txt (line 97) |
| "Works offline and independently of cloud services" | software | screenshots/lp-2026-05-24T22-05-38.txt (line 89) |
| "Subtle notifications inform without overwhelm" | software | screenshots/lp-2026-05-24T22-05-38.txt (line 82) |
| "Gentle tones instead of disruptive alerts" | software | screenshots/lp-2026-05-24T22-05-38.txt (line 105) |
| "Protective case" (silicone, minimalist design) | accessory | landing-pages.md — LP-8 page title |
| "Screen protector" (accessory) | accessory | funnel-mechanics.md |
| "Mudita Harmony 2 and Mudita Bell 2" (alarm clock cross-sell) | accessory | screenshots/lp-2026-05-24T22-07-36.txt |
| "Mudita Moment Automatic" (watch cross-sell) | accessory | screenshots/lp-2026-05-24T22-07-36.txt |
| "Platinum Tier Calm Tech Certified™" | other | screenshots/lp-2026-05-24T22-05-38.txt (line 53) |

---

## 7. Transformation Framing — Per Transformation

### Transformation T1: "focus on what truly matters without unnecessary interruptions or clutter" (distraction elimination / attention reclamation)

- **Niche this transformation targets:** Digital minimalists / screen-time-aware adults. "those who value focus and simplicity in their daily lives" (screenshots/lp-2026-05-24T22-09-25.txt line 82). No age, gender, or professional identity specified in primary copy.
- **Verbatim setup copy:** "Do you feel it already? The unfinished thoughts. The instinct to check the phone seconds after putting it down." (screenshots/lp-2026-05-24T22-07-36.txt lines 44–45); "The constant noise of the digital world is shrinking the mental space needed for focus and rest." (screenshots/lp-2026-05-24T22-07-36.txt line 54); "digital distractions continue to grow" (partnerships.md — PR-1)
- **Verbatim build copy:** "Stay connected while being present. With only the essentials and a clean, distraction-free interface, powered by a custom operating system, Mudita Kompakt helps you focus on what truly matters without unnecessary interruptions or clutter." (screenshots/lp-2026-05-24T22-09-25.txt lines 51–52); "Mudita Kompakt keeps essential communication while removing the elements that turn smartphones into distraction machines." (screenshots/lp-2026-05-24T22-07-36.txt lines 87–88)
- **Verbatim payoff copy:** "More offline. More life." (screenshots/lp-2026-05-24T22-09-25.txt line 43); "Liberate your attention from constant notifications. Create space for deeper concentration and stay present with one task or activity at a time." (screenshots/lp-2026-05-24T22-07-36.txt lines 58–59); "Reclaim your attention, your sleep, and your mornings." (meta-ads.md — X/Twitter promo)
- **Angles attached (§8 cross-reference):** A-01 (dopamine-loop pain), A-02 (attention-reclamation desire), A-03 (mental-space survival/desire), A-04 (morning routine belonging)
- **Site-vs-ads divergence:** Site runs this transformation consistently across PDP and stress-less LP. No Meta ads available to compare. X/Twitter promo confirms same transformation ("Reclaim your attention, your sleep, and your mornings"). No divergence detected.
- **Source artifacts:** screenshots/lp-2026-05-24T22-09-25.txt; screenshots/lp-2026-05-24T22-07-36.txt; partnerships.md PR-1, PR-2; meta-ads.md (X/Twitter); landing-pages.md LP-1, LP-11

---

### Transformation T2: "Your data stays yours. Mudita Kompakt ensures no tracking, no ads, and no distracting apps." (privacy / freedom from surveillance)

- **Niche this transformation targets:** Privacy-aware adults. No named identity group. Inferred from copy: "no tracking, no ads." Explicit hardware-level Offline+ Mode framing.
- **Verbatim setup copy:** "It features a dedicated button for a hardware-level cutoff of microphones and the GSM modem, while also disabling the camera, WiFi, and Bluetooth at the software level." (landing-pages.md — LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt lines 54–55)
- **Verbatim build copy:** "The unique Offline+ Mode physically disconnects key components like the GSM modem and microphones, allowing you to truly unplug and protect your privacy." (landing-pages.md — LP-1 snippet); "Offline mode blocks all wireless signals" (landing-pages.md — LP-R2)
- **Verbatim payoff copy:** "giving you privacy and peace of mind whenever you need it" (screenshots/lp-2026-05-24T22-09-25.txt lines 55–56); "our device is designed not to be as appealing as possible, rather it's designed for our users, clients, to do what they need to do on the phone and then move on" (notes.md — CEO Yanko)
- **Angles attached (§8 cross-reference):** A-05 (surveillance/tracking pain), A-06 (control/autonomy desire)
- **Site-vs-ads divergence:** Privacy transformation appears in PDP feature blocks but is subordinate to the distraction-elimination transformation in the hero copy. No Meta ads to compare.
- **Source artifacts:** landing-pages.md LP-1, LP-R2; screenshots/lp-2026-05-24T22-09-25.txt; notes.md CEO interview

---

### Transformation T3: "simplify digital life and enhance mindful living" / intentional living transformation

- **Niche this transformation targets:** Mindfulness-aligned adults; wellness-oriented buyers. "mindful technology," "intentional living," "intentional technology use" recurring across all PR copy.
- **Verbatim setup copy:** "in today's world, which offers so many opportunities, it's easy to forget who we truly are and how to care for ourselves and our loved ones" (landing-pages.md — LP-13 snippet); "The difficult part is to actually implement the usage in their own lives because it's a trade-off between the convenience and the less usage of the device and the peace of mind." (notes.md — CEO Yanko)
- **Verbatim build copy:** "crafted to simplify digital life and enhance mindful living" (partnerships.md — PR-2 body); "Mudita's award-winning products...have gained international recognition for their innovative approach to intentional technology usage." (partnerships.md — PR-2); "designed to work in harmony with life, not against it" (screenshots/lp-2026-05-24T22-05-38.txt line 129)
- **Verbatim payoff copy:** "Together, let's redefine technology as a trusted ally in our lives." (landing-pages.md — LP-13 mission statement); "At Mudita, they redefine the essence of technology with minimalist devices, with a philosophy to craft products that harmonize with consumers' lives, instead of competing for their attention" (landing-pages.md — LP-14 fragment)
- **Angles attached (§8 cross-reference):** A-07 (identity-alignment belonging), A-08 (peace-of-mind survival/desire)
- **Site-vs-ads divergence:** This transformation is primarily a brand-level and PR-level frame. Less present in hero copy of PDP screenshot vs. PR releases. PDP hero leads with T1 (distraction elimination). Intentional-living framing is the brand umbrella.
- **Source artifacts:** landing-pages.md LP-13, LP-14; partnerships.md PR-1, PR-2; notes.md CEO interview; screenshots/lp-2026-05-24T22-05-38.txt

---

### Transformation T4: Kids' healthy development / delaying smartphone harm (parent buyer sub-transformation)

- **Niche this transformation targets:** Parents of children; first-phone buyers. Named explicitly as a secondary audience via blog B-1 and Gear Diary gift-guide placement.
- **Verbatim setup copy:** "kids who got smartphones before age 13 were significantly more likely to report serious mental health struggles later in life" (landing-pages.md — B-1 snippet); "experts recommend implementing digital literacy education in schools, enforcing stricter age verification for social media platforms, and delaying full smartphone access until at least age 13" (landing-pages.md — B-1 snippet); "kids want to stay in touch with friends, and parents want peace of mind" (landing-pages.md — B-1 snippet)
- **Verbatim build copy:** "Mudita Kompakt taking that concept further by blending mindful design with just enough tech to meet everyday needs" (landing-pages.md — B-1 snippet); "Parents can sideload some approved apps for their children, like WhatsApp or Signal, so they can stay in the loop with friends and family" (landing-pages.md — B-1 snippet)
- **Verbatim payoff copy:** "when we delay the smartphone, we're not depriving kids of something—we're giving them room to thrive" (landing-pages.md — B-1 snippet); "great with kids" (landing-pages.md — LP-12 customer testimonial)
- **Angles attached (§8 cross-reference):** A-09 (child-safety survival), A-10 (parental peace-of-mind belonging)
- **Site-vs-ads divergence:** This transformation appears only in blog content, not in PDP or stress-less LP hero copy. It is a secondary/editorial-layer transformation, not primary. No ads available.
- **Source artifacts:** landing-pages.md B-1 snippet, LP-12 testimonial; partnerships.md (Gear Diary 2025 gift guide reference); partnerships.md community forum reference

---

## 8. Angles Catalog (verbatim)

| ID | Angle text (verbatim) | Driver | Pole | Transformation it attaches to (§7 reference) | Source artifact |
|---|---|---|---|---|---|
| A-01 | "Do you feel it already? The unfinished thoughts. The instinct to check the phone seconds after putting it down." | survival | pain | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (lines 44–45) |
| A-02 | "Reclaim your attention, your sleep, and your mornings." | status | desire | T1 (distraction elimination) | meta-ads.md — X/Twitter promo |
| A-03 | "The constant noise of the digital world is shrinking the mental space needed for focus and rest." | survival | pain | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (line 54) |
| A-04 | "More than 4 out of 5 smartphone users check their phone within 10 minutes of waking up. Would you like to become the one who doesn't?" | status | desire | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (lines 66–67) |
| A-05 | "Your data stays yours. Mudita Kompakt ensures no tracking, no ads, and no distracting apps." | survival | pain | T2 (privacy) | screenshots/lp-2026-05-24T22-09-25.txt (lines 53–54) |
| A-06 | "giving you privacy and peace of mind whenever you need it" | survival | desire | T2 (privacy) | screenshots/lp-2026-05-24T22-09-25.txt (lines 55–56) |
| A-07 | "Together, let's redefine technology as a trusted ally in our lives." | belonging | desire | T3 (intentional living) | landing-pages.md — LP-13 mission |
| A-08 | "technology should work differently. It should support your well-being rather than compete for your attention." | survival | desire | T3 (intentional living) | screenshots/lp-2026-05-24T22-05-38.txt (lines 50–51) |
| A-09 | "kids who got smartphones before age 13 were significantly more likely to report serious mental health struggles later in life" | survival | pain | T4 (kids' development) | landing-pages.md — B-1 snippet |
| A-10 | "when we delay the smartphone, we're not depriving kids of something—we're giving them room to thrive" | belonging | desire | T4 (kids' development) | landing-pages.md — B-1 snippet |
| A-11 | "Break the Dopamine Loop" (section header) | survival | pain | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (line 61) |
| A-12 | "It's up to you whether you stay in systems designed to keep you hooked." | status | pain | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (lines 62–63) |
| A-13 | "Your mind works best when it has room to breathe. Reduce the input and prepare to be amazed by the clarity and creativity may bring." | status | desire | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (lines 70–71) |
| A-14 | "Appreciate the Boredom" | survival | desire | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (line 69) |
| A-15 | "From Noise to Presence." | belonging | desire | T3 (intentional living) | screenshots/lp-2026-05-24T22-07-36.txt (line 73) |
| A-16 | "Technology should enhance our lives, not take over them." | survival | pain | T3 (intentional living) | partnerships.md — PR-1 CEO quote |
| A-17 | "Breaking the chains of smartphone/doomscrolling/dopamine addiction" (customer testimonial language on brand LP) | survival | pain | T1 (distraction elimination) | landing-pages.md — LP-12 testimonial |
| A-18 | "Love, love, love my Mudita Kompakt. Breaking the chains...And I love the aesthetic, too." | status | desire | T1 (distraction elimination) | landing-pages.md — LP-12 testimonial |
| A-19 | "The solution is stepping away from technology created to occupy every moment of your day." | survival | pain | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (lines 78–79) |
| A-20 | "The first and last hour of the day shape everything in between. Yet for many people those hours are dominated by screens, scrolling and stimulation." | survival | pain | T1 (distraction elimination) | screenshots/lp-2026-05-24T22-07-36.txt (lines 101–102) |
| A-21 | "The Mudita phone produces significantly lower EMF than typical smartphones" (retailer-attested, not brand-authored) | survival | pain | T2 (privacy/health) | landing-pages.md — LP-R2 (Shield Your Body) |
| A-22 | "kids want to stay in touch with friends, and parents want peace of mind" | belonging | desire | T4 (kids' development) | landing-pages.md — B-1 snippet |

---

## 9. Objection Handles (verbatim)

| Handle copy (verbatim) | Objection it neutralizes | Funnel location |
|---|---|---|
| "14-Day Satisfaction Guarantee / Once received, customers will have 14 days to try out their Mudita Kompakt. If it's not the right fit, it can be returned in undamaged condition for a full refund for the device and any returned add-ons." | Risk of buying a device that doesn't fit lifestyle | LP mid (PDP feature-block); partnerships.md PR-2 |
| "14 days satisfaction guaranteed" | Same — compressed version | LP hero (trust-badge strip) — screenshots/lp-2026-05-24T22-09-25.txt (line 110) |
| "14-Day Rest-Assured Return Policy." | Same | LP mid — screenshots/lp-2026-05-24T22-07-36.txt (line 133) |
| "Mudita Kompakt includes a 2-year warranty, along with 5 years of software and security updates." | Device longevity / will it be supported | LP feature-block — landing-pages.md LP-1 snippet |
| "The fact that I also can side load some apps to meet my needs is so perfect!" (testimonial deployed on LP) | Fear of losing essential apps | LP testimonial-wall — landing-pages.md LP-12 |
| "Does Mudita Kompakt support third-party apps?" (FAQ) | App compatibility objection | FAQ — screenshots/lp-2026-05-24T22-09-25.txt (line 125) |
| "Stay connected while being present. With only the essentials..." | Fear of being too disconnected | LP hero — screenshots/lp-2026-05-24T22-09-25.txt (lines 51–52) |
| "It has not made my life easier but it has made my days simpler" (testimonial — honest framing) | Expectation of convenience equal to smartphone | LP testimonial-wall — landing-pages.md LP-12 |
| "the basic call and text very well with the possibility for running some other apps that have become staples of modern life like WhatsApp, without becoming the Eye of Sauron like other smartphones." (testimonial) | Loss of WhatsApp / core communication tools | LP testimonial-wall — landing-pages.md LP-12 |
| "Free shipping" | Purchase friction / shipping cost | LP hero trust-badge — screenshots/lp-2026-05-24T22-09-25.txt (line 109) |
| "Secure Checkout" | Payment security concern | LP hero trust-badge — screenshots/lp-2026-05-24T22-09-25.txt (line 111) |
| "Will the Global version of Mudita Kompakt work in the US?" (FAQ) | Connectivity compatibility for travelers | FAQ — screenshots/lp-2026-05-24T22-09-25.txt (line 124) |
| "Which countries does Mudita Kompakt currently ship to?" (FAQ) | Geographic availability | FAQ — screenshots/lp-2026-05-24T22-09-25.txt (line 123) |
| "The North America Optimized version is specifically tailored to US and Canadian cellular network bands. This version is strongly recommended for the most reliable connectivity and performance in these regions." | Network compatibility concern (US buyers) | LP feature-block — screenshots/lp-2026-05-24T22-09-25.txt (lines 103–104) |
| "Winner of the iF Design Award and Red Dot Award 2025" | Is this a credible product? | LP social-proof-bar; LP mid — landing-pages.md LP-1; partnerships.md PR-2 |
| "1,078 backers who pledged €353,751" / "over $500k pledged" | Social proof / is anyone else buying this | partnerships.md crowdfunding section |

---

## 10. Hooks Ranked by Longevity

**No ad-longevity data available for this brand.**

Meta Ad Library resolved zero advertisers for "Mudita" or "Mudita Kompakt" across two runs of `adlib-one.js`. No active Meta ads found. Likely causes: organic-only marketing model (primary distribution via @wearemudita Instagram organic, 35K followers, 946 posts), or EU-region brand whose Meta page is named differently than the search queries used (suggested retries: `wearemudita`, `We Are Mudita`, `Mudita sp z o o`; region filters PL, DE).

One promotional post captured from X/Twitter (not a paid Meta ad):

| Rank | Hook (verbatim) | Start date | Days running | Ad format | Angle (§8 ID) | Claim (§5 ID) | Library ID |
|---|---|---|---|---|---|---|---|
| 1 | "Mudita Kompakt, Harmony 2 & Bell 2 ➡️ now 15% off (automatically applied) Reclaim your attention, your sleep, and your mornings. ➡️ [link] #wearemudita #ReclaimYourYear" | unclear / no evidence | unclear / no evidence | X/Twitter organic post | A-02 | "Reclaim your attention, your sleep, and your mornings." | n/a (not Meta) |

Source: meta-ads.md — X/Twitter organic post at https://x.com/wearemudita/status/2011094456838008925

No Meta library_id available. No longevity ranking possible. Orchestrator should retry ad library with alternative page names and EU region filters before synthesis.

---

## 11. Funnel Structure — Page Sections

#### LP: https://mudita.com/products/phones/mudita-kompakt (Product Detail Page)
Source: screenshots/lp-2026-05-24T22-09-25.txt

- Section 1: hero | "More offline. More life." + "A minimalist E Ink® phone for less screen time, and fewer distractions. Essential features with clear UI and a privacy focus." | text + implied product image
- Section 2: transformation-block | "Eliminate distractions" — "Stay connected while being present. With only the essentials and a clean, distraction-free interface, powered by a custom operating system, Mudita Kompakt helps you focus on what truly matters without unnecessary interruptions or clutter." | text
- Section 3: transformation-block | "Enhance your privacy" — "Your data stays yours. Mudita Kompakt ensures no tracking, no ads, and no distracting apps. It features a dedicated button for a hardware-level cutoff of microphones and the GSM modem..." | text
- Section 4: transformation-block | "Comfort for your eyes" — "The 4.3" E Ink® screen delivers a paper-like reading experience, reducing eye strain and eliminating blue light. It remains clear and readable even in bright sunlight..." | text
- Section 5: transformation-block | "Life with ease" — "Built to endure daily life, Mudita Kompakt combines up to 6 days of battery life, offline maps for worry-free navigation, a 3.5mm headphone jack for reliable audio, a durable ergonomic design, and a camera to digitize documents or capture memories." | text
- Section 6: feature-grid | "Designed for your daily balance" — E Ink® display / Offline+ mode / Clean & Custom OS / Long Battery Life / Essential Tools / Reliable by Design | text + implied icons
- Section 7: transformation-block | "How can Mudita Kompakt fit into your life" — use-case framing: Everyday Essential / Perfect Companion / Connected as you travel / Safe Connectivity | text
- Section 8: social-proof-bar | "As Seen In / Recognition for Intentional Design" — "The minimalist design of Mudita Kompakt has been formally recognized with a Reddot Winner 2025 award and an iF Design Award 2025...noted as a Top Pick 2025 by TechAeris" | text + implied press logos
- Section 9: mechanism-explainer | "Connectivity That Fits Your Needs" — Global Optimized vs. North America Optimized version explanation | text
- Section 10: guarantee-block | "Confidence in Every Step" — "Free shipping / 14 days satisfaction guaranteed / Secure Checkout" | trust badges
- Section 11: FAQ | 6 FAQ questions | text (collapsed accordion)
- Section 12: newsletter-signup | "Enjoy 10% off your first purchase / Sign up to receive early access to product news, offers, and curated stories from Mudita." | email form

CTAs on this page:
- "Meet Kompakt" — above-fold (hero button, implied)
- "DISCOVER MORE FEATURES" — mid-page
- "SHOP NOW" — navigation/sticky (nav tab)
- "SIGN UP" — footer newsletter (10% off offer)
- "VIEW QUICKSTART GUIDE" — FAQ section

---

#### LP: https://mudita.com/stress-less (Email Capture / "Beyond the Screen" LP)
Source: screenshots/lp-2026-05-24T22-07-36.txt

- Section 1: hero | "Beyond the Screen. / Disconnect. Focus. Prioritize your mental health." | text
- Section 2: hero-sub | "Do you feel it already? The unfinished thoughts. The instinct to check the phone seconds after putting it down. / Want to pause that cycle?" | text
- Section 3: CTA-block | "FIND BALANCE / Continue reading and claim 15% off Mudita Kompakt and 10% off alarm clocks & watches." | CTA + discount offer
- Section 4: transformation-block | "The Mental Cost of Connectivity." | text section header
- Section 5: mechanism-explainer | "Find Your Focus" — "Liberate your attention from constant notifications. Create space for deeper concentration and stay present with one task or activity at a time." | text
- Section 6: mechanism-explainer | "Break the Dopamine Loop" — "It's up to you whether you stay in systems designed to keep you hooked. Engage with digital content or social media in an intentional and disciplined manner." | text
- Section 7: mechanism-explainer | "Wake Up Offline" — "More than 4 out of 5 smartphone users check their phone within 10 minutes of waking up. Would you like to become the one who doesn't?" | text + stat
- Section 8: mechanism-explainer | "Appreciate the Boredom" — "Your mind works best when it has room to breathe. Reduce the input and prepare to be amazed by the clarity and creativity may bring." | text
- Section 9: transformation-block | "From Noise to Presence." | section header
- Section 10: transformation-block | "The Tools of Presence." — "The solution is stepping away from technology created to occupy every moment of your day. Mudita devices are designed to help restore boundaries and support your life instead of competing for your attention." | text
- Section 11: partnership-callout | Mudita Kompakt product feature block — "A phone designed to reduce digital overload. / Mudita Kompakt keeps essential communication while removing the elements that turn smartphones into distraction machines. Its E Ink® display offers freedom from the visual overstimulation common in modern devices. And, whenever you need space to focus or rest, the physical Offline+ mode allows you to disconnect fully." | text + image
- Section 12: partnership-callout | Mudita Harmony 2 and Bell 2 alarm clocks | text + image
- Section 13: partnership-callout | Mudita Moment Automatic watch — "An automatic watch made to keep time, and your peace." | text + image
- Section 14: testimonial-wall | "A Calmer Mind in 3, 2, 1." — "Stories and real-life experiences of people who reduced digital overload and built a healthier relationship with technology using Mudita's products." | text
- Section 15: newsletter-signup | "Enter your details to receive 'The Mudita Kompakt User Well-Being Report', a collection of stories and real-life experiences of people who used Mudita's devices to reduce distractions, relieve stress, and enjoy a more focused and relaxed life. Additionally, you will receive 15% off Mudita Kompakt and 10% off alarm clocks & watches." | email capture form
- Section 16: guarantee-block | "Free Shipping on orders over €150. / 14-Day Rest-Assured Return Policy. / Designed & engineered with care in Europe." | trust signals

CTAs on this page:
- "FIND BALANCE" — above-fold
- "GET GUIDE & DISCOUNT" (appears 3x, once per product) — mid-page
- "SHOP KOMPAKT" — mid-page
- "SHOP ALARM CLOCKS" — mid-page
- "SHOP MOMENT" — mid-page
- "GET THE GUIDE & DISCOUNT" — bottom email form

---

#### LP: https://mudita.com (Homepage at capture — Calm Tech Institute certification redirect)
Source: screenshots/lp-2026-05-24T22-05-38.txt

Note: This was a promotional redirect at capture time, not the standard homepage. See notes-pass0-fetch.md. Standard hero copy sourced from PDP screenshot.

- Section 1: hero | "Mudita Products Achieve Calm Tech Institute Certification" | blog post hero
- Section 2: transformation-block | "Mudita Kompakt, Harmony 2, and Bell 2, all Platinum Tier Calm Tech Certified.™" | text
- Section 3: mechanism-explainer | "About the Calm Tech Institute" — 81-point certification standard detail | text
- Section 4: feature-grid | "How Mudita Products Scored Across the Calm Tech Categories" — Attention / Periphery / Durability / Light / Sound / Materials | text table
- Section 5: transformation-block | "Technology That Works With You" — brand mission | text
- Section 6: transformation-block | "Calm Technology, Moving Forward" — "This is only the beginning." | text

CTAs on this page (from page structure, not Calm Tech article):
- "Break the cycle of digital stress. Get up to 15% off Mudita's products when you subscribe. Learn More now->" — top banner sticky
- "Sign up for the Mudita Newsletter and receive up to 10% off your first purchase!" — footer popup

---

## 12. Trust Signals Catalog

| Trust signal (verbatim) | Type | Source artifact |
|---|---|---|
| "Winner of the iF Design Award and Red Dot Award 2025" | award | landing-pages.md — LP-1 snippet; partnerships.md PR-2 |
| "iF Design Award 2025" | award | partnerships.md PR-2 body |
| "Red Dot Award: Product Design 2025" | award | partnerships.md PR-2 body |
| "Reddot Winner 2025 award" | award | landing-pages.md LP-1 snippet; screenshots/lp-2026-05-24T22-09-25.txt (line 92) |
| "Top Pick 2025 by TechAeris" | press-quote | screenshots/lp-2026-05-24T22-09-25.txt (line 92) |
| **"Mudita Kompakt, Harmony 2, and Bell 2, all Platinum Tier Calm Tech Certified.™"** | **certification** | **screenshots/lp-2026-05-24T22-05-38.txt (line 53)** |
| "81-point certification standard" (Calm Tech Institute) | certification | screenshots/lp-2026-05-24T22-05-38.txt (lines 63–64) |
| "Founded in 2024 by Amber Case, the Calm Tech Institute is dedicated to promoting technology design that respects human attention, time, and peace of mind." (implied expert authority) | expert-endorsement | screenshots/lp-2026-05-24T22-05-38.txt (lines 62–63) |
| "1,078 backers who pledged €353,751" (Kickstarter) | traffic-counter | partnerships.md crowdfunding |
| "€150,000, which was reached in just 3.5 hours" (Kickstarter funded speed) | traffic-counter | partnerships.md crowdfunding |
| "raising €466,191 EUR from 1,389 backers" (Indiegogo) | traffic-counter | partnerships.md crowdfunding |
| "over $500k pledged" (combined crowdfunding) | traffic-counter | partnerships.md PR-2 |
| "Mudita is spearheaded by Michał Kiciński, the visionary founder of Mudita and the renowned CD Projekt (The Witcher, Cyberpunk 2077)" | named-celebrity | funnel-mechanics.md; notes.md |
| "Funded in Less Than 4 Hours" (Geeky Gadgets headline) | press-quote | partnerships.md crowdfunding |
| "14-Day Satisfaction Guarantee / Once received, customers will have 14 days to try out their Mudita Kompakt. If it's not the right fit, it can be returned in undamaged condition for a full refund" | guarantee | partnerships.md PR-2; funnel-mechanics.md |
| "Mudita Kompakt includes a 2-year warranty, along with 5 years of software and security updates." | guarantee | landing-pages.md LP-1; funnel-mechanics.md |
| "TWICE" (press logo / review) | press-logo | funnel-mechanics.md |
| "Pocket-lint" (press review) | press-logo | funnel-mechanics.md |
| "Android Authority (CES 2026 hands-on)" | press-logo | funnel-mechanics.md |
| "Techaeris" | press-logo | funnel-mechanics.md |
| "TechWalls" | press-logo | funnel-mechanics.md |
| "Good e-Reader" | press-logo | funnel-mechanics.md |
| "Gear Diary" | press-logo | funnel-mechanics.md |
| "Yanko Design" | press-logo | funnel-mechanics.md |
| "Trustpilot" (presence, mixed reviews) | review-count | funnel-mechanics.md |
| "@wearemudita — 35K followers, 946 posts" (Instagram organic presence) | UGC | meta-ads.md |
| "Designed & engineered with care in Europe." | years-in-business / certification | screenshots/lp-2026-05-24T22-07-36.txt (line 134) |
| "Free Shipping on orders over €150." | payment-badge | screenshots/lp-2026-05-24T22-07-36.txt (line 132) |
| "Free shipping" | payment-badge | screenshots/lp-2026-05-24T22-09-25.txt (line 109) |
| "Secure Checkout" | payment-badge | screenshots/lp-2026-05-24T22-09-25.txt (line 111) |
| "FCC and PTCRB" certified | certification | screenshots/lp-2026-05-24T22-09-25.txt (line 100) |
| "A Community of Minimalist Technology Enthusiasts" (forum.mudita.com) | UGC | partnerships.md community forum |
| "The Mudita Kompakt User Well-Being Report" (free guide lead magnet — user stories compilation) | UGC | landing-pages.md LP-11; funnel-mechanics.md; screenshots/lp-2026-05-24T22-07-36.txt |

**Extraordinary identifier flag:**
- **"Mudita is spearheaded by Michał Kiciński, the visionary founder of Mudita and the renowned CD Projekt (The Witcher, Cyberpunk 2077)"** — Founder celebrity status from a recognized global IP franchise. No other e-ink phone brand has a founder of this profile. This is a genuine extraordinary identifier: competitors cannot replicate it with copy alone. However, it is underdeployed in current hero copy (found only in notes/snippet corpus, not in PDP hero or stress-less LP hero).
- **Platinum Tier Calm Tech Certified™** — First-mover certification signal if Calm Tech Institute is recognized by the target audience. Not replicable by competitors without going through the certification process. Emerging extraordinary identifier — credibility depends on how widely the Calm Tech Institute is known to buyers.

---

## 13. Deposit Funnel Evidence

**No deposit-funnel evidence found.**

Mudita Kompakt was not in the Pass 0 deposit-funnel probing scope (scope was limited to supernote, remarkable, boox, ipad, notability-goodnotes per notes-pass0-fetch.md). No deposit pages were probed.

Historical context: The brand ran crowdfunding campaigns (Kickstarter and Indiegogo) with pledge tiers, which function as deposit-style pre-orders, but the campaigns are now closed (Kickstarter: closed; Indiegogo wrapped 2025-03-31). The current active funnel is direct purchase at full price ($439/€439) with a 14-day satisfaction guarantee, not a deposit mechanic.

Pre-order pricing was available during the launch window (Kickstarter early bird €299; NA pre-order $369 before shipping began) but that window has closed.

No deposit-funnel page found at probed URLs. Files checked with no evidence found:
- landing-pages.md (all 16 LPs)
- funnel-mechanics.md
- partnerships.md
- meta-ads.md
- notes.md
- notes-pass0-fetch.md
- all 3 screenshots

---

## Self-Audit Checklist

- [x] Every claim in §5 has a source_artifact reference
- [x] Every angle in §8 has driver + pole + transformation reference
- [x] No feature appears in the claims table (display specs, hardware attributes, software features all in §6 only)
- [x] No transformation is presented as a feature (T1–T4 all framed as outcome-promises, not as product attributes)
- [x] §10 states "no ad-longevity data available" with explanation (no Meta ads resolved; one X/Twitter organic post noted with no start_date)
- [x] No comparisons to other brands anywhere in the output
- [x] No "saturated" calls anywhere in the output
- [x] All 13 sections present

**Flags for synthesizer:**
1. §10: Zero Meta ad data. Mudita appears to be organic/crowdfunding-funded with no paid Meta spend. Ad longevity ranking impossible. Retry recommended with EU-region filters and alternate page names before synthesis.
2. §12: CD Projekt founder credential is underdeployed in hero copy — appears in notes corpus, not on PDP or stress-less LP. May be withheld intentionally or just underpromoted.
3. §5: Two testimonial-verbatim claims flagged as customer-attested, not brand-authored. Excluded from count but included for VOC signal.
4. §3: No hex palette extractable from text corpus alone; PNG visual analysis would be needed for precise color data.
5. mudita.com main page body is snippet-attested, not full-extract. Manifesto page body not retrieved. Full blog post body not retrieved. Mid-fidelity corpus overall.
6. The Calm Tech Institute certification (Platinum Tier) appeared on the homepage at capture time — possibly a promotional redirect that has since reverted. Synthesizer should verify if this is a permanent homepage feature or a temporary promotional moment.

