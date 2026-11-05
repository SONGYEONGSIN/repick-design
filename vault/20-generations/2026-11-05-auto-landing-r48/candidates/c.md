# r48/c — "Sell-Through Window"

**Concept (one line):** A dual-handle day-range selector reads a fixed 90-day resale-sneaker
dataset — the hero's demand chart, headline "days to sell" stat, trend arrow, every product
card's live sell-through tag, and the closing CTA's sentence all recompute from the exact same
`[start, end]` pair, all the way down the page.

Files: `app/src/app/landing-evolve/r48/c/{page.tsx, Hero.tsx, TimeWindowSelector.tsx,
TrendChart.tsx, ProductCard.tsx, ProductPreview.tsx, ValueSplit.tsx, SocialProof.tsx,
ClosingCTA.tsx, data.ts, tokens.ts, Reveal.tsx, useMounted.ts, usePrefersReducedMotion.ts}`.

## Device mapping (assignment recap)

- **Input**: `TimeWindowSelector` — two real `role="slider"` `<button>`s (not native
  `<input type="range">`, since a single native range input can't host two independent thumbs on
  one track) over a fixed day-index domain 0–89, each with `aria-valuemin/max/now/text`, full
  arrow/Page/Home/End keyboard support, and four preset buttons (7D/14D/30D/90D) that jump both
  handles at once. Minimum enclosed window is 7 days (index gap of 6).
- **Output**: `TrendChart` — an SVG line+area chart of a deterministic "demand index" for Running
  sneakers across the full 90 days, muted; the selected window is drawn a second time in emerald
  through an animated `clipPath` (the `rect`'s `x`/`width` tween with framer-motion on every handle
  move — a real redraw, not a width-only bar). Feeds a headline stat ("X days to sell") plus an
  explicit `TrendingUp`/`TrendingDown`/`Minus` icon + "+N% / down N% vs. the prior window" text, so
  direction is never color-only.

## The live chain (hero → every surface → closing CTA)

`windowStats(start, end)` in `data.ts` is the single source. `page.tsx` computes it once per
render and passes the same object down:
- Hero's chart + stat + 2 compact proof cards' "sells in Xd" line.
- Product Preview's 3 full cards' "sells in Xd" line (same number, re-derived, not hardcoded).
- Value Split's third feature card literally states the current number in prose ("Right now, for
  last 30 days, that's an average of 20.4 days to sell").
