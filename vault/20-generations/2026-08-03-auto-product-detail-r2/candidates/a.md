# auto-product-detail-r2 / candidate a

**Meridian Exchange — Meridian FE 35mm f/1.4 ASPH** (certified pre-owned camera lens resale marketplace).

**Macro structure**: split comparison layout — two always-visible twin columns, "Certified Pre-Owned" vs. "New, Sealed," rendered side by side at rest (stacked on mobile) as the page's primary structure (not a buried table), sitting below a shared-controls bar that drives both columns at once. Distinct from r1/a (tab strip + buy-box), r1/b (single-column long-form scroll + anchor rail), and r1/c (master-detail config rail).

**Interactions implemented** (6, all information-bearing):
1. Condition grade selector (Mint / Excellent / Good radio pills) — live-recalculates the Certified column's price, cosmetic score/note, accessory list, warranty months, spec-table values, and the illustrated wear marks; also updates the sticky-header price and the savings banner.
2. Care+ protection plan toggle — a genuinely *shared* control: flips price and warranty on **both** columns simultaneously (+$89/certified, +$149/new, +12 months each), demonstrating the "twin columns both live-update from one shared control" requirement literally.
3. Illustration angle toggle (Front element / Mount side) — shared control redrawing both columns' SVG art in sync.
4. "Show differences only" toggle in the spec comparison — filters the two-column `<dl>` spec table to only rows where Certified ≠ New.
5. Spec-group accordion — "Optical & build" opens by default (deepest proof visible without a click); Electronics / In the box / Compatibility expand on demand.
6. Review rating filter (1–5 stars) — narrows the review list and count live.

Price + CTA visible at rest in two places: the sticky header (condensed Certified/New price + primary "Add certified" CTA) and the hero twin-column section (each column has its own live price + full-width CTA).

**Palette**: light theme, adapted from colors.catalog.md "B2B Service" row — navy/slate near-monochrome (`slate-900` text, `slate-50`/white surfaces, `slate-200` borders) + single accent `sky-700` (`#0369A1`) for CTAs, active states, and the "Differs" badges on the Certified side. Accent hue is blue/sky — distinct from the last three rounds' green/orange/teal.

**Display font**: `--font-display-wide` (Archivo Display) on the brand mark and `h1` only; body and all other text stay on default Pretendard (`--font-sans`). No additional font import. Exactly 3 weight classes in the route: `font-normal`, `font-medium`, `font-semibold`.

**a11y note**: the two-column spec comparison intentionally uses **two sibling `<dl>` lists** (Certified, New) instead of one `<dl>` with a nested icon wrapper, keeping every list at `dl > div > (dt, dd)` — the "Differs" marker lives inside `<dt>` — to avoid the axe `definition-list`/`dlitem` bug flagged against `auto-product-detail-r1/c` and `auto-paywall-r1/c` in curation-criteria.

**Build/gate status**: `cd app && npx next build` passes cleanly (Turbopack, TypeScript check included). `node scripts/dash-static-check.mjs` returns `[]` (no violations) on all six route files (`page.tsx`, `product-client.tsx`, `data.ts`, `lens-art.tsx`, `spec-compare.tsx`, `reviews-panel.tsx`). No `Math.random`/`Date.now`/bare `new Date()`, no raw `<img>` (gallery is hand-drawn deterministic SVG, so `next/image` doesn't apply), no emoji, no `font-serif`, no `dark:text-*-500/600`. Not independently verified: Lighthouse a11y ≥95 and the 1280/1366/1440/1600/1920 + 390px overflow sweep (no local runner available in this session) — worth a first pass by the gate before judging.
