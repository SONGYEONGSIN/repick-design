import type { Metadata } from "next";
import RadiusExperience from "./radius-experience";

export const metadata: Metadata = {
  title: "Repick — Radius Matching",
  description:
    "Drag your search radius and watch listing counts, match scores, and verified sellers recalculate in real time.",
};

export default function Page() {
  return <RadiusExperience />;
}
