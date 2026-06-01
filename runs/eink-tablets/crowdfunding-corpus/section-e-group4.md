# Section E — Verbatim Copy Vault (Group 4)

Campaigns: Modos Paper Monitor, Dasung Not-eReader 7.8", EeWrite E-Pad

---

### Modos Paper Monitor (Crowd Supply, 2025)

**Hero headline:** "Modos Paper Monitor"
**Subhead / tagline:** "A fast, low-latency, open-hardware e-paper monitor and dev kit"

**Story copy (verbatim, in section order):**

Lead description
"Modos Paper Dev Kit includes nearly everything you need to create an open-hardware e-paper monitor with a fast 75 Hz refresh rate, low latency, various screen-update configurations, multiple image modes, and flexible dithering options. It can be connected through HDMI or USB, and it works on Linux, macOS, and Windows. We are offering 6-inch and 13-inch monochrome kits, both powered by the same display controller, which can also be used with other panels."

At the Cutting Edge of E-Paper
"Twenty years ago, the release of the first e-paper devices marked a significant milestone in display technology, giving rise to e-readers and digital signage. Electrophoretic displays stand out for their unique qualities: they are easy on the eyes, mimic the aesthetics of paper, conserve power when idle, and offer high contrast with wide viewing angles even in direct sunlight.

In recent years, improvements in e-paper technology have expanded its applications beyond traditional e-readers. Despite these advancements, however, key challenges still hold back widespread adoption of e-paper devices:

Proprietary Hardware and Software: Most e-paper devices operate on closed, proprietary systems.
Lack of Standards: There is a shortage of best practices and guidelines for designing user interfaces optimized for e-paper.
High Costs: The expense of e-paper panels limits experimentation and broader adoption.

We built the Modos Developer Kit to allow engineers, product designers, programmers, and enthusiasts to re-purpose e-paper screens in creative ways. We're also building a community that's committed to establishing the standards, best practices, and guidelines needed to realize the full potential of e-paper technology. Join us on Discord and by following us on Mastodon, Bluesky, Matrix, and Twitter."

High Refresh Rate
"Our Developer Kit leverages Caster, an open-source FPGA-based electrophoretic display controller engineered for low-latency performance and capable of driving e-paper screens at up to 60 Hz. By dividing the screen into multiple update regions, the Caster processes and displays new images or text instantly, without waiting for previous updates to complete. Each pixel is managed independently, and early cancellation techniques ensure that pixels update as soon as new data is available. The result is smooth, responsive performance with high frame rates and superior contrast, ideal for dynamic content and fluid interactions."

Compatible With a Variety of Screens
"Got a spare e-paper screen gathering dust or looking to re-purpose a display for your project? Our Developer Kit makes it simple. Compatible with a wide range of screens—from 6-inch up to 13.3-inch, in both monochrome and color—the kit lets you easily connect and reuse unused displays. With our monitor enclosure design files, you can build a custom monitor housing that perfectly fits your project's needs.

Explore our GitHub repository for a complete list of compatible screens."

Reuse. Experiment. Create.
"Every kit includes the Glider Mega Adapter, giving you out-of-the-box support for a wide range of e-paper panels. With one adapter set, you can connect displays from 4.3" up to 13.3". The Glider Mega Adapter includes support for the following (which is not a comprehensive list, as some panels are untested but expected to work):

39-pin 0.3mm pitch: Certain 4.3", 5", and 13.3" screens (ED043WC1, ED043WC3, ED050SU3, ES133UTx, ED133UTx, EC133UJ1)
33-pin 0.5mm pitch: Most 9.7" screens (ED097OCx, ED097ODx, ED097TCx)
0.5mm pitch, 7.8"–10.3" screens: (ED078KCx, ED078KHx, EC078KHx, ED080TC1, EC080SC2, ED100UC1, ES103TCx, ED103TCx)
34-pin 0.5mm pitch: Most 6.0" screens (ED060SCF, ED060SCP, ED060XC3/C5/C8/C9/CG/D4/D6/G1/H2, ED060KC1/C4/D1/G1, etc.)
50-pin 0.5mm pitch: Most 11.3" screens (ED113TCx)

