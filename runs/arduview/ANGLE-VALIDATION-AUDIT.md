# Arduview — Angle / Validation Audit (recovered signal)

**Source:** in-session Sonnet research agent (the "lost-signal" audit) that read raw `ads/` + `corpus/` + the funnel store to recover the per-brand angle + validation signal the pipeline flattened. Returned as text mid-session; preserved here before compaction.

**Provenance caveat:** the ad-longevity / sold-count figures below are the agent's reading of the raw files (`ads/flipper-zero.json`, `corpus/arduboy/...`), not independently re-verified by the main thread. Treat the Flipper run-length and "1M+ sold" figures as one layer removed. The funnel-store + market-selection citations I did read directly.

This is the recovered version of the validation/winning-angle map that gap #1 in `15-DEBUG-funnel-architect.md` says should have been a first-class upstream input.

---

## Per-brand angle + validation table

| Brand | Dominant angle(s) | Volume / validation evidence | Sophistication observed | Key verbatim (file) |
|---|---|---|---|---|
| **divoom** | belonging/identity (primary), desire (secondary) | 1 corpus creative; **0 paid ads** (`ads/divoom.json:11` active_ad_count "0"); 17+ testimonials; Forbes/WSJ/ELLE press; 20M-users tally | Stage 1–2 ("digital art + creative hardware ecosystem" edges Stage 2) | "make your space come alive…" `corpus/divoom/dump.json:13`; "Bring personality, widgets and pixel visuals into your workspace" `funnels/divoom-79bf5e01.json:83` |
| **playdate** | curiosity/novelty (primary), belonging (secondary) | 1 corpus creative; 0 paid ads; 9 belief records; Teenage Engineering authority transfer | **Stage 2** (pre-emptive wonder + gimmick-inoculation + design-collab) | "familiar, but unlike anything you've ever seen" `:43`; "very special black and white screen… way more amazing than you're probably imagining" `:49` |
| **pocket-operator** | curiosity/secret (primary), desire (secondary), belonging (tertiary) | 1 corpus creative; 0 paid ads; 9 belief records; PCB-as-design rationale present | **Stage 2 → 3 motion** (named engineering mechanism) | "a wall of sound in your pocket." `:27`; "by saving this cost, high quality components could be used to guarantee the best possible sound" `funnels/pocket-operator-af179d62.json:136` |
| **gameshell** | belonging/identity (primary: hacker/maker in-group), desire (secondary: retro/history) | **Lane B: $350K Kickstarter, 2,300 backers, funded+delivered**; 13 belief records | Stage 2 (Apollo analog, PICO-8/Libretro compatibility specificity) | "From 0.043MHz up to 1GHz… 90,000 times faster than the Apollo 11 guidance computer." `funnels/gameshell-8d8735c7.json:104` |
| **arduboy** | belonging/identity (primary: maker community), curiosity/desire (secondary) | 0 ads; community forum shows **854 replies / 32.7K views** on the Mini Kickstarter thread; strong community footprint | Stage 1 ("learn to code and create your own games"; "300+ Games") | **"Arduboy Mini [Kickstarter Funded!]"** `corpus/arduboy/clean/home.md:107` |
| **nothing-phone** | status/belonging (primary), curiosity/design-identity | 0 paid ads; homepage dominated by Charli xcx campaign; **transparent back is VISUAL, not a verbal claim** | Stage 1 on verbal claims (no claim text captured) | mechanism only: "transparent back design", "Glyph Interface LED lights" `corpus/nothing-phone/dump.json:21` |
| **flipper-zero** | curiosity/secret (dominant) | **48 active ads / 117 total; 90 ran 7+ days; longest 238 days continuous; "Over 1,000,000 Sold"** | Stage 2–3 ("world's first pocket control center"; hidden pogo pins; GPIO/iButton specificity) | "Imagine carrying a single gadget…" `ads/flipper-zero.json:18`; "Over 1,000,000 Sold" `:60`; "the world's first pocket control center. Small Device. Endless Control." `ads/flipper-zero_adv.txt:86` |

---

## Dominant-angle tell (the strongest validation signal in the set)

**Flipper Zero is the only brand that hammers ONE angle at scale with repeatable proof it works.**
- "Imagine carrying a single gadget that connects with nearly everything around you" + "Small Device. Endless Control." appears in **53 of 117 ads**, across formats, with a **155-day active streak** on the single top ad (lib 848913417899257, started Dec 30 2025, still active). `ads/flipper-zero.json:14-19`. This is the **curiosity / scale-curiosity** angle — the hook is "imagine all the things this small thing reaches into," not identity/pain/status.
- Secondary angle at volume: "What if one pocket device could replace all of the remotes, tags, and gadgets you use every day?" — **13 ads**, "Swiss Army knife of the future" tagline, longest instance 86 days (lib 864892109752696). `:619`.
- Third: "The 007 Multi-Tool for Real Life" — ~5 ad versions as a **landing-page headline variant** (status angle, spy-gear). `ads/flipper-zero_adv.txt:311`.

**Among the chosen-cell brands (divoom, playdate, pocket-operator): NO paid ad run data at all.** `ads/divoom.json:11` active_ad_count "0". They run organic/direct traffic only.

