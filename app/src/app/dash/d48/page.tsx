import type { Metadata } from "next";
import ParhelionClient from "./ParhelionClient";

export const metadata: Metadata = {
  title: "Parhelion — Infrastructure Comparison Console",
  description:
    "Parhelion is a twin-region infrastructure health console: two mirrored panels compare uptime, latency, error rate, and cost side by side for any two regions, with a shared keyboard-accessible crosshair, a metric-focus toggle that drives the delta summary, and a sortable service-level comparison table below the fold.",
};

export default function Page() {
  return <ParhelionClient />;
}
