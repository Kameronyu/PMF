# 02 — XVERIFY-FIX: xhigh adversarial-verify remediation

An xhigh adversarial verify of Phase 2 (Run-Controller) surfaced 7 findings the GSD
passes missed: 4 fixed here, 3 explicitly DEFERRED to their owning phase/requirement.

Scope: `engine/bricks/run-controller.js` (code) + `engine/contracts/controller-smoke.sh`
(harness). No other brick was touched (receipt-write.js / space-version.js / route.js stay
as-is — CTRL-12 reuse discipline preserved).

---

## FIX 1 — wave-COUNT DoS / hang (medium)

**Defect.** `spawnWaves()` caps wave SIZE at `WAVE_CAP` (5) but nothing bounded the wave
COUNT. `agentCount()` only checked `Number.isInteger(m.agents) && m.agents >= 1`, so a
manifest with `agents: 1000000000` passed validation and the spawn loop ran ~200M
iterations doing real `fs.writeFileSync` → process HANG (would exit 124 under a timeout).

**Fix.** Added a documented upper bound `const MAX_AGENTS = 100;` (no real step needs >100
agents). `agentCount()` now refuses any `agents > MAX_AGENTS` by name, same idiom as the
existing positive-integer guard, exit 1:

```
REFUSE [<id>] manifest: agents=<n> exceeds MAX_AGENTS=<cap>
```

**Verify.**
- `agents=1000000000` → exits 1 in <1s with the named error (does NOT hang). Confirmed
  under `timeout 5`.
- `agents=5`  → one wave `[5]`.
- `agents=12` → three waves `[5,5,2]`.

---

## FIX 2 — named refusal for non-file input (medium, CTRL-03)

**Defect.** `preflight()` only checked `fs.existsSync`, so a DIRECTORY (or socket/fifo) at a
`reads[]` path passed preflight and then crashed LATE at `assembleContext`'s `readFileSync`
with a generic `FATAL EISDIR` (exit 1) instead of a named, early preflight REFUSE.

**Fix.** Preflight now also requires each existing `reads[]` path be a regular file
(`fs.statSync(p).isFile()`). A non-regular-file input is refused by name with the same
distinct preflight exit (3) as the missing-input path:

```
REFUSE [<id>] preflight: input is not a regular file: <path>
```

Empty-CONTENT is intentionally NOT checked here (see Deferral A).

**Verify.**
- A directory at `runs/<space>/bet-brief.md` (a `reads[]` path) → named REFUSE, exit 3, no
  emit written, no receipt minted.
- A normal file still passes preflight and the step completes (exit 0).

---

## FIX 3 — harness same-millisecond false-green (medium, CTRL-02 / CTRL-10)

**Defect.** `controller-smoke.sh` asserted step ordering by comparing the receipts' ISO
millisecond `ts` with a NON-STRICT `<=` (`emit<=gate` for CTRL-02, `gate<=emit` for
CTRL-10). Two steps that mint receipts in the SAME millisecond would satisfy BOTH the
forward and the reversed assert — a false green that hides a broken order.

**Fix.** Both asserts now derive order from the controller's `STORE [<id>]` emit SEQUENCE in
stdout — a monotonic per-step index, not wall-clock — and compare with STRICT `<`:
- CTRL-02 passes iff `iEmit < iGate` (both present).
- CTRL-10 (reversed pipeline) passes iff `iGate < iEmit` (both present).

The STORE-line index is strictly increasing per executed step and cannot collide, so a
same-instant `ts` can no longer false-green either direction. (Chosen over touching
receipt-write.js to add a seq field — the stdout STORE sequence is already a free monotonic
signal, keeping the fix inside the harness + CTRL-12 reuse discipline intact.)

**Verify.**
- `controller-smoke.sh` still exits 0 (CTRL-02 + CTRL-10 PASS).
- MUTATION: reversing the fixture `pipeline.yaml` so `run all` emits gate-before-emit flips
  CTRL-02 to `FAIL: STORE order does not follow the pipeline file (emit#1 gate#0)` and the
  suite exits 1 — proving the assert is not a tautology and would catch a real reorder/regression.

---

## FIX 4 — named refusal for non-object manifest (low, CTRL-11)

**Defect.** `loadManifest()` did not type-check the parsed JSON before the `for (k of
MANIFEST_KEYS) { if (!(k in m)) ... }` loop. A manifest of `null` or a bare string/number/
array is valid JSON but not a §5 object, so `null` produced a generic `FATAL Cannot use 'in'
operator ... in null` instead of a clean named REFUSE.

**Fix.** After `JSON.parse`, refuse any value that is `null`, not an object, or an array, by
name, exit 1:

```
REFUSE [<id>] manifest is not a JSON object: <file> (got null|string|array|...)
```

**Verify.**
- `null` manifest → named REFUSE, exit 1.
- bare-string manifest (`"hello"`) → named REFUSE, exit 1.

---

## DEFERRALS (NOT implemented here — recorded with owner)

### Deferral A — empty-CONTENT load-bearing input
A 0-byte (or whitespace-only) file at a `reads[]` path passes preflight (it exists and is a
regular file) and the step emits a stub off empty context. **DEFERRED → Phase 5 / VALID-02**
("refuses on a missing/empty load-bearing field"). Rationale: Phase 2 preflight owns
*existence + is-a-file*; the Phase 5 validator owns *non-empty / non-null content*. Splitting
the check keeps each phase in its lane — preflight is a path-shape gate, not a content gate.

### Deferral B — gate decision persisted as `null` in the receipt ledger
`storeAndReceipt()` passes `--gate={"step_gated":<bool>,"decision":null}` to receipt-write.js;
the real operator decision (`auto-approved-smoke` / a human sign-off verdict) is logged to
stdout but NOT written into the receipt's `gate.decision`. **DEFERRED → Phase 5 / VALID-05**
(operator-gate decision population). receipt-write.js already documents `gate` as a
Phase-5-populated field; wiring the live decision into the ledger is that requirement's job.

### Deferral C — no pipeline-completeness / canonical-order assertion
`runAll()` walks whatever `pipeline.yaml` lists; a pipeline that DROPS a canonical step still
exits 0 (the controller faithfully runs the shorter list). No assert proves the walked set is
complete or in canonical R1 order. **DEFERRED → Phase 6 / SMOKE-05** (the end-to-end DoD
smoke), which surfaces a dropped step as a dangling input / a non-closing producer→consumer
graph across all of Steps 0–10 — the right altitude for a completeness check, vs. Phase 2's
per-step / two-fixture scope.

---

## Re-verify (post-fix, all gates)

| Gate | Command | Result |
|------|---------|--------|
| controller-smoke | `bash engine/contracts/controller-smoke.sh` | exit 0 (ALL ASSERTS PASS) |
| store-smoke | `bash engine/contracts/store-smoke.sh --space=smoke` | exit 0 |
| h6-all | `bash engine/contracts/h6-all.sh` | 14/14 |
