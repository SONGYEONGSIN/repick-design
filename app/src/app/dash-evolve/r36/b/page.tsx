import type { Metadata } from "next";
import MeshwireClient from "./meshwire-client";

export const metadata: Metadata = {
  title: "Meshwire — Service Topology Console",
  description:
    "Meshwire is a service-dependency topology console: a full-width, deterministically laid-out network graph of 17 services and 26 calls between them, grouped either by infrastructure tier or by latency. Click a service to open a dismissible inspector popover anchored to it, hover or focus any node or edge for its exact metrics, and use the independent incident timeline and the fully sortable, filterable adjacency table below — the graph's required accessible fallback — which never change when a node is selected.",
};

export default function Page() {
  return <MeshwireClient />;
}
