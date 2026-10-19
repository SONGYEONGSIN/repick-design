# Candidate b — Return Drop-off Points

A pure browse/info screen for a buyer whose return was already approved and who chose to drop the package off in person instead of using a prepaid shipping label. A "List"/"Map" segmented control switches between two views of the exact same fixed six-location array and the exact same selection state: List is a genuine scrollable `FlatList` of rows that accordion open in place to reveal full address, hours, a real derived "open now / closed now" status, and a "Get Directions" action; Map is a bordered, free-form schematic canvas with absolutely-positioned circular pins (no map library — this is intentionally abstract, not real cartography) that opens the identical detail panel when tapped. Nothing on the screen is destructive or blocking, so there is no fixed bottom band at all — browsing and picking a drop-off point is the entire job.

## Render-check string

Confirmed present verbatim, visible on first paint (outside any scroll container, rendered via `accessibilityRole="header"`): **Return Drop-off Points**

## 브리프에 없던 것 (What the brief didn't specify)

① Decide: what the fixed "now" reference actually is, and how to represent it.
② Decided: a single numeric constant `DROPOFF_REFERENCE_MINUTE = 17 * 60 + 15` (minutes since midnight, i.e. 5:15 PM) in `data.ts`, compared against each location's own `opensAtMinute`/`closesAtMinute`.
③ Why: the brief asked for a "fixed now reference time constant" but not its format. Minutes-since-midnight avoids ever touching `Date` objects (sidesteps the "no argument-less `new Date()`" determinism rule entirely, and avoids day-of-week complexity that isn't needed since the brief doesn't ask for different hours per weekday), while still producing a real, recomputed-every-render boolean (`isSiteOpenAt`) rather than a hand-typed status string per site.

① Decide: how many locations, and what mix of open/closed/24-hour to seed.
② Decided: six locations — two "Partner Store", two "Locker" (modeled as 24-hour access), two "Post Office" (limited hours) — with hours chosen so that, against the 5:15 PM reference, four read "Open now" and two read "Closed now" (the two Post Offices, both just past their closing time).
③ Why: the brief said "5-6 fixed deterministic locations" but left the type/hours mix open. A mix of open/closed/24-hour exercises every branch of `isSiteOpenAt`/`formatNextChangeLabel` (including the "open 24 hours" special case) so the derived-status logic is actually visibly demonstrated rather than coincidentally uniform.

① Decide: how to handle the "Get Directions" no-op honestly, per the GENERATION.md warning against promising an unperformed system action.
② Decided: kept the button labeled "Get Directions" (matching the brief's required content item), but its handler only toggles a local, auto-clearing "Directions copied." confirmation text inside the shared detail panel's single live region — and the `accessibilityHint` describes exactly that ("Shows a confirmation that directions for this address were copied"), never claiming it opens an external maps app.
③ Why: GENERATION.md explicitly names this exact pattern ("toggling a 'Directions copied' inline confirmation instead of promising external navigation") as an accepted canonical choice, so I used it verbatim rather than inventing a riskier alternative or silently doing nothing on press (which would feel broken with no feedback at all).

① Decide: how to place map pins deterministically without any geo/map library.
② Decided: each location carries fixed `pinTopPct`/`pinLeftPct` values (hand-picked, spread across a 14–84% range) applied via `position: "absolute"` with percentage strings, plus a 2-letter `markerGlyph` (e.g. "HM", "CS") derived once per location and reused for its map pin.
③ Why: the brief forbade any real map dependency and asked for "fixed percentage-based top/left style values you choose per location, deterministic" — I treated "deterministic" as "I hand-author them once, not computed from any per-render formula," and added faint cross grid-lines plus an explicit "Schematic layout, not to scale" caption so the abstraction reads as an intentional design choice rather than a broken map.

① Decide: where to draw the line between "list row" styling and "map detail card" styling so the shared `SiteDetailPanel` doesn't visually fight either container.
② Decided: `SiteDetailPanel` owns its own horizontal/vertical padding and is dropped, unstyled otherwise, into two differently-bordered parent containers (an outlined row card in List; a plain outlined card below the canvas in Map) rather than giving it two separate "modes."
③ Why: the brief required the map's selection panel and the list's accordion to render "the SAME detail panel content" — keeping one component with no variant prop (only the parent wrapper differs) is the most literal way to guarantee the two views can never drift out of sync with each other.

① Decide: naming — the brief required fresh names, not reused from any existing screen.
② Decided: domain-specific names throughout: `DropoffSite`/`DROPOFF_SITES`, `DROPOFF_REFERENCE_MINUTE`, `isSiteOpenAt`, `formatNextChangeLabel`, `CanvasPin`, `SiteDetailPanel`, `toggleSiteSelection`, `directionsConfirmedForId`, `modeSwitchTrack`/`modeSwitchOption` for the segmented control styles.
③ Why: GENERATION.md flags code-surface duplication (naming schemes borrowed from other screens) as judged literally, so every identifier was coined fresh for this "return drop-off" domain rather than echoing patterns like `hasUnsaved*`/`*Snapshot` seen in sibling screens.
