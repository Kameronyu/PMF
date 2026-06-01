# E-Ink Tablet Transformations — Flat Map

Per-brand transformation read directly from claims (no bucketing). Pulled from
existing records in `/home/kyu3/PMF/runs/eink-tablets/markets/faith/brands/`
and `/home/kyu3/PMF/runs/eink-tablets/eink-category-evolution/brands/`.

Transformation = what the brand markets the device to actually do, read from
hero claim. Niche = who's buying. Form factor noted for foldable mapping.

---

## Flat list (one brand per row, verbatim transformation)

| Brand | Year | Transformation (verbatim or paraphrased from hero claim) | Niche | Form factor | Scale / raise |
|---|---|---|---|---|---|
| reMarkable | 2017+ | "The Paper Tablets for Focused Work" / "made for thinking" / "35% less stress, 20% more focus vs PC" | Knowledge worker / professional | Slate | ~$200M+ rev |
| Boox | 2015+ | "Beat brain rot with a smarter kind of screen-time" / "encourages you to slow down, minimize distractions" / "relieve digital eyestrain and improve productivity" | Multi-segment power-user (tech-enthusiast, parent, writer overflow) | Slate (multiple SKUs) | Large OEM |
| Kindle Scribe | 2022 | "Never buy a notebook again" / "completely reimagined from the ground up for productivity" / "A new kind of notebook" | Amazon-ecosystem reader who wants to write | Slate | Amazon scale |
| Daylight DC-1 | 2024 | "Meet DC-1. A new kind of computer, designed for deep focus and wellbeing" / "calmer relationship with your computer" | Adult digital minimalist | Slate | $30M+ funding, rev unverified |
| Daylight Kids | 2024 | "To the end of iPad Kids" / "You can't blame kids for struggling to focus" / "happier, healthier, smarter children" | Parent of K-8 child | Slate | ESA-fundable, ~3 active Meta ads |
| Supernote | 2019+ | "(re)gain stolen creative focus and think deeply for breakthrough results" / "Replace all your notebooks" | Writer / deep-thinker / journaler | Slate | ~$15-35M rev proxy, 420k monthly visitors |
| Reinkstone R1 | 2021 | "Ultimate True Color DES E-Paper Tablet" (spec-led, no life-outcome) | Color e-ink early-adopter tech buyer | Slate | $1.02M KS, brand pivoted to phone cases |
| Bigme inkNote Color | 2022 | "World's First Color E-Ink Tablet w/ Cameras" (spec-led) | Color-spec shopper | Slate | $624k KS |
| Bigme Galy | 2022 | "World's First Color E Ink Gallery™ 3 Tablet" (spec-led) | Color-spec shopper | Slate | $421k KS |
| Bluegen OKPad | 2024 | "Double the Screens, Double the Potential" (capability-led, no real transformation) | Generic productivity / dual-screen curious | **Foldable (360° hinge)** | $119k KS |
| Viwoods AiPaper | 2024 | "Think better, on paper" + AI bundle (Q&A, OCR, translate) | AI-curious knowledge worker | Slate | $275k KS, 65+ active Meta ads |
| iFlytek AINOTE 2 | 2025 | "World's First GPT-5-Powered Paper Tablet" / "thinnest AI-powered paper tablet" | AI-trust Western buyer (GPT-5 brand-borrow) | Slate | $1.13M KS, ~220 active Meta ads |
| MOAAN FLY | 2025 | "True Color E-ink Paper Tablet with Mag Charging Cover" (spec + accessory) | Pocket color reader, late commoditized | Slate | $57k KS |
| Diptyx | 2025 | "Own your device, own your books" / open-source / DRM-free | Open-source / DIY / anti-platform identity | **Foldable (book-fold dual-panel)** | ~$64k+ mid-flight |
| mooInk V | 2025 | "Opens and closes like a real book" / "lighter and more colorful reading" | Taiwan pleasure-reader, color book | **Foldable (flex single-fold)** | Pre-order Taiwan, units unverified |

Notable absences (no record but known PMF):
- Regular Kindle (Paperwhite/Oasis/Basic) — transformation: "carry your library, read easy on eyes" — Amazon mass reader
- Kobo (Libra/Sage/Elipsa) — transformation: "read what you love your way" — library-friendly reader
- Pocketbook — EU reader, similar
- Chinese eye-health-led brands (Hanvon, iReader, Hisense Q-series) — transformation: "护眼 / protect your eyes" — student / parent / eye-strain-concerned buyer

---

## Cluster by transformation (similar life-outcomes grouped)

