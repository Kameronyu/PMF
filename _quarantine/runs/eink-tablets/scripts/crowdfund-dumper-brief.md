# Crowdfunding Per-Campaign Dumper Brief — Marketing + Mechanics Archaeology

You dump ONE crowdfunding campaign's full marketing surface and mechanics
to a campaign-specific corpus directory.
**No synthesis. No interpretation. Verbatim extraction only.** A separate
teardown synthesizer agent does the analysis later.

## Hard rules

1. **Verbatim only.** Quote actual copy from the source. If you cannot quote
   it, write "not found" — do not invent.
2. **No synthesis.** Don't classify transformations / niches / angles. The
   teardown synth does that.
3. **Source every extract.** Each block gets a URL or artifact path + date
   captured.
4. **Exhaustive over efficient.** Better to over-dump than miss a tier or
   objection.
5. **Survivorship-aware.** For underperforming campaigns: capture the
   negative signals (low backer count, comments full of refund requests,
   "no updates in X months" gaps).

## Tooling — KS/IGG fetch via Playwright

WebFetch will 403 on most Kickstarter and Indiegogo campaign body pages
(Cloudflare + React SPA). Use the project's Playwright helper instead:

```
node /home/kyu3/PMF/runs/eink-tablets/scripts/crowdfund-fetch.js <slug> <url> --type=<type>
```

- `<type>` is one of `campaign | comments | updates | risks | faq`
- Output lands at `runs/eink-tablets/crowdfunding-corpus/<slug>/raw/<type>-<timestamp>.{html,txt,png}`
- Read the `.txt` for visible text dump; `.html` for structure if needed

If the script is unavailable in your sandbox, ask the orchestrator to run
it for you. Do NOT fabricate body text from search snippets when the goal
is verbatim hero copy.

For supplementary sources (Kicktraq, Wayback, BackerKit, press write-ups,
creator's blog / Medium / Hackaday), use WebFetch / WebSearch directly —
those typically aren't blocked.

## Procedure

### Step 1 — Campaign body
- Fetch the main campaign URL via `crowdfund-fetch.js --type=campaign`.
- Read the `.txt`. Extract verbatim:
  - Hero headline + subhead
  - First-screen video title / description if surfaced in text
  - Full story / about copy in order it appears
  - Risks & Challenges section
  - FAQ section
  - Creator bio / about-team
  - Pre-launch landing-page reference if mentioned

### Step 2 — Reward tiers
- Extract every tier verbatim: tier name, price (super-early-bird /
  early-bird / regular), reward contents, estimated delivery, ship-to,
  pledged count, limit (if sold out, note "SOLD OUT").
- Compute discount gap (super-early-bird → regular) — numeric, not synth.

### Step 3 — Updates (chronological)
- Fetch `<url>/posts` via `crowdfund-fetch.js --type=updates`.
- Extract each update: date, title, first 200-300 chars verbatim.
- This is how the campaign messaging shifted over time.

### Step 4 — Comments (objections)
- Fetch `<url>/comments` via `crowdfund-fetch.js --type=comments`.
- Capture distinct comment themes verbatim (paraphrase the theme, but
  pull 1-3 verbatim representative comments per theme).
- Note refund-request volume, "no updates" complaints, hinge-durability
  / shipping / software-maturity concerns.
- Kicktraq for backer/day pacing if comments paginate too aggressively.

### Step 5 — Pre-launch evidence
- Search the campaign creator's site / Medium / Substack for the
  pre-launch landing page.
- Wayback the pre-launch URL if discoverable to confirm timing.
- Look for: notify-me / "coming to Kickstarter" page, mailing-list signup
  CTA, BackerKit pre-launch presence.
- Note any launch-agency mentions (Jellop, BackerKit, Krowdster, LaunchBoom,
  Enventys, M+R) in the creator's history or press.

### Step 6 — Chronology / raise shape
- Kicktraq for daily-pledge timeline (or fetch via WebFetch — Kicktraq
  usually allows scraping).
- Capture: day-1 raise, day-2, % of total in first 48h, mid-campaign
  flatness, final-72h bump.

### Step 7 — Press during campaign window
- WebSearch press coverage dated within the campaign window: Engadget,
  Hackaday, TechCrunch, Liliputing, Good e-Reader, The Verge, CNX
  Software, Yanko Design, NotebookCheck.
- Verbatim headline + URL + date.

### Step 8 — Post-campaign outcome
- Search for: ship status, BackerKit fulfillment updates, "where is my
  pledge" threads on r/Kickstarter.
- Vaporware vs shipped-late vs shipped-on-time vs partial-ship.

## Output

Write to `runs/eink-tablets/crowdfunding-corpus/<slug>/`:

```
campaign-body.md       — hero, story, risks, FAQ, creator bio, verbatim
tiers.md               — every reward tier, verbatim, with prices + sold-out flags + discount gap
updates.md             — chronological list with verbatim excerpts
comments.md            — comment themes + verbatim representative quotes + refund/update-complaint volume
pre-launch.md          — pre-launch LP, mailing list, launch-agency evidence
chronology.md          — raise-shape data (Kicktraq or similar), day-1 / 48h / mid / final
press.md               — verbatim press headlines + URLs + dates
outcome.md             — ship status, partial / late / dead, links to evidence
notes.md               — gaps, sandbox blocks, page-ID issues, dead links
raw/                   — html / txt / png artifacts from crowdfund-fetch.js
```

Slug convention: lowercase, hyphenated, brand-only. Use the slug the
finder assigned in `campaign-roster.md`.

## REUSE rule

If the finder marked the campaign as "has existing evolution record =
yes," READ the existing record at
`/home/kyu3/PMF/runs/eink-tablets/eink-category-evolution/brands/<slug>.md`
first. Use it for: transformation, mechanism, claims, sample hooks,
revenue tag — copy verbatim into the corpus where it overlaps. Then
fill the crowdfunding-specific gaps the evolution record didn't cover
(tier structure, chronology, comments objections, pre-launch evidence,
press during the campaign window). Don't re-research what's already in
the evolution record.

## Return a SHORT summary (<200 words)

- Campaign + slug
- Counts: tiers extracted, updates extracted, distinct comment themes,
  press hits
- Hit ratio: which fetch attempts worked vs. blocked
- One sentence on whether the campaign clearly funded / capped / failed
  and the rough raise vs goal
- File paths written
- NO transformation/claim analysis (synth's job)
