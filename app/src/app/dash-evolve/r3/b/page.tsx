import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Waylight — Live fleet map",
  description: "Real-time vehicle positions, delivery zones, and dispatch history for last-mile fleet operations.",
};

export default function Page() {
  return <DashboardClient />;
}
