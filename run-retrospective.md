# Run Retrospective — Inkleaf e-ink arc (2026-04-26 → 05-29)

> **Status: learnings reservoir, not canon.** This is the pile of run-learnings not yet folded into the canon docs. When you build a given part, drain the relevant section here into its prompt / `workflow.md` / `agents/implementation-notes.md` — §8 maps what folds where. `workflow.md` and `capability_inventory.md` point here.

What the manual runs taught us that is **not yet in `workflow.md`**. Source: 14 mined
session transcripts + 6 run-output clusters, deduped to net-new signal against the
current doc set (workflow / definitions / capability_inventory / implementation-notes /
the three handoffs).

**The core gap.** `workflow.md` is a *what-to-research* document — steps, research
questions, gates. The runs generated an entire *how-to-run-it* layer that lives only in
the handoffs, the `scripts/` briefs, and the session transcripts: an orchestration
pattern, durable tooling, deliverable templates, operational hazards, and real strategy
findings. Most of it has never been folded back into `workflow.md` or promoted to agent
specs. That layer is below, tagged by where it should land.

Tags: **[NEW]** surfaced in sessions, nowhere in the docs · **[HANDOFF-ONLY]** captured in a
handoff but missing from `workflow.md` · **[STRATEGY]** substantive Inkleaf finding.

---

## 1. Orchestration layer (belongs in `workflow.md`, or a new `orchestration.md`)

The runs converged on one repeatable shape. None of it is in `workflow.md`; most is
scattered across the three handoffs.

- **Manual-run-at-reduced-scale-first as a methodology debugger.** [NEW] The first real run
  (05-20) existed to break the *methodology*, not to produce a deliverable — it surfaced
  the layer-conflation and per-cell-saturation bugs that became `implementation-notes.md`.
  Step 0 should say this explicitly: the first run on a space is a debug pass.
- **The 3-agent scan pattern.** [HANDOFF-ONLY] finder → **roster checkpoint** → parallel
  analyzers (one per competitor, background) → aggregator → **profile checkpoint**. One job
  per subagent; only `.md` artifacts persist; subagent invocations are ephemeral.
- **Shared framework file read by every analyzer.** [HANDOFF-ONLY] `analyzer-framework.md` is
  the spine — corrections propagate by editing one file, not N prompts.
- **Reuse incumbents + write a per-market delta.** [HANDOFF-ONLY] The e-ink stratum
  (reMarkable, Boox, Kindle Scribe, Daylight) was analyzed once, then reused across markets
  with a market-specific delta instead of re-analysis.
- **2-pass corpus-then-synthesize.** [HANDOFF-ONLY] Rip verbatim corpora first (tiers,
  comments, chronology, copy), synthesize the playbook/teardown second. Used in both the
  crowdfunding and granular runs.
- **Per-brand isolation enforced, not requested.** [NEW] Hard-rule + self-audit checklist +
  forbidden-reading lists (a per-brand analyzer may not read sibling brands or the
  birdseye map). Catches "Unlike reMarkable…" cross-brand drift.
- **Crash discipline.** [HANDOFF-ONLY] Agents die around 60–65 tool uses (Boox, reMarkable);
  run in waves of 5 and write incrementally after each section.
- **Orchestrator runs sandbox-blocked scripts itself.** [NEW] When a subagent is blocked on
  `node …`, the orchestrator runs the fetch, saves raw artifacts, and re-launches the agent
  pointed at them. This happened every run and should be a documented fallback.

---

## 2. Durable tooling built (just-in-time, per the 05-21 course correction)

- **`crowdfund-fetch.js`** (Playwright) — bypasses Kickstarter/Indiegogo/Crowd Supply
  Cloudflare 403s and JS-rendered SPAs; clicks "load more" on comments ×5. Reusable for any
  SPA/Cloudflare scrape, not just crowdfunding.
- **`adlib-one.js`** — Meta Ad Library fetcher, enriches ad **start-date / `days_running`**.
- **The ~11 orchestration briefs + `analyzer-framework.md`** — de-facto beta agent specs
  ("beta prompts for this run," explicitly *not* locked).
- **The agent-brief template** [NEW] — every brief = *role + inputs (which files to read) +
  hard rules + output schema + self-audit checklist + exact output path*. This skeleton is
  itself the most reusable artifact; it should be the named template when agent specs get
  written.

---

## 3. Deliverable templates (durable output schemas — not in `workflow.md`)

