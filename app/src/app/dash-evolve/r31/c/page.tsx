import type { Metadata } from "next";
import DashboardApp from "./dashboard-app";

export const metadata: Metadata = {
  title: "Traceline — Root-Cause Explorer",
  description: "Support tickets decomposed by category, subcategory and root cause, with counts always visible.",
};

export default function Page() {
  return <DashboardApp />;
}