- Closing CTA's headline sentence cites `stats.avgDays` and the same trend phrase by name.
No section hardcodes a days-to-sell figure; `CLOSED_SALE` in Social Proof is the one deliberately
historical, window-independent card, and its copy says so explicitly (the documented contrast
case from the brief's "manipulation must stay alive to the CTA" lesson).

Default window on load is **last 30 days** (`DEFAULT_START=60, DEFAULT_END=89`), never an empty
state — avgDays≈20.4, deltaPct≈+15% vs. the prior 30 days, both real derived numbers from the
fixed dataset, not placeholders.

## What wasn't fully specified in the brief — decisions + math

**Accent contrast (emerald, light theme, computed by hand — sRGB→linear→WCAG relative luminance):**
- Background: `#FFFFFF` (true white, not cream — "진짜 라이트").
- `#059669` (emerald-600) on `#FFFFFF`: **3.77:1**. Clears the large-text/non-text floor (3:1)
  but not body AA (4.5:1) — used only for fills, borders, bars/graph strokes, and ≥24px/≥19px-bold
  text (`ACCENT_LARGE_TEXT`/`ACCENT_FILL`/`ACCENT_BORDER`), per the brief's tiering.
- `#047857` (emerald-700) — the small-text/icon/focus-ring derivative. On a light bg the
  dark-theme move ("lighten to a tint") is backwards: lightening only approaches white and *loses*
  contrast. The usable derivation is a **shade**, verified separately: **5.48:1 on `#FFFFFF`** and
  **4.99:1 on `#F4F4F5`** (the card surface) — both clear body-size AA. Used for small text, icons,
  and the `focus-visible:outline` color.
- **Text on the emerald-600 fill** (buttons, match-% chip, CTA pills): computed both ways rather
  than assumed —  white on `#059669` = **3.77:1** (fails body AA, large-text-only), dark ink
  (`#09090B`) on `#059669` = **5.28:1** (clears AA at every size). So every filled-accent surface
  on this page carries **dark ink, not white** — the reverse of this repo's generic default,
  verified per-hue rather than assumed to carry over (mirrors the catalog's documented `r45/c`
  lime precedent that the white-on-fill rule is a starting assumption, not a constant).
- Muted text: `zinc-600` (`#52525B`) — **7.73:1 on `#FFFFFF`**, **7.03:1 on `#F4F4F5`** — one token
  safe on both surfaces used on this page, so no surface-conditional floor switch was needed here.
- Ghost/decorative numerals (≥24px only, `ValueSplit`'s "7–90d"): `zinc-400` fails the 3:1
  large-text floor on white (**2.56:1**) — `zinc-500` (`#71717A`) is the floor that actually clears
  it, at **4.83:1**. Never used below 24px/19px-bold.

**Body-copy width (0.44em rule, not `ch`):** every paragraph's `max-w` was back-solved from
`chars = width ÷ (0.44 × font-size)`, targeting ~65–71 chars (margin under the 75 cap, never
"딱 맞음"):
- 16px body (`max-w-[460px]` subhead, `max-w-[480px]` Value Split intro): 460/(0.44×16)=65.3,
  480/(0.44×16)=68.2.
- 14px captions/descriptions (`max-w-[420px]` in `TrendChart`/`ClosingCTA`): 420/(0.44×14)=68.2.
  (An earlier draft used 460px for these 14px paragraphs — 460/6.16=74.68 chars, inside the cap
  but with almost no margin — tightened to 420px once computed, rather than left at a number that
  merely scraped under 75.)

**Font weights (exactly 3, rendered):** `font-normal` (400) / `font-semibold` (600) /
`font-extrabold` (800) only, no display face (Pretendard/`--font-sans` carries the headline too,
per this round's assignment) — verified by grep for `font-medium|font-bold|font-light|font-thin|
font-black|font-serif|font-display` across every file in the folder: zero matches.

**Interactions (4+ required):** (1) dragging/arrow-keying the start handle, (2) the end handle,
(3) preset buttons as a discrete jump (bonus beyond the minimum), (4) scroll-triggered `Reveal`
fades on Product Preview / Value Split / Social Proof, (5) a product-card disclosure — "Why this
match" toggles the AI match-reasoning text open/closed per card (`aria-expanded`/`aria-controls`,
native `hidden` attribute rather than a second `aria-hidden`, so the two stay in sync by
construction).

**The single `aria-live` region:** lives once, at the bottom of `page.tsx`, `sr-only` (the
*visible* headline stat in the Hero is always-rendered normal text, not itself the live region —
conflating the two would force either a permanently-announcing visible number or a visible stat
that blanks out after 4s, neither of which matches "headline stat stays alive to the CTA"). On a
window change it's filled with a window+stat summary sentence and gets `role="alert"` for 4s
(`ANNOUNCE_MS`), then both the role and the text reset to `""` so a screen reader never re-reads
stale content on an unrelated later update.

**Dataset determinism:** all 90 days are `Array.from({length:90}, (_,i) => ...)` over pure
trig/linear functions of the fixed index `i` (seasonal `Math.sin` + weekly `Math.cos` + linear
drift) — no `Math.random`. Date labels walk backward from one fixed anchor,
`new Date(2026, 10, 1)` (Nov 1, 2026 — an explicit constant, never "today"), using plain
millisecond arithmetic, never `Date.now()` or an argument-less `new Date()`. SVG path coordinates
(`xForIndex`/`yForDemand`) are rounded to 2 decimals before being joined into path strings.

**Images:** fixed `images.unsplash.com/photo-<id>` URLs reused from IDs already present elsewhere
in this catalog (confirmed controlled, non-random content, consistent with `page-brief-core`'s
"fixed photo IDs a person chose" allowance) rather than freshly-guessed IDs, since this sandbox's
own network access to verify a brand-new ID is unreliable.

**Hero fold compactness:** the Hero nests the selector, the chart, and two compact product-proof
cards as literal children of the `Hero` component (not a following section) per the learned
criterion ("증명 카드가 히어로 컴포넌트 자체 안에 있는가"). Paddings/gaps were tightened in a
second pass specifically to reduce total Hero height once the proof row was added; at typical
1280–1920px desktop heights the whole Hero fits with little or no scroll, though the brief's
exact phrasing ("common viewport heights") wasn't tested pixel-for-pixel against a real browser
in this sandbox (build/dev-server runs are out of scope for this task) — nesting is the
mechanically-checkable half of the criterion and is satisfied; the remaining height judgment is a
visual call the orchestrator's screenshot sweep can confirm.
