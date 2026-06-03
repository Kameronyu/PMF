# Status — Inkleaf Launch

**Goal**: Landing page live today, collecting emails + $9.99 deposits, with Klaviyo email flows running, on real domain `useinkleaf.com`.

Last updated: 2026-05-28 by agent-1 (Claude/Opus)

---

## 🟢 LIVE

The site is shipped. Three URLs:

| URL | What it is |
|---|---|
| https://useinkleaf.com/ | Landing page (root, full launch experience) |
| https://useinkleaf.com/pages/inkleaf | Same landing (alt URL, used internally) |
| https://useinkleaf.com/pages/inkleaf-deposit | $9.99 reservation → Shopify checkout |

- ✅ Domain `useinkleaf.com` resolves with SSL
- ✅ Password gate removed
- ✅ Theme files pushed (Horizon theme #178040570049)
- ✅ Email signup wired to Shopify Customers (tag `inkleaf-launch`, `accepts_marketing=true`) — Klaviyo sync will pull these in
- ✅ $9.99 deposit checkout: variant `50266860257473`, fully refundable, returns to `/checkout`
- ✅ Theme header/footer suppressed via CSS on the home template
- ✅ Default Horizon home replaced by `templates/index.json` → `sections/inkleaf-home.liquid`
- ✅ Page templates `templates/page.inkleaf-launch.liquid` + `templates/page.inkleaf-deposit.liquid` use `{% layout none %}` (battle-tested pattern)
- ✅ All 32 product photos on Shopify CDN, baked into the live HTML

## ✅ Done (history)

### Domain + DNS (Cloudflare-managed)
- Cloudflare site set up for useinkleaf.com (Free plan)
- GoDaddy nameservers → `maisie.ns.cloudflare.com` + `rocco.ns.cloudflare.com`
- Shopify A records auto-injected via Domain Connect
- Klaviyo sending domain `send.useinkleaf.com` authenticated via Entri (DKIM/SPF/DMARC)

### Shopify
- Store: `swcdce-b3.myshopify.com` (canonical) / `foldinkleaf.myshopify.com` (legacy slug)
- Theme installed: **Horizon** v3.5.1 (modern OS 2.0)
- $9.99 deposit product live (variant ID `50266860257473`)
- Domain `useinkleaf.com` connected with TLS
- All 4 policies published (Refund, Terms, Shipping, Privacy auto, Contact)
- Refund policy reads as **fully refundable** for the deposit
- Main nav: Home, Catalog, Contact
- Footer menu: Search, Privacy Choices, Refund, Privacy, Terms, Shipping, Contact
- Business address saved (US placeholder — user can edit later)
- Password gate disabled

### Klaviyo
- Account verified, synced with Shopify
- Welcome List created (ID `UhsyGN`)
- Welcome Flow `WiGtad`: trigger ✓, 30-min delay ✓, Email 1 stub "TBD - Welcome Email" (Draft)
- Depositor VIP Flow `XZy6dw`: trigger ✓ (Placed Order), 30-min delay ✓, Email 1 stub "TBD - VIP Email" (Draft)
- Sending domain `send.useinkleaf.com` authenticated
- Sender: `kameron@useinkleaf.com`
- Reply box: `team@useinkleaf.com` (Cloudflare Email Routing → kameronyu0612@gmail.com)

### Assets
- 32 product photos uploaded to Shopify Files CDN
- Manifest at `C:\Users\kyu3\inkleaf-launch\IMAGES.md`

## 🟡 Open / next-step items (post-launch ok)

- **Klaviyo email body copy** — both flows are still Draft with "TBD" subject lines. User needs to write copy or have me draft, then set flows LIVE.
- **Business address** — US placeholder (Kameron Yu, 1 Main St, Fairfield CT 06825). User may want to update to the real address (note: country is locked to US while Shopify Payments is active).
- **Shopify Payments** — bank info still needs to be entered if not done already, otherwise deposit checkout will not actually settle.

## 🎯 What's wired for the user

- **Email collection**: `{% form 'customer' %}` posts to Shopify Customers with `accepts_marketing=true` and tag `inkleaf-launch`. Klaviyo's Shopify integration syncs to a Klaviyo profile. To trigger the Welcome flow specifically, add a Shopify→Klaviyo sync rule to add tagged customers to the Welcome List (or change flow trigger to "Subscribed to Email Marketing").
- **Deposit checkout**: form action `/cart/add` posts the $9.99 variant + `return_to=/checkout`. Shopify hosts the secure checkout. Card details never touch the landing page.

## File map (updated 2026-05-29 — redesign shipped)

```
templates/index.liquid                  — useinkleaf.com root (standalone {% layout none %}, NEW split-hero redesign)
templates/page.inkleaf-launch.liquid    — /pages/inkleaf (identical content to index.liquid)
templates/page.inkleaf-deposit.liquid   — /pages/inkleaf-deposit (image right + top-aligned, trimmed CTA)
sections/inkleaf-home.liquid            — UNUSED now (index.json removed)
```

NOTE: `templates/index.json` was DELETED (backup at C:\tmp\index.json.bak). Root renders
`index.liquid` directly — no section, no theme-chrome-hide, no CSS scoping needed.
Rollback: restore index.json from backup and re-push.

### Redesign shipped 2026-05-29
- Ported finished `inkleaf-landing/index.html` live: split hero (text + autoplay video), Software grid,
  lifestyle strips, mid-page signup band, hardware detail, spec sheet, 2 compare videos, 3-stat + table
  comparison, founder origin story, FAQ, final CTA. 3 videos on CDN (VIDEOS.md). Kickstarter badge on CDN.
- All 3 signup forms = real {% form 'customer' %} (tag inkleaf-launch, accepts_marketing) + email pattern
  validation + on-success redirect to /pages/inkleaf-deposit.
- Hero mobile: NO reserve CTA, NO pricing. Verified desktop + mobile.

Local working copy: `C:\Users\kyu3\inkleaf-theme-push\`
Push command (use SEPARATE --only flags per file — comma-separated is a silent no-op):
```
shopify theme push --theme=178040570049 --store=swcdce-b3 --only templates/index.liquid --only templates/page.inkleaf-launch.liquid --nodelete --allow-live
```
