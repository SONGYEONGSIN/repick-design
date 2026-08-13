import type { Metadata } from "next";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = {
  title: "Activity — Trestle",
  description: "Trestle is a deployment operations console built around a live build/deploy activity stream, flanked by environment health and active alerts.",
};

export default function Page() {
  return <DashboardClient />;
}
