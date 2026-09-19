import type { Metadata } from "next";
import GradingTimelineLanding from "./client";

export const metadata: Metadata = {
  title: "The Grading Timeline — repick",
  description:
    "Scrub one real listing through repick's five-step grading pipeline and watch the evidence, defect map, certification checklist, and price recompute together.",
};

export default function Page() {
  return <GradingTimelineLanding />;
}
