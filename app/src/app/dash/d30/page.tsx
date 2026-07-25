import type { Metadata } from "next";
import { DashboardClient } from "./dashboard-client";

export const metadata: Metadata = {
  title: "TIMESLOT — Bookings",
  description: "Team meeting scheduling dashboard",
};

export default function Dashboard() {
  return <DashboardClient />;
}
