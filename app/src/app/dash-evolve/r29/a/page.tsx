import type { Metadata } from "next";
import { DashboardApp } from "./DashboardApp";

export const metadata: Metadata = {
  title: "Lotwise — Pricing Desk",
  description: "Internal pricing and liquidation desk for tracking lot prices, bids, and floor adjustments.",
};

export default function Page() {
  return <DashboardApp />;
}
