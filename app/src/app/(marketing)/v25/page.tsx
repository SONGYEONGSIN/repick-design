import type { Metadata } from "next";
import InspectionStackLanding from "./client";

export const metadata: Metadata = {
  title: "repick — Exploded Inspection Stack",
  description:
    "Switch on any combination of five inspection layers over one real repick listing and watch the trust score and resale price recompute in place.",
};

export default function Page() {
  return <InspectionStackLanding />;
}
