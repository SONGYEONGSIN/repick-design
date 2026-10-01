# Candidate c — The Match Constellation

One line: a hand-built SVG constellation graph in the hero itself, connecting 4 buyer-need nodes
(Budget, Condition, Brand, Ships fast) to 6 graded streetwear/footwear listings across 12 weighted
edges — clicking a need re-emphasizes its matching listings with always-legible match%/grade/
reason text, clicking a connected listing switches which of that need's matches is detailed, and
the same live pair drives an always-visible sortable fallback table plus the closing CTA's
sentence — on a dark near-black page with a lime/chartreuse accent and a grotesk display face.

Route: `app/src/app/landing-evolve/r29/c/` — `page.tsx`, `client.tsx`, `hero.tsx`,
`constellation-graph.tsx`, `match-detail.tsx`, `match-table.tsx`, `listing-card.tsx`, `data.ts`,
`ui.tsx`.

## The 4 interactions (required minimum for `landing`)

1. **Click/focus a need node** (`constellation-graph.tsx`, 4 SVG circles, `role="button"`,
   `tabIndex=0`, real keyboard support via `onKeyDown` for Enter/Space since SVG shapes don't get
   native click-on-Enter). Re-highlights that need's 3 edges (brighter stroke + numeric % label),
   dims the other 9, auto-selects that need's single strongest edge as the new focused product, and
   updates `match-detail.tsx`'s full text readout (match %, condition grade, verified badge,
   discount, reason) plus the hero's `listing-card.tsx` and the closing CTA sentence.
2. **Click/focus a connected product node, or its row in `match-detail.tsx`'s "Also matched on…"
   list** — switches which of the *active need's* 2–3 matches is the detailed one, without changing
   the active need. The graph's selected edge redraws brightest/thickest with a bold % label; the
   match-detail panel's product name, %, grade, and reason all update to the new pair.
3. **Category filter chips** (`client.tsx`, product-preview section) — All / Footwear / Outerwear /
   Accessories, `role="group"`, `aria-pressed` per chip, filters the 6-card listing grid.
4. **Sortable fallback table** (`match-table.tsx`) — a `<button>` in the "Match %" `<th>` toggles
   ascending/descending over all 12 edges, with a correct `aria-sort` on the header cell. Each row's
   Need cell is also a button (`onSelectPair`) that jumps the whole page's live state straight to
   that exact need/listing pair — a third, always-visible path into the same state the graph exposes.

Rest-state baseline (never hover-only): default `activeNeedId = "condition"`,
`activeProductId = "jordan-1"` — Condition → Air Jordan 1 "Chicago" at **97%**, the single strongest
edge across the whole dataset, so the page opens already showing one listing's full match data as
legible text (`match-detail.tsx`), not waiting for a click.

## Accent + contrast (required arithmetic)

Background `#0B0B0F` (near-black, as assigned). Accent: lime/chartreuse family, two shades used
with distinct, deliberate roles — both computed with the standard WCAG relative-luminance formula,
not eyeballed:

- **`#65A30D` (ACCENT_BASE)** vs `#0B0B0F`: **6.36:1**. Used for small accent text/icons/borders
  directly on the page background (eyebrows, badge icons, inactive-need-edge-adjacent accents,
  table "Match %" column) — clears the small-text 4.5:1 floor with real margin, not borderline.
- **`#A3E635` (ACCENT_BRIGHT)** vs `#0B0B0F`: **13.03:1**. Used for the *active* graph edge/node,
  the focus ring (`FOCUS` constant, every interactive element incl. SVG nodes), and lime-filled
  buttons/chips. Comfortably clears both the 3:1 non-text floor and 4.5:1 small-text floor.
- **Small text on a filled lime background — checked both ways, white rejected**:
  `#FFFFFF` on `#65A30D` fill = **3.09:1** (fails small-text AA; lime-600 is bright enough that
  white-on-it is too-light-on-light, exactly the case the brief flagged). `#18181B` (dark ink) on
  `#65A30D` = **5.73:1**, and `#18181B` on `#A3E635` = **11.75:1** — both pass. Every lime fill on
  this page (primary CTA, active chips, active badges, the skip-link's revealed state) uses dark
  ink text, never white.
- **`#71717A` (zinc-500)** vs `#0B0B0F`: **4.07:1** — used *only* for two non-text/large-text
  contexts that were individually checked: (a) the SVG graph's inactive-edge strokes (non-text,
  needs only 3:1), and (b) the `SectionFolio` ghost numerals, sized ≥24px so they qualify as
  large text (3:1 floor). zinc-600 (**2.54:1**) and zinc-700 (**1.88:1**) were also computed and
  both fail even the 3:1 floor — confirms zinc-500 is the dimmest gray this page can use anywhere,
  and it is never used for small/body text (every real small-text instance, e.g. strikethrough
  original prices, uses zinc-400 instead, below).
