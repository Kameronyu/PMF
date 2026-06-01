# Mudita Kompakt — Meta Ad Library

Brand: Mudita
Slug: mudita-kompakt
Date pulled: 2026-05-23

## RESULT: NO ACTIVE META ADS RESOLVED

`runs/eink-tablets/adlibrary/mudita-kompakt_adv.txt` and `mudita_adv.txt`
both returned:
- status: ok
- resolved_advertiser: NONE
- active_ad_count: n/a
- library_ids_loaded: 0
- TYPEAHEAD CANDIDATES: (none — forced pageId or no matches)

Meaning: the `adlib-one.js` script's typeahead lookup found no advertiser
Page matching "Mudita" or "Mudita Kompakt". Either:
1. Mudita does not currently run Meta paid ads (plausible — Polish brand,
   tight community/direct-response focus, KS-funded, primarily Instagram-
   organic at @wearemudita with 35K followers);
2. Their Meta advertiser Page is named differently (e.g., "We Are Mudita"
   or under a Polish entity name) and the typeahead missed it;
3. Active ads exist only in EU regions and US-default search missed them.

## RECOMMENDED ORCHESTRATOR RETRY

Re-run `adlib-one.js` with:
- `Mudita sp z o o`
- `We Are Mudita`
- `wearemudita`
- region filter: PL (Poland) and DE (Germany), not US-only

If still null, mark Mudita as "organic-only / KS-funded, no paid Meta
spend" for the synthesizer.

## ORGANIC SOCIAL HANDLE

Instagram: @wearemudita — 35K followers, 946 posts (per search snippet,
2026-05-23). This is the brand's primary social distribution.

## OBSERVED TWITTER/X PROMO (NOT META, NOTED FOR CONTEXT)

URL: https://x.com/wearemudita/status/2011094456838008925
Verbatim copy:
"Mudita Kompakt, Harmony 2 & Bell 2 ➡️ now 15% off (automatically applied)
Reclaim your attention, your sleep, and your mornings.
➡️ [link]
#wearemudita #ReclaimYourYear"
