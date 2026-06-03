# Product Launch Funnel — Reproducible Runbook

**What this is:** the complete, self-contained process for standing up a product-launch
deposit funnel — landing page + Shopify deposit checkout + Klaviyo/Shopify email flow — the
way it was actually built for **InkLeaf**. It captures the END STATE, HOW IT WORKS, the EXACT
STEPS to reproduce it, and the MISTAKES that cost time so they are never repeated.

Written so an agent (cheaper model is fine) can execute it phase by phase with minimal human
help. The few steps a human MUST do are marked **🧑 HUMAN-ONLY**.

Reference build: InkLeaf (foldable dual-screen E Ink tablet, $9.99 refundable deposit).
Anything InkLeaf-specific is marked `‹reference›`; swap it for the new product.

---

## 0. How to use this runbook (instructions for the executing agent)

1. Work top-to-bottom by Phase (A → I). Each phase has a **Done when** check — do not advance
   until it is true.
2. When you reach a **🧑 HUMAN-ONLY** step, STOP, tell the human exactly what to click/enter,
   wait for confirmation, then continue. Never try to bot a CAPTCHA, type a password, or click
   an email verification link on the human's behalf.
3. **Self-document:** if you discover the UI moved, an ID changed, or a new gotcha, append it to
   the relevant phase and to §7. Keep this file the single source of truth.
4. Record real IDs/URLs as you create them into §3 (replace the `‹reference›` values).
5. Optimize for one-shot: batch independent work, don't re-verify what a tool already confirmed,
   and prefer the documented selectors/commands below over re-discovering them.

---

## I/O — Inputs & Outputs (the contract)

**Durability:** the PROCESS (Phases A–I, §7 mistakes, §8 automation notes, this contract) is
product-agnostic — identical for any deposit / pre-launch funnel. Only the *values* change per
launch. To reuse: keep §0–§2 and §4–§9 as-is, supply a fresh INPUTS set, and the InkLeaf values in
§3/§6 are just the worked ("filled-in") example, not part of the machinery.

### INPUTS — what you supply per launch
**1. Accounts & access** 🧑 (human-held; an agent cannot create these)
- Domain + registrar login; a **Cloudflare** account managing its DNS
- Shopify store on a **paid plan**; **Shopify Payments** + bank/payout details
- Klaviyo account; Shopify CLI installed + authenticated
- An inbox you can read (for verification links)

**2. Product parameters** (text values)
- Product name; deposit amount + currency; refund terms; ship/batch date
- Brand sender name; sender address (`name@domain`); reply-to address

**3. Content & media assets** (the creative — you provide)
- Landing-page HTML/design (or copy + layout to build it); logo / brand colors
- Product photos + videos (files) + a poster frame
- Two email letters with subjects: the **nudge** (non-depositor) and the **confirmation** (depositor)

**4. Runtime human actions** 🧑 (performed on cue during execution)
- Solve signup CAPTCHA; enter passwords/logins
- Approve the Cloudflare OAuth for domain auth; click email verification links
- Pick a plan / enter payment + bank info

### GENERATED MID-PROCESS — early-phase outputs that become later-phase inputs
- **Deposit variant ID** (Phase C) → landing CTA + any Placed-Order trigger filter
- **Store numeric ID** (read from any Files CDN URL) → image URL pattern
- **Media CDN URLs** (Phase D.0) → baked into the HTML
- **Klaviyo list ID + flow IDs** → wiring + analytics
> Record these into §3 as you create them — they're the connective tissue between phases.

### OUTPUTS — what running the runbook produces
- Live landing page on your domain (media + signup form + deposit CTA), mobile + desktop verified
- Shopify deposit product + working checkout that **settles real money**; 100%-off test code
- **Shopify sending domain authenticated** + order confirmation **repurposed** as the instant depositor letter
- **Klaviyo**: Shopify integration + Welcome List + **sending domain Active** + a **LIVE Welcome flow** (30-min delay → split → nudge for non-depositors; depositors suppressed)
- Net behavior: each visitor gets exactly one correct email, from the right system, in the inbox not spam
- Byproduct: a filled-in §3 manifest (all IDs/URLs) for the next operator

