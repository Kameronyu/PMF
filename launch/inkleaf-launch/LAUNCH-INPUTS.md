# Launch Inputs — InkLeaf `‹reference instance›`

Per-launch variable sheet. **`LAUNCH-RUNBOOK.md` is the product-agnostic process; it reads its
product-specific values from THIS file.** To launch a new product: copy this file, replace every
value, keep the structure. Nothing here is "strategy" — it's the deployable content/config the
runbook pastes in.

---

## Product parameters
| Key | Value |
|---|---|
| Product name | InkLeaf (foldable dual-screen E Ink tablet) |
| Deposit amount / currency | `9.99` USD |
| Refund terms | Fully refundable any time before ship; comes off final price |
| Ship / batch date | August 2026 |
| Sender name | `Kameron from InkLeaf` |
| Sender address | `kameron@useinkleaf.com` |
| Reply-to | `team@useinkleaf.com` |
| Deposit page URL | `https://useinkleaf.com/pages/inkleaf-deposit` |
| Brand styling (both emails) | cream `#F4EFE6` background, Georgia serif, body color `#1a1714`; CTA button orange `#C76A2D`, white text, pill radius |

## Media assets
- Photos manifest: `IMAGES.md` (32 product photos on Shopify Files CDN)
- Videos manifest: `VIDEOS.md` (hero + 2 compare clips; hashed CDN paths)
- Source originals: `C:\Users\kyu3\inkleaf-photos\` ; landing assets `C:\Users\kyu3\inkleaf-landing\assets\`

---

## Email 1 — non-depositor nudge
**Goes in:** Klaviyo Welcome flow → Email 1 (No / non-depositor branch).
- **Subject:** `You're on the InkLeaf early access list`
- **From:** `Kameron from InkLeaf <kameron@useinkleaf.com>`
- **CTA button:** `Reserve your slot for $10 →` → `https://useinkleaf.com/pages/inkleaf-deposit`
- **Body:**

> Hey, it's Kameron, founder of InkLeaf.
>
> You're on the list, so you get the launch link before the public and the chance to order from the August 2026 founder batch.
>
> One thing worth knowing while you're here. InkLeaf isn't a concept or a render. It's finished hardware, in production right now.
>
> If you want the best price on it, that's what the $10 deposit is for. Subscribers get early access, but the deposit is what locks in the founder discount, the lowest price InkLeaf will ever be, plus your slot in the first batch and entry an hour before everyone else on launch day. It's fully refundable any time before we ship and it comes off your final price, so it costs you nothing either way.
>
> Founder pricing is limited to the deposit holders, and the slots are going.
>
> **[ Reserve your slot for $10 → ]**  (button → https://useinkleaf.com/pages/inkleaf-deposit)
>
> Either way I'll keep you posted as we move through production. Glad you're here.
>
> Kameron

---

## Email 2 — depositor confirmation
**Goes in:** Shopify Order confirmation notification (repurposed). No CTA button — it's a confirmation.
- **Subject:** `Your InkLeaf slot is locked`
- **Ready-to-paste HTML:** `C:\tmp\shopify-order-confirmation.html`
- **Body:**

> Hey, it's Kameron.
>
> Your deposit is in and your founder slot is locked. Here's what that means: you've got the founder discount held, the lowest price InkLeaf will ever sell for, your spot in the first batch, and early access an hour before the public on launch day. Your $10 comes off your final price, and it's refundable any time before we ship if you change your mind.
>
> You backed this early, when it was just my word and a product in production. I don't take that lightly.
>
> So here's my promise on the part that matters most. You'll hear from me at every step, including the moment anything slips. The founder batch ships August 2026. If that date ever moves, you'll get it from me directly, not from silence. Too many people in this space get that wrong. I won't.
>
> Next update from me will be a production progress note in the next few weeks. Nothing you need to do until then.
>
> If you know someone who reads and writes for a living, now's the best time to send them our way. Founder pricing is limited and the slots are going.
>
> Talk soon,
> Kameron
