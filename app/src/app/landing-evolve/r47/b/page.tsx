import type { Metadata } from "next";
import { LandingExperience } from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — a checkpoint deck for every listing",
  description:
    "Confirm or flag four fixed verification checkpoints — condition, authenticity, damage, function — and watch the trust score and resale price range update live.",
};

export default function Page() {
  return <LandingExperience />;
}
