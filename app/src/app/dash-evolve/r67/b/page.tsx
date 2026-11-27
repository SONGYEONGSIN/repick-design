import type { Metadata } from "next";
import TendrilClient from "./TendrilClient";

export const metadata: Metadata = {
  title: "Tendril — Supply chain dependency graph",
  description:
    "Tendril is a vendor dependency & concentration-risk console for supply chain teams. Its home view is a radial node-link graph of sites, tier-1 vendors and tier-2 sub-suppliers, paired with a sortable adjacency-list table, a node inspector, and an independent spend-by-category strip.",
};

export default function Page() {
  return <TendrilClient />;
}
