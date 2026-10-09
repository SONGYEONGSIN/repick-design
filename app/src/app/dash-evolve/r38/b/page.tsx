import type { Metadata } from "next";
import { VarianceDashboard } from "./variance-dashboard";

export const metadata: Metadata = {
  title: "Ledgerline — Variance Explorer",
  description:
    "A RevOps variance-intelligence dashboard whose detail pane is a root-cause decomposition tree: pick a KPI (New ARR shortfall, Expansion ARR shortfall, Churned ARR, Support SLA breach hours, Gross margin erosion) from a flat rail on the left, then drill through region/segment/reason-code branches — each always showing its value and share of its parent — independently of which KPI is selected.",
};

export default function Page() {
  return <VarianceDashboard />;
}
