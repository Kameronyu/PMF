# Mudita Kompakt — Corpus Notes / Gaps / CEO interview

Brand: Mudita
Slug: mudita-kompakt
Date pulled: 2026-05-23

## SANDBOX / BLOCKING ISSUES

1. **mudita.com and store.mudita.com return HTTP 403 to WebFetch** —
   Cloudflare bot block. All Mudita-owned page body copy in this corpus
   is **snippet-attested verbatim** (quoted by Google's index of the URL,
   not pulled live from the page).

2. **web.archive.org is also blocked from WebFetch** — could not pull
   archived versions of the homepage, manifesto, or blog posts.

3. **curl from bash is sandbox-denied** — no fallback HTTP path
   available in this session.

4. **Indiegogo body did not render via WebFetch** — only the page title
   ("Mudita Kompakt: More Offline. More Life. by Mudita") was returned.
   Reward-tier copy not extracted.

5. **Kickstarter page returned 403** — reward-tier copy not extracted.

6. **Amazon PDP body not extracted by WebFetch** — JS-rendered.

7. **Meta Ad Library: NONE resolved** for `Mudita` or `Mudita Kompakt`.
   See `meta-ads.md` for retry suggestions (try `wearemudita`,
   `We Are Mudita`, `Mudita sp z o o`, and region filter PL/DE).

## ORCHESTRATOR RECOMMENDED RETRIES

- Re-fetch all mudita.com pages with a browser-driver MCP (Playwright /
  Puppeteer) to bypass Cloudflare. Priority pages:
  1. mudita.com/products/phones/mudita-kompakt/ (main PDP — only have
     snippets right now)
  2. mudita.com/about/manifesto/ (positioning gold)
  3. mudita.com/stress-less/ (active LP — only have snippets)
  4. mudita.com/products/phones/mudita-kompakt/reviews/ (testimonials)
  5. mudita.com/community/blog/why-delaying-smartphones-for-kids-matters-how-kompakt-helps/
     (kids/first-phone sub-niche page — only have snippets)
  6. mudita.com/community/blog/black-friday-and-the-luxury-of-disconnection/

- Re-run `adlib-one.js` against:
  - `wearemudita`
  - `We Are Mudita`
  - `Mudita sp z o o`
  - regions: PL, DE, US, UK

- Pull Indiegogo + Kickstarter via browser driver for reward-tier copy.

## CEO MICHAŁ STASIUK — DIRECT QUOTES (verbatim, Yanko Design 2026-01-09)

These are the only fully-verified live quotes captured this session.
Source: https://www.yankodesign.com/2026/01/09/from-alarm-clocks-to-minimal-phones-how-mudita-is-building-a-calm-anti-ecosystem-for-digital-detox/

On concept recognition:
"most of our conversations here were with people who, you know, when they
hear what we are about, what we are doing, what the product is about,
they do get the concept."

On the adoption barrier:
"The difficult part is to actually implement the usage in their own lives
because it's a trade-off between the convenience and the less usage of
the device and the peace of mind."

On screen-time as the problem:
"The average screen time is above six hours a day in the US."

On the device's design purpose:
"this device is designed for that purpose of reducing the screen time."

On built-in vs. willpower-based constraints:
"You cannot disable the limitation on this device."

On business-model difference vs. big tech:
"The main difference is that the business model of large companies is
set to monetize the data...our device is designed not to be as appealing
as possible, rather it's designed for our users, clients, to do what
they need to do on the phone and then move on."

On market growth:
"The niche is growing and quite fast."

On AI:
"We do not see any need for AI usage in the products that we are
creating so far, because the problems we are trying to solve do not
require AI."

On design principles:
"In every product that we are making we are aiming for similar outcomes
for example we want to create simple products we want to create products
that are easy to use and easy on the eyes without any eye strain so we
design all of our interfaces to be pleasant not very cluttered without
any jumping elements."

On transparency:
"What we see is what you get...what you see is what you get this is this
is like something is a model yes."

## CEO MICHAL STASIUK — LAUNCH PR QUOTE (verbatim)

Source: PR release 2025-04-16
"Technology should enhance our lives, not take over them. With the Mudita
Kompakt, we're helping people break free from digital distractions so
they can focus on what truly matters to them; whether that's work,
relationships, or personal growth."

## FOUNDER MICHAŁ KICIŃSKI

Source: search snippet of https://mudita.company/our-founders
"Mudita is spearheaded by Michał Kiciński, the visionary founder of
Mudita and the renowned CD Projekt (The Witcher, Cyberpunk 2077)."

Mission statement (verbatim, search snippet of mudita.com/about/):
"Together, let's redefine technology as a trusted ally in our lives."

## SUB-NICHE FINDINGS (per user's targeted check list)

### Adult digital-minimalist sub-niche copy
PRESENT — primary positioning. "More Offline. More Life." tagline; copy
about "reclaim your focus and well-being," "digital wellbeing,"
"intentional living," "intentional technology use." Targets working
professionals dealing with notification overload.

### Teen / parent / "first phone" angles
PRESENT — explicit blog post:
"Why Delaying Smartphones for Kids Matters + How Kompakt Helps"
Talks about: "experts recommend... delaying full smartphone access until
at least age 13"; "Parents can sideload some approved apps for their
children, like WhatsApp or Signal"; "when we delay the smartphone, we're
not depriving kids of something—we're giving them room to thrive."
Also appears in customer testimonial: "great with kids."
Also in Gear Diary's 2025 "Sanity-Saving Gifts for Parents" gift guide.
Also in forum thread "The Terrible Costs of a Phone-Based Childhood"
(Jonathan-Haidt-aligned framing).

### Spiritual / mindfulness language
PRESENT — "mindful technology," "mindfulness," "intentional living,"
"mindful living," "calm," "peace of mind." Built-in Meditation App on
the device. Brand name itself ("Mudita") is a Buddhist Pali term for
sympathetic joy / vicarious joy (referenced organically by Buddhist /
Insight Timer / Jack Kornfield contexts but NOT exploited by Mudita
marketing).
Explicit blog: "How Mudita Kompakt Apps Support a Mindful and
Intentional Life" + "Mudita Kompakt & Embracing Mindfulness in the
Digital Age" + "The Science of Meditation & Mindfulness."

### Polish vs. global / English positioning differences
WEAK SIGNAL — same brand, same product, dateline "WARSAW, Poland" on
press releases. Two SKU regions (Global vs. North America Optimized) but
that's cellular-band optimization, not messaging. Interface supports 8
languages (English, Polish, German, French, Italian, Dutch, Spanish,
Portuguese). No evidence of differentiated Polish-market copy in English
search results — would need Polish-language Google query to test
properly.

### Faith / Bible angle
ABSENT — no Christian/faith positioning found. Brand name "Mudita" is
Buddhist origin but unleveraged. Search for "Mudita Kompakt faith Bible
Christian" returned only an unrelated book ("Mudita's Easy Bible" by
author "Mudita Eyes," no connection to the phone brand).

## COMPLETENESS ASSESSMENT

Coverage is **mid-fidelity**: positioning, pricing, awards, crowdfunding,
press releases, customer-testimonial quotes, and sub-niche angles are all
captured with verbatim source-attribution. Gap: full body copy of
mudita.com-hosted pages (PDP, manifesto, blog posts, reviews page,
stress-less LP) is fragmented into Google-snippet quotes rather than full
extracts. Meta Ad Library returned zero — likely organic-only brand.
Recommend orchestrator schedules a Cloudflare-bypassing re-fetch for
Mudita-owned pages before the synthesizer runs.
