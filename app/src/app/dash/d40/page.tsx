import type { Metadata } from "next";
import CadenceClient from "./CadenceClient";

export const metadata: Metadata = {
  title: "Cadence — Release & Reliability Console",
  description:
    "Cadence is a DORA-metrics release health console built around a GitHub-style deploy calendar heatmap — daily deploy counts, incident markers, and a sortable deploy log, with headline deploy frequency, change failure rate, MTTR, and lead-time stats.",
};

export default function Page() {
  return <CadenceClient />;
}
