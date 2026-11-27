import type { Metadata } from "next";
import { LandingExperience } from "./LandingExperience";

export const metadata: Metadata = {
  title: "repick — see what your stuff is actually worth",
  description:
    "Pick a condition, tell repick what you paid, and get an instant trade-in credit — then see which verified listings it unlocks right now.",
};

export default function Page() {
  return <LandingExperience />;
}
