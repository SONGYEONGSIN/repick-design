import type { Metadata } from "next";
import LandingExperience from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — Sell smarter with AI-verified resale",
  description:
    "Model how splitting your inventory across categories changes your projected payout, backed by repick's AI match scoring, condition grading, and seller verification.",
};

export default function Page() {
  return <LandingExperience />;
}
