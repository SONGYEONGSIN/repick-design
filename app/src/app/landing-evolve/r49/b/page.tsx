import type { Metadata } from "next";
import { LandingExperience } from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — scrub 12 weeks of the market before you list",
  description:
    "Drag a single playhead across the last 12 weeks of marketplace activity and watch matches found, average payout and items sold update live to that exact week.",
};

export default function Page() {
  return <LandingExperience />;
}