With these adapters, anyone interested in working with e-paper has much more flexibility to experiment by reusing e-paper panels from existing devices as well as trying out new ones."

User-Defined Modes & API
"While commercial e-paper products rely on preset driving strategies (text, graphics, video modes) to cope with the technology's limitations, our Developer Kit goes further. It offers full customization so you can tailor the display experience to your specific needs.

For example, the Hybrid Greyscale Mode allows the Caster to switch between a fast binary mode for quick updates and a slower, detailed greyscale mode for refined rendering. This minimizes latency and visual flashing by updating in binary first, then refining in greyscale as the image stabilizes.

With our C API, you gain direct control over screen and mode selection, letting you optimize the display for a wide range of applications. Our broader vision includes developing native e-paper applications and a protocol for seamless mode transitions based on content type."

Manufacturing Plan
"The Modos Developer Kit has passed pre-production revisions and undergone thorough validation and testing. We have established partnerships with contract manufacturers in China, our chosen partner will handle board manufacturing and assembly. The panels are sourced directly from E Ink Corporation. With the Caster completed and the design finalized, we now have a full Bill of Materials (BOM) and supplier quotes in place as we prepare for production. Once the campaign concludes, manufacturing will commence, and we'll keep you updated via campaign emails."

Fulfillment & Logistics
"After our production run is finished, we will package everything and send it to Crowd Supply's fulfillment partner, Mouser Electronics, for distribution to backers worldwide. For more details about Crowd Supply's fulfillment service, please refer to their guide under Ordering, Paying, and Shipping."

Support & Documentation
"The Modos Developer Kit is open hardwayore built using open-source software, with all design files and source code available on GitHub. Our documentation offers extensive information on electrophoretic displays, drawing from both public sources and our original research. This serves as a comprehensive guide for anyone looking to dive deeper into e-paper technology.

For additional support or to join the discussion, please visit Discord and follow us on Mastodon, Bluesky, Matrix, and Twitter."

Thank You to the NLnet Foundation and the NGI Zero Entrust Fund
"Our team would like to acknowledge partial funding for development of Caster from the NGI0 Entrust Fund, a fund established by NLnet with financial support from the European Commission's Next Generation Internet program."

"Modos Paper Monitor is part of AMD FPGA Playground"

**Risks & Challenges (verbatim):**
"The development of the Modos Developer Kit has been ongoing for over a year. Throughout this time, the core functionalities of our display controller board have proven stable, allowing us to focus on refining the hardware design and solving engineering challenges. We are confident in the robustness of our final product.

That said, as with any hardware project, the production process and supply-chain management present inherent risks. To mitigate these risks, we have built strong partnerships with our suppliers and manufacturers. In the event of any setbacks, we are committed to minimizing delays and will keep our backers informed with transparent, timely updates throughout the process."

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source

**Reward tiers (verbatim):**
- 6" Modos Paper Dev Kit: $199 (no cap stated) — "Pre-assembled development kit for the 6-inch version of our low-latency, 1448 x 1072 e-paper display. Includes a screen, a mainboard, a ribbon cable, and a Glider Mega Adapter to support e-paper panels of various sizes. Comes with a USB Type-C cable." | Est. delivery: May 29, 2026
- 13" Modos Paper Dev Kit: $599 (no cap stated) — "Pre-assembled development kit for the 13-inch version of our low-latency, 1600 x 1200 e-paper display. Includes a screen, a mainboard, a ribbon cable, and a Glider Mega Adapter to support e-paper panels of various sizes. Comes with a USB Type-C cable." | Est. delivery: May 29, 2026

**Meta/FB ads (from adlibrary):**
none found in adlibrary

---

### Dasung Not-eReader 7.8" (Indiegogo, 2018)

**Hero headline:** "Not-eReader: First E-ink Mobile-Phone Monitor by DASUNG"
**Subhead / tagline:** "the world's first E Ink mobile-phone monitor and PC monitor"

**Story copy (verbatim, in section order):**

