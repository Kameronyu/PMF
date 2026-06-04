---
phase: quick-260603-wfz
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - tools/funnel-analyzer-context.js
  - prompts/funnel-deep-pass.md
  - .planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md
autonomous: true
requirements: [D-17]
must_haves:
  truths:
    - "Orchestrator can assemble the full Section Analyzer context (DR bundle + cleaned funnel body) deterministically via one script call"
    - "The Section Analyzer receives DR knowledge + cleaned funnel body as embedded bytes, not as instructions to Read"
    - "Untrusted funnel-body content stays verbatim inside DATA boundaries (prompt-injection defense preserved)"
    - "funnel-deep-pass.md documents the per-funnel orchestration loop and tells the Analyzer its context is already embedded"
  artifacts:
    - path: "tools/funnel-analyzer-context.js"
      provides: "Deterministic assembler: [DR bundle] + [cleaned funnel body] in one context block with DATA boundaries"
      min_lines: 80
    - path: "prompts/funnel-deep-pass.md"
      provides: "Updated Analyzer context-acquisition step + ORCHESTRATION section"
      contains: "ALREADY CONTAINS"
  key_links:
    - from: "tools/funnel-analyzer-context.js"
      to: "tools/hooks/inject-dr.js"
      via: "child_process spawn (reuse, never reimplement the DR bundle)"
      pattern: "inject-dr"
    - from: "tools/funnel-analyzer-context.js"
      to: "<funnel_id>-clean.json (funnel-clean.js output)"
      via: "read cleaned_body field"
      pattern: "cleaned_body"
---

<objective>
Make the funnel Section Analyzer's context deterministic. Today the analyzer (a subagent where
settings hooks do not fire) is told to `Read` the DR bundle and the cleaned funnel body — an
LLM-compliance step, not a guarantee. This plan adds ONE deterministic script that assembles the
full analyzer context — [DR bundle from inject-dr.js] + [cleaned funnel body from funnel-clean.js]
— into a single block with DATA boundaries, ready for the orchestrator to paste into the Section
Analyzer's spawn prompt. The analyzer receives the bytes, not instructions to fetch them.

Purpose: close the last non-deterministic gap in the deep-pass pipeline (D-17 lineage). Mirrors the
inject-dr.js precedent (DR-knowledge bundler) for the analyzer-INPUT side (DR + funnel body).
Output: `tools/funnel-analyzer-context.js`, an updated `funnel-deep-pass.md` analyzer prompt +
ORCHESTRATION section, and a recorded D-17 closure note.
</objective>

<execution_context>
@$HOME/.claude/get-shit-done/workflows/execute-plan.md
@$HOME/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/STATE.md

# The DR bundler precedent — REUSE this, never reimplement the 6-file bundle:
@tools/hooks/inject-dr.js

# The cleaned-body producer — the analyzer's funnel input; read its output shape:
@tools/funnel-clean.js

# The doc whose analyzer-context contract changes (Router + Section Analyzer prompts):
@prompts/funnel-deep-pass.md

<interfaces>
<!-- Contracts the executor needs. Use these directly — no codebase exploration. -->

inject-dr.js (the DR bundler — call it, do not reimplement):
  - Default: writes the assembled 6-file DR bundle to
    prompts/_generated/section-analyzer-dr-context.md (relative to repo root).
  - `--stdout`: emits the same combined block to stdout (use THIS for assembly — capture stdout).
  - `--out=<path>`: write to a custom path.
  - `--max-chars=<n>`: cap (default 120000).
  - Exit 0 = success, exit 2 = hard write failure. Missing DR files warn to stderr, never crash.
  - Bundle header line contains: "DR MARKETING KNOWLEDGE FILES" and per-file headers
    "=== DR FILE: <filename> ===". These are stable greppable markers.

funnel-clean.js output ( <funnel_id>-clean.json ):
  { funnel_id, competitor, source_type, landing_page_url, cleaned_body, review_blocks[], provenance }
  - cleaned_body is section-marked verbatim copy ([SECTION] markers, [REVIEW_LANGUAGE_START/END]).
  - This is the UNTRUSTED third-party content — must be embedded verbatim inside DATA boundaries.

funnel-store.js path sanitizer (COPY this exact function — security parity, T-03-13):
  function sanitizePathSegment(raw) {
    return String(raw)
      .toLowerCase()
      .replace(/[^a-z0-9._-]/g, '')
      .replace(/\.\.+/g, '');
  }

