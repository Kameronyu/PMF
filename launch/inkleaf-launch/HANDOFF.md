# Inkleaf — Setup Handoff

## ✅ What's done

### Shopify
- **Store**: `foldinkleaf.myshopify.com` (trial — needs paid plan to take real money)
- **Product**: "Inkleaf — Reserve Your Spot ($10 Deposit)" — digital, no shipping, no inventory tracking
- **Variant ID**: `50266860257473`

### Klaviyo
- **Account**: connected to Shopify (synced both ways)
- **List**: "Inkleaf Welcome List" — ID `UhsyGN`
- **Flow 1**: "Inkleaf Welcome Flow" — ID `WiGtad` — triggers on add to Inkleaf Welcome List, no re-entry
- **Flow 2**: "Inkleaf Depositor VIP Flow" — ID `XZy6dw` — triggers on Shopify Placed Order

---

## 🔗 URLs to wire into the HTML landing page

### CTA #1 — Email capture form
Your HTML form should POST emails directly to Klaviyo's subscribe endpoint. Use this snippet (drop into your landing page):

```html
<form id="inkleaf-email-form" action="https://manage.kmail-lists.com/subscriptions/subscribe" method="POST" target="hidden_iframe" onsubmit="setTimeout(function(){window.location='https://foldinkleaf.myshopify.com/cart/50266860257473:1';}, 500);">
  <input type="hidden" name="g" value="UhsyGN">
  <input type="hidden" name="$list_fields" value="">
  <input type="email" name="email" placeholder="your@email.com" required>
  <button type="submit">Reserve my Inkleaf</button>
</form>
<iframe name="hidden_iframe" style="display:none"></iframe>
```

After form submit: redirects to the $10 deposit checkout.

### CTA #2 — Direct to deposit checkout (skip email capture)
```
https://foldinkleaf.myshopify.com/cart/50266860257473:1
```

---

## ⚠️ What you need to finish manually in Klaviyo

Klaviyo's flow editor uses a drag-and-drop canvas that fought the automation. Both flows have their **triggers set correctly** but the email steps need to be dragged in by hand. Quick:

### Welcome Flow (`WiGtad`)
1. Open the flow editor → drag a **Time delay** (30 minutes) after Trigger
2. Drag an **Email** action after the delay → fill placeholder content
3. Drag **Time delay** (1 day) → **Email**, repeat for 4 emails total per the playbook
4. On the Trigger, click "Add profile filter" → **Has placed order zero times since starting this flow** (so depositors get pulled out of this flow into the VIP flow)
5. Toggle "Smart sending" OFF on each email
6. Update status to **Live**

### Depositor VIP Flow (`XZy6dw`)
1. On the Trigger, click "Add trigger filter" → **Product variant ID equals 50266860257473** (so only the $10 deposit fires this, not future real product orders)
2. Drag a **Time delay** (30 minutes) → **Email** with VIP welcome / what's next / shipping ETA
3. Toggle "Smart sending" OFF
4. Update status to **Live**

---

## 📦 Remaining setup (you have to do, can't automate)

1. **Shopify Plan**: Pick a paid plan ($1 first month available) before going live — trial can't take real $
2. **Shopify Payments**: Settings → Payments → activate Shopify Payments + enter bank info (HK bank acct)
3. **Shopify Policies**: Settings → Policies → generate templates (refund, privacy, terms)
4. **Shopify Domain**: Settings → Domains → buy or connect your domain (currently `foldinkleaf.myshopify.com`)
5. **Remove password protection**: Online Store → Preferences → disable password page (once ready to go public)

---

## IDs Quick Reference
| Thing | Value |
|---|---|
| Shopify store handle | `foldinkleaf` |
| Shopify variant ID | `50266860257473` |
| Klaviyo list ID | `UhsyGN` |
| Klaviyo welcome flow ID | `WiGtad` |
| Klaviyo VIP flow ID | `XZy6dw` |
