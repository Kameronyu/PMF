# Scoring specimens — the known-good hooks to judge FELT criteria against

Felt criteria (C1 curiosity, C6 credibility) are scored **pairwise against these**, not on
an absolute 1–10 and never by the model that wrote the candidate. Randomize presentation
order; penalize verbosity explicitly; treat any single score as noisy (a triage signal,
not a certification).

## Open-loop / curiosity reference (judge C1 against these)
- "I think I just got scammed by every supplement brand for 10 years — until I found this."
- "The hollow fiber revolution that's making cardiologists trash their own compression socks happened completely by accident."
- "The reason your collagen supplements aren't working (and what actually does)"

Ask: does the candidate make the next line as necessary as these do? → prefer | tie | weaker.

## Credibility / skepticism-bridge reference (judge C6 against these)
- prior-failure framing: "even though I'd tried everything else"
- third-party framing: "my doctor was shocked when..."
- direct acknowledgement: "I know this sounds too good to be true"
- mechanism specificity: "here's the specific thing that made it work" (not just "it worked")

## High-specificity reference (sanity-check C4 winners)
- Verbatim winners: "14 hours, no swelling" · "lost 9 lbs in 6 days without cutting carbs" · "$4,200 in one week".
- Round-number anti-pattern (NOT specimens — deliberately not in source as winners): "$10,000", "100 lbs".
- The source's own precise contrast examples: "$9,340", "11.4 lbs".

## How to run the pairwise judge
1. Present candidate + one specimen, order randomized.
2. Ask which better satisfies the named criterion and why (criteria before verdict).
3. Record `prefer|tie|weaker` + the reason. `weaker` contributes no pass for that criterion.
4. Never let the model that generated the candidate be the judge.
