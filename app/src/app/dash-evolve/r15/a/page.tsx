import type { Metadata } from "next";
import TopologyClient from "./topology-client";

export const metadata: Metadata = {
  title: "Nodal — Service Topology Console",
  description:
    "Nodal is a service-mesh observability console built around a generative, layered dependency graph of 15 services — with a mandatory accessible adjacency-table fallback, node selection synced across the graph/table/detail panel, a command palette, and keyboard-accessible crosshair latency charts.",
};

export default function Page() {
  return <TopologyClient />;
}
