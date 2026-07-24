import type { Metadata } from "next";
import FlowClient from "./FlowClient";

export const metadata: Metadata = {
  title: "Currents — Revenue Attribution Flow",
  description:
    "Currents is a revenue-operations dashboard for B2B SaaS growth teams. A dominant Sankey-style flow diagram traces new accounts from 5 acquisition channels through 4 signup plan tiers to 4 90-day outcomes, with ribbon width encoding customer count or new MRR (toggleable) and full flow conservation at every node. Selecting a node or ribbon syncs a detail panel and a sortable, filterable flow-path table.",
};

export default function Page() {
  return <FlowClient />;
}
