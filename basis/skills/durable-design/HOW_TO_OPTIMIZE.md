# Tuning durable-design's trigger description (run in your authenticated Claude Code)

The skill-creator's description optimizer drives the `claude` CLI (`claude -p`). This
sandbox's CLI is not logged in, so run this locally where `claude` is authenticated.

From the skill-creator directory:

    cd <path-to>/skill-creator
    python -m scripts.run_loop \
      --eval-set <path-to>/durable-design/evals/trigger_eval.json \
      --skill-path <path-to>/durable-design \
      --model claude-opus-4-8 \
      --max-iterations 5 \
      --verbose

It splits the 20 queries 60/40 train/test, evaluates the current description
(3 runs/query), proposes improved descriptions, and picks `best_description` by the
held-out test score. Paste `best_description` into durable-design/SKILL.md frontmatter.

The eval set is seeded with should-NOT-trigger near-misses that belong to the siblings
(system-designer pipelines, skill-builder single-prompt hardening, instruction-mechanizer
de-vaguing, adversarial-reviewer audits) so the optimizer is forced to disambiguate.
