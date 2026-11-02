# Candidate c — repick, "Meet in the Middle"

**Route**: `app/src/app/landing-evolve/r45/c/` (`page.tsx` + `Hero.tsx`, `SavingsSplit.tsx`,
`ValueSplit.tsx`, `SocialProof.tsx`, `ClosingCTA.tsx`, `data.ts`, `tokens.ts`, `Reveal.tsx`,
`useMounted.ts`)

## One-line concept

A real two-panel split screen — "On repick" on the left, "Buying new" on the right — with a
draggable vertical boundary between them; dragging it (or pressing arrow keys while it's focused)
changes one shared assumed resale-discount percent, and both panels' dollar figures, a "Save $X"
badge riding the boundary itself, and the closing CTA's sentence all recompute from that single
number live.

## The device (input → output)

- **Input**: pointer drag on the boundary handle (via `setPointerCapture`, no window-level
  listeners needed), **or** arrow keys (`ArrowLeft/Down` −1, `ArrowRight/Up` +1, Shift+Arrow ±5,
  Home/End to the ends) while it has focus — two independent, equally complete paths to the same
  state, neither a fallback for the other.
- **Output**: one state value, `discount` (15–70, a whole percent), feeding `data.ts`'s pure
  functions (`repickPrice`, `savingsAmount`, `travelForDiscount`) that drive: the repick panel's
  big price + 3 category rows, the new panel's fixed price + the same 3 rows at retail, the
  boundary's own screen position, the "Save $X" badge text riding that boundary, and the closing
  CTA's sentence.
- **Manipulation survives to the CTA**: `ClosingCTA` takes `discount` as a prop straight from
  `page.tsx`'s own `useState`, and computes `repickPrice`/`savingsAmount` itself at render time —
  it is never handed a pre-formatted string, so there is no path for it to drift from whatever the
  divider is currently set to.

## Interactions implemented (4+)

1. **Pointer drag** on the boundary handle (`SavingsSplit.tsx`), tracked via `setPointerCapture`
   so the drag keeps working even once the cursor leaves the handle's own small hit box.
2. **Keyboard** on the same handle (`role="slider"` on a native `<button>`, matching the pattern
   already in this repo at `landing-evolve/r40/b/RangeSweep.tsx`) — a distinct input path, not a
   restatement of the pointer path, with its own `aria-valuemin/max/now/text`.
3. **Scroll-triggered reveal** (`Reveal.tsx`, `useSyncExternalStore`-gated so the server-rendered
   HTML never ships a bare `opacity:0`) on `ValueSplit` and `SocialProof`'s cards.
4. **Reset-to-typical button** — a fourth, independent affordance that jumps `discount` straight
   to `DISCOUNT_DEFAULT` (42), useful once a visitor has dragged somewhere extreme and wants the
   median back without hunting for it by hand.

## Theme / accent

**Dark** (`#0B0B0F` page bg), accent **lime/chartreuse** (`#84CC16`, this round's assigned family
and — per the retroactive scan this file's `tokens.ts` cites from `design-principles.md` — an
underused hue in the catalog).

## 브리프에 없던 것

**1 — accent hex + full contrast table (필수)**

Hand-computed sRGB → linear → relative luminance → WCAG contrast ratio for every pairing this page
actually uses. The headline finding: **lime is bright enough that white text fails on it at every
useful shade**, which is the opposite of this repo's documented default ("small text on a filled
accent defaults to white, verified ≥4.5:1"):

| Color | hex | Relative luminance | White text contrast | Dark-ink (`#0B0B0F`) text contrast |
|---|---|---|---|---|
| lime-500 (chosen fill) | `#84CC16` | 0.4811 | **1.98:1 — fails even the 3:1 large-text floor** | **9.93:1 — passes every size** |
| lime-400 (considered, rejected) | `#A3E635` | 0.6471 | 1.51:1 — fails | 13.04:1 |
| lime-300 (chosen tint) | `#BEF264` | 0.7536 | 1.26:1 — fails | 15.04:1 |

① Decided: `ACCENT_FILL = #84CC16` (lime-500) for every filled surface (CTA button, the "Save $X"
handle badge, the match%/verified chips), **always paired with dark-ink text, never white**.
② Value: dark ink on `#84CC16` = 9.93:1 (computed: L(fill)=0.4811, L(ink)=0.00345, contrast =
(0.4811+0.05)/(0.00345+0.05) = 9.93). White on the same fill = (1+0.05)/(0.4811+0.05) = 1.98:1.
③ Why: tried white first (the repo default), measured it, and it fails outright — not a borderline
case. Walked the lime scale down toward lime-800 looking for a shade where white *would* clear
4.5:1 and never found one below where the hue stops reading as lime at all, so the fix is the text
color, not a darker fill. `ACCENT_TEXT = #BEF264` (lime-300) is used for everything that sits
directly on the dark page background instead (eyebrow labels, icons, the decorative rail, the
focus ring) — not because it needed to be lighter for contrast (lime-500 already clears 9.93:1
directly on `#0B0B0F` too) but to keep the most saturated shade reserved for fills, per this
repo's "full saturation on fills, lighter tint on small non-fill text/icons" convention.
Also computed: `MUTED_TEXT = zinc-400` on `#0B0B0F` = 7.66:1, and on the lime-tinted
`SURFACE_ACCENT` (`#15190F`, an alpha-blend of `#84CC16` at 8% over the page bg) ≈ 7.09–7.5:1 —
both comfortably clear the dark-surface floor (zinc-400 minimum, never 500/600 on a dark surface).
`GHOST_TEXT = zinc-500` on `#0B0B0F` = 4.07:1, used only for the ≥24px decorative numerals in
`ValueSplit`/`SocialProof` (large-text 3:1 floor, not the small-text 4.5:1 line).

**2 — discount range, default, and the panel-direction fix it forced (필수)**

① Decided: `DISCOUNT_MIN = 15`, `DISCOUNT_MAX = 70`, `DISCOUNT_DEFAULT = 42`, arrow-key
`DISCOUNT_STEP = 1` / Shift or Page `DISCOUNT_STEP_LARGE = 5`. ② These exact numbers; the
divider's own visual travel band is a separate, narrower constant (`PANEL_MIN = 30`,
`PANEL_MAX = 70`, i.e. the narrower panel never drops below 30% of the width, so neither side ever
collapses to unreadable). ③ 15–70% brackets what resale actually closes at — 15% for
barely-worn, high-demand pieces, 70% for deep end-of-season markdowns — rather than a round
number chosen for drama; 42% as the default lands close to the catalog-wide median the
`SocialProof` stats cite separately (38%, deliberately *not* identical, so the two numbers can't
be mistaken for the same live figure — see point 5).

