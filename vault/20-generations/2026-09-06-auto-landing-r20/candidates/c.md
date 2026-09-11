# Candidate C — Bundle Builder

**Concept (one line):** A cart-style multi-select bundle builder where adding or removing secondhand items live-recomputes two independent surfaces at once — a stepped bundle-discount curve and a per-item trust-rollup meter — with the current numbers echoed straight into the closing CTA.

**Novelty statement (input × output):** *(input mechanism)* toggling items in/out of a small product catalog via cart-style add/remove chips × *(output shape)* two simultaneously-recomputing visual surfaces — a tiered step-bar "discount curve" (bundle size → % off) and a horizontal trust-rollup meter with an animated per-item score breakdown — both driven by one shared selection state and interpolated live into the CTA copy.

This is distinct from every off-limits mechanic in the brief: no drag slider, no dial/gauge, no tabs+table, no accumulator/qualification wizard, no time-scrubber, no category-gate chain, no ranked drag-reorder. The input is a discrete multi-select (item identity in/out of a set), not a continuous slider or a sequential step-through.

## 브리프에 없던 것

**1. Accent hue**
- ① Had to decide: which single accent hue to use, since violet and amber are both banned as over-represented.
- ② Decided: Tailwind `teal-500` (`#14B8A6`) as the full-strength accent, with `teal-300`/`teal-400` as lighter tints for badges and hover states.
- ③ Why: teal is a "trust/verification" cool hue, distinct from the two banned warm/cool-violet families, and reads as neither a success-green nor a warning color, keeping it purely brand-accent rather than semantic-status.

**2. Accent contrast computation**
- ① Had to decide: whether teal-500 clears the accent contrast rules from the brief (computed against MY hue, not the reference violet).
- ② Decided/measured: `#14B8A6` on bg `#0B0B0F` → relative luminance of accent ≈0.372, bg ≈0.00345 → contrast ≈ **7.89:1** (passes AA even at small text, well above the 4.5:1 floor). White text ON a teal-500 fill → contrast ≈**2.49:1** (fails, unlike the reference violet). Dark ink (`#0B0B0F`) ON teal-500 fill → contrast ≈**7.89:1** (passes even small/non-bold text).
- ③ Why: because teal-500 is a *light-toned* accent (unlike the darker reference violet `#6E56CF`), the fill-contrast rule flips — this is exactly the "verify your own hue, don't assume the reference direction" case the brief calls out. All CTA buttons therefore use dark ink text on the teal fill; all direct-on-background accent text/icons use full-strength teal-500 (or lighter teal-300/400 tints for extra headroom), never white-on-accent.

**3. Body paragraph container widths (0.44em formula, ~70 char target, 75 ceiling)**
- ① Had to decide: exact pixel container widths for each font size used for flowing prose, since `ch` units are explicitly banned.
- ② Decided: 18px hero sub-paragraph → `max-w-[555px]` (555 / (0.44×18) = 555/7.92 ≈ **70.08 chars**). 16px section-intro / closing-CTA / bundle-builder-intro paragraphs → `max-w-[500px]` (500 / (0.44×16) = 500/7.04 ≈ **71.02 chars**).
- ③ Why: both land right at the ~70-char target with margin under the 75-char hard ceiling; a single 555px width was tried first for both sizes but at 16px that yields 555/7.04≈78.9 chars (over ceiling), so the 16px paragraphs got their own narrower `max-w` instead of inheriting the heading wrapper's width.

**4. Testimonial-card text width (exception, documented not overridden)**
- ① Had to decide: whether the testimonial quote (14px / `text-sm`) needed its own `max-w` token too.
- ② Decided: no explicit `max-w` — the real constraint is the 3-up grid column itself. At a 1440px viewport: content area ≈1312px → minus one 32px gap between the 8/4-col split ≈1280px → left (8-col) block ≈853px → minus 2×24px gaps for the 3-card row ≈805px → ÷3 ≈268px per card → minus 40px of `p-5` padding ≈228px of text width → 228/(0.44×14) ≈ **37 chars/line**.
- ③ Why: this is short-line card copy, not long-form prose — the 70-char target is meant for the primary reading paragraphs (hero sub, section intros), so a narrower, grid-driven measure here is intentional rather than a miss. An earlier draft had `max-w-[555px]` on this element, which was dead code (grid column was already narrower); it was removed rather than left in as misleading documentation.

**5. Bundle discount schedule**
- ① Had to decide: the actual discount-per-bundle-size numbers driving the "discount curve" surface, since none were specified.
- ② Decided: `[0, 6, 12, 16, 19, 21]` percent for bundle sizes 1–6 items (diminishing marginal return per added item).
- ③ Why: a visibly non-linear, decelerating curve makes the "more items = better but with diminishing returns" shape legible in a 6-bar step chart, and gives the discount number something to visibly do as the selection changes (flat +6% each step would look identical to a simple multiplier and be less interesting to look at).

**6. Trust-rollup formula**
- ① Had to decide: how to combine match%, condition grade, and verification status into one 0–100 "trust rollup" number per item and across the bundle.
- ② Decided: `contribution = round(match×0.45 + conditionScore×0.35 + (verified ? 100 : 55)×0.20)`, where `conditionScore` maps the letter grade to a 12-point-rubric-style score (A=96, A-=90, B+=84, B=76, B-=68); bundle rollup = arithmetic mean of selected items' contributions.
- ③ Why: weights match-confidence highest (it's the core AI-matching promise), condition second, and treats "verification pending" as a real but non-fatal penalty (55, not 0) rather than disqualifying — keeping every default-selected item's score comfortably legible instead of collapsing to 0 the moment an unverified item is added.

**7. Product catalog / copy / brand**
- ① Had to decide: item names, prices, before/after prices, match-reasoning tags, testimonial copy, and stat numbers — none were given.
- ② Decided: 6 hand-authored secondhand items (sneakers, film camera, lounge chair, watch, bike, bag) each with a fixed price/original-price pair, match %, condition grade and 1–2 short match-reasoning tags in first person ("Matches your saved size 9"); 3 testimonials; 3 top-line stats. Brand name kept as **"repick"** (the project's given name) rather than inventing a new fictional brand, since the assignment already names the product.
- ③ Why: using the real project name avoids fabricating a fictitious company identity for no reason; the catalog numbers were chosen to produce a visibly non-trivial, non-monotonic trust-rollup curve as items are added/removed (e.g. adding the unverified bike measurably drags the rollup down), so the "manipulation = value realized" mechanic has something real to show under interaction, not just a smoothly increasing counter.

**8. Layout numbers**
- ① Had to decide: page max-width, section vertical rhythm, and hero grid split, none specified beyond "≥96px section padding" and "12-col asymmetric grid."
- ② Decided: `max-w-[1400px]` outer container; `py-24` (96px) section padding on desktop (brief's exact floor); hero split `lg:col-span-7` (headline) / `lg:col-span-5` (proof cards); bundle builder split `lg:col-span-5` (toggle list) / `lg:col-span-7` (two output surfaces).
- ③ Why: 1400px keeps line lengths and card grids controlled at 1920px without an extra breakpoint; 96px is the literal floor rather than padding it further, to keep the page information-dense per the "editorial density over pure whitespace" instruction; the 7/5 and 5/7 splits mirror each other (headline gets more room in the hero since it's the type-scale showcase, output surfaces get more room in the value section since two charts need it).
