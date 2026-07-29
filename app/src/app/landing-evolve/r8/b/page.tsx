import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "repick — Counterweight",
  description:
    "repick weighs a generic secondhand listing against its AI match on the same beam — match score, condition grade, verified seller, and real discount all visible at rest. Re-weigh style, budget, and condition yourself and watch it recompute live.",
};

export default function Page() {
  return <LandingClient />;
}
