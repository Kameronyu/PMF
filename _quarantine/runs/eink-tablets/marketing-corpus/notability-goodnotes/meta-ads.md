# Meta Ad Library — Notability + GoodNotes

Pulled: 2026-05-23.

## Status: BLOCKED (sandbox)

Attempted to run `node runs/eink-tablets/scripts/adlib-one.js notability "Notability"` and `node runs/eink-tablets/scripts/adlib-one.js goodnotes "GoodNotes"` from this agent. Bash execution was denied by the sandbox.

No prior `notability*`/`goodnotes*`/`good-notes*` artifacts exist in `runs/eink-tablets/adlibrary/` (checked at pull time — only the previously dumped boox/daylight/dwell/hallow/hosanna-revival/in-touch/kindle-scribe/remarkable/boox-kw/daylight-kw files are present).

## Action needed from orchestrator
Run these two commands and re-invoke this dumper (or hand the resulting `_adv.txt` files back):

```
node /home/kyu3/PMF/runs/eink-tablets/scripts/adlib-one.js notability "Notability"
node /home/kyu3/PMF/runs/eink-tablets/scripts/adlib-one.js goodnotes "GoodNotes"
```

Expected outputs:
- `/home/kyu3/PMF/runs/eink-tablets/adlibrary/notability_adv.txt` (+ `_adv.png`)
- `/home/kyu3/PMF/runs/eink-tablets/adlibrary/goodnotes_adv.txt` (+ `_adv.png`)

## Page-ID resolution risk
- "Notability" is a generic English word; the typeahead picker is likely to surface fan pages, study-tip pages, or the wrong "Notability" personality. If `pickAdvertiser` scores below 30, the script will return NONE — re-run with the explicit Facebook page ID for Ginger Labs / Notability as `pageId` 3rd arg.
- "GoodNotes" is more brand-specific but the official Facebook page is `goodnotesofficial` (https://www.facebook.com/goodnotesofficial/). If typeahead picks a non-official "GoodNotes" community page, force the page ID from the Facebook URL.

## Active ad dump
(Empty pending orchestrator re-run.)
