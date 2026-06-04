# Doc Index — Phases + Launch + E-ink Reference Check

Generated: 2026-06-04. Scope: `.planning/phases/**/*.md`, `launch/**/*.md`, active-file e-ink grep.

**Classification key:** GSD-ARTIFACT · EINK · FLAG (individually notable)

---

## JOB 1 — Phase Directory Index

Six active phase dirs. 4 phases complete, 2 in-progress/deferred.

| Phase dir | Stage | Status | Artifact set | Flag |
|-----------|-------|--------|--------------|------|
| `01-stage-m1-s1-light-pass` | M1-S1 — Light pass (Arduview reference run) | COMPLETE | PLAN×5, SUMMARY×5 (incl. 3 `.pre-revision.md` variants), CONTEXT, DISCUSSION-LOG, PATTERNS, DEBUG-RUN-NOTES | FLAG: `01-DEBUG-RUN-NOTES.md` — dense unstructured run log covering every pipeline stage pass/fail/fix. Not yet distilled into patterns. Signal is current (Arduview, not InkLeaf). PROMOTE or distill into PATTERNS before archiving. Also: `.pre-revision.md` variants are vestigial — SLOP, can delete. |
| `02-stage-m1-s2-market-selection-gate` | M1-S2 — Market selection gate | COMPLETE | PLAN×2, SUMMARY×2, CONTEXT, DISCUSSION-LOG, PATTERNS | Standard GSD-ARTIFACT set. Clean. |
| `03-stage-m1-s3-deep-competitive-analysis-messaging-strategy` | M1-S3 — Deep competitive analysis + messaging strategy | DEFERRED (template built, run pending market pick) | PLAN×4, SUMMARY×4, CONTEXT, DISCUSSION-LOG, PATTERNS, DEBUG-RUN-NOTES, HUMAN-UAT, REVIEW, REVIEW-FIX, VERIFICATION | FLAG: `03-DEBUG-RUN-NOTES.md` — intentionally deferred stub ("DEFERRED — TO BE FILLED on first real run"). Not slop; it's a held scaffold. `03-HUMAN-UAT.md` status=partial; `03-REVIEW-FIX.md` iteration=1/partial — both are in-progress GSD artifacts, not abandonware. |
| `15-stage-m1-s15-funnel-architect-copywriter` | M1-S15 — Funnel Architect + Copywriter skill build | COMPLETE | PLAN×5, SUMMARY×3, CONTEXT, RESEARCH, PATTERNS + non-standard: SPEC-funnel-architect, SPEC-copywriter, CLAIM-TALLY-IMPL-SPEC, COPYWRITE-WIRING-REFERENCE | FLAG (KEEP): `15-SPEC-funnel-architect.md` — operator-supplied verbatim behavior-authority spec for the Funnel Architect skill. MUST NOT delete. `15-SPEC-copywriter.md` — same, copywriter authority. `15-CLAIM-TALLY-IMPL-SPEC.md` — implementation-ready spec for `tools/funnel-claim-tally.js` (not yet built). `15-COPYWRITE-WIRING-REFERENCE.md` — documents RAG-injection orchestration contract (interim; may be superseded once built). All four are design docs, not GSD process cruft. |
| `16-asset-classifier-image-and-video-bricks` | M1-S16 — Asset classifier (image + video bricks) | COMPLETE | PLAN×6, SUMMARY×6, PATTERNS, RESEARCH + non-standard: FORMALIZE-HANDOFF | FLAG: `FORMALIZE-HANDOFF.md` — operational runbook for closing the phase (serialized git commits across concurrent sessions). Operational value expired once phase is committed; SLOP after close. |
| `17-lp-builder-implement-arduview-landing-and-deposit-pages-from` | M1-S17 — LP Builder (Arduview landing + deposit pages) | IN PROGRESS | PLAN×3, CONTEXT, PATTERNS, RESEARCH, UI-SPEC | Standard GSD-ARTIFACT set. Active, do not touch. |

**Phase count: 6 dirs, ~75 MD files total.**

---

## JOB 1b — Launch Directory Classification

All `launch/` content is InkLeaf/e-ink era. No Arduview-era files.

