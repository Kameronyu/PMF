# iPad — Meta Ad Library (Verbatim Corpus)

- brand: Apple iPad
- slug: ipad
- pulled_at: 2026-05-23
- artifact source: `/home/kyu3/PMF/runs/eink-tablets/adlibrary/apple_adv.txt`
- script: `adlib-one.js` (run by orchestrator)

## Page-ID resolution

- brand query: "Apple"
- status: ok
- resolved advertiser: **Apple / @apple — pageID `434174436675167`, 16M followers, 36.6M page followers** (top typeahead score 120.0)
- active_ad_count reported: **~3,000 ads**
- library_ids loaded in artifact: **71 ads** (a small slice of the 3,000-ad pool was captured before the script paginated out)

Adjacent Apple-branded pages NOT selected (kept for reference):
- `100484820802` Apple TV / @appletv (31.8M)
- `615085188507202` Apple Music / @applemusic (4.6M)
- `193068997219396` Apple Pay / @applepay (9.1K)

## iPad-specific creative in the 71-ad sample

**Count of iPad-specific ads in the loaded 71-ad sample: 0.**

Verification — keyword grep over `apple_adv.txt`:
- "ipad" — 0 hits
- "iphone" — 65 hits
- "macbook|mac mini|mac studio|imac" — 1 hit
- "apple watch|airpods|vision pro" — 1 hit
- "pencil" — 0 hits
- "magic keyboard" — 0 hits
- "tablet" — 0 hits
- "ipados" — 0 hits
- "tear through" — 0 hits
- "crush your" — 0 hits

The 71-ad sample is dominated by the **iPhone 17 / iPhone Air / iPhone 17 Pro launch flight** (start dates clustered around Apr 29, 2026). Hooks seen include (all iPhone, not iPad — listed only to show what filled the slots iPad creative did NOT):
- "Tougher than any smartphone glass. Ceramic Shield 2 on iPhone 17."
- "Charge up to 50% in 20 minutes with fast charging on iPhone 17."
- "Meet the new iPhone 17, iPhone Air and iPhone 17 Pro."
- "Discover how easy it is to switch to iPhone with the Move to iOS app."
- "Upgrade to iPhone 17 Pro for effortless group selfies with Centre Stage."
- "Save on iPhone 17 Pro when you trade in your Android phone."
- "Experience lightning-fast performance with the new iPhone 17 Pro."
- "iPhone Air with titanium frame is more durable than any previous iPhone."
- "iPhone Air camera system works like two advanced cameras in one."
- "Save on a new iPhone 17, iPhone Air, or iPhone 17 Pro by trading in your current iPhone."
- "The latest generation of iPhone on the powerful A19 and A19 Pro."
- "Get the newest iPhone models, with prices starting as low as ₹64900.00."
- Spanish-language variants: "Cámbiate al iPhone 17e y obtén 4 veces más almacenamiento inicial en comparación con el iPhone 12." / "Cámbiate al iPhone 17 Pro y graba al mismo tiempo con las cámaras frontal y trasera usando Captura Dual." / "Cámbiate a la nueva generación de iPhone. Con conexión satelital, para que te mantengas en contacto, incluso sin señal."

Format: mix of `0:00 / 0:06`, `0:00 / 0:07`, `0:00 / 0:08`, `0:00 / 0:10`, `0:00 / 0:12`, `0:00 / 0:15` (video) interleaved with image cards. Multiple ads carry "4 ads use this creative and text" / "6 ads use this creative and text" — Apple recycles creative across many `library_ids`.

## Why no iPad creative was captured

- Apple's page is brand-wide (~3,000 active ads) and the 71-ad load is a top-of-list slice currently saturated by the iPhone 17 launch flight (all April 29, 2026 start dates).
- The Apple page does not split iPad onto a separate FB page (unlike Apple TV / Music / Pay).
- To isolate iPad creative the orchestrator needs to either (a) re-run with a deeper pagination cap or (b) re-run a keyword-filtered query (e.g. "iPad" or "Apple Pencil") against the same pageID, or (c) accept that iPad creative is sub-dominant in Apple's current Meta flight and rely on web-LP corpus for iPad copy.

## Action items for the orchestrator

1. **Re-run `adlib-one.js` with a higher page cap** to get past the iPhone 17 launch flight (try 500–1000 library_ids).
2. **Alternative:** run a keyword-filtered Meta Ad Library query on Apple pageID `434174436675167` with `q=iPad` or `q=Apple Pencil` — this returns only ads whose creative mentions iPad / Pencil.
3. Once captured, expect iPad creative to skew toward Back-to-School flights (Jun–Sep), holiday gift flights (Nov–Dec), and iPad-launch-day flights (typically May/October). Outside those windows iPad share-of-voice on Meta is low.

## Verbatim iPad ad copy — none captured this run.

No iPad-specific `library_id`, creative, or LP destination is in this artifact. Re-run required to populate this section.