### "Think more clearly / focus / deep work"
- reMarkable — "focused work, made for thinking"
- Supernote — "(re)gain stolen creative focus, think deeply for breakthrough results"
- Kindle Scribe (secondary) — "distraction-free deep work"
- Viwoods (with AI flavor) — "think better, on paper"
- Daylight DC-1 (overlap) — "deep focus and wellbeing"
- **Foldable in this cluster:** None.

### "Replace your paper / consolidate notebooks"
- Supernote — "Replace all your notebooks" (primary)
- Kindle Scribe — "Never buy a notebook again" (primary)
- reMarkable (secondary) — "paperless workplace"
- Boox (secondary) — "paperless consolidation"
- **Foldable in this cluster:** None.

### "Calm / less device anxiety / better wellbeing"
- Daylight DC-1 — "calmer relationship with your computer"
- Daylight Kids — "happier, healthier, smarter children"
- Boox (overlap) — "Beat brain rot... slow down, minimize distractions"
- **Foldable in this cluster:** None.

### "Eye health / no eye strain"
- Boox — explicit, decade-long "eye-friendly ePaper devices since 2008"
- Daylight DC-1 — "Say goodbye to eye-strain" + circadian/sleep
- Kindle (regular, foundational) — "easier on eyes than a tablet"
- Chinese eye-health brands (Hanvon, iReader, Hisense) — lead transformation
- **Foldable in this cluster:** None.

### "Pleasurable reading / book-like experience"
- mooInk V — "Opens and closes like a real book / lighter and more colorful reading"
- Kindle (regular) — "millions of books, easy on eyes"
- Kobo — "read what you love your way"
- Bigme Galy — color reading (spec-led)
- **Foldable in this cluster:** mooInk V (Taiwan only)

### "Digital sovereignty / own your stuff"
- Diptyx — "Own your device, own your books" (DRM-free, open-source)
- **Foldable in this cluster:** Diptyx ✓

### "AI-augmented thinking on paper"
- Viwoods AiPaper — "Think better, on paper" + AI bundle
- iFlytek AINOTE 2 — "GPT-5-Powered Paper Tablet" / "thinnest AI paper tablet"
- **Foldable in this cluster:** None.

### "End iPad Kids / focus device for child"
- Daylight Kids — "To the end of iPad Kids"
- (Bark Phone, Gabb, Wisephone all play this but are PHONES, not e-ink tablets)
- **Foldable in this cluster:** None.

### Spec-led / no real transformation (capability talk)
- Reinkstone R1, Bigme inkNote Color, Bigme Galy, MOAAN FLY — "World's First [spec]"
- Bluegen OKPad — "Double the screens, double the potential"
- Boox (partially) — "Android freedom, your apps everywhere"
- **Foldable in this cluster:** Bluegen OKPad ✓ — and capped at $119k, exactly because there's no transformation.

---

## Foldable coverage by transformation

| Transformation | E-ink owner | Foldable plays it? |
|---|---|---|
| Think more clearly / focus / deep work | reMarkable + Supernote + others | NO |
| Replace your paper / consolidate notebooks | Supernote + Kindle Scribe | NO |
| Calm / less device anxiety / wellbeing | Daylight DC-1 | NO |
| Eye health / no eye strain | Boox + Kindle + Chinese brands | NO |
| Pleasurable reading / book-like | Kindle + Kobo + mooInk V | YES — mooInk V (Taiwan only) |
| Digital sovereignty / own your stuff | Diptyx | YES — Diptyx (hobbyist tier) |
| AI-augmented thinking on paper | Viwoods + iFlytek | NO |
| End iPad Kids / kids focus device | Daylight Kids | NO |
| Spec-led / capability ("two screens") | Bluegen + Bigme + Reinkstone | YES — Bluegen OKPad (capped $119k) |

**Foldables play 3 transformations:** book-like reading (Taiwan only), sovereignty (hobbyist), and "more screens" capability (capped).

**Foldables do NOT play:** think-more-clearly, replace-paper, calm, eye-health, AI-on-paper, end-iPad-kids — six transformations with validated PMF and zero foldable.

---

## Source records
- Faith brands: `runs/eink-tablets/markets/faith/brands/{remarkable,boox,kindle-scribe,daylight}.md`
- Students brand: `runs/eink-tablets/markets/students/brands/supernote.md`
- Evolution brands: `runs/eink-tablets/eink-category-evolution/brands/{reinkstone-r1,bigme-inknote-color,bigme-galy,bluegen-okpad,viwoods-aipaper,iflytek-ainote-2,moaan-fly,diptyx,mooink-v}.md`
- Crowdfunding scan: `runs/eink-tablets/crowdfunding-scan.md`