Note: IGG campaign page returned HTTP 404 (deleted). All copy below is sourced verbatim from contemporaneous press coverage (Geeky Gadgets, Liliputing, The eBook Reader, Good e-Reader) citing the live campaign page. Direct campaign body text was not rendered (React SPA, JS-gated) and Wayback Machine was blocked in this environment.

Eye-strain hook (Geeky Gadgets citing campaign copy):
"90 percent of people experience eye discomfort when staring at LCD displays for more than 3 hours."

5-in-1 device pitch (Liliputing citing campaign copy):
"It can be used as an ereader (despite the name suggesting the contrary), a tablet, a video player, a PC monitor, and a mobile phone monitor."

Open Android platform pitch (Geeky Gadgets citing campaign copy):
"ran an open Android platform, allowing users to install standard applications like Twitter and Facebook"

**Risks & Challenges (verbatim):**
"not found in accessible source — IGG page 404; no press coverage quoted verbatim from Risks & Challenges section"

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source — IGG page 404; no press coverage quoted verbatim from FAQ section

**Reward tiers (verbatim):**
Note: IGG page 404; tier copy reconstructed verbatim from contemporaneous press coverage (Liliputing, The eBook Reader, Oct 2018).
- Early Bird: $369 (cap not found) — Dasung Not-eReader 7.8" device; 26% off retail | Est. delivery: March 2019
- Standard Backer: $439 (cap not found) — Dasung Not-eReader 7.8" device; 12% off retail | Est. delivery: March 2019

**Meta/FB ads (from adlibrary):**
none found in adlibrary

---

### EeWrite E-Pad (Kickstarter, 2019)

**Hero headline:** "E-PAD, The E-Ink Android Tablet"
**Subhead / tagline:** "10.3'' Carta Screen, Android 8.0, 4G Network. E-Pad is the best companion for reading, writing, sketching, browsing news and emails."

**Story copy (verbatim, in section order):**

Designed For: Student | Professional | Sketch Artist | Manga Fan | Book Enthusiast | Architect

"No matter how advanced mobile phones become, they still can't compete with plain old paper for reading and handwriting. The E-Pad is an Android Tablet that aims to bridge the gap by offering digital convenience with a truly paper-like experience."

"E-Pad makes note taking and reading a pleasure. It mimics the experience of reading and writing on paper. Jotting down notes, signing papers or making notations on documents is smooth and natural using the included stylus or simply a finger."

"But E-Pad is more than just a powerful notepad and digital reader. It supports Wi-Fi and is also 4G compatible which lets you stay connected virtually anywhere. It is equipped with the advanced Android system, allowing you to download all your favorite apps. And with a 10-core processor, it has low latency and the power to run the latest apps and quickly browse image heavy news and websites."

4G Network | Bluetooth | Android System | 10 Core Processor | Wi-Fi | Dual Touch Control | 32GB + Storage | 10.3'' Carta | Front Light Supported | Video-Play Supported

All Formats Supported | Powerful Reading System | 10.3" Mobius Carta Screen
"E-Pad with a 10.3" Carta screen is perfect for reading any type of document and kinds of literature. E-Ink display reflects light like real paper, letting you read for hours without eyes fatigue."

All Formats Supported | Read without limitation
"E-Pad is designed as the perfect document viewer with full compatibility with all common file formats including: pdf, djvu, epub, mobi, doc, docm, docx, azw, azw3, fb2, fbz, html, odt, prc, rtf, sxw, trc, txt, chm.

It also has support for image and audio formats: jpg, png, bmp, tiff, cbr, cbz, mp3, wav, that are common on news sites, blogs and other websites."

Powerful Reading System | Have your books & marks organized
"When you read with E-Pad, you'll find this reading system is incredibly convenient and make your life more efficient. You can save or screenshot any annotations for capture ideas while on-the-go and search any handwriting notes or typed texts to avoid you got messy in the bulk notes. Besides, allowing you to adjust page arrangement and screen contrast, E-Pad will meet your reading preference."

