# Handoff — Per-Brand Granular Analysis + Per-Market Sales-Message Playbooks

Paste the kickoff prompt at the bottom into a fresh Claude Code session to
run this end-to-end. Everything the new session needs is on disk already.

## What's being done

Kam is running a deposit funnel for his $900 foldable e-ink tablet. Separate
research is producing the **deposit-funnel STRUCTURE**. This work produces
the **winning sales MESSAGES** to drop into that structure.

Pass 1 builds a per-brand granular persuasion inventory for each of 10
brands (every headline, hook, angle, testimonial, trust signal, claim,
objection handle, transformation framing, funnel section, deposit-funnel
evidence, longest-running ad). Pass 2 synthesizes those granular files
per-market into adaptable sales-message playbooks.

## Tooling already on disk

| File | Purpose |
|---|---|
| `runs/eink-tablets/scripts/pass0-fetch-brief.md` | Pass 0 brief — supplementary fetch (screenshots + deposit-funnel hunts + ad start-date enrichment) |
| `runs/eink-tablets/scripts/granular-analyzer-brief.md` | Pass 1 brief — per-brand 13-section granular analysis (hard rules + self-audit checklist baked in) |
| `runs/eink-tablets/scripts/market-playbook-brief.md` | Pass 2 brief — per-market sales-message playbook with proven hooks/headlines/objections + synthesis section flagged |
| `runs/eink-tablets/scripts/crowdfund-fetch.js` | Playwright fetcher (already smoke-tested — bypasses Cloudflare + JS-rendered SPAs). Use for Pass 0 screenshots + deposit-funnel page fetches. |
| `runs/eink-tablets/scripts/adlib-one.js` | Meta Ad Library fetcher. Use for Pass 0 ad start-date enrichment. |

Playwright + Chromium 1217 are installed globally. No setup needed.

## Existing work to USE as inputs (don't re-research)

| Artifact | Role |
|---|---|
| `runs/eink-tablets/marketing-corpus/<brand>/{landing-pages,meta-ads,funnel-mechanics,partnerships,notes}.md` × 10 brands | Pass 1 reads these as the primary corpus. ~9,250 lines total. |
| `runs/eink-tablets/marketing-corpus/birdseye-map.md` | Pass 2 ONLY — gives cross-brand saturation context. Pass 1 is forbidden from reading this. |
| `runs/eink-tablets/eink-category-evolution/transformations-flat-map.md` | Pass 2 ONLY — for context. Pass 1 forbidden. |
| `runs/eink-tablets/scripts/analyzer-framework.md` | Both passes — vocabulary spine. |
| `definitions.md` | Both passes — locked vocabulary. |

## The 10 brands

- supernote · kindle-scribe · remarkable · daylight-dc1 · daylight-kids
- light-phone · mudita-kompakt · boox · ipad · notability-goodnotes

## The 4 markets (Pass 2)

| Market | Slug | Brands |
|---|---|---|
| M1 — Paper-replacement | `M1-paper-replacement` | supernote, kindle-scribe, remarkable |
| M2 — Calm / digital boundary | `M2-calm` | daylight-dc1, light-phone, mudita-kompakt |
| M3 — Student note-taking | `M3-student-notetaking` | remarkable, boox, supernote, ipad, notability-goodnotes |
| M4 — General-purpose tablet (KW + e-reader) | `M4-general-purpose-tablet` | ALL 10 — highest priority, Kam will run this funnel |

## Orchestration sequence

### Pass 0 — Supplementary fetch (1 agent, sequential, ~45-75 min)

Spawn ONE general-purpose subagent:
> "Read `runs/eink-tablets/scripts/pass0-fetch-brief.md` and execute it
> exactly. Use `crowdfund-fetch.js` (Playwright) for the 4 brands needing
> screenshots and the 5 brands needing deposit-funnel hunts. Use
> `adlib-one.js` for any ad start-date enrichment needed. Write
> `notes-pass0-fetch.md` per brand."

If any bash commands are sandbox-blocked, the agent will report — run them
yourself from the orchestrator level.

### CHECKPOINT with Kam after Pass 0

Use AskUserQuestion to confirm:
- Pass 0 results per brand (screenshots captured? deposit funnels found?)
- Whether any gaps are blocking before fanning out 10 per-brand agents
- Whether to expand or trim screenshot scope before Pass 1

### Pass 1 — Per-brand granular analysis (10 agents, two waves of 5, ~30-50 min)

CRITICAL: per-brand isolation. Each agent reads ONLY its own brand's
files + its own Pass-0 supplement. Forbidden from reading sibling brand
files, birdseye-map.md, or transformations-flat-map.md.

**Wave 1 (5 parallel agents in background):**
- supernote, kindle-scribe, remarkable, daylight-dc1, daylight-kids

Per agent prompt:
> "Granular analyzer for **<brand>**. Slug: `<brand-slug>`. Read
> `runs/eink-tablets/scripts/granular-analyzer-brief.md` and execute it
> exactly. Read ONLY your brand's corpus files + Pass-0 supplement. DO
> NOT read sibling brand corpora or any cross-brand synthesis files.
> Output to `runs/eink-tablets/marketing-corpus/<brand>/granular-analysis.md`
> with all 13 sections per the brief. Run the self-audit checklist
> before returning. Write incrementally to avoid loss on crash."

**Wave 2 (5 parallel agents in background — fire after Wave 1 completes):**
- light-phone, mudita-kompakt, boox, ipad, notability-goodnotes

