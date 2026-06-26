# Writing DR Copy Prose with an LLM — Craft + Elicitation Research

Research brief for designing a `copy-builder` skill (the prose-side sibling to `skill-builder`). Synthesized from five parallel research streams; claims flagged **[Empirical]** (study/RCT/benchmark), **[Craft-lore]** (master-practitioner doctrine, not controlled), or **[Mixed]**. This report exists to answer three questions: what craft to encode, what elicitation mechanisms actually move LLM prose, and which parts of "good copy" can be **gated like skill-builder** versus which must be handled by **specimen + rubric**.

---

## 1. The durable craft principles a copy-builder should encode

The DR canon converges on four through-lines. These are craft-lore — the best in the business, but transmitted through books and practice, not RCTs. Encode them as positive targets and specimens, not as laws.

**Momentum is the master metric (the greased slide).** Every line exists to get the next line read. Sugarman's Axiom 3: *"The sole purpose of the first sentence in an advertisement is to get you to read the second sentence."* Openers should be "short, sweet, and almost incomplete." A single dead line breaks the slide and the reader leaves. Bucket brigades ("Here's the deal," "But here's the problem:") are the connective tissue. **[Craft-lore]** (Sugarman; Wiebe/Copyhackers)

**You channel desire, you don't create it.** Schwartz (verbatim): *"Copy cannot create desire for a product. It can only take the hopes, dreams, fears and desires that already exist… and focus those already-existing desires onto a particular product."* Enter the conversation already in the reader's head (Collier). Practically: the copy must open on the prospect's existing pain/desire, calibrated to their **awareness stage** (unaware → most-aware) and the market's **sophistication stage** (claim → enlarged claim → mechanism → amplified mechanism → identification). Pitching product to an unaware reader, or making a louder superlative in a saturated market, is the canonical failure. **[Craft-lore]** (Schwartz, Collier)

**Specificity is the engine of belief.** Hopkins (verbatim): *"Platitudes and generalities roll off the human understanding like water from a duck."* A definite claim ("reduced 25 percent") is believed where a round one is discounted. Bencivenga: *"Specifics beat generals every time,"* and never make the claim bigger than the proof. There is an empirical floor under this: concrete, precise, fluent language raises **processing fluency**, which raises perceived credibility. **[Mixed — lore + BMC Research Notes 2017 on processing fluency]**

**Clarity and service over cleverness and ego.** Ogilvy: *"What you say… is more important than how you say it"*; avoid superlatives and platitudes. Wit that hides the angle is a leak. Write to one person, in their voice, not a committee's. **[Craft-lore]** (Ogilvy, Hopkins, Halbert, Carlton)

**The two hard data points** under all of the above: (1) lower reading level measurably lifts response — Boomerang's 40M-email analysis found 3rd-grade-level emails got ~36% more responses than college-level **[Empirical, vendor, correlational]**; (2) shorter sentences raise comprehension (≈8 words ≈ near-100%, ≈43 words <10%) **[Empirical-ish]**. This is the evidentiary basis for the grade 5–7 readability target you already use — treat the *target* as convention, the *direction* as supported.

---

## 2. Elicitation mechanisms that reliably move LLM prose

This is where the science is strongest, and it carries a clear hierarchy.

**Specimens beat adjectives — the single strongest lever.** Showing the model concrete target-voice examples outperforms describing the voice in adjectives ("punchy, vivid"). In-context learning works largely by conveying the *form/shape* of a good answer (Min et al., EMNLP 2022), which is exactly what voice transfer needs; a few real specimens can rival fine-tuning for style (STYLL, 2023); exemplar optimization beats instruction tuning alone (Wan et al., NeurIPS 2024). Anthropic's own guidance: 3–5 diverse examples are "one of the most reliable ways to steer… tone and structure." **Caveat:** exemplars plateau on fine-grained *individual* voice (EMNLP 2025) — they nail structured genres, struggle with subtle implicit voice. **Net: curate 3–5 specimens + a short instruction; which specimens you pick matters more than how many.** **[Empirical, strong]**

**Persona only sets register, never boosts quality.** "You are an expert copywriter" does not reliably improve output and often slightly hurts (Zheng et al., EMNLP 2024; Wharton 2025). Personas *do* reliably shift tone/register (arXiv 2507.22168). Use persona to set voice, not as a quality lever. **[Empirical, strong]**

