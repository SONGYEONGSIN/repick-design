import type { Metadata } from "next";
import DistributionLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Comparable Sales Distribution",
  description:
    "Filter the comparison pool for a real repick listing and watch the sold-price distribution, and this listing's percentile inside it, recompute in place.",
};

export default function Page() {
  return <DistributionLanding />;
}
