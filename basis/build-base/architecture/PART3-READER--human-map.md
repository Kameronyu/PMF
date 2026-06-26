---
status: reference
role: Plain-language companion to PART3 (agent map, the new decisions, the fixes, what's parked).
read-with:
  - architecture/PART3--architecture-design.md
supersedes: []
---

> **What this is:** the human on-ramp to PART3 (no build detail). **Read by:** the operator, for orientation - build sessions use PART3, not this.

# PART 3 — The Human Read

A plain-language companion to `PART3--architecture-design.md`. No glyphs, no knowledge-scoping, no teaching mechanics. This is the shape of the system, the agents and their jobs, the handful of things that actually need *you*, and what's parked for later. If you only read one file, read this one.

---

## What to read, and what to skip

- **`asran-repo-report.md`** — mechanical notes for the AI that rebuilds the system. What's wired, what's broken, exact field names. **You never need to read this.**
- **`PART3--architecture-design.md`** — the real design. But only parts are for you. For you: the agent map (§4), the per-agent cards (§6), the splitting verdicts (§4.3), what's still open (§10), the veto list (§12). For the AI implementer: §7 (knowledge scoping), §8 (orchestration plumbing), §9 (contract seams). 
- **This file** — the parts of PART 3 that are yours, in English.

---

## The system, end to end (who exists, what they do)

Think of it as a line: turn a bet into a brand roster → **analyze the competitors' funnels** → **map and pick the market** → study the winner's customers deeply → design the funnel → write the copy → check it. New pieces are marked **[NEW]**; the **R1 reorder** (funnel analysis before the map, VOC pass-1 after it, the light pass dissolved) is why the order below differs from the old run.

**Step 0 — Bet Compiler** **[NEW]**
Sits with you and turns your bet into a clean, tagged brief instead of a wall of prose. Pushes you where it's vague (what's the transformation slot, what counts as a comparable bet, what's the bet type). Output: the structured `bet-brief` everything downstream inherits.
*Why it matters: the run proved bad output traces straight back to a loose brief. This makes the brief the thing you nail first.*

**Step 1 — Competition search / Collect**
- **Finder** — searches the web in three lanes (big DTC, crowdfunding, marketplace), returns a brand roster.
- **Slop Checker** — checks every brand you *kept* is real and an actual competitor.
- **Coverage Checker** **[NEW]** — checks you didn't *miss* brands. Audits the search itself: did every territory get searched, did every seed brand resolve, did VOC mention brands you don't have, are the marketplace bestsellers all accounted for.
- **Dumper** — copies each brand's marketing word-for-word. No interpretation.
*Find, verify, fetch, extract only — **no classifying the space here**. That's now Step 3, after the funnels are read.*

**Step 2 — Funnel analysis** **[R1: moved before the map]**
Reads the competitors' funnels *before* the market is mapped — the core R1 change.
- **Assemble** — packages each competitor funnel (ad → landing page → product page, links verified, same brand).
- **Router** — decides how to treat each funnel.
- **Section Analyzer** — breaks funnel copy into *single ideas* and tags each one. (Your "classify each distinct idea one by one" — the ammo for writing your funnel.)
- Scripts then **quantify** ad counts + ad-longevity per funnel, rolled up per transformation and per angle, plus crowdfunding backing and the awareness spread.
Output: analyzed-funnel records + the ad-volume aggregate → feeds the Space Map.

**Step 3 — Space Map**
- **Space Classifier** — *the synthesizer, not a light-pass thinker anymore.* It reads the **analyzed-funnel structured rows (not raw copy)** and builds the canonical space: the NTP cells with their validation attached, and the numbers behind each pair (ad volume, LP volume, backers, mechanisms).
Output: the `space-map` → feeds the VOC market pass + Market Selection.

**Step 4 — VOC market pass** **[NEW wiring]** *(now after the map)*
Your customer-research engine run *shallow*, on each candidate market the map surfaces. Answers three things: do these people actually signal they want this; how do they talk about it; who are they regardless of this product. Also flags gaps — things customers want loudly that no competitor is selling.

**Step 5 — Market Selection**
Ranks the surviving markets using supply-side proof *plus* the VOC demand signal. Stops at a ranked shortlist. **You pick the winner.** (No COGS, no profitability here — it only reads what price the market is conditioned to; you decide if it's worth running.)

**Step 6 — VOC deep pass** **[NEW wiring]**
The same research engine run *deep*, on the winning niche only. Builds the verbatim copy bank the funnel and copywriter pull from.

**Step 7 — Funnel Architect** (one agent)
- **Awareness Reconciler** **[NEW, small]** — first settles what awareness level to sell at, by combining the competitor funnels (weighted by which are actually proven) with the VOC read, and flags it when they disagree.
- **Funnel Architect** — designs your funnel over everything above. Stays a single agent — you said splitting it was probably wrong, and that's honored.
- **Funnel Auditor** **[NEW]** — a cold checker that runs *after* the architect and *before* you, catching incongruency, skipped beliefs, illegal claims. Verdicts only, no design power. (This answers your "should an auditor go after the builder?" — yes.)

**Step 8 — Copywriter + Copy Chief** **[Copywriter built, Chief NEW]**
- **Copywriter** — writes the copy from the architect's brief. A constrained writer, not a strategist; respects your blocked claims; pulls real customer language from the bank.
- **Copy Chief** — reads the draft *line by line* and bounces it back: does this line do anything, does it actually install the belief, would a dumb reader want the next line, is it simple enough, is every word one a real customer uses. Loops back to the writer, then to you.

**Step 9 — Asset classify** — unchanged.

**Step 10 — Re-review** — the adversarial audit you already have, re-run on the upgraded system.

---

## The six things that are actually new and want your eye

Out of fifteen of my calls, these six are genuine *new shape* — derived from your annotations but real decisions you could veto. Everything else (below) is just a fix or a sensible default.

1. **Bet Compiler as a real Step-0 agent.** Your bet stops being prose and becomes a structured brief built in a working session. Biggest single lever, because everything inherits it.
2. **The market is studied by VOC *twice* — shallow to pick it, deep to build on it.** One engine, two depths, two products. This is the spine of your "the VOC for market selection is different from the VOC for angles." Worth a gut-check: do you agree market-selection VOC and copy VOC are different enough to be two passes.
3. **Coverage Checker as its own agent.** You said you didn't know how to design the "are brands missing" check. I made it audit the *search* (four evidence streams) instead of the roster. New mechanism for a job you wanted.
4. **Funnel Auditor exists.** A cold checker after the builder. You asked the question; this is me answering yes.
5. **Awareness Reconciler exists.** A small agent that settles what awareness level to sell at, instead of the architect guessing from a null field like it did last run.
6. **The "never merge currencies" rule becomes optional, not law.** I checked the whole KB — that rule isn't in it, it was only ever in the architect prompt. So I didn't delete it and didn't bake it in; I left it as a switch for you to settle later. You wanted to challenge it; now you can.

---

## The nine that are just fixes or defaults (say yes and move on)

Finder query floor kept as-is for now; line-reader folded into the chief instead of a separate agent; chief loop capped at 2 rounds; verbatim kept full at rest but fed to the architect in trimmed slices (this is the answer to your "is full verbatim too much for the architect — I'd like advice"); the no-ads/soft-gate overrides become logged instead of silent; a copy-craft file added to the writer; structure-specific theory loads only when the funnel shape needs it; optional cheap cleanup passes; an evidence field required on the awareness read. None of these change the shape — they patch holes the run exposed.

---

## What is NOT decided here — parked for the next sessions

These are real decisions, but they belong to the working sessions ahead (the bet session, the VOC session, the determination-tests session, the currency session). Don't try to settle them reading this — just know they're yours when you get there:

- **Whitespace vs scary** — when customers want something no competitor sells, is that opportunity or warning. Reserved entirely for you.
- **Every threshold** — how much signal clears a gate, how much revenue matters, anti-fluke floors.
- **The validation-currency model** — listing every currency, pricing each, and settling crowdfunding-vs-DTC (including your deposit-funnel point).
- **The actual tests** — what mechanically determines a transformation, a niche, a mechanism-vs-feature, congruency, etc. The system has a labeled empty slot for each; you and the AI fill them together.
- **What an "idea" can be** — the menu of things a piece of copy can be doing.
- **Fate of the never-merge rule** (see #6 above).

---

## Your structured-output question, answered

"Structured, not prose" does **not** mean robotic. It means tagged fields with normal English inside them. Your "bet 1 description" instinct is exactly it:

```
bet_id: bet-1
description:        a short sentence or two, plain English
product_features:  [transparent shell, see-through OLED, ATmega32U4, ~50g]
bet_type:          open-source-hackability-as-lead
transformation:    the open slot — prose is fine here
comparable_seeds:  [brand, brand]  each with a "why it fits" note
```

The tags exist so the next agent can grab "the bet" or "the transformation" without reading a paragraph and guessing. The *content* of each tag stays human. Structured envelope, prose contents.

---

## Bottom line for moving forward

The shape is settled enough to start. The first real working session is **the bet** (Step 0) — it's upstream of everything and it's the one you most need to do with the system, not have it do for you. Right behind it: **the VOC build**, because it's the thing that's been missing and it unblocks the most. Everything in the "parked" list gets decided inside those sessions, in order, with you in the chair.
