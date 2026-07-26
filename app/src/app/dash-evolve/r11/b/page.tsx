import type { Metadata } from "next";
import AmberlineClient from "./AmberlineClient";

export const metadata: Metadata = {
  title: "Amberline — Revenue Bridge Cockpit",
  description:
    "Amberline is a finance-ops SaaS dashboard built around a hero ARR figure and a screen-owning revenue bridge (waterfall) chart tracing Starting ARR through New Business, Expansion, Reactivation, Contraction and Churn to Ending ARR — every bar always shows its own signed value, with a synced per-segment driver table and detail rail.",
};

export default function Page() {
  return <AmberlineClient />;
}
