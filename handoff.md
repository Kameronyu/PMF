# Handoff

Entry point for the next session (likely Claude Code).

## Current state (2026-05-21)

- `workflow.md` is now the full spine — phase structure (Phase −1 → 8) **plus** per-phase research questions, merged back from Kam's original planning doc (an earlier draft had dropped the depth). Locked.
- Manual research run #1 done: a Phase 0 competitor map of the e-ink tablet space, 31 brands, in `runs/eink-tablets/`. `market-map.md` is its output and a worked example of the finder → analyzer → aggregator agent pattern.
- Tooling lessons (`runs/eink-tablets/scripts/`): SimilarWeb blocks automated browsers (traffic supplied manually); Meta Ad Library keyword search is noise-polluted — resolve by advertiser Page ID (`adlib-one.js`); review-proxy revenue estimation mostly fails (Amazon/AliExpress block scraping) — revenue est is an unsolved gap.
- Open loose end: the 31 per-brand records in `runs/eink-tablets/brands/` still carry pre-correction Ad Library counts; only `market-map.md` §5.0 is corrected.

## Read these in order

1. `definitions.md` — locked vocabulary. Universal language for the project. Don't modify unless explicitly asked.
2. `workflow.md` — phases of a research run. Workflow layer, not agent layer.
3. `capability_inventory.md` — the ~20 capabilities the system performs. Tagged. Foundational and downstream Unders documented. Locked decisions enumerated at the bottom.

## What's locked

- The capability list (~20 items, see `capability_inventory.md`)
- The phase structure (`workflow.md` — Phases 0–4 substantive, 5–8 deferred)
- The vocabulary (`definitions.md`)
- Architectural decisions enumerated under "Locked decisions" in `capability_inventory.md`

## What's open

Two foundational Unders that must resolve **before** any agent specs get written. Both detailed in `capability_inventory.md`:

1. **Map / persistence layer.** Every capability reads/writes to a shared store. Output schemas depend on this. Read interface matters (Phase 4 gates read from the map). Design this first.
2. **Authorship + source metadata pass-through.** Architectural constraint on the VOC chain. Must be preserved scraper → classifier → clusterer → copy bank. Treat as non-negotiable.

Downstream Unders (parked, resolve via manual runs first — do NOT pre-design):

- Gap analysis scoring (Gate 1)
- Win-decision framework (Gate 2)
- Filter thresholds throughout

## What comes next

**The active job is a deliverable, not system-building:** a strong PMF theory for an e-ink tablet, then run the ad test. `workflow.md` is the *method* — running it Phase 0 → test IS the work. The e-ink tablet is the real subject, not a system test case. PMF's unbuilt infrastructure (map/persistence layer, agent specs) only matters for *scaling* the method; it does not gate one manual run and is deprioritized behind this deliverable.

Note: workflow.md marks Phases 5–8 "deferred" — that deferral is about building the *system*. For this job, 5–6 are the endpoint, not deferred: build the creatives, run the test. The half-built system just means those phases are done more by hand.

**The arc:** Phase 0 (e-ink market map — done, `runs/eink-tablets/`) → Phase 1 pick the market → Phase 2 deep competition → Phase 3 VOC + UM research → Phase 4 = the PMF theory crystallized as a 7–12-creative test → Phase 5–6 run it.

**Next session — one job: market selection (step 1 of the PMF theory).** Run Kam's 3 candidate markets through the `workflow.md` **Phase 1 filter questions** + a rough **Gate 1**, score them, pick the bet. Do NOT deep-dive all 3; do NOT start Phase 2 depth — selection only. The session after picks up Phase 2 on the winner.

This is Pipeline B (product = e-ink tablet, held constant; choosing the market). The 3 markets:

- **M1** — niche: wellness Gen Z women · transformation: better mental health + presence + analog life-organization (paper-notebook replacement, not a work tool — "a corded phone over an iPhone"). Large, highly problem-aware audience. Kam's #1.
- **M2** — niche: students who get severely distracted · transformation: a class-optimized workspace that isn't a distraction machine. Most acute (pain-grade) severity. Buyer ≠ user (student vs parent). Kam's #2.
- **M3** — niche: ambitious goal-chasers (male-skewed) · transformation: remove obstacles to chasing tangible goals / getting rich. Kam's #3. Flagged: likely an angle on M1's transformation, not a distinct market — believability strained ("e-ink tablet → rich" over-claims), and it is Daylight's occupied turf.

Method: `workflow.md` Phase 1 filter questions (strong desire / proven spend · core driver proximity × severity × frequency · evergreen · why now · emerging · underserved + hungry · solvable/believable UM · describable buyer) + the Gate 1 formula. Output: a scored 3-way comparison → pick. `runs/eink-tablets/market-map.md` already has competitor context relevant to all three (esp. Daylight).

## What NOT to do

- Don't redesign the phase structure. It's locked.
- Don't introduce new vocabulary. Use `definitions.md`. If a new term seems needed, propose it explicitly and wait for confirmation.
- Don't pre-cluster agents globally. Cluster per agent during spec writing.
- Don't operationalize gap analysis or Gate 2 thresholds. They calibrate from manual runs.
- Don't write agent specs before the map layer is designed.
- Don't make the cleaner heavy. Dumb version first. Scale when downstream complains.
- Don't change `definitions.md` without explicit ask.

## Working notes

- Direct. Push back when something's wrong. Don't sycophant.
- Dense over verbose. Framework-mapped responses preferred over abstract ones.
- Distinguish synthesis from direct quotation — Kam will catch editorializing.
- Acknowledge what's locked vs open before reasoning. Don't re-open settled questions.
- "I'm not sure" is better than confident bluffing.
- If a session bloats and reasoning degrades, name it and recommend ending.

## Session scope discipline

This is a long-running multi-session build. Each session has one job. If you find yourself wanting to "also just build" or "quickly design" something outside the current session's scope, **stop and write it down for a future session instead.** Drift across sessions is the primary failure mode. If unsure whether something is in scope, it isn't. Park it.
