import type { Metadata } from "next";
import { DashboardApp } from "./dashboard-app";

export const metadata: Metadata = {
  title: "Census — Ticket triage",
  description: "A support-ticket triage console reading open-backlog composition from a 100-cell waffle grid.",
};

export default function Page() {
  return <DashboardApp />;
}
