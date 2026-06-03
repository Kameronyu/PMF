# Build Brief — Step 3 VOC Pipeline (for GSD)

This is the single context bundle for building PMF's **Step 3 (customer research / VOC)** pipeline.
GSD: read this top to bottom, then read the locked canon (§2). **Do not regenerate the canon** —
build *from* it. Everything in §4 is already decided in conversation with Kam (2026-06-01); don't
re-litigate it.

---

## 0. Naming guardrail (read first)

PMF already has **research Steps 0–8** (its workflow vocabulary — see `workflow.md`). To avoid
collision, **GSD's build units are called "stages."** When this doc says "Step 3" it means PMF's
*research* step (VOC). When it says "stage," it means a GSD build unit. Never renumber or reuse
PMF's Step numbers.

---

## 1. Scope (what GSD is building — and what it is NOT)

**Building:** the Step 3 VOC engine — **3a (frequency/structural map)** + **3b (verbatim copy
bank)**. Reddit-first. A **reusable, templated** spec (placeholders for niche / transformation /
venues; the e-ink market is just the first instantiation), in the format of
`prompts/step1-light-pass.md`.

Concretely the deliverables are:
- The **classifier codebook** (the keystone contract — see §5).
- Four agent prompts: **Query Planner, Bucketer, Ladderer, Language Analyzer**.
- The deterministic **scripts + hooks**: Reddit scraper, cleaner, intensity scorer, frequency +
  co-occurrence/clustering, verbatim-gate, copy-bank store.

**NOT building (out of scope, do not drift into):**
- **3c** (UM / mechanism / science research — different operation, different tools).
- **Step 4 copywriting.** Step 3 ends at a stored, queryable copy bank. Writing copy *from* it
  (the two-pass draft→RAG-language-transform method Kam described) is Step 4.
- The whole PMF research method (Steps 0–8). Just the VOC engine.
- Vectorization / RAG DB — **JIT only.** Build the structured attributed store now; add embeddings
  when Step 4 actually needs semantic retrieval. Don't build the vector DB up front.

---

## 2. Locked canon — READ, do not regenerate

1. `definitions.md` — locked vocabulary. PMBD × T1–T4 ladder, niche/transformation, sub-niche
   (5+ single-individual co-occurrence rule), awareness, four drivers, UM types. **The codebook is
   this, compiled into a machine contract.**
2. `workflow.md` — Step 3a/3b sections carry the **PMBD research-question battery** (Belief 6
   surfaces · Experiences · Motif · Pain ladder · Desire ladder · co-occurrence · differentiator
   hunt · three search lanes). **This battery IS the classifier's schema spine.**
3. `capability_inventory.md` — the VOC chain (~7 ops: scraper → cleaner → classifier → quote
   extractor + frequency synthesizer + clusterer → copy bank) and the locked decisions
   (one universal classifier/schema, source-metadata pass-through, 3a vs 3b branch at classifier).
4. `prompts/step1-light-pass.md` — **the FORMAT to match**: schema contract + deterministic
   scaffold + hooks that reject bad output + thin per-agent prompts. Mirror this structure.
5. Memory `reference_voc_prior_art.md` (in the project memory dir) — prior-art steal-list +
   reference repos. Summarized in §7.

---

## 3. Settled architecture — the 3-pass pipeline (one job per agent)

```
PASS 1 (broad, whole corpus)                              = Step 3a
  [script] Reddit scrape (official commercial API) → keeps author_id, permalink, ts, upvotes
  [script] clean (raw IMMUTABLE copy kept; normalize only a working copy)
  [AGENT Bucketer]  letter + raw theme + counter-signal flag + community-vocab flag
                    (cheap Haiku pre-filter → classify; returns row-id + tags, NEVER quote text)
  [script] intensity = VADER + engagement + length
  [script] unique-user frequency + user×theme co-occurrence matrix → candidate sub-niches

  → hot clusters (high freq × tight co-occurrence) auto-selected as deep-dive targets

PASS 2 (deep, hot clusters only)                          = Step 3b extraction
  [script] scrape deeper (full comment trees, adjacent venues) on the hot clusters
  [script] clean
  [AGENT Ladderer]  tier (T1–T4) + extract copy-ready verbatim spans
  [script] verbatim-gate (string-match each span to source; reject mismatch)
  [script] driver read at the CLUSTER level (one driver per sub-niche)

PASS 3 (bank)                                             = Step 3b output
  [AGENT Language Analyzer]  organize verbatim by theme / sub-niche / PMBD-tier into
                             copy-ready units; light-clean only, NEVER reword
  [script] store records (+ embed JIT later)
```

