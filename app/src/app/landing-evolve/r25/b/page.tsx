import type { Metadata } from "next";
import ConfidenceRingLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Authentication Confidence Ring",
  description:
    "Toggle the verification methods behind a real repick listing and watch the confidence ring — and its center percentage — recompute live.",
};

export default function Page() {
  return <ConfidenceRingLanding />;
}
