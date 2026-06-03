# E-Ink Marketing Birdseye Map — Cross-Brand Saturation

Synthesizer pass over the 10-brand marketing corpus
(`runs/eink-tablets/marketing-corpus/<brand>/`). Pulled 2026-05-23.
Compares against the prior flat-map at
`runs/eink-tablets/eink-category-evolution/transformations-flat-map.md`.

Vocabulary discipline applied from `definitions.md` and
`scripts/analyzer-framework.md`:

- **Transformation** = the life-outcome the brand markets the device to
  produce. Read literally from verbatim hooks. Features (note-taking,
  AI, foldable, paper-feel, color, eye-friendly) are NOT transformations.
- **Niche** = the buyer identity / community, distinct from the
  transformation.
- **Claim** = verbatim outcome-promise.
- **Angle** = emotion invoked.
- **Mechanism** = how/why the device achieves the result.

---

## Scope

- Brands: Supernote, Kindle Scribe, reMarkable, Daylight DC-1,
  Daylight Kids, Light Phone, Mudita Kompakt, Boox, iPad, Notability +
  GoodNotes.
- Surfaces synthesized: 50 corpus files (landing-pages, meta-ads,
  funnel-mechanics, partnerships, notes).
- Total source: ~9,250 lines.
- 7 of 10 brands have categorized active Meta ad inventory
  (Supernote 11, Kindle Scribe ~37, reMarkable ~500 sampled, Daylight
  Kids 3, Boox ~230, plus distributor pages; Goodnotes/Notability/iPad
  not extracted; Daylight DC-1 dark; Light Phone 0; Mudita unresolved).

---

## Per-brand transformation matrix

Each row reads verbatim from a brand surface. Multiple transformations
per brand are surfaced. The right two columns count ad and LP volume
that anchors each transformation, where countable.

