# Candidate b — Trade Path Simulator

**Concept in one line**: a 2-step branching sell-method decision tree (Sell now / List for best offer / Trade in for credit, each with two sub-options) that lights up the chosen route on a tri-column node-and-tick diagram while a live headline number compounds the exact payout and days-to-cash for the path committed so far — carried by name through the value split and closing CTA.

Files: `app/src/app/landing-evolve/r48/b/{page.tsx, LandingExperience.tsx, Hero.tsx, TreePath.tsx, ListingProof.tsx, ProductThumb.tsx, ProductCard.tsx, ProductPreview.tsx, ValueSplit.tsx, SocialProof.tsx, ClosingCTA.tsx, Reveal.tsx, useMounted.ts, trade-data.ts, trade-math.ts, product-data.ts, tokens.ts}`

## Device mapping (brief → implementation)
- **Input axis**: `TreePath.tsx` renders step 1 (3 buttons: Sell now / List offer / Trade credit, `role="group"`) then step 2 (2 buttons per branch, depending on step 1). Clicking a step-1 node commits that branch and resets step 2 to unset; clicking a step-2 node commits the exact leaf. This is a strict two-level branching single-select, never a slider/toggle-set/ranking.
- **Output axis**: the tree is a real node-and-tick graph (root → 3 step-1 nodes → 6 step-2 nodes, grid-aligned so every tick lines up under its parent without any DOM measurement). Traversed nodes/ticks are `border-blue-500 bg-blue-600/20` + a `Check` icon + bold weight; untraversed nodes stay visible at two dimmer tiers (`available` = the un-committed sibling in the active column, `dim` = the two columns you didn't pick) using **border opacity + font weight + icon**, never color alone. The headline "Estimated payout" + "days to cash" numbers in `Hero.tsx` compound with every click, and the exact same `PathSummary` object is cited by name in `ValueSplit.tsx` and `ClosingCTA.tsx` — the causal chain never forks into a second, hardcoded number.
- Dedup check held: nothing in the catalog is a branching-commit tree with revealed next-step options; this is closest in shape to flow/Sankey diagrams (proportional allocation, not sequential commitment) and duel selectors (single binary pick, no multi-step reveal), which it does not overlap with.

## Accent contrast math (required — blue, assigned this round)
Computed with the standard WCAG relative-luminance formula (node script below), against both page surfaces used on this dark candidate: `BG = #0B0B0F`, `CARD_BG = #15151C`.

| Pairing | vs `#0B0B0F` | vs `#15151C` |
|---|---|---|
| `blue-500 #3B82F6` (text/icon directly on page) | **5.34:1** | **4.94:1** |
| `blue-600 #2563EB` (fill surface, non-text) | 3.80:1 | 3.51:1 |
| `blue-300 #93C5FD` (tint, for small text/icons/focus rings) | **10.89:1** | **10.07:1** |
| white text on `blue-500` fill | 3.68:1 (large-text only — **not used for small text**) | — |
| dark ink `#0B0B0F` text on `blue-500` fill | 5.34:1 | — |
| white text on `blue-600` fill | **5.17:1** (clears small-text AA) | — |
| `zinc-400 #A1A1AA` (muted text) | 7.66:1 | 7.09:1 |
| `#6B6B78` (ghost numerals, ≥24px only) | 3.74:1 | 3.46:1 |

**Decision**: `blue-500` is strong enough to use directly as small text/icon color on either page surface (eyebrows, captions, the accent headline word, link text) — no separate "large-only" tint was needed for that role, unlike the brief's `#6E56CF` baseline. Filled surfaces (buttons, chips, lit tree nodes/bars) use the darker `blue-600` specifically so **white** text on top clears full-size AA (5.17:1) rather than only the large-text floor — this is the one pairing where going one step darker than the "on-page" accent was necessary to make the brief's "white on fill" rule literally true for this hue, since `white` on `blue-500` itself only clears 3.68:1 (large-text only). Small text/icons/focus rings use the `blue-300` tint (10:1+), per the usage-tier rule.

```js
// node script used for every number above
function srgbToLin(c){c/=255;return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4);}
function luminance(hex){hex=hex.replace('#','');const [r,g,b]=[0,2,4].map(i=>parseInt(hex.substring(i,i+2),16));
  return 0.2126*srgbToLin(r)+0.7152*srgbToLin(g)+0.0722*srgbToLin(b);}
function contrast(a,b){const [l1,l2]=[luminance(a),luminance(b)].sort((x,y)=>y-x);return (l1+0.05)/(l2+0.05);}
```

## What wasn't in the brief — self-decisions

1. **Line-length container widths** (required constant: 0.44em average glyph advance, not `ch`). Target ~70 chars, ceiling 75: `chars = container-px / (0.44 × font-size-px)`.
   - 12px → 370px container (370 / (0.44×12) = 70.08 chars) → `max-w-[23.125rem]`
   - 14px → 431px (431 / (0.44×14) = 69.96 chars) → `max-w-[26.9375rem]`
   - 16px → 493px (493 / (0.44×16) = 69.88 chars) → `max-w-[30.8125rem]`
   - 18px → 554px (554 / (0.44×18) = 69.95 chars) → `max-w-[34.625rem]`

2. **Mobile-safe `clamp()` split, `<lg` vs `lg`.** Rather than one tuned formula, every oversized heading (h1 and every h2) uses two explicit clamp declarations — a base one that clamps to a small ceiling well before 375px can overflow, and a separate `lg:` one that only engages at the 1024px breakpoint for the full desktop scale, e.g. the h1: `text-[clamp(2rem,8vw,2.75rem)] lg:text-[clamp(2.75rem,4vw,3.75rem)]`. At 375px, `8vw=30px` clamps to the 32px floor; at 1024px the `lg:` formula's `4vw=41px` clamps to its own 44px floor, so the two formulas hand off without a visible jump.

3. **Branching-tree layout: CSS Grid, not coordinate math.** The tree uses no absolute-position percentage coordinates and no SVG viewBox math at all. Step 1 is a `grid-cols-3` row; step 2 reuses the identical `grid-cols-3` row so its three column cells are guaranteed pixel-aligned under step 1's three nodes by the grid engine itself, not by measurement. Each node's own connecting tick sits in its own column, so there is no cross-column coordinate dependency; the only "fan" lines are short decorative horizontal bars (`left-[16.667%] right-[16.667%]`, `left-[25%] right-[25%]`) local to one already-equal-width grid, never relative to the page. This removed the overflow risk a true SVG/absolute-position tree would have carried at 390px and was the main reason the device could stay inside the Hero component without a measured/ResizeObserver-based layout.

4. **The "path-commits" animation is a scaleY/color tween on each tick, not literal SVG `stroke-dashoffset`.** The brief's phrasing ("e.g. a line-draw/stroke-dashoffset animation") is an example, not a mandate, and the catalog already has a validated precedent for this exact technique (`r47/a/TransitPath.tsx`'s edge-bar `scaleX`). Using `initial={false}` + an `animate` target that changes with state (rather than remounting via `key`) means the tick only tweens when its *own* state actually changes (e.g. available → chosen), never replays on an unrelated re-render, and never ships a stranded `opacity:0` on first paint — the three states it tells apart (chosen/available/dim) differ in height, opacity, *and* color together, and are purely decorative (`aria-hidden`), so they carry no text-contrast obligation.

