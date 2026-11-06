import type { Metadata } from "next";
import DashboardApp from "./dashboard-app";

export const metadata: Metadata = {
  title: "Orgline — Org Structure",
  description: "Department-to-team headcount and open-role proportions, explored as a drill-down sunburst.",
};

export default function Page() {
  return <DashboardApp />;
}
