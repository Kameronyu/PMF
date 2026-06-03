# Daylight DC-1 — Winning Message Analysis

**Brand:** Daylight Computer Co. (adult flagship DC-1 only — Daylight Kids excluded)
**Slug:** daylight-dc1
**Analysis date:** 2026-05-25 (today)
**Purpose:** Extract winning sales messages verbatim for portability to a different funnel (email + deposit pre-launch event for a foldable programmable e-ink tablet).

---

## Top-of-doc summary

**Ad longevity inventory — critical finding:** The Meta Ad Library scrape (`/home/kyu3/PMF/runs/eink-tablets/adlibrary/Daylight.txt`, 12,042 lines, 64 ad blocks) contains **only 2 ads that actually belong to Daylight Computer Co.**, and **both are Daylight Kids creatives** (Library IDs `25449345561351571` and `1387928046359715`, both started Dec 18, 2025 = 158 days active). Both are excluded by the user's scope filter (destination URL = KIDS.DAYLIGHTCOMPUTER.COM). The remaining 62 ads in the file are keyword-collision spam (`Iris Computer`, `Sahara Computer Lda`, `Gaby AutoExpert`, `OxyClinic`, `Zeria`, and a long tail of 57 "Peggy Emilyu Prince" cheating-spouse story-ads where the word "daylight" appears in the body coincidentally). A separate page-targeted scrape (`daylight_adv.txt`) confirms zero active adult-DC-1 ads on the official "Daylight Computer" Meta page (pageID 575419519610777, 59.9K followers). A keyword scrape (`daylight-kw_adv.txt`) for "Daylight Computer DC-1 tablet" resolved zero advertisers.

**Adult DC-1 has no live Meta paid social acquisition at the scan window.** The funnel runs entirely on PR, podcast circuit (Joe Rogan Experience demo by Danny Jones, 2025), tech press (Wired, The Verge, Tech Radar, Daring Fireball), Hacker News, founder interviews, and organic. **There are zero "180+ days active" or "60-179 days active" DC-1 ad creatives to mine.** The longest-running Daylight-owned creatives are the 158-day Kids ads, which are out of scope.

**This document therefore re-weights the analysis toward the LP corpus, blog editorial, press quotes, founder narrative, and testimonial verbatim — which is where Daylight's adult message lives.** Section 3 is built from LP hero/section copy and blog post hooks (the closest analog to "ads" in Daylight's funnel) rather than Meta ad bodies.

**Total assets analyzed:**
- 3 LP screenshots captured 2026-05-24 (homepage, /product, /blog/screen-flicker-101)
- 8 additional LPs documented in `landing-pages.md` (FAQ, cart, blog index, sleep-101, blue-light-101, support hub, getting-started, press kit)
- 1 Meta Ad Library scrape (64 entries; 2 in-scope after filtering for Daylight ownership; both Kids = 0 in-scope after the adult-only scope filter)
- Existing `granular-analysis.md` (48KB) as cross-reference baseline

**Top 3 LPs in scope (in order of belief-installation depth):**
1. `daylightcomputer.com` (homepage) — primary frame, founder narrative, social proof wall, ecosystem vision
2. `daylightcomputer.com/blog/screen-flicker-101` (17,691 chars editorial — the deepest belief-build asset)
3. `daylightcomputer.com/product` (PDP — feature/spec/objection density, $729 price reveal, ADD TO CART)

**One-line thesis of this analysis:** Daylight does not run direct-response ads. Their belief work is done in a 4-stage organic-PR funnel — (1) earned press credentialing the "humane computing" thesis, (2) homepage installing the "device-induced harm" pain frame + "PBC mission" identity flatter, (3) a 17KB educational blog that converts skeptics via science citations + clinical pilot + verified-expert quote, (4) a $729 single-SKU checkout with a 30-day refund. Sections 1-7 below extract the verbatim language at each layer.

---

## Section 1 — Avatar + awareness

### Revealed avatar (read between the lines)

Daylight's stated targeting is "general health-conscious adults." Their **revealed** avatar is much narrower: a tech-literate knowledge worker (often in or adjacent to tech itself), 28-45, who already buys "tools for thought" (Notion, Kindle, reMarkable, Kobo), who has internalized a critique of Big Tech, who has the disposable income to spend $729 on a single-purpose secondary device, and who experiences screen-induced symptoms (eye strain, sleep disruption, fatigue, attention fragmentation) that they have NOT been able to resolve by cutting screen time. The avatar is also identity-vulnerable around being "a person who is too online" and is reaching for a product that lets them keep functioning in the digital world without paying the personal cost.

The clinical-population avatar is a secondary segment surfaced on the flicker blog: people suffering from **digital eye strain, computer vision syndrome, or visual snow syndrome** — i.e., people for whom screens are not just annoying but actually disabling. The Tiffany Yang testimonial ("return to medical school after a multi year absence") and the Eye Strain Pilot Study CTA make this avatar explicit.

### Sub-niche signals (jargon, demographic tells, identity markers)

- **"PBC" / "double bottom line" / "shareholder mandate" / "systematic forces"** — Anjan Katta's founder message uses the in-group language of impact-tech founders and B-Corp-literate readers. This is not consumer copy. It assumes the reader knows what a PBC is.
- **"techno-hippies"** — Wired's framing, which Daylight surfaces on the homepage as a press quote. Targets a coastal-US, post-Stewart-Brand cultural identity (Burning Man + Esalen + Whole Earth Catalog).
- **"Live Paper™"** — a coined term that signals to the reader "this is a category-creator, not a knockoff." Specifically targets buyers fluent enough in display tech to recognize that "E Ink ≠ paper-like ≠ live paper" is a positioning claim.
- **"Sol:OS"** — a custom-OS branding for a forked Android. Targets the kind of buyer who cares whether their device runs vendor-stock software vs. a thoughtful fork.
- **Notion, Kindle, Kobo, Libby, Google Docs** named on the PDP — signals to "I live in PDFs, e-books, notes apps, and a writing tool." Not a generalist consumer.
- **"@drhaswell — Exec Coach"** as the only above-fold testimonial on the PDP — the avatar trusts executive coaches, not Instagram influencers.
- **"IGZO TFT" / "DC dimming" / "PWM" / "240Hz vs 1000Hz" / "IEEE 1789"** — the screen-flicker blog uses electrical-engineering jargon without translating it. The avatar either already speaks this language or is the kind of person who reads 12 minutes of it because they want to be persuaded by science, not slogans.
- **"6 years developing the technology"** in the press kit — the avatar respects R&D pedigree.
- **"Can I pay in BTC?"** as a top FAQ — signals a crypto-curious, privacy-minded subculture.
- **Joe Rogan / Danny Jones demo** as the launch's biggest media moment — signals overlap with the "podcast-listening, longform-curious, mainstream-IDW-adjacent" male demographic.

### Awareness level (Schwartz)

Daylight's corpus is **predominantly solution-aware drifting toward product-aware**, with one notable shift:

- **Homepage** (`The computer, de-invented` / `A new kind of computer, designed for deep focus and wellbeing`) — assumes the reader already accepts that current computing is bad for them. No problem-aware setup. The hero installs "there is a new category" framing, which only lands on a solution-aware reader.
- **Product page** (`The world's first human-friendly computer that your brain and eyes will actually love`) — pure product-aware. Headlines the product superlative.
- **Blog (`screen-flicker-101`)** — this is the **only problem-aware-down-to-unaware asset** in the corpus. It opens with "Tired eyes and a drained mind are almost a universal feeling at the end of a work day" and walks the reader from symptom → mechanism (PWM) → category (flicker-free) → product (DC-1). This is where Daylight does the unaware-to-aware lift.
- **Blog (`sleep-101`, `blue-light-101`)** — same pattern. Health-frame top-of-funnel that bridges to product-aware bottom-of-funnel.

The shift: homepage assumes high awareness; blog rebuilds awareness from scratch. The architecture suggests Daylight's organic acquisition relies on the blog (SEO, share, link) for unaware→solution-aware lift, then the homepage for solution-aware→product-aware closure.

### Implied "before state" of the reader at the moment of seeing the ad/page

The reader (at homepage hit) is in one of these states:
1. **Tired and resentful of their primary device.** "Tired eyes and a drained mind are almost a universal feeling at the end of a work day."
2. **Trying and failing to reduce screen time.** "Cutting screen time is not always possible."
3. **Distrustful of Big Tech but still dependent.** The founder message validates: "big tech do bad not cuz of who runs them, but because of the systematic forces they're beholden to."
4. **Looking for a device that does not require trading off connectivity for health.** "without sacrificing your health and focus."
5. **Already a customer of focus / minimalist devices in adjacent categories** (Kindle, reMarkable, Boox, Freewrite) and wants something with more software flexibility.

### Implied identity being flattered/validated

- **"A more caring computer company"** — flatters the buyer's identity as someone who CARES about what they consume, not just what they consume.
- **"deep focus and wellbeing"** — flatters identity as a serious knowledge worker who values cognitive performance.
- **"A sacred space for focused writing"** — uses the word "sacred." Flatters the writer-identity reader.
- **"the simplicity back to our digital life"** — Waqas Ali testimonial. Flatters the reader who feels their digital life has become complex/loud/intrusive.
- **"To help technology and humanity live happily ever after"** — flatters the reader as someone who participates in a moral project by buying the product.
- **"It's the only computer I feel comfortable sharing with my kids"** — Akshay Kothari testimonial. Flatters the reader who self-identifies as a thoughtful parent — but read carefully, this also flatters the reader as someone who is in the same league as the co-founder of Notion.

### 5-10 verbatim avatar-reveal lines

> "We refuse to accept a future where our devices are exhausting, addictive, and distracting" — homepage hero, `daylightcomputer.com/`. (Assumes the reader already shares this refusal — selects for the buyer who agrees on contact.)

