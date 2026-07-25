import type { Metadata } from "next";
import LandingClient from "./ui";

export const metadata: Metadata = {
  title: "RE:PICK — Secondhand Matching Verified by an AI Match Accuracy Dial",
  description:
    "A circular dial fills in real time across five criteria — taste profile, size, budget, condition grade, and market price — to calculate your AI match score. Select any criterion to see the evidence instantly.",
};

export default function Page() {
  return <LandingClient />;
}
