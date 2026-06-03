# Component Audit — InkLeaf Landing Pages

Reusable building blocks extracted from `index.html` and `deposit.html`. These are the patterns an AI rebuilding a similar warm-paper product landing should copy-paste.

---

## 1. Design tokens (`:root`)
**When to use:** Always, as the first block of CSS. Every other component depends on these vars.
```css
:root{
  --bg:#F4EFE6; --surface:#FAF6EE; --surface-2:#EDE6D8;
  --ink:#1A1714; --ink-mid:#5C544A; --ink-soft:#8A8074;
  --line:#D8CFC0; --line-soft:#E8E1D2;
  --accent:#C76A2D; --accent-deep:#A55620; --accent-soft:#F3DCC2;
  --radius:14px; --shadow:0 1px 2px rgba(26,23,20,.04),0 8px 24px rgba(26,23,20,.06);
}
body{font-family:'Inter',system-ui,sans-serif;color:var(--ink);background:var(--bg)}
```
**Gotcha:** Both pages duplicate these — extract to a shared stylesheet before adding a 3rd page or palette drift is guaranteed.

---

## 2. Eyebrow + h-section + lede triplet
**When to use:** Top of every content section. The signature "small mono label → serif headline → muted paragraph" rhythm.
```html
<div class="eyebrow">The split-screen problem</div>
<h2 class="h-section">One screen always makes you <span class="thin">choose.</span></h2>
<p class="h-lede">A Kindle reads beautifully but can't take notes...</p>
```
```css
.eyebrow{font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:var(--accent-deep);margin-bottom:14px}
.h-section{font-family:'Newsreader',serif;font-weight:400;font-size:clamp(30px,5vw,46px);line-height:1.08;letter-spacing:-.02em;max-width:760px}
.h-section .thin{font-weight:200;font-style:italic;color:var(--ink-mid)}
.h-lede{font-size:17px;color:var(--ink-mid);max-width:620px;margin-bottom:36px}
```
**Gotcha:** The `.thin` italic span only reads right inside Newsreader — don't try it on Inter.

---

## 3. Pill button system (`.btn`)
**When to use:** Any CTA outside the signup form. Three intents: `primary` (ink), `ghost` (outlined), `accent` (orange).
```css
.btn{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:999px;font-weight:500;font-size:14px;transition:all .15s}
.btn-primary{background:var(--ink);color:var(--bg)}
.btn-ghost{background:transparent;border:1px solid var(--line)}
.btn-accent{background:var(--accent);color:#fff}
.btn-lg{height:52px;padding:0 26px}
.btn:hover .arrow{transform:translateX(3px)}
```
**Gotcha:** Arrow micro-interaction requires a literal `<span class="arrow">→</span>` inside the button — easy to forget.

---

## 4. Inline signup form (`.signup`)
**When to use:** Hero, midband, and final CTA. The canonical email-capture pattern, stacks on mobile, inline on desktop.
```html
<form class="signup" onsubmit="event.preventDefault();this.querySelector('button').innerHTML='You’re on the list ✓'">
  <input type="email" placeholder="Enter your email" required />
  <button type="submit">Get early access <span class="arrow">→</span></button>
</form>
```
```css
.signup{display:flex;flex-direction:column;gap:10px}
.signup input,.signup button{height:52px;border-radius:14px;font-size:15px}
.signup input{flex:1;padding:0 18px;border:1px solid var(--line);background:#fff}
.signup input:focus{outline:none;border-color:var(--accent);box-shadow:0 0 0 3px rgba(199,106,45,.12)}
.signup button{padding:0 24px;background:var(--accent);color:#fff;font-weight:600}
@media(min-width:560px){.signup{flex-direction:row}.signup button{flex:none}}
```
**Gotcha:** On dark backgrounds (midband) override `input{background:#fff;border-color:transparent}` or the field disappears.

---

## 5. Hero badge row (pulse + Kickstarter)
**When to use:** Directly above the H1 to set urgency + social proof in one line.
```html
<div class="hero-badges">
  <div class="hero-badge"><span class="pulse"></span><span>Sign up for earliest 2026 launch access</span></div>
  <div class="hero-badge ks"><span>Coming soon on</span><img src="kickstarter.png" alt="Kickstarter"/></div>
</div>
```
```css
.hero-badge{display:inline-flex;align-items:center;gap:10px;background:var(--surface);border:1px solid var(--line);border-radius:999px;padding:7px 14px;font-size:12px;color:var(--ink-mid)}
.hero-badge .pulse{width:8px;height:8px;border-radius:50%;background:var(--accent);box-shadow:0 0 0 4px rgba(199,106,45,.18);animation:pulse 2.4s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:.95}50%{opacity:.55}}
```
**Gotcha:** Pulse animation runs forever — pause with `prefers-reduced-motion` for accessibility.

