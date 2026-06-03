# Daylight DC-1 — Meta Ad Library (Verbatim)

Brand: Daylight Computer Co. (adult flagship DC-1 only)
Slug: daylight-dc1
Dumped: 2026-05-23

---

## Active ads on the flagship adult page

**Resolved advertiser:** Daylight Computer (pageID 575419519610777, ~59.9K followers)
**Active ad count:** 0
**Library IDs loaded:** 0
**Source artifact:** `/home/kyu3/PMF/runs/eink-tablets/adlibrary/daylight_adv.txt` (page-resolution + active-ad scan via adlib-one.js; scan date per Faith record artifact, 2026-05-22)

The official flagship "Daylight Computer" Meta page returned ZERO active ads at scan time. No adult/wellbeing DC-1 ad creatives surfaced on Meta paid social.

---

## Keyword query — also no flagship ads

**Brand query:** "Daylight Computer DC-1 tablet"
**Resolved advertiser:** NONE
**Active ad count:** n/a
**Source artifact:** `/home/kyu3/PMF/runs/eink-tablets/adlibrary/daylight-kw_adv.txt`

No additional advertiser surfaced for the DC-1 product keyword.

---

## Ads found under "Daylight Computer Co." page (pageID 125345827332586)

These ads ARE active and are run from a Daylight Computer Co. page, but the creative is explicitly for **Daylight Kids** (CTA destination: KIDS.DAYLIGHTCOMPUTER.COM). They are dumped here for the orchestrator's awareness that the adult/Co. Meta page is the surface used to run the Kids creatives — but they belong in the `daylight-kids/` corpus, NOT the adult DC-1 corpus.

**Source artifact:** `/home/kyu3/PMF/runs/eink-tablets/adlibrary/Daylight_adv.txt` (forced pageID 125345827332586, 2 results)

### Ad #1 (Kids creative on Co. page)
- Library ID: 25449345561351571
- Started running on: Dec 18, 2025
- Format: Video (0:51)
- Active: yes
- Advertiser display: "Daylight Computer Co. with Daylight Kids"
- Sponsored, primary text (verbatim):
  > "Introducing, Daylight Kids. A movement to create happier, healthier, and smarter children.
  >
  > The Daylight Computer is the perfect 1st device to give your children (whenever you feel ready for that!), and that's because it has been intentionally designed to be low stimulation and non addicting:
  >
  > 📝A grayscale, paper-like display that is easy on children's sensitive eyes & brain
  >
  > 🕯️100% blue light free (amber mode) backlight for minimal sleep disruption to ensure restful nights
  >
  > 🧠A custom software experience that eliminates the notifications, doomscrolling, and addicting algorithms.
  >
  > Daylight is different than others tablets because it is utility based rather than dopamine based, so kids can focus most on playing outside in the backyard or riding their bikes with friends.
  >
  > Daylight is also designed to be used outside…so kids can learn whilst basking in all the benefits nature has to offer.
  >
  > Daylight Kids software is also digitally safe. Simple parental controls and carefully curated apps, so parents can finally take a much deserved sigh of relief when handing over tech to their precious littles.
  >
  > To the end of iPad Kids…and to the new era of Daylight Kids ☀️🍃"
- Headline: "A Computer That's Actually Good for Kids"
- CTA button: "Shop now"
- Destination domain: KIDS.DAYLIGHTCOMPUTER.COM
- → Note: belongs in `daylight-kids/` corpus

### Ad #2 (Kids creative on Co. page)
- Library ID: 1387928046359715
- Started running on: Dec 18, 2025
- Format: Video (0:43)
- Active: yes
- Advertiser display: "Daylight Computer Co. with Daylight Kids"
- Primary text: identical verbatim to Ad #1 (same copy, different video cut)
- Headline: "A Computer That's Actually Good for Kids"
- CTA button: "Shop now"
- Destination domain: KIDS.DAYLIGHTCOMPUTER.COM
- → Note: belongs in `daylight-kids/` corpus

---

## Summary — adult DC-1 Meta footprint
- **Zero active adult-DC-1 ad creatives** at scan time on either the "Daylight Computer" page (575419519610777) or via keyword search.
- Existing Daylight ads on Meta are 100% Daylight Kids creatives, regardless of which Co. page runs them.
- Adult-DC-1 paid acquisition (if any) is NOT on Meta during the scan window. The adult funnel runs via PR + podcasts + influencer / press coverage (Wired, The Verge, Tech Radar, Daring Fireball, Joe Rogan Experience demo) per Faith-market record.
- Re-running `adlib-one.js` against pageID 575419519610777 was sandbox-blocked in this session; the existing artifact is dated 2026-05-22 (within Phase-0 window, treated as current).
