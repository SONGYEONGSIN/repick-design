import type { Metadata } from "next";
import FluxgateClient from "./fluxgate-client";

export const metadata: Metadata = {
  title: "Fluxgate — Live Edge Traffic Console",
  description:
    "Fluxgate is an edge-gateway traffic console. Its hero is a continuously-scrolling streaming area chart of requests per second, with a real pause/resume control, a keyboard-accessible scrub-to-inspect crosshair, and a persistent throughput KPI that never lives only inside the chart. Below it, an independent, sortable and filterable incident log — never synced to the chart's selection.",
};

export default function Page() {
  return <FluxgateClient />;
}
