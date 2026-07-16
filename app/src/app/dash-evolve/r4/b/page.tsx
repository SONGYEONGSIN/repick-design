import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Wardline — Service health",
  description: "Real-time uptime, latency and error-rate monitoring across every service, with incident detail on demand.",
};

export default function Page() {
  return <DashboardClient />;
}
