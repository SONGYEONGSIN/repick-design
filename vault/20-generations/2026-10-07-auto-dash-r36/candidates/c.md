# Candidate c — Quadrant

A dark, orange-accented marketing command deck where a left filter rail (channel / goal / 90-day window) drives a KPI summary and a spend × conversion-rate quadrant scatter chart side by side — pinning a campaign from the fallback table only annotates that one bubble in the chart, touching nothing else.

This is a rebuild of a concept dropped once before in this catalog at the hard-gate stage (never seen by a judge): a compact-currency hydration-zero bug, scatter points rendered as focusable buttons, an under-height sortable-header button, and a colgroup re-shuffle that caused 390px cell overlap. All four are fixed below, point by point.

## 브리프에 없던 것

**① `Intl` compact-notation zero bug — two helpers, not one**
① Every helper that formats a number with `notation: "compact"` special-cases `0` to a fixed literal (`"$0"` / `"0"`) before calling `Intl.NumberFormat`.
② `formatCompactUsd` and `formatCompactInt` (`data.ts`) both open with `if (n === 0) return <literal>;` ahead of the compact-notation call; every caller (axis ticks, the bubble-size legend, the chart's aria-label) routes through one of these two, never calling `Intl.NumberFormat({notation:"compact"})` directly.
③ Node's bundled ICU (server render) and the browser's ICU (client hydration) disagree on how compact notation prints exactly `0`; the previous attempt only patched the currency helper, and the bubble-size legend's plain-count formatter was the one not "the obvious one" that could still have drifted.

**② Scatter points are pointer-only, non-focusable marks**
① Every plotted bubble is an `aria-hidden`, unstyled `<div>` with no `onClick` and no role — it is never in the tab order and never a button.
② Hover-only (`onMouseEnter`/`onMouseLeave`) drives the crosshair/tooltip; the Pin action lives exclusively in the data table's `<button>` Pin column, a real 24×24px target at ordinary row spacing.
③ With 30 data-positioned points, several sit closer than 24px apart — that spacing is the spend/rate data itself, not a layout bug, so no amount of padding can make every bubble a safe focusable target; removing them from the tab order entirely is the only honest fix.

**③ Sortable header buttons get an explicit `min-h-7` (28px)**
① Every `<th>` sort button carries `min-h-7` (28px) plus `py-1 px-1.5`, not just padding sized by eye.
② `min-height` on a flex/inline-flex box always wins over a smaller content box (`max(content, min-height)` per spec), so the button is guaranteed ≥28px regardless of how short 11px uppercase text line-boxes.
③ The previous attempt added `min-h-6` (24px, the bare floor) and still failed target-size on re-gate — 28px adds 4px of headroom specifically so no sub-pixel/antialiasing rounding at the exact-minimum boundary can tip it back under 24px.

**④ The Pin column's width came from "Campaign," never from a numeric column**
① Colgroup: Pin 9% · Campaign 27% · Channel 14% · Spend 14% · Conversions 13% · Rate 11% · CPA 12% (sums to 100%). Spend/Conversions/Rate/CPA keep generous, unshrunk room; only "Campaign" (a text column with slack) gave up width for the new Pin column.
② Verified against actual data at the table's 700px mobile floor width: the worst-case formatted value per numeric column (`$108,000` spend at 90 days, `3,598` conversions, `$397` CPA) was measured and each has 20px+ of slack inside its column after padding — plus every `<td>` carries `overflow-hidden` as a hard backstop so a cell clips instead of bleeding into its neighbor even if a future edit tightens a column further.
③ The previous attempt's second failure was exactly this: redistributing colgroup percentages to fit a new Pin column narrowed an already-tight numeric column enough to visually overlap its neighbor at 390px — a distinct failure mode from a horizontal-scrollbar check, since nothing scrolled, two cells' text simply collided.

**⑤ Left narrow filter rail is its own column, not a horizontal filter bar**
① The filter rail is a dedicated `col-span-12 lg:col-span-3` sticky column to the left of a `lg:col-span-9` area holding the KPI row, the chart and the table stacked.
② Channel is a vertical checkbox-style list (not horizontal chips) so it reads cleanly in a narrow column at any width; goal is a vertical button-radio list for the same reason.
③ The brief's skeleton explicitly asks for "a filter rail (left, narrow)" feeding the summary and chart — a horizontal filter strip above the content would read as the trading-terminal/dashboard-toolbar pattern instead of the intended command-deck shape.

**⑥ KPI tile numbers are smaller than the chart's own correlation headline**
① Aggregate-panel KPI values render at `text-base` (16px); the chart's own "r = 0.XX" headline renders at `text-2xl` (24px), strictly larger.
② The correlation/quadrant-summary annotation (a catalog requirement for this chart type) lives inside the scatter-chart card itself, not the KPI panel, specifically so the page's single biggest number stays with the visualization it describes.
③ An open catalog learning flagged the opposite ordering (a KPI tile outsizing the chart's own text) as a defect in this exact concept's prior pass — kept strictly smaller here on purpose.

**⑦ Command palette never touches the chart-local pin or the filter rail's selection**
① ⌘K opens a palette that only scrolls to a section (Filters / Chart / Table) or runs the filter rail's own "reset" — nothing else.
② It has no prop, handler or import that can set `pinnedIds`, so pinning stays reachable from exactly one place (the table's Pin column) and read from exactly one place (the chart's annotation layer).
③ A second catalog learning warned against letting a palette "jump to a campaign" also widen filters and auto-pin it — that would make the palette a third independent consumer of the pin axis and break the deliberately narrow fan-out the skeleton calls for.

**⑧ No avatar photography anywhere in the shell**
① The sidebar/topbar user avatar is an `InitialsAvatar` — a plain colored initials badge — not a photo.
② It needs no `next/image`, no external image host and no `alt`-text photo at all.
③ This console plausibly needs zero real photos, and removing the only candidate for one removes an entire class of image-host/optimization risk outright.

**⑨ Realistic CPA/spend bounds chosen to keep every table cell short**
① Every campaign's 90-day baseline conversions were kept ≥169, so even at the 7-day window (a 0.078× scale factor) no campaign's conversions round down to a tiny integer that would blow up its CPA.
② Checked programmatically across all three period settings: the worst-case CPA across the whole dataset is `$397`, the worst-case spend is `$108,000` — both short, fixed-width-friendly strings at every window setting, not just the default.
③ A CPA that spikes into five or six digits for a low-volume campaign at a short window is a realistic marketing-data edge case, but it is exactly the kind of long numeric string that reintroduces fix ④'s cell-overlap risk — bounding the dataset removes the risk at its source instead of relying only on layout defenses.