---

## 1. End goal (definition of done)

A live funnel that does this, reliably, with one email per person from the right system:

| Visitor does… | They get… | Sent by | Timing |
|---|---|---|---|
| Enters email, does **not** deposit | "You're on the list, here's why to deposit" **nudge** | Klaviyo Welcome flow | 30 min after signup |
| **Deposits** ($9.99, or free w/ code) | "Your deposit is in, slot locked" **confirmation** | Shopify order confirmation (repurposed) | Instant, on purchase |
| Deposits | (does NOT also get the nudge) | — suppressed by flow split | — |

**Done when all true:**
- [ ] Landing page live on the real domain, mobile + desktop verified.
- [ ] Email capture writes to Shopify Customers (`accepts_marketing=true`, launch tag) and syncs to Klaviyo.
- [ ] Deposit checkout works and actually settles money (Shopify Payments active).
- [ ] 100%-off code exists for free test deposits.
- [ ] Klaviyo Welcome flow LIVE; depositors are split out of the nudge.
- [ ] Shopify order confirmation = the depositor letter (not the default receipt).
- [ ] Klaviyo sending domain **Active** (not just verified) AND Shopify sending domain **Authenticated** → email lands in inbox, not spam.
- [ ] End-to-end test: real signup → nudge after 30 min; real deposit → instant confirmation, no nudge.

---

## 2. How it works (architecture)

```
                         ┌──────────────────────────────┐
   Visitor ──email──▶    │  Landing page (Shopify theme) │
                         │  {% form 'customer' %}        │
                         └───────────┬──────────────────┘
                                     │ tag=launch, accepts_marketing=true
                                     ▼
                         Shopify Customers ──sync──▶ Klaviyo profile ──▶ Welcome List
                                                                              │ (trigger)
                                                                              ▼
                                                              ┌────────────────────────────┐
                                                              │  KLAVIYO WELCOME FLOW        │
                                                              │  Wait 30 min                 │
                                                              │  Conditional split:          │
                                                              │   "Placed Order ≥ 1?"        │
                                                              │     ├─ Yes → END (silent)     │
                                                              │     └─ No  → Email 1 (nudge)  │
                                                              └────────────────────────────┘

   Visitor ──clicks deposit CTA──▶ /cart/{variantID}:1 ──▶ Shopify checkout ──▶ ORDER PLACED
                                                                              │
                                                                              ▼
                                                       ┌──────────────────────────────────┐
                                                       │  SHOPIFY ORDER CONFIRMATION EMAIL │
                                                       │  (repurposed = depositor letter)  │
                                                       │  fires instantly on purchase      │
                                                       └──────────────────────────────────┘
```

**Why depositor confirmation rides Shopify, not Klaviyo** (key design decision — see §9):
- Fires on the *real* purchase event → 100% reliable signal, zero tier-guessing.
- Instant (no 30-min delay).
- Shopify's order confirmation **cannot be turned off** on standard plans, so instead of fighting
  it, we *repurpose* it. One email instead of a duplicate.
- The Klaviyo "depositor" flow that used to do this is **retired** (set to Draft).

The Welcome-flow conditional split is the *only* thing preventing a depositor from also getting
the nudge. It must sit AFTER the 30-min delay so it reads live "did they deposit yet" data.

---

## 3. Live reference state — InkLeaf `‹reference›`

> Replace these when building a new product. **No passwords in this file** — they live in the
> human's password manager and are entered at runtime.

**Domain / DNS**
- Domain: `useinkleaf.com` — registrar GoDaddy, DNS managed by **Cloudflare** (nameservers `maisie.ns.cloudflare.com`, `rocco.ns.cloudflare.com`).
- Reply routing: `team@useinkleaf.com` → `kameronyu0612@gmail.com` via Cloudflare Email Routing.