**Self-revision helps only when structured and grounded.** Open-ended "make it better" loops inflate the model's *perceived* quality while amplifying self-bias (Xu et al., ACL 2024) and can degrade quality outright (Huang et al., ICLR 2024). What works: a **rubric** + an **explicit stop condition**, ideally a **separate judge** model (Refine-n-Judge, 2025; CRITIC, ICLR 2024). This is the direct empirical vindication of skill-builder's "don't self-grade, use a separate checker." **[Empirical, strong]**

**Sample, don't max-likelihood.** Greedy/beam decoding yields bland, degenerate prose (Holtzman et al., ICLR 2020). Use top-p ≈0.9–0.95 or min-p. Temperature is **not** the "creativity dial" it's sold as — only weakly tied to novelty, with an inverted-U past which quality collapses (Peeperkorn et al., 2024). **[Empirical, strong]**

**Actively fight homogenization.** RLHF measurably reduces output diversity (Kirk et al., ICLR 2024); AI assistance raises individual quality but compresses *collective* diversity (Doshi & Hauser, Science Advances 2024); chat formatting alone induces diversity collapse. The default model output regresses to a safe mean — generic "AI voice" is the prior, not an accident. Diversity-eliciting prompts (e.g., Verbalized Sampling, 2025) and concrete source material push against it. **[Empirical, strong]** **This is the most important finding for a copy skill: over-constraining a generative prompt pushes it further toward the bland mean, not away from it.**

**For persuasion specifically, the lever is audience-tailoring + evidence-dense specific claims, not eloquence or model size** (Salvi et al. RCT 2024; Hackenburg et al., Science 2025) — with a documented persuasion/accuracy tension to govern. Maps cleanly onto VoC + specificity. **[Empirical, strong]**

**Suppressing AI-tells:** positive style targets + a SHORT ban list (≤5) + an edit pass beats long "DO NOT" stacks. Negative constraints backfire via ironic rebound (the "pink elephant" effect; arXiv 2511.12381) — a banned word becomes a strong prior. The documented tells: em-dash overuse (weak signal alone), "it's not X, it's Y" antithesis, compulsive rule-of-three, hedging/signposting ("furthermore," "it's worth noting"), and excess-vocabulary (delve/underscore/pivotal — "delve" rose ~1,500% in PubMed post-ChatGPT, Science Advances 2025). **Register grounding** (VoC verbatim + RAG) keeps vocabulary in the buyer's language but does not eliminate drift — verification still needed. **[Empirical + craft, mixed]**

---

## 3. The mechanical-vs-subjective split (what to gate vs. what to specimen+rubric)

This is the load-bearing section for skill design. It tells you exactly where skill-builder's gating logic applies to prose and where it actively backfires.

**Tier 1 — NEAR-MECHANICAL → gate with a script (hard pass/fail):**
sentence-length stats (mean/max/% over-long), word/char budgets, reading-grade *band* via a ratio-based formula (Flesch-Kincaid — and only advisory below ~100 words, which is most hooks/headlines), banned-phrase/regex compliance, required-element presence (CTA/link), literal repeated-phrase detection. These are pure string ops, fully reproducible. **[Empirical]**

**Tier 1.5 — MECHANICAL BUT HEURISTIC → warn/soft-cap, never hard-fail:**
passive-voice count, adverb/filler density, "complex phrase" flags. Real false-positive/negative rates (Hemingway over-flags), so cap counts, don't gate on presence. **[Empirical]**

**Tier 2 — SUBJECTIVE → specimen + rubric, LLM-judge as a noisy proxy only:**
voice, freshness/anti-cliché, emotional resonance, "earns the next line," promise–payoff fit. These resist automatic scoring. If you use an LLM judge: use a rubric + chain-of-thought + form-filling (G-Eval style, ρ≈0.51 with humans — good for *triage*, not certification); prefer **pairwise against a known-good specimen** over absolute 1–10; randomize order (position bias), penalize verbosity explicitly (length bias), and **never let the writing model judge its own output** (self-preference bias). Expect ~58% agreement ceiling on creative dimensions. **[Empirical, strong]**