The harder problem this forced: a **direction consistency bug** I caught by tracing the geometry
before shipping, not after. The boundary's screen position (`travel`, 30–70% from the left) has to
represent *some* panel's width share, and I first wrote it as the "Buying new" panel's share,
decreasing as discount rises (so the repick side visually wins more space at high discount — the
whole point of the device). But with "Buying new" on the left and that mapping, **dragging the
pointer right decreased the discount**, and worse, the *keyboard* `ArrowRight` (which increases
`discount` by the normal slider convention) moved the handle **left** on screen — pointer and
keyboard disagreed with each other about which way was "more." The fix was not a sign flip in
isolation; it required swapping which panel sits on which side: `On repick` moved to the **left**,
`Buying new` to the **right**, and `travelForDiscount` was rewritten as a direct (non-inverted)
increasing function of discount. Now dragging right, and pressing the right arrow, both increase
`discount` **and** grow the repick panel rightward into view — pointer, keyboard, and the visual
metaphor all agree. `data.ts`'s comment block on `PANEL_MIN`/`PANEL_MAX` documents this explicitly
so a future edit doesn't quietly reintroduce the mismatch by moving the panels back without
re-deriving the formula. `Hero.tsx`'s subhead ("Left is repick. Right is retail.") and one
testimonial in `data.ts` were written to match this final order, not the discarded one.