10.3" Mobius Carta Screen | Bigger screen, Higher resolution
"The Carta display is designed to closely mimic the appearance of real paper, including surface friction when writing. The screen uses the latest E-Ink technology – a based TFT that is flexible, lightweight and durable. This new E-Ink display has incredible high definition and optimum contrast that reflects light like real paper, letting you read for hours without eye strain."

New Writing Experience | Handwriting Search & Store | Sketching Your Brilliant Artwork
"E-Pad gives you an authentic pen-to-paper note-taking experience, the surface tension is similar to real paper and with its convenient digital features it will totally replace your notebooks, printouts, and documents. This groundbreaking device changes how people work."

New Writing Experience | No need for pen and paper anymore
"Enjoy unlimited annotation and document mark-up on any file. You can make notes as easily as a paper notepad. Enjoy the efficiency of instant notes for work, school or creativity."

Handwriting Search & Store | Never lose your idea again
"E-Pad can convert your handwritten note to typed text, making the notes easy to refine and share. No matter whether your notes are diagrams, formulas or simply words, they can be transferred quickly."

"Search, sync and share any notes for your work, study or entertainment, all your files are always handy. All notes can be searched, you will never lose your ideas-including the ones you write down by hand. Everything you put in the third party/PC is automatically synced across your E-Pad."

Sketching Your Brilliant Artwork | Digitalize all your sketches
"E-Pad stylus pen responds to the pressure of your hand precisely, the stroke widens as you press more firmly. It will give you superior control to create very artistic images and text, just like you would on a sheet of paper."

"E-Pad allows you to use various pages formats while you are taking notes, you can even insert an image and polish it."

4G Network, Keep Connected | The world's first E-Ink tablet with 4G connectivity
"Other E-Readers and E-Ink tablets lack support for SIM cards or cellular data, leaving you limited by Wi-Fi only network connections. That makes them impractical for work, travel, or study on the go. With E-Pad, you can enjoy high speed 4G data connectivity and stay connected anytime and anywhere. Your work, study, email or reading can continue as you move from home, to school or office. Simply insert a SIM card and you've got data anywhere. E-Pad is fast, friendly and efficient."

Best Company For Writer | Support Bluetooth keyboard/earbuds/speaker
"If you do any serious business or schoolwork on your phone or tablet, you know that typing on a screen can be a bit frustrating. E-Pad adds convenience and enhanced typing capabilities with support for Bluetooth keyboards. Connect seamlessly and type faster and more comfortably."

Android 8.0 | Allows you to download apps from Google play store
"Using the E-Pad as a tablet is simple through full support of Google's Play framework, including the Google Play store. This means that you can install virtually any Android application. Android system also offers better compatibility for third-party applications. You can download apps according to your personal needs and make E-Pad your personalized tablet!"

Ten-Core Processor with 2GB RAM | Faster running speed
"Push the performance envelope with a powerful 10-core processor and 2 GB of random access memory to handle large documents and memory heavy apps. The speedy processor means that websites and programs load fast and smooth. Enjoy reading, writing, news and surfing with ease on the E-Pad.

When documents get large and more storage is desired, you can easily add up to 32 GB of memory with TF card support. Download and store large books or collections without worry."

More Than 20 Days of Standby Time
"E-Pad is designed for active lifestyles and is made to go anywhere you go. A full battery charge will result in about 1 week of use or 4 weeks of standby time."

Dual Touch Control System
"E-Pad has Dual Touch technology that helps you manage your E-Pad with ease and convenience. Use your finger with capacitive touch for quick notes or sketching or use the included Wacom stylus for writing, document mark-up or detailed drawing. The smooth action of the screen makes writing effortless no matter which method you prefer."

Stylus Pen with Eraser
"The advanced Wacom stylus makes writing simple and precise. Write, draw or sketch and if you make a mistake don't worry, the stylus has an erasure feature built in that works just like a pencil eraser. Simply turn over the stylus and correct your work."

**Risks & Challenges (verbatim):**
"With our years of experience in paper tablet research and development, we are very confident with our process and production schedule for E-Pad.