### Supernote (Ratta) — primary buyer: writer / deep-thinker / multi-role professional

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Replace paper / consolidate notebooks | Writer, general note-taker | "Replace all your notebooks" / "It's like having ALL your cute journals, planners, and sketchbooks in one adorable device" | homepage + meta-ads Ad 1 (lib 1204682305077952) | 4 (Ads 1,2,4,6,7 — Jay T. + Gabriel testimonial cluster) | 1 (homepage) |
| Regain creative focus / think deeply | Writer / creative | "(re)gain stolen creative focus and think deeply for breakthrough results" | homepage + Ad 4 carousel card "Regain stolen creative focus" | 1 (Ad 4, lib 1105821385051110) | 2 (homepage + /creative-writers) |
| Steer away from distractions in academic life | College student / teacher | "Be efficient and steer away from distractions in your academic life with Supernote." | /pages/students-and-teachers | 0 dedicated | 1 |
| Productive at business meetings / file mgmt | Business / management | "Be productive at business meetings" + "Manage files effectively & securely" | /pages/business-and-management | 0 | 1 |
| Protect patient data + go paperless | Healthcare worker | "See how Supernote helps healthcare professionals to protect patient data while completing customizable forms" | /pages/healthcare | 0 | 1 |
| Manage client relationships, soar performance | Sales rep | "See how Supernote helps sales professionals to manage client relationships and track progress with ease, leading to soaring performance levels" | /pages/sales | 0 | 1 |
| Boost programmer workflow | IT / engineering | "see how Supernote's powerful note-taking functionalities help boost every step of your workflow for programmers" | /pages/it-and-engineering | 0 | 1 |
| Long-term value / no subscription / repairable | Value-conscious modular-spec buyer | "Free software updates, constantly. No subscription." / "Modular components for easy repair and future upgrades" | Manta PDP vs-Others table + Ads 8/10 ("Value Beyond Years") | 2 (Ads 8, 10) | 2 |
| Pleasure of natural handwriting (sketch) | Sketcher / artist | "Rediscover the pure joy of creation with Supernote. Its pinpoint precision and genuine paper-like feel..." | Ads 9/11 (lib 782746337916479) | 2 | 1 |
| Outdoor adventure writing/sketching | Outdoor enthusiast / hiker | "Supernote Nomad: The outdoor writer's dream device. Sketch wildlife, log your hikes..." | Ad 5 (lib 1183712030208554) | 1 carousel | 0 (ad-only — homepage doesn't lead) |
| Donate-with-purchase / save manta rays | Conservation-aligned buyer | "Buy Manta, Save Manta" | Manta PDP "Social Impact" block | 0 | 1 |

Transformations actually run: **at least 11 distinct** (vs. flat-map's
single "regain stolen creative focus" attribution).

### Kindle Scribe (Amazon) — primary buyer: Amazon-ecosystem reader-who-writes; secondary: "hard worker" professional

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Never buy a notebook again / new kind of notebook | Existing Amazon reader (general) | "Never buy a notebook again thanks to the new Kindle Scribe" + "A new kind of notebook." | Ad cluster 7 (lib 1629011775044580) + headline reused across cluster 6 + LP B0DVQQGMCZ | 1 dedicated + 6 use this headline | 6 PDP variants |
| Convert messy handwriting to clean text | "Messy handwriter" | "This one's for the messy handwriters. The new Kindle Scribe converts handwritten notes into clean, readable text." | meta-ads cluster 1 (9 lib IDs incl 3929487457188525) | 9 (English) + 1 DE variant | 0 dedicated |
| AI summary of handwritten notes | Knowledge worker | "One tap to summarize your handwritten notes on the new Kindle Scribe" + "Recap your handwritten notes with just one touch" | meta-ads clusters 2 + 3 | 3 + 7 = 10 | 0 |
| AI search across notes | Knowledge worker | "Search your thoughts. No, literally. AI-powered search on the new Kindle Scribe lets you scan your notes in seconds." | meta-ads cluster 4 (2 lib IDs) | 2 | 0 |
| Own the meeting / be fully present | Meeting-heavy professional | "The one who 'owns' the meeting, is the one who's fully in it." | meta-ads cluster 5 (5 lib IDs) | 5 | 0 |
| Hardest workers need hard-working tools | Self-styled hard worker / executive | "The hardest workers need hard-working tools." / "...need a hard-working device." | meta-ads cluster 6 (5 lib IDs) | 5 | 0 |
| Never print again / mark up PDFs on device | PDF-heavy worker | "Never print again. Mark up PDFs right on your device." | meta-ads cluster 8 (6 lib IDs + 1 DE) | 7 | 0 |
| Designed for focus — no apps no pings | Distraction-overloaded knowledge worker | "A device designed for focus — no apps, no pings, just deep work." | meta-ads cluster 9 (2 lib IDs + 1 DE) | 3 | 1 (press release) |
| Feel of paper + power of AI | AI-curious worker | "Introducing the NEW Kindle Scribe. The feel of paper and the power of AI." | meta-ads cluster 10 (2 lib IDs) | 2 | press release |
| Books to read + pages to write | Reader-writer | "You've got books to read and pages to write. Take it all with you on the new Kindle Scribe." | meta-ads cluster 11 (1 lib ID) | 1 | 0 |
| Reading: "Story So Far" + "Ask This Book" | Reader | "Coming in 2026: Story So Far for spoiler-free book catch-ups and Ask this Book for in-text questions" | About-Amazon press release | 0 in current creative | 1 |

Transformations actually run: **at least 11** (vs flat-map's "Never
buy a notebook again"). The dominant active-creative weight is on AI
features (summary/recap/search) and worker-identity hooks, not on the
"replace your paper" line the flat-map attributed.

### reMarkable — primary buyer: knowledge worker + student (secondary)

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Focused work / made for thinking | Knowledge worker | "The Paper Tablets for Focused Work" + "Made for thinking" | homepage + Pure launch creatives B+E (lib 1316939143694446) | ~24 (Pure-launch creative cluster A: 24 lib IDs running same copy) | 8+ (homepage, /clp/meet-remarkable, top-10-features, etc.) |
| Close the gap between thinking and working | Knowledge worker | "Close the gap between how you think and how you work with the new reMarkable Paper Pure." | Pure-launch Creative A (24 lib IDs) | 24 | 1 |
| 35% less stress / 20% more focus / deeper thinking | Higher-ed student / business buyer | "35% less stress when doing one task at a time / 20% more focus and 17% deeper thinking / 30% less mental strain and 17% sharper memory" | /clp/the-future-of-focused-learning + Paper Pure PDP study-results block | 0 direct creative; press-quote creative (lib 1297588461864800) is adjacent | 2 (focused-learning CLP + higher-ed business solutions) |
| Find focus / improving focus | Knowledge worker | "6 tips for improving focus with reMarkable" / "Find your focus with reMarkable" | /clp/6-tips-for-improving-focus-with-remarkable + multiple closers | 0 direct creative | 4+ CLPs |
| Replace notebooks / printed documents | General | "Replace your notebooks and printed documents with the only tablet that feels like paper" | shared closer across 10+ CLPs | 0 direct creative | 10+ CLPs (shared closer) |
| Get organized | General | "5 ways to get organized with reMarkable" | /clp/5-ways-to-get-organized-with-remarkable-2b | 0 direct | 1 |
| Be present (for students) / gift focus | Parent of college student | "A thoughtful gift for students" + "This year, give the present of being present" | /clp/a-thoughtful-gift-for-students | 0 direct creative; Soldana Music creator ad nearby ("makes it easy to gift that spark of creativity to those you love") | 1 + 1 creator ad |
| Distraction-free for ADHD / left-brain creatives | ADHD-identified creator | "As a left-brain creative personality type with a strong dose of ADHD, it's easy for me to get distracted by social media..." | Jhamil Bader creator-partner ad (9 lib IDs) | 9 (Jhamil Bader creative) | 0 LP (creator-ad–only positioning) |
| Made for teams / paperless workplace | B2B team buyer | "Made for teams" / "reMarkable Paper Pro: for a focused, organized, and paperless workplace" | /business + ads lib 4612886222288575, 1498261571956455, 1478651699830490, 3454723661349243 | 4 direct | 1 |
| For better thinking (cross-product) | General | "reMarkable Paper tablets. For better thinking." | meta-ads "For better thinking" (lib 1511510003755994 + 752998221174903) | 2 creatives x 6 ads each | 0 |
| Career advice for young workers | Gen Z career-seeker | "Ep. 443 - Career Ladder. She has a PRACTICAL and a DREAM job" | Max Klymenko creator ad (lib 1484527649841182, 13 ads) | 13 | 0 |
| Sustainable / reduces campus waste | Higher-ed sustainability buyer | "paper, with it making up 25% of campus waste" | /using-remarkable/business-solutions/higher-education-focused-learning | 0 | 1 |

Transformations actually run: **at least 12** (vs flat-map's "focused
work"). The creator-partner ads add positioning the homepage doesn't
lead with (ADHD, career planning, gift-giving). The dominant numerical
weight is on the Paper Pure launch ("close the gap" + "Made for
thinking") and the worker-identity hooks; "for students" lives on
dedicated CLPs and the iJustine + Jake Goodman creator pages, not on
the homepage hero.

### Daylight DC-1 — primary buyer: digital-minimalist adult

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Deep focus + wellbeing | Digital-minimalist adult | "A new kind of computer, designed for deep focus and wellbeing" | homepage hero | 0 (page dark) | 1 |
| Calmer relationship with your computer | Digital-minimalist adult | "Calm experience" / "Daylight gets it, a computer that brings the simplicity back to our digital life" | homepage + testimonials | 0 | 1 |
| Goodbye eye strain / blue-light free | Eye-strain / circadian-conscious | "Say goodbye to eye-strain — designed for full sunlight and nighttime" + "Goodbye, blue light" + "Better sleep — in sync with your circadian rhythm" | homepage + sleep-101 + blue-light-101 + screen-flicker-101 blog | 0 | 4 |
| Outdoor computing | Outdoorsy / nature-loving | "outdoor computing — it's a computer you can use outside" | homepage "Outdoor computing" section | 0 | 1 |
| For your kids — share with confidence | Parent (secondary) | "It's the only computer I feel comfortable sharing with my kids!" — Akshay Kothari | homepage testimonial block | 0 | 0 (testimonial-only — surfaces a hidden parent funnel that the kid-targeted SKU then captures via daylight-kids subdomain) |
| Treat severe eye strain / visual snow syndrome | Clinical / medical | "Do you suffer from severe digital eye strain, computer vision syndrome, or visual snow syndrome? If you are interested in trying a DC-1 for 30 days as part of the Eye Strain Pilot Study..." | /blog/screen-flicker-101 | 0 | 1 (referral to drdestefanoOD@gmail.com) |
| Tech that supports prosocial behaviors | Civic-tech aligned | "Develop algorithms and in-product tools that reward prosocial behaviors" | Inspired Internet Pledge | 0 | external |

Transformations actually run: **at least 7** despite the brand running
ZERO active Meta ads on the adult flagship page. The flat-map captured
the "calmer relationship" frame; corpus reveals 6 more, including the
clinical-pilot funnel.

### Daylight Kids — primary buyer: parent of K-8

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Happier, healthier, smarter children | Parent | "Calm technology designed to make kids healthier, happier and smarter" / "A movement to create happier, healthier, and smarter children" | homepage + Ad 1 (lib 1191735776427912) + Ad 2 + Ad 3 | 3 (all active ads) | 9 LPs across kids subdomain |
| End iPad Kids | Parent (iPad-anxious) | "To the end of iPad Kids…and to the new era of Daylight Kids" | Ad 1, Ad 2 | 2 (same primary text) | 0 ("To the end of iPad Kids" line lives only in ads, not homepage hero) |
| You can't blame kids for struggling to focus | Parent (focus-anxious) | "You can't blame kids for struggling to focus." / "Young brains are extra sensitive to artificial light and stimulation." | Ad 3 (lib 2358490071322776) | 1 | 0 |
| Hassle-free parental controls, no setup | Tech-anxious parent | "Hassle-free parental controls. No setup required." | homepage "The 'No' List" | 0 direct creative | 1 |
| Replace iPad as low-stim tablet | Parent | "A more caring alternative" (vs iPad column-by-column) | /compare | 0 | 1 |
| Bring low-stim tech to schools | Educator / advocate | "Help us bring low stimulation technology to schools!" | /landing/education | 0 | 1 |
| Bring low-stim tech to libraries | Library advocate | "Help us bring low stimulation technology to your local library!" | /landing/library | 0 | 1 |
| ESA-funded — state pays | ESA-eligible parent (10 states) | "Eligible for ESA · Check your state" | homepage + multiple LPs | 0 | site-wide funnel |
| Tantrum-free screen time | Tantrum-fatigued parent | "10 Tips for Tantrum-Free Screen Time" / "TANTRUM-FREE: Kids get naturally bored and then move on" | homepage lead magnet + /compare | 0 | 2 |
| Pilot program for IEP/SpEd classrooms | Special-ed educator | "We are actively looking for elementary classrooms (K-4 range) with a high proportion of IEP/SpEd students to coordinate a pilot program (45-60 days) with." | /landing/education | 0 | 1 |
| Screen-free homestead / farm life | Trad / homestead parent | "Our Intentional Screen-Free Farming Life" / "How Farming and Intentional Technology Are Shaping Our Family" | /blog/screen-free-farming-life | 0 | 1 |

Transformations actually run: **at least 11** vs flat-map's single
"happier, healthier, smarter children." The IEP/SpEd, library, and
ESA-funding angles are sub-funnels the surface scan missed.

### Light Phone — primary buyer: digital-minimalist adult

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Designed to be used as little as possible | Digital-minimalist adult | "Designed to be used as little as possible" | homepage tagline + Medium mirror + Thrive Global | 0 (brand runs 0 Meta ads) | site-wide |
| A tool for a better life | General | "A tool for a better life" | homepage tagline | 0 | site-wide |
| Going light (state of mind) | Digital-minimalist adult | "Going light is a state of mind." / "Going light empowers us to find balance with our relationship to technology" | "Going Light" essay | 0 | 1 |
| Your phone away from phone | Two-phone user | "your phone away from phone" / "We see the Light Phone as a supplement, not a replacement." | Thrive Global brand essay | 0 | site-wide |
| Get away from the smartphone | Smartphone-fatigued adult | "The solution had to involve leaving the smart phone at home" | Medium brand essay | 0 | site-wide |
| Parents giving Light Phone to children | Parent of pre-teen / first-phone-buyer | "Light Phones are great devices for parents to give to children as an alternative to a smartphone." | support.thelightphone.com/Parents-Giving-Light-Phone-to-Children + GMA 2018 (Hollier: "fear of the smartphone effects on children is also incredibly concerning") | 0 | 1 (support article — homepage doesn't lead) |
| You become more competent, less anxious | Self-improvement adult | "With Light Phone, you become more competent, you're less anxious." | BOND interview | 0 | external |
| Pays you to stop doomscrolling (Noble Mobile bundle) | Doomscroll-fatigued professional | "the minimalist Light Phone teams up with Andrew Yang's Noble Mobile, which pays you to stop doomscrolling" + "Up to $5 per unused GB" cashback | TechCrunch May 2026 partnership | 0 | 1 (Noble Mobile co-branded) |
| Reclaim time / time = most universal | Time-poor professional | "Time is maybe the most universal thing." (Hollier) | BOND interview | 0 | external |

Transformations actually run: **at least 9** despite zero paid ads.
The parent-of-pre-teen funnel is a hidden sub-funnel buried in the
support article. The doomscrolling-cashback bundle is a 2026 hidden
positioning that didn't exist when the flat-map was written.

### Mudita Kompakt — primary buyer: digital-minimalist adult

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Reclaim focus and well-being | Digital-minimalist adult | "designed to help users reclaim their focus and well-being" | PR 2025-04-16 + main PDP | 0 (Meta-page-unresolved) | 1 |
| Break free from digital distractions | Digital-minimalist adult | "we're helping people break free from digital distractions so they can focus on what truly matters" (Stasiuk) | PR + main PDP | 0 | 2 |
| Reclaim attention, sleep, mornings | Sleep-deprived adult | "Reclaim your attention, your sleep, and your mornings." | X/Twitter promo | 0 | 0 (Twitter-only) |
| Digital wellbeing / mindful living | Mindfulness / wellness | "designed for digital well-being" / "Mindful technology" / "intentional living" / "mindfulness" | PR + manifesto + blog series (B-5, B-6, B-20) | 0 | 8+ blog posts |
| Sleep better via digital detox | Sleep-anxious | "Digital Detox Resolutions: Break the Screen Cycle & Sleep Better" | /blog | 0 | 1 |
| Lower EMF / radiation safety | EMF-conscious / health | "The Mudita phone produces significantly lower EMF than typical smartphones" / "SAR (head) values of 0.97 W/kg" | shop.shieldyourbody.com listing (3rd-party retail) | 0 (mudita-side ads) | 1 (3rd-party retail) — Mudita does NOT lead with this on its own site |
| Delay smartphones for kids / first phone | Parent of pre-teen | "Why Delaying Smartphones for Kids Matters + How Kompakt Helps" / "when we delay the smartphone, we're not depriving kids of something—we're giving them room to thrive" | /blog/why-delaying-smartphones-for-kids-matters-how-kompakt-helps + forum "Terrible Costs of a Phone-Based Childhood" | 0 | 1 |
| Sanity-saving gift for parents | Gift buyer (grandparent / spouse) | "Sanity-Saving Gifts for Parents" — 2025 Holiday Gift Guide inclusion | Gear Diary 2025-11-29 | 0 | 0 (external) |
| Privacy / Offline+ hardware cutoff | Privacy-conscious / journalist | "The unique Offline+ Mode physically disconnects key components like the GSM modem and microphones, allowing you to truly unplug and protect your privacy." | main PDP | 0 | 1 |
| Stress less / beyond the screen | Stressed adult | "Beyond the Screen | Up to 15% OFF" / "the constant noise of the digital world shrinks mental space" | /stress-less/ + Well-Being Report lead magnet | 0 | 1 |

Transformations actually run: **at least 10**. The delay-smartphones-
for-kids angle and the EMF-safety positioning (via SYB retail) are
hidden funnels — not on Mudita's homepage hero but actively pitched
through blog + third-party retail. Brand name "Mudita" is Buddhist
(sympathetic joy) but is left organically un-leveraged — no faith /
spiritual angle in marketing copy.

### Boox (Onyx International) — primary buyer: multi-segment power user

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Productivity-focused ePaper with Google Play | Power user / Android fan | "Productivity-focused ePaper. Google Play built-in." | homepage hero | dozens (Note Air5 C + Go 10.3 + Tab X C cluster) | 1 (homepage) + many PDPs |
| Beat brain rot | Brain-rot-anxious adult | "Brain Rot Is Real. Here's How to Reverse It." | /blogs/news/brain-rot pillar | 0 direct creative; brand-mission ads echo (Ad 45 cluster of 4–6) | 1 dedicated pillar + 30+ adjacent posts |
| Slow down, minimize distractions, be present | Digital-minimalist / Palma user | "The color ePaper device encourages you to slow down, minimize distractions, and be present" | Ad 5 (lib 1594585398319745 + variants) | 1 dedicated + clustered into Palma lane (Ads 5–11, 33–40) | Palma PDP + 10+ blog posts |
| Pocket escape from the algorithm | Doomscroll-fatigued | "Palma 2 Pro: Your pocket escape from the algorithm." | Ad 9 (lib 822428453698866) | 1 | Palma PDP |
| Doomscrolling → intentional learning | Self-improver | "Joshua Abraham's Journey from Doomscrolling to Intentional Learning with Palma 2 Pro" | /blogs/news/boox-story-joshua-abraham | 0 direct creative | 1 LP user-story |
| Intentional living / mindful lifestyle | Mindfulness / lifestyle | "designs ePaper devices for people seeking intentional living and work" / "Tap into Light Productivity Seamlessly" / "Your mindful space." | Joshua Abraham LP + Palma 2 Pro PDP + brand-story | dozens (Palma lane "calm color ePaper" / "mindful space" / "balanced lifestyle" repeating) | 10+ |
| Work longer, strain less (B2B) | Team / IT buyer | "Work Longer, Strain Less" / "Buy BOOX tablets in bulk to save more" | Ads 1, 2, 3, 28 + business.boox.com | 4 dedicated ads | 1 + B2B mirror |
| Excel every campus moment (back-to-school) | College student | "Excel Every Campus Moment with BOOX Tablets" / "ePaper Displays Crafted for Academic Focus" / "Boost Your Academic Performance" | back-to-school blog + booxstudent.myshopify.com (23% off w/ .edu verification) | 0 direct creative (Ad 32 mentions students/professionals/creatives mid-text) | 8+ student-targeted blog posts + dedicated edu store |
| Fight dyslexia | Dyslexic learner / parent of dyslexic | "5 Features That Help You Fight Dyslexia With BOOX" | /blogs/news/fight-dyslexia | 0 | 1 |
| Eye-friendly / no eye strain / since 2008 | Eye-strain-conscious | "specialized in eye-friendly and versatile ePaper devices since 2008" / "Eye-friendly ePaper Display" / "relieves your tired eyes" | Ad 4 (brand-follow cluster, lib 1469140641550933) + Ad 28 + 6+ blog posts on E Ink eye health | 5+ | 6+ |
| Better sleep / less blue light | Sleep-anxious | "Being exposed to heavy blue light near bedtime will suppress melatonin" | /blogs/news/benefits-of-e-ink-screens-for-eye-health-and-wellnes | 0 | 1 |
| Wander far, think deep (nomad) | Digital nomad | "Wander far, think deep." / "Built for your nomadic life" / "Digital Nomad's Sidekick" / "your second brain for writing & learning" | Go 10.3 PDP + Ads 12–17, 29–32 | dozens (Go 10.3 nomad lane) | 5+ |
| Replace your laptop (productivity) | Knowledge worker | "Tab X C, your focused replacement for your laptop." / "Digital Paper for Professionals" | Ad 24 (lib 928406206268505) + Tab X C PDP | 1+ | 1 |
| Annotate any format | PDF-heavy worker | "Directly highlight and annotate what you're reading, whether it's PDF, EPUB, CBR, MOBI, or any other format." | Ad 18 cluster | 4 | 2 |
| Capture and digitize via camera | Document worker | "Capture and Digitize, in a Flash" / "Transform your documents into digital format using the 16MP rear camera" | Palma PDP | 0 direct | 1 |
| Memory support for amnesia patient | Caregiver | "How a Software Designer and Engineer, Jan Miksovsky, uses BOOX To Support a Parent With Amnesia" + "The E Ink Benefit for Memory-Related Conditions" | /blogs/news/jan-miksovsky + /blogs/news/the-e-ink-benefit-for-memory-related-conditions | 0 | 2 |
| Mental health awareness / quieting mental chatter | Mental-health-conscious | "Mental Health Awareness Month: Quieting Mental Chatter With BOOX" | /blogs/news/mental-health-awareness-month | 0 | 1 |
| Reclaimed love for reading | Disenchanted reader | "How Alexandra Fuller Reclaimed Her Love for Reading with BOOX" | /blogs/news/alexandra-fuller | 0 | 1 |
| Travel reading / journaling | Traveler | "Elevate Your Travel Journaling" / "Travel Smarter" / "In the Moment: Holiday Travel with Palma 2 Pro" | 4+ /blogs/news posts | 0 | 4+ |
| Saxophonist performance use | Musician | "How Saxophonist Manu Brazo Uses BOOX for His Performance" | /blogs/news/saxophonist-manu-brazo | 0 | 1 |

Transformations actually run: **at least 20** (flat-map listed 3:
"beat brain rot," "encourages you to slow down," "relieve digital
eyestrain"). Boox is the most polyamorous brand in the corpus — the
blog index alone surfaces ~30 distinct transformation pitches. The
homepage leads with "Productivity-focused ePaper" but the funnel
runs against parallel niche-specific blog SEO funnels (dyslexia,
amnesia, musician, mental-health, nomad, travel, business).

### iPad (Apple) — primary buyer: anyone who pays Apple prices

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| The ultimate iPad experience | Power user / Pro | "The ultimate iPad experience with the most advanced technology" (iPad Pro tagline) | apple.com/ipad-pro | 0 iPad-specific in 71-ad sample | 1 |
| Serious performance, thin & light | Mid-market | "Serious performance in a thin and light design." (iPad Air) | apple.com/ipad-air | 0 | 1 |
| Colorful, all-screen iPad for everyday | Everyday / general | "The colorful, all-screen iPad for the things you do every day." | apple.com/ipad | 0 | 1 |
| Full iPad in an ultraportable design | On-the-go | "The full iPad experience in an ultraportable design." (mini) | apple.com/ipad-mini | 0 | 1 |
| Ace your coursework | College student | "Tear through tough assignments." / "Crush your coursework." / "Ace the test of time." | /education/college-students/ | 0 in sample | 2 |
| Take noteworthy notes with Apple Pencil | Student note-taker | "Take noteworthy notes with Apple Pencil." / "Transform handwritten notes to text, mark up PDFs for class." | /education/college-students/ | 0 in sample | 1 |
| Summarize study sessions (Apple Intelligence) | AI-curious student | "Summarize study sessions in a snap." | /education/college-students/ | 0 | 1 |
| Designed by Apple, powered by learning | School / district buyer | "Designed by Apple. Powered by _learning._" / "A better world starts in the classroom" | /education/k12/ | 0 | 3 K-12 LPs |
| Privacy is a fundamental right (school data) | Privacy-conscious school admin | "We believe privacy is a fundamental human right, in and out of the classroom." | /education/k12/ | 0 | 1 |
| Save IT teams time / zero-touch deploy | School IT | "IT that starts easy. And _stays easy._" / "Zero-touch deployment. _Zero hassle._" | /education/k12/it/ | 0 | 1 |
| Work as one or one thousand | SMB / enterprise | "Work as one. Or one thousand." | /business | 0 in sample | 1 |
| Workplace can be any place | Hybrid worker | "Productivity — Your workplace can be any place." | /ipad/ | 0 | 1 |
| Classroom can be anywhere | Remote student / homeschool | "Learning — Your classroom can be anywhere." | /ipad/ | 0 | 1 |
| Kick back. Tune in. Game on. | Entertainment / consumer | "Entertainment — Kick back. Tune in. Game on." | /ipad/ | 0 | 1 |
| Take your inner artist out and about | Creator / artist | "Creativity — Take your inner artist out and about." | /ipad/ | 0 | 1 |

Transformations actually run: **at least 15** (flat-map didn't list
iPad explicitly). Note Meta-side: the 71-ad sample of Apple's
~3,000 active ads contained 0 iPad creative — the dominant flight at
pull-time is iPhone 17, so iPad transformation work runs through
web LPs + Education Store + iPhone-adjacent halo.

### Notability + GoodNotes — primary buyer: iPad-owning student + professional

| Transformation | Niche targeted | Verbatim hook | Source artifact | # ads | # LPs |
|---|---|---|---|---|---|
| Turn notes into knowledge (N) | Student / learner | "Turn your notes into knowledge" / "Stop just taking notes. Start learning from them." | notability.com homepage | adlib blocked | 1 |
| Take Goodnotes wherever you work (G) | Tablet professional | "Take Goodnotes wherever you work" / "The ultimate note-taking experience for professionals who rely on a tablet" | goodnotes.com homepage | adlib blocked | 1 |
| Personalized AI summaries, quizzes, flashcards (N) | Student | "Personalized, AI-powered summaries, quizzes, flashcards, and more." | notability.com homepage | n/a | 1 |
| Notes, real-time (N) | Lecture-attending student / meeting attendee | "Just hit record. We'll transcribe, take notes, and summarize in real time" | notability.com | n/a | 1 |
| Smarter work starts with better notes (N) | Business team | "Smarter work starts with better notes" / "modern note-taking system for teams" | notability.com/business | n/a | 1 |
| Master your courses (G) | College student | "The note-taking app for students at the top of the class" / "Master your courses with the note-taking app that feels like paper and thinks like a computer." | /learning/students | n/a | 1 |
| Simplify teaching, amplify learning (G) | Teacher / K-12 | "Simplify teaching, amplify learning" / "The AI-powered platform that simplifies teaching and amplifies learning" | /learning/education | n/a | 1 |
| AI that works the way you think (G) | Knowledge worker | "AI that works the way you think" / "Intelligence Built Into Every Workflow" | /ai | n/a | 1 |
| Industry verticals (G) — Legal / AEC / Marketing / Government | Industry pro | "Legal: Turn lengthy briefs into concise summaries..." / "AEC: Find annotations across drawings..." / "Marketing: Summarize ideation sessions..." / "Government: Generate summaries from recorded discussions..." | /ai industry blurbs + /industries/* | n/a | 5+ |
| Life's Lighter (G) — physical + mental + environmental lighter load | College student | "Life's Lighter with Goodnotes" / "lighter mental load, lighter physical load, and even lighter impact on the environment" | /usatour + /blog | n/a | 2 |
| Goodnotes Education shifts the focus back to real human connection (G) | Teacher | "Goodnotes Education shifts the focus back to real human connection, by cutting down on time-consuming admin." | /learning/education | n/a | 1 |
| Free for schools (both) | K-12 IT admin | "Notability for Education is free for schools" / Goodnotes Education $0 | notability.com/education + goodnotes.com/pricing | n/a | 2 |
| Free on Samsung Galaxy (G) | Samsung tablet owner | "Get 1 year of Goodnotes free on Samsung devices" | /partners/samsung | n/a | 1 |
| Pre-loaded on LG gram Pro 2in1 (G) | LG tablet owner | "Get 3-months free on Goodnotes when you use the LG gram Pro 2in1" | /partners/lg | n/a | 1 |
| Plant a tree per 10 sign-ups (G) | Sustainability-aligned student | "For every 10 sign-ups of Goodnotes at your school, we'll plant a tree" | /usatour | n/a | 1 |

Transformations actually run: **at least 15** across both apps.
Goodnotes runs the most explicit industry segmentation
(Legal/AEC/Marketing/Government) of any brand in the corpus.

---

## Per-transformation saturation

Transformations are clustered by life-outcome meaning, not by exact
wording. The 5+ saturation rule from `definitions.md` applies inside
each cell.

### Cell 1: "Focus / deep work / less distraction" × knowledge worker

- **Brands running it: 7/10** — Supernote, Kindle Scribe, reMarkable,
  Daylight DC-1, Boox, Notability, GoodNotes. (Add Light Phone + Mudita
  + Daylight Kids if we extend the niche from "knowledge worker" to
  "adult / kid in general" — see Cell 7.)
- **Total active ads anchoring it (English):** ~24 (reMarkable Pure-
  launch creative A 24 lib IDs alone) + ~5 (KS cluster 5 "owns the
  meeting") + ~3 (KS cluster 9 "no apps, no pings") + 1 (Supernote
  carousel "Regain stolen creative focus") + dozens (Boox Palma + Note
  Air5 C lane) ≈ **70+ active ads**.
- **Total LPs:** ~30+. reMarkable alone runs ~8 dedicated /clp/* focus
  pages. Boox blog has 10+ adjacent posts.
- **Verbatim variants (grouped by meaning):**
  - "The Paper Tablets for Focused Work" (reMarkable hero)
  - "A device designed for focus — no apps, no pings, just deep work." (Kindle Scribe)
  - "Made for thinking" (reMarkable Pure)
  - "Stay focused and think deeply" (Boox Go 10.3)
  - "Regain stolen creative focus" (Supernote)
  - "deep focus and wellbeing" (Daylight DC-1)
  - "Tap into Light Productivity Seamlessly" / "A space designed for focus" (Boox Note Air5 C)
- **Niches within the cell:** general knowledge worker (reMarkable,
  KS), creative writer (Supernote), digital-minimalist (Daylight,
  Boox Palma lane), college student (Supernote/Teachers LP, GoodNotes
  students, reMarkable students CLPs), ADHD-creator (reMarkable
  Jhamil Bader ad), B2B team (reMarkable, Boox B2B, Notability).
- **Longest-running claim:** flat-map noted reMarkable since 2017+
  ("focused work" is foundational). Boox brand-follow ad "since 2008"
  positions eye-friendly-productivity claim as longest in market.
- **Newest entrant in this cell:** Kindle Scribe's "no apps, no pings"
  cluster, Apr 23 2026.

This is the **most saturated** cell in the corpus.

### Cell 2: "Replace your paper / consolidate notebooks" × general

- **Brands running it: 6/10** — Supernote (primary), Kindle Scribe
  (primary), reMarkable (closer line repeated 10+ CLPs), Boox
  ("Going Paperless with BOOX ePaper Tablets"), GoodNotes ("Stop
  carrying five different notebooks"), Notability (implicit via PDF
  annotation + business).
- **Total active ads anchoring it:** Supernote 4 (Jay T. + Gabriel
  testimonial cluster) + Kindle Scribe cluster 7 ("Never buy a
  notebook again") 1 dedicated + repeats via cluster 6 image-format =
  5+ shared headline reuse. reMarkable repeats the line as a closer
  across the Pure-launch creative B fleet (16 lib IDs).
- **Total LPs:** Supernote 1 hero + ~12 use-case LPs all reinforcing
  it; reMarkable closer on 10+ CLPs; Boox 3+; KS 6 PDP variants.
- **Verbatim variants:**
  - "Replace all your notebooks" (Supernote)
  - "Never buy a notebook again thanks to the new Kindle Scribe."
  - "Replace your notebooks and printed documents with the only tablet that feels like paper." (reMarkable shared closer)
  - "Going Paperless with BOOX ePaper Tablets" / "Cutting the clutter"
  - "Stop carrying five different notebooks." (GoodNotes /learning/students)
  - "no more lugging around a ton of notebooks!" (Supernote Ad 1)
- **Niches within the cell:** writer (Supernote), Amazon ecosystem
  reader-who-writes (KS), knowledge worker (reMarkable, Boox B2B),
  college student (GoodNotes), professional (Notability).
- **Saturated by the 5+ rule** — 6 brands using essentially the same
  base claim.

### Cell 3: "AI-augmented note-taking / handwriting → text / summary" × knowledge worker + student

- **Brands running it: 5/10** — Kindle Scribe (heavy: clusters 1–4 +
  10), GoodNotes (/ai + /learning/students AI tutor blurbs +
  Goodnotes 6 launch positioning "World's First AI-Powered Digital
  Paper Company"), Notability (Pro $99.99/yr tier built around AI
  Smart Notes / Chat with Notes), Supernote (offline handwriting
  recognition — MyScript partner — but minimal AI framing),
  reMarkable (Connect subscription "AI-powered tools" + ad copy "AI
  can suggest summaries or clear action items from notes too").
- **Total active ads anchoring it:** Kindle Scribe ~22 (clusters
  1+2+3+4 + cluster 10 sum); reMarkable 1 ("AI can suggest summaries");
  others adlib-blocked.
- **Total LPs:** Goodnotes /ai dedicated + each industry blurb + AI
  Add-on pricing; Notability /pricing AI tier + blog v15
  announcement; Kindle Scribe About-Amazon press release.
- **Verbatim variants:**
  - "AI-powered search across notes with summaries" (Kindle Scribe press release)
  - "One tap to summarize your handwritten notes" (KS cluster 2)
  - "Recap your handwritten notes with just one touch" (KS cluster 3)
  - "Search your thoughts. No, literally." (KS cluster 4)
  - "AI that works the way you think" (Goodnotes)
  - "Goodnotes AI is a tutor in your notebook" (Goodnotes /learning/students)
  - "Smart Notes: Transcription & AI-powered summaries in real time" (Notability Pro)
  - "Chat with your notes for explanations & quicker learning" (Notability)
  - Mudita explicit anti-AI stance: "We do not see any need for AI usage in the products that we are creating so far"
- **Notable: Mudita publicly disowns this transformation; Light Phone
  similarly absent. Adoption splits the field — every productivity
  brand is in; every digital-minimalism brand is out.**

### Cell 4: "Distraction-free / calm / less device anxiety / wellbeing" × digital-minimalist adult

- **Brands running it: 6/10** — Daylight DC-1, Daylight Kids
  (kid-flavored), Boox (Palma lane), Light Phone, Mudita Kompakt,
  reMarkable (overlap via Jhamil Bader ad + "no pings, no pop-ups"
  copy on every CLP).
- **Total active ads anchoring it:** Boox ~15 (Palma lane 5, 7, 9,
  10, 11, 33–40 + brand-follow Ad 4); Daylight Kids 3; reMarkable 9
  (Jhamil Bader); Mudita 0; Light Phone 0; Daylight DC-1 0.
- **Total LPs:** Daylight DC-1 site-wide; Daylight Kids site-wide;
  Boox 10+ blog posts ("Brain Rot," "Doomscrolling," "Digital
  Mindfulness," "Reclaiming Your Attention"); Light Phone site-wide;
  Mudita site-wide + 8+ blog posts.
- **Verbatim variants:**
  - "Calmer relationship with your computer" (Daylight DC-1)
  - "Brain Rot Is Real. Here's How to Reverse It." (Boox)
  - "Pocket escape from the algorithm" (Boox Palma)
  - "Designed to be used as little as possible" (Light Phone)
  - "Reclaim your attention" (Mudita)
  - "Beyond the Screen" (Mudita)
  - "Calm technology designed to make kids healthier, happier and smarter" (Daylight Kids)
  - "Distraction-free for deeper focus" (reMarkable Paper Pro ad)
  - "Calm paper-like, grayscale display" (Daylight Kids /compare)
- **Niches within the cell:** digital-minimalist adult (Daylight,
  Light, Mudita, Boox Palma), parent (Daylight Kids), ADHD adult
  (reMarkable), brain-rot-anxious general consumer (Boox), smartphone-
  fatigued professional (Light, Mudita).
- **Saturated by the 5+ rule.**

### Cell 5: "Eye health / no eye strain / blue-light free" × eye-strain-conscious

- **Brands running it: 5/10** — Boox ("since 2008"), Daylight DC-1
  ("Goodbye, blue light"), Daylight Kids ("BLUE LIGHT FREE" vs iPad),
  Mudita Kompakt ("reducing eye strain and eliminating blue light"),
  Kindle Scribe ("glare-free display" — feature framing more than
  transformation), Supernote (frontlight-free + eye-friendly framing
  on Manta PDP). reMarkable adjacent ("eye-friendly reading
  experience" in CLP-2).
- **Total active ads anchoring it:** Boox ~5 (brand-follow Ad 4
  "relieve your digital eyestrain"; B2B Ad 28 "relieves your tired
  eyes"; Go 10.3 sunlight Ad 17 cluster); others 0.
- **Total LPs:** Boox 6+ eye-health pillar blog posts; Daylight 3
  blog posts; Daylight Kids 1 compare row; Mudita PDP block; KS via
  About-Amazon press release.
- **Verbatim variants:**
  - "Say goodbye to eye-strain — designed for full sunlight and nighttime" (Daylight DC-1)
  - "specialized in eye-friendly and versatile ePaper devices since 2008" (Boox)
  - "Work Longer, Strain Less" (Boox B2B headline)
  - "delivers a paper-like reading experience, reducing eye strain and eliminating blue light" (Mudita)
  - "LOW EYE-STRAIN: Stable consistent backlight with no flicker (no-PWM)" (Daylight Kids vs iPad)
  - "Frontlight Free — true paper look in natural light" (Supernote Manta)
- **Saturated cell.** Daylight is the brand pushing it as a primary
  hero; Boox treats it as a foundational always-on claim; the others
  carry it as feature support.

### Cell 6: "Read like a book / pleasurable reading" × reader

- **Brands running it: 4/10** — Kindle Scribe (Story So Far / Ask
  This Book), Boox (Go Series, Palma 2 Pro audiobook/ebook lane),
  Supernote (Kindle-app + ebook support), GoodNotes (PDF/import
  textbook on /learning/students), reMarkable (Read on reMarkable
  extension + ebook support). Not core for any brand except Kindle
  (which leads a separate Kindle line); inside the e-ink-tablet
  category it is feature-level.
- **Verbatim variants:**
  - "Books to read and pages to write" (KS cluster 11)
  - "Read in comfort. Day or night." (reMarkable Paper Pro)
  - "Reading Experience as Fluid as Your Travels" (Boox Go 10.3)
  - "Reclaimed Her Love for Reading with BOOX" (Boox user-story)

### Cell 7: "End iPad Kids / low-stim kids device" × parent of K-8

- **Brands running it: 3/10** — Daylight Kids (primary), Mudita
  Kompakt (sub-funnel via blog + 3rd-party gift-guide), Light Phone
  (sub-funnel via Parents support article + GMA 2018 coverage).
  reMarkable and Supernote have student LPs but not parent-of-kid
  positioning.
- **Total active ads anchoring it:** Daylight Kids 3 — only brand
  paying media for it.
- **Total LPs:** Daylight Kids site-wide; Mudita 1 blog post; Light
  Phone 1 support article.
- **Verbatim variants:**
  - "To the end of iPad Kids…and to the new era of Daylight Kids ☀️🍃" (Daylight Kids ad)
  - "A Computer That's Actually Good for Kids" (Daylight Kids headline)
  - "Why Delaying Smartphones for Kids Matters" (Mudita)
  - "Light Phones are great devices for parents to give to children as an alternative to a smartphone." (Light Phone support)
  - Daylight DC-1 testimonial "It's the only computer I feel comfortable sharing with my kids!" — Akshay Kothari (parent funnel surfaced on adult LP, captured by Kids subdomain)
- **Niches within the cell:** ESA-eligible parent (Daylight Kids
  only), tantrum-fatigued parent (Daylight Kids), first-phone parent
  (Mudita, Light Phone), IEP/SpEd educator (Daylight Kids only).
- **Not saturated — only Daylight Kids owns the "iPad Kids" naming
  literally.** The other two play it sideways via "first phone"
  framing.

### Cell 8: "Replace your laptop / true productivity device" × professional

- **Brands running it: 4/10** — Boox (Tab X C "focused replacement
  for your laptop"), iPad (entire product line), reMarkable (Type
  Folio + business positioning), Notability + GoodNotes (cross-device
  syncing on Mac/Web/Windows). Kindle Scribe deliberately not in
  ("not 'All-in-one' tablet computer" Supernote-style + Kindle stays
  in reader/note frame). Daylight DC-1 adjacent ("a new kind of
  computer" but positioning is calmer-not-better).
- **Verbatim variants:**
  - "Digital Paper for Professionals" / "Tab X C, your focused replacement for your laptop." (Boox)
  - "Type Folio is a powerful keyboard accessory for reMarkable Paper Pro... amazing tool for drafting long form documents" (reMarkable)
  - "Major. In any field. No matter what you study, ace it with Mac and iPad." (iPad college students)
  - "Take Goodnotes wherever you work" (GoodNotes professional positioning)

### Cell 9: "Better sleep / circadian rhythm / amber light"

- **Brands running it: 4/10** — Daylight DC-1 (primary), Daylight
  Kids ("Blue light free, a good night's rest"), Mudita (via blog
  "Digital Detox Resolutions: Break the Screen Cycle & Sleep
  Better"), Boox (E Ink eye-health blog "Better Sleep Quality"). Not
  hero for any except Daylight.
- **Verbatim variants:**
  - "Better sleep — In sync with your circadian rhythm" (Daylight DC-1)
  - "100% blue light free (amber mode) backlight for minimal sleep disruption" (Daylight Kids ad)
  - "Reclaim your attention, your sleep, and your mornings." (Mudita X promo)

### Cell 10: "Sustainable / repairable / less e-waste"

- **Brands running it: 4/10** — Supernote ("Modular components for
  easy repair and future upgrades. Less e-waste."), reMarkable
  ("more repairable design, recycled materials"), Light Phone
  ("improves repairability, as you can now access the battery, and
  replace the screen and USB port" — LPIII spec), iPad (Apple's
  general sustainability claims via /education/k12/). Goodnotes
  /usatour "plant a tree per 10 sign-ups" plays in adjacent
  sustainability lane.

### Cell 11: "Lower EMF / privacy / data sovereignty"

- **Brands running it: 2/10** — Mudita (Offline+ Mode + SYB retail
  EMF positioning), Light Phone ("We don't collect personal data. We
  don't have social media. So it's inherently more secure." +
  no-browser-no-email design constraint). Niche cell, only 2
  brands.

### Cell 12: "AI-curious thinking on paper (specifically frame the device for the AI buyer)"

- Distinct from Cell 3 because here AI is the headline. **2/10**:
  Goodnotes (/ai is hero LP for the surface) + Kindle Scribe ("feel
  of paper and the power of AI").

### Cell 13: "Carry your library / portable reading"

- **2/10** (e-ink-tablet focus only): Boox Palma 2 Pro lane + Kindle
  Scribe. Adjacent: Kindle line generally (not in this corpus).

### Cell 14: "B2B / team / bulk-buy"

- **5/10**: reMarkable (/business + 4 dedicated ads), Boox
  (business.boox.com + 4 dedicated ads), iPad (/business), Notability
  (/business + $60/$180/yr tiers), GoodNotes (Teams $120/seat +
  Enterprise + industry verticals). Supernote silent on B2B vs the
  others; uses use-case LPs for individual buyers.

### Cell 15: "Education / school / district buyer"

- **5/10**: iPad (heaviest — K-12 main + Products + IT + PL + College
  Students + ASM partnerships), GoodNotes (/learning/education + free
  + USA Tour 30+ campuses), Notability (/education + free for schools
  + Apple EPP member), Daylight Kids (/landing/education + IEP/SpEd
  pilot + ESA in 10 states), Boox (booxstudent.myshopify.com with 23%
  off via .edu verification + back-to-school blog). reMarkable
  university pilot (NHH) is named on /using-remarkable/business-
  solutions/higher-education-focused-learning but not a discount
  program.

### Cell 16: "Power Apple Pencil / iPad-stylus excellence (app side)"

- **2/2 in the apps**: Notability and Goodnotes. Cell is internal to
  the iPad-app duopoly. Goodnotes had Apple 2022 iPad App of the Year
  + new Apple Pencil Pro features (Palette, Dynamic Ink).

---

## Per-claim saturation

Grouped by meaning, listed with verbatim text and brand citation.
Same-meaning claim appearing in 5+ brand cells = saturated.

### Saturated (5+ brands)

**Claim cluster: "feels like paper" / paper-like feel**
- Brands: Supernote ("FeelWrite 2 Self-recovery Soft Film"), Kindle
  Scribe ("paper-like color display"), reMarkable ("the only tablet
  that feels like paper" — repeated 10+ CLPs), Daylight DC-1
  ("paper-like display"), Daylight Kids ("paper-like display with
  gentle grays"), Boox ("Paperlike Writing Experience" + "paper-like
  feel" everywhere), Mudita ("paper-like reading experience"),
  GoodNotes ("feels like paper").
- 8/10. **Most saturated single claim in corpus. Table-stakes.**

**Claim cluster: "no apps / no notifications / distraction-free"**
- Brands: Kindle Scribe ("no apps, no pings"), reMarkable
  ("distraction-free by design / no pop-ups, notifications, social
  media"), Daylight DC-1 ("custom software experience that eliminates
  the notifications, doomscrolling, and addicting algorithms"),
  Daylight Kids (same copy), Boox ("Eliminate distractions without
  notifications and pop-ups"), Light Phone ("never have social
  media, internet browsing, email, news, or ads"), Mudita
  ("distraction-free interface"), Supernote ("focus on writing and
  reading… and nothing more").
- 8/10. **Saturated.**

**Claim cluster: "eye-friendly / no eye strain / glare-free"**
- 7/10 (see Cell 5). Saturated.

**Claim cluster: "long battery life / weeks of battery"**
- Brands: Kindle Scribe ("Weeks of reading and writing on a single
  charge"), reMarkable ("up to two weeks of battery life"), Boox
  ("Lasts for weeks"), Supernote ("Multi-day battery life" Nomad ad),
  Daylight DC-1 ("Days of use on a single charge"), Mudita ("up to 6
  days of battery life"), Light Phone (battery user-replaceable),
  Daylight Kids (inherited from DC-1).
- 8/10. Saturated. **Table-stakes.**

### Defensible (1–2 brands)

**Claim: "Replace your laptop"** — Boox Tab X C only ("focused
replacement for your laptop"). Defensible vs everyone else.

**Claim: "AI-powered notebook search across notes"** — Kindle Scribe
("Search your thoughts. No, literally"). GoodNotes adjacent
("Understand and Search across typed text, handwriting, PDFs"). Two
brands, distinct enough that each owns it.

**Claim: "World's first / longest-running in category" framing**
- Boox "since 2008" — Supernote "Longest-lasting E-notebook" —
  reMarkable "world's slimmest tablet" (iJustine LP). Each owns a
  different superlative; 3 brands, 3 distinct positions.

**Claim: "ESA-funded — state pays"** — Daylight Kids alone (10
states). No other brand uses ESA as a purchase mechanic.

**Claim: "Pays you to stop doomscrolling"** — Light Phone × Noble
Mobile bundle alone. Unique cashback-for-non-use mechanic.

**Claim: "Donate per purchase to wildlife conservation"** — Supernote
× Manta Trust alone ("Buy Manta, Save Manta").

**Claim: "iF Design Award winner"** — Mudita 2025, Boox 4× iF 2025 +
Tab Ultra iF 2023, reMarkable TIME Best Inventions 2025. Press-cred
table; not a transformation, treat as trust signal.

**Claim: "Pre-loaded on partner hardware"** — Goodnotes × LG gram Pro
+ Goodnotes × Samsung Galaxy Tab. Unique partnership-leverage at this
saturation tier.

**Claim: "Hardware-level kill switch for microphone + modem"** —
Mudita Offline+ Mode alone.

**Claim: "Camera deliberately designed to remove sharing capability"**
- Light Phone alone (Hollier: "the culprit of people actually falling
  out of the moment, which is sharing").

**Claim: "Modular / DIY-repairable / user-swappable parts"** —
Supernote (Half-pen Module, motherboard, battery, enclosure all on
DIY Zone) is the deepest commitment. reMarkable Paper Pro "more
repairable" is softer. Light Phone LPIII "user-replaceable battery."

**Claim: "Buy and 50-day risk-free trial / 30-day risk-free trial"**
- reMarkable 50-day guarantee, Daylight 30-day, Mudita 14-day,
  Supernote 30-day. Different windows, same lever; reMarkable's 50
  days is longest in category.

### Shared but not over-saturated (3–4 brands)

**Claim: "Organize notes via folders / tags / search"** —
reMarkable, Supernote, Boox, GoodNotes, Notability. App-level
table-stakes for the productivity lane.

**Claim: "Cloud sync (Google Drive / Dropbox / OneDrive)"** —
reMarkable Connect, Supernote, Boox Onyx Cloud, Notability iCloud +
3rd-party, GoodNotes drive integration in Pro tier. Table-stakes.

**Claim: "Convert handwriting to text"** — reMarkable (built-in),
Supernote (offline HWR via MyScript), Kindle Scribe (AI-powered),
Boox ("Smart Lasso… handwriting-to-text conversion"), Notability
("Math Conversion via MyScript"), GoodNotes ("Convert handwriting
into clean, editable text"). 6 brands. Saturated.

---

## Hidden positioning callouts

This is the explicit deliverable Kam asked for. Brands running
transformations or niche-funnels their homepage hero does NOT lead
with.

### 1. reMarkable is secretly running an ADHD-creator funnel via creator-partner ad cluster, not the homepage

- Hook (verbatim, Jhamil Bader × reMarkable, 9 lib IDs): "As a
  left-brain creative personality type with a strong dose of ADHD,
  it's easy for me to get distracted by social media and a never-
  ending idea list... That's where the @reMarkable Paper Pure comes
  in."
- Homepage hero is "The Paper Tablets for Focused Work." Zero ADHD
  language anywhere on reMarkable's own site.
- This means r/ADHD / ADHD-identified knowledge worker is being
  tested as a sub-niche through creator-paid media, not through
  organic LP. **If the test wins, reMarkable will need an ADHD LP.
  Right now it's an unclaimed surface.**

### 2. reMarkable is secretly running a "gift for college student" / Gen Z career-planning funnel via Max Klymenko + Soldana Music + iJustine

- Hook (verbatim, Max Klymenko × reMarkable): "Ep. 443 - Career
  Ladder 🪜 She has a PRACTICAL and a DREAM job." 13 lib IDs.
- Hook (verbatim, Soldana Music × reMarkable): "@reMarkable makes it
  easy to gift that spark of creativity to those you love."
- Hook (verbatim, iJustine LP): "This could change my life" — 7
  reasons for the Justine Ezarik tech audience.
- Hook (verbatim, Christine Romero-Chan / Digital Trends press-quote
  ad): "This is the kind of gadget I wish I had when I was going to
  school."
- Homepage hero says "focused work." Gen Z gift/career-tool funnel
  lives entirely on creator-partner ads and CLPs.
- The flat-map missed this entirely. **Student angle is actively
  being tested in adjacent brands — flat-map's "students only have
  Supernote, Kindle Scribe, Daylight Kids" attribution is wrong.**

### 3. Light Phone is secretly running a parent-of-pre-teen funnel via the support article + GMA legacy press

- Hook (verbatim, support.thelightphone.com/Parents-Giving-Light-
  Phone-to-Children): "Light Phones are great devices for parents to
  give to children as an alternative to a smartphone." / "The parent
  can set up the Light account for the phone, and control it from
  the Dashboard website."
- Joe Hollier (verbatim, GMA 2018): "the fear of the smartphone
  effects on children is also incredibly concerning."
- Homepage hero is "A tool for a better life" — adult digital-
  minimalist framing. Kids angle has NO homepage surface, but the
  brand actively recommends itself to parents in a support article
  AND has third-party recognition (SafeWise, Wait Until 8th,
  techdetoxbox.com "12 Best Dumb Phones for Kids" all include LP II).
- This is exactly the kind of hidden transformation Kam asked us to
  find. The kid-phone market is dominated by Bark / Gabb / Wisephone
  / Pinwheel — Light Phone is hidden-funnel-adjacent without owning
  it.

### 4. Mudita Kompakt is secretly running a delay-smartphones-for-kids funnel via blog + 3rd-party retail + Gear Diary gift guide

- Hook (verbatim, /blog): "Why Delaying Smartphones for Kids Matters
  + How Kompakt Helps" — "when we delay the smartphone, we're not
  depriving kids of something—we're giving them room to thrive."
- Hook (verbatim, customer testimonial): "great with kids."
- Hook (verbatim, Gear Diary 2025 Holiday Gift Guide): "Sanity-Saving
  Gifts for Parents."
- Forum thread "The Terrible Costs of a Phone-Based Childhood" —
  Jonathan-Haidt-aligned framing.
- Homepage leads with adult digital wellbeing. Kids funnel is in
  blog + community + 3rd-party. **Same hidden sub-funnel pattern as
  Light Phone.**

### 5. Mudita Kompakt is secretly running an EMF / radiation safety funnel via Shield Your Body retail, NOT via its own site

- Hook (verbatim, shop.shieldyourbody.com/products/mudita-kompakt-
  lower-emf-cell-phone-north-america): "The Mudita phone produces
  significantly lower EMF than typical smartphones due to its
  simplified hardware and E Ink display, lacking power-hungry
  processors and constant wireless connections that generate
  radiation in modern phones." + verbatim SAR values.
- Mudita's own site does NOT lead with EMF positioning — that lives
  entirely on the SYB retail page. Mudita supplies the SAR data;
  SYB does the EMF angle. This is a passive co-marketing
  arrangement.
- An EMF-anxious / health-conscious sub-niche is being captured
  through retail partner, with Mudita facing the digital-wellbeing
  niche directly.

### 6. Boox is secretly running a memory-disorder / amnesia / dementia caregiver funnel via a user-story blog + an eye-health pillar post

- Hook (verbatim, /blogs/news/boox-story-how-a-software-designer-and-
  engineer-jan-miksovsky-uses-boox-to-support-a-parent-with-amnesia):
  Jan Miksovsky uses BOOX to support a parent with amnesia.
- Hook (verbatim, /blogs/news/the-e-ink-benefit-for-memory-related-
  conditions): "The E Ink Benefit for Memory-Related Conditions."
- This is a real sub-niche (eldercare / dementia caregiver) that
  reads as a deliberate test — but homepage hero is "Productivity-
  focused ePaper. Google Play built-in."

### 7. Boox is secretly running a fight-dyslexia / accessibility funnel via /blogs/news/fight-dyslexia

- Hook: "5 Features That Help You Fight Dyslexia With BOOX." Live
  blog post. Not in homepage hero, not in ads. Pure SEO-funnel.

### 8. Daylight DC-1 is secretly running a clinical / visual-snow-syndrome / CVS pilot funnel via the screen-flicker blog

- Hook (verbatim, /blog/screen-flicker-101): "Do you suffer from
  severe digital eye strain, computer vision syndrome, or visual snow
  syndrome? If you are interested in trying a DC-1 for 30 days as
  part of the Eye Strain Pilot Study, please send an email to
  drdestefanoOD@gmail.com."
- This is an outright clinical-trial-style sub-funnel routed through
  a third-party clinician. Not on the homepage. Adult DC-1 home
  hero is "calmer relationship with your computer." Visual-snow
  syndrome buyer enters via this single blog post.

### 9. Supernote is secretly running a healthcare / HIPAA professional funnel via /pages/healthcare

- Hook (verbatim): "See how Supernote helps healthcare professionals
  to protect patient data while completing customizable forms..."
- HIPAA compliance claim. Dedicated CTA "Grab first responder
  discount." Not on homepage; lives one nav-click in.

### 10. Supernote is secretly running an outdoor-writer / nomad funnel via Ad 5

- Hook (verbatim, Ad 5 lib 1183712030208554): "Supernote Nomad: The
  outdoor writer's dream device. Sketch wildlife, log your hikes,
  or lose yourself in a great book — all on one tough little
  gadget."
- Nomad outdoor-UGC credits @spence.explore @huntrex_ @avecnicole.
- Homepage Nomad tagline is just "Carry Small. Plan Big." — outdoor
  angle is ad-only.

### 11. GoodNotes is secretly running explicit industry-vertical funnels (Legal / AEC / Marketing / Government) — captured on /ai page only

- Each industry blurb is a one-paragraph pitch on the /ai page (and
  cross-linked to /industries/{legal,aec,marketing-and-events,gov-
  ngo,professional-services}). Homepage hero is "Take Goodnotes
  wherever you work."
- **GoodNotes is the only brand in the corpus running named industry
  verticals at this depth.** That's a hidden positioning move other
  brands haven't matched.

### 12. Kindle Scribe is secretly running a "hard worker / I own the meeting" status-identity funnel

- Hook (verbatim): "The one who 'owns' the meeting, is the one who's
  fully in it." + "The hardest workers need hard-working tools."
- The hard-worker identity angle is 5+ ads each but does NOT appear
  on the PDP meta-description (which leads with feature: "11" glare-
  free display with front light, built-in notebook, AI tools..."). 
  Ad-creative carries an identity-status pitch the LP doesn't.

### 13. iPad has no per-niche LP pivot AT ALL beyond Education + Business + College Students

- This is a negative-space callout: iPad's LP funnel does NOT run
  dedicated "for writers / for journalers / for ADHD / for digital
  minimalists / for parents-of-kids / for faith" pages. Apple
  routes everything through Education + Business + Pro/Air/mini/base
  positioning. **iPad's surface coverage is wide-niche-shallow
  (everyone is the target). Every other niche-specific transformation
  in the corpus is potentially defensible against iPad because
  Apple won't fight at that depth.**

---

## Negative space (transformation × niche cells with ZERO active funnels in the 10-brand dataset)

Verified by reading every brand corpus. The flat-map predicted
"foldable + paper-replacement / foldable + calm / foldable + end-iPad-
kids" as unowned. The 10-brand corpus does not include any foldable
e-ink devices (mooInk V, Bluegen OKPad, Diptyx are in the flat-map but
not in this synth corpus), so foldable-rent analysis is inferential
from brand absence rather than competitive presence. Confirmed
unowned cells:

### Cell A: Focus × parent of K-8 child × foldable form factor

- No brand runs "focus device for your child" with a foldable. Daylight
  Kids owns "low stim for kids" with a slate; no foldable in this
  niche.
- **Foldable-rent verdict:** **available.** Daylight Kids has no
  hardware moat — foldable would be a meaningful form-factor delta.

### Cell B: Replace your paper × ADHD-identified adult

- Closest is reMarkable Jhamil Bader creator ad. No LP. No brand
  owns "the paper-replacement device for ADHD."
- **Foldable-rent verdict:** available; ADHD niche venues
  (r/ADHD, ADHD-anchored creator economy) are well-defined for VOC
  mining and creator targeting.

### Cell C: Calm / wellbeing × foldable

- Light Phone slabs; Daylight DC-1 slate; Mudita slab; Boox Palma
  slate. No foldable e-ink in the calm cell.
- **Foldable-rent verdict:** available. The calm niche values
  pocketability ("Going Light," "your phone away from phone");
  foldable solves a real PMBD ("device fits in pocket but unfolds
  when I want to read").

### Cell D: Eye-health / blue-light-free × foldable

- Boox slates, Daylight slates. No foldable.
- **Foldable-rent verdict:** available but eye-health is already
  Cell 5 saturated by 7+ brands on form-factor-neutral hardware —
  foldable wouldn't move the eye-health needle.

### Cell E: Doomscrolling-cashback / pay-me-to-not-use × broad market

- Light Phone × Noble Mobile is the only experiment. No e-ink-tablet
  brand has copied it. **Defensible if a tablet brand wants it.**

### Cell F: ESA-funded × non-Daylight-Kids brand

- Daylight Kids owns ESA in 10 states. Boox, Goodnotes Education,
  Notability Education are all "free for schools" but do not
  surface ESA-direct mechanics. **A foldable-kids brand could
  immediately accept ESA as differentiation.**

### Cell G: Faith / Bible study × any e-ink tablet (verified absent from this corpus)

- Zero brand-side faith / Bible / devotional copy in any of the 10
  brand corpora. The Faith-market run elsewhere
  (`/runs/eink-tablets/markets/faith/`) found buyer-side demand but no
  brand explicitly markets to it. (Etsy / Bible-journaling YouTube
  creators run buyer-side templates for Kindle Scribe.) **Genuinely
  unowned at brand level.**

### Cell H: Industry-vertical pitch (Legal / Medical / Engineering) × hardware (not app)

- GoodNotes owns Legal/AEC/Marketing/Gov at the app layer. Supernote
  has Healthcare + IT/Engineering + Sales + Business use-case LPs.
  reMarkable has Salesforce / UNESCO / Mainstreet Credit Union case
  studies but doesn't claim verticals. **Industry-vertical hardware
  LP is a defensible move at the e-ink-tablet brand layer beyond
  Supernote's existing use-case stack.**

### Cell I: Travel / pilot / aviation × e-ink hardware

- Boox blog "Digital Nomad" lane is closest. No brand pitches
  cockpit / aviation / pilot directly. iPad has dominated pilots
  for years; an e-ink tablet for aviation (no glare, sunlight-
  readable, long battery) is a defensible vertical.

### Cell J: First-responders / military × e-ink hardware

- Supernote's "Grab first responder discount" is the only surface.
  No first-responder LP. Hero-discount-program is the lever
  Supernote uses.

### Cell K: Confirmed against flat-map predictions

The flat-map listed foldable as unowned in 6 transformations
(think-clearly, replace-paper, calm, eye-health, AI-on-paper, end-iPad-
kids). Cells A, B, C, D above CONFIRM 4 of those (focus / replace-
paper / calm / eye-health) as still unowned in 2026-05-23 corpus.
End-iPad-kids is owned by Daylight Kids on a slate — foldable still
unowned in that cell. AI-on-paper is owned by Kindle Scribe (slates)
and Goodnotes (app) — foldable still unowned.

---

## Vocabulary-discipline issues that could not be resolved in the data

- **"Paper-like feel"** appears in 8/10 brands' copy. Per analyzer
  framework it is a Product-UM that has decayed into a saturated
  minimalism angle. Not a transformation. Has been counted as a claim
  (Cell saturation entry 1) but flagged here for explicit treatment
  as feature-not-outcome.
- **"AI" framing splits muddy** — Cells 3 and 12 partially overlap.
  Cell 3 is "AI as feature inside the note-taking transformation."
  Cell 12 is "AI as the headline transformation itself." Kindle Scribe
  cluster 10 ("Feel of paper AND the power of AI") sits on both
  cells; counted in Cell 3 to avoid double-attribution.
- **"Distraction-free" vs "Calm / Wellbeing"** — every productivity
  brand uses "distraction-free" as a feature; the calm/wellbeing
  brands use it as the transformation. Kept separate (Cell 1 vs Cell
  4) but copy reuse between cells means saturation counts can be
  inflated if not careful.
- **"Replace your paper" vs "Replace your laptop"** — two distinct
  transformations sharing the verb "replace." Kept as Cells 2 and 8.
- **Mudita's anti-AI stance** is itself a positioning claim that
  doesn't fit the AI-augmentation transformation but should be
  recorded for synthesis. Same applies to Light Phone's
  "browser/social-media will never be supported" stance.
- **Boox's polyamory** is a vocabulary problem in its own right —
  ~20+ distinct transformations and the brand has not picked a
  primary. The homepage hero is "Productivity-focused ePaper. Google
  Play built-in." but the active-ad weight is split across calm/
  digital-wellness, nomad, B2B, and feature-spec angles. The synth
  treats this as the brand running all of them simultaneously; a
  strict "primary transformation only" read would be "productivity."

---

## Thin / unresolved brand corpora

These brands' corpora were weak enough to flag synthesis as
incomplete on certain layers:

- **Mudita Kompakt**: site is Cloudflare-blocked. PDP / manifesto /
  blog post bodies are Google-snippet-attested rather than fully
  fetched. Meta Ad Library returned NONE (likely organic-only or
  named under a different page). Pricing + crowdfunding + press +
  customer-review quotes are good; full-body LP copy is fragmented.
- **Light Phone**: thelightphone.com is a JS SPA that returned blank
  bodies to WebFetch. All hero copy comes via Light-published Medium
  mirrors + press attribution. Live popup / cart / press-wall copy
  not directly captured. Active Meta ads confirmed zero (verified on
  correct pageID).
- **Daylight DC-1**: adult-flagship Meta page is dark (0 active
  ads). FAQ bodies render client-side; warranty length / VAT /
  affiliate program terms NOT extractable.
- **iPad**: Meta ad-library sample (71 of ~3,000 ads) contained 0
  iPad creative — saturated by iPhone 17 launch flight at pull-time.
  Web LPs are fully captured but creative-side iPad transformation
  framing is unobservable. Re-run with a deeper page cap or with
  q=iPad filter is needed for a paid-side view.
- **Kindle Scribe**: Amazon storefront pages return 503 to WebFetch.
  PDP body copy comes from `<title>` + meta description + About-
  Amazon press release. Star-rating counts not retrievable.
- **Notability + GoodNotes**: Meta Ad Library run is sandbox-blocked
  this pass — no ads captured. LP coverage and pricing are strong.

---

## Sources

All files read this synthesis:

- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/supernote/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/kindle-scribe/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/remarkable/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/daylight-dc1/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/daylight-kids/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/light-phone/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/mudita-kompakt/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/boox/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/ipad/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md
- /home/kyu3/PMF/runs/eink-tablets/marketing-corpus/notability-goodnotes/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md

Reference / cross-checks:
- /home/kyu3/PMF/definitions.md
- /home/kyu3/PMF/runs/eink-tablets/scripts/analyzer-framework.md
- /home/kyu3/PMF/runs/eink-tablets/scripts/birdseye-synthesizer-brief.md
- /home/kyu3/PMF/runs/eink-tablets/eink-category-evolution/transformations-flat-map.md
