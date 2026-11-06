import type { Metadata } from "next";
import DashboardShell from "./DashboardShell";

export const metadata: Metadata = {
  title: "Deployment schedule — Trestle",
  description: "Trestle's deployment schedule: a live Gantt of every install, retrofit, and audit job across field crews, with an at-risk queue alongside it.",
};

export default function Page() {
  return <DashboardShell />;
}