**Tier 3 — GROUND TRUTH → conversion / A/B (unavailable at draft time):**
opens and CTR diverge from and can invert conversion (and opens are MPP-corrupted); live tests are slow and usually under-powered. This is *why* Tiers 1–2 exist — they triage before you spend live traffic, but none of them substitute for the macro test. **[Empirical]**

**The one-line design rule:** gate the countable, soft-cap the heuristic, specimen+rubric the voice, and reserve A/B as the only true arbiter. A judged field is mechanizable; a *felt* one is not — and trying to mechanize the felt one pushes the model toward the generic mean (Section 2).

---

## 4. Direct implications for a `copy-builder` skill

1. **Lead the prompt with 3–5 curated winning-copy specimens**, drawn from the VOC/RAG corpus the brief already routes — not adjectives. This is the strongest lever and it dovetails with your existing register-grounding.
2. **Keep the brief→prose handoff as the contract** (you already do this well); add a specimen slot to it.
3. **Gate only Tier-1 properties in code** (readability band, length, banned phrases, CTA presence, register/Command+F). You already have most of this in the copy chief.
4. **Make the copy chief a separate judge with a rubric** (you already do) — but move its voice/pull tests to **pairwise-against-specimen**, and never let the writer self-grade.
5. **Resist the urge to over-mechanize the generative step.** The research says heavy positive+negative constraint on a *generative* prompt degrades prose toward the mean. Constrain the *contract* and the *checks*; keep the *writing* specimen-led and lightly steered.

---

## Sources

Craft: Sugarman *Adweek Copywriting Handbook*; Schwartz *Breakthrough Advertising*; Hopkins *Scientific Advertising*; Ogilvy *Confessions*; Bencivenga *Marketing Bullets*; Collier *Letter Book*; Halbert *Boron Letters*; Georgi RMBC (stefanpaulgeorgi.com); Provost via Clark *Writing Tools*; processing fluency — BMC Research Notes 2017 (doi.org/10.1186/s13104-017-2524-x); Boomerang email study; PLOS One 2023 "Omit needless words."

Elicitation: Min et al. EMNLP 2022 (arxiv 2210... 2022.emnlp-main.759); Wan et al. NeurIPS 2024 (arxiv 2406.15708); STYLL Patel et al. 2023 (arxiv 2212.08986); Reif et al. ACL 2022; "Catch Me If You Can? Not Yet" EMNLP 2025 (arxiv 2509.14543); Zheng et al. EMNLP 2024 (arxiv 2311.10054); Wharton "Playing Pretend" 2025; Self-Refine Madaan et al. NeurIPS 2023 (arxiv 2303.17651); Huang et al. ICLR 2024 (arxiv 2310.01798); Xu et al. ACL 2024 (arxiv 2402.11436); Refine-n-Judge 2025 (arxiv 2508.01543); CRITIC ICLR 2024 (arxiv 2305.11738); Holtzman et al. ICLR 2020 (arxiv 1904.09751); Peeperkorn et al. 2024 (arxiv 2405.00492); min-p Nguyen et al. ICLR 2025 (arxiv 2407.01082); Kirk et al. ICLR 2024 (arxiv 2310.06452); Doshi & Hauser Science Advances 2024; Verbalized Sampling 2025 (arxiv 2510.01171); Salvi et al. 2024 (arxiv 2403.14380); Hackenburg et al. Science 2025 (arxiv 2507.13919); persuasion meta-analysis Scientific Reports 2025.

AI-tells / register: Kobak et al. Science Advances 2025 (delve/excess vocab); Gorrie "Why ChatGPT writes like that" 2025; Pink Elephant / 16x Eval 2025; "White Bear" arxiv 2511.12381; Anthropic prompt-engineering docs; VoC (Wynter, Copyhackers); RAG survey arxiv 2506.00054.

Evaluation: Flesch-Kincaid (PACLIC 2024; Readable.com); SMOG <100-word floor (IHS, McLaughlin 1969); Hemingway reviews (Kindlepreneur, Originality.AI); position bias arxiv 2406.07791; length bias arxiv 2407.01085; self-preference arxiv 2410.21819; G-Eval EMNLP 2023 (arxiv 2303.16634); pairwise stability (Comet/Galileo); creative-writing agreement (ScienceDirect S2666675825004564); Tian et al. 2024 (arxiv 2411.02316); conversion vs proxy (MarTech); 115 A/B tests (Analytics-Toolkit).
