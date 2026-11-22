import type { Metadata } from "next";
import Client from "./Client";

export const metadata: Metadata = {
  title: "repick — Trade in by the box, not the item",
  description:
    "Count your trade-in up or down and watch repick's Bulk Trade-In Tier Counter recompute your average payout, running total, and tier live.",
};

export default function Page() {
  return <Client />;
}
