# Arduview LP — Locked Visual Strategy ("Glasshouse")

Reconciled from the three brand-refs into ONE style. Built, not proposed.

## The reconciliation (who wins where)

| Layer | Source | Why it wins for Arduview |
|---|---|---|
| **Color + hardware staging** | **Nothing** | Transparency is invisible on white. Nothing's load-bearing move — shoot see-through hardware *lit against black* — is literally Arduview's problem. So hardware/"wow" bands are **black**; editorial/spec bands are **white**. Flip, never blend. |
| **Restraint + object-as-art** | **Teenage Engineering** | Lowercase, light-weight type; museum isolation; sparse, one-argument sections; **let the product be the only color**. Defends the anti-cheap-toy flank. |
| **Page architecture + voice** | **Playdate** | "the [noun]." eyebrow per section; objection-handling copy (already baked into COPY-DRAFT); price withheld → lives on Page 2. |

## Locked tokens

- **Surfaces:** black `#0a0a0b` ⇄ white `#ffffff` (+ `#f6f6f4` faint alt). No gradients on content.
- **Accent:** screen-glow **cyan `#2be5ff`** — the device's own OLED glow (HERO-VIDEO.md calls for "white + cyan accent"). TE principle: the PCB/screen carries the real color; cyan is <5% punctuation only (interactive, one highlight per section, dot motif). Never on body copy. Never a 2nd accent.
- **Type (all Google Fonts, free):**
  - **Doto** (dot-matrix) → wordmark, eyebrows, proof chips, buttons. = Nothing-NDot register **and** pixel-art game motif, double duty.
  - **Space Grotesk** (lowercase, weight 400–500) → headlines. = TE light-grotesque restraint.
  - **IBM Plex Mono** → body, specs, FAQ. = Nothing's LL Lettera / terminal-hacker register.
- **Motif:** low-opacity dot-grid on dark bands (Nothing Glyph-matrix + PCB + 8-bit, triple reference).
- **Casing:** lowercase for nav/labels/CTAs/eyebrows (TE). Locked headline copy left verbatim.

## What I deliberately did NOT do (from the refs' DON'T lists)
- No premium-price silence — price-anxiety handled by withholding price on P1, full reveal on P2 (Playdate transparency, calibrated to a crowdfunding price).
- No NDot clone (proprietary) — used Doto, a different-personality dot face.
- No animal motifs / campaign-pop / German copy / musician positioning.
- No spec-comparison table (Arduview loses a spec fight — only the "only see-through console" framing works; per build notes).
- No separate maker-identity lead section — DIY appeal stays inside the guts shots + Arduboy beat + founder block (chosen angle = novelty-object, not maker-identity).

## Files
- `index.html` — Page 1 landing (email capture only, no price, 7 sections, 3 CTAs).
- `deposit.html` — Page 2 deposit ($5 → $146 founder offer, above-fold on laptop/mobile).
- `styles.css` — the design system.
- `script.js` — scroll reveal + email-capture stub (localStorage; TODO: wire to ESP/Shopify) + checkout stub.
- `assets/img/*` — 5 real hardware photos (from COPY-DRAFT asset map).

## Placeholders / wiring left
- **Hero video** — styled placeholder, wired with the 4 beat captions + source-clip in/out points as `data-` attributes (see HERO-VIDEO.md). Drop the rendered `.mp4` + poster in and swap the `.video-ph` block for a `<video autoplay muted loop playsinline poster>`.
- **Founder section** — bracketed scaffold; fill from founder interview (the only trust pillar).
- **Email capture** — front-end only; POST target TODO.
- **Deposit checkout** — `reserve for $5` routes to Shopify checkout (TODO).
- **Image weight** — source photos are 5–9 MB each; compress/resize before going live (build-only as-is).
