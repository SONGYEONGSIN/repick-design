import type { Metadata } from "next";
import RouteConsole from "./client";

export const metadata: Metadata = {
  title: "Routeline — Network delivery performance",
  description:
    "Regional delivery-ops console for Haulwell Logistics: a hex-grid zone map reads on-time rate, delay incidents, or revenue at risk across 12 service zones, with a sortable zone rail and a per-zone detail panel.",
};

export default function Page() {
  return <RouteConsole />;
}
