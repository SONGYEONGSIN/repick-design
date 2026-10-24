import type { Metadata } from "next";
import FluxgraphClient from "./fluxgraph-client";

export const metadata: Metadata = {
  title: "Fluxgraph — Service Dependency Graph",
  description:
    "Fluxgraph is a service-dependency topology console for a streaming platform's backend: a full-width, deterministically laid-out network graph of 16 services and 28 calls between them, grouped either by infrastructure tier or by traffic volume. The graph is a pointer-only visual layer — every node and edge is also a real, keyboard-operable row in the sortable, filterable adjacency table below, which opens a dismissible inspector popover and never changes when the independent incident timeline updates.",
};

export default function Page() {
  return <FluxgraphClient />;
}
