# Candidate B — Category Audit (Marimekko trust breakdown)

A dark, editorial landing page built around a single claim: Repick grades every resale
category against the same three-tier verification bar, and the page lets you check that claim
rather than just state it. The hero sets up the premise with one oversized, left-aligned
headline ("No category grades on a curve") and a single CTA into the audit; a real Seamaster
dive watch sits beside it as live product proof (match %, grade, Verified Pro badge, before/after
price), so the proof is visible without scrolling. The product-preview section shows three more
real listings — sneaker, bag, camera — spanning all three trust tiers on purpose, including one
"New Seller" item, because an audit that only ever shows Verified Pro isn't an audit. The
centerpiece is the mosaic device itself: a category selector that doubles as an always-visible
Marimekko row (every category's true share of inventory as column width, its true Pro/ID/New mix
as stacked height, all five visible for comparison at once) sitting above a zoomed detail column
for whichever category is selected, with a disclosure-toggled table giving the exact numbers for
every category side by side. The closing section and its CTA read directly off the same selection
state, so the page's last line changes with whatever you last clicked, instead of freezing on a
generic number.

## 브리프에 없던 것

**1. Accent hue + both contrast calculations (mandatory).**
What I had to decide: the brief sets a default accent (`#6E56CF`) but explicitly allows any hue,
on the condition that I compute its contrast against white and against the dark ink color myself,
and recommends a Tailwind-named color over an arbitrary hex for catalog diversity.
What I decided: **teal**, specifically Tailwind's `teal-600` (`#0D9488`) as the base accent used
for CTA fills, borders and focus rings, with the *same hue family* modulated by lightness across
the three trust tiers (`teal-700` Verified Pro, `teal-400` ID-Verified, `teal-200` New Seller) —
the "default safe" dual-axis approach the brief describes, where one hue encodes trust-tier rank
by lightness rather than introducing an unrelated second color.
- `teal-600` (`#0D9488`) vs white (`#FFFFFF`): **3.74:1** — clears the large-text/non-text 3:1
  floor, not body-text AA. Used for button/chip fills and borders, never for small text on white.
- `teal-600` vs dark ink (`#0B0B0F`): **5.25:1** — clears body-text AA on the dark page background,
  so small accent-colored text/icons sitting directly on the page (not on a fill) are safe.
- Small-text-on-accent-fill case: dark ink (`#0B0B0F`) text on a `teal-600` fill measures **5.25:1**
  (same ratio, since contrast is symmetric in luminance) — comfortably clears 4.5:1, so every CTA
  button in this build uses dark-ink text on the teal fill rather than white, inverting the brief's
  own violet worked example (there, white-on-fill cleared small text and dark-ink-on-fill only
  cleared large text; here teal is light enough that it is the reverse).
- Tint for small text/icons/focus rings on the dark page: `teal-300` (`#5EEAD4`) vs dark ink =
  **13.28:1**.
- The three tier fills, each checked with the text color actually used on it: `teal-700` vs white
  text = **5.47:1**; `teal-400` vs dark-ink text = **10.56:1**; `teal-200` vs dark-ink text =
  **15.6:1**. All three clear body AA, which is why every in-chart tier label (shown whenever a
  band is tall enough to hold one) uses whichever of white/dark-ink the math above calls for,
  never a fixed color per band.
Why: teal is on the brief's own diversity list and is a Tailwind-named scale (not an arbitrary
hex), and a single hue modulated by lightness lets the mosaic's two data axes (width = volume
share, height = tier mix) stay encoded without reaching for a second, unrelated hue that would
need its own justification.

**2. Fixed data: five categories, their inventory shares and tier mixes.**
What I had to decide: the brief names the device and the tier *names* as examples but no numbers.
What I decided: Sneakers (32,400 listings / 32.4%), Bags (24,800 / 24.8%), Outerwear (18,200 /
18.2%), Electronics (15,000 / 15.0%) and Watches (9,600 / 9.6%) summing to exactly 100,000 total
listings; each category's Verified Pro / ID-Verified / New Seller split is its own fixed triple
summing to 100 (e.g. Watches: 71/24/5 — the strictest mix, reflecting that high-value items get
authenticated more aggressively; Bags: 52/33/15; Sneakers: 38/41/21; Outerwear: 29/47/24;
Electronics: 44/38/18). All per-tier listing counts (e.g. Watches Pro = 6,816) are volume × share
÷ 100, computed once and hard-coded as literals — plain arithmetic, no runtime randomness.
Why: the numbers needed to (a) sum cleanly so the mosaic's geometry is exact, not rounded-looking,
and (b) tell a believable story — watches as the strictest category, electronics and outerwear as
the least consolidated — so the "audit" framing has something real to say per category instead of
flat, interchangeable splits.

**3. Width-scale reference (40%) for the detail column.**
What I had to decide: the brief says the selected category's column width must equal its share of
total inventory, but a share-of-100% mapping would make even the largest category's bar look like
less than a third of the available track, every time, with no sense of ceiling.
What I decided: a fixed reference scale of 0–40%, so Sneakers (32.4%, the real maximum) renders at
81% of the track width instead of 32%, and the scale itself is drawn underneath with tick labels
(0/10/20/30/40%) so the mapping is legible and auditable rather than an arbitrary stretch.
Why: 40 is a constant, not derived from "whichever category is currently winning," so the column's
width is comparable across every selection instead of one category always being the implicit
100% baseline that happens to be whoever you clicked last.

**4. Theme, type and layout commitments the brief left open.**
What I had to decide: dark vs. light; which (if any) of the three allow-listed display faces;
Pretendard vs. Inter for body/headings, given the brief's generic typography section assumes Inter.
What I decided: dark (`#0B0B0F` background) as the committed structural default; `--font-display-
grotesk` (Space Grotesk) for the hero `<h1>` only; Pretendard (`--font-sans`) for every other
heading and all body copy, at exactly three rendered weights — 400, 600, 700 — instead of the
brief's literal "Inter 400/700-800."
Why: the repo's own `AGENTS.md`/`globals.css` house rule hard-bans loading any font besides
Pretendard and the three pre-declared display faces (a static gate enforces `no-next-font`), so
Inter was never actually available; Pretendard at 400/600/700 is the closest compliant equivalent
to the brief's weight intent without violating the repo's own constraint. Grotesk (not mono or
wide) was picked for the display face specifically to diversify away from the catalog's last two
winners, which the brief's own diversity note flagged as mono/wide-heavy.

**5. Mobile fallback for the Marimekko selector row.**
What I had to decide: true variable-width Marimekko columns break down at 390px — the narrowest
category (Watches, 9.6% of row width) would render under 35px wide, too small for a legible label
or a reliable tap target.
What I decided: two parallel markups toggled by breakpoint (`hidden sm:flex` / `flex sm:hidden`) —
the true side-by-side Marimekko row at ≥640px, and a full-width list of rows with an inline
proportional bar (scaled against the same 40% reference as the detail chart) below that, so mobile
keeps real tap targets and legible labels while the bar length still encodes the real share.
Why: the brief requires ≥16px margins and real width robustness down to 390px; distorting the
narrow columns to an artificial minimum width would misrepresent the data, so changing the layout
strategy (not the data) at the breakpoint was the more honest fix. Elements hidden via `display:
none` are removed from the accessibility tree, so this does not create duplicate tab stops at
either width.
