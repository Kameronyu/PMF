# Stopgap: mechanisms-in-play (read until `space-map.json` carries the slot)

**Why this exists.** Gate 2.2 ("is your UM differentiated?") and Gate 3.3-S3 ("is your mechanism already
claimed by a competitor?") need a **mechanisms-in-play** read: which mechanisms competitors lead with in a
cell, and whether each is **shared** (taken) or **unique** (ownable). The current `space-map.json` has **no
`mechanisms_in_play[]` field** — but the raw material was collected and the cluster was instructed; only the
output slot is missing.

**The real structural fix is specced in**
`.planning/phases/01-stage-m1-s1-light-pass/01-DEBUG-RUN-NOTES.md` → **BREAK 5**. Once that lands,
`space-map.json` carries `mechanisms_in_play[]` (collected + hook-traced) and **this stopgap is retired** —
read the field directly, no `[INFERENCE]` label needed.

Until then, derive the read yourself from the recorded data. **Do NOT emit a bare `DATA GAP` and skip the
mechanism check — the raw material is present; derive it and label it `[INFERENCE]`.**

---

## How to derive it (per combo cell under judgment)

1. **Source = `mechanism[]`**, already recorded per pitch in each
   `runs/<space>/corpus/<brand>/dump.json` → `creatives[].pitches[].mechanism[]`.
   - **NOT `problem_um_raw`** — it's sparse for gadget/maker spaces (≈6/36 pitches non-empty on the Arduview
     run) because these pages don't run pain-causal "why you suffer" stories. Empty is expected, not a gap.
     Use `problem_um_raw` only as a *secondary* signal when a cell actually has non-empty entries.
2. **Collect** the `mechanism[]` strings from the **LIVE, in-geo** brands in this cell. **Exclude**
   `comparable_bet_seed` brands (bet-evidence, not saturation) and dead/region-only brands (D-08).
3. **Cluster near-duplicates by meaning** (e.g. "two FPGAs / no emulation" and "FPGA-accurate, not emulated"
   = one mechanism). Count **distinct brands** per cluster — one prolific brand is not three.
4. **Classify ownability:**
   - **shared** = 3+ distinct brands lead the same mechanism → **not ownable**. If your UM's mechanism is in
     this set, it is *taken* → Gate 3.3-S3 = not a differentiator.
   - **unique** = exactly 1 brand → ownable / candidate UM.
5. **Scope per cell.** A mechanism shared in a *different* cell does NOT make it taken here. Only this cell's
   live brands count toward this cell's set.
6. **Label `[INFERENCE]`.** This was clustered at decision-time from raw dumps, not collected as a typed
   field. Surface `n=` per cluster and flag low-confidence merges. Lower the cell's confidence accordingly.

## Don't

- Don't skip the Gate 2.2 / 3.3 mechanism read with a bare `DATA GAP` — the data is there.
- Don't use `problem_um_raw` as the primary source — sparse by design for this space.
- Don't count `comparable_bet_seed` or dead/region-only brands into the cluster.
- Don't treat a cross-cell mechanism as taken in this cell.
- Don't write the derived cluster back into `space-map.json` — that's the S1 fix's job (BREAK 5), not the
  assessor's. Keep your derivation in the analysis output, fenced `[INFERENCE]`.
</content>
