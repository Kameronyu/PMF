# Handoff — Crowdfunding Teardown (next session)

Paste the kickoff prompt below into a fresh Claude Code session to run this
end-to-end. Everything the new session needs is on disk already.

## What's being done

Reverse-engineer how e-ink / foldable / adjacent-tablet crowdfunding campaigns
were run. Pull verbatim hero copy, reward tier structure, raise chronology,
comment objections, pre-launch evidence, press, outcome. Produce a copyable
launch playbook + objection list for our own ~$100k foldable e-ink campaign.

Same 2-pass corpus pattern as the brand-marketing run that just finished, but
applied to crowdfunding campaigns and with a Playwright fetcher to bypass
Kickstarter / Indiegogo's Cloudflare blocks.

## Tooling already on disk

| File | Purpose |
|---|---|
| `runs/eink-tablets/scripts/crowdfund-fetch.js` | Playwright-based fetcher. Bypasses KS/IGG 403s. Smoke-tested working on Bluegen OKPad KS page (980KB HTML, 9.4KB text). Use it for campaign body / comments / updates / risks / faq fetches. |
| `runs/eink-tablets/scripts/crowdfund-finder-brief.md` | Pass 1 brief — build the campaign roster. |
| `runs/eink-tablets/scripts/crowdfund-dumper-brief.md` | Pass 2 brief — per-campaign verbatim dump. |
| `runs/eink-tablets/scripts/crowdfund-teardown-brief.md` | Pass 3 brief — synthesizer that produces Kam's exact deliverable (A/B/C/D output). |

Playwright + Chromium 1217 are installed globally. No setup needed.

## Existing work to REUSE (don't re-research)

| Artifact | What it gives you |
|---|---|
| `runs/eink-tablets/crowdfunding-scan.md` | 16-row seed list of crowdfunded e-ink / adjacent campaigns. Starting candidate pool. |
| `runs/eink-tablets/eink-category-evolution/brands/bluegen-okpad.md` | Bluegen OKPad evolution record. Includes transformation, claims, ad-library data, $119k raise. Use for that campaign's transformation/claims/spec-role analysis. |
| `runs/eink-tablets/eink-category-evolution/brands/diptyx.md` | Diptyx evolution record. Mid-flight raise as of Dec 12: $64k+. Open-source / book-fold positioning. |
| `runs/eink-tablets/eink-category-evolution/brands/viwoods-aipaper.md` | Viwoods AiPaper evolution record. $275k KS raise. AI-as-Feature-UM positioning. |
| `runs/eink-tablets/eink-category-evolution/brands/mooink-v.md` | mooInk V evolution record. NOT crowdfunded (Taiwan pre-order) — note this if it gets pulled into the roster. |
| `runs/eink-tablets/eink-category-evolution/brands/{bigme-galy,bigme-inknote-color,moaan-fly,reinkstone-r1,iflytek-ainote-2}.md` | Other evolution records — for campaigns that are crowdfunded, the dumper should rip the transformation/claims sections and fill only the crowdfunding-specific gaps (tiers, chronology, comments, pre-launch). |
| `runs/eink-tablets/eink-category-evolution/evolution-profile.md` | Cross-brand chronological synth — already covers the AI/color/form-factor wedge evolution. Teardown synth can cite this for "what worked" comparisons. |
| `runs/eink-tablets/marketing-corpus/birdseye-map.md` | Cross-brand marketing transformation map (10 brands, 16 transformation cells). Useful for the teardown synth's "what funded campaigns led with" classification. |

## Orchestration sequence

1. **Pass 1 — Finder** (one agent, ~10-15 min)
   - Spawn a general-purpose subagent with the prompt:
     "Read `runs/eink-tablets/scripts/crowdfund-finder-brief.md` and execute it exactly."
   - Agent returns with `crowdfunding-corpus/campaign-roster.md`.
2. **CHECKPOINT with Kam on the roster.** Use AskUserQuestion to confirm:
   - Roster scope (deep-dive set size)
   - Whether the underperformer hunt found 2+ failures
   - Whether to expand or trim before fan-out
