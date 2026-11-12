import type { Metadata } from "next";
import ConsoleClient from "./ConsoleClient";

export const metadata: Metadata = {
  title: "Trestle — Pipeline Reliability Console",
  description:
    "Trestle is a CI/CD build-health console that maps every pipeline run through a stage-by-stage process map, pinpointing exactly which stage is the current bottleneck and why.",
};

export default function Page() {
  return <ConsoleClient />;
}