**Shopify**
- Store: `swcdce-b3.myshopify.com` (canonical) / admin slug `foldinkleaf` → `admin.shopify.com/store/foldinkleaf`
- Theme: **Horizon** v3.5.1, theme ID `178040570049`
- Deposit product: "Inkleaf — Reserve Your Spot ($10 Deposit)", digital / no shipping / no inventory; **variant ID `50266860257473`**
- Discount: code **`{{TEST_DISCOUNT_CODE}}`**, 100% off order (free deposit, for testing/VIPs)
- Sender domain `useinkleaf.com`: **Authenticated** (Cloudflare auto-auth)
- Local theme working copy: `C:\Users\kyu3\inkleaf-theme-push\`

**Live URLs**
- `https://useinkleaf.com/` — landing (root)
- `https://useinkleaf.com/pages/inkleaf` — landing (alt)
- `https://useinkleaf.com/pages/inkleaf-deposit` — deposit page → checkout

**Klaviyo**
- Account ID `UguyM6`
- Welcome List `UhsyGN`
- Welcome Flow `WiGtad` (LIVE) — Email 1 message `WgDG7S`
- Depositor VIP Flow `XZy6dw` — **RETIRED (Draft)**; its Email 2 message `R7mNr3` content now lives in the Shopify order confirmation
- Sender `kameron@useinkleaf.com`, reply-to `team@useinkleaf.com`
- Klaviyo sending domain `send.useinkleaf.com`: **Active**

---

## 4. Prerequisites & human-only steps

Get these ready first. Items marked 🧑 cannot be automated — the agent must hand them off.

- 🧑 A domain (registrar account) and a **Cloudflare** account managing its DNS.
- 🧑 A Shopify account on a **paid plan** (trial cannot take real money).
- 🧑 **Shopify Payments** activated with bank/payout info.
- 🧑 An **inbox the human can check** for verification links (sender verification, etc.).
- 🧑 **CAPTCHA / login**: any signup or login gate with a human-verification checkbox or password.
- 🧑 Cloudflare **OAuth approval** when Shopify auto-authenticates the sending domain.
- Shopify CLI installed and authenticated for theme pushes.
- The two email letters (§6) and landing-page copy.

---

## 5. Build sequence

### Phase A — Domain & DNS
1. 🧑 Point the registrar's nameservers at Cloudflare (e.g. `maisie/rocco.ns.cloudflare.com`).
2. In Shopify, Settings → Domains → connect the domain. Shopify injects A/CNAME records (Domain
   Connect can auto-add to Cloudflare).
3. 🧑 (Optional) Cloudflare Email Routing: forward `team@yourdomain` → a real inbox for replies.

**Done when:** domain resolves with SSL and is the primary domain in Shopify.

### Phase B — Shopify store baseline
1. 🧑 Choose a paid plan. 🧑 Activate Shopify Payments + bank info.
2. Settings → Policies → generate Refund / Privacy / Terms / Shipping. **Refund policy must state
   the deposit is fully refundable.**
3. Settings → General → set store contact + business address.
4. Online Store → Preferences → **remove the password gate** only when ready to go public.

**Done when:** store can take real money; policies published.

### Phase C — Deposit product + free-test discount
1. Products → Add product: name "Reserve Your Spot ($X Deposit)". Set price (e.g. `9.99`).
   - **Digital**: uncheck "This is a physical product" (no shipping).
   - Uncheck "Track quantity" (no inventory limit).
   - Save → open the variant → **record the variant ID** (numeric, e.g. `50266860257473`). You
     need it for the landing-page CTA and the Klaviyo VIP trigger filter (if used).
2. Discounts → Create discount → **Amount off order** → code `{{TEST_DISCOUNT_CODE}}` (or chosen) → **Percentage = 100** →
   All customers, no minimum → Save. (Gives a $0 checkout for testing without real money.)

**Done when:** variant ID recorded; 100%-off code Active.

### Phase D — Website / theme (Liquid)

**D.0 — Media assets first (you bake their CDN URLs into the HTML, so upload before building pages).**
- Upload product photos + videos to **Shopify Files** (Content → Files, or via API). They serve from
  the Shopify CDN with **no auth**, so you reference them directly in the landing HTML (don't put
  large media in theme `assets/` — Files CDN is cleaner and uncapped).
