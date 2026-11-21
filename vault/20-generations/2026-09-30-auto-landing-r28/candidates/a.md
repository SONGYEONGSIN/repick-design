# r28 candidate a — "The Route"

One-line concept: a light, near-monochrome landing page whose proof mechanism is a hand-built
Sankey/flow diagram tracing one real search (1,842 scanned → 214 AI-matched → condition &
authenticity tiers → your shortlist), driven by a single minimum-condition-grade slider that
re-routes the ribbons and every downstream stat live, with no buyer/seller perspective toggle.

## Accent

`#BE185D` (a deep berry/rose, pink-700-class) — chosen specifically to avoid the catalog's three
most-used accents (amber, teal, violet) and the two most recent winners' hues (blue-hex, emerald).

Computed by hand with the WCAG relative-luminance formula (`L = 0.2126R + 0.7152G + 0.0722B` on
linearized channels):

- `#BE185D` vs white `#FFFFFF` → **6.03:1** — clears body-text AA (4.5:1) with margin. Because
  this is the light-theme direction, the raw accent is already dark/saturated enough to use
  directly as small text/icon color on the bg — no separate "light tint" derivation needed (that
  move is specifically a dark-theme adjustment).
- white on `#BE185D` fill → **6.03:1** (same pair) — every accent-filled surface (primary button,
  filled avatar chip) uses white text at every size, so the small-vs-large-text distinction in the
  fill-background rule never has to be navigated per-instance.
- `#BE185D` vs dark ink `#18181B` → **2.94:1** — fails even the 3:1 large-text/non-text floor, so
  dark ink is never placed on the accent fill anywhere on this page (sidesteps the rule entirely
  by always using white-on-fill).

One accent hue only; the flow diagram's many ribbons/nodes are grayscale (zinc-200 through
zinc-900, darker = higher condition grade) with the accent reserved for exactly one meaningful
path: the ribbons and node that feed "Recommended to you." No second accent hue — grade is encoded
in grayscale density plus the grade-name text label, not a second color.

## Body-text width math

Per the brief's 0.44em/glyph formula (`chars = container px ÷ (0.44 × font px)`, not CSS `ch`):

- 17px body → `520px` → `520 / (0.44 × 17) ≈ 69.5` chars/line
- 18px lead → `540px` → `540 / (0.44 × 18) ≈ 68.2` chars/line
- 14px caption-as-sentence (live-summary paragraph) → `430px` → `430 / (0.44 × 14) ≈ 69.8` chars/line
- 12px caption-as-sentence (slider helper, verification-sink note, footer tagline) → `370px` →
  `370 / (0.44 × 12) ≈ 70.1` chars/line

