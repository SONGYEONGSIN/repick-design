import type { Metadata } from "next";
import { DashboardShell } from "./components/DashboardShell";

export const metadata: Metadata = {
  title: "Waypoint — Project Dashboard",
  description:
    "Waypoint is a team collaboration dashboard for tracking project progress, team workload, and upcoming deadlines in one screen.",
};

export default function Page() {
  return <DashboardShell />;
}
