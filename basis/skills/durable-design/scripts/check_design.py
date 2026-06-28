#!/usr/bin/env python3
"""
check_design.py — validator for a durable design document.

Enforces the PRESENCE + SOUNDNESS contract from SKILL.md MECHANICALLY, so the
authoring agent never self-grades the parts a script can decide. Judgment (is this
interface ACTUALLY stable? is the rationale ACTUALLY sufficient?) stays in the
membership tests; this script checks structure, labels, and required tokens.

Usage:  python check_design.py <design.md>
Exit 0 + "emit_ready" if every mechanical SOUNDNESS check passes; else exit 1 +
"BLOCKED:" with one line per problem. A STAY_AGENTIC decision is a valid, complete
output and passes immediately.

Self-test: `python check_design.py --selftest` runs the bundled examples and asserts
the expected pass/fail, so a broken validator can never silently ship.
"""
import os
import re
import sys

REQUIRED_SECTIONS = [
    "Intent & success criteria",
    "Assumptions & dependencies",
    "Preflight",
    "Skeleton",
    "Joints",
    "Verification",
    "Fallback ladder",
    "Maintenance",
]
HARDEN_VERDICTS = ["FULL_HARDEN", "HARDEN_PLUS_HEALING", "HYBRID", "STAY_AGENTIC"]
SIGNAL_TOKENS = ["frequency", "(stability|interface)", "variance", "revers"]
FROZEN_STEP_PARTS = ["Precondition", "Action", "Verify", "Rollback"]


def section_body(text, header):
    """Return the text under a '## header' up to the next '## ' (or EOF)."""
    pat = re.compile(r"^##\s+" + re.escape(header) + r".*$", re.MULTILINE)
    m = pat.search(text)
    if not m:
        return None
    start = m.end()
    nxt = re.search(r"^##\s+", text[start:], re.MULTILINE)
    return text[start: start + nxt.start()] if nxt else text[start:]


def read_verdict(text):
    """Parse the verdict from a DECLARED line (deterministic), not free prose.

    Scanning prose for any enum token is order-dependent and binds nondeterministically
    when a document names more than one verdict (e.g. 'considered FULL_HARDEN, chose
    STAY_AGENTIC'). Require an explicit 'harden_verdict: <ENUM>' line instead.
    """
    m = re.search(
        r"harden[_ ]?verdict\s*[:=]\s*\**(" + "|".join(HARDEN_VERDICTS) + r")\b",
        text, re.IGNORECASE)
    return m.group(1).upper() if m else None


