import type { Metadata } from "next";
import { DashboardShell } from "./DashboardShell";

export const metadata: Metadata = {
  title: "Ridgehaul — Operations Overview",
  description:
    "Ridgehaul is an IT & customer-support ops console. Its home dashboard centers on a per-team ticket resolution-time box plot alongside a live ticket activity feed.",
};

export default function Page() {
  return <DashboardShell />;
}
