# Aggregator Brief — Dumb Device Market · Market Profile

**One job:** roll up per-competitor records into one market profile. You do NOT
analyze new competitors and you do NOT score — you assemble.

## Inputs

- All competitor records in `/home/kyu3/PMF/runs/eink-tablets/markets/dumb-device/brands/`
- The roster: `/home/kyu3/PMF/runs/eink-tablets/markets/dumb-device/competitive-set.md`
- For e-ink incumbents: the Dumb-Device-specific deltas in `dumb-device/brands/`
  PLUS the full Faith records at
  `/home/kyu3/PMF/runs/eink-tablets/markets/faith/brands/` (reMarkable, Boox,
  Kindle Scribe, Daylight).
- Context: our product is a $900 foldable, programmable e-ink tablet. Market =
  the loose-niche / "more control over tech" market.

## Procedure

1. **Read all records** (incl. Faith records for the e-ink incumbents).

2. **Cluster into market cells = niche × transformation.** For Dumb Device the
   niche is loose, so cells will cluster by **sub-niche targeted**: e.g. "ADHD
   adults × focus tools," "digital minimalists × intentional tech," "deep-work
   knowledge workers × distraction-free writing," "parents × screen limits."
   A competitor sits in one primary cell.
   **Saturation counts WITHIN a cell only** — never pool across cells.

3. **Per cell, aggregate** — frequency counts for claims (base + enhanced),
   mechanisms / UMs, angles, features, sub-niches, buyer types. Plus price band,
   sophistication stage, paid-acquisition presence.

4. **Niche-discovery synthesis** — the *primary* deliverable for this market.
   Surface:
   - Which sub-niches recur most across the roster.
   - Which sub-niche is most contested; which is least contested (whitespace).
   - Whether any sub-niche shows the intersection of **strong proven-spend +
     low sophistication** — that's the whitespace sub-niche worth pursuing.

5. **Cross-cell synthesis:**
   - **Differentiation whitespace** — what transformation / lane is unclaimed.
   - **Price-band reality vs $900** — name where stripped-down tech actually
     commands premium (Daylight $729, Light Phone $300, Freewrite $549) vs.
     where it's cheap or free (software blockers $5–15/mo, OS defaults $0).
     Where does $900 sit and what gives it air?
   - **Proven-spend picture** — where money demonstrably flows.
   - **Problem-UM vs problem-mechanism** — "phone is the distraction" is
     near-certain to be a SHARED causal story; confirm and flag, so the
     differentiation plays as a Product-UM, not a Problem-UM.

6. **Light trend research** — WebSearch for: digital-minimalism trend, dumbphone
   revival, intentional-tech movement, app-blocker market trends, dopamine-fast
   cultural moments.

7. **Gate 1 evidence dossier** — assemble under the four variables.
   **Do NOT score.** Evidence only.
   - **Desire to Solve** — proven spend, core-driver proximity, severity,
     frequency.
   - **D2C Feasibility** — believability (can a $900 e-ink device credibly
     deliver "more control over tech"?), economics (price-band fit at $900).
   - **Market Sophistication** — claim / enhanced-claim counts, competitor
     sophistication, revenue, distribution, UM availability.
   - **Market Growth** — trend velocity, why-now, adjacent signals.

## Output

Write
`/home/kyu3/PMF/runs/eink-tablets/markets/dumb-device/dumb-device-market-profile.md`
using the same schema shape as
`/home/kyu3/PMF/runs/eink-tablets/markets/faith/faith-market-profile.md`.

Dense and factual. Cite which record each figure comes from.
