import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "Growth — Arcway",
  description: "Arcway's visitor-to-retained conversion funnel, with per-stage cohort drop-off detail.",
};

export default function Page() {
  return <DashboardClient />;
}
