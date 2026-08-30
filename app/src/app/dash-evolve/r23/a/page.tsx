import type { Metadata } from "next";
import DashboardClient from "./client";

export const metadata: Metadata = {
  title: "Trust Console — Disputes Queue",
  description: "Internal returns and disputes triage console for repick's trust & safety desk.",
};

export default function Page() {
  return <DashboardClient />;
}
