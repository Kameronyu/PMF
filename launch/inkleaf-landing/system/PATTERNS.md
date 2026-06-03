# PATTERNS.md — InkLeaf Reusable Component Manual

Build any new marketing section by composing these primitives. Tokens first, then typography, then buttons, then layout patterns. ~80% of new sections need nothing beyond items 1–5.

---

## 1. Design tokens (`:root`)
**When to use:** Always the first block of CSS on any page. Every other component reads these vars. If you add a third page, hoist them into a shared stylesheet — don't paste a third copy.
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

---

## 2. Eyebrow + h-section + lede triplet
**When to use:** Top of every content section. The signature "small mono label → serif headline → muted paragraph" rhythm carries the whole page voice. The italic-thin span only reads right inside Newsreader — don't try it on Inter.
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

---

## 3. Pill button system (`.btn`)
**When to use:** Any CTA outside the inline signup form. Three intents: `primary` (ink, default), `ghost` (outlined, secondary), `accent` (orange, conversion). Arrow micro-interaction requires a literal `<span class="arrow">→</span>` inside the button — easy to forget.
```css
.btn{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 20px;border-radius:999px;font-weight:500;font-size:14px;transition:all .15s}
.btn-primary{background:var(--ink);color:var(--bg)}
.btn-ghost{background:transparent;border:1px solid var(--line)}
.btn-accent{background:var(--accent);color:#fff}
.btn-lg{height:52px;padding:0 26px}
.btn:hover .arrow{transform:translateX(3px)}
```

---

## 4. Inline signup form (`.signup`)
**When to use:** Hero, midband, and final CTA. Stacks on mobile, inline at ≥560px. On dark backgrounds (midband), override `input{background:#fff;border-color:transparent}` or the field disappears into the section.
```html
<form class="signup">
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

---

## 5. Hero badge row (pulse + Kickstarter)
**When to use:** Directly above the H1 in any hero, to set urgency + social proof in one line. Wrap the pulse animation in a `prefers-reduced-motion` guard for accessibility.
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

---

## 6. Media frame (`.media-frame` + aspect modifiers)
**When to use:** Any product photo. Locks aspect ratio so layout doesn't shift on image load; optional mono `.label-tag` for editorial captioning. Always sanity-check the focal point on mobile portrait crops — `object-fit:cover` silently crops the subject.
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

---

## 7. Alternating benefit row (`.benefit` + `.reverse`)
**When to use:** 2–4 feature explainers under the problem section. Apply `.reverse` to every other row to zig-zag — never two in a row, or the rhythm dies.
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

---

## 8. Dark spec block (`.specs`)
**When to use:** Tech specs section after the benefit rows. Inverted dark card (`--ink`, radius 24px, 56px padding desktop). CSS-grid 4-col desktop / 2-col mobile. The "seam" lines between cells are achieved with `background:rgba(255,255,255,.08)` on the wrapper plus opaque cells — using real `gap` breaks the seam effect. Each `.spec` has uppercase mono `.k` label and a 15px white `.v` value; `.spec.hl` uses `#2a2622` with peach text for the standout row.

---

## 9. Midband signup (dark CTA strip)
**When to use:** Mid-page conversion break between problem and specs. Full-bleed `<section class="midband">` on `--ink` with a `::before` radial-gradient accent glow at 100% 50%. Grid: serif H3 (peach `<em>` `#F4B98A`) + muted lede left, `.signup` + fine print right. Stacks under 840px. Must override `.signup input{background:#fff;border-color:transparent}` here.

---

## 10. Two-column offer + sticky checkout (deposit page)
**When to use:** Any reservation/pre-order/deposit page. Grid `1.08fr .92fr` at ≥880px. Left `.offer` = eyebrow → serif H1 → `.price-card` (MSRP strike → arrow → big founder price → save-tag pill, with a `.deposit-row` gradient strip welded to the card via `margin:0 -20px -18px`) → green-check perks → product image. Right `.checkout` is `position:sticky;top:20px` holding reassurance head, big 60px orange `.btn-primary`, a 3-row `.trust-band`, fake payment badges, fine print. If you change `.price-card` padding, update the `.deposit-row` negative margins in lockstep or the gradient strip detaches.

---

## Quick reuse checklist
Tokens (1) → triplet (2) → buttons (3) → signup (4) → media frames (6) cover most new sections. Add benefit rows (7), specs (8), midband (9) for marketing middles. Use offer+sticky (10) for any checkout-adjacent page. Everything else on these two pages — problem cards, software grid, comparison table, origin story, founder quote, FAQ — is just these primitives plus a thin section wrapper.
