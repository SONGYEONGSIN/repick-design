import type { Metadata } from "next";
import FlowLanding from "./client";

export const metadata: Metadata = {
  title: "repick — The Route",
  description:
    "Trace one real repick search from 1,842 scanned listings through AI matching, condition grading and seller verification to the shortlist that reaches you — and drag the grade filter to watch it re-route live.",
};

export default function Page() {
  return <FlowLanding />;
}