These are concrete, reusable output specs the runs settled on. `workflow.md` names steps
but not their deliverables.

- **`market-profile.md`** — 5 sections: market cells (niche × transformation) · per-cell
  claim-saturation · differentiation whitespace · **price-band reality vs $900** · **Gate-1
  evidence dossier** (Desire / Feasibility / Sophistication / Growth, evidence per axis).
- **`market-opportunity.md`** — cross-market Gate-1 comparison; the **bet-selection**
  artifact bridging Step 0 → Step 1.
- **13-section granular persuasion analysis** (per brand) — every headline, hook, angle,
  testimonial, trust signal, claim, objection-handle, transformation framing, funnel
  section, **deposit-funnel evidence**, and **longest-running ad**. Verbatim.
- **Per-market playbook** — Top 15 hooks + Top 20 headlines (verbatim, ranked by spend
  signal), claim-saturation tables, angle inventory, objection-handle library, and a
  **flagged SYNTHESIS block** separating AI invention from observed copy.
- **Crowdfunding teardown A/B/C/D** — campaign table / chronology / objection list / playbook.
- **`birdseye-map.md`** (brands × transformation cells) and **`transformations-flat-map.md`**
  (the cell inventory).
- **`evolution-profile.md`** + **`transformations-flat-map.md`** — category-over-time
  synthesis + foldable×transformation whitespace cross-tab (see §5 wedge analysis).
- **Winning-message analysis** (per brand, separate from granular) — 7-section
  portability-oriented extraction: revealed avatar, claim specificity grades,
  mechanism→angle chain, and a **belief-installation sequence** (ordered, verbatim, each
  belief flagged 100%-portable / harder / funnel-coupled). Built to lift a competitor's
  persuasion into a *different* funnel.
- **`crowdfunding-corpus/<slug>/` 9-file schema** (campaign-body, tiers, updates, comments,
  pre-launch, chronology, press, outcome, notes) + **teardown A/B/C/D** with the
  **"led-with" classification** (form-factor / transformation:<name> / spec-utility /
  identity) as the winner-vs-failure comparison field.
- **3-stage deposit-funnel skeleton** (`lp-teardown.md`): cold LP (13 sections) → reservation
  page (6) → thank-you/VIP (4), each section tagged with its persuasion Job + belief + device.
  Plus social-proof stacking order (press early / founder mid / testimonials late) and the
  desire-to-deposit bridge formula (spot-holding verb + no-friction promise + specific gain).
- Per-brand analysis sub-tables worth standardizing: **coined-spec-language inventory**
  (brand-invented terms like "Live Paper") and **spec-foregrounding order** (which spec leads
  vs is hidden) — both are competitive-positioning signals not in the current extractor schema.

---

## 4. Net-new methodology — real-world "how to do the step"

Things the runs proved that `workflow.md` doesn't say:

- **Winner detection = `days_running` / longest-running ad.** [NEW] Ad longevity is the
  spend-validated-winner proxy. This is the missing concrete heuristic behind Step 2/5
  "what are the winning variables." Add it explicitly.
- **SYNTHESIS-block flagging.** [NEW] Any AI-invented message is fenced and labeled, kept
  separate from verbatim competitor copy. Data-integrity rule for every deliverable.
- **Gate-1 evidence dossier** operationalizes the gap formula — per-axis evidence, not a bare
  score. Reference it in Step 0.
- **Price-band-reality is mandatory.** [NEW] Every profile compares the $900 target against
  every competitor's actual price; price is the recurring Gate-1 risk (see §6).
- **Category-evolution / "wedge" analysis** [NEW] — a *distinct* analysis from the
  cross-sectional scan: track each claim's lifecycle (Product UM → saturated angle →
  commodity) to see which lanes are opening vs closing. Belongs as a Step-0 companion.
- **Loose-niche scanning.** [NEW] A market can be entered with a *behavior-defined* niche;
  sub-niches are an **output** of the scan, not a required input (proven on Dumb-Device).
- **Transformation scoping must actively exclude adjacent framings** (Dumb-Device was scoped
  *away* from productivity to stay distinct).
- **Deposit-funnel evidence as a first-class section** — directly serves Kam's $900 deposit
  funnel.
- **Survivorship-bias hunt** — deliberately find ≥2 failed campaigns and scrutinize capped
  "successes"; funded teardowns all look like playbooks.