All four land just under 70, never at the 75 ceiling. Short labels/badges (category names, grade
names, stat labels, node sublabels inside the diagram's own narrow ~150–270px columns) are left
unconstrained since their content is under 65 characters and/or already structurally narrower than
the cap, per the brief's "short captions are fine" exemption.

## 브리프에 없던 것 (What the brief didn't specify)

1. **Sankey topology and exact dataset.** ① One search ("Full-frame mirrorless body, under
   $2,200") flows: 1,842 scanned → 214 AI-matched → 5 condition/authenticity nodes (Fair 28,
   Good 65, Excellent 66, Like New 28, Failed verification 27) → 3 outcome nodes (Recommended,
   Held back, Not verified), with the grade-tier→outcome routing driven by the slider. ② The brief
   specified the visualization *form* (Sankey with flow-width encoding count/confidence) and the
   general pipeline shape (search → AI match → condition/authenticity filter → final listings) but
   not concrete stage counts or a topology; I picked a 4-column/10-node structure specific enough
   to carry real proof numbers while staying small enough to hand-verify every arithmetic identity
   (conservation: Matched column total 214 = sum of the 5 tier nodes; Outcome column total 214 =
   Recommended + Held back + Not verified at every slider position).

2. **Square-root bar-height scaling instead of strict linear.** ① Bar/ribbon thickness uses
   `height = k × sqrt(value)`, not linear. ② The raw counts span a ~68x range (27 to 1,842);
   linear scaling collapses every node but "Listings scanned" to a near-invisible hairline, which
   would read as a bug rather than a diagram. Square-root compression keeps every node visually
   distinct and still strictly ordered (bigger count → taller bar); the exact integer counts are
   always printed as real HTML text next to every bar regardless of the visual scale, so nothing
   about the underlying numbers is hidden or misrepresented — an explicit, disclosed trade-off
   rather than a silent one.

3. **Ribbons fan in/out at full node height rather than sub-segmented ports.** ① When a node has
   multiple incoming or outgoing ribbons (e.g. "AI-matched candidates" splitting into 5 tiers),
   every ribbon spans that node's *full* rendered height rather than a proportional sub-slice.
   ② A true Sankey normally stacks ports proportionally; doing that by hand (vs. a charting
   library) adds meaningful geometry-computation risk for a purely decorative (aria-hidden) layer
   whose real information is already carried by the adjacent HTML text. I judged the simpler
   fan shape an acceptable, disclosed simplification given the accessibility-safety benefit of
   keeping the connective-tissue rendering logic small and easy to verify by hand.

4. **Ribbons/measurement-based layout instead of a hardcoded pixel grid.** ① The diagram measures
   each node `<div>`'s real `getBoundingClientRect()` after layout (via a mount-gated
   `useLayoutEffect` + `ResizeObserver`) and draws SVG ribbon paths between those measured
   coordinates, rather than hand-computing every node's (x, y) in a fixed virtual canvas. ② This
   was an arbitrary engineering judgment call: it trades a small amount of complexity (an
   isomorphic-layout-effect guard, a resize listener) for guaranteed pixel-perfect alignment at
   every viewport width without a second, hand-authored mobile layout — and it degrades safely
   (ribbons simply don't render) if JS never runs, while every node's real label and count is
   still present in the initial server-rendered HTML.

5. **Framer Motion's `whileInView` reveal wrapper needed a mount-gate to avoid the
   leftover-opacity:0 trap.** ① Added a `mounted` state gate so `Reveal` renders a plain,
   fully-opaque `<div>` on the server and on the client's first paint, and only swaps to the
   animated `motion.div` after a `useEffect` confirms we're safely past hydration. ② The brief
   explicitly warns against shipping `opacity:0` in the no-JS/SEO fallback; Framer Motion applies
   the `initial` prop's styles during SSR by default (needed for client/server render consistency
   before hydration), so wiring `initial={{opacity:0}}` straight into a component used across four
   of five sections would have shipped literally invisible page content to any no-JS or
   slow-to-hydrate visitor. This is a fix to a pattern that's common in the existing codebase, not
   a documented library quirk explained anywhere in the brief.

6. **Standardizing all muted/secondary text on the `zinc-600`-class floor instead of switching
   between `zinc-500` and `zinc-600` per surface.** ① Every caption, label, and muted body color on
   this page uses `zinc-600`, even on plain white/near-white surfaces where the brief's stated
   floor would allow `zinc-500`. ② Arbitrary simplification: `zinc-600` clears both the near-white
   floor and the tinted-surface floor the brief describes, so standardizing removes the need to
   track, per element, which of the two nearly-identical off-white surfaces (`#FFFFFF` vs the
   `#FAFAFA` section-banding tint) it sits on — at the cost of a slightly smaller contrast step
   between "muted" and "heading" text than the brief's floor technically requires.

7. **Mobile-only local horizontal scroll for the flow diagram, rather than a second, fully
   distinct mobile layout.** ① The diagram's node grid has `min-w-[680px]` inside an
   `overflow-x-auto` wrapper (with `tabIndex={0}` + `aria-label` for keyboard reachability), so on
   narrow viewports the diagram scrolls locally instead of either overflowing the page or
   cramming 10 node labels into ~80px-wide columns. ② The brief states mobile-only local
   horizontal scroll is fine for a table specifically; I extended the same idiom to this diagram
   since the underlying concern (page-level overflow vs. a contained, keyboard-reachable inner
   scroll region) is identical and the diagram is materially denser than a table row at the
   10-node cardinality this topology requires.

8. **Listing price pairs were hand-picked so `round((1 − priceNow/priceOriginal) × 100)` exactly
   equals that listing's tier's `avgDiscount`.** ① E.g. the Sony a7 IV (Excellent, tier
   avgDiscount 33%) is priced $2,498 → $1,674, which computes to exactly 33% off. ② Not specified
   by the brief; done so the product-preview cards, the hero proof cards, and the flow diagram's
   tier statistics all quote consistent numbers rather than three independently-invented sets of
   figures that happen to coexist on one page.
