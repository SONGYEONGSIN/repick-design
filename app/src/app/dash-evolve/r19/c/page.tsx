import type { Metadata } from "next";
import ThresholdClient from "./ThresholdClient";

export const metadata: Metadata = {
  title: "Threshold — Support SLA Console",
  description:
    "Threshold is a support SLA console built around one number: the SLA compliance rate for the selected window and priority queue. A trend chart carries it through the window with a real crosshair, a compact bullet shows it against target, an at-a-glance panel derives resolved/breach/response figures from the same window, and a priority-queue breakdown is the page's single selection surface — focusing a tier recomputes the headline, the chart, the stats and the ticket list together.",
};

export default function Page() {
  return <ThresholdClient />;
}
