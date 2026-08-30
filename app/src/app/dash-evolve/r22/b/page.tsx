import type { Metadata } from "next";
import { NodelineClient } from "./NodelineClient";

export const metadata: Metadata = {
  title: "Nodeline — Service Dependency Graph",
  description: "Console for tracing service-to-service call topology, latency and error rate across a platform's dependency graph.",
};

export default function Page() {
  return <NodelineClient />;
}
