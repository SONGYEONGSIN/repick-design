import type { Metadata } from "next";
import DashboardApp from "./dashboard-app";

export const metadata: Metadata = {
  title: "Openhour — Capacity Calendar",
  description: "Booked-capacity heatmap calendar for multi-location service teams.",
};

export default function Page() {
  return <DashboardApp />;
}