**3 — body-copy container widths, computed with the 0.44em formula, not `ch` (필수)**

| Location | Container | Font size | Calculation | Chars/line |
|---|---|---|---|---|
| Hero subhead (`Hero.tsx`) | `max-w-[500px]` | 18px (`text-lg`) | 500 ÷ (0.44×18) = 500÷7.92 | 63.1 |
| ValueSplit intro paragraph | `max-w-[480px]` | 16px | 480 ÷ 7.04 | 68.2 |
| SocialProof testimonial quote | `max-w-[460px]` | 16px | 460 ÷ 7.04 | 65.3 |
| ClosingCTA paragraph | `max-w-[430px]` | 14px (`text-sm`) | 430 ÷ 6.16 | 69.8 |

All four land in the 63–70 range, under the 75-char hard ceiling with the margin the brief asks
for (aiming near 70, not flush against it). `ch` was never used. The ClosingCTA paragraph started
at `max-w-[460px]` (74.67 chars — already compliant but closer to the ceiling than I wanted) and
was pulled in to 430px once I noticed the margin was thinner than the other three.

**4 — font-weight trio and the "no display face" choice**

① Decided: exactly three rendered weights — 400 (`font-normal`, all body copy), 600
(`font-semibold`, labels/buttons/card titles/testimonial names), 800 (`font-extrabold`,
headline/big prices/stat numbers/section headings). ② Verified by grep across every file in the
route: only `font-normal`/`font-semibold`/`font-extrabold` appear, nothing else in the weight
family. ③ No `font-bold` (700) or `font-medium` (500) anywhere, and no bare `<strong>`/`<b>`/`<th>`/
`<label>` that would import a UA-default bold outside the tracked set. **No display typeface** —
Pretendard (`--font-sans`, this repo's global default) carries the headline too; the device itself
(the live two-panel split with its own big tabular numbers) is the page's visual anchor, so a
second typeface felt like decoration competing with the mechanism rather than reinforcing it.

**5 — mobile stacking approach**

① Decided: at `sm` and above the two panels sit side-by-side (`flex-row`) with the handle as an
absolutely-positioned overlay (`sm:absolute sm:inset-0`) spanning the full split so its own
bounding-rect math is identical to the outer container's; below `sm` the container becomes
`flex-col`, the two panels stack full-width, and the handle becomes a real 56px-tall flex item
(a horizontal rail) sitting between them in document flow. ② The pointer-math `clientX`
calculation always reads the **outer container's** `getBoundingClientRect()`, never the handle's
own — since the handle's width always equals the container's width in both layouts (full overlay
at `sm+`, full-width rail on mobile), one formula drives both without a breakpoint branch in the
drag logic itself, only in the Tailwind classes. ③ Chose this over squeezing both panels
side-by-side at 390px because the narrower panel at the 30% travel extreme would be ≈107px wide —
enough for a price, not enough for the category rows below it without truncating or shrinking text
past comfortable reading size; stacking keeps every panel at full 358px content width (390 minus
32px margins) at every discount setting.

**6 — catalog content (main item, categories, closed-sale comp, testimonials, stats)**

All invented for this candidate: the hero item is a `$480` "Wool overcoat" from "Aldwych & Rae"
(a fixed `images.unsplash.com/photo-<id>` picked from this repo's own already-verified set, not a
new unvetted URL); three category rows (`Sneakers $180`, `Leather tote $410`, `Raw denim jacket
$210`) recompute from the same `discount` to prove the shared variable drives more than one price;
a single fixed `CLOSED_SALE` comp (`$540 → $289`, sold in 9 days) sits in `SocialProof`, explicitly
captioned "historical and doesn't move with the line above" so it can't be mistaken for a live
figure — the one blanket-liveness trap the brief calls out by name. The `SocialProof` stats
(`38%` avg markdown, `18,400` resales, `9d` median) were deliberately set to **not** equal
`DISCOUNT_DEFAULT` (42%) or any other live figure, so a reader can't mistake a fixed historical
average for something the divider above is currently showing.
