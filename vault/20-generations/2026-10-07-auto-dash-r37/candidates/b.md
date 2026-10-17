# Candidate B — Baseline (Vendor Quality Scorecards)

Baseline is a dark, indigo-accented procurement console whose entire hero is one full-width strip of hand-built vertical box plots — one per vendor, median and outlier count always printed on the glyph — sitting above a completely independent, sortable/filterable vendor directory table, with an ephemeral hover/focus popover as the only path to the full five-number summary.

## 브리프에 없던 것

**1. Product identity — "Baseline"**
① A fictional brand name, wordmark and icon chip (BarChart3 in an indigo tile) for the whole console.
② Set once in `sidebar.tsx`, using `--font-display-grotesk` only on that one wordmark span via inline `fontFamily`, never reused elsewhere.
③ The brief invents-your-own-product freely; "Baseline" doubles as a pun on the statistical baseline a median represents, and confining the display face to one literal element keeps the font-discipline rule trivially auditable.

**2. The 12-vendor roster and all 36 five-number summaries**
① Fictional vendor names/categories/regions/contacts, plus full literal min/Q1/median/Q3/max + outlier arrays for all three metrics (defect rate, delivery variance, inspection score).
② Hand-written in ascending order per row in `data.ts` so `min ≤ q1 ≤ median ≤ q3 ≤ max` holds by construction; outliers are literal points placed outside each row's own [min, max] on purpose.
③ The brief demands realistic, deterministic, internally-consistent data but leaves the actual numbers to the candidate; writing each row in strict ascending order is the simplest self-verifying method, cheaper than a runtime assertion and equally reliable for literals that never change.

**3. Shared-domain SVG geometry for the box glyphs**
① Fixed constants (48×150 viewBox, 9px inner padding, 24px center, 12px box half-width, 8px whisker-cap half-width, 2.5px outlier radius) and a single `yFor()` scale shared by every box in a given metric.
② `metricDomain()` reduces over all vendors' min/max/outliers for the active metric once per render; every box's `<rect>`/`<line>`/`<circle>` coordinates are produced through `round2()`.
③ The brief requires 2-decimal-rounded SVG coordinates and comparable boxes, but doesn't specify the scale — a shared domain (rather than per-box normalization) is what makes "sorted by median" and cross-vendor comparison visually honest instead of misleading.

**4. Fixed-position ephemeral tooltip with edge clamping**
① On hover/focus, `getBoundingClientRect()` on the box button drives a `position: fixed` popover placed below the column, horizontally clamped to stay ≥150px (half its 300px width) from both viewport edges.
② Computed inline inside the `onMouseEnter`/`onFocus` handler, not in an effect, and reset to `null` on `onMouseLeave`/`onBlur` — no portal, no persisted id elsewhere.
③ The brief mandates an ephemeral, state-isolated popover; a CSS-only `group-hover` tooltip would clip against the chart's `overflow-x-auto` scroller (first/last columns), so a measured-position overlay was invented to satisfy "disappears on blur, touches nothing else" without visual clipping.

**5. KPI-subordination typography rule**
① The "Fleet median … outliers flagged" summary line and the table's row-count caption are both `text-xs` (12px); the box's own always-visible median number is `text-base font-semibold` (16px).
② Enforced as a deliberate class choice in `box-plot-strip.tsx` and `vendor-table.tsx`, checked by eye against the brief's size-ordering rule rather than left to default stacking.
③ Directive 4 requires any persistent summary number to render strictly smaller than the box's own median text; since the brief supplies no sizes, a 12px-vs-16px split was chosen as an unambiguous, easily-verified margin.

**6. A scoped, non-coupling ⌘K palette (5th interaction)**
① A command palette that searches vendor name/category/short code and, on selecting a result, only calls `scrollIntoView` on the `#vendor-directory` section — it never sets a "selected vendor" anywhere.
② Query state resets inside `handleClose()` at the moment the dialog closes (overlay click, X, Escape, or a result pick), not via a `useEffect` watching the `open` prop, and the dialog body only exists while `open` is true.
③ The shell convention calls for ⌘K search; giving it any power beyond "jump to a static anchor" risked becoming a second, hidden coupling channel between the chart and the table, which directive 1/2 explicitly warn against — scrolling to an anchor adds a real behavior-axis interaction while provably touching no shared state.

**7. Splitting the "account menu" across sidebar and topbar**
① Sidebar bottom shows a static, non-interactive identity block (avatar initials + name + role); the topbar's avatar button is the one real `Popover` with Settings/Sign out.
② Implemented by giving the sidebar block no `button`/`aria-label` at all (just an `aria-hidden` decorative avatar span) while the topbar avatar button carries `aria-label="RT account menu"`.
③ The brief's shell convention lists both a sidebar "bottom user" and a topbar "avatar menu" as separate elements; making both independently interactive would duplicate the same menu twice, so one was kept purely informational and the other functional — also sidesteps any avatar-button accessible-name mismatch by only ever labelling the one that has an aria-label.

**8. Status badges limited to one accent, distinguished by icon/shape**
① Active/Renewal-due/Expired badges all share the same neutral zinc chip style except Active, which gets the sole indigo tint; the three are told apart by `CheckCircle2`/`Clock`/`XCircle` icons, not by hue.
② `STATUS_ICON` map in `ui.tsx`; `StatusBadge` renders icon + label together, with color only reinforcing the "good" state.
③ The brief restricts the whole page to indigo as the one accent and requires status to never rely on color alone — introducing amber/red for "renewal due"/"expired" would have broken the single-accent budget, so icon shape carries the distinction instead.

**9. Vendor-table column widths and the mobile card fallback**
① `colgroup` percentages 28/11/17/14/30 (Vendor/Region/Status/Contract end/Contact) summing to exactly 100, plus a `sm:hidden` card-list rendering of the same rows below the `sm` breakpoint instead of letting the table scroll horizontally.
② Percentages were sized by eye against each column's actual content (two-line vendor/contact cells need more room than a short status chip) rather than raw character count, and padding is absorbed inside each `border-box` cell so no column overlap occurs.
③ The "desktop tables: no horizontal scrollbar" rule only covers desktop; at 390px a 5-column contact table has no honest fixed-width layout, so a semantically-equivalent stacked-card view was invented for mobile instead of forcing an overflow table.

**10. Vendor short codes as the box's permanent label**
① Each vendor gets a 3-letter code (NFC, ARC, BRL, CDP, DHG, EVM, FNW, GRB, HLW, IRW, JNP, KEY) shown under its box; full names/categories only appear in the tooltip, table and palette.
② Added as a `shortCode` field on `Vendor` in `data.ts`, chosen to be visually distinct and collision-free with existing real-world brand abbreviations.
③ A 12-column strip has no room for full vendor names without truncation or widening every column; a short code keeps each box at a comfortable 64px while staying legible, and doubles as the literal substring an avatar-style box button's `aria-label` must contain per the accessible-name rule.
