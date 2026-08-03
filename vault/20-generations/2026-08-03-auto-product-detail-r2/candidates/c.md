---
tags: [generation, product-detail, auto-product-detail-r2, candidate-c]
---

# auto-product-detail-r2 / c — Ferrous & Oak, No. 4 Chef's Knife

**Product/brand**: Ferrous & Oak, a small hand-forge studio (Vermont) selling a single hand-forged
San-Mai chef's knife, "No. 4," in a batch of 12 per edition. Vertical avoids sneakers / audio
interfaces / industrial actuators (r1) and this round's a/b (camera-lens resale, keyboard
console) — it's a first-party bespoke-craft SKU, not a resale listing.

**Macro structure — story/journal-driven vertical anchored by a corner-pinned floating card**
(distinct from r1's hero-buybox-tabs, long-form-scroll-with-anchor-rail, and rail-as-master-detail,
and from this round's a/b twin-column and console-grid structures):
- A brief **opening spread** (image + title + rating + price + quick-vitals `dl` + primary CTA),
  then the page becomes a **six-chapter forging journal** (`journal.tsx`) running top to bottom as
  the primary content — no tabs, no anchor rail, no side picker rail.
- The **only persistent element** is a corner-pinned floating card (`floating-card.tsx`), fixed at
  `bottom-6 right-6` on desktop (never a full-width sticky header) and collapsing to an edge-pinned
  bottom bar on mobile. The blade-length / handle-wood / edge-finish picker lives **inside the
  card**, not in the content flow — the card is where price actually gets set; every other price on
  the page reads the same computed total.
- Two journal chapters ("The grind," "The handle") end on a line that reads the *live* config
  instead of a fixed sentence, so picking an option changes prose in the story, not only numbers in
  a table — a step beyond the round-1 delta's minimum bar.
- A page-shell gutter (`lg:pr-[352px]`, matching the card's footprint) keeps the content column
  clear of the floating card at 1024–1440px widths instead of letting it overlap text.

**Interactions implemented** (5, all information-bearing):
1. **Blade-length picker** (Compact/Standard/Long, in the floating card) — recalculates price,
   total weight, balance point and the "Blade length" spec row everywhere it appears (hero
   quick-vitals `dl`, floating card, full spec table).
2. **Handle-wood picker** (Walnut/Bog oak/Micarta) — recalculates price and weight, swaps the wood
   swatch, and changes the dynamic closing line of the "Handle" journal chapter.
3. **Edge-finish picker** (Double bevel/Single bevel) — recalculates price and edge angle, and
   changes the dynamic closing line of the "The grind" journal chapter.
4. **Full-specification accordion** (`spec-table.tsx`) — four groups (Blade/Handle/Craft
   record/Care & warranty); "Blade" is pre-opened on load so the deepest proof point never sits
   behind a click.
5. **Review sort** (`reviews.tsx`) — Most helpful / Most recent / Highest rating, genuinely
   reordering the review list.

Price + CTA visible at rest in two places simultaneously: the opening-spread hero (large price +
full-width "Add to cart" button) and the corner-pinned floating card (fixed, always on screen from
first paint, not scroll-triggered).

**Palette**: light theme, adapted from `colors.catalog.md` "Banking / Finance" row (`#0F172A` navy
ink / `#A16207` amber-gold accent), implemented as Tailwind `zinc` neutrals + `amber-700`/`amber-800`
accent (measured ≈5.0:1 on white, clears the 4.5:1 text threshold). Amber/gold reads as forge-ember
and is a fresh hue family versus the last three rounds' green/orange/teal and versus this round's
a/b, which both landed on sky-blue. No dark-mode variants — the page commits fully to one theme
(same approach as the round-1 winner, `r1/b`), so there are no `dark:` classes to audit.

**Display font**: `--font-display-wide` (Archivo Display) on `h1`, the journal's `h2`/`h3` headings
only — body and all other text stay on default Pretendard (`--font-sans`). No additional font
import. Exactly 3 weight classes in the whole route: `font-normal`, `font-medium`, `font-semibold`
(verified by grep across every file in the folder — no `font-bold`/`font-light`/etc.).

**a11y notes**:
- The quick-vitals strip in the hero is a `<dl>` kept flat as `dl > div > (dt, dd)`, with the icon
  placed *inside* `<dt>` and `<dd>` using `pl-[22px]` for visual alignment — the exact pattern that
  avoids the axe `definition-list`/`dlitem` bug logged against `auto-product-detail-r1/c` and
  `auto-paywall-r1/c` in curation-criteria. The deeper full spec sheet sidesteps the risk entirely
  by using semantic `<table>` + `<caption>` + `scope` instead of a second `<dl>`.
- Single `h1`; `h2` for Journal/Specifications/Reviews section headings; `h3` for the six chapter
  titles nested under the Journal `h2` — no level skip. Accordion group labels inside
  `<summary>`/`<button>` use plain `<span>`, not headings, matching the r1/c precedent.
- All pickers are native `<input type="radio">` with `sr-only` + a styled `<label>` wrapper (not
  custom `role="radio"` buttons), so keyboard/AT behavior comes from the browser rather than a
  hand-rolled ARIA widget.
- Every interactive control carries `focus-visible:ring-2` (the shared `FOCUS` constant or
  `has-[:focus-visible]:ring-2` on label wrappers), never a bare `outline-none`.
- Image containers reserve `aspect-[4/5]`/`aspect-[4/3]` + `bg-zinc-100` before load; the
  "Hand-forged · edition of 12 · Vermont, USA" badge sits in its own text row below the hero image,
  never overlaid on the photo.

**Build/gate status**: `cd app && npx next build` (Turbopack) passes cleanly, including TypeScript
— run after `r2/a` and `r2/b` were also present, so the full six-route build (r1 a/b/c + r2 a/b/c)
compiles together with no cross-folder errors. `node scripts/dash-static-check.mjs` on all six route
files returns `[]` (no violations): no `Math.random`/`Date.now`/bare `new Date()`, no raw `<img>`,
no `unoptimized`, no emoji, no `font-serif`, no `dark:text-*-500/600`, no extra font import. Not
independently verified in this session: Lighthouse a11y ≥95 and the 1280/1366/1440/1600/1920 + 390px
overflow sweep (no local runner available here) — the gate should confirm both before judging, along
with the corner-card gutter math at exactly the 1024px `lg` boundary, which was reasoned through but
not screenshot-verified.
