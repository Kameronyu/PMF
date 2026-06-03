# Tasks — Inkleaf Launch

**Protocol**: To claim a task, edit `OWNER` and set `STATUS: IN PROGRESS`. Mark `DONE` when finished. Do not work on a task another agent owns.

---

## P0 — Required for launch

### T1. Build HTML landing page
- OWNER: _unclaimed_
- STATUS: PENDING
- BLOCKED BY: user dropping copy into `COPY.md`
- DETAILS: Single page. Hero with email form → POSTs to Klaviyo subscribe endpoint, then redirects to deposit checkout. Mobile-first. Mirror eazeye.com brand tone.
- OUTPUT: `landing/index.html` + assets
- SNIPPETS: see `HANDOFF.md` for form action URL + deposit checkout URL

### T2. Finish Klaviyo Welcome Flow
- OWNER: _unclaimed_
- STATUS: PENDING
- DETAILS: Open flow `WiGtad` in Klaviyo. Add 30-min time delay → 4 emails per playbook (1-day delays between). Profile filter: placed order = 0 since starting flow. Smart sending OFF on all. Set status to LIVE.
- NOTES: Klaviyo's react-flow canvas resists Playwright drag. Try harder with raw mouse events, or do it manually.

### T3. Finish Klaviyo Depositor VIP Flow
- OWNER: _unclaimed_
- STATUS: PENDING
- DETAILS: Open flow `XZy6dw`. Trigger filter: variant ID = `50266860257473` (so future real products don't trigger this). 30-min delay → VIP welcome email. Set LIVE.

### T4. Deploy landing page
- OWNER: _unclaimed_
- STATUS: PENDING
- BLOCKED BY: T1
- DETAILS: Netlify drop or Vercel. Get live URL.

### T5. Pick + buy domain
- OWNER: user
- STATUS: PENDING
- DETAILS: Buy `inkleaf.co` or `getinkleaf.com` or similar. ~$15/yr.

### T6. Point domain at landing page
- OWNER: _unclaimed_
- STATUS: PENDING
- BLOCKED BY: T4, T5

---

## P1 — Research / quality

### T7. Scrape eazeye.com for brand voice + copy patterns
- OWNER: _unclaimed_
- STATUS: PENDING
- DETAILS: WebFetch eazeye.com, save key snippets to `notes/eazeye-research.md` — homepage hero, product page structure, refund/privacy policy text, email signup style.
- VALUE: lets T1 and T2/T3 emails feel on-brand without user writing every word

### T8. Clone eazeye Shopify setup
- OWNER: _unclaimed_
- STATUS: BLOCKED
- BLOCKED BY: user providing eazeye Shopify admin login
- DETAILS: Once logged in, copy: theme settings, policy text, product page template, email sender domain config.

---

## P2 — Nice to have (post-launch ok)

- Shopify policies (refund, privacy, terms) — can swipe from eazeye
- Remove Shopify password gate
- Abandoned cart flow (separate Klaviyo flow)
- Site abandonment flow