5. **Live region role-flip, not two regions.** Per the brief's hint, there is exactly one `role="status"/"alert"` region in `TreePath.tsx`. No explicit `aria-live` attribute sits alongside the dynamic `role`, because `role="alert"` already implies assertive live-region semantics on its own — stacking an explicit `aria-live="polite"` next to it would contradict the role it's flipping to. `LandingExperience.tsx` flips the role to `"alert"` for 1200ms after any committed change (`setTimeout`, cleared on unmount and re-armed on the next change) and reverts to `"status"` once the moment passes.

6. **Target-size audit forced explicit `min-h-6`/`min-h-9`/`min-h-10` on every custom interactive element.** Several compact UI patterns copied from the established catalog style (icon+`text-xs` toggle with no vertical padding, nav links with no padding at all) compute to well under the 24px CSS-px floor once the body's real line-height (`normal`, not the 1.6 body-copy value — `globals.css` never sets a blanket `line-height` on `body`) is accounted for. Every button/link in this candidate now carries an explicit `min-h-*` ≥ 24px regardless of its text size, rather than relying on the WCAG spacing-exception loophole.

7. **Badge-row `description` field actually renders.** `trade-data.ts` gives every branch and leaf a `description` beyond its short `label`/`fullLabel` — surfaced as a second line under the "Your path" chip in `TreePath.tsx` — so the richer data isn't dead weight sitting unused in the module.

8. **Sample-listing and product photos reuse only Unsplash photo IDs already present elsewhere in this repo's `landing-evolve` tree** (confirmed via grep before using them), rather than new guessed IDs, given the brief's warning that this sandbox often can't reach unfamiliar external hosts. All five images (hero sample listing + four catalog cards) sit inside a fixed-aspect-ratio, background-reserved frame with badges in a separate row below, never overlaid on the photo.
