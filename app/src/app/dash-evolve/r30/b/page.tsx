import type { Metadata } from "next";
import DashboardApp from "./dashboard-app";

export const metadata: Metadata = {
  title: "Corvid — Command Board",
  description: "Incident command board for platform and SRE teams — triage, mitigate and resolve production incidents.",
};

export default function Page() {
  return <DashboardApp />;
}
