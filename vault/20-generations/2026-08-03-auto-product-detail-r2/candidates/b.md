---
tags: [generation, product-detail, auto-product-detail-r2, candidate-b]
---

# auto-product-detail-r2 / b — Anvil TKL-75 (Anvil Type Co.)

**Product/brand**: Anvil Type Co., a certified-refurbished marketplace for mechanical keyboards.
SKU: **Anvil TKL-75** — a 75% hot-swap mechanical keyboard sold across three resale condition
grades. Vertical deliberately avoids sneakers / audio interfaces / industrial actuators (r1's three
archetypes) while still landing on repick's resale-marketplace DNA via the condition-grade system.

**Macro structure — "console" / control-center model** (distinct from r1's hero-buybox-tabs,
long-form-scroll, and rail-as-master-detail, and from this round's other candidates):
- A **sticky app-toolbar** (`sticky-toolbar.tsx`), pinned from page load, not a header that appears
  on scroll — compact brand mark, live config badge, stock count, price, Add-to-cart.
- A **hero** below it (not sticky) with full-size title, rating, price, and primary CTA — the
  hero and the toolbar are the two simultaneous at-rest exposures of price + CTA the round-1 delta
  requires.
- Below the hero, a **grid of six simultaneously-visible panel cards** (`lg:grid-cols-12`,
  collapsing to a single stacked column under `lg:`): Configure (grade + switch pickers),
  Feel & sound (live meters), Fulfillment (stock/warranty/ship estimate), Specifications
  (accordion of `<dl>` groups), Compatibility & bundle (add-ons + running order total), Reviews
  (rating distribution + filterable list). No tabs, no single vertical narrative, no picker-as-rail
  — every panel is on-screen at once on desktop with nothing behind a click to reach it.

**Interactions implemented** (6, all information-bearing):
1. **Condition-grade picker** (`config-panel.tsx`) — recalculates price, warranty length, ship
   estimate and stock count in the Fulfillment panel, the spec sheet's "Condition & fulfillment"
   group, and both hero/toolbar prices.
2. **Switch picker** (`config-panel.tsx`) — recalculates price delta, actuation-force/sound-level/
   travel meters in the Feel & Sound panel, the "Switches & feel" spec group, and the keyboard
   illustration's accent-key color — all from one shared `switchId` state.
3. **Bundle add-on checkboxes** (`compatibility-panel.tsx`) — independently move the same running
   order total shown in the hero, toolbar and compatibility panel's own summary.
4. **Spec accordion** (`spec-panel.tsx`) — "Switches & feel" (the deepest, most measured proof
   point) is pre-opened on mount and reads live from the switch selection; the other three groups
   are click-to-expand.
5. **Review star-rating filter** (`reviews-panel.tsx`) — a real, list-narrowing filter with an
   `aria-live` count readout.
6. **Grade → reviews cross-reference readout** (`reviews-panel.tsx`) — a non-destructive line
   ("N of M reviews are from Grade B buyers") that recomputes from the grade selected in the
   Configure panel without ever hiding a review, demonstrating cross-panel propagation beyond price.

**Palette**: light theme, `colors.catalog.md` "B2B Service" row (`#0F172A` navy primary /
`#0369A1` sky-blue accent / `#F8FAFC` background / `#FFFFFF` cards / `#E2E8F0` border), implemented
directly as Tailwind's `slate` neutral scale + `sky` accent. Hue family (blue/sky) is new relative
to the last three rounds' green/orange/teal accents. Muted text stays at `slate-600` everywhere
(never dips to 500) so the single rule covers both pure-white and `slate-50`/`slate-100` surfaces.

**Display font**: `--font-display-wide` (Archivo Display) on the h1 only — no other Latin display
override, no new font import. Body and all other text stay on Pretendard (`--font-sans`). **Exactly
3 font-weight classes in the route**: `font-normal`, `font-medium`, `font-semibold` (verified by
grep across all files in the folder — no `font-bold`/`font-light`/etc. anywhere).

**Hard-gate self-check**:
- No `Math.random(`, `Date.now(`, or bare `new Date()` — reviews/dates are fixed display strings.
- No raw `<img>` — the product illustration (`keyboard-art.tsx`) is inline SVG built from rects, no
  remote image dependency at all; image container still reserves a fixed `aspect-[4/3]` +
  `bg-slate-100` regardless.
- No emoji — lucide-react icons only (checked with a Unicode-range script, zero hits).
- English-only copy.
- Spec `<dl>` keeps the flat `dl > div > (dt, dd)` structure with icons placed on the *section
  header* `<button>`, never inside the `<dl>` itself — the exact fix for the round-1
  `definition-list`/`dlitem` regression logged in `curation-criteria.md`.
- Single `h1`; every panel section header is `h2`; the spec accordion's per-group headers are `h3`
  nested under the "Specifications" `h2` — no level skip anywhere.
- All interactive controls carry `focus-visible` rings (`FOCUS` constant or
  `has-[:focus-visible]:ring-2`), never a bare `outline-none`.
- Low-stock and other state changes pair an icon (`TriangleAlert`) with text, never color alone.
- Verified: `npx eslint` on this folder is clean (0 errors/warnings) and an isolated `tsc --noEmit`
  scoped to this folder's files type-checks cleanly.

**Uncertain / worth a second look**: a sibling folder (`r2/c`) already existed in the tree with a
pre-existing TypeScript error (`useEffe` typo) that fails the whole-project `next build` — that
folder was not touched per the "self folder only" instruction, so this candidate's build status
could not be confirmed via a full `next build` run; it was instead verified via a scoped `tsc
--noEmit` against an isolated tsconfig covering only this folder's files, which passed with zero
errors, plus a clean scoped `eslint` run.
