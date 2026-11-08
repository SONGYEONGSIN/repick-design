import type { Metadata } from "next";
import LandingExperience from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — Rank what matters, see it matched",
  description:
    "Drag five matching criteria into your own priority order and watch repick's AI match scoring, condition grading, and seller verification re-rank every listing live.",
};

export default function Page() {
  return <LandingExperience />;
}
