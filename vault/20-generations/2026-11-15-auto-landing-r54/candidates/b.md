# Candidate b — repick: Price Window

A dark-zinc, indigo-accent repick landing for a Sony a7 III resale listing: a draggable,
resizable brush sits over 24 real months of aggregate resale price, and as it moves or resizes,
three cards (Before / Inside / After the window) and a one-sentence headline recompute live from
the exact slice selected, while every point outside the window dims — never disappears — on the
line chart beside it; the same `headlineMetric(data, window)` call (and its rendered sentence)
runs again, unmodified, in the closing CTA, so the number quoted there is always whatever the
reader last set, never a separate hardcoded figure. Interactions: the brush itself (pointer drag
on the window body and on each resize handle, full keyboard equivalent — arrow keys move it,
Shift+arrow resizes it, Home/End jump to the ends), four one-click range presets, a per-card
"View match reasoning" expand toggle on the product grid, and scroll-triggered reveals on every
section below the hero. Theme: zinc-950/900 dark, committed fully. Accent: a single indigo
family, split by role not by data axis — indigo-600 fill only where white text sits on top (AA
6.29:1), indigo-400 for every other accent use (text/icons/chart marks/focus ring, 6.67:1 on the
page background). Line-length: 16px prose capped at `max-w-[500px]` (500/(0.44×16) = 71.02 chars)
and 14px card/quote prose capped separately at `max-w-[430px]` (430/(0.44×14) = 69.81 chars) —
two widths, not one, because this route's card grids are `grid-cols-1` up to their own breakpoint
and a single width tuned for 16px would overrun the ceiling on 14px text in that single-column
range. Pretendard only, no display face, exactly 3 rendered weights (400/600/800) site-wide.

## 브리프에 없던 것

1. **How "arrow keys move, Shift+arrow resizes" maps onto a two-handle control.** The brief
   describes one keyboard behavior but a brush window has two edges. Decided on a single
   `role="slider"` div representing the whole window (not two separate sliders, one per handle):
   plain arrow keys translate both edges together (move), Shift+arrow moves only the trailing
   edge (resize), Home/End snap to the dataset's ends. `aria-valuenow` reports the start index and
   `aria-valuetext` carries the full human-readable range + month count, since most screen readers
   prefer valuetext over the raw number for a control this far from a plain range input. Chose this
   over two independent sliders because the brief's own wording ("focus it and use the arrow
   keys") reads as one focusable thing, not two.

2. **Accent contrast math, computed by hand (sRGB → linear → relative luminance).**
   `L(zinc-950)=0.00278`, `L(indigo-600 #4F46E5)=0.1171`, `L(indigo-400 #818CF8)=0.3019`,
   `L(white)=1.0`. White text on indigo-600 fill: (1.0+0.05)/(0.1171+0.05) = **6.29:1** — clears
   body-text AA, so indigo-600 is used only for solid fills carrying white text (buttons, the
   active preset chip, match-% badge). I tried indigo-500 (`#6366F1`, `L=0.18506`) first since it
   reads brighter on a near-black page, but white-on-#6366F1 comes out to (1.05)/(0.18506+0.05) =
   **4.47:1** — just under the 4.5 body-text floor — so it was rejected and indigo-600 kept
   instead. Indigo-400 as plain accent text/icon/chart-mark/ring color on zinc-950:
   (0.3019+0.05)/(0.00278+0.05) = **6.67:1**; on the zinc-900 card surface: **5.94:1**. zinc-400
   muted text on zinc-950 (the dark-theme floor, never 500/600): (0.3595+0.05)/(0.00278+0.05) =
   **7.76:1**. All four numbers are in `tokens.ts`'s header comment, not just here.

3. **Line-length math, and why it needed two widths instead of one.** 16px prose:
   500 / (0.44×16) = 71.02 chars (under the 75 ceiling). The value-triptych cards and testimonial
   quotes are set at 14px for hierarchy, inside grids that stay `grid-cols-1` up to `lg`/`sm`
   respectively — at viewport widths just under that breakpoint the single column gets wide enough
   that reusing the 500px/16px width on 14px text would push well past 75 chars/line (measured it
   out: an unconstrained 14px paragraph in that column range runs to 85–150 chars/line depending on
   exact width, even though the four widths the gate actually sweeps — 390/1280/1440/1920 — all
   happen to land on the safe side of that particular gap). Computed a second, narrower width for
   that font size instead of trusting the grid or the sweep's specific test points to mask it:
   430 / (0.44×14) = 69.81 chars. Both are named constants in `tokens.ts` (`PROSE_WIDTH`,
   `PROSE_WIDTH_SM`) rather than one-off literals, so nothing in `Client.tsx` guesses at a width.

4. **Which "before/after" the closing CTA's badge means.** The brief's badge list says
   "before/after discount %" per card — read as *discount off the original retail price*, not a
   reference to the brush's own before/after window segments (those are a page-level device
   state, not a per-card static fact). Each listing stores its own `originalPrice`; the badge reads
   `discountPct(price, originalPrice)`. Kept the two "before/after" ideas (the card's discount
   framing vs. the brush's window framing) deliberately separate in the copy so a reader isn't
   left wondering whether the 23%-off chip on the a7 III card has anything to do with the chart
   above it tracking the same listing — it doesn't; it's unrelated data answering a different
   question.

5. **Photo sourcing without live internet access.** This session's outbound network is
   gateway-denied for arbitrary hosts, so none of this candidate's Unsplash photo ids could be
   fetched and checked directly. Resolved it by reusing three ids already present, and reused
   repeatedly, elsewhere in this exact catalog for the same subjects (`landing-evolve/r49/a/data.ts`
   has the identical Sony a7 IV / Fujifilm X-T4 / Leica M6 ids with matching alt text), rather than
   guessing new ones that might 404.
