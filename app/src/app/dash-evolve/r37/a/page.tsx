import type { Metadata } from "next";
import { IncidentConsole } from "./incident-console";

export const metadata: Metadata = {
  title: "Northbound — Incident Response Console",
  description:
    "An infrastructure ops console whose hero is one full-width anomaly timeline, not a side rail or small-multiples wall: a metric selector swaps between error rate, latency p99 and request volume, a 24h/7d/30d toggle recomputes which points and anomalies are shown, and every flagged anomaly's timestamp and magnitude stay visible on the chart without interaction. Hovering or tab-focusing a marker opens an ephemeral popover with more detail; a sortable anomalies table and an independent, always-static incident-response runbook checklist sit below, intentionally unsynced to whatever is selected above.",
};

export default function Page() {
  return <IncidentConsole />;
}