---

## 6. Media frame (`.media-frame` + aspect modifiers)
**When to use:** Any product photo. Locks aspect ratio, paper border, optional mono caption tag.
```html
<div class="media-frame aspect-portrait">
  <span class="label-tag">SIDE-BY-SIDE</span>
  <img src="photo.jpg" alt="..." loading="lazy"/>
</div>
```
```css
.media-frame{position:relative;border-radius:14px;overflow:hidden;background:var(--surface-2);border:1px solid var(--line);box-shadow:var(--shadow)}
.media-frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.media-frame .label-tag{position:absolute;top:12px;left:12px;background:rgba(15,10,5,.75);color:#fff;font-family:monospace;font-size:10px;padding:5px 9px;border-radius:6px;backdrop-filter:blur(6px)}
.aspect-square{aspect-ratio:1/1} .aspect-portrait{aspect-ratio:3/4} .aspect-wide{aspect-ratio:16/10}
```
**Gotcha:** `object-fit:cover` will crop — always sanity-check the focal point on mobile portrait crops.

---

## 7. Alternating benefit row (`.benefit` + `.reverse`)
**When to use:** 2–4 feature explainers under the problem section. Auto-zig-zags via `.reverse`.
```html
<div class="benefit reverse">
  <div class="copy">
    <div class="num">01 / 04</div>
    <h3>Two screens, one device</h3>
    <p>Read on the left, write on the right...</p>
    <ul><li>4096-pressure stylus</li><li>Thinner than a paperback</li></ul>
  </div>
  <div class="media"><div class="media-frame aspect-wide"><img src="..."/></div></div>
</div>
```
```css
.benefit{display:grid;gap:28px;align-items:center;padding:48px 0;border-top:1px solid var(--line)}
.benefit ul li{display:flex;gap:10px;color:var(--ink-mid)}
.benefit ul li::before{content:"";width:6px;height:6px;border-radius:50%;background:var(--accent);margin-top:9px}
@media(min-width:840px){.benefit{grid-template-columns:1fr 1.1fr;gap:60px}.benefit.reverse .copy{order:2}.benefit.reverse .media{order:1}}
```
**Gotcha:** Don't `.reverse` two in a row — the zig must zag or you defeat the rhythm.

---

## 8. Dark spec block (`.specs`)
**When to use:** Tech specs after benefits. Inverted card with mono key / sans value grid.
**Structure:** Dark `--ink` rounded card (radius 24px, padding 56px on desktop). Headline + sub. CSS-grid 4-col on desktop, 2-col on mobile, with 1px gaps revealing a translucent white seam. Each `.spec` has uppercase mono `.k` label and a 15px white `.v` value; `.spec.hl` uses `#2a2622` background with peach text for the standout row.
**Gotcha:** The "gap" lines are achieved with `background:rgba(255,255,255,.08)` on the wrapper + opaque cells — using real `gap` breaks the seam effect.

---

## 9. Midband signup (dark CTA strip)
**When to use:** Mid-page conversion break between problem and specs. Dark `--ink` band with radial accent glow + reused `.signup`.
**Structure:** Full-width `<section class="midband">` with `::before` radial-gradient at 100% 50% in accent. Inner grid: serif H3 (`em` is peach `#F4B98A`) + muted lede on left, signup + fine print on right. Stacks single-column under 840px.
**Gotcha:** Override `.signup input{background:#fff;border-color:transparent}` here — the default border vanishes on dark.

---

## 10. Two-column offer + sticky checkout (deposit page)
**When to use:** Reservation / deposit / pre-order pages. Left = price story, right = sticky CTA card.
**Structure:** `.grid{grid-template-columns:1.08fr .92fr}` at ≥880px. Left `.offer` holds eyebrow → serif H1 → `.price-card` (MSRP strike-through → arrow → big founder price → save-tag pill, with a `.deposit-row` gradient strip welded to the card bottom via negative margins) → green-check `.perks-tight` list → `.offer-img`. Right `.checkout` is `position:sticky;top:20px`, contains a reassurance head, big 60px orange `.btn-primary` form, a 3-row `.trust-band` (secure / refundable / updates), fake payment badges, and legal fine print.
**Gotcha:** The `.deposit-row` uses `margin:0 -20px -18px` to bleed past the card padding — if you change `.price-card` padding, update both numbers or the gradient strip detaches.

---

## Quick reuse checklist
Tokens → typographic triplet → buttons → signup → media frames cover ~80% of any new section. The benefit row, specs block, and midband cover the marketing middle. The two-column offer is the deposit/checkout template. Everything else on these pages (problem cards, software grid, comparison table, origin story, founder quote, FAQ) is composed from these same primitives plus a thin section-specific wrapper.
