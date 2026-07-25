import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Overview — Conduit",
  description: "Dashboard for workflow automation pipeline execution status",
};

export default function Page() {
  return <DashboardClient />;
}
