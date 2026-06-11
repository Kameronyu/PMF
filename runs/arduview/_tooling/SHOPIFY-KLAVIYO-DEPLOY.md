# Deploy an HTML funnel → live Shopify store + Klaviyo capture

**This file is the whole recipe.** A future agent should read THIS + run the three scripts here. Do not
read any other handoff. Written 2026-06-09 from an actual end-to-end run (Arduview), not from theory —
the old InkLeaf `SHOPIFY-HANDOFF.md` is **obsolete** (it predates Shopify's Dev Dashboard and assumed
assets were already on the CDN).

Result of that run (live, password-gated trial store):
- https://j873ra-dj.myshopify.com/pages/arduview  (landing, 3 email-capture forms → Klaviyo)
- https://j873ra-dj.myshopify.com/pages/arduview-deposit  (→ Shopify $5 checkout)

---

## The three durable scripts (in this dir)

| Script | Job | Determinism |
|---|---|---|
| `cdp.cjs` | Drive the user's real Windows Chrome over **raw CDP** (the only browser-gated steps). Verbs: status/goto/shot/text/click/clicktext/fill/eval/waitfor. | tool |
| `shopify-upload-assets.js <dir>` | Upload images/video to Shopify Files → writes `{basename: cdn_url}` map. | script |
| `shopify-deploy-funnel.js [config.json]` | Transform standalone HTML → slim layout + per-page Liquid templates + css/js assets, push via Theme Asset API, create the Online Store pages, wire checkout + Klaviyo. | script |

Reads creds from `.shopify-creds.json` and `.klaviyo-creds.json` (gitignored, in this dir).

---

## Flow (what's human vs script)

### A. ONE-TIME per Shopify store — get an Admin API token  *(browser, ~6 steps; no clean API for this)*
Shopify **killed legacy in-admin custom apps**; tokens now come from the **Dev Dashboard** via OAuth.
There is no token shown in the UI (OAuth assumes an app backend), so mint one by hand:

1. Admin → Settings → Apps and sales channels → **Develop apps** → "Build apps in Dev Dashboard" → **Create app**.
2. In the app's version config, check Admin API scopes you need: `write_products, write_themes, write_content, write_files` (write implies read). **Release** the version.
3. App → Settings: copy **Client ID** + **Secret** (`shpss_…`).
4. App → Overview → **Install app** → on the grant screen click **Install**. If it lands on the wrong store, hit `https://admin.shopify.com/store/<store>/oauth/redirect_from_developer_dashboard?client_id=<CID>` directly.
5. Mint an auth code: navigate to
   `https://<store>.myshopify.com/admin/oauth/authorize?client_id=<CID>&scope=write_products,write_themes,write_content,write_files&redirect_uri=https://example.com&state=x`
   (app already installed → redirects straight to `https://example.com/?code=…`). Read `code` from the URL bar.
6. Exchange: `curl -X POST https://<store>.myshopify.com/admin/oauth/access_token -d '{"client_id":"…","client_secret":"shpss_…","code":"…"}' -H 'content-type: application/json'` → `{"access_token":"shpat_…"}`.
   Save to `.shopify-creds.json`: `{store, token, api_version:"2025-01"}`. **Verify:** `GET /admin/api/2025-01/shop.json`.

### B. SCRIPTED — build + deploy
```
node shopify-upload-assets.js ../site/assets/img /tmp/url-map.json     # images → CDN
# create the deposit product (or any product) → capture variant id:
curl -X POST $API/products.json -H "X-Shopify-Access-Token: $TOKEN" -d '{"product":{"title":"… Founder Reservation","status":"active","variants":[{"price":"5.00","requires_shipping":false,"taxable":false,"inventory_policy":"continue"}]}}'
# edit shopify-deploy-funnel.js DEFAULT (or pass config.json): urlMap, checkoutUrl=/cart/<variant>:1, klaviyo, pages[]
node shopify-deploy-funnel.js
```

### C. ONE-TIME — Klaviyo  *(API for list; flow clone is browser/manual)*
- Keys: Klaviyo → Settings → API keys. Public key = **site id** (shown). Create a **Private API Key** (Full Access on List/Profiles/Flows/Templates) → `pk_…`.
- Create list: `POST https://a.klaviyo.com/api/lists/` (header `Authorization: Klaviyo-API-Key pk_…`, `revision: 2024-10-15`) → `list_id`.
- Form wiring is already emitted by `shopify-deploy-funnel.js`: the page JS POSTs to
  `https://a.klaviyo.com/client/subscriptions/?company_id=<PUBLIC>` with the list id (no private key, CORS-open). Returns 202.
