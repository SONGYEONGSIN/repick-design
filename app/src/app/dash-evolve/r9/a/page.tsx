import type { Metadata } from "next";
import RedlineClient from "./RedlineClient";

export const metadata: Metadata = {
  title: "Redline — SLO & Error-Budget Console",
  description:
    "Redline is an SRE ops console whose screen is dominated by a cockpit-style cluster of large circular gauges (uptime SLO, error-budget burn, p99 latency, request volume, error rate) rendered as arc-fill + needle indicators against target and danger-zone thresholds. Selecting a service or an incident syncs the gauge cluster, a sortable/filterable incident table, and a detail panel with a per-service error-budget trend.",
};

export default function Page() {
  return <RedlineClient />;
}