- **Image URL pattern (predictable):**
  `https://cdn.shopify.com/s/files/1/<STORE_NUM_ID>/files/<filename>.jpg`
  - Full-res = URL as-is. Sized variant = insert `_800x800` / `_1200x` etc. before `.jpg`.
  - `‹reference›` store num id = `0864/9234/8609`; 32 photos catalogued in `IMAGES.md`.
- ⚠️ **Video URL pattern is DIFFERENT — a HASHED path, not predictable:**
  `https://cdn.shopify.com/videos/c/o/v/<hash>.mp4` — you must grab each exact URL after upload
  (you can't construct it from the filename like images). Videos catalogued in `VIDEOS.md`.
- Autoplay-friendly embed: `<video autoplay muted loop playsinline poster="<cdn poster>.jpg">`.
  Upload a poster frame too if you want one (it's a normal image URL).
- Keep a manifest (`IMAGES.md` / `VIDEOS.md`) mapping human name → CDN URL so the page build and
  future edits don't re-guess. Originals stay in a local source folder.

**D.1 — Page templates.** Pattern that works (avoids theme chrome fighting the design):
- Landing templates are **standalone**: `{% layout none %}` at the top, full HTML inside. Root is
  served by `templates/index.liquid` directly (delete `templates/index.json` if a section-based
  home interferes; keep a backup).
- Mirror pages: `templates/page.<slug>.liquid` for `/pages/<slug>` (e.g. `inkleaf`, `inkleaf-deposit`).
- **Email capture** = real `{% form 'customer' %}`:
  - `accepts_marketing=true`, add a launch tag (e.g. `inkleaf-launch`), email-pattern validation,
    on-success redirect to the deposit page.
- **Deposit CTA** = link/form to `/cart/{VARIANT_ID}:1` (optionally `return_to=/checkout`). Card
  details never touch the page; Shopify hosts checkout.
- Push with Shopify CLI — **one `--only` flag per file** (comma-separated lists silently no-op):
  ```
  shopify theme push --theme=<THEME_ID> --store=<STORE> \
    --only templates/index.liquid --only templates/page.inkleaf-launch.liquid \
    --nodelete --allow-live
  ```
  Then optionally `shopify theme publish --theme=<THEME_ID> --store=<STORE> --force`.

**Done when:** landing + deposit pages render on the live domain (verify mobile + desktop);
signup writes a tagged customer; deposit CTA reaches checkout.

### Phase E — Shopify sending domain + repurpose the order confirmation ⚠️ ORDER MATTERS
> You CANNOT edit Shopify notification templates until the sending identity is verified. So
> authenticate the domain FIRST, then edit.

1. **Authenticate the Shopify sending domain:**
   Settings → Notifications → **Email domain authentication** → if the domain is on Cloudflare,
   **"Authenticate automatically"** → 🧑 human approves the Cloudflare OAuth → Shopify adds DNS
   records. Wait for status **"Authenticated"**. (This also fixes deliverability and is what
   unlocks the template editor.)
2. **Repurpose the order confirmation as the depositor letter:**
   Settings → Notifications → Customer notifications → **Order confirmation** → **Edit**.
   - Subject → the depositor subject (e.g. `Your InkLeaf slot is locked`).
   - Body (CodeMirror 6 editor): select-all, delete, insert the full depositor-letter HTML (§6, Email 2).
     - Automation note: use Playwright `page.keyboard.insertText(html)` after `Control+A`/`Delete`,
       NOT character typing (CM6 auto-closes tags and corrupts typed HTML; insertText pastes literally).
   - Save. Reload to confirm subject + body persisted.
   - "Send test" → goes to the store-owner email → 🧑 human checks it renders and lands in INBOX.

**Done when:** sending domain Authenticated; order confirmation shows the depositor letter; test
received in inbox.

### Phase F — Klaviyo: integration, list, sending domain
1. Install/confirm the **Shopify integration** (two-way sync). Profiles + "Placed Order" metric flow in.
2. Create the **Welcome List** (e.g. "Welcome List"). Record its ID.
3. Ensure tagged signups land in this list (Shopify→Klaviyo sync rule on the launch tag, or trigger
   the flow on "Subscribed to Email Marketing" instead — pick one and be consistent).
4. **Activate the Klaviyo sending domain** — Settings → Domains → if `send.yourdomain.com` shows
   **Verified**, click **Activate** → confirm "All traffic will be moved" → status must read **Active**.
   ⚠️ Verified is NOT enough; an inactive branded domain means mail sends on Klaviyo's shared domain
   with a mismatched From → spam. **Activate it.**

**Done when:** list exists; signups populate it; sending domain **Active**.

### Phase G — Klaviyo Welcome flow (non-depositor nudge)
Build exactly this shape:
1. **Trigger:** "When someone is added to <Welcome List>". (Set flow filter / no re-entry as desired.)
2. **Wait 30 min** (time delay).
3. **Conditional split** — placed AFTER the delay so it reads live data:
   - Condition: **"Placed Order at least once over all time"**.
   - **Yes** branch → **End** (depositor; Shopify already confirmed them).
   - **No** branch → **Email 1** (the nudge, §6).
   - ⚠️ Watch the YES/NO polarity: with "at least once", YES = depositor = silent. (If you instead
     phrase it "zero times", the branches invert — verify which branch the email is on.)
4. On Email 1: **Smart Sending OFF** (else dedup silently skips re-tests and quick signups).
5. Set the email Live, then set the **flow status → Live**.

**Done when:** flow Live; a non-depositor test profile routes to Email 1; a depositor test profile routes to End.

> Note: the old "Depositor VIP flow" (trigger = Placed Order, filtered to the deposit variant ID,
> 30-min delay, then the depositor email) is **retired** — Shopify (Phase E) does this now. If you
> ever revive it for SMS/extra touches, filter its trigger to **Product variant ID = deposit variant**
> so future real-product orders don't fire it, and turn Smart Sending OFF.

### Phase H — Go-live checklist
- [ ] 🧑 Paid plan + Shopify Payments settling.
- [ ] Policies published; refund = fully refundable.
- [ ] 🧑 Password gate removed.
- [ ] Klaviyo sending domain Active; Shopify sending domain Authenticated.
- [ ] Welcome flow Live; order confirmation = depositor letter.
- [ ] `{{TEST_DISCOUNT_CODE}}` (or chosen) free-test code Active.

### Phase I — Verification / end-to-end test
1. With a **real inbox you control**, sign up on the live site (🧑 human solves any CAPTCHA).
2. Confirm a tagged Shopify customer + Klaviyo profile appear; profile enters the Welcome flow.
3. Wait 30 min → confirm the **nudge** arrives (inbox, not spam).
4. Place a deposit using `{{TEST_DISCOUNT_CODE}}` (free) → confirm the **depositor letter** arrives instantly AND
   that the nudge is suppressed for that person.
5. Check Klaviyo flow analytics: Delivered/Skipped per email; investigate any Skipped (see §7).

---

## 6. Email copy → slot (lives in `LAUNCH-INPUTS.md`)

The two letters are per-launch **content**, not part of the process, so they live in the per-launch
inputs file to keep this runbook product-clean. Pull them from there at build time:

| Slot | Where it deploys | Source |
|---|---|---|
| **Email 1 — non-depositor nudge** (subject, from, body, CTA) | Klaviyo Welcome flow → Email 1 (Phase G) | `LAUNCH-INPUTS.md` § Email 1 |
| **Email 2 — depositor confirmation** (subject, body) | Shopify Order confirmation (Phase E) | `LAUNCH-INPUTS.md` § Email 2 |

- Both share the brand styling defined in `LAUNCH-INPUTS.md` (cream bg, Georgia serif; Email 1 has
  the CTA button, Email 2 has none).
- Ready-to-paste HTML for Email 2: `C:\tmp\shopify-order-confirmation.html` `‹reference›`.
- For a new product, replace the copy in `LAUNCH-INPUTS.md` only — this section never changes.

---

## 7. Mistakes to avoid (the gold — read before building)

**Deliverability (why "emails didn't fire" — they did, but went to spam / got skipped):**
- **Activate the Klaviyo sending domain.** "Verified" ≠ sending. Inactive branded domain → shared
  domain + mismatched From → spam. (This was THE root cause of "emails not arriving.")
- **Authenticate the Shopify sending domain** too (Cloudflare auto-auth). Also required to even
  edit notification templates.
- **Test with REAL emails you can check.** Invalid addresses (e.g. a typo'd domain like
  `...@sas.upenn.eduy`) are silently **Skipped** in Klaviyo — looks like "nothing fired."
- A successful **"Send test"** only proves the message renders — it does NOT prove the live flow
  logic or timing. Verify the flow end-to-end separately.

**Flow logic:**
- **Conditional split goes AFTER the time delay**, so the tier check reads live "did they deposit"
  data. At minute 0 a fast depositor would be mis-tiered.
- **Verify YES/NO branch polarity** after building the split — it's easy to land the email on the
  wrong branch. ("at least once" → YES = depositor; "zero times" inverts it.)
- **Smart Sending OFF** on launch/transactional-style emails, or quick re-signups/re-tests get
  silently deduped.
- If using a separate depositor flow, **filter its trigger to the deposit variant ID**, or future
  real-product orders will fire it too.

**Shopify:**
- You **cannot disable** the Order confirmation email on standard plans (no toggle, any tier incl.
  Plus has no native switch). Don't waste time looking — **repurpose** it instead.
- Editing notification templates is **gated behind sender/domain verification**. Authenticate the
  domain first or the editor won't load.
- The notification "Sender email" shown is the store-owner account email; clicking it opens the
  account profile (don't change your login). Brand-match the From via domain authentication, not by
  editing the account.

**Process / human factors:**
- **Never** bot a CAPTCHA, type a password, or click an email verification link for the human.
- **Brand voice: no em dashes** (reads as AI). Stay out of copywriting unless explicitly asked.
- Don't retire the Klaviyo depositor flow until the Shopify replacement is verified live, or
  depositors get NO confirmation in the gap.

---

## 8. Automation notes (for a browser-driving agent)

**Klaviyo flow builder (React Flow canvas):**
- Off-screen nodes are **virtualized** (not in the DOM). To inspect/click a branch node, pan with a
  REAL mouse wheel (`page.mouse.wheel(0, dy)`) to render it; synthetic wheel events don't drive d3-zoom.
- Element refs change on every re-render. Use stable selectors (`[data-testid=...]`,
  `[role="option"]:has-text(...)`), fresh snapshots, and REAL clicks (JS `.click()` often doesn't
  register in Klaviyo's controlled inputs).
- HTML email blocks use the **Ace** editor: `document.querySelector('.ace_editor').env.editor.setValue(html, -1)`.
- Email content renders inside an iframe `#CanvasIFrame` — read letter HTML from there.
- "Update status" opens a panel with a status dropdown (Draft/Manual/Live) + Save.

**Shopify new admin (Polaris web components):**
- Much of the UI is in **shadow DOM** — `document.querySelector` won't find buttons/inputs. Use
  Playwright's role/text locators (`getByRole`, `getByText('Send', {exact:true})`) which pierce shadow DOM.
- Notification template body editor is **CodeMirror 6** (`.cm-content`). Replace content via focus →
  `Control+A` → `Delete` → `page.keyboard.insertText(html)` (literal paste; no auto-indent corruption).

**General:** long-lived SPA tabs can lose client-side routing; opening a fresh browser tab restores
in-app navigation while keeping the session/login.

---

## 9. Changelog / key decisions

- **Depositor confirmation moved Klaviyo → Shopify.** Originally a Klaviyo "VIP" flow (Placed Order
  → 30-min delay → email) sent the depositor confirmation. Replaced with the **Shopify order
  confirmation** (repurposed) because it fires instantly on the real purchase, removes the 30-min
  delay and tier-sync risk, and avoids a duplicate (Shopify's order email can't be turned off
  anyway). The Klaviyo VIP flow `‹XZy6dw›` is retired to **Draft** (revivable for SMS/extra touches).
- **Branded sending domain activated** in Klaviyo and **authenticated** in Shopify — the fix for
  poor inbox placement.
- **`{{TEST_DISCOUNT_CODE}}` 100%-off code** added for free end-to-end testing without spending real money.
