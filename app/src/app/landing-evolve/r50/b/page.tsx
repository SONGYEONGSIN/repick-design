import type { Metadata } from "next";
import { LandingExperience } from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — Pick two listings, let the math decide",
  description:
    "Compare any two repick listings side by side: a live diff table and a radar chart recompute match score, condition, price, sell speed and discount from the same two picks, every time.",
};

export default function Page() {
  return <LandingExperience />;
}
