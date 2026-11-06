# Candidate a — Live Payout Receipt

**One-line concept:** A vertical, torn-edge itemized ticket that totals a seller's exact net payout — listed price → condition deduction → platform fee → shipping credit → net payout — recalculating every line live as the visitor drags a price slider and taps a condition grade, with that same live net-payout figure carried through to the closing CTA.

Files: `app/src/app/landing-evolve/r45/a/{page,Hero,Receipt,PriceSlider,GradeSelector,ValueSplit,SocialProof,ClosingCTA,Reveal,useMounted,data,tokens}.{tsx,ts}`

## 브리프에 없던 것

Every value below was invented for this candidate; none came from the brief, which only specified the five-line order and the dark/sky-hue/grotesk constraints.

1. **Price range & default**
   - Decided: `MIN_PRICE=15`, `MAX_PRICE=400`, `PRICE_STEP=5`, `DEFAULT_PRICE=85` (all in `data.ts`).
   - Why: arbitrary, chosen to cover repick's apparel/accessory resale catalog (a $15 accessory up to a $400 coat) with a default that lands mid-low so the slider's upward pull is visible on first paint, matching the convention set by the r44/c sibling (`MIN_PRICE`/`MAX_PRICE`/`DEFAULT_PRICE` pattern in its own `data.ts`).

2. **Condition-grade deduction rates**
   - Decided: four grades — Like New −3%, Excellent −8%, Good −15%, Fair −25% (`CONDITION_GRADES` in `data.ts`).
   - Why: arbitrary but ordered to compound realistically (each grade roughly 2–3× the deduction of the one above it), modeling that resale buyers discount visibly-worn goods much more steeply than lightly-worn ones. No external reference; invented for this candidate, documented inline in `data.ts`.

3. **Platform fee rate**
   - Decided: flat `PLATFORM_FEE_RATE = 0.09` (9%), applied to the value *after* the condition deduction, not to the raw listed price.
   - Why: arbitrary but deliberately picked as a "mid-market" number, lower than Poshmark's historical ~20% and above pure cost-pass-through, to support the page's "fairness/transparency" value proposition without the receipt's net payout collapsing too low to feel compelling as a hero number.

4. **Shipping credit**
   - Decided: flat `SHIPPING_CREDIT = $4.50`, independent of price or grade, added back as a `+` line.
   - Why: arbitrary; modeled as a fixed prepaid-label subsidy repick absorbs for every seller, which (a) gives the receipt a genuine fifth line with a `+` sign to pair against the two `−` lines, satisfying the "never convey meaning by color alone" rule via sign/icon, and (b) is explicitly *not* described elsewhere on the page as live/variable, avoiding any contradiction with the liveness doctrine.

5. **Net payout formula**
   - Decided: `netPayout = (listedPrice − conditionDeduction) − platformFee + shippingCredit`, all rounded to the cent via `round2()`.
   - Why: direct arithmetic consequence of the brief's stated line order; rounding at each step (not just the final result) was a judgment call so every intermediate line, not only the total, always displays an exact two-decimal dollar figure.

6. **Body-copy container widths (px, not `ch`)**
   - Formula used throughout, per the brief: `chars-per-line = container-width ÷ (0.44 × font-size-px)`.
   - Decided values:
     - Hero lead paragraph: `text-lg` (18px) → `max-w-[500px]` → 500 ÷ (0.44×18) = 500 ÷ 7.92 ≈ **63.1 chars/line**. (Target ~70, ceiling 75 — kept conservative since this is the first paragraph a visitor reads.)
     - `ValueSplit` intro paragraph & feature-grid body copy: `text-base`/`text-sm` → `max-w-[480px]` and `max-w-[300px]` respectively → 480 ÷ (0.44×16) ≈ **68.2 chars/line**; 300 ÷ (0.44×14) ≈ **48.7 chars/line** (narrower grid-cell copy, intentionally under target rather than over).
     - `SocialProof` testimonial quotes: `text-base` → `max-w-[480px]` ≈ **68.2 chars/line**, same math as above.
     - `GradeSelector` helper line under the hero grade picker: `text-xs` (12px) → `max-w-[320px]` → 320 ÷ (0.44×12) = 320 ÷ 5.28 ≈ **60.6 chars/line**.
   - Why: every container was sized by solving the brief's own formula backward from the 70-char target (staying at or under it, never approaching the 75 ceiling), explicitly avoiding the `ch` unit the brief flags as ~35% too wide for Pretendard.