- **Welcome flow = manual** (Klaviyo flow builder is NOT API-cloneable, and canvas automation is dangerous —
  see Gotchas). In Klaviyo: Flows → clone an existing welcome flow **at the flow level** (flow-name area, not a node's ⋮),
  rename, repoint trigger to the new list, swap brand copy in the emails, set Live.

---

## Gotchas discovered the hard way (don't rediscover)

1. **Playwright `connectOverCDP` hangs** on this Chrome build (browser_ui omnibox targets). `cdp.cjs` uses **raw CDP** to a single page target — robust. Raw `/json/list` + `/json/close/<id>` (HTTP) also lets you kill a hung tab without Playwright.
2. **Trial stores can't upload video to Files** ("Select a plan to upload this file"). Workaround: host video elsewhere (we point `hero.mp4` at the live surge URL via `assetOverrides`).
3. **Trial stores password-gate the storefront** until a plan is picked. Password is at Online Store → Preferences (was `ailawl`). To go truly public the user must pick the $1 plan, then remove the password. To smoke-test behind it: `curl -c jar -d "form_type=storefront_password&utf8=✓&password=<pw>" https://<store>/password` then `curl -b jar …`. In the browser the field needs **real keystrokes** (`Input.insertText`) — synthetic value-set fails the form.
4. **Shopify admin settings render in shadow DOM** (Polaris web components). Playwright/CDP locators pierce it, but `innerText` of `body` won't show it.
5. **Checkout** = cart permalink `/<store>/cart/<variantId>:1` → 302 to hosted checkout. No `/cart/add` form needed.
6. **Page = Liquid template + slim custom layout** (`{% layout 'ns' %}`) so the theme's header/footer don't wrap the LP. JSON templates can't set a custom layout; Liquid ones can. This is cleaner than the old "section + JSON template" recipe.

---

## Cross-check vs the live InkLeaf store (what Arduview still lacks)

InkLeaf (useinkleaf.com, paid, live, real orders) runs the same shape **plus**:
- **A paid plan + custom domain** → Arduview is trial + default domain, storefront password-gated. *(user said domain later)*
- **Klaviyo "Welcome Flow"** (Added to List → wait → conditional split → emails, **live**) → Arduview has the list + capture but **no flow yet** (manual clone, step C).
- **Klaviyo↔Shopify order sync for Arduview is NOT available on this account (confirmed 2026-06-09).** The Klaviyo Shopify integration is **single-store and occupied by the live InkLeaf store** (`swcdce-b3`). The Klaviyo app was installed on `j873ra-dj`, but Klaviyo's Integrations page offers no "add another store" — only "Disable Integration" (which would replace/break InkLeaf). So Arduview orders do NOT reach Klaviyo, and the welcome flow's `Placed Order` deposit-split has no Arduview data (it references the account's metric = InkLeaf's). To fix without harming InkLeaf: use a **separate Klaviyo account for Arduview**, or a Klaviyo plan that supports **multi-store**. The email *capture* works regardless (client-API → list). Depositor confirmation rides Shopify (no Klaviyo needed).
- **Same Klaviyo account** (company `UguyM6` = InkLeaf) hosts the Arduview list → Arduview emails send under InkLeaf's sending identity unless a separate sender/brand is configured.

---

## The Klaviyo email architecture (InkLeaf model, ported to Arduview)
Source of truth: `git show 0260a1d:launch/inkleaf-launch/LAUNCH-RUNBOOK.md` (+ `LAUNCH-INPUTS.md` for the letter copy). Two letters, two channels:
- **Email-only signup → nudge** via a Klaviyo **Welcome flow**: `trigger (Added to Waitlist) → wait 30 min → conditional split on "Placed Order" (zero) → nudge email` (depositors suppressed by the split). The split sits AFTER the delay so it reads live "did they deposit yet".
- **Depositor → confirmation** via the **Shopify order confirmation** notification, repurposed (NOT a Klaviyo email — Shopify's confirmation can't be disabled and fires instantly on purchase, so the depositor letter rides it). The Klaviyo "Depositor VIP" flow is retired/draft.

### Depositor confirmation = edit Shopify Order confirmation (no API for notification templates)
Admin → Settings → Notifications → Customer notifications → **Order confirmation** → Edit. URL: `/store/<store>/email_templates/order_confirmation/edit`. Subject input + a **CodeMirror 6** body editor. To replace via CDP: set subject via React-safe native setter; for the body click `.cm-content`, `Ctrl+A` (Input.dispatchKeyEvent modifiers:2 KeyA), `Delete`, then `Input.insertText(html)`; the Polaris save bar's **Save** appears after the change. Arduview's HTML is `runs/arduview/site/order-confirmation-email.html`.

### Welcome flow = clone InkLeaf's at the FLOW level (NOT node level)
Flows list → "Inkleaf Welcome Flow" row → **Actions → Clone** → conversion-metric dialog → **Continue** → creates a copy with identical structure + email design. Then on the COPY: repoint trigger list → Arduview Waitlist, edit the email copy to Arduview, set Live. **NEVER** use a node's Options→Clone/Delete inside the live InkLeaf flow editor (it mutates the live flow — this bit us once; we restored it). Klaviyo flow CANVAS cards ignore synthetic `.click()` — use a **real mouse click** via `Input.dispatchMouseEvent` at the element's getBoundingClientRect center. Email body content lives in an iframe `#CanvasIFrame`.

**DONE for Arduview (flow `R43UN9`, Draft).** Implemented exactly this way and verified node-by-node via the Klaviyo API against InkLeaf `WiGtad`: trigger=Added to Arduview Waitlist (`SPniwZ`) · wait 30 min · conditional split `Placed Order count > 0` (true=depositor→End, false→email) · nudge email. Email verified: subject "You're on the Arduview early access list", from-name "Kameron from Arduview", body 0×"inkleaf" / $5 / "August 2026", CTA → `/pages/arduview-deposit`. **From-address left `kameron@useinkleaf.com`** (the only verified sending domain on this account — changing it breaks deliverability; set a verified Arduview domain later). 
- **Go-live blocker:** "Review and turn on" → Save returns *"Upgrade to set this flow live — active profiles 273 of 250"*. The Klaviyo account is over its free profile limit; the flow stays Draft until the plan is upgraded or profiles trimmed < 250. No content change needed after that — just flip to Live.
- **Hard-won CDP techniques (flow builder):** the canvas is React Flow; its d3-zoom pane ignores synthetic CDP mouse/wheel, so pan to off-screen nodes by directly setting the `.react-flow__viewport` CSS `transform`. The email body is the **Ace** source editor inside `#CanvasIFrame`; edits only persist after clicking OFF the block (triggers parse + autosave). Clone confirm has a conversion-metric dialog → "Continue". A reusable variant of the driver was left at `/tmp/cdp_run.cjs` during the build.

## Favicon (browser-tab icon) — fully scriptable, no admin UI
Generate an SVG, upload as a theme asset, add a `<link rel="icon">` to the slim layout:
- `PUT /themes/<id>/assets.json` with `{asset:{key:"assets/favicon.svg", value:<svg>}}`
- patch `layout/<ns>.liquid`: insert `<link rel="icon" type="image/svg+xml" href="{{ 'favicon.svg' | asset_url }}">` before `{{ content_for_header }}`, PUT it back.
Arduview favicon (Game Boy-ish, light-blue translucent body + cyan screen): `runs/arduview/site/favicon.svg`.

## Custom domain (GoDaddy → Shopify) — DNS now, go-live needs a plan
Records to set in the registrar (GoDaddy DNS Manager, `dcc.godaddy.com/control/dnsmanagement?domainName=<domain>`):
- **A `@` → 23.227.38.65** (replace GoDaddy's "WebsiteBuilder Site" A record)
- **CNAME `www` → shops.myshopify.com** (replace the default `www → <domain>` CNAME)
Edit each row inline (Edit → set value via native setter → Save). Verify with DoH: `curl -s "https://dns.google/resolve?name=<domain>&type=A"`. The domain only **serves** after the user selects a paid plan and completes Shopify admin → Settings → Domains → **Connect existing** → `<domain>` (DNS already correct → verifies; SSL auto-provisions). arduview.com is DNS-wired + verified resolving as of 2026-06-09.

## Live Arduview IDs (this instance)
- Shopify store `j873ra-dj.myshopify.com` (admin handle same); app client_id `3464416f48cc09aadcb80d2e0e2a53d4`; theme `137162457173` (Horizon); $5 product variant `42581886599253`; pages `/pages/arduview`, `/pages/arduview-deposit`; storefront password `ailawl` (trial).
- Klaviyo company/site id `UguyM6`; Arduview list `SPniwZ`; **Arduview Welcome Flow `R43UN9` (Draft — go-live gated on profile-limit upgrade)**; private key in `.klaviyo-creds.json`. InkLeaf ref flow `WiGtad` (live — do not edit), retired VIP flow `XZy6dw`.
