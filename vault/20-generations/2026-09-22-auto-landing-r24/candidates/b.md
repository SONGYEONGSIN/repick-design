# Candidate b — Trust Web

One line: a hand-laid-out 7-node verification graph (seller → item → AI scan / manual inspection /
seller-history-check → escrow → buyer) where four checklist toggles light up their own node and
edges and recompute a literal weighted-sum trust-confidence percentage live — a node/edge graph with
toggle-driven active-path highlighting, a device form the catalogue has not shipped before, carried
through every later section into the closing CTA's own copy.

## 브리프에 없던 것

**1. Accent hue and both contrast pairings, plus the fill/tint text-color split**
① The brief asked for a rose- or orange-family accent, not violet, with the contrast math recorded.
I picked orange, and split it into two shades the way the catalogue's established pattern does: a
saturated fill `#EA580C` (orange-600) for filled surfaces/borders/large text, and a bright tint
`#FDBA74` (orange-300) for small text/icons/the focus ring.
② WCAG relative-luminance math against the bg `#0B0B0F` (L≈0.00345): `#EA580C` alone has L≈0.2452,
giving **5.52:1** against the background — passes AA at every size, so it's safe as plain text on
the page too, not just as a fill. `#FDBA74` has L≈0.5726, giving **11.65:1** against the background.
③ The brief's own worked example (`#6E56CF`) warns that white text on a mid-luminance accent fill
can fail small-text AA even though the fill itself reads fine as a large element — I checked whether
that trap applies here rather than assuming it doesn't. White (L=1) on the `#EA580C` fill is
`(1.05)/(0.2452+0.05)` = **3.56:1** — fails the 4.5:1 small-text floor, only clears the 3:1
large-text floor. Dark ink (`#0B0B0F`, L≈0.00345) on the same fill is `(0.2452+0.05)/(0.00345+0.05)`
= **5.52:1** — passes AA at every size. So, opposite of the brief's green worked-example (which
lands on white-on-fill), this orange lands on **dark-ink-on-fill**: every filled chip, badge and
button below (`bg-[#EA580C]` + text) uses `text-[#0B0B0F]`, never white. This is the calculation the
brief explicitly asks not to skip, and it flips the usual answer, which is exactly why it had to be
checked rather than copied from the last round's green example.

**2. Body-copy measure (line length) in px, not `ch`**
① Paragraph max-widths: 493px for 16px body copy, 431px for 14px card copy.
② Brief's own constant, applied directly: 70 chars × (0.44em × font-size) → 16px: 70 × 0.44 × 16 =
492.8px ≈ 493px. 14px: 70 × 0.44 × 14 = 431.2px ≈ 431px.
③ These two numbers happen to match earlier rounds' figures (e.g. r23/b) because they're the direct
output of the brief's fixed formula at 16px/14px, not a stylistic choice — re-deriving the same
formula at the same font sizes necessarily produces the same px cap. `ch` was avoided per the
brief's warning that it measures the `0` glyph's advance, ~35% wider than Pretendard's true mixed
English-body average of 0.44em.

**3. Per-layer trust-confidence weights, chosen to sum cleanly and never hit a boundary**
① Base (always-on seller→item→buyer connection): **15%**. Layers: Photo AI scan **+22%**, Manual
inspection **+28%**, Seller history check **+18%**, Escrow hold **+17%**. 15+22+28+18+17 = **100%**
exactly, so "all four on" reads as a clean 100% rather than an odd number, and "all off" reads as
15% rather than 0% — the graph never goes fully dark even with nothing toggled.
② These are fixed literals in `LAYERS` in `data.ts`, summed by `confidenceOf()` — a real `reduce`
over whichever layers are in the `Set`, not a lookup table of precomputed combinations.
③ Manual inspection got the highest single weight (28%) deliberately — a human re-checking the item
by hand is the layer repick's own copy treats as the most consequential, and giving it the largest
number makes the "Next biggest lift" value-card (section 3) actually respond to it: it's also the
layer that sits OFF in the default state, so the very first thing a visitor's "next biggest lift"
card recommends is the layer with the most real weight behind it.

**4. Default toggle state — never a boundary value**
① Default: `aiScan`, `sellerHistory`, `escrowHold` ON; `inspection` OFF → confidence = 15+22+18+17 =
**72%**.
② The brief requires a non-trivial default (not 0% or 100%). 72% sits well inside the range, the
graph visibly shows one dim node (Inspection) among three lit ones, and the "Next biggest lift"
card has a real, non-null answer to show on first paint (switching on Manual Inspection → 100%).
③ I deliberately left the *highest-weight* layer off by default (rather than, say, the lowest-weight
`escrowHold`) so the very first "what should I turn on next" recommendation a visitor sees is
non-trivial and worth the click, instead of a low-impact afterthought.

