import type { Metadata } from "next";
import { DashboardShell } from "./dashboard-shell";

export const metadata: Metadata = {
  title: "Portway — Buyer Activation Funnel",
  description: "A five-stage conversion funnel console tracking buyers from first visit to repeat purchase.",
};

export default function Page() {
  return <DashboardShell />;
}