- **Two-pass Ad Library protocol + keyword-collision discipline.** [NEW] Keyword search
  produces massive noise for common-word brands (reMarkable keyword search → ~49k junk
  results; Daylight → 62 of 64 entries were collision spam). Fix: keyword pass first, then
  re-run resolved to the brand's actual Facebook Page ID; cap at 2 resolution attempts, else
  mark "unresolved" (absence of ads is itself data); verify brand ownership per-ad via
  destination URL. This corrected real errors (Boox 0 → ~230 ads).
- **Extraordinary identifier is a distinct tier above Feature-UM.** [NEW] A claim no
  competitor can echo (Guinness record, E-Ink-Corp co-dev, TIME/Wirecutter award, named
  clinical pilot) — structurally unrepeatable, not just temporally novel. Track separately.
- **Category-evolution heuristics** [NEW]: Shenzhen OEM commoditizes a spec wedge in
  ~12 months (4 data points) → spec-first leads decay fast; the **raise-collapse test**
  (same claim's crowdfunding raise across years: color e-ink $624k '22 → $57k '25) detects
  wedge closure without ad data; **Bluegen $119k** is the benchmark ceiling for
  form-factor novelty *without* niche×transformation; "dead-branch" tagging for mechanisms
  that didn't propagate.
- Already in handoffs but worth promoting to `workflow.md`: substitutes in the competitive
  set · buyer-characterization field · Ad-Library Page-ID sanity check · per-cell saturation
  · niche read-from-copy · claims-vs-features split · problem-mechanism-vs-UM.

---

## 5. Net-new strategy findings (Inkleaf) [STRATEGY]

- **The central open lane: "programmable + focused."** reMarkable owns *focus/calm*; Boox
  owns *do-everything versatility*; **nobody combines them.** Across Faith/Students/
  Dumb-Device, no e-ink incumbent owns "focus + programmable." This is the position.
- **Wedge timing favors Kam.** "Paper-like" decayed from a real Product UM into a saturated
  minimalism angle. AI-note capture is the *current* wedge (Viwoods $275k, iFLYTEK); color
  is emerging; **form-factor (foldable/book-fold) is the newest, least-saturated wedge — and
  that's exactly where the Inkleaf sits.** First-mover positioning is available.
- **Differentiation will be a Product UM play** (the 95% rule), not competing on the
  saturated paper-like / eye-comfort claims.
- **$900 is above the entire premium e-ink band ($400–730)** and app substitutes run
  $0–10/mo — price is the recurring Gate-1 risk and needs strong UM justification.
- **Market read:** Faith = clearest underserved emotional angle, smallest proven spend ·
  Students = most proven spend, most saturated + substitute-heavy · Dumb-Device = strongest
  cultural tailwind (digital minimalism), weakest price justification.
- **Crowdfunding (the ~$100k campaign):** pre-launch email list + landing page is the **#1
  predictor of day-1 raise velocity** · **foldable hinge-durability** is a recurring comment
  objection → FAQ/creative input · raise ≠ good positioning (Bluegen capped at $119k
  "pitching nothing") · **Diptyx (open-source, book-fold)** is the closest analog campaign.
- **Daylight DC-1** is the closest wellness-positioning analog ($729, amber/blue-light-free,
  founder-story + press authority); its longest-running ads emphasize warm screen + outdoor
  readability.

---

## 6. Kam's data/run-structure preferences (observed, durable)

- `runs/<space>/markets/<slug>/` → finder/analyzer/aggregator briefs · `brands/<brand>.md`
  records · `competitive-set.md` · `<slug>-market-profile.md`.
- `runs/<space>/marketing-corpus/<brand>/` → **5 source files** (`landing-pages`,
  `meta-ads`, `funnel-mechanics`, `partnerships`, `notes`) + **generated outputs**
  (`granular-analysis`, `winning-message-analysis`) in the same dir. **Source files vs
  generated outputs is a real distinction in the layout.**
- `runs/<space>/crowdfunding-corpus/<slug>/` → `campaign-body`, `tiers`, `chronology`,
  `comments`, `pre-launch`, `press`, `outcome`, `updates`, `notes` + `raw/`.
- Cross-brand synthesis is **separate** from per-brand work (`birdseye-map.md`,
  `markets/<slug>/playbook.md`).
- `scripts/` holds briefs + fetchers. Only `.md` persists. **Exact figures or "not found"** —
  no hand-waving. **Kam writes a schema + build-spec hand-off doc before population** — he
  specifies the output shape, the agent fills it.
- Doc separation of concerns: `workflow.md` (steps + research questions) · `definitions.md`
  (locked vocab) · `capability_inventory.md` (capabilities + locked decisions) · `handoff.md`
  (state, "what's locked vs open," kickoff prompts at the **bottom**).
- DR-marketing knowledge pulled **on demand** from `~/knowledge/dr-marketing/`, not loaded
  wholesale; a topic index/manifest would help routing.

---

## 7. Process / project learnings (cross-cutting)

- **GSD ceremony was abandoned** for this project — too heavy for learn-by-building. Decided:
  **Claude Code IS the orchestrator**; stage prompts become `.claude/commands/*.md` slash
  commands; data sources become MCP servers (future). [NEW, architecture intent]
- **Planning doc = source of truth; AI-written handoffs are *not* locked decisions.** Always
  distinguish Kam's output from AI synthesis.
- **Naming:** research = *Steps* (steps 0–8, defined in `workflow.md`); GSD build units = *Stages*. (An earlier draft had these reversed — corrected 2026-06-02.)
- **Milestone split:** M1 = research system (Stages 0–3), M2 = test pipeline (Stages 4–8).
  Don't spec M2 until M1 is shaken out on 2–3 real spaces.
- **Defer output/substrate decisions** until 2–3 prompts exist — "I don't know what the
  outputs are if I don't know what the inputs are."
- **Course correction (05-21):** persistence/map layer deprioritized; build tooling
  just-in-time when manual friction justifies it; ship first.
- **Session transcripts are a minable knowledge source** — this retrospective is the proof;
  worth doing at the end of each milestone.
- Read-on-demand beats always-on hooks for static reference docs (the 32KB definitions hook
  was rejected on token cost).

---

## 8. What to fold where (recommendation)

- **→ `workflow.md`:** the orchestration pattern (§1) referenced per step; winner-detection
  via `days_running` (Step 2/5); category-evolution/wedge analysis as a Step-0 companion;
  loose-niche scanning (Step 0/1); Gate-1 evidence dossier + price-band-reality (Step 0);
  deposit-funnel evidence (Step 2/3b); survivorship-bias hunt + crowdfunding as a real
  execution lane (Step 5–8). *Step structure stays locked — these are additions, not
  restructures.*
- **→ `agents/implementation-notes.md` (or new agent specs):** the agent-brief template,
  self-audit checklists, forbidden-reading lists, shared-framework propagation,
  incremental-write rule, orchestrator-runs-blocked-scripts fallback.
- **→ `capability_inventory.md`:** the two fetchers as just-in-time-built capabilities; the
  deliverable templates (§3) as named outputs.
- **New doc worth creating:** `deliverable-templates.md` cataloging the output schemas in §3,
  so future runs start from a template instead of reinventing the structure.

### Open gaps the runs surfaced but didn't resolve (carry forward)

From `data_inventory.md` + the scans — these are real holes in `workflow.md`/`capability_inventory.md`:

- **VOC isn't run in Step 0, but Gate 1 needs it.** Gate-1 "Desire to Solve" (core-driver
  proximity, severity, frequency) requires VOC + classifier output that Step 0 doesn't
  produce. Decide: lightweight P0 VOC, proxy signals at P0, or rough Gate-1 recalibrated at P3d.
- **Authority-proof scanner** (Gate-1 D2C-feasibility "believability") has **no mapped capability.**
- **Awareness-level inference** for Step 4 has no dedicated Op (classifier emits proxies; nothing synthesizes a target).
- **Hypothesis-selection has no record schema** — it's a first-class data-layer decision, not a mental note. The actual procedure used was: 3 candidate markets → cheap parallel Step-0-style scans → Gate-1 cross-comparison → pick. That apparatus isn't in `workflow.md`.
- **Augment-not-overwrite write rule** (`depth_pass: shallow|deep` + `extracted_at`; P3d loop produces new gap records, never overwrites) is an architectural constraint stated nowhere in the locked docs.
- **Actor/source tags** on research questions (human / AI / VOC / glimpse-trends) from Kam's original planning doc were dropped inconsistently in the `workflow.md` merge — restore them; they specify *who* does each step and *from what source*.
- The `workflow.md:344` system note still says the map/persistence layer "has to be designed before capability specs" — **contradicts the 05-21 course correction**; soften to "deprioritized; build just-in-time."
