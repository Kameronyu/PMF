---
name: reddit-extract
description: >-
  Link -> verbatim Reddit thread content. Given a Reddit thread URL, extracts the OP plus EVERY
  comment and reply (full tree, expanding collapsed "load more"/"continue thread" nodes) and writes
  clean nested markdown a downstream agent can read with zero parsing, plus the raw JSON as backup.
  Use when the user gives a reddit.com thread link and wants the whole thing read end-to-end, dumped,
  or turned into readable text — for VOC/market research, summarizing a discussion, or feeding a
  thread to another agent. Beats WebFetch (which 403s on reddit.com) by driving a real browser.
---

# reddit-extract

Turn a Reddit thread URL into verbatim, readable content. One deterministic script does it — no
agents, no manual scraping.

## When to use

- User pastes a `reddit.com/r/<sub>/comments/<id>/...` link and wants the content read, dumped,
  summarized, or saved.
- Any task needing the FULL thread (all comments + nested replies), not just the first post.

## How to run

```bash
# from the PMF project root:
node .claude/skills/reddit-extract/dump.mjs <thread-url> [outDir]
# or with an absolute path (works from any cwd; $CLAUDE_PROJECT_DIR may be unset in a plain shell):
node /home/kyu3/PMF/.claude/skills/reddit-extract/dump.mjs <thread-url> [outDir]
```

- `<thread-url>` — any link to a **specific post**. All of these work; the script normalizes them:
  - full thread permalink (`/r/<sub>/comments/<id>/<slug>/`)
  - `redd.it/<id>` short link
  - `/r/<sub>/s/<token>` mobile share link
  - `old.` / `m.` / `np.` hosts, and `?utm_*` tracking junk
  - Subreddit / user / search / home pages are **rejected** (exit 2) — it won't silently grab a feed's top post.
- `[outDir]` — positional (not a flag). Where to write output; created if missing. Default: current dir. For PMF runs, pass a path under
  `runs/<space>/.../fetch/.../reddit/` to keep provenance (and honor no-overwrite-v1: re-runs write
  a new file/dir, never overwrite).

It prints the two output paths and an extraction count. Files are named
`r-<sub>-<postid>-<slug>.md` and `.raw.json`.

## What you get

- **`<base>.md`** — the deliverable. Title + OP block, then every comment as
  `**<path> u/<author>** · <score> pts · <timestamp> · <permalink>` with blockquote nesting and
  numbered reply paths (`4.1.1.` = third-level reply). Rich enough that the JSON is never needed
  for reading.
- **`<base>.raw.json`** — the raw Reddit API response, kept only as a programmatic escape hatch.

## How it works (and why it doesn't break)

Reddit edge-blocks raw `.json` (curl/requests/`page.goto` to the .json all 403). The script loads
the real HTML thread page in headless Chromium (200), then calls `.json?limit=500` and
`/api/morechildren.json` from **inside** that page (same-origin fetch with the real browser's TLS +
cookies). A loop resolves `more` nodes until the tree is fully expanded, so 1000+ comment threads
come through complete.

## Requirements

- Playwright with Chromium installed. The script resolves `playwright` from common locations or
  `PLAYWRIGHT_PATH`. If it errors "playwright not found", install it (`npm i playwright &&
  npx playwright install chromium`) or set `PLAYWRIGHT_PATH`.

## Notes

- A small gap between extracted count and the post's reported `num_comments` is normal — it's
  deleted/removed comments that count but have no body.
- Verbatim by design: bodies are copied as-is. No summarizing, no editorializing.
