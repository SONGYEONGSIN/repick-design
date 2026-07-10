import type { Metadata } from "next";
import DashboardClient from "./dashboard-client";

export const metadata: Metadata = {
  title: "Prophecy Deck | CASSANDRA",
  description:
    "CASSANDRA — a phosphor-CRT probability terminal for pricing, tracking and calibrating the futures your team has staked a claim on.",
};

export default function Dashboard() {
  return <DashboardClient />;
}
