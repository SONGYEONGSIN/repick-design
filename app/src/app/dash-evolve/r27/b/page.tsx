import type { Metadata } from "next";
import FathomClient from "./FathomClient";

export const metadata: Metadata = {
  title: "Fathom — Cloud Spend Root Cause",
  description:
    "Fathom is a cloud-cost root-cause console for SRE and FinOps teams. A decomposition tree is the page's main stage, drilling from region through service and resource type down to SKU with every visible node printing its own dollar value and its share of its parent; a standalone Top Movers leaderboard below keeps its own sort and expand state and never reacts to what is selected in the tree.",
};

export default function Page() {
  return <FathomClient />;
}
