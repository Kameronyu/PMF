# Campaign Body — Modos Paper Monitor Dev Kit

Source: https://www.crowdsupply.com/modos-tech/modos-paper-monitor
Artifact: raw/campaign-2026-05-24T19-38-47.txt
Captured: 2026-05-24

---

## Hero Headline + Subhead

**Headline:** Modos Paper Monitor
**Subhead:** A fast, low-latency, open-hardware e-paper monitor and dev kit

---

## Campaign Stats (at capture)

- $197,588 raised of $110,000 goal
- 179% Funded
- 355 backers
- Funded on Sep 18, 2025
- 11 updates
- Available for pre-order. $199–$599

---

## Lead Description (verbatim)

"Modos Paper Dev Kit includes nearly everything you need to create an open-hardware e-paper monitor with a fast 75 Hz refresh rate, low latency, various screen-update configurations, multiple image modes, and flexible dithering options. It can be connected through HDMI or USB, and it works on Linux, macOS, and Windows. We are offering 6-inch and 13-inch monochrome kits, both powered by the same display controller, which can also be used with other panels."

---

## Story / About Copy (verbatim, in order)

### At the Cutting Edge of E-Paper

"Twenty years ago, the release of the first e-paper devices marked a significant milestone in display technology, giving rise to e-readers and digital signage. Electrophoretic displays stand out for their unique qualities: they are easy on the eyes, mimic the aesthetics of paper, conserve power when idle, and offer high contrast with wide viewing angles even in direct sunlight.

In recent years, improvements in e-paper technology have expanded its applications beyond traditional e-readers. Despite these advancements, however, key challenges still hold back widespread adoption of e-paper devices:

Proprietary Hardware and Software: Most e-paper devices operate on closed, proprietary systems.
Lack of Standards: There is a shortage of best practices and guidelines for designing user interfaces optimized for e-paper.
High Costs: The expense of e-paper panels limits experimentation and broader adoption.

We built the Modos Developer Kit to allow engineers, product designers, programmers, and enthusiasts to re-purpose e-paper screens in creative ways. We're also building a community that's committed to establishing the standards, best practices, and guidelines needed to realize the full potential of e-paper technology. Join us on Discord and by following us on Mastodon, Bluesky, Matrix, and Twitter."

### High Refresh Rate

"Our Developer Kit leverages Caster, an open-source FPGA-based electrophoretic display controller engineered for low-latency performance and capable of driving e-paper screens at up to 60 Hz. By dividing the screen into multiple update regions, the Caster processes and displays new images or text instantly, without waiting for previous updates to complete. Each pixel is managed independently, and early cancellation techniques ensure that pixels update as soon as new data is available. The result is smooth, responsive performance with high frame rates and superior contrast, ideal for dynamic content and fluid interactions."

### Compatible With a Variety of Screens

"Got a spare e-paper screen gathering dust or looking to re-purpose a display for your project? Our Developer Kit makes it simple. Compatible with a wide range of screens—from 6-inch up to 13.3-inch, in both monochrome and color—the kit lets you easily connect and reuse unused displays. With our monitor enclosure design files, you can build a custom monitor housing that perfectly fits your project's needs.

Explore our GitHub repository for a complete list of compatible screens."

### Reuse. Experiment. Create.

"Every kit includes the Glider Mega Adapter, giving you out-of-the-box support for a wide range of e-paper panels. With one adapter set, you can connect displays from 4.3" up to 13.3". The Glider Mega Adapter includes support for the following (which is not a comprehensive list, as some panels are untested but expected to work):

39-pin 0.3mm pitch: Certain 4.3", 5", and 13.3" screens (ED043WC1, ED043WC3, ED050SU3, ES133UTx, ED133UTx, EC133UJ1)
33-pin 0.5mm pitch: Most 9.7" screens (ED097OCx, ED097ODx, ED097TCx)
0.5mm pitch, 7.8"–10.3" screens: (ED078KCx, ED078KHx, EC078KHx, ED080TC1, EC080SC2, ED100UC1, ES103TCx, ED103TCx)
34-pin 0.5mm pitch: Most 6.0" screens (ED060SCF, ED060SCP, ED060XC3/C5/C8/C9/CG/D4/D6/G1/H2, ED060KC1/C4/D1/G1, etc.)
50-pin 0.5mm pitch: Most 11.3" screens (ED113TCx)

