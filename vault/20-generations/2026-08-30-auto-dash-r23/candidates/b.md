**Floorline** — a dark, 3-pane trading-terminal-style comp-tracking console for repick's internal Pricing Ops team: a fixed watchlist rail of 10 tracked secondhand models (cameras/watches/sneakers/bags), a dominant generative-SVG price-trend chart with repick-avg/market-avg/floor bands, and a right-hand sortable comp-listings feed — where a watchlist click and an explicit "Pin comps" action deliberately drive two different, differently-scoped state updates instead of one shared `selectedId`.

## 브리프에 없던 것

① Product/brand and org framing
② Named the tool "Floorline" (repick internal, "Pricing Ops" team persona "Jordan Ames"); route title "Floorline — Comp Terminal"
③ Brief only said "invent freely" — needed a concrete brand lockup for the icon-rail mark, page `<title>`, and a named account for the avatar menu that isn't the real end user

① Accent color(s) + the functional axis
② Amber `#fbbf24` (amber-400) as the single primary accent (brand mark, active/pinned states, repick-avg line, primary button, sort/segment active fill). Teal `#2dd4bf`-family (`text-teal-300`) as the one functional second color, used **only** for "this external comp is priced below repick's current average" in the comp table's Δ Avg column — direction is also carried by a Trending↓/↑ icon so color is never the sole signal
③ Brief explicitly bans violet/indigo and flags cyan/rose as already used two rounds running; amber reads as a pricing/ticker accent without the "alert red" connotation, and teal is unused elsewhere in the recent catalog per the brief's own list. Day-over-day change (rising/falling, in the watchlist rows) was deliberately kept OFF this color pair — it's a different axis (trend, not above/below-market) and reusing teal there would have diluted its one meaning, so it's rendered as neutral zinc + a trend icon instead

