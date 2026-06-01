# Comments & Community Discussion — Modos Paper Monitor Dev Kit

Sources:
- Hacker News: https://news.ycombinator.com/item?id=44836294 (81 comments, ~Aug–Sep 2025)
- Crowd Supply campaign comments: blocked (403) — no direct extraction possible
- Search snippets from Crowd Supply update pages
- GitHub: https://github.com/Modos-Labs/Glider/issues (open issues)
Captured: 2026-05-24

---

## Hacker News Discussion (item 44836294)

**Total comments:** 81
**Thread submitter:** RossBencina (self-described "e-ink monitor enthusiast," not affiliated)

### Top Comment Threads

**Comment — RossBencina (331 points):**
"Looks like my post got a second chance. I'm not affiliated with the project, but I am an interested e-ink monitor enthusiast."

**Comment — alex-a-soto (creator):**
"Three years ago, I posted about modding a ThinkPad T480 into an e-ink laptop...The result is a dev kit and monitor."

---

## Comment Themes + Representative Verbatim Quotes

### Theme 1: Disbelief / Refresh Rate Skepticism

"A 75Hz frame rate sounds too good to be true, are you sure Modos isn't using a reflective LCD?"
— Backer question via Crowd Supply update (source: search snippet from update 3)

"the demo video 'really doesn't look refresh rate compliant at 60 Hz'"
— HN commenter (paraphrase of skepticism raised; team provided additional demo videos in response)

"sandos: It seems to update fast, but with significant ghosting, right? Looking at the cat example. Maybe this is just the best e-ink can do."
— Hacker News

---

### Theme 2: Price / Size Ceiling

"Forgeties79: I'd take a solid 24", maybe 21", b&w 30hz at this point if the price was right (sub-$500)."
— Hacker News

**Creator response (alex-a-soto):**
"To get a 24" e-ink monitor anywhere near that price, we'd need much higher production volumes."
— Hacker News

---

### Theme 3: Open Hardware / Competitor Distrust (Boox, DASUNG)

"[Boox devices have] relentless phone-home to servers in China" and GPL non-compliance.
— HN commenter (paraphrase of competitor criticism)

"wtallis: The Type-C DP input appears to be using a DP to LVDS converter, so the FPGA is already accepting LVDS."
— HN (technical follow-up re LVDS integration request)

"exceptione: Being Dutch I am proud to see NLNet and the EU financially supporting this project."
— HN (positive signal on NLnet/EU funding acknowledgment)

---

### Theme 4: Display Glare / Panel Quality

"[demo footage shows] visible glare"
— HN commenter (paraphrase)

**Creator response:** "our driver board supports different panels, you can use one with lower glare if preferred."
— alex-a-soto, HN

---

### Theme 5: Power Consumption Concern

"Palomides: [asked about] power usage during idle and high framerate video operation."
— HN

**Creator response (alex-a-soto):** "The board uses about 1-1.5W under continuous use with no OS/kernel power optimizations."
— HN

Comparison table in campaign itself lists Modos power consumption as "High" vs. competitors' "Low" — a noted differentiator.

---

### Theme 6: Form Factor / Laptop Integration Requests

"RossBencina: I would love to see a version that can take LVDS from a typical laptop motherboard...I'm not sure about the power requirements however."
— HN

**Community response (wtallis):** "The Type-C DP input appears to be using a DP to LVDS converter, so the FPGA is already accepting LVDS."
— HN

"jzellis: This would be absolutely amazing for a productivity device...the latency makes it a bit irritating just to keep up with typing."
— HN (latency noted as acceptable but not seamless for all use cases)

---

### Theme 7: Future Product Roadmap Interest

"[Modos creator] We still aim to make an E Ink laptop, though there are some unique challenges."
— Gareth Halfacree / Hackster.io quoting creator

---

### Theme 8: NLnet / EU Funding Legitimacy

"rsto: [Questioned] EU funding given creators appear US-based."
— HN

**Creator response (alex-a-soto):** "We're grateful to NLnet and the EU, whose support made this project possible."
— HN

---

## Crowd Supply Campaign Comments

Direct extraction blocked (403). No refund-request volume, "no updates" complaints, or cancellation patterns extractable from Crowd Supply comment section directly.

From search context: Backer engagement described as positive; team invited community to Discord/Matrix to shape demo content. No evidence of mass refund requests or hostile comments in available data.

---

## GitHub Issues (github.com/Modos-Labs/Glider)

Open issues (as of May 2026):

- #11 — "FPGA ID readback is incorrect" (opened May 17, 2026, by fez13030265341-byte)
- #10 — "Waveform from SPI flash dump" (opened Apr 24, 2026, by ddB0515)
- #9 — "More infos about 512 colors on the Gallery Palette" (opened Sep 23, 2025, by psiegl)
- #8 — "Suggestion on which PCB version to order" (opened Nov 15, 2024, by yankobogdan)
- #7 — "If that can help 2 link of my research on this subject" (opened Nov 7, 2024, by JeremieRousseau)

Note: Issue count is low (11 open/closed total as of capture), consistent with niche dev audience. Issues lean toward technical integration rather than product complaints.

---

## Refund/Update-Complaint Volume

- No refund requests found in available data
- No "no updates in X months" complaints found — 11 updates over 8-month period
- Shipping ~2 months late (Jan 2026 target vs. Feb 2026 first batch) but no visible backer revolt