With these adapters, anyone interested in working with e-paper has much more flexibility to experiment by reusing e-paper panels from existing devices as well as trying out new ones."

### User-Defined Modes & API

"While commercial e-paper products rely on preset driving strategies (text, graphics, video modes) to cope with the technology's limitations, our Developer Kit goes further. It offers full customization so you can tailor the display experience to your specific needs.

For example, the Hybrid Greyscale Mode allows the Caster to switch between a fast binary mode for quick updates and a slower, detailed greyscale mode for refined rendering. This minimizes latency and visual flashing by updating in binary first, then refining in greyscale as the image stabilizes.

With our C API, you gain direct control over screen and mode selection, letting you optimize the display for a wide range of applications. Our broader vision includes developing native e-paper applications and a protocol for seamless mode transitions based on content type."

---

## Features & Specifications (verbatim)

**Driver Board Hardware Reference Design**
- Xilinx Spartan-6 LX16 FPGA running Caster gateware
- DDR3-800 framebuffer memory
- Video input supporting:
  - USB Type-C DisplayPort Alt-Mode with on-board PTN3460 decoder
  - DVI (via microHDMI connector) video input with on-board ADV7611 decoder
- E-paper power supply with up to 1 A peak current on the ±15 V rail to support large panel sizes.
- VCOM kick-back voltage measurement support
- On-board STM32H750 microcontroller for USB communication, firmware upgrades, and standalone applications. Processing rate up to 133 MP/s when error-diffusion dithering enabled and 200 MP/s when disabled

**Caster FPGA Gateware Reference Design**
- Supports electrophoretic display panels with parallel interfaces (E Ink, OED, and DES)
- Compatible with both monochrome and color-filter-array screens
- Extremely low processing delay (<20 µs)
- Supports binary, 4-level grayscale, and 16-level grayscale output modes
- Latency-optimized binary and 4-level grayscale driving modes
- Hybrid automatic binary and 16-level grayscale driving mode
- Host software runtime controllable regional updates and mode switching
- Hardware bayer dithering, blue-noise dithering, and error-diffusion dithering with no additional latency

---

## Comparison Tables (verbatim)

### E-Paper Monitors

| | Modos 13" Paper Dev Kit | DASUNG 13.3" Paperlike HD-FT | Boox Mira 13.3" E-Ink Monitor | Waveshare EINK DISP 133 |
|---|---|---|---|---|
| Display | Eink Carta 1000 (ED133UT3) | Eink Carta 1000 (ES133TT3) | Eink Carta 1200 (ES133TT5) | Eink Carta 1000 (ED133UT2) |
| Screen Size | 13.3" | 13.3" | 13.3" | 13.3" |
| Screen Resolution | 1600 x 1200 | 2200 x 1650 | 2200 x 1650 | 1600 x 1200 |
| Maximum Frame rate | 75Hz | 40Hz | ~20Hz | ~15Hz |
| Interfaces | HDMI & USB Type-C | HDMI | HDMI & USB Type-C | HDMI |
| Touchscreen | No | Yes | No | No |
| Frontlight | No | Yes | Yes | No |
| Open Hardware | Yes | No | No | No |
| Programmable Modes | Yes | No | No | No |
| API for Display Controller | Yes | No | No | No |
| Price | $599 | $798 | $800 | $679 |

### E-Paper Dev Kits