def check(text):
    problems = []
    verdict = read_verdict(text)
    if verdict is None:
        problems.append("harden_verdict not declared on its own line — expected 'harden_verdict: <"
                        + " | ".join(HARDEN_VERDICTS) + ">'")

    # A STAY_AGENTIC decision is a complete output: it must NOT carry a full design.
    if verdict == "STAY_AGENTIC":
        if re.search(r"^##\s+Skeleton", text, re.MULTILINE):
            problems.append("STAY_AGENTIC but a Skeleton section is present — a non-harden decision must stop, not author a design")
        return problems

    # --- named signals behind the verdict must be present (evidence is judged separately) ---
    for tok in SIGNAL_TOKENS:
        if not re.search(tok, text, re.IGNORECASE):
            problems.append(f"harden_verdict signal missing: no '{tok}' — the verdict must show its named signals {{run_frequency, interface_stability, input_variance, reversibility}}")

    # --- PRESENCE: all eight sections exist and are non-empty ---
    for sec in REQUIRED_SECTIONS:
        body = section_body(text, sec)
        if body is None:
            problems.append(f"missing section: {sec}")
        elif not body.strip():
            problems.append(f"empty section: {sec}")

    # --- every step labeled FROZEN or JOINT; a JOINT is expected unless the verdict is
    #     FULL_HARDEN (where the fallback ladder's T2 supplies the adaptive path). ---
    if not re.search(r"\bFROZEN\b", text):
        problems.append("no FROZEN step labeled in the skeleton")
    if not re.search(r"\bJOINT\b", text) and verdict != "FULL_HARDEN":
        problems.append("no JOINT labeled — a non-FULL_HARDEN design expects >=1 adaptive joint; if everything is truly freezable, the verdict should be FULL_HARDEN")

    # --- preflight must be able to FAIL and HALT (not warn-and-continue) ---
    pf = section_body(text, "Preflight") or ""
    if not re.search(r"\b(refuse|halt|fail|abort|stop|block)\b", pf, re.IGNORECASE):
        problems.append("Preflight has no refuse/halt-on-failure language — a preflight that can't FAIL is theater")

    # --- intent must carry a CAPTURED golden output (not just the word 'golden') ---
    intent = section_body(text, "Intent & success criteria") or ""
    if not re.search(r"golden", intent, re.IGNORECASE):
        problems.append("Intent has no golden output captured from the original run")
    elif not re.search(r"(```|checksum|\.csv|\.json|\.pdf|\.txt|/[\w.-]+|\b\d{2,}\b)", intent, re.IGNORECASE):
        problems.append("Intent names a golden output but shows no captured-artifact signal (a path, checksum, file, fenced block, or a number) — looks described, not captured")

    # --- verification must diff against the golden output ---
    ver = section_body(text, "Verification") or ""
    if not re.search(r"\b(diff|compare|checksum|match|assert)\b", ver, re.IGNORECASE):
        problems.append("Verification does not diff/compare against the golden output")

    # --- fallback ladder: three DISTINCT tiers + escalation ---
    fb = section_body(text, "Fallback ladder") or ""
    found = set()
    for m in re.findall(r"\b(?:T|Tier\s*)([123])\b", fb):
        found.add("T" + m)
    if not {"T1", "T2", "T3"} <= found:
        problems.append(f"Fallback ladder needs 3 distinct tiers T1->T2->T3 (found {sorted(found) or 'none'}); retry -> re-explore -> escalate")
    if not re.search(r"\b(escalat|human|hand[- ]?off)\b", fb, re.IGNORECASE):
        problems.append("Fallback ladder has no human-escalation tier (T3)")

    # --- maintenance metadata ---
    mt = section_body(text, "Maintenance") or ""
    for token in ["owner", "version", "valid"]:  # 'valid' matches last_validated / last-validated
        if not re.search(token, mt, re.IGNORECASE):
            problems.append(f"Maintenance missing '{token}'")
    if not re.search(r"\b(recompile|regenerat|drift)\b", mt, re.IGNORECASE):
        problems.append("Maintenance names no recompile/drift trigger")

    # --- each FROZEN step block should carry the 4 parts (best-effort, per skeleton) ---
    skel = section_body(text, "Skeleton") or ""
    if re.search(r"\bFROZEN\b", skel):
        for part in FROZEN_STEP_PARTS:
            if not re.search(part, skel, re.IGNORECASE):
                problems.append(f"Skeleton/FROZEN steps missing '{part}' (need Precondition -> Action -> Verify -> Rollback)")

    return problems


def main():
    if len(sys.argv) == 2 and sys.argv[1] == "--selftest":
        sys.exit(selftest())
    if len(sys.argv) != 2:
        print("usage: python check_design.py <design.md> | --selftest")
        sys.exit(2)
    text = open(sys.argv[1], encoding="utf-8").read()
    problems = check(text)
    if problems:
        print("BLOCKED:\n- " + "\n- ".join(problems))
        sys.exit(1)
    print("emit_ready")
    sys.exit(0)


def selftest():
    """Run bundled examples; assert the example design passes and a stripped copy fails."""
    here = os.path.dirname(os.path.abspath(__file__))
    ex = os.path.join(here, "..", "examples", "payout-reconcile.md")
    if not os.path.exists(ex):
        print("selftest: example not found at", ex)
        return 2
    good = check(open(ex, encoding="utf-8").read())
    bad = check("# x\nharden_verdict: FULL_HARDEN\n## Intent & success criteria\nx\n")
    ok = (good == [] and bad != [])
    print("selftest:", "PASS" if ok else "FAIL",
          "| example_problems=", good, "| stripped_problems_count=", len(bad))
    return 0 if ok else 1


if __name__ == "__main__":
    main()
