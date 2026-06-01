# Notes / Gaps / Anomalies — Notability + GoodNotes

Pulled: 2026-05-23.

## Sandbox blocks
- Bash execution denied for `node adlib-one.js` runs. Meta ad dump is blocked — see meta-ads.md for the exact commands the orchestrator needs to run.

## Pages that failed to fetch
- `https://notability.com/blog` → HTTP 404. Notability blog actually lives at `blog.notability.com` (e.g., blog.notability.com/post/whats-new-in-notability — successfully pulled). If a deeper blog index dump is wanted, start from blog.notability.com root.
- `https://notability.com/get-started` → page renders behind JS, WebFetch returned only an image filename. Onboarding/signup copy not captured. Would need a Playwright dump if needed.

## Pricing inconsistency worth flagging to synthesizer
- App Store IAP for Notability lists a "Notability Lite" tier ($5.99/mo, $14.99/yr) that does NOT appear on the notability.com/pricing page (which shows Starter free / Plus $19.99 / Pro $99.99). Lite may be a legacy/grandfathered tier or App-Store-only — flag, do not interpret.
- Goodnotes IAP lists "Goodnotes 6 One-Time Payment $28.99" which is the legacy perpetual license (Goodnotes 6) — current website pushes only subscription tiers (Essential/Pro). Coexistence likely a migration legacy. Flag, do not interpret.

## Date/temporal anomalies
- Goodnotes /press surface shows several articles dated "April 8, 2026" in the "In the news" block — these are clearly display-date artifacts of the press kit page, not actual publication dates (e.g., Apple's "2022 iPad App of the Year" obviously predates 2026). Press release dates in the verbatim list are reliable; "In the news" timestamps should be discarded.
- Goodnotes back-to-school survival guide body references "2024" ("Back-to-school essentials, but for 2024") — content was not refreshed for 2025/2026 cycle as of pull date. Flag for synthesizer (signal of campaign cadence).

## Brand-name capitalization
- Marketing copy uses "Goodnotes" (one word, lowercase n) on site as of 2026, despite legacy/community "GoodNotes" everywhere on App Store reviews. Press releases and case studies use "Goodnotes". Both spellings appear in social handles (@goodnotes, @GoodnotesApp).

## Pages not yet pulled (low priority but exist)
- goodnotes.com/use-cases/{project-planning,knowledge-sharing,brainstorming}
- goodnotes.com/industries/{aec,legal,professional-services,gov-ngo,marketing-and-events}
- goodnotes.com/tools/{notebook,whiteboard,text-documents}
- goodnotes.com/features/{pdf-annotation,collaboration,meeting-notes,audio-recording,quick-notes}
- goodnotes.com/solutions/{itadmins,decisionmakers,resellers}
- goodnotes.com/learning-center, /research, /case-studies (only index pulled, no deep cases)
- goodnotes.com/windows, /android, /web (platform-specific LPs)
- notability.com/business/license-request (form-gated)
- trust.notability.com (security/compliance copy)

## Coverage estimate
Hero/positioning/pricing/edu/student/AI/partnership LPs are well-covered for both apps. Industry-vertical LPs (Goodnotes /industries/*) and tool-specific LPs (Goodnotes /tools/*, /features/*) are gaps but the homepage already enumerates each headline verbatim; full-page dumps would mostly add subheads + visuals. Meta ad library is the largest outstanding gap.
