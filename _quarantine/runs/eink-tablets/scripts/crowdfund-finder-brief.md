# Crowdfunding Finder Brief — Build the Campaign Roster

ONE JOB: build the campaign roster the per-campaign dumpers will work on.
Find, classify, tag. No deep teardown — that's the dumper agent's job.

## Read first

1. `/home/kyu3/PMF/runs/eink-tablets/crowdfunding-scan.md` — the 16-row
   crowdfunding scan that surfaced campaigns earlier. This is your
   starting candidate pool.
2. `/home/kyu3/PMF/runs/eink-tablets/eink-category-evolution/brands/{bluegen-okpad,diptyx,viwoods-aipaper,mooink-v}.md`
   — evolution records already exist for these 4. Note them — the
   dumper agents should REUSE these, not re-research.
3. `/home/kyu3/PMF/definitions.md` — locked vocabulary.

## What's in scope

E-ink, foldable e-ink, and adjacent tablet / writing-device crowdfunding
campaigns on Kickstarter, Indiegogo, Crowd Supply, BackerKit. Include
campaigns from 2018 onward — older if they're foundational (Light Phone
II, original Pomera-style writing devices).

Specific must-include candidates (from Kam's prompt):
- mooInk V
- Diptyx
- Bluegen OKPad
- Viwoods AiPaper
- Modos Paper
- Any Pomera / Freewrite / Zerowriter writing-device campaign
- Verify if Supernote / Boox have crowdfunded any model

Plus surface during search: any e-ink / foldable / e-reader / writing-tablet
campaign on KS or IGG that funded above ~$50k OR clearly failed.

## Underperformer hunt (CRITICAL — usually missed)

Find AT LEAST 2 underperforming or failed campaigns. Search paths:
- Kickended.com aggregator (failed projects)
- KS "Discover" filtered by category Hardware / Gadgets / DIY Electronics +
  funding-ratio sort
- r/Kickstarter, r/shutuptakemymoney threads about flops
- Google: "kickstarter e-ink failed", "indiegogo e-reader didn't ship",
  "crowdfunding scam e-ink", "[campaign name] vaporware"
- Wayback archive of older Hackaday / Liliputing / Good e-Reader "Kickstarter
  flop" coverage
If you cannot find 2 underperformers, state this explicitly and document
what you searched.

## Per-candidate data to capture (roster-level only)

For each campaign:
- Name + creator
- Platform + URL
- Year launched
- Format (pure e-ink, hybrid, minimalist-non-eink, foldable)
- Raise + goal + % (exact, mark "not found" if not visible)
- Backer count (exact, or "not found")
- Outcome (shipped / late / partially shipped / dead / vaporware / mid-flight)
- Tag: **deep-dive** / **skim** / **skip**

## Tagging rules

- **deep-dive**: foldable e-ink, e-ink tablet that funded ≥ $100k or notably
  failed, writing-device with explicit teardown value. ~8-12 campaigns.
- **skim**: e-ink-adjacent, smaller raises, useful for objection / tier
  patterns but not their own full teardown. ~3-6 campaigns.
- **skip**: out of scope (phones-only unless explicitly distraction-positioned,
  smartwatches, e-ink signage / displays).

## Output

Write `/home/kyu3/PMF/runs/eink-tablets/crowdfunding-corpus/campaign-roster.md`:

```
# Crowdfunding Campaign Roster

## Deep-dive (full teardown)
| Slug | Name | Platform | URL | Year | Format | Raised / goal / % | Backers | Outcome | Has existing evolution record? |
| ... |

## Skim (lighter touch)
| same columns |

## Skip (and why)
| name | reason |

## Underperformer / failure hunt
| same columns + a "what went wrong (surface read)" column |

## Notes
- search paths used
- gaps (campaigns we couldn't verify)
- known data limits (KS body fetch may need crowdfund-fetch.js Playwright)
```

## Checkpoint

After writing the roster, RETURN to the orchestrator with a short summary:
- Total counts per tag
- Underperformers found (or explicit "couldn't find 2")
- Surprises / hidden candidates surfaced beyond the must-include list
- Any data gaps the dumper phase will hit

The orchestrator will checkpoint with Kam before fanning out the dumpers.