- **`#A1A1AA` (zinc-400)** vs `#0B0B0F`: **7.67:1** — the floor for every other secondary/caption/
  strikethrough text on the page (footer tagline, card brand/category line, strikethrough original
  prices, table "why" column, SVG's own non-connected product name labels).
- **`#D4D4D8` (zinc-300)** vs `#0B0B0F`: **13.29:1** — primary body copy (`BODY_16`/`BODY_14`),
  clears the 4.5:1 body floor by a wide margin.
- Panel surfaces (`#131318`, used on cards/CTA) are close enough in luminance to `#0B0B0F`
  (L=0.0067 vs 0.0035) that every ratio above only drops slightly against it (e.g. ACCENT_BASE
  5.99:1, zinc-400 ~7.2:1) — rechecked, still clears every floor.

## Body-width character math (exact constant, not guessed)

Formula: `chars_per_line = container_px ÷ (0.44 × font_px)`, target ~70 chars.

- 16px body (hero subhead, section intros, value/CTA live-state sentences):
  `70 × 0.44 × 16 = 492.8 ≈ 493px` → `max-w-[493px]` (`BODY_16` in `ui.tsx`).
- 14px (testimonial quotes, match-detail reasoning line): `70 × 0.44 × 14 = 431.2 ≈ 431px` →
  `max-w-[431px]` (`BODY_14`).
- 12px (listing-card "why this match" line): `70 × 0.44 × 12 = 369.6 ≈ 370px` → `max-w-[370px]`
  (`BODY_12`).
- Table "Why this match" column: not capped with a max-w, checked instead — at desktop it's a 32%
  column inside a ~1144px inner container (≈366px), at 13px that's `366 ÷ (0.44 × 13) ≈ 64` chars,
  under the 75-char ceiling without an override; at mobile the same % column is narrower and the
  cell text simply wraps across more lines (table-fixed + colgroup % widths, never `min-width`, so
  it never forces horizontal overflow).

## Font / weight audit

Display face: `--font-display-grotesk` (Space Grotesk Display), Latin headings only. Its `@font-face`
in `globals.css` declares a **300–700** variable weight axis — so headings use `font-bold` (700,
the font's true max) instead of `font-extrabold` (800, which this specific face can't render; using
it would still pass a gate that reads the CSS `font-weight` property literally, but would silently
clip to 700 in the browser, so the honest choice is to declare 700). Rendered weights, counted
across all HTML (SVG text is illustration, not typographic hierarchy, per this repo's own weights
note, and isn't counted):

- **400** (`font-normal`, inherited default) — all body copy, captions, table cells, card meta.
- **600** (`font-semibold`) — eyebrows, buttons, chips/badges, table headers (`<th>` explicitly
  overridden off the browser's UA-bold default), "Why this match:" lead-ins, nav links' active
  states.
- **700** (`font-bold`) — `h1`/`h2`, `SectionFolio` ghost numerals, stat/price display figures,
  `match-detail.tsx`'s product-name line.

Exactly 3. Grepped the whole route for every `font-*` weight utility to confirm no stray 4th
(`font-extrabold`/`font-medium`/etc. only ever appear inside explanatory comments, never as an
actual class).

## Completeness vs. Linear/Stripe/Vercel-level landing pages

- **Present**: persistent sticky header w/ wordmark, nav, secondary CTA; asymmetric hero with
  oversized `clamp()` headline + single CTA + proof (graph, match-detail, listing card) all inside
  the hero component; product grid with real badges (grade/verification/discount/best-match);
  social proof (stats + 3 testimonials); closing CTA bound to live state; footer w/ nav + tagline;
  skip link; full keyboard path incl. inside the SVG; mount-gated `whileInView` reveals;
  `prefers-reduced-motion` respected everywhere a reveal exists.
- **Gaps vs. a fully production Stripe/Linear-tier page**: no real responsive nav drawer for mobile
  (nav links are simply hidden under `sm:flex`, with no hamburger/menu replacement — acceptable for
  a 3-link nav at this scope but a real product would want one); no dark/light theme toggle (this
  candidate commits to one dark theme per its assignment); no loading/error states for the (static,
  fixed) data; no multi-page routing (pricing/about/docs) since this is a single landing route; no
  real form/email-capture on the CTA (anchors back to the graph instead, matching the duplicate-
  avoidance note against generic "create free account" CTA copy).

## Brief gaps (what the brief left open, and the judgment call made)

1. **Exact node/edge count** — 4 need nodes × 6 product nodes, 12 edges (3 per need, 2 per product
   on average; every product has ≥1 edge, none has >2). Chosen to keep the graph dense enough to
   feel like a real network (not a trivial 1:1 mapping) while keeping every need's 3-way comparison
   legible in both the SVG and the fallback table without scrolling a huge list.
2. **Exact default-focused pair** — `condition` → `jordan-1` (Air Jordan 1 Retro High "Chicago") at
   **97%**, the single highest-strength edge in the whole dataset. Deliberate: it's a real,
   differentiated result (not a flat/arbitrary 50%), and "Condition" ties the rest-state directly to
   repick's core grading premise rather than an alphabetically-first need.
3. **Exact lime hex(es)** — `#65A30D` (ACCENT_BASE) and `#A3E635` (ACCENT_BRIGHT), both computed
   above. Two shades rather than one: the brief's own instinct ("lime is often quite bright") turned
   out to be literally true here — both shades clear 4.5:1 directly on `#0B0B0F`, so the second
   shade wasn't needed for contrast rescue; it's used purely for a resting-vs-active visual
   hierarchy (dim-but-present accent at rest per the near-monochrome rule, brighter on the one
   focused edge/node), which the brief's "tiny amount, never hover-only" language implied was
   wanted but didn't mandate a specific mechanism for.
4. **Exact container width** — `max-w-[1240px]` page shell (matches this catalog's established
   landing convention), SVG graph `viewBox="0 0 400 540"` chosen specifically so a node's SVG-unit
   radius maps to a near-1:1 CSS-pixel radius at the narrowest real render width (~350px at 390px
   viewport) — product-node radius is 16 (not a more "proportionate" smaller value) specifically so
   its 32-unit diameter clears the 24×24px tap-target minimum (32 × 0.875 ≈ 28px) with real margin
   at that narrowest breakpoint, not just barely.
5. **SVG focus must change fill/stroke/radius, not just outline (brief's own explicit requirement,
   method unspecified)** — every node's `focus-visible` adds `stroke-white` + a wider
   `[stroke-width:4px]` arbitrary property (CSS always outranks an SVG presentation attribute, so
   this reliably overrides the resting `strokeWidth`/`stroke` React props) *in addition to* the
   standard outline ring. This was necessary because the *active* need/product node's resting fill
   is already `ACCENT_BRIGHT` — a `focus-visible:fill-[...]` override to that same color would have
   been a class with literally no visible effect on the one node most likely to hold focus after a
   click, which is exactly the failure mode the brief warned against.
6. **Chart a11y fallback form (brief says "simple text list," method unspecified)** — built as a
   real sortable `<table>` (`table-fixed` + `<colgroup>` % widths, `<caption>`, `scope="col"`,
   correct `aria-sort`) rather than a plain `<ul>`, since the underlying data is naturally tabular
   (need × listing × match % × reason) and a table lets every row double as a third interaction
   path into the same state (judgment call: richer than the brief's minimum, still always-visible
   and never gated behind a toggle).
7. **Brand name** — kept **repick** rather than inventing a new product name. The repo's own landing
   history (12+ prior candidates across r24–r28, grep-verified) consistently titles every candidate
   `repick — <concept>` and uses "repick" as the on-page wordmark; this round's premise is the same
   single product restyled with a new visualization device, not a new product, so continuity with
   that convention took precedence over the generic instruction to invent a brand name. The visual
   identity (dark/lime constellation theme, "The Match Constellation" framing, grotesk display face)
   is original to this candidate.
8. **Product catalog domain (brief's premise is generic "graded secondhand/returned goods")** —
   chosen as streetwear/sneakers/accessories (Jordan 1, Yeezy 350, New Balance 550, Nike Dunk Low,
   BAPE hoodie, Ray-Ban Wayfarer) rather than general electronics, because this repo's existing
   `(marketing)` routes (v6–v21, read-only via grep, not opened/edited) already establish a reused
   pool of Unsplash photo IDs for this exact resale catalog; reusing IDs from that proven-working
   pool (rather than guessing fresh, unverified IDs — outbound network access to verify was blocked
   by this session's proxy policy) was the lower-risk choice for the static `no-random-image-host`
   gate and for actually-loading images.
9. **Self-review pass.** Full read of all 9 files after writing: brace/paren balance checked
   programmatically (all matched); grepped for `Math.random`/`Date.now`/bare `new Date()` (zero);
   grepped for `outline-none` (zero — every interactive element, including SVG nodes, uses only
   `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A3E635]`); found
   and fixed a real `<dl>`/`<div>`/`dt`/`dd` nesting bug in the stats band (this catalog's own
   documented "definition-list" promoted-hardfail pattern) by switching to a plain div/`<p>` grid;
   found and fixed a heading-skip (an `h3` product title inside the hero, before the page's first
   `h2`) by demoting it to a styled `<p>`; found and fixed four `text-zinc-500` instances used as
   real small/body text (strikethrough prices, a footer line, SVG non-connected product labels) that
   only clear 4.07:1 — below the 4.5:1 small-text floor — bumping all four to zinc-400 (7.67:1);
   found and removed a `FOCUS_ON_LIME` (dark-ink outline) constant that was actually invisible in
   practice, since `outline-offset` draws the ring *outside* the element onto the surrounding dark
   page background, not onto the element's own lime fill (computed: ink-on-dark-bg = 1.1:1) —
   replaced every use with the single bright-lime `FOCUS` ring, which is correct in every context on
   this page since the page background is uniformly dark. Confirmed single `h1`, four `h2`s, no
   skips (`grep -n "<h[1-6]"` across the route). Confirmed every `next/image` has real `alt`, `fill`,
   a fixed `aspect-[4/3]` container with a reserved background color, and badges in a row below the
   photo, never overlaid.