> "Use all your favorite apps without the distractions—it's the best of both worlds." — homepage Apps section, `daylightcomputer.com/`. (Reveals the avatar's specific objection: they will NOT give up their apps to get focus.)

> "Tired eyes and a drained mind are almost a universal feeling at the end of a work day. That is, if you work a job that requires you to be in front of a computer screen all day… which today is most of us." — `/blog/screen-flicker-101`. (Reveals the avatar as a desk-bound knowledge worker — and uses "most of us" to make the universal-pain pitch.)

> "Do you suffer from severe digital eye strain, computer vision syndrome, or visual snow syndrome?" — `/blog/screen-flicker-101`, Pilot Study CTA. (Names the clinical sub-niche explicitly.)

> "For someone with eye disability, the DC-1 is a dream device. The display is so soft and smooth on my eyes that I was able to take my life back off of hold and return to medical school after a multi year absence." — Tiffany Yang, Medical student. (Reveals the high-need clinical avatar — and the transformation language is "take my life back off of hold," which is heavy identity work.)

> "Web browsing, Spotify, spreadsheets, even YouTube! This device allows you to remain connected in our digital world, without sacrificing your health and focus." — Getting Started guide, `support.daylightcomputer.com/getting-started`. (Reveals the avatar's fear of disconnection and the brand's promise to neutralize it.)

> "Daylight gets it, a computer that brings the simplicity back to our digital life." — Waqas Ali, Founder @Atoms. (The word "gets it" flatters the in-group buyer — Daylight understands me, others don't.)

> "There is simply no better device out there right now for reading long-form, navigating knowledge archives or the night sky, panning around, zooming and marking up PDFs, and writing." — :~# (Founder @UrsaBio). (Specifies the exact use-cases the avatar already does — long-form reading, knowledge archives, astronomy, PDFs, writing — high-conscientiousness adult.)

> "One of the few screens I feel happy giving to my kids. Just a totally different vibe." — @drhaswell, Exec Coach (PDP above-fold testimonial). (The word "vibe" flatters the avatar's intuitive/aesthetic sensibility; the parental frame attaches the device to identity-as-good-parent.)

> "Stay connected with yourself and what's around you" — homepage Display section. (Identity flatter: you are someone who wants connection to self and environment, not to the algorithm.)

> "It's fast and beautiful, like a trim little boat." — Soleio (Early Design @Meta @Dropbox). (Aesthetic-elite reader appeal — the comparison is sailboats, not gadgets. Targets the design-conscious tech buyer.)

---

## Section 2 — Claim inventory

### Headline / transformation claims (verbatim)

> "The computer, de-invented" — homepage hero. Headline claim is **identity-of-category** (this is not a better laptop, it is a categorically different artifact).

> "Meet DC-1. A new kind of computer, designed for deep focus and wellbeing." — homepage hero sub. Transformation promise: deep focus + wellbeing.

> "Introducing Daylight — a healthier, more human-friendly computer" — homepage hero. Comparative claim ("healthier" implies than alternatives).

> "The world's first full-speed paper-like display" — homepage Display section. Superlative ("world's first") + qualifier ("full-speed") that pre-empts the E-Ink-is-slow objection.

> "The world's first human-friendly computer that your brain and eyes will actually love." — PDP hero, `/product`. Superlative + sensory body promise ("brain and eyes will actually love" — "actually" implies the reader's current device does not love them back).

> "the most sleep-friendly device that you can buy" — `/blog/sleep-101` (referring to DC-1). Superlative.

> "the world's first blue light free computer" — `/blog/blue-light-101`. Superlative.

> "The Daylight Computer: 100% Flicker Free" — `/blog/screen-flicker-101`. Quantified absolute.

> "A more caring computer company" — homepage footer/who-we-are. Identity-of-brand claim.

### Supporting / proof claims (verbatim)

> "We invented a new type of display that's like E Ink, but faster. It looks and feels like paper, but runs at 60fps, so you can work fluidly, and use all your apps without compromise." — homepage Use-cases section. Mechanism + comparison + objection-handle stacked.

> "Scroll, zoom, turn pages—even watch video— without any lag" — homepage Display section. Specific capability claim.

> "Read in broad daylight with a screen that uses the sun as its backlight." — homepage Outdoor section. Metaphor reframing the lack of a backlight as a feature.

> "Most devices emit blue light that affects your circadian rhythm, even in night mode. Daylight doesn't." — homepage Outdoor section. Comparative + concession ("even in night mode") that defuses the "but I use night mode" objection.

> "Days of use on a single charge" — homepage Outdoor section. Qualitative battery claim.

> "20-60 hours" battery life — `/blog/blue-light-101`. Quantitative version of the same claim.

> "100% flicker-free device using DC dimming, monochrome display, and IGZO TFT technology" — `/blog/screen-flicker-101`. Quantified absolute + three-mechanism stack.

> "DC Dimming maintain consistent light output by adjusting direct electrical current." — `/blog/screen-flicker-101`. Mechanism-as-proof.

> "Flicker testing yielded a perfect result using my highly sensitive audio-based flicker meter and the photodiode based FFT testing method: not even a trace of light modulation could be demonstrated with both methods!" — Dr. Alexander Wunsch (M.D., P.hD), Light Scientist, `/blog/screen-flicker-101`. Expert-verified proof claim.

> "Has zero temporal dithering, as is a monochrome display" — `/blog/screen-flicker-101`. Quantified absolute.

> "Uses Indium Gallium Zinc Oxide (IGZO) TFT Technology" — `/blog/screen-flicker-101`. Mechanism credential.

> "At 60 frames per second, using the Reader app is very comfortable" — Getting Started, `support.daylightcomputer.com/getting-started`. Quantitative + sensory.

> "Adjust the amber setting - using our patented hardware - to get the perfect warmth for your screen." — Getting Started. Mechanism + "patented" credential.

> "blue wavelengths can suppress melatonin 3 to 4 times more" — `/blog/sleep-101`. Quantified science claim used to motivate the amber-backlight feature.

> "six years developing the technology" — Press Kit. R&D pedigree.

### Implicit claims (what copy + framing imply without stating)

- **"The computer, de-invented"** implies that the current category of computer is over-engineered and that the buyer's existing device is part of the problem.
- **"A more caring computer company"** implies that other computer companies do not care about their users — uses the buyer's animus toward Big Tech without naming names.
- **"Daylight is a Public Benefit Co."** implies fiduciary alignment — the buyer's interests will not be compromised by shareholder pressure.
- **The 30-day money-back guarantee** (verbatim: "Return your DC-1 within 30 days for a full refund.") implies "we are confident enough that we are willing to take the cost back."
- **"✓ In stock · Ships in 3-5 business days"** placed prominently and repeated implies past scarcity (correct — first batches sold out in 24h per Finesse case study), but reframes it as availability now. The signal is "if you've been waiting, the wait is over."
- **The named-founder testimonials (Notion co-founder, Atoms founder, Soleio, UrsaBio founder)** imply social validation by tech peers — Daylight is what insiders use.
- **Joe Rogan Experience demo (per Wikipedia/partnerships.md)** implies mainstream cultural validation beyond the Bay Area tech bubble.
- **The clinical pilot study with Dr. Destefano** implies "we have skin in the game on the health claims — we'd rather measure than just market."
- **"Inspired Internet Pledge" signatory** implies institutional/civic alignment with humane-tech movement.

### Specificity grade per major claim

| Claim | Type | Specificity grade |
|---|---|---|
| "deep focus and wellbeing" | aspirational | LOW (vague) |
| "world's first full-speed paper-like display" | superlative | MEDIUM (qualified by "full-speed" but not benchmarked) |
| "60fps" | quantified | HIGH (number) |
| "60Hz refresh rate" | quantified | HIGH (number) |
| "100% flicker-free" | quantified absolute | HIGH (absolute + mechanism) |
| "DC dimming + monochrome + IGZO TFT" | mechanism stack | HIGH (three named technologies) |
| "blue wavelengths can suppress melatonin 3 to 4 times more" | quantified science | HIGH (number + cited mechanism) |
| "Days of use on a single charge" | qualitative duration | LOW (vague) |
| "20-60 hours" battery | quantified duration | HIGH (range) |
| "the most sleep-friendly device that you can buy" | superlative | LOW (not benchmarked) |
| "not even a trace of light modulation could be demonstrated" | expert verbatim | HIGH (named M.D./PhD + method) |
| "1600 x 1200 • 190dpi" | spec | HIGH |
| "8GB RAM / 128GB / Helio G99 / 8000mAh" | spec | HIGH |
| "1.2 lbs (550g)" | physical | HIGH |
| "$729" | price | HIGH |
| "30-day full refund" | guarantee | HIGH |
| "Ships in 3-5 business days" | logistics | HIGH |
| "six years developing the technology" | R&D | MEDIUM (time only, no headcount/spend) |
| "$12 million investment from current and former executives of companies such as Oculus, Pinterest, and Dropbox" | funding | HIGH |
| "a healthier, more human-friendly computer" | aspirational | LOW |
| "designed for deep focus and wellbeing" | aspirational | LOW |

Pattern: **the homepage runs LOW-specificity aspirational claims; the blog and press kit run HIGH-specificity mechanism + science claims.** This is the architecture choice — aspiration to attract, science to convert.

### Time-to-result claims

- **"It took a couple of weeks to transition all my work screen time to the DC-1, but when I did, my eye strain completely went away."** — Juan Diego testimonial. ~2 weeks to symptom relief.
- **"return to medical school after a multi year absence"** — Tiffany Yang testimonial. Open-ended dramatic timeline.
- **"DC-1 for 30 days as part of the Eye Strain Pilot Study"** — pilot study CTA implies 30-day evaluation window.
- **"Return your DC-1 within 30 days for a full refund"** — guarantee window doubles as implied evaluation period.

Pattern: Daylight does NOT promise instant gratification. The implied timeline is "weeks to relief, full benefit over months." This is unusual for DR and probably possible only because the brand sells primarily through earned media + organic, where slow-promise copy doesn't get out-cranked by faster competitor ads.

### Universality vs. qualified claims

Most Daylight claims are **universal in tone but qualified by use-case** ("when you", "designed for", "for those suffering from"). The brand avoids "guaranteed to fix your eye strain" type promises. The Juan Diego testimonial says "my eye strain completely went away" but as a user testimonial, which legally and rhetorically is weaker (and safer) than a brand claim.

### The brand's single thesis claim — verbatim

If you stripped Daylight to one sentence, this is it:

> **"a healthier, more human-friendly computer"** — homepage hero, `daylightcomputer.com/`.

Adjacent runners-up that compete for thesis-claim status:

> **"The computer, de-invented"** — same hero. (Functions as the rhetorical hook; the operational thesis is "healthier, more human-friendly.")

> **"The vision for Daylight is to build a whole ecosystem of healthier, more humane computers that respect our health, attention, and freedom."** — homepage Ecosystem section. (The vision expansion of the thesis.)

> **"To help technology and humanity live happily ever after."** — Anjan Katta founder message. (The mission statement.)

The thesis they stake their identity on is **"healthier, more human-friendly."** Everything else — flicker-free, blue-light-free, sunlight-readable, distraction-free, Live Paper — is mechanism in service of this thesis.

### 5+ saturation check (from broader e-ink tablet market — cross-reference to granular-analysis baseline)

| Claim | DC-1 | Also widely claimed in e-ink category? |
|---|---|---|
| "paper-like display" | YES | YES — Boox, reMarkable, Supernote, Kindle Scribe all claim this |
| "eye-friendly" / "easy on the eyes" | YES | YES — every e-ink brand |
| "distraction-free" | YES | YES — reMarkable's primary frame, Freewrite, Supernote |
| "focused writing" | YES | YES — Freewrite, reMarkable |
| "long battery life" | YES | YES — universal e-ink claim |
| "flicker-free" | YES | NO — most e-ink brands don't make this an explicit claim (because most e-ink panels are flicker-free by default, but they don't market it). Daylight makes it a primary differentiator. |
| "blue-light free" | YES | PARTIAL — some brands offer warm front-light; Daylight goes further with "amber backlight, zero blue light" |
| "DC dimming / no PWM" | YES | NO — almost no consumer brand markets DC dimming. This is an unusual claim. |
| "IGZO TFT" | YES | NO — engineering-grade claim, not seen elsewhere |
| "60fps" | YES | NO — biggest spec-differentiator vs E-Ink-based competitors |
| "world's first" | YES | PARTIAL — many e-ink brands claim firsts on narrow features; Daylight stacks multiple "world's first" claims (full-speed paper-like, blue-light-free, human-friendly) |
| "public benefit corporation" | YES | NO — unique brand-level identifier in the e-ink category |
| "designed in California / SF founder mission" | YES | NO — most e-ink brands are Chinese; Daylight's SF/PBC framing is differentiated |

**Non-saturated (differentiated) Daylight claims:** flicker-free + DC dimming + IGZO TFT + 60fps + PBC + founder-mission framing + named clinical pilot.
**Saturated (parity) Daylight claims:** paper-like + eye-friendly + distraction-free + long battery + focused writing.

The differentiation is concentrated in the mechanism + identity layer, not the benefit layer.

---

## Section 3 — ALL exact headlines + every verbatim hook

**Caveat for the user:** as documented in the top-of-doc summary, there are zero in-scope DC-1 Meta ads, so the "ad longevity bands" cannot be populated. The two Daylight-owned ads in the corpus are Kids creatives (excluded by scope filter). The longest-running, in-scope creative assets are the LANDING PAGES themselves — homepage in production since May 2024 (~365+ days), blog posts (April-November 2025), and PDP. Treat the LP hero/section copy as the proven control set. This section therefore inventories every verbatim hook, headline, and CTA across the LP + blog + press + testimonial corpus.

### 3A — Single (proven, only) ad creatives owned by Daylight Computer Co.

| Hook (verbatim, first line) | Library ID | Start Date | Days Active | Destination URL | In scope? |
|---|---|---|---|---|---|
| "Introducing, Daylight Kids. A movement to create happier, healthier, and smarter children." | 25449345561351571 | Dec 18, 2025 | 158 | KIDS.DAYLIGHTCOMPUTER.COM | NO (Kids) |
| "Introducing, Daylight Kids. A movement to create happier, healthier, and smarter children." (identical body, different video cut) | 1387928046359715 | Dec 18, 2025 | 158 | KIDS.DAYLIGHTCOMPUTER.COM | NO (Kids) |

**In-scope adult DC-1 ads:** 0.

### 3B — LP hero headlines (proven, in production)

| Headline (verbatim) | LP | Position |
|---|---|---|
| "The computer, de-invented" | homepage | hero H1 |
| "Meet DC-1. A new kind of computer, designed for deep focus and wellbeing." | homepage | hero sub |
| "We refuse to accept a future where our devices are exhausting, addictive, and distracting" | homepage | hero (manifesto line) |
| "Introducing Daylight — a healthier, more human-friendly computer" | homepage | hero (intro line) |
| "Daylight | A More Caring Computer" | homepage | page title (SEO/tab) |
| "Daylight DC-1" | /product | PDP hero H1 |
| "The world's first human-friendly computer that your brain and eyes will actually love." | /product | PDP hero sub |
| "Daylight | The Fast 60fps E-paper and Blue-Light Free Tablet" | /product | page title (SEO/tab) |
| "Light Flicker — Why your screen turning on & off 500 times a second is not good for your brain" | /blog/screen-flicker-101 | blog hero H1 |
| "AND WHY WE CREATED A FLICKER FREE COMPUTER" | /blog/screen-flicker-101 | blog hero sub (all-caps) |
| "How to Get Your Best Night's Sleep" | /blog/sleep-101 | blog hero H1 |
| "The Definitive Guide to Blue Light" | /blog/blue-light-101 | blog hero H1 |
| "High-quality sleep is the foundation of a healthy lifestyle. It's the time when we recharge and restore - so we can attack the next day with the full capability of our being." | /blog (index) | blog index intro |

### 3C — LP section sub-headlines (verbatim, exhaustive)

| Sub-headline (verbatim) | LP | Section |
|---|---|---|
| "The world's first full-speed paper-like display" | homepage | Display section |
| "Smooth interactions" | homepage | Display tile 1 |
| "Scroll, zoom, turn pages—even watch video— without any lag" | homepage | Display tile 1 body |
| "A calm experience" | homepage | Display tile 2 |
| "Stay connected with yourself and what's around you" | homepage | Display tile 2 body |
| "For your health" | homepage | Display tile 3 |
| "Say goodbye to eye-strain—designed for full sunlight and nighttime" | homepage | Display tile 3 body |
| "A distraction-free space for learning & creativity" | homepage | Use-cases header |
| "Live Paper display" | homepage | Use-cases sub |
| "We invented a new type of display that's like E Ink, but faster. It looks and feels like paper, but runs at 60fps, so you can work fluidly, and use all your apps without compromise." | homepage | Use-cases body |
| "Reading" — "Your new favorite reading app for books and documents" | homepage | Use-cases tile |
| "Note-taking" — "Write, draw and annotate on a fast, paper-like surface" | homepage | Use-cases tile |
| "Writing" — "A sacred space for focused writing without distraction" | homepage | Use-cases tile |
| "With all the apps you need" | homepage | Apps section header |
| "Use all your favorite apps without the distractions—it's the best of both worlds." | homepage | Apps section body |
| "The vision for Daylight is to build a whole ecosystem of healthier, more humane computers that respect our health, attention, and freedom." | homepage | Ecosystem section |
| "outdoor computing" | homepage | Outdoor section eyebrow |
| "it's a computer you can use outside" | homepage | Outdoor section header |
| "Read in broad daylight with a screen that uses the sun as its backlight." | homepage | Outdoor body line 1 |
| "DC-1 lights up beautifully outdoors without distracting reflections, so you can read outside any time of the day." | homepage | Outdoor body line 2 |
| "No eye-strain" — "Flicker-free display is easy on the eyes" | homepage | Outdoor tile |
| "Extended battery" — "Days of use on a single charge" | homepage | Outdoor tile |
| "Backlight optional" — "Read in direct sunlight, no backlight needed" | homepage | Outdoor tile |
| "Goodbye, blue light" — "Most devices emit blue light that affects your circadian rhythm, even in night mode. Daylight doesn't." | homepage | Outdoor tile |
| "Better sleep" — "In sync with your circadian rhythm" | homepage | Outdoor tile |
| "Flicker-free" — "PWM-free display means no eye strain" | homepage | Outdoor tile |
| "Pure amber" — "Campfire spectrum with zero blue light" | homepage | Outdoor tile |
| "Dive deeper into Daylight" | homepage | Deeper exploration header |
| "Dive deeper into every section on the site and find what you are looking for." | homepage | Deeper exploration body |
| "What people are saying" | homepage | Testimonial wall header |
| "know more about daylight on:" | homepage | Press logo bar |
| "Daylight is a Public Benefit Co." | homepage | Founder section header |
| "DC-1 AT A GLANCE" | homepage | Spec block header (all-caps) |
| "Fast, paper-like display" | homepage | DC-1 at a glance |
| "Read, write, take notes" | homepage | DC-1 at a glance |
| "Use all your apps" | homepage | DC-1 at a glance |
| "Sunlight readable" | homepage | DC-1 at a glance |
| "Blue-light free backlight" | homepage | DC-1 at a glance |
| "A more caring computer company" | homepage | Footer "Who we are" |
| "Key Features" | /product | PDP feature header |
| "Soft on the eyes" | /product | PDP key features tile |
| "What's Included" | /product | PDP order details header |
| "Order Details" | /product | PDP order details header |
| "30-Day Guarantee" — "Return your DC-1 within 30 days for a full refund." | /product, /cart | PDP guarantee block |
| "Shipping Timelines" — "New orders ship within 3-5 business days." | /product, /cart | PDP guarantee block |
| "Secure Payments" — "Your payment is secure and encrypted." | /cart | Guarantee panel |
| "Software Updates" — "Regular OS updates and new features coming soon." | /cart | Guarantee panel |
| "Daylight is for every day" | /product | Use-cases section header |
| "Read and annotate PDFs" — "Our custom reader app lets you smoothly scroll, zoom, and annotate PDFs" | /product | Use-case tile |
| "Take free-form notes" — "Write, draw, and diagram open-ended notes, just like a normal piece of paper" | /product | Use-case tile |
| "Browse the web" — "Read articles and navigate the web using your favorite web browser" | /product | Use-case tile |
| "Bring all your e-books" — "Read all the books from your collections with the Kindle, Kobo, and Libby apps" | /product | Use-case tile |
| "Write without distractions" — "Connect a keyboard to create a typewriter-like experience with any app." | /product | Use-case tile |
| "Smooth video playback" — "Watch videos without ghosting in deliberately boring black and white" | /product | Use-case tile |
| "Read and edit your docs" — "Use Google Docs, Notion, and other document editors on a paper-like display" | /product | Use-case tile |
| "Use your favorite drawing apps" — "The stylus and paper-like finish offer a satisfying drawing experience." | /product | Use-case tile |
| "Bring all your favorite apps" | /product | Apps header |
| "All the apps you need in one place. Install anything available on Android." | /product | Apps body |
| "Product Specs" | /product | Spec block |
| "Action buttons" — "Action buttons for quick access and page turns. Customizable." | /product | Spec tile |
| "Extended battery life" — "Enough battery to last you days on a single charge." | /product | Spec tile |
| "Stylus compatibility" — "Wide compatibility across a broad range of Wacom EMR pens." | /product | Spec tile |
| "A silent epidemic in a LED-driven world" | /blog/screen-flicker-101 | Section header |
| "FLICKER: AN INVISIBLE ISSUE" | /blog/screen-flicker-101 | Section header (all-caps) |
| "What is flicker?" | /blog/screen-flicker-101 | Section header |
| "What causes flicker in smartphones and computers?" | /blog/screen-flicker-101 | Section header |
| "PWM Flicker on OLED screens vs LCD screens" | /blog/screen-flicker-101 | Section header |
| "THE HEALTH RISK OF FLICKERING DEVICES" | /blog/screen-flicker-101 | Section header (all-caps) |
| "Other causes of flicker" | /blog/screen-flicker-101 | Section header |
| "The Daylight Computer: 100% Flicker Free" | /blog/screen-flicker-101 | Product-pivot section header |
| "HOW THE DC-1 ACHIEVES A FLICKER FREE DISPLAY:" | /blog/screen-flicker-101 | Sub-header (all-caps) |
| "Our eye-strain pilot study" | /blog/screen-flicker-101 | Pilot study section |
| "MORE PARTICIPANTS NEEDED" | /blog/screen-flicker-101 | Pilot study sub (all-caps) |
| "Our favorite ways to reduce digital eye strain" | /blog/screen-flicker-101 | Tip-list section |
| "Dive deeper with our curated resources" | /blog/screen-flicker-101 | Resource list section |

### 3D — Button / CTA copy verbatim across the funnel

| CTA copy (verbatim) | Funnel location | Purpose |
|---|---|---|
| "ORDER NOW" (all-caps) | homepage above-fold, footer, repeated; all blog posts; PDP footer | primary purchase CTA |
| "Order now" (sentence case) | /cart accessory upsell | secondary purchase CTA |
| "ADD TO CART" (all-caps) | /product above-fold | PDP primary CTA |
| "Add +" | /cart | accessory add CTA |
| "SUBSCRIBE" | homepage, all blog posts | newsletter capture CTA |
| "Sign up for updates, guides and more resources. No spam." | homepage, all blog posts | newsletter capture context line |
| "GET UPDATES · NO SPAM" | homepage above-fold (newsletter eyebrow) | newsletter capture eyebrow |
| "✓ IN STOCK · SHIPS IN 3-5 BUSINESS DAYS" | homepage above-fold | availability reassurance |
| "Ships within 3-5 business days" | all page footers | logistics reassurance |
| "View full specs" | /product | secondary navigation CTA |
| "TAKE A PEEK ↗" | homepage (above-fold) | navigates to Daylight Kids cross-sell |
| "Send WhatsApp message" / "Send message" / "Book now" / "Call now" / "Shop now" | (Daylight Kids only, plus keyword-collision spam ads) | not in adult-DC-1 scope |

CTA pattern: Daylight uses ONE primary CTA verb across the entire adult funnel — **"Order now."** The PDP swaps to "ADD TO CART" only above-fold (because there's a quantity selector with +/-/$729 directly above it). Everywhere else: order now. No "Buy now" / "Get yours" / "Reserve" / "Pre-order" / "Join the waitlist" — the brand commits to a single, neutral, purchase verb.

### 3E — Hook taxonomy (classification of major LP/blog hooks)

| Hook (verbatim) | Hook type | Notes |
|---|---|---|
| "The computer, de-invented" | pattern interrupt + contrarian | reverses category language ("de-" prefix); inverts product = invention assumption |
| "We refuse to accept a future where our devices are exhausting, addictive, and distracting" | manifesto + problem-agitation | "we refuse" creates moral stance |
| "A new kind of computer, designed for deep focus and wellbeing" | category-creation + transformation promise | claims new category, names two outcomes |
| "The world's first human-friendly computer that your brain and eyes will actually love." | specific-claim + superlative + sensory | "actually love" smuggles in the implicit comparison |
| "The world's first full-speed paper-like display" | specific-claim + superlative + objection-handle | "full-speed" pre-empts "e-ink is too slow" |
| "Light Flicker — Why your screen turning on & off 500 times a second is not good for your brain" | curiosity + specific-claim + problem-agitation | the "500 times a second" is the pattern-interrupt number |
| "AND WHY WE CREATED A FLICKER FREE COMPUTER" | authority-stack + product-pivot | the all-caps shift signals "this is where we get to the product" |
| "A silent epidemic in a LED-driven world" | problem-agitation + curiosity | "silent epidemic" is heavy frame |
| "FLICKER: AN INVISIBLE ISSUE" | curiosity + pattern interrupt | "invisible" hooks the reader to keep reading |
| "How to Get Your Best Night's Sleep" | curiosity + specific-claim | conventional sleep blog hook |
| "The Definitive Guide to Blue Light" | authority-stack | "definitive guide" frame |
| "Goodbye, blue light" | contrarian + pattern interrupt | the farewell frame |
| "outdoor computing" / "it's a computer you can use outside" | contrarian + specific-claim | re-categorizes the device |
| "Use all your favorite apps without the distractions—it's the best of both worlds." | objection-handle + before-after | concedes objection in clause 1, resolves it in clause 2 |
| "Daylight is a Public Benefit Co." | authority-stack + identity | credential as headline |
| "It's the only computer I feel comfortable sharing with my kids!" (Kothari testimonial) | social-proof + objection-handle (parental) | parental frame doubles as wholesomeness signal |
| "For someone with eye disability, the DC-1 is a dream device... return to medical school after a multi year absence." (Yang testimonial) | story + before-after + social-proof | strongest single piece of copy in the corpus |
| "Do you suffer from severe digital eye strain, computer vision syndrome, or visual snow syndrome?" (pilot CTA) | callout + problem-agitation | direct callout to named clinical sub-niche |

### 3F — Pattern observation across hooks

Across the homepage + product + blog corpus, **the repeated hook archetypes are:**

1. **Category-creation framing** (3 instances: "de-invented" / "new kind of computer" / "world's first full-speed paper-like display") — Daylight repeatedly forces the reader to encounter the product as a new category, not a comparable.
2. **"World's first" + qualifier** (3 instances: "world's first full-speed paper-like display" / "world's first human-friendly computer" / "world's first blue light free computer") — superlative stacked with a narrow qualifier that makes it defensible.
3. **Concession + resolution** (multiple instances: "all your apps without the distractions" / "remain connected... without sacrificing your health and focus" / "best of both worlds") — Daylight repeatedly handles the "I can't give up X" objection by promising both.
4. **Mechanism-as-credential** (DC dimming / IGZO TFT / monochrome / amber backlight / 60fps / Live Paper) — the brand teaches the buyer specific jargon as proof of seriousness.
5. **Manifesto / refusal framing** ("We refuse to accept" / "more caring computer company" / "human-friendly" / "designed for deep focus and wellbeing") — emotional/moral language without sentimentality.
6. **Quantified absolutes** ("100% flicker-free" / "zero temporal dithering" / "zero blue light") — Daylight uses "100%" and "zero" repeatedly to make claims feel falsifiable.

The repetition is the proof of what's working. Repetition across the homepage + PDP + blog body + press kit = these are the surviving lines.

---

## Section 4 — Spec framing

How Daylight talks about specs. This is the layer where they differentiate most decisively from raw-spec-sheet brands (Boox, Bigme, etc.).

### Spec foregrounding order (in the funnel)

| Order | Spec | First appearance | Reason for placement |
|---|---|---|---|
| 1 | Display ("paper-like, 60fps, Live Paper") | homepage hero + Display section | the category-creating spec |
| 2 | App compatibility ("all your favorite apps", Android 13) | homepage Apps section | the primary objection-handle |
| 3 | Backlight + flicker + blue light (amber, DC dimming, PWM-free) | homepage Outdoor section + blog | the health/wellbeing differentiator |
| 4 | Battery ("days of use" / 20-60 hrs / 8000mAh) | homepage Outdoor tile + PDP spec table | comfort claim — minimized in copy |
| 5 | Stylus (Wacom EMR, no battery, palm rejection) | PDP + Getting Started | use-case proof for note-takers |
| 6 | Physical form (1.2 lbs, 10.5", 9.75mm) | PDP spec table + press kit | minimized in copy |
| 7 | CPU/RAM/storage (Helio G99 / 8GB / 128GB) | PDP spec table only | de-emphasized — never in hero |
| 8 | OS (Android 13, Sol:OS "Coming Soon") | PDP spec table | de-emphasized; Sol:OS is a future promise |
| 9 | Connectivity (Wi-Fi 6, BT 5.0, USB-C, MicroSD, Pogo Pins) | PDP spec table only | not used in marketing copy |

The pattern: **display → app compatibility → health story → battery → form factor → silicon.** The exact opposite of how Boox markets (which leads with CPU/RAM/storage benchmarks).

### Specs that Daylight HIDES or skips

- **CPU performance benchmarks** — Helio G99 is listed once on the PDP spec table; never named as a selling point. (Likely because the Helio G99 is a mid-tier Android chip and would lose any benchmark comparison vs iPad / modern Boox.)
- **Touch-screen tech specifics** — no capacitive vs resistive language; no touch latency number.
- **Refresh modes / "ghosting" deep technical settings** — the PDP says "Watch videos without ghosting in deliberately boring black and white" as the only ghosting reference. No A2/X-mode/Carta tech jargon (unlike Boox or Supernote).
- **Color depth** — implicitly disclosed in the blog as monochrome (and "deliberately boring black and white" on the PDP) but never positioned as a limitation, only as the source of the flicker-free claim.
- **Storage expansion limits** — MicroSD slot present in spec table, never marketed.
- **Camera** — there isn't one, and the brand doesn't mention it.
- **Speakers** — listed in spec table ("Stereo speakers • Microphone") but never marketed.
- **OS update timeline / EOL** — implied by "Software Updates — Regular OS updates and new features coming soon" but no specific commitment.
- **Repairability** — FAQ category includes "Repairability" question but no copy in marketed pages.
- **Warranty length** — FAQ has the question, but answer is JS-rendered and not captured. Conspicuously absent from the cart guarantee panel (which lists 30-day refund + secure payments + shipping + software updates, but NO warranty length).

### Spec-framing techniques per major spec (verbatim language)

#### Display: framed as INVENTED, SENSORY, COMPARATIVE

Raw spec: "10.5in Live Paper™ Display • 1600 x 1200 • 190dpi • Refresh Rate: 60Hz"

Frames used in copy:

> "The world's first full-speed paper-like display" — superlative + category-creation frame.

> "We invented a new type of display that's like E Ink, but faster." — invention frame + comparison-to-known-category frame.

> "It looks and feels like paper, but runs at 60fps" — sensory frame (looks/feels) + quantified frame (60fps).

> "Live Paper™ Display" — coined name. Replaces "screen" with branded category-noun. Trademark symbol signals legal protection / category ownership.

> "Smooth interactions — Scroll, zoom, turn pages—even watch video— without any lag" — capability frame. The "—even watch video—" is the surprise reveal.

> "Watch videos without ghosting in deliberately boring black and white" — turns a limitation (monochrome) into an aesthetic choice ("deliberately boring"). This is a craft-level frame.

> "anti-glare film...it gives a satisfying feeling of friction. Like writing on paper." (Getting Started) — sensory frame ("satisfying feeling of friction") + analog comparison ("Like writing on paper").

> "1600 x 1200 • 190dpi" — raw spec, only on PDP and press kit. Never headlined.

Pattern: **the display is the spec Daylight treats with the most named language ("Live Paper") and the most sensory translation ("looks and feels like paper" / "satisfying feeling of friction"). It's also the only spec they treat as a brand-owned invention.**

#### Backlight + blue light: framed as MISSING / OPTIONAL / WARM

Raw spec: "Optional Pure Amber Backlight"

Frames used:

> "Backlight optional" — homepage Outdoor tile. Frames the absence as a feature.

> "Pure amber — Campfire spectrum with zero blue light" — naming frame ("Pure amber") + metaphor frame ("Campfire spectrum") + quantified absolute ("zero blue light"). The "campfire" metaphor is the most evocative spec-translation in the corpus.

> "Goodbye, blue light" — farewell frame.

> "Read in broad daylight with a screen that uses the sun as its backlight" — reframes the lack of a backlight (in sun-readable mode) as a poetic feature.

> "Most devices emit blue light that affects your circadian rhythm, even in night mode. Daylight doesn't." — comparative + objection-handle (defuses "but I use night mode").

> "Adjust the amber setting - using our patented hardware - to get the perfect warmth for your screen." (Getting Started) — names the warmth setting and adds "patented hardware" as a credential.

> "Blue light-free amber display" (sleep-101) — direct spec-to-benefit frame.

Pattern: **the amber backlight gets a metaphor ("campfire"), an absolute ("zero blue light"), a poetic absence-frame ("backlight optional"), and a "patented" credential. Daylight loads more language onto this single spec than onto silicon, OS, or memory combined.**

#### Flicker / DC dimming: framed as INVISIBLE THREAT NEUTRALIZED BY MECHANISM

Raw spec: "DC Dimming (No PWM)"

Frames used:

> "Flicker-free" / "Flicker-free display is easy on the eyes" / "PWM-free display means no eye strain" — homepage tiles. Mechanism + outcome stated together.

> "A silent epidemic in a LED-driven world" — blog frame. Threat frame.

> "FLICKER: AN INVISIBLE ISSUE" — blog section header. Curiosity frame.

> "Why your screen turning on & off 500 times a second is not good for your brain" — blog title. Specific-claim frame.

> "Brightness control in regular devices is just rapid flickering that looks steady to our eyes." — blog body. Demystification frame.

> "100% flicker-free device using DC dimming, monochrome display, and IGZO TFT technology" — three-mechanism stack frame.

> "Verified by light experts to be flicker free" — credential frame.

> "Flicker testing yielded a perfect result using my highly sensitive audio-based flicker meter and the photodiode based FFT testing method: not even a trace of light modulation could be demonstrated with both methods!" — third-party-expert verbatim frame.

Pattern: **flicker is the spec Daylight treats as the most expandable. The homepage gives it one tile; the blog gives it 17,691 characters. The frame architecture is "invisible threat → mechanism explanation → third-party verification → product as solution."**

#### Battery: framed minimally (under-marketed)

Raw spec: "Battery: 8000mAh"

Frames used:

> "Extended battery — Days of use on a single charge" (homepage Outdoor tile)
> "Extended battery life — Enough battery to last you days on a single charge." (PDP spec tile)
> "20-60 hours" battery life (blue-light-101)

This is the only spec where Daylight under-claims relative to competitors (Kindle: weeks; Boox/reMarkable: days-to-weeks). They acknowledge it ("days") but don't lean in. Likely defensive — the LED backlight cuts battery vs. pure E Ink, so they minimize the comparison.

#### Stylus: framed as ANALOG-LIKE

Raw spec: "Wacom EMR Passive Stylus"

Frames used:

> "Looks and feels like our favorite fountain pen. But it's a stylus!" (cart description for LAMY Stylus)
> "No battery / Bluetooth required for the stylus pen." (Getting Started — objection-handle)
> "The DC-1 has palm rejection, so you can rest your hand comfortably as you write." (Getting Started — objection-handle)
> "The stylus and paper-like finish offer a satisfying drawing experience." (PDP use-case tile)
> "Wide compatibility across a broad range of Wacom EMR pens." (PDP spec tile — flexibility frame)
> "The display is glass, with an anti-glare film...it gives a satisfying feeling of friction. Like writing on paper." (Getting Started)

Pattern: **stylus is framed in analog-comparison language ("fountain pen", "writing on paper", "satisfying feeling of friction"). The technical layer (Wacom EMR, palm rejection, no battery) is preserved as objection-handle, not lead claim.**

#### Form factor: framed lightly (minimized)

> "Weight: 1.2 lbs (550g)"
> "Dimensions: 253.5mm (L) x 184mm (W) x 9.75mm (H)"

Mentioned in PDP spec table and press kit only. Never headlined. No comparison to iPad / Kindle Scribe / reMarkable weight. The form factor is treated as utilitarian disclosure, not selling.

#### OS / software: framed by FUTURE-PROMISE

> "Sol:OS (Coming Soon)" / "AI Reading (Coming Soon)" / "Cloud Sync and Backup" / "Regular Security Updates" — PDP spec table.
> "Your Daylight Computer updates automatically every two weeks" (Getting Started — frequency commitment).
> "Install anything available on Android" (homepage Apps + PDP Apps — open-platform frame).

Pattern: **OS framing splits into two: present-tense ("Install anything available on Android" = open platform) and future-tense ("Sol:OS Coming Soon" = wait for the better version we're building). The dual framing tells the buyer "you get something complete now AND something better is coming" — implicit roadmap as social-proof-of-investment.**

### Unique brand-coined spec language (in order of importance)

| Coined term | What it replaces | Function |
|---|---|---|
| **Live Paper™** | "screen" / "display" / "E-paper" | category-noun ownership |
| **Pure Amber Backlight** | "warm front-light" / "blue-light filter" | proprietary feature name |
| **Campfire spectrum** | "warm color temperature" | metaphor frame |
| **DC Dimming (No PWM)** | "constant current control" | spec restated as a missing-bad-thing |
| **Sol:OS** | "Android (customized)" | OS brand for future fork |
| **A more caring computer company** | "consumer electronics brand" | identity claim as product spec |
| **Public Benefit Co. (PBC)** | "for-profit" | corporate structure as moral spec |

The coined language carries unusual weight in Daylight's funnel because the brand uses it to make commodity components feel category-defining.

### Spec sequencing in the funnel (which spec hits first, which is reserved for late-stage convincing)

- **First contact (homepage hero):** "computer, de-invented" + "deep focus and wellbeing" — no spec at all, just transformation language.
- **Above the fold:** Live Paper display + "60fps" + "without any lag" — display is the first technical spec the reader sees.
- **Mid-page:** App compatibility + outdoor use + amber backlight + flicker-free — the lifestyle/health specs.
- **Late-page (homepage):** "DC-1 AT A GLANCE" 5-bullet recap before footer ORDER NOW — the spec summary as final-frame reassurance.
- **PDP:** full spec table is reserved for after the use-case grid and apps grid — i.e., specs come AFTER the buyer has been emotionally re-anchored to the use-case.
- **Blog deep-dive:** flicker mechanism (DC dimming + IGZO TFT) is reserved for the long-form science page — i.e., the buyer who needs the mechanism-level proof goes there voluntarily.

**Late-stage convincing specs (reserved for buyers who are already most of the way there):** DC dimming + IGZO TFT + DPI + dimensions + Helio G99. These appear in spec tables, not in hooks.

---

## Section 5 — Mechanism → claim → transformation → headline → angle chain (verbatim)

For each major angle Daylight runs, the full chain in verbatim language.

### Angle 1 — Focus / "humane computing" (the master angle)

- **Mechanism (verbatim):** "We invented a new type of display that's like E Ink, but faster. It looks and feels like paper, but runs at 60fps, so you can work fluidly, and use all your apps without compromise." (homepage Use-cases)
- **Claim (verbatim):** "Meet DC-1. A new kind of computer, designed for deep focus and wellbeing." (homepage hero) + "Use all your favorite apps without the distractions—it's the best of both worlds." (homepage Apps)
- **Transformation (verbatim):** "The vision for Daylight is to build a whole ecosystem of healthier, more humane computers that respect our health, attention, and freedom." (homepage Ecosystem)
- **Headline (verbatim):** "The computer, de-invented" (homepage hero H1)
- **Angle type:** desire (status — be the kind of person who chooses focus) + objection-handle (you don't have to give up your apps)

LP-to-blog reinforcement: The angle is HOMEPAGE-only. The blog corpus does NOT re-run focus copy — blog stays on the health/flicker/sleep angle. The homepage owns the master frame; the blogs own the proof.

### Angle 2 — Eye health / digital eye strain

- **Mechanism (verbatim):** "100% flicker-free device using DC dimming, monochrome display, and IGZO TFT technology" + "DC Dimming maintain consistent light output by adjusting direct electrical current. The most deliberate change made in our electrical design was centered around using a DC/CCR LED driver (aka Constant Current Reduction) instead of a PWM driver." (/blog/screen-flicker-101)
- **Claim (verbatim):** "The Daylight Computer: 100% Flicker Free" + "The DC-1 was designed and built purposefully to be flicker free. We wanted to provide a solution both for those suffering with severe eye strain and also to prevent negative optical and cognitive repercussions of flicker for any end consumer." (/blog/screen-flicker-101)
- **Transformation (verbatim):** "For someone with eye disability, the DC-1 is a dream device. The display is so soft and smooth on my eyes that I was able to take my life back off of hold and return to medical school after a multi year absence." (Tiffany Yang) + "It took a couple of weeks to transition all my work screen time to the DC-1, but when I did, my eye strain completely went away. Plus, it let me work outside on my terrace." (Juan Diego)
- **Headline (verbatim):** "Light Flicker — Why your screen turning on & off 500 times a second is not good for your brain" + "AND WHY WE CREATED A FLICKER FREE COMPUTER" (/blog/screen-flicker-101)
- **Angle type:** pain (survival — eye damage / disability) + authority (Dr. Wunsch verification + Dr. Destefano pilot study) + offer (30-day pilot study referral)

LP-to-blog reinforcement: This is the most reinforced angle. Homepage runs "For your health — Say goodbye to eye-strain" and "No eye-strain — Flicker-free display is easy on the eyes" as tiles. The blog explodes those tiles into 17,691 characters of mechanism + science + testimonial + clinical pilot CTA. PDP keeps the angle alive via "Soft on the eyes" key feature tile and the @drhaswell testimonial.

### Angle 3 — Sleep / circadian rhythm

- **Mechanism (verbatim):** "Pure amber — Campfire spectrum with zero blue light" (homepage Outdoor) + "Blue light-free amber display" + "Flicker-free backlight" + "Paperlike, low-stimulation interface" + "Smart Airplane Mode for RF reduction" + "No default notifications" (sleep-101 product callouts)
- **Claim (verbatim):** "the most sleep-friendly device that you can buy" (sleep-101) + "Most devices emit blue light that affects your circadian rhythm, even in night mode. Daylight doesn't." (homepage Outdoor) + "blue wavelengths can suppress melatonin 3 to 4 times more" (sleep-101)
- **Transformation (verbatim):** "Better sleep — In sync with your circadian rhythm" (homepage Outdoor) + "High-quality sleep is the foundation of a healthy lifestyle. It's the time when we recharge and restore - so we can attack the next day with the full capability of our being." (sleep-101 intro)
- **Headline (verbatim):** "How to Get Your Best Night's Sleep" (sleep-101)
- **Angle type:** desire (survival — sleep is universal need) + objection-handle ("even in night mode" defuses "but I use night mode")

LP-to-blog reinforcement: Homepage carries it as ONE tile ("Better sleep"). Sleep-101 blog expands it. Blue-light-101 blog reinforces the mechanism ("the world's first blue light free computer" / "20-60 hours" battery / amber LED backlight).

### Angle 4 — Outdoor use / sunlight readability

- **Mechanism (verbatim):** "Read in broad daylight with a screen that uses the sun as its backlight." (homepage Outdoor) + "Backlight optional — Read in direct sunlight, no backlight needed" (homepage Outdoor)
- **Claim (verbatim):** "it's a computer you can use outside" (homepage Outdoor)
- **Transformation (verbatim):** "Plus, it let me work outside on my terrace." (Juan Diego testimonial in /blog/screen-flicker-101)
- **Headline (verbatim):** "outdoor computing" + "it's a computer you can use outside" (homepage Outdoor section)
- **Angle type:** desire (status — outdoor lifestyle, sun-readable productivity)

LP-to-blog reinforcement: One section on homepage. No blog post dedicated to this angle. The Juan Diego testimonial is the only place "outdoor" appears outside the homepage section. This angle is **under-built** relative to the others — Daylight could easily expand it but chooses not to. (Likely because the actual buyer is indoor-bound and the outdoor angle is aspirational coloring, not primary purchase driver.)

### Angle 5 — Simplicity / "de-inventing" the computer / mission-led brand

- **Mechanism (verbatim):** "Daylight is a Public Benefit Co." + "with a double bottom line: not just a fiduciary duty to shareholders, but also a civil duty to uphold our public benefit purpose" (founder message)
- **Claim (verbatim):** "a computer that brings the simplicity back to our digital life" (Waqas Ali testimonial) + "A more caring computer company" (footer)
- **Transformation (verbatim):** "To help technology and humanity live happily ever after." (founder message close)
- **Headline (verbatim):** "The computer, de-invented" (homepage hero) + "Daylight is a Public Benefit Co." (founder section header)
- **Angle type:** belonging (identity — be part of a humane tech movement) + pain (resentment of Big Tech)

LP-to-blog reinforcement: Homepage founder message is the home for this angle. Press kit reinforces it ("Daylight Computer Co. is a public-benefit corporation dedicated to creating healthier, more human-friendly computers"). Earned press (Wired's "techno-hippies" / The Verge's "calmer computer") amplifies it. No dedicated blog post.

### Angle 6 — "Best of both worlds" / no-compromise productivity

- **Mechanism (verbatim):** "All the apps you need in one place. Install anything available on Android." (PDP Apps)
- **Claim (verbatim):** "Use all your favorite apps without the distractions—it's the best of both worlds." (homepage Apps)
- **Transformation (verbatim):** "Web browsing, Spotify, spreadsheets, even YouTube! This device allows you to remain connected in our digital world, without sacrificing your health and focus." (Getting Started)
- **Headline (verbatim):** "With all the apps you need" (homepage Apps) + "Bring all your favorite apps" (PDP Apps)
- **Angle type:** objection-handle (defuses the "I'll lose my apps if I switch" fear) + desire (status — productivity)

LP-to-blog reinforcement: Homepage + PDP + Getting Started all carry this. It's the primary objection-handle for the buyer who has tried Kindle/reMarkable and bounced because of app limitations.

### Angle 7 — Distraction-free creative work

- **Mechanism (verbatim):** "It looks and feels like paper" + "deliberately boring black and white" + "Paperlike, low-stimulation interface" + "No default notifications" + "Smart Airplane Mode for RF reduction"
- **Claim (verbatim):** "A distraction-free space for learning & creativity" (homepage Use-cases)
- **Transformation (verbatim):** "A sacred space for focused writing without distraction" (homepage Writing tile)
- **Headline (verbatim):** "A distraction-free space for learning & creativity" (homepage Use-cases)
- **Angle type:** desire (status — be a serious writer/learner) + identity (be the kind of person who chooses a sacred space)

LP-to-blog reinforcement: Homepage section + PDP "Write without distractions" tile + UrsaBio testimonial ("reading long-form, navigating knowledge archives... and writing").

### Angle 8 — Parental wholesomeness / shareable-with-kids

- **Mechanism (verbatim):** monochrome + no notifications + no addictive algorithms (mechanisms borrowed from Kids product but applied to adult)
- **Claim (verbatim):** "It's the only computer I feel comfortable sharing with my kids!" (Akshay Kothari, NotionHQ) + "One of the few screens I feel happy giving to my kids. Just a totally different vibe." (@drhaswell, Exec Coach)
- **Transformation:** the device becomes a non-toxic shared family object.
- **Headline (verbatim):** Above-fold PDP — "One of the few screens I feel happy giving to my kids. Just a totally different vibe." (@drhaswell)
- **Angle type:** desire (belonging — be a thoughtful parent) + objection-handle (defuses "is this just for me, or is it actually different")

LP-to-blog reinforcement: Two testimonials on homepage + PDP. No editorial blog amplification on adult corpus (the Kids product takes the parental angle as its primary frame).

### Cross-angle pattern

Daylight runs **8 distinct angles** but the master angle ("healthier, more human-friendly computer / deep focus and wellbeing") absorbs all the others as supporting evidence. Eye health, sleep, outdoor, simplicity, no-compromise, distraction-free, parental — each one is a different proof of the master claim. This is unusually disciplined for a tech brand and is the reason a single homepage can carry the whole funnel.

---

## Section 6 — Trust signal placement

### Inventory + placement

| Trust signal (verbatim where text-based) | Type | Where on page/ad | When in funnel | Local function | Specificity grade |
|---|---|---|---|---|---|
| Newsletter signup "GET UPDATES · NO SPAM" + "Sign up for updates, guides and more resources. No spam." | trust-by-permission ("no spam" reassurance) | above-fold on homepage + every blog post | TOF | reduces signup friction by handling the implicit spam objection | LOW (no quantifier) |
| "✓ IN STOCK · SHIPS IN 3-5 BUSINESS DAYS" | availability/logistics signal | above-fold on homepage; recurring | TOF + repeated | resolves "is this even available" question that comes from prior sold-out history | MEDIUM (specific window) |
| The Verge press logo | press-logo | mid-homepage "know more about daylight on:" bar | mid-funnel | category credentialing | HIGH (named outlet) |
| Wired press logo | press-logo | mid-homepage | mid-funnel | category credentialing | HIGH |
| Tech Radar press logo | press-logo | mid-homepage | mid-funnel | category credentialing | HIGH |
| Daring Fireball press logo | press-logo | mid-homepage | mid-funnel | Apple-fan credibility | HIGH (cultural-niche credibility) |
| Akshay Kothari (Co-Founder @NotionHQ) — "It's the only computer I feel comfortable sharing with my kids!" — 9:02 PM · May 23, 2024 | named-customer (tech-peer) | mid-homepage testimonial wall | mid-funnel | identity flatter ("Notion-peer endorses") + parental objection-handle | HIGH (named person + title + timestamp) |
| Waqas Ali (Founder @Atoms) — "Daylight gets it, a computer that brings the simplicity back to our digital life." — 8:28 PM · May 23, 2024 | named-customer (founder peer) | mid-homepage testimonial wall | mid-funnel | thesis validation ("they get it" = the buyer feels seen) | HIGH |
| Soleio (Early Design @Meta @Dropbox) — "The Daylight is the computer of tomorrow. It does not bathe you in blue light or endless notifications. [...] It's fast and beautiful, like a trim little boat." — 10:26 AM · May 22, 2024 | named-customer (design-elite) | mid-homepage testimonial wall | mid-funnel | aesthetic/design endorsement | HIGH |
| :~# (Founder @UrsaBio) — "There is simply no better device out there right now for reading long-form, navigating knowledge archives or the night sky, panning around, zooming and marking up PDFs, and writing." — 5:12 PM · May 23, 2024 | named-customer (use-case proof) | mid-homepage testimonial wall | mid-funnel | use-case proof (the named use cases ARE the avatar's use cases) | HIGH |
| @drhaswell (Exec Coach) — "One of the few screens I feel happy giving to my kids. Just a totally different vibe." | named-customer (exec-coach credibility) | PDP above-fold (directly under hero) | PDP-TOF | trust-shifting from technical to felt-experience right before $729 reveal | HIGH |
| Dr. Alexander Wunsch (M.D., P.hD, Light Scientist) — "Flicker testing yielded a perfect result using my highly sensitive audio-based flicker meter and the photodiode based FFT testing method: not even a trace of light modulation could be demonstrated with both methods!" | expert-endorsement (credentialed scientist) | /blog/screen-flicker-101, in the "How the DC-1 achieves a flicker free display" section | deep-funnel | scientific verification of the headline claim ("100% flicker-free") | HIGH (M.D. + PhD + verbatim method) |
| Tiffany Yang (Medical student) — "For someone with eye disability, the DC-1 is a dream device. The display is so soft and smooth on my eyes that I was able to take my life back off of hold and return to medical school after a multi year absence." | UGC (story testimonial) | /blog/screen-flicker-101, post-mechanism | deep-funnel | emotional payoff after the technical setup; license to believe the product is life-changing | HIGH |
| Juan Diego — "It took a couple of weeks to transition all my work screen time to the DC-1, but when I did, my eye strain completely went away. Plus, it let me work outside on my terrace." | UGC (story testimonial) | /blog/screen-flicker-101, post-mechanism | deep-funnel | timeline-anchored testimonial ("a couple of weeks") sets realistic expectations | HIGH |
| Dr. Michael Destefano, neuro-optometrist, Visual Symptoms Treatment Center, Illinois — Eye Strain Pilot Study coordinator | clinical-pilot | /blog/screen-flicker-101, "Our eye-strain pilot study" section | deep-funnel | offers the buyer concrete evidence-gathering activity (more than marketing) | HIGH (named clinician + named institution) |
| Pilot Study CTA — "Do you suffer from severe digital eye strain, computer vision syndrome, or visual snow syndrome? If you are interested in trying a DC-1 for 30 days as part of the Eye Strain Pilot Study, please send an email to drdestefanoOD@gmail.com" | clinical-pilot (offer) | /blog/screen-flicker-101, mid-section | deep-funnel | direct-response offer to clinical sub-niche; doubles as legitimacy signal to all readers | HIGH |
| "Verified by light experts to be flicker free" (intro phrase before the Dr. Wunsch quote) | expert-endorsement framing | /blog/screen-flicker-101 | deep-funnel | sets up the third-party verification | MEDIUM |
| IEEE 1789 standard citation | standards-body reference | /blog/screen-flicker-101, "The health risk of flickering devices" | deep-funnel | regulatory legitimacy | HIGH |
| California law (Title 24) citation | regulatory reference | /blog/screen-flicker-101 | deep-funnel | regulatory legitimacy | HIGH |
| 6 external research links (PMC, IEEE, peer-reviewed journals) | research-evidence | /blog/screen-flicker-101 footer "Dive deeper with our curated resources" | deep-funnel | reader can verify independently | HIGH |
| "30-Day Guarantee — Return your DC-1 within 30 days for a full refund." | guarantee | PDP + cart guarantee panel | pre-checkout | risk reversal | HIGH |
| "Secure Payments — Your payment is secure and encrypted." | payment-badge | cart guarantee panel | checkout | reduces payment-page anxiety | MEDIUM |
| "Software Updates — Regular OS updates and new features coming soon." | longevity-commitment | cart guarantee panel | pre-checkout | reduces "is this software abandonware" fear | LOW (no specific cadence) |
| "Your Daylight Computer updates automatically every two weeks" | longevity-commitment | Getting Started | post-purchase | the cadence is specified for owners | HIGH |
| "Daylight is a Public Benefit Co." / "© 2026 • Daylight Computer Co. • Daylight is a Public Benefit Co." / "Daylight Computer operates on behalf of JANGLE INNOVATIONS INC" | certification (corporate structure) | homepage founder section + every page footer | repeated throughout | brand-level moral credentialing | HIGH (legal designation) |
| Inspired Internet Pledge — Signatory (2025) — pledged commitments verbatim ("Develop algorithms and in-product tools that reward prosocial behaviors") | certification (institutional) | not on Daylight site directly — third-party site (inspiredinternet.org/signatory/daylight-computer/) | off-site credentialing | civic credentialing for buyers who research the brand | HIGH |
| "Daylight sold out its first run of 5,000 devices" / "Over $2.5 million in sales within days of launch" / "Completely sold out of available devices" (Wikipedia + Finesse case study) | longevity/volume signal (off-site) | external press; not on Daylight's own site | research-tier | implicit demand validation for buyers who Google before buying | HIGH (numbers) |
| "$12 million investment from current and former executives of companies such as Oculus, Pinterest, and Dropbox" | funding/investor credentialing (off-site, per Wikipedia) | not on Daylight's own site | research-tier | implicit institutional validation | HIGH (named investors + dollar figure) |
| "In 2025, the product was demonstrated by Danny Jones on the Joe Rogan Experience" (per Wikipedia) | celebrity demo (off-site) | not on Daylight's own site | research-tier | mainstream cultural validation | HIGH (named media + year) |
| "#1 Trending story on May 23rd, 2024" — Hacker News | volume signal (off-site) | not on Daylight's own site | research-tier | technical-community credibility | HIGH |
| "six years developing the technology" / founder R&D timeline | R&D pedigree | press kit | research-tier | answers "is this serious or a kickstarter toy" | MEDIUM |
| "Daylight | A More Caring Computer" (page title on home capture) | brand-tagline-as-meta | browser tab + SEO | every page visit | low-attention reinforcement | LOW |

### Density per asset

| Asset | Trust-signal count |
|---|---|
| Homepage | 17 (4 press logos + 4 named-founder testimonials + 1 founder PBC statement + footer PBC + "in stock" badge + newsletter "no spam" + footer "more caring computer company" + 3 implicit-by-position signals) |
| PDP | 5 (above-fold @drhaswell testimonial + 30-day guarantee + ships-in-3-5 + footer PBC + newsletter "no spam") |
| Cart | 4 (30-day + secure payments + shipping + software updates) |
| /blog/screen-flicker-101 | 11+ (Dr. Wunsch + Tiffany + Juan Diego + Dr. Destefano + pilot CTA + IEEE 1789 + California Title 24 + 6 research links + 100% flicker-free quantified absolute + PBC footer + newsletter) |
| /blog/sleep-101 | 3 (quantified science claim + 5 product callouts as feature-trust + PBC footer) |
| /blog/blue-light-101 | 2 (20-60 hour battery + amber LED + PBC footer) |

The blog page is **2x the trust-signal density of the homepage**, which is correct: it's the page that has to convince skeptics.

### Specificity grade summary

- Daylight overwhelmingly uses **named-and-titled** persons (Akshay Kothari Co-Founder Notion, Soleio Early Design Meta+Dropbox, Dr. Wunsch M.D./PhD Light Scientist, Dr. Destefano neuro-optometrist Visual Symptoms Treatment Center Illinois, Tiffany Yang Medical student, etc.). There are essentially **no anonymous "Sarah from Texas" testimonials**.
- The brand uses **quantified absolutes** ("100%", "zero", "no PWM") rather than relative qualifiers ("less", "reduced").
- Off-site signals (sold-out batches, $12M investors, Joe Rogan demo, Hacker News #1) are NOT replicated on the Daylight site — the brand lets the research-conducting buyer find them organically. This is a deliberate elegance choice; it preserves on-site copy as quiet/uncluttered.

### Extraordinary identifier(s) — the single trust element that makes the brand impossible to ignore

Daylight has **TWO** extraordinary identifiers, depending on the buyer's awareness lane:

1. **For the health/symptom-driven buyer:** the **Eye Strain Pilot Study with Dr. Michael Destefano, neuro-optometrist at the Visual Symptoms Treatment Center in Illinois** — an active, named clinical partnership with a credentialed institution AND a referral CTA (drdestefanoOD@gmail.com) to send symptom-burdened readers to a 30-day device trial. Competitors cannot copy this with copy alone. It is the single trust element that converts the eye-strain niche.

2. **For the cultural/tech-elite buyer:** the **Joe Rogan Experience demo by Danny Jones (2025)** combined with the **Notion / Atoms / Dropbox / Meta named-founder testimonial stack on the homepage**. Off-site, JRE; on-site, the founder wall. Competitors cannot manufacture this; it's earned over years of relationships and one breakthrough podcast moment.

Together: the clinical pilot + the JRE demo + the named-founder wall are Daylight's extraordinary identifiers. None of the three can be copied with paid media; each took organic effort to create.

---

## Section 7 — Belief-installation sequence

The funnel walked end-to-end, beliefs labeled in the order they install, with verbatim copy that installs them.

**Funnel note:** Daylight does NOT have a Meta-ads-to-LP funnel for adult DC-1. The funnel is **TOF (earned press / podcast / Hacker News / organic search) → homepage → blog (for skeptics) → PDP → cart → checkout**. There is also a **newsletter capture loop** running parallel from above-fold on every page. There is no documented owned email sequence — Daylight only captures email for "updates, guides and more resources" — content marketing, not a documented nurture flow.

### Step 1 — TOF (earned press / podcast / organic search)

| Belief installed | Verbatim copy that installs it | Source |
|---|---|---|
| "Current computing is harming me and I'm not the only one who thinks so." | "The Daylight Tablet Returns Computing to Its Hippie Ideals" / "techno-hippies" | Wired headline |
| "There's a calmer alternative, and serious tech publications are taking it seriously." | "The Daylight DC1 is a $729 attempt to build a calmer computer" | The Verge headline |
| "This is a real, novel thing." | "#1 Trending story on May 23rd, 2024" | Hacker News (off-site) |
| "Mainstream cultural figures use this." | "In 2025, the product was demonstrated by Danny Jones on the Joe Rogan Experience" | Wikipedia + JRE clip circulation |

Why these beliefs at this stage: the buyer is not yet on a Daylight property. They are encountering the brand via third-party signal. The job at TOF is to install **category legitimacy** before the buyer arrives at daylightcomputer.com, so the buyer enters the homepage already believing this is real and serious.

### Step 2 — LP hero (above-fold homepage, first 5 seconds)

| Belief installed | Verbatim copy that installs it |
|---|---|
| "This is a new category, not a knockoff of E-Ink readers I've seen before." | "The computer, de-invented" |
| "The brand has a stance and that stance matches mine." | "We refuse to accept a future where our devices are exhausting, addictive, and distracting" |
| "The promise is focus + wellbeing — both, not either." | "Meet DC-1. A new kind of computer, designed for deep focus and wellbeing." |
| "The brand frames itself as healthier and more humane — a moral product, not just a productivity tool." | "Introducing Daylight — a healthier, more human-friendly computer" |
| "I can act now — it's in stock and ships within 5 days." | "✓ IN STOCK · SHIPS IN 3-5 BUSINESS DAYS" + "ORDER NOW" |
| "If I'm not ready to buy, I can get more info without committing." | "GET UPDATES · NO SPAM" / "Sign up for updates, guides and more resources. No spam." |

Building on TOF: the buyer arrives already believing the brand is real. Hero confirms it with categorical claim + manifesto + availability. Within 5 seconds the buyer either accepts the master frame ("new kind of computer, deep focus + wellbeing") or bounces. The hero does NOT explain the technology — that's reserved for downstream sections.

### Step 3 — LP body, Display section ("The world's first full-speed paper-like display")

| Belief installed | Verbatim copy |
|---|---|
| "This is a defensible technical claim, not marketing fluff." | "The world's first full-speed paper-like display" |
| "The lag concern I have with E-Ink is solved here." | "Smooth interactions — Scroll, zoom, turn pages—even watch video— without any lag" |
| "Using this device will feel calm, not stimulating." | "A calm experience — Stay connected with yourself and what's around you" |
| "My eyes will not be hurt by this device." | "For your health — Say goodbye to eye-strain—designed for full sunlight and nighttime" |

Why here: this is the moment the buyer's curiosity ("what IS this?") gets satisfied with a category claim that's been engineered to be defensible ("full-speed paper-like"). The lag objection is neutralized inside the same tile that introduces the spec, so the objection never lands.

### Step 4 — LP body, Use-cases section ("A distraction-free space for learning & creativity")

| Belief installed | Verbatim copy |
|---|---|
| "There's an invented display category here, with a named technology." | "Live Paper display" |
| "It does paper-like with the speed advantage I need." | "We invented a new type of display that's like E Ink, but faster. It looks and feels like paper, but runs at 60fps, so you can work fluidly, and use all your apps without compromise." |
| "It fits my reading workflow." | "Reading — Your new favorite reading app for books and documents" |
| "It fits my note-taking workflow." | "Note-taking — Write, draw and annotate on a fast, paper-like surface" |
| "It fits my writing identity (which is sacred to me)." | "Writing — A sacred space for focused writing without distraction" |

Why here: the buyer has accepted the category. Now they need use-case fit. The three tiles are explicit pattern-matches to the avatar's existing behaviors (reading, note-taking, writing). The word "sacred" elevates the writing identity for the writer-avatar.

### Step 5 — LP body, Apps section ("With all the apps you need")

| Belief installed | Verbatim copy |
|---|---|
| "I will not lose my app ecosystem if I switch." | "Use all your favorite apps without the distractions—it's the best of both worlds." |

Why here: this neutralizes the single biggest objection a tech-literate buyer has when evaluating a paper-like device — "but I need my apps." Placement is right after use-cases so the buyer can map the use-cases to their actual app workflows.

### Step 6 — LP body, Ecosystem vision

| Belief installed | Verbatim copy |
|---|---|
| "This is not a one-product novelty — there's a roadmap and a movement." | "The vision for Daylight is to build a whole ecosystem of healthier, more humane computers that respect our health, attention, and freedom." |

Why here: addresses the buyer's "will this brand be around in 3 years?" anxiety BEFORE the price reveal. Frames the purchase as joining a movement.

### Step 7 — LP body, Outdoor section ("it's a computer you can use outside")

| Belief installed | Verbatim copy |
|---|---|
| "Sunlight readability is a real feature with a real implication." | "Read in broad daylight with a screen that uses the sun as its backlight." |
| "Battery is not a worry." | "Days of use on a single charge" |
| "Eye strain stops here." | "Flicker-free display is easy on the eyes" |
| "Blue light disruption stops here, even more than night-mode delivers." | "Most devices emit blue light that affects your circadian rhythm, even in night mode. Daylight doesn't." |
| "Sleep gets better." | "In sync with your circadian rhythm" |
| "The warmth is intentional and engineered." | "Pure amber — Campfire spectrum with zero blue light" |

Why here: this section installs the **health bundle** as a stack of small wins. Each tile is a small belief, and together they build a felt total that justifies a $729 purchase even on functional-utility grounds before the brand identity layer kicks in again.

### Step 8 — LP testimonial wall ("What people are saying")

| Belief installed | Verbatim copy |
|---|---|
| "Tech peers I respect use this and recommend it." | "It's the only computer I feel comfortable sharing with my kids!" — Akshay Kothari (Co-Founder @NotionHQ) |
| "The brand 'gets it' — it solves a real felt problem." | "Daylight gets it, a computer that brings the simplicity back to our digital life." — Waqas Ali (Founder @Atoms) |
| "Design-literate elites endorse the aesthetic." | "The Daylight is the computer of tomorrow. It does not bathe you in blue light or endless notifications. [...] It's fast and beautiful, like a trim little boat." — Soleio (Early Design @Meta @Dropbox) |
| "The specific use-cases that matter to me (long-form reading, knowledge archives, PDFs, writing) are validated." | "There is simply no better device out there right now for reading long-form, navigating knowledge archives or the night sky, panning around, zooming and marking up PDFs, and writing." — :~# (Founder @UrsaBio) |

Why here: after the buyer has been pitched on capability, the wall converts pitch into peer-validated reality. The timestamps (9:02 PM May 23, 2024 etc.) imply these are real tweets, not curated marketing quotes.

### Step 9 — LP press logos + founder message ("Daylight is a Public Benefit Co.")

| Belief installed | Verbatim copy |
|---|---|
| "Multiple credentialed publications cover this seriously." | The Verge / Wired / Tech Radar / Daring Fireball logos |
| "The founder thinks clearly about why Big Tech ended up bad." | "One of my big surprises of Silicon Valley was finding out how nice & well intentioned many of the execs of 'evil big tech' were. Shocking because I expected them to be evil. Heartbreaking because they weren't. It meant big tech do bad not cuz of who runs them, but because of the systematic forces they're beholden to, ie business model & shareholder mandate." |
| "The brand's structure (PBC) prevents the failure mode the founder names." | "we decided daylight should be a PBC, with a double bottom line: not just a fiduciary duty to shareholders, but also a civil duty to uphold our public benefit purpose" |
| "Buying this is a moral act, not just a transaction." | "To help technology and humanity live happily ever after." |

Why here: this is the deepest identity install. The buyer who survives to this section is now being asked to join a moral mission. The founder message is unusually long for a homepage and unusually personal ("Shocking" / "Heartbreaking") — it converts the rational tech-buyer into someone with skin in the game.

### Step 10 — LP "DC-1 AT A GLANCE" recap + footer ORDER NOW

| Belief installed | Verbatim copy |
|---|---|
| "I remember the 5 things that matter and I can decide now." | "Fast, paper-like display / Read, write, take notes / Use all your apps / Sunlight readable / Blue-light free backlight" + "ORDER NOW" + "Ships within 3-5 business days" |

Why here: the recap reduces the 12-section homepage to 5 bullets. By this point the buyer has seen everything; the recap exists so the scroll-back-up reader has a frictionless decision moment.

### Step 11 — Blog (skeptic detour) — /blog/screen-flicker-101

| Belief installed | Verbatim copy |
|---|---|
| "Eye strain is real, widespread, and worse than I thought." | "Tired eyes and a drained mind are almost a universal feeling at the end of a work day. That is, if you work a job that requires you to be in front of a computer screen all day… which today is most of us." + "Digital eye strain has been on the rise since the beginning of the COVID-19 pandemic. An augmented growth pattern has been experienced with prevalence ranging from 5 to 65% in pre-COVID-19 studies to 80–94% in the COVID-19 era." |
| "The cause is something specific (flicker / PWM) that I didn't know about." | "FLICKER: AN INVISIBLE ISSUE" + "Brightness control in regular devices is just rapid flickering that looks steady to our eyes." |
| "The science is real (IEEE, regulatory bodies, peer-reviewed)." | IEEE 1789 + California Title 24 + 6 research-link footer |
| "The product solves the cause via specific, named mechanisms." | "100% flicker-free device using DC dimming, monochrome display, and IGZO TFT technology" |
| "An independent credentialed expert verified the mechanism." | "Flicker testing yielded a perfect result... not even a trace of light modulation could be demonstrated" — Dr. Wunsch |
| "Real people had real, life-changing outcomes." | Tiffany Yang ("take my life back off of hold and return to medical school") + Juan Diego ("eye strain completely went away") |
| "The brand puts money where its mouth is — clinical pilot study with named clinician." | "We have partnered with Dr. Michael Destefano, a neuro-optometrist at the Visual Symptoms Treatment Center in Illinois, to coordinate this pilot study." + "Do you suffer from severe digital eye strain... try a DC-1 for 30 days as part of the Eye Strain Pilot Study" |

Why here: the blog is the conversion engine for the skeptic. By the end of 17,691 characters, the buyer has been walked from symptom → cause → standards → solution mechanism → expert verification → user proof → clinical pilot offer. This is the highest-trust asset in the funnel and the only one that does mechanism-level science work.

### Step 12 — PDP (`/product`)

| Belief installed | Verbatim copy |
|---|---|
| "The brand is willing to make the headline claim directly to me, the buyer." | "The world's first human-friendly computer that your brain and eyes will actually love." |
| "The price is $729, named, no haggle." | "$729" + quantity selector + "ADD TO CART" |
| "A respected exec-coach uses this; the 'vibe' is real." | "One of the few screens I feel happy giving to my kids. Just a totally different vibe." — @drhaswell |
| "I know exactly what's in the box and what happens after I order." | "What's Included" + "Order Details" + "30-Day Guarantee — Return your DC-1 within 30 days for a full refund." + "Shipping Timelines — New orders ship within 3-5 business days." |
| "There are 8 named everyday use-cases I can imagine myself doing." | 8 use-case tiles: "Read and annotate PDFs" / "Take free-form notes" / "Browse the web" / "Bring all your e-books" / "Write without distractions" / "Smooth video playback" / "Read and edit your docs" / "Use your favorite drawing apps" |
| "I keep my app ecosystem." | "All the apps you need in one place. Install anything available on Android." |
| "Hardware specs are real (and listed; I can verify)." | full spec table — 10.5in Live Paper / 1600x1200 / 190dpi / Helio G99 / 8GB RAM / 128GB / 8000mAh / Wi-Fi 6 / BT 5.0 / Wacom / Android 13 / Sol:OS Coming Soon / etc. |

Why here: PDP is the technical/transactional closer. By the time the buyer is here, the moral/identity work is done. The job is now to handle remaining mechanics-objections (shipping, returns, what's in box, will my apps work, hardware specs) and offer the click.

### Step 13 — Cart / checkout

| Belief installed | Verbatim copy |
|---|---|
| "Refunds are easy if I change my mind." | "30-Day Guarantee — Return your DC-1 within 30 days for a full refund." |
| "Payments are safe." | "Secure Payments — Your payment is secure and encrypted." |
| "Shipping is fast and named." | "Shipping Timelines — New orders ship within 3-5 business days." |
| "The product will be supported / updated." | "Software Updates — Regular OS updates and new features coming soon." |
| "I can add accessories now or later, no pressure." | "Add +" + accessory prices in cart |

Why here: pure mechanics — checkout is reassurance only. No new beliefs are introduced; existing beliefs are reinforced. (This is correct architecture — the buyer should not be persuaded of new things at checkout.)

### Step 14 — Post-checkout / Getting Started

| Belief installed | Verbatim copy |
|---|---|
| "I made the right choice; the product really is what was promised." | "Web browsing, Spotify, spreadsheets, even YouTube! This device allows you to remain connected in our digital world, without sacrificing your health and focus." |
| "I can learn to use it without overwhelm." | step-by-step Getting Started copy ("Turn the backlight off..." / "Use the infinite zoom..." / "Highlight with a long press...") |
| "The brand keeps improving the product I just bought." | "Your Daylight Computer updates automatically every two weeks" |

Why here: post-purchase reinforcement closes the loyalty loop. The buyer's choice is validated and their early-ownership friction is reduced.

### Step 15 — Email sequence (NOT documented — gap)

Daylight captures emails via the "GET UPDATES · NO SPAM" newsletter on every page. The actual content of any nurture sequence is **NOT in the corpus**. Funnel-mechanics.md confirms: "No exit-intent popup observed in WebFetch passes (may exist client-side)." No "Get notified when back in stock" copy because current stock is available. There is **no documented email belief-installation copy** to analyze.

This is a real gap for the user's portability work — the user's funnel is email + deposit + pre-launch event, which means email is the dominant belief-installation channel. Daylight's funnel does belief-installation primarily through the LP + blog, not email. So the user CAN take Daylight's belief sequence (steps 1-12 above) and re-architect it across emails + an event invite, but cannot copy specific Daylight email copy because none was captured.

---

### Complete belief chain the buyer must hold at moment of purchase (the funnel-portability key)

In order of installation:

1. **"Current computing is harming me and I'm not the only one who thinks so."** (Installed at TOF via earned press + podcast.)
2. **"There is a calmer, more humane alternative — and serious people take it seriously."** (Installed at TOF + LP hero.)
3. **"This is a new category, not a marginal improvement on existing E-Ink readers."** (Installed at LP hero via "The computer, de-invented" + Display section "world's first full-speed paper-like display.")
4. **"The lag problem I associate with paper-like devices is solved here."** (Installed at LP Display section + Use-cases section via "60fps" / "without any lag" / "It looks and feels like paper, but runs at 60fps.")
5. **"I will not have to give up my apps."** (Installed at LP Apps section via "Use all your favorite apps without the distractions—it's the best of both worlds.")
6. **"My eye strain has a specific named cause (flicker / PWM), and this device removes it via specific named mechanisms (DC dimming + monochrome + IGZO TFT)."** (Installed at LP Outdoor section's "Flicker-free" tile + deepened on the blog if the buyer detours.)
7. **"My sleep will improve because amber backlight = zero blue light, even better than night mode."** (Installed at LP Outdoor section's "Better sleep" + "Goodbye, blue light" tiles.)
8. **"Tech peers I respect (Notion founder, Atoms founder, Soleio, UrsaBio founder) use this."** (Installed at LP testimonial wall.)
9. **"This is endorsed by credentialed publications (Verge, Wired, Tech Radar, Daring Fireball) and one credentialed scientist (Dr. Wunsch) — and one credentialed clinician runs a pilot study with the brand (Dr. Destefano)."** (Installed at LP press bar + blog body.)
10. **"The brand is a Public Benefit Corporation with a moral mission I can join by buying."** (Installed at LP founder message.)
11. **"I am the kind of person who chooses focus, wellbeing, sleep, and humane technology over distraction, exhaustion, and the algorithm."** (Identity belief — installed cumulatively across all the above.)
12. **"The product is in stock, ships in 3-5 days, costs $729, and I can return it in 30 days if it doesn't work for me."** (Mechanics — installed at PDP + cart.)

**Funnel-portability flags for the user's email + deposit + event funnel:**

- **Beliefs 1, 2, 3, 11** are 100% portable — they are pure identity/category beliefs. The user's pre-launch event can install all four directly, because they're carried in language and frame, not funnel mechanics.
- **Beliefs 4, 5, 6, 7** are portable but harder — they require the user's product to have analog mechanisms that solve the same buyer pains (lag, apps, eye strain, sleep) and the user's email sequence needs to walk the buyer through them. For a foldable e-ink tablet, the user has parity claims available on most of these and possibly stronger claims on portability/form factor.
- **Belief 8 (peer tech testimonials)** is portable in form but depends on the user having access to comparable named peers. If the user can secure 4 named-founder-tier testimonials before the event, this belief installs cleanly via email or event slide. If not, the user must substitute different but equivalent-weight signals (named designers, named writers, named eye-strain sufferers, etc.).
- **Belief 9 (press + expert verification)** is **funnel-coupled to Daylight's earned-media strategy**. The user's pre-launch event funnel cannot replicate this on day one. Substitutes: pre-launch event itself functions as a live demo that converts skeptics in real-time; live testing in-room (let attendees test the device); invite a credentialed expert as guest speaker; secure 1-2 podcast appearances before the event invite goes out. **Flag: this is the single biggest belief that depends on Daylight's specific funnel structure to land. The user's funnel will need to manufacture an equivalent trust-tier on a compressed timeline.**
- **Belief 10 (PBC / mission)** is portable but requires the user's brand to have a parallel founder-story / mission frame. If the user's product is a foldable e-ink tablet from a small founder-led team, the founder-story is the natural carrier. If the user can name their PBC status (or B-Corp pending, or "no-VC", or "no-investor-ad-budget" — any corporate identity-claim that distinguishes the brand from the bloated incumbents) and write it in Anjan Katta's confessional voice, this belief installs cleanly via email or event keynote.
- **Belief 12 (mechanics)** is portable but specific to the user's offer. A deposit funnel changes the mechanics layer significantly — the buyer commits cash before delivery, so the equivalent reassurance copy must address "what happens if you don't ship," "what's my refund window if I change my mind," "what's the deposit-to-final-price commitment," etc. Daylight's "30-day refund" copy is the closest parallel and a strong template; the user's deposit funnel needs to extend it to "deposit-refund window" + "shipping ETA commitment" + "what the deposit secures (price lock, batch slot, early-access tier)."

---

## Gaps — what couldn't be captured from the corpus

### Hard gaps (data not in the available files; would require new collection)

- **Zero in-scope DC-1 Meta ads**, therefore zero ad-longevity / hook-band analysis. The corpus the user pointed at (Daylight.txt, 64 entries) is dominated by keyword-collision noise; the only Daylight-owned ads are 2 Kids creatives (excluded by scope filter). Section 3's "long-runner" weighting is therefore moot; LP copy is the proxy "proven control" set. **If Daylight launches adult DC-1 Meta ads in the future, this analysis should be re-run against that scrape.**
- **No documented email nurture sequence** for newsletter subscribers. The brand captures email at every page touchpoint but the welcome/nurture/abandoned-cart/post-purchase email copy is not in the corpus. **Critical gap for the user's portability work because the user's funnel is email-driven.** A subscription test (sign up to daylight newsletter; harvest 30-60 days of emails) would close this gap.
- **PDP (`buy.daylightcomputer.com/products/daylight-tablet`) copy was sandbox-blocked.** The cart / order page (`daylightcomputer.com/cart`) was captured as a substitute, but checkout-specific copy (final-confirmation page, payment-selection screen, shipping-address screen) was not extractable. Likely contains additional trust signals (Stripe logos, additional guarantee restatement, final upsell language).
- **FAQ answer bodies were JS-rendered and not extractable.** Question titles confirm topics (warranty length, VAT, BTC payment, discount codes, shipping cost, PO box) but the answers are not in the corpus. Warranty length is the most material gap — the cart guarantee panel conspicuously omits warranty terms.
- **Full blog post bodies for `/blog/sleep-101` and `/blog/blue-light-101`** were only partially captured. The screen-flicker-101 post was captured in full (17,691 chars) but the other two blogs only have title + author + opening paragraphs + product-callout list. Verbatim hooks from those two posts are limited.
- **Founder interview transcripts (Joe Rogan / Danny Jones, BGR, Mercury, Android Police, podcast circuit)** are referenced as launch surface but not transcribed in the corpus. The actual verbatim language Anjan Katta uses in those long-form interviews is likely the highest-quality belief-installation copy in the brand's universe, and it's not captured.
- **Press kit assets (logos, photography, video)** are noted as available via Google Drive but not analyzed visually.
- **Visual/imagery analysis** is text-derived only. The .png screenshots are present in the screenshots/ folder but not visually inspected in this analysis. Visual hooks (color palette in use, layout density, product photography style, image-to-copy ratio) would extend Section 3 if read.

### Soft gaps (judgment calls)

- **Affiliate / ambassador program copy** is unconfirmed (FAQ has the question, body not extracted; "Sunnyside" reference in web search appears to be a different brand). If Daylight has affiliate copy, it's not in the corpus.
- **Specific scarcity / urgency mechanics** appear soft — historical sold-out batches drove urgency in 2024-2025, but current copy is "in stock, ships in 3-5 days." Whether Daylight uses any countdown / batch / "X people viewing" mechanics in client-side code or email sequences is unknown.
- **The "Total active time 10 hrs" annotation** on one keyword-collision ad (Library ID 4402991913319721) is a Meta Ad Library data point worth noting for future analysis methodology — it implies some ads in the Meta Ad Library have explicit time-active annotations that this corpus didn't surface for Daylight's own creatives (because there are none). Useful methodology note for the user's other competitor scrapes.

### Open questions the corpus cannot answer

1. What does Daylight's first welcome email say?
2. Is there an abandoned-cart email and what does it say?
3. What does post-purchase email day 1 / day 7 / day 30 say?
4. What is the warranty length?
5. Are there discount codes, and to whom are they offered (educator? military? first-purchase? newsletter?)?
6. What % of buyers add a stylus / sleeve / sling? (Cart upsell conversion data is not in corpus.)
7. Does Daylight have an event-funnel precedent (in-person launch parties, demo events) that would inform the user's pre-launch event design? (Finesse Group case study mentions Conservatory of Flowers launch event May 2024 — single-event PR, not recurring.)
8. How does Daylight's organic search funnel attribute? (The blog is doing heavy SEO lifting per the editorial depth, but conversion data is not visible.)
