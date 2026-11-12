import type { Metadata } from "next";
import { PortcallDashboard } from "./portcall-dashboard";

export const metadata: Metadata = {
  title: "Portcall — Vendor API Performance Scorecard",
  description:
    "A vendor-quality scorecard whose hero is one full-width response-latency box plot across every integrated API vendor, not a filter-rail-plus-detail-pane shell: a 24h/7d/30d segmented control recomputes the chart, the KPI strip and the independent vendor directory table at once, while every box always shows its median and outlier count as plain text. Hovering or tab-focusing a box opens an ephemeral five-number-summary tooltip that touches nothing else; clicking one instead pins that single vendor into its own summary card, leaving the KPI strip and the sortable, category-tabbed vendor table completely untouched. A ⌘K command palette jumps straight to any vendor.",
};

export default function Page() {
  return <PortcallDashboard />;
}