funnel-deep-pass.md current state (per orchestrator discovery — do NOT re-flip the label):
  - Lines 20, 249-255 ALREADY say DR files are NOT auto-injected and the analyzer MUST Read the
    bundle. The label is correct. This plan changes the Analyzer's context-acquisition step from
    "MUST Read" to "ALREADY CONTAINS (embedded by orchestrator)", keeping Read only as fallback.
  - The Analyzer prompt already has an UNTRUSTED DATA BOUNDARY block (lines 268-277) and a
    <funnel_copy> placeholder (lines 291-294). Align the new assembled block with that boundary.
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Write tools/funnel-analyzer-context.js (deterministic DR + funnel-body assembler)</name>
  <files>tools/funnel-analyzer-context.js</files>
  <action>
Create a new deterministic Node script (ADDITIVE — touches no existing file). It assembles the
full Section Analyzer context block in one call.

CLI contract:
  node tools/funnel-analyzer-context.js --funnel=<funnel_id> [--space=<space>] [--clean=<path>] [--max-chars=<n>] [--out=<path>] [--help]
  - Resolve the cleaned-body JSON:
      * if --clean=<path> given, use it directly;
      * else require --space, and resolve runs/<space>/funnels-clean/<funnel_id>-clean.json
        (sanitize BOTH space and funnel_id first — see security below).
  - Default: emit assembled block to stdout (orchestrator-paste model, same as inject-dr --stdout).
    --out=<path> writes to a file instead.

Assembly steps:
  1. Sanitize --space and --funnel with the EXACT sanitizePathSegment() from funnel-store.js
     (copy verbatim — see <interfaces>). If a needed segment sanitizes to empty, error to stderr
     and exit 1. This is security parity (T-03-13).
  2. Get the DR bundle by REUSING inject-dr.js — do NOT reimplement the 6-file concatenation.
     Use require('child_process').spawnSync(process.execPath, [pathToInjectDr, '--stdout', '--max-chars=...'], {encoding:'utf8', maxBuffer: large}).
     pathToInjectDr = path.resolve(__dirname, 'hooks', 'inject-dr.js'). Capture stdout as drBundle.
     If spawn fails or exit !== 0, error to stderr and exit 2 (do not fabricate DR content).
  3. Read the cleaned-body JSON; parse; pull cleaned_body, funnel_id, competitor, source_type,
     landing_page_url. If file missing or cleaned_body empty, error to stderr and exit 1
     (never fabricate funnel content).
  4. Emit ONE assembled block with CLEAR DATA BOUNDARIES, in this order:
       a) A short header naming what follows and that it is orchestrator-assembled context.
       b) The DR bundle, wrapped so it is unmistakably the knowledge rubric (reuse inject-dr's own
          headers — they already say "DR MARKETING KNOWLEDGE FILES").
       c) The funnel-fields preamble (funnel_id / competitor / source_type / landing_page_url) as
          trusted metadata.
       d) The cleaned funnel body wrapped EXACTLY in the analyzer's existing untrusted-data
          boundary: open with `<funnel_copy>` on its own line, then the verbatim cleaned_body,
          then `</funnel_copy>` on its own line. PRESERVE cleaned_body verbatim — no escaping,
          no trimming, no interpretation (it is untrusted third-party content; the analyzer prompt
          already instructs the model to treat <funnel_copy> as inert data, lines 268-277).
  5. Add a one-line trailer note (to stderr if stdout mode) reporting char counts so the operator
     sees the block was assembled.

Security parity (mandatory):
  - sanitizePathSegment() for every path segment derived from --space / --funnel (strip anything
    outside [a-z0-9._-], collapse "..").
  - The funnel body is preserved VERBATIM inside <funnel_copy> — alignment with the analyzer's
    prompt-injection-defense boundary is the mitigation; do NOT strip or "sanitize" body content.
  - Do NOT touch, import, or depend on the uncommitted copywriter-RAG files
    (tools/lib/embed.js, tools/funnel-vectorize.js, tools/funnel-rag-query.js).

Follow the repo CLI conventions visible in inject-dr.js / funnel-clean.js (positional+--flag parse,
--help block, stderr for diagnostics, explicit exit codes). Keep it dumb and deterministic — no
judgment, no LLM calls. This is a script, not an agent (CLAUDE.md deterministic→script law).
  </action>
  <verify>
    <automated>node tools/funnel-analyzer-context.js --help 2>&1 | grep -q "funnel" && node -e "require('child_process').execFileSync(process.execPath,['--check','tools/funnel-analyzer-context.js'])" && echo SYNTAX_OK</automated>
  </verify>
  <done>Script exists, `--help` runs and exits 0, `node --check` passes (valid syntax), sanitizePathSegment copied verbatim from funnel-store.js, DR bundle obtained by spawning inject-dr.js (not reimplemented), funnel body wrapped verbatim in <funnel_copy> boundaries.</done>