(Running waves of 5 instead of all 10 at once to respect rate limits and
to allow mid-run inspection. Boox is the heaviest brand — flag it as
crash-prone per prior run history.)

### Pass 2 — Per-market sales-message playbook (4 agents, parallel, ~30 min)

Spawn 4 parallel agents:

Per agent prompt:
> "Market playbook synthesizer for **M<n>** (<slug>). Brand set:
> <brands>. Read `runs/eink-tablets/scripts/market-playbook-brief.md`
> and execute it exactly. Read the granular-analysis.md files for your
> brand set + birdseye-map.md + analyzer-framework.md + definitions.md.
> Output to `runs/eink-tablets/marketing-corpus/markets/<slug>/playbook.md`
> with all 13 sections. The Top 15 Hooks and Top 20 Headlines sections
> are the load-bearing deliverable for Kam's funnel — verbatim, ranked
> by spend signal. The Recommended Messages section MUST be flagged with
> the SYNTHESIS block per the brief."

### CHECKPOINT with Kam after Pass 2

Use AskUserQuestion to present the 4 playbooks. Particularly M4 (highest
priority — Kam's actual funnel will run from this).

## Known landmines

1. **Per-brand agents drifting into cross-brand synthesis.** Hard-rules
   block in `granular-analyzer-brief.md` enforces. Self-audit checklist
   catches "Unlike reMarkable..." style lapses. If you see any in output,
   reject and rewrite.
2. **Sandbox blocks on `adlib-one.js` and `crowdfund-fetch.js`.** Common.
   Run the scripts yourself from orchestrator when agents report blocks.
3. **API socket crashes mid-run.** Prior runs lost Boox + reMarkable
   agents around 60-65 tool uses. Mitigation: tell agents to write
   incrementally (after each major section) rather than accumulating
   everything in memory. Watch Wave 2 closely.
4. **Visual-section thinness for brands with zero screenshots.** Pass 0
   captures fix this for 4 brands. For brands where screenshots already
   exist (supernote, kindle-scribe, etc.) — actually they don't, audit
   showed 0 across all 10. So Pass 0 capture is universal-ish. Verify in
   Pass 0 output.
5. **iPad ad gap.** Existing iPad meta-ads.md has 0 iPad-specific creative
   (71-ad sample was all iPhone 17 launch). Pass 0 task 3 fixes via
   tighter `adlib-one.js` query (`"iPad"` not `"Apple"`).
6. **Mudita Cloudflare block.** Existing corpus is snippet-attested. Pass
   0 Playwright captures should fix this for Mudita pages too.

## Kickoff prompt to paste into the new session

```
You are running the per-brand granular analysis + per-market sales-message
playbook for the PMF e-ink tablet project (Kam's deposit-funnel sales-
message extraction work).

Read these files in order before doing anything:
1. /home/kyu3/PMF/handoff-granular-analysis.md (this doc — full orchestration)
2. /home/kyu3/PMF/runs/eink-tablets/scripts/pass0-fetch-brief.md (Pass 0)
3. /home/kyu3/PMF/runs/eink-tablets/scripts/granular-analyzer-brief.md (Pass 1)
4. /home/kyu3/PMF/runs/eink-tablets/scripts/market-playbook-brief.md (Pass 2)
5. /home/kyu3/PMF/runs/eink-tablets/scripts/analyzer-framework.md (vocabulary)

Then execute the 3-pass orchestration sequence in the handoff doc:
- Pass 0: 1 supplementary-fetch agent → checkpoint with Kam
- Pass 1: 10 per-brand granular analyzers in two waves of 5
  (parallel/background within each wave) → no checkpoint, ship to Pass 2
- Pass 2: 4 per-market playbook synthesizers in parallel/background →
  checkpoint with Kam on the final 4 playbooks

CRITICAL — Pass 1 isolation: each per-brand agent reads ONLY its own
brand's corpus + Pass-0 supplement. NEVER reads sibling brand files OR
birdseye-map.md. Cross-brand comparison is Pass 2's only job. The
granular-analyzer-brief.md enforces this with hard rules + a self-audit
checklist — if any per-brand output contains "Unlike <other brand>..."
or saturation calls, reject and rewrite.

Tools are ready: crowdfund-fetch.js (Playwright, tested) + adlib-one.js
(Meta Ad Library), Chromium 1217 installed, all 4 briefs on disk,
existing brand corpora at runs/eink-tablets/marketing-corpus/<brand>/
(10 brands, ~9,250 lines).

Target deliverable: 4 market playbook files at
runs/eink-tablets/marketing-corpus/markets/<slug>/playbook.md with
verbatim top-15 hooks ranked by days_running, top-20 headlines, claim
saturation tables, angle inventories, objection handle libraries, and
recommended-messages synthesis section.

Final acceptance: Kam can pick 5 verbatim hooks from M4's playbook and
drop them as ad-headline variants into his deposit funnel without
adaptation work.
```

## When you're done

Final deliverables on disk:
- 10 per-brand `granular-analysis.md` files
- 4 per-market `playbook.md` files
- 10 `notes-pass0-fetch.md` files documenting supplementary fetch results
- Screenshots in 10 `<brand>/screenshots/` dirs

Kam then mines the M4 playbook for his deposit-funnel sales copy. M1/M2/M3
playbooks become durable inputs for future market work.