Agents = Query Planner, Bucketer, Ladderer, Language Analyzer (4). Everything else deterministic.
**One-job-per-agent is a hard rule** (Kam's): query-gen ≠ VOC-analysis ≠ frequency/validation.

---

## 4. Every strategy decision locked in this session (don't re-ask)

- **Mining engine:** scripted scrape → classify (NOT live agent browsing).
- **Discovery mode:** open-first. Pass-1 frequency+co-occurrence **auto-seeds** the pass-2
  deep-dives (replaces Kam's old manual seed-finding hour). Optional manual seed-injection slot
  stays available but is never required to run.
- **Codebook = `workflow.md` battery (schema spine) + 4 vindicta craft grafts:** (1) depth bar →
  **intensity score** (don't discard, rank); (2) **counter-signal** flag per record; (3) **trigger
  + valence** as record fields; (4) **community-vocab** capture (feeds 3b).
- **Shallow vs deep:** NOT a judgment. Capture everything. Intensity = **VADER + engagement +
  length**, deterministic, script layer. Rank not delete. "I get puffy" stays, scores low, never
  surfaces as copy. (Intensity *weighting* is Kam's strategy call; this is the default.)
- **Bucketer (pass 1):** letter + raw theme + counter-signal + vocab flag. Whole corpus. Cheap.
- **Ladderer (pass 2):** tier T1–T4 + copy-ready spans. **Hot clusters only.** (Tier lands in
  pass 2 because you can't know which clusters deserve tiering until pass-1 frequency tells you,
  and pass-2 has fuller per-user context to judge tier.)
- **Driver:** NOT per-quote. A **sub-niche-level** property, read once per cluster. Feeds the
  "one driver per piece" copy rule.
- **Language Analyzer (pass 3):** organize verbatim by theme/sub-niche/tier into copy-ready units;
  light clean only, no rewording.
- **Frequency = unique users** at rollup (one prolific poster ≠ a trend). Dedup synonym-codes
  (union-find) before counting.
- **Co-occurrence / sub-niche clustering:** binary **user×theme incidence matrix** → cluster
  *users* by theme-vectors (k-modes / Latent Class Analysis via StepMix/poLCA / Leiden / ENA
  `rENA`). **Capture ALL of a user's qualifying quotes — never "best-post" scoring** (it destroys
  the co-occurrence signal). This is the genuine white space (no prior art) — the differentiator.
- **Sub-niche validation:** 5+ independent single-individual co-occurrences (definitions.md rule).
- **Verbatim grounding = HARD GATE (hook-enforced):** the agent returns `(author_id, source,
  char-offsets)` and **never emits quote text**; the script slices from the raw immutable copy and
  string-verifies; reject on mismatch. No LLM ever generates a customer sentence.
- **Storage contract (per-quote record):** `raw_text, char_offsets, author_id, permalink, upvotes,
  pmbd_letter, tier, belief_surface, sub_niche_id, trigger, intensity`. Two materialized views off
  this one store: **frequency brief** (aggregate, per sub-niche, laddered, driver-keyed — what Kam
  strategizes from) + **copy bank** (records, retrievable by slot — what Step 4 RAGs from).
- **No-LLM-generated-copy rule:** the moat vs the digital-twin wave is real attributed verbatim
  with live permalinks. Never let any agent author a customer phrase into the bank.

---

## 5. The keystone — the classifier codebook

Build this **first**; passes 1–3, the co-occurrence matrix, and the Step-4 retrieval index all key
off it. It is simultaneously: the **classifier's instructions**, the **record schema**, and the
**copy-retrieval index**. It is `definitions.md` (PMBD × tiers, 6 belief surfaces, sub-niche rule)
+ `workflow.md`'s battery, compiled into a tagging contract, in the `step1-light-pass.md` format
(closed enums hook-rejected off-list; open fields captured verbatim; everything traces to real text).

Note the split: **Bucketer** assigns letter + raw theme (whole corpus, cheap). **Ladderer** assigns
tier (hot clusters, deep). Same codebook, two agents, two passes.

---

## 6. Division of labor (how to work with Kam)

Kam owns **strategy** — codebook content, the depth/intensity definition, the search lanes, how the
frequency brief is organized for his reading. Claude builds the **plumbing** — scrapers, hooks,
matrix math, storage, the JSON contracts. **Surface only genuine strategy forks** for his decision;
default and proceed on everything mechanical. Don't pull him into implementation artifacts. (See
memory `feedback_pmf_collaboration.md`.) Verification = run on a reference subreddit + **Kam reads
the copy bank** (UAT), not unit tests — prompt/research quality isn't test-passable.

---

## 7. Prior-art steal-list (from research, 2026-06-01)

- **Verbatim grounding as a hard gate** — DeTAILS (arXiv 2510.17575) + LLMCode both string-match
  every quote to source and delete non-matches. Already our hook discipline; validated.
- **LLM deductive coding vs a frozen codebook** (Xiao CHI'23, CollabCoder) — temp 0, structured
  output, gate with Cohen's κ. BERTopic is the WRONG classifier — use only to audit the codebook /
  catch "Other" residue.
- **Two-stage cheap-filter → expensive-classify** (Reddit_Scrapper, PainOnSocial) — ~10× cost cut.
- **Reference repos to read before building:** DeTAILS (thematic analysis on Reddit, best
  provenance), PerttuHamalainen/LLMCode (quote-verification guard),
  Mohamedsaleh14/Reddit_Scrapper (~185★, closest scrape→classify analog), PainOnSocial (commercial
  twin of the mining engine; study where it stops — no per-user clustering).
- **Co-occurrence clustering within individuals = no prior art.** This is the build's novel piece.

---

## 8. Operational gotchas

- **GummySearch is dead** (Reddit API licensing, Nov 2025). Reddit ingestion MUST run on Reddit's
  official commercial API or it inherits the same shutdown risk.
- **Normalization breaks char-offsets** — keep a raw immutable copy, index offsets into *that*,
  normalize only a working copy.
- **No clean niche venue (open design problem for the Query Planner):** for the e-ink markets the
  niche is behavior-defined (e.g. "dumb-device") with no anchor subreddit like r/vindicta. The
  three-lane search (population-wide / in-niche / adjacent-context) must handle "no single niche
  venue." Flag this in the Query Planner stage.

---

## 9. Reference materials (locations)

- **Vindicta prompts** (the prior-art VOC mega-prompts, Kam's earlier manual method) —
  `~/Documents/Vindicta/`: `vindicta_pmbd_brief.docx` (v1, open-only), `vindicta_pmbd_v3.docx`
  (seeded), `vindicta_pmbd_v4_hybrid.docx` (seeded+open hybrid — the mature one). Their **good
  parts** (frequency-table architecture: Theme | unique-user count | trigger | valence | example;
  and the output-check rules) survive as **scripts + hooks**, not as prompt prose. Their **bloat**
  = three jobs jammed in one prompt (query-gen + VOC-analysis + frequency/validation) → split to
  the micro agents above.
- **Vindicta run outputs** (what the method produced — broad pass + scoped deep-dives) —
  `~/Documents/Vindicta/Vindicta*.docx`. Evidence that the real method was broad-pass-then-scoped
  deep-dives, which IS the 3a→3b structure.
- **Format reference:** `prompts/step1-light-pass.md`.

---

## 10. Suggested stage breakdown (seed for the GSD roadmap — refine as needed)

1. **Codebook + record schema** — the keystone contract (§5). Everything depends on it.
2. **Query Planner** prompt — 3 lanes + the no-clean-venue handling (§8).
3. **Scrapers + cleaner + verbatim-gate hook** — Reddit official API; raw-immutable-copy discipline.
4. **Bucketer** agent (pass 1) + cheap-filter stage.
5. **Frequency + co-occurrence/clustering scripts** — unique-user counts; user×theme matrix; the
   novel per-individual clustering.
6. **Ladderer** agent (pass 2).
7. **Language Analyzer** (pass 3) + copy-bank store + frequency-brief materialized view.
8. **End-to-end UAT run** on a reference subreddit; Kam reads the copy bank.
