# Crowdfunding Teardown Synthesizer Brief — Playbook Output

You read every per-campaign corpus and produce the teardown deliverable
to Kam's exact spec. This is the synthesis pass over the dumper output.

## Read first

1. `/home/kyu3/PMF/runs/eink-tablets/scripts/analyzer-framework.md` —
   vocabulary discipline (transformation / niche / claim / feature / angle).
2. `/home/kyu3/PMF/definitions.md` — locked vocabulary.
3. `/home/kyu3/PMF/runs/eink-tablets/crowdfunding-corpus/campaign-roster.md`
   — the campaign list.
4. Every per-campaign corpus directory at
   `/home/kyu3/PMF/runs/eink-tablets/crowdfunding-corpus/<slug>/` —
   read all 9 .md files per campaign.

## Output format — Kam's exact spec

Write `/home/kyu3/PMF/runs/eink-tablets/crowdfunding-corpus/teardown.md`.

### A. Campaign table — one row per campaign

| Campaign | Product | Led with (classified) | Spec role | Platform | Raised / goal / % | Backers / avg pledge | Tiers (early-bird → regular) | Day-one spike? | Shipped? |

**"Led with" classifications** (pick ONE per campaign):
- `form-factor` — the device's shape / format is the reason-to-exist
  (e.g., "first foldable color e-reader")
- `transformation:<name>` — a specific buyer outcome (focus, reading,
  paper-replacement, calm, AI-on-paper, etc.) read literally from the
  hero headline
- `spec/utility` — features or specs are the hero (e.g., "World's First
  GPT-5-Powered Paper Tablet" — spec leads, transformation second)
- `identity` — buyer-identity hook (e.g., "for writers", "for thinkers")

The classification IS the key field. Funded campaigns vs capped ones will
read differently here.

### B. Chronology notes

For the 3-4 most relevant campaigns (foldables + biggest raisers +
underperformers), write 2-4 plain sentences each on:
- Pre-launch window length + mailing-list / notify-me evidence
- Day-1 spike size + % of total in first 48 hours
- Mid-campaign behavior (flat / second-wave / momentum)
- Final-72-hour bump
- Any launch-agency or major creator-partner driver

### C. Objection list — ranked by frequency

Read every campaign's `comments.md`. List recurring comment-thread
objection themes across the dataset, ranked by how often they appear:

| Objection theme | # campaigns where it appeared | Verbatim representative quote | Campaign source |

Expected themes (verify, don't pre-assume):
- "Why not just buy a [reMarkable / Boox / Kindle Scribe]"
- Hinge / fold durability concerns
- Shipping reliability ("will you actually ship")
- Software maturity / firmware bugs
- Price vs feature ratio
- Reward-tier confusion or "early-bird sold out before I saw it"
- DRM / app ecosystem fears

### D. What the funded ones did that the capped/failed ones didn't

Plain English. The playbook takeaway. Compare across:
- Led-with classification (form-factor vs transformation vs spec)
- Pre-launch window + mailing-list size signals
- Tier structure (number of tiers, super-early-bird discount gap, scarcity
  triggers)
- Day-one spike + creator-partner / launch-agency driver presence
- Hero copy specificity (vague vs concrete buyer outcome)
- Risks/FAQ candor (handled objections head-on vs ignored them)
- Update cadence during campaign (kept momentum vs went silent)

This is the section Kam actually reads.

## Hard rules

- **No em dashes.** No jargon (UM, sophistication stage, niche×transformation
  saturation). Plain English.
- **Exact figures or "not found."** Never estimate a raise / backer / pledge
  number. If the dumper marked something "not found," carry that through.
- **Include underperformers.** If the finder couldn't surface 2, say so up
  front and downgrade the "what funded did vs capped did" section to
  clearly-labeled directional.
- **No fabricated objections.** Comment themes have to trace to a real
  verbatim representative quote in the corpus.
- **Distinguish synthesis from verbatim.** Use single quotes or block
  quotes for verbatim; your own words in plain text.

## Output checks (per Kam's spec)

Before returning, verify:
- [ ] No em dashes, no jargon in output.
- [ ] Exact figures or "not found" — no estimated raise/backer numbers.
- [ ] At least 2 underperforming/failed campaigns included, or a clear
      note that they couldn't be found.
- [ ] "Led with" classified for every campaign.
- [ ] Tier structure and day-one spike captured where visible.
- [ ] Objection list is real comment themes, not invented.
- [ ] If fetch was limited, that was stated up front and output labeled
      directional.

## Return a SHORT summary (<300 words)

- File path written
- Campaign count by "led with" classification
- Top 3 objection themes + how often they appeared
- Headline "what funded did vs what capped did" pattern (one paragraph)
- Confidence caveats: which campaigns have thin corpora, which figures
  are "not found"
- Any campaigns that surfaced in the corpus but the synth couldn't
  classify cleanly