However, we also know that hidden obstacles and challenges often occur. Because of that, we've made sure to account for some amount of craziness or unforeseen problems that may occur in our schedule. If something does go wrong, we promise to keep our backers updated and communicate with them honestly about any issues and the way in which we are solving them.

Any pledge amount brings us one step closer to our goal. Help us bring this product to life by clicking the 'Back This Project' button at the top of the page, or by helping us spread the word by sharing our page."

**FAQ (verbatim excerpts — key Q&As only):**
not found in accessible source — KS FAQ page returned 403 Forbidden

**Reward tiers (verbatim):**
- $1 Thank you!: $1 (no cap) — "Thanks for the support and love for E-pad! We will include you in the newsletter of our VIP club!" | Est. delivery: Aug 2019
- $5 I was there on day one!: $5 (no cap) — "Let the world know you showed your support right on the first day. If you like, we'd love to include your Name among the pioneers in a special section of our website." | Est. delivery: Aug 2019
- Super Early Bird | E-Pad: $399 (cap: 200, 3 left at capture) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 43% OFF our retail value of $699! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad | Est. delivery: Aug 2019
- Super Early Bird Stylus Pack: $424 (cap: 50, 1 left at capture) — "Get your E-Pads and Stylus with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$15 for one E-Pad Case" — Includes: E-Pad, Stylus | Est. delivery: Aug 2019
- Super Early Bird Combo Pack: $434 (cap: 50, 1 left at capture) — "Get your E-Pads Combo Pack with a great price to experience the paper tablet and no eye strain reading." — Includes: E-Pad, Stylus, E-Pad Case | Est. delivery: Aug 2019
- Early Bird | E-Pad: $449 (cap: 500, 477 left at capture) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 36% OFF our retail value of $699! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad | Est. delivery: Aug 2019
- Early Bird Stylus Pack: $474 (cap: 100, 68 left at capture) — "Get your E-Pad and Stylus with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$15 for one E-Pad Case" — Includes: E-Pad, Stylus | Est. delivery: Aug 2019
- Super Early Bird Upgrade Pack: $479 (cap: 200, sold out at capture) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 4GB RAM + 64GB Storgae Upgrade Pack Now is Coming! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad (4GB RAM+64GB Storage) | Est. delivery: Aug 2019
- Early Bird Combo Pack: $484 (cap: 100, 3 left at capture) — "Get your E-Pad Combo Pack with a great price to experience the paper tablet and no eye strain reading." — Includes: E-Pad, Stylus, E-Pad Case | Est. delivery: Aug 2019
- Kickstarter Special Price | E-Pad: $499 (no cap) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 29% OFF our retail value of $699! We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: E-Pad | Est. delivery: Aug 2019
- [New Reward]-38% OFF E-Pad Special Kit: $499 (no cap, 48-hour flash) — "Get your E-Pad with a great price to experience the paper tablet and no eye strain reading. 38% OFF our retail value of $699! Only Last for 48 HOURS! From April 9 8:00 AM PDT to April 11 8:00 AM PDT. E-Pad Special Kit Including: Upgraded E-Pad*1 Stylus*1 E-Pad Case*1" — Includes: E-Pad (4GB RAM+64GB Storage), Stylus, E-Pad Case | Est. delivery: Aug 2019
- Super Early Bird - E-Pad Duo: $798 (cap: 50, 35 left at capture) — "Get two E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 2x E-Pad | Est. delivery: Aug 2019
- Early Bird - E-Pad Duo: $898 (cap: 100, 99 left at capture) — "Get two E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 2x E-Pad | Est. delivery: Aug 2019
- E-Pad Triple Pack: $1,197 (no cap) — "Get three E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 3x E-Pad | Est. delivery: Aug 2019
- E-Pad Family Pack: $1,995 (no cap) — "Get five E-Pads with a great price to experience the paper tablet and no eye strain reading. We offer affordable accessories, please add on the following extra amount to your pledge: -$29 for one Stylus -$15 for one E-Pad Case" — Includes: 5x E-Pad | Est. delivery: Aug 2019

**Meta/FB ads (from adlibrary):**
none found in adlibrary