| | Modos 6" Paper Dev Kit | Waveshare e-paper HAT | Inkplate 6 MOTION | EPDiy |
|---|---|---|---|---|
| Controller | FPGA-based | None | ESP32-based | ESP32-based |
| Display Technology | E Ink | E Ink | E Ink | E Ink |
| Screen Size | 6.0" | 6.0" | 6.0" | 9.7" |
| Programming Language Support | Rust, Python, C | Python, C, C++ | MicroPython, C, C++ | MicroPython, C, C++ |
| Screen Resolution | 1448 x 1072 | 1448 x 1072 | 1024 × 758 | 1200 x 825 |
| Maximum Frame rate | 75 Hz | < 2 Hz | 11 Hz | Unknown |
| Interfaces | HDMI, USB Type-C | SPI, GPIO | USB Type-C, GPIO | GPIO |
| Touchscreen | No | No | No | N/A |
| Frontlight | No | No | Yes | N/A |
| Open Hardware | Yes | No | Yes | Yes |
| Programmable Modes | Yes | Yes | Yes | Yes |
| API for Display Controller | Yes | No | No | No |
| Works With Other Panels | Yes | No | No | Yes |
| Power Consumption | High | Low | Low | Low |
| Price | $199 | $113 | $195 | N/A |

---

## Manufacturing Plan (verbatim)

"The Modos Developer Kit has passed pre-production revisions and undergone thorough validation and testing. We have established partnerships with contract manufacturers in China, our chosen partner will handle board manufacturing and assembly. The panels are sourced directly from E Ink Corporation. With the Caster completed and the design finalized, we now have a full Bill of Materials (BOM) and supplier quotes in place as we prepare for production. Once the campaign concludes, manufacturing will commence, and we'll keep you updated via campaign emails."

---

## Fulfillment & Logistics (verbatim)

"After our production run is finished, we will package everything and send it to Crowd Supply's fulfillment partner, Mouser Electronics, for distribution to backers worldwide. For more details about Crowd Supply's fulfillment service, please refer to their guide under Ordering, Paying, and Shipping."

---

## Risks & Challenges (verbatim)

"The development of the Modos Developer Kit has been ongoing for over a year. Throughout this time, the core functionalities of our display controller board have proven stable, allowing us to focus on refining the hardware design and solving engineering challenges. We are confident in the robustness of our final product.

That said, as with any hardware project, the production process and supply-chain management present inherent risks. To mitigate these risks, we have built strong partnerships with our suppliers and manufacturers. In the event of any setbacks, we are committed to minimizing delays and will keep our backers informed with transparent, timely updates throughout the process."

---

## Funding Acknowledgments (verbatim)

"Thank You to the NLnet Foundation and the NGI Zero Entrust Fund

Our team would like to acknowledge partial funding for development of Caster from the NGI0 Entrust Fund, a fund established by NLnet with financial support from the European Commission's Next Generation Internet program."

"Modos Paper Monitor is part of AMD FPGA Playground"

---

## Key Components (verbatim)

"AMD Spartan 6 · XC6SLX16-3CSG324I · image processing"

---

## Creator Bio / About the Team (verbatim)

"Modos Tech
Boston, MA · discord.gg/6ktE6VxSyh · modos@fosstodon.org · modostech.bsky.social · Modos-Labs · modos.tech/matrix · modostech

Our mission is to help you live a healthy life by creating technology that respects your time, attention, and well-being. We are creating an open hardware and open-source ecosystem of e-ink devices.

Alexander Soto
@alexsotodev / alex-a-soto

Wenting Zhang
@zephray_wenting / zephray"

---

## Pre-Launch Reference

Pre-launch blog post published May 20, 2024 at https://www.modos.tech/blog/modos-paper-monitor-pre-launch-on-crowd-supply
CTA: "We invite you to sign up on Crowd Supply to stay informed about the latest news and updates on our project."
At pre-launch (May 2024), spec listed was 60 Hz refresh rate; shipped campaign (Aug 2025) listed 75 Hz.

---

## In the Press (section heading only in campaign — "In the Press" listed as section but body blocked)

Section present in campaign page but body content not extractable from txt artifact.

---

## Support & Documentation (verbatim)

"The Modos Developer Kit is open hardwayore [sic] built using open-source software, with all design files and source code available on GitHub. Our documentation offers extensive information on electrophoretic displays, drawing from both public sources and our original research. This serves as a comprehensive guide for anyone looking to dive deeper into e-paper technology.

For additional support or to join the discussion, please visit Discord and follow us on Mastodon, Bluesky, Matrix, and Twitter."

Note: "open hardwayore" is a typo in the original campaign text (should be "open hardware").
