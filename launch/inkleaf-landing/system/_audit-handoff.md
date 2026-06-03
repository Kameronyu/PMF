# SHOPIFY-HANDOFF.md Audit

The file links the canonical Shopify docs at lines 11–21, then proceeds to paraphrase large chunks of those same docs. Below: what to cut, what to keep, and a slim outline.

## 1. Redundant

These sections re-explain mechanics already covered by the linked Shopify docs and should be deleted or collapsed to a one-liner pointer.

- **Lines 116–119 (Create two Shopify pages):** Generic "Admin → Online Store → Pages → Add page" walkthrough. Covered by the Page templates doc. The only project-specific bits are the titles, handles, and suffixes — preserve those, drop the click-path prose.
- **Lines 121–135 (Create page templates + JSON snippet):** The `{ "sections": { "main": {...} }, "order": [...] }` shape is straight out of the JSON templates doc (linked line 13). Keep only the `"type"` values.
- **Lines 137–155 (Create the sections + schema block):** The strip-`<html>`/`<head>` instructions, the `asset_url | stylesheet_tag` example, and the boilerplate `{% schema %}` are all in the Sections + Layouts docs (lines 14–15, 18–19). Redundant.
- **Lines 174 (Shop Pay auto-injection prose):** Documented behavior of Shopify checkout.
- **Lines 194–197 (Suppress theme header/footer):** The `{% layout %}` / `template.suffix` guard pattern is in the Layouts and `template` object docs (lines 15, 20).
- **Lines 199–203 (Smoke-test):** Generic QA checklist, not project-specific.
- **Line 23 (theme compatibility paragraph):** Useful framing but duplicates OS 2.0 conventions doc; trim to one sentence.

## 2. Essential

Project-specific wiring that has no equivalent in Shopify docs — keep verbatim.

- **Lines 3–4 (mission statement):** Two-page scope, $9.99 founder reservation framing.
- **Lines 27–48 (modification permissions + Do Not Change list):** Locks brand voice, pricing ($9.99 / $489 / $999 / 51%), palette, CDN URLs.
- **Lines 54–61 (file table + CDN note):** Maps the four local files to Shopify destinations; notes images are already CDN-hosted.
- **Lines 67–79 (page goals):** Defines landing-vs-deposit intent, hero image filenames, the "no fields on deposit" rule.
- **Lines 82–104 (section maps):** Numbered top-to-bottom inventory of both pages — irreplaceable.
- **Lines 109–114 (reservation product spec):** Title, $9.99 price, non-shippable digital flag, variant-ID capture.
- **Lines 157–172 (deposit form wiring):** The exact `REPLACE_WITH_SHOPIFY_VARIANT_ID` swap, the Liquid alternative, and the `preventDefault` / `setTimeout` removal instruction.
- **Lines 176–187 (signup wiring options):** Klaviyo / Customer / Mailchimp branch with the `inkleaf-launch` tag.
- **Lines 189–192 (cross-link fixes):** Replace `href="index.html"` with `/pages/inkleaf`; add deposit CTA to landing hero.
- **Lines 209–215 (gotchas):** Hand-tuned `object-position`, scrim z-index, inline payment-badge swap path, `onsubmit` stub removal.
- **Lines 217–223 (intentionally excluded):** Prevents future agents from "fixing" omissions.
- **Lines 227–233 (report-back checklist):** Closes the loop with the human.

## 3. Slim outline

1. Mission (2 pages, $9.99 reservation)
2. Reference docs (existing link list)
3. Modification rules — what you may change / must not change
4. File map + CDN note
5. Page intent — landing vs deposit
6. Section maps (both pages)
7. Project-specific wiring
   - Reservation product (title, price, digital flag, variant ID)
   - Page handles + template suffixes (`inkleaf-launch`, `inkleaf-deposit`)
   - Deposit form: variant ID swap + remove JS stubs
   - Landing form: Klaviyo/Customer/Mailchimp choice + `inkleaf-launch` tag
   - Cross-links (`/pages/inkleaf`, `/pages/inkleaf-deposit`)
   - Header/footer suppression (suffix guard — one line, link doc)
8. Gotchas (scrim z-index, `object-position`, badge swap, `onsubmit` stub)
9. Intentionally NOT included
10. Report-back checklist
