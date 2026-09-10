import type { Metadata } from "next";
import ProvenanceScrubberLanding from "./client";

export const metadata: Metadata = {
  title: "Provenance Scrubber — repick",
  description:
    "Drag a real timeline scrubber through one coat's actual five-stage record — listed, inspected, graded, authenticated, priced — and watch its proof badges appear exactly when they were real.",
};

export default function Page() {
  return <ProvenanceScrubberLanding />;
}
