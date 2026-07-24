import type { Metadata } from "next";
import FunnelClient from "./FunnelClient";

export const metadata: Metadata = {
  title: "Chute — Checkout Funnel Intelligence",
  description:
    "Chute is a checkout-funnel analytics dashboard for e-commerce teams. A dominant 7-stage stepped funnel (Site Visit through Order Placed) shows session counts tapering stage by stage, with drop-off counts and top abandonment reasons surfaced between each band. Selecting a stage syncs a detail panel with a 12-week trend and a sortable, device-filterable traffic-segment table.",
};

export default function Page() {
  return <FunnelClient />;
}
