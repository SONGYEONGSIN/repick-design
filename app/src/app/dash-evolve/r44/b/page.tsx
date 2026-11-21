import type { Metadata } from "next";
import { Dashboard } from "./Dashboard";

export const metadata: Metadata = {
  title: "Loadline — Shipping calendar",
  description:
    "Loadline is the fulfillment command center for multi-warehouse shipping teams, built around a daily shipping calendar that reads actual-vs-target the instant you look at it.",
};

export default function Page() {
  return <Dashboard />;
}
