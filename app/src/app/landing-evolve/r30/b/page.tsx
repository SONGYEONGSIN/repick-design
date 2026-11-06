import type { Metadata } from "next";
import { LandingExperience } from "./components/LandingExperience";

export const metadata: Metadata = {
  title: "Repick — Every category, audited the same way",
  description:
    "A live trust-tier breakdown by category: switch between sneakers, bags, outerwear, electronics and watches and watch the real inventory mix redraw itself.",
};

export default function Page() {
  return <LandingExperience />;
}