---

## Angle volume across the set

1. **Curiosity/novelty — highest total volume by far.** Flipper (53+13 = 66 of 117 ads on curiosity hooks, 7–238-day runs); Playdate (funnel is curiosity-first); Pocket-Operator ("wall of sound", "impossibly cheap"). **Strongest proven-winner signal in the dataset.**
2. **Belonging/identity — carried across 3 brands with depth** (Divoom desk-community + repeat-buyer testimonials; PO "pocket band" collector framing; GameShell hacker in-group) — but **zero paid volume; all organic.**
3. **Status** — Flipper only ("007"), tested as a landing headline. No dominant volume.
4. **Desire (access/democratization)** — PO "studio quality… affordable for everyone"; Flipper "replace all your remotes." Supporting, not lead.
5. **Pain** — **absent from all brands.** Zero pain-angle creatives.
6. **Care/gift** — Divoom press (Forbes Vetted "distinctive tech gifts"; WSJ "retro-tech gift"). Editorial positioning, not a paid creative angle. `funnels/divoom-79bf5e01.json:244`.

---

## What got lost (in raw data, absent/downgraded in the flattened outputs)

1. **Pocket-Operator's Stage-3 mechanism claim typed down to Stage 2; the PCB-as-aesthetic frame dropped from the cell tally.** The full engineering-rationale (no-case → cost → better components) is at `funnels/pocket-operator-af179d62.json:128-153` (position 5, Tier2), but `space-map.json:267-270` shows `enhanced_claim_count = 0`. **HIGH.**
2. **Playdate is running Stage 2–3, not Stage 1 as labeled** (`market-selection.md:215`). Pre-emptive wonder, TE authority transfer, gimmick-inoculation Q&A, "Here's the truly unique bit." **HIGH.**
3. **Divoom's repeat-buyer / collector sub-audience dropped** — verbatim "The fifth device in my ever-growing arsenal," "This is my third item from this company" `funnels/divoom-79bf5e01.json:209,213`. A desire/collector signal that never reached the flattened outputs. **HIGH.**
4. **Divoom's editorial press as a GIFT angle lost** — Forbes/WSJ/ELLE "distinctive tech gift" `funnels/divoom-79bf5e01.json:251-267`. A second buyer persona (giver) absent from the analysis. **HIGH.**
5. **Arduboy Mini's funded Kickstarter missed** — `corpus/arduboy/clean/home.md:107`. Arduview IS Arduboy-based; a funded miniature-Arduboy Kickstarter is the closest possible analog and appears nowhere in market-selection/space-map. **HIGH.**
6. **Flipper's "Over 1,000,000 Sold" not surfaced as a bet-class scale signal** — `ads/flipper-zero.json:60` (6+ ads, 19–86-day runs); longest ad overall 238 days. **MEDIUM** (correctly excluded as a seed, but the bet-evidence is richer than the summary conveys).
7. **`qualifying_creatives = 0` is accurate but the framing understates it** — it means **no candidate-cell brand is running ANY paid ads** (no ads attempted), not "ads ran and died." `market-selection.md:21,57`. Materially different read of demand. **HIGH.**

---

## Transparency / novelty-object angle verdict

1. **Pocket-Operator's bare-PCB rationale is the only direct evidence of "exposed hardware as the product."** `corpus/pocket-operator/dump.json:21-23`; angle_raw `:14` "no case needed because the exposed circuit board IS the design." HIGH that it's a real PO angle; **MEDIUM** that it translates to a game-console context.
2. **Nothing Phone's transparent back is confirmed visual-only, not a verbal desire claim.** `dump.json:21` lists it as a mechanism field; ad library returns 0 ads. No copy template to mine.
3. **No brand leads "see-through" as a verbal hook in paid ad copy.** Zero ads across all brands use "transparent / see-through / visible guts" as a hook.
4. **Curiosity has the most paid volume** (Flipper: 53 ads, 7–238-day runs). The structural bet — strange/visible hardware → curiosity hook — applies directly to a transparent OLED.
5. **Belonging/identity has real unprompted VOC** (Divoom "such a vibe, it looks amazing on my desk" `funnels/divoom-79bf5e01.json:203-230`) but **zero paid volume.**

**Verdict:** curiosity/novelty = strongest proven-winner by volume + durability; belonging/identity = real but organic-only (payoff, not lead); transparency-as-a-verbal-hook = **unproven by anyone in paid** (opportunity + uncertainty). Safest bet from this corpus: **curiosity-leading into transparency-as-mechanism**, with the aesthetics doing the belonging work at the page level.

---

**Files the agent cited:** `corpus/{divoom,pocket-operator,playdate,gameshell,nothing-phone,flipper-zero}/dump.json`; `corpus/arduboy/clean/home.md`; `corpus/nothing-phone/clean/home.md`; `ads/{divoom,nothing-phone,flipper-zero}.json`; `ads/flipper-zero_adv.txt`; `runs/arduview/funnels/{divoom,pocket-operator,playdate,gameshell}-*.json`; `runs/arduview/space-map.json`; `runs/arduview/market-selection.md`; `runs/arduview/funnels/_tally.json`.