3. **Pass 2 — Dumpers** (parallel agents, one per deep-dive campaign, ~30-40 min)
   - Spawn N background agents (one per deep-dive slug), each with the prompt:
     "You are the crowdfunding corpus dumper for `<slug>`. Read `runs/eink-tablets/scripts/crowdfund-dumper-brief.md` and execute it exactly. Use `crowdfund-fetch.js` for KS/IGG/Crowd Supply pages. If your slug has an existing evolution record at `runs/eink-tablets/eink-category-evolution/brands/<slug>.md`, read it first and REUSE transformation/claims/spec data rather than re-researching."
   - Use `run_in_background: true`. Wait for completion notifications.
   - Some agents will hit sandbox blocks on `node crowdfund-fetch.js` — be prepared to run the script yourself and re-launch the agent pointing at the saved raw artifacts.
4. **Backfill** any campaign-body / comments / updates fetches that the
   dumpers were blocked from running. Then re-launch any blocked dumpers
   to finish their corpus.
5. **Pass 3 — Teardown synthesizer** (one agent, foreground, ~10-15 min)
   - Spawn a general-purpose subagent with the prompt:
     "Read `runs/eink-tablets/scripts/crowdfund-teardown-brief.md` and execute it exactly. Read every campaign corpus at `runs/eink-tablets/crowdfunding-corpus/<slug>/`. Output to `runs/eink-tablets/crowdfunding-corpus/teardown.md`. Apply Kam's exact format spec (A/B/C/D)."
6. **CHECKPOINT with Kam on the teardown.** Final deliverable.

## Known landmines

- **Kickstarter Cloudflare** — WebFetch 403s on KS campaign body pages.
  ALWAYS use `crowdfund-fetch.js` for those.
- **Indiegogo Cloudflare** — same.
- **Crowd Supply** — also 403s WebFetch frequently. Use `crowdfund-fetch.js`.
- **Comments scraping** — KS comments paginate; the Playwright script clicks
  "Load more" up to 5x. Heavy comment threads may need manual passes.
- **Wayback Machine** — sometimes 403s WebFetch. Use a public web-search
  cached snapshot as fallback.
- **Underperformer hunt** — easy to skip. Failed campaigns are rarely in
  the first 3 search results. Kickended.com + r/Kickstarter + Hackaday
  flop coverage are the lanes. If you can't find 2, say so explicitly.
- **Survivorship bias** — every funded-campaign teardown looks like a
  playbook. The capped ones (Bluegen at $119k pitching nothing,
  Reinkstone R1's brand pivot to phone cases after a "success") teach
  more.

## Kickoff prompt to paste into the new session

```
You are running the crowdfunding teardown for the PMF e-ink tablet project.

Read these files in order before doing anything:
1. /home/kyu3/PMF/handoff-crowdfunding-teardown.md (this doc — full orchestration)
2. /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-finder-brief.md (Pass 1)
3. /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-dumper-brief.md (Pass 2)
4. /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-teardown-brief.md (Pass 3)

Then execute the 6-step orchestration sequence in the handoff doc. Two human
checkpoints with me: after the roster (before fan-out) and after the teardown
(final deliverable).

Tools are ready: crowdfund-fetch.js (Playwright, tested), Chromium 1217
installed globally, all briefs on disk. Existing evolution records for 4
campaigns (Bluegen OKPad, Diptyx, Viwoods AiPaper, mooInk V) are at
runs/eink-tablets/eink-category-evolution/brands/ — REUSE those, don't
re-research.

Target deliverable: runs/eink-tablets/crowdfunding-corpus/teardown.md per
Kam's exact A/B/C/D spec (campaign table / chronology / objection list /
playbook).

No em dashes, no jargon. Exact figures or "not found." At least 2
underperforming campaigns included or an explicit note that they couldn't
be found.
```

## When you're done

The deliverable is `runs/eink-tablets/crowdfunding-corpus/teardown.md`.
After Kam approves, this feeds into the foldable-launch playbook for our
own ~$100k campaign. Likely follow-ups: pre-launch landing page draft,
tier structure proposal, objection-rebuttal FAQ for the campaign page.