① Status-badge palette vs. the two accents
② Status (Active/Sold/Expired) is grayscale-only: solid zinc-100-on-dark for Active, mid zinc-800 for Sold, outline zinc-400 for Expired — no hue at all
③ Originally had Active use the teal tone (reused from an early draft); caught during self-review that this would make teal mean two unrelated things on the same table row (a listing's live/dead state vs. its price direction). Rebuilt status as a pure prominence ladder instead so the "below market" teal keeps a single, learnable meaning

① Contrast floor audit (dark theme, zinc-400 minimum)
② Swept every text color literal after first draft and fixed two violations: Tabs' inactive tab-count span (`zinc-500`→`zinc-400`) and the comp-table footer caption (`zinc-500`→`zinc-400`, then simplified away). Kept `zinc-500` only for non-text uses (dot swatches, decorative icon strokes) where the contrast rule doesn't apply
③ Brief's dark-theme floor is "minimum zinc-400 for secondary text" — zinc-500 is measurably dimmer and was missed on the first pass in a couple of low-emphasis captions

① Selection-propagation split — the specific mechanism
② Two state slots in `client.tsx`: `activeId` (watchlist click, or a ⌘K palette pick — same handler, two input paths into one mode) updates the chart + summary stat strip immediately. `pinnedFeedId` only changes when the analyst clicks the explicit amber "Pin comps to …" button that appears in an out-of-sync banner inside `CompFeedPanel`. Chart-hover/keyboard-crosshair is a *third*, fully separate mode: local `hovered` state inside `PriceChart` that never touches either page-level id
③ This is the brief's own worked example, made concrete with a real justification: comp listings are framed as the "expensive to refresh" resource (an external-marketplace crawl), so casually browsing the watchlist shouldn't silently re-trigger it — the analyst has to mean it. The out-of-sync banner and the `Pin` icon marker on whichever row is currently feeding the right panel make the state explicit rather than hidden, and a code comment on each state slot documents which action moves it

① Chart persistent-value labels vs. hover tooltip
② Repick avg / Market avg / Floor render as always-visible end-of-line labels directly on the SVG (colored dot + compact currency) AND as four big stat-strip numbers above the chart (Repick avg, Market avg, Floor, Spread). Hovering/arrow-keying adds a crosshair with a floating tooltip showing the *full-precision* values for that specific day only
③ Brief penalizes charts where the key number only exists on hover. Splitting compact-always vs. full-precision-on-demand also solved a layout problem: full KRW figures for the Nautilus (₩182,000,000-scale) don't fit in a persistent label, so compact notation carries the always-on read and full precision is reserved for the tooltip where there's room

① Chart geometry — avoiding non-uniform-scale distortion
② Built the SVG with a fixed 1000×340 viewBox but sized the element with `aspect-[1000/340] w-full` (no fixed pixel height, no `preserveAspectRatio="none"`), so it's always geometrically similar to the viewBox regardless of the flex-1 center column's actual rendered width
③ First draft used a fixed CSS height (`h-[340px]`) with `preserveAspectRatio="none"` so the chart would fill a responsive-width container — but that stretches x and y by different factors the moment rendered width departs from 1000px, turning the crosshair circles into ellipses and squashing the axis-label glyphs. Locking the box to the viewBox's own aspect ratio removes the mismatch entirely instead of trying to compensate for it per-element

① Currency + compact notation
② KRW via `Intl.NumberFormat(..., { style: "currency", currency: "KRW" })`, with a `notation: "compact"` variant (`₩184.5M`, `₩850K`) for every space-constrained surface (watchlist rows, stat strip, chart labels, comp table) and full precision only in the crosshair tooltip
③ repick's home market is Korean secondhand goods, and full-precision KRW for a discontinued Patek Nautilus (₩182,000,000+) is 12+ characters — verified compact notation renders in plain ASCII K/M (confirmed via `Intl.NumberFormat` directly, not assumed), so English-only copy holds and Pretendard tabular-nums still applies since ₩ is never rendered in `font-mono`

① Dates without `new Date()`
② `Intl.DateTimeFormat.format()` called directly on a literal millisecond number (`BASE_MS = 1735689600000`, i.e. 2025-01-01T00:00Z, plus `dayIndex * 86400000`) — verified via Node that day 0 → "Jan 1" and day 364 → "Dec 31, 2025"
③ `Intl.DateTimeFormat.prototype.format` accepts a raw timestamp, not just a `Date` instance, so this satisfies both "use Intl for dates" and "no `new Date()`" simultaneously instead of trading one off against the other

① Watchlist + comp data (10 models, deterministic series)
② 3 cameras (Leica M6, Fujifilm X100V, Sony α7 III), 3 watches (Submariner 116610LN, Speedmaster Pro, Patek Nautilus 5711), 2 sneakers (AJ1 Chicago, NB 990v6), 2 bags (Birkin 30, Chanel Flap) — each a 365-day `repick`/`market`/`floor` series from a closed-form sum of two sine/cosine waves plus linear drift (fixed per-item constants, no RNG), and 5–6 comp listings per item from a category-appropriate marketplace pool (eBay/KEH/MPB for cameras, Chrono24/WatchBox for watches, StockX/GOAT for sneakers, Fashionphile/The RealReal for bags)
③ Needed realistic, varied price trajectories (some rising, some falling, different volatility/period per item) without any per-render randomness — closed-form trig functions keyed off fixed literals reproduce byte-identically on every import, and picking real (if generic) marketplace names per category reads as an operations tool rather than placeholder data. Category counts in the watchlist tabs (3+3+2+2=10 = "All") are computed by filtering the same array rather than hardcoded, so the subtotal can't drift from the total

① Sidebar/rail widths used for the 1920px ultra-wide-cap computation
② Icon rail 64px + watchlist rail 300px (fixed, `lg:w-[300px]`) + comp-feed panel 360px (fixed, `lg:w-[360px]`) + content-area horizontal padding 48px (`sm:px-6` ×2) + two 16px inter-pane gaps = 804px of fixed chrome. At 1920px that leaves ~1116px for the flex-1 center chart column with zero dead space (no cap engages below it); chose `max-w-[2560px] mx-auto` on the outer shell row as the gentle ultra-wide cap, comfortably above 1920/2560 so it only activates on 3440px+/4K monitors
③ Brief requires computing this from the actual shell rather than reusing example numbers — 804px was added up directly from the Tailwind classes actually used in `client.tsx`, and 2560 was picked specifically because it's larger than the two most common wide-monitor widths (1920, 2560) so neither ever sees an artificial margin, while still bounding a 3440px ultrawide chart from stretching arbitrarily

① Comp table column-width math (the narrowest real container in the whole page)
② `table-fixed` with Listing 34% / Price 22% / Δ Avg 22% / Grade 22% inside a ~328px usable width (360px fixed rail − 32px panel padding). Verified per-column: "Δ Avg" + sort icon (the widest sortable header, uppercase + tracking) needs ~50–56px against a ~56px budget at 22%×328−cell-padding; Listing's 34% (≈112px) covers a 24px avatar + gap + a truncating source name. First pass used an even 40/20/20/20 split with `tracking-wider`, which measured too tight for "Δ Avg" — corrected to 34/22/22/22 and switched header tracking to `tracking-wide`, and shortened footer copy to one line since two `justify-between` text blocks didn't fit the same 328px box
③ The brief flags this exact failure mode (percentage compression below intrinsic content width silently bleeding into the next column, invisible to a scrollWidth-only gate) as the highest-value thing to get right by hand rather than by assumption — this panel is the narrowest fixed-width container on the page at every breakpoint (it doesn't grow past 360px even at 1920px), so it was the one place worth doing the arithmetic instead of eyeballing it

① Only one `overflow-x-auto`-class container risk, resolved to zero
② The comp table needs no horizontal scroll at all (table-fixed + verified column math), and the chart is a scaling SVG (no scroll container) — so the page ships with no wide `overflow-x-auto` container anywhere, rather than one "safe" one
③ Brief calls out that even one seemingly-safe wide scroll container has caused scrollWidth leakage at 390px in this project's history; removing the need entirely (rather than adding one and hoping it clips cleanly) was safer than auditing a second scroll boundary

① Focus-visible mechanism (ring-2/ring-offset and outline-none+focus-visible:outline-* are both dead in this Tailwind v4 setup)
② One shared `FOCUS_RING` constant: `outline-none focus-visible:[box-shadow:0_0_0_2px_var(--fl-surface,#09090b),0_0_0_4px_#fbbf24]` — a literal arbitrary box-shadow, applied to every interactive element (buttons, tabs, sortable headers, popover items, chart's keyboard-focusable group). The command palette's search input gets a locally-scoped variant with a `#18181b` (zinc-900) gap color to match its own surface. Two full-viewport backdrop `<button>`s (drawer/palette dismiss-by-click) are set `tabIndex={-1}` instead of getting a focus ring, since Escape and an explicit close button already cover keyboard dismissal and a screen-edge-to-edge focus ring would be a worse cue than no stop at all
③ Brief documents both idioms as passing code review but rendering invisible/broken in this exact setup; box-shadow is completely outside Tailwind's ring/outline custom-property chain so it doesn't share either failure mode, and it doesn't depend on element size the way the ring bug reportedly does under ~20px (several nav icon buttons here are 36–40px, at the edge of that risk zone)

① Single `<h1>` placement
② The selected/pinned watchlist item's full name (`item.name`, styled with `--font-display-wide`) is the page's one `<h1>`, inside the center pane's header — everything else (`Watchlist`, `Comp feed`) is `<h2>`, no `<h3>`+
③ The brief requires exactly one h1 and no level-skips; putting it on the terminal's actual literal subject (whichever model is currently pinned to the chart) was more honest than a generic static app-title h1, since that IS the primary content of the page at any given moment
