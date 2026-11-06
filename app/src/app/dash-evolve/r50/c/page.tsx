import type { Metadata } from "next";
import { FlaglineDashboard } from "./flagline-dashboard";

export const metadata: Metadata = {
  title: "Flagline — Feature Flags & Experimentation Console",
  description:
    "Flagline is a feature-flag and experimentation console: a rail-free bento dashboard with a slope chart comparing each active experiment's guardrail metric before and after it shipped.",
};

export default function Page() {
  return <FlaglineDashboard />;
}