7. **Accent hue, exact hex values, and computed contrast**
   - Decided hue family: sky/cyan, landed on Tailwind's `sky-*` ramp specifically (`sky-300 #7dd3fc`, `sky-400 #38bdf8`, `sky-700 #0369a1`, `sky-800 #075985`).
   - Computed contrasts (WCAG relative luminance, background `#0B0B0F`, L≈0.00345; white L=1):
     - `sky-400` (`#38bdf8`, L≈0.4401) text directly on `#0B0B0F` → **9.17:1** — used for eyebrows/icons/links/selected-state copy (clears small-text AA with large margin).
     - White text on a `sky-400` fill → **2.14:1** — fails even the 3:1 large-text floor, so `sky-400` is **never** paired with white text; confirmed by hand-computing before writing any component.
     - Dark ink (`#0B0B0F`) text on a `sky-400` fill → **9.17:1** (same luminance pair, reversed) — this is the fill used for the net-payout chip (large, ≥24px, extrabold) and reused for the chip's small (11px) "Net payout" caption. The brief's default is white-for-small-text-on-fill, but white fails outright on `sky-400` (2.14:1); dark ink at 9.17:1 clears both the 3:1 large-text floor *and* the 4.5:1 small-text floor with room to spare, so it was used for both sizes on that one fill rather than switching fills mid-component — a deliberate, documented exception to the "default white" guidance, justified because the chosen alternative is strictly more accessible than the prescribed default would have been had it passed.
     - White text on a `sky-700` fill (`#0369a1`, L≈0.1269) → **5.94:1** — this is the fill used for every CTA button (`ClosingCTA`, header "Price an item"), since those need small white text at AA.
     - `zinc-400` (`#a1a1aa`) text on `#0B0B0F` → **≈7.6:1** — used as the page's one muted/secondary-text color (`MUTED_TEXT`), per the brief's dark-surface floor (zinc-400 or lighter).
   - Why `sky-300` for focus rings: the brief's usage-tier rule calls for a lighter tint (not the full-saturation fill color) on small-scale indicators like a focus ring; `sky-300` was picked as the next step up in luminance from `sky-400` for visible, unambiguous rings against both `#0B0B0F` and the `#14141B` card surface.

8. **Font-weight trio**
   - Decided: exactly `font-normal` (400, all body copy), `font-semibold` (600, labels/captions/buttons/nav), `font-extrabold` (800, headline + every receipt figure and the big net-payout number). `font-bold` (700) and `font-medium` (500) are not used anywhere in any file of this candidate — grepped to confirm after writing all components.
   - Why: three-weight ceiling from the brief; 400/600/800 chosen (skipping 500/700) to keep a visibly wide jump between body and emphasis without needing a fourth step.

9. **Display typeface**
   - Decided: `--font-display-grotesk` (Space Grotesk Display), used only for: the `repick` wordmark, the hero `<h1>`, the `ValueSplit`/`SocialProof` section headings, the giant decorative `9%` ghost numeral, the `PriceSlider`'s live dollar output, the `SocialProof` stat figures, and the receipt's net-payout figure. All other copy (body paragraphs, captions, receipt line labels/amounts) stays on `--font-sans` (Pretendard) — never mixed within one text node.
   - Why: assigned by the task brief directly ("For this candidate use `--font-display-grotesk`").

10. **Dark theme exact hex values**
    - Decided: page background `#0B0B0F`, card/receipt surface `#14141B` (one step lighter, used for the receipt body and feature/testimonial cards), ink/default text `#F5F5F7`.
    - Why: `#0B0B0F` chosen as a near-black with a faint cool bias (matches the "dark is this repo's default" instruction); `#14141B` picked as a small, visually-distinct elevation step (ΔL small enough to read as "paper on a table," not a second brand color) — the exact value is also reused verbatim as the "hole" fill-color reference in the receipt's torn-edge effect, so the scallop's punched circles always resolve to the true page background rather than an approximation.

11. **Receipt line-item order/grouping**
    - Decided: item mini-card (thumbnail, title, grade badge, verified badge) sits above the five itemized lines inside the same receipt card, separated by a dashed rule; the net payout is rendered as a filled `sky-400` chip (not just a bigger text line) directly under the four itemized rows, with its own icon (`Wallet`) — making it unmistakably the loudest, most isolated element in the card.
    - Why: satisfies the brief's "final total must be the biggest, most prominent number" requirement literally (size, weight, color-fill, icon, and isolation via its own colored block) and the hero doctrine's requirement that the listing-card proof (match/condition/verification signals) live inside the same component as the manipulable receipt, not a separate section.

12. **Interaction inventory (4 required, 4 delivered)**
    - Price slider (`PriceSlider`, native `<input type="range">`, drag/keyboard).
    - Condition-grade selector (`GradeSelector`, native radiogroup of 4 options, click/arrow-key).
    - Expandable per-line detail disclosure on the "Condition deduction" row (`Receipt`, a real `<button aria-expanded>` toggling a `grade.detail` sentence — not decorative, not hover-only, independently focusable and labeled).
    - Scroll-triggered reveal (`Reveal.tsx`, Framer Motion `whileInView`, gated by `useReducedMotion()` + `useMounted()` so no element ships with an unresolved `opacity:0` on first paint or for reduced-motion visitors) on the `ValueSplit` and `SocialProof` sections.
    - Why these four specifically: the first two are the brief's named manipulation pair; the third turns one receipt row into a genuine (not decorative) fourth interaction per the brief's own suggestion ("a hover/expand detail on a line item"); the fourth satisfies the landing-structure doctrine's reveal expectation using the exact non-flashing pattern already proven safe in this repo (`r44/c`'s `Reveal`/`useMounted` pair, copied verbatim since it is generic infrastructure, not part of the "depletion curve" concept being avoided).

13. **Liveness-contradiction guard for `SocialProof`**
    - Decided: the three stats (`180K` receipts, `9%` fee, `2 days` to payout) are explicitly captioned "These three figures are historical totals, fixed at publish time — only the receipt in the section above moves when you change the price or the grade," and the two testimonials avoid citing any specific dollar payout figure at all.
    - Why: the brief explicitly forbids a decorative stat implying blanket liveness it doesn't have; rather than omit stats, they were kept but fenced with an explicit, honest disclaimer so the page's own premise (only the receipt moves) is never contradicted.