| Dir | Files | Classification | Notes |
|-----|-------|----------------|-------|
| `launch/inkleaf-landing/` | ~16 files (HTML + system docs) | EINK | InkLeaf Shopify LP HTML + assets + build/deploy system docs. Not referenced by Phase 17 (which builds from `runs/arduview/site/`). `system/_audit-*.md` (6 files) confirmed superseded drafts. |
| `launch/inkleaf-launch/` | ~9 tracked + untracked `_deep-pass/` | EINK | InkLeaf launch runbook, Klaviyo docs, asset manifests. `launch/README.md` calls it "raw import not yet reconciled." The runbook is ~90% product-agnostic in structure, but InkLeaf-branded throughout. |
| `launch/README.md` | 1 file | EINK (framing doc) | Describes both dirs as raw InkLeaf import, flags the known mess (4× duplicate deploy docs, 2 input files). Useful only if the reusable-module reconciliation ever happens. |

**All `launch/` = EINK. No durable/reused content found that isn't already captured elsewhere.**

---

## JOB 2 — E-ink Reference Check

### Active files that reference e-ink artifacts

| Active file | Reference | Hard dep or mention |
|-------------|-----------|---------------------|
| `.planning/ROADMAP.md` | InkLeaf RETIRED banner; points at `_quarantine/` + `run-retrospective.md` + `agents/implementation-notes.md` | MENTION only — the banner is a tombstone, not a dependency |
| `.planning/STATE.md` | InkLeaf RETIRED note; `runs/eink-tablets/` quarantined; `map/data_inventory.md` superseded note | MENTION only |
| `.planning/BUILD-STATE.md` | Extensive rows pointing at `runs/eink-tablets/` artifacts as worked-instance references (brands, scripts, adlibrary, corpus, crowdfunding teardown) | MENTION only — all rows are descriptive inventory, not runtime deps. None of the active scripts or agents load from `_quarantine/` paths. |
| `.planning/PROJECT.md` | InkLeaf RETIRED note, `_quarantine/runs/eink-tablets/` path | MENTION only |
| `.planning/POST-RUN-HARDENING-PLAN.md` | `launch/inkleaf-*` → `_archive/eink-launch/` move task | MENTION (task referencing the launch dirs) |
| `.planning/audit/05-eink-vs-arduview.md` | Full analysis of the split; deletion recommendations | MENTION — this IS the reference-check doc, not a dep |
| `.planning/audit/06-cleanup-manifest.md` | `launch/inkleaf-*` archive tasks + `map/data_inventory.md` investigate task | MENTION — cleanup action list |
| `.planning/audit/03-retro-triage.md` | One mention of "inkleaf LP" as a non-competitive source used by Funnel Architect | MENTION only |
| `prompts/_specs/image-classifier-brick.md` | "The format target is the worked `launch/inkleaf-launch/IMAGES.md`" | SOFT DEP — it cites InkLeaf's `IMAGES.md` as a format example, not a data source. The spec works without it; the format is self-described in the surrounding text. |

### Verdict

**SAFE TO NUKE (no hard deps):**
- `_quarantine/runs/eink-tablets/` — already quarantined, zero runtime references from any active script or agent
- `_quarantine/archive/` — deprecated e-ink session handoffs, no active consumer
- `launch/inkleaf-landing/` — InkLeaf brand HTML; Phase 17 does not use it
- `launch/inkleaf-launch/` (tracked + `_deep-pass/` untracked) — InkLeaf launch runbook; Phase 17 does not use it
- `launch/README.md` — framing doc for the above; moot once dirs are gone

**INVESTIGATE BEFORE NUKING (not hard deps, but may contain unextracted signal):**
- `map/data_inventory.md` — 770-line pre-GSD schema doc. `audit/06` flags §Open Questions (VOC unit-of-record, `voc_record_id`) as candidate Step 3 build inputs not distilled elsewhere. Scan those sections before archiving; everything else is superseded.

**MUST KEEP (active tooling or live phase reference):**
- `prompts/_specs/image-classifier-brick.md` — active spec; the InkLeaf `IMAGES.md` mention is illustrative, not a load-bearing dep. Keep the spec, the dep is harmless.
- All of `.planning/audit/` — these are the reference-check and cleanup-planning docs themselves; deleting them removes the decision trail.
