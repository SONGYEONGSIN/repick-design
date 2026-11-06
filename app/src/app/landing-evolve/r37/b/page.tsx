import type { Metadata } from "next";
import LandingPage from "./LandingPage";

export const metadata: Metadata = {
  title: "repick — Inspect the checks. Then trust the score.",
  description:
    "Click through the four-step verification walk behind every Repick listing — AI photo scan, condition grading, authenticity check, listed — and build a real trust score from exactly the steps you've opened.",
};

export default function Page() {
  return <LandingPage />;
}
