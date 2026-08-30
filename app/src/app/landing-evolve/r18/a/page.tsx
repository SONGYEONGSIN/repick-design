import type { Metadata } from "next";
import GradingTimelineLanding from "./client";

export const metadata: Metadata = {
  title: "Repick — Every grade is a paper trail",
  description:
    "Scrub through the five stages a real Repick item passed through — Received, Inspected, Graded, Verified, Listed — and see the evidence, checklist and price change live.",
};

export default function Page() {
  return <GradingTimelineLanding />;
}
