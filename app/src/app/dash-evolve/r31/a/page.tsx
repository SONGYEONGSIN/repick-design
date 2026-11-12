import type { Metadata } from "next";
import DashboardApp from "./dashboard-app";

export const metadata: Metadata = {
  title: "Tolerance — Supplier Quality Bench",
  description: "Incoming-inspection defect-rate distribution across approved vendors, read as a box-plot bench.",
};

export default function Page() {
  return <DashboardApp />;
}
