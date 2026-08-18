import type { Metadata } from "next";
import Dashboard from "./Dashboard";

export const metadata: Metadata = {
  title: "Stockloom — Inventory grid",
  description:
    "Stockloom is a multi-warehouse inventory console built around a single dense, sortable SKU grid with embedded stock-trend sparklines and live health status.",
};

/**
 * auto-dash-r16 / candidate b — grid-dominant archetype.
 *
 * The dense data grid IS the page: a slim toolbar (search, status chips, warehouse select,
 * group-by, density, column-visibility) sits directly above one full-width table that owns the
 * rest of the viewport. Deliberately not a hero-KPI-row-first layout (the header is a single
 * inline `dl` stat strip, not four cards), not master-detail (no persistent side rail — the
 * row-click overlay is a transient slide-over), not a 3-pane market layout, not calendar/board,
 * and not "hero row + one big standalone chart" — the only visualizations are the sparklines
 * living inside the grid's own cells.
 */
export default function Page() {
  return <Dashboard />;
}
