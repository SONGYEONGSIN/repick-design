import type { Metadata } from "next";
import HandoffTimelineLanding from "./client";

export const metadata: Metadata = {
  title: "Handoff Timeline — Repick",
  description:
    "Scrub through a real listing's four-stage chain of custody — seller submission, AI grading, human verification, buyer match — and watch its trust score recompute at every stage.",
};

export default function Page() {
  return <HandoffTimelineLanding />;
}
