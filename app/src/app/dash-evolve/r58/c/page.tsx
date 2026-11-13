import type { Metadata } from "next";
import { PulsebandClient } from "./PulsebandClient";

export const metadata: Metadata = {
  title: "Pulseband — Latency",
  description:
    "Pulseband is an API reliability console. Its home view centers on a single dominant latency-distribution histogram with always-visible p50/p95/p99 markers and a sortable endpoint table.",
};

export default function Page() {
  return <PulsebandClient />;
}
