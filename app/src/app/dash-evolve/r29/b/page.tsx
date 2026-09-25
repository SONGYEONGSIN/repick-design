import type { Metadata } from "next";
import DashboardApp from "./dashboard-app";

export const metadata: Metadata = {
  title: "Warden — Live Feed",
  description: "Access-anomaly and trust & safety monitoring console for platform admin teams.",
};

export default function Page() {
  return <DashboardApp />;
}
