# c — Fathom (split-exploration)

Fathom is a stock-media archive for production teams, on a true white/zinc-50 canvas with a
rose accent and the wordmark/h1 set in `--font-display-mono`. The layout is split exploration:
a 420px results list (thumbnail, title, credits price, collection/creator, type/orientation/
license/status/downloads badges) beside a right preview pane that swaps in full metadata,
tags and license actions on row select — collapsing to list-then-detail navigation under
390px. Interactions: multi-select filter chips (Type/License/Orientation) with an
always-visible removable-chip row and "Clear all," a sort select showing its current value
(Relevance/Newest/Most downloaded/Price), a live tabular-nums result count, card-select into
the detail pane, and "Load N more" pagination; filtering Video+Square together proves the
empty state, cleared in one click. A sticky filter header gains a shadow on internal list
scroll and rows stagger in on mount, both settled instantly under `prefers-reduced-motion`.
Distinct from the round's other dark-canvas commerce/editorial reads by committing to light
and by picking rose over the catalogue's crowded violet and this round's emerald/amber.
