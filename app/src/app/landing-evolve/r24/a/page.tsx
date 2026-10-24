import type { Metadata } from "next";
import PriceBridgeLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Price Bridge",
  description:
    "Toggle any combination of repick's AI pricing adjustments and watch the price bridge — from naive list price to your price — recompute bar by bar, live.",
};

export default function Page() {
  return <PriceBridgeLanding />;
}