**5. Node/edge coordinates and graph topology — hand-placed, not auto-laid-out**
① 7 nodes on a fixed `760×420` viewBox: `seller (70,210)`, `item (250,210)`, `aiScan (430,90)`,
`inspection (430,210)`, `sellerHistory (430,330)`, `escrowHold (600,210)`, `buyer (690,210)`. 8
edges: seller→item (base, always on), item→aiScan, item→inspection, seller→sellerHistory (routed
from the seller, not the item, because a history check is about the seller, not the listing),
aiScan→escrow, inspection→escrow, sellerHistory→escrow, escrow→buyer.
② Each of the 4 optional edges/nodes has exactly one `dependsOn` toggle id, so toggling a layer
lights up *that one node plus its two edges* — a clean bijection between the 4 checklist toggles and
4 of the 7 nodes, satisfying "each toggle lights a specific node and its edges" literally rather than
approximately.
③ I chose straight `<line>` edges over curves/trig because the brief explicitly says a small fixed
node set with hand-placed deterministic coordinates is sufficient, and straight lines need no
rounding beyond the plain integers already used for x/y. The one place I did divide (converting
viewBox units to CSS `%` for the HTML node-marker overlay) is rounded to 2 decimals via
`.toFixed(2)` in `pct()`, satisfying the SVG-coordinate rounding rule for hydration safety.
④ Node markers are plain positioned `<div>`s (icon + label), not `<circle>`/`<text>` inside the SVG
— the SVG only draws edges. This sidesteps `foreignObject` SSR quirks entirely and keeps the node
labels as ordinary DOM text (so their own color-contrast is directly auditable, unlike text baked
into SVG).

**6. The graph nodes are not click targets — only the checklist toggles are**
① Clicking a verification layer on/off happens through the 4 checklist chips only; the graph itself
is a live, decorative-but-non-trivial *readout* of that same state (hover/focus a chip and the
caption line below the graph swaps to that layer's description).
② I considered making the graph nodes themselves clickable duplicate controls. I didn't, because a
button whose only accessible identity is a small icon+abbreviated-label inside an SVG-adjacent
overlay is exactly the kind of control the brief's a11y section warns can look interactive in source
but fail the real "Tab and see a visible change" check if the click handler and the checklist state
silently diverge. One unambiguous set of controls (the checklist, which already has full
`aria-pressed`/focus-visible/label semantics) is safer than two entry points to the same state.
③ The chain list in the Product Preview section doubles as a second, fully text-based, non-visual
account of the exact same graph (same 7 nodes, same live active/inactive state, screen-reader
readable line by line) — so screen-reader users get the graph's information without depending on
the SVG's `aria-label` summary alone.

**7. Item, photo and price — reused id, not invented**
① Item: "Seiko automatic dress watch", $220 ask vs $340 appraised (35% off), 82% match, Grade B,
verified. Photo id `1523275335684-37898b6baf30`.
② That exact id is already used for the same watch in `(marketing)/v21` and `(marketing)/v23` in
this repo, so it's a confirmed-real, on-topic Unsplash photo rather than a guessed id. A watch also
fits the "trust web" concept thematically — authenticating a watch (case, movement, papers) is a
recognizable real-world trust chain independent of the metaphor.
③ Discount is computed via `discountPct()` = `round((1 − 220/340) × 100)` = 35, not typed as a
literal — the number is derived exactly once, from the two price fields, the same way the trust
confidence is derived from the toggle state.

**8. Single accent only, no second hue**
① Only the orange fill/tint pair is used; no second accent hue.
② The brief allows two accent hues only when they encode two different data axes stateable in one
sentence. Everything colored here — active nodes, active edges, active checklist chips, badges,
CTAs — is the same single axis: "is this thing currently on." Active/inactive is already carried by
opacity, fill-vs-outline, solid-vs-dashed stroke and icon color together, so a second hue would be
decoration, not a second axis, and the near-monochrome rule is safer left un-stretched here.

**9. Diversity/theme check (run against this catalogue)**
Violet is the most overused landing accent (6/~21) and is also repick's native-app fixed accent, so
it was avoided per the assignment. Between rose and orange (1 work each), I picked orange — it reads
as a warmer, more "verified/gold-seal" trust signal than rose, which leans closer to an
alert/error hue in most UI conventions, and a trust-graph device benefits from not looking
alarm-adjacent.
