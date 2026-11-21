import type { Metadata } from "next";
import DashboardApp from "./DashboardApp";

export const metadata: Metadata = {
  title: "Meshline — Service Topology",
  description: "Live service-dependency graph correlating error rate, throughput, and latency across a commerce platform's microservices.",
};

export default function Page() {
  return <DashboardApp />;
}
