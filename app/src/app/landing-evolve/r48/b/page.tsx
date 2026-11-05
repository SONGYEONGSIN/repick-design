import type { Metadata } from "next";
import { LandingExperience } from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — know your payout before you choose how to sell",
  description:
    "Run the Trade Path Simulator: pick a sell method, then a second step, and watch the payout, days-to-cash and path tree update live before you commit to anything.",
};

export default function Page() {
  return <LandingExperience />;
}