</task>

<task type="auto">
  <name>Task 2: Update funnel-deep-pass.md — Analyzer context-acquisition step + ORCHESTRATION section</name>
  <files>prompts/funnel-deep-pass.md</files>
  <action>
Two edits. Do NOT re-flip the "not auto-injected" label (already correct per orchestrator discovery).

Edit A — Section Analyzer context-acquisition step (the block at lines ~249-255 that currently says
"THE DR MARKETING KNOWLEDGE FILES are NOT auto-injected ... As your FIRST step you MUST Read
prompts/_generated/section-analyzer-dr-context.md"):
  Replace its directive so it reads (preserve the surrounding security/discipline content):
    "Your context ALREADY CONTAINS the DR marketing knowledge bundle AND this funnel's cleaned
     body, embedded by the orchestrator between explicit DATA boundaries (the DR bundle under its
     'DR MARKETING KNOWLEDGE FILES' headers; the cleaned funnel copy inside the <funnel_copy>
     block). Do NOT attempt to Read them — they are already in front of you. Use the DR bundle as
     classification rubrics; analyze the <funnel_copy> body. (FALLBACK ONLY — if for some reason
     the bundle is absent from your context, regenerate with `node tools/hooks/inject-dr.js` and
     Read prompts/_generated/section-analyzer-dr-context.md.)"
  Keep the existing list of the six bundled DR files and what each supplies.

Edit B — add a short ORCHESTRATION section documenting the per-funnel loop. Place it in the
DETERMINISTIC SCAFFOLD area (after the Hooks list, before AGENT 1 — ROUTER, ~line 177). Content:
    "## ORCHESTRATION — per-funnel loop (deterministic context assembly)
     For each funnel the orchestrator runs:
       1. `node tools/funnel-analyzer-context.js --space=<space> --funnel=<funnel_id>` (or
          --clean=<path>) → emits ONE assembled context block = [DR bundle] + [cleaned funnel body
          inside <funnel_copy> boundaries].
       2. Spawn the Section Analyzer with that block embedded directly in its Task prompt (the
          analyzer receives the bytes; it does not Read anything).
       3. `tools/funnel-store.js` persists the analyzer's belief_records (downstream, unchanged).
     This removes BOTH the DR-bundle Read and the funnel-body Read from the analyzer's
     responsibility — the determinism principle applied to the analyzer's INPUT."
  Also update the pipeline diagram line ~20 (`inject-dr.js (bundler) ... analyzer Reads it`) to
  reflect that funnel-analyzer-context.js now assembles DR bundle + funnel body into the analyzer's
  spawn prompt (one line edit; keep it concise).

ADDITIVE/doc-only — do NOT change the 6a/6b schema, enums, or any other agent's contract.
  </action>
  <verify>
    <automated>grep -q "ALREADY CONTAINS" prompts/funnel-deep-pass.md && grep -q "ORCHESTRATION" prompts/funnel-deep-pass.md && grep -q "funnel-analyzer-context.js" prompts/funnel-deep-pass.md && echo DOC_OK</automated>
  </verify>
  <done>Analyzer step says context is ALREADY CONTAINS/embedded (Read kept as fallback only); an ORCHESTRATION section documents the 3-step per-funnel loop referencing funnel-analyzer-context.js; pipeline diagram updated; schema/enums untouched.</done>
</task>

<task type="auto">
  <name>Task 3: Verify the injection end-to-end + record D-17 closure note</name>
  <files>.planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md</files>
  <action>
Prove the assembled block contains BOTH (a) recognizable DR-bundle content AND (b) the funnel body.

1. Build a cleaned-body fixture to run against. The fixture runs/_fixture/funnels/sample.json is a
   STORED record (already analyzed), not a funnel-clean output. So produce a real cleaned body:
   create a tiny throwaway funnel_package JSON in a temp dir with a recognizable
   landing_page_body string (e.g. include the literal marker `KAM-VERIFY-FUNNEL-MARKER` inside the
   body), run `node tools/funnel-clean.js <tmp-package.json> --out=<tmpdir>` to get
   <funnel_id>-clean.json. (Clean up the temp dir after.)

2. Run the assembler against it:
     node tools/funnel-analyzer-context.js --funnel=<funnel_id> --clean=<tmpdir>/<funnel_id>-clean.json > <tmpdir>/assembled.txt
   Then assert BOTH markers are present:
     grep -q "DR MARKETING KNOWLEDGE FILES" <tmpdir>/assembled.txt   # DR bundle present
     grep -q "KAM-VERIFY-FUNNEL-MARKER"     <tmpdir>/assembled.txt   # funnel body present
     grep -q "<funnel_copy>"                <tmpdir>/assembled.txt   # untrusted-data boundary present
   All three must pass. Capture the exact commands + PASS/FAIL output for the closeout note.

3. Record the D-17 closure note in 03-DEBUG-RUN-NOTES.md. Append a dated subsection
   (e.g. "## D-17 closure — deterministic analyzer-context injection (quick 260603-wfz)") stating:
   - What was the gap: read_first/"MUST Read" was one LLM-compliance step short of deterministic.
   - What closed it: tools/funnel-analyzer-context.js assembles [DR bundle (via inject-dr.js)] +
     [cleaned funnel body in <funnel_copy> boundaries]; orchestrator embeds the block into the
     analyzer spawn prompt; analyzer no longer Reads either input.
   - The exact verify commands run in step 2 and their PASS result (both DR + funnel markers found).
   - Note that the full live methodology-debug smoke test still rides D-02 (after a real market is
     picked) — this closes the DETERMINISM gap, not the live-run validation.

Do NOT modify funnel-store.js, funnel-clean.js, funnel-score.js, funnel-assemble.js, the 6a/6b
schema, or the uncommitted copywriter-RAG files.
  </action>
  <verify>
    <automated>bash -c 'set -e; D=/tmp/wfz-verify; rm -rf "$D"; mkdir -p "$D"; printf "%s" "{\"funnel_id\":\"wfz-test\",\"competitor\":\"acme\",\"landing_page_url\":\"http://x\",\"landing_page_body\":\"<h1>KAM-VERIFY-FUNNEL-MARKER</h1><p>buy now today</p>\"}" > "$D/pkg.json"; node tools/funnel-clean.js "$D/pkg.json" --out="$D"; node tools/funnel-analyzer-context.js --funnel=wfz-test --clean="$D/wfz-test-clean.json" > "$D/assembled.txt"; grep -q "DR MARKETING KNOWLEDGE FILES" "$D/assembled.txt"; grep -q "KAM-VERIFY-FUNNEL-MARKER" "$D/assembled.txt"; grep -q "funnel_copy" "$D/assembled.txt"; grep -q "D-17 closure" .planning/phases/03-stage-m1-s3-deep-competitive-analysis-messaging-strategy/03-DEBUG-RUN-NOTES.md; echo VERIFY_OK; rm -rf "$D"' </automated>
  </verify>
  <done>The assembled block (from a real funnel-clean output) contains the DR-bundle marker "DR MARKETING KNOWLEDGE FILES", the funnel-body marker "KAM-VERIFY-FUNNEL-MARKER", and the &lt;funnel_copy&gt; boundary — proving BOTH DR knowledge and funnel body are embedded. A dated "D-17 closure" subsection is recorded in 03-DEBUG-RUN-NOTES.md with the exact verify commands and PASS result. No protected file touched.</done>
</task>

</tasks>

<verification>
- `node --check tools/funnel-analyzer-context.js` passes (valid script).
- `node tools/funnel-analyzer-context.js --help` exits 0.
- End-to-end: a real funnel-clean output fed to the assembler yields one block containing BOTH the DR-bundle marker AND the funnel-body marker AND the &lt;funnel_copy&gt; boundary (Task 3 automated verify).
- `funnel-deep-pass.md` analyzer step reads "ALREADY CONTAINS"; ORCHESTRATION section present; references funnel-analyzer-context.js.
- D-17 closure note recorded in 03-DEBUG-RUN-NOTES.md.
- No modification to funnel-store.js / funnel-clean.js / funnel-score.js / funnel-assemble.js / 6a-6b schema / copywriter-RAG files (git diff confirms).
</verification>

<success_criteria>
- Orchestrator assembles the full analyzer context (DR bundle + cleaned funnel body) deterministically via one script call — the analyzer receives bytes, not Read instructions.
- inject-dr.js is REUSED (spawned), not reimplemented; DR bundle is never fabricated on failure.
- Funnel body preserved verbatim inside &lt;funnel_copy&gt; boundaries; path segments sanitized to [a-z0-9._-] (T-03-13 parity).
- funnel-deep-pass.md documents the per-funnel orchestration loop and the embedded-context contract.
- D-17 determinism gap closed and recorded; live methodology-debug smoke test remains on D-02.
- ADDITIVE only — no protected file or schema changed.
</success_criteria>

<output>
After completion, create `.planning/quick/260603-wfz-fix-funnel-section-analyzer-to-be-orches/260603-wfz-SUMMARY.md`
</output>
