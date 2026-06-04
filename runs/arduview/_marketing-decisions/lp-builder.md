# LP Builder — marketing decisions you own

> Surfaced from the BUILD-FEEDBACK run retro. The "what went wrong" is signal; the fixes are yours to decide.

---

## Accent/highlight contrast on dark surfaces was unspecified

**What happened:** The hero headline highlight ("see right through") rendered black-on-black. The same bug recurred on the deposit page ("$5 deposit" highlight). The accent/highlight class defaulted to dark ink and was only patched for some dark containers — because the style spec never defined context-aware contrast rules.

**Why it matters (marketing):** A headline that can't be read is zero conversion. The highlight treatment is often the most attention-loaded word or phrase in a hero — if it disappears on dark backgrounds, the primary hook fails silently.

**Your call:** Define the contrast rule for accent/highlight treatments: which text classes need a light-on-dark variant, and on which containers does dark ink become unacceptable? This is a marketing decision about which words get emphasis and under what conditions — the engineer implements the rule you specify.

---

## Fold budget and element order were not specified in the copy brief

**What happened:** The copy brief specified what to say but not what goes above the fold on each page or in what order. LP hero and deposit page both required mid-build corrections when fold priority hadn't been pre-decided.

**Why it matters (marketing):** Above-the-fold real estate is the highest-value decision in an LP. On the deposit page specifically, the offer value (51% off) is the conversion hook — if its fold position isn't specified, the builder will make a default guess that may bury the hook.

**Your call:** For each page (LP hero, deposit page), state the fold budget explicitly: which elements must be visible before scroll, in what order, and which is the single dominant CTA. This is a copy-brief input, not a design decision.
