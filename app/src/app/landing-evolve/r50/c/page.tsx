import type { Metadata } from "next";
import { LandingExperience } from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — The AI-verified resale marketplace",
  description:
    "repick scores every listing's AI match percentage, condition grade, and seller trust before a buyer ever opens the photos.",
};

export default function Page() {
  return <LandingExperience />;
}
